async function isLoggedIn() {
  const res = await apiCall("is-loggedin", "GET", undefined, true);
  return res.isLoggedIn;
}

async function apiCall(endPoint, method, body, isAuth) {
const BACKEND_URL = 'http://localhost:8000';

  const headers = {
    "content-type": "application/json",
  };
  if (isAuth) {
    const token = localStorage.getItem("token");
    if (!token) throw Error("token not found");
    headers["authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BACKEND_URL}/${endPoint}`, {
    method,
    body,
    headers,
  });
  if (res.status === 403) {
    window.location.href = "/Login & Signup/signin.html"
  }
  if (res.status !== 200) {
    const msg = await res.json();
    throw new Error(msg.message);
  }
  return await res.json();
}
