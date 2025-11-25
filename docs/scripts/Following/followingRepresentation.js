// ====================================================================
// CONTACTS PRESENTATION - Render contacts to DOM with Infinite Scroll
// ====================================================================

/**
 * Cache for following IDs (Set for O(1) lookup)
 * null = not loaded yet
 */
let followingCache = null;

/**
 * Pagination state
 */
let currentPage = 1;
let isLoading = false;
let hasMoreUsers = true;
const pageSize = 10;
let currentSearchQuery = "";

/**
 * Creates the following and suggestions sections
 * @param {HTMLElement} container - The main container element
 */
function createSections(container) {
  container.innerHTML = `
    <div id="following-section" class="contacts-section"></div>
    <div id="suggestions-divider" class="suggestions-divider">
      <h3>Sugerencias</h3>
    </div>
    <div id="suggestions-section" class="contacts-section"></div>
  `;
}

/**
 * Toggles the visibility of the suggestions divider
 */
function toggleSuggestionsDivider() {
  const suggestionsSection = document.getElementById("suggestions-section");
  const suggestionsDivider = document.getElementById("suggestions-divider");
  
  if (suggestionsSection && suggestionsDivider) {
    const hasSuggestions = suggestionsSection.children.length > 0;
    if (hasSuggestions) {
      suggestionsDivider.classList.add("visible");
    } else {
      suggestionsDivider.classList.remove("visible");
    }
  }
}

/**
 * Moves a user card from following to suggestions
 * @param {number} userId - The ID of the user to move
 */
function moveToSuggestions(userId) {
  const followingSection = document.getElementById("following-section");
  const suggestionsSection = document.getElementById("suggestions-section");
  
  if (!followingSection || !suggestionsSection) return;
  
  const userCard = followingSection.querySelector(`[data-user-id="${userId}"]`);
  if (userCard) {
    suggestionsSection.prepend(userCard); // Add to top of suggestions
    toggleSuggestionsDivider();
  }
}

/**
 * Moves a user card from suggestions to following
 * @param {number} userId - The ID of the user to move
 */
function moveToFollowing(userId) {
  const followingSection = document.getElementById("following-section");
  const suggestionsSection = document.getElementById("suggestions-section");
  
  if (!followingSection || !suggestionsSection) return;
  
  const userCard = suggestionsSection.querySelector(`[data-user-id="${userId}"]`);
  if (userCard) {
    followingSection.append(userCard); // Add to bottom of following
    toggleSuggestionsDivider();
  }
}

/**
 * Initializes the contacts page
 */
function initializeContacts() {
  // First, load the following IDs cache
  getMyFollowingIds(function (result) {
    if (result.success) {
      followingCache = new Set(result.data);
    } else {
      console.error("Failed to load following IDs, using empty cache");
      followingCache = new Set();
    }

    // Load first page of users
    loadUsers(1, "");
  });

  // Setup infinite scroll observer
  setupInfiniteScroll();
}

/**
 * Loads a page of users
 * @param {number} page - Page number to load
 * @param {string} searchQuery - Optional search term
 * @param {boolean} append - If true, appends to existing list. If false, replaces list
 */
function loadUsers(page, searchQuery, append = false) {
  if (isLoading) return;

  isLoading = true;

  // Show spinner only when appending (page 2+), not on first load
  if (append) {
    showSpinner();
  }

  getAllUsers({ page, size: pageSize, searchQuery }, function (result) {
    const { users, hasMore, totalCount } = result;
      const currentUserId = parseInt(localStorage.getItem("userId"));

      // Filter out current user
      const filteredUsers = users.filter((user) => user.id !== currentUserId);

    // Clear or append
    const sectionFollowing = document.getElementById("following_collection");
    if (!sectionFollowing) {
      console.error("Element #following_collection not found");
      hideSpinner();
      isLoading = false;
      return;
    }

    if (!append) {
      sectionFollowing.innerHTML = "";
      // Create sections for following and suggestions
      createSections(sectionFollowing);
    }

    // Separate users into following and not following
    const followingUsers = [];
    const suggestedUsers = [];

    for (const userData of filteredUsers) {
      const isFollowing = followingCache.has(userData.id);
      if (isFollowing) {
        followingUsers.push(userData);
      } else {
        suggestedUsers.push(userData);
      }
    }

    // Render following users first
    let followingCount = 0;
    const followingSection = document.getElementById("following-section");
    const suggestionsSection = document.getElementById("suggestions-section");

    if (!followingSection || !suggestionsSection) {
      console.error("Sections not found, falling back to default render");
      hideSpinner();
      isLoading = false;
      return;
    }

    for (const userData of followingUsers) {
      const following = new Following(userData);
      const node = following.getNode();
      node.dataset.userId = userData.id; // Add data attribute for easier manipulation
      followingSection.append(node);

      const button = node.querySelector(".unfollow-btn");
      if (button) {
        button.textContent = "Dejar de seguir";
        button.classList.add("following");
        followingCount++;
      }
    }

    // Render suggested users
    for (const userData of suggestedUsers) {
      const following = new Following(userData);
      const node = following.getNode();
      node.dataset.userId = userData.id; // Add data attribute for easier manipulation
      suggestionsSection.append(node);

      const button = node.querySelector(".unfollow-btn");
      if (button) {
        button.textContent = "Seguir";
        button.classList.remove("following");
      }
    }

    // Show/hide suggestions divider based on whether there are suggestions
    toggleSuggestionsDivider();

    // Update state
    hasMoreUsers = hasMore;
    currentPage = page;
    currentSearchQuery = searchQuery;

    // Add event listeners
    attachUnfollowListeners();

    // Update counter (only on first page or when not appending)
    if (!append) {
      updateContactsCount(filteredUsers.length, followingCount);
    } else {
      // When appending, recalculate total count
      const allCards = document.querySelectorAll(".following-card");
      const followingButtons = document.querySelectorAll(
        ".unfollow-btn.following"
      );
      updateContactsCount(allCards.length, followingButtons.length);
    }

    hideSpinner();
    isLoading = false;

    // Re-observe last element for infinite scroll
    observeLastElement();
  });
}

