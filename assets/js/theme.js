Site.applyTheme = function() {
  const selected = localStorage.getItem('site.theme') || 'auto';
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const effective = selected === 'auto' ? (prefersDark ? 'dark' : 'light') : selected;
  document.documentElement.setAttribute('data-theme', effective);
};
Site.cycleTheme = function() {
  const order = ['auto', 'light', 'dark'];
  const current = localStorage.getItem('site.theme') || 'auto';
  const next = order[(order.indexOf(current) + 1) % order.length];
  localStorage.setItem('site.theme', next);
  Site.applyTheme();
};
