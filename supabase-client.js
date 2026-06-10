const SUPABASE_URL = 'PASTE_SUPABASE_PROJECT_URL_HERE'
const SUPABASE_ANON_KEY = 'PASTE_SUPABASE_ANON_KEY_HERE'

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
