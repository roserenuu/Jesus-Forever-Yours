// Behold widget loader
(() => {
  const d=document,s=d.createElement("script");s.type="module";
  s.src="https://w.behold.so/widget.js";d.head.append(s);
})();

// Reveal animations on scroll
document.addEventListener('DOMContentLoaded', () => {
  const els=document.querySelectorAll('.reveal');
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}});
  },{threshold:.1});
  els.forEach(el=>obs.observe(el));

  // Sticky bar show after scrolling past hero
  const stickyBar = document.getElementById('stickyBar');
  if (stickyBar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        stickyBar.classList.add('visible');
      } else {
        stickyBar.classList.remove('visible');
      }
    }, {passive: true});
  }
});

// Email signup handler
function handleEmailSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('emailBtn');
  const input = document.getElementById('emailInput');
  btn.textContent = "You are on the list!";
  btn.style.background = '#7C6A54';
  input.value = '';
  input.placeholder = 'Thank you!';
  input.disabled = true;
}

// FAQ toggle
function toggleFaq(el) {
  const isOpen = el.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) el.classList.add('open');
}

// Mobile menu
function openMobileMenu() {
  document.getElementById('mobileOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMobileMenu() {
  document.getElementById('mobileOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
