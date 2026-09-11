"use strict";

/* =========================================================
   ELEMENTOS
========================================================= */

const body = document.body;

const header = document.getElementById("site-header");
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const menuOverlay = document.getElementById("menu-overlay");
const menuClose = document.getElementById("menu-close");

const mobileLinks = document.querySelectorAll(".mobile-nav a");

const currentYear = document.getElementById("current-year");


/* =========================================================
   HEADER AO ROLAR
========================================================= */

function updateHeader() {
  if (!header) return;

  header.classList.toggle(
    "scrolled",
    window.scrollY > 20
  );
}

window.addEventListener(
  "scroll",
  updateHeader,
  { passive: true }
);

updateHeader();


/* =========================================================
   MENU MOBILE
========================================================= */

let menuWasOpen = false;
let lockedScrollY = 0;


function openMenu() {

  if (
    !menuToggle ||
    !mobileMenu ||
    !menuOverlay
  ) {
    return;
  }

  lockedScrollY = window.scrollY;
  menuWasOpen = true;

  mobileMenu.classList.add("active");
  menuOverlay.classList.add("active");

  menuToggle.setAttribute(
    "aria-expanded",
    "true"
  );

  menuToggle.setAttribute(
    "aria-label",
    "Fechar menu"
  );

  mobileMenu.setAttribute(
    "aria-hidden",
    "false"
  );

  menuOverlay.setAttribute(
    "aria-hidden",
    "false"
  );

  body.classList.add("menu-open");

  if (menuClose) {
    requestAnimationFrame(() => {
      menuClose.focus();
    });
  }
}


function closeMenu() {

  if (
    !menuToggle ||
    !mobileMenu ||
    !menuOverlay
  ) {
    return;
  }

  menuWasOpen = false;

  mobileMenu.classList.remove("active");
  menuOverlay.classList.remove("active");

  menuToggle.setAttribute(
    "aria-expanded",
    "false"
  );

  menuToggle.setAttribute(
    "aria-label",
    "Abrir menu"
  );

  mobileMenu.setAttribute(
    "aria-hidden",
    "true"
  );

  menuOverlay.setAttribute(
    "aria-hidden",
    "true"
  );

  body.classList.remove("menu-open");

  window.scrollTo({
    top: lockedScrollY,
    left: 0,
    behavior: "auto"
  });

  requestAnimationFrame(() => {
    menuToggle.focus();
  });
}


function toggleMenu() {

  if (menuWasOpen) {
    closeMenu();
  } else {
    openMenu();
  }

}


/* =========================================================
   EVENTOS DO MENU
========================================================= */

if (menuToggle) {
  menuToggle.addEventListener(
    "click",
    toggleMenu
  );
}

if (menuClose) {
  menuClose.addEventListener(
    "click",
    closeMenu
  );
}

if (menuOverlay) {
  menuOverlay.addEventListener(
    "click",
    closeMenu
  );
}


/* =========================================================
   LINKS DO MENU MOBILE
========================================================= */

mobileLinks.forEach(link => {

  link.addEventListener(
    "click",
    () => {
      closeMenu();
    }
  );

});


/* =========================================================
   ESC FECHA O MENU
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Escape" &&
      menuWasOpen
    ) {
      closeMenu();
    }

  }
);


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
  "resize",
  () => {

    if (
      window.innerWidth > 1000 &&
      menuWasOpen
    ) {
      closeMenu();
    }

  }
);


/* =========================================================
   NAVEGAÇÃO POR ÂNCORAS
========================================================= */

document.querySelectorAll(
  'a[href^="#"]'
).forEach(link => {

  link.addEventListener(
    "click",
    event => {

      const targetId =
        link.getAttribute("href");

      if (
        !targetId ||
        targetId === "#"
      ) {
        return;
      }

      const target =
        document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      closeMenu();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      history.pushState(
        null,
        "",
        targetId
      );

    }
  );

});


/* =========================================================
   RESTAURAÇÃO DE SCROLL
========================================================= */

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}


