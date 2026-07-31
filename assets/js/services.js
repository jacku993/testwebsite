Site.serviceTitleById = {};
Site.loadServicesData = async function() {
  try {
    const services = await Site.getJSON('data/services.json');
    Site.serviceTitleById = Object.fromEntries(services.map(s => [s.id, Site.pick(s.title)]));
    return services.sort((a,b) => (a.order || 0) - (b.order || 0));
  } catch (error) { console.warn(error); return []; }
};
Site.serviceCard = function(service) {
  return `<article class="card"><h3>${Site.escapeHTML(Site.pick(service.title))}</h3><p>${Site.escapeHTML(Site.pick(service.description))}</p></article>`;
};
Site.renderServices = async function() {
  const services = await Site.loadServicesData();
  const pageList = document.getElementById('services-list');
  if (pageList) pageList.innerHTML = services.map(Site.serviceCard).join('');
  const homeList = document.getElementById('home-services');
  if (homeList) homeList.innerHTML = services.filter(s => s.featured).slice(0, 3).map(Site.serviceCard).join('');
};
