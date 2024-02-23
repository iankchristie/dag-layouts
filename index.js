import typeahead from "typeahead-standalone";
import {
  addEdge,
  deleteEdgeGraph,
  deleteNodeGraph,
  getAncestors,
  getChildren,
  getParents,
} from "./Graph";
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

window.updateSelectedNode = (nodeId) => {
  if (nodeId) {
    selectedNode = nodeId;
  }
  document.getElementById("name").innerText = "Name: " + selectedNode;
  updateParents(selectedNode);
  updateChildren(selectedNode);
  const allNodes = graph.nodes.map((n) => {
    return n.id;
  });
  // for type ahead if i could get it to work
  //   const ancestors = getAncestors(graph, selectedNode);
  //   ancestors.add(selectedNode);
  //   const reachableNodes = allNodes.filter((node) => !ancestors.has(node));
  //   if (typeaheadInstance) {
  //     typeaheadInstance.destroy();
  //   }
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
  var childDiv = document.createElement("div");
  var childName = document.createTextNode(name + "\t");
  li.style.cursor = "pointer";
  childDiv.addEventListener("click", () => {
    window.updateSelectedNode(name);
  });
  childDiv.appendChild(childName);
  li.appendChild(childDiv);
  const button = document.createElement("button");
  button.appendChild(document.createTextNode("-"));
  button.addEventListener("click", () => {
    if (selectedNode === "Life") {
      alert("Can't Delete Edge or else it would create multiple roots");
      return;
    }
    const newGraph = deleteEdgeGraph(graph, { from: selectedNode, to: name });
    setGraph(newGraph);
  });

  li.appendChild(button);
  return li;
};

window.updateSelectedNode("Life");

window.addChild = () => {
  const childName = document.getElementById("new-child").value;
  const newGraph = addEdge(graph, selectedNode, childName);
  setGraph(newGraph);
};

window.deleteNode = () => {
  if (selectedNode === "Life") {
    alert("Can't Delete Root");
    return;
  }
  const newGraph = deleteNodeGraph(graph, selectedNode);
  setGraph(newGraph);
};
