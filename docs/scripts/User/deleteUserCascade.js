// ====================================================================
// DELETE USER CASCADE - Delete user account with all related data
// ====================================================================

/**
 * Delete current user's own account
 * Shows double confirmation and warns about permanent deletion
 * Deletes: Posts, Comments, Likes, Followings, Files (cascade)
 */
function deleteMyAccount() {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  
  if (!userId || !token) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No hay sesión activa. Por favor inicia sesión.",
    }).then(() => {
      window.location.href = 'index.html';
    });
    return;
  }

  // First confirmation with warning
  Swal.fire({
    icon: "warning",
    title: "⚠️ ¿Eliminar tu cuenta?",
    html: `
      <p><strong>Esta acción NO se puede deshacer.</strong></p>
      <p>Se eliminarán permanentemente:</p>
      <ul style="text-align: left; margin: 1rem 2rem;">
        <li>Todos tus posts</li>
        <li>Todos tus comentarios</li>
        <li>Todos tus likes</li>
        <li>Tus archivos subidos</li>
        <li>Tu lista de seguidos</li>
      </ul>
    `,
    showCancelButton: true,
    confirmButtonText: "Continuar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
  }).then((result) => {
    if (result.isConfirmed) {
      // Second confirmation: type "ELIMINAR"
      Swal.fire({
        icon: "warning",
        title: "Confirmación final",
        html: 'Para confirmar, escribe <strong>ELIMINAR</strong> en mayúsculas:',
        input: "text",
        inputPlaceholder: "ELIMINAR",
        showCancelButton: true,
        confirmButtonText: "Eliminar mi cuenta",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#d33",
        preConfirm: (text) => {
          if (text !== "ELIMINAR") {
            Swal.showValidationMessage("Debes escribir exactamente: ELIMINAR");
            return false;
          }
          return true;
        },
      }).then((confirmResult) => {
        if (confirmResult.isConfirmed) {
          performDeleteAccount(userId, token);
        }
      });
    }
  });
}

/**
 * Performs the actual delete account API call
 * @param {string} userId - User ID to delete
 * @param {string} token - Auth token
 */
function performDeleteAccount(userId, token) {
  const url = `/api/User/${userId}`;
  
  const config = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Show loading
  Swal.fire({
    title: "Eliminando cuenta...",
    text: "Por favor espera",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  server(url, config, function (response) {
    if (response && response.error) {
      // Error from server
      Swal.fire({
        icon: "error",
        title: "Error",
        text: response.message || "No se pudo eliminar la cuenta",
      });
    } else if (response && response.success) {
      // Success
      const filesDeleted = response.filesDeleted || 0;
      Swal.fire({
        icon: "success",
        title: "Cuenta eliminada",
        html: `
          <p>Tu cuenta ha sido eliminada correctamente.</p>
          <p><small>${filesDeleted} archivo(s) eliminado(s) del servidor.</small></p>
        `,
        showConfirmButton: true,
        confirmButtonText: "Aceptar",
      }).then(() => {
        // Clear all localStorage
        localStorage.clear();
        // Redirect to login
        window.location.href = 'index.html';
      });
    } else {
      // Unexpected response
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al eliminar la cuenta. Intenta nuevamente.",
      });
    }
  });
}

/**
 * Delete user from admin panel
 * @param {number} userIdToDelete - ID of user to delete
 * @param {string} userName - Name of user to delete (for confirmation)
 * @param {Function} refreshCallback - Function to call after deletion to refresh user list
 */
function deleteUserAsAdmin(userIdToDelete, userName, refreshCallback) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No hay sesión activa.",
    });
    return;
  }

  // Confirmation
  Swal.fire({
    icon: "warning",
    title: "¿Eliminar usuario?",
    html: `
      <p>¿Eliminar usuario <strong>${userName || userIdToDelete}</strong>?</p>
      <p><strong>Esta acción NO se puede deshacer.</strong></p>
      <p>Se eliminarán todos sus datos (posts, comentarios, archivos).</p>
    `,
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#d33",
  }).then((result) => {
    if (result.isConfirmed) {
      performDeleteUserAsAdmin(userIdToDelete, token, refreshCallback);
    }
  });
}

/**
 * Performs the actual delete user API call from admin
 * @param {number} userIdToDelete - ID of user to delete
 * @param {string} token - Auth token
 * @param {Function} refreshCallback - Function to refresh user list
 */
function performDeleteUserAsAdmin(userIdToDelete, token, refreshCallback) {
  const url = `/api/User/${userIdToDelete}`;
  
  const config = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Show loading
  Swal.fire({
    title: "Eliminando usuario...",
    text: "Por favor espera",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  server(url, config, function (response) {
    if (response && response.error) {
      // Error from server
      let errorMessage = response.message || "No se pudo eliminar el usuario";
      
      // Handle specific error codes
      if (response.status === 403) {
        errorMessage = "⛔ No tienes permisos para eliminar este usuario.";
      } else if (response.status === 404) {
        errorMessage = "Usuario no encontrado.";
      }
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    } else if (response && response.success) {
      // Success
      const filesDeleted = response.filesDeleted || 0;
      Swal.fire({
        icon: "success",
        title: "Usuario eliminado",
        html: `
          <p>Usuario eliminado correctamente.</p>
          <p><small>${filesDeleted} archivo(s) eliminado(s) del servidor.</small></p>
        `,
        showConfirmButton: true,
        confirmButtonText: "Aceptar",
      }).then(() => {
        // Refresh user list if callback provided
        if (typeof refreshCallback === 'function') {
          refreshCallback();
        }
      });
    } else {
      // Unexpected response
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al eliminar usuario. Intenta nuevamente.",
      });
    }
  });
}
