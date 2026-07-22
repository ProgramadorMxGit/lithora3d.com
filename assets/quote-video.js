(() => {
  const video = document.querySelector('.quote-process-video');
  if (!video) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let isVisible = true;

  const syncPlayback = () => {
    const shouldPause = document.hidden || !isVisible || reducedMotion.matches;
    if (shouldPause) {
      video.pause();
      return;
    }

    video.play().catch(() => {
      // El video es decorativo: si el navegador bloquea autoplay, conserva el primer cuadro.
    });
  };

  const observer = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting && entry.intersectionRatio >= .12;
    syncPlayback();
  }, { threshold: [0, .12] });

  observer.observe(video);
  document.addEventListener('visibilitychange', syncPlayback);
  reducedMotion.addEventListener?.('change', syncPlayback);
  video.addEventListener('canplay', syncPlayback, { once: true });
})();
