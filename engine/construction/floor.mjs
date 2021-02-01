import { BufferGeometry, Mesh, MeshPhongMaterial, TextureLoader, BufferAttribute  } from "../three.module.js";

export class Floor
{
    constructor(size)
    {
        this.size = size;
        this.grid = new Array(size * size).fill(0);
        this.geometry = new BufferGeometry();


        const loader = new TextureLoader();
        const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/star.png');

        this.material = new MeshPhongMaterial({color: 0xFF8888, map: texture});

        this.build_tile(1,1,0);

        this.mesh = new Mesh(this.geometry, this.material);
    }

    build()
    {
        for(var x = 0; x < this.size; x++)
            for(var z = 0; z < this.size; z++)
                this.build_tile(x,y,value);

        
    }

    build_tile(x,z,value)
    {
        const vertices = new Float32Array( [
            -1.0, -1.0,  1.0,
             1.0, -1.0,  1.0,
             1.0,  1.0,  1.0,
        
             1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0, -1.0,  1.0
        ] );

        this.geometry.setAttribute( 'position', new BufferAttribute( vertices, 3 ) );

        /*this.geometry.faces.push(
            // front
            new THREE.Face3(0, 3, 2),
            new THREE.Face3(0, 1, 3),
            // right
            new THREE.Face3(1, 7, 3),
            new THREE.Face3(1, 5, 7),
            // back
            new THREE.Face3(5, 6, 7),
            new THREE.Face3(5, 4, 6),
            // left
            new THREE.Face3(4, 2, 6),
            new THREE.Face3(4, 0, 2),
            // top
            new THREE.Face3(2, 7, 6),
            new THREE.Face3(2, 3, 7),
            // bottom
            new THREE.Face3(4, 1, 0),
            new THREE.Face3(4, 5, 1),
          );

          this.geometry.faceVertexUvs[0].push(
            // front
            [ new THREE.Vector2(0, 0), new THREE.Vector2(1, 1), new THREE.Vector2(0, 1) ],
            [ new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1) ],
            // right
            [ new THREE.Vector2(0, 0), new THREE.Vector2(1, 1), new THREE.Vector2(0, 1) ],
            [ new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1) ],
            // back
            [ new THREE.Vector2(0, 0), new THREE.Vector2(1, 1), new THREE.Vector2(0, 1) ],
            [ new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1) ],
            // left
            [ new THREE.Vector2(0, 0), new THREE.Vector2(1, 1), new THREE.Vector2(0, 1) ],
            [ new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1) ],
            // top
            [ new THREE.Vector2(0, 0), new THREE.Vector2(1, 1), new THREE.Vector2(0, 1) ],
            [ new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1) ],
            // bottom
            [ new THREE.Vector2(0, 0), new THREE.Vector2(1, 1), new THREE.Vector2(0, 1) ],
            [ new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1) ],
        );*/

        this.geometry.computeFaceNormals();

        
    }
}