// CH JavaScript Framework

// This file is part of the CH JavaScript Framework.
// For the full copyright and license information, please view the LICENSE
// file that was distributed with this source code.

/**
 * Number manipulation object: Extend JavaScript native Number definition
 * @author Stéphane HULARD <s.hulard@chstudio.fr>
 * @copy CHStudio <www.chstudio.fr> 2013
 * @package native
 */
(function (ch) {
	'use strict';
	
	//Require dependencies
	ch.require('ch.native.String', function() {
		//Define number module
		ch.define('ch.native.Number', function (module_) {
			/**
			 * Forces the string representing an Number to have numberOfDigits digits at least, by prepending zeroes
			 * @param {Number} iNumber The number to be processed
			 * @param {Number} iDigits The minimum number of digits you want
			 * @return String
			 */
			ch.native.Number.forceDigits = function (iNumber, iDigits) {
				return ch.native.String.forceDigits( iNumber.toString(), iDigits );
			};	
		});	
	});
}.call(this, ch));