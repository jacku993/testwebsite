Site.applyFontSize = function() {
  document.body.setAttribute('data-font-size', localStorage.getItem('site.fontSize') || 'normal');
};
Site.cycleFontSize = function() {
  const order = ['small', 'normal', 'large'];
  const current = localStorage.getItem('site.fontSize') || 'normal';
  const next = order[(order.indexOf(current) + 1) % order.length];
  localStorage.setItem('site.fontSize', next);
  Site.applyFontSize();
};
