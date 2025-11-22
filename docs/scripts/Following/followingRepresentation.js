// ====================================================================
// CONTACTS PRESENTATION - Render contacts to DOM
// ====================================================================

/**
 * Fetches and renders all contacts for the current user
 * Uses Following class for HTML generation
 */
function renderContacts() {
  getContacts(undefined, function (contacts) {
    const sectionFollowing = document.getElementById("following_collection");

    if (!sectionFollowing) {
      console.error("Element #following_collection not found");
      return;
    }

    sectionFollowing.innerHTML = "";

    // Render each contact using Following class
    for (const contactData of contacts) {
      const following = new Following(contactData);
      const node = following.getNode();
      sectionFollowing.append(node);
    }

    // Add event listeners to unfollow buttons
    attachUnfollowListeners();

    // Update contacts count dynamically
    updateContactsCount(contacts.length);
  });
}

/**
 * Attaches click event listeners to all unfollow buttons
 */
function attachUnfollowListeners() {
  const unfollowButtons = document.querySelectorAll(".unfollow-btn");

  unfollowButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const userId = parseInt(this.getAttribute("data-user-id"));
      const contactCard = this.closest(".following-card");
      const contactName =
        contactCard.querySelector(".contact-name").textContent;

      if (
        confirm(`¿Estás seguro de que querés dejar de seguir a ${contactName}?`)
      ) {
        handleUnfollow(userId, contactCard);
      }
    });
  });
}

/**
 * Handles the unfollow action
 * @param {number} userId - The ID of the user to unfollow
 * @param {HTMLElement} contactCard - The card element to remove from DOM
 */
function handleUnfollow(userId, contactCard) {
  unfollowUser(userId, function (success) {
    if (success) {
      // Remove card from DOM with animation
      contactCard.style.opacity = "0";
      setTimeout(() => {
        contactCard.remove();
        // Re-render to update count
        renderContacts();
      }, 300);
    } else {
      alert("Error al dejar de seguir. Intentá nuevamente.");
    }
  });
}

/**
 * Updates the contacts counter in the UI
 * @param {number} count - Number of contacts to display
 */
function updateContactsCount(count) {
  const countElem = document.querySelector(".contacts-count");
  if (countElem) {
    countElem.textContent = count + (count === 1 ? " Contacto" : " Contactos");
  }
}

// Initialize: Render contacts when page loads
renderContacts();
