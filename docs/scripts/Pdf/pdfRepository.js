// ====================================================================
// PDF REPOSITORY - Public PDF access (no token required)
// ====================================================================

/**
 * Validate PDF URL
 */
function validatePdfUrl(pdfUrl, callback) {
  if (!pdfUrl || pdfUrl.trim() === "") {
    callback({
      success: false,
      message: "URL del PDF no disponible",
    });
    return false;
  }
  return true;
}



/**
 * Download PDF file from a PUBLIC static URL (no authentication)
 * @param {string} pdfUrl
 * @param {string} filename
 * @param {Function} callback
 */
function downloadPostPdf(pdfUrl, filename = "document.pdf", callback) {
  if (!validatePdfUrl(pdfUrl, callback)) return;

  if (!filename.endsWith(".pdf")) {
    filename += ".pdf";
  }

  fetch(pdfUrl, { method: "GET" })
    .then((response) => {
      if (!response.ok) {
        const message =
          response.status === 404
            ? "PDF no encontrado"
            : `Error del servidor: ${response.status}`;

        throw new Error(message);
      }

      const contentType = response.headers.get("Content-Type");
      if (contentType && !contentType.includes("application/pdf")) {
        console.warn("Advertencia: Content-Type no es PDF:", contentType);
      }

      return response.blob();
    })
    .then((blob) => {
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 100);

      callback({
        success: true,
        message: "PDF descargado correctamente",
      });
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
 * Open PDF in new browser tab (public URL)
 * @param {string} pdfUrl
 * @param {Function} callback
 */
function openPostPdf(pdfUrl, callback) {
  if (!validatePdfUrl(pdfUrl, callback)) return;

  try {
    const newWindow = window.open(pdfUrl, "_blank");

    if (!newWindow) {
      throw new Error(
        "El navegador bloqueó la ventana emergente. Permití pop-ups para este sitio."
      );
    }

    if (callback) {
      callback({
        success: true,
        message: "PDF abierto en nueva pestaña",
      });
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
