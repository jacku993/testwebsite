Site.renderGalleries = async function(project) {
  const root = document.getElementById('project-galleries');
  if (!root) return;
  const blocks = [];
  for (const galleryRef of project.galleries || []) {
    try {
      const base = `projects/${project.id}/${galleryRef.path.replace('/gallery.json','')}`;
      const gallery = await Site.getJSON(`projects/${project.id}/${galleryRef.path}`);
      const images = (gallery.images || []).map(img => ({
        thumb: `${base}/thumbs/${img.file}`,
        full: `${base}/full/${img.file}`,
        caption: Site.pick(img.caption),
        alt: Site.pick(img.alt) || Site.pick(img.caption) || Site.pick(gallery.title)
      }));
      const thumbs = images.map((img, index) => `<button class="gallery-thumb" type="button" data-gallery-index="${blocks.length}" data-image-index="${index}" aria-label="Otwórz zdjęcie ${index + 1}"><img src="${img.thumb}" alt="${Site.escapeHTML(img.alt)}" loading="lazy" onerror="this.remove(); this.parentElement.innerHTML='<span class=gallery-placeholder>Miniatura</span>';" /></button>`).join('');
      blocks.push({ title: Site.pick(gallery.title), description: Site.pick(gallery.description), images, html: `<section class="section"><h2>${Site.escapeHTML(Site.pick(gallery.title))}</h2><p>${Site.escapeHTML(Site.pick(gallery.description))}</p><div class="gallery-grid">${thumbs}</div></section>` });
    } catch (error) { console.warn(error); }
  }
  Site.currentGalleries = blocks;
  root.innerHTML = blocks.map(b => b.html).join('') || '<p>Brak galerii dla tej realizacji.</p>';
  root.querySelectorAll('.gallery-thumb').forEach(btn => btn.addEventListener('click', () => {
    Site.openLightbox(Number(btn.dataset.galleryIndex), Number(btn.dataset.imageIndex));
  }));
};
