

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


/*    1. THEME TOGGLE */

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


/* 2. MOBILE NAVIGATION */

const hamburgerBtn = $('#hamburger');
const mobileMenu   = $('#mobile-menu');
const mobileLinks  = $$('.mobile-link');

function toggleMobileMenu() {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  mobileMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
}

hamburgerBtn.addEventListener('click', toggleMobileMenu);

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
});


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


document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    mobileMenu.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburgerBtn.focus(); // Return focus to trigger
  }
});


/* 3. SCROLL-REVEAL ANIMATIONS */

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

/* 4. NAV — HEADER SCROLL SHADOW*/
const siteHeader = $('.site-header');

const headerObserver = new IntersectionObserver(
  ([entry]) => {
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

/*  6. FOOTER YEAR AUTO-UPDATE*/

const footerYear = $('#footer-year');
if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}


/*  7. TERMINAL TYPING EFFECT (Hero) */

function initTerminalAnimation() {
  const terminalLines = $$('.terminal-body p');
  if (!terminalLines.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  terminalLines.forEach(line => {
    line.style.opacity = '0';
    line.style.transform = 'translateX(-4px)';
    line.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
  });

  terminalLines.forEach((line, i) => {
    setTimeout(() => {
      line.style.opacity = '1';
      line.style.transform = 'translateX(0)';
    }, 600 + i * 220);
  });
}

initTerminalAnimation();

