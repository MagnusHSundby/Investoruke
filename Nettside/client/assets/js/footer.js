(function initFooter(){
  function run(){
    const tabs = Array.from(document.querySelectorAll('.tab'));
    const indicator = document.querySelector('.indicator');
    let notchRule = null;
  // diagnostics
  // initialization

  // search all stylesheets for .nav::before rule
  for (const sheet of Array.from(document.styleSheets)){
    try{
      for (const rule of Array.from(sheet.cssRules || [])){
        if (rule.selectorText === '.nav::before'){
          notchRule = rule;
          break;
        }
      }
      if (notchRule) break;
    }catch(e){
      // some stylesheets are cross-origin and will throw; ignore
      continue;
    }
  }

  function moveIndicatorTo(tab){
    if (!tab) return;
    const rect = tab.getBoundingClientRect();
    const nav = document.querySelector('.nav');
    if(!nav) return;
    const navRect = nav.getBoundingClientRect();
    const centerX = rect.left - navRect.left + rect.width / 2;

    if (indicator){
      const offset = indicator.offsetWidth ? centerX - indicator.offsetWidth / 2 : centerX;
      indicator.style.transform = `translateX(${offset}px)`;
  // moved indicator
    }
    // compute notch half width from computed ::before if possible
    const navEl = document.querySelector('.nav');
    if (navEl){
      let half = 45; // fallback
      try{
        const navCS = getComputedStyle(navEl);
        const notchVal = navCS.getPropertyValue('--notch-size') || navCS.getPropertyValue('notch-size');
        if (notchVal){
          const num = parseFloat(notchVal);
          if (!isNaN(num)) half = num / 2;
        } else {
          // fallback: try reading pseudo-element width
          const cs = getComputedStyle(navEl, '::before');
          const w = cs.getPropertyValue('width') || cs.width;
          if (w) {
            const num = parseFloat(w);
            if (!isNaN(num)) half = num / 2;
          }
        }
      }catch(e){
        // ignore
      }
  const notchX = centerX - half;
  navEl.style.setProperty('--notch-x', `${notchX}px`);
    }
  }

    // determine active tab: prefer an existing .tab.active, otherwise try to match by link href -> pathname
    let active = document.querySelector('.tab.active');
    if (!active) {
      try{
        const normalize = (p) => {
          if (!p) return '';
          // strip trailing slashes
          p = p.replace(/\/+$/,'');
          // strip index filenames
          p = p.replace(/(?:\/index\.[a-z]+|\/index)$/i, '');
          return p || '/';
        };
        const path = normalize(window.location.pathname);
        for (const btn of tabs){
          const a = btn.closest('a');
          if (!a) continue;
          const url = new URL(a.href, window.location.origin);
          const hrefPath = normalize(url.pathname);
          // exact match OR current path starts with the tab path (so /game/tetris.html matches /game)
          if (hrefPath === path || (hrefPath !== '/' && path.startsWith(hrefPath + '/')) || (hrefPath !== '/' && path === hrefPath)){
            active = btn;
            btn.classList.add('active');
            break;
          }
        }
      }catch(e){ /* ignore URL parse errors */ }
    }

    // fallback to first tab if still none
    if (!active) active = tabs[0];
  if (active) moveIndicatorTo(active);

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const prev = document.querySelector('.tab.active');
        if (prev) prev.classList.remove('active');
        tab.classList.add('active');
        moveIndicatorTo(tab);
      });
    });

    // Recompute on window resize to keep notch centered
    window.addEventListener('resize', () => {
      const cur = document.querySelector('.tab.active') || tabs[0];
      if (cur) moveIndicatorTo(cur);
    });
    // observe footer for later mutations (some pages modify DOM after load)
    try{
      const navEl = document.querySelector('.nav');
      if (navEl && window.MutationObserver){
        const mo = new MutationObserver(() => {
          const cur = document.querySelector('.tab.active') || tabs[0];
          if (cur) moveIndicatorTo(cur);
        });
        mo.observe(navEl, { attributes: true, childList: true, subtree: true });
      }
    }catch(e){ /* ignore */ }
    // retries for late layout shifts (do not dispatch clicks to avoid navigation)
    setTimeout(() => {
      try{ const cur = document.querySelector('.tab.active') || tabs[0]; if(cur) moveIndicatorTo(cur); }catch(e){}
    }, 250);
    setTimeout(() => {
      try{ const cur = document.querySelector('.tab.active') || tabs[0]; if(cur) moveIndicatorTo(cur); }catch(e){}
    }, 600);
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', () => {
      // small timeout to allow layout/images to settle
      setTimeout(run, 80);
    });
  } else {
    // already loaded
    setTimeout(run, 40);
  }
})();
