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
        if (response.success) {
            // Clear any previous session data before saving new one
            localStorage.clear();
            
            // Save to localStorage
            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.userId);
            localStorage.setItem('email', response.email);
            
            // Check if user is banned before redirecting
            checkBan(response.userId, function(banResponse) {
                console.log("Ban check response:", banResponse);
                
                // Check if there was an error calling the endpoint
                if (banResponse && banResponse.error) {
                    console.error("Error checking ban status:", banResponse.message);
                    // If there's an error checking ban, let them in anyway (fail open)
                    window.location.href = 'wall.html';
                    return;
                }
                
                if (banResponse && banResponse.isBanned) {
                    // User is banned - clear session and show message
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    localStorage.removeItem('email');

                    Swal.fire({
                        icon: "error",
                        title: "Cuenta bloqueada",
                        html: `
                            <b>Motivo:</b> ${banResponse.banReason || 'No especificado'}<br>
                            <b>Tipo:</b> ${banResponse.banType || 'Desconocido'}<br>
                            ${banResponse.expiryDate ? `<b>Válido hasta:</b> ${new Date(banResponse.expiryDate).toLocaleString()}` : '<b>Ban permanente</b>'}
                        `
                    });
                } else {
                    // User is not banned - redirect to wall
                    window.location.href = 'wall.html';
                }
            });
        } else {
            // CRITICAL FIX: Clear localStorage on failed login to prevent security issue
            // where old tokens could persist after failed login attempts
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('email');
            
            // Handle login error
            alert(response.message || "Error al iniciar sesión. Verificá tus credenciales.");
        }
    });
});
