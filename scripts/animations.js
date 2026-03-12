/* ============================================
   ANIMATIONS.JS — IAP Camisetas
   GSAP + ScrollTrigger
   ============================================ */

(function () {
  'use strict';

  /* ── Fallback: mostra tudo sem animação ── */
  function showAll() {
    var ov = document.getElementById('intro-overlay');
    if (ov) ov.remove();
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.style.opacity   = '1';
      el.style.transform = 'none';
    });
  }

  /* ── Reduced motion ─────────────────────── */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    showAll();
    return;
  }

  /* ── GSAP não carregou (CDN bloqueado etc) ─ */
  if (typeof gsap === 'undefined') {
    console.warn('[IAP] GSAP não carregou. Animações desativadas.');
    showAll();
    return;
  }

  /* ── Tudo ok: registra plugins e inicia ─── */
  gsap.registerPlugin(ScrollTrigger);

  /* .reveal containers ficam visíveis — GSAP anima os filhos */
  document.documentElement.classList.add('gsap-ready');

  /* DOM já está pronto (script síncrono no final do body) */
  initIntro();

/* =========================================
   INTRO — "IDE POR TODO O MUNDO"
   ========================================= */
function initIntro() {
  var overlay = document.getElementById('intro-overlay');

  if (!overlay) {
    initAfterIntro();
    return;
  }

  /* Trava o scroll durante o intro */
  document.body.style.overflow = 'hidden';

  var tl = gsap.timeline({
    delay: 0.1,
    onComplete: function () { playOutro(overlay); }
  });

  /* Garante estado inicial visível no overlay */
  gsap.set(overlay, { yPercent: 0, opacity: 1 });
  gsap.set('#intro-line',  { scaleX: 0 });
  gsap.set('#intro-small', { yPercent: 120 });
  gsap.set('#intro-large', { yPercent: 90, opacity: 0 });
  gsap.set('#intro-ref',   { opacity: 0, y: 16 });

  tl
    /* 1. Linha vermelha cresce do centro */
    .to('#intro-line', {
      scaleX: 1,
      duration: 0.75,
      ease: 'power3.inOut',
      transformOrigin: 'center center'
    })
    /* 2. "IDE POR TODO O" sobe do clip */
    .to('#intro-small', {
      yPercent: 0,
      duration: 0.65,
      ease: 'power3.out'
    }, '-=0.15')
    /* 3. "MUNDO" entra enorme */
    .to('#intro-large', {
      yPercent: 0,
      opacity: 1,
      duration: 0.75,
      ease: 'power4.out'
    }, '-=0.2')
    /* 4. Versículo aparece */
    .to('#intro-ref', {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.2')
    /* 5. Pulso sutil no MUNDO */
    .to('#intro-large', {
      scale: 1.018,
      duration: 0.35,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: 1
    }, '-=0.1')
    /* 6. Pausa dramática */
    .to({}, { duration: 0.85 });
}

/* Cortina sobe revelando o site */
function playOutro(overlay) {
  gsap.to(overlay, {
    yPercent: -100,
    duration: 1.1,
    ease: 'expo.inOut',
    onComplete: function () {
      overlay.remove();
      document.body.style.overflow = '';
      initAfterIntro();
    }
  });
}

/* =========================================
   APÓS O INTRO
   ========================================= */
function initAfterIntro() {
  initHeroAnimations();

  /* Aguarda um frame para ScrollTrigger calcular posições */
  requestAnimationFrame(function () {
    ScrollTrigger.refresh();
    initScrollAnimations();
  });
}

/* =========================================
   HERO — sequência após o intro
   ========================================= */
function initHeroAnimations() {
  /* Define estados iniciais explícitos */
  gsap.set('#navbar',                   { yPercent: -110 });
  gsap.set('.hero__eyebrow-line',        { scaleX: 0, transformOrigin: 'left center' });
  gsap.set('.hero__eyebrow-text',        { x: -24, opacity: 0 });
  gsap.set('.hero__headline-word',       { yPercent: 110 });
  gsap.set('.hero__subheadline',         { y: 24, opacity: 0 });
  gsap.set('.hero__actions .btn',        { y: 18, opacity: 0 });
  gsap.set('.hero__image-col',           { xPercent: 100 });
  gsap.set('.hero__image-tag',           { opacity: 0, y: 10 });
  gsap.set('.hero__overlay-word span',   { opacity: 0, y: 40 });
  gsap.set('.hero__info-item',           { y: 12, opacity: 0 });

  var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl
    .to('#navbar',                { yPercent: 0, duration: 0.65 },               0)
    .to('.hero__eyebrow-line',    { scaleX: 1, duration: 0.5 },                  0.35)
    .to('.hero__eyebrow-text',    { x: 0, opacity: 1, duration: 0.45 },          0.55)
    .to('.hero__headline-word',   { yPercent: 0, duration: 0.75,
                                    stagger: 0.14, ease: 'power4.out' },          0.55)
    .to('.hero__subheadline',     { y: 0, opacity: 1, duration: 0.6 },            0.95)
    .to('.hero__actions .btn',    { y: 0, opacity: 1, stagger: 0.1,
                                    duration: 0.5 },                              1.15)
    .to('.hero__image-col',       { xPercent: 0, duration: 1.0,
                                    ease: 'power4.inOut' },                       0.2)
    .to('.hero__image-tag',       { opacity: 1, y: 0, duration: 0.4 },           1.1)
    .to('.hero__overlay-word span',{ opacity: 1, y: 0, duration: 0.85,
                                    ease: 'power2.out' },                         1.2)
    .to('.hero__info-item',       { y: 0, opacity: 1, stagger: 0.07,
                                    duration: 0.45 },                             1.35);
}

/* =========================================
   SCROLL ANIMATIONS — ScrollTrigger
   ========================================= */
function initScrollAnimations() {

  var defaults = { ease: 'power3.out' };

  /* ── MARQUEE STRIP ─────────────────────── */
  gsap.from('.marquee-strip', {
    scrollTrigger: { trigger: '.marquee-strip', start: 'top 98%' },
    scaleX: 0,
    transformOrigin: 'left center',
    duration: 0.7,
    ease: 'power3.out'
  });

  /* ── GALERIA ────────────────────────────── */
  gsap.from('.gallery__item', {
    scrollTrigger: { trigger: '.gallery', start: 'top 88%' },
    opacity: 0,
    scale: 0.93,
    duration: 0.6,
    stagger: { amount: 1.0, from: 'start' },
    ease: 'power2.out',
    clearProps: 'transform'
  });

  /* ── PROPÓSITO ──────────────────────────── */
  gsap.from('.proposito__img-main', {
    scrollTrigger: { trigger: '.proposito__grid', start: 'top 80%' },
    x: -80, opacity: 0, duration: 1.0,
    ease: 'power3.out'
  });

  gsap.from('.proposito__img-secondary', {
    scrollTrigger: { trigger: '.proposito__grid', start: 'top 78%' },
    x: -55, opacity: 0, duration: 1.0, delay: 0.2,
    ease: 'power3.out'
  });

  gsap.from('.proposito__deco', {
    scrollTrigger: { trigger: '.proposito__grid', start: 'top 74%' },
    scale: 0, rotation: -90, duration: 0.75, delay: 0.45,
    ease: 'back.out(2.5)'
  });

  gsap.timeline({
    scrollTrigger: { trigger: '.proposito__content', start: 'top 82%' },
    defaults: defaults
  })
    .from('.proposito__eyebrow', { x: 28, opacity: 0, duration: 0.5 })
    .from('.proposito__title',   { y: 40, opacity: 0, duration: 0.75,
                                   ease: 'power3.out' }, '-=0.2')
    .from('.proposito__text',    { y: 22, opacity: 0, stagger: 0.15,
                                   duration: 0.5 }, '-=0.3')
    .from('.proposito__cta .btn',{ y: 14, opacity: 0, duration: 0.4 }, '-=0.15');

  /* ── OFERTAS ─────────────────────────────── */
  gsap.timeline({
    scrollTrigger: { trigger: '.ofertas', start: 'top 84%' },
    defaults: defaults
  })
    .from('.ofertas .section-header__eyebrow',  { y: 16, opacity: 0, duration: 0.4 })
    .from('.ofertas .section-header__title',    { y: 30, opacity: 0, duration: 0.6 }, '-=0.1')
    .from('.ofertas .section-header__subtitle', { y: 12, opacity: 0, duration: 0.4 }, '-=0.2');

  gsap.from('.product-card', {
    scrollTrigger: { trigger: '.ofertas__grid', start: 'top 84%' },
    y: 65, opacity: 0, stagger: 0.18, duration: 0.8,
    ease: 'power3.out'
  });

  gsap.from('.ofertas__note', {
    scrollTrigger: { trigger: '.ofertas__note', start: 'top 95%' },
    y: 10, opacity: 0, duration: 0.4
  });

  /* ── FORMULÁRIO ────────────────────────── */
  gsap.from('.formulario__card', {
    scrollTrigger: { trigger: '.formulario', start: 'top 84%' },
    y: 65, opacity: 0, duration: 0.9,
    ease: 'power3.out'
  });

  /* ── FAQ ─────────────────────────────────── */
  gsap.timeline({
    scrollTrigger: { trigger: '.faq', start: 'top 87%' },
    defaults: defaults
  })
    .from('.faq .section-header__eyebrow', { y: 14, opacity: 0, duration: 0.4 })
    .from('.faq .section-header__title',   { y: 24, opacity: 0, duration: 0.55 }, '-=0.1');

  gsap.from('.accordion-item', {
    scrollTrigger: { trigger: '.faq__list', start: 'top 90%' },
    x: -24, opacity: 0, stagger: 0.07, duration: 0.45,
    ease: 'power2.out'
  });

  /* ── FOOTER ─────────────────────────────── */
  gsap.from('.footer__logo, .footer__divider, .footer__copy', {
    scrollTrigger: { trigger: '.footer', start: 'top 94%' },
    y: 22, opacity: 0, stagger: 0.12, duration: 0.5
  });

  /* ── PARALLAX: imagem do hero ─────────── */
  if (window.innerWidth > 768) {
    gsap.to('.hero__image-col img', {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      },
      yPercent: 18,
      ease: 'none'
    });

    /* CREATIVITY desloca levemente no scroll */
    gsap.to('.hero__overlay-word span', {
      scrollTrigger: {
        trigger: '.hero__overlay-word',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2
      },
      x: '-5vw',
      ease: 'none'
    });
  }
}

})(); // fecha IIFE
