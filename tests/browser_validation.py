"""Validacion local reproducible con Chrome headless y CDP, sin dependencias web."""

from __future__ import annotations

import base64
import contextlib
import http.server
import json
import os
import shutil
import socket
import subprocess
import tempfile
import threading
import time
import urllib.request
from pathlib import Path

import websocket

ROOT = Path(__file__).resolve().parents[1]
CHROME = Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")
AUDIT_DIR = ROOT / "audits" / "2026-07-20"


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


class QuietServer(http.server.ThreadingHTTPServer):
    def handle_error(self, *_args):
        pass


class CDP:
    def __init__(self, ws_url: str):
        self.ws = websocket.create_connection(ws_url, timeout=10, origin="http://127.0.0.1")
        self.counter = 0
        self.events = []

    def call(self, method: str, params=None):
        self.counter += 1
        message_id = self.counter
        self.ws.send(json.dumps({"id": message_id, "method": method, "params": params or {}}))
        while True:
            message = json.loads(self.ws.recv())
            if message.get("id") == message_id:
                if "error" in message:
                    raise RuntimeError(f"{method}: {message['error']}")
                return message.get("result", {})
            self.events.append(message)

    def evaluate(self, expression: str):
        result = self.call("Runtime.evaluate", {"expression": expression, "awaitPromise": True, "returnByValue": True})
        value = result.get("result", {})
        if value.get("subtype") == "error":
            raise AssertionError(value.get("description", expression))
        return value.get("value")

    def wait_for(self, expression: str, timeout=5):
        deadline = time.time() + timeout
        while time.time() < deadline:
            if self.evaluate(expression):
                return True
            time.sleep(0.05)
        raise AssertionError(f"Timeout: {expression}")

    def navigate(self, url: str):
        self.call("Page.navigate", {"url": url})
        self.wait_for("document.readyState === 'complete'", 10)
        time.sleep(0.25)


def free_port():
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        return sock.getsockname()[1]


def assert_true(condition, message):
    if not condition:
        raise AssertionError(message)


