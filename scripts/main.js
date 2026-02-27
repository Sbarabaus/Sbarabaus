(function () {
      const servicesSection = document.getElementById("servizi");
      const serviceCards = servicesSection
        ? servicesSection.querySelectorAll(".service-card")
        : [];

      if (!servicesSection || serviceCards.length === 0) return;

      if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        serviceCards.forEach(function (card) {
          card.classList.add("is-in-view");
        });
        return;
      }

      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;

            serviceCards.forEach(function (card, index) {
              setTimeout(function () {
                card.classList.add("is-in-view");
              }, index * 170);
            });

            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -50% 0px",
        }
      );

      observer.observe(servicesSection);
    })();

    (function () {
      const portfolioSection = document.getElementById("portfolio");
      const nextSection = document.getElementById("paneblog");
      const portfolioCards = portfolioSection
        ? portfolioSection.querySelectorAll(".portfolio-item")
        : [];

      if (!portfolioSection || !nextSection || portfolioCards.length === 0) return;

      if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        portfolioCards.forEach(function (card) {
          card.classList.add("is-in-view");
        });
        return;
      }

      portfolioCards.forEach(function (card, index) {
        card.style.transitionDelay = String(index * 0.08) + "s";
      });

      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("is-in-view");
            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.15,
          rootMargin: "0px 0px -50% 0px",
        }
      );

      portfolioCards.forEach(function (card) {
        observer.observe(card);
      });
    })();

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
    })();


    (function () {
      const revealTitles = document.querySelectorAll(".section-title-reveal");
      if (!revealTitles.length) return;

      if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        revealTitles.forEach(function (title) {
          title.classList.add("is-in-view");
        });
        return;
      }

      let lastScrollY = window.scrollY;

      const observer = new IntersectionObserver(
        function (entries) {
          const currentScrollY = window.scrollY;
          const isScrollingUp = currentScrollY < lastScrollY;
          lastScrollY = currentScrollY;

          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in-view");
              return;
            }

            if (isScrollingUp) {
              entry.target.classList.remove("is-in-view");
            }
          });
        },
        {
          threshold: 0.01,
          rootMargin: "-35% 0px -35% 0px",
        }
      );

      revealTitles.forEach(function (title) {
        observer.observe(title);
      });
    })();
    (function () {
      const typingText = document.getElementById("typing-text");
      if (!typingText) return;

      const words = (typingText.dataset.words || "")
        .split("|")
        .map((word) => word.trim())
        .filter(Boolean);

      if (words.length === 0) return;

      let wordIndex = 0;
      let charIndex = 0;
      let isDeleting = false;
      let currentColor = "#009FE3";

      const palette = ["#009FE3", "#B03D4F", "#995791", "#3394B2", "#30997B"];

      const typingSpeed = 90;
      const deletingSpeed = 55;
      const wordPause = 1200;
      const restartPause = 350;

      function animateTyping() {
        const currentWord = words[wordIndex];

        if (!isDeleting) {
          if (charIndex === 0) {
            currentColor = palette[Math.floor(Math.random() * palette.length)];
            typingText.style.color = currentColor;
          }

          charIndex += 1;
          typingText.textContent = currentWord.slice(0, charIndex).toUpperCase();

          if (charIndex === currentWord.length) {
            isDeleting = true;
            setTimeout(animateTyping, wordPause);
            return;
          }

          setTimeout(animateTyping, typingSpeed);
          return;
        }

        charIndex -= 1;
        typingText.textContent = currentWord.slice(0, Math.max(0, charIndex)).toUpperCase();

        if (charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          setTimeout(animateTyping, restartPause);
          return;
        }

        setTimeout(animateTyping, deletingSpeed);
      }

      typingText.textContent = "";
      setTimeout(animateTyping, 500);
    })();

    (function () {
      const messages = [
        {
          date: "15/01/2026",
          character: "Maya",
          avatar: "https://picsum.photos/seed/chat-persona-1/160/160",
          title: "Titolo del messaggio",
          text: "Aenean vel tortor aliquet, lobortis ligula a, tempus metus.",
        },
        {
          date: "22/01/2026",
          character: "Luca",
          avatar: "https://picsum.photos/seed/chat-persona-2/160/160",
          title: "Secondo messaggio",
          text: "Integer posuere erat a ante venenatis dapibus posuere velit aliquet.",
        },
        {
          date: "30/01/2026",
          character: "Nora",
          avatar: "https://picsum.photos/seed/chat-persona-3/160/160",
          title: "Terzo messaggio",
          text: "Donec sed odio dui. Cras mattis consectetur purus sit amet fermentum.",
        },
      ];

      const dateEl = document.getElementById("chatSliderDate");
      const titleEl = document.getElementById("chatSliderTitle");
      const textEl = document.getElementById("chatSliderText");
      const avatarImg = document.getElementById("chatSliderAvatarImg");
      const prevBtn = document.getElementById("chatSliderPrev");
      const nextBtn = document.getElementById("chatSliderNext");
      const dotsWrap = document.getElementById("chatSliderDots");
      const chatPop = document.querySelector(".chat-pop");

      if (
        !dateEl ||
        !titleEl ||
        !textEl ||
        !avatarImg ||
        !prevBtn ||
        !nextBtn ||
        !dotsWrap ||
        !chatPop ||
        messages.length === 0
      ) {
        return;
      }

      let activeIndex = 0;
      let autoplayTimer = null;

      function mod(index, length) {
        return ((index % length) + length) % length;
      }

      function restartAutoplay() {
        if (autoplayTimer) {
          clearInterval(autoplayTimer);
        }

        autoplayTimer = setInterval(function () {
          render(activeIndex + 1, false);
        }, 5000);
      }

      const dots = messages.map(function (_, index) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "chat-dot";
        dot.setAttribute("aria-label", "Vai al messaggio " + (index + 1));
        dot.addEventListener("click", function () {
          render(index, true);
        });
        dotsWrap.appendChild(dot);
        return dot;
      });

      function render(index, userInitiated) {
        activeIndex = mod(index, messages.length);
        const item = messages[activeIndex];

        dateEl.textContent = item.date;
        titleEl.textContent = item.title;
        textEl.textContent = item.text;
        avatarImg.src = item.avatar;
        avatarImg.alt = "Avatar di " + item.character;

        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === activeIndex);
        });

        if (userInitiated) {
          restartAutoplay();
        }
      }

      prevBtn.addEventListener("click", function () {
        render(activeIndex - 1, true);
      });

      nextBtn.addEventListener("click", function () {
        render(activeIndex + 1, true);
      });

      chatPop.addEventListener("mouseenter", function () {
        if (autoplayTimer) {
          clearInterval(autoplayTimer);
          autoplayTimer = null;
        }
      });

      chatPop.addEventListener("mouseleave", function () {
        restartAutoplay();
      });

      render(0, false);
      restartAutoplay();
    })();

    (function () {
      const originals = [
        {
          title: "Caramelle",
          image: "https://picsum.photos/seed/caramelle-fixed/1600/1000",
        },
        {
          title: "Marta e la morte",
          image: "https://picsum.photos/seed/marta-fixed/1600/1000",
        },
        {
          title: "#Nostoppignora",
          image: "https://picsum.photos/seed/nora-fixed/1600/1000",
        },
      ];

      const featuredCard = document.getElementById("originalFeaturedCard");
      const sideCard1 = document.getElementById("originalSideCard1");
      const sideCard2 = document.getElementById("originalSideCard2");
      const featuredTitle = document.getElementById("originalFeaturedTitle");
      const sideTitle1 = document.getElementById("originalSideTitle1");
      const sideTitle2 = document.getElementById("originalSideTitle2");
      const featuredBtn = document.getElementById("originalFeaturedBtn");
      const prevBtn = document.getElementById("originalsPrev");
      const nextBtn = document.getElementById("originalsNext");

      if (
        !featuredCard ||
        !sideCard1 ||
        !sideCard2 ||
        !featuredTitle ||
        !sideTitle1 ||
        !sideTitle2 ||
        !featuredBtn ||
        !prevBtn ||
        !nextBtn ||
        originals.length < 3
      ) {
        return;
      }

      let activeIndex = 0;

      function mod(index, length) {
        return ((index % length) + length) % length;
      }

      function setCard(cardEl, titleEl, item) {
        cardEl.style.backgroundImage = "url('" + item.image + "')";
        cardEl.setAttribute("aria-label", item.title);
        titleEl.textContent = item.title;
      }

      function renderOriginals() {
        [featuredCard, sideCard1, sideCard2].forEach(function (card) {
          card.classList.add("is-swapping");
        });

        const featured = originals[mod(activeIndex, originals.length)];
        const sideOne = originals[mod(activeIndex + 1, originals.length)];
        const sideTwo = originals[mod(activeIndex + 2, originals.length)];

        setCard(featuredCard, featuredTitle, featured);
        setCard(sideCard1, sideTitle1, sideOne);
        setCard(sideCard2, sideTitle2, sideTwo);
        featuredBtn.setAttribute("href", "#");

        requestAnimationFrame(function () {
          [featuredCard, sideCard1, sideCard2].forEach(function (card) {
            card.classList.remove("is-swapping");
          });
        });
      }

      prevBtn.addEventListener("click", function () {
        activeIndex = mod(activeIndex - 1, originals.length);
        renderOriginals();
      });

      nextBtn.addEventListener("click", function () {
        activeIndex = mod(activeIndex + 1, originals.length);
        renderOriginals();
      });

      renderOriginals();
    })();

