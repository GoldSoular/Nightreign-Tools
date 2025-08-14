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
    bosses: ["Sentient Pest"],
    start: "2025-07-04T10:00:00+09:00",
    end: "2025-07-11T10:00:00+09:00",
  },
  {
    bosses: ["Gaping Maw", "Darkdrift Knight"],
    start: "2025-07-11T10:00:00+09:00",
    end: "2025-07-18T10:00:00+09:00",
  },
  {
    bosses: ["Sentient Pest", "Darkdrift Knight"],
    start: "2025-07-18T10:00:00+09:00",
    end: "2025-07-25T10:00:00+09:00",
  },
  {
    bosses: ["Gaping Maw", "Sentient Pest"],
    start: "2025-07-25T10:00:00+09:00",
    end: "2025-08-01T10:00:00+09:00",
  },
  {
    bosses: ["Augur", "Darkdrift Knight"],
    start: "2025-08-01T10:00:00+09:00",
    end: "2025-08-07T10:00:00+09:00",
  },
  {
    bosses: ["Caligo", "Sentient Pest"],
    start: "2025-08-07T10:00:00+09:00",
    end: "2025-08-14T10:00:00+09:00",
  },
  {
    bosses: ["Equilibrious Beast", "Gaping Maw"],
    start: "2025-08-14T10:00:00+09:00",
    end: "2025-08-21T10:00:00+09:00",
  },
  {
    bosses: ["Tricephalos", "Darkdrift Knight"],
    start: "2025-08-21T10:00:00+09:00",
    end: "2025-08-28T10:00:00+09:00",
  },
  {
    bosses: ["Heolstor"],
    start: "2025-08-28T10:00:00+09:00",
    end: "2025-09-04T10:00:00+09:00",
  },
];

const bossAffinities = {
  "Gaping Maw": "images/affinities/poison.jpg",
  "Darkdrift Knight": "images/affinities/lightning.jpg",
  "Sentient Pest": "images/affinities/fire.jpg",
  "Equilibrious Beast": "images/affinities/madness.jpg",
  "Augur": "images/affinities/lightning.jpg",
  "Caligo": "images/affinities/fire.jpg",
  "Tricephalos": "images/affinities/holy.jpg",
  "Heolstor": "images/affinities/holy.jpg",
};

function getCurrentBosses(now) {
  for (let i = 0; i < bossRotations.length; i++) {
    const rotation = bossRotations[i];
    const start = new Date(rotation.start);
    const end = new Date(rotation.end);
    if (now >= start && now < end) {
      const nextRotation = bossRotations[(i + 1) % bossRotations.length];
      return { bosses: rotation.bosses, nextBosses: nextRotation.bosses, end };
    }
  }
  // If none match, show the next upcoming
  return {
    bosses: bossRotations[0].bosses,
    nextBosses: bossRotations[1].bosses,
    end: new Date(bossRotations[0].end),
  };
}

