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
    const token = localStorage.getItem("token");
    if (userId && token) {
        // Load avatar
        fetch(`${API_BASE_URL}/api/Avatar/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
            const avatar = newModalPost.querySelector('#modal-user-avatar');
            if (data && data.url && avatar) {
                avatar.src = data.url;
            }
        })
        .catch(() => {});

        // Load user name
        fetch(`${API_BASE_URL}/api/User/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
            const nameElement = newModalPost.querySelector('.user-info h3');
            if (data && data.name && data.lastName && nameElement) {
                nameElement.textContent = `${data.name} ${data.lastName}`;
            }
        })
        .catch(() => {});
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
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = newModalPost.querySelector('#title').value.trim();
        const description = newModalPost.querySelector('#description').value.trim();
        const authorship = newModalPost.querySelector('#authorship').value.trim();
        const resume = newModalPost.querySelector('#abstract').value.trim();
        
        console.log('Valores capturados:', { title, description, authorship, resume });
        console.log('Longitudes:', { 
            title: title.length, 
            description: description.length, 
            authorship: authorship.length, 
            resume: resume.length 
        });
        
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
            console.log('Imagen adjunta:', imageInput.files[0].name, imageInput.files[0].size, 'bytes');
            formData.append('Image', imageInput.files[0]);
        }
        if (pdfInput.files[0]) {
            console.log('PDF adjunto:', pdfInput.files[0].name, pdfInput.files[0].size, 'bytes');
            formData.append('Pdf', pdfInput.files[0]);
        }
        
        console.log('FormData preparado para enviar');
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/post`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(Array.isArray(error) ? error.join(', ') : error.message || 'Error al crear post');
            }
            
            Swal.fire({ icon: 'success', title: '¡Listo!', text: 'Publicación creada', timer: 2000, showConfirmButton: false });
            closePostCreationModal(newModalPost);
            
            // Reload posts - check which page we're on
            if (typeof loadUserPosts === 'function') {
                // We're on profile page
                loadUserPosts(1, false);
            } else if (typeof loadPosts === 'function') {
                // We're on wall page
                loadPosts(1, "", false);
            }
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: error.message });
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