// theme-loader.js - Apply holiday themes to public website
// Uses existing Supabase client - NO REDEFINITION

let currentTheme = null;

// Wait for existing Supabase client to be ready
async function waitForSupabase() {
    return new Promise((resolve) => {
        if (window.supabaseClient) {
            resolve(window.supabaseClient);
            return;
        }
        
        // Check every 500ms for existing client
        const interval = setInterval(() => {
            if (window.supabaseClient) {
                clearInterval(interval);
                resolve(window.supabaseClient);
            }
        }, 500);
        
        // Timeout after 10 seconds
        setTimeout(() => {
            clearInterval(interval);
            console.warn("Supabase client not found after 10 seconds");
            resolve(null);
        }, 10000);
    });
}

// Load active theme from database using existing client
async function loadAndApplyTheme() {
    const supabase = await waitForSupabase();
    if (!supabase) {
        console.error("No Supabase client available");
        return;
    }
    
    try {
        const { data, error } = await supabase
            .from('themes')
            .select('*')
            .eq('is_active', true)
            .single();
        
        if (error && error.code !== 'PGRST116') {
            console.error("Error loading theme:", error);
            return;
        }
        
        if (data) {
            currentTheme = data;
            applyThemeToWebsite(data);
        } else {
            applyDefaultTheme();
        }
    } catch (error) {
        console.error("Error loading theme:", error);
    }
}

// Apply theme to website - STRONG VISIBLE EFFECTS
function applyThemeToWebsite(theme) {
    const root = document.documentElement;
    
    // Set CSS custom properties
    root.style.setProperty('--theme-primary', theme.primary_color);
    root.style.setProperty('--theme-accent', theme.accent_color);
    
    // Add theme class to body
    document.body.classList.add('theme-active');
    document.body.setAttribute('data-theme-name', theme.name.toLowerCase().replace(/\s/g, '-'));
    
    // Apply visible styles
    addStrongThemeStyles(theme);
    
    // Add decorative elements
    addStrongThemeDecorations(theme);
    
    // Add floating theme badge
    addThemeBadge(theme);
    
    console.log(`🎨 Theme "${theme.name}" applied!`);
}

// Add STRONG theme styles
function addStrongThemeStyles(theme) {
    const existingStyle = document.getElementById('dynamic-theme-styles');
    if (existingStyle) existingStyle.remove();
    
    const style = document.createElement('style');
    style.id = 'dynamic-theme-styles';
    style.textContent = `
        /* Hero Section - Strong gradient */
        .hero, .page-header, .page-header-bg {
            background: linear-gradient(135deg, ${theme.primary_color}EE, ${theme.accent_color}EE) !important;
        }
        
        /* Buttons - Strong theme colors */
        .btn-primary, button[type="submit"], .form-submit {
            background: linear-gradient(135deg, ${theme.primary_color}, ${theme.accent_color}) !important;
            box-shadow: 0 4px 15px ${theme.primary_color}80 !important;
        }
        
        /* Gradient Text */
        .gradient-text, h1 span, .section-title {
            background: linear-gradient(135deg, ${theme.primary_color}, ${theme.accent_color});
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }
        
        /* Card hover effects */
        .event-card:hover, .past-event-card:hover {
            border-color: ${theme.primary_color} !important;
            box-shadow: 0 8px 32px ${theme.primary_color}40 !important;
        }
        
        /* Section labels */
        .section-label {
            color: ${theme.primary_color} !important;
        }
        
        /* Page background glow */
        body.theme-active {
            background: radial-gradient(circle at 50% 0%, ${theme.primary_color}15, var(--bg-primary) 70%);
        }
        
        /* Navigation accent */
        .navbar {
            border-bottom: 2px solid ${theme.primary_color}40;
        }
        
        /* Footer accent */
        .footer {
            border-top: 2px solid ${theme.primary_color}40;
        }
    `;
    document.head.appendChild(style);
}

