// ====================================================================
// PDF HANDLER - Handle PDF viewer modal and download
// ====================================================================

// Store current PDF info for modal
let currentPdfUrl = null;
let currentPdfTitle = null;

/**
 * Initialize all PDF buttons in posts
 * Call this after posts are rendered
 */
function initializePdfButtons() {
  const viewButtons = document.querySelectorAll(".pdf-view-button");

  // View PDF buttons (open modal with PDF viewer)
  viewButtons.forEach((button) => {
    const pdfUrl = button.getAttribute("data-pdf-url");
    const postTitle = button.getAttribute("data-post-title") || "Documento";

    if (!pdfUrl) {
      console.warn("PDF view button missing data-pdf-url attribute");
      button.disabled = true;
      return;
    }

    button.addEventListener("click", function () {
      openPdfViewerModal(pdfUrl, postTitle);
    });
  });
}

/**
 * Open PDF viewer modal with iframe
 * @param {string} pdfUrl - The URL of the PDF to display
 * @param {string} postTitle - Title of the post for modal title
 */
function openPdfViewerModal(pdfUrl, postTitle) {
  // Store for download button
  currentPdfUrl = pdfUrl;
  currentPdfTitle = postTitle;

  // Get modal elements
  const modal = document.getElementById('pdfViewerModal');
  const pdfEmbed = document.getElementById('pdfEmbed');
  const modalTitle = document.getElementById('pdfViewerModalLabel');

  if (!modal || !pdfEmbed) {
    console.error('PDF modal elements not found');
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo abrir el visor de PDF",
      confirmButtonText: "Aceptar",
    });
    return;
  }

  // Set modal title
  if (modalTitle) {
    modalTitle.textContent = postTitle || "Visualizar PDF";
  }

  // Load PDF in embed with zoom parameter
  pdfEmbed.src = pdfUrl + '#zoom=100';
  pdfEmbed.setAttribute('width', '100%');
  pdfEmbed.setAttribute('height', '100%');

  // Show modal using Bootstrap
  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();

  // Clear embed when modal closes
  modal.addEventListener('hidden.bs.modal', function () {
    pdfEmbed.src = '';
    currentPdfUrl = null;
    currentPdfTitle = null;
  }, { once: true });
}

/**
 * Handle download button click from modal
 */
document.addEventListener('DOMContentLoaded', function() {
  const downloadBtn = document.getElementById('downloadPdfFromModal');
  
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function() {
      if (!currentPdfUrl) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No hay PDF cargado para descargar",
          confirmButtonText: "Aceptar",
        });
        return;
      }

      // Show loading state
      const originalContent = downloadBtn.innerHTML;
      downloadBtn.disabled = true;
      downloadBtn.innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <span class="ms-2">Descargando...</span>
      `;

      // Sanitize filename
      const safeFilename = sanitizeFilename(currentPdfTitle);

      // Download PDF
      downloadPostPdf(currentPdfUrl, safeFilename, function(result) {
        // Restore button
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = originalContent;

        if (result.success) {
          Swal.fire({
            icon: "success",
            title: "¡Descargado!",
            text: "Tu PDF se descargó correctamente",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: result.message || "No se pudo descargar el PDF",
            confirmButtonText: "Aceptar",
          });
        }
      });
    });
  }
});

/**
 * Sanitize filename to remove invalid characters
 * @param {string} title - Original post title
 * @returns {string} Safe filename
 */
function sanitizeFilename(title) {
  if (!title || title.trim() === '') {
    return 'document.pdf';
  }

  // Remove invalid filename characters and limit length
  const safe = title
    .trim()
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '') // Remove invalid chars
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .substring(0, 100); // Limit length

  return safe + '.pdf';
}

// Event delegation for dynamically loaded posts
document.addEventListener("click", function (e) {
  const viewButton = e.target.closest(".pdf-view-button");
  
  if (viewButton && !viewButton.hasAttribute("data-initialized")) {
    const pdfUrl = viewButton.getAttribute("data-pdf-url");
    const postTitle = viewButton.getAttribute("data-post-title") || "Documento";
    
    if (pdfUrl) {
      viewButton.setAttribute("data-initialized", "true");
      openPdfViewerModal(pdfUrl, postTitle);
    }
  }
});
