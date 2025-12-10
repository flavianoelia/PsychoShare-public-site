// Lógica para abrir modal de reporte y enviar datos al backend
document.addEventListener('DOMContentLoaded', () => {
  const reportModalEl = document.getElementById('reportModal');
  const reportForm = document.getElementById('reportForm');
  const inputType = document.getElementById('report_target_type');
  const inputId = document.getElementById('report_target_id');
  const reason = document.getElementById('report_reason');

  let bsModal = null;
  if (reportModalEl && window.bootstrap) {
    bsModal = bootstrap.Modal.getOrCreateInstance(reportModalEl);
  }

  function openReportModal(targetType, targetId) {
    if (!reportModalEl) return;
    inputType.value = targetType;
    inputId.value = targetId;
    reason.value = '';
    
    // Reset details field if it exists
    const detailsField = document.getElementById('report_details');
    if (detailsField) detailsField.value = '';
    
    // Update modal title based on target type
    const modalTitle = reportModalEl.querySelector('.modal-title');
    if (modalTitle) {
      const titles = {
        'post': 'Reportar publicación',
        'user': 'Reportar usuario',
        'comment': 'Reportar comentario',
        'profile': 'Reportar perfil'
      };
      modalTitle.textContent = titles[targetType] || 'Reportar contenido';
    }
    
    if (bsModal) bsModal.show();
  }

  // Delegación de eventos para botones de reporte en la página
  
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-report, .report-comment, .btn-report-profile');
    if (!btn) return;
    const t = btn.getAttribute('data-report-type') || btn.dataset.reportType;
    const id = btn.getAttribute('data-report-id') || btn.dataset.reportId || '';
    openReportModal(t || 'unknown', id || '');
  });

  // Envío del formulario
  if (reportForm) {
    reportForm.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      
      const details = document.getElementById('report_details');
      const detailsValue = details && details.value ? details.value.trim() : '';
      const currentUserId = localStorage.getItem('userId');
      
      // Map frontend types to backend ContentType
      const contentTypeMap = {
        'post': 'Post',
        'comment': 'Comment',
        'profile': 'User',
        'user': 'User'
      };
      
      const contentType = contentTypeMap[inputType.value.toLowerCase()] || inputType.value;
      
      // Build payload with correct backend format
      const payload = {
        reporterUserId: currentUserId,
        reportedUserId: inputId.value,
        reason: reason.value,
        details: detailsValue || '',
        contentType: contentType,
        contentId: inputId.value
      };

      console.log('Sending report payload:', payload); // Debug log

      try {
        // Endpoint backend proporcionado por el equipo
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/api/Report`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || 'Network response was not ok');
        }

        // éxito: cerrar modal y mostrar notificación mínima
        if (bsModal) bsModal.hide();
        
        if (typeof Swal !== 'undefined') {
          Swal.fire({
            icon: 'success',
            title: 'Reporte enviado',
            text: 'Gracias por ayudarnos a mantener la comunidad segura.',
            timer: 3000,
            showConfirmButton: false
          });
        } else {
          alert('Reporte enviado. Gracias por ayudarnos a mantener la comunidad segura.');
        }
      } catch (err) {
        console.error('Error al enviar reporte:', err);
        
        if (typeof Swal !== 'undefined') {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.message || 'No se pudo enviar el reporte. Intenta nuevamente más tarde.'
          });
        } else {
          alert('No se pudo enviar el reporte. Intenta nuevamente más tarde.');
        }
      }
    });
  }
});
