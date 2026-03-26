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
      .closest("[data-bmi-section]")
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

  document.querySelectorAll("[data-schedule-tabs]").forEach((tabGroup) => {
    const tabs = tabGroup.querySelectorAll("[data-schedule-tab]");

    const setActiveTab = (activeTab) => {
      tabs.forEach((tab) => {
        const isActive = tab === activeTab;
        tab.classList.toggle("bg-primary", isActive);
        tab.classList.toggle("text-nt30", true);
        tab.classList.toggle("bg-white", !isActive);
      });
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        setActiveTab(tab);
      });
    });
  });

  document.querySelectorAll("[data-contact-form]").forEach((form) => {
    const statusOutput = form.querySelector("[data-contact-status]");
    const submitButton = form.querySelector("[data-contact-submit]");

    if (!statusOutput || !submitButton) {
      return;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const payload = {
        name: String(formData.get("name") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        phone: String(formData.get("phone") || "").trim(),
        message: String(formData.get("message") || "").trim(),
      };

      if (!payload.name || !payload.email || !payload.phone || !payload.message) {
        statusOutput.textContent = "Please fill in all fields before submitting.";
        return;
      }

      submitButton.disabled = true;
      statusOutput.textContent = "Sending your request...";

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Unable to send your request right now.");
        }

        form.reset();
        statusOutput.textContent = "Thanks! Your joining request has been sent successfully.";
      } catch (error) {
        statusOutput.textContent =
          error instanceof Error ? error.message : "Something went wrong. Please try again.";
      } finally {
        submitButton.disabled = false;
      }
    });
  });

  function initializeChatWidget() {
    if (document.body?.dataset.chatWidgetReady === "true") {
      return;
    }

    document.body.dataset.chatWidgetReady = "true";

    const style = document.createElement("style");
    style.textContent = `
      .lr-chat-toggle {
        position: fixed;
        right: 22px;
        bottom: 22px;
        z-index: 1200;
        width: 64px;
        height: 64px;
        border: 0;
        border-radius: 999px;
        background: linear-gradient(135deg, #ff5b2e 0%, #ff8844 100%);
        color: #111111;
        box-shadow: 0 18px 45px rgba(0, 0, 0, 0.28);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .lr-chat-toggle:hover {
        transform: translateY(-2px);
        box-shadow: 0 22px 48px rgba(0, 0, 0, 0.32);
      }

      .lr-chat-panel {
        position: fixed;
        right: 22px;
        bottom: 98px;
        z-index: 1200;
        width: min(380px, calc(100vw - 24px));
        max-height: min(78vh, 720px);
        border-radius: 24px;
        overflow: hidden;
        background: #171515;
        color: #ffffff;
        box-shadow: 0 28px 90px rgba(0, 0, 0, 0.38);
        border: 1px solid rgba(255, 255, 255, 0.08);
        display: none;
        flex-direction: column;
      }

      .lr-chat-panel.is-open {
        display: flex;
      }

      .lr-chat-header {
        padding: 18px 18px 14px;
        background: linear-gradient(180deg, rgba(255, 91, 46, 0.18), rgba(23, 21, 21, 0.95));
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }

      .lr-chat-header h3,
      .lr-chat-header p {
        margin: 0;
      }

      .lr-chat-header h3 {
        font-size: 1.1rem;
        line-height: 1.2;
      }

      .lr-chat-header p,
      .lr-chat-chip,
      .lr-chat-hint,
      .lr-chat-status {
        color: rgba(255, 255, 255, 0.72);
      }

      .lr-chat-body {
        padding: 16px;
        overflow-y: auto;
        background:
          radial-gradient(circle at top right, rgba(255, 91, 46, 0.12), transparent 32%),
          linear-gradient(180deg, #171515 0%, #101010 100%);
        flex: 1;
      }

      .lr-chat-messages {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .lr-chat-message {
        max-width: 86%;
        padding: 12px 14px;
        border-radius: 18px;
        line-height: 1.5;
        font-size: 0.96rem;
        white-space: pre-wrap;
      }

      .lr-chat-message.user {
        align-self: flex-end;
        background: #ff5b2e;
        color: #141414;
        border-bottom-right-radius: 6px;
      }

      .lr-chat-message.assistant {
        align-self: flex-start;
        background: rgba(255, 255, 255, 0.08);
        color: #ffffff;
        border-bottom-left-radius: 6px;
      }

      .lr-chat-chip-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 12px;
      }

      .lr-chat-chip {
        border: 1px solid rgba(255, 255, 255, 0.14);
        background: rgba(255, 255, 255, 0.04);
        border-radius: 999px;
        padding: 8px 12px;
        font-size: 0.82rem;
        cursor: pointer;
      }

      .lr-chat-footer {
        padding: 14px 16px 16px;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(15, 15, 15, 0.96);
      }

      .lr-chat-form {
        display: grid;
        gap: 10px;
      }

      .lr-chat-input {
        resize: none;
        min-height: 88px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.05);
        color: #ffffff;
        padding: 14px;
        outline: none;
      }

      .lr-chat-input::placeholder {
        color: rgba(255, 255, 255, 0.45);
      }

      .lr-chat-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .lr-chat-submit {
        border: 0;
        border-radius: 999px;
        padding: 12px 18px;
        background: #ff5b2e;
        color: #131313;
        font-weight: 700;
        cursor: pointer;
      }

      .lr-chat-submit[disabled] {
        opacity: 0.65;
        cursor: not-allowed;
      }

      .lr-chat-status {
        min-height: 20px;
        font-size: 0.82rem;
      }

      @media (max-width: 640px) {
        .lr-chat-toggle {
          right: 14px;
          bottom: 14px;
          width: 58px;
          height: 58px;
        }

        .lr-chat-panel {
          right: 12px;
          left: 12px;
          bottom: 84px;
          width: auto;
        }
      }
    `;
    document.head.appendChild(style);

    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <button type="button" class="lr-chat-toggle" aria-expanded="false" aria-controls="lr-chat-panel" aria-label="Open chat assistant">
        <i class="ph-fill ph-chat-circle-dots" style="font-size: 1.7rem;"></i>
      </button>
      <section class="lr-chat-panel" id="lr-chat-panel" aria-label="Lifestyle Reset chat assistant">
        <div class="lr-chat-header">
          <h3>Lifestyle Reset Assistant</h3>
          <p>Ask about memberships, classes, timings, trainers, location, or how to get started.</p>
          <div class="lr-chat-chip-row">
            <button type="button" class="lr-chat-chip" data-chat-prompt="What classes do you offer?">Classes</button>
            <button type="button" class="lr-chat-chip" data-chat-prompt="Where are you located and how can I contact you?">Location</button>
            <button type="button" class="lr-chat-chip" data-chat-prompt="How can I join Lifestyle Reset?">Join</button>
          </div>
        </div>
        <div class="lr-chat-body">
          <div class="lr-chat-messages" data-chat-messages></div>
        </div>
        <div class="lr-chat-footer">
          <form class="lr-chat-form" data-chat-form>
            <textarea
              class="lr-chat-input"
              name="message"
              maxlength="800"
              placeholder="Type your message here..."
              required></textarea>
            <div class="lr-chat-actions">
              <span class="lr-chat-hint">Replies may take a few seconds.</span>
              <button type="submit" class="lr-chat-submit" data-chat-submit>Send</button>
            </div>
            <div class="lr-chat-status" data-chat-status></div>
          </form>
        </div>
      </section>
    `;

    document.body.appendChild(wrapper);

    const toggleButton = wrapper.querySelector(".lr-chat-toggle");
    const panel = wrapper.querySelector(".lr-chat-panel");
    const messagesElement = wrapper.querySelector("[data-chat-messages]");
    const form = wrapper.querySelector("[data-chat-form]");
    const input = form?.querySelector(".lr-chat-input");
    const submitButton = form?.querySelector("[data-chat-submit]");
    const statusOutput = form?.querySelector("[data-chat-status]");
    const promptButtons = wrapper.querySelectorAll("[data-chat-prompt]");

    if (!toggleButton || !panel || !messagesElement || !form || !input || !submitButton || !statusOutput) {
      return;
    }

    const conversation = [];

    const appendMessage = (role, content) => {
      const message = document.createElement("div");
      message.className = `lr-chat-message ${role}`;
      message.textContent = content;
      messagesElement.appendChild(message);
      messagesElement.scrollTop = messagesElement.scrollHeight;
      panel.querySelector(".lr-chat-body")?.scrollTo({
        top: messagesElement.scrollHeight,
        behavior: "smooth",
      });
    };

    const openPanel = () => {
      panel.classList.add("is-open");
      toggleButton.setAttribute("aria-expanded", "true");
    };

    const closePanel = () => {
      panel.classList.remove("is-open");
      toggleButton.setAttribute("aria-expanded", "false");
    };

    toggleButton.addEventListener("click", () => {
      if (panel.classList.contains("is-open")) {
        closePanel();
      } else {
        openPanel();
        input.focus();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && panel.classList.contains("is-open")) {
        closePanel();
      }
    });

    const seedAssistantMessage =
      "Hi, I’m the Lifestyle Reset assistant. I can help with classes, memberships, location, contact details, and joining guidance.";
    appendMessage("assistant", seedAssistantMessage);
    conversation.push({ role: "assistant", content: seedAssistantMessage });

    const sendMessage = async (messageText) => {
      const message = String(messageText || "").trim();
      if (!message) {
        return;
      }

      openPanel();
      appendMessage("user", message);
      conversation.push({ role: "user", content: message });

      submitButton.disabled = true;
      statusOutput.textContent = "Thinking...";

      try {
        const recentConversation = conversation.slice(-12);
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            history: recentConversation,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "The assistant is unavailable right now.");
        }

        const reply = String(result.message || "").trim() || "I’m here to help. Please try asking that another way.";
        appendMessage("assistant", reply);
        conversation.push({ role: "assistant", content: reply });
        statusOutput.textContent = "";
      } catch (error) {
        const fallbackMessage =
          error instanceof Error ? error.message : "Something went wrong while contacting the assistant.";
        statusOutput.textContent = fallbackMessage;
      } finally {
        submitButton.disabled = false;
      }
    };

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const value = input.value.trim();
      if (!value) {
        statusOutput.textContent = "Please enter a message first.";
        return;
      }

      input.value = "";
      await sendMessage(value);
      input.focus();
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        form.requestSubmit();
      }
    });

    promptButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        const prompt = button.getAttribute("data-chat-prompt") || "";
        await sendMessage(prompt);
      });
    });
  }

  initializeChatWidget();
});
