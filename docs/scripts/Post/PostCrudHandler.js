document.addEventListener("click", async function (e) {

  // ===== TOGGLE MENÚ DROPDOWN =====
  if (e.target.closest(".dropdown-trigger")) {
    e.stopPropagation();
    const trigger = e.target.closest(".dropdown-trigger");
    const menu = trigger.nextElementSibling;
    
    // Cerrar otros menús abiertos
    document.querySelectorAll(".dropdown-menu.show").forEach(m => {
      if (m !== menu) m.classList.remove("show");
    });
    
    menu.classList.toggle("show");
    return;
  }

  // Cerrar menús si se hace click fuera
  if (!e.target.closest(".dropdown-container")) {
    document.querySelectorAll(".dropdown-menu.show").forEach(m => {
      m.classList.remove("show");
    });
  }

  // ===== REPORTAR POST DESDE MENÚ =====
  if (e.target.closest(".report-post")) {
    e.stopPropagation();
    const btn = e.target.closest(".report-post");
    const postId = btn.dataset.postId;
    const postTitle = btn.dataset.postTitle;
    
    // Obtener el userId del post (está en el article padre)
    const article = btn.closest(".article");
    const postData = article.querySelector("[data-user-id]");
    const reportedUserId = postData ? postData.dataset.userId : null;
    
    // Cerrar el menú
    btn.closest(".dropdown-menu").classList.remove("show");
    
    // Abrir modal de reporte
    openReportModal(postId, postTitle, reportedUserId);
    return;
  }

  // ===== ELIMINAR POST DESDE MENÚ =====
  if (e.target.closest(".delete-post")) {
    e.stopPropagation();
    const btn = e.target.closest(".delete-post");
    const postId = btn.dataset.postId;
    
    // Cerrar el menú
    btn.closest(".dropdown-menu").classList.remove("show");
    
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
      btn.closest(".article").remove();

    } catch (error) {
      console.error(error);
      alert("Error eliminando el post");
    }
    return;
  }

  // ===== EDITAR POST DESDE MENÚ =====
  if (e.target.closest(".edit-post")) {
    e.stopPropagation();
    const btn = e.target.closest(".edit-post");
    const postId = btn.dataset.postId;
    
    // Cerrar el menú
    btn.closest(".dropdown-menu").classList.remove("show");
    
    // Ejecutar la lógica de edición existente
    await handleEditPost(postId, btn);
    return;
  }

  // ===== ELIMINAR POST (BOTÓN ANTIGUO - mantener por compatibilidad) =====
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
      // Obtener post actual
      const getRes = await fetch(`${API_BASE_URL}/api/post/${postId}`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });

      if (!getRes.ok) throw new Error("No se pudo obtener el post");

      const post = await getRes.json();

      // Modal con labels + valores cargados
      const { value: edited } = await Swal.fire({
        title: "Editar publicación",
        html: `
          <label>Sobre qué quieres hablar?</label>
          <textarea id="sw-desc" class="swal2-textarea">${post.description}</textarea>
          
          <label>Título</label>
          <input id="sw-title" class="swal2-input" value="${post.title}">

          <label>Autoría</label>
          <input id="sw-auth" class="swal2-input" value="${post.authorship}">

          <label>Resumen</label>
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

      // Enviar el PUT con TODOS los campos
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

// ===== FUNCIÓN HELPER PARA EDITAR POST =====
async function handleEditPost(postId, triggerElement) {
  try {
    // Obtener post actual
    const getRes = await fetch(`${API_BASE_URL}/api/post/${postId}`, {
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });

    if (!getRes.ok) throw new Error("No se pudo obtener el post");

    const post = await getRes.json();

    // Modal con labels + valores cargados
    const { value: edited } = await Swal.fire({
      title: "Editar publicación",
      html: `
        <label>Sobre qué quieres hablar?</label>
        <textarea id="sw-desc" class="swal2-textarea">${post.description}</textarea>
        
        <label>Título</label>
        <input id="sw-title" class="swal2-input" value="${post.title}">

        <label>Autoría</label>
        <input id="sw-auth" class="swal2-input" value="${post.authorship}">

        <label>Resumen</label>
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

    // Enviar el PUT con TODOS los campos
    const putRes = await fetch(`${API_BASE_URL}/api/post/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(edited)
    });

    if (!putRes.ok) {
      const err = await putRes.json();
      throw new Error(err.message || "Error actualizando");
    }

    Swal.fire("Éxito", "Post actualizado", "success")
      .then(() => location.reload());

  } catch (error) {
    console.error(error);
    Swal.fire("Error editando el post", error.message, "error");
  }
}

// ===== FUNCIÓN PARA ABRIR MODAL DE REPORTE =====
function openReportModal(postId, postTitle, reportedUserId) {
  Swal.fire({
    title: 'Reportar contenido',
    html: `
      <div style="text-align: left;">
        <label for="report-reason">Motivo del reporte:</label>
        <select id="report-reason" class="swal2-select">
          <option value="">Selecciona un motivo</option>
          <option value="Acoso">Acoso</option>
          <option value="Spam">Spam</option>
          <option value="Contenido inapropiado">Contenido inapropiado</option>
          <option value="Discurso de odio">Discurso de odio</option>
          <option value="Violencia/Amenazas">Violencia/Amenazas</option>
          <option value="Robo de identidad">Robo de identidad</option>
          <option value="Infracción de copyright">Infracción de copyright</option>
          <option value="Actividad de bot">Actividad de bot</option>
          <option value="Múltiples infracciones">Múltiples infracciones</option>
          <option value="Otro">Otro</option>
        </select>
        
        <label for="report-details">Detalles adicionales (opcional):</label>
        <textarea 
          id="report-details" 
          class="swal2-textarea" 
          placeholder="Describe el problema..."></textarea>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Enviar reporte',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    focusConfirm: false,
    width: '520px',
    didOpen: () => {
      const reasonSelect = document.getElementById('report-reason');
      if (reasonSelect) {
        setTimeout(() => reasonSelect.focus(), 100);
      }
    },
    preConfirm: () => {
      const reason = document.getElementById('report-reason').value.trim();
      const details = document.getElementById('report-details').value.trim();
      
      if (!reason) {
        Swal.showValidationMessage('Debes seleccionar un motivo');
        return false;
      }
      
      return { reason, details };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const { reason, details } = result.value;
      const auth = getCurrentAuthContext();
      
      // Usar el mismo formato que reportCommentApi
      fetch(`${API_BASE_URL}/api/Report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          reporterUserId: auth.userId,
          reportedUserId: reportedUserId,
          reason: reason,
          details: details || '',
          contentType: 'Post',
          contentId: postId
        })
      })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        Swal.fire({
          icon: 'success',
          title: 'Reporte enviado',
          text: 'Gracias por ayudarnos a mantener la comunidad segura.',
          timer: 2000,
          showConfirmButton: false
        });
      })
      .catch(error => {
        console.error('Error reportando post:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo enviar el reporte. Intenta nuevamente.'
        });
      });
    }
  });
}
