function server(url, config, success) {
  config.headers = {
    "Content-type": "application/json; charset=UTF-8",
    ...config.headers,
  };

  fetch(`http://localhost:5174${url}`, config)
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
      if (data && !data.error) {
        success(data);
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
