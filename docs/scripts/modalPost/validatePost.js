function validateAndSubmitPostForm() {
    const container = document.querySelector('.form-container');
    if (!container) return;

    const form = container.querySelector('form');
    if (!form) return;

    const description = form.querySelector('#description'); 
    const title = form.querySelector('#title'); 
    const authorship = form.querySelector('#authorship'); 
    const abstract = form.querySelector('#abstract');

    description.addEventListener('blur', function () {
        validateRequiredField(description);
    });
    
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const isDescriptionValid = validateRequiredField(description);

        if (!isDescriptionValid) {
            return;
        } else{
            console.log('postform submit intercepted');
            console.log({
                title: title ? title.value : null,
                description: description.value,
                authorship: authorship ? authorship.value : null,
                abstract: abstract ? abstract.value : null
            });
        }
    });
}

