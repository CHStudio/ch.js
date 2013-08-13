// CH JavaScript Framework

// This file is part of the CH JavaScript Framework.
// For the full copyright and license information, please view the LICENSE
// file that was distributed with this source code.

/**
 * 2D point representation
 *
 * @author Stéphane HULARD <s.hulard@chstudio.fr>
 * @copy CHStudio <www.chstudio.fr> 2013
 * @package math
 */
(function (ch) {
	'use strict';

	//Define object context
	ch.define('ch.math.Point', function (module_) {
		/**
		 * Constructor
		 * @param {Number} iX x position
		 * @param {Number} iY y position
		 * @return ch.math.Point
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
		 * Compute distance between current point and another point
		 * Use the Euler vector space formulas
		 * @param {ch.math.Point} oPoint
		 * @return Number
		 */
		module_.prototype.distanceTo = function( oPoint ) {
			if( !(oPoint instanceof ch.math.Point) )
				throw new TypeError( "Given Point is not a valid ch.math.Point object" );
				
			return Math.sqrt( Math.pow(oPoint.x()-this.x(), 2) + Math.pow(oPoint.y()-this.y(), 2) );
		};
		
		/**
		 * toString method for visible logging
		 * @return String
		 */
		module_.prototype.toString = function() {
			return "ch.math.Point:{\n\
  x: "+this.x()+",\n\
  y: "+this.y()+"\n\
}";
		};

		return module_;
	});
}).call(this, ch);