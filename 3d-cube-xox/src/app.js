import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Board from "./board";
import Light from "./light";
const raycaster = new THREE.Raycaster();

var turn = "X";
var isFinished = false;

const canvas = document.getElementById("webgl");

canvas.style.width = `${window.innerWidth}px`;
canvas.style.height = `${window.innerHeight}px`;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 13;

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
window.addEventListener("resize", () => {
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.updateProjectionMatrix();
  camera.aspect = window.innerWidth / window.innerHeight;
});

const board = new Board();
const lighting = new Light();
lighting.addReactAreaLight("#EE4B2B", 100, 10, 10, 0, 0, 30);
lighting.addDirectionalLight("blue", 100, 10, -10, -30, board.board);
lighting.addDirectionalLight("green", 100, -30, -30, -30);

scene.add(board.board);
scene.add(lighting.container);

board.initBoard();

// conrtorls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();
//

// debugPanel.addItem(board.board, "visible");

function changeState(mesh = null) {
  if (!mesh) {
    console.log("no empty slot selected");
    return;
  }
  board.changePiece(mesh.uuid, turn);
  turn = turn == "X" ? "O" : "X";
}

window.addEventListener("click", () => {
  var pointer = new THREE.Vector2();
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  var intersects = raycaster.intersectObjects(scene.children);
  var hitObject3d = intersects.map((data) => data.object);
  var front = hitObject3d.shift() ?? null;
  changeState(front);
});

function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
