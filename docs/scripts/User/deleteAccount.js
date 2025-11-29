/**
 * deleteAccount.js
 * Maneja la funcionalidad de eliminación de cuenta con confirmación y borrado en cascada
 */

document.addEventListener('DOMContentLoaded', () => {
  const deleteButton = document.getElementById('eliminar');
  const passwordInput = document.getElementById('password');

  // Verificar que el usuario esté autenticado
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  if (!token || !userId) {
    Swal.fire({
      icon: 'warning',
      title: 'Sesión no válida',
      text: 'Debes iniciar sesión para eliminar tu cuenta.',
      confirmButtonColor: '#6366f1',
      confirmButtonText: 'Ir a inicio de sesión'
    }).then(() => {
      window.location.href = 'index.html';
    });
    return;
  }

  // Manejar el clic en el botón eliminar
  deleteButton.addEventListener('click', async () => {
    const password = passwordInput.value.trim();

    // Validar que se ingresó la contraseña
    if (!password) {
      Swal.fire({
        icon: 'error',
        title: 'Contraseña requerida',
        text: 'Por favor, ingresa tu contraseña para confirmar.',
        confirmButtonColor: '#6366f1',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    // Mostrar confirmación final con advertencia
    const result = await Swal.fire({
      icon: 'warning',
      title: '⚠️ ¿Estás completamente seguro?',
      html: `
        <p style="margin-bottom: 15px;">Esta acción <strong>NO se puede deshacer</strong>.</p>
        <p style="margin-bottom: 15px;">Se eliminará permanentemente:</p>
        <ul style="text-align: left; display: inline-block; margin: 0 auto;">
          <li>Tu perfil y avatar</li>
          <li>Todas tus publicaciones</li>
          <li>Todos tus comentarios</li>
          <li>Tus likes y reacciones</li>
          <li>Tus seguidores y seguidos</li>
          <li>Archivos e imágenes subidos</li>
        </ul>
      `,
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6366f1',
      confirmButtonText: 'Sí, eliminar mi cuenta',
      cancelButtonText: 'No, cancelar',
      focusCancel: true,
      reverseButtons: true
    });

    // Si el usuario cancela, no hacer nada
    if (!result.isConfirmed) {
      return;
    }

    // Mostrar spinner de carga
    Swal.fire({
      title: 'Eliminando cuenta...',
      html: 'Por favor espera mientras procesamos tu solicitud.',
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Llamar a la función deleteUser del userRepository
    deleteUser(userId, (data) => {
      // Cerrar el spinner
      Swal.close();

      // Si hay error, el server() helper ya mostró el SweetAlert
      // Solo verificamos si hubo error para no continuar
      if (data && data.error) {
        return;
      }

      // Éxito: cuenta eliminada

      Swal.fire({
        icon: 'success',
        title: 'Cuenta eliminada',
        text: 'Tu cuenta ha sido eliminada correctamente. Serás redirigido a la página de inicio.',
        confirmButtonColor: '#6366f1',
        confirmButtonText: 'Aceptar',
        timer: 3000,
        timerProgressBar: true
      }).then(() => {
        // Limpiar localStorage (logout)
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userAvatar');
        
        // Limpiar cualquier otra información de sesión
        localStorage.clear();
        
        // Redirigir a la página de inicio
        window.location.href = 'index.html';
      });
    });
  });

  // Permitir eliminar con Enter si el campo de contraseña está enfocado
  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      deleteButton.click();
    }
  });
});
