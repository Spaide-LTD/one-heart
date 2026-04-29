// ============================================
// SERVICES PAGE JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  
  // ===== 3D TILT EFFECT ON CARDS =====
  const cards = document.querySelectorAll('.service-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      const inner = card.querySelector('.service-card-inner');
      inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      const inner = card.querySelector('.service-card-inner');
      inner.style.transform = '';
    });
  });
  
  // ===== STAGGERED REVEAL =====
  const reveals = document.querySelectorAll('.services-section .reveal');
  reveals.forEach((el, index) => {
    el.style.transitionDelay = `${index * 0.1}s`;
  });
});
