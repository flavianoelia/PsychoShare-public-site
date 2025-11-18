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
    const modalInstance = new ModalPost();
    const newModalPost = modalInstance.getModalPost();

    document.body.appendChild(newModalPost);
    toggleBlur(true);

    addListeners(
        newModalPost.querySelectorAll('.close-button'),
        event => {
            event.preventDefault();
            closePostCreationModal(newModalPost);
        }
    );

    addListeners(
        newModalPost.querySelectorAll('.image-button'),
        e => {
            e.preventDefault();
            alert('Función para subir imagen no implementada todavía.');
        }
    );

    addListeners(
        newModalPost.querySelectorAll('.attach-button'),
        e => {
            e.preventDefault();
            alert('Función para adjuntar documento no implementada todavía.');
        }
    );

    validateAndSubmitPostForm();
    return newModalPost;
}

function closePostCreationModal(newModalPost) {
    document.body.removeChild(newModalPost);
    toggleBlur(false);
}