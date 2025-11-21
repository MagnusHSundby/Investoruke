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
  // Calculate offset between mouse and postit's top-left corner
  offsetX = e.clientX - postit.offsetLeft;
  offsetY = e.clientY - postit.offsetTop;
  postit.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    // Update position to follow cursor, accounting for offset
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
); // Gets viewport width

function checkDone() {
  const postitBouderies = postit.getBoundingClientRect();

  if (postitBouderies.left > vw / 2) {
    // If position is grater than vw / 2, it means it is completed
    console.log("YES");
  } else {
    console.log("NO");
  }

  // Debug
  console.log("Left:", postitBouderies.left);
}
