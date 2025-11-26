function addAchievement(
  title = "New Achievement",
  description = "Achievement unlocked!",
  imageSrc = "images/temp.png"
) {
  let achievementsContainer = document.querySelector(
    ".main_content .left .achievements"
  );

  let newAchievement = document.createElement("div");
  newAchievement.className = "achievements_element";

  let imageDiv = document.createElement("div");
  imageDiv.className = "achievements_image";
  let img = document.createElement("img");
  img.src = imageSrc;
  imageDiv.appendChild(img);

  let textDiv = document.createElement("div");
  textDiv.className = "achievements_text";

  let titleDiv = document.createElement("div");
  titleDiv.className = "achievements_title";
  titleDiv.textContent = title;

  let descDiv = document.createElement("div");
  descDiv.className = "achievements_desc";
  descDiv.textContent = description;

  textDiv.appendChild(titleDiv);
  textDiv.appendChild(descDiv);

  newAchievement.appendChild(imageDiv);
  newAchievement.appendChild(textDiv);

  achievementsContainer.appendChild(newAchievement);

  console.log("ADDED");
}

function addComplimentsBoxes() {
  let boxContainer = document.querySelector(
    ".main_content .right .other .inputs"
  );
  let inputs = [];

  for (let i = 0; i < 3; i++) {
    let newBox = document.createElement("input");
    newBox.className = "input_box";
    newBox.type = "text";
    newBox.placeholder = "Compliment ";
    boxContainer.appendChild(newBox);
    inputs.push(newBox);
  }

  function checkCompletion() {
    let allFilled = true;
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].value.trim() === "") {
        allFilled = false;
        break;
      }
    }

    if (allFilled) {
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].removeEventListener("input", checkCompletion);
      }

      setTimeout(function () {
        for (let i = 0; i < inputs.length; i++) {
          inputs[i].classList.add("fade-out");
        }

        setTimeout(function () {
          for (let i = 0; i < inputs.length; i++) {
            inputs[i].style.display = "none";
          }

          let successMsg = document.createElement("div");
          successMsg.className = "success-message fade-in";
          successMsg.innerHTML = "<h2>Good job!</h2>";
          boxContainer.appendChild(successMsg);
        }, 1000);
      }, 500);
    }
  }

  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("input", checkCompletion);
  }
}

// Wait for DOM to be fully loaded before calling functions
document.addEventListener("DOMContentLoaded", function () {
  addAchievement("Early bird", "Message someone before 6:00");

  let currentTime = new Date();
  let clock = currentTime.getHours();

  if (clock > 19) {
    addComplimentsBoxes();
  }
});
