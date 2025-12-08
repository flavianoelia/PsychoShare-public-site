// =====================================================================
// LIKE REPOSITORY 
// =====================================================================

/**
 * Validate that userId and postId exist and are valid.
 */
function validateIds(postId, callback) {
  const userId = parseInt(localStorage.getItem("userId"));

  if (!userId || userId <= 0 || !postId || postId <= 0) {
    callback({
      success: false,
      message: "Invalid userId or postId",
    });
    return null;
  }

  return userId;
}

/**
 * Toggle like/unlike on a post
 * @param {number} postId
 * @param {Function} callback
 */
function toggleLike(postId, callback) {
  const userId = validateIds(postId, callback);
  if (!userId) return;

  const url = `/api/Like/toggle`;

  const config = {
    method: "POST",
    body: JSON.stringify({ userId, postId }),
  };

  server(url, config, function (response) {
    if (response?.error) {
      return callback({
        success: false,
        message: response.message || "Server error",
      });
    }

    // Old backend format → boolean
    if (typeof response === "boolean") {
      return callback({ success: true, data: response });
    }

    // New backend format → {isLikedByCurrentUser, likeCount, ...}
    if (typeof response === "object" && "isLikedByCurrentUser" in response) {
      return callback({
        success: true,
        data: response.isLikedByCurrentUser,
        stats: response,
      });
    }

    callback({
      success: false,
      message: "Invalid like response",
    });
  });
}

/**
 * Get like statistics for a post
 * @param {number} postId
 * @param {Function} callback
 */
function getLikeStats(postId, callback) {
  const userId = validateIds(postId, callback);
  if (!userId) return;

  const url = `/api/Like/stats/${postId}?currentUserId=${encodeURIComponent(userId)}`;

  const config = { method: "GET" };

  server(url, config, function (response) {
    if (response?.error) {
      return callback({
        success: false,
        data: {
          likeCount: 0,
          isLikedByCurrentUser: false,
          recentLikerNames: [],
        },
        message: response.message || "Server error",
      });
    }

    if (response && typeof response.likeCount === "number") {
      return callback({ success: true, data: response });
    }

    callback({
      success: false,
      message: "Invalid like stats response",
      data: {
        likeCount: 0,
        isLikedByCurrentUser: false,
        recentLikerNames: [],
      },
    });
  });
}
