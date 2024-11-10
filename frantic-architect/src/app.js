import * as THREE from "three";
import * as CANNON from "cannon-es";
import { renderer, camera, scene, canvas, controls, world } from "./globals";
import Tower from "./Tower";

const tower = new Tower();
tower.init();

window.addEventListener("resize", () => {
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.updateProjectionMatrix();
  camera.aspect = window.innerWidth / window.innerHeigh;
});

window.addEventListener("keypress", ({ key }) => {
  if (key.toLowerCase() == "enter") {
    var [x, y, z] = tower.avaliablePositions[tower.ghostIndex].split(";");
    tower.addBlock(x, y, z);
    tower.curPosition = `${x};${y};${z}`;
    tower.blockPositions[`${x};${y};${z}`] = true;
    tower.ghostTimer = 0;

    // recalculate avaliable positions
    tower.calculateAvailablePositons();
  }
});

const clock = new THREE.Clock();
clock.start();
let animationId;
function animate() {
  tower.ghostTimer = Math.max(tower.ghostTimer - clock.getDelta(), 0);
  if (tower.ghostTimer == 0) {
    tower.delteGhostMesh();
    // select index
    while (true) {
      tower.ghostIndex = Math.floor(
        tower.avaliablePositions.length * Math.random()
      );
      if (tower.ghostIndex != tower.prevghostIndex) {
        tower.prevghostIndex = tower.ghostIndex;
        break;
      }
    }
    // reset timer
    tower.ghostTimer = 0.4;
    tower.renderGhostMesh();
  }

  if (tower.compositeBody.position.y <= 0) {
    renderer.dispose();
    alert("replay");
    location.reload();
    return;
  }

  world.fixedStep();
  controls.update();
  tower.sync();
  renderer.render(scene, camera);
  animationId = requestAnimationFrame(animate);
}
animate();
