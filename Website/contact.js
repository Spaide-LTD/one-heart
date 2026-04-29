document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Simulate form submission
    const submitBtn = form.querySelector('.form-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      // Show success message
      const formCard = document.querySelector('.form-card');
      formCard.innerHTML = `
        <div class="form-success">
          <i class="fas fa-check-circle"></i>
          <h3>Message Sent Successfully!</h3>
          <p>Thank you for reaching out, ${data.name || 'there'}! Our team will contact you within 24 hours.</p>
          <br>
          <button class="btn-primary" onclick="location.reload()">
            <span>Send Another Message</span>
            <i class="fas fa-redo"></i>
          </button>
        </div>
      `;
    }, 2000);
  });
  
  // Input focus effects
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.querySelector('label i').style.color = 'var(--secondary)';
    });
    input.addEventListener('blur', () => {
      input.parentElement.querySelector('label i').style.color = '';
    });
  });
});
