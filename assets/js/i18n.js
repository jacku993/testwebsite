Site.i18n = { dict: {} };
Site.loadI18n = async function() {
  const lang = Site.currentLang();
  try { Site.i18n.dict = await Site.getJSON(`data/i18n/${lang}.json`); }
  catch (error) { console.warn(error); Site.i18n.dict = {}; }
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (Site.i18n.dict[key]) el.textContent = Site.i18n.dict[key];
  });
};
Site.setLang = function(lang) { localStorage.setItem('site.lang', lang); location.reload(); };
