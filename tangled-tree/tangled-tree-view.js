import { constructTangleLayout } from "./tangled-tree";
import * as d3 from "d3";

export const updateTangledTreeView = function (graph) {
  const svg = d3
    .select("#chart")
    .attr("height", window.innerHeight)
    .attr("width", window.innerWidth);

  let tangleLayout = constructTangleLayout(graph);
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
};
