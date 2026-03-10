(function () {
  const mount = document.querySelector("[data-menu-partial]");
  const menuFallbackHtml = `
<div id="menuOverlay" class="menu-overlay" aria-hidden="true">
  <button id="menuOverlayClose" class="menu-overlay-close" type="button" aria-label="Chiudi menu">&times;</button>
  <nav class="menu-overlay-nav" aria-label="Menu principale">
    <div class="menu-item">
      <a class="menu-overlay-link" href="studio.html" data-bubble="images/studio la nostra tana.png">Studio</a>
      <div class="menu-submenu" aria-label="Sottovoci Studio">
        <a class="menu-submenu-link" href="storia-di-unazienda-mutante.html">storia di un'azienda mutante</a>
        <a class="menu-submenu-link" href="i-panebarcos.html">i panebarcos</a>
        <a class="menu-submenu-link" href="ci-vediamo-agli-oscar.html">ci vediamo agli oscar</a>
      </div>
    </div>
    <div class="menu-item">
      <a class="menu-overlay-link" href="servizi.html" data-bubble="images/servizi cose.png">Servizi</a>
      <div class="menu-submenu" aria-label="Sottovoci Servizi">
        <a class="menu-submenu-link" href="commercials.html">commercials</a>
        <a class="menu-submenu-link" href="post-produzione.html">post-produzione</a>
        <a class="menu-submenu-link" href="service.html">service</a>
        <a class="menu-submenu-link" href="e-tanto-altro.html">...e tanto altro</a>
      </div>
    </div>
    <a class="menu-overlay-link" href="portfolio.html" data-bubble="images/portfolio cose belle.png">Portfolio</a>
    <a class="menu-overlay-link" href="originals.html" data-bubble="images/originals produzioni indipendenti.png">Originals</a>
    <a class="menu-overlay-link" href="paneblog.html" data-bubble="images/paneblog pensieri.png">Paneblog</a>
    <a class="menu-overlay-link" href="contatti.html" data-bubble="images/contatti raccontaci.png">Contatti</a>
    <div class="menu-lang" aria-label="Cambio lingua">
      <button class="menu-lang-btn" type="button" aria-label="Switch to English">
        <img src="images/inglese.png" alt="English">
      </button>
      <button class="menu-lang-btn" type="button" aria-label="Passa a italiano">
        <img src="images/italiano.png" alt="Italiano">
      </button>
    </div>
  </nav>
  <img id="menuHoverBubble" class="menu-hover-bubble" src="" alt="" aria-hidden="true">
  <img class="menu-overlay-team" src="images/panebarcos_skecth-team_light.png" alt="">
</div>
`;

  function initMenuOverlay() {
    const menuBtn = document.querySelector(".menu-trigger");
    const overlay = document.getElementById("menuOverlay");
    const closeBtn = document.getElementById("menuOverlayClose");
    const menuLinks = overlay ? overlay.querySelectorAll(".menu-overlay-link") : [];
    const subMenuLinks = overlay ? overlay.querySelectorAll(".menu-submenu-link") : [];
    const hoverBubble = document.getElementById("menuHoverBubble");

    if (!menuBtn || !overlay || !closeBtn) return;
    if (overlay.dataset.initialized === "true") return;

    overlay.dataset.initialized = "true";
    menuBtn.setAttribute("aria-expanded", "false");

    function openMenu() {
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      document.body.classList.add("menu-open");
      menuBtn.setAttribute("aria-expanded", "true");
      if (hoverBubble) {
        hoverBubble.classList.remove("is-visible");
        hoverBubble.src = "";
      }
    }

    function closeMenu() {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("menu-open");
      menuBtn.setAttribute("aria-expanded", "false");
      if (hoverBubble) {
        hoverBubble.classList.remove("is-visible");
        hoverBubble.src = "";
      }
    }

    function showBubbleForLink(link) {
      if (!hoverBubble) return;
      const src = link.dataset.bubble;
      if (!src) return;

      const linkRect = link.getBoundingClientRect();
      const overlayRect = overlay.getBoundingClientRect();
      const centerX = linkRect.left - overlayRect.left + linkRect.width / 2;
      const centerY = linkRect.top - overlayRect.top + linkRect.height / 2;

      hoverBubble.src = src;
      hoverBubble.alt = "Balloon " + link.textContent.trim();
      hoverBubble.style.setProperty("--bubble-x", centerX + "px");
      hoverBubble.style.setProperty("--bubble-y", centerY + "px");
      hoverBubble.classList.add("is-visible");
    }

    function hideBubble() {
      if (!hoverBubble) return;
      hoverBubble.classList.remove("is-visible");
    }

    menuBtn.addEventListener("click", function () {
      if (overlay.classList.contains("is-open")) {
        closeMenu();
        return;
      }

      openMenu();
    });

    closeBtn.addEventListener("click", closeMenu);

    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) {
        closeMenu();
      }
    });

        const parentLinkBySubmenu = new WeakMap();

    menuLinks.forEach(function (link) {
      const item = link.closest(".menu-item");
      const submenu = item ? item.querySelector(".menu-submenu") : null;

      link.addEventListener("mouseenter", function () {
        showBubbleForLink(link);
      });

      link.addEventListener("mouseleave", function () {
        if (!submenu || !submenu.matches(":hover")) {
          hideBubble();
        }
      });

      link.addEventListener("focus", function () {
        showBubbleForLink(link);
      });

      link.addEventListener("blur", function () {
        if (!submenu || !submenu.matches(":focus-within")) {
          hideBubble();
        }
      });

      link.addEventListener("click", closeMenu);

      if (submenu) {
        parentLinkBySubmenu.set(submenu, link);

        submenu.addEventListener("mouseenter", function () {
          showBubbleForLink(link);
        });

        submenu.addEventListener("mouseleave", function () {
          hideBubble();
        });
      }
    });

    subMenuLinks.forEach(function (link) {
      link.addEventListener("mouseenter", function () {
        const submenu = link.closest(".menu-submenu");
        const parentLink = submenu ? parentLinkBySubmenu.get(submenu) : null;
        if (parentLink) {
          showBubbleForLink(parentLink);
        }
      });

      link.addEventListener("focus", function () {
        const submenu = link.closest(".menu-submenu");
        const parentLink = submenu ? parentLinkBySubmenu.get(submenu) : null;
        if (parentLink) {
          showBubbleForLink(parentLink);
        }
      });

      link.addEventListener("click", closeMenu);
    });

    overlay.addEventListener("mouseleave", hideBubble);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && overlay.classList.contains("is-open")) {
        closeMenu();
      }
    });
  }

  if (!mount) {
    initMenuOverlay();
    return;
  }

  fetch(mount.dataset.menuPartial)
    .then(function (response) {
      if (!response.ok) throw new Error("Partial load failed");
      return response.text();
    })
    .then(function (html) {
      mount.outerHTML = html;
      initMenuOverlay();
    })
    .catch(function () {
      mount.outerHTML = menuFallbackHtml;
      initMenuOverlay();
    });
})();

