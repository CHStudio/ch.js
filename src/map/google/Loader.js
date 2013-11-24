// CH JavaScript Framework

// This file is part of the CH JavaScript Framework.
// For the full copyright and license information, please view the LICENSE
// file that was distributed with this source code.

/**
 * Google Map loader object, used to load asynchronously the GMap API
 * Developed for Gmap V3
 *
 * @author Stéphane HULARD <s.hulard@chstudio.fr>
 * @copy CH Studio <www.chstudio.fr> 2013
 * @package map.google
 */
(function (ch, window) {
	'use strict';

	//Define object context
	ch.define('ch.map.google');

	//Require dependency
	ch.require('ch.utils.Event', function() {
		/**
		 * Loader constructor
		 * If google map not already loaded, load the script with ch.loadScript method
		 * @return ch.map.google.Loader
		 */
		ch.map.google.Loader = function() {
			//If Google Map has not already been loaded, load asynchronous with callback parameter
			if( window.google === undefined || window.google.maps === undefined ) {
				var sCallBackName = "callback"+ch.uniqueID();
				ch.map.google.Loader[sCallBackName] = function () {
					this.say('map.google.loaded');
					delete ch.map.google.Loader[sCallBackName];
				}.bind(this);
				ch.load('http://maps.googleapis.com/maps/api/js?sensor=false&callback=ch.map.google.Loader.'+sCallBackName);
			//Else just tell by event Google Map is loaded
			} else {
				this.say('map.google.loaded');
			}

			return this;
		};

		//Extend Event
		ch.map.google.Loader.inherits( ch.utils.Event );
	});
}.call(this, ch, window));