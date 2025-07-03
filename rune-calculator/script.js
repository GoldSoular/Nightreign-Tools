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
    start: "2025-06-19T10:00:00+09:00",
    end: "2025-06-26T10:00:00+09:00",
  },
  {
    name: "Darkdrift Knight",
    start: "2025-06-26T10:00:00+09:00",
    end: "2025-07-03T10:00:00+09:00",
  },
  {
    name: "Sentient Pest",
    start: "2025-07-03T10:00:00+09:00",
    end: "2025-07-10T10:00:00+09:00",
  },
  {
    name: "Boss 4",
    start: "2025-07-10T10:00:00+09:00",
    end: "2025-07-17T10:00:00+09:00",
  },
  {
    name: "Boss 5",
    start: "2025-07-17T10:00:00+09:00",
    end: "2025-07-24T10:00:00+09:00",
  },
  {
    name: "Boss 6",
    start: "2025-07-24T10:00:00+09:00",
    end: "2025-07-31T10:00:00+09:00",
  },
];

const bossAffinities = {
  "Gaping Maw": "images/affinities/poison.jpg",
  "Darkdrift Knight": "images/affinities/lightning.jpg",
  "Sentient Pest": "images/affinities/fire.jpg",
  "Equilibrious Beast": "images/affinities/madness.jpg",
  Augur: "images/affinities/lightning.jpg",
  Caligo: "images/affinities/fire.jpg",
};

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
  document.getElementById("nextBossName").textContent =
    nextBoss.name === "Equilibrious Beast" ? "Libra" : nextBoss.name;

  const affinityImg = document.getElementById("currentBossAffinity");
  const affinitySrc = bossAffinities[boss.name] || "";
  affinityImg.src = affinitySrc;
  affinityImg.alt = boss.name + " Affinity";
  affinityImg.style.display = affinitySrc ? "inline-block" : "none";

  const affinityName = bossAffinities[boss.name]
    ? bossAffinities[boss.name]
        .split("/")
        .pop()
        .replace(".jpg", "")
        .replace(/^\w/, (c) => c.toUpperCase())
    : "";
  const digits = document.getElementById("countdownDigits");
  document
    .getElementById("countdownDigits")
    .setAttribute("data-affinity", affinityName);

  const weaknessMessage = document.getElementById("weaknessMessage");
  digits.setAttribute("data-affinity", affinityName);

  let affinityClass = "";
  switch (affinityName.toLowerCase()) {
    case "fire":
      affinityClass = "affinity-fire";
      break;
    case "lightning":
      affinityClass = "affinity-lightning";
      break;
    case "poison":
      affinityClass = "affinity-poison";
      break;
    case "madness":
      affinityClass = "affinity-madness";
      break;
    case "holy":
      affinityClass = "affinity-holy";
      break;
    // please devs add a non yellow affinity im begging
    default:
      affinityClass = "";
  }
  weaknessMessage.innerHTML = affinityName
    ? `Weak to&nbsp;<span class="${affinityClass}">${affinityName}</span>`
    : "";

  // Show/hide weakness message on boss name hover (desktop only)
  const bossNameElem = document.getElementById("countdownCurrent");

  if (!isMobile()) {
    bossNameElem.onmouseenter = () => {
      if (affinityName) digits.classList.add("show-weakness");
    };
    bossNameElem.onmouseleave = () => {
      digits.classList.remove("show-weakness");
    };
  } else {
    bossNameElem.onmouseenter = null;
    bossNameElem.onmouseleave = null;
  }

  // --- MOBILE TAP-TO-TOGGLE LOGIC ---
  if (!bossCountdown._tapHandlerAdded) {
    bossCountdown.addEventListener("click", function (e) {
      if (isMobile()) {
        const digits = document.getElementById("countdownDigits");
        const currentAffinityName = digits.getAttribute("data-affinity");
        if (currentAffinityName) {
          digits.classList.toggle("show-weakness");
        }
        e.preventDefault();
      }
    });

    document.addEventListener("click", function (e) {
      if (isMobile() && !bossCountdown.contains(e.target)) {
        document
          .getElementById("countdownDigits")
          .classList.remove("show-weakness");
      }
    });
    bossCountdown._tapHandlerAdded = true;
  }

  const displayEnd = end;

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

// Mobile tap-to-toggle for weakness message
const bossCountdown = document.getElementById("boss-countdown");

function isMobile() {
  return window.matchMedia("(max-width: 1000px)").matches;
}

let resistanceImgElem = null;
let isResistanceImageVisible = false;

function showResistanceImage(bossName) {
  if (resistanceImgElem) {
    resistanceImgElem.remove();
    resistanceImgElem = null;
  }
  if (window.matchMedia("(max-width: 1000px)").matches) return;
  if (!bossName) return;

  const img = document.createElement("img");
  img.src = `images/resistances/${bossName}.png`;
  img.alt = bossName + " Resistances";
  img.className = "boss-resistance-img";
  document.body.appendChild(img);
  resistanceImgElem = img;
  isResistanceImageVisible = true;
}

function hideResistanceImage() {
  if (resistanceImgElem) {
    resistanceImgElem.remove();
    resistanceImgElem = null;
    isResistanceImageVisible = false;
  }
}

const countdownCurrent = document.getElementById("countdownCurrent");

countdownCurrent.addEventListener("click", function (event) {
  if (isMobile()) return;

  const bossName = document
    .getElementById("currentBossMain")
    .textContent.trim();

  if (isResistanceImageVisible) {
    hideResistanceImage();
  } else {
    showResistanceImage(bossName);
  }
  event.stopPropagation();
});

document.addEventListener("click", function (event) {
  if (!isMobile() && isResistanceImageVisible) {
    if (
      resistanceImgElem &&
      !resistanceImgElem.contains(event.target) &&
      !countdownCurrent.contains(event.target)
    ) {
      hideResistanceImage();
    }
  }
});

setInterval(updateBossCountdown, 1000);
updateBossCountdown();
