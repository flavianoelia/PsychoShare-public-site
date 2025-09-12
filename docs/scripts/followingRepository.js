// Mock: hardcoded list of followed users for frontend testing
const followings = [
    {
        imgUser: "assets/imgwebp/veronicacontacts.webp",
        nameUser: "Verónica Ramirez",
    // ...existing code...
        isFollowing: true
    },
    {
        imgUser: "assets/imgwebp/danielcontacts.webp",
        nameUser: "Daniel Llanes",
    // ...existing code...
        isFollowing: false
    },
    {
        imgUser: "assets/imgwebp/constanzacontacts.webp",
        nameUser: "Constanza Rodriguez",
    // ...existing code...
        isFollowing: true
    }
];

// Simulated fetch GET
function getFollowing(show) {
    return show(followings);
}
