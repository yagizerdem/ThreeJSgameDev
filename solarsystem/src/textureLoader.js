import * as THREE from "three";
import SD from "./SD";

class TextureContoller {
  constructor() {
    this.texture_path_map = new Map();
    this.texture_path_map.set(SD.texturePaths.sun, null);
    this.texture_path_map.set(SD.texturePaths.mercury, null);
    this.texture_path_map.set(SD.texturePaths.venus, null);
    this.texture_path_map.set(SD.texturePaths.earth, null);
    this.texture_path_map.set(SD.texturePaths.mars, null);
    this.texture_path_map.set(SD.texturePaths.jupiter, null);
    this.texture_path_map.set(SD.texturePaths.saturn, null);
    this.texture_path_map.set(SD.texturePaths.uranus, null);
    this.texture_path_map.set(SD.texturePaths.neptun, null);
    this.instance = null;
  }
  async load() {
    // Create a TextureLoader instance
    const loader = new THREE.TextureLoader();

    // Function to load a texture
    function loadTexture(url) {
      return new Promise((resolve, reject) => {
        loader.load(
          url,
          (texture) => resolve(texture), // Resolve the promise with the loaded texture
          undefined,
          (err) => reject(err) // Reject the promise on error
        );
      });
    }
    // Load all textures using Promise.all
    return Promise.all(this.texture_path_map.keys().map(loadTexture))
      .then((textures) => {
        // textures is an array of loaded textures
        this.texture_path_map.set(SD.texturePaths.sun, textures[0]);
        this.texture_path_map.set(SD.texturePaths.mercury, textures[1]);
        this.texture_path_map.set(SD.texturePaths.venus, textures[2]);
        this.texture_path_map.set(SD.texturePaths.earth, textures[3]);
        this.texture_path_map.set(SD.texturePaths.mars, textures[4]);
        this.texture_path_map.set(SD.texturePaths.jupiter, textures[5]);
        this.texture_path_map.set(SD.texturePaths.saturn, textures[6]);
        this.texture_path_map.set(SD.texturePaths.uranus, textures[7]);
        this.texture_path_map.set(SD.texturePaths.neptun, textures[8]);
      })
      .catch((err) => {
        console.error("An error occurred while loading textures:", err);
      });
  }
  static getTextureController() {
    if (!this.instance) {
      this.instance = new TextureContoller();
    }
    return this.instance;
  }
}
export default TextureContoller;
