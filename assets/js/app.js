(async function init() {
  Site.applyTheme();
  Site.applyFontSize();
  await Site.loadI18n();

  if (Site.renderHomeHero) {
    await Site.renderHomeHero();
  }
  let siteConfig = { features: { settingsMenu: true, languageSwitcher: true, themeSwitcher: true, fontSizeSwitcher: true } };
  try {
    siteConfig = await Site.getJSON('data/site-config.json');
  } catch (error) {
    console.warn('site-config.json not loaded, using defaults', error);
  }

  const features = siteConfig.features || {};

  function setFeatureVisibility() {
    const settingsToggle = document.querySelector('.settings-toggle');
    const settingsPanel = document.querySelector('#settings-panel');

    if (features.settingsMenu === false) {
      settingsToggle?.setAttribute('hidden', '');
      settingsPanel?.setAttribute('hidden', '');
      return;
    }

    document.querySelectorAll('[data-feature]').forEach(section => {
      const featureName = section.dataset.feature;
      if (features[featureName] === false) {
        section.setAttribute('hidden', '');
      }
    });

    const visibleSections = Array.from(document.querySelectorAll('#settings-panel [data-feature]'))
      .filter(section => !section.hasAttribute('hidden'));

    if (visibleSections.length === 0) {
      settingsToggle?.setAttribute('hidden', '');
      settingsPanel?.setAttribute('hidden', '');
    }
  }

  function setActiveControls() {
    const lang = Site.currentLang();
    const theme = localStorage.getItem('site.theme') || 'auto';
    const fontSize = localStorage.getItem('site.fontSize') || 'normal';

    document.querySelectorAll('[data-lang]').forEach(btn => btn.classList.toggle('is-active', btn.dataset.lang === lang));
    document.querySelectorAll('[data-theme-value]').forEach(btn => btn.classList.toggle('is-active', btn.dataset.themeValue === theme));
    document.querySelectorAll('[data-font-size-value]').forEach(btn => btn.classList.toggle('is-active', btn.dataset.fontSizeValue === fontSize));
  }

  setFeatureVisibility();
  setActiveControls();

  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => Site.setLang(btn.dataset.lang));
  });

  document.querySelectorAll('[data-theme-value]').forEach(btn => {
    btn.addEventListener('click', () => {
      localStorage.setItem('site.theme', btn.dataset.themeValue);
      Site.applyTheme();
      setActiveControls();
    });
  });

  document.querySelectorAll('[data-font-size-value]').forEach(btn => {
    btn.addEventListener('click', () => {
      localStorage.setItem('site.fontSize', btn.dataset.fontSizeValue);
      Site.applyFontSize();
      setActiveControls();
    });
  });

  const settingsToggle = document.querySelector('.settings-toggle');
  const settingsPanel = document.querySelector('#settings-panel');
  settingsToggle?.addEventListener('click', () => {
    const isOpen = !settingsPanel.hasAttribute('hidden');
    settingsPanel.toggleAttribute('hidden', isOpen);
    settingsToggle.setAttribute('aria-expanded', String(!isOpen));
  });

  const navToggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('#mobile-menu');
  navToggle?.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', !isOpen);
    mobileMenu.toggleAttribute('hidden', isOpen);
    navToggle.setAttribute('aria-expanded', String(!isOpen));
  });

  document.addEventListener('click', event => {
    const target = event.target;
    if (!settingsPanel || settingsPanel.hasAttribute('hidden')) return;
    if (settingsPanel.contains(target) || settingsToggle?.contains(target)) return;
    settingsPanel.setAttribute('hidden', '');
    settingsToggle?.setAttribute('aria-expanded', 'false');
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    settingsPanel?.setAttribute('hidden', '');
    settingsToggle?.setAttribute('aria-expanded', 'false');
    mobileMenu?.setAttribute('hidden', '');
    mobileMenu?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });

  await Site.renderServices();
  await Site.loadContact();
  await Site.renderProjectsLists();
  await Site.renderProjectDetail();
})();
