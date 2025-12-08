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

function changePassword(userId, oldPassword, newPassword, callback) {
  const token = localStorage.getItem("token");
  
  if (!token) {
    callback({ success: false, message: "No hay sesión activa" });
    return;
  }

  const url = `/api/User/change-password/${userId}`;

  const config = {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ oldPassword, newPassword }),
  };

  server(url, config, callback);
}

/**
 * Check if a user is banned
 * @param {number} userId - User ID to check
 * @param {function} callback - Callback function with ban status
 */
function checkBan(userId, callback) {
  const token = localStorage.getItem("token");
  
  if (!token) {
    callback({ isBanned: false });
    return;
  }

  const url = `${API_BASE_URL}/api/Ban/check/${userId}`;

  fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  })
  .then(response => {
    if (!response.ok) {
      // If error, assume not banned to let them in
      console.error("Error checking ban status:", response.status);
      return { isBanned: false };
    }
    return response.json();
  })
  .then(data => {
    callback(data);
  })
  .catch(error => {
    console.error("Network error checking ban:", error);
    callback({ isBanned: false });
  });
}
