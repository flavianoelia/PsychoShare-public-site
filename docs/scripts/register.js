const nameInput = document.getElementById("name");
const lastnameInput = document.getElementById("lastname");
const emailInput = document.getElementById("mail");
const passwordInput = document.getElementById("password");

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

function availableEmailAsync() {
    return new Promise((resolve) => {
        const email = emailInput.value;
        checkEmailExists(email, function(exists) {
            if (exists) {
                emailInput.classList.add("is-invalid");
                emailError.textContent = "El mail ya existe";
                emailError.style.display = "block";
            } else {
                emailInput.classList.remove("is-invalid");
                emailError.style.display = "none";
            }
            resolve(!exists);
        });
    });
}

async function validateEmailBeforeCreating() {
    const canCreate = await availableEmailAsync();
    if (canCreate) {
        return true;
    } else {
    return false;
    }
}

function checkEmailExists(email, callback) {
    server(`https://localhost:8080/check-email?email=${encodeURIComponent(email)}`, { method: 'GET' }, function(response) {
        callback(response.exists);
    });
}

async function validateEmailFull() {
    const formatoValido = validateEmail();
    if (!formatoValido) return false;
    const disponible = await validateEmailBeforeCreating();
    return disponible;
}

emailInput.addEventListener("blur", () => { validateEmailFull(); });

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

function createUser(){
    alert("usuario creado")
}

async function registerUser(){
    const esValido = await validatedFormForRegister();
    if (esValido){
        server('https://localhost:8080/register', {
            method: 'POST',
            body: JSON.stringify({
                name: nameInput.value,
                lastname: lastnameInput.value,
                email: email,
                password: passwordInput.value
            })
        }, createUser);
    }
};