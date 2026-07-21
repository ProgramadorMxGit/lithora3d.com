(() => {
  'use strict';

  const body = document.body;
  const page = body?.dataset.motionPage;
  const root = document.documentElement;
  if (!page || root.dataset.lithoraMotionReady === 'true') return;

  root.dataset.lithoraMotionReady = 'true';
  body.classList.add('motion-enhanced');

  const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const touchQuery = matchMedia('(pointer: coarse)');
  const compactQuery = matchMedia('(max-width: 767px)');
  const listeners = [];
  const activeAnimations = new Set();
  const pointerRects = new WeakMap();
  const revealedWidgets = new Set();
  let observer = null;
  let resizeFrame = 0;
  let pointerFrame = 0;
  let pendingPointer = null;
  let activePointerTarget = null;

  const levels = Object.freeze({
    A: new Set(['PRI-W03','PRI-W04','PRI-W05','PRI-W06','PRO-W03','PRO-W04','PRO-W05','PRO-W06','MAT-W03','MAT-W04','MAT-W05','SOL-W02','SOL-W03','SOL-W05','SOL-W09','SOL-W13','SOL-W14','SOL-W18','SOL-W20']),
    B: new Set(['PRI-W07','PRI-W08','PRO-W07','MAT-W06','MAT-W07','SOL-W01','SOL-W06','SOL-W08','SOL-W10','SOL-W12','SOL-W15','SOL-W16','SOL-W21']),
    C: new Set(['PRI-W01','PRI-W02','PRO-W01','PRO-W02','MAT-W01','MAT-W02','SOL-W04','SOL-W07','SOL-W11','SOL-W19']),
    D: new Set(['SOL-W17','SOL-W22'])
  });

  const debug = window.LithoraMotionDebug = {
    initialized: true,
    version: 'premium-widget-motion',
    page,
    reducedMotion: reducedQuery.matches,
    touch: touchQuery.matches,
    observers: 0,
    listeners: 0,
    activeAnimations: 0,
    scrollTriggers: 0,
    revealedGroups: 0,
    revealedWidgets: 0,
    widgetContracts: 0,
    duplicateEventsPrevented: 0,
    cleaned: false
  };

  const compact = () => compactQuery.matches || touchQuery.matches;
  const maxNodes = () => compact() ? 5 : 8;
  const canAnimate = (element) => !reducedQuery.matches && typeof element?.animate === 'function';
  const listen = (target, type, handler, options) => {
    target.addEventListener(type, handler, options);
    listeners.push(() => target.removeEventListener(type, handler, options));
    debug.listeners = listeners.length;
  };
  const finishAnimation = (animation) => {
    activeAnimations.delete(animation);
    debug.activeAnimations = activeAnimations.size;
  };
  const play = (element, keyframes, options = {}) => {
    if (!canAnimate(element)) return null;
    const animation = element.animate(keyframes, {
      duration: 420,
      easing: 'cubic-bezier(.16,1,.3,1)',
      fill: 'none',
      ...options
    });
    activeAnimations.add(animation);
    debug.activeAnimations = activeAnimations.size;
    animation.addEventListener('finish', () => finishAnimation(animation), { once: true });
    animation.addEventListener('cancel', () => finishAnimation(animation), { once: true });
    return animation;
  };
  const batch = (elements, variant = 'up', options = {}) => {
    const list = [...elements].filter(Boolean).slice(0, maxNodes());
    const distance = compact() ? Math.min(options.distance || 8, 8) : Math.min(options.distance || 14, 20);
    const stagger = reducedQuery.matches ? 0 : compact() ? Math.min(options.stagger || 28, 35) : Math.min(options.stagger || 45, 65);
    const transform = variant === 'left' ? `translate3d(${-distance}px,0,0)`
      : variant === 'right' ? `translate3d(${distance}px,0,0)`
        : variant === 'layer' ? `translate3d(0,${Math.min(distance, 6)}px,0) scale(.994)`
          : `translate3d(0,${distance}px,0)`;
    list.forEach((element, index) => play(element, [
      { opacity: .72, transform },
      { opacity: 1, transform: 'translate3d(0,0,0) scale(1)' }
    ], { duration: options.duration || 420, delay: (options.delay || 0) + index * stagger }));
  };

  const markStable = (widget) => {
    widget.dataset.motionState = 'stable';
    widget.classList.add('is-motion-visible', 'is-assembled');
  };
  const widgetParts = (widget, selector) => widget.querySelectorAll(selector);
  const revealWidget = (widget) => {
    if (!widget || widget.hidden || revealedWidgets.has(widget)) return;
    const id = widget.dataset.motionWidget;
    if (!id) return;
    revealedWidgets.add(widget);
    widget.dataset.motionState = 'assembling';
    widget.classList.add('is-motion-visible');

    if (levels.D.has(id) || /-W0[12]$/.test(id) && id !== 'SOL-W02') {
      markStable(widget);
    } else if (/-(W03)$/.test(id)) {
      widget.classList.add('motion-rule');
      batch(widgetParts(widget, ':scope > span, :scope > p, :scope > div'), page === 'prototype' ? 'left' : 'up', { distance: 8, stagger: 50 });
    } else if (/-W04$/.test(id)) {
      batch(widgetParts(widget, ':scope > ul > li, :scope > p'), 'layer', { distance: 6, stagger: 45 });
    } else if (id === 'PRI-W05') {
      batch(widgetParts(widget, 'article'), 'left', { distance: 12, stagger: 45, duration: 460 });
    } else if (id === 'PRI-W06') {
      batch(widgetParts(widget, 'article'), 'up', { distance: 8, stagger: 50 });
    } else if (id === 'PRO-W05') {
      batch(widgetParts(widget, 'article'), 'right', { distance: 10, stagger: 60, duration: 520 });
    } else if (id === 'PRO-W06') {
      batch(widgetParts(widget, 'article'), 'layer', { distance: 6, stagger: 35, duration: 460 });
    } else if (id === 'MAT-W05') {
      batch(widgetParts(widget, 'article'), 'layer', { distance: 6, stagger: 45, duration: 480 });
    } else if (id === 'SOL-W02') {
      batch(widgetParts(widget, '.eyebrow, .hero-lead, .hero-actions, .hero-note'), 'up', { distance: 8, stagger: 50 });
    } else if (id === 'SOL-W03') {
      batch(widgetParts(widget, '.orbit-core, .orbit-ring, .orbit-label'), 'layer', { distance: 4, stagger: 55, duration: 520 });
    } else if (id === 'SOL-W05') {
      batch(widgetParts(widget, '.map-core, .map-lines, .map-category'), 'layer', { distance: 6, stagger: 55, duration: 520 });
    } else if (id === 'SOL-W09') {
      batch(widgetParts(widget, '.niche-card:not([hidden])'), 'up', { distance: 4, stagger: 35, duration: 280 });
    } else if (id === 'SOL-W14') {
      batch(widgetParts(widget, 'figure'), 'layer', { distance: 4, stagger: 40, duration: 340 });
    } else if (id === 'SOL-W18') {
      batch(widgetParts(widget, 'li'), 'right', { distance: 8, stagger: 55, duration: 420 });
    } else if (id === 'SOL-W20') {
      batch(widgetParts(widget, 'label, input, textarea, .file-field, .form-submit'), 'up', { distance: 4, stagger: 24, duration: 340 });
    } else {
      const children = widget.matches('section') ? widgetParts(widget, '.section-eyebrow, .eyebrow, h2, article, .grid > div, a') : [widget];
      batch(children, 'up', { distance: 8, stagger: 35 });
    }
    markStable(widget);
    debug.revealedGroups += 1;
    debug.revealedWidgets = revealedWidgets.size;
    observer?.unobserve(widget);
  };

  const observableWidgets = () => [...document.querySelectorAll('[data-motion-widget]')].filter((widget) => {
    const id = widget.dataset.motionWidget;
    if (!id || levels.B.has(id) || levels.D.has(id) || widget.closest('[hidden]')) return false;
    return !widget.parentElement?.closest(`[data-motion-widget="${id}"]`);
  });
  const setupObserver = () => {
    const widgets = observableWidgets();
    debug.widgetContracts = new Set([...document.querySelectorAll('[data-motion-widget]')].map((item) => item.dataset.motionWidget)).size;
    if (reducedQuery.matches || !('IntersectionObserver' in window)) {
      widgets.forEach(markStable);
      return;
    }
    observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) revealWidget(entry.target);
    }), { rootMargin: '0px 0px -10% 0px', threshold: .08 });
    debug.observers = 1;
    widgets.forEach((widget) => observer.observe(widget));
  };

  const animateCategoryChange = (event) => {
    if (page !== 'solutions') return;
    const grid = document.querySelector('[data-motion-widget="SOL-W09"]');
    if (grid) {
      revealedWidgets.delete(grid);
      revealWidget(grid);
    }
    (event.detail?.cards || []).forEach((card) => card.dataset.motionState = 'stable');
  };
  const animateDetail = (event) => {
    if (page !== 'solutions') return;
    const detail = event.detail?.detail;
    if (!detail) return;
    detail.style.setProperty('--detail-origin', `${event.detail?.originPercent ?? 50}%`);
    revealedWidgets.delete(detail);
    if (canAnimate(detail)) play(detail, [
      { opacity: .74, transform: compact() ? 'translate3d(0,8px,0)' : 'translate3d(0,-8px,0) scaleY(.99)' },
      { opacity: 1, transform: 'translate3d(0,0,0) scaleY(1)' }
    ], { duration: 340, easing: 'cubic-bezier(.2,.9,.2,1)' });
    const gallery = detail.querySelector('[data-motion-widget="SOL-W14"]');
    if (gallery) { revealedWidgets.delete(gallery); revealWidget(gallery); }
    markStable(detail);
  };

  const updatePointer = () => {
    pointerFrame = 0;
    const event = pendingPointer;
    pendingPointer = null;
    if (!event || compact() || reducedQuery.matches) return;
    const target = event.target.closest?.('[data-motion-signature="tactile-swatch"] article, [data-motion-signature="spotlight-origin"]');
    if (!target) return;
    if (activePointerTarget && activePointerTarget !== target) activePointerTarget.removeAttribute('data-pointer-active');
    activePointerTarget = target;
    let rect = pointerRects.get(target);
    if (!rect) { rect = target.getBoundingClientRect(); pointerRects.set(target, rect); }
    const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
    target.style.setProperty('--spot-x', `${x}px`);
    target.style.setProperty('--spot-y', `${y}px`);
    target.setAttribute('data-pointer-active', 'true');
  };
  const handlePointerMove = (event) => {
    pendingPointer = event;
    if (!pointerFrame) pointerFrame = requestAnimationFrame(updatePointer);
  };
  const handlePointerOut = (event) => {
    const target = event.target.closest?.('[data-pointer-active]');
    if (target && !target.contains(event.relatedTarget)) {
      target.removeAttribute('data-pointer-active');
      if (activePointerTarget === target) activePointerTarget = null;
    }
  };
  const handleEnvironmentChange = () => {
    debug.reducedMotion = reducedQuery.matches;
    debug.touch = touchQuery.matches;
    body.dataset.motionDensity = compact() ? 'compact' : 'full';
    if (reducedQuery.matches) {
      activeAnimations.forEach((animation) => animation.finish());
      document.querySelectorAll('[data-motion-widget]').forEach(markStable);
    }
  };
  const handleResize = () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      body.dataset.motionDensity = compact() ? 'compact' : 'full';
      if (activePointerTarget) pointerRects.delete(activePointerTarget);
    });
  };
  const handleVisibility = () => activeAnimations.forEach((animation) => {
    if (document.hidden && animation.playState === 'running') animation.pause();
    else if (!document.hidden && animation.playState === 'paused') animation.play();
  });
  const handlePageHide = (event) => {
    if (event.persisted) {
      activeAnimations.forEach((animation) => animation.cancel());
      return;
    }
    cleanup();
  };
  const cleanup = () => {
    observer?.disconnect();
    observer = null;
    activeAnimations.forEach((animation) => animation.cancel());
    listeners.splice(0).forEach((remove) => remove());
    cancelAnimationFrame(resizeFrame);
    cancelAnimationFrame(pointerFrame);
    debug.observers = 0;
    debug.listeners = 0;
    debug.activeAnimations = 0;
    debug.cleaned = true;
  };

  const controller = window.LithoraMotionController = Object.freeze({
    closeDetail({ detail, finish }) {
      if (!canAnimate(detail) || compact()) { finish(); return; }
      const animation = play(detail, [
        { opacity: 1, transform: 'translate3d(0,0,0) scaleY(1)' },
        { opacity: .72, transform: 'translate3d(0,-8px,0) scaleY(.99)' }
      ], { duration: 190, easing: 'cubic-bezier(.55,0,1,.45)' });
      animation?.finished.then(finish, finish);
    },
    openMenu(menu) {
      if (!canAnimate(menu)) return;
      batch(menu.querySelectorAll(':scope > a'), 'right', { distance: 6, stagger: 32, duration: 240 });
    },
    closeMenu(menu, finish) {
      if (!canAnimate(menu)) { finish(); return; }
      const links = [...menu.querySelectorAll(':scope > a')].reverse().slice(0, 5);
      const animations = links.map((link, index) => play(link, [
        { opacity: 1, transform: 'translate3d(0,0,0)' },
        { opacity: .65, transform: 'translate3d(4px,0,0)' }
      ], { duration: 150, delay: index * 18, easing: 'cubic-bezier(.4,0,1,1)' })).filter(Boolean);
      Promise.allSettled(animations.map((animation) => animation.finished)).then(finish);
    },
    updateContext(element) {
      if (canAnimate(element)) play(element, [{ opacity: .78 }, { opacity: 1 }], { duration: 240 });
      element?.classList.add('is-context-confirmed');
    },
    updateFormState(form, state) {
      form?.setAttribute('data-motion-channel-state', state);
      if (canAnimate(form) && ['loading','error','handoff','success'].includes(state)) play(form, [{ opacity: .94 }, { opacity: 1 }], { duration: 180 });
    }
  });

  listen(document, 'lithora:category-change', animateCategoryChange);
  listen(document, 'lithora:detail-open', animateDetail);
  listen(document, 'pointermove', handlePointerMove, { passive: true });
  listen(document, 'pointerout', handlePointerOut, { passive: true });
  listen(document, 'visibilitychange', handleVisibility);
  listen(window, 'resize', handleResize, { passive: true });
  listen(window, 'orientationchange', handleResize, { passive: true });
  listen(window, 'pagehide', handlePageHide);
  listen(reducedQuery, 'change', handleEnvironmentChange);
  listen(touchQuery, 'change', handleEnvironmentChange);

  handleEnvironmentChange();
  requestAnimationFrame(() => {
    setupObserver();
    observableWidgets().filter((widget) => widget.getBoundingClientRect().top < innerHeight * .92).forEach(revealWidget);
  });
})();
