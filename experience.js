import { initNav, initReveals, initScrollLinks, REDUCE, gsap } from './shared.js';

initNav();
initScrollLinks();

/* ============================================================
   DATA
   ============================================================ */
const EXPERIENCE = [
  {
    period: '2024 – Present',
    role: 'Product Designer',
    company: 'TezPi Studio',
    location: 'Biên Hòa, VN · Freelance',
    desc: 'Self-led design studio focused on mobile product UI/UX, game HUD systems, and design-system architecture. Projects include AI tattoo studio, wellness app, analytics dashboard, and home-services platform.',
    tags: ['Figma', 'Design Systems', 'User Research', 'Motion Design', 'Three.js'],
    color: 'var(--coral)',
    icon: '🎨',
  },
  {
    period: '2022 – 2024',
    role: 'UI/UX Designer',
    company: 'Tech Agency',
    location: 'Ho Chi Minh City, VN',
    desc: 'End-to-end product design for SaaS and e-commerce platforms. Led a design system migration that unified 3 products across 12 engineers, cutting design-to-dev handoff time by ~40%.',
    tags: ['Figma', 'Component Libraries', 'Prototyping', 'Usability Testing', 'Agile'],
    color: 'var(--purple)',
    icon: '✏️',
  },
  {
    period: '2020 – 2022',
    role: 'Frontend Developer',
    company: 'Software Company',
    location: 'Biên Hòa, VN',
    desc: 'Built React and Vue.js interfaces working closely with design teams. Developed the engineering intuition that now drives my design-to-code fluency and deep empathy for dev constraints.',
    tags: ['React', 'Vue.js', 'CSS/SCSS', 'REST APIs', 'Git'],
    color: 'var(--teal)',
    icon: '💻',
  },
];

const EDUCATION = [
  {
    period: '2016 – 2020',
    degree: 'Bachelor of Software Engineering',
    school: 'University of Technology',
    location: 'Vietnam',
    icon: '🎓',
    color: 'var(--yellow)',
  },
  {
    period: '2022',
    degree: 'Google UX Design Certificate',
    school: 'Google / Coursera',
    location: 'Online',
    icon: '📜',
    color: 'var(--mint)',
  },
];

/* Layout in a 3-col grid:
   Row 1: Figma (1) | Framer (1) | Spine 2D (1)
   Row 2: Creative Suite (2)     | Dev Tools (1)
   Row 3: AI Tools         (3)                   */
const TOOL_GROUPS = [
  {
    id: 'figma',
    span: 1,
    tools: [{ name: 'Figma', slug: 'figma', color: '#FF7262' }],
    skills: ['UI Design', 'UX Research', 'Prototype', 'Design System'],
  },
  {
    id: 'framer',
    span: 1,
    tools: [{ name: 'Framer', slug: 'framer', color: '#0055FF' }],
    skills: ['Interactive Proto', 'Web Animation', 'CMS', 'Components'],
  },
  {
    id: 'spine',
    span: 1,
    tools: [{ name: 'Spine 2D', logoText: 'SP', color: '#F0A500' }],
    skills: ['Bone Animation', 'Mesh Deform', 'Game Assets', 'Rigging'],
  },
  {
    id: 'creative',
    span: 2,
    label: 'Creative Suite',
    tools: [
      { name: 'Photoshop', slug: 'adobephotoshop', color: '#31A8FF' },
      { name: 'Affinity',  slug: 'affinity',       color: '#1B72BE' },
    ],
    skills: ['Photo Editing', 'Digital Art', 'Vector Design', 'Asset Export'],
  },
  {
    id: 'dev',
    span: 1,
    label: 'Dev Tools',
    tools: [
      { name: 'VS Code',      slug: 'visualstudiocode', color: '#007ACC' },
      { name: 'Antigravity',  logoText: 'AG',           color: '#FF4757' },
    ],
    skills: ['Frontend Dev', 'Code Handoff', 'Dev Sync'],
  },
  {
    id: 'ai',
    span: 3,
    label: 'AI Tools',
    tools: [
      { name: 'Claude',   slug: 'anthropic',    color: '#C9855A' },
      { name: 'Sitch',    logoText: 'Si',        color: '#7C3AED' },
      { name: 'ChatGPT',  slug: 'openai',        color: '#10A37F' },
      { name: 'Gemini',   slug: 'googlegemini',  color: '#4285F4' },
    ],
    skills: ['Prompt Engineering', 'AI Research', 'Content Gen', 'AI-Assisted Design'],
  },
];

