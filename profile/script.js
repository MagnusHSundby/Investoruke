// Theme helpers moved to root `site-theme.js` - include that file in page head.
// This file will use the global functions defined there: getSiteTheme(), isDarkMode(), toggleSiteTheme(), etc.
// Example usage (you can copy this to other scripts):
// if (isDarkMode()) {
//   // react to dark theme — e.g., add a class or set a data attribute
//   document.documentElement.dataset.theme = 'dark';
// } else {
//   document.documentElement.removeAttribute('data-theme');
// }
// Example toggle from a button: document.querySelector('#themeToggle')?.addEventListener('click', toggleSiteTheme);


function addAchievement(
  title = "New Achievement",
  description = "Achievement unlocked!",
  imageSrc = "Profilbilder/image copy.png"
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
  // Hook up theme button (if present)
  function updateToggleBtn() {
    const btn = document.querySelector('#themeToggle');
    if (!btn || typeof window.isDarkMode !== 'function') return;
    btn.textContent = window.isDarkMode() ? '🌙' : '☀️';
  }
  const btn = document.querySelector('#themeToggle');
  if (btn) {
    btn.addEventListener('click', () => {
      if (window.toggleSiteTheme) window.toggleSiteTheme();
      updateToggleBtn();
      const href = document.getElementById('site-style-link') ? document.getElementById('site-style-link').getAttribute('href') : null;
      console.log('[profile] toggled theme ->', window.getSiteTheme && window.getSiteTheme(), 'link href:', href);
    });
    // update on theme changes too (siteThemeChanged dispatched by site-theme.js)
    window.addEventListener('siteThemeChanged', updateToggleBtn);
    updateToggleBtn();
  }
  addAchievement("Early bird", "Message someone before 6:00");

  let currentTime = new Date();
  let clock = currentTime.getHours();

  if (clock > 19) {
    addComplimentsBoxes();
  }
});