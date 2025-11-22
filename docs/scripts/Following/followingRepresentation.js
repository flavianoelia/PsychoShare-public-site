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
      // Prevent race condition: disable button if request is in progress
      if (this.disabled) {
        return;
      }

      const userId = parseInt(this.getAttribute("data-user-id"));
      const contactCard = this.closest(".following-card");
      const contactName =
        contactCard.querySelector(".contact-name").textContent;

      Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Querés dejar de seguir a ${contactName}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#b48d92',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, dejar de seguir',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.disabled = true; // Disable button during request
          handleUnfollow(userId, contactCard, this);
        }
      });
    });
  });
}

/**
 * Handles the unfollow action
 * @param {number} userId - The ID of the user to unfollow
 * @param {HTMLElement} contactCard - The card element to remove from DOM
 * @param {HTMLElement} button - The unfollow button to re-enable on error
 */
function handleUnfollow(userId, contactCard, button) {
  unfollowUser(userId, function (result) {
    if (result.success) {
      // Remove card from DOM with animation
      contactCard.style.opacity = "0";
      setTimeout(() => {
        contactCard.remove();
        // Update count directly without re-rendering everything
        const countElem = document.querySelector(".contacts-count");
        if (countElem) {
          const match = countElem.textContent.match(/^(\d+)/);
          const currentCount = match ? parseInt(match[1]) : 0;
          updateContactsCount(Math.max(0, currentCount - 1));
        }
      }, 300);
    } else {
      // Re-enable button on error
      if (button) {
        button.disabled = false;
      }
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: result.message || "Error al dejar de seguir. Intentá nuevamente."
      });
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
