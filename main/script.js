$(document).ready(function () {
    function checkUserSession() {
        let username = localStorage.getItem("username");
        if (username) {
            $("#navbar-container-login").show();
            $("#navbar-container-logout").hide();
        } else {
            $("#navbar-container-login").hide();
            $("#navbar-container-logout").show();
        }
    }

    checkUserSession();

    $("#signup-form").submit(function (event) {
        event.preventDefault();

        let email = $("#email").val().trim();
        let password = $("#password").val().trim();
        let confirmPassword = $("#confirm-password").val().trim();

        if (!email || !password || !confirmPassword) {
            showMessage("All fields are required!", "red");
            return;
        }

        if (password !== confirmPassword) {
            showMessage("Passwords do not match!", "red");
            return;
        }

        $.ajax({
            url: "http://localhost:5000/register",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ email: email, password: password }),
            success: function (response) {
                showMessage("Registration successful! Welcome, " + response.username, "green");
                localStorage.setItem("username", response.username);
                $("#signup-form")[0].reset();
                setTimeout(() => {
                    location.reload();
                }, 1000);
            },
            error: function (xhr) {
                let error = xhr.responseJSON?.error || "Registration failed!";
                showMessage(error, "red");
            }
        });
    });

    $(document).on("click", "#logout-btn", function () {
        localStorage.removeItem("username");
        checkUserSession();
    });

    function showMessage(text, color) {
        $("#message").text(text).css("color", color);
        $("#message-container").fadeIn();
        setTimeout(() => {
            $("#message-container").fadeOut();
        }, 3000);
    }
});
