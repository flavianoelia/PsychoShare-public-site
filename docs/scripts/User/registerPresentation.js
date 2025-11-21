const nameInput = document.getElementById("name");
const lastnameInput = document.getElementById("lastname");
const emailInput = document.getElementById("mail");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword"); 
const termsCheckbox = document.getElementById("terms");
const registerButton = document.getElementById("registerButton");

/* Validation of the name format */
nameInput.addEventListener("blur", () => {
    const nameTrimed = nameInput.value.trim();
    
    nameInput.classList.remove("is-invalid");
    nameError.style.display = "none";
    
    if (!validateName(nameTrimed)) {
        nameInput.classList.add("is-invalid");
        nameError.style.display = "block";
        return;
    }
});

/* Validation of the lastname format */
lastnameInput.addEventListener("blur", () => {
    const lastnameTrimed = lastnameInput.value.trim();
    
    lastnameInput.classList.remove("is-invalid");
    lastnameError.style.display = "none";
    
    if (!validateLastName(lastnameTrimed)) {
        lastnameInput.classList.add("is-invalid");
        lastnameError.style.display = "block";
        return;
    }
});

//Integrar ambas validacione
emailInput.addEventListener("blur", () => {
    const emailTrimed = emailInput.value.trim();

    emailInput.classList.remove("is-invalid");
    emailError.style.display = "none";

    if (!validateEmail(emailTrimed)) {
        emailInput.classList.add("is-invalid");
        emailError.style.display = "block";
        return;
    }

    //ASINCRONICO
    existsMail(emailTrimed, data => {
        if (data.exists) {
            emailInput.classList.add("is-invalid");
            emailError.textContent = "El correo electrónico ya existe";
            emailError.style.display = "block";
        }
    });
});


passwordInput.addEventListener("blur",() => {
    const validatePasswordTrimed = passwordInput.value.trim();
    
    passwordInput.classList.remove("is-invalid");
    passwordError.style.display = "none";
    
    if (!validatePassword(validatePasswordTrimed)) {
        passwordInput.classList.add("is-invalid");
        passwordError.style.display = "block";
        return;
    }
});

confirmPasswordInput.addEventListener("blur", () => {
    const passwordTrimed = passwordInput.value.trim();
    const confirmPasswordTrimed = confirmPasswordInput.value.trim();

    confirmPasswordInput.classList.remove("is-invalid");
    confirmPasswordError.style.display = "none";

    if (!validateConfirmPassword(passwordTrimed, confirmPasswordTrimed)) {
        confirmPasswordInput.classList.add("is-invalid");
        confirmPasswordError.style.display = "block";
        return;
    }
});

function getValidationMessage() {
    const nameValue = nameInput.value.trim();
    const lastnameValue = lastnameInput.value.trim();
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();
    const confirmPasswordValue = confirmPasswordInput.value.trim();
    
    // Check each field and return specific message
    if (!nameValue) return "Por favor ingresá tu nombre";
    if (!validateName(nameValue)) return "El nombre debe tener entre 2 y 30 caracteres y solo letras";
    
    if (!lastnameValue) return "Por favor ingresá tu apellido";
    if (!validateLastName(lastnameValue)) return "El apellido debe tener entre 2 y 30 caracteres y solo letras";
    
    if (!emailValue) return "Por favor ingresá tu email";
    if (!validateEmail(emailValue)) return "Por favor ingresá un email válido";
    
    if (!passwordValue) return "Por favor ingresá una contraseña";
    if (!validatePassword(passwordValue)) return "La contraseña debe tener mínimo 8 caracteres, incluir mayúscula, minúscula, número y símbolo";
    
    if (!confirmPasswordValue) return "Por favor confirmá tu contraseña";
    if (!validateConfirmPassword(passwordValue, confirmPasswordValue)) return "Las contraseñas no coinciden";
    
    if (!termsCheckbox.checked) return "Debés aceptar los Términos y Condiciones para continuar";
    
    return null; // All valid
}

registerButton.addEventListener("click", (event) => {
    event.preventDefault();
    
    const errorMessage = getValidationMessage();
    if(errorMessage) {
        alert(errorMessage);
        return;
    }
    
    const user = {
        name: nameInput.value.trim(),
        lastname: lastnameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value.trim()
    };

    createUser(user, (data) => {
        if (data && data.success) {
            alert("¡Registro exitoso! Ahora podés iniciar sesión");
            window.location.href = "index.html";
        } else {
            alert(data?.message || "Error al registrarse. Intentá nuevamente");
        }
    });
});