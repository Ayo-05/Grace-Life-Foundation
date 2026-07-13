
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollTop();
  initStatRings();
  markActiveNav();
  initDonateModal();
});

/* Mobile hamburger nav */
function initNav(){
  const toggle = document.querySelector('.hamburger');
  const links = document.querySelector('.nav-links');
  if(!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* Highlight the current page in the nav */
function markActiveNav(){
  const current = (window.location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-links a[data-page]').forEach(link => {
    if(link.dataset.page === current){
      link.classList.add('nav-active');
    } else {
      link.classList.remove('nav-active');
    }
  });
}

/* Scroll-to-top button */
function initScrollTop(){
  const btn = document.querySelector('.scroll-top');
  if(!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}



/* Donate modal — bank account details popup, triggered from #donate-trigger */
function initDonateModal(){
  const trigger = document.getElementById('donate-trigger');
  const modal = document.getElementById('donate-modal');
  if(!trigger || !modal) return;

  const closeBtn = document.getElementById('donate-modal-close');
  let lastFocused = null;

  function onKeydown(e){
    if(e.key === 'Escape') closeModal();
  }

  function openModal(){
    lastFocused = document.activeElement;
    modal.hidden = false;
    // next frame, so the transition from hidden -> visible actually animates
    requestAnimationFrame(() => modal.classList.add('is-open'));
    document.body.classList.add('modal-open');
    if(closeBtn) closeBtn.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function closeModal(){
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', onKeydown);
    setTimeout(() => { modal.hidden = true; }, 250);
    if(lastFocused) lastFocused.focus();
  }

  trigger.addEventListener('click', openModal);
  if(closeBtn) closeBtn.addEventListener('click', closeModal);

  // Click on the dark backdrop (not the card itself) closes the modal
  modal.addEventListener('click', (e) => {
    if(e.target === modal) closeModal();
  });

  // Copy-to-clipboard for each account number
  modal.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const value = btn.dataset.copyTarget;
      try{
        await navigator.clipboard.writeText(value);
        const original = btn.textContent;
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = original;
          btn.classList.remove('copied');
        }, 1500);
      }catch(err){
        console.error('Clipboard copy failed:', err);
      }
    });
  });
}