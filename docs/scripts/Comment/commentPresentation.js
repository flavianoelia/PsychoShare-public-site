// =======================================
// comment/commentPresentation.js
// =======================================

/**
 * Inicializa la sección de comentarios de un post específico.
 * postNode: nodo <article> del post
 * postId: id del post en backend
 */
function initializeCommentsForPost(postNode, postId) {
    const commentSection = postNode.querySelector(".comment-section");
    if (!commentSection) return;

    const viewMoreBtn = commentSection.querySelector(".view-more");
    const commentInput = commentSection.querySelector(".comment-input");
    const sendBtn = commentSection.querySelector(".submit-comment");

    if (!viewMoreBtn || !commentInput || !sendBtn) return;

    // 1) Cargar 2 comentarios iniciales
    getInitialComments(postId, (data) => {
        if (!data || data.error) return;

        // data.comments = lista de CommentResponseDto
        renderComments(commentSection, data.comments, true);

        // Mostrar u ocultar "Ver más"
        // Regla: si hay 0 o 1 comentario total → no se ve.
        // Si hay 2 o más → se ve.
        const total = data.totalCount ?? data.comments.length;
        if (total < 2) {
        viewMoreBtn.classList.add("hidden");
        } else {
        viewMoreBtn.classList.remove("hidden");
        }
    });

    // 2) Configurar paginación "Ver más"
    setupCommentViewMore(commentSection, postId, {
        initialSkip: 2,
        pageSize: 5,
    });

    // 3) Enviar nuevo comentario
    sendBtn.addEventListener("click", () => {
        const text = commentInput.value.trim();
        if (text === "") return;

        createComment(postId, text, (data) => {
        if (!data || data.error) return;

        // El backend nos devuelve un CommentResponseDto
        const newComment = new Comment(data);
        const node = newComment.getNode();

        const viewMoreBtn = commentSection.querySelector(".view-more");
        commentSection.insertBefore(node, viewMoreBtn);

        // Atachamos menú hamburguesa
        attachCommentMenuEvents(node, {
            id: newComment.id,
            userId: newComment.userId,
        });

        // Limpiar input
        commentInput.value = "";
        });
    });
}

/**
 * Renderiza una lista de comentarios en una sección.
 * clean = true → borra los comentarios actuales antes de renderizar
 */
function renderComments(commentSection, comments, clean) {
    if (clean) {
        const oldComments = commentSection.querySelectorAll(".comment");
        oldComments.forEach((c) => c.remove());
    }

    const viewMoreBtn = commentSection.querySelector(".view-more");

    comments.forEach((c) => {
        const comment = new Comment(c);
        const node = comment.getNode();

        commentSection.insertBefore(node, viewMoreBtn);

        attachCommentMenuEvents(node, {
        id: comment.id,
        userId: comment.userId,
        });
    });
}
