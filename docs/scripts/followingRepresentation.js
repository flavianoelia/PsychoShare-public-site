class FollowingRepresentation {
    constructor(usuario) {
        this.imgUser = usuario.imgUser;
        this.nameUser = usuario.nameUser;
    // ...existing code...
        this.isFollowing = usuario.isFollowing;
    }

    getNode() {
        const following = document.createElement("article");
        following.className = "following-card";
        following.innerHTML = `
            <section class="following-header">
                <img src="${this.imgUser}" alt="User photo" class="contact-avatar">
                <div class="user-info">
                    <p class="name">${this.nameUser}</p>
                    <!-- Profession removed -->
                </div>
            </section>
            <section class="following-content">
                <button class="btn follow-btn">
                    ${this.isFollowing ? "Following" : "Follow"}
                </button>
            </section>
        `;
        return following;
    }
}

// Example: hardcoded followed users data
const followedUsers = [
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

const sectionFollowing = document.getElementById("following_collection");

for (const jsonUser of followedUsers) {
    const following = new FollowingRepresentation(jsonUser);
    const node = following.getNode();
    sectionFollowing.append(node);
}
