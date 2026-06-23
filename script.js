// Plato Trillion — site interactivity (shared across pages)

(function () {
  "use strict";

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      mobileNav.hidden = open;
      mobileNav.style.display = open ? "none" : "flex";
    });
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        mobileNav.hidden = true;
        mobileNav.style.display = "none";
      });
    });
  }

  /* ---------- Scroll-reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Current year (id or class) ---------- */
  var y = String(new Date().getFullYear());
  var yearById = document.getElementById("year");
  if (yearById) yearById.textContent = y;
  document.querySelectorAll(".year").forEach(function (el) { el.textContent = y; });

  /* ---------- Helpers ---------- */
  function setInvalid(field, isInvalid) {
    if (!field) return;
    field.classList.toggle("invalid", !!isInvalid);
  }
  function fieldOf(input) {
    return input.closest(".field");
  }
  var FREE_EMAIL = [
    "gmail.com", "googlemail.com", "yahoo.com", "ymail.com", "outlook.com",
    "hotmail.com", "live.com", "msn.com", "icloud.com", "me.com", "mac.com",
    "aol.com", "proton.me", "protonmail.com", "gmx.com", "mail.com",
    "zoho.com", "yandex.com", "hey.com"
  ];
  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function isWorkEmail(v) {
    if (!isEmail(v)) return false;
    var domain = v.split("@")[1].toLowerCase();
    return FREE_EMAIL.indexOf(domain) === -1;
  }

  /* ---------- No-op links (forgot password, etc.) ---------- */
  document.querySelectorAll("[data-noop]").forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); });
  });

  /* ---------- Login page ---------- */
  var loginForm = document.getElementById("login-form");
  if (loginForm) {
    var loginAlert = document.getElementById("login-alert");

    document.querySelectorAll(".sso-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (loginAlert) {
          loginAlert.textContent =
            "Single sign-on isn't available for this account yet. Please sign in with your email.";
          loginAlert.hidden = false;
        }
      });
    });

    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = loginForm.email;
      var password = loginForm.password;
      var ok = true;

      if (!isEmail(email.value.trim())) { setInvalid(fieldOf(email), true); ok = false; }
      else setInvalid(fieldOf(email), false);

      if (!password.value) { setInvalid(fieldOf(password), true); ok = false; }
      else setInvalid(fieldOf(password), false);

      if (!ok) { if (loginAlert) loginAlert.hidden = true; return; }

      // No real backend — simulate an auth attempt that fails.
      var submit = document.getElementById("login-submit");
      if (loginAlert) loginAlert.hidden = true;
      submit.disabled = true;
      submit.textContent = "Signing in…";
      window.setTimeout(function () {
        submit.disabled = false;
        submit.textContent = "Sign in";
        if (loginAlert) {
          loginAlert.textContent = "Incorrect email or password. Please try again.";
          loginAlert.hidden = false;
        }
      }, 900);
    });
  }

  /* ---------- Lead / qualification form ---------- */
  var leadForm = document.getElementById("lead-form");
  if (leadForm) {
    // Adapt the page to the CTA that brought the visitor here (?type=sales|demo)
    var params = new URLSearchParams(window.location.search);
    var type = (params.get("type") || params.get("intent") || "demo").toLowerCase();
    var isSales = type === "sales";

    if (isSales) {
      var set = function (id, txt) { var el = document.getElementById(id); if (el) el.textContent = txt; };
      set("form-eyebrow", "Talk to sales");
      set("form-title", "Let's talk about your deployment.");
      set("form-lead", "Tell us about your operation and our sales team will follow up with pricing and a rollout plan for your locations.");
      var submitBtn = document.getElementById("lead-submit");
      if (submitBtn) submitBtn.textContent = "Contact sales";
      var intent = document.getElementById("intent");
      if (intent) intent.value = "sales";
      document.title = "Talk to sales — Plato Trillion";
    }

    leadForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstInvalid = null;
      var ok = true;

      // Validate every required control
      leadForm.querySelectorAll("[required]").forEach(function (ctrl) {
        var valid = !!ctrl.value && ctrl.value.trim() !== "";
        if (ctrl.id === "email") valid = isWorkEmail(ctrl.value.trim());
        setInvalid(fieldOf(ctrl), !valid);
        if (!valid) { ok = false; if (!firstInvalid) firstInvalid = ctrl; }
      });

      if (!ok) { if (firstInvalid) firstInvalid.focus(); return; }

      // --- Qualification logic ---
      var data = {
        first: leadForm.first.value.trim(),
        intent: leadForm.intent.value,
        size: leadForm.size.value,
        sites: leadForm.sites.value,
        timeline: leadForm.timeline.value,
        industry: leadForm.industry.value
      };
      var manySites = ["6-25", "26-100", "100+"].indexOf(data.sites) !== -1;
      var bigCompany = ["51-200", "201-1000", "1000+"].indexOf(data.size) !== -1;
      var nearTerm = ["now", "quarter"].indexOf(data.timeline) !== -1;
      var qualified = manySites || bigCompany || nearTerm;

      var title, body;
      if (qualified) {
        title = data.intent === "sales"
          ? "Thanks — our sales team will reach out."
          : "You're a great fit. Let's get you a demo.";
        body =
          "Thanks, " + data.first + ". A Plato Trillion solutions specialist will be in touch " +
          "within one business day to plan a walkthrough tailored to your " + data.industry +
          " operation. Keep an eye on your inbox.";
      } else {
        title = "Thanks for reaching out!";
        body =
          "Thanks, " + data.first + ". Based on what you shared, we'll send over resources to help " +
          "you explore Plato Trillion at your own pace. When your rollout gets closer, we'd love to " +
          "set up a tailored demo.";
      }

      var result = document.getElementById("form-result");
      document.getElementById("result-title").textContent = title;
      document.getElementById("result-body").textContent = body;
      leadForm.hidden = true;
      result.hidden = false;
      result.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    // Clear the invalid state as the user fixes a field
    leadForm.querySelectorAll("input, select, textarea").forEach(function (ctrl) {
      ctrl.addEventListener("input", function () { setInvalid(fieldOf(ctrl), false); });
      ctrl.addEventListener("change", function () { setInvalid(fieldOf(ctrl), false); });
    });
  }
})();
