document.addEventListener("DOMContentLoaded", () => {
  // Add a subtle entrance animation to major content blocks.
  document.querySelectorAll(".section-heading, .value-card, .tech-card, .review-card, .dish-card").forEach((el, index) => {
    el.classList.add("fade-up");
    el.style.animationDelay = `${Math.min(index % 4, 3) * 90}ms`;
  });

  // Close the mobile navigation after a navigation link is selected.
  document.querySelectorAll("#mainNavigation .nav-link").forEach(link => {
    link.addEventListener("click", () => {
      const nav = document.getElementById("mainNavigation");
      if (nav && nav.classList.contains("show") && window.bootstrap) {
        bootstrap.Collapse.getOrCreateInstance(nav).hide();
      }
    });
  });

  // Menu category filters and search work together.
  const filterButtons = document.querySelectorAll(".menu-filter");
  const menuSearch = document.getElementById("menuSearch");
  const menuEntries = [...document.querySelectorAll(".menu-entry")];
  const noResults = document.getElementById("noMenuResults");
  let activeCategory = "all";

  function updateMenu() {
    const query = (menuSearch?.value || "").trim().toLowerCase();
    let visibleCount = 0;
    menuEntries.forEach(entry => {
      const categoryMatch = activeCategory === "all" || entry.dataset.category === activeCategory;
      const textMatch = (entry.dataset.name || entry.textContent).toLowerCase().includes(query);
      const show = categoryMatch && textMatch;
      entry.classList.toggle("is-hidden", !show);
      if (show) visibleCount++;
    });
    if (noResults) noResults.classList.toggle("d-none", visibleCount !== 0);
  }

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.filter || "all";
      filterButtons.forEach(item => item.classList.toggle("active", item === button));
      updateMenu();
    });
  });
  menuSearch?.addEventListener("input", updateMenu);

  // Small toast helper used by demo forms.
  function showToast(message) {
    const toastElement = document.getElementById("siteToast");
    const messageElement = document.getElementById("toastMessage");
    if (!toastElement || !window.bootstrap) return;
    if (messageElement) messageElement.textContent = message;
    bootstrap.Toast.getOrCreateInstance(toastElement, { delay: 3500 }).show();
  }

  // Reservation request: front-end demo only; no real booking is transmitted.
  const reservationForm = document.getElementById("reservationForm");
  const bookingDate = document.getElementById("bookingDate");
  if (bookingDate) {
    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    bookingDate.min = localDate;
  }
  reservationForm?.addEventListener("submit", event => {
    event.preventDefault();
    if (!reservationForm.checkValidity()) {
      reservationForm.reportValidity();
      return;
    }
    const name = document.getElementById("guestName")?.value.trim() || "Guest";
    const date = document.getElementById("bookingDate")?.value || "";
    const time = document.getElementById("bookingTime")?.value || "";
    const guests = document.getElementById("guestCount")?.value || "";
    const summary = document.getElementById("bookingSummary");
    if (summary) summary.textContent = `${name}, your reservation request is prepared for ${guests} guest(s) on ${date} at ${time}. This demo has not sent the request to the restaurant.`;
    const modal = document.getElementById("bookingModal");
    if (modal && window.bootstrap) bootstrap.Modal.getOrCreateInstance(modal).show();
    reservationForm.reset();
  });

  // Contact form demo validation.
  document.getElementById("contactForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    form.reset();
    showToast("Thank you! Your demo message has been validated locally.");
  });

  // Add submitted sample feedback to the visible reviews list for this page session.
  document.getElementById("reviewForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const name = document.getElementById("reviewName").value.trim();
    const rating = Number(document.getElementById("reviewRating").value);
    const message = document.getElementById("reviewMessage").value.trim();
    const initials = name.split(/\s+/).slice(0, 2).map(part => part[0]?.toUpperCase() || "").join("");
    const stars = "★".repeat(Math.max(1, Math.min(5, rating)));
    const card = document.createElement("div");
    card.className = "col-md-6 col-lg-4";
    const article = document.createElement("article");
    article.className = "review-card fade-up";
    const starLine = document.createElement("div");
    starLine.className = "stars";
    starLine.textContent = stars;
    const quote = document.createElement("p");
    quote.textContent = `“${message}”`;
    const person = document.createElement("div");
    person.className = "review-person";
    const avatar = document.createElement("span");
    avatar.className = "avatar";
    avatar.textContent = initials;
    const details = document.createElement("div");
    const strong = document.createElement("strong");
    strong.textContent = name;
    const small = document.createElement("small");
    small.textContent = "Just shared";
    details.append(strong, small);
    person.append(avatar, details);
    article.append(starLine, quote, person);
    card.append(article);
    document.getElementById("reviewList")?.prepend(card);
    form.reset();
    showToast("Thank you for sharing your feedback!");
  });

  // Gallery image modal.
  const galleryModalElement = document.getElementById("galleryModal");
  const galleryModalImage = document.getElementById("galleryModalImage");
  document.querySelectorAll("[data-gallery]").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      if (!galleryModalElement || !galleryModalImage || !window.bootstrap) return;
      galleryModalImage.src = link.href;
      galleryModalImage.alt = link.querySelector("img")?.alt || "Gallery image";
      bootstrap.Modal.getOrCreateInstance(galleryModalElement).show();
    });
  });
});
