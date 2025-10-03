const nameInput = document.getElementById("name");
const lastnameInput = document.getElementById("lastname");
const emailInput = document.getElementById("mail");
const passwordInput = document.getElementById("password");
const registerButton = document.getElementById("registerButton");

/* Validation of the name format */
nameInput.addEventListener("blur", () => {
    let nameTrimed = nameInput.value.trim();
    if (!nameRegex.test(nameTrimed)) {
        nameInput.classList.add("is-invalid");
        nameError.style.display = "block";
        return false;
    } else {
        nameInput.classList.remove("is-invalid");
        nameError.style.display = "none";
        return true;
    }
});

/* Validation of the lastname format */
lastnameInput.addEventListener("blur", () => {
    let lastnameTrimed = lastnameInput.value.trim();
    if (!nameRegex.test(lastnameTrimed)) {
        lastnameInput.classList.add("is-invalid");
        lastnameError.style.display = "block";
        return false;
    } else {
        lastnameInput.classList.remove("is-invalid");
        lastnameError.style.display = "none";
        return true;
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

/* Validation of the password format */
function validatePassword() {
    let passwordTrimed = passwordInput.value.trim();
    if (!passwordRegex.test(passwordTrimed)) {
        passwordInput.classList.add("is-invalid");
        passwordError.style.display = "block";
        return false;
    } else {
        passwordInput.classList.remove("is-invalid");
        passwordError.style.display = "none";
        return true;
    }
}
passwordInput.addEventListener("blur", validatePassword);

const confirmPasswordInput = document.getElementById("confirmPassword");

/* Validation of confirm password */
function validateConfirmPassword() {
    let passwordTrimed = passwordInput.value.trim();
    let confirmPasswordTrimed = confirmPasswordInput.value.trim();

    if (passwordTrimed !== confirmPasswordTrimed || confirmPasswordTrimed === "") {
        confirmPasswordInput.classList.add("is-invalid");
        confirmPasswordError.style.display = "block";
        return false;
    } else {
        confirmPasswordInput.classList.remove("is-invalid");
        confirmPasswordError.style.display = "none";
        return true;
    }
}
confirmPasswordInput.addEventListener("blur", validateConfirmPassword);

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