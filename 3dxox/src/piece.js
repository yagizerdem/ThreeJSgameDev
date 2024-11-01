import * as THREE from "three";
class Piece {
  static typeX = "X";
  static typeO = "O";
  static typeEmpty = "empty";
  constructor(type = Piece.typeEmpty) {
    this.type = type;
    this.mesh = null;
  }
  createMesh() {
    if (this.type == Piece.typeEmpty) {
      const geometry = new THREE.BoxGeometry(2, 2, 2);
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true,
      });
      const cube = new THREE.Mesh(geometry, material);
      this.mesh = cube;
    } else if (this.type == Piece.typeX) {
      var XShape = new THREE.Object3D();

      const material = new THREE.MeshBasicMaterial({
        color: "red",
        side: THREE.DoubleSide,
      });

      // Create two boxes for the X shape
      const box1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
      const box2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);

      // Rotate the second box to create the "X" effect
      box2.rotation.z = Math.PI / 4; // 45 degrees rotation
      XShape.add(box1);
      XShape.add(box2);
      this.mesh = XShape;
    } else if (this.type == Piece.typeO) {
      const geometry = new THREE.CircleGeometry(1, 10);
      const material = new THREE.MeshBasicMaterial({
        color: "blue",
        side: THREE.DoubleSide,
      });
      const circle = new THREE.Mesh(geometry, material);
      this.mesh = circle;
    }
  }
}
export default Piece;
