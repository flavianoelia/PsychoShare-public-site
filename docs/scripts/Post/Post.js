class Post {
  constructor(post) {
    this.postId = post.postId || post.id; // Backend puede usar 'id' o 'postId'
    this.userId = post.userId;
    this.imgOwner = post.imgOwner;
    this.nameOwner = post.nameOwner;
    this.description = post.description;
    this.title = post.title;
    this.authorship = post.authorship;
    this.abstract = post.abstract;
    this.image = post.image;
    this.coutLike = post.countLike || 0;
    this.comments = post.comments || [];
    this.createdAt = post.createdAt; // Fecha ISO del backend
  }

  //template string que tiene un post
  getNode() {
    const currentUserId = localStorage.getItem("userId");
    const isOwnPost = this.userId == currentUserId;

    // Formatear fecha y hora
    const { date, time } = formatDateTime(this.createdAt);

    const post = document.createElement("article");
    post.className = "article";
    
    // build comments html with report button
    const commentsHtml = this.comments.map((c, idx) => `
        <article class="comment">
            <div class="comment-header">
                <img src="${c.imgOwner}" alt="Foto de contacto" class="contact-avatar">
                <p>${c.nameOwner}</p>
                <button class="report-comment" data-report-type="comment" data-report-id="${this.title}-c${idx}" aria-label="Reportar comentario" title="Reportar comentario"><i class="fas fa-flag"></i></button>
            </div>
            <div class="comment-content">
                <p>${c.text}</p>
            </div>
        </article>
    `).join('\n');

    post.innerHTML = `
            <section class="post">
                <img src="${this.imgOwner}" alt="Foto de contacto" class="contact-avatar">
                <div class="post-info">
                    <p class="name">${this.nameOwner}</p>
                    <p class="timestamp">${date}</p>
                    <p class="timestamp">${time}</p>
                </div>
                ${
                  !isOwnPost
                    ? `<button class="btn btn-sm follow-toggle-btn" data-user-id="${this.userId}" style="margin-left: auto;">
                    <span class="spinner-border spinner-border-sm d-none" role="status"></span>
                    <span class="btn-text">Cargando...</span>
                </button>`
                    : ""
                }
            </section>
            <section class="post-content">
                <p>${this.description}</p>
                <h2>${this.title}</h2>
                <p><strong>Autoría:</strong> ${this.authorship}</p>
                <p><strong>Resumen:</strong> ${this.abstract}</p>
                <figure>
                    <img src="${this.image}" alt="Imagen del post" class="post-image">
                    <figcaption>
                        <div class="button-container">
                            <div class="post-buttons">
                                <button class="btn like-button" data-post-id="${this.postId}">
                                    <i class="fa-regular fa-thumbs-up"></i>
                                    <span class="like-text">${this.coutLike} Me gusta</span>
                                </button>
                                <button class="btn comment-button"><i class="fas fa-comment"></i>${
                                  this.comments.length
                                } Comentarios</button>
                                <button class="btn pdf-button"><i class="fas fa-file-pdf"></i>Ver PDF</button>
                                <button class="btn btn-report" data-report-type="post" data-report-id="${this.title}" type="button"><i class="fas fa-flag"></i> Reportar</button>
                            </div>
                        </div>
                    </figcaption>
                </figure>
            </section>

            <section class="comment-section">
                ${commentsHtml}
                ${this.comments.length > 2 ? '<button class="btn view-more">Ver más</button>' : ''}
                <div class="add-comment">
                   <img src="assets/imgwebp/flavia.webp" alt="Foto de contacto" class="contact-avatar">
                    <input type="text" class="comment-input" placeholder="Escribe un comentario">
                    <button class="btn submit-comment"><i class="fas fa-paper-plane"></i>Enviar</button>
                </div>
            </section>
        `;

    /*
        const commentSection = document.createElement("section");
        commentSection.className = "comment-section";

        const previewComments = this.comments.slice(0, 2);
        previewComments.forEach(c => {
            const commentObj = new Comment(c);
            commentSection.appendChild(commentObj.getNode());
        });

        if(this.comments.length > 2){
            const viewMoreBtn = document.createElement("button");
            viewMoreBtn.className = "btn view-more";
            viewMoreBtn.textContent = "Ver más";
            commentSection.appendChild(viewMoreBtn);
        }

        const addComment = document.createElement("div");
        addComment.className = "add-comment";
        addComment.innerHTML = `
            <img src="assets/imgwebp/flavia.webp" alt="Foto de contacto" class="contact-avatar">
            <input type="text" class="comment-input" placeholder="Escribe un comentario">
            <button class="btn submit-comment"><i class="fas fa-paper-plane"></i>Enviar</button>
        `;
        commentSection.appendChild(addComment);

        post.appendChild(commentSection);
        */

    return post;
  }
}