(function () {
  const prevBtn = document.getElementById("studioTimelinePrev");
  const nextBtn = document.getElementById("studioTimelineNext");
  const imageEl = document.getElementById("studioTimelineImage");
  const titleEl = document.getElementById("studioTimelineTitle");
  const textEl = document.getElementById("studioTimelineText");

  if (!prevBtn || !nextBtn || !imageEl || !titleEl || !textEl) return;

  const studioTimelineSteps = [
    {
      year: "1965",
      yearImage: "https://dummyimage.com/1200x500/0b0f16/ffffff&text=1965",
      image: "https://picsum.photos/seed/studio-timeline-1965/900/600",
      title: "Le origini",
      text: "Daniele cresce tra fumetti e libri di avventura e capisce presto che raccontare storie è l'unica cosa che gli viene davvero naturale.",
    },
    {
      year: "1976",
      yearImage: "https://dummyimage.com/1200x500/0b0f16/ffffff&text=1976",
      image: "https://picsum.photos/seed/studio-timeline-1976/900/600",
      title: "Gli inizi",
      text: "Dopo anni di tentativi, rifiuti e porte chiuse, la sua prima storia a fumetti viene pubblicata sulla rivista Il Mago.",
    },
    {
      year: "1976-1995",
      yearImage: "https://dummyimage.com/1200x500/0b0f16/ffffff&text=1976-1995",
      image: "https://picsum.photos/seed/studio-timeline-1976-1995/900/600",
      title: "Tenacia e passione",
      text: "Per quasi vent'anni Daniele lavora come autore per le principali riviste italiane, mentre insieme a Lucia costruisce una famiglia numerosa.",
    },
    {
      year: "1995",
      yearImage: "https://dummyimage.com/1200x500/0b0f16/ffffff&text=1995",
      image: "https://picsum.photos/seed/studio-timeline-1995/900/600",
      title: "Dalla carta al digitale",
      text: "Una crisi personale e creativa lo porta a reinventarsi: nascono le storie interattive e multimediali e prende forma Panebarco & C.",
    },
    {
      year: "1995-2001",
      yearImage: "https://dummyimage.com/1200x500/0b0f16/ffffff&text=1995-2001",
      image: "https://picsum.photos/seed/studio-timeline-1995-2001/900/600",
      title: "L'era multimediale",
      text: "Panebarco realizza oltre quaranta titoli multimediali per DeAgostini, molti dei quali distribuiti anche all'estero.",
    },
    {
      year: "2001",
      yearImage: "https://dummyimage.com/1200x500/0b0f16/ffffff&text=2001",
      image: "https://picsum.photos/seed/studio-timeline-2001/900/600",
      title: "Un'altra crisi, un nuovo cambiamento",
      text: "Con il declino del mercato dei CD-ROM, l'azienda affronta una nuova svolta e si prepara a cambiare ancora.",
    },
    {
      year: "2002",
      yearImage: "https://dummyimage.com/1200x500/0b0f16/ffffff&text=2002",
      image: "https://picsum.photos/seed/studio-timeline-2002/900/600",
      title: "L'era del 3D in tempo reale",
      text: "Il linguaggio dei videogame viene applicato ai beni culturali, dando vita a ricostruzioni 3D immersive di musei e siti archeologici.",
    },
    {
      year: "2010",
      yearImage: "https://dummyimage.com/1200x500/0b0f16/ffffff&text=2010",
      image: "https://picsum.photos/seed/studio-timeline-2010/900/600",
      title: "L'era dei video",
      text: "La bottega si rinnova: le competenze di Daniele si intrecciano con quelle dei figli e Panebarco entra nel mondo dell'animazione e del video.",
    },
    {
      year: "Oggi",
      yearImage: "https://dummyimage.com/1200x500/0b0f16/ffffff&text=OGGI",
      image: "https://picsum.photos/seed/studio-timeline-oggi/900/600",
      title: "Una bottega di famiglia",
      text: "Marianna, Matteo e Camilla guidano lo studio tra cartoni animati, spot, VFX e post-produzione, mentre Daniele torna alla sua prima passione: i fumetti.",
    },
  ];

  let activeIndex = 0;

  function mod(index, length) {
    return ((index % length) + length) % length;
  }

  function render(index) {
    activeIndex = mod(index, studioTimelineSteps.length);
    const item = studioTimelineSteps[activeIndex];
    imageEl.src = item.yearImage;
    imageEl.alt = "Anno " + item.year;
    titleEl.textContent = item.title;
    textEl.textContent = item.text;
  }

  prevBtn.addEventListener("click", function () {
    render(activeIndex - 1);
  });

  nextBtn.addEventListener("click", function () {
    render(activeIndex + 1);
  });

  render(0);
})();

