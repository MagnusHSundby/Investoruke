const tabs = document.querySelectorAll(".tab");
const indicator = document.querySelector(".indicator");
let notchRule;

// find ::before CSS rule
for (const rule of document.styleSheets[0].cssRules) {
  if (rule.selectorText === ".nav::before") {
    notchRule = rule;
    break;
  }
}

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelector(".tab.active").classList.remove("active");
    tab.classList.add("active");

    // Get center position of clicked tab
    const rect = tab.getBoundingClientRect();
    const navRect = document.querySelector(".nav").getBoundingClientRect();
    const centerX = rect.left - navRect.left + rect.width / 2;

    // Move indicator so its center matches the tab center
    indicator.style.transform = `translateX(${centerX - indicator.offsetWidth / 2}px)`;
    notchRule.style.transform = `translateX(${centerX - 45}px)`; // 45 = notch half width
  });
});
