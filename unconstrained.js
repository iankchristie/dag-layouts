import * as d3 from "d3";
import * as cola from "webcola";

export const updateUnconstrained = function (graph) {
  document.getElementById("force-layout-container").innerHTML = "";
  var width =
      document.getElementById("containers").offsetWidth || window.innerWidth,
    height =
      document.getElementById("containers").offsetHeight || window.innerHeight;
  var margin = 6;
  var color = d3.scaleOrdinal(d3.schemeCategory10);

  var d3cola = cola.d3adaptor(d3).size([width, height]);

  var svg = d3
    .select("#force-layout-container")
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
      d3.select("#unconstrained-zoom-layer").attr("transform", e.transform);
    });

  var vis = svg.append("g").attr("id", "unconstrained-zoom-layer");
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
    .symmetricDiffLinkLengths(12)
    .start(30);

  var link = vis
    .selectAll(".unconstrained-link")
    .data(graph.links)
    .enter()
    .append("line")
    .attr("class", "unconstrained-link")
    .style("stroke-width", function (d) {
      return Math.sqrt(d.value);
    });

  var node = vis
    .selectAll(".unconstrained-node")
    .data(graph.nodes)
    .enter()
    .append("circle")
    .attr("class", "unconstrained-node")
    .attr("r", nodeRadius)
    .style("fill", function (d) {
      return color(d.group);
    })
    .on("click", function (d) {
      d.fixed = true;
    })
    .call(d3cola.drag);

  node.append("title").text(function (d) {
    return d.name;
  });

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

  d3cola.on("tick", function () {
    link
      .attr("x1", function (d) {
        return d.source.x;
      })
      .attr("y1", function (d) {
        return d.source.y;
      })
      .attr("x2", function (d) {
        return d.target.x;
      })
      .attr("y2", function (d) {
        return d.target.y;
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
