const data = {
  "Tricephalos": {
    list1: ["Bell Bearing Hunter", "Demi Human Queen"],
    list2: ["Fell Omen", "Tree Sentinel & Royal Cavalrymen"],
  },
  "Gaping Jaw": {
    list1: [
      "Dukes Dear Freja",
      "Gaping Dragon",
      "Nights Cavalry",
      "Valiant Gargoyle",
      "Wormface",
    ],
    list2: [
      "Ancient Dragon",
      "Crucible Knight & Golden Hippopotamus",
      "Outland Commander",
    ],
  },
  "Sentient Pest": {
    list1: [
      "Battlefield Commander",
      "Centipede Demon",
      "Smelter Demon",
      "Tibia Mariner",
    ],
    list2: [
      "Draconic Tree Sentinel & Royal Cavalrymen",
      "Great Wyrm",
      "Nox Dragonkin Soldier",
    ],
  },
  "Augur": {
    list1: [
      "Gaping Dragon",
      "Grafted Monarch",
      "Smelter Demon",
      "Tibia Mariner",
      "Wormface",
    ],
    list2: [
      "Full-Grown Fallingstar Beast",
      "Godskin Duo",
      "Tree Sentinel & Royal Cavalrymen",
    ],
  },
  "Libra": {
    list1: [
      "Battlefield Commander",
      "Centipede Demon",
      "Dukes Dear Freja",
      "Royal Revenant",
      "Tibia Mariner",
    ],
    list2: [
      "Crucible Knight & Golden Hippopotamus",
      "Death Rite Bird",
      "Godskin Duo",
    ],
  },
  "Darkdrift Knight": {
    list1: [
      "Centipede Demon",
      "Gaping Dragon",
      "Nights Cavalry",
      "Royal Revenant",
      "Wormface",
    ],
    list2: ["Nameless King", "Nox Dragonkin Soldier", "Outland Commander"],
  },
  "Caligo": {
    list1: [
      "Dukes Dear Freja",
      "Grafted Monarch",
      "Smelter Demon",
      "Tibia Mariner",
      "Ulcerated Tree Spirit",
    ],
    list2: [
      "Dancer",
      "Draconic Tree Sentinel & Royal Cavalrymen",
      "Godskin Duo",
    ],
  },
  "Heolstor": {
    list1: [
      "Battlefield Commander",
      "Bell Bearing Hunter",
      "Centipede Demon",
      "Demi-Human Queen",
      "Gaping Dragon",
      "Grafted Monarch",
      "Nights Cavalry",
      "Royal Revenant",
      "Smelter Demon",
      "Valiant Gargoyle",
    ],
    list2: [
      "Ancient Dragon",
      "Crucible Knight & Golden Hippopotamus",
      "Dancer",
      "Fell Omen",
      "Full-Grown Fallingstar Beast",
      "Great Wyrm",
      "Nameless King",
      "Nox Dragonkin Soldier",
    ],
  },
};

let currentAnswer = "";
let currentNight1 = "";
let currentNight2 = "";
let round = 0;
let points = 0;
let attemptsLeft = 3;
const maxRounds = 6;
let roundActive = true;
let gameHistory = [];
let incorrectGuesses = new Set();
let learningInsights = [];
let currentRoundAttempts = [];

function createMinibossToNightLordsMap() {
  const map = {};

  for (const [nightLord, lists] of Object.entries(data)) {
    lists.list1.forEach((miniboss) => {
      if (!map[miniboss]) map[miniboss] = new Set();
      map[miniboss].add(nightLord);
    });

    lists.list2.forEach((miniboss) => {
      if (!map[miniboss]) map[miniboss] = new Set();
      map[miniboss].add(nightLord);
    });
  }

  const finalMap = {};
  for (const [miniboss, nightLords] of Object.entries(map)) {
    finalMap[miniboss] = Array.from(nightLords).sort();
  }

  return finalMap;
}

const minibossToNightLords = createMinibossToNightLordsMap();

function abbreviateBossName(name) {
  const abbreviations = {
    "Tree Sentinel & Royal Cavalrymen": "Tree Sentinel + Duo",
    "Crucible Knight & Golden Hippopotamus": "Crucible Knight & Hippo",
    "Draconic Tree Sentinel & Royal Cavalrymen": "Draconic Tree Sentinel + Duo",
    "Full-Grown Fallingstar Beast": "Fallingstar Beast",
    "Nox Dragonkin Soldier": "Dragonkin Soldier",
  };

  if (abbreviations[name]) {
    return abbreviations[name];
  }

  return name;
}

