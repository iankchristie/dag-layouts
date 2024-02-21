import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";
import { Layout3D } from "webcola";

var addConstraints = false;
var layout = null;
var graphCache = null;
var nodes = [];
var labels = [];
var edges = [];
var graphObject = null;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
const container = document.getElementById("3d-container");
container.appendChild(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.top = "0px";
labelRenderer.domElement.style.pointerEvents = "none";
container.appendChild(labelRenderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const geometry = new THREE.SphereGeometry(1, 12, 12);
const material = new THREE.MeshStandardMaterial({ color: 0xffffff });

var ambient = new THREE.AmbientLight(0xffffff);
scene.add(ambient);

var directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(5, 5, 10);
scene.add(directionalLight);

var directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(-5, -5, -10);
scene.add(directionalLight);

camera.position.z = 5;

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

var delta = Number.POSITIVE_INFINITY;
var converged = false;
function animate() {
  if (layout) {
    var s = converged ? 0 : layout.tick();
    if (s != 0 && Math.abs(Math.abs(delta / s) - 1) > 1e-7) {
      delta = s;
      updateNodePositions(layout.result);
      updateEdgePositions();
    } else {
      converged = true;
    }
  }

  requestAnimationFrame(animate);

  controls.update();
  render();
}

function render() {
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

animate();

function getLabel(mesh, text) {
  const center = getCenterPoint(mesh);
  var div = document.createElement("div");
  div.textContent = text;
  var label = new CSS2DObject(div);
  label.position.set(center.x, center.y, center.z);
  return label;
}

function getCenterPoint(mesh) {
  var geometry = mesh.geometry;
  geometry.computeBoundingBox();
  var center = new THREE.Vector3();
  geometry.boundingBox.getCenter(center);
  mesh.localToWorld(center);
  return center;
}

function updateNodePositions(coords) {
  var x = coords[0],
    y = coords[1],
    z = coords[2];
  for (var i = 0; i < nodes.length; ++i) {
    nodes[i].position.set(x[i], y[i], z[i]);
    labels[i].position.set(x[i], y[i], z[i]);
  }
}

function updateEdgePositions() {
  graphCache.links.forEach((e, i) => {
    const edge = edges[i];
    const parent = nodes[e.source];
    const child = nodes[e.target];
    edge.position.copy(parent.position);
    edge.scale.z = parent.position.distanceTo(child.position);
    edge.lookAt(child.position);
  });
}

function makeCylinder() {
  let g = new THREE.CylinderGeometry(1, 1, 1)
    .translate(0, 0.5, 0)
    .rotateX(Math.PI * 0.5);
  let m = new THREE.MeshLambertMaterial({ color: 0xface8d });
  let o = new THREE.Mesh(g, m);
  o.scale.set(0.1, 0.1, 1);
  return o;
}

export const update3D = function (graph) {
  if (graphObject) {
    graphObject.children.forEach((c) => {
      if (c.isCSS2DObject) {
        graphObject.remove(c);
      }
    });
    for (var i = graphObject.children.length - 1; i >= 0; i--) {
      var c = graphObject.children[i];
      if (c.isCSS2DObject) {
        graphObject.remove(c);
      }
    }

    scene.remove(graphObject);
  }

  graph.nodes = graph.nodes.map((n, i) => {
    return {
      id: i,
      name: n.name,
      value: {
        label: n.name,
      },
    };
  });

  graph.links = graph.edges.map((e) => {
    return {
      source: graph.nodes.find((node) => node.name === e.from).id,
      target: graph.nodes.find((node) => node.name === e.to).id,
      value: 1,
    };
  });

  const constraints = graph.links.map((e) => {
    return { axis: "y", left: e.target, right: e.source, gap: 20 };
  });

  graphCache = graph;

  graphObject = new THREE.Object3D();

  layout = new Layout3D(graph.nodes, graph.links, 4);
  if (addConstraints) {
    layout.constraints = constraints;
  }
  layout.start(10);

  nodes = graph.nodes.map((n) => {
    return new THREE.Mesh(geometry, material);
  });

  labels = nodes.map((node, i) => {
    return getLabel(node, graph.nodes[i].name);
  });

  edges = graph.links.map((e) => {
    return makeCylinder();
  });

  nodes.forEach((node) => {
    graphObject.add(node);
  });

  labels.forEach((label) => {
    graphObject.add(label);
  });

  edges.forEach((edge) => {
    graphObject.add(edge);
  });

  scene.add(graphObject);
};
