// =======================================
// comment/modalComment.js
// =======================================

/**
 * Atacha todos los eventos del menú hamburguesa
 * a un comentario ya renderizado.
 */
// Delegated handlers for comment menus and actions.
// Replaces per-comment listeners with a single delegated listener on document.
function initializeCommentMenuDelegation() {
    // Avoid double initialization
    if (initializeCommentMenuDelegation._inited) return;
    initializeCommentMenuDelegation._inited = true;

    // Click handler for toggling menus and handling menu actions
    document.addEventListener('click', (event) => {
        const target = event.target;

        // 1) Toggle menu when clicking the menu button
        const menuBtn = target.closest('.comment-menu-btn');
        if (menuBtn) {
            event.stopPropagation();
            const commentNode = menuBtn.closest('.comment');
            if (!commentNode) return;
            const menu = commentNode.querySelector('.comment-menu');
            if (!menu) return;

            // Close other menus
            document.querySelectorAll('.comment-menu').forEach(m => {
                if (m !== menu) m.classList.add('hidden');
            });

            menu.classList.toggle('hidden');
            return;
        }

        // 2) Edit / Delete / Report buttons inside menus
        const actionBtn = target.closest('.edit-comment, .delete-comment, .report-comment');
        if (actionBtn) {
            event.stopPropagation();
            event.preventDefault();

            const commentNode = actionBtn.closest('.comment');
            if (!commentNode) return;

            // Extract comment DTO info from data attributes if present
            const commentDto = {
                id: commentNode.dataset.commentId || commentNode.getAttribute('data-comment-id'),
                userId: commentNode.dataset.userId || commentNode.getAttribute('data-user-id')
            };

            // EDIT
            if (actionBtn.classList.contains('edit-comment')) {
                if (actionBtn.disabled) return;
                openEditCommentModal(commentNode, commentDto);
                // hide menu
                const menu = commentNode.querySelector('.comment-menu'); if (menu) menu.classList.add('hidden');
                return;
            }

            // DELETE
            if (actionBtn.classList.contains('delete-comment')) {
                if (actionBtn.disabled) return;

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

                            // Update DOM and count
                            const commentSection = commentNode.closest('.comment-section');
                            commentNode.remove();
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

                const menu = commentNode.querySelector('.comment-menu'); if (menu) menu.classList.add('hidden');
                return;
            }

            // REPORT
            if (actionBtn.classList.contains('report-comment')) {
                if (actionBtn.disabled) return;
                openReportCommentModal(commentNode, commentDto);
                const menu = commentNode.querySelector('.comment-menu'); if (menu) menu.classList.add('hidden');
                return;
            }
        }

        // 3) Clicks outside: close any open menus
        // If click is not inside any .comment, hide all menus
        if (!target.closest('.comment')) {
            document.querySelectorAll('.comment-menu').forEach(m => m.classList.add('hidden'));
        }
    });
}

// Backwards-compatible no-op for callers that still call attachCommentMenuEvents
function attachCommentMenuEvents(commentNode, commentDto) {
    // No-op: initialization should be done once via initializeCommentMenuDelegation()
    // Provide compatibility so older code doesn't break.
    return;
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