function populateDropdown() {
  const select = document.getElementById("guess");
  select.innerHTML =
    '<option value="" selected disabled>Select a boss</option>';
  Object.keys(data).forEach((boss) => {
    const opt = document.createElement("option");
    opt.value = boss;
    opt.textContent = boss;
    select.appendChild(opt);
  });
}

function nextRound() {
  if (round >= maxRounds) {
    endGame();
    return;
  }

  round++;
  attemptsLeft = 3;
  roundActive = true;
  incorrectGuesses.clear();
  currentRoundAttempts = [];

  document.getElementById("result").textContent = "";
  document.getElementById("nextBtn").style.display = "none";
  document.getElementById("guess").value = "";

  const night1Element = document.getElementById("night1Boss");
  const night2Element = document.getElementById("night2Boss");

  night1Element.classList.add("fade-out");
  night2Element.classList.add("fade-out");

  const bosses = Object.keys(data);
  const boss = bosses[Math.floor(Math.random() * bosses.length)];
  currentAnswer = boss;

  const list1 = data[boss].list1;
  const list2 = data[boss].list2;
  const m1 = list1[Math.floor(Math.random() * list1.length)];
  const m2 = list2[Math.floor(Math.random() * list2.length)];

  currentNight1 = m1;
  currentNight2 = m2;

  setTimeout(() => {
    night1Element.textContent = currentNight1;
    night2Element.textContent = currentNight2;

    night1Element.classList.remove("fade-out");
    night2Element.classList.remove("fade-out");
    night1Element.classList.add("fade-in");
    night2Element.classList.add("fade-in");

    setTimeout(() => {
      night1Element.classList.remove("fade-in");
      night2Element.classList.remove("fade-in");
    }, 300);

    populateDropdown();
    updateScoreBoard();
  }, 300);
}

function submitGuess() {
  if (!roundActive) return;

  const select = document.getElementById("guess");
  const choice = select.value;
  const result = document.getElementById("result");

  if (!choice) {
    result.textContent = "Please select a boss!";
    result.style.color = "orange";
    return;
  }

  if (incorrectGuesses.has(choice)) {
    result.textContent = "You already tried this boss!";
    result.style.color = "orange";
    return;
  }

  const card = document.querySelector(".card");

  if (choice === currentAnswer) {
    let earned = attemptsLeft === 3 ? 300 : attemptsLeft === 2 ? 200 : 100;
    points += earned;
    result.textContent = `✅ Correct! +${earned} points`;
    result.style.color = "lime";

    addToHistory(currentNight1, currentNight2, currentAnswer, true, earned);

    // Add correct learning insight
    learningInsights.push({
      type: "correct",
      night1: currentNight1,
      night2: currentNight2,
      nightLord: currentAnswer,
      timestamp: Date.now(),
    });

    updateLearningPanel();

    card.classList.add("glow");

    roundActive = false;

    // Check if this is the final round
    if (round >= maxRounds) {
      setTimeout(() => {
        card.classList.remove("glow");
        endGame();
      }, 1500);
    } else {
      setTimeout(() => {
        card.classList.remove("glow");
        nextRound();
      }, 1500);
    }
  } else {
    attemptsLeft--;
    incorrectGuesses.add(choice);

    // Track this attempt
    currentRoundAttempts.push(choice);

    const incorrectOption = select.querySelector(`option[value="${choice}"]`);
    if (incorrectOption) {
      incorrectOption.disabled = true;
      incorrectOption.style.color = "#888";
    }

    if (attemptsLeft > 0) {
      result.textContent = `❌ Wrong! Attempts left: ${attemptsLeft}`;
      result.style.color = "orange";
    } else {
      result.textContent = `🫵😂 The correct boss was ${currentAnswer}`;
      result.style.color = "orange";

      addToHistory(currentNight1, currentNight2, currentAnswer, false, 0);

      // Add incorrect learning insight with all attempts
      const night1NightLords = minibossToNightLords[currentNight1] || [];
      const night2NightLords = minibossToNightLords[currentNight2] || [];

      learningInsights.push({
        type: "incorrect",
        night1: currentNight1,
        night2: currentNight2,
        attemptedNightLords: [...currentRoundAttempts],
        correctNightLord: currentAnswer,
        night1NightLords: night1NightLords,
        night2NightLords: night2NightLords,
        timestamp: Date.now(),
      });

      updateLearningPanel();

      roundActive = false;

      // Check if this is the final round
      if (round >= maxRounds) {
        document.getElementById("nextBtn").style.display = "none";
        setTimeout(() => {
          endGame();
        }, 1500);
      } else {
        document.getElementById("nextBtn").style.display = "block";
      }
    }

    card.classList.add("shake");
    setTimeout(() => card.classList.remove("shake"), 500);
  }

  updateScoreBoard();
}

