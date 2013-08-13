// CH JavaScript Framework

// This file is part of the CH JavaScript Framework.
// For the full copyright and license information, please view the LICENSE
// file that was distributed with this source code.

/**
 * Video YouTube player: Simplify player API management
 * Use both iFrame and SWF API if the brower is does not support iframe (IE6 & IE7)
 * @see https://developers.google.com/youtube/iframe_api_reference
 * @see https://developers.google.com/youtube/js_api_reference
 * @author Stéphane HULARD <s.hulard@chstudio.fr>
 * @copy CHStudio <www.chstudio.fr> 2013
 * @package video.youtube
 */
(function (ch) {
	ch.require(['ch.utils.Browser', 'ch.utils.Event'], function() {
		ch.define('ch.video.youtube.Player', function (module_) {
			var oBrowser = new ch.utils.Browser();

			var bIframe = true;
			if( oBrowser.name() === "Explorer" && oBrowser.version() <= 7 ) {
				bIframe = false;
			}

			/**
			 * YouTube player constructor
			 * Make abstraction on SWF and iframe player utilisation
			 * @param {String} sID DOMElement id to use as container for the player. Player will replace the div by itself
			 * @param {Number} iHeight Player height in pixel
			 * @param {Number} iWidth Player width in pixel
			 * @param {String} sVideoID Video to be loaded after player initialisation
			 *
			 * @TODO Make input possibilities and validation more flexible
			 */
			module_ = function ( sID, iHeight, iWidth, sVideoID ) {
				if( ch.typeOf(sID) !== 'string' ) {
					throw new TypeError('ID given need to be a valid string that point to a valid element');
				}
				if( ch.typeOf(iWidth) !== 'number' ) {
					throw new TypeError('Width given need to be a valid number');
				}
				if( ch.typeOf(iHeight) !== 'number' ) {
					throw new TypeError('Height given need to be a valid number');
				}
				if( ch.typeOf(sVideoID) !== 'string' ) {
					throw new TypeError('VideoID given need to be a valid string');
				}

				//Youtube player instance, will receive control calls
				var _player;

				//Load Player in iFrame mode
				if( bIframe ) {
					if( window.YT === undefined ) {
						ch.load("//www.youtube.com/iframe_api");
						var backFunction, self = this;
						if( ch.typeOf(window.onYouTubeIframeAPIReady) === 'function' ) {
							backFunction = window.onYouTubeIframeAPIReady;
						}
						window.onYouTubeIframeAPIReady = function() {
							self.say('video.youtube.player.apiloaded');
							if( backFunction !== undefined ) {
								backFunction.call();
								window.onYouTubeIframeAPIReady = backFunction;
							} else {
								delete window.onYouTubeIframeAPIReady;
							}
						};
					} else {
						this.say('video.youtube.player.apiloaded');
					}
				//Or in swfobject mode
				} else {
					if( window.swfobject === undefined ) {
						ch.load(
							"//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js",
							function() { 
								this.say('video.youtube.player.apiloaded');
							}.bind(this));
					} else {
						this.say('video.youtube.player.apiloaded');
					}
				}

				//Process when player api is loaded
				this.observe('video.youtube.player.apiloaded', function() {
					//Initialize iFrame
					if( bIframe ) {
						var sCallBackName = "callback"+ch.uniqueID();
						module_[sCallBackName] = function () {
							this.say('video.youtube.player.ready');
							delete module_[sCallBackName];
						}.bind(this);
						_player = new YT.Player(sID, {
							height: iHeight,
							width: iWidth,
							videoId: sVideoID,
							events: {
								'onReady': module_[sCallBackName]
							}
						});
					//Load SWFObject
					} else {
						var backFunction, self = this;
						if( ch.typeOf(window.onYouTubePlayerReady) === 'function' ) {
							backFunction = window.onYouTubePlayerReady;
						}
						window.onYouTubePlayerReady = function() {
							alert('here');
							_player = document.getElementById(sID);
							self.say('video.youtube.player.ready');
							if( backFunction !== undefined ) {
								backFunction.call();
								window.onYouTubePlayerReady = backFunction;
							} else {
								delete window.onYouTubePlayerReady;
							}
						};

						var params = { allowScriptAccess: "always", allowFullScreen: "true" };
						var atts = { id: sID };
						swfobject.embedSWF(
							"http://www.youtube.com/v/"+sVideoID+"?enablejsapi=1&playerapiid=ytplayer&version=3",
							sID,
							iWidth,
							iHeight,
							"8",
							null,
							null,
							params,
							atts
						);
					}
				});

				/**
				 * Load a video by Youtube ID
				 */
				this.loadVideoById = function( sID ) {
					if( ch.typeOf(sID) !== 'string' ) {
						throw new TypeError('Video ID given need to be a valid String');
					}
					_player.loadVideoById(sID);
				};

				/**
				 * Play current video
				 */
				this.play = function() {
					_player.playVideo();
				};

				/**
				 * Pause current video
				 */
				this.pause = function() {
					_player.pauseVideo();
				};

				/**
				 * Stop current video
				 */
				this.stop = function() {
					_player.stopVideo();
				};

				/**
				 * True if current player is an iframe player
				 * @return Boolean
				 */
				this.isIframe = function() {
					return bIframe;
				};
			};

			//Add event capabilities on player
			module_.inherits(ch.utils.Event);

			return module_;
		});
	});
}.call(this, ch));