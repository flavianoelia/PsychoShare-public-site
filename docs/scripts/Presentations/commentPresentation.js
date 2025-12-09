// =======================================
// comment/commentPresentation.js
// =======================================

/**
 * Inicializa la sección de comentarios de un post específico.
 * postNode: nodo <article> del post
 * postId: id del post en backend
 * totalComments: total inicial de comentarios del post
 */
function initializeCommentsForPost(postNode, postId, totalComments = 0) {
    const commentSection = postNode.querySelector(".comment-section");
    if (!commentSection) {
        return;
    }

    // Guardar el postId en el dataset para usarlo después
    commentSection.dataset.postId = postId;
    
    // Initialize total comment count
    commentSection.dataset.totalComments = totalComments.toString();
    
    // Update the display immediately
    updateCommentCount(commentSection, 0);

    const viewMoreBtn = commentSection.querySelector(".view-more");
    const commentInput = commentSection.querySelector(".comment-input");
    const sendBtn = commentSection.querySelector(".submit-comment");

    // Ensure delegated comment menu handlers are initialized (single listener)
    if (typeof initializeCommentMenuDelegation === 'function') {
        initializeCommentMenuDelegation();
    }

    // viewMoreBtn es OPCIONAL (solo existe si hay >2 comentarios)
    if (!commentInput || !sendBtn) {
        return;
    }
    
    // 1) Cargar 2 comentarios iniciales
    getInitialComments(postId, (data) => {
        if (!data || data.error) return;

        // If backend provides total count, use it
        if (data.totalCount !== undefined) {
            commentSection.dataset.totalComments = data.totalCount.toString();
        } else if (data.comments && data.comments.length > 0) {
            // Fallback: if we got exactly 2, there might be more
            // This is not perfect but better than nothing
            commentSection.dataset.totalComments = data.comments.length.toString();
        }
        
        // Update display with correct count
        updateCommentCount(commentSection, 0);

        // data.comments = lista de CommentResponseDto
        renderComments(commentSection, data.comments, true);

        // Mostrar u ocultar "Ver más"
        // Regla: si total > 2, mostrar botón para cargar más
        if (viewMoreBtn) {
            const total = data.totalCount ?? data.comments.length;
            if (total > 2) {
                viewMoreBtn.classList.remove("hidden");
            } else {
                viewMoreBtn.classList.add("hidden");
            }
        }
    });

    // 2) Configurar paginación "Ver más" (solo si existe el botón)
    if (viewMoreBtn) {
        setupCommentViewMore(commentSection, postId, {
            initialSkip: 2,
            pageSize: 5,
        });
    }

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

        // Delegated handlers will manage the menu; no per-node listeners needed

        // Update comment count (+1 for new comment)
        updateCommentCount(commentSection, 1);

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

        // Delegated handlers will manage menu actions for this node.
    });
    
    // Update comment count
    updateCommentCount(commentSection);
}

/**
 * Update the comment counter display
 */
function updateCommentCount(commentSection, delta = 0) {
    // Get or initialize total count
    if (!commentSection.dataset.totalComments) {
        commentSection.dataset.totalComments = '0';
    }
    
    let total = parseInt(commentSection.dataset.totalComments) || 0;
    
    // Apply delta (for create/delete operations)
    if (delta !== 0) {
        total += delta;
        commentSection.dataset.totalComments = total.toString();
    }
    
    const commentCountHeader = commentSection.querySelector('.comment-count-header');
    if (commentCountHeader) {
        commentCountHeader.innerHTML = `<i class="fas fa-comment"></i> ${total} Comentarios`;
    }
}

/**
 * Colapsa los comentarios de vuelta al estado inicial (solo 2)
 */
function collapseComments(commentSection, postId) {
    // Verificar si hay más de 2 comentarios actualmente
    const currentComments = commentSection.querySelectorAll(".comment");
    if (currentComments.length <= 2) return; // Ya está colapsado

    getInitialComments(postId, (data) => {
        if (!data || data.error) return;

        // Renderizar solo los primeros 2 comentarios
        renderComments(commentSection, data.comments, true);

        // Resetear el skip del botón "Ver más"
        const viewMoreBtn = commentSection.querySelector(".view-more");
        if (viewMoreBtn) {
            viewMoreBtn.dataset.skip = "2"; // Resetear a 2
            
            const total = data.totalCount ?? data.comments.length;
            if (total > 2) {
                viewMoreBtn.classList.remove("hidden");
            } else {
                viewMoreBtn.classList.add("hidden");
            }
        }
    });
}

// Listener global para colapsar comentarios al hacer click afuera
document.addEventListener("click", (e) => {
    const allSections = document.querySelectorAll(".comment-section");

    allSections.forEach(section => {
        // Si el click fue DENTRO de esta sección, no hacer nada
        if (section.contains(e.target)) return;

        // Si el click fue afuera, colapsar si tiene postId
        const postId = section.dataset.postId;
        if (postId) {
            collapseComments(section, postId);
        }
    });
});
