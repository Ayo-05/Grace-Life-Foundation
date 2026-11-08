/* Environmental Health nav: "Local Governments" dropdown.
   Load after main.js. Desktop: opens on hover or click. Mobile: tap to expand inside the hamburger menu. */
document.addEventListener('DOMContentLoaded', () => {
  const item = document.querySelector('.has-dropdown');
  if(!item) return;
  const toggle = item.querySelector('.dropdown-toggle');

  function setOpen(open){
    item.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(!item.classList.contains('open'));
  });

  // close when clicking elsewhere, pressing Escape, or choosing a link
  document.addEventListener('click', (e) => { if(!item.contains(e.target)) setOpen(false); });
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape') setOpen(false); });
  item.querySelectorAll('.dropdown-menu a').forEach(a => a.addEventListener('click', () => setOpen(false)));

  // highlight "Local Governments" when one of its pages is the current page
  if(item.querySelector('.dropdown-menu a.nav-active')) toggle.classList.add('nav-active');
});
