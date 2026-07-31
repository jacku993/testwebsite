Site.renderHomeHero = async function () {
  const root = document.getElementById("home-hero-media");

  if (!root) {
    return;
  }

  let content;

  try {
    content = await Site.getJSON("data/site-content.json");
  } catch (error) {
    console.warn("site-content.json not loaded", error);
    return;
  }

  const hero = content.home && content.home.hero ? content.home.hero : {};
  const mode = hero.mode || "custom";

  let imagePath = "";
  let alt = "";
  let caption = "";

  if (mode === "featuredProjectCover") {
    const featuredHero = await Site.getFeaturedProjectHero();

    if (featuredHero) {
      imagePath = featuredHero.imagePath;
      alt = featuredHero.alt;
      caption = featuredHero.caption;
    }
  }

  if (!imagePath && hero.image) {
    imagePath = Site.pick(hero.image);
    alt = Site.pick(hero.alt) || "";
    caption = Site.pick(hero.caption) || "";
  }

  if (!imagePath) {
    return;
  }

  root.innerHTML = `
    <img src="${Site.escapeHTML(imagePath)}"
      alt="${Site.escapeHTML(alt)}"
      loading="eager"
    >
    ${
      caption
        ? `<figcaption class="hero-caption">${Site.escapeHTML(caption)}</figcaption>`
        : ""
    }
  `;
};

Site.getFeaturedProjectHero = async function () {
  let index;

  try {
    index = await Site.getJSON("data/projects-index.json");
  } catch (error) {
    console.warn("projects-index.json not loaded", error);
    return null;
  }

  const featured = index
    .filter(project => project.visible !== false && project.featured)
    .sort((a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0))[0];

  if (!featured) {
    return null;
  }

  let project;

  try {
    project = await Site.getJSON(`projects/${featured.id}/project.json`);
  } catch (error) {
    console.warn(`Featured project "${featured.id}" not loaded`, error);
    return null;
  }

  const cover = project.cover || "cover.webp";

  return {
    imagePath: `projects/${project.id}/${cover}`,
    alt: Site.pick(project.title) || "",
    caption: Site.pick(project.summary) || ""
  };
};