function updateBossCountdown() {
  const now = new Date();
  const { bosses, nextBosses, end } = getCurrentBosses(now);

  // First boss line
  document.getElementById("currentBossMain").textContent = bosses[0] || "";
  const affinityImg = document.getElementById("currentBossAffinity");
  const affinitySrc = bossAffinities[bosses[0]] || "";
  affinityImg.src = affinitySrc;
  affinityImg.alt = (bosses[0] || "") + " Affinity";
  affinityImg.style.display = affinitySrc ? "inline-block" : "none";

  // Second boss line
  document.getElementById("currentBossMain2").textContent = bosses[1] || "";
  const affinityImg2 = document.getElementById("currentBossAffinity2");
  const affinitySrc2 = bossAffinities[bosses[1]] || "";
  affinityImg2.src = affinitySrc2;
  affinityImg2.alt = (bosses[1] || "") + " Affinity";
  affinityImg2.style.display = affinitySrc2 ? "inline-block" : "none";

  // Next boss (for header)
  document.getElementById("nextBossName").textContent = nextBosses.join(" & ");

  // Hover effect for both boss lines
  const bossNameElem1 = document.getElementById("countdownCurrent");
  const bossNameElem2 = document.getElementById("countdownCurrent2");

  // Remove previous event listeners by resetting them to null
  bossNameElem1.onmouseenter = null;
  bossNameElem1.onmouseleave = null;
  bossNameElem1.onclick = null;
  bossNameElem2.onmouseenter = null;
  bossNameElem2.onmouseleave = null;
  bossNameElem2.onclick = null;

  const weaknessMessage = document.getElementById("weaknessMessage");
  const digits = document.getElementById("countdownDigits");

  function getAffinityInfo(bossName) {
    const src = bossAffinities[bossName] || "";
    const name = src
      ? src
          .split("/")
          .pop()
          .replace(".jpg", "")
          .replace(/^\w/, (c) => c.toUpperCase())
      : "";
    let affinityClass = "";
    switch (name.toLowerCase()) {
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
      default:
        affinityClass = "";
    }
    return { name, affinityClass };
  }

  bossNameElem1.onmouseenter = () => {
    const bossName = document
      .getElementById("currentBossMain")
      .textContent.trim();
    const { name, affinityClass } = getAffinityInfo(bossName);
    weaknessMessage.innerHTML = name
      ? `Weak to&nbsp;<span class='${affinityClass}'>${name}</span>`
      : "";
    digits.classList.add("show-weakness");
  };
  bossNameElem1.onmouseleave = () => {
    digits.classList.remove("show-weakness");
    weaknessMessage.innerHTML = "";
  };
  bossNameElem1.onclick = function (event) {
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
  };

  bossNameElem2.onmouseenter = () => {
    const bossName = document
      .getElementById("currentBossMain2")
      .textContent.trim();
    const { name, affinityClass } = getAffinityInfo(bossName);
    weaknessMessage.innerHTML = name
      ? `Weak to&nbsp;<span class='${affinityClass}'>${name}</span>`
      : "";
    digits.classList.add("show-weakness");
  };
  bossNameElem2.onmouseleave = () => {
    digits.classList.remove("show-weakness");
    weaknessMessage.innerHTML = "";
  };
  bossNameElem2.onclick = function (event) {
    if (isMobile()) return;
    const bossName = document
      .getElementById("currentBossMain2")
      .textContent.trim();
    if (isResistanceImageVisible) {
      hideResistanceImage();
    } else {
      showResistanceImage(bossName);
    }
    event.stopPropagation();
  };

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
  ).textContent = `Arriving ${month} ${day}, ${timeStr}`;

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
  if (!bossName) return;
  if (window.matchMedia("(max-width: 1000px)").matches) return;

  if (!resistanceImgElem) {
    resistanceImgElem = document.createElement("img");
    resistanceImgElem.className = "boss-resistance-img";
    document.body.appendChild(resistanceImgElem);
  }
  resistanceImgElem.src = `images/resistances/${bossName}.png`;
  resistanceImgElem.alt = bossName + " Resistances";
  resistanceImgElem.classList.add("visible");
  isResistanceImageVisible = true;
}

function hideResistanceImage() {
  if (resistanceImgElem) {
    resistanceImgElem.classList.remove("visible");
    isResistanceImageVisible = false;
    resistanceImgElem.addEventListener(
      "transitionend",
      function handler(e) {
        if (
          e.propertyName === "opacity" &&
          !resistanceImgElem.classList.contains("visible")
        ) {
          resistanceImgElem.remove();
          resistanceImgElem = null;
          resistanceImgElem?.removeEventListener("transitionend", handler);
        }
      },
      { once: true }
    );
  }
}

document.addEventListener("click", function (event) {
  if (!isMobile() && isResistanceImageVisible) {
    const bossNameElem1 = document.getElementById("countdownCurrent");
    const bossNameElem2 = document.getElementById("countdownCurrent2");
    if (
      resistanceImgElem &&
      !resistanceImgElem.contains(event.target) &&
      !bossNameElem1.contains(event.target) &&
      !bossNameElem2.contains(event.target)
    ) {
      hideResistanceImage();
    }
  }
});

setInterval(updateBossCountdown, 1000);
updateBossCountdown();


