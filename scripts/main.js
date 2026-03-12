/* ============================================
   MAIN.JS — IAP Camisetas
   Navbar · Accordion · IntersectionObserver
   ============================================ */

'use strict';

/* =========================================
   NAVBAR
   ========================================= */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileMenu= document.getElementById('mobileMenu');

  if (!navbar) return;

  // Scroll → adiciona classe .scrolled
  function onScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // estado inicial

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('is-open');
      hamburger.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Fechar ao clicar em link do menu mobile
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }
})();


/* =========================================
   ACCORDION — FAQ
   ========================================= */
(function initAccordion() {
  const items = document.querySelectorAll('.accordion-item');

  items.forEach(function (item) {
    const trigger = item.querySelector('.accordion-trigger');
    const content = item.querySelector('.accordion-content');

    if (!trigger || !content) return;

    trigger.addEventListener('click', function () {
      const isOpen = item.classList.contains('is-open');

      // Fecha todos
      items.forEach(function (i) {
        i.classList.remove('is-open');
        const c = i.querySelector('.accordion-content');
        if (c) c.style.maxHeight = '0';
        const t = i.querySelector('.accordion-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });

      // Abre o clicado (se estava fechado)
      if (!isOpen) {
        item.classList.add('is-open');
        content.style.maxHeight = content.scrollHeight + 'px';
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();


/* =========================================
   SMOOTH SCROLL para links âncora
   ========================================= */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();

      const navbarH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--navbar-height'),
        10
      ) || 72;

      const top = target.getBoundingClientRect().top + window.scrollY - navbarH - 8;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* =========================================
   NÚMERO — botões + / –
   ========================================= */
(function initNumberInputs() {
  document.querySelectorAll('.number-input-wrapper').forEach(function (wrapper) {
    const input   = wrapper.querySelector('.number-input');
    const btnMinus = wrapper.querySelector('[data-action="minus"]');
    const btnPlus  = wrapper.querySelector('[data-action="plus"]');

    if (!input) return;

    function update(delta) {
      const min = parseInt(input.min, 10) || 1;
      const max = parseInt(input.max, 10) || 99;
      const current = parseInt(input.value, 10) || 1;
      const next = Math.min(max, Math.max(min, current + delta));
      input.value = next;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    if (btnMinus) btnMinus.addEventListener('click', function () { update(-1); });
    if (btnPlus)  btnPlus.addEventListener('click',  function () { update(+1); });

    input.addEventListener('input', function () {
      const min = parseInt(input.min, 10) || 1;
      const max = parseInt(input.max, 10) || 99;
      let v = parseInt(input.value, 10);
      if (isNaN(v) || v < min) input.value = min;
      if (v > max) input.value = max;
    });
  });
})();
