// ====================================================================
// AVATAR REPOSITORY - Manage user avatar from backend API
// ====================================================================

/**
 * Get user avatar
 * @param {number} userId - The ID of the user
 * @param {Function} callback - Callback with format {success: boolean, data: {url: string}, message: string}
 */
function getUserAvatar(userId, callback) {
  if (!userId) {
    console.error("No userId provided");
    callback({ success: false, message: "User ID is required" });
    return;
  }

  // Use centralized server() which injects Authorization and handles errors.
  const url = `/api/Avatar/${userId}`;
  const config = { method: 'GET' };

  server(url, config, (response) => {
    // server() returns null for 204, or an object, or {error:true,...}
    if (!response) {
      // Treat absence of content as no avatar
      callback({ success: true, data: null });
      return;
    }
    if (response.error) {
      // If 404, still OK (no avatar)
      if (response.status === 404) {
        callback({ success: true, data: null });
        return;
      }
      callback({ success: false, message: response.message || 'Error fetching avatar' });
      return;
    }

    // Expecting payload with { url: '...' }
    if (response && response.url) {
      callback({ success: true, data: { url: response.url } });
    } else {
      callback({ success: true, data: null });
    }
  });
}


/**
 * Upload user avatar
 * @param {number} userId - The ID of the user
 * @param {File} file - The image file to upload
 * @param {Function} callback - Callback with format {success: boolean, data: {url: string}, message: string}
 */
function uploadUserAvatar(userId, file, callback) {
  if (!userId) {
    console.error("No userId provided");
    callback({ success: false, message: "User ID is required" });
    return;
  }

  if (!file) {
    callback({ success: false, message: "No se seleccionó ningún archivo" });
    return;
  }

  // Validate file size (max 20MB)
  const maxSize = 20 * 1024 * 1024; // 20MB in bytes
  if (file.size > maxSize) {
    callback({
      success: false,
      message: "El archivo es demasiado grande. Máximo 20MB.",
    });
    return;
  }

  // Validate file type
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!validTypes.includes(file.type)) {
    callback({
      success: false,
      message: "Formato no válido. Usar JPG, PNG o WebP.",
    });
    return;
  }

  // Use FormData for multipart/form-data
  const formData = new FormData();
  formData.append("file", file);

  const url = `/api/Avatar/${userId}`;

  // Use centralized server() to handle Authorization and content-type
  const config = {
    method: 'POST',
    body: formData,
  };

  server(url, config, (response) => {
    if (!response) {
      // No content - treat as failure for upload
      callback({ success: false, message: 'Error al subir avatar' });
      return;
    }

    if (response.error) {
      callback({ success: false, message: response.message || 'Error al subir avatar' });
      return;
    }

    if (response && response.url) {
      callback({ success: true, data: { url: response.url } });
    } else {
      callback({ success: false, message: 'Error al subir avatar' });
    }
  });
}


/**
 * Delete user avatar
 * @param {number} userId - The ID of the user
 * @param {Function} callback - Callback with format {success: boolean, message: string}
 */
function deleteUserAvatar(userId, callback) {
  if (!userId) {
    console.error("No userId provided");
    callback({ success: false, message: "User ID is required" });
    return;
  }

  const url = `/api/Avatar/${userId}`;
  const config = { method: 'DELETE' };

  server(url, config, (response) => {
    if (response && response.error) {
      callback({ success: false, message: response.message || 'Error al eliminar avatar' });
      return;
    }

    // success (server may return null for 204)
    callback({ success: true, message: 'Avatar eliminado exitosamente' });
  });
}
