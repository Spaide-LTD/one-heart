//// At the top of every dashboard page (index.html, event-manager.html, etc.)
(async () => {
    // This will redirect to login if not authenticated
    const isAuthenticated = await requireAuth();
    if (!isAuthenticated) return;
    
    // Your page code here...
    console.log("User is authenticated:", getCurrentUser()?.email);
})();
let themes = [];

function t(key) {
    const keys = key.split('.');
    let value = translations[currentLang];
    for (const k of keys) {
        if (value && value[k] !== undefined) {
            value = value[k];
        } else {
            return key;
        }
    }
    return value || key;
}

// Initialize Supabase
async function initSupabase() {
    try {
        if (window.supabaseClient) {
            supabaseClient = window.supabaseClient;
            console.log("Using existing Supabase client");
        } else if (window.supabase) {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            console.log("Created new Supabase client");
        } else {
            console.error("Supabase library not loaded");
            showToast(t('messages.failed_to_load'), 'error');
            return false;
        }
        await loadThemes();
        return true;
    } catch (error) {
        console.error("Failed to initialize Supabase:", error);
        showToast(t('messages.failed_to_load'), 'error');
        return false;
    }
}

// Load themes from database
async function loadThemes() {
    if (!supabaseClient) return;
    
    try {
        const { data, error } = await supabaseClient
            .from('themes')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error("Error loading themes:", error);
            showToast(t('messages.failed_to_load'), 'error');
            return;
        }
        
        themes = data || [];
        renderThemes();
        
        if (window.applyLanguage) {
            window.applyLanguage(currentLang);
        }
    } catch (error) {
        console.error("Error loading themes:", error);
        showToast(t('messages.failed_to_load'), 'error');
    }
}