(function () {
  const bubbleBtn = document.getElementById("studioTeamBubble");
  const photoEl = document.getElementById("studioTeamPhotoImage");

  if (!bubbleBtn || !photoEl) return;

  const photoCycle = [
    "images/caramelle.jpg",
    "images/marta-e-la-morte.jpg",
    "images/nostoppingnora.jpg",
    "https://picsum.photos/seed/studio-team-1/1600/900",
    "https://picsum.photos/seed/studio-team-2/1600/900",
    "https://picsum.photos/seed/studio-team-3/1600/900",
    "https://picsum.photos/seed/studio-team-4/1600/900",
    "https://picsum.photos/seed/studio-team-5/1600/900",
  ];

  let currentIndex = 0;
  let intervalId = null;

  function showImage(index) {
    const safeIndex = ((index % photoCycle.length) + photoCycle.length) % photoCycle.length;
    currentIndex = safeIndex;
    photoEl.classList.add("is-switching");

    setTimeout(function () {
      photoEl.src = photoCycle[currentIndex];
      photoEl.classList.remove("is-switching");
    }, 170);
  }

  function startCycle() {
    if (intervalId) return;
    intervalId = setInterval(function () {
      showImage(currentIndex + 1);
    }, 1800);
  }

  bubbleBtn.addEventListener("click", function () {
    startCycle();
    showImage(currentIndex + 1);
  });
})();

