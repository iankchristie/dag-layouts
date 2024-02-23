export const newGraph = () => {
  const nodes = [
    { id: "Life", name: "Life", description: "This is it", done: false },
    { id: "example1", name: "example1", description: "node 1", done: false },
    { id: "example2", name: "example2", description: "node 2", done: false },
  ];

  const edges = [
    { from: "Life", to: "example1" },
    { from: "Life", to: "example2" },
  ];

  return {
    nodes: nodes,
    edges: edges,
  };
};

// Accessors

export const graphContainsNode = (graph, id) => {
  return getNode(graph, id) !== undefined;
};

export const getNode = (graph, id) => {
  return graph.nodes.find((n) => {
    return n.id === id;
  });
};

export const graphContainsEdge = (graph, parentId, childId) => {
  return graph.edges.some((e) => {
    return e.from === parentId && e.to === childId;
  });
};

export const getParents = (graph, nodeId) => {
  return graph.edges
    .filter((e) => {
      return e.to === nodeId;
    })
    .map((e) => {
      return e.from;
    });
};

export const getChildren = (graph, nodeId) => {
  return graph.edges
    .filter((e) => {
      return e.from === nodeId;
    })
    .map((e) => {
      return e.to;
    });
};

export const getAncestors = (graph, nodeId) => {
  // Create a map for parent lookup
  let parentMap = new Map();
  graph.edges.forEach((edge) => {
    if (!parentMap.get(edge.to)) {
      parentMap.set(edge.to, []);
    }
    parentMap.get(edge.to).push(edge.from);
  });

  // Find ancestors
  let ancestors = new Set();
  let queue = [nodeId];
  while (queue.length !== 0) {
    if (parentMap.get(queue[0])) {
      const parents = parentMap.get(queue[0]);
      parents.forEach((item) => ancestors.add(item));
      queue.push(...parents);
    }
    queue.shift();
  }

  return ancestors;
};

export const getAncestorLinks = (graph, nodeId) => {
  // Create a map for parent lookup
  let parentMap = new Map();
  graph.edges.forEach((edge) => {
    if (!parentMap.get(edge.to)) {
      parentMap.set(edge.to, []);
    }
    parentMap.get(edge.to).push(edge);
  });

  // Find ancestors
  let ancestors = new Set();
  let queue = [nodeId];
  while (queue.length !== 0) {
    if (parentMap.get(queue[0])) {
      const parents = parentMap.get(queue[0]);
      parents.forEach((item) => {
        ancestors.add(item);
        queue.push(item.from);
      });
    }
    queue.shift();
  }

  return ancestors;
};

export const getDescendantLinks = (graph, nodeId) => {
  // Create a map for parent lookup
  let descendantMap = new Map();
  graph.edges.forEach((edge) => {
    if (!descendantMap.get(edge.from)) {
      descendantMap.set(edge.from, []);
    }
    descendantMap.get(edge.from).push(edge);
  });

  // Find ancestors
  let descendants = new Set();
  let queue = [nodeId];
  while (queue.length !== 0) {
    if (descendantMap.get(queue[0])) {
      descendantMap.get(queue[0]).forEach((item) => {
        descendants.add(item);
        queue.push(item.to);
      });
    }
    queue.shift();
  }

  return descendants;
};

// Mutators

export const addEdge = (graph, parent, child) => {
  const existingEdge = graph.edges.find((e) => {
    return e.from === parent && e.to === child;
  });
  if (existingEdge) {
    return graph;
  }

  if (!graphContainsNode(graph, child)) {
    graph.nodes.push({ id: child, name: child, done: false });
  }
  graph.edges.push({ from: parent, to: child });
  return JSON.parse(JSON.stringify(graph));
};

export const deleteNodeGraph = (graph, id) => {
  let parents = getParents(graph, id);
  let children = getChildren(graph, id);

  for (const parent of parents) {
    for (const child of children) {
      addEdge(graph, parent, child);
    }
  }

  graph.edges = graph.edges.filter((e) => {
    return !(e.from === id || e.to === id);
  });
  graph.nodes = graph.nodes.filter((n) => {
    return n.id !== id;
  });

  return JSON.parse(JSON.stringify(graph));
};

export const deleteEdgeGraph = (graph, edge) => {
  let tosParents = getParents(graph, edge.to);

  if (tosParents.length === 1) {
    let fromsParents = getParents(graph, edge.from);

    for (const parent of fromsParents) {
      addEdge(graph, parent, edge.to);
    }
  }

  graph.edges = graph.edges.filter((e) => {
    return !(e.from === edge.from && e.to === edge.to);
  });
  return JSON.parse(JSON.stringify(graph));
};
