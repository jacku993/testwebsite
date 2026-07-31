Site.t = function(key, fallback) {
  return Site.i18n && Site.i18n.dict && Site.i18n.dict[key] ? Site.i18n.dict[key] : fallback;
};

Site.renderContactFull = function(company) {
  return `
    <div class="detail-card">
      <h2>${Site.escapeHTML(company.companyName || '')}</h2>
      <p><strong>${Site.escapeHTML(Site.t('contact.address', 'Adres'))}:</strong><br>${Site.escapeHTML(company.address || '')}</p>
      <p><strong>${Site.escapeHTML(Site.t('contact.phone', 'Telefon'))}:</strong><br><a href="tel:${Site.escapeHTML(company.phone || '')}">${Site.escapeHTML(company.phone || '')}</a></p>
      <p><strong>${Site.escapeHTML(Site.t('contact.email', 'E-mail'))}:</strong><br><a href="mailto:${Site.escapeHTML(company.email || '')}">${Site.escapeHTML(company.email || '')}</a></p>
      <p><strong>${Site.escapeHTML(Site.t('contact.officeHours', 'Godziny pracy'))}:</strong><br>${Site.escapeHTML(Site.pick(company.officeHours))}</p>
    </div>`;
};

Site.renderContactSummary = function(company) {
  return `
    <div class="detail-card contact-summary">
      <p><strong>${Site.escapeHTML(Site.t('contact.phone', 'Telefon'))}:</strong><br><a href="tel:${Site.escapeHTML(company.phone || '')}">${Site.escapeHTML(company.phone || '')}</a></p>
      <p><strong>${Site.escapeHTML(Site.t('contact.email', 'E-mail'))}:</strong><br><a href="mailto:${Site.escapeHTML(company.email || '')}">${Site.escapeHTML(company.email || '')}</a></p>
      <div class="contact-summary-actions">
        <a class="button primary" href="kontakt.html">${Site.escapeHTML(Site.t('button.contactPage', 'Pełne dane kontaktowe'))}</a>
      </div>
    </div>`;
};

Site.renderFooterContact = function(company) {
  return `
    <p><strong>${Site.escapeHTML(Site.t('contact.phone', 'Telefon'))}:</strong><br><a href="tel:${Site.escapeHTML(company.phone || '')}">${Site.escapeHTML(company.phone || '')}</a></p>
    <p><strong>${Site.escapeHTML(Site.t('contact.email', 'E-mail'))}:</strong><br><a href="mailto:${Site.escapeHTML(company.email || '')}">${Site.escapeHTML(company.email || '')}</a></p>`;
};

Site.renderFooterHours = function(company) {
  return `<p>${Site.escapeHTML(Site.pick(company.officeHours))}</p>`;
};

Site.renderMap = function(company) {
  if (company.mapEmbedUrl) {
    return `<iframe loading="lazy" src="${Site.escapeHTML(company.mapEmbedUrl)}" title="${Site.escapeHTML(Site.t('contact.mapTitle', 'Mapa dojazdu'))}"></iframe>`;
  }

  if (company.mapExternalUrl) {
    return `<div class="gallery-placeholder"><a class="button primary" href="${Site.escapeHTML(company.mapExternalUrl)}" target="_blank" rel="noopener">${Site.escapeHTML(Site.t('button.openMap', 'Otwórz mapę'))}</a></div>`;
  }

  return `<div class="gallery-placeholder">${Site.escapeHTML(Site.t('contact.mapPlaceholder', 'Miejsce na mapę'))}</div>`;
};

Site.loadContact = async function() {
  let company;

  try {
    company = await Site.getJSON('data/company.json');
  } catch(error) {
    console.warn(error);
    return;
  }

  const homeContact = document.getElementById('home-contact');
  if (homeContact) homeContact.innerHTML = Site.renderContactSummary(company);

  const fullContact = document.getElementById('contact-full');
  if (fullContact) fullContact.innerHTML = Site.renderContactFull(company);

  const footerContact = document.getElementById('footer-contact');
  if (footerContact) footerContact.innerHTML = Site.renderFooterContact(company);

  const footerHours = document.getElementById('footer-hours');
  if (footerHours) footerHours.innerHTML = Site.renderFooterHours(company);

  ['home-map', 'contact-map'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = Site.renderMap(company);
  });
};
