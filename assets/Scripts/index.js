// Hamburger Menu Toggle
const hamburger = document.getElementById('hamburger');
const headerNav = document.getElementById('headerNav');

if (hamburger && headerNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    headerNav.classList.toggle('active');
  });

  // Desktop dropdown toggle - Click to open/close
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    const navItem = dropdown.querySelector('.nav-item');
    
    if (navItem) {
      navItem.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Close other dropdowns first
        document.querySelectorAll('.dropdown').forEach(other => {
          if (other !== dropdown) {
            other.classList.remove('active');
          }
        });
        
        // Toggle this dropdown
        dropdown.classList.toggle('active');
      });
    }
  });

  // Close menu when clicking on a dropdown link
  document.querySelectorAll('.dropdown-content a').forEach(link => {
    link.addEventListener('click', () => {
      // Close all dropdowns
      document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
      });
      
      // Close mobile menu if open
      hamburger.classList.remove('active');
      headerNav.classList.remove('active');
    });
  });

  // Close menu when clicking on regular navigation links
  document.querySelectorAll('.header-wrapper > a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      headerNav.classList.remove('active');
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    const clickedInsideDropdown = e.target.closest('.dropdown');
    const clickedInsideNav = headerNav.contains(e.target);
    const clickedHamburger = hamburger.contains(e.target);
    
    if (!clickedInsideDropdown && !clickedHamburger) {
      // Close all dropdowns
      document.querySelectorAll('.dropdown.active').forEach(dropdown => {
        dropdown.classList.remove('active');
      });
    }
    
    // Close mobile menu if clicking outside
    if (!clickedInsideNav && !clickedHamburger) {
      hamburger.classList.remove('active');
      headerNav.classList.remove('active');
    }
  });
}


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
        formMessage.textContent = 'Thank you for your interest! We will contact you soon.';
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
