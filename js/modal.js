document.addEventListener('DOMContentLoaded', () => {
    const createPostButton = document.querySelector('#create-post-btn');
    
    if (!createPostButton) {
        console.log('Error: No se encontró el botón #create-post-btn');
        return;
    }

    createPostButton.addEventListener('click', () => {
       
        if (document.querySelector('.modal-overlay')) {
            return;
        }

        
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');

        
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '×';
        closeButton.className = 'modal-close-button';
        closeButton.setAttribute('aria-label', 'Cerrar');

        
        const iframe = document.createElement('iframe');
        iframe.src = '/post-form.html';
        iframe.className = 'modal-iframe';

        
        overlay.appendChild(closeButton);
        overlay.appendChild(iframe);

       
        document.body.appendChild(overlay);

       
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });

        
        closeButton.addEventListener('click', () => {
            overlay.remove();
        });
    });
});
