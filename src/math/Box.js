// CH JavaScript Framework

// This file is part of the CH JavaScript Framework.
// For the full copyright and license information, please view the LICENSE
// file that was distributed with this source code.

/*jshint multistr: true*/

/**
 * 2D box representation
 * Used for collision management and random point extraction
 *
 * @author Stéphane HULARD <s.hulard@chstudio.fr>
 * @copy CHStudio <www.chstudio.fr> 2013
 * @package math
 */
(function (ch) {
	'use strict';

	//Require dependencies
	ch.require('ch.math.Point', function() {
		ch.define('ch.math.Box', function (module_) {

			/**
			 * Constructor
			 * @param {ch.math.Point} oOrigin Box origin at the top left of the rectangle
			 * @param {Number} iX x offset for box size
			 * @param {Number} iY y offset for box size
			 * @return ch.math.Box
			 */
			module_ = function( oOrigin, iX, iY ) {
				//Private properties
				var xRange = { min: oOrigin.x(), max: oOrigin.x() + iX };
				var yRange = { min: oOrigin.y(), max: oOrigin.y() + iY };
			
				//Accessor to private properties
				this.xRange = function() { return xRange; };
				this.yRange = function() { return yRange; };
			};
			
			
			/**
			 * Check if a given point is inside the box
			 * @param {ch.math.Point} oPoint point to be checked
			 * @return Boolean
			 */
			module_.prototype.inside = function( oPoint ) { 
				if( !(oPoint instanceof ch.math.Point) )
					throw new TypeError('Given point is not a valid ch.math.Point object');
		
				var bReturn = false;
				if(
					oPoint.x() >= this.xRange().min && oPoint.x() <= this.xRange().max &&
					oPoint.y() >= this.yRange().min && oPoint.y() <= this.yRange().max
				) {
					bReturn = true;
				}
		
				return bReturn;
			};
		
			/**
			 * Get a random point inside the box
			 * @return ch.math.Point
			 */
			module_.prototype.getRandomPoint = function() {
				return new ch.math.Point(
					Math.round(((this.xRange().max - this.xRange().min) * Math.random()) + this.xRange().min),
					Math.round(((this.yRange().max - this.yRange().min) * Math.random()) + this.yRange().min)
				);
			};
			
			/**
			 * X range for current box as a {x: {min:, max:}, y: {min:, max:}} object
			 * @return Object
			 */
			module_.prototype.getRange = function() {
				return {
					x: this.xRange(), 
					y: this.yRange()
				};
			};
			
			/**
			 * toString method for visible logging
			 * @return String
			 */
			module_.prototype.toString = function() {
				return "ch.math.Box:{\n\
  x: {min: "+this.xRange().min+", max: "+this.xRange().max+"},\n\
  y: {min: "+this.yRange().min+", max: "+this.yRange().max+"}\n\
}";
			};

			return module_;
		});
	});
}).call(this, ch);