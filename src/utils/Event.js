// CH JavaScript Framework

// This file is part of the CH JavaScript Framework.
// For the full copyright and license information, please view the LICENSE
// file that was distributed with this source code.

/**
 * Event: Add event capabilities to inherited objects
 * @author Stéphane HULARD <s.hulard@chstudio.fr>
 * @copy CH Studio <www.chstudio.fr> 2013
 * @package utils
 */
(function (ch) {
	'use strict';

	//Define object context
	ch.define('ch.utils.Event', function (module_) {
		/**
		 * ch.utils.Event constructor
		 * @return ch.utils.Event
		 */
		module_ = function () {};
		
		/**
		 * Observe method for listening some events on a given object
		 * @param {String} sName Event name to listen
		 * @param {Function} fnClosure Closure to be executed
		 */
		module_.prototype.observe = function (sName, fnClosure) {
			//If event container is not defined, juste define it
			if (this.events_ === undefined) {
				this.events_ = {};
			}
			//If the closure parameter is not a function stop now, it's not necessary
			if (ch.typeOf(fnClosure) !== 'function') {
				return;
			}

			//Add event to event collection
			this.events_[sName] = (this.events_[sName] || []);
			this.events_[sName].push( fnClosure );
		};

		/**
		 * Leave method for stop listening some events on a given object
		 * @param {String} sName Event name to listen
		 * @param {Function} fnClosure Closure to be executed
		 */
		module_.prototype.leave = function (sName, fnClosure) {
			var iIndex, aEvents;

			//If there is no event to leave just do nothing
			if (typeof this.events_ == 'undefined') {
				return;
			}
			//If closure parameter is not defined delete all listeners
			if (typeof fnClosure == 'undefined') {
				delete this.events_[sName];
			} else { //Else remove only the given listener
				aEvents = this.events_[sName];
				if (aEvents) {
					iIndex =  aEvents.indexOf(fnClosure);
					if (iIndex != -1) {
						delete aEvents[iIndex];
					}
				}
			}
		};

		/**
		 * Say method to dispatch an event by crying it :)
		 * @param {String} sName Event name to dispatched
		 * @param {Array} aArguments Parameters that will be passed to event function
		 */
		module_.prototype.say = function (sName, aArguments) {
			//If there is not listener register, nothing to say
			if (typeof this.events_ == 'undefined') {
				return;
			}
			if (typeof this.events_[sName] == 'undefined') {
				return;
			}
			//If argument given are not array... just make it as an array
			if( !(aArguments instanceof Array) ) {
				aArguments = [aArguments];
			}

			//If there are listeners, just cry to be heard by all of them!!
			var i = 0;
			for (i; i < this.events_[sName].length; i += 1) {
				this.events_[sName][i].apply(this,aArguments);
			}
		};

		return module_;
	});
}.call(this, ch));