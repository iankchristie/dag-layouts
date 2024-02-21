import { convertGraphToData } from "./GraphUtilitiesV2";

export const constructTangleLayout = (
  graph,
  {
    nodeWidth = 70,
    nodeHeight = 22,
    padding = 8,
    bundleWidth = 14,
    levelYPadding = 0,
    metroD = 4,
    minFamilyHeight = 10,
    c = 16,
    // bigc = nodeWidth + c,
  } = {}
) => {
  const levels = convertGraphToData(graph);
  // precompute level depth
  levels.forEach((l, i) => l.forEach((n) => (n.level = i)));

  const nodes = levels.reduce((a, x) => a.concat(x), []);
  const nodesIndex = {};
  for (const node of nodes) nodesIndex[node.id] = node;

  // objectification
  for (const node of nodes)
    node.parents = (node.parents === undefined ? [] : node.parents).map(
      (p) => nodesIndex[p]
    );

  // precompute bundles
  for (const [i, level] of levels.entries()) {
    const index = {};
    level.forEach((n) => {
      if (n.parents.length === 0) {
        return;
      }
      const id = n.parents
        .map((d) => d.id)
        .sort()
        .join("-X-");
      if (id in index) {
        index[id].parents = index[id].parents.concat(n.parents);
      } else {
        index[id] = {
          id: id,
          parents: n.parents.slice(),
          level: i,
          span: i - Math.min(...n.parents.map((p) => p.level)),
        };
      }
      n.bundle = index[id];
    });
    level.bundles = Object.keys(index).map((key) => index[key]);

    for (const [i, bundle] of level.bundles.entries()) bundle.i = i;
  }

  const links = [];
  for (const node of nodes) {
    for (const parent of node.parents) {
      links.push({
        source: node,
        bundle: node.bundle,
        target: parent,
      });
    }
  }

  const bundles = levels.reduce((a, x) => a.concat(x.bundles), []);

  // reverse pointer from parent to bundles
  for (const bundle of bundles) {
    for (const parent of bundle.parents) {
      if (parent.bundlesIndex === undefined) {
        parent.bundlesIndex = {};
      }
      if (!(bundle.id in parent.bundlesIndex)) {
        parent.bundlesIndex[bundle.id] = [];
      }
      parent.bundlesIndex[bundle.id].push(bundle);
    }
  }

  for (const node of nodes) {
    if (node.bundlesIndex !== undefined) {
      node.bundles = Object.keys(node.bundlesIndex).map(
        (key) => node.bundlesIndex[key]
      );
    } else {
      node.bundlesIndex = {};
      node.bundles = [];
    }
    node.bundles.sort(
      (a, b) =>
        Math.max(...b.map((d) => d.span)) - Math.max(...a.map((d) => d.span))
    );
    for (const [i, bundle] of node.bundles.entries()) bundle.i = i;
  }

  for (const link of links) {
    if (link.bundle.links === undefined) {
      link.bundle.links = [];
    }
    link.bundle.links.push(link);
  }

  // layout
  for (const node of nodes)
    node.height = (Math.max(1, node.bundles.length) - 1) * metroD;

  let xOffset = padding;
  let yOffset = padding;
  for (const level of levels) {
    xOffset += level.bundles.length * bundleWidth;
    yOffset += levelYPadding;
    for (const node of level) {
      node.x = node.level * nodeWidth + xOffset;
      node.y = nodeHeight + yOffset + node.height / 2;
      yOffset += nodeHeight + node.height;
    }
  }

  let totalLength = 0;
  for (const level of levels) {
    level.bundles.forEach((bundle) => {
      bundle.x =
        Math.max(...bundle.parents.map((d) => d.x)) +
        nodeWidth +
        (level.bundles.length - 1 - bundle.i) * bundleWidth;
      bundle.y = totalLength * nodeHeight;
    });
    totalLength += level.length;
  }

  for (const link of links) {
    link.xt = link.target.x;
    link.yt =
      link.target.y +
      link.target.bundlesIndex[link.bundle.id].i * metroD -
      (link.target.bundles.length * metroD) / 2 +
      metroD / 2;
    link.xb = link.bundle.x;
    link.yb = link.bundle.y;
    link.xs = link.source.x;
    link.ys = link.source.y;
  }

  // compress vertical space
  let yNegativeOffset = 0;
  for (const level of levels) {
    yNegativeOffset +=
      -minFamilyHeight +
        Math.min(
          level.bundles.map((bundle) =>
            Math.min(
              ...bundle.links.map((link) => link.ys - 2 * c - (link.yt + c))
            )
          )
        ) || 0;
    for (const node of level) node.y -= yNegativeOffset;
  }

  for (const link of links) {
    link.yt =
      link.target.y +
      link.target.bundlesIndex[link.bundle.id].i * metroD -
      (link.target.bundles.length * metroD) / 2 +
      metroD / 2;
    link.ys = link.source.y;
    link.c1 =
      link.source.level - link.target.level > 1
        ? c //Math.max(Math.min(bigc, link.xb - link.xt, link.yb - link.yt) - c don't know why this was here, was making weird aliases
        : c;
    link.c2 = c;
  }

  const layout = {
    width: Math.max(...nodes.map((node) => node.x)) + nodeWidth + 2 * padding,
    height:
      Math.max(...nodes.map((node) => node.y)) + nodeHeight / 2 + 2 * padding,
    nodeHeight,
    nodeWidth,
    bundleWidth,
    levelYPadding,
    metroD,
  };

  return {
    levels,
    nodes,
    nodesIndex,
    links,
    bundles,
    layout,
  };
};
