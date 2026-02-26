(function () {
  const menuBtn = document.querySelector(".menu-trigger");
  const overlay = document.getElementById("menuOverlay");
  const closeBtn = document.getElementById("menuOverlayClose");
  const menuLinks = overlay ? overlay.querySelectorAll(".menu-overlay-link") : [];
  const subMenuLinks = overlay ? overlay.querySelectorAll(".menu-submenu-link") : [];
  const hoverBubble = document.getElementById("menuHoverBubble");

  if (!menuBtn || !overlay || !closeBtn) return;

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

  const handledItems = new WeakSet();

  menuLinks.forEach(function (link) {
    const item = link.closest(".menu-item");

    if (item && !handledItems.has(item)) {
      item.addEventListener("mouseenter", function () {
        showBubbleForLink(link);
      });
      item.addEventListener("mouseleave", hideBubble);
      handledItems.add(item);
    } else if (!item) {
      link.addEventListener("mouseenter", function () {
        showBubbleForLink(link);
      });
      link.addEventListener("mouseleave", hideBubble);
    }

    link.addEventListener("focus", function () {
      showBubbleForLink(link);
    });
    link.addEventListener("blur", hideBubble);
    link.addEventListener("click", closeMenu);
  });

  subMenuLinks.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && overlay.classList.contains("is-open")) {
      closeMenu();
    }
  });
})();
