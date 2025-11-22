// Following class: responsible for formatting a contact as HTML
class Following {
  constructor(usuario) {
    this.id = usuario.id;
    this.imgUser = usuario.imgUser;
    this.nameUser = usuario.nameUser;
    this.isFollowing = usuario.isFollowing;
  }

  getNode() {
    const following = document.createElement("article");
    following.className = "following-card";
    following.innerHTML = `
      <img src="${this.imgUser}" alt="Foto de contacto" class="contact-avatar" />
      <span class="contact-name">${this.nameUser}</span>
      <button class="btn btn-danger unfollow-btn" data-user-id="${this.id}">Dejar de seguir</button>
    `;
    return following;
  }
}
