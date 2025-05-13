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

        // Get a new random fact each time the button is clicked
        randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];

        // Display the new random fact
        $('#chess-fact').html(randomFact);
    });

    // Initialize Slick Carousel
    if ($(".chess-carousel").length > 0) {
        $(".chess-carousel").slick({
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2000,
        });
    }

    // Show More Chess Info Button Click Event
    $("#show-more-btn").click(function () {
        $(".piece-info").html("<p>Chess originated in India in the 6th century. The game has evolved over centuries and is now one of the most popular board games in the world.</p>");
    });

    // Contact Form Validation 
    $('#contact-form').submit(function (event) {
        event.preventDefault(); // Prevent default form submission

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

    // Hamburger menu toggle
    $('.hamburger').click(function () {
        $('.nav-links').toggleClass('active');
    });
});