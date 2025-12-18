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

function checkBan(userId, callback) {
  const url = `/api/Ban/check/${userId}`;

  const config = {
    method: "GET"
  };

  server(url, config, callback);
}
