document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const uucmsId = document.getElementById("uucms_id").value.trim();
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    const uucmsRegex = /^U\d{2}EZ\d{2}S\d{3}\d$/;

    if (!uucmsRegex.test(uucmsId)) {
        errorMessage.textContent = "Invalid UUCMS ID format!";
        return;
    } else {
        errorMessage.textContent = "";
    }

    fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uucms_id: uucmsId, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem("token", data.token);
            alert("Login successful!");
            window.location.href = "dashboard.html";    
        } else {
            errorMessage.textContent = "Invalid UUCMS ID or password";
        }
    })
    .catch(error => console.error("Error:", error));
});
