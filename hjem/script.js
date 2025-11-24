let data;
let goal = prompt("What is your goal for the day?");
console.log(goal);
let goalText = document.getElementById("goal");

goalText.innerText = goal;

let postit = document.querySelector(".postit");

postit.style.position = "absolute";
postit.style.left = 10 + "px";
postit.style.top = 100 + "px";

let isDragging = false;
let offsetX, offsetY;

postit.addEventListener("mousedown", (e) => {
  isDragging = true;
  offsetX = e.clientX - postit.offsetLeft;
  offsetY = e.clientY - postit.offsetTop;
  postit.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    postit.style.left = e.clientX - offsetX + "px";
    postit.style.top = e.clientY - offsetY + "px";
  }
});

document.addEventListener("mouseup", () => {
  const wasDragging = isDragging;
  isDragging = false;
  postit.style.cursor = "grab";
  if (wasDragging) {
    try {
      checkDone();
    } catch (err) {
      console.error("checkDone() failed:", err);
    }
  }
});

let homeDiv = document.getElementById("home");
if (homeDiv) {
  homeDiv.addEventListener("mousedown", (e) => {
    window.location.href = "index.html";
    console.log("HOME");
  });
}

const postitBouderies = postit.getBoundingClientRect();

let vw = Math.max(
  document.documentElement.clientWidth || 0,
  window.innerWidth || 0
);

let watermark = document.createElement("div");
watermark.innerText = "☆";
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
postit.style.overflow = "visible";
postit.appendChild(watermark);

function checkDone() {
  const postitBouderies = postit.getBoundingClientRect();

  if (postitBouderies.left > vw / 2) {
    console.log("YES");
    watermark.style.display = "block";
  } else {
    console.log("NO");
    watermark.style.display = "none";
  }

  console.log("Left:", postitBouderies.left);
}

async function fetchData(category) {
    try {
        const response = await fetch("data/motivasjonMeldinger.json")

        if (!response.ok) throw new Error(`Response ${response.status}`);

        data = await response.json();
    } catch (error) {
        console.log("Fetch error:", error.message);
    }
    chooseMessage(category);
};

function chooseMessage(category) {
    let count = data.motivational_messages[category].length;
    let randomIndex = Math.floor(Math.random() * count)

    let messages = data.motivational_messages[category][randomIndex]
    console.log(messages);
};
