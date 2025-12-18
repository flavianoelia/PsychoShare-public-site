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

    // Abrir / cerrar menú con toggle de clase 'hidden'
    menuBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        
        // Cerrar otros menús abiertos
        document.querySelectorAll('.comment-menu').forEach(m => {
            if (m !== menu) m.classList.add('hidden');
        });
        
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
        editBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            event.preventDefault();
            
            if (editBtn.disabled) return;

            openEditCommentModal(commentNode, commentDto);
            menu.classList.add("hidden");
        });
    }

    // ELIMINAR
    if (deleteBtn) {
        deleteBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            event.preventDefault();
            
            if (deleteBtn.disabled) return;

            Swal.fire({
                title: '¿Eliminar comentario?',
                text: 'Esta acción no se puede deshacer',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d'
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteCommentApi(commentDto.id, (data) => {
                        if (!data || data.error) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'No se pudo eliminar el comentario'
                            });
                            return;
                        }
                        
                        // Get comment section before removing
                        const commentSection = commentNode.closest('.comment-section');
                        
                        commentNode.remove();
                        
                        // Update comment count (-1 for deleted comment)
                        if (commentSection && typeof updateCommentCount === 'function') {
                            updateCommentCount(commentSection, -1);
                        }
                        
                        Swal.fire({
                            icon: 'success',
                            title: 'Eliminado',
                            text: 'El comentario fue eliminado',
                            timer: 2000,
                            showConfirmButton: false
                        });
                    });
                }
            });

            menu.classList.add("hidden");
        });
    }

    // REPORTAR
    if (reportBtn) {
        reportBtn.addEventListener("click", (event) => {
            event.stopPropagation(); // Evitar que se propague al post
            event.preventDefault();
            
            if (reportBtn.disabled) return;

            openReportCommentModal(commentNode, commentDto);
            menu.classList.add("hidden");
        });
    }
}

// Modal de edición con SweetAlert2
function openEditCommentModal(commentNode, commentDto) {
    const textNode = commentNode.querySelector(".comment-text");
    const oldText = textNode.textContent;

    Swal.fire({
        title: 'Editar comentario',
        input: 'textarea',
        inputValue: oldText,
        inputPlaceholder: 'Escribe tu comentario...',
        inputAttributes: {
            'aria-label': 'Editar comentario',
            'maxlength': 500
        },
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#8B6F8D',
        cancelButtonColor: '#6c757d',
        inputValidator: (value) => {
            if (!value || value.trim() === '') {
                return 'El comentario no puede estar vacío';
            }
            if (value.trim().length < 2) {
                return 'El comentario debe tener al menos 2 caracteres';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const newText = result.value.trim();
            editComment(commentDto.id, newText, (data) => {
                if (data && !data.error) {
                    textNode.textContent = data.text;
                    Swal.fire({
                        icon: 'success',
                        title: '¡Comentario editado!',
                        text: 'Tu comentario se actualizó correctamente',
                        timer: 2000,
                        showConfirmButton: false
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo editar el comentario'
                    });
                }
            });
        }
    });
}

// Modal de reporte con SweetAlert2
function openReportCommentModal(commentNode, commentDto) {
    Swal.fire({
        title: 'Reportar comentario',
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
            // Focus en el select cuando se abre el modal
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
            
            reportCommentApi(
                commentDto.id,
                commentDto.userId,
                reason,
                details,
                (data) => {
                    if (data && !data.error) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Reporte enviado',
                            text: 'Gracias por ayudarnos a mantener la comunidad segura.',
                            timer: 2000,
                            showConfirmButton: false
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'No se pudo enviar el reporte. Intenta nuevamente.'
                        });
                    }
                }
            );
        }
    });
}
