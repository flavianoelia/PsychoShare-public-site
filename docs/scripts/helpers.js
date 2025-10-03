const confirmPasswordInput = document.getElementById("confirmPassword");
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{2,30}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

function validateName(name) {
    return nameRegex.test(name);
}

function validateLastName(lastname) {
    return nameRegex.test(lastname);
}

function validateEmail(email) {
    return emailRegex.test(email);
}

function validatePassword(password) {
    return passwordRegex.test(password);
}

function validateConfirmPassword(passwordTrimed, confirmPasswordTrimed) {
    return confirmPasswordTrimed !== "" && passwordTrimed === confirmPasswordTrimed;
}

