import { BufferGeometry, BufferAttribute, ImmediateRenderObject, Object3D, Vector3 } from "../three.module.js";
import { polygonize, concatenate } from "./marching_cubes_util.mjs";
import { traceRay } from "./fast_voxel_raycast.mjs";


export class Voxel extends ImmediateRenderObject
{
    constructor(resolution, material, enableUvs, enableColors)
    {
		super(material);

		this.boundary_threshold = 3;
        //ImmediateRenderObject.call( this, material );
		//this.material = material;

        var scope = this;

        // temp buffers used in polygonize

        this.vlist = new Float32Array( 12 * 3 );
        this.nlist = new Float32Array( 12 * 3 );
        this.clist = new Float32Array( 12 * 3 );

        this.enableUvs = enableUvs !== undefined ? enableUvs : false;
        this.enableColors = enableColors !== undefined ? enableColors : false;

        this.resolution = resolution;

		// parameters

		this.isolation = 1.0;

		// size of field, 32 is pushing it in Javascript :)

		this.size = resolution;
		this.size2 = this.size * this.size;
		this.size3 = this.size2 * this.size;
		this.halfsize = this.size / 2.0;

		// deltas

		this.delta = 2.0 / this.size;
		this.yd = this.size;
		this.zd = this.size2;

		this.field = new Float32Array( this.size3 );
		this.normal_cache = new Float32Array( this.size3 * 3 );
		this.palette = new Float32Array( this.size3 * 3 );

		// immediate render mode simulator

		this.maxCount = 4096; // TODO: find the fastest size for this buffer
		this.count = 0;

		this.hasPositions = false;
		this.hasNormals = false;
		this.hasColors = false;
		this.hasUvs = false;

		this.positionArray = new Float32Array( this.maxCount * 3 );
		this.normalArray = new Float32Array( this.maxCount * 3 );

		if ( this.enableUvs ) this.uvArray = new Float32Array( this.maxCount * 2 );

		if ( this.enableColors ) this.colorArray = new Float32Array( this.maxCount * 3 );
    }

    end( renderCallback ) 
    {
		if ( this.count === 0 ) return;

		for ( var i = this.count * 3; i < this.positionArray.length; i ++ ) {

			this.positionArray[ i ] = 0.0;

		}

		this.hasPositions = true;
		this.hasNormals = true;

		if ( this.enableUvs && this.material.map ) {

			this.hasUvs = true;

		}

		if ( this.enableColors && this.material.vertexColors !== NoColors ) {

			this.hasColors = true;

		}

		renderCallback( this );

	}

    /////////////////////////////////////
	// Updates
	/////////////////////////////////////

	setCell( x, y, z, value ) 
    {
		var index = this.size2 * z + this.size * y + x;
		this.field[ index ] = value;
	}

	subtractCell(x,y,z, sub, brush_size)
	{
		//if the coord is out of bounds return undefined
		if(x < this.boundary_threshold || y < this.boundary_threshold || z < this.boundary_threshold 
			|| x > this.size-this.boundary_threshold || y > this.size-this.boundary_threshold || z > this.size-this.boundary_threshold ) return false;

		for(var x_i = x-brush_size; x_i < x + brush_size; x_i++ )
		{
			for(var z_i = z-brush_size; z_i < z + brush_size; z_i++ )
			{
				for(var y_i = y-brush_size; y_i < y + brush_size; y_i++ )
				{
					if(x_i < this.boundary_threshold || y_i < this.boundary_threshold || z_i < this.boundary_threshold 
						|| x_i > this.size-this.boundary_threshold || y_i > this.size-this.boundary_threshold || z_i > this.size-this.boundary_threshold ) continue;

					var distance = new Vector3(x_i, y_i, z_i).distanceTo(new Vector3(x,y,z));

					var index = this.size2 * z_i + this.size * y_i + x_i;
					var current_value = this.field[index];

					this.field[index] = Math.min((sub/distance) + current_value, 2);
				}
			}
		}

		return true;
		/*
		//var index = this.size2 * z + this.size * y + x;
		var value = this.field[index];

		//minimum of zero for an index just to keep things clean
		//this.field[ index ] = Math.max(0, value - sub);

		this.field[index] = value + sub;
		return true;*/
	}

	getCell( x, y, z ) 
    {
		var index = this.size2 * z + this.size * y + x;
		return this.field[ index ];
	}

