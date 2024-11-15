import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import audioUrl from "./assets/bensound-screamvillain.mp3";
import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";

// attack audio to htlm
const audio = new Audio(audioUrl);
audio.controls = true; // Show audio controls (play, pause, volume, etc.)
document.body.appendChild(audio);

const canvas = document.getElementById("webgl");

canvas.style.background = "black";
canvas.style.width = `${window.innerWidth}px`;
canvas.style.height = `${window.innerHeight}px`;

window.onresize = (e) => {
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const uniforms = {
  vData: { value: [] },
};

const geometry = new THREE.PlaneGeometry(16, 16, 32, 32);
const material = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  wireframe: true,
});

const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

camera.position.z = 20;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 256; // The size of the FFT (Fast Fourier Transform) for frequency analysis
const bufferLength = analyser.frequencyBinCount; // The number of frequency bins

const dataArray = new Uint8Array(bufferLength);
const source = audioCtx.createMediaElementSource(audio);

source.connect(analyser);
analyser.connect(audioCtx.destination);

function getFrequncyData() {
  if (audio.paused) {
    return; // Stop the function from running if the audio is paused
  }
  requestAnimationFrame(getFrequncyData);
  analyser.getByteFrequencyData(dataArray);
  uniforms.vData.value = dataArray;
}

audio.onplay = () => {
  audioCtx.resume().then(() => {
    getFrequncyData();
  });
};

function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
