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

