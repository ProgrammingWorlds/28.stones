
"use strict";

/* =========================================
   28 STONES — WEBSITE CONFIGURATION
========================================= */

// Replace this with the real WhatsApp number.
// Use country code + number, digits only.
// Example format for Jordan: 9627XXXXXXXX
const WHATSAPP_NUMBER = "9627XXXXXXXX";

const INSTAGRAM_URL = "https://www.instagram.com/28.stones/";

/* =========================================
   ELEMENTS
========================================= */

const loader = document.getElementById("loader");
const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCount = document.getElementById("lightboxCount");

const videoModal = document.getElementById("videoModal");
const modalVideo = document.getElementById("modalVideo");

const imagePaths = Array.from(
  { length: 7 },
  (_, index) => `../Images/${index + 1}.png`
);

let currentImageIndex = 0;
let scrollTicking = false;

/* =========================================
   GENERAL HELPERS
========================================= */

function isMobile() {
  return window.matchMedia("(max-width: 640px)").matches;
}

function closeNavigation() {
  navigation.classList.remove("open");
  menuToggle.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
}

function lockScroll(locked) {
  document.body.classList.toggle("no-scroll", locked);
}

function setImage(index) {
  currentImageIndex =
    (index + imagePaths.length) % imagePaths.length;

  lightboxImage.src = imagePaths[currentImageIndex];
  lightboxCount.textContent =
    `${String(currentImageIndex + 1).padStart(2, "0")} / ` +
    `${String(imagePaths.length).padStart(2, "0")}`;
}

/* =========================================
   LOADER
========================================= */

function hideLoader() {
  if (!loader) return;

  if (window.gsap) {
    gsap.to(loader, {
      yPercent: -100,
      duration: 0.85,
      ease: "power3.inOut",
      delay: 0.15,
      onComplete: () => {
        loader.style.display = "none";
        initializeAnimations();
      }
    });
  } else {
    loader.style.display = "none";
    initializeAnimations();
  }
}

if (loader) {
  const loadingBar = loader.querySelector(".loader-line span");

  if (window.gsap && loadingBar) {
    gsap.to(loadingBar, {
      scaleX: 1,
      duration: 0.9,
      ease: "power2.inOut",
      onComplete: hideLoader
    });
  } else {
    window.addEventListener("load", hideLoader, { once: true });

    // Fallback in case an external animation library fails.
    window.setTimeout(hideLoader, 2500);
  }
}

/* =========================================
   HEADER SCROLL EFFECT
========================================= */

function updateHeader() {
  if (!header) return;

  header.classList.toggle("scrolled", window.scrollY > 60);
  scrollTicking = false;
}

window.addEventListener("scroll", () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(updateHeader);
    scrollTicking = true;
  }
}, { passive: true });

updateHeader();

/* =========================================
   MOBILE NAVIGATION
========================================= */

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");

    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navigation.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeNavigation);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeNavigation();
    }
  });

  window.addEventListener("resize", () => {
    if (!isMobile()) {
      closeNavigation();
    }
  });
}

/* =========================================
   INSTAGRAM & WHATSAPP LINKS
========================================= */

document.querySelectorAll(
  'a[href="https://www.instagram.com/28.stones/"]'
).forEach(link => {
  link.href = INSTAGRAM_URL;
});

const whatsappLink = document.getElementById("whatsappLink");

if (whatsappLink) {
  if (/^9627\d{8}$/.test(WHATSAPP_NUMBER)) {
    whatsappLink.href =
      `https://wa.me/${WHATSAPP_NUMBER}` +
      "?text=" +
      encodeURIComponent(
        "Hello 28 Stones! I would like to know more about your natural stone furniture collection."
      );
  } else {
    // Do not send visitors to a broken or invented number.
    whatsappLink.href = INSTAGRAM_URL;
    whatsappLink.addEventListener("click", event => {
      if (!/^9627\d{8}$/.test(WHATSAPP_NUMBER)) {
        event.preventDefault();
        window.open(INSTAGRAM_URL, "_blank", "noopener,noreferrer");
      }
    });
  }
}

/* =========================================
   IMAGE LIGHTBOX
========================================= */

function openLightbox(index) {
  setImage(index);
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  lockScroll(true);
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lockScroll(false);
}

document.querySelectorAll(".product-card").forEach(card => {
  card.addEventListener("click", () => {
    const index = Number(card.dataset.image) - 1;

    if (Number.isInteger(index) && index >= 0 && index < imagePaths.length) {
      openLightbox(index);
    }
  });
});

document.getElementById("lightboxClose")?.addEventListener(
  "click",
  closeLightbox
);

document.getElementById("lightboxPrev")?.addEventListener(
  "click",
  () => setImage(currentImageIndex - 1)
);

document.getElementById("lightboxNext")?.addEventListener(
  "click",
  () => setImage(currentImageIndex + 1)
);

