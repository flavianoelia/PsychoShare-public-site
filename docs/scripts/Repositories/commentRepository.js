// =======================================
// comment/commentRepository.js
// =======================================

/**
 * Get first 2 comments of a post
 */
function getInitialComments(postId, callback) {
  const url = `/api/Comment/post/${postId}/more?skip=0&take=2`;
  server(url, { method: "GET" }, callback);
}

/**
 * Get more comments with pagination
 */
function getMoreComments(postId, skip, take, callback) {
  const url = `/api/Comment/post/${postId}/more?skip=${skip}&take=${take}`;
  server(url, { method: "GET" }, callback);
}

/**
 * Create a comment
 */
function createComment(postId, text, callback) {
  const auth = getCurrentAuthContext();

  const url = `/api/Comment`;

  const body = {
    userId: auth.userId,
    postId,
    text,
  };

  server(url, {
    method: "POST",
    body: JSON.stringify(body),
  }, callback);
}

/**
 * Edit a comment
 */
function editComment(commentId, text, callback) {
  const url = `/api/Comment/${commentId}`;

  const body = { text };

  server(url, {
    method: "PUT",
    body: JSON.stringify(body),
  }, callback);
}

/**
 * Delete a comment
 */
function deleteCommentApi(commentId, callback) {
  const url = `/api/Comment/${commentId}`;

  server(url, { method: "DELETE" }, callback);
}

/**
 * Reportar un comentario (PREPARADO para cuando el back lo soporte).
 * Por ahora el ReportController sólo deja reportar si sos admin/superadmin.
 */

function reportCommentApi(commentId, reportedUserId, reason, details, callback) {
    const token = localStorage.getItem("token");
    const auth = getCurrentAuthContext();

    const url = `/api/Report`;

    const body = {
        reporterUserId: auth.userId,
        reportedUserId: reportedUserId,
        reason: reason,
        details: details,
        contentType: "Comment",
        contentId: commentId,
    };

    const config = {
        method: "POST",
        headers: {
        Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    };

    server(url, config, callback);
}
