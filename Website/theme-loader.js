// theme-loader.js - Apply holiday themes to public website
// Just Right - Noticeable but not overwhelming

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

// Replace your loadAndApplyTheme function with this:

async function loadAndApplyTheme() {
    const supabase = await waitForSupabase();
    if (!supabase) {
        console.error("No Supabase client available");
        applyDefaultTheme();
        return;
    }
    
    try {
        // Only get themes where is_active = true
        const { data: activeTheme, error } = await supabase
            .from('themes')
            .select('*')
            .eq('is_active', true)
            .single();
        
        if (error) {
            if (error.code === 'PGRST116') {
                console.log("No active theme found in database, using default theme");
                applyDefaultTheme();
            } else {
                console.warn("Error fetching active theme:", error.message);
                applyDefaultTheme();
            }
            return;
        }
        
        if (activeTheme) {
            console.log("✓ Active theme found:", activeTheme.name);
            console.log("  - Primary color:", activeTheme.primary_color);
            console.log("  - Accent color:", activeTheme.accent_color);
            
            const themeData = {
                name: activeTheme.name,
                primary_color: activeTheme.primary_color || '#8b5cf6',
                accent_color: activeTheme.accent_color || '#06b6d4',
                icon: activeTheme.icon || '🎨',
                is_active: true
            };
            currentTheme = themeData;
            applyThemeToWebsite(themeData);
        } else {
            console.log("No active theme, using default");
            applyDefaultTheme();
        }
        
    } catch (error) {
        console.error("Theme error:", error);
        applyDefaultTheme();
    }
}

// Apply theme to website - JUST RIGHT
function applyThemeToWebsite(theme) {
    const root = document.documentElement;
    
    // Set CSS custom properties
    root.style.setProperty('--theme-primary', theme.primary_color);
    root.style.setProperty('--theme-accent', theme.accent_color);
    
    // Add theme class to body
    document.body.classList.add('theme-active');
    document.body.setAttribute('data-theme-name', theme.name.toLowerCase().replace(/\s/g, '-'));
    
    // Apply balanced styles
    addGoldilocksThemeStyles(theme);
    
    // Add moderate decorations
    addModerateDecorations(theme);
    
    console.log(`🎨 Theme "${theme.name}" applied`);
}

// Add JUST RIGHT theme styles
function addGoldilocksThemeStyles(theme) {
    const existingStyle = document.getElementById('dynamic-theme-styles');
    if (existingStyle) existingStyle.remove();
    
    const style = document.createElement('style');
    style.id = 'dynamic-theme-styles';
    style.textContent = `
        /* Hero Section - Moderate gradient overlay */
        .hero, .page-header, .page-header-bg {
            position: relative;
        }
        
        .hero::before, .page-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, ${theme.primary_color}20, ${theme.accent_color}15);
            pointer-events: none;
            z-index: 0;
        }
        
        /* Gradient Text - Noticeable */
        .gradient-text, 
        h1 span, 
        .section-label,
        .event-badge,
        .modal-badge {
            background: linear-gradient(135deg, ${theme.primary_color}, ${theme.accent_color});
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            font-weight: 600;
        }
        
        /* Buttons - Bold but clean */
        .btn-primary, 
        button[type="submit"], 
        .form-submit {
            background: linear-gradient(135deg, ${theme.primary_color}, ${theme.accent_color}) !important;
            transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px ${theme.primary_color}60;
        }
        
        /* Section headers - themed */
        .section-title {
            position: relative;
            display: inline-block;
        }
        
        .section-title::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 0;
            width: 60px;
            height: 3px;
            background: linear-gradient(90deg, ${theme.primary_color}, ${theme.accent_color});
            border-radius: 3px;
        }
        
        /* Cards - themed hover effects */
        .event-card, .past-event-card, .service-card {
            transition: all 0.3s ease;
        }
        
        .event-card:hover, .past-event-card:hover, .service-card:hover {
            border-color: ${theme.primary_color}60 !important;
            box-shadow: 0 8px 25px ${theme.primary_color}30 !important;
            transform: translateY(-4px);
        }
        
        /* Navigation - themed active state */
        .nav-item.active {
            background: ${theme.primary_color}15 !important;
            border-color: ${theme.primary_color}40 !important;
        }
        
        .nav-item.active i,
        .nav-item.active span {
            color: ${theme.primary_color} !important;
        }
        
        /* Links */
        a {
            transition: color 0.2s ease;
        }
        
        a:hover, .nav-links a:hover {
            color: ${theme.primary_color} !important;
        }
        
        /* Badges and Tags */
        .event-tag, .theme-category-badge {
            background: ${theme.primary_color}15 !important;
            color: ${theme.primary_color} !important;
            border: none !important;
        }
        
        /* Feature badges */
        .active-badge, .featured-badge {
            background: ${theme.primary_color} !important;
        }
        
        /* Form focus rings */
        input:focus, select:focus, textarea:focus {
            border-color: ${theme.primary_color} !important;
            box-shadow: 0 0 0 3px ${theme.primary_color}20 !important;
        }
        
        /* Pagination */
        .pagination-btn.active {
            background: ${theme.primary_color} !important;
            border-color: ${theme.primary_color} !important;
        }
        
        /* Footer accent */
        .footer {
            border-top: 1px solid ${theme.primary_color}30;
        }
        
        /* Small theme indicator in corner */
        .theme-indicator {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${theme.primary_color};
            color: white;
            padding: 6px 14px;
            border-radius: 30px;
            font-size: 11px;
            font-weight: 500;
            z-index: 999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            pointer-events: none;
            opacity: 0.7;
        }
    `;
    document.head.appendChild(style);
    
    // Add small theme indicator
    addThemeIndicator(theme);
}

