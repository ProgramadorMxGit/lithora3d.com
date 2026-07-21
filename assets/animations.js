/* ============================================================
   HELIX 3D — Animation System (GSAP + ScrollTrigger)
   All advanced motion logic. Defensive, reduced-motion aware.
   ============================================================ */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // Una pestaña suspendida o un CDN incompleto no debe dejar el hero invisible.
    // La secuencia normal termina antes; este seguro solo limpia opacidad residual.
    window.setTimeout(ensureHeroVisible, 2000);

    // Defensive init: if GSAP or ScrollTrigger failed to load, keep everything visible.
    if (!window.gsap || !window.ScrollTrigger) {
      initReducedMotionFallback();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    gsap.matchMedia()
      // Desktop, motion allowed — full experience
      .add('(prefers-reduced-motion: no-preference) and (min-width: 1024px)', () => {
        initHeroTimeline();
        initHeaderScrollState();
        initScrollReveals();
        initFeatureCardAnimations();
        initButtonInteractions();
        initImageParallax();
        initMobileMenuAnimation();
        initActiveNavLinks();
      })
      // Mobile / tablet, motion allowed — simplified subset (no parallax, no pointer reaction)
      .add('(prefers-reduced-motion: no-preference) and (max-width: 1023px)', () => {
        initHeroTimeline({ mobile: true });
        initHeaderScrollState();
        initScrollReveals({ mobile: true });
        initFeatureCardAnimations({ mobile: true });
        initMobileMenuAnimation();
        initActiveNavLinks();
      })
      // Reduced motion — no entrance animation, but the header still docks
      // (instantly, since CSS transitions are disabled under reduced motion)
      // and the mobile menu toggle stays fully functional.
      .add('(prefers-reduced-motion: reduce)', () => {
        initReducedMotionFallback();
        initHeaderScrollState();
        initMobileMenuAnimation();
      });
  });

  function ensureHeroVisible() {
    document.querySelectorAll('header, .hero-badge, #hero h1 span, .hero-copy, .hero-cta a, .hero__background').forEach(function (element) {
      element.style.removeProperty('opacity');
      element.style.removeProperty('visibility');
    });
  }

  // ---- Function stubs (bodies implemented in tasks 4.2–4.10) ----
  function initReducedMotionFallback() {
    var selectors = [
      'header',
      '.hero-badge',
      '#hero h1 span',
      '.hero-copy',
      '.hero-cta a',
      '.hero__background',
      '.feature-card',
      '[data-animate]'
    ];
    var els = [];
    selectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) { els.push(el); });
    });

    // #mobile-menu is intentionally omitted: it is visible-by-default in HTML and
    // its show/hide is managed by initMobileMenuAnimation() (task 4.10).
    if (window.gsap && typeof gsap.set === 'function') {
      if (els.length) {
        gsap.set(els, { clearProps: 'all', opacity: 1 });
      }
    } else {
      // GSAP not available — reset inline styles directly, never throw.
      els.forEach(function (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.willChange = 'auto';
      });
    }
  }
  function initHeroTimeline(opts = {}) {
    // Motion tokens are defined in assets/styles.css (single source of truth).
    // GSAP's CustomEase plugin is not loaded, so its named eases are used as
    // practical equivalents of the cubic-bezier motion tokens.
    var css = getComputedStyle(document.documentElement);
    var easeEmph = 'power3.out';   // approximates --motion-ease-emphasized
    var easeStd  = 'power2.out';   // approximates --motion-ease-standard
    var m = opts.mobile ? 0.6 : 1; // translateY multiplier on mobile (Req 9.16)
    var d = opts.mobile ? 0.7 : 1; // duration multiplier on mobile (Req 9.16)

    // Single coordinated timeline, plays once on load. gsap.from() means the END
    // state is the element's natural visible state, so content is never left
    // hidden if JS fails (Req 9.4). Only opacity/transform are touched (Req 9.5).
    var tl = gsap.timeline({
      defaults: { ease: easeStd },
      onComplete: function () {
        // Release will-change on every animated hero element (Req 9.18).
        gsap.set(['header', '.hero-badge', '#hero h1 span', '.hero-copy', '.hero-cta a', '.hero__background'],
                 { clearProps: 'will-change' });
      }
    });

    // Overlapping, start-relative positions (seconds) so the sequence feels
    // continuous and coordinated rather than strictly sequential (design: Hero
    // Entrance Timeline). Visual order is preserved — header -> badge -> h1 spans
    // (stagger) -> paragraph -> CTAs (stagger) — with the hero image entering in
    // parallel with the h1 (position 0.3 * d). Desktop total ≈ 1.4s, inside the
    // 1.1–1.6s target. Positions/durations scale with `d` on mobile (Req 9.16).
    tl.from('.hero__background', { opacity: 0, scale: 1.025, duration: 0.9 * d, ease: easeEmph, transformOrigin: 'center right' }, 0)
      .from('header',        { opacity: 0, y: -12 * m, duration: 0.5 * d }, 0)
      .from('.hero-badge',   { opacity: 0, y: 14 * m,  duration: 0.5 * d }, 0.15 * d)
      .from('#hero h1 span', { opacity: 0, y: 24 * m,  duration: 0.6 * d, ease: easeEmph, stagger: 0.09 * d }, 0.3 * d)
      .from('.hero-copy',    { opacity: 0, y: 18 * m,  duration: 0.55 * d }, 0.6 * d)
      .from('.hero-cta a',   { opacity: 0, y: 16 * m,  duration: 0.5 * d, stagger: 0.08 * d }, 0.8 * d);

    return tl;
  }
  function initHeaderScrollState() {
    var header = document.querySelector('.site-header') || document.querySelector('header');
    if (!header) return; // Defensive: no header, nothing to toggle.

    // Suppress the floating→docked morph on the very first paint so a page
    // reloaded already-scrolled snaps straight to the docked state (Req: keep
    // state on reload) instead of animating in from the floating pill.
    header.classList.add('header-preload');

    // Hysteresis: enter the docked state above ENTER, only return to the
    // floating glass below EXIT. The dead-band prevents flicker when the user
    // hovers around the threshold (Req: evitar parpadeos, histéresis 48/8).
    var ENTER = 48, EXIT = 8;
    var scrolled = false;
    var ticking = false;
    function apply() {
      var y = window.scrollY || window.pageYOffset || 0;
      if (!scrolled && y > ENTER) {
        scrolled = true;
        header.classList.add('is-scrolled');
      } else if (scrolled && y <= EXIT) {
        scrolled = false;
        header.classList.remove('is-scrolled');
      }
      ticking = false;
    }

    // Correct the initial state before transitions are enabled (preload active).
    apply();

    // Re-enable transitions after the initial state has painted (double rAF).
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        header.classList.remove('header-preload');
      });
    });

    // Bind the single passive scroll listener only once, even if this init
    // re-runs when gsap.matchMedia swaps contexts on resize (Req: no duplicate
    // listeners, no scrub — a class toggle drives the CSS transition).
    if (initHeaderScrollState._bound) return;
    initHeaderScrollState._bound = true;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(apply);
      }
    }, { passive: true });
  }
  function initScrollReveals(opts = {}) {
    // Reusable data-animate reveal system. Auto-detects every [data-animate]
    // element and applies a GSAP entrance keyed to the attribute value. Using
    // gsap.from() means the END state is the natural visible DOM state, so
    // content is never left hidden if GSAP fails (Req 9.4). Only opacity and
    // transform are animated (Req 9.5, 9.13). No-op when no targets exist.
    var els = document.querySelectorAll('[data-animate]');
    if (!els.length) return;
    var m = opts.mobile ? 0.6 : 1; // translateY multiplier on mobile (Req 9.16)

    els.forEach(function (el) {
      var type = el.getAttribute('data-animate');
      // Per-element overrides in ms (design defaults: 650 / 0 / 100), to seconds.
      var duration = (parseInt(el.getAttribute('data-duration'), 10) || 650) / 1000;
      var delay = (parseInt(el.getAttribute('data-delay'), 10) || 0) / 1000;
      var stagger = (parseInt(el.getAttribute('data-stagger'), 10) || 100) / 1000;

      var fromVars = { opacity: 0 };
      var targets = el;

      if (type === 'fade-up') {
        fromVars.y = 24 * m;
      } else if (type === 'fade-in') {
        // opacity only
      } else if (type === 'image-reveal') {
        fromVars.scale = 1.04;
      } else if (type === 'stagger') {
        targets = el.children; // stagger animates the parent's direct children
        fromVars.y = 24 * m;
      }

      fromVars.duration = duration;
      fromVars.delay = delay;
      fromVars.ease = 'power3.out'; // approximates --motion-ease-emphasized
      if (type === 'stagger') fromVars.stagger = stagger;
      // Every reveal fires at most once per load (Req 9.7).
      fromVars.scrollTrigger = { trigger: el, start: 'top 88%', once: true };
      // Release will-change when the entrance completes (Req 9.18).
      fromVars.onComplete = function () { gsap.set(targets, { clearProps: 'will-change' }); };

      gsap.from(targets, fromVars);
    });
  }
  function initFeatureCardAnimations(opts = {}) {
    var cards = document.querySelectorAll('.feature-card');
    if (!cards.length) return; // Defensive: no cards, nothing to animate.
    var m = opts.mobile ? 0.54 : 1; // 26px * 0.54 ≈ 14px translateY on mobile (Req 9.16)

    // (1) Staggered scroll reveal — fires once (Req 9.7). gsap.from() means the
    // natural visible DOM state is the END state, so cards stay visible if JS
    // fails (Req 9.4). Only opacity + transform animate here (Req 9.5, 9.13).
    gsap.from(cards, {
      opacity: 0,
      y: 26 * m,
      duration: 0.6,
      ease: 'power3.out', // approximates --motion-ease-emphasized
      stagger: 0.1,
      scrollTrigger: { trigger: cards[0], start: 'top 88%', once: true },
      onComplete: function () { gsap.set(cards, { clearProps: 'will-change' }); } // Req 9.18
    });

    // (2) Desktop-only hover — skip on mobile/touch (Req 9.11). Elevation via
    // transform y (-4px max), box-shadow + border-color shift toward accent,
    // plus icon micro-move. No width/height/margin/padding touched (Req 9.5, 9.13).
    if (opts.mobile) return;

    cards.forEach(function (card) {
      var icon = card.querySelector('.feature-icon');
      card.addEventListener('mouseenter', function () {
        gsap.to(card, { y: -4, boxShadow: '0 14px 30px rgba(15,23,42,0.10)', borderColor: 'rgba(3,105,161,0.55)', duration: 0.2, ease: 'power2.out' });
        if (icon) gsap.to(icon, { y: -3, duration: 0.2, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', function () {
        gsap.to(card, { y: 0, boxShadow: '0 8px 24px rgba(15,23,42,0.035)', borderColor: 'rgba(148,163,184,0.26)', duration: 0.2, ease: 'power2.out' });
        if (icon) gsap.to(icon, { y: 0, duration: 0.2, ease: 'power2.out' });
      });
    });
  }
  function initButtonInteractions() {
    // Hero CTA microinteractions. Targets the two hero <a> buttons (.btn-primary,
    // .btn-secondary). The header "Contáctanos" CTA relies on a CSS-only sheen and
    // is intentionally excluded. Only transform (y, scale) is animated — no
    // width/height/margin/padding/box-shadow — so there is zero CLS (Req 9.5, 9.13).
    // No preventDefault anywhere: the <a href> navigation stays instant (Req 9.14),
    // and the CSS focus-visible ring is never touched.
    var btns = document.querySelectorAll('.btn-primary, .btn-secondary');
    if (!btns.length) return; // Defensive: no CTAs, nothing to wire.

    btns.forEach(function (btn) {
      // Hover: lift 2px (design spec: translateY -2px, 220ms, ease-standard).
      btn.addEventListener('mouseenter', function () {
        gsap.to(btn, { y: -2, duration: 0.22, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', function () {
        gsap.to(btn, { y: 0, duration: 0.22, ease: 'power2.out' });
      });
      // Active/press: scale 0.98 (~100ms). Reset on release AND if the pointer
      // leaves while still pressed, so a button never sticks in the pressed state.
      btn.addEventListener('mousedown', function () {
        gsap.to(btn, { scale: 0.98, duration: 0.1, ease: 'power2.out' });
      });
      function release() { gsap.to(btn, { scale: 1, duration: 0.1, ease: 'power2.out' }); }
      btn.addEventListener('mouseup', release);
      btn.addEventListener('mouseleave', release);
      // Keyboard parity: neutralize any leftover transform on blur so the
      // focus-visible ring always sits on an untransformed button.
      btn.addEventListener('blur', function () { gsap.to(btn, { y: 0, scale: 1, duration: 0.1 }); });
    });
  }
  function initImageParallax() {
    // Called only from the desktop matchMedia branch (min-width:1024px +
    // no-preference), so parallax is already disabled on mobile/touch and under
    // reduced motion (Req 9.11, 9.16) — no extra media guard needed here. Still
    // guard for missing elements so this never throws (Req 9.17).
    var bg = document.querySelector('.hero__background');
    var hero = document.querySelector('#hero');
    if (!bg || !hero) return;

    // Subtle vertical parallax: the image drifts up to -16px as the hero scrolls
    // out of view. transform:translateY() only — no top/left/position changes —
    // so there is zero layout recalculation / CLS (Req 9.13). Max drift 16px sits
    // within the 12–18px design cap (Req 9.20). scrub:true links motion smoothly
    // to scroll; ease:'none' keeps the scrub linear. No rotation/scale/deform.
    gsap.fromTo(bg,
      { y: 0 },
      {
        y: -14,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  }
  function initImagePointerReaction() {
    // Intentionally disabled: with fondo_web.png now a full-bleed hero background,
    // a pointer-driven tilt could reveal empty edges and conflict with the scrubbed
    // parallax transform. Left as a no-op to preserve the module's function map.
  }

  function initActiveNavLinks() {
    // IntersectionObserver highlights nav links when their section is in view.
    // Uses a single observer; fires on every scroll via threshold.
    var sectionIds = ['features','servicios','proceso','materiales','aplicaciones','casos-exito','nosotros','recursos','cotizar'];
    var navLinks = document.querySelectorAll('.site-header nav a[href], .site-header nav button.dropdown-btn');
    if (!navLinks.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function(link) {
          link.classList.remove('nav-active');
        });
        // Match nav link to section id
        var navMap = {
          'servicios': 'Servicios',
          'proceso': 'Recursos',
          'materiales': 'Materiales',
          'casos-exito': 'Casos de éxito',
          'nosotros': 'Sobre nosotros',
          'recursos': 'Recursos',
          'cotizar': 'Servicios'
        };
        // Highlight the matching nav item
        navLinks.forEach(function(link) {
          var href = link.getAttribute('href') || '';
          if (href === '#' + id) link.classList.add('nav-active');
          if (link.textContent && link.textContent.trim() === navMap[id]) link.classList.add('nav-active');
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sectionIds.forEach(function(id) {
      var el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }
  function initMobileMenuAnimation() {
    // The menu ships visible in HTML for JS-off progressive enhancement; here JS
    // takes over and hides it. autoAlpha animates opacity AND toggles visibility,
    // so the closed menu leaves the a11y tree and is not keyboard-focusable. Only
    // opacity + transform (y) are touched — zero layout recalc / CLS (Req 9.5, 9.13).
    var btn = document.querySelector('#menu-btn');
    var menu = document.querySelector('#mobile-menu');
    if (!btn || !menu) return; // Defensive: nothing to wire, never throw (Req 9.17).

    var isOpen = false;

    // Take over from the progressive-enhancement default: hide via GSAP.
    gsap.set(menu, { autoAlpha: 0, y: -8 });

    // Open 260ms ease-standard; aria-expanded reflects state on every change (Req 7.4).
    function openMenu() {
      isOpen = true;
      btn.setAttribute('aria-expanded', 'true');
      gsap.to(menu, { autoAlpha: 1, y: 0, duration: 0.26, ease: 'power2.out' });
    }
    // Close 180ms — power1.in approximates --motion-ease-exit (accelerating out).
    function closeMenu() {
      isOpen = false;
      btn.setAttribute('aria-expanded', 'false');
      gsap.to(menu, { autoAlpha: 0, y: -8, duration: 0.18, ease: 'power1.in' });
    }
    function toggleMenu() { isOpen ? closeMenu() : openMenu(); }

    // No preventDefault: the hamburger responds to click/tap instantly (Req 9.14, 6.4).
    btn.addEventListener('click', toggleMenu);

    // Escape closes the menu and returns focus to the button (Req 7.4 keyboard).
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) { closeMenu(); btn.focus(); }
    });

    // Selecting any nav link inside the menu closes it (design: Mobile Menu).
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { if (isOpen) closeMenu(); });
    });
  }

})();
