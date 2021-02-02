import { BufferGeometry, Mesh, MeshPhongMaterial, TextureLoader, BufferAttribute, Float32BufferAttribute, DoubleSide, MeshStandardMaterial, NearestFilter  } from "../three.module.js";

export class Floor
{
    constructor(size, material)
    {
        this.size = size;
        this.grid = new Array(size * size).fill(0);
        this.geometry = this.build();


        const loader = new TextureLoader();
        const texture = loader.load('./resources/acacia_planks.png');
        texture.magFilter = NearestFilter;

        this.material = new MeshStandardMaterial( {
            side: DoubleSide,
            map: texture
        } );

        this.build();

        this.mesh = new Mesh(this.geometry, this.material);
    }

    build()
    {
        const vertices = [];
        const normals = [];
        const indices = [];
        const colors = [];
        const uvs = [];

        for(var z = 0; z <= this.size; z++)
        {
            for(var x = 0; x <= this.size; x++)
            {
                vertices.push(x,0,z);

                normals.push( 0, 1, 0 );

                uvs.push(x/this.size,z/this.size);

                const r = ( x / this.size ) + 0.5;
				const g = ( z / this.size ) + 0.5;

				colors.push( r, g, 1 );
            }
        }

        for ( let i = 0; i < this.size; i ++ ) {

            for ( let j = 0; j < this.size; j ++ ) {

                const a = i * ( this.size + 1 ) + ( j + 1 );
                const b = i * ( this.size + 1 ) + j;
                const c = ( i + 1 ) * ( this.size + 1 ) + j;
                const d = ( i + 1 ) * ( this.size + 1 ) + ( j + 1 );

                // generate two faces (triangles) per iteration

                indices.push( a, b, d ); // face one
                indices.push( b, c, d ); // face two

            }

        }

        var geometry = new BufferGeometry();
        geometry.setIndex(indices);
        geometry.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
        geometry.setAttribute( 'color', new Float32BufferAttribute(colors, 3 ) );
        geometry.setAttribute( 'normal', new Float32BufferAttribute(normals, 3 ) );

        geometry.setAttribute( 'uv', new Float32BufferAttribute(uvs, 2 ) );

        geometry.computeFaceNormals();
        
        return geometry;
    }

    build_tile(x,z,value)
    {
        const vertices = [];
        vertices.push(-1.0, -1.0,  1.0);
        vertices.push(1.0, -1.0,  1.0);
        vertices.push(1.0,  1.0,  1.0);

        console.log(vertices);

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