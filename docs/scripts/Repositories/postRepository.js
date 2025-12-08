// Obtener posts desde el backend con paginación y búsqueda
/**
 * @param {Object} options - Opciones de paginación y búsqueda
 * @param {number} options.page - Número de página (default: 1)
 * @param {number} options.size - Cantidad de posts por página (default: 10)
 * @param {string} options.searchTerm - Término de búsqueda opcional
 * @param {Function} callback - Callback con formato {posts: [], hasMore: boolean, totalCount: number}
 */
function getPost(options, callback) {
  // Support old signature: getPost(callback)
  if (typeof options === "function") {
    callback = options;
    options = { page: 1, size: 10, searchTerm: "" };
  }

  const { page = 1, size = 10, searchTerm = "" } = options;
  const token = localStorage.getItem("token");

  // Construir URL con parámetros
  let url = `/api/Post/feed?Page=${page}&Size=${size}`;
  if (searchTerm && searchTerm.trim()) {
    url += `&SearchTerm=${encodeURIComponent(searchTerm.trim())}`;
  }

  const config = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  server(url, config, (response) => {
    const posts = response.posts || [];
    const hasMore = response.hasMore || false;
    const totalCount = response.totalCount || 0;

    // Transformar los datos del backend al formato que espera el frontend
    const transformedPosts = posts.map((post) => ({
      postId: post.id,
      userId: post.userId,
      imgOwner: post.avatarUrl || null, // Avatar dinámico o null para ícono
      nameOwner: `${post.nameOwner} ${post.lastnameOwner}`,
      description: post.description,
      title: post.title,
      authorship: post.authorship,
      abstract: post.resume,
      image: post.imageUrl || null,
      pdf: post.pdfUrl ? { url: post.pdfUrl } : null, // PDF object with url
      countLike: 0, // Se cargará dinámicamente con getLikeStats
      comments: [],
      createdAt: post.createdAt,
    }));

    callback({ posts: transformedPosts, hasMore, totalCount });
  });
}

/**
 * Crear un nuevo post usando FormData (imagen/pdf opcionales).
 * @param {FormData} formData
 * @param {Function} callback - callback({ success: boolean, data?, message? })
 */
function createPost(formData, callback) {
  if (!(formData instanceof FormData)) {
    callback({ success: false, message: 'Invalid form data' });
    return;
  }

  const url = `/api/Post`;

  // server() will detect FormData and not force JSON Content-Type
  const config = {
    method: 'POST',
    body: formData,
  };

  server(url, config, (response) => {
    if (!response) {
      // 204 No Content or empty response -> treat as success
      callback({ success: true });
      return;
    }

    if (response.error) {
      callback({ success: false, message: response.message || 'Error creating post' });
      return;
    }

    // success: server returns created post or payload
    callback({ success: true, data: response });
  });
}
