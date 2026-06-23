// Theme toggle with persistence in localStorage
(function(){
  const root = document.documentElement;
  const KEY = 'theme-preference';
  const START = Date.now();
  const MIN_MS = 900;

  function applyTheme(theme){
    if(theme === 'dark'){
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }

  // load saved or prefer-color-scheme
  const saved = localStorage.getItem(KEY);
  // Always use light theme by default (dark mode removed)
  applyTheme('light');

  // hide loader when page is ready (respect minimum visible time)
  const loader = document.getElementById('loader');
  function doHide(){
    if(!loader) return;
    loader.classList.add('hidden');
    setTimeout(()=> loader.remove(), 600);
  }
  function hideLoader(){
    if(!loader) return;
    const elapsed = Date.now() - START;
    const wait = Math.max(0, MIN_MS - elapsed);
    setTimeout(doHide, wait);
  }
  if(document.readyState === 'complete') hideLoader();
  else window.addEventListener('load', hideLoader);

  // ripple effect for .btn elements
  function initRipple(){
    document.querySelectorAll('.btn').forEach(btnEl => {
      btnEl.addEventListener('click', function(e){
        const rect = btnEl.getBoundingClientRect();
        const d = Math.max(rect.width, rect.height) * 1.4;
        const span = document.createElement('span');
        span.className = 'ripple';
        span.style.width = span.style.height = d + 'px';
        const clientX = (typeof e.clientX === 'number') ? e.clientX : (rect.left + rect.width/2);
        const clientY = (typeof e.clientY === 'number') ? e.clientY : (rect.top + rect.height/2);
        span.style.left = (clientX - rect.left - d/2) + 'px';
        span.style.top  = (clientY - rect.top - d/2) + 'px';
        btnEl.appendChild(span);
        // trigger animation
        requestAnimationFrame(()=>{
          span.style.transform = 'scale(1)';
          span.style.opacity = '0';
        });
        // cleanup
        setTimeout(()=>{ try{ span.remove(); }catch(e){} }, 700);
      });
    });
  }

  if(document.readyState === 'complete') initRipple();
  else window.addEventListener('load', initRipple);

  // copy-on-click for mailto links (click copies email; Shift/Ctrl/Meta+click opens mail client)
  function initEmailCopy(){
    const emailEl = document.querySelector('a[href^="mailto:"]');
    if(!emailEl) return;
    const label = emailEl.querySelector('.label');
    const originalText = label ? label.textContent : '';
    emailEl.addEventListener('click', async function(e){
      if(e.ctrlKey || e.metaKey || e.shiftKey) return; // allow modifier+click to open mail client
      e.preventDefault();
      const email = emailEl.dataset.email || (emailEl.getAttribute('href')||'').replace(/^mailto:/i,'');
      async function doCopy(text){
        if(navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly','');
        ta.style.position = 'absolute';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try{ document.execCommand('copy'); }catch(err){}
        ta.remove();
      }
      try{
        await doCopy(email);
        if(label){
          label.textContent = 'Copied!';
          label.style.opacity = '1';
          label.style.transform = 'translateX(-50%) translateY(0)';
        } else {
          const toast = document.createElement('div');
          toast.textContent = 'Copied!';
          toast.style.cssText = 'position:fixed;left:50%;bottom:18px;transform:translateX(-50%);background:var(--panel);color:var(--text);padding:8px 12px;border-radius:8px;box-shadow:0 8px 20px rgba(2,6,23,0.06);z-index:10000;';
          document.body.appendChild(toast);
          setTimeout(()=>toast.remove(),1400);
        }
        setTimeout(()=>{
          if(label){ label.textContent = originalText; label.style.opacity = ''; label.style.transform = ''; }
        }, 1400);
      }catch(err){
        console.error('copy failed', err);
      }
    });
  }

  if(document.readyState === 'complete') initEmailCopy();
  else window.addEventListener('load', initEmailCopy);
})();
