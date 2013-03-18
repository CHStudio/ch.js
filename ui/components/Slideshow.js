// CH JavaScript Framework

// This file is part of the CH JavaScript Framework.
// For the full copyright and license information, please view the LICENSE
// file that was distributed with this source code.

/**
 * Slideshow component definition
 * This object does not manipulate any DOMElement, just build a Slideshow process
 * - Init animation duration
 * - Init idle duration
 * - Use events to notify change.start and change.end which are binded with this
 *
 * @author Stéphane HULARD <s.hulard@chstudio.fr>
 * @copy CH Studio <www.chstudio.fr> 2013
 * @package ui
 * @subpackage components
 */
(function(ch, window) {
	'use strict';

	//Slideshow Manager
	ch.define('ch.ui.components');

	ch.require('ch.utils.Event', function() {
		/**
		 * ch.ui.components.Slideshow constructor
		 * @return ch.ui.components.Slideshow
		 */
		ch.ui.components.Slideshow = function( iNbSlides ) {
			if( ch.typeOf(iNbSlides) !== 'number' )
				throw new TypeError("Slide number need to be a valid Number");

			//Private vars
			var 
				_iCurrent = 0,					//Current slide id in collection
				_iPrevious,							//Element before the current is the last at beginning
				_iTotal = iNbSlides,		//Total number of slides
				_iInterval,							//Interval id if auto mode is enabled
				_isAnimating = false,		//True if slider is animating
				_iAnimDuration = 750,		//Animation duration in msec
				_iIdleDuration = 5000;	//Idle duration between animation in auto mode

			/**
			 * Show a slide
			 * If no index go to the +1 slide
			 * @return ch.ui.components.Slideshow
			 */
			var fnShow = function( iIndex ) {
				var 
					iCurrent = _iCurrent,
					iDirection,
					iBefore;
						
				//Go to next element and slide it at the 0 position
				if( ch.typeOf(iIndex) === 'number' ) {
					if( iIndex >= 0 && iIndex < _iTotal ) {
						_iCurrent = iIndex;
					} else if( iIndex < 0 ) {
						_iCurrent = _iTotal - 1;
					} else if( iIndex >= _iTotal ) {
						_iCurrent = 0;
					}
				} else if( ++_iCurrent === _iTotal ) {
					_iCurrent = 0;
				}

				//Move current element to the left
				_isAnimating = true;
				iDirection = (iIndex !== undefined?(iIndex>iCurrent?1:((iIndex===iCurrent)?0:-1)):1);

				iBefore = iCurrent-iDirection;
				if( iBefore === _iTotal ) {
					iBefore = 0;
				} else if( iBefore < 0 ) {
					iBefore = _iTotal - 1;
				}

				//current, next, before, direction
				this.say('change.start', [iCurrent, _iCurrent, iBefore, iDirection, _iPrevious]);
				window.setTimeout(function() {
					_isAnimating = false;
					this.say('change.end', [iCurrent, _iCurrent, iBefore, iDirection, _iPrevious]);
					_iPrevious = iCurrent;
				}.bind(this), _iAnimDuration);

				return this;
			};

			/**
			 * Go to a specific slide with automatic scrolling management
			 * @param {Number} iIndex Slide index to show
			 * @return ch.ui.components.Slideshow
			 */
			this.goTo = function( iIndex ) {
				var bPlaying = this.isPlaying();
				if( bPlaying ) this.disableAuto();
				fnShow.call(this, iIndex);
				if( bPlaying ) this.enableAuto();
			};

			/**
			 * Activate automatic animation mode
			 * Go through slides one by one
			 * @return ch.ui.components.Slideshow
			 */
			this.enableAuto = function() {
				_iInterval = window.setInterval(fnShow.bind(this), _iAnimDuration+_iIdleDuration);
				this.say('action.enableAuto');
				return this;
			};

			/**
			 * Deactivate automatic animation mode
			 * @return ch.ui.components.Slideshow
			 */
			this.disableAuto = function() {
				_iInterval = window.clearInterval(_iInterval);
				this.say('action.disableAuto');
				return this;
			};
			
			/**
			 * Check if autmatic mode is active or not
			 * @return Boolean
			 */
			this.isPlaying = function() {
				return _iInterval !== undefined;
			};

			/**
			 * Set animation duration
			 * @param {Number} iDuration The new animation duration in milliseconds
			 * @return ch.ui.components.Slideshow
			 */
			this.setAnimationDuration = function( iDuration ) {
				if( ch.typeOf(iDuration) !== 'number' || iDuration < 0 )
					throw new TypeError('Duration given need to be a valid Number > 0');

				_iAnimDuration = iDuration;
				this.say('property.changed.animDuration', _iAnimDuration);
				return this;
			};

			/**
			 * Set idle between animation duration
			 * @param {Number} iDuration The new idle duration in milliseconds
			 * @return ch.ui.components.Slideshow
			 */
			this.setIdleDuration = function( iDuration ) {
				if( ch.typeOf(iDuration) !== 'number' || iDuration < 0 )
					throw new TypeError('Duration given need to be a valid Number > 0');

				_iIdleDuration = iDuration;
				this.say('property.changed.idleDuration', _iIdleDuration);
				return this;
			};

			/**
			 * Current property accessor
			 * @return Number
			 */
			this.current = function() {
				return _iCurrent;
			};

			/**
			 * Total property accessor
			 * @return Number
			 */
			this.total = function() {
				return _iTotal;
			};

			/**
			 * isAnimated property accessor
			 * @return Boolean
			 */
			this.isAnimating = function() {
				return _isAnimating;
			};

			/**
			 * idleDuration property accessor
			 * @return Number
			 */
			this.idleDuration = function() {
				return _iIdleDuration;
			};

			/**
			 * animationDuration property accessor
			 * @return Number
			 */
			this.animDuration = function() {
				return _iAnimDuration;
			};
		};
		//Allow the use of events on Slideshow UI object
		ch.ui.components.Slideshow.inherits(ch.utils.Event);
	});
}.call(this, ch, window));