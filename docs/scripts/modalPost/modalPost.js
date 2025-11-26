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
                    <img id="modal-user-avatar" src="assets/imgwebp/flavia.webp" alt="Foto de contacto" class="contact-avatar" aria-label="Foto de perfil del usuario">
                    <h3 aria-label="Nombre de usuario">Usuario</h3>
                </div>

                <div class="form-container">
                    <form id="create-post-form" action="#" method="post" aria-label="Formulario de publicación">
                        <textarea id="description" class="post-input" aria-label="Contenido de la publicación" placeholder="¿Sobre qué quieres hablar?" required></textarea>
                        <input type="text" id="title" aria-label="Título de la publicación" placeholder="Título" required>
                        <input type="text" id="authorship" aria-label="Autoría" placeholder="Autoría" required>
                        <textarea id="abstract" aria-label="Resumen" placeholder="Resumen" required></textarea>

                        <div class="file-group btn">
                            <label for="post-image-input" class="image-button post-image-button" aria-label="Añadir imagen">
                                <i class="fas fa-image post-fa"></i> Adjuntar imagen
                                <input type="file" id="post-image-input" accept="image/jpeg,image/jpg,image/png,image/gif" style="display:none">
                            </label>
                            <span id="image-filename" style="font-size: 0.9rem; color: #666;"></span>
                        </div>
                        <div class="file-group btn">
                            <label for="post-pdf-input" class="attach-button post-image-button" aria-label="Adjuntar archivo">
                                <i class="fas fa-paperclip post-fa"></i> Adjuntar documento
                                <input type="file" id="post-pdf-input" accept="application/pdf" style="display:none">
                            </label>
                            <span id="pdf-filename" style="font-size: 0.9rem; color: #666;"></span>
                        </div>

                        <button type="submit" class="btn submit-comment">
                            <i class="fas fa-paper-plane" aria-label="Enviar"></i>Enviar
                        </button>
                    </form>
                </div>
            </main>
        `;

        return modal; 
    }
}
