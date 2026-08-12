(() => {
  const video = document.querySelector('.quote-process-video');
  if (!video) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Bajo 880 px el panel decorativo esta oculto por CSS. Antes el atributo autoplay
  // ignoraba preload="none" y el navegador se bajaba el mp4 igualmente: 1.2 MB que
  // ningun visitante de movil llegaba a ver. La fuente solo se conecta por encima
  // de ese umbral, y con preload="none" no se descarga un byte hasta que hay play().
  const anchoSuficiente = window.matchMedia('(min-width: 881px)');
  let conectado = false;

  const conectarFuente = () => {
    if (conectado || !anchoSuficiente.matches) return;
    const src = video.dataset.videoSrc;
    if (!src) return;
    const source = document.createElement('source');
    source.src = src;
    source.type = 'video/mp4';
    video.appendChild(source);
    video.load();
    conectado = true;
  };

  // Estado inicial calculado a mano: no se depende de que el IntersectionObserver
  // entregue su primera entrada, que en contextos sin composicion puede no llegar.
  const enPantalla = () => {
    const r = video.getBoundingClientRect();
    if (!r.height || !r.width) return false;
    const alto = window.innerHeight || document.documentElement.clientHeight;
    const visible = Math.min(r.bottom, alto) - Math.max(r.top, 0);
    return visible / r.height >= .12;
  };

  let isVisible = enPantalla();

  const syncPlayback = () => {
    if (!anchoSuficiente.matches) { video.pause(); return; }
    const shouldPause = document.hidden || !isVisible || reducedMotion.matches;
    if (shouldPause) {
      video.pause();
      return;
    }
    conectarFuente();
    video.play().catch(() => {
      // Decorativo: si el navegador bloquea la reproduccion, queda el poster.
    });
  };

  const observer = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting && entry.intersectionRatio >= .12;
    syncPlayback();
  }, { threshold: [0, .12] });

  observer.observe(video);
  document.addEventListener('visibilitychange', syncPlayback);
  reducedMotion.addEventListener?.('change', syncPlayback);
  anchoSuficiente.addEventListener?.('change', syncPlayback);
  window.addEventListener('scroll', () => { isVisible = enPantalla(); syncPlayback(); }, { passive: true });
  video.addEventListener('canplay', syncPlayback, { once: true });

  syncPlayback();
})();
