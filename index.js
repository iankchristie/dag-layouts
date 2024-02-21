const hideAll = function () {
  const container = document.getElementById("containers");
  for (const child of container.children) {
    child.style.display = "none";
  }
};

window.menuOptionChanged = (value) => {
  hideAll();
  document.getElementById(value + "-container").style.display = "block";
};
