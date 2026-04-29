document.addEventListener('DOMContentLoaded', function() {
  const steps = document.querySelectorAll('.timeline-step');
  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const step = entry.target;
        const delay = parseInt(step.getAttribute('data-step')) * 0.2;
        setTimeout(() => {
          step.classList.add('active');
          const number = step.querySelector('.step-number');
          number.style.animation = 'stepBounce 0.6s ease';
        }, delay * 1000);
        stepObserver.unobserve(step);
      }
    });
  }, { threshold: 0.3 });
  steps.forEach(step => stepObserver.observe(step));

  const cards = document.querySelectorAll('.step-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(107,44,145,0.1), transparent 50%)`;
    });
    card.addEventListener('mouseleave', () => { card.style.background = ''; });
  });
});

const style = document.createElement('style');
style.textContent = `@keyframes stepBounce { 0%{transform:scale(1);} 40%{transform:scale(1.15);} 60%{transform:scale(0.95);} 80%{transform:scale(1.05);} 100%{transform:scale(1);} }`;
document.head.appendChild(style);
