const sectionPost = document.getElementById("post_collection");

getPost((posts) => {
    for (jsonPost of posts) {
        const nodo = post.getNode();
        sectionPost.append(nodo);
    }
    
    // Initialize like buttons after rendering posts
    initializeLikeButtons();
});

/* listen click to redirect a public profile */
document.addEventListener("click", (e) => {
    const author = e.target.closest(".post-author");
    if (!author) return;

    const userId = author.dataset.userId;
    window.location.href = `profile-public.html?user=${userId}`;
});
