class Following {
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
    <img src="${this.imgUser}" alt="Foto de contacto" class="contact-avatar" />
    <span class="contact-name">${this.nameUser}</span>
    <button class="btn btn--danger">Dejar de seguir</button>
  `;
    return following;
  }
}

const followedUsers = [
  {
    imgUser: "assets/imgwebp/veronicacontacts.webp",
    nameUser: "Verónica Ramirez",
  // ...existing code...
    isFollowing: true,
  },
  {
    imgUser: "assets/imgwebp/danielcontacts.webp",
    nameUser: "Daniel Llanes",
  // ...existing code...
    isFollowing: false,
  },
  {
    imgUser: "assets/imgwebp/constanzacontacts.webp",
    nameUser: "Constanza Rodriguez",
  // ...existing code...
    isFollowing: true,
  },
];

const sectionFollowing = document.getElementById("following_collection");

for (const jsonUser of followedUsers) {
  const following = new Following(jsonUser);
  const node = following.getNode();
  sectionFollowing.append(node);
}