/* ============================================================
   RENDER TIMELINE
   ============================================================ */
document.getElementById('timeline-list').innerHTML = EXPERIENCE.map((e, i) => `
  <div class="timeline-item reveal" style="--accent:${e.color}">
    <div class="timeline-badge">${e.icon}</div>
    <div class="timeline-connector" aria-hidden="true"></div>
    <div class="timeline-card">
      <span class="timeline-period">${e.period}</span>
      <h3 class="timeline-role">${e.role}</h3>
      <p class="timeline-company">${e.company} <span class="timeline-loc">· ${e.location}</span></p>
      <p class="timeline-desc">${e.desc}</p>
      <div class="tags-row">
        ${e.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
    </div>
  </div>
`).join('');

/* ============================================================
   RENDER EDUCATION
   ============================================================ */
document.getElementById('edu-list').innerHTML = EDUCATION.map(e => `
  <div class="edu-card reveal" style="--accent:${e.color}">
    <div class="edu-icon">${e.icon}</div>
    <span class="edu-period">${e.period}</span>
    <h3 class="edu-degree">${e.degree}</h3>
    <p class="edu-school">${e.school}</p>
    <p class="edu-location">📍 ${e.location}</p>
  </div>
`).join('');

/* ============================================================
   RENDER TOOLS
   ============================================================ */
function toolLogoEl(t, size) {
  const dim = size === 'lg' ? 38 : 26;
  const inner = t.slug
    ? `<img src="https://cdn.simpleicons.org/${t.slug}/ffffff" width="${dim}" height="${dim}" alt="${t.name}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'tool-logo-text',textContent:'${(t.name.slice(0,2))}'}));">`
    : `<span class="tool-logo-text">${t.logoText}</span>`;
  return `<div class="tool-logo-wrap ${size}" style="--brand:${t.color}">${inner}</div>`;
}

function renderTool(g) {
  const solo = g.tools.length === 1;
  if (solo) {
    return `
      <div class="tool-card reveal" data-span="${g.span}">
        ${toolLogoEl(g.tools[0], 'lg')}
        <h4 class="tool-name">${g.tools[0].name}</h4>
        <div class="tool-chips">
          ${g.skills.map(s => `<span class="tag">${s}</span>`).join('')}
        </div>
      </div>`;
  }
  return `
    <div class="tool-card tool-card-multi reveal" data-span="${g.span}">
      ${g.label ? `<span class="tool-group-label">${g.label}</span>` : ''}
      <div class="tool-logos-row">
        ${g.tools.map(t => `
          <div class="tool-logo-item">
            ${toolLogoEl(t, 'sm')}
            <span class="tool-logo-name">${t.name}</span>
          </div>`).join('')}
      </div>
      <div class="tool-chips">
        ${g.skills.map(s => `<span class="tag">${s}</span>`).join('')}
      </div>
    </div>`;
}

document.getElementById('skills-list').innerHTML = `
  <div class="tools-grid">
    ${TOOL_GROUPS.map(renderTool).join('')}
  </div>`;

/* ============================================================
   ANIMATIONS
   ============================================================ */
initReveals();

if (!REDUCE) {
  /* page hero stagger */
  gsap.timeline({ defaults: { ease: 'back.out(1.3)' } })
    .to('.page-hero .section-eyebrow', { opacity: 1, y: 0, duration: 0.5, delay: 0.15 })
    .to('.page-hero-title',            { opacity: 1, y: 0, duration: 0.6 }, '-=0.2')
    .to('.page-hero-sub',              { opacity: 1, y: 0, duration: 0.45 }, '-=0.2')
    .to('.page-hero .btn',             { opacity: 1, y: 0, duration: 0.4 }, '-=0.2');
}
