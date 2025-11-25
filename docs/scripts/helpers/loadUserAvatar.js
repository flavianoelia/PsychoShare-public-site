// ====================================================================
// LOAD USER AVATAR - Loads the logged-in user's avatar in the header
// ====================================================================

/**
 * Loads and displays the current user's avatar in the header and new post form
 * Should be called on every page that has the header with user photo
 */
function loadUserAvatar() {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  if (!userId || !token) {
    console.warn("User not logged in, cannot load avatar");
    return;
  }

  // Find all elements that should display user avatar
  const headerProfileImg = document.querySelector(".action-buttons .contact-photo");
  const newPostAvatar = document.getElementById("new-post-avatar");
  
  if (!headerProfileImg && !newPostAvatar) {
    console.warn("No avatar elements found");
    return;
  }

  // Fetch user's avatar from backend
  const url = `http://localhost:5174/api/Avatar/${userId}`;

  fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        // If no avatar found (404), use default
        if (response.status === 404) {
          if (headerProfileImg) headerProfileImg.src = "assets/imgwebp/flavia.webp";
          if (newPostAvatar) newPostAvatar.src = "assets/imgwebp/flavia.webp";
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data && data.url) {
        // Set the avatar URL for all elements
        if (headerProfileImg) {
          headerProfileImg.src = data.url;
          headerProfileImg.onerror = function() {
            this.src = "assets/imgwebp/flavia.webp";
          };
        }
        if (newPostAvatar) {
          newPostAvatar.src = data.url;
          newPostAvatar.onerror = function() {
            this.src = "assets/imgwebp/flavia.webp";
          };
        }
      }
    })
    .catch((error) => {
      console.error("Error loading user avatar:", error);
      // Use default image on error
      if (headerProfileImg) headerProfileImg.src = "assets/imgwebp/flavia.webp";
      if (newPostAvatar) newPostAvatar.src = "assets/imgwebp/flavia.webp";
    });
}

// Auto-load avatar when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadUserAvatar);
} else {
  loadUserAvatar();
}
