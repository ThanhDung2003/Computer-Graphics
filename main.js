import * as dat from 'dat.gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const gui = new dat.GUI();
const scene = new THREE.Scene();

//initialize objects
const geometry2 = new THREE.ConeGeometry(1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x50D890 });
const cone = new THREE.Mesh(geometry2, material);
cone.castShadow = true;

var plane = new THREE.PlaneGeometry(5, 5);
var material_plane = new THREE.MeshStandardMaterial({ color: 0xEFFFFB, side: THREE.DoubleSide });
var plane_official = new THREE.Mesh(plane, material_plane);
plane_official.receiveShadow = true;

//cube map
var path = 'cube/';
var format = '.jpg';
var urls = [
    path + 'px' + format, path + 'nx' + format,
    path + 'py' + format, path + 'ny' + format,
    path + 'pz' + format, path + 'nz' + format
];
var reflectionCube = new THREE.CubeTextureLoader().load(urls);
scene.background = reflectionCube;
reflectionCube.format = THREE.RGBAFormat;

//texture
var loader = new THREE.TextureLoader();
material_plane.map = loader.load('concrete.jpg');
material_plane.bumpMap = loader.load('concrete.jpg');
material_plane.roughnessMap = loader.load('concrete.jpg');
material_plane.bumpScale = 0.01;
material_plane.metalness = 0.1;
material_plane.roughness = 0.7;
material.roughnessMap = loader.load('fingerprint.jpg');
material.envMap = reflectionCube;
material_plane.envMap = reflectionCube;

var maps = [material_plane.map, material_plane.bumpMap, material_plane.roughnessMap];
maps.forEach(function (map) {
    var texture = map;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(15, 15);
});

//initialize light
var lightLeft = getPointLight(2);
var lightRight = getPointLight(2);
var sphere1 = getSphere(0.5);
var sphere2 = getSphere(0.5);

//camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

//position
camera.position.z = 10;
camera.position.y = 2;
camera.position.x = -5;
camera.lookAt(new THREE.Vector3(2, 0, 5));
cone.position.y = 0.5001;

plane_official.rotation.x = Math.PI / 2;

var newVector3 = {
    x: 0,
    y: 0,
    z: 0
};

lightLeft.position.x = 2;
lightLeft.position.y = 2;
lightLeft.position.z = 0;

lightRight.position.x = -2;
lightRight.position.y = 2;
lightRight.position.z = 0;


//controller
var folder = gui.addFolder("Cone position")
folder.add(cone.position, "x", -5, 5).name("Cone's position x");
folder.add(cone.rotation, "x", -5, 5).name("Cone's rotation x");
folder.add(cone.scale, "x", -5, 5).name("Cone's scale x");

var folder0 = gui.addFolder("Camera")
folder0.add(newVector3, "x", -10, 10).name("Camera x");
folder0.add(newVector3, "y", -10, 10).name("Camera y");
folder0.add(newVector3, "z", -10, 10).name("Camera z");

var folder1 = gui.addFolder("Light left");
folder1.add(lightLeft, 'intensity', 0, 10).name("Intensity");
folder1.add(lightLeft.position, 'x', -5, 15).name("Light left x");
folder1.add(lightLeft.position, 'y', -5, 15).name("Light left y");
folder1.add(lightLeft.position, 'z', -5, 15).name("Light left z");

var folder2 = gui.addFolder("Light right");
folder2.add(lightRight, 'intensity', 0, 10).name("Intensity");
folder2.add(lightRight.position, 'x', -5, 15).name("Light right x");
folder2.add(lightRight.position, 'y', -5, 15).name("Light right y");
folder2.add(lightRight.position, 'z', -5, 15).name("Light right z");

//add objects to the scene
scene.add(cone);
scene.add(plane_official);

scene.add(lightLeft);
lightLeft.add(sphere1);

scene.add(lightRight);
lightRight.add(sphere2);

//animate
function animate() {
    requestAnimationFrame(animate);
    camera.lookAt(new THREE.Vector3(
        newVector3.x,
        newVector3.y,
        newVector3.z
    ))

    controls.update();
    renderer.render(scene, camera);
}
animate();

function getSphere(size) {
    var geometry = new THREE.SphereGeometry(size, 24, 24);
    var material_sphere = new THREE.MeshBasicMaterial({ color: 'rgb(250, 250, 250)' });
    var mesh_sphere = new THREE.Mesh(geometry, material_sphere);
    return mesh_sphere;
}

function getPointLight(intensity) {
    var light = new THREE.PointLight(0xffffff, intensity);
    light.castShadow = true;

    return light;
}