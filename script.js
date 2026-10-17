/* WHERE ART MEETS DESIGN — beginner-friendly interactions */
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("artModal");
  const modalImage = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalDescription = document.getElementById("modalDescription");
  const modalPlaceholder = document.getElementById("modalPlaceholder");
  const modalClose = document.getElementById("modalClose");
  const menuToggle = document.getElementById("menuToggle");
  const siteNav = document.getElementById("siteNav");
  let lastFocusedElement = null;

  // Show a helpful placeholder instead of a broken-image icon.
  document.querySelectorAll(".art-image-button img").forEach((img) => {
    const button = img.closest(".art-image-button");
    const markMissing = () => {
      button.classList.add("is-missing");
      img.setAttribute("aria-hidden", "true");
    };
    img.addEventListener("error", markMissing);
    // Handles images that failed before this listener was attached.
    if (img.complete && img.naturalWidth === 0) markMissing();
  });

  // Open every artwork in the same accessible, full-image viewer.
  document.querySelectorAll("[data-artwork] .art-image-button, [data-feature-image]").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest("[data-artwork]");
      const imagePath = button.dataset.image || card?.dataset.image || button.querySelector("img")?.getAttribute("src") || "";
      const title = button.dataset.title || card?.dataset.title || "Artwork";
      const description = button.dataset.description || card?.dataset.description || "";
      const sourceImage = button.querySelector("img");
      const isMissing = button.classList.contains("is-missing") || (sourceImage && sourceImage.naturalWidth === 0);

      lastFocusedElement = document.activeElement;
      modalTitle.textContent = title;
      modalDescription.textContent = description;
      modalImage.alt = title;
      modalImage.hidden = isMissing;
      modalPlaceholder.hidden = !isMissing;
      modalImage.src = isMissing ? "" : imagePath;
      modalImage.onerror = () => {
        modalImage.hidden = true;
        modalPlaceholder.hidden = false;
      };
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      modalClose.focus();
    });
  });

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    modalImage.removeAttribute("src");
    if (lastFocusedElement) lastFocusedElement.focus();
  }
  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });

  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    menuToggle.textContent = isOpen ? "×" : "☰";
  });
  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      menuToggle.textContent = "☰";
    });
  });


  // Feedback form: gives on-page confirmation only; it does not transmit or save data.
  const feedbackForm = document.getElementById("feedbackForm");
  const feedbackResponse = document.getElementById("feedbackResponse");
  const visitorFeedback = document.getElementById("visitorFeedback");
  const characterCount = document.getElementById("characterCount");

  if (visitorFeedback && characterCount) {
    visitorFeedback.addEventListener("input", () => {
      characterCount.textContent = `${visitorFeedback.value.length} / 500`;
    });
  }

  if (feedbackForm && feedbackResponse) {
    feedbackForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const selectedRating = feedbackForm.querySelector('input[name="rating"]:checked');
      if (!selectedRating) {
        feedbackResponse.hidden = false;
        feedbackResponse.textContent = "Please choose a rating before sending your feedback.";
        return;
      }
      const favorite = document.getElementById("favoriteArtwork").value;
      feedbackResponse.hidden = false;
      feedbackResponse.textContent = `Thank you for visiting! Your ${selectedRating.value}/5 rating${favorite ? ` and note about “${favorite}”` : ""} has been received for this demo. Responses are not saved or sent anywhere.`;
      feedbackForm.reset();
      if (characterCount) characterCount.textContent = "0 / 500";
    });
  }

  document.getElementById("year").textContent = new Date().getFullYear();
});
