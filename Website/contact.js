// contact.js - Contact form with Supabase

// Initialize Supabase
async function initSupabase() {
    try {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log("Supabase client created successfully");
        return true;
    } catch (error) {
        console.error("Failed to initialize Supabase:", error);
        showNotification("Connection failed: " + error.message, "error");
        return false;
    }
}

// Save contact inquiry to database
async function saveContactInquiry(formData) {
    if (!supabaseClient) {
        console.error("No Supabase client");
        return false;
    }
    
    // Log what we're about to send
    console.log("Sending data:", formData);
    
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
            console.error("Supabase error details:", error);
            console.error("Error code:", error.code);
            console.error("Error message:", error.message);
            console.error("Error details:", error.details);
            showNotification(`Error: ${error.message}`, "error");
            return false;
        }
        
        console.log("Success! Data saved:", data);
        return true;
        
    } catch (error) {
        console.error("Exception caught:", error);
        showNotification("Something went wrong. Please try again.", "error");
        return false;
    }
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.form-submit');
    const originalText = submitBtn.innerHTML;
    
    // Get form data - match your HTML field names
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
    
    try {
        const success = await saveContactInquiry(formData);
        
        if (success) {
            // Show success message
            const formCard = document.querySelector('.form-card');
            if (formCard) {
                formCard.innerHTML = `
                    <div class="form-success" style="text-align: center; padding: 40px 20px;">
                        <i class="fas fa-check-circle" style="font-size: 64px; color: #10b981; margin-bottom: 20px; display: block;"></i>
                        <h3 style="color: var(--text-primary); margin-bottom: 10px;">Message Sent Successfully!</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 20px;">Thank you for reaching out, ${escapeHtml(formData.org_name)}! Our team will contact you within 24 hours.</p>
                        <button class="btn-primary" onclick="location.reload()">
                            <span>Send Another Message</span>
                            <i class="fas fa-redo"></i>
                        </button>
                    </div>
                `;
            }
            showNotification('Your message has been sent successfully!', 'success');
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
        return;
    }
    
    console.log("Testing direct insert...");
    
    const testData = {
        org_name: "Test Organization",
        email: "test@example.com",
        phone: "+966 50 123 4567",
        budget: "$10,000 - $25,000",
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
            console.error("Full error object:", JSON.stringify(error, null, 2));
            showNotification(`Test failed: ${error.message}`, "error");
        } else {
            console.log("Direct insert success:", data);
            showNotification("Test insert successful! Check your database.", "success");
        }
    } catch (err) {
        console.error("Direct insert exception:", err);
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
    toast.style.cssText = `
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-size: 13px;
        animation: slideIn 0.3s ease;
        background: ${type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#10b981'};
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    const icon = type === 'error' ? 'fa-exclamation-circle' : (type === 'warning' ? 'fa-triangle-exclamation' : 'fa-check-circle');
    toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
    
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

// Add a debug button to the page (optional)
function addDebugButton() {
    const formCard = document.querySelector('.form-card');
    if (formCard && !document.getElementById('debugBtn')) {
        const debugBtn = document.createElement('button');
        debugBtn.id = 'debugBtn';
        debugBtn.textContent = '🧪 Test Database Insert';
        debugBtn.style.cssText = `
            margin-top: 10px;
            background: #374151;
            border: none;
            color: white;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 12px;
            width: 100%;
        `;
        debugBtn.onclick = testDirectInsert;
        formCard.appendChild(debugBtn);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', async function() {
    await initSupabase();
    initInputEffects();
    addDebugButton(); // Adds a test button to help debug
    
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});

// Add CSS animation if not present
const style = document.createElement('style');
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
`;
document.head.appendChild(style);