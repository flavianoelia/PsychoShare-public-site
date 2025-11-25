function initializeComments(postNode, postId) {
    const commentSection = postNode.querySelector(".comment-section");
    const viewMoreBtn = commentSection.querySelector(".view-more");
    const commentInput = commentSection.querySelector(".comment-input");
    const sendBtn = commentSection.querySelector(".submit-comment");


    let skip = 2; // ya cargamos 2
    const take = 5; // por página


    // CARGAR 2 COMENTARIOS INICIALES
    getInitialComments(postId, (data) => {
        renderComments(commentSection, data.comments, true);
        if (!data.hasMore) viewMoreBtn.classList.add("hidden");
    });

    // VER MÁS
    viewMoreBtn.addEventListener("click", () => {
        getMoreComments(postId, skip, take, (data) => {
            renderComments(commentSection, data.comments, false);
            skip += take;

            if (!data.hasMore) viewMoreBtn.classList.add("hidden");
        });
    });


    // ENVIAR NUEVO COMENTARIO
    sendBtn.addEventListener("click", () => {
        const text = commentInput.value.trim();
        if (text === "") return;

        createComment(postId, text, (data) => {
            if (data.error) return;

            const newComment = new Comment({
                ...data,
                canEdit: true,
                canDelete: true,
            });

            const viewMoreBtn = commentSection.querySelector(".view-more");

            commentSection.insertBefore(node, viewMoreBtn);

            attachMenuEvents(node, newComment);
            
            commentInput.value = "";
        });
    });

}

//renderizar comentarios
function renderComments(commentSection, comments, clean) {
if (clean) {
    const oldComments = commentSection.querySelectorAll(".comment");
    oldComments.forEach(c => c.remove());
}

const viewMoreBtn = commentSection.querySelector(".view-more");

comments.forEach((c) => {
    const comment = new Comment({
        id: c.id,
        text: c.text,
        userId: c.userId,
        userName: c.userName,
        avatarUrl: c.avatarUrl,
        canEdit: c.userId == localStorage.getItem("userId"),
        canDelete: c.userId == localStorage.getItem("userId") || isAdmin(),
    });

        const node = comment.getNode();
        commentSection.insertBefore(node, viewMoreBtn);

        attachMenuEvents(node, comment);
    });
}


// MENU HAMBURGUESA
function attachMenuEvents(node, comment) {
    const menuBtn = node.querySelector(".comment-menu-btn");
    const menu = node.querySelector(".comment-menu");

    menuBtn.addEventListener("click", () => {
        menu.classList.toggle("hidden");
    });

    const editBtn = node.querySelector(".edit-comment");
    const deleteBtn = node.querySelector(".delete-comment");

    if (editBtn) {
        editBtn.addEventListener("click", () => openEditComment(node, comment));
    }

    if (deleteBtn) {
        deleteBtn.addEventListener("click", () => deleteComment(node, comment));
    }
}


// EDITAR
function openEditComment(node, comment) {
    const textNode = node.querySelector(".comment-text");

    const newText = prompt("Editar", textNode.textContent);
    if (!newText || newText.trim() === "") return;

    editComment(comment.id, newText.trim(), (data) => {
        textNode.textContent = data.text;
    });
}


// ELIMINAR
function deleteComment(node, comment) {
    deleteCommentApi(comment.id, (data) => {
        if (!data.error) node.remove();
    });
}


function isAdmin() {
    return localStorage.getItem("roleId") >= 2;
    }