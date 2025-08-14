// ------- Mobile nav toggle -------
const burger = document.querySelector('.hamburger');
const nav = document.querySelector('.nav');
if (burger && nav) {
  burger.addEventListener('click', () => {
    nav.classList.toggle('nav--open');
    const open = nav.classList.contains('nav--open');
    burger.setAttribute('aria-expanded', open);
  });

  // Close menu when clicking a link (mobile)
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => nav.classList.remove('nav--open'));
  });
}

// ------- Sticky topbar shadow on scroll -------
const topbar = document.querySelector('.topbar');
let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY || document.documentElement.scrollTop;
  if (!topbar) return;
  topbar.style.boxShadow = y > 8 ? '0 10px 24px rgba(16,33,51,.10)' : 'none';
  lastY = y;
});

// ------- Footer year -------
const yearSpan = document.getElementById('year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

// ------- Animated counters -------
const counters = document.querySelectorAll('.stat__num');
const countersIO = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.target;
    let now = 0;
    const duration = 1400; // ms
    const start = performance.now();
    const easeOut = t => 1 - Math.pow(1 - t, 3);

    function frame(ts){
      const p = Math.min(1, (ts - start) / duration);
      now = Math.floor(easeOut(p) * target);
      el.textContent = now;
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = target;
    }
    requestAnimationFrame(frame);
    countersIO.unobserve(el);
  });
}, { threshold: 0.45 });
counters.forEach(c => countersIO.observe(c));

// ------- Scroll reveal (fade-in -> in-view) -------
const reveals = document.querySelectorAll('.fade-in');
const revealIO = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealIO.unobserve(entry.target);
    }
  });
}, { threshold: 0.22 });
reveals.forEach(el => revealIO.observe(el));

// ------- Booking form -------
const form = document.getElementById('bookingForm');
const note = document.getElementById('formNote');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const required = ['name', 'phone', 'date'];
    const missing = required.filter(k => !String(data.get(k) || '').trim());
    if (missing.length) {
      note.textContent = 'Please fill all required fields.';
      note.style.color = '#d32f2f';
      return;
    }
    // Basic phone check
    const phone = String(data.get('phone')).replace(/\s+/g,'');
    if (!/^\+?\d{8,15}$/.test(phone)) {
      note.textContent = 'Enter a valid phone number.';
      note.style.color = '#d32f2f';
      return;
    }
    note.textContent = 'Thank you! We will confirm your appointment shortly.';
    note.style.color = '#2e7d32';
    form.reset();
  });
}

// ------- Lightweight testimonial auto-scroll on mobile -------
const quotes = document.querySelector('.testimonials .quotes');
let autoScrollTimer;
function startAutoScroll(){
  if (!quotes) return;
  if (window.matchMedia('(max-width: 720px)').matches){
    let pos = 0;
    autoScrollTimer = setInterval(() => {
      const max = quotes.scrollWidth - quotes.clientWidth;
      pos = (pos + quotes.clientWidth * 0.9);
      if (pos > max) pos = 0;
      quotes.scrollTo({ left: pos, behavior: 'smooth' });
    }, 3500);
  }
}
function stopAutoScroll(){
  if (autoScrollTimer) clearInterval(autoScrollTimer);
}
startAutoScroll();
window.addEventListener('resize', () => { stopAutoScroll(); startAutoScroll(); });

// Pause on user interaction
if (quotes){
  ['touchstart','mousedown','wheel'].forEach(evt => {
    quotes.addEventListener(evt, () => stopAutoScroll(), { passive:true });
  });
}

