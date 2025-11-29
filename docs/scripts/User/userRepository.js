function existsMail(email, callback) {
  const url = `/api/User/check-email?email=${encodeURIComponent(email)}`;

  const config = {
    method: "GET",
  };

  server(url, config, callback);
}

function createUser(user, callback) {
  const url = `/api/User`;

  const config = {
    method: "POST",
    body: JSON.stringify(user),
  };

  server(url, config, callback);
}

function login(email, password, callback) {
  const url = `/api/User/login`;

  const config = {
    method: "POST",
    body: JSON.stringify({ email, password }),
  };

  server(url, config, callback);
}

/**
 * Delete user account (current user only, or Admin can delete any user)
 * @param {number} userId - The ID of the user to delete
 * @param {Function} callback - Callback with format {success: boolean, message: string}
 */
function deleteUser(userId, callback) {
  const token = localStorage.getItem("token");

  if (!userId) {
    console.error("No userId provided");
    callback({ success: false, message: "ID de usuario requerido" });
    return;
  }

  if (!token) {
    console.error("No token found");
    callback({ success: false, message: "No estás autenticado" });
    return;
  }

  const url = `/api/User/${userId}`;

  const config = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  server(url, config, callback);
}
