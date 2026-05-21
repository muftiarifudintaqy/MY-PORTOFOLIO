// DOM Elements
const themeToggle = document.getElementById("theme-toggle");
const navbar = document.querySelector(".navbar");
const navMenu = document.querySelector(".nav-menu");
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelectorAll(".nav-link");
const skillProgressBars = document.querySelectorAll(".skill-progress");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");
const currentYear = document.getElementById("current-year");

// Set current year in footer
if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

// Dark/Light Mode Toggle
function initTheme() {
  // Check for saved theme preference or default to light
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);

  // Update toggle button icon
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";

  // Set new theme
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);

  // Update toggle button icon
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const moonIcon = themeToggle.querySelector(".fa-moon");
  const sunIcon = themeToggle.querySelector(".fa-sun");

  if (theme === "dark") {
    moonIcon.style.opacity = "0";
    sunIcon.style.opacity = "1";
  } else {
    moonIcon.style.opacity = "1";
    sunIcon.style.opacity = "0";
  }
}

// Mobile Navigation Toggle
function toggleMobileMenu() {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
}

// Close mobile menu when clicking on a link
function closeMobileMenu() {
  hamburger.classList.remove("active");
  navMenu.classList.remove("active");
}

// Smooth scrolling for navigation links
function smoothScroll(e) {
  e.preventDefault();

  const targetId = this.getAttribute("href");
  if (targetId === "#") return;

  const targetSection = document.querySelector(targetId);
  if (!targetSection) return;

  // Update active nav link
  navLinks.forEach((link) => link.classList.remove("active"));
  this.classList.add("active");

  // Close mobile menu if open
  closeMobileMenu();

  // Scroll to section
  const headerHeight = navbar.offsetHeight;
  const targetPosition = targetSection.offsetTop - headerHeight;

  window.scrollTo({
    top: targetPosition,
    behavior: "smooth",
  });
}

// Animate skill bars when they come into view
function animateSkillBars(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const progressBar = entry.target;
      const width = progressBar.getAttribute("data-width");

      // Animate the width
      setTimeout(() => {
        progressBar.style.width = width + "%";
      }, 300);

      // Stop observing after animation
      observer.unobserve(progressBar);
    }
  });
}

// Initialize skill bar animation observer
function initSkillBarObserver() {
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.3,
  };

  const observer = new IntersectionObserver(animateSkillBars, options);

  skillProgressBars.forEach((bar) => {
    observer.observe(bar);
  });
}

// Filter projects by category
function filterProjects() {
  const filterValue = this.getAttribute("data-filter");

  // Update active filter button
  filterButtons.forEach((btn) => btn.classList.remove("active"));
  this.classList.add("active");

  // Filter projects
  projectCards.forEach((card) => {
    const category = card.getAttribute("data-category");

    if (filterValue === "all" || category === filterValue) {
      card.style.display = "block";
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "scale(1)";
      }, 10);
    } else {
      card.style.opacity = "0";
      card.style.transform = "scale(0.8)";
      setTimeout(() => {
        card.style.display = "none";
      }, 300);
    }
  });
}

// Handle contact form submission with Formspree
async function handleFormSubmit(e) {
  e.preventDefault();

  // Get form data
  const formData = new FormData(contactForm);

  // Show loading state
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.innerHTML;
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
  submitButton.disabled = true;

  try {
    // Send form data to Formspree
    const response = await fetch(contactForm.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      // Show success message
      formMessage.textContent =
        "Message sent successfully! I will reply to your email as soon as possible.";
      formMessage.className = "form-message success";
      formMessage.style.display = "block";

      // Reset form
      contactForm.reset();

      // Hide message after 5 seconds
      setTimeout(() => {
        formMessage.style.display = "none";
      }, 5000);
    } else {
      throw new Error("Form submission failed");
    }
  } catch (error) {
    // Show error message
    formMessage.textContent =
      "Sorry, an error occurred. Please try again or contact me directly at urneizzhe@gmail.com";
    formMessage.className = "form-message error";
    formMessage.style.display = "block";

    // Hide message after 5 seconds
    setTimeout(() => {
      formMessage.style.display = "none";
    }, 5000);
  } finally {
    // Reset button state
    submitButton.innerHTML = originalButtonText;
    submitButton.disabled = false;
  }
}

// Update active nav link based on scroll position
function updateActiveNavLink() {
  const scrollPosition = window.scrollY + 100; // Offset for header

  // Get all sections
  const sections = document.querySelectorAll("section[id]");

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - navbar.offsetHeight;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      // Remove active class from all links
      navLinks.forEach((link) => link.classList.remove("active"));

      // Add active class to current section's link
      const activeLink = document.querySelector(
        `.nav-link[href="#${sectionId}"]`
      );
      if (activeLink) {
        activeLink.classList.add("active");
      }
    }
  });
}

// Initialize all event listeners
function initEventListeners() {
  // Theme toggle
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  // Mobile menu toggle
  if (hamburger) {
    hamburger.addEventListener("click", toggleMobileMenu);
  }

  // Smooth scroll for nav links
  navLinks.forEach((link) => {
    link.addEventListener("click", smoothScroll);
  });

  // Filter buttons for projects
  filterButtons.forEach((button) => {
    button.addEventListener("click", filterProjects);
  });

  // Contact form submission
  if (contactForm) {
    contactForm.addEventListener("submit", handleFormSubmit);
  }

  // Update active nav link on scroll
  window.addEventListener("scroll", updateActiveNavLink);
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize theme
  initTheme();

  // Initialize event listeners
  initEventListeners();

  // Initialize skill bar animations
  if (skillProgressBars.length > 0) {
    initSkillBarObserver();
  }

  // Add scroll animations for elements
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(
      ".section-title, .project-card, .skill-category, .about-image-container"
    );

    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.2;

      if (elementPosition < screenPosition) {
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }
    });
  };

  // Set initial state for animated elements
  const animatedElements = document.querySelectorAll(
    ".section-title, .project-card, .skill-category, .about-image-container"
  );
  animatedElements.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(30px)";
    element.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  });

  // Trigger animation on scroll
  window.addEventListener("scroll", animateOnScroll);

  // Trigger once on load
  animateOnScroll();
});

// Handle page load animations
window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.5s ease";

  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 100);
});
