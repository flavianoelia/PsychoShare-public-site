// =======================================
// CommentRepository.js
// =======================================

// Obtener los primeros 2 comentarios de un post
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


// Obtener comentarios paginados ("Ver más")
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


// Crear un nuevo comentario
function createComment(postId, text, callback) {
    const token = localStorage.getItem("token");
    const userId = Number(localStorage.getItem("userId"));

    const url = `/api/Comment`;

    const body = {
        userId,
        postId,
        text,
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


// Editar comentario
function editComment(commentId, text, callback) {
    const token = localStorage.getItem("token")
}