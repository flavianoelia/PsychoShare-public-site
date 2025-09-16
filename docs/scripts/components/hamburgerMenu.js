// scripts/components/hamburgerMenu.js

// Handles hamburger menu toggle with accessibility improvements
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.menu-nav'); // Corresponds to your HTML and CSS

    if (menuToggle && nav) {
        // Set ARIA attributes for accessibility
        menuToggle.setAttribute('aria-controls', 'main-navigation');
        menuToggle.setAttribute('aria-expanded', 'false');
        nav.setAttribute('id', 'main-navigation');

        menuToggle.addEventListener('click', function () {
            const isActive = nav.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');

            // Move focus to first link in nav when opened
            if (isActive) {
                const firstLink = nav.querySelector('a');
                if (firstLink) firstLink.focus();
            }
        });
    }
});