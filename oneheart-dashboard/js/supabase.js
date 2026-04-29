// supabase.js

const SUPABASE_URL = "https://ckzjyqlgdssuhpfxjttv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNremp5cWxnZHNzdWhwZnhqdHR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNTI4NTQsImV4cCI6MjA5MjYyODg1NH0.lwzWaoj07I08s4oMC_UsSz44L6AA-EvXSdJhBIpVmjQ";

// IMPORTANT: DO NOT name this 'supabase'
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Signal ready — client creation is synchronous, but provide a Promise for scripts
window.supabaseReady = (function() {
  if (window.supabaseClient) return Promise.resolve();
  return new Promise((resolve) => {
    const iv = setInterval(() => {
      if (window.supabaseClient) {
        clearInterval(iv);
        resolve();
      }
    }, 25);
  });
})();

window.waitForSupabase = async function() { await window.supabaseReady; };

// Helper: Get current session
window.getSupabaseSession = async () => {
  const {  session } = await window.supabaseClient.auth.getSession();
  return session;
};

// Helper: Get current auth user
window.getSupabaseUser = async () => {
  const {  user } = await window.supabaseClient.auth.getUser();
  return user;
};