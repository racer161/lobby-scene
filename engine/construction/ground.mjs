import { Mesh, TextureLoader, MeshStandardMaterial, BufferGeometry, Float32BufferAttribute, NearestFilter, DoubleSide, MeshBasicMaterial, RepeatWrapping, Vector2, Vector3, BoxGeometry, Camera } from "../three.module.js";
import { Voxel } from './voxel.mjs';

export class Ground
{
    constructor(size, scene, scale, mouse_input, camera_controller)
    {
        this.camera_controller = camera_controller;

        this.size = size;
        this.scene = scene;
        this.scale = scale;

        //load texture
        const loader = new TextureLoader();
        const texture = loader.load('./resources/grass_block_top.png');
        texture.magFilter = NearestFilter;
        texture.minFilter = NearestFilter;
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat = new Vector2(4,4);

        this.material = new MeshStandardMaterial( {
            //side: 1,
            //color : 0xffffff,
            map: texture,
            //wireframe : true
        } );


        this.grid = new Voxel(this.size, this.material, true, false);


        this.grid.reset();

        this.gen_rng_ground();

        

        this.geometry = this.grid.generateBufferGeometry();

        

        this.mesh = new Mesh(this.geometry, this.material);

        this.mesh.position.set( this.scale, this.scale, this.scale);
        this.mesh.scale.set( this.scale, this.scale, this.scale );

        this.mesh.castShadow = true; //default is false
        this.mesh.receiveShadow = true; //default

        this.build_brush_cube();
    }

    //this function takes two vector3s pos and dir
    //returns the coord hit in world space
    raycast()
    {
        var pos = this.camera_controller.camera.position.clone();
        //console.log("CAMERA POS : ", pos.x, pos.y, pos.z);
        var dir = new Vector3();
        this.camera_controller.camera.getWorldDirection(dir);/*new Vector3(1,0,0);
        var angle = this.camera_controller.camera.quaternion.clone();
        //angle.invert();
        result.applyQuaternion(angle);*/

        //console.log("CAMERA DIR : ", result.x, result.y, result.z);

        //translate pos to voxel space
        //pos.divideScalar(this.scale);
        //pos.multiplyScalar(this.size);
		//console.log(pos);

        var result = this.grid.raycast([pos.x, pos.y, pos.z],[dir.x,dir.y, dir.z]);
        var transformation = new Vector3(
            (result[0]/this.size) * this.scale, 
            (result[1]/this.size) * this.scale, 
            (result[2]/this.size) * this.scale
        );

        //transformation.add(this.camera_controller.camera.position.clone());

        //console.log(result);

        this.brush.position.set(result[0], result[1], result[2]);
    }


    gen_rng_ground()
    {
        
        /*
        for(var z = 2; z < this.size-2; z++)
        {
            for(var y = 5; y < 6; y++)
            {
                for(var x = 2; x < this.size-2; x++)
                {
                    this.grid.setCell(x,y,z, Math.random() * 50);
                    //Math.random() * 20
                }
            }
        }*/

        

        for(var z = 2; z < this.size-2; z++)
        {
            for(var x = 2; x < this.size-2; x++)
            {
                this.grid.setCell(x,2,z, 50);
                this.grid.setCell(x,3,z, 50);
                this.grid.setCell(x,4,z, 50);
            }
        }

        for(var z = 0; z < 8; z++)
        {
            for(var x = 0; x < 8; x++)
            {
                this.grid.setCell(x,2,z, 0);
                this.grid.setCell(x,3,z, 0);
                this.grid.setCell(x,4,z, 0);
            }
        }

        for(var z = 8; z < 32; z++)
        {
            for(var x = 8; x < 32; x++)
            {
                this.grid.setCell(x,3,z, 0);
                this.grid.setCell(x,4,z, 0);
            }
        }
    }
    
    Update()
    {
        var result = this.raycast();
        
    }

    build_brush_cube()
    {
        const geometry = new BoxGeometry();
        const material_1 = new MeshStandardMaterial( { 
            color: 0x0000ff
        } );
        const cube = new Mesh( geometry, material_1 );
        this.scene.add(cube);
        this.brush = cube;
    }

    
}



