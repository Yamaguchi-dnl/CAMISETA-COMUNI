/* ============================================
   ANIMATIONS.JS — IAP Camisetas
   Intro: CSS puro | Hero + Scroll: GSAP
   ============================================ */

(function () {

  var overlay   = document.getElementById('intro-overlay');
  var exitDone  = false;

  /* ------------------------------------------
     Trava scroll enquanto o intro roda
  ------------------------------------------ */
  if (overlay) {
    document.body.style.overflow = 'hidden';
  }

  /* ------------------------------------------
     Callback único chamado quando intro termina
  ------------------------------------------ */
  function onIntroComplete() {
    if (exitDone) return;
    exitDone = true;

    if (overlay) {
      overlay.style.display = 'none';
      overlay.remove();
    }
    document.body.style.overflow = '';

    /* Hero */
    if (typeof gsap !== 'undefined') {
      runHeroGSAP();
    }

    /* Scroll — aguarda 1 frame para o layout estar estável */
    requestAnimationFrame(function () {
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        runScrollGSAP();
      } else {
        runIntersectionFallback();
      }
    });
  }

  /* ------------------------------------------
     Aguarda o CSS @keyframes "intro-curtain-up"
     + timeout de segurança
  ------------------------------------------ */
  if (overlay) {
    overlay.addEventListener('animationend', function (e) {
      if (e.animationName === 'intro-curtain-up') {
        onIntroComplete();
      }
    });
    /* Segurança: se evento não disparar em 5.5s, libera o site */
    setTimeout(onIntroComplete, 5500);
  } else {
    /* Sem overlay — inicia imediatamente */
    onIntroComplete();
  }

  /* ==========================================
     HERO — sequência GSAP após intro
  ========================================== */
  function runHeroGSAP() {
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl
      .from('#navbar',                 { yPercent: -110, duration: 0.6 },                    0)
      .from('.hero__eyebrow-line',     { scaleX: 0, duration: 0.45,
                                         transformOrigin: 'left center' },                   0.3)
      .from('.hero__eyebrow-text',     { x: -20, opacity: 0, duration: 0.4 },               0.5)
      .from('.hero__headline-word',    { yPercent: 110, stagger: 0.14,
                                         duration: 0.7, ease: 'power4.out' },               0.5)
      .from('.hero__subheadline',      { y: 22, opacity: 0, duration: 0.55 },               0.9)
      .from('.hero__actions .btn',     { y: 16, opacity: 0, stagger: 0.1,
                                         duration: 0.45 },                                   1.1)
      .from('.hero__image-col',        { xPercent: 100, duration: 0.95,
                                         ease: 'power4.inOut' },                             0.15)
      .from('.hero__image-tag',        { opacity: 0, y: 8, duration: 0.35 },                1.05)
      .from('.hero__overlay-word span',{ opacity: 0, y: 36, duration: 0.8,
                                         ease: 'power2.out' },                              1.2)
      .from('.hero__info-item',        { y: 10, opacity: 0, stagger: 0.07,
                                         duration: 0.4 },                                   1.3);
  }

  /* ==========================================
     SCROLL — ScrollTrigger
  ========================================== */
  function runScrollGSAP() {

    /* Marquee */
    gsap.from('.marquee-strip', {
      scrollTrigger: { trigger: '.marquee-strip', start: 'top 98%' },
      scaleX: 0, transformOrigin: 'left', duration: 0.65, ease: 'power3.out'
    });

    /* Galeria */
    gsap.from('.gallery__item', {
      scrollTrigger: { trigger: '.gallery', start: 'top 88%' },
      opacity: 0, scale: 0.93, duration: 0.6,
      stagger: { amount: 0.9, from: 'start' },
      ease: 'power2.out', clearProps: 'transform'
    });

    /* Propósito — imagens */
    gsap.from('.proposito__img-main', {
      scrollTrigger: { trigger: '.proposito__grid', start: 'top 80%' },
      x: -70, opacity: 0, duration: 0.9, ease: 'power3.out'
    });
    gsap.from('.proposito__img-secondary', {
      scrollTrigger: { trigger: '.proposito__grid', start: 'top 78%' },
      x: -50, opacity: 0, duration: 0.9, delay: 0.2, ease: 'power3.out'
    });
    gsap.from('.proposito__deco', {
      scrollTrigger: { trigger: '.proposito__grid', start: 'top 74%' },
      scale: 0, rotation: -90, duration: 0.7, delay: 0.45, ease: 'back.out(2.5)'
    });

    /* Propósito — conteúdo */
    gsap.timeline({
      scrollTrigger: { trigger: '.proposito__content', start: 'top 82%' }
    })
      .from('.proposito__eyebrow', { x: 24, opacity: 0, duration: 0.5 })
      .from('.proposito__title',   { y: 36, opacity: 0, duration: 0.7,
                                     ease: 'power3.out' }, '-=0.2')
      .from('.proposito__text',    { y: 20, opacity: 0, stagger: 0.15,
                                     duration: 0.5 }, '-=0.3')
      .from('.proposito__cta .btn',{ y: 12, opacity: 0, duration: 0.4 }, '-=0.15');

    /* Ofertas */
    gsap.timeline({
      scrollTrigger: { trigger: '.ofertas', start: 'top 84%' }
    })
      .from('.ofertas .section-header__eyebrow',  { y: 14, opacity: 0, duration: 0.4 })
      .from('.ofertas .section-header__title',    { y: 28, opacity: 0, duration: 0.6,
                                                    ease: 'power3.out' }, '-=0.1')
      .from('.ofertas .section-header__subtitle', { y: 12, opacity: 0, duration: 0.4 }, '-=0.2');

    gsap.from('.product-card', {
      scrollTrigger: { trigger: '.ofertas__grid', start: 'top 84%' },
      y: 60, opacity: 0, stagger: 0.18, duration: 0.75, ease: 'power3.out'
    });

    /* Formulário */
    gsap.from('.formulario__card', {
      scrollTrigger: { trigger: '.formulario', start: 'top 84%' },
      y: 60, opacity: 0, duration: 0.85, ease: 'power3.out'
    });

    /* FAQ */
    gsap.timeline({
      scrollTrigger: { trigger: '.faq', start: 'top 87%' }
    })
      .from('.faq .section-header__eyebrow', { y: 12, opacity: 0, duration: 0.4 })
      .from('.faq .section-header__title',   { y: 22, opacity: 0, duration: 0.5 }, '-=0.1');

    gsap.from('.accordion-item', {
      scrollTrigger: { trigger: '.faq__list', start: 'top 90%' },
      x: -20, opacity: 0, stagger: 0.07, duration: 0.4, ease: 'power2.out'
    });

    /* Footer */
    gsap.from('.footer__logo, .footer__divider, .footer__copy', {
      scrollTrigger: { trigger: '.footer', start: 'top 94%' },
      y: 20, opacity: 0, stagger: 0.12, duration: 0.5
    });

    /* Parallax hero image */
    if (window.innerWidth > 768) {
      gsap.to('.hero__image-col img', {
        scrollTrigger: { trigger: '.hero', start: 'top top',
                         end: 'bottom top', scrub: 1.5 },
        yPercent: 18, ease: 'none'
      });
      gsap.to('.hero__overlay-word span', {
        scrollTrigger: { trigger: '.hero__overlay-word',
                         start: 'top bottom', end: 'bottom top', scrub: 2 },
        x: '-5vw', ease: 'none'
      });
    }
  }

  /* ==========================================
     FALLBACK — IntersectionObserver
     (quando GSAP não carrega)
  ========================================== */
  function runIntersectionFallback() {
    /* Mostra todos os .reveal imediatamente */
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.style.opacity   = '1';
      el.style.transform = 'none';
      el.style.transition = 'none';
    });

    if (!('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.gallery__item, .product-card, .accordion-item').forEach(function (el) {
      observer.observe(el);
    });
  }

})();
