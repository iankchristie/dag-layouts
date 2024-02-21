import { graph } from "../data";
import { constructTangleLayout } from "./tangled-tree";
import * as d3 from "d3";

let tangleLayout = constructTangleLayout(graph);

const svg = d3
  .select("#chart")
  .attr("height", window.innerHeight)
  .attr("width", window.innerWidth);

let links = tangleLayout.bundles.flatMap((b) => b.links);
svg
  .select("#link-container")
  .selectAll(".link")
  .data(links, function (l) {
    const lId = l.target.id + "-x-" + l.source.id;
    return `link:${lId}`;
  })
  .join(
    (enter) => {
      enter
        .append("path")
        .attr("id", (l) => {
          const lId = l.target.id + "-x-" + l.source.id;
          return `link:${lId}`;
        })
        .attr("data-id", (l) => {
          const lId = l.target.id + "-x-" + l.source.id;
          return lId;
        })
        .attr("data-parent-id", (l) => {
          return l.target.id;
        })
        .attr("data-child-id", (l) => {
          return l.source.id;
        })
        .attr("data-data", (l) => {
          return JSON.stringify({ from: l.target.id, to: l.source.id });
        })
        .attr("class", "link")
        .attr("stroke", "green")
        .attr("stroke-width", 2)
        .attr("d", (l) => {
          return `M${l.xt} ${l.yt}
        L${l.xb - l.c1} ${l.yt}
        A${l.c1} ${l.c1} 90 0 1 ${l.xb} ${l.yt + l.c1}
        L${l.xb} ${l.ys - l.c2}
        A${l.c2} ${l.c2} 90 0 0 ${l.xb + l.c2} ${l.ys}
        L${l.xs} ${l.ys}`;
        });
    },
    (update) => {
      update.attr("d", (l) => {
        return `M${l.xt} ${l.yt}
      L${l.xb - l.c1} ${l.yt}
      A${l.c1} ${l.c1} 90 0 1 ${l.xb} ${l.yt + l.c1}
      L${l.xb} ${l.ys - l.c2}
      A${l.c2} ${l.c2} 90 0 0 ${l.xb + l.c2} ${l.ys}
      L${l.xs} ${l.ys}`;
      });
    }
  );

svg
  .select("#node-container")
  .selectAll(".outer-node")
  .data(tangleLayout.nodes, function (n) {
    return `outernode:${n.id}`;
  })
  .join(
    (enter) => {
      enter
        .append("path")
        .attr("id", (n) => {
          return `outernode:${n.id}`;
        })
        .attr("data-id", (n) => {
          return n.id;
        })
        .attr("class", "outer-node selectable node")
        .attr("stroke", "black")
        .attr("stroke-width", 10)
        .attr("d", (node) => {
          return `
          M ${node.x} ${node.y - node.height / 2}
          L ${node.x} ${node.y + node.height / 2}
      `;
        });
    },
    (update) => {
      update.attr("d", (node) => {
        return `
        M ${node.x} ${node.y - node.height / 2}
        L ${node.x} ${node.y + node.height / 2}
    `;
      });
    }
  );

let initialDragEvent = null;
let draggedNode = null;
let dragLine = svg.select("#drag-line");

function distance(x1, y1, x2, y2) {
  var x = x2 - x1;
  var y = y2 - y1;

  return Math.sqrt(x * x + y * y);
}

function getPathXYCoordinates(element) {
  return { x: element.dataset.centerX, y: element.dataset.centerY };
}

function getClosestNode(x, y) {
  var allNodes = document.getElementsByClassName("draggable");
  var closest = null;
  var currentClosestDistance = 1000000000;
  for (let i = 0; i < allNodes.length; i++) {
    var xy = getPathXYCoordinates(allNodes[i]);
    var dist = distance(x, y, xy["x"], xy["y"]);
    if (dist < currentClosestDistance) {
      closest = allNodes[i];
      currentClosestDistance = dist;
    }
  }
  return closest;
}

// let dragListener = d3
//   .drag()
//   .on("start", function (d) {
//     console.log("dragStart " + d);
//     d3.select(this).classed("selected", true);
//     d3.selectAll(".link").classed("inactive", true);
//     let ancestors = getAncestors(
//       props.graph,
//       d.sourceEvent.srcElement.dataset.id
//     );
//     for (const ancestor of ancestors) {
//       document
//         .getElementById(`innernode:${ancestor}`)
//         .classList.add("inactive");
//       document
//         .getElementById(`outernode:${ancestor}`)
//         .classList.add("inactive");
//     }
//     initialDragEvent = d;
//   })
//   .on("drag", function (d) {
//     if (!initialDragEvent) {
//       return;
//     }
//     console.log("dragging " + d);
//     let closestNode = getClosestNode(d.x, d.y);
//     var xyNode = getPathXYCoordinates(closestNode);
//     let dist = distance(d.x, d.y, xyNode["x"], xyNode["y"]);

//     if (
//       initialDragEvent.sourceEvent.srcElement.dataset.id !==
//         closestNode.dataset.id &&
//       !closestNode.classList.contains("inactive") &&
//       dist < 10
//     ) {
//       draggedNode = closestNode;
//       dragLine.attr(
//         "d",
//         `M ${initialDragEvent.x} ${initialDragEvent.y} L ${xyNode["x"]} ${xyNode["y"]}`
//       );
//     } else {
//       draggedNode = null;
//       dragLine.attr(
//         "d",
//         `M ${initialDragEvent.x} ${initialDragEvent.y} L ${d.x} ${d.y}`
//       );
//     }
//   })
//   .on("end", function (d) {
//     console.log("end " + d);
//     if (initialDragEvent && draggedNode) {
//       props.addEdge(
//         initialDragEvent.sourceEvent.srcElement.dataset.id,
//         draggedNode.dataset.id
//       );
//     }
//     d3.select(this).classed("selected", false);
//     d3.selectAll(".link").classed("inactive", false);
//     d3.selectAll(".node").classed("inactive", false);
//     dragLine.attr("d", "M 0 0 L 0 0");
//   });

