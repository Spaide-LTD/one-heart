const { data: { session } } = await window.supabaseClient.auth.getSession();

if (!session) {
  window.location.href = "/login.html";
}
document.addEventListener('DOMContentLoaded', () => {
    const supabase = window.supabaseClient;
    if (!supabase) { return; }

    const themesGrid = document.getElementById('themesGrid');
    const addThemeBtn = document.getElementById('addThemeBtn');
    const addThemeModal = document.getElementById('addThemeModal');
    const closeAddModal = document.getElementById('closeAddModal');
    const cancelAddModal = document.getElementById('cancelAddModal');
    const saveThemeBtn = document.getElementById('saveThemeBtn');

    let themes = [];

    // Fetch Themes
    async function loadThemes() {
        const { data, error } = await supabase.from('themes').select('*').order('category', 'name');
        if (error) { showToast('failed_to_load_themes', 'error'); return; }
        themes = data || [];
        renderThemes();
    }

    // Render Grid
    function renderThemes() {
        themesGrid.innerHTML = '';
        themes.forEach(theme => {
            const isActive = theme.is_active;
            const card = document.createElement('div');
            card.className = `theme-card ${isActive ? 'active' : ''}`;
            
            card.innerHTML = `
                <div class="theme-header">
                    <div class="theme-icon">${theme.icon}</div>
                    <div>
                        <div class="theme-title">${theme.name}</div>
                        <div class="theme-category">${theme.category}</div>
                    </div>
                </div>
                <p class="theme-desc">${theme.description}</p>
                
                <div class="theme-preview">
                    <div class="theme-preview-overlay" style="background: ${theme.background_effect || `linear-gradient(135deg, ${theme.primary_color}33, ${theme.accent_color}33)`}"></div>
                </div>

                <div class="theme-colors">
                    <div class="color-swatch" style="background: ${theme.primary_color}" title="Primary"></div>
                    <div class="color-swatch" style="background: ${theme.accent_color}" title="Accent"></div>
                </div>

                <button class="theme-activate-btn ${isActive ? 'active' : 'inactive'}" data-id="${theme.id}">
                    ${isActive ? '<i class="fa-solid fa-check"></i> <span data-i18n="actions.currentlyActive">Currently Active</span>' : '<i class="fa-solid fa-power-off"></i> <span data-i18n="actions.activateTheme">Activate Theme</span>'}
                </button>
            `;
            themesGrid.appendChild(card);
        });

        // apply translations to newly injected nodes
        if (window.applyLanguage) applyLanguage(window.currentLang || localStorage.getItem('lang') || 'en');

        // Attach activate listeners
        document.querySelectorAll('.theme-activate-btn.inactive').forEach(btn => {
            btn.addEventListener('click', () => activateTheme(btn.dataset.id));
        });
    }

    // Activate Theme Logic
    async function activateTheme(id) {
        // Optimistic UI update
        document.querySelectorAll('.theme-activate-btn').forEach(b => {
            b.className = 'theme-activate-btn inactive';
            b.innerHTML = `<i class="fa-solid fa-power-off"></i> ${window.t ? window.t('actions.activateTheme') : 'Activate Theme'}`;
        });
        const activeBtn = document.querySelector(`.theme-activate-btn[data-id="${id}"]`);
        if (activeBtn) {
            activeBtn.className = 'theme-activate-btn active';
            activeBtn.innerHTML = `<i class="fa-solid fa-check"></i> ${window.t ? window.t('actions.currentlyActive') : 'Currently Active'}`;
        }

        // Database Update
        const { error } = await supabase.rpc('set_active_theme', { target_id: id });
        if (error) {
            showToast('failed_to_update_theme', 'error');
            loadThemes(); // Revert on failure
            return;
        }

        // Update local state
        themes.forEach(t => t.is_active = (t.id === id));
        showToast('theme_activated_successfully', 'success');
    }

    // Custom Theme Modal
    addThemeBtn.onclick = () => addThemeModal.classList.add('active');
    closeAddModal.onclick = cancelAddModal.onclick = () => addThemeModal.classList.remove('active');
    addThemeModal.addEventListener('click', e => { if (e.target === addThemeModal) addThemeModal.classList.remove('active'); });

    saveThemeBtn.onclick = async () => {
        const name = document.getElementById('customName').value.trim();
        const category = document.getElementById('customCategory').value;
        const icon = document.getElementById('customIcon').value.trim() || '🎨';
        const desc = document.getElementById('customDesc').value.trim();
        const primary = document.getElementById('customPrimary').value;
        const accent = document.getElementById('customAccent').value;
        const effect = document.getElementById('customEffect').value.trim() || `linear-gradient(135deg, ${primary}33, ${accent}33)`;

        if (!name || !category || !primary || !accent) {
            showToast('error.fill_required', 'error');
            return;
        }

        const { error } = await supabase.from('themes').insert({
            name, category, icon, description: desc,
            primary_color: primary, accent_color: accent,
            background_effect: effect, is_active: false
        });

        if (error) {
            showToast('failed_to_save_theme', 'error');
        } else {
            showToast('custom_theme_added_successfully', 'success');
            addThemeModal.classList.remove('active');
            // Reset form
            document.getElementById('customName').value = '';
            document.getElementById('customDesc').value = '';
            document.getElementById('customEffect').value = '';
            loadThemes();
        }
    };

    // Toast Utility
    function showToast(message, type = 'success') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        // message may be a translation key; resolve via t(), fallback to literal
        const display = (window.t && typeof window.t === 'function') ? window.t(message) : message;
        toast.setAttribute('data-i18n', message);
        toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-check-circle' : 'fa-circle-exclamation'}"></i> <span>${display}</span>`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

        // Initialize (wait for supabase client)
        if (window.supabaseReady) {
            window.supabaseReady.then(() => loadThemes()).catch(err => { loadThemes(); });
        } else {
            loadThemes();
        }

});