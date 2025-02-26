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


document.querySelectorAll('.btn-option').forEach(button => {
    button.addEventListener('click', function () {
      let nextStep = this.getAttribute('data-step');

      if (this.hasAttribute('data-interest')) {
        selectedInterest = this.getAttribute('data-interest');
      }
      if (this.hasAttribute('data-level')) {
        selectedLevel = this.getAttribute('data-level');
      }
      if (this.hasAttribute('data-time')) {
        selectedTime = this.getAttribute('data-time');
      }

      document.querySelectorAll('.question-block').forEach(q => q.classList.add('d-none'));

      if (nextStep === "result") {

        document.getElementById("result").classList.remove("d-none");
        generateRecommendation();
      } else {
        
        document.getElementById("step" + nextStep).classList.remove("d-none");
      }

      
      let stepIndex = parseInt(nextStep) || 3; 
      document.querySelector('.step-indicator li:nth-child(' + (stepIndex - 1) + ')').classList.add('completed');
      document.querySelector('.step-indicator li:nth-child(' + stepIndex + ')').classList.add('active');
    });
  });

  
  document.querySelectorAll('.back-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      let prevStep = link.getAttribute('data-back');
      
      document.querySelectorAll('.question-block').forEach(q => q.classList.add('d-none'));
      
      document.getElementById('step' + prevStep).classList.remove('d-none');
    });
  });

  function generateRecommendation() {
    let courses = {
      "Web Development": {
        title: "Web Development",
        description: "Learn how to build modern websites and back-end APIs with HTML, CSS, JavaScript, React.",
        skills: "HTML, CSS, JavaScript, React",
        level: "Beginner",
        duration: "3-6 months"
      },
      "Data Science": {
        title: "Data Science",
        description: "Master Python, data analysis, machine learning, and SQL for real-world insights.",
        skills: "Python, Pandas, ML, SQL",
        level: "Intermediate",
        duration: "4-8 months"
      },
      "Cybersecurity": {
        title: "Cybersecurity",
        description: "Protect networks, systems, and data with ethical hacking and advanced security methods.",
        skills: "Network Security, Linux, Ethical Hacking",
        level: "Advanced",
        duration: "6+ months"
      },
      "Mobile Development": {
        title: "Mobile Development",
        description: "Create Android & iOS apps using Flutter/React Native with strong UI/UX principles.",
        skills: "Flutter, React Native, UI/UX",
        level: "Intermediate",
        duration: "3-6 months"
      },
      "AI & Machine Learning": {
        title: "AI & Machine Learning",
        description: "Build intelligent apps with Python, deep learning, and neural networks.",
        skills: "Python, Deep Learning, TensorFlow",
        level: "Advanced",
        duration: "6+ months"
      }
    };

    let recommended = courses[selectedInterest] || {
      title: "General Programming",
      description: "A broad intro to fundamental coding concepts.",
      skills: "Basics of coding",
      level: "Beginner",
      duration: "2-4 months"
    };

    let cardHtml = `
      <div class="card-container">
        <div class="card-back"></div>
        <div class="card">
          <h2>${recommended.title}</h2>
          <p>${recommended.description}</p>
          <div class="divider"></div>
          <p><strong>Key Skills:</strong> ${recommended.skills}</p>
          <div class="bottom">
            <span>${selectedLevel || recommended.level}</span>
            <span>${recommended.duration}</span>
          </div>
        </div>
      </div>
    `;
    document.getElementById("course-recommendation").innerHTML = cardHtml;
}