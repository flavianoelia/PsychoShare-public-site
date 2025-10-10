document.addEventListener('DOMContentLoaded', () => {
    const postInput = document.querySelector('.post-input');
    const imageButton = document.querySelector('.image-button');
    const attachButton = document.querySelector('.attach-button');

    const elements = [postInput, imageButton, attachButton];

    elements.forEach(element => {
        if (element) {
            element.addEventListener('click', event => {
            event.preventDefault();
            openPostCreationModal(); // función importada desde modal.js
            });
        }
    });
});