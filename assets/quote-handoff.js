(() => {
  const HANDOFF_KEY = 'lithora:quote-success-handoff';
  const root = document.documentElement;
  const layer = document.querySelector('.quote-handoff-layer');

  if (!layer || !root.classList.contains('quote-handoff')) return;

  let fallbackTimer = 0;
  let completed = false;

  const cleanup = () => {
    if (completed) return;
    completed = true;
    window.clearTimeout(fallbackTimer);
    root.classList.remove('quote-handoff', 'quote-handoff-reveal');
    layer.removeEventListener('transitionend', onTransitionEnd);
    document.body.style.removeProperty('overflow');
  };

  function onTransitionEnd(event) {
    if (event.target === layer && event.propertyName === 'opacity') cleanup();
  }

  const waitForHome = () => new Promise((resolve) => {
    if (document.readyState === 'complete') {
      resolve();
      return;
    }

    const fallback = window.setTimeout(done, 900);
    function done() {
      window.clearTimeout(fallback);
      window.removeEventListener('load', done);
      resolve();
    }
    window.addEventListener('load', done, { once: true });
  });

  const reveal = async () => {
    try {
      sessionStorage.removeItem(HANDOFF_KEY);
    } catch {}

    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    await waitForHome();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    if (completed) return;

    layer.addEventListener('transitionend', onTransitionEnd);
    root.classList.add('quote-handoff-reveal');
    fallbackTimer = window.setTimeout(cleanup, 1100);
  };

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) cleanup();
  });

  void reveal();
})();
