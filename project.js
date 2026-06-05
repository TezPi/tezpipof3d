import { PROJECTS_DETAIL } from './projects-data.js';
import { initNav, initReveals, REDUCE, gsap } from './shared.js';

/* ============================================================
   RESOLVE PROJECT FROM URL
   ============================================================ */
const id = new URLSearchParams(window.location.search).get('id') || 'inklab';
const p  = PROJECTS_DETAIL[id];

if (!p) { window.location.replace('index.html'); }

/* ============================================================
   DEVICE MOCKUP HELPERS (same as gallery.js)
   ============================================================ */
function phoneMockup(bg) {
  return `<div class="mockup-phone">
    <div class="phone-notch"></div>
    <div class="phone-screen" style="background:${bg}">
      <div class="ms-topbar"><div class="ms-bar w-30"></div><div class="ms-bar w-15"></div></div>
      <div class="ms-hero"></div>
      <div class="ms-body">
        <div class="ms-bar w-60"></div><div class="ms-bar w-45"></div>
        <div class="ms-card-row"><div class="ms-mini-card"></div><div class="ms-mini-card"></div><div class="ms-mini-card"></div></div>
        <div class="ms-bar w-80"></div><div class="ms-bar w-55"></div>
        <div class="ms-list-item"></div><div class="ms-list-item"></div>
      </div>
      <div class="ms-bottomnav">
        <div class="ms-nav-dot"></div><div class="ms-nav-dot active"></div>
        <div class="ms-nav-dot"></div><div class="ms-nav-dot"></div>
      </div>
    </div>
    <div class="phone-home-bar"></div>
  </div>`;
}

function browserMockup(bg) {
  return `<div class="mockup-browser">
    <div class="browser-chrome">
      <div class="browser-dots"><span class="bd-r"></span><span class="bd-y"></span><span class="bd-g"></span></div>
      <div class="browser-url">tezpi.design/${p.id}</div>
    </div>
    <div class="browser-screen" style="background:${bg}">
      <div class="bs-sidebar">
        <div class="bs-logo"></div>
        <div class="bs-nav-item active"></div><div class="bs-nav-item"></div>
        <div class="bs-nav-item"></div><div class="bs-nav-item"></div>
      </div>
      <div class="bs-content">
        <div class="bs-kpi-row"><div class="bs-kpi"></div><div class="bs-kpi"></div><div class="bs-kpi"></div><div class="bs-kpi"></div></div>
        <div class="bs-chart"></div>
        <div class="bs-data-row"></div><div class="bs-data-row"></div><div class="bs-data-row"></div>
      </div>
    </div>
  </div>`;
}

function buildMockup(screen) {
  return screen.type === 'phone' ? phoneMockup(screen.bg) : browserMockup(screen.bg);
}

/* ============================================================
   POPULATE PAGE
   ============================================================ */

/* <head> */
document.getElementById('page-title').textContent = `${p.title} — Tezpi Portfolio`;
document.getElementById('proj-hero').style.setProperty('--proj-color', p.color);
document.getElementById('proj-hero').style.setProperty('--proj-color-pale', p.colorPale);

/* Hero */
document.getElementById('proj-emoji').textContent = p.emoji;
document.getElementById('proj-title').textContent = p.title;
document.getElementById('proj-tagline').textContent = p.tagline;

document.getElementById('proj-meta').innerHTML = [
  { label: '📅 Year',     value: p.year },
  { label: '📁 Category', value: p.category },
  { label: '👤 Role',     value: p.role },
  { label: '⏱ Duration', value: p.duration },
].map(m => `<div class="proj-meta-chip"><span class="meta-label">${m.label}</span><span class="meta-value">${m.value}</span></div>`).join('');

document.getElementById('proj-tools').innerHTML =
  p.tools.map(t => `<span class="tag">${t}</span>`).join('');

document.getElementById('proj-hero-mockup').innerHTML = buildMockup(p.screens[0]);

/* Overview */
document.getElementById('proj-overview-text').textContent = p.overview;
document.getElementById('proj-problem').innerHTML = `
  <div class="ov-label">🔴 The Problem</div>
  <p>${p.problem}</p>`;
document.getElementById('proj-solution').innerHTML = `
  <div class="ov-label">🟢 The Solution</div>
  <p>${p.solution}</p>`;

/* Process */
document.getElementById('proj-process').innerHTML = p.process.map((step, i) => `
  <div class="process-step reveal" style="--step-delay:${i * 0.1}s">
    <div class="step-num">${step.step}</div>
    <div class="step-icon">${step.icon}</div>
    <h3 class="step-label">${step.label}</h3>
    <p class="step-desc">${step.desc}</p>
    ${i < p.process.length - 1 ? '<div class="step-connector" aria-hidden="true"></div>' : ''}
  </div>
`).join('');

/* Screens */
document.getElementById('proj-screens').innerHTML = p.screens.map(s => `
  <div class="proj-screen-item reveal">
    <div class="proj-screen-mockup">${buildMockup(s)}</div>
    <p class="proj-screen-name">${s.name}</p>
  </div>
`).join('');

/* Outcomes */
document.getElementById('proj-outcomes').innerHTML = p.outcomes.map(o => `
  <div class="outcome-card reveal">
    <div class="outcome-metric">${o.metric}</div>
    <div class="outcome-label">${o.label}</div>
  </div>
`).join('');

/* Prev / Next navigation */
const allIds = Object.keys(PROJECTS_DETAIL);
document.getElementById('proj-nav').innerHTML = `
  <div class="proj-nav-prev">
    ${p.prev ? `<a href="project.html?id=${p.prev}" class="proj-nav-link">
      <span class="nav-dir">← Previous</span>
      <span class="nav-proj-name">${PROJECTS_DETAIL[p.prev].emoji} ${PROJECTS_DETAIL[p.prev].title}</span>
    </a>` : '<span></span>'}
  </div>
  <a href="index.html#work" class="btn btn-outline">All projects ✦</a>
  <div class="proj-nav-next">
    ${p.next ? `<a href="project.html?id=${p.next}" class="proj-nav-link">
      <span class="nav-dir">Next →</span>
      <span class="nav-proj-name">${PROJECTS_DETAIL[p.next].emoji} ${PROJECTS_DETAIL[p.next].title}</span>
    </a>` : '<span></span>'}
  </div>
`;

/* ============================================================
   ANIMATIONS
   ============================================================ */
initNav();
initReveals('#proj-hero');

if (!REDUCE) {
  /* Hero entrance */
  gsap.timeline({ defaults: { ease: 'back.out(1.3)', duration: 0.55 } })
    .to('.back-link',       { opacity: 1, y: 0, delay: 0.1 })
    .to('.proj-emoji',      { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' }, '-=0.2')
    .to('.proj-title',      { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
    .to('.proj-tagline',    { opacity: 1, y: 0 }, '-=0.25')
    .to('.proj-meta',       { opacity: 1, y: 0 }, '-=0.2')
    .to('.proj-tools',      { opacity: 1, y: 0 }, '-=0.2')
    .to('.proj-hero-right', { opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.5)' }, '-=0.45');

  /* Process steps stagger on scroll */
  gsap.utils.toArray('.process-step').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.3)',
      delay: i * 0.1,
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });
}
