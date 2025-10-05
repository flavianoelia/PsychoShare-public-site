function existsMail(email, callback) {
    const url = `/User/check-email?email=${encodeURIComponent(email)}`;
    
    const config = {
        method: 'GET'
    };

    server(url, config, callback);
}

function createUser(user, callback) {
    const url = `/User`;
    
    const config = {
        method: 'POST',
        body: JSON.stringify(user)
    };

    server(url, config, callback);
}