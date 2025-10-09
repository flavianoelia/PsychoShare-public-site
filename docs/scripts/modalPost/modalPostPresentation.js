//Se encarga de mostrar el modal, agregarlo al DOM, aplicar estilos, agregar listeners, etc.
function openPostCreationModal(){
	const modal = new ModalPost();
	const newModalPost = modal.getModalPost();

	document.body.appendChild(newModalPost);
	
	document.querySelector('header').classList.add('blur-active');
	document.querySelector('main').classList.add('blur-active');
	document.querySelector('footer').classList.add('blur-active');
	document.querySelector('.search-bar').classList.add('blur-active');
	document.querySelector('.menu-nav').classList.add('blur-active');

	const closeButtons = newModalPost.querySelectorAll('.close-button');
	
	closeButtons.forEach(btn => {
		btn.addEventListener('click', event => {
			event.preventDefault();
			console.log('Clic en botón de cerrar:', btn);
			closePostCreationModal(newModalPost);
			window.location.href = 'wall.html';
		});
	});

	const imageButtons = newModalPost.querySelectorAll('.image-button');
	imageButtons.forEach(btn => {
		btn.addEventListener('click', (e) => {
			e.preventDefault();
			alert('No implementado por ahora');
		});
	});

	const attachButtons = newModalPost.querySelectorAll('.attach-button');
	attachButtons.forEach(btn => {
		btn.addEventListener('click', (e) => {
			e.preventDefault();
			alert('No implementado por ahora');
		});
	})

	const postInput = newModalPost.querySelectorAll('.post-input');
	postInput.forEach(btn => {
		btn.addEventListener('click', (e) => {
			e.preventDefault();
			alert('No implementado por ahora');
		});
	})
}

function closePostCreationModal(newModalPost) {
	document.body.removeChild(newModalPost);
}

