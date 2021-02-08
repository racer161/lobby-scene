
import { Scene, WebGLRenderer, BoxGeometry, DirectionalLight, 
        MeshStandardMaterial, HemisphereLight, ACESFilmicToneMapping, sRGBEncoding, PCFSoftShadowMap,
        CameraHelper, Mesh, AmbientLight, TextureLoader, WebGLCubeRenderTarget, UnsignedByteType, PMREMGenerator, AxesHelper
 } from "./three.module.js";

import { GUI } from "./GUI/dat.gui.module.js";


import { MouseInput } from "./input.mjs";
import { EditorCameraController } from "./camera.mjs";

import {Ground} from "./construction/ground.mjs";

import { RGBELoader } from "./skybox/RGBELoader.js";


const scene = new Scene();
const mouse_input = new MouseInput();

const camera_controller = new EditorCameraController(mouse_input);


const renderer = new WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.toneMapping = ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.2;
renderer.outputEncoding = sRGBEncoding;
//renderer.shadowMap.enabled = true;
//renderer.shadowMap.type = PCFSoftShadowMap;

document.body.appendChild( renderer.domElement );

const geometry = new BoxGeometry();
const material_1 = new MeshStandardMaterial( { color: 0x00ff00 } );
const cube = new Mesh( geometry, material_1 );
scene.add( cube );

const directionalLight = new DirectionalLight( 0xffffff, 0.7 );
directionalLight.position.set(16,16,16);

//directionalLight.target = cube;
//directionalLight.castShadow = true;
//scene.add( directionalLight );

const pmremGenerator = new PMREMGenerator( renderer );
				pmremGenerator.compileEquirectangularShader();

//setup skybox
new RGBELoader()
					.setDataType( UnsignedByteType )
					.setPath( 'resources/skyboxes/' )
					.load( 'TexturesCom_NorwayHighlandsB_1K_hdri_sphere.hdr', function ( texture ) {

						const envMap = pmremGenerator.fromEquirectangular( texture ).texture;

						scene.background = envMap;
						scene.environment = envMap;

						texture.dispose();
						pmremGenerator.dispose();

						//render();

} );



/*
{
    const loader = new TextureLoader();
    const texture = loader.load(
      'resources/skyboxes/TexturesCom_NorwayHighlandsB_1K_hdri_sphere_tone.jpg',
      () => {
        const rt = new WebGLCubeRenderTarget(texture.image.height);
        rt.fromEquirectangularTexture(renderer, texture);
        scene.background = rt;
      });
}*/


//Set up shadow properties for the light
//directionalLight.shadow.mapSize.width = 512; // default
//directionalLight.shadow.mapSize.height = 512; // default
//directionalLight.shadow.camera.near = 0.5; // default
//directionalLight.shadow.camera.far = 500; // default

//const helper = new CameraHelper( directionalLight.shadow.camera );
//scene.add( helper );


//const light = new AmbientLight( 0x404040 , .5); // soft white light
//scene.add(light);

const datGui  = new GUI({ autoPlace: true });
  
datGui.domElement.id = 'gui' 

var folder = datGui.addFolder(`Scene`)

folder.add(renderer,'toneMappingExposure',0.1,1.5) //
  .name('exposure')
  //.onChange(animate)

const axesHelper = new AxesHelper( 5 );
scene.add( axesHelper );
  

const ground = new Ground(64, scene,64, mouse_input, camera_controller);

folder.add(ground, "reset").name("Nuke'em all!");

folder.add(ground,'brush_size',1,10).step(1).name('brush size');

folder.add(ground,'brush_strength',0,3).name('brush strength');

function animate() {
    //HANDLE INPUT
    camera_controller.Update();
    mouse_input.Update();
    
    
    requestAnimationFrame( animate );
    renderer.render( scene, camera_controller.camera );

    ground.Update();
}

animate();