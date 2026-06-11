const SUPABASE_URL = 'https://uimbfaggpmdozntsamad.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpbWJmYWdncG1kb3pudHNhbWFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNDY2MDksImV4cCI6MjA5NjcyMjYwOX0.91C5No6__fA0XtCbUvargPDAEUZR62s5qjL9NW_YHko'

// implicit — הטוקן חוזר ב-hash, עובד טוב עם אתר סטטי
// שמירת website בנפרד — שקטה אם העמודה עדיין לא קיימת ב-DB
async function saveListingWebsite(listingId) {
  const val = (document.getElementById('website')?.value || '').trim();
  if (!val || !listingId) return;
  try { await supabase.from('listings').update({ website: val }).eq('id', listingId); } catch(_) {}
}

// חסימת כפל-לחיצה על כפתור פרסום — capture phase, לפני שה-onclick מגיע
document.addEventListener('DOMContentLoaded', function() {
  var btn = document.querySelector('.btn-submit');
  if (!btn) return;
  var pending = false;
  btn.addEventListener('click', function(e) {
    if (pending || btn.disabled) { e.stopImmediatePropagation(); e.preventDefault(); return; }
    pending = true;
    setTimeout(function() { pending = false; }, 600);
  }, true); // true = capture phase, fires before onclick
});

var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    flowType: 'implicit',
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true,
    storage: window.localStorage,
    storageKey: 'stam-supabase-auth'
  }
})
