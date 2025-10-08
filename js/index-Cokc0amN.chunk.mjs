const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { y as getLanguage, af as getPlural, t as translate, a as translatePlural, l as loadState, I as getDefaultExportFromCjs, ag as getLocale, D as process$1, ae as getCanonicalLocale, ah as logger, U as pathBrowserifyExports } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
/*!
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
class GettextBuilder {
  debug = false;
  language = "en";
  translations = {};
  setLanguage(language) {
    this.language = language;
    return this;
  }
  /**
   * Try to detect locale from context with `en` as fallback value
   * This only works within a Nextcloud page context.
   *
   * @deprecated use `detectLanguage` instead.
   */
  detectLocale() {
    return this.detectLanguage();
  }
  /**
   * Try to detect locale from context with `en` as fallback value.
   * This only works within a Nextcloud page context.
   */
  detectLanguage() {
    return this.setLanguage(getLanguage().replace("-", "_"));
  }
  addTranslation(language, data) {
    this.translations[language] = data;
    return this;
  }
  enableDebugMode() {
    this.debug = true;
    return this;
  }
  build() {
    if (this.debug) {
      console.debug(`Creating gettext instance for language ${this.language}`);
    }
    const translations2 = Object.values(this.translations[this.language]?.translations[""] ?? {}).map(({ msgid, msgid_plural: msgidPlural, msgstr }) => {
      if (msgidPlural !== void 0) {
        return [`_${msgid}_::_${msgidPlural}_`, msgstr];
      }
      return [msgid, msgstr[0]];
    });
    const bundle = {
      pluralFunction: (n) => getPlural(n, this.language),
      translations: Object.fromEntries(translations2)
    };
    return new GettextWrapper(bundle);
  }
}
class GettextWrapper {
  constructor(bundle) {
    this.bundle = bundle;
  }
  /**
   * Get translated string (singular form), optionally with placeholders
   *
   * @param original original string to translate
   * @param placeholders map of placeholder key to value
   */
  gettext(original, placeholders = {}) {
    return translate("", original, placeholders, void 0, { bundle: this.bundle });
  }
  /**
   * Get translated string with plural forms
   *
   * @param singular Singular text form
   * @param plural Plural text form to be used if `count` requires it
   * @param count The number to insert into the text
   * @param placeholders optional map of placeholder key to value
   */
  ngettext(singular, plural, count, placeholders = {}) {
    return translatePlural("", singular, plural, count, placeholders, { bundle: this.bundle });
  }
}
function getGettextBuilder() {
  return new GettextBuilder();
}
function e() {
  try {
    return loadState("core", "capabilities");
  } catch {
    return console.debug("Could not find capabilities initial state fall back to _oc_capabilities"), "_oc_capabilities" in window ? window._oc_capabilities : {};
  }
}
function commonjsRequire(path) {
  throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var momentWithLocales$1 = { exports: {} };
var momentWithLocales = momentWithLocales$1.exports;
var hasRequiredMomentWithLocales;
function requireMomentWithLocales() {
  if (hasRequiredMomentWithLocales) return momentWithLocales$1.exports;
  hasRequiredMomentWithLocales = 1;
  (function(module, exports) {
    (function(global, factory) {
      module.exports = factory();
    })(momentWithLocales, function() {
      var hookCallback;
      function hooks() {
        return hookCallback.apply(null, arguments);
      }
      function setHookCallback(callback) {
        hookCallback = callback;
      }
      function isArray(input) {
        return input instanceof Array || Object.prototype.toString.call(input) === "[object Array]";
      }
      function isObject(input) {
        return input != null && Object.prototype.toString.call(input) === "[object Object]";
      }
      function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
      }
      function isObjectEmpty(obj) {
        if (Object.getOwnPropertyNames) {
          return Object.getOwnPropertyNames(obj).length === 0;
        } else {
          var k;
          for (k in obj) {
            if (hasOwnProp(obj, k)) {
              return false;
            }
          }
          return true;
        }
      }
      function isUndefined(input) {
        return input === void 0;
      }
      function isNumber(input) {
        return typeof input === "number" || Object.prototype.toString.call(input) === "[object Number]";
      }
      function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === "[object Date]";
      }
      function map(arr, fn) {
        var res = [], i, arrLen = arr.length;
        for (i = 0; i < arrLen; ++i) {
          res.push(fn(arr[i], i));
        }
        return res;
      }
      function extend(a, b) {
        for (var i in b) {
          if (hasOwnProp(b, i)) {
            a[i] = b[i];
          }
        }
        if (hasOwnProp(b, "toString")) {
          a.toString = b.toString;
        }
        if (hasOwnProp(b, "valueOf")) {
          a.valueOf = b.valueOf;
        }
        return a;
      }
      function createUTC(input, format2, locale3, strict) {
        return createLocalOrUTC(input, format2, locale3, strict, true).utc();
      }
      function defaultParsingFlags() {
        return {
          empty: false,
          unusedTokens: [],
          unusedInput: [],
          overflow: -2,
          charsLeftOver: 0,
          nullInput: false,
          invalidEra: null,
          invalidMonth: null,
          invalidFormat: false,
          userInvalidated: false,
          iso: false,
          parsedDateParts: [],
          era: null,
          meridiem: null,
          rfc2822: false,
          weekdayMismatch: false
        };
      }
      function getParsingFlags(m) {
        if (m._pf == null) {
          m._pf = defaultParsingFlags();
        }
        return m._pf;
      }
      var some;
      if (Array.prototype.some) {
        some = Array.prototype.some;
      } else {
        some = function(fun) {
          var t = Object(this), len = t.length >>> 0, i;
          for (i = 0; i < len; i++) {
            if (i in t && fun.call(this, t[i], i, t)) {
              return true;
            }
          }
          return false;
        };
      }
      function isValid(m) {
        var flags = null, parsedParts = false, isNowValid = m._d && !isNaN(m._d.getTime());
        if (isNowValid) {
          flags = getParsingFlags(m);
          parsedParts = some.call(flags.parsedDateParts, function(i) {
            return i != null;
          });
          isNowValid = flags.overflow < 0 && !flags.empty && !flags.invalidEra && !flags.invalidMonth && !flags.invalidWeekday && !flags.weekdayMismatch && !flags.nullInput && !flags.invalidFormat && !flags.userInvalidated && (!flags.meridiem || flags.meridiem && parsedParts);
          if (m._strict) {
            isNowValid = isNowValid && flags.charsLeftOver === 0 && flags.unusedTokens.length === 0 && flags.bigHour === void 0;
          }
        }
        if (Object.isFrozen == null || !Object.isFrozen(m)) {
          m._isValid = isNowValid;
        } else {
          return isNowValid;
        }
        return m._isValid;
      }
      function createInvalid(flags) {
        var m = createUTC(NaN);
        if (flags != null) {
          extend(getParsingFlags(m), flags);
        } else {
          getParsingFlags(m).userInvalidated = true;
        }
        return m;
      }
      var momentProperties = hooks.momentProperties = [], updateInProgress = false;
      function copyConfig(to2, from2) {
        var i, prop, val, momentPropertiesLen = momentProperties.length;
        if (!isUndefined(from2._isAMomentObject)) {
          to2._isAMomentObject = from2._isAMomentObject;
        }
        if (!isUndefined(from2._i)) {
          to2._i = from2._i;
        }
        if (!isUndefined(from2._f)) {
          to2._f = from2._f;
        }
        if (!isUndefined(from2._l)) {
          to2._l = from2._l;
        }
        if (!isUndefined(from2._strict)) {
          to2._strict = from2._strict;
        }
        if (!isUndefined(from2._tzm)) {
          to2._tzm = from2._tzm;
        }
        if (!isUndefined(from2._isUTC)) {
          to2._isUTC = from2._isUTC;
        }
        if (!isUndefined(from2._offset)) {
          to2._offset = from2._offset;
        }
        if (!isUndefined(from2._pf)) {
          to2._pf = getParsingFlags(from2);
        }
        if (!isUndefined(from2._locale)) {
          to2._locale = from2._locale;
        }
        if (momentPropertiesLen > 0) {
          for (i = 0; i < momentPropertiesLen; i++) {
            prop = momentProperties[i];
            val = from2[prop];
            if (!isUndefined(val)) {
              to2[prop] = val;
            }
          }
        }
        return to2;
      }
      function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        if (!this.isValid()) {
          this._d = /* @__PURE__ */ new Date(NaN);
        }
        if (updateInProgress === false) {
          updateInProgress = true;
          hooks.updateOffset(this);
          updateInProgress = false;
        }
      }
      function isMoment(obj) {
        return obj instanceof Moment || obj != null && obj._isAMomentObject != null;
      }
      function warn(msg) {
        if (hooks.suppressDeprecationWarnings === false && typeof console !== "undefined" && console.warn) {
          console.warn("Deprecation warning: " + msg);
        }
      }
      function deprecate(msg, fn) {
        var firstTime = true;
        return extend(function() {
          if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(null, msg);
          }
          if (firstTime) {
            var args = [], arg, i, key, argLen = arguments.length;
            for (i = 0; i < argLen; i++) {
              arg = "";
              if (typeof arguments[i] === "object") {
                arg += "\n[" + i + "] ";
                for (key in arguments[0]) {
                  if (hasOwnProp(arguments[0], key)) {
                    arg += key + ": " + arguments[0][key] + ", ";
                  }
                }
                arg = arg.slice(0, -2);
              } else {
                arg = arguments[i];
              }
              args.push(arg);
            }
            warn(
              msg + "\nArguments: " + Array.prototype.slice.call(args).join("") + "\n" + new Error().stack
            );
            firstTime = false;
          }
          return fn.apply(this, arguments);
        }, fn);
      }
      var deprecations = {};
      function deprecateSimple(name, msg) {
        if (hooks.deprecationHandler != null) {
          hooks.deprecationHandler(name, msg);
        }
        if (!deprecations[name]) {
          warn(msg);
          deprecations[name] = true;
        }
      }
      hooks.suppressDeprecationWarnings = false;
      hooks.deprecationHandler = null;
      function isFunction(input) {
        return typeof Function !== "undefined" && input instanceof Function || Object.prototype.toString.call(input) === "[object Function]";
      }
      function set(config) {
        var prop, i;
        for (i in config) {
          if (hasOwnProp(config, i)) {
            prop = config[i];
            if (isFunction(prop)) {
              this[i] = prop;
            } else {
              this["_" + i] = prop;
            }
          }
        }
        this._config = config;
        this._dayOfMonthOrdinalParseLenient = new RegExp(
          (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + "|" + /\d{1,2}/.source
        );
      }
      function mergeConfigs(parentConfig, childConfig) {
        var res = extend({}, parentConfig), prop;
        for (prop in childConfig) {
          if (hasOwnProp(childConfig, prop)) {
            if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
              res[prop] = {};
              extend(res[prop], parentConfig[prop]);
              extend(res[prop], childConfig[prop]);
            } else if (childConfig[prop] != null) {
              res[prop] = childConfig[prop];
            } else {
              delete res[prop];
            }
          }
        }
        for (prop in parentConfig) {
          if (hasOwnProp(parentConfig, prop) && !hasOwnProp(childConfig, prop) && isObject(parentConfig[prop])) {
            res[prop] = extend({}, res[prop]);
          }
        }
        return res;
      }
      function Locale(config) {
        if (config != null) {
          this.set(config);
        }
      }
      var keys;
      if (Object.keys) {
        keys = Object.keys;
      } else {
        keys = function(obj) {
          var i, res = [];
          for (i in obj) {
            if (hasOwnProp(obj, i)) {
              res.push(i);
            }
          }
          return res;
        };
      }
      var defaultCalendar = {
        sameDay: "[Today at] LT",
        nextDay: "[Tomorrow at] LT",
        nextWeek: "dddd [at] LT",
        lastDay: "[Yesterday at] LT",
        lastWeek: "[Last] dddd [at] LT",
        sameElse: "L"
      };
      function calendar(key, mom, now2) {
        var output = this._calendar[key] || this._calendar["sameElse"];
        return isFunction(output) ? output.call(mom, now2) : output;
      }
      function zeroFill(number, targetLength, forceSign) {
        var absNumber = "" + Math.abs(number), zerosToFill = targetLength - absNumber.length, sign2 = number >= 0;
        return (sign2 ? forceSign ? "+" : "" : "-") + Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
      }
      var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g, localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, formatFunctions = {}, formatTokenFunctions = {};
      function addFormatToken(token2, padded, ordinal2, callback) {
        var func = callback;
        if (typeof callback === "string") {
          func = function() {
            return this[callback]();
          };
        }
        if (token2) {
          formatTokenFunctions[token2] = func;
        }
        if (padded) {
          formatTokenFunctions[padded[0]] = function() {
            return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
          };
        }
        if (ordinal2) {
          formatTokenFunctions[ordinal2] = function() {
            return this.localeData().ordinal(
              func.apply(this, arguments),
              token2
            );
          };
        }
      }
      function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
          return input.replace(/^\[|\]$/g, "");
        }
        return input.replace(/\\/g, "");
      }
      function makeFormatFunction(format2) {
        var array = format2.match(formattingTokens), i, length;
        for (i = 0, length = array.length; i < length; i++) {
          if (formatTokenFunctions[array[i]]) {
            array[i] = formatTokenFunctions[array[i]];
          } else {
            array[i] = removeFormattingTokens(array[i]);
          }
        }
        return function(mom) {
          var output = "", i2;
          for (i2 = 0; i2 < length; i2++) {
            output += isFunction(array[i2]) ? array[i2].call(mom, format2) : array[i2];
          }
          return output;
        };
      }
      function formatMoment(m, format2) {
        if (!m.isValid()) {
          return m.localeData().invalidDate();
        }
        format2 = expandFormat(format2, m.localeData());
        formatFunctions[format2] = formatFunctions[format2] || makeFormatFunction(format2);
        return formatFunctions[format2](m);
      }
      function expandFormat(format2, locale3) {
        var i = 5;
        function replaceLongDateFormatTokens(input) {
          return locale3.longDateFormat(input) || input;
        }
        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format2)) {
          format2 = format2.replace(
            localFormattingTokens,
            replaceLongDateFormatTokens
          );
          localFormattingTokens.lastIndex = 0;
          i -= 1;
        }
        return format2;
      }
      var defaultLongDateFormat = {
        LTS: "h:mm:ss A",
        LT: "h:mm A",
        L: "MM/DD/YYYY",
        LL: "MMMM D, YYYY",
        LLL: "MMMM D, YYYY h:mm A",
        LLLL: "dddd, MMMM D, YYYY h:mm A"
      };
      function longDateFormat(key) {
        var format2 = this._longDateFormat[key], formatUpper = this._longDateFormat[key.toUpperCase()];
        if (format2 || !formatUpper) {
          return format2;
        }
        this._longDateFormat[key] = formatUpper.match(formattingTokens).map(function(tok) {
          if (tok === "MMMM" || tok === "MM" || tok === "DD" || tok === "dddd") {
            return tok.slice(1);
          }
          return tok;
        }).join("");
        return this._longDateFormat[key];
      }
      var defaultInvalidDate = "Invalid date";
      function invalidDate() {
        return this._invalidDate;
      }
      var defaultOrdinal = "%d", defaultDayOfMonthOrdinalParse = /\d{1,2}/;
      function ordinal(number) {
        return this._ordinal.replace("%d", number);
      }
      var defaultRelativeTime = {
        future: "in %s",
        past: "%s ago",
        s: "a few seconds",
        ss: "%d seconds",
        m: "a minute",
        mm: "%d minutes",
        h: "an hour",
        hh: "%d hours",
        d: "a day",
        dd: "%d days",
        w: "a week",
        ww: "%d weeks",
        M: "a month",
        MM: "%d months",
        y: "a year",
        yy: "%d years"
      };
      function relativeTime(number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return isFunction(output) ? output(number, withoutSuffix, string, isFuture) : output.replace(/%d/i, number);
      }
      function pastFuture(diff2, output) {
        var format2 = this._relativeTime[diff2 > 0 ? "future" : "past"];
        return isFunction(format2) ? format2(output) : format2.replace(/%s/i, output);
      }
      var aliases = {
        D: "date",
        dates: "date",
        date: "date",
        d: "day",
        days: "day",
        day: "day",
        e: "weekday",
        weekdays: "weekday",
        weekday: "weekday",
        E: "isoWeekday",
        isoweekdays: "isoWeekday",
        isoweekday: "isoWeekday",
        DDD: "dayOfYear",
        dayofyears: "dayOfYear",
        dayofyear: "dayOfYear",
        h: "hour",
        hours: "hour",
        hour: "hour",
        ms: "millisecond",
        milliseconds: "millisecond",
        millisecond: "millisecond",
        m: "minute",
        minutes: "minute",
        minute: "minute",
        M: "month",
        months: "month",
        month: "month",
        Q: "quarter",
        quarters: "quarter",
        quarter: "quarter",
        s: "second",
        seconds: "second",
        second: "second",
        gg: "weekYear",
        weekyears: "weekYear",
        weekyear: "weekYear",
        GG: "isoWeekYear",
        isoweekyears: "isoWeekYear",
        isoweekyear: "isoWeekYear",
        w: "week",
        weeks: "week",
        week: "week",
        W: "isoWeek",
        isoweeks: "isoWeek",
        isoweek: "isoWeek",
        y: "year",
        years: "year",
        year: "year"
      };
      function normalizeUnits(units2) {
        return typeof units2 === "string" ? aliases[units2] || aliases[units2.toLowerCase()] : void 0;
      }
      function normalizeObjectUnits(inputObject) {
        var normalizedInput = {}, normalizedProp, prop;
        for (prop in inputObject) {
          if (hasOwnProp(inputObject, prop)) {
            normalizedProp = normalizeUnits(prop);
            if (normalizedProp) {
              normalizedInput[normalizedProp] = inputObject[prop];
            }
          }
        }
        return normalizedInput;
      }
      var priorities = {
        date: 9,
        day: 11,
        weekday: 11,
        isoWeekday: 11,
        dayOfYear: 4,
        hour: 13,
        millisecond: 16,
        minute: 14,
        month: 8,
        quarter: 7,
        second: 15,
        weekYear: 1,
        isoWeekYear: 1,
        week: 5,
        isoWeek: 5,
        year: 1
      };
      function getPrioritizedUnits(unitsObj) {
        var units2 = [], u;
        for (u in unitsObj) {
          if (hasOwnProp(unitsObj, u)) {
            units2.push({ unit: u, priority: priorities[u] });
          }
        }
        units2.sort(function(a, b) {
          return a.priority - b.priority;
        });
        return units2;
      }
      var match1 = /\d/, match2 = /\d\d/, match3 = /\d{3}/, match4 = /\d{4}/, match6 = /[+-]?\d{6}/, match1to2 = /\d\d?/, match3to4 = /\d\d\d\d?/, match5to6 = /\d\d\d\d\d\d?/, match1to3 = /\d{1,3}/, match1to4 = /\d{1,4}/, match1to6 = /[+-]?\d{1,6}/, matchUnsigned = /\d+/, matchSigned = /[+-]?\d+/, matchOffset = /Z|[+-]\d\d:?\d\d/gi, matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi, matchTimestamp = /[+-]?\d+(\.\d{1,3})?/, matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i, match1to2NoLeadingZero = /^[1-9]\d?/, match1to2HasZero = /^([1-9]\d|\d)/, regexes;
      regexes = {};
      function addRegexToken(token2, regex, strictRegex) {
        regexes[token2] = isFunction(regex) ? regex : function(isStrict, localeData2) {
          return isStrict && strictRegex ? strictRegex : regex;
        };
      }
      function getParseRegexForToken(token2, config) {
        if (!hasOwnProp(regexes, token2)) {
          return new RegExp(unescapeFormat(token2));
        }
        return regexes[token2](config._strict, config._locale);
      }
      function unescapeFormat(s) {
        return regexEscape(
          s.replace("\\", "").replace(
            /\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,
            function(matched, p1, p2, p3, p4) {
              return p1 || p2 || p3 || p4;
            }
          )
        );
      }
      function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      }
      function absFloor(number) {
        if (number < 0) {
          return Math.ceil(number) || 0;
        } else {
          return Math.floor(number);
        }
      }
      function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion, value = 0;
        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
          value = absFloor(coercedNumber);
        }
        return value;
      }
      var tokens = {};
      function addParseToken(token2, callback) {
        var i, func = callback, tokenLen;
        if (typeof token2 === "string") {
          token2 = [token2];
        }
        if (isNumber(callback)) {
          func = function(input, array) {
            array[callback] = toInt(input);
          };
        }
        tokenLen = token2.length;
        for (i = 0; i < tokenLen; i++) {
          tokens[token2[i]] = func;
        }
      }
      function addWeekParseToken(token2, callback) {
        addParseToken(token2, function(input, array, config, token3) {
          config._w = config._w || {};
          callback(input, config._w, config, token3);
        });
      }
      function addTimeToArrayFromToken(token2, input, config) {
        if (input != null && hasOwnProp(tokens, token2)) {
          tokens[token2](input, config._a, config, token2);
        }
      }
      function isLeapYear(year) {
        return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
      }
      var YEAR = 0, MONTH = 1, DATE = 2, HOUR = 3, MINUTE = 4, SECOND = 5, MILLISECOND = 6, WEEK = 7, WEEKDAY = 8;
      addFormatToken("Y", 0, 0, function() {
        var y = this.year();
        return y <= 9999 ? zeroFill(y, 4) : "+" + y;
      });
      addFormatToken(0, ["YY", 2], 0, function() {
        return this.year() % 100;
      });
      addFormatToken(0, ["YYYY", 4], 0, "year");
      addFormatToken(0, ["YYYYY", 5], 0, "year");
      addFormatToken(0, ["YYYYYY", 6, true], 0, "year");
      addRegexToken("Y", matchSigned);
      addRegexToken("YY", match1to2, match2);
      addRegexToken("YYYY", match1to4, match4);
      addRegexToken("YYYYY", match1to6, match6);
      addRegexToken("YYYYYY", match1to6, match6);
      addParseToken(["YYYYY", "YYYYYY"], YEAR);
      addParseToken("YYYY", function(input, array) {
        array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
      });
      addParseToken("YY", function(input, array) {
        array[YEAR] = hooks.parseTwoDigitYear(input);
      });
      addParseToken("Y", function(input, array) {
        array[YEAR] = parseInt(input, 10);
      });
      function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
      }
      hooks.parseTwoDigitYear = function(input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2e3);
      };
      var getSetYear = makeGetSet("FullYear", true);
      function getIsLeapYear() {
        return isLeapYear(this.year());
      }
      function makeGetSet(unit, keepTime) {
        return function(value) {
          if (value != null) {
            set$1(this, unit, value);
            hooks.updateOffset(this, keepTime);
            return this;
          } else {
            return get(this, unit);
          }
        };
      }
      function get(mom, unit) {
        if (!mom.isValid()) {
          return NaN;
        }
        var d = mom._d, isUTC = mom._isUTC;
        switch (unit) {
          case "Milliseconds":
            return isUTC ? d.getUTCMilliseconds() : d.getMilliseconds();
          case "Seconds":
            return isUTC ? d.getUTCSeconds() : d.getSeconds();
          case "Minutes":
            return isUTC ? d.getUTCMinutes() : d.getMinutes();
          case "Hours":
            return isUTC ? d.getUTCHours() : d.getHours();
          case "Date":
            return isUTC ? d.getUTCDate() : d.getDate();
          case "Day":
            return isUTC ? d.getUTCDay() : d.getDay();
          case "Month":
            return isUTC ? d.getUTCMonth() : d.getMonth();
          case "FullYear":
            return isUTC ? d.getUTCFullYear() : d.getFullYear();
          default:
            return NaN;
        }
      }
      function set$1(mom, unit, value) {
        var d, isUTC, year, month, date;
        if (!mom.isValid() || isNaN(value)) {
          return;
        }
        d = mom._d;
        isUTC = mom._isUTC;
        switch (unit) {
          case "Milliseconds":
            return void (isUTC ? d.setUTCMilliseconds(value) : d.setMilliseconds(value));
          case "Seconds":
            return void (isUTC ? d.setUTCSeconds(value) : d.setSeconds(value));
          case "Minutes":
            return void (isUTC ? d.setUTCMinutes(value) : d.setMinutes(value));
          case "Hours":
            return void (isUTC ? d.setUTCHours(value) : d.setHours(value));
          case "Date":
            return void (isUTC ? d.setUTCDate(value) : d.setDate(value));
          // case 'Day': // Not real
          //    return void (isUTC ? d.setUTCDay(value) : d.setDay(value));
          // case 'Month': // Not used because we need to pass two variables
          //     return void (isUTC ? d.setUTCMonth(value) : d.setMonth(value));
          case "FullYear":
            break;
          // See below ...
          default:
            return;
        }
        year = value;
        month = mom.month();
        date = mom.date();
        date = date === 29 && month === 1 && !isLeapYear(year) ? 28 : date;
        void (isUTC ? d.setUTCFullYear(year, month, date) : d.setFullYear(year, month, date));
      }
      function stringGet(units2) {
        units2 = normalizeUnits(units2);
        if (isFunction(this[units2])) {
          return this[units2]();
        }
        return this;
      }
      function stringSet(units2, value) {
        if (typeof units2 === "object") {
          units2 = normalizeObjectUnits(units2);
          var prioritized = getPrioritizedUnits(units2), i, prioritizedLen = prioritized.length;
          for (i = 0; i < prioritizedLen; i++) {
            this[prioritized[i].unit](units2[prioritized[i].unit]);
          }
        } else {
          units2 = normalizeUnits(units2);
          if (isFunction(this[units2])) {
            return this[units2](value);
          }
        }
        return this;
      }
      function mod(n, x) {
        return (n % x + x) % x;
      }
      var indexOf;
      if (Array.prototype.indexOf) {
        indexOf = Array.prototype.indexOf;
      } else {
        indexOf = function(o) {
          var i;
          for (i = 0; i < this.length; ++i) {
            if (this[i] === o) {
              return i;
            }
          }
          return -1;
        };
      }
      function daysInMonth(year, month) {
        if (isNaN(year) || isNaN(month)) {
          return NaN;
        }
        var modMonth = mod(month, 12);
        year += (month - modMonth) / 12;
        return modMonth === 1 ? isLeapYear(year) ? 29 : 28 : 31 - modMonth % 7 % 2;
      }
      addFormatToken("M", ["MM", 2], "Mo", function() {
        return this.month() + 1;
      });
      addFormatToken("MMM", 0, 0, function(format2) {
        return this.localeData().monthsShort(this, format2);
      });
      addFormatToken("MMMM", 0, 0, function(format2) {
        return this.localeData().months(this, format2);
      });
      addRegexToken("M", match1to2, match1to2NoLeadingZero);
      addRegexToken("MM", match1to2, match2);
      addRegexToken("MMM", function(isStrict, locale3) {
        return locale3.monthsShortRegex(isStrict);
      });
      addRegexToken("MMMM", function(isStrict, locale3) {
        return locale3.monthsRegex(isStrict);
      });
      addParseToken(["M", "MM"], function(input, array) {
        array[MONTH] = toInt(input) - 1;
      });
      addParseToken(["MMM", "MMMM"], function(input, array, config, token2) {
        var month = config._locale.monthsParse(input, token2, config._strict);
        if (month != null) {
          array[MONTH] = month;
        } else {
          getParsingFlags(config).invalidMonth = input;
        }
      });
      var defaultLocaleMonths = "January_February_March_April_May_June_July_August_September_October_November_December".split(
        "_"
      ), defaultLocaleMonthsShort = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"), MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/, defaultMonthsShortRegex = matchWord, defaultMonthsRegex = matchWord;
      function localeMonths(m, format2) {
        if (!m) {
          return isArray(this._months) ? this._months : this._months["standalone"];
        }
        return isArray(this._months) ? this._months[m.month()] : this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format2) ? "format" : "standalone"][m.month()];
      }
      function localeMonthsShort(m, format2) {
        if (!m) {
          return isArray(this._monthsShort) ? this._monthsShort : this._monthsShort["standalone"];
        }
        return isArray(this._monthsShort) ? this._monthsShort[m.month()] : this._monthsShort[MONTHS_IN_FORMAT.test(format2) ? "format" : "standalone"][m.month()];
      }
      function handleStrictParse(monthName, format2, strict) {
        var i, ii, mom, llc = monthName.toLocaleLowerCase();
        if (!this._monthsParse) {
          this._monthsParse = [];
          this._longMonthsParse = [];
          this._shortMonthsParse = [];
          for (i = 0; i < 12; ++i) {
            mom = createUTC([2e3, i]);
            this._shortMonthsParse[i] = this.monthsShort(
              mom,
              ""
            ).toLocaleLowerCase();
            this._longMonthsParse[i] = this.months(mom, "").toLocaleLowerCase();
          }
        }
        if (strict) {
          if (format2 === "MMM") {
            ii = indexOf.call(this._shortMonthsParse, llc);
            return ii !== -1 ? ii : null;
          } else {
            ii = indexOf.call(this._longMonthsParse, llc);
            return ii !== -1 ? ii : null;
          }
        } else {
          if (format2 === "MMM") {
            ii = indexOf.call(this._shortMonthsParse, llc);
            if (ii !== -1) {
              return ii;
            }
            ii = indexOf.call(this._longMonthsParse, llc);
            return ii !== -1 ? ii : null;
          } else {
            ii = indexOf.call(this._longMonthsParse, llc);
            if (ii !== -1) {
              return ii;
            }
            ii = indexOf.call(this._shortMonthsParse, llc);
            return ii !== -1 ? ii : null;
          }
        }
      }
      function localeMonthsParse(monthName, format2, strict) {
        var i, mom, regex;
        if (this._monthsParseExact) {
          return handleStrictParse.call(this, monthName, format2, strict);
        }
        if (!this._monthsParse) {
          this._monthsParse = [];
          this._longMonthsParse = [];
          this._shortMonthsParse = [];
        }
        for (i = 0; i < 12; i++) {
          mom = createUTC([2e3, i]);
          if (strict && !this._longMonthsParse[i]) {
            this._longMonthsParse[i] = new RegExp(
              "^" + this.months(mom, "").replace(".", "") + "$",
              "i"
            );
            this._shortMonthsParse[i] = new RegExp(
              "^" + this.monthsShort(mom, "").replace(".", "") + "$",
              "i"
            );
          }
          if (!strict && !this._monthsParse[i]) {
            regex = "^" + this.months(mom, "") + "|^" + this.monthsShort(mom, "");
            this._monthsParse[i] = new RegExp(regex.replace(".", ""), "i");
          }
          if (strict && format2 === "MMMM" && this._longMonthsParse[i].test(monthName)) {
            return i;
          } else if (strict && format2 === "MMM" && this._shortMonthsParse[i].test(monthName)) {
            return i;
          } else if (!strict && this._monthsParse[i].test(monthName)) {
            return i;
          }
        }
      }
      function setMonth(mom, value) {
        if (!mom.isValid()) {
          return mom;
        }
        if (typeof value === "string") {
          if (/^\d+$/.test(value)) {
            value = toInt(value);
          } else {
            value = mom.localeData().monthsParse(value);
            if (!isNumber(value)) {
              return mom;
            }
          }
        }
        var month = value, date = mom.date();
        date = date < 29 ? date : Math.min(date, daysInMonth(mom.year(), month));
        void (mom._isUTC ? mom._d.setUTCMonth(month, date) : mom._d.setMonth(month, date));
        return mom;
      }
      function getSetMonth(value) {
        if (value != null) {
          setMonth(this, value);
          hooks.updateOffset(this, true);
          return this;
        } else {
          return get(this, "Month");
        }
      }
      function getDaysInMonth() {
        return daysInMonth(this.year(), this.month());
      }
      function monthsShortRegex(isStrict) {
        if (this._monthsParseExact) {
          if (!hasOwnProp(this, "_monthsRegex")) {
            computeMonthsParse.call(this);
          }
          if (isStrict) {
            return this._monthsShortStrictRegex;
          } else {
            return this._monthsShortRegex;
          }
        } else {
          if (!hasOwnProp(this, "_monthsShortRegex")) {
            this._monthsShortRegex = defaultMonthsShortRegex;
          }
          return this._monthsShortStrictRegex && isStrict ? this._monthsShortStrictRegex : this._monthsShortRegex;
        }
      }
      function monthsRegex(isStrict) {
        if (this._monthsParseExact) {
          if (!hasOwnProp(this, "_monthsRegex")) {
            computeMonthsParse.call(this);
          }
          if (isStrict) {
            return this._monthsStrictRegex;
          } else {
            return this._monthsRegex;
          }
        } else {
          if (!hasOwnProp(this, "_monthsRegex")) {
            this._monthsRegex = defaultMonthsRegex;
          }
          return this._monthsStrictRegex && isStrict ? this._monthsStrictRegex : this._monthsRegex;
        }
      }
      function computeMonthsParse() {
        function cmpLenRev(a, b) {
          return b.length - a.length;
        }
        var shortPieces = [], longPieces = [], mixedPieces = [], i, mom, shortP, longP;
        for (i = 0; i < 12; i++) {
          mom = createUTC([2e3, i]);
          shortP = regexEscape(this.monthsShort(mom, ""));
          longP = regexEscape(this.months(mom, ""));
          shortPieces.push(shortP);
          longPieces.push(longP);
          mixedPieces.push(longP);
          mixedPieces.push(shortP);
        }
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        this._monthsRegex = new RegExp("^(" + mixedPieces.join("|") + ")", "i");
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp(
          "^(" + longPieces.join("|") + ")",
          "i"
        );
        this._monthsShortStrictRegex = new RegExp(
          "^(" + shortPieces.join("|") + ")",
          "i"
        );
      }
      function createDate(y, m, d, h, M, s, ms) {
        var date;
        if (y < 100 && y >= 0) {
          date = new Date(y + 400, m, d, h, M, s, ms);
          if (isFinite(date.getFullYear())) {
            date.setFullYear(y);
          }
        } else {
          date = new Date(y, m, d, h, M, s, ms);
        }
        return date;
      }
      function createUTCDate(y) {
        var date, args;
        if (y < 100 && y >= 0) {
          args = Array.prototype.slice.call(arguments);
          args[0] = y + 400;
          date = new Date(Date.UTC.apply(null, args));
          if (isFinite(date.getUTCFullYear())) {
            date.setUTCFullYear(y);
          }
        } else {
          date = new Date(Date.UTC.apply(null, arguments));
        }
        return date;
      }
      function firstWeekOffset(year, dow, doy) {
        var fwd = 7 + dow - doy, fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;
        return -fwdlw + fwd - 1;
      }
      function dayOfYearFromWeeks(year, week2, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7, weekOffset = firstWeekOffset(year, dow, doy), dayOfYear = 1 + 7 * (week2 - 1) + localWeekday + weekOffset, resYear, resDayOfYear;
        if (dayOfYear <= 0) {
          resYear = year - 1;
          resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
          resYear = year + 1;
          resDayOfYear = dayOfYear - daysInYear(year);
        } else {
          resYear = year;
          resDayOfYear = dayOfYear;
        }
        return {
          year: resYear,
          dayOfYear: resDayOfYear
        };
      }
      function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy), week2 = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1, resWeek, resYear;
        if (week2 < 1) {
          resYear = mom.year() - 1;
          resWeek = week2 + weeksInYear(resYear, dow, doy);
        } else if (week2 > weeksInYear(mom.year(), dow, doy)) {
          resWeek = week2 - weeksInYear(mom.year(), dow, doy);
          resYear = mom.year() + 1;
        } else {
          resYear = mom.year();
          resWeek = week2;
        }
        return {
          week: resWeek,
          year: resYear
        };
      }
      function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy), weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
      }
      addFormatToken("w", ["ww", 2], "wo", "week");
      addFormatToken("W", ["WW", 2], "Wo", "isoWeek");
      addRegexToken("w", match1to2, match1to2NoLeadingZero);
      addRegexToken("ww", match1to2, match2);
      addRegexToken("W", match1to2, match1to2NoLeadingZero);
      addRegexToken("WW", match1to2, match2);
      addWeekParseToken(
        ["w", "ww", "W", "WW"],
        function(input, week2, config, token2) {
          week2[token2.substr(0, 1)] = toInt(input);
        }
      );
      function localeWeek(mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
      }
      var defaultLocaleWeek = {
        dow: 0,
        // Sunday is the first day of the week.
        doy: 6
        // The week that contains Jan 6th is the first week of the year.
      };
      function localeFirstDayOfWeek() {
        return this._week.dow;
      }
      function localeFirstDayOfYear() {
        return this._week.doy;
      }
      function getSetWeek(input) {
        var week2 = this.localeData().week(this);
        return input == null ? week2 : this.add((input - week2) * 7, "d");
      }
      function getSetISOWeek(input) {
        var week2 = weekOfYear(this, 1, 4).week;
        return input == null ? week2 : this.add((input - week2) * 7, "d");
      }
      addFormatToken("d", 0, "do", "day");
      addFormatToken("dd", 0, 0, function(format2) {
        return this.localeData().weekdaysMin(this, format2);
      });
      addFormatToken("ddd", 0, 0, function(format2) {
        return this.localeData().weekdaysShort(this, format2);
      });
      addFormatToken("dddd", 0, 0, function(format2) {
        return this.localeData().weekdays(this, format2);
      });
      addFormatToken("e", 0, 0, "weekday");
      addFormatToken("E", 0, 0, "isoWeekday");
      addRegexToken("d", match1to2);
      addRegexToken("e", match1to2);
      addRegexToken("E", match1to2);
      addRegexToken("dd", function(isStrict, locale3) {
        return locale3.weekdaysMinRegex(isStrict);
      });
      addRegexToken("ddd", function(isStrict, locale3) {
        return locale3.weekdaysShortRegex(isStrict);
      });
      addRegexToken("dddd", function(isStrict, locale3) {
        return locale3.weekdaysRegex(isStrict);
      });
      addWeekParseToken(["dd", "ddd", "dddd"], function(input, week2, config, token2) {
        var weekday = config._locale.weekdaysParse(input, token2, config._strict);
        if (weekday != null) {
          week2.d = weekday;
        } else {
          getParsingFlags(config).invalidWeekday = input;
        }
      });
      addWeekParseToken(["d", "e", "E"], function(input, week2, config, token2) {
        week2[token2] = toInt(input);
      });
      function parseWeekday(input, locale3) {
        if (typeof input !== "string") {
          return input;
        }
        if (!isNaN(input)) {
          return parseInt(input, 10);
        }
        input = locale3.weekdaysParse(input);
        if (typeof input === "number") {
          return input;
        }
        return null;
      }
      function parseIsoWeekday(input, locale3) {
        if (typeof input === "string") {
          return locale3.weekdaysParse(input) % 7 || 7;
        }
        return isNaN(input) ? null : input;
      }
      function shiftWeekdays(ws, n) {
        return ws.slice(n, 7).concat(ws.slice(0, n));
      }
      var defaultLocaleWeekdays = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), defaultLocaleWeekdaysShort = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"), defaultLocaleWeekdaysMin = "Su_Mo_Tu_We_Th_Fr_Sa".split("_"), defaultWeekdaysRegex = matchWord, defaultWeekdaysShortRegex = matchWord, defaultWeekdaysMinRegex = matchWord;
      function localeWeekdays(m, format2) {
        var weekdays2 = isArray(this._weekdays) ? this._weekdays : this._weekdays[m && m !== true && this._weekdays.isFormat.test(format2) ? "format" : "standalone"];
        return m === true ? shiftWeekdays(weekdays2, this._week.dow) : m ? weekdays2[m.day()] : weekdays2;
      }
      function localeWeekdaysShort(m) {
        return m === true ? shiftWeekdays(this._weekdaysShort, this._week.dow) : m ? this._weekdaysShort[m.day()] : this._weekdaysShort;
      }
      function localeWeekdaysMin(m) {
        return m === true ? shiftWeekdays(this._weekdaysMin, this._week.dow) : m ? this._weekdaysMin[m.day()] : this._weekdaysMin;
      }
      function handleStrictParse$1(weekdayName, format2, strict) {
        var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
        if (!this._weekdaysParse) {
          this._weekdaysParse = [];
          this._shortWeekdaysParse = [];
          this._minWeekdaysParse = [];
          for (i = 0; i < 7; ++i) {
            mom = createUTC([2e3, 1]).day(i);
            this._minWeekdaysParse[i] = this.weekdaysMin(
              mom,
              ""
            ).toLocaleLowerCase();
            this._shortWeekdaysParse[i] = this.weekdaysShort(
              mom,
              ""
            ).toLocaleLowerCase();
            this._weekdaysParse[i] = this.weekdays(mom, "").toLocaleLowerCase();
          }
        }
        if (strict) {
          if (format2 === "dddd") {
            ii = indexOf.call(this._weekdaysParse, llc);
            return ii !== -1 ? ii : null;
          } else if (format2 === "ddd") {
            ii = indexOf.call(this._shortWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
          } else {
            ii = indexOf.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
          }
        } else {
          if (format2 === "dddd") {
            ii = indexOf.call(this._weekdaysParse, llc);
            if (ii !== -1) {
              return ii;
            }
            ii = indexOf.call(this._shortWeekdaysParse, llc);
            if (ii !== -1) {
              return ii;
            }
            ii = indexOf.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
          } else if (format2 === "ddd") {
            ii = indexOf.call(this._shortWeekdaysParse, llc);
            if (ii !== -1) {
              return ii;
            }
            ii = indexOf.call(this._weekdaysParse, llc);
            if (ii !== -1) {
              return ii;
            }
            ii = indexOf.call(this._minWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
          } else {
            ii = indexOf.call(this._minWeekdaysParse, llc);
            if (ii !== -1) {
              return ii;
            }
            ii = indexOf.call(this._weekdaysParse, llc);
            if (ii !== -1) {
              return ii;
            }
            ii = indexOf.call(this._shortWeekdaysParse, llc);
            return ii !== -1 ? ii : null;
          }
        }
      }
      function localeWeekdaysParse(weekdayName, format2, strict) {
        var i, mom, regex;
        if (this._weekdaysParseExact) {
          return handleStrictParse$1.call(this, weekdayName, format2, strict);
        }
        if (!this._weekdaysParse) {
          this._weekdaysParse = [];
          this._minWeekdaysParse = [];
          this._shortWeekdaysParse = [];
          this._fullWeekdaysParse = [];
        }
        for (i = 0; i < 7; i++) {
          mom = createUTC([2e3, 1]).day(i);
          if (strict && !this._fullWeekdaysParse[i]) {
            this._fullWeekdaysParse[i] = new RegExp(
              "^" + this.weekdays(mom, "").replace(".", "\\.?") + "$",
              "i"
            );
            this._shortWeekdaysParse[i] = new RegExp(
              "^" + this.weekdaysShort(mom, "").replace(".", "\\.?") + "$",
              "i"
            );
            this._minWeekdaysParse[i] = new RegExp(
              "^" + this.weekdaysMin(mom, "").replace(".", "\\.?") + "$",
              "i"
            );
          }
          if (!this._weekdaysParse[i]) {
            regex = "^" + this.weekdays(mom, "") + "|^" + this.weekdaysShort(mom, "") + "|^" + this.weekdaysMin(mom, "");
            this._weekdaysParse[i] = new RegExp(regex.replace(".", ""), "i");
          }
          if (strict && format2 === "dddd" && this._fullWeekdaysParse[i].test(weekdayName)) {
            return i;
          } else if (strict && format2 === "ddd" && this._shortWeekdaysParse[i].test(weekdayName)) {
            return i;
          } else if (strict && format2 === "dd" && this._minWeekdaysParse[i].test(weekdayName)) {
            return i;
          } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
            return i;
          }
        }
      }
      function getSetDayOfWeek(input) {
        if (!this.isValid()) {
          return input != null ? this : NaN;
        }
        var day = get(this, "Day");
        if (input != null) {
          input = parseWeekday(input, this.localeData());
          return this.add(input - day, "d");
        } else {
          return day;
        }
      }
      function getSetLocaleDayOfWeek(input) {
        if (!this.isValid()) {
          return input != null ? this : NaN;
        }
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, "d");
      }
      function getSetISODayOfWeek(input) {
        if (!this.isValid()) {
          return input != null ? this : NaN;
        }
        if (input != null) {
          var weekday = parseIsoWeekday(input, this.localeData());
          return this.day(this.day() % 7 ? weekday : weekday - 7);
        } else {
          return this.day() || 7;
        }
      }
      function weekdaysRegex(isStrict) {
        if (this._weekdaysParseExact) {
          if (!hasOwnProp(this, "_weekdaysRegex")) {
            computeWeekdaysParse.call(this);
          }
          if (isStrict) {
            return this._weekdaysStrictRegex;
          } else {
            return this._weekdaysRegex;
          }
        } else {
          if (!hasOwnProp(this, "_weekdaysRegex")) {
            this._weekdaysRegex = defaultWeekdaysRegex;
          }
          return this._weekdaysStrictRegex && isStrict ? this._weekdaysStrictRegex : this._weekdaysRegex;
        }
      }
      function weekdaysShortRegex(isStrict) {
        if (this._weekdaysParseExact) {
          if (!hasOwnProp(this, "_weekdaysRegex")) {
            computeWeekdaysParse.call(this);
          }
          if (isStrict) {
            return this._weekdaysShortStrictRegex;
          } else {
            return this._weekdaysShortRegex;
          }
        } else {
          if (!hasOwnProp(this, "_weekdaysShortRegex")) {
            this._weekdaysShortRegex = defaultWeekdaysShortRegex;
          }
          return this._weekdaysShortStrictRegex && isStrict ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
        }
      }
      function weekdaysMinRegex(isStrict) {
        if (this._weekdaysParseExact) {
          if (!hasOwnProp(this, "_weekdaysRegex")) {
            computeWeekdaysParse.call(this);
          }
          if (isStrict) {
            return this._weekdaysMinStrictRegex;
          } else {
            return this._weekdaysMinRegex;
          }
        } else {
          if (!hasOwnProp(this, "_weekdaysMinRegex")) {
            this._weekdaysMinRegex = defaultWeekdaysMinRegex;
          }
          return this._weekdaysMinStrictRegex && isStrict ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
        }
      }
      function computeWeekdaysParse() {
        function cmpLenRev(a, b) {
          return b.length - a.length;
        }
        var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [], i, mom, minp, shortp, longp;
        for (i = 0; i < 7; i++) {
          mom = createUTC([2e3, 1]).day(i);
          minp = regexEscape(this.weekdaysMin(mom, ""));
          shortp = regexEscape(this.weekdaysShort(mom, ""));
          longp = regexEscape(this.weekdays(mom, ""));
          minPieces.push(minp);
          shortPieces.push(shortp);
          longPieces.push(longp);
          mixedPieces.push(minp);
          mixedPieces.push(shortp);
          mixedPieces.push(longp);
        }
        minPieces.sort(cmpLenRev);
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        this._weekdaysRegex = new RegExp("^(" + mixedPieces.join("|") + ")", "i");
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;
        this._weekdaysStrictRegex = new RegExp(
          "^(" + longPieces.join("|") + ")",
          "i"
        );
        this._weekdaysShortStrictRegex = new RegExp(
          "^(" + shortPieces.join("|") + ")",
          "i"
        );
        this._weekdaysMinStrictRegex = new RegExp(
          "^(" + minPieces.join("|") + ")",
          "i"
        );
      }
      function hFormat() {
        return this.hours() % 12 || 12;
      }
      function kFormat() {
        return this.hours() || 24;
      }
      addFormatToken("H", ["HH", 2], 0, "hour");
      addFormatToken("h", ["hh", 2], 0, hFormat);
      addFormatToken("k", ["kk", 2], 0, kFormat);
      addFormatToken("hmm", 0, 0, function() {
        return "" + hFormat.apply(this) + zeroFill(this.minutes(), 2);
      });
      addFormatToken("hmmss", 0, 0, function() {
        return "" + hFormat.apply(this) + zeroFill(this.minutes(), 2) + zeroFill(this.seconds(), 2);
      });
      addFormatToken("Hmm", 0, 0, function() {
        return "" + this.hours() + zeroFill(this.minutes(), 2);
      });
      addFormatToken("Hmmss", 0, 0, function() {
        return "" + this.hours() + zeroFill(this.minutes(), 2) + zeroFill(this.seconds(), 2);
      });
      function meridiem(token2, lowercase) {
        addFormatToken(token2, 0, 0, function() {
          return this.localeData().meridiem(
            this.hours(),
            this.minutes(),
            lowercase
          );
        });
      }
      meridiem("a", true);
      meridiem("A", false);
      function matchMeridiem(isStrict, locale3) {
        return locale3._meridiemParse;
      }
      addRegexToken("a", matchMeridiem);
      addRegexToken("A", matchMeridiem);
      addRegexToken("H", match1to2, match1to2HasZero);
      addRegexToken("h", match1to2, match1to2NoLeadingZero);
      addRegexToken("k", match1to2, match1to2NoLeadingZero);
      addRegexToken("HH", match1to2, match2);
      addRegexToken("hh", match1to2, match2);
      addRegexToken("kk", match1to2, match2);
      addRegexToken("hmm", match3to4);
      addRegexToken("hmmss", match5to6);
      addRegexToken("Hmm", match3to4);
      addRegexToken("Hmmss", match5to6);
      addParseToken(["H", "HH"], HOUR);
      addParseToken(["k", "kk"], function(input, array, config) {
        var kInput = toInt(input);
        array[HOUR] = kInput === 24 ? 0 : kInput;
      });
      addParseToken(["a", "A"], function(input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
      });
      addParseToken(["h", "hh"], function(input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
      });
      addParseToken("hmm", function(input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
      });
      addParseToken("hmmss", function(input, array, config) {
        var pos1 = input.length - 4, pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
      });
      addParseToken("Hmm", function(input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
      });
      addParseToken("Hmmss", function(input, array, config) {
        var pos1 = input.length - 4, pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
      });
      function localeIsPM(input) {
        return (input + "").toLowerCase().charAt(0) === "p";
      }
      var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i, getSetHour = makeGetSet("Hours", true);
      function localeMeridiem(hours2, minutes2, isLower) {
        if (hours2 > 11) {
          return isLower ? "pm" : "PM";
        } else {
          return isLower ? "am" : "AM";
        }
      }
      var baseConfig = {
        calendar: defaultCalendar,
        longDateFormat: defaultLongDateFormat,
        invalidDate: defaultInvalidDate,
        ordinal: defaultOrdinal,
        dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
        relativeTime: defaultRelativeTime,
        months: defaultLocaleMonths,
        monthsShort: defaultLocaleMonthsShort,
        week: defaultLocaleWeek,
        weekdays: defaultLocaleWeekdays,
        weekdaysMin: defaultLocaleWeekdaysMin,
        weekdaysShort: defaultLocaleWeekdaysShort,
        meridiemParse: defaultLocaleMeridiemParse
      };
      var locales = {}, localeFamilies = {}, globalLocale;
      function commonPrefix(arr1, arr2) {
        var i, minl = Math.min(arr1.length, arr2.length);
        for (i = 0; i < minl; i += 1) {
          if (arr1[i] !== arr2[i]) {
            return i;
          }
        }
        return minl;
      }
      function normalizeLocale(key) {
        return key ? key.toLowerCase().replace("_", "-") : key;
      }
      function chooseLocale(names) {
        var i = 0, j, next, locale3, split;
        while (i < names.length) {
          split = normalizeLocale(names[i]).split("-");
          j = split.length;
          next = normalizeLocale(names[i + 1]);
          next = next ? next.split("-") : null;
          while (j > 0) {
            locale3 = loadLocale(split.slice(0, j).join("-"));
            if (locale3) {
              return locale3;
            }
            if (next && next.length >= j && commonPrefix(split, next) >= j - 1) {
              break;
            }
            j--;
          }
          i++;
        }
        return globalLocale;
      }
      function isLocaleNameSane(name) {
        return !!(name && name.match("^[^/\\\\]*$"));
      }
      function loadLocale(name) {
        var oldLocale = null, aliasedRequire;
        if (locales[name] === void 0 && true && module && module.exports && isLocaleNameSane(name)) {
          try {
            oldLocale = globalLocale._abbr;
            aliasedRequire = commonjsRequire;
            aliasedRequire("./locale/" + name);
            getSetGlobalLocale(oldLocale);
          } catch (e2) {
            locales[name] = null;
          }
        }
        return locales[name];
      }
      function getSetGlobalLocale(key, values) {
        var data;
        if (key) {
          if (isUndefined(values)) {
            data = getLocale2(key);
          } else {
            data = defineLocale(key, values);
          }
          if (data) {
            globalLocale = data;
          } else {
            if (typeof console !== "undefined" && console.warn) {
              console.warn(
                "Locale " + key + " not found. Did you forget to load it?"
              );
            }
          }
        }
        return globalLocale._abbr;
      }
      function defineLocale(name, config) {
        if (config !== null) {
          var locale3, parentConfig = baseConfig;
          config.abbr = name;
          if (locales[name] != null) {
            deprecateSimple(
              "defineLocaleOverride",
              "use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info."
            );
            parentConfig = locales[name]._config;
          } else if (config.parentLocale != null) {
            if (locales[config.parentLocale] != null) {
              parentConfig = locales[config.parentLocale]._config;
            } else {
              locale3 = loadLocale(config.parentLocale);
              if (locale3 != null) {
                parentConfig = locale3._config;
              } else {
                if (!localeFamilies[config.parentLocale]) {
                  localeFamilies[config.parentLocale] = [];
                }
                localeFamilies[config.parentLocale].push({
                  name,
                  config
                });
                return null;
              }
            }
          }
          locales[name] = new Locale(mergeConfigs(parentConfig, config));
          if (localeFamilies[name]) {
            localeFamilies[name].forEach(function(x) {
              defineLocale(x.name, x.config);
            });
          }
          getSetGlobalLocale(name);
          return locales[name];
        } else {
          delete locales[name];
          return null;
        }
      }
      function updateLocale(name, config) {
        if (config != null) {
          var locale3, tmpLocale, parentConfig = baseConfig;
          if (locales[name] != null && locales[name].parentLocale != null) {
            locales[name].set(mergeConfigs(locales[name]._config, config));
          } else {
            tmpLocale = loadLocale(name);
            if (tmpLocale != null) {
              parentConfig = tmpLocale._config;
            }
            config = mergeConfigs(parentConfig, config);
            if (tmpLocale == null) {
              config.abbr = name;
            }
            locale3 = new Locale(config);
            locale3.parentLocale = locales[name];
            locales[name] = locale3;
          }
          getSetGlobalLocale(name);
        } else {
          if (locales[name] != null) {
            if (locales[name].parentLocale != null) {
              locales[name] = locales[name].parentLocale;
              if (name === getSetGlobalLocale()) {
                getSetGlobalLocale(name);
              }
            } else if (locales[name] != null) {
              delete locales[name];
            }
          }
        }
        return locales[name];
      }
      function getLocale2(key) {
        var locale3;
        if (key && key._locale && key._locale._abbr) {
          key = key._locale._abbr;
        }
        if (!key) {
          return globalLocale;
        }
        if (!isArray(key)) {
          locale3 = loadLocale(key);
          if (locale3) {
            return locale3;
          }
          key = [key];
        }
        return chooseLocale(key);
      }
      function listLocales() {
        return keys(locales);
      }
      function checkOverflow(m) {
        var overflow, a = m._a;
        if (a && getParsingFlags(m).overflow === -2) {
          overflow = a[MONTH] < 0 || a[MONTH] > 11 ? MONTH : a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH]) ? DATE : a[HOUR] < 0 || a[HOUR] > 24 || a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0) ? HOUR : a[MINUTE] < 0 || a[MINUTE] > 59 ? MINUTE : a[SECOND] < 0 || a[SECOND] > 59 ? SECOND : a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND : -1;
          if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
            overflow = DATE;
          }
          if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
            overflow = WEEK;
          }
          if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
            overflow = WEEKDAY;
          }
          getParsingFlags(m).overflow = overflow;
        }
        return m;
      }
      var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/, basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/, tzRegex = /Z|[+-]\d\d(?::?\d\d)?/, isoDates = [
        ["YYYYYY-MM-DD", /[+-]\d{6}-\d\d-\d\d/],
        ["YYYY-MM-DD", /\d{4}-\d\d-\d\d/],
        ["GGGG-[W]WW-E", /\d{4}-W\d\d-\d/],
        ["GGGG-[W]WW", /\d{4}-W\d\d/, false],
        ["YYYY-DDD", /\d{4}-\d{3}/],
        ["YYYY-MM", /\d{4}-\d\d/, false],
        ["YYYYYYMMDD", /[+-]\d{10}/],
        ["YYYYMMDD", /\d{8}/],
        ["GGGG[W]WWE", /\d{4}W\d{3}/],
        ["GGGG[W]WW", /\d{4}W\d{2}/, false],
        ["YYYYDDD", /\d{7}/],
        ["YYYYMM", /\d{6}/, false],
        ["YYYY", /\d{4}/, false]
      ], isoTimes = [
        ["HH:mm:ss.SSSS", /\d\d:\d\d:\d\d\.\d+/],
        ["HH:mm:ss,SSSS", /\d\d:\d\d:\d\d,\d+/],
        ["HH:mm:ss", /\d\d:\d\d:\d\d/],
        ["HH:mm", /\d\d:\d\d/],
        ["HHmmss.SSSS", /\d\d\d\d\d\d\.\d+/],
        ["HHmmss,SSSS", /\d\d\d\d\d\d,\d+/],
        ["HHmmss", /\d\d\d\d\d\d/],
        ["HHmm", /\d\d\d\d/],
        ["HH", /\d\d/]
      ], aspNetJsonRegex = /^\/?Date\((-?\d+)/i, rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/, obsOffsets = {
        UT: 0,
        GMT: 0,
        EDT: -4 * 60,
        EST: -5 * 60,
        CDT: -5 * 60,
        CST: -6 * 60,
        MDT: -6 * 60,
        MST: -7 * 60,
        PDT: -7 * 60,
        PST: -8 * 60
      };
      function configFromISO(config) {
        var i, l, string = config._i, match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string), allowTime, dateFormat, timeFormat, tzFormat, isoDatesLen = isoDates.length, isoTimesLen = isoTimes.length;
        if (match) {
          getParsingFlags(config).iso = true;
          for (i = 0, l = isoDatesLen; i < l; i++) {
            if (isoDates[i][1].exec(match[1])) {
              dateFormat = isoDates[i][0];
              allowTime = isoDates[i][2] !== false;
              break;
            }
          }
          if (dateFormat == null) {
            config._isValid = false;
            return;
          }
          if (match[3]) {
            for (i = 0, l = isoTimesLen; i < l; i++) {
              if (isoTimes[i][1].exec(match[3])) {
                timeFormat = (match[2] || " ") + isoTimes[i][0];
                break;
              }
            }
            if (timeFormat == null) {
              config._isValid = false;
              return;
            }
          }
          if (!allowTime && timeFormat != null) {
            config._isValid = false;
            return;
          }
          if (match[4]) {
            if (tzRegex.exec(match[4])) {
              tzFormat = "Z";
            } else {
              config._isValid = false;
              return;
            }
          }
          config._f = dateFormat + (timeFormat || "") + (tzFormat || "");
          configFromStringAndFormat(config);
        } else {
          config._isValid = false;
        }
      }
      function extractFromRFC2822Strings(yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
        var result = [
          untruncateYear(yearStr),
          defaultLocaleMonthsShort.indexOf(monthStr),
          parseInt(dayStr, 10),
          parseInt(hourStr, 10),
          parseInt(minuteStr, 10)
        ];
        if (secondStr) {
          result.push(parseInt(secondStr, 10));
        }
        return result;
      }
      function untruncateYear(yearStr) {
        var year = parseInt(yearStr, 10);
        if (year <= 49) {
          return 2e3 + year;
        } else if (year <= 999) {
          return 1900 + year;
        }
        return year;
      }
      function preprocessRFC2822(s) {
        return s.replace(/\([^()]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").replace(/^\s\s*/, "").replace(/\s\s*$/, "");
      }
      function checkWeekday(weekdayStr, parsedInput, config) {
        if (weekdayStr) {
          var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr), weekdayActual = new Date(
            parsedInput[0],
            parsedInput[1],
            parsedInput[2]
          ).getDay();
          if (weekdayProvided !== weekdayActual) {
            getParsingFlags(config).weekdayMismatch = true;
            config._isValid = false;
            return false;
          }
        }
        return true;
      }
      function calculateOffset(obsOffset, militaryOffset, numOffset) {
        if (obsOffset) {
          return obsOffsets[obsOffset];
        } else if (militaryOffset) {
          return 0;
        } else {
          var hm = parseInt(numOffset, 10), m = hm % 100, h = (hm - m) / 100;
          return h * 60 + m;
        }
      }
      function configFromRFC2822(config) {
        var match = rfc2822.exec(preprocessRFC2822(config._i)), parsedArray;
        if (match) {
          parsedArray = extractFromRFC2822Strings(
            match[4],
            match[3],
            match[2],
            match[5],
            match[6],
            match[7]
          );
          if (!checkWeekday(match[1], parsedArray, config)) {
            return;
          }
          config._a = parsedArray;
          config._tzm = calculateOffset(match[8], match[9], match[10]);
          config._d = createUTCDate.apply(null, config._a);
          config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
          getParsingFlags(config).rfc2822 = true;
        } else {
          config._isValid = false;
        }
      }
      function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);
        if (matched !== null) {
          config._d = /* @__PURE__ */ new Date(+matched[1]);
          return;
        }
        configFromISO(config);
        if (config._isValid === false) {
          delete config._isValid;
        } else {
          return;
        }
        configFromRFC2822(config);
        if (config._isValid === false) {
          delete config._isValid;
        } else {
          return;
        }
        if (config._strict) {
          config._isValid = false;
        } else {
          hooks.createFromInputFallback(config);
        }
      }
      hooks.createFromInputFallback = deprecate(
        "value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.",
        function(config) {
          config._d = /* @__PURE__ */ new Date(config._i + (config._useUTC ? " UTC" : ""));
        }
      );
      function defaults(a, b, c) {
        if (a != null) {
          return a;
        }
        if (b != null) {
          return b;
        }
        return c;
      }
      function currentDateArray(config) {
        var nowValue = new Date(hooks.now());
        if (config._useUTC) {
          return [
            nowValue.getUTCFullYear(),
            nowValue.getUTCMonth(),
            nowValue.getUTCDate()
          ];
        }
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
      }
      function configFromArray(config) {
        var i, date, input = [], currentDate, expectedWeekday, yearToUse;
        if (config._d) {
          return;
        }
        currentDate = currentDateArray(config);
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
          dayOfYearFromWeekInfo(config);
        }
        if (config._dayOfYear != null) {
          yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);
          if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
            getParsingFlags(config)._overflowDayOfYear = true;
          }
          date = createUTCDate(yearToUse, 0, config._dayOfYear);
          config._a[MONTH] = date.getUTCMonth();
          config._a[DATE] = date.getUTCDate();
        }
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
          config._a[i] = input[i] = currentDate[i];
        }
        for (; i < 7; i++) {
          config._a[i] = input[i] = config._a[i] == null ? i === 2 ? 1 : 0 : config._a[i];
        }
        if (config._a[HOUR] === 24 && config._a[MINUTE] === 0 && config._a[SECOND] === 0 && config._a[MILLISECOND] === 0) {
          config._nextDay = true;
          config._a[HOUR] = 0;
        }
        config._d = (config._useUTC ? createUTCDate : createDate).apply(
          null,
          input
        );
        expectedWeekday = config._useUTC ? config._d.getUTCDay() : config._d.getDay();
        if (config._tzm != null) {
          config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }
        if (config._nextDay) {
          config._a[HOUR] = 24;
        }
        if (config._w && typeof config._w.d !== "undefined" && config._w.d !== expectedWeekday) {
          getParsingFlags(config).weekdayMismatch = true;
        }
      }
      function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week2, weekday, dow, doy, temp, weekdayOverflow, curWeek;
        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
          dow = 1;
          doy = 4;
          weekYear = defaults(
            w.GG,
            config._a[YEAR],
            weekOfYear(createLocal(), 1, 4).year
          );
          week2 = defaults(w.W, 1);
          weekday = defaults(w.E, 1);
          if (weekday < 1 || weekday > 7) {
            weekdayOverflow = true;
          }
        } else {
          dow = config._locale._week.dow;
          doy = config._locale._week.doy;
          curWeek = weekOfYear(createLocal(), dow, doy);
          weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);
          week2 = defaults(w.w, curWeek.week);
          if (w.d != null) {
            weekday = w.d;
            if (weekday < 0 || weekday > 6) {
              weekdayOverflow = true;
            }
          } else if (w.e != null) {
            weekday = w.e + dow;
            if (w.e < 0 || w.e > 6) {
              weekdayOverflow = true;
            }
          } else {
            weekday = dow;
          }
        }
        if (week2 < 1 || week2 > weeksInYear(weekYear, dow, doy)) {
          getParsingFlags(config)._overflowWeeks = true;
        } else if (weekdayOverflow != null) {
          getParsingFlags(config)._overflowWeekday = true;
        } else {
          temp = dayOfYearFromWeeks(weekYear, week2, weekday, dow, doy);
          config._a[YEAR] = temp.year;
          config._dayOfYear = temp.dayOfYear;
        }
      }
      hooks.ISO_8601 = function() {
      };
      hooks.RFC_2822 = function() {
      };
      function configFromStringAndFormat(config) {
        if (config._f === hooks.ISO_8601) {
          configFromISO(config);
          return;
        }
        if (config._f === hooks.RFC_2822) {
          configFromRFC2822(config);
          return;
        }
        config._a = [];
        getParsingFlags(config).empty = true;
        var string = "" + config._i, i, parsedInput, tokens2, token2, skipped, stringLength = string.length, totalParsedInputLength = 0, era, tokenLen;
        tokens2 = expandFormat(config._f, config._locale).match(formattingTokens) || [];
        tokenLen = tokens2.length;
        for (i = 0; i < tokenLen; i++) {
          token2 = tokens2[i];
          parsedInput = (string.match(getParseRegexForToken(token2, config)) || [])[0];
          if (parsedInput) {
            skipped = string.substr(0, string.indexOf(parsedInput));
            if (skipped.length > 0) {
              getParsingFlags(config).unusedInput.push(skipped);
            }
            string = string.slice(
              string.indexOf(parsedInput) + parsedInput.length
            );
            totalParsedInputLength += parsedInput.length;
          }
          if (formatTokenFunctions[token2]) {
            if (parsedInput) {
              getParsingFlags(config).empty = false;
            } else {
              getParsingFlags(config).unusedTokens.push(token2);
            }
            addTimeToArrayFromToken(token2, parsedInput, config);
          } else if (config._strict && !parsedInput) {
            getParsingFlags(config).unusedTokens.push(token2);
          }
        }
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
          getParsingFlags(config).unusedInput.push(string);
        }
        if (config._a[HOUR] <= 12 && getParsingFlags(config).bigHour === true && config._a[HOUR] > 0) {
          getParsingFlags(config).bigHour = void 0;
        }
        getParsingFlags(config).parsedDateParts = config._a.slice(0);
        getParsingFlags(config).meridiem = config._meridiem;
        config._a[HOUR] = meridiemFixWrap(
          config._locale,
          config._a[HOUR],
          config._meridiem
        );
        era = getParsingFlags(config).era;
        if (era !== null) {
          config._a[YEAR] = config._locale.erasConvertYear(era, config._a[YEAR]);
        }
        configFromArray(config);
        checkOverflow(config);
      }
      function meridiemFixWrap(locale3, hour, meridiem2) {
        var isPm;
        if (meridiem2 == null) {
          return hour;
        }
        if (locale3.meridiemHour != null) {
          return locale3.meridiemHour(hour, meridiem2);
        } else if (locale3.isPM != null) {
          isPm = locale3.isPM(meridiem2);
          if (isPm && hour < 12) {
            hour += 12;
          }
          if (!isPm && hour === 12) {
            hour = 0;
          }
          return hour;
        } else {
          return hour;
        }
      }
      function configFromStringAndArray(config) {
        var tempConfig, bestMoment, scoreToBeat, i, currentScore, validFormatFound, bestFormatIsValid = false, configfLen = config._f.length;
        if (configfLen === 0) {
          getParsingFlags(config).invalidFormat = true;
          config._d = /* @__PURE__ */ new Date(NaN);
          return;
        }
        for (i = 0; i < configfLen; i++) {
          currentScore = 0;
          validFormatFound = false;
          tempConfig = copyConfig({}, config);
          if (config._useUTC != null) {
            tempConfig._useUTC = config._useUTC;
          }
          tempConfig._f = config._f[i];
          configFromStringAndFormat(tempConfig);
          if (isValid(tempConfig)) {
            validFormatFound = true;
          }
          currentScore += getParsingFlags(tempConfig).charsLeftOver;
          currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;
          getParsingFlags(tempConfig).score = currentScore;
          if (!bestFormatIsValid) {
            if (scoreToBeat == null || currentScore < scoreToBeat || validFormatFound) {
              scoreToBeat = currentScore;
              bestMoment = tempConfig;
              if (validFormatFound) {
                bestFormatIsValid = true;
              }
            }
          } else {
            if (currentScore < scoreToBeat) {
              scoreToBeat = currentScore;
              bestMoment = tempConfig;
            }
          }
        }
        extend(config, bestMoment || tempConfig);
      }
      function configFromObject(config) {
        if (config._d) {
          return;
        }
        var i = normalizeObjectUnits(config._i), dayOrDate = i.day === void 0 ? i.date : i.day;
        config._a = map(
          [i.year, i.month, dayOrDate, i.hour, i.minute, i.second, i.millisecond],
          function(obj) {
            return obj && parseInt(obj, 10);
          }
        );
        configFromArray(config);
      }
      function createFromConfig(config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
          res.add(1, "d");
          res._nextDay = void 0;
        }
        return res;
      }
      function prepareConfig(config) {
        var input = config._i, format2 = config._f;
        config._locale = config._locale || getLocale2(config._l);
        if (input === null || format2 === void 0 && input === "") {
          return createInvalid({ nullInput: true });
        }
        if (typeof input === "string") {
          config._i = input = config._locale.preparse(input);
        }
        if (isMoment(input)) {
          return new Moment(checkOverflow(input));
        } else if (isDate(input)) {
          config._d = input;
        } else if (isArray(format2)) {
          configFromStringAndArray(config);
        } else if (format2) {
          configFromStringAndFormat(config);
        } else {
          configFromInput(config);
        }
        if (!isValid(config)) {
          config._d = null;
        }
        return config;
      }
      function configFromInput(config) {
        var input = config._i;
        if (isUndefined(input)) {
          config._d = new Date(hooks.now());
        } else if (isDate(input)) {
          config._d = new Date(input.valueOf());
        } else if (typeof input === "string") {
          configFromString(config);
        } else if (isArray(input)) {
          config._a = map(input.slice(0), function(obj) {
            return parseInt(obj, 10);
          });
          configFromArray(config);
        } else if (isObject(input)) {
          configFromObject(config);
        } else if (isNumber(input)) {
          config._d = new Date(input);
        } else {
          hooks.createFromInputFallback(config);
        }
      }
      function createLocalOrUTC(input, format2, locale3, strict, isUTC) {
        var c = {};
        if (format2 === true || format2 === false) {
          strict = format2;
          format2 = void 0;
        }
        if (locale3 === true || locale3 === false) {
          strict = locale3;
          locale3 = void 0;
        }
        if (isObject(input) && isObjectEmpty(input) || isArray(input) && input.length === 0) {
          input = void 0;
        }
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale3;
        c._i = input;
        c._f = format2;
        c._strict = strict;
        return createFromConfig(c);
      }
      function createLocal(input, format2, locale3, strict) {
        return createLocalOrUTC(input, format2, locale3, strict, false);
      }
      var prototypeMin = deprecate(
        "moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/",
        function() {
          var other = createLocal.apply(null, arguments);
          if (this.isValid() && other.isValid()) {
            return other < this ? this : other;
          } else {
            return createInvalid();
          }
        }
      ), prototypeMax = deprecate(
        "moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/",
        function() {
          var other = createLocal.apply(null, arguments);
          if (this.isValid() && other.isValid()) {
            return other > this ? this : other;
          } else {
            return createInvalid();
          }
        }
      );
      function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
          moments = moments[0];
        }
        if (!moments.length) {
          return createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
          if (!moments[i].isValid() || moments[i][fn](res)) {
            res = moments[i];
          }
        }
        return res;
      }
      function min() {
        var args = [].slice.call(arguments, 0);
        return pickBy("isBefore", args);
      }
      function max() {
        var args = [].slice.call(arguments, 0);
        return pickBy("isAfter", args);
      }
      var now = function() {
        return Date.now ? Date.now() : +/* @__PURE__ */ new Date();
      };
      var ordering = [
        "year",
        "quarter",
        "month",
        "week",
        "day",
        "hour",
        "minute",
        "second",
        "millisecond"
      ];
      function isDurationValid(m) {
        var key, unitHasDecimal = false, i, orderLen = ordering.length;
        for (key in m) {
          if (hasOwnProp(m, key) && !(indexOf.call(ordering, key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
            return false;
          }
        }
        for (i = 0; i < orderLen; ++i) {
          if (m[ordering[i]]) {
            if (unitHasDecimal) {
              return false;
            }
            if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
              unitHasDecimal = true;
            }
          }
        }
        return true;
      }
      function isValid$1() {
        return this._isValid;
      }
      function createInvalid$1() {
        return createDuration(NaN);
      }
      function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration), years2 = normalizedInput.year || 0, quarters = normalizedInput.quarter || 0, months2 = normalizedInput.month || 0, weeks2 = normalizedInput.week || normalizedInput.isoWeek || 0, days2 = normalizedInput.day || 0, hours2 = normalizedInput.hour || 0, minutes2 = normalizedInput.minute || 0, seconds2 = normalizedInput.second || 0, milliseconds2 = normalizedInput.millisecond || 0;
        this._isValid = isDurationValid(normalizedInput);
        this._milliseconds = +milliseconds2 + seconds2 * 1e3 + // 1000
        minutes2 * 6e4 + // 1000 * 60
        hours2 * 1e3 * 60 * 60;
        this._days = +days2 + weeks2 * 7;
        this._months = +months2 + quarters * 3 + years2 * 12;
        this._data = {};
        this._locale = getLocale2();
        this._bubble();
      }
      function isDuration(obj) {
        return obj instanceof Duration;
      }
      function absRound(number) {
        if (number < 0) {
          return Math.round(-1 * number) * -1;
        } else {
          return Math.round(number);
        }
      }
      function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length), lengthDiff = Math.abs(array1.length - array2.length), diffs = 0, i;
        for (i = 0; i < len; i++) {
          if (toInt(array1[i]) !== toInt(array2[i])) {
            diffs++;
          }
        }
        return diffs + lengthDiff;
      }
      function offset(token2, separator) {
        addFormatToken(token2, 0, 0, function() {
          var offset2 = this.utcOffset(), sign2 = "+";
          if (offset2 < 0) {
            offset2 = -offset2;
            sign2 = "-";
          }
          return sign2 + zeroFill(~~(offset2 / 60), 2) + separator + zeroFill(~~offset2 % 60, 2);
        });
      }
      offset("Z", ":");
      offset("ZZ", "");
      addRegexToken("Z", matchShortOffset);
      addRegexToken("ZZ", matchShortOffset);
      addParseToken(["Z", "ZZ"], function(input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
      });
      var chunkOffset = /([\+\-]|\d\d)/gi;
      function offsetFromString(matcher, string) {
        var matches = (string || "").match(matcher), chunk, parts, minutes2;
        if (matches === null) {
          return null;
        }
        chunk = matches[matches.length - 1] || [];
        parts = (chunk + "").match(chunkOffset) || ["-", 0, 0];
        minutes2 = +(parts[1] * 60) + toInt(parts[2]);
        return minutes2 === 0 ? 0 : parts[0] === "+" ? minutes2 : -minutes2;
      }
      function cloneWithOffset(input, model) {
        var res, diff2;
        if (model._isUTC) {
          res = model.clone();
          diff2 = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
          res._d.setTime(res._d.valueOf() + diff2);
          hooks.updateOffset(res, false);
          return res;
        } else {
          return createLocal(input).local();
        }
      }
      function getDateOffset(m) {
        return -Math.round(m._d.getTimezoneOffset());
      }
      hooks.updateOffset = function() {
      };
      function getSetOffset(input, keepLocalTime, keepMinutes) {
        var offset2 = this._offset || 0, localAdjust;
        if (!this.isValid()) {
          return input != null ? this : NaN;
        }
        if (input != null) {
          if (typeof input === "string") {
            input = offsetFromString(matchShortOffset, input);
            if (input === null) {
              return this;
            }
          } else if (Math.abs(input) < 16 && !keepMinutes) {
            input = input * 60;
          }
          if (!this._isUTC && keepLocalTime) {
            localAdjust = getDateOffset(this);
          }
          this._offset = input;
          this._isUTC = true;
          if (localAdjust != null) {
            this.add(localAdjust, "m");
          }
          if (offset2 !== input) {
            if (!keepLocalTime || this._changeInProgress) {
              addSubtract(
                this,
                createDuration(input - offset2, "m"),
                1,
                false
              );
            } else if (!this._changeInProgress) {
              this._changeInProgress = true;
              hooks.updateOffset(this, true);
              this._changeInProgress = null;
            }
          }
          return this;
        } else {
          return this._isUTC ? offset2 : getDateOffset(this);
        }
      }
      function getSetZone(input, keepLocalTime) {
        if (input != null) {
          if (typeof input !== "string") {
            input = -input;
          }
          this.utcOffset(input, keepLocalTime);
          return this;
        } else {
          return -this.utcOffset();
        }
      }
      function setOffsetToUTC(keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
      }
      function setOffsetToLocal(keepLocalTime) {
        if (this._isUTC) {
          this.utcOffset(0, keepLocalTime);
          this._isUTC = false;
          if (keepLocalTime) {
            this.subtract(getDateOffset(this), "m");
          }
        }
        return this;
      }
      function setOffsetToParsedOffset() {
        if (this._tzm != null) {
          this.utcOffset(this._tzm, false, true);
        } else if (typeof this._i === "string") {
          var tZone = offsetFromString(matchOffset, this._i);
          if (tZone != null) {
            this.utcOffset(tZone);
          } else {
            this.utcOffset(0, true);
          }
        }
        return this;
      }
      function hasAlignedHourOffset(input) {
        if (!this.isValid()) {
          return false;
        }
        input = input ? createLocal(input).utcOffset() : 0;
        return (this.utcOffset() - input) % 60 === 0;
      }
      function isDaylightSavingTime() {
        return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset();
      }
      function isDaylightSavingTimeShifted() {
        if (!isUndefined(this._isDSTShifted)) {
          return this._isDSTShifted;
        }
        var c = {}, other;
        copyConfig(c, this);
        c = prepareConfig(c);
        if (c._a) {
          other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
          this._isDSTShifted = this.isValid() && compareArrays(c._a, other.toArray()) > 0;
        } else {
          this._isDSTShifted = false;
        }
        return this._isDSTShifted;
      }
      function isLocal() {
        return this.isValid() ? !this._isUTC : false;
      }
      function isUtcOffset() {
        return this.isValid() ? this._isUTC : false;
      }
      function isUtc() {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
      }
      var aspNetRegex = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/, isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;
      function createDuration(input, key) {
        var duration = input, match = null, sign2, ret, diffRes;
        if (isDuration(input)) {
          duration = {
            ms: input._milliseconds,
            d: input._days,
            M: input._months
          };
        } else if (isNumber(input) || !isNaN(+input)) {
          duration = {};
          if (key) {
            duration[key] = +input;
          } else {
            duration.milliseconds = +input;
          }
        } else if (match = aspNetRegex.exec(input)) {
          sign2 = match[1] === "-" ? -1 : 1;
          duration = {
            y: 0,
            d: toInt(match[DATE]) * sign2,
            h: toInt(match[HOUR]) * sign2,
            m: toInt(match[MINUTE]) * sign2,
            s: toInt(match[SECOND]) * sign2,
            ms: toInt(absRound(match[MILLISECOND] * 1e3)) * sign2
            // the millisecond decimal point is included in the match
          };
        } else if (match = isoRegex.exec(input)) {
          sign2 = match[1] === "-" ? -1 : 1;
          duration = {
            y: parseIso(match[2], sign2),
            M: parseIso(match[3], sign2),
            w: parseIso(match[4], sign2),
            d: parseIso(match[5], sign2),
            h: parseIso(match[6], sign2),
            m: parseIso(match[7], sign2),
            s: parseIso(match[8], sign2)
          };
        } else if (duration == null) {
          duration = {};
        } else if (typeof duration === "object" && ("from" in duration || "to" in duration)) {
          diffRes = momentsDifference(
            createLocal(duration.from),
            createLocal(duration.to)
          );
          duration = {};
          duration.ms = diffRes.milliseconds;
          duration.M = diffRes.months;
        }
        ret = new Duration(duration);
        if (isDuration(input) && hasOwnProp(input, "_locale")) {
          ret._locale = input._locale;
        }
        if (isDuration(input) && hasOwnProp(input, "_isValid")) {
          ret._isValid = input._isValid;
        }
        return ret;
      }
      createDuration.fn = Duration.prototype;
      createDuration.invalid = createInvalid$1;
      function parseIso(inp, sign2) {
        var res = inp && parseFloat(inp.replace(",", "."));
        return (isNaN(res) ? 0 : res) * sign2;
      }
      function positiveMomentsDifference(base, other) {
        var res = {};
        res.months = other.month() - base.month() + (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, "M").isAfter(other)) {
          --res.months;
        }
        res.milliseconds = +other - +base.clone().add(res.months, "M");
        return res;
      }
      function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) {
          return { milliseconds: 0, months: 0 };
        }
        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
          res = positiveMomentsDifference(base, other);
        } else {
          res = positiveMomentsDifference(other, base);
          res.milliseconds = -res.milliseconds;
          res.months = -res.months;
        }
        return res;
      }
      function createAdder(direction, name) {
        return function(val, period) {
          var dur, tmp;
          if (period !== null && !isNaN(+period)) {
            deprecateSimple(
              name,
              "moment()." + name + "(period, number) is deprecated. Please use moment()." + name + "(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info."
            );
            tmp = val;
            val = period;
            period = tmp;
          }
          dur = createDuration(val, period);
          addSubtract(this, dur, direction);
          return this;
        };
      }
      function addSubtract(mom, duration, isAdding, updateOffset) {
        var milliseconds2 = duration._milliseconds, days2 = absRound(duration._days), months2 = absRound(duration._months);
        if (!mom.isValid()) {
          return;
        }
        updateOffset = updateOffset == null ? true : updateOffset;
        if (months2) {
          setMonth(mom, get(mom, "Month") + months2 * isAdding);
        }
        if (days2) {
          set$1(mom, "Date", get(mom, "Date") + days2 * isAdding);
        }
        if (milliseconds2) {
          mom._d.setTime(mom._d.valueOf() + milliseconds2 * isAdding);
        }
        if (updateOffset) {
          hooks.updateOffset(mom, days2 || months2);
        }
      }
      var add = createAdder(1, "add"), subtract = createAdder(-1, "subtract");
      function isString(input) {
        return typeof input === "string" || input instanceof String;
      }
      function isMomentInput(input) {
        return isMoment(input) || isDate(input) || isString(input) || isNumber(input) || isNumberOrStringArray(input) || isMomentInputObject(input) || input === null || input === void 0;
      }
      function isMomentInputObject(input) {
        var objectTest = isObject(input) && !isObjectEmpty(input), propertyTest = false, properties = [
          "years",
          "year",
          "y",
          "months",
          "month",
          "M",
          "days",
          "day",
          "d",
          "dates",
          "date",
          "D",
          "hours",
          "hour",
          "h",
          "minutes",
          "minute",
          "m",
          "seconds",
          "second",
          "s",
          "milliseconds",
          "millisecond",
          "ms"
        ], i, property, propertyLen = properties.length;
        for (i = 0; i < propertyLen; i += 1) {
          property = properties[i];
          propertyTest = propertyTest || hasOwnProp(input, property);
        }
        return objectTest && propertyTest;
      }
      function isNumberOrStringArray(input) {
        var arrayTest = isArray(input), dataTypeTest = false;
        if (arrayTest) {
          dataTypeTest = input.filter(function(item) {
            return !isNumber(item) && isString(input);
          }).length === 0;
        }
        return arrayTest && dataTypeTest;
      }
      function isCalendarSpec(input) {
        var objectTest = isObject(input) && !isObjectEmpty(input), propertyTest = false, properties = [
          "sameDay",
          "nextDay",
          "lastDay",
          "nextWeek",
          "lastWeek",
          "sameElse"
        ], i, property;
        for (i = 0; i < properties.length; i += 1) {
          property = properties[i];
          propertyTest = propertyTest || hasOwnProp(input, property);
        }
        return objectTest && propertyTest;
      }
      function getCalendarFormat(myMoment, now2) {
        var diff2 = myMoment.diff(now2, "days", true);
        return diff2 < -6 ? "sameElse" : diff2 < -1 ? "lastWeek" : diff2 < 0 ? "lastDay" : diff2 < 1 ? "sameDay" : diff2 < 2 ? "nextDay" : diff2 < 7 ? "nextWeek" : "sameElse";
      }
      function calendar$1(time, formats) {
        if (arguments.length === 1) {
          if (!arguments[0]) {
            time = void 0;
            formats = void 0;
          } else if (isMomentInput(arguments[0])) {
            time = arguments[0];
            formats = void 0;
          } else if (isCalendarSpec(arguments[0])) {
            formats = arguments[0];
            time = void 0;
          }
        }
        var now2 = time || createLocal(), sod = cloneWithOffset(now2, this).startOf("day"), format2 = hooks.calendarFormat(this, sod) || "sameElse", output = formats && (isFunction(formats[format2]) ? formats[format2].call(this, now2) : formats[format2]);
        return this.format(
          output || this.localeData().calendar(format2, this, createLocal(now2))
        );
      }
      function clone() {
        return new Moment(this);
      }
      function isAfter(input, units2) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
          return false;
        }
        units2 = normalizeUnits(units2) || "millisecond";
        if (units2 === "millisecond") {
          return this.valueOf() > localInput.valueOf();
        } else {
          return localInput.valueOf() < this.clone().startOf(units2).valueOf();
        }
      }
      function isBefore(input, units2) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
          return false;
        }
        units2 = normalizeUnits(units2) || "millisecond";
        if (units2 === "millisecond") {
          return this.valueOf() < localInput.valueOf();
        } else {
          return this.clone().endOf(units2).valueOf() < localInput.valueOf();
        }
      }
      function isBetween(from2, to2, units2, inclusivity) {
        var localFrom = isMoment(from2) ? from2 : createLocal(from2), localTo = isMoment(to2) ? to2 : createLocal(to2);
        if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) {
          return false;
        }
        inclusivity = inclusivity || "()";
        return (inclusivity[0] === "(" ? this.isAfter(localFrom, units2) : !this.isBefore(localFrom, units2)) && (inclusivity[1] === ")" ? this.isBefore(localTo, units2) : !this.isAfter(localTo, units2));
      }
      function isSame(input, units2) {
        var localInput = isMoment(input) ? input : createLocal(input), inputMs;
        if (!(this.isValid() && localInput.isValid())) {
          return false;
        }
        units2 = normalizeUnits(units2) || "millisecond";
        if (units2 === "millisecond") {
          return this.valueOf() === localInput.valueOf();
        } else {
          inputMs = localInput.valueOf();
          return this.clone().startOf(units2).valueOf() <= inputMs && inputMs <= this.clone().endOf(units2).valueOf();
        }
      }
      function isSameOrAfter(input, units2) {
        return this.isSame(input, units2) || this.isAfter(input, units2);
      }
      function isSameOrBefore(input, units2) {
        return this.isSame(input, units2) || this.isBefore(input, units2);
      }
      function diff(input, units2, asFloat) {
        var that, zoneDelta, output;
        if (!this.isValid()) {
          return NaN;
        }
        that = cloneWithOffset(input, this);
        if (!that.isValid()) {
          return NaN;
        }
        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;
        units2 = normalizeUnits(units2);
        switch (units2) {
          case "year":
            output = monthDiff(this, that) / 12;
            break;
          case "month":
            output = monthDiff(this, that);
            break;
          case "quarter":
            output = monthDiff(this, that) / 3;
            break;
          case "second":
            output = (this - that) / 1e3;
            break;
          // 1000
          case "minute":
            output = (this - that) / 6e4;
            break;
          // 1000 * 60
          case "hour":
            output = (this - that) / 36e5;
            break;
          // 1000 * 60 * 60
          case "day":
            output = (this - that - zoneDelta) / 864e5;
            break;
          // 1000 * 60 * 60 * 24, negate dst
          case "week":
            output = (this - that - zoneDelta) / 6048e5;
            break;
          // 1000 * 60 * 60 * 24 * 7, negate dst
          default:
            output = this - that;
        }
        return asFloat ? output : absFloor(output);
      }
      function monthDiff(a, b) {
        if (a.date() < b.date()) {
          return -monthDiff(b, a);
        }
        var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month()), anchor = a.clone().add(wholeMonthDiff, "months"), anchor2, adjust;
        if (b - anchor < 0) {
          anchor2 = a.clone().add(wholeMonthDiff - 1, "months");
          adjust = (b - anchor) / (anchor - anchor2);
        } else {
          anchor2 = a.clone().add(wholeMonthDiff + 1, "months");
          adjust = (b - anchor) / (anchor2 - anchor);
        }
        return -(wholeMonthDiff + adjust) || 0;
      }
      hooks.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ";
      hooks.defaultFormatUtc = "YYYY-MM-DDTHH:mm:ss[Z]";
      function toString() {
        return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
      }
      function toISOString(keepOffset) {
        if (!this.isValid()) {
          return null;
        }
        var utc = keepOffset !== true, m = utc ? this.clone().utc() : this;
        if (m.year() < 0 || m.year() > 9999) {
          return formatMoment(
            m,
            utc ? "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYYYY-MM-DD[T]HH:mm:ss.SSSZ"
          );
        }
        if (isFunction(Date.prototype.toISOString)) {
          if (utc) {
            return this.toDate().toISOString();
          } else {
            return new Date(this.valueOf() + this.utcOffset() * 60 * 1e3).toISOString().replace("Z", formatMoment(m, "Z"));
          }
        }
        return formatMoment(
          m,
          utc ? "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYY-MM-DD[T]HH:mm:ss.SSSZ"
        );
      }
      function inspect() {
        if (!this.isValid()) {
          return "moment.invalid(/* " + this._i + " */)";
        }
        var func = "moment", zone = "", prefix, year, datetime, suffix;
        if (!this.isLocal()) {
          func = this.utcOffset() === 0 ? "moment.utc" : "moment.parseZone";
          zone = "Z";
        }
        prefix = "[" + func + '("]';
        year = 0 <= this.year() && this.year() <= 9999 ? "YYYY" : "YYYYYY";
        datetime = "-MM-DD[T]HH:mm:ss.SSS";
        suffix = zone + '[")]';
        return this.format(prefix + year + datetime + suffix);
      }
      function format(inputString) {
        if (!inputString) {
          inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
        }
        var output = formatMoment(this, inputString);
        return this.localeData().postformat(output);
      }
      function from(time, withoutSuffix) {
        if (this.isValid() && (isMoment(time) && time.isValid() || createLocal(time).isValid())) {
          return createDuration({ to: this, from: time }).locale(this.locale()).humanize(!withoutSuffix);
        } else {
          return this.localeData().invalidDate();
        }
      }
      function fromNow(withoutSuffix) {
        return this.from(createLocal(), withoutSuffix);
      }
      function to(time, withoutSuffix) {
        if (this.isValid() && (isMoment(time) && time.isValid() || createLocal(time).isValid())) {
          return createDuration({ from: this, to: time }).locale(this.locale()).humanize(!withoutSuffix);
        } else {
          return this.localeData().invalidDate();
        }
      }
      function toNow(withoutSuffix) {
        return this.to(createLocal(), withoutSuffix);
      }
      function locale2(key) {
        var newLocaleData;
        if (key === void 0) {
          return this._locale._abbr;
        } else {
          newLocaleData = getLocale2(key);
          if (newLocaleData != null) {
            this._locale = newLocaleData;
          }
          return this;
        }
      }
      var lang = deprecate(
        "moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.",
        function(key) {
          if (key === void 0) {
            return this.localeData();
          } else {
            return this.locale(key);
          }
        }
      );
      function localeData() {
        return this._locale;
      }
      var MS_PER_SECOND = 1e3, MS_PER_MINUTE = 60 * MS_PER_SECOND, MS_PER_HOUR = 60 * MS_PER_MINUTE, MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;
      function mod$1(dividend, divisor) {
        return (dividend % divisor + divisor) % divisor;
      }
      function localStartOfDate(y, m, d) {
        if (y < 100 && y >= 0) {
          return new Date(y + 400, m, d) - MS_PER_400_YEARS;
        } else {
          return new Date(y, m, d).valueOf();
        }
      }
      function utcStartOfDate(y, m, d) {
        if (y < 100 && y >= 0) {
          return Date.UTC(y + 400, m, d) - MS_PER_400_YEARS;
        } else {
          return Date.UTC(y, m, d);
        }
      }
      function startOf(units2) {
        var time, startOfDate;
        units2 = normalizeUnits(units2);
        if (units2 === void 0 || units2 === "millisecond" || !this.isValid()) {
          return this;
        }
        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;
        switch (units2) {
          case "year":
            time = startOfDate(this.year(), 0, 1);
            break;
          case "quarter":
            time = startOfDate(
              this.year(),
              this.month() - this.month() % 3,
              1
            );
            break;
          case "month":
            time = startOfDate(this.year(), this.month(), 1);
            break;
          case "week":
            time = startOfDate(
              this.year(),
              this.month(),
              this.date() - this.weekday()
            );
            break;
          case "isoWeek":
            time = startOfDate(
              this.year(),
              this.month(),
              this.date() - (this.isoWeekday() - 1)
            );
            break;
          case "day":
          case "date":
            time = startOfDate(this.year(), this.month(), this.date());
            break;
          case "hour":
            time = this._d.valueOf();
            time -= mod$1(
              time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
              MS_PER_HOUR
            );
            break;
          case "minute":
            time = this._d.valueOf();
            time -= mod$1(time, MS_PER_MINUTE);
            break;
          case "second":
            time = this._d.valueOf();
            time -= mod$1(time, MS_PER_SECOND);
            break;
        }
        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
      }
      function endOf(units2) {
        var time, startOfDate;
        units2 = normalizeUnits(units2);
        if (units2 === void 0 || units2 === "millisecond" || !this.isValid()) {
          return this;
        }
        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;
        switch (units2) {
          case "year":
            time = startOfDate(this.year() + 1, 0, 1) - 1;
            break;
          case "quarter":
            time = startOfDate(
              this.year(),
              this.month() - this.month() % 3 + 3,
              1
            ) - 1;
            break;
          case "month":
            time = startOfDate(this.year(), this.month() + 1, 1) - 1;
            break;
          case "week":
            time = startOfDate(
              this.year(),
              this.month(),
              this.date() - this.weekday() + 7
            ) - 1;
            break;
          case "isoWeek":
            time = startOfDate(
              this.year(),
              this.month(),
              this.date() - (this.isoWeekday() - 1) + 7
            ) - 1;
            break;
          case "day":
          case "date":
            time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
            break;
          case "hour":
            time = this._d.valueOf();
            time += MS_PER_HOUR - mod$1(
              time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
              MS_PER_HOUR
            ) - 1;
            break;
          case "minute":
            time = this._d.valueOf();
            time += MS_PER_MINUTE - mod$1(time, MS_PER_MINUTE) - 1;
            break;
          case "second":
            time = this._d.valueOf();
            time += MS_PER_SECOND - mod$1(time, MS_PER_SECOND) - 1;
            break;
        }
        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
      }
      function valueOf() {
        return this._d.valueOf() - (this._offset || 0) * 6e4;
      }
      function unix() {
        return Math.floor(this.valueOf() / 1e3);
      }
      function toDate() {
        return new Date(this.valueOf());
      }
      function toArray() {
        var m = this;
        return [
          m.year(),
          m.month(),
          m.date(),
          m.hour(),
          m.minute(),
          m.second(),
          m.millisecond()
        ];
      }
      function toObject() {
        var m = this;
        return {
          years: m.year(),
          months: m.month(),
          date: m.date(),
          hours: m.hours(),
          minutes: m.minutes(),
          seconds: m.seconds(),
          milliseconds: m.milliseconds()
        };
      }
      function toJSON() {
        return this.isValid() ? this.toISOString() : null;
      }
      function isValid$2() {
        return isValid(this);
      }
      function parsingFlags() {
        return extend({}, getParsingFlags(this));
      }
      function invalidAt() {
        return getParsingFlags(this).overflow;
      }
      function creationData() {
        return {
          input: this._i,
          format: this._f,
          locale: this._locale,
          isUTC: this._isUTC,
          strict: this._strict
        };
      }
      addFormatToken("N", 0, 0, "eraAbbr");
      addFormatToken("NN", 0, 0, "eraAbbr");
      addFormatToken("NNN", 0, 0, "eraAbbr");
      addFormatToken("NNNN", 0, 0, "eraName");
      addFormatToken("NNNNN", 0, 0, "eraNarrow");
      addFormatToken("y", ["y", 1], "yo", "eraYear");
      addFormatToken("y", ["yy", 2], 0, "eraYear");
      addFormatToken("y", ["yyy", 3], 0, "eraYear");
      addFormatToken("y", ["yyyy", 4], 0, "eraYear");
      addRegexToken("N", matchEraAbbr);
      addRegexToken("NN", matchEraAbbr);
      addRegexToken("NNN", matchEraAbbr);
      addRegexToken("NNNN", matchEraName);
      addRegexToken("NNNNN", matchEraNarrow);
      addParseToken(
        ["N", "NN", "NNN", "NNNN", "NNNNN"],
        function(input, array, config, token2) {
          var era = config._locale.erasParse(input, token2, config._strict);
          if (era) {
            getParsingFlags(config).era = era;
          } else {
            getParsingFlags(config).invalidEra = input;
          }
        }
      );
      addRegexToken("y", matchUnsigned);
      addRegexToken("yy", matchUnsigned);
      addRegexToken("yyy", matchUnsigned);
      addRegexToken("yyyy", matchUnsigned);
      addRegexToken("yo", matchEraYearOrdinal);
      addParseToken(["y", "yy", "yyy", "yyyy"], YEAR);
      addParseToken(["yo"], function(input, array, config, token2) {
        var match;
        if (config._locale._eraYearOrdinalRegex) {
          match = input.match(config._locale._eraYearOrdinalRegex);
        }
        if (config._locale.eraYearOrdinalParse) {
          array[YEAR] = config._locale.eraYearOrdinalParse(input, match);
        } else {
          array[YEAR] = parseInt(input, 10);
        }
      });
      function localeEras(m, format2) {
        var i, l, date, eras = this._eras || getLocale2("en")._eras;
        for (i = 0, l = eras.length; i < l; ++i) {
          switch (typeof eras[i].since) {
            case "string":
              date = hooks(eras[i].since).startOf("day");
              eras[i].since = date.valueOf();
              break;
          }
          switch (typeof eras[i].until) {
            case "undefined":
              eras[i].until = Infinity;
              break;
            case "string":
              date = hooks(eras[i].until).startOf("day").valueOf();
              eras[i].until = date.valueOf();
              break;
          }
        }
        return eras;
      }
      function localeErasParse(eraName, format2, strict) {
        var i, l, eras = this.eras(), name, abbr, narrow;
        eraName = eraName.toUpperCase();
        for (i = 0, l = eras.length; i < l; ++i) {
          name = eras[i].name.toUpperCase();
          abbr = eras[i].abbr.toUpperCase();
          narrow = eras[i].narrow.toUpperCase();
          if (strict) {
            switch (format2) {
              case "N":
              case "NN":
              case "NNN":
                if (abbr === eraName) {
                  return eras[i];
                }
                break;
              case "NNNN":
                if (name === eraName) {
                  return eras[i];
                }
                break;
              case "NNNNN":
                if (narrow === eraName) {
                  return eras[i];
                }
                break;
            }
          } else if ([name, abbr, narrow].indexOf(eraName) >= 0) {
            return eras[i];
          }
        }
      }
      function localeErasConvertYear(era, year) {
        var dir = era.since <= era.until ? 1 : -1;
        if (year === void 0) {
          return hooks(era.since).year();
        } else {
          return hooks(era.since).year() + (year - era.offset) * dir;
        }
      }
      function getEraName() {
        var i, l, val, eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
          val = this.clone().startOf("day").valueOf();
          if (eras[i].since <= val && val <= eras[i].until) {
            return eras[i].name;
          }
          if (eras[i].until <= val && val <= eras[i].since) {
            return eras[i].name;
          }
        }
        return "";
      }
      function getEraNarrow() {
        var i, l, val, eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
          val = this.clone().startOf("day").valueOf();
          if (eras[i].since <= val && val <= eras[i].until) {
            return eras[i].narrow;
          }
          if (eras[i].until <= val && val <= eras[i].since) {
            return eras[i].narrow;
          }
        }
        return "";
      }
      function getEraAbbr() {
        var i, l, val, eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
          val = this.clone().startOf("day").valueOf();
          if (eras[i].since <= val && val <= eras[i].until) {
            return eras[i].abbr;
          }
          if (eras[i].until <= val && val <= eras[i].since) {
            return eras[i].abbr;
          }
        }
        return "";
      }
      function getEraYear() {
        var i, l, dir, val, eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
          dir = eras[i].since <= eras[i].until ? 1 : -1;
          val = this.clone().startOf("day").valueOf();
          if (eras[i].since <= val && val <= eras[i].until || eras[i].until <= val && val <= eras[i].since) {
            return (this.year() - hooks(eras[i].since).year()) * dir + eras[i].offset;
          }
        }
        return this.year();
      }
      function erasNameRegex(isStrict) {
        if (!hasOwnProp(this, "_erasNameRegex")) {
          computeErasParse.call(this);
        }
        return isStrict ? this._erasNameRegex : this._erasRegex;
      }
      function erasAbbrRegex(isStrict) {
        if (!hasOwnProp(this, "_erasAbbrRegex")) {
          computeErasParse.call(this);
        }
        return isStrict ? this._erasAbbrRegex : this._erasRegex;
      }
      function erasNarrowRegex(isStrict) {
        if (!hasOwnProp(this, "_erasNarrowRegex")) {
          computeErasParse.call(this);
        }
        return isStrict ? this._erasNarrowRegex : this._erasRegex;
      }
      function matchEraAbbr(isStrict, locale3) {
        return locale3.erasAbbrRegex(isStrict);
      }
      function matchEraName(isStrict, locale3) {
        return locale3.erasNameRegex(isStrict);
      }
      function matchEraNarrow(isStrict, locale3) {
        return locale3.erasNarrowRegex(isStrict);
      }
      function matchEraYearOrdinal(isStrict, locale3) {
        return locale3._eraYearOrdinalRegex || matchUnsigned;
      }
      function computeErasParse() {
        var abbrPieces = [], namePieces = [], narrowPieces = [], mixedPieces = [], i, l, erasName, erasAbbr, erasNarrow, eras = this.eras();
        for (i = 0, l = eras.length; i < l; ++i) {
          erasName = regexEscape(eras[i].name);
          erasAbbr = regexEscape(eras[i].abbr);
          erasNarrow = regexEscape(eras[i].narrow);
          namePieces.push(erasName);
          abbrPieces.push(erasAbbr);
          narrowPieces.push(erasNarrow);
          mixedPieces.push(erasName);
          mixedPieces.push(erasAbbr);
          mixedPieces.push(erasNarrow);
        }
        this._erasRegex = new RegExp("^(" + mixedPieces.join("|") + ")", "i");
        this._erasNameRegex = new RegExp("^(" + namePieces.join("|") + ")", "i");
        this._erasAbbrRegex = new RegExp("^(" + abbrPieces.join("|") + ")", "i");
        this._erasNarrowRegex = new RegExp(
          "^(" + narrowPieces.join("|") + ")",
          "i"
        );
      }
      addFormatToken(0, ["gg", 2], 0, function() {
        return this.weekYear() % 100;
      });
      addFormatToken(0, ["GG", 2], 0, function() {
        return this.isoWeekYear() % 100;
      });
      function addWeekYearFormatToken(token2, getter) {
        addFormatToken(0, [token2, token2.length], 0, getter);
      }
      addWeekYearFormatToken("gggg", "weekYear");
      addWeekYearFormatToken("ggggg", "weekYear");
      addWeekYearFormatToken("GGGG", "isoWeekYear");
      addWeekYearFormatToken("GGGGG", "isoWeekYear");
      addRegexToken("G", matchSigned);
      addRegexToken("g", matchSigned);
      addRegexToken("GG", match1to2, match2);
      addRegexToken("gg", match1to2, match2);
      addRegexToken("GGGG", match1to4, match4);
      addRegexToken("gggg", match1to4, match4);
      addRegexToken("GGGGG", match1to6, match6);
      addRegexToken("ggggg", match1to6, match6);
      addWeekParseToken(
        ["gggg", "ggggg", "GGGG", "GGGGG"],
        function(input, week2, config, token2) {
          week2[token2.substr(0, 2)] = toInt(input);
        }
      );
      addWeekParseToken(["gg", "GG"], function(input, week2, config, token2) {
        week2[token2] = hooks.parseTwoDigitYear(input);
      });
      function getSetWeekYear(input) {
        return getSetWeekYearHelper.call(
          this,
          input,
          this.week(),
          this.weekday() + this.localeData()._week.dow,
          this.localeData()._week.dow,
          this.localeData()._week.doy
        );
      }
      function getSetISOWeekYear(input) {
        return getSetWeekYearHelper.call(
          this,
          input,
          this.isoWeek(),
          this.isoWeekday(),
          1,
          4
        );
      }
      function getISOWeeksInYear() {
        return weeksInYear(this.year(), 1, 4);
      }
      function getISOWeeksInISOWeekYear() {
        return weeksInYear(this.isoWeekYear(), 1, 4);
      }
      function getWeeksInYear() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
      }
      function getWeeksInWeekYear() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.weekYear(), weekInfo.dow, weekInfo.doy);
      }
      function getSetWeekYearHelper(input, week2, weekday, dow, doy) {
        var weeksTarget;
        if (input == null) {
          return weekOfYear(this, dow, doy).year;
        } else {
          weeksTarget = weeksInYear(input, dow, doy);
          if (week2 > weeksTarget) {
            week2 = weeksTarget;
          }
          return setWeekAll.call(this, input, week2, weekday, dow, doy);
        }
      }
      function setWeekAll(weekYear, week2, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week2, weekday, dow, doy), date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);
        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
      }
      addFormatToken("Q", 0, "Qo", "quarter");
      addRegexToken("Q", match1);
      addParseToken("Q", function(input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
      });
      function getSetQuarter(input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
      }
      addFormatToken("D", ["DD", 2], "Do", "date");
      addRegexToken("D", match1to2, match1to2NoLeadingZero);
      addRegexToken("DD", match1to2, match2);
      addRegexToken("Do", function(isStrict, locale3) {
        return isStrict ? locale3._dayOfMonthOrdinalParse || locale3._ordinalParse : locale3._dayOfMonthOrdinalParseLenient;
      });
      addParseToken(["D", "DD"], DATE);
      addParseToken("Do", function(input, array) {
        array[DATE] = toInt(input.match(match1to2)[0]);
      });
      var getSetDayOfMonth = makeGetSet("Date", true);
      addFormatToken("DDD", ["DDDD", 3], "DDDo", "dayOfYear");
      addRegexToken("DDD", match1to3);
      addRegexToken("DDDD", match3);
      addParseToken(["DDD", "DDDD"], function(input, array, config) {
        config._dayOfYear = toInt(input);
      });
      function getSetDayOfYear(input) {
        var dayOfYear = Math.round(
          (this.clone().startOf("day") - this.clone().startOf("year")) / 864e5
        ) + 1;
        return input == null ? dayOfYear : this.add(input - dayOfYear, "d");
      }
      addFormatToken("m", ["mm", 2], 0, "minute");
      addRegexToken("m", match1to2, match1to2HasZero);
      addRegexToken("mm", match1to2, match2);
      addParseToken(["m", "mm"], MINUTE);
      var getSetMinute = makeGetSet("Minutes", false);
      addFormatToken("s", ["ss", 2], 0, "second");
      addRegexToken("s", match1to2, match1to2HasZero);
      addRegexToken("ss", match1to2, match2);
      addParseToken(["s", "ss"], SECOND);
      var getSetSecond = makeGetSet("Seconds", false);
      addFormatToken("S", 0, 0, function() {
        return ~~(this.millisecond() / 100);
      });
      addFormatToken(0, ["SS", 2], 0, function() {
        return ~~(this.millisecond() / 10);
      });
      addFormatToken(0, ["SSS", 3], 0, "millisecond");
      addFormatToken(0, ["SSSS", 4], 0, function() {
        return this.millisecond() * 10;
      });
      addFormatToken(0, ["SSSSS", 5], 0, function() {
        return this.millisecond() * 100;
      });
      addFormatToken(0, ["SSSSSS", 6], 0, function() {
        return this.millisecond() * 1e3;
      });
      addFormatToken(0, ["SSSSSSS", 7], 0, function() {
        return this.millisecond() * 1e4;
      });
      addFormatToken(0, ["SSSSSSSS", 8], 0, function() {
        return this.millisecond() * 1e5;
      });
      addFormatToken(0, ["SSSSSSSSS", 9], 0, function() {
        return this.millisecond() * 1e6;
      });
      addRegexToken("S", match1to3, match1);
      addRegexToken("SS", match1to3, match2);
      addRegexToken("SSS", match1to3, match3);
      var token, getSetMillisecond;
      for (token = "SSSS"; token.length <= 9; token += "S") {
        addRegexToken(token, matchUnsigned);
      }
      function parseMs(input, array) {
        array[MILLISECOND] = toInt(("0." + input) * 1e3);
      }
      for (token = "S"; token.length <= 9; token += "S") {
        addParseToken(token, parseMs);
      }
      getSetMillisecond = makeGetSet("Milliseconds", false);
      addFormatToken("z", 0, 0, "zoneAbbr");
      addFormatToken("zz", 0, 0, "zoneName");
      function getZoneAbbr() {
        return this._isUTC ? "UTC" : "";
      }
      function getZoneName() {
        return this._isUTC ? "Coordinated Universal Time" : "";
      }
      var proto = Moment.prototype;
      proto.add = add;
      proto.calendar = calendar$1;
      proto.clone = clone;
      proto.diff = diff;
      proto.endOf = endOf;
      proto.format = format;
      proto.from = from;
      proto.fromNow = fromNow;
      proto.to = to;
      proto.toNow = toNow;
      proto.get = stringGet;
      proto.invalidAt = invalidAt;
      proto.isAfter = isAfter;
      proto.isBefore = isBefore;
      proto.isBetween = isBetween;
      proto.isSame = isSame;
      proto.isSameOrAfter = isSameOrAfter;
      proto.isSameOrBefore = isSameOrBefore;
      proto.isValid = isValid$2;
      proto.lang = lang;
      proto.locale = locale2;
      proto.localeData = localeData;
      proto.max = prototypeMax;
      proto.min = prototypeMin;
      proto.parsingFlags = parsingFlags;
      proto.set = stringSet;
      proto.startOf = startOf;
      proto.subtract = subtract;
      proto.toArray = toArray;
      proto.toObject = toObject;
      proto.toDate = toDate;
      proto.toISOString = toISOString;
      proto.inspect = inspect;
      if (typeof Symbol !== "undefined" && Symbol.for != null) {
        proto[Symbol.for("nodejs.util.inspect.custom")] = function() {
          return "Moment<" + this.format() + ">";
        };
      }
      proto.toJSON = toJSON;
      proto.toString = toString;
      proto.unix = unix;
      proto.valueOf = valueOf;
      proto.creationData = creationData;
      proto.eraName = getEraName;
      proto.eraNarrow = getEraNarrow;
      proto.eraAbbr = getEraAbbr;
      proto.eraYear = getEraYear;
      proto.year = getSetYear;
      proto.isLeapYear = getIsLeapYear;
      proto.weekYear = getSetWeekYear;
      proto.isoWeekYear = getSetISOWeekYear;
      proto.quarter = proto.quarters = getSetQuarter;
      proto.month = getSetMonth;
      proto.daysInMonth = getDaysInMonth;
      proto.week = proto.weeks = getSetWeek;
      proto.isoWeek = proto.isoWeeks = getSetISOWeek;
      proto.weeksInYear = getWeeksInYear;
      proto.weeksInWeekYear = getWeeksInWeekYear;
      proto.isoWeeksInYear = getISOWeeksInYear;
      proto.isoWeeksInISOWeekYear = getISOWeeksInISOWeekYear;
      proto.date = getSetDayOfMonth;
      proto.day = proto.days = getSetDayOfWeek;
      proto.weekday = getSetLocaleDayOfWeek;
      proto.isoWeekday = getSetISODayOfWeek;
      proto.dayOfYear = getSetDayOfYear;
      proto.hour = proto.hours = getSetHour;
      proto.minute = proto.minutes = getSetMinute;
      proto.second = proto.seconds = getSetSecond;
      proto.millisecond = proto.milliseconds = getSetMillisecond;
      proto.utcOffset = getSetOffset;
      proto.utc = setOffsetToUTC;
      proto.local = setOffsetToLocal;
      proto.parseZone = setOffsetToParsedOffset;
      proto.hasAlignedHourOffset = hasAlignedHourOffset;
      proto.isDST = isDaylightSavingTime;
      proto.isLocal = isLocal;
      proto.isUtcOffset = isUtcOffset;
      proto.isUtc = isUtc;
      proto.isUTC = isUtc;
      proto.zoneAbbr = getZoneAbbr;
      proto.zoneName = getZoneName;
      proto.dates = deprecate(
        "dates accessor is deprecated. Use date instead.",
        getSetDayOfMonth
      );
      proto.months = deprecate(
        "months accessor is deprecated. Use month instead",
        getSetMonth
      );
      proto.years = deprecate(
        "years accessor is deprecated. Use year instead",
        getSetYear
      );
      proto.zone = deprecate(
        "moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/",
        getSetZone
      );
      proto.isDSTShifted = deprecate(
        "isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information",
        isDaylightSavingTimeShifted
      );
      function createUnix(input) {
        return createLocal(input * 1e3);
      }
      function createInZone() {
        return createLocal.apply(null, arguments).parseZone();
      }
      function preParsePostFormat(string) {
        return string;
      }
      var proto$1 = Locale.prototype;
      proto$1.calendar = calendar;
      proto$1.longDateFormat = longDateFormat;
      proto$1.invalidDate = invalidDate;
      proto$1.ordinal = ordinal;
      proto$1.preparse = preParsePostFormat;
      proto$1.postformat = preParsePostFormat;
      proto$1.relativeTime = relativeTime;
      proto$1.pastFuture = pastFuture;
      proto$1.set = set;
      proto$1.eras = localeEras;
      proto$1.erasParse = localeErasParse;
      proto$1.erasConvertYear = localeErasConvertYear;
      proto$1.erasAbbrRegex = erasAbbrRegex;
      proto$1.erasNameRegex = erasNameRegex;
      proto$1.erasNarrowRegex = erasNarrowRegex;
      proto$1.months = localeMonths;
      proto$1.monthsShort = localeMonthsShort;
      proto$1.monthsParse = localeMonthsParse;
      proto$1.monthsRegex = monthsRegex;
      proto$1.monthsShortRegex = monthsShortRegex;
      proto$1.week = localeWeek;
      proto$1.firstDayOfYear = localeFirstDayOfYear;
      proto$1.firstDayOfWeek = localeFirstDayOfWeek;
      proto$1.weekdays = localeWeekdays;
      proto$1.weekdaysMin = localeWeekdaysMin;
      proto$1.weekdaysShort = localeWeekdaysShort;
      proto$1.weekdaysParse = localeWeekdaysParse;
      proto$1.weekdaysRegex = weekdaysRegex;
      proto$1.weekdaysShortRegex = weekdaysShortRegex;
      proto$1.weekdaysMinRegex = weekdaysMinRegex;
      proto$1.isPM = localeIsPM;
      proto$1.meridiem = localeMeridiem;
      function get$1(format2, index, field, setter) {
        var locale3 = getLocale2(), utc = createUTC().set(setter, index);
        return locale3[field](utc, format2);
      }
      function listMonthsImpl(format2, index, field) {
        if (isNumber(format2)) {
          index = format2;
          format2 = void 0;
        }
        format2 = format2 || "";
        if (index != null) {
          return get$1(format2, index, field, "month");
        }
        var i, out = [];
        for (i = 0; i < 12; i++) {
          out[i] = get$1(format2, i, field, "month");
        }
        return out;
      }
      function listWeekdaysImpl(localeSorted, format2, index, field) {
        if (typeof localeSorted === "boolean") {
          if (isNumber(format2)) {
            index = format2;
            format2 = void 0;
          }
          format2 = format2 || "";
        } else {
          format2 = localeSorted;
          index = format2;
          localeSorted = false;
          if (isNumber(format2)) {
            index = format2;
            format2 = void 0;
          }
          format2 = format2 || "";
        }
        var locale3 = getLocale2(), shift = localeSorted ? locale3._week.dow : 0, i, out = [];
        if (index != null) {
          return get$1(format2, (index + shift) % 7, field, "day");
        }
        for (i = 0; i < 7; i++) {
          out[i] = get$1(format2, (i + shift) % 7, field, "day");
        }
        return out;
      }
      function listMonths(format2, index) {
        return listMonthsImpl(format2, index, "months");
      }
      function listMonthsShort(format2, index) {
        return listMonthsImpl(format2, index, "monthsShort");
      }
      function listWeekdays(localeSorted, format2, index) {
        return listWeekdaysImpl(localeSorted, format2, index, "weekdays");
      }
      function listWeekdaysShort(localeSorted, format2, index) {
        return listWeekdaysImpl(localeSorted, format2, index, "weekdaysShort");
      }
      function listWeekdaysMin(localeSorted, format2, index) {
        return listWeekdaysImpl(localeSorted, format2, index, "weekdaysMin");
      }
      getSetGlobalLocale("en", {
        eras: [
          {
            since: "0001-01-01",
            until: Infinity,
            offset: 1,
            name: "Anno Domini",
            narrow: "AD",
            abbr: "AD"
          },
          {
            since: "0000-12-31",
            until: -Infinity,
            offset: 1,
            name: "Before Christ",
            narrow: "BC",
            abbr: "BC"
          }
        ],
        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function(number) {
          var b = number % 10, output = toInt(number % 100 / 10) === 1 ? "th" : b === 1 ? "st" : b === 2 ? "nd" : b === 3 ? "rd" : "th";
          return number + output;
        }
      });
      hooks.lang = deprecate(
        "moment.lang is deprecated. Use moment.locale instead.",
        getSetGlobalLocale
      );
      hooks.langData = deprecate(
        "moment.langData is deprecated. Use moment.localeData instead.",
        getLocale2
      );
      var mathAbs = Math.abs;
      function abs() {
        var data = this._data;
        this._milliseconds = mathAbs(this._milliseconds);
        this._days = mathAbs(this._days);
        this._months = mathAbs(this._months);
        data.milliseconds = mathAbs(data.milliseconds);
        data.seconds = mathAbs(data.seconds);
        data.minutes = mathAbs(data.minutes);
        data.hours = mathAbs(data.hours);
        data.months = mathAbs(data.months);
        data.years = mathAbs(data.years);
        return this;
      }
      function addSubtract$1(duration, input, value, direction) {
        var other = createDuration(input, value);
        duration._milliseconds += direction * other._milliseconds;
        duration._days += direction * other._days;
        duration._months += direction * other._months;
        return duration._bubble();
      }
      function add$1(input, value) {
        return addSubtract$1(this, input, value, 1);
      }
      function subtract$1(input, value) {
        return addSubtract$1(this, input, value, -1);
      }
      function absCeil(number) {
        if (number < 0) {
          return Math.floor(number);
        } else {
          return Math.ceil(number);
        }
      }
      function bubble() {
        var milliseconds2 = this._milliseconds, days2 = this._days, months2 = this._months, data = this._data, seconds2, minutes2, hours2, years2, monthsFromDays;
        if (!(milliseconds2 >= 0 && days2 >= 0 && months2 >= 0 || milliseconds2 <= 0 && days2 <= 0 && months2 <= 0)) {
          milliseconds2 += absCeil(monthsToDays(months2) + days2) * 864e5;
          days2 = 0;
          months2 = 0;
        }
        data.milliseconds = milliseconds2 % 1e3;
        seconds2 = absFloor(milliseconds2 / 1e3);
        data.seconds = seconds2 % 60;
        minutes2 = absFloor(seconds2 / 60);
        data.minutes = minutes2 % 60;
        hours2 = absFloor(minutes2 / 60);
        data.hours = hours2 % 24;
        days2 += absFloor(hours2 / 24);
        monthsFromDays = absFloor(daysToMonths(days2));
        months2 += monthsFromDays;
        days2 -= absCeil(monthsToDays(monthsFromDays));
        years2 = absFloor(months2 / 12);
        months2 %= 12;
        data.days = days2;
        data.months = months2;
        data.years = years2;
        return this;
      }
      function daysToMonths(days2) {
        return days2 * 4800 / 146097;
      }
      function monthsToDays(months2) {
        return months2 * 146097 / 4800;
      }
      function as(units2) {
        if (!this.isValid()) {
          return NaN;
        }
        var days2, months2, milliseconds2 = this._milliseconds;
        units2 = normalizeUnits(units2);
        if (units2 === "month" || units2 === "quarter" || units2 === "year") {
          days2 = this._days + milliseconds2 / 864e5;
          months2 = this._months + daysToMonths(days2);
          switch (units2) {
            case "month":
              return months2;
            case "quarter":
              return months2 / 3;
            case "year":
              return months2 / 12;
          }
        } else {
          days2 = this._days + Math.round(monthsToDays(this._months));
          switch (units2) {
            case "week":
              return days2 / 7 + milliseconds2 / 6048e5;
            case "day":
              return days2 + milliseconds2 / 864e5;
            case "hour":
              return days2 * 24 + milliseconds2 / 36e5;
            case "minute":
              return days2 * 1440 + milliseconds2 / 6e4;
            case "second":
              return days2 * 86400 + milliseconds2 / 1e3;
            // Math.floor prevents floating point math errors here
            case "millisecond":
              return Math.floor(days2 * 864e5) + milliseconds2;
            default:
              throw new Error("Unknown unit " + units2);
          }
        }
      }
      function makeAs(alias) {
        return function() {
          return this.as(alias);
        };
      }
      var asMilliseconds = makeAs("ms"), asSeconds = makeAs("s"), asMinutes = makeAs("m"), asHours = makeAs("h"), asDays = makeAs("d"), asWeeks = makeAs("w"), asMonths = makeAs("M"), asQuarters = makeAs("Q"), asYears = makeAs("y"), valueOf$1 = asMilliseconds;
      function clone$1() {
        return createDuration(this);
      }
      function get$2(units2) {
        units2 = normalizeUnits(units2);
        return this.isValid() ? this[units2 + "s"]() : NaN;
      }
      function makeGetter(name) {
        return function() {
          return this.isValid() ? this._data[name] : NaN;
        };
      }
      var milliseconds = makeGetter("milliseconds"), seconds = makeGetter("seconds"), minutes = makeGetter("minutes"), hours = makeGetter("hours"), days = makeGetter("days"), months = makeGetter("months"), years = makeGetter("years");
      function weeks() {
        return absFloor(this.days() / 7);
      }
      var round = Math.round, thresholds = {
        ss: 44,
        // a few seconds to seconds
        s: 45,
        // seconds to minute
        m: 45,
        // minutes to hour
        h: 22,
        // hours to day
        d: 26,
        // days to month/week
        w: null,
        // weeks to month
        M: 11
        // months to year
      };
      function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale3) {
        return locale3.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
      }
      function relativeTime$1(posNegDuration, withoutSuffix, thresholds2, locale3) {
        var duration = createDuration(posNegDuration).abs(), seconds2 = round(duration.as("s")), minutes2 = round(duration.as("m")), hours2 = round(duration.as("h")), days2 = round(duration.as("d")), months2 = round(duration.as("M")), weeks2 = round(duration.as("w")), years2 = round(duration.as("y")), a = seconds2 <= thresholds2.ss && ["s", seconds2] || seconds2 < thresholds2.s && ["ss", seconds2] || minutes2 <= 1 && ["m"] || minutes2 < thresholds2.m && ["mm", minutes2] || hours2 <= 1 && ["h"] || hours2 < thresholds2.h && ["hh", hours2] || days2 <= 1 && ["d"] || days2 < thresholds2.d && ["dd", days2];
        if (thresholds2.w != null) {
          a = a || weeks2 <= 1 && ["w"] || weeks2 < thresholds2.w && ["ww", weeks2];
        }
        a = a || months2 <= 1 && ["M"] || months2 < thresholds2.M && ["MM", months2] || years2 <= 1 && ["y"] || ["yy", years2];
        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale3;
        return substituteTimeAgo.apply(null, a);
      }
      function getSetRelativeTimeRounding(roundingFunction) {
        if (roundingFunction === void 0) {
          return round;
        }
        if (typeof roundingFunction === "function") {
          round = roundingFunction;
          return true;
        }
        return false;
      }
      function getSetRelativeTimeThreshold(threshold, limit) {
        if (thresholds[threshold] === void 0) {
          return false;
        }
        if (limit === void 0) {
          return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        if (threshold === "s") {
          thresholds.ss = limit - 1;
        }
        return true;
      }
      function humanize(argWithSuffix, argThresholds) {
        if (!this.isValid()) {
          return this.localeData().invalidDate();
        }
        var withSuffix = false, th = thresholds, locale3, output;
        if (typeof argWithSuffix === "object") {
          argThresholds = argWithSuffix;
          argWithSuffix = false;
        }
        if (typeof argWithSuffix === "boolean") {
          withSuffix = argWithSuffix;
        }
        if (typeof argThresholds === "object") {
          th = Object.assign({}, thresholds, argThresholds);
          if (argThresholds.s != null && argThresholds.ss == null) {
            th.ss = argThresholds.s - 1;
          }
        }
        locale3 = this.localeData();
        output = relativeTime$1(this, !withSuffix, th, locale3);
        if (withSuffix) {
          output = locale3.pastFuture(+this, output);
        }
        return locale3.postformat(output);
      }
      var abs$1 = Math.abs;
      function sign(x) {
        return (x > 0) - (x < 0) || +x;
      }
      function toISOString$1() {
        if (!this.isValid()) {
          return this.localeData().invalidDate();
        }
        var seconds2 = abs$1(this._milliseconds) / 1e3, days2 = abs$1(this._days), months2 = abs$1(this._months), minutes2, hours2, years2, s, total = this.asSeconds(), totalSign, ymSign, daysSign, hmsSign;
        if (!total) {
          return "P0D";
        }
        minutes2 = absFloor(seconds2 / 60);
        hours2 = absFloor(minutes2 / 60);
        seconds2 %= 60;
        minutes2 %= 60;
        years2 = absFloor(months2 / 12);
        months2 %= 12;
        s = seconds2 ? seconds2.toFixed(3).replace(/\.?0+$/, "") : "";
        totalSign = total < 0 ? "-" : "";
        ymSign = sign(this._months) !== sign(total) ? "-" : "";
        daysSign = sign(this._days) !== sign(total) ? "-" : "";
        hmsSign = sign(this._milliseconds) !== sign(total) ? "-" : "";
        return totalSign + "P" + (years2 ? ymSign + years2 + "Y" : "") + (months2 ? ymSign + months2 + "M" : "") + (days2 ? daysSign + days2 + "D" : "") + (hours2 || minutes2 || seconds2 ? "T" : "") + (hours2 ? hmsSign + hours2 + "H" : "") + (minutes2 ? hmsSign + minutes2 + "M" : "") + (seconds2 ? hmsSign + s + "S" : "");
      }
      var proto$2 = Duration.prototype;
      proto$2.isValid = isValid$1;
      proto$2.abs = abs;
      proto$2.add = add$1;
      proto$2.subtract = subtract$1;
      proto$2.as = as;
      proto$2.asMilliseconds = asMilliseconds;
      proto$2.asSeconds = asSeconds;
      proto$2.asMinutes = asMinutes;
      proto$2.asHours = asHours;
      proto$2.asDays = asDays;
      proto$2.asWeeks = asWeeks;
      proto$2.asMonths = asMonths;
      proto$2.asQuarters = asQuarters;
      proto$2.asYears = asYears;
      proto$2.valueOf = valueOf$1;
      proto$2._bubble = bubble;
      proto$2.clone = clone$1;
      proto$2.get = get$2;
      proto$2.milliseconds = milliseconds;
      proto$2.seconds = seconds;
      proto$2.minutes = minutes;
      proto$2.hours = hours;
      proto$2.days = days;
      proto$2.weeks = weeks;
      proto$2.months = months;
      proto$2.years = years;
      proto$2.humanize = humanize;
      proto$2.toISOString = toISOString$1;
      proto$2.toString = toISOString$1;
      proto$2.toJSON = toISOString$1;
      proto$2.locale = locale2;
      proto$2.localeData = localeData;
      proto$2.toIsoString = deprecate(
        "toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)",
        toISOString$1
      );
      proto$2.lang = lang;
      addFormatToken("X", 0, 0, "unix");
      addFormatToken("x", 0, 0, "valueOf");
      addRegexToken("x", matchSigned);
      addRegexToken("X", matchTimestamp);
      addParseToken("X", function(input, array, config) {
        config._d = new Date(parseFloat(input) * 1e3);
      });
      addParseToken("x", function(input, array, config) {
        config._d = new Date(toInt(input));
      });
      //! moment.js
      hooks.version = "2.30.1";
      setHookCallback(createLocal);
      hooks.fn = proto;
      hooks.min = min;
      hooks.max = max;
      hooks.now = now;
      hooks.utc = createUTC;
      hooks.unix = createUnix;
      hooks.months = listMonths;
      hooks.isDate = isDate;
      hooks.locale = getSetGlobalLocale;
      hooks.invalid = createInvalid;
      hooks.duration = createDuration;
      hooks.isMoment = isMoment;
      hooks.weekdays = listWeekdays;
      hooks.parseZone = createInZone;
      hooks.localeData = getLocale2;
      hooks.isDuration = isDuration;
      hooks.monthsShort = listMonthsShort;
      hooks.weekdaysMin = listWeekdaysMin;
      hooks.defineLocale = defineLocale;
      hooks.updateLocale = updateLocale;
      hooks.locales = listLocales;
      hooks.weekdaysShort = listWeekdaysShort;
      hooks.normalizeUnits = normalizeUnits;
      hooks.relativeTimeRounding = getSetRelativeTimeRounding;
      hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
      hooks.calendarFormat = getCalendarFormat;
      hooks.prototype = proto;
      hooks.HTML5_FMT = {
        DATETIME_LOCAL: "YYYY-MM-DDTHH:mm",
        // <input type="datetime-local" />
        DATETIME_LOCAL_SECONDS: "YYYY-MM-DDTHH:mm:ss",
        // <input type="datetime-local" step="1" />
        DATETIME_LOCAL_MS: "YYYY-MM-DDTHH:mm:ss.SSS",
        // <input type="datetime-local" step="0.001" />
        DATE: "YYYY-MM-DD",
        // <input type="date" />
        TIME: "HH:mm",
        // <input type="time" />
        TIME_SECONDS: "HH:mm:ss",
        // <input type="time" step="1" />
        TIME_MS: "HH:mm:ss.SSS",
        // <input type="time" step="0.001" />
        WEEK: "GGGG-[W]WW",
        // <input type="week" />
        MONTH: "YYYY-MM"
        // <input type="month" />
      };
      //! moment.js locale configuration
      hooks.defineLocale("af", {
        months: "Januarie_Februarie_Maart_April_Mei_Junie_Julie_Augustus_September_Oktober_November_Desember".split(
          "_"
        ),
        monthsShort: "Jan_Feb_Mrt_Apr_Mei_Jun_Jul_Aug_Sep_Okt_Nov_Des".split("_"),
        weekdays: "Sondag_Maandag_Dinsdag_Woensdag_Donderdag_Vrydag_Saterdag".split(
          "_"
        ),
        weekdaysShort: "Son_Maa_Din_Woe_Don_Vry_Sat".split("_"),
        weekdaysMin: "So_Ma_Di_Wo_Do_Vr_Sa".split("_"),
        meridiemParse: /vm|nm/i,
        isPM: function(input) {
          return /^nm$/i.test(input);
        },
        meridiem: function(hours2, minutes2, isLower) {
          if (hours2 < 12) {
            return isLower ? "vm" : "VM";
          } else {
            return isLower ? "nm" : "NM";
          }
        },
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd, D MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[Vandag om] LT",
          nextDay: "[Môre om] LT",
          nextWeek: "dddd [om] LT",
          lastDay: "[Gister om] LT",
          lastWeek: "[Laas] dddd [om] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "oor %s",
          past: "%s gelede",
          s: "'n paar sekondes",
          ss: "%d sekondes",
          m: "'n minuut",
          mm: "%d minute",
          h: "'n uur",
          hh: "%d ure",
          d: "'n dag",
          dd: "%d dae",
          M: "'n maand",
          MM: "%d maande",
          y: "'n jaar",
          yy: "%d jaar"
        },
        dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
        ordinal: function(number) {
          return number + (number === 1 || number === 8 || number >= 20 ? "ste" : "de");
        },
        week: {
          dow: 1,
          // Maandag is die eerste dag van die week.
          doy: 4
          // Die week wat die 4de Januarie bevat is die eerste week van die jaar.
        }
      });
      //! moment.js locale configuration
      var pluralForm = function(n) {
        return n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5;
      }, plurals = {
        s: [
          "أقل من ثانية",
          "ثانية واحدة",
          ["ثانيتان", "ثانيتين"],
          "%d ثوان",
          "%d ثانية",
          "%d ثانية"
        ],
        m: [
          "أقل من دقيقة",
          "دقيقة واحدة",
          ["دقيقتان", "دقيقتين"],
          "%d دقائق",
          "%d دقيقة",
          "%d دقيقة"
        ],
        h: [
          "أقل من ساعة",
          "ساعة واحدة",
          ["ساعتان", "ساعتين"],
          "%d ساعات",
          "%d ساعة",
          "%d ساعة"
        ],
        d: [
          "أقل من يوم",
          "يوم واحد",
          ["يومان", "يومين"],
          "%d أيام",
          "%d يومًا",
          "%d يوم"
        ],
        M: [
          "أقل من شهر",
          "شهر واحد",
          ["شهران", "شهرين"],
          "%d أشهر",
          "%d شهرا",
          "%d شهر"
        ],
        y: [
          "أقل من عام",
          "عام واحد",
          ["عامان", "عامين"],
          "%d أعوام",
          "%d عامًا",
          "%d عام"
        ]
      }, pluralize = function(u) {
        return function(number, withoutSuffix, string, isFuture) {
          var f = pluralForm(number), str = plurals[u][pluralForm(number)];
          if (f === 2) {
            str = str[withoutSuffix ? 0 : 1];
          }
          return str.replace(/%d/i, number);
        };
      }, months$1 = [
        "جانفي",
        "فيفري",
        "مارس",
        "أفريل",
        "ماي",
        "جوان",
        "جويلية",
        "أوت",
        "سبتمبر",
        "أكتوبر",
        "نوفمبر",
        "ديسمبر"
      ];
      hooks.defineLocale("ar-dz", {
        months: months$1,
        monthsShort: months$1,
        weekdays: "الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),
        weekdaysShort: "أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),
        weekdaysMin: "ح_ن_ث_ر_خ_ج_س".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "D/‏M/‏YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd D MMMM YYYY HH:mm"
        },
        meridiemParse: /ص|م/,
        isPM: function(input) {
          return "م" === input;
        },
        meridiem: function(hour, minute, isLower) {
          if (hour < 12) {
            return "ص";
          } else {
            return "م";
          }
        },
        calendar: {
          sameDay: "[اليوم عند الساعة] LT",
          nextDay: "[غدًا عند الساعة] LT",
          nextWeek: "dddd [عند الساعة] LT",
          lastDay: "[أمس عند الساعة] LT",
          lastWeek: "dddd [عند الساعة] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "بعد %s",
          past: "منذ %s",
          s: pluralize("s"),
          ss: pluralize("s"),
          m: pluralize("m"),
          mm: pluralize("m"),
          h: pluralize("h"),
          hh: pluralize("h"),
          d: pluralize("d"),
          dd: pluralize("d"),
          M: pluralize("M"),
          MM: pluralize("M"),
          y: pluralize("y"),
          yy: pluralize("y")
        },
        postformat: function(string) {
          return string.replace(/,/g, "،");
        },
        week: {
          dow: 0,
          // Sunday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("ar-kw", {
        months: "يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split(
          "_"
        ),
        monthsShort: "يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split(
          "_"
        ),
        weekdays: "الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),
        weekdaysShort: "احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت".split("_"),
        weekdaysMin: "ح_ن_ث_ر_خ_ج_س".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd D MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[اليوم على الساعة] LT",
          nextDay: "[غدا على الساعة] LT",
          nextWeek: "dddd [على الساعة] LT",
          lastDay: "[أمس على الساعة] LT",
          lastWeek: "dddd [على الساعة] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "في %s",
          past: "منذ %s",
          s: "ثوان",
          ss: "%d ثانية",
          m: "دقيقة",
          mm: "%d دقائق",
          h: "ساعة",
          hh: "%d ساعات",
          d: "يوم",
          dd: "%d أيام",
          M: "شهر",
          MM: "%d أشهر",
          y: "سنة",
          yy: "%d سنوات"
        },
        week: {
          dow: 0,
          // Sunday is the first day of the week.
          doy: 12
          // The week that contains Jan 12th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var symbolMap = {
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        6: "6",
        7: "7",
        8: "8",
        9: "9",
        0: "0"
      }, pluralForm$1 = function(n) {
        return n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5;
      }, plurals$1 = {
        s: [
          "أقل من ثانية",
          "ثانية واحدة",
          ["ثانيتان", "ثانيتين"],
          "%d ثوان",
          "%d ثانية",
          "%d ثانية"
        ],
        m: [
          "أقل من دقيقة",
          "دقيقة واحدة",
          ["دقيقتان", "دقيقتين"],
          "%d دقائق",
          "%d دقيقة",
          "%d دقيقة"
        ],
        h: [
          "أقل من ساعة",
          "ساعة واحدة",
          ["ساعتان", "ساعتين"],
          "%d ساعات",
          "%d ساعة",
          "%d ساعة"
        ],
        d: [
          "أقل من يوم",
          "يوم واحد",
          ["يومان", "يومين"],
          "%d أيام",
          "%d يومًا",
          "%d يوم"
        ],
        M: [
          "أقل من شهر",
          "شهر واحد",
          ["شهران", "شهرين"],
          "%d أشهر",
          "%d شهرا",
          "%d شهر"
        ],
        y: [
          "أقل من عام",
          "عام واحد",
          ["عامان", "عامين"],
          "%d أعوام",
          "%d عامًا",
          "%d عام"
        ]
      }, pluralize$1 = function(u) {
        return function(number, withoutSuffix, string, isFuture) {
          var f = pluralForm$1(number), str = plurals$1[u][pluralForm$1(number)];
          if (f === 2) {
            str = str[withoutSuffix ? 0 : 1];
          }
          return str.replace(/%d/i, number);
        };
      }, months$2 = [
        "يناير",
        "فبراير",
        "مارس",
        "أبريل",
        "مايو",
        "يونيو",
        "يوليو",
        "أغسطس",
        "سبتمبر",
        "أكتوبر",
        "نوفمبر",
        "ديسمبر"
      ];
      hooks.defineLocale("ar-ly", {
        months: months$2,
        monthsShort: months$2,
        weekdays: "الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),
        weekdaysShort: "أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),
        weekdaysMin: "ح_ن_ث_ر_خ_ج_س".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "D/‏M/‏YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd D MMMM YYYY HH:mm"
        },
        meridiemParse: /ص|م/,
        isPM: function(input) {
          return "م" === input;
        },
        meridiem: function(hour, minute, isLower) {
          if (hour < 12) {
            return "ص";
          } else {
            return "م";
          }
        },
        calendar: {
          sameDay: "[اليوم عند الساعة] LT",
          nextDay: "[غدًا عند الساعة] LT",
          nextWeek: "dddd [عند الساعة] LT",
          lastDay: "[أمس عند الساعة] LT",
          lastWeek: "dddd [عند الساعة] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "بعد %s",
          past: "منذ %s",
          s: pluralize$1("s"),
          ss: pluralize$1("s"),
          m: pluralize$1("m"),
          mm: pluralize$1("m"),
          h: pluralize$1("h"),
          hh: pluralize$1("h"),
          d: pluralize$1("d"),
          dd: pluralize$1("d"),
          M: pluralize$1("M"),
          MM: pluralize$1("M"),
          y: pluralize$1("y"),
          yy: pluralize$1("y")
        },
        preparse: function(string) {
          return string.replace(/،/g, ",");
        },
        postformat: function(string) {
          return string.replace(/\d/g, function(match) {
            return symbolMap[match];
          }).replace(/,/g, "،");
        },
        week: {
          dow: 6,
          // Saturday is the first day of the week.
          doy: 12
          // The week that contains Jan 12th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("ar-ma", {
        months: "يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split(
          "_"
        ),
        monthsShort: "يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split(
          "_"
        ),
        weekdays: "الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),
        weekdaysShort: "احد_اثنين_ثلاثاء_اربعاء_خميس_جمعة_سبت".split("_"),
        weekdaysMin: "ح_ن_ث_ر_خ_ج_س".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd D MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[اليوم على الساعة] LT",
          nextDay: "[غدا على الساعة] LT",
          nextWeek: "dddd [على الساعة] LT",
          lastDay: "[أمس على الساعة] LT",
          lastWeek: "dddd [على الساعة] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "في %s",
          past: "منذ %s",
          s: "ثوان",
          ss: "%d ثانية",
          m: "دقيقة",
          mm: "%d دقائق",
          h: "ساعة",
          hh: "%d ساعات",
          d: "يوم",
          dd: "%d أيام",
          M: "شهر",
          MM: "%d أشهر",
          y: "سنة",
          yy: "%d سنوات"
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var symbolMap$1 = {
        1: "١",
        2: "٢",
        3: "٣",
        4: "٤",
        5: "٥",
        6: "٦",
        7: "٧",
        8: "٨",
        9: "٩",
        0: "٠"
      }, numberMap = {
        "١": "1",
        "٢": "2",
        "٣": "3",
        "٤": "4",
        "٥": "5",
        "٦": "6",
        "٧": "7",
        "٨": "8",
        "٩": "9",
        "٠": "0"
      };
      hooks.defineLocale("ar-ps", {
        months: "كانون الثاني_شباط_آذار_نيسان_أيّار_حزيران_تمّوز_آب_أيلول_تشري الأوّل_تشرين الثاني_كانون الأوّل".split(
          "_"
        ),
        monthsShort: "ك٢_شباط_آذار_نيسان_أيّار_حزيران_تمّوز_آب_أيلول_ت١_ت٢_ك١".split("_"),
        weekdays: "الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),
        weekdaysShort: "أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),
        weekdaysMin: "ح_ن_ث_ر_خ_ج_س".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd D MMMM YYYY HH:mm"
        },
        meridiemParse: /ص|م/,
        isPM: function(input) {
          return "م" === input;
        },
        meridiem: function(hour, minute, isLower) {
          if (hour < 12) {
            return "ص";
          } else {
            return "م";
          }
        },
        calendar: {
          sameDay: "[اليوم على الساعة] LT",
          nextDay: "[غدا على الساعة] LT",
          nextWeek: "dddd [على الساعة] LT",
          lastDay: "[أمس على الساعة] LT",
          lastWeek: "dddd [على الساعة] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "في %s",
          past: "منذ %s",
          s: "ثوان",
          ss: "%d ثانية",
          m: "دقيقة",
          mm: "%d دقائق",
          h: "ساعة",
          hh: "%d ساعات",
          d: "يوم",
          dd: "%d أيام",
          M: "شهر",
          MM: "%d أشهر",
          y: "سنة",
          yy: "%d سنوات"
        },
        preparse: function(string) {
          return string.replace(/[٣٤٥٦٧٨٩٠]/g, function(match) {
            return numberMap[match];
          }).split("").reverse().join("").replace(/[١٢](?![\u062a\u0643])/g, function(match) {
            return numberMap[match];
          }).split("").reverse().join("").replace(/،/g, ",");
        },
        postformat: function(string) {
          return string.replace(/\d/g, function(match) {
            return symbolMap$1[match];
          }).replace(/,/g, "،");
        },
        week: {
          dow: 0,
          // Sunday is the first day of the week.
          doy: 6
          // The week that contains Jan 6th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var symbolMap$2 = {
        1: "١",
        2: "٢",
        3: "٣",
        4: "٤",
        5: "٥",
        6: "٦",
        7: "٧",
        8: "٨",
        9: "٩",
        0: "٠"
      }, numberMap$1 = {
        "١": "1",
        "٢": "2",
        "٣": "3",
        "٤": "4",
        "٥": "5",
        "٦": "6",
        "٧": "7",
        "٨": "8",
        "٩": "9",
        "٠": "0"
      };
      hooks.defineLocale("ar-sa", {
        months: "يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split(
          "_"
        ),
        monthsShort: "يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split(
          "_"
        ),
        weekdays: "الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),
        weekdaysShort: "أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),
        weekdaysMin: "ح_ن_ث_ر_خ_ج_س".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd D MMMM YYYY HH:mm"
        },
        meridiemParse: /ص|م/,
        isPM: function(input) {
          return "م" === input;
        },
        meridiem: function(hour, minute, isLower) {
          if (hour < 12) {
            return "ص";
          } else {
            return "م";
          }
        },
        calendar: {
          sameDay: "[اليوم على الساعة] LT",
          nextDay: "[غدا على الساعة] LT",
          nextWeek: "dddd [على الساعة] LT",
          lastDay: "[أمس على الساعة] LT",
          lastWeek: "dddd [على الساعة] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "في %s",
          past: "منذ %s",
          s: "ثوان",
          ss: "%d ثانية",
          m: "دقيقة",
          mm: "%d دقائق",
          h: "ساعة",
          hh: "%d ساعات",
          d: "يوم",
          dd: "%d أيام",
          M: "شهر",
          MM: "%d أشهر",
          y: "سنة",
          yy: "%d سنوات"
        },
        preparse: function(string) {
          return string.replace(/[١٢٣٤٥٦٧٨٩٠]/g, function(match) {
            return numberMap$1[match];
          }).replace(/،/g, ",");
        },
        postformat: function(string) {
          return string.replace(/\d/g, function(match) {
            return symbolMap$2[match];
          }).replace(/,/g, "،");
        },
        week: {
          dow: 0,
          // Sunday is the first day of the week.
          doy: 6
          // The week that contains Jan 6th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("ar-tn", {
        months: "جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split(
          "_"
        ),
        monthsShort: "جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split(
          "_"
        ),
        weekdays: "الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),
        weekdaysShort: "أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),
        weekdaysMin: "ح_ن_ث_ر_خ_ج_س".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd D MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[اليوم على الساعة] LT",
          nextDay: "[غدا على الساعة] LT",
          nextWeek: "dddd [على الساعة] LT",
          lastDay: "[أمس على الساعة] LT",
          lastWeek: "dddd [على الساعة] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "في %s",
          past: "منذ %s",
          s: "ثوان",
          ss: "%d ثانية",
          m: "دقيقة",
          mm: "%d دقائق",
          h: "ساعة",
          hh: "%d ساعات",
          d: "يوم",
          dd: "%d أيام",
          M: "شهر",
          MM: "%d أشهر",
          y: "سنة",
          yy: "%d سنوات"
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var symbolMap$3 = {
        1: "١",
        2: "٢",
        3: "٣",
        4: "٤",
        5: "٥",
        6: "٦",
        7: "٧",
        8: "٨",
        9: "٩",
        0: "٠"
      }, numberMap$2 = {
        "١": "1",
        "٢": "2",
        "٣": "3",
        "٤": "4",
        "٥": "5",
        "٦": "6",
        "٧": "7",
        "٨": "8",
        "٩": "9",
        "٠": "0"
      }, pluralForm$2 = function(n) {
        return n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5;
      }, plurals$2 = {
        s: [
          "أقل من ثانية",
          "ثانية واحدة",
          ["ثانيتان", "ثانيتين"],
          "%d ثوان",
          "%d ثانية",
          "%d ثانية"
        ],
        m: [
          "أقل من دقيقة",
          "دقيقة واحدة",
          ["دقيقتان", "دقيقتين"],
          "%d دقائق",
          "%d دقيقة",
          "%d دقيقة"
        ],
        h: [
          "أقل من ساعة",
          "ساعة واحدة",
          ["ساعتان", "ساعتين"],
          "%d ساعات",
          "%d ساعة",
          "%d ساعة"
        ],
        d: [
          "أقل من يوم",
          "يوم واحد",
          ["يومان", "يومين"],
          "%d أيام",
          "%d يومًا",
          "%d يوم"
        ],
        M: [
          "أقل من شهر",
          "شهر واحد",
          ["شهران", "شهرين"],
          "%d أشهر",
          "%d شهرا",
          "%d شهر"
        ],
        y: [
          "أقل من عام",
          "عام واحد",
          ["عامان", "عامين"],
          "%d أعوام",
          "%d عامًا",
          "%d عام"
        ]
      }, pluralize$2 = function(u) {
        return function(number, withoutSuffix, string, isFuture) {
          var f = pluralForm$2(number), str = plurals$2[u][pluralForm$2(number)];
          if (f === 2) {
            str = str[withoutSuffix ? 0 : 1];
          }
          return str.replace(/%d/i, number);
        };
      }, months$3 = [
        "يناير",
        "فبراير",
        "مارس",
        "أبريل",
        "مايو",
        "يونيو",
        "يوليو",
        "أغسطس",
        "سبتمبر",
        "أكتوبر",
        "نوفمبر",
        "ديسمبر"
      ];
      hooks.defineLocale("ar", {
        months: months$3,
        monthsShort: months$3,
        weekdays: "الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),
        weekdaysShort: "أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),
        weekdaysMin: "ح_ن_ث_ر_خ_ج_س".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "D/‏M/‏YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd D MMMM YYYY HH:mm"
        },
        meridiemParse: /ص|م/,
        isPM: function(input) {
          return "م" === input;
        },
        meridiem: function(hour, minute, isLower) {
          if (hour < 12) {
            return "ص";
          } else {
            return "م";
          }
        },
        calendar: {
          sameDay: "[اليوم عند الساعة] LT",
          nextDay: "[غدًا عند الساعة] LT",
          nextWeek: "dddd [عند الساعة] LT",
          lastDay: "[أمس عند الساعة] LT",
          lastWeek: "dddd [عند الساعة] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "بعد %s",
          past: "منذ %s",
          s: pluralize$2("s"),
          ss: pluralize$2("s"),
          m: pluralize$2("m"),
          mm: pluralize$2("m"),
          h: pluralize$2("h"),
          hh: pluralize$2("h"),
          d: pluralize$2("d"),
          dd: pluralize$2("d"),
          M: pluralize$2("M"),
          MM: pluralize$2("M"),
          y: pluralize$2("y"),
          yy: pluralize$2("y")
        },
        preparse: function(string) {
          return string.replace(/[١٢٣٤٥٦٧٨٩٠]/g, function(match) {
            return numberMap$2[match];
          }).replace(/،/g, ",");
        },
        postformat: function(string) {
          return string.replace(/\d/g, function(match) {
            return symbolMap$3[match];
          }).replace(/,/g, "،");
        },
        week: {
          dow: 6,
          // Saturday is the first day of the week.
          doy: 12
          // The week that contains Jan 12th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var suffixes = {
        1: "-inci",
        5: "-inci",
        8: "-inci",
        70: "-inci",
        80: "-inci",
        2: "-nci",
        7: "-nci",
        20: "-nci",
        50: "-nci",
        3: "-üncü",
        4: "-üncü",
        100: "-üncü",
        6: "-ncı",
        9: "-uncu",
        10: "-uncu",
        30: "-uncu",
        60: "-ıncı",
        90: "-ıncı"
      };
      hooks.defineLocale("az", {
        months: "yanvar_fevral_mart_aprel_may_iyun_iyul_avqust_sentyabr_oktyabr_noyabr_dekabr".split(
          "_"
        ),
        monthsShort: "yan_fev_mar_apr_may_iyn_iyl_avq_sen_okt_noy_dek".split("_"),
        weekdays: "Bazar_Bazar ertəsi_Çərşənbə axşamı_Çərşənbə_Cümə axşamı_Cümə_Şənbə".split(
          "_"
        ),
        weekdaysShort: "Baz_BzE_ÇAx_Çər_CAx_Cüm_Şən".split("_"),
        weekdaysMin: "Bz_BE_ÇA_Çə_CA_Cü_Şə".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD.MM.YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd, D MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[bugün saat] LT",
          nextDay: "[sabah saat] LT",
          nextWeek: "[gələn həftə] dddd [saat] LT",
          lastDay: "[dünən] LT",
          lastWeek: "[keçən həftə] dddd [saat] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "%s sonra",
          past: "%s əvvəl",
          s: "bir neçə saniyə",
          ss: "%d saniyə",
          m: "bir dəqiqə",
          mm: "%d dəqiqə",
          h: "bir saat",
          hh: "%d saat",
          d: "bir gün",
          dd: "%d gün",
          M: "bir ay",
          MM: "%d ay",
          y: "bir il",
          yy: "%d il"
        },
        meridiemParse: /gecə|səhər|gündüz|axşam/,
        isPM: function(input) {
          return /^(gündüz|axşam)$/.test(input);
        },
        meridiem: function(hour, minute, isLower) {
          if (hour < 4) {
            return "gecə";
          } else if (hour < 12) {
            return "səhər";
          } else if (hour < 17) {
            return "gündüz";
          } else {
            return "axşam";
          }
        },
        dayOfMonthOrdinalParse: /\d{1,2}-(ıncı|inci|nci|üncü|ncı|uncu)/,
        ordinal: function(number) {
          if (number === 0) {
            return number + "-ıncı";
          }
          var a = number % 10, b = number % 100 - a, c = number >= 100 ? 100 : null;
          return number + (suffixes[a] || suffixes[b] || suffixes[c]);
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 7
          // The week that contains Jan 7th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      function plural(word, num) {
        var forms2 = word.split("_");
        return num % 10 === 1 && num % 100 !== 11 ? forms2[0] : num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms2[1] : forms2[2];
      }
      function relativeTimeWithPlural(number, withoutSuffix, key) {
        var format2 = {
          ss: withoutSuffix ? "секунда_секунды_секунд" : "секунду_секунды_секунд",
          mm: withoutSuffix ? "хвіліна_хвіліны_хвілін" : "хвіліну_хвіліны_хвілін",
          hh: withoutSuffix ? "гадзіна_гадзіны_гадзін" : "гадзіну_гадзіны_гадзін",
          dd: "дзень_дні_дзён",
          MM: "месяц_месяцы_месяцаў",
          yy: "год_гады_гадоў"
        };
        if (key === "m") {
          return withoutSuffix ? "хвіліна" : "хвіліну";
        } else if (key === "h") {
          return withoutSuffix ? "гадзіна" : "гадзіну";
        } else {
          return number + " " + plural(format2[key], +number);
        }
      }
      hooks.defineLocale("be", {
        months: {
          format: "студзеня_лютага_сакавіка_красавіка_траўня_чэрвеня_ліпеня_жніўня_верасня_кастрычніка_лістапада_снежня".split(
            "_"
          ),
          standalone: "студзень_люты_сакавік_красавік_травень_чэрвень_ліпень_жнівень_верасень_кастрычнік_лістапад_снежань".split(
            "_"
          )
        },
        monthsShort: "студ_лют_сак_крас_трав_чэрв_ліп_жнів_вер_каст_ліст_снеж".split("_"),
        weekdays: {
          format: "нядзелю_панядзелак_аўторак_сераду_чацвер_пятніцу_суботу".split(
            "_"
          ),
          standalone: "нядзеля_панядзелак_аўторак_серада_чацвер_пятніца_субота".split(
            "_"
          ),
          isFormat: /\[ ?[Ууў] ?(?:мінулую|наступную)? ?\] ?dddd/
        },
        weekdaysShort: "нд_пн_ат_ср_чц_пт_сб".split("_"),
        weekdaysMin: "нд_пн_ат_ср_чц_пт_сб".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD.MM.YYYY",
          LL: "D MMMM YYYY г.",
          LLL: "D MMMM YYYY г., HH:mm",
          LLLL: "dddd, D MMMM YYYY г., HH:mm"
        },
        calendar: {
          sameDay: "[Сёння ў] LT",
          nextDay: "[Заўтра ў] LT",
          lastDay: "[Учора ў] LT",
          nextWeek: function() {
            return "[У] dddd [ў] LT";
          },
          lastWeek: function() {
            switch (this.day()) {
              case 0:
              case 3:
              case 5:
              case 6:
                return "[У мінулую] dddd [ў] LT";
              case 1:
              case 2:
              case 4:
                return "[У мінулы] dddd [ў] LT";
            }
          },
          sameElse: "L"
        },
        relativeTime: {
          future: "праз %s",
          past: "%s таму",
          s: "некалькі секунд",
          m: relativeTimeWithPlural,
          mm: relativeTimeWithPlural,
          h: relativeTimeWithPlural,
          hh: relativeTimeWithPlural,
          d: "дзень",
          dd: relativeTimeWithPlural,
          M: "месяц",
          MM: relativeTimeWithPlural,
          y: "год",
          yy: relativeTimeWithPlural
        },
        meridiemParse: /ночы|раніцы|дня|вечара/,
        isPM: function(input) {
          return /^(дня|вечара)$/.test(input);
        },
        meridiem: function(hour, minute, isLower) {
          if (hour < 4) {
            return "ночы";
          } else if (hour < 12) {
            return "раніцы";
          } else if (hour < 17) {
            return "дня";
          } else {
            return "вечара";
          }
        },
        dayOfMonthOrdinalParse: /\d{1,2}-(і|ы|га)/,
        ordinal: function(number, period) {
          switch (period) {
            case "M":
            case "d":
            case "DDD":
            case "w":
            case "W":
              return (number % 10 === 2 || number % 10 === 3) && number % 100 !== 12 && number % 100 !== 13 ? number + "-і" : number + "-ы";
            case "D":
              return number + "-га";
            default:
              return number;
          }
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 7
          // The week that contains Jan 7th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("bg", {
        months: "януари_февруари_март_април_май_юни_юли_август_септември_октомври_ноември_декември".split(
          "_"
        ),
        monthsShort: "яну_фев_мар_апр_май_юни_юли_авг_сеп_окт_ное_дек".split("_"),
        weekdays: "неделя_понеделник_вторник_сряда_четвъртък_петък_събота".split(
          "_"
        ),
        weekdaysShort: "нед_пон_вто_сря_чет_пет_съб".split("_"),
        weekdaysMin: "нд_пн_вт_ср_чт_пт_сб".split("_"),
        longDateFormat: {
          LT: "H:mm",
          LTS: "H:mm:ss",
          L: "D.MM.YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY H:mm",
          LLLL: "dddd, D MMMM YYYY H:mm"
        },
        calendar: {
          sameDay: "[Днес в] LT",
          nextDay: "[Утре в] LT",
          nextWeek: "dddd [в] LT",
          lastDay: "[Вчера в] LT",
          lastWeek: function() {
            switch (this.day()) {
              case 0:
              case 3:
              case 6:
                return "[Миналата] dddd [в] LT";
              case 1:
              case 2:
              case 4:
              case 5:
                return "[Миналия] dddd [в] LT";
            }
          },
          sameElse: "L"
        },
        relativeTime: {
          future: "след %s",
          past: "преди %s",
          s: "няколко секунди",
          ss: "%d секунди",
          m: "минута",
          mm: "%d минути",
          h: "час",
          hh: "%d часа",
          d: "ден",
          dd: "%d дена",
          w: "седмица",
          ww: "%d седмици",
          M: "месец",
          MM: "%d месеца",
          y: "година",
          yy: "%d години"
        },
        dayOfMonthOrdinalParse: /\d{1,2}-(ев|ен|ти|ви|ри|ми)/,
        ordinal: function(number) {
          var lastDigit = number % 10, last2Digits = number % 100;
          if (number === 0) {
            return number + "-ев";
          } else if (last2Digits === 0) {
            return number + "-ен";
          } else if (last2Digits > 10 && last2Digits < 20) {
            return number + "-ти";
          } else if (lastDigit === 1) {
            return number + "-ви";
          } else if (lastDigit === 2) {
            return number + "-ри";
          } else if (lastDigit === 7 || lastDigit === 8) {
            return number + "-ми";
          } else {
            return number + "-ти";
          }
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 7
          // The week that contains Jan 7th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("bm", {
        months: "Zanwuyekalo_Fewuruyekalo_Marisikalo_Awirilikalo_Mɛkalo_Zuwɛnkalo_Zuluyekalo_Utikalo_Sɛtanburukalo_ɔkutɔburukalo_Nowanburukalo_Desanburukalo".split(
          "_"
        ),
        monthsShort: "Zan_Few_Mar_Awi_Mɛ_Zuw_Zul_Uti_Sɛt_ɔku_Now_Des".split("_"),
        weekdays: "Kari_Ntɛnɛn_Tarata_Araba_Alamisa_Juma_Sibiri".split("_"),
        weekdaysShort: "Kar_Ntɛ_Tar_Ara_Ala_Jum_Sib".split("_"),
        weekdaysMin: "Ka_Nt_Ta_Ar_Al_Ju_Si".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "MMMM [tile] D [san] YYYY",
          LLL: "MMMM [tile] D [san] YYYY [lɛrɛ] HH:mm",
          LLLL: "dddd MMMM [tile] D [san] YYYY [lɛrɛ] HH:mm"
        },
        calendar: {
          sameDay: "[Bi lɛrɛ] LT",
          nextDay: "[Sini lɛrɛ] LT",
          nextWeek: "dddd [don lɛrɛ] LT",
          lastDay: "[Kunu lɛrɛ] LT",
          lastWeek: "dddd [tɛmɛnen lɛrɛ] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "%s kɔnɔ",
          past: "a bɛ %s bɔ",
          s: "sanga dama dama",
          ss: "sekondi %d",
          m: "miniti kelen",
          mm: "miniti %d",
          h: "lɛrɛ kelen",
          hh: "lɛrɛ %d",
          d: "tile kelen",
          dd: "tile %d",
          M: "kalo kelen",
          MM: "kalo %d",
          y: "san kelen",
          yy: "san %d"
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var symbolMap$4 = {
        1: "১",
        2: "২",
        3: "৩",
        4: "৪",
        5: "৫",
        6: "৬",
        7: "৭",
        8: "৮",
        9: "৯",
        0: "০"
      }, numberMap$3 = {
        "১": "1",
        "২": "2",
        "৩": "3",
        "৪": "4",
        "৫": "5",
        "৬": "6",
        "৭": "7",
        "৮": "8",
        "৯": "9",
        "০": "0"
      };
      hooks.defineLocale("bn-bd", {
        months: "জানুয়ারি_ফেব্রুয়ারি_মার্চ_এপ্রিল_মে_জুন_জুলাই_আগস্ট_সেপ্টেম্বর_অক্টোবর_নভেম্বর_ডিসেম্বর".split(
          "_"
        ),
        monthsShort: "জানু_ফেব্রু_মার্চ_এপ্রিল_মে_জুন_জুলাই_আগস্ট_সেপ্ট_অক্টো_নভে_ডিসে".split(
          "_"
        ),
        weekdays: "রবিবার_সোমবার_মঙ্গলবার_বুধবার_বৃহস্পতিবার_শুক্রবার_শনিবার".split(
          "_"
        ),
        weekdaysShort: "রবি_সোম_মঙ্গল_বুধ_বৃহস্পতি_শুক্র_শনি".split("_"),
        weekdaysMin: "রবি_সোম_মঙ্গল_বুধ_বৃহ_শুক্র_শনি".split("_"),
        longDateFormat: {
          LT: "A h:mm সময়",
          LTS: "A h:mm:ss সময়",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY, A h:mm সময়",
          LLLL: "dddd, D MMMM YYYY, A h:mm সময়"
        },
        calendar: {
          sameDay: "[আজ] LT",
          nextDay: "[আগামীকাল] LT",
          nextWeek: "dddd, LT",
          lastDay: "[গতকাল] LT",
          lastWeek: "[গত] dddd, LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "%s পরে",
          past: "%s আগে",
          s: "কয়েক সেকেন্ড",
          ss: "%d সেকেন্ড",
          m: "এক মিনিট",
          mm: "%d মিনিট",
          h: "এক ঘন্টা",
          hh: "%d ঘন্টা",
          d: "এক দিন",
          dd: "%d দিন",
          M: "এক মাস",
          MM: "%d মাস",
          y: "এক বছর",
          yy: "%d বছর"
        },
        preparse: function(string) {
          return string.replace(/[১২৩৪৫৬৭৮৯০]/g, function(match) {
            return numberMap$3[match];
          });
        },
        postformat: function(string) {
          return string.replace(/\d/g, function(match) {
            return symbolMap$4[match];
          });
        },
        meridiemParse: /রাত|ভোর|সকাল|দুপুর|বিকাল|সন্ধ্যা|রাত/,
        meridiemHour: function(hour, meridiem2) {
          if (hour === 12) {
            hour = 0;
          }
          if (meridiem2 === "রাত") {
            return hour < 4 ? hour : hour + 12;
          } else if (meridiem2 === "ভোর") {
            return hour;
          } else if (meridiem2 === "সকাল") {
            return hour;
          } else if (meridiem2 === "দুপুর") {
            return hour >= 3 ? hour : hour + 12;
          } else if (meridiem2 === "বিকাল") {
            return hour + 12;
          } else if (meridiem2 === "সন্ধ্যা") {
            return hour + 12;
          }
        },
        meridiem: function(hour, minute, isLower) {
          if (hour < 4) {
            return "রাত";
          } else if (hour < 6) {
            return "ভোর";
          } else if (hour < 12) {
            return "সকাল";
          } else if (hour < 15) {
            return "দুপুর";
          } else if (hour < 18) {
            return "বিকাল";
          } else if (hour < 20) {
            return "সন্ধ্যা";
          } else {
            return "রাত";
          }
        },
        week: {
          dow: 0,
          // Sunday is the first day of the week.
          doy: 6
          // The week that contains Jan 6th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var symbolMap$5 = {
        1: "১",
        2: "২",
        3: "৩",
        4: "৪",
        5: "৫",
        6: "৬",
        7: "৭",
        8: "৮",
        9: "৯",
        0: "০"
      }, numberMap$4 = {
        "১": "1",
        "২": "2",
        "৩": "3",
        "৪": "4",
        "৫": "5",
        "৬": "6",
        "৭": "7",
        "৮": "8",
        "৯": "9",
        "০": "0"
      };
      hooks.defineLocale("bn", {
        months: "জানুয়ারি_ফেব্রুয়ারি_মার্চ_এপ্রিল_মে_জুন_জুলাই_আগস্ট_সেপ্টেম্বর_অক্টোবর_নভেম্বর_ডিসেম্বর".split(
          "_"
        ),
        monthsShort: "জানু_ফেব্রু_মার্চ_এপ্রিল_মে_জুন_জুলাই_আগস্ট_সেপ্ট_অক্টো_নভে_ডিসে".split(
          "_"
        ),
        weekdays: "রবিবার_সোমবার_মঙ্গলবার_বুধবার_বৃহস্পতিবার_শুক্রবার_শনিবার".split(
          "_"
        ),
        weekdaysShort: "রবি_সোম_মঙ্গল_বুধ_বৃহস্পতি_শুক্র_শনি".split("_"),
        weekdaysMin: "রবি_সোম_মঙ্গল_বুধ_বৃহ_শুক্র_শনি".split("_"),
        longDateFormat: {
          LT: "A h:mm সময়",
          LTS: "A h:mm:ss সময়",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY, A h:mm সময়",
          LLLL: "dddd, D MMMM YYYY, A h:mm সময়"
        },
        calendar: {
          sameDay: "[আজ] LT",
          nextDay: "[আগামীকাল] LT",
          nextWeek: "dddd, LT",
          lastDay: "[গতকাল] LT",
          lastWeek: "[গত] dddd, LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "%s পরে",
          past: "%s আগে",
          s: "কয়েক সেকেন্ড",
          ss: "%d সেকেন্ড",
          m: "এক মিনিট",
          mm: "%d মিনিট",
          h: "এক ঘন্টা",
          hh: "%d ঘন্টা",
          d: "এক দিন",
          dd: "%d দিন",
          M: "এক মাস",
          MM: "%d মাস",
          y: "এক বছর",
          yy: "%d বছর"
        },
        preparse: function(string) {
          return string.replace(/[১২৩৪৫৬৭৮৯০]/g, function(match) {
            return numberMap$4[match];
          });
        },
        postformat: function(string) {
          return string.replace(/\d/g, function(match) {
            return symbolMap$5[match];
          });
        },
        meridiemParse: /রাত|সকাল|দুপুর|বিকাল|রাত/,
        meridiemHour: function(hour, meridiem2) {
          if (hour === 12) {
            hour = 0;
          }
          if (meridiem2 === "রাত" && hour >= 4 || meridiem2 === "দুপুর" && hour < 5 || meridiem2 === "বিকাল") {
            return hour + 12;
          } else {
            return hour;
          }
        },
        meridiem: function(hour, minute, isLower) {
          if (hour < 4) {
            return "রাত";
          } else if (hour < 10) {
            return "সকাল";
          } else if (hour < 17) {
            return "দুপুর";
          } else if (hour < 20) {
            return "বিকাল";
          } else {
            return "রাত";
          }
        },
        week: {
          dow: 0,
          // Sunday is the first day of the week.
          doy: 6
          // The week that contains Jan 6th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var symbolMap$6 = {
        1: "༡",
        2: "༢",
        3: "༣",
        4: "༤",
        5: "༥",
        6: "༦",
        7: "༧",
        8: "༨",
        9: "༩",
        0: "༠"
      }, numberMap$5 = {
        "༡": "1",
        "༢": "2",
        "༣": "3",
        "༤": "4",
        "༥": "5",
        "༦": "6",
        "༧": "7",
        "༨": "8",
        "༩": "9",
        "༠": "0"
      };
      hooks.defineLocale("bo", {
        months: "ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ".split(
          "_"
        ),
        monthsShort: "ཟླ་1_ཟླ་2_ཟླ་3_ཟླ་4_ཟླ་5_ཟླ་6_ཟླ་7_ཟླ་8_ཟླ་9_ཟླ་10_ཟླ་11_ཟླ་12".split(
          "_"
        ),
        monthsShortRegex: /^(ཟླ་\d{1,2})/,
        monthsParseExact: true,
        weekdays: "གཟའ་ཉི་མ་_གཟའ་ཟླ་བ་_གཟའ་མིག་དམར་_གཟའ་ལྷག་པ་_གཟའ་ཕུར་བུ_གཟའ་པ་སངས་_གཟའ་སྤེན་པ་".split(
          "_"
        ),
        weekdaysShort: "ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་".split(
          "_"
        ),
        weekdaysMin: "ཉི_ཟླ_མིག_ལྷག_ཕུར_སངས_སྤེན".split("_"),
        longDateFormat: {
          LT: "A h:mm",
          LTS: "A h:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY, A h:mm",
          LLLL: "dddd, D MMMM YYYY, A h:mm"
        },
        calendar: {
          sameDay: "[དི་རིང] LT",
          nextDay: "[སང་ཉིན] LT",
          nextWeek: "[བདུན་ཕྲག་རྗེས་མ], LT",
          lastDay: "[ཁ་སང] LT",
          lastWeek: "[བདུན་ཕྲག་མཐའ་མ] dddd, LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "%s ལ་",
          past: "%s སྔན་ལ",
          s: "ལམ་སང",
          ss: "%d སྐར་ཆ།",
          m: "སྐར་མ་གཅིག",
          mm: "%d སྐར་མ",
          h: "ཆུ་ཚོད་གཅིག",
          hh: "%d ཆུ་ཚོད",
          d: "ཉིན་གཅིག",
          dd: "%d ཉིན་",
          M: "ཟླ་བ་གཅིག",
          MM: "%d ཟླ་བ",
          y: "ལོ་གཅིག",
          yy: "%d ལོ"
        },
        preparse: function(string) {
          return string.replace(/[༡༢༣༤༥༦༧༨༩༠]/g, function(match) {
            return numberMap$5[match];
          });
        },
        postformat: function(string) {
          return string.replace(/\d/g, function(match) {
            return symbolMap$6[match];
          });
        },
        meridiemParse: /མཚན་མོ|ཞོགས་ཀས|ཉིན་གུང|དགོང་དག|མཚན་མོ/,
        meridiemHour: function(hour, meridiem2) {
          if (hour === 12) {
            hour = 0;
          }
          if (meridiem2 === "མཚན་མོ" && hour >= 4 || meridiem2 === "ཉིན་གུང" && hour < 5 || meridiem2 === "དགོང་དག") {
            return hour + 12;
          } else {
            return hour;
          }
        },
        meridiem: function(hour, minute, isLower) {
          if (hour < 4) {
            return "མཚན་མོ";
          } else if (hour < 10) {
            return "ཞོགས་ཀས";
          } else if (hour < 17) {
            return "ཉིན་གུང";
          } else if (hour < 20) {
            return "དགོང་དག";
          } else {
            return "མཚན་མོ";
          }
        },
        week: {
          dow: 0,
          // Sunday is the first day of the week.
          doy: 6
          // The week that contains Jan 6th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      function relativeTimeWithMutation(number, withoutSuffix, key) {
        var format2 = {
          mm: "munutenn",
          MM: "miz",
          dd: "devezh"
        };
        return number + " " + mutation(format2[key], number);
      }
      function specialMutationForYears(number) {
        switch (lastNumber(number)) {
          case 1:
          case 3:
          case 4:
          case 5:
          case 9:
            return number + " bloaz";
          default:
            return number + " vloaz";
        }
      }
      function lastNumber(number) {
        if (number > 9) {
          return lastNumber(number % 10);
        }
        return number;
      }
      function mutation(text, number) {
        if (number === 2) {
          return softMutation(text);
        }
        return text;
      }
      function softMutation(text) {
        var mutationTable = {
          m: "v",
          b: "v",
          d: "z"
        };
        if (mutationTable[text.charAt(0)] === void 0) {
          return text;
        }
        return mutationTable[text.charAt(0)] + text.substring(1);
      }
      var monthsParse = [
        /^gen/i,
        /^c[ʼ\']hwe/i,
        /^meu/i,
        /^ebr/i,
        /^mae/i,
        /^(mez|eve)/i,
        /^gou/i,
        /^eos/i,
        /^gwe/i,
        /^her/i,
        /^du/i,
        /^ker/i
      ], monthsRegex$1 = /^(genver|c[ʼ\']hwevrer|meurzh|ebrel|mae|mezheven|gouere|eost|gwengolo|here|du|kerzu|gen|c[ʼ\']hwe|meu|ebr|mae|eve|gou|eos|gwe|her|du|ker)/i, monthsStrictRegex = /^(genver|c[ʼ\']hwevrer|meurzh|ebrel|mae|mezheven|gouere|eost|gwengolo|here|du|kerzu)/i, monthsShortStrictRegex = /^(gen|c[ʼ\']hwe|meu|ebr|mae|eve|gou|eos|gwe|her|du|ker)/i, fullWeekdaysParse = [
        /^sul/i,
        /^lun/i,
        /^meurzh/i,
        /^merc[ʼ\']her/i,
        /^yaou/i,
        /^gwener/i,
        /^sadorn/i
      ], shortWeekdaysParse = [
        /^Sul/i,
        /^Lun/i,
        /^Meu/i,
        /^Mer/i,
        /^Yao/i,
        /^Gwe/i,
        /^Sad/i
      ], minWeekdaysParse = [
        /^Su/i,
        /^Lu/i,
        /^Me([^r]|$)/i,
        /^Mer/i,
        /^Ya/i,
        /^Gw/i,
        /^Sa/i
      ];
      hooks.defineLocale("br", {
        months: "Genver_Cʼhwevrer_Meurzh_Ebrel_Mae_Mezheven_Gouere_Eost_Gwengolo_Here_Du_Kerzu".split(
          "_"
        ),
        monthsShort: "Gen_Cʼhwe_Meu_Ebr_Mae_Eve_Gou_Eos_Gwe_Her_Du_Ker".split("_"),
        weekdays: "Sul_Lun_Meurzh_Mercʼher_Yaou_Gwener_Sadorn".split("_"),
        weekdaysShort: "Sul_Lun_Meu_Mer_Yao_Gwe_Sad".split("_"),
        weekdaysMin: "Su_Lu_Me_Mer_Ya_Gw_Sa".split("_"),
        weekdaysParse: minWeekdaysParse,
        fullWeekdaysParse,
        shortWeekdaysParse,
        minWeekdaysParse,
        monthsRegex: monthsRegex$1,
        monthsShortRegex: monthsRegex$1,
        monthsStrictRegex,
        monthsShortStrictRegex,
        monthsParse,
        longMonthsParse: monthsParse,
        shortMonthsParse: monthsParse,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D [a viz] MMMM YYYY",
          LLL: "D [a viz] MMMM YYYY HH:mm",
          LLLL: "dddd, D [a viz] MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[Hiziv da] LT",
          nextDay: "[Warcʼhoazh da] LT",
          nextWeek: "dddd [da] LT",
          lastDay: "[Decʼh da] LT",
          lastWeek: "dddd [paset da] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "a-benn %s",
          past: "%s ʼzo",
          s: "un nebeud segondennoù",
          ss: "%d eilenn",
          m: "ur vunutenn",
          mm: relativeTimeWithMutation,
          h: "un eur",
          hh: "%d eur",
          d: "un devezh",
          dd: relativeTimeWithMutation,
          M: "ur miz",
          MM: relativeTimeWithMutation,
          y: "ur bloaz",
          yy: specialMutationForYears
        },
        dayOfMonthOrdinalParse: /\d{1,2}(añ|vet)/,
        ordinal: function(number) {
          var output = number === 1 ? "añ" : "vet";
          return number + output;
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        },
        meridiemParse: /a.m.|g.m./,
        // goude merenn | a-raok merenn
        isPM: function(token2) {
          return token2 === "g.m.";
        },
        meridiem: function(hour, minute, isLower) {
          return hour < 12 ? "a.m." : "g.m.";
        }
      });
      //! moment.js locale configuration
      function processRelativeTime(number, withoutSuffix, key, isFuture) {
        switch (key) {
          case "m":
            return withoutSuffix ? "jedna minuta" : isFuture ? "jednu minutu" : "jedne minute";
        }
      }
      function translate2(number, withoutSuffix, key) {
        var result = number + " ";
        switch (key) {
          case "ss":
            if (number === 1) {
              result += "sekunda";
            } else if (number === 2 || number === 3 || number === 4) {
              result += "sekunde";
            } else {
              result += "sekundi";
            }
            return result;
          case "mm":
            if (number === 1) {
              result += "minuta";
            } else if (number === 2 || number === 3 || number === 4) {
              result += "minute";
            } else {
              result += "minuta";
            }
            return result;
          case "h":
            return withoutSuffix ? "jedan sat" : "jedan sat";
          case "hh":
            if (number === 1) {
              result += "sat";
            } else if (number === 2 || number === 3 || number === 4) {
              result += "sata";
            } else {
              result += "sati";
            }
            return result;
          case "dd":
            if (number === 1) {
              result += "dan";
            } else {
              result += "dana";
            }
            return result;
          case "MM":
            if (number === 1) {
              result += "mjesec";
            } else if (number === 2 || number === 3 || number === 4) {
              result += "mjeseca";
            } else {
              result += "mjeseci";
            }
            return result;
          case "yy":
            if (number === 1) {
              result += "godina";
            } else if (number === 2 || number === 3 || number === 4) {
              result += "godine";
            } else {
              result += "godina";
            }
            return result;
        }
      }
      hooks.defineLocale("bs", {
        months: "januar_februar_mart_april_maj_juni_juli_august_septembar_oktobar_novembar_decembar".split(
          "_"
        ),
        monthsShort: "jan._feb._mar._apr._maj._jun._jul._aug._sep._okt._nov._dec.".split(
          "_"
        ),
        monthsParseExact: true,
        weekdays: "nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split(
          "_"
        ),
        weekdaysShort: "ned._pon._uto._sri._čet._pet._sub.".split("_"),
        weekdaysMin: "ne_po_ut_sr_če_pe_su".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "H:mm",
          LTS: "H:mm:ss",
          L: "DD.MM.YYYY",
          LL: "D. MMMM YYYY",
          LLL: "D. MMMM YYYY H:mm",
          LLLL: "dddd, D. MMMM YYYY H:mm"
        },
        calendar: {
          sameDay: "[danas u] LT",
          nextDay: "[sutra u] LT",
          nextWeek: function() {
            switch (this.day()) {
              case 0:
                return "[u] [nedjelju] [u] LT";
              case 3:
                return "[u] [srijedu] [u] LT";
              case 6:
                return "[u] [subotu] [u] LT";
              case 1:
              case 2:
              case 4:
              case 5:
                return "[u] dddd [u] LT";
            }
          },
          lastDay: "[jučer u] LT",
          lastWeek: function() {
            switch (this.day()) {
              case 0:
              case 3:
                return "[prošlu] dddd [u] LT";
              case 6:
                return "[prošle] [subote] [u] LT";
              case 1:
              case 2:
              case 4:
              case 5:
                return "[prošli] dddd [u] LT";
            }
          },
          sameElse: "L"
        },
        relativeTime: {
          future: "za %s",
          past: "prije %s",
          s: "par sekundi",
          ss: translate2,
          m: processRelativeTime,
          mm: translate2,
          h: translate2,
          hh: translate2,
          d: "dan",
          dd: translate2,
          M: "mjesec",
          MM: translate2,
          y: "godinu",
          yy: translate2
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal: "%d.",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 7
          // The week that contains Jan 7th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("ca", {
        months: {
          standalone: "gener_febrer_març_abril_maig_juny_juliol_agost_setembre_octubre_novembre_desembre".split(
            "_"
          ),
          format: "de gener_de febrer_de març_d'abril_de maig_de juny_de juliol_d'agost_de setembre_d'octubre_de novembre_de desembre".split(
            "_"
          ),
          isFormat: /D[oD]?(\s)+MMMM/
        },
        monthsShort: "gen._febr._març_abr._maig_juny_jul._ag._set._oct._nov._des.".split(
          "_"
        ),
        monthsParseExact: true,
        weekdays: "diumenge_dilluns_dimarts_dimecres_dijous_divendres_dissabte".split(
          "_"
        ),
        weekdaysShort: "dg._dl._dt._dc._dj._dv._ds.".split("_"),
        weekdaysMin: "dg_dl_dt_dc_dj_dv_ds".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "H:mm",
          LTS: "H:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM [de] YYYY",
          ll: "D MMM YYYY",
          LLL: "D MMMM [de] YYYY [a les] H:mm",
          lll: "D MMM YYYY, H:mm",
          LLLL: "dddd D MMMM [de] YYYY [a les] H:mm",
          llll: "ddd D MMM YYYY, H:mm"
        },
        calendar: {
          sameDay: function() {
            return "[avui a " + (this.hours() !== 1 ? "les" : "la") + "] LT";
          },
          nextDay: function() {
            return "[demà a " + (this.hours() !== 1 ? "les" : "la") + "] LT";
          },
          nextWeek: function() {
            return "dddd [a " + (this.hours() !== 1 ? "les" : "la") + "] LT";
          },
          lastDay: function() {
            return "[ahir a " + (this.hours() !== 1 ? "les" : "la") + "] LT";
          },
          lastWeek: function() {
            return "[el] dddd [passat a " + (this.hours() !== 1 ? "les" : "la") + "] LT";
          },
          sameElse: "L"
        },
        relativeTime: {
          future: "d'aquí %s",
          past: "fa %s",
          s: "uns segons",
          ss: "%d segons",
          m: "un minut",
          mm: "%d minuts",
          h: "una hora",
          hh: "%d hores",
          d: "un dia",
          dd: "%d dies",
          M: "un mes",
          MM: "%d mesos",
          y: "un any",
          yy: "%d anys"
        },
        dayOfMonthOrdinalParse: /\d{1,2}(r|n|t|è|a)/,
        ordinal: function(number, period) {
          var output = number === 1 ? "r" : number === 2 ? "n" : number === 3 ? "r" : number === 4 ? "t" : "è";
          if (period === "w" || period === "W") {
            output = "a";
          }
          return number + output;
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var months$4 = {
        standalone: "leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec".split(
          "_"
        ),
        format: "ledna_února_března_dubna_května_června_července_srpna_září_října_listopadu_prosince".split(
          "_"
        ),
        isFormat: /DD?[o.]?(\[[^\[\]]*\]|\s)+MMMM/
      }, monthsShort = "led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro".split("_"), monthsParse$1 = [
        /^led/i,
        /^úno/i,
        /^bře/i,
        /^dub/i,
        /^kvě/i,
        /^(čvn|červen$|června)/i,
        /^(čvc|červenec|července)/i,
        /^srp/i,
        /^zář/i,
        /^říj/i,
        /^lis/i,
        /^pro/i
      ], monthsRegex$2 = /^(leden|únor|březen|duben|květen|červenec|července|červen|června|srpen|září|říjen|listopad|prosinec|led|úno|bře|dub|kvě|čvn|čvc|srp|zář|říj|lis|pro)/i;
      function plural$1(n) {
        return n > 1 && n < 5 && ~~(n / 10) !== 1;
      }
      function translate$1(number, withoutSuffix, key, isFuture) {
        var result = number + " ";
        switch (key) {
          case "s":
            return withoutSuffix || isFuture ? "pár sekund" : "pár sekundami";
          case "ss":
            if (withoutSuffix || isFuture) {
              return result + (plural$1(number) ? "sekundy" : "sekund");
            } else {
              return result + "sekundami";
            }
          case "m":
            return withoutSuffix ? "minuta" : isFuture ? "minutu" : "minutou";
          case "mm":
            if (withoutSuffix || isFuture) {
              return result + (plural$1(number) ? "minuty" : "minut");
            } else {
              return result + "minutami";
            }
          case "h":
            return withoutSuffix ? "hodina" : isFuture ? "hodinu" : "hodinou";
          case "hh":
            if (withoutSuffix || isFuture) {
              return result + (plural$1(number) ? "hodiny" : "hodin");
            } else {
              return result + "hodinami";
            }
          case "d":
            return withoutSuffix || isFuture ? "den" : "dnem";
          case "dd":
            if (withoutSuffix || isFuture) {
              return result + (plural$1(number) ? "dny" : "dní");
            } else {
              return result + "dny";
            }
          case "M":
            return withoutSuffix || isFuture ? "měsíc" : "měsícem";
          case "MM":
            if (withoutSuffix || isFuture) {
              return result + (plural$1(number) ? "měsíce" : "měsíců");
            } else {
              return result + "měsíci";
            }
          case "y":
            return withoutSuffix || isFuture ? "rok" : "rokem";
          case "yy":
            if (withoutSuffix || isFuture) {
              return result + (plural$1(number) ? "roky" : "let");
            } else {
              return result + "lety";
            }
        }
      }
      hooks.defineLocale("cs", {
        months: months$4,
        monthsShort,
        monthsRegex: monthsRegex$2,
        monthsShortRegex: monthsRegex$2,
        // NOTE: 'červen' is substring of 'červenec'; therefore 'červenec' must precede 'červen' in the regex to be fully matched.
        // Otherwise parser matches '1. červenec' as '1. červen' + 'ec'.
        monthsStrictRegex: /^(leden|ledna|února|únor|březen|března|duben|dubna|květen|května|červenec|července|červen|června|srpen|srpna|září|říjen|října|listopadu|listopad|prosinec|prosince)/i,
        monthsShortStrictRegex: /^(led|úno|bře|dub|kvě|čvn|čvc|srp|zář|říj|lis|pro)/i,
        monthsParse: monthsParse$1,
        longMonthsParse: monthsParse$1,
        shortMonthsParse: monthsParse$1,
        weekdays: "neděle_pondělí_úterý_středa_čtvrtek_pátek_sobota".split("_"),
        weekdaysShort: "ne_po_út_st_čt_pá_so".split("_"),
        weekdaysMin: "ne_po_út_st_čt_pá_so".split("_"),
        longDateFormat: {
          LT: "H:mm",
          LTS: "H:mm:ss",
          L: "DD.MM.YYYY",
          LL: "D. MMMM YYYY",
          LLL: "D. MMMM YYYY H:mm",
          LLLL: "dddd D. MMMM YYYY H:mm",
          l: "D. M. YYYY"
        },
        calendar: {
          sameDay: "[dnes v] LT",
          nextDay: "[zítra v] LT",
          nextWeek: function() {
            switch (this.day()) {
              case 0:
                return "[v neděli v] LT";
              case 1:
              case 2:
                return "[v] dddd [v] LT";
              case 3:
                return "[ve středu v] LT";
              case 4:
                return "[ve čtvrtek v] LT";
              case 5:
                return "[v pátek v] LT";
              case 6:
                return "[v sobotu v] LT";
            }
          },
          lastDay: "[včera v] LT",
          lastWeek: function() {
            switch (this.day()) {
              case 0:
                return "[minulou neděli v] LT";
              case 1:
              case 2:
                return "[minulé] dddd [v] LT";
              case 3:
                return "[minulou středu v] LT";
              case 4:
              case 5:
                return "[minulý] dddd [v] LT";
              case 6:
                return "[minulou sobotu v] LT";
            }
          },
          sameElse: "L"
        },
        relativeTime: {
          future: "za %s",
          past: "před %s",
          s: translate$1,
          ss: translate$1,
          m: translate$1,
          mm: translate$1,
          h: translate$1,
          hh: translate$1,
          d: translate$1,
          dd: translate$1,
          M: translate$1,
          MM: translate$1,
          y: translate$1,
          yy: translate$1
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal: "%d.",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("cv", {
        months: "кӑрлач_нарӑс_пуш_ака_май_ҫӗртме_утӑ_ҫурла_авӑн_юпа_чӳк_раштав".split(
          "_"
        ),
        monthsShort: "кӑр_нар_пуш_ака_май_ҫӗр_утӑ_ҫур_авн_юпа_чӳк_раш".split("_"),
        weekdays: "вырсарникун_тунтикун_ытларикун_юнкун_кӗҫнерникун_эрнекун_шӑматкун".split(
          "_"
        ),
        weekdaysShort: "выр_тун_ытл_юн_кӗҫ_эрн_шӑм".split("_"),
        weekdaysMin: "вр_тн_ыт_юн_кҫ_эр_шм".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD-MM-YYYY",
          LL: "YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ]",
          LLL: "YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], HH:mm",
          LLLL: "dddd, YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], HH:mm"
        },
        calendar: {
          sameDay: "[Паян] LT [сехетре]",
          nextDay: "[Ыран] LT [сехетре]",
          lastDay: "[Ӗнер] LT [сехетре]",
          nextWeek: "[Ҫитес] dddd LT [сехетре]",
          lastWeek: "[Иртнӗ] dddd LT [сехетре]",
          sameElse: "L"
        },
        relativeTime: {
          future: function(output) {
            var affix = /сехет$/i.exec(output) ? "рен" : /ҫул$/i.exec(output) ? "тан" : "ран";
            return output + affix;
          },
          past: "%s каялла",
          s: "пӗр-ик ҫеккунт",
          ss: "%d ҫеккунт",
          m: "пӗр минут",
          mm: "%d минут",
          h: "пӗр сехет",
          hh: "%d сехет",
          d: "пӗр кун",
          dd: "%d кун",
          M: "пӗр уйӑх",
          MM: "%d уйӑх",
          y: "пӗр ҫул",
          yy: "%d ҫул"
        },
        dayOfMonthOrdinalParse: /\d{1,2}-мӗш/,
        ordinal: "%d-мӗш",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 7
          // The week that contains Jan 7th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("cy", {
        months: "Ionawr_Chwefror_Mawrth_Ebrill_Mai_Mehefin_Gorffennaf_Awst_Medi_Hydref_Tachwedd_Rhagfyr".split(
          "_"
        ),
        monthsShort: "Ion_Chwe_Maw_Ebr_Mai_Meh_Gor_Aws_Med_Hyd_Tach_Rhag".split(
          "_"
        ),
        weekdays: "Dydd Sul_Dydd Llun_Dydd Mawrth_Dydd Mercher_Dydd Iau_Dydd Gwener_Dydd Sadwrn".split(
          "_"
        ),
        weekdaysShort: "Sul_Llun_Maw_Mer_Iau_Gwe_Sad".split("_"),
        weekdaysMin: "Su_Ll_Ma_Me_Ia_Gw_Sa".split("_"),
        weekdaysParseExact: true,
        // time formats are the same as en-gb
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd, D MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[Heddiw am] LT",
          nextDay: "[Yfory am] LT",
          nextWeek: "dddd [am] LT",
          lastDay: "[Ddoe am] LT",
          lastWeek: "dddd [diwethaf am] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "mewn %s",
          past: "%s yn ôl",
          s: "ychydig eiliadau",
          ss: "%d eiliad",
          m: "munud",
          mm: "%d munud",
          h: "awr",
          hh: "%d awr",
          d: "diwrnod",
          dd: "%d diwrnod",
          M: "mis",
          MM: "%d mis",
          y: "blwyddyn",
          yy: "%d flynedd"
        },
        dayOfMonthOrdinalParse: /\d{1,2}(fed|ain|af|il|ydd|ed|eg)/,
        // traditional ordinal numbers above 31 are not commonly used in colloquial Welsh
        ordinal: function(number) {
          var b = number, output = "", lookup = [
            "",
            "af",
            "il",
            "ydd",
            "ydd",
            "ed",
            "ed",
            "ed",
            "fed",
            "fed",
            "fed",
            // 1af to 10fed
            "eg",
            "fed",
            "eg",
            "eg",
            "fed",
            "eg",
            "eg",
            "fed",
            "eg",
            "fed"
            // 11eg to 20fed
          ];
          if (b > 20) {
            if (b === 40 || b === 50 || b === 60 || b === 80 || b === 100) {
              output = "fed";
            } else {
              output = "ain";
            }
          } else if (b > 0) {
            output = lookup[b];
          }
          return number + output;
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("da", {
        months: "januar_februar_marts_april_maj_juni_juli_august_september_oktober_november_december".split(
          "_"
        ),
        monthsShort: "jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),
        weekdays: "søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),
        weekdaysShort: "søn_man_tir_ons_tor_fre_lør".split("_"),
        weekdaysMin: "sø_ma_ti_on_to_fr_lø".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD.MM.YYYY",
          LL: "D. MMMM YYYY",
          LLL: "D. MMMM YYYY HH:mm",
          LLLL: "dddd [d.] D. MMMM YYYY [kl.] HH:mm"
        },
        calendar: {
          sameDay: "[i dag kl.] LT",
          nextDay: "[i morgen kl.] LT",
          nextWeek: "på dddd [kl.] LT",
          lastDay: "[i går kl.] LT",
          lastWeek: "[i] dddd[s kl.] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "om %s",
          past: "%s siden",
          s: "få sekunder",
          ss: "%d sekunder",
          m: "et minut",
          mm: "%d minutter",
          h: "en time",
          hh: "%d timer",
          d: "en dag",
          dd: "%d dage",
          M: "en måned",
          MM: "%d måneder",
          y: "et år",
          yy: "%d år"
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal: "%d.",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      function processRelativeTime$1(number, withoutSuffix, key, isFuture) {
        var format2 = {
          m: ["eine Minute", "einer Minute"],
          h: ["eine Stunde", "einer Stunde"],
          d: ["ein Tag", "einem Tag"],
          dd: [number + " Tage", number + " Tagen"],
          w: ["eine Woche", "einer Woche"],
          M: ["ein Monat", "einem Monat"],
          MM: [number + " Monate", number + " Monaten"],
          y: ["ein Jahr", "einem Jahr"],
          yy: [number + " Jahre", number + " Jahren"]
        };
        return withoutSuffix ? format2[key][0] : format2[key][1];
      }
      hooks.defineLocale("de-at", {
        months: "Jänner_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split(
          "_"
        ),
        monthsShort: "Jän._Feb._März_Apr._Mai_Juni_Juli_Aug._Sep._Okt._Nov._Dez.".split("_"),
        monthsParseExact: true,
        weekdays: "Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split(
          "_"
        ),
        weekdaysShort: "So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),
        weekdaysMin: "So_Mo_Di_Mi_Do_Fr_Sa".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD.MM.YYYY",
          LL: "D. MMMM YYYY",
          LLL: "D. MMMM YYYY HH:mm",
          LLLL: "dddd, D. MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[heute um] LT [Uhr]",
          sameElse: "L",
          nextDay: "[morgen um] LT [Uhr]",
          nextWeek: "dddd [um] LT [Uhr]",
          lastDay: "[gestern um] LT [Uhr]",
          lastWeek: "[letzten] dddd [um] LT [Uhr]"
        },
        relativeTime: {
          future: "in %s",
          past: "vor %s",
          s: "ein paar Sekunden",
          ss: "%d Sekunden",
          m: processRelativeTime$1,
          mm: "%d Minuten",
          h: processRelativeTime$1,
          hh: "%d Stunden",
          d: processRelativeTime$1,
          dd: processRelativeTime$1,
          w: processRelativeTime$1,
          ww: "%d Wochen",
          M: processRelativeTime$1,
          MM: processRelativeTime$1,
          y: processRelativeTime$1,
          yy: processRelativeTime$1
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal: "%d.",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      function processRelativeTime$2(number, withoutSuffix, key, isFuture) {
        var format2 = {
          m: ["eine Minute", "einer Minute"],
          h: ["eine Stunde", "einer Stunde"],
          d: ["ein Tag", "einem Tag"],
          dd: [number + " Tage", number + " Tagen"],
          w: ["eine Woche", "einer Woche"],
          M: ["ein Monat", "einem Monat"],
          MM: [number + " Monate", number + " Monaten"],
          y: ["ein Jahr", "einem Jahr"],
          yy: [number + " Jahre", number + " Jahren"]
        };
        return withoutSuffix ? format2[key][0] : format2[key][1];
      }
      hooks.defineLocale("de-ch", {
        months: "Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split(
          "_"
        ),
        monthsShort: "Jan._Feb._März_Apr._Mai_Juni_Juli_Aug._Sep._Okt._Nov._Dez.".split("_"),
        monthsParseExact: true,
        weekdays: "Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split(
          "_"
        ),
        weekdaysShort: "So_Mo_Di_Mi_Do_Fr_Sa".split("_"),
        weekdaysMin: "So_Mo_Di_Mi_Do_Fr_Sa".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD.MM.YYYY",
          LL: "D. MMMM YYYY",
          LLL: "D. MMMM YYYY HH:mm",
          LLLL: "dddd, D. MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[heute um] LT [Uhr]",
          sameElse: "L",
          nextDay: "[morgen um] LT [Uhr]",
          nextWeek: "dddd [um] LT [Uhr]",
          lastDay: "[gestern um] LT [Uhr]",
          lastWeek: "[letzten] dddd [um] LT [Uhr]"
        },
        relativeTime: {
          future: "in %s",
          past: "vor %s",
          s: "ein paar Sekunden",
          ss: "%d Sekunden",
          m: processRelativeTime$2,
          mm: "%d Minuten",
          h: processRelativeTime$2,
          hh: "%d Stunden",
          d: processRelativeTime$2,
          dd: processRelativeTime$2,
          w: processRelativeTime$2,
          ww: "%d Wochen",
          M: processRelativeTime$2,
          MM: processRelativeTime$2,
          y: processRelativeTime$2,
          yy: processRelativeTime$2
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal: "%d.",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      function processRelativeTime$3(number, withoutSuffix, key, isFuture) {
        var format2 = {
          m: ["eine Minute", "einer Minute"],
          h: ["eine Stunde", "einer Stunde"],
          d: ["ein Tag", "einem Tag"],
          dd: [number + " Tage", number + " Tagen"],
          w: ["eine Woche", "einer Woche"],
          M: ["ein Monat", "einem Monat"],
          MM: [number + " Monate", number + " Monaten"],
          y: ["ein Jahr", "einem Jahr"],
          yy: [number + " Jahre", number + " Jahren"]
        };
        return withoutSuffix ? format2[key][0] : format2[key][1];
      }
      hooks.defineLocale("de", {
        months: "Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split(
          "_"
        ),
        monthsShort: "Jan._Feb._März_Apr._Mai_Juni_Juli_Aug._Sep._Okt._Nov._Dez.".split("_"),
        monthsParseExact: true,
        weekdays: "Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split(
          "_"
        ),
        weekdaysShort: "So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),
        weekdaysMin: "So_Mo_Di_Mi_Do_Fr_Sa".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD.MM.YYYY",
          LL: "D. MMMM YYYY",
          LLL: "D. MMMM YYYY HH:mm",
          LLLL: "dddd, D. MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[heute um] LT [Uhr]",
          sameElse: "L",
          nextDay: "[morgen um] LT [Uhr]",
          nextWeek: "dddd [um] LT [Uhr]",
          lastDay: "[gestern um] LT [Uhr]",
          lastWeek: "[letzten] dddd [um] LT [Uhr]"
        },
        relativeTime: {
          future: "in %s",
          past: "vor %s",
          s: "ein paar Sekunden",
          ss: "%d Sekunden",
          m: processRelativeTime$3,
          mm: "%d Minuten",
          h: processRelativeTime$3,
          hh: "%d Stunden",
          d: processRelativeTime$3,
          dd: processRelativeTime$3,
          w: processRelativeTime$3,
          ww: "%d Wochen",
          M: processRelativeTime$3,
          MM: processRelativeTime$3,
          y: processRelativeTime$3,
          yy: processRelativeTime$3
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal: "%d.",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var months$5 = [
        "ޖެނުއަރީ",
        "ފެބްރުއަރީ",
        "މާރިޗު",
        "އޭޕްރީލު",
        "މޭ",
        "ޖޫން",
        "ޖުލައި",
        "އޯގަސްޓު",
        "ސެޕްޓެމްބަރު",
        "އޮކްޓޯބަރު",
        "ނޮވެމްބަރު",
        "ޑިސެމްބަރު"
      ], weekdays = [
        "އާދިއްތަ",
        "ހޯމަ",
        "އަންގާރަ",
        "ބުދަ",
        "ބުރާސްފަތި",
        "ހުކުރު",
        "ހޮނިހިރު"
      ];
      hooks.defineLocale("dv", {
        months: months$5,
        monthsShort: months$5,
        weekdays,
        weekdaysShort: weekdays,
        weekdaysMin: "އާދި_ހޯމަ_އަން_ބުދަ_ބުރާ_ހުކު_ހޮނި".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "D/M/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd D MMMM YYYY HH:mm"
        },
        meridiemParse: /މކ|މފ/,
        isPM: function(input) {
          return "މފ" === input;
        },
        meridiem: function(hour, minute, isLower) {
          if (hour < 12) {
            return "މކ";
          } else {
            return "މފ";
          }
        },
        calendar: {
          sameDay: "[މިއަދު] LT",
          nextDay: "[މާދަމާ] LT",
          nextWeek: "dddd LT",
          lastDay: "[އިއްޔެ] LT",
          lastWeek: "[ފާއިތުވި] dddd LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "ތެރޭގައި %s",
          past: "ކުރިން %s",
          s: "ސިކުންތުކޮޅެއް",
          ss: "d% ސިކުންތު",
          m: "މިނިޓެއް",
          mm: "މިނިޓު %d",
          h: "ގަޑިއިރެއް",
          hh: "ގަޑިއިރު %d",
          d: "ދުވަހެއް",
          dd: "ދުވަސް %d",
          M: "މަހެއް",
          MM: "މަސް %d",
          y: "އަހަރެއް",
          yy: "އަހަރު %d"
        },
        preparse: function(string) {
          return string.replace(/،/g, ",");
        },
        postformat: function(string) {
          return string.replace(/,/g, "،");
        },
        week: {
          dow: 7,
          // Sunday is the first day of the week.
          doy: 12
          // The week that contains Jan 12th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      function isFunction$1(input) {
        return typeof Function !== "undefined" && input instanceof Function || Object.prototype.toString.call(input) === "[object Function]";
      }
      hooks.defineLocale("el", {
        monthsNominativeEl: "Ιανουάριος_Φεβρουάριος_Μάρτιος_Απρίλιος_Μάιος_Ιούνιος_Ιούλιος_Αύγουστος_Σεπτέμβριος_Οκτώβριος_Νοέμβριος_Δεκέμβριος".split(
          "_"
        ),
        monthsGenitiveEl: "Ιανουαρίου_Φεβρουαρίου_Μαρτίου_Απριλίου_Μαΐου_Ιουνίου_Ιουλίου_Αυγούστου_Σεπτεμβρίου_Οκτωβρίου_Νοεμβρίου_Δεκεμβρίου".split(
          "_"
        ),
        months: function(momentToFormat, format2) {
          if (!momentToFormat) {
            return this._monthsNominativeEl;
          } else if (typeof format2 === "string" && /D/.test(format2.substring(0, format2.indexOf("MMMM")))) {
            return this._monthsGenitiveEl[momentToFormat.month()];
          } else {
            return this._monthsNominativeEl[momentToFormat.month()];
          }
        },
        monthsShort: "Ιαν_Φεβ_Μαρ_Απρ_Μαϊ_Ιουν_Ιουλ_Αυγ_Σεπ_Οκτ_Νοε_Δεκ".split("_"),
        weekdays: "Κυριακή_Δευτέρα_Τρίτη_Τετάρτη_Πέμπτη_Παρασκευή_Σάββατο".split(
          "_"
        ),
        weekdaysShort: "Κυρ_Δευ_Τρι_Τετ_Πεμ_Παρ_Σαβ".split("_"),
        weekdaysMin: "Κυ_Δε_Τρ_Τε_Πε_Πα_Σα".split("_"),
        meridiem: function(hours2, minutes2, isLower) {
          if (hours2 > 11) {
            return isLower ? "μμ" : "ΜΜ";
          } else {
            return isLower ? "πμ" : "ΠΜ";
          }
        },
        isPM: function(input) {
          return (input + "").toLowerCase()[0] === "μ";
        },
        meridiemParse: /[ΠΜ]\.?Μ?\.?/i,
        longDateFormat: {
          LT: "h:mm A",
          LTS: "h:mm:ss A",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY h:mm A",
          LLLL: "dddd, D MMMM YYYY h:mm A"
        },
        calendarEl: {
          sameDay: "[Σήμερα {}] LT",
          nextDay: "[Αύριο {}] LT",
          nextWeek: "dddd [{}] LT",
          lastDay: "[Χθες {}] LT",
          lastWeek: function() {
            switch (this.day()) {
              case 6:
                return "[το προηγούμενο] dddd [{}] LT";
              default:
                return "[την προηγούμενη] dddd [{}] LT";
            }
          },
          sameElse: "L"
        },
        calendar: function(key, mom) {
          var output = this._calendarEl[key], hours2 = mom && mom.hours();
          if (isFunction$1(output)) {
            output = output.apply(mom);
          }
          return output.replace("{}", hours2 % 12 === 1 ? "στη" : "στις");
        },
        relativeTime: {
          future: "σε %s",
          past: "%s πριν",
          s: "λίγα δευτερόλεπτα",
          ss: "%d δευτερόλεπτα",
          m: "ένα λεπτό",
          mm: "%d λεπτά",
          h: "μία ώρα",
          hh: "%d ώρες",
          d: "μία μέρα",
          dd: "%d μέρες",
          M: "ένας μήνας",
          MM: "%d μήνες",
          y: "ένας χρόνος",
          yy: "%d χρόνια"
        },
        dayOfMonthOrdinalParse: /\d{1,2}η/,
        ordinal: "%dη",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4st is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("en-au", {
        months: "January_February_March_April_May_June_July_August_September_October_November_December".split(
          "_"
        ),
        monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split(
          "_"
        ),
        weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        longDateFormat: {
          LT: "h:mm A",
          LTS: "h:mm:ss A",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY h:mm A",
          LLLL: "dddd, D MMMM YYYY h:mm A"
        },
        calendar: {
          sameDay: "[Today at] LT",
          nextDay: "[Tomorrow at] LT",
          nextWeek: "dddd [at] LT",
          lastDay: "[Yesterday at] LT",
          lastWeek: "[Last] dddd [at] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "in %s",
          past: "%s ago",
          s: "a few seconds",
          ss: "%d seconds",
          m: "a minute",
          mm: "%d minutes",
          h: "an hour",
          hh: "%d hours",
          d: "a day",
          dd: "%d days",
          M: "a month",
          MM: "%d months",
          y: "a year",
          yy: "%d years"
        },
        dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
        ordinal: function(number) {
          var b = number % 10, output = ~~(number % 100 / 10) === 1 ? "th" : b === 1 ? "st" : b === 2 ? "nd" : b === 3 ? "rd" : "th";
          return number + output;
        },
        week: {
          dow: 0,
          // Sunday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("en-ca", {
        months: "January_February_March_April_May_June_July_August_September_October_November_December".split(
          "_"
        ),
        monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split(
          "_"
        ),
        weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        longDateFormat: {
          LT: "h:mm A",
          LTS: "h:mm:ss A",
          L: "YYYY-MM-DD",
          LL: "MMMM D, YYYY",
          LLL: "MMMM D, YYYY h:mm A",
          LLLL: "dddd, MMMM D, YYYY h:mm A"
        },
        calendar: {
          sameDay: "[Today at] LT",
          nextDay: "[Tomorrow at] LT",
          nextWeek: "dddd [at] LT",
          lastDay: "[Yesterday at] LT",
          lastWeek: "[Last] dddd [at] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "in %s",
          past: "%s ago",
          s: "a few seconds",
          ss: "%d seconds",
          m: "a minute",
          mm: "%d minutes",
          h: "an hour",
          hh: "%d hours",
          d: "a day",
          dd: "%d days",
          M: "a month",
          MM: "%d months",
          y: "a year",
          yy: "%d years"
        },
        dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
        ordinal: function(number) {
          var b = number % 10, output = ~~(number % 100 / 10) === 1 ? "th" : b === 1 ? "st" : b === 2 ? "nd" : b === 3 ? "rd" : "th";
          return number + output;
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("en-gb", {
        months: "January_February_March_April_May_June_July_August_September_October_November_December".split(
          "_"
        ),
        monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split(
          "_"
        ),
        weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd, D MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[Today at] LT",
          nextDay: "[Tomorrow at] LT",
          nextWeek: "dddd [at] LT",
          lastDay: "[Yesterday at] LT",
          lastWeek: "[Last] dddd [at] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "in %s",
          past: "%s ago",
          s: "a few seconds",
          ss: "%d seconds",
          m: "a minute",
          mm: "%d minutes",
          h: "an hour",
          hh: "%d hours",
          d: "a day",
          dd: "%d days",
          M: "a month",
          MM: "%d months",
          y: "a year",
          yy: "%d years"
        },
        dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
        ordinal: function(number) {
          var b = number % 10, output = ~~(number % 100 / 10) === 1 ? "th" : b === 1 ? "st" : b === 2 ? "nd" : b === 3 ? "rd" : "th";
          return number + output;
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("en-ie", {
        months: "January_February_March_April_May_June_July_August_September_October_November_December".split(
          "_"
        ),
        monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split(
          "_"
        ),
        weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd D MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[Today at] LT",
          nextDay: "[Tomorrow at] LT",
          nextWeek: "dddd [at] LT",
          lastDay: "[Yesterday at] LT",
          lastWeek: "[Last] dddd [at] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "in %s",
          past: "%s ago",
          s: "a few seconds",
          ss: "%d seconds",
          m: "a minute",
          mm: "%d minutes",
          h: "an hour",
          hh: "%d hours",
          d: "a day",
          dd: "%d days",
          M: "a month",
          MM: "%d months",
          y: "a year",
          yy: "%d years"
        },
        dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
        ordinal: function(number) {
          var b = number % 10, output = ~~(number % 100 / 10) === 1 ? "th" : b === 1 ? "st" : b === 2 ? "nd" : b === 3 ? "rd" : "th";
          return number + output;
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("en-il", {
        months: "January_February_March_April_May_June_July_August_September_October_November_December".split(
          "_"
        ),
        monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split(
          "_"
        ),
        weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd, D MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[Today at] LT",
          nextDay: "[Tomorrow at] LT",
          nextWeek: "dddd [at] LT",
          lastDay: "[Yesterday at] LT",
          lastWeek: "[Last] dddd [at] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "in %s",
          past: "%s ago",
          s: "a few seconds",
          ss: "%d seconds",
          m: "a minute",
          mm: "%d minutes",
          h: "an hour",
          hh: "%d hours",
          d: "a day",
          dd: "%d days",
          M: "a month",
          MM: "%d months",
          y: "a year",
          yy: "%d years"
        },
        dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
        ordinal: function(number) {
          var b = number % 10, output = ~~(number % 100 / 10) === 1 ? "th" : b === 1 ? "st" : b === 2 ? "nd" : b === 3 ? "rd" : "th";
          return number + output;
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("en-in", {
        months: "January_February_March_April_May_June_July_August_September_October_November_December".split(
          "_"
        ),
        monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split(
          "_"
        ),
        weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        longDateFormat: {
          LT: "h:mm A",
          LTS: "h:mm:ss A",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY h:mm A",
          LLLL: "dddd, D MMMM YYYY h:mm A"
        },
        calendar: {
          sameDay: "[Today at] LT",
          nextDay: "[Tomorrow at] LT",
          nextWeek: "dddd [at] LT",
          lastDay: "[Yesterday at] LT",
          lastWeek: "[Last] dddd [at] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "in %s",
          past: "%s ago",
          s: "a few seconds",
          ss: "%d seconds",
          m: "a minute",
          mm: "%d minutes",
          h: "an hour",
          hh: "%d hours",
          d: "a day",
          dd: "%d days",
          M: "a month",
          MM: "%d months",
          y: "a year",
          yy: "%d years"
        },
        dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
        ordinal: function(number) {
          var b = number % 10, output = ~~(number % 100 / 10) === 1 ? "th" : b === 1 ? "st" : b === 2 ? "nd" : b === 3 ? "rd" : "th";
          return number + output;
        },
        week: {
          dow: 0,
          // Sunday is the first day of the week.
          doy: 6
          // The week that contains Jan 1st is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("en-nz", {
        months: "January_February_March_April_May_June_July_August_September_October_November_December".split(
          "_"
        ),
        monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split(
          "_"
        ),
        weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        longDateFormat: {
          LT: "h:mm A",
          LTS: "h:mm:ss A",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY h:mm A",
          LLLL: "dddd, D MMMM YYYY h:mm A"
        },
        calendar: {
          sameDay: "[Today at] LT",
          nextDay: "[Tomorrow at] LT",
          nextWeek: "dddd [at] LT",
          lastDay: "[Yesterday at] LT",
          lastWeek: "[Last] dddd [at] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "in %s",
          past: "%s ago",
          s: "a few seconds",
          ss: "%d seconds",
          m: "a minute",
          mm: "%d minutes",
          h: "an hour",
          hh: "%d hours",
          d: "a day",
          dd: "%d days",
          M: "a month",
          MM: "%d months",
          y: "a year",
          yy: "%d years"
        },
        dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
        ordinal: function(number) {
          var b = number % 10, output = ~~(number % 100 / 10) === 1 ? "th" : b === 1 ? "st" : b === 2 ? "nd" : b === 3 ? "rd" : "th";
          return number + output;
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("en-sg", {
        months: "January_February_March_April_May_June_July_August_September_October_November_December".split(
          "_"
        ),
        monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split(
          "_"
        ),
        weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd, D MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[Today at] LT",
          nextDay: "[Tomorrow at] LT",
          nextWeek: "dddd [at] LT",
          lastDay: "[Yesterday at] LT",
          lastWeek: "[Last] dddd [at] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "in %s",
          past: "%s ago",
          s: "a few seconds",
          ss: "%d seconds",
          m: "a minute",
          mm: "%d minutes",
          h: "an hour",
          hh: "%d hours",
          d: "a day",
          dd: "%d days",
          M: "a month",
          MM: "%d months",
          y: "a year",
          yy: "%d years"
        },
        dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
        ordinal: function(number) {
          var b = number % 10, output = ~~(number % 100 / 10) === 1 ? "th" : b === 1 ? "st" : b === 2 ? "nd" : b === 3 ? "rd" : "th";
          return number + output;
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("eo", {
        months: "januaro_februaro_marto_aprilo_majo_junio_julio_aŭgusto_septembro_oktobro_novembro_decembro".split(
          "_"
        ),
        monthsShort: "jan_feb_mart_apr_maj_jun_jul_aŭg_sept_okt_nov_dec".split("_"),
        weekdays: "dimanĉo_lundo_mardo_merkredo_ĵaŭdo_vendredo_sabato".split("_"),
        weekdaysShort: "dim_lun_mard_merk_ĵaŭ_ven_sab".split("_"),
        weekdaysMin: "di_lu_ma_me_ĵa_ve_sa".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "YYYY-MM-DD",
          LL: "[la] D[-an de] MMMM, YYYY",
          LLL: "[la] D[-an de] MMMM, YYYY HH:mm",
          LLLL: "dddd[n], [la] D[-an de] MMMM, YYYY HH:mm",
          llll: "ddd, [la] D[-an de] MMM, YYYY HH:mm"
        },
        meridiemParse: /[ap]\.t\.m/i,
        isPM: function(input) {
          return input.charAt(0).toLowerCase() === "p";
        },
        meridiem: function(hours2, minutes2, isLower) {
          if (hours2 > 11) {
            return isLower ? "p.t.m." : "P.T.M.";
          } else {
            return isLower ? "a.t.m." : "A.T.M.";
          }
        },
        calendar: {
          sameDay: "[Hodiaŭ je] LT",
          nextDay: "[Morgaŭ je] LT",
          nextWeek: "dddd[n je] LT",
          lastDay: "[Hieraŭ je] LT",
          lastWeek: "[pasintan] dddd[n je] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "post %s",
          past: "antaŭ %s",
          s: "kelkaj sekundoj",
          ss: "%d sekundoj",
          m: "unu minuto",
          mm: "%d minutoj",
          h: "unu horo",
          hh: "%d horoj",
          d: "unu tago",
          //ne 'diurno', ĉar estas uzita por proksimumo
          dd: "%d tagoj",
          M: "unu monato",
          MM: "%d monatoj",
          y: "unu jaro",
          yy: "%d jaroj"
        },
        dayOfMonthOrdinalParse: /\d{1,2}a/,
        ordinal: "%da",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 7
          // The week that contains Jan 7th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var monthsShortDot = "ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.".split(
        "_"
      ), monthsShort$1 = "ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic".split("_"), monthsParse$2 = [
        /^ene/i,
        /^feb/i,
        /^mar/i,
        /^abr/i,
        /^may/i,
        /^jun/i,
        /^jul/i,
        /^ago/i,
        /^sep/i,
        /^oct/i,
        /^nov/i,
        /^dic/i
      ], monthsRegex$3 = /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i;
      hooks.defineLocale("es-do", {
        months: "enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre".split(
          "_"
        ),
        monthsShort: function(m, format2) {
          if (!m) {
            return monthsShortDot;
          } else if (/-MMM-/.test(format2)) {
            return monthsShort$1[m.month()];
          } else {
            return monthsShortDot[m.month()];
          }
        },
        monthsRegex: monthsRegex$3,
        monthsShortRegex: monthsRegex$3,
        monthsStrictRegex: /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,
        monthsShortStrictRegex: /^(ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,
        monthsParse: monthsParse$2,
        longMonthsParse: monthsParse$2,
        shortMonthsParse: monthsParse$2,
        weekdays: "domingo_lunes_martes_miércoles_jueves_viernes_sábado".split("_"),
        weekdaysShort: "dom._lun._mar._mié._jue._vie._sáb.".split("_"),
        weekdaysMin: "do_lu_ma_mi_ju_vi_sá".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "h:mm A",
          LTS: "h:mm:ss A",
          L: "DD/MM/YYYY",
          LL: "D [de] MMMM [de] YYYY",
          LLL: "D [de] MMMM [de] YYYY h:mm A",
          LLLL: "dddd, D [de] MMMM [de] YYYY h:mm A"
        },
        calendar: {
          sameDay: function() {
            return "[hoy a la" + (this.hours() !== 1 ? "s" : "") + "] LT";
          },
          nextDay: function() {
            return "[mañana a la" + (this.hours() !== 1 ? "s" : "") + "] LT";
          },
          nextWeek: function() {
            return "dddd [a la" + (this.hours() !== 1 ? "s" : "") + "] LT";
          },
          lastDay: function() {
            return "[ayer a la" + (this.hours() !== 1 ? "s" : "") + "] LT";
          },
          lastWeek: function() {
            return "[el] dddd [pasado a la" + (this.hours() !== 1 ? "s" : "") + "] LT";
          },
          sameElse: "L"
        },
        relativeTime: {
          future: "en %s",
          past: "hace %s",
          s: "unos segundos",
          ss: "%d segundos",
          m: "un minuto",
          mm: "%d minutos",
          h: "una hora",
          hh: "%d horas",
          d: "un día",
          dd: "%d días",
          w: "una semana",
          ww: "%d semanas",
          M: "un mes",
          MM: "%d meses",
          y: "un año",
          yy: "%d años"
        },
        dayOfMonthOrdinalParse: /\d{1,2}º/,
        ordinal: "%dº",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var monthsShortDot$1 = "ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.".split(
        "_"
      ), monthsShort$2 = "ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic".split("_"), monthsParse$3 = [
        /^ene/i,
        /^feb/i,
        /^mar/i,
        /^abr/i,
        /^may/i,
        /^jun/i,
        /^jul/i,
        /^ago/i,
        /^sep/i,
        /^oct/i,
        /^nov/i,
        /^dic/i
      ], monthsRegex$4 = /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i;
      hooks.defineLocale("es-mx", {
        months: "enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre".split(
          "_"
        ),
        monthsShort: function(m, format2) {
          if (!m) {
            return monthsShortDot$1;
          } else if (/-MMM-/.test(format2)) {
            return monthsShort$2[m.month()];
          } else {
            return monthsShortDot$1[m.month()];
          }
        },
        monthsRegex: monthsRegex$4,
        monthsShortRegex: monthsRegex$4,
        monthsStrictRegex: /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,
        monthsShortStrictRegex: /^(ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,
        monthsParse: monthsParse$3,
        longMonthsParse: monthsParse$3,
        shortMonthsParse: monthsParse$3,
        weekdays: "domingo_lunes_martes_miércoles_jueves_viernes_sábado".split("_"),
        weekdaysShort: "dom._lun._mar._mié._jue._vie._sáb.".split("_"),
        weekdaysMin: "do_lu_ma_mi_ju_vi_sá".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "H:mm",
          LTS: "H:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D [de] MMMM [de] YYYY",
          LLL: "D [de] MMMM [de] YYYY H:mm",
          LLLL: "dddd, D [de] MMMM [de] YYYY H:mm"
        },
        calendar: {
          sameDay: function() {
            return "[hoy a la" + (this.hours() !== 1 ? "s" : "") + "] LT";
          },
          nextDay: function() {
            return "[mañana a la" + (this.hours() !== 1 ? "s" : "") + "] LT";
          },
          nextWeek: function() {
            return "dddd [a la" + (this.hours() !== 1 ? "s" : "") + "] LT";
          },
          lastDay: function() {
            return "[ayer a la" + (this.hours() !== 1 ? "s" : "") + "] LT";
          },
          lastWeek: function() {
            return "[el] dddd [pasado a la" + (this.hours() !== 1 ? "s" : "") + "] LT";
          },
          sameElse: "L"
        },
        relativeTime: {
          future: "en %s",
          past: "hace %s",
          s: "unos segundos",
          ss: "%d segundos",
          m: "un minuto",
          mm: "%d minutos",
          h: "una hora",
          hh: "%d horas",
          d: "un día",
          dd: "%d días",
          w: "una semana",
          ww: "%d semanas",
          M: "un mes",
          MM: "%d meses",
          y: "un año",
          yy: "%d años"
        },
        dayOfMonthOrdinalParse: /\d{1,2}º/,
        ordinal: "%dº",
        week: {
          dow: 0,
          // Sunday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        },
        invalidDate: "Fecha inválida"
      });
      //! moment.js locale configuration
      var monthsShortDot$2 = "ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.".split(
        "_"
      ), monthsShort$3 = "ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic".split("_"), monthsParse$4 = [
        /^ene/i,
        /^feb/i,
        /^mar/i,
        /^abr/i,
        /^may/i,
        /^jun/i,
        /^jul/i,
        /^ago/i,
        /^sep/i,
        /^oct/i,
        /^nov/i,
        /^dic/i
      ], monthsRegex$5 = /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i;
      hooks.defineLocale("es-us", {
        months: "enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre".split(
          "_"
        ),
        monthsShort: function(m, format2) {
          if (!m) {
            return monthsShortDot$2;
          } else if (/-MMM-/.test(format2)) {
            return monthsShort$3[m.month()];
          } else {
            return monthsShortDot$2[m.month()];
          }
        },
        monthsRegex: monthsRegex$5,
        monthsShortRegex: monthsRegex$5,
        monthsStrictRegex: /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,
        monthsShortStrictRegex: /^(ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,
        monthsParse: monthsParse$4,
        longMonthsParse: monthsParse$4,
        shortMonthsParse: monthsParse$4,
        weekdays: "domingo_lunes_martes_miércoles_jueves_viernes_sábado".split("_"),
        weekdaysShort: "dom._lun._mar._mié._jue._vie._sáb.".split("_"),
        weekdaysMin: "do_lu_ma_mi_ju_vi_sá".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "h:mm A",
          LTS: "h:mm:ss A",
          L: "MM/DD/YYYY",
          LL: "D [de] MMMM [de] YYYY",
          LLL: "D [de] MMMM [de] YYYY h:mm A",
          LLLL: "dddd, D [de] MMMM [de] YYYY h:mm A"
        },
        calendar: {
          sameDay: function() {
            return "[hoy a la" + (this.hours() !== 1 ? "s" : "") + "] LT";
          },
          nextDay: function() {
            return "[mañana a la" + (this.hours() !== 1 ? "s" : "") + "] LT";
          },
          nextWeek: function() {
            return "dddd [a la" + (this.hours() !== 1 ? "s" : "") + "] LT";
          },
          lastDay: function() {
            return "[ayer a la" + (this.hours() !== 1 ? "s" : "") + "] LT";
          },
          lastWeek: function() {
            return "[el] dddd [pasado a la" + (this.hours() !== 1 ? "s" : "") + "] LT";
          },
          sameElse: "L"
        },
        relativeTime: {
          future: "en %s",
          past: "hace %s",
          s: "unos segundos",
          ss: "%d segundos",
          m: "un minuto",
          mm: "%d minutos",
          h: "una hora",
          hh: "%d horas",
          d: "un día",
          dd: "%d días",
          w: "una semana",
          ww: "%d semanas",
          M: "un mes",
          MM: "%d meses",
          y: "un año",
          yy: "%d años"
        },
        dayOfMonthOrdinalParse: /\d{1,2}º/,
        ordinal: "%dº",
        week: {
          dow: 0,
          // Sunday is the first day of the week.
          doy: 6
          // The week that contains Jan 6th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var monthsShortDot$3 = "ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.".split(
        "_"
      ), monthsShort$4 = "ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic".split("_"), monthsParse$5 = [
        /^ene/i,
        /^feb/i,
        /^mar/i,
        /^abr/i,
        /^may/i,
        /^jun/i,
        /^jul/i,
        /^ago/i,
        /^sep/i,
        /^oct/i,
        /^nov/i,
        /^dic/i
      ], monthsRegex$6 = /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i;
      hooks.defineLocale("es", {
        months: "enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre".split(
          "_"
        ),
        monthsShort: function(m, format2) {
          if (!m) {
            return monthsShortDot$3;
          } else if (/-MMM-/.test(format2)) {
            return monthsShort$4[m.month()];
          } else {
            return monthsShortDot$3[m.month()];
          }
        },
        monthsRegex: monthsRegex$6,
        monthsShortRegex: monthsRegex$6,
        monthsStrictRegex: /^(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i,
        monthsShortStrictRegex: /^(ene\.?|feb\.?|mar\.?|abr\.?|may\.?|jun\.?|jul\.?|ago\.?|sep\.?|oct\.?|nov\.?|dic\.?)/i,
        monthsParse: monthsParse$5,
        longMonthsParse: monthsParse$5,
        shortMonthsParse: monthsParse$5,
        weekdays: "domingo_lunes_martes_miércoles_jueves_viernes_sábado".split("_"),
        weekdaysShort: "dom._lun._mar._mié._jue._vie._sáb.".split("_"),
        weekdaysMin: "do_lu_ma_mi_ju_vi_sá".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "H:mm",
          LTS: "H:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D [de] MMMM [de] YYYY",
          LLL: "D [de] MMMM [de] YYYY H:mm",
          LLLL: "dddd, D [de] MMMM [de] YYYY H:mm"
        },
        calendar: {
          sameDay: function() {
            return "[hoy a la" + (this.hours() !== 1 ? "s" : "") + "] LT";
          },
          nextDay: function() {
            return "[mañana a la" + (this.hours() !== 1 ? "s" : "") + "] LT";
          },
          nextWeek: function() {
            return "dddd [a la" + (this.hours() !== 1 ? "s" : "") + "] LT";
          },
          lastDay: function() {
            return "[ayer a la" + (this.hours() !== 1 ? "s" : "") + "] LT";
          },
          lastWeek: function() {
            return "[el] dddd [pasado a la" + (this.hours() !== 1 ? "s" : "") + "] LT";
          },
          sameElse: "L"
        },
        relativeTime: {
          future: "en %s",
          past: "hace %s",
          s: "unos segundos",
          ss: "%d segundos",
          m: "un minuto",
          mm: "%d minutos",
          h: "una hora",
          hh: "%d horas",
          d: "un día",
          dd: "%d días",
          w: "una semana",
          ww: "%d semanas",
          M: "un mes",
          MM: "%d meses",
          y: "un año",
          yy: "%d años"
        },
        dayOfMonthOrdinalParse: /\d{1,2}º/,
        ordinal: "%dº",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        },
        invalidDate: "Fecha inválida"
      });
      //! moment.js locale configuration
      function processRelativeTime$4(number, withoutSuffix, key, isFuture) {
        var format2 = {
          s: ["mõne sekundi", "mõni sekund", "paar sekundit"],
          ss: [number + "sekundi", number + "sekundit"],
          m: ["ühe minuti", "üks minut"],
          mm: [number + " minuti", number + " minutit"],
          h: ["ühe tunni", "tund aega", "üks tund"],
          hh: [number + " tunni", number + " tundi"],
          d: ["ühe päeva", "üks päev"],
          M: ["kuu aja", "kuu aega", "üks kuu"],
          MM: [number + " kuu", number + " kuud"],
          y: ["ühe aasta", "aasta", "üks aasta"],
          yy: [number + " aasta", number + " aastat"]
        };
        if (withoutSuffix) {
          return format2[key][2] ? format2[key][2] : format2[key][1];
        }
        return isFuture ? format2[key][0] : format2[key][1];
      }
      hooks.defineLocale("et", {
        months: "jaanuar_veebruar_märts_aprill_mai_juuni_juuli_august_september_oktoober_november_detsember".split(
          "_"
        ),
        monthsShort: "jaan_veebr_märts_apr_mai_juuni_juuli_aug_sept_okt_nov_dets".split("_"),
        weekdays: "pühapäev_esmaspäev_teisipäev_kolmapäev_neljapäev_reede_laupäev".split(
          "_"
        ),
        weekdaysShort: "P_E_T_K_N_R_L".split("_"),
        weekdaysMin: "P_E_T_K_N_R_L".split("_"),
        longDateFormat: {
          LT: "H:mm",
          LTS: "H:mm:ss",
          L: "DD.MM.YYYY",
          LL: "D. MMMM YYYY",
          LLL: "D. MMMM YYYY H:mm",
          LLLL: "dddd, D. MMMM YYYY H:mm"
        },
        calendar: {
          sameDay: "[Täna,] LT",
          nextDay: "[Homme,] LT",
          nextWeek: "[Järgmine] dddd LT",
          lastDay: "[Eile,] LT",
          lastWeek: "[Eelmine] dddd LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "%s pärast",
          past: "%s tagasi",
          s: processRelativeTime$4,
          ss: processRelativeTime$4,
          m: processRelativeTime$4,
          mm: processRelativeTime$4,
          h: processRelativeTime$4,
          hh: processRelativeTime$4,
          d: processRelativeTime$4,
          dd: "%d päeva",
          M: processRelativeTime$4,
          MM: processRelativeTime$4,
          y: processRelativeTime$4,
          yy: processRelativeTime$4
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal: "%d.",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("eu", {
        months: "urtarrila_otsaila_martxoa_apirila_maiatza_ekaina_uztaila_abuztua_iraila_urria_azaroa_abendua".split(
          "_"
        ),
        monthsShort: "urt._ots._mar._api._mai._eka._uzt._abu._ira._urr._aza._abe.".split(
          "_"
        ),
        monthsParseExact: true,
        weekdays: "igandea_astelehena_asteartea_asteazkena_osteguna_ostirala_larunbata".split(
          "_"
        ),
        weekdaysShort: "ig._al._ar._az._og._ol._lr.".split("_"),
        weekdaysMin: "ig_al_ar_az_og_ol_lr".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "YYYY-MM-DD",
          LL: "YYYY[ko] MMMM[ren] D[a]",
          LLL: "YYYY[ko] MMMM[ren] D[a] HH:mm",
          LLLL: "dddd, YYYY[ko] MMMM[ren] D[a] HH:mm",
          l: "YYYY-M-D",
          ll: "YYYY[ko] MMM D[a]",
          lll: "YYYY[ko] MMM D[a] HH:mm",
          llll: "ddd, YYYY[ko] MMM D[a] HH:mm"
        },
        calendar: {
          sameDay: "[gaur] LT[etan]",
          nextDay: "[bihar] LT[etan]",
          nextWeek: "dddd LT[etan]",
          lastDay: "[atzo] LT[etan]",
          lastWeek: "[aurreko] dddd LT[etan]",
          sameElse: "L"
        },
        relativeTime: {
          future: "%s barru",
          past: "duela %s",
          s: "segundo batzuk",
          ss: "%d segundo",
          m: "minutu bat",
          mm: "%d minutu",
          h: "ordu bat",
          hh: "%d ordu",
          d: "egun bat",
          dd: "%d egun",
          M: "hilabete bat",
          MM: "%d hilabete",
          y: "urte bat",
          yy: "%d urte"
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal: "%d.",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 7
          // The week that contains Jan 7th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var symbolMap$7 = {
        1: "۱",
        2: "۲",
        3: "۳",
        4: "۴",
        5: "۵",
        6: "۶",
        7: "۷",
        8: "۸",
        9: "۹",
        0: "۰"
      }, numberMap$6 = {
        "۱": "1",
        "۲": "2",
        "۳": "3",
        "۴": "4",
        "۵": "5",
        "۶": "6",
        "۷": "7",
        "۸": "8",
        "۹": "9",
        "۰": "0"
      };
      hooks.defineLocale("fa", {
        months: "ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر".split(
          "_"
        ),
        monthsShort: "ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر".split(
          "_"
        ),
        weekdays: "یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split(
          "_"
        ),
        weekdaysShort: "یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split(
          "_"
        ),
        weekdaysMin: "ی_د_س_چ_پ_ج_ش".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd, D MMMM YYYY HH:mm"
        },
        meridiemParse: /قبل از ظهر|بعد از ظهر/,
        isPM: function(input) {
          return /بعد از ظهر/.test(input);
        },
        meridiem: function(hour, minute, isLower) {
          if (hour < 12) {
            return "قبل از ظهر";
          } else {
            return "بعد از ظهر";
          }
        },
        calendar: {
          sameDay: "[امروز ساعت] LT",
          nextDay: "[فردا ساعت] LT",
          nextWeek: "dddd [ساعت] LT",
          lastDay: "[دیروز ساعت] LT",
          lastWeek: "dddd [پیش] [ساعت] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "در %s",
          past: "%s پیش",
          s: "چند ثانیه",
          ss: "%d ثانیه",
          m: "یک دقیقه",
          mm: "%d دقیقه",
          h: "یک ساعت",
          hh: "%d ساعت",
          d: "یک روز",
          dd: "%d روز",
          M: "یک ماه",
          MM: "%d ماه",
          y: "یک سال",
          yy: "%d سال"
        },
        preparse: function(string) {
          return string.replace(/[۰-۹]/g, function(match) {
            return numberMap$6[match];
          }).replace(/،/g, ",");
        },
        postformat: function(string) {
          return string.replace(/\d/g, function(match) {
            return symbolMap$7[match];
          }).replace(/,/g, "،");
        },
        dayOfMonthOrdinalParse: /\d{1,2}م/,
        ordinal: "%dم",
        week: {
          dow: 6,
          // Saturday is the first day of the week.
          doy: 12
          // The week that contains Jan 12th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var numbersPast = "nolla yksi kaksi kolme neljä viisi kuusi seitsemän kahdeksan yhdeksän".split(
        " "
      ), numbersFuture = [
        "nolla",
        "yhden",
        "kahden",
        "kolmen",
        "neljän",
        "viiden",
        "kuuden",
        numbersPast[7],
        numbersPast[8],
        numbersPast[9]
      ];
      function translate$2(number, withoutSuffix, key, isFuture) {
        var result = "";
        switch (key) {
          case "s":
            return isFuture ? "muutaman sekunnin" : "muutama sekunti";
          case "ss":
            result = isFuture ? "sekunnin" : "sekuntia";
            break;
          case "m":
            return isFuture ? "minuutin" : "minuutti";
          case "mm":
            result = isFuture ? "minuutin" : "minuuttia";
            break;
          case "h":
            return isFuture ? "tunnin" : "tunti";
          case "hh":
            result = isFuture ? "tunnin" : "tuntia";
            break;
          case "d":
            return isFuture ? "päivän" : "päivä";
          case "dd":
            result = isFuture ? "päivän" : "päivää";
            break;
          case "M":
            return isFuture ? "kuukauden" : "kuukausi";
          case "MM":
            result = isFuture ? "kuukauden" : "kuukautta";
            break;
          case "y":
            return isFuture ? "vuoden" : "vuosi";
          case "yy":
            result = isFuture ? "vuoden" : "vuotta";
            break;
        }
        result = verbalNumber(number, isFuture) + " " + result;
        return result;
      }
      function verbalNumber(number, isFuture) {
        return number < 10 ? isFuture ? numbersFuture[number] : numbersPast[number] : number;
      }
      hooks.defineLocale("fi", {
        months: "tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu".split(
          "_"
        ),
        monthsShort: "tammi_helmi_maalis_huhti_touko_kesä_heinä_elo_syys_loka_marras_joulu".split(
          "_"
        ),
        weekdays: "sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai".split(
          "_"
        ),
        weekdaysShort: "su_ma_ti_ke_to_pe_la".split("_"),
        weekdaysMin: "su_ma_ti_ke_to_pe_la".split("_"),
        longDateFormat: {
          LT: "HH.mm",
          LTS: "HH.mm.ss",
          L: "DD.MM.YYYY",
          LL: "Do MMMM[ta] YYYY",
          LLL: "Do MMMM[ta] YYYY, [klo] HH.mm",
          LLLL: "dddd, Do MMMM[ta] YYYY, [klo] HH.mm",
          l: "D.M.YYYY",
          ll: "Do MMM YYYY",
          lll: "Do MMM YYYY, [klo] HH.mm",
          llll: "ddd, Do MMM YYYY, [klo] HH.mm"
        },
        calendar: {
          sameDay: "[tänään] [klo] LT",
          nextDay: "[huomenna] [klo] LT",
          nextWeek: "dddd [klo] LT",
          lastDay: "[eilen] [klo] LT",
          lastWeek: "[viime] dddd[na] [klo] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "%s päästä",
          past: "%s sitten",
          s: translate$2,
          ss: translate$2,
          m: translate$2,
          mm: translate$2,
          h: translate$2,
          hh: translate$2,
          d: translate$2,
          dd: translate$2,
          M: translate$2,
          MM: translate$2,
          y: translate$2,
          yy: translate$2
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal: "%d.",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("fil", {
        months: "Enero_Pebrero_Marso_Abril_Mayo_Hunyo_Hulyo_Agosto_Setyembre_Oktubre_Nobyembre_Disyembre".split(
          "_"
        ),
        monthsShort: "Ene_Peb_Mar_Abr_May_Hun_Hul_Ago_Set_Okt_Nob_Dis".split("_"),
        weekdays: "Linggo_Lunes_Martes_Miyerkules_Huwebes_Biyernes_Sabado".split(
          "_"
        ),
        weekdaysShort: "Lin_Lun_Mar_Miy_Huw_Biy_Sab".split("_"),
        weekdaysMin: "Li_Lu_Ma_Mi_Hu_Bi_Sab".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "MM/D/YYYY",
          LL: "MMMM D, YYYY",
          LLL: "MMMM D, YYYY HH:mm",
          LLLL: "dddd, MMMM DD, YYYY HH:mm"
        },
        calendar: {
          sameDay: "LT [ngayong araw]",
          nextDay: "[Bukas ng] LT",
          nextWeek: "LT [sa susunod na] dddd",
          lastDay: "LT [kahapon]",
          lastWeek: "LT [noong nakaraang] dddd",
          sameElse: "L"
        },
        relativeTime: {
          future: "sa loob ng %s",
          past: "%s ang nakalipas",
          s: "ilang segundo",
          ss: "%d segundo",
          m: "isang minuto",
          mm: "%d minuto",
          h: "isang oras",
          hh: "%d oras",
          d: "isang araw",
          dd: "%d araw",
          M: "isang buwan",
          MM: "%d buwan",
          y: "isang taon",
          yy: "%d taon"
        },
        dayOfMonthOrdinalParse: /\d{1,2}/,
        ordinal: function(number) {
          return number;
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("fo", {
        months: "januar_februar_mars_apríl_mai_juni_juli_august_september_oktober_november_desember".split(
          "_"
        ),
        monthsShort: "jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),
        weekdays: "sunnudagur_mánadagur_týsdagur_mikudagur_hósdagur_fríggjadagur_leygardagur".split(
          "_"
        ),
        weekdaysShort: "sun_mán_týs_mik_hós_frí_ley".split("_"),
        weekdaysMin: "su_má_tý_mi_hó_fr_le".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd D. MMMM, YYYY HH:mm"
        },
        calendar: {
          sameDay: "[Í dag kl.] LT",
          nextDay: "[Í morgin kl.] LT",
          nextWeek: "dddd [kl.] LT",
          lastDay: "[Í gjár kl.] LT",
          lastWeek: "[síðstu] dddd [kl] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "um %s",
          past: "%s síðani",
          s: "fá sekund",
          ss: "%d sekundir",
          m: "ein minuttur",
          mm: "%d minuttir",
          h: "ein tími",
          hh: "%d tímar",
          d: "ein dagur",
          dd: "%d dagar",
          M: "ein mánaður",
          MM: "%d mánaðir",
          y: "eitt ár",
          yy: "%d ár"
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal: "%d.",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("fr-ca", {
        months: "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split(
          "_"
        ),
        monthsShort: "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split(
          "_"
        ),
        monthsParseExact: true,
        weekdays: "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
        weekdaysShort: "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
        weekdaysMin: "di_lu_ma_me_je_ve_sa".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "YYYY-MM-DD",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd D MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[Aujourd’hui à] LT",
          nextDay: "[Demain à] LT",
          nextWeek: "dddd [à] LT",
          lastDay: "[Hier à] LT",
          lastWeek: "dddd [dernier à] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "dans %s",
          past: "il y a %s",
          s: "quelques secondes",
          ss: "%d secondes",
          m: "une minute",
          mm: "%d minutes",
          h: "une heure",
          hh: "%d heures",
          d: "un jour",
          dd: "%d jours",
          M: "un mois",
          MM: "%d mois",
          y: "un an",
          yy: "%d ans"
        },
        dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
        ordinal: function(number, period) {
          switch (period) {
            // Words with masculine grammatical gender: mois, trimestre, jour
            default:
            case "M":
            case "Q":
            case "D":
            case "DDD":
            case "d":
              return number + (number === 1 ? "er" : "e");
            // Words with feminine grammatical gender: semaine
            case "w":
            case "W":
              return number + (number === 1 ? "re" : "e");
          }
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("fr-ch", {
        months: "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split(
          "_"
        ),
        monthsShort: "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split(
          "_"
        ),
        monthsParseExact: true,
        weekdays: "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
        weekdaysShort: "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
        weekdaysMin: "di_lu_ma_me_je_ve_sa".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD.MM.YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd D MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[Aujourd’hui à] LT",
          nextDay: "[Demain à] LT",
          nextWeek: "dddd [à] LT",
          lastDay: "[Hier à] LT",
          lastWeek: "dddd [dernier à] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "dans %s",
          past: "il y a %s",
          s: "quelques secondes",
          ss: "%d secondes",
          m: "une minute",
          mm: "%d minutes",
          h: "une heure",
          hh: "%d heures",
          d: "un jour",
          dd: "%d jours",
          M: "un mois",
          MM: "%d mois",
          y: "un an",
          yy: "%d ans"
        },
        dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
        ordinal: function(number, period) {
          switch (period) {
            // Words with masculine grammatical gender: mois, trimestre, jour
            default:
            case "M":
            case "Q":
            case "D":
            case "DDD":
            case "d":
              return number + (number === 1 ? "er" : "e");
            // Words with feminine grammatical gender: semaine
            case "w":
            case "W":
              return number + (number === 1 ? "re" : "e");
          }
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var monthsStrictRegex$1 = /^(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)/i, monthsShortStrictRegex$1 = /(janv\.?|févr\.?|mars|avr\.?|mai|juin|juil\.?|août|sept\.?|oct\.?|nov\.?|déc\.?)/i, monthsRegex$7 = /(janv\.?|févr\.?|mars|avr\.?|mai|juin|juil\.?|août|sept\.?|oct\.?|nov\.?|déc\.?|janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)/i, monthsParse$6 = [
        /^janv/i,
        /^févr/i,
        /^mars/i,
        /^avr/i,
        /^mai/i,
        /^juin/i,
        /^juil/i,
        /^août/i,
        /^sept/i,
        /^oct/i,
        /^nov/i,
        /^déc/i
      ];
      hooks.defineLocale("fr", {
        months: "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split(
          "_"
        ),
        monthsShort: "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split(
          "_"
        ),
        monthsRegex: monthsRegex$7,
        monthsShortRegex: monthsRegex$7,
        monthsStrictRegex: monthsStrictRegex$1,
        monthsShortStrictRegex: monthsShortStrictRegex$1,
        monthsParse: monthsParse$6,
        longMonthsParse: monthsParse$6,
        shortMonthsParse: monthsParse$6,
        weekdays: "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
        weekdaysShort: "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
        weekdaysMin: "di_lu_ma_me_je_ve_sa".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd D MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[Aujourd’hui à] LT",
          nextDay: "[Demain à] LT",
          nextWeek: "dddd [à] LT",
          lastDay: "[Hier à] LT",
          lastWeek: "dddd [dernier à] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "dans %s",
          past: "il y a %s",
          s: "quelques secondes",
          ss: "%d secondes",
          m: "une minute",
          mm: "%d minutes",
          h: "une heure",
          hh: "%d heures",
          d: "un jour",
          dd: "%d jours",
          w: "une semaine",
          ww: "%d semaines",
          M: "un mois",
          MM: "%d mois",
          y: "un an",
          yy: "%d ans"
        },
        dayOfMonthOrdinalParse: /\d{1,2}(er|)/,
        ordinal: function(number, period) {
          switch (period) {
            // TODO: Return 'e' when day of month > 1. Move this case inside
            // block for masculine words below.
            // See https://github.com/moment/moment/issues/3375
            case "D":
              return number + (number === 1 ? "er" : "");
            // Words with masculine grammatical gender: mois, trimestre, jour
            default:
            case "M":
            case "Q":
            case "DDD":
            case "d":
              return number + (number === 1 ? "er" : "e");
            // Words with feminine grammatical gender: semaine
            case "w":
            case "W":
              return number + (number === 1 ? "re" : "e");
          }
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var monthsShortWithDots = "jan._feb._mrt._apr._mai_jun._jul._aug._sep._okt._nov._des.".split("_"), monthsShortWithoutDots = "jan_feb_mrt_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_");
      hooks.defineLocale("fy", {
        months: "jannewaris_febrewaris_maart_april_maaie_juny_july_augustus_septimber_oktober_novimber_desimber".split(
          "_"
        ),
        monthsShort: function(m, format2) {
          if (!m) {
            return monthsShortWithDots;
          } else if (/-MMM-/.test(format2)) {
            return monthsShortWithoutDots[m.month()];
          } else {
            return monthsShortWithDots[m.month()];
          }
        },
        monthsParseExact: true,
        weekdays: "snein_moandei_tiisdei_woansdei_tongersdei_freed_sneon".split(
          "_"
        ),
        weekdaysShort: "si._mo._ti._wo._to._fr._so.".split("_"),
        weekdaysMin: "Si_Mo_Ti_Wo_To_Fr_So".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD-MM-YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd D MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[hjoed om] LT",
          nextDay: "[moarn om] LT",
          nextWeek: "dddd [om] LT",
          lastDay: "[juster om] LT",
          lastWeek: "[ôfrûne] dddd [om] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "oer %s",
          past: "%s lyn",
          s: "in pear sekonden",
          ss: "%d sekonden",
          m: "ien minút",
          mm: "%d minuten",
          h: "ien oere",
          hh: "%d oeren",
          d: "ien dei",
          dd: "%d dagen",
          M: "ien moanne",
          MM: "%d moannen",
          y: "ien jier",
          yy: "%d jierren"
        },
        dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
        ordinal: function(number) {
          return number + (number === 1 || number === 8 || number >= 20 ? "ste" : "de");
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var months$6 = [
        "Eanáir",
        "Feabhra",
        "Márta",
        "Aibreán",
        "Bealtaine",
        "Meitheamh",
        "Iúil",
        "Lúnasa",
        "Meán Fómhair",
        "Deireadh Fómhair",
        "Samhain",
        "Nollaig"
      ], monthsShort$5 = [
        "Ean",
        "Feabh",
        "Márt",
        "Aib",
        "Beal",
        "Meith",
        "Iúil",
        "Lún",
        "M.F.",
        "D.F.",
        "Samh",
        "Noll"
      ], weekdays$1 = [
        "Dé Domhnaigh",
        "Dé Luain",
        "Dé Máirt",
        "Dé Céadaoin",
        "Déardaoin",
        "Dé hAoine",
        "Dé Sathairn"
      ], weekdaysShort = ["Domh", "Luan", "Máirt", "Céad", "Déar", "Aoine", "Sath"], weekdaysMin = ["Do", "Lu", "Má", "Cé", "Dé", "A", "Sa"];
      hooks.defineLocale("ga", {
        months: months$6,
        monthsShort: monthsShort$5,
        monthsParseExact: true,
        weekdays: weekdays$1,
        weekdaysShort,
        weekdaysMin,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd, D MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[Inniu ag] LT",
          nextDay: "[Amárach ag] LT",
          nextWeek: "dddd [ag] LT",
          lastDay: "[Inné ag] LT",
          lastWeek: "dddd [seo caite] [ag] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "i %s",
          past: "%s ó shin",
          s: "cúpla soicind",
          ss: "%d soicind",
          m: "nóiméad",
          mm: "%d nóiméad",
          h: "uair an chloig",
          hh: "%d uair an chloig",
          d: "lá",
          dd: "%d lá",
          M: "mí",
          MM: "%d míonna",
          y: "bliain",
          yy: "%d bliain"
        },
        dayOfMonthOrdinalParse: /\d{1,2}(d|na|mh)/,
        ordinal: function(number) {
          var output = number === 1 ? "d" : number % 10 === 2 ? "na" : "mh";
          return number + output;
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var months$7 = [
        "Am Faoilleach",
        "An Gearran",
        "Am Màrt",
        "An Giblean",
        "An Cèitean",
        "An t-Ògmhios",
        "An t-Iuchar",
        "An Lùnastal",
        "An t-Sultain",
        "An Dàmhair",
        "An t-Samhain",
        "An Dùbhlachd"
      ], monthsShort$6 = [
        "Faoi",
        "Gear",
        "Màrt",
        "Gibl",
        "Cèit",
        "Ògmh",
        "Iuch",
        "Lùn",
        "Sult",
        "Dàmh",
        "Samh",
        "Dùbh"
      ], weekdays$2 = [
        "Didòmhnaich",
        "Diluain",
        "Dimàirt",
        "Diciadain",
        "Diardaoin",
        "Dihaoine",
        "Disathairne"
      ], weekdaysShort$1 = ["Did", "Dil", "Dim", "Dic", "Dia", "Dih", "Dis"], weekdaysMin$1 = ["Dò", "Lu", "Mà", "Ci", "Ar", "Ha", "Sa"];
      hooks.defineLocale("gd", {
        months: months$7,
        monthsShort: monthsShort$6,
        monthsParseExact: true,
        weekdays: weekdays$2,
        weekdaysShort: weekdaysShort$1,
        weekdaysMin: weekdaysMin$1,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd, D MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[An-diugh aig] LT",
          nextDay: "[A-màireach aig] LT",
          nextWeek: "dddd [aig] LT",
          lastDay: "[An-dè aig] LT",
          lastWeek: "dddd [seo chaidh] [aig] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "ann an %s",
          past: "bho chionn %s",
          s: "beagan diogan",
          ss: "%d diogan",
          m: "mionaid",
          mm: "%d mionaidean",
          h: "uair",
          hh: "%d uairean",
          d: "latha",
          dd: "%d latha",
          M: "mìos",
          MM: "%d mìosan",
          y: "bliadhna",
          yy: "%d bliadhna"
        },
        dayOfMonthOrdinalParse: /\d{1,2}(d|na|mh)/,
        ordinal: function(number) {
          var output = number === 1 ? "d" : number % 10 === 2 ? "na" : "mh";
          return number + output;
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("gl", {
        months: "xaneiro_febreiro_marzo_abril_maio_xuño_xullo_agosto_setembro_outubro_novembro_decembro".split(
          "_"
        ),
        monthsShort: "xan._feb._mar._abr._mai._xuñ._xul._ago._set._out._nov._dec.".split(
          "_"
        ),
        monthsParseExact: true,
        weekdays: "domingo_luns_martes_mércores_xoves_venres_sábado".split("_"),
        weekdaysShort: "dom._lun._mar._mér._xov._ven._sáb.".split("_"),
        weekdaysMin: "do_lu_ma_mé_xo_ve_sá".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "H:mm",
          LTS: "H:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D [de] MMMM [de] YYYY",
          LLL: "D [de] MMMM [de] YYYY H:mm",
          LLLL: "dddd, D [de] MMMM [de] YYYY H:mm"
        },
        calendar: {
          sameDay: function() {
            return "[hoxe " + (this.hours() !== 1 ? "ás" : "á") + "] LT";
          },
          nextDay: function() {
            return "[mañá " + (this.hours() !== 1 ? "ás" : "á") + "] LT";
          },
          nextWeek: function() {
            return "dddd [" + (this.hours() !== 1 ? "ás" : "a") + "] LT";
          },
          lastDay: function() {
            return "[onte " + (this.hours() !== 1 ? "á" : "a") + "] LT";
          },
          lastWeek: function() {
            return "[o] dddd [pasado " + (this.hours() !== 1 ? "ás" : "a") + "] LT";
          },
          sameElse: "L"
        },
        relativeTime: {
          future: function(str) {
            if (str.indexOf("un") === 0) {
              return "n" + str;
            }
            return "en " + str;
          },
          past: "hai %s",
          s: "uns segundos",
          ss: "%d segundos",
          m: "un minuto",
          mm: "%d minutos",
          h: "unha hora",
          hh: "%d horas",
          d: "un día",
          dd: "%d días",
          M: "un mes",
          MM: "%d meses",
          y: "un ano",
          yy: "%d anos"
        },
        dayOfMonthOrdinalParse: /\d{1,2}º/,
        ordinal: "%dº",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      function processRelativeTime$5(number, withoutSuffix, key, isFuture) {
        var format2 = {
          s: ["थोडया सॅकंडांनी", "थोडे सॅकंड"],
          ss: [number + " सॅकंडांनी", number + " सॅकंड"],
          m: ["एका मिणटान", "एक मिनूट"],
          mm: [number + " मिणटांनी", number + " मिणटां"],
          h: ["एका वरान", "एक वर"],
          hh: [number + " वरांनी", number + " वरां"],
          d: ["एका दिसान", "एक दीस"],
          dd: [number + " दिसांनी", number + " दीस"],
          M: ["एका म्हयन्यान", "एक म्हयनो"],
          MM: [number + " म्हयन्यानी", number + " म्हयने"],
          y: ["एका वर्सान", "एक वर्स"],
          yy: [number + " वर्सांनी", number + " वर्सां"]
        };
        return isFuture ? format2[key][0] : format2[key][1];
      }
      hooks.defineLocale("gom-deva", {
        months: {
          standalone: "जानेवारी_फेब्रुवारी_मार्च_एप्रील_मे_जून_जुलय_ऑगस्ट_सप्टेंबर_ऑक्टोबर_नोव्हेंबर_डिसेंबर".split(
            "_"
          ),
          format: "जानेवारीच्या_फेब्रुवारीच्या_मार्चाच्या_एप्रीलाच्या_मेयाच्या_जूनाच्या_जुलयाच्या_ऑगस्टाच्या_सप्टेंबराच्या_ऑक्टोबराच्या_नोव्हेंबराच्या_डिसेंबराच्या".split(
            "_"
          ),
          isFormat: /MMMM(\s)+D[oD]?/
        },
        monthsShort: "जाने._फेब्रु._मार्च_एप्री._मे_जून_जुल._ऑग._सप्टें._ऑक्टो._नोव्हें._डिसें.".split(
          "_"
        ),
        monthsParseExact: true,
        weekdays: "आयतार_सोमार_मंगळार_बुधवार_बिरेस्तार_सुक्रार_शेनवार".split("_"),
        weekdaysShort: "आयत._सोम._मंगळ._बुध._ब्रेस्त._सुक्र._शेन.".split("_"),
        weekdaysMin: "आ_सो_मं_बु_ब्रे_सु_शे".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "A h:mm [वाजतां]",
          LTS: "A h:mm:ss [वाजतां]",
          L: "DD-MM-YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY A h:mm [वाजतां]",
          LLLL: "dddd, MMMM Do, YYYY, A h:mm [वाजतां]",
          llll: "ddd, D MMM YYYY, A h:mm [वाजतां]"
        },
        calendar: {
          sameDay: "[आयज] LT",
          nextDay: "[फाल्यां] LT",
          nextWeek: "[फुडलो] dddd[,] LT",
          lastDay: "[काल] LT",
          lastWeek: "[फाटलो] dddd[,] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "%s",
          past: "%s आदीं",
          s: processRelativeTime$5,
          ss: processRelativeTime$5,
          m: processRelativeTime$5,
          mm: processRelativeTime$5,
          h: processRelativeTime$5,
          hh: processRelativeTime$5,
          d: processRelativeTime$5,
          dd: processRelativeTime$5,
          M: processRelativeTime$5,
          MM: processRelativeTime$5,
          y: processRelativeTime$5,
          yy: processRelativeTime$5
        },
        dayOfMonthOrdinalParse: /\d{1,2}(वेर)/,
        ordinal: function(number, period) {
          switch (period) {
            // the ordinal 'वेर' only applies to day of the month
            case "D":
              return number + "वेर";
            default:
            case "M":
            case "Q":
            case "DDD":
            case "d":
            case "w":
            case "W":
              return number;
          }
        },
        week: {
          dow: 0,
          // Sunday is the first day of the week
          doy: 3
          // The week that contains Jan 4th is the first week of the year (7 + 0 - 4)
        },
        meridiemParse: /राती|सकाळीं|दनपारां|सांजे/,
        meridiemHour: function(hour, meridiem2) {
          if (hour === 12) {
            hour = 0;
          }
          if (meridiem2 === "राती") {
            return hour < 4 ? hour : hour + 12;
          } else if (meridiem2 === "सकाळीं") {
            return hour;
          } else if (meridiem2 === "दनपारां") {
            return hour > 12 ? hour : hour + 12;
          } else if (meridiem2 === "सांजे") {
            return hour + 12;
          }
        },
        meridiem: function(hour, minute, isLower) {
          if (hour < 4) {
            return "राती";
          } else if (hour < 12) {
            return "सकाळीं";
          } else if (hour < 16) {
            return "दनपारां";
          } else if (hour < 20) {
            return "सांजे";
          } else {
            return "राती";
          }
        }
      });
      //! moment.js locale configuration
      function processRelativeTime$6(number, withoutSuffix, key, isFuture) {
        var format2 = {
          s: ["thoddea sekondamni", "thodde sekond"],
          ss: [number + " sekondamni", number + " sekond"],
          m: ["eka mintan", "ek minut"],
          mm: [number + " mintamni", number + " mintam"],
          h: ["eka voran", "ek vor"],
          hh: [number + " voramni", number + " voram"],
          d: ["eka disan", "ek dis"],
          dd: [number + " disamni", number + " dis"],
          M: ["eka mhoinean", "ek mhoino"],
          MM: [number + " mhoineamni", number + " mhoine"],
          y: ["eka vorsan", "ek voros"],
          yy: [number + " vorsamni", number + " vorsam"]
        };
        return isFuture ? format2[key][0] : format2[key][1];
      }
      hooks.defineLocale("gom-latn", {
        months: {
          standalone: "Janer_Febrer_Mars_Abril_Mai_Jun_Julai_Agost_Setembr_Otubr_Novembr_Dezembr".split(
            "_"
          ),
          format: "Janerachea_Febrerachea_Marsachea_Abrilachea_Maiachea_Junachea_Julaiachea_Agostachea_Setembrachea_Otubrachea_Novembrachea_Dezembrachea".split(
            "_"
          ),
          isFormat: /MMMM(\s)+D[oD]?/
        },
        monthsShort: "Jan._Feb._Mars_Abr._Mai_Jun_Jul._Ago._Set._Otu._Nov._Dez.".split("_"),
        monthsParseExact: true,
        weekdays: "Aitar_Somar_Mongllar_Budhvar_Birestar_Sukrar_Son'var".split("_"),
        weekdaysShort: "Ait._Som._Mon._Bud._Bre._Suk._Son.".split("_"),
        weekdaysMin: "Ai_Sm_Mo_Bu_Br_Su_Sn".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "A h:mm [vazta]",
          LTS: "A h:mm:ss [vazta]",
          L: "DD-MM-YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY A h:mm [vazta]",
          LLLL: "dddd, MMMM Do, YYYY, A h:mm [vazta]",
          llll: "ddd, D MMM YYYY, A h:mm [vazta]"
        },
        calendar: {
          sameDay: "[Aiz] LT",
          nextDay: "[Faleam] LT",
          nextWeek: "[Fuddlo] dddd[,] LT",
          lastDay: "[Kal] LT",
          lastWeek: "[Fattlo] dddd[,] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "%s",
          past: "%s adim",
          s: processRelativeTime$6,
          ss: processRelativeTime$6,
          m: processRelativeTime$6,
          mm: processRelativeTime$6,
          h: processRelativeTime$6,
          hh: processRelativeTime$6,
          d: processRelativeTime$6,
          dd: processRelativeTime$6,
          M: processRelativeTime$6,
          MM: processRelativeTime$6,
          y: processRelativeTime$6,
          yy: processRelativeTime$6
        },
        dayOfMonthOrdinalParse: /\d{1,2}(er)/,
        ordinal: function(number, period) {
          switch (period) {
            // the ordinal 'er' only applies to day of the month
            case "D":
              return number + "er";
            default:
            case "M":
            case "Q":
            case "DDD":
            case "d":
            case "w":
            case "W":
              return number;
          }
        },
        week: {
          dow: 0,
          // Sunday is the first day of the week
          doy: 3
          // The week that contains Jan 4th is the first week of the year (7 + 0 - 4)
        },
        meridiemParse: /rati|sokallim|donparam|sanje/,
        meridiemHour: function(hour, meridiem2) {
          if (hour === 12) {
            hour = 0;
          }
          if (meridiem2 === "rati") {
            return hour < 4 ? hour : hour + 12;
          } else if (meridiem2 === "sokallim") {
            return hour;
          } else if (meridiem2 === "donparam") {
            return hour > 12 ? hour : hour + 12;
          } else if (meridiem2 === "sanje") {
            return hour + 12;
          }
        },
        meridiem: function(hour, minute, isLower) {
          if (hour < 4) {
            return "rati";
          } else if (hour < 12) {
            return "sokallim";
          } else if (hour < 16) {
            return "donparam";
          } else if (hour < 20) {
            return "sanje";
          } else {
            return "rati";
          }
        }
      });
      //! moment.js locale configuration
      var symbolMap$8 = {
        1: "૧",
        2: "૨",
        3: "૩",
        4: "૪",
        5: "૫",
        6: "૬",
        7: "૭",
        8: "૮",
        9: "૯",
        0: "૦"
      }, numberMap$7 = {
        "૧": "1",
        "૨": "2",
        "૩": "3",
        "૪": "4",
        "૫": "5",
        "૬": "6",
        "૭": "7",
        "૮": "8",
        "૯": "9",
        "૦": "0"
      };
      hooks.defineLocale("gu", {
        months: "જાન્યુઆરી_ફેબ્રુઆરી_માર્ચ_એપ્રિલ_મે_જૂન_જુલાઈ_ઑગસ્ટ_સપ્ટેમ્બર_ઑક્ટ્બર_નવેમ્બર_ડિસેમ્બર".split(
          "_"
        ),
        monthsShort: "જાન્યુ._ફેબ્રુ._માર્ચ_એપ્રિ._મે_જૂન_જુલા._ઑગ._સપ્ટે._ઑક્ટ્._નવે._ડિસે.".split(
          "_"
        ),
        monthsParseExact: true,
        weekdays: "રવિવાર_સોમવાર_મંગળવાર_બુધ્વાર_ગુરુવાર_શુક્રવાર_શનિવાર".split(
          "_"
        ),
        weekdaysShort: "રવિ_સોમ_મંગળ_બુધ્_ગુરુ_શુક્ર_શનિ".split("_"),
        weekdaysMin: "ર_સો_મં_બુ_ગુ_શુ_શ".split("_"),
        longDateFormat: {
          LT: "A h:mm વાગ્યે",
          LTS: "A h:mm:ss વાગ્યે",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY, A h:mm વાગ્યે",
          LLLL: "dddd, D MMMM YYYY, A h:mm વાગ્યે"
        },
        calendar: {
          sameDay: "[આજ] LT",
          nextDay: "[કાલે] LT",
          nextWeek: "dddd, LT",
          lastDay: "[ગઇકાલે] LT",
          lastWeek: "[પાછલા] dddd, LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "%s મા",
          past: "%s પહેલા",
          s: "અમુક પળો",
          ss: "%d સેકંડ",
          m: "એક મિનિટ",
          mm: "%d મિનિટ",
          h: "એક કલાક",
          hh: "%d કલાક",
          d: "એક દિવસ",
          dd: "%d દિવસ",
          M: "એક મહિનો",
          MM: "%d મહિનો",
          y: "એક વર્ષ",
          yy: "%d વર્ષ"
        },
        preparse: function(string) {
          return string.replace(/[૧૨૩૪૫૬૭૮૯૦]/g, function(match) {
            return numberMap$7[match];
          });
        },
        postformat: function(string) {
          return string.replace(/\d/g, function(match) {
            return symbolMap$8[match];
          });
        },
        // Gujarati notation for meridiems are quite fuzzy in practice. While there exists
        // a rigid notion of a 'Pahar' it is not used as rigidly in modern Gujarati.
        meridiemParse: /રાત|બપોર|સવાર|સાંજ/,
        meridiemHour: function(hour, meridiem2) {
          if (hour === 12) {
            hour = 0;
          }
          if (meridiem2 === "રાત") {
            return hour < 4 ? hour : hour + 12;
          } else if (meridiem2 === "સવાર") {
            return hour;
          } else if (meridiem2 === "બપોર") {
            return hour >= 10 ? hour : hour + 12;
          } else if (meridiem2 === "સાંજ") {
            return hour + 12;
          }
        },
        meridiem: function(hour, minute, isLower) {
          if (hour < 4) {
            return "રાત";
          } else if (hour < 10) {
            return "સવાર";
          } else if (hour < 17) {
            return "બપોર";
          } else if (hour < 20) {
            return "સાંજ";
          } else {
            return "રાત";
          }
        },
        week: {
          dow: 0,
          // Sunday is the first day of the week.
          doy: 6
          // The week that contains Jan 6th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("he", {
        months: "ינואר_פברואר_מרץ_אפריל_מאי_יוני_יולי_אוגוסט_ספטמבר_אוקטובר_נובמבר_דצמבר".split(
          "_"
        ),
        monthsShort: "ינו׳_פבר׳_מרץ_אפר׳_מאי_יוני_יולי_אוג׳_ספט׳_אוק׳_נוב׳_דצמ׳".split("_"),
        weekdays: "ראשון_שני_שלישי_רביעי_חמישי_שישי_שבת".split("_"),
        weekdaysShort: "א׳_ב׳_ג׳_ד׳_ה׳_ו׳_ש׳".split("_"),
        weekdaysMin: "א_ב_ג_ד_ה_ו_ש".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D [ב]MMMM YYYY",
          LLL: "D [ב]MMMM YYYY HH:mm",
          LLLL: "dddd, D [ב]MMMM YYYY HH:mm",
          l: "D/M/YYYY",
          ll: "D MMM YYYY",
          lll: "D MMM YYYY HH:mm",
          llll: "ddd, D MMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[היום ב־]LT",
          nextDay: "[מחר ב־]LT",
          nextWeek: "dddd [בשעה] LT",
          lastDay: "[אתמול ב־]LT",
          lastWeek: "[ביום] dddd [האחרון בשעה] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "בעוד %s",
          past: "לפני %s",
          s: "מספר שניות",
          ss: "%d שניות",
          m: "דקה",
          mm: "%d דקות",
          h: "שעה",
          hh: function(number) {
            if (number === 2) {
              return "שעתיים";
            }
            return number + " שעות";
          },
          d: "יום",
          dd: function(number) {
            if (number === 2) {
              return "יומיים";
            }
            return number + " ימים";
          },
          M: "חודש",
          MM: function(number) {
            if (number === 2) {
              return "חודשיים";
            }
            return number + " חודשים";
          },
          y: "שנה",
          yy: function(number) {
            if (number === 2) {
              return "שנתיים";
            } else if (number % 10 === 0 && number !== 10) {
              return number + " שנה";
            }
            return number + " שנים";
          }
        },
        meridiemParse: /אחה"צ|לפנה"צ|אחרי הצהריים|לפני הצהריים|לפנות בוקר|בבוקר|בערב/i,
        isPM: function(input) {
          return /^(אחה"צ|אחרי הצהריים|בערב)$/.test(input);
        },
        meridiem: function(hour, minute, isLower) {
          if (hour < 5) {
            return "לפנות בוקר";
          } else if (hour < 10) {
            return "בבוקר";
          } else if (hour < 12) {
            return isLower ? 'לפנה"צ' : "לפני הצהריים";
          } else if (hour < 18) {
            return isLower ? 'אחה"צ' : "אחרי הצהריים";
          } else {
            return "בערב";
          }
        }
      });
      //! moment.js locale configuration
      var symbolMap$9 = {
        1: "१",
        2: "२",
        3: "३",
        4: "४",
        5: "५",
        6: "६",
        7: "७",
        8: "८",
        9: "९",
        0: "०"
      }, numberMap$8 = {
        "१": "1",
        "२": "2",
        "३": "3",
        "४": "4",
        "५": "5",
        "६": "6",
        "७": "7",
        "८": "8",
        "९": "9",
        "०": "0"
      }, monthsParse$7 = [
        /^जन/i,
        /^फ़र|फर/i,
        /^मार्च/i,
        /^अप्रै/i,
        /^मई/i,
        /^जून/i,
        /^जुल/i,
        /^अग/i,
        /^सितं|सित/i,
        /^अक्टू/i,
        /^नव|नवं/i,
        /^दिसं|दिस/i
      ], shortMonthsParse = [
        /^जन/i,
        /^फ़र/i,
        /^मार्च/i,
        /^अप्रै/i,
        /^मई/i,
        /^जून/i,
        /^जुल/i,
        /^अग/i,
        /^सित/i,
        /^अक्टू/i,
        /^नव/i,
        /^दिस/i
      ];
      hooks.defineLocale("hi", {
        months: {
          format: "जनवरी_फ़रवरी_मार्च_अप्रैल_मई_जून_जुलाई_अगस्त_सितम्बर_अक्टूबर_नवम्बर_दिसम्बर".split(
            "_"
          ),
          standalone: "जनवरी_फरवरी_मार्च_अप्रैल_मई_जून_जुलाई_अगस्त_सितंबर_अक्टूबर_नवंबर_दिसंबर".split(
            "_"
          )
        },
        monthsShort: "जन._फ़र._मार्च_अप्रै._मई_जून_जुल._अग._सित._अक्टू._नव._दिस.".split("_"),
        weekdays: "रविवार_सोमवार_मंगलवार_बुधवार_गुरूवार_शुक्रवार_शनिवार".split("_"),
        weekdaysShort: "रवि_सोम_मंगल_बुध_गुरू_शुक्र_शनि".split("_"),
        weekdaysMin: "र_सो_मं_बु_गु_शु_श".split("_"),
        longDateFormat: {
          LT: "A h:mm बजे",
          LTS: "A h:mm:ss बजे",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY, A h:mm बजे",
          LLLL: "dddd, D MMMM YYYY, A h:mm बजे"
        },
        monthsParse: monthsParse$7,
        longMonthsParse: monthsParse$7,
        shortMonthsParse,
        monthsRegex: /^(जनवरी|जन\.?|फ़रवरी|फरवरी|फ़र\.?|मार्च?|अप्रैल|अप्रै\.?|मई?|जून?|जुलाई|जुल\.?|अगस्त|अग\.?|सितम्बर|सितंबर|सित\.?|अक्टूबर|अक्टू\.?|नवम्बर|नवंबर|नव\.?|दिसम्बर|दिसंबर|दिस\.?)/i,
        monthsShortRegex: /^(जनवरी|जन\.?|फ़रवरी|फरवरी|फ़र\.?|मार्च?|अप्रैल|अप्रै\.?|मई?|जून?|जुलाई|जुल\.?|अगस्त|अग\.?|सितम्बर|सितंबर|सित\.?|अक्टूबर|अक्टू\.?|नवम्बर|नवंबर|नव\.?|दिसम्बर|दिसंबर|दिस\.?)/i,
        monthsStrictRegex: /^(जनवरी?|फ़रवरी|फरवरी?|मार्च?|अप्रैल?|मई?|जून?|जुलाई?|अगस्त?|सितम्बर|सितंबर|सित?\.?|अक्टूबर|अक्टू\.?|नवम्बर|नवंबर?|दिसम्बर|दिसंबर?)/i,
        monthsShortStrictRegex: /^(जन\.?|फ़र\.?|मार्च?|अप्रै\.?|मई?|जून?|जुल\.?|अग\.?|सित\.?|अक्टू\.?|नव\.?|दिस\.?)/i,
        calendar: {
          sameDay: "[आज] LT",
          nextDay: "[कल] LT",
          nextWeek: "dddd, LT",
          lastDay: "[कल] LT",
          lastWeek: "[पिछले] dddd, LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "%s में",
          past: "%s पहले",
          s: "कुछ ही क्षण",
          ss: "%d सेकंड",
          m: "एक मिनट",
          mm: "%d मिनट",
          h: "एक घंटा",
          hh: "%d घंटे",
          d: "एक दिन",
          dd: "%d दिन",
          M: "एक महीने",
          MM: "%d महीने",
          y: "एक वर्ष",
          yy: "%d वर्ष"
        },
        preparse: function(string) {
          return string.replace(/[१२३४५६७८९०]/g, function(match) {
            return numberMap$8[match];
          });
        },
        postformat: function(string) {
          return string.replace(/\d/g, function(match) {
            return symbolMap$9[match];
          });
        },
        // Hindi notation for meridiems are quite fuzzy in practice. While there exists
        // a rigid notion of a 'Pahar' it is not used as rigidly in modern Hindi.
        meridiemParse: /रात|सुबह|दोपहर|शाम/,
        meridiemHour: function(hour, meridiem2) {
          if (hour === 12) {
            hour = 0;
          }
          if (meridiem2 === "रात") {
            return hour < 4 ? hour : hour + 12;
          } else if (meridiem2 === "सुबह") {
            return hour;
          } else if (meridiem2 === "दोपहर") {
            return hour >= 10 ? hour : hour + 12;
          } else if (meridiem2 === "शाम") {
            return hour + 12;
          }
        },
        meridiem: function(hour, minute, isLower) {
          if (hour < 4) {
            return "रात";
          } else if (hour < 10) {
            return "सुबह";
          } else if (hour < 17) {
            return "दोपहर";
          } else if (hour < 20) {
            return "शाम";
          } else {
            return "रात";
          }
        },
        week: {
          dow: 0,
          // Sunday is the first day of the week.
          doy: 6
          // The week that contains Jan 6th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      function translate$3(number, withoutSuffix, key) {
        var result = number + " ";
        switch (key) {
          case "ss":
            if (number === 1) {
              result += "sekunda";
            } else if (number === 2 || number === 3 || number === 4) {
              result += "sekunde";
            } else {
              result += "sekundi";
            }
            return result;
          case "m":
            return withoutSuffix ? "jedna minuta" : "jedne minute";
          case "mm":
            if (number === 1) {
              result += "minuta";
            } else if (number === 2 || number === 3 || number === 4) {
              result += "minute";
            } else {
              result += "minuta";
            }
            return result;
          case "h":
            return withoutSuffix ? "jedan sat" : "jednog sata";
          case "hh":
            if (number === 1) {
              result += "sat";
            } else if (number === 2 || number === 3 || number === 4) {
              result += "sata";
            } else {
              result += "sati";
            }
            return result;
          case "dd":
            if (number === 1) {
              result += "dan";
            } else {
              result += "dana";
            }
            return result;
          case "MM":
            if (number === 1) {
              result += "mjesec";
            } else if (number === 2 || number === 3 || number === 4) {
              result += "mjeseca";
            } else {
              result += "mjeseci";
            }
            return result;
          case "yy":
            if (number === 1) {
              result += "godina";
            } else if (number === 2 || number === 3 || number === 4) {
              result += "godine";
            } else {
              result += "godina";
            }
            return result;
        }
      }
      hooks.defineLocale("hr", {
        months: {
          format: "siječnja_veljače_ožujka_travnja_svibnja_lipnja_srpnja_kolovoza_rujna_listopada_studenoga_prosinca".split(
            "_"
          ),
          standalone: "siječanj_veljača_ožujak_travanj_svibanj_lipanj_srpanj_kolovoz_rujan_listopad_studeni_prosinac".split(
            "_"
          )
        },
        monthsShort: "sij._velj._ožu._tra._svi._lip._srp._kol._ruj._lis._stu._pro.".split(
          "_"
        ),
        monthsParseExact: true,
        weekdays: "nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split(
          "_"
        ),
        weekdaysShort: "ned._pon._uto._sri._čet._pet._sub.".split("_"),
        weekdaysMin: "ne_po_ut_sr_če_pe_su".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "H:mm",
          LTS: "H:mm:ss",
          L: "DD.MM.YYYY",
          LL: "Do MMMM YYYY",
          LLL: "Do MMMM YYYY H:mm",
          LLLL: "dddd, Do MMMM YYYY H:mm"
        },
        calendar: {
          sameDay: "[danas u] LT",
          nextDay: "[sutra u] LT",
          nextWeek: function() {
            switch (this.day()) {
              case 0:
                return "[u] [nedjelju] [u] LT";
              case 3:
                return "[u] [srijedu] [u] LT";
              case 6:
                return "[u] [subotu] [u] LT";
              case 1:
              case 2:
              case 4:
              case 5:
                return "[u] dddd [u] LT";
            }
          },
          lastDay: "[jučer u] LT",
          lastWeek: function() {
            switch (this.day()) {
              case 0:
                return "[prošlu] [nedjelju] [u] LT";
              case 3:
                return "[prošlu] [srijedu] [u] LT";
              case 6:
                return "[prošle] [subote] [u] LT";
              case 1:
              case 2:
              case 4:
              case 5:
                return "[prošli] dddd [u] LT";
            }
          },
          sameElse: "L"
        },
        relativeTime: {
          future: "za %s",
          past: "prije %s",
          s: "par sekundi",
          ss: translate$3,
          m: translate$3,
          mm: translate$3,
          h: translate$3,
          hh: translate$3,
          d: "dan",
          dd: translate$3,
          M: "mjesec",
          MM: translate$3,
          y: "godinu",
          yy: translate$3
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal: "%d.",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 7
          // The week that contains Jan 7th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var weekEndings = "vasárnap hétfőn kedden szerdán csütörtökön pénteken szombaton".split(" ");
      function translate$4(number, withoutSuffix, key, isFuture) {
        var num = number;
        switch (key) {
          case "s":
            return isFuture || withoutSuffix ? "néhány másodperc" : "néhány másodperce";
          case "ss":
            return num + (isFuture || withoutSuffix) ? " másodperc" : " másodperce";
          case "m":
            return "egy" + (isFuture || withoutSuffix ? " perc" : " perce");
          case "mm":
            return num + (isFuture || withoutSuffix ? " perc" : " perce");
          case "h":
            return "egy" + (isFuture || withoutSuffix ? " óra" : " órája");
          case "hh":
            return num + (isFuture || withoutSuffix ? " óra" : " órája");
          case "d":
            return "egy" + (isFuture || withoutSuffix ? " nap" : " napja");
          case "dd":
            return num + (isFuture || withoutSuffix ? " nap" : " napja");
          case "M":
            return "egy" + (isFuture || withoutSuffix ? " hónap" : " hónapja");
          case "MM":
            return num + (isFuture || withoutSuffix ? " hónap" : " hónapja");
          case "y":
            return "egy" + (isFuture || withoutSuffix ? " év" : " éve");
          case "yy":
            return num + (isFuture || withoutSuffix ? " év" : " éve");
        }
        return "";
      }
      function week(isFuture) {
        return (isFuture ? "" : "[múlt] ") + "[" + weekEndings[this.day()] + "] LT[-kor]";
      }
      hooks.defineLocale("hu", {
        months: "január_február_március_április_május_június_július_augusztus_szeptember_október_november_december".split(
          "_"
        ),
        monthsShort: "jan._feb._márc._ápr._máj._jún._júl._aug._szept._okt._nov._dec.".split(
          "_"
        ),
        monthsParseExact: true,
        weekdays: "vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat".split("_"),
        weekdaysShort: "vas_hét_kedd_sze_csüt_pén_szo".split("_"),
        weekdaysMin: "v_h_k_sze_cs_p_szo".split("_"),
        longDateFormat: {
          LT: "H:mm",
          LTS: "H:mm:ss",
          L: "YYYY.MM.DD.",
          LL: "YYYY. MMMM D.",
          LLL: "YYYY. MMMM D. H:mm",
          LLLL: "YYYY. MMMM D., dddd H:mm"
        },
        meridiemParse: /de|du/i,
        isPM: function(input) {
          return input.charAt(1).toLowerCase() === "u";
        },
        meridiem: function(hours2, minutes2, isLower) {
          if (hours2 < 12) {
            return isLower === true ? "de" : "DE";
          } else {
            return isLower === true ? "du" : "DU";
          }
        },
        calendar: {
          sameDay: "[ma] LT[-kor]",
          nextDay: "[holnap] LT[-kor]",
          nextWeek: function() {
            return week.call(this, true);
          },
          lastDay: "[tegnap] LT[-kor]",
          lastWeek: function() {
            return week.call(this, false);
          },
          sameElse: "L"
        },
        relativeTime: {
          future: "%s múlva",
          past: "%s",
          s: translate$4,
          ss: translate$4,
          m: translate$4,
          mm: translate$4,
          h: translate$4,
          hh: translate$4,
          d: translate$4,
          dd: translate$4,
          M: translate$4,
          MM: translate$4,
          y: translate$4,
          yy: translate$4
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal: "%d.",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("hy-am", {
        months: {
          format: "հունվարի_փետրվարի_մարտի_ապրիլի_մայիսի_հունիսի_հուլիսի_օգոստոսի_սեպտեմբերի_հոկտեմբերի_նոյեմբերի_դեկտեմբերի".split(
            "_"
          ),
          standalone: "հունվար_փետրվար_մարտ_ապրիլ_մայիս_հունիս_հուլիս_օգոստոս_սեպտեմբեր_հոկտեմբեր_նոյեմբեր_դեկտեմբեր".split(
            "_"
          )
        },
        monthsShort: "հնվ_փտր_մրտ_ապր_մյս_հնս_հլս_օգս_սպտ_հկտ_նմբ_դկտ".split("_"),
        weekdays: "կիրակի_երկուշաբթի_երեքշաբթի_չորեքշաբթի_հինգշաբթի_ուրբաթ_շաբաթ".split(
          "_"
        ),
        weekdaysShort: "կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ".split("_"),
        weekdaysMin: "կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD.MM.YYYY",
          LL: "D MMMM YYYY թ.",
          LLL: "D MMMM YYYY թ., HH:mm",
          LLLL: "dddd, D MMMM YYYY թ., HH:mm"
        },
        calendar: {
          sameDay: "[այսօր] LT",
          nextDay: "[վաղը] LT",
          lastDay: "[երեկ] LT",
          nextWeek: function() {
            return "dddd [օրը ժամը] LT";
          },
          lastWeek: function() {
            return "[անցած] dddd [օրը ժամը] LT";
          },
          sameElse: "L"
        },
        relativeTime: {
          future: "%s հետո",
          past: "%s առաջ",
          s: "մի քանի վայրկյան",
          ss: "%d վայրկյան",
          m: "րոպե",
          mm: "%d րոպե",
          h: "ժամ",
          hh: "%d ժամ",
          d: "օր",
          dd: "%d օր",
          M: "ամիս",
          MM: "%d ամիս",
          y: "տարի",
          yy: "%d տարի"
        },
        meridiemParse: /գիշերվա|առավոտվա|ցերեկվա|երեկոյան/,
        isPM: function(input) {
          return /^(ցերեկվա|երեկոյան)$/.test(input);
        },
        meridiem: function(hour) {
          if (hour < 4) {
            return "գիշերվա";
          } else if (hour < 12) {
            return "առավոտվա";
          } else if (hour < 17) {
            return "ցերեկվա";
          } else {
            return "երեկոյան";
          }
        },
        dayOfMonthOrdinalParse: /\d{1,2}|\d{1,2}-(ին|րդ)/,
        ordinal: function(number, period) {
          switch (period) {
            case "DDD":
            case "w":
            case "W":
            case "DDDo":
              if (number === 1) {
                return number + "-ին";
              }
              return number + "-րդ";
            default:
              return number;
          }
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 7
          // The week that contains Jan 7th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("id", {
        months: "Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember".split(
          "_"
        ),
        monthsShort: "Jan_Feb_Mar_Apr_Mei_Jun_Jul_Agt_Sep_Okt_Nov_Des".split("_"),
        weekdays: "Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu".split("_"),
        weekdaysShort: "Min_Sen_Sel_Rab_Kam_Jum_Sab".split("_"),
        weekdaysMin: "Mg_Sn_Sl_Rb_Km_Jm_Sb".split("_"),
        longDateFormat: {
          LT: "HH.mm",
          LTS: "HH.mm.ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY [pukul] HH.mm",
          LLLL: "dddd, D MMMM YYYY [pukul] HH.mm"
        },
        meridiemParse: /pagi|siang|sore|malam/,
        meridiemHour: function(hour, meridiem2) {
          if (hour === 12) {
            hour = 0;
          }
          if (meridiem2 === "pagi") {
            return hour;
          } else if (meridiem2 === "siang") {
            return hour >= 11 ? hour : hour + 12;
          } else if (meridiem2 === "sore" || meridiem2 === "malam") {
            return hour + 12;
          }
        },
        meridiem: function(hours2, minutes2, isLower) {
          if (hours2 < 11) {
            return "pagi";
          } else if (hours2 < 15) {
            return "siang";
          } else if (hours2 < 19) {
            return "sore";
          } else {
            return "malam";
          }
        },
        calendar: {
          sameDay: "[Hari ini pukul] LT",
          nextDay: "[Besok pukul] LT",
          nextWeek: "dddd [pukul] LT",
          lastDay: "[Kemarin pukul] LT",
          lastWeek: "dddd [lalu pukul] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "dalam %s",
          past: "%s yang lalu",
          s: "beberapa detik",
          ss: "%d detik",
          m: "semenit",
          mm: "%d menit",
          h: "sejam",
          hh: "%d jam",
          d: "sehari",
          dd: "%d hari",
          M: "sebulan",
          MM: "%d bulan",
          y: "setahun",
          yy: "%d tahun"
        },
        week: {
          dow: 0,
          // Sunday is the first day of the week.
          doy: 6
          // The week that contains Jan 6th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      function plural$2(n) {
        if (n % 100 === 11) {
          return true;
        } else if (n % 10 === 1) {
          return false;
        }
        return true;
      }
      function translate$5(number, withoutSuffix, key, isFuture) {
        var result = number + " ";
        switch (key) {
          case "s":
            return withoutSuffix || isFuture ? "nokkrar sekúndur" : "nokkrum sekúndum";
          case "ss":
            if (plural$2(number)) {
              return result + (withoutSuffix || isFuture ? "sekúndur" : "sekúndum");
            }
            return result + "sekúnda";
          case "m":
            return withoutSuffix ? "mínúta" : "mínútu";
          case "mm":
            if (plural$2(number)) {
              return result + (withoutSuffix || isFuture ? "mínútur" : "mínútum");
            } else if (withoutSuffix) {
              return result + "mínúta";
            }
            return result + "mínútu";
          case "hh":
            if (plural$2(number)) {
              return result + (withoutSuffix || isFuture ? "klukkustundir" : "klukkustundum");
            }
            return result + "klukkustund";
          case "d":
            if (withoutSuffix) {
              return "dagur";
            }
            return isFuture ? "dag" : "degi";
          case "dd":
            if (plural$2(number)) {
              if (withoutSuffix) {
                return result + "dagar";
              }
              return result + (isFuture ? "daga" : "dögum");
            } else if (withoutSuffix) {
              return result + "dagur";
            }
            return result + (isFuture ? "dag" : "degi");
          case "M":
            if (withoutSuffix) {
              return "mánuður";
            }
            return isFuture ? "mánuð" : "mánuði";
          case "MM":
            if (plural$2(number)) {
              if (withoutSuffix) {
                return result + "mánuðir";
              }
              return result + (isFuture ? "mánuði" : "mánuðum");
            } else if (withoutSuffix) {
              return result + "mánuður";
            }
            return result + (isFuture ? "mánuð" : "mánuði");
          case "y":
            return withoutSuffix || isFuture ? "ár" : "ári";
          case "yy":
            if (plural$2(number)) {
              return result + (withoutSuffix || isFuture ? "ár" : "árum");
            }
            return result + (withoutSuffix || isFuture ? "ár" : "ári");
        }
      }
      hooks.defineLocale("is", {
        months: "janúar_febrúar_mars_apríl_maí_júní_júlí_ágúst_september_október_nóvember_desember".split(
          "_"
        ),
        monthsShort: "jan_feb_mar_apr_maí_jún_júl_ágú_sep_okt_nóv_des".split("_"),
        weekdays: "sunnudagur_mánudagur_þriðjudagur_miðvikudagur_fimmtudagur_föstudagur_laugardagur".split(
          "_"
        ),
        weekdaysShort: "sun_mán_þri_mið_fim_fös_lau".split("_"),
        weekdaysMin: "Su_Má_Þr_Mi_Fi_Fö_La".split("_"),
        longDateFormat: {
          LT: "H:mm",
          LTS: "H:mm:ss",
          L: "DD.MM.YYYY",
          LL: "D. MMMM YYYY",
          LLL: "D. MMMM YYYY [kl.] H:mm",
          LLLL: "dddd, D. MMMM YYYY [kl.] H:mm"
        },
        calendar: {
          sameDay: "[í dag kl.] LT",
          nextDay: "[á morgun kl.] LT",
          nextWeek: "dddd [kl.] LT",
          lastDay: "[í gær kl.] LT",
          lastWeek: "[síðasta] dddd [kl.] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "eftir %s",
          past: "fyrir %s síðan",
          s: translate$5,
          ss: translate$5,
          m: translate$5,
          mm: translate$5,
          h: "klukkustund",
          hh: translate$5,
          d: translate$5,
          dd: translate$5,
          M: translate$5,
          MM: translate$5,
          y: translate$5,
          yy: translate$5
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal: "%d.",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("it-ch", {
        months: "gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre".split(
          "_"
        ),
        monthsShort: "gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic".split("_"),
        weekdays: "domenica_lunedì_martedì_mercoledì_giovedì_venerdì_sabato".split(
          "_"
        ),
        weekdaysShort: "dom_lun_mar_mer_gio_ven_sab".split("_"),
        weekdaysMin: "do_lu_ma_me_gi_ve_sa".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD.MM.YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd D MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[Oggi alle] LT",
          nextDay: "[Domani alle] LT",
          nextWeek: "dddd [alle] LT",
          lastDay: "[Ieri alle] LT",
          lastWeek: function() {
            switch (this.day()) {
              case 0:
                return "[la scorsa] dddd [alle] LT";
              default:
                return "[lo scorso] dddd [alle] LT";
            }
          },
          sameElse: "L"
        },
        relativeTime: {
          future: function(s) {
            return (/^[0-9].+$/.test(s) ? "tra" : "in") + " " + s;
          },
          past: "%s fa",
          s: "alcuni secondi",
          ss: "%d secondi",
          m: "un minuto",
          mm: "%d minuti",
          h: "un'ora",
          hh: "%d ore",
          d: "un giorno",
          dd: "%d giorni",
          M: "un mese",
          MM: "%d mesi",
          y: "un anno",
          yy: "%d anni"
        },
        dayOfMonthOrdinalParse: /\d{1,2}º/,
        ordinal: "%dº",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("it", {
        months: "gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre".split(
          "_"
        ),
        monthsShort: "gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic".split("_"),
        weekdays: "domenica_lunedì_martedì_mercoledì_giovedì_venerdì_sabato".split(
          "_"
        ),
        weekdaysShort: "dom_lun_mar_mer_gio_ven_sab".split("_"),
        weekdaysMin: "do_lu_ma_me_gi_ve_sa".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd D MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: function() {
            return "[Oggi a" + (this.hours() > 1 ? "lle " : this.hours() === 0 ? " " : "ll'") + "]LT";
          },
          nextDay: function() {
            return "[Domani a" + (this.hours() > 1 ? "lle " : this.hours() === 0 ? " " : "ll'") + "]LT";
          },
          nextWeek: function() {
            return "dddd [a" + (this.hours() > 1 ? "lle " : this.hours() === 0 ? " " : "ll'") + "]LT";
          },
          lastDay: function() {
            return "[Ieri a" + (this.hours() > 1 ? "lle " : this.hours() === 0 ? " " : "ll'") + "]LT";
          },
          lastWeek: function() {
            switch (this.day()) {
              case 0:
                return "[La scorsa] dddd [a" + (this.hours() > 1 ? "lle " : this.hours() === 0 ? " " : "ll'") + "]LT";
              default:
                return "[Lo scorso] dddd [a" + (this.hours() > 1 ? "lle " : this.hours() === 0 ? " " : "ll'") + "]LT";
            }
          },
          sameElse: "L"
        },
        relativeTime: {
          future: "tra %s",
          past: "%s fa",
          s: "alcuni secondi",
          ss: "%d secondi",
          m: "un minuto",
          mm: "%d minuti",
          h: "un'ora",
          hh: "%d ore",
          d: "un giorno",
          dd: "%d giorni",
          w: "una settimana",
          ww: "%d settimane",
          M: "un mese",
          MM: "%d mesi",
          y: "un anno",
          yy: "%d anni"
        },
        dayOfMonthOrdinalParse: /\d{1,2}º/,
        ordinal: "%dº",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("ja", {
        eras: [
          {
            since: "2019-05-01",
            offset: 1,
            name: "令和",
            narrow: "㋿",
            abbr: "R"
          },
          {
            since: "1989-01-08",
            until: "2019-04-30",
            offset: 1,
            name: "平成",
            narrow: "㍻",
            abbr: "H"
          },
          {
            since: "1926-12-25",
            until: "1989-01-07",
            offset: 1,
            name: "昭和",
            narrow: "㍼",
            abbr: "S"
          },
          {
            since: "1912-07-30",
            until: "1926-12-24",
            offset: 1,
            name: "大正",
            narrow: "㍽",
            abbr: "T"
          },
          {
            since: "1873-01-01",
            until: "1912-07-29",
            offset: 6,
            name: "明治",
            narrow: "㍾",
            abbr: "M"
          },
          {
            since: "0001-01-01",
            until: "1873-12-31",
            offset: 1,
            name: "西暦",
            narrow: "AD",
            abbr: "AD"
          },
          {
            since: "0000-12-31",
            until: -Infinity,
            offset: 1,
            name: "紀元前",
            narrow: "BC",
            abbr: "BC"
          }
        ],
        eraYearOrdinalRegex: /(元|\d+)年/,
        eraYearOrdinalParse: function(input, match) {
          return match[1] === "元" ? 1 : parseInt(match[1] || input, 10);
        },
        months: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
        monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split(
          "_"
        ),
        weekdays: "日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日".split("_"),
        weekdaysShort: "日_月_火_水_木_金_土".split("_"),
        weekdaysMin: "日_月_火_水_木_金_土".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "YYYY/MM/DD",
          LL: "YYYY年M月D日",
          LLL: "YYYY年M月D日 HH:mm",
          LLLL: "YYYY年M月D日 dddd HH:mm",
          l: "YYYY/MM/DD",
          ll: "YYYY年M月D日",
          lll: "YYYY年M月D日 HH:mm",
          llll: "YYYY年M月D日(ddd) HH:mm"
        },
        meridiemParse: /午前|午後/i,
        isPM: function(input) {
          return input === "午後";
        },
        meridiem: function(hour, minute, isLower) {
          if (hour < 12) {
            return "午前";
          } else {
            return "午後";
          }
        },
        calendar: {
          sameDay: "[今日] LT",
          nextDay: "[明日] LT",
          nextWeek: function(now2) {
            if (now2.week() !== this.week()) {
              return "[来週]dddd LT";
            } else {
              return "dddd LT";
            }
          },
          lastDay: "[昨日] LT",
          lastWeek: function(now2) {
            if (this.week() !== now2.week()) {
              return "[先週]dddd LT";
            } else {
              return "dddd LT";
            }
          },
          sameElse: "L"
        },
        dayOfMonthOrdinalParse: /\d{1,2}日/,
        ordinal: function(number, period) {
          switch (period) {
            case "y":
              return number === 1 ? "元年" : number + "年";
            case "d":
            case "D":
            case "DDD":
              return number + "日";
            default:
              return number;
          }
        },
        relativeTime: {
          future: "%s後",
          past: "%s前",
          s: "数秒",
          ss: "%d秒",
          m: "1分",
          mm: "%d分",
          h: "1時間",
          hh: "%d時間",
          d: "1日",
          dd: "%d日",
          M: "1ヶ月",
          MM: "%dヶ月",
          y: "1年",
          yy: "%d年"
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("jv", {
        months: "Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_Nopember_Desember".split(
          "_"
        ),
        monthsShort: "Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nop_Des".split("_"),
        weekdays: "Minggu_Senen_Seloso_Rebu_Kemis_Jemuwah_Septu".split("_"),
        weekdaysShort: "Min_Sen_Sel_Reb_Kem_Jem_Sep".split("_"),
        weekdaysMin: "Mg_Sn_Sl_Rb_Km_Jm_Sp".split("_"),
        longDateFormat: {
          LT: "HH.mm",
          LTS: "HH.mm.ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY [pukul] HH.mm",
          LLLL: "dddd, D MMMM YYYY [pukul] HH.mm"
        },
        meridiemParse: /enjing|siyang|sonten|ndalu/,
        meridiemHour: function(hour, meridiem2) {
          if (hour === 12) {
            hour = 0;
          }
          if (meridiem2 === "enjing") {
            return hour;
          } else if (meridiem2 === "siyang") {
            return hour >= 11 ? hour : hour + 12;
          } else if (meridiem2 === "sonten" || meridiem2 === "ndalu") {
            return hour + 12;
          }
        },
        meridiem: function(hours2, minutes2, isLower) {
          if (hours2 < 11) {
            return "enjing";
          } else if (hours2 < 15) {
            return "siyang";
          } else if (hours2 < 19) {
            return "sonten";
          } else {
            return "ndalu";
          }
        },
        calendar: {
          sameDay: "[Dinten puniko pukul] LT",
          nextDay: "[Mbenjang pukul] LT",
          nextWeek: "dddd [pukul] LT",
          lastDay: "[Kala wingi pukul] LT",
          lastWeek: "dddd [kepengker pukul] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "wonten ing %s",
          past: "%s ingkang kepengker",
          s: "sawetawis detik",
          ss: "%d detik",
          m: "setunggal menit",
          mm: "%d menit",
          h: "setunggal jam",
          hh: "%d jam",
          d: "sedinten",
          dd: "%d dinten",
          M: "sewulan",
          MM: "%d wulan",
          y: "setaun",
          yy: "%d taun"
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 7
          // The week that contains Jan 7th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("ka", {
        months: "იანვარი_თებერვალი_მარტი_აპრილი_მაისი_ივნისი_ივლისი_აგვისტო_სექტემბერი_ოქტომბერი_ნოემბერი_დეკემბერი".split(
          "_"
        ),
        monthsShort: "იან_თებ_მარ_აპრ_მაი_ივნ_ივლ_აგვ_სექ_ოქტ_ნოე_დეკ".split("_"),
        weekdays: {
          standalone: "კვირა_ორშაბათი_სამშაბათი_ოთხშაბათი_ხუთშაბათი_პარასკევი_შაბათი".split(
            "_"
          ),
          format: "კვირას_ორშაბათს_სამშაბათს_ოთხშაბათს_ხუთშაბათს_პარასკევს_შაბათს".split(
            "_"
          ),
          isFormat: /(წინა|შემდეგ)/
        },
        weekdaysShort: "კვი_ორშ_სამ_ოთხ_ხუთ_პარ_შაბ".split("_"),
        weekdaysMin: "კვ_ორ_სა_ოთ_ხუ_პა_შა".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd, D MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[დღეს] LT[-ზე]",
          nextDay: "[ხვალ] LT[-ზე]",
          lastDay: "[გუშინ] LT[-ზე]",
          nextWeek: "[შემდეგ] dddd LT[-ზე]",
          lastWeek: "[წინა] dddd LT-ზე",
          sameElse: "L"
        },
        relativeTime: {
          future: function(s) {
            return s.replace(
              /(წამ|წუთ|საათ|წელ|დღ|თვ)(ი|ე)/,
              function($0, $1, $2) {
                return $2 === "ი" ? $1 + "ში" : $1 + $2 + "ში";
              }
            );
          },
          past: function(s) {
            if (/(წამი|წუთი|საათი|დღე|თვე)/.test(s)) {
              return s.replace(/(ი|ე)$/, "ის წინ");
            }
            if (/წელი/.test(s)) {
              return s.replace(/წელი$/, "წლის წინ");
            }
            return s;
          },
          s: "რამდენიმე წამი",
          ss: "%d წამი",
          m: "წუთი",
          mm: "%d წუთი",
          h: "საათი",
          hh: "%d საათი",
          d: "დღე",
          dd: "%d დღე",
          M: "თვე",
          MM: "%d თვე",
          y: "წელი",
          yy: "%d წელი"
        },
        dayOfMonthOrdinalParse: /0|1-ლი|მე-\d{1,2}|\d{1,2}-ე/,
        ordinal: function(number) {
          if (number === 0) {
            return number;
          }
          if (number === 1) {
            return number + "-ლი";
          }
          if (number < 20 || number <= 100 && number % 20 === 0 || number % 100 === 0) {
            return "მე-" + number;
          }
          return number + "-ე";
        },
        week: {
          dow: 1,
          doy: 7
        }
      });
      //! moment.js locale configuration
      var suffixes$1 = {
        0: "-ші",
        1: "-ші",
        2: "-ші",
        3: "-ші",
        4: "-ші",
        5: "-ші",
        6: "-шы",
        7: "-ші",
        8: "-ші",
        9: "-шы",
        10: "-шы",
        20: "-шы",
        30: "-шы",
        40: "-шы",
        50: "-ші",
        60: "-шы",
        70: "-ші",
        80: "-ші",
        90: "-шы",
        100: "-ші"
      };
      hooks.defineLocale("kk", {
        months: "қаңтар_ақпан_наурыз_сәуір_мамыр_маусым_шілде_тамыз_қыркүйек_қазан_қараша_желтоқсан".split(
          "_"
        ),
        monthsShort: "қаң_ақп_нау_сәу_мам_мау_шіл_там_қыр_қаз_қар_жел".split("_"),
        weekdays: "жексенбі_дүйсенбі_сейсенбі_сәрсенбі_бейсенбі_жұма_сенбі".split(
          "_"
        ),
        weekdaysShort: "жек_дүй_сей_сәр_бей_жұм_сен".split("_"),
        weekdaysMin: "жк_дй_сй_ср_бй_жм_сн".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD.MM.YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd, D MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[Бүгін сағат] LT",
          nextDay: "[Ертең сағат] LT",
          nextWeek: "dddd [сағат] LT",
          lastDay: "[Кеше сағат] LT",
          lastWeek: "[Өткен аптаның] dddd [сағат] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "%s ішінде",
          past: "%s бұрын",
          s: "бірнеше секунд",
          ss: "%d секунд",
          m: "бір минут",
          mm: "%d минут",
          h: "бір сағат",
          hh: "%d сағат",
          d: "бір күн",
          dd: "%d күн",
          M: "бір ай",
          MM: "%d ай",
          y: "бір жыл",
          yy: "%d жыл"
        },
        dayOfMonthOrdinalParse: /\d{1,2}-(ші|шы)/,
        ordinal: function(number) {
          var a = number % 10, b = number >= 100 ? 100 : null;
          return number + (suffixes$1[number] || suffixes$1[a] || suffixes$1[b]);
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 7
          // The week that contains Jan 7th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var symbolMap$a = {
        1: "១",
        2: "២",
        3: "៣",
        4: "៤",
        5: "៥",
        6: "៦",
        7: "៧",
        8: "៨",
        9: "៩",
        0: "០"
      }, numberMap$9 = {
        "១": "1",
        "២": "2",
        "៣": "3",
        "៤": "4",
        "៥": "5",
        "៦": "6",
        "៧": "7",
        "៨": "8",
        "៩": "9",
        "០": "0"
      };
      hooks.defineLocale("km", {
        months: "មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ".split(
          "_"
        ),
        monthsShort: "មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ".split(
          "_"
        ),
        weekdays: "អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),
        weekdaysShort: "អា_ច_អ_ព_ព្រ_សុ_ស".split("_"),
        weekdaysMin: "អា_ច_អ_ព_ព្រ_សុ_ស".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd, D MMMM YYYY HH:mm"
        },
        meridiemParse: /ព្រឹក|ល្ងាច/,
        isPM: function(input) {
          return input === "ល្ងាច";
        },
        meridiem: function(hour, minute, isLower) {
          if (hour < 12) {
            return "ព្រឹក";
          } else {
            return "ល្ងាច";
          }
        },
        calendar: {
          sameDay: "[ថ្ងៃនេះ ម៉ោង] LT",
          nextDay: "[ស្អែក ម៉ោង] LT",
          nextWeek: "dddd [ម៉ោង] LT",
          lastDay: "[ម្សិលមិញ ម៉ោង] LT",
          lastWeek: "dddd [សប្តាហ៍មុន] [ម៉ោង] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "%sទៀត",
          past: "%sមុន",
          s: "ប៉ុន្មានវិនាទី",
          ss: "%d វិនាទី",
          m: "មួយនាទី",
          mm: "%d នាទី",
          h: "មួយម៉ោង",
          hh: "%d ម៉ោង",
          d: "មួយថ្ងៃ",
          dd: "%d ថ្ងៃ",
          M: "មួយខែ",
          MM: "%d ខែ",
          y: "មួយឆ្នាំ",
          yy: "%d ឆ្នាំ"
        },
        dayOfMonthOrdinalParse: /ទី\d{1,2}/,
        ordinal: "ទី%d",
        preparse: function(string) {
          return string.replace(/[១២៣៤៥៦៧៨៩០]/g, function(match) {
            return numberMap$9[match];
          });
        },
        postformat: function(string) {
          return string.replace(/\d/g, function(match) {
            return symbolMap$a[match];
          });
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var symbolMap$b = {
        1: "೧",
        2: "೨",
        3: "೩",
        4: "೪",
        5: "೫",
        6: "೬",
        7: "೭",
        8: "೮",
        9: "೯",
        0: "೦"
      }, numberMap$a = {
        "೧": "1",
        "೨": "2",
        "೩": "3",
        "೪": "4",
        "೫": "5",
        "೬": "6",
        "೭": "7",
        "೮": "8",
        "೯": "9",
        "೦": "0"
      };
      hooks.defineLocale("kn", {
        months: "ಜನವರಿ_ಫೆಬ್ರವರಿ_ಮಾರ್ಚ್_ಏಪ್ರಿಲ್_ಮೇ_ಜೂನ್_ಜುಲೈ_ಆಗಸ್ಟ್_ಸೆಪ್ಟೆಂಬರ್_ಅಕ್ಟೋಬರ್_ನವೆಂಬರ್_ಡಿಸೆಂಬರ್".split(
          "_"
        ),
        monthsShort: "ಜನ_ಫೆಬ್ರ_ಮಾರ್ಚ್_ಏಪ್ರಿಲ್_ಮೇ_ಜೂನ್_ಜುಲೈ_ಆಗಸ್ಟ್_ಸೆಪ್ಟೆಂ_ಅಕ್ಟೋ_ನವೆಂ_ಡಿಸೆಂ".split(
          "_"
        ),
        monthsParseExact: true,
        weekdays: "ಭಾನುವಾರ_ಸೋಮವಾರ_ಮಂಗಳವಾರ_ಬುಧವಾರ_ಗುರುವಾರ_ಶುಕ್ರವಾರ_ಶನಿವಾರ".split(
          "_"
        ),
        weekdaysShort: "ಭಾನು_ಸೋಮ_ಮಂಗಳ_ಬುಧ_ಗುರು_ಶುಕ್ರ_ಶನಿ".split("_"),
        weekdaysMin: "ಭಾ_ಸೋ_ಮಂ_ಬು_ಗು_ಶು_ಶ".split("_"),
        longDateFormat: {
          LT: "A h:mm",
          LTS: "A h:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY, A h:mm",
          LLLL: "dddd, D MMMM YYYY, A h:mm"
        },
        calendar: {
          sameDay: "[ಇಂದು] LT",
          nextDay: "[ನಾಳೆ] LT",
          nextWeek: "dddd, LT",
          lastDay: "[ನಿನ್ನೆ] LT",
          lastWeek: "[ಕೊನೆಯ] dddd, LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "%s ನಂತರ",
          past: "%s ಹಿಂದೆ",
          s: "ಕೆಲವು ಕ್ಷಣಗಳು",
          ss: "%d ಸೆಕೆಂಡುಗಳು",
          m: "ಒಂದು ನಿಮಿಷ",
          mm: "%d ನಿಮಿಷ",
          h: "ಒಂದು ಗಂಟೆ",
          hh: "%d ಗಂಟೆ",
          d: "ಒಂದು ದಿನ",
          dd: "%d ದಿನ",
          M: "ಒಂದು ತಿಂಗಳು",
          MM: "%d ತಿಂಗಳು",
          y: "ಒಂದು ವರ್ಷ",
          yy: "%d ವರ್ಷ"
        },
        preparse: function(string) {
          return string.replace(/[೧೨೩೪೫೬೭೮೯೦]/g, function(match) {
            return numberMap$a[match];
          });
        },
        postformat: function(string) {
          return string.replace(/\d/g, function(match) {
            return symbolMap$b[match];
          });
        },
        meridiemParse: /ರಾತ್ರಿ|ಬೆಳಿಗ್ಗೆ|ಮಧ್ಯಾಹ್ನ|ಸಂಜೆ/,
        meridiemHour: function(hour, meridiem2) {
          if (hour === 12) {
            hour = 0;
          }
          if (meridiem2 === "ರಾತ್ರಿ") {
            return hour < 4 ? hour : hour + 12;
          } else if (meridiem2 === "ಬೆಳಿಗ್ಗೆ") {
            return hour;
          } else if (meridiem2 === "ಮಧ್ಯಾಹ್ನ") {
            return hour >= 10 ? hour : hour + 12;
          } else if (meridiem2 === "ಸಂಜೆ") {
            return hour + 12;
          }
        },
        meridiem: function(hour, minute, isLower) {
          if (hour < 4) {
            return "ರಾತ್ರಿ";
          } else if (hour < 10) {
            return "ಬೆಳಿಗ್ಗೆ";
          } else if (hour < 17) {
            return "ಮಧ್ಯಾಹ್ನ";
          } else if (hour < 20) {
            return "ಸಂಜೆ";
          } else {
            return "ರಾತ್ರಿ";
          }
        },
        dayOfMonthOrdinalParse: /\d{1,2}(ನೇ)/,
        ordinal: function(number) {
          return number + "ನೇ";
        },
        week: {
          dow: 0,
          // Sunday is the first day of the week.
          doy: 6
          // The week that contains Jan 6th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("ko", {
        months: "1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),
        monthsShort: "1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split(
          "_"
        ),
        weekdays: "일요일_월요일_화요일_수요일_목요일_금요일_토요일".split("_"),
        weekdaysShort: "일_월_화_수_목_금_토".split("_"),
        weekdaysMin: "일_월_화_수_목_금_토".split("_"),
        longDateFormat: {
          LT: "A h:mm",
          LTS: "A h:mm:ss",
          L: "YYYY.MM.DD.",
          LL: "YYYY년 MMMM D일",
          LLL: "YYYY년 MMMM D일 A h:mm",
          LLLL: "YYYY년 MMMM D일 dddd A h:mm",
          l: "YYYY.MM.DD.",
          ll: "YYYY년 MMMM D일",
          lll: "YYYY년 MMMM D일 A h:mm",
          llll: "YYYY년 MMMM D일 dddd A h:mm"
        },
        calendar: {
          sameDay: "오늘 LT",
          nextDay: "내일 LT",
          nextWeek: "dddd LT",
          lastDay: "어제 LT",
          lastWeek: "지난주 dddd LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "%s 후",
          past: "%s 전",
          s: "몇 초",
          ss: "%d초",
          m: "1분",
          mm: "%d분",
          h: "한 시간",
          hh: "%d시간",
          d: "하루",
          dd: "%d일",
          M: "한 달",
          MM: "%d달",
          y: "일 년",
          yy: "%d년"
        },
        dayOfMonthOrdinalParse: /\d{1,2}(일|월|주)/,
        ordinal: function(number, period) {
          switch (period) {
            case "d":
            case "D":
            case "DDD":
              return number + "일";
            case "M":
              return number + "월";
            case "w":
            case "W":
              return number + "주";
            default:
              return number;
          }
        },
        meridiemParse: /오전|오후/,
        isPM: function(token2) {
          return token2 === "오후";
        },
        meridiem: function(hour, minute, isUpper) {
          return hour < 12 ? "오전" : "오후";
        }
      });
      //! moment.js locale configuration
      function processRelativeTime$7(num, withoutSuffix, key, isFuture) {
        var format2 = {
          s: ["çend sanîye", "çend sanîyeyan"],
          ss: [num + " sanîye", num + " sanîyeyan"],
          m: ["deqîqeyek", "deqîqeyekê"],
          mm: [num + " deqîqe", num + " deqîqeyan"],
          h: ["saetek", "saetekê"],
          hh: [num + " saet", num + " saetan"],
          d: ["rojek", "rojekê"],
          dd: [num + " roj", num + " rojan"],
          w: ["hefteyek", "hefteyekê"],
          ww: [num + " hefte", num + " hefteyan"],
          M: ["mehek", "mehekê"],
          MM: [num + " meh", num + " mehan"],
          y: ["salek", "salekê"],
          yy: [num + " sal", num + " salan"]
        };
        return withoutSuffix ? format2[key][0] : format2[key][1];
      }
      function ezafeNumSuffix(num) {
        num = "" + num;
        var l = num.substring(num.length - 1), ll = num.length > 1 ? num.substring(num.length - 2) : "";
        if (!(ll == 12 || ll == 13) && (l == "2" || l == "3" || ll == "50" || l == "70" || l == "80"))
          return "yê";
        return "ê";
      }
      hooks.defineLocale("ku-kmr", {
        // According to the spelling rules defined by the work group of Weqfa Mezopotamyayê (Mesopotamia Foundation)
        // this should be: 'Kanûna Paşîn_Sibat_Adar_Nîsan_Gulan_Hezîran_Tîrmeh_Tebax_Îlon_Çirîya Pêşîn_Çirîya Paşîn_Kanûna Pêşîn'
        // But the names below are more well known and handy
        months: "Rêbendan_Sibat_Adar_Nîsan_Gulan_Hezîran_Tîrmeh_Tebax_Îlon_Cotmeh_Mijdar_Berfanbar".split(
          "_"
        ),
        monthsShort: "Rêb_Sib_Ada_Nîs_Gul_Hez_Tîr_Teb_Îlo_Cot_Mij_Ber".split("_"),
        monthsParseExact: true,
        weekdays: "Yekşem_Duşem_Sêşem_Çarşem_Pêncşem_În_Şemî".split("_"),
        weekdaysShort: "Yek_Du_Sê_Çar_Pên_În_Şem".split("_"),
        weekdaysMin: "Ye_Du_Sê_Ça_Pê_În_Şe".split("_"),
        meridiem: function(hours2, minutes2, isLower) {
          if (hours2 < 12) {
            return isLower ? "bn" : "BN";
          } else {
            return isLower ? "pn" : "PN";
          }
        },
        meridiemParse: /bn|BN|pn|PN/,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD.MM.YYYY",
          LL: "Do MMMM[a] YYYY[an]",
          LLL: "Do MMMM[a] YYYY[an] HH:mm",
          LLLL: "dddd, Do MMMM[a] YYYY[an] HH:mm",
          ll: "Do MMM[.] YYYY[an]",
          lll: "Do MMM[.] YYYY[an] HH:mm",
          llll: "ddd[.], Do MMM[.] YYYY[an] HH:mm"
        },
        calendar: {
          sameDay: "[Îro di saet] LT [de]",
          nextDay: "[Sibê di saet] LT [de]",
          nextWeek: "dddd [di saet] LT [de]",
          lastDay: "[Duh di saet] LT [de]",
          lastWeek: "dddd[a borî di saet] LT [de]",
          sameElse: "L"
        },
        relativeTime: {
          future: "di %s de",
          past: "berî %s",
          s: processRelativeTime$7,
          ss: processRelativeTime$7,
          m: processRelativeTime$7,
          mm: processRelativeTime$7,
          h: processRelativeTime$7,
          hh: processRelativeTime$7,
          d: processRelativeTime$7,
          dd: processRelativeTime$7,
          w: processRelativeTime$7,
          ww: processRelativeTime$7,
          M: processRelativeTime$7,
          MM: processRelativeTime$7,
          y: processRelativeTime$7,
          yy: processRelativeTime$7
        },
        dayOfMonthOrdinalParse: /\d{1,2}(?:yê|ê|\.)/,
        ordinal: function(num, period) {
          var p = period.toLowerCase();
          if (p.includes("w") || p.includes("m")) return num + ".";
          return num + ezafeNumSuffix(num);
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var symbolMap$c = {
        1: "١",
        2: "٢",
        3: "٣",
        4: "٤",
        5: "٥",
        6: "٦",
        7: "٧",
        8: "٨",
        9: "٩",
        0: "٠"
      }, numberMap$b = {
        "١": "1",
        "٢": "2",
        "٣": "3",
        "٤": "4",
        "٥": "5",
        "٦": "6",
        "٧": "7",
        "٨": "8",
        "٩": "9",
        "٠": "0"
      }, months$8 = [
        "کانونی دووەم",
        "شوبات",
        "ئازار",
        "نیسان",
        "ئایار",
        "حوزەیران",
        "تەمموز",
        "ئاب",
        "ئەیلوول",
        "تشرینی یەكەم",
        "تشرینی دووەم",
        "كانونی یەکەم"
      ];
      hooks.defineLocale("ku", {
        months: months$8,
        monthsShort: months$8,
        weekdays: "یه‌كشه‌ممه‌_دووشه‌ممه‌_سێشه‌ممه‌_چوارشه‌ممه‌_پێنجشه‌ممه‌_هه‌ینی_شه‌ممه‌".split(
          "_"
        ),
        weekdaysShort: "یه‌كشه‌م_دووشه‌م_سێشه‌م_چوارشه‌م_پێنجشه‌م_هه‌ینی_شه‌ممه‌".split("_"),
        weekdaysMin: "ی_د_س_چ_پ_ه_ش".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd, D MMMM YYYY HH:mm"
        },
        meridiemParse: /ئێواره‌|به‌یانی/,
        isPM: function(input) {
          return /ئێواره‌/.test(input);
        },
        meridiem: function(hour, minute, isLower) {
          if (hour < 12) {
            return "به‌یانی";
          } else {
            return "ئێواره‌";
          }
        },
        calendar: {
          sameDay: "[ئه‌مرۆ كاتژمێر] LT",
          nextDay: "[به‌یانی كاتژمێر] LT",
          nextWeek: "dddd [كاتژمێر] LT",
          lastDay: "[دوێنێ كاتژمێر] LT",
          lastWeek: "dddd [كاتژمێر] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "له‌ %s",
          past: "%s",
          s: "چه‌ند چركه‌یه‌ك",
          ss: "چركه‌ %d",
          m: "یه‌ك خوله‌ك",
          mm: "%d خوله‌ك",
          h: "یه‌ك كاتژمێر",
          hh: "%d كاتژمێر",
          d: "یه‌ك ڕۆژ",
          dd: "%d ڕۆژ",
          M: "یه‌ك مانگ",
          MM: "%d مانگ",
          y: "یه‌ك ساڵ",
          yy: "%d ساڵ"
        },
        preparse: function(string) {
          return string.replace(/[١٢٣٤٥٦٧٨٩٠]/g, function(match) {
            return numberMap$b[match];
          }).replace(/،/g, ",");
        },
        postformat: function(string) {
          return string.replace(/\d/g, function(match) {
            return symbolMap$c[match];
          }).replace(/,/g, "،");
        },
        week: {
          dow: 6,
          // Saturday is the first day of the week.
          doy: 12
          // The week that contains Jan 12th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var suffixes$2 = {
        0: "-чү",
        1: "-чи",
        2: "-чи",
        3: "-чү",
        4: "-чү",
        5: "-чи",
        6: "-чы",
        7: "-чи",
        8: "-чи",
        9: "-чу",
        10: "-чу",
        20: "-чы",
        30: "-чу",
        40: "-чы",
        50: "-чү",
        60: "-чы",
        70: "-чи",
        80: "-чи",
        90: "-чу",
        100: "-чү"
      };
      hooks.defineLocale("ky", {
        months: "январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split(
          "_"
        ),
        monthsShort: "янв_фев_март_апр_май_июнь_июль_авг_сен_окт_ноя_дек".split(
          "_"
        ),
        weekdays: "Жекшемби_Дүйшөмбү_Шейшемби_Шаршемби_Бейшемби_Жума_Ишемби".split(
          "_"
        ),
        weekdaysShort: "Жек_Дүй_Шей_Шар_Бей_Жум_Ише".split("_"),
        weekdaysMin: "Жк_Дй_Шй_Шр_Бй_Жм_Иш".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD.MM.YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd, D MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[Бүгүн саат] LT",
          nextDay: "[Эртең саат] LT",
          nextWeek: "dddd [саат] LT",
          lastDay: "[Кечээ саат] LT",
          lastWeek: "[Өткөн аптанын] dddd [күнү] [саат] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "%s ичинде",
          past: "%s мурун",
          s: "бирнече секунд",
          ss: "%d секунд",
          m: "бир мүнөт",
          mm: "%d мүнөт",
          h: "бир саат",
          hh: "%d саат",
          d: "бир күн",
          dd: "%d күн",
          M: "бир ай",
          MM: "%d ай",
          y: "бир жыл",
          yy: "%d жыл"
        },
        dayOfMonthOrdinalParse: /\d{1,2}-(чи|чы|чү|чу)/,
        ordinal: function(number) {
          var a = number % 10, b = number >= 100 ? 100 : null;
          return number + (suffixes$2[number] || suffixes$2[a] || suffixes$2[b]);
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 7
          // The week that contains Jan 7th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      function processRelativeTime$8(number, withoutSuffix, key, isFuture) {
        var format2 = {
          m: ["eng Minutt", "enger Minutt"],
          h: ["eng Stonn", "enger Stonn"],
          d: ["een Dag", "engem Dag"],
          M: ["ee Mount", "engem Mount"],
          y: ["ee Joer", "engem Joer"]
        };
        return withoutSuffix ? format2[key][0] : format2[key][1];
      }
      function processFutureTime(string) {
        var number = string.substr(0, string.indexOf(" "));
        if (eifelerRegelAppliesToNumber(number)) {
          return "a " + string;
        }
        return "an " + string;
      }
      function processPastTime(string) {
        var number = string.substr(0, string.indexOf(" "));
        if (eifelerRegelAppliesToNumber(number)) {
          return "viru " + string;
        }
        return "virun " + string;
      }
      function eifelerRegelAppliesToNumber(number) {
        number = parseInt(number, 10);
        if (isNaN(number)) {
          return false;
        }
        if (number < 0) {
          return true;
        } else if (number < 10) {
          if (4 <= number && number <= 7) {
            return true;
          }
          return false;
        } else if (number < 100) {
          var lastDigit = number % 10, firstDigit = number / 10;
          if (lastDigit === 0) {
            return eifelerRegelAppliesToNumber(firstDigit);
          }
          return eifelerRegelAppliesToNumber(lastDigit);
        } else if (number < 1e4) {
          while (number >= 10) {
            number = number / 10;
          }
          return eifelerRegelAppliesToNumber(number);
        } else {
          number = number / 1e3;
          return eifelerRegelAppliesToNumber(number);
        }
      }
      hooks.defineLocale("lb", {
        months: "Januar_Februar_Mäerz_Abrëll_Mee_Juni_Juli_August_September_Oktober_November_Dezember".split(
          "_"
        ),
        monthsShort: "Jan._Febr._Mrz._Abr._Mee_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split(
          "_"
        ),
        monthsParseExact: true,
        weekdays: "Sonndeg_Méindeg_Dënschdeg_Mëttwoch_Donneschdeg_Freideg_Samschdeg".split(
          "_"
        ),
        weekdaysShort: "So._Mé._Dë._Më._Do._Fr._Sa.".split("_"),
        weekdaysMin: "So_Mé_Dë_Më_Do_Fr_Sa".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "H:mm [Auer]",
          LTS: "H:mm:ss [Auer]",
          L: "DD.MM.YYYY",
          LL: "D. MMMM YYYY",
          LLL: "D. MMMM YYYY H:mm [Auer]",
          LLLL: "dddd, D. MMMM YYYY H:mm [Auer]"
        },
        calendar: {
          sameDay: "[Haut um] LT",
          sameElse: "L",
          nextDay: "[Muer um] LT",
          nextWeek: "dddd [um] LT",
          lastDay: "[Gëschter um] LT",
          lastWeek: function() {
            switch (this.day()) {
              case 2:
              case 4:
                return "[Leschten] dddd [um] LT";
              default:
                return "[Leschte] dddd [um] LT";
            }
          }
        },
        relativeTime: {
          future: processFutureTime,
          past: processPastTime,
          s: "e puer Sekonnen",
          ss: "%d Sekonnen",
          m: processRelativeTime$8,
          mm: "%d Minutten",
          h: processRelativeTime$8,
          hh: "%d Stonnen",
          d: processRelativeTime$8,
          dd: "%d Deeg",
          M: processRelativeTime$8,
          MM: "%d Méint",
          y: processRelativeTime$8,
          yy: "%d Joer"
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal: "%d.",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("lo", {
        months: "ມັງກອນ_ກຸມພາ_ມີນາ_ເມສາ_ພຶດສະພາ_ມິຖຸນາ_ກໍລະກົດ_ສິງຫາ_ກັນຍາ_ຕຸລາ_ພະຈິກ_ທັນວາ".split(
          "_"
        ),
        monthsShort: "ມັງກອນ_ກຸມພາ_ມີນາ_ເມສາ_ພຶດສະພາ_ມິຖຸນາ_ກໍລະກົດ_ສິງຫາ_ກັນຍາ_ຕຸລາ_ພະຈິກ_ທັນວາ".split(
          "_"
        ),
        weekdays: "ອາທິດ_ຈັນ_ອັງຄານ_ພຸດ_ພະຫັດ_ສຸກ_ເສົາ".split("_"),
        weekdaysShort: "ທິດ_ຈັນ_ອັງຄານ_ພຸດ_ພະຫັດ_ສຸກ_ເສົາ".split("_"),
        weekdaysMin: "ທ_ຈ_ອຄ_ພ_ພຫ_ສກ_ສ".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "ວັນdddd D MMMM YYYY HH:mm"
        },
        meridiemParse: /ຕອນເຊົ້າ|ຕອນແລງ/,
        isPM: function(input) {
          return input === "ຕອນແລງ";
        },
        meridiem: function(hour, minute, isLower) {
          if (hour < 12) {
            return "ຕອນເຊົ້າ";
          } else {
            return "ຕອນແລງ";
          }
        },
        calendar: {
          sameDay: "[ມື້ນີ້ເວລາ] LT",
          nextDay: "[ມື້ອື່ນເວລາ] LT",
          nextWeek: "[ວັນ]dddd[ໜ້າເວລາ] LT",
          lastDay: "[ມື້ວານນີ້ເວລາ] LT",
          lastWeek: "[ວັນ]dddd[ແລ້ວນີ້ເວລາ] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "ອີກ %s",
          past: "%sຜ່ານມາ",
          s: "ບໍ່ເທົ່າໃດວິນາທີ",
          ss: "%d ວິນາທີ",
          m: "1 ນາທີ",
          mm: "%d ນາທີ",
          h: "1 ຊົ່ວໂມງ",
          hh: "%d ຊົ່ວໂມງ",
          d: "1 ມື້",
          dd: "%d ມື້",
          M: "1 ເດືອນ",
          MM: "%d ເດືອນ",
          y: "1 ປີ",
          yy: "%d ປີ"
        },
        dayOfMonthOrdinalParse: /(ທີ່)\d{1,2}/,
        ordinal: function(number) {
          return "ທີ່" + number;
        }
      });
      //! moment.js locale configuration
      var units = {
        ss: "sekundė_sekundžių_sekundes",
        m: "minutė_minutės_minutę",
        mm: "minutės_minučių_minutes",
        h: "valanda_valandos_valandą",
        hh: "valandos_valandų_valandas",
        d: "diena_dienos_dieną",
        dd: "dienos_dienų_dienas",
        M: "mėnuo_mėnesio_mėnesį",
        MM: "mėnesiai_mėnesių_mėnesius",
        y: "metai_metų_metus",
        yy: "metai_metų_metus"
      };
      function translateSeconds(number, withoutSuffix, key, isFuture) {
        if (withoutSuffix) {
          return "kelios sekundės";
        } else {
          return isFuture ? "kelių sekundžių" : "kelias sekundes";
        }
      }
      function translateSingular(number, withoutSuffix, key, isFuture) {
        return withoutSuffix ? forms(key)[0] : isFuture ? forms(key)[1] : forms(key)[2];
      }
      function special(number) {
        return number % 10 === 0 || number > 10 && number < 20;
      }
      function forms(key) {
        return units[key].split("_");
      }
      function translate$6(number, withoutSuffix, key, isFuture) {
        var result = number + " ";
        if (number === 1) {
          return result + translateSingular(number, withoutSuffix, key[0], isFuture);
        } else if (withoutSuffix) {
          return result + (special(number) ? forms(key)[1] : forms(key)[0]);
        } else {
          if (isFuture) {
            return result + forms(key)[1];
          } else {
            return result + (special(number) ? forms(key)[1] : forms(key)[2]);
          }
        }
      }
      hooks.defineLocale("lt", {
        months: {
          format: "sausio_vasario_kovo_balandžio_gegužės_birželio_liepos_rugpjūčio_rugsėjo_spalio_lapkričio_gruodžio".split(
            "_"
          ),
          standalone: "sausis_vasaris_kovas_balandis_gegužė_birželis_liepa_rugpjūtis_rugsėjis_spalis_lapkritis_gruodis".split(
            "_"
          ),
          isFormat: /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?|MMMM?(\[[^\[\]]*\]|\s)+D[oD]?/
        },
        monthsShort: "sau_vas_kov_bal_geg_bir_lie_rgp_rgs_spa_lap_grd".split("_"),
        weekdays: {
          format: "sekmadienį_pirmadienį_antradienį_trečiadienį_ketvirtadienį_penktadienį_šeštadienį".split(
            "_"
          ),
          standalone: "sekmadienis_pirmadienis_antradienis_trečiadienis_ketvirtadienis_penktadienis_šeštadienis".split(
            "_"
          ),
          isFormat: /dddd HH:mm/
        },
        weekdaysShort: "Sek_Pir_Ant_Tre_Ket_Pen_Šeš".split("_"),
        weekdaysMin: "S_P_A_T_K_Pn_Š".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "YYYY-MM-DD",
          LL: "YYYY [m.] MMMM D [d.]",
          LLL: "YYYY [m.] MMMM D [d.], HH:mm [val.]",
          LLLL: "YYYY [m.] MMMM D [d.], dddd, HH:mm [val.]",
          l: "YYYY-MM-DD",
          ll: "YYYY [m.] MMMM D [d.]",
          lll: "YYYY [m.] MMMM D [d.], HH:mm [val.]",
          llll: "YYYY [m.] MMMM D [d.], ddd, HH:mm [val.]"
        },
        calendar: {
          sameDay: "[Šiandien] LT",
          nextDay: "[Rytoj] LT",
          nextWeek: "dddd LT",
          lastDay: "[Vakar] LT",
          lastWeek: "[Praėjusį] dddd LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "po %s",
          past: "prieš %s",
          s: translateSeconds,
          ss: translate$6,
          m: translateSingular,
          mm: translate$6,
          h: translateSingular,
          hh: translate$6,
          d: translateSingular,
          dd: translate$6,
          M: translateSingular,
          MM: translate$6,
          y: translateSingular,
          yy: translate$6
        },
        dayOfMonthOrdinalParse: /\d{1,2}-oji/,
        ordinal: function(number) {
          return number + "-oji";
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var units$1 = {
        ss: "sekundes_sekundēm_sekunde_sekundes".split("_"),
        m: "minūtes_minūtēm_minūte_minūtes".split("_"),
        mm: "minūtes_minūtēm_minūte_minūtes".split("_"),
        h: "stundas_stundām_stunda_stundas".split("_"),
        hh: "stundas_stundām_stunda_stundas".split("_"),
        d: "dienas_dienām_diena_dienas".split("_"),
        dd: "dienas_dienām_diena_dienas".split("_"),
        M: "mēneša_mēnešiem_mēnesis_mēneši".split("_"),
        MM: "mēneša_mēnešiem_mēnesis_mēneši".split("_"),
        y: "gada_gadiem_gads_gadi".split("_"),
        yy: "gada_gadiem_gads_gadi".split("_")
      };
      function format$1(forms2, number, withoutSuffix) {
        if (withoutSuffix) {
          return number % 10 === 1 && number % 100 !== 11 ? forms2[2] : forms2[3];
        } else {
          return number % 10 === 1 && number % 100 !== 11 ? forms2[0] : forms2[1];
        }
      }
      function relativeTimeWithPlural$1(number, withoutSuffix, key) {
        return number + " " + format$1(units$1[key], number, withoutSuffix);
      }
      function relativeTimeWithSingular(number, withoutSuffix, key) {
        return format$1(units$1[key], number, withoutSuffix);
      }
      function relativeSeconds(number, withoutSuffix) {
        return withoutSuffix ? "dažas sekundes" : "dažām sekundēm";
      }
      hooks.defineLocale("lv", {
        months: "janvāris_februāris_marts_aprīlis_maijs_jūnijs_jūlijs_augusts_septembris_oktobris_novembris_decembris".split(
          "_"
        ),
        monthsShort: "jan_feb_mar_apr_mai_jūn_jūl_aug_sep_okt_nov_dec".split("_"),
        weekdays: "svētdiena_pirmdiena_otrdiena_trešdiena_ceturtdiena_piektdiena_sestdiena".split(
          "_"
        ),
        weekdaysShort: "Sv_P_O_T_C_Pk_S".split("_"),
        weekdaysMin: "Sv_P_O_T_C_Pk_S".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD.MM.YYYY.",
          LL: "YYYY. [gada] D. MMMM",
          LLL: "YYYY. [gada] D. MMMM, HH:mm",
          LLLL: "YYYY. [gada] D. MMMM, dddd, HH:mm"
        },
        calendar: {
          sameDay: "[Šodien pulksten] LT",
          nextDay: "[Rīt pulksten] LT",
          nextWeek: "dddd [pulksten] LT",
          lastDay: "[Vakar pulksten] LT",
          lastWeek: "[Pagājušā] dddd [pulksten] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "pēc %s",
          past: "pirms %s",
          s: relativeSeconds,
          ss: relativeTimeWithPlural$1,
          m: relativeTimeWithSingular,
          mm: relativeTimeWithPlural$1,
          h: relativeTimeWithSingular,
          hh: relativeTimeWithPlural$1,
          d: relativeTimeWithSingular,
          dd: relativeTimeWithPlural$1,
          M: relativeTimeWithSingular,
          MM: relativeTimeWithPlural$1,
          y: relativeTimeWithSingular,
          yy: relativeTimeWithPlural$1
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal: "%d.",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var translator = {
        words: {
          //Different grammatical cases
          ss: ["sekund", "sekunda", "sekundi"],
          m: ["jedan minut", "jednog minuta"],
          mm: ["minut", "minuta", "minuta"],
          h: ["jedan sat", "jednog sata"],
          hh: ["sat", "sata", "sati"],
          dd: ["dan", "dana", "dana"],
          MM: ["mjesec", "mjeseca", "mjeseci"],
          yy: ["godina", "godine", "godina"]
        },
        correctGrammaticalCase: function(number, wordKey) {
          return number === 1 ? wordKey[0] : number >= 2 && number <= 4 ? wordKey[1] : wordKey[2];
        },
        translate: function(number, withoutSuffix, key) {
          var wordKey = translator.words[key];
          if (key.length === 1) {
            return withoutSuffix ? wordKey[0] : wordKey[1];
          } else {
            return number + " " + translator.correctGrammaticalCase(number, wordKey);
          }
        }
      };
      hooks.defineLocale("me", {
        months: "januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar".split(
          "_"
        ),
        monthsShort: "jan._feb._mar._apr._maj_jun_jul_avg._sep._okt._nov._dec.".split("_"),
        monthsParseExact: true,
        weekdays: "nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split(
          "_"
        ),
        weekdaysShort: "ned._pon._uto._sri._čet._pet._sub.".split("_"),
        weekdaysMin: "ne_po_ut_sr_če_pe_su".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "H:mm",
          LTS: "H:mm:ss",
          L: "DD.MM.YYYY",
          LL: "D. MMMM YYYY",
          LLL: "D. MMMM YYYY H:mm",
          LLLL: "dddd, D. MMMM YYYY H:mm"
        },
        calendar: {
          sameDay: "[danas u] LT",
          nextDay: "[sjutra u] LT",
          nextWeek: function() {
            switch (this.day()) {
              case 0:
                return "[u] [nedjelju] [u] LT";
              case 3:
                return "[u] [srijedu] [u] LT";
              case 6:
                return "[u] [subotu] [u] LT";
              case 1:
              case 2:
              case 4:
              case 5:
                return "[u] dddd [u] LT";
            }
          },
          lastDay: "[juče u] LT",
          lastWeek: function() {
            var lastWeekDays = [
              "[prošle] [nedjelje] [u] LT",
              "[prošlog] [ponedjeljka] [u] LT",
              "[prošlog] [utorka] [u] LT",
              "[prošle] [srijede] [u] LT",
              "[prošlog] [četvrtka] [u] LT",
              "[prošlog] [petka] [u] LT",
              "[prošle] [subote] [u] LT"
            ];
            return lastWeekDays[this.day()];
          },
          sameElse: "L"
        },
        relativeTime: {
          future: "za %s",
          past: "prije %s",
          s: "nekoliko sekundi",
          ss: translator.translate,
          m: translator.translate,
          mm: translator.translate,
          h: translator.translate,
          hh: translator.translate,
          d: "dan",
          dd: translator.translate,
          M: "mjesec",
          MM: translator.translate,
          y: "godinu",
          yy: translator.translate
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal: "%d.",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 7
          // The week that contains Jan 7th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("mi", {
        months: "Kohi-tāte_Hui-tanguru_Poutū-te-rangi_Paenga-whāwhā_Haratua_Pipiri_Hōngoingoi_Here-turi-kōkā_Mahuru_Whiringa-ā-nuku_Whiringa-ā-rangi_Hakihea".split(
          "_"
        ),
        monthsShort: "Kohi_Hui_Pou_Pae_Hara_Pipi_Hōngoi_Here_Mahu_Whi-nu_Whi-ra_Haki".split(
          "_"
        ),
        monthsRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,
        monthsStrictRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,
        monthsShortRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,
        monthsShortStrictRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,2}/i,
        weekdays: "Rātapu_Mane_Tūrei_Wenerei_Tāite_Paraire_Hātarei".split("_"),
        weekdaysShort: "Ta_Ma_Tū_We_Tāi_Pa_Hā".split("_"),
        weekdaysMin: "Ta_Ma_Tū_We_Tāi_Pa_Hā".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY [i] HH:mm",
          LLLL: "dddd, D MMMM YYYY [i] HH:mm"
        },
        calendar: {
          sameDay: "[i teie mahana, i] LT",
          nextDay: "[apopo i] LT",
          nextWeek: "dddd [i] LT",
          lastDay: "[inanahi i] LT",
          lastWeek: "dddd [whakamutunga i] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "i roto i %s",
          past: "%s i mua",
          s: "te hēkona ruarua",
          ss: "%d hēkona",
          m: "he meneti",
          mm: "%d meneti",
          h: "te haora",
          hh: "%d haora",
          d: "he ra",
          dd: "%d ra",
          M: "he marama",
          MM: "%d marama",
          y: "he tau",
          yy: "%d tau"
        },
        dayOfMonthOrdinalParse: /\d{1,2}º/,
        ordinal: "%dº",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("mk", {
        months: "јануари_февруари_март_април_мај_јуни_јули_август_септември_октомври_ноември_декември".split(
          "_"
        ),
        monthsShort: "јан_фев_мар_апр_мај_јун_јул_авг_сеп_окт_ное_дек".split("_"),
        weekdays: "недела_понеделник_вторник_среда_четврток_петок_сабота".split(
          "_"
        ),
        weekdaysShort: "нед_пон_вто_сре_чет_пет_саб".split("_"),
        weekdaysMin: "нe_пo_вт_ср_че_пе_сa".split("_"),
        longDateFormat: {
          LT: "H:mm",
          LTS: "H:mm:ss",
          L: "D.MM.YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY H:mm",
          LLLL: "dddd, D MMMM YYYY H:mm"
        },
        calendar: {
          sameDay: "[Денес во] LT",
          nextDay: "[Утре во] LT",
          nextWeek: "[Во] dddd [во] LT",
          lastDay: "[Вчера во] LT",
          lastWeek: function() {
            switch (this.day()) {
              case 0:
              case 3:
              case 6:
                return "[Изминатата] dddd [во] LT";
              case 1:
              case 2:
              case 4:
              case 5:
                return "[Изминатиот] dddd [во] LT";
            }
          },
          sameElse: "L"
        },
        relativeTime: {
          future: "за %s",
          past: "пред %s",
          s: "неколку секунди",
          ss: "%d секунди",
          m: "една минута",
          mm: "%d минути",
          h: "еден час",
          hh: "%d часа",
          d: "еден ден",
          dd: "%d дена",
          M: "еден месец",
          MM: "%d месеци",
          y: "една година",
          yy: "%d години"
        },
        dayOfMonthOrdinalParse: /\d{1,2}-(ев|ен|ти|ви|ри|ми)/,
        ordinal: function(number) {
          var lastDigit = number % 10, last2Digits = number % 100;
          if (number === 0) {
            return number + "-ев";
          } else if (last2Digits === 0) {
            return number + "-ен";
          } else if (last2Digits > 10 && last2Digits < 20) {
            return number + "-ти";
          } else if (lastDigit === 1) {
            return number + "-ви";
          } else if (lastDigit === 2) {
            return number + "-ри";
          } else if (lastDigit === 7 || lastDigit === 8) {
            return number + "-ми";
          } else {
            return number + "-ти";
          }
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 7
          // The week that contains Jan 7th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("ml", {
        months: "ജനുവരി_ഫെബ്രുവരി_മാർച്ച്_ഏപ്രിൽ_മേയ്_ജൂൺ_ജൂലൈ_ഓഗസ്റ്റ്_സെപ്റ്റംബർ_ഒക്ടോബർ_നവംബർ_ഡിസംബർ".split(
          "_"
        ),
        monthsShort: "ജനു._ഫെബ്രു._മാർ._ഏപ്രി._മേയ്_ജൂൺ_ജൂലൈ._ഓഗ._സെപ്റ്റ._ഒക്ടോ._നവം._ഡിസം.".split(
          "_"
        ),
        monthsParseExact: true,
        weekdays: "ഞായറാഴ്ച_തിങ്കളാഴ്ച_ചൊവ്വാഴ്ച_ബുധനാഴ്ച_വ്യാഴാഴ്ച_വെള്ളിയാഴ്ച_ശനിയാഴ്ച".split(
          "_"
        ),
        weekdaysShort: "ഞായർ_തിങ്കൾ_ചൊവ്വ_ബുധൻ_വ്യാഴം_വെള്ളി_ശനി".split("_"),
        weekdaysMin: "ഞാ_തി_ചൊ_ബു_വ്യാ_വെ_ശ".split("_"),
        longDateFormat: {
          LT: "A h:mm -നു",
          LTS: "A h:mm:ss -നു",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY, A h:mm -നു",
          LLLL: "dddd, D MMMM YYYY, A h:mm -നു"
        },
        calendar: {
          sameDay: "[ഇന്ന്] LT",
          nextDay: "[നാളെ] LT",
          nextWeek: "dddd, LT",
          lastDay: "[ഇന്നലെ] LT",
          lastWeek: "[കഴിഞ്ഞ] dddd, LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "%s കഴിഞ്ഞ്",
          past: "%s മുൻപ്",
          s: "അൽപ നിമിഷങ്ങൾ",
          ss: "%d സെക്കൻഡ്",
          m: "ഒരു മിനിറ്റ്",
          mm: "%d മിനിറ്റ്",
          h: "ഒരു മണിക്കൂർ",
          hh: "%d മണിക്കൂർ",
          d: "ഒരു ദിവസം",
          dd: "%d ദിവസം",
          M: "ഒരു മാസം",
          MM: "%d മാസം",
          y: "ഒരു വർഷം",
          yy: "%d വർഷം"
        },
        meridiemParse: /രാത്രി|രാവിലെ|ഉച്ച കഴിഞ്ഞ്|വൈകുന്നേരം|രാത്രി/i,
        meridiemHour: function(hour, meridiem2) {
          if (hour === 12) {
            hour = 0;
          }
          if (meridiem2 === "രാത്രി" && hour >= 4 || meridiem2 === "ഉച്ച കഴിഞ്ഞ്" || meridiem2 === "വൈകുന്നേരം") {
            return hour + 12;
          } else {
            return hour;
          }
        },
        meridiem: function(hour, minute, isLower) {
          if (hour < 4) {
            return "രാത്രി";
          } else if (hour < 12) {
            return "രാവിലെ";
          } else if (hour < 17) {
            return "ഉച്ച കഴിഞ്ഞ്";
          } else if (hour < 20) {
            return "വൈകുന്നേരം";
          } else {
            return "രാത്രി";
          }
        }
      });
      //! moment.js locale configuration
      function translate$7(number, withoutSuffix, key, isFuture) {
        switch (key) {
          case "s":
            return withoutSuffix ? "хэдхэн секунд" : "хэдхэн секундын";
          case "ss":
            return number + (withoutSuffix ? " секунд" : " секундын");
          case "m":
          case "mm":
            return number + (withoutSuffix ? " минут" : " минутын");
          case "h":
          case "hh":
            return number + (withoutSuffix ? " цаг" : " цагийн");
          case "d":
          case "dd":
            return number + (withoutSuffix ? " өдөр" : " өдрийн");
          case "M":
          case "MM":
            return number + (withoutSuffix ? " сар" : " сарын");
          case "y":
          case "yy":
            return number + (withoutSuffix ? " жил" : " жилийн");
          default:
            return number;
        }
      }
      hooks.defineLocale("mn", {
        months: "Нэгдүгээр сар_Хоёрдугаар сар_Гуравдугаар сар_Дөрөвдүгээр сар_Тавдугаар сар_Зургадугаар сар_Долдугаар сар_Наймдугаар сар_Есдүгээр сар_Аравдугаар сар_Арван нэгдүгээр сар_Арван хоёрдугаар сар".split(
          "_"
        ),
        monthsShort: "1 сар_2 сар_3 сар_4 сар_5 сар_6 сар_7 сар_8 сар_9 сар_10 сар_11 сар_12 сар".split(
          "_"
        ),
        monthsParseExact: true,
        weekdays: "Ням_Даваа_Мягмар_Лхагва_Пүрэв_Баасан_Бямба".split("_"),
        weekdaysShort: "Ням_Дав_Мяг_Лха_Пүр_Баа_Бям".split("_"),
        weekdaysMin: "Ня_Да_Мя_Лх_Пү_Ба_Бя".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "YYYY-MM-DD",
          LL: "YYYY оны MMMMын D",
          LLL: "YYYY оны MMMMын D HH:mm",
          LLLL: "dddd, YYYY оны MMMMын D HH:mm"
        },
        meridiemParse: /ҮӨ|ҮХ/i,
        isPM: function(input) {
          return input === "ҮХ";
        },
        meridiem: function(hour, minute, isLower) {
          if (hour < 12) {
            return "ҮӨ";
          } else {
            return "ҮХ";
          }
        },
        calendar: {
          sameDay: "[Өнөөдөр] LT",
          nextDay: "[Маргааш] LT",
          nextWeek: "[Ирэх] dddd LT",
          lastDay: "[Өчигдөр] LT",
          lastWeek: "[Өнгөрсөн] dddd LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "%s дараа",
          past: "%s өмнө",
          s: translate$7,
          ss: translate$7,
          m: translate$7,
          mm: translate$7,
          h: translate$7,
          hh: translate$7,
          d: translate$7,
          dd: translate$7,
          M: translate$7,
          MM: translate$7,
          y: translate$7,
          yy: translate$7
        },
        dayOfMonthOrdinalParse: /\d{1,2} өдөр/,
        ordinal: function(number, period) {
          switch (period) {
            case "d":
            case "D":
            case "DDD":
              return number + " өдөр";
            default:
              return number;
          }
        }
      });
      //! moment.js locale configuration
      var symbolMap$d = {
        1: "१",
        2: "२",
        3: "३",
        4: "४",
        5: "५",
        6: "६",
        7: "७",
        8: "८",
        9: "९",
        0: "०"
      }, numberMap$c = {
        "१": "1",
        "२": "2",
        "३": "3",
        "४": "4",
        "५": "5",
        "६": "6",
        "७": "7",
        "८": "8",
        "९": "9",
        "०": "0"
      };
      function relativeTimeMr(number, withoutSuffix, string, isFuture) {
        var output = "";
        if (withoutSuffix) {
          switch (string) {
            case "s":
              output = "काही सेकंद";
              break;
            case "ss":
              output = "%d सेकंद";
              break;
            case "m":
              output = "एक मिनिट";
              break;
            case "mm":
              output = "%d मिनिटे";
              break;
            case "h":
              output = "एक तास";
              break;
            case "hh":
              output = "%d तास";
              break;
            case "d":
              output = "एक दिवस";
              break;
            case "dd":
              output = "%d दिवस";
              break;
            case "M":
              output = "एक महिना";
              break;
            case "MM":
              output = "%d महिने";
              break;
            case "y":
              output = "एक वर्ष";
              break;
            case "yy":
              output = "%d वर्षे";
              break;
          }
        } else {
          switch (string) {
            case "s":
              output = "काही सेकंदां";
              break;
            case "ss":
              output = "%d सेकंदां";
              break;
            case "m":
              output = "एका मिनिटा";
              break;
            case "mm":
              output = "%d मिनिटां";
              break;
            case "h":
              output = "एका तासा";
              break;
            case "hh":
              output = "%d तासां";
              break;
            case "d":
              output = "एका दिवसा";
              break;
            case "dd":
              output = "%d दिवसां";
              break;
            case "M":
              output = "एका महिन्या";
              break;
            case "MM":
              output = "%d महिन्यां";
              break;
            case "y":
              output = "एका वर्षा";
              break;
            case "yy":
              output = "%d वर्षां";
              break;
          }
        }
        return output.replace(/%d/i, number);
      }
      hooks.defineLocale("mr", {
        months: "जानेवारी_फेब्रुवारी_मार्च_एप्रिल_मे_जून_जुलै_ऑगस्ट_सप्टेंबर_ऑक्टोबर_नोव्हेंबर_डिसेंबर".split(
          "_"
        ),
        monthsShort: "जाने._फेब्रु._मार्च._एप्रि._मे._जून._जुलै._ऑग._सप्टें._ऑक्टो._नोव्हें._डिसें.".split(
          "_"
        ),
        monthsParseExact: true,
        weekdays: "रविवार_सोमवार_मंगळवार_बुधवार_गुरूवार_शुक्रवार_शनिवार".split("_"),
        weekdaysShort: "रवि_सोम_मंगळ_बुध_गुरू_शुक्र_शनि".split("_"),
        weekdaysMin: "र_सो_मं_बु_गु_शु_श".split("_"),
        longDateFormat: {
          LT: "A h:mm वाजता",
          LTS: "A h:mm:ss वाजता",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY, A h:mm वाजता",
          LLLL: "dddd, D MMMM YYYY, A h:mm वाजता"
        },
        calendar: {
          sameDay: "[आज] LT",
          nextDay: "[उद्या] LT",
          nextWeek: "dddd, LT",
          lastDay: "[काल] LT",
          lastWeek: "[मागील] dddd, LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "%sमध्ये",
          past: "%sपूर्वी",
          s: relativeTimeMr,
          ss: relativeTimeMr,
          m: relativeTimeMr,
          mm: relativeTimeMr,
          h: relativeTimeMr,
          hh: relativeTimeMr,
          d: relativeTimeMr,
          dd: relativeTimeMr,
          M: relativeTimeMr,
          MM: relativeTimeMr,
          y: relativeTimeMr,
          yy: relativeTimeMr
        },
        preparse: function(string) {
          return string.replace(/[१२३४५६७८९०]/g, function(match) {
            return numberMap$c[match];
          });
        },
        postformat: function(string) {
          return string.replace(/\d/g, function(match) {
            return symbolMap$d[match];
          });
        },
        meridiemParse: /पहाटे|सकाळी|दुपारी|सायंकाळी|रात्री/,
        meridiemHour: function(hour, meridiem2) {
          if (hour === 12) {
            hour = 0;
          }
          if (meridiem2 === "पहाटे" || meridiem2 === "सकाळी") {
            return hour;
          } else if (meridiem2 === "दुपारी" || meridiem2 === "सायंकाळी" || meridiem2 === "रात्री") {
            return hour >= 12 ? hour : hour + 12;
          }
        },
        meridiem: function(hour, minute, isLower) {
          if (hour >= 0 && hour < 6) {
            return "पहाटे";
          } else if (hour < 12) {
            return "सकाळी";
          } else if (hour < 17) {
            return "दुपारी";
          } else if (hour < 20) {
            return "सायंकाळी";
          } else {
            return "रात्री";
          }
        },
        week: {
          dow: 0,
          // Sunday is the first day of the week.
          doy: 6
          // The week that contains Jan 6th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("ms-my", {
        months: "Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember".split(
          "_"
        ),
        monthsShort: "Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis".split("_"),
        weekdays: "Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu".split("_"),
        weekdaysShort: "Ahd_Isn_Sel_Rab_Kha_Jum_Sab".split("_"),
        weekdaysMin: "Ah_Is_Sl_Rb_Km_Jm_Sb".split("_"),
        longDateFormat: {
          LT: "HH.mm",
          LTS: "HH.mm.ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY [pukul] HH.mm",
          LLLL: "dddd, D MMMM YYYY [pukul] HH.mm"
        },
        meridiemParse: /pagi|tengahari|petang|malam/,
        meridiemHour: function(hour, meridiem2) {
          if (hour === 12) {
            hour = 0;
          }
          if (meridiem2 === "pagi") {
            return hour;
          } else if (meridiem2 === "tengahari") {
            return hour >= 11 ? hour : hour + 12;
          } else if (meridiem2 === "petang" || meridiem2 === "malam") {
            return hour + 12;
          }
        },
        meridiem: function(hours2, minutes2, isLower) {
          if (hours2 < 11) {
            return "pagi";
          } else if (hours2 < 15) {
            return "tengahari";
          } else if (hours2 < 19) {
            return "petang";
          } else {
            return "malam";
          }
        },
        calendar: {
          sameDay: "[Hari ini pukul] LT",
          nextDay: "[Esok pukul] LT",
          nextWeek: "dddd [pukul] LT",
          lastDay: "[Kelmarin pukul] LT",
          lastWeek: "dddd [lepas pukul] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "dalam %s",
          past: "%s yang lepas",
          s: "beberapa saat",
          ss: "%d saat",
          m: "seminit",
          mm: "%d minit",
          h: "sejam",
          hh: "%d jam",
          d: "sehari",
          dd: "%d hari",
          M: "sebulan",
          MM: "%d bulan",
          y: "setahun",
          yy: "%d tahun"
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 7
          // The week that contains Jan 7th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("ms", {
        months: "Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember".split(
          "_"
        ),
        monthsShort: "Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis".split("_"),
        weekdays: "Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu".split("_"),
        weekdaysShort: "Ahd_Isn_Sel_Rab_Kha_Jum_Sab".split("_"),
        weekdaysMin: "Ah_Is_Sl_Rb_Km_Jm_Sb".split("_"),
        longDateFormat: {
          LT: "HH.mm",
          LTS: "HH.mm.ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY [pukul] HH.mm",
          LLLL: "dddd, D MMMM YYYY [pukul] HH.mm"
        },
        meridiemParse: /pagi|tengahari|petang|malam/,
        meridiemHour: function(hour, meridiem2) {
          if (hour === 12) {
            hour = 0;
          }
          if (meridiem2 === "pagi") {
            return hour;
          } else if (meridiem2 === "tengahari") {
            return hour >= 11 ? hour : hour + 12;
          } else if (meridiem2 === "petang" || meridiem2 === "malam") {
            return hour + 12;
          }
        },
        meridiem: function(hours2, minutes2, isLower) {
          if (hours2 < 11) {
            return "pagi";
          } else if (hours2 < 15) {
            return "tengahari";
          } else if (hours2 < 19) {
            return "petang";
          } else {
            return "malam";
          }
        },
        calendar: {
          sameDay: "[Hari ini pukul] LT",
          nextDay: "[Esok pukul] LT",
          nextWeek: "dddd [pukul] LT",
          lastDay: "[Kelmarin pukul] LT",
          lastWeek: "dddd [lepas pukul] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "dalam %s",
          past: "%s yang lepas",
          s: "beberapa saat",
          ss: "%d saat",
          m: "seminit",
          mm: "%d minit",
          h: "sejam",
          hh: "%d jam",
          d: "sehari",
          dd: "%d hari",
          M: "sebulan",
          MM: "%d bulan",
          y: "setahun",
          yy: "%d tahun"
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 7
          // The week that contains Jan 7th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("mt", {
        months: "Jannar_Frar_Marzu_April_Mejju_Ġunju_Lulju_Awwissu_Settembru_Ottubru_Novembru_Diċembru".split(
          "_"
        ),
        monthsShort: "Jan_Fra_Mar_Apr_Mej_Ġun_Lul_Aww_Set_Ott_Nov_Diċ".split("_"),
        weekdays: "Il-Ħadd_It-Tnejn_It-Tlieta_L-Erbgħa_Il-Ħamis_Il-Ġimgħa_Is-Sibt".split(
          "_"
        ),
        weekdaysShort: "Ħad_Tne_Tli_Erb_Ħam_Ġim_Sib".split("_"),
        weekdaysMin: "Ħa_Tn_Tl_Er_Ħa_Ġi_Si".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd, D MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[Illum fil-]LT",
          nextDay: "[Għada fil-]LT",
          nextWeek: "dddd [fil-]LT",
          lastDay: "[Il-bieraħ fil-]LT",
          lastWeek: "dddd [li għadda] [fil-]LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "f’ %s",
          past: "%s ilu",
          s: "ftit sekondi",
          ss: "%d sekondi",
          m: "minuta",
          mm: "%d minuti",
          h: "siegħa",
          hh: "%d siegħat",
          d: "ġurnata",
          dd: "%d ġranet",
          M: "xahar",
          MM: "%d xhur",
          y: "sena",
          yy: "%d sni"
        },
        dayOfMonthOrdinalParse: /\d{1,2}º/,
        ordinal: "%dº",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var symbolMap$e = {
        1: "၁",
        2: "၂",
        3: "၃",
        4: "၄",
        5: "၅",
        6: "၆",
        7: "၇",
        8: "၈",
        9: "၉",
        0: "၀"
      }, numberMap$d = {
        "၁": "1",
        "၂": "2",
        "၃": "3",
        "၄": "4",
        "၅": "5",
        "၆": "6",
        "၇": "7",
        "၈": "8",
        "၉": "9",
        "၀": "0"
      };
      hooks.defineLocale("my", {
        months: "ဇန်နဝါရီ_ဖေဖော်ဝါရီ_မတ်_ဧပြီ_မေ_ဇွန်_ဇူလိုင်_သြဂုတ်_စက်တင်ဘာ_အောက်တိုဘာ_နိုဝင်ဘာ_ဒီဇင်ဘာ".split(
          "_"
        ),
        monthsShort: "ဇန်_ဖေ_မတ်_ပြီ_မေ_ဇွန်_လိုင်_သြ_စက်_အောက်_နို_ဒီ".split("_"),
        weekdays: "တနင်္ဂနွေ_တနင်္လာ_အင်္ဂါ_ဗုဒ္ဓဟူး_ကြာသပတေး_သောကြာ_စနေ".split(
          "_"
        ),
        weekdaysShort: "နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ".split("_"),
        weekdaysMin: "နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd D MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[ယနေ.] LT [မှာ]",
          nextDay: "[မနက်ဖြန်] LT [မှာ]",
          nextWeek: "dddd LT [မှာ]",
          lastDay: "[မနေ.က] LT [မှာ]",
          lastWeek: "[ပြီးခဲ့သော] dddd LT [မှာ]",
          sameElse: "L"
        },
        relativeTime: {
          future: "လာမည့် %s မှာ",
          past: "လွန်ခဲ့သော %s က",
          s: "စက္ကန်.အနည်းငယ်",
          ss: "%d စက္ကန့်",
          m: "တစ်မိနစ်",
          mm: "%d မိနစ်",
          h: "တစ်နာရီ",
          hh: "%d နာရီ",
          d: "တစ်ရက်",
          dd: "%d ရက်",
          M: "တစ်လ",
          MM: "%d လ",
          y: "တစ်နှစ်",
          yy: "%d နှစ်"
        },
        preparse: function(string) {
          return string.replace(/[၁၂၃၄၅၆၇၈၉၀]/g, function(match) {
            return numberMap$d[match];
          });
        },
        postformat: function(string) {
          return string.replace(/\d/g, function(match) {
            return symbolMap$e[match];
          });
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("nb", {
        months: "januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split(
          "_"
        ),
        monthsShort: "jan._feb._mars_apr._mai_juni_juli_aug._sep._okt._nov._des.".split("_"),
        monthsParseExact: true,
        weekdays: "søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),
        weekdaysShort: "sø._ma._ti._on._to._fr._lø.".split("_"),
        weekdaysMin: "sø_ma_ti_on_to_fr_lø".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD.MM.YYYY",
          LL: "D. MMMM YYYY",
          LLL: "D. MMMM YYYY [kl.] HH:mm",
          LLLL: "dddd D. MMMM YYYY [kl.] HH:mm"
        },
        calendar: {
          sameDay: "[i dag kl.] LT",
          nextDay: "[i morgen kl.] LT",
          nextWeek: "dddd [kl.] LT",
          lastDay: "[i går kl.] LT",
          lastWeek: "[forrige] dddd [kl.] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "om %s",
          past: "%s siden",
          s: "noen sekunder",
          ss: "%d sekunder",
          m: "ett minutt",
          mm: "%d minutter",
          h: "én time",
          hh: "%d timer",
          d: "én dag",
          dd: "%d dager",
          w: "én uke",
          ww: "%d uker",
          M: "én måned",
          MM: "%d måneder",
          y: "ett år",
          yy: "%d år"
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal: "%d.",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var symbolMap$f = {
        1: "१",
        2: "२",
        3: "३",
        4: "४",
        5: "५",
        6: "६",
        7: "७",
        8: "८",
        9: "९",
        0: "०"
      }, numberMap$e = {
        "१": "1",
        "२": "2",
        "३": "3",
        "४": "4",
        "५": "5",
        "६": "6",
        "७": "7",
        "८": "8",
        "९": "9",
        "०": "0"
      };
      hooks.defineLocale("ne", {
        months: "जनवरी_फेब्रुवरी_मार्च_अप्रिल_मई_जुन_जुलाई_अगष्ट_सेप्टेम्बर_अक्टोबर_नोभेम्बर_डिसेम्बर".split(
          "_"
        ),
        monthsShort: "जन._फेब्रु._मार्च_अप्रि._मई_जुन_जुलाई._अग._सेप्ट._अक्टो._नोभे._डिसे.".split(
          "_"
        ),
        monthsParseExact: true,
        weekdays: "आइतबार_सोमबार_मङ्गलबार_बुधबार_बिहिबार_शुक्रबार_शनिबार".split(
          "_"
        ),
        weekdaysShort: "आइत._सोम._मङ्गल._बुध._बिहि._शुक्र._शनि.".split("_"),
        weekdaysMin: "आ._सो._मं._बु._बि._शु._श.".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "Aको h:mm बजे",
          LTS: "Aको h:mm:ss बजे",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY, Aको h:mm बजे",
          LLLL: "dddd, D MMMM YYYY, Aको h:mm बजे"
        },
        preparse: function(string) {
          return string.replace(/[१२३४५६७८९०]/g, function(match) {
            return numberMap$e[match];
          });
        },
        postformat: function(string) {
          return string.replace(/\d/g, function(match) {
            return symbolMap$f[match];
          });
        },
        meridiemParse: /राति|बिहान|दिउँसो|साँझ/,
        meridiemHour: function(hour, meridiem2) {
          if (hour === 12) {
            hour = 0;
          }
          if (meridiem2 === "राति") {
            return hour < 4 ? hour : hour + 12;
          } else if (meridiem2 === "बिहान") {
            return hour;
          } else if (meridiem2 === "दिउँसो") {
            return hour >= 10 ? hour : hour + 12;
          } else if (meridiem2 === "साँझ") {
            return hour + 12;
          }
        },
        meridiem: function(hour, minute, isLower) {
          if (hour < 3) {
            return "राति";
          } else if (hour < 12) {
            return "बिहान";
          } else if (hour < 16) {
            return "दिउँसो";
          } else if (hour < 20) {
            return "साँझ";
          } else {
            return "राति";
          }
        },
        calendar: {
          sameDay: "[आज] LT",
          nextDay: "[भोलि] LT",
          nextWeek: "[आउँदो] dddd[,] LT",
          lastDay: "[हिजो] LT",
          lastWeek: "[गएको] dddd[,] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "%sमा",
          past: "%s अगाडि",
          s: "केही क्षण",
          ss: "%d सेकेण्ड",
          m: "एक मिनेट",
          mm: "%d मिनेट",
          h: "एक घण्टा",
          hh: "%d घण्टा",
          d: "एक दिन",
          dd: "%d दिन",
          M: "एक महिना",
          MM: "%d महिना",
          y: "एक बर्ष",
          yy: "%d बर्ष"
        },
        week: {
          dow: 0,
          // Sunday is the first day of the week.
          doy: 6
          // The week that contains Jan 6th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var monthsShortWithDots$1 = "jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.".split("_"), monthsShortWithoutDots$1 = "jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec".split("_"), monthsParse$8 = [
        /^jan/i,
        /^feb/i,
        /^(maart|mrt\.?)$/i,
        /^apr/i,
        /^mei$/i,
        /^jun[i.]?$/i,
        /^jul[i.]?$/i,
        /^aug/i,
        /^sep/i,
        /^okt/i,
        /^nov/i,
        /^dec/i
      ], monthsRegex$8 = /^(januari|februari|maart|april|mei|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;
      hooks.defineLocale("nl-be", {
        months: "januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december".split(
          "_"
        ),
        monthsShort: function(m, format2) {
          if (!m) {
            return monthsShortWithDots$1;
          } else if (/-MMM-/.test(format2)) {
            return monthsShortWithoutDots$1[m.month()];
          } else {
            return monthsShortWithDots$1[m.month()];
          }
        },
        monthsRegex: monthsRegex$8,
        monthsShortRegex: monthsRegex$8,
        monthsStrictRegex: /^(januari|februari|maart|april|mei|ju[nl]i|augustus|september|oktober|november|december)/i,
        monthsShortStrictRegex: /^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,
        monthsParse: monthsParse$8,
        longMonthsParse: monthsParse$8,
        shortMonthsParse: monthsParse$8,
        weekdays: "zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag".split("_"),
        weekdaysShort: "zo._ma._di._wo._do._vr._za.".split("_"),
        weekdaysMin: "zo_ma_di_wo_do_vr_za".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd D MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[vandaag om] LT",
          nextDay: "[morgen om] LT",
          nextWeek: "dddd [om] LT",
          lastDay: "[gisteren om] LT",
          lastWeek: "[afgelopen] dddd [om] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "over %s",
          past: "%s geleden",
          s: "een paar seconden",
          ss: "%d seconden",
          m: "één minuut",
          mm: "%d minuten",
          h: "één uur",
          hh: "%d uur",
          d: "één dag",
          dd: "%d dagen",
          M: "één maand",
          MM: "%d maanden",
          y: "één jaar",
          yy: "%d jaar"
        },
        dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
        ordinal: function(number) {
          return number + (number === 1 || number === 8 || number >= 20 ? "ste" : "de");
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var monthsShortWithDots$2 = "jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.".split("_"), monthsShortWithoutDots$2 = "jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec".split("_"), monthsParse$9 = [
        /^jan/i,
        /^feb/i,
        /^(maart|mrt\.?)$/i,
        /^apr/i,
        /^mei$/i,
        /^jun[i.]?$/i,
        /^jul[i.]?$/i,
        /^aug/i,
        /^sep/i,
        /^okt/i,
        /^nov/i,
        /^dec/i
      ], monthsRegex$9 = /^(januari|februari|maart|april|mei|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;
      hooks.defineLocale("nl", {
        months: "januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december".split(
          "_"
        ),
        monthsShort: function(m, format2) {
          if (!m) {
            return monthsShortWithDots$2;
          } else if (/-MMM-/.test(format2)) {
            return monthsShortWithoutDots$2[m.month()];
          } else {
            return monthsShortWithDots$2[m.month()];
          }
        },
        monthsRegex: monthsRegex$9,
        monthsShortRegex: monthsRegex$9,
        monthsStrictRegex: /^(januari|februari|maart|april|mei|ju[nl]i|augustus|september|oktober|november|december)/i,
        monthsShortStrictRegex: /^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,
        monthsParse: monthsParse$9,
        longMonthsParse: monthsParse$9,
        shortMonthsParse: monthsParse$9,
        weekdays: "zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag".split("_"),
        weekdaysShort: "zo._ma._di._wo._do._vr._za.".split("_"),
        weekdaysMin: "zo_ma_di_wo_do_vr_za".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD-MM-YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd D MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[vandaag om] LT",
          nextDay: "[morgen om] LT",
          nextWeek: "dddd [om] LT",
          lastDay: "[gisteren om] LT",
          lastWeek: "[afgelopen] dddd [om] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "over %s",
          past: "%s geleden",
          s: "een paar seconden",
          ss: "%d seconden",
          m: "één minuut",
          mm: "%d minuten",
          h: "één uur",
          hh: "%d uur",
          d: "één dag",
          dd: "%d dagen",
          w: "één week",
          ww: "%d weken",
          M: "één maand",
          MM: "%d maanden",
          y: "één jaar",
          yy: "%d jaar"
        },
        dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
        ordinal: function(number) {
          return number + (number === 1 || number === 8 || number >= 20 ? "ste" : "de");
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("nn", {
        months: "januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split(
          "_"
        ),
        monthsShort: "jan._feb._mars_apr._mai_juni_juli_aug._sep._okt._nov._des.".split("_"),
        monthsParseExact: true,
        weekdays: "sundag_måndag_tysdag_onsdag_torsdag_fredag_laurdag".split("_"),
        weekdaysShort: "su._må._ty._on._to._fr._lau.".split("_"),
        weekdaysMin: "su_må_ty_on_to_fr_la".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD.MM.YYYY",
          LL: "D. MMMM YYYY",
          LLL: "D. MMMM YYYY [kl.] H:mm",
          LLLL: "dddd D. MMMM YYYY [kl.] HH:mm"
        },
        calendar: {
          sameDay: "[I dag klokka] LT",
          nextDay: "[I morgon klokka] LT",
          nextWeek: "dddd [klokka] LT",
          lastDay: "[I går klokka] LT",
          lastWeek: "[Føregåande] dddd [klokka] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "om %s",
          past: "%s sidan",
          s: "nokre sekund",
          ss: "%d sekund",
          m: "eit minutt",
          mm: "%d minutt",
          h: "ein time",
          hh: "%d timar",
          d: "ein dag",
          dd: "%d dagar",
          w: "ei veke",
          ww: "%d veker",
          M: "ein månad",
          MM: "%d månader",
          y: "eit år",
          yy: "%d år"
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal: "%d.",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("oc-lnc", {
        months: {
          standalone: "genièr_febrièr_març_abril_mai_junh_julhet_agost_setembre_octòbre_novembre_decembre".split(
            "_"
          ),
          format: "de genièr_de febrièr_de març_d'abril_de mai_de junh_de julhet_d'agost_de setembre_d'octòbre_de novembre_de decembre".split(
            "_"
          ),
          isFormat: /D[oD]?(\s)+MMMM/
        },
        monthsShort: "gen._febr._març_abr._mai_junh_julh._ago._set._oct._nov._dec.".split(
          "_"
        ),
        monthsParseExact: true,
        weekdays: "dimenge_diluns_dimars_dimècres_dijòus_divendres_dissabte".split(
          "_"
        ),
        weekdaysShort: "dg._dl._dm._dc._dj._dv._ds.".split("_"),
        weekdaysMin: "dg_dl_dm_dc_dj_dv_ds".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "H:mm",
          LTS: "H:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM [de] YYYY",
          ll: "D MMM YYYY",
          LLL: "D MMMM [de] YYYY [a] H:mm",
          lll: "D MMM YYYY, H:mm",
          LLLL: "dddd D MMMM [de] YYYY [a] H:mm",
          llll: "ddd D MMM YYYY, H:mm"
        },
        calendar: {
          sameDay: "[uèi a] LT",
          nextDay: "[deman a] LT",
          nextWeek: "dddd [a] LT",
          lastDay: "[ièr a] LT",
          lastWeek: "dddd [passat a] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "d'aquí %s",
          past: "fa %s",
          s: "unas segondas",
          ss: "%d segondas",
          m: "una minuta",
          mm: "%d minutas",
          h: "una ora",
          hh: "%d oras",
          d: "un jorn",
          dd: "%d jorns",
          M: "un mes",
          MM: "%d meses",
          y: "un an",
          yy: "%d ans"
        },
        dayOfMonthOrdinalParse: /\d{1,2}(r|n|t|è|a)/,
        ordinal: function(number, period) {
          var output = number === 1 ? "r" : number === 2 ? "n" : number === 3 ? "r" : number === 4 ? "t" : "è";
          if (period === "w" || period === "W") {
            output = "a";
          }
          return number + output;
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
        }
      });
      //! moment.js locale configuration
      var symbolMap$g = {
        1: "੧",
        2: "੨",
        3: "੩",
        4: "੪",
        5: "੫",
        6: "੬",
        7: "੭",
        8: "੮",
        9: "੯",
        0: "੦"
      }, numberMap$f = {
        "੧": "1",
        "੨": "2",
        "੩": "3",
        "੪": "4",
        "੫": "5",
        "੬": "6",
        "੭": "7",
        "੮": "8",
        "੯": "9",
        "੦": "0"
      };
      hooks.defineLocale("pa-in", {
        // There are months name as per Nanakshahi Calendar but they are not used as rigidly in modern Punjabi.
        months: "ਜਨਵਰੀ_ਫ਼ਰਵਰੀ_ਮਾਰਚ_ਅਪ੍ਰੈਲ_ਮਈ_ਜੂਨ_ਜੁਲਾਈ_ਅਗਸਤ_ਸਤੰਬਰ_ਅਕਤੂਬਰ_ਨਵੰਬਰ_ਦਸੰਬਰ".split(
          "_"
        ),
        monthsShort: "ਜਨਵਰੀ_ਫ਼ਰਵਰੀ_ਮਾਰਚ_ਅਪ੍ਰੈਲ_ਮਈ_ਜੂਨ_ਜੁਲਾਈ_ਅਗਸਤ_ਸਤੰਬਰ_ਅਕਤੂਬਰ_ਨਵੰਬਰ_ਦਸੰਬਰ".split(
          "_"
        ),
        weekdays: "ਐਤਵਾਰ_ਸੋਮਵਾਰ_ਮੰਗਲਵਾਰ_ਬੁਧਵਾਰ_ਵੀਰਵਾਰ_ਸ਼ੁੱਕਰਵਾਰ_ਸ਼ਨੀਚਰਵਾਰ".split(
          "_"
        ),
        weekdaysShort: "ਐਤ_ਸੋਮ_ਮੰਗਲ_ਬੁਧ_ਵੀਰ_ਸ਼ੁਕਰ_ਸ਼ਨੀ".split("_"),
        weekdaysMin: "ਐਤ_ਸੋਮ_ਮੰਗਲ_ਬੁਧ_ਵੀਰ_ਸ਼ੁਕਰ_ਸ਼ਨੀ".split("_"),
        longDateFormat: {
          LT: "A h:mm ਵਜੇ",
          LTS: "A h:mm:ss ਵਜੇ",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY, A h:mm ਵਜੇ",
          LLLL: "dddd, D MMMM YYYY, A h:mm ਵਜੇ"
        },
        calendar: {
          sameDay: "[ਅਜ] LT",
          nextDay: "[ਕਲ] LT",
          nextWeek: "[ਅਗਲਾ] dddd, LT",
          lastDay: "[ਕਲ] LT",
          lastWeek: "[ਪਿਛਲੇ] dddd, LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "%s ਵਿੱਚ",
          past: "%s ਪਿਛਲੇ",
          s: "ਕੁਝ ਸਕਿੰਟ",
          ss: "%d ਸਕਿੰਟ",
          m: "ਇਕ ਮਿੰਟ",
          mm: "%d ਮਿੰਟ",
          h: "ਇੱਕ ਘੰਟਾ",
          hh: "%d ਘੰਟੇ",
          d: "ਇੱਕ ਦਿਨ",
          dd: "%d ਦਿਨ",
          M: "ਇੱਕ ਮਹੀਨਾ",
          MM: "%d ਮਹੀਨੇ",
          y: "ਇੱਕ ਸਾਲ",
          yy: "%d ਸਾਲ"
        },
        preparse: function(string) {
          return string.replace(/[੧੨੩੪੫੬੭੮੯੦]/g, function(match) {
            return numberMap$f[match];
          });
        },
        postformat: function(string) {
          return string.replace(/\d/g, function(match) {
            return symbolMap$g[match];
          });
        },
        // Punjabi notation for meridiems are quite fuzzy in practice. While there exists
        // a rigid notion of a 'Pahar' it is not used as rigidly in modern Punjabi.
        meridiemParse: /ਰਾਤ|ਸਵੇਰ|ਦੁਪਹਿਰ|ਸ਼ਾਮ/,
        meridiemHour: function(hour, meridiem2) {
          if (hour === 12) {
            hour = 0;
          }
          if (meridiem2 === "ਰਾਤ") {
            return hour < 4 ? hour : hour + 12;
          } else if (meridiem2 === "ਸਵੇਰ") {
            return hour;
          } else if (meridiem2 === "ਦੁਪਹਿਰ") {
            return hour >= 10 ? hour : hour + 12;
          } else if (meridiem2 === "ਸ਼ਾਮ") {
            return hour + 12;
          }
        },
        meridiem: function(hour, minute, isLower) {
          if (hour < 4) {
            return "ਰਾਤ";
          } else if (hour < 10) {
            return "ਸਵੇਰ";
          } else if (hour < 17) {
            return "ਦੁਪਹਿਰ";
          } else if (hour < 20) {
            return "ਸ਼ਾਮ";
          } else {
            return "ਰਾਤ";
          }
        },
        week: {
          dow: 0,
          // Sunday is the first day of the week.
          doy: 6
          // The week that contains Jan 6th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var monthsNominative = "styczeń_luty_marzec_kwiecień_maj_czerwiec_lipiec_sierpień_wrzesień_październik_listopad_grudzień".split(
        "_"
      ), monthsSubjective = "stycznia_lutego_marca_kwietnia_maja_czerwca_lipca_sierpnia_września_października_listopada_grudnia".split(
        "_"
      ), monthsParse$a = [
        /^sty/i,
        /^lut/i,
        /^mar/i,
        /^kwi/i,
        /^maj/i,
        /^cze/i,
        /^lip/i,
        /^sie/i,
        /^wrz/i,
        /^paź/i,
        /^lis/i,
        /^gru/i
      ];
      function plural$3(n) {
        return n % 10 < 5 && n % 10 > 1 && ~~(n / 10) % 10 !== 1;
      }
      function translate$8(number, withoutSuffix, key) {
        var result = number + " ";
        switch (key) {
          case "ss":
            return result + (plural$3(number) ? "sekundy" : "sekund");
          case "m":
            return withoutSuffix ? "minuta" : "minutę";
          case "mm":
            return result + (plural$3(number) ? "minuty" : "minut");
          case "h":
            return withoutSuffix ? "godzina" : "godzinę";
          case "hh":
            return result + (plural$3(number) ? "godziny" : "godzin");
          case "ww":
            return result + (plural$3(number) ? "tygodnie" : "tygodni");
          case "MM":
            return result + (plural$3(number) ? "miesiące" : "miesięcy");
          case "yy":
            return result + (plural$3(number) ? "lata" : "lat");
        }
      }
      hooks.defineLocale("pl", {
        months: function(momentToFormat, format2) {
          if (!momentToFormat) {
            return monthsNominative;
          } else if (/D MMMM/.test(format2)) {
            return monthsSubjective[momentToFormat.month()];
          } else {
            return monthsNominative[momentToFormat.month()];
          }
        },
        monthsShort: "sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru".split("_"),
        monthsParse: monthsParse$a,
        longMonthsParse: monthsParse$a,
        shortMonthsParse: monthsParse$a,
        weekdays: "niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota".split("_"),
        weekdaysShort: "ndz_pon_wt_śr_czw_pt_sob".split("_"),
        weekdaysMin: "Nd_Pn_Wt_Śr_Cz_Pt_So".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD.MM.YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd, D MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[Dziś o] LT",
          nextDay: "[Jutro o] LT",
          nextWeek: function() {
            switch (this.day()) {
              case 0:
                return "[W niedzielę o] LT";
              case 2:
                return "[We wtorek o] LT";
              case 3:
                return "[W środę o] LT";
              case 6:
                return "[W sobotę o] LT";
              default:
                return "[W] dddd [o] LT";
            }
          },
          lastDay: "[Wczoraj o] LT",
          lastWeek: function() {
            switch (this.day()) {
              case 0:
                return "[W zeszłą niedzielę o] LT";
              case 3:
                return "[W zeszłą środę o] LT";
              case 6:
                return "[W zeszłą sobotę o] LT";
              default:
                return "[W zeszły] dddd [o] LT";
            }
          },
          sameElse: "L"
        },
        relativeTime: {
          future: "za %s",
          past: "%s temu",
          s: "kilka sekund",
          ss: translate$8,
          m: translate$8,
          mm: translate$8,
          h: translate$8,
          hh: translate$8,
          d: "1 dzień",
          dd: "%d dni",
          w: "tydzień",
          ww: translate$8,
          M: "miesiąc",
          MM: translate$8,
          y: "rok",
          yy: translate$8
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal: "%d.",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("pt-br", {
        months: "janeiro_fevereiro_março_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro".split(
          "_"
        ),
        monthsShort: "jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez".split("_"),
        weekdays: "domingo_segunda-feira_terça-feira_quarta-feira_quinta-feira_sexta-feira_sábado".split(
          "_"
        ),
        weekdaysShort: "dom_seg_ter_qua_qui_sex_sáb".split("_"),
        weekdaysMin: "do_2ª_3ª_4ª_5ª_6ª_sá".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D [de] MMMM [de] YYYY",
          LLL: "D [de] MMMM [de] YYYY [às] HH:mm",
          LLLL: "dddd, D [de] MMMM [de] YYYY [às] HH:mm"
        },
        calendar: {
          sameDay: "[Hoje às] LT",
          nextDay: "[Amanhã às] LT",
          nextWeek: "dddd [às] LT",
          lastDay: "[Ontem às] LT",
          lastWeek: function() {
            return this.day() === 0 || this.day() === 6 ? "[Último] dddd [às] LT" : "[Última] dddd [às] LT";
          },
          sameElse: "L"
        },
        relativeTime: {
          future: "em %s",
          past: "há %s",
          s: "poucos segundos",
          ss: "%d segundos",
          m: "um minuto",
          mm: "%d minutos",
          h: "uma hora",
          hh: "%d horas",
          d: "um dia",
          dd: "%d dias",
          M: "um mês",
          MM: "%d meses",
          y: "um ano",
          yy: "%d anos"
        },
        dayOfMonthOrdinalParse: /\d{1,2}º/,
        ordinal: "%dº",
        invalidDate: "Data inválida"
      });
      //! moment.js locale configuration
      hooks.defineLocale("pt", {
        months: "janeiro_fevereiro_março_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro".split(
          "_"
        ),
        monthsShort: "jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez".split("_"),
        weekdays: "Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado".split(
          "_"
        ),
        weekdaysShort: "Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split("_"),
        weekdaysMin: "Do_2ª_3ª_4ª_5ª_6ª_Sá".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D [de] MMMM [de] YYYY",
          LLL: "D [de] MMMM [de] YYYY HH:mm",
          LLLL: "dddd, D [de] MMMM [de] YYYY HH:mm"
        },
        calendar: {
          sameDay: "[Hoje às] LT",
          nextDay: "[Amanhã às] LT",
          nextWeek: "dddd [às] LT",
          lastDay: "[Ontem às] LT",
          lastWeek: function() {
            return this.day() === 0 || this.day() === 6 ? "[Último] dddd [às] LT" : "[Última] dddd [às] LT";
          },
          sameElse: "L"
        },
        relativeTime: {
          future: "em %s",
          past: "há %s",
          s: "segundos",
          ss: "%d segundos",
          m: "um minuto",
          mm: "%d minutos",
          h: "uma hora",
          hh: "%d horas",
          d: "um dia",
          dd: "%d dias",
          w: "uma semana",
          ww: "%d semanas",
          M: "um mês",
          MM: "%d meses",
          y: "um ano",
          yy: "%d anos"
        },
        dayOfMonthOrdinalParse: /\d{1,2}º/,
        ordinal: "%dº",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      function relativeTimeWithPlural$2(number, withoutSuffix, key) {
        var format2 = {
          ss: "secunde",
          mm: "minute",
          hh: "ore",
          dd: "zile",
          ww: "săptămâni",
          MM: "luni",
          yy: "ani"
        }, separator = " ";
        if (number % 100 >= 20 || number >= 100 && number % 100 === 0) {
          separator = " de ";
        }
        return number + separator + format2[key];
      }
      hooks.defineLocale("ro", {
        months: "ianuarie_februarie_martie_aprilie_mai_iunie_iulie_august_septembrie_octombrie_noiembrie_decembrie".split(
          "_"
        ),
        monthsShort: "ian._feb._mart._apr._mai_iun._iul._aug._sept._oct._nov._dec.".split(
          "_"
        ),
        monthsParseExact: true,
        weekdays: "duminică_luni_marți_miercuri_joi_vineri_sâmbătă".split("_"),
        weekdaysShort: "Dum_Lun_Mar_Mie_Joi_Vin_Sâm".split("_"),
        weekdaysMin: "Du_Lu_Ma_Mi_Jo_Vi_Sâ".split("_"),
        longDateFormat: {
          LT: "H:mm",
          LTS: "H:mm:ss",
          L: "DD.MM.YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY H:mm",
          LLLL: "dddd, D MMMM YYYY H:mm"
        },
        calendar: {
          sameDay: "[azi la] LT",
          nextDay: "[mâine la] LT",
          nextWeek: "dddd [la] LT",
          lastDay: "[ieri la] LT",
          lastWeek: "[fosta] dddd [la] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "peste %s",
          past: "%s în urmă",
          s: "câteva secunde",
          ss: relativeTimeWithPlural$2,
          m: "un minut",
          mm: relativeTimeWithPlural$2,
          h: "o oră",
          hh: relativeTimeWithPlural$2,
          d: "o zi",
          dd: relativeTimeWithPlural$2,
          w: "o săptămână",
          ww: relativeTimeWithPlural$2,
          M: "o lună",
          MM: relativeTimeWithPlural$2,
          y: "un an",
          yy: relativeTimeWithPlural$2
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 7
          // The week that contains Jan 7th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      function plural$4(word, num) {
        var forms2 = word.split("_");
        return num % 10 === 1 && num % 100 !== 11 ? forms2[0] : num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms2[1] : forms2[2];
      }
      function relativeTimeWithPlural$3(number, withoutSuffix, key) {
        var format2 = {
          ss: withoutSuffix ? "секунда_секунды_секунд" : "секунду_секунды_секунд",
          mm: withoutSuffix ? "минута_минуты_минут" : "минуту_минуты_минут",
          hh: "час_часа_часов",
          dd: "день_дня_дней",
          ww: "неделя_недели_недель",
          MM: "месяц_месяца_месяцев",
          yy: "год_года_лет"
        };
        if (key === "m") {
          return withoutSuffix ? "минута" : "минуту";
        } else {
          return number + " " + plural$4(format2[key], +number);
        }
      }
      var monthsParse$b = [
        /^янв/i,
        /^фев/i,
        /^мар/i,
        /^апр/i,
        /^ма[йя]/i,
        /^июн/i,
        /^июл/i,
        /^авг/i,
        /^сен/i,
        /^окт/i,
        /^ноя/i,
        /^дек/i
      ];
      hooks.defineLocale("ru", {
        months: {
          format: "января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря".split(
            "_"
          ),
          standalone: "январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split(
            "_"
          )
        },
        monthsShort: {
          // по CLDR именно "июл." и "июн.", но какой смысл менять букву на точку?
          format: "янв._февр._мар._апр._мая_июня_июля_авг._сент._окт._нояб._дек.".split(
            "_"
          ),
          standalone: "янв._февр._март_апр._май_июнь_июль_авг._сент._окт._нояб._дек.".split(
            "_"
          )
        },
        weekdays: {
          standalone: "воскресенье_понедельник_вторник_среда_четверг_пятница_суббота".split(
            "_"
          ),
          format: "воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу".split(
            "_"
          ),
          isFormat: /\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?] ?dddd/
        },
        weekdaysShort: "вс_пн_вт_ср_чт_пт_сб".split("_"),
        weekdaysMin: "вс_пн_вт_ср_чт_пт_сб".split("_"),
        monthsParse: monthsParse$b,
        longMonthsParse: monthsParse$b,
        shortMonthsParse: monthsParse$b,
        // полные названия с падежами, по три буквы, для некоторых, по 4 буквы, сокращения с точкой и без точки
        monthsRegex: /^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,
        // копия предыдущего
        monthsShortRegex: /^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,
        // полные названия с падежами
        monthsStrictRegex: /^(январ[яь]|феврал[яь]|марта?|апрел[яь]|ма[яй]|июн[яь]|июл[яь]|августа?|сентябр[яь]|октябр[яь]|ноябр[яь]|декабр[яь])/i,
        // Выражение, которое соответствует только сокращённым формам
        monthsShortStrictRegex: /^(янв\.|февр?\.|мар[т.]|апр\.|ма[яй]|июн[ья.]|июл[ья.]|авг\.|сент?\.|окт\.|нояб?\.|дек\.)/i,
        longDateFormat: {
          LT: "H:mm",
          LTS: "H:mm:ss",
          L: "DD.MM.YYYY",
          LL: "D MMMM YYYY г.",
          LLL: "D MMMM YYYY г., H:mm",
          LLLL: "dddd, D MMMM YYYY г., H:mm"
        },
        calendar: {
          sameDay: "[Сегодня, в] LT",
          nextDay: "[Завтра, в] LT",
          lastDay: "[Вчера, в] LT",
          nextWeek: function(now2) {
            if (now2.week() !== this.week()) {
              switch (this.day()) {
                case 0:
                  return "[В следующее] dddd, [в] LT";
                case 1:
                case 2:
                case 4:
                  return "[В следующий] dddd, [в] LT";
                case 3:
                case 5:
                case 6:
                  return "[В следующую] dddd, [в] LT";
              }
            } else {
              if (this.day() === 2) {
                return "[Во] dddd, [в] LT";
              } else {
                return "[В] dddd, [в] LT";
              }
            }
          },
          lastWeek: function(now2) {
            if (now2.week() !== this.week()) {
              switch (this.day()) {
                case 0:
                  return "[В прошлое] dddd, [в] LT";
                case 1:
                case 2:
                case 4:
                  return "[В прошлый] dddd, [в] LT";
                case 3:
                case 5:
                case 6:
                  return "[В прошлую] dddd, [в] LT";
              }
            } else {
              if (this.day() === 2) {
                return "[Во] dddd, [в] LT";
              } else {
                return "[В] dddd, [в] LT";
              }
            }
          },
          sameElse: "L"
        },
        relativeTime: {
          future: "через %s",
          past: "%s назад",
          s: "несколько секунд",
          ss: relativeTimeWithPlural$3,
          m: relativeTimeWithPlural$3,
          mm: relativeTimeWithPlural$3,
          h: "час",
          hh: relativeTimeWithPlural$3,
          d: "день",
          dd: relativeTimeWithPlural$3,
          w: "неделя",
          ww: relativeTimeWithPlural$3,
          M: "месяц",
          MM: relativeTimeWithPlural$3,
          y: "год",
          yy: relativeTimeWithPlural$3
        },
        meridiemParse: /ночи|утра|дня|вечера/i,
        isPM: function(input) {
          return /^(дня|вечера)$/.test(input);
        },
        meridiem: function(hour, minute, isLower) {
          if (hour < 4) {
            return "ночи";
          } else if (hour < 12) {
            return "утра";
          } else if (hour < 17) {
            return "дня";
          } else {
            return "вечера";
          }
        },
        dayOfMonthOrdinalParse: /\d{1,2}-(й|го|я)/,
        ordinal: function(number, period) {
          switch (period) {
            case "M":
            case "d":
            case "DDD":
              return number + "-й";
            case "D":
              return number + "-го";
            case "w":
            case "W":
              return number + "-я";
            default:
              return number;
          }
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var months$9 = [
        "جنوري",
        "فيبروري",
        "مارچ",
        "اپريل",
        "مئي",
        "جون",
        "جولاءِ",
        "آگسٽ",
        "سيپٽمبر",
        "آڪٽوبر",
        "نومبر",
        "ڊسمبر"
      ], days$1 = ["آچر", "سومر", "اڱارو", "اربع", "خميس", "جمع", "ڇنڇر"];
      hooks.defineLocale("sd", {
        months: months$9,
        monthsShort: months$9,
        weekdays: days$1,
        weekdaysShort: days$1,
        weekdaysMin: days$1,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd، D MMMM YYYY HH:mm"
        },
        meridiemParse: /صبح|شام/,
        isPM: function(input) {
          return "شام" === input;
        },
        meridiem: function(hour, minute, isLower) {
          if (hour < 12) {
            return "صبح";
          }
          return "شام";
        },
        calendar: {
          sameDay: "[اڄ] LT",
          nextDay: "[سڀاڻي] LT",
          nextWeek: "dddd [اڳين هفتي تي] LT",
          lastDay: "[ڪالهه] LT",
          lastWeek: "[گزريل هفتي] dddd [تي] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "%s پوء",
          past: "%s اڳ",
          s: "چند سيڪنڊ",
          ss: "%d سيڪنڊ",
          m: "هڪ منٽ",
          mm: "%d منٽ",
          h: "هڪ ڪلاڪ",
          hh: "%d ڪلاڪ",
          d: "هڪ ڏينهن",
          dd: "%d ڏينهن",
          M: "هڪ مهينو",
          MM: "%d مهينا",
          y: "هڪ سال",
          yy: "%d سال"
        },
        preparse: function(string) {
          return string.replace(/،/g, ",");
        },
        postformat: function(string) {
          return string.replace(/,/g, "،");
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("se", {
        months: "ođđajagemánnu_guovvamánnu_njukčamánnu_cuoŋománnu_miessemánnu_geassemánnu_suoidnemánnu_borgemánnu_čakčamánnu_golggotmánnu_skábmamánnu_juovlamánnu".split(
          "_"
        ),
        monthsShort: "ođđj_guov_njuk_cuo_mies_geas_suoi_borg_čakč_golg_skáb_juov".split("_"),
        weekdays: "sotnabeaivi_vuossárga_maŋŋebárga_gaskavahkku_duorastat_bearjadat_lávvardat".split(
          "_"
        ),
        weekdaysShort: "sotn_vuos_maŋ_gask_duor_bear_láv".split("_"),
        weekdaysMin: "s_v_m_g_d_b_L".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD.MM.YYYY",
          LL: "MMMM D. [b.] YYYY",
          LLL: "MMMM D. [b.] YYYY [ti.] HH:mm",
          LLLL: "dddd, MMMM D. [b.] YYYY [ti.] HH:mm"
        },
        calendar: {
          sameDay: "[otne ti] LT",
          nextDay: "[ihttin ti] LT",
          nextWeek: "dddd [ti] LT",
          lastDay: "[ikte ti] LT",
          lastWeek: "[ovddit] dddd [ti] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "%s geažes",
          past: "maŋit %s",
          s: "moadde sekunddat",
          ss: "%d sekunddat",
          m: "okta minuhta",
          mm: "%d minuhtat",
          h: "okta diimmu",
          hh: "%d diimmut",
          d: "okta beaivi",
          dd: "%d beaivvit",
          M: "okta mánnu",
          MM: "%d mánut",
          y: "okta jahki",
          yy: "%d jagit"
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal: "%d.",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("si", {
        months: "ජනවාරි_පෙබරවාරි_මාර්තු_අප්‍රේල්_මැයි_ජූනි_ජූලි_අගෝස්තු_සැප්තැම්බර්_ඔක්තෝබර්_නොවැම්බර්_දෙසැම්බර්".split(
          "_"
        ),
        monthsShort: "ජන_පෙබ_මාර්_අප්_මැයි_ජූනි_ජූලි_අගෝ_සැප්_ඔක්_නොවැ_දෙසැ".split(
          "_"
        ),
        weekdays: "ඉරිදා_සඳුදා_අඟහරුවාදා_බදාදා_බ්‍රහස්පතින්දා_සිකුරාදා_සෙනසුරාදා".split(
          "_"
        ),
        weekdaysShort: "ඉරි_සඳු_අඟ_බදා_බ්‍රහ_සිකු_සෙන".split("_"),
        weekdaysMin: "ඉ_ස_අ_බ_බ්‍ර_සි_සෙ".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "a h:mm",
          LTS: "a h:mm:ss",
          L: "YYYY/MM/DD",
          LL: "YYYY MMMM D",
          LLL: "YYYY MMMM D, a h:mm",
          LLLL: "YYYY MMMM D [වැනි] dddd, a h:mm:ss"
        },
        calendar: {
          sameDay: "[අද] LT[ට]",
          nextDay: "[හෙට] LT[ට]",
          nextWeek: "dddd LT[ට]",
          lastDay: "[ඊයේ] LT[ට]",
          lastWeek: "[පසුගිය] dddd LT[ට]",
          sameElse: "L"
        },
        relativeTime: {
          future: "%sකින්",
          past: "%sකට පෙර",
          s: "තත්පර කිහිපය",
          ss: "තත්පර %d",
          m: "මිනිත්තුව",
          mm: "මිනිත්තු %d",
          h: "පැය",
          hh: "පැය %d",
          d: "දිනය",
          dd: "දින %d",
          M: "මාසය",
          MM: "මාස %d",
          y: "වසර",
          yy: "වසර %d"
        },
        dayOfMonthOrdinalParse: /\d{1,2} වැනි/,
        ordinal: function(number) {
          return number + " වැනි";
        },
        meridiemParse: /පෙර වරු|පස් වරු|පෙ.ව|ප.ව./,
        isPM: function(input) {
          return input === "ප.ව." || input === "පස් වරු";
        },
        meridiem: function(hours2, minutes2, isLower) {
          if (hours2 > 11) {
            return isLower ? "ප.ව." : "පස් වරු";
          } else {
            return isLower ? "පෙ.ව." : "පෙර වරු";
          }
        }
      });
      //! moment.js locale configuration
      var months$a = "január_február_marec_apríl_máj_jún_júl_august_september_október_november_december".split(
        "_"
      ), monthsShort$7 = "jan_feb_mar_apr_máj_jún_júl_aug_sep_okt_nov_dec".split("_");
      function plural$5(n) {
        return n > 1 && n < 5;
      }
      function translate$9(number, withoutSuffix, key, isFuture) {
        var result = number + " ";
        switch (key) {
          case "s":
            return withoutSuffix || isFuture ? "pár sekúnd" : "pár sekundami";
          case "ss":
            if (withoutSuffix || isFuture) {
              return result + (plural$5(number) ? "sekundy" : "sekúnd");
            } else {
              return result + "sekundami";
            }
          case "m":
            return withoutSuffix ? "minúta" : isFuture ? "minútu" : "minútou";
          case "mm":
            if (withoutSuffix || isFuture) {
              return result + (plural$5(number) ? "minúty" : "minút");
            } else {
              return result + "minútami";
            }
          case "h":
            return withoutSuffix ? "hodina" : isFuture ? "hodinu" : "hodinou";
          case "hh":
            if (withoutSuffix || isFuture) {
              return result + (plural$5(number) ? "hodiny" : "hodín");
            } else {
              return result + "hodinami";
            }
          case "d":
            return withoutSuffix || isFuture ? "deň" : "dňom";
          case "dd":
            if (withoutSuffix || isFuture) {
              return result + (plural$5(number) ? "dni" : "dní");
            } else {
              return result + "dňami";
            }
          case "M":
            return withoutSuffix || isFuture ? "mesiac" : "mesiacom";
          case "MM":
            if (withoutSuffix || isFuture) {
              return result + (plural$5(number) ? "mesiace" : "mesiacov");
            } else {
              return result + "mesiacmi";
            }
          case "y":
            return withoutSuffix || isFuture ? "rok" : "rokom";
          case "yy":
            if (withoutSuffix || isFuture) {
              return result + (plural$5(number) ? "roky" : "rokov");
            } else {
              return result + "rokmi";
            }
        }
      }
      hooks.defineLocale("sk", {
        months: months$a,
        monthsShort: monthsShort$7,
        weekdays: "nedeľa_pondelok_utorok_streda_štvrtok_piatok_sobota".split("_"),
        weekdaysShort: "ne_po_ut_st_št_pi_so".split("_"),
        weekdaysMin: "ne_po_ut_st_št_pi_so".split("_"),
        longDateFormat: {
          LT: "H:mm",
          LTS: "H:mm:ss",
          L: "DD.MM.YYYY",
          LL: "D. MMMM YYYY",
          LLL: "D. MMMM YYYY H:mm",
          LLLL: "dddd D. MMMM YYYY H:mm"
        },
        calendar: {
          sameDay: "[dnes o] LT",
          nextDay: "[zajtra o] LT",
          nextWeek: function() {
            switch (this.day()) {
              case 0:
                return "[v nedeľu o] LT";
              case 1:
              case 2:
                return "[v] dddd [o] LT";
              case 3:
                return "[v stredu o] LT";
              case 4:
                return "[vo štvrtok o] LT";
              case 5:
                return "[v piatok o] LT";
              case 6:
                return "[v sobotu o] LT";
            }
          },
          lastDay: "[včera o] LT",
          lastWeek: function() {
            switch (this.day()) {
              case 0:
                return "[minulú nedeľu o] LT";
              case 1:
              case 2:
                return "[minulý] dddd [o] LT";
              case 3:
                return "[minulú stredu o] LT";
              case 4:
              case 5:
                return "[minulý] dddd [o] LT";
              case 6:
                return "[minulú sobotu o] LT";
            }
          },
          sameElse: "L"
        },
        relativeTime: {
          future: "za %s",
          past: "pred %s",
          s: translate$9,
          ss: translate$9,
          m: translate$9,
          mm: translate$9,
          h: translate$9,
          hh: translate$9,
          d: translate$9,
          dd: translate$9,
          M: translate$9,
          MM: translate$9,
          y: translate$9,
          yy: translate$9
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal: "%d.",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      function processRelativeTime$9(number, withoutSuffix, key, isFuture) {
        var result = number + " ";
        switch (key) {
          case "s":
            return withoutSuffix || isFuture ? "nekaj sekund" : "nekaj sekundami";
          case "ss":
            if (number === 1) {
              result += withoutSuffix ? "sekundo" : "sekundi";
            } else if (number === 2) {
              result += withoutSuffix || isFuture ? "sekundi" : "sekundah";
            } else if (number < 5) {
              result += withoutSuffix || isFuture ? "sekunde" : "sekundah";
            } else {
              result += "sekund";
            }
            return result;
          case "m":
            return withoutSuffix ? "ena minuta" : "eno minuto";
          case "mm":
            if (number === 1) {
              result += withoutSuffix ? "minuta" : "minuto";
            } else if (number === 2) {
              result += withoutSuffix || isFuture ? "minuti" : "minutama";
            } else if (number < 5) {
              result += withoutSuffix || isFuture ? "minute" : "minutami";
            } else {
              result += withoutSuffix || isFuture ? "minut" : "minutami";
            }
            return result;
          case "h":
            return withoutSuffix ? "ena ura" : "eno uro";
          case "hh":
            if (number === 1) {
              result += withoutSuffix ? "ura" : "uro";
            } else if (number === 2) {
              result += withoutSuffix || isFuture ? "uri" : "urama";
            } else if (number < 5) {
              result += withoutSuffix || isFuture ? "ure" : "urami";
            } else {
              result += withoutSuffix || isFuture ? "ur" : "urami";
            }
            return result;
          case "d":
            return withoutSuffix || isFuture ? "en dan" : "enim dnem";
          case "dd":
            if (number === 1) {
              result += withoutSuffix || isFuture ? "dan" : "dnem";
            } else if (number === 2) {
              result += withoutSuffix || isFuture ? "dni" : "dnevoma";
            } else {
              result += withoutSuffix || isFuture ? "dni" : "dnevi";
            }
            return result;
          case "M":
            return withoutSuffix || isFuture ? "en mesec" : "enim mesecem";
          case "MM":
            if (number === 1) {
              result += withoutSuffix || isFuture ? "mesec" : "mesecem";
            } else if (number === 2) {
              result += withoutSuffix || isFuture ? "meseca" : "mesecema";
            } else if (number < 5) {
              result += withoutSuffix || isFuture ? "mesece" : "meseci";
            } else {
              result += withoutSuffix || isFuture ? "mesecev" : "meseci";
            }
            return result;
          case "y":
            return withoutSuffix || isFuture ? "eno leto" : "enim letom";
          case "yy":
            if (number === 1) {
              result += withoutSuffix || isFuture ? "leto" : "letom";
            } else if (number === 2) {
              result += withoutSuffix || isFuture ? "leti" : "letoma";
            } else if (number < 5) {
              result += withoutSuffix || isFuture ? "leta" : "leti";
            } else {
              result += withoutSuffix || isFuture ? "let" : "leti";
            }
            return result;
        }
      }
      hooks.defineLocale("sl", {
        months: "januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december".split(
          "_"
        ),
        monthsShort: "jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.".split(
          "_"
        ),
        monthsParseExact: true,
        weekdays: "nedelja_ponedeljek_torek_sreda_četrtek_petek_sobota".split("_"),
        weekdaysShort: "ned._pon._tor._sre._čet._pet._sob.".split("_"),
        weekdaysMin: "ne_po_to_sr_če_pe_so".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "H:mm",
          LTS: "H:mm:ss",
          L: "DD. MM. YYYY",
          LL: "D. MMMM YYYY",
          LLL: "D. MMMM YYYY H:mm",
          LLLL: "dddd, D. MMMM YYYY H:mm"
        },
        calendar: {
          sameDay: "[danes ob] LT",
          nextDay: "[jutri ob] LT",
          nextWeek: function() {
            switch (this.day()) {
              case 0:
                return "[v] [nedeljo] [ob] LT";
              case 3:
                return "[v] [sredo] [ob] LT";
              case 6:
                return "[v] [soboto] [ob] LT";
              case 1:
              case 2:
              case 4:
              case 5:
                return "[v] dddd [ob] LT";
            }
          },
          lastDay: "[včeraj ob] LT",
          lastWeek: function() {
            switch (this.day()) {
              case 0:
                return "[prejšnjo] [nedeljo] [ob] LT";
              case 3:
                return "[prejšnjo] [sredo] [ob] LT";
              case 6:
                return "[prejšnjo] [soboto] [ob] LT";
              case 1:
              case 2:
              case 4:
              case 5:
                return "[prejšnji] dddd [ob] LT";
            }
          },
          sameElse: "L"
        },
        relativeTime: {
          future: "čez %s",
          past: "pred %s",
          s: processRelativeTime$9,
          ss: processRelativeTime$9,
          m: processRelativeTime$9,
          mm: processRelativeTime$9,
          h: processRelativeTime$9,
          hh: processRelativeTime$9,
          d: processRelativeTime$9,
          dd: processRelativeTime$9,
          M: processRelativeTime$9,
          MM: processRelativeTime$9,
          y: processRelativeTime$9,
          yy: processRelativeTime$9
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal: "%d.",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 7
          // The week that contains Jan 7th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("sq", {
        months: "Janar_Shkurt_Mars_Prill_Maj_Qershor_Korrik_Gusht_Shtator_Tetor_Nëntor_Dhjetor".split(
          "_"
        ),
        monthsShort: "Jan_Shk_Mar_Pri_Maj_Qer_Kor_Gus_Sht_Tet_Nën_Dhj".split("_"),
        weekdays: "E Diel_E Hënë_E Martë_E Mërkurë_E Enjte_E Premte_E Shtunë".split(
          "_"
        ),
        weekdaysShort: "Die_Hën_Mar_Mër_Enj_Pre_Sht".split("_"),
        weekdaysMin: "D_H_Ma_Më_E_P_Sh".split("_"),
        weekdaysParseExact: true,
        meridiemParse: /PD|MD/,
        isPM: function(input) {
          return input.charAt(0) === "M";
        },
        meridiem: function(hours2, minutes2, isLower) {
          return hours2 < 12 ? "PD" : "MD";
        },
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd, D MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[Sot në] LT",
          nextDay: "[Nesër në] LT",
          nextWeek: "dddd [në] LT",
          lastDay: "[Dje në] LT",
          lastWeek: "dddd [e kaluar në] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "në %s",
          past: "%s më parë",
          s: "disa sekonda",
          ss: "%d sekonda",
          m: "një minutë",
          mm: "%d minuta",
          h: "një orë",
          hh: "%d orë",
          d: "një ditë",
          dd: "%d ditë",
          M: "një muaj",
          MM: "%d muaj",
          y: "një vit",
          yy: "%d vite"
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal: "%d.",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var translator$1 = {
        words: {
          //Different grammatical cases
          ss: ["секунда", "секунде", "секунди"],
          m: ["један минут", "једног минута"],
          mm: ["минут", "минута", "минута"],
          h: ["један сат", "једног сата"],
          hh: ["сат", "сата", "сати"],
          d: ["један дан", "једног дана"],
          dd: ["дан", "дана", "дана"],
          M: ["један месец", "једног месеца"],
          MM: ["месец", "месеца", "месеци"],
          y: ["једну годину", "једне године"],
          yy: ["годину", "године", "година"]
        },
        correctGrammaticalCase: function(number, wordKey) {
          if (number % 10 >= 1 && number % 10 <= 4 && (number % 100 < 10 || number % 100 >= 20)) {
            return number % 10 === 1 ? wordKey[0] : wordKey[1];
          }
          return wordKey[2];
        },
        translate: function(number, withoutSuffix, key, isFuture) {
          var wordKey = translator$1.words[key], word;
          if (key.length === 1) {
            if (key === "y" && withoutSuffix) return "једна година";
            return isFuture || withoutSuffix ? wordKey[0] : wordKey[1];
          }
          word = translator$1.correctGrammaticalCase(number, wordKey);
          if (key === "yy" && withoutSuffix && word === "годину") {
            return number + " година";
          }
          return number + " " + word;
        }
      };
      hooks.defineLocale("sr-cyrl", {
        months: "јануар_фебруар_март_април_мај_јун_јул_август_септембар_октобар_новембар_децембар".split(
          "_"
        ),
        monthsShort: "јан._феб._мар._апр._мај_јун_јул_авг._сеп._окт._нов._дец.".split("_"),
        monthsParseExact: true,
        weekdays: "недеља_понедељак_уторак_среда_четвртак_петак_субота".split("_"),
        weekdaysShort: "нед._пон._уто._сре._чет._пет._суб.".split("_"),
        weekdaysMin: "не_по_ут_ср_че_пе_су".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "H:mm",
          LTS: "H:mm:ss",
          L: "D. M. YYYY.",
          LL: "D. MMMM YYYY.",
          LLL: "D. MMMM YYYY. H:mm",
          LLLL: "dddd, D. MMMM YYYY. H:mm"
        },
        calendar: {
          sameDay: "[данас у] LT",
          nextDay: "[сутра у] LT",
          nextWeek: function() {
            switch (this.day()) {
              case 0:
                return "[у] [недељу] [у] LT";
              case 3:
                return "[у] [среду] [у] LT";
              case 6:
                return "[у] [суботу] [у] LT";
              case 1:
              case 2:
              case 4:
              case 5:
                return "[у] dddd [у] LT";
            }
          },
          lastDay: "[јуче у] LT",
          lastWeek: function() {
            var lastWeekDays = [
              "[прошле] [недеље] [у] LT",
              "[прошлог] [понедељка] [у] LT",
              "[прошлог] [уторка] [у] LT",
              "[прошле] [среде] [у] LT",
              "[прошлог] [четвртка] [у] LT",
              "[прошлог] [петка] [у] LT",
              "[прошле] [суботе] [у] LT"
            ];
            return lastWeekDays[this.day()];
          },
          sameElse: "L"
        },
        relativeTime: {
          future: "за %s",
          past: "пре %s",
          s: "неколико секунди",
          ss: translator$1.translate,
          m: translator$1.translate,
          mm: translator$1.translate,
          h: translator$1.translate,
          hh: translator$1.translate,
          d: translator$1.translate,
          dd: translator$1.translate,
          M: translator$1.translate,
          MM: translator$1.translate,
          y: translator$1.translate,
          yy: translator$1.translate
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal: "%d.",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 7
          // The week that contains Jan 1st is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var translator$2 = {
        words: {
          //Different grammatical cases
          ss: ["sekunda", "sekunde", "sekundi"],
          m: ["jedan minut", "jednog minuta"],
          mm: ["minut", "minuta", "minuta"],
          h: ["jedan sat", "jednog sata"],
          hh: ["sat", "sata", "sati"],
          d: ["jedan dan", "jednog dana"],
          dd: ["dan", "dana", "dana"],
          M: ["jedan mesec", "jednog meseca"],
          MM: ["mesec", "meseca", "meseci"],
          y: ["jednu godinu", "jedne godine"],
          yy: ["godinu", "godine", "godina"]
        },
        correctGrammaticalCase: function(number, wordKey) {
          if (number % 10 >= 1 && number % 10 <= 4 && (number % 100 < 10 || number % 100 >= 20)) {
            return number % 10 === 1 ? wordKey[0] : wordKey[1];
          }
          return wordKey[2];
        },
        translate: function(number, withoutSuffix, key, isFuture) {
          var wordKey = translator$2.words[key], word;
          if (key.length === 1) {
            if (key === "y" && withoutSuffix) return "jedna godina";
            return isFuture || withoutSuffix ? wordKey[0] : wordKey[1];
          }
          word = translator$2.correctGrammaticalCase(number, wordKey);
          if (key === "yy" && withoutSuffix && word === "godinu") {
            return number + " godina";
          }
          return number + " " + word;
        }
      };
      hooks.defineLocale("sr", {
        months: "januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar".split(
          "_"
        ),
        monthsShort: "jan._feb._mar._apr._maj_jun_jul_avg._sep._okt._nov._dec.".split("_"),
        monthsParseExact: true,
        weekdays: "nedelja_ponedeljak_utorak_sreda_četvrtak_petak_subota".split(
          "_"
        ),
        weekdaysShort: "ned._pon._uto._sre._čet._pet._sub.".split("_"),
        weekdaysMin: "ne_po_ut_sr_če_pe_su".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "H:mm",
          LTS: "H:mm:ss",
          L: "D. M. YYYY.",
          LL: "D. MMMM YYYY.",
          LLL: "D. MMMM YYYY. H:mm",
          LLLL: "dddd, D. MMMM YYYY. H:mm"
        },
        calendar: {
          sameDay: "[danas u] LT",
          nextDay: "[sutra u] LT",
          nextWeek: function() {
            switch (this.day()) {
              case 0:
                return "[u] [nedelju] [u] LT";
              case 3:
                return "[u] [sredu] [u] LT";
              case 6:
                return "[u] [subotu] [u] LT";
              case 1:
              case 2:
              case 4:
              case 5:
                return "[u] dddd [u] LT";
            }
          },
          lastDay: "[juče u] LT",
          lastWeek: function() {
            var lastWeekDays = [
              "[prošle] [nedelje] [u] LT",
              "[prošlog] [ponedeljka] [u] LT",
              "[prošlog] [utorka] [u] LT",
              "[prošle] [srede] [u] LT",
              "[prošlog] [četvrtka] [u] LT",
              "[prošlog] [petka] [u] LT",
              "[prošle] [subote] [u] LT"
            ];
            return lastWeekDays[this.day()];
          },
          sameElse: "L"
        },
        relativeTime: {
          future: "za %s",
          past: "pre %s",
          s: "nekoliko sekundi",
          ss: translator$2.translate,
          m: translator$2.translate,
          mm: translator$2.translate,
          h: translator$2.translate,
          hh: translator$2.translate,
          d: translator$2.translate,
          dd: translator$2.translate,
          M: translator$2.translate,
          MM: translator$2.translate,
          y: translator$2.translate,
          yy: translator$2.translate
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal: "%d.",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 7
          // The week that contains Jan 7th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("ss", {
        months: "Bhimbidvwane_Indlovana_Indlov'lenkhulu_Mabasa_Inkhwekhweti_Inhlaba_Kholwane_Ingci_Inyoni_Imphala_Lweti_Ingongoni".split(
          "_"
        ),
        monthsShort: "Bhi_Ina_Inu_Mab_Ink_Inh_Kho_Igc_Iny_Imp_Lwe_Igo".split("_"),
        weekdays: "Lisontfo_Umsombuluko_Lesibili_Lesitsatfu_Lesine_Lesihlanu_Umgcibelo".split(
          "_"
        ),
        weekdaysShort: "Lis_Umb_Lsb_Les_Lsi_Lsh_Umg".split("_"),
        weekdaysMin: "Li_Us_Lb_Lt_Ls_Lh_Ug".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "h:mm A",
          LTS: "h:mm:ss A",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY h:mm A",
          LLLL: "dddd, D MMMM YYYY h:mm A"
        },
        calendar: {
          sameDay: "[Namuhla nga] LT",
          nextDay: "[Kusasa nga] LT",
          nextWeek: "dddd [nga] LT",
          lastDay: "[Itolo nga] LT",
          lastWeek: "dddd [leliphelile] [nga] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "nga %s",
          past: "wenteka nga %s",
          s: "emizuzwana lomcane",
          ss: "%d mzuzwana",
          m: "umzuzu",
          mm: "%d emizuzu",
          h: "lihora",
          hh: "%d emahora",
          d: "lilanga",
          dd: "%d emalanga",
          M: "inyanga",
          MM: "%d tinyanga",
          y: "umnyaka",
          yy: "%d iminyaka"
        },
        meridiemParse: /ekuseni|emini|entsambama|ebusuku/,
        meridiem: function(hours2, minutes2, isLower) {
          if (hours2 < 11) {
            return "ekuseni";
          } else if (hours2 < 15) {
            return "emini";
          } else if (hours2 < 19) {
            return "entsambama";
          } else {
            return "ebusuku";
          }
        },
        meridiemHour: function(hour, meridiem2) {
          if (hour === 12) {
            hour = 0;
          }
          if (meridiem2 === "ekuseni") {
            return hour;
          } else if (meridiem2 === "emini") {
            return hour >= 11 ? hour : hour + 12;
          } else if (meridiem2 === "entsambama" || meridiem2 === "ebusuku") {
            if (hour === 0) {
              return 0;
            }
            return hour + 12;
          }
        },
        dayOfMonthOrdinalParse: /\d{1,2}/,
        ordinal: "%d",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("sv", {
        months: "januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december".split(
          "_"
        ),
        monthsShort: "jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),
        weekdays: "söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag".split("_"),
        weekdaysShort: "sön_mån_tis_ons_tor_fre_lör".split("_"),
        weekdaysMin: "sö_må_ti_on_to_fr_lö".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "YYYY-MM-DD",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY [kl.] HH:mm",
          LLLL: "dddd D MMMM YYYY [kl.] HH:mm",
          lll: "D MMM YYYY HH:mm",
          llll: "ddd D MMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[Idag] LT",
          nextDay: "[Imorgon] LT",
          lastDay: "[Igår] LT",
          nextWeek: "[På] dddd LT",
          lastWeek: "[I] dddd[s] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "om %s",
          past: "för %s sedan",
          s: "några sekunder",
          ss: "%d sekunder",
          m: "en minut",
          mm: "%d minuter",
          h: "en timme",
          hh: "%d timmar",
          d: "en dag",
          dd: "%d dagar",
          M: "en månad",
          MM: "%d månader",
          y: "ett år",
          yy: "%d år"
        },
        dayOfMonthOrdinalParse: /\d{1,2}(\:e|\:a)/,
        ordinal: function(number) {
          var b = number % 10, output = ~~(number % 100 / 10) === 1 ? ":e" : b === 1 ? ":a" : b === 2 ? ":a" : b === 3 ? ":e" : ":e";
          return number + output;
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("sw", {
        months: "Januari_Februari_Machi_Aprili_Mei_Juni_Julai_Agosti_Septemba_Oktoba_Novemba_Desemba".split(
          "_"
        ),
        monthsShort: "Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ago_Sep_Okt_Nov_Des".split("_"),
        weekdays: "Jumapili_Jumatatu_Jumanne_Jumatano_Alhamisi_Ijumaa_Jumamosi".split(
          "_"
        ),
        weekdaysShort: "Jpl_Jtat_Jnne_Jtan_Alh_Ijm_Jmos".split("_"),
        weekdaysMin: "J2_J3_J4_J5_Al_Ij_J1".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "hh:mm A",
          LTS: "HH:mm:ss",
          L: "DD.MM.YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd, D MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[leo saa] LT",
          nextDay: "[kesho saa] LT",
          nextWeek: "[wiki ijayo] dddd [saat] LT",
          lastDay: "[jana] LT",
          lastWeek: "[wiki iliyopita] dddd [saat] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "%s baadaye",
          past: "tokea %s",
          s: "hivi punde",
          ss: "sekunde %d",
          m: "dakika moja",
          mm: "dakika %d",
          h: "saa limoja",
          hh: "masaa %d",
          d: "siku moja",
          dd: "siku %d",
          M: "mwezi mmoja",
          MM: "miezi %d",
          y: "mwaka mmoja",
          yy: "miaka %d"
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 7
          // The week that contains Jan 7th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var symbolMap$h = {
        1: "௧",
        2: "௨",
        3: "௩",
        4: "௪",
        5: "௫",
        6: "௬",
        7: "௭",
        8: "௮",
        9: "௯",
        0: "௦"
      }, numberMap$g = {
        "௧": "1",
        "௨": "2",
        "௩": "3",
        "௪": "4",
        "௫": "5",
        "௬": "6",
        "௭": "7",
        "௮": "8",
        "௯": "9",
        "௦": "0"
      };
      hooks.defineLocale("ta", {
        months: "ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்".split(
          "_"
        ),
        monthsShort: "ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்".split(
          "_"
        ),
        weekdays: "ஞாயிற்றுக்கிழமை_திங்கட்கிழமை_செவ்வாய்கிழமை_புதன்கிழமை_வியாழக்கிழமை_வெள்ளிக்கிழமை_சனிக்கிழமை".split(
          "_"
        ),
        weekdaysShort: "ஞாயிறு_திங்கள்_செவ்வாய்_புதன்_வியாழன்_வெள்ளி_சனி".split(
          "_"
        ),
        weekdaysMin: "ஞா_தி_செ_பு_வி_வெ_ச".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY, HH:mm",
          LLLL: "dddd, D MMMM YYYY, HH:mm"
        },
        calendar: {
          sameDay: "[இன்று] LT",
          nextDay: "[நாளை] LT",
          nextWeek: "dddd, LT",
          lastDay: "[நேற்று] LT",
          lastWeek: "[கடந்த வாரம்] dddd, LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "%s இல்",
          past: "%s முன்",
          s: "ஒரு சில விநாடிகள்",
          ss: "%d விநாடிகள்",
          m: "ஒரு நிமிடம்",
          mm: "%d நிமிடங்கள்",
          h: "ஒரு மணி நேரம்",
          hh: "%d மணி நேரம்",
          d: "ஒரு நாள்",
          dd: "%d நாட்கள்",
          M: "ஒரு மாதம்",
          MM: "%d மாதங்கள்",
          y: "ஒரு வருடம்",
          yy: "%d ஆண்டுகள்"
        },
        dayOfMonthOrdinalParse: /\d{1,2}வது/,
        ordinal: function(number) {
          return number + "வது";
        },
        preparse: function(string) {
          return string.replace(/[௧௨௩௪௫௬௭௮௯௦]/g, function(match) {
            return numberMap$g[match];
          });
        },
        postformat: function(string) {
          return string.replace(/\d/g, function(match) {
            return symbolMap$h[match];
          });
        },
        // refer http://ta.wikipedia.org/s/1er1
        meridiemParse: /யாமம்|வைகறை|காலை|நண்பகல்|எற்பாடு|மாலை/,
        meridiem: function(hour, minute, isLower) {
          if (hour < 2) {
            return " யாமம்";
          } else if (hour < 6) {
            return " வைகறை";
          } else if (hour < 10) {
            return " காலை";
          } else if (hour < 14) {
            return " நண்பகல்";
          } else if (hour < 18) {
            return " எற்பாடு";
          } else if (hour < 22) {
            return " மாலை";
          } else {
            return " யாமம்";
          }
        },
        meridiemHour: function(hour, meridiem2) {
          if (hour === 12) {
            hour = 0;
          }
          if (meridiem2 === "யாமம்") {
            return hour < 2 ? hour : hour + 12;
          } else if (meridiem2 === "வைகறை" || meridiem2 === "காலை") {
            return hour;
          } else if (meridiem2 === "நண்பகல்") {
            return hour >= 10 ? hour : hour + 12;
          } else {
            return hour + 12;
          }
        },
        week: {
          dow: 0,
          // Sunday is the first day of the week.
          doy: 6
          // The week that contains Jan 6th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("te", {
        months: "జనవరి_ఫిబ్రవరి_మార్చి_ఏప్రిల్_మే_జూన్_జులై_ఆగస్టు_సెప్టెంబర్_అక్టోబర్_నవంబర్_డిసెంబర్".split(
          "_"
        ),
        monthsShort: "జన._ఫిబ్ర._మార్చి_ఏప్రి._మే_జూన్_జులై_ఆగ._సెప్._అక్టో._నవ._డిసె.".split(
          "_"
        ),
        monthsParseExact: true,
        weekdays: "ఆదివారం_సోమవారం_మంగళవారం_బుధవారం_గురువారం_శుక్రవారం_శనివారం".split(
          "_"
        ),
        weekdaysShort: "ఆది_సోమ_మంగళ_బుధ_గురు_శుక్ర_శని".split("_"),
        weekdaysMin: "ఆ_సో_మం_బు_గు_శు_శ".split("_"),
        longDateFormat: {
          LT: "A h:mm",
          LTS: "A h:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY, A h:mm",
          LLLL: "dddd, D MMMM YYYY, A h:mm"
        },
        calendar: {
          sameDay: "[నేడు] LT",
          nextDay: "[రేపు] LT",
          nextWeek: "dddd, LT",
          lastDay: "[నిన్న] LT",
          lastWeek: "[గత] dddd, LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "%s లో",
          past: "%s క్రితం",
          s: "కొన్ని క్షణాలు",
          ss: "%d సెకన్లు",
          m: "ఒక నిమిషం",
          mm: "%d నిమిషాలు",
          h: "ఒక గంట",
          hh: "%d గంటలు",
          d: "ఒక రోజు",
          dd: "%d రోజులు",
          M: "ఒక నెల",
          MM: "%d నెలలు",
          y: "ఒక సంవత్సరం",
          yy: "%d సంవత్సరాలు"
        },
        dayOfMonthOrdinalParse: /\d{1,2}వ/,
        ordinal: "%dవ",
        meridiemParse: /రాత్రి|ఉదయం|మధ్యాహ్నం|సాయంత్రం/,
        meridiemHour: function(hour, meridiem2) {
          if (hour === 12) {
            hour = 0;
          }
          if (meridiem2 === "రాత్రి") {
            return hour < 4 ? hour : hour + 12;
          } else if (meridiem2 === "ఉదయం") {
            return hour;
          } else if (meridiem2 === "మధ్యాహ్నం") {
            return hour >= 10 ? hour : hour + 12;
          } else if (meridiem2 === "సాయంత్రం") {
            return hour + 12;
          }
        },
        meridiem: function(hour, minute, isLower) {
          if (hour < 4) {
            return "రాత్రి";
          } else if (hour < 10) {
            return "ఉదయం";
          } else if (hour < 17) {
            return "మధ్యాహ్నం";
          } else if (hour < 20) {
            return "సాయంత్రం";
          } else {
            return "రాత్రి";
          }
        },
        week: {
          dow: 0,
          // Sunday is the first day of the week.
          doy: 6
          // The week that contains Jan 6th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("tet", {
        months: "Janeiru_Fevereiru_Marsu_Abril_Maiu_Juñu_Jullu_Agustu_Setembru_Outubru_Novembru_Dezembru".split(
          "_"
        ),
        monthsShort: "Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split("_"),
        weekdays: "Domingu_Segunda_Tersa_Kuarta_Kinta_Sesta_Sabadu".split("_"),
        weekdaysShort: "Dom_Seg_Ters_Kua_Kint_Sest_Sab".split("_"),
        weekdaysMin: "Do_Seg_Te_Ku_Ki_Ses_Sa".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd, D MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[Ohin iha] LT",
          nextDay: "[Aban iha] LT",
          nextWeek: "dddd [iha] LT",
          lastDay: "[Horiseik iha] LT",
          lastWeek: "dddd [semana kotuk] [iha] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "iha %s",
          past: "%s liuba",
          s: "segundu balun",
          ss: "segundu %d",
          m: "minutu ida",
          mm: "minutu %d",
          h: "oras ida",
          hh: "oras %d",
          d: "loron ida",
          dd: "loron %d",
          M: "fulan ida",
          MM: "fulan %d",
          y: "tinan ida",
          yy: "tinan %d"
        },
        dayOfMonthOrdinalParse: /\d{1,2}(st|nd|rd|th)/,
        ordinal: function(number) {
          var b = number % 10, output = ~~(number % 100 / 10) === 1 ? "th" : b === 1 ? "st" : b === 2 ? "nd" : b === 3 ? "rd" : "th";
          return number + output;
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var suffixes$3 = {
        0: "-ум",
        1: "-ум",
        2: "-юм",
        3: "-юм",
        4: "-ум",
        5: "-ум",
        6: "-ум",
        7: "-ум",
        8: "-ум",
        9: "-ум",
        10: "-ум",
        12: "-ум",
        13: "-ум",
        20: "-ум",
        30: "-юм",
        40: "-ум",
        50: "-ум",
        60: "-ум",
        70: "-ум",
        80: "-ум",
        90: "-ум",
        100: "-ум"
      };
      hooks.defineLocale("tg", {
        months: {
          format: "январи_феврали_марти_апрели_майи_июни_июли_августи_сентябри_октябри_ноябри_декабри".split(
            "_"
          ),
          standalone: "январ_феврал_март_апрел_май_июн_июл_август_сентябр_октябр_ноябр_декабр".split(
            "_"
          )
        },
        monthsShort: "янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек".split("_"),
        weekdays: "якшанбе_душанбе_сешанбе_чоршанбе_панҷшанбе_ҷумъа_шанбе".split(
          "_"
        ),
        weekdaysShort: "яшб_дшб_сшб_чшб_пшб_ҷум_шнб".split("_"),
        weekdaysMin: "яш_дш_сш_чш_пш_ҷм_шб".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD.MM.YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd, D MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[Имрӯз соати] LT",
          nextDay: "[Фардо соати] LT",
          lastDay: "[Дирӯз соати] LT",
          nextWeek: "dddd[и] [ҳафтаи оянда соати] LT",
          lastWeek: "dddd[и] [ҳафтаи гузашта соати] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "баъди %s",
          past: "%s пеш",
          s: "якчанд сония",
          m: "як дақиқа",
          mm: "%d дақиқа",
          h: "як соат",
          hh: "%d соат",
          d: "як рӯз",
          dd: "%d рӯз",
          M: "як моҳ",
          MM: "%d моҳ",
          y: "як сол",
          yy: "%d сол"
        },
        meridiemParse: /шаб|субҳ|рӯз|бегоҳ/,
        meridiemHour: function(hour, meridiem2) {
          if (hour === 12) {
            hour = 0;
          }
          if (meridiem2 === "шаб") {
            return hour < 4 ? hour : hour + 12;
          } else if (meridiem2 === "субҳ") {
            return hour;
          } else if (meridiem2 === "рӯз") {
            return hour >= 11 ? hour : hour + 12;
          } else if (meridiem2 === "бегоҳ") {
            return hour + 12;
          }
        },
        meridiem: function(hour, minute, isLower) {
          if (hour < 4) {
            return "шаб";
          } else if (hour < 11) {
            return "субҳ";
          } else if (hour < 16) {
            return "рӯз";
          } else if (hour < 19) {
            return "бегоҳ";
          } else {
            return "шаб";
          }
        },
        dayOfMonthOrdinalParse: /\d{1,2}-(ум|юм)/,
        ordinal: function(number) {
          var a = number % 10, b = number >= 100 ? 100 : null;
          return number + (suffixes$3[number] || suffixes$3[a] || suffixes$3[b]);
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 7
          // The week that contains Jan 1th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("th", {
        months: "มกราคม_กุมภาพันธ์_มีนาคม_เมษายน_พฤษภาคม_มิถุนายน_กรกฎาคม_สิงหาคม_กันยายน_ตุลาคม_พฤศจิกายน_ธันวาคม".split(
          "_"
        ),
        monthsShort: "ม.ค._ก.พ._มี.ค._เม.ย._พ.ค._มิ.ย._ก.ค._ส.ค._ก.ย._ต.ค._พ.ย._ธ.ค.".split(
          "_"
        ),
        monthsParseExact: true,
        weekdays: "อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์".split("_"),
        weekdaysShort: "อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัส_ศุกร์_เสาร์".split("_"),
        // yes, three characters difference
        weekdaysMin: "อา._จ._อ._พ._พฤ._ศ._ส.".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "H:mm",
          LTS: "H:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY เวลา H:mm",
          LLLL: "วันddddที่ D MMMM YYYY เวลา H:mm"
        },
        meridiemParse: /ก่อนเที่ยง|หลังเที่ยง/,
        isPM: function(input) {
          return input === "หลังเที่ยง";
        },
        meridiem: function(hour, minute, isLower) {
          if (hour < 12) {
            return "ก่อนเที่ยง";
          } else {
            return "หลังเที่ยง";
          }
        },
        calendar: {
          sameDay: "[วันนี้ เวลา] LT",
          nextDay: "[พรุ่งนี้ เวลา] LT",
          nextWeek: "dddd[หน้า เวลา] LT",
          lastDay: "[เมื่อวานนี้ เวลา] LT",
          lastWeek: "[วัน]dddd[ที่แล้ว เวลา] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "อีก %s",
          past: "%sที่แล้ว",
          s: "ไม่กี่วินาที",
          ss: "%d วินาที",
          m: "1 นาที",
          mm: "%d นาที",
          h: "1 ชั่วโมง",
          hh: "%d ชั่วโมง",
          d: "1 วัน",
          dd: "%d วัน",
          w: "1 สัปดาห์",
          ww: "%d สัปดาห์",
          M: "1 เดือน",
          MM: "%d เดือน",
          y: "1 ปี",
          yy: "%d ปี"
        }
      });
      //! moment.js locale configuration
      var suffixes$4 = {
        1: "'inji",
        5: "'inji",
        8: "'inji",
        70: "'inji",
        80: "'inji",
        2: "'nji",
        7: "'nji",
        20: "'nji",
        50: "'nji",
        3: "'ünji",
        4: "'ünji",
        100: "'ünji",
        6: "'njy",
        9: "'unjy",
        10: "'unjy",
        30: "'unjy",
        60: "'ynjy",
        90: "'ynjy"
      };
      hooks.defineLocale("tk", {
        months: "Ýanwar_Fewral_Mart_Aprel_Maý_Iýun_Iýul_Awgust_Sentýabr_Oktýabr_Noýabr_Dekabr".split(
          "_"
        ),
        monthsShort: "Ýan_Few_Mar_Apr_Maý_Iýn_Iýl_Awg_Sen_Okt_Noý_Dek".split("_"),
        weekdays: "Ýekşenbe_Duşenbe_Sişenbe_Çarşenbe_Penşenbe_Anna_Şenbe".split(
          "_"
        ),
        weekdaysShort: "Ýek_Duş_Siş_Çar_Pen_Ann_Şen".split("_"),
        weekdaysMin: "Ýk_Dş_Sş_Çr_Pn_An_Şn".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD.MM.YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd, D MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[bugün sagat] LT",
          nextDay: "[ertir sagat] LT",
          nextWeek: "[indiki] dddd [sagat] LT",
          lastDay: "[düýn] LT",
          lastWeek: "[geçen] dddd [sagat] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "%s soň",
          past: "%s öň",
          s: "birnäçe sekunt",
          m: "bir minut",
          mm: "%d minut",
          h: "bir sagat",
          hh: "%d sagat",
          d: "bir gün",
          dd: "%d gün",
          M: "bir aý",
          MM: "%d aý",
          y: "bir ýyl",
          yy: "%d ýyl"
        },
        ordinal: function(number, period) {
          switch (period) {
            case "d":
            case "D":
            case "Do":
            case "DD":
              return number;
            default:
              if (number === 0) {
                return number + "'unjy";
              }
              var a = number % 10, b = number % 100 - a, c = number >= 100 ? 100 : null;
              return number + (suffixes$4[a] || suffixes$4[b] || suffixes$4[c]);
          }
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 7
          // The week that contains Jan 7th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("tl-ph", {
        months: "Enero_Pebrero_Marso_Abril_Mayo_Hunyo_Hulyo_Agosto_Setyembre_Oktubre_Nobyembre_Disyembre".split(
          "_"
        ),
        monthsShort: "Ene_Peb_Mar_Abr_May_Hun_Hul_Ago_Set_Okt_Nob_Dis".split("_"),
        weekdays: "Linggo_Lunes_Martes_Miyerkules_Huwebes_Biyernes_Sabado".split(
          "_"
        ),
        weekdaysShort: "Lin_Lun_Mar_Miy_Huw_Biy_Sab".split("_"),
        weekdaysMin: "Li_Lu_Ma_Mi_Hu_Bi_Sab".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "MM/D/YYYY",
          LL: "MMMM D, YYYY",
          LLL: "MMMM D, YYYY HH:mm",
          LLLL: "dddd, MMMM DD, YYYY HH:mm"
        },
        calendar: {
          sameDay: "LT [ngayong araw]",
          nextDay: "[Bukas ng] LT",
          nextWeek: "LT [sa susunod na] dddd",
          lastDay: "LT [kahapon]",
          lastWeek: "LT [noong nakaraang] dddd",
          sameElse: "L"
        },
        relativeTime: {
          future: "sa loob ng %s",
          past: "%s ang nakalipas",
          s: "ilang segundo",
          ss: "%d segundo",
          m: "isang minuto",
          mm: "%d minuto",
          h: "isang oras",
          hh: "%d oras",
          d: "isang araw",
          dd: "%d araw",
          M: "isang buwan",
          MM: "%d buwan",
          y: "isang taon",
          yy: "%d taon"
        },
        dayOfMonthOrdinalParse: /\d{1,2}/,
        ordinal: function(number) {
          return number;
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var numbersNouns = "pagh_wa’_cha’_wej_loS_vagh_jav_Soch_chorgh_Hut".split("_");
      function translateFuture(output) {
        var time = output;
        time = output.indexOf("jaj") !== -1 ? time.slice(0, -3) + "leS" : output.indexOf("jar") !== -1 ? time.slice(0, -3) + "waQ" : output.indexOf("DIS") !== -1 ? time.slice(0, -3) + "nem" : time + " pIq";
        return time;
      }
      function translatePast(output) {
        var time = output;
        time = output.indexOf("jaj") !== -1 ? time.slice(0, -3) + "Hu’" : output.indexOf("jar") !== -1 ? time.slice(0, -3) + "wen" : output.indexOf("DIS") !== -1 ? time.slice(0, -3) + "ben" : time + " ret";
        return time;
      }
      function translate$a(number, withoutSuffix, string, isFuture) {
        var numberNoun = numberAsNoun(number);
        switch (string) {
          case "ss":
            return numberNoun + " lup";
          case "mm":
            return numberNoun + " tup";
          case "hh":
            return numberNoun + " rep";
          case "dd":
            return numberNoun + " jaj";
          case "MM":
            return numberNoun + " jar";
          case "yy":
            return numberNoun + " DIS";
        }
      }
      function numberAsNoun(number) {
        var hundred = Math.floor(number % 1e3 / 100), ten = Math.floor(number % 100 / 10), one = number % 10, word = "";
        if (hundred > 0) {
          word += numbersNouns[hundred] + "vatlh";
        }
        if (ten > 0) {
          word += (word !== "" ? " " : "") + numbersNouns[ten] + "maH";
        }
        if (one > 0) {
          word += (word !== "" ? " " : "") + numbersNouns[one];
        }
        return word === "" ? "pagh" : word;
      }
      hooks.defineLocale("tlh", {
        months: "tera’ jar wa’_tera’ jar cha’_tera’ jar wej_tera’ jar loS_tera’ jar vagh_tera’ jar jav_tera’ jar Soch_tera’ jar chorgh_tera’ jar Hut_tera’ jar wa’maH_tera’ jar wa’maH wa’_tera’ jar wa’maH cha’".split(
          "_"
        ),
        monthsShort: "jar wa’_jar cha’_jar wej_jar loS_jar vagh_jar jav_jar Soch_jar chorgh_jar Hut_jar wa’maH_jar wa’maH wa’_jar wa’maH cha’".split(
          "_"
        ),
        monthsParseExact: true,
        weekdays: "lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj".split(
          "_"
        ),
        weekdaysShort: "lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj".split("_"),
        weekdaysMin: "lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD.MM.YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd, D MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[DaHjaj] LT",
          nextDay: "[wa’leS] LT",
          nextWeek: "LLL",
          lastDay: "[wa’Hu’] LT",
          lastWeek: "LLL",
          sameElse: "L"
        },
        relativeTime: {
          future: translateFuture,
          past: translatePast,
          s: "puS lup",
          ss: translate$a,
          m: "wa’ tup",
          mm: translate$a,
          h: "wa’ rep",
          hh: translate$a,
          d: "wa’ jaj",
          dd: translate$a,
          M: "wa’ jar",
          MM: translate$a,
          y: "wa’ DIS",
          yy: translate$a
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal: "%d.",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var suffixes$5 = {
        1: "'inci",
        5: "'inci",
        8: "'inci",
        70: "'inci",
        80: "'inci",
        2: "'nci",
        7: "'nci",
        20: "'nci",
        50: "'nci",
        3: "'üncü",
        4: "'üncü",
        100: "'üncü",
        6: "'ncı",
        9: "'uncu",
        10: "'uncu",
        30: "'uncu",
        60: "'ıncı",
        90: "'ıncı"
      };
      hooks.defineLocale("tr", {
        months: "Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık".split(
          "_"
        ),
        monthsShort: "Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara".split("_"),
        weekdays: "Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi".split(
          "_"
        ),
        weekdaysShort: "Paz_Pzt_Sal_Çar_Per_Cum_Cmt".split("_"),
        weekdaysMin: "Pz_Pt_Sa_Ça_Pe_Cu_Ct".split("_"),
        meridiem: function(hours2, minutes2, isLower) {
          if (hours2 < 12) {
            return isLower ? "öö" : "ÖÖ";
          } else {
            return isLower ? "ös" : "ÖS";
          }
        },
        meridiemParse: /öö|ÖÖ|ös|ÖS/,
        isPM: function(input) {
          return input === "ös" || input === "ÖS";
        },
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD.MM.YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd, D MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[bugün saat] LT",
          nextDay: "[yarın saat] LT",
          nextWeek: "[gelecek] dddd [saat] LT",
          lastDay: "[dün] LT",
          lastWeek: "[geçen] dddd [saat] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "%s sonra",
          past: "%s önce",
          s: "birkaç saniye",
          ss: "%d saniye",
          m: "bir dakika",
          mm: "%d dakika",
          h: "bir saat",
          hh: "%d saat",
          d: "bir gün",
          dd: "%d gün",
          w: "bir hafta",
          ww: "%d hafta",
          M: "bir ay",
          MM: "%d ay",
          y: "bir yıl",
          yy: "%d yıl"
        },
        ordinal: function(number, period) {
          switch (period) {
            case "d":
            case "D":
            case "Do":
            case "DD":
              return number;
            default:
              if (number === 0) {
                return number + "'ıncı";
              }
              var a = number % 10, b = number % 100 - a, c = number >= 100 ? 100 : null;
              return number + (suffixes$5[a] || suffixes$5[b] || suffixes$5[c]);
          }
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 7
          // The week that contains Jan 7th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("tzl", {
        months: "Januar_Fevraglh_Març_Avrïu_Mai_Gün_Julia_Guscht_Setemvar_Listopäts_Noemvar_Zecemvar".split(
          "_"
        ),
        monthsShort: "Jan_Fev_Mar_Avr_Mai_Gün_Jul_Gus_Set_Lis_Noe_Zec".split("_"),
        weekdays: "Súladi_Lúneçi_Maitzi_Márcuri_Xhúadi_Viénerçi_Sáturi".split("_"),
        weekdaysShort: "Súl_Lún_Mai_Már_Xhú_Vié_Sát".split("_"),
        weekdaysMin: "Sú_Lú_Ma_Má_Xh_Vi_Sá".split("_"),
        longDateFormat: {
          LT: "HH.mm",
          LTS: "HH.mm.ss",
          L: "DD.MM.YYYY",
          LL: "D. MMMM [dallas] YYYY",
          LLL: "D. MMMM [dallas] YYYY HH.mm",
          LLLL: "dddd, [li] D. MMMM [dallas] YYYY HH.mm"
        },
        meridiemParse: /d\'o|d\'a/i,
        isPM: function(input) {
          return "d'o" === input.toLowerCase();
        },
        meridiem: function(hours2, minutes2, isLower) {
          if (hours2 > 11) {
            return isLower ? "d'o" : "D'O";
          } else {
            return isLower ? "d'a" : "D'A";
          }
        },
        calendar: {
          sameDay: "[oxhi à] LT",
          nextDay: "[demà à] LT",
          nextWeek: "dddd [à] LT",
          lastDay: "[ieiri à] LT",
          lastWeek: "[sür el] dddd [lasteu à] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "osprei %s",
          past: "ja%s",
          s: processRelativeTime$a,
          ss: processRelativeTime$a,
          m: processRelativeTime$a,
          mm: processRelativeTime$a,
          h: processRelativeTime$a,
          hh: processRelativeTime$a,
          d: processRelativeTime$a,
          dd: processRelativeTime$a,
          M: processRelativeTime$a,
          MM: processRelativeTime$a,
          y: processRelativeTime$a,
          yy: processRelativeTime$a
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal: "%d.",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      function processRelativeTime$a(number, withoutSuffix, key, isFuture) {
        var format2 = {
          s: ["viensas secunds", "'iensas secunds"],
          ss: [number + " secunds", "" + number + " secunds"],
          m: ["'n míut", "'iens míut"],
          mm: [number + " míuts", "" + number + " míuts"],
          h: ["'n þora", "'iensa þora"],
          hh: [number + " þoras", "" + number + " þoras"],
          d: ["'n ziua", "'iensa ziua"],
          dd: [number + " ziuas", "" + number + " ziuas"],
          M: ["'n mes", "'iens mes"],
          MM: [number + " mesen", "" + number + " mesen"],
          y: ["'n ar", "'iens ar"],
          yy: [number + " ars", "" + number + " ars"]
        };
        return isFuture ? format2[key][0] : withoutSuffix ? format2[key][0] : format2[key][1];
      }
      //! moment.js locale configuration
      hooks.defineLocale("tzm-latn", {
        months: "innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split(
          "_"
        ),
        monthsShort: "innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split(
          "_"
        ),
        weekdays: "asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),
        weekdaysShort: "asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),
        weekdaysMin: "asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd D MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[asdkh g] LT",
          nextDay: "[aska g] LT",
          nextWeek: "dddd [g] LT",
          lastDay: "[assant g] LT",
          lastWeek: "dddd [g] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "dadkh s yan %s",
          past: "yan %s",
          s: "imik",
          ss: "%d imik",
          m: "minuḍ",
          mm: "%d minuḍ",
          h: "saɛa",
          hh: "%d tassaɛin",
          d: "ass",
          dd: "%d ossan",
          M: "ayowr",
          MM: "%d iyyirn",
          y: "asgas",
          yy: "%d isgasn"
        },
        week: {
          dow: 6,
          // Saturday is the first day of the week.
          doy: 12
          // The week that contains Jan 12th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("tzm", {
        months: "ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split(
          "_"
        ),
        monthsShort: "ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split(
          "_"
        ),
        weekdays: "ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),
        weekdaysShort: "ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),
        weekdaysMin: "ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd D MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[ⴰⵙⴷⵅ ⴴ] LT",
          nextDay: "[ⴰⵙⴽⴰ ⴴ] LT",
          nextWeek: "dddd [ⴴ] LT",
          lastDay: "[ⴰⵚⴰⵏⵜ ⴴ] LT",
          lastWeek: "dddd [ⴴ] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "ⴷⴰⴷⵅ ⵙ ⵢⴰⵏ %s",
          past: "ⵢⴰⵏ %s",
          s: "ⵉⵎⵉⴽ",
          ss: "%d ⵉⵎⵉⴽ",
          m: "ⵎⵉⵏⵓⴺ",
          mm: "%d ⵎⵉⵏⵓⴺ",
          h: "ⵙⴰⵄⴰ",
          hh: "%d ⵜⴰⵙⵙⴰⵄⵉⵏ",
          d: "ⴰⵙⵙ",
          dd: "%d oⵙⵙⴰⵏ",
          M: "ⴰⵢoⵓⵔ",
          MM: "%d ⵉⵢⵢⵉⵔⵏ",
          y: "ⴰⵙⴳⴰⵙ",
          yy: "%d ⵉⵙⴳⴰⵙⵏ"
        },
        week: {
          dow: 6,
          // Saturday is the first day of the week.
          doy: 12
          // The week that contains Jan 12th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("ug-cn", {
        months: "يانۋار_فېۋرال_مارت_ئاپرېل_ماي_ئىيۇن_ئىيۇل_ئاۋغۇست_سېنتەبىر_ئۆكتەبىر_نويابىر_دېكابىر".split(
          "_"
        ),
        monthsShort: "يانۋار_فېۋرال_مارت_ئاپرېل_ماي_ئىيۇن_ئىيۇل_ئاۋغۇست_سېنتەبىر_ئۆكتەبىر_نويابىر_دېكابىر".split(
          "_"
        ),
        weekdays: "يەكشەنبە_دۈشەنبە_سەيشەنبە_چارشەنبە_پەيشەنبە_جۈمە_شەنبە".split(
          "_"
        ),
        weekdaysShort: "يە_دۈ_سە_چا_پە_جۈ_شە".split("_"),
        weekdaysMin: "يە_دۈ_سە_چا_پە_جۈ_شە".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "YYYY-MM-DD",
          LL: "YYYY-يىلىM-ئاينىڭD-كۈنى",
          LLL: "YYYY-يىلىM-ئاينىڭD-كۈنى، HH:mm",
          LLLL: "dddd، YYYY-يىلىM-ئاينىڭD-كۈنى، HH:mm"
        },
        meridiemParse: /يېرىم كېچە|سەھەر|چۈشتىن بۇرۇن|چۈش|چۈشتىن كېيىن|كەچ/,
        meridiemHour: function(hour, meridiem2) {
          if (hour === 12) {
            hour = 0;
          }
          if (meridiem2 === "يېرىم كېچە" || meridiem2 === "سەھەر" || meridiem2 === "چۈشتىن بۇرۇن") {
            return hour;
          } else if (meridiem2 === "چۈشتىن كېيىن" || meridiem2 === "كەچ") {
            return hour + 12;
          } else {
            return hour >= 11 ? hour : hour + 12;
          }
        },
        meridiem: function(hour, minute, isLower) {
          var hm = hour * 100 + minute;
          if (hm < 600) {
            return "يېرىم كېچە";
          } else if (hm < 900) {
            return "سەھەر";
          } else if (hm < 1130) {
            return "چۈشتىن بۇرۇن";
          } else if (hm < 1230) {
            return "چۈش";
          } else if (hm < 1800) {
            return "چۈشتىن كېيىن";
          } else {
            return "كەچ";
          }
        },
        calendar: {
          sameDay: "[بۈگۈن سائەت] LT",
          nextDay: "[ئەتە سائەت] LT",
          nextWeek: "[كېلەركى] dddd [سائەت] LT",
          lastDay: "[تۆنۈگۈن] LT",
          lastWeek: "[ئالدىنقى] dddd [سائەت] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "%s كېيىن",
          past: "%s بۇرۇن",
          s: "نەچچە سېكونت",
          ss: "%d سېكونت",
          m: "بىر مىنۇت",
          mm: "%d مىنۇت",
          h: "بىر سائەت",
          hh: "%d سائەت",
          d: "بىر كۈن",
          dd: "%d كۈن",
          M: "بىر ئاي",
          MM: "%d ئاي",
          y: "بىر يىل",
          yy: "%d يىل"
        },
        dayOfMonthOrdinalParse: /\d{1,2}(-كۈنى|-ئاي|-ھەپتە)/,
        ordinal: function(number, period) {
          switch (period) {
            case "d":
            case "D":
            case "DDD":
              return number + "-كۈنى";
            case "w":
            case "W":
              return number + "-ھەپتە";
            default:
              return number;
          }
        },
        preparse: function(string) {
          return string.replace(/،/g, ",");
        },
        postformat: function(string) {
          return string.replace(/,/g, "،");
        },
        week: {
          // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
          dow: 1,
          // Monday is the first day of the week.
          doy: 7
          // The week that contains Jan 1st is the first week of the year.
        }
      });
      //! moment.js locale configuration
      function plural$6(word, num) {
        var forms2 = word.split("_");
        return num % 10 === 1 && num % 100 !== 11 ? forms2[0] : num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms2[1] : forms2[2];
      }
      function relativeTimeWithPlural$4(number, withoutSuffix, key) {
        var format2 = {
          ss: withoutSuffix ? "секунда_секунди_секунд" : "секунду_секунди_секунд",
          mm: withoutSuffix ? "хвилина_хвилини_хвилин" : "хвилину_хвилини_хвилин",
          hh: withoutSuffix ? "година_години_годин" : "годину_години_годин",
          dd: "день_дні_днів",
          MM: "місяць_місяці_місяців",
          yy: "рік_роки_років"
        };
        if (key === "m") {
          return withoutSuffix ? "хвилина" : "хвилину";
        } else if (key === "h") {
          return withoutSuffix ? "година" : "годину";
        } else {
          return number + " " + plural$6(format2[key], +number);
        }
      }
      function weekdaysCaseReplace(m, format2) {
        var weekdays2 = {
          nominative: "неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота".split(
            "_"
          ),
          accusative: "неділю_понеділок_вівторок_середу_четвер_п’ятницю_суботу".split(
            "_"
          ),
          genitive: "неділі_понеділка_вівторка_середи_четверга_п’ятниці_суботи".split(
            "_"
          )
        }, nounCase;
        if (m === true) {
          return weekdays2["nominative"].slice(1, 7).concat(weekdays2["nominative"].slice(0, 1));
        }
        if (!m) {
          return weekdays2["nominative"];
        }
        nounCase = /(\[[ВвУу]\]) ?dddd/.test(format2) ? "accusative" : /\[?(?:минулої|наступної)? ?\] ?dddd/.test(format2) ? "genitive" : "nominative";
        return weekdays2[nounCase][m.day()];
      }
      function processHoursFunction(str) {
        return function() {
          return str + "о" + (this.hours() === 11 ? "б" : "") + "] LT";
        };
      }
      hooks.defineLocale("uk", {
        months: {
          format: "січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня".split(
            "_"
          ),
          standalone: "січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень".split(
            "_"
          )
        },
        monthsShort: "січ_лют_бер_квіт_трав_черв_лип_серп_вер_жовт_лист_груд".split(
          "_"
        ),
        weekdays: weekdaysCaseReplace,
        weekdaysShort: "нд_пн_вт_ср_чт_пт_сб".split("_"),
        weekdaysMin: "нд_пн_вт_ср_чт_пт_сб".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD.MM.YYYY",
          LL: "D MMMM YYYY р.",
          LLL: "D MMMM YYYY р., HH:mm",
          LLLL: "dddd, D MMMM YYYY р., HH:mm"
        },
        calendar: {
          sameDay: processHoursFunction("[Сьогодні "),
          nextDay: processHoursFunction("[Завтра "),
          lastDay: processHoursFunction("[Вчора "),
          nextWeek: processHoursFunction("[У] dddd ["),
          lastWeek: function() {
            switch (this.day()) {
              case 0:
              case 3:
              case 5:
              case 6:
                return processHoursFunction("[Минулої] dddd [").call(this);
              case 1:
              case 2:
              case 4:
                return processHoursFunction("[Минулого] dddd [").call(this);
            }
          },
          sameElse: "L"
        },
        relativeTime: {
          future: "за %s",
          past: "%s тому",
          s: "декілька секунд",
          ss: relativeTimeWithPlural$4,
          m: relativeTimeWithPlural$4,
          mm: relativeTimeWithPlural$4,
          h: "годину",
          hh: relativeTimeWithPlural$4,
          d: "день",
          dd: relativeTimeWithPlural$4,
          M: "місяць",
          MM: relativeTimeWithPlural$4,
          y: "рік",
          yy: relativeTimeWithPlural$4
        },
        // M. E.: those two are virtually unused but a user might want to implement them for his/her website for some reason
        meridiemParse: /ночі|ранку|дня|вечора/,
        isPM: function(input) {
          return /^(дня|вечора)$/.test(input);
        },
        meridiem: function(hour, minute, isLower) {
          if (hour < 4) {
            return "ночі";
          } else if (hour < 12) {
            return "ранку";
          } else if (hour < 17) {
            return "дня";
          } else {
            return "вечора";
          }
        },
        dayOfMonthOrdinalParse: /\d{1,2}-(й|го)/,
        ordinal: function(number, period) {
          switch (period) {
            case "M":
            case "d":
            case "DDD":
            case "w":
            case "W":
              return number + "-й";
            case "D":
              return number + "-го";
            default:
              return number;
          }
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 7
          // The week that contains Jan 7th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      var months$b = [
        "جنوری",
        "فروری",
        "مارچ",
        "اپریل",
        "مئی",
        "جون",
        "جولائی",
        "اگست",
        "ستمبر",
        "اکتوبر",
        "نومبر",
        "دسمبر"
      ], days$2 = ["اتوار", "پیر", "منگل", "بدھ", "جمعرات", "جمعہ", "ہفتہ"];
      hooks.defineLocale("ur", {
        months: months$b,
        monthsShort: months$b,
        weekdays: days$2,
        weekdaysShort: days$2,
        weekdaysMin: days$2,
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd، D MMMM YYYY HH:mm"
        },
        meridiemParse: /صبح|شام/,
        isPM: function(input) {
          return "شام" === input;
        },
        meridiem: function(hour, minute, isLower) {
          if (hour < 12) {
            return "صبح";
          }
          return "شام";
        },
        calendar: {
          sameDay: "[آج بوقت] LT",
          nextDay: "[کل بوقت] LT",
          nextWeek: "dddd [بوقت] LT",
          lastDay: "[گذشتہ روز بوقت] LT",
          lastWeek: "[گذشتہ] dddd [بوقت] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "%s بعد",
          past: "%s قبل",
          s: "چند سیکنڈ",
          ss: "%d سیکنڈ",
          m: "ایک منٹ",
          mm: "%d منٹ",
          h: "ایک گھنٹہ",
          hh: "%d گھنٹے",
          d: "ایک دن",
          dd: "%d دن",
          M: "ایک ماہ",
          MM: "%d ماہ",
          y: "ایک سال",
          yy: "%d سال"
        },
        preparse: function(string) {
          return string.replace(/،/g, ",");
        },
        postformat: function(string) {
          return string.replace(/,/g, "،");
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("uz-latn", {
        months: "Yanvar_Fevral_Mart_Aprel_May_Iyun_Iyul_Avgust_Sentabr_Oktabr_Noyabr_Dekabr".split(
          "_"
        ),
        monthsShort: "Yan_Fev_Mar_Apr_May_Iyun_Iyul_Avg_Sen_Okt_Noy_Dek".split("_"),
        weekdays: "Yakshanba_Dushanba_Seshanba_Chorshanba_Payshanba_Juma_Shanba".split(
          "_"
        ),
        weekdaysShort: "Yak_Dush_Sesh_Chor_Pay_Jum_Shan".split("_"),
        weekdaysMin: "Ya_Du_Se_Cho_Pa_Ju_Sha".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "D MMMM YYYY, dddd HH:mm"
        },
        calendar: {
          sameDay: "[Bugun soat] LT [da]",
          nextDay: "[Ertaga] LT [da]",
          nextWeek: "dddd [kuni soat] LT [da]",
          lastDay: "[Kecha soat] LT [da]",
          lastWeek: "[O'tgan] dddd [kuni soat] LT [da]",
          sameElse: "L"
        },
        relativeTime: {
          future: "Yaqin %s ichida",
          past: "Bir necha %s oldin",
          s: "soniya",
          ss: "%d soniya",
          m: "bir daqiqa",
          mm: "%d daqiqa",
          h: "bir soat",
          hh: "%d soat",
          d: "bir kun",
          dd: "%d kun",
          M: "bir oy",
          MM: "%d oy",
          y: "bir yil",
          yy: "%d yil"
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 7
          // The week that contains Jan 7th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("uz", {
        months: "январ_феврал_март_апрел_май_июн_июл_август_сентябр_октябр_ноябр_декабр".split(
          "_"
        ),
        monthsShort: "янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек".split("_"),
        weekdays: "Якшанба_Душанба_Сешанба_Чоршанба_Пайшанба_Жума_Шанба".split("_"),
        weekdaysShort: "Якш_Душ_Сеш_Чор_Пай_Жум_Шан".split("_"),
        weekdaysMin: "Як_Ду_Се_Чо_Па_Жу_Ша".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "D MMMM YYYY, dddd HH:mm"
        },
        calendar: {
          sameDay: "[Бугун соат] LT [да]",
          nextDay: "[Эртага] LT [да]",
          nextWeek: "dddd [куни соат] LT [да]",
          lastDay: "[Кеча соат] LT [да]",
          lastWeek: "[Утган] dddd [куни соат] LT [да]",
          sameElse: "L"
        },
        relativeTime: {
          future: "Якин %s ичида",
          past: "Бир неча %s олдин",
          s: "фурсат",
          ss: "%d фурсат",
          m: "бир дакика",
          mm: "%d дакика",
          h: "бир соат",
          hh: "%d соат",
          d: "бир кун",
          dd: "%d кун",
          M: "бир ой",
          MM: "%d ой",
          y: "бир йил",
          yy: "%d йил"
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 7
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("vi", {
        months: "tháng 1_tháng 2_tháng 3_tháng 4_tháng 5_tháng 6_tháng 7_tháng 8_tháng 9_tháng 10_tháng 11_tháng 12".split(
          "_"
        ),
        monthsShort: "Thg 01_Thg 02_Thg 03_Thg 04_Thg 05_Thg 06_Thg 07_Thg 08_Thg 09_Thg 10_Thg 11_Thg 12".split(
          "_"
        ),
        monthsParseExact: true,
        weekdays: "chủ nhật_thứ hai_thứ ba_thứ tư_thứ năm_thứ sáu_thứ bảy".split(
          "_"
        ),
        weekdaysShort: "CN_T2_T3_T4_T5_T6_T7".split("_"),
        weekdaysMin: "CN_T2_T3_T4_T5_T6_T7".split("_"),
        weekdaysParseExact: true,
        meridiemParse: /sa|ch/i,
        isPM: function(input) {
          return /^ch$/i.test(input);
        },
        meridiem: function(hours2, minutes2, isLower) {
          if (hours2 < 12) {
            return isLower ? "sa" : "SA";
          } else {
            return isLower ? "ch" : "CH";
          }
        },
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "D MMMM [năm] YYYY",
          LLL: "D MMMM [năm] YYYY HH:mm",
          LLLL: "dddd, D MMMM [năm] YYYY HH:mm",
          l: "DD/M/YYYY",
          ll: "D MMM YYYY",
          lll: "D MMM YYYY HH:mm",
          llll: "ddd, D MMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[Hôm nay lúc] LT",
          nextDay: "[Ngày mai lúc] LT",
          nextWeek: "dddd [tuần tới lúc] LT",
          lastDay: "[Hôm qua lúc] LT",
          lastWeek: "dddd [tuần trước lúc] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "%s tới",
          past: "%s trước",
          s: "vài giây",
          ss: "%d giây",
          m: "một phút",
          mm: "%d phút",
          h: "một giờ",
          hh: "%d giờ",
          d: "một ngày",
          dd: "%d ngày",
          w: "một tuần",
          ww: "%d tuần",
          M: "một tháng",
          MM: "%d tháng",
          y: "một năm",
          yy: "%d năm"
        },
        dayOfMonthOrdinalParse: /\d{1,2}/,
        ordinal: function(number) {
          return number;
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("x-pseudo", {
        months: "J~áñúá~rý_F~ébrú~árý_~Márc~h_Áp~ríl_~Máý_~Júñé~_Júl~ý_Áú~gúst~_Sép~témb~ér_Ó~ctób~ér_Ñ~óvém~bér_~Décé~mbér".split(
          "_"
        ),
        monthsShort: "J~áñ_~Féb_~Már_~Ápr_~Máý_~Júñ_~Júl_~Áúg_~Sép_~Óct_~Ñóv_~Déc".split(
          "_"
        ),
        monthsParseExact: true,
        weekdays: "S~úñdá~ý_Mó~ñdáý~_Túé~sdáý~_Wéd~ñésd~áý_T~húrs~dáý_~Fríd~áý_S~átúr~dáý".split(
          "_"
        ),
        weekdaysShort: "S~úñ_~Móñ_~Túé_~Wéd_~Thú_~Frí_~Sát".split("_"),
        weekdaysMin: "S~ú_Mó~_Tú_~Wé_T~h_Fr~_Sá".split("_"),
        weekdaysParseExact: true,
        longDateFormat: {
          LT: "HH:mm",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY HH:mm",
          LLLL: "dddd, D MMMM YYYY HH:mm"
        },
        calendar: {
          sameDay: "[T~ódá~ý át] LT",
          nextDay: "[T~ómó~rró~w át] LT",
          nextWeek: "dddd [át] LT",
          lastDay: "[Ý~ést~érdá~ý át] LT",
          lastWeek: "[L~ást] dddd [át] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "í~ñ %s",
          past: "%s á~gó",
          s: "á ~féw ~sécó~ñds",
          ss: "%d s~écóñ~ds",
          m: "á ~míñ~úté",
          mm: "%d m~íñú~tés",
          h: "á~ñ hó~úr",
          hh: "%d h~óúrs",
          d: "á ~dáý",
          dd: "%d d~áýs",
          M: "á ~móñ~th",
          MM: "%d m~óñt~hs",
          y: "á ~ýéár",
          yy: "%d ý~éárs"
        },
        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function(number) {
          var b = number % 10, output = ~~(number % 100 / 10) === 1 ? "th" : b === 1 ? "st" : b === 2 ? "nd" : b === 3 ? "rd" : "th";
          return number + output;
        },
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("yo", {
        months: "Sẹ́rẹ́_Èrèlè_Ẹrẹ̀nà_Ìgbé_Èbibi_Òkùdu_Agẹmo_Ògún_Owewe_Ọ̀wàrà_Bélú_Ọ̀pẹ̀̀".split(
          "_"
        ),
        monthsShort: "Sẹ́r_Èrl_Ẹrn_Ìgb_Èbi_Òkù_Agẹ_Ògú_Owe_Ọ̀wà_Bél_Ọ̀pẹ̀̀".split("_"),
        weekdays: "Àìkú_Ajé_Ìsẹ́gun_Ọjọ́rú_Ọjọ́bọ_Ẹtì_Àbámẹ́ta".split("_"),
        weekdaysShort: "Àìk_Ajé_Ìsẹ́_Ọjr_Ọjb_Ẹtì_Àbá".split("_"),
        weekdaysMin: "Àì_Aj_Ìs_Ọr_Ọb_Ẹt_Àb".split("_"),
        longDateFormat: {
          LT: "h:mm A",
          LTS: "h:mm:ss A",
          L: "DD/MM/YYYY",
          LL: "D MMMM YYYY",
          LLL: "D MMMM YYYY h:mm A",
          LLLL: "dddd, D MMMM YYYY h:mm A"
        },
        calendar: {
          sameDay: "[Ònì ni] LT",
          nextDay: "[Ọ̀la ni] LT",
          nextWeek: "dddd [Ọsẹ̀ tón'bọ] [ni] LT",
          lastDay: "[Àna ni] LT",
          lastWeek: "dddd [Ọsẹ̀ tólọ́] [ni] LT",
          sameElse: "L"
        },
        relativeTime: {
          future: "ní %s",
          past: "%s kọjá",
          s: "ìsẹjú aayá die",
          ss: "aayá %d",
          m: "ìsẹjú kan",
          mm: "ìsẹjú %d",
          h: "wákati kan",
          hh: "wákati %d",
          d: "ọjọ́ kan",
          dd: "ọjọ́ %d",
          M: "osù kan",
          MM: "osù %d",
          y: "ọdún kan",
          yy: "ọdún %d"
        },
        dayOfMonthOrdinalParse: /ọjọ́\s\d{1,2}/,
        ordinal: "ọjọ́ %d",
        week: {
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("zh-cn", {
        months: "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split(
          "_"
        ),
        monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split(
          "_"
        ),
        weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
        weekdaysShort: "周日_周一_周二_周三_周四_周五_周六".split("_"),
        weekdaysMin: "日_一_二_三_四_五_六".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "YYYY/MM/DD",
          LL: "YYYY年M月D日",
          LLL: "YYYY年M月D日Ah点mm分",
          LLLL: "YYYY年M月D日ddddAh点mm分",
          l: "YYYY/M/D",
          ll: "YYYY年M月D日",
          lll: "YYYY年M月D日 HH:mm",
          llll: "YYYY年M月D日dddd HH:mm"
        },
        meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
        meridiemHour: function(hour, meridiem2) {
          if (hour === 12) {
            hour = 0;
          }
          if (meridiem2 === "凌晨" || meridiem2 === "早上" || meridiem2 === "上午") {
            return hour;
          } else if (meridiem2 === "下午" || meridiem2 === "晚上") {
            return hour + 12;
          } else {
            return hour >= 11 ? hour : hour + 12;
          }
        },
        meridiem: function(hour, minute, isLower) {
          var hm = hour * 100 + minute;
          if (hm < 600) {
            return "凌晨";
          } else if (hm < 900) {
            return "早上";
          } else if (hm < 1130) {
            return "上午";
          } else if (hm < 1230) {
            return "中午";
          } else if (hm < 1800) {
            return "下午";
          } else {
            return "晚上";
          }
        },
        calendar: {
          sameDay: "[今天]LT",
          nextDay: "[明天]LT",
          nextWeek: function(now2) {
            if (now2.week() !== this.week()) {
              return "[下]dddLT";
            } else {
              return "[本]dddLT";
            }
          },
          lastDay: "[昨天]LT",
          lastWeek: function(now2) {
            if (this.week() !== now2.week()) {
              return "[上]dddLT";
            } else {
              return "[本]dddLT";
            }
          },
          sameElse: "L"
        },
        dayOfMonthOrdinalParse: /\d{1,2}(日|月|周)/,
        ordinal: function(number, period) {
          switch (period) {
            case "d":
            case "D":
            case "DDD":
              return number + "日";
            case "M":
              return number + "月";
            case "w":
            case "W":
              return number + "周";
            default:
              return number;
          }
        },
        relativeTime: {
          future: "%s后",
          past: "%s前",
          s: "几秒",
          ss: "%d 秒",
          m: "1 分钟",
          mm: "%d 分钟",
          h: "1 小时",
          hh: "%d 小时",
          d: "1 天",
          dd: "%d 天",
          w: "1 周",
          ww: "%d 周",
          M: "1 个月",
          MM: "%d 个月",
          y: "1 年",
          yy: "%d 年"
        },
        week: {
          // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
          dow: 1,
          // Monday is the first day of the week.
          doy: 4
          // The week that contains Jan 4th is the first week of the year.
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("zh-hk", {
        months: "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split(
          "_"
        ),
        monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split(
          "_"
        ),
        weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
        weekdaysShort: "週日_週一_週二_週三_週四_週五_週六".split("_"),
        weekdaysMin: "日_一_二_三_四_五_六".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "YYYY/MM/DD",
          LL: "YYYY年M月D日",
          LLL: "YYYY年M月D日 HH:mm",
          LLLL: "YYYY年M月D日dddd HH:mm",
          l: "YYYY/M/D",
          ll: "YYYY年M月D日",
          lll: "YYYY年M月D日 HH:mm",
          llll: "YYYY年M月D日dddd HH:mm"
        },
        meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
        meridiemHour: function(hour, meridiem2) {
          if (hour === 12) {
            hour = 0;
          }
          if (meridiem2 === "凌晨" || meridiem2 === "早上" || meridiem2 === "上午") {
            return hour;
          } else if (meridiem2 === "中午") {
            return hour >= 11 ? hour : hour + 12;
          } else if (meridiem2 === "下午" || meridiem2 === "晚上") {
            return hour + 12;
          }
        },
        meridiem: function(hour, minute, isLower) {
          var hm = hour * 100 + minute;
          if (hm < 600) {
            return "凌晨";
          } else if (hm < 900) {
            return "早上";
          } else if (hm < 1200) {
            return "上午";
          } else if (hm === 1200) {
            return "中午";
          } else if (hm < 1800) {
            return "下午";
          } else {
            return "晚上";
          }
        },
        calendar: {
          sameDay: "[今天]LT",
          nextDay: "[明天]LT",
          nextWeek: "[下]ddddLT",
          lastDay: "[昨天]LT",
          lastWeek: "[上]ddddLT",
          sameElse: "L"
        },
        dayOfMonthOrdinalParse: /\d{1,2}(日|月|週)/,
        ordinal: function(number, period) {
          switch (period) {
            case "d":
            case "D":
            case "DDD":
              return number + "日";
            case "M":
              return number + "月";
            case "w":
            case "W":
              return number + "週";
            default:
              return number;
          }
        },
        relativeTime: {
          future: "%s後",
          past: "%s前",
          s: "幾秒",
          ss: "%d 秒",
          m: "1 分鐘",
          mm: "%d 分鐘",
          h: "1 小時",
          hh: "%d 小時",
          d: "1 天",
          dd: "%d 天",
          M: "1 個月",
          MM: "%d 個月",
          y: "1 年",
          yy: "%d 年"
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("zh-mo", {
        months: "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split(
          "_"
        ),
        monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split(
          "_"
        ),
        weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
        weekdaysShort: "週日_週一_週二_週三_週四_週五_週六".split("_"),
        weekdaysMin: "日_一_二_三_四_五_六".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "DD/MM/YYYY",
          LL: "YYYY年M月D日",
          LLL: "YYYY年M月D日 HH:mm",
          LLLL: "YYYY年M月D日dddd HH:mm",
          l: "D/M/YYYY",
          ll: "YYYY年M月D日",
          lll: "YYYY年M月D日 HH:mm",
          llll: "YYYY年M月D日dddd HH:mm"
        },
        meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
        meridiemHour: function(hour, meridiem2) {
          if (hour === 12) {
            hour = 0;
          }
          if (meridiem2 === "凌晨" || meridiem2 === "早上" || meridiem2 === "上午") {
            return hour;
          } else if (meridiem2 === "中午") {
            return hour >= 11 ? hour : hour + 12;
          } else if (meridiem2 === "下午" || meridiem2 === "晚上") {
            return hour + 12;
          }
        },
        meridiem: function(hour, minute, isLower) {
          var hm = hour * 100 + minute;
          if (hm < 600) {
            return "凌晨";
          } else if (hm < 900) {
            return "早上";
          } else if (hm < 1130) {
            return "上午";
          } else if (hm < 1230) {
            return "中午";
          } else if (hm < 1800) {
            return "下午";
          } else {
            return "晚上";
          }
        },
        calendar: {
          sameDay: "[今天] LT",
          nextDay: "[明天] LT",
          nextWeek: "[下]dddd LT",
          lastDay: "[昨天] LT",
          lastWeek: "[上]dddd LT",
          sameElse: "L"
        },
        dayOfMonthOrdinalParse: /\d{1,2}(日|月|週)/,
        ordinal: function(number, period) {
          switch (period) {
            case "d":
            case "D":
            case "DDD":
              return number + "日";
            case "M":
              return number + "月";
            case "w":
            case "W":
              return number + "週";
            default:
              return number;
          }
        },
        relativeTime: {
          future: "%s內",
          past: "%s前",
          s: "幾秒",
          ss: "%d 秒",
          m: "1 分鐘",
          mm: "%d 分鐘",
          h: "1 小時",
          hh: "%d 小時",
          d: "1 天",
          dd: "%d 天",
          M: "1 個月",
          MM: "%d 個月",
          y: "1 年",
          yy: "%d 年"
        }
      });
      //! moment.js locale configuration
      hooks.defineLocale("zh-tw", {
        months: "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split(
          "_"
        ),
        monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split(
          "_"
        ),
        weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
        weekdaysShort: "週日_週一_週二_週三_週四_週五_週六".split("_"),
        weekdaysMin: "日_一_二_三_四_五_六".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "YYYY/MM/DD",
          LL: "YYYY年M月D日",
          LLL: "YYYY年M月D日 HH:mm",
          LLLL: "YYYY年M月D日dddd HH:mm",
          l: "YYYY/M/D",
          ll: "YYYY年M月D日",
          lll: "YYYY年M月D日 HH:mm",
          llll: "YYYY年M月D日dddd HH:mm"
        },
        meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
        meridiemHour: function(hour, meridiem2) {
          if (hour === 12) {
            hour = 0;
          }
          if (meridiem2 === "凌晨" || meridiem2 === "早上" || meridiem2 === "上午") {
            return hour;
          } else if (meridiem2 === "中午") {
            return hour >= 11 ? hour : hour + 12;
          } else if (meridiem2 === "下午" || meridiem2 === "晚上") {
            return hour + 12;
          }
        },
        meridiem: function(hour, minute, isLower) {
          var hm = hour * 100 + minute;
          if (hm < 600) {
            return "凌晨";
          } else if (hm < 900) {
            return "早上";
          } else if (hm < 1130) {
            return "上午";
          } else if (hm < 1230) {
            return "中午";
          } else if (hm < 1800) {
            return "下午";
          } else {
            return "晚上";
          }
        },
        calendar: {
          sameDay: "[今天] LT",
          nextDay: "[明天] LT",
          nextWeek: "[下]dddd LT",
          lastDay: "[昨天] LT",
          lastWeek: "[上]dddd LT",
          sameElse: "L"
        },
        dayOfMonthOrdinalParse: /\d{1,2}(日|月|週)/,
        ordinal: function(number, period) {
          switch (period) {
            case "d":
            case "D":
            case "DDD":
              return number + "日";
            case "M":
              return number + "月";
            case "w":
            case "W":
              return number + "週";
            default:
              return number;
          }
        },
        relativeTime: {
          future: "%s後",
          past: "%s前",
          s: "幾秒",
          ss: "%d 秒",
          m: "1 分鐘",
          mm: "%d 分鐘",
          h: "1 小時",
          hh: "%d 小時",
          d: "1 天",
          dd: "%d 天",
          M: "1 個月",
          MM: "%d 個月",
          y: "1 年",
          yy: "%d 年"
        }
      });
      hooks.locale("en");
      return hooks;
    });
  })(momentWithLocales$1);
  return momentWithLocales$1.exports;
}
var momentWithLocalesExports = requireMomentWithLocales();
const moment = /* @__PURE__ */ getDefaultExportFromCjs(momentWithLocalesExports);
const locale = getLocale();
const translations = { "ar": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["ثوانٍ"] } } } }, "ast": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["segundos"] } } } }, "az": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["saniyə"] } } } }, "be": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["секунды"] } } } }, "br": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["eilennoù"] } } } }, "ca": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["segons"] } } } }, "cs": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["sekund(y)"] } } } }, "cs_CZ": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["sekund(y)"] } } } }, "da": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["sekunder"] } } } }, "de": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["Sekunden"] } } } }, "de_DE": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["Sekunden"] } } } }, "el": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["δευτερόλεπτα"] } } } }, "en_GB": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["seconds"] } } } }, "eo": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["sekundoj"] } } } }, "es": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["segundos"] } } } }, "es_AR": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["segundos"] } } } }, "es_CL": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["segundos"] } } } }, "es_MX": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["segundos"] } } } }, "et_EE": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["sekundid"] } } } }, "eu": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["segundo"] } } } }, "fa": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["ثانیه"] } } } }, "fi": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["sekuntia"] } } } }, "fi_FI": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["sekuntia"] } } } }, "fr": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["secondes"] } } } }, "ga": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["soicindí"] } } } }, "gl": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["segundos"] } } } }, "he": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["שניות"] } } } }, "hr": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["sekunde"] } } } }, "hu": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["másodperc"] } } } }, "hu_HU": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["másodperc"] } } } }, "id": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["detik"] } } } }, "is": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["sekúndur"] } } } }, "it": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["secondi"] } } } }, "ja": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["秒後"] } } } }, "ja_JP": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["秒"] } } } }, "kab": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["tasinin"] } } } }, "ko": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["초"] } } } }, "lo": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["ວິນາທີ"] } } } }, "lt_LT": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["sek."] } } } }, "lv": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["sekundes"] } } } }, "mk": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["секунди"] } } } }, "mn": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["секунд"] } } } }, "ms_MY": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["saat"] } } } }, "my": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["စက္ကန့်"] } } } }, "nb": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["sekunder"] } } } }, "nb_NO": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["sekunder"] } } } }, "nl": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["seconden"] } } } }, "oc": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["segondas"] } } } }, "pl": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["sekundy"] } } } }, "pt_BR": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["segundos"] } } } }, "pt_PT": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["segundos"] } } } }, "ro": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["secunde"] } } } }, "ru": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["секунды"] } } } }, "si": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["තත්පර"] } } } }, "sk": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["sekúnd"] } } } }, "sk_SK": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["sekundy"] } } } }, "sl": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["sekunde"] } } } }, "sq": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["sekonda"] } } } }, "sr": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["секунде"] } } } }, "sv": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["sekunder"] } } } }, "th_TH": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["วินาที"] } } } }, "tr": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["saniye"] } } } }, "uk": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["секунд"] } } } }, "uz": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["ikkinchi"] } } } }, "vi": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["giây"] } } } }, "zh_CN": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["秒"] } } } }, "zh_HK": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["秒"] } } } }, "zh_TW": { "charset": "utf-8", "translations": { "": { "seconds": { "msgid": "seconds", "msgstr": ["秒"] } } } } };
moment.locale(locale);
if (locale === "en" || locale in translations) {
  const gt = getGettextBuilder().setLanguage(locale).addTranslation(locale, translations[locale]).build();
  moment.updateLocale(moment.locale(), {
    relativeTime: {
      s: gt.gettext("seconds")
    }
  });
}
var define_process_env_default = {};
var NewMenuEntryCategory = /* @__PURE__ */ ((NewMenuEntryCategory2) => {
  NewMenuEntryCategory2[NewMenuEntryCategory2["UploadFromDevice"] = 0] = "UploadFromDevice";
  NewMenuEntryCategory2[NewMenuEntryCategory2["CreateNew"] = 1] = "CreateNew";
  NewMenuEntryCategory2[NewMenuEntryCategory2["Other"] = 2] = "Other";
  return NewMenuEntryCategory2;
})(NewMenuEntryCategory || {});
class NewFileMenu {
  _entries = [];
  registerEntry(entry) {
    this.validateEntry(entry);
    entry.category = entry.category ?? 1;
    this._entries.push(entry);
  }
  unregisterEntry(entry) {
    const entryIndex = typeof entry === "string" ? this.getEntryIndex(entry) : this.getEntryIndex(entry.id);
    if (entryIndex === -1) {
      logger.warn("Entry not found, nothing removed", { entry, entries: this.getEntries() });
      return;
    }
    this._entries.splice(entryIndex, 1);
  }
  /**
   * Get the list of registered entries
   *
   * @param {Folder} context the creation context. Usually the current folder
   */
  getEntries(context) {
    if (context) {
      return this._entries.filter((entry) => typeof entry.enabled === "function" ? entry.enabled(context) : true);
    }
    return this._entries;
  }
  getEntryIndex(id) {
    return this._entries.findIndex((entry) => entry.id === id);
  }
  validateEntry(entry) {
    if (!entry.id || !entry.displayName || !(entry.iconSvgInline || entry.iconClass) || !entry.handler) {
      throw new Error("Invalid entry");
    }
    if (typeof entry.id !== "string" || typeof entry.displayName !== "string") {
      throw new Error("Invalid id or displayName property");
    }
    if (entry.iconClass && typeof entry.iconClass !== "string" || entry.iconSvgInline && typeof entry.iconSvgInline !== "string") {
      throw new Error("Invalid icon provided");
    }
    if (entry.enabled !== void 0 && typeof entry.enabled !== "function") {
      throw new Error("Invalid enabled property");
    }
    if (typeof entry.handler !== "function") {
      throw new Error("Invalid handler property");
    }
    if ("order" in entry && typeof entry.order !== "number") {
      throw new Error("Invalid order property");
    }
    if (this.getEntryIndex(entry.id) !== -1) {
      throw new Error("Duplicate entry");
    }
  }
}
const getNewFileMenu = function() {
  if (typeof window._nc_newfilemenu === "undefined") {
    window._nc_newfilemenu = new NewFileMenu();
    logger.debug("NewFileMenu initialized");
  }
  return window._nc_newfilemenu;
};
var InvalidFilenameErrorReason = /* @__PURE__ */ ((InvalidFilenameErrorReason2) => {
  InvalidFilenameErrorReason2["ReservedName"] = "reserved name";
  InvalidFilenameErrorReason2["Character"] = "character";
  InvalidFilenameErrorReason2["Extension"] = "extension";
  return InvalidFilenameErrorReason2;
})(InvalidFilenameErrorReason || {});
class InvalidFilenameError extends Error {
  constructor(options) {
    super(`Invalid ${options.reason} '${options.segment}' in filename '${options.filename}'`, { cause: options });
  }
  /**
   * The filename that was validated
   */
  get filename() {
    return this.cause.filename;
  }
  /**
   * Reason why the validation failed
   */
  get reason() {
    return this.cause.reason;
  }
  /**
   * Part of the filename that caused this error
   */
  get segment() {
    return this.cause.segment;
  }
}
function validateFilename(filename) {
  const capabilities = e().files;
  const forbiddenCharacters = capabilities.forbidden_filename_characters ?? window._oc_config?.forbidden_filenames_characters ?? ["/", "\\"];
  for (const character of forbiddenCharacters) {
    if (filename.includes(character)) {
      throw new InvalidFilenameError({ segment: character, reason: "character", filename });
    }
  }
  filename = filename.toLocaleLowerCase();
  const forbiddenFilenames = capabilities.forbidden_filenames ?? [".htaccess"];
  if (forbiddenFilenames.includes(filename)) {
    throw new InvalidFilenameError({
      filename,
      segment: filename,
      reason: "reserved name"
      /* ReservedName */
    });
  }
  const endOfBasename = filename.indexOf(".", 1);
  const basename2 = filename.substring(0, endOfBasename === -1 ? void 0 : endOfBasename);
  const forbiddenFilenameBasenames = capabilities.forbidden_filename_basenames ?? [];
  if (forbiddenFilenameBasenames.includes(basename2)) {
    throw new InvalidFilenameError({
      filename,
      segment: basename2,
      reason: "reserved name"
      /* ReservedName */
    });
  }
  const forbiddenFilenameExtensions = capabilities.forbidden_filename_extensions ?? [".part", ".filepart"];
  for (const extension of forbiddenFilenameExtensions) {
    if (filename.length > extension.length && filename.endsWith(extension)) {
      throw new InvalidFilenameError({ segment: extension, reason: "extension", filename });
    }
  }
}
function getUniqueName(name, otherNames, options) {
  const opts = {
    suffix: (n2) => `(${n2})`,
    ignoreFileExtension: false,
    ...options
  };
  let newName = name;
  let i2 = 1;
  while (otherNames.includes(newName)) {
    const ext = opts.ignoreFileExtension ? "" : pathBrowserifyExports.extname(name);
    const base = pathBrowserifyExports.basename(name, ext);
    newName = `${base} ${opts.suffix(i2++)}${ext}`;
  }
  return newName;
}
const humanList = ["B", "KB", "MB", "GB", "TB", "PB"];
const humanListBinary = ["B", "KiB", "MiB", "GiB", "TiB", "PiB"];
function formatFileSize(size, skipSmallSizes = false, binaryPrefixes = false, base1000 = false) {
  binaryPrefixes = binaryPrefixes && !base1000;
  if (typeof size === "string") {
    size = Number(size);
  }
  let order = size > 0 ? Math.floor(Math.log(size) / Math.log(base1000 ? 1e3 : 1024)) : 0;
  order = Math.min((binaryPrefixes ? humanListBinary.length : humanList.length) - 1, order);
  const readableFormat = binaryPrefixes ? humanListBinary[order] : humanList[order];
  let relativeSize = (size / Math.pow(base1000 ? 1e3 : 1024, order)).toFixed(1);
  if (skipSmallSizes === true && order === 0) {
    return (relativeSize !== "0.0" ? "< 1 " : "0 ") + (binaryPrefixes ? humanListBinary[1] : humanList[1]);
  }
  if (order < 2) {
    relativeSize = parseFloat(relativeSize).toFixed(0);
  } else {
    relativeSize = parseFloat(relativeSize).toLocaleString(getCanonicalLocale());
  }
  return relativeSize + " " + readableFormat;
}
function stringify(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return String(value);
}
function orderBy(collection, identifiers2, orders) {
  identifiers2 = identifiers2 ?? [(value) => value];
  orders = orders ?? [];
  const sorting = identifiers2.map((_, index) => (orders[index] ?? "asc") === "asc" ? 1 : -1);
  const collator = Intl.Collator(
    [getLanguage(), getCanonicalLocale()],
    {
      // handle 10 as ten and not as one-zero
      numeric: true,
      usage: "sort"
    }
  );
  return [...collection].sort((a2, b2) => {
    for (const [index, identifier] of identifiers2.entries()) {
      const value = collator.compare(stringify(identifier(a2)), stringify(identifier(b2)));
      if (value !== 0) {
        return value * sorting[index];
      }
    }
    return 0;
  });
}
function sortNodes(nodes, options = {}) {
  const sortingOptions = {
    // Default to sort by name
    sortingMode: "basename",
    // Default to sort ascending
    sortingOrder: "asc",
    ...options
  };
  const basename2 = (name) => name.lastIndexOf(".") > 0 ? name.slice(0, name.lastIndexOf(".")) : name;
  const identifiers2 = [
    // 1: Sort favorites first if enabled
    ...sortingOptions.sortFavoritesFirst ? [(v) => v.attributes?.favorite !== 1] : [],
    // 2: Sort folders first if sorting by name
    ...sortingOptions.sortFoldersFirst ? [(v) => v.type !== "folder"] : [],
    // 3: Use sorting mode if NOT basename (to be able to use display name too)
    ...sortingOptions.sortingMode !== "basename" ? [(v) => v[sortingOptions.sortingMode]] : [],
    // 4: Use display name if available, fallback to name
    (v) => basename2(v.displayname || v.attributes?.displayname || v.basename),
    // 5: Finally, use basename if all previous sorting methods failed
    (v) => v.basename
  ];
  const orders = [
    // (for 1): always sort favorites before normal files
    ...sortingOptions.sortFavoritesFirst ? ["asc"] : [],
    // (for 2): always sort folders before files
    ...sortingOptions.sortFoldersFirst ? ["asc"] : [],
    // (for 3): Reverse if sorting by mtime as mtime higher means edited more recent -> lower
    ...sortingOptions.sortingMode === "mtime" ? [sortingOptions.sortingOrder === "asc" ? "desc" : "asc"] : [],
    // (also for 3 so make sure not to conflict with 2 and 3)
    ...sortingOptions.sortingMode !== "mtime" && sortingOptions.sortingMode !== "basename" ? [sortingOptions.sortingOrder] : [],
    // for 4: use configured sorting direction
    sortingOptions.sortingOrder,
    // for 5: use configured sorting direction
    sortingOptions.sortingOrder
  ];
  return orderBy(nodes, identifiers2, orders);
}
var validator = {};
var util = {};
var hasRequiredUtil;
function requireUtil() {
  if (hasRequiredUtil) return util;
  hasRequiredUtil = 1;
  (function(exports) {
    const nameStartChar = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
    const nameChar = nameStartChar + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
    const nameRegexp = "[" + nameStartChar + "][" + nameChar + "]*";
    const regexName = new RegExp("^" + nameRegexp + "$");
    const getAllMatches = function(string, regex) {
      const matches = [];
      let match = regex.exec(string);
      while (match) {
        const allmatches = [];
        allmatches.startIndex = regex.lastIndex - match[0].length;
        const len = match.length;
        for (let index = 0; index < len; index++) {
          allmatches.push(match[index]);
        }
        matches.push(allmatches);
        match = regex.exec(string);
      }
      return matches;
    };
    const isName = function(string) {
      const match = regexName.exec(string);
      return !(match === null || typeof match === "undefined");
    };
    exports.isExist = function(v) {
      return typeof v !== "undefined";
    };
    exports.isEmptyObject = function(obj) {
      return Object.keys(obj).length === 0;
    };
    exports.merge = function(target, a2, arrayMode) {
      if (a2) {
        const keys = Object.keys(a2);
        const len = keys.length;
        for (let i2 = 0; i2 < len; i2++) {
          if (arrayMode === "strict") {
            target[keys[i2]] = [a2[keys[i2]]];
          } else {
            target[keys[i2]] = a2[keys[i2]];
          }
        }
      }
    };
    exports.getValue = function(v) {
      if (exports.isExist(v)) {
        return v;
      } else {
        return "";
      }
    };
    exports.isName = isName;
    exports.getAllMatches = getAllMatches;
    exports.nameRegexp = nameRegexp;
  })(util);
  return util;
}
var hasRequiredValidator;
function requireValidator() {
  if (hasRequiredValidator) return validator;
  hasRequiredValidator = 1;
  const util2 = requireUtil();
  const defaultOptions = {
    allowBooleanAttributes: false,
    //A tag can have attributes without any value
    unpairedTags: []
  };
  validator.validate = function(xmlData, options) {
    options = Object.assign({}, defaultOptions, options);
    const tags = [];
    let tagFound = false;
    let reachedRoot = false;
    if (xmlData[0] === "\uFEFF") {
      xmlData = xmlData.substr(1);
    }
    for (let i2 = 0; i2 < xmlData.length; i2++) {
      if (xmlData[i2] === "<" && xmlData[i2 + 1] === "?") {
        i2 += 2;
        i2 = readPI(xmlData, i2);
        if (i2.err) return i2;
      } else if (xmlData[i2] === "<") {
        let tagStartPos = i2;
        i2++;
        if (xmlData[i2] === "!") {
          i2 = readCommentAndCDATA(xmlData, i2);
          continue;
        } else {
          let closingTag = false;
          if (xmlData[i2] === "/") {
            closingTag = true;
            i2++;
          }
          let tagName = "";
          for (; i2 < xmlData.length && xmlData[i2] !== ">" && xmlData[i2] !== " " && xmlData[i2] !== "	" && xmlData[i2] !== "\n" && xmlData[i2] !== "\r"; i2++) {
            tagName += xmlData[i2];
          }
          tagName = tagName.trim();
          if (tagName[tagName.length - 1] === "/") {
            tagName = tagName.substring(0, tagName.length - 1);
            i2--;
          }
          if (!validateTagName(tagName)) {
            let msg;
            if (tagName.trim().length === 0) {
              msg = "Invalid space after '<'.";
            } else {
              msg = "Tag '" + tagName + "' is an invalid name.";
            }
            return getErrorObject("InvalidTag", msg, getLineNumberForPosition(xmlData, i2));
          }
          const result = readAttributeStr(xmlData, i2);
          if (result === false) {
            return getErrorObject("InvalidAttr", "Attributes for '" + tagName + "' have open quote.", getLineNumberForPosition(xmlData, i2));
          }
          let attrStr = result.value;
          i2 = result.index;
          if (attrStr[attrStr.length - 1] === "/") {
            const attrStrStart = i2 - attrStr.length;
            attrStr = attrStr.substring(0, attrStr.length - 1);
            const isValid = validateAttributeString(attrStr, options);
            if (isValid === true) {
              tagFound = true;
            } else {
              return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, attrStrStart + isValid.err.line));
            }
          } else if (closingTag) {
            if (!result.tagClosed) {
              return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' doesn't have proper closing.", getLineNumberForPosition(xmlData, i2));
            } else if (attrStr.trim().length > 0) {
              return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' can't have attributes or invalid starting.", getLineNumberForPosition(xmlData, tagStartPos));
            } else if (tags.length === 0) {
              return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' has not been opened.", getLineNumberForPosition(xmlData, tagStartPos));
            } else {
              const otg = tags.pop();
              if (tagName !== otg.tagName) {
                let openPos = getLineNumberForPosition(xmlData, otg.tagStartPos);
                return getErrorObject(
                  "InvalidTag",
                  "Expected closing tag '" + otg.tagName + "' (opened in line " + openPos.line + ", col " + openPos.col + ") instead of closing tag '" + tagName + "'.",
                  getLineNumberForPosition(xmlData, tagStartPos)
                );
              }
              if (tags.length == 0) {
                reachedRoot = true;
              }
            }
          } else {
            const isValid = validateAttributeString(attrStr, options);
            if (isValid !== true) {
              return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, i2 - attrStr.length + isValid.err.line));
            }
            if (reachedRoot === true) {
              return getErrorObject("InvalidXml", "Multiple possible root nodes found.", getLineNumberForPosition(xmlData, i2));
            } else if (options.unpairedTags.indexOf(tagName) !== -1) ;
            else {
              tags.push({ tagName, tagStartPos });
            }
            tagFound = true;
          }
          for (i2++; i2 < xmlData.length; i2++) {
            if (xmlData[i2] === "<") {
              if (xmlData[i2 + 1] === "!") {
                i2++;
                i2 = readCommentAndCDATA(xmlData, i2);
                continue;
              } else if (xmlData[i2 + 1] === "?") {
                i2 = readPI(xmlData, ++i2);
                if (i2.err) return i2;
              } else {
                break;
              }
            } else if (xmlData[i2] === "&") {
              const afterAmp = validateAmpersand(xmlData, i2);
              if (afterAmp == -1)
                return getErrorObject("InvalidChar", "char '&' is not expected.", getLineNumberForPosition(xmlData, i2));
              i2 = afterAmp;
            } else {
              if (reachedRoot === true && !isWhiteSpace(xmlData[i2])) {
                return getErrorObject("InvalidXml", "Extra text at the end", getLineNumberForPosition(xmlData, i2));
              }
            }
          }
          if (xmlData[i2] === "<") {
            i2--;
          }
        }
      } else {
        if (isWhiteSpace(xmlData[i2])) {
          continue;
        }
        return getErrorObject("InvalidChar", "char '" + xmlData[i2] + "' is not expected.", getLineNumberForPosition(xmlData, i2));
      }
    }
    if (!tagFound) {
      return getErrorObject("InvalidXml", "Start tag expected.", 1);
    } else if (tags.length == 1) {
      return getErrorObject("InvalidTag", "Unclosed tag '" + tags[0].tagName + "'.", getLineNumberForPosition(xmlData, tags[0].tagStartPos));
    } else if (tags.length > 0) {
      return getErrorObject("InvalidXml", "Invalid '" + JSON.stringify(tags.map((t2) => t2.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", { line: 1, col: 1 });
    }
    return true;
  };
  function isWhiteSpace(char) {
    return char === " " || char === "	" || char === "\n" || char === "\r";
  }
  function readPI(xmlData, i2) {
    const start = i2;
    for (; i2 < xmlData.length; i2++) {
      if (xmlData[i2] == "?" || xmlData[i2] == " ") {
        const tagname = xmlData.substr(start, i2 - start);
        if (i2 > 5 && tagname === "xml") {
          return getErrorObject("InvalidXml", "XML declaration allowed only at the start of the document.", getLineNumberForPosition(xmlData, i2));
        } else if (xmlData[i2] == "?" && xmlData[i2 + 1] == ">") {
          i2++;
          break;
        } else {
          continue;
        }
      }
    }
    return i2;
  }
  function readCommentAndCDATA(xmlData, i2) {
    if (xmlData.length > i2 + 5 && xmlData[i2 + 1] === "-" && xmlData[i2 + 2] === "-") {
      for (i2 += 3; i2 < xmlData.length; i2++) {
        if (xmlData[i2] === "-" && xmlData[i2 + 1] === "-" && xmlData[i2 + 2] === ">") {
          i2 += 2;
          break;
        }
      }
    } else if (xmlData.length > i2 + 8 && xmlData[i2 + 1] === "D" && xmlData[i2 + 2] === "O" && xmlData[i2 + 3] === "C" && xmlData[i2 + 4] === "T" && xmlData[i2 + 5] === "Y" && xmlData[i2 + 6] === "P" && xmlData[i2 + 7] === "E") {
      let angleBracketsCount = 1;
      for (i2 += 8; i2 < xmlData.length; i2++) {
        if (xmlData[i2] === "<") {
          angleBracketsCount++;
        } else if (xmlData[i2] === ">") {
          angleBracketsCount--;
          if (angleBracketsCount === 0) {
            break;
          }
        }
      }
    } else if (xmlData.length > i2 + 9 && xmlData[i2 + 1] === "[" && xmlData[i2 + 2] === "C" && xmlData[i2 + 3] === "D" && xmlData[i2 + 4] === "A" && xmlData[i2 + 5] === "T" && xmlData[i2 + 6] === "A" && xmlData[i2 + 7] === "[") {
      for (i2 += 8; i2 < xmlData.length; i2++) {
        if (xmlData[i2] === "]" && xmlData[i2 + 1] === "]" && xmlData[i2 + 2] === ">") {
          i2 += 2;
          break;
        }
      }
    }
    return i2;
  }
  const doubleQuote = '"';
  const singleQuote = "'";
  function readAttributeStr(xmlData, i2) {
    let attrStr = "";
    let startChar = "";
    let tagClosed = false;
    for (; i2 < xmlData.length; i2++) {
      if (xmlData[i2] === doubleQuote || xmlData[i2] === singleQuote) {
        if (startChar === "") {
          startChar = xmlData[i2];
        } else if (startChar !== xmlData[i2]) ;
        else {
          startChar = "";
        }
      } else if (xmlData[i2] === ">") {
        if (startChar === "") {
          tagClosed = true;
          break;
        }
      }
      attrStr += xmlData[i2];
    }
    if (startChar !== "") {
      return false;
    }
    return {
      value: attrStr,
      index: i2,
      tagClosed
    };
  }
  const validAttrStrRegxp = new RegExp(`(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['"])(([\\s\\S])*?)\\5)?`, "g");
  function validateAttributeString(attrStr, options) {
    const matches = util2.getAllMatches(attrStr, validAttrStrRegxp);
    const attrNames = {};
    for (let i2 = 0; i2 < matches.length; i2++) {
      if (matches[i2][1].length === 0) {
        return getErrorObject("InvalidAttr", "Attribute '" + matches[i2][2] + "' has no space in starting.", getPositionFromMatch(matches[i2]));
      } else if (matches[i2][3] !== void 0 && matches[i2][4] === void 0) {
        return getErrorObject("InvalidAttr", "Attribute '" + matches[i2][2] + "' is without value.", getPositionFromMatch(matches[i2]));
      } else if (matches[i2][3] === void 0 && !options.allowBooleanAttributes) {
        return getErrorObject("InvalidAttr", "boolean attribute '" + matches[i2][2] + "' is not allowed.", getPositionFromMatch(matches[i2]));
      }
      const attrName = matches[i2][2];
      if (!validateAttrName(attrName)) {
        return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is an invalid name.", getPositionFromMatch(matches[i2]));
      }
      if (!attrNames.hasOwnProperty(attrName)) {
        attrNames[attrName] = 1;
      } else {
        return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is repeated.", getPositionFromMatch(matches[i2]));
      }
    }
    return true;
  }
  function validateNumberAmpersand(xmlData, i2) {
    let re2 = /\d/;
    if (xmlData[i2] === "x") {
      i2++;
      re2 = /[\da-fA-F]/;
    }
    for (; i2 < xmlData.length; i2++) {
      if (xmlData[i2] === ";")
        return i2;
      if (!xmlData[i2].match(re2))
        break;
    }
    return -1;
  }
  function validateAmpersand(xmlData, i2) {
    i2++;
    if (xmlData[i2] === ";")
      return -1;
    if (xmlData[i2] === "#") {
      i2++;
      return validateNumberAmpersand(xmlData, i2);
    }
    let count = 0;
    for (; i2 < xmlData.length; i2++, count++) {
      if (xmlData[i2].match(/\w/) && count < 20)
        continue;
      if (xmlData[i2] === ";")
        break;
      return -1;
    }
    return i2;
  }
  function getErrorObject(code, message, lineNumber) {
    return {
      err: {
        code,
        msg: message,
        line: lineNumber.line || lineNumber,
        col: lineNumber.col
      }
    };
  }
  function validateAttrName(attrName) {
    return util2.isName(attrName);
  }
  function validateTagName(tagname) {
    return util2.isName(tagname);
  }
  function getLineNumberForPosition(xmlData, index) {
    const lines = xmlData.substring(0, index).split(/\r?\n/);
    return {
      line: lines.length,
      // column number is last line's length + 1, because column numbering starts at 1:
      col: lines[lines.length - 1].length + 1
    };
  }
  function getPositionFromMatch(match) {
    return match.startIndex + match[1].length;
  }
  return validator;
}
var OptionsBuilder = {};
var hasRequiredOptionsBuilder;
function requireOptionsBuilder() {
  if (hasRequiredOptionsBuilder) return OptionsBuilder;
  hasRequiredOptionsBuilder = 1;
  const defaultOptions = {
    preserveOrder: false,
    attributeNamePrefix: "@_",
    attributesGroupName: false,
    textNodeName: "#text",
    ignoreAttributes: true,
    removeNSPrefix: false,
    // remove NS from tag name or attribute name if true
    allowBooleanAttributes: false,
    //a tag can have attributes without any value
    //ignoreRootElement : false,
    parseTagValue: true,
    parseAttributeValue: false,
    trimValues: true,
    //Trim string values of tag and attributes
    cdataPropName: false,
    numberParseOptions: {
      hex: true,
      leadingZeros: true,
      eNotation: true
    },
    tagValueProcessor: function(tagName, val) {
      return val;
    },
    attributeValueProcessor: function(attrName, val) {
      return val;
    },
    stopNodes: [],
    //nested tags will not be parsed even for errors
    alwaysCreateTextNode: false,
    isArray: () => false,
    commentPropName: false,
    unpairedTags: [],
    processEntities: true,
    htmlEntities: false,
    ignoreDeclaration: false,
    ignorePiTags: false,
    transformTagName: false,
    transformAttributeName: false,
    updateTag: function(tagName, jPath, attrs) {
      return tagName;
    }
    // skipEmptyListItem: false
  };
  const buildOptions = function(options) {
    return Object.assign({}, defaultOptions, options);
  };
  OptionsBuilder.buildOptions = buildOptions;
  OptionsBuilder.defaultOptions = defaultOptions;
  return OptionsBuilder;
}
var xmlNode;
var hasRequiredXmlNode;
function requireXmlNode() {
  if (hasRequiredXmlNode) return xmlNode;
  hasRequiredXmlNode = 1;
  class XmlNode {
    constructor(tagname) {
      this.tagname = tagname;
      this.child = [];
      this[":@"] = {};
    }
    add(key, val) {
      if (key === "__proto__") key = "#__proto__";
      this.child.push({ [key]: val });
    }
    addChild(node) {
      if (node.tagname === "__proto__") node.tagname = "#__proto__";
      if (node[":@"] && Object.keys(node[":@"]).length > 0) {
        this.child.push({ [node.tagname]: node.child, [":@"]: node[":@"] });
      } else {
        this.child.push({ [node.tagname]: node.child });
      }
    }
  }
  xmlNode = XmlNode;
  return xmlNode;
}
var DocTypeReader;
var hasRequiredDocTypeReader;
function requireDocTypeReader() {
  if (hasRequiredDocTypeReader) return DocTypeReader;
  hasRequiredDocTypeReader = 1;
  const util2 = requireUtil();
  function readDocType(xmlData, i2) {
    const entities = {};
    if (xmlData[i2 + 3] === "O" && xmlData[i2 + 4] === "C" && xmlData[i2 + 5] === "T" && xmlData[i2 + 6] === "Y" && xmlData[i2 + 7] === "P" && xmlData[i2 + 8] === "E") {
      i2 = i2 + 9;
      let angleBracketsCount = 1;
      let hasBody = false, comment = false;
      let exp = "";
      for (; i2 < xmlData.length; i2++) {
        if (xmlData[i2] === "<" && !comment) {
          if (hasBody && isEntity(xmlData, i2)) {
            i2 += 7;
            let entityName, val;
            [entityName, val, i2] = readEntityExp(xmlData, i2 + 1);
            if (val.indexOf("&") === -1)
              entities[validateEntityName(entityName)] = {
                regx: RegExp(`&${entityName};`, "g"),
                val
              };
          } else if (hasBody && isElement(xmlData, i2)) i2 += 8;
          else if (hasBody && isAttlist(xmlData, i2)) i2 += 8;
          else if (hasBody && isNotation(xmlData, i2)) i2 += 9;
          else comment = true;
          angleBracketsCount++;
          exp = "";
        } else if (xmlData[i2] === ">") {
          if (comment) {
            if (xmlData[i2 - 1] === "-" && xmlData[i2 - 2] === "-") {
              comment = false;
              angleBracketsCount--;
            }
          } else {
            angleBracketsCount--;
          }
          if (angleBracketsCount === 0) {
            break;
          }
        } else if (xmlData[i2] === "[") {
          hasBody = true;
        } else {
          exp += xmlData[i2];
        }
      }
      if (angleBracketsCount !== 0) {
        throw new Error(`Unclosed DOCTYPE`);
      }
    } else {
      throw new Error(`Invalid Tag instead of DOCTYPE`);
    }
    return { entities, i: i2 };
  }
  function readEntityExp(xmlData, i2) {
    let entityName = "";
    for (; i2 < xmlData.length && (xmlData[i2] !== "'" && xmlData[i2] !== '"'); i2++) {
      entityName += xmlData[i2];
    }
    entityName = entityName.trim();
    if (entityName.indexOf(" ") !== -1) throw new Error("External entites are not supported");
    const startChar = xmlData[i2++];
    let val = "";
    for (; i2 < xmlData.length && xmlData[i2] !== startChar; i2++) {
      val += xmlData[i2];
    }
    return [entityName, val, i2];
  }
  function isEntity(xmlData, i2) {
    if (xmlData[i2 + 1] === "!" && xmlData[i2 + 2] === "E" && xmlData[i2 + 3] === "N" && xmlData[i2 + 4] === "T" && xmlData[i2 + 5] === "I" && xmlData[i2 + 6] === "T" && xmlData[i2 + 7] === "Y") return true;
    return false;
  }
  function isElement(xmlData, i2) {
    if (xmlData[i2 + 1] === "!" && xmlData[i2 + 2] === "E" && xmlData[i2 + 3] === "L" && xmlData[i2 + 4] === "E" && xmlData[i2 + 5] === "M" && xmlData[i2 + 6] === "E" && xmlData[i2 + 7] === "N" && xmlData[i2 + 8] === "T") return true;
    return false;
  }
  function isAttlist(xmlData, i2) {
    if (xmlData[i2 + 1] === "!" && xmlData[i2 + 2] === "A" && xmlData[i2 + 3] === "T" && xmlData[i2 + 4] === "T" && xmlData[i2 + 5] === "L" && xmlData[i2 + 6] === "I" && xmlData[i2 + 7] === "S" && xmlData[i2 + 8] === "T") return true;
    return false;
  }
  function isNotation(xmlData, i2) {
    if (xmlData[i2 + 1] === "!" && xmlData[i2 + 2] === "N" && xmlData[i2 + 3] === "O" && xmlData[i2 + 4] === "T" && xmlData[i2 + 5] === "A" && xmlData[i2 + 6] === "T" && xmlData[i2 + 7] === "I" && xmlData[i2 + 8] === "O" && xmlData[i2 + 9] === "N") return true;
    return false;
  }
  function validateEntityName(name) {
    if (util2.isName(name))
      return name;
    else
      throw new Error(`Invalid entity name ${name}`);
  }
  DocTypeReader = readDocType;
  return DocTypeReader;
}
var strnum;
var hasRequiredStrnum;
function requireStrnum() {
  if (hasRequiredStrnum) return strnum;
  hasRequiredStrnum = 1;
  const hexRegex = /^[-+]?0x[a-fA-F0-9]+$/;
  const numRegex = /^([\-\+])?(0*)(\.[0-9]+([eE]\-?[0-9]+)?|[0-9]+(\.[0-9]+([eE]\-?[0-9]+)?)?)$/;
  if (!Number.parseInt && window.parseInt) {
    Number.parseInt = window.parseInt;
  }
  if (!Number.parseFloat && window.parseFloat) {
    Number.parseFloat = window.parseFloat;
  }
  const consider = {
    hex: true,
    leadingZeros: true,
    decimalPoint: ".",
    eNotation: true
    //skipLike: /regex/
  };
  function toNumber(str, options = {}) {
    options = Object.assign({}, consider, options);
    if (!str || typeof str !== "string") return str;
    let trimmedStr = str.trim();
    if (options.skipLike !== void 0 && options.skipLike.test(trimmedStr)) return str;
    else if (options.hex && hexRegex.test(trimmedStr)) {
      return Number.parseInt(trimmedStr, 16);
    } else {
      const match = numRegex.exec(trimmedStr);
      if (match) {
        const sign = match[1];
        const leadingZeros = match[2];
        let numTrimmedByZeros = trimZeros(match[3]);
        const eNotation = match[4] || match[6];
        if (!options.leadingZeros && leadingZeros.length > 0 && sign && trimmedStr[2] !== ".") return str;
        else if (!options.leadingZeros && leadingZeros.length > 0 && !sign && trimmedStr[1] !== ".") return str;
        else {
          const num = Number(trimmedStr);
          const numStr = "" + num;
          if (numStr.search(/[eE]/) !== -1) {
            if (options.eNotation) return num;
            else return str;
          } else if (eNotation) {
            if (options.eNotation) return num;
            else return str;
          } else if (trimmedStr.indexOf(".") !== -1) {
            if (numStr === "0" && numTrimmedByZeros === "") return num;
            else if (numStr === numTrimmedByZeros) return num;
            else if (sign && numStr === "-" + numTrimmedByZeros) return num;
            else return str;
          }
          if (leadingZeros) {
            if (numTrimmedByZeros === numStr) return num;
            else if (sign + numTrimmedByZeros === numStr) return num;
            else return str;
          }
          if (trimmedStr === numStr) return num;
          else if (trimmedStr === sign + numStr) return num;
          return str;
        }
      } else {
        return str;
      }
    }
  }
  function trimZeros(numStr) {
    if (numStr && numStr.indexOf(".") !== -1) {
      numStr = numStr.replace(/0+$/, "");
      if (numStr === ".") numStr = "0";
      else if (numStr[0] === ".") numStr = "0" + numStr;
      else if (numStr[numStr.length - 1] === ".") numStr = numStr.substr(0, numStr.length - 1);
      return numStr;
    }
    return numStr;
  }
  strnum = toNumber;
  return strnum;
}
var ignoreAttributes;
var hasRequiredIgnoreAttributes;
function requireIgnoreAttributes() {
  if (hasRequiredIgnoreAttributes) return ignoreAttributes;
  hasRequiredIgnoreAttributes = 1;
  function getIgnoreAttributesFn(ignoreAttributes2) {
    if (typeof ignoreAttributes2 === "function") {
      return ignoreAttributes2;
    }
    if (Array.isArray(ignoreAttributes2)) {
      return (attrName) => {
        for (const pattern of ignoreAttributes2) {
          if (typeof pattern === "string" && attrName === pattern) {
            return true;
          }
          if (pattern instanceof RegExp && pattern.test(attrName)) {
            return true;
          }
        }
      };
    }
    return () => false;
  }
  ignoreAttributes = getIgnoreAttributesFn;
  return ignoreAttributes;
}
var OrderedObjParser_1;
var hasRequiredOrderedObjParser;
function requireOrderedObjParser() {
  if (hasRequiredOrderedObjParser) return OrderedObjParser_1;
  hasRequiredOrderedObjParser = 1;
  const util2 = requireUtil();
  const xmlNode2 = requireXmlNode();
  const readDocType = requireDocTypeReader();
  const toNumber = requireStrnum();
  const getIgnoreAttributesFn = requireIgnoreAttributes();
  class OrderedObjParser {
    constructor(options) {
      this.options = options;
      this.currentNode = null;
      this.tagsNodeStack = [];
      this.docTypeEntities = {};
      this.lastEntities = {
        "apos": { regex: /&(apos|#39|#x27);/g, val: "'" },
        "gt": { regex: /&(gt|#62|#x3E);/g, val: ">" },
        "lt": { regex: /&(lt|#60|#x3C);/g, val: "<" },
        "quot": { regex: /&(quot|#34|#x22);/g, val: '"' }
      };
      this.ampEntity = { regex: /&(amp|#38|#x26);/g, val: "&" };
      this.htmlEntities = {
        "space": { regex: /&(nbsp|#160);/g, val: " " },
        // "lt" : { regex: /&(lt|#60);/g, val: "<" },
        // "gt" : { regex: /&(gt|#62);/g, val: ">" },
        // "amp" : { regex: /&(amp|#38);/g, val: "&" },
        // "quot" : { regex: /&(quot|#34);/g, val: "\"" },
        // "apos" : { regex: /&(apos|#39);/g, val: "'" },
        "cent": { regex: /&(cent|#162);/g, val: "¢" },
        "pound": { regex: /&(pound|#163);/g, val: "£" },
        "yen": { regex: /&(yen|#165);/g, val: "¥" },
        "euro": { regex: /&(euro|#8364);/g, val: "€" },
        "copyright": { regex: /&(copy|#169);/g, val: "©" },
        "reg": { regex: /&(reg|#174);/g, val: "®" },
        "inr": { regex: /&(inr|#8377);/g, val: "₹" },
        "num_dec": { regex: /&#([0-9]{1,7});/g, val: (_, str) => String.fromCharCode(Number.parseInt(str, 10)) },
        "num_hex": { regex: /&#x([0-9a-fA-F]{1,6});/g, val: (_, str) => String.fromCharCode(Number.parseInt(str, 16)) }
      };
      this.addExternalEntities = addExternalEntities;
      this.parseXml = parseXml;
      this.parseTextData = parseTextData;
      this.resolveNameSpace = resolveNameSpace;
      this.buildAttributesMap = buildAttributesMap;
      this.isItStopNode = isItStopNode;
      this.replaceEntitiesValue = replaceEntitiesValue;
      this.readStopNodeData = readStopNodeData;
      this.saveTextToParentTag = saveTextToParentTag;
      this.addChild = addChild;
      this.ignoreAttributesFn = getIgnoreAttributesFn(this.options.ignoreAttributes);
    }
  }
  function addExternalEntities(externalEntities) {
    const entKeys = Object.keys(externalEntities);
    for (let i2 = 0; i2 < entKeys.length; i2++) {
      const ent = entKeys[i2];
      this.lastEntities[ent] = {
        regex: new RegExp("&" + ent + ";", "g"),
        val: externalEntities[ent]
      };
    }
  }
  function parseTextData(val, tagName, jPath, dontTrim, hasAttributes, isLeafNode, escapeEntities) {
    if (val !== void 0) {
      if (this.options.trimValues && !dontTrim) {
        val = val.trim();
      }
      if (val.length > 0) {
        if (!escapeEntities) val = this.replaceEntitiesValue(val);
        const newval = this.options.tagValueProcessor(tagName, val, jPath, hasAttributes, isLeafNode);
        if (newval === null || newval === void 0) {
          return val;
        } else if (typeof newval !== typeof val || newval !== val) {
          return newval;
        } else if (this.options.trimValues) {
          return parseValue(val, this.options.parseTagValue, this.options.numberParseOptions);
        } else {
          const trimmedVal = val.trim();
          if (trimmedVal === val) {
            return parseValue(val, this.options.parseTagValue, this.options.numberParseOptions);
          } else {
            return val;
          }
        }
      }
    }
  }
  function resolveNameSpace(tagname) {
    if (this.options.removeNSPrefix) {
      const tags = tagname.split(":");
      const prefix = tagname.charAt(0) === "/" ? "/" : "";
      if (tags[0] === "xmlns") {
        return "";
      }
      if (tags.length === 2) {
        tagname = prefix + tags[1];
      }
    }
    return tagname;
  }
  const attrsRegx = new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`, "gm");
  function buildAttributesMap(attrStr, jPath, tagName) {
    if (this.options.ignoreAttributes !== true && typeof attrStr === "string") {
      const matches = util2.getAllMatches(attrStr, attrsRegx);
      const len = matches.length;
      const attrs = {};
      for (let i2 = 0; i2 < len; i2++) {
        const attrName = this.resolveNameSpace(matches[i2][1]);
        if (this.ignoreAttributesFn(attrName, jPath)) {
          continue;
        }
        let oldVal = matches[i2][4];
        let aName = this.options.attributeNamePrefix + attrName;
        if (attrName.length) {
          if (this.options.transformAttributeName) {
            aName = this.options.transformAttributeName(aName);
          }
          if (aName === "__proto__") aName = "#__proto__";
          if (oldVal !== void 0) {
            if (this.options.trimValues) {
              oldVal = oldVal.trim();
            }
            oldVal = this.replaceEntitiesValue(oldVal);
            const newVal = this.options.attributeValueProcessor(attrName, oldVal, jPath);
            if (newVal === null || newVal === void 0) {
              attrs[aName] = oldVal;
            } else if (typeof newVal !== typeof oldVal || newVal !== oldVal) {
              attrs[aName] = newVal;
            } else {
              attrs[aName] = parseValue(
                oldVal,
                this.options.parseAttributeValue,
                this.options.numberParseOptions
              );
            }
          } else if (this.options.allowBooleanAttributes) {
            attrs[aName] = true;
          }
        }
      }
      if (!Object.keys(attrs).length) {
        return;
      }
      if (this.options.attributesGroupName) {
        const attrCollection = {};
        attrCollection[this.options.attributesGroupName] = attrs;
        return attrCollection;
      }
      return attrs;
    }
  }
  const parseXml = function(xmlData) {
    xmlData = xmlData.replace(/\r\n?/g, "\n");
    const xmlObj = new xmlNode2("!xml");
    let currentNode = xmlObj;
    let textData = "";
    let jPath = "";
    for (let i2 = 0; i2 < xmlData.length; i2++) {
      const ch = xmlData[i2];
      if (ch === "<") {
        if (xmlData[i2 + 1] === "/") {
          const closeIndex = findClosingIndex(xmlData, ">", i2, "Closing Tag is not closed.");
          let tagName = xmlData.substring(i2 + 2, closeIndex).trim();
          if (this.options.removeNSPrefix) {
            const colonIndex = tagName.indexOf(":");
            if (colonIndex !== -1) {
              tagName = tagName.substr(colonIndex + 1);
            }
          }
          if (this.options.transformTagName) {
            tagName = this.options.transformTagName(tagName);
          }
          if (currentNode) {
            textData = this.saveTextToParentTag(textData, currentNode, jPath);
          }
          const lastTagName = jPath.substring(jPath.lastIndexOf(".") + 1);
          if (tagName && this.options.unpairedTags.indexOf(tagName) !== -1) {
            throw new Error(`Unpaired tag can not be used as closing tag: </${tagName}>`);
          }
          let propIndex = 0;
          if (lastTagName && this.options.unpairedTags.indexOf(lastTagName) !== -1) {
            propIndex = jPath.lastIndexOf(".", jPath.lastIndexOf(".") - 1);
            this.tagsNodeStack.pop();
          } else {
            propIndex = jPath.lastIndexOf(".");
          }
          jPath = jPath.substring(0, propIndex);
          currentNode = this.tagsNodeStack.pop();
          textData = "";
          i2 = closeIndex;
        } else if (xmlData[i2 + 1] === "?") {
          let tagData = readTagExp(xmlData, i2, false, "?>");
          if (!tagData) throw new Error("Pi Tag is not closed.");
          textData = this.saveTextToParentTag(textData, currentNode, jPath);
          if (this.options.ignoreDeclaration && tagData.tagName === "?xml" || this.options.ignorePiTags) ;
          else {
            const childNode = new xmlNode2(tagData.tagName);
            childNode.add(this.options.textNodeName, "");
            if (tagData.tagName !== tagData.tagExp && tagData.attrExpPresent) {
              childNode[":@"] = this.buildAttributesMap(tagData.tagExp, jPath, tagData.tagName);
            }
            this.addChild(currentNode, childNode, jPath);
          }
          i2 = tagData.closeIndex + 1;
        } else if (xmlData.substr(i2 + 1, 3) === "!--") {
          const endIndex = findClosingIndex(xmlData, "-->", i2 + 4, "Comment is not closed.");
          if (this.options.commentPropName) {
            const comment = xmlData.substring(i2 + 4, endIndex - 2);
            textData = this.saveTextToParentTag(textData, currentNode, jPath);
            currentNode.add(this.options.commentPropName, [{ [this.options.textNodeName]: comment }]);
          }
          i2 = endIndex;
        } else if (xmlData.substr(i2 + 1, 2) === "!D") {
          const result = readDocType(xmlData, i2);
          this.docTypeEntities = result.entities;
          i2 = result.i;
        } else if (xmlData.substr(i2 + 1, 2) === "![") {
          const closeIndex = findClosingIndex(xmlData, "]]>", i2, "CDATA is not closed.") - 2;
          const tagExp = xmlData.substring(i2 + 9, closeIndex);
          textData = this.saveTextToParentTag(textData, currentNode, jPath);
          let val = this.parseTextData(tagExp, currentNode.tagname, jPath, true, false, true, true);
          if (val == void 0) val = "";
          if (this.options.cdataPropName) {
            currentNode.add(this.options.cdataPropName, [{ [this.options.textNodeName]: tagExp }]);
          } else {
            currentNode.add(this.options.textNodeName, val);
          }
          i2 = closeIndex + 2;
        } else {
          let result = readTagExp(xmlData, i2, this.options.removeNSPrefix);
          let tagName = result.tagName;
          const rawTagName = result.rawTagName;
          let tagExp = result.tagExp;
          let attrExpPresent = result.attrExpPresent;
          let closeIndex = result.closeIndex;
          if (this.options.transformTagName) {
            tagName = this.options.transformTagName(tagName);
          }
          if (currentNode && textData) {
            if (currentNode.tagname !== "!xml") {
              textData = this.saveTextToParentTag(textData, currentNode, jPath, false);
            }
          }
          const lastTag = currentNode;
          if (lastTag && this.options.unpairedTags.indexOf(lastTag.tagname) !== -1) {
            currentNode = this.tagsNodeStack.pop();
            jPath = jPath.substring(0, jPath.lastIndexOf("."));
          }
          if (tagName !== xmlObj.tagname) {
            jPath += jPath ? "." + tagName : tagName;
          }
          if (this.isItStopNode(this.options.stopNodes, jPath, tagName)) {
            let tagContent = "";
            if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
              if (tagName[tagName.length - 1] === "/") {
                tagName = tagName.substr(0, tagName.length - 1);
                jPath = jPath.substr(0, jPath.length - 1);
                tagExp = tagName;
              } else {
                tagExp = tagExp.substr(0, tagExp.length - 1);
              }
              i2 = result.closeIndex;
            } else if (this.options.unpairedTags.indexOf(tagName) !== -1) {
              i2 = result.closeIndex;
            } else {
              const result2 = this.readStopNodeData(xmlData, rawTagName, closeIndex + 1);
              if (!result2) throw new Error(`Unexpected end of ${rawTagName}`);
              i2 = result2.i;
              tagContent = result2.tagContent;
            }
            const childNode = new xmlNode2(tagName);
            if (tagName !== tagExp && attrExpPresent) {
              childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
            }
            if (tagContent) {
              tagContent = this.parseTextData(tagContent, tagName, jPath, true, attrExpPresent, true, true);
            }
            jPath = jPath.substr(0, jPath.lastIndexOf("."));
            childNode.add(this.options.textNodeName, tagContent);
            this.addChild(currentNode, childNode, jPath);
          } else {
            if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
              if (tagName[tagName.length - 1] === "/") {
                tagName = tagName.substr(0, tagName.length - 1);
                jPath = jPath.substr(0, jPath.length - 1);
                tagExp = tagName;
              } else {
                tagExp = tagExp.substr(0, tagExp.length - 1);
              }
              if (this.options.transformTagName) {
                tagName = this.options.transformTagName(tagName);
              }
              const childNode = new xmlNode2(tagName);
              if (tagName !== tagExp && attrExpPresent) {
                childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
              }
              this.addChild(currentNode, childNode, jPath);
              jPath = jPath.substr(0, jPath.lastIndexOf("."));
            } else {
              const childNode = new xmlNode2(tagName);
              this.tagsNodeStack.push(currentNode);
              if (tagName !== tagExp && attrExpPresent) {
                childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
              }
              this.addChild(currentNode, childNode, jPath);
              currentNode = childNode;
            }
            textData = "";
            i2 = closeIndex;
          }
        }
      } else {
        textData += xmlData[i2];
      }
    }
    return xmlObj.child;
  };
  function addChild(currentNode, childNode, jPath) {
    const result = this.options.updateTag(childNode.tagname, jPath, childNode[":@"]);
    if (result === false) ;
    else if (typeof result === "string") {
      childNode.tagname = result;
      currentNode.addChild(childNode);
    } else {
      currentNode.addChild(childNode);
    }
  }
  const replaceEntitiesValue = function(val) {
    if (this.options.processEntities) {
      for (let entityName in this.docTypeEntities) {
        const entity = this.docTypeEntities[entityName];
        val = val.replace(entity.regx, entity.val);
      }
      for (let entityName in this.lastEntities) {
        const entity = this.lastEntities[entityName];
        val = val.replace(entity.regex, entity.val);
      }
      if (this.options.htmlEntities) {
        for (let entityName in this.htmlEntities) {
          const entity = this.htmlEntities[entityName];
          val = val.replace(entity.regex, entity.val);
        }
      }
      val = val.replace(this.ampEntity.regex, this.ampEntity.val);
    }
    return val;
  };
  function saveTextToParentTag(textData, currentNode, jPath, isLeafNode) {
    if (textData) {
      if (isLeafNode === void 0) isLeafNode = Object.keys(currentNode.child).length === 0;
      textData = this.parseTextData(
        textData,
        currentNode.tagname,
        jPath,
        false,
        currentNode[":@"] ? Object.keys(currentNode[":@"]).length !== 0 : false,
        isLeafNode
      );
      if (textData !== void 0 && textData !== "")
        currentNode.add(this.options.textNodeName, textData);
      textData = "";
    }
    return textData;
  }
  function isItStopNode(stopNodes, jPath, currentTagName) {
    const allNodesExp = "*." + currentTagName;
    for (const stopNodePath in stopNodes) {
      const stopNodeExp = stopNodes[stopNodePath];
      if (allNodesExp === stopNodeExp || jPath === stopNodeExp) return true;
    }
    return false;
  }
  function tagExpWithClosingIndex(xmlData, i2, closingChar = ">") {
    let attrBoundary;
    let tagExp = "";
    for (let index = i2; index < xmlData.length; index++) {
      let ch = xmlData[index];
      if (attrBoundary) {
        if (ch === attrBoundary) attrBoundary = "";
      } else if (ch === '"' || ch === "'") {
        attrBoundary = ch;
      } else if (ch === closingChar[0]) {
        if (closingChar[1]) {
          if (xmlData[index + 1] === closingChar[1]) {
            return {
              data: tagExp,
              index
            };
          }
        } else {
          return {
            data: tagExp,
            index
          };
        }
      } else if (ch === "	") {
        ch = " ";
      }
      tagExp += ch;
    }
  }
  function findClosingIndex(xmlData, str, i2, errMsg) {
    const closingIndex = xmlData.indexOf(str, i2);
    if (closingIndex === -1) {
      throw new Error(errMsg);
    } else {
      return closingIndex + str.length - 1;
    }
  }
  function readTagExp(xmlData, i2, removeNSPrefix, closingChar = ">") {
    const result = tagExpWithClosingIndex(xmlData, i2 + 1, closingChar);
    if (!result) return;
    let tagExp = result.data;
    const closeIndex = result.index;
    const separatorIndex = tagExp.search(/\s/);
    let tagName = tagExp;
    let attrExpPresent = true;
    if (separatorIndex !== -1) {
      tagName = tagExp.substring(0, separatorIndex);
      tagExp = tagExp.substring(separatorIndex + 1).trimStart();
    }
    const rawTagName = tagName;
    if (removeNSPrefix) {
      const colonIndex = tagName.indexOf(":");
      if (colonIndex !== -1) {
        tagName = tagName.substr(colonIndex + 1);
        attrExpPresent = tagName !== result.data.substr(colonIndex + 1);
      }
    }
    return {
      tagName,
      tagExp,
      closeIndex,
      attrExpPresent,
      rawTagName
    };
  }
  function readStopNodeData(xmlData, tagName, i2) {
    const startIndex = i2;
    let openTagCount = 1;
    for (; i2 < xmlData.length; i2++) {
      if (xmlData[i2] === "<") {
        if (xmlData[i2 + 1] === "/") {
          const closeIndex = findClosingIndex(xmlData, ">", i2, `${tagName} is not closed`);
          let closeTagName = xmlData.substring(i2 + 2, closeIndex).trim();
          if (closeTagName === tagName) {
            openTagCount--;
            if (openTagCount === 0) {
              return {
                tagContent: xmlData.substring(startIndex, i2),
                i: closeIndex
              };
            }
          }
          i2 = closeIndex;
        } else if (xmlData[i2 + 1] === "?") {
          const closeIndex = findClosingIndex(xmlData, "?>", i2 + 1, "StopNode is not closed.");
          i2 = closeIndex;
        } else if (xmlData.substr(i2 + 1, 3) === "!--") {
          const closeIndex = findClosingIndex(xmlData, "-->", i2 + 3, "StopNode is not closed.");
          i2 = closeIndex;
        } else if (xmlData.substr(i2 + 1, 2) === "![") {
          const closeIndex = findClosingIndex(xmlData, "]]>", i2, "StopNode is not closed.") - 2;
          i2 = closeIndex;
        } else {
          const tagData = readTagExp(xmlData, i2, ">");
          if (tagData) {
            const openTagName = tagData && tagData.tagName;
            if (openTagName === tagName && tagData.tagExp[tagData.tagExp.length - 1] !== "/") {
              openTagCount++;
            }
            i2 = tagData.closeIndex;
          }
        }
      }
    }
  }
  function parseValue(val, shouldParse, options) {
    if (shouldParse && typeof val === "string") {
      const newval = val.trim();
      if (newval === "true") return true;
      else if (newval === "false") return false;
      else return toNumber(val, options);
    } else {
      if (util2.isExist(val)) {
        return val;
      } else {
        return "";
      }
    }
  }
  OrderedObjParser_1 = OrderedObjParser;
  return OrderedObjParser_1;
}
var node2json = {};
var hasRequiredNode2json;
function requireNode2json() {
  if (hasRequiredNode2json) return node2json;
  hasRequiredNode2json = 1;
  function prettify(node, options) {
    return compress(node, options);
  }
  function compress(arr, options, jPath) {
    let text;
    const compressedObj = {};
    for (let i2 = 0; i2 < arr.length; i2++) {
      const tagObj = arr[i2];
      const property = propName(tagObj);
      let newJpath = "";
      if (jPath === void 0) newJpath = property;
      else newJpath = jPath + "." + property;
      if (property === options.textNodeName) {
        if (text === void 0) text = tagObj[property];
        else text += "" + tagObj[property];
      } else if (property === void 0) {
        continue;
      } else if (tagObj[property]) {
        let val = compress(tagObj[property], options, newJpath);
        const isLeaf = isLeafTag(val, options);
        if (tagObj[":@"]) {
          assignAttributes(val, tagObj[":@"], newJpath, options);
        } else if (Object.keys(val).length === 1 && val[options.textNodeName] !== void 0 && !options.alwaysCreateTextNode) {
          val = val[options.textNodeName];
        } else if (Object.keys(val).length === 0) {
          if (options.alwaysCreateTextNode) val[options.textNodeName] = "";
          else val = "";
        }
        if (compressedObj[property] !== void 0 && compressedObj.hasOwnProperty(property)) {
          if (!Array.isArray(compressedObj[property])) {
            compressedObj[property] = [compressedObj[property]];
          }
          compressedObj[property].push(val);
        } else {
          if (options.isArray(property, newJpath, isLeaf)) {
            compressedObj[property] = [val];
          } else {
            compressedObj[property] = val;
          }
        }
      }
    }
    if (typeof text === "string") {
      if (text.length > 0) compressedObj[options.textNodeName] = text;
    } else if (text !== void 0) compressedObj[options.textNodeName] = text;
    return compressedObj;
  }
  function propName(obj) {
    const keys = Object.keys(obj);
    for (let i2 = 0; i2 < keys.length; i2++) {
      const key = keys[i2];
      if (key !== ":@") return key;
    }
  }
  function assignAttributes(obj, attrMap, jpath, options) {
    if (attrMap) {
      const keys = Object.keys(attrMap);
      const len = keys.length;
      for (let i2 = 0; i2 < len; i2++) {
        const atrrName = keys[i2];
        if (options.isArray(atrrName, jpath + "." + atrrName, true, true)) {
          obj[atrrName] = [attrMap[atrrName]];
        } else {
          obj[atrrName] = attrMap[atrrName];
        }
      }
    }
  }
  function isLeafTag(obj, options) {
    const { textNodeName } = options;
    const propCount = Object.keys(obj).length;
    if (propCount === 0) {
      return true;
    }
    if (propCount === 1 && (obj[textNodeName] || typeof obj[textNodeName] === "boolean" || obj[textNodeName] === 0)) {
      return true;
    }
    return false;
  }
  node2json.prettify = prettify;
  return node2json;
}
var XMLParser_1;
var hasRequiredXMLParser;
function requireXMLParser() {
  if (hasRequiredXMLParser) return XMLParser_1;
  hasRequiredXMLParser = 1;
  const { buildOptions } = requireOptionsBuilder();
  const OrderedObjParser = requireOrderedObjParser();
  const { prettify } = requireNode2json();
  const validator2 = requireValidator();
  class XMLParser {
    constructor(options) {
      this.externalEntities = {};
      this.options = buildOptions(options);
    }
    /**
     * Parse XML dats to JS object 
     * @param {string|Buffer} xmlData 
     * @param {boolean|Object} validationOption 
     */
    parse(xmlData, validationOption) {
      if (typeof xmlData === "string") ;
      else if (xmlData.toString) {
        xmlData = xmlData.toString();
      } else {
        throw new Error("XML data is accepted in String or Bytes[] form.");
      }
      if (validationOption) {
        if (validationOption === true) validationOption = {};
        const result = validator2.validate(xmlData, validationOption);
        if (result !== true) {
          throw Error(`${result.err.msg}:${result.err.line}:${result.err.col}`);
        }
      }
      const orderedObjParser = new OrderedObjParser(this.options);
      orderedObjParser.addExternalEntities(this.externalEntities);
      const orderedResult = orderedObjParser.parseXml(xmlData);
      if (this.options.preserveOrder || orderedResult === void 0) return orderedResult;
      else return prettify(orderedResult, this.options);
    }
    /**
     * Add Entity which is not by default supported by this library
     * @param {string} key 
     * @param {string} value 
     */
    addEntity(key, value) {
      if (value.indexOf("&") !== -1) {
        throw new Error("Entity value can't have '&'");
      } else if (key.indexOf("&") !== -1 || key.indexOf(";") !== -1) {
        throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
      } else if (value === "&") {
        throw new Error("An entity with value '&' is not permitted");
      } else {
        this.externalEntities[key] = value;
      }
    }
  }
  XMLParser_1 = XMLParser;
  return XMLParser_1;
}
var orderedJs2Xml;
var hasRequiredOrderedJs2Xml;
function requireOrderedJs2Xml() {
  if (hasRequiredOrderedJs2Xml) return orderedJs2Xml;
  hasRequiredOrderedJs2Xml = 1;
  const EOL = "\n";
  function toXml(jArray, options) {
    let indentation = "";
    if (options.format && options.indentBy.length > 0) {
      indentation = EOL;
    }
    return arrToStr(jArray, options, "", indentation);
  }
  function arrToStr(arr, options, jPath, indentation) {
    let xmlStr = "";
    let isPreviousElementTag = false;
    for (let i2 = 0; i2 < arr.length; i2++) {
      const tagObj = arr[i2];
      const tagName = propName(tagObj);
      if (tagName === void 0) continue;
      let newJPath = "";
      if (jPath.length === 0) newJPath = tagName;
      else newJPath = `${jPath}.${tagName}`;
      if (tagName === options.textNodeName) {
        let tagText = tagObj[tagName];
        if (!isStopNode(newJPath, options)) {
          tagText = options.tagValueProcessor(tagName, tagText);
          tagText = replaceEntitiesValue(tagText, options);
        }
        if (isPreviousElementTag) {
          xmlStr += indentation;
        }
        xmlStr += tagText;
        isPreviousElementTag = false;
        continue;
      } else if (tagName === options.cdataPropName) {
        if (isPreviousElementTag) {
          xmlStr += indentation;
        }
        xmlStr += `<![CDATA[${tagObj[tagName][0][options.textNodeName]}]]>`;
        isPreviousElementTag = false;
        continue;
      } else if (tagName === options.commentPropName) {
        xmlStr += indentation + `<!--${tagObj[tagName][0][options.textNodeName]}-->`;
        isPreviousElementTag = true;
        continue;
      } else if (tagName[0] === "?") {
        const attStr2 = attr_to_str(tagObj[":@"], options);
        const tempInd = tagName === "?xml" ? "" : indentation;
        let piTextNodeName = tagObj[tagName][0][options.textNodeName];
        piTextNodeName = piTextNodeName.length !== 0 ? " " + piTextNodeName : "";
        xmlStr += tempInd + `<${tagName}${piTextNodeName}${attStr2}?>`;
        isPreviousElementTag = true;
        continue;
      }
      let newIdentation = indentation;
      if (newIdentation !== "") {
        newIdentation += options.indentBy;
      }
      const attStr = attr_to_str(tagObj[":@"], options);
      const tagStart = indentation + `<${tagName}${attStr}`;
      const tagValue = arrToStr(tagObj[tagName], options, newJPath, newIdentation);
      if (options.unpairedTags.indexOf(tagName) !== -1) {
        if (options.suppressUnpairedNode) xmlStr += tagStart + ">";
        else xmlStr += tagStart + "/>";
      } else if ((!tagValue || tagValue.length === 0) && options.suppressEmptyNode) {
        xmlStr += tagStart + "/>";
      } else if (tagValue && tagValue.endsWith(">")) {
        xmlStr += tagStart + `>${tagValue}${indentation}</${tagName}>`;
      } else {
        xmlStr += tagStart + ">";
        if (tagValue && indentation !== "" && (tagValue.includes("/>") || tagValue.includes("</"))) {
          xmlStr += indentation + options.indentBy + tagValue + indentation;
        } else {
          xmlStr += tagValue;
        }
        xmlStr += `</${tagName}>`;
      }
      isPreviousElementTag = true;
    }
    return xmlStr;
  }
  function propName(obj) {
    const keys = Object.keys(obj);
    for (let i2 = 0; i2 < keys.length; i2++) {
      const key = keys[i2];
      if (!obj.hasOwnProperty(key)) continue;
      if (key !== ":@") return key;
    }
  }
  function attr_to_str(attrMap, options) {
    let attrStr = "";
    if (attrMap && !options.ignoreAttributes) {
      for (let attr in attrMap) {
        if (!attrMap.hasOwnProperty(attr)) continue;
        let attrVal = options.attributeValueProcessor(attr, attrMap[attr]);
        attrVal = replaceEntitiesValue(attrVal, options);
        if (attrVal === true && options.suppressBooleanAttributes) {
          attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}`;
        } else {
          attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}="${attrVal}"`;
        }
      }
    }
    return attrStr;
  }
  function isStopNode(jPath, options) {
    jPath = jPath.substr(0, jPath.length - options.textNodeName.length - 1);
    let tagName = jPath.substr(jPath.lastIndexOf(".") + 1);
    for (let index in options.stopNodes) {
      if (options.stopNodes[index] === jPath || options.stopNodes[index] === "*." + tagName) return true;
    }
    return false;
  }
  function replaceEntitiesValue(textValue, options) {
    if (textValue && textValue.length > 0 && options.processEntities) {
      for (let i2 = 0; i2 < options.entities.length; i2++) {
        const entity = options.entities[i2];
        textValue = textValue.replace(entity.regex, entity.val);
      }
    }
    return textValue;
  }
  orderedJs2Xml = toXml;
  return orderedJs2Xml;
}
var json2xml;
var hasRequiredJson2xml;
function requireJson2xml() {
  if (hasRequiredJson2xml) return json2xml;
  hasRequiredJson2xml = 1;
  const buildFromOrderedJs = requireOrderedJs2Xml();
  const getIgnoreAttributesFn = requireIgnoreAttributes();
  const defaultOptions = {
    attributeNamePrefix: "@_",
    attributesGroupName: false,
    textNodeName: "#text",
    ignoreAttributes: true,
    cdataPropName: false,
    format: false,
    indentBy: "  ",
    suppressEmptyNode: false,
    suppressUnpairedNode: true,
    suppressBooleanAttributes: true,
    tagValueProcessor: function(key, a2) {
      return a2;
    },
    attributeValueProcessor: function(attrName, a2) {
      return a2;
    },
    preserveOrder: false,
    commentPropName: false,
    unpairedTags: [],
    entities: [
      { regex: new RegExp("&", "g"), val: "&amp;" },
      //it must be on top
      { regex: new RegExp(">", "g"), val: "&gt;" },
      { regex: new RegExp("<", "g"), val: "&lt;" },
      { regex: new RegExp("'", "g"), val: "&apos;" },
      { regex: new RegExp('"', "g"), val: "&quot;" }
    ],
    processEntities: true,
    stopNodes: [],
    // transformTagName: false,
    // transformAttributeName: false,
    oneListGroup: false
  };
  function Builder(options) {
    this.options = Object.assign({}, defaultOptions, options);
    if (this.options.ignoreAttributes === true || this.options.attributesGroupName) {
      this.isAttribute = function() {
        return false;
      };
    } else {
      this.ignoreAttributesFn = getIgnoreAttributesFn(this.options.ignoreAttributes);
      this.attrPrefixLen = this.options.attributeNamePrefix.length;
      this.isAttribute = isAttribute;
    }
    this.processTextOrObjNode = processTextOrObjNode;
    if (this.options.format) {
      this.indentate = indentate;
      this.tagEndChar = ">\n";
      this.newLine = "\n";
    } else {
      this.indentate = function() {
        return "";
      };
      this.tagEndChar = ">";
      this.newLine = "";
    }
  }
  Builder.prototype.build = function(jObj) {
    if (this.options.preserveOrder) {
      return buildFromOrderedJs(jObj, this.options);
    } else {
      if (Array.isArray(jObj) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1) {
        jObj = {
          [this.options.arrayNodeName]: jObj
        };
      }
      return this.j2x(jObj, 0, []).val;
    }
  };
  Builder.prototype.j2x = function(jObj, level, ajPath) {
    let attrStr = "";
    let val = "";
    const jPath = ajPath.join(".");
    for (let key in jObj) {
      if (!Object.prototype.hasOwnProperty.call(jObj, key)) continue;
      if (typeof jObj[key] === "undefined") {
        if (this.isAttribute(key)) {
          val += "";
        }
      } else if (jObj[key] === null) {
        if (this.isAttribute(key)) {
          val += "";
        } else if (key[0] === "?") {
          val += this.indentate(level) + "<" + key + "?" + this.tagEndChar;
        } else {
          val += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
        }
      } else if (jObj[key] instanceof Date) {
        val += this.buildTextValNode(jObj[key], key, "", level);
      } else if (typeof jObj[key] !== "object") {
        const attr = this.isAttribute(key);
        if (attr && !this.ignoreAttributesFn(attr, jPath)) {
          attrStr += this.buildAttrPairStr(attr, "" + jObj[key]);
        } else if (!attr) {
          if (key === this.options.textNodeName) {
            let newval = this.options.tagValueProcessor(key, "" + jObj[key]);
            val += this.replaceEntitiesValue(newval);
          } else {
            val += this.buildTextValNode(jObj[key], key, "", level);
          }
        }
      } else if (Array.isArray(jObj[key])) {
        const arrLen = jObj[key].length;
        let listTagVal = "";
        let listTagAttr = "";
        for (let j2 = 0; j2 < arrLen; j2++) {
          const item = jObj[key][j2];
          if (typeof item === "undefined") ;
          else if (item === null) {
            if (key[0] === "?") val += this.indentate(level) + "<" + key + "?" + this.tagEndChar;
            else val += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
          } else if (typeof item === "object") {
            if (this.options.oneListGroup) {
              const result = this.j2x(item, level + 1, ajPath.concat(key));
              listTagVal += result.val;
              if (this.options.attributesGroupName && item.hasOwnProperty(this.options.attributesGroupName)) {
                listTagAttr += result.attrStr;
              }
            } else {
              listTagVal += this.processTextOrObjNode(item, key, level, ajPath);
            }
          } else {
            if (this.options.oneListGroup) {
              let textValue = this.options.tagValueProcessor(key, item);
              textValue = this.replaceEntitiesValue(textValue);
              listTagVal += textValue;
            } else {
              listTagVal += this.buildTextValNode(item, key, "", level);
            }
          }
        }
        if (this.options.oneListGroup) {
          listTagVal = this.buildObjectNode(listTagVal, key, listTagAttr, level);
        }
        val += listTagVal;
      } else {
        if (this.options.attributesGroupName && key === this.options.attributesGroupName) {
          const Ks = Object.keys(jObj[key]);
          const L = Ks.length;
          for (let j2 = 0; j2 < L; j2++) {
            attrStr += this.buildAttrPairStr(Ks[j2], "" + jObj[key][Ks[j2]]);
          }
        } else {
          val += this.processTextOrObjNode(jObj[key], key, level, ajPath);
        }
      }
    }
    return { attrStr, val };
  };
  Builder.prototype.buildAttrPairStr = function(attrName, val) {
    val = this.options.attributeValueProcessor(attrName, "" + val);
    val = this.replaceEntitiesValue(val);
    if (this.options.suppressBooleanAttributes && val === "true") {
      return " " + attrName;
    } else return " " + attrName + '="' + val + '"';
  };
  function processTextOrObjNode(object, key, level, ajPath) {
    const result = this.j2x(object, level + 1, ajPath.concat(key));
    if (object[this.options.textNodeName] !== void 0 && Object.keys(object).length === 1) {
      return this.buildTextValNode(object[this.options.textNodeName], key, result.attrStr, level);
    } else {
      return this.buildObjectNode(result.val, key, result.attrStr, level);
    }
  }
  Builder.prototype.buildObjectNode = function(val, key, attrStr, level) {
    if (val === "") {
      if (key[0] === "?") return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
      else {
        return this.indentate(level) + "<" + key + attrStr + this.closeTag(key) + this.tagEndChar;
      }
    } else {
      let tagEndExp = "</" + key + this.tagEndChar;
      let piClosingChar = "";
      if (key[0] === "?") {
        piClosingChar = "?";
        tagEndExp = "";
      }
      if ((attrStr || attrStr === "") && val.indexOf("<") === -1) {
        return this.indentate(level) + "<" + key + attrStr + piClosingChar + ">" + val + tagEndExp;
      } else if (this.options.commentPropName !== false && key === this.options.commentPropName && piClosingChar.length === 0) {
        return this.indentate(level) + `<!--${val}-->` + this.newLine;
      } else {
        return this.indentate(level) + "<" + key + attrStr + piClosingChar + this.tagEndChar + val + this.indentate(level) + tagEndExp;
      }
    }
  };
  Builder.prototype.closeTag = function(key) {
    let closeTag = "";
    if (this.options.unpairedTags.indexOf(key) !== -1) {
      if (!this.options.suppressUnpairedNode) closeTag = "/";
    } else if (this.options.suppressEmptyNode) {
      closeTag = "/";
    } else {
      closeTag = `></${key}`;
    }
    return closeTag;
  };
  Builder.prototype.buildTextValNode = function(val, key, attrStr, level) {
    if (this.options.cdataPropName !== false && key === this.options.cdataPropName) {
      return this.indentate(level) + `<![CDATA[${val}]]>` + this.newLine;
    } else if (this.options.commentPropName !== false && key === this.options.commentPropName) {
      return this.indentate(level) + `<!--${val}-->` + this.newLine;
    } else if (key[0] === "?") {
      return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
    } else {
      let textValue = this.options.tagValueProcessor(key, val);
      textValue = this.replaceEntitiesValue(textValue);
      if (textValue === "") {
        return this.indentate(level) + "<" + key + attrStr + this.closeTag(key) + this.tagEndChar;
      } else {
        return this.indentate(level) + "<" + key + attrStr + ">" + textValue + "</" + key + this.tagEndChar;
      }
    }
  };
  Builder.prototype.replaceEntitiesValue = function(textValue) {
    if (textValue && textValue.length > 0 && this.options.processEntities) {
      for (let i2 = 0; i2 < this.options.entities.length; i2++) {
        const entity = this.options.entities[i2];
        textValue = textValue.replace(entity.regex, entity.val);
      }
    }
    return textValue;
  };
  function indentate(level) {
    return this.options.indentBy.repeat(level);
  }
  function isAttribute(name) {
    if (name.startsWith(this.options.attributeNamePrefix) && name !== this.options.textNodeName) {
      return name.substr(this.attrPrefixLen);
    } else {
      return false;
    }
  }
  json2xml = Builder;
  return json2xml;
}
var fxp;
var hasRequiredFxp;
function requireFxp() {
  if (hasRequiredFxp) return fxp;
  hasRequiredFxp = 1;
  const validator2 = requireValidator();
  const XMLParser = requireXMLParser();
  const XMLBuilder = requireJson2xml();
  fxp = {
    XMLParser,
    XMLValidator: validator2,
    XMLBuilder
  };
  return fxp;
}
requireFxp();
var debug_1;
var hasRequiredDebug;
function requireDebug() {
  if (hasRequiredDebug) return debug_1;
  hasRequiredDebug = 1;
  const debug = typeof process$1 === "object" && define_process_env_default && define_process_env_default.NODE_DEBUG && /\bsemver\b/i.test(define_process_env_default.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {
  };
  debug_1 = debug;
  return debug_1;
}
var constants;
var hasRequiredConstants;
function requireConstants() {
  if (hasRequiredConstants) return constants;
  hasRequiredConstants = 1;
  const SEMVER_SPEC_VERSION = "2.0.0";
  const MAX_LENGTH = 256;
  const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
  9007199254740991;
  const MAX_SAFE_COMPONENT_LENGTH = 16;
  const MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6;
  const RELEASE_TYPES = [
    "major",
    "premajor",
    "minor",
    "preminor",
    "patch",
    "prepatch",
    "prerelease"
  ];
  constants = {
    MAX_LENGTH,
    MAX_SAFE_COMPONENT_LENGTH,
    MAX_SAFE_BUILD_LENGTH,
    MAX_SAFE_INTEGER,
    RELEASE_TYPES,
    SEMVER_SPEC_VERSION,
    FLAG_INCLUDE_PRERELEASE: 1,
    FLAG_LOOSE: 2
  };
  return constants;
}
var re = { exports: {} };
var hasRequiredRe;
function requireRe() {
  if (hasRequiredRe) return re.exports;
  hasRequiredRe = 1;
  (function(module, exports) {
    const {
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_LENGTH
    } = requireConstants();
    const debug = requireDebug();
    exports = module.exports = {};
    const re2 = exports.re = [];
    const safeRe = exports.safeRe = [];
    const src = exports.src = [];
    const t2 = exports.t = {};
    let R = 0;
    const LETTERDASHNUMBER = "[a-zA-Z0-9-]";
    const safeRegexReplacements = [
      ["\\s", 1],
      ["\\d", MAX_LENGTH],
      [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH]
    ];
    const makeSafeRegex = (value) => {
      for (const [token, max] of safeRegexReplacements) {
        value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
      }
      return value;
    };
    const createToken = (name, value, isGlobal) => {
      const safe = makeSafeRegex(value);
      const index = R++;
      debug(name, index, value);
      t2[name] = index;
      src[index] = value;
      re2[index] = new RegExp(value, isGlobal ? "g" : void 0);
      safeRe[index] = new RegExp(safe, isGlobal ? "g" : void 0);
    };
    createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
    createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
    createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
    createToken("MAINVERSION", `(${src[t2.NUMERICIDENTIFIER]})\\.(${src[t2.NUMERICIDENTIFIER]})\\.(${src[t2.NUMERICIDENTIFIER]})`);
    createToken("MAINVERSIONLOOSE", `(${src[t2.NUMERICIDENTIFIERLOOSE]})\\.(${src[t2.NUMERICIDENTIFIERLOOSE]})\\.(${src[t2.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASEIDENTIFIER", `(?:${src[t2.NUMERICIDENTIFIER]}|${src[t2.NONNUMERICIDENTIFIER]})`);
    createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t2.NUMERICIDENTIFIERLOOSE]}|${src[t2.NONNUMERICIDENTIFIER]})`);
    createToken("PRERELEASE", `(?:-(${src[t2.PRERELEASEIDENTIFIER]}(?:\\.${src[t2.PRERELEASEIDENTIFIER]})*))`);
    createToken("PRERELEASELOOSE", `(?:-?(${src[t2.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t2.PRERELEASEIDENTIFIERLOOSE]})*))`);
    createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
    createToken("BUILD", `(?:\\+(${src[t2.BUILDIDENTIFIER]}(?:\\.${src[t2.BUILDIDENTIFIER]})*))`);
    createToken("FULLPLAIN", `v?${src[t2.MAINVERSION]}${src[t2.PRERELEASE]}?${src[t2.BUILD]}?`);
    createToken("FULL", `^${src[t2.FULLPLAIN]}$`);
    createToken("LOOSEPLAIN", `[v=\\s]*${src[t2.MAINVERSIONLOOSE]}${src[t2.PRERELEASELOOSE]}?${src[t2.BUILD]}?`);
    createToken("LOOSE", `^${src[t2.LOOSEPLAIN]}$`);
    createToken("GTLT", "((?:<|>)?=?)");
    createToken("XRANGEIDENTIFIERLOOSE", `${src[t2.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    createToken("XRANGEIDENTIFIER", `${src[t2.NUMERICIDENTIFIER]}|x|X|\\*`);
    createToken("XRANGEPLAIN", `[v=\\s]*(${src[t2.XRANGEIDENTIFIER]})(?:\\.(${src[t2.XRANGEIDENTIFIER]})(?:\\.(${src[t2.XRANGEIDENTIFIER]})(?:${src[t2.PRERELEASE]})?${src[t2.BUILD]}?)?)?`);
    createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t2.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t2.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t2.XRANGEIDENTIFIERLOOSE]})(?:${src[t2.PRERELEASELOOSE]})?${src[t2.BUILD]}?)?)?`);
    createToken("XRANGE", `^${src[t2.GTLT]}\\s*${src[t2.XRANGEPLAIN]}$`);
    createToken("XRANGELOOSE", `^${src[t2.GTLT]}\\s*${src[t2.XRANGEPLAINLOOSE]}$`);
    createToken("COERCEPLAIN", `${"(^|[^\\d])(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
    createToken("COERCE", `${src[t2.COERCEPLAIN]}(?:$|[^\\d])`);
    createToken("COERCEFULL", src[t2.COERCEPLAIN] + `(?:${src[t2.PRERELEASE]})?(?:${src[t2.BUILD]})?(?:$|[^\\d])`);
    createToken("COERCERTL", src[t2.COERCE], true);
    createToken("COERCERTLFULL", src[t2.COERCEFULL], true);
    createToken("LONETILDE", "(?:~>?)");
    createToken("TILDETRIM", `(\\s*)${src[t2.LONETILDE]}\\s+`, true);
    exports.tildeTrimReplace = "$1~";
    createToken("TILDE", `^${src[t2.LONETILDE]}${src[t2.XRANGEPLAIN]}$`);
    createToken("TILDELOOSE", `^${src[t2.LONETILDE]}${src[t2.XRANGEPLAINLOOSE]}$`);
    createToken("LONECARET", "(?:\\^)");
    createToken("CARETTRIM", `(\\s*)${src[t2.LONECARET]}\\s+`, true);
    exports.caretTrimReplace = "$1^";
    createToken("CARET", `^${src[t2.LONECARET]}${src[t2.XRANGEPLAIN]}$`);
    createToken("CARETLOOSE", `^${src[t2.LONECARET]}${src[t2.XRANGEPLAINLOOSE]}$`);
    createToken("COMPARATORLOOSE", `^${src[t2.GTLT]}\\s*(${src[t2.LOOSEPLAIN]})$|^$`);
    createToken("COMPARATOR", `^${src[t2.GTLT]}\\s*(${src[t2.FULLPLAIN]})$|^$`);
    createToken("COMPARATORTRIM", `(\\s*)${src[t2.GTLT]}\\s*(${src[t2.LOOSEPLAIN]}|${src[t2.XRANGEPLAIN]})`, true);
    exports.comparatorTrimReplace = "$1$2$3";
    createToken("HYPHENRANGE", `^\\s*(${src[t2.XRANGEPLAIN]})\\s+-\\s+(${src[t2.XRANGEPLAIN]})\\s*$`);
    createToken("HYPHENRANGELOOSE", `^\\s*(${src[t2.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t2.XRANGEPLAINLOOSE]})\\s*$`);
    createToken("STAR", "(<|>)?=?\\s*\\*");
    createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
    createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  })(re, re.exports);
  return re.exports;
}
var parseOptions_1;
var hasRequiredParseOptions;
function requireParseOptions() {
  if (hasRequiredParseOptions) return parseOptions_1;
  hasRequiredParseOptions = 1;
  const looseOption = Object.freeze({ loose: true });
  const emptyOpts = Object.freeze({});
  const parseOptions = (options) => {
    if (!options) {
      return emptyOpts;
    }
    if (typeof options !== "object") {
      return looseOption;
    }
    return options;
  };
  parseOptions_1 = parseOptions;
  return parseOptions_1;
}
var identifiers;
var hasRequiredIdentifiers;
function requireIdentifiers() {
  if (hasRequiredIdentifiers) return identifiers;
  hasRequiredIdentifiers = 1;
  const numeric = /^[0-9]+$/;
  const compareIdentifiers = (a2, b2) => {
    const anum = numeric.test(a2);
    const bnum = numeric.test(b2);
    if (anum && bnum) {
      a2 = +a2;
      b2 = +b2;
    }
    return a2 === b2 ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a2 < b2 ? -1 : 1;
  };
  const rcompareIdentifiers = (a2, b2) => compareIdentifiers(b2, a2);
  identifiers = {
    compareIdentifiers,
    rcompareIdentifiers
  };
  return identifiers;
}
var semver;
var hasRequiredSemver;
function requireSemver() {
  if (hasRequiredSemver) return semver;
  hasRequiredSemver = 1;
  const debug = requireDebug();
  const { MAX_LENGTH, MAX_SAFE_INTEGER } = requireConstants();
  const { safeRe: re2, t: t2 } = requireRe();
  const parseOptions = requireParseOptions();
  const { compareIdentifiers } = requireIdentifiers();
  class SemVer {
    constructor(version, options) {
      options = parseOptions(options);
      if (version instanceof SemVer) {
        if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) {
          return version;
        } else {
          version = version.version;
        }
      } else if (typeof version !== "string") {
        throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
      }
      if (version.length > MAX_LENGTH) {
        throw new TypeError(
          `version is longer than ${MAX_LENGTH} characters`
        );
      }
      debug("SemVer", version, options);
      this.options = options;
      this.loose = !!options.loose;
      this.includePrerelease = !!options.includePrerelease;
      const m2 = version.trim().match(options.loose ? re2[t2.LOOSE] : re2[t2.FULL]);
      if (!m2) {
        throw new TypeError(`Invalid Version: ${version}`);
      }
      this.raw = version;
      this.major = +m2[1];
      this.minor = +m2[2];
      this.patch = +m2[3];
      if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
        throw new TypeError("Invalid major version");
      }
      if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
        throw new TypeError("Invalid minor version");
      }
      if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
        throw new TypeError("Invalid patch version");
      }
      if (!m2[4]) {
        this.prerelease = [];
      } else {
        this.prerelease = m2[4].split(".").map((id) => {
          if (/^[0-9]+$/.test(id)) {
            const num = +id;
            if (num >= 0 && num < MAX_SAFE_INTEGER) {
              return num;
            }
          }
          return id;
        });
      }
      this.build = m2[5] ? m2[5].split(".") : [];
      this.format();
    }
    format() {
      this.version = `${this.major}.${this.minor}.${this.patch}`;
      if (this.prerelease.length) {
        this.version += `-${this.prerelease.join(".")}`;
      }
      return this.version;
    }
    toString() {
      return this.version;
    }
    compare(other) {
      debug("SemVer.compare", this.version, this.options, other);
      if (!(other instanceof SemVer)) {
        if (typeof other === "string" && other === this.version) {
          return 0;
        }
        other = new SemVer(other, this.options);
      }
      if (other.version === this.version) {
        return 0;
      }
      return this.compareMain(other) || this.comparePre(other);
    }
    compareMain(other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }
      return compareIdentifiers(this.major, other.major) || compareIdentifiers(this.minor, other.minor) || compareIdentifiers(this.patch, other.patch);
    }
    comparePre(other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }
      if (this.prerelease.length && !other.prerelease.length) {
        return -1;
      } else if (!this.prerelease.length && other.prerelease.length) {
        return 1;
      } else if (!this.prerelease.length && !other.prerelease.length) {
        return 0;
      }
      let i2 = 0;
      do {
        const a2 = this.prerelease[i2];
        const b2 = other.prerelease[i2];
        debug("prerelease compare", i2, a2, b2);
        if (a2 === void 0 && b2 === void 0) {
          return 0;
        } else if (b2 === void 0) {
          return 1;
        } else if (a2 === void 0) {
          return -1;
        } else if (a2 === b2) {
          continue;
        } else {
          return compareIdentifiers(a2, b2);
        }
      } while (++i2);
    }
    compareBuild(other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }
      let i2 = 0;
      do {
        const a2 = this.build[i2];
        const b2 = other.build[i2];
        debug("build compare", i2, a2, b2);
        if (a2 === void 0 && b2 === void 0) {
          return 0;
        } else if (b2 === void 0) {
          return 1;
        } else if (a2 === void 0) {
          return -1;
        } else if (a2 === b2) {
          continue;
        } else {
          return compareIdentifiers(a2, b2);
        }
      } while (++i2);
    }
    // preminor will bump the version up to the next minor release, and immediately
    // down to pre-release. premajor and prepatch work the same way.
    inc(release, identifier, identifierBase) {
      switch (release) {
        case "premajor":
          this.prerelease.length = 0;
          this.patch = 0;
          this.minor = 0;
          this.major++;
          this.inc("pre", identifier, identifierBase);
          break;
        case "preminor":
          this.prerelease.length = 0;
          this.patch = 0;
          this.minor++;
          this.inc("pre", identifier, identifierBase);
          break;
        case "prepatch":
          this.prerelease.length = 0;
          this.inc("patch", identifier, identifierBase);
          this.inc("pre", identifier, identifierBase);
          break;
        // If the input is a non-prerelease version, this acts the same as
        // prepatch.
        case "prerelease":
          if (this.prerelease.length === 0) {
            this.inc("patch", identifier, identifierBase);
          }
          this.inc("pre", identifier, identifierBase);
          break;
        case "major":
          if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
            this.major++;
          }
          this.minor = 0;
          this.patch = 0;
          this.prerelease = [];
          break;
        case "minor":
          if (this.patch !== 0 || this.prerelease.length === 0) {
            this.minor++;
          }
          this.patch = 0;
          this.prerelease = [];
          break;
        case "patch":
          if (this.prerelease.length === 0) {
            this.patch++;
          }
          this.prerelease = [];
          break;
        // This probably shouldn't be used publicly.
        // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
        case "pre": {
          const base = Number(identifierBase) ? 1 : 0;
          if (!identifier && identifierBase === false) {
            throw new Error("invalid increment argument: identifier is empty");
          }
          if (this.prerelease.length === 0) {
            this.prerelease = [base];
          } else {
            let i2 = this.prerelease.length;
            while (--i2 >= 0) {
              if (typeof this.prerelease[i2] === "number") {
                this.prerelease[i2]++;
                i2 = -2;
              }
            }
            if (i2 === -1) {
              if (identifier === this.prerelease.join(".") && identifierBase === false) {
                throw new Error("invalid increment argument: identifier already exists");
              }
              this.prerelease.push(base);
            }
          }
          if (identifier) {
            let prerelease = [identifier, base];
            if (identifierBase === false) {
              prerelease = [identifier];
            }
            if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
              if (isNaN(this.prerelease[1])) {
                this.prerelease = prerelease;
              }
            } else {
              this.prerelease = prerelease;
            }
          }
          break;
        }
        default:
          throw new Error(`invalid increment argument: ${release}`);
      }
      this.raw = this.format();
      if (this.build.length) {
        this.raw += `+${this.build.join(".")}`;
      }
      return this;
    }
  }
  semver = SemVer;
  return semver;
}
var parse_1;
var hasRequiredParse;
function requireParse() {
  if (hasRequiredParse) return parse_1;
  hasRequiredParse = 1;
  const SemVer = requireSemver();
  const parse = (version, options, throwErrors = false) => {
    if (version instanceof SemVer) {
      return version;
    }
    try {
      return new SemVer(version, options);
    } catch (er) {
      if (!throwErrors) {
        return null;
      }
      throw er;
    }
  };
  parse_1 = parse;
  return parse_1;
}
var valid_1;
var hasRequiredValid;
function requireValid() {
  if (hasRequiredValid) return valid_1;
  hasRequiredValid = 1;
  const parse = requireParse();
  const valid2 = (version, options) => {
    const v = parse(version, options);
    return v ? v.version : null;
  };
  valid_1 = valid2;
  return valid_1;
}
requireValid();
var major_1;
var hasRequiredMajor;
function requireMajor() {
  if (hasRequiredMajor) return major_1;
  hasRequiredMajor = 1;
  const SemVer = requireSemver();
  const major2 = (a2, loose) => new SemVer(a2, loose).major;
  major_1 = major2;
  return major_1;
}
requireMajor();
const getNewFileMenuEntries = function(context) {
  const newFileMenu = getNewFileMenu();
  return newFileMenu.getEntries(context).sort((a2, b2) => {
    if (a2.order !== void 0 && b2.order !== void 0 && a2.order !== b2.order) {
      return a2.order - b2.order;
    }
    return a2.displayName.localeCompare(b2.displayName, void 0, { numeric: true, sensitivity: "base" });
  });
};
export {
  InvalidFilenameError as I,
  NewMenuEntryCategory as N,
  getNewFileMenuEntries as a,
  getUniqueName as b,
  InvalidFilenameErrorReason as c,
  e,
  formatFileSize as f,
  getGettextBuilder as g,
  moment as m,
  sortNodes as s,
  validateFilename as v
};
//# sourceMappingURL=index-Cokc0amN.chunk.mjs.map
