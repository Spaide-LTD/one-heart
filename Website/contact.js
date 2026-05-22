// contact.js - Production ready with Supabase + Mailman

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
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('.form-submit');
    const originalContent = submitBtn.innerHTML;
    
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
        showNotification('Please enter your organization name', 'warning');
        return;
    }
    
    if (!formData.email) {
        showNotification('Please enter your email address', 'warning');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showNotification('Please enter a valid email address', 'warning');
        return;
    }
    
    // Prepare email content for mailman
    const fullMessage = `Organization: ${formData.org_name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Event Date: ${formData.event_date || 'Not specified'}
Budget: ${formData.budget || 'Not specified'}

Message:
${formData.message || 'No message provided'}`;
    
    const emailData = {
        name: formData.org_name,
        email: formData.email,
        phone: formData.phone || 'Not provided',
        message: fullMessage,
        subject: `Contact Form: ${formData.org_name}`
    };
    
    // Show loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
    
    let dbSuccess = false;
    let emailSuccess = false;
    
    try {
        // 1. Save to Supabase
        if (supabaseClient) {
            const { error } = await supabaseClient
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
            
            if (!error) {
                dbSuccess = true;
                console.log('Saved to Supabase');
            } else {
                console.error('Supabase error:', error);
            }
        }
        
        // 2. Send emails through mailman
        const response = await fetch('/mailman/send.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            emailSuccess = true;
        } else {
            throw new Error(result.error || 'Failed to send email');
        }
        
        // Show success if at least one operation succeeded
        if (dbSuccess || emailSuccess) {
            showSuccessMessage(form, formData.org_name);
            showNotification('Your message has been sent successfully!', 'success');
        } else {
            throw new Error('Failed to save or send message');
        }
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
        
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalContent;
    }
}

function showSuccessMessage(form, orgName) {
    form.style.display = 'none';
    
    const container = document.querySelector('.contact-container');
    if (!container) return;
    
    // Remove any existing success message
    const existingSuccess = document.querySelector('.success-message');
    if (existingSuccess) existingSuccess.remove();
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        text-align: center;
        padding: 60px 40px;
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
        border-radius: 24px;
        border: 1px solid rgba(16, 185, 129, 0.3);
        animation: fadeInUp 0.5s ease;
    `;
    
    successDiv.innerHTML = `
        <i class="fas fa-check-circle" style="font-size: 64px; color: #10b981; margin-bottom: 20px;"></i>
        <h3 style="color: #fff; margin-bottom: 10px;">Thank You, ${escapeHtml(orgName)}!</h3>
        <p style="color: #aaa; margin-bottom: 20px;">
            Your message has been sent successfully.<br>
            Our team will get back to you within 24 hours.
        </p>
        <button onclick="location.reload()" class="btn-primary" style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            padding: 12px 24px;
            border-radius: 12px;
            color: white;
            cursor: pointer;
            font-size: 16px;
        ">
            Send Another Message
        </button>
    `;
    
    container.insertBefore(successDiv, form);
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
    `;
    
    notification.innerHTML = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add styles
if (!document.querySelector('#contact-styles')) {
    const style = document.createElement('style');
    style.id = 'contact-styles';
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
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
