import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

import gsap from "gsap";

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
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/"); // Make sure you host decoder files here
loader.setDRACOLoader(dracoLoader);

const timeout = setTimeout(() => {
  alert("Model loading timeout. Please refresh the page.");
}, 15000); // 15 seconds


loader.load(
  "/assets/bee.glb",
  function (glft) {
    clearTimeout(timeout);

    bee = glft.scene;
    bee.position.x = 0;
    bee.position.y = -1;
    bee.position.z = 0;

    bee.rotation.x = 0;
    bee.rotation.y = 1.5;
    bee.rotation.z = 0;
    scene.add(bee);

    mixer = new THREE.AnimationMixer(bee);
    mixer.clipAction(glft.animations[0]).play();

    document.getElementById("loader-container").style.display = "none";
  },
  function (xhr) {
    if (xhr.lengthComputable) {
      const percentComplete = (xhr.loaded / xhr.total) * 100;
      document.getElementById("loader-bar").style.width = `${percentComplete}%`;
    }
  },
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

// run the animation
const render3D = () => {
  requestAnimationFrame(render3D);
  renderer.render(scene, camera);
  if (mixer) {
    mixer.update(0.02);
  }
};

render3D();

let arrPositionModel = [
  {
    id: "banner",
    position: { x: 0, y: -1, z: 0 },
    rotation: { x: 0, y: 1.5, z: 0 },
  },
  {
    id: "intro",
    position: { x: 1.5, y: -1, z: -5 },
    rotation: { x: -0.5, y: -0.5, z: 0 },
  },
  {
    id: "description",
    position: { x: -1, y: -1, z: -5 },
    rotation: { x: 0, y: 0.5, z: 0 },
  },
  {
    id: "contact",
    position: { x: 1, y: -1, z: 0 },
    rotation: { x: 0.3, y: -0.5, z: 0 },
  },
];

const modelMove = () => {
  const sections = document.querySelectorAll(".section");
  let currentSection;
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight / 3) {
      currentSection = section.id;
    }
  });

  let position_active = arrPositionModel.findIndex(
    (val) => val.id === currentSection
  );

  // if (currentSection === "banner") {
  //   mixer.clipAction(glft.animations[1]).play();
  // } else {
  //   mixer.clipAction(glft.animations[0]).play();
  // }

  if (position_active >= 0) {
    let new_coordinates = arrPositionModel[position_active];
    gsap.to(bee.position, {
      x: new_coordinates.position.x,
      y: new_coordinates.position.y,
      z: new_coordinates.position.z,
      duration: 1,
      ease: "power2.out",
    });
    gsap.to(bee.rotation, {
      x: new_coordinates.rotation.x,
      y: new_coordinates.rotation.y,
      z: new_coordinates.rotation.z,
      duration: 1,
      ease: "power2.out",
    });
  }
};

window.addEventListener("scroll", () => {
  if (bee) {
    modelMove();
  }
});

// push the renderer to the DOM
document.querySelector("#container3D").appendChild(renderer.domElement);
