import {
	BufferAttribute,
	BufferGeometry,
	Color,
	ImmediateRenderObject,
	NoColors
} from '../three.module.js';

/**
 * Port of http://webglsamples.org/blob/blob.html
 */

var MarchingCubes = function ( resolution, material, enableUvs, enableColors ) {

	

	// functions have to be object properties
	// prototype functions kill performance
	// (tested and it was 4x slower !!!)

	this.init = function ( resolution ) {

		

	};

	this.end = function ( renderCallback ) {

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

	};

	/////////////////////////////////////
	// Metaballs
	/////////////////////////////////////

	// Adds a reciprocal ball (nice and blobby) that, to be fast, fades to zero after
	// a fixed distance, determined by strength and subtract.

	this.addBall = function ( ballx, bally, ballz, strength, subtract, colors ) {

		var sign = Math.sign( strength );
		strength = Math.abs( strength );
		var userDefineColor = ! ( colors === undefined || colors === null );
		var ballColor = new Color( ballx, bally, ballz );
		if ( userDefineColor ) {

			try {

				ballColor =
					colors instanceof Color
						? colors
						: Array.isArray( colors )
							? new Color(
								Math.min( Math.abs( colors[ 0 ] ), 1 ),
								Math.min( Math.abs( colors[ 1 ] ), 1 ),
								Math.min( Math.abs( colors[ 2 ] ), 1 )
						  )
							: new Color( colors );

			} catch ( err ) {

				ballColor = new Color( ballx, bally, ballz );

			}

		}

		// Let's solve the equation to find the radius:
		// 1.0 / (0.000001 + radius^2) * strength - subtract = 0
		// strength / (radius^2) = subtract
		// strength = subtract * radius^2
		// radius^2 = strength / subtract
		// radius = sqrt(strength / subtract)

		var radius = this.size * Math.sqrt( strength / subtract ),
			zs = ballz * this.size,
			ys = bally * this.size,
			xs = ballx * this.size;

		var min_z = Math.floor( zs - radius );
		if ( min_z < 1 ) min_z = 1;
		var max_z = Math.floor( zs + radius );
		if ( max_z > this.size - 1 ) max_z = this.size - 1;
		var min_y = Math.floor( ys - radius );
		if ( min_y < 1 ) min_y = 1;
		var max_y = Math.floor( ys + radius );
		if ( max_y > this.size - 1 ) max_y = this.size - 1;
		var min_x = Math.floor( xs - radius );
		if ( min_x < 1 ) min_x = 1;
		var max_x = Math.floor( xs + radius );
		if ( max_x > this.size - 1 ) max_x = this.size - 1;

		// Don't polygonize in the outer layer because normals aren't
		// well-defined there.

		var x, y, z, y_offset, z_offset, fx, fy, fz, fz2, fy2, val;
		for ( z = min_z; z < max_z; z ++ ) {

			z_offset = this.size2 * z;
			fz = z / this.size - ballz;
			fz2 = fz * fz;

			for ( y = min_y; y < max_y; y ++ ) {

				y_offset = z_offset + this.size * y;
				fy = y / this.size - bally;
				fy2 = fy * fy;

				for ( x = min_x; x < max_x; x ++ ) {

					fx = x / this.size - ballx;
					val = strength / ( 0.000001 + fx * fx + fy2 + fz2 ) - subtract;
					if ( val > 0.0 ) {

						this.field[ y_offset + x ] += val * sign;

						// optimization
						// http://www.geisswerks.com/ryan/BLOBS/blobs.html
						const ratio =
							Math.sqrt( ( x - xs ) * ( x - xs ) + ( y - ys ) * ( y - ys ) + ( z - zs ) * ( z - zs ) ) / radius;
						const contrib =
							1 - ratio * ratio * ratio * ( ratio * ( ratio * 6 - 15 ) + 10 );
						this.palette[ ( y_offset + x ) * 3 + 0 ] += ballColor.r * contrib;
						this.palette[ ( y_offset + x ) * 3 + 1 ] += ballColor.g * contrib;
						this.palette[ ( y_offset + x ) * 3 + 2 ] += ballColor.b * contrib;

					}

				}

			}

		}

	};

	this.addPlaneX = function ( strength, subtract ) {

		var x,
			y,
			z,
			xx,
			val,
			xdiv,
			cxy,
			// cache attribute lookups
			size = this.size,
			yd = this.yd,
			zd = this.zd,
			field = this.field,
			dist = size * Math.sqrt( strength / subtract );

		if ( dist > size ) dist = size;

		for ( x = 0; x < dist; x ++ ) {

			xdiv = x / size;
			xx = xdiv * xdiv;
			val = strength / ( 0.0001 + xx ) - subtract;

			if ( val > 0.0 ) {

				for ( y = 0; y < size; y ++ ) {

					cxy = x + y * yd;

					for ( z = 0; z < size; z ++ ) {

						field[ zd * z + cxy ] += val;

					}

				}

			}

		}

	};

	this.addPlaneY = function ( strength, subtract ) {

		var x,
			y,
			z,
			yy,
			val,
			ydiv,
			cy,
			cxy,
			// cache attribute lookups
			size = this.size,
			yd = this.yd,
			zd = this.zd,
			field = this.field,
			dist = size * Math.sqrt( strength / subtract );

		if ( dist > size ) dist = size;

		for ( y = 0; y < dist; y ++ ) {

			ydiv = y / size;
			yy = ydiv * ydiv;
			val = strength / ( 0.0001 + yy ) - subtract;

			if ( val > 0.0 ) {

				cy = y * yd;

				for ( x = 0; x < size; x ++ ) {

					cxy = cy + x;

					for ( z = 0; z < size; z ++ ) field[ zd * z + cxy ] += val;

				}

			}

		}

	};

	this.addPlaneZ = function ( strength, subtract ) {

		var x,
			y,
			z,
			zz,
			val,
			zdiv,
			cz,
			cyz,
			// cache attribute lookups
			size = this.size,
			yd = this.yd,
			zd = this.zd,
			field = this.field,
			dist = size * Math.sqrt( strength / subtract );

		if ( dist > size ) dist = size;

		for ( z = 0; z < dist; z ++ ) {

			zdiv = z / size;
			zz = zdiv * zdiv;
			val = strength / ( 0.0001 + zz ) - subtract;
			if ( val > 0.0 ) {

				cz = zd * z;

				for ( y = 0; y < size; y ++ ) {

					cyz = cz + y * yd;

					for ( x = 0; x < size; x ++ ) field[ cyz + x ] += val;

				}

			}

		}

	};

	

	

	this.init( resolution );

};

MarchingCubes.prototype = Object.create( ImmediateRenderObject.prototype );
MarchingCubes.prototype.constructor = MarchingCubes;

s