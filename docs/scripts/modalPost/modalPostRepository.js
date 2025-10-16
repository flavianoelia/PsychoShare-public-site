function createPost(post) {
    const url = `/api/post`;
    
    const config = {
        method: 'POST',
        body: JSON.stringify(post)
    };
    server(url, config);
    
}

//2.7En postform.js, después de armar post, usa fetch a '/api/post' con method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(post). If response.ok, llama closePostCreationModal (de modal.js); else get error con response.json() y alert(message)

//En modal.js (coordina con Integrante 1), en openPostCreationModal, después de append, llama validateAndSubmitPostForm() de postform.js para inicializar listeners. 