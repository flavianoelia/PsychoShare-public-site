
// Presentation: fetch contacts from repository and render using Following.js
// Assumes Following.js and followingRepository.js are loaded before this script
getContacts(function(contacts) {
    const sectionFollowing = document.getElementById("following_collection");
    sectionFollowing.innerHTML = "";
    for (const jsonUser of contacts) {
        const following = new Following(jsonUser);
        const node = following.getNode();
        sectionFollowing.append(node);
    }
    // Update contacts count dynamically
    const countElem = document.querySelector('.contacts-count');
    if (countElem) {
        countElem.textContent = contacts.length + (contacts.length === 1 ? ' Contacto' : ' Contactos');
    }
});
