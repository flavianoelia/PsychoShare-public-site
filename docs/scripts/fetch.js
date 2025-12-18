function server(url, config, success) {
  const token = localStorage.getItem("token");

  config.method = config.method || "GET";
  config.headers = {
    "Content-type": "application/json; charset=UTF-8",
    ...config.headers,
  };

  // Only add Authorization header if:
  // 1. Token exists
  // 2. It's not the login or register endpoint
  const isLoginOrRegister = url.includes('/login') || (url.includes('/User') && config.method === 'POST' && !url.includes('/change-password'));
  
  if (token && !isLoginOrRegister) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  fetch(`${API_BASE_URL}${url}`, config)
    .then((response) => {
      if (!response.ok) {
        // SECURITY FIX: If 401 Unauthorized, clear localStorage to prevent stale sessions
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          localStorage.removeItem('email');
          
          // If not on login page, redirect to login
          if (!window.location.pathname.includes('index.html') && 
              !window.location.pathname.endsWith('/') &&
              !window.location.pathname.includes('sign-up.html')) {
            Swal.fire({
              icon: "warning",
              title: "Sesión expirada",
              text: "Por favor iniciá sesión nuevamente",
            }).then(() => {
              window.location.href = 'index.html';
            });
            return null;
          }
        }
        
        // Try to get error message from response body
        return response.json().then(errorData => {
          Swal.fire({
            icon: "error",
            title: "Error del servidor",
            text: errorData?.message || `Código de error: ${response.status}`,
          });
          // Call callback with error info so buttons don't get stuck
          success({ error: true, status: response.status, message: errorData?.message });
          return null; // Important: return null to stop promise chain
        }).catch(() => {
          // If can't parse JSON, just show status code
          Swal.fire({
            icon: "error",
            title: "Error del servidor",
            text: `Código de error: ${response.status}`,
          });
          success({ error: true, status: response.status });
          return null; // Important: return null to stop promise chain
        });
      } else {
        return response.json();
      }
    })
    .then((data) => {
      if (data !== null && data !== undefined && !data.error) {
        success(data);
      }
    })
    .catch((error) => {
      console.error("[SERVER ERROR]", error);
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor",
      });
      // Call callback so buttons don't get stuck
      success({ error: true, message: "Network error" });
    });
}
