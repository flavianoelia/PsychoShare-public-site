function server(url, config, success) {
  config.headers = {
    "Content-type": "application/json; charset=UTF-8",
    ...config.headers,
  };

  fetch(`${API_BASE_URL}${url}`, config)
    .then((response) => {
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
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor",
      });
      // Call callback so buttons don't get stuck
      success({ error: true, message: "Network error" });
    });
}