def run():
    assert_true(CHROME.exists(), f"Chrome local no encontrado: {CHROME}")
    AUDIT_DIR.mkdir(parents=True, exist_ok=True)
    server_port = free_port()
    debug_port = free_port()
    handler = lambda *args, **kwargs: QuietHandler(*args, directory=str(ROOT), **kwargs)
    server = QuietServer(("127.0.0.1", server_port), handler)
    server_thread = threading.Thread(target=server.serve_forever, daemon=True)
    server_thread.start()
    profile = tempfile.mkdtemp(prefix="lithora-chrome-")
    chrome_log = AUDIT_DIR / "chrome-stderr.log"
    chrome_stream = chrome_log.open("w", encoding="utf-8")
    process = subprocess.Popen([
        str(CHROME), "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
        "--remote-allow-origins=*", f"--remote-debugging-port={debug_port}", f"--user-data-dir={profile}",
        "--window-size=1440,1000", "about:blank",
    ], stdout=subprocess.DEVNULL, stderr=chrome_stream)
    cdp = None
    checks = []
    observations = {}

    def check(name, condition):
        assert_true(condition, name)
        checks.append(name)

    try:
        version_url = f"http://127.0.0.1:{debug_port}/json/list"
        targets = None
        for _ in range(100):
            try:
                targets = json.load(urllib.request.urlopen(version_url, timeout=1))
                if targets:
                    break
            except Exception:
                time.sleep(0.05)
        assert_true(targets, "Chrome CDP no inicio")
        page_target = next((target for target in targets if target.get("type") == "page" and target.get("url") == "about:blank"), None)
        if page_target is None:
            page_target = next((target for target in targets if target.get("type") == "page" and not str(target.get("url", "")).startswith("chrome-extension://")), None)
        assert_true(page_target, f"No se encontro target de pagina: {targets}")
        cdp = CDP(page_target["webSocketDebuggerUrl"])
        for domain in ("Page", "Runtime", "Log", "Network", "Performance"):
            cdp.call(f"{domain}.enable")
        cdp.call("Accessibility.enable")
        cdp.call("Page.addScriptToEvaluateOnNewDocument", {"source": """
          window.dataLayer = [];
          window.__ecoEvents = [];
          window.__perf = { cls: 0, lcp: 0, events: [] };
          const names = ['ecosystem_section_view','ecosystem_category_select','ecosystem_niche_open','ecosystem_application_click','ecosystem_quote_click','ecosystem_quote_start','ecosystem_quote_complete','ecosystem_origin_context','ecosystem_attachment_use'];
          names.forEach(name => addEventListener(name, event => window.__ecoEvents.push({name, detail:event.detail})));
          addEventListener('DOMContentLoaded', () => {
            try { new PerformanceObserver(list => list.getEntries().forEach(e => { if (!e.hadRecentInput) window.__perf.cls += e.value; })).observe({type:'layout-shift', buffered:true}); } catch {}
            try { new PerformanceObserver(list => list.getEntries().forEach(e => window.__perf.lcp = Math.max(window.__perf.lcp, e.startTime))).observe({type:'largest-contentful-paint', buffered:true}); } catch {}
            try { new PerformanceObserver(list => list.getEntries().forEach(e => window.__perf.events.push(e.duration))).observe({type:'event', durationThreshold:16, buffered:true}); } catch {}
          });
        """})
        route = f"http://127.0.0.1:{server_port}/ecosistema-soluciones/"
        cdp.navigate(route)
        try:
            cdp.wait_for("!!document.querySelector('.ecosystem-page.js-enhanced')")
        except AssertionError as error:
            diagnostic = cdp.evaluate("import('./ecosistema.js').then(()=>({href:location.href,body:document.body?.className,module:'ok'})).catch(error=>({href:location.href,body:document.body?.className,module:String(error),stack:error.stack}))")
            raise AssertionError(f"{error}; diagnostic={diagnostic}; events={cdp.events[-10:]}") from error

        check("carga directa /ecosistema-soluciones/", cdp.evaluate("location.pathname === '/ecosistema-soluciones/'"))
        check("header y footer integrados", cdp.evaluate("!!document.querySelector('header.site-header') && !!document.querySelector('footer.ecosystem-footer')"))
        headings = cdp.evaluate("[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(e=>Number(e.tagName[1]))")
        check("H1 unico", headings.count(1) == 1)
        check("jerarquia de encabezados sin saltos", all(headings[i] <= headings[i-1] + 1 for i in range(1, len(headings))))
        ax_nodes = cdp.call("Accessibility.getFullAXTree").get("nodes", [])
        ax_roles = [node.get("role", {}).get("value") for node in ax_nodes if not node.get("ignored")]
        check("arbol accesible expone main navegacion y headings", all(role in ax_roles for role in ("main", "navigation", "heading")))
        check("cuatro categorias", cdp.evaluate("new Set([...document.querySelectorAll('[data-category-control]')].map(e=>e.dataset.category)).size === 4"))
        check("filtrado inicial publicado", cdp.evaluate("[...document.querySelectorAll('[data-niche-card]')].filter(e=>!e.hidden).length === 2"))

        cdp.evaluate("document.querySelector('[data-category-control][data-category=industria]').click()")
        cdp.wait_for("location.hash === '#industria'")
        check("navegacion por hash", cdp.evaluate("[...document.querySelectorAll('[data-niche-card]:not([hidden])')].every(e=>e.dataset.category==='industria')"))
        cdp.evaluate("history.back()")
        cdp.wait_for("location.hash === '#negocios'")
        check("historial atras", cdp.evaluate("document.querySelector('[data-category-control][data-category=negocios]').getAttribute('aria-current') === 'true'"))
        cdp.evaluate("history.forward()")
        cdp.wait_for("location.hash === '#industria'")
        check("historial adelante", cdp.evaluate("document.querySelector('[data-category-control][data-category=industria]').getAttribute('aria-current') === 'true'"))

        cdp.evaluate("document.querySelector('#nicho-transporte .niche-open').focus()")
        cdp.call("Input.dispatchKeyEvent", {"type": "keyDown", "key": " ", "code": "Space", "windowsVirtualKeyCode": 32})
        cdp.call("Input.dispatchKeyEvent", {"type": "keyUp", "key": " ", "code": "Space", "windowsVirtualKeyCode": 32})
        cdp.wait_for("!document.querySelector('#detail-transporte').hidden")
        check("apertura por teclado y aria-expanded", cdp.evaluate("document.querySelector('#nicho-transporte .niche-open').getAttribute('aria-expanded') === 'true'"))
        cdp.evaluate("document.querySelector('#nicho-dentistas .niche-open').click()")
        check("un detalle abierto por categoria", cdp.evaluate("[...document.querySelectorAll('[data-niche-card][data-category=industria] .niche-detail')].filter(e=>!e.hidden).length === 1"))
        cdp.evaluate("document.querySelector('#nicho-dentistas .detail-close').click()")
        check("restauracion de foco al cerrar", cdp.evaluate("document.activeElement === document.querySelector('#nicho-dentistas .niche-open')"))

        cdp.call("Emulation.setTouchEmulationEnabled", {"enabled": True, "maxTouchPoints": 5})
        cdp.evaluate("document.querySelector('#nicho-transporte .niche-open').click()")
        check("interaccion tactil", cdp.evaluate("!document.querySelector('#detail-transporte').hidden"))
        check("galeria conceptual de Transporte", cdp.evaluate("document.querySelectorAll('#detail-transporte .detail-gallery figure').length===4 && [...document.querySelectorAll('#detail-transporte .detail-gallery img')].every(img=>img.getAttribute('src').includes('../assets/transporte/') && img.alt.includes('Ejemplo conceptual'))"))
        cdp.call("Emulation.setTouchEmulationEnabled", {"enabled": False})

        cdp.evaluate("document.querySelector('#nicho-transporte .niche-image-wrap img').removeAttribute('srcset'); document.querySelector('#nicho-transporte .niche-image-wrap img').src='/assets/no-existe.webp'")
        cdp.wait_for("document.querySelector('#nicho-transporte .niche-image-wrap').classList.contains('image-error')")
        check("estado de imagen fallida", cdp.evaluate("document.querySelector('#nicho-transporte .image-badge').textContent === 'Imagen no disponible'"))
        check("etiquetas conceptuales", cdp.evaluate("[...document.querySelectorAll('.image-badge')].filter(e=>e.textContent.includes('Ejemplo conceptual')).length >= 2"))

        cdp.evaluate("document.querySelector('[data-category-control][data-category=negocios]').click()")
        cdp.evaluate("document.querySelector('#nicho-barberias [data-application]').click(); document.querySelector('#nicho-barberias [data-quote-trigger]').click()")
        check("contexto de cotizacion preservado", cdp.evaluate("document.querySelector('#quote-category').value==='Negocios' && document.querySelector('#quote-niche').value.includes('Barberías') && !!document.querySelector('#quote-application').value && document.querySelector('#quote-origin').value.includes('/ecosistema-soluciones/') && document.querySelector('#quote-description').value.includes('Barberías') && document.querySelector('[data-whatsapp-direct]').href.includes('text=')"))
        check("canal WhatsApp configurado y disponible", cdp.evaluate("document.querySelector('#ecosystem-quote-form').dataset.state==='available' && document.querySelector('#ecosystem-quote-form').dataset.quoteDestination==='https://wa.me/528331080178' && document.querySelector('[data-form-status]').textContent.includes('WhatsApp está disponible')"))
        check("sin exito analitico falso", cdp.evaluate("!window.__ecoEvents.some(e=>e.name==='ecosystem_quote_complete')"))
        check("eventos CustomEvent y dataLayer", cdp.evaluate("window.__ecoEvents.length > 0 && window.dataLayer.length === window.__ecoEvents.length"))

        cdp.evaluate("window.LithoraEcosystemUI.setGridState('loading')")
        check("estado loading de galeria", cdp.evaluate("document.querySelector('#niche-grid').getAttribute('aria-busy')==='true' && !document.querySelector('[data-empty-state]').hidden"))
        cdp.evaluate("window.LithoraEcosystemUI.setGridState('error')")
        check("estado error y reintento de galeria", cdp.evaluate("!document.querySelector('[data-grid-retry]').hidden && document.querySelector('[data-grid-feedback-text]').textContent.includes('reintentar')"))
        cdp.evaluate("document.querySelector('[data-grid-retry]').click()")
        cdp.evaluate("document.querySelector('#nicho-barberias .niche-open').click(); window.LithoraEcosystemUI.setDetailState('barberias','loading')")
        check("estado loading de detalle", cdp.evaluate("document.querySelector('#detail-barberias').getAttribute('aria-busy')==='true'"))
        cdp.evaluate("window.LithoraEcosystemUI.setDetailState('barberias','error')")
        check("estado error y reintento de detalle", cdp.evaluate("document.querySelector('#detail-barberias .detail-state').textContent.includes('Reintentar')"))
        cdp.evaluate("document.querySelector('#detail-barberias .detail-state button').click()")
        check("galeria conceptual de Barberías", cdp.evaluate("!document.querySelector('#detail-barberias .detail-gallery').hidden && document.querySelectorAll('#detail-barberias .detail-gallery figure').length===4 && [...document.querySelectorAll('#detail-barberias .detail-gallery img')].every(img=>img.getAttribute('src').includes('../assets/barber/') && img.alt.includes('Ejemplo conceptual'))"))

        cdp.call("Emulation.setEmulatedMedia", {"features": [{"name": "prefers-reduced-motion", "value": "reduce"}]})
        check("prefers-reduced-motion", cdp.evaluate("matchMedia('(prefers-reduced-motion: reduce)').matches"))

        viewports = [(1440, 1000, 'desktop'), (1024, 768, 'laptop'), (768, 1024, 'tablet'), (390, 844, 'mobile'), (320, 568, 'small')]
        for width, height, label in viewports:
            cdp.call("Emulation.setDeviceMetricsOverride", {"width": width, "height": height, "deviceScaleFactor": 1, "mobile": width < 768})
            cdp.evaluate("scrollTo(0,0)")
            time.sleep(0.1)
            check(f"sin overflow {label}", cdp.evaluate("document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1"))
            screenshot = cdp.call("Page.captureScreenshot", {"format": "png", "captureBeyondViewport": False})["data"]
            (AUDIT_DIR / f"ecosystem-{label}.png").write_bytes(base64.b64decode(screenshot))
        cdp.call("Emulation.setDeviceMetricsOverride", {"width": 1440, "height": 1000, "deviceScaleFactor": 1, "mobile": False})
        cdp.evaluate("document.querySelector('[data-category-control][data-category=industria]').click(); document.querySelector('#nicho-escuelas .niche-open').click(); document.querySelector('#nicho-escuelas').scrollIntoView({block:'start'})")
        check("Escuelas reemplaza Farmacias con imagen y galeria", cdp.evaluate("!document.querySelector('#nicho-farmacias') && document.querySelector('#nicho-escuelas').dataset.category === 'industria' && document.querySelector('#nicho-escuelas > .niche-image-wrap img').getAttribute('src').endsWith('/escuela/escuela-identificador-lapiz.webp') && document.querySelectorAll('#detail-escuelas .detail-gallery figure').length===4"))
        full_desktop = cdp.call("Page.captureScreenshot", {"format": "png", "captureBeyondViewport": True})["data"]
        (AUDIT_DIR / "ecosystem-desktop-full-detail.png").write_bytes(base64.b64decode(full_desktop))
        cdp.call("Emulation.setDeviceMetricsOverride", {"width": 390, "height": 844, "deviceScaleFactor": 1, "mobile": True})
        full_mobile = cdp.call("Page.captureScreenshot", {"format": "png", "captureBeyondViewport": True})["data"]
        (AUDIT_DIR / "ecosystem-mobile-full-detail.png").write_bytes(base64.b64decode(full_mobile))
        cdp.call("Emulation.setDeviceMetricsOverride", {"width": 1280, "height": 900, "deviceScaleFactor": 2, "mobile": False})
        check("zoom 200 sin overflow", cdp.evaluate("document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1"))
        check("contenido largo sin truncado CSS", cdp.evaluate("[...document.querySelectorAll('[data-niche-card]')].every(e=>getComputedStyle(e).textOverflow !== 'ellipsis')"))

        perf = cdp.evaluate("({navigation: performance.getEntriesByType('navigation')[0]?.duration || 0, ...window.__perf, inp: window.__perf.events.length ? Math.max(...window.__perf.events) : null})")
        observations.update(perf or {})
        observations["consoleErrors"] = [event for event in cdp.events if event.get("method") in ("Runtime.exceptionThrown", "Log.entryAdded") and (event.get("params", {}).get("entry", {}).get("level") == "error" or event.get("method") == "Runtime.exceptionThrown") and "no-existe.webp" not in json.dumps(event)]
        check("consola sin errores relevantes", len(observations["consoleErrors"]) == 0)
        check("CLS dentro de objetivo", (perf or {}).get("cls", 1) < 0.1)

        cdp.call("Network.emulateNetworkConditions", {"offline": False, "latency": 150, "downloadThroughput": 200000, "uploadThroughput": 75000, "connectionType": "cellular3g"})
        cdp.navigate(route)
        cdp.wait_for("!!document.querySelector('.ecosystem-page.js-enhanced')", 12)
        check("primera interaccion util en conexion lenta", cdp.evaluate("!!document.querySelector('.primary-button') && !document.querySelector('.primary-button').hidden"))
        cdp.call("Network.emulateNetworkConditions", {"offline": False, "latency": 0, "downloadThroughput": -1, "uploadThroughput": -1, "connectionType": "none"})

        cdp.navigate(f"http://127.0.0.1:{server_port}/")
        cdp.call("Emulation.setDeviceMetricsOverride", {"width": 1440, "height": 1000, "deviceScaleFactor": 1, "mobile": False})
        check("enlace desde home al ecosistema", cdp.evaluate("!!document.querySelector('a[href=\"/ecosistema-soluciones/\"]')"))
        check("nueve nichos visibles en la home", cdp.evaluate("document.querySelectorAll('[data-home-niche]').length === 9 && !document.querySelector('[data-home-niche=papelerias]') && !document.querySelector('[data-home-niche=joyerias]') && !document.querySelector('[data-home-niche=farmacias]') && !!document.querySelector('[data-home-niche=boda]') && !!document.querySelector('[data-home-niche=escuelas]')"))
        cdp.evaluate("document.querySelector('#ideas-impresas').scrollIntoView({block:'start'})")
        cdp.wait_for("document.querySelector('#ideas-impresas img').complete && document.querySelector('#ideas-impresas img').naturalWidth > 0")
        check("Ideas impresas visible, conceptual y conectada", cdp.evaluate("!!document.querySelector('#ideas-impresas') && document.querySelector('#ideas-impresas').offsetHeight > 0 && document.querySelector('#ideas-impresas img').complete && document.querySelector('#ideas-impresas img').naturalWidth > 0 && document.querySelector('#ideas-impresas .idea-showcase__badge').textContent.includes('Ejemplo conceptual') && !!document.querySelector('#ideas-impresas a[href^=\"https://wa.me/528331080178?text=\"]')"))
        check("bloques internos y redundantes fuera de la portada visible", cdp.evaluate("['materiales','aplicaciones','casos-exito'].every(id => document.querySelector('#' + id).hidden && document.querySelector('#' + id).offsetHeight === 0) && [...document.querySelectorAll('section[hidden] h2')].some(h => h.textContent.includes('Encuentra la página adecuada'))"))
        time.sleep(0.25)
        ideas_desktop = cdp.call("Page.captureScreenshot", {"format": "png", "captureBeyondViewport": False})["data"]
        (AUDIT_DIR / "home-ideas-desktop.png").write_bytes(base64.b64decode(ideas_desktop))
        cdp.evaluate("document.querySelector('#nichos').scrollIntoView({block:'start'})")
        time.sleep(0.25)
        home_desktop = cdp.call("Page.captureScreenshot", {"format": "png", "captureBeyondViewport": False})["data"]
        (AUDIT_DIR / "home-niches-desktop.png").write_bytes(base64.b64decode(home_desktop))
        cdp.call("Emulation.setDeviceMetricsOverride", {"width": 390, "height": 844, "deviceScaleFactor": 1, "mobile": True})
        cdp.evaluate("document.querySelector('#nichos').scrollIntoView({block:'start'})")
        check("nichos de home sin overflow movil", cdp.evaluate("document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1"))
        home_mobile = cdp.call("Page.captureScreenshot", {"format": "png", "captureBeyondViewport": False})["data"]
        (AUDIT_DIR / "home-niches-mobile.png").write_bytes(base64.b64decode(home_mobile))
        cdp.evaluate("document.querySelector('#ideas-impresas').scrollIntoView({block:'start'})")
        check("Ideas impresas sin overflow móvil", cdp.evaluate("document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1 && document.querySelector('#ideas-impresas img').getBoundingClientRect().width <= document.documentElement.clientWidth"))
        ideas_mobile = cdp.call("Page.captureScreenshot", {"format": "png", "captureBeyondViewport": False})["data"]
        (AUDIT_DIR / "home-ideas-mobile.png").write_bytes(base64.b64decode(ideas_mobile))
        cdp.call("Emulation.setDeviceMetricsOverride", {"width": 1440, "height": 1000, "deviceScaleFactor": 1, "mobile": False})
        cdp.evaluate("document.querySelector('[data-home-niche=dentistas]').click()")
        cdp.wait_for("location.pathname === '/ecosistema-soluciones/' && document.querySelector('#detail-dentistas') && !document.querySelector('#detail-dentistas').hidden", 10)
        check("deep link de home abre detalle de nicho", cdp.evaluate("location.search.includes('nicho=dentistas') && document.querySelector('#nicho-dentistas').dataset.category === 'industria'"))
        cdp.navigate(f"http://127.0.0.1:{server_port}/")
        cdp.evaluate("document.querySelector('a[href=\"/ecosistema-soluciones/\"]').click()")
        cdp.wait_for("location.pathname === '/ecosistema-soluciones/'", 10)
        check("escenario home a nicho", cdp.evaluate("!!document.querySelector('[data-niche-card]')"))

        cdp.call("Emulation.setScriptExecutionDisabled", {"value": True})
        cdp.navigate(route)
        check("fallback sin JavaScript legible", cdp.evaluate("document.querySelectorAll('[data-niche-card]').length === 9 && [...document.querySelectorAll('[data-niche-card]')].every(e=>!e.hidden)"))
        check("anclas sin JavaScript", cdp.evaluate("[...document.querySelectorAll('[data-category-control]')].every(e=>e.tagName==='A' && e.hash)"))
        cdp.call("Emulation.setScriptExecutionDisabled", {"value": False})

        report = {"url": route, "browser": "Chrome local via CDP fallback", "checks": checks, "count": len(checks), "observations": observations, "result": "pass"}
        (AUDIT_DIR / "browser-validation.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
        print(json.dumps({"result": "pass", "checks": len(checks), "observations": observations}, ensure_ascii=False))
    finally:
        if cdp:
            with contextlib.suppress(Exception):
                cdp.call("Browser.close")
            with contextlib.suppress(Exception):
                cdp.ws.close()
        with contextlib.suppress(Exception):
            process.terminate()
            process.wait(timeout=5)
        chrome_stream.close()
        server.shutdown()
        server.server_close()
        shutil.rmtree(profile, ignore_errors=True)


if __name__ == "__main__":
    run()
