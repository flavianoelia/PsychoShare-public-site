const blurSelectors = [
    'header',
    'main',
    'footer',
    '.search-bar',
    '.menu-nav'
];

function toggleBlur(active) {
    blurSelectors.forEach(sel => {
        document.querySelector(sel)?.classList.toggle('blur-active', active);
    });
}

function addListeners(buttons, handler) {
    buttons.forEach(btn => btn.addEventListener('click', handler));
}

function openPostCreationModal() {
    // Remove any existing modal first
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
        toggleBlur(false);
    }
    
    const modalInstance = new ModalPost();
    const newModalPost = modalInstance.getModalPost();

    document.body.appendChild(newModalPost);
    toggleBlur(true);

    // Load user avatar and name in modal
    const userId = localStorage.getItem("userId");
    if (userId) {
        // Avatar: use avatarRepository's getUserAvatar (callback style)
        if (typeof getUserAvatar === 'function') {
            try {
                getUserAvatar(userId, (res) => {
                    const avatarElement = newModalPost.querySelector('#modal-user-avatar');
                    if (!avatarElement) return;
                    if (res && res.success && res.data && res.data.url) {
                        const img = document.createElement('img');
                        img.id = 'modal-user-avatar';
                        img.className = 'contact-avatar';
                        img.src = res.data.url;
                        img.alt = 'Foto de contacto';
                        img.onerror = function() {
                            this.outerHTML = '<i class="fa-solid fa-circle-user contact-avatar-icon" id="modal-user-avatar"></i>';
                        };
                        avatarElement.replaceWith(img);
                    }
                    // else: keep default icon
                });
            } catch (e) {
                // ignore and keep default icon
            }
        }

        // Load user name using userRepository.getUser (callback style)
        if (typeof getUser === 'function') {
            try {
                getUser(userId, (userData) => {
                    const nameElement = newModalPost.querySelector('.user-info h3');
                    if (userData && !userData.error && userData.name && (userData.lastName || userData.lastname)) {
                        // Support both lastName and lastname keys if backend differs
                        const last = userData.lastName || userData.lastname || '';
                        if (nameElement) nameElement.textContent = `${userData.name} ${last}`.trim();
                    }
                });
            } catch (e) {
                // fallback: do nothing
            }
        }
    }

    // Close button
    addListeners(
        newModalPost.querySelectorAll('.close-button'),
        event => {
            event.preventDefault();
            closePostCreationModal(newModalPost);
        }
    );

    // Image file input
    const imageInput = newModalPost.querySelector('#post-image-input');
    const imageFilename = newModalPost.querySelector('#image-filename');
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                Swal.fire({ icon: 'error', title: 'Archivo muy grande', text: 'La imagen no puede superar 5MB' });
                imageInput.value = '';
                imageFilename.textContent = '';
            } else {
                imageFilename.textContent = file.name;
            }
        }
    });

    // PDF file input
    const pdfInput = newModalPost.querySelector('#post-pdf-input');
    const pdfFilename = newModalPost.querySelector('#pdf-filename');
    pdfInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                Swal.fire({ icon: 'error', title: 'Archivo muy grande', text: 'El PDF no puede superar 10MB' });
                pdfInput.value = '';
                pdfFilename.textContent = '';
            } else {
                pdfFilename.textContent = file.name;
            }
        }
    });

    // Form submission
    const form = newModalPost.querySelector('#create-post-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = newModalPost.querySelector('#title').value.trim();
        const description = newModalPost.querySelector('#description').value.trim();
        const authorship = newModalPost.querySelector('#authorship').value.trim();
        const resume = newModalPost.querySelector('#abstract').value.trim();

        // Validations
        if (title.length < 2 || description.length < 2 || authorship.length < 2 || resume.length < 2) {
            Swal.fire({ 
                icon: 'error', 
                title: 'Error', 
                text: 'Todos los campos deben tener mínimo 2 caracteres',
                footer: `Título: ${title.length} | Descripción: ${description.length} | Autoría: ${authorship.length} | Resumen: ${resume.length}`
            });
            return;
        }

        const formData = new FormData();
        formData.append('Title', title);
        formData.append('Description', description);
        formData.append('Authorship', authorship);
        formData.append('Resume', resume);

        if (imageInput.files[0]) {
            formData.append('Image', imageInput.files[0]);
        }
        if (pdfInput.files[0]) {
            formData.append('Pdf', pdfInput.files[0]);
        }

        // Use postRepository.createPost (callback style)
        if (typeof createPost === 'function') {
            createPost(formData, (result) => {
                if (!result || result.success === false) {
                    const msg = (result && result.message) ? result.message : 'Error al crear post';
                    Swal.fire({ icon: 'error', title: 'Error', text: msg });
                    return;
                }

                Swal.fire({ icon: 'success', title: '¡Listo!', text: 'Publicación creada', timer: 2000, showConfirmButton: false });
                closePostCreationModal(newModalPost);

                // Reload posts - check which page we're on
                if (typeof loadUserPosts === 'function') {
                    loadUserPosts(1, false);
                } else if (typeof loadPosts === 'function') {
                    loadPosts(1, "", false);
                }
            });
        } else {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Operación no soportada: createPost no disponible' });
        }
    });

    return newModalPost;
}

function closePostCreationModal(newModalPost) {
    document.body.removeChild(newModalPost);
    toggleBlur(false);
}

// Initialize modal triggers when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const postInput = document.querySelector('.new-post-form .post-input');
    const imageBtn = document.querySelector('.new-post-form .image-button');
    const attachBtn = document.querySelector('.new-post-form .attach-button');
    
    if (postInput) postInput.addEventListener('click', openPostCreationModal);
    if (imageBtn) imageBtn.addEventListener('click', openPostCreationModal);
    if (attachBtn) attachBtn.addEventListener('click', openPostCreationModal);
});