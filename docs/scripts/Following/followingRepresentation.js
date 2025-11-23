// ====================================================================
// CONTACTS PRESENTATION - Render contacts to DOM
// ====================================================================

/**
 * Fetches and renders ALL users (not just followed users)
 * This allows users to discover people to follow
 * @param {string} searchQuery - Optional search term to filter users
 */
function renderContacts(searchQuery) {
  getAllUsers(searchQuery, function (users) {
    const sectionFollowing = document.getElementById("following_collection");

    if (!sectionFollowing) {
      console.error("Element #following_collection not found");
      return;
    }

    sectionFollowing.innerHTML = "";

    const currentUserId = parseInt(localStorage.getItem("userId"));

    // Filter out current user from the list
    const filteredUsers = users.filter(user => user.id !== currentUserId);

    let followingCount = 0; // Counter for users we're following

    // Render each user using Following class
    for (const userData of filteredUsers) {
      const following = new Following(userData);
      const node = following.getNode();
      sectionFollowing.append(node);

      // Check if current user is following this user
      checkIsFollowing(userData.id, function(result) {
        if (result.success) {
          const button = node.querySelector('.unfollow-btn');
          if (button) {
            if (result.data) {
              button.textContent = 'Dejar de seguir';
              button.classList.add('following');
              followingCount++;
              // Update counter after checking each user
              updateContactsCount(filteredUsers.length, followingCount);
            } else {
              button.textContent = 'Seguir';
              button.classList.remove('following');
            }
          }
        }
      });
    }

    // Add event listeners to follow/unfollow buttons
    attachUnfollowListeners();

    // Initial update (will be updated again as checks complete)
    updateContactsCount(filteredUsers.length, 0);
  });
}

/**
 * Attaches click event listeners to all follow/unfollow buttons
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
      const contactName = contactCard.querySelector(".contact-name").textContent;
      const isCurrentlyFollowing = this.classList.contains('following');

      if (isCurrentlyFollowing) {
        // User wants to UNFOLLOW
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
            handleUnfollow(userId, this);
          }
        });
      } else {
        // User wants to FOLLOW
        this.disabled = true; // Disable button during request
        handleFollow(userId, this);
      }
    });
  });
}

/**
 * Handles the follow action
 * @param {number} userId - The ID of the user to follow
 * @param {HTMLElement} button - The follow button
 */
function handleFollow(userId, button) {
  followUser(userId, function (result) {
    button.disabled = false;
    
    if (result.success) {
      button.textContent = 'Dejar de seguir';
      button.classList.add('following');
      
      // Update counter: increment following count
      const countElem = document.querySelector(".contacts-count");
      if (countElem) {
        const match = countElem.textContent.match(/Siguiendo:\s*(\d+)/);
        if (match) {
          const currentFollowing = parseInt(match[1]);
          const totalMatch = countElem.textContent.match(/^(\d+)/);
          const total = totalMatch ? parseInt(totalMatch[1]) : 0;
          updateContactsCount(total, currentFollowing + 1);
        }
      }
      
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: '¡Ahora estás siguiendo a este usuario!',
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: result.message || 'No se pudo seguir al usuario. Intentá nuevamente.'
      });
    }
  });
}

/**
 * Handles the unfollow action
 * @param {number} userId - The ID of the user to unfollow
 * @param {HTMLElement} button - The unfollow button
 */
function handleUnfollow(userId, button) {
  unfollowUser(userId, function (result) {
    button.disabled = false;
    
    if (result.success) {
      button.textContent = 'Seguir';
      button.classList.remove('following');
      
      // Update counter: decrement following count
      const countElem = document.querySelector(".contacts-count");
      if (countElem) {
        const match = countElem.textContent.match(/Siguiendo:\s*(\d+)/);
        if (match) {
          const currentFollowing = parseInt(match[1]);
          const totalMatch = countElem.textContent.match(/^(\d+)/);
          const total = totalMatch ? parseInt(totalMatch[1]) : 0;
          updateContactsCount(total, Math.max(0, currentFollowing - 1));
        }
      }
      
      Swal.fire({
        icon: 'success',
        title: 'Listo',
        text: 'Dejaste de seguir a este usuario',
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: result.message || 'No se pudo dejar de seguir al usuario.'
      });
    }
  });
}

/**
 * Updates the contacts counter in the UI
 * @param {number} totalCount - Total number of users
 * @param {number} followingCount - Number of users being followed
 */
function updateContactsCount(totalCount, followingCount) {
  const countElem = document.querySelector(".contacts-count");
  if (countElem) {
    const totalText = totalCount === 1 ? "Usuario" : "Usuarios";
    countElem.textContent = `${totalCount} ${totalText} | Siguiendo: ${followingCount}`;
  }
}

// Initialize: Render contacts when page loads
renderContacts();

// ====================================================================
// SEARCH FUNCTIONALITY
// ====================================================================

/**
 * Attaches search functionality to the search form
 */
function initializeSearch() {
  const searchForm = document.querySelector('.search-form');
  const searchInput = document.querySelector('.search-input');

  if (!searchForm || !searchInput) {
    console.warn('Search form or input not found');
    return;
  }

  // Prevent default form submission
  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const query = searchInput.value.trim();
    renderContacts(query);
  });

  // Optional: Search on input (real-time search)
  let searchTimeout;
  searchInput.addEventListener('input', function() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const query = this.value.trim();
      renderContacts(query);
    }, 500); // Wait 500ms after user stops typing
  });
}

// Initialize search when page loads
initializeSearch();
