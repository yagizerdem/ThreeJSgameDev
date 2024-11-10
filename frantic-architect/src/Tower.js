import * as THREE from "three";
import * as CANNON from "cannon-es";
import { scene, world } from "./globals";
import { v4 as uuidv4 } from "uuid";
import Block from "./block";
class Tower {
  constructor() {
    this.compositeMesh = new THREE.Group();
    this.compositeBody = this.#addCompoundBody();
    this.dimensionSize = 1;

    this.groundMesh = null;
    this.groundBody = null;
    this.#createGournd();

    this.allBlocks = [];

    // render related
    scene.add(this.groundMesh);
    scene.add(this.compositeMesh);

    // physics realted
    world.addBody(this.compositeBody);
    world.addBody(this.groundBody);

    // mapping between physics and rander layer
    this.shape_mesh = {};

    // game logic related
    this.blockPositions = {};
    this.curPosition = null; // store data as string xyz coords respectively
    this.avaliablePositions = [];
    this.ghostTimer = 1;
    this.ghostIndex = null;
    this.prevghostIndex = null;
    this.ghostMesh = null;
  }

  addBlock(x, y, z) {
    // crate block mesh
    const cubeMesh = this.#createCubeMesh(1, 1, 1, "white");
    cubeMesh.position.copy(new THREE.Vector3(x, y, z));
    this.compositeMesh.add(cubeMesh);

    // create block bocy
    const shape = new CANNON.Box(new CANNON.Vec3(1 / 2, 1 / 2, 1 / 2));

    // store data
    this.shape_mesh[shape.id] = cubeMesh;

    // adjust offets
    const offsetx = x - this.compositeBody.position.x;
    const offsety = y - this.compositeBody.position.y;
    const offsetz = z - this.compositeBody.position.z;
    const offset = new CANNON.Vec3(offsetx, offsety, offsetz);
    this.compositeBody.addShape(shape, offset);

    // adjust mass of tower
    this.compositeBody.mass += 1;
    this.compositeBody.updateMassProperties();
    if (this.compositeBody.type == CANNON.BODY_TYPES.STATIC) {
      this.compositeBody.type = CANNON.BODY_TYPES.DYNAMIC;
    }

    // adjust center of mass after insteing block
    let weightedCenter = new CANNON.Vec3(0, 0, 0);

    // for (var shapeOffsets of this.compositeBody.shapeOffsets) {
    //   weightedCenter.x += shapeOffsets.x * 1;
    //   weightedCenter.y += shapeOffsets.y * 1;
    //   weightedCenter.z += shapeOffsets.z * 1;
    // }

    for (var mesh of this.compositeMesh.children) {
      weightedCenter.x += mesh.position.x * 1;
      weightedCenter.y += mesh.position.y * 1;
      weightedCenter.z += mesh.position.z * 1;
    }

    const centerOfMass = new CANNON.Vec3(
      weightedCenter.x / this.compositeBody.mass,
      weightedCenter.y / this.compositeBody.mass,
      weightedCenter.z / this.compositeBody.mass
    );
    this.compositeBody.position = centerOfMass;

    var list = [];
    for (let i = 0; i < this.compositeBody.shapes.length; i++) {
      const shape_ = this.compositeBody.shapes[i];
      const mesh = this.shape_mesh[shape_.id];
      const offsetx = mesh.position.x - this.compositeBody.position.x;
      const offsety = mesh.position.y - this.compositeBody.position.y;
      const offsetz = mesh.position.z - this.compositeBody.position.z;

      const offset = new CANNON.Vec3(offsetx, offsety, offsetz);
      list.push([shape_, offset]);
    }
    for (var entry of list) {
      this.compositeBody.removeShape(entry[0]);
      this.compositeBody.addShape(entry[0], entry[1]);
    }
    // finally ...
  }
  #addCompoundBody() {
    const slipperyMaterial = new CANNON.Material("slippery");
    slipperyMaterial.friction = 0.01;

    const compoundBody = new CANNON.Body({
      mass: 0,
      material: slipperyMaterial,
    });
    return compoundBody;
  }
  #createGournd() {
    // mesh
    const ground = this.#createCubeMesh(5, 1, 5, "#C1E899");
    this.groundMesh = ground;

    const groundMaterial = new CANNON.Material("ground");
    groundMaterial.friction = 0.5;

    // physics
    const shape = new CANNON.Box(new CANNON.Vec3(5 / 2, 1 / 2, 5 / 2));
    const body = new CANNON.Body({
      mass: 0, // static
      shape: shape,
      material: groundMaterial,
    });
    this.groundBody = body;
  }
  #createCubeMesh(sizex = 1, sizey = 1, sizez = 1, color = 0x00ff00) {
    const geometry = new THREE.BoxGeometry(sizex, sizey, sizez);
    const material = new THREE.MeshBasicMaterial({ color: color });
    const cube = new THREE.Mesh(geometry, material);
    return cube;
  }
  sync() {
    // sync ground
    this.groundMesh.position.copy(this.groundBody.position);
    for (var i = 0; i < this.compositeBody.shapes.length; i++) {
      var offset = this.compositeBody.shapeOffsets[i];
      var shape = this.compositeBody.shapes[i];
      var worldPosition = shape.body.position.vadd(offset);
      const mesh = this.shape_mesh[shape.id];
      mesh.position.copy(worldPosition);
      this.compositeMesh.quaternion.copy(this.compositeBody.quaternion);
    }
  }
  init() {
    // first block
    this.addBlock(0, 1, 0);
    this.blockPositions["0;1;0"] = true;
    this.curPosition = "0;1;0";
    this.calculateAvailablePositons();
    this.ghostIndex = Math.floor(
      Math.random() * this.avaliablePositions.length
    );
    this.prevghostIndex = this.ghostIndex;
    this.ghostTimer = 1; // 1second
    this.renderGhostMesh();
  }
  calculateAvailablePositons() {
    var curPositons = this.curPosition.split(";");
    var x = curPositons[0] * 1;
    var y = curPositons[1] * 1;
    var z = curPositons[2] * 1;

    var combinatios = [];
    for (var i = -1; i <= 1; i++) {
      combinatios.push(`${x + i};${y};${z}`);
      if (y + i >= 1) combinatios.push(`${x};${y + i};${z}`);
      combinatios.push(`${x};${y};${z + i}`);
    }

    combinatios = combinatios.filter((item) => !(item in this.blockPositions));
    this.avaliablePositions = combinatios;
  }
  renderGhostMesh() {
    var [x, y, z] = this.avaliablePositions[this.ghostIndex].split(";");

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: "#826cf6" });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.copy(new THREE.Vector3(x, y, z));
    this.ghostMesh = cube;
    scene.add(cube);
  }
  delteGhostMesh() {
    this.ghostMesh.parent.remove(this.ghostMesh);
  }
}
export default Tower;