window.addEventListener(
  "load",
  () => {

    if (!window.location.hash) {

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto"
      });

    }

  }
);


/* =========================================================
   ANO DO FOOTER
========================================================= */

if (currentYear) {

  currentYear.textContent =
    new Date().getFullYear();

}


/* =========================================================
   REVELAÇÃO SUAVE AO ROLAR
========================================================= */

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (!prefersReducedMotion && "IntersectionObserver" in window) {

  const revealSelectors = [
    ".hero-content",
    ".hero-image-wrap",
    ".section-heading",
    ".credentials-row",
    ".method-grid",
    ".benefits-list",
    ".plans-grid",
    ".testimonial-grid",
    ".results-intro",
    ".results-list",
    ".faq-list"
  ].join(", ");

  const revealEls = document.querySelectorAll(revealSelectors);

  const observer = new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }

      });

    },
    {
      threshold: .14,
      rootMargin: "0px 0px -60px 0px"
    }
  );

  revealEls.forEach((el, index) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${(index % 3) * 70}ms`;
    observer.observe(el);
  });

}


/* =========================================================
   BARRA DE PROGRESSO DE SCROLL
========================================================= */

const scrollProgress = document.getElementById("scroll-progress");

function updateScrollProgress() {

  if (!scrollProgress) return;

  const scrollTop = window.scrollY;
  const docHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  const progress = docHeight > 0
    ? (scrollTop / docHeight) * 100
    : 0;

  scrollProgress.style.width = `${progress}%`;

}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();


/* =========================================================
   BOTÕES MAGNÉTICOS
========================================================= */

if (!prefersReducedMotion && window.matchMedia("(hover: hover)").matches) {

  document
    .querySelectorAll(".hero-actions .button, .contact-content .button")
    .forEach(button => {

      button.addEventListener("mousemove", event => {

        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;

        button.style.setProperty("--mx", `${x * .18}px`);
        button.style.setProperty("--my", `${y * .35}px`);

      });

      button.addEventListener("mouseleave", () => {
        button.style.setProperty("--mx", "0px");
        button.style.setProperty("--my", "0px");
      });

    });

}


/* =========================================================
   PARALLAX SUAVE — IMAGEM DO HERO
========================================================= */

const heroImage = document.querySelector(".hero-image");

if (heroImage && !prefersReducedMotion) {

  let ticking = false;

  function updateParallax() {

    const scrollTop = window.scrollY;
    const offset = Math.min(scrollTop * .08, 40);

    heroImage.style.transform = `translateY(${offset}px) scale(1.06)`;

    ticking = false;

  }

  window.addEventListener(
    "scroll",
    () => {

      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }

    },
    { passive: true }
  );

  updateParallax();

}

/* =========================================================
   VOLTAR AO TOPO
========================================================= */

const backToTop = document.getElementById("back-to-top");

if (backToTop) {

  window.addEventListener(
    "scroll",
    () => {
      backToTop.classList.toggle("visible", window.scrollY > 700);
    },
    { passive: true }
  );

  backToTop.addEventListener("click", () => {

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });

  });

}


/* =========================================================
   FORMULÁRIO DE CONTATO → WHATSAPP
========================================================= */

const contactForm = document.getElementById("contact-form");

/* SUBSTITUIR: número de WhatsApp com DDI (ex: 5511999999999) */
const CONTACT_WHATSAPP_NUMBER = "5500000000000";

if (contactForm) {

  contactForm.addEventListener("submit", event => {

    event.preventDefault();

    const nome = contactForm.nome.value.trim();
    const whatsapp = contactForm.whatsapp.value.trim();
    const objetivo = contactForm.objetivo.value;

    const mensagem =
      `Olá, Suellen! Meu nome é ${nome}. ` +
      `Tenho interesse em treinar e meu objetivo é: ${objetivo}. ` +
      `Meu WhatsApp: ${whatsapp}.`;

    const url =
      `https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;

    window.open(url, "_blank", "noopener");

  });

}
