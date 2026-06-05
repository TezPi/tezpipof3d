import { initNav, initReveals, REDUCE, gsap } from './shared.js';
import { MOCKUPS_LIST as MOCKUPS } from './projects-data.js';

initNav();

const CATEGORIES = [
  { id: 'all',    label: 'All ✦' },
  { id: 'mobile', label: '📱 Mobile' },
  { id: 'web',    label: '🖥 Web' },
];

/* ============================================================
   DEVICE MOCKUP BUILDERS
   ============================================================ */
function phoneMockup(bg) {
  return `
    <div class="mockup-phone">
      <div class="phone-notch"></div>
      <div class="phone-screen" style="background:${bg}">
        <div class="ms-topbar">
          <div class="ms-bar w-30"></div>
          <div class="ms-bar w-15"></div>
        </div>
        <div class="ms-hero"></div>
        <div class="ms-body">
          <div class="ms-bar w-60"></div>
          <div class="ms-bar w-45"></div>
          <div class="ms-card-row">
            <div class="ms-mini-card"></div>
            <div class="ms-mini-card"></div>
            <div class="ms-mini-card"></div>
          </div>
          <div class="ms-bar w-80"></div>
          <div class="ms-bar w-55"></div>
          <div class="ms-list-item"></div>
          <div class="ms-list-item"></div>
        </div>
        <div class="ms-bottomnav">
          <div class="ms-nav-dot"></div>
          <div class="ms-nav-dot active"></div>
          <div class="ms-nav-dot"></div>
          <div class="ms-nav-dot"></div>
        </div>
      </div>
      <div class="phone-home-bar"></div>
    </div>`;
}

function browserMockup(bg) {
  return `
    <div class="mockup-browser">
      <div class="browser-chrome">
        <div class="browser-dots">
          <span class="bd-r"></span><span class="bd-y"></span><span class="bd-g"></span>
        </div>
        <div class="browser-url">tezpi.design/pulse</div>
      </div>
      <div class="browser-screen" style="background:${bg}">
        <div class="bs-sidebar">
          <div class="bs-logo"></div>
          <div class="bs-nav-item active"></div>
          <div class="bs-nav-item"></div>
          <div class="bs-nav-item"></div>
          <div class="bs-nav-item"></div>
        </div>
        <div class="bs-content">
          <div class="bs-kpi-row">
            <div class="bs-kpi"></div>
            <div class="bs-kpi"></div>
            <div class="bs-kpi"></div>
            <div class="bs-kpi"></div>
          </div>
          <div class="bs-chart"></div>
          <div class="bs-data-row"></div>
          <div class="bs-data-row"></div>
          <div class="bs-data-row"></div>
        </div>
      </div>
    </div>`;
}

function buildMockup(item) {
  return item.type === 'phone' ? phoneMockup(item.bg) : browserMockup(item.bg);
}

/* ============================================================
   RENDER FILTERS
   ============================================================ */
const filterBar = document.getElementById('filter-bar');
filterBar.innerHTML = CATEGORIES.map((c, i) => `
  <button class="filter-btn ${i === 0 ? 'active' : ''}" data-filter="${c.id}">${c.label}</button>
`).join('');

/* ============================================================
   RENDER GALLERY
   ============================================================ */
const grid = document.getElementById('gallery-grid');

function renderGallery(filter) {
  const items = filter === 'all' ? MOCKUPS : MOCKUPS.filter(m => m.category === filter);
  grid.innerHTML = items.map(item => `
    <div class="gallery-card reveal" data-id="${item.id}" role="button" tabindex="0"
         aria-label="Open ${item.project} — ${item.screen}">
      <div class="gallery-mockup-wrap">
        ${buildMockup(item)}
      </div>
      <div class="gallery-card-info">
        <span class="gallery-project">${item.project}</span>
        <p class="gallery-screen">${item.screen}</p>
      </div>
    </div>
  `).join('');

  /* re-bind reveals and click handlers after re-render */
  if (!REDUCE) {
    gsap.utils.toArray('#gallery-section .reveal').forEach(el => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.55, ease: 'back.out(1.2)',
        scrollTrigger: { trigger: el, start: 'top 90%' },
      });
    });
  } else {
    grid.querySelectorAll('.reveal').forEach(el => {
      el.style.opacity = 1;
      el.style.transform = 'none';
    });
  }

  grid.querySelectorAll('[data-id]').forEach(card => {
    const open = () => openLightbox(card.dataset.id);
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
}

renderGallery('all');

/* ============================================================
   FILTER BUTTONS
   ============================================================ */
filterBar.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderGallery(btn.dataset.filter);
  });
});

/* ============================================================
   LIGHTBOX
   ============================================================ */
const lightbox   = document.getElementById('lightbox');
const backdrop   = document.getElementById('lightbox-backdrop');
const closeBtn   = document.getElementById('lightbox-close');
const lbMockup   = document.getElementById('lightbox-mockup');
const lbTag      = document.getElementById('lightbox-tag');
const lbTitle    = document.getElementById('lightbox-title');
const lbScreen   = document.getElementById('lightbox-screen');
const lbDesc     = document.getElementById('lightbox-desc');
const lbTags     = document.getElementById('lightbox-tags');
const lbPrev     = document.getElementById('lb-prev');
const lbNext     = document.getElementById('lb-next');

let currentIdx = 0;
let activeFilter = 'all';

function visibleItems() {
  return activeFilter === 'all' ? MOCKUPS : MOCKUPS.filter(m => m.category === activeFilter);
}

function openLightbox(id) {
  const items = visibleItems();
  currentIdx = items.findIndex(m => m.id === id);
  populateLightbox(items[currentIdx]);
  lightbox.hidden = false;
  backdrop.classList.add('show');
  document.body.style.overflow = 'hidden';
  closeBtn.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  backdrop.classList.remove('show');
  document.body.style.overflow = '';
}

function populateLightbox(item) {
  lbMockup.innerHTML  = buildMockup(item);
  lbTag.textContent   = item.project;
  lbTitle.textContent = item.screen;
  lbScreen.textContent = item.category === 'mobile' ? '📱 Mobile' : '🖥 Web';
  lbDesc.textContent  = item.desc;
  lbTags.innerHTML    = item.tags.map(t => `<span class="tag">${t}</span>`).join('');
  const items = visibleItems();
  lbPrev.disabled = currentIdx === 0;
  lbNext.disabled = currentIdx === items.length - 1;
}

lbPrev.addEventListener('click', () => {
  if (currentIdx > 0) { currentIdx--; populateLightbox(visibleItems()[currentIdx]); }
});
lbNext.addEventListener('click', () => {
  const items = visibleItems();
  if (currentIdx < items.length - 1) { currentIdx++; populateLightbox(items[currentIdx]); }
});

closeBtn.addEventListener('click', closeLightbox);
backdrop.addEventListener('click', closeLightbox);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* keep track of active filter for lightbox nav */
filterBar.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => { activeFilter = btn.dataset.filter; });
});

/* ============================================================
   PAGE HERO ENTRANCE
   ============================================================ */
if (!REDUCE) {
  gsap.timeline({ defaults: { ease: 'back.out(1.3)' } })
    .to('.page-hero .section-eyebrow', { opacity: 1, y: 0, duration: 0.5, delay: 0.15 })
    .to('.page-hero-title',            { opacity: 1, y: 0, duration: 0.6 }, '-=0.2')
    .to('.page-hero-sub',              { opacity: 1, y: 0, duration: 0.45 }, '-=0.2');
}

initReveals('#gallery-section');
