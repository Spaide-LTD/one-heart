// theme-loader.js - Apply holiday themes to public website with STRONG visible effects

let supabaseClient = null;
let currentTheme = null;

// Supabase configuration
const SUPABASE_URL = 'https://ckzjyqlgdssuhpfxjttv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNremp5cWxnZHNzdWhwZnhqdHR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNTI4NTQsImV4cCI6MjA5MjYyODg1NH0.lwzWaoj07I08s4oMC_UsSz44L6AA-EvXSdJhBIpVmjQ';

// Initialize Supabase
async function initThemeLoader() {
    try {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        await loadAndApplyTheme();
    } catch (error) {
        console.error("Failed to initialize theme loader:", error);
    }
}

// Load active theme from database
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
            applyDefaultTheme();
        }
    } catch (error) {
        console.error("Error loading theme:", error);
    }
}

// Apply theme to website - MUCH MORE VISIBLE
function applyThemeToWebsite(theme) {
    const root = document.documentElement;
    
    // Set CSS custom properties
    root.style.setProperty('--theme-primary', theme.primary_color);
    root.style.setProperty('--theme-accent', theme.accent_color);
    
    // Add theme class to body
    document.body.classList.add('theme-active');
    document.body.setAttribute('data-theme-name', theme.name.toLowerCase().replace(/\s/g, '-'));
    
    // Apply STRONG visible styles
    addStrongThemeStyles(theme);
    
    // Add VISIBLE decorative elements
    addStrongThemeDecorations(theme);
    
    // Add floating elements that are VERY noticeable
    addFloatingElements(theme);
    
    console.log(`🎨 Theme "${theme.name}" applied with strong effects!`);
}

