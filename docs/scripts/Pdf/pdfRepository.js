// ====================================================================
// PDF REPOSITORY - Manage PDF download from backend API
// ====================================================================

/**
 * Download PDF from static URL (public access, no authentication required)
 * @param {string} pdfUrl - The URL of the PDF file from backend (static file)
 * @param {string} filename - Desired filename for download (default: document.pdf)
 * @param {Function} callback - Callback with format {success: boolean, message: string}
 */
function downloadPostPdf(pdfUrl, filename = 'document.pdf', callback) {
  if (!pdfUrl || pdfUrl.trim() === '') {
    callback({ success: false, message: "URL del PDF no disponible" });
    return;
  }

  // Ensure filename ends with .pdf
  if (!filename.endsWith('.pdf')) {
    filename += '.pdf';
  }

  // Fetch PDF as blob (no authentication needed - public static files)
  fetch(pdfUrl, {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("PDF no encontrado");
        }
        throw new Error(`Error del servidor: ${response.status}`);
      }

      // Validate Content-Type is PDF
      const contentType = response.headers.get('Content-Type');
      if (contentType && !contentType.includes('application/pdf')) {
        console.warn('Content-Type no es PDF:', contentType);
      }

      // Get file as blob
      return response.blob();
    })
    .then((blob) => {
      // Create temporary URL for blob
      const blobUrl = URL.createObjectURL(blob);

      // Create invisible link and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 100);

      callback({ success: true, message: "PDF descargado correctamente" });
    })
    .catch((error) => {
      console.error("Error downloading PDF:", error);
      callback({
        success: false,
        message: error.message || "No se pudo descargar el PDF",
      });
    });
}

/**
 * Open PDF in new tab (alternative to download)
 * @param {string} pdfUrl - The URL of the PDF file from backend (static file)
 * @param {Function} callback - Optional callback with format {success: boolean, message: string}
 */
function openPostPdf(pdfUrl, callback) {
  if (!pdfUrl || pdfUrl.trim() === '') {
    if (callback) {
      callback({ success: false, message: "URL del PDF no disponible" });
    }
    return;
  }

  try {
    // Open PDF in new tab (browser will handle PDF viewer)
    const newWindow = window.open(pdfUrl, '_blank');
    
    if (!newWindow) {
      throw new Error("El navegador bloqueó la ventana emergente. Permite ventanas emergentes para este sitio.");
    }

    if (callback) {
      callback({ success: true, message: "PDF abierto en nueva pestaña" });
    }
  } catch (error) {
    console.error("Error opening PDF:", error);
    if (callback) {
      callback({
        success: false,
        message: error.message || "No se pudo abrir el PDF",
      });
    }
  }
}
