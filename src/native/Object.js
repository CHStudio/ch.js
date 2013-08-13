// CH JavaScript Framework

// This file is part of the CH JavaScript Framework.
// For the full copyright and license information, please view the LICENSE
// file that was distributed with this source code.

/**
 * Object: Extend JavaScript native Object definition without modifying prototype
 * @author Stéphane HULARD <s.hulard@chstudio.fr>
 * @copy CHStudio <www.chstudio.fr> 2013
 * @package native
 */
(function() {
	'use strict';

	//Add some tools functions on objects without overriding base definition
	ch.define('ch.native.Object', function (module_) {

		//Define result as object
		module_ = function() {};

		/**
		 * Object cloning method
		 * @param {Object} oRoot Object to clone
		 * @return Object
		 */
		module_.clone = function(oRoot) {
			var oClone = {};
			for (var key in oRoot)
				switch( typeof oRoot[key] ) {
					case 'array':
						oClone[key] = oRoot[key].clone();
						break;
					case 'object':
						oClone[key] = Object.duplicate(oRoot[key]);
						break;
					default:
						oClone[key] = oRoot[key];
						break;
				}

			return oClone;
		};

		/**
		 * Object merge method
		 * if a data exists in oBase and oComplement, it will be replaced on oBase by the oComplement value
		 * if there are new data in oComplement, they will be added in oBase
		 * @param {Object} oBase Object that will be filled with the complement
		 * @param {Object} oComplement Object which contain new data to be injected inside oBase
		 * @return Object
		 */
		module_.merge = function(oBase, oComplement) {
			for (var key in oComplement)
				switch( typeof oComplement[key] ) {
					case 'array':
						oBase[key] = oComplement[key].clone();
						break;
					case 'object':
						oBase[key] = module_.clone(oComplement[key]);
						break;
					default:
						oBase[key] = oComplement[key];
						break;
				}

			return oBase;
		};
		
		/**
		 * Wipe a given object to allow a valid reuse (memory performance)
		 * @param {Object} oToWipe Object to be cleaned
		 * @return Object
		 */
		module_.wipe = function (oToWipe) {
			for (var p in oToWipe)
				if (oToWipe.hasOwnProperty(p))
					delete oToWipe[p];
					
			return oToWipe;
		};

		return module_;
	});

}).call(this);