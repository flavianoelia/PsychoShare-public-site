function logout(callback) {
    const url=`/api/User/logout`;
    const config = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    }
    server(url, config, callback);
}

export { logout };
