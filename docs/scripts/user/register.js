const nameInput = document.getElementById("name");
const lastnameInput = document.getElementById("lastname");
const emailInput = document.getElementById("mail");
const passwordInput = document.getElementById("password");
const registerButton = document.getElementById("registerButton");

const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{2,30}$/;
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

/* Validation of the name format */
function validateName() {
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
}
nameInput.addEventListener("blur", validateName);

/* Validation of the lastname format */
function validateLastname() {
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
}
lastnameInput.addEventListener("blur", validateLastname);

/* Validation of the email format */
function validateEmail() {
    let emailTrimed = emailInput.value.trim();
    if (!emailRegex.test(emailTrimed)) {
        emailInput.classList.add("is-invalid");
        emailError.style.display = "block";
        return false;
    } else {
        emailInput.classList.remove("is-invalid");
        emailError.style.display = "none";
        return true;
    }
}

//Validar existencia en la base de dato
function checkEmailExists(email, callback) {
    const url = `http://localhost:5174/User/check-email?email=${encodeURIComponent(email)}`;
    const config = {
        method: 'GET'
    };
    debugger
    server(url, config, function(data) {
        debugger
        callback(data.exists);
    });
}

//Integrar ambas validacione
function validateAndCheckEmail() {
    debugger
    if (!validateEmail()) return;

    const emailTrimed = emailInput.value.trim();

    checkEmailExists(emailTrimed, function(exists) {
        debugger
        if (exists) {
            emailInput.classList.add("is-invalid");
            emailError.textContent = "Error en email"
            emailError.style.display = "block";
            callback(false);

        } else {
            emailInput.classList.remove("is-invalid");
            emailError.style.display = "none";
            callback(true);

        }
    });
}

emailInput.addEventListener("blur", validateAndCheckEmail);

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

function validated(callback){
    const validateName = validateName(); 
    const validateLastname = validateLastname(); 
    const validatePassword = validatePassword(); 
    const validateConfirmPassword = validateConfirmPassword();
    //const validateAndCheckEmail = validateAndCheckEmail();
    if (!nameIsValid || !lastnameIsValid || !passwordIsValid || !confirmPasswordIsValid || !emailFormatIsValid) {
        callback(false);
        return;
    }
}

function createUser(response){
    if (response.success) {
        window.location.href = `/Wall.html?email=${encodeURIComponent(emailInput.value)}`;
    }
}

function registerUser(){
    validated(function(esValido){
        if (!esValido)return;
        server('https://localhost:5174/', {
            method: 'POST',
            body: JSON.stringify({
                name: nameInput.value,
                lastname: lastnameInput.value,
                email: emailInput.value,
                password: passwordInput.value
            })
        }, createUser);
    })
}
registerButton.addEventListener("click", registerUser);