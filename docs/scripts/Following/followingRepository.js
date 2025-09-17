// Mock: unified contacts list for frontend testing
const contacts = [
    {
        imgUser: "assets/imgwebp/veronicacontacts.webp",
        nameUser: "Verónica Ramirez",
        isFollowing: true
    },
    {
        imgUser: "assets/imgwebp/danielcontacts.webp",
        nameUser: "Daniel Llanes",
        isFollowing: false
    },
    {
        imgUser: "assets/imgwebp/constanzacontacts.webp",
        nameUser: "Constanza Rodriguez",
        isFollowing: true
    }
];

// Simulated fetch GET for contacts
function getContacts(callback) {
    return callback(contacts);
}
