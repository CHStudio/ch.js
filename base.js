// CH JavaScript Framework

// This file is part of the CH JavaScript Framework.
// For the full copyright and license information, please view the LICENSE
// file that was distributed with this source code.

//Special thanks to Douglas CROCKFORD, jQuery, MooTools and RequireJS authors for a lot of inspiration

/**
 * @author Stéphane HULARD <s.hulard@chstudio.fr>
 * @copy CH Studio <www.chstudio.fr> 2012
 * @package default
 */
(function (window, document, navigator) {
	'use strict';
//------------------------------------------------------------------------------

	//JavaScript native types tests
	//-----------------------------

	//Global namespace
	//All objects will be attached to this item
	var ch;
	ch = window.ch = {};

	//Global navigator elements shortands
	ch.w = window;
	ch.d = document;

	//CH Framework can only be used inside the browser, send error if we aren't in
	if (!(ch.w !== undefined && navigator !== undefined && ch.d !== undefined)) {
		throw new Error("CH can't be used outside a brower!", "base.js", 27);
	}

	//Define current framework version
	ch.VERSION = '0.1';

	//Define native object that has been extended inside CH for dependency tests
	ch.NATIVE = [
		'Object', 
		'Number', 
		'Array', 
		'String'
	];

//------------------------------------------------------------------------------

	//JavaScript native types tests
	//-----------------------------

	//Native toString type definition
	var TYPES = {
		"[object Boolean]": "boolean",
		"[object Number]": "number",
		"[object String]": "string",
		"[object Function]": "function",
		"[object Array]": "array",
		"[object Date]": "date",
		"[object RegExp]": "regexp",
		"[object Object]": "object"
	};

	/**
	 * Native object type detection
	 * @see https://github.com/jquery/jquery/blob/master/src/core.js#L426
	 * @param {Mixed} obj Object to test
	 * @return String
	 */
	ch.typeOf = function (obj) {
		return !ch.isDefAndNotNull(obj) ?
			String(obj) :
			TYPES[Object.prototype.toString.call(obj)] || "object";
	};

//------------------------------------------------------------------------------

	//Dependecies loading management
	//Build private var and methods useful only for ch.require
	//--------------------------------------------------------
	/**
	 * Define a loading Queue to manage multiple level inheritance or dependencies
	 */
	var depsQueue = [];	//Waiting dependencies to validate

	/**
	 * Find the current basePath for loading all dependencies
	 * @return String
	 */
	var findBasePath_ = function () {
		//If basePath was found just get it
		if (ch.isDefAndNotNull(ch.basePath_)) {
			return ch.basePath_;
		}

		//Retrieve loaded script element
		var aScripts = ch.d.getElementsByTagName('script'),
			i = aScripts.length - 1,
			sSrc,
			iQmark,
			iLength;

		// Search backwards since the current script is in almost all cases the one
		// that has base.js.
		for (i; i >= 0; i -= 1) {
			sSrc = aScripts[i].src;
			iQmark = sSrc.lastIndexOf('?');
			iLength = iQmark === -1 ? sSrc.length : iQmark;

			if (sSrc.substr(iLength - 7, 7) === 'base.js') {
				ch.basePath_ = sSrc.substr(0, iLength - 7);
				return ch.basePath_;
			}
		}

		return false;
	};

	/**
	 * Check dependency loading and apply callback
	 */
	var depsCheckLoading_ = function () {
		//Backup current queue length
		var iStartLength = depsQueue.length,
			bLoaded,
			i = 0,
			j = 0;

		//Crawl the queue and check if an item as finish loading
		for (i = 0; i < depsQueue.length; i += 1) {
			bLoaded = true;
			if (ch.typeOf(depsQueue[i][0]) === 'string') {
				if (!ch.isAlive_(depsQueue[i][0])) {
					bLoaded = false;
				}
			} else {
				for (j = 0; j < depsQueue[i][0].length; j += 1) {
					if (!ch.isAlive_(depsQueue[i][0][j])) {
						bLoaded = false;
						break;
					}
				}
			}

			//If current item has been loaded, apply the callback
			if (bLoaded) {
				if (ch.typeOf(depsQueue[i][1]) === 'function') {
					//@FIXME Add a timeout before launch code that request dependency, is that the best way?
					window.setTimeout( depsQueue[i][1], 100);
					//Check dependency loading when object is loaded
					//Needed here because of setTimeout
					window.setTimeout( depsCheckLoading_, 100);
				}
				//Destroy current item from the queue to disable double call
				depsQueue.splice(i, 1);
			}
		}

		//If the queue has been reduced, call the function another time
		if (depsQueue.length !== iStartLength) {
			depsCheckLoading_();
		}
	};

	/**
	 * Require a namespace and create the script item from ch.basePath_
	 * @param {Mixed} mObject The namespace to load formed like "ch.base" or a namespace Array
	 * @param {Function} fnClosure Function that will be called when all dependencies are required
	 */
	ch.require = function (mObject, fnClosure) {
		if (mObject instanceof Array && mObject.length === 1) {
			mObject = mObject.shift();
		}

		//Build the loading queue to allow multiple depth dependencies
		depsQueue.push([mObject, fnClosure]);

		//If there is a namespace array, load all items
		if (mObject instanceof Array) {
			var iNb = mObject.length,
				i = 0,
				fnToLoop = function () {
					iNb--;
					if( iNb === 0 ) 
						depsCheckLoading_();
				};
				
			for( i = 0; i < iNb; i++ )
				ch.require(mObject[i], fnToLoop);
			return;
		}

		//In case of invalid parameter throw Message
		if (ch.typeOf(mObject) !== 'string') {
			throw new TypeError("Required namespace must be declared as a string!");
		}

		//If object has already been required just get it
		if (ch.NATIVE.indexOf(mObject) < 0) {
			if (ch.isAlive_(mObject)) {
				depsCheckLoading_();
			} else {
				//Else load the given script
				var aLevels = mObject.split('.');
				if (aLevels[0] === 'ch') {
					aLevels.shift();
				}

				ch.loadScript(
					findBasePath_() + aLevels.join('/') + '.js',
					function () {
						depsCheckLoading_();
					}
				);
			}
		} else if (ch.isAlive_(mObject + '.ch')) { //ch key is added to the object to tell that was already loaded
			depsCheckLoading_();
		}	else {
			ch.loadScript(
				findBasePath_() + 'native/' + mObject + '.js',
				function() { depsCheckLoading_(); }
			);
		}
	};

	/**
	 * Load a script element from its URL and register a closure for the onload event
	 * Totally inspired by the RequireJS req.load function
	 * @see https://github.com/jrburke/requirejs/blob/master/require.js -> req.load
	 * @param {String} sURL Script URL to load
	 * @param {Function} fnClosure OnLoad closure
	 * @param {Boolean} bRemoveNode True if loaded node need to be removed after loading
	 */
	ch.loadScript = function (sURL, fnClosure) {
		var	fnError = function () {
			},
			fnLoaded = function (oEvent) {
				var oNode = oEvent.currentTarget || oEvent.srcElement;

				if (oEvent.type === 'load' || (/^(complete|loaded)$/.test((oNode).readyState))) {
					ch.removeListener(oNode, fnLoaded, 'load', 'onreadystatechange');
					ch.removeListener(oNode, fnError, 'error');

					oNode.parentNode.removeChild(oNode);

					if (fnClosure) {
						fnClosure.call();
					}
				}
			},
			oScript;

		//Create a standard script element
		oScript = ch.d.createElement('script');
		oScript.type = 'text/javascript';
		oScript.defer = false;
		oScript.charset = 'utf-8';

		ch.addListener(oScript, fnLoaded, 'load', 'onreadystatechange');
		ch.addListener(oScript, fnError, 'error');
		//It would be great to add an error handler here to catch
		//404s in IE9+. However, onreadystatechange will fire before
		//the error handler, so that does not help. If addEvenListener
		//is used, then IE will fire error before load, but we cannot
		//use that pathway given the connect.microsoft.com issue
		//mentioned above about not doing the 'script execute,
		//then fire the script load event listener before execute
		//next script' that other browsers do.
		//Best hope: IE10 fixes the issues,
		//and then destroys all installs of IE 6-9.
		//node.attachEvent('onerror', context.onScriptError);

		//Append item to the current body
		oScript.src = sURL;
		ch.d.body.appendChild(oScript);
	};

//------------------------------------------------------------------------------

	//Object test existence and definition
	//------------------------------------

	/**
	 * Define a valid Object
	 * @param {String} sObject
	 */
	ch.define = function (sObject) {
		var oCurrent = ch.w,
			aParts = sObject.split('.'),
			iPart = 0;

		for (iPart; iPart < aParts.length; iPart += 1) {
			if (!ch.isDefAndNotNull(oCurrent[aParts[iPart]])) {
				oCurrent[aParts[iPart]] = {};
			}

			oCurrent = oCurrent[aParts[iPart]];
		}
	};

	/**
	 * Check if given object name is required
	 * @param {String} sObject The object to check formed like "ch.base"
	 * @return {Boolean} Whether namespace is required
	 */
	ch.isAlive_ = function (sObject) {
		var oCurrent = ch.w,
			aParts = sObject.split('.'),
			iPart = 0,
			bReturn = true;

		for (iPart; iPart < aParts.length; iPart += 1) {
			if (!ch.isDefAndNotNull(oCurrent[aParts[iPart]])) {
				bReturn = false;
				break;
			} else {
				oCurrent = oCurrent[aParts[iPart]];
			}
		}

		return bReturn;
	};

	/**
	 * Returns true if the specified value is defined and not null
	 * @param {Mixed} mVal Variable to test.
	 * @return {Boolean} Whether variable is defined and not null.
	 */
	ch.isDefAndNotNull = function (mVal) {
		// Note that undefined == null.
		return mVal !== null && mVal !== undefined;
	};

//------------------------------------------------------------------------------

	//Console logger compatibility
	//----------------------------

	/**
	 * Logger wrapper for disallowed console errors
	 * @TODO Add warn, info, error method capabilities
	 */
	ch.log = function () {
		var i = 0;
		if (window.console !== undefined && window.console.log !== undefined) {
			for (i; i < arguments.length; i += 1) {
				window.console.log(arguments[i]);
			}
		}
	};

	/**
	 * Build a unique identifier for current session
	 * Derived from Mootools uniqueID implementation
	 * @see https://github.com/mootools/mootools-core/blob/master/Source/Core/Core.js#L393
	 * @return String
	 */
	var UID = +(new Date());
	ch.uniqueID = function () {
		return (UID++).toString(36);
	};

//---------------------------------------------------------------------------------

	//DOM Event abstraction
	//---------------------

	//@TODO -> Define as Mootools a compatibility layer with browsers event names	to remove ieName
	//@TODO -> Add a new Method to the DOMElement to delete relation with ch.

	/**
	 * Remove the event listener from a given node
	 * @param {DOMElement} oNode DOMElement from which the event need to be removed
	 * @param {Function} fnCallback Listener function to remove
	 * @param {String} sName The standard event name
	 * @param {String} sIEName The Internet Explorer event name
	 */
	var isOpera = typeof window.opera !== 'undefined' && window.opera.toString() === '[object Opera]';
	ch.removeListener = function (oNode, fnCallback, sName, sIEName) {
		if (ch.typeOf(oNode.detachEvent) !== 'undefined' && !isOpera) {
			if (ch.typeOf(sIEName) !== 'undefined') {
				oNode.detachEvent(sIEName, fnCallback);
			} else {
				oNode.detachEvent(sName, fnCallback);
			}
		} else {
			oNode.removeEventListener(sName, fnCallback, false);
		}
	};

	/**
	 * Add an event listener on a given node
	 * @param {DOMElement} oNode DOMElement from which the event need to be added
	 * @param {Function} fnCallback Listener function to add
	 * @param {String} sName The event name
	 */
	ch.addListener = function (oNode, fnCallback, sName, sIEName) {
		//Set up load listener. Test attachEvent first because IE9 has
		//a subtle issue in its addEventListener and script onload firings
		//that do not match the behavior of all other browsers with
		//addEventListener support, which fire the onload event for a
		//script right after the script execution. See:
		//https://connect.microsoft.com/IE/feedback/details/648057/script-onload-event-is-not-fired-immediately-after-script-execution
		//UNFORTUNATELY Opera implements attachEvent but does not follow the script
		//script execution mode.
		if (ch.typeOf(oNode.attachEvent) !== 'undefined' &&
				//Check if node.attachEvent is artificially added by custom script or
				//natively supported by browser
				//read https://github.com/jrburke/requirejs/issues/187
				//if we can NOT find [native code] then it must NOT natively supported.
				//in IE8, node.attachEvent does not have toString()
				//Note the test for "[native code" with no closing brace, see:
				//https://github.com/jrburke/requirejs/issues/273
				!(oNode.attachEvent.toString && oNode.attachEvent.toString().indexOf('[native code') < 0) && !isOpera) {
			if (ch.typeOf(sIEName) !== 'undefined') {
				oNode.attachEvent(sIEName, fnCallback);
			} else {
				oNode.attachEvent(sName, fnCallback);
			}
		} else {
			oNode.addEventListener(sName, fnCallback, false);
		}
	};

//------------------------------------------------------------------------------

	//Standard Function Extension
	//---------------------------

	/**
	 * EcmaScript 5 Function bind implementation compatibility
	 * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
	 * @param {Function} oThis The object on which current function going to be binded
	 * @return Function
	 */
	if (!Function.prototype.bind) {
		Function.prototype.bind = function (oThis) {
			if (ch.typeOf(this) !== "function") {
				// closest thing possible to the ECMAScript 5 internal IsCallable function
				throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
			}

			var aArgs = Array.prototype.slice.call(arguments, 1),
				fnToBind = this,
				NOP = function () {},
				fnBound = function () {
					return fnToBind.apply(
						this instanceof NOP ? this : oThis || ch.w,
						aArgs.concat(Array.prototype.slice.call(arguments))
					);
				};

			NOP.prototype = this.prototype;
			fnBound.prototype = new NOP();

			return fnBound;
		};
	}

	/**
	 * Inheritance implementation based on the Google Closure implementation
	 * @see http://code.google.com/p/closure-library/source/browse/trunk/closure/goog/base.js?r=2
	 * @param {Function} fnParent The object to be inherited
	 * @return Function
	 */
	Function.prototype.inherits = function (fnParent) {
		/** @constructor */
		var Ctor = function () {};
		Ctor.prototype = fnParent.prototype;

		//Backup parent prototype to allow parent method calling
		this.super_ = fnParent.prototype;

		//Add inheritance
		this.prototype = new Ctor();
		this.prototype.constructor = this;

		return this;
	};

	/**
	 * The swiss method loops through the arguments.
	 * For each name, it copies a member from the parent's prototype to the new class's prototype
	 * @see http://www.crockford.com/javascript/inheritance.html
	 * @param {Function} parent The object to be inherited
	 * @return Function
	 */
	Function.prototype.swiss = function (parent) {
		var i = 1,
			name;
		for (i; i < arguments.length; i += 1) {
			name = arguments[i];
			this.prototype[name] = parent.prototype[name];
		}

		return this;
	};

//---------------------------------------------------------------------------------

	//Standard RegExp Extension
	//-------------------------

	/**
	 * Add escape method to RegExp object to allow escaping a String that will be regexized
	 * @param {String} s The string to escape
	 * @return String
	 */
	if (!RegExp.escape) {
		RegExp.escape = function (s) {
			return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
		};
	}

//---------------------------------------------------------------------------------

	//Standard Array Extension
	//------------------------

	/**
	 * Add Array.indexOf function if not present because used in the base.js (IE6 / IE7 / IE8)
	 * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
	 * @param {Object} searchElement The object to be checked
	 * @return Number
	 */
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function (searchElement, fromIndex) {
			if (!ch.isDefAndNotNull(this)) {
				throw new TypeError();
			}

			var t = Object(this),
				len = t.length >>> 0,
				n = 0,
				k;

			if (len === 0) {
				return -1;
			}

			if (arguments.length > 0) {
				n = Number(fromIndex);
				if (isNaN(n)) {	// shortcut for verifying if it's NaN
					n = 0;
				} else if (n !== 0 && n !== Infinity && n !== -Infinity) {
					n = (n > 0 || -1) * Math.floor(Math.abs(n));
				}
			}

			if (n >= len) {
				return -1;
			}

			k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
			for (k; k < len; k += 1) {
				if (t.hasOwnProperty(k) && t[k] === searchElement) {
					return k;
				}
			}

			return -1;
		};
	}
}.call(window, window, document, navigator));