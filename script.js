/* =====================================================================
   DATA LAYER  (separation of concerns — swap for an API call later:
   const PROJECTS = await fetch('/api/projects').then(r => r.json()); )
   ===================================================================== */
const PROJECTS = [
  { id:'inklab', title:'InkLab', tag:'AI Tattoo Studio · Mobile', year:'2025',
    accent:'var(--purple)',
    blurb:'An AI-powered tattoo studio app for the Vietnamese market. Design-system-driven UI (purple accent, editorial type) with a Behance-ready case study and a flow that turns inspiration into booked appointments.' },
  { id:'aura', title:'Aura', tag:'Emotional Wellness · Mobile', year:'2025',
    accent:'var(--blue)',
    blurb:'A gamified emotional-wellness app with an animated AI companion and an energy/store economy. High-fidelity interactive prototypes balancing playful mechanics with a calm, sketch-faithful layout.' },
  { id:'pulse', title:'Pulse', tag:'Analytics Dashboard · Web', year:'2024',
    accent:'var(--green)',
    blurb:'A Mixpanel-style analytics dashboard. Dense data made legible through clear hierarchy, restrained color, and an 8-slide editorial case study built for the developer handoff.' },
  { id:'thoroi', title:'Thợ Ơi!', tag:'Home Services · Mobile', year:'2024',
    accent:'var(--red)',
    blurb:'A Vietnamese home-repair booking app. A full Nielsen heuristic audit drove a redesign of five core screens — measurably lower friction from search to booking.' },
];

/* =====================================================================
   VIEW LAYER — render cards (handles empty state)
   ===================================================================== */
const grid = document.getElementById('workGrid');
function renderProjects(list){
  if(!list || list.length === 0){
    grid.innerHTML = '<div class="empty"><b>NO ISSUES YET</b><span style="font-weight:700">New work is in production — check back soon.</span></div>';
    return;
  }
  grid.innerHTML = list.map((p,i) => `
    <article class="card reveal" data-card data-id="${p.id}" tabindex="0" role="button"
             aria-label="Open case study: ${p.title}">
      <span class="ribbon">ISSUE #0${i+1}</span>
      <button class="closex" data-close aria-label="Close">×</button>
      <div class="cover" style="background:${p.accent}">
        <div class="halftone" style="color:#000"></div>
        <div class="big">${p.title}</div>
      </div>
      <div class="meta">
        <h4>${p.title}</h4>
        <span class="tag">${p.tag} · ${p.year}</span>
        <p class="blurb">${p.blurb}</p>
      </div>
    </article>`).join('');
  bindCards();
}

/* =====================================================================
   MOTION LAYER — GSAP (plugins: ScrollTrigger, ScrollToPlugin,
                        Draggable, Flip, CustomEase)
   ===================================================================== */
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Draggable, Flip, CustomEase);
const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// signature "comic snap" easing curve
CustomEase.create('comic', 'M0,0 C0.16,1 0.3,1 1,1');

// split a heading into per-character spans (lightweight SplitText alternative)
function splitChars(el){
  const text = el.textContent;
  el.setAttribute('aria-label', text);
  el.innerHTML = [...text].map(c =>
    c === ' ' ? ' ' : `<span class="ch" aria-hidden="true" style="display:inline-block;will-change:transform">${c}</span>`
  ).join('');
  return el.querySelectorAll('.ch');
}

/* ---- COVER / INTRO ---- */
function runIntro(){
  const cover = document.getElementById('cover');
  const finish = () => {
    if(REDUCE){
      cover.style.display = 'none';
      gsap.set('#nav', { y:0 });
      return;
    }
    const tl = gsap.timeline();
    tl.to('#coverBar', { width:'100%', duration:.7, ease:'power2.out' })
      .to('#cover .cover-inner', { y:-30, opacity:0, duration:.4, ease:'power2.in' }, '+=.15')
      .to(cover, { yPercent:-100, duration:.6, ease:'comic',
                   onComplete:() => cover.style.display='none' }, '-=.1')
      .to('#nav', { y:0, duration:.5, ease:'comic' }, '-=.3')
      .add(heroIn, '-=.2');
  };
  // wait for window load (artwork/fonts) but never hang the page
  if(document.readyState === 'complete') finish();
  else window.addEventListener('load', finish);
  setTimeout(finish, 2600); // safety cap
}
let introDone = false;
function once(fn){ return () => { if(introDone) return; introDone = true; fn(); }; }

/* ---- HERO REVEAL ---- */
const heroIn = once(() => {
  if(REDUCE) return;
  const chars = splitChars(document.querySelector('.hero-headline'));
  gsap.from(chars, { yPercent:120, opacity:0, rotation:6, stagger:.025, duration:.6, ease:'comic' });
  gsap.from('.hero-left .eyebrow', { x:-20, opacity:0, duration:.5, ease:'power2.out' });
  gsap.from('.role, .hero-desc, .hero-actions', { y:24, opacity:0, stagger:.12, duration:.5, ease:'power2.out', delay:.2 });
  gsap.from('.stage .panel', { scale:.8, opacity:0, rotation:-4, duration:.7, ease:'comic', delay:.15 });
  gsap.from('.sticker', { scale:0, rotation:-30, opacity:0, stagger:.1, duration:.5, ease:'back.out(2)', delay:.5 });
});

