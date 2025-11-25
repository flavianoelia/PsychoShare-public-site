class Post {
    constructor(post){
        this.id = post.id;
        this.userId = post.userId;
        this.imgOwner = post.imgOwner;
        this.nameOwner = post.nameOwner;
        this.lastnameOwner = post.lastnameOwner;
        this.description = post.description;
        this.title = post.title;
        this.authorship = post.authorship;
        this.abstract = post.abstract;
        this.image = post.image;
        this.coutLike = post.countLike ||0;
    }

    getNode(){
        const post = document.createElement("article");
        post.className = "article";
        post.innerHTML = `
            <section class="post">
                <img src=${this.imgOwner} alt="Foto de contacto" class="contact-avatar">
                <div class="post-info">
                    <p class="name">${this.nameOwner}</p>
                    <p class="timestamp">18 junio 2025</p>
                    <p class="timestamp">17:40</p>
                </div>
            </section>
            <section class="post-content">
                <p>${this.description}</p>
                <h2>${this.title}</h2>
                <p><strong>Autoría:</strong>${this.authorship}</p>
                <p><strong>Resumen:</strong>${this.abstract}</p>
                <figure>
                    <img src=${this.image} alt="Imagen del post" class="post-image">
                    <figcaption>
                        <div class="button-container">
                            <div class="post-buttons">
                                <button class="btn like-button"><i class="fas fa-thumbs-up"></i>${this.coutLike} Me gusta</button>
                                <button class="btn comment-button"><i class="fas fa-comment"></i>${this.comments.length} Comentarios</button>
                                <button class="btn pdf-button"><i class="fas fa-file-pdf"></i>Ver PDF</button>
                            </div>
                        </div>
                    </figcaption>
                </figure>
            </section>

            <section class="comment-section">

                <button class="btn view-more">Ver más</button>

                <div class="add-comment">
                    <img src="assets/imgwebp/flavia.webp" alt="Foto de contacto" class="contact-avatar">
                    <input type="text" class="comment-input" placeholder="Escribe un comentario">
                    <button class="btn submit-comment">
                        <i class="fas fa-paper-plane"></i>Enviar
                    </button>
                </div>
            </section>
        `;
    
        initializeComments(post, this.id);

        return post;
    }
}

