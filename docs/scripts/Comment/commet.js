class Comment {
    constructor(comment) {
        this.imgOwner = comment.imgOwner;       
        this.nameOwner = comment.nameOwner;     
        this.content = comment.content;         
    } 

    getNode() {
        const comment = document.createElement("article");
        comment.className = "comment";

        comment.innerHTML = `
            <div class="comment-header">
                <img src="${this.imgOwner}" alt="Foto de contacto" class="contact-avatar">
                <p>${this.nameOwner}</p>
            </div>
            <div class="comment-content">
                <p>${this.content}</p>
            </div>
        `;
        return comment;
    }
}
