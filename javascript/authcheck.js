// Authentication check script
document.addEventListener('DOMContentLoaded', function () {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');

    if (!token) {
        // If no token found, redirect to login page
        window.location.href = 'login.html';
        return;
    }

    // Get user info
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const navLinks = document.querySelector('.nav-links');
    const existingLogoutLink = document.querySelector('.nav-link[data-action="logout"]');

    if (navLinks && !existingLogoutLink) {
        const logoutLink = document.createElement('a');
        logoutLink.href = '#';
        logoutLink.className = 'nav-link';
        logoutLink.textContent = 'Logout';
        logoutLink.dataset.action = 'logout';
        logoutLink.addEventListener('click', function (e) {
            e.preventDefault();

            // Clear authentication data
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');

            // Redirect to login page
            window.location.href = 'login.html';
        });

        navLinks.appendChild(logoutLink);
    }

    if (user && user.firstname) {
        const h1Elements = document.querySelectorAll('h1');
        if (h1Elements.length > 0 && !h1Elements[0].dataset.customGreeting) {
            // Only modify the first h1 and only if it hasn't been customized already
            h1Elements[0].textContent = `Welcome to Chess Basics, ${user.firstname}!`;
            h1Elements[0].dataset.customGreeting = 'true';
        }
    }
});