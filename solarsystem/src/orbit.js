import * as THREE from "three";
class Orbit {
  constructor() {
    this.sphere = null;
    this.pivot = new THREE.Object3D(); // 0 0
  }
  createOrbit(radius, material, name) {
    const geometry = new THREE.SphereGeometry(1 * radius, 32, 32);
    const sphere = new THREE.Mesh(geometry, material);
    sphere.name = name;
    this.sphere = sphere;
    this.pivot.add(this.sphere);

    this.pivot.rotation.y = Math.PI * 2 * Math.random();
  }
}
export default Orbit;
