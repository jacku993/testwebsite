Site.loadProjectsIndex = async function () {
  try {
    const index = await Site.getJSON("data/projects-index.json");

    return index
      .filter(project => project.visible !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.warn(error);
    return [];
  }
};

Site.loadProject = async function (id) {
  return Site.getJSON(`projects/${id}/project.json`);
};

Site.applyProjectGridMode = function (container, count) {
  if (!container) return;

  container.classList.remove(
    "project-grid--single",
    "project-grid--double",
    "project-grid--many"
  );

  if (count === 1) {
    container.classList.add("project-grid--single");
    return;
  }

  if (count === 2) {
    container.classList.add("project-grid--double");
    return;
  }

  if (count >= 3) {
    container.classList.add("project-grid--many");
  }
};

Site.projectCard = function (project, meta = {}) {
  const coverPath = `projects/${project.id}/${project.cover || "cover.webp"}`;
  const projectUrl = `realizacja.html?id=${encodeURIComponent(project.id)}`;

  const scope = (project.scopeOfWork || [])
    .slice(0, 4)
    .map(function (item) {
      return `<li>${Site.escapeHTML(Site.pick(item))}</li>`;
    })
    .join("");

  const typeLabel = project.type
    ? `<span class="project-badge">${Site.escapeHTML(project.type)}</span>`
    : "";

  const role = project.role
    ? `
      <div class="project-role">
        <span class="project-role-label">
          ${Site.escapeHTML(Site.i18n.dict["project.role"] || "Rola naszej firmy")}
        </span>
        <span>${Site.escapeHTML(Site.pick(project.role))}</span>
      </div>
    `
    : "";

  const scopeBlock = scope
    ? `
      <div class="project-scope">
        <span class="project-scope-label">
          ${Site.escapeHTML(Site.i18n.dict["project.scope"] || "Zakres prac")}
        </span>
        <ul class="scope-list">${scope}</ul>
      </div>
    `
    : "";

  return `
    <article class="project-card">
      <div class="project-cover">
        <img
          src="${Site.escapeHTML(coverPath)}"
          alt="Przykładowy budynek mieszkalny"
          loading="lazy"
          onerror="this.remove(); this.parentElement.textContent='Miejsce na zdjęcie okładkowe';"
        >
      </div>

      <div class="project-card-content">
        <div class="project-card-top">
          ${typeLabel}
          <h3>${Site.escapeHTML(Site.pick(project.title))}</h3>
          <div class="meta">
            ${Site.escapeHTML(project.location || "")}
            ${project.year ? " | " + Site.escapeHTML(project.year) : ""}
          </div>
        </div>

        <p>${Site.escapeHTML(Site.pick(project.summary))}</p>

        ${role}

        ${scopeBlock}

        <div class="project-card-actions">
          <a class="button primary" href="${Site.escapeHTML(projectUrl)}">
            ${Site.escapeHTML(Site.i18n.dict["button.viewProject"] || "Zobacz projekt")}
          </a>
        </div>
      </div>
    </article>
  `;
};

Site.renderProjectsLists = async function () {
  const index = await Site.loadProjectsIndex();
  const projects = [];

  for (const item of index) {
    try {
      projects.push({
        meta: item,
        data: await Site.loadProject(item.id)
      });
    } catch (error) {
      console.warn(error);
    }
  }

  const list = document.getElementById("projects-list");

  if (list) {
    Site.applyProjectGridMode(list, projects.length);

    list.innerHTML = projects.length
      ? projects.map(project => Site.projectCard(project.data, project.meta)).join("")
      : `
        <div class="empty-state">
          <h2>Realizacje są w przygotowaniu</h2>
          <p>Wkrótce pojawią się tutaj wybrane projekty wraz z zakresem prac.</p>
          <a class="button primary" href="kontakt.html">Kontakt</a>
        </div>
      `;
  }

  const featured = document.getElementById("featured-projects");

  if (featured) {
    const items = projects
      .filter(project => project.meta.featured)
      .sort((a, b) => (a.meta.featuredOrder || 0) - (b.meta.featuredOrder || 0));

    Site.applyProjectGridMode(featured, items.length);

    featured.innerHTML = items.length
      ? items.map(project => Site.projectCard(project.data, project.meta)).join("")
      : `
        <div class="empty-state">
          <h2>Portfolio w przygotowaniu</h2>
          <p>Wybrane projekty zostaną dodane po uzupełnieniu danych.</p>
          <a class="button primary" href="kontakt.html">Kontakt</a>
        </div>
      `;
  }
};