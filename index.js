import { addEdge, getChildren, getParents } from "./Graph";
import { graph, setGraph } from "./data";

window.menuOptionChanged = (value) => {
  hideAll();
  document.getElementById(value + "-container").style.display = "block";
};

const hideAll = function () {
  const container = document.getElementById("containers");
  for (const child of container.children) {
    child.style.display = "none";
  }
};

var selectedNode = null;
window.updateSelectedNode = (nodeId) => {
  if (nodeId) {
    selectedNode = nodeId;
  }
  document.getElementById("name").innerText = "Name: " + selectedNode;
  updateParents(selectedNode);
  updateChildren(selectedNode);
};

const updateParents = function (nodeId) {
  const list = document.getElementById("parents-list");
  list.innerHTML = "";
  const children = getParents(graph, nodeId);
  children.forEach((parent) => {
    list.appendChild(createListElement(parent));
  });
};

const updateChildren = function (nodeId) {
  const list = document.getElementById("children-list");
  list.innerHTML = "";
  const children = getChildren(graph, nodeId);
  children.forEach((child) => {
    list.appendChild(createListElement(child));
  });
};

const createListElement = function (name) {
  var li = document.createElement("li");
  li.style.cursor = "pointer";
  li.addEventListener("click", () => {
    window.updateSelectedNode(name);
  });
  li.appendChild(document.createTextNode(name));
  return li;
};

window.updateSelectedNode("Life");

window.addChild = () => {
  console.log(selectedNode);
  const childName = document.getElementById("new-child").value;
  const newGraph = addEdge(graph, selectedNode, childName);
  setGraph(newGraph);
};
