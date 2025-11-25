class Comment {
    constructor(dto) {
        this.id = dto.id;
        this.text = dto.text;
        this.userId = dto.userId;
        this.userName = dto.userName;
        this.avatarUrl = dto.avatarUrl;
        this.createdAt = dto.createdAt;

        const localUserId = Number(localStorage.getItem("userId"));
        const roleId = Number(localStorage.getItem("roleId") || 1);

        this.canEdit = dto.userId === localUserId;
        this.canDelete = dto.userId === localUserId || roleId >= 2;
        this.canBan = roleId >= 2;
    }

    getNode() {
        const comment = document.createElement("article");
        comment.className = "comment";

        comment.innerHTML = `
            <div class="comment-header">
                <img src="${this.avatarUrl}" alt="Foto de contacto" class="contact-avatar">
                <p>${this.userName}</p>

                <button class="comment-menu-btn">
                    <i class="fas fa-ellipsis-v"></i>
                </button>

                <div class="comment-menu hidden">
                    <button class="edit-comment" ${this.canEdit ? "" : "disabled"}> <i class="fas fa-solid fa-pen-to-square"></i> Editar</button>
                    <button class="delete-comment" ${this.canDelete ? "" : "disabled"}> <i class="fas fa-solid fa-trash"></i> Eliminar</button>
                    <button class="ban-comment" ${this.canBan ? "" : "disabled"}> <i class="fas fa-solid fa-ban"></i> Banear</button>
                </div>
            </div>
            
            <div class="comment-content">
                <p class="comment-text">${this.text}</p>
            </div>
        `;
        return comment;
    }
}
