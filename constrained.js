import * as d3 from "d3";
import * as cola from "webcola";
import { graph } from "./data";

export const updateConstrained = function (graph) {
  document.getElementById("force-layout-downward-container").innerHTML = "";

  var width =
      document.getElementById("containers").offsetWidth || window.innerWidth,
    height =
      document.getElementById("containers").offsetHeight || window.innerHeight;
  var margin = 6;

  var color = d3.scaleOrdinal(d3.schemeCategory10);

  var d3cola = cola.d3adaptor(d3).avoidOverlaps(true).size([width, height]);

  var svg = d3
    .select("#force-layout-downward-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const zoom = d3
    .zoom()
    .extent([
      [0, 0],
      [width, height],
    ])
    .scaleExtent([0, 5])
    .on("zoom", function zoomed(e) {
      d3.select("#constrained-zoom-layer").attr("transform", e.transform);
    });

  var vis = svg.append("g").attr("id", "constrained-zoom-layer");
  svg.call(zoom);

  var nodeRadius = 30;

  graph.nodes = graph.nodes.map((n, i) => {
    return {
      id: i,
      name: n.name,
      value: {
        label: n.name,
      },
      height: 2 * nodeRadius,
      width: 2 * nodeRadius,
    };
  });

  graph.links = graph.edges.map((e) => {
    return {
      source: graph.nodes.find((node) => node.name === e.from).id,
      target: graph.nodes.find((node) => node.name === e.to).id,
      value: 1,
    };
  });

  d3cola
    .nodes(graph.nodes)
    .links(graph.links)
    .flowLayout("y", 30)
    .symmetricDiffLinkLengths(12)
    .start(10, 20, 20);

  // define arrow markers for graph links
  vis
    .append("svg:defs")
    .append("svg:marker")
    .attr("id", "end-arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 6)
    .attr("markerWidth", 3)
    .attr("markerHeight", 3)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "#000");

  var path = vis
    .selectAll(".constrained-link")
    .data(graph.links)
    .enter()
    .append("svg:path")
    .attr("class", "constrained-link");

  var node = vis
    .selectAll(".constrained-node")
    .data(graph.nodes)
    .enter()
    .append("circle")
    .attr("class", "constrained-node")
    .attr("r", nodeRadius)
    .style("fill", function (d) {
      return color(d.group);
    })
    .call(d3cola.drag);

  var label = vis
    .selectAll(".label")
    .data(graph.nodes)
    .enter()
    .append("text")
    .attr("class", "label")
    .call(d3cola.drag);

  var insertLinebreaks = function (d) {
    var el = d3.select(this);
    var words = d.name.split(" ");
    el.text("");

    for (var i = 0; i < words.length; i++) {
      var tspan = el.append("tspan").text(words[i]);
      tspan.attr("x", 0).attr("dy", "15").attr("font-size", "12");
    }
  };

  label.each(insertLinebreaks);

  // node.append("text").text(function(d) {
  //   return d.name;
  // });

  d3cola.on("tick", function () {
    // draw directed edges with proper padding from node centers
    path.attr("d", function (d) {
      var deltaX = d.target.x - d.source.x,
        deltaY = d.target.y - d.source.y,
        dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
        normX = deltaX / dist,
        normY = deltaY / dist,
        sourcePadding = nodeRadius,
        targetPadding = nodeRadius + 2,
        sourceX = d.source.x + sourcePadding * normX,
        sourceY = d.source.y + sourcePadding * normY,
        targetX = d.target.x - targetPadding * normX,
        targetY = d.target.y - targetPadding * normY;
      return "M" + sourceX + "," + sourceY + "L" + targetX + "," + targetY;
    });

    node
      .attr("cx", function (d) {
        return d.x;
      })
      .attr("cy", function (d) {
        return d.y;
      });

    label.each(function (d) {
      var b = this.getBBox();
      d.width = b.width + 2 * margin + 8;
      d.height = b.height + 2 * margin + 8;
    });

    label.attr("transform", function (d) {
      return (
        "translate(" +
        (d.x + margin - d.width / 2) +
        "," +
        (d.y + margin - d.height / 2) +
        ")"
      );
    });
  });
};
