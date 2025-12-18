function updateConnectedUsers(callback){
    const url = `/api/User/connectedUsers`,
    config = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    }
    server(url, config, callback);
}
