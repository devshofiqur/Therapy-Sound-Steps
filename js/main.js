/* ══════════════════════════════════════════════
   SOUNDSTEPS — MAIN JAVASCRIPT
   Handles: Navbar scroll, form validation,
   scroll reveal, back-to-top, step animations,
   and analytics event tracking stubs.
   ══════════════════════════════════════════════ */

'use strict';

// ─── DOM READY ────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initScrollReveal();
  initStepAnimations();
  initFormValidation();
  initBackToTop();
  initSmoothAnchors();
  initAnalyticsTracking();
});

// ─── NAVBAR SCROLL EFFECT ─────────────────────
function initNavbarScroll() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  const handleScroll = () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run on load
}

// ─── SCROLL REVEAL ────────────────────────────
function initScrollReveal() {
  // Add ss-reveal to key elements
  const revealTargets = document.querySelectorAll(
    '.ss-stat-card, .ss-pain-card, .ss-approach-card, .ss-mission-values, .ss-section-title, .ss-value-pill'
  );

  revealTargets.forEach(el => el.classList.add('ss-reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children within the same parent
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  // Stagger siblings
  revealTargets.forEach((el, idx) => {
    const siblings = el.parentElement ? Array.from(el.parentElement.children) : [];
    const siblingIndex = siblings.indexOf(el);
    el.dataset.delay = siblingIndex * 100;
    observer.observe(el);
  });
}

// ─── STEP ANIMATIONS ──────────────────────────
function initStepAnimations() {
  const steps = document.querySelectorAll('.ss-step');
  if (!steps.length) return;

  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const stepEl = entry.target;
        const index = Array.from(steps).indexOf(stepEl);
        setTimeout(() => {
          stepEl.classList.add('visible');
        }, index * 150);
        stepObserver.unobserve(stepEl);
      }
    });
  }, { threshold: 0.15 });

  steps.forEach(step => stepObserver.observe(step));
}

// ─── FORM VALIDATION & SUBMISSION ─────────────
function initFormValidation() {
  const form = document.getElementById('earlyAccessForm');
  const successDiv = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    e.stopPropagation();

    // Bootstrap validation
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      scrollToFirstInvalid(form);
      return;
    }

    // Validate radio group (support status)
    const supportRadios = form.querySelectorAll('input[name="supportStatus"]');
    const supportChecked = Array.from(supportRadios).some(r => r.checked);
    if (!supportChecked) {
      // Show a custom alert for the radio group
      showRadioError('Please select your child\'s support status.');
      form.classList.add('was-validated');
      return;
    }

    // Collect form data
    const formData = collectFormData(form);

    // Submit handler — replace with your actual endpoint or email service
    handleFormSubmission(formData, form, successDiv);
  });

  // Real-time input feedback
  const inputs = form.querySelectorAll('.ss-input');
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      if (form.classList.contains('was-validated')) {
        validateField(input);
      }
    });
    input.addEventListener('input', () => {
      if (input.value.trim() !== '') {
        input.classList.remove('is-invalid');
      }
    });
  });
}

function scrollToFirstInvalid(form) {
  const firstInvalid = form.querySelector(':invalid');
  if (firstInvalid) {
    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    firstInvalid.focus();
  }
}

function validateField(input) {
  if (!input.checkValidity()) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
  } else {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
  }
}

function showRadioError(message) {
  // Remove old error if present
  const old = document.getElementById('radioError');
  if (old) old.remove();

  const err = document.createElement('div');
  err.id = 'radioError';
  err.className = 'text-danger small mt-1';
  err.textContent = message;

  const radioGroup = document.querySelector('.ss-radio-label');
  if (radioGroup && radioGroup.parentElement) {
    radioGroup.parentElement.parentElement.appendChild(err);
    err.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => err.remove(), 5000);
  }
}

function collectFormData(form) {
  const data = {};
  const formData = new FormData(form);
  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }
  return data;
}

