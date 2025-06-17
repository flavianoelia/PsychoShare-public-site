document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function () {
            nav.classList.toggle('active');
        });
    }

    const homeButton = document.querySelector('.home-button');
    if (homeButton) {
        homeButton.addEventListener('click', function (event) {
            event.preventDefault();
            console.log('Home button clicked');
        });
    }

    const searchForm = document.querySelector('.search-bar form');
    const main = document.querySelector('main');
    if (searchForm && main) {
        searchForm.addEventListener('submit', function (event) {
            console.log('Search form submitted');
            setTimeout(() => {
                main.style.transition = 'none';
                window.scrollTo(0, 0);
                setTimeout(() => {
                    main.style.transition = '';
                }, 0);
            }, 0);
        });
    }
});
