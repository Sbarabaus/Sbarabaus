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

