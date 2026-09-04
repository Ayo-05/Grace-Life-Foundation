const BLOG_DATA_URL = 'assets/data/blogs.json';

document.addEventListener('DOMContentLoaded', () => {
  if(document.getElementById('blog-grid')){
    initBlogList();
  }
  if(document.getElementById('post-root')){
    initPostDetail();
  }
});

function formatDate(iso){
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function initials(title){
  return title.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

/* Basic HTML-escaping for values that get interpolated into markup */
function esc(str){
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

/* ---------------- Blog listing page ---------------- */
async function initBlogList(){
  const grid = document.getElementById('blog-grid');
  const filterBar = document.getElementById('blog-filters');
  const emptyState = document.getElementById('blog-empty');

  grid.innerHTML = Array.from({ length: 6 }).map(() => '<div class="blog-skel"></div>').join('');

  let posts = [];
  try{
    const res = await fetch(BLOG_DATA_URL);
    if(!res.ok) throw new Error('Failed to load blog data: ' + res.status);
    posts = await res.json();
  }catch(err){
    grid.innerHTML = `<p class="blog-empty">We couldn't load stories right now. Please refresh the page or try again shortly.</p>`;
    console.error(err);
    return;
  }

  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  const categories = ['All', ...new Set(posts.map(p => p.category))];
  filterBar.innerHTML = categories.map((cat, i) =>
    `<button class="filter-btn${i === 0 ? ' active' : ''}" data-cat="${cat}">${cat}</button>`
  ).join('');

  renderPosts(posts);

  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if(!btn) return;
    filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    const filtered = cat === 'All' ? posts : posts.filter(p => p.category === cat);
    renderPosts(filtered);
  });

  /* Card thumbnail: real image if `post.image` is set, otherwise the old
     colour block + initials so existing posts without an image still work. */
  function renderThumb(post){
    if(post.image){
      return `<div class="blog-thumb"><img src="${esc(post.image)}" alt="" loading="lazy"></div>`;
    }
    return `<div class="blog-thumb blog-thumb-fallback" style="background:${post.color || '#4C8C6B'}">${initials(post.title)}</div>`;
  }

  function renderPosts(list){
    if(!list.length){
      grid.innerHTML = '';
      emptyState.hidden = false;
      return;
    }
    emptyState.hidden = true;
    grid.innerHTML = list.map(post => {
      // If externalUrl exists in the JSON item, point directly to the press site
      const isExternal = Boolean(post.externalUrl);
      const linkHref = isExternal ? esc(post.externalUrl) : `post.html?id=${encodeURIComponent(post.id)}`;
      const targetAttr = isExternal ? 'target="_blank" rel="noopener noreferrer"' : '';
      const readLabel = isExternal ? 'Read on publisher site &nearr;' : 'Read story &rarr;';

      return `
        <a class="blog-card" href="${linkHref}" ${targetAttr}>
          ${renderThumb(post)}
          <div class="blog-body">
            <span class="blog-tag">${esc(post.category)}</span>
            <h3>${esc(post.title)}</h3>
            <p>${esc(post.excerpt)}</p>
            <div class="blog-meta">
              <span>${formatDate(post.date)}</span>
              <span>${esc(post.readTime)}</span>
            </div>
            <span class="blog-read">${readLabel}</span>
          </div>
        </a>
      `;
    }).join('');
  }
}

/* ---------------- Single post page ---------------- */
 
/* Renders one block of post content. Supports:
   - a plain string            -> rendered as a paragraph (old format, still works)
   - { type: "paragraph" }     -> a paragraph of text
   - { type: "image" }         -> a full-width image with optional caption
   - { type: "video" }         -> a local video file (mp4/webm) with controls
   - { type: "embed" }         -> a responsive YouTube/Vimeo embed
   - { type: "gallery" }       -> a grid of multiple images/videos (2+ items) */
function renderGalleryItem(item){
  if(item.type === 'video'){
    return `<video class="gallery-item" src="${esc(item.src)}" controls preload="metadata"
      ${item.poster ? `poster="${esc(item.poster)}"` : ''}></video>`;
  }
  return `<img class="gallery-item" src="${esc(item.src)}" alt="${esc(item.alt || '')}" loading="lazy">`;
}
 
function renderContentBlock(block){
  if(typeof block === 'string'){
    return `<p>${block}</p>`;
  }
 
  switch(block.type){
    case 'paragraph':
      return `<p>${block.text}</p>`;
 
    case 'image':
      return `
        <figure class="post-figure">
          <img class="post-image" src="${esc(block.src)}" alt="${esc(block.alt || '')}" loading="lazy">
          ${block.caption ? `<figcaption>${esc(block.caption)}</figcaption>` : ''}
        </figure>`;
    
    case 'video':
      return `
        <figure class="post-figure">
          <video class="post-video" src="${esc(block.src)}" controls preload="metadata"
            ${block.poster ? `poster="${esc(block.poster)}"` : ''}>
            Your browser doesn't support embedded video.
          </video>
          ${block.caption ? `<figcaption>${esc(block.caption)}</figcaption>` : ''}
        </figure>`;
 
    case 'embed':
      return `
        <figure class="post-figure">
          <div class="post-embed">
            <iframe src="${esc(block.url)}" title="${esc(block.caption || 'Embedded video')}"
              loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen></iframe>
          </div>
          ${block.caption ? `<figcaption>${esc(block.caption)}</figcaption>` : ''}
        </figure>`;
 
    case 'gallery':
      return `
        <figure class="post-figure">
          <div class="post-gallery">
            ${(block.items || []).map(renderGalleryItem).join('')}
          </div>
          ${block.caption ? `<figcaption>${esc(block.caption)}</figcaption>` : ''}
        </figure>`;
 
    default:
      return '';
  }
}

async function initPostDetail(){
  const root = document.getElementById('post-root');
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if(!id){
    root.innerHTML = `<div class="post-body"><p>No story was specified. <a class="back-link" href="blog.html">&larr; Back to all stories</a></p></div>`;
    return;
  }

  let posts = [];
  try{
    const res = await fetch(BLOG_DATA_URL);
    if(!res.ok) throw new Error('Failed to load blog data: ' + res.status);
    posts = await res.json();
  }catch(err){
    root.innerHTML = `<div class="post-body"><p>We couldn't load this story right now. Please try again shortly.</p></div>`;
    console.error(err);
    return;
  }

  const post = posts.find(p => p.id === id);
  if(!post){
    root.innerHTML = `<div class="post-body"><p>We couldn't find that story. <a class="back-link" href="blog.html">&larr; Back to all stories</a></p></div>`;
    return;
  }

  document.title = post.title + ' — Grace Life Foundation';

  /* Update Open Graph / Twitter meta tags dynamically so sharing a direct
     post URL gives the correct title, description and image */
  const setMeta = (sel, val) => {
    const el = document.querySelector(sel);
    if(el && val) el.setAttribute(el.hasAttribute('content') ? 'content' : 'value', val);
  };
  setMeta('meta[property="og:title"]',       post.title + ' — Grace Life Foundation');
  setMeta('meta[property="og:description"]', post.excerpt || '');
  setMeta('meta[name="twitter:title"]',      post.title + ' — Grace Life Foundation');
  setMeta('meta[name="twitter:description"]',post.excerpt || '');
  if(post.image){
    const abs = new URL(post.image, window.location.href).href;
    setMeta('meta[property="og:image"]',    abs);
    setMeta('meta[name="twitter:image"]',   abs);
  }

  /* ---- Build the hero ---- */
  const hasImage = Boolean(post.image);
  // Decorative initial for the no-image fallback (first letter of the title)
  const initial  = post.title.trim()[0].toUpperCase();

  const heroInner = `
    ${hasImage ? `<div class="post-hero-bg" style="background-image:url('${esc(post.image)}')"></div>` : ''}
    <div class="post-hero-content container">
      <a class="back-link" href="blog.html">&larr; Back to all stories</a>
      <span class="blog-tag">${esc(post.category)}</span>
      <h1>${esc(post.title)}</h1>
      <div class="blog-meta">
        <span>${esc(post.author)}</span>
        <span>${formatDate(post.date)}</span>
        <span>${esc(post.readTime)}</span>
      </div>
    </div>`;

  root.innerHTML = `
    <div class="post-hero ${hasImage ? 'has-image' : 'no-image'}"
         ${!hasImage ? `data-initial="${initial}"` : ''}
         ${!hasImage && post.color ? `style="background:${esc(post.color)}"` : ''}>
      ${heroInner}
    </div>
    <div class="post-body">
      ${post.content.map(renderContentBlock).join('')}
    </div>
  `;
}
