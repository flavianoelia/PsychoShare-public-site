document.addEventListener("click", async function (e) {

  // ===== ELIMINAR POST =====
  if (e.target.classList.contains("delete-btn")) {
    const postId = e.target.dataset.id;

    if (!confirm("¿Seguro que deseas eliminar este post?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/post/${postId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (!response.ok) throw new Error("Error al eliminar post");

      alert("Post eliminado correctamente");
      e.target.closest(".article").remove();

    } catch (error) {
      console.error(error);
      alert("Error eliminando el post");
    }
  }

  // ===== EDITAR POST =====
  if (e.target.classList.contains("edit-btn")) {
    const postId = e.target.dataset.id;

    try {
      // 1. Traemos el post actual para tener TODOS los campos que necesita el backend
      const getRes = await fetch(`${API_BASE_URL}/api/post/${postId}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (!getRes.ok) {
        throw new Error("No se pudo obtener el post");
      }

      const post = await getRes.json();

      // 2. Pedimos al usuario los nuevos valores, pre-cargados
      const { value: edited } = await Swal.fire({
        title: "Editar publicación",
        html: `
          <input id="sw-title" class="swal2-input" value="${post.title}">
          <textarea id="sw-desc" class="swal2-textarea">${post.description}</textarea>
          <input id="sw-auth" class="swal2-input" value="${post.authorship}">
          <textarea id="sw-resume" class="swal2-textarea">${post.resume}</textarea>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        preConfirm: () => ({
          title: document.getElementById("sw-title").value.trim(),
          description: document.getElementById("sw-desc").value.trim(),
          authorship: document.getElementById("sw-auth").value.trim(),
          resume: document.getElementById("sw-resume").value.trim(),
          image: post.image?.url || null,
          pdf: post.pdf?.url || null
        })
      });

      if (!edited) return;

      // 3. Validación mínima del front (opcional)
      if (edited.title.length < 2 || edited.description.length < 2 ||
          edited.authorship.length < 2 || edited.resume.length < 2) {
        Swal.fire("Error", "Todos los campos deben tener al menos 2 caracteres.", "error");
        return;
      }

      // 4. Enviar PUT con TODOS los datos (así el backend no devuelve 400)
      const putRes = await fetch(`${API_BASE_URL}/api/post/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(edited)
      });

      if (!putRes.ok) {
        const msg = await putRes.text();
        throw new Error(msg);
      }

      Swal.fire("Éxito", "Post actualizado", "success")
        .then(() => location.reload());

    } catch (error) {
      console.error(error);
      Swal.fire("Error editando el post", error.message, "error");
    }
  }

});
