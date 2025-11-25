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

addAchievement("Early bird", "Message someone before 6:00");