	blur( intensity ) 
    {

		if ( intensity === undefined ) intensity = 1;

		var field = this.field;
		var fieldCopy = field.slice();
		var size = this.size;
		var size2 = this.size2;
		for ( var x = 0; x < size; x ++ ) {

			for ( var y = 0; y < size; y ++ ) {

				for ( var z = 0; z < size; z ++ ) {

					var index = size2 * z + size * y + x;
					var val = fieldCopy[ index ];
					var count = 1;

					for ( var x2 = - 1; x2 <= 1; x2 += 2 ) {

						var x3 = x2 + x;
						if ( x3 < 0 || x3 >= size ) continue;

						for ( var y2 = - 1; y2 <= 1; y2 += 2 ) {

							var y3 = y2 + y;
							if ( y3 < 0 || y3 >= size ) continue;

							for ( var z2 = - 1; z2 <= 1; z2 += 2 ) {

								var z3 = z2 + z;
								if ( z3 < 0 || z3 >= size ) continue;

								var index2 = size2 * z3 + size * y3 + x3;
								var val2 = fieldCopy[ index2 ];

								count ++;
								val += intensity * ( val2 - val ) / count;

							}

						}

					}

					field[ index ] = val;

				}

			}

		}

	}

    reset() 
    {
		var i;

		// wipe the normal cache

		for ( i = 0; i < this.size3; i ++ ) {

			this.normal_cache[ i * 3 ] = 0.0;
			this.field[ i ] = 0.0;
			this.palette[ i * 3 ] = this.palette[ i * 3 + 1 ] = this.palette[
				i * 3 + 2
			] = 0.0;

		}
	}

	reset_cache() 
    {
		// wipe the normal cache

		for (var i = 0; i < this.size3; i ++ ) {

			this.normal_cache[ i * 3 ] = 0.0;
			//this.field[ i ] = 0.0;
			this.palette[ i * 3 ] = this.palette[ i * 3 + 1 ] = this.palette[
				i * 3 + 2
			] = 0.0;

		}
	}

	render = function( renderCallback ) 
    {
		
        var scope = this;

		this.count = 0;

		this.hasPositions = false;
		this.hasNormals = false;
		this.hasUvs = false;
		this.hasColors = false;

		// Triangulate. Yeah, this is slow.

		var smin2 = this.size - 2;

		for ( var z = 1; z < smin2; z ++ ) {

			var z_offset = this.size2 * z;
			var fz = ( z - this.halfsize ) / this.halfsize; //+ 1

			for ( var y = 1; y < smin2; y ++ ) {

				var y_offset = z_offset + this.size * y;
				var fy = ( y - this.halfsize ) / this.halfsize; //+ 1

				for ( var x = 1; x < smin2; x ++ ) {

					var fx = ( x - this.halfsize ) / this.halfsize; //+ 1
					var q = y_offset + x;

					polygonize( fx, fy, fz, q, this.isolation, renderCallback, scope );

				}

			}

		}

		this.end( renderCallback );

	}

	generateBufferGeometry(){

		var geo = new BufferGeometry();
		var posArray = new Float32Array();
		var normArray = new Float32Array();
		var colorArray = new Float32Array();
		var uvArray = new Float32Array();
		var scope = this;

		var geo_callback = function ( object ) {

			if ( scope.hasPositions )
				posArray = concatenate(
					posArray,
					object.positionArray,
					object.count * 3
				);
			if ( scope.hasNormals )
				normArray = concatenate(
					normArray,
					object.normalArray,
					object.count * 3
				);
			if ( scope.hasColors )
				colorArray = concatenate(
					colorArray,
					object.colorArray,
					object.count * 3
				);
			if ( scope.hasUvs )
				uvArray = concatenate( uvArray, object.uvArray, object.count * 2 );

			object.count = 0;

		};

		this.render( geo_callback );

		if ( this.hasPositions )
			geo.setAttribute( 'position', new BufferAttribute( posArray, 3 ) );
		if ( this.hasNormals )
			geo.setAttribute( 'normal', new BufferAttribute( normArray, 3 ) );
		if ( this.hasColors )
			geo.setAttribute( 'color', new BufferAttribute( colorArray, 3 ) );
		if ( this.hasUvs )
			geo.setAttribute( 'uv', new BufferAttribute( uvArray, 2 ) );

		return geo;

	}

	is_cell_filled(x,y,z)
	{
		//if the coord is out of bounds return undefined
		if(x < 0 || y < 0 || z < 0 || x > this.size || y > this.size || z > this.size ) return null;

		//otherwise return the value
		var index = this.size2 * z + this.size * y + x;
		var value = this.field[ index ];
		return value < this.isolation ? null : value;
	}

	raycast(pos, dir)
	{
		var that = this;

		var hit_pos = [], hit_norm = [];
		var result = traceRay(this.is_cell_filled.bind(this), 
		pos, dir, 100, hit_pos, hit_norm);

		//console.log("HIT: " + result);

		return hit_pos;

		
	}

}