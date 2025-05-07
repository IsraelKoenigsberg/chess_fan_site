// Add this to the beginning of your existing chess-script.js
// or include as a separate script in your HTML

document.addEventListener('DOMContentLoaded', function () {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');

    if (!token) {
        // If no token found, redirect to login page
        window.location.href = 'login.html';
    }

    // If you want to display user info on the page
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Optional: Add a logout button to the navigation
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        const logoutLink = document.createElement('a');
        logoutLink.href = '#';
        logoutLink.className = 'nav-link';
        logoutLink.textContent = 'Logout';
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

    // Optional: Display welcome message with user's name
    if (user && user.firstname) {
        const h1 = document.querySelector('h1');
        if (h1) {
            h1.textContent = `Welcome to Chess Basics, ${user.firstname}!`;
        }
    }
});
$(document).ready(function () {
    console.log("jQuery is working!");  // Check if jQuery is loaded

    // Define all the fun facts
    const funFacts = [
        "Chess is played by more than 600 million people worldwide.",
        "The longest chess game lasted for 269 moves and took over 20 hours to complete.",
        "The first World Chess Championship was held in 1886.",
        "The longest chess game ever played was 269 moves long.",
        "The game of chess was once banned in England in 1240, after a royal decree."
    ];

    // Display a random fact when the page loads
    let randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
    $('#chess-fact').html(randomFact);

    // Event for changing the fun fact text when the button is clicked
    $('#change-fact').click(function () {
        console.log("Button clicked!");

        // Get a new random fact each time the button is clicked
        randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];

        // Display the new random fact
        $('#chess-fact').html(randomFact);
    });

    // Initialize Slick Carousel
    $(".chess-carousel").slick({
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
    });

    // Show More Chess Info Button Click Event
    $("#show-more-btn").click(function () {
        $(".piece-info").html("<p>Chess originated in India in the 6th century. The game has evolved over centuries and is now one of the most popular board games in the world.</p>");
    });

    // Contact Form Validation 
    $('#contact-form').submit(function (event) {
        event.preventDefault(); // Prevent default form submission!

        // Reset previous error styles
        $('.error').remove();
        $('input, select, textarea').css('border', '1px solid #ccc');

        var isValid = true;

        // Validate Name
        var name = $('#name').val();
        if (name === '') {
            isValid = false;
            $('#name').css('border', '1px solid red');
            $('#name').after('<div class="error">Name is required</div>');
        }

        // Validate Email
        var email = $('#email').val();
        var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailPattern.test(email)) {
            isValid = false;
            $('#email').css('border', '1px solid red');
            $('#email').after('<div class="error">Please enter a valid email</div>');
        }

        // Validate Birthday
        var birthday = $('#birthday').val();
        if (birthday === '') {
            isValid = false;
            $('#birthday').css('border', '1px solid red');
            $('#birthday').after('<div class="error">Birthday is required</div>');
        }

        // Validate Message
        var message = $('#message').val();
        if (message === '') {
            isValid = false;
            $('#message').css('border', '1px solid red');
            $('#message').after('<div class="error">Message is required</div>');
        }

        // If everything is valid, submit the form
        if (isValid) {
            $('#contact-form')[0].submit(); // submit the form manually
        }
    });
    $(document).ready(function () {
        $('.hamburger').click(function () {
            $('.nav-links').toggleClass('active');
        });
    });

});