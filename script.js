import { initNav, initScrollLinks, initReveals, REDUCE, gsap } from './shared.js';
import { PROJECTS_LIST as PROJECTS } from './projects-data.js';

/* ============================================================
   RENDER WORK CARDS
   ============================================================ */
document.getElementById('workGrid').innerHTML = PROJECTS.map(p => `
  <article class="work-card reveal">
    <div class="card-cover" style="background:${p.color}">
      <span class="card-cover-title">${p.title}</span>
      <span class="card-cover-emoji" aria-hidden="true">${p.emoji}</span>
    </div>
    <div class="card-body">
      <span class="card-tag">${p.tag}</span>
      <h3 class="card-title">${p.title}</h3>
      <p class="card-desc">${p.desc}</p>
    </div>
    <div class="card-footer">
      <span class="card-year">${p.year}</span>
      <a href="project.html?id=${p.id}" class="card-cta">View case study →</a>
    </div>
  </article>
`).join('');

/* ============================================================
   INIT SHARED BEHAVIORS
   ============================================================ */
initNav();
initScrollLinks();
initReveals('#hero');

/* ============================================================
   ANIMATIONS — hero entrance
   ============================================================ */
if (!REDUCE) {
  gsap.timeline({ defaults: { ease: 'back.out(1.4)' } })
    .to('.badge',        { opacity: 1, y: 0, duration: 0.55, delay: 0.2 })
    .to('.line-hi',      { opacity: 1, y: 0, duration: 0.5 }, '-=0.25')
    .to('.line-name',    { opacity: 1, y: 0, duration: 0.6 }, '-=0.2')
    .to('.line-tagline', { opacity: 1, y: 0, duration: 0.55 }, '-=0.25')
    .to('.hero-meta',    { opacity: 1, y: 0, duration: 0.45 }, '-=0.2')
    .to('.hero-actions', { opacity: 1, y: 0, duration: 0.45 }, '-=0.2')
    .to('.social-row',   { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
    .to('.hero-right',   { opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.6)' }, '-=0.45');
}

/* ============================================================
   AVATAR ANIMATIONS
   ============================================================ */
function initAvatar() {
  const img    = document.getElementById('avatar-img');
  const shadow = document.querySelector('.avatar-shadow');
  const bubble = document.querySelector('.av-bubble');
  const frame  = document.querySelector('.canvas-frame');
  const tilt   = document.getElementById('avatar-tilt');

  if (!img) return;

  if (!REDUCE) {
    /* entrance — pop up from below with elastic bounce */
    gsap.fromTo(img,
      { y: 40, scale: 0.6, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, duration: 1.1, ease: 'elastic.out(1, 0.55)', delay: 1.1 }
    );
    gsap.fromTo(bubble,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(2.5)', delay: 1.85 }
    );

    /* continuous float — avatar bobs up and down */
    gsap.to(img, {
      y: -16,
      duration: 1.9,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    /* shadow shrinks as avatar rises */
    gsap.to(shadow, {
      scaleX: 0.55,
      opacity: 0.15,
      duration: 1.9,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    /* bubble mirrors float with slight phase offset */
    gsap.to(bubble, {
      y: -10,
      duration: 2.1,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 0.4,
    });

    /* mouse parallax — 3-D tilt using quickTo for smoothness */
    const rxTo = gsap.quickTo(tilt, 'rotateX', { duration: 0.55, ease: 'power2.out' });
    const ryTo = gsap.quickTo(tilt, 'rotateY', { duration: 0.55, ease: 'power2.out' });

    frame.addEventListener('mousemove', e => {
      const r  = frame.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width  - 0.5;  /* -0.5 … 0.5 */
      const ny = (e.clientY - r.top)  / r.height - 0.5;
      ryTo( nx * 22);
      rxTo(-ny * 14);
    });

    frame.addEventListener('mouseleave', () => {
      gsap.to(tilt, { rotateX: 0, rotateY: 0, duration: 0.9, ease: 'elastic.out(1, 0.5)' });
    });
  }
}

initAvatar();
