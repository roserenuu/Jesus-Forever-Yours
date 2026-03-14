// === index.html ===
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


  // Sticky bar show after scrolling past hero
  const stickyBar = document.getElementById('stickyBar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      stickyBar.classList.add('visible');
    } else {
      stickyBar.classList.remove('visible');
    }
  }, {passive: true});


  function toggleFaq(el) {
    const isOpen = el.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) el.classList.add('open');
  }

// === index.html ===
const els=document.querySelectorAll('.reveal');
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}});
  },{threshold:.1});
  els.forEach(el=>obs.observe(el));

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


  // Sticky bar show after scrolling past hero
  const stickyBar = document.getElementById('stickyBar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      stickyBar.classList.add('visible');
    } else {
      stickyBar.classList.remove('visible');
    }
  }, {passive: true});


  function toggleFaq(el) {
    const isOpen = el.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) el.classList.add('open');
  }

// === sample.html ===
const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if(e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, {threshold: .08});
    els.forEach(el => obs.observe(el));

// === testimony.html ===
const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if(e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, {threshold: .08});
    els.forEach(el => obs.observe(el));

// === contact.html ===
const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if(e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, {threshold: .08});
    els.forEach(el => obs.observe(el));

    function handleSubmit() {
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      if (!name || !email || !message) {
        alert('Please fill in all required fields.');
        return;
      }
      document.getElementById('contactForm').style.display = 'none';
      document.getElementById('formSuccess').style.display = 'block';
    }

// === thankyou-digital.html ===
const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if(e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, {threshold: .08});
    els.forEach(el => obs.observe(el));

// === thankyou-hardcover.html ===
const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if(e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, {threshold: .08});
    els.forEach(el => obs.observe(el));


// === MOBILE NAV ===
(function() {
  var hamBtn = document.getElementById('hamBtn');
  var drawer = document.getElementById('mobileDrawer');
  if (hamBtn && drawer) {
    hamBtn.addEventListener('click', function() {
      hamBtn.classList.toggle('open');
      drawer.classList.toggle('open');
      document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
    });
    drawer.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        hamBtn.classList.remove('open');
        drawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
})();

// === SCROLL REVEAL ===
(function() {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, {threshold: 0.1});
  els.forEach(function(el) { obs.observe(el); });
})();
