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
    // Game Rules Page with Animate.css Plugin
    $(document).ready(function () {
        // Apply staggered animations to sections based on data-delay
        $('.rule-section').each(function () {
            const delay = $(this).data('delay') || 0;
            const section = $(this);

            setTimeout(function () {
                section.css('animation-duration', '1s');
            }, delay * 500);
        });

        // Apply staggered animations to list items
        $('.piece-rule, .special-move, .beginner-tip').each(function () {
            const delay = $(this).data('delay') || 0;
            const item = $(this);

            setTimeout(function () {
                item.addClass('animate__fadeInUp');
            }, delay * 1000);
        });

        // Hover effects with Animate.css classes
        $('.piece-rule').hover(
            function () {
                $(this).find('.piece-tip').show().addClass('animate__slideInDown');
                $(this).css({
                    'background-color': '#f0f8ff',
                    'border-left': '4px solid #008cba',
                    'padding-left': '15px',
                    'border-radius': '5px'
                });
            },
            function () {
                const tip = $(this).find('.piece-tip');
                tip.addClass('animate__slideOutUp');
                $(this).css({
                    'background-color': '',
                    'border-left': '',
                    'padding-left': '',
                    'border-radius': ''
                });

                setTimeout(function () {
                    tip.hide().removeClass('animate__slideInDown animate__slideOutUp');
                }, 500);
            }
        );

        // Special moves hover with different animation
        $('.special-move').hover(
            function () {
                $(this).find('.move-tip').show().addClass('animate__zoomIn');
                $(this).css({
                    'background-color': '#fff3cd',
                    'border': '1px solid #ffc107',
                    'border-radius': '8px',
                    'padding': '12px',
                    'margin': '8px 0',
                    'transform': 'scale(1.02)'
                });
            },
            function () {
                const tip = $(this).find('.move-tip');
                tip.addClass('animate__zoomOut');
                $(this).css({
                    'background-color': '',
                    'border': '',
                    'border-radius': '',
                    'padding': '',
                    'margin': '',
                    'transform': ''
                });

                setTimeout(function () {
                    tip.hide().removeClass('animate__zoomIn animate__zoomOut');
                }, 300);
            }
        );

        // Beginner tips with pulse effect on hover
        $('.beginner-tip').hover(
            function () {
                $(this).find('.tip-explanation').show().addClass('animate__fadeInLeft');
                $(this).css({
                    'background-color': '#d4edda',
                    'border-left': '4px solid #28a745',
                    'padding-left': '15px',
                    'margin': '8px 0',
                    'border-radius': '6px'
                });
            },
            function () {
                const tip = $(this).find('.tip-explanation');
                tip.addClass('animate__fadeOutLeft');
                $(this).css({
                    'background-color': '',
                    'border-left': '',
                    'padding-left': '',
                    'margin': '',
                    'border-radius': ''
                });

                setTimeout(function () {
                    tip.hide().removeClass('animate__fadeInLeft animate__fadeOutLeft');
                }, 400);
            }
        );

        // Section headers with pulse animation on hover
        $('.rule-section h2').hover(
            function () {
                $(this).parent().find('.rule-tip').show().addClass('animate__bounceIn');
                $(this).addClass('animate__pulse');
                $(this).css('color', '#008cba');
            },
            function () {
                const tip = $(this).parent().find('.rule-tip');
                tip.addClass('animate__bounceOut');
                $(this).removeClass('animate__pulse').css('color', '#333');

                setTimeout(function () {
                    tip.hide().removeClass('animate__bounceIn animate__bounceOut');
                }, 400);
            }
        );

        // Title wobble effect on hover
        $('h1').hover(function () {
            $(this).addClass('animate__wobble');
            setTimeout(() => {
                $(this).removeClass('animate__wobble');
            }, 1000);
        });
    });
});