class Comment {
    constructor(comment) {
        this.id = comment.id;
        this.userId = comment.userId;
        this.imgOwner = comment.imgOwner;       
        this.nameOwner = comment.nameOwner;     
        this.content = comment.text || comment.content || "";         
    } 

    getNode() {
        const currentUserId = localStorage.getItem("userId");
        const isOwnComment = this.userId == currentUserId;
        
        const comment = document.createElement("article");
        comment.className = "comment";
        comment.dataset.commentId = this.id;
        comment.dataset.userId = this.userId;

        // Avatar dinámico con fallback
        let avatarHTML;
        if (this.imgOwner && this.imgOwner.trim() !== "") {
            avatarHTML = `<img src="${this.imgOwner}" alt="Foto de contacto" class="contact-avatar" onerror="this.outerHTML='<i class=\\'fa-solid fa-circle-user contact-avatar-icon\\'></i>'" />`;
        } else {
            avatarHTML = `<i class="fa-solid fa-circle-user contact-avatar-icon"></i>`;
        }

        comment.innerHTML = `
            <div class="comment-header">
                ${avatarHTML}
                <p>${this.nameOwner}</p>

                <!-- Botón hamburguesa -->
                <button class="comment-menu-btn" aria-label="Opciones del comentario">
                    <i class="fas fa-ellipsis-v"></i>
                </button>

                <div class="comment-menu hidden">
                    ${isOwnComment ? `
                        <button class="edit-comment">
                            <i class="fas fa-pen-to-square"></i> Editar
                        </button>
                        <button class="delete-comment">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    ` : ''}
                    <button class="report-comment">
                        <i class="fas fa-flag"></i> Reportar
                    </button>
                </div>
            </div>

            <div class="comment-content">
                <p class="comment-text">${this.content}</p>
            </div>
        `;

        return comment;
    }
}
