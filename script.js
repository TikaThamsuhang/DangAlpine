/* ============================================================
   ALPINE EDUCATIONAL CONSULTANCY — MAIN SCRIPT
   ============================================================ */

'use strict';

/* ---- Footer year ---- */
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---- Navbar scroll behaviour ---- */
const navbar = document.getElementById('navbar');
let lastScrollY = 0;

function onScroll() {
  const scrollY = window.scrollY;
  if (navbar) {
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  lastScrollY = scrollY;
}

window.addEventListener('scroll', onScroll, { passive: true });

/* ---- Active nav link on scroll ---- */
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
  const offset = 120;
  let current = '';
  sections.forEach(section => {
    const top = section.getBoundingClientRect().top;
    if (top <= offset) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href && href === '#' + current) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });

/* ---- Mobile hamburger menu ---- */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('nav-links');

if (hamburger && navLinksEl) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinksEl.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on nav link click
  navLinksEl.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinksEl.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (navLinksEl.classList.contains('open') &&
        !navLinksEl.contains(e.target) &&
        !hamburger.contains(e.target)) {
      navLinksEl.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/* ---- Scroll reveal animations ---- */
function initScrollReveal() {
  const elements = document.querySelectorAll('[data-animate]');

  if (!('IntersectionObserver' in window)) {
    // Fallback: show all immediately
    elements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay || 0, 10);
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

initScrollReveal();

/* ---- Enquiry Form Validation & Submission ---- */
const form = document.getElementById('enquiry-form');
const formSuccess = document.getElementById('form-success');
const submitBtn = document.getElementById('form-submit-btn');

function validateField(field) {
  const id = field.id;
  const errorEl = document.getElementById(id + '-error') ||
                  document.getElementById(id.replace('-', '') + '-error');
  let valid = true;
  let msg = '';

  field.classList.remove('error');

  if (field.required && !field.value.trim()) {
    valid = false;
    msg = 'This field is required.';
  } else if (id === 'email-address' && field.value.trim()) {
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(field.value.trim())) {
      valid = false;
      msg = 'Please enter a valid email address.';
    }
  } else if (id === 'phone-number' && field.value.trim()) {
    const phoneRx = /^[0-9+\s()-]{7,}$/;
    if (!phoneRx.test(field.value.trim())) {
      valid = false;
      msg = 'Please enter a valid phone number.';
    }
  }

  if (!valid) {
    field.classList.add('error');
    if (errorEl) errorEl.textContent = msg;
  } else {
    if (errorEl) errorEl.textContent = '';
  }

  return valid;
}

if (form) {
  // Live validation on blur
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) validateField(field);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all required fields
    const requiredFields = form.querySelectorAll('[required]');
    let allValid = true;
    requiredFields.forEach(field => {
      if (!validateField(field)) allValid = false;
    });

    // Also validate email if filled
    const emailField = document.getElementById('email-address');
    if (emailField && emailField.value.trim()) {
      if (!validateField(emailField)) allValid = false;
    }

    if (!allValid) return;

    // Simulate form submission (replace with actual backend/form service)
    const btnText = submitBtn.querySelector('.btn-text');
    submitBtn.disabled = true;
    if (btnText) btnText.textContent = 'Sending…';

    // Build mailto as a fallback action
    const name    = document.getElementById('full-name').value.trim();
    const phone   = document.getElementById('phone-number').value.trim();
    const email   = document.getElementById('email-address').value.trim();
    const service = document.getElementById('service-interest').value;
    const dest    = document.getElementById('destination-country').value;
    const msg     = document.getElementById('message').value.trim();

    const subject = encodeURIComponent('Study Abroad Enquiry — Alpine Educational Consultancy');
    const body = encodeURIComponent(
      `Name: ${name}\nPhone: ${phone}\nEmail: ${email || 'Not provided'}\n` +
      `Service: ${service}\nPreferred Destination: ${dest || 'Not selected'}\n\n` +
      `Message:\n${msg || 'No message provided.'}`
    );

    // Show success message after brief delay
    setTimeout(() => {
      submitBtn.disabled = false;
      if (btnText) btnText.textContent = 'Send Enquiry';
      form.reset();
      if (formSuccess) {
        formSuccess.removeAttribute('hidden');
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      // Open mailto
      window.location.href = `mailto:alpineeducationalconsultancy@gmail.com?subject=${subject}&body=${body}`;
    }, 800);
  });
}

