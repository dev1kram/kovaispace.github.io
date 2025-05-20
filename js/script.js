document.addEventListener("DOMContentLoaded", () => {
  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll(".nav-links a");
  navLinks.forEach((link) => {
    // Only smooth scroll for anchor links
    if (link.getAttribute("href").startsWith("#")) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href").substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
  });

  // Properties dropdown menu logic
  const propertiesMenuBtn = document.getElementById('properties-menu-btn');
  const popup = document.getElementById('properties-popup');
  if (propertiesMenuBtn && popup) {
    propertiesMenuBtn.addEventListener('click', function(e) {
      e.preventDefault();
      popup.classList.toggle('show');
      // Position popup below the menu
      const rect = propertiesMenuBtn.getBoundingClientRect();
      popup.style.top = rect.bottom + window.scrollY + "px";
      popup.style.left = rect.left + "px";
    });

    document.addEventListener('click', function(e) {
      if (!popup.contains(e.target) && !propertiesMenuBtn.contains(e.target)) {
        popup.classList.remove('show');
      }
    });
  }

  // Testimonial slider (infinite loop, edge-to-edge, auto, pause on hover)
  const slider = document.getElementById('testimonial-slider');
  if (slider) {
    let testimonialIndex = 0;
    let isTransitioning = false;
    const testimonials = slider.children;
    const totalTestimonials = testimonials.length;

    // Clone first and last for seamless infinite loop
    const firstClone = testimonials[0].cloneNode(true);
    const lastClone = testimonials[totalTestimonials - 1].cloneNode(true);
    slider.appendChild(firstClone);
    slider.insertBefore(lastClone, testimonials[0]);

    // Set initial position
    slider.style.transform = `translateX(-100%)`;

    function showTestimonial(index) {
      slider.style.transition = "transform 0.7s cubic-bezier(.77,0,.18,1)";
      slider.style.transform = `translateX(-${(index + 1) * 100}%)`;
    }

    let interval = setInterval(nextTestimonial, 3000);

    function nextTestimonial() {
      if (isTransitioning) return;
      testimonialIndex++;
      showTestimonial(testimonialIndex);
      isTransitioning = true;
    }

    slider.addEventListener('transitionend', () => {
      isTransitioning = false;
      if (testimonialIndex === totalTestimonials) {
        slider.style.transition = "none";
        testimonialIndex = 0;
        slider.style.transform = `translateX(-100%)`;
      }
      if (testimonialIndex === -1) {
        slider.style.transition = "none";
        testimonialIndex = totalTestimonials - 1;
        slider.style.transform = `translateX(-${totalTestimonials * 100}%)`;
      }
    });

    // Pause on hover
    slider.parentElement.addEventListener('mouseenter', () => clearInterval(interval));
    slider.parentElement.addEventListener('mouseleave', () => {
      interval = setInterval(nextTestimonial, 3000);
    });
  }

  // Property Popup (15s after load, once per visit)
  const propertyPopup = document.getElementById('propertyPopup');
  const closePropertyPopup = document.getElementById('closePropertyPopup');
  if (propertyPopup && closePropertyPopup) {
    if (!localStorage.getItem('propertyPopupShown')) {
      setTimeout(function () {
        propertyPopup.style.display = 'flex';
        localStorage.setItem('propertyPopupShown', 'true');
      }, 15000);
    }
    closePropertyPopup.onclick = function () {
      propertyPopup.style.display = 'none';
    };
  }

  // Consult Popup (on scroll to bottom, once per visit)
  const consultPopup = document.getElementById('consultPopup');
  const closeConsultPopup = document.getElementById('closeConsultPopup');
  let consultPopupShown = false;
  if (consultPopup && closeConsultPopup) {
    window.addEventListener('scroll', function () {
      if (
        !consultPopupShown &&
        (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2
      ) {
        consultPopup.style.display = 'flex';
        consultPopupShown = true;
      }
    });
    closeConsultPopup.onclick = function () {
      consultPopup.style.display = 'none';
    };
  }

  // Animated Counter for Achievements
  function animateCounter(el, target, duration = 1800) {
    let start = 0;
    let startTime = null;
    target = +target;
    function updateCounter(currentTime) {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const value = Math.floor(progress * (target - start) + start);
      el.textContent = value;
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(updateCounter);
  }
  function animateAllCounters() {
    document.querySelectorAll('.achievement-number').forEach(el => {
      if (!el.dataset.animated) {
        animateCounter(el, el.getAttribute('data-target'));
        el.dataset.animated = "true";
      }
    });
  }
  // Animate when achievements section is in view
  function isInViewport(elem) {
    const rect = elem.getBoundingClientRect();
    return (
      rect.top < window.innerHeight &&
      rect.bottom > 0
    );
  }
  let achievementsAnimated = false;
  window.addEventListener('scroll', function() {
    const section = document.querySelector('.achievements-section');
    if (section && !achievementsAnimated && isInViewport(section)) {
      animateAllCounters();
      achievementsAnimated = true;
    }
  });
  // For users who never scroll (e.g. mobile), fallback:
  window.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
      if (!achievementsAnimated) animateAllCounters();
    }, 3000);
  });
});

function scrollToQuickEnquiry() {
  const quickEnquiry = document.getElementById('enquiry');
  if (quickEnquiry) {
    quickEnquiry.scrollIntoView({ behavior: "smooth" });
  }
}