/**
 * Shows loading spinner
 */
function showSpinner() {
  const spinner = document.getElementById("loading-spinner");
  if (spinner) {
    spinner.classList.add("active");
  }
}

/**
 * Hides loading spinner
 */
function hideSpinner() {
  const spinner = document.getElementById("loading-spinner");
  if (spinner) {
    spinner.classList.remove("active");
  }
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
      const contactName =
        contactCard.querySelector(".contact-name").textContent;
      const isCurrentlyFollowing = this.classList.contains("following");

      if (isCurrentlyFollowing) {
        // User wants to UNFOLLOW
        Swal.fire({
          title: "¿Estás seguro?",
          text: `¿Querés dejar de seguir a ${contactName}?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#b48d92",
          cancelButtonColor: "#6c757d",
          confirmButtonText: "Sí, dejar de seguir",
          cancelButtonText: "Cancelar",
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
      // Update cache: add new following
      if (followingCache) {
        followingCache.add(userId);
      }

      button.textContent = "Dejar de seguir";
      button.classList.add("following");

      // Move user card from suggestions to following
      moveToFollowing(userId);

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
        icon: "success",
        title: "Éxito",
        text: "¡Ahora estás siguiendo a este usuario!",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          result.message || "No se pudo seguir al usuario. Intentá nuevamente.",
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
      // Update cache: remove from following
      if (followingCache) {
        followingCache.delete(userId);
      }

      button.textContent = "Seguir";
      button.classList.remove("following");

      // Move user card from following to suggestions
      moveToSuggestions(userId);

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
        icon: "success",
        title: "Listo",
        text: "Dejaste de seguir a este usuario",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: result.message || "No se pudo dejar de seguir al usuario.",
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

// ====================================================================
// INFINITE SCROLL
// ====================================================================

let scrollObserver = null;

/**
 * Sets up IntersectionObserver for infinite scroll
 */
function setupInfiniteScroll() {
  scrollObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMoreUsers && !isLoading) {
        // Load next page
        loadUsers(currentPage + 1, currentSearchQuery, true);
      }
    },
    {
      rootMargin: "100px", // Start loading 100px before reaching the end
    }
  );
}

/**
 * Observes the last element in the list for infinite scroll
 */
function observeLastElement() {
  if (!scrollObserver) return;

  // Unobserve previous element
  const allCards = document.querySelectorAll(".following-card");
  if (allCards.length > 0) {
    const lastCard = allCards[allCards.length - 1];
    scrollObserver.observe(lastCard);
  }
}

// ====================================================================
// SEARCH FUNCTIONALITY
// ====================================================================

/**
 * Attaches search functionality to the search form
 */
function initializeSearch() {
  const searchForm = document.querySelector(".search-form");
  const searchInput = document.querySelector(".search-input");

  if (!searchForm || !searchInput) {
    console.warn("Search form or input not found");
    return;
  }

  // Prevent default form submission
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const query = searchInput.value.trim();
    // Reset pagination and load first page with search
    currentPage = 1;
    hasMoreUsers = true;
    loadUsers(1, query, false);
  });

  // Optional: Search on input (real-time search with debounce)
  let searchTimeout;
  searchInput.addEventListener("input", function () {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const query = this.value.trim();
      // Reset pagination and load first page with search
      currentPage = 1;
      hasMoreUsers = true;
      loadUsers(1, query, false);
    }, 500); // Wait 500ms after user stops typing
  });
}

// ====================================================================
// INITIALIZATION
// ====================================================================

// Initialize contacts page when DOM is ready
initializeContacts();
initializeSearch();
