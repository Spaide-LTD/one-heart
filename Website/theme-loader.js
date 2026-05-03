let currentTheme = null;

// Initialize Supabase
async function initThemeLoader() {
    try {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        await loadAndApplyTheme();
    } catch (error) {
        console.error("Failed to initialize theme loader:", error);
    }
}

// Load active theme from database and apply it
async function loadAndApplyTheme() {
    if (!supabaseClient) return;
    
    try {
        const { data, error } = await supabaseClient
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
            // No active theme, apply default styling
            applyDefaultTheme();
        }
    } catch (error) {
        console.error("Error loading theme:", error);
    }
}

// Apply theme to website
function applyThemeToWebsite(theme) {
    // Set CSS custom properties on root element
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', theme.primary_color);
    root.style.setProperty('--theme-accent', theme.accent_color);
    root.style.setProperty('--theme-bg-overlay', theme.background_effect || `linear-gradient(135deg, ${theme.primary_color}33, ${theme.accent_color}33)`);
    
    // Add theme class to body for additional styling
    document.body.classList.add('theme-active');
    document.body.setAttribute('data-theme-name', theme.name.toLowerCase().replace(/\s/g, '-'));
    
    // Add theme-specific decorative elements
    addThemeDecorations(theme);
    
    // Add theme styles dynamically
    addThemeStyles(theme);
    
    console.log(`Theme "${theme.name}" applied successfully!`);
}

// Add dynamic CSS for the theme
function addThemeStyles(theme) {
    // Remove existing theme styles if any
    const existingStyle = document.getElementById('dynamic-theme-styles');
    if (existingStyle) existingStyle.remove();
    
    const style = document.createElement('style');
    style.id = 'dynamic-theme-styles';
    style.textContent = `
        /* Theme: ${theme.name} */
        :root {
            --theme-primary: ${theme.primary_color};
            --theme-accent: ${theme.accent_color};
            --theme-overlay: ${theme.background_effect || `linear-gradient(135deg, ${theme.primary_color}20, ${theme.accent_color}20)`};
        }
        
        /* Apply theme colors to website elements */
        .btn-primary,
        button[type="submit"],
        .nav-links a:hover,
        .footer-logo span {
            background: linear-gradient(135deg, var(--theme-primary), var(--theme-accent)) !important;
        }
        
        .gradient-text {
            background: linear-gradient(135deg, var(--theme-primary), var(--theme-accent));
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }
        
        a:hover,
        .section-label,
        .event-badge {
            color: var(--theme-primary);
        }
        
        .event-card:hover {
            border-color: var(--theme-primary);
            box-shadow: 0 8px 32px ${theme.primary_color}20;
        }
        
        /* Holiday-specific decorations */
        body[data-theme-name="ramadan"] .page-header::before {
            content: "🌙";
            position: absolute;
            font-size: 80px;
            opacity: 0.1;
            bottom: 10px;
            right: 20px;
            pointer-events: none;
        }
        
        body[data-theme-name="eid-al-fitr"] .page-header::before {
            content: "⭐";
            position: absolute;
            font-size: 80px;
            opacity: 0.1;
            bottom: 10px;
            right: 20px;
            pointer-events: none;
        }
        
        body[data-theme-name="eid-al-adha"] .page-header::before {
            content: "🐏";
            position: absolute;
            font-size: 80px;
            opacity: 0.1;
            bottom: 10px;
            right: 20px;
            pointer-events: none;
        }
        
        body[data-theme-name="saudi-national-day"] .page-header::before {
            content: "🇸🇦";
            position: absolute;
            font-size: 80px;
            opacity: 0.1;
            bottom: 10px;
            right: 20px;
            pointer-events: none;
        }
        
        body[data-theme-name="christmas"] .page-header::before {
            content: "🎄";
            position: absolute;
            font-size: 80px;
            opacity: 0.1;
            bottom: 10px;
            right: 20px;
            pointer-events: none;
        }
        
        body[data-theme-name="diwali"] .page-header::before {
            content: "🪔";
            position: absolute;
            font-size: 80px;
            opacity: 0.1;
            bottom: 10px;
            right: 20px;
            pointer-events: none;
        }
        
        body[data-theme-name="new-year"] .page-header::before {
            content: "🎆";
            position: absolute;
            font-size: 80px;
            opacity: 0.1;
            bottom: 10px;
            right: 20px;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);
}

// Add decorative elements based on theme
function addThemeDecorations(theme) {
    // Remove existing decorations
    const existingDecorations = document.getElementById('theme-decorations');
    if (existingDecorations) existingDecorations.remove();
    
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
    
    const themeName = theme.name.toLowerCase();
    
    // Add theme-specific floating decorations
    if (themeName.includes('ramadan') || themeName.includes('eid')) {
        // Add lanterns
        for (let i = 0; i < 5; i++) {
            const lantern = document.createElement('div');
            lantern.innerHTML = '🏮';
            lantern.style.cssText = `
                position: absolute;
                font-size: ${30 + Math.random() * 20}px;
                opacity: 0.15;
                bottom: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: float ${5 + Math.random() * 5}s infinite ease-in-out;
                animation-delay: ${Math.random() * 3}s;
            `;
            decorations.appendChild(lantern);
        }
    } else if (themeName.includes('christmas')) {
        // Add snowflakes
        for (let i = 0; i < 20; i++) {
            const snowflake = document.createElement('div');
            snowflake.innerHTML = '❄️';
            snowflake.style.cssText = `
                position: absolute;
                font-size: ${15 + Math.random() * 15}px;
                opacity: 0.2;
                top: -20px;
                left: ${Math.random() * 100}%;
                animation: snowFall ${4 + Math.random() * 4}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            decorations.appendChild(snowflake);
        }
    } else if (themeName.includes('diwali')) {
        // Add diyas (lamps)
        for (let i = 0; i < 8; i++) {
            const diya = document.createElement('div');
            diya.innerHTML = '🪔';
            diya.style.cssText = `
                position: absolute;
                font-size: ${25 + Math.random() * 15}px;
                opacity: 0.2;
                bottom: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: flicker ${2 + Math.random() * 2}s infinite;
            `;
            decorations.appendChild(diya);
        }
    } else if (themeName.includes('spring')) {
        // Add flowers
        for (let i = 0; i < 10; i++) {
            const flower = document.createElement('div');
            flower.innerHTML = '🌸';
            flower.style.cssText = `
                position: absolute;
                font-size: ${20 + Math.random() * 15}px;
                opacity: 0.15;
                bottom: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: sway ${6 + Math.random() * 4}s infinite ease-in-out;
            `;
            decorations.appendChild(flower);
        }
    }
    
    document.body.appendChild(decorations);
}

// Apply default theme (no active theme)
function applyDefaultTheme() {
    document.body.classList.remove('theme-active');
    document.body.removeAttribute('data-theme-name');
    
    const existingStyle = document.getElementById('dynamic-theme-styles');
    if (existingStyle) existingStyle.remove();
    
    const existingDecorations = document.getElementById('theme-decorations');
    if (existingDecorations) existingDecorations.remove();
}

// Add CSS animations
function addAnimationStyles() {
    if (document.getElementById('theme-animation-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'theme-animation-styles';
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }
        
        @keyframes snowFall {
            0% {
                transform: translateY(-20px) rotate(0deg);
                opacity: 0.2;
            }
            100% {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
        
        @keyframes flicker {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(1.05); }
        }
        
        @keyframes sway {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(5deg); }
        }
    `;
    document.head.appendChild(style);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    addAnimationStyles();
    initThemeLoader();
});