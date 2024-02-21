import * as cola from "webcola";
import * as d3 from "d3";

export const updateEdgeRouting = function (digraph) {
  document.getElementById("edge-routing-container").innerHTML = "";
  var width = window.innerWidth,
    height = window.innerHeight;

  var d3cola = cola.d3adaptor(d3).convergenceThreshold(0.1);

  var outer = d3
    .select("#edge-routing-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("pointer-events", "all");

  const zoom = d3
    .zoom()
    .extent([
      [0, 0],
      [width, height],
    ])
    .scaleExtent([0, 5])
    .on("zoom", function zoomed(e) {
      d3.select("#edge-zoom-layer").attr("transform", e.transform);
    });

  outer
    .append("rect")
    .attr("class", "edge-routing-background")
    .attr("width", "100%")
    .attr("height", "100%")
    .call(zoom);

  var vis = outer
    .append("g")
    .attr("id", "edge-zoom-layer")
    .attr("transform", "translate(250,250) scale(0.3)");

  outer
    .append("svg:defs")
    .append("svg:marker")
    .attr("id", "end-arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 8)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5L2,0")
    .attr("stroke-width", "0px")
    .attr("fill", "#000");

  var lineFunction = d3
    .line()
    .x(function (d) {
      return d.x;
    })
    .y(function (d) {
      return d.y;
    });

  var routeEdges = function () {
    d3cola.prepareEdgeRouting();
    link.attr("d", function (d) {
      return lineFunction(d3cola.routeEdge(d));
    });
  };

  var nodes = digraph.nodes.map((n, i) => {
    return {
      id: i,
      name: n.name,
      value: {
        label: n.name,
      },
    };
  });

  var edges = digraph.edges.map((e) => {
    return {
      source: nodes.find((node) => node.name === e.from).id,
      target: nodes.find((node) => node.name === e.to).id,
    };
  });

  d3cola
    .avoidOverlaps(true)
    .convergenceThreshold(1e-3)
    .flowLayout("x", 150)
    .size([width, height])
    .nodes(nodes)
    .links(edges)
    .jaccardLinkLengths(150);

  var link = vis
    .selectAll(".edge-routing-link")
    .data(edges)
    .enter()
    .append("path")
    .attr("class", "edge-routing-link");

  var margin = 10,
    pad = 12;
  var node = vis
    .selectAll(".edge-routing-node")
    .data(nodes)
    .enter()
    .append("rect")
    .classed("edge-routing-node", true)
    .attr("rx", 5)
    .attr("ry", 5)
    .call(d3cola.drag);

  var label = vis
    .selectAll(".edge-routing-label")
    .data(nodes)
    .enter()
    .append("text")
    .attr("class", "edge-routing-label")
    .text(function (d) {
      return d.name;
    })
    .call(d3cola.drag)
    .each(function (d) {
      var b = this.getBBox();
      var extra = 2 * margin + 2 * pad;
      d.width = b.width + extra;
      d.height = b.height + extra;
    });

  d3cola
    .start(50, 100, 200)
    .on("tick", function () {
      vis.selectAll(".edge-routing-label").each(function (d) {
        var b = this.getBBox();
        var extra = 2 * margin + 2 * pad;
        d.width = b.width + extra;
        d.height = b.height + extra;
      });
      node
        .each(function (d) {
          d.innerBounds = d.bounds.inflate(-margin);
        })
        .attr("x", function (d) {
          return d.innerBounds.x;
        })
        .attr("y", function (d) {
          return d.innerBounds.y;
        })
        .attr("width", function (d) {
          return d.innerBounds.width();
        })
        .attr("height", function (d) {
          return d.innerBounds.height();
        });

      link.attr("d", function (d) {
        var route = cola.makeEdgeBetween(
          d.source.innerBounds,
          d.target.innerBounds,
          5
        );
        return lineFunction([route.sourceIntersection, route.arrowStart]);
      });
      label
        .attr("x", function (d) {
          return d.x;
        })
        .attr("y", function (d) {
          return d.y + (margin + pad) / 2;
        });
    })
    .on("end", routeEdges);
};
