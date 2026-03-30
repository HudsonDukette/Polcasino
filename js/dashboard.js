document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll("#dashboard .dashboard-cards .card");
  const cardDefinitions = [
    { icon: "assets/icons/dashboard.svg", label: "Global Pool", value: "$999,646,253" },
    { icon: "assets/icons/games.svg", label: "Featured Games", value: "Neon Roulette + Plinko" },
    { icon: "assets/icons/leaderboard.svg", label: "Recent Wins", value: "$128,400" },
    { icon: "assets/icons/profile.svg", label: "Biggest Bet & Win", value: "$20,000 / $100,000" }
  ];

  cards.forEach((card, index) => {
    const def = cardDefinitions[index];
    if (!def) return;
    card.innerHTML = `
      <div class="card-head">
        <img src="${def.icon}" class="card-icon" alt="${def.label}">
        <div class="card-title">${def.label}</div>
      </div>
      <div class="card-value">${def.value}</div>
    `;
  });
});