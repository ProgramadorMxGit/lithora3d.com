(() => {
  const FORM_ID = 'ODeE7a';
  const HANDOFF_KEY = 'lithora:quote-success-handoff';
  const overlay = document.querySelector('[data-quote-success]');
  const frame = document.querySelector('.quote-tally-frame');

  if (!overlay || !frame) return;

  const wash = overlay.querySelector('.quote-success__wash');
  const seed = overlay.querySelector('.quote-success__seed');
  const seedLabel = overlay.querySelector('.quote-success__seed-label');
  const seedCheck = overlay.querySelector('.quote-success__seed-check path');
  const content = overlay.querySelector('.quote-success__content');
  const emblem = overlay.querySelector('.quote-success__emblem');
  const ring = overlay.querySelector('.quote-success__ring');
  const check = overlay.querySelector('.quote-success__check');
  const title = overlay.querySelector('h2');
  const message = overlay.querySelector('.quote-success__content > p');
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const inertTargets = [
    document.querySelector('.quote-header'),
    document.querySelector('.quote-layout'),
    document.querySelector('.quote-footer')
  ].filter(Boolean);

  const STATE = Object.freeze({
    READY: 'ready',
    SUBMITTING: 'submitting-native',
    ERROR: 'error-native',
    BUTTON: 'button-confirmation',
    EXPANSION: 'expansion',
    SUCCESS: 'success-screen',
    EXIT: 'success-exit',
    NAVIGATING: 'navigating-home',
    COMPLETE: 'complete'
  });

  const allowedTransitions = new Map([
    [STATE.READY, new Set([STATE.BUTTON])],
    [STATE.BUTTON, new Set([STATE.EXPANSION])],
    [STATE.EXPANSION, new Set([STATE.SUCCESS])],
    [STATE.SUCCESS, new Set([STATE.EXIT])],
    [STATE.EXIT, new Set([STATE.NAVIGATING])],
    [STATE.NAVIGATING, new Set([STATE.COMPLETE])]
  ]);

  const easeOut = 'cubic-bezier(.16, 1, .3, 1)';
  const easeStandard = 'cubic-bezier(.22, 1, .36, 1)';
  let state = STATE.READY;
  let runController = null;
  let washAnimation = null;
  let lockedScrollY = 0;
  let previousFocus = null;
  let previousThemeColor = themeColor?.content || '#07111f';
  let origin = { x: innerWidth / 2, y: innerHeight / 2, scale: 1 };
  let videoWasPlaying = false;
  const activeAnimations = new Set();
  const lifecycleController = new AbortController();

  const setState = (nextState) => {
    if (nextState !== STATE.READY && !allowedTransitions.get(state)?.has(nextState)) {
      throw new Error(`Transición de confirmación inválida: ${state} → ${nextState}`);
    }
    state = nextState;
    overlay.dataset.state = nextState;
  };

  const animation = (element, keyframes, options, signal) => {
    if (!element || signal.aborted) return Promise.resolve();

    const player = element.animate(keyframes, {
      fill: 'forwards',
      ...options
    });
    activeAnimations.add(player);

    const cancel = () => player.cancel();
    signal.addEventListener('abort', cancel, { once: true });

    return player.finished
      .catch((error) => {
        if (!signal.aborted) throw error;
      })
      .finally(() => {
        activeAnimations.delete(player);
        signal.removeEventListener('abort', cancel);
      });
  };

  const pause = (milliseconds, signal) => new Promise((resolve) => {
    if (signal.aborted) {
      resolve();
      return;
    }

    const timeout = window.setTimeout(done, milliseconds);
    function done() {
      window.clearTimeout(timeout);
      signal.removeEventListener('abort', done);
      resolve();
    }
    signal.addEventListener('abort', done, { once: true });
  });

  const nextPaint = () => new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const measureOrigin = () => {
    const rect = frame.getBoundingClientRect();
    const viewportWidth = window.visualViewport?.width || innerWidth;
    const viewportHeight = window.visualViewport?.height || innerHeight;
    const inset = Math.min(48, viewportWidth * .08);
    const x = clamp(rect.left + Math.min(94, rect.width * .25), inset, viewportWidth - inset);
    const y = clamp(rect.bottom - 38, inset, viewportHeight - inset);
    const farthestCurrentCorner = Math.max(
      Math.hypot(x, y),
      Math.hypot(viewportWidth - x, y),
      Math.hypot(x, viewportHeight - y),
      Math.hypot(viewportWidth - x, viewportHeight - y)
    );
    const futureWidth = Math.max(viewportWidth, window.screen?.width || viewportWidth);
    const futureHeight = Math.max(viewportHeight, window.screen?.height || viewportHeight);
    const safeRadius = Math.max(farthestCurrentCorner, Math.hypot(futureWidth, futureHeight)) + 72;

    origin = { x, y, scale: safeRadius / 32 };
    overlay.style.setProperty('--quote-success-x', `${x}px`);
    overlay.style.setProperty('--quote-success-y', `${y}px`);
    overlay.style.setProperty('--quote-success-scale', origin.scale.toFixed(4));
    return origin;
  };

  const refreshCoverage = () => {
    measureOrigin();
    if ([STATE.SUCCESS, STATE.EXIT, STATE.NAVIGATING, STATE.COMPLETE].includes(state)) {
      wash.style.transform = `translate3d(-50%, -50%, 0) scale(${origin.scale})`;
    }
  };

  const lockInterface = () => {
    previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    previousThemeColor = themeColor?.content || previousThemeColor;
    lockedScrollY = window.scrollY;
    document.documentElement.style.setProperty('--quote-lock-offset', `${-lockedScrollY}px`);
    document.documentElement.classList.add('quote-success-active');
    document.body.classList.add('quote-success-locked');
    overlay.setAttribute('aria-hidden', 'false');
    overlay.dataset.reducedMotion = String(reducedMotion.matches);
    inertTargets.forEach((element) => { element.inert = true; });

    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement) activeElement.blur();
    frame.blur();
    window.focus();

    const video = document.querySelector('.quote-process-video');
    if (video) {
      videoWasPlaying = !video.paused;
      video.pause();
    }

    if (themeColor) themeColor.content = '#087c50';
  };

  const restoreInterface = () => {
    inertTargets.forEach((element) => { element.inert = false; });
    overlay.setAttribute('aria-hidden', 'true');
    content.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('quote-success-active');
    document.documentElement.style.removeProperty('--quote-lock-offset');
    document.body.classList.remove('quote-success-locked');
    if (themeColor) themeColor.content = previousThemeColor;
    window.scrollTo(0, lockedScrollY);

    const video = document.querySelector('.quote-process-video');
    if (videoWasPlaying) video?.play().catch(() => {});
    if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
  };

  const resetVisuals = () => {
    activeAnimations.forEach((player) => player.cancel());
    activeAnimations.clear();
    washAnimation = null;
    [wash, seed, seedLabel, seedCheck, content, emblem, ring, check, title, message].forEach((element) => {
      element?.removeAttribute('style');
    });
    state = STATE.READY;
    overlay.dataset.state = STATE.READY;
    overlay.dataset.reducedMotion = 'false';
  };

  const abortAndReset = () => {
    if (state === STATE.NAVIGATING || state === STATE.COMPLETE) return;
    runController?.abort();
    runController = null;
    restoreInterface();
    resetVisuals();
  };

  const animateButtonConfirmation = async (signal) => {
    setState(STATE.BUTTON);
    seed.style.visibility = 'visible';

    if (reducedMotion.matches) {
      await Promise.all([
        animation(seed, [
          { opacity: 0 },
          { opacity: 1 }
        ], { duration: 180, easing: 'ease-out' }, signal),
        animation(seedCheck, [
          { strokeDashoffset: 34 },
          { strokeDashoffset: 0 }
        ], { duration: 260, easing: 'ease-out' }, signal)
      ]);
      await pause(120, signal);
      return;
    }

    await Promise.all([
      animation(seed, [
        { opacity: 0, transform: 'translate3d(-50%, -50%, 0) scale(.9)' },
        { opacity: 1, transform: 'translate3d(-50%, -50%, 0) scale(1)' }
      ], { duration: 340, easing: easeOut }, signal),
      animation(seedLabel, [
        { opacity: 0, transform: 'translate3d(8px, 0, 0)' },
        { opacity: 1, transform: 'translate3d(0, 0, 0)' }
      ], { duration: 280, delay: 70, easing: easeOut }, signal),
      animation(seedCheck, [
        { strokeDashoffset: 34 },
        { strokeDashoffset: 0 }
      ], { duration: 500, delay: 100, easing: easeStandard }, signal)
    ]);

    await animation(seed, [
      { transform: 'translate3d(-50%, -50%, 0) scale(1)' },
      { transform: 'translate3d(-50%, -50%, 0) scale(1.035)', offset: .46 },
      { transform: 'translate3d(-50%, -50%, 0) scale(1)' }
    ], { duration: 250, easing: easeOut }, signal);
    await pause(150, signal);
  };

  const animateExpansion = async (signal) => {
    setState(STATE.EXPANSION);

    if (reducedMotion.matches) {
      wash.style.inset = '0';
      wash.style.width = 'auto';
      wash.style.height = 'auto';
      wash.style.borderRadius = '0';
      wash.style.transform = 'none';
      await Promise.all([
        animation(wash, [{ opacity: 0 }, { opacity: 1 }], {
          duration: 260,
          easing: 'ease-out'
        }, signal),
        animation(seed, [{ opacity: 1 }, { opacity: 0 }], {
          duration: 180,
          easing: 'ease-out'
        }, signal)
      ]);
      return;
    }

    const endTransform = `translate3d(-50%, -50%, 0) scale(${origin.scale})`;
    washAnimation = wash.animate([
      { transform: 'translate3d(-50%, -50%, 0) scale(.01)' },
      { transform: endTransform }
    ], {
      duration: 900,
      easing: easeStandard,
      fill: 'forwards'
    });
    activeAnimations.add(washAnimation);

    const cancelWash = () => washAnimation?.cancel();
    signal.addEventListener('abort', cancelWash, { once: true });

    await Promise.all([
      washAnimation.finished.catch((error) => {
        if (!signal.aborted) throw error;
      }),
      animation(seed, [
        { opacity: 1, transform: 'translate3d(-50%, -50%, 0) scale(1)' },
        { opacity: 0, transform: 'translate3d(-50%, -50%, 0) scale(.86)' }
      ], { duration: 300, delay: 170, easing: easeStandard }, signal)
    ]);

    activeAnimations.delete(washAnimation);
    signal.removeEventListener('abort', cancelWash);
    wash.style.transform = endTransform;
  };

  const animateSuccessScreen = async (signal) => {
    setState(STATE.SUCCESS);
    content.setAttribute('aria-hidden', 'false');
    content.style.visibility = 'visible';
    content.focus({ preventScroll: true });

    const restrained = reducedMotion.matches;
    await Promise.all([
      animation(emblem, restrained ? [
        { opacity: 0 },
        { opacity: 1 }
      ] : [
        { opacity: 0, transform: 'translate3d(0, 10px, 0) scale(.88)' },
        { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' }
      ], { duration: restrained ? 240 : 560, easing: easeOut }, signal),
      animation(ring, [
        { strokeDashoffset: 327 },
        { strokeDashoffset: 0 }
      ], { duration: restrained ? 260 : 620, easing: easeStandard }, signal),
      animation(check, [
        { strokeDashoffset: 80 },
        { strokeDashoffset: 0 }
      ], { duration: restrained ? 280 : 520, delay: restrained ? 40 : 170, easing: easeStandard }, signal)
    ]);

    if (!restrained) {
      await animation(emblem, [
        { transform: 'scale(1)' },
        { transform: 'scale(1.035)', offset: .45 },
        { transform: 'scale(1)' }
      ], { duration: 280, easing: easeOut }, signal);
    }

    await animation(title, restrained ? [
      { opacity: 0 },
      { opacity: 1 }
    ] : [
      { opacity: 0, transform: 'translate3d(0, 16px, 0)' },
      { opacity: 1, transform: 'translate3d(0, 0, 0)' }
    ], { duration: restrained ? 260 : 440, easing: easeOut }, signal);

    await pause(restrained ? 35 : 80, signal);
    await animation(message, restrained ? [
      { opacity: 0 },
      { opacity: 1 }
    ] : [
      { opacity: 0, transform: 'translate3d(0, 9px, 0)' },
      { opacity: 1, transform: 'translate3d(0, 0, 0)' }
    ], { duration: restrained ? 240 : 380, easing: easeOut }, signal);

    await pause(1850, signal);
  };

  const animateExit = async (signal) => {
    setState(STATE.EXIT);
    const restrained = reducedMotion.matches;

    await Promise.all([
      animation(message, restrained ? [
        { opacity: 1 },
        { opacity: 0 }
      ] : [
        { opacity: 1, transform: 'translate3d(0, 0, 0)' },
        { opacity: 0, transform: 'translate3d(0, -6px, 0)' }
      ], { duration: restrained ? 180 : 300, easing: 'ease-in' }, signal),
      animation(title, restrained ? [
        { opacity: 1 },
        { opacity: 0 }
      ] : [
        { opacity: 1, transform: 'translate3d(0, 0, 0)' },
        { opacity: 0, transform: 'translate3d(0, -14px, 0)' }
      ], { duration: restrained ? 220 : 420, delay: restrained ? 20 : 70, easing: easeStandard }, signal),
      animation(emblem, restrained ? [
        { opacity: 1 },
        { opacity: 0 }
      ] : [
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0, transform: 'scale(.96)' }
      ], { duration: restrained ? 220 : 430, delay: restrained ? 20 : 90, easing: easeStandard }, signal)
    ]);
  };

  const handoffToHome = async (signal) => {
    if (signal.aborted) return;
    setState(STATE.NAVIGATING);
    try {
      sessionStorage.setItem(HANDOFF_KEY, String(Date.now()));
    } catch {
      // La capa actual permanece verde hasta que el nuevo documento tome el control.
    }
    window.scrollTo(0, 0);
    await nextPaint();
    if (signal.aborted) return;
    setState(STATE.COMPLETE);
    window.location.replace('/');
  };

  const runSuccess = async () => {
    runController = new AbortController();
    const { signal } = runController;

    lockInterface();
    await pause(90, signal);
    measureOrigin();
    await nextPaint();

    try {
      await animateButtonConfirmation(signal);
      if (signal.aborted) return;
      await animateExpansion(signal);
      if (signal.aborted) return;
      await animateSuccessScreen(signal);
      if (signal.aborted) return;
      await animateExit(signal);
      if (signal.aborted) return;
      await handoffToHome(signal);
    } catch (error) {
      if (!signal.aborted) {
        console.error('No se pudo completar la transición de confirmación.', error);
        abortAndReset();
      }
    }
  };

  window.lithoraQuoteSuccess = (payload) => {
    if (state !== STATE.READY || payload?.formId !== FORM_ID) return false;
    void runSuccess();
    return true;
  };

  const onTallyMessage = (event) => {
    if (event.origin !== 'https://tally.so' || event.source !== frame.contentWindow) return;

    let data = event.data;
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch {
        return;
      }
    }

    if (data?.event !== 'Tally.FormSubmitted') return;
    window.lithoraQuoteSuccess(data.payload);
  };

  const lifecycleOptions = { signal: lifecycleController.signal };
  window.addEventListener('message', onTallyMessage, lifecycleOptions);
  window.addEventListener('resize', refreshCoverage, { ...lifecycleOptions, passive: true });
  window.visualViewport?.addEventListener('resize', refreshCoverage, { ...lifecycleOptions, passive: true });
  window.addEventListener('pagehide', (event) => {
    runController?.abort();
    if (!event.persisted) lifecycleController.abort();
  }, lifecycleOptions);
  window.addEventListener('pageshow', (event) => {
    if (event.persisted && state !== STATE.READY) {
      runController?.abort();
      runController = null;
      restoreInterface();
      resetVisuals();
    }
  });
})();
