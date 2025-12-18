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

    // Guardar skip en el dataset del botón para persistir entre clicks
    if (!viewMoreBtn.dataset.skip) {
        viewMoreBtn.dataset.skip = options.initialSkip ?? 2;
    }
    
    const take = options.pageSize ?? 5;

    // Remover listener anterior si existe (evitar duplicados)
    const oldHandler = viewMoreBtn._clickHandler;
    if (oldHandler) {
        viewMoreBtn.removeEventListener("click", oldHandler);
    }

    // Crear nuevo handler
    const clickHandler = () => {
        const currentSkip = parseInt(viewMoreBtn.dataset.skip);
        
        getMoreComments(postId, currentSkip, take, (data) => {
            if (!data || data.error) return;

            // data.comments viene del CommentsPaginationDto
            renderComments(commentSection, data.comments, false);

            // Actualizar skip para la próxima página
            viewMoreBtn.dataset.skip = currentSkip + take;

            // Si ya no hay más, escondemos el botón
            if (!data.hasMore) {
                viewMoreBtn.classList.add("hidden");
            }
        });
    };

    // Guardar referencia al handler y agregar evento
    viewMoreBtn._clickHandler = clickHandler;
    viewMoreBtn.addEventListener("click", clickHandler);
}
