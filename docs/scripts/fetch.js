function server(url, config, success) {
    config.headers = { 
        'Content-type': 'application/json; charset=UTF-8',
        ...config.headers
    }
    
    fetch(`http://localhost:5174${url}`, config)
        .then(response => {
            if (!response.ok) {
                //sweet alert
                alert(response.status);
                return;
            } else {
                return response.json();
            }
        })
        .then(data => success(data)) // { exists: true }
        .catch(error => {
            //sweetAlert
            console.log(JSON.stringify(error));
        })
}