import * as THREE from "three";
class Piece {
  static pieceType_empty = "e";
  static pieceType_X = "x";
  static pieceType_O = "o";

  constructor(pieceType, mesh) {
    this.pieceType = pieceType;
    this.mesh = mesh;
  }
  static createPiece(pieceType) {
    if (pieceType == Piece.pieceType_empty) {
      const geometry = new THREE.BoxGeometry(2, 2, 2);
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true,
      });
      const cube = new THREE.Mesh(geometry, material);
      return new Piece(pieceType, cube);
    } else if (pieceType == Piece.pieceType_O) {
      const geometry = new THREE.SphereGeometry(1, 32, 16);
      const material = new THREE.MeshStandardMaterial({ color: 0xffff00 });
      const sphere = new THREE.Mesh(geometry, material);
      return new Piece(pieceType, sphere);
    } else if (pieceType == Piece.pieceType_X) {
      const container = new THREE.Object3D();

      var c1 = createBox();
      var c2 = createBox();
      var c3 = createBox();
      var c4 = createBox();
      var c5 = createBox();
      var c6 = createBox();
      var c7 = createBox();
      c2.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / -4);
      c2.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / -4);
      c3.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 4);
      c3.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 4);
      c4.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 4);
      c4.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / -4);
      c5.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / -4);
      c5.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 4);
      c6.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
      c7.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 2);
      container.add(c1);
      container.add(c2);
      container.add(c3);
      container.add(c4);
      container.add(c5);
      container.add(c6);
      container.add(c7);

      function createBox() {
        const geometry = new THREE.BoxGeometry(0.5, 2, 0.5);
        const material = new THREE.MeshStandardMaterial({
          color: "red",
        });
        const mesh = new THREE.Mesh(geometry, material);

        return mesh;
      }

      return new Piece(pieceType, container);
    }
  }
}
export default Piece;
