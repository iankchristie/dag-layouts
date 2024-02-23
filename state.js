import { updateZherebko } from "zherebko";
import { updateConstrained } from "constrained";
import { graph } from "data";
import { updateEdgeRouting } from "edge-routing";
import { updateSugiyama } from "sugiyama";
import { updateTangledTreeView } from "tangled-tree/tangled-tree-view";
import { updateUnconstrained } from "unconstrained";
import { updateGrid } from "grid";
import { update3D } from "3d";

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
