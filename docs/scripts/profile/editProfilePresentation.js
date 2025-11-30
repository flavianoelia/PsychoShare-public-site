// ====================================================================
// EDIT PROFILE PRESENTATION - Handle profile editing UI
// ====================================================================

// DOM elements
const nameInput = document.getElementById("name");
const lastnameInput = document.getElementById("lastname");
const emailInput = document.getElementById("email");
const photoProfileInput = document.getElementById("photo-profile");
const photoProfileIcon = document.querySelector(".update-photo-profile i");
const saveButton = document.querySelector(".save-button");
const deleteAccountButton = document.querySelector(".delete-button");

// Password change elements
const oldPasswordInput = document.getElementById("old-password");
const newPasswordInput = document.getElementById("new-password");
const repeatPasswordInput = document.getElementById("repeat-password");

// Loading state
let isLoading = false;

/**
 * Show loading spinner
 */
function showSpinner() {
  if (isLoading) return;
  isLoading = true;
  saveButton.classList.add("disabled");
  saveButton.textContent = "Guardando...";
}

/**
 * Hide loading spinner
 */
function hideSpinner() {
  isLoading = false;
  saveButton.classList.remove("disabled");
  saveButton.textContent = "Guardar Cambios";
}

/**
 * Load current user profile data
 */
function loadUserProfileForEdit() {
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

  getUserProfile(userId, function (result) {
    if (result.success && result.data) {
      const user = result.data;
      // Fill form with current data
      nameInput.value = user.name || "";
      lastnameInput.value = user.lastName || "";
      emailInput.value = user.email || "";
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: result.message || "No se pudo cargar los datos del perfil",
      });
    }
  });

  // Load avatar
  getUserAvatar(userId, function (result) {
    if (result.success && result.data && result.data.url) {
      // Replace icon with image
      photoProfileIcon.outerHTML = `<img src="${result.data.url}" alt="Avatar del usuario" class="contact-avatar">`;
    }
    // else: keep default FontAwesome icon
  });
}

/**
 * Handle avatar file selection and preview
 */
photoProfileInput.addEventListener("change", function (event) {
  const file = event.target.files[0];

  if (!file) return;

  // Validate size (2MB max)
  const maxSize = 2 * 1024 * 1024;
  if (file.size > maxSize) {
    Swal.fire({
      icon: "error",
      title: "Archivo muy grande",
      text: "El tamaño máximo permitido es 2MB",
    });
    photoProfileInput.value = ""; // Clear input
    return;
  }

  // Validate format
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!validTypes.includes(file.type)) {
    Swal.fire({
      icon: "error",
      title: "Formato no válido",
      text: "Solo se permiten imágenes JPG, PNG o WebP",
    });
    photoProfileInput.value = ""; // Clear input
    return;
  }

  // Preview image
  const reader = new FileReader();
  reader.onload = function (e) {
    const currentElement = document.querySelector(
      ".update-photo-profile i, .update-photo-profile .contact-avatar"
    );
    if (currentElement) {
      currentElement.outerHTML = `<img src="${e.target.result}" alt="Preview del avatar" class="contact-avatar">`;
    }
  };
  reader.readAsDataURL(file);
});

/**
 * Handle save changes
 */
