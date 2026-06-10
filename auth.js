// ── אתר הסת"ם המרכזי — Auth ──
const SITE_URL = 'https://setam-merkazi.co.il';
const AUTH_KEY  = 'stam_auth';
const SITE_ORIGIN = (typeof location !== 'undefined' && location.origin && location.protocol !== 'file:')
  ? location.origin
  : SITE_URL;
const OAUTH_CALLBACK = SITE_ORIGIN + '/auth-callback.html';

const PREFILL_NAME_FIELDS = [];

let _bootPromise = null;

function getUserName(user) {
  if (user?.name && !user?.user_metadata) return user.name;
  return user?.user_metadata?.full_name?.split(' ')[0]
      || user?.user_metadata?.name?.split(' ')[0]
      || user?.email?.split('@')[0]
      || 'משתמש';
}

function getDisplayName(user) {
  if (user?.fullName && !user?.user_metadata) return user.fullName;
  return user?.user_metadata?.full_name
      || user?.user_metadata?.name
      || user?.email?.split('@')[0]
      || '';
}

function persistUserFromSession(user) {
  if (!user?.id) return null;
  saveUser(user);
  supabase.from('profiles').upsert({
    id:           user.id,
    email:        user.email || '',
    display_name: getDisplayName(user)
  }, { onConflict: 'id' }).then(({ error }) => {
    if (error) console.warn('profiles upsert:', error.message);
  });
  return loadUser();
}

function saveUser(user) {
  if (!user?.id) return;
  localStorage.setItem(AUTH_KEY, JSON.stringify({
    id:       user.id,
    email:    user.email || '',
    name:     getUserName(user),
    fullName: getDisplayName(user),
    avatar:   user.user_metadata?.avatar_url || null,
    savedAt:  Date.now()
  }));
}

function loadUser() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data?.id ? data : null;
  } catch (e) {
    return null;
  }
}

function clearUser() {
  localStorage.removeItem(AUTH_KEY);
}

function waitForAuthSession(timeoutMs) {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (session) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      sub?.unsubscribe();
      resolve(session || null);
    };
    const timer = setTimeout(() => finish(null), timeoutMs);

    const { data: { subscription: sub } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user && (
        event === 'SIGNED_IN' ||
        event === 'INITIAL_SESSION' ||
        event === 'TOKEN_REFRESHED'
      )) {
        finish(session);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) finish(session);
    });
  });
}

async function refreshFromSupabase() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      persistUserFromSession(session.user);
      return loadUser();
    }
  } catch (e) {
    console.warn('refreshFromSupabase', e);
  }
  return null;
}

/** תמיד מחזיר cache אם קיים — לא מחכה ל-Supabase */
function getCachedUser() {
  return loadUser();
}

async function getCurrentUser() {
  const cached = loadUser();
  if (cached?.id) {
    refreshFromSupabase();
    return cached;
  }
  const refreshed = await refreshFromSupabase();
  return refreshed || null;
}

function finishAuthRedirect() {
  const action = localStorage.getItem('postAuthAction');
  // Check both localStorage (reliable cross-origin) and sessionStorage (legacy)
  const returnTo = localStorage.getItem('authReturnTo') || sessionStorage.getItem('authReturnTo');
  localStorage.removeItem('authReturnTo');
  sessionStorage.removeItem('authReturnTo');

  if (action === 'publish' || action === 'personal-area') {
    localStorage.removeItem('postAuthAction');
    window.location.replace(SITE_ORIGIN + '/my-ads.html');
    return;
  }

  if (action && action.startsWith('form:')) {
    localStorage.removeItem('postAuthAction');
    window.location.replace(SITE_ORIGIN + '/' + action.slice(5));
    return;
  }

  if (returnTo) {
    const url = returnTo.startsWith('http') ? returnTo : (SITE_ORIGIN + returnTo);
    window.location.replace(url);
    return;
  }

  window.location.replace(SITE_ORIGIN + '/my-ads.html');
}

async function ensureUserRow(user) {
  if (!user?.id) return;
  const { error } = await supabase.from('profiles').upsert({
    id:           user.id,
    email:        user.email || '',
    display_name: user.fullName || user.name || ''
  }, { onConflict: 'id' });
  if (error) console.warn('ensureUserRow:', error.message);
}

