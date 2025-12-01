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
    this.pdf = post.pdf; // PDF object with url property
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

    // Avatar dinámico con fallback a ícono
    let ownerAvatarHTML;
    if (this.imgOwner && this.imgOwner.trim() !== "") {
      ownerAvatarHTML = `<img src="${this.imgOwner}" alt="Foto de contacto" class="contact-avatar" onerror="this.outerHTML='<i class=\\'fa-solid fa-circle-user contact-avatar-icon\\'></i>'" />`;
    } else {
      ownerAvatarHTML = `<i class="fa-solid fa-circle-user contact-avatar-icon"></i>`;
    }

    const post = document.createElement("article");
    post.className = "article";

    // build comments html with report button and dynamic avatars
    const commentsHtml = this.comments
      .map((c, idx) => {
        let commentAvatarHTML;
        if (c.imgOwner && c.imgOwner.trim() !== "") {
          commentAvatarHTML = `<img src="${c.imgOwner}" alt="Foto de contacto" class="contact-avatar" onerror="this.outerHTML='<i class=\\'fa-solid fa-circle-user contact-avatar-icon\\'></i>'" />`;
        } else {
          commentAvatarHTML = `<i class="fa-solid fa-circle-user contact-avatar-icon"></i>`;
        }

        return `
        <article class="comment">
            <div class="comment-header">
                ${commentAvatarHTML}
                <p>${c.nameOwner}</p>
                <button class="report-comment" data-report-type="comment" data-report-id="${this.title}-c${idx}" aria-label="Reportar comentario" title="Reportar comentario"><i class="fas fa-flag"></i></button>
            </div>
            <div class="comment-content">
                <p>${c.text}</p>
            </div>
        </article>
    `;
      })
      .join("\n");

    post.innerHTML = `
            <section class="post-header" data-user-id="${this.userId}">
                <a href="profile.html?userId=${this.userId}" class="profile-link" aria-label="Ver perfil de ${this.nameOwner}" style="text-decoration:none;color:inherit;display:inline-flex;align-items:center;gap:.5rem">
                    ${ownerAvatarHTML}
                    <div class="user-info">
                        <p class="username">${this.nameOwner}</p>
                        <p class="post-date">${date} ${time}</p>
                    </div>
                </a>
                <div class="dropdown-container">
                    <button class="dropdown-trigger"><i class="fas fa-ellipsis-v"></i></button>
                    <div class="dropdown-menu">
                        ${isOwnPost
                            ? `<button class="dropdown-item edit-post" data-post-id="${this.postId}"><i class="fas fa-edit"></i> Editar</button>
                            <button class="dropdown-item delete-post" data-post-id="${this.postId}"><i class="fas fa-trash"></i> Eliminar</button>`
                            : `<button class="dropdown-item report-post" data-post-id="${this.postId}" data-post-title="${this.title}"><i class="fas fa-flag"></i> Reportar</button>`
                        }
                    </div>
                </div>
            </section>
            <section class="post-content">
                <p>${this.description}</p>
                <h2>${this.title}</h2>
                <p><strong>Autoría:</strong> ${this.authorship}</p>
                <p><strong>Resumen:</strong> ${this.abstract}</p>
                ${
                  this.image
                    ? `<figure>
                    <img src="${this.image}" alt="Imagen del post" class="post-image">
                </figure>`
                    : ""
                }
                <figure>
                    <figcaption>
                        <div class="button-container">
                            <div class="post-buttons">
                                <button class="btn like-button" data-post-id="${
                                  this.postId
                                }">
                                    <i class="fa-regular fa-thumbs-up"></i>
                                    <span class="like-text">${
                                      this.coutLike
                                    } Me gusta</span>
                                </button>
                                <button class="btn comment-button"><i class="fas fa-comment"></i>${
                                  this.comments.length
                                } Comentarios</button>
                                ${
                                  this.pdf && this.pdf.url
                                    ? `<button class="btn pdf-button pdf-view-button" data-pdf-url="${this.pdf.url}" data-post-title="${this.title}">
                                    <i class="fas fa-file-pdf"></i>Ver PDF
                                </button>`
                                    : ""
                                }
                            </div>
                        </div>
                    </figcaption>
                </figure>
            </section>

            <section class="comment-section">
                ${commentsHtml}
                <button class="btn view-more hidden">Ver más</button>
                <div class="add-comment">
                   <i class="fa-solid fa-circle-user contact-avatar-icon"></i>
                    <input type="text" class="comment-input" placeholder="Escribe un comentario">
                    <button class="btn submit-comment"><i class="fas fa-paper-plane"></i>Enviar</button>
                </div>
            </section>
        `;
    // NOTE: initializeCommentsForPost is now called in postPresentation.js AFTER adding to DOM
    // DO NOT call it here as the post is not yet in the DOM

    return post;
  }
}
