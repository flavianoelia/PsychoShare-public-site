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
  return (
    confirmPasswordTrimed !== "" && passwordTrimed === confirmPasswordTrimed
  );
}

function showError(input, message) {
  let errorSpan = input.parentElement.querySelector(".error");

  if (!errorSpan) {
    errorSpan = document.createElement("span");
    errorSpan.classList.add("error");
    input.insertAdjacentElement("beforebegin", errorSpan);
  }

  errorSpan.textContent = message || "";
  errorSpan.style.color = message ? "red" : "";
}

function validateRequiredField(
  input,
  message = "El campo de descripción es obligatorio"
) {
  const value = input.value.trim();
  const isValid = value.length > 0;

  showError(input, isValid ? "" : message);
  return isValid;
}

/**
 * @param {string} dateString - Backend format: "yyyy-MM-dd HH:mm:ss" (Argentina local time)
 * @returns {Object}
 */
function formatDateTime(dateString) {
  if (!dateString) {
    return { date: "Fecha desconocida", time: "" };
  }

  try {
    // Backend sends: "2025-12-02 00:50:51" already in Argentina time
    // Parse directly without timezone conversion
    const parts = dateString.split(' ');
    if (parts.length !== 2) {
      return { date: "Fecha inválida", time: "" };
    }

    const [datePart, timePart] = parts;
    const [year, month, day] = datePart.split('-');
    const [hours, minutes] = timePart.split(':');

    const monthNames = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];

    const monthIndex = parseInt(month, 10) - 1;
    const monthName = monthNames[monthIndex] || "mes inválido";

    return {
      date: `${parseInt(day, 10)} ${monthName} ${year}`,
      time: `${hours}:${minutes}`,
    };
  } catch (error) {
    console.error("Error al formatear fecha:", error);
    return { date: "Fecha inválida", time: "" };
  }
}

function getCurrentAuthContext() {
  return {
    userId: localStorage.getItem("userId"),
    token: localStorage.getItem("token"),
  };
}
