function server(url, config, success) {
    config.headers = { 
        'Content-type': 'application/json; charset=UTF-8',
        ...config.headers
    }
    
    fetch(`http://localhost:5174${url}`, config)
        .then(response => {
            if (!response.ok) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error del servidor',
                    text: `Código de error: ${response.status}`
                });
                return;
            } else {
                return response.json();
            }
        })
        .then(data => success(data))
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor'
            });
            console.log(JSON.stringify(error));
        })
}