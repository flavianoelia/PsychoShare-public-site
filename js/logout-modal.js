document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.querySelector('.logout-button');

    if (!logoutButton) return;

    logoutButton.addEventListener('click', () => {
        if (document.querySelector('.modal-overlay')) return;

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');

        const modal = document.createElement('div');
        modal.className = 'logout-modal';

        const title = document.createElement('p');
        title.className = 'logout-title';
        title.textContent = '¿Estás seguro que deseas cerrar la sesión?';

        const actions = document.createElement('div');
        actions.className = 'logout-actions';

        const confirmButton = document.createElement('button');
        confirmButton.className = 'btn logout-confirm';
        confirmButton.textContent = 'Cerrar sesión';

        const cancelButton = document.createElement('button');
        cancelButton.className = 'btn logout-cancel';
        cancelButton.textContent = 'Cancelar';

      
        confirmButton.addEventListener('click', () => {
            window.location.href = '/login.html'; // o donde corresponda cerrar sesión
        });

    
        cancelButton.addEventListener('click', () => {
            overlay.remove();
        });

        actions.appendChild(confirmButton);
        actions.appendChild(cancelButton);
        modal.appendChild(title);
        modal.appendChild(actions);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
    });
});
