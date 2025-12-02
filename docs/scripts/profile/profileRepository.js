// =====================================================================
// USER REPOSITORY
// =====================================================================

/* ------------------------ Helper Validations ------------------------ */

function validateUserId(userId, callback) {
  if (!userId || userId <= 0) {
    callback({
      success: false,
      message: "User ID requerido",
    });
    return false;
  }
  return true;
}

function normalizeUserResponse(response) {
  if (!response) return null;

  if (response.user) return response.user;

  // Backend inconsistently uses id or idPerson
  if (response.id || response.idPerson) return response;

  return null;
}


/* ------------------------ Get User Profile ------------------------ */

function getUserProfile(userId, callback) {
  if (!validateUserId(userId, callback)) return;

  const url = `/api/User/${userId}`;
  const config = { method: "GET" };

  server(url, config, function (response) {
    if (response?.error) {
      return callback({
        success: false,
        message: response.message || "Error al cargar el perfil",
      });
    }

    const userData = normalizeUserResponse(response);

    if (userData) {
      return callback({
        success: true,
        data: userData,
      });
    }

    callback({
      success: false,
      message: response?.message || "Error al cargar el perfil",
    });
  });
}



/* ------------------------ Update User Profile ------------------------ */

function updateUserProfile(userId, userData, callback) {
  if (!validateUserId(userId, callback)) return;

  if (!userData.name || !userData.lastName || !userData.email) {
    return callback({
      success: false,
      message: "Nombre, apellido y email son obligatorios",
    });
  }

  const url = `/api/User/edit/${userId}`;

  const config = {
    method: "PUT",
    body: JSON.stringify({
      name: userData.name,
      lastName: userData.lastName,
      email: userData.email,
    }),
  };

  server(url, config, function (response) {
    if (response?.error) {
      return callback({
        success: false,
        message: response.message || "Error al actualizar perfil",
      });
    }

    const userData = normalizeUserResponse(response);

    if (userData) {
      return callback({
        success: true,
        data: userData,
        message: response.message || "Perfil actualizado",
      });
    }

    // Backend may return success: true but no user -> treat as success
    if (response?.success === true) {
      return callback({
        success: true,
        data: response.user || response,
        message: response.message || "Perfil actualizado",
      });
    }

    callback({
      success: false,
      message: response?.message || "Error al actualizar perfil",
    });
  });
}



/* ------------------------ Get Posts From User ------------------------ */

function getUserPosts(userId, page = 1, size = 10, callback) {
  if (!validateUserId(userId, callback)) return;

  const url = `/api/Post/user/${userId}?Page=${page}&Size=${size}`;
  const config = { method: "GET" };

  server(url, config, function (response) {
    if (response?.error) {
      return callback({
        success: false,
        message: response.message || "Error al cargar publicaciones",
      });
    }

    let posts = [];

    if (Array.isArray(response)) {
      posts = response;
    } else if (response?.posts && Array.isArray(response.posts)) {
      posts = response.posts;
    } else {
      return callback({
        success: false,
        message: response?.message || "Error al cargar publicaciones",
      });
    }

    const mappedPosts = posts.map(post => ({
      postId: post.id || post.postId,
      userId: post.userId || post.idPerson,
      title: post.title || "",
      description: post.description || "",
      authorship: post.authorship || "",
      abstract: post.resume || "",
      createdAt: post.createdAt || post.createAt,
      imgOwner: post.avatarUrl || null,
      image: post.imageUrl || null,
      pdf: post.pdfUrl ? { url: post.pdfUrl } : null,
      nameOwner:
        post.nameOwner && post.lastnameOwner
          ? `${post.nameOwner} ${post.lastnameOwner}`.trim()
          : "Usuario",
      countLike: 0,
      comments: post.comments || [],
      commentCount: post.commentCount || post.commentsCount || (post.comments ? post.comments.length : 0),
    }));

    callback({
      success: true,
      data: mappedPosts,
    });
  });
}
