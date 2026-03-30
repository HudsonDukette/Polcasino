const navButtons = document.querySelectorAll(".nav-btn[data-view]");
const views = document.querySelectorAll(".view");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const usernameLabel = document.getElementById("usernameLabel");
const pfp = document.querySelector('.pfp');
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

// Open profile from avatar / username
if (pfp) pfp.addEventListener('click', () => setView('profile'));
if (usernameLabel) usernameLabel.addEventListener('click', () => setView('profile'));

// Tab logic for games
function setGameTab(tabName) {
  const tabBtns = document.querySelectorAll('.game-tab-btn');
  const tabs = document.querySelectorAll('.game-tab');
  tabBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === tabName));
  tabs.forEach(t => {
    if (t.id === `tab-${tabName}`) {
      t.classList.remove('hidden');
      t.classList.add('active');
    } else {
      t.classList.add('hidden');
      t.classList.remove('active');
    }
  });
}

document.addEventListener('click', (e) => {
  const tabBtn = e.target.closest('.game-tab-btn');
  if (tabBtn) {
    setGameTab(tabBtn.dataset.tab);
  }
});

// Play Now button navigates to Games → Roulette
const playNowBtn = document.getElementById('playNowBtn');
if (playNowBtn) {
  playNowBtn.addEventListener('click', () => {
    setView('games');
    // small delay to allow view to show
    setTimeout(() => setGameTab('roulette'), 80);
  });
}

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