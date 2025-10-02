function server(url, config, success){
    config.headers = {
            'Content-type': 'application/json; charset=UTF-8'}
            //en header inyecto el token bearer}
    
    fetch(url, config)
        .then(response => {
            if (!response.ok){
                alert(response.status)
                //sweetAlert
            } else{
                return response.json()
            }
        })
        .then(data => success(data))
        .catch(error => {
            //sweetAlert
        })
}