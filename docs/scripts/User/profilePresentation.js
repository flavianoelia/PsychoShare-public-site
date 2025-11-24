function openModal() {
    const elements = document.querySelectorAll('.post-input, .image-button, .attach-button');
    elements.forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            openPostCreationModal();
        });
    });
}

openModal();