// CH JavaScript Framework

// This file is part of the CH JavaScript Framework.
// For the full copyright and license information, please view the LICENSE
// file that was distributed with this source code.

/**
 * Google Map manager object, used a singleton
 * Developed for Gmap V3
 *
 * @author Nicolas Grandgirard <ngrandgirard@agenceinteractive.com>
 * @author Stéphane HULARD <s.hulard@gmail.com>
 * @copy Agence Interactive
 * @package map.google
 */
(function (ch) {
	'use stritc';

	//Define object context
	ch.define('ch.map.google');
	
	//Require dependencies
	ch.require(['google.maps.Map', 'google.maps.LatLng', 'google.maps.MapTypeId'], function() {
		/**
		 * Map constructor
		 * @return ch.map.google.Map
		 */
		ch.map.google.Map = function( oElement, oOptions ) {
			google.maps.Map.call(this, oElement, oOptions);
		};
		
		ch.map.google.Map.inherits( google.maps.Map );
	});
}.call(this, ch));