(function () {
  const section = document.getElementById("mutanteScrollStory");
  const imageEl = document.getElementById("mutanteTimelineImage");
  const titleEl = document.getElementById("mutanteTimelineTitle");
  const textEl = document.getElementById("mutanteTimelineText");
  const progressEl = document.getElementById("mutanteTimelineProgress");

  if (!section || !imageEl || !titleEl || !textEl || !progressEl) return;

  const steps = [
    {
      year: "1965",
      image: "https://dummyimage.com/1200x500/0b0f16/ffffff&text=1965",
      title: "Le origini",
      text: "Daniele cresce tra fumetti e libri di avventura e capisce presto che raccontare storie e l'unica cosa che gli viene davvero naturale.",
    },
    {
      year: "1976",
      image: "https://dummyimage.com/1200x500/0b0f16/ffffff&text=1976",
      title: "Gli inizi",
      text: "Dopo anni di tentativi, rifiuti e porte chiuse, la sua prima storia a fumetti viene pubblicata sulla rivista Il Mago.",
    },
    {
      year: "1976-1995",
      image: "https://dummyimage.com/1200x500/0b0f16/ffffff&text=1976-1995",
      title: "Tenacia e passione",
      text: "Per quasi vent'anni Daniele lavora come autore per le principali riviste italiane, mentre insieme a Lucia costruisce una famiglia numerosa.",
    },
    {
      year: "1995",
      image: "https://dummyimage.com/1200x500/0b0f16/ffffff&text=1995",
      title: "Dalla carta al digitale",
      text: "Una crisi personale e creativa lo porta a reinventarsi: nascono le storie interattive e multimediali e prende forma Panebarco & C.",
    },
    {
      year: "1995-2001",
      image: "https://dummyimage.com/1200x500/0b0f16/ffffff&text=1995-2001",
      title: "L'era multimediale",
      text: "Panebarco realizza oltre quaranta titoli multimediali per DeAgostini, molti dei quali distribuiti anche all'estero.",
    },
    {
      year: "2001",
      image: "https://dummyimage.com/1200x500/0b0f16/ffffff&text=2001",
      title: "Un'altra crisi, un nuovo cambiamento",
      text: "Con il declino del mercato dei CD-ROM, l'azienda affronta una nuova svolta e si prepara a cambiare ancora.",
    },
    {
      year: "2002",
      image: "https://dummyimage.com/1200x500/0b0f16/ffffff&text=2002",
      title: "L'era del 3D in tempo reale",
      text: "Il linguaggio dei videogame viene applicato ai beni culturali, dando vita a ricostruzioni 3D immersive di musei e siti archeologici.",
    },
    {
      year: "2010",
      image: "https://dummyimage.com/1200x500/0b0f16/ffffff&text=2010",
      title: "L'era dei video",
      text: "La bottega si rinnova: le competenze di Daniele si intrecciano con quelle dei figli e Panebarco entra nel mondo dell'animazione e del video.",
    },
    {
      year: "OGGI",
      image: "https://dummyimage.com/1200x500/0b0f16/ffffff&text=OGGI",
      title: "Una bottega di famiglia",
      text: "Marianna, Matteo e Camilla guidano lo studio tra cartoni animati, spot, VFX e post-produzione, mentre Daniele torna alla sua prima passione: i fumetti.",
    },
  ];

  let index = 0;
  let transitionLock = false;
  let wheelBuffer = 0;
  let lastDirection = 0;

  function inActiveZone() {
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    return rect.top < vh * 0.45 && rect.bottom > vh * 0.55;
  }

  function render(active) {
    const item = steps[active];
    imageEl.src = item.image;
    imageEl.alt = "Anno " + item.year;
    titleEl.textContent = item.title;
    textEl.textContent = item.text;
    progressEl.innerHTML = "";
    steps.forEach(function (_, dotIndex) {
      const dot = document.createElement("span");
      dot.className = "mutante-scroll-dot" + (dotIndex === active ? " is-active" : "");
      progressEl.appendChild(dot);
    });
  }

  function move(direction) {
    if (transitionLock) return false;
    const next = index + direction;
    if (next < 0 || next > steps.length - 1) return false;
    transitionLock = true;
    index = next;
    render(index);
    setTimeout(function () {
      transitionLock = false;
    }, 360);
    return true;
  }

  section.addEventListener(
    "wheel",
    function (event) {
      if (!inActiveZone()) return;

      const direction = event.deltaY > 0 ? 1 : event.deltaY < 0 ? -1 : 0;
      if (!direction) return;

      const isForward = direction > 0;
      const canStep = isForward ? index < steps.length - 1 : index > 0;

      if (!canStep) {
        wheelBuffer = 0;
        lastDirection = direction;
        return;
      }

      event.preventDefault();

      if (transitionLock) return;

      if (lastDirection !== direction) {
        wheelBuffer = 0;
        lastDirection = direction;
      }

      wheelBuffer += event.deltaY;

      const threshold = 70;
      const reachedThreshold = direction > 0 ? wheelBuffer >= threshold : wheelBuffer <= -threshold;
      if (!reachedThreshold) return;

      wheelBuffer = 0;
      move(direction);
    },
    { passive: false }
  );

  window.addEventListener(
    "scroll",
    function () {
      if (!inActiveZone()) {
        wheelBuffer = 0;
        lastDirection = 0;
      }
    },
    { passive: true }
  );

  render(0);
})();

