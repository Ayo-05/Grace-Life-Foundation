const hamburger = document.getElementById('hamburger');
const headerNav = document.getElementById('headerNav');
 
if (hamburger && headerNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    headerNav.classList.toggle('active');
  });
 
  // Desktop dropdown toggle — click to open/close
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    const navItem = dropdown.querySelector('.nav-item');
    if (navItem) {
      navItem.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Close all other dropdowns first
        document.querySelectorAll('.dropdown').forEach(other => {
          if (other !== dropdown) other.classList.remove('active');
        });
        dropdown.classList.toggle('active');
      });
    }
  });
 
  // Close menu when a dropdown link is clicked
  document.querySelectorAll('.dropdown-content a').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
      hamburger.classList.remove('active');
      headerNav.classList.remove('active');
    });
  });
 
  // Close menu when a regular nav link is clicked
  document.querySelectorAll('.header-wrapper > a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      headerNav.classList.remove('active');
    });
  });
 
  // Close dropdowns (and mobile menu) when clicking outside
  document.addEventListener('click', (e) => {
    const clickedInsideDropdown = e.target.closest('.dropdown');
    const clickedInsideNav     = headerNav.contains(e.target);
    const clickedHamburger     = hamburger.contains(e.target);
 
    if (!clickedInsideDropdown && !clickedHamburger) {
      document.querySelectorAll('.dropdown.active').forEach(d => d.classList.remove('active'));
    }
    if (!clickedInsideNav && !clickedHamburger) {
      hamburger.classList.remove('active');
      headerNav.classList.remove('active');
    }
  });
}
// SCROLL TO TOP BUTTON  
const scrollBtn = document.getElementById('scrollToTopBtn');
 
if (scrollBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  });
 
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
 

// ACTIVE PAGE INDICATOR
(function setActiveNavLink() {
  const path        = window.location.pathname;
  // Resolve filename: '' and '/' both mean index.html
  const currentFile = path.split('/').pop() || 'index.html';
 
  // Regular top-level links
  document.querySelectorAll('.header-wrapper > a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#')) return; // ignore hash-only links
 
    // Normalise: strip leading slash, take filename portion
    const linkFile = href.replace(/^\//, '').split('/').pop() || 'index.html';
 
    const isHomePage =
      (href === '/' || linkFile === 'index.html') &&
      (path === '/' || path.endsWith('/') || currentFile === '' || currentFile === 'index.html');
 
    const isCurrentPage =
      !isHomePage && linkFile !== '' && linkFile === currentFile;
 
    if (isHomePage || isCurrentPage) {
      link.classList.add('nav-active');
    }
  });
 
  // Dropdown sub-links
  // If the current page matches a dropdown item, mark the
  // parent .dropdown as .nav-active so the trigger is highlighted.
  document.querySelectorAll('.dropdown-content a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkFile = href.split('/').pop();
    if (linkFile && linkFile === currentFile) {
      link.closest('.dropdown').classList.add('nav-active');
    }
  });
})();


// Volunteer Form Submission Handler
const volunteerForm = document.getElementById('volunteerApplicationForm');
const formMessage = document.getElementById('formMessage');

if (volunteerForm) {
  volunteerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = volunteerForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    formMessage.style.display = 'none';
    
    try {
      const formData = new FormData(volunteerForm);
      
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        formMessage.textContent = 'Thank you for your volunteering. We will get in touch with you soon';
        formMessage.className = 'form-message success';
        volunteerForm.reset();
        
        setTimeout(() => {
          formMessage.style.display = 'none';
        }, 5000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      formMessage.textContent = 'Oops! Something went wrong. Please try again.';
      formMessage.className = 'form-message error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

// Read More button Functionality
document.querySelectorAll('.read-more-btn').forEach(button => {
  button.addEventListener('click', () => {
    const text = button.previousElementSibling;
    text.classList.toggle('expanded');

    if (text.classList.contains('expanded')) {
      button.textContent = 'Read less';
    } else {
      button.textContent = 'Read more';
    }
  });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Add active state to navigation
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.header-wrapper a');
  
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= (sectionTop - 200)) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.style.backgroundColor = '';
    const href = link.getAttribute('href');
    if (href && href.startsWith('#') && href.slice(1) === current) {
      link.style.backgroundColor = 'rgba(255,255,255,0.2)';
    }
  });
});

// CIRCULAR 
(function () {
  var CIRC = 2 * Math.PI * 50; /* circumference for r=50 */
 
  function animateRings() {
    document.querySelectorAll('#impact-stats .ring-card').forEach(function (card, i) {
      var pct = parseFloat(card.getAttribute('data-pct')) / 100;
      var bar = card.querySelector('.ring-bar');
      setTimeout(function () {
        bar.style.strokeDashoffset = CIRC * (1 - pct);
      }, i * 130 + 250);
    });
  }
 
  /* Animate when section scrolls into view */
  var section = document.getElementById('impact-stats');
  if (!section) return;
 
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        animateRings();
        obs.disconnect();
      }
    }, { threshold: 0.2 });
    obs.observe(section);
  } else {
    animateRings(); /* fallback for old browsers */
  }
})();
