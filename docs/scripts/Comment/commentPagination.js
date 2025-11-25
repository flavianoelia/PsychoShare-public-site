// =======================================
// comment/commentPagination.js
// =======================================

/**
 * Configura el botón "Ver más" de la sección de comentarios de un post.
 *
 * - Muestra más comentarios usando getMoreComments()
 * - Usa skip/take
 * - Reusa renderComments() para pintar
 */
function setupCommentViewMore(commentSection, postId, options = {}) {
    const viewMoreBtn = commentSection.querySelector(".view-more");
    if (!viewMoreBtn) return;

    let skip = options.initialSkip ?? 2;   // ya cargaste 2
    const take = options.pageSize ?? 5;    // página

    viewMoreBtn.addEventListener("click", () => {
        getMoreComments(postId, skip, take, (data) => {
        if (!data || data.error) return;

        // data.comments viene del CommentsPaginationDto
        renderComments(commentSection, data.comments, false);

        skip += take;

        // Si ya no hay más, escondemos el botón
        if (!data.hasMore) {
            viewMoreBtn.classList.add("hidden");
        }
        });
    });
}
