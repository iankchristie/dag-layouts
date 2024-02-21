export interface Node {
  id: String;
  name: string;
  done?: boolean;
}
export interface Edge {
  from: string;
  to: string;
}

export interface Graph {
  nodes: Array<Node>;
  edges: Array<Edge>;
}
