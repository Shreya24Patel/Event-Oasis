const BACKEND_URL = "http://localhost:8000";

async function initialize() {
  const loginDiv = document.getElementById("login-signup");
  const profileDiv = document.getElementById("profile-dropdown");

  const loggedIn = await isLoggedIn();
  if(loggedIn) {
    loginDiv.style.display = "none";
    profileDiv.style.display = "initial";
  }
  else {
    loginDiv.style.display = "initial";
    profileDiv.style.display = "none";
  }

}

async function signOut(e) {
  if(e) e.preventDefault();
  const token = localStorage.getItem("token");
  if(token) {
    const res = await apiCall("signout","POST",undefined,true);
    if(res.success) {
      window.location.href = "/Login & Signup/signin.html";
    }
  }
}

