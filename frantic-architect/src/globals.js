import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es";

const canvas = document.getElementById("webgl");
canvas.style.background = "black";
canvas.style.width = `${window.innerWidth}px`;
canvas.style.height = `${window.innerHeight}px`;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;
camera.position.y = 4;

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -10, 0),
});

export { renderer, canvas, camera, scene, controls, world };
