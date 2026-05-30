(function () {
  const STORAGE_KEY = 'oneheart-language';
  const DEFAULT_LANG = 'en';
  const SUPPORTED_LANGS = ['en', 'ar'];
  const TRANSLATE_CONTAINER_ID = 'google_translate_element';

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #${TRANSLATE_CONTAINER_ID} { display: none !important; }
      .goog-te-banner-frame.skiptranslate { display: none !important; }
      iframe.goog-te-banner-frame { display: none !important; }
      body > .skiptranslate { display: none !important; }
      .goog-te-gadget { display: none !important; }
      .goog-tooltip { display: none !important; }
      .goog-text-highlight { background: none !important; box-shadow: none !important; }
      html, body { top: 0 !important; position: static !important; }

      .lang-switch-btn {
        border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
        background: linear-gradient(135deg, var(--primary, #6b2c91), var(--secondary, #00b4d8));
        color: #ffffff;
        font-weight: 700;
        font-size: 0.85rem;
        letter-spacing: 0.04em;
        padding: 8px 14px;
        border-radius: 999px;
        cursor: pointer;
        transition: transform 0.2s ease, filter 0.2s ease;
      }

      .lang-switch-btn:hover {
        transform: translateY(-1px);
        filter: brightness(1.05);
      }

      .lang-switch-btn:active {
        transform: translateY(0);
      }

      html[dir="rtl"] .navbar {
        direction: rtl;
      }

      html[dir="rtl"] .nav-links {
        direction: rtl;
      }

      @media (max-width: 900px) {
        .lang-switch-btn {
          padding: 7px 12px;
          font-size: 0.8rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function setCookie(name, value, days) {
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expiryDate.toUTCString()};path=/`;
  }

  function getCookie(name) {
    const matches = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return matches ? matches[1] : null;
  }

  function getSavedLanguage() {
    const fromStorage = localStorage.getItem(STORAGE_KEY);
    if (SUPPORTED_LANGS.includes(fromStorage)) return fromStorage;

    const googTrans = getCookie('googtrans');
    if (googTrans) {
      if (googTrans.endsWith('/ar')) return 'ar';
      if (googTrans.endsWith('/en')) return 'en';
    }

    return DEFAULT_LANG;
  }

  function setSavedLanguage(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    setCookie('googtrans', `/en/${lang}`, 365);
  }

  function ensureTranslateContainer() {
    let el = document.getElementById(TRANSLATE_CONTAINER_ID);
    if (!el) {
      el = document.createElement('div');
      el.id = TRANSLATE_CONTAINER_ID;
      document.body.appendChild(el);
    }
  }

  function applyDirection(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  function updateButtonLabel(button, currentLang) {
    button.textContent = currentLang === 'ar' ? 'EN' : 'AR';
    button.setAttribute('aria-label', currentLang === 'ar' ? 'Switch language to English' : 'Switch language to Arabic');
    button.title = currentLang === 'ar' ? 'English' : 'Arabic';
  }

  function applyTranslateSelection(lang, tries) {
    const combo = document.querySelector('.goog-te-combo');
    if (combo) {
      if (combo.value !== lang) {
        combo.value = lang;
        combo.dispatchEvent(new Event('change'));
      }
      return;
    }

    if (tries > 0) {
      setTimeout(function () {
        applyTranslateSelection(lang, tries - 1);
      }, 250);
    }
  }

  function suppressGoogleUi() {
    const bannerFrame = document.querySelector('iframe.goog-te-banner-frame');
    if (bannerFrame) bannerFrame.style.display = 'none';

    const topBanner = document.querySelector('body > .skiptranslate');
    if (topBanner) topBanner.style.display = 'none';

    document.body.style.top = '0px';
    document.documentElement.style.top = '0px';
  }

  function ensureLanguageApplied() {
    const lang = getSavedLanguage();
    setSavedLanguage(lang);
    applyDirection(lang);
    applyTranslateSelection(lang, 30);
    suppressGoogleUi();
  }

  function loadGoogleTranslateScript() {
    if (window.google && window.google.translate && window.google.translate.TranslateElement) {
      return;
    }

    if (!document.getElementById('google-translate-script')) {
      window.googleTranslateElementInit = function () {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,ar',
            autoDisplay: false
          },
          TRANSLATE_CONTAINER_ID
        );

        ensureLanguageApplied();
      };

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.head.appendChild(script);
    }
  }

  function createSwitcherButton() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return null;

    const mobileButton = navbar.querySelector('.mobile-menu-btn');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'lang-switch-btn notranslate';

    const currentLang = getSavedLanguage();
    updateButtonLabel(button, currentLang);

    button.addEventListener('click', function () {
      const activeLang = getSavedLanguage();
      const nextLang = activeLang === 'en' ? 'ar' : 'en';

      setSavedLanguage(nextLang);
      applyDirection(nextLang);
      updateButtonLabel(button, nextLang);
      applyTranslateSelection(nextLang, 30);
      suppressGoogleUi();

      // Reload once so translation applies consistently across complex sections.
      setTimeout(function () {
        window.location.reload();
      }, 120);
    });

    if (mobileButton && mobileButton.parentNode) {
      mobileButton.parentNode.insertBefore(button, mobileButton);
    } else {
      navbar.appendChild(button);
    }

    return button;
  }

  document.addEventListener('DOMContentLoaded', function () {
    injectStyles();
    ensureTranslateContainer();

    const activeLang = getSavedLanguage();
    setSavedLanguage(activeLang);
    applyDirection(activeLang);

    const button = createSwitcherButton();
    if (button) {
      updateButtonLabel(button, activeLang);
    }

    loadGoogleTranslateScript();

    // Re-apply after dynamic changes to keep language and hide Google UI.
    const observer = new MutationObserver(function () {
      suppressGoogleUi();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    window.addEventListener('load', ensureLanguageApplied);
    setTimeout(ensureLanguageApplied, 500);
    setTimeout(ensureLanguageApplied, 1500);
  });
})();
