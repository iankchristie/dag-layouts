export const convertGraphToData = (graph) => {
  let nodesAndLevels = new Map();
  let childrenByNode = edgesToChildren(graph.edges);
  dfsLevel("Life", childrenByNode, 0, nodesAndLevels);
  let levelsToNodes = convertToLevels(nodesAndLevels);
  return convertLevelsToLists(levelsToNodes, edgesToParents(graph.edges));
};

const edgesToChildren = (edges) => {
  let nodeToDescendants = new Map();
  nodeToDescendants.set("Life", []);

  edges.forEach((edge) => {
    // Initialize the descendant list for the 'from' node if it doesn't exist
    if (!nodeToDescendants.get(edge.from)) {
      nodeToDescendants.set(edge.from, []);
    }

    // Add the 'to' node to the 'from' node's descendant list
    nodeToDescendants.get(edge.from).push(edge.to);

    // Ensure that every 'to' node is also represented in the object, even if it has no descendants
    if (!nodeToDescendants.get(edge.to)) {
      nodeToDescendants.set(edge.to, []);
    }
  });

  return nodeToDescendants;
};

const edgesToParents = (edges) => {
  let nodeToParents = new Map();

  edges.forEach((edge) => {
    // Check if the 'to' node already has a parent(s) list
    if (!nodeToParents.get(edge.to)) {
      nodeToParents.set(edge.to, []);
    }

    // Add the 'from' node to the 'to' node's parent(s) list
    nodeToParents.get(edge.to).push(edge.from);
  });

  return nodeToParents;
};

const dfsLevel = (nodeId, links, level, resultMap) => {
  if (!resultMap.get(nodeId)) {
    resultMap.set(nodeId, 0);
  }
  if (resultMap.get(nodeId) < level) {
    resultMap.set(nodeId, level);
  }
  for (const n of links.get(nodeId)) {
    dfsLevel(n, links, level + 1, resultMap);
  }
};

const convertToLevels = (nodeLevels) => {
  let levelsToNodes = new Map();

  // Iterate through each node and its level
  for (let [node, level] of nodeLevels) {
    // Initialize the array for this level if it doesn't exist
    if (!levelsToNodes.get(level)) {
      levelsToNodes.set(level, []);
    }

    // Add the node to the appropriate level
    levelsToNodes.get(level).push(node);
  }

  return levelsToNodes;
};

const convertLevelsToLists = (levelsObject, parentReferences) => {
  // Create an array of empty arrays for each level
  let levelsArray = [];

  // Populate the array with nodes for each level
  for (let level of levelsObject.keys()) {
    levelsArray[level] = levelsObject.get(level).map((n) => {
      return {
        id: n,
        parents: parentReferences.get(n) || [],
      };
    });
  }

  return levelsArray;
};
