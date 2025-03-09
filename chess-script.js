$(document).ready(function () {
    console.log("jQuery is working!");

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
});
document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    hamburger.addEventListener("click", function () {
        navLinks.classList.toggle("active");
    });
});
$(document).ready(function () {
    // Clear error messages on focus
    $("input, select, textarea").on("focus", function () {
        $(this).removeClass("error");
        $("#" + $(this).attr("id") + "-error").text("");
    });

    // Form submission and validation
    $("#contact-form").on("submit", function (e) {
        e.preventDefault(); // Prevent page refresh

        let isValid = true;

        // Validate Name
        let name = $("#name").val().trim();
        if (name === "") {
            isValid = false;
            $("#name").addClass("error");
            $("#name-error").text("Name is required.");
        }

        // Validate Email
        let email = $("#email").val().trim();
        let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(email)) {
            isValid = false;
            $("#email").addClass("error");
            $("#email-error").text("Please enter a valid email address.");
        }

        // Validate Birthday
        let birthday = $("#birthday").val();
        if (birthday === "") {
            isValid = false;
            $("#birthday").addClass("error");
            $("#birthday-error").text("Please select your birthdate.");
        }

        // Validate Chess Experience Selection
        let experience = $("#chess-experience").val();
        if (experience === "") {
            isValid = false;
            $("#chess-experience").addClass("error");
            $("#experience-error").text("Please select your chess experience level.");
        }

        // If valid, refresh the page, otherwise show a status message
        if (isValid) {
            $("#status-message").text("Form submitted successfully!").css("color", "green");
            // In a real scenario, submit the data via AJAX or similar and process it
            setTimeout(function () {
                location.reload(); // Refresh the page after success
            }, 1500);
        } else {
            $("#status-message").text("Please fix the errors and try again.").css("color", "red");
        }
    });
});
