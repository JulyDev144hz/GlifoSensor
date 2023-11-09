import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

const monkeyUrl = new URL('/public/porongota.glb', import.meta.url);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth -7, window.innerHeight-20);
document.body.appendChild(renderer.domElement);

// Configura el color de fondo
renderer.setClearColor(0x0055aa00);
$("#toggle").on("click", e=>{
    $(".containerCheckBox").toggleClass("active")
    $("body").toggleClass("darkMode")

    if ($("body").hasClass("darkMode")){
    renderer.setClearColor(0xae57c9);
    // El modo oscuro está activado
    } else {
    // El modo oscuro no está activado
    renderer.setClearColor(0x0055aa00);
    }

})


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

const orbit = new OrbitControls(camera, renderer.domElement);

const assetLoader = new GLTFLoader();

let mixer;
assetLoader.load(monkeyUrl.href, function(gltf) {
    const model = gltf.scene;

    // Configurar material para ser transparente
    model.traverse(function(object) {
        if (object.isMesh) {
            object.material.transparent = true;
            object.material.opacity = 1; // Ajusta la opacidad según tus preferencias
        }
    });

    scene.add(model);
    mixer = new THREE.AnimationMixer(model);
    const clips = gltf.animations;
    clips.forEach(function(clip) {
        const action = mixer.clipAction(clip);
        action.play();
    });

    // Ajusta la posición y orientación de la cámara para que mire al objeto
    const boundingBox = new THREE.Box3().setFromObject(model);
    const center = boundingBox.getCenter(new THREE.Vector3());
    camera.position.set(center.x, center.y, center.z + boundingBox.getSize(new THREE.Vector3()).length());
    camera.lookAt(center);
    orbit.target.copy(center);

}, undefined, function(error) {
    console.error(error);
});

const clock = new THREE.Clock();
function animate() {
    if(mixer)
        mixer.update(clock.getDelta());
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 0, 5);
scene.add(light);
// Agrega una luz direccional para iluminar el objeto
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Color blanco e intensidad 0.3
scene.add(ambientLight);

// Agregar una luz puntual
const pointLight = new THREE.PointLight(0xffffff, 1, 100); // Color blanco e intensidad 1
pointLight.position.set(0, 10, 0); // Posición de la luz puntual
scene.add(pointLight);

const bottomLight = new THREE.PointLight(0xffffff, 1, 100);
bottomLight.position.set(0, -10, 0); // Posición debajo del objeto
scene.add(bottomLight);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
