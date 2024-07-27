const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

const BACKEND_URL = "http://localhost:8000";

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

function signUp(event) {
  event.preventDefault();
  const userName = document.getElementById("user-name").value;
  const userEmail = document.getElementById("user-email").value;
  const userPassword = document.getElementById("user-password").value;
  const userType = document.getElementById("user-type").value;
  console.log(userEmail, userPassword, userName, userType);
  apiCall(
    "user",
    "POST",
    JSON.stringify({
      userName,
      userEmail,
      userPassword,
      userType,
    })
  )
    .then((res) => {
      alert("signup success");
    })
    .catch((err) => {
      alert(err.message);
    });
}
async function signIn(e) {
  e.preventDefault();
  const email = document.getElementById("user-email-login").value;
  const password = document.getElementById("user-password-login").value;
  const res = await apiCall(
    "login",
    "POST",
    JSON.stringify({
      email: "test@mail.com",
      password: "test@123",
    })
  );
  if (res.message === "success") {
    debugger;
    localStorage.setItem("token", res.token);
    window.location.href = "/index.html";
  }
  console.log("res: ", res);
}