(function () {
  const section = document.querySelector(".panebarcos-team");
  const cards = section ? section.querySelectorAll(".panebarcos-motion-wrap") : [];

  if (!section || cards.length === 0) return;

  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  let ticking = false;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function renderMotion() {
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const progress = clamp((vh * 0.55 - rect.top) / (vh + rect.height), -1, 1);

    cards.forEach(function (card) {
      const depth = parseFloat(card.dataset.depth || "1");
      const dirX = parseFloat(card.dataset.dirX || "0");
      const dirY = parseFloat(card.dataset.dirY || "0");
      const x = progress * 28 * depth * dirX;
      const y = progress * 22 * depth * dirY;
      const r = progress * 4 * depth * dirX;
      card.style.transform = "translate3d(" + x.toFixed(2) + "px, " + y.toFixed(2) + "px, 0) rotate(" + r.toFixed(2) + "deg)";
    });

    ticking = false;
  }

  function requestRender() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(renderMotion);
  }

  renderMotion();
  window.addEventListener("scroll", requestRender, { passive: true });
  window.addEventListener("resize", requestRender);
})();

(function () {
  const cards = document.querySelectorAll(".commercials-portfolio-grid .portfolio-item");
  if (!cards.length) return;

  const tagsList = ["2D", "3D", "Regia", "Animazione", "VFX"];

  cards.forEach(function (card) {
    if (card.querySelector(".portfolio-tags") || card.querySelector(".portfolio-overlay")) return;

    const img = card.querySelector("img");
    const baseTitle = img && img.alt ? img.alt.replace(/\s+\d+$/, "") : "Progetto";

    const tags = document.createElement("div");
    tags.className = "portfolio-tags";
    tagsList.forEach(function (tagName) {
      const tag = document.createElement("span");
      tag.className = "portfolio-tag";
      tag.textContent = tagName;
      tags.appendChild(tag);
    });

    const overlay = document.createElement("div");
    overlay.className = "portfolio-overlay";

    const title = document.createElement("h3");
    title.textContent = baseTitle;

    const text = document.createElement("p");
    text.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi.";

    overlay.appendChild(title);
    overlay.appendChild(text);

    card.appendChild(tags);
    card.appendChild(overlay);
  });
})();

