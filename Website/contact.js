// contact.js - Contact form with Supabase AND Mailman

// Initialize Supabase
let supabaseClient = null;

async function initSupabase() {
    try {
        // Make sure SUPABASE_URL and SUPABASE_KEY are defined in your supabase.js
        if (typeof SUPABASE_URL !== 'undefined' && typeof SUPABASE_KEY !== 'undefined') {
            supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            console.log("Supabase client created successfully");
        } else {
            console.warn("Supabase credentials not found");
        }
        return true;
    } catch (error) {
        console.error("Failed to initialize Supabase:", error);
        return false;
    }
}

// Save contact inquiry to database
async function saveContactInquiry(formData) {
    if (!supabaseClient) {
        console.log("No Supabase client, skipping database save");
        return true; // Return true to continue with email sending
    }
    
    console.log("Saving to Supabase:", formData);
    
    try {
        const { data, error } = await supabaseClient
            .from('contact_messages')
            .insert({
                org_name: formData.org_name,
                email: formData.email,
                phone: formData.phone || null,
                budget: formData.budget || null,
                event_date: formData.event_date || null,
                message: formData.message || null,
                status: 'unread',
                created_at: new Date().toISOString()
            })
            .select();
        
        if (error) {
            console.error("Supabase error:", error);
            return false;
        }
        
        console.log("Saved to Supabase successfully:", data);
        return true;
        
    } catch (error) {
        console.error("Exception saving to Supabase:", error);
        return false;
    }
}

// Send email through mailman
async function sendEmailThroughMailman(formData) {
    // Prepare the full message with all details
    const fullMessage = `
🏢 Organization: ${formData.org_name}
📧 Email: ${formData.email}
📞 Phone: ${formData.phone || 'Not provided'}
📅 Event Date: ${formData.event_date || 'Not specified'}
💰 Budget: ${formData.budget || 'Not specified'}

💭 Message:
${formData.message || 'No message provided'}
    `.trim();
    
    const emailData = {
        name: formData.org_name,
        email: formData.email,
        phone: formData.phone || 'Not provided',
        message: fullMessage,
        subject: `New Contact Form Submission from ${formData.org_name}`
    };
    
    console.log("Sending to mailman:", emailData);
    
    try {
        const response = await fetch('/mailman/send.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData)
        });
        
        const result = await response.json();
        console.log("Mailman response:", result);
        
        if (result.success) {
            return true;
        } else {
            console.error("Mailman error:", result.error);
            return false;
        }
    } catch (error) {
        console.error("Failed to send email:", error);
        return false;
    }
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.form-submit');
    const originalText = submitBtn.innerHTML;
    
    // Get form data
    const formData = {
        org_name: document.querySelector('[name="org_name"]')?.value?.trim() || '',
        email: document.querySelector('[name="email"]')?.value?.trim() || '',
        phone: document.querySelector('[name="phone"]')?.value?.trim() || '',
        budget: document.querySelector('[name="budget"]')?.value || '',
        event_date: document.querySelector('[name="event_date"]')?.value || '',
        message: document.querySelector('[name="message"]')?.value?.trim() || ''
    };
    
    console.log("Form data collected:", formData);
    
    // Validation
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
    
    // Show loading state
    submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;
    
    let dbSuccess = false;
    let emailSuccess = false;
    
    try {
        // 1. Save to Supabase (if available)
        dbSuccess = await saveContactInquiry(formData);
        
        // 2. Send emails through mailman
        emailSuccess = await sendEmailThroughMailman(formData);
        
        // Check results
        if (emailSuccess) {
            // Show success message
            const contactContainer = document.querySelector('.contact-container');
            if (contactContainer) {
                // Hide the form
                const formElement = document.getElementById('contactForm');
                if (formElement) {
                    formElement.style.display = 'none';
                }
                
                // Create success message
                const successDiv = document.createElement('div');
                successDiv.className = 'form-success';
                successDiv.style.cssText = `
                    text-align: center;
                    padding: 60px 40px;
                    background: rgba(16, 185, 129, 0.1);
                    border-radius: 24px;
                    border: 1px solid rgba(16, 185, 129, 0.3);
                    animation: slideIn 0.5s ease;
                `;
                successDiv.innerHTML = `
                    <i class="fas fa-check-circle" style="font-size: 64px; color: #10b981; margin-bottom: 20px; display: inline-block;"></i>
                    <h3 style="color: var(--text-primary, #fff); margin-bottom: 10px;">Message Sent Successfully!</h3>
                    <p style="color: var(--text-secondary, #aaa); margin-bottom: 20px;">
                        Thank you for reaching out, <strong>${escapeHtml(formData.org_name)}</strong>!<br>
                        Our team will contact you within 24 hours.
                    </p>
                    <button class="btn-primary" onclick="location.reload()">
                        <span>Send Another Message</span>
                        <i class="fas fa-redo"></i>
                    </button>
                `;
                
                // Insert success message
                const container = document.querySelector('.contact-container');
                const formElement2 = document.getElementById('contactForm');
                container.insertBefore(successDiv, formElement2);
            }
            
            showNotification('Your message has been sent successfully!', 'success');
        } else {
            throw new Error('Failed to send email');
        }
        
    } catch (error) {
        console.error("Form submission error:", error);
        showNotification('Something went wrong. Please try again.', 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Test direct insert (for debugging)
async function testDirectInsert() {
    if (!supabaseClient) {
        console.log("No supabase client");
        showNotification("Supabase not initialized", "error");
        return;
    }
    
    console.log("Testing direct insert...");
    
    const testData = {
        org_name: "Test Organization",
        email: "test@example.com",
        phone: "+966 50 123 4567",
        budget: "SAR 10,000 - SAR 25,000",
        event_date: "2024-12-31",
        message: "This is a test message from the debug function.",
        status: "unread",
        created_at: new Date().toISOString()
    };
    
    try {
        const { data, error } = await supabaseClient
            .from('contact_messages')
            .insert(testData)
            .select();
        
        if (error) {
            console.error("Direct insert failed:", error);
            showNotification(`Test failed: ${error.message}`, "error");
        } else {
            console.log("Direct insert success:", data);
            showNotification("Test insert successful! Check your database.", "success");
        }
    } catch (err) {
        console.error("Direct insert exception:", err);
    }
}

// Test mailman connection
async function testMailman() {
    console.log("Testing mailman connection...");
    showNotification("Testing email system...", "info");
    
    const testData = {
        name: "Test User",
        email: "test@example.com",
        phone: "+966501234567",
        message: "This is a test message to verify the email system.",
        subject: "TEST: Mailman Connection"
    };
    
    try {
        const response = await fetch('/mailman/send.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });
        
        const result = await response.json();
        console.log("Mailman test result:", result);
        
        if (result.success) {
            showNotification(`✅ Email system works! Sent to ${result.data.sent_successfully} recipients`, "success");
        } else {
            showNotification(`❌ Email system error: ${result.error}`, "error");
        }
    } catch (error) {
        console.error("Mailman test failed:", error);
        showNotification("❌ Cannot connect to mailman. Check that /mailman/send.php exists.", "error");
    }
}

// Show notification
function showNotification(message, type = 'info') {
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    toast.style.cssText = `
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-size: 13px;
        animation: slideIn 0.3s ease;
        background: ${colors[type] || colors.info};
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-triangle-exclamation',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${message}`;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// Initialize input effects
function initInputEffects() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            const label = input.closest('.form-group')?.querySelector('label');
            if (label) {
                const icon = label.querySelector('i');
                if (icon) icon.style.color = 'var(--primary-light)';
            }
        });
        input.addEventListener('blur', () => {
            const label = input.closest('.form-group')?.querySelector('label');
            if (label) {
                const icon = label.querySelector('i');
                if (icon) icon.style.color = '';
            }
        });
    });
}

// Escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add debug buttons
function addDebugButtons() {
    const contactContainer = document.querySelector('.contact-container');
    if (contactContainer && !document.getElementById('debugPanel')) {
        const debugPanel = document.createElement('div');
        debugPanel.id = 'debugPanel';
        debugPanel.style.cssText = `
            margin-top: 20px;
            display: flex;
            gap: 10px;
            justify-content: center;
        `;
        
        const dbTestBtn = document.createElement('button');
        dbTestBtn.textContent = '🧪 Test Database';
        dbTestBtn.style.cssText = `
            background: #374151;
            border: none;
            color: white;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 12px;
        `;
        dbTestBtn.onclick = testDirectInsert;
        
        const emailTestBtn = document.createElement('button');
        emailTestBtn.textContent = '📧 Test Email System';
        emailTestBtn.style.cssText = `
            background: #374151;
            border: none;
            color: white;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 12px;
        `;
        emailTestBtn.onclick = testMailman;
        
        debugPanel.appendChild(dbTestBtn);
        debugPanel.appendChild(emailTestBtn);
        
        // Add after the form
        const form = document.getElementById('contactForm');
        if (form) {
            form.parentNode.insertBefore(debugPanel, form.nextSibling);
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', async function() {
    await initSupabase();
    initInputEffects();
    addDebugButtons(); // Add test buttons for debugging
    
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
        console.log("Form handler attached");
    } else {
        console.error("Form not found!");
    }
});

// Add CSS animation if not present
if (!document.querySelector('#contact-form-styles')) {
    const style = document.createElement('style');
    style.id = 'contact-form-styles';
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
