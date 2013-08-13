// CH JavaScript Framework

// This file is part of the CH JavaScript Framework.
// For the full copyright and license information, please view the LICENSE
// file that was distributed with this source code.

/**
 * Video YouTube playlist: Load playlist and allow video display
 * @author Stéphane HULARD <s.hulard@chstudio.fr>
 * @copy CHStudio <www.chstudio.fr> 2013
 * @package video.youtube
 */
(function (ch) {
	ch.require(['ch.native.String','ch.utils.Event'], function() {
		//GData API url to retrieve videos inside a playlist
		var API_URL = "http://gdata.youtube.com/feeds/api/playlists/${id}?alt=json-in-script&max-results=${rows}&start-index=${start}&callback=${callback}";

		//Define object context
		ch.define('ch.video.youtube.Playlist', function (module_) {	
			/**
			 * Playlist constructor
			 * @param {String} sID Playlist identifier to manage
			 * @return ch.video.youtube.Playlist
			 */
			module_ = function (sID) {
				if (ch.typeOf(sID) !== "string") {
					throw new TypeError("Playlist ID need to be a valid String");
				}

				var 
					_id = sID,
					_rows = 50,
					_entries = [],
					_total = 0,
					_title = "",
					_subtitle = "",
					_updated;

				/**
				 * Playlist id property accessor
				 * @return String
				 */
				this.id = function () {
					return _id;
				};

				/**
				 * Entries property accessor
				 * @return Array
				 */
				this.entries = function () {
					return _entries;
				};

				/**
				 * Entries property accessor
				 * @return Array
				 */
				this.total = function () {
					return _total;
				};

				/**
				 * Title property accessor
				 * @return String
				 */
				this.title = function () {
					return _title;
				};

				/**
				 * Title property accessor
				 * @return String
				 */
				this.subtitle = function () {
					return _subtitle;
				};

				/**
				 * updated property accessor
				 * @return Date
				 */
				this.updated = function () {
					return _updated;
				};

				/**
				 * Load a playlist from YouTube API
				 * API Retrieve 50 videos per each call, this function call API multiple times to get all videos
				 * @return ch.video.youtube.Playlist
				 */
				this.load = function () {
					//Initialize loaded callback function
					//YouTube use a callback parameter to send JSON directly to JavaScript inside Callback function
					var sCallBackName = "callback"+ch.uniqueID();
					module_[sCallBackName] = function (data) {
						var i = 0,
								iStartIndex = parseInt(data.feed.openSearch$startIndex.$t,10);
						for(i; i < data.feed.entry.length; i += 1) {
							_entries[i+iStartIndex-1] = data.feed.entry[i];
						}

						_total = parseInt(data.feed.openSearch$totalResults.$t, 10);
						_title = data.feed.title.$t;
						_subtitle = data.feed.subtitle.$t;
						_updated = new Date(data.feed.updated.$t);

						/**
						 * @TODO Check why in the test playlist, total say 9 but feed length is 8...
						 */
						if( data.feed.entry.length == 50 && _entries.length < _total ) {
							fnLoad.call(this, iStartIndex+data.feed.entry.length);
							return false;
						}

						delete module_[sCallBackName];
						this.say('loaded');
						return true;
					}.bind(this);

					//Build Script URL and load it!
					var fnLoad = function(iFrom) {
						var iStart = ch.typeOf(iFrom)==='number'?iFrom:1,
								oOptions = {
									"id": _id,
									"rows": _rows,
									"start": iStart,
									"callback": "ch.video.youtube.Playlist."+sCallBackName
								};
						ch.load( ch.native.String.replaceVars( API_URL, oOptions, "${", "}" ) );
					};
					fnLoad.call();

					return this;
				};
			};
			//Add event capabilities to playlist
			module_.inherits(ch.utils.Event);

			return module_;
		});
	});
}.call(this, ch));