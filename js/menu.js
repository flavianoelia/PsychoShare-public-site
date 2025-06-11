document.querySelector('.menu-toggle').addEventListener('click', function() {
    document.querySelector('nav').classList.toggle('active');
});

document.querySelector('.home-button').addEventListener('click', function() {
    event.preventDefault(); 
    console.log('Home button clicked'); 
});

document.querySelector('.search-bar form').addEventListener('submit', function(event) {
    console.log('Search form submitted');
    setTimeout(() => {
        document.querySelector('main').style.transition = 'none'; 
        window.scrollTo(0, 0); 
        setTimeout(() => {
            document.querySelector('main').style.transition = '';
        }, 0);
    }, 0);
});