// Add decorative elements
function addStrongThemeDecorations(theme) {
    const existingDecorations = document.getElementById('theme-decorations');
    if (existingDecorations) existingDecorations.remove();
    
    const themeName = theme.name.toLowerCase();
    const decorations = document.createElement('div');
    decorations.id = 'theme-decorations';
    decorations.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
        overflow: hidden;
    `;
    
    // Theme-specific decorations
    if (themeName.includes('ramadan') || themeName.includes('eid')) {
        for (let i = 0; i < 12; i++) {
            const lantern = document.createElement('div');
            lantern.innerHTML = '🏮';
            lantern.style.cssText = `
                position: absolute;
                font-size: ${40 + Math.random() * 30}px;
                opacity: 0.2;
                bottom: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: floatLantern ${6 + Math.random() * 4}s infinite ease-in-out;
                filter: drop-shadow(0 0 10px ${theme.primary_color});
            `;
            decorations.appendChild(lantern);
        }
    } else if (themeName.includes('christmas')) {
        for (let i = 0; i < 25; i++) {
            const snowflake = document.createElement('div');
            snowflake.innerHTML = '❄️';
            snowflake.style.cssText = `
                position: absolute;
                font-size: ${20 + Math.random() * 25}px;
                opacity: 0.25;
                top: -30px;
                left: ${Math.random() * 100}%;
                animation: snowFall ${3 + Math.random() * 4}s linear infinite;
            `;
            decorations.appendChild(snowflake);
        }
    } else if (themeName.includes('diwali')) {
        for (let i = 0; i < 15; i++) {
            const diya = document.createElement('div');
            diya.innerHTML = '🪔';
            diya.style.cssText = `
                position: absolute;
                font-size: ${35 + Math.random() * 25}px;
                opacity: 0.25;
                bottom: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: flicker ${2 + Math.random() * 2}s infinite;
                filter: drop-shadow(0 0 15px #ff9933);
            `;
            decorations.appendChild(diya);
        }
    } else if (themeName.includes('saudi')) {
        for (let i = 0; i < 8; i++) {
            const flag = document.createElement('div');
            flag.innerHTML = '🇸🇦';
            flag.style.cssText = `
                position: absolute;
                font-size: ${60 + Math.random() * 30}px;
                opacity: 0.1;
                bottom: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: sway ${6 + Math.random() * 4}s infinite ease-in-out;
            `;
            decorations.appendChild(flag);
        }
    }
    
    document.body.appendChild(decorations);
}

// Add floating theme badge
function addThemeBadge(theme) {
    const existingBadge = document.getElementById('theme-badge');
    if (existingBadge) existingBadge.remove();
    
    const badge = document.createElement('div');
    badge.id = 'theme-badge';
    badge.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        background: ${theme.primary_color};
        color: white;
        padding: 8px 16px;
        border-radius: 40px;
        font-size: 12px;
        font-weight: bold;
        box-shadow: 0 4px 15px ${theme.primary_color}80;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        transition: transform 0.2s;
    `;
    badge.innerHTML = `${theme.icon || '🎨'} ${theme.name} Theme Active`;
    badge.onclick = () => {
        badge.style.opacity = '0';
        setTimeout(() => badge.remove(), 300);
    };
    
    document.body.appendChild(badge);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (badge.parentElement) {
            badge.style.opacity = '0';
            setTimeout(() => badge.remove(), 300);
        }
    }, 5000);
}

// Apply default theme
function applyDefaultTheme() {
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', '#8b5cf6');
    root.style.setProperty('--theme-accent', '#06b6d4');
    
    document.body.classList.remove('theme-active');
    document.body.removeAttribute('data-theme-name');
    
    const existingStyle = document.getElementById('dynamic-theme-styles');
    if (existingStyle) existingStyle.remove();
    
    const existingDecorations = document.getElementById('theme-decorations');
    if (existingDecorations) existingDecorations.remove();
    
    const existingBadge = document.getElementById('theme-badge');
    if (existingBadge) existingBadge.remove();
}

// Add animation styles (only once)
function addAnimationStyles() {
    if (document.getElementById('theme-animation-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'theme-animation-styles';
    style.textContent = `
        @keyframes floatLantern {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }
        @keyframes snowFall {
            0% { transform: translateY(-50px) rotate(0deg); opacity: 0.3; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes flicker {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.1); }
        }
        @keyframes sway {
            0%, 100% { transform: rotate(-5deg); }
            50% { transform: rotate(5deg); }
        }
    `;
    document.head.appendChild(style);
}

// Initialize - just wait for DOM and use existing Supabase
document.addEventListener('DOMContentLoaded', () => {
    addAnimationStyles();
    // Small delay to ensure Supabase client is ready
    setTimeout(loadAndApplyTheme, 500);
});
