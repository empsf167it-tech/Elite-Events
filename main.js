document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // NAVIGATION & SCROLL EFFECT
  // ==========================================
  const header = document.querySelector('.header');
  const navMenu = document.querySelector('.nav-menu');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Highlight active link based on scroll position
    updateActiveNavLink();
  });

  // Mobile menu toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  // Close mobile menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Smooth scroll active state update
  function updateActiveNavLink() {
    let fromTop = window.scrollY + 120;
    
    // Only run section highlighting on the homepage
    const path = window.location.pathname;
    const page = path.split("/").pop();
    if (page !== '' && page !== 'index.html') return;
    
    navLinks.forEach(link => {
      let href = link.getAttribute('href');
      if (href && href.includes('#')) {
        const anchor = href.split('#')[1];
        const section = document.getElementById(anchor);
        if (section) {
          if (
            section.offsetTop <= fromTop &&
            section.offsetTop + section.offsetHeight > fromTop
          ) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        }
      }
    });
  }

  // Set active class based on current subpage filename on page load
  const path = window.location.pathname;
  const page = path.split("/").pop();
  
  if (page === 'about.html') {
    navLinks.forEach(link => {
      if (link.getAttribute('href') === 'about.html') link.classList.add('active');
      else link.classList.remove('active');
    });
  } else if (page === 'services.html') {
    navLinks.forEach(link => {
      if (link.getAttribute('href') === 'services.html') link.classList.add('active');
      else link.classList.remove('active');
    });
  } else if (page === 'work.html') {
    navLinks.forEach(link => {
      if (link.getAttribute('href') === 'work.html') link.classList.add('active');
      else link.classList.remove('active');
    });
  } else if (page === 'contact.html') {
    navLinks.forEach(link => {
      if (link.getAttribute('href') === 'contact.html') link.classList.add('active');
      else link.classList.remove('active');
    });
  }

  // ==========================================
  // STATISTICS COUNTER ANIMATION
  // ==========================================
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 2000; // 2 seconds
    const stepTime = Math.abs(Math.floor(duration / target));
    let current = 0;
    
    const timer = setInterval(() => {
      current += 1;
      el.textContent = current;
      if (current >= target) {
        el.textContent = target; // Ensure exact final target is set
        clearInterval(timer);
      }
    }, Math.max(stepTime, 10));
  };

  // Intersection Observer to start counter when visible
  const observerOptions = {
    root: null,
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  statNumbers.forEach(num => observer.observe(num));

  // ==========================================
  // PROGRESS BARS ANIMATION
  // ==========================================
  const progressFills = document.querySelectorAll('.progress-fill');
  
  const progressObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fillEl = entry.target;
        const targetWidth = fillEl.getAttribute('data-width');
        fillEl.style.width = targetWidth;
        observer.unobserve(fillEl);
      }
    });
  }, { threshold: 0.1 });

  progressFills.forEach(fill => progressObserver.observe(fill));

  // ==========================================
  // SERVICES TAB SWITCHING
  // ==========================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetPanelId = button.getAttribute('data-tab');
      
      // Update active button
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Update active panel
      tabPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === targetPanelId) {
          panel.classList.add('active');
        }
      });
    });
  });

  // ==========================================
  // DYNAMIC COST CALCULATOR
  // ==========================================
  const calcForm = document.getElementById('event-calc-form');
  const checkboxes = document.querySelectorAll('.checkbox-label input');
  const priceDisplay = document.getElementById('calc-price-display');
  const successMsg = document.getElementById('calc-success-msg');

  // Base planning and execution service fee
  const BASE_PRICE = 1500;

  // Prices of options
  const OPTION_PRICES = {
    location: 2500,
    host_dj: 1200,
    artist: 1800,
    floristy: 800,
    presentation: 600,
    photographer: 1000
  };

  function updateEstimate() {
    let sum = BASE_PRICE;
    
    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        const optionName = checkbox.value;
        if (OPTION_PRICES[optionName]) {
          sum += OPTION_PRICES[optionName];
        }
      }
    });

    // Format output as range ($Sum - $Sum * 1.35) to handle logistics variables
    const minVal = sum;
    const maxVal = Math.round(sum * 1.35);

    priceDisplay.textContent = `$${minVal.toLocaleString()} - $${maxVal.toLocaleString()}`;
  }

  // Bind change event to checkboxes for real-time update
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateEstimate);
  });

  // Form submission handling
  if (calcForm) {
    calcForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simple validation check
      const firstName = document.getElementById('calc-first-name').value.trim();
      const lastName = document.getElementById('calc-last-name').value.trim();
      const email = document.getElementById('calc-email').value.trim();

      if (!firstName || !lastName || !email) {
        alert('Please fill out all required fields.');
        return;
      }

      // Simulate API call and show success animation
      successMsg.textContent = `Thank you, ${firstName}! Your quote request has been sent. We will contact you at ${email} shortly.`;
      successMsg.style.display = 'block';
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Reset form
      calcForm.reset();
      updateEstimate(); // Reset calculator price to base price

      // Fade out success message after 6 seconds
      setTimeout(() => {
        successMsg.style.display = 'none';
      }, 6000);
    });
  }

  // ==========================================
  // CONTACT PAGE INQUIRY FORM SUBMISSION
  // ==========================================
  const contactForm = document.getElementById('contact-inquiry-form');
  const contactSuccessMsg = document.getElementById('contact-success-msg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const firstName = document.getElementById('contact-first-name').value.trim();
      const lastName = document.getElementById('contact-last-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();

      if (!firstName || !lastName || !email) {
        alert('Please fill out all required fields.');
        return;
      }

      contactSuccessMsg.textContent = `Thank you, ${firstName}! Your inquiry has been sent. Our team will contact you at ${email} shortly.`;
      contactSuccessMsg.style.display = 'block';
      contactSuccessMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Reset form
      contactForm.reset();

      // Fade out success message after 6 seconds
      setTimeout(() => {
        contactSuccessMsg.style.display = 'none';
      }, 6000);
    });
  }

  // ==========================================
  // PORTFOLIO FILTERING LOGIC
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (filterButtons.length > 0 && portfolioItems.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filterVal = btn.getAttribute('data-filter');
        
        // Toggle active button highlight
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Hide/Show items based on filter category
        portfolioItems.forEach(item => {
          const itemCat = item.getAttribute('data-category');
          if (filterVal === 'all' || itemCat === filterVal) {
            item.style.display = 'block';
            // Trigger animation repaint
            item.style.animation = 'none';
            item.offsetHeight; // trigger reflow
            item.style.animation = 'fadeIn 0.5s ease forwards';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // ==========================================
  // PORTFOLIO LIGHTBOX MODAL LOGIC
  // ==========================================
  const portfolioImgBoxes = document.querySelectorAll('.portfolio-img-box');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img-element');
  const lightboxCaption = document.getElementById('lightbox-caption-text');
  const closeLightboxBtn = document.getElementById('close-lightbox-btn');

  if (portfolioImgBoxes.length > 0 && lightboxModal && lightboxImg) {
    portfolioImgBoxes.forEach(box => {
      box.addEventListener('click', () => {
        const img = box.querySelector('img');
        if (img) {
          lightboxImg.src = img.src;
          lightboxCaption.textContent = img.alt || 'Elite Events Showcase';
          lightboxModal.style.display = 'flex';
        }
      });
    });

    // Close lightbox when clicking the X button
    if (closeLightboxBtn) {
      closeLightboxBtn.addEventListener('click', () => {
        lightboxModal.style.display = 'none';
      });
    }

    // Close lightbox when clicking on the dark background
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.style.display = 'none';
      }
    });

    // Close lightbox on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.style.display === 'flex') {
        lightboxModal.style.display = 'none';
      }
    });
  }

  // Initialize base estimate on load
  updateEstimate();
});
