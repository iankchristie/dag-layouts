import { updateZherebko } from "/zherebko.js";
import { updateConstrained } from "/constrained.js";
import { graph } from "/data.js";
import { updateEdgeRouting } from "/edge-routing.js";
import { updateSugiyama } from "/sugiyama.js";
import { updateTangledTreeView } from "/tangled-tree/tangled-tree-view.js";
import { updateUnconstrained } from "/unconstrained.js";
import { updateGrid } from "/grid.js";
import { update3D } from "/3d.js";

export function UpdateState() {
  window.updateSelectedNode();
  updateTangledTreeView(clone(graph));
  updateEdgeRouting(clone(graph));
  updateUnconstrained(clone(graph));
  updateConstrained(clone(graph));
  updateSugiyama(clone(graph));
  updateZherebko(clone(graph));
  updateGrid(clone(graph));
  update3D(clone(graph));
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

window.onload = UpdateState;
