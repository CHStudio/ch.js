// CH JavaScript Framework

// This file is part of the CH JavaScript Framework.
// For the full copyright and license information, please view the LICENSE
// file that was distributed with this source code.

/**
 * Array manipulation object: Extend JavaScript native Array definition
 * @author Stephane HULARD <s.hulard@chstudio.fr>
 * @author Simon FREMAUX <simon.fremaux@gmail.com>
 * @copy CHStudio <www.chstudio.fr> 2013
 * @package native
 */
(function() {
	'use strict';

	//Define a CH namespace inside the native prototype to avoid method collision
	ch.define('ch.native.Array', function (module_) {

		module_ = function() {};

		/**
		 * Clone current object and return the new instance
		 * @param {Array} aArray Array to be processed
		 * @return Array
		 */
		module_.clone = function( aArray ) {
			var oClone = [];
			for ( var i = 0; i <  aArray.length; i++)
				oClone.push(aArray[i]);

			return oClone;
		};

		/**
		 * Max value accessor inside an array
		 * usable only if array contain numbers
		 * @param {Array} aArray Array to be processed
		 * @param {Mixed} mEntity Item to check existence
		 * @return Number
		 */
		module_.isIn = function( aArray, mEntity ) {
			return aArray.indexOf(mEntity) !== -1;
		};

		/**
		 * Max value accessor inside an array
		 * usable only if array contain numbers
		 * @param {Array} aArray Array to be processed
		 * @return Number
		 */
		module_.max = function( aArray ) {
			var mMax;
			for ( var i = 0; i < aArray.length; i++)
				if( parseInt(aArray[i], 10) > mMax || !mMax)
					mMax = parseInt(aArray[i], 10);

			return mMax;
		};

		/**
		 * Min value accessor inside an array
		 * usable only if array contain numbers
		 * @param {Array} aArray Array to be processed
		 * @return Number
		 */
		module_.min = function( aArray ) {
			var mMin;
			for ( var i = 0; i < aArray.length; i++)
				if( parseInt(aArray[i], 10) > mMin || !mMin)
					mMin = parseInt(aArray[i], 10);

			return mMin;
		};

		/**
		 * Random sort an Array
		 * @param {Array} aArray Array to be processed
		 */
		module_.shuffle = function(aArray) {
			var aResult = [];
			while( aArray.length )
				aResult.push(aArray.splice(Math.random() * aArray.length, 1));
			while( aResult.length )
				aArray.push(aResult.pop());
		};

		return module_;
	});
}).call(this);