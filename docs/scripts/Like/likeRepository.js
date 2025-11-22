// ====================================================================
// LIKE REPOSITORY - Manage likes from backend API
// ====================================================================

/**
 * Toggle like/unlike on a post
 * @param {number} postId - The ID of the post to like/unlike
 * @param {Function} callback - Callback with format {success: boolean, data: boolean, message: string}
 */
function toggleLike(postId, callback) {
  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  if (!currentUserId) {
    console.error("No userId found in localStorage");
    callback({ success: false, message: "User not logged in" });
    return;
  }

  // Validate postId is a valid positive integer
  if (!postId || !Number.isInteger(postId) || postId <= 0) {
    console.error("Invalid postId:", postId);
    callback({ success: false, message: "Invalid post ID" });
    return;
  }

  const url = `/api/Like/toggle`;

  const config = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      userId: parseInt(currentUserId),
      postId: postId,
    }),
  };

  server(url, config, function (response) {
    // Backend returns true (now liked) or false (like removed)
    if (typeof response === "boolean") {
      callback({ success: true, data: response });
    } else {
      callback({ success: false, message: "Error al procesar like" });
    }
  });
}

/**
 * Get like statistics for a post
 * @param {number} postId - The ID of the post
 * @param {Function} callback - Callback with format {success: boolean, data: {likeCount, isLikedByCurrentUser, recentLikerNames}}
 */
function getLikeStats(postId, callback) {
  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  if (!currentUserId) {
    console.error("No userId found in localStorage");
    callback({
      success: false,
      data: { likeCount: 0, isLikedByCurrentUser: false, recentLikerNames: [] },
    });
    return;
  }

  // Validate postId is a valid positive integer
  if (!postId || !Number.isInteger(postId) || postId <= 0) {
    console.error("Invalid postId:", postId);
    callback({
      success: false,
      data: { likeCount: 0, isLikedByCurrentUser: false, recentLikerNames: [] },
    });
    return;
  }

  const url = `/api/Like/stats/${postId}?currentUserId=${currentUserId}`;

  const config = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  server(url, config, function (response) {
    if (response && typeof response.likeCount === "number") {
      callback({ success: true, data: response });
    } else {
      callback({
        success: false,
        data: { likeCount: 0, isLikedByCurrentUser: false, recentLikerNames: [] },
      });
    }
  });
}
