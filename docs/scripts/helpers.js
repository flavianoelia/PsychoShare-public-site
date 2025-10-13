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

function showError(input, message) {
    let errorSpan = input.nextElementSibling;

    if (!errorSpan || !errorSpan.classList.contains('error')) {
        errorSpan = document.createElement('span');
        errorSpan.classList.add('error');
        input.insertAdjacentElement('afterend', errorSpan);
    }

    errorSpan.textContent = message || '';
    errorSpan.style.color = message ? 'red' : '';
}

function validateRequiredField(input, message = 'Este campo es obligatorio') {
    const value = input.value.trim();
    const isValid = value.length > 0;

    showError(input, isValid ? '' : message);
    return isValid;
}