function addToHistory(night1, night2, correctBoss, correct, pointsEarned) {
  const abbreviatedNight1 = abbreviateBossName(night1);
  const abbreviatedNight2 = abbreviateBossName(night2);
  const abbreviatedBoss = abbreviateBossName(correctBoss);

  gameHistory.push({
    round: round,
    night1: abbreviatedNight1,
    night2: abbreviatedNight2,
    correctBoss: correctBoss,
    displayBoss: abbreviatedBoss,
    playerCorrect: correct,
    points: pointsEarned,
  });

  updateHistoryDisplay();
}

function updateHistoryDisplay() {
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "";

  gameHistory.forEach((entry) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="night1-col">${entry.night1}</span>
      <span class="night2-col">${entry.night2}</span>
      <span class="boss-col">${entry.displayBoss}</span>
    `;
    historyList.appendChild(li);
  });
}

function updateLearningPanel() {
  const learningList = document.getElementById("learningList");
  learningList.innerHTML = "";

  const recentInsights = learningInsights.slice(-6);

  if (recentInsights.length === 0) {
    learningList.innerHTML =
      "<div class='learning-item' style='text-align: center; color: #888;'>Make guesses to see learning insights</div>";
    return;
  }

  recentInsights.forEach((insight) => {
    const div = document.createElement("div");
    div.className = `learning-item ${insight.type}`;

    if (insight.type === "correct") {
      div.innerHTML = `
        <div><strong>✅ Correct!</strong></div>
        <div>${insight.night1} + ${insight.night2}</div>
        <div>→ <span class="nightlord-name">${insight.nightLord}</span></div>
      `;
    } else {
      div.innerHTML = `
        <div><strong>❌ You selected:</strong></div>
        <div>${insight.attemptedNightLords
          .map((nl) => `<span class="nightlord-name">${nl}</span>`)
          .join(", ")}</div>
        <div style="margin-top: 0.5em;">But <span class="boss-name">${
          insight.night1
        }</span> appears with:</div>
        <div>${insight.night1NightLords
          .map((nl) => `<span class="nightlord-name">${nl}</span>`)
          .join(", ")}</div>
        <div style="margin-top: 0.5em;"><span class="boss-name">${
          insight.night2
        }</span> appears with:</div>
        <div>${insight.night2NightLords
          .map((nl) => `<span class="nightlord-name">${nl}</span>`)
          .join(", ")}</div>
        <div style="margin-top: 0.5em;">Correct answer: <span class="nightlord-name">${
          insight.correctNightLord
        }</span></div>
      `;
    }

    learningList.appendChild(div);
  });
}

function updateScoreBoard() {
  const roundEmojis = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣"];
  const currentRoundEmoji = roundEmojis[round] || round;
  const maxRoundEmoji = roundEmojis[maxRounds] || maxRounds;

  document.getElementById(
    "roundDisplay"
  ).textContent = `Round: ${currentRoundEmoji} of ${maxRoundEmoji}`;

  const pointsDisplay = points === 0 ? "🫵😂" : points;
  document.getElementById(
    "pointsDisplay"
  ).textContent = `Points: ${pointsDisplay}`;

  let attemptsDisplay = "";
  for (let i = 0; i < 3; i++) {
    attemptsDisplay += i < attemptsLeft ? "💀" : "🔴";
  }
  document.getElementById(
    "attemptsDisplay"
  ).textContent = `Attempts: ${attemptsDisplay}`;
}

function endGame() {
  document.getElementById("night1Boss").textContent = "-";
  document.getElementById("night2Boss").textContent = "-";
  document.getElementById(
    "result"
  ).textContent = `Final Score: ${points} points`;
  document.getElementById("result").style.color = "lime";
  document.getElementById("submitBtn").style.display = "none";
  document.getElementById("nextBtn").style.display = "none";

  const restartBtn = document.createElement("button");
  restartBtn.textContent = "Play Again";
  restartBtn.className = "restart-btn";
  restartBtn.onclick = restartGame;
  document.getElementById("restartButtonContainer").appendChild(restartBtn);
}

function restartGame() {
  round = 0;
  points = 0;
  attemptsLeft = 3;
  roundActive = true;
  gameHistory = [];
  incorrectGuesses.clear();
  learningInsights = [];
  currentRoundAttempts = [];

  document.getElementById("submitBtn").style.display = "inline-block";
  document.getElementById("restartButtonContainer").innerHTML = "";
  document.getElementById("historyList").innerHTML = "";

  updateLearningPanel();
  nextRound();
}

document.getElementById("submitBtn").addEventListener("click", submitGuess);
document.getElementById("nextBtn").addEventListener("click", nextRound);

nextRound();
