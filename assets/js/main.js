(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");
  var scrim = document.querySelector(".nav-scrim");

  function closeNav() {
    if (!nav) return;
    nav.classList.remove("is-open");
    if (scrim) scrim.classList.remove("is-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("nav-open");
  }

  function openNav() {
    if (!nav) return;
    nav.classList.add("is-open");
    if (scrim) scrim.classList.add("is-open");
    if (toggle) toggle.setAttribute("aria-expanded", "true");
    document.documentElement.classList.add("nav-open");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.contains("is-open");
      if (isOpen) { closeNav(); } else { openNav(); }
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
    if (scrim) scrim.addEventListener("click", closeNav);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Scroll-spy for in-page anchor nav
  var sections = Array.prototype.slice.call(document.querySelectorAll("main [id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".site-nav__links a[href*='#']"));
  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    var linkFor = function (id) {
      return navLinks.filter(function (a) {
        return a.getAttribute("href").indexOf("#" + id) !== -1;
      });
    };
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var links = linkFor(entry.target.id);
          if (!links.length) return;
          if (entry.isIntersecting) {
            navLinks.forEach(function (a) { a.classList.remove("is-active"); });
            links.forEach(function (a) { a.classList.add("is-active"); });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (s) { observer.observe(s); });
  }

  // Reveal-on-scroll
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (revealEls.length) {
    if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      var revealObserver = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      revealEls.forEach(function (el) { revealObserver.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    }
  }

  // Copy-to-clipboard fields (requisites/donate pages)
  document.querySelectorAll(".copy-field__btn").forEach(function (btn) {
    var input = btn.closest(".copy-field__row").querySelector(".copy-field__input");
    var defaultLabel = btn.querySelector("span").textContent;
    var copiedLabel = btn.getAttribute("data-copied-label") || defaultLabel;
    var resetTimer;

    btn.addEventListener("click", function () {
      var value = input.value;
      var done = function () {
        clearTimeout(resetTimer);
        btn.classList.add("is-copied");
        btn.querySelector("span").textContent = copiedLabel;
        resetTimer = setTimeout(function () {
          btn.classList.remove("is-copied");
          btn.querySelector("span").textContent = defaultLabel;
        }, 1800);
      };
      var legacyCopy = function () {
        try {
          input.select();
          document.execCommand("copy");
        } catch (e) {
          /* ignore — still show feedback below */
        }
        done();
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done, legacyCopy);
      } else {
        legacyCopy();
      }
    });
  });
})();
