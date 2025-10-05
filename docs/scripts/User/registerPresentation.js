const nameInput = document.getElementById("name");
const lastnameInput = document.getElementById("lastname");
const emailInput = document.getElementById("mail");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword"); 
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

function validated() {
    const validateName = validateName(); 
    const validateLastname = validateLastname(); 
    const validatePassword = validatePassword(); 
    const validateConfirmPassword = validateConfirmPassword();
    
    if (!nameIsValid || !lastnameIsValid || !passwordIsValid || !confirmPasswordIsValid || !emailFormatIsValid) {
        return false;
    }

    return true;
}

registerButton.addEventListener("click", () => {
    if(!validated()) return;
    
    const user = {
        name: nameInput.value,
        lastname: lastnameInput.value,
        email: emailInput.value,
        password: passwordInput.value
    };

    createUser(user, (data) => {
        //sweet alert: TODO OK.
        alert(data.message);
        window.location.href = `/Wall.html?email=${encodeURIComponent(emailInput.value)}`;
    });
});