async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorEl = document.getElementById("error");

  errorEl.textContent = "";

  const { error } = await window.supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    errorEl.textContent = error.message;
    return;
  }

  window.location.href = "../pages";
}