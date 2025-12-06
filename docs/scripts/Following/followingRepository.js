// ====================================================================
// CONTACTS REPOSITORY
// ====================================================================

/*helper para extraer el id del usuario del local storage*/
function getCurrentUserId() {
  const userId = localStorage.getItem("userId");
  if (!userId || userId.trim() === "") {
    console.error("User ID not found or is empty in localStorage. User might be logged out.");
    return null;
  }
  return userId;
}

function getContacts(userId, callback) {
  const config = { method: "GET" };

  // Get userId from parameter or fallback to the logged-in user
  const currentUserId = userId || getCurrentUserId();

  if (!currentUserId) {
    // Error is logged by getCurrentUserId()
    callback([]);
    return;
  }

  const url = `/api/Following/following/${currentUserId}`;

  // Use server() function for consistency with the rest of the project
  server(url, config, (users) => {
    // Map backend response to frontend format
    const contacts = users.map((user) => ({
      id: user.id,
      imgUser: user.imageUrl || "assets/imgwebp/default.webp",
      nameUser: `${user.name} ${user.lastName}`,
      isFollowing: true,
    }));

    callback(contacts);
  });
}


function followUser(followedUserId, callback) {
  const currentUserId = getCurrentUserId();

  if (!currentUserId) {
    callback({ success: false, message: "User not logged in" });
    return;
  }

  // Validate followedUserId is a valid positive integer
  if (
    !followedUserId ||
    !Number.isInteger(followedUserId) ||
    followedUserId <= 0
  ) {
    console.error("Invalid followedUserId:", followedUserId);
    callback({ success: false, message: "Invalid user ID" });
    return;
  }

  const url = `/api/Following/${followedUserId}`;

  const config = { method: "POST"};

  server(url, config, function (response) {
    // Check if there was an error from server()
    if (response && response.error) {
      callback({ success: false, message: response.message || "Error al seguir usuario" });
    } else if (response && response.id) {
      callback({ success: true, data: response });
    } else {
      callback({ success: false, message: "Error al seguir usuario" });
    }
  });
}


function unfollowUser(followedUserId, callback) {
  const currentUserId = getCurrentUserId();

  if (!currentUserId) {
    callback({ success: false, message: "User not logged in" });
    return;
  }

  // Validate followedUserId is a valid positive integer
  if (
    !followedUserId ||
    !Number.isInteger(followedUserId) ||
    followedUserId <= 0
  ) {
    console.error("Invalid followedUserId:", followedUserId);
    callback({ success: false, message: "Invalid user ID" });
    return;
  }

  const url = `/api/Following/${followedUserId}`;

  const config = { method: "DELETE"};

  server(url, config, function (response) {
    // Check if there was an error from server()
    if (response && response.error) {
      callback({ success: false, message: response.message || "Error al dejar de seguir" });
    } else if (response !== undefined && response !== null) {
      // DELETE typically returns 204 No Content or empty response on success
      callback({
        success: true,
        message: "Usuario dejado de seguir exitosamente",
      });
    } else {
      callback({ success: false, message: "Error al dejar de seguir" });
    }
  });
}


function checkIsFollowing(targetUserId, callback) {
  const currentUserId = getCurrentUserId();

  if (!currentUserId) {
    callback({ success: false, data: false });
    return;
  }

  // Validate targetUserId is a valid positive integer
  if (!targetUserId || !Number.isInteger(targetUserId) || targetUserId <= 0) {
    console.error("Invalid targetUserId:", targetUserId);
    callback({ success: false, data: false });
    return;
  }

  const url = `/api/Following/check/${targetUserId}`;
  const config = { method: "GET" };


  server(url, config, function (response) {
    // Backend returns boolean or object with isFollowing property
    const isFollowing =
      typeof response === "boolean" ? response : response.isFollowing;
    callback({ success: true, data: isFollowing });
  });
}


function getMyFollowingIds(callback) {
  const url = `/api/Following/my-following-ids`;
  const config = { method: "GET" };

  // Use server() which now injects the token; handle 204 (server returns null)
  server(url, config, (response) => {
    if (response === null) {
      // 204 No Content -> empty array
      callback({ success: true, data: [] });
      return;
    }

    if (response && response.error) {
      console.error("Error fetching following IDs from server", response);
      callback({ success: true, data: [] });
      return;
    }

    // Backend returns {followedUserIds: [...] } or an array
    let ids = [];
    if (Array.isArray(response)) {
      ids = response;
    } else if (response && Array.isArray(response.followedUserIds)) {
      ids = response.followedUserIds;
    }

    callback({ success: true, data: ids });
  });
}


function getAllUsers(options, callback) {
  // Support old signature: getAllUsers(searchQuery, callback) or getAllUsers(callback)
  if (typeof options === "function") {
    callback = options;
    options = { page: 1, size: 10, searchQuery: "" };
  } else if (typeof options === "string") {
    const searchQuery = options;
    callback = callback || function() {};
    options = { page: 1, size: 10, searchQuery };
  }

  const { page = 1, size = 10, searchQuery = "" } = options;

  // Build URL with pagination and search
  let url = `/api/User/all?page=${page}&size=${size}`;
  if (searchQuery && searchQuery.trim()) {
    url += `&search=${encodeURIComponent(searchQuery.trim())}`;
  }
  const config = { method: "GET" };

  server(url, config, (response) => {
    // Backend returns paginated response: {users: [], totalCount, page, size, hasMore}
    const users = response.users || response.data || [];
    const hasMore = response.hasMore || false;
    const totalCount = response.totalCount || users.length;

    // Map backend response to frontend format
    const allUsers = users.map((user) => ({
      id: user.id,
      imgUser: user.avatarUrl || null, // null if no avatar (will show icon)
      nameUser: `${user.name} ${user.lastName || user.lastname || ""}`.trim(),
      isFollowing: false, // Will be updated with cache
    }));

    callback({ users: allUsers, hasMore, totalCount });
  });
}
