import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import TextureContoller from "./textureLoader";
import SD from "./SD";
import Orbit from "./orbit";

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
camera.position.z = 40;

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(1);
scene.add(axesHelper);

window.addEventListener("resize", () => {
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.updateProjectionMatrix();
});

const textureController = TextureContoller.getTextureController();
(async () => {
  await textureController.load();
  main();
})();

function main() {
  const sunTexture = textureController.texture_path_map.get(
    SD.texturePaths.sun
  );
  const mercuryTexture = textureController.texture_path_map.get(
    SD.texturePaths.mercury
  );
  const venusTexture = textureController.texture_path_map.get(
    SD.texturePaths.venus
  );

  const earthTexture = textureController.texture_path_map.get(
    SD.texturePaths.earth
  );
  const marsTexture = textureController.texture_path_map.get(
    SD.texturePaths.mars
  );
  const jupiterTexture = textureController.texture_path_map.get(
    SD.texturePaths.jupiter
  );
  const saturnTexture = textureController.texture_path_map.get(
    SD.texturePaths.saturn
  );
  const uranusTexture = textureController.texture_path_map.get(
    SD.texturePaths.uranus
  );
  const neptunTexture = textureController.texture_path_map.get(
    SD.texturePaths.neptun
  );

  var sun = new Orbit();
  sun.createOrbit(10, new THREE.MeshBasicMaterial({ map: sunTexture }), "sun");

  var mercury = new Orbit();
  mercury.createOrbit(
    1,
    new THREE.MeshBasicMaterial({ map: mercuryTexture }),
    "mercury"
  );
  mercury.sphere.position.x = 15;

  var venus = new Orbit();
  venus.createOrbit(
    1.5,
    new THREE.MeshBasicMaterial({ map: venusTexture }),
    "venus"
  );
  venus.sphere.position.x = 20;

  var earth = new Orbit();
  earth.createOrbit(
    1.7,
    new THREE.MeshBasicMaterial({ map: earthTexture }),
    "earth"
  );
  earth.sphere.position.x = 27;

  var mars = new Orbit();
  mars.createOrbit(
    1.5,
    new THREE.MeshBasicMaterial({ map: marsTexture }),
    "mars"
  );
  mars.sphere.position.x = 32;

  var jupiter = new Orbit();
  jupiter.createOrbit(
    4,
    new THREE.MeshBasicMaterial({ map: jupiterTexture }),
    "jupiter"
  );
  jupiter.sphere.position.x = 40;

  var saturn = new Orbit();
  saturn.createOrbit(
    2.7,
    new THREE.MeshBasicMaterial({ map: saturnTexture }),
    "saturn"
  );
  saturn.sphere.position.x = 45;

  var uranus = new Orbit();
  uranus.createOrbit(
    1,
    new THREE.MeshBasicMaterial({ map: uranusTexture }),
    "uranus"
  );
  uranus.sphere.position.x = 50;

  var neptun = new Orbit();
  neptun.createOrbit(
    1,
    new THREE.MeshBasicMaterial({ map: neptunTexture }),
    "neptun"
  );
  neptun.sphere.position.x = 54;

  scene.add(sun.pivot);
  scene.add(mercury.pivot);
  scene.add(venus.pivot);
  scene.add(earth.pivot);
  scene.add(mars.pivot);
  scene.add(jupiter.pivot);
  scene.add(saturn.pivot);
  scene.add(uranus.pivot);
  scene.add(neptun.pivot);

  function animate() {
    renderer.render(scene, camera);
    sun.sphere.rotateY((Math.PI / 540) * 0.3);
    mercury.sphere.rotateY((Math.PI / 540) * 4);
    mercury.pivot.rotation.y += 0.01;
    venus.sphere.rotateY((Math.PI / 540) * 5);
    venus.pivot.rotation.y += 0.008;
    earth.sphere.rotateY((Math.PI / 540) * 5);
    earth.pivot.rotation.y += 0.005;
    mars.sphere.rotateY((Math.PI / 540) * 7);
    mars.pivot.rotation.y += 0.006;
    jupiter.sphere.rotateY((Math.PI / 540) * 0.5);
    jupiter.pivot.rotation.y += 0.001;
    saturn.sphere.rotateY((Math.PI / 540) * 0.5);
    saturn.pivot.rotation.y += 0.002;
    uranus.sphere.rotateY((Math.PI / 540) * 3);
    uranus.pivot.rotation.y += 0.004;
    neptun.sphere.rotateY((Math.PI / 540) * 2.3);
    neptun.pivot.rotation.y += 0.003;

    controls.update();
    requestAnimationFrame(animate);
  }
  animate();
}
