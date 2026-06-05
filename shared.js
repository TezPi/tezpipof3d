import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  ScrollTrigger.create({
    start: '80px top',
    onEnter:     () => nav.classList.add('visible'),
    onLeaveBack: () => nav.classList.remove('visible'),
  });
}

export function initScrollLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id && id.length > 1) {
        e.preventDefault();
        gsap.to(window, { duration: 0.85, scrollTo: { y: id, offsetY: 72 }, ease: 'power3.inOut' });
      }
    });
  });
}

export function initReveals(skipSelector = null) {
  if (REDUCE) return;
  gsap.utils.toArray('.reveal').forEach(el => {
    if (skipSelector && el.closest(skipSelector)) return;
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.65, ease: 'back.out(1.3)',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });
}

export { gsap, ScrollTrigger, ScrollToPlugin };
