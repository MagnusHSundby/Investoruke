let data;
let same = false;
let goal = null;
const todayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
const savedDate = localStorage.getItem('dailyGoalDate');
const savedGoal = localStorage.getItem('dailyGoal');

// sjekker dagen
if (savedDate === todayStr && savedGoal !== null) {
  goal = savedGoal;
  same = true;
} else { // hvis dagen ikke allerede har et mål
  goal = prompt("What is your goal for the day?") || '';
  localStorage.setItem('dailyGoal', goal);
  localStorage.setItem('dailyGoalDate', todayStr);
}
console.log(goal);
let goalText = document.getElementById("goal");
if (goalText) goalText.innerText = goal;

let postit = document.querySelector(".postit");
if (postit) {
  postit.style.position = "absolute";
  // posisjon for postit hvis det finnes, og det er samme dag som når du sist skrev inn mål
  try {
    const savedPos = JSON.parse(localStorage.getItem('postitPos'));
    if (savedPos && typeof savedPos.left === 'number' && typeof savedPos.top === 'number' && same === true) {
      postit.style.left = savedPos.left + 'px';
      postit.style.top = savedPos.top + 'px';
    } else {
      postit.style.left = 10 + "px";
      postit.style.top = 100 + "px";
    }
  } catch (err) {
    postit.style.left = 10 + "px";
    postit.style.top = 100 + "px";
  }
}

let isDragging = false;
let offsetX, offsetY;

if (postit) { // ta postit
  postit.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - postit.offsetLeft;
    offsetY = e.clientY - postit.offsetTop;
    postit.style.cursor = "grabbing";
  });
}

document.addEventListener("mousemove", (e) => { // flytte postit
  if (isDragging && postit) {
    postit.style.left = e.clientX - offsetX + "px";
    postit.style.top = e.clientY - offsetY + "px";
  }
});

document.addEventListener("mouseup", () => { //slippe postit
  const wasDragging = isDragging;
  isDragging = false;
  if (postit) postit.style.cursor = "grab";
  if (wasDragging) {
    try {
      checkDone();
    } catch (err) {
      console.error("checkDone() failed:", err);
    }
    try { savePostitPosition(); } catch (e) { /* ignore */ }
  }
});

function savePostitPosition() { // lagre postit posisjon
  if (!postit) return;
  const leftPx = parseFloat(postit.style.left) || postit.getBoundingClientRect().left || 0;
  const topPx = parseFloat(postit.style.top) || postit.getBoundingClientRect().top || 0;
  localStorage.setItem('postitPos', JSON.stringify({ left: leftPx, top: topPx }));
  const vwLocal = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const done = leftPx > vwLocal / 2;
  localStorage.setItem('postitDone', done ? '1' : '0');
}


window.addEventListener('beforeunload', savePostitPosition);

let homeDiv = document.getElementById("home");
if (homeDiv) {
  homeDiv.addEventListener("mousedown", (e) => {
    window.location.href = "index.html";
    console.log("HOME");
  });
}

let vw = Math.max(
  document.documentElement.clientWidth || 0,
  window.innerWidth || 0
);

let watermark = document.createElement("div");
watermark.innerText = "☆"; // stjerne for når du er ferdig med målet
watermark.style.cssText = `
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 100px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.2);
  pointer-events: none;
  display: none;
  z-index: 10;
`;
if (postit) { 
  postit.style.overflow = "visible";
  postit.appendChild(watermark);
  const savedDone = localStorage.getItem('postitDone');
  if (savedDone === '1') {
    if (watermark) watermark.style.display = 'block';
  } else if (savedDone === '0') {
    if (watermark) watermark.style.display = 'none';
  } else {
    try { checkDone(); } catch (e) { /* ignore */ }
  }
}

function checkDone() { // sjekker om posisjonen er riktig for å tegne stjerne
  if (!postit) return;
  const postitBouderies = postit.getBoundingClientRect();

  if (postitBouderies.left > vw / 2) {
    console.log("YES");
    if (watermark) watermark.style.display = "block";
    // persist done state
    localStorage.setItem('postitDone', '1');
  } else {
    console.log("NO");
    if (watermark) watermark.style.display = "none";
    // persist done state
    localStorage.setItem('postitDone', '0');
  }

  console.log("Left:", postitBouderies.left);
}

async function fetchData(category) { // henter motivasjonsmeldinger fra json
    try {
        const response = await fetch("data/motivasjonMeldinger.json")

        if (!response.ok) throw new Error(`Response ${response.status}`);

        data = await response.json();
    } catch (error) {
        console.log("Fetch error:", error.message);
    }
    chooseMessage(category);
};

function chooseMessage(category) { // velger en tilfeldig melding basert på hvordan du har skrevet at du føler deg
    let count = data.motivational_messages[category].length;
    let randomIndex = Math.floor(Math.random() * count)

    let messages = data.motivational_messages[category][randomIndex]
    console.log(messages);
};
