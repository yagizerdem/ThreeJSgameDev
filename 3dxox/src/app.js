import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Piece from "./piece";

const canvas = document.getElementById("webgl");

canvas.style.width = `${window.innerWidth}px`;
canvas.style.height = `${window.innerHeight}px`;
canvas.style.backgroundColor = "black";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 10;
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const board = new THREE.Object3D();

var g1 = new THREE.BoxGeometry(0.4, 10, 0.4);
var m1 = new THREE.MeshStandardMaterial();
var r1 = new THREE.Mesh(g1, m1);
r1.position.x = -2;

var g2 = new THREE.BoxGeometry(0.4, 10, 0.4);
var m2 = new THREE.MeshStandardMaterial();
var r2 = new THREE.Mesh(g2, m2);
r2.position.x = 2;

var g3 = new THREE.BoxGeometry(10, 0.4, 0.4);
var m3 = new THREE.MeshStandardMaterial();
var r3 = new THREE.Mesh(g3, m3);
r3.position.y = 2;

var g4 = new THREE.BoxGeometry(10, 0.4, 0.4);
var m4 = new THREE.MeshStandardMaterial();
var r4 = new THREE.Mesh(g4, m4);
r4.position.y = -2;

board.add(r1);
board.add(r2);
board.add(r3);
board.add(r4);

scene.add(board);

var turn = "X";
var isFinished = false;

// movement
const controls = new OrbitControls(camera, renderer.domElement);
controls.maxDistance = 100;
controls.minDistance = 5;
// ligthing
const light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);
const spotLight = new THREE.SpotLight("red", 400, 30, Math.PI / 4, 0.2, 2);
spotLight.position.set(10, 10, 10);
spotLight.target = board;
scene.add(spotLight);
// const spotLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(spotLightHelper);

var matrix = Array.from({ length: 3 }, () => {
  return [null, null, null];
});

for (var i = 0; i < 3; i++) {
  for (var j = 0; j < 3; j++) {
    var piece = new Piece(Piece.typeEmpty);
    piece.createMesh();
    piece.mesh.position.y = (i + (i - 1) * 3 - 1) * -1;
    piece.mesh.position.x = j + (j - 1) * 3 - 1;
    matrix[i][j] = piece;
    board.add(piece.mesh);
  }
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let intersects = [];

function animate() {
  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(animate);
}
animate();

window.addEventListener("resize", () => {
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  canvas.style.backgroundColor = "black";
  camera.aspect = window.innerWidth / window.innerHeight;
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.updateProjectionMatrix();
});

window.addEventListener("click", (event) => {
  if (isFinished) {
    return;
  }
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  var item = raycasting();

  // find in matrix
  outer: for (var i in matrix) {
    var row = matrix[i];
    for (var j in row) {
      var item_ = row[j];
      if (item_?.type === Piece.typeEmpty) {
        if (item.object.uuid === item_.mesh?.uuid) {
          matrix[i][j] = null;
          var py = item_.mesh.position.y;
          var px = item_.mesh.position.x;
          item_.mesh.geometry.dispose();
          item_.mesh.material.dispose();
          board.remove(item_.mesh);
          var newPiece = new Piece(turn == "X" ? Piece.typeX : Piece.typeO);
          newPiece.createMesh();
          matrix[i][j] = newPiece;
          newPiece.mesh.position.y = py;
          newPiece.mesh.position.x = px;
          board.add(newPiece.mesh);

          isFinished = checkGameEnd(matrix);
          if (isFinished) {
            alert(`winner ${turn}`);
          }

          turn = turn == "X" ? "O" : "X";

          break outer;
        }
      }
    }
  }
});

function raycasting() {
  raycaster.setFromCamera(pointer, camera);
  intersects = raycaster.intersectObjects(scene.children); // objs - objects to raycast
  if (intersects.length > 0) {
    // hit
    return intersects.shift();
  } else {
    return null;
  }
}

function checkGameEnd(matrix) {
  var flag = false;

  outer: for (var i = 0; i < matrix.length; i++) {
    if (
      matrix[i][0].type == matrix[i][1].type &&
      matrix[i][1].type == matrix[i][2].type
    ) {
      if (matrix[i][0].type == Piece.typeEmpty) continue;
      flag = true;
      break outer;
    }
    if (
      matrix[0][i].type == matrix[1][i].type &&
      matrix[1][i].type == matrix[2][i].type
    ) {
      if (matrix[0][i].type == Piece.typeEmpty) continue;
      flag = true;
      break outer;
    }
  }
  if (
    matrix[0][0].type == matrix[1][1].type &&
    matrix[1][1].type == matrix[2][2].type
  ) {
    if (matrix[0][0].type != Piece.typeEmpty) {
      flag = true;
    }
  }
  if (
    matrix[0][2].type == matrix[1][1].type &&
    matrix[1][1].type == matrix[2][0].type
  ) {
    if (matrix[1][1].type != Piece.typeEmpty) {
      flag = true;
    }
  }
  return flag;
}
