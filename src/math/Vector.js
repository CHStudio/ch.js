// CH JavaScript Framework

// This file is part of the CH JavaScript Framework.
// For the full copyright and license information, please view the LICENSE
// file that was distributed with this source code.

/**
 * 2D vector representation
 *
 * @author Stéphane HULARD <s.hulard@chstudio.fr>
 * @copy CHStudio <www.chstudio.fr> 2013
 * @package math
 */
(function (ch) {
	'use strict';

	//Define object context
	ch.define('ch.math.Vector', function (module_) {

		/**
		 * Constructor
		 * @param {Number} iX x position
		 * @param {Number} iY y position
		 * @return ch.math.Vector
		 */
		module_ = function( iX, iY ) {
			if( typeof iX != "number" )
				throw new TypeError( "Given X value is not an Number" );
			if( typeof iY != "number" )
				throw new TypeError( "Given Y value is not an Number" );
				
			var x = iX;
			var y = iY;
			
			/**
			 * X Property accessor
			 * @return Number
			 */
			this.x = function(iX) { 
				if( typeof iX != "undefined" )
					if( typeof iX != "number" ) 
						throw new TypeError( "Given X value is not an Number" );
					else
						x = iX; 

				return x; 
			};
		
			/**
			 * Y Property accessor
			 * @return Number
			 */
			this.y = function(iY) { 
				if( typeof iY != "undefined" )
					if( typeof iY != "number" )
						throw new TypeError( "Given Y value is not an Number" );
					else 
						y = iY; 
						
				return y; 
			};
		};
			
		/**
		 * Compute a new vector by vector substraction
		 * Use the Euler vector space formulas
		 * @param {ch.math.Vector} oVector
		 * @return ch.math.Vector
		 */
		module_.prototype.substract = function( oVector ) {
			if( !(oVector instanceof ch.math.Vector) )
				throw new TypeError( "Given Vector is not a valid ch.math.Vector object" );
				
			return new ch.math.Vector(
				this.x() - oVector.x(),
				this.y() - oVector.y()
			);
		};
		
		/**
		 * toString method for visible logging
		 * @return String
		 */
		module_.prototype.toString = function() {
			return "ch.math.Vector:{\n\
  x: "+this.x()+",\n\
  y: "+this.y()+"\n\
}"
		};
	});
}).call(this, ch);