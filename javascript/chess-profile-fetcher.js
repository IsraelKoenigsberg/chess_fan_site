$(document).ready(function () {
    // When the button is clicked
    $("#fetchData").click(function () {
        let username = $("#username").val().toLowerCase(); // Get username input
        if (username === "") {
            alert("Please enter a username.");
            return;
        }

        // API URL for Chess.com user profile
        let apiUrl = `https://api.chess.com/pub/player/${username}`;

        // AJAX request using jQuery
        $.ajax({
            url: apiUrl,
            method: "GET",
            dataType: "json", // Expect JSON data
            success: function (data) {
                // Handle successful response
                displayData(data);
            },
            error: function (error) {
                $("#results").html("<p>Error fetching data. Please try again.</p>");
            }
        });
    });

    // Function to display data on the page
    function displayData(data) {
        // Check if the profile exists
        if (data.username) {
            let html = `
                <h3>Player Information</h3>
                <p><strong>Username:</strong> ${data.username}</p>
                <p><strong>Name:</strong> ${data.name ? data.name : "Not available"}</p>
                <p><strong>Country:</strong> ${data.country.replace("https://api.chess.com/pub/country/", "")}</p>
                <p><strong>Joined:</strong> ${convertUnixTimestamp(data.joined)}</p>
                <p><strong>Last Online:</strong> ${convertUnixTimestamp(data.last_online)}</p>
                <p><strong>Followers:</strong> ${data.followers}</p>
                <p><strong>Profile URL:</strong> <a href="${data.url}" target="_blank">View Profile</a></p>
                <img src="${data.avatar}" alt="Profile Picture" width="100" height="100">
            `;
            $("#results").html(html); // Update DOM dynamically
        } else {
            $("#results").html("<p>Player not found. Please try again.</p>");
        }
    }

    // Function to convert Unix timestamp to readable date
    function convertUnixTimestamp(timestamp) {
        let date = new Date(timestamp * 1000); // Convert seconds to milliseconds
        return date.toLocaleDateString("en-US");
    }
});
