const connectedUsers = document.getElementById("connectedUsers")

function renderConnectedUsers(response) {
    if (!connectedUsers) return;
    if (response.connectedUsers === 0) {
        connectedUsers.textContent = "No hay usuarios conectados";
    } else {
        connectedUsers.textContent = `Usuarios Conectados: ${response.connectedUsers}`;
    }
}

setInterval(() => {
    updateConnectedUsers(renderConnectedUsers);
}, 5000);
