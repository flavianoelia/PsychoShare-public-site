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

    const newDescription = prompt("Sobre qué quieres hablar?:");
    const newTitle = prompt("Nuevo título:");
    const newAuthorship = prompt("Nueva autoría:");
    const newResume = prompt("Nuevo resumen:");

    if (!newTitle || !newDescription) return;

    const data = {
      description: newDescription,
      title: newTitle,
      authorship: newAuthorship,
      resume: newResume,
      image: null,
      pdf: null
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/post/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error("Error al editar post");

      alert("Post editado correctamente");
      location.reload();

    } catch (error) {
      console.error(error);
      alert("Error editando el post");
    }
  }


});
