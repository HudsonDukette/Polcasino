const navButtons = document.querySelectorAll(".nav-btn[data-view]");
const views = document.querySelectorAll(".view");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const usernameLabel = document.getElementById("usernameLabel");
let loggedIn = false;
const demoUsername = "NeonPlayer";

function setView(target) {
  views.forEach(view => view.classList.add("hidden"));
  const active = document.getElementById(target);
  if (active) active.classList.remove("hidden");
  navButtons.forEach(button => button.classList.toggle("active", button.dataset.view === target));
}

function updateAuthState() {
  if (loggedIn) {
    loginBtn.classList.add("hidden");
    signupBtn.classList.add("hidden");
    usernameLabel.classList.remove("hidden");
    usernameLabel.textContent = demoUsername;
  } else {
    loginBtn.classList.remove("hidden");
    signupBtn.classList.remove("hidden");
    usernameLabel.classList.add("hidden");
  }
}

navButtons.forEach(btn => {
  btn.addEventListener("click", () => setView(btn.dataset.view));
});

loginBtn.addEventListener("click", () => {
  loggedIn = true;
  updateAuthState();
  setView("dashboard");
});

signupBtn.addEventListener("click", () => {
  loggedIn = true;
  updateAuthState();
  setView("dashboard");
});

setView("dashboard");
updateAuthState();