(function () {
  const grid = document.getElementById("portfolioCatalogGrid");
  const buttons = document.querySelectorAll(".portfolio-catalog-filters .portfolio-filter-btn");
  if (!grid || !buttons.length) return;

  const cards = grid.querySelectorAll(".portfolio-catalog-card");
  if (!cards.length) return;

  const state = {
    category: "all",
    type: "all",
  };

  function applyFilter() {
    cards.forEach(function (card) {
      const category = (card.dataset.category || "").toLowerCase();
      const type = (card.dataset.type || "").toLowerCase();

      const categoryMatch = state.category === "all" || category === state.category;
      const typeMatch = state.type === "all" || type === state.type;
      const visible = categoryMatch && typeMatch;
      card.classList.toggle("is-hidden", !visible);
    });
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const group = (btn.dataset.group || "").toLowerCase();
      const value = (btn.dataset.value || "all").toLowerCase();
      if (!group || !Object.prototype.hasOwnProperty.call(state, group)) return;

      buttons.forEach(function (x) {
        if ((x.dataset.group || "").toLowerCase() === group) {
          x.classList.toggle("is-active", x === btn);
        }
      });
      state[group] = value;
      applyFilter();
    });
  });

  applyFilter();
})();

(function () {
  const grid = document.getElementById("portfolioCatalogGrid");
  const viewButtons = document.querySelectorAll("[data-portfolio-view]");
  if (!grid || !viewButtons.length) return;

  function setView(view) {
    const safeView = view === "compact" ? "compact" : "large";
    grid.classList.remove("is-view-large", "is-view-compact");
    grid.classList.add("is-view-" + safeView);

    viewButtons.forEach(function (button) {
      const active = button.dataset.portfolioView === safeView;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  viewButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setView(button.dataset.portfolioView || "large");
    });
  });

  setView(grid.classList.contains("is-view-compact") ? "compact" : "large");
})();

(function () {
  const reveals = document.querySelectorAll(".commercials-title-reveal");
  if (!reveals.length) return;

  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  const revealBySection = new WeakMap();
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        const reveal = revealBySection.get(entry.target);
        if (!reveal) return;
        reveal.classList.toggle("is-visible", entry.isIntersecting);
      });
    },
    {
      threshold: 0,
      rootMargin: "0px 0px -25% 0px",
    }
  );

  reveals.forEach(function (reveal) {
    const section = reveal.closest("section");
    if (!section || revealBySection.has(section)) return;
    revealBySection.set(section, reveal);
    observer.observe(section);
  });
})();

(function () {
  const originalsScrollRoot = document.getElementById("originalsScrollBg");
  if (!originalsScrollRoot) return;

  let ticking = false;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function render() {
    const start = originalsScrollRoot.offsetTop;
    const end = Math.max(start + 1, originalsScrollRoot.offsetTop + originalsScrollRoot.offsetHeight - window.innerHeight);
    const progress = clamp((window.scrollY - start) / (end - start), 0, 1);
    const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    const bgLevel = Math.round(255 * (1 - eased));
    const fgLevel = Math.round(18 + (244 - 18) * eased);

    originalsScrollRoot.style.setProperty("--originals-bg-level", String(bgLevel));
    originalsScrollRoot.style.setProperty("--originals-fg-level", String(fgLevel));
    ticking = false;
  }

  function onScrollOrResize() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(render);
  }

  render();
  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize);
})();

(function () {
  const slider = document.getElementById("originalsPeekSlider");
  const prevBtn = document.getElementById("originalsSliderPrev");
  const nextBtn = document.getElementById("originalsSliderNext");
  if (!slider || !prevBtn || !nextBtn) return;

  function getScrollStep() {
    const firstSlide = slider.querySelector(".originals-slide");
    if (!firstSlide) return slider.clientWidth * 0.85;
    const gap = parseFloat(window.getComputedStyle(slider).columnGap || window.getComputedStyle(slider).gap || "0");
    return firstSlide.getBoundingClientRect().width + gap;
  }

  prevBtn.addEventListener("click", function () {
    slider.scrollBy({ left: -getScrollStep(), behavior: "smooth" });
  });

  nextBtn.addEventListener("click", function () {
    slider.scrollBy({ left: getScrollStep(), behavior: "smooth" });
  });
})();

