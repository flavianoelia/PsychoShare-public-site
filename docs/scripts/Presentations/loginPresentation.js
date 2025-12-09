const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("mail");
const passwordInput = document.getElementById("password");

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    // Basic validation
    if (!email || !password) {
        alert("Por favor completá todos los campos");
        return;
    }
    
    if (!validateEmail(email)) {
        alert("Por favor ingresá un email válido");
        return;
    }
    
    // Call login function
    login(email, password, function(response) {
        console.log("Login response:", response);

        // The backend typically returns a token/userId/email on success.
        // Some endpoints do not return a `success` boolean, so prefer checking
        // for the presence of the token (defensive).
        if (response && !response.error && response.token) {
            // Clear any previous session data before saving new one
            localStorage.clear();

            // Save to localStorage
            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.userId);
            localStorage.setItem('email', response.email);
            localStorage.setItem('connectedUsers', response.connectedUsers);

            // 🔒 Chequear si está baneado
            // Nota: el backend devuelve un booleano (true/false) para /api/Ban/check/{userId}
            checkBan(response.userId, function (banResponse) {
                // Manejar varios formatos posibles: booleano o { isBanned: bool }
                if (banResponse && banResponse.error) {
                    // Error al consultar el estado de ban; informar y evitar redireccionar
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: banResponse.message || 'No se pudo verificar el estado de la cuenta.'
                    });
                    return;
                }

                const isBanned = (typeof banResponse === 'boolean') ? banResponse : !!(banResponse && banResponse.isBanned);

                if (isBanned) {
                    // Limpiar sesión
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    localStorage.removeItem('email');
                    localStorage.removeItem('connectedUsers');

                    // Si el backend devolvió detalles del baneo, mostrarlos
                    if (banResponse && typeof banResponse === 'object' && banResponse.isBanned) {
                        const reason = banResponse.banReason || 'No especificado';
                        const type = banResponse.banType || 'No especificado';
                        const expiry = banResponse.expiryDate ? new Date(banResponse.expiryDate).toLocaleString() : null;

                        const html = `
                            <div style="text-align:left">
                                <p><strong>Motivo:</strong> ${reason}</p>
                                <p><strong>Tipo:</strong> ${type}</p>
                                ${expiry ? `<p><strong>Válido hasta:</strong> ${expiry}</p>` : ''}
                            </div>
                        `;

                        Swal.fire({
                            icon: 'error',
                            title: 'Cuenta bloqueada',
                            html: html,
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Cuenta bloqueada',
                            text: 'Tu cuenta está bloqueada. Contactá al soporte si crees que es un error.'
                        });
                    }

                    return;
                }

                // Not banned — redirect to wall
                window.location.href = 'wall.html';
            });
        } else {
            // Clear any residual session data
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('email');

            // Handle login error: show message from server if present
            Swal.fire({
                icon: 'error',
                title: 'Error al iniciar sesión',
                text: response?.message || 'Verificá tus credenciales.'
            });
        }
    });
});
