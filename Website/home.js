

// ============================================
// HOME PAGE JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  
  // ===== ANIMATED COUNTERS =====
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target'));
        animateCounter(entry.target, target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => counterObserver.observe(counter));
  
  function animateCounter(element, target) {
    let current = 0;
    const increment = target / 60;
    const suffix = element.textContent.includes('%') ? '%' : (element.textContent.includes('+') ? '+' : '');
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current) + suffix;
    }, 30);
  }
  
  // ===== PARALLAX EFFECT ON HERO =====
  const heroContent = document.querySelector('.hero-content');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
      heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.8;
    }
  });
  
  // ===== MOUSE GLOW EFFECT ON CTA =====
  const ctaGlass = document.querySelector('.cta-glass');
  if (ctaGlass) {
    ctaGlass.addEventListener('mousemove', (e) => {
      const rect = ctaGlass.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ctaGlass.style.background = `
        radial-gradient(circle at ${x}px ${y}px, 
        rgba(107, 44, 145, 0.15), 
        rgba(0, 180, 216, 0.1) 40%, 
        transparent 70%)
      `;
    });
    
    ctaGlass.addEventListener('mouseleave', () => {
      ctaGlass.style.background = '';
    });
  }
});
