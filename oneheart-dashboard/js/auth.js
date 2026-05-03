// auth.js - Complete Authentication & Authorization System

let currentUser = null;
let currentSession = null;
let authInitialized = false;

// Initialize auth state
async function initAuth() {
    const supabase = window.supabaseClient;
    if (!supabase) {
        console.error("Supabase client not initialized");
        return false;
    }
    
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session) {
            currentSession = session;
            currentUser = session.user;
            authInitialized = true;
            return true;
        }
        
        authInitialized = true;
        return false;
    } catch (error) {
        console.error("Auth init error:", error);
        return false;
    }
}

// Require authentication - redirects to login if not authenticated
async function requireAuth(redirectUrl = "../auth/login.html") {
    const supabase = window.supabaseClient;
    
    if (!supabase) {
        console.error("Supabase not ready");
        window.location.replace(redirectUrl);
        return false;
    }
    
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (!session) {
            console.log("No active session, redirecting to login");
            window.location.replace(redirectUrl);
            return false;
        }
        
        // Check if session is expired
        const expiresAt = new Date(session.expires_at * 1000);
        if (expiresAt < new Date()) {
            console.log("Session expired, redirecting to login");
            await supabase.auth.signOut();
            window.location.replace(redirectUrl);
            return false;
        }
        
        currentSession = session;
        currentUser = session.user;
        
        // Show the page (if it was hidden)
        document.documentElement.style.display = "";
        document.body.style.visibility = "visible";
        
        return true;
        
    } catch (error) {
        console.error("Auth check error:", error);
        window.location.replace(redirectUrl);
        return false;
    }
}

// Require specific role (admin, user, etc.)
async function requireRole(roles, redirectUrl = "../auth/login.html") {
    const isAuthed = await requireAuth(redirectUrl);
    if (!isAuthed) return false;
    
    const supabase = window.supabaseClient;
    
    try {
        // Get user role from custom user_roles table or user metadata
        const { data: userRole, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', currentUser.id)
            .single();
        
        if (error || !userRole) {
            console.error("No role found for user");
            window.location.replace("../unauthorized.html");
            return false;
        }
        
        const allowedRoles = Array.isArray(roles) ? roles : [roles];
        if (!allowedRoles.includes(userRole.role)) {
            console.error("User does not have required role");
            window.location.replace("../unauthorized.html");
            return false;
        }
        
        return true;
        
    } catch (error) {
        console.error("Role check error:", error);
        window.location.replace("../unauthorized.html");
        return false;
    }
}

// Get current user
function getCurrentUser() {
    return currentUser;
}

// Get current session
function getCurrentSession() {
    return currentSession;
}

// Check if user is authenticated
async function isAuthenticated() {
    const supabase = window.supabaseClient;
    if (!supabase) return false;
    
    try {
        const { data: { session } } = await supabase.auth.getSession();
        return !!session;
    } catch {
        return false;
    }
}

// Logout function
async function logout(redirectUrl = "../auth/login.html") {
    const supabase = window.supabaseClient;
    if (!supabase) return;
    
    try {
        await supabase.auth.signOut();
        currentUser = null;
        currentSession = null;
        window.location.replace(redirectUrl);
    } catch (error) {
        console.error("Logout error:", error);
        window.location.replace(redirectUrl);
    }
}

// Refresh session
async function refreshSession() {
    const supabase = window.supabaseClient;
    if (!supabase) return null;
    
    try {
        const { data: { session }, error } = await supabase.auth.refreshSession();
        if (error) throw error;
        currentSession = session;
        currentUser = session?.user || null;
        return session;
    } catch (error) {
        console.error("Session refresh error:", error);
        return null;
    }
}

// Auto-refresh session every 30 minutes
let refreshInterval = null;
function startAutoRefresh() {
    if (refreshInterval) clearInterval(refreshInterval);
    refreshInterval = setInterval(async () => {
        if (await isAuthenticated()) {
            await refreshSession();
        }
    }, 30 * 60 * 1000); // 30 minutes
}

function stopAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }
}

// Listen for auth state changes
function onAuthStateChange(callback) {
    const supabase = window.supabaseClient;
    if (!supabase) return;
    
    return supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
            currentSession = session;
            currentUser = session?.user || null;
        } else if (event === 'SIGNED_OUT') {
            currentSession = null;
            currentUser = null;
        }
        
        if (callback) callback(event, session);
    });
}

// Initialize auth and start auto-refresh
async function initializeAuth() {
    const isAuthed = await initAuth();
    if (isAuthed) {
        startAutoRefresh();
    }
    return isAuthed;
}

// Export for global use
window.auth = {
    requireAuth,
    requireRole,
    getCurrentUser,
    getCurrentSession,
    isAuthenticated,
    logout,
    refreshSession,
    onAuthStateChange,
    initializeAuth
};