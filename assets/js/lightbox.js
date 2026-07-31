Site.currentGalleries = [];
Site.lightboxState = { galleryIndex: 0, imageIndex: 0 };
Site.ensureLightbox = function() {
  if (document.querySelector('.lightbox')) return;
  const div = document.createElement('div');
  div.className = 'lightbox';
  div.innerHTML = `
    <div class="lightbox-top"><button class="lightbox-close" type="button" aria-label="Zamknij">X</button></div>
    <div class="lightbox-stage">
      <button class="lightbox-prev lightbox-side-control" type="button" aria-label="Poprzednie zdjęcie">←</button>
      <div class="lightbox-image-wrap"><img class="lightbox-image" alt=""></div>
      <button class="lightbox-next lightbox-side-control" type="button" aria-label="Następne zdjęcie">→</button>
    </div>
    <div class="lightbox-mobile-controls">
      <button class="lightbox-prev-mobile" type="button" aria-label="Poprzednie zdjęcie">←</button>
      <button class="lightbox-next-mobile" type="button" aria-label="Następne zdjęcie">→</button>
    </div>

    <div class="lightbox-bottom">
      <div class="lightbox-caption"></div>
      <div class="lightbox-thumbs"></div>
    </div>`;
  document.body.appendChild(div);
  div.querySelector('.lightbox-close').addEventListener('click', Site.closeLightbox);

  div.querySelector('.lightbox-prev').addEventListener('click', () => Site.moveLightbox(-1));
  div.querySelector('.lightbox-next').addEventListener('click', () => Site.moveLightbox(1));

  div.querySelector(".lightbox-prev-mobile").addEventListener("click", () => Site.moveLightbox(-1));
  div.querySelector(".lightbox-next-mobile").addEventListener("click", () => Site.moveLightbox(1));

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
  if (!gallery || !gallery.images.length) return;
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
  box.querySelector('.lightbox-thumbs').innerHTML = gallery.images.map((item, index) => `<button class="lightbox-thumb ${index === Site.lightboxState.imageIndex ? 'active' : ''}" type="button" data-index="${index}"><img src="${item.thumb}" aria-label="Przejdź do zdjęcia ${index + 1}" alt=""></button>`).join('');
  box.querySelectorAll('.lightbox-thumb').forEach(btn => btn.addEventListener('click', () => { Site.lightboxState.imageIndex = Number(btn.dataset.index); Site.renderLightbox(); }));
};
document.addEventListener('keydown', e => {
  const open = document.querySelector('.lightbox.open');
  if (!open) return;
  if (e.key === 'Escape') Site.closeLightbox();
  if (e.key === 'ArrowLeft') Site.moveLightbox(-1);
  if (e.key === 'ArrowRight') Site.moveLightbox(1);
});
