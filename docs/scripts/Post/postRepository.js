// Obtener posts desde el backend
function getPost(callback) {
  const token = localStorage.getItem("token");

  // Usamos el endpoint GET /api/post para obtener todos los posts
  const url = "/api/post?page=1&size=20";

  const config = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  server(url, config, (response) => {
    console.log("📦 Respuesta del backend:", response);

    // El backend devuelve { posts: [...], totalCount, page, size, hasMore }
    const posts = response.posts || [];

    console.log("📝 Posts recibidos:", posts);

    // Transformar los datos del backend al formato que espera el frontend
    const transformedPosts = posts.map((post) => ({
      postId: post.id, // ID del post para likes
      userId: post.userId,
      imgOwner: "assets/imgwebp/default-avatar.webp", // Default, podríamos agregar esto al backend
      nameOwner: `${post.nameOwner} ${post.lastnameOwner}`,
      description: post.description,
      title: post.title,
      authorship: post.authorship,
      abstract: post.resume, // El backend usa "resume" en lugar de "abstract"
      image: post.imageUrl || "assets/imgwebp/default-post.webp",
      countLike: 0, // Se cargará dinámicamente con getLikeStats
      comments: [], // Por ahora no tenemos comentarios en el backend
      createdAt: post.createdAt, // Fecha de creación del post
    }));

    console.log("✅ Posts transformados:", transformedPosts);

    callback(transformedPosts);
  });
}
