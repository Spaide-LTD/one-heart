// supabase.js

const SUPABASE_URL = "https://ckzjyqlgdssuhpfxjttv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNremp5cWxnZHNzdWhwZnhqdHR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNTI4NTQsImV4cCI6MjA5MjYyODg1NH0.lwzWaoj07I08s4oMC_UsSz44L6AA-EvXSdJhBIpVmjQ";

window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);