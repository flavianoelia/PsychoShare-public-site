// ====================================================================
// PROFILE - Load and display user profile
// ====================================================================

/**
 * Load user profile and display data
 */
function loadUserProfile() {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Usuario no identificado. Inicia sesión nuevamente.",
    }).then(() => {
      window.location.href = "index.html";
    });
    return;
  }

  // Get user profile data
  getUserProfile(userId, function (result) {
    if (result.success && result.data) {
      const user = result.data;
      
      // Update profile info elements
      const profileName = document.querySelector(".profile-info-bar .user-info-text .name");
      
      if (profileName) {
        profileName.textContent = `${user.name} ${user.lastName}`;
      }

      // Update header avatar
      const headerAvatar = document.querySelector(".action-buttons .contact-photo");
      
      // Load avatar
      getUserAvatar(userId, function (avatarResult) {
        if (avatarResult.success && avatarResult.data && avatarResult.data.url) {
          // Set avatar image
          const profileAvatar = document.querySelector(".profile-info-bar img");
          if (profileAvatar) {
            profileAvatar.src = avatarResult.data.url;
          }
          if (headerAvatar) {
            headerAvatar.src = avatarResult.data.url;
          }
        } else {
          // Use FontAwesome icon as fallback
          const profileAvatarContainer = document.querySelector(".profile-info-bar .left-info");
          if (profileAvatarContainer) {
            const existingImg = profileAvatarContainer.querySelector("img");
            if (existingImg) {
              existingImg.outerHTML = '<i class="fa-solid fa-circle-user contact-avatar-icon"></i>';
            }
          }
          if (headerAvatar) {
            headerAvatar.outerHTML = '<i class="fa-solid fa-circle-user contact-photo"></i>';
          }
        }
      });
      
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al cargar perfil",
        text: result.message || "No se pudo cargar la información del perfil",
      });
    }
  });
}

// Load profile on page load
document.addEventListener("DOMContentLoaded", function () {
  loadUserProfile();
});
