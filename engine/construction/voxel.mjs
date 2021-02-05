import { BoxGeometry, TextureLoader, MeshStandardMaterial, NearestFilter, Mesh } from "../three.module.js";

const loader = new TextureLoader();
const texture = loader.load('./resources/acacia_planks.png');
texture.magFilter = NearestFilter;
texture.minFilter = NearestFilter;

const cube_geometry = new BoxGeometry(1,1,1);


const material = new MeshStandardMaterial( 
{ 
    map : texture
} );

const model_atlas = [
    new Mesh(cube_geometry, material),
];


export class Voxel
{
    constructor(size, scene)
    {
        this.size = size;
        this.grid = new Array(size * size * size).fill(0);

        this.object_grid = new Array(size * size * size);

        this.rng_generate();
        this.scene = scene;
        this.build();
    }

    rng_generate()
    {
        for(var x = 0; x < this.size; x++)
        {
            for(var y = 0; y < this.size; y++)
            {
                for(var z = 0; z < this.size; z++)
                {
                    this.grid[get_flat_index(x,y,z,this.size)] = Math.floor(Math.random() * 2) ;  
                }
            }
        }
    }

    build()
    {
        for(var x = 0; x < this.size; x++)
        {
            for(var y = 0; y < this.size; y++)
            {
                for(var z = 0; z < this.size; z++)
                {
                    var value = this.grid[get_flat_index(x,y,z,this.size)];
                    if(value > 0) continue;
                    var new_box = model_atlas[value].clone();

                    new_box.castShadow = true; //default is false
                    new_box.receiveShadow = true; //default

                    new_box.position.set(x,y,z);
                    this.scene.add(new_box);
                }
            }
        }
    }

}

function get_flat_index(x,y,z, size){ return x + (y * size) + (z * size * size) };