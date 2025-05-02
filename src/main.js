import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { mix } from "three/tsl";

// setup the camera
const camera = new THREE.PerspectiveCamera(
  10,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 13;

// setup the scene
const scene = new THREE.Scene();

// load 3d model
let bee;
let mixer; // for animation
const loader = new GLTFLoader();
loader.load(
  "/assets/bee.glb",
  function (glft) {
    bee = glft.scene;
    bee.position.x = 1.5;
    bee.position.y = -1;
    bee.position.z = -5;
    
    bee.rotation.x = 0.5;
    bee.rotation.y = -0.5;
    scene.add(bee);

    mixer = new THREE.AnimationMixer(bee);
    mixer.clipAction(glft.animations[0]).play();
    console.log(glft.animations);
  },
  function (xhr) {},
  function (error) {
    alert(error);
  }
);

// setup the renderer
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);

// setup the light
const light = new THREE.AmbientLight(0xffffff, 1.3);
scene.add(light);

const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500);
scene.add(topLight);

// push the renderer to the DOM
document.querySelector("#container3D").appendChild(renderer.domElement);

const render3D = () => {
  requestAnimationFrame(render3D);
  renderer.render(scene, camera);
  if (mixer) {
    mixer.update(0.02);
  }
};

render3D();
