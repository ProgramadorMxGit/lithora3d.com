import { categories, getPublishedNiches } from './content.js';
import { createAnalyticsAdapter } from './analytics.js';
import { buildQuoteContext, buildWhatsAppMessage, buildWhatsAppUrl, createQuoteChannel, QUOTE_STATES, validateQuote } from './quote-channel.js';

(() => {
  'use strict';
  const page = document.querySelector('.ecosystem-page');
  if (!page) return;

  page.classList.add('js-enhanced');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const analytics = createAnalyticsAdapter({ target: window });
  const route = location.pathname;
  const device = window.innerWidth < 768 ? 'mobile' : 'desktop';
  const track = (name, payload = {}, options) => analytics.emit(name, { route, device, ...payload }, options);
  const categoryLinks = [...page.querySelectorAll('[data-category-control]')];
  const allCards = [...page.querySelectorAll('[data-niche-card]')];
  const publicNiches = getPublishedNiches();
  const publicIds = new Set(publicNiches.map((item) => item.id));
  const cards = allCards.filter((card) => publicIds.has(card.dataset.niche));
  const grid = page.querySelector('#niche-grid');
  const status = page.querySelector('[data-category-status]');
  const emptyState = page.querySelector('[data-empty-state]');
  const gridFeedbackText = page.querySelector('[data-grid-feedback-text]');
  const gridRetry = page.querySelector('[data-grid-retry]');
  const contextLabel = page.querySelector('[data-context-label]');
  const quoteCategory = page.querySelector('#quote-category');
  const quoteNiche = page.querySelector('#quote-niche');
  const quoteApplication = page.querySelector('#quote-application');
  const quoteOrigin = page.querySelector('#quote-origin');
  const quoteDescription = page.querySelector('#quote-description');
  const quoteForm = page.querySelector('#ecosystem-quote-form');
  const whatsappDirect = page.querySelector('[data-whatsapp-direct]');
  let activeCategory = '';
  let activeCard = null;
  let selectedContext = buildQuoteContext({ originUrl: location.href });
  let quoteAttempt = 0;

  allCards.forEach((card) => { if (!publicIds.has(card.dataset.niche)) card.remove(); });
  if (grid) publicNiches.forEach((item) => {
    const card = cards.find((candidate) => candidate.dataset.niche === item.id);
    if (card) grid.append(card);
  });

  function categoryLabel(categoryId) {
    return categories.find((category) => category.id === categoryId)?.name || categoryId;
  }

  function closeDetail(card, restoreFocus = true) {
    const button = card.querySelector('.niche-open');
    const detail = card.querySelector('.niche-detail');
    if (!button || !detail) return;
    const finish = () => {
      detail.hidden = true;
      detail.dataset.closing = 'false';
      button.setAttribute('aria-expanded', 'false');
      if (restoreFocus) button.focus({ preventScroll: true });
      if (activeCard === card) activeCard = null;
      document.dispatchEvent(new CustomEvent('lithora:detail-close', { detail: { card, detail, button } }));
    };
    if (restoreFocus && !detail.hidden && detail.dataset.closing !== 'true' && window.LithoraMotionController?.closeDetail) {
      detail.dataset.closing = 'true';
      window.LithoraMotionController.closeDetail({ detail, finish });
      return;
    }
    finish();
  }

  function setActiveCategory(categoryId, { historyMode = 'none', announce = true } = {}) {
    if (!categories.some((category) => category.id === categoryId)) return false;
    const changed = activeCategory !== categoryId;
    activeCategory = categoryId;
    categoryLinks.forEach((link) => {
      const active = link.dataset.category === categoryId;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current');
    });
    cards.forEach((card) => {
      const visible = card.dataset.category === categoryId;
      card.hidden = !visible;
      if (!visible) closeDetail(card, false);
    });
    const visibleCards = cards.filter((card) => card.dataset.category === categoryId);
    if (emptyState) emptyState.hidden = visibleCards.length > 0;
    if (status && announce) status.textContent = `${categoryLabel(categoryId)}: ${visibleCards.length} soluciones de demostración disponibles.`;
    if (historyMode === 'push') history.pushState({ categoryId }, '', `#${categoryId}`);
    if (historyMode === 'replace') history.replaceState({ categoryId }, '', `#${categoryId}`);
    if (changed) track('ecosystem_category_select', { categoryId, categoryName: categoryLabel(categoryId) });
    if (changed) document.dispatchEvent(new CustomEvent('lithora:category-change', { detail: { categoryId, cards: visibleCards } }));
    return changed;
  }

  function setGridState(state, message = '') {
    if (!grid) return;
    grid.dataset.state = state;
    grid.setAttribute('aria-busy', String(state === 'loading'));
    const showFeedback = state === 'loading' || state === 'error' || state === 'empty';
    if (emptyState) emptyState.hidden = !showFeedback;
    if (gridFeedbackText) gridFeedbackText.textContent = message || ({ loading: 'Cargando soluciones…', error: 'No fue posible mostrar las soluciones. Puedes reintentar o elegir otra categoría.', empty: 'No hay nichos publicados en esta categoría. Puedes elegir otra categoría.' }[state] || '');
    if (gridRetry) gridRetry.hidden = state !== 'error';
  }

  function setDetailState(cardOrId, state, message = '') {
    const card = typeof cardOrId === 'string' ? cards.find((candidate) => candidate.dataset.niche === cardOrId) : cardOrId;
    const detail = card?.querySelector('.niche-detail');
    const inner = detail?.querySelector('.detail-inner');
    const gallery = detail?.querySelector('.detail-gallery');
    if (!detail || !inner) return false;
    let feedback = detail.querySelector('.detail-state');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.className = 'detail-state';
      feedback.setAttribute('role', 'status');
      detail.prepend(feedback);
    }
    detail.dataset.state = state;
    detail.setAttribute('aria-busy', String(state === 'loading'));
    inner.hidden = state === 'loading' || state === 'error';
    if (gallery) gallery.hidden = state === 'loading' || state === 'error';
    feedback.hidden = state === 'ready';
    feedback.replaceChildren();
    if (state !== 'ready') {
      const text = document.createElement('p');
      text.textContent = message || (state === 'loading' ? 'Cargando detalle…' : 'No fue posible mostrar el detalle. Puedes reintentar o volver a la categoría.');
      feedback.append(text);
      if (state === 'error') {
        const retry = document.createElement('button');
        retry.type = 'button';
        retry.className = 'detail-close';
        retry.textContent = 'Reintentar';
        retry.addEventListener('click', () => { setDetailState(card, 'ready'); openDetail(card); }, { once: true });
        feedback.append(retry);
      }
    }
    return true;
  }

  function openDetail(card) {
    if (activeCard && activeCard !== card) closeDetail(activeCard, false);
    const button = card.querySelector('.niche-open');
    const detail = card.querySelector('.niche-detail');
    if (!button || !detail || !detail.hidden) return;
    setDetailState(card, 'ready');
    detail.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    activeCard = card;
    track('ecosystem_niche_open', { nicheId: card.dataset.niche, nicheName: card.dataset.quoteContext, categoryId: card.dataset.category });
    const cardRect = card.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const originPercent = cardRect.width ? ((buttonRect.left + buttonRect.width / 2 - cardRect.left) / cardRect.width) * 100 : 50;
    document.dispatchEvent(new CustomEvent('lithora:detail-open', { detail: { card, detail, button, originPercent } }));
  }

  function setQuoteContext(card, application = '') {
    const categoryName = categoryLabel(card.dataset.category);
    selectedContext = buildQuoteContext({ categoryId: card.dataset.category, categoryName, nicheId: card.dataset.niche, nicheName: card.dataset.quoteContext, application, originUrl: location.href, imageType: card.dataset.imageType });
    if (contextLabel) contextLabel.textContent = `${categoryName} · ${selectedContext.nicheName}${application ? ` · ${application}` : ''}`;
    window.LithoraMotionController?.updateContext(contextLabel?.closest('[data-context-summary]'));
    if (quoteCategory) quoteCategory.value = categoryName;
    if (quoteNiche) quoteNiche.value = selectedContext.nicheName;
    if (quoteApplication) quoteApplication.value = application;
    if (quoteOrigin) quoteOrigin.value = selectedContext.originUrl;
    if (quoteDescription) {
      const message = buildWhatsAppMessage(selectedContext);
      if (!quoteDescription.dataset.autoMessage || !quoteDescription.value.trim() || quoteDescription.value === quoteDescription.dataset.autoMessage) quoteDescription.value = message;
      quoteDescription.dataset.autoMessage = message;
      if (whatsappDirect && quoteForm?.dataset.quoteDestination) whatsappDirect.href = buildWhatsAppUrl(quoteForm.dataset.quoteDestination, { context: selectedContext, message: quoteDescription.value });
    }
    track('ecosystem_origin_context', selectedContext, { onceKey: `${selectedContext.nicheId}:${application}:${selectedContext.originUrl}` });
  }

  categoryLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const categoryId = link.dataset.category;
      if (!categoryId) return;
      event.preventDefault();
      setActiveCategory(categoryId, { historyMode: 'push' });
      page.querySelector('.niche-explorer')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
    link.addEventListener('keydown', (event) => {
      if (event.key === ' ') { event.preventDefault(); link.click(); }
    });
  });

  cards.forEach((card) => {
    const image = card.querySelector('img');
    if (image) {
      image.addEventListener('load', () => image.closest('.niche-image-wrap')?.classList.add('image-loaded'), { once: true });
      image.addEventListener('error', () => {
        const wrapper = image.closest('.niche-image-wrap');
        if (!wrapper) return;
        image.remove();
        wrapper.classList.add('fallback-image', 'image-error');
        const fallback = document.createElement('div');
        fallback.className = 'fallback-symbol';
        fallback.setAttribute('aria-hidden', 'true');
        fallback.textContent = '3D';
        wrapper.prepend(fallback);
        const badge = wrapper.querySelector('.image-badge');
        if (badge) badge.textContent = 'Imagen no disponible';
      }, { once: true });
    }
    card.querySelector('.niche-open')?.addEventListener('click', () => openDetail(card));
    card.querySelector('.detail-close')?.addEventListener('click', () => closeDetail(card));
    card.querySelectorAll('[data-application]').forEach((application) => {
      application.addEventListener('click', () => {
        const alreadyActive = application.getAttribute('aria-current') === 'true';
        card.querySelectorAll('[data-application]').forEach((item) => item.removeAttribute('aria-current'));
        application.setAttribute('aria-current', 'true');
        setQuoteContext(card, application.textContent.trim());
        if (!alreadyActive) track('ecosystem_application_click', { nicheId: card.dataset.niche, categoryId: card.dataset.category, applicationName: application.textContent.trim() });
      });
      application.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          application.click();
        }
      });
    });
    card.querySelectorAll('[data-quote-trigger]').forEach((trigger) => trigger.addEventListener('click', () => {
      setQuoteContext(card, quoteApplication?.value || '');
      track('ecosystem_quote_click', { nicheId: card.dataset.niche, nicheName: card.dataset.quoteContext, categoryId: card.dataset.category, cta: trigger.textContent.trim() }, { onceKey: `${card.dataset.niche}:${Date.now() >> 10}` });
    }));
  });

  const menuButton = page.querySelector('.ecosystem-menu-button');
  const mobileMenu = page.querySelector('#mobile-menu');
  const setMenuOpen = (open, restoreFocus = false) => {
    if (!menuButton || !mobileMenu) return;
    const finishClose = () => {
      mobileMenu.hidden = true;
      menuButton.setAttribute('aria-expanded', 'false');
      if (restoreFocus) menuButton.focus({ preventScroll: true });
    };
    if (open) {
      mobileMenu.hidden = false;
      menuButton.setAttribute('aria-expanded', 'true');
      window.LithoraMotionController?.openMenu(mobileMenu);
      mobileMenu.querySelector('a')?.focus({ preventScroll: true });
    } else if (!mobileMenu.hidden && window.LithoraMotionController?.closeMenu) {
      window.LithoraMotionController.closeMenu(mobileMenu, finishClose);
    } else finishClose();
  };
  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true'));
    menuButton.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenuOpen(false); });
    mobileMenu.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') { event.preventDefault(); setMenuOpen(false, true); return; }
      if (event.key !== 'Tab') return;
      const links = [...mobileMenu.querySelectorAll('a')];
      if (!links.length) return;
      if (event.shiftKey && document.activeElement === links[0]) { event.preventDefault(); links.at(-1).focus(); }
      else if (!event.shiftKey && document.activeElement === links.at(-1)) { event.preventDefault(); links[0].focus(); }
    });
  }
  gridRetry?.addEventListener('click', () => { setGridState('ready'); setActiveCategory(activeCategory, { announce: true }); });

  const form = quoteForm;
  if (form) {
    const submitButton = form.querySelector('[type="submit"]');
    const formStatus = form.querySelector('[data-form-status]');
    const channel = createQuoteChannel({ channel: form.dataset.quoteChannel, destination: form.dataset.quoteDestination, endpoint: form.dataset.quoteEndpoint || '' });
    const showState = (state) => {
      form.dataset.state = state;
      window.LithoraMotionController?.updateFormState(form, state);
      if (submitButton) submitButton.disabled = state === QUOTE_STATES.LOADING;
      if (!formStatus) return;
      const messages = {
        [QUOTE_STATES.AVAILABLE]: 'WhatsApp está disponible. Abriremos una conversación con el contexto preparado para que puedas revisarlo y enviarlo.',
        [QUOTE_STATES.UNAVAILABLE]: 'Canal no configurado: no se envió ningún dato. Tu información permanece en esta página.',
        [QUOTE_STATES.LOADING]: 'Preparando WhatsApp…',
        [QUOTE_STATES.ERROR]: 'No fue posible abrir WhatsApp. Conservamos el contexto en esta página para que puedas reintentar o usar el enlace directo.',
        [QUOTE_STATES.HANDOFF]: 'WhatsApp se abrió con el mensaje preparado. Revísalo y pulsa enviar para completar la solicitud.',
        [QUOTE_STATES.SUCCESS]: `Solicitud recibida para ${selectedContext.nicheName || 'orientación general'}.`,
      };
      formStatus.className = `form-status ${state === QUOTE_STATES.ERROR || state === QUOTE_STATES.UNAVAILABLE ? 'error' : ''}`.trim();
      formStatus.textContent = messages[state] || '';
    };
    showState(channel.available ? QUOTE_STATES.AVAILABLE : QUOTE_STATES.UNAVAILABLE);
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const file = form.querySelector('#quote-file')?.files?.[0] || null;
      const values = { name: form.elements.nombre?.value, email: form.elements.email?.value, description: form.elements.descripcion?.value, file };
      const validation = validateQuote(values, { requireContact: channel.type !== 'whatsapp' });
      if (!validation.valid) {
        showState(QUOTE_STATES.ERROR);
        if (formStatus) formStatus.textContent = validation.errors.file === 'too-large' ? 'El archivo supera el límite local de 10 MB.' : 'Completa el mensaje y, si escribes un correo, usa un formato válido.';
        const fieldName = Object.keys(validation.errors)[0];
        ({ name: form.elements.nombre, email: form.elements.email, description: form.elements.descripcion, file: form.elements.archivo })[fieldName]?.focus();
        return;
      }
      const attemptId = `local-${Date.now()}-${++quoteAttempt}`;
      if (file) track('ecosystem_attachment_use', { attemptId, nicheId: selectedContext.nicheId, categoryId: selectedContext.categoryId, action: 'selected', result: channel.type === 'whatsapp' ? 'attach-manually-in-whatsapp' : 'validated-locally' }, { onceKey: `${attemptId}:attachment` });
      const result = await channel.submit({ context: selectedContext, message: values.description }, showState);
      if (result.state === QUOTE_STATES.HANDOFF) track('ecosystem_quote_start', { attemptId, nicheId: selectedContext.nicheId, categoryId: selectedContext.categoryId, channel: 'whatsapp', originUrl: selectedContext.originUrl }, { onceKey: attemptId });
      if (result.confirmed === true) track('ecosystem_quote_complete', { attemptId, nicheId: selectedContext.nicheId, categoryId: selectedContext.categoryId, channel: channel.type, sendStatus: 'accepted' }, { onceKey: attemptId });
    });
  }

  const initialHash = location.hash.slice(1);
  const requestedNicheId = new URLSearchParams(location.search).get('nicho');
  const requestedCard = cards.find((card) => card.dataset.niche === requestedNicheId);
  const initialCategory = requestedCard?.dataset.category || (categories.some((category) => category.id === initialHash) ? initialHash : categories[0].id);
  setActiveCategory(initialCategory, { historyMode: initialHash ? 'none' : 'replace', announce: false });
  if (requestedCard) window.requestAnimationFrame(() => {
    openDetail(requestedCard);
    requestedCard.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  });
  track('ecosystem_section_view', { referrer: document.referrer || 'direct' }, { onceKey: 'page-load' });
  const restoreCategoryFromHistory = () => {
    const categoryId = location.hash.slice(1);
    if (categories.some((category) => category.id === categoryId)) setActiveCategory(categoryId, { announce: true });
  };
  window.addEventListener('popstate', restoreCategoryFromHistory);
  window.addEventListener('hashchange', restoreCategoryFromHistory);
  window.LithoraEcosystemUI = Object.freeze({ setGridState, setDetailState });
})();
