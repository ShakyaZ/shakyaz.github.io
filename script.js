/**
 * SOC Analyst Portfolio — script.js
 * =============================================
 * Handles:
 *  1. Dark/Light theme toggle (localStorage + system preference)
 *  2. Mobile navigation menu
 *  3. Scroll-reveal animations (Intersection Observer)
 *  4. Contact form validation & submission feedback
 *  5. Footer year auto-update
 *  6. Smooth nav scroll & active-link tracking
 * =============================================
 */

/* ── 0. UTILS ── */

/**
 * Query helper — shorthand for document.querySelector
 * @param {string} selector
 * @param {Element|Document} context
 * @returns {Element|null}
 */
const $ = (selector, context = document) => context.querySelector(selector);

/**
 * QueryAll helper — shorthand for document.querySelectorAll
 * @param {string} selector
 * @param {Element|Document} context
 * @returns {NodeList}
 */
const $$ = (selector, context = document) => context.querySelectorAll(selector);


/* ══════════════════════════════════════════════
   1. THEME TOGGLE
   ══════════════════════════════════════════════ */

const THEME_KEY       = 'portfolio-theme';   // localStorage key
const DARK_THEME      = 'dark';
const LIGHT_THEME     = 'light';
const themeToggleBtn  = $('#theme-toggle');
const htmlEl          = document.documentElement;

/**
 * Detect initial theme:
 * Priority: localStorage > system prefers-color-scheme > dark (default)
 * @returns {'dark'|'light'}
 */
function getInitialTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === DARK_THEME || stored === LIGHT_THEME) return stored;

  // Fallback to system preference
  if (window.matchMedia('(prefers-color-scheme: light)').matches) return LIGHT_THEME;
  return DARK_THEME;
}

/**
 * Apply a theme to <html> and update the toggle button's aria-pressed state.
 * @param {'dark'|'light'} theme
 */
function applyTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  themeToggleBtn.setAttribute('aria-pressed', theme === DARK_THEME ? 'true' : 'false');
  themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === DARK_THEME ? 'light' : 'dark'} mode`);
}

// Toggle between themes on button click
themeToggleBtn.addEventListener('click', () => {
  const current = htmlEl.getAttribute('data-theme');
  applyTheme(current === DARK_THEME ? LIGHT_THEME : DARK_THEME);
});

// Apply initial theme immediately (before first paint if possible)
applyTheme(getInitialTheme());

// Also respond if the OS-level theme changes while the page is open
window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
  // Only auto-switch if the user hasn't set a manual preference
  if (!localStorage.getItem(THEME_KEY)) {
    applyTheme(e.matches ? LIGHT_THEME : DARK_THEME);
  }
});


/* ══════════════════════════════════════════════
   2. MOBILE NAVIGATION
   ══════════════════════════════════════════════ */

const hamburgerBtn = $('#hamburger');
const mobileMenu   = $('#mobile-menu');
const mobileLinks  = $$('.mobile-link');

/**
 * Toggle the mobile menu open/closed and update ARIA attributes.
 */
function toggleMobileMenu() {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  mobileMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
}

hamburgerBtn.addEventListener('click', toggleMobileMenu);

// Close mobile menu when a nav link is tapped
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
});

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  if (
    mobileMenu.classList.contains('open') &&
    !mobileMenu.contains(e.target) &&
    !hamburgerBtn.contains(e.target)
  ) {
    mobileMenu.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }
});

// Close mobile menu on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    mobileMenu.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburgerBtn.focus(); // Return focus to trigger
  }
});


/* ══════════════════════════════════════════════
   3. SCROLL-REVEAL ANIMATIONS
   ══════════════════════════════════════════════ */

/**
 * Observe all .reveal elements and toggle the .visible class
 * when they enter the viewport. Uses Intersection Observer for
 * performance (no scroll event listeners required).
 */
function initScrollReveal() {
  const revealEls = $$('.reveal');

  if (!revealEls.length) return;

  // Respect prefers-reduced-motion — reveal everything immediately
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealEls.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        // Stagger sibling reveals within the same parent container
        const siblings = Array.from(
          entry.target.parentElement?.querySelectorAll('.reveal') || []
        );
        const siblingIndex = siblings.indexOf(entry.target);
        const delay = Math.min(siblingIndex * 60, 300); // Cap at 300ms stagger

        if (entry.intersectionRatio >= 0.12) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
        } else {
          entry.target.classList.remove('visible');
        }
      });
    },
    {
      threshold: [0, 0.12],     // Trigger when element enters or leaves the viewport
      rootMargin: '0px 0px -40px 0px', // Trigger slightly before bottom edge
    }
  );

  revealEls.forEach(el => observer.observe(el));
}

initScrollReveal();


/* ══════════════════════════════════════════════
   4. NAV — HEADER SCROLL SHADOW
   ══════════════════════════════════════════════ */

/**
 * Add a visual shadow to the header when the page is scrolled
 * to separate it from page content.
 */
const siteHeader = $('.site-header');

const headerObserver = new IntersectionObserver(
  ([entry]) => {
    // When the sentinel (top of page) leaves viewport, header is "scrolled"
    siteHeader.style.boxShadow = entry.isIntersecting
      ? 'none'
      : '0 2px 16px rgba(0,0,0,0.3)';
  },
  { threshold: 1.0 }
);

// Create a small invisible sentinel at the very top of the page
const scrollSentinel = document.createElement('div');
scrollSentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;';
document.body.prepend(scrollSentinel);
headerObserver.observe(scrollSentinel);


/* ══════════════════════════════════════════════
   5. CONTACT FORM
   ══════════════════════════════════════════════ */

const contactForm   = $('#contact-form');
const formStatus    = $('#form-status');

/**
 * Simple email regex — not RFC-exhaustive but catches most errors.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Show a status message beneath the form.
 * @param {string} message
 * @param {'success'|'error'|''} type
 */
function showFormStatus(message, type = '') {
  formStatus.textContent = message;
  formStatus.className   = `form-status ${type}`;
}

/**
 * Clear the form status message.
 */
function clearFormStatus() {
  formStatus.textContent = '';
  formStatus.className   = 'form-status';
}

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFormStatus();

    // Gather field values
    const name    = $('#form-name', contactForm).value.trim();
    const email   = $('#form-email', contactForm).value.trim();
    const message = $('#form-message', contactForm).value.trim();

    // Basic validation
    if (!name) {
      showFormStatus('Please enter your name.', 'error');
      $('#form-name', contactForm).focus();
      return;
    }
    if (!email || !isValidEmail(email)) {
      showFormStatus('Please enter a valid email address.', 'error');
      $('#form-email', contactForm).focus();
      return;
    }
    if (!message) {
      showFormStatus('Please add a message.', 'error');
      $('#form-message', contactForm).focus();
      return;
    }

    // ──────────────────────────────────────────────────────────────
    // FORM SUBMISSION OPTIONS — uncomment one of the following:
    //
    // OPTION A: Formspree
    //   1. Sign up at https://formspree.io
    //   2. Create a form and copy your form ID
    //   3. Uncomment the fetch block below and replace YOUR_FORM_ID
    //
    // OPTION B: Netlify Forms
    //   1. Add `netlify` attribute and `data-netlify="true"` to <form>
    //   2. Remove the JS submit handler and let Netlify handle it
    //
    // OPTION C: EmailJS
    //   1. Set up at https://www.emailjs.com
    //   2. Use their SDK (add <script> to HTML) and call emailjs.send(...)
    // ──────────────────────────────────────────────────────────────

    /* --- OPTION A: Formspree (uncomment & configure) ---
    const FORMSPREE_ID = 'YOUR_FORM_ID'; // REPLACE with your Formspree form ID

    try {
      const submitBtn = contactForm.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        showFormStatus('✓ Message sent! I\'ll get back to you soon.', 'success');
        contactForm.reset();
      } else {
        showFormStatus('Something went wrong. Please try emailing directly.', 'error');
      }

      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message →';
    } catch {
      showFormStatus('Network error. Please try again or email directly.', 'error');
      const submitBtn = contactForm.querySelector('[type="submit"]');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message →';
    }
    */

    // ── Default / Demo behaviour (no backend connected) ──
    // Remove this block once a real submission method is configured above.
    showFormStatus('✓ Demo mode — connect a form backend to send messages.', 'success');
    contactForm.reset();
  });
}


/* ══════════════════════════════════════════════
   6. FOOTER YEAR AUTO-UPDATE
   ══════════════════════════════════════════════ */

const footerYear = $('#footer-year');
if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}


/* ══════════════════════════════════════════════
   7. TERMINAL TYPING EFFECT (Hero)
   ══════════════════════════════════════════════ */

/**
 * Animates terminal lines appearing one by one with a short delay,
 * giving the impression of a live console session.
 */
function initTerminalAnimation() {
  const terminalLines = $$('.terminal-body p');
  if (!terminalLines.length) return;

  // Respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Hide all lines initially
  terminalLines.forEach(line => {
    line.style.opacity = '0';
    line.style.transform = 'translateX(-4px)';
    line.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
  });

  // Reveal each line in sequence
  terminalLines.forEach((line, i) => {
    setTimeout(() => {
      line.style.opacity = '1';
      line.style.transform = 'translateX(0)';
    }, 600 + i * 220);
  });
}

initTerminalAnimation();


/* ══════════════════════════════════════════════
   END OF SCRIPT
   ══════════════════════════════════════════════ */
