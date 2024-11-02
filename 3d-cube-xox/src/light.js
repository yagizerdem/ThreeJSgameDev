import * as THREE from "three";
import getDebugPanel from "./debugpanel";
import { RectAreaLightHelper } from "three/examples/jsm/Addons.js";
class Light {
  static counter = 0;
  constructor() {
    Light.counter++;
    this.container = new THREE.Object3D();
    const light = new THREE.AmbientLight(0x404040); // soft white light
    this.container.add(light);

    const debugPanel = getDebugPanel();
    debugPanel.addItem(light, "visible", `ligth ${Light.counter} visibility`);
  }
  addReactAreaLight(color, intensity, w, h, x, y, z) {
    Light.counter++;
    // taget is object 3d
    const rectLight = new THREE.RectAreaLight(color, intensity, w, h);
    rectLight.position.set(x, y, z);
    this.container.add(rectLight);

    const debugPanel = getDebugPanel();
    const helper = new RectAreaLightHelper(rectLight);
    rectLight.add(helper);

    debugPanel.addItem(
      rectLight,
      "visible",
      `ligth ${Light.counter} visibility`
    );
    debugPanel.addItem(
      rectLight.position,
      "x",
      `ligth ${Light.counter} poxition x`
    );
    debugPanel.addItem(
      rectLight.position,
      "y",
      `ligth ${Light.counter} poxition y`
    );
    debugPanel.addItem(
      rectLight.position,
      "z",
      `ligth ${Light.counter} poxition z`
    );
    debugPanel.addItem(
      rectLight,
      "intensity",
      `ligth ${Light.counter} intensity`
    );
  }

  addDirectionalLight(color, intensity, x, y, z, target = null) {
    Light.counter++;
    // Create a directional light
    const directionalLight = new THREE.DirectionalLight(color, intensity);
    directionalLight.position.set(x, y, z);
    directionalLight.target.position.set(0, 0, 0); // Pointing towards the origin (or adjust as needed)
    this.container.add(directionalLight);
    this.container.add(directionalLight.target); // Ensure the target is added to the scene

    const debugPanel = getDebugPanel();
    const helper = new THREE.DirectionalLightHelper(directionalLight); // Optional helper for visualization
    this.container.add(helper);

    if (target && target instanceof THREE.Object3D) {
      directionalLight.lookAt(target.position);
    }

    // Debug controls for the directional light
    debugPanel.addItem(helper, "visible", `light ${Light.counter} helper`);

    debugPanel.addItem(
      directionalLight,
      "visible",
      `light ${Light.counter} visibility`
    );
    debugPanel.addItem(
      directionalLight.position,
      "x",
      `light ${Light.counter} position x`
    );
    debugPanel.addItem(
      directionalLight.position,
      "y",
      `light ${Light.counter} position y`
    );
    debugPanel.addItem(
      directionalLight.position,
      "z",
      `light ${Light.counter} position z`
    );
    debugPanel.addItem(
      directionalLight,
      "intensity",
      `light ${Light.counter} intensity`
    );
  }
}
export default Light;