async function requireAuth(action) {
  const cached = loadUser();
  if (cached?.id) { await ensureUserRow(cached); return cached; }

  const refreshed = await refreshFromSupabase();
  if (refreshed?.id) { await ensureUserRow(refreshed); return refreshed; }

  const returnPath = location.pathname + location.search || '/index.html';
  sessionStorage.setItem('authReturnTo', returnPath);
  localStorage.setItem('authReturnTo', returnPath);
  if (action) localStorage.setItem('postAuthAction', action);
  else {
    const path = location.pathname.split('/').pop() || '';
    if (path.startsWith('form')) localStorage.setItem('postAuthAction', 'form:' + path + location.search);
  }
  sessionStorage.setItem('authInProgress', '1');

  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: OAUTH_CALLBACK,
      queryParams: { prompt: 'select_account' }
    }
  });
  return null;
}

async function signOut() {
  clearUser();
  try { await supabase.auth.signOut(); } catch (e) {}
  window.location.href = SITE_ORIGIN + '/index.html';
}

function prefillPublisherName() {
  const user = loadUser();
  if (!user) return;
  const value = user.fullName || user.name || '';
  PREFILL_NAME_FIELDS.forEach(sel => {
    const el = document.querySelector(sel);
    if (el && !el.value.trim()) el.value = value;
  });
}

function updatePersonalBtn(user) {
  const btn = document.getElementById('personalAreaBtn');
  if (!btn) return;
  const u = user || loadUser();
  if (u?.id) {
    const onMyAds = location.pathname.includes('my-ads');
    if (onMyAds) {
      btn.innerHTML = `<span style="display:flex;align-items:center;gap:4px;"><span style="color:#16a34a;font-size:9px;">●</span>${u.name || 'משתמש'}</span>`;
    } else {
      btn.innerHTML = `<span style="display:flex;flex-direction:column;align-items:center;line-height:1.3;gap:1px;"><span style="display:flex;align-items:center;gap:4px;"><span style="color:#16a34a;font-size:9px;">●</span>${u.name || 'משתמש'}</span><span style="font-size:9px;font-weight:600;opacity:.75;white-space:nowrap;">לאיזור האישי ›</span></span>`;
    }
    btn.title = u.email || '';
  } else {
    const isMobile = window.innerWidth <= 640;
    btn.innerHTML = isMobile ? '👤 פרסם מודעה' : '👤 איזור אישי / פרסם מודעה';
  }
  btn.onclick = async () => {
    if (loadUser()?.id) {
      window.location.href = SITE_ORIGIN + '/my-ads.html';
      return;
    }
    const u = await getCurrentUser();
    if (u?.id) {
      window.location.href = SITE_ORIGIN + '/my-ads.html';
      return;
    }
    requireAuth('personal-area');
  };
}

function injectPersonalAreaBtn() {
  const nav = document.querySelector('.main-nav');
  if (!nav || document.getElementById('personalAreaBtn')) return;

  const btn = document.createElement('button');
  btn.id = 'personalAreaBtn';
  btn.type = 'button';
  btn.className = 'btn-account';
  nav.appendChild(btn);
  updatePersonalBtn(loadUser());
}

async function bootstrapAuth() {
  if (_bootPromise) return _bootPromise;

  _bootPromise = (async () => {
    updatePersonalBtn(loadUser());

    const onCallback = location.pathname.includes('auth-callback');
    const hasCode    = new URLSearchParams(location.search).has('code');
    const hasHash    = (location.hash || '').includes('access_token');

    if (!onCallback && (hasCode || hasHash)) {
      // OAuth landed on this page instead of auth-callback.html — handle it here
      const session = await waitForAuthSession(10000);
      if (session?.user) persistUserFromSession(session.user);
      history.replaceState(null, '', location.pathname);
      finishAuthRedirect();
      return loadUser();
    }

    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        persistUserFromSession(session.user);
        updatePersonalBtn(loadUser());
        prefillPublisherName();
      } else if (event === 'SIGNED_OUT') {
        clearUser();
        updatePersonalBtn(null);
      }
    });

    await refreshFromSupabase();
    const user = loadUser();
    updatePersonalBtn(user);
    prefillPublisherName();
    return user;
  })();

  return _bootPromise;
}

document.addEventListener('DOMContentLoaded', async () => {
  if (location.pathname.includes('auth-callback')) return;
  injectPersonalAreaBtn();
  await bootstrapAuth();
});
