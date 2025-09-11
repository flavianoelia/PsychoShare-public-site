// Mock: hardcoded list of followed users for frontend testing
const followings = [
    {
        imgUser: "assets/imgwebp/veronicacontacts.webp",
        nameUser: "Verónica Ramirez",
        profession: "Clinical Psychologist",
        isFollowing: true
    },
    {
        imgUser: "assets/imgwebp/danielcontacts.webp",
        nameUser: "Daniel Llanes",
        profession: "Work Psychologist",
        isFollowing: false
    },
    {
        imgUser: "assets/imgwebp/constanzacontacts.webp",
        nameUser: "Constanza Rodriguez",
        profession: "Educational Psychologist",
        isFollowing: true
    }
];

// Simulated fetch GET
function getFollowing(show) {
    return show(followings);
}
