/**
 * app.js — Onedays Plumbing Services
 * Lightweight, optimised vanilla JS. No dependencies.
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────
   * 1. SMOOTH SCROLL (polyfill for anchor links)
   * ───────────────────────────────────────── */
  function initSmoothScroll() {
    const NAV_HEIGHT = 72; // px — matches sticky nav height

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;

        var target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        var targetTop =
          target.getBoundingClientRect().top + window.pageYOffset - NAV_HEIGHT;

        // Native smooth scroll — fast and modern
        if ('scrollBehavior' in document.documentElement.style) {
          window.scrollTo({ top: targetTop, behavior: 'smooth' });
        } else {
          // Fallback: manual easing for older WebViews (Termux/Spck)
          smoothScrollTo(targetTop, 600);
        }
      });
    });
  }

  function smoothScrollTo(targetY, duration) {
    var startY = window.pageYOffset;
    var distance = targetY - startY;
    var startTime = null;

    function ease(t) {
      return t < 0.5
        ? 2 * t * t
        : -1 + (4 - 2 * t) * t;
    }

    function step(currentTime) {
      if (!startTime) startTime = currentTime;
      var elapsed = currentTime - startTime;
      var progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + distance * ease(progress));
      if (elapsed < duration) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }


  /* ─────────────────────────────────────────
   * 2. MOBILE MENU TOGGLE
   * ───────────────────────────────────────── */
  function initMobileMenu() {
    var toggle     = document.getElementById('menu-toggle');
    var menu       = document.getElementById('mobile-menu');
    var iconOpen   = document.getElementById('menu-icon-open');
    var iconClose  = document.getElementById('menu-icon-close');
    var mobileLinks = document.querySelectorAll('.mobile-link');

    if (!toggle || !menu) return;

    function openMenu() {
      menu.classList.remove('hidden');
      iconOpen.classList.add('hidden');
      iconClose.classList.remove('hidden');
      toggle.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      menu.classList.add('hidden');
      iconOpen.classList.remove('hidden');
      iconClose.classList.add('hidden');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
      var isOpen = !menu.classList.contains('hidden');
      isOpen ? closeMenu() : openMenu();
    });

    // Close when a nav link is tapped
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (
        !menu.contains(e.target) &&
        !toggle.contains(e.target) &&
        !menu.classList.contains('hidden')
      ) {
        closeMenu();
      }
    });
  }


  /* ─────────────────────────────────────────
   * 3. NAVBAR SCROLL EFFECT
   * ───────────────────────────────────────── */
  function initNavbarScroll() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;

    function onScroll() {
      if (window.pageYOffset > 20) {
        navbar.style.boxShadow = '0 4px 32px rgba(0,0,0,0.4)';
      } else {
        navbar.style.boxShadow = 'none';
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }


  /* ─────────────────────────────────────────
   * 4. SCROLL REVEAL (Intersection Observer)
   * ───────────────────────────────────────── */
  function initScrollReveal() {
    var elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    if (!('IntersectionObserver' in window)) {
      // Fallback for old WebViews
      elements.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach(function (el) { observer.observe(el); });
  }


  /* ─────────────────────────────────────────
   * 5. URGENCY SELECTOR (radio button styling)
   * ───────────────────────────────────────── */
  function initUrgencySelector() {
    var options = document.querySelectorAll('.urgency-option');
    options.forEach(function (option) {
      var radio = option.querySelector('input[type="radio"]');
      var label = option.querySelector('.urgency-label');

      radio.addEventListener('change', function () {
        // Reset all
        options.forEach(function (opt) {
          var lbl = opt.querySelector('.urgency-label');
          lbl.style.borderColor = '#1E2840';
          lbl.style.background = '#0E1420';
          lbl.style.color = '#8A9AB8';
        });
        // Activate selected
        label.style.borderColor = 'rgba(0,200,255,0.6)';
        label.style.background = 'rgba(0,200,255,0.08)';
        label.style.color = '#00C8FF';
      });
    });
  }


  /* ─────────────────────────────────────────
   * 6. LEAD CAPTURE FORM — Validation + GA4 + Netlify
   * ───────────────────────────────────────── */
  function initLeadForm() {
    var form       = document.getElementById('lead-capture-form');
    var submitBtn  = document.getElementById('form-submit-btn');
    var btnLabel   = document.getElementById('btn-label');
    var btnIcon    = document.getElementById('btn-icon');
    var btnSpinner = document.getElementById('btn-spinner');
    var successDiv = document.getElementById('form-success');

    if (!form) return;

    // ── Client-side validation ──
    function validateField(input) {
      var errorEl = input.parentElement.querySelector('.field-error');
      var valid = true;

      if (input.required && !input.value.trim()) {
        valid = false;
      }

      if (input.type === 'email' && input.value.trim()) {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(input.value.trim())) {
          valid = false;
        }
      }

      if (input.type === 'tel' && input.value.trim()) {
        var phonePattern = /^[0-9\s\+\-\(\)]{7,15}$/;
        if (!phonePattern.test(input.value.trim())) {
          valid = false;
        }
      }

      if (errorEl) {
        errorEl.classList.toggle('hidden', valid);
      }

      return valid;
    }

    // Live validation on blur
    var requiredInputs = form.querySelectorAll('input[required], select[required]');
    requiredInputs.forEach(function (input) {
      input.addEventListener('blur', function () { validateField(input); });
      input.addEventListener('input', function () {
        if (!input.parentElement.querySelector('.field-error.hidden') === false) {
          validateField(input);
        }
      });
    });

    // ── GA4 event helper ──
    function fireLeadEvent(formData) {
      if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', {
          event_category:  'Lead Form',
          event_label:     formData.service || 'general',
          value:           1,
          form_name:       'onedays-lead-form',
          service_type:    formData.service || 'not_specified',
          urgency_level:   formData.urgency || 'not_specified',
          suburb:          formData.suburb  || 'not_specified',
        });
      }
    }

    // ── Collect form data as plain object ──
    function collectFormData() {
      var data = {};
      var elements = form.elements;
      for (var i = 0; i < elements.length; i++) {
        var el = elements[i];
        if (!el.name || el.name === 'bot-field') continue;
        if (el.type === 'radio' && !el.checked) continue;
        data[el.name] = el.value;
      }
      return data;
    }

    // ── Netlify form submission via fetch (SPA-friendly) ──
    function encodeFormData(data) {
      return Object.keys(data)
        .map(function (key) {
          return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
        })
        .join('&');
    }

    function setLoading(loading) {
      if (loading) {
        submitBtn.disabled = true;
        btnLabel.textContent = 'Sending…';
        btnIcon.classList.add('hidden');
        btnSpinner.classList.remove('hidden');
      } else {
        submitBtn.disabled = false;
        btnLabel.textContent = 'Send Quote Request';
        btnIcon.classList.remove('hidden');
        btnSpinner.classList.add('hidden');
      }
    }

    function showSuccess() {
      successDiv.classList.add('show');
    }

    // ── Form submit handler ──
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Validate all required fields
      var allValid = true;
      requiredInputs.forEach(function (input) {
        if (!validateField(input)) allValid = false;
      });

      if (!allValid) {
        // Scroll to first error
        var firstError = form.querySelector('.field-error:not(.hidden)');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      var formData = collectFormData();

      // Fire GA4 lead event BEFORE submission (non-blocking)
      fireLeadEvent(formData);

      setLoading(true);

      // Attempt Netlify fetch submission
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodeFormData(Object.assign({ 'form-name': 'onedays-lead-form' }, formData)),
      })
        .then(function (res) {
          // Netlify returns 200 on success; also handle redirects gracefully
          if (res.ok || res.status === 302 || res.redirected) {
            setLoading(false);
            showSuccess();
          } else {
            throw new Error('Server responded with status ' + res.status);
          }
        })
        .catch(function (err) {
          console.warn('Netlify fetch submission failed:', err);
          // Graceful fallback: fire native form POST (works on Netlify and Vercel)
          setLoading(false);
          form.submit();
        });
    });
  }


  /* ─────────────────────────────────────────
   * 7. FOOTER YEAR (auto-update)
   * ───────────────────────────────────────── */
  function initFooterYear() {
    var el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
  }


  /* ─────────────────────────────────────────
   * 8. FAQ ACCORDION
   * ───────────────────────────────────────── */
  function initFaqAccordion() {
    var items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach(function (item) {
      var trigger = item.querySelector('.faq-trigger');
      if (!trigger) return;

      trigger.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');

        // Close all others
        items.forEach(function (other) {
          if (other !== item) {
            other.classList.remove('open');
            var otherTrigger = other.querySelector('.faq-trigger');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current
        item.classList.toggle('open', !isOpen);
        trigger.setAttribute('aria-expanded', String(!isOpen));
      });
    });
  }


  /* ─────────────────────────────────────────
   * 9. INIT ALL
   * ───────────────────────────────────────── */
  function init() {
    initSmoothScroll();
    initMobileMenu();
    initNavbarScroll();
    initScrollReveal();
    initUrgencySelector();
    initLeadForm();
    initFooterYear();
    initFaqAccordion();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
