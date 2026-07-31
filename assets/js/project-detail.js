Site.renderProjectDetail = async function() {
  const root = document.getElementById('project-detail');
  if (!root) return;
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  if (!id) { root.innerHTML = '<div class="empty-state"><h2>Nie podano identyfikatora projektu.</h2><a class="button primary" href="realizacje.html">Wróć do portfolio</a></div>'; return; }
  let project;
  try { project = await Site.loadProject(id); }
  catch(error) { console.warn(error); root.innerHTML = '<div class="empty-state"><h2>Nie znaleziono projektu.</h2><a class="button primary" href="realizacje.html">Wróć do portfolio</a></div>'; return; }

  let description = "";
  const descFile = Site.pick(project.description);
  if (descFile) {
    try { description = Site.mdToHTML(await Site.getText(`projects/${id}/${descFile}`)); }
    catch(error) { console.warn(error); }
  }
  const scope = (project.scopeOfWork || []).map(item => `<li>${Site.escapeHTML(Site.pick(item))}</li>`).join("");
  const services = (project.services || []).map(s => `<li>${Site.escapeHTML(Site.serviceTitleById[s] || s)}</li>`).join("");

  root.innerHTML = `
    <article class="detail-card">
      <p class="eyebrow">${Site.escapeHTML(project.type || "")}</p>
      <h1>${Site.escapeHTML(Site.pick(project.title))}</h1>
      <p class="lead">${Site.escapeHTML(Site.pick(project.summary))}</p>
      <p class="meta">${Site.escapeHTML(project.location || "")} ${project.year ? " | " + Site.escapeHTML(project.year) : ""}</p>
      ${project.role ? `<h2>${Site.escapeHTML(Site.i18n.dict["project.role"] || "Rola naszej firmy")}</h2><p>${Site.escapeHTML(Site.pick(project.role))}</p>` : ""}
      ${scope ? `<h2>${Site.escapeHTML(Site.i18n.dict['project.scope'] || 'Zakres prac wykonanych przez naszą firmę')}</h2><ul class="scope-list">${scope}</ul>` : ""}
      ${services ? `<h2>${Site.escapeHTML(Site.i18n.dict['project.services'] || 'Powiązane usługi')}</h2><ul>${services}</ul>` : ''}
      <div class="markdown-content">${description}</div>
    </article>
    <div id="project-galleries"></div>
    <nav id="project-nav" class="project-nav"></nav>
  `;
  await Site.renderGalleries(project);
  await Site.renderProjectNav(id);
};
Site.renderProjectNav = async function(currentId) {
  const nav = document.getElementById('project-nav');
  if (!nav) return;
  const index = await Site.loadProjectsIndex();
  const pos = index.findIndex(p => p.id === currentId);
  const prev = index[pos - 1];
  const next = index[pos + 1];
  nav.innerHTML = `
    ${prev ? `<a class="button secondary" href="realizacja.html?id=${encodeURIComponent(prev.id)}">← Poprzednia</a>` : '<span></span>'}
    <a class="button primary" href="realizacje.html">Wszystkie realizacje</a>
    ${next ? `<a class="button secondary" href="realizacja.html?id=${encodeURIComponent(next.id)}">Następna →</a>` : '<span></span>'}
  `;
};