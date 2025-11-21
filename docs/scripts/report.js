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
        const payload = {
        target_type: inputType.value,
        target_id: inputId.value,
        reason: reason.value,
        timestamp: new Date().toISOString()
      };

      try {
        // Cambia la URL a la endpoint real del backend
        const res = await fetch('/api/reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('Network response was not ok');

        // éxito: cerrar modal y mostrar notificación mínima
        if (bsModal) bsModal.hide();
        alert('Reporte enviado. Gracias por ayudarnos a mantener la comunidad segura.');
      } catch (err) {
        console.error('Error al enviar reporte:', err);
        alert('No se pudo enviar el reporte. Intenta nuevamente más tarde.');
      }
    });
  }
});
