async function requireAuth() {
  const supabase = window.supabaseClient;

  if (!supabase) {
    console.error("Supabase not ready");
    return;
  }

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    window.location.replace("../auth/login.html");
    return false;
  }

  document.documentElement.style.display = "block";
  return true;
}