// ====================================================================
// PROFILE REPOSITORY - Manage user profile from backend API
// ====================================================================

/**
 * Get user profile by ID
 * @param {number} userId - The ID of the user
 * @param {Function} callback - Callback with format {success: boolean, data: object, message: string}
 */
function getUserProfile(userId, callback) {
  const token = localStorage.getItem("token");

  if (!userId) {
    console.error("No userId provided");
    callback({ success: false, message: "User ID is required" });
    return;
  }

  const url = `/api/User/${userId}`;

  const config = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  server(url, config, function (response) {
    console.log("getUserProfile response:", response);
    if (response && response.error) {
      callback({ success: false, message: response.message || "Error al cargar perfil" });
    } else if (response && (response.id || response.idPerson)) {
      // Backend returns user object directly
      callback({ success: true, data: response });
    } else if (response && response.user && (response.user.id || response.user.idPerson)) {
      // Backend returns user object nested inside 'user' property
      callback({ success: true, data: response.user });
    } else if (response && response.message) {
      callback({ success: false, message: response.message });
    } else {
      callback({ success: false, message: "Error al cargar perfil" });
    }
  });
}

/**
 * Update user profile
 * @param {number} userId - The ID of the user
 * @param {object} userData - Object with {name, lastName, email}
 * @param {Function} callback - Callback with format {success: boolean, data: object, message: string}
 */
function updateUserProfile(userId, userData, callback) {
  const token = localStorage.getItem("token");

  if (!userId) {
    console.error("No userId provided");
    callback({ success: false, message: "User ID is required" });
    return;
  }

  // Validate required fields
  if (!userData.name || !userData.lastName || !userData.email) {
    callback({
      success: false,
      message: "Nombre, apellido y email son obligatorios",
    });
    return;
  }

  const url = `/api/User/edit/${userId}`;

  const config = {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: userData.name,
      lastName: userData.lastName,
      email: userData.email,
    }),
  };

  server(url, config, function (response) {
    console.log("updateUserProfile response:", response);
    if (response && response.error) {
      callback({ success: false, message: response.message || "Error al actualizar perfil" });
    } else if (response && (response.id || response.idPerson)) {
      // Backend returns user object directly
      callback({ success: true, data: response });
    } else if (response && response.user && (response.user.id || response.user.idPerson)) {
      // Backend returns user object nested inside 'user' property
      callback({ success: true, data: response.user });
    } else if (response && response.success) {
      // Backend returns success: true but no user object (still consider it successful)
      callback({ success: true, data: response.user || response, message: response.message });
    } else if (response && response.message) {
      callback({ success: false, message: response.message });
    } else {
      console.error("Unexpected response format:", response);
      callback({ success: false, message: "Error al actualizar perfil" });
    }
  });
}

/**
 * Get posts from a specific user
 * @param {number} userId - The ID of the user
 * @param {number} page - Page number
 * @param {number} size - Number of posts per page
 * @param {Function} callback - Callback with format {success: boolean, data: array, message: string}
 */
function getUserPosts(userId, page = 1, size = 10, callback) {
  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");

  if (!userId) {
    console.error("No userId provided");
    callback({ success: false, message: "User ID is required" });
    return;
  }

  const url = `/api/Post/user/${userId}?Page=${page}&Size=${size}`;

  const config = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  server(url, config, function (response) {
    console.log("getUserPosts response:", response);
    
    if (response && response.error) {
      callback({ success: false, message: response.message || "Error al cargar publicaciones" });
    } else if (Array.isArray(response)) {
      // Backend returns array of posts directly
      const posts = response.map(post => ({
        postId: post.id || post.postId,
        userId: post.userId || post.idPerson,
        title: post.title || "",
        description: post.description || "",
        authorship: post.authorship || "",
        abstract: post.resume || "",
        createdAt: post.createdAt || post.createAt,
        imgOwner: post.avatarUrl || null,
        image: post.imageUrl || null,
        nameOwner: post.userName || `${post.name || ''} ${post.lastName || ''}`.trim() || "Usuario",
        countLike: 0,
        comments: post.comments || []
      }));
      callback({ success: true, data: posts });
    } else if (response && response.posts && Array.isArray(response.posts)) {
      // Backend returns posts array nested inside 'posts' property
      const posts = response.posts.map(post => ({
        postId: post.id || post.postId,
        userId: post.userId || post.idPerson,
        title: post.title || "",
        description: post.description || "",
        authorship: post.authorship || "",
        abstract: post.resume || "",
        createdAt: post.createdAt || post.createAt,
        imgOwner: post.avatarUrl || null,
        image: post.imageUrl || null,
        nameOwner: post.nameOwner && post.lastnameOwner ? `${post.nameOwner} ${post.lastnameOwner}`.trim() : "Usuario",
        countLike: 0,
        comments: post.comments || []
      }));
      callback({ success: true, data: posts });
    } else if (response && response.message) {
      callback({ success: false, message: response.message });
    } else {
      console.error("Unexpected response format:", response);
      callback({ success: false, message: "Error al cargar publicaciones" });
    }
  });
}
