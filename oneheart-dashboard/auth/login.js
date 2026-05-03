// login.js - Complete Login System

let supabaseClient = null;

// Initialize Supabase
async function initSupabase() {
    try {
        if (window.supabaseClient) {
            supabaseClient = window.supabaseClient;
        } else if (window.supabase) {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        } else {
            throw new Error("Supabase library not loaded");
        }
        console.log("Supabase initialized");
    } catch (error) {
        console.error("Failed to initialize Supabase:", error);
        showError("Failed to connect to authentication service");
    }
}

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.innerHTML = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleBtn.innerHTML = '👁';
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('error');
    if (!errorDiv) return;
    
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
    
    setTimeout(() => {
        errorDiv.classList.remove('show');
    }, 4000);
}

// Show success message
function showSuccess(message) {
    const errorDiv = document.getElementById('error');
    if (!errorDiv) return;
    
    errorDiv.textContent = message;
    errorDiv.style.background = 'rgba(16, 185, 129, 0.1)';
    errorDiv.style.color = '#34d399';
    errorDiv.style.borderColor = 'rgba(16, 185, 129, 0.2)';
    errorDiv.classList.add('show');
    
    setTimeout(() => {
        errorDiv.classList.remove('show');
        errorDiv.style.background = '';
        errorDiv.style.color = '';
        errorDiv.style.borderColor = '';
    }, 3000);
}

// Login function
async function login() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');
    const rememberMe = document.getElementById('rememberMe')?.checked || false;
    
    // Validation
    if (!email) {
        showError('Please enter your email address');
        return;
    }
    
    if (!password) {
        showError('Please enter your password');
        return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    // Show loading state
    const originalText = loginBtn.innerHTML;
    loginBtn.innerHTML = '<span>⏳</span> Authenticating...';
    loginBtn.disabled = true;
    loginBtn.classList.add('loading');
    
    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) {
            console.error("Login error:", error);
            
            if (error.message.includes('Invalid login credentials')) {
                showError('Invalid email or password. Please try again.');
            } else if (error.message.includes('Email not confirmed')) {
                showError('Please verify your email address before logging in.');
                // Optionally resend confirmation
                await resendConfirmationEmail(email);
            } else {
                showError(error.message || 'Failed to login. Please try again.');
            }
            return;
        }
        
        if (data?.session) {
            console.log("Login successful!", data.user.email);
            
            // Set session expiry based on remember me
            if (rememberMe) {
                // Session already has default expiry
                console.log("Stay signed in enabled");
            }
            
            // Store session info
            localStorage.setItem('last_login', new Date().toISOString());
            localStorage.setItem('user_email', data.user.email);
            
            showSuccess('Login successful! Redirecting...');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = '../pages/index.html';
            }, 500);
        }
        
    } catch (error) {
        console.error("Unexpected error:", error);
        showError('Network error. Please check your connection.');
    } finally {
        // Reset button
        loginBtn.innerHTML = originalText;
        loginBtn.disabled = false;
        loginBtn.classList.remove('loading');
    }
}

// Resend confirmation email
async function resendConfirmationEmail(email) {
    try {
        const { error } = await supabaseClient.auth.resend({
            type: 'signup',
            email: email
        });
        
        if (!error) {
            showSuccess('Confirmation email resent! Please check your inbox.');
        }
    } catch (err) {
        console.error("Resend error:", err);
    }
}

// Check if already logged in
async function checkExistingSession() {
    if (!supabaseClient) return;
    
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session) {
            // Already logged in, redirect to dashboard
            console.log("Existing session found, redirecting...");
            window.location.href = '../pages/index.html';
        }
    } catch (error) {
        console.error("Session check error:", error);
    }
}

// Add enter key support
function initEnterKey() {
    const inputs = ['email', 'password'];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    login();
                }
            });
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await initSupabase();
    await checkExistingSession();
    initEnterKey();
});