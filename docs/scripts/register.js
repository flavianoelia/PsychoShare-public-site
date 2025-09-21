const nameInput = document.getElementById("name");
const lastnameInput = document.getElementById("lastname");

const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{2,30}$/;

/*Validation of the name format*/
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
};
nameInput.addEventListener("blur", validateName);

/*Validation of the lastname format*/
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
lastnameInput.addEventListener("blur", validateLastname)