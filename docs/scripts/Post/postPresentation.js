const sectionPost = document.getElementById("post_collection");

getPost((posts) => {
    for (jsonPost of posts) {
        const post = new Post(jsonPost)
        const nodo = post.getNode();
        sectionPost.append(nodo);
    }
    
    // Initialize follow/unfollow buttons after rendering posts
    initializeFollowButtons();
});
