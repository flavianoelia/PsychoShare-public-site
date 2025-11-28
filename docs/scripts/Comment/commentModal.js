// =======================================
// comment/modalComment.js
// =======================================

/**
 * Atacha todos los eventos del menú hamburguesa
 * a un comentario ya renderizado.
 */
function attachCommentMenuEvents(commentNode, commentDto) {
    const menuBtn = commentNode.querySelector(".comment-menu-btn");
    const menu = commentNode.querySelector(".comment-menu");

    if (!menuBtn || !menu) return;

    // Abrir / cerrar menú
    menuBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        menu.classList.toggle("hidden");
    });

    // Cerrar menú si clickeo fuera
    document.addEventListener("click", (event) => {
        if (!commentNode.contains(event.target)) {
        menu.classList.add("hidden");
        }
    });

    const editBtn = commentNode.querySelector(".edit-comment");
    const deleteBtn = commentNode.querySelector(".delete-comment");
    const reportBtn = commentNode.querySelector(".report-comment");

    // EDITAR
    if (editBtn) {
        editBtn.addEventListener("click", () => {
        if (editBtn.disabled) return;

        openEditCommentModal(commentNode, commentDto);
        menu.classList.add("hidden");
        });
    }

    // ELIMINAR
    if (deleteBtn) {
        deleteBtn.addEventListener("click", () => {
        if (deleteBtn.disabled) return;

        const confirmed = confirm("¿Seguro que querés eliminar este comentario?");
        if (!confirmed) return;

        deleteCommentApi(commentDto.id, (data) => {
            if (!data || data.error) return;
            commentNode.remove();
        });

        menu.classList.add("hidden");
        });
    }

    // REPORTAR
    if (reportBtn) {
        reportBtn.addEventListener("click", () => {
        if (reportBtn.disabled) return;

        openReportCommentModal(commentNode, commentDto);
        menu.classList.add("hidden");
        });
    }
}

// Modal simple de edición (por ahora con prompt)
function openEditCommentModal(commentNode, commentDto) {
    const textNode = commentNode.querySelector(".comment-text");
    const oldText = textNode.textContent;

    const newText = prompt("Editar comentario:", oldText);
    if (!newText || newText.trim() === "") return;

    editComment(commentDto.id, newText.trim(), (data) => {
        if (!data || data.error) return;
        textNode.textContent = data.text;
    });
}

// Modal simple de reporte (por ahora también prompt)
/*function openReportCommentModal(commentNode, commentDto) {
    const reason = prompt("Motivo del reporte:", "");
    if (!reason || reason.trim() === "") return;

    const details = prompt("Detalles adicionales (opcional):", "") || "";

    reportCommentApi(
        commentDto.id,
        commentDto.userId,
        reason.trim(),
        details.trim(),
        (data) => {
        // Cuando el back esté ajustado para permitir reportes de cualquier user,
        // acá podés mostrar un Swal o un alert de éxito.
        // Por ahora lo dejamos silencioso.
        console.log("Reporte enviado:", data);
        }
    );

}
*/
