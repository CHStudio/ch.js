// CH JavaScript Framework

// This file is part of the CH JavaScript Framework.
// For the full copyright and license information, please view the LICENSE
// file that was distributed with this source code.

/**
 * Browser: Detect current browser and current version
 * This script is given by www.quirksmode.org website
 * @see http://www.quirksmode.org/js/detect.html
 * @author Stéphane HULARD <s.hulard@chstudio.fr>
 * @copy CH Studio <www.chstudio.fr> 2013
 * @package utils
 */
(function (ch, navigator, window) {
	'use strict';

	//Define object context
	ch.define('ch.utils.Browser', function( module_ ) {
		//Detection parameters
		//Maybe a newer version can be found at quirckmode
		var data = {
			BROWSER : [
				{
					string: navigator.userAgent,
					subString: "Chrome",
					identity: "Chrome"
				},
				{ 
					string: navigator.userAgent,
					subString: "OmniWeb",
					versionSearch: "OmniWeb/",
					identity: "OmniWeb"
				},
				{
					string: navigator.vendor,
					subString: "Apple",
					identity: "Safari",
					versionSearch: "Version"
				},
				{
					prop: window.opera,
					identity: "Opera",
					versionSearch: "Version"
				},
				{
					string: navigator.vendor,
					subString: "iCab",
					identity: "iCab"
				},
				{
					string: navigator.vendor,
					subString: "KDE",
					identity: "Konqueror"
				},
				{
					string: navigator.userAgent,
					subString: "Firefox",
					identity: "Firefox"
				},
				{
					string: navigator.vendor,
					subString: "Camino",
					identity: "Camino"
				},
				{		// for newer Netscapes (6+)
					string: navigator.userAgent,
					subString: "Netscape",
					identity: "Netscape"
				},
				{
					string: navigator.userAgent,
					subString: "MSIE",
					identity: "Explorer",
					versionSearch: "MSIE"
				},
				{
					string: navigator.userAgent,
					subString: "Gecko",
					identity: "Mozilla",
					versionSearch: "rv"
				},
				{	// for older Netscapes (4-)
					string: navigator.userAgent,
					subString: "Mozilla",
					identity: "Netscape",
					versionSearch: "Mozilla"
				}
			],
			OS : [
				{
					string: navigator.platform,
					subString: "Win",
					identity: "Windows"
				},
				{
					string: navigator.platform,
					subString: "Mac",
					identity: "Mac"
				},
				{
					string: navigator.userAgent,
					subString: "iPhone",
					identity: "iPhone/iPod"
				},
				{
					string: navigator.platform,
					subString: "Linux",
					identity: "Linux"
				}
			]
		};

	//------------------------------------------------------------------------------
		var fnSearchString = function (data) {
			for (var i=0;i<data.length;i++)	{
				var dataString = data[i].string;
				var dataProp = data[i].prop;
				this.versionSearchString = data[i].versionSearch || data[i].identity;
				if (dataString) {
					if (dataString.indexOf(data[i].subString) != -1)
						return data[i].identity;
				}
				else if (dataProp)
					return data[i].identity;
			}
		};
		var fnSearchVersion = function (dataString) {
			var index = dataString.indexOf(this.versionSearchString);
			if (index == -1) return;
			return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
		};

	//------------------------------------------------------------------------------
		var 
			_browser, 
			_version, 
			_OS;

		/**
		 * ch.utils.Browser module constructor
		 * Define global property accessors
		 */
		module_ = function () {
			if( _browser === undefined || _version === undefined || _OS === undefined ) {
				this.constructor.detect();
			}

			this.name = function() {
				return _browser;
			};
			this.version = function() {
				return _version;
			};
			this.OS = function() {
				return _OS;
			};
		};

		/**
		 * Detect current browser version based on data object
		 * "Unknown" string is set if browser information can't be detected
		 * @return ch.utils.Browser
		 */
		module_.detect = function() {
			_browser = fnSearchString(data.BROWSER) || "Unknown";
			_version = fnSearchVersion(navigator.userAgent) || fnSearchVersion(navigator.appVersion) || "Unknown";
			_OS = fnSearchString(data.OS) || "Unknown";

			return new module_;
		};

		return module_
	});
}.call(this, ch, navigator, window));