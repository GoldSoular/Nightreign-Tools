const incrementalRuneCosts = [
  0, 0, 3698, 7922, 12348, 16978, 21818, 26869, 32137, 37624, 43335, 49271,
  55439, 61840, 68479, 75358,
];

const currentLevelSelect = document.getElementById("currentLevel");
const desiredLevelSelect = document.getElementById("desiredLevel");
const calculateBtn = document.getElementById("calculateBtn");
const resultDiv = document.getElementById("result");
const errorDiv = document.getElementById("error");
const swapLayoutBtn = document.getElementById("swapLayoutBtn");
const body = document.body;

const maxLevel = 15;
const minLevel = 1;

const mobileMediaQuery = window.matchMedia("(max-width: 1000px)");

function handleMobileLayout(e) {
  if (e.matches) {
    body.classList.remove("layout-swapped");
  }
}

for (let i = minLevel; i < maxLevel; i++) {
  const option = document.createElement("option");
  option.value = i;
  option.textContent = `Level ${i}`;
  currentLevelSelect.appendChild(option);
}

function populateDesiredLevelOptions(
  currentLevel,
  previouslySelectedDesiredLevel
) {
  desiredLevelSelect.innerHTML = "";
  let foundPreviousSelection = false;

  for (let i = currentLevel + 1; i <= maxLevel; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `Level ${i}`;
    desiredLevelSelect.appendChild(option);

    if (i === previouslySelectedDesiredLevel) {
      foundPreviousSelection = true;
    }
  }

  if (foundPreviousSelection) {
    desiredLevelSelect.value = previouslySelectedDesiredLevel;
  } else {
    if (desiredLevelSelect.options.length > 0) {
      desiredLevelSelect.value = currentLevel + 1;
    } else {
      desiredLevelSelect.value = currentLevel;
      desiredLevelSelect.disabled = true;
    }
  }
}

currentLevelSelect.addEventListener("change", () => {
  const currentLevel = parseInt(currentLevelSelect.value);
  const previouslySelectedDesiredLevel = parseInt(desiredLevelSelect.value);

  populateDesiredLevelOptions(currentLevel, previouslySelectedDesiredLevel);
});

document.addEventListener("DOMContentLoaded", () => {
  currentLevelSelect.value = minLevel;

  populateDesiredLevelOptions(parseInt(currentLevelSelect.value), maxLevel);

  const dynamicImageLayer = document.getElementById("dynamic-image-layer");
  const backgroundImages = [
    "images/classes/duchess.webp",
    "images/classes/executor.webp",
    "images/classes/guardian.webp",
    "images/classes/ironeye.webp",
    "images/classes/raider.webp",
    "images/classes/recluse.webp",
    "images/classes/revenant.webp",
    "images/classes/wylder.webp",
  ];
  const randomIndex = Math.floor(Math.random() * backgroundImages.length);
  const selectedImage = backgroundImages?.[randomIndex];
  dynamicImageLayer.style.backgroundImage = `url('${selectedImage}')`;

  mobileMediaQuery.addEventListener("change", handleMobileLayout);
  handleMobileLayout(mobileMediaQuery);
});

calculateBtn.addEventListener("click", () => {
  resultDiv.style.display = "none";
  errorDiv.style.display = "none";
  resultDiv.innerHTML = "";
  errorDiv.textContent = "";

  resultDiv.classList.remove("highlight-success");
  resultDiv.style.animation = "";

  const currentLevel = parseInt(currentLevelSelect.value);
  const desiredLevel = parseInt(desiredLevelSelect.value);

  if (isNaN(currentLevel) || isNaN(desiredLevel)) {
    errorDiv.textContent = "Please select both current and desired levels.";
    errorDiv.style.display = "block";
    return;
  }

  if (currentLevel >= desiredLevel) {
    errorDiv.textContent =
      "Desired level must be higher than your current level.";
    errorDiv.style.display = "block";
    return;
  }

  let totalRunesNeeded = 0;
  for (let i = currentLevel + 1; i <= desiredLevel; i++) {
    totalRunesNeeded += incrementalRuneCosts?.[i] || 0;
  }

  // Detect mobile
  const isMobile = window.matchMedia("(max-width: 1000px)").matches;

  if (isMobile) {
    resultDiv.innerHTML = `<span class="rune-value">${totalRunesNeeded.toLocaleString()}</span>`;
  } else {
    resultDiv.innerHTML = `You need <span class="rune-value">${totalRunesNeeded.toLocaleString()}</span> Runes<br>Level ${currentLevel} — Level ${desiredLevel}.`;
  }

  resultDiv.style.display = "block";
  void resultDiv.offsetWidth;

  resultDiv.classList.add("highlight-success");
});

swapLayoutBtn.addEventListener("click", () => {
  body.classList.toggle("layout-swapped");
});

// Boss rotation data
const bossRotations = [
  {
    name: "Gaping Maw",
    start: "2025-06-19T22:00:00+09:00",
    end: "2025-06-26T21:59:00+09:00",
  },
  {
    name: "Darkdrift Knight",
    start: "2025-06-26T21:59:00+09:00",
    end: "2025-07-03T21:59:00+09:00",
  },
  {
    name: "Sentient Pest",
    start: "2025-07-03T21:59:00+09:00",
    end: "2025-07-10T21:59:00+09:00",
  },
];

// Helper to get current and next boss
function getCurrentBoss(now) {
  for (let i = 0; i < bossRotations.length; i++) {
    const boss = bossRotations[i];
    const start = new Date(boss.start);
    const end = new Date(boss.end);
    if (now >= start && now < end) {
      const nextBoss = bossRotations[(i + 1) % bossRotations.length];
      return { boss, nextBoss };
    }
  }
  // If none match, show the next upcoming
  return { boss: bossRotations[0], nextBoss: bossRotations[1] };
}

function updateBossCountdown() {
  const now = new Date();
  const { boss, nextBoss } = getCurrentBoss(now);
  const end = new Date(boss.end);

  document.getElementById("currentBossMain").textContent = boss.name;
  document.getElementById("nextBossName").textContent = nextBoss.name;

  const displayEnd = new Date(end.getTime() + 60 * 1000);

  function getOrdinal(n) {
    const s = ["th", "st", "nd", "rd"],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  const day = getOrdinal(displayEnd.getDate());
  const month = displayEnd.toLocaleString(undefined, { month: "long" });
  let hour = displayEnd.getHours();
  const isPM = hour >= 12;
  hour = hour % 12 || 12; // 12-hour format
  const ampm = isPM ? "pm" : "am";

  // If minutes are not zero, show them, else just hour
  const minutes = displayEnd.getMinutes();
  const timeStr =
    minutes === 0
      ? `${hour}${ampm}`
      : `${hour}:${minutes.toString().padStart(2, "0")}${ampm}`;

  document.getElementById(
    "countdownEndTime"
  ).textContent = `${month} ${day}, ${timeStr}`;

  // Calculate time left
  const diff = end - now;
  if (diff > 0) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours
      .toString()
      .padStart(2, "0");
    document.getElementById("minutes").textContent = minutes
      .toString()
      .padStart(2, "0");
    document.getElementById("seconds").textContent = seconds
      .toString()
      .padStart(2, "0");

    document.getElementById("countdownStatusMessage").style.display = "none";
  } else {
    document.getElementById("countdownStatusMessage").style.display = "";
    document.getElementById("countdownStatusMessage").textContent =
      "Boss rotation changing...";
  }
}

// Start countdown interval
setInterval(updateBossCountdown, 1000);
updateBossCountdown();
