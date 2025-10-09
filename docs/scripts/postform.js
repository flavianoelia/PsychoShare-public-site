// Esta función valida y envía el form de creación de post
function validateAndSubmitPostForm() {
    // Selecciona el form dentro de .form-container y los campos necesarios
    const container = document.querySelector('.form-container');
    if (!container) return;

    const form = container.querySelector('form');
    if (!form) return;

    const description = form.querySelector('#description'); // textarea
    const title = form.querySelector('#title'); // input
    const authorship = form.querySelector('#authorship'); // input
    const abstract = form.querySelector('#abstract'); // textarea

    // Añade listener submit y evita el comportamiento por defecto
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        // Prueba: loguear los valores al enviar
        console.log('postform submit intercepted');
        console.log({
            title: title ? title.value : null,
            description: description ? description.value : null,
            authorship: authorship ? authorship.value : null,
            abstract: abstract ? abstract.value : null
        });
        // Aquí iría la validación y el envío real
    });
}
