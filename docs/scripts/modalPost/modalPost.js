class ModalPost {
    getModalPost() {
        const modal = document.createElement('div');
        modal.classList.add('modal-overlay');
        
        modal.innerHTML = ` 
            <main class="modal-form post-modal-form">
                <h1 class="visually-hidden" aria-label="Sección crear publicación">Crear una publicación</h1>
                
                <div class="modal-header">
                    <button class="close-button" aria-label="Cerrar ventana">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="user-info">
                    <img src="assets/imgwebp/flavia.webp" alt="Foto de contacto" class="contact-avatar" aria-label="Foto de perfil del usuario">
                    <h3 aria-label="Nombre de usuario">Flavia Perín</h3>
                </div>

                <div class="form-container">
                    <a href="wall.html" class="close-button" aria-label="Cerrar">
                        <i class="fa-solid fa-xmark"></i>
                    </a>

                    <form action="#" method="post" aria-label="Formulario de publicación">
                        <textarea id="description" aria-label="Contenido de la publicación" placeholder="¿Sobre qué quieres hablar?"></textarea>
                        <input type="text" id="title" aria-label="Título de la publicación" placeholder="Título">
                        <input type="text" id="authorship" aria-label="Autoría" placeholder="Autoría">
                        <textarea id="abstract" aria-label="Resumen" placeholder="Resumen"></textarea>

                        <div class="file-group btn">
                        <a href="#" class="image-button post-image-button" aria-label="Añadir imagen">
                            <i class="fas fa-image post-fa"></i> Adjuntar imagen
                        </a>
                        </div>
                        <div class="file-group btn">
                        <a href="#" class="attach-button post-image-button" aria-label="Adjuntar archivo">
                            <i class="fas fa-paperclip post-fa"></i> Adjuntar documento
                        </a>
                        </div>

                        <a href="wall.html" class="btn submit-comment">
                            <i class="fas fa-paper-plane" aria-label="Enviar"></i>Enviar
                        </a>
                    </form>
                </div>
            </main>
        `;

        return modal; 
    }
}