function handleFormSubmission(data, form, successDiv) {
  const submitBtn = form.querySelector('.ss-btn-submit');
  const btnText = submitBtn.querySelector('.btn-text');

  // Loading state
  submitBtn.disabled = true;
  btnText.textContent = 'Submitting…';

  // ── REPLACE THIS with your actual submission logic ──
  // e.g. fetch('/api/early-access', { method: 'POST', body: JSON.stringify(data) })
  // or integrate with Mailchimp / ConvertKit / EmailJS

  // Simulated async submission (2s delay)
  setTimeout(() => {
    // Track conversion event
    trackEvent('early_access_signup', {
      child_age: data.childAge,
      support_status: data.supportStatus,
      location: data.location
    });

    // Show success
    form.classList.add('d-none');
    if (successDiv) {
      successDiv.classList.remove('d-none');
      successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 2000);
}

// ─── BACK TO TOP ──────────────────────────────
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.remove('d-none');
    } else {
      btn.classList.add('d-none');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ─── SMOOTH ANCHORS ───────────────────────────
function initSmoothAnchors() {
  const anchors = document.querySelectorAll('a[href^="#"]');
  anchors.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      // Close mobile navbar if open
      const navCollapse = document.getElementById('navbarNav');
      if (navCollapse && navCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
      }

      const offset = document.getElementById('mainNav')?.offsetHeight || 80;
      const targetY = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });
}

// ─── ANALYTICS TRACKING ───────────────────────
/**
 * Centralised event tracking stub.
 * Replace with your GA4 gtag() calls or other analytics service.
 *
 * GA4 Setup:
 *   1. Add your GA_MEASUREMENT_ID to the <head> snippet in index.html
 *   2. Replace `console.log` below with `gtag('event', eventName, params)`
 *
 * Conversion goals to configure in GA4:
 *   - early_access_signup (Primary Conversion)
 *   - cta_click_hero
 *   - cta_click_approach
 *   - section_viewed (engagement)
 */
function trackEvent(eventName, params = {}) {
  // Google Analytics 4
  if (typeof gtag === 'function') {
    gtag('event', eventName, params);
  }

  // Debug log (remove in production)
  console.log('[SoundSteps Analytics]', eventName, params);
}

function initAnalyticsTracking() {
  // Track CTA button clicks
  document.querySelectorAll('.ss-btn-primary').forEach(btn => {
    btn.addEventListener('click', () => {
      trackEvent('cta_click', {
        button_text: btn.textContent.trim(),
        section: btn.closest('section')?.id || 'unknown'
      });
    });
  });

  // Track section views
  const sections = document.querySelectorAll('section[id]');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        trackEvent('section_viewed', { section_id: entry.target.id });
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => sectionObserver.observe(s));

  // Track form interactions
  const form = document.getElementById('earlyAccessForm');
  if (form) {
    let formStartTracked = false;
    form.addEventListener('focusin', () => {
      if (!formStartTracked) {
        trackEvent('form_start', { form_id: 'early_access' });
        formStartTracked = true;
      }
    });
  }
}

/*
 ══════════════════════════════════════════════
 TECH STACK RECOMMENDATION (for reference)
 ══════════════════════════════════════════════
 Option A — Static (current): HTML + CSS + JS + Bootstrap 5
   Best for: Speed, full control, low overhead
   Host: Netlify, Vercel, GitHub Pages (free tier)
   Forms: Formspree, Netlify Forms, or EmailJS
   Analytics: GA4 + Search Console

 Option B — Webflow
   Best for: Visual editing, no-code animations
   CMS: built-in, great for blog/FAQ
   Forms: native Webflow forms (basic)

 Option C — Framer
   Best for: Premium animations, modern look
   Interactive: scroll-linked animations, micro-interactions
   CMS: available

 Option D — Next.js (future scale)
   Best for: App integration, auth, user dashboards
   Can reuse this design system as a starting point

 RECOMMENDATION for MVP: Static (current setup)
   → Deploy to Netlify
   → Use Formspree for form submission
   → Add GA4 + Search Console from day 1
   → Migrate to Webflow or Framer if content updates needed regularly
 ══════════════════════════════════════════════
*/
