/* site-theme.js - Theme helpers shared across pages
   Put in repo root and include in HTML pages with correct relative path.
   The file exposes functions on window:
   - getSiteTheme(), isDarkMode(), setSiteTheme(), toggleSiteTheme(), applyThemeLink(), setDarkMode()
   It also dispatches a 'siteThemeChanged' CustomEvent on window when theme changes.
*/

(function(){
  const THEME_KEY = 'siteTheme';

  function getSiteTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'default') return saved;
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'default';
  }

  function isDarkMode() { return getSiteTheme() === 'dark'; }

  function setSiteTheme(theme) {
    const t = theme === 'dark' ? 'dark' : 'default';
    localStorage.setItem(THEME_KEY, t);
    applyThemeLink();
    // also set dataset for CSS hooks
    try { document.documentElement.dataset.theme = t === 'dark' ? 'dark' : 'default'; } catch(e){}
    console.log('[site-theme] setSiteTheme ->', t);
    window.dispatchEvent(new CustomEvent('siteThemeChanged', { detail: { theme: t } }));
  }

  function toggleSiteTheme() { setSiteTheme(isDarkMode() ? 'default' : 'dark'); }

  function setDarkMode(enabled) { setSiteTheme(enabled ? 'dark' : 'default'); }

  function applyThemeLink({ defaultCss = 'universalStyle.css', darkCss = 'darkmode.css', linkId = 'site-style-link' } = {}) {
    const theme = getSiteTheme();
    let link = document.querySelector(`link[rel="stylesheet"][href*="${defaultCss}"], link[rel="stylesheet"][href*="${darkCss}"]`);
    if (!link) link = document.getElementById(linkId);
    const newFile = theme === 'dark' ? darkCss : defaultCss;
    if (!link) {
      const linkEl = document.createElement('link');
      linkEl.id = linkId;
      linkEl.rel = 'stylesheet';
      const segments = location.pathname.split('/').filter(Boolean);
      const prefix = '../'.repeat(Math.max(0, segments.length - 1));
      linkEl.href = prefix + newFile + '?theme=' + (theme === 'dark' ? 'dark' : 'default');
      document.head.appendChild(linkEl);
      return linkEl;
      console.log('[site-theme] No existing link found, created link ->', linkEl.href);
    }
    const curHref = link.getAttribute('href') || '';
    // strip known filename and any query string so we retain base path (e.g., '../')
    const base = curHref.replace(new RegExp(`(?:${defaultCss}|${darkCss})(?:\\?.*)?$`), '');
    // Add a small query param to bust cache when switching themes so swaps take effect immediately
    const finalHref = base + newFile + '?theme=' + (theme === 'dark' ? 'dark' : 'default');
    link.setAttribute('href', finalHref);
  
    console.log('[site-theme] applyThemeLink swapped href ->', base + newFile);
    return link;
  }

  // Apply early
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){ applyThemeLink(); try { document.documentElement.dataset.theme = getSiteTheme(); } catch(e){} });
  } else {
    applyThemeLink();
    try { document.documentElement.dataset.theme = getSiteTheme(); } catch(e){}
  }

  /* Insert a small global theme toggle button if not present. This avoids editing all pages.
     The button is appended to document.body and binds to toggleSiteTheme.
  */
  function ensureGlobalToggle() {
    if (document.getElementById('globalThemeToggle')) return;
    const btn = document.createElement('button');
    btn.id = 'globalThemeToggle';
    btn.setAttribute('aria-label', 'Toggle theme');
    btn.style.position = 'fixed';
    btn.style.right = '10px';
    btn.style.bottom = '10vh';
    btn.style.zIndex = '2000';
    btn.style.padding = '8px 10px';
    btn.style.borderRadius = '999px';
    btn.style.border = 'none';
    btn.style.background = 'rgba(0,0,0,0.06)';
    btn.style.cursor = 'pointer';
    btn.textContent = isDarkMode() ? '🌙' : '☀️';
    btn.addEventListener('click', () => { toggleSiteTheme(); btn.textContent = isDarkMode() ? '🌙' : '☀️'; });
    window.addEventListener('siteThemeChanged', () => { btn.textContent = isDarkMode() ? '🌙' : '☀️'; });
    document.body.appendChild(btn);
  }
  try { if (document.readyState !== 'loading') ensureGlobalToggle(); else document.addEventListener('DOMContentLoaded', ensureGlobalToggle); } catch(e){}

  // expose globally
  window.getSiteTheme = getSiteTheme;
  window.isDarkMode = isDarkMode;
  window.setSiteTheme = setSiteTheme;
  window.toggleSiteTheme = toggleSiteTheme;
  window.applyThemeLink = applyThemeLink;
  window.setDarkMode = setDarkMode;
})();