// Add STRONG theme styles
function addStrongThemeStyles(theme) {
    const existingStyle = document.getElementById('dynamic-theme-styles');
    if (existingStyle) existingStyle.remove();
    
    const style = document.createElement('style');
    style.id = 'dynamic-theme-styles';
    style.textContent = `
        /* STRONG Theme Colors */
        :root {
            --theme-primary: ${theme.primary_color};
            --theme-accent: ${theme.accent_color};
        }
        
        /* Hero Section - Strong gradient */
        .hero, .page-header, .page-header-bg {
            background: linear-gradient(135deg, ${theme.primary_color}EE, ${theme.accent_color}EE) !important;
            position: relative;
            overflow: hidden;
        }
        
        /* Add strong overlay pattern */
        .hero::after, .page-header::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(
                45deg,
                transparent,
                transparent 30px,
                rgba(255,255,255,0.05) 30px,
                rgba(255,255,255,0.05) 60px
            );
            pointer-events: none;
        }
        
        /* Buttons - Strong theme colors */
        .btn-primary, button[type="submit"], .form-submit {
            background: linear-gradient(135deg, ${theme.primary_color}, ${theme.accent_color}) !important;
            border: none !important;
            box-shadow: 0 4px 15px ${theme.primary_color}80 !important;
            transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px ${theme.primary_color}CC !important;
        }
        
        /* Gradient Text - Very visible */
        .gradient-text, h1 span, .section-title {
            background: linear-gradient(135deg, ${theme.primary_color}, ${theme.accent_color});
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            font-weight: bold;
        }
        
        /* Links and Highlights */
        a:hover, .nav-links a:hover, .event-badge {
            color: ${theme.primary_color} !important;
            text-shadow: 0 0 8px ${theme.primary_color}80;
        }
        
        /* Cards - Strong border on hover */
        .event-card:hover, .past-event-card:hover, .service-card:hover {
            border-color: ${theme.primary_color} !important;
            box-shadow: 0 8px 32px ${theme.primary_color}40 !important;
            transform: translateY(-5px);
        }
        
        /* Section labels - Very visible */
        .section-label {
            color: ${theme.primary_color} !important;
            font-weight: 700 !important;
            letter-spacing: 2px !important;
        }
        
        /* Add a subtle glow to the whole page */
        body.theme-active {
            background: radial-gradient(circle at 50% 0%, ${theme.primary_color}15, var(--bg-primary) 70%);
        }
        
        /* Navigation highlight */
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

// Add VISIBLE decorative elements
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
    
    // RAMADAN / EID - Large visible lanterns
    if (themeName.includes('ramadan') || themeName.includes('eid')) {
        for (let i = 0; i < 12; i++) {
            const lantern = document.createElement('div');
            lantern.innerHTML = '🏮';
            lantern.style.cssText = `
                position: absolute;
                font-size: ${40 + Math.random() * 30}px;
                opacity: 0.25;
                bottom: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: floatLantern ${6 + Math.random() * 4}s infinite ease-in-out;
                filter: drop-shadow(0 0 10px ${theme.primary_color});
                z-index: 1;
            `;
            decorations.appendChild(lantern);
        }
    }
    // CHRISTMAS - Large snowflakes
    else if (themeName.includes('christmas')) {
        for (let i = 0; i < 30; i++) {
            const snowflake = document.createElement('div');
            snowflake.innerHTML = '❄️';
            snowflake.style.cssText = `
                position: absolute;
                font-size: ${25 + Math.random() * 25}px;
                opacity: 0.3;
                top: -30px;
                left: ${Math.random() * 100}%;
                animation: snowFall ${3 + Math.random() * 4}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
                filter: drop-shadow(0 0 5px #fff);
            `;
            decorations.appendChild(snowflake);
        }
        // Add Santa hats
        for (let i = 0; i < 5; i++) {
            const hat = document.createElement('div');
            hat.innerHTML = '🎅';
            hat.style.cssText = `
                position: absolute;
                font-size: 50px;
                opacity: 0.15;
                bottom: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: bounce ${4 + Math.random() * 3}s infinite ease;
            `;
            decorations.appendChild(hat);
        }
    }
    // DIWALI - Large diyas
    else if (themeName.includes('diwali')) {
        for (let i = 0; i < 15; i++) {
            const diya = document.createElement('div');
            diya.innerHTML = '🪔';
            diya.style.cssText = `
                position: absolute;
                font-size: ${35 + Math.random() * 25}px;
                opacity: 0.3;
                bottom: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: flicker ${2 + Math.random() * 2}s infinite;
                filter: drop-shadow(0 0 15px #ff9933);
            `;
            decorations.appendChild(diya);
        }
    }
    // SAUDI NATIONAL DAY
    else if (themeName.includes('saudi') || themeName.includes('national')) {
        for (let i = 0; i < 8; i++) {
            const flag = document.createElement('div');
            flag.innerHTML = '🇸🇦';
            flag.style.cssText = `
                position: absolute;
                font-size: ${60 + Math.random() * 30}px;
                opacity: 0.12;
                bottom: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: sway ${6 + Math.random() * 4}s infinite ease-in-out;
            `;
            decorations.appendChild(flag);
        }
        // Add palm trees
        for (let i = 0; i < 6; i++) {
            const palm = document.createElement('div');
            palm.innerHTML = '🌴';
            palm.style.cssText = `
                position: absolute;
                font-size: 45px;
                opacity: 0.15;
                bottom: 0;
                left: ${Math.random() * 100}%;
                animation: none;
            `;
            decorations.appendChild(palm);
        }
    }
    // NEW YEAR
    else if (themeName.includes('new year')) {
        for (let i = 0; i < 20; i++) {
            const sparkle = document.createElement('div');
            sparkle.innerHTML = '✨';
            sparkle.style.cssText = `
                position: absolute;
                font-size: ${25 + Math.random() * 20}px;
                opacity: 0.3;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: sparkle ${2 + Math.random() * 2}s infinite alternate;
            `;
            decorations.appendChild(sparkle);
        }
    }
    // DEFAULT - Floating shapes
    else {
        for (let i = 0; i < 15; i++) {
            const shape = document.createElement('div');
            const icons = ['✨', '⭐', '💫', '🌟'];
            shape.innerHTML = icons[Math.floor(Math.random() * icons.length)];
            shape.style.cssText = `
                position: absolute;
                font-size: ${20 + Math.random() * 20}px;
                opacity: 0.15;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: float ${8 + Math.random() * 6}s infinite ease-in-out;
            `;
            decorations.appendChild(shape);
        }
    }
    
    document.body.appendChild(decorations);
}

// Add floating elements that are VERY noticeable
function addFloatingElements(theme) {
    const existingFloating = document.getElementById('theme-floating');
    if (existingFloating) existingFloating.remove();
    
    const themeName = theme.name.toLowerCase();
    const floating = document.createElement('div');
    floating.id = 'theme-floating';
    floating.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        pointer-events: none;
    `;
    
    // Add a theme badge that's visible
    floating.innerHTML = `
        <div style="
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
            backdrop-filter: blur(4px);
        ">
            <span>${theme.icon || '🎨'}</span>
            <span>${theme.name} Theme Active</span>
        </div>
    `;
    
    document.body.appendChild(floating);
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
    
    const existingFloating = document.getElementById('theme-floating');
    if (existingFloating) existingFloating.remove();
}

// Animation styles
function addAnimationStyles() {
    if (document.getElementById('theme-animation-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'theme-animation-styles';
    style.textContent = `
        @keyframes floatLantern {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes snowFall {
            0% {
                transform: translateY(-50px) rotate(0deg);
                opacity: 0.3;
            }
            100% {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
        
        @keyframes flicker {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.1); }
        }
        
        @keyframes sway {
            0%, 100% { transform: rotate(-5deg); }
            50% { transform: rotate(5deg); }
        }
        
        @keyframes bounce {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
        }
        
        @keyframes sparkle {
            0% { opacity: 0.1; transform: scale(0.8); }
            100% { opacity: 0.4; transform: scale(1.2); }
        }
        
        @keyframes float {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(10px, -15px) rotate(5deg); }
            75% { transform: translate(-10px, -10px) rotate(-5deg); }
        }
    `;
    document.head.appendChild(style);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    addAnimationStyles();
    initThemeLoader();
});