lightbox?.addEventListener("click", event => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

/* =========================================
   VIDEO PREVIEWS & VIDEO MODAL
========================================= */

document.querySelectorAll(".film-card").forEach(card => {
  const preview = card.querySelector("video");

  if (preview) {
    card.addEventListener("mouseenter", () => {
      if (!isMobile()) {
        preview.play().catch(() => {});
      }
    });

    card.addEventListener("mouseleave", () => {
      preview.pause();

      try {
        preview.currentTime = 0;
      } catch (_) {
        // Metadata may not be loaded yet.
      }
    });
  }

  card.addEventListener("click", () => {
    const videoNumber = Number(card.dataset.video);

    if (!Number.isInteger(videoNumber) ||
        videoNumber < 1 ||
        videoNumber > 3) {
      return;
    }

    modalVideo.src = `../Videos/${videoNumber}.mp4`;
    modalVideo.muted = false;
    modalVideo.currentTime = 0;

    videoModal.classList.add("open");
    videoModal.setAttribute("aria-hidden", "false");
    lockScroll(true);

    modalVideo.play().catch(() => {
      // The user can press play manually if autoplay is blocked.
    });
  });
});

function closeVideoModal() {
  modalVideo.pause();
  modalVideo.removeAttribute("src");
  modalVideo.load();

  videoModal.classList.remove("open");
  videoModal.setAttribute("aria-hidden", "true");
  lockScroll(false);
}

document.getElementById("videoModalClose")?.addEventListener(
  "click",
  closeVideoModal
);

videoModal?.addEventListener("click", event => {
  if (event.target === videoModal) {
    closeVideoModal();
  }
});

/* =========================================
   KEYBOARD CONTROLS
========================================= */

document.addEventListener("keydown", event => {
  if (lightbox?.classList.contains("open")) {
    if (event.key === "ArrowRight") {
      setImage(currentImageIndex + 1);
    }

    if (event.key === "ArrowLeft") {
      setImage(currentImageIndex - 1);
    }

    if (event.key === "Escape") {
      closeLightbox();
    }
  }

  if (event.key === "Escape" &&
      videoModal?.classList.contains("open")) {
    closeVideoModal();
  }
});

/* =========================================
   GSAP ANIMATIONS
========================================= */

function initializeAnimations() {
  if (!window.gsap) {
    document.querySelectorAll(".reveal").forEach(element => {
      element.style.opacity = "1";
      element.style.transform = "none";
    });

    return;
  }

  if (window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reduceMotion) {
    gsap.set(".reveal", {
      opacity: 1,
      y: 0,
      clearProps: "transform"
    });

    gsap.set(".hero h1, .hero-eyebrow, .hero-bottom", {
      opacity: 1,
      y: 0
    });

    return;
  }

  // Hero entrance.
  const heroTimeline = gsap.timeline({
    defaults: { ease: "power3.out" }
  });

  heroTimeline
    .from(".hero-image", {
      scale: 1.17,
      duration: 1.8,
      ease: "power2.out"
    })
    .from(".hero-eyebrow", {
      y: 20,
      opacity: 0,
      duration: 0.7
    }, "-=1.1")
    .from(".hero h1", {
      y: 55,
      opacity: 0,
      duration: 1,
      stagger: 0.12
    }, "-=0.45")
    .from(".hero-bottom", {
      y: 20,
      opacity: 0,
      duration: 0.8
    }, "-=0.45")
    .from(".hero-topline", {
      opacity: 0,
      duration: 0.7
    }, "-=1");

  // Gentle parallax on the hero image.
  if (window.ScrollTrigger) {
    gsap.to(".hero-image", {
      yPercent: 12,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  }

  // Reveal content as the user scrolls.
  if (window.ScrollTrigger) {
    gsap.utils.toArray(".reveal").forEach(element => {
      gsap.fromTo(
        element,
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          ease: "power2.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            once: true
          }
        }
      );
    });
  } else {
    gsap.to(".reveal", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.08
    });
  }

  // Staggered collection entrance.
  if (window.ScrollTrigger) {
    gsap.from(".product-card", {
      y: 35,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".product-grid",
        start: "top 85%",
        once: true
      }
    });
  }

  // Cinematic appearance of the film gallery.
  if (window.ScrollTrigger) {
    gsap.from(".film-card", {
      y: 35,
      opacity: 0,
      duration: 0.85,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".film-grid",
        start: "top 85%",
        once: true
      }
    });
  }

  // Floating decorative 28 in the contact section.
  if (window.ScrollTrigger) {
    gsap.to(".contact-decoration", {
      y: -45,
      ease: "none",
      scrollTrigger: {
        trigger: ".contact",
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      }
    });
  }

  // Subtle 3D tilt for larger screens.
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".product-card").forEach(card => {
      const image = card.querySelector(".product-image img");

      if (!image) return;

      card.addEventListener("mousemove", event => {
        const rect = card.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        gsap.to(image, {
          rotateY: (x - 0.5) * 3,
          rotateX: (0.5 - y) * 3,
          duration: 0.4,
          ease: "power2.out",
          transformPerspective: 900,
          overwrite: true
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(image, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.5,
          ease: "power2.out",
          overwrite: true
        });
      });
    });
  }
}

/* =========================================
   FOOTER YEAR
========================================= */

const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

/* =========================================
   INITIAL HEADER STATE
========================================= */

if (document.readyState === "complete") {
  updateHeader();
} else {
  window.addEventListener("load", updateHeader, { once: true });
}
