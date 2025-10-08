function openModal() {
    const postInput = document.querySelector('.post-input');
    const imageButton = document.querySelector('.image-button');
    const attachButton = document.querySelector('.attach-button');

    const openElementsModal = [postInput, imageButton, attachButton];

    openElementsModal.forEach(element => {
        if (element) {
            element.addEventListener('click', (e) => {
            e.preventDefault();
            openPostCreationModal();
            });
        }
    });
    
    openModal() 
}