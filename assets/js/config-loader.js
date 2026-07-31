window.Site = window.Site || {};

Site.getJSON = async function (path) {
  const response = await fetch(path, { cache: "no-cache" });

  if (!response.ok) {
    throw new Error(`Cannot load ${path}: ${response.status}`);
  }

  return response.json();
};

Site.getText = async function (path) {
  const response = await fetch(path, { cache: "no-cache" });

  if (!response.ok) {
    throw new Error(`Cannot load ${path}: ${response.status}`);
  }

  return response.text();
};

Site.currentLang = function () {
  return localStorage.getItem("site.lang") || "pl";
};

Site.pick = function (value, lang = Site.currentLang()) {
  if (value == null) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  return value[lang] || value.pl || value.en || "";
};

Site.escapeHTML = function (value) {
  return String(value ?? "").replace(/[&<>'"]/g, function (char) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      "\"": "&quot;"
    }[char];
  });
};

Site.mdToHTML = function (markdown) {
  if (!markdown) {
    return "";
  }

  const lines = markdown.split(/\r?\n/);
  const html = [];
  let listOpen = false;

  function closeListIfNeeded() {
    if (listOpen) {
      html.push("</ul>");
      listOpen = false;
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      closeListIfNeeded();
      continue;
    }

    if (line.startsWith("### ")) {
      closeListIfNeeded();
      html.push(`<h3>${Site.escapeHTML(line.slice(4))}</h3>`);
      continue;
    }

    if (line.startsWith("## ")) {
      closeListIfNeeded();
      html.push(`<h2>${Site.escapeHTML(line.slice(3))}</h2>`);
      continue;
    }

    if (line.startsWith("# ")) {
      closeListIfNeeded();
      html.push(`<h1>${Site.escapeHTML(line.slice(2))}</h1>`);
      continue;
    }

    if (line.startsWith("- ")) {
      if (!listOpen) {
        html.push("<ul>");
        listOpen = true;
      }

      html.push(`<li>${Site.escapeHTML(line.slice(2))}</li>`);
      continue;
    }

    closeListIfNeeded();
    html.push(`<p>${Site.escapeHTML(line)}</p>`);
  }

  closeListIfNeeded();

  return html.join("\n");
};