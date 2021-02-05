import { Mesh, TextureLoader, MeshStandardMaterial, BufferGeometry, Float32BufferAttribute, NearestFilter, DoubleSide, MeshBasicMaterial, RepeatWrapping } from "../three.module.js";
import { top, left, right, front, back } from "./voxel_util.mjs";
//import { NaiveNet } from "./surfacenets.js";

import { MarchingCubes } from './MarchingCubes.js';

export class Ground
{
    constructor(size, scene, scale)
    {
        this.size = size;
        this.scene = scene;
        this.scale = scale;

        //load texture
        const loader = new TextureLoader();
        const texture = loader.load('./resources/grass_block_top.png');
        texture.magFilter = NearestFilter;
        texture.minFilter = NearestFilter;
        //texture.repeat = RepeatWrapping;

        this.material = new MeshStandardMaterial( {
            side: 2,
            //color : 0xffffff,
            map: texture,
            //wireframe : true
        } );


        this.grid = new MarchingCubes(this.size, this.material, true, false);


        this.grid.reset();

        this.gen_rng_ground();

        

        this.geometry = this.grid.generateBufferGeometry();

        

        this.mesh = new Mesh(this.geometry, this.material);

        this.mesh.position.set( 0, 0, 0 );
        this.mesh.scale.set( this.scale, this.scale, this.scale );

        this.mesh.castShadow = true; //default is false
        this.mesh.receiveShadow = true; //default
    }

    gen_rng_ground()
    {
        

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
        }

        for(var z = 2; z < this.size-2; z++)
        {
            for(var x = 2; x < this.size-2; x++)
            {
                this.grid.setCell(x,2,z, 50);
                this.grid.setCell(x,3,z, 50);
                this.grid.setCell(x,4,z, 50);
            }
        }
    }

    build()
    {
        const vertices = [];
        const normals = [];
        const indices = [];
        //const colors = [];
        const uvs = [];

        for(var z = 0; z < this.size; z++)
        {
            for(var x = 0; x < this.size; x++)
            {
                if(this.grid[x + (z * this.size)] > 0) continue;

                var first_index = (x + (z * this.size)) * 20;

                top(x,z,vertices,normals,uvs,indices, first_index);
                left(x,z,vertices,normals,uvs,indices, first_index + 4);
                right(x,z,vertices,normals,uvs,indices, first_index + 8);
                front(x,z,vertices,normals,uvs,indices, first_index + 12);
                back(x,z,vertices,normals,uvs,indices, first_index + 16);
            }
        }

        var geometry = new BufferGeometry();
        geometry.setIndex(indices);
        geometry.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
        //geometry.setAttribute( 'color', new Float32BufferAttribute(colors, 3 ) );
        geometry.setAttribute( 'normal', new Float32BufferAttribute(normals, 3 ) );

        geometry.setAttribute( 'uv', new Float32BufferAttribute(uvs, 2 ) );

        //geometry.computeFaceNormals();
        
        return geometry;
    }
}

