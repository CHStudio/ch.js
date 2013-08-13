// CH JavaScript Framework

// This file is part of the CH JavaScript Framework.
// For the full copyright and license information, please view the LICENSE
// file that was distributed with this source code.

/**
 * Date manipulation object: Extend native JavaScript date implementation
 * @author Simon FREMAUX <simon.fremaux@gmail.com>
 * @author Stéphane HULARD <s.hulard@chstudio.fr>
 * @copy CH Studio <www.chstudio.fr> 2012
 */
(function(){
	//Define utils package
	ch.define('ch.native.Date', function( module_ ) {;

		/**
		 * module_ constructor
		 * @param {Number} iYear
		 * @param {Number} iMonth
		 * @param {Number} iDay
		 * @param {Number} iHour
		 * @param {Number} iMinute
		 * @param {Number} iSecond
		 * @param {Number} iMilliSecond
		 * @return ch.native.Date
		 */
		module_ = function( iYear, iMonth, iDay, iHour, iMinute, iSecond, iMilliSecond ) {
			var date = new Date();
			if( typeof iYear != 'undefined' ) this.setYear(iYear);
			if( typeof iMonth != 'undefined' ) this.setMonth(iMonth);
			if( typeof iDay != 'undefined' ) this.setDay(iDay);
			if( typeof iHour != 'undefined' ) this.setHours(iHour);
			if( typeof iMinute != 'undefined' ) this.setMinutes(iMinute);
			if( typeof iSecond != 'undefined' ) this.setSeconds(iSecond);
			if( typeof iMilliSecond != 'undefined' ) this.setMilliSeconds(iMilliSecond);

			/**
			 * Year getter
			 * Native Date getFullYear method extension
			 * @return Number
			 */
			this.getYear = function() {
				return date.getFullYear();
			};
			/**
			 * Year setter
			 * Native Date setFullYear method extension
			 * @param {Number} iYear
			 */
			this.setYear = function( iYear ) {
				date.setFullYear(iYear);
			};
		
			/**
			 * Month getter
			 * Native Date getMonth method extension
			 * @return Number
			 */
			this.getMonth = function() {
				return date.getMonth();
			};
			/**
			 * Month setter
			 * Native Date setMonth method extension
			 * @param {Number} iMonth
			 */
			this.setMonth = function( iMonth ) {
				date.setMonth(iMonth);
			};
		
			/**
			 * Day getter
			 * Native Date getDate method extension
			 * @return Number
			 */
			this.getDay = function() {
				return date.getDate();
			};
			/**
			 * Day setter
			 * Native Date setDate method extension
			 * @param {Number} iDay
			 */
			this.setDay = function( iDay ) {
				date.setDate(iDay);
			};
		
			/**
			 * Hours getter
			 * Native Date getHours method extension
			 * @return Number
			 */
			this.getHours = function() {
				return date.getHours();
			};
			/**
			 * Hours setter
			 * Native Date setHours method extension
			 * @param {Number} iHours
			 */
			this.setHours = function( iHours ) {
				date.setHours(iHours);
			};
		
			/**
			 * Minutes getter
			 * Native Date getMinutes method extension
			 * @return Number
			 */
			this.getMinutes = function() {
				return date.getMinutes();
			};
			/**
			 * Minutes setter
			 * Native Date setMinutes method extension
			 * @param {Number} iMinutes
			 */
			this.setMinutes = function( iMinutes ) {
				date.setMinutes(iMinutes);
			};
		
			/**
			 * Seconds getter
			 * Native Date getSeconds method extension
			 * @return Number
			 */
			this.getSeconds = function() {
				return date.getSeconds();
			};
			/**
			 * Seconds setter
			 * Native Date setSeconds method extension
			 * @param {Number} iSeconds
			 */
			this.setSeconds = function( iSeconds ) {
				date.setSeconds(iSeconds);
			};
		
			/**
			 * MilliSeconds getter
			 * Native Date getMilliseconds method extension
			 * @return Number
			 */
			this.getMilliSeconds = function() {
				return date.getMilliseconds();
			};
			/**
			 * MilliSeconds setter
			 * Native Date setMilliseconds method extension
			 * @param {Number} iMilliSeconds
			 */
			this.setMilliSeconds = function( iMilliSeconds ) {
				date.setMilliseconds(iMilliSeconds);
			};
		
			/**
			 * Week day getter
			 * Native Date getDay method extension
			 * @return Number
			 */
			this.getWeekDay = function() {
				return date.getDay();
			};
			/**
			 * Week day setter
			 * Native Date setTime method extension
			 * @param {Number} iWeekDay
			 */
			this.setWeekDay = function( iWeekDay ) {
				date.setDay(iWeekDay);
			};
		
			/**
			 * Timestamp getter
			 * Native Date getTime method extension
			 * WARNING: Get the time in milliseconds (in PHP it's seconds)
			 * @return Number
			 */
			this.getTime = function() {
				return date.getTime();
			};
			/**
			 * Timestamp setter
			 * Native Date setTime method extension
			 * WARNING: Set the time in milliseconds (in PHP it's seconds)
			 * @param {Number} iTimeStamp
			 */
			this.setTime = function( iTimeStamp ) {
				var iTimezone = date.getTimezoneOffset();
				date.setTime(iTimeStamp);

				//If there is an hour gap (in france for example), add it
				if (iTimezone !== date.getTimezoneOffset()) {
					date.setTime( this.getTime() + ( -1 * (iTimezone - date.getTimezoneOffset()) * 60 * 1000 ));
				}
			};
			
			/**
			 * String representation for current module_ object
			 * Based on Date.toString method
			 * @return String
			 */
			this.toString = function() {
				return date.toString();
			};
			
			return this;
		};

		/**
		 * Global method to build module_ from a native Date object
		 * @param {Date} oDate Date to be adopted
		 * @return ch.native.Date
		 */
		module_.adopt = function( oDate ) {
			if( !(oDate instanceof Date) )
				throw new TypeError("module_ can only adopt valid Date objects");

			return new module_(
				oDate.getFullYear(),
				oDate.getMonth(),
				oDate.getDate(),
				oDate.getHours(),
				oDate.getMinutes(),
				oDate.getSeconds(),
				oDate.getMilliseconds()
			);
		};
		
		/**
		 * Clone current object and return the new instance
		 * @return ch.native.Date
		 */
		module_.prototype.clone = function() {
			var oClone = new module_(
				this.getYear(),
				this.getMonth(),
				this.getDay(),
				this.getHours(),
				this.getMinutes(),
				this.getSeconds(),
				this.getMilliSeconds()
			);
			return oClone;
		};

		/**
		 * Static method to get current day at current hour
		 * @return ch.native.Date
		 */
		module_.now = function () {
			return new module_();
		};

		/**
		 * Static method to get a Date object initialized at Today (set 00:00:00)
		 * @return ch.native.Date
		 */
		module_.today = function() {
			return module_.now().clearTime();
		};
		
		/**
		 * Resets the time of this Date object to 12:00 AM (00:00), which is the start of the day.
		 * @return ch.native.Date
		 */
		module_.prototype.clearTime = function () {
			this.setHours(0);
			this.setMinutes(0);
			this.setSeconds(0);
			this.setMilliSeconds(0);
			return this;
		};

		/**
		 * Orient Day search to the past
		 * @return ch.native.Date
		 */
		module_.prototype.previous = function() {
			this.timeDirection = -1;
			return this;
		};

		/**
		 * Orient Day search to the future
		 * @return ch.native.Date
		 */
		module_.prototype.next = function() {
			this.timeDirection = 1;
			return this;
		};

		/**
		 * Set the week day in the right direction
		 * @param {Number} iDay The day number in the week (monday = 1, sunday = 7)
		 * @return ch.native.Date
		 */
		module_.prototype.day = function( iDay ) {
			this.setTime(this.getTime() + ( ( 7 * this.timeDirection + ( iDay - this.getWeekDay() )) % 7 ) * 24 *60 * 60 * 1000);
			return this;
		};

		/**
		 * Monday accessor based on current search orientation
		 * If search orientation is not defined, future is used by default
		 * @return ch.native.Date
		 */
		module_.prototype.monday = function() {
			return this.day(1);
		};

		/**
		 * Tuesday accessor based on current search orientation
		 * If search orientation is not defined, future is used by default
		 * @return ch.native.Date
		 */
		module_.prototype.tuesday = function() {
			return this.day(2);
		};

		/**
		 * Wednesday accessor based on current search orientation
		 * If search orientation is not defined, future is used by default
		 * @return ch.native.Date
		 */
		module_.prototype.wednesday = function() {
			return this.day(3);
		};

		/**
		 * Thursday accessor based on current search orientation
		 * If search orientation is not defined, future is used by default
		 * @return ch.native.Date
		 */
		module_.prototype.thursday = function() {
			return this.day(4);
		};

		/**
		 * Friday accessor based on current search orientation
		 * If search orientation is not defined, future is used by default
		 * @return ch.native.Date
		 */
		module_.prototype.friday = function() {
			return this.day(5);
		};

		/**
		 * Saturday accessor based on current search orientation
		 * If search orientation is not defined, future is used by default
		 * @return ch.native.Date
		 */
		module_.prototype.saturday = function() {
			return this.day(6);
		};

		/**
		 * Sunday accessor based on current search orientation
		 * If search orientation is not defined, future is used by default
		 * @return ch.native.Date
		 */
		module_.prototype.sunday = function() {
			return this.day(7);
		};

		/**
		 * Check if current year is a leap year or not
		 * @return Boolean
		 */
		module_.prototype.isLeap = function() {
			var bReturn = false;
			var iYear = this.getYear();
			if( iYear%4 === 0 || iYear % 400 === 0 )
				bReturn = true;

			return bReturn;
		};

		/**
		 * Get the last day number in current month
		 * @return Number
		 */
		module_.prototype.getLastDayInMonth = function() {
			var aDays = [ 31, this.isLeap()?29:28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
			return aDays[this.getMonth()];
		};

		/**
		 * Get current week period based on today (previous monday & next sunday)
		 * @return Array
		 */
		module_.prototype.getWeekPeriod = function() {
			return [
				this.clone().previous().monday(),
				this.clone().next().sunday()
			];
		};

		/**
		 * Get current Month period based on date object month
		 * @return Array
		 */
		module_.prototype.getMonthPeriod = function() {
			return [
				new module_( this.getYear(), this.getMonth(), 1 ),
				new module_( this.getYear(), this.getMonth(), this.getLastDayInMonth() )
			];
		};

		/**
		 * Get year period based on date object year 01/01 -> 31/12
		 * @return Array
		 */
		module_.prototype.getYearPeriod = function() {
			return [
				new module_( this.getYear(), 0, 1 ),
				new module_( this.getYear(), 11, 31 )
			];
		};

		/**
		 * Add some days to current date
		 * @param {Number} nDays
		 * @return ch.native.Date
		 */
		module_.prototype.addDay = function(nDays) {
			if( nDays )
				this.setTime(this.getTime() + nDays * 24 * 60 * 60 * 1000);
			else
				throw new TypeError("You need to give a day number to add to current Date 'nDays'");

			return this;
		};

		/**
		 * Add some month to current date
		 * @param {Number} nMonth
		 * @return ch.native.Date
		 */
		module_.prototype.addMonth = function(nMonth) {
			if( nMonth )
			{
				var iMonth = this.getMonth();
				if( iMonth + nMonth > 11 )
					this.setYear( parseInt(this.getYear(),10) + Math.ceil( ( iMonth + nMonth ) / 12 ) );

				this.setMonth((iMonth + nMonth)%12);
			}
			else
				throw new TypeError("You need to give a month number to add to current Date 'nMonth'");

			return this;
		};

		/**
		 * Add some year to current date
		 * @param {Number} nYear
		 * @return ch.native.Date
		 */
		module_.prototype.addYear = function(nYear) {
			if( nYear )
				this.setYear( this.getYear() + nYear );
			else
				throw new TypeError("You need to give a year number to add to current Date 'nYear'");

			return this;
		};

		/**
		 * Compare two dates and return true if they are equals
		 * @param {ch.native.Date} oDate
		 * @param {Boolean} bSimpleEqual if true, equal only compare Year / Month / Day, if not compare milliseconds from 01/01/1970
		 * @return Boolean
		 */
		module_.prototype.equals = function( oDate, bSimpleEqual ) {
			bSimpleEqual = bSimpleEqual||false;
			var bReturn = false;

			if( !(oDate instanceof module_) )
				oDate = module_.adopt(oDate);
			if( bSimpleEqual )
				bReturn = this.getDay() == oDate.getDay() && this.getMonth() == oDate.getMonth() && this.getYear() == oDate.getYear();
			else
				bReturn = this.getTime() == oDate.getTime();

			return bReturn;
		};

		/**
		 * Compare two dates and return true if the given is lesser than the current
		 * @param {ch.native.Date} oDate
		 * @return Boolean
		 */
		module_.prototype.lesserThan = function( oDate ) {
			var bReturn = false;

			if( !(oDate instanceof module_) )
				oDate = module_.adopt(oDate);
			if( this.getTime() < oDate.getTime() )
				bReturn = true;

			return bReturn;
		};

		/**
		 * Compare two dates and return true if the given is lesser or equal than the current
		 * @param {ch.native.Date} oDate
		 * @return Boolean
		 */
		module_.prototype.lesserOrEqualThan = function( oDate ) {
			var bReturn = false;

			if( this.lesserThan(oDate) || this.equals(oDate) )
				bReturn = true;

			return bReturn;
		};

		/**
		 * Compare two dates and return true if the given is lower than the current
		 * @param {ch.native.Date} oDate
		 * @return Boolean
		 */
		module_.prototype.greaterThan = function( oDate ) {
			var bReturn = false;

			if( !(oDate instanceof module_) )
				oDate = module_.adopt(oDate);
			if( this.getTime() > oDate.getTime() )
				bReturn = true;

			return bReturn;
		};

		/**
		 * Compare two dates and return true if the given is lower than the current
		 * @param {ch.native.Date} oDate
		 * @return Boolean
		 */
		module_.prototype.greaterOrEqualThan = function( oDate ) {
			var bReturn = false;

			if( this.greaterThan(oDate) || this.equals(oDate) )
				bReturn = true;

			return bReturn;
		};

		/**
		 * Get number of days between the two dates
		 * @param {ch.native.Date} oDate
		 * @return Number
		 */
		module_.prototype.between = function( oDate ) {
			if( !(oDate instanceof module_) )
				oDate = module_.adopt(oDate);
			return Math.abs((oDate.getTime() - this.getTime()) / ( 24 * 60 * 60 * 1000 ) );
		};

		return module_;
	});
}).call(this);