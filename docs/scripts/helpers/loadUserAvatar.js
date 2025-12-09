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
  // Prefer using avatarRepository.getUserAvatar if available (centralized)
  if (typeof getUserAvatar === 'function') {
    try {
      getUserAvatar(userId, (res) => {
        debugger
        if (!res || !res.success) {
          // No avatar or error - show default icons
          if (headerProfileImg) headerProfileImg.outerHTML = '<i class="fa-solid fa-circle-user contact-photo"></i>';
          if (newPostAvatar) newPostAvatar.outerHTML = '<i class="fa-solid fa-circle-user contact-avatar-icon" id="new-post-avatar"></i>';
          return;
        }

        const data = res.data;
        if (data && data.url) {
          if (headerProfileImg) {
            if (headerProfileImg.tagName === 'I') {
              headerProfileImg.outerHTML = `<img src="${data.url}" alt="Foto de perfil" class="contact-photo">`;
            } else {
              headerProfileImg.src = data.url;
              headerProfileImg.onerror = function() { this.outerHTML = '<i class="fa-solid fa-circle-user contact-photo"></i>'; };
            }
          }

          if (newPostAvatar) {
            if (newPostAvatar.tagName === 'I') {
              newPostAvatar.outerHTML = `<img src="${data.url}" alt="Foto de perfil" id="new-post-avatar" class="contact-avatar">`;
            } else {
              newPostAvatar.src = data.url;
              newPostAvatar.onerror = function() { this.outerHTML = '<i class="fa-solid fa-circle-user contact-avatar-icon" id="new-post-avatar"></i>'; };
            }
          }
        } else {
          // No avatar
          if (headerProfileImg) headerProfileImg.outerHTML = '<i class="fa-solid fa-circle-user contact-photo"></i>';
          if (newPostAvatar) newPostAvatar.outerHTML = '<i class="fa-solid fa-circle-user contact-avatar-icon" id="new-post-avatar"></i>';
        }
      });
      return;
    } catch (e) {
      // Fall through to inline fetch fallback
      console.error('getUserAvatar threw', e);
    }
  }

  // Fallback: inline fetch (used if avatarRepository isn't loaded)
  const url = `${API_BASE_URL}/api/Avatar/${userId}`;

  fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        // If no avatar found (404), replace with icon
        if (response.status === 404) {
          if (headerProfileImg) {
            headerProfileImg.outerHTML = '<i class="fa-solid fa-circle-user contact-photo"></i>';
          }
          if (newPostAvatar) {
            newPostAvatar.outerHTML = '<i class="fa-solid fa-circle-user contact-avatar-icon" id="new-post-avatar"></i>';
          }
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
          // If it's an icon, replace with img tag
          if (headerProfileImg.tagName === 'I') {
            headerProfileImg.outerHTML = `<img src="${data.url}" alt="Foto de perfil" class="contact-photo">`;
          } else {
            headerProfileImg.src = data.url;
            headerProfileImg.onerror = function() {
              // If image fails to load, replace with icon
              this.outerHTML = '<i class="fa-solid fa-circle-user contact-photo"></i>';
            };
          }
        }
        if (newPostAvatar) {
          // If it's an icon, replace with img tag
          if (newPostAvatar.tagName === 'I') {
            newPostAvatar.outerHTML = `<img src="${data.url}" alt="Foto de perfil" id="new-post-avatar" class="contact-avatar">`;
          } else {
            newPostAvatar.src = data.url;
            newPostAvatar.onerror = function() {
              // If image fails to load, replace with icon
              this.outerHTML = '<i class="fa-solid fa-circle-user contact-avatar-icon" id="new-post-avatar"></i>';
            };
          }
        }
      }
    })
    .catch((error) => {
      console.error("Error loading user avatar:", error);
      // Replace with icon on error
      if (headerProfileImg) {
        headerProfileImg.outerHTML = '<i class="fa-solid fa-circle-user contact-photo"></i>';
      }
      if (newPostAvatar) {
        newPostAvatar.outerHTML = '<i class="fa-solid fa-circle-user contact-avatar-icon" id="new-post-avatar"></i>';
      }
    });
}

// Auto-load avatar when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadUserAvatar);
} else {
  loadUserAvatar();
}