/* ---- Smooth scroll for hash links ---- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ---- Load More Gallery Cards ---- */
(function initLoadMore() {
  const loadMoreBtn = document.getElementById('gallery-load-more');
  if (!loadMoreBtn) return;

  const lmText  = loadMoreBtn.querySelector('.lm-text');
  const lmCount = loadMoreBtn.querySelector('.lm-count');
  const lmIcon  = loadMoreBtn.querySelector('svg');
  const VISIBLE = 8; // number of cards visible by default
  let expanded  = false;

  loadMoreBtn.addEventListener('click', () => {
    expanded = !expanded;

    if (expanded) {
      // Reveal all hidden cards with fade-in
      document.querySelectorAll('.success-card.sc-hidden').forEach(card => {
        card.classList.remove('sc-hidden');
        card.classList.remove('is-visible');
        void card.offsetHeight;
        setTimeout(() => card.classList.add('is-visible'), 20);
      });
      lmText.textContent     = 'Show less';
      lmCount.textContent    = '';
      lmIcon.style.transform = 'rotate(180deg)';
    } else {
      // Re-hide the extra cards
      const allCards = Array.from(document.querySelectorAll('.success-card'));
      const hiddenCount = allCards.length - VISIBLE;
      allCards.slice(VISIBLE).forEach(card => {
        card.classList.add('sc-hidden');
        card.classList.remove('is-visible');
      });
      lmText.textContent     = 'Load more';
      lmCount.textContent    = `(${hiddenCount})`;
      lmIcon.style.transform = '';
      // Scroll back to section top so user isn't left at bottom
      const section = document.getElementById('success-stories');
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
})();

/* ---- Gallery Lightbox ---- */
(function initLightbox() {
  // Collect all gallery images from success cards
  function getGalleryImages() {
    return Array.from(document.querySelectorAll('.sc-photo.gallery-img')).map(img => ({
      src: img.src,
      alt: img.alt
    }));
  }

  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lightbox-img');
  const lbCounter = document.getElementById('lightbox-counter');
  const lbClose   = document.getElementById('lightbox-close');
  const lbPrev    = document.getElementById('lightbox-prev');
  const lbNext    = document.getElementById('lightbox-next');

  if (!lightbox || !lbImg) return;

  let images = [];
  let currentIndex = 0;

  function openLightbox(index) {
    images = getGalleryImages(); // refresh (in case load-more revealed more)
    currentIndex = Math.min(index, images.length - 1);
    showImage(currentIndex);
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  function showImage(index) {
    lbImg.style.animation = 'none';
    void lbImg.offsetHeight;
    lbImg.style.animation = '';
    lbImg.src = images[index].src;
    lbImg.alt = images[index].alt;
    lbCounter.textContent = (index + 1) + ' / ' + images.length;
  }

  function prev() {
    images = getGalleryImages();
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
  }

  function next() {
    images = getGalleryImages();
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  }

  // Click on photo wrap opens lightbox
  document.querySelectorAll('.sc-photo-wrap').forEach((wrap, idx) => {
    wrap.style.cursor = 'pointer';
    wrap.addEventListener('click', () => openLightbox(idx));
  });

  // Click on "View photo →" link also opens lightbox
  document.querySelectorAll('.sc-view-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const idx = parseInt(link.dataset.index || '0', 10);
      openLightbox(idx);
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', prev);
  lbNext.addEventListener('click', next);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.hasAttribute('hidden')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });

  // Touch swipe
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
  }, { passive: true });
})();
