const sectionPost = document.getElementById("post_collection");

// State management for infinite scroll
let currentPage = 1;
let isLoading = false;
let hasMorePosts = true;
const pageSize = 10;
let currentSearchTerm = "";

/**
 * Initialize wall with first page of posts
 */
function initializeWall() {
  loadPosts(1, "", false);
  setupInfiniteScroll();
  initializeSearch();
}

/**
 * Load posts with pagination and search
 * @param {number} page - Page number
 * @param {string} searchTerm - Search term
 * @param {boolean} append - Whether to append or replace content
 */
function loadPosts(page, searchTerm, append) {
  if (isLoading) return;
  
  isLoading = true;
  if (append) {
    showSpinner();
  }

  getPost({ page, size: pageSize, searchTerm }, function (result) {
    const { posts, hasMore } = result;

    if (!append && sectionPost) {
      sectionPost.innerHTML = "";
    }

    // Render posts
    for (const jsonPost of posts) {
      const post = new Post(jsonPost);
      const nodo = post.getNode();
      if (sectionPost) {
        sectionPost.append(nodo);
      }
    }

    // Update state
    hasMorePosts = hasMore;
    currentPage = page;
    currentSearchTerm = searchTerm;
    isLoading = false;

    // Initialize like buttons after rendering
    if (typeof initializeLikeButtons === "function") {
      initializeLikeButtons();
    }

    hideSpinner();

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
      if (entries[0].isIntersecting && hasMorePosts && !isLoading) {
        loadPosts(currentPage + 1, currentSearchTerm, true);
      }
    },
    {
      rootMargin: "100px",
    }
  );
}

/**
 * Observes the last post element for infinite scroll
 */
function observeLastElement() {
  if (!scrollObserver) return;

  const allPosts = document.querySelectorAll(".post");
  if (allPosts.length > 0) {
    const lastPost = allPosts[allPosts.length - 1];
    scrollObserver.observe(lastPost);
  }
}

// ====================================================================
// SEARCH FUNCTIONALITY
// ====================================================================

/**
 * Initialize search functionality
 */
function initializeSearch() {
  const searchForm = document.querySelector(".search-form");
  const searchInput = document.querySelector(".search-input");

  if (!searchForm || !searchInput) {
    return;
  }

  // Prevent default form submission
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const query = searchInput.value.trim();
    // Reset pagination and load first page with search
    currentPage = 1;
    hasMorePosts = true;
    loadPosts(1, query, false);
  });

  // Optional: Real-time search with debounce
  let searchTimeout;
  searchInput.addEventListener("input", function () {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const query = this.value.trim();
      currentPage = 1;
      hasMorePosts = true;
      loadPosts(1, query, false);
    }, 500);
  });
}
document.addEventListener("click", function(e) {
    const isBtn = e.target.classList.contains("menu-btn");

    // Cerrar todos los menús
    document.querySelectorAll(".dropdown-menu").forEach(menu => {
        menu.style.display = "none";
    });

    // Si clickeaste el botón...
    if (isBtn) {
        const container = e.target.closest(".post-menu-container");
        const menu = container.querySelector(".dropdown-menu");
        menu.style.display = "flex";
        e.stopPropagation();
    }
});


// Initialize wall when DOM is ready (only if post_collection exists)
if (sectionPost) {
  initializeWall();
}
