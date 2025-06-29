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

for (let i = minLevel; i < maxLevel; i++) {
  const option = document.createElement("option");
  option.value = i;
  option.textContent = `Level ${i}`;
  currentLevelSelect.appendChild(option);
}

for (let i = minLevel + 1; i <= maxLevel; i++) {
  const option = document.createElement("option");
  option.value = i;
  option.textContent = `Level ${i}`;
  desiredLevelSelect.appendChild(option);
}

currentLevelSelect.addEventListener("change", () => {
  const currentLevel = parseInt(currentLevelSelect.value);
  desiredLevelSelect.innerHTML = "";
  for (let i = currentLevel + 1; i <= maxLevel; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `Level ${i}`;
    desiredLevelSelect.appendChild(option);
  }
  resultDiv.style.display = "none";
  errorDiv.style.display = "none";
});

currentLevelSelect.dispatchEvent(new Event("change"));

calculateBtn.addEventListener("click", () => {
  const currentLevel = parseInt(currentLevelSelect.value);
  const desiredLevel = parseInt(desiredLevelSelect.value);

  resultDiv.style.display = "none";
  errorDiv.style.display = "none";
  resultDiv.innerHTML = "";
  errorDiv.textContent = "";

  resultDiv.classList.remove("highlight-success");
  resultDiv.style.animation = ""; // Crucial to allow animation to replay

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
  resultDiv.innerHTML = `You need <span class="rune-value">${totalRunesNeeded.toLocaleString()}</span> Runes<br>Level ${currentLevel} — Level ${desiredLevel}.`;
  resultDiv.style.display = "block";
  void resultDiv.offsetWidth;

  resultDiv.classList.add("highlight-success");
});

swapLayoutBtn.addEventListener("click", () => {
  body.classList.toggle("layout-swapped");
});

document.addEventListener("DOMContentLoaded", () => {
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
});
