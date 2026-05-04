// theme-loader.js - Apply holiday themes to public website
// Balanced - noticeable but not overwhelming

let currentTheme = null;

// Wait for existing Supabase client to be ready
async function waitForSupabase() {
    return new Promise((resolve) => {
        if (window.supabaseClient) {
            resolve(window.supabaseClient);
            return;
        }
        
        const interval = setInterval(() => {
            if (window.supabaseClient) {
                clearInterval(interval);
                resolve(window.supabaseClient);
            }
        }, 500);
        
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

// Apply theme to website - BALANCED & PROFESSIONAL
function applyThemeToWebsite(theme) {
    const root = document.documentElement;
    
    // Set CSS custom properties
    root.style.setProperty('--theme-primary', theme.primary_color);
    root.style.setProperty('--theme-accent', theme.accent_color);
    
    // Add theme class to body
    document.body.classList.add('theme-active');
    document.body.setAttribute('data-theme-name', theme.name.toLowerCase().replace(/\s/g, '-'));
    
    // Apply balanced styles
    addBalancedThemeStyles(theme);
    
    // Add subtle decorations
    addSubtleDecorations(theme);
    
    console.log(`🎨 Theme "${theme.name}" applied`);
}

// Add BALANCED theme styles (noticeable but professional)
function addBalancedThemeStyles(theme) {
    const existingStyle = document.getElementById('dynamic-theme-styles');
    if (existingStyle) existingStyle.remove();
    
    const style = document.createElement('style');
    style.id = 'dynamic-theme-styles';
    style.textContent = `
        /* Theme Colors - Applied to accent elements only */
        .gradient-text, 
        h1 span, 
        .section-label,
        .event-badge,
        .modal-badge {
            background: linear-gradient(135deg, ${theme.primary_color}, ${theme.accent_color});
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }
        
        /* Buttons - Use theme colors but keep readable */
        .btn-primary, 
        button[type="submit"], 
        .form-submit {
            background: linear-gradient(135deg, ${theme.primary_color}, ${theme.accent_color}) !important;
        }
        
        /* Links hover - subtle color change */
        a:hover, 
        .nav-links a:hover {
            color: ${theme.primary_color} !important;
        }
        
        /* Card borders on hover - subtle */
        .event-card:hover, 
        .past-event-card:hover,
        .service-card:hover {
            border-color: ${theme.primary_color}40 !important;
            box-shadow: 0 8px 25px ${theme.primary_color}20 !important;
        }
        
        /* Active/Featured badges */
        .active-badge,
        .featured-badge {
            background: ${theme.primary_color} !important;
        }
        
        /* Subtle page accent */
        .page-header::after {
            background: linear-gradient(135deg, ${theme.primary_color}15, ${theme.accent_color}15);
        }
        
        /* Footer accent line */
        .footer {
            border-top: 1px solid ${theme.primary_color}20;
        }
        
        /* Navigation active/hover state */
        .nav-item.active,
        .nav-item:hover {
            border-color: ${theme.primary_color}40 !important;
        }
        
        /* Focus rings */
        input:focus, select:focus, textarea:focus {
            border-color: ${theme.primary_color} !important;
            box-shadow: 0 0 0 2px ${theme.primary_color}20 !important;
        }
    `;
    document.head.appendChild(style);
}

// Add SUBTLE decorations (barely there, adds atmosphere)
function addSubtleDecorations(theme) {
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
        z-index: 999;
        overflow: hidden;
    `;
    
    // Very subtle background pattern
    const pattern = document.createElement('div');
    pattern.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: radial-gradient(${theme.primary_color}08 1px, transparent 1px);
        background-size: 40px 40px;
        opacity: 0.5;
    `;
    decorations.appendChild(pattern);
    
    // Only add floating elements during specific holidays
    if (themeName.includes('ramadan')) {
        // Just 3-4 subtle lanterns
        for (let i = 0; i < 4; i++) {
            const lantern = document.createElement('div');
            lantern.innerHTML = '🏮';
            lantern.style.cssText = `
                position: absolute;
                font-size: 35px;
                opacity: 0.06;
                bottom: ${10 + Math.random() * 20}%;
                left: ${Math.random() * 100}%;
                animation: floatSlow ${15 + Math.random() * 10}s infinite ease-in-out;
            `;
            decorations.appendChild(lantern);
        }
    } else if (themeName.includes('christmas')) {
        // Subtle snow effect - just a few flakes
        for (let i = 0; i < 8; i++) {
            const snowflake = document.createElement('div');
            snowflake.innerHTML = '❄️';
            snowflake.style.cssText = `
                position: absolute;
                font-size: 18px;
                opacity: 0.08;
                top: -20px;
                left: ${Math.random() * 100}%;
                animation: snowSlow ${8 + Math.random() * 7}s linear infinite;
            `;
            decorations.appendChild(snowflake);
        }
    } else if (themeName.includes('diwali')) {
        // Subtle diyas
        for (let i = 0; i < 5; i++) {
            const diya = document.createElement('div');
            diya.innerHTML = '🪔';
            diya.style.cssText = `
                position: absolute;
                font-size: 28px;
                opacity: 0.08;
                bottom: ${Math.random() * 30}%;
                left: ${Math.random() * 100}%;
                animation: flickerSlow 3s infinite;
            `;
            decorations.appendChild(diya);
        }
    } else if (themeName.includes('saudi')) {
        // Subtle flags
        for (let i = 0; i < 3; i++) {
            const flag = document.createElement('div');
            flag.innerHTML = '🇸🇦';
            flag.style.cssText = `
                position: absolute;
                font-size: 40px;
                opacity: 0.05;
                bottom: ${Math.random() * 100}%;
                right: ${Math.random() * 100}%;
            `;
            decorations.appendChild(flag);
        }
    }
    
    document.body.appendChild(decorations);
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
}

// Add animation styles (subtle, slow animations)
function addAnimationStyles() {
    if (document.getElementById('theme-animation-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'theme-animation-styles';
    style.textContent = `
        @keyframes floatSlow {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
        }
        @keyframes snowSlow {
            0% { transform: translateY(-20px) rotate(0deg); opacity: 0.08; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes flickerSlow {
            0%, 100% { opacity: 0.05; transform: scale(1); }
            50% { opacity: 0.1; transform: scale(1.03); }
        }
    `;
    document.head.appendChild(style);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    addAnimationStyles();
    setTimeout(loadAndApplyTheme, 500);
});
