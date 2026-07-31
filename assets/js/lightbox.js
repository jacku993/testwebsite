Site.currentGalleries = [];
Site.lightboxState = { galleryIndex: 0, imageIndex: 0 };
Site.ensureLightbox = function() {
  if (document.querySelector('.lightbox')) return;
  const div = document.createElement('div');
  div.className = 'lightbox';
  div.innerHTML = `
    <div class="lightbox-top"><button class="lightbox-close" type="button">X</button></div>
    <div class="lightbox-stage">
      <button class="lightbox-prev" type="button">←</button>
      <div class="lightbox-image-wrap"><img class="lightbox-image" alt=""></div>
      <button class="lightbox-next" type="button">→</button>
    </div>
    <div>
      <div class="lightbox-caption"></div>
      <div class="lightbox-thumbs"></div>
    </div>`;
  document.body.appendChild(div);
  div.querySelector('.lightbox-close').addEventListener('click', Site.closeLightbox);
  div.querySelector('.lightbox-prev').addEventListener('click', () => Site.moveLightbox(-1));
  div.querySelector('.lightbox-next').addEventListener('click', () => Site.moveLightbox(1));
  div.addEventListener('click', e => { if (e.target === div) Site.closeLightbox(); });
  let startX = 0;
  div.addEventListener('touchstart', e => { startX = e.changedTouches[0].clientX; }, { passive: true });
  div.addEventListener('touchend', e => {
    const delta = e.changedTouches[0].clientX - startX;
    if (Math.abs(delta) > 50) Site.moveLightbox(delta > 0 ? -1 : 1);
  }, { passive: true });
};
Site.openLightbox = function(galleryIndex, imageIndex) {
  Site.ensureLightbox();
  Site.lightboxState = { galleryIndex, imageIndex };
  document.body.style.overflow = 'hidden';
  document.querySelector('.lightbox').classList.add('open');
  Site.renderLightbox();
};
Site.closeLightbox = function() {
  const box = document.querySelector('.lightbox');
  if (box) box.classList.remove('open');
  document.body.style.overflow = '';
};
Site.moveLightbox = function(delta) {
  const gallery = Site.currentGalleries[Site.lightboxState.galleryIndex];
  if (!gallery) return;
  const count = gallery.images.length;
  Site.lightboxState.imageIndex = (Site.lightboxState.imageIndex + delta + count) % count;
  Site.renderLightbox();
};
Site.renderLightbox = function() {
  const box = document.querySelector('.lightbox');
  const gallery = Site.currentGalleries[Site.lightboxState.galleryIndex];
  if (!box || !gallery) return;
  const img = gallery.images[Site.lightboxState.imageIndex];
  box.querySelector('.lightbox-image').src = img.full;
  box.querySelector('.lightbox-image').alt = img.alt || '';
  box.querySelector('.lightbox-caption').textContent = `${img.caption || ''} ${Site.lightboxState.imageIndex + 1} / ${gallery.images.length}`.trim();
  box.querySelector('.lightbox-thumbs').innerHTML = gallery.images.map((item, index) => `<button class="lightbox-thumb ${index === Site.lightboxState.imageIndex ? 'active' : ''}" type="button" data-index="${index}"><img src="${item.thumb}" alt=""></button>`).join('');
  box.querySelectorAll('.lightbox-thumb').forEach(btn => btn.addEventListener('click', () => { Site.lightboxState.imageIndex = Number(btn.dataset.index); Site.renderLightbox(); }));
};
document.addEventListener('keydown', e => {
  const open = document.querySelector('.lightbox.open');
  if (!open) return;
  if (e.key === 'Escape') Site.closeLightbox();
  if (e.key === 'ArrowLeft') Site.moveLightbox(-1);
  if (e.key === 'ArrowRight') Site.moveLightbox(1);
});
