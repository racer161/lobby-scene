
import { Scene, WebGLRenderer, BoxGeometry, LineBasicMaterial, Vector3, BufferGeometry, Line, DirectionalLight, 
        MeshStandardMaterial, HemisphereLight, ACESFilmicToneMapping, sRGBEncoding, Mesh, PCFSoftShadowMap,
        CameraHelper
 } from "./three.module.js";
import { MouseInput } from "./input.mjs";
import { EditorCameraController } from "./camera.mjs";

import {Ground} from "./construction/ground.mjs";


const scene = new Scene();
const mouse_input = new MouseInput();

const camera_controller = new EditorCameraController(mouse_input);

const renderer = new WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.toneMapping = ACESFilmicToneMapping;
renderer.outputEncoding = sRGBEncoding;
//renderer.shadowMap.enabled = true;
//renderer.shadowMap.type = PCFSoftShadowMap;

document.body.appendChild( renderer.domElement );

const geometry = new BoxGeometry();
const material_1 = new MeshStandardMaterial( { color: 0x00ff00 } );
//const cube = new Mesh( geometry, material_1 );
//scene.add( cube );

const directionalLight = new DirectionalLight( 0xffffff, 0.9 );
directionalLight.position.set(16,16,16);

//directionalLight.target = cube;
//directionalLight.castShadow = true;
scene.add( directionalLight );

//Set up shadow properties for the light
//directionalLight.shadow.mapSize.width = 512; // default
//directionalLight.shadow.mapSize.height = 512; // default
//directionalLight.shadow.camera.near = 0.5; // default
//directionalLight.shadow.camera.far = 500; // default

//const helper = new CameraHelper( directionalLight.shadow.camera );
//scene.add( helper );


const light = new HemisphereLight( 0xffffbb, 0x080820, .5 );
scene.add(light);

const textured_cube = new Ground(32, scene,8);
scene.add(textured_cube.mesh);

function animate() {
    //HANDLE INPUT
    camera_controller.Update();
    mouse_input.Update();
    
    requestAnimationFrame( animate );
    renderer.render( scene, camera_controller.camera );


}

animate();