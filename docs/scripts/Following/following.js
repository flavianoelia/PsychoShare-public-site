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
    
    // Use avatar URL or fallback to FontAwesome icon
    let avatarHTML;
    if (this.imgUser && this.imgUser.trim() !== "") {
      avatarHTML = `<img src="${this.imgUser}" alt="Foto de contacto" class="contact-avatar" onerror="this.parentElement.querySelector('.contact-avatar').outerHTML='<i class=\\'fa-solid fa-circle-user contact-avatar-icon\\'></i>'" />`;
    } else {
      avatarHTML = `<i class="fa-solid fa-circle-user contact-avatar-icon"></i>`;
    }
    
    following.innerHTML = `
      ${avatarHTML}
      <span class="contact-name">${this.nameUser}</span>
      <button class="btn btn-danger unfollow-btn" data-user-id="${this.id}">Dejar de seguir</button>
    `;
    return following;
  }
}
