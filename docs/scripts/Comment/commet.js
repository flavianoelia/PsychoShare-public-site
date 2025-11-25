// ==============================
// comment/comment.js
// ==============================
class Comment {
    constructor(dto) {
        this.id = dto.id;
        this.text = dto.text;
        this.userId = dto.userId;
        this.userName = dto.userName;
        this.avatarUrl = dto.avatarUrl || "assets/imgwebp/default-avatar.webp";
        this.createdAt = dto.createdAt;

        const perms = getCommentPermissions(this.userId);
        this.canEdit = perms.canEdit;
        this.canDelete = perms.canDelete;
        this.canReport = perms.canReport;
    }

    getNode() {
        const comment = document.createElement("article");
        comment.className = "comment";
        comment.dataset.commentId = this.id;
        comment.dataset.userId = this.userId;

        comment.innerHTML = `
        <div class="comment-header">
            <img src="${this.avatarUrl}" alt="Foto de contacto" class="contact-avatar">
            <p>${this.userName}</p>

            <!-- Botón hamburguesa -->
            <button class="comment-menu-btn" aria-label="Opciones del comentario">
            <i class="fas fa-ellipsis-v"></i>
            </button>

            <!-- Menú de opciones -->
            <div class="comment-menu hidden">
            <button class="edit-comment" ${this.canEdit ? "" : "disabled"}>
                <i class="fas fa-pen-to-square"></i> Editar
            </button>
            <button class="delete-comment" ${this.canDelete ? "" : "disabled"}>
                <i class="fas fa-trash"></i> Eliminar
            </button>
            <button class="report-comment" ${this.canReport ? "" : "disabled"}>
                <i class="fas fa-flag"></i> Reportar
            </button>
            </div>
        </div>

        <div class="comment-content">
            <p class="comment-text">${this.text}</p>
        </div>
        `;

        return comment;
    }
}
