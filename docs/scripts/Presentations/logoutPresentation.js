import { logout} from "./logoutRepository.js";

const logoutButton = document.getElementById("logout-confirm");

logoutButton.addEventListener("click", (e) => {
    e.preventDefault();
    logout((response) => {
        setTimeout( () => { 
            if (response) {
                const data = response.connectedUsers;
                console.log("Actualización de Usuarios conectados:", data);
                localStorage.clear();
                window.location.href = "index.html";
            } else {
                alert("No se pudo cerrar sesión");
            }
        }, 1000)
    });
});

