/**
 * Sacred Timber - Divine Temple Wood Carvings Heritage Website
 * Core Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initScrollAnimations();
  initDevotionalSparks();
  initGalleryFilters();
  initLightbox();
});

/**
 * Header Scrolling Effect
 */
function initHeaderScroll() {
  const header = document.querySelector('header');
  if (!header) return;

  const checkScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Run once at load
}

/**
 * Scroll Fade-In Animations (Intersection Observer)
 */
function initScrollAnimations() {
  const fadeSections = document.querySelectorAll('.fade-in-section');
  if (fadeSections.length === 0) return;

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Animates only once
      }
    });
  }, observerOptions);

  fadeSections.forEach(section => {
    observer.observe(section);
  });
}

/**
 * Interactive Gallery Filter Logic
 */
function initGalleryFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.carving-card');

  if (filterButtons.length === 0 || cards.length === 0) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle active classes on buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      cards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');

        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'block';
          // Trigger slight scale/fade in animation
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          // Wait for transition to finish before hiding
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/**
 * Devotional Sparks (Canvas Particles Background)
 * Simulates gentle floating warm light particles from temple diya/incense
 */
function initDevotionalSparks() {
  const canvas = document.getElementById('sparks-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Re-adjust on resize
  window.addEventListener('resize', () => {
    width = (canvas.width = window.innerWidth);
    height = (canvas.height = window.innerHeight);
  });

  const particleCount = 45;
  const particles = [];

  class Spark {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 100;
      this.radius = 1 + Math.random() * 2.5;
      this.speedY = 0.5 + Math.random() * 1.2;
      this.speedX = -0.5 + Math.random() * 1.0;
      this.alpha = 0.1 + Math.random() * 0.7;
      this.decay = 0.001 + Math.random() * 0.003;
      // Soft orange, amber, and gold hues
      const colors = ['#f26f21', '#e5b842', '#c87533', '#ffae19'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.alpha -= this.decay;

      // Reset when spark dies or leaves screen
      if (this.alpha <= 0 || this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.shadowBlur = this.radius * 3;
      ctx.shadowColor = this.color;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Spark());
    // Scatter starting positions
    particles[i].y = Math.random() * height;
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/**
 * Lightbox Modal functionality
 */
function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const closeBtn = document.querySelector('.lightbox-close');
  const triggerLinks = document.querySelectorAll('.card-link, .carving-card img');

  if (!modal || triggerLinks.length === 0) return;

  const modalImg = modal.querySelector('.lightbox-img');
  const modalCategory = modal.querySelector('.lightbox-category');
  const modalTitle = modal.querySelector('.lightbox-title');
  const modalDesc = modal.querySelector('.lightbox-desc');
  const metaWood = modal.querySelector('#meta-wood');
  const metaDimension = modal.querySelector('#meta-dimension');

  const openLightbox = (card) => {
    // Read attributes
    const imgUrl = card.querySelector('img').src;
    const category = card.querySelector('.card-category').textContent;
    const title = card.querySelector('.card-title').textContent;
    const desc = card.getAttribute('data-full-desc') || card.querySelector('.card-desc').textContent;
    const wood = card.getAttribute('data-wood') || 'Rosewood';
    const dimensions = card.getAttribute('data-dimensions') || '24" x 36"';

    // Set content
    modalImg.src = imgUrl;
    modalImg.alt = title;
    modalCategory.textContent = category;
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    if (metaWood) metaWood.textContent = wood;
    if (metaDimension) metaDimension.textContent = dimensions;

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  };

  triggerLinks.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const card = trigger.closest('.carving-card');
      if (card) openLightbox(card);
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Unlock background scroll
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Close when clicking outside content area
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}