// Render themes grid
function renderThemes() {
    const grid = document.getElementById('themesGrid');
    if (!grid) return;
    
    // Check if there's an active theme
    const hasActiveTheme = themes.some(t => t.is_active === true);
    
    // Add Default Theme card at the beginning
    const defaultThemeCard = `
        <div class="theme-card ${!hasActiveTheme ? 'active-theme' : ''}" data-theme-id="default">
            <div class="theme-header">
                <div class="theme-icon">🎨</div>
                <div class="theme-info">
                    <h3 class="theme-title">${t('default_theme')}</h3>
                    <span class="theme-category-badge"><i class="fas fa-globe"></i> Default</span>
                </div>
                ${!hasActiveTheme ? '<span class="active-badge"><i class="fa-solid fa-check-circle"></i> Active</span>' : ''}
            </div>
            <p class="theme-description">Reset to default OneHeart theme colors and remove all holiday decorations.</p>
            <div class="theme-preview-area">
                <div class="theme-preview" style="background: linear-gradient(135deg, #8b5cf633, #06b6d433)">
                    <div class="preview-content">
                        <div class="preview-circle" style="background: #8b5cf6"></div>
                        <div class="preview-circle-small" style="background: #06b6d4"></div>
                    </div>
                </div>
                <div class="theme-colors">
                    <div class="color-swatch" style="background: #8b5cf6" title="Primary: #8b5cf6"></div>
                    <div class="color-swatch" style="background: #06b6d4" title="Accent: #06b6d4"></div>
                </div>
            </div>
            <button class="theme-activate-btn ${!hasActiveTheme ? 'active' : ''}" onclick="deactivateAllThemes()">
                ${!hasActiveTheme ? 
                    '<i class="fa-solid fa-check"></i> <span>' + t('actions.currentlyActive') + '</span>' : 
                    '<i class="fa-solid fa-undo"></i> <span>Restore Default</span>'
                }
            </button>
        </div>
    `;
    
    if (themes.length === 0) {
        grid.innerHTML = defaultThemeCard + `
            <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <div class="empty-state-icon"><i class="fa-solid fa-palette"></i></div>
                <h3>No Themes Yet</h3>
                <p>Click "Add Custom Theme" to create your first holiday theme.</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = defaultThemeCard + themes.map(theme => {
        const isActive = theme.is_active === true;
        const categoryIcon = getCategoryIcon(theme.category);
        
        return `
            <div class="theme-card ${isActive ? 'active-theme' : ''}" data-theme-id="${theme.id}">
                <div class="theme-header">
                    <div class="theme-icon">${theme.icon || '🎨'}</div>
                    <div class="theme-info">
                        <h3 class="theme-title">${escapeHtml(theme.name)}</h3>
                        <span class="theme-category-badge"><i class="fas ${categoryIcon}"></i> ${escapeHtml(theme.category || 'global')}</span>
                    </div>
                    ${isActive ? '<span class="active-badge"><i class="fa-solid fa-check-circle"></i> Active</span>' : ''}
                </div>
                <p class="theme-description">${escapeHtml(theme.description || 'No description available.')}</p>
                <div class="theme-preview-area">
                    <div class="theme-preview" style="background: ${theme.background_effect || `linear-gradient(135deg, ${theme.primary_color}33, ${theme.accent_color}33)`}">
                        <div class="preview-content">
                            <div class="preview-circle" style="background: ${theme.primary_color}"></div>
                            <div class="preview-circle-small" style="background: ${theme.accent_color}"></div>
                        </div>
                    </div>
                    <div class="theme-colors">
                        <div class="color-swatch" style="background: ${theme.primary_color}" title="Primary: ${theme.primary_color}"></div>
                        <div class="color-swatch" style="background: ${theme.accent_color}" title="Accent: ${theme.accent_color}"></div>
                    </div>
                </div>
                <div class="theme-buttons">
                    <button class="theme-activate-btn ${isActive ? 'active' : ''}" data-id="${theme.id}">
                        ${isActive ? 
                            '<i class="fa-solid fa-check"></i> <span>' + t('actions.currentlyActive') + '</span>' : 
                            '<i class="fa-solid fa-power-off"></i> <span>' + t('actions.activateTheme') + '</span>'
                        }
                    </button>
                    ${isActive ? `
                        <button class="theme-deactivate-btn" onclick="deactivateAllThemes()">
                            <i class="fa-solid fa-ban"></i> <span>${t('deactivate')}</span>
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    // Attach activate button listeners
    document.querySelectorAll('.theme-activate-btn[data-id]').forEach(btn => {
        btn.removeEventListener('click', handleActivateClick);
        btn.addEventListener('click', handleActivateClick);
    });
}

function handleActivateClick(e) {
    e.stopPropagation();
    const themeId = this.getAttribute('data-id');
    activateTheme(themeId);
}

// Deactivate all themes (restore default)
async function deactivateAllThemes() {
    if (!supabaseClient) {
        showToast(t('messages.failed_to_deactivate'), 'error');
        return;
    }
    
    try {
        // Set all themes to inactive
        const { error } = await supabaseClient
            .from('themes')
            .update({ is_active: false })
            .neq('id', '00000000-0000-0000-0000-000000000000');
        
        if (error) {
            console.error("Error deactivating themes:", error);
            showToast(t('messages.failed_to_deactivate'), 'error');
            return;
        }
        
        // Update local state
        themes.forEach(t => {
            t.is_active = false;
        });
        
        renderThemes();
        showToast(t('messages.default_restored'), 'success');
        
    } catch (error) {
        console.error("Error deactivating themes:", error);
        showToast(t('messages.failed_to_deactivate'), 'error');
    }
}

// Activate a theme
async function activateTheme(themeId) {
    if (!supabaseClient) {
        showToast(t('messages.failed_to_activate'), 'error');
        return;
    }
    
    const theme = themes.find(t => t.id === themeId);
    const themeName = theme?.name || 'Theme';
    
    try {
        // First, deactivate all themes
        const { error: deactivateError } = await supabaseClient
            .from('themes')
            .update({ is_active: false })
            .neq('id', '00000000-0000-0000-0000-000000000000');
        
        if (deactivateError) {
            console.error("Error deactivating themes:", deactivateError);
            showToast(t('messages.failed_to_activate'), 'error');
            return;
        }
        
        // Then activate the selected theme
        const { error: activateError } = await supabaseClient
            .from('themes')
            .update({ is_active: true })
            .eq('id', themeId);
        
        if (activateError) {
            console.error("Error activating theme:", activateError);
            showToast(t('messages.failed_to_activate'), 'error');
            return;
        }
        
        // Update local state
        themes.forEach(t => {
            t.is_active = (t.id === themeId);
        });
        
        renderThemes();
        showToast(`${escapeHtml(themeName)} - ${t('messages.theme_activated')}`, 'success');
        
    } catch (error) {
        console.error("Error activating theme:", error);
        showToast(t('messages.failed_to_activate'), 'error');
    }
}

// Get icon for category
function getCategoryIcon(category) {
    const icons = {
        'global': 'fa-globe',
        'islamic': 'fa-mosque',
        'middle eastern': 'fa-mosque',
        'hindu': 'fa-om',
        'south asian': 'fa-om',
        'asian': 'fa-dragon',
        'regional': 'fa-flag',
        'cultural': 'fa-landmark',
        'custom': 'fa-palette'
    };
    return icons[category?.toLowerCase()] || 'fa-tag';
}

// Add custom theme
async function addCustomTheme() {
    const name = document.getElementById('customName')?.value.trim();
    const category = document.getElementById('customCategory')?.value;
    const icon = document.getElementById('customIcon')?.value.trim() || '🎨';
    const desc = document.getElementById('customDesc')?.value.trim();
    const primary = document.getElementById('customPrimary')?.value;
    const accent = document.getElementById('customAccent')?.value;
    const effect = document.getElementById('customEffect')?.value.trim();
    
    if (!name || !category || !primary || !accent) {
        showToast(t('messages.fill_required'), 'warning');
        return;
    }
    
    if (!supabaseClient) {
        showToast(t('messages.failed_to_save'), 'error');
        return;
    }
    
    const finalEffect = effect || `linear-gradient(135deg, ${primary}33, ${accent}33)`;
    
    try {
        const { error } = await supabaseClient
            .from('themes')
            .insert({
                name: name,
                category: category,
                icon: icon,
                description: desc || '',
                primary_color: primary,
                accent_color: accent,
                background_effect: finalEffect,
                is_active: false,
                created_at: new Date().toISOString()
            });
        
        if (error) {
            console.error("Error saving theme:", error);
            showToast(t('messages.failed_to_save'), 'error');
            return;
        }
        
        showToast(t('messages.theme_added'), 'success');
        
        // Close modal and reset form
        const modal = document.getElementById('addThemeModal');
        if (modal) modal.classList.remove('active');
        
        // Reset form fields
        document.getElementById('customName').value = '';
        document.getElementById('customDesc').value = '';
        document.getElementById('customEffect').value = '';
        document.getElementById('customIcon').value = '';
        document.getElementById('customPrimary').value = '#8b5cf6';
        document.getElementById('customAccent').value = '#06b6d4';
        document.getElementById('customCategory').value = 'global';
        
        // Reload themes
        await loadThemes();
        
    } catch (error) {
        console.error("Error saving theme:", error);
        showToast(t('messages.failed_to_save'), 'error');
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
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
    const icon = type === 'success' ? 'fa-check-circle' : (type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle');
    const bgColor = type === 'success' ? '#10b981' : (type === 'error' ? '#ef4444' : '#f59e0b');
    
    toast.style.cssText = `
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-size: 13px;
        animation: slideIn 0.3s ease;
        background: ${bgColor};
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Modal handlers
function initModalHandlers() {
    const addThemeBtn = document.getElementById('addThemeBtn');
    const addThemeModal = document.getElementById('addThemeModal');
    const closeAddModal = document.getElementById('closeAddModal');
    const cancelAddModal = document.getElementById('cancelAddModal');
    const saveThemeBtn = document.getElementById('saveThemeBtn');
    
    if (addThemeBtn) {
        addThemeBtn.onclick = () => {
            if (addThemeModal) addThemeModal.classList.add('active');
        };
    }
    
    if (closeAddModal) {
        closeAddModal.onclick = () => {
            if (addThemeModal) addThemeModal.classList.remove('active');
        };
    }
    
    if (cancelAddModal) {
        cancelAddModal.onclick = () => {
            if (addThemeModal) addThemeModal.classList.remove('active');
        };
    }
    
    if (addThemeModal) {
        addThemeModal.addEventListener('click', (e) => {
            if (e.target === addThemeModal) {
                addThemeModal.classList.remove('active');
            }
        });
    }
    
    if (saveThemeBtn) {
        saveThemeBtn.onclick = addCustomTheme;
    }
}

// Add CSS styles
function addCustomStyles() {
    if (document.getElementById('holiday-themes-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'holiday-themes-styles';
    style.textContent = `
        @keyframes slideIn {
            from { opacity: 0; transform: translateX(100%); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        .theme-card {
            position: relative;
            transition: all 0.3s ease;
        }
        
        .theme-card.active-theme {
            border: 2px solid var(--primary);
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.2);
        }
        
        .active-badge {
            position: absolute;
            top: 12px;
            right: 12px;
            background: var(--primary);
            color: white;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
        }
        
        .theme-category-badge {
            display: inline-block;
            background: var(--bg-tertiary);
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 10px;
            color: var(--text-muted);
        }
        
        .theme-preview-area {
            margin: 15px 0;
        }
        
        .theme-preview {
            height: 60px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 10px;
        }
        
        .preview-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .preview-circle {
            width: 30px;
            height: 30px;
            border-radius: 50%;
        }
        
        .preview-circle-small {
            width: 20px;
            height: 20px;
            border-radius: 50%;
        }
        
        .theme-colors {
            display: flex;
            gap: 8px;
            justify-content: center;
        }
        
        .color-swatch {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 2px solid var(--border-secondary);
            cursor: pointer;
        }
        
        .theme-buttons {
            display: flex;
            gap: 10px;
            margin-top: 12px;
        }
        
        .theme-activate-btn {
            flex: 2;
            padding: 10px;
            background: var(--bg-card);
            border: 1px solid var(--border-secondary);
            border-radius: 8px;
            color: var(--text-secondary);
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .theme-activate-btn:hover {
            background: var(--bg-tertiary);
            border-color: var(--primary);
            color: var(--primary-light);
        }
        
        .theme-activate-btn.active {
            background: var(--primary-subtle);
            border-color: var(--primary);
            color: var(--primary-light);
        }
        
        .theme-deactivate-btn {
            flex: 1;
            padding: 10px;
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-radius: 8px;
            color: #f87171;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .theme-deactivate-btn:hover {
            background: rgba(239, 68, 68, 0.2);
            border-color: #ef4444;
        }
    `;
    document.head.appendChild(style);
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    if (window.supabaseClient) {
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        if (!session) {
            window.location.href = "../index.html";
            return;
        }
    }
    
    addCustomStyles();
    initModalHandlers();
    await initSupabase();
});