saveButton.addEventListener("click", function (e) {
  e.preventDefault();

  if (isLoading) return;

  const userId = localStorage.getItem("userId");

  if (!userId) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Usuario no identificado",
    });
    return;
  }

  const name = nameInput.value.trim();
  const lastName = lastnameInput.value.trim();
  const email = emailInput.value.trim();

  // Validate inputs
  if (!name) {
    Swal.fire({
      icon: "warning",
      title: "Campo vacío",
      text: "El nombre es obligatorio",
    });
    nameInput.focus();
    return;
  }

  if (!validateName(name)) {
    Swal.fire({
      icon: "warning",
      title: "Nombre inválido",
      text: "El nombre debe tener entre 2 y 30 letras",
    });
    nameInput.focus();
    return;
  }

  if (!lastName) {
    Swal.fire({
      icon: "warning",
      title: "Campo vacío",
      text: "El apellido es obligatorio",
    });
    lastnameInput.focus();
    return;
  }

  if (!validateLastName(lastName)) {
    Swal.fire({
      icon: "warning",
      title: "Apellido inválido",
      text: "El apellido debe tener entre 2 y 30 letras",
    });
    lastnameInput.focus();
    return;
  }

  if (!email) {
    Swal.fire({
      icon: "warning",
      title: "Campo vacío",
      text: "El email es obligatorio",
    });
    emailInput.focus();
    return;
  }

  if (!validateEmail(email)) {
    Swal.fire({
      icon: "warning",
      title: "Email inválido",
      text: "Ingresa un email válido",
    });
    emailInput.focus();
    return;
  }

  // Check if password change is requested
  const oldPassword = oldPasswordInput.value.trim();
  const newPassword = newPasswordInput.value.trim();
  const repeatPassword = repeatPasswordInput.value.trim();

  // Validate password change if any field is filled
  if (oldPassword || newPassword || repeatPassword) {
    if (!oldPassword) {
      Swal.fire({
        icon: "warning",
        title: "Campo vacío",
        text: "Debes ingresar tu contraseña actual",
      });
      oldPasswordInput.focus();
      return;
    }

    if (!newPassword) {
      Swal.fire({
        icon: "warning",
        title: "Campo vacío",
        text: "Debes ingresar la nueva contraseña",
      });
      newPasswordInput.focus();
      return;
    }

    if (!validatePassword(newPassword)) {
      Swal.fire({
        icon: "warning",
        title: "Contraseña inválida",
        text: "La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales",
      });
      newPasswordInput.focus();
      return;
    }

    if (!repeatPassword) {
      Swal.fire({
        icon: "warning",
        title: "Campo vacío",
        text: "Debes repetir la nueva contraseña",
      });
      repeatPasswordInput.focus();
      return;
    }

    if (!validateConfirmPassword(newPassword, repeatPassword)) {
      Swal.fire({
        icon: "warning",
        title: "Las contraseñas no coinciden",
        text: "La nueva contraseña y su confirmación deben ser iguales",
      });
      repeatPasswordInput.focus();
      return;
    }

    if (oldPassword === newPassword) {
      Swal.fire({
        icon: "warning",
        title: "Contraseña igual",
        text: "La nueva contraseña debe ser diferente a la actual",
      });
      newPasswordInput.focus();
      return;
    }
  }

  showSpinner();

  // Update profile first
  updateUserProfile(
    userId,
    { name, lastName, email },
    function (profileResult) {
      if (profileResult.success) {
        // Check if avatar needs to be uploaded
        const avatarFile = photoProfileInput.files[0];

        if (avatarFile) {
          // Upload avatar
          uploadUserAvatar(userId, avatarFile, function (avatarResult) {
            // Continue with password change if requested
            if (oldPassword && newPassword) {
              handlePasswordChange(userId, oldPassword, newPassword);
            } else {
              hideSpinner();
              if (avatarResult.success) {
                Swal.fire({
                  icon: "success",
                  title: "¡Perfil actualizado!",
                  text: "Tus cambios fueron guardados exitosamente",
                  timer: 2000,
                  showConfirmButton: false,
                }).then(() => {
                  window.location.href = "profile.html";
                });
              } else {
                Swal.fire({
                  icon: "warning",
                  title: "Perfil actualizado",
                  text: `Perfil actualizado, pero hubo un error al subir el avatar: ${avatarResult.message}`,
                }).then(() => {
                  window.location.href = "profile.html";
                });
              }
            }
          });
        } else {
          // No avatar to upload, check password change
          if (oldPassword && newPassword) {
            handlePasswordChange(userId, oldPassword, newPassword);
          } else {
            hideSpinner();
            Swal.fire({
              icon: "success",
              title: "¡Perfil actualizado!",
              text: "Tus cambios fueron guardados exitosamente",
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              window.location.href = "profile.html";
            });
          }
        }
      } else {
        hideSpinner();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: profileResult.message || "No se pudo actualizar el perfil",
        });
      }
    }
  );
});

/**
 * Handle password change
 */
function handlePasswordChange(userId, oldPassword, newPassword) {
  changePassword(userId, oldPassword, newPassword, function (result) {
    hideSpinner();
    
    if (result.success) {
      Swal.fire({
        icon: "success",
        title: "¡Contraseña actualizada!",
        text: "Tu contraseña ha sido cambiada exitosamente",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        window.location.href = "profile.html";
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al cambiar contraseña",
        text: result.message || "No se pudo cambiar la contraseña. Verifica que la contraseña actual sea correcta",
      });
    }
  });
}

/**
 * Handle delete avatar
 */
function handleDeleteAvatar() {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Usuario no identificado",
    });
    return;
  }

  Swal.fire({
    title: "¿Eliminar avatar?",
    text: "Se usará el ícono predeterminado",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      deleteUserAvatar(userId, function (deleteResult) {
        if (deleteResult.success) {
          // Replace image with default icon
          const currentElement = document.querySelector(
            ".update-photo-profile img, .update-photo-profile .contact-avatar"
          );
          if (currentElement) {
            currentElement.outerHTML = `<i class="fa-solid fa-circle-user"></i>`;
          }
          photoProfileIcon.outerHTML = `<i class="fa-solid fa-circle-user"></i>`;

          Swal.fire({
            icon: "success",
            title: "Avatar eliminado",
            timer: 1500,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: deleteResult.message || "No se pudo eliminar el avatar",
          });
        }
      });
    }
  });
}

// Optional: Add button to delete avatar (can be added in HTML or dynamically)
// For now, user can just upload a new one to replace it

// Load profile data on page load
document.addEventListener("DOMContentLoaded", function () {
  loadUserProfileForEdit();
});
