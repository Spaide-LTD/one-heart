// contact.js - Only handles Supabase, form submits normally to PHP

// Supabase client
let supabaseClient = null;

// Initialize Supabase
async function initSupabase() {
    try {
        if (typeof SUPABASE_URL !== 'undefined' && typeof SUPABASE_KEY !== 'undefined') {
            supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            console.log("Supabase initialized");
        }
    } catch (error) {
        console.error("Supabase init failed:", error);
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    await initSupabase();
    
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});

async function handleFormSubmit(event) {
    // Don't prevent default - let the form submit normally to PHP
    // But we'll save to Supabase first
    
    const form = event.target;
    const submitBtn = form.querySelector('.form-submit');
    
    // Get form data
    const formData = {
        org_name: form.querySelector('[name="org_name"]')?.value.trim(),
        email: form.querySelector('[name="email"]')?.value.trim(),
        phone: form.querySelector('[name="phone"]')?.value.trim() || null,
        event_date: form.querySelector('[name="event_date"]')?.value || null,
        budget: form.querySelector('[name="budget"]')?.value || null,
        message: form.querySelector('[name="message"]')?.value.trim() || null
    };
    
    // Validate
    if (!formData.org_name) {
        event.preventDefault();
        showNotification('Please enter your organization name', 'warning');
        return;
    }
    
    if (!formData.email) {
        event.preventDefault();
        showNotification('Please enter your email address', 'warning');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        event.preventDefault();
        showNotification('Please enter a valid email address', 'warning');
        return;
    }
    
    // Save to Supabase (don't block form submission)
    if (supabaseClient) {
        try {
            await supabaseClient
                .from('contact_messages')
                .insert({
                    org_name: formData.org_name,
                    email: formData.email,
                    phone: formData.phone,
                    budget: formData.budget,
                    event_date: formData.event_date,
                    message: formData.message,
                    status: 'unread',
                    created_at: new Date().toISOString()
                });
            console.log('Saved to Supabase');
        } catch (error) {
            console.error('Supabase error:', error);
        }
    }
    
    // Show loading on button
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
    }
    
    // Form will now submit normally to PHP
    // The PHP will handle email sending
    return true;
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.form-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'form-notification';
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        padding: 12px 20px;
        background: ${colors[type] || '#3b82f6'};
        color: white;
        border-radius: 8px;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
        cursor: pointer;
    `;
    
    notification.innerHTML = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add styles
if (!document.querySelector('#contact-styles')) {
    const style = document.createElement('style');
    style.id = 'contact-styles';
    style.textContent = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
        
        .fa-spin {
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}
