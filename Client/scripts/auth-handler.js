const baseUrl = "https://notaty-6ryr.onrender.com";
// const baseUrl = "http://localhost:5000";

// Function to toggle between Login and Sign Up forms
function toggleForm(form) {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const errorMessage = document.getElementById("error-message");

  errorMessage.style.display = "none";

  if (form === "login") {
    loginForm.style.display = "block";
    signupForm.style.display = "none";
  } else {
    signupForm.style.display = "block";
    loginForm.style.display = "none";
  }
}

// Function to make the signup request
async function signup(data) {
  const response = await fetch(`${baseUrl}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

// Function to make the login request
async function login(data) {
  const response = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

// Handle the signup form submission
async function signupHandler(event) {
  event.preventDefault();
  const username = document.getElementById("signup-username").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const errorMessage = document.getElementById("error-message");

  if (username === "" || email === "" || password === "") {
    errorMessage.textContent = "All fields are required.";
    errorMessage.style.display = "block";
    return;
  }

  const data = { username, email, password };
  try {
    const result = await signup(data);
    if (result.status === "SUCCESS") {
      alert("Sign Up successful");
      // toggleForm("login");
      if (result?.data?.username) {
        localStorage.setItem("username", result?.data?.username);
        localStorage.setItem("token", result?.data?.token);
      } else {
        console.error("Registeraition fialed !");
      }
      alert("Login successful");
      window.location.href = "/";
    } else {
      errorMessage.textContent = result.message;
      errorMessage.style.display = "block";
    }
  } catch (error) {
    console.error("Error: ", error);
    errorMessage.textContent = "Something went wrong. Please try again.";
    errorMessage.style.display = "block";
  }
}

// Handle the login form submission
async function loginHandler(event) {
  event.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const errorMessage = document.getElementById("error-message");

  if (email === "" || password === "") {
    errorMessage.textContent = "Please enter both email and password.";
    errorMessage.style.display = "block";
    return;
  }

  const data = { email, password };
  try {
    const result = await login(data);
    if (result.status === "SUCCESS") {
      if (result?.data?.username) {
        localStorage.setItem("username", result?.data?.username);
        localStorage.setItem("token", result?.data?.token);
      } else {
        console.error("Username element or result.username is missing.");
      }
      alert("Login successful");
      window.location.href = "/";
    } else {
      errorMessage.textContent = result.message;
      errorMessage.style.display = "block";
    }
  } catch (error) {
    console.error("Error: ", error);
    errorMessage.textContent = "Invalid username or password.";
    errorMessage.style.display = "block";
  }
}
