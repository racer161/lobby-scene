import { Mesh, TextureLoader, MeshStandardMaterial, NearestFilter, RepeatWrapping, Vector2, Vector3, BoxGeometry, Camera } from "../three.module.js";
import { Voxel } from './voxel.mjs';

export class Ground
{
    constructor(size, scene, scale, mouse_input, camera_controller)
    {
        this.camera_controller = camera_controller;
        this.mouse_input = mouse_input;

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

        scene.add(this.grid);


        this.grid.reset();

        this.gen_rng_ground();

        var half_scale = this.scale/2;
        this.grid.position.set( half_scale, half_scale, half_scale);
        this.grid.scale.set( half_scale, half_scale, half_scale );

        this.build_brush_cube();

        this.brush_position = new Vector3();
        this.brush_size = 4;
        this.brush_strength = 1;
    }

    //this function takes two vector3s pos and dir
    //returns the coord hit in world space
    raycast()
    {
        var pos = this.camera_controller.camera.position.clone();
        
        var dir = new Vector3();
        this.camera_controller.camera.getWorldDirection(dir);

        var result = this.grid.raycast([pos.x, pos.y, pos.z],[dir.x,dir.y, dir.z]);

        var ceil_result = result.map(x => Math.ceil(x));

        var transformed_result = result.map(x => (x/this.size) * this.scale);

        /*var transformation = new Vector3(
            (result[0]/this.size) * this.scale, 
            (result[1]/this.size) * this.scale, 
            (result[2]/this.size) * this.scale
        );*/

        //transformation.add(this.camera_controller.camera.position.clone());

        //console.log(ceil_result);
        this.brush_position.set(ceil_result[0], ceil_result[1], ceil_result[2]);

        

        this.brush.position.set(transformed_result[0], transformed_result[1], transformed_result[2]);
    }


    gen_rng_ground()
    {
        for(var z = 2; z < this.size-2; z++)
        {
            for(var x = 2; x < this.size-2; x++)
            {
                this.grid.setCell(x,2,z, 50);
                this.grid.setCell(x,3,z, 50);
                this.grid.setCell(x,4,z, 50);
            }
        }

        /*
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
        }*/
    }

    reset()
    {
        this.grid.reset();
        this.gen_rng_ground();
    }
    
    Update()
    {
        this.raycast();
        if(this.mouse_input.button_state[0]) this.grid.subtractCell(this.brush_position.x, this.brush_position.y, this.brush_position.z, this.brush_strength,this.brush_size);
        //this.grid.reset_cache();
        //this.mesh.geometry = this.grid.generateBufferGeometry();
        
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