// Add MODERATE decorations (noticeable but not distracting)
function addModerateDecorations(theme) {
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
        z-index: 998;
        overflow: hidden;
    `;
    
    // Subtle background pattern
    const pattern = document.createElement('div');
    pattern.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: radial-gradient(${theme.primary_color}10 1px, transparent 1px);
        background-size: 50px 50px;
    `;
    decorations.appendChild(pattern);
    
    // Moderate floating elements (7-10 items, medium opacity)
    if (themeName.includes('ramadan') || themeName.includes('eid')) {
        for (let i = 0; i < 8; i++) {
            const lantern = document.createElement('div');
            lantern.innerHTML = '🏮';
            lantern.style.cssText = `
                position: absolute;
                font-size: 30px;
                opacity: 0.12;
                bottom: ${Math.random() * 80}%;
                left: ${Math.random() * 100}%;
                animation: floatModerate ${8 + Math.random() * 6}s infinite ease-in-out;
                filter: drop-shadow(0 0 5px ${theme.primary_color}80);
            `;
            decorations.appendChild(lantern);
        }
    } else if (themeName.includes('christmas')) {
        for (let i = 0; i < 12; i++) {
            const snowflake = document.createElement('div');
            snowflake.innerHTML = '❄️';
            snowflake.style.cssText = `
                position: absolute;
                font-size: 22px;
                opacity: 0.12;
                top: -25px;
                left: ${Math.random() * 100}%;
                animation: snowModerate ${6 + Math.random() * 5}s linear infinite;
            `;
            decorations.appendChild(snowflake);
        }
    } else if (themeName.includes('diwali')) {
        for (let i = 0; i < 10; i++) {
            const diya = document.createElement('div');
            diya.innerHTML = '🪔';
            diya.style.cssText = `
                position: absolute;
                font-size: 30px;
                opacity: 0.12;
                bottom: ${Math.random() * 70}%;
                left: ${Math.random() * 100}%;
                animation: flickerModerate 2.5s infinite;
                filter: drop-shadow(0 0 8px #ff9933);
            `;
            decorations.appendChild(diya);
        }
    } else if (themeName.includes('saudi')) {
        for (let i = 0; i < 6; i++) {
            const flag = document.createElement('div');
            flag.innerHTML = '🇸🇦';
            flag.style.cssText = `
                position: absolute;
                font-size: 45px;
                opacity: 0.08;
                bottom: ${Math.random() * 100}%;
                right: ${Math.random() * 100}%;
                animation: swayModerate ${7 + Math.random() * 5}s infinite ease-in-out;
            `;
            decorations.appendChild(flag);
        }
    } else if (themeName.includes('new year')) {
        for (let i = 0; i < 15; i++) {
            const sparkle = document.createElement('div');
            sparkle.innerHTML = '✨';
            sparkle.style.cssText = `
                position: absolute;
                font-size: 20px;
                opacity: 0.12;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: sparkleModerate 3s infinite alternate;
            `;
            decorations.appendChild(sparkle);
        }
    }
    
    document.body.appendChild(decorations);
}

// Add small theme indicator
function addThemeIndicator(theme) {
    const existingIndicator = document.getElementById('theme-indicator');
    if (existingIndicator) existingIndicator.remove();
    
    const indicator = document.createElement('div');
    indicator.id = 'theme-indicator';
    indicator.className = 'theme-indicator';
    indicator.innerHTML = `${theme.icon || '🎨'} ${theme.name}`;
    document.body.appendChild(indicator);
    
    // Fade out after 8 seconds
    setTimeout(() => {
        if (indicator) {
            indicator.style.transition = 'opacity 1s';
            indicator.style.opacity = '0';
            setTimeout(() => indicator.remove(), 1000);
        }
    }, 8000);
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
    
    const existingIndicator = document.getElementById('theme-indicator');
    if (existingIndicator) existingIndicator.remove();
}

// Add animation styles
function addAnimationStyles() {
    if (document.getElementById('theme-animation-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'theme-animation-styles';
    style.textContent = `
        @keyframes floatModerate {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
        }
        @keyframes snowModerate {
            0% { transform: translateY(-25px) rotate(0deg); opacity: 0.12; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes flickerModerate {
            0%, 100% { opacity: 0.08; transform: scale(1); }
            50% { opacity: 0.18; transform: scale(1.05); }
        }
        @keyframes swayModerate {
            0%, 100% { transform: rotate(-3deg); }
            50% { transform: rotate(3deg); }
        }
        @keyframes sparkleModerate {
            0% { opacity: 0.05; transform: scale(0.8); }
            100% { opacity: 0.15; transform: scale(1.1); }
        }
    `;
    document.head.appendChild(style);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    addAnimationStyles();
    setTimeout(loadAndApplyTheme, 500);
});
