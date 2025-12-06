function server(url, config, success) {
  // Ensure config is an object
  config = config || {};

  // Get token from localStorage and add Authorization header by default.
  // Callers can still override or provide additional headers via config.headers.
  const token = localStorage.getItem("token");

  const defaultHeaders = {
    "Content-type": "application/json; charset=UTF-8",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  config.headers = {
    ...defaultHeaders,
    ...config.headers,
  };

  fetch(`${API_BASE_URL}${url}`, config)
    .then((response) => {
      // Handle 204 No Content gracefully
      if (response.status === 204) {
        // Call success with null to indicate no content
        success(null);
        return null;
      }

      if (!response.ok) {
        // Try to get error message from response body
        return response.json().then(errorData => {
          Swal.fire({
            icon: "error",
            title: "Error del servidor",
            text: errorData?.message || `Código de error: ${response.status}`,
          });
          // Call callback with error info so buttons don't get stuck
          success({ error: true, status: response.status, message: errorData?.message });
        }).catch(() => {
          // If can't parse JSON, just show status code
          Swal.fire({
            icon: "error",
            title: "Error del servidor",
            text: `Código de error: ${response.status}`,
          });
          success({ error: true, status: response.status });
        });
      } else {
        return response.json();
      }
    })
    .then((data) => {
      // If server returned parsed data and it's not an error, forward it
      if (data && !data.error) {
        success(data);
      } else if (data === null) {
        // 204 handled above but ensure downstream callers receive null
        success(null);
      }
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor",
      });
      console.log(JSON.stringify(error));
      // Call callback so buttons don't get stuck
      success({ error: true, message: "Network error" });
    });
}
