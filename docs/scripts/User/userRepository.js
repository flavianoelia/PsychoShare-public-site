function existsMail(email, callback) {
    const url = `/api/User/check-email?email=${encodeURIComponent(email)}`;
    
    const config = {
        method: 'GET'
    };

    server(url, config, callback);
}

function createUser(user, callback) {
    const url = `/api/User`;
    
    const config = {
        method: 'POST',
        body: JSON.stringify(user)
    };

    server(url, config, callback);
}

function login(email, password, callback) {
    const url = `/api/User/login`;
    
    const config = {
        method: 'POST',
        body: JSON.stringify({ email, password })
    };

    server(url, config, callback);
}