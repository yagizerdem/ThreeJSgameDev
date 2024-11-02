import * as THREE from "three";
import getDebugPanel from "./debugpanel";
import Piece from "./piece";

class Board {
  constructor() {
    this.board = new THREE.Object3D();
    this.backend = Array.from({ length: 3 }, () => {
      return [
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ];
    });

    // vertical
    var m1 = this.#create2dMap();
    m1.position.z = 2;
    this.board.add(m1);
    var m2 = this.#create2dMap();
    m2.position.z = -2;
    this.board.add(m2);

    // horizontal
    var m3 = this.#create2dMap();
    m3.position.y = 2;
    m3.rotateX(Math.PI / 2);
    this.board.add(m3);
    var m4 = this.#create2dMap();
    m4.rotateX(Math.PI / 2);
    m4.position.y = -2;
    this.board.add(m4);

    const debugPanel = getDebugPanel();
    debugPanel.addItem(this.board, "visible", "board visibility");
  }
  #create2dMap() {
    // vertical
    const container = new THREE.Object3D();
    var c1 = this.#createColumn(0.4, 10, 0.4, "red");
    c1.position.x = -2;
    container.add(c1);
    var c2 = this.#createColumn(0.4, 10, 0.4, "red");
    c2.position.x = 2;
    container.add(c2);

    // horizontal
    var c3 = this.#createColumn(0.4, 10, 0.4, "red");
    c3.rotateZ(Math.PI / 2);
    c3.position.y = 2;
    container.add(c3);
    var c4 = this.#createColumn(0.4, 10, 0.4, "red");
    c4.rotateZ(Math.PI / 2);
    c4.position.y = -2;
    container.add(c4);

    return container;
  }
  #createColumn(x, y, z, col) {
    const geometry = new THREE.BoxGeometry(x, y, z);
    const material = new THREE.MeshStandardMaterial();
    const cube = new THREE.Mesh(geometry, material);
    return cube;
  }
  initBoard() {
    for (var i = 0; i < this.backend.length; i++) {
      var matrix = this.backend[i];
      for (var j = 0; j < matrix.length; j++) {
        var row = matrix[j];
        for (var k = 0; k < row.length; k++) {
          if (i == 1 && j == 1 && k == 1) {
            continue;
          }
          var p = Piece.createPiece(Piece.pieceType_empty);
          this.backend[i][j][k] = p;

          var z = i - 1;
          var y = (j - 1) * -1;
          var x = k - 1;

          p.mesh.position.set(x * 4, y * 4, z * 4);
          this.board.add(p.mesh);
        }
      }
    }
  }
  changePiece(uuid, turn) {
    if (uuid && turn) {
      const { c: currentPiece, i, j, k } = this.#findByuuid(uuid);
      if (currentPiece instanceof Piece) {
        var position = currentPiece.mesh.position;
        currentPiece.mesh.parent.remove(currentPiece.mesh);
        var newPiece =
          turn == "X"
            ? Piece.createPiece(Piece.pieceType_X)
            : Piece.createPiece(Piece.pieceType_O);

        newPiece.mesh.position.x = position.x;
        newPiece.mesh.position.y = position.y;
        newPiece.mesh.position.z = position.z;
        this.backend[i * 1][j * 1][k * 1] = newPiece;
        this.board.add(newPiece.mesh);

        // check game end

        for (var m of this.generateAllMatrix()) {
          var flag = this.checkGameEnd(m);
          console.log(flag);
          if (flag) break;
        }

        return flag;
      }
    } else {
      throw new Error("uuid and turn is undefined");
    }
  }
  #findByuuid(uuid) {
    for (var i in this.backend) {
      var m = this.backend[i];
      for (var j in m) {
        var r = m[j];
        for (var k in r) {
          var c = r[k];
          if (c.mesh.uuid == uuid) {
            return { c, i, j, k };
          }
        }
      }
    }
    return null;
  }
  checkGameEnd(matrix) {
    // check rows
    for (var i = 0; i < 3; i++) {
      if (
        matrix[i][0].pieceType === matrix[i][1].pieceType &&
        matrix[i][1].pieceType === matrix[i][2].pieceType &&
        matrix[i][0].pieceType !== Piece.pieceType_empty
      ) {
        console.log("Row win detected");
        return true;
      }
    }

    // check columns
    for (var i = 0; i < 3; i++) {
      if (
        matrix[0][i].pieceType === matrix[1][i].pieceType &&
        matrix[1][i].pieceType === matrix[2][i].pieceType &&
        matrix[0][i].pieceType !== Piece.pieceType_empty
      ) {
        console.log("Column win detected");
        return true;
      }
    }

    // check diagonals
    if (
      matrix[0][0].pieceType === matrix[1][1].pieceType &&
      matrix[1][1].pieceType === matrix[2][2].pieceType &&
      matrix[1][1].pieceType !== Piece.pieceType_empty
    ) {
      console.log("Diagonal win detected (top-left to bottom-right)");
      return true;
    }

    if (
      matrix[0][2].pieceType === matrix[1][1].pieceType &&
      matrix[1][1].pieceType === matrix[2][0].pieceType &&
      matrix[1][1].pieceType !== Piece.pieceType_empty
    ) {
      console.log("Diagonal win detected (top-right to bottom-left)");
      return true;
    }

    return false;
  }

  *generateAllMatrix() {
    for (var m of this.backend) {
      yield JSON.parse(JSON.stringify(m));
    }
    for (var i = 0; i < 3; i++) {
      var matrix = [];
      for (var j = 0; j < 3; j++) {
        var row = [];
        for (var k = 0; k < 3; k++) {
          row.push(this.backend[k][j][i]);
        }
        matrix.push(row);
      }
      yield matrix;
    }
  }
}

export default Board;
