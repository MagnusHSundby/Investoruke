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
  if (isDragging == true) {
    checkDone();
  }
  isDragging = false;
  postit.style.cursor = "grab";
});

let homeDiv = document.getElementById("home");

homeDiv.addEventListener("mousedown", (e) => {
  window.location.href = "index.html";
  console.log("HOME");
});

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
    postit.style.fontSize = "15px";
    watermark.style.display = "block";
  } else {
    console.log("NO");
    watermark.style.display = "none";
  }

  console.log("Left:", postitBouderies.left);
}
