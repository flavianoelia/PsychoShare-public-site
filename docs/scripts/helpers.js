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
 * @param {string} isoDateString
 * @returns {Object}
 */
function formatDateTime(isoDateString) {
  if (!isoDateString) {
    return { date: "Fecha desconocida", time: "" };
  }

  try {
    const date = new Date(isoDateString);

    if (isNaN(date.getTime())) {
      return { date: "Fecha inválida", time: "" };
    }

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

    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return {
      date: `${day} ${month} ${year}`,
      time: `${hours}:${minutes}`,
    };
  } catch (error) {
    console.error("Error al formatear fecha:", error);
    return { date: "Fecha inválida", time: "" };
  }
}

// =========================
// Helpers de autenticación
// =========================

function getCurrentAuthContext() {
  return {
    userId: Number(localStorage.getItem("userId") || 0),
    roleId: Number(localStorage.getItem("roleId") || 1), // 1 = User
  };
}

/**
 * Devuelve los permisos del usuario actual sobre un contenido
 * (en este caso, un comentario)
 */
function getCommentPermissions(ownerUserId) {
  const { userId, roleId } = getCurrentAuthContext();

  return {
    canEdit: ownerUserId === userId,               // solo dueño
    canDelete: ownerUserId === userId || roleId >= 2, // dueño o Admin/SuperAdmin
    canReport: true,                               // cualquier usuario logueado
  };
}

function isAdminOrSuperAdmin() {
  const { roleId } = getCurrentAuthContext();
  return roleId >= 2;
}
