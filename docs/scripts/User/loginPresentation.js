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
            // Save to localStorage
            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.userId);
            localStorage.setItem('email', response.email);
            
            // Redirect to wall
            window.location.href = 'wall.html';
        } else {
            // Handle login error
            alert(response.message || "Error al iniciar sesión. Verificá tus credenciales.");
        }
    });
});
