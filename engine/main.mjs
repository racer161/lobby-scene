
import { Scene, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh, LineBasicMaterial, Vector3, BufferGeometry, Line, DirectionalLight, HemisphereLight, MeshPhongMaterial, DoubleSide, MeshStandardMaterial } from "./three.module.js";
import { MouseInput } from "./input.mjs";
import { EditorCameraController } from "./camera.mjs";
import { Floor } from "./construction/floor.mjs";

const scene = new Scene();
const mouse_input = new MouseInput();

const camera_controller = new EditorCameraController(mouse_input);

const renderer = new WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new BoxGeometry();
const material_1 = new MeshStandardMaterial( { color: 0x00ff00 } );
const cube = new Mesh( geometry, material_1 );
scene.add( cube );

const light = new HemisphereLight();
scene.add( light );

const textured_cube = new Floor(16);

scene.add(textured_cube.mesh);


function build_grid()
{
    //create a blue LineBasicMaterial
    const material = new LineBasicMaterial( { color: 0x0000ff } );

    const points = [];
    for(var x =0; x < 10; x++)
    {
        var start = x%2 == 0 ? 10 : 0;
        var end = x%2 == 0 ? 0 : 10;
        points.push(new Vector3(start,0,x))
        points.push(new Vector3(end,0,x));
    }
    
    points.push(new Vector3(10,0,10));

    for(var z =0; z < 10; z++)
    {
        var start = z%2 == 0 ? 10 : 0;
        var end = z%2 == 0 ? 0 : 10;
        points.push(new Vector3(z,0,start))
        points.push(new Vector3(z,0,end));
    }

    const geometry = new BufferGeometry().setFromPoints( points );

    const line = new Line( geometry, material );
    scene.add( line );


}



function animate() {
    //HANDLE INPUT
    camera_controller.Update();
    mouse_input.Update();
    
    requestAnimationFrame( animate );
    renderer.render( scene, camera_controller.camera );


}
//build_grid();

animate();