let goal = prompt("What is your goal for the day?");
console.log(goal);
let goalText = document.getElementById("goal");
goalText.innerText = goal;

let postit = document.querySelector(".postit");

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
  isDragging = false;
  postit.style.cursor = "grab";
});

let homeDiv = document.getElementById("home");

homeDiv.addEventListener("mousedown", (e) => {
  console.log("HOME");
});
