const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { r as register, ax as t24, ay as t41, n as normalizeComponent$1, a as t, ac as GenRandomId, az as t37, av as ScopeComponent, ao as NcPopover } from "./index-BOzawWmL.chunk.mjs";
import { u as useModelMigration } from "./useModelMigration-EhAWvqDD-DYrjrJkv.chunk.mjs";
import { N as NcSelect } from "./NcSelect-CjUzohn5-OrPoxx8A.chunk.mjs";
import { ae as getCanonicalLocale } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
/*!
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
function getFirstDay() {
  if (typeof window.firstDay !== "undefined") {
    return window.firstDay;
  }
  const intl = new Intl.Locale(getCanonicalLocale());
  const weekInfo = intl.getWeekInfo?.() ?? intl.weekInfo;
  if (weekInfo) {
    return weekInfo.firstDay % 7;
  }
  return 1;
}
function getDayNames() {
  if (typeof window.dayNames !== "undefined") {
    return window.dayNames;
  }
  const locale3 = getCanonicalLocale();
  return [
    (/* @__PURE__ */ new Date("1970-01-04T00:00:00.000Z")).toLocaleDateString(locale3, { weekday: "long" }),
    (/* @__PURE__ */ new Date("1970-01-05T00:00:00.000Z")).toLocaleDateString(locale3, { weekday: "long" }),
    (/* @__PURE__ */ new Date("1970-01-06T00:00:00.000Z")).toLocaleDateString(locale3, { weekday: "long" }),
    (/* @__PURE__ */ new Date("1970-01-07T00:00:00.000Z")).toLocaleDateString(locale3, { weekday: "long" }),
    (/* @__PURE__ */ new Date("1970-01-08T00:00:00.000Z")).toLocaleDateString(locale3, { weekday: "long" }),
    (/* @__PURE__ */ new Date("1970-01-09T00:00:00.000Z")).toLocaleDateString(locale3, { weekday: "long" }),
    (/* @__PURE__ */ new Date("1970-01-10T00:00:00.000Z")).toLocaleDateString(locale3, { weekday: "long" })
  ];
}
function getDayNamesShort() {
  if (typeof window.dayNamesShort !== "undefined") {
    return window.dayNamesShort;
  }
  const locale3 = getCanonicalLocale();
  return [
    (/* @__PURE__ */ new Date("1970-01-04T00:00:00.000Z")).toLocaleDateString(locale3, { weekday: "short" }),
    (/* @__PURE__ */ new Date("1970-01-05T00:00:00.000Z")).toLocaleDateString(locale3, { weekday: "short" }),
    (/* @__PURE__ */ new Date("1970-01-06T00:00:00.000Z")).toLocaleDateString(locale3, { weekday: "short" }),
    (/* @__PURE__ */ new Date("1970-01-07T00:00:00.000Z")).toLocaleDateString(locale3, { weekday: "short" }),
    (/* @__PURE__ */ new Date("1970-01-08T00:00:00.000Z")).toLocaleDateString(locale3, { weekday: "short" }),
    (/* @__PURE__ */ new Date("1970-01-09T00:00:00.000Z")).toLocaleDateString(locale3, { weekday: "short" }),
    (/* @__PURE__ */ new Date("1970-01-10T00:00:00.000Z")).toLocaleDateString(locale3, { weekday: "short" })
  ];
}
function getDayNamesMin() {
  if (typeof window.dayNamesMin !== "undefined") {
    return window.dayNamesMin;
  }
  const locale3 = getCanonicalLocale();
  return [
    (/* @__PURE__ */ new Date("1970-01-04T00:00:00.000Z")).toLocaleDateString(locale3, { weekday: "narrow" }),
    (/* @__PURE__ */ new Date("1970-01-05T00:00:00.000Z")).toLocaleDateString(locale3, { weekday: "narrow" }),
    (/* @__PURE__ */ new Date("1970-01-06T00:00:00.000Z")).toLocaleDateString(locale3, { weekday: "narrow" }),
    (/* @__PURE__ */ new Date("1970-01-07T00:00:00.000Z")).toLocaleDateString(locale3, { weekday: "narrow" }),
    (/* @__PURE__ */ new Date("1970-01-08T00:00:00.000Z")).toLocaleDateString(locale3, { weekday: "narrow" }),
    (/* @__PURE__ */ new Date("1970-01-09T00:00:00.000Z")).toLocaleDateString(locale3, { weekday: "narrow" }),
    (/* @__PURE__ */ new Date("1970-01-10T00:00:00.000Z")).toLocaleDateString(locale3, { weekday: "narrow" })
  ];
}
function getMonthNames() {
  if (typeof window.monthNames !== "undefined") {
    return window.monthNames;
  }
  const locale3 = getCanonicalLocale();
  return [
    (/* @__PURE__ */ new Date("1970-01-01T00:00:00.000Z")).toLocaleDateString(locale3, { month: "long" }),
    (/* @__PURE__ */ new Date("1970-02-01T00:00:00.000Z")).toLocaleDateString(locale3, { month: "long" }),
    (/* @__PURE__ */ new Date("1970-03-01T00:00:00.000Z")).toLocaleDateString(locale3, { month: "long" }),
    (/* @__PURE__ */ new Date("1970-04-01T00:00:00.000Z")).toLocaleDateString(locale3, { month: "long" }),
    (/* @__PURE__ */ new Date("1970-05-01T00:00:00.000Z")).toLocaleDateString(locale3, { month: "long" }),
    (/* @__PURE__ */ new Date("1970-06-01T00:00:00.000Z")).toLocaleDateString(locale3, { month: "long" }),
    (/* @__PURE__ */ new Date("1970-07-01T00:00:00.000Z")).toLocaleDateString(locale3, { month: "long" }),
    (/* @__PURE__ */ new Date("1970-08-01T00:00:00.000Z")).toLocaleDateString(locale3, { month: "long" }),
    (/* @__PURE__ */ new Date("1970-09-01T00:00:00.000Z")).toLocaleDateString(locale3, { month: "long" }),
    (/* @__PURE__ */ new Date("1970-10-01T00:00:00.000Z")).toLocaleDateString(locale3, { month: "long" }),
    (/* @__PURE__ */ new Date("1970-11-01T00:00:00.000Z")).toLocaleDateString(locale3, { month: "long" }),
    (/* @__PURE__ */ new Date("1970-12-01T00:00:00.000Z")).toLocaleDateString(locale3, { month: "long" })
  ];
}
function getMonthNamesShort() {
  if (typeof window.monthNamesShort !== "undefined") {
    return window.monthNamesShort;
  }
  const locale3 = getCanonicalLocale();
  return [
    (/* @__PURE__ */ new Date("1970-01-01T00:00:00.000Z")).toLocaleDateString(locale3, { month: "short" }),
    (/* @__PURE__ */ new Date("1970-02-01T00:00:00.000Z")).toLocaleDateString(locale3, { month: "short" }),
    (/* @__PURE__ */ new Date("1970-03-01T00:00:00.000Z")).toLocaleDateString(locale3, { month: "short" }),
    (/* @__PURE__ */ new Date("1970-04-01T00:00:00.000Z")).toLocaleDateString(locale3, { month: "short" }),
    (/* @__PURE__ */ new Date("1970-05-01T00:00:00.000Z")).toLocaleDateString(locale3, { month: "short" }),
    (/* @__PURE__ */ new Date("1970-06-01T00:00:00.000Z")).toLocaleDateString(locale3, { month: "short" }),
    (/* @__PURE__ */ new Date("1970-07-01T00:00:00.000Z")).toLocaleDateString(locale3, { month: "short" }),
    (/* @__PURE__ */ new Date("1970-08-01T00:00:00.000Z")).toLocaleDateString(locale3, { month: "short" }),
    (/* @__PURE__ */ new Date("1970-09-01T00:00:00.000Z")).toLocaleDateString(locale3, { month: "short" }),
    (/* @__PURE__ */ new Date("1970-10-01T00:00:00.000Z")).toLocaleDateString(locale3, { month: "short" }),
    (/* @__PURE__ */ new Date("1970-11-01T00:00:00.000Z")).toLocaleDateString(locale3, { month: "short" }),
    (/* @__PURE__ */ new Date("1970-12-01T00:00:00.000Z")).toLocaleDateString(locale3, { month: "short" })
  ];
}
class Binary {
  /**
   * Creates a binary value from the given string.
   *
   * @param {String} aString        The binary value string
   * @return {Binary}               The binary value instance
   */
  static fromString(aString) {
    return new Binary(aString);
  }
  /**
   * Creates a new ICAL.Binary instance
   *
   * @param {String} aValue     The binary data for this value
   */
  constructor(aValue) {
    this.value = aValue;
  }
  /**
   * The type name, to be used in the jCal object.
   * @default "binary"
   * @constant
   */
  icaltype = "binary";
  /**
   * Base64 decode the current value
   *
   * @return {String}         The base64-decoded value
   */
  decodeValue() {
    return this._b64_decode(this.value);
  }
  /**
   * Encodes the passed parameter with base64 and sets the internal
   * value to the result.
   *
   * @param {String} aValue      The raw binary value to encode
   */
  setEncodedValue(aValue) {
    this.value = this._b64_encode(aValue);
  }
  _b64_encode(data10) {
    let b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    let o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, enc = "", tmp_arr = [];
    if (!data10) {
      return data10;
    }
    do {
      o1 = data10.charCodeAt(i++);
      o2 = data10.charCodeAt(i++);
      o3 = data10.charCodeAt(i++);
      bits = o1 << 16 | o2 << 8 | o3;
      h1 = bits >> 18 & 63;
      h2 = bits >> 12 & 63;
      h3 = bits >> 6 & 63;
      h4 = bits & 63;
      tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data10.length);
    enc = tmp_arr.join("");
    let r = data10.length % 3;
    return (r ? enc.slice(0, r - 3) : enc) + "===".slice(r || 3);
  }
  _b64_decode(data10) {
    let b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    let o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, dec = "", tmp_arr = [];
    if (!data10) {
      return data10;
    }
    data10 += "";
    do {
      h1 = b64.indexOf(data10.charAt(i++));
      h2 = b64.indexOf(data10.charAt(i++));
      h3 = b64.indexOf(data10.charAt(i++));
      h4 = b64.indexOf(data10.charAt(i++));
      bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
      o1 = bits >> 16 & 255;
      o2 = bits >> 8 & 255;
      o3 = bits & 255;
      if (h3 == 64) {
        tmp_arr[ac++] = String.fromCharCode(o1);
      } else if (h4 == 64) {
        tmp_arr[ac++] = String.fromCharCode(o1, o2);
      } else {
        tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
      }
    } while (i < data10.length);
    dec = tmp_arr.join("");
    return dec;
  }
  /**
   * The string representation of this value
   * @return {String}
   */
  toString() {
    return this.value;
  }
}
const DURATION_LETTERS = /([PDWHMTS]{1,1})/;
const DATA_PROPS_TO_COPY = ["weeks", "days", "hours", "minutes", "seconds", "isNegative"];
class Duration {
  /**
   * Returns a new ICAL.Duration instance from the passed seconds value.
   *
   * @param {Number} aSeconds       The seconds to create the instance from
   * @return {Duration}             The newly created duration instance
   */
  static fromSeconds(aSeconds) {
    return new Duration().fromSeconds(aSeconds);
  }
  /**
   * Checks if the given string is an iCalendar duration value.
   *
   * @param {String} value      The raw ical value
   * @return {Boolean}          True, if the given value is of the
   *                              duration ical type
   */
  static isValueString(string) {
    return string[0] === "P" || string[1] === "P";
  }
  /**
   * Creates a new {@link ICAL.Duration} instance from the passed string.
   *
   * @param {String} aStr       The string to parse
   * @return {Duration}         The created duration instance
   */
  static fromString(aStr) {
    let pos = 0;
    let dict = /* @__PURE__ */ Object.create(null);
    let chunks = 0;
    while ((pos = aStr.search(DURATION_LETTERS)) !== -1) {
      let type = aStr[pos];
      let numeric = aStr.slice(0, Math.max(0, pos));
      aStr = aStr.slice(pos + 1);
      chunks += parseDurationChunk(type, numeric, dict);
    }
    if (chunks < 2) {
      throw new Error(
        'invalid duration value: Not enough duration components in "' + aStr + '"'
      );
    }
    return new Duration(dict);
  }
  /**
   * Creates a new ICAL.Duration instance from the given data object.
   *
   * @param {Object} aData                An object with members of the duration
   * @param {Number=} aData.weeks         Duration in weeks
   * @param {Number=} aData.days          Duration in days
   * @param {Number=} aData.hours         Duration in hours
   * @param {Number=} aData.minutes       Duration in minutes
   * @param {Number=} aData.seconds       Duration in seconds
   * @param {Boolean=} aData.isNegative   If true, the duration is negative
   * @return {Duration}                   The createad duration instance
   */
  static fromData(aData) {
    return new Duration(aData);
  }
  /**
   * Creates a new ICAL.Duration instance.
   *
   * @param {Object} data                 An object with members of the duration
   * @param {Number=} data.weeks          Duration in weeks
   * @param {Number=} data.days           Duration in days
   * @param {Number=} data.hours          Duration in hours
   * @param {Number=} data.minutes        Duration in minutes
   * @param {Number=} data.seconds        Duration in seconds
   * @param {Boolean=} data.isNegative    If true, the duration is negative
   */
  constructor(data10) {
    this.wrappedJSObject = this;
    this.fromData(data10);
  }
  /**
   * The weeks in this duration
   * @type {Number}
   * @default 0
   */
  weeks = 0;
  /**
   * The days in this duration
   * @type {Number}
   * @default 0
   */
  days = 0;
  /**
   * The days in this duration
   * @type {Number}
   * @default 0
   */
  hours = 0;
  /**
   * The minutes in this duration
   * @type {Number}
   * @default 0
   */
  minutes = 0;
  /**
   * The seconds in this duration
   * @type {Number}
   * @default 0
   */
  seconds = 0;
  /**
   * The seconds in this duration
   * @type {Boolean}
   * @default false
   */
  isNegative = false;
  /**
   * The class identifier.
   * @constant
   * @type {String}
   * @default "icalduration"
   */
  icalclass = "icalduration";
  /**
   * The type name, to be used in the jCal object.
   * @constant
   * @type {String}
   * @default "duration"
   */
  icaltype = "duration";
  /**
   * Returns a clone of the duration object.
   *
   * @return {Duration}      The cloned object
   */
  clone() {
    return Duration.fromData(this);
  }
  /**
   * The duration value expressed as a number of seconds.
   *
   * @return {Number}             The duration value in seconds
   */
  toSeconds() {
    let seconds = this.seconds + 60 * this.minutes + 3600 * this.hours + 86400 * this.days + 7 * 86400 * this.weeks;
    return this.isNegative ? -seconds : seconds;
  }
  /**
   * Reads the passed seconds value into this duration object. Afterwards,
   * members like {@link ICAL.Duration#days days} and {@link ICAL.Duration#weeks weeks} will be set up
   * accordingly.
   *
   * @param {Number} aSeconds     The duration value in seconds
   * @return {Duration}           Returns this instance
   */
  fromSeconds(aSeconds) {
    let secs = Math.abs(aSeconds);
    this.isNegative = aSeconds < 0;
    this.days = trunc(secs / 86400);
    if (this.days % 7 == 0) {
      this.weeks = this.days / 7;
      this.days = 0;
    } else {
      this.weeks = 0;
    }
    secs -= (this.days + 7 * this.weeks) * 86400;
    this.hours = trunc(secs / 3600);
    secs -= this.hours * 3600;
    this.minutes = trunc(secs / 60);
    secs -= this.minutes * 60;
    this.seconds = secs;
    return this;
  }
  /**
   * Sets up the current instance using members from the passed data object.
   *
   * @param {Object} aData                An object with members of the duration
   * @param {Number=} aData.weeks         Duration in weeks
   * @param {Number=} aData.days          Duration in days
   * @param {Number=} aData.hours         Duration in hours
   * @param {Number=} aData.minutes       Duration in minutes
   * @param {Number=} aData.seconds       Duration in seconds
   * @param {Boolean=} aData.isNegative   If true, the duration is negative
   */
  fromData(aData) {
    for (let prop of DATA_PROPS_TO_COPY) {
      if (aData && prop in aData) {
        this[prop] = aData[prop];
      } else {
        this[prop] = 0;
      }
    }
  }
  /**
   * Resets the duration instance to the default values, i.e. PT0S
   */
  reset() {
    this.isNegative = false;
    this.weeks = 0;
    this.days = 0;
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
  }
  /**
   * Compares the duration instance with another one.
   *
   * @param {Duration} aOther             The instance to compare with
   * @return {Number}                     -1, 0 or 1 for less/equal/greater
   */
  compare(aOther) {
    let thisSeconds = this.toSeconds();
    let otherSeconds = aOther.toSeconds();
    return (thisSeconds > otherSeconds) - (thisSeconds < otherSeconds);
  }
  /**
   * Normalizes the duration instance. For example, a duration with a value
   * of 61 seconds will be normalized to 1 minute and 1 second.
   */
  normalize() {
    this.fromSeconds(this.toSeconds());
  }
  /**
   * The string representation of this duration.
   * @return {String}
   */
  toString() {
    if (this.toSeconds() == 0) {
      return "PT0S";
    } else {
      let str = "";
      if (this.isNegative) str += "-";
      str += "P";
      if (this.weeks) str += this.weeks + "W";
      if (this.days) str += this.days + "D";
      if (this.hours || this.minutes || this.seconds) {
        str += "T";
        if (this.hours) str += this.hours + "H";
        if (this.minutes) str += this.minutes + "M";
        if (this.seconds) str += this.seconds + "S";
      }
      return str;
    }
  }
  /**
   * The iCalendar string representation of this duration.
   * @return {String}
   */
  toICALString() {
    return this.toString();
  }
}
function parseDurationChunk(letter, number, object) {
  let type;
  switch (letter) {
    case "P":
      if (number && number === "-") {
        object.isNegative = true;
      } else {
        object.isNegative = false;
      }
      break;
    case "D":
      type = "days";
      break;
    case "W":
      type = "weeks";
      break;
    case "H":
      type = "hours";
      break;
    case "M":
      type = "minutes";
      break;
    case "S":
      type = "seconds";
      break;
    default:
      return 0;
  }
  if (type) {
    if (!number && number !== 0) {
      throw new Error(
        'invalid duration value: Missing number before "' + letter + '"'
      );
    }
    let num = parseInt(number, 10);
    if (isStrictlyNaN(num)) {
      throw new Error(
        'invalid duration value: Invalid number "' + number + '" before "' + letter + '"'
      );
    }
    object[type] = num;
  }
  return 1;
}
class Time {
  static _dowCache = {};
  static _wnCache = {};
  /**
   * Returns the days in the given month
   *
   * @param {Number} month      The month to check
   * @param {Number} year       The year to check
   * @return {Number}           The number of days in the month
   */
  static daysInMonth(month, year) {
    let _daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let days2 = 30;
    if (month < 1 || month > 12) return days2;
    days2 = _daysInMonth[month];
    if (month == 2) {
      days2 += Time.isLeapYear(year);
    }
    return days2;
  }
  /**
   * Checks if the year is a leap year
   *
   * @param {Number} year       The year to check
   * @return {Boolean}          True, if the year is a leap year
   */
  static isLeapYear(year) {
    if (year <= 1752) {
      return year % 4 == 0;
    } else {
      return year % 4 == 0 && year % 100 != 0 || year % 400 == 0;
    }
  }
  /**
   * Create a new ICAL.Time from the day of year and year. The date is returned
   * in floating timezone.
   *
   * @param {Number} aDayOfYear     The day of year
   * @param {Number} aYear          The year to create the instance in
   * @return {Time}                 The created instance with the calculated date
   */
  static fromDayOfYear(aDayOfYear, aYear) {
    let year = aYear;
    let doy = aDayOfYear;
    let tt = new Time();
    tt.auto_normalize = false;
    let is_leap = Time.isLeapYear(year) ? 1 : 0;
    if (doy < 1) {
      year--;
      is_leap = Time.isLeapYear(year) ? 1 : 0;
      doy += Time.daysInYearPassedMonth[is_leap][12];
      return Time.fromDayOfYear(doy, year);
    } else if (doy > Time.daysInYearPassedMonth[is_leap][12]) {
      is_leap = Time.isLeapYear(year) ? 1 : 0;
      doy -= Time.daysInYearPassedMonth[is_leap][12];
      year++;
      return Time.fromDayOfYear(doy, year);
    }
    tt.year = year;
    tt.isDate = true;
    for (let month = 11; month >= 0; month--) {
      if (doy > Time.daysInYearPassedMonth[is_leap][month]) {
        tt.month = month + 1;
        tt.day = doy - Time.daysInYearPassedMonth[is_leap][month];
        break;
      }
    }
    tt.auto_normalize = true;
    return tt;
  }
  /**
   * Returns a new ICAL.Time instance from a date string, e.g 2015-01-02.
   *
   * @deprecated                Use {@link ICAL.Time.fromDateString} instead
   * @param {String} str        The string to create from
   * @return {Time}             The date/time instance
   */
  static fromStringv2(str) {
    return new Time({
      year: parseInt(str.slice(0, 4), 10),
      month: parseInt(str.slice(5, 7), 10),
      day: parseInt(str.slice(8, 10), 10),
      isDate: true
    });
  }
  /**
   * Returns a new ICAL.Time instance from a date string, e.g 2015-01-02.
   *
   * @param {String} aValue     The string to create from
   * @return {Time}             The date/time instance
   */
  static fromDateString(aValue) {
    return new Time({
      year: strictParseInt(aValue.slice(0, 4)),
      month: strictParseInt(aValue.slice(5, 7)),
      day: strictParseInt(aValue.slice(8, 10)),
      isDate: true
    });
  }
  /**
   * Returns a new ICAL.Time instance from a date-time string, e.g
   * 2015-01-02T03:04:05. If a property is specified, the timezone is set up
   * from the property's TZID parameter.
   *
   * @param {String} aValue         The string to create from
   * @param {Property=} prop        The property the date belongs to
   * @return {Time}                 The date/time instance
   */
  static fromDateTimeString(aValue, prop) {
    if (aValue.length < 19) {
      throw new Error(
        'invalid date-time value: "' + aValue + '"'
      );
    }
    let zone;
    let zoneId;
    if (aValue[19] && aValue[19] === "Z") {
      zone = Timezone$1.utcTimezone;
    } else if (prop) {
      zoneId = prop.getParameter("tzid");
      if (prop.parent) {
        if (prop.parent.name === "standard" || prop.parent.name === "daylight") {
          zone = Timezone$1.localTimezone;
        } else if (zoneId) {
          zone = prop.parent.getTimeZoneByID(zoneId);
        }
      }
    }
    const timeData = {
      year: strictParseInt(aValue.slice(0, 4)),
      month: strictParseInt(aValue.slice(5, 7)),
      day: strictParseInt(aValue.slice(8, 10)),
      hour: strictParseInt(aValue.slice(11, 13)),
      minute: strictParseInt(aValue.slice(14, 16)),
      second: strictParseInt(aValue.slice(17, 19))
    };
    if (zoneId && !zone) {
      timeData.timezone = zoneId;
    }
    return new Time(timeData, zone);
  }
  /**
   * Returns a new ICAL.Time instance from a date or date-time string,
   *
   * @param {String} aValue         The string to create from
   * @param {Property=} prop        The property the date belongs to
   * @return {Time}                 The date/time instance
   */
  static fromString(aValue, aProperty) {
    if (aValue.length > 10) {
      return Time.fromDateTimeString(aValue, aProperty);
    } else {
      return Time.fromDateString(aValue);
    }
  }
  /**
   * Creates a new ICAL.Time instance from the given Javascript Date.
   *
   * @param {?Date} aDate             The Javascript Date to read, or null to reset
   * @param {Boolean} [useUTC=false]  If true, the UTC values of the date will be used
   */
  static fromJSDate(aDate, useUTC) {
    let tt = new Time();
    return tt.fromJSDate(aDate, useUTC);
  }
  /**
   * Creates a new ICAL.Time instance from the the passed data object.
   *
   * @param {Object} aData            Time initialization
   * @param {Number=} aData.year      The year for this date
   * @param {Number=} aData.month     The month for this date
   * @param {Number=} aData.day       The day for this date
   * @param {Number=} aData.hour      The hour for this date
   * @param {Number=} aData.minute    The minute for this date
   * @param {Number=} aData.second    The second for this date
   * @param {Boolean=} aData.isDate   If true, the instance represents a date
   *                                    (as opposed to a date-time)
   * @param {Timezone=} aZone         Timezone this position occurs in
   */
  static fromData = function fromData(aData, aZone) {
    let t2 = new Time();
    return t2.fromData(aData, aZone);
  };
  /**
   * Creates a new ICAL.Time instance from the current moment.
   * The instance is “floating” - has no timezone relation.
   * To create an instance considering the time zone, call
   * ICAL.Time.fromJSDate(new Date(), true)
   * @return {Time}
   */
  static now() {
    return Time.fromJSDate(/* @__PURE__ */ new Date(), false);
  }
  /**
   * Returns the date on which ISO week number 1 starts.
   *
   * @see Time#weekNumber
   * @param {Number} aYear                  The year to search in
   * @param {weekDay=} aWeekStart           The week start weekday, used for calculation.
   * @return {Time}                         The date on which week number 1 starts
   */
  static weekOneStarts(aYear, aWeekStart) {
    let t2 = Time.fromData({
      year: aYear,
      month: 1,
      day: 1,
      isDate: true
    });
    let dow = t2.dayOfWeek();
    let wkst = aWeekStart || Time.DEFAULT_WEEK_START;
    if (dow > Time.THURSDAY) {
      t2.day += 7;
    }
    if (wkst > Time.THURSDAY) {
      t2.day -= 7;
    }
    t2.day -= dow - wkst;
    return t2;
  }
  /**
   * Get the dominical letter for the given year. Letters range from A - G for
   * common years, and AG to GF for leap years.
   *
   * @param {Number} yr           The year to retrieve the letter for
   * @return {String}             The dominical letter.
   */
  static getDominicalLetter(yr) {
    let LTRS = "GFEDCBA";
    let dom = (yr + (yr / 4 | 0) + (yr / 400 | 0) - (yr / 100 | 0) - 1) % 7;
    let isLeap = Time.isLeapYear(yr);
    if (isLeap) {
      return LTRS[(dom + 6) % 7] + LTRS[dom];
    } else {
      return LTRS[dom];
    }
  }
  static #epochTime = null;
  /**
   * January 1st, 1970 as an ICAL.Time.
   * @type {Time}
   * @constant
   * @instance
   */
  static get epochTime() {
    if (!this.#epochTime) {
      this.#epochTime = Time.fromData({
        year: 1970,
        month: 1,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        isDate: false,
        timezone: "Z"
      });
    }
    return this.#epochTime;
  }
  static _cmp_attr(a2, b, attr) {
    if (a2[attr] > b[attr]) return 1;
    if (a2[attr] < b[attr]) return -1;
    return 0;
  }
  /**
   * The days that have passed in the year after a given month. The array has
   * two members, one being an array of passed days for non-leap years, the
   * other analog for leap years.
   * @example
   * var isLeapYear = ICAL.Time.isLeapYear(year);
   * var passedDays = ICAL.Time.daysInYearPassedMonth[isLeapYear][month];
   * @type {Array.<Array.<Number>>}
   */
  static daysInYearPassedMonth = [
    [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365],
    [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366]
  ];
  static SUNDAY = 1;
  static MONDAY = 2;
  static TUESDAY = 3;
  static WEDNESDAY = 4;
  static THURSDAY = 5;
  static FRIDAY = 6;
  static SATURDAY = 7;
  /**
   * The default weekday for the WKST part.
   * @constant
   * @default ICAL.Time.MONDAY
   */
  static DEFAULT_WEEK_START = 2;
  // MONDAY
  /**
   * Creates a new ICAL.Time instance.
   *
   * @param {Object} data           Time initialization
   * @param {Number=} data.year     The year for this date
   * @param {Number=} data.month    The month for this date
   * @param {Number=} data.day      The day for this date
   * @param {Number=} data.hour     The hour for this date
   * @param {Number=} data.minute   The minute for this date
   * @param {Number=} data.second   The second for this date
   * @param {Boolean=} data.isDate  If true, the instance represents a date (as
   *                                  opposed to a date-time)
   * @param {Timezone} zone         timezone this position occurs in
   */
  constructor(data10, zone) {
    this.wrappedJSObject = this;
    let time = this._time = /* @__PURE__ */ Object.create(null);
    time.year = 0;
    time.month = 1;
    time.day = 1;
    time.hour = 0;
    time.minute = 0;
    time.second = 0;
    time.isDate = false;
    this.fromData(data10, zone);
  }
  /**
   * The class identifier.
   * @constant
   * @type {String}
   * @default "icaltime"
   */
  icalclass = "icaltime";
  _cachedUnixTime = null;
  /**
   * The type name, to be used in the jCal object. This value may change and
   * is strictly defined by the {@link ICAL.Time#isDate isDate} member.
   * @type {String}
   * @default "date-time"
   */
  get icaltype() {
    return this.isDate ? "date" : "date-time";
  }
  /**
   * The timezone for this time.
   * @type {Timezone}
   */
  zone = null;
  /**
   * Internal uses to indicate that a change has been made and the next read
   * operation must attempt to normalize the value (for example changing the
   * day to 33).
   *
   * @type {Boolean}
   * @private
   */
  _pendingNormalization = false;
  /**
   * Returns a clone of the time object.
   *
   * @return {Time}              The cloned object
   */
  clone() {
    return new Time(this._time, this.zone);
  }
  /**
   * Reset the time instance to epoch time
   */
  reset() {
    this.fromData(Time.epochTime);
    this.zone = Timezone$1.utcTimezone;
  }
  /**
   * Reset the time instance to the given date/time values.
   *
   * @param {Number} year             The year to set
   * @param {Number} month            The month to set
   * @param {Number} day              The day to set
   * @param {Number} hour             The hour to set
   * @param {Number} minute           The minute to set
   * @param {Number} second           The second to set
   * @param {Timezone} timezone       The timezone to set
   */
  resetTo(year, month, day, hour, minute, second, timezone) {
    this.fromData({
      year,
      month,
      day,
      hour,
      minute,
      second,
      zone: timezone
    });
  }
  /**
   * Set up the current instance from the Javascript date value.
   *
   * @param {?Date} aDate             The Javascript Date to read, or null to reset
   * @param {Boolean} [useUTC=false]  If true, the UTC values of the date will be used
   */
  fromJSDate(aDate, useUTC) {
    if (!aDate) {
      this.reset();
    } else {
      if (useUTC) {
        this.zone = Timezone$1.utcTimezone;
        this.year = aDate.getUTCFullYear();
        this.month = aDate.getUTCMonth() + 1;
        this.day = aDate.getUTCDate();
        this.hour = aDate.getUTCHours();
        this.minute = aDate.getUTCMinutes();
        this.second = aDate.getUTCSeconds();
      } else {
        this.zone = Timezone$1.localTimezone;
        this.year = aDate.getFullYear();
        this.month = aDate.getMonth() + 1;
        this.day = aDate.getDate();
        this.hour = aDate.getHours();
        this.minute = aDate.getMinutes();
        this.second = aDate.getSeconds();
      }
    }
    this._cachedUnixTime = null;
    return this;
  }
  /**
   * Sets up the current instance using members from the passed data object.
   *
   * @param {Object} aData            Time initialization
   * @param {Number=} aData.year      The year for this date
   * @param {Number=} aData.month     The month for this date
   * @param {Number=} aData.day       The day for this date
   * @param {Number=} aData.hour      The hour for this date
   * @param {Number=} aData.minute    The minute for this date
   * @param {Number=} aData.second    The second for this date
   * @param {Boolean=} aData.isDate   If true, the instance represents a date
   *                                    (as opposed to a date-time)
   * @param {Timezone=} aZone         Timezone this position occurs in
   */
  fromData(aData, aZone) {
    if (aData) {
      for (let [key, value3] of Object.entries(aData)) {
        if (key === "icaltype") continue;
        this[key] = value3;
      }
    }
    if (aZone) {
      this.zone = aZone;
    }
    if (aData && !("isDate" in aData)) {
      this.isDate = !("hour" in aData);
    } else if (aData && "isDate" in aData) {
      this.isDate = aData.isDate;
    }
    if (aData && "timezone" in aData) {
      let zone = TimezoneService.get(
        aData.timezone
      );
      this.zone = zone || Timezone$1.localTimezone;
    }
    if (aData && "zone" in aData) {
      this.zone = aData.zone;
    }
    if (!this.zone) {
      this.zone = Timezone$1.localTimezone;
    }
    this._cachedUnixTime = null;
    return this;
  }
  /**
   * Calculate the day of week.
   * @param {weekDay=} aWeekStart
   *        The week start weekday, defaults to SUNDAY
   * @return {weekDay}
   */
  dayOfWeek(aWeekStart) {
    let firstDow = aWeekStart || Time.SUNDAY;
    let dowCacheKey = (this.year << 12) + (this.month << 8) + (this.day << 3) + firstDow;
    if (dowCacheKey in Time._dowCache) {
      return Time._dowCache[dowCacheKey];
    }
    let q = this.day;
    let m2 = this.month + (this.month < 3 ? 12 : 0);
    let Y2 = this.year - (this.month < 3 ? 1 : 0);
    let h2 = q + Y2 + trunc((m2 + 1) * 26 / 10) + trunc(Y2 / 4);
    {
      h2 += trunc(Y2 / 100) * 6 + trunc(Y2 / 400);
    }
    h2 = (h2 + 7 - firstDow) % 7 + 1;
    Time._dowCache[dowCacheKey] = h2;
    return h2;
  }
  /**
   * Calculate the day of year.
   * @return {Number}
   */
  dayOfYear() {
    let is_leap = Time.isLeapYear(this.year) ? 1 : 0;
    let diypm = Time.daysInYearPassedMonth;
    return diypm[is_leap][this.month - 1] + this.day;
  }
  /**
   * Returns a copy of the current date/time, rewound to the start of the
   * week. The resulting ICAL.Time instance is of icaltype date, even if this
   * is a date-time.
   *
   * @param {weekDay=} aWeekStart
   *        The week start weekday, defaults to SUNDAY
   * @return {Time}      The start of the week (cloned)
   */
  startOfWeek(aWeekStart) {
    let firstDow = aWeekStart || Time.SUNDAY;
    let result = this.clone();
    result.day -= (this.dayOfWeek() + 7 - firstDow) % 7;
    result.isDate = true;
    result.hour = 0;
    result.minute = 0;
    result.second = 0;
    return result;
  }
  /**
   * Returns a copy of the current date/time, shifted to the end of the week.
   * The resulting ICAL.Time instance is of icaltype date, even if this is a
   * date-time.
   *
   * @param {weekDay=} aWeekStart
   *        The week start weekday, defaults to SUNDAY
   * @return {Time}      The end of the week (cloned)
   */
  endOfWeek(aWeekStart) {
    let firstDow = aWeekStart || Time.SUNDAY;
    let result = this.clone();
    result.day += (7 - this.dayOfWeek() + firstDow - Time.SUNDAY) % 7;
    result.isDate = true;
    result.hour = 0;
    result.minute = 0;
    result.second = 0;
    return result;
  }
  /**
   * Returns a copy of the current date/time, rewound to the start of the
   * month. The resulting ICAL.Time instance is of icaltype date, even if
   * this is a date-time.
   *
   * @return {Time}      The start of the month (cloned)
   */
  startOfMonth() {
    let result = this.clone();
    result.day = 1;
    result.isDate = true;
    result.hour = 0;
    result.minute = 0;
    result.second = 0;
    return result;
  }
  /**
   * Returns a copy of the current date/time, shifted to the end of the
   * month.  The resulting ICAL.Time instance is of icaltype date, even if
   * this is a date-time.
   *
   * @return {Time}      The end of the month (cloned)
   */
  endOfMonth() {
    let result = this.clone();
    result.day = Time.daysInMonth(result.month, result.year);
    result.isDate = true;
    result.hour = 0;
    result.minute = 0;
    result.second = 0;
    return result;
  }
  /**
   * Returns a copy of the current date/time, rewound to the start of the
   * year. The resulting ICAL.Time instance is of icaltype date, even if
   * this is a date-time.
   *
   * @return {Time}      The start of the year (cloned)
   */
  startOfYear() {
    let result = this.clone();
    result.day = 1;
    result.month = 1;
    result.isDate = true;
    result.hour = 0;
    result.minute = 0;
    result.second = 0;
    return result;
  }
  /**
   * Returns a copy of the current date/time, shifted to the end of the
   * year.  The resulting ICAL.Time instance is of icaltype date, even if
   * this is a date-time.
   *
   * @return {Time}      The end of the year (cloned)
   */
  endOfYear() {
    let result = this.clone();
    result.day = 31;
    result.month = 12;
    result.isDate = true;
    result.hour = 0;
    result.minute = 0;
    result.second = 0;
    return result;
  }
  /**
   * First calculates the start of the week, then returns the day of year for
   * this date. If the day falls into the previous year, the day is zero or negative.
   *
   * @param {weekDay=} aFirstDayOfWeek
   *        The week start weekday, defaults to SUNDAY
   * @return {Number}     The calculated day of year
   */
  startDoyWeek(aFirstDayOfWeek) {
    let firstDow = aFirstDayOfWeek || Time.SUNDAY;
    let delta = this.dayOfWeek() - firstDow;
    if (delta < 0) delta += 7;
    return this.dayOfYear() - delta;
  }
  /**
   * Get the dominical letter for the current year. Letters range from A - G
   * for common years, and AG to GF for leap years.
   *
   * @param {Number} yr           The year to retrieve the letter for
   * @return {String}             The dominical letter.
   */
  getDominicalLetter() {
    return Time.getDominicalLetter(this.year);
  }
  /**
   * Finds the nthWeekDay relative to the current month (not day).  The
   * returned value is a day relative the month that this month belongs to so
   * 1 would indicate the first of the month and 40 would indicate a day in
   * the following month.
   *
   * @param {Number} aDayOfWeek   Day of the week see the day name constants
   * @param {Number} aPos         Nth occurrence of a given week day values
   *        of 1 and 0 both indicate the first weekday of that type. aPos may
   *        be either positive or negative
   *
   * @return {Number} numeric value indicating a day relative
   *                   to the current month of this time object
   */
  nthWeekDay(aDayOfWeek, aPos) {
    let daysInMonth = Time.daysInMonth(this.month, this.year);
    let weekday;
    let pos = aPos;
    let start = 0;
    let otherDay = this.clone();
    if (pos >= 0) {
      otherDay.day = 1;
      if (pos != 0) {
        pos--;
      }
      start = otherDay.day;
      let startDow = otherDay.dayOfWeek();
      let offset = aDayOfWeek - startDow;
      if (offset < 0)
        offset += 7;
      start += offset;
      start -= aDayOfWeek;
      weekday = aDayOfWeek;
    } else {
      otherDay.day = daysInMonth;
      let endDow = otherDay.dayOfWeek();
      pos++;
      weekday = endDow - aDayOfWeek;
      if (weekday < 0) {
        weekday += 7;
      }
      weekday = daysInMonth - weekday;
    }
    weekday += pos * 7;
    return start + weekday;
  }
  /**
   * Checks if current time is the nth weekday, relative to the current
   * month.  Will always return false when rule resolves outside of current
   * month.
   *
   * @param {weekDay} aDayOfWeek                 Day of week to check
   * @param {Number} aPos                        Relative position
   * @return {Boolean}                           True, if it is the nth weekday
   */
  isNthWeekDay(aDayOfWeek, aPos) {
    let dow = this.dayOfWeek();
    if (aPos === 0 && dow === aDayOfWeek) {
      return true;
    }
    let day = this.nthWeekDay(aDayOfWeek, aPos);
    if (day === this.day) {
      return true;
    }
    return false;
  }
  /**
   * Calculates the ISO 8601 week number. The first week of a year is the
   * week that contains the first Thursday. The year can have 53 weeks, if
   * January 1st is a Friday.
   *
   * Note there are regions where the first week of the year is the one that
   * starts on January 1st, which may offset the week number. Also, if a
   * different week start is specified, this will also affect the week
   * number.
   *
   * @see Time.weekOneStarts
   * @param {weekDay} aWeekStart                  The weekday the week starts with
   * @return {Number}                             The ISO week number
   */
  weekNumber(aWeekStart) {
    let wnCacheKey = (this.year << 12) + (this.month << 8) + (this.day << 3) + aWeekStart;
    if (wnCacheKey in Time._wnCache) {
      return Time._wnCache[wnCacheKey];
    }
    let week1;
    let dt = this.clone();
    dt.isDate = true;
    let isoyear = this.year;
    if (dt.month == 12 && dt.day > 25) {
      week1 = Time.weekOneStarts(isoyear + 1, aWeekStart);
      if (dt.compare(week1) < 0) {
        week1 = Time.weekOneStarts(isoyear, aWeekStart);
      } else {
        isoyear++;
      }
    } else {
      week1 = Time.weekOneStarts(isoyear, aWeekStart);
      if (dt.compare(week1) < 0) {
        week1 = Time.weekOneStarts(--isoyear, aWeekStart);
      }
    }
    let daysBetween = dt.subtractDate(week1).toSeconds() / 86400;
    let answer = trunc(daysBetween / 7) + 1;
    Time._wnCache[wnCacheKey] = answer;
    return answer;
  }
  /**
   * Adds the duration to the current time. The instance is modified in
   * place.
   *
   * @param {Duration} aDuration         The duration to add
   */
  addDuration(aDuration) {
    let mult = aDuration.isNegative ? -1 : 1;
    let second = this.second;
    let minute = this.minute;
    let hour = this.hour;
    let day = this.day;
    second += mult * aDuration.seconds;
    minute += mult * aDuration.minutes;
    hour += mult * aDuration.hours;
    day += mult * aDuration.days;
    day += mult * 7 * aDuration.weeks;
    this.second = second;
    this.minute = minute;
    this.hour = hour;
    this.day = day;
    this._cachedUnixTime = null;
  }
  /**
   * Subtract the date details (_excluding_ timezone).  Useful for finding
   * the relative difference between two time objects excluding their
   * timezone differences.
   *
   * @param {Time} aDate     The date to subtract
   * @return {Duration}      The difference as a duration
   */
  subtractDate(aDate) {
    let unixTime = this.toUnixTime() + this.utcOffset();
    let other = aDate.toUnixTime() + aDate.utcOffset();
    return Duration.fromSeconds(unixTime - other);
  }
  /**
   * Subtract the date details, taking timezones into account.
   *
   * @param {Time} aDate  The date to subtract
   * @return {Duration}   The difference in duration
   */
  subtractDateTz(aDate) {
    let unixTime = this.toUnixTime();
    let other = aDate.toUnixTime();
    return Duration.fromSeconds(unixTime - other);
  }
  /**
   * Compares the ICAL.Time instance with another one.
   *
   * @param {Duration} aOther        The instance to compare with
   * @return {Number}                     -1, 0 or 1 for less/equal/greater
   */
  compare(other) {
    let a2 = this.toUnixTime();
    let b = other.toUnixTime();
    if (a2 > b) return 1;
    if (b > a2) return -1;
    return 0;
  }
  /**
   * Compares only the date part of this instance with another one.
   *
   * @param {Duration} other              The instance to compare with
   * @param {Timezone} tz                 The timezone to compare in
   * @return {Number}                     -1, 0 or 1 for less/equal/greater
   */
  compareDateOnlyTz(other, tz) {
    let a2 = this.convertToZone(tz);
    let b = other.convertToZone(tz);
    let rc = 0;
    if ((rc = Time._cmp_attr(a2, b, "year")) != 0) return rc;
    if ((rc = Time._cmp_attr(a2, b, "month")) != 0) return rc;
    if ((rc = Time._cmp_attr(a2, b, "day")) != 0) return rc;
    return rc;
  }
  /**
   * Convert the instance into another timezone. The returned ICAL.Time
   * instance is always a copy.
   *
   * @param {Timezone} zone      The zone to convert to
   * @return {Time}              The copy, converted to the zone
   */
  convertToZone(zone) {
    let copy = this.clone();
    let zone_equals = this.zone.tzid == zone.tzid;
    if (!this.isDate && !zone_equals) {
      Timezone$1.convert_time(copy, this.zone, zone);
    }
    copy.zone = zone;
    return copy;
  }
  /**
   * Calculates the UTC offset of the current date/time in the timezone it is
   * in.
   *
   * @return {Number}     UTC offset in seconds
   */
  utcOffset() {
    if (this.zone == Timezone$1.localTimezone || this.zone == Timezone$1.utcTimezone) {
      return 0;
    } else {
      return this.zone.utcOffset(this);
    }
  }
  /**
   * Returns an RFC 5545 compliant ical representation of this object.
   *
   * @return {String} ical date/date-time
   */
  toICALString() {
    let string = this.toString();
    if (string.length > 10) {
      return design$1.icalendar.value["date-time"].toICAL(string);
    } else {
      return design$1.icalendar.value.date.toICAL(string);
    }
  }
  /**
   * The string representation of this date/time, in jCal form
   * (including : and - separators).
   * @return {String}
   */
  toString() {
    let result = this.year + "-" + pad2(this.month) + "-" + pad2(this.day);
    if (!this.isDate) {
      result += "T" + pad2(this.hour) + ":" + pad2(this.minute) + ":" + pad2(this.second);
      if (this.zone === Timezone$1.utcTimezone) {
        result += "Z";
      }
    }
    return result;
  }
  /**
   * Converts the current instance to a Javascript date
   * @return {Date}
   */
  toJSDate() {
    if (this.zone == Timezone$1.localTimezone) {
      if (this.isDate) {
        return new Date(this.year, this.month - 1, this.day);
      } else {
        return new Date(
          this.year,
          this.month - 1,
          this.day,
          this.hour,
          this.minute,
          this.second,
          0
        );
      }
    } else {
      return new Date(this.toUnixTime() * 1e3);
    }
  }
  _normalize() {
    if (this._time.isDate) {
      this._time.hour = 0;
      this._time.minute = 0;
      this._time.second = 0;
    }
    this.adjust(0, 0, 0, 0);
    return this;
  }
  /**
   * Adjust the date/time by the given offset
   *
   * @param {Number} aExtraDays       The extra amount of days
   * @param {Number} aExtraHours      The extra amount of hours
   * @param {Number} aExtraMinutes    The extra amount of minutes
   * @param {Number} aExtraSeconds    The extra amount of seconds
   * @param {Number=} aTime           The time to adjust, defaults to the
   *                                    current instance.
   */
  adjust(aExtraDays, aExtraHours, aExtraMinutes, aExtraSeconds, aTime) {
    let minutesOverflow, hoursOverflow, daysOverflow = 0, yearsOverflow = 0;
    let second, minute, hour, day;
    let daysInMonth;
    let time = aTime || this._time;
    if (!time.isDate) {
      second = time.second + aExtraSeconds;
      time.second = second % 60;
      minutesOverflow = trunc(second / 60);
      if (time.second < 0) {
        time.second += 60;
        minutesOverflow--;
      }
      minute = time.minute + aExtraMinutes + minutesOverflow;
      time.minute = minute % 60;
      hoursOverflow = trunc(minute / 60);
      if (time.minute < 0) {
        time.minute += 60;
        hoursOverflow--;
      }
      hour = time.hour + aExtraHours + hoursOverflow;
      time.hour = hour % 24;
      daysOverflow = trunc(hour / 24);
      if (time.hour < 0) {
        time.hour += 24;
        daysOverflow--;
      }
    }
    if (time.month > 12) {
      yearsOverflow = trunc((time.month - 1) / 12);
    } else if (time.month < 1) {
      yearsOverflow = trunc(time.month / 12) - 1;
    }
    time.year += yearsOverflow;
    time.month -= 12 * yearsOverflow;
    day = time.day + aExtraDays + daysOverflow;
    if (day > 0) {
      for (; ; ) {
        daysInMonth = Time.daysInMonth(time.month, time.year);
        if (day <= daysInMonth) {
          break;
        }
        time.month++;
        if (time.month > 12) {
          time.year++;
          time.month = 1;
        }
        day -= daysInMonth;
      }
    } else {
      while (day <= 0) {
        if (time.month == 1) {
          time.year--;
          time.month = 12;
        } else {
          time.month--;
        }
        day += Time.daysInMonth(time.month, time.year);
      }
    }
    time.day = day;
    this._cachedUnixTime = null;
    return this;
  }
  /**
   * Sets up the current instance from unix time, the number of seconds since
   * January 1st, 1970.
   *
   * @param {Number} seconds      The seconds to set up with
   */
  fromUnixTime(seconds) {
    this.zone = Timezone$1.utcTimezone;
    let date = new Date(seconds * 1e3);
    this.year = date.getUTCFullYear();
    this.month = date.getUTCMonth() + 1;
    this.day = date.getUTCDate();
    if (this._time.isDate) {
      this.hour = 0;
      this.minute = 0;
      this.second = 0;
    } else {
      this.hour = date.getUTCHours();
      this.minute = date.getUTCMinutes();
      this.second = date.getUTCSeconds();
    }
    this._cachedUnixTime = null;
  }
  /**
   * Converts the current instance to seconds since January 1st 1970.
   *
   * @return {Number}         Seconds since 1970
   */
  toUnixTime() {
    if (this._cachedUnixTime !== null) {
      return this._cachedUnixTime;
    }
    let offset = this.utcOffset();
    let ms = Date.UTC(
      this.year,
      this.month - 1,
      this.day,
      this.hour,
      this.minute,
      this.second - offset
    );
    this._cachedUnixTime = ms / 1e3;
    return this._cachedUnixTime;
  }
  /**
   * Converts time to into Object which can be serialized then re-created
   * using the constructor.
   *
   * @example
   * // toJSON will automatically be called
   * var json = JSON.stringify(mytime);
   *
   * var deserialized = JSON.parse(json);
   *
   * var time = new ICAL.Time(deserialized);
   *
   * @return {Object}
   */
  toJSON() {
    let copy = [
      "year",
      "month",
      "day",
      "hour",
      "minute",
      "second",
      "isDate"
    ];
    let result = /* @__PURE__ */ Object.create(null);
    let i = 0;
    let len = copy.length;
    let prop;
    for (; i < len; i++) {
      prop = copy[i];
      result[prop] = this[prop];
    }
    if (this.zone) {
      result.timezone = this.zone.tzid;
    }
    return result;
  }
}
(function setupNormalizeAttributes() {
  function defineAttr(attr) {
    Object.defineProperty(Time.prototype, attr, {
      get: function getTimeAttr() {
        if (this._pendingNormalization) {
          this._normalize();
          this._pendingNormalization = false;
        }
        return this._time[attr];
      },
      set: function setTimeAttr(val) {
        if (attr === "isDate" && val && !this._time.isDate) {
          this.adjust(0, 0, 0, 0);
        }
        this._cachedUnixTime = null;
        this._pendingNormalization = true;
        this._time[attr] = val;
      }
    });
  }
  defineAttr("year");
  defineAttr("month");
  defineAttr("day");
  defineAttr("hour");
  defineAttr("minute");
  defineAttr("second");
  defineAttr("isDate");
})();
const CHAR = /[^ \t]/;
const VALUE_DELIMITER = ":";
const PARAM_DELIMITER = ";";
const PARAM_NAME_DELIMITER = "=";
const DEFAULT_VALUE_TYPE$1 = "unknown";
const DEFAULT_PARAM_TYPE = "text";
const RFC6868_REPLACE_MAP$1 = { "^'": '"', "^n": "\n", "^^": "^" };
function parse$1(input) {
  let state = {};
  let root = state.component = [];
  state.stack = [root];
  parse$1._eachLine(input, function(err, line) {
    parse$1._handleContentLine(line, state);
  });
  if (state.stack.length > 1) {
    throw new ParserError(
      "invalid ical body. component began but did not end"
    );
  }
  state = null;
  return root.length == 1 ? root[0] : root;
}
parse$1.property = function(str, designSet) {
  let state = {
    component: [[], []],
    designSet: designSet || design$1.defaultSet
  };
  parse$1._handleContentLine(str, state);
  return state.component[1][0];
};
parse$1.component = function(str) {
  return parse$1(str);
};
class ParserError extends Error {
  name = this.constructor.name;
}
parse$1.ParserError = ParserError;
parse$1._handleContentLine = function(line, state) {
  let valuePos = line.indexOf(VALUE_DELIMITER);
  let paramPos = line.indexOf(PARAM_DELIMITER);
  let lastParamIndex;
  let lastValuePos;
  let name;
  let value3;
  let params = {};
  if (paramPos !== -1 && valuePos !== -1) {
    if (paramPos > valuePos) {
      paramPos = -1;
    }
  }
  let parsedParams;
  if (paramPos !== -1) {
    name = line.slice(0, Math.max(0, paramPos)).toLowerCase();
    parsedParams = parse$1._parseParameters(line.slice(Math.max(0, paramPos)), 0, state.designSet);
    if (parsedParams[2] == -1) {
      throw new ParserError("Invalid parameters in '" + line + "'");
    }
    params = parsedParams[0];
    lastParamIndex = parsedParams[1].length + parsedParams[2] + paramPos;
    if ((lastValuePos = line.slice(Math.max(0, lastParamIndex)).indexOf(VALUE_DELIMITER)) !== -1) {
      value3 = line.slice(Math.max(0, lastParamIndex + lastValuePos + 1));
    } else {
      throw new ParserError("Missing parameter value in '" + line + "'");
    }
  } else if (valuePos !== -1) {
    name = line.slice(0, Math.max(0, valuePos)).toLowerCase();
    value3 = line.slice(Math.max(0, valuePos + 1));
    if (name === "begin") {
      let newComponent = [value3.toLowerCase(), [], []];
      if (state.stack.length === 1) {
        state.component.push(newComponent);
      } else {
        state.component[2].push(newComponent);
      }
      state.stack.push(state.component);
      state.component = newComponent;
      if (!state.designSet) {
        state.designSet = design$1.getDesignSet(state.component[0]);
      }
      return;
    } else if (name === "end") {
      state.component = state.stack.pop();
      return;
    }
  } else {
    throw new ParserError(
      'invalid line (no token ";" or ":") "' + line + '"'
    );
  }
  let valueType;
  let multiValue = false;
  let structuredValue = false;
  let propertyDetails;
  let splitName;
  let ungroupedName;
  if (state.designSet.propertyGroups && name.indexOf(".") !== -1) {
    splitName = name.split(".");
    params.group = splitName[0];
    ungroupedName = splitName[1];
  } else {
    ungroupedName = name;
  }
  if (ungroupedName in state.designSet.property) {
    propertyDetails = state.designSet.property[ungroupedName];
    if ("multiValue" in propertyDetails) {
      multiValue = propertyDetails.multiValue;
    }
    if ("structuredValue" in propertyDetails) {
      structuredValue = propertyDetails.structuredValue;
    }
    if (value3 && "detectType" in propertyDetails) {
      valueType = propertyDetails.detectType(value3);
    }
  }
  if (!valueType) {
    if (!("value" in params)) {
      if (propertyDetails) {
        valueType = propertyDetails.defaultType;
      } else {
        valueType = DEFAULT_VALUE_TYPE$1;
      }
    } else {
      valueType = params.value.toLowerCase();
    }
  }
  delete params.value;
  let result;
  if (multiValue && structuredValue) {
    value3 = parse$1._parseMultiValue(value3, structuredValue, valueType, [], multiValue, state.designSet, structuredValue);
    result = [ungroupedName, params, valueType, value3];
  } else if (multiValue) {
    result = [ungroupedName, params, valueType];
    parse$1._parseMultiValue(value3, multiValue, valueType, result, null, state.designSet, false);
  } else if (structuredValue) {
    value3 = parse$1._parseMultiValue(value3, structuredValue, valueType, [], null, state.designSet, structuredValue);
    result = [ungroupedName, params, valueType, value3];
  } else {
    value3 = parse$1._parseValue(value3, valueType, state.designSet, false);
    result = [ungroupedName, params, valueType, value3];
  }
  if (state.component[0] === "vcard" && state.component[1].length === 0 && !(name === "version" && value3 === "4.0")) {
    state.designSet = design$1.getDesignSet("vcard3");
  }
  state.component[1].push(result);
};
parse$1._parseValue = function(value3, type, designSet, structuredValue) {
  if (type in designSet.value && "fromICAL" in designSet.value[type]) {
    return designSet.value[type].fromICAL(value3, structuredValue);
  }
  return value3;
};
parse$1._parseParameters = function(line, start, designSet) {
  let lastParam = start;
  let pos = 0;
  let delim = PARAM_NAME_DELIMITER;
  let result = {};
  let name, lcname;
  let value3, valuePos = -1;
  let type, multiValue, mvdelim;
  while (pos !== false && (pos = line.indexOf(delim, pos + 1)) !== -1) {
    name = line.slice(lastParam + 1, pos);
    if (name.length == 0) {
      throw new ParserError("Empty parameter name in '" + line + "'");
    }
    lcname = name.toLowerCase();
    mvdelim = false;
    multiValue = false;
    if (lcname in designSet.param && designSet.param[lcname].valueType) {
      type = designSet.param[lcname].valueType;
    } else {
      type = DEFAULT_PARAM_TYPE;
    }
    if (lcname in designSet.param) {
      multiValue = designSet.param[lcname].multiValue;
      if (designSet.param[lcname].multiValueSeparateDQuote) {
        mvdelim = parse$1._rfc6868Escape('"' + multiValue + '"');
      }
    }
    let nextChar = line[pos + 1];
    if (nextChar === '"') {
      valuePos = pos + 2;
      pos = line.indexOf('"', valuePos);
      if (multiValue && pos != -1) {
        let extendedValue = true;
        while (extendedValue) {
          if (line[pos + 1] == multiValue && line[pos + 2] == '"') {
            pos = line.indexOf('"', pos + 3);
          } else {
            extendedValue = false;
          }
        }
      }
      if (pos === -1) {
        throw new ParserError(
          'invalid line (no matching double quote) "' + line + '"'
        );
      }
      value3 = line.slice(valuePos, pos);
      lastParam = line.indexOf(PARAM_DELIMITER, pos);
      let propValuePos = line.indexOf(VALUE_DELIMITER, pos);
      if (lastParam === -1 || propValuePos !== -1 && lastParam > propValuePos) {
        pos = false;
      }
    } else {
      valuePos = pos + 1;
      let nextPos = line.indexOf(PARAM_DELIMITER, valuePos);
      let propValuePos = line.indexOf(VALUE_DELIMITER, valuePos);
      if (propValuePos !== -1 && nextPos > propValuePos) {
        nextPos = propValuePos;
        pos = false;
      } else if (nextPos === -1) {
        if (propValuePos === -1) {
          nextPos = line.length;
        } else {
          nextPos = propValuePos;
        }
        pos = false;
      } else {
        lastParam = nextPos;
        pos = nextPos;
      }
      value3 = line.slice(valuePos, nextPos);
    }
    const length_before = value3.length;
    value3 = parse$1._rfc6868Escape(value3);
    valuePos += length_before - value3.length;
    if (multiValue) {
      let delimiter = mvdelim || multiValue;
      value3 = parse$1._parseMultiValue(value3, delimiter, type, [], null, designSet);
    } else {
      value3 = parse$1._parseValue(value3, type, designSet);
    }
    if (multiValue && lcname in result) {
      if (Array.isArray(result[lcname])) {
        result[lcname].push(value3);
      } else {
        result[lcname] = [
          result[lcname],
          value3
        ];
      }
    } else {
      result[lcname] = value3;
    }
  }
  return [result, value3, valuePos];
};
parse$1._rfc6868Escape = function(val) {
  return val.replace(/\^['n^]/g, function(x2) {
    return RFC6868_REPLACE_MAP$1[x2];
  });
};
parse$1._parseMultiValue = function(buffer, delim, type, result, innerMulti, designSet, structuredValue) {
  let pos = 0;
  let lastPos = 0;
  let value3;
  if (delim.length === 0) {
    return buffer;
  }
  while ((pos = unescapedIndexOf(buffer, delim, lastPos)) !== -1) {
    value3 = buffer.slice(lastPos, pos);
    if (innerMulti) {
      value3 = parse$1._parseMultiValue(value3, innerMulti, type, [], null, designSet, structuredValue);
    } else {
      value3 = parse$1._parseValue(value3, type, designSet, structuredValue);
    }
    result.push(value3);
    lastPos = pos + delim.length;
  }
  value3 = buffer.slice(lastPos);
  if (innerMulti) {
    value3 = parse$1._parseMultiValue(value3, innerMulti, type, [], null, designSet, structuredValue);
  } else {
    value3 = parse$1._parseValue(value3, type, designSet, structuredValue);
  }
  result.push(value3);
  return result.length == 1 ? result[0] : result;
};
parse$1._eachLine = function(buffer, callback) {
  let len = buffer.length;
  let lastPos = buffer.search(CHAR);
  let pos = lastPos;
  let line;
  let firstChar;
  let newlineOffset;
  do {
    pos = buffer.indexOf("\n", lastPos) + 1;
    if (pos > 1 && buffer[pos - 2] === "\r") {
      newlineOffset = 2;
    } else {
      newlineOffset = 1;
    }
    if (pos === 0) {
      pos = len;
      newlineOffset = 0;
    }
    firstChar = buffer[lastPos];
    if (firstChar === " " || firstChar === "	") {
      line += buffer.slice(lastPos + 1, pos - newlineOffset);
    } else {
      if (line)
        callback(null, line);
      line = buffer.slice(lastPos, pos - newlineOffset);
    }
    lastPos = pos;
  } while (pos !== len);
  line = line.trim();
  if (line.length)
    callback(null, line);
};
const OPTIONS = ["tzid", "location", "tznames", "latitude", "longitude"];
let Timezone$1 = class Timezone {
  static _compare_change_fn(a2, b) {
    if (a2.year < b.year) return -1;
    else if (a2.year > b.year) return 1;
    if (a2.month < b.month) return -1;
    else if (a2.month > b.month) return 1;
    if (a2.day < b.day) return -1;
    else if (a2.day > b.day) return 1;
    if (a2.hour < b.hour) return -1;
    else if (a2.hour > b.hour) return 1;
    if (a2.minute < b.minute) return -1;
    else if (a2.minute > b.minute) return 1;
    if (a2.second < b.second) return -1;
    else if (a2.second > b.second) return 1;
    return 0;
  }
  /**
   * Convert the date/time from one zone to the next.
   *
   * @param {Time} tt                  The time to convert
   * @param {Timezone} from_zone       The source zone to convert from
   * @param {Timezone} to_zone         The target zone to convert to
   * @return {Time}                    The converted date/time object
   */
  static convert_time(tt, from_zone, to_zone) {
    if (tt.isDate || from_zone.tzid == to_zone.tzid || from_zone == Timezone.localTimezone || to_zone == Timezone.localTimezone) {
      tt.zone = to_zone;
      return tt;
    }
    let utcOffset = from_zone.utcOffset(tt);
    tt.adjust(0, 0, 0, -utcOffset);
    utcOffset = to_zone.utcOffset(tt);
    tt.adjust(0, 0, 0, utcOffset);
    return null;
  }
  /**
   * Creates a new ICAL.Timezone instance from the passed data object.
   *
   * @param {Component|Object} aData options for class
   * @param {String|Component} aData.component
   *        If aData is a simple object, then this member can be set to either a
   *        string containing the component data, or an already parsed
   *        ICAL.Component
   * @param {String} aData.tzid      The timezone identifier
   * @param {String} aData.location  The timezone locationw
   * @param {String} aData.tznames   An alternative string representation of the
   *                                  timezone
   * @param {Number} aData.latitude  The latitude of the timezone
   * @param {Number} aData.longitude The longitude of the timezone
   */
  static fromData(aData) {
    let tt = new Timezone();
    return tt.fromData(aData);
  }
  /**
   * The instance describing the UTC timezone
   * @type {Timezone}
   * @constant
   * @instance
   */
  static #utcTimezone = null;
  static get utcTimezone() {
    if (!this.#utcTimezone) {
      this.#utcTimezone = Timezone.fromData({
        tzid: "UTC"
      });
    }
    return this.#utcTimezone;
  }
  /**
   * The instance describing the local timezone
   * @type {Timezone}
   * @constant
   * @instance
   */
  static #localTimezone = null;
  static get localTimezone() {
    if (!this.#localTimezone) {
      this.#localTimezone = Timezone.fromData({
        tzid: "floating"
      });
    }
    return this.#localTimezone;
  }
  /**
   * Adjust a timezone change object.
   * @private
   * @param {Object} change     The timezone change object
   * @param {Number} days       The extra amount of days
   * @param {Number} hours      The extra amount of hours
   * @param {Number} minutes    The extra amount of minutes
   * @param {Number} seconds    The extra amount of seconds
   */
  static adjust_change(change, days2, hours, minutes, seconds) {
    return Time.prototype.adjust.call(
      change,
      days2,
      hours,
      minutes,
      seconds,
      change
    );
  }
  static _minimumExpansionYear = -1;
  static EXTRA_COVERAGE = 5;
  /**
   * Creates a new ICAL.Timezone instance, by passing in a tzid and component.
   *
   * @param {Component|Object} data options for class
   * @param {String|Component} data.component
   *        If data is a simple object, then this member can be set to either a
   *        string containing the component data, or an already parsed
   *        ICAL.Component
   * @param {String} data.tzid      The timezone identifier
   * @param {String} data.location  The timezone locationw
   * @param {String} data.tznames   An alternative string representation of the
   *                                  timezone
   * @param {Number} data.latitude  The latitude of the timezone
   * @param {Number} data.longitude The longitude of the timezone
   */
  constructor(data10) {
    this.wrappedJSObject = this;
    this.fromData(data10);
  }
  /**
   * Timezone identifier
   * @type {String}
   */
  tzid = "";
  /**
   * Timezone location
   * @type {String}
   */
  location = "";
  /**
   * Alternative timezone name, for the string representation
   * @type {String}
   */
  tznames = "";
  /**
   * The primary latitude for the timezone.
   * @type {Number}
   */
  latitude = 0;
  /**
   * The primary longitude for the timezone.
   * @type {Number}
   */
  longitude = 0;
  /**
   * The vtimezone component for this timezone.
   * @type {Component}
   */
  component = null;
  /**
   * The year this timezone has been expanded to. All timezone transition
   * dates until this year are known and can be used for calculation
   *
   * @private
   * @type {Number}
   */
  expandedUntilYear = 0;
  /**
   * The class identifier.
   * @constant
   * @type {String}
   * @default "icaltimezone"
   */
  icalclass = "icaltimezone";
  /**
   * Sets up the current instance using members from the passed data object.
   *
   * @param {Component|Object} aData options for class
   * @param {String|Component} aData.component
   *        If aData is a simple object, then this member can be set to either a
   *        string containing the component data, or an already parsed
   *        ICAL.Component
   * @param {String} aData.tzid      The timezone identifier
   * @param {String} aData.location  The timezone locationw
   * @param {String} aData.tznames   An alternative string representation of the
   *                                  timezone
   * @param {Number} aData.latitude  The latitude of the timezone
   * @param {Number} aData.longitude The longitude of the timezone
   */
  fromData(aData) {
    this.expandedUntilYear = 0;
    this.changes = [];
    if (aData instanceof Component) {
      this.component = aData;
    } else {
      if (aData && "component" in aData) {
        if (typeof aData.component == "string") {
          let jCal = parse$1(aData.component);
          this.component = new Component(jCal);
        } else if (aData.component instanceof Component) {
          this.component = aData.component;
        } else {
          this.component = null;
        }
      }
      for (let prop of OPTIONS) {
        if (aData && prop in aData) {
          this[prop] = aData[prop];
        }
      }
    }
    if (this.component instanceof Component && !this.tzid) {
      this.tzid = this.component.getFirstPropertyValue("tzid");
    }
    return this;
  }
  /**
   * Finds the utcOffset the given time would occur in this timezone.
   *
   * @param {Time} tt         The time to check for
   * @return {Number}         utc offset in seconds
   */
  utcOffset(tt) {
    if (this == Timezone.utcTimezone || this == Timezone.localTimezone) {
      return 0;
    }
    this._ensureCoverage(tt.year);
    if (!this.changes.length) {
      return 0;
    }
    let tt_change = {
      year: tt.year,
      month: tt.month,
      day: tt.day,
      hour: tt.hour,
      minute: tt.minute,
      second: tt.second
    };
    let change_num = this._findNearbyChange(tt_change);
    let change_num_to_use = -1;
    let step = 1;
    for (; ; ) {
      let change = clone(this.changes[change_num], true);
      if (change.utcOffset < change.prevUtcOffset) {
        Timezone.adjust_change(change, 0, 0, 0, change.utcOffset);
      } else {
        Timezone.adjust_change(
          change,
          0,
          0,
          0,
          change.prevUtcOffset
        );
      }
      let cmp = Timezone._compare_change_fn(tt_change, change);
      if (cmp >= 0) {
        change_num_to_use = change_num;
      } else {
        step = -1;
      }
      if (step == -1 && change_num_to_use != -1) {
        break;
      }
      change_num += step;
      if (change_num < 0) {
        return 0;
      }
      if (change_num >= this.changes.length) {
        break;
      }
    }
    let zone_change = this.changes[change_num_to_use];
    let utcOffset_change = zone_change.utcOffset - zone_change.prevUtcOffset;
    if (utcOffset_change < 0 && change_num_to_use > 0) {
      let tmp_change = clone(zone_change, true);
      Timezone.adjust_change(tmp_change, 0, 0, 0, tmp_change.prevUtcOffset);
      if (Timezone._compare_change_fn(tt_change, tmp_change) < 0) {
        let prev_zone_change = this.changes[change_num_to_use - 1];
        let want_daylight = false;
        if (zone_change.is_daylight != want_daylight && prev_zone_change.is_daylight == want_daylight) {
          zone_change = prev_zone_change;
        }
      }
    }
    return zone_change.utcOffset;
  }
  _findNearbyChange(change) {
    let idx = binsearchInsert(
      this.changes,
      change,
      Timezone._compare_change_fn
    );
    if (idx >= this.changes.length) {
      return this.changes.length - 1;
    }
    return idx;
  }
  _ensureCoverage(aYear) {
    if (Timezone._minimumExpansionYear == -1) {
      let today = Time.now();
      Timezone._minimumExpansionYear = today.year;
    }
    let changesEndYear = aYear;
    if (changesEndYear < Timezone._minimumExpansionYear) {
      changesEndYear = Timezone._minimumExpansionYear;
    }
    changesEndYear += Timezone.EXTRA_COVERAGE;
    if (!this.changes.length || this.expandedUntilYear < aYear) {
      let subcomps = this.component.getAllSubcomponents();
      let compLen = subcomps.length;
      let compIdx = 0;
      for (; compIdx < compLen; compIdx++) {
        this._expandComponent(
          subcomps[compIdx],
          changesEndYear,
          this.changes
        );
      }
      this.changes.sort(Timezone._compare_change_fn);
      this.expandedUntilYear = changesEndYear;
    }
  }
  _expandComponent(aComponent, aYear, changes) {
    if (!aComponent.hasProperty("dtstart") || !aComponent.hasProperty("tzoffsetto") || !aComponent.hasProperty("tzoffsetfrom")) {
      return null;
    }
    let dtstart = aComponent.getFirstProperty("dtstart").getFirstValue();
    let change;
    function convert_tzoffset(offset) {
      return offset.factor * (offset.hours * 3600 + offset.minutes * 60);
    }
    function init_changes() {
      let changebase = {};
      changebase.is_daylight = aComponent.name == "daylight";
      changebase.utcOffset = convert_tzoffset(
        aComponent.getFirstProperty("tzoffsetto").getFirstValue()
      );
      changebase.prevUtcOffset = convert_tzoffset(
        aComponent.getFirstProperty("tzoffsetfrom").getFirstValue()
      );
      return changebase;
    }
    if (!aComponent.hasProperty("rrule") && !aComponent.hasProperty("rdate")) {
      change = init_changes();
      change.year = dtstart.year;
      change.month = dtstart.month;
      change.day = dtstart.day;
      change.hour = dtstart.hour;
      change.minute = dtstart.minute;
      change.second = dtstart.second;
      Timezone.adjust_change(change, 0, 0, 0, -change.prevUtcOffset);
      changes.push(change);
    } else {
      let props = aComponent.getAllProperties("rdate");
      for (let rdate of props) {
        let time = rdate.getFirstValue();
        change = init_changes();
        change.year = time.year;
        change.month = time.month;
        change.day = time.day;
        if (time.isDate) {
          change.hour = dtstart.hour;
          change.minute = dtstart.minute;
          change.second = dtstart.second;
          if (dtstart.zone != Timezone.utcTimezone) {
            Timezone.adjust_change(change, 0, 0, 0, -change.prevUtcOffset);
          }
        } else {
          change.hour = time.hour;
          change.minute = time.minute;
          change.second = time.second;
          if (time.zone != Timezone.utcTimezone) {
            Timezone.adjust_change(change, 0, 0, 0, -change.prevUtcOffset);
          }
        }
        changes.push(change);
      }
      let rrule = aComponent.getFirstProperty("rrule");
      if (rrule) {
        rrule = rrule.getFirstValue();
        change = init_changes();
        if (rrule.until && rrule.until.zone == Timezone.utcTimezone) {
          rrule.until.adjust(0, 0, 0, change.prevUtcOffset);
          rrule.until.zone = Timezone.localTimezone;
        }
        let iterator = rrule.iterator(dtstart);
        let occ;
        while (occ = iterator.next()) {
          change = init_changes();
          if (occ.year > aYear || !occ) {
            break;
          }
          change.year = occ.year;
          change.month = occ.month;
          change.day = occ.day;
          change.hour = occ.hour;
          change.minute = occ.minute;
          change.second = occ.second;
          change.isDate = occ.isDate;
          Timezone.adjust_change(change, 0, 0, 0, -change.prevUtcOffset);
          changes.push(change);
        }
      }
    }
    return changes;
  }
  /**
   * The string representation of this timezone.
   * @return {String}
   */
  toString() {
    return this.tznames ? this.tznames : this.tzid;
  }
};
let zones$1 = null;
const TimezoneService = {
  get count() {
    if (zones$1 === null) {
      return 0;
    }
    return Object.keys(zones$1).length;
  },
  reset: function() {
    zones$1 = /* @__PURE__ */ Object.create(null);
    let utc = Timezone$1.utcTimezone;
    zones$1.Z = utc;
    zones$1.UTC = utc;
    zones$1.GMT = utc;
  },
  _hard_reset: function() {
    zones$1 = null;
  },
  /**
   * Checks if timezone id has been registered.
   *
   * @param {String} tzid     Timezone identifier (e.g. America/Los_Angeles)
   * @return {Boolean}        False, when not present
   */
  has: function(tzid) {
    if (zones$1 === null) {
      return false;
    }
    return !!zones$1[tzid];
  },
  /**
   * Returns a timezone by its tzid if present.
   *
   * @param {String} tzid               Timezone identifier (e.g. America/Los_Angeles)
   * @return {Timezone | undefined}     The timezone, or undefined if not found
   */
  get: function(tzid) {
    if (zones$1 === null) {
      this.reset();
    }
    return zones$1[tzid];
  },
  /**
   * Registers a timezone object or component.
   *
   * @param {Component|Timezone} timezone
   *        The initialized zone or vtimezone.
   *
   * @param {String=} name
   *        The name of the timezone. Defaults to the component's TZID if not
   *        passed.
   */
  register: function(timezone, name) {
    if (zones$1 === null) {
      this.reset();
    }
    if (typeof timezone === "string" && name instanceof Timezone$1) {
      [timezone, name] = [name, timezone];
    }
    if (!name) {
      if (timezone instanceof Timezone$1) {
        name = timezone.tzid;
      } else {
        if (timezone.name === "vtimezone") {
          timezone = new Timezone$1(timezone);
          name = timezone.tzid;
        }
      }
    }
    if (!name) {
      throw new TypeError("Neither a timezone nor a name was passed");
    }
    if (timezone instanceof Timezone$1) {
      zones$1[name] = timezone;
    } else {
      throw new TypeError("timezone must be ICAL.Timezone or ICAL.Component");
    }
  },
  /**
   * Removes a timezone by its tzid from the list.
   *
   * @param {String} tzid     Timezone identifier (e.g. America/Los_Angeles)
   * @return {?Timezone}      The removed timezone, or null if not registered
   */
  remove: function(tzid) {
    if (zones$1 === null) {
      return null;
    }
    return delete zones$1[tzid];
  }
};
function updateTimezones(vcal) {
  let allsubs, properties, vtimezones, reqTzid, i;
  if (!vcal || vcal.name !== "vcalendar") {
    return vcal;
  }
  allsubs = vcal.getAllSubcomponents();
  properties = [];
  vtimezones = {};
  for (i = 0; i < allsubs.length; i++) {
    if (allsubs[i].name === "vtimezone") {
      let tzid = allsubs[i].getFirstProperty("tzid").getFirstValue();
      vtimezones[tzid] = allsubs[i];
    } else {
      properties = properties.concat(allsubs[i].getAllProperties());
    }
  }
  reqTzid = {};
  for (i = 0; i < properties.length; i++) {
    let tzid = properties[i].getParameter("tzid");
    if (tzid) {
      reqTzid[tzid] = true;
    }
  }
  for (let [tzid, comp] of Object.entries(vtimezones)) {
    if (!reqTzid[tzid]) {
      vcal.removeSubcomponent(comp);
    }
  }
  for (let tzid of Object.keys(reqTzid)) {
    if (!vtimezones[tzid] && TimezoneService.has(tzid)) {
      vcal.addSubcomponent(TimezoneService.get(tzid).component);
    }
  }
  return vcal;
}
function isStrictlyNaN(number) {
  return typeof number === "number" && isNaN(number);
}
function strictParseInt(string) {
  let result = parseInt(string, 10);
  if (isStrictlyNaN(result)) {
    throw new Error(
      'Could not extract integer from "' + string + '"'
    );
  }
  return result;
}
function formatClassType(data10, type) {
  if (typeof data10 === "undefined") {
    return void 0;
  }
  if (data10 instanceof type) {
    return data10;
  }
  return new type(data10);
}
function unescapedIndexOf(buffer, search, pos) {
  while ((pos = buffer.indexOf(search, pos)) !== -1) {
    if (pos > 0 && buffer[pos - 1] === "\\") {
      pos += 1;
    } else {
      return pos;
    }
  }
  return -1;
}
function binsearchInsert(list2, seekVal, cmpfunc) {
  if (!list2.length)
    return 0;
  let low = 0, high = list2.length - 1, mid, cmpval;
  while (low <= high) {
    mid = low + Math.floor((high - low) / 2);
    cmpval = cmpfunc(seekVal, list2[mid]);
    if (cmpval < 0)
      high = mid - 1;
    else if (cmpval > 0)
      low = mid + 1;
    else
      break;
  }
  if (cmpval < 0)
    return mid;
  else if (cmpval > 0)
    return mid + 1;
  else
    return mid;
}
function clone(aSrc, aDeep) {
  if (!aSrc || typeof aSrc != "object") {
    return aSrc;
  } else if (aSrc instanceof Date) {
    return new Date(aSrc.getTime());
  } else if ("clone" in aSrc) {
    return aSrc.clone();
  } else if (Array.isArray(aSrc)) {
    let arr = [];
    for (let i = 0; i < aSrc.length; i++) {
      arr.push(aDeep ? clone(aSrc[i], true) : aSrc[i]);
    }
    return arr;
  } else {
    let obj = {};
    for (let [name, value3] of Object.entries(aSrc)) {
      if (aDeep) {
        obj[name] = clone(value3, true);
      } else {
        obj[name] = value3;
      }
    }
    return obj;
  }
}
function foldline(aLine) {
  let result = "";
  let line = aLine || "", pos = 0, line_length = 0;
  while (line.length) {
    let cp = line.codePointAt(pos);
    if (cp < 128) ++line_length;
    else if (cp < 2048) line_length += 2;
    else if (cp < 65536) line_length += 3;
    else line_length += 4;
    if (line_length < ICALmodule.foldLength + 1)
      pos += cp > 65535 ? 2 : 1;
    else {
      result += ICALmodule.newLineChar + " " + line.slice(0, Math.max(0, pos));
      line = line.slice(Math.max(0, pos));
      pos = line_length = 0;
    }
  }
  return result.slice(ICALmodule.newLineChar.length + 1);
}
function pad2(data10) {
  if (typeof data10 !== "string") {
    if (typeof data10 === "number") {
      data10 = parseInt(data10);
    }
    data10 = String(data10);
  }
  let len = data10.length;
  switch (len) {
    case 0:
      return "00";
    case 1:
      return "0" + data10;
    default:
      return data10;
  }
}
function trunc(number) {
  return number < 0 ? Math.ceil(number) : Math.floor(number);
}
function extend(source, target) {
  for (let key in source) {
    let descr = Object.getOwnPropertyDescriptor(source, key);
    if (descr && !Object.getOwnPropertyDescriptor(target, key)) {
      Object.defineProperty(target, key, descr);
    }
  }
  return target;
}
var helpers = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  updateTimezones,
  isStrictlyNaN,
  strictParseInt,
  formatClassType,
  unescapedIndexOf,
  binsearchInsert,
  clone,
  foldline,
  pad2,
  trunc,
  extend
});
class UtcOffset {
  /**
   * Creates a new {@link ICAL.UtcOffset} instance from the passed string.
   *
   * @param {String} aString    The string to parse
   * @return {Duration}         The created utc-offset instance
   */
  static fromString(aString) {
    let options = {};
    options.factor = aString[0] === "+" ? 1 : -1;
    options.hours = strictParseInt(aString.slice(1, 3));
    options.minutes = strictParseInt(aString.slice(4, 6));
    return new UtcOffset(options);
  }
  /**
   * Creates a new {@link ICAL.UtcOffset} instance from the passed seconds
   * value.
   *
   * @param {Number} aSeconds       The number of seconds to convert
   */
  static fromSeconds(aSeconds) {
    let instance = new UtcOffset();
    instance.fromSeconds(aSeconds);
    return instance;
  }
  /**
   * Creates a new ICAL.UtcOffset instance.
   *
   * @param {Object} aData          An object with members of the utc offset
   * @param {Number=} aData.hours   The hours for the utc offset
   * @param {Number=} aData.minutes The minutes in the utc offset
   * @param {Number=} aData.factor  The factor for the utc-offset, either -1 or 1
   */
  constructor(aData) {
    this.fromData(aData);
  }
  /**
   * The hours in the utc-offset
   * @type {Number}
   */
  hours = 0;
  /**
   * The minutes in the utc-offset
   * @type {Number}
   */
  minutes = 0;
  /**
   * The sign of the utc offset, 1 for positive offset, -1 for negative
   * offsets.
   * @type {Number}
   */
  factor = 1;
  /**
   * The type name, to be used in the jCal object.
   * @constant
   * @type {String}
   * @default "utc-offset"
   */
  icaltype = "utc-offset";
  /**
   * Returns a clone of the utc offset object.
   *
   * @return {UtcOffset}     The cloned object
   */
  clone() {
    return UtcOffset.fromSeconds(this.toSeconds());
  }
  /**
   * Sets up the current instance using members from the passed data object.
   *
   * @param {Object} aData          An object with members of the utc offset
   * @param {Number=} aData.hours   The hours for the utc offset
   * @param {Number=} aData.minutes The minutes in the utc offset
   * @param {Number=} aData.factor  The factor for the utc-offset, either -1 or 1
   */
  fromData(aData) {
    if (aData) {
      for (let [key, value3] of Object.entries(aData)) {
        this[key] = value3;
      }
    }
    this._normalize();
  }
  /**
   * Sets up the current instance from the given seconds value. The seconds
   * value is truncated to the minute. Offsets are wrapped when the world
   * ends, the hour after UTC+14:00 is UTC-12:00.
   *
   * @param {Number} aSeconds         The seconds to convert into an offset
   */
  fromSeconds(aSeconds) {
    let secs = Math.abs(aSeconds);
    this.factor = aSeconds < 0 ? -1 : 1;
    this.hours = trunc(secs / 3600);
    secs -= this.hours * 3600;
    this.minutes = trunc(secs / 60);
    return this;
  }
  /**
   * Convert the current offset to a value in seconds
   *
   * @return {Number}                 The offset in seconds
   */
  toSeconds() {
    return this.factor * (60 * this.minutes + 3600 * this.hours);
  }
  /**
   * Compare this utc offset with another one.
   *
   * @param {UtcOffset} other             The other offset to compare with
   * @return {Number}                     -1, 0 or 1 for less/equal/greater
   */
  compare(other) {
    let a2 = this.toSeconds();
    let b = other.toSeconds();
    return (a2 > b) - (b > a2);
  }
  _normalize() {
    let secs = this.toSeconds();
    let factor = this.factor;
    while (secs < -43200) {
      secs += 97200;
    }
    while (secs > 50400) {
      secs -= 97200;
    }
    this.fromSeconds(secs);
    if (secs == 0) {
      this.factor = factor;
    }
  }
  /**
   * The iCalendar string representation of this utc-offset.
   * @return {String}
   */
  toICALString() {
    return design$1.icalendar.value["utc-offset"].toICAL(this.toString());
  }
  /**
   * The string representation of this utc-offset.
   * @return {String}
   */
  toString() {
    return (this.factor == 1 ? "+" : "-") + pad2(this.hours) + ":" + pad2(this.minutes);
  }
}
class VCardTime extends Time {
  /**
   * Returns a new ICAL.VCardTime instance from a date and/or time string.
   *
   * @param {String} aValue     The string to create from
   * @param {String} aIcalType  The type for this instance, e.g. date-and-or-time
   * @return {VCardTime}        The date/time instance
   */
  static fromDateAndOrTimeString(aValue, aIcalType) {
    function part(v, s2, e) {
      return v ? strictParseInt(v.slice(s2, s2 + e)) : null;
    }
    let parts = aValue.split("T");
    let dt = parts[0], tmz = parts[1];
    let splitzone = tmz ? design$1.vcard.value.time._splitZone(tmz) : [];
    let zone = splitzone[0], tm = splitzone[1];
    let dtlen = dt ? dt.length : 0;
    let tmlen = tm ? tm.length : 0;
    let hasDashDate = dt && dt[0] == "-" && dt[1] == "-";
    let hasDashTime = tm && tm[0] == "-";
    let o = {
      year: hasDashDate ? null : part(dt, 0, 4),
      month: hasDashDate && (dtlen == 4 || dtlen == 7) ? part(dt, 2, 2) : dtlen == 7 ? part(dt, 5, 2) : dtlen == 10 ? part(dt, 5, 2) : null,
      day: dtlen == 5 ? part(dt, 3, 2) : dtlen == 7 && hasDashDate ? part(dt, 5, 2) : dtlen == 10 ? part(dt, 8, 2) : null,
      hour: hasDashTime ? null : part(tm, 0, 2),
      minute: hasDashTime && tmlen == 3 ? part(tm, 1, 2) : tmlen > 4 ? hasDashTime ? part(tm, 1, 2) : part(tm, 3, 2) : null,
      second: tmlen == 4 ? part(tm, 2, 2) : tmlen == 6 ? part(tm, 4, 2) : tmlen == 8 ? part(tm, 6, 2) : null
    };
    if (zone == "Z") {
      zone = Timezone$1.utcTimezone;
    } else if (zone && zone[3] == ":") {
      zone = UtcOffset.fromString(zone);
    } else {
      zone = null;
    }
    return new VCardTime(o, zone, aIcalType);
  }
  /**
   * Creates a new ICAL.VCardTime instance.
   *
   * @param {Object} data                           The data for the time instance
   * @param {Number=} data.year                     The year for this date
   * @param {Number=} data.month                    The month for this date
   * @param {Number=} data.day                      The day for this date
   * @param {Number=} data.hour                     The hour for this date
   * @param {Number=} data.minute                   The minute for this date
   * @param {Number=} data.second                   The second for this date
   * @param {Timezone|UtcOffset} zone               The timezone to use
   * @param {String} icaltype                       The type for this date/time object
   */
  constructor(data10, zone, icaltype) {
    super(data10, zone);
    this.icaltype = icaltype || "date-and-or-time";
  }
  /**
   * The class identifier.
   * @constant
   * @type {String}
   * @default "vcardtime"
   */
  icalclass = "vcardtime";
  /**
   * The type name, to be used in the jCal object.
   * @type {String}
   * @default "date-and-or-time"
   */
  icaltype = "date-and-or-time";
  /**
   * Returns a clone of the vcard date/time object.
   *
   * @return {VCardTime}     The cloned object
   */
  clone() {
    return new VCardTime(this._time, this.zone, this.icaltype);
  }
  _normalize() {
    return this;
  }
  /**
   * @inheritdoc
   */
  utcOffset() {
    if (this.zone instanceof UtcOffset) {
      return this.zone.toSeconds();
    } else {
      return Time.prototype.utcOffset.apply(this, arguments);
    }
  }
  /**
   * Returns an RFC 6350 compliant representation of this object.
   *
   * @return {String}         vcard date/time string
   */
  toICALString() {
    return design$1.vcard.value[this.icaltype].toICAL(this.toString());
  }
  /**
   * The string representation of this date/time, in jCard form
   * (including : and - separators).
   * @return {String}
   */
  toString() {
    let y = this.year, m2 = this.month, d2 = this.day;
    let h2 = this.hour, mm2 = this.minute, s2 = this.second;
    let hasYear = y !== null, hasMonth = m2 !== null, hasDay = d2 !== null;
    let hasHour = h2 !== null, hasMinute = mm2 !== null, hasSecond = s2 !== null;
    let datepart = (hasYear ? pad2(y) + (hasMonth || hasDay ? "-" : "") : hasMonth || hasDay ? "--" : "") + (hasMonth ? pad2(m2) : "") + (hasDay ? "-" + pad2(d2) : "");
    let timepart = (hasHour ? pad2(h2) : "-") + (hasHour && hasMinute ? ":" : "") + (hasMinute ? pad2(mm2) : "") + (!hasHour && !hasMinute ? "-" : "") + (hasMinute && hasSecond ? ":" : "") + (hasSecond ? pad2(s2) : "");
    let zone;
    if (this.zone === Timezone$1.utcTimezone) {
      zone = "Z";
    } else if (this.zone instanceof UtcOffset) {
      zone = this.zone.toString();
    } else if (this.zone === Timezone$1.localTimezone) {
      zone = "";
    } else if (this.zone instanceof Timezone$1) {
      let offset = UtcOffset.fromSeconds(this.zone.utcOffset(this));
      zone = offset.toString();
    } else {
      zone = "";
    }
    switch (this.icaltype) {
      case "time":
        return timepart + zone;
      case "date-and-or-time":
      case "date-time":
        return datepart + (timepart == "--" ? "" : "T" + timepart + zone);
      case "date":
        return datepart;
    }
    return null;
  }
}
class RecurIterator {
  static _indexMap = {
    "BYSECOND": 0,
    "BYMINUTE": 1,
    "BYHOUR": 2,
    "BYDAY": 3,
    "BYMONTHDAY": 4,
    "BYYEARDAY": 5,
    "BYWEEKNO": 6,
    "BYMONTH": 7,
    "BYSETPOS": 8
  };
  static _expandMap = {
    "SECONDLY": [1, 1, 1, 1, 1, 1, 1, 1],
    "MINUTELY": [2, 1, 1, 1, 1, 1, 1, 1],
    "HOURLY": [2, 2, 1, 1, 1, 1, 1, 1],
    "DAILY": [2, 2, 2, 1, 1, 1, 1, 1],
    "WEEKLY": [2, 2, 2, 2, 3, 3, 1, 1],
    "MONTHLY": [2, 2, 2, 2, 2, 3, 3, 1],
    "YEARLY": [2, 2, 2, 2, 2, 2, 2, 2]
  };
  static UNKNOWN = 0;
  static CONTRACT = 1;
  static EXPAND = 2;
  static ILLEGAL = 3;
  /**
   * Creates a new ICAL.RecurIterator instance. The options object may contain additional members
   * when resuming iteration from a previous run.
   *
   * @param {Object} options                The iterator options
   * @param {Recur} options.rule            The rule to iterate.
   * @param {Time} options.dtstart          The start date of the event.
   * @param {Boolean=} options.initialized  When true, assume that options are
   *        from a previously constructed iterator. Initialization will not be
   *        repeated.
   */
  constructor(options) {
    this.fromData(options);
  }
  /**
   * True when iteration is finished.
   * @type {Boolean}
   */
  completed = false;
  /**
   * The rule that is being iterated
   * @type {Recur}
   */
  rule = null;
  /**
   * The start date of the event being iterated.
   * @type {Time}
   */
  dtstart = null;
  /**
   * The last occurrence that was returned from the
   * {@link RecurIterator#next} method.
   * @type {Time}
   */
  last = null;
  /**
   * The sequence number from the occurrence
   * @type {Number}
   */
  occurrence_number = 0;
  /**
   * The indices used for the {@link ICAL.RecurIterator#by_data} object.
   * @type {Object}
   * @private
   */
  by_indices = null;
  /**
   * If true, the iterator has already been initialized
   * @type {Boolean}
   * @private
   */
  initialized = false;
  /**
   * The initializd by-data.
   * @type {Object}
   * @private
   */
  by_data = null;
  /**
   * The expanded yeardays
   * @type {Array}
   * @private
   */
  days = null;
  /**
   * The index in the {@link ICAL.RecurIterator#days} array.
   * @type {Number}
   * @private
   */
  days_index = 0;
  /**
   * Initialize the recurrence iterator from the passed data object. This
   * method is usually not called directly, you can initialize the iterator
   * through the constructor.
   *
   * @param {Object} options                The iterator options
   * @param {Recur} options.rule            The rule to iterate.
   * @param {Time} options.dtstart          The start date of the event.
   * @param {Boolean=} options.initialized  When true, assume that options are
   *        from a previously constructed iterator. Initialization will not be
   *        repeated.
   */
  fromData(options) {
    this.rule = formatClassType(options.rule, Recur);
    if (!this.rule) {
      throw new Error("iterator requires a (ICAL.Recur) rule");
    }
    this.dtstart = formatClassType(options.dtstart, Time);
    if (!this.dtstart) {
      throw new Error("iterator requires a (ICAL.Time) dtstart");
    }
    if (options.by_data) {
      this.by_data = options.by_data;
    } else {
      this.by_data = clone(this.rule.parts, true);
    }
    if (options.occurrence_number)
      this.occurrence_number = options.occurrence_number;
    this.days = options.days || [];
    if (options.last) {
      this.last = formatClassType(options.last, Time);
    }
    this.by_indices = options.by_indices;
    if (!this.by_indices) {
      this.by_indices = {
        "BYSECOND": 0,
        "BYMINUTE": 0,
        "BYHOUR": 0,
        "BYDAY": 0,
        "BYMONTH": 0,
        "BYWEEKNO": 0,
        "BYMONTHDAY": 0
      };
    }
    this.initialized = options.initialized || false;
    if (!this.initialized) {
      try {
        this.init();
      } catch (e) {
        if (e instanceof InvalidRecurrenceRuleError) {
          this.completed = true;
        } else {
          throw e;
        }
      }
    }
  }
  /**
   * Initialize the iterator
   * @private
   */
  init() {
    this.initialized = true;
    this.last = this.dtstart.clone();
    let parts = this.by_data;
    if ("BYDAY" in parts) {
      this.sort_byday_rules(parts.BYDAY);
    }
    if ("BYYEARDAY" in parts) {
      if ("BYMONTH" in parts || "BYWEEKNO" in parts || "BYMONTHDAY" in parts || "BYDAY" in parts) {
        throw new Error("Invalid BYYEARDAY rule");
      }
    }
    if ("BYWEEKNO" in parts && "BYMONTHDAY" in parts) {
      throw new Error("BYWEEKNO does not fit to BYMONTHDAY");
    }
    if (this.rule.freq == "MONTHLY" && ("BYYEARDAY" in parts || "BYWEEKNO" in parts)) {
      throw new Error("For MONTHLY recurrences neither BYYEARDAY nor BYWEEKNO may appear");
    }
    if (this.rule.freq == "WEEKLY" && ("BYYEARDAY" in parts || "BYMONTHDAY" in parts)) {
      throw new Error("For WEEKLY recurrences neither BYMONTHDAY nor BYYEARDAY may appear");
    }
    if (this.rule.freq != "YEARLY" && "BYYEARDAY" in parts) {
      throw new Error("BYYEARDAY may only appear in YEARLY rules");
    }
    this.last.second = this.setup_defaults("BYSECOND", "SECONDLY", this.dtstart.second);
    this.last.minute = this.setup_defaults("BYMINUTE", "MINUTELY", this.dtstart.minute);
    this.last.hour = this.setup_defaults("BYHOUR", "HOURLY", this.dtstart.hour);
    this.last.day = this.setup_defaults("BYMONTHDAY", "DAILY", this.dtstart.day);
    this.last.month = this.setup_defaults("BYMONTH", "MONTHLY", this.dtstart.month);
    if (this.rule.freq == "WEEKLY") {
      if ("BYDAY" in parts) {
        let [, dow] = this.ruleDayOfWeek(parts.BYDAY[0], this.rule.wkst);
        let wkdy = dow - this.last.dayOfWeek(this.rule.wkst);
        if (this.last.dayOfWeek(this.rule.wkst) < dow && wkdy >= 0 || wkdy < 0) {
          this.last.day += wkdy;
        }
      } else {
        let dayName = Recur.numericDayToIcalDay(this.dtstart.dayOfWeek());
        parts.BYDAY = [dayName];
      }
    }
    if (this.rule.freq == "YEARLY") {
      const untilYear = this.rule.until ? this.rule.until.year : 2e4;
      while (this.last.year <= untilYear) {
        this.expand_year_days(this.last.year);
        if (this.days.length > 0) {
          break;
        }
        this.increment_year(this.rule.interval);
      }
      if (this.days.length == 0) {
        throw new InvalidRecurrenceRuleError();
      }
      this._nextByYearDay();
    }
    if (this.rule.freq == "MONTHLY") {
      if (this.has_by_data("BYDAY")) {
        let tempLast = null;
        let initLast = this.last.clone();
        let daysInMonth = Time.daysInMonth(this.last.month, this.last.year);
        for (let bydow of this.by_data.BYDAY) {
          this.last = initLast.clone();
          let [pos, dow] = this.ruleDayOfWeek(bydow);
          let dayOfMonth = this.last.nthWeekDay(dow, pos);
          if (pos >= 6 || pos <= -6) {
            throw new Error("Malformed values in BYDAY part");
          }
          if (dayOfMonth > daysInMonth || dayOfMonth <= 0) {
            if (tempLast && tempLast.month == initLast.month) {
              continue;
            }
            while (dayOfMonth > daysInMonth || dayOfMonth <= 0) {
              this.increment_month();
              daysInMonth = Time.daysInMonth(this.last.month, this.last.year);
              dayOfMonth = this.last.nthWeekDay(dow, pos);
            }
          }
          this.last.day = dayOfMonth;
          if (!tempLast || this.last.compare(tempLast) < 0) {
            tempLast = this.last.clone();
          }
        }
        this.last = tempLast.clone();
        if (this.has_by_data("BYMONTHDAY")) {
          this._byDayAndMonthDay(true);
        }
        if (this.last.day > daysInMonth || this.last.day == 0) {
          throw new Error("Malformed values in BYDAY part");
        }
      } else if (this.has_by_data("BYMONTHDAY")) {
        this.last.day = 1;
        let normalized = this.normalizeByMonthDayRules(
          this.last.year,
          this.last.month,
          this.rule.parts.BYMONTHDAY
        ).filter((d2) => d2 >= this.last.day);
        if (normalized.length) {
          this.last.day = normalized[0];
          this.by_data.BYMONTHDAY = normalized;
        } else {
          if (!this.next_month() && !this.next_month() && !this.next_month()) {
            throw new Error("No possible occurrences");
          }
        }
      }
    }
  }
  /**
   * Retrieve the next occurrence from the iterator.
   * @return {Time}
   */
  next(again = false) {
    let before = this.last ? this.last.clone() : null;
    if (this.rule.count && this.occurrence_number >= this.rule.count || this.rule.until && this.last.compare(this.rule.until) > 0) {
      this.completed = true;
    }
    if (this.completed) {
      return null;
    }
    if (this.occurrence_number == 0 && this.last.compare(this.dtstart) >= 0) {
      this.occurrence_number++;
      return this.last;
    }
    let valid;
    do {
      valid = 1;
      switch (this.rule.freq) {
        case "SECONDLY":
          this.next_second();
          break;
        case "MINUTELY":
          this.next_minute();
          break;
        case "HOURLY":
          this.next_hour();
          break;
        case "DAILY":
          this.next_day();
          break;
        case "WEEKLY":
          this.next_week();
          break;
        case "MONTHLY":
          valid = this.next_month();
          break;
        case "YEARLY":
          this.next_year();
          break;
        default:
          return null;
      }
    } while (!this.check_contracting_rules() || this.last.compare(this.dtstart) < 0 || !valid);
    if (this.last.compare(before) == 0) {
      if (again) {
        throw new Error("Same occurrence found twice, protecting you from death by recursion");
      }
      this.next(true);
    }
    if (this.rule.until && this.last.compare(this.rule.until) > 0) {
      this.completed = true;
      return null;
    } else {
      this.occurrence_number++;
      return this.last;
    }
  }
  next_second() {
    return this.next_generic("BYSECOND", "SECONDLY", "second", "minute");
  }
  increment_second(inc) {
    return this.increment_generic(inc, "second", 60, "minute");
  }
  next_minute() {
    return this.next_generic(
      "BYMINUTE",
      "MINUTELY",
      "minute",
      "hour",
      "next_second"
    );
  }
  increment_minute(inc) {
    return this.increment_generic(inc, "minute", 60, "hour");
  }
  next_hour() {
    return this.next_generic(
      "BYHOUR",
      "HOURLY",
      "hour",
      "monthday",
      "next_minute"
    );
  }
  increment_hour(inc) {
    this.increment_generic(inc, "hour", 24, "monthday");
  }
  next_day() {
    let this_freq = this.rule.freq == "DAILY";
    if (this.next_hour() == 0) {
      return 0;
    }
    if (this_freq) {
      this.increment_monthday(this.rule.interval);
    } else {
      this.increment_monthday(1);
    }
    return 0;
  }
  next_week() {
    let end_of_data = 0;
    if (this.next_weekday_by_week() == 0) {
      return end_of_data;
    }
    if (this.has_by_data("BYWEEKNO")) {
      this.by_indices.BYWEEKNO++;
      if (this.by_indices.BYWEEKNO == this.by_data.BYWEEKNO.length) {
        this.by_indices.BYWEEKNO = 0;
        end_of_data = 1;
      }
      this.last.month = 1;
      this.last.day = 1;
      let week_no = this.by_data.BYWEEKNO[this.by_indices.BYWEEKNO];
      this.last.day += 7 * week_no;
      if (end_of_data) {
        this.increment_year(1);
      }
    } else {
      this.increment_monthday(7 * this.rule.interval);
    }
    return end_of_data;
  }
  /**
   * Normalize each by day rule for a given year/month.
   * Takes into account ordering and negative rules
   *
   * @private
   * @param {Number} year         Current year.
   * @param {Number} month        Current month.
   * @param {Array}  rules        Array of rules.
   *
   * @return {Array} sorted and normalized rules.
   *                 Negative rules will be expanded to their
   *                 correct positive values for easier processing.
   */
  normalizeByMonthDayRules(year, month, rules) {
    let daysInMonth = Time.daysInMonth(month, year);
    let newRules = [];
    let ruleIdx = 0;
    let len = rules.length;
    let rule;
    for (; ruleIdx < len; ruleIdx++) {
      rule = parseInt(rules[ruleIdx], 10);
      if (isNaN(rule)) {
        throw new Error("Invalid BYMONTHDAY value");
      }
      if (Math.abs(rule) > daysInMonth) {
        continue;
      }
      if (rule < 0) {
        rule = daysInMonth + (rule + 1);
      } else if (rule === 0) {
        continue;
      }
      if (newRules.indexOf(rule) === -1) {
        newRules.push(rule);
      }
    }
    return newRules.sort(function(a2, b) {
      return a2 - b;
    });
  }
  /**
   * NOTES:
   * We are given a list of dates in the month (BYMONTHDAY) (23, etc..)
   * Also we are given a list of days (BYDAY) (MO, 2SU, etc..) when
   * both conditions match a given date (this.last.day) iteration stops.
   *
   * @private
   * @param {Boolean=} isInit     When given true will not increment the
   *                                current day (this.last).
   */
  _byDayAndMonthDay(isInit) {
    let byMonthDay;
    let byDay = this.by_data.BYDAY;
    let date;
    let dateIdx = 0;
    let dateLen;
    let dayLen = byDay.length;
    let dataIsValid = 0;
    let daysInMonth;
    let self = this;
    let lastDay = this.last.day;
    function initMonth() {
      daysInMonth = Time.daysInMonth(
        self.last.month,
        self.last.year
      );
      byMonthDay = self.normalizeByMonthDayRules(
        self.last.year,
        self.last.month,
        self.by_data.BYMONTHDAY
      );
      dateLen = byMonthDay.length;
      while (byMonthDay[dateIdx] <= lastDay && !(isInit && byMonthDay[dateIdx] == lastDay) && dateIdx < dateLen - 1) {
        dateIdx++;
      }
    }
    function nextMonth() {
      lastDay = 0;
      self.increment_month();
      dateIdx = 0;
      initMonth();
    }
    initMonth();
    if (isInit) {
      lastDay -= 1;
    }
    let monthsCounter = 48;
    while (!dataIsValid && monthsCounter) {
      monthsCounter--;
      date = lastDay + 1;
      if (date > daysInMonth) {
        nextMonth();
        continue;
      }
      let next = byMonthDay[dateIdx++];
      if (next >= date) {
        lastDay = next;
      } else {
        nextMonth();
        continue;
      }
      for (let dayIdx = 0; dayIdx < dayLen; dayIdx++) {
        let parts = this.ruleDayOfWeek(byDay[dayIdx]);
        let pos = parts[0];
        let dow = parts[1];
        this.last.day = lastDay;
        if (this.last.isNthWeekDay(dow, pos)) {
          dataIsValid = 1;
          break;
        }
      }
      if (!dataIsValid && dateIdx === dateLen) {
        nextMonth();
        continue;
      }
    }
    if (monthsCounter <= 0) {
      throw new Error("Malformed values in BYDAY combined with BYMONTHDAY parts");
    }
    return dataIsValid;
  }
  next_month() {
    let data_valid = 1;
    if (this.next_hour() == 0) {
      return data_valid;
    }
    if (this.has_by_data("BYDAY") && this.has_by_data("BYMONTHDAY")) {
      data_valid = this._byDayAndMonthDay();
    } else if (this.has_by_data("BYDAY")) {
      let daysInMonth = Time.daysInMonth(this.last.month, this.last.year);
      let setpos = 0;
      let setpos_total = 0;
      if (this.has_by_data("BYSETPOS")) {
        let last_day = this.last.day;
        for (let day2 = 1; day2 <= daysInMonth; day2++) {
          this.last.day = day2;
          if (this.is_day_in_byday(this.last)) {
            setpos_total++;
            if (day2 <= last_day) {
              setpos++;
            }
          }
        }
        this.last.day = last_day;
      }
      data_valid = 0;
      let day;
      for (day = this.last.day + 1; day <= daysInMonth; day++) {
        this.last.day = day;
        if (this.is_day_in_byday(this.last)) {
          if (!this.has_by_data("BYSETPOS") || this.check_set_position(++setpos) || this.check_set_position(setpos - setpos_total - 1)) {
            data_valid = 1;
            break;
          }
        }
      }
      if (day > daysInMonth) {
        this.last.day = 1;
        this.increment_month();
        if (this.is_day_in_byday(this.last)) {
          if (!this.has_by_data("BYSETPOS") || this.check_set_position(1)) {
            data_valid = 1;
          }
        } else {
          data_valid = 0;
        }
      }
    } else if (this.has_by_data("BYMONTHDAY")) {
      this.by_indices.BYMONTHDAY++;
      if (this.by_indices.BYMONTHDAY >= this.by_data.BYMONTHDAY.length) {
        this.by_indices.BYMONTHDAY = 0;
        this.increment_month();
        if (this.by_indices.BYMONTHDAY >= this.by_data.BYMONTHDAY.length) {
          return 0;
        }
      }
      let daysInMonth = Time.daysInMonth(this.last.month, this.last.year);
      let day = this.by_data.BYMONTHDAY[this.by_indices.BYMONTHDAY];
      if (day < 0) {
        day = daysInMonth + day + 1;
      }
      if (day > daysInMonth) {
        this.last.day = 1;
        data_valid = this.is_day_in_byday(this.last);
      } else {
        this.last.day = day;
      }
    } else {
      this.increment_month();
      let daysInMonth = Time.daysInMonth(this.last.month, this.last.year);
      if (this.by_data.BYMONTHDAY[0] > daysInMonth) {
        data_valid = 0;
      } else {
        this.last.day = this.by_data.BYMONTHDAY[0];
      }
    }
    return data_valid;
  }
  next_weekday_by_week() {
    let end_of_data = 0;
    if (this.next_hour() == 0) {
      return end_of_data;
    }
    if (!this.has_by_data("BYDAY")) {
      return 1;
    }
    for (; ; ) {
      let tt = new Time();
      this.by_indices.BYDAY++;
      if (this.by_indices.BYDAY == Object.keys(this.by_data.BYDAY).length) {
        this.by_indices.BYDAY = 0;
        end_of_data = 1;
      }
      let coded_day = this.by_data.BYDAY[this.by_indices.BYDAY];
      let parts = this.ruleDayOfWeek(coded_day);
      let dow = parts[1];
      dow -= this.rule.wkst;
      if (dow < 0) {
        dow += 7;
      }
      tt.year = this.last.year;
      tt.month = this.last.month;
      tt.day = this.last.day;
      let startOfWeek2 = tt.startDoyWeek(this.rule.wkst);
      if (dow + startOfWeek2 < 1) {
        if (!end_of_data) {
          continue;
        }
      }
      let next = Time.fromDayOfYear(startOfWeek2 + dow, this.last.year);
      this.last.year = next.year;
      this.last.month = next.month;
      this.last.day = next.day;
      return end_of_data;
    }
  }
  next_year() {
    if (this.next_hour() == 0) {
      return 0;
    }
    if (++this.days_index == this.days.length) {
      this.days_index = 0;
      do {
        this.increment_year(this.rule.interval);
        if (this.has_by_data("BYMONTHDAY")) {
          this.by_data.BYMONTHDAY = this.normalizeByMonthDayRules(
            this.last.year,
            this.last.month,
            this.rule.parts.BYMONTHDAY
          );
        }
        this.expand_year_days(this.last.year);
      } while (this.days.length == 0);
    }
    this._nextByYearDay();
    return 1;
  }
  _nextByYearDay() {
    let doy = this.days[this.days_index];
    let year = this.last.year;
    if (doy < 1) {
      doy += 1;
      year += 1;
    }
    let next = Time.fromDayOfYear(doy, year);
    this.last.day = next.day;
    this.last.month = next.month;
  }
  /**
   * @param dow (eg: '1TU', '-1MO')
   * @param {weekDay=} aWeekStart The week start weekday
   * @return [pos, numericDow] (eg: [1, 3]) numericDow is relative to aWeekStart
   */
  ruleDayOfWeek(dow, aWeekStart) {
    let matches = dow.match(/([+-]?[0-9])?(MO|TU|WE|TH|FR|SA|SU)/);
    if (matches) {
      let pos = parseInt(matches[1] || 0, 10);
      dow = Recur.icalDayToNumericDay(matches[2], aWeekStart);
      return [pos, dow];
    } else {
      return [0, 0];
    }
  }
  next_generic(aRuleType, aInterval, aDateAttr, aFollowingAttr, aPreviousIncr) {
    let has_by_rule = aRuleType in this.by_data;
    let this_freq = this.rule.freq == aInterval;
    let end_of_data = 0;
    if (aPreviousIncr && this[aPreviousIncr]() == 0) {
      return end_of_data;
    }
    if (has_by_rule) {
      this.by_indices[aRuleType]++;
      let dta = this.by_data[aRuleType];
      if (this.by_indices[aRuleType] == dta.length) {
        this.by_indices[aRuleType] = 0;
        end_of_data = 1;
      }
      this.last[aDateAttr] = dta[this.by_indices[aRuleType]];
    } else if (this_freq) {
      this["increment_" + aDateAttr](this.rule.interval);
    }
    if (has_by_rule && end_of_data && this_freq) {
      this["increment_" + aFollowingAttr](1);
    }
    return end_of_data;
  }
  increment_monthday(inc) {
    for (let i = 0; i < inc; i++) {
      let daysInMonth = Time.daysInMonth(this.last.month, this.last.year);
      this.last.day++;
      if (this.last.day > daysInMonth) {
        this.last.day -= daysInMonth;
        this.increment_month();
      }
    }
  }
  increment_month() {
    this.last.day = 1;
    if (this.has_by_data("BYMONTH")) {
      this.by_indices.BYMONTH++;
      if (this.by_indices.BYMONTH == this.by_data.BYMONTH.length) {
        this.by_indices.BYMONTH = 0;
        this.increment_year(1);
      }
      this.last.month = this.by_data.BYMONTH[this.by_indices.BYMONTH];
    } else {
      if (this.rule.freq == "MONTHLY") {
        this.last.month += this.rule.interval;
      } else {
        this.last.month++;
      }
      this.last.month--;
      let years2 = trunc(this.last.month / 12);
      this.last.month %= 12;
      this.last.month++;
      if (years2 != 0) {
        this.increment_year(years2);
      }
    }
    if (this.has_by_data("BYMONTHDAY")) {
      this.by_data.BYMONTHDAY = this.normalizeByMonthDayRules(
        this.last.year,
        this.last.month,
        this.rule.parts.BYMONTHDAY
      );
    }
  }
  increment_year(inc) {
    this.last.day = 1;
    this.last.year += inc;
  }
  increment_generic(inc, aDateAttr, aFactor, aNextIncrement) {
    this.last[aDateAttr] += inc;
    let nextunit = trunc(this.last[aDateAttr] / aFactor);
    this.last[aDateAttr] %= aFactor;
    if (nextunit != 0) {
      this["increment_" + aNextIncrement](nextunit);
    }
  }
  has_by_data(aRuleType) {
    return aRuleType in this.rule.parts;
  }
  expand_year_days(aYear) {
    let t2 = new Time();
    this.days = [];
    let parts = {};
    let rules = ["BYDAY", "BYWEEKNO", "BYMONTHDAY", "BYMONTH", "BYYEARDAY"];
    for (let part of rules) {
      if (part in this.rule.parts) {
        parts[part] = this.rule.parts[part];
      }
    }
    if ("BYMONTH" in parts && "BYWEEKNO" in parts) {
      let valid = 1;
      let validWeeks = {};
      t2.year = aYear;
      t2.isDate = true;
      for (let monthIdx = 0; monthIdx < this.by_data.BYMONTH.length; monthIdx++) {
        let month = this.by_data.BYMONTH[monthIdx];
        t2.month = month;
        t2.day = 1;
        let first_week = t2.weekNumber(this.rule.wkst);
        t2.day = Time.daysInMonth(month, aYear);
        let last_week = t2.weekNumber(this.rule.wkst);
        for (monthIdx = first_week; monthIdx < last_week; monthIdx++) {
          validWeeks[monthIdx] = 1;
        }
      }
      for (let weekIdx = 0; weekIdx < this.by_data.BYWEEKNO.length && valid; weekIdx++) {
        let weekno = this.by_data.BYWEEKNO[weekIdx];
        if (weekno < 52) {
          valid &= validWeeks[weekIdx];
        } else {
          valid = 0;
        }
      }
      if (valid) {
        delete parts.BYMONTH;
      } else {
        delete parts.BYWEEKNO;
      }
    }
    let partCount = Object.keys(parts).length;
    if (partCount == 0) {
      let t1 = this.dtstart.clone();
      t1.year = this.last.year;
      this.days.push(t1.dayOfYear());
    } else if (partCount == 1 && "BYMONTH" in parts) {
      for (let month of this.by_data.BYMONTH) {
        let t22 = this.dtstart.clone();
        t22.year = aYear;
        t22.month = month;
        t22.isDate = true;
        this.days.push(t22.dayOfYear());
      }
    } else if (partCount == 1 && "BYMONTHDAY" in parts) {
      for (let monthday of this.by_data.BYMONTHDAY) {
        let t3 = this.dtstart.clone();
        if (monthday < 0) {
          let daysInMonth = Time.daysInMonth(t3.month, aYear);
          monthday = monthday + daysInMonth + 1;
        }
        t3.day = monthday;
        t3.year = aYear;
        t3.isDate = true;
        this.days.push(t3.dayOfYear());
      }
    } else if (partCount == 2 && "BYMONTHDAY" in parts && "BYMONTH" in parts) {
      for (let month of this.by_data.BYMONTH) {
        let daysInMonth = Time.daysInMonth(month, aYear);
        for (let monthday of this.by_data.BYMONTHDAY) {
          if (monthday < 0) {
            monthday = monthday + daysInMonth + 1;
          }
          t2.day = monthday;
          t2.month = month;
          t2.year = aYear;
          t2.isDate = true;
          this.days.push(t2.dayOfYear());
        }
      }
    } else if (partCount == 1 && "BYWEEKNO" in parts) ;
    else if (partCount == 2 && "BYWEEKNO" in parts && "BYMONTHDAY" in parts) ;
    else if (partCount == 1 && "BYDAY" in parts) {
      this.days = this.days.concat(this.expand_by_day(aYear));
    } else if (partCount == 2 && "BYDAY" in parts && "BYMONTH" in parts) {
      for (let month of this.by_data.BYMONTH) {
        let daysInMonth = Time.daysInMonth(month, aYear);
        t2.year = aYear;
        t2.month = month;
        t2.day = 1;
        t2.isDate = true;
        let first_dow = t2.dayOfWeek();
        let doy_offset = t2.dayOfYear() - 1;
        t2.day = daysInMonth;
        let last_dow = t2.dayOfWeek();
        if (this.has_by_data("BYSETPOS")) {
          let by_month_day = [];
          for (let day = 1; day <= daysInMonth; day++) {
            t2.day = day;
            if (this.is_day_in_byday(t2)) {
              by_month_day.push(day);
            }
          }
          for (let spIndex = 0; spIndex < by_month_day.length; spIndex++) {
            if (this.check_set_position(spIndex + 1) || this.check_set_position(spIndex - by_month_day.length)) {
              this.days.push(doy_offset + by_month_day[spIndex]);
            }
          }
        } else {
          for (let coded_day of this.by_data.BYDAY) {
            let bydayParts = this.ruleDayOfWeek(coded_day);
            let pos = bydayParts[0];
            let dow = bydayParts[1];
            let month_day;
            let first_matching_day = (dow + 7 - first_dow) % 7 + 1;
            let last_matching_day = daysInMonth - (last_dow + 7 - dow) % 7;
            if (pos == 0) {
              for (let day = first_matching_day; day <= daysInMonth; day += 7) {
                this.days.push(doy_offset + day);
              }
            } else if (pos > 0) {
              month_day = first_matching_day + (pos - 1) * 7;
              if (month_day <= daysInMonth) {
                this.days.push(doy_offset + month_day);
              }
            } else {
              month_day = last_matching_day + (pos + 1) * 7;
              if (month_day > 0) {
                this.days.push(doy_offset + month_day);
              }
            }
          }
        }
      }
      this.days.sort(function(a2, b) {
        return a2 - b;
      });
    } else if (partCount == 2 && "BYDAY" in parts && "BYMONTHDAY" in parts) {
      let expandedDays = this.expand_by_day(aYear);
      for (let day of expandedDays) {
        let tt = Time.fromDayOfYear(day, aYear);
        if (this.by_data.BYMONTHDAY.indexOf(tt.day) >= 0) {
          this.days.push(day);
        }
      }
    } else if (partCount == 3 && "BYDAY" in parts && "BYMONTHDAY" in parts && "BYMONTH" in parts) {
      let expandedDays = this.expand_by_day(aYear);
      for (let day of expandedDays) {
        let tt = Time.fromDayOfYear(day, aYear);
        if (this.by_data.BYMONTH.indexOf(tt.month) >= 0 && this.by_data.BYMONTHDAY.indexOf(tt.day) >= 0) {
          this.days.push(day);
        }
      }
    } else if (partCount == 2 && "BYDAY" in parts && "BYWEEKNO" in parts) {
      let expandedDays = this.expand_by_day(aYear);
      for (let day of expandedDays) {
        let tt = Time.fromDayOfYear(day, aYear);
        let weekno = tt.weekNumber(this.rule.wkst);
        if (this.by_data.BYWEEKNO.indexOf(weekno)) {
          this.days.push(day);
        }
      }
    } else if (partCount == 3 && "BYDAY" in parts && "BYWEEKNO" in parts && "BYMONTHDAY" in parts) ;
    else if (partCount == 1 && "BYYEARDAY" in parts) {
      this.days = this.days.concat(this.by_data.BYYEARDAY);
    } else {
      this.days = [];
    }
    let daysInYear = Time.isLeapYear(aYear) ? 366 : 365;
    this.days.sort((a2, b) => {
      if (a2 < 0) a2 += daysInYear + 1;
      if (b < 0) b += daysInYear + 1;
      return a2 - b;
    });
    return 0;
  }
  expand_by_day(aYear) {
    let days_list = [];
    let tmp = this.last.clone();
    tmp.year = aYear;
    tmp.month = 1;
    tmp.day = 1;
    tmp.isDate = true;
    let start_dow = tmp.dayOfWeek();
    tmp.month = 12;
    tmp.day = 31;
    tmp.isDate = true;
    let end_dow = tmp.dayOfWeek();
    let end_year_day = tmp.dayOfYear();
    for (let day of this.by_data.BYDAY) {
      let parts = this.ruleDayOfWeek(day);
      let pos = parts[0];
      let dow = parts[1];
      if (pos == 0) {
        let tmp_start_doy = (dow + 7 - start_dow) % 7 + 1;
        for (let doy = tmp_start_doy; doy <= end_year_day; doy += 7) {
          days_list.push(doy);
        }
      } else if (pos > 0) {
        let first;
        if (dow >= start_dow) {
          first = dow - start_dow + 1;
        } else {
          first = dow - start_dow + 8;
        }
        days_list.push(first + (pos - 1) * 7);
      } else {
        let last;
        pos = -pos;
        if (dow <= end_dow) {
          last = end_year_day - end_dow + dow;
        } else {
          last = end_year_day - end_dow + dow - 7;
        }
        days_list.push(last - (pos - 1) * 7);
      }
    }
    return days_list;
  }
  is_day_in_byday(tt) {
    if (this.by_data.BYDAY) {
      for (let day of this.by_data.BYDAY) {
        let parts = this.ruleDayOfWeek(day);
        let pos = parts[0];
        let dow = parts[1];
        let this_dow = tt.dayOfWeek();
        if (pos == 0 && dow == this_dow || tt.nthWeekDay(dow, pos) == tt.day) {
          return 1;
        }
      }
    }
    return 0;
  }
  /**
   * Checks if given value is in BYSETPOS.
   *
   * @private
   * @param {Numeric} aPos position to check for.
   * @return {Boolean} false unless BYSETPOS rules exist
   *                   and the given value is present in rules.
   */
  check_set_position(aPos) {
    if (this.has_by_data("BYSETPOS")) {
      let idx = this.by_data.BYSETPOS.indexOf(aPos);
      return idx !== -1;
    }
    return false;
  }
  sort_byday_rules(aRules) {
    for (let i = 0; i < aRules.length; i++) {
      for (let j = 0; j < i; j++) {
        let one = this.ruleDayOfWeek(aRules[j], this.rule.wkst)[1];
        let two = this.ruleDayOfWeek(aRules[i], this.rule.wkst)[1];
        if (one > two) {
          let tmp = aRules[i];
          aRules[i] = aRules[j];
          aRules[j] = tmp;
        }
      }
    }
  }
  check_contract_restriction(aRuleType, v) {
    let indexMapValue = RecurIterator._indexMap[aRuleType];
    let ruleMapValue = RecurIterator._expandMap[this.rule.freq][indexMapValue];
    let pass = false;
    if (aRuleType in this.by_data && ruleMapValue == RecurIterator.CONTRACT) {
      let ruleType = this.by_data[aRuleType];
      for (let bydata of ruleType) {
        if (bydata == v) {
          pass = true;
          break;
        }
      }
    } else {
      pass = true;
    }
    return pass;
  }
  check_contracting_rules() {
    let dow = this.last.dayOfWeek();
    let weekNo = this.last.weekNumber(this.rule.wkst);
    let doy = this.last.dayOfYear();
    return this.check_contract_restriction("BYSECOND", this.last.second) && this.check_contract_restriction("BYMINUTE", this.last.minute) && this.check_contract_restriction("BYHOUR", this.last.hour) && this.check_contract_restriction("BYDAY", Recur.numericDayToIcalDay(dow)) && this.check_contract_restriction("BYWEEKNO", weekNo) && this.check_contract_restriction("BYMONTHDAY", this.last.day) && this.check_contract_restriction("BYMONTH", this.last.month) && this.check_contract_restriction("BYYEARDAY", doy);
  }
  setup_defaults(aRuleType, req, deftime) {
    let indexMapValue = RecurIterator._indexMap[aRuleType];
    let ruleMapValue = RecurIterator._expandMap[this.rule.freq][indexMapValue];
    if (ruleMapValue != RecurIterator.CONTRACT) {
      if (!(aRuleType in this.by_data)) {
        this.by_data[aRuleType] = [deftime];
      }
      if (this.rule.freq != req) {
        return this.by_data[aRuleType][0];
      }
    }
    return deftime;
  }
  /**
   * Convert iterator into a serialize-able object.  Will preserve current
   * iteration sequence to ensure the seamless continuation of the recurrence
   * rule.
   * @return {Object}
   */
  toJSON() {
    let result = /* @__PURE__ */ Object.create(null);
    result.initialized = this.initialized;
    result.rule = this.rule.toJSON();
    result.dtstart = this.dtstart.toJSON();
    result.by_data = this.by_data;
    result.days = this.days;
    result.last = this.last.toJSON();
    result.by_indices = this.by_indices;
    result.occurrence_number = this.occurrence_number;
    return result;
  }
}
class InvalidRecurrenceRuleError extends Error {
  constructor() {
    super("Recurrence rule has no valid occurrences");
  }
}
const VALID_DAY_NAMES = /^(SU|MO|TU|WE|TH|FR|SA)$/;
const VALID_BYDAY_PART = /^([+-])?(5[0-3]|[1-4][0-9]|[1-9])?(SU|MO|TU|WE|TH|FR|SA)$/;
const DOW_MAP = {
  SU: Time.SUNDAY,
  MO: Time.MONDAY,
  TU: Time.TUESDAY,
  WE: Time.WEDNESDAY,
  TH: Time.THURSDAY,
  FR: Time.FRIDAY,
  SA: Time.SATURDAY
};
const REVERSE_DOW_MAP = Object.fromEntries(Object.entries(DOW_MAP).map((entry) => entry.reverse()));
const ALLOWED_FREQ = [
  "SECONDLY",
  "MINUTELY",
  "HOURLY",
  "DAILY",
  "WEEKLY",
  "MONTHLY",
  "YEARLY"
];
class Recur {
  /**
   * Creates a new {@link ICAL.Recur} instance from the passed string.
   *
   * @param {String} string         The string to parse
   * @return {Recur}                The created recurrence instance
   */
  static fromString(string) {
    let data10 = this._stringToData(string, false);
    return new Recur(data10);
  }
  /**
   * Creates a new {@link ICAL.Recur} instance using members from the passed
   * data object.
   *
   * @param {Object} aData                              An object with members of the recurrence
   * @param {frequencyValues=} aData.freq               The frequency value
   * @param {Number=} aData.interval                    The INTERVAL value
   * @param {weekDay=} aData.wkst                       The week start value
   * @param {Time=} aData.until                         The end of the recurrence set
   * @param {Number=} aData.count                       The number of occurrences
   * @param {Array.<Number>=} aData.bysecond            The seconds for the BYSECOND part
   * @param {Array.<Number>=} aData.byminute            The minutes for the BYMINUTE part
   * @param {Array.<Number>=} aData.byhour              The hours for the BYHOUR part
   * @param {Array.<String>=} aData.byday               The BYDAY values
   * @param {Array.<Number>=} aData.bymonthday          The days for the BYMONTHDAY part
   * @param {Array.<Number>=} aData.byyearday           The days for the BYYEARDAY part
   * @param {Array.<Number>=} aData.byweekno            The weeks for the BYWEEKNO part
   * @param {Array.<Number>=} aData.bymonth             The month for the BYMONTH part
   * @param {Array.<Number>=} aData.bysetpos            The positionals for the BYSETPOS part
   */
  static fromData(aData) {
    return new Recur(aData);
  }
  /**
   * Converts a recurrence string to a data object, suitable for the fromData
   * method.
   *
   * @private
   * @param {String} string     The string to parse
   * @param {Boolean} fmtIcal   If true, the string is considered to be an
   *                              iCalendar string
   * @return {Recur}            The recurrence instance
   */
  static _stringToData(string, fmtIcal) {
    let dict = /* @__PURE__ */ Object.create(null);
    let values = string.split(";");
    let len = values.length;
    for (let i = 0; i < len; i++) {
      let parts = values[i].split("=");
      let ucname = parts[0].toUpperCase();
      let lcname = parts[0].toLowerCase();
      let name = fmtIcal ? lcname : ucname;
      let value3 = parts[1];
      if (ucname in partDesign) {
        let partArr = value3.split(",");
        let partSet = /* @__PURE__ */ new Set();
        for (let part of partArr) {
          partSet.add(partDesign[ucname](part));
        }
        partArr = [...partSet];
        dict[name] = partArr.length == 1 ? partArr[0] : partArr;
      } else if (ucname in optionDesign) {
        optionDesign[ucname](value3, dict, fmtIcal);
      } else {
        dict[lcname] = value3;
      }
    }
    return dict;
  }
  /**
   * Convert an ical representation of a day (SU, MO, etc..)
   * into a numeric value of that day.
   *
   * @param {String} string     The iCalendar day name
   * @param {weekDay=} aWeekStart
   *        The week start weekday, defaults to SUNDAY
   * @return {Number}           Numeric value of given day
   */
  static icalDayToNumericDay(string, aWeekStart) {
    let firstDow = aWeekStart || Time.SUNDAY;
    return (DOW_MAP[string] - firstDow + 7) % 7 + 1;
  }
  /**
   * Convert a numeric day value into its ical representation (SU, MO, etc..)
   *
   * @param {Number} num        Numeric value of given day
   * @param {weekDay=} aWeekStart
   *        The week start weekday, defaults to SUNDAY
   * @return {String}           The ICAL day value, e.g SU,MO,...
   */
  static numericDayToIcalDay(num, aWeekStart) {
    let firstDow = aWeekStart || Time.SUNDAY;
    let dow = num + firstDow - Time.SUNDAY;
    if (dow > 7) {
      dow -= 7;
    }
    return REVERSE_DOW_MAP[dow];
  }
  /**
   * Create a new instance of the Recur class.
   *
   * @param {Object} data                               An object with members of the recurrence
   * @param {frequencyValues=} data.freq                The frequency value
   * @param {Number=} data.interval                     The INTERVAL value
   * @param {weekDay=} data.wkst                        The week start value
   * @param {Time=} data.until                          The end of the recurrence set
   * @param {Number=} data.count                        The number of occurrences
   * @param {Array.<Number>=} data.bysecond             The seconds for the BYSECOND part
   * @param {Array.<Number>=} data.byminute             The minutes for the BYMINUTE part
   * @param {Array.<Number>=} data.byhour               The hours for the BYHOUR part
   * @param {Array.<String>=} data.byday                The BYDAY values
   * @param {Array.<Number>=} data.bymonthday           The days for the BYMONTHDAY part
   * @param {Array.<Number>=} data.byyearday            The days for the BYYEARDAY part
   * @param {Array.<Number>=} data.byweekno             The weeks for the BYWEEKNO part
   * @param {Array.<Number>=} data.bymonth              The month for the BYMONTH part
   * @param {Array.<Number>=} data.bysetpos             The positionals for the BYSETPOS part
   */
  constructor(data10) {
    this.wrappedJSObject = this;
    this.parts = {};
    if (data10 && typeof data10 === "object") {
      this.fromData(data10);
    }
  }
  /**
   * An object holding the BY-parts of the recurrence rule
   * @memberof ICAL.Recur
   * @typedef {Object} byParts
   * @property {Array.<Number>=} BYSECOND            The seconds for the BYSECOND part
   * @property {Array.<Number>=} BYMINUTE            The minutes for the BYMINUTE part
   * @property {Array.<Number>=} BYHOUR              The hours for the BYHOUR part
   * @property {Array.<String>=} BYDAY               The BYDAY values
   * @property {Array.<Number>=} BYMONTHDAY          The days for the BYMONTHDAY part
   * @property {Array.<Number>=} BYYEARDAY           The days for the BYYEARDAY part
   * @property {Array.<Number>=} BYWEEKNO            The weeks for the BYWEEKNO part
   * @property {Array.<Number>=} BYMONTH             The month for the BYMONTH part
   * @property {Array.<Number>=} BYSETPOS            The positionals for the BYSETPOS part
   */
  /**
   * An object holding the BY-parts of the recurrence rule
   * @type {byParts}
   */
  parts = null;
  /**
   * The interval value for the recurrence rule.
   * @type {Number}
   */
  interval = 1;
  /**
   * The week start day
   *
   * @type {weekDay}
   * @default ICAL.Time.MONDAY
   */
  wkst = Time.MONDAY;
  /**
   * The end of the recurrence
   * @type {?Time}
   */
  until = null;
  /**
   * The maximum number of occurrences
   * @type {?Number}
   */
  count = null;
  /**
   * The frequency value.
   * @type {frequencyValues}
   */
  freq = null;
  /**
   * The class identifier.
   * @constant
   * @type {String}
   * @default "icalrecur"
   */
  icalclass = "icalrecur";
  /**
   * The type name, to be used in the jCal object.
   * @constant
   * @type {String}
   * @default "recur"
   */
  icaltype = "recur";
  /**
   * Create a new iterator for this recurrence rule. The passed start date
   * must be the start date of the event, not the start of the range to
   * search in.
   *
   * @example
   * let recur = comp.getFirstPropertyValue('rrule');
   * let dtstart = comp.getFirstPropertyValue('dtstart');
   * let iter = recur.iterator(dtstart);
   * for (let next = iter.next(); next; next = iter.next()) {
   *   if (next.compare(rangeStart) < 0) {
   *     continue;
   *   }
   *   console.log(next.toString());
   * }
   *
   * @param {Time} aStart        The item's start date
   * @return {RecurIterator}     The recurrence iterator
   */
  iterator(aStart) {
    return new RecurIterator({
      rule: this,
      dtstart: aStart
    });
  }
  /**
   * Returns a clone of the recurrence object.
   *
   * @return {Recur}      The cloned object
   */
  clone() {
    return new Recur(this.toJSON());
  }
  /**
   * Checks if the current rule is finite, i.e. has a count or until part.
   *
   * @return {Boolean}        True, if the rule is finite
   */
  isFinite() {
    return !!(this.count || this.until);
  }
  /**
   * Checks if the current rule has a count part, and not limited by an until
   * part.
   *
   * @return {Boolean}        True, if the rule is by count
   */
  isByCount() {
    return !!(this.count && !this.until);
  }
  /**
   * Adds a component (part) to the recurrence rule. This is not a component
   * in the sense of {@link ICAL.Component}, but a part of the recurrence
   * rule, i.e. BYMONTH.
   *
   * @param {String} aType            The name of the component part
   * @param {Array|String} aValue     The component value
   */
  addComponent(aType, aValue) {
    let ucname = aType.toUpperCase();
    if (ucname in this.parts) {
      this.parts[ucname].push(aValue);
    } else {
      this.parts[ucname] = [aValue];
    }
  }
  /**
   * Sets the component value for the given by-part.
   *
   * @param {String} aType        The component part name
   * @param {Array} aValues       The component values
   */
  setComponent(aType, aValues) {
    this.parts[aType.toUpperCase()] = aValues.slice();
  }
  /**
   * Gets (a copy) of the requested component value.
   *
   * @param {String} aType        The component part name
   * @return {Array}              The component part value
   */
  getComponent(aType) {
    let ucname = aType.toUpperCase();
    return ucname in this.parts ? this.parts[ucname].slice() : [];
  }
  /**
   * Retrieves the next occurrence after the given recurrence id. See the
   * guide on {@tutorial terminology} for more details.
   *
   * NOTE: Currently, this method iterates all occurrences from the start
   * date. It should not be called in a loop for performance reasons. If you
   * would like to get more than one occurrence, you can iterate the
   * occurrences manually, see the example on the
   * {@link ICAL.Recur#iterator iterator} method.
   *
   * @param {Time} aStartTime        The start of the event series
   * @param {Time} aRecurrenceId     The date of the last occurrence
   * @return {Time}                  The next occurrence after
   */
  getNextOccurrence(aStartTime, aRecurrenceId) {
    let iter = this.iterator(aStartTime);
    let next;
    do {
      next = iter.next();
    } while (next && next.compare(aRecurrenceId) <= 0);
    if (next && aRecurrenceId.zone) {
      next.zone = aRecurrenceId.zone;
    }
    return next;
  }
  /**
   * Sets up the current instance using members from the passed data object.
   *
   * @param {Object} data                               An object with members of the recurrence
   * @param {frequencyValues=} data.freq                The frequency value
   * @param {Number=} data.interval                     The INTERVAL value
   * @param {weekDay=} data.wkst                        The week start value
   * @param {Time=} data.until                          The end of the recurrence set
   * @param {Number=} data.count                        The number of occurrences
   * @param {Array.<Number>=} data.bysecond             The seconds for the BYSECOND part
   * @param {Array.<Number>=} data.byminute             The minutes for the BYMINUTE part
   * @param {Array.<Number>=} data.byhour               The hours for the BYHOUR part
   * @param {Array.<String>=} data.byday                The BYDAY values
   * @param {Array.<Number>=} data.bymonthday           The days for the BYMONTHDAY part
   * @param {Array.<Number>=} data.byyearday            The days for the BYYEARDAY part
   * @param {Array.<Number>=} data.byweekno             The weeks for the BYWEEKNO part
   * @param {Array.<Number>=} data.bymonth              The month for the BYMONTH part
   * @param {Array.<Number>=} data.bysetpos             The positionals for the BYSETPOS part
   */
  fromData(data10) {
    for (let key in data10) {
      let uckey = key.toUpperCase();
      if (uckey in partDesign) {
        if (Array.isArray(data10[key])) {
          this.parts[uckey] = data10[key];
        } else {
          this.parts[uckey] = [data10[key]];
        }
      } else {
        this[key] = data10[key];
      }
    }
    if (this.interval && typeof this.interval != "number") {
      optionDesign.INTERVAL(this.interval, this);
    }
    if (this.wkst && typeof this.wkst != "number") {
      this.wkst = Recur.icalDayToNumericDay(this.wkst);
    }
    if (this.until && !(this.until instanceof Time)) {
      this.until = Time.fromString(this.until);
    }
  }
  /**
   * The jCal representation of this recurrence type.
   * @return {Object}
   */
  toJSON() {
    let res = /* @__PURE__ */ Object.create(null);
    res.freq = this.freq;
    if (this.count) {
      res.count = this.count;
    }
    if (this.interval > 1) {
      res.interval = this.interval;
    }
    for (let [k, kparts] of Object.entries(this.parts)) {
      if (Array.isArray(kparts) && kparts.length == 1) {
        res[k.toLowerCase()] = kparts[0];
      } else {
        res[k.toLowerCase()] = clone(kparts);
      }
    }
    if (this.until) {
      res.until = this.until.toString();
    }
    if ("wkst" in this && this.wkst !== Time.DEFAULT_WEEK_START) {
      res.wkst = Recur.numericDayToIcalDay(this.wkst);
    }
    return res;
  }
  /**
   * The string representation of this recurrence rule.
   * @return {String}
   */
  toString() {
    let str = "FREQ=" + this.freq;
    if (this.count) {
      str += ";COUNT=" + this.count;
    }
    if (this.interval > 1) {
      str += ";INTERVAL=" + this.interval;
    }
    for (let [k, v] of Object.entries(this.parts)) {
      str += ";" + k + "=" + v;
    }
    if (this.until) {
      str += ";UNTIL=" + this.until.toICALString();
    }
    if ("wkst" in this && this.wkst !== Time.DEFAULT_WEEK_START) {
      str += ";WKST=" + Recur.numericDayToIcalDay(this.wkst);
    }
    return str;
  }
}
function parseNumericValue(type, min, max, value3) {
  let result = value3;
  if (value3[0] === "+") {
    result = value3.slice(1);
  }
  result = strictParseInt(result);
  if (min !== void 0 && value3 < min) {
    throw new Error(
      type + ': invalid value "' + value3 + '" must be > ' + min
    );
  }
  if (max !== void 0 && value3 > max) {
    throw new Error(
      type + ': invalid value "' + value3 + '" must be < ' + min
    );
  }
  return result;
}
const optionDesign = {
  FREQ: function(value3, dict, fmtIcal) {
    if (ALLOWED_FREQ.indexOf(value3) !== -1) {
      dict.freq = value3;
    } else {
      throw new Error(
        'invalid frequency "' + value3 + '" expected: "' + ALLOWED_FREQ.join(", ") + '"'
      );
    }
  },
  COUNT: function(value3, dict, fmtIcal) {
    dict.count = strictParseInt(value3);
  },
  INTERVAL: function(value3, dict, fmtIcal) {
    dict.interval = strictParseInt(value3);
    if (dict.interval < 1) {
      dict.interval = 1;
    }
  },
  UNTIL: function(value3, dict, fmtIcal) {
    if (value3.length > 10) {
      dict.until = design$1.icalendar.value["date-time"].fromICAL(value3);
    } else {
      dict.until = design$1.icalendar.value.date.fromICAL(value3);
    }
    if (!fmtIcal) {
      dict.until = Time.fromString(dict.until);
    }
  },
  WKST: function(value3, dict, fmtIcal) {
    if (VALID_DAY_NAMES.test(value3)) {
      dict.wkst = Recur.icalDayToNumericDay(value3);
    } else {
      throw new Error('invalid WKST value "' + value3 + '"');
    }
  }
};
const partDesign = {
  BYSECOND: parseNumericValue.bind(void 0, "BYSECOND", 0, 60),
  BYMINUTE: parseNumericValue.bind(void 0, "BYMINUTE", 0, 59),
  BYHOUR: parseNumericValue.bind(void 0, "BYHOUR", 0, 23),
  BYDAY: function(value3) {
    if (VALID_BYDAY_PART.test(value3)) {
      return value3;
    } else {
      throw new Error('invalid BYDAY value "' + value3 + '"');
    }
  },
  BYMONTHDAY: parseNumericValue.bind(void 0, "BYMONTHDAY", -31, 31),
  BYYEARDAY: parseNumericValue.bind(void 0, "BYYEARDAY", -366, 366),
  BYWEEKNO: parseNumericValue.bind(void 0, "BYWEEKNO", -53, 53),
  BYMONTH: parseNumericValue.bind(void 0, "BYMONTH", 1, 12),
  BYSETPOS: parseNumericValue.bind(void 0, "BYSETPOS", -366, 366)
};
class Period {
  /**
   * Creates a new {@link ICAL.Period} instance from the passed string.
   *
   * @param {String} str            The string to parse
   * @param {Property} prop         The property this period will be on
   * @return {Period}               The created period instance
   */
  static fromString(str, prop) {
    let parts = str.split("/");
    if (parts.length !== 2) {
      throw new Error(
        'Invalid string value: "' + str + '" must contain a "/" char.'
      );
    }
    let options = {
      start: Time.fromDateTimeString(parts[0], prop)
    };
    let end = parts[1];
    if (Duration.isValueString(end)) {
      options.duration = Duration.fromString(end);
    } else {
      options.end = Time.fromDateTimeString(end, prop);
    }
    return new Period(options);
  }
  /**
   * Creates a new {@link ICAL.Period} instance from the given data object.
   * The passed data object cannot contain both and end date and a duration.
   *
   * @param {Object} aData                  An object with members of the period
   * @param {Time=} aData.start             The start of the period
   * @param {Time=} aData.end               The end of the period
   * @param {Duration=} aData.duration      The duration of the period
   * @return {Period}                       The period instance
   */
  static fromData(aData) {
    return new Period(aData);
  }
  /**
   * Returns a new period instance from the given jCal data array. The first
   * member is always the start date string, the second member is either a
   * duration or end date string.
   *
   * @param {jCalComponent} aData           The jCal data array
   * @param {Property} aProp                The property this jCal data is on
   * @param {Boolean} aLenient              If true, data value can be both date and date-time
   * @return {Period}                       The period instance
   */
  static fromJSON(aData, aProp, aLenient) {
    function fromDateOrDateTimeString(aValue, dateProp) {
      if (aLenient) {
        return Time.fromString(aValue, dateProp);
      } else {
        return Time.fromDateTimeString(aValue, dateProp);
      }
    }
    if (Duration.isValueString(aData[1])) {
      return Period.fromData({
        start: fromDateOrDateTimeString(aData[0], aProp),
        duration: Duration.fromString(aData[1])
      });
    } else {
      return Period.fromData({
        start: fromDateOrDateTimeString(aData[0], aProp),
        end: fromDateOrDateTimeString(aData[1], aProp)
      });
    }
  }
  /**
   * Creates a new ICAL.Period instance. The passed data object cannot contain both and end date and
   * a duration.
   *
   * @param {Object} aData                  An object with members of the period
   * @param {Time=} aData.start             The start of the period
   * @param {Time=} aData.end               The end of the period
   * @param {Duration=} aData.duration      The duration of the period
   */
  constructor(aData) {
    this.wrappedJSObject = this;
    if (aData && "start" in aData) {
      if (aData.start && !(aData.start instanceof Time)) {
        throw new TypeError(".start must be an instance of ICAL.Time");
      }
      this.start = aData.start;
    }
    if (aData && aData.end && aData.duration) {
      throw new Error("cannot accept both end and duration");
    }
    if (aData && "end" in aData) {
      if (aData.end && !(aData.end instanceof Time)) {
        throw new TypeError(".end must be an instance of ICAL.Time");
      }
      this.end = aData.end;
    }
    if (aData && "duration" in aData) {
      if (aData.duration && !(aData.duration instanceof Duration)) {
        throw new TypeError(".duration must be an instance of ICAL.Duration");
      }
      this.duration = aData.duration;
    }
  }
  /**
   * The start of the period
   * @type {Time}
   */
  start = null;
  /**
   * The end of the period
   * @type {Time}
   */
  end = null;
  /**
   * The duration of the period
   * @type {Duration}
   */
  duration = null;
  /**
   * The class identifier.
   * @constant
   * @type {String}
   * @default "icalperiod"
   */
  icalclass = "icalperiod";
  /**
   * The type name, to be used in the jCal object.
   * @constant
   * @type {String}
   * @default "period"
   */
  icaltype = "period";
  /**
   * Returns a clone of the duration object.
   *
   * @return {Period}      The cloned object
   */
  clone() {
    return Period.fromData({
      start: this.start ? this.start.clone() : null,
      end: this.end ? this.end.clone() : null,
      duration: this.duration ? this.duration.clone() : null
    });
  }
  /**
   * Calculates the duration of the period, either directly or by subtracting
   * start from end date.
   *
   * @return {Duration}      The calculated duration
   */
  getDuration() {
    if (this.duration) {
      return this.duration;
    } else {
      return this.end.subtractDate(this.start);
    }
  }
  /**
   * Calculates the end date of the period, either directly or by adding
   * duration to start date.
   *
   * @return {Time}          The calculated end date
   */
  getEnd() {
    if (this.end) {
      return this.end;
    } else {
      let end = this.start.clone();
      end.addDuration(this.duration);
      return end;
    }
  }
  /**
   * The string representation of this period.
   * @return {String}
   */
  toString() {
    return this.start + "/" + (this.end || this.duration);
  }
  /**
   * The jCal representation of this period type.
   * @return {Object}
   */
  toJSON() {
    return [this.start.toString(), (this.end || this.duration).toString()];
  }
  /**
   * The iCalendar string representation of this period.
   * @return {String}
   */
  toICALString() {
    return this.start.toICALString() + "/" + (this.end || this.duration).toICALString();
  }
}
const FROM_ICAL_NEWLINE = /\\\\|\\;|\\,|\\[Nn]/g;
const TO_ICAL_NEWLINE = /\\|;|,|\n/g;
const FROM_VCARD_NEWLINE = /\\\\|\\,|\\[Nn]/g;
const TO_VCARD_NEWLINE = /\\|,|\n/g;
function createTextType(fromNewline, toNewline) {
  let result = {
    matches: /.*/,
    fromICAL: function(aValue, structuredEscape) {
      return replaceNewline(aValue, fromNewline, structuredEscape);
    },
    toICAL: function(aValue, structuredEscape) {
      let regEx = toNewline;
      if (structuredEscape)
        regEx = new RegExp(regEx.source + "|" + structuredEscape, regEx.flags);
      return aValue.replace(regEx, function(str) {
        switch (str) {
          case "\\":
            return "\\\\";
          case ";":
            return "\\;";
          case ",":
            return "\\,";
          case "\n":
            return "\\n";
          /* c8 ignore next 2 */
          default:
            return str;
        }
      });
    }
  };
  return result;
}
const DEFAULT_TYPE_TEXT = { defaultType: "text" };
const DEFAULT_TYPE_TEXT_MULTI = { defaultType: "text", multiValue: "," };
const DEFAULT_TYPE_TEXT_STRUCTURED = { defaultType: "text", structuredValue: ";" };
const DEFAULT_TYPE_INTEGER = { defaultType: "integer" };
const DEFAULT_TYPE_DATETIME_DATE = { defaultType: "date-time", allowedTypes: ["date-time", "date"] };
const DEFAULT_TYPE_DATETIME = { defaultType: "date-time" };
const DEFAULT_TYPE_URI = { defaultType: "uri" };
const DEFAULT_TYPE_UTCOFFSET = { defaultType: "utc-offset" };
const DEFAULT_TYPE_RECUR = { defaultType: "recur" };
const DEFAULT_TYPE_DATE_ANDOR_TIME = { defaultType: "date-and-or-time", allowedTypes: ["date-time", "date", "text"] };
function replaceNewlineReplace(string) {
  switch (string) {
    case "\\\\":
      return "\\";
    case "\\;":
      return ";";
    case "\\,":
      return ",";
    case "\\n":
    case "\\N":
      return "\n";
    /* c8 ignore next 2 */
    default:
      return string;
  }
}
function replaceNewline(value3, newline, structuredEscape) {
  if (value3.indexOf("\\") === -1) {
    return value3;
  }
  if (structuredEscape)
    newline = new RegExp(newline.source + "|\\\\" + structuredEscape, newline.flags);
  return value3.replace(newline, replaceNewlineReplace);
}
let commonProperties = {
  "categories": DEFAULT_TYPE_TEXT_MULTI,
  "url": DEFAULT_TYPE_URI,
  "version": DEFAULT_TYPE_TEXT,
  "uid": DEFAULT_TYPE_TEXT
};
let commonValues = {
  "boolean": {
    values: ["TRUE", "FALSE"],
    fromICAL: function(aValue) {
      switch (aValue) {
        case "TRUE":
          return true;
        case "FALSE":
          return false;
        default:
          return false;
      }
    },
    toICAL: function(aValue) {
      if (aValue) {
        return "TRUE";
      }
      return "FALSE";
    }
  },
  float: {
    matches: /^[+-]?\d+\.\d+$/,
    fromICAL: function(aValue) {
      let parsed = parseFloat(aValue);
      if (isStrictlyNaN(parsed)) {
        return 0;
      }
      return parsed;
    },
    toICAL: function(aValue) {
      return String(aValue);
    }
  },
  integer: {
    fromICAL: function(aValue) {
      let parsed = parseInt(aValue);
      if (isStrictlyNaN(parsed)) {
        return 0;
      }
      return parsed;
    },
    toICAL: function(aValue) {
      return String(aValue);
    }
  },
  "utc-offset": {
    toICAL: function(aValue) {
      if (aValue.length < 7) {
        return aValue.slice(0, 3) + aValue.slice(4, 6);
      } else {
        return aValue.slice(0, 3) + aValue.slice(4, 6) + aValue.slice(7, 9);
      }
    },
    fromICAL: function(aValue) {
      if (aValue.length < 6) {
        return aValue.slice(0, 3) + ":" + aValue.slice(3, 5);
      } else {
        return aValue.slice(0, 3) + ":" + aValue.slice(3, 5) + ":" + aValue.slice(5, 7);
      }
    },
    decorate: function(aValue) {
      return UtcOffset.fromString(aValue);
    },
    undecorate: function(aValue) {
      return aValue.toString();
    }
  }
};
let icalParams = {
  // Although the syntax is DQUOTE uri DQUOTE, I don't think we should
  // enforce anything aside from it being a valid content line.
  //
  // At least some params require - if multi values are used - DQUOTEs
  // for each of its values - e.g. delegated-from="uri1","uri2"
  // To indicate this, I introduced the new k/v pair
  // multiValueSeparateDQuote: true
  //
  // "ALTREP": { ... },
  // CN just wants a param-value
  // "CN": { ... }
  "cutype": {
    values: ["INDIVIDUAL", "GROUP", "RESOURCE", "ROOM", "UNKNOWN"],
    allowXName: true,
    allowIanaToken: true
  },
  "delegated-from": {
    valueType: "cal-address",
    multiValue: ",",
    multiValueSeparateDQuote: true
  },
  "delegated-to": {
    valueType: "cal-address",
    multiValue: ",",
    multiValueSeparateDQuote: true
  },
  // "DIR": { ... }, // See ALTREP
  "encoding": {
    values: ["8BIT", "BASE64"]
  },
  // "FMTTYPE": { ... }, // See ALTREP
  "fbtype": {
    values: ["FREE", "BUSY", "BUSY-UNAVAILABLE", "BUSY-TENTATIVE"],
    allowXName: true,
    allowIanaToken: true
  },
  // "LANGUAGE": { ... }, // See ALTREP
  "member": {
    valueType: "cal-address",
    multiValue: ",",
    multiValueSeparateDQuote: true
  },
  "partstat": {
    // TODO These values are actually different per-component
    values: [
      "NEEDS-ACTION",
      "ACCEPTED",
      "DECLINED",
      "TENTATIVE",
      "DELEGATED",
      "COMPLETED",
      "IN-PROCESS"
    ],
    allowXName: true,
    allowIanaToken: true
  },
  "range": {
    values: ["THISANDFUTURE"]
  },
  "related": {
    values: ["START", "END"]
  },
  "reltype": {
    values: ["PARENT", "CHILD", "SIBLING"],
    allowXName: true,
    allowIanaToken: true
  },
  "role": {
    values: [
      "REQ-PARTICIPANT",
      "CHAIR",
      "OPT-PARTICIPANT",
      "NON-PARTICIPANT"
    ],
    allowXName: true,
    allowIanaToken: true
  },
  "rsvp": {
    values: ["TRUE", "FALSE"]
  },
  "sent-by": {
    valueType: "cal-address"
  },
  "tzid": {
    matches: /^\//
  },
  "value": {
    // since the value here is a 'type' lowercase is used.
    values: [
      "binary",
      "boolean",
      "cal-address",
      "date",
      "date-time",
      "duration",
      "float",
      "integer",
      "period",
      "recur",
      "text",
      "time",
      "uri",
      "utc-offset"
    ],
    allowXName: true,
    allowIanaToken: true
  }
};
const icalValues = extend(commonValues, {
  text: createTextType(FROM_ICAL_NEWLINE, TO_ICAL_NEWLINE),
  uri: {
    // TODO
    /* ... */
  },
  "binary": {
    decorate: function(aString) {
      return Binary.fromString(aString);
    },
    undecorate: function(aBinary) {
      return aBinary.toString();
    }
  },
  "cal-address": {
    // needs to be an uri
  },
  "date": {
    decorate: function(aValue, aProp) {
      {
        return Time.fromDateString(aValue, aProp);
      }
    },
    /**
     * undecorates a time object.
     */
    undecorate: function(aValue) {
      return aValue.toString();
    },
    fromICAL: function(aValue) {
      {
        return aValue.slice(0, 4) + "-" + aValue.slice(4, 6) + "-" + aValue.slice(6, 8);
      }
    },
    toICAL: function(aValue) {
      let len = aValue.length;
      if (len == 10) {
        return aValue.slice(0, 4) + aValue.slice(5, 7) + aValue.slice(8, 10);
      } else if (len >= 19) {
        return icalValues["date-time"].toICAL(aValue);
      } else {
        return aValue;
      }
    }
  },
  "date-time": {
    fromICAL: function(aValue) {
      {
        let result = aValue.slice(0, 4) + "-" + aValue.slice(4, 6) + "-" + aValue.slice(6, 8) + "T" + aValue.slice(9, 11) + ":" + aValue.slice(11, 13) + ":" + aValue.slice(13, 15);
        if (aValue[15] && aValue[15] === "Z") {
          result += "Z";
        }
        return result;
      }
    },
    toICAL: function(aValue) {
      let len = aValue.length;
      if (len >= 19) {
        let result = aValue.slice(0, 4) + aValue.slice(5, 7) + // grab the (DDTHH) segment
        aValue.slice(8, 13) + // MM
        aValue.slice(14, 16) + // SS
        aValue.slice(17, 19);
        if (aValue[19] && aValue[19] === "Z") {
          result += "Z";
        }
        return result;
      } else {
        return aValue;
      }
    },
    decorate: function(aValue, aProp) {
      {
        return Time.fromDateTimeString(aValue, aProp);
      }
    },
    undecorate: function(aValue) {
      return aValue.toString();
    }
  },
  duration: {
    decorate: function(aValue) {
      return Duration.fromString(aValue);
    },
    undecorate: function(aValue) {
      return aValue.toString();
    }
  },
  period: {
    fromICAL: function(string) {
      let parts = string.split("/");
      parts[0] = icalValues["date-time"].fromICAL(parts[0]);
      if (!Duration.isValueString(parts[1])) {
        parts[1] = icalValues["date-time"].fromICAL(parts[1]);
      }
      return parts;
    },
    toICAL: function(parts) {
      parts = parts.slice();
      {
        parts[0] = icalValues["date-time"].toICAL(parts[0]);
      }
      if (!Duration.isValueString(parts[1])) {
        {
          parts[1] = icalValues["date-time"].toICAL(parts[1]);
        }
      }
      return parts.join("/");
    },
    decorate: function(aValue, aProp) {
      return Period.fromJSON(aValue, aProp, false);
    },
    undecorate: function(aValue) {
      return aValue.toJSON();
    }
  },
  recur: {
    fromICAL: function(string) {
      return Recur._stringToData(string, true);
    },
    toICAL: function(data10) {
      let str = "";
      for (let [k, val] of Object.entries(data10)) {
        if (k == "until") {
          if (val.length > 10) {
            val = icalValues["date-time"].toICAL(val);
          } else {
            val = icalValues.date.toICAL(val);
          }
        } else if (k == "wkst") {
          if (typeof val === "number") {
            val = Recur.numericDayToIcalDay(val);
          }
        } else if (Array.isArray(val)) {
          val = val.join(",");
        }
        str += k.toUpperCase() + "=" + val + ";";
      }
      return str.slice(0, Math.max(0, str.length - 1));
    },
    decorate: function decorate(aValue) {
      return Recur.fromData(aValue);
    },
    undecorate: function(aRecur) {
      return aRecur.toJSON();
    }
  },
  time: {
    fromICAL: function(aValue) {
      if (aValue.length < 6) {
        return aValue;
      }
      let result = aValue.slice(0, 2) + ":" + aValue.slice(2, 4) + ":" + aValue.slice(4, 6);
      if (aValue[6] === "Z") {
        result += "Z";
      }
      return result;
    },
    toICAL: function(aValue) {
      if (aValue.length < 8) {
        return aValue;
      }
      let result = aValue.slice(0, 2) + aValue.slice(3, 5) + aValue.slice(6, 8);
      if (aValue[8] === "Z") {
        result += "Z";
      }
      return result;
    }
  }
});
let icalProperties = extend(commonProperties, {
  "action": DEFAULT_TYPE_TEXT,
  "attach": { defaultType: "uri" },
  "attendee": { defaultType: "cal-address" },
  "calscale": DEFAULT_TYPE_TEXT,
  "class": DEFAULT_TYPE_TEXT,
  "comment": DEFAULT_TYPE_TEXT,
  "completed": DEFAULT_TYPE_DATETIME,
  "contact": DEFAULT_TYPE_TEXT,
  "created": DEFAULT_TYPE_DATETIME,
  "description": DEFAULT_TYPE_TEXT,
  "dtend": DEFAULT_TYPE_DATETIME_DATE,
  "dtstamp": DEFAULT_TYPE_DATETIME,
  "dtstart": DEFAULT_TYPE_DATETIME_DATE,
  "due": DEFAULT_TYPE_DATETIME_DATE,
  "duration": { defaultType: "duration" },
  "exdate": {
    defaultType: "date-time",
    allowedTypes: ["date-time", "date"],
    multiValue: ","
  },
  "exrule": DEFAULT_TYPE_RECUR,
  "freebusy": { defaultType: "period", multiValue: "," },
  "geo": { defaultType: "float", structuredValue: ";" },
  "last-modified": DEFAULT_TYPE_DATETIME,
  "location": DEFAULT_TYPE_TEXT,
  "method": DEFAULT_TYPE_TEXT,
  "organizer": { defaultType: "cal-address" },
  "percent-complete": DEFAULT_TYPE_INTEGER,
  "priority": DEFAULT_TYPE_INTEGER,
  "prodid": DEFAULT_TYPE_TEXT,
  "related-to": DEFAULT_TYPE_TEXT,
  "repeat": DEFAULT_TYPE_INTEGER,
  "rdate": {
    defaultType: "date-time",
    allowedTypes: ["date-time", "date", "period"],
    multiValue: ",",
    detectType: function(string) {
      if (string.indexOf("/") !== -1) {
        return "period";
      }
      return string.indexOf("T") === -1 ? "date" : "date-time";
    }
  },
  "recurrence-id": DEFAULT_TYPE_DATETIME_DATE,
  "resources": DEFAULT_TYPE_TEXT_MULTI,
  "request-status": DEFAULT_TYPE_TEXT_STRUCTURED,
  "rrule": DEFAULT_TYPE_RECUR,
  "sequence": DEFAULT_TYPE_INTEGER,
  "status": DEFAULT_TYPE_TEXT,
  "summary": DEFAULT_TYPE_TEXT,
  "transp": DEFAULT_TYPE_TEXT,
  "trigger": { defaultType: "duration", allowedTypes: ["duration", "date-time"] },
  "tzoffsetfrom": DEFAULT_TYPE_UTCOFFSET,
  "tzoffsetto": DEFAULT_TYPE_UTCOFFSET,
  "tzurl": DEFAULT_TYPE_URI,
  "tzid": DEFAULT_TYPE_TEXT,
  "tzname": DEFAULT_TYPE_TEXT
});
const vcardValues = extend(commonValues, {
  text: createTextType(FROM_VCARD_NEWLINE, TO_VCARD_NEWLINE),
  uri: createTextType(FROM_VCARD_NEWLINE, TO_VCARD_NEWLINE),
  date: {
    decorate: function(aValue) {
      return VCardTime.fromDateAndOrTimeString(aValue, "date");
    },
    undecorate: function(aValue) {
      return aValue.toString();
    },
    fromICAL: function(aValue) {
      if (aValue.length == 8) {
        return icalValues.date.fromICAL(aValue);
      } else if (aValue[0] == "-" && aValue.length == 6) {
        return aValue.slice(0, 4) + "-" + aValue.slice(4);
      } else {
        return aValue;
      }
    },
    toICAL: function(aValue) {
      if (aValue.length == 10) {
        return icalValues.date.toICAL(aValue);
      } else if (aValue[0] == "-" && aValue.length == 7) {
        return aValue.slice(0, 4) + aValue.slice(5);
      } else {
        return aValue;
      }
    }
  },
  time: {
    decorate: function(aValue) {
      return VCardTime.fromDateAndOrTimeString("T" + aValue, "time");
    },
    undecorate: function(aValue) {
      return aValue.toString();
    },
    fromICAL: function(aValue) {
      let splitzone = vcardValues.time._splitZone(aValue, true);
      let zone = splitzone[0], value3 = splitzone[1];
      if (value3.length == 6) {
        value3 = value3.slice(0, 2) + ":" + value3.slice(2, 4) + ":" + value3.slice(4, 6);
      } else if (value3.length == 4 && value3[0] != "-") {
        value3 = value3.slice(0, 2) + ":" + value3.slice(2, 4);
      } else if (value3.length == 5) {
        value3 = value3.slice(0, 3) + ":" + value3.slice(3, 5);
      }
      if (zone.length == 5 && (zone[0] == "-" || zone[0] == "+")) {
        zone = zone.slice(0, 3) + ":" + zone.slice(3);
      }
      return value3 + zone;
    },
    toICAL: function(aValue) {
      let splitzone = vcardValues.time._splitZone(aValue);
      let zone = splitzone[0], value3 = splitzone[1];
      if (value3.length == 8) {
        value3 = value3.slice(0, 2) + value3.slice(3, 5) + value3.slice(6, 8);
      } else if (value3.length == 5 && value3[0] != "-") {
        value3 = value3.slice(0, 2) + value3.slice(3, 5);
      } else if (value3.length == 6) {
        value3 = value3.slice(0, 3) + value3.slice(4, 6);
      }
      if (zone.length == 6 && (zone[0] == "-" || zone[0] == "+")) {
        zone = zone.slice(0, 3) + zone.slice(4);
      }
      return value3 + zone;
    },
    _splitZone: function(aValue, isFromIcal) {
      let lastChar = aValue.length - 1;
      let signChar = aValue.length - (isFromIcal ? 5 : 6);
      let sign = aValue[signChar];
      let zone, value3;
      if (aValue[lastChar] == "Z") {
        zone = aValue[lastChar];
        value3 = aValue.slice(0, Math.max(0, lastChar));
      } else if (aValue.length > 6 && (sign == "-" || sign == "+")) {
        zone = aValue.slice(signChar);
        value3 = aValue.slice(0, Math.max(0, signChar));
      } else {
        zone = "";
        value3 = aValue;
      }
      return [zone, value3];
    }
  },
  "date-time": {
    decorate: function(aValue) {
      return VCardTime.fromDateAndOrTimeString(aValue, "date-time");
    },
    undecorate: function(aValue) {
      return aValue.toString();
    },
    fromICAL: function(aValue) {
      return vcardValues["date-and-or-time"].fromICAL(aValue);
    },
    toICAL: function(aValue) {
      return vcardValues["date-and-or-time"].toICAL(aValue);
    }
  },
  "date-and-or-time": {
    decorate: function(aValue) {
      return VCardTime.fromDateAndOrTimeString(aValue, "date-and-or-time");
    },
    undecorate: function(aValue) {
      return aValue.toString();
    },
    fromICAL: function(aValue) {
      let parts = aValue.split("T");
      return (parts[0] ? vcardValues.date.fromICAL(parts[0]) : "") + (parts[1] ? "T" + vcardValues.time.fromICAL(parts[1]) : "");
    },
    toICAL: function(aValue) {
      let parts = aValue.split("T");
      return vcardValues.date.toICAL(parts[0]) + (parts[1] ? "T" + vcardValues.time.toICAL(parts[1]) : "");
    }
  },
  timestamp: icalValues["date-time"],
  "language-tag": {
    matches: /^[a-zA-Z0-9-]+$/
    // Could go with a more strict regex here
  },
  "phone-number": {
    fromICAL: function(aValue) {
      return Array.from(aValue).filter(function(c) {
        return c === "\\" ? void 0 : c;
      }).join("");
    },
    toICAL: function(aValue) {
      return Array.from(aValue).map(function(c) {
        return c === "," || c === ";" ? "\\" + c : c;
      }).join("");
    }
  }
});
let vcardParams = {
  "type": {
    valueType: "text",
    multiValue: ","
  },
  "value": {
    // since the value here is a 'type' lowercase is used.
    values: [
      "text",
      "uri",
      "date",
      "time",
      "date-time",
      "date-and-or-time",
      "timestamp",
      "boolean",
      "integer",
      "float",
      "utc-offset",
      "language-tag"
    ],
    allowXName: true,
    allowIanaToken: true
  }
};
let vcardProperties = extend(commonProperties, {
  "adr": { defaultType: "text", structuredValue: ";", multiValue: "," },
  "anniversary": DEFAULT_TYPE_DATE_ANDOR_TIME,
  "bday": DEFAULT_TYPE_DATE_ANDOR_TIME,
  "caladruri": DEFAULT_TYPE_URI,
  "caluri": DEFAULT_TYPE_URI,
  "clientpidmap": DEFAULT_TYPE_TEXT_STRUCTURED,
  "email": DEFAULT_TYPE_TEXT,
  "fburl": DEFAULT_TYPE_URI,
  "fn": DEFAULT_TYPE_TEXT,
  "gender": DEFAULT_TYPE_TEXT_STRUCTURED,
  "geo": DEFAULT_TYPE_URI,
  "impp": DEFAULT_TYPE_URI,
  "key": DEFAULT_TYPE_URI,
  "kind": DEFAULT_TYPE_TEXT,
  "lang": { defaultType: "language-tag" },
  "logo": DEFAULT_TYPE_URI,
  "member": DEFAULT_TYPE_URI,
  "n": { defaultType: "text", structuredValue: ";", multiValue: "," },
  "nickname": DEFAULT_TYPE_TEXT_MULTI,
  "note": DEFAULT_TYPE_TEXT,
  "org": { defaultType: "text", structuredValue: ";" },
  "photo": DEFAULT_TYPE_URI,
  "related": DEFAULT_TYPE_URI,
  "rev": { defaultType: "timestamp" },
  "role": DEFAULT_TYPE_TEXT,
  "sound": DEFAULT_TYPE_URI,
  "source": DEFAULT_TYPE_URI,
  "tel": { defaultType: "uri", allowedTypes: ["uri", "text"] },
  "title": DEFAULT_TYPE_TEXT,
  "tz": { defaultType: "text", allowedTypes: ["text", "utc-offset", "uri"] },
  "xml": DEFAULT_TYPE_TEXT
});
let vcard3Values = extend(commonValues, {
  binary: icalValues.binary,
  date: vcardValues.date,
  "date-time": vcardValues["date-time"],
  "phone-number": vcardValues["phone-number"],
  uri: icalValues.uri,
  text: icalValues.text,
  time: icalValues.time,
  vcard: icalValues.text,
  "utc-offset": {
    toICAL: function(aValue) {
      return aValue.slice(0, 7);
    },
    fromICAL: function(aValue) {
      return aValue.slice(0, 7);
    },
    decorate: function(aValue) {
      return UtcOffset.fromString(aValue);
    },
    undecorate: function(aValue) {
      return aValue.toString();
    }
  }
});
let vcard3Params = {
  "type": {
    valueType: "text",
    multiValue: ","
  },
  "value": {
    // since the value here is a 'type' lowercase is used.
    values: [
      "text",
      "uri",
      "date",
      "date-time",
      "phone-number",
      "time",
      "boolean",
      "integer",
      "float",
      "utc-offset",
      "vcard",
      "binary"
    ],
    allowXName: true,
    allowIanaToken: true
  }
};
let vcard3Properties = extend(commonProperties, {
  fn: DEFAULT_TYPE_TEXT,
  n: { defaultType: "text", structuredValue: ";", multiValue: "," },
  nickname: DEFAULT_TYPE_TEXT_MULTI,
  photo: { defaultType: "binary", allowedTypes: ["binary", "uri"] },
  bday: {
    defaultType: "date-time",
    allowedTypes: ["date-time", "date"],
    detectType: function(string) {
      return string.indexOf("T") === -1 ? "date" : "date-time";
    }
  },
  adr: { defaultType: "text", structuredValue: ";", multiValue: "," },
  label: DEFAULT_TYPE_TEXT,
  tel: { defaultType: "phone-number" },
  email: DEFAULT_TYPE_TEXT,
  mailer: DEFAULT_TYPE_TEXT,
  tz: { defaultType: "utc-offset", allowedTypes: ["utc-offset", "text"] },
  geo: { defaultType: "float", structuredValue: ";" },
  title: DEFAULT_TYPE_TEXT,
  role: DEFAULT_TYPE_TEXT,
  logo: { defaultType: "binary", allowedTypes: ["binary", "uri"] },
  agent: { defaultType: "vcard", allowedTypes: ["vcard", "text", "uri"] },
  org: DEFAULT_TYPE_TEXT_STRUCTURED,
  note: DEFAULT_TYPE_TEXT_MULTI,
  prodid: DEFAULT_TYPE_TEXT,
  rev: {
    defaultType: "date-time",
    allowedTypes: ["date-time", "date"],
    detectType: function(string) {
      return string.indexOf("T") === -1 ? "date" : "date-time";
    }
  },
  "sort-string": DEFAULT_TYPE_TEXT,
  sound: { defaultType: "binary", allowedTypes: ["binary", "uri"] },
  class: DEFAULT_TYPE_TEXT,
  key: { defaultType: "binary", allowedTypes: ["binary", "text"] }
});
let icalSet = {
  value: icalValues,
  param: icalParams,
  property: icalProperties,
  propertyGroups: false
};
let vcardSet = {
  value: vcardValues,
  param: vcardParams,
  property: vcardProperties,
  propertyGroups: true
};
let vcard3Set = {
  value: vcard3Values,
  param: vcard3Params,
  property: vcard3Properties,
  propertyGroups: true
};
const design = {
  /**
   * Can be set to false to make the parser more lenient.
   */
  strict: true,
  /**
   * The default set for new properties and components if none is specified.
   * @type {designSet}
   */
  defaultSet: icalSet,
  /**
   * The default type for unknown properties
   * @type {String}
   */
  defaultType: "unknown",
  /**
   * Holds the design set for known top-level components
   *
   * @type {Object}
   * @property {designSet} vcard       vCard VCARD
   * @property {designSet} vevent      iCalendar VEVENT
   * @property {designSet} vtodo       iCalendar VTODO
   * @property {designSet} vjournal    iCalendar VJOURNAL
   * @property {designSet} valarm      iCalendar VALARM
   * @property {designSet} vtimezone   iCalendar VTIMEZONE
   * @property {designSet} daylight    iCalendar DAYLIGHT
   * @property {designSet} standard    iCalendar STANDARD
   *
   * @example
   * let propertyName = 'fn';
   * let componentDesign = ICAL.design.components.vcard;
   * let propertyDetails = componentDesign.property[propertyName];
   * if (propertyDetails.defaultType == 'text') {
   *   // Yep, sure is...
   * }
   */
  components: {
    vcard: vcardSet,
    vcard3: vcard3Set,
    vevent: icalSet,
    vtodo: icalSet,
    vjournal: icalSet,
    valarm: icalSet,
    vtimezone: icalSet,
    daylight: icalSet,
    standard: icalSet
  },
  /**
   * The design set for iCalendar (rfc5545/rfc7265) components.
   * @type {designSet}
   */
  icalendar: icalSet,
  /**
   * The design set for vCard (rfc6350/rfc7095) components.
   * @type {designSet}
   */
  vcard: vcardSet,
  /**
   * The design set for vCard (rfc2425/rfc2426/rfc7095) components.
   * @type {designSet}
   */
  vcard3: vcard3Set,
  /**
   * Gets the design set for the given component name.
   *
   * @param {String} componentName        The name of the component
   * @return {designSet}      The design set for the component
   */
  getDesignSet: function(componentName) {
    let isInDesign = componentName && componentName in design.components;
    return isInDesign ? design.components[componentName] : design.defaultSet;
  }
};
var design$1 = design;
const LINE_ENDING = "\r\n";
const DEFAULT_VALUE_TYPE = "unknown";
const RFC6868_REPLACE_MAP = { '"': "^'", "\n": "^n", "^": "^^" };
function stringify(jCal) {
  if (typeof jCal[0] == "string") {
    jCal = [jCal];
  }
  let i = 0;
  let len = jCal.length;
  let result = "";
  for (; i < len; i++) {
    result += stringify.component(jCal[i]) + LINE_ENDING;
  }
  return result;
}
stringify.component = function(component, designSet) {
  let name = component[0].toUpperCase();
  let result = "BEGIN:" + name + LINE_ENDING;
  let props = component[1];
  let propIdx = 0;
  let propLen = props.length;
  let designSetName = component[0];
  if (designSetName === "vcard" && component[1].length > 0 && !(component[1][0][0] === "version" && component[1][0][3] === "4.0")) {
    designSetName = "vcard3";
  }
  designSet = designSet || design$1.getDesignSet(designSetName);
  for (; propIdx < propLen; propIdx++) {
    result += stringify.property(props[propIdx], designSet) + LINE_ENDING;
  }
  let comps = component[2] || [];
  let compIdx = 0;
  let compLen = comps.length;
  for (; compIdx < compLen; compIdx++) {
    result += stringify.component(comps[compIdx], designSet) + LINE_ENDING;
  }
  result += "END:" + name;
  return result;
};
stringify.property = function(property, designSet, noFold) {
  let name = property[0].toUpperCase();
  let jsName = property[0];
  let params = property[1];
  if (!designSet) {
    designSet = design$1.defaultSet;
  }
  let groupName = params.group;
  let line;
  if (designSet.propertyGroups && groupName) {
    line = groupName.toUpperCase() + "." + name;
  } else {
    line = name;
  }
  for (let [paramName, value3] of Object.entries(params)) {
    if (designSet.propertyGroups && paramName == "group") {
      continue;
    }
    let paramDesign = designSet.param[paramName];
    let multiValue2 = paramDesign && paramDesign.multiValue;
    if (multiValue2 && Array.isArray(value3)) {
      value3 = value3.map(function(val) {
        val = stringify._rfc6868Unescape(val);
        val = stringify.paramPropertyValue(val, paramDesign.multiValueSeparateDQuote);
        return val;
      });
      value3 = stringify.multiValue(value3, multiValue2, "unknown", null, designSet);
    } else {
      value3 = stringify._rfc6868Unescape(value3);
      value3 = stringify.paramPropertyValue(value3);
    }
    line += ";" + paramName.toUpperCase() + "=" + value3;
  }
  if (property.length === 3) {
    return line + ":";
  }
  let valueType = property[2];
  let propDetails;
  let multiValue = false;
  let structuredValue = false;
  let isDefault = false;
  if (jsName in designSet.property) {
    propDetails = designSet.property[jsName];
    if ("multiValue" in propDetails) {
      multiValue = propDetails.multiValue;
    }
    if ("structuredValue" in propDetails && Array.isArray(property[3])) {
      structuredValue = propDetails.structuredValue;
    }
    if ("defaultType" in propDetails) {
      if (valueType === propDetails.defaultType) {
        isDefault = true;
      }
    } else {
      if (valueType === DEFAULT_VALUE_TYPE) {
        isDefault = true;
      }
    }
  } else {
    if (valueType === DEFAULT_VALUE_TYPE) {
      isDefault = true;
    }
  }
  if (!isDefault) {
    line += ";VALUE=" + valueType.toUpperCase();
  }
  line += ":";
  if (multiValue && structuredValue) {
    line += stringify.multiValue(
      property[3],
      structuredValue,
      valueType,
      multiValue,
      designSet,
      structuredValue
    );
  } else if (multiValue) {
    line += stringify.multiValue(
      property.slice(3),
      multiValue,
      valueType,
      null,
      designSet,
      false
    );
  } else if (structuredValue) {
    line += stringify.multiValue(
      property[3],
      structuredValue,
      valueType,
      null,
      designSet,
      structuredValue
    );
  } else {
    line += stringify.value(property[3], valueType, designSet, false);
  }
  return noFold ? line : foldline(line);
};
stringify.paramPropertyValue = function(value3, force) {
  if (!force && value3.indexOf(",") === -1 && value3.indexOf(":") === -1 && value3.indexOf(";") === -1) {
    return value3;
  }
  return '"' + value3 + '"';
};
stringify.multiValue = function(values, delim, type, innerMulti, designSet, structuredValue) {
  let result = "";
  let len = values.length;
  let i = 0;
  for (; i < len; i++) {
    if (innerMulti && Array.isArray(values[i])) {
      result += stringify.multiValue(values[i], innerMulti, type, null, designSet, structuredValue);
    } else {
      result += stringify.value(values[i], type, designSet, structuredValue);
    }
    if (i !== len - 1) {
      result += delim;
    }
  }
  return result;
};
stringify.value = function(value3, type, designSet, structuredValue) {
  if (type in designSet.value && "toICAL" in designSet.value[type]) {
    return designSet.value[type].toICAL(value3, structuredValue);
  }
  return value3;
};
stringify._rfc6868Unescape = function(val) {
  return val.replace(/[\n^"]/g, function(x2) {
    return RFC6868_REPLACE_MAP[x2];
  });
};
const NAME_INDEX$1 = 0;
const PROP_INDEX = 1;
const TYPE_INDEX = 2;
const VALUE_INDEX = 3;
class Property {
  /**
   * Create an {@link ICAL.Property} by parsing the passed iCalendar string.
   *
   * @param {String} str            The iCalendar string to parse
   * @param {designSet=} designSet  The design data to use for this property
   * @return {Property}             The created iCalendar property
   */
  static fromString(str, designSet) {
    return new Property(parse$1.property(str, designSet));
  }
  /**
   * Creates a new ICAL.Property instance.
   *
   * It is important to note that mutations done in the wrapper directly mutate the jCal object used
   * to initialize.
   *
   * Can also be used to create new properties by passing the name of the property (as a String).
   *
   * @param {Array|String} jCal         Raw jCal representation OR the new name of the property
   * @param {Component=} parent         Parent component
   */
  constructor(jCal, parent) {
    this._parent = parent || null;
    if (typeof jCal === "string") {
      this.jCal = [jCal, {}, design$1.defaultType];
      this.jCal[TYPE_INDEX] = this.getDefaultType();
    } else {
      this.jCal = jCal;
    }
    this._updateType();
  }
  /**
   * The value type for this property
   * @type {String}
   */
  get type() {
    return this.jCal[TYPE_INDEX];
  }
  /**
   * The name of this property, in lowercase.
   * @type {String}
   */
  get name() {
    return this.jCal[NAME_INDEX$1];
  }
  /**
   * The parent component for this property.
   * @type {Component}
   */
  get parent() {
    return this._parent;
  }
  set parent(p) {
    let designSetChanged = !this._parent || p && p._designSet != this._parent._designSet;
    this._parent = p;
    if (this.type == design$1.defaultType && designSetChanged) {
      this.jCal[TYPE_INDEX] = this.getDefaultType();
      this._updateType();
    }
  }
  /**
   * The design set for this property, e.g. icalendar vs vcard
   *
   * @type {designSet}
   * @private
   */
  get _designSet() {
    return this.parent ? this.parent._designSet : design$1.defaultSet;
  }
  /**
   * Updates the type metadata from the current jCal type and design set.
   *
   * @private
   */
  _updateType() {
    let designSet = this._designSet;
    if (this.type in designSet.value) {
      if ("decorate" in designSet.value[this.type]) {
        this.isDecorated = true;
      } else {
        this.isDecorated = false;
      }
      if (this.name in designSet.property) {
        this.isMultiValue = "multiValue" in designSet.property[this.name];
        this.isStructuredValue = "structuredValue" in designSet.property[this.name];
      }
    }
  }
  /**
   * Hydrate a single value. The act of hydrating means turning the raw jCal
   * value into a potentially wrapped object, for example {@link ICAL.Time}.
   *
   * @private
   * @param {Number} index        The index of the value to hydrate
   * @return {?Object}             The decorated value.
   */
  _hydrateValue(index) {
    if (this._values && this._values[index]) {
      return this._values[index];
    }
    if (this.jCal.length <= VALUE_INDEX + index) {
      return null;
    }
    if (this.isDecorated) {
      if (!this._values) {
        this._values = [];
      }
      return this._values[index] = this._decorate(
        this.jCal[VALUE_INDEX + index]
      );
    } else {
      return this.jCal[VALUE_INDEX + index];
    }
  }
  /**
   * Decorate a single value, returning its wrapped object. This is used by
   * the hydrate function to actually wrap the value.
   *
   * @private
   * @param {?} value         The value to decorate
   * @return {Object}         The decorated value
   */
  _decorate(value3) {
    return this._designSet.value[this.type].decorate(value3, this);
  }
  /**
   * Undecorate a single value, returning its raw jCal data.
   *
   * @private
   * @param {Object} value         The value to undecorate
   * @return {?}                   The undecorated value
   */
  _undecorate(value3) {
    return this._designSet.value[this.type].undecorate(value3, this);
  }
  /**
   * Sets the value at the given index while also hydrating it. The passed
   * value can either be a decorated or undecorated value.
   *
   * @private
   * @param {?} value             The value to set
   * @param {Number} index        The index to set it at
   */
  _setDecoratedValue(value3, index) {
    if (!this._values) {
      this._values = [];
    }
    if (typeof value3 === "object" && "icaltype" in value3) {
      this.jCal[VALUE_INDEX + index] = this._undecorate(value3);
      this._values[index] = value3;
    } else {
      this.jCal[VALUE_INDEX + index] = value3;
      this._values[index] = this._decorate(value3);
    }
  }
  /**
   * Gets a parameter on the property.
   *
   * @param {String}        name   Parameter name (lowercase)
   * @return {Array|String}        Parameter value
   */
  getParameter(name) {
    if (name in this.jCal[PROP_INDEX]) {
      return this.jCal[PROP_INDEX][name];
    } else {
      return void 0;
    }
  }
  /**
   * Gets first parameter on the property.
   *
   * @param {String}        name   Parameter name (lowercase)
   * @return {String}        Parameter value
   */
  getFirstParameter(name) {
    let parameters = this.getParameter(name);
    if (Array.isArray(parameters)) {
      return parameters[0];
    }
    return parameters;
  }
  /**
   * Sets a parameter on the property.
   *
   * @param {String}       name     The parameter name
   * @param {Array|String} value    The parameter value
   */
  setParameter(name, value3) {
    let lcname = name.toLowerCase();
    if (typeof value3 === "string" && lcname in this._designSet.param && "multiValue" in this._designSet.param[lcname]) {
      value3 = [value3];
    }
    this.jCal[PROP_INDEX][name] = value3;
  }
  /**
   * Removes a parameter
   *
   * @param {String} name     The parameter name
   */
  removeParameter(name) {
    delete this.jCal[PROP_INDEX][name];
  }
  /**
   * Get the default type based on this property's name.
   *
   * @return {String}     The default type for this property
   */
  getDefaultType() {
    let name = this.jCal[NAME_INDEX$1];
    let designSet = this._designSet;
    if (name in designSet.property) {
      let details = designSet.property[name];
      if ("defaultType" in details) {
        return details.defaultType;
      }
    }
    return design$1.defaultType;
  }
  /**
   * Sets type of property and clears out any existing values of the current
   * type.
   *
   * @param {String} type     New iCAL type (see design.*.values)
   */
  resetType(type) {
    this.removeAllValues();
    this.jCal[TYPE_INDEX] = type;
    this._updateType();
  }
  /**
   * Finds the first property value.
   *
   * @return {Binary | Duration | Period |
   * Recur | Time | UtcOffset | Geo | string | null}         First property value
   */
  getFirstValue() {
    return this._hydrateValue(0);
  }
  /**
   * Gets all values on the property.
   *
   * NOTE: this creates an array during each call.
   *
   * @return {Array}          List of values
   */
  getValues() {
    let len = this.jCal.length - VALUE_INDEX;
    if (len < 1) {
      return [];
    }
    let i = 0;
    let result = [];
    for (; i < len; i++) {
      result[i] = this._hydrateValue(i);
    }
    return result;
  }
  /**
   * Removes all values from this property
   */
  removeAllValues() {
    if (this._values) {
      this._values.length = 0;
    }
    this.jCal.length = 3;
  }
  /**
   * Sets the values of the property.  Will overwrite the existing values.
   * This can only be used for multi-value properties.
   *
   * @param {Array} values    An array of values
   */
  setValues(values) {
    if (!this.isMultiValue) {
      throw new Error(
        this.name + ": does not not support mulitValue.\noverride isMultiValue"
      );
    }
    let len = values.length;
    let i = 0;
    this.removeAllValues();
    if (len > 0 && typeof values[0] === "object" && "icaltype" in values[0]) {
      this.resetType(values[0].icaltype);
    }
    if (this.isDecorated) {
      for (; i < len; i++) {
        this._setDecoratedValue(values[i], i);
      }
    } else {
      for (; i < len; i++) {
        this.jCal[VALUE_INDEX + i] = values[i];
      }
    }
  }
  /**
   * Sets the current value of the property. If this is a multi-value
   * property, all other values will be removed.
   *
   * @param {String|Object} value     New property value.
   */
  setValue(value3) {
    this.removeAllValues();
    if (typeof value3 === "object" && "icaltype" in value3) {
      this.resetType(value3.icaltype);
    }
    if (this.isDecorated) {
      this._setDecoratedValue(value3, 0);
    } else {
      this.jCal[VALUE_INDEX] = value3;
    }
  }
  /**
   * Returns the Object representation of this component. The returned object
   * is a live jCal object and should be cloned if modified.
   * @return {Object}
   */
  toJSON() {
    return this.jCal;
  }
  /**
   * The string representation of this component.
   * @return {String}
   */
  toICALString() {
    return stringify.property(
      this.jCal,
      this._designSet,
      true
    );
  }
}
const NAME_INDEX = 0;
const PROPERTY_INDEX = 1;
const COMPONENT_INDEX = 2;
class Component {
  /**
   * Create an {@link ICAL.Component} by parsing the passed iCalendar string.
   *
   * @param {String} str        The iCalendar string to parse
   */
  static fromString(str) {
    return new Component(parse$1.component(str));
  }
  /**
   * Creates a new Component instance.
   *
   * @param {Array|String} jCal         Raw jCal component data OR name of new
   *                                      component
   * @param {Component=} parent     Parent component to associate
   */
  constructor(jCal, parent) {
    if (typeof jCal === "string") {
      jCal = [jCal, [], []];
    }
    this.jCal = jCal;
    this.parent = parent || null;
    if (!this.parent && this.name === "vcalendar") {
      this._timezoneCache = /* @__PURE__ */ new Map();
    }
  }
  /**
   * Hydrated properties are inserted into the _properties array at the same
   * position as in the jCal array, so it is possible that the array contains
   * undefined values for unhydrdated properties. To avoid iterating the
   * array when checking if all properties have been hydrated, we save the
   * count here.
   *
   * @type {Number}
   * @private
   */
  _hydratedPropertyCount = 0;
  /**
   * The same count as for _hydratedPropertyCount, but for subcomponents
   *
   * @type {Number}
   * @private
   */
  _hydratedComponentCount = 0;
  /**
   * A cache of hydrated time zone objects which may be used by consumers, keyed
   * by time zone ID.
   *
   * @type {Map}
   * @private
   */
  _timezoneCache = null;
  /**
   * @private
   */
  _components = null;
  /**
   * @private
   */
  _properties = null;
  /**
   * The name of this component
   *
   * @type {String}
   */
  get name() {
    return this.jCal[NAME_INDEX];
  }
  /**
   * The design set for this component, e.g. icalendar vs vcard
   *
   * @type {designSet}
   * @private
   */
  get _designSet() {
    let parentDesign = this.parent && this.parent._designSet;
    return parentDesign || design$1.getDesignSet(this.name);
  }
  /**
   * @private
   */
  _hydrateComponent(index) {
    if (!this._components) {
      this._components = [];
      this._hydratedComponentCount = 0;
    }
    if (this._components[index]) {
      return this._components[index];
    }
    let comp = new Component(
      this.jCal[COMPONENT_INDEX][index],
      this
    );
    this._hydratedComponentCount++;
    return this._components[index] = comp;
  }
  /**
   * @private
   */
  _hydrateProperty(index) {
    if (!this._properties) {
      this._properties = [];
      this._hydratedPropertyCount = 0;
    }
    if (this._properties[index]) {
      return this._properties[index];
    }
    let prop = new Property(
      this.jCal[PROPERTY_INDEX][index],
      this
    );
    this._hydratedPropertyCount++;
    return this._properties[index] = prop;
  }
  /**
   * Finds first sub component, optionally filtered by name.
   *
   * @param {String=} name        Optional name to filter by
   * @return {?Component}     The found subcomponent
   */
  getFirstSubcomponent(name) {
    if (name) {
      let i = 0;
      let comps = this.jCal[COMPONENT_INDEX];
      let len = comps.length;
      for (; i < len; i++) {
        if (comps[i][NAME_INDEX] === name) {
          let result = this._hydrateComponent(i);
          return result;
        }
      }
    } else {
      if (this.jCal[COMPONENT_INDEX].length) {
        return this._hydrateComponent(0);
      }
    }
    return null;
  }
  /**
   * Finds all sub components, optionally filtering by name.
   *
   * @param {String=} name            Optional name to filter by
   * @return {Component[]}       The found sub components
   */
  getAllSubcomponents(name) {
    let jCalLen = this.jCal[COMPONENT_INDEX].length;
    let i = 0;
    if (name) {
      let comps = this.jCal[COMPONENT_INDEX];
      let result = [];
      for (; i < jCalLen; i++) {
        if (name === comps[i][NAME_INDEX]) {
          result.push(
            this._hydrateComponent(i)
          );
        }
      }
      return result;
    } else {
      if (!this._components || this._hydratedComponentCount !== jCalLen) {
        for (; i < jCalLen; i++) {
          this._hydrateComponent(i);
        }
      }
      return this._components || [];
    }
  }
  /**
   * Returns true when a named property exists.
   *
   * @param {String} name     The property name
   * @return {Boolean}        True, when property is found
   */
  hasProperty(name) {
    let props = this.jCal[PROPERTY_INDEX];
    let len = props.length;
    let i = 0;
    for (; i < len; i++) {
      if (props[i][NAME_INDEX] === name) {
        return true;
      }
    }
    return false;
  }
  /**
   * Finds the first property, optionally with the given name.
   *
   * @param {String=} name        Lowercase property name
   * @return {?Property}     The found property
   */
  getFirstProperty(name) {
    if (name) {
      let i = 0;
      let props = this.jCal[PROPERTY_INDEX];
      let len = props.length;
      for (; i < len; i++) {
        if (props[i][NAME_INDEX] === name) {
          let result = this._hydrateProperty(i);
          return result;
        }
      }
    } else {
      if (this.jCal[PROPERTY_INDEX].length) {
        return this._hydrateProperty(0);
      }
    }
    return null;
  }
  /**
   * Returns first property's value, if available.
   *
   * @param {String=} name                    Lowercase property name
   * @return {Binary | Duration | Period |
   * Recur | Time | UtcOffset | Geo | string | null}         The found property value.
   */
  getFirstPropertyValue(name) {
    let prop = this.getFirstProperty(name);
    if (prop) {
      return prop.getFirstValue();
    }
    return null;
  }
  /**
   * Get all properties in the component, optionally filtered by name.
   *
   * @param {String=} name        Lowercase property name
   * @return {Property[]}    List of properties
   */
  getAllProperties(name) {
    let jCalLen = this.jCal[PROPERTY_INDEX].length;
    let i = 0;
    if (name) {
      let props = this.jCal[PROPERTY_INDEX];
      let result = [];
      for (; i < jCalLen; i++) {
        if (name === props[i][NAME_INDEX]) {
          result.push(
            this._hydrateProperty(i)
          );
        }
      }
      return result;
    } else {
      if (!this._properties || this._hydratedPropertyCount !== jCalLen) {
        for (; i < jCalLen; i++) {
          this._hydrateProperty(i);
        }
      }
      return this._properties || [];
    }
  }
  /**
   * @private
   */
  _removeObjectByIndex(jCalIndex, cache, index) {
    cache = cache || [];
    if (cache[index]) {
      let obj = cache[index];
      if ("parent" in obj) {
        obj.parent = null;
      }
    }
    cache.splice(index, 1);
    this.jCal[jCalIndex].splice(index, 1);
  }
  /**
   * @private
   */
  _removeObject(jCalIndex, cache, nameOrObject) {
    let i = 0;
    let objects = this.jCal[jCalIndex];
    let len = objects.length;
    let cached = this[cache];
    if (typeof nameOrObject === "string") {
      for (; i < len; i++) {
        if (objects[i][NAME_INDEX] === nameOrObject) {
          this._removeObjectByIndex(jCalIndex, cached, i);
          return true;
        }
      }
    } else if (cached) {
      for (; i < len; i++) {
        if (cached[i] && cached[i] === nameOrObject) {
          this._removeObjectByIndex(jCalIndex, cached, i);
          return true;
        }
      }
    }
    return false;
  }
  /**
   * @private
   */
  _removeAllObjects(jCalIndex, cache, name) {
    let cached = this[cache];
    let objects = this.jCal[jCalIndex];
    let i = objects.length - 1;
    for (; i >= 0; i--) {
      if (!name || objects[i][NAME_INDEX] === name) {
        this._removeObjectByIndex(jCalIndex, cached, i);
      }
    }
  }
  /**
   * Adds a single sub component.
   *
   * @param {Component} component        The component to add
   * @return {Component}                 The passed in component
   */
  addSubcomponent(component) {
    if (!this._components) {
      this._components = [];
      this._hydratedComponentCount = 0;
    }
    if (component.parent) {
      component.parent.removeSubcomponent(component);
    }
    let idx = this.jCal[COMPONENT_INDEX].push(component.jCal);
    this._components[idx - 1] = component;
    this._hydratedComponentCount++;
    component.parent = this;
    return component;
  }
  /**
   * Removes a single component by name or the instance of a specific
   * component.
   *
   * @param {Component|String} nameOrComp    Name of component, or component
   * @return {Boolean}                            True when comp is removed
   */
  removeSubcomponent(nameOrComp) {
    let removed = this._removeObject(COMPONENT_INDEX, "_components", nameOrComp);
    if (removed) {
      this._hydratedComponentCount--;
    }
    return removed;
  }
  /**
   * Removes all components or (if given) all components by a particular
   * name.
   *
   * @param {String=} name            Lowercase component name
   */
  removeAllSubcomponents(name) {
    let removed = this._removeAllObjects(COMPONENT_INDEX, "_components", name);
    this._hydratedComponentCount = 0;
    return removed;
  }
  /**
   * Adds an {@link ICAL.Property} to the component.
   *
   * @param {Property} property      The property to add
   * @return {Property}              The passed in property
   */
  addProperty(property) {
    if (!(property instanceof Property)) {
      throw new TypeError("must be instance of ICAL.Property");
    }
    if (!this._properties) {
      this._properties = [];
      this._hydratedPropertyCount = 0;
    }
    if (property.parent) {
      property.parent.removeProperty(property);
    }
    let idx = this.jCal[PROPERTY_INDEX].push(property.jCal);
    this._properties[idx - 1] = property;
    this._hydratedPropertyCount++;
    property.parent = this;
    return property;
  }
  /**
   * Helper method to add a property with a value to the component.
   *
   * @param {String}               name         Property name to add
   * @param {String|Number|Object} value        Property value
   * @return {Property}                    The created property
   */
  addPropertyWithValue(name, value3) {
    let prop = new Property(name);
    prop.setValue(value3);
    this.addProperty(prop);
    return prop;
  }
  /**
   * Helper method that will update or create a property of the given name
   * and sets its value. If multiple properties with the given name exist,
   * only the first is updated.
   *
   * @param {String}               name         Property name to update
   * @param {String|Number|Object} value        Property value
   * @return {Property}                    The created property
   */
  updatePropertyWithValue(name, value3) {
    let prop = this.getFirstProperty(name);
    if (prop) {
      prop.setValue(value3);
    } else {
      prop = this.addPropertyWithValue(name, value3);
    }
    return prop;
  }
  /**
   * Removes a single property by name or the instance of the specific
   * property.
   *
   * @param {String|Property} nameOrProp     Property name or instance to remove
   * @return {Boolean}                            True, when deleted
   */
  removeProperty(nameOrProp) {
    let removed = this._removeObject(PROPERTY_INDEX, "_properties", nameOrProp);
    if (removed) {
      this._hydratedPropertyCount--;
    }
    return removed;
  }
  /**
   * Removes all properties associated with this component, optionally
   * filtered by name.
   *
   * @param {String=} name        Lowercase property name
   * @return {Boolean}            True, when deleted
   */
  removeAllProperties(name) {
    let removed = this._removeAllObjects(PROPERTY_INDEX, "_properties", name);
    this._hydratedPropertyCount = 0;
    return removed;
  }
  /**
   * Returns the Object representation of this component. The returned object
   * is a live jCal object and should be cloned if modified.
   * @return {Object}
   */
  toJSON() {
    return this.jCal;
  }
  /**
   * The string representation of this component.
   * @return {String}
   */
  toString() {
    return stringify.component(
      this.jCal,
      this._designSet
    );
  }
  /**
   * Retrieve a time zone definition from the component tree, if any is present.
   * If the tree contains no time zone definitions or the TZID cannot be
   * matched, returns null.
   *
   * @param {String} tzid     The ID of the time zone to retrieve
   * @return {Timezone}  The time zone corresponding to the ID, or null
   */
  getTimeZoneByID(tzid) {
    if (this.parent) {
      return this.parent.getTimeZoneByID(tzid);
    }
    if (!this._timezoneCache) {
      return null;
    }
    if (this._timezoneCache.has(tzid)) {
      return this._timezoneCache.get(tzid);
    }
    const zones2 = this.getAllSubcomponents("vtimezone");
    for (const zone of zones2) {
      if (zone.getFirstProperty("tzid").getFirstValue() === tzid) {
        const hydratedZone = new Timezone$1({
          component: zone,
          tzid
        });
        this._timezoneCache.set(tzid, hydratedZone);
        return hydratedZone;
      }
    }
    return null;
  }
}
class RecurExpansion {
  /**
   * Creates a new ICAL.RecurExpansion instance.
   *
   * The options object can be filled with the specified initial values. It can also contain
   * additional members, as a result of serializing a previous expansion state, as shown in the
   * example.
   *
   * @param {Object} options
   *        Recurrence expansion options
   * @param {Time} options.dtstart
   *        Start time of the event
   * @param {Component=} options.component
   *        Component for expansion, required if not resuming.
   */
  constructor(options) {
    this.ruleDates = [];
    this.exDates = [];
    this.fromData(options);
  }
  /**
   * True when iteration is fully completed.
   * @type {Boolean}
   */
  complete = false;
  /**
   * Array of rrule iterators.
   *
   * @type {RecurIterator[]}
   * @private
   */
  ruleIterators = null;
  /**
   * Array of rdate instances.
   *
   * @type {Time[]}
   * @private
   */
  ruleDates = null;
  /**
   * Array of exdate instances.
   *
   * @type {Time[]}
   * @private
   */
  exDates = null;
  /**
   * Current position in ruleDates array.
   * @type {Number}
   * @private
   */
  ruleDateInc = 0;
  /**
   * Current position in exDates array
   * @type {Number}
   * @private
   */
  exDateInc = 0;
  /**
   * Current negative date.
   *
   * @type {Time}
   * @private
   */
  exDate = null;
  /**
   * Current additional date.
   *
   * @type {Time}
   * @private
   */
  ruleDate = null;
  /**
   * Start date of recurring rules.
   *
   * @type {Time}
   */
  dtstart = null;
  /**
   * Last expanded time
   *
   * @type {Time}
   */
  last = null;
  /**
   * Initialize the recurrence expansion from the data object. The options
   * object may also contain additional members, see the
   * {@link ICAL.RecurExpansion constructor} for more details.
   *
   * @param {Object} options
   *        Recurrence expansion options
   * @param {Time} options.dtstart
   *        Start time of the event
   * @param {Component=} options.component
   *        Component for expansion, required if not resuming.
   */
  fromData(options) {
    let start = formatClassType(options.dtstart, Time);
    if (!start) {
      throw new Error(".dtstart (ICAL.Time) must be given");
    } else {
      this.dtstart = start;
    }
    if (options.component) {
      this._init(options.component);
    } else {
      this.last = formatClassType(options.last, Time) || start.clone();
      if (!options.ruleIterators) {
        throw new Error(".ruleIterators or .component must be given");
      }
      this.ruleIterators = options.ruleIterators.map(function(item) {
        return formatClassType(item, RecurIterator);
      });
      this.ruleDateInc = options.ruleDateInc;
      this.exDateInc = options.exDateInc;
      if (options.ruleDates) {
        this.ruleDates = options.ruleDates.map((item) => formatClassType(item, Time));
        this.ruleDate = this.ruleDates[this.ruleDateInc];
      }
      if (options.exDates) {
        this.exDates = options.exDates.map((item) => formatClassType(item, Time));
        this.exDate = this.exDates[this.exDateInc];
      }
      if (typeof options.complete !== "undefined") {
        this.complete = options.complete;
      }
    }
  }
  /**
   * Retrieve the next occurrence in the series.
   * @return {Time}
   */
  next() {
    let iter;
    let next;
    let compare;
    let maxTries = 500;
    let currentTry = 0;
    while (true) {
      if (currentTry++ > maxTries) {
        throw new Error(
          "max tries have occurred, rule may be impossible to fulfill."
        );
      }
      next = this.ruleDate;
      iter = this._nextRecurrenceIter(this.last);
      if (!next && !iter) {
        this.complete = true;
        break;
      }
      if (!next || iter && next.compare(iter.last) > 0) {
        next = iter.last.clone();
        iter.next();
      }
      if (this.ruleDate === next) {
        this._nextRuleDay();
      }
      this.last = next;
      if (this.exDate) {
        compare = this.exDate.compare(this.last);
        if (compare < 0) {
          this._nextExDay();
        }
        if (compare === 0) {
          this._nextExDay();
          continue;
        }
      }
      return this.last;
    }
  }
  /**
   * Converts object into a serialize-able format. This format can be passed
   * back into the expansion to resume iteration.
   * @return {Object}
   */
  toJSON() {
    function toJSON(item) {
      return item.toJSON();
    }
    let result = /* @__PURE__ */ Object.create(null);
    result.ruleIterators = this.ruleIterators.map(toJSON);
    if (this.ruleDates) {
      result.ruleDates = this.ruleDates.map(toJSON);
    }
    if (this.exDates) {
      result.exDates = this.exDates.map(toJSON);
    }
    result.ruleDateInc = this.ruleDateInc;
    result.exDateInc = this.exDateInc;
    result.last = this.last.toJSON();
    result.dtstart = this.dtstart.toJSON();
    result.complete = this.complete;
    return result;
  }
  /**
   * Extract all dates from the properties in the given component. The
   * properties will be filtered by the property name.
   *
   * @private
   * @param {Component} component             The component to search in
   * @param {String} propertyName             The property name to search for
   * @return {Time[]}                         The extracted dates.
   */
  _extractDates(component, propertyName) {
    let result = [];
    let props = component.getAllProperties(propertyName);
    for (let i = 0, len = props.length; i < len; i++) {
      for (let prop of props[i].getValues()) {
        let idx = binsearchInsert(
          result,
          prop,
          (a2, b) => a2.compare(b)
        );
        result.splice(idx, 0, prop);
      }
    }
    return result;
  }
  /**
   * Initialize the recurrence expansion.
   *
   * @private
   * @param {Component} component    The component to initialize from.
   */
  _init(component) {
    this.ruleIterators = [];
    this.last = this.dtstart.clone();
    if (!component.hasProperty("rdate") && !component.hasProperty("rrule") && !component.hasProperty("recurrence-id")) {
      this.ruleDate = this.last.clone();
      this.complete = true;
      return;
    }
    if (component.hasProperty("rdate")) {
      this.ruleDates = this._extractDates(component, "rdate");
      if (this.ruleDates[0] && this.ruleDates[0].compare(this.dtstart) < 0) {
        this.ruleDateInc = 0;
        this.last = this.ruleDates[0].clone();
      } else {
        this.ruleDateInc = binsearchInsert(
          this.ruleDates,
          this.last,
          (a2, b) => a2.compare(b)
        );
      }
      this.ruleDate = this.ruleDates[this.ruleDateInc];
    }
    if (component.hasProperty("rrule")) {
      let rules = component.getAllProperties("rrule");
      let i = 0;
      let len = rules.length;
      let rule;
      let iter;
      for (; i < len; i++) {
        rule = rules[i].getFirstValue();
        iter = rule.iterator(this.dtstart);
        this.ruleIterators.push(iter);
        iter.next();
      }
    }
    if (component.hasProperty("exdate")) {
      this.exDates = this._extractDates(component, "exdate");
      this.exDateInc = binsearchInsert(
        this.exDates,
        this.last,
        (a2, b) => a2.compare(b)
      );
      this.exDate = this.exDates[this.exDateInc];
    }
  }
  /**
   * Advance to the next exdate
   * @private
   */
  _nextExDay() {
    this.exDate = this.exDates[++this.exDateInc];
  }
  /**
   * Advance to the next rule date
   * @private
   */
  _nextRuleDay() {
    this.ruleDate = this.ruleDates[++this.ruleDateInc];
  }
  /**
   * Find and return the recurrence rule with the most recent event and
   * return it.
   *
   * @private
   * @return {?RecurIterator}    Found iterator.
   */
  _nextRecurrenceIter() {
    let iters = this.ruleIterators;
    if (iters.length === 0) {
      return null;
    }
    let len = iters.length;
    let iter;
    let iterTime;
    let iterIdx = 0;
    let chosenIter;
    for (; iterIdx < len; iterIdx++) {
      iter = iters[iterIdx];
      iterTime = iter.last;
      if (iter.completed) {
        len--;
        if (iterIdx !== 0) {
          iterIdx--;
        }
        iters.splice(iterIdx, 1);
        continue;
      }
      if (!chosenIter || chosenIter.last.compare(iterTime) > 0) {
        chosenIter = iter;
      }
    }
    return chosenIter;
  }
}
class Event {
  /**
   * Creates a new ICAL.Event instance.
   *
   * @param {Component=} component              The ICAL.Component to base this event on
   * @param {Object} [options]                  Options for this event
   * @param {Boolean=} options.strictExceptions  When true, will verify exceptions are related by
   *                                              their UUID
   * @param {Array<Component|Event>=} options.exceptions
   *          Exceptions to this event, either as components or events. If not
   *            specified exceptions will automatically be set in relation of
   *            component's parent
   */
  constructor(component, options) {
    if (!(component instanceof Component)) {
      options = component;
      component = null;
    }
    if (component) {
      this.component = component;
    } else {
      this.component = new Component("vevent");
    }
    this._rangeExceptionCache = /* @__PURE__ */ Object.create(null);
    this.exceptions = /* @__PURE__ */ Object.create(null);
    this.rangeExceptions = [];
    if (options && options.strictExceptions) {
      this.strictExceptions = options.strictExceptions;
    }
    if (options && options.exceptions) {
      options.exceptions.forEach(this.relateException, this);
    } else if (this.component.parent && !this.isRecurrenceException()) {
      this.component.parent.getAllSubcomponents("vevent").forEach(function(event) {
        if (event.hasProperty("recurrence-id")) {
          this.relateException(event);
        }
      }, this);
    }
  }
  static THISANDFUTURE = "THISANDFUTURE";
  /**
   * List of related event exceptions.
   *
   * @type {Event[]}
   */
  exceptions = null;
  /**
   * When true, will verify exceptions are related by their UUID.
   *
   * @type {Boolean}
   */
  strictExceptions = false;
  /**
   * Relates a given event exception to this object.  If the given component
   * does not share the UID of this event it cannot be related and will throw
   * an exception.
   *
   * If this component is an exception it cannot have other exceptions
   * related to it.
   *
   * @param {Component|Event} obj       Component or event
   */
  relateException(obj) {
    if (this.isRecurrenceException()) {
      throw new Error("cannot relate exception to exceptions");
    }
    if (obj instanceof Component) {
      obj = new Event(obj);
    }
    if (this.strictExceptions && obj.uid !== this.uid) {
      throw new Error("attempted to relate unrelated exception");
    }
    let id = obj.recurrenceId.toString();
    this.exceptions[id] = obj;
    if (obj.modifiesFuture()) {
      let item = [
        obj.recurrenceId.toUnixTime(),
        id
      ];
      let idx = binsearchInsert(
        this.rangeExceptions,
        item,
        compareRangeException
      );
      this.rangeExceptions.splice(idx, 0, item);
    }
  }
  /**
   * Checks if this record is an exception and has the RANGE=THISANDFUTURE
   * value.
   *
   * @return {Boolean}        True, when exception is within range
   */
  modifiesFuture() {
    if (!this.component.hasProperty("recurrence-id")) {
      return false;
    }
    let range = this.component.getFirstProperty("recurrence-id").getParameter("range");
    return range === Event.THISANDFUTURE;
  }
  /**
   * Finds the range exception nearest to the given date.
   *
   * @param {Time} time   usually an occurrence time of an event
   * @return {?Event}     the related event/exception or null
   */
  findRangeException(time) {
    if (!this.rangeExceptions.length) {
      return null;
    }
    let utc = time.toUnixTime();
    let idx = binsearchInsert(
      this.rangeExceptions,
      [utc],
      compareRangeException
    );
    idx -= 1;
    if (idx < 0) {
      return null;
    }
    let rangeItem = this.rangeExceptions[idx];
    if (utc < rangeItem[0]) {
      return null;
    }
    return rangeItem[1];
  }
  /**
   * Returns the occurrence details based on its start time.  If the
   * occurrence has an exception will return the details for that exception.
   *
   * NOTE: this method is intend to be used in conjunction
   *       with the {@link ICAL.Event#iterator iterator} method.
   *
   * @param {Time} occurrence               time occurrence
   * @return {occurrenceDetails}            Information about the occurrence
   */
  getOccurrenceDetails(occurrence) {
    let id = occurrence.toString();
    let utcId = occurrence.convertToZone(Timezone$1.utcTimezone).toString();
    let item;
    let result = {
      //XXX: Clone?
      recurrenceId: occurrence
    };
    if (id in this.exceptions) {
      item = result.item = this.exceptions[id];
      result.startDate = item.startDate;
      result.endDate = item.endDate;
      result.item = item;
    } else if (utcId in this.exceptions) {
      item = this.exceptions[utcId];
      result.startDate = item.startDate;
      result.endDate = item.endDate;
      result.item = item;
    } else {
      let rangeExceptionId = this.findRangeException(
        occurrence
      );
      let end;
      if (rangeExceptionId) {
        let exception = this.exceptions[rangeExceptionId];
        result.item = exception;
        let startDiff = this._rangeExceptionCache[rangeExceptionId];
        if (!startDiff) {
          let original = exception.recurrenceId.clone();
          let newStart = exception.startDate.clone();
          original.zone = newStart.zone;
          startDiff = newStart.subtractDate(original);
          this._rangeExceptionCache[rangeExceptionId] = startDiff;
        }
        let start = occurrence.clone();
        start.zone = exception.startDate.zone;
        start.addDuration(startDiff);
        end = start.clone();
        end.addDuration(exception.duration);
        result.startDate = start;
        result.endDate = end;
      } else {
        end = occurrence.clone();
        end.addDuration(this.duration);
        result.endDate = end;
        result.startDate = occurrence;
        result.item = this;
      }
    }
    return result;
  }
  /**
   * Builds a recur expansion instance for a specific point in time (defaults
   * to startDate).
   *
   * @param {Time=} startTime     Starting point for expansion
   * @return {RecurExpansion}    Expansion object
   */
  iterator(startTime) {
    return new RecurExpansion({
      component: this.component,
      dtstart: startTime || this.startDate
    });
  }
  /**
   * Checks if the event is recurring
   *
   * @return {Boolean}        True, if event is recurring
   */
  isRecurring() {
    let comp = this.component;
    return comp.hasProperty("rrule") || comp.hasProperty("rdate");
  }
  /**
   * Checks if the event describes a recurrence exception. See
   * {@tutorial terminology} for details.
   *
   * @return {Boolean}    True, if the event describes a recurrence exception
   */
  isRecurrenceException() {
    return this.component.hasProperty("recurrence-id");
  }
  /**
   * Returns the types of recurrences this event may have.
   *
   * Returned as an object with the following possible keys:
   *
   *    - YEARLY
   *    - MONTHLY
   *    - WEEKLY
   *    - DAILY
   *    - MINUTELY
   *    - SECONDLY
   *
   * @return {Object.<frequencyValues, Boolean>}
   *          Object of recurrence flags
   */
  getRecurrenceTypes() {
    let rules = this.component.getAllProperties("rrule");
    let i = 0;
    let len = rules.length;
    let result = /* @__PURE__ */ Object.create(null);
    for (; i < len; i++) {
      let value3 = rules[i].getFirstValue();
      result[value3.freq] = true;
    }
    return result;
  }
  /**
   * The uid of this event
   * @type {String}
   */
  get uid() {
    return this._firstProp("uid");
  }
  set uid(value3) {
    this._setProp("uid", value3);
  }
  /**
   * The start date
   * @type {Time}
   */
  get startDate() {
    return this._firstProp("dtstart");
  }
  set startDate(value3) {
    this._setTime("dtstart", value3);
  }
  /**
   * The end date. This can be the result directly from the property, or the
   * end date calculated from start date and duration. Setting the property
   * will remove any duration properties.
   * @type {Time}
   */
  get endDate() {
    let endDate = this._firstProp("dtend");
    if (!endDate) {
      let duration = this._firstProp("duration");
      endDate = this.startDate.clone();
      if (duration) {
        endDate.addDuration(duration);
      } else if (endDate.isDate) {
        endDate.day += 1;
      }
    }
    return endDate;
  }
  set endDate(value3) {
    if (this.component.hasProperty("duration")) {
      this.component.removeProperty("duration");
    }
    this._setTime("dtend", value3);
  }
  /**
   * The duration. This can be the result directly from the property, or the
   * duration calculated from start date and end date. Setting the property
   * will remove any `dtend` properties.
   * @type {Duration}
   */
  get duration() {
    let duration = this._firstProp("duration");
    if (!duration) {
      return this.endDate.subtractDateTz(this.startDate);
    }
    return duration;
  }
  set duration(value3) {
    if (this.component.hasProperty("dtend")) {
      this.component.removeProperty("dtend");
    }
    this._setProp("duration", value3);
  }
  /**
   * The location of the event.
   * @type {String}
   */
  get location() {
    return this._firstProp("location");
  }
  set location(value3) {
    this._setProp("location", value3);
  }
  /**
   * The attendees in the event
   * @type {Property[]}
   */
  get attendees() {
    return this.component.getAllProperties("attendee");
  }
  /**
   * The event summary
   * @type {String}
   */
  get summary() {
    return this._firstProp("summary");
  }
  set summary(value3) {
    this._setProp("summary", value3);
  }
  /**
   * The event description.
   * @type {String}
   */
  get description() {
    return this._firstProp("description");
  }
  set description(value3) {
    this._setProp("description", value3);
  }
  /**
   * The event color from [rfc7986](https://datatracker.ietf.org/doc/html/rfc7986)
   * @type {String}
   */
  get color() {
    return this._firstProp("color");
  }
  set color(value3) {
    this._setProp("color", value3);
  }
  /**
   * The organizer value as an uri. In most cases this is a mailto: uri, but
   * it can also be something else, like urn:uuid:...
   * @type {String}
   */
  get organizer() {
    return this._firstProp("organizer");
  }
  set organizer(value3) {
    this._setProp("organizer", value3);
  }
  /**
   * The sequence value for this event. Used for scheduling
   * see {@tutorial terminology}.
   * @type {Number}
   */
  get sequence() {
    return this._firstProp("sequence");
  }
  set sequence(value3) {
    this._setProp("sequence", value3);
  }
  /**
   * The recurrence id for this event. See {@tutorial terminology} for details.
   * @type {Time}
   */
  get recurrenceId() {
    return this._firstProp("recurrence-id");
  }
  set recurrenceId(value3) {
    this._setTime("recurrence-id", value3);
  }
  /**
   * Set/update a time property's value.
   * This will also update the TZID of the property.
   *
   * TODO: this method handles the case where we are switching
   * from a known timezone to an implied timezone (one without TZID).
   * This does _not_ handle the case of moving between a known
   *  (by TimezoneService) timezone to an unknown timezone...
   *
   * We will not add/remove/update the VTIMEZONE subcomponents
   *  leading to invalid ICAL data...
   * @private
   * @param {String} propName     The property name
   * @param {Time} time           The time to set
   */
  _setTime(propName, time) {
    let prop = this.component.getFirstProperty(propName);
    if (!prop) {
      prop = new Property(propName);
      this.component.addProperty(prop);
    }
    if (time.zone === Timezone$1.localTimezone || time.zone === Timezone$1.utcTimezone) {
      prop.removeParameter("tzid");
    } else {
      prop.setParameter("tzid", time.zone.tzid);
    }
    prop.setValue(time);
  }
  _setProp(name, value3) {
    this.component.updatePropertyWithValue(name, value3);
  }
  _firstProp(name) {
    return this.component.getFirstPropertyValue(name);
  }
  /**
   * The string representation of this event.
   * @return {String}
   */
  toString() {
    return this.component.toString();
  }
}
function compareRangeException(a2, b) {
  if (a2[0] > b[0]) return 1;
  if (b[0] > a2[0]) return -1;
  return 0;
}
class ComponentParser {
  /**
   * Creates a new ICAL.ComponentParser instance.
   *
   * @param {Object=} options                   Component parser options
   * @param {Boolean} options.parseEvent        Whether events should be parsed
   * @param {Boolean} options.parseTimezeone    Whether timezones should be parsed
   */
  constructor(options) {
    if (typeof options === "undefined") {
      options = {};
    }
    for (let [key, value3] of Object.entries(options)) {
      this[key] = value3;
    }
  }
  /**
   * When true, parse events
   *
   * @type {Boolean}
   */
  parseEvent = true;
  /**
   * When true, parse timezones
   *
   * @type {Boolean}
   */
  parseTimezone = true;
  /* SAX like events here for reference */
  /**
   * Fired when parsing is complete
   * @callback
   */
  oncomplete = (
    /* c8 ignore next */
    function() {
    }
  );
  /**
   * Fired if an error occurs during parsing.
   *
   * @callback
   * @param {Error} err details of error
   */
  onerror = (
    /* c8 ignore next */
    function(err) {
    }
  );
  /**
   * Fired when a top level component (VTIMEZONE) is found
   *
   * @callback
   * @param {Timezone} component     Timezone object
   */
  ontimezone = (
    /* c8 ignore next */
    function(component) {
    }
  );
  /**
   * Fired when a top level component (VEVENT) is found.
   *
   * @callback
   * @param {Event} component    Top level component
   */
  onevent = (
    /* c8 ignore next */
    function(component) {
    }
  );
  /**
   * Process a string or parse ical object.  This function itself will return
   * nothing but will start the parsing process.
   *
   * Events must be registered prior to calling this method.
   *
   * @param {Component|String|Object} ical      The component to process,
   *        either in its final form, as a jCal Object, or string representation
   */
  process(ical) {
    if (typeof ical === "string") {
      ical = parse$1(ical);
    }
    if (!(ical instanceof Component)) {
      ical = new Component(ical);
    }
    let components = ical.getAllSubcomponents();
    let i = 0;
    let len = components.length;
    let component;
    for (; i < len; i++) {
      component = components[i];
      switch (component.name) {
        case "vtimezone":
          if (this.parseTimezone) {
            let tzid = component.getFirstPropertyValue("tzid");
            if (tzid) {
              this.ontimezone(new Timezone$1({
                tzid,
                component
              }));
            }
          }
          break;
        case "vevent":
          if (this.parseEvent) {
            this.onevent(new Event(component));
          }
          break;
        default:
          continue;
      }
    }
    this.oncomplete();
  }
}
var ICALmodule = {
  /**
   * The number of characters before iCalendar line folding should occur
   * @type {Number}
   * @default 75
   */
  foldLength: 75,
  debug: false,
  /**
   * The character(s) to be used for a newline. The default value is provided by
   * rfc5545.
   * @type {String}
   * @default "\r\n"
   */
  newLineChar: "\r\n",
  Binary,
  Component,
  ComponentParser,
  Duration,
  Event,
  Period,
  Property,
  Recur,
  RecurExpansion,
  RecurIterator,
  Time,
  Timezone: Timezone$1,
  TimezoneService,
  UtcOffset,
  VCardTime,
  parse: parse$1,
  stringify,
  design: design$1,
  helpers
};
class Timezone2 {
  /**
   * Id of the timezone.
   */
  _timezoneId;
  /**
   * ICS representation of the timezone
   */
  _ics;
  _timezone;
  _initialized;
  constructor(timezoneId, ics) {
    if (timezoneId instanceof ICALmodule.Timezone) {
      this._timezone = timezoneId;
      this._initialized = true;
    } else if (timezoneId instanceof ICALmodule.Component) {
      this._timezone = new ICALmodule.Timezone(timezoneId);
      this._initialized = true;
    } else {
      this._timezoneId = timezoneId;
      this._ics = ics;
      this._initialized = false;
    }
  }
  /**
   * Get the timezone id
   */
  get timezoneId() {
    if (this._initialized) {
      return this._timezone.tzid;
    }
    return this._timezoneId;
  }
  /**
   * Get the UTC Offset for a given date in this timezone.
   *
   * @param year - Year of the date
   * @param month - Month of the date (1-based)
   * @param day - Day of the date
   * @param hour - Hour of the date
   * @param minute - Minute of the date
   * @param second - Second of the date
   */
  offsetForArray(year, month, day, hour, minute, second) {
    const time = new ICALmodule.Time({
      year,
      month,
      day,
      hour,
      minute,
      second,
      isDate: false
    });
    return this.timezone.utcOffset(time);
  }
  /**
   * Converts a timestamp to an array of year, month, day, hour, minute, second.
   *
   * @param {number} ms Timestamp in milliseconds
   * @return {number[]}
   */
  timestampToArray(ms) {
    const time = ICALmodule.Time.fromData({
      year: 1970,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0
    });
    time.fromUnixTime(Math.floor(ms / 1e3));
    const local = time.convertToZone(this.timezone);
    return [
      local.year,
      local.month,
      // THIS is 1-based !
      local.day,
      local.hour,
      local.minute,
      local.second
    ];
  }
  toICALTimezone() {
    return this.timezone;
  }
  /**
   * Returns the corresponding ICAL.
   */
  toICALJs() {
    return this.timezone.component;
  }
  /**
   * Initializes the inner ICAL.Timezone component if not already done.
   */
  get timezone() {
    if (!this._initialized) {
      const jCal = ICALmodule.parse(this._ics);
      const iCalComponent = new ICALmodule.Component(jCal);
      this._timezone = new ICALmodule.Timezone(iCalComponent);
      this._initialized = true;
    }
    return this._timezone;
  }
  static get utc() {
    return new Timezone2(ICALmodule.Timezone.utcTimezone);
  }
  static get floating() {
    return new Timezone2(ICALmodule.Timezone.localTimezone);
  }
}
const version = "2.2024a";
const aliases = {
  "AUS Central Standard Time": {
    aliasTo: "Australia/Darwin"
  },
  "AUS Eastern Standard Time": {
    aliasTo: "Australia/Sydney"
  },
  "Afghanistan Standard Time": {
    aliasTo: "Asia/Kabul"
  },
  "Africa/Asmera": {
    aliasTo: "Africa/Asmara"
  },
  "Africa/Timbuktu": {
    aliasTo: "Africa/Bamako"
  },
  "Alaskan Standard Time": {
    aliasTo: "America/Anchorage"
  },
  "America/Argentina/ComodRivadavia": {
    aliasTo: "America/Argentina/Catamarca"
  },
  "America/Buenos_Aires": {
    aliasTo: "America/Argentina/Buenos_Aires"
  },
  "America/Louisville": {
    aliasTo: "America/Kentucky/Louisville"
  },
  "America/Montreal": {
    aliasTo: "America/Toronto"
  },
  "America/Santa_Isabel": {
    aliasTo: "America/Tijuana"
  },
  "Arab Standard Time": {
    aliasTo: "Asia/Riyadh"
  },
  "Arabian Standard Time": {
    aliasTo: "Asia/Dubai"
  },
  "Arabic Standard Time": {
    aliasTo: "Asia/Baghdad"
  },
  "Argentina Standard Time": {
    aliasTo: "America/Argentina/Buenos_Aires"
  },
  "Asia/Calcutta": {
    aliasTo: "Asia/Kolkata"
  },
  "Asia/Katmandu": {
    aliasTo: "Asia/Kathmandu"
  },
  "Asia/Rangoon": {
    aliasTo: "Asia/Yangon"
  },
  "Asia/Saigon": {
    aliasTo: "Asia/Ho_Chi_Minh"
  },
  "Atlantic Standard Time": {
    aliasTo: "America/Halifax"
  },
  "Atlantic/Faeroe": {
    aliasTo: "Atlantic/Faroe"
  },
  "Atlantic/Jan_Mayen": {
    aliasTo: "Europe/Oslo"
  },
  "Azerbaijan Standard Time": {
    aliasTo: "Asia/Baku"
  },
  "Azores Standard Time": {
    aliasTo: "Atlantic/Azores"
  },
  "Bahia Standard Time": {
    aliasTo: "America/Bahia"
  },
  "Bangladesh Standard Time": {
    aliasTo: "Asia/Dhaka"
  },
  "Belarus Standard Time": {
    aliasTo: "Europe/Minsk"
  },
  "Canada Central Standard Time": {
    aliasTo: "America/Regina"
  },
  "Cape Verde Standard Time": {
    aliasTo: "Atlantic/Cape_Verde"
  },
  "Caucasus Standard Time": {
    aliasTo: "Asia/Yerevan"
  },
  "Cen. Australia Standard Time": {
    aliasTo: "Australia/Adelaide"
  },
  "Central America Standard Time": {
    aliasTo: "America/Guatemala"
  },
  "Central Asia Standard Time": {
    aliasTo: "Asia/Almaty"
  },
  "Central Brazilian Standard Time": {
    aliasTo: "America/Cuiaba"
  },
  "Central Europe Standard Time": {
    aliasTo: "Europe/Budapest"
  },
  "Central European Standard Time": {
    aliasTo: "Europe/Warsaw"
  },
  "Central Pacific Standard Time": {
    aliasTo: "Pacific/Guadalcanal"
  },
  "Central Standard Time": {
    aliasTo: "America/Chicago"
  },
  "Central Standard Time (Mexico)": {
    aliasTo: "America/Mexico_City"
  },
  "China Standard Time": {
    aliasTo: "Asia/Shanghai"
  },
  "E. Africa Standard Time": {
    aliasTo: "Africa/Nairobi"
  },
  "E. Australia Standard Time": {
    aliasTo: "Australia/Brisbane"
  },
  "E. South America Standard Time": {
    aliasTo: "America/Sao_Paulo"
  },
  "Eastern Standard Time": {
    aliasTo: "America/New_York"
  },
  "Egypt Standard Time": {
    aliasTo: "Africa/Cairo"
  },
  "Ekaterinburg Standard Time": {
    aliasTo: "Asia/Yekaterinburg"
  },
  "Etc/GMT": {
    aliasTo: "UTC"
  },
  "Etc/GMT+0": {
    aliasTo: "UTC"
  },
  "Etc/UCT": {
    aliasTo: "UTC"
  },
  "Etc/UTC": {
    aliasTo: "UTC"
  },
  "Etc/Unversal": {
    aliasTo: "UTC"
  },
  "Etc/Zulu": {
    aliasTo: "UTC"
  },
  "Europe/Belfast": {
    aliasTo: "Europe/London"
  },
  "FLE Standard Time": {
    aliasTo: "Europe/Kiev"
  },
  "Fiji Standard Time": {
    aliasTo: "Pacific/Fiji"
  },
  GMT: {
    aliasTo: "UTC"
  },
  "GMT Standard Time": {
    aliasTo: "Europe/London"
  },
  "GMT+0": {
    aliasTo: "UTC"
  },
  GMT0: {
    aliasTo: "UTC"
  },
  "GTB Standard Time": {
    aliasTo: "Europe/Bucharest"
  },
  "Georgian Standard Time": {
    aliasTo: "Asia/Tbilisi"
  },
  "Greenland Standard Time": {
    aliasTo: "America/Godthab"
  },
  Greenwich: {
    aliasTo: "UTC"
  },
  "Greenwich Standard Time": {
    aliasTo: "Atlantic/Reykjavik"
  },
  "Hawaiian Standard Time": {
    aliasTo: "Pacific/Honolulu"
  },
  "India Standard Time": {
    aliasTo: "Asia/Calcutta"
  },
  "Iran Standard Time": {
    aliasTo: "Asia/Tehran"
  },
  "Israel Standard Time": {
    aliasTo: "Asia/Jerusalem"
  },
  "Jordan Standard Time": {
    aliasTo: "Asia/Amman"
  },
  "Kaliningrad Standard Time": {
    aliasTo: "Europe/Kaliningrad"
  },
  "Korea Standard Time": {
    aliasTo: "Asia/Seoul"
  },
  "Libya Standard Time": {
    aliasTo: "Africa/Tripoli"
  },
  "Line Islands Standard Time": {
    aliasTo: "Pacific/Kiritimati"
  },
  "Magadan Standard Time": {
    aliasTo: "Asia/Magadan"
  },
  "Mauritius Standard Time": {
    aliasTo: "Indian/Mauritius"
  },
  "Middle East Standard Time": {
    aliasTo: "Asia/Beirut"
  },
  "Montevideo Standard Time": {
    aliasTo: "America/Montevideo"
  },
  "Morocco Standard Time": {
    aliasTo: "Africa/Casablanca"
  },
  "Mountain Standard Time": {
    aliasTo: "America/Denver"
  },
  "Mountain Standard Time (Mexico)": {
    aliasTo: "America/Chihuahua"
  },
  "Myanmar Standard Time": {
    aliasTo: "Asia/Rangoon"
  },
  "N. Central Asia Standard Time": {
    aliasTo: "Asia/Novosibirsk"
  },
  "Namibia Standard Time": {
    aliasTo: "Africa/Windhoek"
  },
  "Nepal Standard Time": {
    aliasTo: "Asia/Katmandu"
  },
  "New Zealand Standard Time": {
    aliasTo: "Pacific/Auckland"
  },
  "Newfoundland Standard Time": {
    aliasTo: "America/St_Johns"
  },
  "North Asia East Standard Time": {
    aliasTo: "Asia/Irkutsk"
  },
  "North Asia Standard Time": {
    aliasTo: "Asia/Krasnoyarsk"
  },
  "Pacific SA Standard Time": {
    aliasTo: "America/Santiago"
  },
  "Pacific Standard Time": {
    aliasTo: "America/Los_Angeles"
  },
  "Pacific Standard Time (Mexico)": {
    aliasTo: "America/Santa_Isabel"
  },
  "Pacific/Johnston": {
    aliasTo: "Pacific/Honolulu"
  },
  "Pakistan Standard Time": {
    aliasTo: "Asia/Karachi"
  },
  "Paraguay Standard Time": {
    aliasTo: "America/Asuncion"
  },
  "Romance Standard Time": {
    aliasTo: "Europe/Paris"
  },
  "Russia Time Zone 10": {
    aliasTo: "Asia/Srednekolymsk"
  },
  "Russia Time Zone 11": {
    aliasTo: "Asia/Kamchatka"
  },
  "Russia Time Zone 3": {
    aliasTo: "Europe/Samara"
  },
  "Russian Standard Time": {
    aliasTo: "Europe/Moscow"
  },
  "SA Eastern Standard Time": {
    aliasTo: "America/Cayenne"
  },
  "SA Pacific Standard Time": {
    aliasTo: "America/Bogota"
  },
  "SA Western Standard Time": {
    aliasTo: "America/La_Paz"
  },
  "SE Asia Standard Time": {
    aliasTo: "Asia/Bangkok"
  },
  "Samoa Standard Time": {
    aliasTo: "Pacific/Apia"
  },
  "Singapore Standard Time": {
    aliasTo: "Asia/Singapore"
  },
  "South Africa Standard Time": {
    aliasTo: "Africa/Johannesburg"
  },
  "Sri Lanka Standard Time": {
    aliasTo: "Asia/Colombo"
  },
  "Syria Standard Time": {
    aliasTo: "Asia/Damascus"
  },
  "Taipei Standard Time": {
    aliasTo: "Asia/Taipei"
  },
  "Tasmania Standard Time": {
    aliasTo: "Australia/Hobart"
  },
  "Tokyo Standard Time": {
    aliasTo: "Asia/Tokyo"
  },
  "Tonga Standard Time": {
    aliasTo: "Pacific/Tongatapu"
  },
  "Turkey Standard Time": {
    aliasTo: "Europe/Istanbul"
  },
  UCT: {
    aliasTo: "UTC"
  },
  "US Eastern Standard Time": {
    aliasTo: "America/Indiana/Indianapolis"
  },
  "US Mountain Standard Time": {
    aliasTo: "America/Phoenix"
  },
  "US/Central": {
    aliasTo: "America/Chicago"
  },
  "US/Eastern": {
    aliasTo: "America/New_York"
  },
  "US/Mountain": {
    aliasTo: "America/Denver"
  },
  "US/Pacific": {
    aliasTo: "America/Los_Angeles"
  },
  "US/Pacific-New": {
    aliasTo: "America/Los_Angeles"
  },
  "Ulaanbaatar Standard Time": {
    aliasTo: "Asia/Ulaanbaatar"
  },
  Universal: {
    aliasTo: "UTC"
  },
  "Venezuela Standard Time": {
    aliasTo: "America/Caracas"
  },
  "Vladivostok Standard Time": {
    aliasTo: "Asia/Vladivostok"
  },
  "W. Australia Standard Time": {
    aliasTo: "Australia/Perth"
  },
  "W. Central Africa Standard Time": {
    aliasTo: "Africa/Lagos"
  },
  "W. Europe Standard Time": {
    aliasTo: "Europe/Berlin"
  },
  "West Asia Standard Time": {
    aliasTo: "Asia/Tashkent"
  },
  "West Pacific Standard Time": {
    aliasTo: "Pacific/Port_Moresby"
  },
  "Yakutsk Standard Time": {
    aliasTo: "Asia/Yakutsk"
  },
  Z: {
    aliasTo: "UTC"
  },
  Zulu: {
    aliasTo: "UTC"
  },
  utc: {
    aliasTo: "UTC"
  }
};
const zones = {
  "Africa/Abidjan": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0000\r\nTZOFFSETTO:+0000\r\nTZNAME:GMT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0051900",
    longitude: "-0040200"
  },
  "Africa/Accra": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0000\r\nTZOFFSETTO:+0000\r\nTZNAME:GMT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Africa/Addis_Ababa": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0300\r\nTZNAME:EAT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Africa/Algiers": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0364700",
    longitude: "+0030300"
  },
  "Africa/Asmara": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0300\r\nTZNAME:EAT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Africa/Asmera": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0300\r\nTZNAME:EAT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Africa/Bamako": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0000\r\nTZOFFSETTO:+0000\r\nTZNAME:GMT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Africa/Bangui": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0100\r\nTZNAME:WAT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Africa/Banjul": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0000\r\nTZOFFSETTO:+0000\r\nTZNAME:GMT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Africa/Bissau": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0000\r\nTZOFFSETTO:+0000\r\nTZNAME:GMT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0115100",
    longitude: "-0153500"
  },
  "Africa/Blantyre": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0200\r\nTZNAME:CAT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Africa/Brazzaville": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0100\r\nTZNAME:WAT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Africa/Bujumbura": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0200\r\nTZNAME:CAT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Africa/Cairo": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0300\r\nTZNAME:EEST\r\nDTSTART:19700424T000000\r\nRRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=-1FR\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0200\r\nTZNAME:EET\r\nDTSTART:19701030T000000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1FR\r\nEND:STANDARD"
    ],
    latitude: "+0300300",
    longitude: "+0311500"
  },
  "Africa/Casablanca": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0100\r\nTZNAME:+01\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0333900",
    longitude: "-0073500"
  },
  "Africa/Ceuta": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0200\r\nTZNAME:CEST\r\nDTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ],
    latitude: "+0355300",
    longitude: "-0051900"
  },
  "Africa/Conakry": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0000\r\nTZOFFSETTO:+0000\r\nTZNAME:GMT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Africa/Dakar": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0000\r\nTZOFFSETTO:+0000\r\nTZNAME:GMT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Africa/Dar_es_Salaam": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0300\r\nTZNAME:EAT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Africa/Djibouti": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0300\r\nTZNAME:EAT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Africa/Douala": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0100\r\nTZNAME:WAT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Africa/El_Aaiun": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0100\r\nTZNAME:+01\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0270900",
    longitude: "-0131200"
  },
  "Africa/Freetown": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0000\r\nTZOFFSETTO:+0000\r\nTZNAME:GMT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Africa/Gaborone": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0200\r\nTZNAME:CAT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Africa/Harare": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0200\r\nTZNAME:CAT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Africa/Johannesburg": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0200\r\nTZNAME:SAST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0261500",
    longitude: "+0280000"
  },
  "Africa/Juba": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0200\r\nTZNAME:CAT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0045100",
    longitude: "+0313700"
  },
  "Africa/Kampala": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0300\r\nTZNAME:EAT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Africa/Khartoum": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0200\r\nTZNAME:CAT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0153600",
    longitude: "+0323200"
  },
  "Africa/Kigali": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0200\r\nTZNAME:CAT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Africa/Kinshasa": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0100\r\nTZNAME:WAT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Africa/Lagos": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0100\r\nTZNAME:WAT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0062700",
    longitude: "+0032400"
  },
  "Africa/Libreville": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0100\r\nTZNAME:WAT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Africa/Lome": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0000\r\nTZOFFSETTO:+0000\r\nTZNAME:GMT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Africa/Luanda": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0100\r\nTZNAME:WAT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Africa/Lubumbashi": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0200\r\nTZNAME:CAT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Africa/Lusaka": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0200\r\nTZNAME:CAT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Africa/Malabo": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0100\r\nTZNAME:WAT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Africa/Maputo": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0200\r\nTZNAME:CAT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0255800",
    longitude: "+0323500"
  },
  "Africa/Maseru": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0200\r\nTZNAME:SAST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Africa/Mbabane": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0200\r\nTZNAME:SAST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Africa/Mogadishu": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0300\r\nTZNAME:EAT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Africa/Monrovia": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0000\r\nTZOFFSETTO:+0000\r\nTZNAME:GMT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0061800",
    longitude: "-0104700"
  },
  "Africa/Nairobi": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0300\r\nTZNAME:EAT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0011700",
    longitude: "+0364900"
  },
  "Africa/Ndjamena": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0100\r\nTZNAME:WAT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0120700",
    longitude: "+0150300"
  },
  "Africa/Niamey": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0100\r\nTZNAME:WAT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Africa/Nouakchott": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0000\r\nTZOFFSETTO:+0000\r\nTZNAME:GMT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Africa/Ouagadougou": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0000\r\nTZOFFSETTO:+0000\r\nTZNAME:GMT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Africa/Porto-Novo": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0100\r\nTZNAME:WAT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Africa/Sao_Tome": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0000\r\nTZOFFSETTO:+0000\r\nTZNAME:GMT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0002000",
    longitude: "+0064400"
  },
  "Africa/Timbuktu": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0000\r\nTZOFFSETTO:+0000\r\nTZNAME:GMT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Africa/Tripoli": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0200\r\nTZNAME:EET\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0325400",
    longitude: "+0131100"
  },
  "Africa/Tunis": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0364800",
    longitude: "+0101100"
  },
  "Africa/Windhoek": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0200\r\nTZNAME:CAT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0223400",
    longitude: "+0170600"
  },
  "America/Adak": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-1000\r\nTZOFFSETTO:-0900\r\nTZNAME:HDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0900\r\nTZOFFSETTO:-1000\r\nTZNAME:HST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0515248",
    longitude: "-1763929"
  },
  "America/Anchorage": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0900\r\nTZOFFSETTO:-0800\r\nTZNAME:AKDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0800\r\nTZOFFSETTO:-0900\r\nTZNAME:AKST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0611305",
    longitude: "-1495401"
  },
  "America/Anguilla": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0400\r\nTZNAME:AST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "America/Antigua": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0400\r\nTZNAME:AST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "America/Araguaina": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0071200",
    longitude: "-0481200"
  },
  "America/Argentina/Buenos_Aires": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0343600",
    longitude: "-0582700"
  },
  "America/Argentina/Catamarca": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0282800",
    longitude: "-0654700"
  },
  "America/Argentina/ComodRivadavia": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "America/Argentina/Cordoba": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0312400",
    longitude: "-0641100"
  },
  "America/Argentina/Jujuy": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0241100",
    longitude: "-0651800"
  },
  "America/Argentina/La_Rioja": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0292600",
    longitude: "-0665100"
  },
  "America/Argentina/Mendoza": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0325300",
    longitude: "-0684900"
  },
  "America/Argentina/Rio_Gallegos": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0513800",
    longitude: "-0691300"
  },
  "America/Argentina/Salta": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0244700",
    longitude: "-0652500"
  },
  "America/Argentina/San_Juan": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0313200",
    longitude: "-0683100"
  },
  "America/Argentina/San_Luis": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0331900",
    longitude: "-0662100"
  },
  "America/Argentina/Tucuman": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0264900",
    longitude: "-0651300"
  },
  "America/Argentina/Ushuaia": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0544800",
    longitude: "-0681800"
  },
  "America/Aruba": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0400\r\nTZNAME:AST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "America/Asuncion": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19701004T000000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0400\r\nTZNAME:-04\r\nDTSTART:19700322T000000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=4SU\r\nEND:STANDARD"
    ],
    latitude: "-0251600",
    longitude: "-0574000"
  },
  "America/Atikokan": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0500\r\nTZNAME:EST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "America/Atka": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-1000\r\nTZOFFSETTO:-0900\r\nTZNAME:HDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0900\r\nTZOFFSETTO:-1000\r\nTZNAME:HST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ]
  },
  "America/Bahia": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0125900",
    longitude: "-0383100"
  },
  "America/Bahia_Banderas": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0600\r\nTZNAME:CST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0204800",
    longitude: "-1051500"
  },
  "America/Barbados": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0400\r\nTZNAME:AST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0130600",
    longitude: "-0593700"
  },
  "America/Belem": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0012700",
    longitude: "-0482900"
  },
  "America/Belize": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0600\r\nTZNAME:CST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0173000",
    longitude: "-0881200"
  },
  "America/Blanc-Sablon": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0400\r\nTZNAME:AST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "America/Boa_Vista": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0400\r\nTZNAME:-04\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0024900",
    longitude: "-0604000"
  },
  "America/Bogota": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0500\r\nTZNAME:-05\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0043600",
    longitude: "-0740500"
  },
  "America/Boise": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0700\r\nTZOFFSETTO:-0600\r\nTZNAME:MDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0700\r\nTZNAME:MST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0433649",
    longitude: "-1161209"
  },
  "America/Buenos_Aires": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "America/Cambridge_Bay": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0700\r\nTZOFFSETTO:-0600\r\nTZNAME:MDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0700\r\nTZNAME:MST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0690650",
    longitude: "-1050310"
  },
  "America/Campo_Grande": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0400\r\nTZNAME:-04\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0202700",
    longitude: "-0543700"
  },
  "America/Cancun": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0500\r\nTZNAME:EST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0210500",
    longitude: "-0864600"
  },
  "America/Caracas": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0400\r\nTZNAME:-04\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0103000",
    longitude: "-0665600"
  },
  "America/Catamarca": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "America/Cayenne": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0045600",
    longitude: "-0522000"
  },
  "America/Cayman": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0500\r\nTZNAME:EST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "America/Chicago": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0500\r\nTZNAME:CDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0600\r\nTZNAME:CST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0415100",
    longitude: "-0873900"
  },
  "America/Chihuahua": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0600\r\nTZNAME:CST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0283800",
    longitude: "-1060500"
  },
  "America/Ciudad_Juarez": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0700\r\nTZOFFSETTO:-0600\r\nTZNAME:MDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0700\r\nTZNAME:MST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0314400",
    longitude: "-1062900"
  },
  "America/Coral_Harbour": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0500\r\nTZNAME:EST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "America/Cordoba": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "America/Costa_Rica": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0600\r\nTZNAME:CST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0095600",
    longitude: "-0840500"
  },
  "America/Creston": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0700\r\nTZOFFSETTO:-0700\r\nTZNAME:MST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "America/Cuiaba": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0400\r\nTZNAME:-04\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0153500",
    longitude: "-0560500"
  },
  "America/Curacao": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0400\r\nTZNAME:AST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "America/Danmarkshavn": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0000\r\nTZOFFSETTO:+0000\r\nTZNAME:GMT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0764600",
    longitude: "-0184000"
  },
  "America/Dawson": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0700\r\nTZOFFSETTO:-0700\r\nTZNAME:MST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0640400",
    longitude: "-1392500"
  },
  "America/Dawson_Creek": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0700\r\nTZOFFSETTO:-0700\r\nTZNAME:MST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0554600",
    longitude: "-1201400"
  },
  "America/Denver": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0700\r\nTZOFFSETTO:-0600\r\nTZNAME:MDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0700\r\nTZNAME:MST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0394421",
    longitude: "-1045903"
  },
  "America/Detroit": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0400\r\nTZNAME:EDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0500\r\nTZNAME:EST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0421953",
    longitude: "-0830245"
  },
  "America/Dominica": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0400\r\nTZNAME:AST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "America/Edmonton": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0700\r\nTZOFFSETTO:-0600\r\nTZNAME:MDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0700\r\nTZNAME:MST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0533300",
    longitude: "-1132800"
  },
  "America/Eirunepe": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0500\r\nTZNAME:-05\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0064000",
    longitude: "-0695200"
  },
  "America/El_Salvador": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0600\r\nTZNAME:CST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0134200",
    longitude: "-0891200"
  },
  "America/Ensenada": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0800\r\nTZOFFSETTO:-0700\r\nTZNAME:PDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0700\r\nTZOFFSETTO:-0800\r\nTZNAME:PST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ]
  },
  "America/Fort_Nelson": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0700\r\nTZOFFSETTO:-0700\r\nTZNAME:MST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0584800",
    longitude: "-1224200"
  },
  "America/Fort_Wayne": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0400\r\nTZNAME:EDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0500\r\nTZNAME:EST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ]
  },
  "America/Fortaleza": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0034300",
    longitude: "-0383000"
  },
  "America/Glace_Bay": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0300\r\nTZNAME:ADT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0400\r\nTZNAME:AST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0461200",
    longitude: "-0595700"
  },
  "America/Godthab": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0200\r\nTZOFFSETTO:-0100\r\nTZNAME:-01\r\nDTSTART:19700328T230000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SA\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0100\r\nTZOFFSETTO:-0200\r\nTZNAME:-02\r\nDTSTART:19701025T000000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ]
  },
  "America/Goose_Bay": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0400\r\nTZNAME:AST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD",
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0300\r\nTZNAME:ADT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT"
    ],
    latitude: "+0532000",
    longitude: "-0602500"
  },
  "America/Grand_Turk": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0500\r\nTZNAME:EST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD",
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0400\r\nTZNAME:EDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT"
    ],
    latitude: "+0212800",
    longitude: "-0710800"
  },
  "America/Grenada": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0400\r\nTZNAME:AST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "America/Guadeloupe": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0400\r\nTZNAME:AST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "America/Guatemala": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0600\r\nTZNAME:CST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0143800",
    longitude: "-0903100"
  },
  "America/Guayaquil": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0500\r\nTZNAME:-05\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0021000",
    longitude: "-0795000"
  },
  "America/Guyana": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0400\r\nTZNAME:-04\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0064800",
    longitude: "-0581000"
  },
  "America/Halifax": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0300\r\nTZNAME:ADT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0400\r\nTZNAME:AST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0443900",
    longitude: "-0633600"
  },
  "America/Havana": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0500\r\nTZNAME:CST\r\nDTSTART:19701101T010000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD",
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0400\r\nTZNAME:CDT\r\nDTSTART:19700308T000000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT"
    ],
    latitude: "+0230800",
    longitude: "-0822200"
  },
  "America/Hermosillo": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0700\r\nTZOFFSETTO:-0700\r\nTZNAME:MST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0290400",
    longitude: "-1105800"
  },
  "America/Indiana/Indianapolis": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0400\r\nTZNAME:EDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0500\r\nTZNAME:EST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0394606",
    longitude: "-0860929"
  },
  "America/Indiana/Knox": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0500\r\nTZNAME:CDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0600\r\nTZNAME:CST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0411745",
    longitude: "-0863730"
  },
  "America/Indiana/Marengo": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0400\r\nTZNAME:EDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0500\r\nTZNAME:EST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0382232",
    longitude: "-0862041"
  },
  "America/Indiana/Petersburg": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0400\r\nTZNAME:EDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0500\r\nTZNAME:EST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0382931",
    longitude: "-0871643"
  },
  "America/Indiana/Tell_City": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0500\r\nTZNAME:CDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0600\r\nTZNAME:CST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0375711",
    longitude: "-0864541"
  },
  "America/Indiana/Vevay": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0400\r\nTZNAME:EDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0500\r\nTZNAME:EST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0384452",
    longitude: "-0850402"
  },
  "America/Indiana/Vincennes": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0400\r\nTZNAME:EDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0500\r\nTZNAME:EST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0384038",
    longitude: "-0873143"
  },
  "America/Indiana/Winamac": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0500\r\nTZNAME:EST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD",
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0400\r\nTZNAME:EDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT"
    ],
    latitude: "+0410305",
    longitude: "-0863611"
  },
  "America/Indianapolis": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0400\r\nTZNAME:EDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0500\r\nTZNAME:EST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ]
  },
  "America/Inuvik": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0700\r\nTZOFFSETTO:-0600\r\nTZNAME:MDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0700\r\nTZNAME:MST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0682059",
    longitude: "-1334300"
  },
  "America/Iqaluit": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0400\r\nTZNAME:EDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0500\r\nTZNAME:EST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0634400",
    longitude: "-0682800"
  },
  "America/Jamaica": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0500\r\nTZNAME:EST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0175805",
    longitude: "-0764736"
  },
  "America/Jujuy": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "America/Juneau": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0900\r\nTZOFFSETTO:-0800\r\nTZNAME:AKDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0800\r\nTZOFFSETTO:-0900\r\nTZNAME:AKST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0581807",
    longitude: "-1342511"
  },
  "America/Kentucky/Louisville": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0400\r\nTZNAME:EDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0500\r\nTZNAME:EST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0381515",
    longitude: "-0854534"
  },
  "America/Kentucky/Monticello": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0400\r\nTZNAME:EDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0500\r\nTZNAME:EST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0364947",
    longitude: "-0845057"
  },
  "America/Knox_IN": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0500\r\nTZNAME:CDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0600\r\nTZNAME:CST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ]
  },
  "America/Kralendijk": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0400\r\nTZNAME:AST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "America/La_Paz": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0400\r\nTZNAME:-04\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0163000",
    longitude: "-0680900"
  },
  "America/Lima": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0500\r\nTZNAME:-05\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0120300",
    longitude: "-0770300"
  },
  "America/Los_Angeles": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0800\r\nTZOFFSETTO:-0700\r\nTZNAME:PDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0700\r\nTZOFFSETTO:-0800\r\nTZNAME:PST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0340308",
    longitude: "-1181434"
  },
  "America/Louisville": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0400\r\nTZNAME:EDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0500\r\nTZNAME:EST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ]
  },
  "America/Lower_Princes": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0400\r\nTZNAME:AST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "America/Maceio": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0094000",
    longitude: "-0354300"
  },
  "America/Managua": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0600\r\nTZNAME:CST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0120900",
    longitude: "-0861700"
  },
  "America/Manaus": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0400\r\nTZNAME:-04\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0030800",
    longitude: "-0600100"
  },
  "America/Marigot": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0400\r\nTZNAME:AST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "America/Martinique": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0400\r\nTZNAME:AST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0143600",
    longitude: "-0610500"
  },
  "America/Matamoros": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0500\r\nTZNAME:CDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0600\r\nTZNAME:CST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0255000",
    longitude: "-0973000"
  },
  "America/Mazatlan": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0700\r\nTZOFFSETTO:-0700\r\nTZNAME:MST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0231300",
    longitude: "-1062500"
  },
  "America/Mendoza": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "America/Menominee": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0500\r\nTZNAME:CDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0600\r\nTZNAME:CST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0450628",
    longitude: "-0873651"
  },
  "America/Merida": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0600\r\nTZNAME:CST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0205800",
    longitude: "-0893700"
  },
  "America/Metlakatla": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0900\r\nTZOFFSETTO:-0800\r\nTZNAME:AKDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0800\r\nTZOFFSETTO:-0900\r\nTZNAME:AKST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0550737",
    longitude: "-1313435"
  },
  "America/Mexico_City": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0600\r\nTZNAME:CST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0192400",
    longitude: "-0990900"
  },
  "America/Miquelon": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0200\r\nTZNAME:-02\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0200\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0470300",
    longitude: "-0562000"
  },
  "America/Moncton": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0300\r\nTZNAME:ADT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0400\r\nTZNAME:AST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0460600",
    longitude: "-0644700"
  },
  "America/Monterrey": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0600\r\nTZNAME:CST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0254000",
    longitude: "-1001900"
  },
  "America/Montevideo": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0345433",
    longitude: "-0561245"
  },
  "America/Montreal": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0400\r\nTZNAME:EDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0500\r\nTZNAME:EST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ]
  },
  "America/Montserrat": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0400\r\nTZNAME:AST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "America/Nassau": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0400\r\nTZNAME:EDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0500\r\nTZNAME:EST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ]
  },
  "America/New_York": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0400\r\nTZNAME:EDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0500\r\nTZNAME:EST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0404251",
    longitude: "-0740023"
  },
  "America/Nipigon": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0400\r\nTZNAME:EDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0500\r\nTZNAME:EST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ]
  },
  "America/Nome": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0900\r\nTZOFFSETTO:-0800\r\nTZNAME:AKDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0800\r\nTZOFFSETTO:-0900\r\nTZNAME:AKST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0643004",
    longitude: "-1652423"
  },
  "America/Noronha": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0200\r\nTZOFFSETTO:-0200\r\nTZNAME:-02\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0035100",
    longitude: "-0322500"
  },
  "America/North_Dakota/Beulah": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0500\r\nTZNAME:CDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0600\r\nTZNAME:CST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0471551",
    longitude: "-1014640"
  },
  "America/North_Dakota/Center": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0500\r\nTZNAME:CDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0600\r\nTZNAME:CST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0470659",
    longitude: "-1011757"
  },
  "America/North_Dakota/New_Salem": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0500\r\nTZNAME:CDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0600\r\nTZNAME:CST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0465042",
    longitude: "-1012439"
  },
  "America/Nuuk": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0200\r\nTZOFFSETTO:-0100\r\nTZNAME:-01\r\nDTSTART:19700328T230000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SA\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0100\r\nTZOFFSETTO:-0200\r\nTZNAME:-02\r\nDTSTART:19701025T000000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ],
    latitude: "+0641100",
    longitude: "-0514400"
  },
  "America/Ojinaga": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0500\r\nTZNAME:CDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0600\r\nTZNAME:CST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0293400",
    longitude: "-1042500"
  },
  "America/Panama": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0500\r\nTZNAME:EST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0085800",
    longitude: "-0793200"
  },
  "America/Pangnirtung": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0400\r\nTZNAME:EDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0500\r\nTZNAME:EST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ]
  },
  "America/Paramaribo": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0055000",
    longitude: "-0551000"
  },
  "America/Phoenix": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0700\r\nTZOFFSETTO:-0700\r\nTZNAME:MST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0332654",
    longitude: "-1120424"
  },
  "America/Port-au-Prince": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0400\r\nTZNAME:EDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0500\r\nTZNAME:EST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0183200",
    longitude: "-0722000"
  },
  "America/Port_of_Spain": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0400\r\nTZNAME:AST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "America/Porto_Acre": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0500\r\nTZNAME:-05\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "America/Porto_Velho": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0400\r\nTZNAME:-04\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0084600",
    longitude: "-0635400"
  },
  "America/Puerto_Rico": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0400\r\nTZNAME:AST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0182806",
    longitude: "-0660622"
  },
  "America/Punta_Arenas": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0530900",
    longitude: "-0705500"
  },
  "America/Rainy_River": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0500\r\nTZNAME:CDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0600\r\nTZNAME:CST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ]
  },
  "America/Rankin_Inlet": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0500\r\nTZNAME:CDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0600\r\nTZNAME:CST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0624900",
    longitude: "-0920459"
  },
  "America/Recife": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0080300",
    longitude: "-0345400"
  },
  "America/Regina": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0600\r\nTZNAME:CST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0502400",
    longitude: "-1043900"
  },
  "America/Resolute": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0600\r\nTZNAME:CST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD",
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0500\r\nTZNAME:CDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT"
    ],
    latitude: "+0744144",
    longitude: "-0944945"
  },
  "America/Rio_Branco": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0500\r\nTZNAME:-05\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0095800",
    longitude: "-0674800"
  },
  "America/Rosario": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "America/Santa_Isabel": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0800\r\nTZOFFSETTO:-0700\r\nTZNAME:PDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0700\r\nTZOFFSETTO:-0800\r\nTZNAME:PST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ]
  },
  "America/Santarem": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0022600",
    longitude: "-0545200"
  },
  "America/Santiago": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0400\r\nTZNAME:-04\r\nDTSTART:19700405T000000\r\nRRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU\r\nEND:STANDARD",
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700906T000000\r\nRRULE:FREQ=YEARLY;BYMONTH=9;BYDAY=1SU\r\nEND:DAYLIGHT"
    ],
    latitude: "-0332700",
    longitude: "-0704000"
  },
  "America/Santo_Domingo": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0400\r\nTZNAME:AST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0182800",
    longitude: "-0695400"
  },
  "America/Sao_Paulo": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0233200",
    longitude: "-0463700"
  },
  "America/Scoresbysund": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0100\r\nTZOFFSETTO:-0200\r\nTZNAME:-02\r\nDTSTART:19701025T000000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD",
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0200\r\nTZOFFSETTO:-0100\r\nTZNAME:-01\r\nDTSTART:19700328T230000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SA\r\nEND:DAYLIGHT"
    ],
    latitude: "+0702900",
    longitude: "-0215800"
  },
  "America/Shiprock": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0700\r\nTZOFFSETTO:-0600\r\nTZNAME:MDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0700\r\nTZNAME:MST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ]
  },
  "America/Sitka": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0900\r\nTZOFFSETTO:-0800\r\nTZNAME:AKDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0800\r\nTZOFFSETTO:-0900\r\nTZNAME:AKST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0571035",
    longitude: "-1351807"
  },
  "America/St_Barthelemy": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0400\r\nTZNAME:AST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "America/St_Johns": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0230\r\nTZOFFSETTO:-0330\r\nTZNAME:NST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD",
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0330\r\nTZOFFSETTO:-0230\r\nTZNAME:NDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT"
    ],
    latitude: "+0473400",
    longitude: "-0524300"
  },
  "America/St_Kitts": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0400\r\nTZNAME:AST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "America/St_Lucia": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0400\r\nTZNAME:AST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "America/St_Thomas": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0400\r\nTZNAME:AST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "America/St_Vincent": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0400\r\nTZNAME:AST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "America/Swift_Current": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0600\r\nTZNAME:CST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0501700",
    longitude: "-1075000"
  },
  "America/Tegucigalpa": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0600\r\nTZNAME:CST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0140600",
    longitude: "-0871300"
  },
  "America/Thule": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0300\r\nTZNAME:ADT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0400\r\nTZNAME:AST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0763400",
    longitude: "-0684700"
  },
  "America/Thunder_Bay": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0400\r\nTZNAME:EDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0500\r\nTZNAME:EST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ]
  },
  "America/Tijuana": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0800\r\nTZOFFSETTO:-0700\r\nTZNAME:PDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0700\r\nTZOFFSETTO:-0800\r\nTZNAME:PST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0323200",
    longitude: "-1170100"
  },
  "America/Toronto": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0400\r\nTZNAME:EDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0500\r\nTZNAME:EST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0433900",
    longitude: "-0792300"
  },
  "America/Tortola": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0400\r\nTZNAME:AST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "America/Vancouver": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0800\r\nTZOFFSETTO:-0700\r\nTZNAME:PDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0700\r\nTZOFFSETTO:-0800\r\nTZNAME:PST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0491600",
    longitude: "-1230700"
  },
  "America/Virgin": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0400\r\nTZNAME:AST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "America/Whitehorse": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0700\r\nTZOFFSETTO:-0700\r\nTZNAME:MST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0604300",
    longitude: "-1350300"
  },
  "America/Winnipeg": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0500\r\nTZNAME:CDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0600\r\nTZNAME:CST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0495300",
    longitude: "-0970900"
  },
  "America/Yakutat": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0900\r\nTZOFFSETTO:-0800\r\nTZNAME:AKDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0800\r\nTZOFFSETTO:-0900\r\nTZNAME:AKST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0593249",
    longitude: "-1394338"
  },
  "America/Yellowknife": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0700\r\nTZOFFSETTO:-0600\r\nTZNAME:MDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0700\r\nTZNAME:MST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ]
  },
  "Antarctica/Casey": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0800\r\nTZOFFSETTO:+0800\r\nTZNAME:+08\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0661700",
    longitude: "+1103100"
  },
  "Antarctica/Davis": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0700\r\nTZOFFSETTO:+0700\r\nTZNAME:+07\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0683500",
    longitude: "+0775800"
  },
  "Antarctica/DumontDUrville": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1000\r\nTZOFFSETTO:+1000\r\nTZNAME:+10\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Antarctica/Macquarie": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1100\r\nTZOFFSETTO:+1000\r\nTZNAME:AEST\r\nDTSTART:19700405T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU\r\nEND:STANDARD",
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+1000\r\nTZOFFSETTO:+1100\r\nTZNAME:AEDT\r\nDTSTART:19701004T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=1SU\r\nEND:DAYLIGHT"
    ],
    latitude: "-0543000",
    longitude: "+1585700"
  },
  "Antarctica/Mawson": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0500\r\nTZOFFSETTO:+0500\r\nTZNAME:+05\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0673600",
    longitude: "+0625300"
  },
  "Antarctica/McMurdo": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+1200\r\nTZOFFSETTO:+1300\r\nTZNAME:NZDT\r\nDTSTART:19700927T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=9;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1300\r\nTZOFFSETTO:+1200\r\nTZNAME:NZST\r\nDTSTART:19700405T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU\r\nEND:STANDARD"
    ]
  },
  "Antarctica/Palmer": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0644800",
    longitude: "-0640600"
  },
  "Antarctica/Rothera": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0673400",
    longitude: "-0680800"
  },
  "Antarctica/South_Pole": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+1200\r\nTZOFFSETTO:+1300\r\nTZNAME:NZDT\r\nDTSTART:19700927T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=9;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1300\r\nTZOFFSETTO:+1200\r\nTZNAME:NZST\r\nDTSTART:19700405T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU\r\nEND:STANDARD"
    ]
  },
  "Antarctica/Syowa": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0300\r\nTZNAME:+03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Antarctica/Troll": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0000\r\nTZOFFSETTO:+0200\r\nTZNAME:+02\r\nDTSTART:19700329T010000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0000\r\nTZNAME:+00\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ],
    latitude: "-0720041",
    longitude: "+0023206"
  },
  "Antarctica/Vostok": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0500\r\nTZOFFSETTO:+0500\r\nTZNAME:+05\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0782400",
    longitude: "+1065400"
  },
  "Arctic/Longyearbyen": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0200\r\nTZNAME:CEST\r\nDTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ]
  },
  "Asia/Aden": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0300\r\nTZNAME:+03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Asia/Almaty": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0500\r\nTZOFFSETTO:+0500\r\nTZNAME:+05\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0431500",
    longitude: "+0765700"
  },
  "Asia/Amman": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0300\r\nTZNAME:+03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0315700",
    longitude: "+0355600"
  },
  "Asia/Anadyr": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1200\r\nTZOFFSETTO:+1200\r\nTZNAME:+12\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0644500",
    longitude: "+1772900"
  },
  "Asia/Aqtau": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0500\r\nTZOFFSETTO:+0500\r\nTZNAME:+05\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0443100",
    longitude: "+0501600"
  },
  "Asia/Aqtobe": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0500\r\nTZOFFSETTO:+0500\r\nTZNAME:+05\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0501700",
    longitude: "+0571000"
  },
  "Asia/Ashgabat": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0500\r\nTZOFFSETTO:+0500\r\nTZNAME:+05\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0375700",
    longitude: "+0582300"
  },
  "Asia/Ashkhabad": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0500\r\nTZOFFSETTO:+0500\r\nTZNAME:+05\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Asia/Atyrau": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0500\r\nTZOFFSETTO:+0500\r\nTZNAME:+05\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0470700",
    longitude: "+0515600"
  },
  "Asia/Baghdad": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0300\r\nTZNAME:+03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0332100",
    longitude: "+0442500"
  },
  "Asia/Bahrain": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0300\r\nTZNAME:+03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Asia/Baku": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0400\r\nTZOFFSETTO:+0400\r\nTZNAME:+04\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0402300",
    longitude: "+0495100"
  },
  "Asia/Bangkok": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0700\r\nTZOFFSETTO:+0700\r\nTZNAME:+07\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0134500",
    longitude: "+1003100"
  },
  "Asia/Barnaul": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0700\r\nTZOFFSETTO:+0700\r\nTZNAME:+07\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0532200",
    longitude: "+0834500"
  },
  "Asia/Beirut": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0300\r\nTZNAME:EEST\r\nDTSTART:19700329T000000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0200\r\nTZNAME:EET\r\nDTSTART:19701025T000000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ],
    latitude: "+0335300",
    longitude: "+0353000"
  },
  "Asia/Bishkek": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0600\r\nTZOFFSETTO:+0600\r\nTZNAME:+06\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0425400",
    longitude: "+0743600"
  },
  "Asia/Brunei": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0800\r\nTZOFFSETTO:+0800\r\nTZNAME:+08\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Asia/Calcutta": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0530\r\nTZOFFSETTO:+0530\r\nTZNAME:IST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Asia/Chita": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0900\r\nTZOFFSETTO:+0900\r\nTZNAME:+09\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0520300",
    longitude: "+1132800"
  },
  "Asia/Choibalsan": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0800\r\nTZOFFSETTO:+0800\r\nTZNAME:+08\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0480400",
    longitude: "+1143000"
  },
  "Asia/Chongqing": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0800\r\nTZOFFSETTO:+0800\r\nTZNAME:CST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Asia/Chungking": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0800\r\nTZOFFSETTO:+0800\r\nTZNAME:CST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Asia/Colombo": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0530\r\nTZOFFSETTO:+0530\r\nTZNAME:+0530\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0065600",
    longitude: "+0795100"
  },
  "Asia/Dacca": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0600\r\nTZOFFSETTO:+0600\r\nTZNAME:+06\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Asia/Damascus": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0300\r\nTZNAME:+03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0333000",
    longitude: "+0361800"
  },
  "Asia/Dhaka": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0600\r\nTZOFFSETTO:+0600\r\nTZNAME:+06\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0234300",
    longitude: "+0902500"
  },
  "Asia/Dili": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0900\r\nTZOFFSETTO:+0900\r\nTZNAME:+09\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0083300",
    longitude: "+1253500"
  },
  "Asia/Dubai": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0400\r\nTZOFFSETTO:+0400\r\nTZNAME:+04\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0251800",
    longitude: "+0551800"
  },
  "Asia/Dushanbe": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0500\r\nTZOFFSETTO:+0500\r\nTZNAME:+05\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0383500",
    longitude: "+0684800"
  },
  "Asia/Famagusta": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0300\r\nTZNAME:EEST\r\nDTSTART:19700329T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0200\r\nTZNAME:EET\r\nDTSTART:19701025T040000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ],
    latitude: "+0350700",
    longitude: "+0335700"
  },
  "Asia/Gaza": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0300\r\nTZNAME:EEST\r\nDTSTART:19700328T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SA\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0200\r\nTZNAME:EET\r\nDTSTART:19701031T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SA\r\nEND:STANDARD"
    ],
    latitude: "+0313000",
    longitude: "+0342800"
  },
  "Asia/Harbin": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0800\r\nTZOFFSETTO:+0800\r\nTZNAME:CST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Asia/Hebron": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0300\r\nTZNAME:EEST\r\nDTSTART:19700328T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SA\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0200\r\nTZNAME:EET\r\nDTSTART:19701031T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SA\r\nEND:STANDARD"
    ],
    latitude: "+0313200",
    longitude: "+0350542"
  },
  "Asia/Ho_Chi_Minh": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0700\r\nTZOFFSETTO:+0700\r\nTZNAME:+07\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0104500",
    longitude: "+1064000"
  },
  "Asia/Hong_Kong": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0800\r\nTZOFFSETTO:+0800\r\nTZNAME:HKT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0221700",
    longitude: "+1140900"
  },
  "Asia/Hovd": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0700\r\nTZOFFSETTO:+0700\r\nTZNAME:+07\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0480100",
    longitude: "+0913900"
  },
  "Asia/Irkutsk": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0800\r\nTZOFFSETTO:+0800\r\nTZNAME:+08\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0521600",
    longitude: "+1042000"
  },
  "Asia/Istanbul": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0300\r\nTZNAME:+03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Asia/Jakarta": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0700\r\nTZOFFSETTO:+0700\r\nTZNAME:WIB\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0061000",
    longitude: "+1064800"
  },
  "Asia/Jayapura": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0900\r\nTZOFFSETTO:+0900\r\nTZNAME:WIT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0023200",
    longitude: "+1404200"
  },
  "Asia/Jerusalem": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0300\r\nTZNAME:IDT\r\nDTSTART:19700327T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1FR\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0200\r\nTZNAME:IST\r\nDTSTART:19701025T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ],
    latitude: "+0314650",
    longitude: "+0351326"
  },
  "Asia/Kabul": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0430\r\nTZOFFSETTO:+0430\r\nTZNAME:+0430\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0343100",
    longitude: "+0691200"
  },
  "Asia/Kamchatka": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1200\r\nTZOFFSETTO:+1200\r\nTZNAME:+12\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0530100",
    longitude: "+1583900"
  },
  "Asia/Karachi": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0500\r\nTZOFFSETTO:+0500\r\nTZNAME:PKT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0245200",
    longitude: "+0670300"
  },
  "Asia/Kashgar": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0600\r\nTZOFFSETTO:+0600\r\nTZNAME:+06\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Asia/Kathmandu": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0545\r\nTZOFFSETTO:+0545\r\nTZNAME:+0545\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0274300",
    longitude: "+0851900"
  },
  "Asia/Katmandu": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0545\r\nTZOFFSETTO:+0545\r\nTZNAME:+0545\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Asia/Khandyga": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0900\r\nTZOFFSETTO:+0900\r\nTZNAME:+09\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0623923",
    longitude: "+1353314"
  },
  "Asia/Kolkata": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0530\r\nTZOFFSETTO:+0530\r\nTZNAME:IST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0223200",
    longitude: "+0882200"
  },
  "Asia/Krasnoyarsk": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0700\r\nTZOFFSETTO:+0700\r\nTZNAME:+07\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0560100",
    longitude: "+0925000"
  },
  "Asia/Kuala_Lumpur": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0800\r\nTZOFFSETTO:+0800\r\nTZNAME:+08\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Asia/Kuching": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0800\r\nTZOFFSETTO:+0800\r\nTZNAME:+08\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0013300",
    longitude: "+1102000"
  },
  "Asia/Kuwait": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0300\r\nTZNAME:+03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Asia/Macao": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0800\r\nTZOFFSETTO:+0800\r\nTZNAME:CST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Asia/Macau": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0800\r\nTZOFFSETTO:+0800\r\nTZNAME:CST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0221150",
    longitude: "+1133230"
  },
  "Asia/Magadan": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1100\r\nTZOFFSETTO:+1100\r\nTZNAME:+11\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0593400",
    longitude: "+1504800"
  },
  "Asia/Makassar": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0800\r\nTZOFFSETTO:+0800\r\nTZNAME:WITA\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0050700",
    longitude: "+1192400"
  },
  "Asia/Manila": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0800\r\nTZOFFSETTO:+0800\r\nTZNAME:PST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0143500",
    longitude: "+1210000"
  },
  "Asia/Muscat": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0400\r\nTZOFFSETTO:+0400\r\nTZNAME:+04\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Asia/Nicosia": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0200\r\nTZNAME:EET\r\nDTSTART:19701025T040000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD",
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0300\r\nTZNAME:EEST\r\nDTSTART:19700329T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT"
    ],
    latitude: "+0351000",
    longitude: "+0332200"
  },
  "Asia/Novokuznetsk": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0700\r\nTZOFFSETTO:+0700\r\nTZNAME:+07\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0534500",
    longitude: "+0870700"
  },
  "Asia/Novosibirsk": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0700\r\nTZOFFSETTO:+0700\r\nTZNAME:+07\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0550200",
    longitude: "+0825500"
  },
  "Asia/Omsk": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0600\r\nTZOFFSETTO:+0600\r\nTZNAME:+06\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0550000",
    longitude: "+0732400"
  },
  "Asia/Oral": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0500\r\nTZOFFSETTO:+0500\r\nTZNAME:+05\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0511300",
    longitude: "+0512100"
  },
  "Asia/Phnom_Penh": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0700\r\nTZOFFSETTO:+0700\r\nTZNAME:+07\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Asia/Pontianak": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0700\r\nTZOFFSETTO:+0700\r\nTZNAME:WIB\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0000200",
    longitude: "+1092000"
  },
  "Asia/Pyongyang": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0900\r\nTZOFFSETTO:+0900\r\nTZNAME:KST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0390100",
    longitude: "+1254500"
  },
  "Asia/Qatar": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0300\r\nTZNAME:+03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0251700",
    longitude: "+0513200"
  },
  "Asia/Qostanay": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0500\r\nTZOFFSETTO:+0500\r\nTZNAME:+05\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0531200",
    longitude: "+0633700"
  },
  "Asia/Qyzylorda": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0500\r\nTZOFFSETTO:+0500\r\nTZNAME:+05\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0444800",
    longitude: "+0652800"
  },
  "Asia/Rangoon": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0630\r\nTZOFFSETTO:+0630\r\nTZNAME:+0630\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Asia/Riyadh": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0300\r\nTZNAME:+03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0243800",
    longitude: "+0464300"
  },
  "Asia/Saigon": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0700\r\nTZOFFSETTO:+0700\r\nTZNAME:+07\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Asia/Sakhalin": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1100\r\nTZOFFSETTO:+1100\r\nTZNAME:+11\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0465800",
    longitude: "+1424200"
  },
  "Asia/Samarkand": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0500\r\nTZOFFSETTO:+0500\r\nTZNAME:+05\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0394000",
    longitude: "+0664800"
  },
  "Asia/Seoul": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0900\r\nTZOFFSETTO:+0900\r\nTZNAME:KST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0373300",
    longitude: "+1265800"
  },
  "Asia/Shanghai": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0800\r\nTZOFFSETTO:+0800\r\nTZNAME:CST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0311400",
    longitude: "+1212800"
  },
  "Asia/Singapore": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0800\r\nTZOFFSETTO:+0800\r\nTZNAME:+08\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0011700",
    longitude: "+1035100"
  },
  "Asia/Srednekolymsk": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1100\r\nTZOFFSETTO:+1100\r\nTZNAME:+11\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0672800",
    longitude: "+1534300"
  },
  "Asia/Taipei": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0800\r\nTZOFFSETTO:+0800\r\nTZNAME:CST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0250300",
    longitude: "+1213000"
  },
  "Asia/Tashkent": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0500\r\nTZOFFSETTO:+0500\r\nTZNAME:+05\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0412000",
    longitude: "+0691800"
  },
  "Asia/Tbilisi": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0400\r\nTZOFFSETTO:+0400\r\nTZNAME:+04\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0414300",
    longitude: "+0444900"
  },
  "Asia/Tehran": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0330\r\nTZOFFSETTO:+0330\r\nTZNAME:+0330\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0354000",
    longitude: "+0512600"
  },
  "Asia/Tel_Aviv": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0300\r\nTZNAME:IDT\r\nDTSTART:19700327T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1FR\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0200\r\nTZNAME:IST\r\nDTSTART:19701025T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ]
  },
  "Asia/Thimbu": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0600\r\nTZOFFSETTO:+0600\r\nTZNAME:+06\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Asia/Thimphu": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0600\r\nTZOFFSETTO:+0600\r\nTZNAME:+06\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0272800",
    longitude: "+0893900"
  },
  "Asia/Tokyo": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0900\r\nTZOFFSETTO:+0900\r\nTZNAME:JST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0353916",
    longitude: "+1394441"
  },
  "Asia/Tomsk": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0700\r\nTZOFFSETTO:+0700\r\nTZNAME:+07\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0563000",
    longitude: "+0845800"
  },
  "Asia/Ujung_Pandang": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0800\r\nTZOFFSETTO:+0800\r\nTZNAME:WITA\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Asia/Ulaanbaatar": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0800\r\nTZOFFSETTO:+0800\r\nTZNAME:+08\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0475500",
    longitude: "+1065300"
  },
  "Asia/Ulan_Bator": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0800\r\nTZOFFSETTO:+0800\r\nTZNAME:+08\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Asia/Urumqi": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0600\r\nTZOFFSETTO:+0600\r\nTZNAME:+06\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0434800",
    longitude: "+0873500"
  },
  "Asia/Ust-Nera": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1000\r\nTZOFFSETTO:+1000\r\nTZNAME:+10\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0643337",
    longitude: "+1431336"
  },
  "Asia/Vientiane": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0700\r\nTZOFFSETTO:+0700\r\nTZNAME:+07\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Asia/Vladivostok": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1000\r\nTZOFFSETTO:+1000\r\nTZNAME:+10\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0431000",
    longitude: "+1315600"
  },
  "Asia/Yakutsk": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0900\r\nTZOFFSETTO:+0900\r\nTZNAME:+09\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0620000",
    longitude: "+1294000"
  },
  "Asia/Yangon": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0630\r\nTZOFFSETTO:+0630\r\nTZNAME:+0630\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0164700",
    longitude: "+0961000"
  },
  "Asia/Yekaterinburg": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0500\r\nTZOFFSETTO:+0500\r\nTZNAME:+05\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0565100",
    longitude: "+0603600"
  },
  "Asia/Yerevan": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0400\r\nTZOFFSETTO:+0400\r\nTZNAME:+04\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0401100",
    longitude: "+0443000"
  },
  "Atlantic/Azores": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0100\r\nTZOFFSETTO:+0000\r\nTZNAME:+00\r\nDTSTART:19700329T000000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0000\r\nTZOFFSETTO:-0100\r\nTZNAME:-01\r\nDTSTART:19701025T010000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ],
    latitude: "+0374400",
    longitude: "-0254000"
  },
  "Atlantic/Bermuda": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0300\r\nTZNAME:ADT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0400\r\nTZNAME:AST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "+0321700",
    longitude: "-0644600"
  },
  "Atlantic/Canary": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0000\r\nTZOFFSETTO:+0100\r\nTZNAME:WEST\r\nDTSTART:19700329T010000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0000\r\nTZNAME:WET\r\nDTSTART:19701025T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ],
    latitude: "+0280600",
    longitude: "-0152400"
  },
  "Atlantic/Cape_Verde": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0100\r\nTZOFFSETTO:-0100\r\nTZNAME:-01\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0145500",
    longitude: "-0233100"
  },
  "Atlantic/Faeroe": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0000\r\nTZOFFSETTO:+0100\r\nTZNAME:WEST\r\nDTSTART:19700329T010000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0000\r\nTZNAME:WET\r\nDTSTART:19701025T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ]
  },
  "Atlantic/Faroe": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0000\r\nTZOFFSETTO:+0100\r\nTZNAME:WEST\r\nDTSTART:19700329T010000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0000\r\nTZNAME:WET\r\nDTSTART:19701025T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ],
    latitude: "+0620100",
    longitude: "-0064600"
  },
  "Atlantic/Jan_Mayen": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0200\r\nTZNAME:CEST\r\nDTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ]
  },
  "Atlantic/Madeira": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0000\r\nTZOFFSETTO:+0100\r\nTZNAME:WEST\r\nDTSTART:19700329T010000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0000\r\nTZNAME:WET\r\nDTSTART:19701025T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ],
    latitude: "+0323800",
    longitude: "-0165400"
  },
  "Atlantic/Reykjavik": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0000\r\nTZOFFSETTO:+0000\r\nTZNAME:GMT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Atlantic/South_Georgia": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0200\r\nTZOFFSETTO:-0200\r\nTZNAME:-02\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0541600",
    longitude: "-0363200"
  },
  "Atlantic/St_Helena": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0000\r\nTZOFFSETTO:+0000\r\nTZNAME:GMT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Atlantic/Stanley": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0514200",
    longitude: "-0575100"
  },
  "Australia/ACT": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1100\r\nTZOFFSETTO:+1000\r\nTZNAME:AEST\r\nDTSTART:19700405T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU\r\nEND:STANDARD",
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+1000\r\nTZOFFSETTO:+1100\r\nTZNAME:AEDT\r\nDTSTART:19701004T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=1SU\r\nEND:DAYLIGHT"
    ]
  },
  "Australia/Adelaide": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1030\r\nTZOFFSETTO:+0930\r\nTZNAME:ACST\r\nDTSTART:19700405T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU\r\nEND:STANDARD",
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0930\r\nTZOFFSETTO:+1030\r\nTZNAME:ACDT\r\nDTSTART:19701004T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=1SU\r\nEND:DAYLIGHT"
    ],
    latitude: "-0345500",
    longitude: "+1383500"
  },
  "Australia/Brisbane": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1000\r\nTZOFFSETTO:+1000\r\nTZNAME:AEST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0272800",
    longitude: "+1530200"
  },
  "Australia/Broken_Hill": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1030\r\nTZOFFSETTO:+0930\r\nTZNAME:ACST\r\nDTSTART:19700405T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU\r\nEND:STANDARD",
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0930\r\nTZOFFSETTO:+1030\r\nTZNAME:ACDT\r\nDTSTART:19701004T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=1SU\r\nEND:DAYLIGHT"
    ],
    latitude: "-0315700",
    longitude: "+1412700"
  },
  "Australia/Canberra": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1100\r\nTZOFFSETTO:+1000\r\nTZNAME:AEST\r\nDTSTART:19700405T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU\r\nEND:STANDARD",
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+1000\r\nTZOFFSETTO:+1100\r\nTZNAME:AEDT\r\nDTSTART:19701004T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=1SU\r\nEND:DAYLIGHT"
    ]
  },
  "Australia/Currie": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+1000\r\nTZOFFSETTO:+1100\r\nTZNAME:AEDT\r\nDTSTART:19701004T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1100\r\nTZOFFSETTO:+1000\r\nTZNAME:AEST\r\nDTSTART:19700405T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU\r\nEND:STANDARD"
    ]
  },
  "Australia/Darwin": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0930\r\nTZOFFSETTO:+0930\r\nTZNAME:ACST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0122800",
    longitude: "+1305000"
  },
  "Australia/Eucla": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0845\r\nTZOFFSETTO:+0845\r\nTZNAME:+0845\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0314300",
    longitude: "+1285200"
  },
  "Australia/Hobart": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+1000\r\nTZOFFSETTO:+1100\r\nTZNAME:AEDT\r\nDTSTART:19701004T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1100\r\nTZOFFSETTO:+1000\r\nTZNAME:AEST\r\nDTSTART:19700405T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "-0425300",
    longitude: "+1471900"
  },
  "Australia/LHI": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1100\r\nTZOFFSETTO:+1030\r\nTZNAME:+1030\r\nDTSTART:19700405T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU\r\nEND:STANDARD",
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+1030\r\nTZOFFSETTO:+1100\r\nTZNAME:+11\r\nDTSTART:19701004T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=1SU\r\nEND:DAYLIGHT"
    ]
  },
  "Australia/Lindeman": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1000\r\nTZOFFSETTO:+1000\r\nTZNAME:AEST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0201600",
    longitude: "+1490000"
  },
  "Australia/Lord_Howe": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1100\r\nTZOFFSETTO:+1030\r\nTZNAME:+1030\r\nDTSTART:19700405T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU\r\nEND:STANDARD",
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+1030\r\nTZOFFSETTO:+1100\r\nTZNAME:+11\r\nDTSTART:19701004T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=1SU\r\nEND:DAYLIGHT"
    ],
    latitude: "-0313300",
    longitude: "+1590500"
  },
  "Australia/Melbourne": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1100\r\nTZOFFSETTO:+1000\r\nTZNAME:AEST\r\nDTSTART:19700405T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU\r\nEND:STANDARD",
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+1000\r\nTZOFFSETTO:+1100\r\nTZNAME:AEDT\r\nDTSTART:19701004T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=1SU\r\nEND:DAYLIGHT"
    ],
    latitude: "-0374900",
    longitude: "+1445800"
  },
  "Australia/NSW": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1100\r\nTZOFFSETTO:+1000\r\nTZNAME:AEST\r\nDTSTART:19700405T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU\r\nEND:STANDARD",
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+1000\r\nTZOFFSETTO:+1100\r\nTZNAME:AEDT\r\nDTSTART:19701004T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=1SU\r\nEND:DAYLIGHT"
    ]
  },
  "Australia/North": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0930\r\nTZOFFSETTO:+0930\r\nTZNAME:ACST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Australia/Perth": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0800\r\nTZOFFSETTO:+0800\r\nTZNAME:AWST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0315700",
    longitude: "+1155100"
  },
  "Australia/Queensland": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1000\r\nTZOFFSETTO:+1000\r\nTZNAME:AEST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Australia/South": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1030\r\nTZOFFSETTO:+0930\r\nTZNAME:ACST\r\nDTSTART:19700405T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU\r\nEND:STANDARD",
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0930\r\nTZOFFSETTO:+1030\r\nTZNAME:ACDT\r\nDTSTART:19701004T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=1SU\r\nEND:DAYLIGHT"
    ]
  },
  "Australia/Sydney": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1100\r\nTZOFFSETTO:+1000\r\nTZNAME:AEST\r\nDTSTART:19700405T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU\r\nEND:STANDARD",
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+1000\r\nTZOFFSETTO:+1100\r\nTZNAME:AEDT\r\nDTSTART:19701004T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=1SU\r\nEND:DAYLIGHT"
    ],
    latitude: "-0335200",
    longitude: "+1511300"
  },
  "Australia/Tasmania": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+1000\r\nTZOFFSETTO:+1100\r\nTZNAME:AEDT\r\nDTSTART:19701004T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1100\r\nTZOFFSETTO:+1000\r\nTZNAME:AEST\r\nDTSTART:19700405T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU\r\nEND:STANDARD"
    ]
  },
  "Australia/Victoria": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1100\r\nTZOFFSETTO:+1000\r\nTZNAME:AEST\r\nDTSTART:19700405T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU\r\nEND:STANDARD",
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+1000\r\nTZOFFSETTO:+1100\r\nTZNAME:AEDT\r\nDTSTART:19701004T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=1SU\r\nEND:DAYLIGHT"
    ]
  },
  "Australia/West": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0800\r\nTZOFFSETTO:+0800\r\nTZNAME:AWST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Australia/Yancowinna": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1030\r\nTZOFFSETTO:+0930\r\nTZNAME:ACST\r\nDTSTART:19700405T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU\r\nEND:STANDARD",
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0930\r\nTZOFFSETTO:+1030\r\nTZNAME:ACDT\r\nDTSTART:19701004T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=1SU\r\nEND:DAYLIGHT"
    ]
  },
  "Brazil/Acre": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0500\r\nTZNAME:-05\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Brazil/DeNoronha": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0200\r\nTZOFFSETTO:-0200\r\nTZNAME:-02\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Brazil/East": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Brazil/West": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0400\r\nTZNAME:-04\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Canada/Atlantic": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0300\r\nTZNAME:ADT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0400\r\nTZNAME:AST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ]
  },
  "Canada/Central": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0500\r\nTZNAME:CDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0600\r\nTZNAME:CST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ]
  },
  "Canada/Eastern": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0400\r\nTZNAME:EDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0500\r\nTZNAME:EST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ]
  },
  "Canada/Mountain": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0700\r\nTZOFFSETTO:-0600\r\nTZNAME:MDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0700\r\nTZNAME:MST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ]
  },
  "Canada/Newfoundland": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0230\r\nTZOFFSETTO:-0330\r\nTZNAME:NST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD",
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0330\r\nTZOFFSETTO:-0230\r\nTZNAME:NDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT"
    ]
  },
  "Canada/Pacific": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0800\r\nTZOFFSETTO:-0700\r\nTZNAME:PDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0700\r\nTZOFFSETTO:-0800\r\nTZNAME:PST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ]
  },
  "Canada/Saskatchewan": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0600\r\nTZNAME:CST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Canada/Yukon": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0700\r\nTZOFFSETTO:-0700\r\nTZNAME:MST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Chile/Continental": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0400\r\nTZNAME:-04\r\nDTSTART:19700405T000000\r\nRRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU\r\nEND:STANDARD",
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0300\r\nTZNAME:-03\r\nDTSTART:19700906T000000\r\nRRULE:FREQ=YEARLY;BYMONTH=9;BYDAY=1SU\r\nEND:DAYLIGHT"
    ]
  },
  "Chile/EasterIsland": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0600\r\nTZNAME:-06\r\nDTSTART:19700404T220000\r\nRRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SA\r\nEND:STANDARD",
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0500\r\nTZNAME:-05\r\nDTSTART:19700905T220000\r\nRRULE:FREQ=YEARLY;BYMONTH=9;BYDAY=1SA\r\nEND:DAYLIGHT"
    ]
  },
  "Europe/Amsterdam": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0200\r\nTZNAME:CEST\r\nDTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ]
  },
  "Europe/Andorra": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0200\r\nTZNAME:CEST\r\nDTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ],
    latitude: "+0423000",
    longitude: "+0013100"
  },
  "Europe/Astrakhan": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0400\r\nTZOFFSETTO:+0400\r\nTZNAME:+04\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0462100",
    longitude: "+0480300"
  },
  "Europe/Athens": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0300\r\nTZNAME:EEST\r\nDTSTART:19700329T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0200\r\nTZNAME:EET\r\nDTSTART:19701025T040000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ],
    latitude: "+0375800",
    longitude: "+0234300"
  },
  "Europe/Belfast": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0000\r\nTZOFFSETTO:+0100\r\nTZNAME:BST\r\nDTSTART:19700329T010000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0000\r\nTZNAME:GMT\r\nDTSTART:19701025T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ]
  },
  "Europe/Belgrade": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0200\r\nTZNAME:CEST\r\nDTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ],
    latitude: "+0445000",
    longitude: "+0203000"
  },
  "Europe/Berlin": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0200\r\nTZNAME:CEST\r\nDTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ],
    latitude: "+0523000",
    longitude: "+0132200"
  },
  "Europe/Bratislava": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0200\r\nTZNAME:CEST\r\nDTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ]
  },
  "Europe/Brussels": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0200\r\nTZNAME:CEST\r\nDTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ],
    latitude: "+0505000",
    longitude: "+0042000"
  },
  "Europe/Bucharest": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0300\r\nTZNAME:EEST\r\nDTSTART:19700329T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0200\r\nTZNAME:EET\r\nDTSTART:19701025T040000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ],
    latitude: "+0442600",
    longitude: "+0260600"
  },
  "Europe/Budapest": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0200\r\nTZNAME:CEST\r\nDTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ],
    latitude: "+0473000",
    longitude: "+0190500"
  },
  "Europe/Busingen": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0200\r\nTZNAME:CEST\r\nDTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ]
  },
  "Europe/Chisinau": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0300\r\nTZNAME:EEST\r\nDTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0200\r\nTZNAME:EET\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ],
    latitude: "+0470000",
    longitude: "+0285000"
  },
  "Europe/Copenhagen": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0200\r\nTZNAME:CEST\r\nDTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ]
  },
  "Europe/Dublin": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0000\r\nTZOFFSETTO:+0100\r\nTZNAME:IST\r\nDTSTART:19700329T010000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:STANDARD",
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0000\r\nTZNAME:GMT\r\nDTSTART:19701025T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:DAYLIGHT"
    ],
    latitude: "+0532000",
    longitude: "-0061500"
  },
  "Europe/Gibraltar": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0200\r\nTZNAME:CEST\r\nDTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ],
    latitude: "+0360800",
    longitude: "-0052100"
  },
  "Europe/Guernsey": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0000\r\nTZOFFSETTO:+0100\r\nTZNAME:BST\r\nDTSTART:19700329T010000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0000\r\nTZNAME:GMT\r\nDTSTART:19701025T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ]
  },
  "Europe/Helsinki": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0300\r\nTZNAME:EEST\r\nDTSTART:19700329T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0200\r\nTZNAME:EET\r\nDTSTART:19701025T040000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ],
    latitude: "+0601000",
    longitude: "+0245800"
  },
  "Europe/Isle_of_Man": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0000\r\nTZOFFSETTO:+0100\r\nTZNAME:BST\r\nDTSTART:19700329T010000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0000\r\nTZNAME:GMT\r\nDTSTART:19701025T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ]
  },
  "Europe/Istanbul": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0300\r\nTZNAME:+03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0410100",
    longitude: "+0285800"
  },
  "Europe/Jersey": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0000\r\nTZOFFSETTO:+0100\r\nTZNAME:BST\r\nDTSTART:19700329T010000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0000\r\nTZNAME:GMT\r\nDTSTART:19701025T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ]
  },
  "Europe/Kaliningrad": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0200\r\nTZNAME:EET\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0544300",
    longitude: "+0203000"
  },
  "Europe/Kiev": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0200\r\nTZNAME:EET\r\nDTSTART:19701025T040000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD",
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0300\r\nTZNAME:EEST\r\nDTSTART:19700329T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT"
    ]
  },
  "Europe/Kirov": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0300\r\nTZNAME:MSK\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0583600",
    longitude: "+0493900"
  },
  "Europe/Kyiv": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0200\r\nTZNAME:EET\r\nDTSTART:19701025T040000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD",
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0300\r\nTZNAME:EEST\r\nDTSTART:19700329T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT"
    ],
    latitude: "+0502600",
    longitude: "+0303100"
  },
  "Europe/Lisbon": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0000\r\nTZNAME:WET\r\nDTSTART:19701025T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD",
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0000\r\nTZOFFSETTO:+0100\r\nTZNAME:WEST\r\nDTSTART:19700329T010000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT"
    ],
    latitude: "+0384300",
    longitude: "-0090800"
  },
  "Europe/Ljubljana": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0200\r\nTZNAME:CEST\r\nDTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ]
  },
  "Europe/London": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0000\r\nTZOFFSETTO:+0100\r\nTZNAME:BST\r\nDTSTART:19700329T010000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0000\r\nTZNAME:GMT\r\nDTSTART:19701025T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ],
    latitude: "+0513030",
    longitude: "+0000731"
  },
  "Europe/Luxembourg": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0200\r\nTZNAME:CEST\r\nDTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ]
  },
  "Europe/Madrid": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0200\r\nTZNAME:CEST\r\nDTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ],
    latitude: "+0402400",
    longitude: "-0034100"
  },
  "Europe/Malta": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0200\r\nTZNAME:CEST\r\nDTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ],
    latitude: "+0355400",
    longitude: "+0143100"
  },
  "Europe/Mariehamn": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0300\r\nTZNAME:EEST\r\nDTSTART:19700329T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0200\r\nTZNAME:EET\r\nDTSTART:19701025T040000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ]
  },
  "Europe/Minsk": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0300\r\nTZNAME:+03\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0535400",
    longitude: "+0273400"
  },
  "Europe/Monaco": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0200\r\nTZNAME:CEST\r\nDTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ]
  },
  "Europe/Moscow": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0300\r\nTZNAME:MSK\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0554521",
    longitude: "+0373704"
  },
  "Europe/Nicosia": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0200\r\nTZNAME:EET\r\nDTSTART:19701025T040000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD",
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0300\r\nTZNAME:EEST\r\nDTSTART:19700329T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT"
    ]
  },
  "Europe/Oslo": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0200\r\nTZNAME:CEST\r\nDTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ]
  },
  "Europe/Paris": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0200\r\nTZNAME:CEST\r\nDTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ],
    latitude: "+0485200",
    longitude: "+0022000"
  },
  "Europe/Podgorica": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0200\r\nTZNAME:CEST\r\nDTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ]
  },
  "Europe/Prague": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0200\r\nTZNAME:CEST\r\nDTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ],
    latitude: "+0500500",
    longitude: "+0142600"
  },
  "Europe/Riga": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0300\r\nTZNAME:EEST\r\nDTSTART:19700329T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0200\r\nTZNAME:EET\r\nDTSTART:19701025T040000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ],
    latitude: "+0565700",
    longitude: "+0240600"
  },
  "Europe/Rome": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0200\r\nTZNAME:CEST\r\nDTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ],
    latitude: "+0415400",
    longitude: "+0122900"
  },
  "Europe/Samara": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0400\r\nTZOFFSETTO:+0400\r\nTZNAME:+04\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0531200",
    longitude: "+0500900"
  },
  "Europe/San_Marino": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0200\r\nTZNAME:CEST\r\nDTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ]
  },
  "Europe/Sarajevo": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0200\r\nTZNAME:CEST\r\nDTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ]
  },
  "Europe/Saratov": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0400\r\nTZOFFSETTO:+0400\r\nTZNAME:+04\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0513400",
    longitude: "+0460200"
  },
  "Europe/Simferopol": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0300\r\nTZNAME:MSK\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0445700",
    longitude: "+0340600"
  },
  "Europe/Skopje": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0200\r\nTZNAME:CEST\r\nDTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ]
  },
  "Europe/Sofia": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0300\r\nTZNAME:EEST\r\nDTSTART:19700329T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0200\r\nTZNAME:EET\r\nDTSTART:19701025T040000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ],
    latitude: "+0424100",
    longitude: "+0231900"
  },
  "Europe/Stockholm": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0200\r\nTZNAME:CEST\r\nDTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ]
  },
  "Europe/Tallinn": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0300\r\nTZNAME:EEST\r\nDTSTART:19700329T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0200\r\nTZNAME:EET\r\nDTSTART:19701025T040000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ],
    latitude: "+0592500",
    longitude: "+0244500"
  },
  "Europe/Tirane": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0200\r\nTZNAME:CEST\r\nDTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ],
    latitude: "+0412000",
    longitude: "+0195000"
  },
  "Europe/Tiraspol": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0300\r\nTZNAME:EEST\r\nDTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0200\r\nTZNAME:EET\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ]
  },
  "Europe/Ulyanovsk": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0400\r\nTZOFFSETTO:+0400\r\nTZNAME:+04\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0542000",
    longitude: "+0482400"
  },
  "Europe/Uzhgorod": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0200\r\nTZNAME:EET\r\nDTSTART:19701025T040000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD",
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0300\r\nTZNAME:EEST\r\nDTSTART:19700329T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT"
    ]
  },
  "Europe/Vaduz": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0200\r\nTZNAME:CEST\r\nDTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ]
  },
  "Europe/Vatican": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0200\r\nTZNAME:CEST\r\nDTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ]
  },
  "Europe/Vienna": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0200\r\nTZNAME:CEST\r\nDTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ],
    latitude: "+0481300",
    longitude: "+0162000"
  },
  "Europe/Vilnius": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0300\r\nTZNAME:EEST\r\nDTSTART:19700329T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0200\r\nTZNAME:EET\r\nDTSTART:19701025T040000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ],
    latitude: "+0544100",
    longitude: "+0251900"
  },
  "Europe/Volgograd": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0300\r\nTZNAME:MSK\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0484400",
    longitude: "+0442500"
  },
  "Europe/Warsaw": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0200\r\nTZNAME:CEST\r\nDTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ],
    latitude: "+0521500",
    longitude: "+0210000"
  },
  "Europe/Zagreb": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0200\r\nTZNAME:CEST\r\nDTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ]
  },
  "Europe/Zaporozhye": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0200\r\nTZNAME:EET\r\nDTSTART:19701025T040000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD",
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0300\r\nTZNAME:EEST\r\nDTSTART:19700329T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT"
    ]
  },
  "Europe/Zurich": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0200\r\nTZNAME:CEST\r\nDTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19701025T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD"
    ],
    latitude: "+0472300",
    longitude: "+0083200"
  },
  "Indian/Antananarivo": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0300\r\nTZNAME:EAT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Indian/Chagos": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0600\r\nTZOFFSETTO:+0600\r\nTZNAME:+06\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0072000",
    longitude: "+0722500"
  },
  "Indian/Christmas": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0700\r\nTZOFFSETTO:+0700\r\nTZNAME:+07\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Indian/Cocos": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0630\r\nTZOFFSETTO:+0630\r\nTZNAME:+0630\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Indian/Comoro": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0300\r\nTZNAME:EAT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Indian/Kerguelen": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0500\r\nTZOFFSETTO:+0500\r\nTZNAME:+05\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Indian/Mahe": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0400\r\nTZOFFSETTO:+0400\r\nTZNAME:+04\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Indian/Maldives": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0500\r\nTZOFFSETTO:+0500\r\nTZNAME:+05\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0041000",
    longitude: "+0733000"
  },
  "Indian/Mauritius": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0400\r\nTZOFFSETTO:+0400\r\nTZNAME:+04\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0201000",
    longitude: "+0573000"
  },
  "Indian/Mayotte": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0300\r\nTZOFFSETTO:+0300\r\nTZNAME:EAT\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Indian/Reunion": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0400\r\nTZOFFSETTO:+0400\r\nTZNAME:+04\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Mexico/BajaNorte": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0800\r\nTZOFFSETTO:-0700\r\nTZNAME:PDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0700\r\nTZOFFSETTO:-0800\r\nTZNAME:PST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ]
  },
  "Mexico/BajaSur": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0700\r\nTZOFFSETTO:-0700\r\nTZNAME:MST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Mexico/General": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0600\r\nTZNAME:CST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Pacific/Apia": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1300\r\nTZOFFSETTO:+1300\r\nTZNAME:+13\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0135000",
    longitude: "-1714400"
  },
  "Pacific/Auckland": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+1200\r\nTZOFFSETTO:+1300\r\nTZNAME:NZDT\r\nDTSTART:19700927T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=9;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1300\r\nTZOFFSETTO:+1200\r\nTZNAME:NZST\r\nDTSTART:19700405T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "-0365200",
    longitude: "+1744600"
  },
  "Pacific/Bougainville": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1100\r\nTZOFFSETTO:+1100\r\nTZNAME:+11\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0061300",
    longitude: "+1553400"
  },
  "Pacific/Chatham": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+1245\r\nTZOFFSETTO:+1345\r\nTZNAME:+1345\r\nDTSTART:19700927T024500\r\nRRULE:FREQ=YEARLY;BYMONTH=9;BYDAY=-1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1345\r\nTZOFFSETTO:+1245\r\nTZNAME:+1245\r\nDTSTART:19700405T034500\r\nRRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "-0435700",
    longitude: "-1763300"
  },
  "Pacific/Chuuk": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1000\r\nTZOFFSETTO:+1000\r\nTZNAME:+10\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Pacific/Easter": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0600\r\nTZNAME:-06\r\nDTSTART:19700404T220000\r\nRRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SA\r\nEND:STANDARD",
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0500\r\nTZNAME:-05\r\nDTSTART:19700905T220000\r\nRRULE:FREQ=YEARLY;BYMONTH=9;BYDAY=1SA\r\nEND:DAYLIGHT"
    ],
    latitude: "-0270900",
    longitude: "-1092600"
  },
  "Pacific/Efate": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1100\r\nTZOFFSETTO:+1100\r\nTZNAME:+11\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0174000",
    longitude: "+1682500"
  },
  "Pacific/Enderbury": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1300\r\nTZOFFSETTO:+1300\r\nTZNAME:+13\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Pacific/Fakaofo": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1300\r\nTZOFFSETTO:+1300\r\nTZNAME:+13\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0092200",
    longitude: "-1711400"
  },
  "Pacific/Fiji": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1200\r\nTZOFFSETTO:+1200\r\nTZNAME:+12\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0180800",
    longitude: "+1782500"
  },
  "Pacific/Funafuti": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1200\r\nTZOFFSETTO:+1200\r\nTZNAME:+12\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Pacific/Galapagos": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0600\r\nTZNAME:-06\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0005400",
    longitude: "-0893600"
  },
  "Pacific/Gambier": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0900\r\nTZOFFSETTO:-0900\r\nTZNAME:-09\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0230800",
    longitude: "-1345700"
  },
  "Pacific/Guadalcanal": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1100\r\nTZOFFSETTO:+1100\r\nTZNAME:+11\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0093200",
    longitude: "+1601200"
  },
  "Pacific/Guam": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1000\r\nTZOFFSETTO:+1000\r\nTZNAME:ChST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0132800",
    longitude: "+1444500"
  },
  "Pacific/Honolulu": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-1000\r\nTZOFFSETTO:-1000\r\nTZNAME:HST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0211825",
    longitude: "-1575130"
  },
  "Pacific/Johnston": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-1000\r\nTZOFFSETTO:-1000\r\nTZNAME:HST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Pacific/Kanton": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1300\r\nTZOFFSETTO:+1300\r\nTZNAME:+13\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0024700",
    longitude: "-1714300"
  },
  "Pacific/Kiritimati": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1400\r\nTZOFFSETTO:+1400\r\nTZNAME:+14\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0015200",
    longitude: "-1572000"
  },
  "Pacific/Kosrae": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1100\r\nTZOFFSETTO:+1100\r\nTZNAME:+11\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0051900",
    longitude: "+1625900"
  },
  "Pacific/Kwajalein": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1200\r\nTZOFFSETTO:+1200\r\nTZNAME:+12\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0090500",
    longitude: "+1672000"
  },
  "Pacific/Majuro": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1200\r\nTZOFFSETTO:+1200\r\nTZNAME:+12\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Pacific/Marquesas": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0930\r\nTZOFFSETTO:-0930\r\nTZNAME:-0930\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0090000",
    longitude: "-1393000"
  },
  "Pacific/Midway": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-1100\r\nTZOFFSETTO:-1100\r\nTZNAME:SST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Pacific/Nauru": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1200\r\nTZOFFSETTO:+1200\r\nTZNAME:+12\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0003100",
    longitude: "+1665500"
  },
  "Pacific/Niue": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-1100\r\nTZOFFSETTO:-1100\r\nTZNAME:-11\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0190100",
    longitude: "-1695500"
  },
  "Pacific/Norfolk": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:+1100\r\nTZOFFSETTO:+1200\r\nTZNAME:+12\r\nDTSTART:19701004T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=1SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1200\r\nTZOFFSETTO:+1100\r\nTZNAME:+11\r\nDTSTART:19700405T030000\r\nRRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU\r\nEND:STANDARD"
    ],
    latitude: "-0290300",
    longitude: "+1675800"
  },
  "Pacific/Noumea": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1100\r\nTZOFFSETTO:+1100\r\nTZNAME:+11\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0221600",
    longitude: "+1662700"
  },
  "Pacific/Pago_Pago": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-1100\r\nTZOFFSETTO:-1100\r\nTZNAME:SST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0141600",
    longitude: "-1704200"
  },
  "Pacific/Palau": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+0900\r\nTZOFFSETTO:+0900\r\nTZNAME:+09\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0072000",
    longitude: "+1342900"
  },
  "Pacific/Pitcairn": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0800\r\nTZOFFSETTO:-0800\r\nTZNAME:-08\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0250400",
    longitude: "-1300500"
  },
  "Pacific/Pohnpei": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1100\r\nTZOFFSETTO:+1100\r\nTZNAME:+11\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Pacific/Ponape": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1100\r\nTZOFFSETTO:+1100\r\nTZNAME:+11\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Pacific/Port_Moresby": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1000\r\nTZOFFSETTO:+1000\r\nTZNAME:+10\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0093000",
    longitude: "+1471000"
  },
  "Pacific/Rarotonga": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-1000\r\nTZOFFSETTO:-1000\r\nTZNAME:-10\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0211400",
    longitude: "-1594600"
  },
  "Pacific/Saipan": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1000\r\nTZOFFSETTO:+1000\r\nTZNAME:ChST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Pacific/Samoa": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-1100\r\nTZOFFSETTO:-1100\r\nTZNAME:SST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Pacific/Tahiti": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-1000\r\nTZOFFSETTO:-1000\r\nTZNAME:-10\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0173200",
    longitude: "-1493400"
  },
  "Pacific/Tarawa": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1200\r\nTZOFFSETTO:+1200\r\nTZNAME:+12\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "+0012500",
    longitude: "+1730000"
  },
  "Pacific/Tongatapu": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1300\r\nTZOFFSETTO:+1300\r\nTZNAME:+13\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ],
    latitude: "-0210800",
    longitude: "-1751200"
  },
  "Pacific/Truk": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1000\r\nTZOFFSETTO:+1000\r\nTZNAME:+10\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Pacific/Wake": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1200\r\nTZOFFSETTO:+1200\r\nTZNAME:+12\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Pacific/Wallis": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1200\r\nTZOFFSETTO:+1200\r\nTZNAME:+12\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "Pacific/Yap": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:+1000\r\nTZOFFSETTO:+1000\r\nTZNAME:+10\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "US/Alaska": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0900\r\nTZOFFSETTO:-0800\r\nTZNAME:AKDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0800\r\nTZOFFSETTO:-0900\r\nTZNAME:AKST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ]
  },
  "US/Aleutian": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-1000\r\nTZOFFSETTO:-0900\r\nTZNAME:HDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0900\r\nTZOFFSETTO:-1000\r\nTZNAME:HST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ]
  },
  "US/Arizona": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0700\r\nTZOFFSETTO:-0700\r\nTZNAME:MST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "US/Central": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0500\r\nTZNAME:CDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0600\r\nTZNAME:CST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ]
  },
  "US/East-Indiana": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0400\r\nTZNAME:EDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0500\r\nTZNAME:EST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ]
  },
  "US/Eastern": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0400\r\nTZNAME:EDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0500\r\nTZNAME:EST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ]
  },
  "US/Hawaii": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-1000\r\nTZOFFSETTO:-1000\r\nTZNAME:HST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  },
  "US/Indiana-Starke": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0500\r\nTZNAME:CDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0600\r\nTZNAME:CST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ]
  },
  "US/Michigan": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0400\r\nTZNAME:EDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0500\r\nTZNAME:EST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ]
  },
  "US/Mountain": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0700\r\nTZOFFSETTO:-0600\r\nTZNAME:MDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0600\r\nTZOFFSETTO:-0700\r\nTZNAME:MST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ]
  },
  "US/Pacific": {
    ics: [
      "BEGIN:DAYLIGHT\r\nTZOFFSETFROM:-0800\r\nTZOFFSETTO:-0700\r\nTZNAME:PDT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nEND:DAYLIGHT",
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-0700\r\nTZOFFSETTO:-0800\r\nTZNAME:PST\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nEND:STANDARD"
    ]
  },
  "US/Samoa": {
    ics: [
      "BEGIN:STANDARD\r\nTZOFFSETFROM:-1100\r\nTZOFFSETTO:-1100\r\nTZNAME:SST\r\nDTSTART:19700101T000000\r\nEND:STANDARD"
    ]
  }
};
const tzData = {
  version,
  aliases,
  zones
};
class TimezoneManager {
  /**
   * Map of aliases
   * Alias name => timezoneId
   */
  _aliases = /* @__PURE__ */ new Map();
  /**
   * Map of Timezones
   * timezoneId => Timezone
   */
  _timezones = /* @__PURE__ */ new Map();
  /**
   * List of aliases that were registered while their targets were missing
   * [[aliasName, timezoneId], ...]
   */
  _pendingAliases = [];
  /**
   * Gets a timezone for the given id.
   *
   * @param timezoneId - The id of the timezone
   */
  getTimezoneForId(timezoneId) {
    let level = 0;
    while (level++ < 20) {
      if (this._timezones.has(timezoneId)) {
        return this._timezones.get(timezoneId);
      }
      if (this._aliases.has(timezoneId)) {
        timezoneId = this._aliases.get(timezoneId);
      } else {
        return null;
      }
    }
    console.error("TimezoneManager.getTimezoneForIdRec() exceeds recursion limits");
    return null;
  }
  /**
   * Checks if there is a timezone for the given id stored in this manager.
   *
   * @param timezoneId - The id of the timezone
   */
  hasTimezoneForId(timezoneId) {
    return this._timezones.has(timezoneId) || this._aliases.has(timezoneId);
  }
  /**
   * Checks if the given timezone id is an alias.
   *
   * @param timezoneId - The id of the timezone
   */
  isAlias(timezoneId) {
    return !this._timezones.has(timezoneId) && this._aliases.has(timezoneId);
  }
  /**
   * Lists all timezones.
   *
   * @param includeAliases - Whether or not to include aliases
   */
  listAllTimezones(includeAliases = false) {
    const timezones = Array.from(this._timezones.keys());
    if (includeAliases) {
      return timezones.concat(Array.from(this._aliases.keys()));
    }
    return timezones;
  }
  /**
   * Registers a timezone
   *
   * @param timezone - The timezone-object to register
   */
  registerTimezone(timezone) {
    this._timezones.set(timezone.timezoneId, timezone);
    ICALmodule.TimezoneService.register(timezone.toICALTimezone(), timezone.timezoneId);
    this._pendingAliases = this._pendingAliases.filter(([aliasName, timezoneId]) => {
      if (timezoneId !== timezone.timezoneId) {
        return true;
      }
      ICALmodule.TimezoneService.register(timezone.toICALTimezone(), aliasName);
      return false;
    });
  }
  registerDefaultTimezones() {
    console.debug(`@nextcloud/calendar-js app is using version ${tzData.version} of the timezone database`);
    for (const tzid in tzData.zones) {
      const ics = [
        "BEGIN:VTIMEZONE",
        "TZID:" + tzid,
        ...tzData.zones[tzid].ics,
        "END:VTIMEZONE"
      ].join("\r\n");
      this.registerTimezoneFromICS(tzid, ics);
    }
    for (const tzid in tzData.aliases) {
      this.registerAlias(tzid, tzData.aliases[tzid].aliasTo);
    }
  }
  /**
   * Registers a timezone based on ics data.
   *
   * @param timezoneId - The id of the timezone
   * @param ics - The iCalendar timezone definition
   */
  registerTimezoneFromICS(timezoneId, ics) {
    const timezone = new Timezone2(timezoneId, ics);
    this.registerTimezone(timezone);
  }
  /**
   * Registers a new timezone-alias
   *
   * @param aliasName - The timezone-id of the alias
   * @param timezoneId - The timezone-id to resolve the alias to
   */
  registerAlias(aliasName, timezoneId) {
    this._aliases.set(aliasName, timezoneId);
    const resolvedTimezone = this.getTimezoneForId(timezoneId);
    if (!resolvedTimezone) {
      this._pendingAliases.push([aliasName, timezoneId]);
      return;
    }
    ICALmodule.TimezoneService.register(resolvedTimezone.toICALTimezone(), aliasName);
  }
  /**
   * Unregisters a timezone.
   *
   * @param timezoneId - Unregisters a timezone by Id
   */
  unregisterTimezones(timezoneId) {
    this._timezones.delete(timezoneId);
    ICALmodule.TimezoneService.remove(timezoneId);
  }
  /**
   * Unregisters a timezone-alias.
   *
   * @param aliasName - The alias to unregister
   */
  unregisterAlias(aliasName) {
    this._aliases.delete(aliasName);
    this._pendingAliases = this._pendingAliases.filter(([pendingAliasName]) => pendingAliasName !== aliasName);
    ICALmodule.TimezoneService.remove(aliasName);
  }
  /**
   * Clear all timezones
   */
  clearAllTimezones() {
    this._aliases = /* @__PURE__ */ new Map();
    this._pendingAliases = [];
    this._timezones = /* @__PURE__ */ new Map();
    ICALmodule.TimezoneService.reset();
    timezoneManager$1.registerTimezone(Timezone2.utc);
    timezoneManager$1.registerTimezone(Timezone2.floating);
    timezoneManager$1.registerAlias("GMT", Timezone2.utc.timezoneId);
    timezoneManager$1.registerAlias("Z", Timezone2.utc.timezoneId);
  }
}
const timezoneManager$1 = new TimezoneManager();
timezoneManager$1.clearAllTimezones();
function getTimezoneManager$1() {
  return timezoneManager$1;
}
register(t24);
function getSortedTimezoneList(timezoneList = [], additionalTimezones = []) {
  const sortedByContinent = {};
  const sortedList = [];
  for (const timezoneId of timezoneList) {
    const components = timezoneId.split("/");
    let [continent, name] = [components.shift(), components.join("/")];
    if (!name) {
      name = continent;
      continent = t("Global");
    }
    sortedByContinent[continent] = sortedByContinent[continent] || {
      continent,
      regions: []
    };
    sortedByContinent[continent].regions.push({
      label: getReadableTimezoneName(name),
      cities: [],
      timezoneId
    });
  }
  for (const additionalTimezone of additionalTimezones) {
    const { continent, label, timezoneId } = additionalTimezone;
    sortedByContinent[continent] = sortedByContinent[continent] || {
      continent,
      regions: []
    };
    sortedByContinent[continent].regions.push({
      label,
      cities: [],
      timezoneId
    });
  }
  for (const continent in sortedByContinent) {
    if (!Object.prototype.hasOwnProperty.call(sortedByContinent, continent)) {
      continue;
    }
    sortedByContinent[continent].regions.sort((a2, b) => {
      if (a2.label < b.label) {
        return -1;
      }
      return 1;
    });
    sortedList.push(sortedByContinent[continent]);
  }
  sortedList.sort((a2, b) => {
    if (a2.continent < b.continent) {
      return -1;
    }
    return 1;
  });
  return sortedList;
}
function getReadableTimezoneName(timezoneId) {
  return timezoneId.split("_").join(" ").replace("St ", "St. ").split("/").join(" - ");
}
const timezoneManager = getTimezoneManager$1();
let initialized = false;
function getTimezoneManager() {
  if (!initialized) {
    timezoneManager.registerDefaultTimezones();
    initialized = true;
  }
  return timezoneManager;
}
register(t41);
const _sfc_main$3 = {
  name: "NcTimezonePicker",
  components: {
    NcSelect
  },
  model: {
    prop: "modelValue",
    event: "update:modelValue"
  },
  props: {
    /**
     * An array of additional timezones to include with the standard database. Useful if there is a custom timezone, e.g. read from user data
     */
    additionalTimezones: {
      type: Array,
      default: () => []
    },
    /**
     * Removed in v9 - use `modelValue` (`v-model`) instead
     * @deprecated
     */
    value: {
      type: String,
      default: void 0
    },
    /**
     * The selected timezone. Use v-model for two-way binding. The default timezone is floating, which means a time independent of timezone. See https://icalendar.org/CalDAV-Access-RFC-4791/7-3-date-and-floating-time.html for details.
     */
    modelValue: {
      type: String,
      default: "floating"
    },
    /**
     * ID of the inner vue-select element, can be used for labels like: `vs-${uid}__combobox`
     */
    uid: {
      type: [String, Number],
      default: () => `tz-${GenRandomId(5)}`
    }
  },
  emits: [
    /**
     * Removed in v9 - use `update:modelValue` (`v-model`) instead
     * @deprecated
     */
    "input",
    /**
     * Two-way binding of the value prop. Use v-model="selectedTimezone" for two-way binding
     */
    "update:modelValue",
    /** Same as update:modelValue for Vue 2 compatibility */
    "update:model-value"
  ],
  setup() {
    const model = useModelMigration("value", "input");
    return {
      model
    };
  },
  computed: {
    placeholder() {
      return t("Type to search time zone");
    },
    selectedTimezone() {
      for (const additionalTimezone of this.additionalTimezones) {
        if (additionalTimezone.timezoneId === this.model) {
          return additionalTimezone;
        }
      }
      return {
        label: getReadableTimezoneName(this.model),
        timezoneId: this.model
      };
    },
    options() {
      const timezoneManager2 = getTimezoneManager();
      const timezoneList = getSortedTimezoneList(timezoneManager2.listAllTimezones(), this.additionalTimezones);
      let timezonesGrouped = [];
      Object.values(timezoneList).forEach((group) => {
        timezonesGrouped = timezonesGrouped.concat(group.regions);
      });
      return timezonesGrouped;
    }
  },
  methods: {
    t,
    change(newValue) {
      if (!newValue) {
        return;
      }
      this.model = newValue.timezoneId;
    },
    /**
     * Returns whether this is a continent label,
     * or an actual timezone. Continent labels are not selectable.
     *
     * @param {string} option The option
     * @return {boolean}
     */
    isSelectable(option) {
      return !option.timezoneId.startsWith("tz-group__");
    },
    /**
     * Function to filter the timezone list.
     * We search in the timezoneId, so both continent and region names can be matched.
     *
     * @param {object} option The timezone option
     * @param {string} label The label of the timezone
     * @param {string} search The search string
     * @return {boolean}
     */
    filterBy(option, label, search) {
      const terms = search.trim().split(" ");
      if (option.timezoneId.startsWith("tz-group__")) {
        return option.regions.some((region) => {
          return this.matchTimezoneId(region.timezoneId, terms);
        });
      }
      return this.matchTimezoneId(option.timezoneId, terms);
    },
    matchTimezoneId(timezoneId, terms) {
      return terms.every((term) => timezoneId.toLowerCase().includes(term.toLowerCase()));
    }
  }
};
var _sfc_render$3 = function render() {
  var _vm = this, _c = _vm._self._c;
  return _c("NcSelect", { attrs: { "aria-label-combobox": _vm.t("Search for time zone"), "clearable": false, "filter-by": _vm.filterBy, "multiple": false, "options": _vm.options, "placeholder": _vm.placeholder, "selectable": _vm.isSelectable, "uid": _vm.uid, "value": _vm.selectedTimezone, "label": "label" }, on: { "option:selected": _vm.change } });
};
var _sfc_staticRenderFns$3 = [];
var __component__$3 = /* @__PURE__ */ normalizeComponent$1(
  _sfc_main$3,
  _sfc_render$3,
  _sfc_staticRenderFns$3,
  false,
  null,
  null
);
const NcTimezonePicker = __component__$3.exports;
function isDate(value3) {
  return value3 instanceof Date || Object.prototype.toString.call(value3) === "[object Date]";
}
function toDate(value3) {
  if (isDate(value3)) {
    return new Date(value3.getTime());
  }
  if (value3 == null) {
    return /* @__PURE__ */ new Date(NaN);
  }
  return new Date(value3);
}
function isValidDate$1(value3) {
  return isDate(value3) && !isNaN(value3.getTime());
}
function startOfWeek(value3) {
  var firstDayOfWeek2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
  if (!(firstDayOfWeek2 >= 0 && firstDayOfWeek2 <= 6)) {
    throw new RangeError("weekStartsOn must be between 0 and 6");
  }
  var date = toDate(value3);
  var day = date.getDay();
  var diff = (day + 7 - firstDayOfWeek2) % 7;
  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
  return date;
}
function startOfWeekYear(value3) {
  var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref$firstDayOfWeek = _ref.firstDayOfWeek, firstDayOfWeek2 = _ref$firstDayOfWeek === void 0 ? 0 : _ref$firstDayOfWeek, _ref$firstWeekContain = _ref.firstWeekContainsDate, firstWeekContainsDate = _ref$firstWeekContain === void 0 ? 1 : _ref$firstWeekContain;
  if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
    throw new RangeError("firstWeekContainsDate must be between 1 and 7");
  }
  var date = toDate(value3);
  var year = date.getFullYear();
  var firstDateOfFirstWeek = /* @__PURE__ */ new Date(0);
  for (var i = year + 1; i >= year - 1; i--) {
    firstDateOfFirstWeek.setFullYear(i, 0, firstWeekContainsDate);
    firstDateOfFirstWeek.setHours(0, 0, 0, 0);
    firstDateOfFirstWeek = startOfWeek(firstDateOfFirstWeek, firstDayOfWeek2);
    if (date.getTime() >= firstDateOfFirstWeek.getTime()) {
      break;
    }
  }
  return firstDateOfFirstWeek;
}
function getWeek(value3) {
  var _ref2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref2$firstDayOfWeek = _ref2.firstDayOfWeek, firstDayOfWeek2 = _ref2$firstDayOfWeek === void 0 ? 0 : _ref2$firstDayOfWeek, _ref2$firstWeekContai = _ref2.firstWeekContainsDate, firstWeekContainsDate = _ref2$firstWeekContai === void 0 ? 1 : _ref2$firstWeekContai;
  var date = toDate(value3);
  var firstDateOfThisWeek = startOfWeek(date, firstDayOfWeek2);
  var firstDateOfFirstWeek = startOfWeekYear(date, {
    firstDayOfWeek: firstDayOfWeek2,
    firstWeekContainsDate
  });
  var diff = firstDateOfThisWeek.getTime() - firstDateOfFirstWeek.getTime();
  return Math.round(diff / (7 * 24 * 3600 * 1e3)) + 1;
}
var locale$1 = {
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  weekdaysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  firstDayOfWeek: 0,
  firstWeekContainsDate: 1
};
var REGEX_FORMAT = /\[([^\]]+)]|YYYY|YY?|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|m{1,2}|s{1,2}|Z{1,2}|S{1,3}|w{1,2}|x|X|a|A/g;
function pad(val) {
  var len = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 2;
  var output = "".concat(Math.abs(val));
  var sign = val < 0 ? "-" : "";
  while (output.length < len) {
    output = "0".concat(output);
  }
  return sign + output;
}
function getOffset(date) {
  return Math.round(date.getTimezoneOffset() / 15) * 15;
}
function formatTimezone(offset) {
  var delimeter = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
  var sign = offset > 0 ? "-" : "+";
  var absOffset = Math.abs(offset);
  var hours = Math.floor(absOffset / 60);
  var minutes = absOffset % 60;
  return sign + pad(hours, 2) + delimeter + pad(minutes, 2);
}
var meridiem = function meridiem2(h2, _, isLowercase) {
  var word = h2 < 12 ? "AM" : "PM";
  return isLowercase ? word.toLocaleLowerCase() : word;
};
var formatFlags = {
  Y: function Y(date) {
    var y = date.getFullYear();
    return y <= 9999 ? "".concat(y) : "+".concat(y);
  },
  // Year: 00, 01, ..., 99
  YY: function YY(date) {
    return pad(date.getFullYear(), 4).substr(2);
  },
  // Year: 1900, 1901, ..., 2099
  YYYY: function YYYY(date) {
    return pad(date.getFullYear(), 4);
  },
  // Month: 1, 2, ..., 12
  M: function M(date) {
    return date.getMonth() + 1;
  },
  // Month: 01, 02, ..., 12
  MM: function MM(date) {
    return pad(date.getMonth() + 1, 2);
  },
  MMM: function MMM(date, locale3) {
    return locale3.monthsShort[date.getMonth()];
  },
  MMMM: function MMMM(date, locale3) {
    return locale3.months[date.getMonth()];
  },
  // Day of month: 1, 2, ..., 31
  D: function D(date) {
    return date.getDate();
  },
  // Day of month: 01, 02, ..., 31
  DD: function DD(date) {
    return pad(date.getDate(), 2);
  },
  // Hour: 0, 1, ... 23
  H: function H(date) {
    return date.getHours();
  },
  // Hour: 00, 01, ..., 23
  HH: function HH(date) {
    return pad(date.getHours(), 2);
  },
  // Hour: 1, 2, ..., 12
  h: function h(date) {
    var hours = date.getHours();
    if (hours === 0) {
      return 12;
    }
    if (hours > 12) {
      return hours % 12;
    }
    return hours;
  },
  // Hour: 01, 02, ..., 12
  hh: function hh() {
    var hours = formatFlags.h.apply(formatFlags, arguments);
    return pad(hours, 2);
  },
  // Minute: 0, 1, ..., 59
  m: function m(date) {
    return date.getMinutes();
  },
  // Minute: 00, 01, ..., 59
  mm: function mm(date) {
    return pad(date.getMinutes(), 2);
  },
  // Second: 0, 1, ..., 59
  s: function s(date) {
    return date.getSeconds();
  },
  // Second: 00, 01, ..., 59
  ss: function ss(date) {
    return pad(date.getSeconds(), 2);
  },
  // 1/10 of second: 0, 1, ..., 9
  S: function S(date) {
    return Math.floor(date.getMilliseconds() / 100);
  },
  // 1/100 of second: 00, 01, ..., 99
  SS: function SS(date) {
    return pad(Math.floor(date.getMilliseconds() / 10), 2);
  },
  // Millisecond: 000, 001, ..., 999
  SSS: function SSS(date) {
    return pad(date.getMilliseconds(), 3);
  },
  // Day of week: 0, 1, ..., 6
  d: function d(date) {
    return date.getDay();
  },
  // Day of week: 'Su', 'Mo', ..., 'Sa'
  dd: function dd(date, locale3) {
    return locale3.weekdaysMin[date.getDay()];
  },
  // Day of week: 'Sun', 'Mon',..., 'Sat'
  ddd: function ddd(date, locale3) {
    return locale3.weekdaysShort[date.getDay()];
  },
  // Day of week: 'Sunday', 'Monday', ...,'Saturday'
  dddd: function dddd(date, locale3) {
    return locale3.weekdays[date.getDay()];
  },
  // AM, PM
  A: function A(date, locale3) {
    var meridiemFunc = locale3.meridiem || meridiem;
    return meridiemFunc(date.getHours(), date.getMinutes(), false);
  },
  // am, pm
  a: function a(date, locale3) {
    var meridiemFunc = locale3.meridiem || meridiem;
    return meridiemFunc(date.getHours(), date.getMinutes(), true);
  },
  // Timezone: -01:00, +00:00, ... +12:00
  Z: function Z(date) {
    return formatTimezone(getOffset(date), ":");
  },
  // Timezone: -0100, +0000, ... +1200
  ZZ: function ZZ(date) {
    return formatTimezone(getOffset(date));
  },
  // Seconds timestamp: 512969520
  X: function X(date) {
    return Math.floor(date.getTime() / 1e3);
  },
  // Milliseconds timestamp: 512969520900
  x: function x(date) {
    return date.getTime();
  },
  w: function w(date, locale3) {
    return getWeek(date, {
      firstDayOfWeek: locale3.firstDayOfWeek,
      firstWeekContainsDate: locale3.firstWeekContainsDate
    });
  },
  ww: function ww(date, locale3) {
    return pad(formatFlags.w(date, locale3), 2);
  }
};
function format(val, str) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  var formatStr = str ? String(str) : "YYYY-MM-DDTHH:mm:ss.SSSZ";
  var date = toDate(val);
  if (!isValidDate$1(date)) {
    return "Invalid Date";
  }
  var locale3 = options.locale || locale$1;
  return formatStr.replace(REGEX_FORMAT, function(match, p1) {
    if (p1) {
      return p1;
    }
    if (typeof formatFlags[match] === "function") {
      return "".concat(formatFlags[match](date, locale3));
    }
    return match;
  });
}
function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}
function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
}
function ownKeys$1(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys$1(source, true).forEach(function(key) {
        _defineProperty$1(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys$1(source).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function _slicedToArray$1(arr, i) {
  return _arrayWithHoles$1(arr) || _iterableToArrayLimit$1(arr, i) || _nonIterableRest$1();
}
function _nonIterableRest$1() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}
function _iterableToArrayLimit$1(arr, i) {
  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
    return;
  }
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = void 0;
  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}
function _arrayWithHoles$1(arr) {
  if (Array.isArray(arr)) return arr;
}
function _defineProperty$1(obj, key, value3) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value: value3, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value3;
  }
  return obj;
}
var formattingTokens = /(\[[^\[]*\])|(MM?M?M?|Do|DD?|ddd?d?|w[o|w]?|YYYY|YY|a|A|hh?|HH?|mm?|ss?|S{1,3}|x|X|ZZ?|.)/g;
var match1 = /\d/;
var match2 = /\d\d/;
var match3 = /\d{3}/;
var match4 = /\d{4}/;
var match1to2 = /\d\d?/;
var matchShortOffset = /[+-]\d\d:?\d\d/;
var matchSigned = /[+-]?\d+/;
var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/;
var YEAR = "year";
var MONTH = "month";
var DAY = "day";
var HOUR = "hour";
var MINUTE = "minute";
var SECOND = "second";
var MILLISECOND = "millisecond";
var parseFlags = {};
var addParseFlag = function addParseFlag2(token, regex, callback) {
  var tokens = Array.isArray(token) ? token : [token];
  var func;
  if (typeof callback === "string") {
    func = function func2(input) {
      var value3 = parseInt(input, 10);
      return _defineProperty$1({}, callback, value3);
    };
  } else {
    func = callback;
  }
  tokens.forEach(function(key) {
    parseFlags[key] = [regex, func];
  });
};
var escapeStringRegExp = function escapeStringRegExp2(str) {
  return str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
};
var matchWordRegExp = function matchWordRegExp2(localeKey) {
  return function(locale3) {
    var array = locale3[localeKey];
    if (!Array.isArray(array)) {
      throw new Error("Locale[".concat(localeKey, "] need an array"));
    }
    return new RegExp(array.map(escapeStringRegExp).join("|"));
  };
};
var matchWordCallback = function matchWordCallback2(localeKey, key) {
  return function(input, locale3) {
    var array = locale3[localeKey];
    if (!Array.isArray(array)) {
      throw new Error("Locale[".concat(localeKey, "] need an array"));
    }
    var index = array.indexOf(input);
    if (index < 0) {
      throw new Error("Invalid Word");
    }
    return _defineProperty$1({}, key, index);
  };
};
addParseFlag("Y", matchSigned, YEAR);
addParseFlag("YY", match2, function(input) {
  var year = (/* @__PURE__ */ new Date()).getFullYear();
  var cent = Math.floor(year / 100);
  var value3 = parseInt(input, 10);
  value3 = (value3 > 68 ? cent - 1 : cent) * 100 + value3;
  return _defineProperty$1({}, YEAR, value3);
});
addParseFlag("YYYY", match4, YEAR);
addParseFlag("M", match1to2, function(input) {
  return _defineProperty$1({}, MONTH, parseInt(input, 10) - 1);
});
addParseFlag("MM", match2, function(input) {
  return _defineProperty$1({}, MONTH, parseInt(input, 10) - 1);
});
addParseFlag("MMM", matchWordRegExp("monthsShort"), matchWordCallback("monthsShort", MONTH));
addParseFlag("MMMM", matchWordRegExp("months"), matchWordCallback("months", MONTH));
addParseFlag("D", match1to2, DAY);
addParseFlag("DD", match2, DAY);
addParseFlag(["H", "h"], match1to2, HOUR);
addParseFlag(["HH", "hh"], match2, HOUR);
addParseFlag("m", match1to2, MINUTE);
addParseFlag("mm", match2, MINUTE);
addParseFlag("s", match1to2, SECOND);
addParseFlag("ss", match2, SECOND);
addParseFlag("S", match1, function(input) {
  return _defineProperty$1({}, MILLISECOND, parseInt(input, 10) * 100);
});
addParseFlag("SS", match2, function(input) {
  return _defineProperty$1({}, MILLISECOND, parseInt(input, 10) * 10);
});
addParseFlag("SSS", match3, MILLISECOND);
function matchMeridiem(locale3) {
  return locale3.meridiemParse || /[ap]\.?m?\.?/i;
}
function defaultIsPM(input) {
  return "".concat(input).toLowerCase().charAt(0) === "p";
}
addParseFlag(["A", "a"], matchMeridiem, function(input, locale3) {
  var isPM = typeof locale3.isPM === "function" ? locale3.isPM(input) : defaultIsPM(input);
  return {
    isPM
  };
});
function offsetFromString(str) {
  var _ref8 = str.match(/([+-]|\d\d)/g) || ["-", "0", "0"], _ref9 = _slicedToArray$1(_ref8, 3), symbol = _ref9[0], hour = _ref9[1], minute = _ref9[2];
  var minutes = parseInt(hour, 10) * 60 + parseInt(minute, 10);
  if (minutes === 0) {
    return 0;
  }
  return symbol === "+" ? -minutes : +minutes;
}
addParseFlag(["Z", "ZZ"], matchShortOffset, function(input) {
  return {
    offset: offsetFromString(input)
  };
});
addParseFlag("x", matchSigned, function(input) {
  return {
    date: new Date(parseInt(input, 10))
  };
});
addParseFlag("X", matchTimestamp, function(input) {
  return {
    date: new Date(parseFloat(input) * 1e3)
  };
});
addParseFlag("d", match1, "weekday");
addParseFlag("dd", matchWordRegExp("weekdaysMin"), matchWordCallback("weekdaysMin", "weekday"));
addParseFlag("ddd", matchWordRegExp("weekdaysShort"), matchWordCallback("weekdaysShort", "weekday"));
addParseFlag("dddd", matchWordRegExp("weekdays"), matchWordCallback("weekdays", "weekday"));
addParseFlag("w", match1to2, "week");
addParseFlag("ww", match2, "week");
function to24hour(hour, isPM) {
  if (hour !== void 0 && isPM !== void 0) {
    if (isPM) {
      if (hour < 12) {
        return hour + 12;
      }
    } else if (hour === 12) {
      return 0;
    }
  }
  return hour;
}
function getFullInputArray(input) {
  var backupDate = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : /* @__PURE__ */ new Date();
  var result = [0, 0, 1, 0, 0, 0, 0];
  var backupArr = [backupDate.getFullYear(), backupDate.getMonth(), backupDate.getDate(), backupDate.getHours(), backupDate.getMinutes(), backupDate.getSeconds(), backupDate.getMilliseconds()];
  var useBackup = true;
  for (var i = 0; i < 7; i++) {
    if (input[i] === void 0) {
      result[i] = useBackup ? backupArr[i] : result[i];
    } else {
      result[i] = input[i];
      useBackup = false;
    }
  }
  return result;
}
function createDate$1(y, m2, d2, h2, M2, s2, ms) {
  var date;
  if (y < 100 && y >= 0) {
    date = new Date(y + 400, m2, d2, h2, M2, s2, ms);
    if (isFinite(date.getFullYear())) {
      date.setFullYear(y);
    }
  } else {
    date = new Date(y, m2, d2, h2, M2, s2, ms);
  }
  return date;
}
function createUTCDate() {
  var date;
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  var y = args[0];
  if (y < 100 && y >= 0) {
    args[0] += 400;
    date = new Date(Date.UTC.apply(Date, args));
    if (isFinite(date.getUTCFullYear())) {
      date.setUTCFullYear(y);
    }
  } else {
    date = new Date(Date.UTC.apply(Date, args));
  }
  return date;
}
function makeParser(dateString, format2, locale3) {
  var tokens = format2.match(formattingTokens);
  if (!tokens) {
    throw new Error();
  }
  var length = tokens.length;
  var mark = {};
  for (var i = 0; i < length; i += 1) {
    var token = tokens[i];
    var parseTo = parseFlags[token];
    if (!parseTo) {
      var word = token.replace(/^\[|\]$/g, "");
      if (dateString.indexOf(word) === 0) {
        dateString = dateString.substr(word.length);
      } else {
        throw new Error("not match");
      }
    } else {
      var regex = typeof parseTo[0] === "function" ? parseTo[0](locale3) : parseTo[0];
      var parser = parseTo[1];
      var value3 = (regex.exec(dateString) || [])[0];
      var obj = parser(value3, locale3);
      mark = _objectSpread({}, mark, {}, obj);
      dateString = dateString.replace(value3, "");
    }
  }
  return mark;
}
function parse(str, format2) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  try {
    var _options$locale = options.locale, _locale = _options$locale === void 0 ? locale$1 : _options$locale, _options$backupDate = options.backupDate, backupDate = _options$backupDate === void 0 ? /* @__PURE__ */ new Date() : _options$backupDate;
    var parseResult = makeParser(str, format2, _locale);
    var year = parseResult.year, month = parseResult.month, day = parseResult.day, hour = parseResult.hour, minute = parseResult.minute, second = parseResult.second, millisecond = parseResult.millisecond, isPM = parseResult.isPM, date = parseResult.date, offset = parseResult.offset, weekday = parseResult.weekday, week = parseResult.week;
    if (date) {
      return date;
    }
    var inputArray = [year, month, day, hour, minute, second, millisecond];
    inputArray[3] = to24hour(inputArray[3], isPM);
    if (week !== void 0 && month === void 0 && day === void 0) {
      var firstDate = startOfWeekYear(year === void 0 ? backupDate : new Date(year, 3), {
        firstDayOfWeek: _locale.firstDayOfWeek,
        firstWeekContainsDate: _locale.firstWeekContainsDate
      });
      return new Date(firstDate.getTime() + (week - 1) * 7 * 24 * 3600 * 1e3);
    }
    var parsedDate;
    var result = getFullInputArray(inputArray, backupDate);
    if (offset !== void 0) {
      result[6] += offset * 60 * 1e3;
      parsedDate = createUTCDate.apply(void 0, _toConsumableArray(result));
    } else {
      parsedDate = createDate$1.apply(void 0, _toConsumableArray(result));
    }
    if (weekday !== void 0 && parsedDate.getDay() !== weekday) {
      return /* @__PURE__ */ new Date(NaN);
    }
    return parsedDate;
  } catch (e) {
    return /* @__PURE__ */ new Date(NaN);
  }
}
function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof = function(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof(obj);
}
function _defineProperty(obj, key, value3) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value3,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value3;
  }
  return obj;
}
function _extends() {
  _extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = void 0;
  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _extends$1() {
  return _extends$1 = Object.assign || function(a2) {
    for (var b, c = 1; c < arguments.length; c++) {
      for (var d2 in b = arguments[c], b) {
        Object.prototype.hasOwnProperty.call(b, d2) && (a2[d2] = b[d2]);
      }
    }
    return a2;
  }, _extends$1.apply(this, arguments);
}
var normalMerge = ["attrs", "props", "domProps"], toArrayMerge = ["class", "style", "directives"], functionalMerge = ["on", "nativeOn"], mergeJsxProps = function mergeJsxProps2(a2) {
  return a2.reduce(function(c, a3) {
    for (var b in a3) {
      if (!c[b]) c[b] = a3[b];
      else if (-1 !== normalMerge.indexOf(b)) c[b] = _extends$1({}, c[b], a3[b]);
      else if (-1 !== toArrayMerge.indexOf(b)) {
        var d2 = c[b] instanceof Array ? c[b] : [c[b]], e = a3[b] instanceof Array ? a3[b] : [a3[b]];
        c[b] = d2.concat(e);
      } else if (-1 !== functionalMerge.indexOf(b)) {
        for (var f in a3[b]) {
          if (c[b][f]) {
            var g = c[b][f] instanceof Array ? c[b][f] : [c[b][f]], h2 = a3[b][f] instanceof Array ? a3[b][f] : [a3[b][f]];
            c[b][f] = g.concat(h2);
          } else c[b][f] = a3[b][f];
        }
      } else if ("hook" == b) for (var i in a3[b]) {
        c[b][i] = c[b][i] ? mergeFn(c[b][i], a3[b][i]) : a3[b][i];
      }
      else c[b] = a3[b];
    }
    return c;
  }, {});
}, mergeFn = function mergeFn2(a2, b) {
  return function() {
    a2 && a2.apply(this, arguments), b && b.apply(this, arguments);
  };
};
var helper = mergeJsxProps;
function createDate(y) {
  var M2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
  var d2 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
  var h2 = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0;
  var m2 = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : 0;
  var s2 = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : 0;
  var ms = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : 0;
  var date = new Date(y, M2, d2, h2, m2, s2, ms);
  if (y < 100 && y >= 0) {
    date.setFullYear(y);
  }
  return date;
}
function isValidDate(date) {
  return date instanceof Date && !isNaN(date);
}
function isValidRangeDate(date) {
  return Array.isArray(date) && date.length === 2 && date.every(isValidDate) && date[0] <= date[1];
}
function isValidDates(dates2) {
  return Array.isArray(dates2) && dates2.every(isValidDate);
}
function getValidDate(value3) {
  var date = new Date(value3);
  if (isValidDate(date)) {
    return date;
  }
  for (var _len = arguments.length, backup = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    backup[_key - 1] = arguments[_key];
  }
  if (backup.length) {
    return getValidDate.apply(void 0, backup);
  }
  return /* @__PURE__ */ new Date();
}
function startOfYear(value3) {
  var date = new Date(value3);
  date.setMonth(0, 1);
  date.setHours(0, 0, 0, 0);
  return date;
}
function startOfMonth(value3) {
  var date = new Date(value3);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}
function startOfDay(value3) {
  var date = new Date(value3);
  date.setHours(0, 0, 0, 0);
  return date;
}
function getCalendar(_ref) {
  var firstDayOfWeek2 = _ref.firstDayOfWeek, year = _ref.year, month = _ref.month;
  var arr = [];
  var calendar = createDate(year, month, 0);
  var lastDayInLastMonth = calendar.getDate();
  var firstDayInLastMonth = lastDayInLastMonth - (calendar.getDay() + 7 - firstDayOfWeek2) % 7;
  for (var i = firstDayInLastMonth; i <= lastDayInLastMonth; i++) {
    arr.push(createDate(year, month, i - lastDayInLastMonth));
  }
  calendar.setMonth(month + 1, 0);
  var lastDayInCurrentMonth = calendar.getDate();
  for (var _i = 1; _i <= lastDayInCurrentMonth; _i++) {
    arr.push(createDate(year, month, _i));
  }
  var lastMonthLength = lastDayInLastMonth - firstDayInLastMonth + 1;
  var nextMonthLength = 6 * 7 - lastMonthLength - lastDayInCurrentMonth;
  for (var _i2 = 1; _i2 <= nextMonthLength; _i2++) {
    arr.push(createDate(year, month, lastDayInCurrentMonth + _i2));
  }
  return arr;
}
function setMonth(dirtyDate, dirtyMonth) {
  var date = new Date(dirtyDate);
  var month = typeof dirtyMonth === "function" ? dirtyMonth(date.getMonth()) : Number(dirtyMonth);
  var year = date.getFullYear();
  var daysInMonth = createDate(year, month + 1, 0).getDate();
  var day = date.getDate();
  date.setMonth(month, Math.min(day, daysInMonth));
  return date;
}
function setYear(dirtyDate, dirtyYear) {
  var date = new Date(dirtyDate);
  var year = typeof dirtyYear === "function" ? dirtyYear(date.getFullYear()) : dirtyYear;
  date.setFullYear(year);
  return date;
}
function assignTime(target, source) {
  var date = new Date(target);
  var time = new Date(source);
  date.setHours(time.getHours(), time.getMinutes(), time.getSeconds());
  return date;
}
function chunk(arr, size) {
  if (!Array.isArray(arr)) {
    return [];
  }
  var result = [];
  var len = arr.length;
  var i = 0;
  size = size || len;
  while (i < len) {
    result.push(arr.slice(i, i += size));
  }
  return result;
}
function isObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}
function pick(obj, props) {
  if (!isObject(obj)) return {};
  if (!Array.isArray(props)) {
    props = [props];
  }
  var res = {};
  props.forEach(function(prop) {
    if (prop in obj) {
      res[prop] = obj[prop];
    }
  });
  return res;
}
function mergeDeep(target, source) {
  if (!isObject(target)) {
    return {};
  }
  var result = target;
  if (isObject(source)) {
    Object.keys(source).forEach(function(key) {
      var value3 = source[key];
      if (isObject(value3) && isObject(target[key])) {
        value3 = mergeDeep(target[key], value3);
      }
      result = _objectSpread2({}, result, _defineProperty({}, key, value3));
    });
  }
  return result;
}
function unwrapExports(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
function createCommonjsModule(fn, module) {
  return module = { exports: {} }, fn(module, module.exports), module.exports;
}
var en = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = void 0;
  var locale3 = {
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    weekdaysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    firstDayOfWeek: 0,
    firstWeekContainsDate: 1
  };
  var _default30 = locale3;
  exports["default"] = _default30;
  module.exports = exports.default;
});
var en$1 = unwrapExports(en);
var lang = {
  formatLocale: en$1,
  yearFormat: "YYYY",
  monthFormat: "MMM",
  monthBeforeYear: true
};
var defaultLocale = "en";
var locales = {};
locales[defaultLocale] = lang;
function locale(name, object, isLocal) {
  if (typeof name !== "string") return locales[defaultLocale];
  var l = defaultLocale;
  if (locales[name]) {
    l = name;
  }
  if (object) {
    locales[name] = object;
    l = name;
  }
  if (!isLocal) {
    defaultLocale = l;
  }
  return locales[name] || locales[defaultLocale];
}
function getLocale(name) {
  return locale(name, null, true);
}
function rafThrottle(fn) {
  var isRunning = false;
  return function fnBinfRaf() {
    var _this = this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    if (isRunning) return;
    isRunning = true;
    requestAnimationFrame(function() {
      isRunning = false;
      fn.apply(_this, args);
    });
  };
}
function getPopupElementSize(element) {
  var originalDisplay = element.style.display;
  var originalVisibility = element.style.visibility;
  element.style.display = "block";
  element.style.visibility = "hidden";
  var styles = window.getComputedStyle(element);
  var width = element.offsetWidth + parseInt(styles.marginLeft, 10) + parseInt(styles.marginRight, 10);
  var height = element.offsetHeight + parseInt(styles.marginTop, 10) + parseInt(styles.marginBottom, 10);
  element.style.display = originalDisplay;
  element.style.visibility = originalVisibility;
  return {
    width,
    height
  };
}
function getRelativePosition(el, targetWidth, targetHeight, fixed) {
  var left = 0;
  var top = 0;
  var offsetX = 0;
  var offsetY = 0;
  var relativeRect = el.getBoundingClientRect();
  var dw = document.documentElement.clientWidth;
  var dh = document.documentElement.clientHeight;
  if (fixed) {
    offsetX = window.pageXOffset + relativeRect.left;
    offsetY = window.pageYOffset + relativeRect.top;
  }
  if (dw - relativeRect.left < targetWidth && relativeRect.right < targetWidth) {
    left = offsetX - relativeRect.left + 1;
  } else if (relativeRect.left + relativeRect.width / 2 <= dw / 2) {
    left = offsetX;
  } else {
    left = offsetX + relativeRect.width - targetWidth;
  }
  if (relativeRect.top <= targetHeight && dh - relativeRect.bottom <= targetHeight) {
    top = offsetY + dh - relativeRect.top - targetHeight;
  } else if (relativeRect.top + relativeRect.height / 2 <= dh / 2) {
    top = offsetY + relativeRect.height;
  } else {
    top = offsetY - targetHeight;
  }
  return {
    left: "".concat(left, "px"),
    top: "".concat(top, "px")
  };
}
function getScrollParent(node) {
  var until = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : document.body;
  if (!node || node === until) {
    return null;
  }
  var style = function style2(value3, prop) {
    return getComputedStyle(value3, null).getPropertyValue(prop);
  };
  var regex = /(auto|scroll)/;
  var scroll = regex.test(style(node, "overflow") + style(node, "overflow-y") + style(node, "overflow-x"));
  return scroll ? node : getScrollParent(node.parentNode, until);
}
var script = {
  name: "Popup",
  inject: {
    prefixClass: {
      default: "mx"
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: true
    }
  },
  data: function data() {
    return {
      top: "",
      left: ""
    };
  },
  watch: {
    visible: {
      immediate: true,
      handler: function handler(val) {
        var _this = this;
        this.$nextTick(function() {
          if (val) {
            _this.displayPopup();
          }
        });
      }
    }
  },
  mounted: function mounted() {
    var _this2 = this;
    if (this.appendToBody) {
      document.body.appendChild(this.$el);
    }
    this._clickoutEvent = "ontouchend" in document ? "touchstart" : "mousedown";
    document.addEventListener(this._clickoutEvent, this.handleClickOutside);
    var relativeElement = this.$parent.$el;
    this._displayPopup = rafThrottle(function() {
      return _this2.displayPopup();
    });
    this._scrollParent = getScrollParent(relativeElement) || window;
    this._scrollParent.addEventListener("scroll", this._displayPopup);
    window.addEventListener("resize", this._displayPopup);
  },
  beforeDestroy: function beforeDestroy() {
    if (this.appendToBody && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
    document.removeEventListener(this._clickoutEvent, this.handleClickOutside);
    this._scrollParent.removeEventListener("scroll", this._displayPopup);
    window.removeEventListener("resize", this._displayPopup);
  },
  methods: {
    handleClickOutside: function handleClickOutside(evt) {
      if (!this.visible) return;
      var target = evt.target;
      var el = this.$el;
      if (el && !el.contains(target)) {
        this.$emit("clickoutside", evt);
      }
    },
    displayPopup: function displayPopup() {
      if (!this.visible) return;
      var popup = this.$el;
      var relativeElement = this.$parent.$el;
      var appendToBody = this.appendToBody;
      if (!this._popupRect) {
        this._popupRect = getPopupElementSize(popup);
      }
      var _this$_popupRect = this._popupRect, width = _this$_popupRect.width, height = _this$_popupRect.height;
      var _getRelativePosition = getRelativePosition(relativeElement, width, height, appendToBody), left = _getRelativePosition.left, top = _getRelativePosition.top;
      this.left = left;
      this.top = top;
    }
  }
};
function normalizeComponent(template, style, script2, scopeId, isFunctionalTemplate, moduleIdentifier, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  var options = typeof script2 === "function" ? script2.options : script2;
  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true;
  }
  return script2;
}
var __vue_script__ = script;
var __vue_render__ = function __vue_render__2() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("transition", {
    attrs: {
      "name": _vm.prefixClass + "-zoom-in-down"
    }
  }, [_vm.visible ? _c("div", {
    class: _vm.prefixClass + "-datepicker-main " + _vm.prefixClass + "-datepicker-popup",
    style: {
      top: _vm.top,
      left: _vm.left,
      position: "absolute"
    }
  }, [_vm._t("default")], 2) : _vm._e()]);
};
var __vue_staticRenderFns__ = [];
var __vue_inject_styles__ = void 0;
var __vue_component__ = normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__);
var __vue_render__$1 = function __vue_render__3() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("svg", {
    attrs: {
      "xmlns": "http://www.w3.org/2000/svg",
      "viewBox": "0 0 1024 1024",
      "width": "1em",
      "height": "1em"
    }
  }, [_c("path", {
    attrs: {
      "d": "M940.218182 107.054545h-209.454546V46.545455h-65.163636v60.50909H363.054545V46.545455H297.890909v60.50909H83.781818c-18.618182 0-32.581818 13.963636-32.581818 32.581819v805.236363c0 18.618182 13.963636 32.581818 32.581818 32.581818h861.090909c18.618182 0 32.581818-13.963636 32.581818-32.581818V139.636364c-4.654545-18.618182-18.618182-32.581818-37.236363-32.581819zM297.890909 172.218182V232.727273h65.163636V172.218182h307.2V232.727273h65.163637V172.218182h176.872727v204.8H116.363636V172.218182h181.527273zM116.363636 912.290909V442.181818h795.927273v470.109091H116.363636z"
    }
  })]);
};
var __vue_staticRenderFns__$1 = [];
var __vue_inject_styles__$1 = void 0;
var __vue_component__$1 = normalizeComponent({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, {});
var __vue_render__$2 = function __vue_render__4() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("svg", {
    attrs: {
      "xmlns": "http://www.w3.org/2000/svg",
      "viewBox": "0 0 24 24",
      "width": "1em",
      "height": "1em"
    }
  }, [_c("path", {
    attrs: {
      "d": "M0 0h24v24H0z",
      "fill": "none"
    }
  }), _vm._v(" "), _c("path", {
    attrs: {
      "d": "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
    }
  }), _vm._v(" "), _c("path", {
    attrs: {
      "d": "M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"
    }
  })]);
};
var __vue_staticRenderFns__$2 = [];
var __vue_inject_styles__$2 = void 0;
var __vue_component__$2 = normalizeComponent({
  render: __vue_render__$2,
  staticRenderFns: __vue_staticRenderFns__$2
}, __vue_inject_styles__$2, {});
var __vue_render__$3 = function __vue_render__5() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("svg", {
    attrs: {
      "xmlns": "http://www.w3.org/2000/svg",
      "viewBox": "0 0 1024 1024",
      "width": "1em",
      "height": "1em"
    }
  }, [_c("path", {
    attrs: {
      "d": "M810.005333 274.005333l-237.994667 237.994667 237.994667 237.994667-60.010667 60.010667-237.994667-237.994667-237.994667 237.994667-60.010667-60.010667 237.994667-237.994667-237.994667-237.994667 60.010667-60.010667 237.994667 237.994667 237.994667-237.994667z"
    }
  })]);
};
var __vue_staticRenderFns__$3 = [];
var __vue_inject_styles__$3 = void 0;
var __vue_component__$3 = normalizeComponent({
  render: __vue_render__$3,
  staticRenderFns: __vue_staticRenderFns__$3
}, __vue_inject_styles__$3, {});
var script$1 = {
  props: {
    type: String,
    disabled: Boolean
  },
  inject: {
    prefixClass: {
      default: "mx"
    }
  }
};
var __vue_script__$1 = script$1;
var __vue_render__$4 = function __vue_render__6() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("button", _vm._g({
    class: [_vm.prefixClass + "-btn " + _vm.prefixClass + "-btn-text " + _vm.prefixClass + "-btn-icon-" + _vm.type, {
      disabled: _vm.disabled
    }],
    attrs: {
      "type": "button",
      "disabled": _vm.disabled
    }
  }, _vm.$listeners), [_c("i", {
    class: _vm.prefixClass + "-icon-" + _vm.type
  })]);
};
var __vue_staticRenderFns__$4 = [];
var __vue_inject_styles__$4 = void 0;
var __vue_component__$4 = normalizeComponent({
  render: __vue_render__$4,
  staticRenderFns: __vue_staticRenderFns__$4
}, __vue_inject_styles__$4, __vue_script__$1);
var script$2 = {
  name: "TableDate",
  components: {
    IconButton: __vue_component__$4
  },
  inject: {
    getLocale: {
      default: function _default() {
        return getLocale;
      }
    },
    getWeek: {
      default: function _default2() {
        return getWeek;
      }
    },
    prefixClass: {
      default: "mx"
    },
    onDateMouseEnter: {
      default: void 0
    },
    onDateMouseLeave: {
      default: void 0
    }
  },
  props: {
    disabledCalendarChanger: {
      type: Function,
      default: function _default3() {
        return false;
      }
    },
    calendar: {
      type: Date,
      default: function _default4() {
        return /* @__PURE__ */ new Date();
      }
    },
    showWeekNumber: {
      type: Boolean,
      default: false
    },
    titleFormat: {
      type: String,
      default: "YYYY-MM-DD"
    },
    getRowClasses: {
      type: Function,
      default: function _default5() {
        return [];
      }
    },
    getCellClasses: {
      type: Function,
      default: function _default6() {
        return [];
      }
    }
  },
  computed: {
    firstDayOfWeek: function firstDayOfWeek() {
      return this.getLocale().formatLocale.firstDayOfWeek || 0;
    },
    yearMonth: function yearMonth() {
      var _this$getLocale = this.getLocale(), yearFormat = _this$getLocale.yearFormat, monthBeforeYear = _this$getLocale.monthBeforeYear, _this$getLocale$month = _this$getLocale.monthFormat, monthFormat = _this$getLocale$month === void 0 ? "MMM" : _this$getLocale$month;
      var yearLabel = {
        panel: "year",
        label: this.formatDate(this.calendar, yearFormat)
      };
      var monthLabel = {
        panel: "month",
        label: this.formatDate(this.calendar, monthFormat)
      };
      return monthBeforeYear ? [monthLabel, yearLabel] : [yearLabel, monthLabel];
    },
    days: function days() {
      var locale3 = this.getLocale();
      var days2 = locale3.days || locale3.formatLocale.weekdaysMin;
      return days2.concat(days2).slice(this.firstDayOfWeek, this.firstDayOfWeek + 7);
    },
    dates: function dates() {
      var year = this.calendar.getFullYear();
      var month = this.calendar.getMonth();
      var arr = getCalendar({
        firstDayOfWeek: this.firstDayOfWeek,
        year,
        month
      });
      return chunk(arr, 7);
    }
  },
  methods: {
    isDisabledArrows: function isDisabledArrows(type) {
      var date = new Date(this.calendar);
      switch (type) {
        case "last-year":
          date.setFullYear(date.getFullYear() - 1, date.getMonth() + 1, 0);
          date.setHours(23, 59, 59, 999);
          break;
        case "next-year":
          date.setFullYear(date.getFullYear() + 1);
          break;
        case "last-month":
          date.setMonth(date.getMonth(), 0);
          date.setHours(23, 59, 59, 999);
          break;
        case "next-month":
          date.setMonth(date.getMonth() + 1);
          break;
      }
      return this.disabledCalendarChanger(date, type);
    },
    handleIconLeftClick: function handleIconLeftClick() {
      this.$emit("changecalendar", setMonth(this.calendar, function(v) {
        return v - 1;
      }), "last-month");
    },
    handleIconRightClick: function handleIconRightClick() {
      this.$emit("changecalendar", setMonth(this.calendar, function(v) {
        return v + 1;
      }), "next-month");
    },
    handleIconDoubleLeftClick: function handleIconDoubleLeftClick() {
      this.$emit("changecalendar", setYear(this.calendar, function(v) {
        return v - 1;
      }), "last-year");
    },
    handleIconDoubleRightClick: function handleIconDoubleRightClick() {
      this.$emit("changecalendar", setYear(this.calendar, function(v) {
        return v + 1;
      }), "next-year");
    },
    handlePanelChange: function handlePanelChange(panel) {
      this.$emit("changepanel", panel);
    },
    handleMouseEnter: function handleMouseEnter(cell) {
      if (typeof this.onDateMouseEnter === "function") {
        this.onDateMouseEnter(cell);
      }
    },
    handleMouseLeave: function handleMouseLeave(cell) {
      if (typeof this.onDateMouseLeave === "function") {
        this.onDateMouseLeave(cell);
      }
    },
    handleCellClick: function handleCellClick(evt) {
      var target = evt.target;
      if (target.tagName.toUpperCase() === "DIV") {
        target = target.parentNode;
      }
      var index = target.getAttribute("data-row-col");
      if (index) {
        var _index$split$map = index.split(",").map(function(v) {
          return parseInt(v, 10);
        }), _index$split$map2 = _slicedToArray(_index$split$map, 2), row = _index$split$map2[0], col = _index$split$map2[1];
        var date = this.dates[row][col];
        this.$emit("select", new Date(date));
      }
    },
    formatDate: function formatDate(date, fmt) {
      return format(date, fmt, {
        locale: this.getLocale().formatLocale
      });
    },
    getCellTitle: function getCellTitle(date) {
      var fmt = this.titleFormat;
      return this.formatDate(date, fmt);
    },
    getWeekNumber: function getWeekNumber(date) {
      return this.getWeek(date, this.getLocale().formatLocale);
    }
  }
};
var __vue_script__$2 = script$2;
var __vue_render__$5 = function __vue_render__7() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", {
    class: _vm.prefixClass + "-calendar " + _vm.prefixClass + "-calendar-panel-date"
  }, [_c("div", {
    class: _vm.prefixClass + "-calendar-header"
  }, [_c("icon-button", {
    attrs: {
      "type": "double-left",
      "disabled": _vm.isDisabledArrows("last-year")
    },
    on: {
      "click": _vm.handleIconDoubleLeftClick
    }
  }), _vm._v(" "), _c("icon-button", {
    attrs: {
      "type": "left",
      "disabled": _vm.isDisabledArrows("last-month")
    },
    on: {
      "click": _vm.handleIconLeftClick
    }
  }), _vm._v(" "), _c("icon-button", {
    attrs: {
      "type": "double-right",
      "disabled": _vm.isDisabledArrows("next-year")
    },
    on: {
      "click": _vm.handleIconDoubleRightClick
    }
  }), _vm._v(" "), _c("icon-button", {
    attrs: {
      "type": "right",
      "disabled": _vm.isDisabledArrows("next-month")
    },
    on: {
      "click": _vm.handleIconRightClick
    }
  }), _vm._v(" "), _c("span", {
    class: _vm.prefixClass + "-calendar-header-label"
  }, _vm._l(_vm.yearMonth, function(item) {
    return _c("button", {
      key: item.panel,
      class: _vm.prefixClass + "-btn " + _vm.prefixClass + "-btn-text " + _vm.prefixClass + "-btn-current-" + item.panel,
      attrs: {
        "type": "button"
      },
      on: {
        "click": function click($event) {
          return _vm.handlePanelChange(item.panel);
        }
      }
    }, [_vm._v("\n        " + _vm._s(item.label) + "\n      ")]);
  }), 0)], 1), _vm._v(" "), _c("div", {
    class: _vm.prefixClass + "-calendar-content"
  }, [_c("table", {
    class: _vm.prefixClass + "-table " + _vm.prefixClass + "-table-date"
  }, [_c("thead", [_c("tr", [_vm.showWeekNumber ? _c("th", {
    class: _vm.prefixClass + "-week-number-header"
  }) : _vm._e(), _vm._v(" "), _vm._l(_vm.days, function(day) {
    return _c("th", {
      key: day
    }, [_vm._v(_vm._s(day))]);
  })], 2)]), _vm._v(" "), _c("tbody", {
    on: {
      "click": _vm.handleCellClick
    }
  }, _vm._l(_vm.dates, function(row, i) {
    return _c("tr", {
      key: i,
      class: [_vm.prefixClass + "-date-row", _vm.getRowClasses(row)]
    }, [_vm.showWeekNumber ? _c("td", {
      class: _vm.prefixClass + "-week-number",
      attrs: {
        "data-row-col": i + ",0"
      }
    }, [_vm._v("\n            " + _vm._s(_vm.getWeekNumber(row[0])) + "\n          ")]) : _vm._e(), _vm._v(" "), _vm._l(row, function(cell, j) {
      return _c("td", {
        key: j,
        staticClass: "cell",
        class: _vm.getCellClasses(cell),
        attrs: {
          "data-row-col": i + "," + j,
          "title": _vm.getCellTitle(cell)
        },
        on: {
          "mouseenter": function mouseenter($event) {
            return _vm.handleMouseEnter(cell);
          },
          "mouseleave": function mouseleave($event) {
            return _vm.handleMouseLeave(cell);
          }
        }
      }, [_c("div", [_vm._v(_vm._s(cell.getDate()))])]);
    })], 2);
  }), 0)])])]);
};
var __vue_staticRenderFns__$5 = [];
var __vue_inject_styles__$5 = void 0;
var __vue_component__$5 = normalizeComponent({
  render: __vue_render__$5,
  staticRenderFns: __vue_staticRenderFns__$5
}, __vue_inject_styles__$5, __vue_script__$2);
var script$3 = {
  name: "TableMonth",
  components: {
    IconButton: __vue_component__$4
  },
  inject: {
    getLocale: {
      default: function _default7() {
        return getLocale;
      }
    },
    prefixClass: {
      default: "mx"
    }
  },
  props: {
    disabledCalendarChanger: {
      type: Function,
      default: function _default8() {
        return false;
      }
    },
    calendar: {
      type: Date,
      default: function _default9() {
        return /* @__PURE__ */ new Date();
      }
    },
    getCellClasses: {
      type: Function,
      default: function _default10() {
        return [];
      }
    }
  },
  computed: {
    calendarYear: function calendarYear() {
      return this.calendar.getFullYear();
    },
    months: function months() {
      var locale3 = this.getLocale();
      var monthsLocale = locale3.months || locale3.formatLocale.monthsShort;
      var months2 = monthsLocale.map(function(text2, month) {
        return {
          text: text2,
          month
        };
      });
      return chunk(months2, 3);
    }
  },
  methods: {
    isDisabledArrows: function isDisabledArrows2(type) {
      var date = new Date(this.calendar);
      switch (type) {
        case "last-year":
          date.setFullYear(date.getFullYear() - 1, 11, 31);
          date.setHours(23, 59, 59, 999);
          break;
        case "next-year":
          date.setFullYear(date.getFullYear() + 1, 0, 1);
          break;
      }
      return this.disabledCalendarChanger(date, type);
    },
    handleIconDoubleLeftClick: function handleIconDoubleLeftClick2() {
      this.$emit("changecalendar", setYear(this.calendar, function(v) {
        return v - 1;
      }), "last-year");
    },
    handleIconDoubleRightClick: function handleIconDoubleRightClick2() {
      this.$emit("changecalendar", setYear(this.calendar, function(v) {
        return v + 1;
      }), "next-year");
    },
    handlePanelChange: function handlePanelChange2() {
      this.$emit("changepanel", "year");
    },
    handleClick: function handleClick(evt) {
      var target = evt.target;
      if (target.tagName.toUpperCase() === "DIV") {
        target = target.parentNode;
      }
      var month = target.getAttribute("data-month");
      if (month && !target.classList.contains("disabled")) {
        this.$emit("select", parseInt(month, 10));
      }
    }
  }
};
var __vue_script__$3 = script$3;
var __vue_render__$6 = function __vue_render__8() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", {
    class: _vm.prefixClass + "-calendar " + _vm.prefixClass + "-calendar-panel-month"
  }, [_c("div", {
    class: _vm.prefixClass + "-calendar-header"
  }, [_c("icon-button", {
    attrs: {
      "type": "double-left",
      "disabled": _vm.isDisabledArrows("last-year")
    },
    on: {
      "click": _vm.handleIconDoubleLeftClick
    }
  }), _vm._v(" "), _c("icon-button", {
    attrs: {
      "type": "double-right",
      "disabled": _vm.isDisabledArrows("next-year")
    },
    on: {
      "click": _vm.handleIconDoubleRightClick
    }
  }), _vm._v(" "), _c("span", {
    class: _vm.prefixClass + "-calendar-header-label"
  }, [_c("button", {
    class: _vm.prefixClass + "-btn " + _vm.prefixClass + "-btn-text",
    attrs: {
      "type": "button"
    },
    on: {
      "click": _vm.handlePanelChange
    }
  }, [_vm._v("\n        " + _vm._s(_vm.calendarYear) + "\n      ")])])], 1), _vm._v(" "), _c("div", {
    class: _vm.prefixClass + "-calendar-content"
  }, [_c("table", {
    class: _vm.prefixClass + "-table " + _vm.prefixClass + "-table-month",
    on: {
      "click": _vm.handleClick
    }
  }, _vm._l(_vm.months, function(row, i) {
    return _c("tr", {
      key: i
    }, _vm._l(row, function(cell, j) {
      return _c("td", {
        key: j,
        staticClass: "cell",
        class: _vm.getCellClasses(cell.month),
        attrs: {
          "data-month": cell.month
        }
      }, [_c("div", [_vm._v(_vm._s(cell.text))])]);
    }), 0);
  }), 0)])]);
};
var __vue_staticRenderFns__$6 = [];
var __vue_inject_styles__$6 = void 0;
var __vue_component__$6 = normalizeComponent({
  render: __vue_render__$6,
  staticRenderFns: __vue_staticRenderFns__$6
}, __vue_inject_styles__$6, __vue_script__$3);
var script$4 = {
  name: "TableYear",
  components: {
    IconButton: __vue_component__$4
  },
  inject: {
    prefixClass: {
      default: "mx"
    }
  },
  props: {
    disabledCalendarChanger: {
      type: Function,
      default: function _default11() {
        return false;
      }
    },
    calendar: {
      type: Date,
      default: function _default12() {
        return /* @__PURE__ */ new Date();
      }
    },
    getCellClasses: {
      type: Function,
      default: function _default13() {
        return [];
      }
    },
    getYearPanel: {
      type: Function
    }
  },
  computed: {
    years: function years() {
      var calendar = new Date(this.calendar);
      if (typeof this.getYearPanel === "function") {
        return this.getYearPanel(calendar);
      }
      return this.getYears(calendar);
    },
    firstYear: function firstYear() {
      return this.years[0][0];
    },
    lastYear: function lastYear() {
      var last = function last2(arr) {
        return arr[arr.length - 1];
      };
      return last(last(this.years));
    }
  },
  methods: {
    isDisabledArrows: function isDisabledArrows3(type) {
      var date = new Date(this.calendar);
      switch (type) {
        case "last-decade":
          date.setFullYear(this.firstYear - 1, 11, 31);
          date.setHours(23, 59, 59, 999);
          break;
        case "next-decade":
          date.setFullYear(this.lastYear + 1, 0, 1);
          break;
      }
      return this.disabledCalendarChanger(date, type);
    },
    getYears: function getYears(calendar) {
      var firstYear2 = Math.floor(calendar.getFullYear() / 10) * 10;
      var years2 = [];
      for (var i = 0; i < 10; i++) {
        years2.push(firstYear2 + i);
      }
      return chunk(years2, 2);
    },
    handleIconDoubleLeftClick: function handleIconDoubleLeftClick3() {
      this.$emit("changecalendar", setYear(this.calendar, function(v) {
        return v - 10;
      }), "last-decade");
    },
    handleIconDoubleRightClick: function handleIconDoubleRightClick3() {
      this.$emit("changecalendar", setYear(this.calendar, function(v) {
        return v + 10;
      }), "next-decade");
    },
    handleClick: function handleClick2(evt) {
      var target = evt.target;
      if (target.tagName.toUpperCase() === "DIV") {
        target = target.parentNode;
      }
      var year = target.getAttribute("data-year");
      if (year && !target.classList.contains("disabled")) {
        this.$emit("select", parseInt(year, 10));
      }
    }
  }
};
var __vue_script__$4 = script$4;
var __vue_render__$7 = function __vue_render__9() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", {
    class: _vm.prefixClass + "-calendar " + _vm.prefixClass + "-calendar-panel-year"
  }, [_c("div", {
    class: _vm.prefixClass + "-calendar-header"
  }, [_c("icon-button", {
    attrs: {
      "type": "double-left",
      "disabled": _vm.isDisabledArrows("last-decade")
    },
    on: {
      "click": _vm.handleIconDoubleLeftClick
    }
  }), _vm._v(" "), _c("icon-button", {
    attrs: {
      "type": "double-right",
      "disabled": _vm.isDisabledArrows("next-decade")
    },
    on: {
      "click": _vm.handleIconDoubleRightClick
    }
  }), _vm._v(" "), _c("span", {
    class: _vm.prefixClass + "-calendar-header-label"
  }, [_c("span", [_vm._v(_vm._s(_vm.firstYear))]), _vm._v(" "), _c("span", {
    class: _vm.prefixClass + "-calendar-decade-separator"
  }), _vm._v(" "), _c("span", [_vm._v(_vm._s(_vm.lastYear))])])], 1), _vm._v(" "), _c("div", {
    class: _vm.prefixClass + "-calendar-content"
  }, [_c("table", {
    class: _vm.prefixClass + "-table " + _vm.prefixClass + "-table-year",
    on: {
      "click": _vm.handleClick
    }
  }, _vm._l(_vm.years, function(row, i) {
    return _c("tr", {
      key: i
    }, _vm._l(row, function(cell, j) {
      return _c("td", {
        key: j,
        staticClass: "cell",
        class: _vm.getCellClasses(cell),
        attrs: {
          "data-year": cell
        }
      }, [_c("div", [_vm._v(_vm._s(cell))])]);
    }), 0);
  }), 0)])]);
};
var __vue_staticRenderFns__$7 = [];
var __vue_inject_styles__$7 = void 0;
var __vue_component__$7 = normalizeComponent({
  render: __vue_render__$7,
  staticRenderFns: __vue_staticRenderFns__$7
}, __vue_inject_styles__$7, __vue_script__$4);
var CalendarPanel = {
  name: "CalendarPanel",
  inject: {
    prefixClass: {
      default: "mx"
    },
    dispatchDatePicker: {
      default: function _default14() {
        return function() {
        };
      }
    }
  },
  props: {
    value: {},
    defaultValue: {
      default: function _default15() {
        var date = /* @__PURE__ */ new Date();
        date.setHours(0, 0, 0, 0);
        return date;
      }
    },
    defaultPanel: {
      type: String
    },
    disabledCalendarChanger: {
      type: Function,
      default: function _default16() {
        return false;
      }
    },
    disabledDate: {
      type: Function,
      default: function _default17() {
        return false;
      }
    },
    type: {
      type: String,
      default: "date"
    },
    getClasses: {
      type: Function,
      default: function _default18() {
        return [];
      }
    },
    showWeekNumber: {
      type: Boolean,
      default: void 0
    },
    getYearPanel: {
      type: Function
    },
    titleFormat: {
      type: String,
      default: "YYYY-MM-DD"
    },
    calendar: Date,
    // update date when select year or month
    partialUpdate: {
      type: Boolean,
      default: false
    }
  },
  data: function data2() {
    var panels = ["date", "month", "year"];
    var index = Math.max(panels.indexOf(this.type), panels.indexOf(this.defaultPanel));
    var panel = index !== -1 ? panels[index] : "date";
    return {
      panel,
      innerCalendar: /* @__PURE__ */ new Date()
    };
  },
  computed: {
    innerValue: function innerValue() {
      var value3 = Array.isArray(this.value) ? this.value : [this.value];
      var map = {
        year: startOfYear,
        month: startOfMonth,
        date: startOfDay
      };
      var start = map[this.type] || map.date;
      return value3.filter(isValidDate).map(function(v) {
        return start(v);
      });
    },
    calendarYear: function calendarYear2() {
      return this.innerCalendar.getFullYear();
    },
    calendarMonth: function calendarMonth() {
      return this.innerCalendar.getMonth();
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: "initCalendar"
    },
    calendar: {
      handler: "initCalendar"
    },
    defaultValue: {
      handler: "initCalendar"
    }
  },
  methods: {
    initCalendar: function initCalendar() {
      var calendarDate = this.calendar;
      if (!isValidDate(calendarDate)) {
        var length = this.innerValue.length;
        calendarDate = getValidDate(length > 0 ? this.innerValue[length - 1] : this.defaultValue);
      }
      this.innerCalendar = startOfMonth(calendarDate);
    },
    isDisabled: function isDisabled(date) {
      return this.disabledDate(new Date(date), this.innerValue);
    },
    emitDate: function emitDate(date, type) {
      if (!this.isDisabled(date)) {
        this.$emit("select", date, type, this.innerValue);
        this.dispatchDatePicker("pick", date, type);
      }
    },
    handleCalendarChange: function handleCalendarChange(calendar, type) {
      var oldCalendar = new Date(this.innerCalendar);
      this.innerCalendar = calendar;
      this.$emit("update:calendar", calendar);
      this.dispatchDatePicker("calendar-change", calendar, oldCalendar, type);
    },
    handelPanelChange: function handelPanelChange(panel) {
      var oldPanel = this.panel;
      this.panel = panel;
      this.dispatchDatePicker("panel-change", panel, oldPanel);
    },
    handleSelectYear: function handleSelectYear(year) {
      if (this.type === "year") {
        var date = this.getYearCellDate(year);
        this.emitDate(date, "year");
      } else {
        this.handleCalendarChange(createDate(year, this.calendarMonth), "year");
        this.handelPanelChange("month");
        if (this.partialUpdate && this.innerValue.length === 1) {
          var _date = new Date(this.innerValue[0]);
          _date.setFullYear(year);
          this.emitDate(_date, "year");
        }
      }
    },
    handleSelectMonth: function handleSelectMonth(month) {
      if (this.type === "month") {
        var date = this.getMonthCellDate(month);
        this.emitDate(date, "month");
      } else {
        this.handleCalendarChange(createDate(this.calendarYear, month), "month");
        this.handelPanelChange("date");
        if (this.partialUpdate && this.innerValue.length === 1) {
          var _date2 = new Date(this.innerValue[0]);
          _date2.setFullYear(this.calendarYear);
          this.emitDate(setMonth(_date2, month), "month");
        }
      }
    },
    handleSelectDate: function handleSelectDate(date) {
      this.emitDate(date, this.type === "week" ? "week" : "date");
    },
    getMonthCellDate: function getMonthCellDate(month) {
      return createDate(this.calendarYear, month);
    },
    getYearCellDate: function getYearCellDate(year) {
      return createDate(year, 0);
    },
    getDateClasses: function getDateClasses(cellDate) {
      var notCurrentMonth = cellDate.getMonth() !== this.calendarMonth;
      var classes = [];
      if (cellDate.getTime() === (/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0)) {
        classes.push("today");
      }
      if (notCurrentMonth) {
        classes.push("not-current-month");
      }
      var state = this.getStateClass(cellDate);
      if (!(state === "active" && notCurrentMonth)) {
        classes.push(state);
      }
      return classes.concat(this.getClasses(cellDate, this.innerValue, classes.join(" ")));
    },
    getMonthClasses: function getMonthClasses(month) {
      var classes = [];
      if (this.type !== "month") {
        if (this.calendarMonth === month) {
          classes.push("active");
        }
        var _cellDate = this.getMonthCellDate(month);
        if (this.disabledCalendarChanger(_cellDate, "month")) {
          classes.push("disabled");
        }
        return classes;
      }
      var cellDate = this.getMonthCellDate(month);
      classes.push(this.getStateClass(cellDate));
      return classes.concat(this.getClasses(cellDate, this.innerValue, classes.join(" ")));
    },
    getYearClasses: function getYearClasses(year) {
      var classes = [];
      if (this.type !== "year") {
        if (this.calendarYear === year) {
          classes.push("active");
        }
        var _cellDate2 = this.getYearCellDate(year);
        if (this.disabledCalendarChanger(_cellDate2, "year")) {
          classes.push("disabled");
        }
        return classes;
      }
      var cellDate = this.getYearCellDate(year);
      classes.push(this.getStateClass(cellDate));
      return classes.concat(this.getClasses(cellDate, this.innerValue, classes.join(" ")));
    },
    getStateClass: function getStateClass(cellDate) {
      if (this.isDisabled(cellDate)) {
        return "disabled";
      }
      if (this.innerValue.some(function(v) {
        return v.getTime() === cellDate.getTime();
      })) {
        return "active";
      }
      return "";
    },
    getWeekState: function getWeekState(row) {
      if (this.type !== "week") return "";
      var start = row[0].getTime();
      var end = row[6].getTime();
      var active = this.innerValue.some(function(v) {
        var time = v.getTime();
        return time >= start && time <= end;
      });
      return active ? "".concat(this.prefixClass, "-active-week") : "";
    }
  },
  render: function render2() {
    var h2 = arguments[0];
    var panel = this.panel, innerCalendar = this.innerCalendar;
    if (panel === "year") {
      return h2(__vue_component__$7, {
        "attrs": {
          "disabledCalendarChanger": this.disabledCalendarChanger,
          "calendar": innerCalendar,
          "getCellClasses": this.getYearClasses,
          "getYearPanel": this.getYearPanel
        },
        "on": {
          "select": this.handleSelectYear,
          "changecalendar": this.handleCalendarChange
        }
      });
    }
    if (panel === "month") {
      return h2(__vue_component__$6, {
        "attrs": {
          "disabledCalendarChanger": this.disabledCalendarChanger,
          "calendar": innerCalendar,
          "getCellClasses": this.getMonthClasses
        },
        "on": {
          "select": this.handleSelectMonth,
          "changepanel": this.handelPanelChange,
          "changecalendar": this.handleCalendarChange
        }
      });
    }
    return h2(__vue_component__$5, {
      "attrs": {
        "disabledCalendarChanger": this.disabledCalendarChanger,
        "calendar": innerCalendar,
        "getCellClasses": this.getDateClasses,
        "getRowClasses": this.getWeekState,
        "titleFormat": this.titleFormat,
        "showWeekNumber": typeof this.showWeekNumber === "boolean" ? this.showWeekNumber : this.type === "week"
      },
      "class": _defineProperty({}, "".concat(this.prefixClass, "-calendar-week-mode"), this.type === "week"),
      "on": {
        "select": this.handleSelectDate,
        "changepanel": this.handelPanelChange,
        "changecalendar": this.handleCalendarChange
      }
    });
  }
};
var CalendarRange = {
  name: "CalendarRange",
  components: {
    CalendarPanel
  },
  provide: function provide() {
    return {
      onDateMouseEnter: this.onDateMouseEnter,
      onDateMouseLeave: this.onDateMouseLeave
    };
  },
  inject: {
    prefixClass: {
      default: "mx"
    }
  },
  props: _objectSpread2({}, CalendarPanel.props),
  data: function data3() {
    return {
      innerValue: [],
      calendars: [],
      hoveredValue: null
    };
  },
  computed: {
    // Minimum difference between start and end calendars
    calendarMinDiff: function calendarMinDiff() {
      var map = {
        date: 1,
        // type:date  min 1 month
        month: 1 * 12,
        // type:month min 1 year
        year: 10 * 12
        // type:year  min 10 year
      };
      return map[this.type] || map.date;
    },
    calendarMaxDiff: function calendarMaxDiff() {
      return Infinity;
    },
    defaultValues: function defaultValues() {
      return Array.isArray(this.defaultValue) ? this.defaultValue : [this.defaultValue, this.defaultValue];
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function handler2() {
        var _this = this;
        this.innerValue = isValidRangeDate(this.value) ? this.value : [/* @__PURE__ */ new Date(NaN), /* @__PURE__ */ new Date(NaN)];
        var calendars = this.innerValue.map(function(v, i) {
          return startOfMonth(getValidDate(v, _this.defaultValues[i]));
        });
        this.updateCalendars(calendars);
      }
    }
  },
  methods: {
    handleSelect: function handleSelect(date, type) {
      var _this$innerValue = _slicedToArray(this.innerValue, 2), startValue = _this$innerValue[0], endValue = _this$innerValue[1];
      if (isValidDate(startValue) && !isValidDate(endValue)) {
        if (startValue.getTime() > date.getTime()) {
          this.innerValue = [date, startValue];
        } else {
          this.innerValue = [startValue, date];
        }
        this.emitDate(this.innerValue, type);
      } else {
        this.innerValue = [date, /* @__PURE__ */ new Date(NaN)];
      }
    },
    onDateMouseEnter: function onDateMouseEnter(cell) {
      this.hoveredValue = cell;
    },
    onDateMouseLeave: function onDateMouseLeave() {
      this.hoveredValue = null;
    },
    emitDate: function emitDate2(dates2, type) {
      this.$emit("select", dates2, type);
    },
    updateStartCalendar: function updateStartCalendar(value3) {
      this.updateCalendars([value3, this.calendars[1]], 1);
    },
    updateEndCalendar: function updateEndCalendar(value3) {
      this.updateCalendars([this.calendars[0], value3], 0);
    },
    updateCalendars: function updateCalendars(calendars) {
      var adjustIndex = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
      var gap = this.getCalendarGap(calendars);
      if (gap) {
        var calendar = new Date(calendars[adjustIndex]);
        calendar.setMonth(calendar.getMonth() + (adjustIndex === 0 ? -gap : gap));
        calendars[adjustIndex] = calendar;
      }
      this.calendars = calendars;
    },
    getCalendarGap: function getCalendarGap(calendars) {
      var _calendars = _slicedToArray(calendars, 2), calendarLeft = _calendars[0], calendarRight = _calendars[1];
      var yearDiff = calendarRight.getFullYear() - calendarLeft.getFullYear();
      var monthDiff = calendarRight.getMonth() - calendarLeft.getMonth();
      var diff = yearDiff * 12 + monthDiff;
      var min = this.calendarMinDiff;
      var max = this.calendarMaxDiff;
      if (diff < min) {
        return min - diff;
      }
      if (diff > max) {
        return max - diff;
      }
      return 0;
    },
    getRangeClasses: function getRangeClasses(cellDate, currentDates, classnames) {
      var classes = [].concat(this.getClasses(cellDate, currentDates, classnames));
      if (/disabled|active/.test(classnames)) return classes;
      var inRange = function inRange2(data10, range) {
        var fn = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : function(v) {
          return v.getTime();
        };
        var value3 = fn(data10);
        var _range$map = range.map(fn), _range$map2 = _slicedToArray(_range$map, 2), min = _range$map2[0], max = _range$map2[1];
        if (min > max) {
          var _ref = [max, min];
          min = _ref[0];
          max = _ref[1];
        }
        return value3 > min && value3 < max;
      };
      if (currentDates.length === 2 && inRange(cellDate, currentDates)) {
        return classes.concat("in-range");
      }
      if (currentDates.length === 1 && this.hoveredValue && inRange(cellDate, [currentDates[0], this.hoveredValue])) {
        return classes.concat("hover-in-range");
      }
      return classes;
    }
  },
  render: function render3() {
    var _this2 = this;
    var h2 = arguments[0];
    var calendarRange = this.calendars.map(function(calendar, index) {
      var props = _objectSpread2({}, _this2.$props, {
        calendar,
        value: _this2.innerValue,
        defaultValue: _this2.defaultValues[index],
        getClasses: _this2.getRangeClasses,
        // don't update when range is true
        partialUpdate: false
      });
      var on = {
        select: _this2.handleSelect,
        "update:calendar": index === 0 ? _this2.updateStartCalendar : _this2.updateEndCalendar
      };
      return h2("calendar-panel", {
        "props": _objectSpread2({}, props),
        "on": _objectSpread2({}, on)
      });
    });
    var prefixClass = this.prefixClass;
    return h2("div", {
      "class": "".concat(prefixClass, "-range-wrapper")
    }, [calendarRange]);
  }
};
var scrollBarWidth;
function getScrollbarWidth() {
  if (typeof window === "undefined") return 0;
  if (scrollBarWidth !== void 0) return scrollBarWidth;
  var outer = document.createElement("div");
  outer.style.visibility = "hidden";
  outer.style.overflow = "scroll";
  outer.style.width = "100px";
  outer.style.position = "absolute";
  outer.style.top = "-9999px";
  document.body.appendChild(outer);
  var inner = document.createElement("div");
  inner.style.width = "100%";
  outer.appendChild(inner);
  scrollBarWidth = outer.offsetWidth - inner.offsetWidth;
  outer.parentNode.removeChild(outer);
  return scrollBarWidth;
}
var script$5 = {
  inject: {
    prefixClass: {
      default: "mx"
    }
  },
  data: function data4() {
    return {
      scrollbarWidth: 0,
      thumbTop: "",
      thumbHeight: ""
    };
  },
  created: function created() {
    this.scrollbarWidth = getScrollbarWidth();
    document.addEventListener("mouseup", this.handleDragend);
  },
  beforeDestroy: function beforeDestroy2() {
    document.addEventListener("mouseup", this.handleDragend);
  },
  mounted: function mounted2() {
    this.$nextTick(this.getThumbSize);
  },
  methods: {
    getThumbSize: function getThumbSize() {
      var wrap = this.$refs.wrap;
      if (!wrap) return;
      var heightPercentage = wrap.clientHeight * 100 / wrap.scrollHeight;
      this.thumbHeight = heightPercentage < 100 ? "".concat(heightPercentage, "%") : "";
    },
    handleScroll: function handleScroll(evt) {
      var el = evt.currentTarget;
      var scrollHeight = el.scrollHeight, scrollTop = el.scrollTop;
      this.thumbTop = "".concat(scrollTop * 100 / scrollHeight, "%");
    },
    handleDragstart: function handleDragstart(evt) {
      evt.stopImmediatePropagation();
      this._draggable = true;
      var offsetTop = this.$refs.thumb.offsetTop;
      this._prevY = evt.clientY - offsetTop;
      document.addEventListener("mousemove", this.handleDraging);
    },
    handleDraging: function handleDraging(evt) {
      if (!this._draggable) return;
      var clientY = evt.clientY;
      var wrap = this.$refs.wrap;
      var scrollHeight = wrap.scrollHeight, clientHeight = wrap.clientHeight;
      var offsetY = clientY - this._prevY;
      var top = offsetY * scrollHeight / clientHeight;
      wrap.scrollTop = top;
    },
    handleDragend: function handleDragend() {
      if (this._draggable) {
        this._draggable = false;
        document.removeEventListener("mousemove", this.handleDraging);
      }
    }
  }
};
var __vue_script__$5 = script$5;
var __vue_render__$8 = function __vue_render__10() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", {
    class: _vm.prefixClass + "-scrollbar",
    style: {
      position: "relative",
      overflow: "hidden"
    }
  }, [_c("div", {
    ref: "wrap",
    class: _vm.prefixClass + "-scrollbar-wrap",
    style: {
      marginRight: "-" + _vm.scrollbarWidth + "px"
    },
    on: {
      "scroll": _vm.handleScroll
    }
  }, [_vm._t("default")], 2), _vm._v(" "), _c("div", {
    class: _vm.prefixClass + "-scrollbar-track"
  }, [_c("div", {
    ref: "thumb",
    class: _vm.prefixClass + "-scrollbar-thumb",
    style: {
      height: _vm.thumbHeight,
      top: _vm.thumbTop
    },
    on: {
      "mousedown": _vm.handleDragstart
    }
  })])]);
};
var __vue_staticRenderFns__$8 = [];
var __vue_inject_styles__$8 = void 0;
var __vue_component__$8 = normalizeComponent({
  render: __vue_render__$8,
  staticRenderFns: __vue_staticRenderFns__$8
}, __vue_inject_styles__$8, __vue_script__$5);
var padNumber = function padNumber2(value3) {
  value3 = parseInt(value3, 10);
  return value3 < 10 ? "0".concat(value3) : "".concat(value3);
};
var generateOptions = function generateOptions2(length, step, options) {
  if (Array.isArray(options)) {
    return options.filter(function(v) {
      return v >= 0 && v < length;
    });
  }
  if (step <= 0) {
    step = 1;
  }
  var arr = [];
  for (var i = 0; i < length; i += step) {
    arr.push(i);
  }
  return arr;
};
var scrollTo = function scrollTo2(element, to) {
  var duration = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
  if (duration <= 0) {
    requestAnimationFrame(function() {
      element.scrollTop = to;
    });
    return;
  }
  var difference = to - element.scrollTop;
  var tick = difference / duration * 10;
  requestAnimationFrame(function() {
    var scrollTop = element.scrollTop + tick;
    if (scrollTop >= to) {
      element.scrollTop = to;
      return;
    }
    element.scrollTop = scrollTop;
    scrollTo2(element, to, duration - 10);
  });
};
var script$6 = {
  name: "ListColumns",
  components: {
    ScrollbarVertical: __vue_component__$8
  },
  inject: {
    prefixClass: {
      default: "mx"
    }
  },
  props: {
    date: Date,
    scrollDuration: {
      type: Number,
      default: 100
    },
    getClasses: {
      type: Function,
      default: function _default19() {
        return [];
      }
    },
    hourOptions: Array,
    minuteOptions: Array,
    secondOptions: Array,
    showHour: {
      type: Boolean,
      default: true
    },
    showMinute: {
      type: Boolean,
      default: true
    },
    showSecond: {
      type: Boolean,
      default: true
    },
    hourStep: {
      type: Number,
      default: 1
    },
    minuteStep: {
      type: Number,
      default: 1
    },
    secondStep: {
      type: Number,
      default: 1
    },
    use12h: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    columns: function columns() {
      var cols = [];
      if (this.showHour) cols.push({
        type: "hour",
        list: this.getHoursList()
      });
      if (this.showMinute) cols.push({
        type: "minute",
        list: this.getMinutesList()
      });
      if (this.showSecond) cols.push({
        type: "second",
        list: this.getSecondsList()
      });
      if (this.use12h) cols.push({
        type: "ampm",
        list: this.getAMPMList()
      });
      return cols.filter(function(v) {
        return v.list.length > 0;
      });
    }
  },
  watch: {
    date: {
      handler: function handler3() {
        var _this = this;
        this.$nextTick(function() {
          _this.scrollToSelected(_this.scrollDuration);
        });
      }
    }
  },
  mounted: function mounted3() {
    this.scrollToSelected(0);
  },
  methods: {
    getHoursList: function getHoursList() {
      var _this2 = this;
      return generateOptions(this.use12h ? 12 : 24, this.hourStep, this.hourOptions).map(function(num) {
        var date = new Date(_this2.date);
        var text2 = padNumber(num);
        if (_this2.use12h) {
          if (num === 0) {
            text2 = "12";
          }
          if (date.getHours() >= 12) {
            num += 12;
          }
        }
        var value3 = date.setHours(num);
        return {
          value: value3,
          text: text2
        };
      });
    },
    getMinutesList: function getMinutesList() {
      var _this3 = this;
      return generateOptions(60, this.minuteStep, this.minuteOptions).map(function(num) {
        var value3 = new Date(_this3.date).setMinutes(num);
        return {
          value: value3,
          text: padNumber(num)
        };
      });
    },
    getSecondsList: function getSecondsList() {
      var _this4 = this;
      return generateOptions(60, this.secondStep, this.secondOptions).map(function(num) {
        var value3 = new Date(_this4.date).setSeconds(num);
        return {
          value: value3,
          text: padNumber(num)
        };
      });
    },
    getAMPMList: function getAMPMList() {
      var _this5 = this;
      return ["AM", "PM"].map(function(text2, i) {
        var date = new Date(_this5.date);
        var value3 = date.setHours(date.getHours() % 12 + i * 12);
        return {
          text: text2,
          value: value3
        };
      });
    },
    scrollToSelected: function scrollToSelected(duration) {
      var elements = this.$el.querySelectorAll(".active");
      for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var scrollElement = getScrollParent(element, this.$el);
        if (scrollElement) {
          var to = element.offsetTop;
          scrollTo(scrollElement, to, duration);
        }
      }
    },
    handleSelect: function handleSelect2(evt) {
      var target = evt.target, currentTarget = evt.currentTarget;
      if (target.tagName.toUpperCase() !== "LI") return;
      var type = currentTarget.getAttribute("data-type");
      var colIndex = parseInt(currentTarget.getAttribute("data-index"), 10);
      var cellIndex = parseInt(target.getAttribute("data-index"), 10);
      var value3 = this.columns[colIndex].list[cellIndex].value;
      this.$emit("select", value3, type);
    }
  }
};
var __vue_script__$6 = script$6;
var __vue_render__$9 = function __vue_render__11() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", {
    class: _vm.prefixClass + "-time-columns"
  }, _vm._l(_vm.columns, function(col, i) {
    return _c("scrollbar-vertical", {
      key: i,
      class: _vm.prefixClass + "-time-column"
    }, [_c("ul", {
      class: _vm.prefixClass + "-time-list",
      attrs: {
        "data-type": col.type,
        "data-index": i
      },
      on: {
        "click": _vm.handleSelect
      }
    }, _vm._l(col.list, function(item, j) {
      return _c("li", {
        key: item.value,
        class: [_vm.prefixClass + "-time-item", _vm.getClasses(item.value, col.type)],
        attrs: {
          "data-index": j
        }
      }, [_vm._v("\n        " + _vm._s(item.text) + "\n      ")]);
    }), 0)]);
  }), 1);
};
var __vue_staticRenderFns__$9 = [];
var __vue_inject_styles__$9 = void 0;
var __vue_component__$9 = normalizeComponent({
  render: __vue_render__$9,
  staticRenderFns: __vue_staticRenderFns__$9
}, __vue_inject_styles__$9, __vue_script__$6);
function parseOption() {
  var time = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
  var values = time.split(":");
  if (values.length >= 2) {
    var hours = parseInt(values[0], 10);
    var minutes = parseInt(values[1], 10);
    return {
      hours,
      minutes
    };
  }
  return null;
}
var scrollTo$1 = function scrollTo3(element, to) {
  if (element) {
    element.scrollTop = to;
  }
};
var script$7 = {
  name: "ListOptions",
  components: {
    ScrollbarVertical: __vue_component__$8
  },
  inject: {
    getLocale: {
      default: function _default20() {
        return getLocale;
      }
    },
    prefixClass: {
      default: "mx"
    }
  },
  props: {
    date: Date,
    options: {
      type: [Object, Function],
      default: function _default21() {
        return [];
      }
    },
    format: {
      type: String,
      default: "HH:mm:ss"
    },
    getClasses: {
      type: Function,
      default: function _default22() {
        return [];
      }
    }
  },
  computed: {
    list: function list() {
      var result = [];
      var options = this.options;
      if (typeof options === "function") {
        return options() || [];
      }
      var start = parseOption(options.start);
      var end = parseOption(options.end);
      var step = parseOption(options.step);
      var fmt = options.format || this.format;
      if (start && end && step) {
        var startMinutes = start.minutes + start.hours * 60;
        var endMinutes = end.minutes + end.hours * 60;
        var stepMinutes = step.minutes + step.hours * 60;
        var len = Math.floor((endMinutes - startMinutes) / stepMinutes);
        for (var i = 0; i <= len; i++) {
          var timeMinutes = startMinutes + i * stepMinutes;
          var hours = Math.floor(timeMinutes / 60);
          var minutes = timeMinutes % 60;
          var value3 = new Date(this.date).setHours(hours, minutes, 0);
          result.push({
            value: value3,
            text: this.formatDate(value3, fmt)
          });
        }
      }
      return result;
    }
  },
  mounted: function mounted4() {
    this.scrollToSelected();
  },
  methods: {
    formatDate: function formatDate2(date, fmt) {
      return format(date, fmt, {
        locale: this.getLocale().formatLocale
      });
    },
    scrollToSelected: function scrollToSelected2() {
      var element = this.$el.querySelector(".active");
      if (!element) return;
      var scrollElement = getScrollParent(element, this.$el);
      if (!scrollElement) return;
      var to = element.offsetTop;
      scrollTo$1(scrollElement, to);
    },
    handleSelect: function handleSelect3(value3) {
      this.$emit("select", value3, "time");
    }
  }
};
var __vue_script__$7 = script$7;
var __vue_render__$a = function __vue_render__12() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("scrollbar-vertical", _vm._l(_vm.list, function(item) {
    return _c("div", {
      key: item.value,
      class: [_vm.prefixClass + "-time-option", _vm.getClasses(item.value)],
      on: {
        "click": function click($event) {
          return _vm.handleSelect(item.value);
        }
      }
    }, [_vm._v("\n    " + _vm._s(item.text) + "\n  ")]);
  }), 0);
};
var __vue_staticRenderFns__$a = [];
var __vue_inject_styles__$a = void 0;
var __vue_component__$a = normalizeComponent({
  render: __vue_render__$a,
  staticRenderFns: __vue_staticRenderFns__$a
}, __vue_inject_styles__$a, __vue_script__$7);
var script$8 = {
  name: "TimePanel",
  components: {
    ListColumns: __vue_component__$9,
    ListOptions: __vue_component__$a
  },
  inject: {
    getLocale: {
      default: function _default23() {
        return getLocale;
      }
    },
    prefixClass: {
      default: "mx"
    }
  },
  props: {
    value: {},
    defaultValue: {
      default: function _default24() {
        var date = /* @__PURE__ */ new Date();
        date.setHours(0, 0, 0, 0);
        return date;
      }
    },
    format: {
      default: "HH:mm:ss"
    },
    timeTitleFormat: {
      type: String,
      default: "YYYY-MM-DD"
    },
    showTimeHeader: {
      type: Boolean,
      default: false
    },
    disabledTime: {
      type: Function,
      default: function _default25() {
        return false;
      }
    },
    timePickerOptions: {
      type: [Object, Function],
      default: function _default26() {
        return null;
      }
    },
    hourOptions: Array,
    minuteOptions: Array,
    secondOptions: Array,
    hourStep: {
      type: Number,
      default: 1
    },
    minuteStep: {
      type: Number,
      default: 1
    },
    secondStep: {
      type: Number,
      default: 1
    },
    showHour: {
      type: Boolean,
      default: void 0
    },
    showMinute: {
      type: Boolean,
      default: void 0
    },
    showSecond: {
      type: Boolean,
      default: void 0
    },
    use12h: {
      type: Boolean,
      default: void 0
    },
    scrollDuration: {
      type: Number,
      default: 100
    }
  },
  data: function data5() {
    return {
      innerValue: getValidDate(this.value, this.defaultValue)
    };
  },
  computed: {
    title: function title() {
      var titleFormat = this.timeTitleFormat;
      var date = new Date(this.innerValue);
      return this.formatDate(date, titleFormat);
    },
    innerForamt: function innerForamt() {
      return typeof this.format === "string" ? this.format : "HH:mm:ss";
    },
    ShowHourMinuteSecondAMPM: function ShowHourMinuteSecondAMPM() {
      var _this = this;
      var fmt = this.innerForamt;
      var defaultProps = {
        showHour: /[HhKk]/.test(fmt),
        showMinute: /m/.test(fmt),
        showSecond: /s/.test(fmt),
        use12h: /a/i.test(fmt)
      };
      var obj = {};
      Object.keys(defaultProps).forEach(function(key) {
        obj[key] = typeof _this[key] === "boolean" ? _this[key] : defaultProps[key];
      });
      return obj;
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function handler4() {
        this.innerValue = getValidDate(this.value, this.defaultValue);
      }
    }
  },
  methods: {
    formatDate: function formatDate3(date, fmt) {
      return format(date, fmt, {
        locale: this.getLocale().formatLocale
      });
    },
    isDisabledTime: function isDisabledTime(value3) {
      return this.disabledTime(new Date(value3));
    },
    isDisabledHour: function isDisabledHour(date) {
      var value3 = new Date(date);
      return this.isDisabledTime(value3) && this.isDisabledTime(value3.setMinutes(0, 0, 0)) && this.isDisabledTime(value3.setMinutes(59, 59, 999));
    },
    isDisabledMinute: function isDisabledMinute(date) {
      var value3 = new Date(date);
      return this.isDisabledTime(value3) && this.isDisabledTime(value3.setSeconds(0, 0)) && this.isDisabledTime(value3.setSeconds(59, 999));
    },
    isDisabledAMPM: function isDisabledAMPM(date) {
      var value3 = new Date(date);
      var minHour = value3.getHours() < 12 ? 0 : 12;
      var maxHour = minHour + 11;
      return this.isDisabledTime(value3) && this.isDisabledTime(value3.setHours(minHour, 0, 0, 0)) && this.isDisabledTime(value3.setHours(maxHour, 59, 59, 999));
    },
    isDisabled: function isDisabled2(date, type) {
      if (type === "hour") {
        return this.isDisabledHour(date);
      }
      if (type === "minute") {
        return this.isDisabledMinute(date);
      }
      if (type === "ampm") {
        return this.isDisabledAMPM(date);
      }
      return this.isDisabledTime(date);
    },
    handleSelect: function handleSelect4(value3, type) {
      var date = new Date(value3);
      if (!this.isDisabled(value3, type)) {
        this.innerValue = date;
        if (!this.isDisabledTime(date)) {
          this.$emit("select", date, type);
        }
      }
    },
    handleClickTitle: function handleClickTitle() {
      this.$emit("clicktitle");
    },
    getClasses: function getClasses(value3, type) {
      var cellDate = new Date(value3);
      if (this.isDisabled(value3, type)) {
        return "disabled";
      }
      if (cellDate.getTime() === this.innerValue.getTime()) {
        return "active";
      }
      return "";
    }
  }
};
var __vue_script__$8 = script$8;
var __vue_render__$b = function __vue_render__13() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", {
    class: _vm.prefixClass + "-time"
  }, [_vm.showTimeHeader ? _c("div", {
    class: _vm.prefixClass + "-time-header"
  }, [_c("button", {
    class: _vm.prefixClass + "-btn " + _vm.prefixClass + "-btn-text " + _vm.prefixClass + "-time-header-title",
    attrs: {
      "type": "button"
    },
    on: {
      "click": _vm.handleClickTitle
    }
  }, [_vm._v("\n      " + _vm._s(_vm.title) + "\n    ")])]) : _vm._e(), _vm._v(" "), _c("div", {
    class: _vm.prefixClass + "-time-content"
  }, [_vm.timePickerOptions ? _c("list-options", {
    attrs: {
      "date": _vm.innerValue,
      "get-classes": _vm.getClasses,
      "options": _vm.timePickerOptions,
      "format": _vm.innerForamt
    },
    on: {
      "select": _vm.handleSelect
    }
  }) : _c("list-columns", _vm._b({
    attrs: {
      "date": _vm.innerValue,
      "get-classes": _vm.getClasses,
      "hour-options": _vm.hourOptions,
      "minute-options": _vm.minuteOptions,
      "second-options": _vm.secondOptions,
      "hour-step": _vm.hourStep,
      "minute-step": _vm.minuteStep,
      "second-step": _vm.secondStep,
      "scroll-duration": _vm.scrollDuration
    },
    on: {
      "select": _vm.handleSelect
    }
  }, "list-columns", _vm.ShowHourMinuteSecondAMPM, false))], 1)]);
};
var __vue_staticRenderFns__$b = [];
var __vue_inject_styles__$b = void 0;
var __vue_component__$b = normalizeComponent({
  render: __vue_render__$b,
  staticRenderFns: __vue_staticRenderFns__$b
}, __vue_inject_styles__$b, __vue_script__$8);
var TimeRange = {
  name: "TimeRange",
  inject: {
    prefixClass: {
      default: "mx"
    }
  },
  props: _objectSpread2({}, __vue_component__$b.props),
  data: function data6() {
    return {
      startValue: /* @__PURE__ */ new Date(NaN),
      endValue: /* @__PURE__ */ new Date(NaN)
    };
  },
  watch: {
    value: {
      immediate: true,
      handler: function handler5() {
        if (isValidRangeDate(this.value)) {
          var _this$value = _slicedToArray(this.value, 2), startValue = _this$value[0], endValue = _this$value[1];
          this.startValue = startValue;
          this.endValue = endValue;
        } else {
          this.startValue = /* @__PURE__ */ new Date(NaN);
          this.endValue = /* @__PURE__ */ new Date(NaN);
        }
      }
    }
  },
  methods: {
    emitChange: function emitChange(type, index) {
      var date = [this.startValue, this.endValue];
      this.$emit("select", date, type === "time" ? "time-range" : type, index);
    },
    handleSelectStart: function handleSelectStart(date, type) {
      this.startValue = date;
      if (!(this.endValue.getTime() >= date.getTime())) {
        this.endValue = date;
      }
      this.emitChange(type, 0);
    },
    handleSelectEnd: function handleSelectEnd(date, type) {
      this.endValue = date;
      if (!(this.startValue.getTime() <= date.getTime())) {
        this.startValue = date;
      }
      this.emitChange(type, 1);
    },
    disabledStartTime: function disabledStartTime(date) {
      return this.disabledTime(date, 0);
    },
    disabledEndTime: function disabledEndTime(date) {
      return date.getTime() < this.startValue.getTime() || this.disabledTime(date, 1);
    }
  },
  render: function render4() {
    var h2 = arguments[0];
    var defaultValues2 = Array.isArray(this.defaultValue) ? this.defaultValue : [this.defaultValue, this.defaultValue];
    var prefixClass = this.prefixClass;
    return h2("div", {
      "class": "".concat(prefixClass, "-range-wrapper")
    }, [h2(__vue_component__$b, {
      "props": _objectSpread2({}, _objectSpread2({}, this.$props, {
        value: this.startValue,
        defaultValue: defaultValues2[0],
        disabledTime: this.disabledStartTime
      })),
      "on": _objectSpread2({}, _objectSpread2({}, this.$listeners, {
        select: this.handleSelectStart
      }))
    }), h2(__vue_component__$b, {
      "props": _objectSpread2({}, _objectSpread2({}, this.$props, {
        value: this.endValue,
        defaultValue: defaultValues2[1],
        disabledTime: this.disabledEndTime
      })),
      "on": _objectSpread2({}, _objectSpread2({}, this.$listeners, {
        select: this.handleSelectEnd
      }))
    })]);
  }
};
var DatetimePanel = {
  name: "DatetimePanel",
  inject: {
    prefixClass: {
      default: "mx"
    }
  },
  emits: ["select", "update:show-time-panel"],
  props: _objectSpread2({}, CalendarPanel.props, {}, __vue_component__$b.props, {
    showTimePanel: {
      type: Boolean,
      default: void 0
    }
  }),
  data: function data7() {
    return {
      defaultTimeVisible: false,
      currentValue: this.value
    };
  },
  computed: {
    timeVisible: function timeVisible() {
      return typeof this.showTimePanel === "boolean" ? this.showTimePanel : this.defaultTimeVisible;
    }
  },
  watch: {
    value: function value(val) {
      this.currentValue = val;
    }
  },
  methods: {
    closeTimePanel: function closeTimePanel() {
      this.defaultTimeVisible = false;
      this.$emit("update:show-time-panel", false);
    },
    openTimePanel: function openTimePanel() {
      this.defaultTimeVisible = true;
      this.$emit("update:show-time-panel", true);
    },
    emitDate: function emitDate3(date, type) {
      this.$emit("select", date, type);
    },
    handleSelect: function handleSelect5(date, type) {
      if (type === "date") {
        this.openTimePanel();
      }
      var datetime = assignTime(date, getValidDate(this.value, this.defaultValue));
      if (this.disabledTime(new Date(datetime))) {
        datetime = assignTime(date, this.defaultValue);
        if (this.disabledTime(new Date(datetime))) {
          this.currentValue = datetime;
          return;
        }
      }
      this.emitDate(datetime, type);
    }
  },
  render: function render5() {
    var h2 = arguments[0];
    var calendarProps = {
      props: _objectSpread2({}, pick(this.$props, Object.keys(CalendarPanel.props)), {
        type: "date",
        value: this.currentValue
      }),
      on: {
        select: this.handleSelect
      }
    };
    var timeProps = {
      props: _objectSpread2({}, pick(this.$props, Object.keys(__vue_component__$b.props)), {
        showTimeHeader: true,
        value: this.currentValue
      }),
      on: {
        select: this.emitDate,
        clicktitle: this.closeTimePanel
      }
    };
    var prefixClass = this.prefixClass;
    return h2("div", [h2(CalendarPanel, helper([{}, calendarProps])), this.timeVisible && h2(__vue_component__$b, helper([{
      "class": "".concat(prefixClass, "-calendar-time")
    }, timeProps]))]);
  }
};
var DatetimeRange = {
  name: "DatetimeRange",
  inject: {
    prefixClass: {
      default: "mx"
    }
  },
  emits: ["select", "update:show-time-panel"],
  props: _objectSpread2({}, CalendarRange.props, {}, TimeRange.props, {
    showTimePanel: {
      type: Boolean,
      default: void 0
    }
  }),
  data: function data8() {
    return {
      defaultTimeVisible: false,
      currentValue: this.value
    };
  },
  computed: {
    timeVisible: function timeVisible2() {
      return typeof this.showTimePanel === "boolean" ? this.showTimePanel : this.defaultTimeVisible;
    }
  },
  watch: {
    value: function value2(val) {
      this.currentValue = val;
    }
  },
  methods: {
    closeTimePanel: function closeTimePanel2() {
      this.defaultTimeVisible = false;
      this.$emit("update:show-time-panel", false);
    },
    openTimePanel: function openTimePanel2() {
      this.defaultTimeVisible = true;
      this.$emit("update:show-time-panel", true);
    },
    emitDate: function emitDate4(dates2, type) {
      this.$emit("select", dates2, type);
    },
    handleSelect: function handleSelect6(dates2, type) {
      var _this = this;
      if (type === "date") {
        this.openTimePanel();
      }
      var defaultValues2 = Array.isArray(this.defaultValue) ? this.defaultValue : [this.defaultValue, this.defaultValue];
      var datetimes = dates2.map(function(date, i) {
        var time = isValidRangeDate(_this.value) ? _this.value[i] : defaultValues2[i];
        return assignTime(date, time);
      });
      if (datetimes[1].getTime() < datetimes[0].getTime()) {
        datetimes = [datetimes[0], datetimes[0]];
      }
      if (datetimes.some(this.disabledTime)) {
        datetimes = dates2.map(function(date, i) {
          return assignTime(date, defaultValues2[i]);
        });
        if (datetimes.some(this.disabledTime)) {
          this.currentValue = datetimes;
          return;
        }
      }
      this.emitDate(datetimes, type);
    }
  },
  render: function render6() {
    var h2 = arguments[0];
    var calendarProps = {
      props: _objectSpread2({}, pick(this.$props, Object.keys(CalendarRange.props)), {
        type: "date",
        value: this.currentValue
      }),
      on: {
        select: this.handleSelect
      }
    };
    var timeProps = {
      props: _objectSpread2({}, pick(this.$props, Object.keys(TimeRange.props)), {
        value: this.currentValue,
        showTimeHeader: true
      }),
      on: {
        select: this.emitDate,
        clicktitle: this.closeTimePanel
      }
    };
    var prefixClass = this.prefixClass;
    return h2("div", [h2(CalendarRange, helper([{}, calendarProps])), this.timeVisible && h2(TimeRange, helper([{
      "class": "".concat(prefixClass, "-calendar-time")
    }, timeProps]))]);
  }
};
var componentMap = {
  default: CalendarPanel,
  time: __vue_component__$b,
  datetime: DatetimePanel
};
var componentRangeMap = {
  default: CalendarRange,
  time: TimeRange,
  datetime: DatetimeRange
};
var DatePicker = {
  name: "DatePicker",
  provide: function provide2() {
    var _this = this;
    return {
      // make locale reactive
      getLocale: function getLocale2() {
        return _this.locale;
      },
      getWeek: this.getWeek,
      prefixClass: this.prefixClass,
      dispatchDatePicker: this.$emit.bind(this)
    };
  },
  props: _objectSpread2({}, DatetimePanel.props, {
    value: {},
    valueType: {
      type: String,
      default: "date"
      // date, format, timestamp, or token like 'YYYY-MM-DD'
    },
    type: {
      type: String,
      // ['date', 'datetime', 'time', 'year', 'month', 'week']
      default: "date"
    },
    format: {
      type: String
    },
    formatter: {
      type: Object
    },
    range: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    rangeSeparator: {
      type: String
    },
    lang: {
      type: [String, Object]
    },
    placeholder: {
      type: String,
      default: ""
    },
    editable: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    prefixClass: {
      type: String,
      default: "mx"
    },
    inputClass: {},
    inputAttr: {
      type: Object,
      default: function _default27() {
        return {};
      }
    },
    appendToBody: {
      type: Boolean,
      default: true
    },
    open: {
      type: Boolean,
      default: void 0
    },
    popupClass: {},
    popupStyle: {
      type: Object,
      default: function _default28() {
        return {};
      }
    },
    inline: {
      type: Boolean,
      default: false
    },
    confirm: {
      type: Boolean,
      default: false
    },
    confirmText: {
      type: String,
      default: "OK"
    },
    renderInputText: {
      type: Function
    },
    shortcuts: {
      type: Array,
      validator: function validator(value3) {
        return Array.isArray(value3) && value3.every(function(v) {
          return isObject(v) && typeof v.text === "string" && typeof v.onClick === "function";
        });
      },
      default: function _default29() {
        return [];
      }
    }
  }),
  data: function data9() {
    return {
      // cache the innervalue, wait to confirm
      currentValue: null,
      userInput: null,
      defaultOpen: false,
      mouseInInput: false
    };
  },
  computed: {
    popupVisible: function popupVisible() {
      return !this.disabled && (typeof this.open === "boolean" ? this.open : this.defaultOpen);
    },
    innerRangeSeparator: function innerRangeSeparator() {
      return this.rangeSeparator || (this.multiple ? "," : " ~ ");
    },
    innerFormat: function innerFormat() {
      var map = {
        date: "YYYY-MM-DD",
        datetime: "YYYY-MM-DD HH:mm:ss",
        year: "YYYY",
        month: "YYYY-MM",
        time: "HH:mm:ss",
        week: "w"
      };
      return this.format || map[this.type] || map.date;
    },
    innerValue: function innerValue2() {
      var value3 = this.value;
      if (this.validMultipleType) {
        value3 = Array.isArray(value3) ? value3 : [];
        return value3.map(this.value2date);
      }
      if (this.range) {
        value3 = Array.isArray(value3) ? value3.slice(0, 2) : [null, null];
        return value3.map(this.value2date);
      }
      return this.value2date(value3);
    },
    text: function text() {
      var _this2 = this;
      if (this.userInput !== null) {
        return this.userInput;
      }
      if (typeof this.renderInputText === "function") {
        return this.renderInputText(this.innerValue);
      }
      if (!this.isValidValue(this.innerValue)) {
        return "";
      }
      if (Array.isArray(this.innerValue)) {
        return this.innerValue.map(function(v) {
          return _this2.formatDate(v);
        }).join(this.innerRangeSeparator);
      }
      return this.formatDate(this.innerValue);
    },
    showClearIcon: function showClearIcon() {
      return !this.disabled && this.clearable && this.text && this.mouseInInput;
    },
    locale: function locale2() {
      if (isObject(this.lang)) {
        return mergeDeep(getLocale(), this.lang);
      }
      return getLocale(this.lang);
    },
    validMultipleType: function validMultipleType() {
      var types = ["date", "month", "year"];
      return this.multiple && !this.range && types.indexOf(this.type) !== -1;
    }
  },
  watch: {
    innerValue: {
      immediate: true,
      handler: function handler6(val) {
        this.currentValue = val;
      }
    },
    popupVisible: {
      handler: function handler7(val) {
        if (val) {
          this.currentValue = this.innerValue;
        }
      }
    }
  },
  created: function created2() {
    if (_typeof(this.format) === "object") {
      console.warn("[vue2-datepicker]: The prop `format` don't support Object any more. You can use the new prop `formatter` to replace it");
    }
  },
  methods: {
    handleMouseEnter: function handleMouseEnter2() {
      this.mouseInInput = true;
    },
    handleMouseLeave: function handleMouseLeave2() {
      this.mouseInInput = false;
    },
    handleClickOutSide: function handleClickOutSide(evt) {
      var target = evt.target;
      if (!this.$el.contains(target)) {
        this.closePopup();
      }
    },
    getFormatter: function getFormatter(key) {
      return isObject(this.formatter) && this.formatter[key] || isObject(this.format) && this.format[key];
    },
    getWeek: function getWeek$1(date, options) {
      if (typeof this.getFormatter("getWeek") === "function") {
        return this.getFormatter("getWeek")(date, options);
      }
      return getWeek(date, options);
    },
    parseDate: function parseDate(value3, fmt) {
      fmt = fmt || this.innerFormat;
      if (typeof this.getFormatter("parse") === "function") {
        return this.getFormatter("parse")(value3, fmt);
      }
      var backupDate = /* @__PURE__ */ new Date();
      return parse(value3, fmt, {
        locale: this.locale.formatLocale,
        backupDate
      });
    },
    formatDate: function formatDate4(date, fmt) {
      fmt = fmt || this.innerFormat;
      if (typeof this.getFormatter("stringify") === "function") {
        return this.getFormatter("stringify")(date, fmt);
      }
      return format(date, fmt, {
        locale: this.locale.formatLocale
      });
    },
    // transform the outer value to inner date
    value2date: function value2date(value3) {
      switch (this.valueType) {
        case "date":
          return value3 instanceof Date ? new Date(value3.getTime()) : /* @__PURE__ */ new Date(NaN);
        case "timestamp":
          return typeof value3 === "number" ? new Date(value3) : /* @__PURE__ */ new Date(NaN);
        case "format":
          return typeof value3 === "string" ? this.parseDate(value3) : /* @__PURE__ */ new Date(NaN);
        default:
          return typeof value3 === "string" ? this.parseDate(value3, this.valueType) : /* @__PURE__ */ new Date(NaN);
      }
    },
    // transform the inner date to outer value
    date2value: function date2value(date) {
      if (!isValidDate(date)) return null;
      switch (this.valueType) {
        case "date":
          return date;
        case "timestamp":
          return date.getTime();
        case "format":
          return this.formatDate(date);
        default:
          return this.formatDate(date, this.valueType);
      }
    },
    emitValue: function emitValue(date, type) {
      var close = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
      this.userInput = null;
      var value3 = Array.isArray(date) ? date.map(this.date2value) : this.date2value(date);
      this.$emit("input", value3);
      this.$emit("change", value3, type);
      if (close) {
        this.closePopup();
      }
      return value3;
    },
    isValidValue: function isValidValue(value3) {
      if (this.validMultipleType) {
        return isValidDates(value3);
      }
      if (this.range) {
        return isValidRangeDate(value3);
      }
      return isValidDate(value3);
    },
    isValidValueAndNotDisabled: function isValidValueAndNotDisabled(value3) {
      if (!this.isValidValue(value3)) {
        return false;
      }
      var disabledDate = typeof this.disabledDate === "function" ? this.disabledDate : function() {
        return false;
      };
      var disabledTime = typeof this.disabledTime === "function" ? this.disabledTime : function() {
        return false;
      };
      if (!Array.isArray(value3)) {
        value3 = [value3];
      }
      return value3.every(function(v) {
        return !disabledDate(v) && !disabledTime(v);
      });
    },
    handleMultipleDates: function handleMultipleDates(date, dates2) {
      if (this.validMultipleType && dates2) {
        var nextDates = dates2.filter(function(v) {
          return v.getTime() !== date.getTime();
        });
        if (nextDates.length === dates2.length) {
          nextDates.push(date);
        }
        return nextDates;
      }
      return date;
    },
    handleSelectDate: function handleSelectDate2(val, type, dates2) {
      val = this.handleMultipleDates(val, dates2);
      if (this.confirm) {
        this.currentValue = val;
      } else {
        this.emitValue(
          val,
          type,
          // this.type === 'datetime', click the time should close popup
          !this.validMultipleType && (type === this.type || type === "time")
        );
      }
    },
    clear: function clear() {
      this.emitValue(this.range ? [null, null] : null);
      this.$emit("clear");
    },
    handleClear: function handleClear(evt) {
      evt.stopPropagation();
      this.clear();
    },
    handleConfirmDate: function handleConfirmDate() {
      var value3 = this.emitValue(this.currentValue);
      this.$emit("confirm", value3);
    },
    handleSelectShortcut: function handleSelectShortcut(evt) {
      var index = evt.currentTarget.getAttribute("data-index");
      var item = this.shortcuts[parseInt(index, 10)];
      if (isObject(item) && typeof item.onClick === "function") {
        var date = item.onClick(this);
        if (date) {
          this.emitValue(date);
        }
      }
    },
    openPopup: function openPopup(evt) {
      if (this.popupVisible || this.disabled) return;
      this.defaultOpen = true;
      this.$emit("open", evt);
      this.$emit("update:open", true);
    },
    closePopup: function closePopup() {
      if (!this.popupVisible) return;
      this.defaultOpen = false;
      this.$emit("close");
      this.$emit("update:open", false);
    },
    blur: function blur() {
      if (this.$refs.input) {
        this.$refs.input.blur();
      }
    },
    focus: function focus() {
      if (this.$refs.input) {
        this.$refs.input.focus();
      }
    },
    handleInputChange: function handleInputChange() {
      var _this3 = this;
      if (!this.editable || this.userInput === null) return;
      var text2 = this.userInput.trim();
      this.userInput = null;
      if (text2 === "") {
        this.clear();
        return;
      }
      var date;
      if (this.validMultipleType) {
        date = text2.split(this.innerRangeSeparator).map(function(v) {
          return _this3.parseDate(v.trim());
        });
      } else if (this.range) {
        var arr = text2.split(this.innerRangeSeparator);
        if (arr.length !== 2) {
          arr = text2.split(this.innerRangeSeparator.trim());
        }
        date = arr.map(function(v) {
          return _this3.parseDate(v.trim());
        });
      } else {
        date = this.parseDate(text2);
      }
      if (this.isValidValueAndNotDisabled(date)) {
        this.emitValue(date);
        this.blur();
      } else {
        this.$emit("input-error", text2);
      }
    },
    handleInputInput: function handleInputInput(evt) {
      this.userInput = typeof evt === "string" ? evt : evt.target.value;
    },
    handleInputKeydown: function handleInputKeydown(evt) {
      var keyCode = evt.keyCode;
      if (keyCode === 9) {
        this.closePopup();
      } else if (keyCode === 13) {
        this.handleInputChange();
      }
    },
    handleInputBlur: function handleInputBlur(evt) {
      this.$emit("blur", evt);
    },
    handleInputFocus: function handleInputFocus(evt) {
      this.openPopup(evt);
      this.$emit("focus", evt);
    },
    hasSlot: function hasSlot(name) {
      return !!(this.$slots[name] || this.$scopedSlots[name]);
    },
    renderSlot: function renderSlot(name, fallback, props) {
      var slotFn = this.$scopedSlots[name];
      if (slotFn) {
        return slotFn(props) || fallback;
      }
      return this.$slots[name] || fallback;
    },
    renderInput: function renderInput() {
      var h2 = this.$createElement;
      var prefixClass = this.prefixClass;
      var props = _objectSpread2({
        name: "date",
        type: "text",
        autocomplete: "off",
        value: this.text,
        class: this.inputClass || "".concat(this.prefixClass, "-input"),
        readonly: !this.editable,
        disabled: this.disabled,
        placeholder: this.placeholder
      }, this.inputAttr);
      var value3 = props.value, className = props.class, attrs = _objectWithoutProperties(props, ["value", "class"]);
      var events = {
        keydown: this.handleInputKeydown,
        focus: this.handleInputFocus,
        blur: this.handleInputBlur,
        input: this.handleInputInput,
        change: this.handleInputChange
      };
      var input = this.renderSlot("input", h2("input", {
        "domProps": {
          "value": value3
        },
        "class": className,
        "attrs": _objectSpread2({}, attrs),
        "on": _objectSpread2({}, events),
        "ref": "input"
      }), {
        props,
        events
      });
      var calendarIcon = this.type === "time" ? h2(__vue_component__$2) : h2(__vue_component__$1);
      return h2("div", {
        "class": "".concat(prefixClass, "-input-wrapper"),
        "on": {
          "mouseenter": this.handleMouseEnter,
          "mouseleave": this.handleMouseLeave,
          "click": this.openPopup
        },
        "ref": "inputWrapper"
      }, [input, this.showClearIcon ? h2("i", {
        "class": "".concat(prefixClass, "-icon-clear"),
        "on": {
          "click": this.handleClear
        }
      }, [this.renderSlot("icon-clear", h2(__vue_component__$3))]) : h2("i", {
        "class": "".concat(prefixClass, "-icon-calendar")
      }, [this.renderSlot("icon-calendar", calendarIcon)])]);
    },
    renderContent: function renderContent() {
      var h2 = this.$createElement;
      var map = this.range ? componentRangeMap : componentMap;
      var Component2 = map[this.type] || map.default;
      var props = _objectSpread2({}, pick(this.$props, Object.keys(Component2.props)), {
        value: this.currentValue
      });
      var on = _objectSpread2({}, pick(this.$listeners, Component2.emits || []), {
        select: this.handleSelectDate
      });
      var content = h2(Component2, helper([{}, {
        props,
        on,
        ref: "picker"
      }]));
      return h2("div", {
        "class": "".concat(this.prefixClass, "-datepicker-body")
      }, [this.renderSlot("content", content, {
        value: this.currentValue,
        emit: this.handleSelectDate
      })]);
    },
    renderSidebar: function renderSidebar() {
      var _this4 = this;
      var h2 = this.$createElement;
      var prefixClass = this.prefixClass;
      return h2("div", {
        "class": "".concat(prefixClass, "-datepicker-sidebar")
      }, [this.renderSlot("sidebar", null, {
        value: this.currentValue,
        emit: this.handleSelectDate
      }), this.shortcuts.map(function(v, i) {
        return h2("button", {
          "key": i,
          "attrs": {
            "data-index": i,
            "type": "button"
          },
          "class": "".concat(prefixClass, "-btn ").concat(prefixClass, "-btn-text ").concat(prefixClass, "-btn-shortcut"),
          "on": {
            "click": _this4.handleSelectShortcut
          }
        }, [v.text]);
      })]);
    },
    renderHeader: function renderHeader() {
      var h2 = this.$createElement;
      return h2("div", {
        "class": "".concat(this.prefixClass, "-datepicker-header")
      }, [this.renderSlot("header", null, {
        value: this.currentValue,
        emit: this.handleSelectDate
      })]);
    },
    renderFooter: function renderFooter() {
      var h2 = this.$createElement;
      var prefixClass = this.prefixClass;
      return h2("div", {
        "class": "".concat(prefixClass, "-datepicker-footer")
      }, [this.renderSlot("footer", null, {
        value: this.currentValue,
        emit: this.handleSelectDate
      }), this.confirm ? h2("button", {
        "attrs": {
          "type": "button"
        },
        "class": "".concat(prefixClass, "-btn ").concat(prefixClass, "-datepicker-btn-confirm"),
        "on": {
          "click": this.handleConfirmDate
        }
      }, [this.confirmText]) : null]);
    }
  },
  render: function render7() {
    var _class;
    var h2 = arguments[0];
    var prefixClass = this.prefixClass, inline = this.inline, disabled = this.disabled;
    var sidedar = this.hasSlot("sidebar") || this.shortcuts.length ? this.renderSidebar() : null;
    var content = h2("div", {
      "class": "".concat(prefixClass, "-datepicker-content")
    }, [this.hasSlot("header") ? this.renderHeader() : null, this.renderContent(), this.hasSlot("footer") || this.confirm ? this.renderFooter() : null]);
    return h2("div", {
      "class": (_class = {}, _defineProperty(_class, "".concat(prefixClass, "-datepicker"), true), _defineProperty(_class, "".concat(prefixClass, "-datepicker-range"), this.range), _defineProperty(_class, "".concat(prefixClass, "-datepicker-inline"), inline), _defineProperty(_class, "disabled", disabled), _class)
    }, [!inline ? this.renderInput() : null, !inline ? h2(__vue_component__, {
      "ref": "popup",
      "class": this.popupClass,
      "style": this.popupStyle,
      "attrs": {
        "visible": this.popupVisible,
        "appendToBody": this.appendToBody
      },
      "on": {
        "clickoutside": this.handleClickOutSide
      }
    }, [sidedar, content]) : h2("div", {
      "class": "".concat(prefixClass, "-datepicker-main")
    }, [sidedar, content])]);
  }
};
DatePicker.locale = locale;
DatePicker.install = function install(Vue) {
  Vue.component(DatePicker.name, DatePicker);
};
if (typeof window !== "undefined" && window.Vue) {
  DatePicker.install(window.Vue);
}
_extends(DatePicker, {
  CalendarPanel,
  CalendarRange,
  TimePanel: __vue_component__$b,
  TimeRange,
  DatetimePanel,
  DatetimeRange
});
register(t37);
const _sfc_main$2 = {
  name: "CalendarBlankIcon",
  emits: ["click"],
  props: {
    title: {
      type: String
    },
    fillColor: {
      type: String,
      default: "currentColor"
    },
    size: {
      type: Number,
      default: 24
    }
  }
};
var _sfc_render$2 = function render8() {
  var _vm = this, _c = _vm._self._c;
  return _c("span", _vm._b({ staticClass: "material-design-icon calendar-blank-icon", attrs: { "aria-hidden": _vm.title ? null : "true", "aria-label": _vm.title, "role": "img" }, on: { "click": function($event) {
    return _vm.$emit("click", $event);
  } } }, "span", _vm.$attrs, false), [_c("svg", { staticClass: "material-design-icon__svg", attrs: { "fill": _vm.fillColor, "width": _vm.size, "height": _vm.size, "viewBox": "0 0 24 24" } }, [_c("path", { attrs: { "d": "M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1" } }, [_vm.title ? _c("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()])])]);
};
var _sfc_staticRenderFns$2 = [];
var __component__$2 = /* @__PURE__ */ normalizeComponent$1(
  _sfc_main$2,
  _sfc_render$2,
  _sfc_staticRenderFns$2,
  false,
  null,
  null
);
const CalendarBlank = __component__$2.exports;
const _sfc_main$1 = {
  name: "WebIcon",
  emits: ["click"],
  props: {
    title: {
      type: String
    },
    fillColor: {
      type: String,
      default: "currentColor"
    },
    size: {
      type: Number,
      default: 24
    }
  }
};
var _sfc_render$1 = function render22() {
  var _vm = this, _c = _vm._self._c;
  return _c("span", _vm._b({ staticClass: "material-design-icon web-icon", attrs: { "aria-hidden": _vm.title ? null : "true", "aria-label": _vm.title, "role": "img" }, on: { "click": function($event) {
    return _vm.$emit("click", $event);
  } } }, "span", _vm.$attrs, false), [_c("svg", { staticClass: "material-design-icon__svg", attrs: { "fill": _vm.fillColor, "width": _vm.size, "height": _vm.size, "viewBox": "0 0 24 24" } }, [_c("path", { attrs: { "d": "M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" } }, [_vm.title ? _c("title", [_vm._v(_vm._s(_vm.title))]) : _vm._e()])])]);
};
var _sfc_staticRenderFns$1 = [];
var __component__$1 = /* @__PURE__ */ normalizeComponent$1(
  _sfc_main$1,
  _sfc_render$1,
  _sfc_staticRenderFns$1,
  false,
  null,
  null
);
const Web = __component__$1.exports;
const formatMap = {
  date: "YYYY-MM-DD",
  datetime: "YYYY-MM-DD H:mm:ss",
  year: "YYYY",
  month: "YYYY-MM",
  time: "H:mm:ss",
  week: "w"
};
const _sfc_main = {
  name: "NcDateTimePicker",
  components: {
    CalendarBlank,
    DatePicker,
    NcPopover,
    NcTimezonePicker,
    Web
  },
  inheritAttrs: false,
  model: {
    prop: "modelValue",
    event: "update:modelValue"
  },
  props: {
    clearable: {
      type: Boolean,
      default: false
    },
    minuteStep: {
      type: Number,
      default: 10
    },
    /**
     * Since 8.25.0: Support 'date-range', 'time-range' and 'datetime-range' values.
     */
    type: {
      type: String,
      default: "date",
      validator: (type) => ["date", "time", "datetime", "week", "month", "year", "date-range", "time-range", "datetime-range"].includes(type)
    },
    /**
     * Either `moment.js` formatting tokens or a function taking a Date object and returning a string.
     * Warning: In v9 this will change the accepted token format to standardized Unicode tokens instead!
     */
    format: {
      type: [String, Function],
      default: null
    },
    /**
     * @deprecated use `format` instead
     */
    formatter: {
      type: Object,
      default: null
    },
    lang: {
      type: Object,
      default: null
    },
    /**
     * Removed in v9 - use `modelValue` (`v-model`) instead
     * @deprecated
     */
    // eslint-disable-next-line
    value: {
      default: void 0
    },
    /**
     * The value to initialize, but also two-way bind the selected date. The date is – like the `Date` object in
     * JavaScript – tied to UTC. The selected time zone does not have an influence of the selected time and date
     * value. You have to translate the time yourself when you want to factor in time zones.
     */
    // eslint-disable-next-line
    modelValue: {
      default: () => /* @__PURE__ */ new Date()
    },
    /**
     * The preselected IANA time zone ID for the time zone picker, only relevant in combination with `:show-timezone-select="true"`. Example: `Europe/Berlin`. The prop supports two-way binding through the .sync modifier.
     */
    timezoneId: {
      type: String,
      default: "UTC"
    },
    showTimezoneSelect: {
      type: Boolean,
      default: false
    },
    highlightTimezone: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    showWeekNumber: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: null
    },
    /**
     * @deprecated use the 'date-range' or 'datetime-range' type instead.
     */
    range: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    /**
     * Removed in v9 - use `update:modelValue` (`v-model`) instead
     * @deprecated
     */
    "update:value",
    "update:modelValue",
    /** Same as update:modelValue for Vue 2 compatibility */
    "update:model-value",
    "update:timezone-id"
  ],
  setup() {
    const model = useModelMigration("value", "update:value");
    return {
      model,
      timezoneDialogHeaderId: `timezone-dialog-header-${GenRandomId()}`
    };
  },
  data() {
    return {
      showTimezonePopover: false,
      tzVal: this.timezoneId
    };
  },
  computed: {
    realType() {
      return this.type.split("-")[0];
    },
    /**
     * Datepicker language
     * https://github.com/mengxiong10/vue2-datepicker/blob/master/locale.md
     *
     * @return {object}
     */
    defaultLang() {
      return {
        formatLocale: {
          months: getMonthNames(),
          monthsShort: getMonthNamesShort(),
          weekdays: getDayNames(),
          weekdaysShort: getDayNamesShort(),
          weekdaysMin: getDayNamesMin(),
          // 0 = sunday, 1 = monday
          firstDayOfWeek: getFirstDay()
        },
        monthFormat: "MMMM"
      };
    },
    /**
     * Translated placeholder
     *
     * @return {string}
     */
    defaultPlaceholder() {
      if (this.realType === "time") {
        return t("Pick a time");
      }
      if (this.realType === "month") {
        return t("Pick a month");
      }
      if (this.realType === "year") {
        return t("Pick a year");
      }
      if (this.realType === "week") {
        return t("Pick a week");
      }
      if (this.realType === "date") {
        return t("Pick a date");
      }
      return t("Pick a date and a time");
    },
    /**
     * Is the range picker enabled
     */
    internalRange() {
      return this.range || this.type.endsWith("-range");
    },
    internalFormat() {
      if (this.format && typeof this.format === "string") {
        return this.format;
      }
      return formatMap[this.realType] || formatMap.date;
    },
    /**
     * The formatter used for the vue-datepicker to fix nextcloud-libraries/nextcloud-vue#5044
     */
    internalFormatter() {
      const getWeek2 = (date) => {
        const firstThursday = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        firstThursday.setUTCDate(firstThursday.getUTCDate() + 4 - (firstThursday.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(firstThursday.getUTCFullYear(), 0, 1));
        return Math.ceil(((firstThursday - yearStart) / 864e5 + 1) / 7);
      };
      return {
        getWeek: getWeek2,
        // wrape the format if it is a function
        ...typeof this.format === "function" ? { stringify: this.format } : {},
        // allow to override it by users using the `formatter` prop
        ...this.formatter ?? {}
      };
    }
  },
  methods: {
    t,
    handleSelectYear(year) {
      const value3 = this.$refs.datepicker.currentValue;
      if (value3) {
        try {
          const date = new Date(new Date(value3).setFullYear(year));
          this.$refs.datepicker.selectDate(date);
        } catch (error) {
          console.error("Invalid value", value3, year);
        }
      }
    },
    handleSelectMonth(month) {
      const value3 = this.$refs.datepicker.currentValue;
      if (value3) {
        try {
          const date = new Date(new Date(value3).setMonth(month));
          this.$refs.datepicker.selectDate(date);
        } catch (error) {
          console.error("Invalid value", value3, month);
        }
      }
    },
    /**
     * Toggles the visibility of the time zone popover
     */
    toggleTimezonePopover() {
      if (!this.showTimezoneSelect) {
        return;
      }
      this.showTimezonePopover = !this.showTimezonePopover;
    }
  }
};
var _sfc_render = function render32() {
  var _vm = this, _c = _vm._self._c;
  return _c("DatePicker", _vm._g(_vm._b({ ref: "datepicker", attrs: { "append-to-body": _vm.appendToBody, "clearable": _vm.clearable, "format": _vm.internalFormat, "formatter": _vm.internalFormatter, "lang": _vm.lang ? _vm.lang : _vm.defaultLang, "minute-step": _vm.minuteStep, "placeholder": _vm.placeholder ? _vm.placeholder : _vm.defaultPlaceholder, "popup-class": { "show-week-number": _vm.showWeekNumber }, "range": _vm.internalRange, "show-week-number": _vm.showWeekNumber, "type": _vm.realType, "value": _vm.model }, on: { "select-year": _vm.handleSelectYear, "select-month": _vm.handleSelectMonth, "input": function($event) {
    _vm.model = $event;
  } }, scopedSlots: _vm._u([{ key: "icon-calendar", fn: function() {
    return [_vm.showTimezoneSelect ? _c("NcPopover", { attrs: { "popup-role": "dialog", "shown": _vm.showTimezonePopover, "popover-base-class": "timezone-select__popper" }, on: { "update:shown": function($event) {
      _vm.showTimezonePopover = $event;
    } }, scopedSlots: _vm._u([{ key: "trigger", fn: function({ attrs }) {
      return [_c("button", _vm._b({ staticClass: "datetime-picker-inline-icon", class: { "datetime-picker-inline-icon--highlighted": _vm.highlightTimezone }, on: { "mousedown": function($event) {
        $event.stopPropagation();
        $event.preventDefault();
        return (() => {
        }).apply(null, arguments);
      } } }, "button", attrs, false), [_c("Web", { attrs: { "size": 20 } })], 1)];
    } }], null, false, 270852355) }, [_c("div", { attrs: { "role": "dialog", "aria-labelledby": _vm.timezoneDialogHeaderId } }, [_c("div", { staticClass: "timezone-popover-wrapper__label" }, [_c("strong", { attrs: { "id": _vm.timezoneDialogHeaderId } }, [_vm._v(" " + _vm._s(_vm.t("Please select a time zone:")) + " ")])]), _c("NcTimezonePicker", { staticClass: "timezone-popover-wrapper__timezone-select", on: { "input": function($event) {
      return _vm.$emit("update:timezone-id", arguments[0]);
    } }, model: { value: _vm.tzVal, callback: function($$v) {
      _vm.tzVal = $$v;
    }, expression: "tzVal" } })], 1)]) : _c("CalendarBlank", { attrs: { "size": 20 } })];
  }, proxy: true }, _vm._l(_vm.$scopedSlots, function(_, slot) {
    return { key: slot, fn: function(scope) {
      return [_vm._t(slot, null, null, scope)];
    } };
  })], null, true) }, "DatePicker", _vm.$attrs, false), _vm.$listeners));
};
var _sfc_staticRenderFns = [];
var __component__ = /* @__PURE__ */ normalizeComponent$1(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "9cec8c69"
);
const NcDateTimePicker = __component__.exports;
ScopeComponent(NcDateTimePicker);
export {
  NcDateTimePicker as N
};
//# sourceMappingURL=NcDateTimePicker-D9wOztqD.chunk.mjs.map