svg
  .select("#node-container")
  .selectAll(".inner-node")
  .data(tangleLayout.nodes, function (n) {
    return `innernode:${n.id}`;
  })
  .join(
    (enter) => {
      enter
        .append("path")
        .attr("id", (n) => {
          return `innernode:${n.id}`;
        })
        .attr("data-id", (n) => {
          return n.id;
        })
        .attr("data-center-x", (n) => {
          return n.x;
        })
        .attr("data-center-y", (n) => {
          return n.y;
        })
        .attr("class", "inner-node node draggable")
        .attr("stroke", "white")
        .attr("stroke-width", 6)
        .attr("d", (node) => {
          return `M ${node.x} ${node.y - node.height / 2} L ${node.x} ${
            node.y + node.height / 2
          }`;
        });
      // .call(dragListener);
    },
    (update) => {
      update
        .attr("data-center-x", (n) => {
          return n.x;
        })
        .attr("data-center-y", (n) => {
          return n.y;
        })
        .attr("d", (node) => {
          return `M ${node.x} ${node.y - node.height / 2} L ${node.x} ${
            node.y + node.height / 2
          }`;
        });
    }
  );

svg
  .select("#node-container")
  .selectAll("text")
  .data(tangleLayout.nodes, function (n) {
    return `text:${n.id}`;
  })
  .join(
    (enter) => {
      enter
        .append("text")
        .attr("id", (n) => {
          return `text:${n.id}`;
        })
        .attr("data-id", (n) => {
          return n.id;
        })
        .attr("x", (node) => {
          return node.x + 4;
        })
        .attr("y", (node) => {
          return node.y - node.height / 2 - 4;
        })
        .text((node) => {
          return node.id;
        });
    },
    (update) => {
      update
        .attr("x", (node) => {
          return node.x + 4;
        })
        .attr("y", (node) => {
          return node.y - node.height / 2 - 4;
        });
    }
  );

const zoom = d3
  .zoom()
  .extent([
    [0, 0],
    [tangleLayout.layout.width, tangleLayout.layout.height],
  ])
  .scaleExtent([0.5, 5])
  .on("zoom", function zoomed(e) {
    d3.select("#zoom-container").attr("transform", e.transform);
  });

svg.call(zoom);

// function inactivateAll() {
//   inactivateLinks();
//   inactivateNodes();
// }

// function inactivateLinks() {
//   let linksElements = document.getElementsByClassName("link");
//   for (let i = 0; i < linksElements.length; i++) {
//     linksElements[i].classList.add("inactive");
//   }
// }

// function inactivateNodes() {
//   let allNodes = document.getElementsByClassName("node");
//   for (let i = 0; i < allNodes.length; i++) {
//     allNodes[i].classList.add("inactive");
//   }
// }

// function activateLink(edge) {
//   let fromNodeId = edge.from;
//   activateNode(fromNodeId);
//   let toNodeId = edge.to;
//   activateNode(toNodeId);
//   let link = document.getElementById("link:" + fromNodeId + "-x-" + toNodeId);
//   link.classList.remove("inactive");
// }

// function activateNode(nodeId) {
//   let outerNode = document.getElementById("outernode:" + nodeId);
//   outerNode.classList.remove("inactive");
//   let innerNode = document.getElementById("innernode:" + nodeId);
//   innerNode.classList.remove("inactive");
// }

// let allInactive = document.querySelectorAll(".inactive");
// for (const inactiveElement of allInactive) {
//   inactiveElement.classList.remove("inactive");
// }
// let selectedEdges = document.getElementsByClassName("selected-edge");
// for (const edge of selectedEdges) {
//   edge.classList.remove("selected-edge");
// }
// let selectedNodes = document.getElementsByClassName("selected-node");
// for (const node of selectedNodes) {
//   node.classList.remove("selected-node");
// }

// if (props.element.type === "node") {
//   let textNode = document.getElementById("text:" + props.element.id);
//   textNode.classList.add("selected-node");

//   inactivateAll();

//   let ancestorLinks = getAncestorLinks(props.graph, props.element.id);
//   let descendantLinks = getDescendantLinks(props.graph, props.element.id);

//   for (const link of ancestorLinks) {
//     activateLink(link);
//   }
//   for (const link of descendantLinks) {
//     activateLink(link);
//   }
// }

// if (props.element.type === "edge") {
//   let link = document.getElementById(
//     "link:" + props.element.id.from + "-x-" + props.element.id.to
//   );
//   link.classList.add("selected-edge");

//   let ancestorLinks = getAncestorLinks(props.graph, props.element.id.from);
//   let descendantLinks = getDescendantLinks(props.graph, props.element.id.to);

//   inactivateAll();

//   activateLink({
//     from: props.element.id.from,
//     to: props.element.id.to,
//   });
//   for (const link of ancestorLinks) {
//     activateLink(link);
//   }
//   for (const link of descendantLinks) {
//     activateLink(link);
//   }
// }

// svg.on("click", (e) => {
//   if (e.target.id === "chart") {
//     props.resetSelected();
//   }
// });
