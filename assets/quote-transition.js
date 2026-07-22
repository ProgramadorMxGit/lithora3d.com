(() => {
  const links = [...document.querySelectorAll('[data-quote-link]')];
  if (!links.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let navigating = false;

  const layer = document.createElement('div');
  layer.className = 'quote-transition-layer';
  layer.setAttribute('aria-hidden', 'true');
  layer.innerHTML = `
    <div class="quote-transition-layer__wash"></div>
    <div class="quote-transition-layer__track">
      <span class="quote-transition-layer__line"></span>
      <span class="quote-transition-layer__cube">
        <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true">
          <path d="M24 4 41 13.5v21L24 44 7 34.5v-21Z"/>
          <path d="M7 13.5 24 23l17-9.5M24 23v21"/>
        </svg>
      </span>
      <span class="quote-transition-layer__copy">Preparando tu cotización</span>
    </div>`;
  document.body.append(layer);

  const reset = () => {
    navigating = false;
    document.documentElement.classList.remove('quote-transition-active');
  };

  window.addEventListener('pageshow', reset);

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      if (
        navigating || event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
        link.target === '_blank'
      ) return;

      if (reduceMotion.matches) return;

      event.preventDefault();
      navigating = true;
      document.documentElement.classList.add('quote-transition-active');

      window.setTimeout(() => {
        window.location.assign(link.href);
      }, 680);
    });
  });
})();
