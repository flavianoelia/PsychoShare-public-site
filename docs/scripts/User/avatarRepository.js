// ====================================================================
// AVATAR REPOSITORY - Manage user avatar from backend API
// ====================================================================

/**
 * Get user avatar
 * @param {number} userId - The ID of the user
 * @param {Function} callback - Callback with format {success: boolean, data: {url: string}, message: string}
 */
function getUserAvatar(userId, callback) {
  const token = localStorage.getItem("token");

  if (!userId) {
    console.error("No userId provided");
    callback({ success: false, message: "User ID is required" });
    return;
  }

  const url = `http://localhost:5174/api/Avatar/${userId}`;

  fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        // If no avatar found (404), that's ok - use default icon
        if (response.status === 404) {
          callback({ success: true, data: null });
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data && data.url) {
        callback({ success: true, data: { url: data.url } });
      } else if (data === null) {
        // Already handled 404 above
        return;
      } else {
        callback({ success: true, data: null });
      }
    })
    .catch((error) => {
      console.error("Error fetching avatar:", error);
      callback({ success: false, message: "Error al cargar avatar" });
    });
}

/**
 * Upload user avatar
 * @param {number} userId - The ID of the user
 * @param {File} file - The image file to upload
 * @param {Function} callback - Callback with format {success: boolean, data: {url: string}, message: string}
 */
function uploadUserAvatar(userId, file, callback) {
  const token = localStorage.getItem("token");

  if (!userId) {
    console.error("No userId provided");
    callback({ success: false, message: "User ID is required" });
    return;
  }

  if (!file) {
    callback({ success: false, message: "No se seleccionó ningún archivo" });
    return;
  }

  // Validate file size (max 2MB)
  const maxSize = 2 * 1024 * 1024; // 2MB in bytes
  if (file.size > maxSize) {
    callback({
      success: false,
      message: "El archivo es demasiado grande. Máximo 2MB.",
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

  const url = `http://localhost:5174/api/Avatar/${userId}`;

  fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // Do NOT set Content-Type header - browser will set it automatically with boundary
    },
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw new Error(err.message || `HTTP error! status: ${response.status}`);
        });
      }
      return response.json();
    })
    .then((data) => {
      if (data && data.url) {
        callback({ success: true, data: { url: data.url } });
      } else {
        callback({ success: false, message: "Error al subir avatar" });
      }
    })
    .catch((error) => {
      console.error("Error uploading avatar:", error);
      callback({
        success: false,
        message: error.message || "Error al subir avatar",
      });
    });
}

/**
 * Delete user avatar
 * @param {number} userId - The ID of the user
 * @param {Function} callback - Callback with format {success: boolean, message: string}
 */
function deleteUserAvatar(userId, callback) {
  const token = localStorage.getItem("token");

  if (!userId) {
    console.error("No userId provided");
    callback({ success: false, message: "User ID is required" });
    return;
  }

  const url = `http://localhost:5174/api/Avatar/${userId}`;

  fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // DELETE typically returns 204 No Content
      callback({
        success: true,
        message: "Avatar eliminado exitosamente",
      });
    })
    .catch((error) => {
      console.error("Error deleting avatar:", error);
      callback({ success: false, message: "Error al eliminar avatar" });
    });
}
