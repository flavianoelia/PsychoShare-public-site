// ====================================================================
// CONTACTS REPOSITORY - Fetch contacts from backend API
// ====================================================================

/**
 * Fetches all contacts (followed users) for a given user
 * @param {number} userId - Optional. If not provided, gets from localStorage
 * @param {Function} callback - Callback function to handle the response
 */
function getContacts(userId, callback) {
  // Get userId and token from localStorage
  const currentUserId = userId || localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  if (!currentUserId) {
    console.error("No userId found in localStorage");
    callback([]);
    return;
  }

  const url = `/api/Following/following/${currentUserId}`;

  const config = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

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

/**
 * Follow a user
 * @param {number} followedUserId - The ID of the user to follow
 * @param {Function} callback - Callback function to handle the response with format {success: boolean, data: object, message: string}
 */
function followUser(followedUserId, callback) {
  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  if (!currentUserId) {
    console.error("No userId found in localStorage");
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

  const config = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

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

/**
 * Unfollow a user
 * @param {number} followedUserId - The ID of the user to unfollow
 * @param {Function} callback - Callback function to handle the response with format {success: boolean, message: string}
 */
function unfollowUser(followedUserId, callback) {
  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  if (!currentUserId) {
    console.error("No userId found in localStorage");
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

  const config = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

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

/**
 * Check if current user is following another user
 * @param {number} targetUserId - The ID of the user to check
 * @param {Function} callback - Callback function to handle the response with format {success: boolean, data: boolean}
 */
function checkIsFollowing(targetUserId, callback) {
  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  if (!currentUserId) {
    console.error("No userId found in localStorage");
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

  const config = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  server(url, config, function (response) {
    // Backend returns boolean or object with isFollowing property
    const isFollowing =
      typeof response === "boolean" ? response : response.isFollowing;
    callback({ success: true, data: isFollowing });
  });
}

/**
 * Fetches the list of user IDs that the current user is following (optimized)
 * @param {Function} callback - Callback function to handle the response with format {success: boolean, data: number[]}
 */
function getMyFollowingIds(callback) {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found in localStorage");
    callback({ success: false, data: [] });
    return;
  }

  const url = `/api/Following/my-following-ids`;

  const config = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Use fetch directly to handle errors properly
  fetch(`http://localhost:5174${url}`, config)
    .then((response) => {
      console.log('[DEBUG] my-following-ids response status:', response.status);
      // 204 No Content means empty array
      if (response.status === 204) {
        console.log('[DEBUG] Backend returned 204, using empty cache');
        callback({ success: true, data: [] });
        return null;
      }
      if (!response.ok) {
        console.error(`Error fetching following IDs: ${response.status}`);
        callback({ success: true, data: [] }); // Continue with empty cache
        return null;
      }
      return response.json();
    })
    .then((data) => {
      if (data !== null) {
        console.log('[DEBUG] Backend returned following IDs:', data);
        // Backend returns {followedUserIds: [2, 5, 8, 12, ...]} or just array
        let ids = [];
        if (Array.isArray(data)) {
          ids = data;
        } else if (data.followedUserIds && Array.isArray(data.followedUserIds)) {
          ids = data.followedUserIds;
        }
        console.log('[DEBUG] Extracted IDs for cache:', ids);
        callback({ success: true, data: ids });
      }
    })
    .catch((error) => {
      console.error("Network error fetching following IDs:", error);
      callback({ success: true, data: [] }); // Continue with empty cache
    });
}

/**
 * Fetches ALL users from the system (for "discover people to follow" feature)
 * @param {string} searchQuery - Optional search term to filter users by name/lastname/email
 * @param {Function} callback - Callback function to handle the response
 */
function getAllUsers(searchQuery, callback) {
  // If only one argument (callback), searchQuery is undefined
  if (typeof searchQuery === "function") {
    callback = searchQuery;
    searchQuery = "";
  }

  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found in localStorage");
    callback([]);
    return;
  }

  // Build URL with optional search parameter
  let url = `/api/User/all?page=1&size=50`;
  if (searchQuery && searchQuery.trim()) {
    url += `&search=${encodeURIComponent(searchQuery.trim())}`;
  }

  const config = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  server(url, config, (response) => {
    // Backend returns array of users or paginated response
    const users = Array.isArray(response)
      ? response
      : response.users || response.data || [];

    // Map backend response to frontend format
    const allUsers = users.map((user) => ({
      id: user.id,
      imgUser: user.avatarUrl || "assets/imgwebp/default.webp",
      nameUser: `${user.name} ${user.lastName || user.lastname || ""}`.trim(),
      isFollowing: false, // Se actualizará dinámicamente con checkIsFollowing()
    }));

    callback(allUsers);
  });
}
