/* ============================================================
   Menicon Life Support Hub — Supabase Configuration
   ============================================================ */

const SUPABASE_URL = 'https://aahnkfiuhiqecscjhqyz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhaG5rZml1aGlxZWNzY2pocXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1ODQ3NjEsImV4cCI6MjA5MDE2MDc2MX0.ODHxzAuH3nLWRaPwrIiss0704jlhLX2V6xaHKwAph2o';

// Create client and store globally (avoid naming conflict with CDN's window.supabase)
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// Override window.supabase so all other scripts can use `supabase.xxx`
window.supabase = supabaseClient;

// ==================== AUTH HELPERS ====================
async function getUser() {
  const { data: { user } } = await supabaseClient.auth.getUser();
  return user;
}

async function isLoggedIn() {
  const user = await getUser();
  return !!user;
}

async function requireAuth() {
  const user = await getUser();
  if (!user) {
    window.location.href = 'index.html';
    return null;
  }
  return user;
}

async function handleLogout() {
  await supabaseClient.auth.signOut();
  window.location.href = 'index.html';
}

// ==================== UI HELPERS ====================
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(amount);
}
