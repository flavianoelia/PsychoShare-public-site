const modal = document.getElementById("post-detail-modal");
const modalForm = document.getElementById('modal-form');

const logout = document.getElementById("logout-modal");

function openModal() {
    modal.showModal();
}

function closeModal() {
    modal.close();
    modalForm.reset();
}

// For close the window with the escape key
modal.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeModal();
    }
});

function openLogout() {
    logout.showModal();
}

function closeLogout() {
    logout.close();
}