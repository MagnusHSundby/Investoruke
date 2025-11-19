let goal = prompt("What is your goal for the day?");
console.log(goal);
let goal_text = document.getElementById("goal");
goal_text.innerText = goal;

let postit = document.getElementsByClassName("postit");

function click() {
  console.log("click");
}
