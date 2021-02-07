
//CONVENIENCE FUNCTIONS
//pushes all the geometry necessary to create the faces of a voxel cube
export function left(x, z, vertices, normals, uvs, indices, first_index)
{
    vertices.push(x,0,z+1);//0
    vertices.push(x,0,z);//1
    vertices.push(x,1,z + 1);//2
    vertices.push(x, 1, z);//3

    push_normals(-1,0,0,normals);
    push_uvs(uvs);
    push_indices(indices, first_index);
}
//pushes right side of voxel
export function right(x, z, vertices, normals, uvs, indices, first_index)
{
    vertices.push(x+1,0,z);//0
    vertices.push(x+1,0,z+1);//1
    vertices.push(x+1,1,z);//2
    vertices.push(x+1,1,z + 1);//3

    push_normals(1,0,0,normals);
    push_uvs(uvs);
    push_indices(indices, first_index);
}
//pushes top of voxel
export function top(x, z, vertices, normals, uvs, indices, first_index)
{
    vertices.push(x,1,z);//0
    vertices.push(x + 1,1,z);//1
    vertices.push(x,1,z + 1);//2
    vertices.push(x + 1, 1, z + 1);//3

    push_normals(0,1,0, normals);
    push_uvs(uvs);
    push_indices(indices, first_index);
}

//pushes front of voxel
export function front(x, z, vertices, normals, uvs, indices, first_index)
{
    vertices.push(x + 1, 0, z + 1);//0
    vertices.push(x,0,z + 1);//1
    vertices.push(x + 1, 1, z + 1);//2
    vertices.push(x,1,z + 1);//3

    push_normals(0,0,1, normals);
    push_uvs(uvs);
    push_indices(indices, first_index);
}

//pushes back of voxel
export function back(x, z, vertices, normals, uvs, indices, first_index)
{
    vertices.push(x,0,z);//0
    vertices.push(x + 1,0,z);//1
    vertices.push(x,1,z);//2
    vertices.push(x + 1,1,z);//3

    push_normals(0,0,-1, normals);
    push_uvs(uvs);
    push_indices(indices, first_index);
}


//functions for pushing all the attributes of this voxel
function push_normals(x,y,z, normals)
{
    normals.push( x,y,z );
    normals.push( x,y,z );
    normals.push( x,y,z );
    normals.push( x,y,z );
}

function push_uvs(uvs)
{
    uvs.push(0,0);
    uvs.push(1,0);
    uvs.push(0,1);
    uvs.push(1,1);
}
function push_indices(indices, first_index)
{
    indices.push(first_index, first_index + 2, first_index + 1);
    indices.push(first_index + 1, first_index+2, first_index +3);
}

/*
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
}*/
function get_flat_index(x,y,z, size){ return x + (y * size) + (z * size * size) };