/* ---- SCROLL REVEALS ---- */
function scrollReveals(){
  if(REDUCE) return;
  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.from(el, {
      scrollTrigger:{ trigger:el, start:'top 86%' },
      y:40, opacity:0, duration:.6, ease:'comic'
    });
  });
  // subtle parallax on the hero stage as you scroll away
  gsap.to('.stage', { yPercent:-12, ease:'none',
    scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:true } });
}

/* ---- SMOOTH NAV (ScrollToPlugin) ---- */
function bindNav(){
  document.querySelectorAll('[data-scroll]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if(id && id.startsWith('#') && id.length > 1){
        e.preventDefault();
        gsap.to(window, { duration:.9, ease:'power3.inOut', scrollTo:{ y:id, offsetY:64 } });
      }
    });
  });
}

/* ---- MAGNETIC CTAs ---- */
function bindMagnetic(){
  if(REDUCE) return;
  document.querySelectorAll('[data-magnetic]').forEach(btn => {
    btn.addEventListener('pointermove', e => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, { x:(e.clientX-r.left-r.width/2)*.35, y:(e.clientY-r.top-r.height/2)*.45, duration:.3, ease:'power2.out' });
    });
    btn.addEventListener('pointerleave', () =>
      gsap.to(btn, { x:0, y:0, duration:.5, ease:'elastic.out(1,.4)' }));
  });
}

/* ---- DRAGGABLE STICKERS ---- */
function bindDraggables(){
  document.querySelectorAll('[data-drag]').forEach((el, i) => {
    gsap.set(el, { rotation: gsap.utils.random(-8, 8) }); // Draggable preserves this
    Draggable.create(el, {
      type:'x,y',
      bounds:'#hero',
      onPress(){ gsap.to(el, { scale:1.12, duration:.2, ease:'comic' }); this.target.style.zIndex = 99; },
      onRelease(){ gsap.to(el, { scale:1, duration:.4, ease:'elastic.out(1,.5)' }); }
    });
  });
}

/* ---- WORK CARDS: Flip expand/collapse ---- */
let openCard = null;
const backdrop = document.getElementById('backdrop');
function openProject(card){
  if(openCard) return;
  const state = Flip.getState(card, { props:'borderRadius' });
  card.classList.add('is-open');
  backdrop.classList.add('show');
  document.body.classList.add('modal-on');
  Flip.from(state, { duration:REDUCE?0:.5, ease:'power3.inOut', absolute:true, scale:true });
  openCard = card;
}
function closeProject(){
  if(!openCard) return;
  const card = openCard; openCard = null;
  const state = Flip.getState(card, { props:'borderRadius' });
  card.classList.remove('is-open');
  backdrop.classList.remove('show');
  document.body.classList.remove('modal-on');
  Flip.from(state, { duration:REDUCE?0:.45, ease:'power3.inOut', absolute:true, scale:true });
}
function bindCards(){
  document.querySelectorAll('[data-card]').forEach(card => {
    card.addEventListener('click', e => {
      if(e.target.closest('[data-close]')){ closeProject(); return; }
      if(!card.classList.contains('is-open')) openProject(card);
    });
    card.addEventListener('keydown', e => {
      if((e.key==='Enter'||e.key===' ') && !card.classList.contains('is-open')){ e.preventDefault(); openProject(card); }
    });
  });
}
backdrop.addEventListener('click', closeProject);
document.addEventListener('keydown', e => { if(e.key==='Escape') closeProject(); });

/* =====================================================================
   3D LAYER — Three.js toon-shaded hero (placeholder for Meshy GLB)
   Swap-in: load a .glb with THREE.GLTFLoader and replace `hero3d`.
   ===================================================================== */
let renderer, scene, camera, hero3d, pointerX = 0, pointerY = 0;
function init3D(){
  const canvas = document.getElementById('hero-canvas');
  const wrap = canvas.parentElement;
  try{
    renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
  }catch(err){ document.getElementById('fallback3d').classList.add('show'); canvas.style.display='none'; return; }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 6);

  const geo = new THREE.TorusKnotGeometry(1.05, 0.36, 160, 28);
  hero3d = new THREE.Mesh(geo, new THREE.MeshToonMaterial({ color:0x2b6fff }));
  // inverted-hull black outline for the inked-comic look
  const outline = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color:0x0d0d0d, side:THREE.BackSide }));
  outline.scale.setScalar(1.06);
  hero3d.add(outline);
  scene.add(hero3d);

  scene.add(new THREE.AmbientLight(0xffffff, 0.65));
  const key = new THREE.DirectionalLight(0xffffff, 1.15); key.position.set(3, 4, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0xff2e4d, 0.85); rim.position.set(-4, -2, 2); scene.add(rim);

  function resize(){
    const r = wrap.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  wrap.addEventListener('pointermove', e => {
    const r = wrap.getBoundingClientRect();
    pointerX = (e.clientX - r.left) / r.width - 0.5;
    pointerY = (e.clientY - r.top) / r.height - 0.5;
  });

  (function loop(){
    requestAnimationFrame(loop);
    hero3d.rotation.y += REDUCE ? 0 : 0.006;
    hero3d.rotation.x += ((-pointerY * 0.6) - hero3d.rotation.x) * 0.06;
    hero3d.rotation.z += (( pointerX * 0.4) - hero3d.rotation.z) * 0.06;
    renderer.render(scene, camera);
  })();
}

/* =====================================================================
   BOOT
   ===================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  renderProjects(PROJECTS);
  bindNav();
  bindMagnetic();
  bindDraggables();
  scrollReveals();
  if(window.THREE) init3D(); else document.getElementById('fallback3d').classList.add('show');
  runIntro();
});
