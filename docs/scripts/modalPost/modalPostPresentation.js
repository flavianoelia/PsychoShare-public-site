function openPostCreationModal() {
    const modalInstance = new ModalPost();
    const newModalPost = modalInstance.getModalPost();

    document.body.appendChild(newModalPost);

    document.querySelector('header')?.classList.add('blur-active');
    document.querySelector('main')?.classList.add('blur-active');
    document.querySelector('footer')?.classList.add('blur-active');
    document.querySelector('.search-bar')?.classList.add('blur-active');
    document.querySelector('.menu-nav')?.classList.add('blur-active');

    const closeButtons = newModalPost.querySelectorAll('.close-button');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', event => {
            event.preventDefault();
            console.log('Clic en botón de cerrar:', btn);
            closePostCreationModal(newModalPost);
        });
    });

    const imageButtons = newModalPost.querySelectorAll('.image-button');
    imageButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Función para subir imagen no implementada todavía.');
        });
    });

    const attachButtons = newModalPost.querySelectorAll('.attach-button');
    attachButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Función para adjuntar documento no implementada todavía.');
        });
    });
}

function closePostCreationModal(newModalPost) {
    document.body.removeChild(newModalPost);
    document.querySelector('header')?.classList.remove('blur-active');
    document.querySelector('main')?.classList.remove('blur-active');
    document.querySelector('footer')?.classList.remove('blur-active');
    document.querySelector('.search-bar')?.classList.remove('blur-active');
    document.querySelector('.menu-nav')?.classList.remove('blur-active');
}
