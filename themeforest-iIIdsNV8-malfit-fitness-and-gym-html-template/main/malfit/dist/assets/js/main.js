"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector(".menu");
  const menuInner = menu?.querySelector(".menu-inner");
  const menuArrow = menu?.querySelector(".menu-arrow");
  const burger = document.querySelector(".burger");
  const overlay = document.querySelector(".overlay");
  const header = document.querySelector(".header");
  let subMenu = null;

  if (menu && menuInner && menuArrow && burger && overlay) {
    function toggleMenu() {
      menu.classList.toggle("is-active");
      overlay.classList.toggle("is-active");
    }

    function showSubMenu(children) {
      subMenu = children.querySelector(".submenu");
      if (!subMenu) {
        return;
      }

      subMenu.classList.add("is-active");
      subMenu.style.animation = "slideLeft 0.35s ease forwards";
      const menuTitle =
        children.querySelector("i")?.parentNode?.childNodes?.[0]?.textContent || "";
      menu.querySelector(".menu-title").textContent = menuTitle;
      menu.querySelector(".menu-header").classList.add("is-active");
    }

    function hideSubMenu() {
      if (!subMenu) {
        return;
      }

      subMenu.style.animation = "slideRight 0.35s ease forwards";
      setTimeout(() => {
        subMenu?.classList.remove("is-active");
      }, 300);

      menu.querySelector(".menu-title").textContent = "";
      menu.querySelector(".menu-header").classList.remove("is-active");
      subMenu = null;
    }

    function toggleSubMenu(event) {
      if (!menu.classList.contains("is-active")) {
        return;
      }

      const dropdown = event.target.closest(".menu-dropdown");
      if (dropdown) {
        showSubMenu(dropdown);
      }
    }

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 992 && menu.classList.contains("is-active")) {
        toggleMenu();
      }
    });

    burger.addEventListener("click", toggleMenu);
    overlay.addEventListener("click", toggleMenu);
    menuArrow.addEventListener("click", hideSubMenu);
    menuInner.addEventListener("click", toggleSubMenu);
  }

  if (header) {
    let lastScrollTop = 0;

    window.addEventListener("scroll", () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (window.innerWidth >= 992) {
        header.style.transform =
          scrollTop > lastScrollTop ? "translateY(-100%)" : "translateY(0)";
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
  }

  const progressBars = document.querySelectorAll(".progress-bar");
  if (progressBars.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const progressBar = entry.target;
            const targetValue = progressBar.getAttribute("data-progress");
            progressBar.style.width = `${targetValue}%`;
            observer.unobserve(progressBar);
          }
        });
      },
      { threshold: 0.3 }
    );

    progressBars.forEach((bar) => observer.observe(bar));
  }

  const navToggle = document.querySelector(".gym-nav-toggle");
  const navPanel = document.querySelector(".gym-nav-panel");
  if (navToggle && navPanel) {
    navToggle.addEventListener("click", () => {
      const isOpen = navPanel.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navPanel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navPanel.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (window.gsap && document.querySelectorAll(".containergsap").length > 0) {
    let activeImage;

    window.gsap.set(".containergsap .hover-reveal", {
      yPercent: -50,
      xPercent: -50,
    });

    window.gsap.utils.toArray(".containergsap").forEach((element) => {
      const image = element.querySelector(".hover-reveal");
      if (!image) {
        return;
      }

      let setX;
      let setY;

      const align = (event) => {
        setX?.(event.clientX);
        setY?.(event.clientY);
      };

      const startFollow = () => document.addEventListener("mousemove", align);
      const stopFollow = () => document.removeEventListener("mousemove", align);

      const fade = window.gsap.to(image, {
        autoAlpha: 1,
        ease: "none",
        paused: true,
        onReverseComplete: stopFollow,
      });

      const scaleTimeline = window.gsap.timeline({ paused: true });
      scaleTimeline.fromTo(
        image.querySelector(".hover-reveal__inner"),
        { scale: 0.3 },
        {
          ease: "Expo.easeOut",
          duration: 1,
          scale: 1,
        }
      );

      scaleTimeline.fromTo(
        image.querySelector(".hover-reveal__img"),
        { scale: 2.5 },
        {
          ease: "Expo.easeOut",
          duration: 1,
          scale: 1,
        },
        0
      );

      element.addEventListener("mouseenter", (event) => {
        fade.play();
        startFollow();

        if (activeImage) {
          window.gsap.set(image, {
            x: window.gsap.getProperty(activeImage, "x"),
            y: window.gsap.getProperty(activeImage, "y"),
          });
        }

        activeImage = image;
        setX = window.gsap.quickTo(image, "x", {
          duration: 3.25,
          ease: "expo.out",
        });
        setY = window.gsap.quickTo(image, "y", {
          duration: 3.25,
          ease: "expo.out",
        });
        align(event);
        scaleTimeline.play();
      });

      element.addEventListener("mouseleave", () => {
        fade.reverse();
        scaleTimeline.reverse();
      });
    });
  }

  document.querySelectorAll("[data-bmi-form]").forEach((form) => {
    const heightInput = form.querySelector("[data-bmi-height]");
    const weightInput = form.querySelector("[data-bmi-weight]");
    const resultOutput = form
      .closest(".grid")
      ?.querySelector("[data-bmi-result]");

    if (!heightInput || !weightInput || !resultOutput) {
      return;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const heightCm = Number.parseFloat(heightInput.value);
      const weightKg = Number.parseFloat(weightInput.value);

      if (!Number.isFinite(heightCm) || !Number.isFinite(weightKg) || heightCm <= 0 || weightKg <= 0) {
        resultOutput.textContent = "Please enter valid height and weight.";
        return;
      }

      const heightMeters = heightCm / 100;
      const bmi = weightKg / (heightMeters * heightMeters);
      let category = "Obese";

      if (bmi < 18.5) {
        category = "Underweight";
      } else if (bmi < 25) {
        category = "Normal weight";
      } else if (bmi < 30) {
        category = "Overweight";
      }

      resultOutput.textContent = `${bmi.toFixed(1)} (${category})`;
    });
  });
});
