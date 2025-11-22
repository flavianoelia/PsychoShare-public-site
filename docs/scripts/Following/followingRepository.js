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
 * @param {Function} callback - Callback function to handle the response
 */
function followUser(followedUserId, callback) {
  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  if (!currentUserId) {
    console.error("No userId found in localStorage");
    callback({ success: false, message: "User not logged in" });
    return;
  }

  const url = `/api/Following/${followedUserId}`;

  const config = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  server(url, config, callback);
}

/**
 * Unfollow a user
 * @param {number} followedUserId - The ID of the user to unfollow
 * @param {Function} callback - Callback function to handle the response
 */
function unfollowUser(followedUserId, callback) {
  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  if (!currentUserId) {
    console.error("No userId found in localStorage");
    callback(false);
    return;
  }

  const url = `/api/Following/${followedUserId}`;

  const config = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  server(url, config, callback);
}

/**
 * Check if current user is following another user
 * @param {number} targetUserId - The ID of the user to check
 * @param {Function} callback - Callback function to handle the response (boolean)
 */
function checkIsFollowing(targetUserId, callback) {
  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  if (!currentUserId) {
    console.error("No userId found in localStorage");
    callback(false);
    return;
  }

  const url = `/api/Following/check/${targetUserId}`;

  const config = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  server(url, config, callback);
}
