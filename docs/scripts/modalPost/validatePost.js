function isDescriptionValid(descriptionInput) {
    return validateRequiredField(descriptionInput, 'La descripción es obligatoria');
}

function buildPostObject(description, title, authorship, abstract) {
    return {
        description: description.value.trim(),
        title: title.value.trim(),
        authorship: authorship.value.trim(),
        abstract: abstract.value.trim(),
        image: "",
        pdf: ""
    };
}

function validateAndSubmitPostForm() {
    const container = document.querySelector('.form-container');
    if (!container) return;

    const form = container.querySelector('form');
    if (!form) return;

    const description = form.querySelector('#description');
    description.addEventListener('blur', () => isDescriptionValid(description));

    form.addEventListener('submit', event => {
        event.preventDefault();
        handlePostSubmit(form);
    });
}

function handlePostSubmit(form) {
    const description = form.querySelector('#description');
    const title = form.querySelector('#title');
    const authorship = form.querySelector('#authorship');
    const abstract = form.querySelector('#abstract');

    if (!isDescriptionValid(description)) return;

    const post = buildPostObject(description, title, authorship, abstract);
    console.log('✅ Post creado:', post);
}