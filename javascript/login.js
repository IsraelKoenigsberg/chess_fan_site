document.addEventListener('DOMContentLoaded', function () {
    // Form elements
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const loginMessage = document.getElementById('login-message');
    const registerMessage = document.getElementById('register-message');

    // Check if user is already logged in
    if (localStorage.getItem('authToken')) {
        window.location.href = 'index.html';
    }

    // Switch between login and register forms
    showRegister.addEventListener('click', function () {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });

    showLogin.addEventListener('click', function () {
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    // Login form submission
    document.getElementById('loginForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        console.log('Login form submitted');

        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        // Show loading message
        loginMessage.textContent = 'Logging in...';
        loginMessage.className = 'message';
        loginMessage.style.display = 'block';

        try {
            console.log('Attempting login request...');
            const response = await fetch('http://localhost:3000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            console.log('Login response status:', response.status);
            const data = await response.json();
            console.log('Login response data received');

            if (response.ok) {
                // Store token in localStorage
                localStorage.setItem('authToken', data.token);

                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                }

                // Show success message
                loginMessage.textContent = 'Login successful! Redirecting...';
                loginMessage.className = 'message success';
                loginMessage.style.display = 'block';

                // Redirect to main page after 2 seconds
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                loginMessage.textContent = data.message || 'Login failed. Please try again.';
                loginMessage.className = 'message error';
                loginMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Login error details:', error);
            loginMessage.textContent = 'Server error. Please try again later.';
            loginMessage.className = 'message error';
            loginMessage.style.display = 'block';
        }
    });

    // Register form submission
    document.getElementById('registerForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        console.log('Register form submitted');

        const firstname = document.getElementById('firstName').value;
        const lastname = document.getElementById('lastName').value;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Show loading message
        registerMessage.textContent = 'Creating account...';
        registerMessage.className = 'message';
        registerMessage.style.display = 'block';

        console.log('Register data:', { firstname, lastname, username, email });

        try {
            console.log('Attempting registration request...');
            const response = await fetch('http://localhost:3000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ firstname, lastname, username, email, password })
            });

            console.log('Register response status:', response.status);
            const data = await response.json();
            console.log('Register response data:', data);

            if (response.ok) {
                // Show success message
                registerMessage.textContent = 'Registration successful! Please login.';
                registerMessage.className = 'message success';
                registerMessage.style.display = 'block';

                // Switch to login form after 1 second
                setTimeout(() => {
                    registerForm.style.display = 'none';
                    loginForm.style.display = 'block';
                    // Clear register message when switching
                    registerMessage.style.display = 'none';
                }, 1000);
            } else {
                registerMessage.textContent = data.message || 'Registration failed. Please try again.';
                registerMessage.className = 'message error';
                registerMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Registration error details:', error);
            registerMessage.textContent = 'Server error. Please try again later.';
            registerMessage.className = 'message error';
            registerMessage.style.display = 'block';
        }
    });
});