// =======================================
// comment/commentRepository.js
// =======================================

function getInitialComments(postId, callback) {
    const token = localStorage.getItem("token");
    const url = `/api/Comment/post/${postId}`;

    const config = {
        method: "GET",
        headers: {
        Authorization: `Bearer ${token}`,
        },
    };

    server(url, config, callback);
}

function getMoreComments(postId, skip, take, callback) {
    const token = localStorage.getItem("token");
    const url = `/api/Comment/post/${postId}/more?skip=${skip}&take=${take}`;

    const config = {
        method: "GET",
        headers: {
        Authorization: `Bearer ${token}`,
        },
    };

    server(url, config, callback);
}

function createComment(postId, text, callback) {
    const token = localStorage.getItem("token");
    const auth = getCurrentAuthContext();

    const url = `/api/Comment`;

    const body = {
        userId: auth.userId,
        postId: postId,
        text: text,
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

function editComment(commentId, text, callback) {
    const token = localStorage.getItem("token");
    const url = `/api/Comment/${commentId}`;

    const body = { text };

    const config = {
        method: "PUT",
        headers: {
        Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    };

    server(url, config, callback);
}

function deleteCommentApi(commentId, callback) {
    const token = localStorage.getItem("token");
    const url = `/api/Comment/${commentId}`;

    const config = {
        method: "DELETE",
        headers: {
        Authorization: `Bearer ${token}`,
        },
    };

    server(url, config, callback);
}

/**
 * Reportar un comentario (PREPARADO para cuando el back lo soporte).
 * Por ahora el ReportController sólo deja reportar si sos admin/superadmin.
 */
/*
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
*/