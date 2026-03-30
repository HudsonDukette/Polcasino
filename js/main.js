const navButtons = document.querySelectorAll(".nav-btn[data-view]");
const views = document.querySelectorAll(".view");

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.view;
    views.forEach(v => v.classList.add("hidden"));
    document.getElementById(target).classList.remove("hidden");
  });
});