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

// Dropdown behavior for navbar
const dropdownToggles = document.querySelectorAll('.nav-item.has-dropdown .dropdown-toggle');
dropdownToggles.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const navItem = btn.closest('.nav-item');
    navItem.classList.toggle('open');
    // navigate to games view when toggling
    setView(btn.dataset.view || 'games');
  });
});

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-item.has-dropdown')) {
    document.querySelectorAll('.nav-item.has-dropdown.open').forEach(n => n.classList.remove('open'));
  }
});

// Dropdown item placeholders
document.querySelectorAll('.dropdown-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    alert(item.textContent + ' — Coming soon');
    document.querySelectorAll('.nav-item.has-dropdown.open').forEach(n => n.classList.remove('open'));
  });
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