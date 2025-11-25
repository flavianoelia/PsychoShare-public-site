// ====================================================================
// PROFILE PRESENTATION - UI logic for profile page
// ====================================================================

// Global state for profile page
let profileCurrentPage = 1;
const profilePageSize = 10;
let profileIsLoading = false;
let profileHasMorePosts = true;
let profileCurrentUserId = null; // The profile owner's ID (can be different from logged user)

/**
 * Initialize modal for post creation
 */
function initializePostModal() {
    const elements = document.querySelectorAll('.post-input, .image-button, .attach-button');
    elements.forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            openPostCreationModal();
        });
    });
}

/**
 * Load posts from a specific user
 * @param {number} page - Page number to load
 * @param {boolean} append - If true, append to existing posts, otherwise replace
 */
function loadUserPosts(page = 1, append = false) {
  if (profileIsLoading || (!profileHasMorePosts && page > 1)) return;

  profileIsLoading = true;
  const loadingIndicator = document.getElementById("loading-indicator");
  if (loadingIndicator) loadingIndicator.style.display = "block";

  // Get userId from URL parameter or use logged user
  const urlParams = new URLSearchParams(window.location.search);
  const profileUserId = urlParams.get('userId') || localStorage.getItem('userId');
  
  if (!profileUserId) {
    console.error("No user ID found");
    profileIsLoading = false;
    if (loadingIndicator) loadingIndicator.style.display = "none";
    return;
  }

  profileCurrentUserId = profileUserId;

  getUserPosts(profileUserId, page, profilePageSize, function (result) {
    profileIsLoading = false;
    if (loadingIndicator) loadingIndicator.style.display = "none";

    if (!result.success) {
      console.error("Error loading user posts:", result.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: result.message || "Error al cargar las publicaciones",
      });
      return;
    }

    const posts = result.data || [];
    profileHasMorePosts = posts.length === profilePageSize;

    // Render posts
    const container = document.querySelector("main");
    if (!container) {
      console.error("Main container not found");
      return;
    }

    // Find existing articles to append after them or clear if not appending
    const existingArticles = container.querySelectorAll("article.article");
    
    if (!append && existingArticles.length > 0) {
      // Remove all existing posts except the new post form
      existingArticles.forEach(article => article.remove());
    }

    // Get the last element (after which we'll insert posts)
    const newPostForm = container.querySelector(".new-post-form");
    const insertAfter = newPostForm || container.firstElementChild;

    posts.forEach((postData) => {
      const postObj = new Post(postData);
      const postElement = postObj.getNode();
      
      if (insertAfter && insertAfter.nextSibling) {
        container.insertBefore(postElement, insertAfter.nextSibling);
      } else {
        container.appendChild(postElement);
      }
    });

    // Initialize like buttons for new posts
    if (typeof initializeLikeButtons === "function") {
      initializeLikeButtons();
    }

    // Initialize follow handlers
    if (typeof initializeFollowButtons === "function") {
      initializeFollowButtons();
    }
  });
}

/**
 * Load user profile information
 */
function loadUserProfile() {
  const urlParams = new URLSearchParams(window.location.search);
  const profileUserId = urlParams.get('userId') || localStorage.getItem('userId');

  if (!profileUserId) {
    console.error("No user ID found");
    return;
  }

  getUserProfile(profileUserId, function(result) {
    if (!result.success) {
      console.error("Error loading profile:", result.message);
      return;
    }

    const user = result.data;
    
    // Update profile information in the UI
    const userNameElement = document.querySelector('.user-name');
    if (userNameElement && user.name && user.lastName) {
      userNameElement.textContent = `${user.name} ${user.lastName}`;
    }

    // Load and update avatar
    const token = localStorage.getItem("token");
    const avatarUrl = `http://localhost:5174/api/Avatar/${profileUserId}`;
    
    fetch(avatarUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return null;
      })
      .then((data) => {
        if (data && data.url) {
          // Update profile avatar
          const profileAvatar = document.getElementById('profile-avatar');
          if (profileAvatar) {
            profileAvatar.src = data.url;
            profileAvatar.onerror = function() {
              this.src = "assets/imgwebp/flavia.webp";
            };
          }
          
          // Update new post form avatar
          const newPostAvatar = document.getElementById('new-post-avatar-profile');
          if (newPostAvatar) {
            newPostAvatar.src = data.url;
            newPostAvatar.onerror = function() {
              this.src = "assets/imgwebp/flavia.webp";
            };
          }
        }
      })
      .catch((error) => {
        console.error("Error loading avatar:", error);
      });

    // You can add more profile info updates here (bio, stats, etc.)
  });
}

/**
 * Initialize infinite scroll
 */
function initializeInfiniteScroll() {
  window.addEventListener("scroll", () => {
    if (profileIsLoading || !profileHasMorePosts) return;

    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.documentElement.scrollHeight - 500;

    if (scrollPosition >= threshold) {
      profileCurrentPage++;
      loadUserPosts(profileCurrentPage, true);
    }
  });
}

/**
 * Initialize page
 */
function initializePage() {
  initializePostModal();
  loadUserProfile();
  loadUserPosts(1, false);
  initializeInfiniteScroll();
}

// Start when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializePage);
} else {
  initializePage();
}