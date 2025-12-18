// ====================================================================
// CONTACTS REPOSITORY - Refactorizado para usar server()
// ====================================================================

/**
 * Fetches all contacts (followed users) for a given user
 */
function getContacts(userId, callback) {
  const currentUserId = userId || localStorage.getItem("userId");

  if (!currentUserId) {
    console.error("No userId found in localStorage");
    callback([]);
    return;
  }

  const url = `/api/Following/following/${currentUserId}`;

  server(url, { method: "GET" }, (users) => {
    if (!users || users.error) {
      callback([]);
      return;
    }

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
 */
function followUser(followedUserId, callback) {
  if (!followedUserId || !Number.isInteger(followedUserId) || followedUserId <= 0) {
    callback({ success: false, message: "Invalid user ID" });
    return;
  }

  server(`/api/Following/${followedUserId}`, { method: "POST" }, (response) => {
    if (response?.error) {
      callback({
        success: false,
        message: response.message || "Error al seguir usuario",
      });
      return;
    }

    callback({ success: true, data: response });
  });
}

/**
 * Unfollow a user
 */
function unfollowUser(followedUserId, callback) {
  if (!followedUserId || !Number.isInteger(followedUserId) || followedUserId <= 0) {
    callback({ success: false, message: "Invalid user ID" });
    return;
  }

  server(`/api/Following/${followedUserId}`, { method: "DELETE" }, (response) => {
    if (response?.error) {
      callback({
        success: false,
        message: response.message || "Error al dejar de seguir",
      });
      return;
    }

    // DELETE puede devolver null/empty -> igual es OK
    callback({
      success: true,
      message: "Usuario dejado de seguir exitosamente",
    });
  });
}

/**
 * Check if current user is following another user
 */
function checkIsFollowing(targetUserId, callback) {
  if (!targetUserId || !Number.isInteger(targetUserId) || targetUserId <= 0) {
    callback({ success: false, data: false });
    return;
  }

  server(`/api/Following/check/${targetUserId}`, { method: "GET" }, (response) => {
    if (response?.error) {
      callback({ success: false, data: false });
      return;
    }

    const isFollowing =
      typeof response === "boolean" ? response : response.isFollowing;

    callback({ success: true, data: isFollowing });
  });
}

/**
 * Fetches the list of IDs the current user follows (DTO-consistent)
 */
function getMyFollowingIds(callback) {
  server(`/api/Following/my-following-ids`, { method: "GET" }, (response) => {
    if (!response || response.error) {
      callback({ success: false, data: [] });
      return;
    }

    // Siempre esperamos el DTO: { followedUserIds: [...] }
    const ids = Array.isArray(response.followedUserIds)
      ? response.followedUserIds
      : [];

    callback({ success: true, data: ids });
  });
}

/**
 * Fetches paginated users with search support
 */
function getAllUsers(options, callback) {
  if (typeof options === "function") {
    callback = options;
    options = { page: 1, size: 10, searchQuery: "" };
  } else if (typeof options === "string") {
    const searchQuery = options;
    callback = callback || function () {};
    options = { page: 1, size: 10, searchQuery };
  }

  const { page = 1, size = 10, searchQuery = "" } = options;

  let url = `/api/User/all?page=${page}&size=${size}`;
  if (searchQuery.trim()) {
    url += `&search=${encodeURIComponent(searchQuery.trim())}`;
  }

  server(url, { method: "GET" }, (response) => {
    if (!response || response.error) {
      callback({ users: [], hasMore: false, totalCount: 0 });
      return;
    }

    const users = response.users || [];
    const hasMore = response.hasMore || false;
    const totalCount = response.totalCount || users.length;

    const allUsers = users.map((user) => ({
      id: user.id,
      imgUser: user.avatarUrl || null,
      nameUser: `${user.name} ${user.lastName || ""}`.trim(),
      isFollowing: false,
    }));

    callback({ users: allUsers, hasMore, totalCount });
  });
}
