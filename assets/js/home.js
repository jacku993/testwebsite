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

  const hero = content.home && content.home.hero ? content.home.hero : null;

  if (!hero || !hero.image) {
    return;
  }

  const alt = Site.pick(hero.alt) || "";
  const caption = Site.pick(hero.caption) || "";

  root.innerHTML = `
    "
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