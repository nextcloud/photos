const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { a1 as useSlots, b as ref$1, w as watch, n as nextTick, a2 as commonjsGlobal, f as distExports, a3 as h, l as loadState, t as translate, _, G as getClient, $ as U } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import "./NcActionButton-CuVNJJtW-5eBS5Sv2.chunk.mjs";
import { r as register, A as t42, B as t14, a as t, C as useFocusWithin, D as Close, E as t45, F as t13, G as t6, H as t26, I as t1, J as t32, K as t40, L as t34, M as t5, O as t39, P as t36, Q as t8, R as t21, S as t7, T as t44, U as t38, V as t22, W as t29, X as t17, Y as t11, Z as t31, _ as t0, $ as t43, a0 as t15, a1 as t47, a2 as t23, a3 as t48, a4 as options, s as NcActions, a5 as publicAlbumsPrefix, w as albumFilesExtraProps, a6 as publicAlbumsExtraProps } from "./index-BOzawWmL.chunk.mjs";
import "./NcProgressBar-DegJ2JjE-BAVaOw4q.chunk.mjs";
import "./NcBreadcrumbs-CFRjXqRg-DcyK5KqK.chunk.mjs";
import { C as Color } from "./NcAvatar-YSp2ORHc-CfTsACiM.chunk.mjs";
import { f as isMobileState } from "./video-C5pfp5p8.chunk.mjs";
import "./NcAppSettingsSection-Bl2-D3_g-BYPSoxk3.chunk.mjs";
import "./useHotKey-CDShbxMN.chunk.mjs";
import { N as NcInputField } from "./NcTextField-o_8gWurX-9cj68FP2.chunk.mjs";
import "./NcCheckboxRadioSwitch-VeztTzpz-CPNGlVnf.chunk.mjs";
import { N as NcEmptyContent } from "./NcEmptyContent-EDU4qhab.chunk.mjs";
import { P as PQueue } from "./index-BrMrQMP2.chunk.mjs";
import { N as NcSelect } from "./NcSelect-CjUzohn5-OrPoxx8A.chunk.mjs";
import "./NcListItem-DfaWGP5A-M_EBAoWK.chunk.mjs";
import "./NcDateTime-DshRFtUU-w5TCTRwf.chunk.mjs";
import "./NcDateTimePicker-D9wOztqD.chunk.mjs";
import { e } from "./index-Cokc0amN.chunk.mjs";
import { d as debounce } from "./index-ClkAjefD.chunk.mjs";
import "./NcUserBubble-B3-E-5F5-B3tz6PYr.chunk.mjs";
import { y as ImageOffOutline, M as MapMarkerOutline, n as normalizeComponent } from "./icons-BZLMM6Xn.chunk.mjs";
import { C as CollectionContent } from "./CollectionContent-CDkRvqND.chunk.mjs";
import { H as HeaderNavigation } from "./HeaderNavigation-BKsyJU73.chunk.mjs";
import { F as FetchCollectionContentMixin } from "./FetchCollectionContentMixin-ank00rhB.chunk.mjs";
import "./useModelMigration-EhAWvqDD-DYrjrJkv.chunk.mjs";
import "./preload-helper-BO5AHt9u.chunk.mjs";
import "./NcVNodes-8dPkIzmP.chunk.mjs";
import "./NcDialog-CKgpZOiy-CeLaNMKv.chunk.mjs";
import "./FileComponent-CcjuR452.chunk.mjs";
import "./FilesSelectionMixin-Bmgrjxxz.chunk.mjs";
import "./fileFetcher-UYL2it_6.chunk.mjs";
import "./collectionFetcher-COU0Vwo3.chunk.mjs";
import "./AbortControllerMixin-B_otrjDn.chunk.mjs";
register();
register(t14, t42);
const __default__ = {
  name: "NcAppNavigationSearch",
  model: {
    event: "update:modelValue",
    prop: "modelValue"
  }
};
/* @__PURE__ */ Object.assign(__default__, {
  props: {
    /**
     * Current search input
     */
    modelValue: {
      type: String,
      default: ""
    },
    /**
     * Text used to label the search input
     */
    label: {
      type: String,
      default: t("Search…")
    },
    /**
     * Placeholder of the search input
     * By default the value of `label` is used.
     */
    placeholder: {
      type: String,
      default: null
    }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit }) {
    const slots = useSlots();
    const inputElement = ref$1();
    const { focused: inputHasFocus } = useFocusWithin(inputElement);
    const transitionTimeout = Number.parseInt(window.getComputedStyle(window.document.body).getPropertyValue("--animation-quick")) || 100;
    const actionsContainer = ref$1();
    const hasActions = () => !!slots.actions;
    const showActions = ref$1(true);
    const timeoutId = ref$1();
    const hideActions = ref$1(false);
    watch(inputHasFocus, () => {
      showActions.value = !inputHasFocus.value;
    });
    watch(showActions, (show) => {
      window.clearTimeout(timeoutId.value);
      if (show) {
        hideActions.value = false;
      } else {
        window.setTimeout(() => {
          hideActions.value = !show;
        }, transitionTimeout);
      }
    });
    function onCloseSearch() {
      emit("update:modelValue", "");
      if (hasActions()) {
        showActions.value = true;
        nextTick(() => actionsContainer.value.querySelector("button")?.focus());
      }
    }
    return { __sfc: true, emit, slots, inputElement, inputHasFocus, transitionTimeout, actionsContainer, hasActions, showActions, timeoutId, hideActions, onCloseSearch, t, IconClose: Close, NcInputField };
  }
});
register(t45);
({
  props: {
    name: {
      default: t("Settings")
    }
  }
});
var tlds = "aaa aarp abarth abb abbott abbvie abc able abogado abudhabi ac academy accenture accountant accountants aco actor ad adac ads adult ae aeg aero aetna af afl africa ag agakhan agency ai aig airbus airforce airtel akdn al alfaromeo alibaba alipay allfinanz allstate ally alsace alstom am amazon americanexpress americanfamily amex amfam amica amsterdam analytics android anquan anz ao aol apartments app apple aq aquarelle ar arab aramco archi army arpa art arte as asda asia associates at athleta attorney au auction audi audible audio auspost author auto autos avianca aw aws ax axa az azure ba baby baidu banamex bananarepublic band bank bar barcelona barclaycard barclays barefoot bargains baseball basketball bauhaus bayern bb bbc bbt bbva bcg bcn bd be beats beauty beer bentley berlin best bestbuy bet bf bg bh bharti bi bible bid bike bing bingo bio biz bj black blackfriday blockbuster blog bloomberg blue bm bms bmw bn bnpparibas bo boats boehringer bofa bom bond boo book booking bosch bostik boston bot boutique box br bradesco bridgestone broadway broker brother brussels bs bt bugatti build builders business buy buzz bv bw by bz bzh ca cab cafe cal call calvinklein cam camera camp cancerresearch canon capetown capital capitalone car caravan cards care career careers cars casa case cash casino cat catering catholic cba cbn cbre cbs cc cd center ceo cern cf cfa cfd cg ch chanel channel charity chase chat cheap chintai christmas chrome church ci cipriani circle cisco citadel citi citic city cityeats ck cl claims cleaning click clinic clinique clothing cloud club clubmed cm cn co coach codes coffee college cologne com comcast commbank community company compare computer comsec condos construction consulting contact contractors cooking cookingchannel cool coop corsica country coupon coupons courses cpa cr credit creditcard creditunion cricket crown crs cruise cruises cu cuisinella cv cw cx cy cymru cyou cz dabur dad dance data date dating datsun day dclk dds de deal dealer deals degree delivery dell deloitte delta democrat dental dentist desi design dev dhl diamonds diet digital direct directory discount discover dish diy dj dk dm dnp do docs doctor dog domains dot download drive dtv dubai dunlop dupont durban dvag dvr dz earth eat ec eco edeka edu education ee eg email emerck energy engineer engineering enterprises epson equipment er ericsson erni es esq estate et etisalat eu eurovision eus events exchange expert exposed express extraspace fage fail fairwinds faith family fan fans farm farmers fashion fast fedex feedback ferrari ferrero fi fiat fidelity fido film final finance financial fire firestone firmdale fish fishing fit fitness fj fk flickr flights flir florist flowers fly fm fo foo food foodnetwork football ford forex forsale forum foundation fox fr free fresenius frl frogans frontdoor frontier ftr fujitsu fun fund furniture futbol fyi ga gal gallery gallo gallup game games gap garden gay gb gbiz gd gdn ge gea gent genting george gf gg ggee gh gi gift gifts gives giving gl glass gle global globo gm gmail gmbh gmo gmx gn godaddy gold goldpoint golf goo goodyear goog google gop got gov gp gq gr grainger graphics gratis green gripe grocery group gs gt gu guardian gucci guge guide guitars guru gw gy hair hamburg hangout haus hbo hdfc hdfcbank health healthcare help helsinki here hermes hgtv hiphop hisamitsu hitachi hiv hk hkt hm hn hockey holdings holiday homedepot homegoods homes homesense honda horse hospital host hosting hot hoteles hotels hotmail house how hr hsbc ht hu hughes hyatt hyundai ibm icbc ice icu id ie ieee ifm ikano il im imamat imdb immo immobilien in inc industries infiniti info ing ink institute insurance insure int international intuit investments io ipiranga iq ir irish is ismaili ist istanbul it itau itv jaguar java jcb je jeep jetzt jewelry jio jll jm jmp jnj jo jobs joburg jot joy jp jpmorgan jprs juegos juniper kaufen kddi ke kerryhotels kerrylogistics kerryproperties kfh kg kh ki kia kids kim kinder kindle kitchen kiwi km kn koeln komatsu kosher kp kpmg kpn kr krd kred kuokgroup kw ky kyoto kz la lacaixa lamborghini lamer lancaster lancia land landrover lanxess lasalle lat latino latrobe law lawyer lb lc lds lease leclerc lefrak legal lego lexus lgbt li lidl life lifeinsurance lifestyle lighting like lilly limited limo lincoln linde link lipsy live living lk llc llp loan loans locker locus loft lol london lotte lotto love lpl lplfinancial lr ls lt ltd ltda lu lundbeck luxe luxury lv ly ma macys madrid maif maison makeup man management mango map market marketing markets marriott marshalls maserati mattel mba mc mckinsey md me med media meet melbourne meme memorial men menu merckmsd mg mh miami microsoft mil mini mint mit mitsubishi mk ml mlb mls mm mma mn mo mobi mobile moda moe moi mom monash money monster mormon mortgage moscow moto motorcycles mov movie mp mq mr ms msd mt mtn mtr mu museum music mutual mv mw mx my mz na nab nagoya name natura navy nba nc ne nec net netbank netflix network neustar new news next nextdirect nexus nf nfl ng ngo nhk ni nico nike nikon ninja nissan nissay nl no nokia northwesternmutual norton now nowruz nowtv np nr nra nrw ntt nu nyc nz obi observer office okinawa olayan olayangroup oldnavy ollo om omega one ong onl online ooo open oracle orange org organic origins osaka otsuka ott ovh pa page panasonic paris pars partners parts party passagens pay pccw pe pet pf pfizer pg ph pharmacy phd philips phone photo photography photos physio pics pictet pictures pid pin ping pink pioneer pizza pk pl place play playstation plumbing plus pm pn pnc pohl poker politie porn post pr pramerica praxi press prime pro prod productions prof progressive promo properties property protection pru prudential ps pt pub pw pwc py qa qpon quebec quest racing radio re read realestate realtor realty recipes red redstone redumbrella rehab reise reisen reit reliance ren rent rentals repair report republican rest restaurant review reviews rexroth rich richardli ricoh ril rio rip ro rocher rocks rodeo rogers room rs rsvp ru rugby ruhr run rw rwe ryukyu sa saarland safe safety sakura sale salon samsclub samsung sandvik sandvikcoromant sanofi sap sarl sas save saxo sb sbi sbs sc sca scb schaeffler schmidt scholarships school schule schwarz science scot sd se search seat secure security seek select sener services ses seven sew sex sexy sfr sg sh shangrila sharp shaw shell shia shiksha shoes shop shopping shouji show showtime si silk sina singles site sj sk ski skin sky skype sl sling sm smart smile sn sncf so soccer social softbank software sohu solar solutions song sony soy spa space sport spot sr srl ss st stada staples star statebank statefarm stc stcgroup stockholm storage store stream studio study style su sucks supplies supply support surf surgery suzuki sv swatch swiss sx sy sydney systems sz tab taipei talk taobao target tatamotors tatar tattoo tax taxi tc tci td tdk team tech technology tel temasek tennis teva tf tg th thd theater theatre tiaa tickets tienda tiffany tips tires tirol tj tjmaxx tjx tk tkmaxx tl tm tmall tn to today tokyo tools top toray toshiba total tours town toyota toys tr trade trading training travel travelchannel travelers travelersinsurance trust trv tt tube tui tunes tushu tv tvs tw tz ua ubank ubs ug uk unicom university uno uol ups us uy uz va vacations vana vanguard vc ve vegas ventures verisign vermögensberater vermögensberatung versicherung vet vg vi viajes video vig viking villas vin vip virgin visa vision viva vivo vlaanderen vn vodka volkswagen volvo vote voting voto voyage vu vuelos wales walmart walter wang wanggou watch watches weather weatherchannel webcam weber website wed wedding weibo weir wf whoswho wien wiki williamhill win windows wine winners wme wolterskluwer woodside work works world wow ws wtc wtf xbox xerox xfinity xihuan xin xxx xyz yachts yahoo yamaxun yandex ye yodobashi yoga yokohama you youtube yt yun za zappos zara zero zip zm zone zuerich zw".split(" ");
var utlds = "ελ ευ бг бел дети ею католик ком мкд мон москва онлайн орг рус рф сайт срб укр қаз հայ ישראל קום ابوظبي اتصالات ارامكو الاردن البحرين الجزائر السعودية العليان المغرب امارات ایران بارت بازار بيتك بھارت تونس سودان سورية شبكة عراق عرب عمان فلسطين قطر كاثوليك كوم مصر مليسيا موريتانيا موقع همراه پاکستان ڀارت कॉम नेट भारत भारतम् भारोत संगठन বাংলা ভারত ভাৰত ਭਾਰਤ ભારત ଭାରତ இந்தியா இலங்கை சிங்கப்பூர் భారత్ ಭಾರತ ഭാരതം ලංකා คอม ไทย ລາວ გე みんな アマゾン クラウド グーグル コム ストア セール ファッション ポイント 世界 中信 中国 中國 中文网 亚马逊 企业 佛山 信息 健康 八卦 公司 公益 台湾 台灣 商城 商店 商标 嘉里 嘉里大酒店 在线 大拿 天主教 娱乐 家電 广东 微博 慈善 我爱你 手机 招聘 政务 政府 新加坡 新闻 时尚 書籍 机构 淡马锡 游戏 澳門 点看 移动 组织机构 网址 网店 网站 网络 联通 诺基亚 谷歌 购物 通販 集团 電訊盈科 飞利浦 食品 餐厅 香格里拉 香港 닷넷 닷컴 삼성 한국".split(" ");
var assign = function assign2(target, properties) {
  for (var key in properties) {
    target[key] = properties[key];
  }
  return target;
};
var numeric = "numeric";
var ascii = "ascii";
var alpha = "alpha";
var asciinumeric = "asciinumeric";
var alphanumeric = "alphanumeric";
var domain$1 = "domain";
var emoji = "emoji";
var scheme = "scheme";
var slashscheme = "slashscheme";
var whitespace = "whitespace";
function registerGroup(name, groups) {
  if (!(name in groups)) {
    groups[name] = [];
  }
  return groups[name];
}
function addToGroups(t2, flags, groups) {
  if (flags[numeric]) {
    flags[asciinumeric] = true;
    flags[alphanumeric] = true;
  }
  if (flags[ascii]) {
    flags[asciinumeric] = true;
    flags[alpha] = true;
  }
  if (flags[asciinumeric]) {
    flags[alphanumeric] = true;
  }
  if (flags[alpha]) {
    flags[alphanumeric] = true;
  }
  if (flags[alphanumeric]) {
    flags[domain$1] = true;
  }
  if (flags[emoji]) {
    flags[domain$1] = true;
  }
  for (var k in flags) {
    var group = registerGroup(k, groups);
    if (group.indexOf(t2) < 0) {
      group.push(t2);
    }
  }
}
function flagsForToken(t2, groups) {
  var result = {};
  for (var c in groups) {
    if (groups[c].indexOf(t2) >= 0) {
      result[c] = true;
    }
  }
  return result;
}
function State(token) {
  if (token === void 0) {
    token = null;
  }
  this.j = {};
  this.jr = [];
  this.jd = null;
  this.t = token;
}
State.groups = {};
State.prototype = {
  accepts: function accepts() {
    return !!this.t;
  },
  /**
   * Follow an existing transition from the given input to the next state.
   * Does not mutate.
   * @param {string} input character or token type to transition on
   * @returns {?State<T>} the next state, if any
   */
  go: function go(input) {
    var state = this;
    var nextState = state.j[input];
    if (nextState) {
      return nextState;
    }
    for (var i = 0; i < state.jr.length; i++) {
      var regex = state.jr[i][0];
      var _nextState = state.jr[i][1];
      if (_nextState && regex.test(input)) {
        return _nextState;
      }
    }
    return state.jd;
  },
  /**
   * Whether the state has a transition for the given input. Set the second
   * argument to true to only look for an exact match (and not a default or
   * regular-expression-based transition)
   * @param {string} input
   * @param {boolean} exactOnly
   */
  has: function has(input, exactOnly) {
    if (exactOnly === void 0) {
      exactOnly = false;
    }
    return exactOnly ? input in this.j : !!this.go(input);
  },
  /**
   * Short for "transition all"; create a transition from the array of items
   * in the given list to the same final resulting state.
   * @param {string | string[]} inputs Group of inputs to transition on
   * @param {Transition<T> | State<T>} [next] Transition options
   * @param {Flags} [flags] Collections flags to add token to
   * @param {Collections<T>} [groups] Master list of token groups
   */
  ta: function ta(inputs, next, flags, groups) {
    for (var i = 0; i < inputs.length; i++) {
      this.tt(inputs[i], next, flags, groups);
    }
  },
  /**
   * Short for "take regexp transition"; defines a transition for this state
   * when it encounters a token which matches the given regular expression
   * @param {RegExp} regexp Regular expression transition (populate first)
   * @param {T | State<T>} [next] Transition options
   * @param {Flags} [flags] Collections flags to add token to
   * @param {Collections<T>} [groups] Master list of token groups
   * @returns {State<T>} taken after the given input
   */
  tr: function tr(regexp, next, flags, groups) {
    groups = groups || State.groups;
    var nextState;
    if (next && next.j) {
      nextState = next;
    } else {
      nextState = new State(next);
      if (flags && groups) {
        addToGroups(next, flags, groups);
      }
    }
    this.jr.push([regexp, nextState]);
    return nextState;
  },
  /**
   * Short for "take transitions", will take as many sequential transitions as
   * the length of the given input and returns the
   * resulting final state.
   * @param {string | string[]} input
   * @param {T | State<T>} [next] Transition options
   * @param {Flags} [flags] Collections flags to add token to
   * @param {Collections<T>} [groups] Master list of token groups
   * @returns {State<T>} taken after the given input
   */
  ts: function ts(input, next, flags, groups) {
    var state = this;
    var len = input.length;
    if (!len) {
      return state;
    }
    for (var i = 0; i < len - 1; i++) {
      state = state.tt(input[i]);
    }
    return state.tt(input[len - 1], next, flags, groups);
  },
  /**
   * Short for "take transition", this is a method for building/working with
   * state machines.
   *
   * If a state already exists for the given input, returns it.
   *
   * If a token is specified, that state will emit that token when reached by
   * the linkify engine.
   *
   * If no state exists, it will be initialized with some default transitions
   * that resemble existing default transitions.
   *
   * If a state is given for the second argument, that state will be
   * transitioned to on the given input regardless of what that input
   * previously did.
   *
   * Specify a token group flags to define groups that this token belongs to.
   * The token will be added to corresponding entires in the given groups
   * object.
   *
   * @param {string} input character, token type to transition on
   * @param {T | State<T>} [next] Transition options
   * @param {Flags} [flags] Collections flags to add token to
   * @param {Collections<T>} [groups] Master list of groups
   * @returns {State<T>} taken after the given input
   */
  tt: function tt(input, next, flags, groups) {
    groups = groups || State.groups;
    var state = this;
    if (next && next.j) {
      state.j[input] = next;
      return next;
    }
    var t2 = next;
    var nextState, templateState = state.go(input);
    if (templateState) {
      nextState = new State();
      assign(nextState.j, templateState.j);
      nextState.jr.push.apply(nextState.jr, templateState.jr);
      nextState.jd = templateState.jd;
      nextState.t = templateState.t;
    } else {
      nextState = new State();
    }
    if (t2) {
      if (groups) {
        if (nextState.t && typeof nextState.t === "string") {
          var allFlags = assign(flagsForToken(nextState.t, groups), flags);
          addToGroups(t2, allFlags, groups);
        } else if (flags) {
          addToGroups(t2, flags, groups);
        }
      }
      nextState.t = t2;
    }
    state.j[input] = nextState;
    return nextState;
  }
};
var ta2 = function ta3(state, input, next, flags, groups) {
  return state.ta(input, next, flags, groups);
};
var tr2 = function tr3(state, regexp, next, flags, groups) {
  return state.tr(regexp, next, flags, groups);
};
var ts2 = function ts3(state, input, next, flags, groups) {
  return state.ts(input, next, flags, groups);
};
var tt2 = function tt3(state, input, next, flags, groups) {
  return state.tt(input, next, flags, groups);
};
var WORD = "WORD";
var UWORD = "UWORD";
var LOCALHOST = "LOCALHOST";
var TLD = "TLD";
var UTLD = "UTLD";
var SCHEME = "SCHEME";
var SLASH_SCHEME = "SLASH_SCHEME";
var NUM = "NUM";
var WS = "WS";
var NL$1 = "NL";
var OPENBRACE = "OPENBRACE";
var OPENBRACKET = "OPENBRACKET";
var OPENANGLEBRACKET = "OPENANGLEBRACKET";
var OPENPAREN = "OPENPAREN";
var CLOSEBRACE = "CLOSEBRACE";
var CLOSEBRACKET = "CLOSEBRACKET";
var CLOSEANGLEBRACKET = "CLOSEANGLEBRACKET";
var CLOSEPAREN = "CLOSEPAREN";
var AMPERSAND = "AMPERSAND";
var APOSTROPHE = "APOSTROPHE";
var ASTERISK = "ASTERISK";
var AT = "AT";
var BACKSLASH = "BACKSLASH";
var BACKTICK = "BACKTICK";
var CARET = "CARET";
var COLON = "COLON";
var COMMA = "COMMA";
var DOLLAR = "DOLLAR";
var DOT = "DOT";
var EQUALS = "EQUALS";
var EXCLAMATION = "EXCLAMATION";
var HYPHEN = "HYPHEN";
var PERCENT = "PERCENT";
var PIPE = "PIPE";
var PLUS = "PLUS";
var POUND = "POUND";
var QUERY = "QUERY";
var QUOTE = "QUOTE";
var SEMI = "SEMI";
var SLASH = "SLASH";
var TILDE = "TILDE";
var UNDERSCORE = "UNDERSCORE";
var EMOJI$1 = "EMOJI";
var SYM = "SYM";
var tk = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  WORD,
  UWORD,
  LOCALHOST,
  TLD,
  UTLD,
  SCHEME,
  SLASH_SCHEME,
  NUM,
  WS,
  NL: NL$1,
  OPENBRACE,
  OPENBRACKET,
  OPENANGLEBRACKET,
  OPENPAREN,
  CLOSEBRACE,
  CLOSEBRACKET,
  CLOSEANGLEBRACKET,
  CLOSEPAREN,
  AMPERSAND,
  APOSTROPHE,
  ASTERISK,
  AT,
  BACKSLASH,
  BACKTICK,
  CARET,
  COLON,
  COMMA,
  DOLLAR,
  DOT,
  EQUALS,
  EXCLAMATION,
  HYPHEN,
  PERCENT,
  PIPE,
  PLUS,
  POUND,
  QUERY,
  QUOTE,
  SEMI,
  SLASH,
  TILDE,
  UNDERSCORE,
  EMOJI: EMOJI$1,
  SYM
});
var ASCII_LETTER = /[a-z]/;
var LETTER = /(?:[A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD23\uDE80-\uDEA9\uDEB0\uDEB1\uDF00-\uDF1C\uDF27\uDF30-\uDF45\uDF70-\uDF81\uDFB0-\uDFC4\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC71\uDC72\uDC75\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDEB8\uDF00-\uDF1A\uDF40-\uDF46]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCDF\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEB0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDEE0-\uDEF2\uDFB0]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE70-\uDEBE\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE7F\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD837[\uDF00-\uDF1E]|\uD838[\uDD00-\uDD2C\uDD37-\uDD3D\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB]|\uD839[\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43\uDD4B]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF38\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A])/;
var EMOJI = /(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26A7\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5-\uDED7\uDEDD-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFC\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDDFF\uDE70-\uDE74\uDE78-\uDE7C\uDE80-\uDE86\uDE90-\uDEAC\uDEB0-\uDEBA\uDEC0-\uDEC5\uDED0-\uDED9\uDEE0-\uDEE7\uDEF0-\uDEF6])/;
var DIGIT = /\d/;
var SPACE = /\s/;
var NL = "\n";
var EMOJI_VARIATION = "️";
var EMOJI_JOINER = "‍";
function init$2(customSchemes) {
  var _tr, _tr2, _tr3, _tr4, _tt, _tr5;
  if (customSchemes === void 0) {
    customSchemes = [];
  }
  var groups = {};
  State.groups = groups;
  var Start = new State();
  tt2(Start, "'", APOSTROPHE);
  tt2(Start, "{", OPENBRACE);
  tt2(Start, "[", OPENBRACKET);
  tt2(Start, "<", OPENANGLEBRACKET);
  tt2(Start, "(", OPENPAREN);
  tt2(Start, "}", CLOSEBRACE);
  tt2(Start, "]", CLOSEBRACKET);
  tt2(Start, ">", CLOSEANGLEBRACKET);
  tt2(Start, ")", CLOSEPAREN);
  tt2(Start, "&", AMPERSAND);
  tt2(Start, "*", ASTERISK);
  tt2(Start, "@", AT);
  tt2(Start, "`", BACKTICK);
  tt2(Start, "^", CARET);
  tt2(Start, ":", COLON);
  tt2(Start, ",", COMMA);
  tt2(Start, "$", DOLLAR);
  tt2(Start, ".", DOT);
  tt2(Start, "=", EQUALS);
  tt2(Start, "!", EXCLAMATION);
  tt2(Start, "-", HYPHEN);
  tt2(Start, "%", PERCENT);
  tt2(Start, "|", PIPE);
  tt2(Start, "+", PLUS);
  tt2(Start, "#", POUND);
  tt2(Start, "?", QUERY);
  tt2(Start, '"', QUOTE);
  tt2(Start, "/", SLASH);
  tt2(Start, ";", SEMI);
  tt2(Start, "~", TILDE);
  tt2(Start, "_", UNDERSCORE);
  tt2(Start, "\\", BACKSLASH);
  var Num = tr2(Start, DIGIT, NUM, (_tr = {}, _tr[numeric] = true, _tr));
  tr2(Num, DIGIT, Num);
  var Word = tr2(Start, ASCII_LETTER, WORD, (_tr2 = {}, _tr2[ascii] = true, _tr2));
  tr2(Word, ASCII_LETTER, Word);
  var UWord = tr2(Start, LETTER, UWORD, (_tr3 = {}, _tr3[alpha] = true, _tr3));
  tr2(UWord, ASCII_LETTER);
  tr2(UWord, LETTER, UWord);
  var Ws = tr2(Start, SPACE, WS, (_tr4 = {}, _tr4[whitespace] = true, _tr4));
  tt2(Start, NL, NL$1, (_tt = {}, _tt[whitespace] = true, _tt));
  tt2(Ws, NL);
  tr2(Ws, SPACE, Ws);
  var Emoji = tr2(Start, EMOJI, EMOJI$1, (_tr5 = {}, _tr5[emoji] = true, _tr5));
  tr2(Emoji, EMOJI, Emoji);
  tt2(Emoji, EMOJI_VARIATION, Emoji);
  var EmojiJoiner = tt2(Emoji, EMOJI_JOINER);
  tr2(EmojiJoiner, EMOJI, Emoji);
  var wordjr = [[ASCII_LETTER, Word]];
  var uwordjr = [[ASCII_LETTER, null], [LETTER, UWord]];
  for (var i = 0; i < tlds.length; i++) {
    fastts(Start, tlds[i], TLD, WORD, wordjr);
  }
  for (var _i = 0; _i < utlds.length; _i++) {
    fastts(Start, utlds[_i], UTLD, UWORD, uwordjr);
  }
  addToGroups(TLD, {
    tld: true,
    ascii: true
  }, groups);
  addToGroups(UTLD, {
    utld: true,
    alpha: true
  }, groups);
  fastts(Start, "file", SCHEME, WORD, wordjr);
  fastts(Start, "mailto", SCHEME, WORD, wordjr);
  fastts(Start, "http", SLASH_SCHEME, WORD, wordjr);
  fastts(Start, "https", SLASH_SCHEME, WORD, wordjr);
  fastts(Start, "ftp", SLASH_SCHEME, WORD, wordjr);
  fastts(Start, "ftps", SLASH_SCHEME, WORD, wordjr);
  addToGroups(SCHEME, {
    scheme: true,
    ascii: true
  }, groups);
  addToGroups(SLASH_SCHEME, {
    slashscheme: true,
    ascii: true
  }, groups);
  customSchemes = customSchemes.sort(function(a, b) {
    return a[0] > b[0] ? 1 : -1;
  });
  for (var _i2 = 0; _i2 < customSchemes.length; _i2++) {
    var _ref, _ref2;
    var sch = customSchemes[_i2][0];
    var optionalSlashSlash = customSchemes[_i2][1];
    var flags = optionalSlashSlash ? (_ref = {}, _ref[scheme] = true, _ref) : (_ref2 = {}, _ref2[slashscheme] = true, _ref2);
    if (sch.indexOf("-") >= 0) {
      flags[domain$1] = true;
    } else if (!ASCII_LETTER.test(sch)) {
      flags[numeric] = true;
    } else if (DIGIT.test(sch)) {
      flags[asciinumeric] = true;
    } else {
      flags[ascii] = true;
    }
    ts2(Start, sch, sch, flags);
  }
  ts2(Start, "localhost", LOCALHOST, {
    ascii: true
  });
  Start.jd = new State(SYM);
  return {
    start: Start,
    tokens: assign({
      groups
    }, tk)
  };
}
function run$1(start, str) {
  var iterable = stringToArray(str.replace(/[A-Z]/g, function(c) {
    return c.toLowerCase();
  }));
  var charCount = iterable.length;
  var tokens = [];
  var cursor = 0;
  var charCursor = 0;
  while (charCursor < charCount) {
    var state = start;
    var nextState = null;
    var tokenLength = 0;
    var latestAccepting = null;
    var sinceAccepts = -1;
    var charsSinceAccepts = -1;
    while (charCursor < charCount && (nextState = state.go(iterable[charCursor]))) {
      state = nextState;
      if (state.accepts()) {
        sinceAccepts = 0;
        charsSinceAccepts = 0;
        latestAccepting = state;
      } else if (sinceAccepts >= 0) {
        sinceAccepts += iterable[charCursor].length;
        charsSinceAccepts++;
      }
      tokenLength += iterable[charCursor].length;
      cursor += iterable[charCursor].length;
      charCursor++;
    }
    cursor -= sinceAccepts;
    charCursor -= charsSinceAccepts;
    tokenLength -= sinceAccepts;
    tokens.push({
      t: latestAccepting.t,
      // token type/name
      v: str.slice(cursor - tokenLength, cursor),
      // string value
      s: cursor - tokenLength,
      // start index
      e: cursor
      // end index (excluding)
    });
  }
  return tokens;
}
function stringToArray(str) {
  var result = [];
  var len = str.length;
  var index2 = 0;
  while (index2 < len) {
    var first = str.charCodeAt(index2);
    var second = void 0;
    var char = first < 55296 || first > 56319 || index2 + 1 === len || (second = str.charCodeAt(index2 + 1)) < 56320 || second > 57343 ? str[index2] : str.slice(index2, index2 + 2);
    result.push(char);
    index2 += char.length;
  }
  return result;
}
function fastts(state, input, t2, defaultt, jr) {
  var next;
  var len = input.length;
  for (var i = 0; i < len - 1; i++) {
    var char = input[i];
    if (state.j[char]) {
      next = state.j[char];
    } else {
      next = new State(defaultt);
      next.jr = jr.slice();
      state.j[char] = next;
    }
    state = next;
  }
  next = new State(t2);
  next.jr = jr.slice();
  state.j[input[len - 1]] = next;
  return next;
}
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf(o, p);
}
var defaults = {
  defaultProtocol: "http",
  events: null,
  format: noop,
  formatHref: noop,
  nl2br: false,
  tagName: "a",
  target: null,
  rel: null,
  validate: true,
  truncate: Infinity,
  className: null,
  attributes: null,
  ignoreTags: [],
  render: null
};
function Options(opts, defaultRender3) {
  if (defaultRender3 === void 0) {
    defaultRender3 = null;
  }
  var o = assign({}, defaults);
  if (opts) {
    o = assign(o, opts instanceof Options ? opts.o : opts);
  }
  var ignoredTags = o.ignoreTags;
  var uppercaseIgnoredTags = [];
  for (var i = 0; i < ignoredTags.length; i++) {
    uppercaseIgnoredTags.push(ignoredTags[i].toUpperCase());
  }
  this.o = o;
  if (defaultRender3) {
    this.defaultRender = defaultRender3;
  }
  this.ignoreTags = uppercaseIgnoredTags;
}
Options.prototype = {
  o: defaults,
  /**
   * @type string[]
   */
  ignoreTags: [],
  /**
   * @param {IntermediateRepresentation} ir
   * @returns {any}
   */
  defaultRender: function defaultRender(ir) {
    return ir;
  },
  /**
   * Returns true or false based on whether a token should be displayed as a
   * link based on the user options.
   * @param {MultiToken} token
   * @returns {boolean}
   */
  check: function check(token) {
    return this.get("validate", token.toString(), token);
  },
  // Private methods
  /**
   * Resolve an option's value based on the value of the option and the given
   * params. If operator and token are specified and the target option is
   * callable, automatically calls the function with the given argument.
   * @template {keyof Opts} K
   * @param {K} key Name of option to use
   * @param {string} [operator] will be passed to the target option if it's a
   * function. If not specified, RAW function value gets returned
   * @param {MultiToken} [token] The token from linkify.tokenize
   * @returns {Opts[K] | any}
   */
  get: function get(key, operator, token) {
    var isCallable = operator != null;
    var option = this.o[key];
    if (!option) {
      return option;
    }
    if (typeof option === "object") {
      option = token.t in option ? option[token.t] : defaults[key];
      if (typeof option === "function" && isCallable) {
        option = option(operator, token);
      }
    } else if (typeof option === "function" && isCallable) {
      option = option(operator, token.t, token);
    }
    return option;
  },
  /**
   * @template {keyof Opts} L
   * @param {L} key Name of options object to use
   * @param {string} [operator]
   * @param {MultiToken} [token]
   * @returns {Opts[L] | any}
   */
  getObj: function getObj(key, operator, token) {
    var obj = this.o[key];
    if (typeof obj === "function" && operator != null) {
      obj = obj(operator, token.t, token);
    }
    return obj;
  },
  /**
   * Convert the given token to a rendered element that may be added to the
   * calling-interface's DOM
   * @param {MultiToken} token Token to render to an HTML element
   * @returns {any} Render result; e.g., HTML string, DOM element, React
   *   Component, etc.
   */
  render: function render(token) {
    var ir = token.render(this);
    var renderFn = this.get("render", null, token) || this.defaultRender;
    return renderFn(ir, token.t, token);
  }
};
function noop(val) {
  return val;
}
function MultiToken(value, tokens) {
  this.t = "token";
  this.v = value;
  this.tk = tokens;
}
MultiToken.prototype = {
  isLink: false,
  /**
   * Return the string this token represents.
   * @return {string}
   */
  toString: function toString() {
    return this.v;
  },
  /**
   * What should the value for this token be in the `href` HTML attribute?
   * Returns the `.toString` value by default.
   * @param {string} [scheme]
   * @return {string}
  */
  toHref: function toHref(scheme2) {
    return this.toString();
  },
  /**
   * @param {Options} options Formatting options
   * @returns {string}
   */
  toFormattedString: function toFormattedString(options2) {
    var val = this.toString();
    var truncate = options2.get("truncate", val, this);
    var formatted = options2.get("format", val, this);
    return truncate && formatted.length > truncate ? formatted.substring(0, truncate) + "…" : formatted;
  },
  /**
   *
   * @param {Options} options
   * @returns {string}
   */
  toFormattedHref: function toFormattedHref(options2) {
    return options2.get("formatHref", this.toHref(options2.get("defaultProtocol")), this);
  },
  /**
   * The start index of this token in the original input string
   * @returns {number}
   */
  startIndex: function startIndex() {
    return this.tk[0].s;
  },
  /**
   * The end index of this token in the original input string (up to this
   * index but not including it)
   * @returns {number}
   */
  endIndex: function endIndex() {
    return this.tk[this.tk.length - 1].e;
  },
  /**
  	Returns an object  of relevant values for this token, which includes keys
  	* type - Kind of token ('url', 'email', etc.)
  	* value - Original text
  	* href - The value that should be added to the anchor tag's href
  		attribute
  		@method toObject
  	@param {string} [protocol] `'http'` by default
  */
  toObject: function toObject(protocol) {
    if (protocol === void 0) {
      protocol = defaults.defaultProtocol;
    }
    return {
      type: this.t,
      value: this.toString(),
      isLink: this.isLink,
      href: this.toHref(protocol),
      start: this.startIndex(),
      end: this.endIndex()
    };
  },
  /**
   *
   * @param {Options} options Formatting option
   */
  toFormattedObject: function toFormattedObject(options2) {
    return {
      type: this.t,
      value: this.toFormattedString(options2),
      isLink: this.isLink,
      href: this.toFormattedHref(options2),
      start: this.startIndex(),
      end: this.endIndex()
    };
  },
  /**
   * Whether this token should be rendered as a link according to the given options
   * @param {Options} options
   * @returns {boolean}
   */
  validate: function validate(options2) {
    return options2.get("validate", this.toString(), this);
  },
  /**
   * Return an object that represents how this link should be rendered.
   * @param {Options} options Formattinng options
   */
  render: function render2(options2) {
    var token = this;
    var href = this.toFormattedHref(options2);
    var tagName = options2.get("tagName", href, token);
    var content = this.toFormattedString(options2);
    var attributes = {};
    var className = options2.get("className", href, token);
    var target = options2.get("target", href, token);
    var rel = options2.get("rel", href, token);
    var attrs = options2.getObj("attributes", href, token);
    var eventListeners = options2.getObj("events", href, token);
    attributes.href = href;
    if (className) {
      attributes.class = className;
    }
    if (target) {
      attributes.target = target;
    }
    if (rel) {
      attributes.rel = rel;
    }
    if (attrs) {
      assign(attributes, attrs);
    }
    return {
      tagName,
      attributes,
      content,
      eventListeners
    };
  }
};
function createTokenClass(type, props) {
  var Token = /* @__PURE__ */ function(_MultiToken) {
    _inheritsLoose(Token2, _MultiToken);
    function Token2(value, tokens) {
      var _this;
      _this = _MultiToken.call(this, value, tokens) || this;
      _this.t = type;
      return _this;
    }
    return Token2;
  }(MultiToken);
  for (var p in props) {
    Token.prototype[p] = props[p];
  }
  Token.t = type;
  return Token;
}
var Email = createTokenClass("email", {
  isLink: true,
  toHref: function toHref2() {
    return "mailto:" + this.toString();
  }
});
var Text = createTokenClass("text");
var Nl = createTokenClass("nl");
var Url = createTokenClass("url", {
  isLink: true,
  /**
  	Lowercases relevant parts of the domain and adds the protocol if
  	required. Note that this will not escape unsafe HTML characters in the
  	URL.
  		@param {string} [scheme] default scheme (e.g., 'https')
  	@return {string} the full href
  */
  toHref: function toHref3(scheme2) {
    if (scheme2 === void 0) {
      scheme2 = defaults.defaultProtocol;
    }
    return this.hasProtocol() ? this.v : scheme2 + "://" + this.v;
  },
  /**
   * Check whether this URL token has a protocol
   * @return {boolean}
   */
  hasProtocol: function hasProtocol() {
    var tokens = this.tk;
    return tokens.length >= 2 && tokens[0].t !== LOCALHOST && tokens[1].t === COLON;
  }
});
var makeState = function makeState2(arg) {
  return new State(arg);
};
function init$1(_ref) {
  var groups = _ref.groups;
  var qsAccepting = groups.domain.concat([AMPERSAND, ASTERISK, AT, BACKSLASH, BACKTICK, CARET, DOLLAR, EQUALS, HYPHEN, NUM, PERCENT, PIPE, PLUS, POUND, SLASH, SYM, TILDE, UNDERSCORE]);
  var qsNonAccepting = [APOSTROPHE, CLOSEANGLEBRACKET, CLOSEBRACE, CLOSEBRACKET, CLOSEPAREN, COLON, COMMA, DOT, EXCLAMATION, OPENANGLEBRACKET, OPENBRACE, OPENBRACKET, OPENPAREN, QUERY, QUOTE, SEMI];
  var localpartAccepting = [AMPERSAND, APOSTROPHE, ASTERISK, BACKSLASH, BACKTICK, CARET, CLOSEBRACE, DOLLAR, EQUALS, HYPHEN, NUM, OPENBRACE, PERCENT, PIPE, PLUS, POUND, QUERY, SLASH, SYM, TILDE, UNDERSCORE];
  var Start = makeState();
  var Localpart = tt2(Start, TILDE);
  ta2(Localpart, localpartAccepting, Localpart);
  ta2(Localpart, groups.domain, Localpart);
  var Domain = makeState(), Scheme = makeState(), SlashScheme = makeState();
  ta2(Start, groups.domain, Domain);
  ta2(Start, groups.scheme, Scheme);
  ta2(Start, groups.slashscheme, SlashScheme);
  ta2(Domain, localpartAccepting, Localpart);
  ta2(Domain, groups.domain, Domain);
  var LocalpartAt = tt2(Domain, AT);
  tt2(Localpart, AT, LocalpartAt);
  var LocalpartDot = tt2(Localpart, DOT);
  ta2(LocalpartDot, localpartAccepting, Localpart);
  ta2(LocalpartDot, groups.domain, Localpart);
  var EmailDomain = makeState();
  ta2(LocalpartAt, groups.domain, EmailDomain);
  var EmailDomainDot = tt2(EmailDomain, DOT);
  ta2(EmailDomainDot, groups.domain, EmailDomain);
  var Email$1 = makeState(Email);
  ta2(EmailDomainDot, groups.tld, Email$1);
  ta2(EmailDomainDot, groups.utld, Email$1);
  tt2(LocalpartAt, LOCALHOST, Email$1);
  var EmailDomainHyphen = tt2(EmailDomain, HYPHEN);
  ta2(EmailDomainHyphen, groups.domain, EmailDomain);
  ta2(Email$1, groups.domain, EmailDomain);
  tt2(Email$1, DOT, EmailDomainDot);
  tt2(Email$1, HYPHEN, EmailDomainHyphen);
  var EmailColon = tt2(Email$1, COLON);
  ta2(EmailColon, groups.numeric, Email);
  var DomainHyphen = tt2(Domain, HYPHEN);
  var DomainDot = tt2(Domain, DOT);
  ta2(DomainHyphen, groups.domain, Domain);
  ta2(DomainDot, localpartAccepting, Localpart);
  ta2(DomainDot, groups.domain, Domain);
  var DomainDotTld = makeState(Url);
  ta2(DomainDot, groups.tld, DomainDotTld);
  ta2(DomainDot, groups.utld, DomainDotTld);
  ta2(DomainDotTld, groups.domain, Domain);
  ta2(DomainDotTld, localpartAccepting, Localpart);
  tt2(DomainDotTld, DOT, DomainDot);
  tt2(DomainDotTld, HYPHEN, DomainHyphen);
  tt2(DomainDotTld, AT, LocalpartAt);
  var DomainDotTldColon = tt2(DomainDotTld, COLON);
  var DomainDotTldColonPort = makeState(Url);
  ta2(DomainDotTldColon, groups.numeric, DomainDotTldColonPort);
  var Url$1 = makeState(Url);
  var UrlNonaccept = makeState();
  ta2(Url$1, qsAccepting, Url$1);
  ta2(Url$1, qsNonAccepting, UrlNonaccept);
  ta2(UrlNonaccept, qsAccepting, Url$1);
  ta2(UrlNonaccept, qsNonAccepting, UrlNonaccept);
  tt2(DomainDotTld, SLASH, Url$1);
  tt2(DomainDotTldColonPort, SLASH, Url$1);
  var UriPrefix = tt2(Scheme, COLON);
  var SlashSchemeColon = tt2(SlashScheme, COLON);
  var SlashSchemeColonSlash = tt2(SlashSchemeColon, SLASH);
  tt2(SlashSchemeColonSlash, SLASH, UriPrefix);
  ta2(Scheme, groups.domain, Domain);
  tt2(Scheme, DOT, DomainDot);
  tt2(Scheme, HYPHEN, DomainHyphen);
  ta2(SlashScheme, groups.domain, Domain);
  tt2(SlashScheme, DOT, DomainDot);
  tt2(SlashScheme, HYPHEN, DomainHyphen);
  ta2(UriPrefix, groups.domain, Url$1);
  tt2(UriPrefix, SLASH, Url$1);
  var UrlOpenbrace = tt2(Url$1, OPENBRACE);
  var UrlOpenbracket = tt2(Url$1, OPENBRACKET);
  var UrlOpenanglebracket = tt2(Url$1, OPENANGLEBRACKET);
  var UrlOpenparen = tt2(Url$1, OPENPAREN);
  tt2(UrlNonaccept, OPENBRACE, UrlOpenbrace);
  tt2(UrlNonaccept, OPENBRACKET, UrlOpenbracket);
  tt2(UrlNonaccept, OPENANGLEBRACKET, UrlOpenanglebracket);
  tt2(UrlNonaccept, OPENPAREN, UrlOpenparen);
  tt2(UrlOpenbrace, CLOSEBRACE, Url$1);
  tt2(UrlOpenbracket, CLOSEBRACKET, Url$1);
  tt2(UrlOpenanglebracket, CLOSEANGLEBRACKET, Url$1);
  tt2(UrlOpenparen, CLOSEPAREN, Url$1);
  tt2(UrlOpenbrace, CLOSEBRACE, Url$1);
  var UrlOpenbraceQ = makeState(Url);
  var UrlOpenbracketQ = makeState(Url);
  var UrlOpenanglebracketQ = makeState(Url);
  var UrlOpenparenQ = makeState(Url);
  ta2(UrlOpenbrace, qsAccepting, UrlOpenbraceQ);
  ta2(UrlOpenbracket, qsAccepting, UrlOpenbracketQ);
  ta2(UrlOpenanglebracket, qsAccepting, UrlOpenanglebracketQ);
  ta2(UrlOpenparen, qsAccepting, UrlOpenparenQ);
  var UrlOpenbraceSyms = makeState();
  var UrlOpenbracketSyms = makeState();
  var UrlOpenanglebracketSyms = makeState();
  var UrlOpenparenSyms = makeState();
  ta2(UrlOpenbrace, qsNonAccepting);
  ta2(UrlOpenbracket, qsNonAccepting);
  ta2(UrlOpenanglebracket, qsNonAccepting);
  ta2(UrlOpenparen, qsNonAccepting);
  ta2(UrlOpenbraceQ, qsAccepting, UrlOpenbraceQ);
  ta2(UrlOpenbracketQ, qsAccepting, UrlOpenbracketQ);
  ta2(UrlOpenanglebracketQ, qsAccepting, UrlOpenanglebracketQ);
  ta2(UrlOpenparenQ, qsAccepting, UrlOpenparenQ);
  ta2(UrlOpenbraceQ, qsNonAccepting, UrlOpenbraceQ);
  ta2(UrlOpenbracketQ, qsNonAccepting, UrlOpenbracketQ);
  ta2(UrlOpenanglebracketQ, qsNonAccepting, UrlOpenanglebracketQ);
  ta2(UrlOpenparenQ, qsNonAccepting, UrlOpenparenQ);
  ta2(UrlOpenbraceSyms, qsAccepting, UrlOpenbraceSyms);
  ta2(UrlOpenbracketSyms, qsAccepting, UrlOpenbracketQ);
  ta2(UrlOpenanglebracketSyms, qsAccepting, UrlOpenanglebracketQ);
  ta2(UrlOpenparenSyms, qsAccepting, UrlOpenparenQ);
  ta2(UrlOpenbraceSyms, qsNonAccepting, UrlOpenbraceSyms);
  ta2(UrlOpenbracketSyms, qsNonAccepting, UrlOpenbracketSyms);
  ta2(UrlOpenanglebracketSyms, qsNonAccepting, UrlOpenanglebracketSyms);
  ta2(UrlOpenparenSyms, qsNonAccepting, UrlOpenparenSyms);
  tt2(UrlOpenbracketQ, CLOSEBRACKET, Url$1);
  tt2(UrlOpenanglebracketQ, CLOSEANGLEBRACKET, Url$1);
  tt2(UrlOpenparenQ, CLOSEPAREN, Url$1);
  tt2(UrlOpenbraceQ, CLOSEBRACE, Url$1);
  tt2(UrlOpenbracketSyms, CLOSEBRACKET, Url$1);
  tt2(UrlOpenanglebracketSyms, CLOSEANGLEBRACKET, Url$1);
  tt2(UrlOpenparenSyms, CLOSEPAREN, Url$1);
  tt2(UrlOpenbraceSyms, CLOSEPAREN, Url$1);
  tt2(Start, LOCALHOST, DomainDotTld);
  tt2(Start, NL$1, Nl);
  return {
    start: Start,
    tokens: tk
  };
}
function run(start, input, tokens) {
  var len = tokens.length;
  var cursor = 0;
  var multis = [];
  var textTokens = [];
  while (cursor < len) {
    var state = start;
    var secondState = null;
    var nextState = null;
    var multiLength = 0;
    var latestAccepting = null;
    var sinceAccepts = -1;
    while (cursor < len && !(secondState = state.go(tokens[cursor].t))) {
      textTokens.push(tokens[cursor++]);
    }
    while (cursor < len && (nextState = secondState || state.go(tokens[cursor].t))) {
      secondState = null;
      state = nextState;
      if (state.accepts()) {
        sinceAccepts = 0;
        latestAccepting = state;
      } else if (sinceAccepts >= 0) {
        sinceAccepts++;
      }
      cursor++;
      multiLength++;
    }
    if (sinceAccepts < 0) {
      cursor -= multiLength;
      if (cursor < len) {
        textTokens.push(tokens[cursor]);
        cursor++;
      }
    } else {
      if (textTokens.length > 0) {
        multis.push(initMultiToken(Text, input, textTokens));
        textTokens = [];
      }
      cursor -= sinceAccepts;
      multiLength -= sinceAccepts;
      var Multi = latestAccepting.t;
      var subtokens = tokens.slice(cursor - multiLength, cursor);
      multis.push(initMultiToken(Multi, input, subtokens));
    }
  }
  if (textTokens.length > 0) {
    multis.push(initMultiToken(Text, input, textTokens));
  }
  return multis;
}
function initMultiToken(Multi, input, tokens) {
  var startIdx = tokens[0].s;
  var endIdx = tokens[tokens.length - 1].e;
  var value = input.slice(startIdx, endIdx);
  return new Multi(value, tokens);
}
var INIT = {
  scanner: null,
  parser: null,
  tokenQueue: [],
  pluginQueue: [],
  customSchemes: [],
  initialized: false
};
function init() {
  INIT.scanner = init$2(INIT.customSchemes);
  for (var i = 0; i < INIT.tokenQueue.length; i++) {
    INIT.tokenQueue[i][1]({
      scanner: INIT.scanner
    });
  }
  INIT.parser = init$1(INIT.scanner.tokens);
  for (var _i = 0; _i < INIT.pluginQueue.length; _i++) {
    INIT.pluginQueue[_i][1]({
      scanner: INIT.scanner,
      parser: INIT.parser
    });
  }
  INIT.initialized = true;
}
function tokenize(str) {
  if (!INIT.initialized) {
    init();
  }
  return run(INIT.parser.start, str, run$1(INIT.scanner.start, str));
}
function escapeText(text2) {
  return text2.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeAttr(href) {
  return href.replace(/"/g, "&quot;");
}
function attributesToString(attributes) {
  var result = [];
  for (var attr in attributes) {
    var val = attributes[attr] + "";
    result.push(attr + '="' + escapeAttr(val) + '"');
  }
  return result.join(" ");
}
function defaultRender2(_ref) {
  var tagName = _ref.tagName, attributes = _ref.attributes, content = _ref.content;
  return "<" + tagName + " " + attributesToString(attributes) + ">" + escapeText(content) + "</" + tagName + ">";
}
function linkifyStr(str, opts) {
  if (opts === void 0) {
    opts = {};
  }
  opts = new Options(opts, defaultRender2);
  var tokens = tokenize(str);
  var result = [];
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];
    if (token.t === "nl" && opts.get("nl2br")) {
      result.push("<br>\n");
    } else if (!token.isLink || !opts.check(token)) {
      result.push(escapeText(token.toString()));
    } else {
      result.push(opts.render(token));
    }
  }
  return result.join("");
}
if (!String.prototype.linkify) {
  Object.defineProperty(String.prototype, "linkify", {
    writable: false,
    value: function linkify(options2) {
      return linkifyStr(this, options2);
    }
  });
}
register(t13);
new PQueue({ concurrency: 5 });
register(t6);
register(t26);
var vueColor_min$1 = { exports: {} };
var vueColor_min = vueColor_min$1.exports;
var hasRequiredVueColor_min;
function requireVueColor_min() {
  if (hasRequiredVueColor_min) return vueColor_min$1.exports;
  hasRequiredVueColor_min = 1;
  (function(module, exports) {
    !function(e2, t2) {
      module.exports = t2();
    }("undefined" != typeof self ? self : vueColor_min, function() {
      return function(e2) {
        function t2(r) {
          if (n[r]) return n[r].exports;
          var i = n[r] = { i: r, l: false, exports: {} };
          return e2[r].call(i.exports, i, i.exports, t2), i.l = true, i.exports;
        }
        var n = {};
        return t2.m = e2, t2.c = n, t2.d = function(e3, n2, r) {
          t2.o(e3, n2) || Object.defineProperty(e3, n2, { configurable: false, enumerable: true, get: r });
        }, t2.n = function(e3) {
          var n2 = e3 && e3.__esModule ? function() {
            return e3.default;
          } : function() {
            return e3;
          };
          return t2.d(n2, "a", n2), n2;
        }, t2.o = function(e3, t3) {
          return Object.prototype.hasOwnProperty.call(e3, t3);
        }, t2.p = "", t2(t2.s = 60);
      }([function(e2, t2) {
        function n(e3, t3) {
          var n2 = e3[1] || "", i = e3[3];
          if (!i) return n2;
          if (t3 && "function" == typeof btoa) {
            var o = r(i);
            return [n2].concat(i.sources.map(function(e4) {
              return "/*# sourceURL=" + i.sourceRoot + e4 + " */";
            })).concat([o]).join("\n");
          }
          return [n2].join("\n");
        }
        function r(e3) {
          return "/*# sourceMappingURL=data:application/json;charset=utf-8;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(e3)))) + " */";
        }
        e2.exports = function(e3) {
          var t3 = [];
          return t3.toString = function() {
            return this.map(function(t4) {
              var r2 = n(t4, e3);
              return t4[2] ? "@media " + t4[2] + "{" + r2 + "}" : r2;
            }).join("");
          }, t3.i = function(e4, n2) {
            "string" == typeof e4 && (e4 = [[null, e4, ""]]);
            for (var r2 = {}, i = 0; i < this.length; i++) {
              var o = this[i][0];
              "number" == typeof o && (r2[o] = true);
            }
            for (i = 0; i < e4.length; i++) {
              var a = e4[i];
              "number" == typeof a[0] && r2[a[0]] || (n2 && !a[2] ? a[2] = n2 : n2 && (a[2] = "(" + a[2] + ") and (" + n2 + ")"), t3.push(a));
            }
          }, t3;
        };
      }, function(e2, t2, n) {
        function r(e3) {
          for (var t3 = 0; t3 < e3.length; t3++) {
            var n2 = e3[t3], r2 = u[n2.id];
            if (r2) {
              r2.refs++;
              for (var i2 = 0; i2 < r2.parts.length; i2++) r2.parts[i2](n2.parts[i2]);
              for (; i2 < n2.parts.length; i2++) r2.parts.push(o(n2.parts[i2]));
              r2.parts.length > n2.parts.length && (r2.parts.length = n2.parts.length);
            } else {
              for (var a2 = [], i2 = 0; i2 < n2.parts.length; i2++) a2.push(o(n2.parts[i2]));
              u[n2.id] = { id: n2.id, refs: 1, parts: a2 };
            }
          }
        }
        function i() {
          var e3 = document.createElement("style");
          return e3.type = "text/css", f.appendChild(e3), e3;
        }
        function o(e3) {
          var t3, n2, r2 = document.querySelector("style[" + b + '~="' + e3.id + '"]');
          if (r2) {
            if (p) return v;
            r2.parentNode.removeChild(r2);
          }
          if (x) {
            var o2 = h2++;
            r2 = d || (d = i()), t3 = a.bind(null, r2, o2, false), n2 = a.bind(null, r2, o2, true);
          } else r2 = i(), t3 = s.bind(null, r2), n2 = function() {
            r2.parentNode.removeChild(r2);
          };
          return t3(e3), function(r3) {
            if (r3) {
              if (r3.css === e3.css && r3.media === e3.media && r3.sourceMap === e3.sourceMap) return;
              t3(e3 = r3);
            } else n2();
          };
        }
        function a(e3, t3, n2, r2) {
          var i2 = n2 ? "" : r2.css;
          if (e3.styleSheet) e3.styleSheet.cssText = m(t3, i2);
          else {
            var o2 = document.createTextNode(i2), a2 = e3.childNodes;
            a2[t3] && e3.removeChild(a2[t3]), a2.length ? e3.insertBefore(o2, a2[t3]) : e3.appendChild(o2);
          }
        }
        function s(e3, t3) {
          var n2 = t3.css, r2 = t3.media, i2 = t3.sourceMap;
          if (r2 && e3.setAttribute("media", r2), g.ssrId && e3.setAttribute(b, t3.id), i2 && (n2 += "\n/*# sourceURL=" + i2.sources[0] + " */", n2 += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(i2)))) + " */"), e3.styleSheet) e3.styleSheet.cssText = n2;
          else {
            for (; e3.firstChild; ) e3.removeChild(e3.firstChild);
            e3.appendChild(document.createTextNode(n2));
          }
        }
        var c = "undefined" != typeof document;
        if ("undefined" != typeof DEBUG && DEBUG && !c) throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");
        var l = n(64), u = {}, f = c && (document.head || document.getElementsByTagName("head")[0]), d = null, h2 = 0, p = false, v = function() {
        }, g = null, b = "data-vue-ssr-id", x = "undefined" != typeof navigator && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase());
        e2.exports = function(e3, t3, n2, i2) {
          p = n2, g = i2 || {};
          var o2 = l(e3, t3);
          return r(o2), function(t4) {
            for (var n3 = [], i3 = 0; i3 < o2.length; i3++) {
              var a2 = o2[i3], s2 = u[a2.id];
              s2.refs--, n3.push(s2);
            }
            t4 ? (o2 = l(e3, t4), r(o2)) : o2 = [];
            for (var i3 = 0; i3 < n3.length; i3++) {
              var s2 = n3[i3];
              if (0 === s2.refs) {
                for (var c2 = 0; c2 < s2.parts.length; c2++) s2.parts[c2]();
                delete u[s2.id];
              }
            }
          };
        };
        var m = /* @__PURE__ */ function() {
          var e3 = [];
          return function(t3, n2) {
            return e3[t3] = n2, e3.filter(Boolean).join("\n");
          };
        }();
      }, function(e2, t2) {
        e2.exports = function(e3, t3, n, r, i, o) {
          var a, s = e3 = e3 || {}, c = typeof e3.default;
          "object" !== c && "function" !== c || (a = e3, s = e3.default);
          var l = "function" == typeof s ? s.options : s;
          t3 && (l.render = t3.render, l.staticRenderFns = t3.staticRenderFns, l._compiled = true), n && (l.functional = true), i && (l._scopeId = i);
          var u;
          if (o ? (u = function(e4) {
            e4 = e4 || this.$vnode && this.$vnode.ssrContext || this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext, e4 || "undefined" == typeof __VUE_SSR_CONTEXT__ || (e4 = __VUE_SSR_CONTEXT__), r && r.call(this, e4), e4 && e4._registeredComponents && e4._registeredComponents.add(o);
          }, l._ssrRegister = u) : r && (u = r), u) {
            var f = l.functional, d = f ? l.render : l.beforeCreate;
            f ? (l._injectStyles = u, l.render = function(e4, t4) {
              return u.call(t4), d(e4, t4);
            }) : l.beforeCreate = d ? [].concat(d, u) : [u];
          }
          return { esModule: a, exports: s, options: l };
        };
      }, function(e2, t2, n) {
        function r(e3, t3) {
          var n2, r2 = e3 && e3.a;
          !(n2 = e3 && e3.hsl ? (0, o.default)(e3.hsl) : e3 && e3.hex && e3.hex.length > 0 ? (0, o.default)(e3.hex) : e3 && e3.hsv ? (0, o.default)(e3.hsv) : e3 && e3.rgba ? (0, o.default)(e3.rgba) : e3 && e3.rgb ? (0, o.default)(e3.rgb) : (0, o.default)(e3)) || void 0 !== n2._a && null !== n2._a || n2.setAlpha(r2 || 1);
          var i2 = n2.toHsl(), a = n2.toHsv();
          return 0 === i2.s && (a.h = i2.h = e3.h || e3.hsl && e3.hsl.h || t3 || 0), { hsl: i2, hex: n2.toHexString().toUpperCase(), hex8: n2.toHex8String().toUpperCase(), rgba: n2.toRgb(), hsv: a, oldHue: e3.h || t3 || i2.h, source: e3.source, a: e3.a || n2.getAlpha() };
        }
        Object.defineProperty(t2, "__esModule", { value: true });
        var i = n(65), o = function(e3) {
          return e3 && e3.__esModule ? e3 : { default: e3 };
        }(i);
        t2.default = { props: ["value"], data: function() {
          return { val: r(this.value) };
        }, computed: { colors: { get: function() {
          return this.val;
        }, set: function(e3) {
          this.val = e3, this.$emit("input", e3);
        } } }, watch: { value: function(e3) {
          this.val = r(e3);
        } }, methods: { colorChange: function(e3, t3) {
          this.oldHue = this.colors.hsl.h, this.colors = r(e3, t3 || this.oldHue);
        }, isValidHex: function(e3) {
          return (0, o.default)(e3).isValid();
        }, simpleCheckForValidColor: function(e3) {
          for (var t3 = ["r", "g", "b", "a", "h", "s", "l", "v"], n2 = 0, r2 = 0, i2 = 0; i2 < t3.length; i2++) {
            var o2 = t3[i2];
            e3[o2] && (n2++, isNaN(e3[o2]) || r2++);
          }
          if (n2 === r2) return e3;
        }, paletteUpperCase: function(e3) {
          return e3.map(function(e4) {
            return e4.toUpperCase();
          });
        }, isTransparent: function(e3) {
          return 0 === (0, o.default)(e3).getAlpha();
        } } };
      }, function(e2, t2) {
        var n = e2.exports = "undefined" != typeof window && window.Math == Math ? window : "undefined" != typeof self && self.Math == Math ? self : Function("return this")();
        "number" == typeof __g && (__g = n);
      }, function(e2, t2, n) {
        function r(e3) {
          n(66);
        }
        Object.defineProperty(t2, "__esModule", { value: true });
        var i = n(36), o = n.n(i);
        for (var a in i) "default" !== a && function(e3) {
          n.d(t2, e3, function() {
            return i[e3];
          });
        }(a);
        var s = n(68), l = n(2), u = r, f = l(o.a, s.a, false, u, null, null);
        f.options.__file = "src/components/common/EditableInput.vue", t2.default = f.exports;
      }, function(e2, t2) {
        var n = {}.hasOwnProperty;
        e2.exports = function(e3, t3) {
          return n.call(e3, t3);
        };
      }, function(e2, t2, n) {
        var r = n(8), i = n(18);
        e2.exports = n(9) ? function(e3, t3, n2) {
          return r.f(e3, t3, i(1, n2));
        } : function(e3, t3, n2) {
          return e3[t3] = n2, e3;
        };
      }, function(e2, t2, n) {
        var r = n(16), i = n(42), o = n(25), a = Object.defineProperty;
        t2.f = n(9) ? Object.defineProperty : function(e3, t3, n2) {
          if (r(e3), t3 = o(t3, true), r(n2), i) try {
            return a(e3, t3, n2);
          } catch (e4) {
          }
          if ("get" in n2 || "set" in n2) throw TypeError("Accessors not supported!");
          return "value" in n2 && (e3[t3] = n2.value), e3;
        };
      }, function(e2, t2, n) {
        e2.exports = !n(17)(function() {
          return 7 != Object.defineProperty({}, "a", { get: function() {
            return 7;
          } }).a;
        });
      }, function(e2, t2, n) {
        var r = n(90), i = n(24);
        e2.exports = function(e3) {
          return r(i(e3));
        };
      }, function(e2, t2, n) {
        var r = n(29)("wks"), i = n(19), o = n(4).Symbol, a = "function" == typeof o;
        (e2.exports = function(e3) {
          return r[e3] || (r[e3] = a && o[e3] || (a ? o : i)("Symbol." + e3));
        }).store = r;
      }, function(e2, t2) {
        e2.exports = function(e3) {
          return "object" == typeof e3 ? null !== e3 : "function" == typeof e3;
        };
      }, function(e2, t2, n) {
        function r(e3) {
          n(111);
        }
        Object.defineProperty(t2, "__esModule", { value: true });
        var i = n(51), o = n.n(i);
        for (var a in i) "default" !== a && function(e3) {
          n.d(t2, e3, function() {
            return i[e3];
          });
        }(a);
        var s = n(113), l = n(2), u = r, f = l(o.a, s.a, false, u, null, null);
        f.options.__file = "src/components/common/Hue.vue", t2.default = f.exports;
      }, function(e2, t2) {
        e2.exports = true;
      }, function(e2, t2) {
        var n = e2.exports = { version: "2.6.11" };
        "number" == typeof __e && (__e = n);
      }, function(e2, t2, n) {
        var r = n(12);
        e2.exports = function(e3) {
          if (!r(e3)) throw TypeError(e3 + " is not an object!");
          return e3;
        };
      }, function(e2, t2) {
        e2.exports = function(e3) {
          try {
            return !!e3();
          } catch (e4) {
            return true;
          }
        };
      }, function(e2, t2) {
        e2.exports = function(e3, t3) {
          return { enumerable: !(1 & e3), configurable: !(2 & e3), writable: !(4 & e3), value: t3 };
        };
      }, function(e2, t2) {
        var n = 0, r = Math.random();
        e2.exports = function(e3) {
          return "Symbol(".concat(void 0 === e3 ? "" : e3, ")_", (++n + r).toString(36));
        };
      }, function(e2, t2, n) {
        function r(e3) {
          n(123);
        }
        Object.defineProperty(t2, "__esModule", { value: true });
        var i = n(54), o = n.n(i);
        for (var a in i) "default" !== a && function(e3) {
          n.d(t2, e3, function() {
            return i[e3];
          });
        }(a);
        var s = n(127), l = n(2), u = r, f = l(o.a, s.a, false, u, null, null);
        f.options.__file = "src/components/common/Saturation.vue", t2.default = f.exports;
      }, function(e2, t2, n) {
        function r(e3) {
          n(128);
        }
        Object.defineProperty(t2, "__esModule", { value: true });
        var i = n(55), o = n.n(i);
        for (var a in i) "default" !== a && function(e3) {
          n.d(t2, e3, function() {
            return i[e3];
          });
        }(a);
        var s = n(133), l = n(2), u = r, f = l(o.a, s.a, false, u, null, null);
        f.options.__file = "src/components/common/Alpha.vue", t2.default = f.exports;
      }, function(e2, t2, n) {
        function r(e3) {
          n(130);
        }
        Object.defineProperty(t2, "__esModule", { value: true });
        var i = n(56), o = n.n(i);
        for (var a in i) "default" !== a && function(e3) {
          n.d(t2, e3, function() {
            return i[e3];
          });
        }(a);
        var s = n(132), l = n(2), u = r, f = l(o.a, s.a, false, u, null, null);
        f.options.__file = "src/components/common/Checkboard.vue", t2.default = f.exports;
      }, function(e2, t2) {
        var n = Math.ceil, r = Math.floor;
        e2.exports = function(e3) {
          return isNaN(e3 = +e3) ? 0 : (e3 > 0 ? r : n)(e3);
        };
      }, function(e2, t2) {
        e2.exports = function(e3) {
          if (void 0 == e3) throw TypeError("Can't call method on  " + e3);
          return e3;
        };
      }, function(e2, t2, n) {
        var r = n(12);
        e2.exports = function(e3, t3) {
          if (!r(e3)) return e3;
          var n2, i;
          if (t3 && "function" == typeof (n2 = e3.toString) && !r(i = n2.call(e3))) return i;
          if ("function" == typeof (n2 = e3.valueOf) && !r(i = n2.call(e3))) return i;
          if (!t3 && "function" == typeof (n2 = e3.toString) && !r(i = n2.call(e3))) return i;
          throw TypeError("Can't convert object to primitive value");
        };
      }, function(e2, t2) {
        e2.exports = {};
      }, function(e2, t2, n) {
        var r = n(46), i = n(30);
        e2.exports = Object.keys || function(e3) {
          return r(e3, i);
        };
      }, function(e2, t2, n) {
        var r = n(29)("keys"), i = n(19);
        e2.exports = function(e3) {
          return r[e3] || (r[e3] = i(e3));
        };
      }, function(e2, t2, n) {
        var r = n(15), i = n(4), o = i["__core-js_shared__"] || (i["__core-js_shared__"] = {});
        (e2.exports = function(e3, t3) {
          return o[e3] || (o[e3] = void 0 !== t3 ? t3 : {});
        })("versions", []).push({ version: r.version, mode: n(14) ? "pure" : "global", copyright: "© 2019 Denis Pushkarev (zloirock.ru)" });
      }, function(e2, t2) {
        e2.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");
      }, function(e2, t2, n) {
        var r = n(8).f, i = n(6), o = n(11)("toStringTag");
        e2.exports = function(e3, t3, n2) {
          e3 && !i(e3 = n2 ? e3 : e3.prototype, o) && r(e3, o, { configurable: true, value: t3 });
        };
      }, function(e2, t2, n) {
        t2.f = n(11);
      }, function(e2, t2, n) {
        var r = n(4), i = n(15), o = n(14), a = n(32), s = n(8).f;
        e2.exports = function(e3) {
          var t3 = i.Symbol || (i.Symbol = o ? {} : r.Symbol || {});
          "_" == e3.charAt(0) || e3 in t3 || s(t3, e3, { value: a.f(e3) });
        };
      }, function(e2, t2) {
        t2.f = {}.propertyIsEnumerable;
      }, function(e2, t2, n) {
        function r(e3) {
          return e3 && e3.__esModule ? e3 : { default: e3 };
        }
        Object.defineProperty(t2, "__esModule", { value: true });
        var i = n(3), o = r(i), a = n(5), s = r(a), c = ["#4D4D4D", "#999999", "#FFFFFF", "#F44E3B", "#FE9200", "#FCDC00", "#DBDF00", "#A4DD00", "#68CCCA", "#73D8FF", "#AEA1FF", "#FDA1FF", "#333333", "#808080", "#CCCCCC", "#D33115", "#E27300", "#FCC400", "#B0BC00", "#68BC00", "#16A5A5", "#009CE0", "#7B64FF", "#FA28FF", "#000000", "#666666", "#B3B3B3", "#9F0500", "#C45100", "#FB9E00", "#808900", "#194D33", "#0C797D", "#0062B1", "#653294", "#AB149E"];
        t2.default = { name: "Compact", mixins: [o.default], props: { palette: { type: Array, default: function() {
          return c;
        } } }, components: { "ed-in": s.default }, computed: { pick: function() {
          return this.colors.hex.toUpperCase();
        } }, methods: { handlerClick: function(e3) {
          this.colorChange({ hex: e3, source: "hex" });
        } } };
      }, function(e2, t2, n) {
        Object.defineProperty(t2, "__esModule", { value: true }), t2.default = { name: "editableInput", props: { label: String, labelText: String, desc: String, value: [String, Number], max: Number, min: Number, arrowOffset: { type: Number, default: 1 } }, computed: { val: { get: function() {
          return this.value;
        }, set: function(e3) {
          if (!(void 0 !== this.max && +e3 > this.max)) return e3;
          this.$refs.input.value = this.max;
        } }, labelId: function() {
          return "input__label__" + this.label + "__" + Math.random().toString().slice(2, 5);
        }, labelSpanText: function() {
          return this.labelText || this.label;
        } }, methods: { update: function(e3) {
          this.handleChange(e3.target.value);
        }, handleChange: function(e3) {
          var t3 = {};
          t3[this.label] = e3, void 0 === t3.hex && void 0 === t3["#"] ? this.$emit("change", t3) : e3.length > 5 && this.$emit("change", t3);
        }, handleKeyDown: function(e3) {
          var t3 = this.val, n2 = Number(t3);
          if (n2) {
            var r = this.arrowOffset || 1;
            38 === e3.keyCode && (t3 = n2 + r, this.handleChange(t3), e3.preventDefault()), 40 === e3.keyCode && (t3 = n2 - r, this.handleChange(t3), e3.preventDefault());
          }
        } } };
      }, function(e2, t2, n) {
        Object.defineProperty(t2, "__esModule", { value: true });
        var r = n(3), i = function(e3) {
          return e3 && e3.__esModule ? e3 : { default: e3 };
        }(r), o = ["#FFFFFF", "#F2F2F2", "#E6E6E6", "#D9D9D9", "#CCCCCC", "#BFBFBF", "#B3B3B3", "#A6A6A6", "#999999", "#8C8C8C", "#808080", "#737373", "#666666", "#595959", "#4D4D4D", "#404040", "#333333", "#262626", "#0D0D0D", "#000000"];
        t2.default = { name: "Grayscale", mixins: [i.default], props: { palette: { type: Array, default: function() {
          return o;
        } } }, components: {}, computed: { pick: function() {
          return this.colors.hex.toUpperCase();
        } }, methods: { handlerClick: function(e3) {
          this.colorChange({ hex: e3, source: "hex" });
        } } };
      }, function(e2, t2, n) {
        function r(e3) {
          return e3 && e3.__esModule ? e3 : { default: e3 };
        }
        Object.defineProperty(t2, "__esModule", { value: true });
        var i = n(5), o = r(i), a = n(3), s = r(a);
        t2.default = { name: "Material", mixins: [s.default], components: { "ed-in": o.default }, methods: { onChange: function(e3) {
          e3 && (e3.hex ? this.isValidHex(e3.hex) && this.colorChange({ hex: e3.hex, source: "hex" }) : (e3.r || e3.g || e3.b) && this.colorChange({ r: e3.r || this.colors.rgba.r, g: e3.g || this.colors.rgba.g, b: e3.b || this.colors.rgba.b, a: e3.a || this.colors.rgba.a, source: "rgba" }));
        } } };
      }, function(e2, t2, n) {
        function r(e3) {
          return e3 && e3.__esModule ? e3 : { default: e3 };
        }
        Object.defineProperty(t2, "__esModule", { value: true });
        var i = n(81), o = r(i), a = n(3), s = r(a), c = n(13), l = r(c);
        t2.default = { name: "Slider", mixins: [s.default], props: { swatches: { type: Array, default: function() {
          return [{ s: 0.5, l: 0.8 }, { s: 0.5, l: 0.65 }, { s: 0.5, l: 0.5 }, { s: 0.5, l: 0.35 }, { s: 0.5, l: 0.2 }];
        } } }, components: { hue: l.default }, computed: { normalizedSwatches: function() {
          return this.swatches.map(function(e3) {
            return "object" !== (void 0 === e3 ? "undefined" : (0, o.default)(e3)) ? { s: 0.5, l: e3 } : e3;
          });
        } }, methods: { isActive: function(e3, t3) {
          var n2 = this.colors.hsl;
          return 1 === n2.l && 1 === e3.l || (0 === n2.l && 0 === e3.l || Math.abs(n2.l - e3.l) < 0.01 && Math.abs(n2.s - e3.s) < 0.01);
        }, hueChange: function(e3) {
          this.colorChange(e3);
        }, handleSwClick: function(e3, t3) {
          this.colorChange({ h: this.colors.hsl.h, s: t3.s, l: t3.l, source: "hsl" });
        } } };
      }, function(e2, t2, n) {
        var r = n(14), i = n(41), o = n(44), a = n(7), s = n(26), c = n(88), l = n(31), u = n(95), f = n(11)("iterator"), d = !([].keys && "next" in [].keys()), h2 = function() {
          return this;
        };
        e2.exports = function(e3, t3, n2, p, v, g, b) {
          c(n2, t3, p);
          var x, m, _2, w = function(e4) {
            if (!d && e4 in F) return F[e4];
            switch (e4) {
              case "keys":
              case "values":
                return function() {
                  return new n2(this, e4);
                };
            }
            return function() {
              return new n2(this, e4);
            };
          }, y = t3 + " Iterator", C = "values" == v, k = false, F = e3.prototype, S = F[f] || F["@@iterator"] || v && F[v], A = S || w(v), O = v ? C ? w("entries") : A : void 0, E = "Array" == t3 ? F.entries || S : S;
          if (E && (_2 = u(E.call(new e3()))) !== Object.prototype && _2.next && (l(_2, y, true), r || "function" == typeof _2[f] || a(_2, f, h2)), C && S && "values" !== S.name && (k = true, A = function() {
            return S.call(this);
          }), r && !b || !d && !k && F[f] || a(F, f, A), s[t3] = A, s[y] = h2, v) if (x = { values: C ? A : w("values"), keys: g ? A : w("keys"), entries: O }, b) for (m in x) m in F || o(F, m, x[m]);
          else i(i.P + i.F * (d || k), t3, x);
          return x;
        };
      }, function(e2, t2, n) {
        var r = n(4), i = n(15), o = n(86), a = n(7), s = n(6), c = function(e3, t3, n2) {
          var l, u, f, d = e3 & c.F, h2 = e3 & c.G, p = e3 & c.S, v = e3 & c.P, g = e3 & c.B, b = e3 & c.W, x = h2 ? i : i[t3] || (i[t3] = {}), m = x.prototype, _2 = h2 ? r : p ? r[t3] : (r[t3] || {}).prototype;
          h2 && (n2 = t3);
          for (l in n2) (u = !d && _2 && void 0 !== _2[l]) && s(x, l) || (f = u ? _2[l] : n2[l], x[l] = h2 && "function" != typeof _2[l] ? n2[l] : g && u ? o(f, r) : b && _2[l] == f ? function(e4) {
            var t4 = function(t9, n3, r2) {
              if (this instanceof e4) {
                switch (arguments.length) {
                  case 0:
                    return new e4();
                  case 1:
                    return new e4(t9);
                  case 2:
                    return new e4(t9, n3);
                }
                return new e4(t9, n3, r2);
              }
              return e4.apply(this, arguments);
            };
            return t4.prototype = e4.prototype, t4;
          }(f) : v && "function" == typeof f ? o(Function.call, f) : f, v && ((x.virtual || (x.virtual = {}))[l] = f, e3 & c.R && m && !m[l] && a(m, l, f)));
        };
        c.F = 1, c.G = 2, c.S = 4, c.P = 8, c.B = 16, c.W = 32, c.U = 64, c.R = 128, e2.exports = c;
      }, function(e2, t2, n) {
        e2.exports = !n(9) && !n(17)(function() {
          return 7 != Object.defineProperty(n(43)("div"), "a", { get: function() {
            return 7;
          } }).a;
        });
      }, function(e2, t2, n) {
        var r = n(12), i = n(4).document, o = r(i) && r(i.createElement);
        e2.exports = function(e3) {
          return o ? i.createElement(e3) : {};
        };
      }, function(e2, t2, n) {
        e2.exports = n(7);
      }, function(e2, t2, n) {
        var r = n(16), i = n(89), o = n(30), a = n(28)("IE_PROTO"), s = function() {
        }, c = function() {
          var e3, t3 = n(43)("iframe"), r2 = o.length;
          for (t3.style.display = "none", n(94).appendChild(t3), t3.src = "javascript:", e3 = t3.contentWindow.document, e3.open(), e3.write("<script>document.F=Object<\/script>"), e3.close(), c = e3.F; r2--; ) delete c.prototype[o[r2]];
          return c();
        };
        e2.exports = Object.create || function(e3, t3) {
          var n2;
          return null !== e3 ? (s.prototype = r(e3), n2 = new s(), s.prototype = null, n2[a] = e3) : n2 = c(), void 0 === t3 ? n2 : i(n2, t3);
        };
      }, function(e2, t2, n) {
        var r = n(6), i = n(10), o = n(91)(false), a = n(28)("IE_PROTO");
        e2.exports = function(e3, t3) {
          var n2, s = i(e3), c = 0, l = [];
          for (n2 in s) n2 != a && r(s, n2) && l.push(n2);
          for (; t3.length > c; ) r(s, n2 = t3[c++]) && (~o(l, n2) || l.push(n2));
          return l;
        };
      }, function(e2, t2) {
        var n = {}.toString;
        e2.exports = function(e3) {
          return n.call(e3).slice(8, -1);
        };
      }, function(e2, t2, n) {
        var r = n(24);
        e2.exports = function(e3) {
          return Object(r(e3));
        };
      }, function(e2, t2) {
        t2.f = Object.getOwnPropertySymbols;
      }, function(e2, t2, n) {
        var r = n(46), i = n(30).concat("length", "prototype");
        t2.f = Object.getOwnPropertyNames || function(e3) {
          return r(e3, i);
        };
      }, function(e2, t2, n) {
        Object.defineProperty(t2, "__esModule", { value: true }), t2.default = { name: "Hue", props: { value: Object, direction: { type: String, default: "horizontal" } }, data: function() {
          return { oldHue: 0, pullDirection: "" };
        }, computed: { colors: function() {
          var e3 = this.value.hsl.h;
          return 0 !== e3 && e3 - this.oldHue > 0 && (this.pullDirection = "right"), 0 !== e3 && e3 - this.oldHue < 0 && (this.pullDirection = "left"), this.oldHue = e3, this.value;
        }, directionClass: function() {
          return { "vc-hue--horizontal": "horizontal" === this.direction, "vc-hue--vertical": "vertical" === this.direction };
        }, pointerTop: function() {
          return "vertical" === this.direction ? 0 === this.colors.hsl.h && "right" === this.pullDirection ? 0 : -100 * this.colors.hsl.h / 360 + 100 + "%" : 0;
        }, pointerLeft: function() {
          return "vertical" === this.direction ? 0 : 0 === this.colors.hsl.h && "right" === this.pullDirection ? "100%" : 100 * this.colors.hsl.h / 360 + "%";
        } }, methods: { handleChange: function(e3, t3) {
          !t3 && e3.preventDefault();
          var n2 = this.$refs.container;
          if (n2) {
            var r, i, o = n2.clientWidth, a = n2.clientHeight, s = n2.getBoundingClientRect().left + window.pageXOffset, c = n2.getBoundingClientRect().top + window.pageYOffset, l = e3.pageX || (e3.touches ? e3.touches[0].pageX : 0), u = e3.pageY || (e3.touches ? e3.touches[0].pageY : 0), f = l - s, d = u - c;
            "vertical" === this.direction ? (d < 0 ? r = 360 : d > a ? r = 0 : (i = -100 * d / a + 100, r = 360 * i / 100), this.colors.hsl.h !== r && this.$emit("change", { h: r, s: this.colors.hsl.s, l: this.colors.hsl.l, a: this.colors.hsl.a, source: "hsl" })) : (f < 0 ? r = 0 : f > o ? r = 360 : (i = 100 * f / o, r = 360 * i / 100), this.colors.hsl.h !== r && this.$emit("change", { h: r, s: this.colors.hsl.s, l: this.colors.hsl.l, a: this.colors.hsl.a, source: "hsl" }));
          }
        }, handleMouseDown: function(e3) {
          this.handleChange(e3, true), window.addEventListener("mousemove", this.handleChange), window.addEventListener("mouseup", this.handleMouseUp);
        }, handleMouseUp: function(e3) {
          this.unbindEventListeners();
        }, unbindEventListeners: function() {
          window.removeEventListener("mousemove", this.handleChange), window.removeEventListener("mouseup", this.handleMouseUp);
        } } };
      }, function(e2, t2, n) {
        function r(e3) {
          return e3 && e3.__esModule ? e3 : { default: e3 };
        }
        Object.defineProperty(t2, "__esModule", { value: true });
        var i = n(118), o = r(i), a = n(3), s = r(a), c = ["red", "pink", "purple", "deepPurple", "indigo", "blue", "lightBlue", "cyan", "teal", "green", "lightGreen", "lime", "yellow", "amber", "orange", "deepOrange", "brown", "blueGrey", "black"], l = ["900", "700", "500", "300", "100"], u = function() {
          var e3 = [];
          return c.forEach(function(t3) {
            var n2 = [];
            "black" === t3.toLowerCase() || "white" === t3.toLowerCase() ? n2 = n2.concat(["#000000", "#FFFFFF"]) : l.forEach(function(e4) {
              var r2 = o.default[t3][e4];
              n2.push(r2.toUpperCase());
            }), e3.push(n2);
          }), e3;
        }();
        t2.default = { name: "Swatches", mixins: [s.default], props: { palette: { type: Array, default: function() {
          return u;
        } } }, computed: { pick: function() {
          return this.colors.hex;
        } }, methods: { equal: function(e3) {
          return e3.toLowerCase() === this.colors.hex.toLowerCase();
        }, handlerClick: function(e3) {
          this.colorChange({ hex: e3, source: "hex" });
        } } };
      }, function(e2, t2, n) {
        function r(e3) {
          return e3 && e3.__esModule ? e3 : { default: e3 };
        }
        Object.defineProperty(t2, "__esModule", { value: true });
        var i = n(3), o = r(i), a = n(5), s = r(a), c = n(20), l = r(c), u = n(13), f = r(u), d = n(21), h2 = r(d);
        t2.default = { name: "Photoshop", mixins: [o.default], props: { head: { type: String, default: "Color Picker" }, disableFields: { type: Boolean, default: false }, hasResetButton: { type: Boolean, default: false }, acceptLabel: { type: String, default: "OK" }, cancelLabel: { type: String, default: "Cancel" }, resetLabel: { type: String, default: "Reset" }, newLabel: { type: String, default: "new" }, currentLabel: { type: String, default: "current" } }, components: { saturation: l.default, hue: f.default, alpha: h2.default, "ed-in": s.default }, data: function() {
          return { currentColor: "#FFF" };
        }, computed: { hsv: function() {
          var e3 = this.colors.hsv;
          return { h: e3.h.toFixed(), s: (100 * e3.s).toFixed(), v: (100 * e3.v).toFixed() };
        }, hex: function() {
          var e3 = this.colors.hex;
          return e3 && e3.replace("#", "");
        } }, created: function() {
          this.currentColor = this.colors.hex;
        }, methods: { childChange: function(e3) {
          this.colorChange(e3);
        }, inputChange: function(e3) {
          e3 && (e3["#"] ? this.isValidHex(e3["#"]) && this.colorChange({ hex: e3["#"], source: "hex" }) : e3.r || e3.g || e3.b || e3.a ? this.colorChange({ r: e3.r || this.colors.rgba.r, g: e3.g || this.colors.rgba.g, b: e3.b || this.colors.rgba.b, a: e3.a || this.colors.rgba.a, source: "rgba" }) : (e3.h || e3.s || e3.v) && this.colorChange({ h: e3.h || this.colors.hsv.h, s: e3.s / 100 || this.colors.hsv.s, v: e3.v / 100 || this.colors.hsv.v, source: "hsv" }));
        }, clickCurrentColor: function() {
          this.colorChange({ hex: this.currentColor, source: "hex" });
        }, handleAccept: function() {
          this.$emit("ok");
        }, handleCancel: function() {
          this.$emit("cancel");
        }, handleReset: function() {
          this.$emit("reset");
        } } };
      }, function(e2, t2, n) {
        function r(e3) {
          return e3 && e3.__esModule ? e3 : { default: e3 };
        }
        Object.defineProperty(t2, "__esModule", { value: true });
        var i = n(125), o = r(i), a = n(126), s = r(a);
        t2.default = { name: "Saturation", props: { value: Object }, computed: { colors: function() {
          return this.value;
        }, bgColor: function() {
          return "hsl(" + this.colors.hsv.h + ", 100%, 50%)";
        }, pointerTop: function() {
          return -100 * this.colors.hsv.v + 1 + 100 + "%";
        }, pointerLeft: function() {
          return 100 * this.colors.hsv.s + "%";
        } }, methods: { throttle: (0, s.default)(function(e3, t3) {
          e3(t3);
        }, 20, { leading: true, trailing: false }), handleChange: function(e3, t3) {
          !t3 && e3.preventDefault();
          var n2 = this.$refs.container;
          if (n2) {
            var r2 = n2.clientWidth, i2 = n2.clientHeight, a2 = n2.getBoundingClientRect().left + window.pageXOffset, s2 = n2.getBoundingClientRect().top + window.pageYOffset, c = e3.pageX || (e3.touches ? e3.touches[0].pageX : 0), l = e3.pageY || (e3.touches ? e3.touches[0].pageY : 0), u = (0, o.default)(c - a2, 0, r2), f = (0, o.default)(l - s2, 0, i2), d = u / r2, h2 = (0, o.default)(-f / i2 + 1, 0, 1);
            this.throttle(this.onChange, { h: this.colors.hsv.h, s: d, v: h2, a: this.colors.hsv.a, source: "hsva" });
          }
        }, onChange: function(e3) {
          this.$emit("change", e3);
        }, handleMouseDown: function(e3) {
          window.addEventListener("mousemove", this.handleChange), window.addEventListener("mouseup", this.handleChange), window.addEventListener("mouseup", this.handleMouseUp);
        }, handleMouseUp: function(e3) {
          this.unbindEventListeners();
        }, unbindEventListeners: function() {
          window.removeEventListener("mousemove", this.handleChange), window.removeEventListener("mouseup", this.handleChange), window.removeEventListener("mouseup", this.handleMouseUp);
        } } };
      }, function(e2, t2, n) {
        Object.defineProperty(t2, "__esModule", { value: true });
        var r = n(22), i = function(e3) {
          return e3 && e3.__esModule ? e3 : { default: e3 };
        }(r);
        t2.default = { name: "Alpha", props: { value: Object, onChange: Function }, components: { checkboard: i.default }, computed: { colors: function() {
          return this.value;
        }, gradientColor: function() {
          var e3 = this.colors.rgba, t3 = [e3.r, e3.g, e3.b].join(",");
          return "linear-gradient(to right, rgba(" + t3 + ", 0) 0%, rgba(" + t3 + ", 1) 100%)";
        } }, methods: { handleChange: function(e3, t3) {
          !t3 && e3.preventDefault();
          var n2 = this.$refs.container;
          if (n2) {
            var r2, i2 = n2.clientWidth, o = n2.getBoundingClientRect().left + window.pageXOffset, a = e3.pageX || (e3.touches ? e3.touches[0].pageX : 0), s = a - o;
            r2 = s < 0 ? 0 : s > i2 ? 1 : Math.round(100 * s / i2) / 100, this.colors.a !== r2 && this.$emit("change", { h: this.colors.hsl.h, s: this.colors.hsl.s, l: this.colors.hsl.l, a: r2, source: "rgba" });
          }
        }, handleMouseDown: function(e3) {
          this.handleChange(e3, true), window.addEventListener("mousemove", this.handleChange), window.addEventListener("mouseup", this.handleMouseUp);
        }, handleMouseUp: function() {
          this.unbindEventListeners();
        }, unbindEventListeners: function() {
          window.removeEventListener("mousemove", this.handleChange), window.removeEventListener("mouseup", this.handleMouseUp);
        } } };
      }, function(e2, t2, n) {
        function r(e3, t3, n2) {
          if ("undefined" == typeof document) return null;
          var r2 = document.createElement("canvas");
          r2.width = r2.height = 2 * n2;
          var i2 = r2.getContext("2d");
          return i2 ? (i2.fillStyle = e3, i2.fillRect(0, 0, r2.width, r2.height), i2.fillStyle = t3, i2.fillRect(0, 0, n2, n2), i2.translate(n2, n2), i2.fillRect(0, 0, n2, n2), r2.toDataURL()) : null;
        }
        function i(e3, t3, n2) {
          var i2 = e3 + "," + t3 + "," + n2;
          if (o[i2]) return o[i2];
          var a = r(e3, t3, n2);
          return o[i2] = a, a;
        }
        Object.defineProperty(t2, "__esModule", { value: true });
        var o = {};
        t2.default = { name: "Checkboard", props: { size: { type: [Number, String], default: 8 }, white: { type: String, default: "#fff" }, grey: { type: String, default: "#e6e6e6" } }, computed: { bgStyle: function() {
          return { "background-image": "url(" + i(this.white, this.grey, this.size) + ")" };
        } } };
      }, function(e2, t2, n) {
        function r(e3) {
          return e3 && e3.__esModule ? e3 : { default: e3 };
        }
        Object.defineProperty(t2, "__esModule", { value: true });
        var i = n(3), o = r(i), a = n(5), s = r(a), c = n(20), l = r(c), u = n(13), f = r(u), d = n(21), h2 = r(d), p = n(22), v = r(p), g = ["#D0021B", "#F5A623", "#F8E71C", "#8B572A", "#7ED321", "#417505", "#BD10E0", "#9013FE", "#4A90E2", "#50E3C2", "#B8E986", "#000000", "#4A4A4A", "#9B9B9B", "#FFFFFF", "rgba(0,0,0,0)"];
        t2.default = { name: "Sketch", mixins: [o.default], components: { saturation: l.default, hue: f.default, alpha: h2.default, "ed-in": s.default, checkboard: v.default }, props: { presetColors: { type: Array, default: function() {
          return g;
        } }, disableAlpha: { type: Boolean, default: false }, disableFields: { type: Boolean, default: false } }, computed: { hex: function() {
          var e3 = void 0;
          return e3 = this.colors.a < 1 ? this.colors.hex8 : this.colors.hex, e3.replace("#", "");
        }, activeColor: function() {
          var e3 = this.colors.rgba;
          return "rgba(" + [e3.r, e3.g, e3.b, e3.a].join(",") + ")";
        } }, methods: { handlePreset: function(e3) {
          this.colorChange({ hex: e3, source: "hex" });
        }, childChange: function(e3) {
          this.colorChange(e3);
        }, inputChange: function(e3) {
          e3 && (e3.hex ? this.isValidHex(e3.hex) && this.colorChange({ hex: e3.hex, source: "hex" }) : (e3.r || e3.g || e3.b || e3.a) && this.colorChange({ r: e3.r || this.colors.rgba.r, g: e3.g || this.colors.rgba.g, b: e3.b || this.colors.rgba.b, a: e3.a || this.colors.rgba.a, source: "rgba" }));
        } } };
      }, function(e2, t2, n) {
        function r(e3) {
          return e3 && e3.__esModule ? e3 : { default: e3 };
        }
        Object.defineProperty(t2, "__esModule", { value: true });
        var i = n(3), o = r(i), a = n(5), s = r(a), c = n(20), l = r(c), u = n(13), f = r(u), d = n(21), h2 = r(d), p = n(22), v = r(p);
        t2.default = { name: "Chrome", mixins: [o.default], props: { disableAlpha: { type: Boolean, default: false }, disableFields: { type: Boolean, default: false } }, components: { saturation: l.default, hue: f.default, alpha: h2.default, "ed-in": s.default, checkboard: v.default }, data: function() {
          return { fieldsIndex: 0, highlight: false };
        }, computed: { hsl: function() {
          var e3 = this.colors.hsl, t3 = e3.h, n2 = e3.s, r2 = e3.l;
          return { h: t3.toFixed(), s: (100 * n2).toFixed() + "%", l: (100 * r2).toFixed() + "%" };
        }, activeColor: function() {
          var e3 = this.colors.rgba;
          return "rgba(" + [e3.r, e3.g, e3.b, e3.a].join(",") + ")";
        }, hasAlpha: function() {
          return this.colors.a < 1;
        } }, methods: { childChange: function(e3) {
          this.colorChange(e3);
        }, inputChange: function(e3) {
          if (e3) {
            if (e3.hex) this.isValidHex(e3.hex) && this.colorChange({ hex: e3.hex, source: "hex" });
            else if (e3.r || e3.g || e3.b || e3.a) this.colorChange({ r: e3.r || this.colors.rgba.r, g: e3.g || this.colors.rgba.g, b: e3.b || this.colors.rgba.b, a: e3.a || this.colors.rgba.a, source: "rgba" });
            else if (e3.h || e3.s || e3.l) {
              var t3 = e3.s ? e3.s.replace("%", "") / 100 : this.colors.hsl.s, n2 = e3.l ? e3.l.replace("%", "") / 100 : this.colors.hsl.l;
              this.colorChange({ h: e3.h || this.colors.hsl.h, s: t3, l: n2, source: "hsl" });
            }
          }
        }, toggleViews: function() {
          if (this.fieldsIndex >= 2) return void (this.fieldsIndex = 0);
          this.fieldsIndex++;
        }, showHighlight: function() {
          this.highlight = true;
        }, hideHighlight: function() {
          this.highlight = false;
        } } };
      }, function(e2, t2, n) {
        function r(e3) {
          return e3 && e3.__esModule ? e3 : { default: e3 };
        }
        Object.defineProperty(t2, "__esModule", { value: true });
        var i = n(5), o = r(i), a = n(3), s = r(a), c = ["#FF6900", "#FCB900", "#7BDCB5", "#00D084", "#8ED1FC", "#0693E3", "#ABB8C3", "#EB144C", "#F78DA7", "#9900EF"];
        t2.default = { name: "Twitter", mixins: [s.default], components: { editableInput: o.default }, props: { width: { type: [String, Number], default: 276 }, defaultColors: { type: Array, default: function() {
          return c;
        } }, triangle: { default: "top-left", validator: function(e3) {
          return ["hide", "top-left", "top-right"].includes(e3);
        } } }, computed: { hsv: function() {
          var e3 = this.colors.hsv;
          return { h: e3.h.toFixed(), s: (100 * e3.s).toFixed(), v: (100 * e3.v).toFixed() };
        }, hex: function() {
          var e3 = this.colors.hex;
          return e3 && e3.replace("#", "");
        } }, methods: { equal: function(e3) {
          return e3.toLowerCase() === this.colors.hex.toLowerCase();
        }, handlerClick: function(e3) {
          this.colorChange({ hex: e3, source: "hex" });
        }, inputChange: function(e3) {
          e3 && (e3["#"] ? this.isValidHex(e3["#"]) && this.colorChange({ hex: e3["#"], source: "hex" }) : e3.r || e3.g || e3.b || e3.a ? this.colorChange({ r: e3.r || this.colors.rgba.r, g: e3.g || this.colors.rgba.g, b: e3.b || this.colors.rgba.b, a: e3.a || this.colors.rgba.a, source: "rgba" }) : (e3.h || e3.s || e3.v) && this.colorChange({ h: e3.h || this.colors.hsv.h, s: e3.s / 100 || this.colors.hsv.s, v: e3.v / 100 || this.colors.hsv.v, source: "hsv" }));
        } } };
      }, function(e2, t2, n) {
        function r(e3) {
          return e3 && e3.__esModule ? e3 : { default: e3 };
        }
        var i = n(61), o = r(i), a = n(70), s = r(a), c = n(74), l = r(c), u = n(78), f = r(u), d = n(115), h2 = r(d), p = n(120), v = r(p), g = n(135), b = r(g), x = n(139), m = r(x), _2 = n(143), w = r(_2), y = n(21), C = r(y), k = n(22), F = r(k), S = n(5), A = r(S), O = n(13), E = r(O), M = n(20), j = r(M), L = n(3), P = r(L), R = { version: "2.8.1", Compact: o.default, Grayscale: s.default, Twitter: w.default, Material: l.default, Slider: f.default, Swatches: h2.default, Photoshop: v.default, Sketch: b.default, Chrome: m.default, Alpha: C.default, Checkboard: F.default, EditableInput: A.default, Hue: E.default, Saturation: j.default, ColorMixin: P.default };
        e2.exports = R;
      }, function(e2, t2, n) {
        function r(e3) {
          n(62);
        }
        Object.defineProperty(t2, "__esModule", { value: true });
        var i = n(35), o = n.n(i);
        for (var a in i) "default" !== a && function(e3) {
          n.d(t2, e3, function() {
            return i[e3];
          });
        }(a);
        var s = n(69), l = n(2), u = r, f = l(o.a, s.a, false, u, null, null);
        f.options.__file = "src/components/Compact.vue", t2.default = f.exports;
      }, function(e2, t2, n) {
        var r = n(63);
        "string" == typeof r && (r = [[e2.i, r, ""]]), r.locals && (e2.exports = r.locals);
        n(1)("6ce8a5a8", r, false, {});
      }, function(e2, t2, n) {
        t2 = e2.exports = n(0)(false), t2.push([e2.i, "\n.vc-compact {\n  padding-top: 5px;\n  padding-left: 5px;\n  width: 245px;\n  border-radius: 2px;\n  box-sizing: border-box;\n  box-shadow: 0 2px 10px rgba(0,0,0,.12), 0 2px 5px rgba(0,0,0,.16);\n  background-color: #fff;\n}\n.vc-compact-colors {\n  overflow: hidden;\n  padding: 0;\n  margin: 0;\n}\n.vc-compact-color-item {\n  list-style: none;\n  width: 15px;\n  height: 15px;\n  float: left;\n  margin-right: 5px;\n  margin-bottom: 5px;\n  position: relative;\n  cursor: pointer;\n}\n.vc-compact-color-item--white {\n  box-shadow: inset 0 0 0 1px #ddd;\n}\n.vc-compact-color-item--white .vc-compact-dot {\n  background: #000;\n}\n.vc-compact-dot {\n  position: absolute;\n  top: 5px;\n  right: 5px;\n  bottom: 5px;\n  left: 5px;\n  border-radius: 50%;\n  opacity: 1;\n  background: #fff;\n}\n", ""]);
      }, function(e2, t2) {
        e2.exports = function(e3, t3) {
          for (var n = [], r = {}, i = 0; i < t3.length; i++) {
            var o = t3[i], a = o[0], s = o[1], c = o[2], l = o[3], u = { id: e3 + ":" + i, css: s, media: c, sourceMap: l };
            r[a] ? r[a].parts.push(u) : n.push(r[a] = { id: a, parts: [u] });
          }
          return n;
        };
      }, function(e2, t2, n) {
        var r;
        !function(i) {
          function o(e3, t3) {
            if (e3 = e3 || "", t3 = t3 || {}, e3 instanceof o) return e3;
            if (!(this instanceof o)) return new o(e3, t3);
            var n2 = a(e3);
            this._originalInput = e3, this._r = n2.r, this._g = n2.g, this._b = n2.b, this._a = n2.a, this._roundA = G(100 * this._a) / 100, this._format = t3.format || n2.format, this._gradientType = t3.gradientType, this._r < 1 && (this._r = G(this._r)), this._g < 1 && (this._g = G(this._g)), this._b < 1 && (this._b = G(this._b)), this._ok = n2.ok, this._tc_id = U2++;
          }
          function a(e3) {
            var t3 = { r: 0, g: 0, b: 0 }, n2 = 1, r2 = null, i2 = null, o2 = null, a2 = false, c2 = false;
            return "string" == typeof e3 && (e3 = N(e3)), "object" == typeof e3 && (H(e3.r) && H(e3.g) && H(e3.b) ? (t3 = s(e3.r, e3.g, e3.b), a2 = true, c2 = "%" === String(e3.r).substr(-1) ? "prgb" : "rgb") : H(e3.h) && H(e3.s) && H(e3.v) ? (r2 = D(e3.s), i2 = D(e3.v), t3 = f(e3.h, r2, i2), a2 = true, c2 = "hsv") : H(e3.h) && H(e3.s) && H(e3.l) && (r2 = D(e3.s), o2 = D(e3.l), t3 = l(e3.h, r2, o2), a2 = true, c2 = "hsl"), e3.hasOwnProperty("a") && (n2 = e3.a)), n2 = O(n2), { ok: a2, format: e3.format || c2, r: V(255, q(t3.r, 0)), g: V(255, q(t3.g, 0)), b: V(255, q(t3.b, 0)), a: n2 };
          }
          function s(e3, t3, n2) {
            return { r: 255 * E(e3, 255), g: 255 * E(t3, 255), b: 255 * E(n2, 255) };
          }
          function c(e3, t3, n2) {
            e3 = E(e3, 255), t3 = E(t3, 255), n2 = E(n2, 255);
            var r2, i2, o2 = q(e3, t3, n2), a2 = V(e3, t3, n2), s2 = (o2 + a2) / 2;
            if (o2 == a2) r2 = i2 = 0;
            else {
              var c2 = o2 - a2;
              switch (i2 = s2 > 0.5 ? c2 / (2 - o2 - a2) : c2 / (o2 + a2), o2) {
                case e3:
                  r2 = (t3 - n2) / c2 + (t3 < n2 ? 6 : 0);
                  break;
                case t3:
                  r2 = (n2 - e3) / c2 + 2;
                  break;
                case n2:
                  r2 = (e3 - t3) / c2 + 4;
              }
              r2 /= 6;
            }
            return { h: r2, s: i2, l: s2 };
          }
          function l(e3, t3, n2) {
            function r2(e4, t4, n3) {
              return n3 < 0 && (n3 += 1), n3 > 1 && (n3 -= 1), n3 < 1 / 6 ? e4 + 6 * (t4 - e4) * n3 : n3 < 0.5 ? t4 : n3 < 2 / 3 ? e4 + (t4 - e4) * (2 / 3 - n3) * 6 : e4;
            }
            var i2, o2, a2;
            if (e3 = E(e3, 360), t3 = E(t3, 100), n2 = E(n2, 100), 0 === t3) i2 = o2 = a2 = n2;
            else {
              var s2 = n2 < 0.5 ? n2 * (1 + t3) : n2 + t3 - n2 * t3, c2 = 2 * n2 - s2;
              i2 = r2(c2, s2, e3 + 1 / 3), o2 = r2(c2, s2, e3), a2 = r2(c2, s2, e3 - 1 / 3);
            }
            return { r: 255 * i2, g: 255 * o2, b: 255 * a2 };
          }
          function u(e3, t3, n2) {
            e3 = E(e3, 255), t3 = E(t3, 255), n2 = E(n2, 255);
            var r2, i2, o2 = q(e3, t3, n2), a2 = V(e3, t3, n2), s2 = o2, c2 = o2 - a2;
            if (i2 = 0 === o2 ? 0 : c2 / o2, o2 == a2) r2 = 0;
            else {
              switch (o2) {
                case e3:
                  r2 = (t3 - n2) / c2 + (t3 < n2 ? 6 : 0);
                  break;
                case t3:
                  r2 = (n2 - e3) / c2 + 2;
                  break;
                case n2:
                  r2 = (e3 - t3) / c2 + 4;
              }
              r2 /= 6;
            }
            return { h: r2, s: i2, v: s2 };
          }
          function f(e3, t3, n2) {
            e3 = 6 * E(e3, 360), t3 = E(t3, 100), n2 = E(n2, 100);
            var r2 = i.floor(e3), o2 = e3 - r2, a2 = n2 * (1 - t3), s2 = n2 * (1 - o2 * t3), c2 = n2 * (1 - (1 - o2) * t3), l2 = r2 % 6;
            return { r: 255 * [n2, s2, a2, a2, c2, n2][l2], g: 255 * [c2, n2, n2, s2, a2, a2][l2], b: 255 * [a2, a2, c2, n2, n2, s2][l2] };
          }
          function d(e3, t3, n2, r2) {
            var i2 = [R(G(e3).toString(16)), R(G(t3).toString(16)), R(G(n2).toString(16))];
            return r2 && i2[0].charAt(0) == i2[0].charAt(1) && i2[1].charAt(0) == i2[1].charAt(1) && i2[2].charAt(0) == i2[2].charAt(1) ? i2[0].charAt(0) + i2[1].charAt(0) + i2[2].charAt(0) : i2.join("");
          }
          function h2(e3, t3, n2, r2, i2) {
            var o2 = [R(G(e3).toString(16)), R(G(t3).toString(16)), R(G(n2).toString(16)), R(B(r2))];
            return i2 && o2[0].charAt(0) == o2[0].charAt(1) && o2[1].charAt(0) == o2[1].charAt(1) && o2[2].charAt(0) == o2[2].charAt(1) && o2[3].charAt(0) == o2[3].charAt(1) ? o2[0].charAt(0) + o2[1].charAt(0) + o2[2].charAt(0) + o2[3].charAt(0) : o2.join("");
          }
          function p(e3, t3, n2, r2) {
            return [R(B(r2)), R(G(e3).toString(16)), R(G(t3).toString(16)), R(G(n2).toString(16))].join("");
          }
          function v(e3, t3) {
            t3 = 0 === t3 ? 0 : t3 || 10;
            var n2 = o(e3).toHsl();
            return n2.s -= t3 / 100, n2.s = M(n2.s), o(n2);
          }
          function g(e3, t3) {
            t3 = 0 === t3 ? 0 : t3 || 10;
            var n2 = o(e3).toHsl();
            return n2.s += t3 / 100, n2.s = M(n2.s), o(n2);
          }
          function b(e3) {
            return o(e3).desaturate(100);
          }
          function x(e3, t3) {
            t3 = 0 === t3 ? 0 : t3 || 10;
            var n2 = o(e3).toHsl();
            return n2.l += t3 / 100, n2.l = M(n2.l), o(n2);
          }
          function m(e3, t3) {
            t3 = 0 === t3 ? 0 : t3 || 10;
            var n2 = o(e3).toRgb();
            return n2.r = q(0, V(255, n2.r - G(-t3 / 100 * 255))), n2.g = q(0, V(255, n2.g - G(-t3 / 100 * 255))), n2.b = q(0, V(255, n2.b - G(-t3 / 100 * 255))), o(n2);
          }
          function _2(e3, t3) {
            t3 = 0 === t3 ? 0 : t3 || 10;
            var n2 = o(e3).toHsl();
            return n2.l -= t3 / 100, n2.l = M(n2.l), o(n2);
          }
          function w(e3, t3) {
            var n2 = o(e3).toHsl(), r2 = (n2.h + t3) % 360;
            return n2.h = r2 < 0 ? 360 + r2 : r2, o(n2);
          }
          function y(e3) {
            var t3 = o(e3).toHsl();
            return t3.h = (t3.h + 180) % 360, o(t3);
          }
          function C(e3) {
            var t3 = o(e3).toHsl(), n2 = t3.h;
            return [o(e3), o({ h: (n2 + 120) % 360, s: t3.s, l: t3.l }), o({ h: (n2 + 240) % 360, s: t3.s, l: t3.l })];
          }
          function k(e3) {
            var t3 = o(e3).toHsl(), n2 = t3.h;
            return [o(e3), o({ h: (n2 + 90) % 360, s: t3.s, l: t3.l }), o({ h: (n2 + 180) % 360, s: t3.s, l: t3.l }), o({ h: (n2 + 270) % 360, s: t3.s, l: t3.l })];
          }
          function F(e3) {
            var t3 = o(e3).toHsl(), n2 = t3.h;
            return [o(e3), o({ h: (n2 + 72) % 360, s: t3.s, l: t3.l }), o({ h: (n2 + 216) % 360, s: t3.s, l: t3.l })];
          }
          function S(e3, t3, n2) {
            t3 = t3 || 6, n2 = n2 || 30;
            var r2 = o(e3).toHsl(), i2 = 360 / n2, a2 = [o(e3)];
            for (r2.h = (r2.h - (i2 * t3 >> 1) + 720) % 360; --t3; ) r2.h = (r2.h + i2) % 360, a2.push(o(r2));
            return a2;
          }
          function A(e3, t3) {
            t3 = t3 || 6;
            for (var n2 = o(e3).toHsv(), r2 = n2.h, i2 = n2.s, a2 = n2.v, s2 = [], c2 = 1 / t3; t3--; ) s2.push(o({ h: r2, s: i2, v: a2 })), a2 = (a2 + c2) % 1;
            return s2;
          }
          function O(e3) {
            return e3 = parseFloat(e3), (isNaN(e3) || e3 < 0 || e3 > 1) && (e3 = 1), e3;
          }
          function E(e3, t3) {
            L(e3) && (e3 = "100%");
            var n2 = P(e3);
            return e3 = V(t3, q(0, parseFloat(e3))), n2 && (e3 = parseInt(e3 * t3, 10) / 100), i.abs(e3 - t3) < 1e-6 ? 1 : e3 % t3 / parseFloat(t3);
          }
          function M(e3) {
            return V(1, q(0, e3));
          }
          function j(e3) {
            return parseInt(e3, 16);
          }
          function L(e3) {
            return "string" == typeof e3 && -1 != e3.indexOf(".") && 1 === parseFloat(e3);
          }
          function P(e3) {
            return "string" == typeof e3 && -1 != e3.indexOf("%");
          }
          function R(e3) {
            return 1 == e3.length ? "0" + e3 : "" + e3;
          }
          function D(e3) {
            return e3 <= 1 && (e3 = 100 * e3 + "%"), e3;
          }
          function B(e3) {
            return i.round(255 * parseFloat(e3)).toString(16);
          }
          function T(e3) {
            return j(e3) / 255;
          }
          function H(e3) {
            return !!J.CSS_UNIT.exec(e3);
          }
          function N(e3) {
            e3 = e3.replace(I, "").replace($, "").toLowerCase();
            var t3 = false;
            if (W[e3]) e3 = W[e3], t3 = true;
            else if ("transparent" == e3) return { r: 0, g: 0, b: 0, a: 0, format: "name" };
            var n2;
            return (n2 = J.rgb.exec(e3)) ? { r: n2[1], g: n2[2], b: n2[3] } : (n2 = J.rgba.exec(e3)) ? { r: n2[1], g: n2[2], b: n2[3], a: n2[4] } : (n2 = J.hsl.exec(e3)) ? { h: n2[1], s: n2[2], l: n2[3] } : (n2 = J.hsla.exec(e3)) ? { h: n2[1], s: n2[2], l: n2[3], a: n2[4] } : (n2 = J.hsv.exec(e3)) ? { h: n2[1], s: n2[2], v: n2[3] } : (n2 = J.hsva.exec(e3)) ? { h: n2[1], s: n2[2], v: n2[3], a: n2[4] } : (n2 = J.hex8.exec(e3)) ? { r: j(n2[1]), g: j(n2[2]), b: j(n2[3]), a: T(n2[4]), format: t3 ? "name" : "hex8" } : (n2 = J.hex6.exec(e3)) ? { r: j(n2[1]), g: j(n2[2]), b: j(n2[3]), format: t3 ? "name" : "hex" } : (n2 = J.hex4.exec(e3)) ? { r: j(n2[1] + "" + n2[1]), g: j(n2[2] + "" + n2[2]), b: j(n2[3] + "" + n2[3]), a: T(n2[4] + "" + n2[4]), format: t3 ? "name" : "hex8" } : !!(n2 = J.hex3.exec(e3)) && { r: j(n2[1] + "" + n2[1]), g: j(n2[2] + "" + n2[2]), b: j(n2[3] + "" + n2[3]), format: t3 ? "name" : "hex" };
          }
          function z(e3) {
            var t3, n2;
            return e3 = e3 || { level: "AA", size: "small" }, t3 = (e3.level || "AA").toUpperCase(), n2 = (e3.size || "small").toLowerCase(), "AA" !== t3 && "AAA" !== t3 && (t3 = "AA"), "small" !== n2 && "large" !== n2 && (n2 = "small"), { level: t3, size: n2 };
          }
          var I = /^\s+/, $ = /\s+$/, U2 = 0, G = i.round, V = i.min, q = i.max, X = i.random;
          o.prototype = { isDark: function() {
            return this.getBrightness() < 128;
          }, isLight: function() {
            return !this.isDark();
          }, isValid: function() {
            return this._ok;
          }, getOriginalInput: function() {
            return this._originalInput;
          }, getFormat: function() {
            return this._format;
          }, getAlpha: function() {
            return this._a;
          }, getBrightness: function() {
            var e3 = this.toRgb();
            return (299 * e3.r + 587 * e3.g + 114 * e3.b) / 1e3;
          }, getLuminance: function() {
            var e3, t3, n2, r2, o2, a2, s2 = this.toRgb();
            return e3 = s2.r / 255, t3 = s2.g / 255, n2 = s2.b / 255, r2 = e3 <= 0.03928 ? e3 / 12.92 : i.pow((e3 + 0.055) / 1.055, 2.4), o2 = t3 <= 0.03928 ? t3 / 12.92 : i.pow((t3 + 0.055) / 1.055, 2.4), a2 = n2 <= 0.03928 ? n2 / 12.92 : i.pow((n2 + 0.055) / 1.055, 2.4), 0.2126 * r2 + 0.7152 * o2 + 0.0722 * a2;
          }, setAlpha: function(e3) {
            return this._a = O(e3), this._roundA = G(100 * this._a) / 100, this;
          }, toHsv: function() {
            var e3 = u(this._r, this._g, this._b);
            return { h: 360 * e3.h, s: e3.s, v: e3.v, a: this._a };
          }, toHsvString: function() {
            var e3 = u(this._r, this._g, this._b), t3 = G(360 * e3.h), n2 = G(100 * e3.s), r2 = G(100 * e3.v);
            return 1 == this._a ? "hsv(" + t3 + ", " + n2 + "%, " + r2 + "%)" : "hsva(" + t3 + ", " + n2 + "%, " + r2 + "%, " + this._roundA + ")";
          }, toHsl: function() {
            var e3 = c(this._r, this._g, this._b);
            return { h: 360 * e3.h, s: e3.s, l: e3.l, a: this._a };
          }, toHslString: function() {
            var e3 = c(this._r, this._g, this._b), t3 = G(360 * e3.h), n2 = G(100 * e3.s), r2 = G(100 * e3.l);
            return 1 == this._a ? "hsl(" + t3 + ", " + n2 + "%, " + r2 + "%)" : "hsla(" + t3 + ", " + n2 + "%, " + r2 + "%, " + this._roundA + ")";
          }, toHex: function(e3) {
            return d(this._r, this._g, this._b, e3);
          }, toHexString: function(e3) {
            return "#" + this.toHex(e3);
          }, toHex8: function(e3) {
            return h2(this._r, this._g, this._b, this._a, e3);
          }, toHex8String: function(e3) {
            return "#" + this.toHex8(e3);
          }, toRgb: function() {
            return { r: G(this._r), g: G(this._g), b: G(this._b), a: this._a };
          }, toRgbString: function() {
            return 1 == this._a ? "rgb(" + G(this._r) + ", " + G(this._g) + ", " + G(this._b) + ")" : "rgba(" + G(this._r) + ", " + G(this._g) + ", " + G(this._b) + ", " + this._roundA + ")";
          }, toPercentageRgb: function() {
            return { r: G(100 * E(this._r, 255)) + "%", g: G(100 * E(this._g, 255)) + "%", b: G(100 * E(this._b, 255)) + "%", a: this._a };
          }, toPercentageRgbString: function() {
            return 1 == this._a ? "rgb(" + G(100 * E(this._r, 255)) + "%, " + G(100 * E(this._g, 255)) + "%, " + G(100 * E(this._b, 255)) + "%)" : "rgba(" + G(100 * E(this._r, 255)) + "%, " + G(100 * E(this._g, 255)) + "%, " + G(100 * E(this._b, 255)) + "%, " + this._roundA + ")";
          }, toName: function() {
            return 0 === this._a ? "transparent" : !(this._a < 1) && (Y[d(this._r, this._g, this._b, true)] || false);
          }, toFilter: function(e3) {
            var t3 = "#" + p(this._r, this._g, this._b, this._a), n2 = t3, r2 = this._gradientType ? "GradientType = 1, " : "";
            if (e3) {
              var i2 = o(e3);
              n2 = "#" + p(i2._r, i2._g, i2._b, i2._a);
            }
            return "progid:DXImageTransform.Microsoft.gradient(" + r2 + "startColorstr=" + t3 + ",endColorstr=" + n2 + ")";
          }, toString: function(e3) {
            var t3 = !!e3;
            e3 = e3 || this._format;
            var n2 = false, r2 = this._a < 1 && this._a >= 0;
            return t3 || !r2 || "hex" !== e3 && "hex6" !== e3 && "hex3" !== e3 && "hex4" !== e3 && "hex8" !== e3 && "name" !== e3 ? ("rgb" === e3 && (n2 = this.toRgbString()), "prgb" === e3 && (n2 = this.toPercentageRgbString()), "hex" !== e3 && "hex6" !== e3 || (n2 = this.toHexString()), "hex3" === e3 && (n2 = this.toHexString(true)), "hex4" === e3 && (n2 = this.toHex8String(true)), "hex8" === e3 && (n2 = this.toHex8String()), "name" === e3 && (n2 = this.toName()), "hsl" === e3 && (n2 = this.toHslString()), "hsv" === e3 && (n2 = this.toHsvString()), n2 || this.toHexString()) : "name" === e3 && 0 === this._a ? this.toName() : this.toRgbString();
          }, clone: function() {
            return o(this.toString());
          }, _applyModification: function(e3, t3) {
            var n2 = e3.apply(null, [this].concat([].slice.call(t3)));
            return this._r = n2._r, this._g = n2._g, this._b = n2._b, this.setAlpha(n2._a), this;
          }, lighten: function() {
            return this._applyModification(x, arguments);
          }, brighten: function() {
            return this._applyModification(m, arguments);
          }, darken: function() {
            return this._applyModification(_2, arguments);
          }, desaturate: function() {
            return this._applyModification(v, arguments);
          }, saturate: function() {
            return this._applyModification(g, arguments);
          }, greyscale: function() {
            return this._applyModification(b, arguments);
          }, spin: function() {
            return this._applyModification(w, arguments);
          }, _applyCombination: function(e3, t3) {
            return e3.apply(null, [this].concat([].slice.call(t3)));
          }, analogous: function() {
            return this._applyCombination(S, arguments);
          }, complement: function() {
            return this._applyCombination(y, arguments);
          }, monochromatic: function() {
            return this._applyCombination(A, arguments);
          }, splitcomplement: function() {
            return this._applyCombination(F, arguments);
          }, triad: function() {
            return this._applyCombination(C, arguments);
          }, tetrad: function() {
            return this._applyCombination(k, arguments);
          } }, o.fromRatio = function(e3, t3) {
            if ("object" == typeof e3) {
              var n2 = {};
              for (var r2 in e3) e3.hasOwnProperty(r2) && (n2[r2] = "a" === r2 ? e3[r2] : D(e3[r2]));
              e3 = n2;
            }
            return o(e3, t3);
          }, o.equals = function(e3, t3) {
            return !(!e3 || !t3) && o(e3).toRgbString() == o(t3).toRgbString();
          }, o.random = function() {
            return o.fromRatio({ r: X(), g: X(), b: X() });
          }, o.mix = function(e3, t3, n2) {
            n2 = 0 === n2 ? 0 : n2 || 50;
            var r2 = o(e3).toRgb(), i2 = o(t3).toRgb(), a2 = n2 / 100;
            return o({ r: (i2.r - r2.r) * a2 + r2.r, g: (i2.g - r2.g) * a2 + r2.g, b: (i2.b - r2.b) * a2 + r2.b, a: (i2.a - r2.a) * a2 + r2.a });
          }, o.readability = function(e3, t3) {
            var n2 = o(e3), r2 = o(t3);
            return (i.max(n2.getLuminance(), r2.getLuminance()) + 0.05) / (i.min(n2.getLuminance(), r2.getLuminance()) + 0.05);
          }, o.isReadable = function(e3, t3, n2) {
            var r2, i2, a2 = o.readability(e3, t3);
            switch (i2 = false, r2 = z(n2), r2.level + r2.size) {
              case "AAsmall":
              case "AAAlarge":
                i2 = a2 >= 4.5;
                break;
              case "AAlarge":
                i2 = a2 >= 3;
                break;
              case "AAAsmall":
                i2 = a2 >= 7;
            }
            return i2;
          }, o.mostReadable = function(e3, t3, n2) {
            var r2, i2, a2, s2, c2 = null, l2 = 0;
            n2 = n2 || {}, i2 = n2.includeFallbackColors, a2 = n2.level, s2 = n2.size;
            for (var u2 = 0; u2 < t3.length; u2++) (r2 = o.readability(e3, t3[u2])) > l2 && (l2 = r2, c2 = o(t3[u2]));
            return o.isReadable(e3, c2, { level: a2, size: s2 }) || !i2 ? c2 : (n2.includeFallbackColors = false, o.mostReadable(e3, ["#fff", "#000"], n2));
          };
          var W = o.names = { aliceblue: "f0f8ff", antiquewhite: "faebd7", aqua: "0ff", aquamarine: "7fffd4", azure: "f0ffff", beige: "f5f5dc", bisque: "ffe4c4", black: "000", blanchedalmond: "ffebcd", blue: "00f", blueviolet: "8a2be2", brown: "a52a2a", burlywood: "deb887", burntsienna: "ea7e5d", cadetblue: "5f9ea0", chartreuse: "7fff00", chocolate: "d2691e", coral: "ff7f50", cornflowerblue: "6495ed", cornsilk: "fff8dc", crimson: "dc143c", cyan: "0ff", darkblue: "00008b", darkcyan: "008b8b", darkgoldenrod: "b8860b", darkgray: "a9a9a9", darkgreen: "006400", darkgrey: "a9a9a9", darkkhaki: "bdb76b", darkmagenta: "8b008b", darkolivegreen: "556b2f", darkorange: "ff8c00", darkorchid: "9932cc", darkred: "8b0000", darksalmon: "e9967a", darkseagreen: "8fbc8f", darkslateblue: "483d8b", darkslategray: "2f4f4f", darkslategrey: "2f4f4f", darkturquoise: "00ced1", darkviolet: "9400d3", deeppink: "ff1493", deepskyblue: "00bfff", dimgray: "696969", dimgrey: "696969", dodgerblue: "1e90ff", firebrick: "b22222", floralwhite: "fffaf0", forestgreen: "228b22", fuchsia: "f0f", gainsboro: "dcdcdc", ghostwhite: "f8f8ff", gold: "ffd700", goldenrod: "daa520", gray: "808080", green: "008000", greenyellow: "adff2f", grey: "808080", honeydew: "f0fff0", hotpink: "ff69b4", indianred: "cd5c5c", indigo: "4b0082", ivory: "fffff0", khaki: "f0e68c", lavender: "e6e6fa", lavenderblush: "fff0f5", lawngreen: "7cfc00", lemonchiffon: "fffacd", lightblue: "add8e6", lightcoral: "f08080", lightcyan: "e0ffff", lightgoldenrodyellow: "fafad2", lightgray: "d3d3d3", lightgreen: "90ee90", lightgrey: "d3d3d3", lightpink: "ffb6c1", lightsalmon: "ffa07a", lightseagreen: "20b2aa", lightskyblue: "87cefa", lightslategray: "789", lightslategrey: "789", lightsteelblue: "b0c4de", lightyellow: "ffffe0", lime: "0f0", limegreen: "32cd32", linen: "faf0e6", magenta: "f0f", maroon: "800000", mediumaquamarine: "66cdaa", mediumblue: "0000cd", mediumorchid: "ba55d3", mediumpurple: "9370db", mediumseagreen: "3cb371", mediumslateblue: "7b68ee", mediumspringgreen: "00fa9a", mediumturquoise: "48d1cc", mediumvioletred: "c71585", midnightblue: "191970", mintcream: "f5fffa", mistyrose: "ffe4e1", moccasin: "ffe4b5", navajowhite: "ffdead", navy: "000080", oldlace: "fdf5e6", olive: "808000", olivedrab: "6b8e23", orange: "ffa500", orangered: "ff4500", orchid: "da70d6", palegoldenrod: "eee8aa", palegreen: "98fb98", paleturquoise: "afeeee", palevioletred: "db7093", papayawhip: "ffefd5", peachpuff: "ffdab9", peru: "cd853f", pink: "ffc0cb", plum: "dda0dd", powderblue: "b0e0e6", purple: "800080", rebeccapurple: "663399", red: "f00", rosybrown: "bc8f8f", royalblue: "4169e1", saddlebrown: "8b4513", salmon: "fa8072", sandybrown: "f4a460", seagreen: "2e8b57", seashell: "fff5ee", sienna: "a0522d", silver: "c0c0c0", skyblue: "87ceeb", slateblue: "6a5acd", slategray: "708090", slategrey: "708090", snow: "fffafa", springgreen: "00ff7f", steelblue: "4682b4", tan: "d2b48c", teal: "008080", thistle: "d8bfd8", tomato: "ff6347", turquoise: "40e0d0", violet: "ee82ee", wheat: "f5deb3", white: "fff", whitesmoke: "f5f5f5", yellow: "ff0", yellowgreen: "9acd32" }, Y = o.hexNames = function(e3) {
            var t3 = {};
            for (var n2 in e3) e3.hasOwnProperty(n2) && (t3[e3[n2]] = n2);
            return t3;
          }(W), J = function() {
            var e3 = "(?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?)", t3 = "[\\s|\\(]+(" + e3 + ")[,|\\s]+(" + e3 + ")[,|\\s]+(" + e3 + ")\\s*\\)?", n2 = "[\\s|\\(]+(" + e3 + ")[,|\\s]+(" + e3 + ")[,|\\s]+(" + e3 + ")[,|\\s]+(" + e3 + ")\\s*\\)?";
            return { CSS_UNIT: new RegExp(e3), rgb: new RegExp("rgb" + t3), rgba: new RegExp("rgba" + n2), hsl: new RegExp("hsl" + t3), hsla: new RegExp("hsla" + n2), hsv: new RegExp("hsv" + t3), hsva: new RegExp("hsva" + n2), hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/, hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/, hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/, hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/ };
          }();
          void 0 !== e2 && e2.exports ? e2.exports = o : void 0 !== (r = function() {
            return o;
          }.call(t2, n, t2, e2)) && (e2.exports = r);
        }(Math);
      }, function(e2, t2, n) {
        var r = n(67);
        "string" == typeof r && (r = [[e2.i, r, ""]]), r.locals && (e2.exports = r.locals);
        n(1)("0f73e73c", r, false, {});
      }, function(e2, t2, n) {
        t2 = e2.exports = n(0)(false), t2.push([e2.i, "\n.vc-editable-input {\n  position: relative;\n}\n.vc-input__input {\n  padding: 0;\n  border: 0;\n  outline: none;\n}\n.vc-input__label {\n  text-transform: capitalize;\n}\n", ""]);
      }, function(e2, t2, n) {
        var r = function() {
          var e3 = this, t3 = e3.$createElement, n2 = e3._self._c || t3;
          return n2("div", { staticClass: "vc-editable-input" }, [n2("input", { directives: [{ name: "model", rawName: "v-model", value: e3.val, expression: "val" }], ref: "input", staticClass: "vc-input__input", attrs: { "aria-labelledby": e3.labelId }, domProps: { value: e3.val }, on: { keydown: e3.handleKeyDown, input: [function(t4) {
            t4.target.composing || (e3.val = t4.target.value);
          }, e3.update] } }), e3._v(" "), n2("span", { staticClass: "vc-input__label", attrs: { for: e3.label, id: e3.labelId } }, [e3._v(e3._s(e3.labelSpanText))]), e3._v(" "), n2("span", { staticClass: "vc-input__desc" }, [e3._v(e3._s(e3.desc))])]);
        }, i = [];
        r._withStripped = true;
        var o = { render: r, staticRenderFns: i };
        t2.a = o;
      }, function(e2, t2, n) {
        var r = function() {
          var e3 = this, t3 = e3.$createElement, n2 = e3._self._c || t3;
          return n2("div", { staticClass: "vc-compact", attrs: { role: "application", "aria-label": "Compact color picker" } }, [n2("ul", { staticClass: "vc-compact-colors", attrs: { role: "listbox" } }, e3._l(e3.paletteUpperCase(e3.palette), function(t4) {
            return n2("li", { key: t4, staticClass: "vc-compact-color-item", class: { "vc-compact-color-item--white": "#FFFFFF" === t4 }, style: { background: t4 }, attrs: { role: "option", "aria-label": "color:" + t4, "aria-selected": t4 === e3.pick }, on: { click: function(n3) {
              return e3.handlerClick(t4);
            } } }, [n2("div", { directives: [{ name: "show", rawName: "v-show", value: t4 === e3.pick, expression: "c === pick" }], staticClass: "vc-compact-dot" })]);
          }), 0)]);
        }, i = [];
        r._withStripped = true;
        var o = { render: r, staticRenderFns: i };
        t2.a = o;
      }, function(e2, t2, n) {
        function r(e3) {
          n(71);
        }
        Object.defineProperty(t2, "__esModule", { value: true });
        var i = n(37), o = n.n(i);
        for (var a in i) "default" !== a && function(e3) {
          n.d(t2, e3, function() {
            return i[e3];
          });
        }(a);
        var s = n(73), l = n(2), u = r, f = l(o.a, s.a, false, u, null, null);
        f.options.__file = "src/components/Grayscale.vue", t2.default = f.exports;
      }, function(e2, t2, n) {
        var r = n(72);
        "string" == typeof r && (r = [[e2.i, r, ""]]), r.locals && (e2.exports = r.locals);
        n(1)("21ddbb74", r, false, {});
      }, function(e2, t2, n) {
        t2 = e2.exports = n(0)(false), t2.push([e2.i, "\n.vc-grayscale {\n  width: 125px;\n  border-radius: 2px;\n  box-shadow: 0 2px 15px rgba(0,0,0,.12), 0 2px 10px rgba(0,0,0,.16);\n  background-color: #fff;\n}\n.vc-grayscale-colors {\n  border-radius: 2px;\n  overflow: hidden;\n  padding: 0;\n  margin: 0;\n}\n.vc-grayscale-color-item {\n  list-style: none;\n  width: 25px;\n  height: 25px;\n  float: left;\n  position: relative;\n  cursor: pointer;\n}\n.vc-grayscale-color-item--white .vc-grayscale-dot {\n  background: #000;\n}\n.vc-grayscale-dot {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 6px;\n  height: 6px;\n  margin: -3px 0 0 -2px;\n  border-radius: 50%;\n  opacity: 1;\n  background: #fff;\n}\n", ""]);
      }, function(e2, t2, n) {
        var r = function() {
          var e3 = this, t3 = e3.$createElement, n2 = e3._self._c || t3;
          return n2("div", { staticClass: "vc-grayscale", attrs: { role: "application", "aria-label": "Grayscale color picker" } }, [n2("ul", { staticClass: "vc-grayscale-colors", attrs: { role: "listbox" } }, e3._l(e3.paletteUpperCase(e3.palette), function(t4) {
            return n2("li", { key: t4, staticClass: "vc-grayscale-color-item", class: { "vc-grayscale-color-item--white": "#FFFFFF" == t4 }, style: { background: t4 }, attrs: { role: "option", "aria-label": "Color:" + t4, "aria-selected": t4 === e3.pick }, on: { click: function(n3) {
              return e3.handlerClick(t4);
            } } }, [n2("div", { directives: [{ name: "show", rawName: "v-show", value: t4 === e3.pick, expression: "c === pick" }], staticClass: "vc-grayscale-dot" })]);
          }), 0)]);
        }, i = [];
        r._withStripped = true;
        var o = { render: r, staticRenderFns: i };
        t2.a = o;
      }, function(e2, t2, n) {
        function r(e3) {
          n(75);
        }
        Object.defineProperty(t2, "__esModule", { value: true });
        var i = n(38), o = n.n(i);
        for (var a in i) "default" !== a && function(e3) {
          n.d(t2, e3, function() {
            return i[e3];
          });
        }(a);
        var s = n(77), l = n(2), u = r, f = l(o.a, s.a, false, u, null, null);
        f.options.__file = "src/components/Material.vue", t2.default = f.exports;
      }, function(e2, t2, n) {
        var r = n(76);
        "string" == typeof r && (r = [[e2.i, r, ""]]), r.locals && (e2.exports = r.locals);
        n(1)("1ff3af73", r, false, {});
      }, function(e2, t2, n) {
        t2 = e2.exports = n(0)(false), t2.push([e2.i, '\n.vc-material {\n  width: 98px;\n  height: 98px;\n  padding: 16px;\n  font-family: "Roboto";\n  position: relative;\n  border-radius: 2px;\n  box-shadow: 0 2px 10px rgba(0,0,0,.12), 0 2px 5px rgba(0,0,0,.16);\n  background-color: #fff;\n}\n.vc-material .vc-input__input {\n  width: 100%;\n  margin-top: 12px;\n  font-size: 15px;\n  color: #333;\n  height: 30px;\n}\n.vc-material .vc-input__label {\n  position: absolute;\n  top: 0;\n  left: 0;\n  font-size: 11px;\n  color: #999;\n  text-transform: capitalize;\n}\n.vc-material-hex {\n  border-bottom-width: 2px;\n  border-bottom-style: solid;\n}\n.vc-material-split {\n  display: flex;\n  margin-right: -10px;\n  padding-top: 11px;\n}\n.vc-material-third {\n  flex: 1;\n  padding-right: 10px;\n}\n', ""]);
      }, function(e2, t2, n) {
        var r = function() {
          var e3 = this, t3 = e3.$createElement, n2 = e3._self._c || t3;
          return n2("div", { staticClass: "vc-material", attrs: { role: "application", "aria-label": "Material color picker" } }, [n2("ed-in", { staticClass: "vc-material-hex", style: { borderColor: e3.colors.hex }, attrs: { label: "hex" }, on: { change: e3.onChange }, model: { value: e3.colors.hex, callback: function(t4) {
            e3.$set(e3.colors, "hex", t4);
          }, expression: "colors.hex" } }), e3._v(" "), n2("div", { staticClass: "vc-material-split" }, [n2("div", { staticClass: "vc-material-third" }, [n2("ed-in", { attrs: { label: "r" }, on: { change: e3.onChange }, model: { value: e3.colors.rgba.r, callback: function(t4) {
            e3.$set(e3.colors.rgba, "r", t4);
          }, expression: "colors.rgba.r" } })], 1), e3._v(" "), n2("div", { staticClass: "vc-material-third" }, [n2("ed-in", { attrs: { label: "g" }, on: { change: e3.onChange }, model: { value: e3.colors.rgba.g, callback: function(t4) {
            e3.$set(e3.colors.rgba, "g", t4);
          }, expression: "colors.rgba.g" } })], 1), e3._v(" "), n2("div", { staticClass: "vc-material-third" }, [n2("ed-in", { attrs: { label: "b" }, on: { change: e3.onChange }, model: { value: e3.colors.rgba.b, callback: function(t4) {
            e3.$set(e3.colors.rgba, "b", t4);
          }, expression: "colors.rgba.b" } })], 1)])], 1);
        }, i = [];
        r._withStripped = true;
        var o = { render: r, staticRenderFns: i };
        t2.a = o;
      }, function(e2, t2, n) {
        function r(e3) {
          n(79);
        }
        Object.defineProperty(t2, "__esModule", { value: true });
        var i = n(39), o = n.n(i);
        for (var a in i) "default" !== a && function(e3) {
          n.d(t2, e3, function() {
            return i[e3];
          });
        }(a);
        var s = n(114), l = n(2), u = r, f = l(o.a, s.a, false, u, null, null);
        f.options.__file = "src/components/Slider.vue", t2.default = f.exports;
      }, function(e2, t2, n) {
        var r = n(80);
        "string" == typeof r && (r = [[e2.i, r, ""]]), r.locals && (e2.exports = r.locals);
        n(1)("7982aa43", r, false, {});
      }, function(e2, t2, n) {
        t2 = e2.exports = n(0)(false), t2.push([e2.i, "\n.vc-slider {\n  position: relative;\n  width: 410px;\n}\n.vc-slider-hue-warp {\n  height: 12px;\n  position: relative;\n}\n.vc-slider-hue-warp .vc-hue-picker {\n  width: 14px;\n  height: 14px;\n  border-radius: 6px;\n  transform: translate(-7px, -2px);\n  background-color: rgb(248, 248, 248);\n  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.37);\n}\n.vc-slider-swatches {\n  display: flex;\n  margin-top: 20px;\n}\n.vc-slider-swatch {\n  margin-right: 1px;\n  flex: 1;\n  width: 20%;\n}\n.vc-slider-swatch:first-child {\n  margin-right: 1px;\n}\n.vc-slider-swatch:first-child .vc-slider-swatch-picker {\n  border-radius: 2px 0px 0px 2px;\n}\n.vc-slider-swatch:last-child {\n  margin-right: 0;\n}\n.vc-slider-swatch:last-child .vc-slider-swatch-picker {\n  border-radius: 0px 2px 2px 0px;\n}\n.vc-slider-swatch-picker {\n  cursor: pointer;\n  height: 12px;\n}\n.vc-slider-swatch:nth-child(n) .vc-slider-swatch-picker.vc-slider-swatch-picker--active {\n  transform: scaleY(1.8);\n  border-radius: 3.6px/2px;\n}\n.vc-slider-swatch-picker--white {\n  box-shadow: inset 0 0 0 1px #ddd;\n}\n.vc-slider-swatch-picker--active.vc-slider-swatch-picker--white {\n  box-shadow: inset 0 0 0 0.6px #ddd;\n}\n", ""]);
      }, function(e2, t2, n) {
        function r(e3) {
          return e3 && e3.__esModule ? e3 : { default: e3 };
        }
        t2.__esModule = true;
        var i = n(82), o = r(i), a = n(100), s = r(a), c = "function" == typeof s.default && "symbol" == typeof o.default ? function(e3) {
          return typeof e3;
        } : function(e3) {
          return e3 && "function" == typeof s.default && e3.constructor === s.default && e3 !== s.default.prototype ? "symbol" : typeof e3;
        };
        t2.default = "function" == typeof s.default && "symbol" === c(o.default) ? function(e3) {
          return void 0 === e3 ? "undefined" : c(e3);
        } : function(e3) {
          return e3 && "function" == typeof s.default && e3.constructor === s.default && e3 !== s.default.prototype ? "symbol" : void 0 === e3 ? "undefined" : c(e3);
        };
      }, function(e2, t2, n) {
        e2.exports = { default: n(83), __esModule: true };
      }, function(e2, t2, n) {
        n(84), n(96), e2.exports = n(32).f("iterator");
      }, function(e2, t2, n) {
        var r = n(85)(true);
        n(40)(String, "String", function(e3) {
          this._t = String(e3), this._i = 0;
        }, function() {
          var e3, t3 = this._t, n2 = this._i;
          return n2 >= t3.length ? { value: void 0, done: true } : (e3 = r(t3, n2), this._i += e3.length, { value: e3, done: false });
        });
      }, function(e2, t2, n) {
        var r = n(23), i = n(24);
        e2.exports = function(e3) {
          return function(t3, n2) {
            var o, a, s = String(i(t3)), c = r(n2), l = s.length;
            return c < 0 || c >= l ? e3 ? "" : void 0 : (o = s.charCodeAt(c), o < 55296 || o > 56319 || c + 1 === l || (a = s.charCodeAt(c + 1)) < 56320 || a > 57343 ? e3 ? s.charAt(c) : o : e3 ? s.slice(c, c + 2) : a - 56320 + (o - 55296 << 10) + 65536);
          };
        };
      }, function(e2, t2, n) {
        var r = n(87);
        e2.exports = function(e3, t3, n2) {
          if (r(e3), void 0 === t3) return e3;
          switch (n2) {
            case 1:
              return function(n3) {
                return e3.call(t3, n3);
              };
            case 2:
              return function(n3, r2) {
                return e3.call(t3, n3, r2);
              };
            case 3:
              return function(n3, r2, i) {
                return e3.call(t3, n3, r2, i);
              };
          }
          return function() {
            return e3.apply(t3, arguments);
          };
        };
      }, function(e2, t2) {
        e2.exports = function(e3) {
          if ("function" != typeof e3) throw TypeError(e3 + " is not a function!");
          return e3;
        };
      }, function(e2, t2, n) {
        var r = n(45), i = n(18), o = n(31), a = {};
        n(7)(a, n(11)("iterator"), function() {
          return this;
        }), e2.exports = function(e3, t3, n2) {
          e3.prototype = r(a, { next: i(1, n2) }), o(e3, t3 + " Iterator");
        };
      }, function(e2, t2, n) {
        var r = n(8), i = n(16), o = n(27);
        e2.exports = n(9) ? Object.defineProperties : function(e3, t3) {
          i(e3);
          for (var n2, a = o(t3), s = a.length, c = 0; s > c; ) r.f(e3, n2 = a[c++], t3[n2]);
          return e3;
        };
      }, function(e2, t2, n) {
        var r = n(47);
        e2.exports = Object("z").propertyIsEnumerable(0) ? Object : function(e3) {
          return "String" == r(e3) ? e3.split("") : Object(e3);
        };
      }, function(e2, t2, n) {
        var r = n(10), i = n(92), o = n(93);
        e2.exports = function(e3) {
          return function(t3, n2, a) {
            var s, c = r(t3), l = i(c.length), u = o(a, l);
            if (e3 && n2 != n2) {
              for (; l > u; ) if ((s = c[u++]) != s) return true;
            } else for (; l > u; u++) if ((e3 || u in c) && c[u] === n2) return e3 || u || 0;
            return !e3 && -1;
          };
        };
      }, function(e2, t2, n) {
        var r = n(23), i = Math.min;
        e2.exports = function(e3) {
          return e3 > 0 ? i(r(e3), 9007199254740991) : 0;
        };
      }, function(e2, t2, n) {
        var r = n(23), i = Math.max, o = Math.min;
        e2.exports = function(e3, t3) {
          return e3 = r(e3), e3 < 0 ? i(e3 + t3, 0) : o(e3, t3);
        };
      }, function(e2, t2, n) {
        var r = n(4).document;
        e2.exports = r && r.documentElement;
      }, function(e2, t2, n) {
        var r = n(6), i = n(48), o = n(28)("IE_PROTO"), a = Object.prototype;
        e2.exports = Object.getPrototypeOf || function(e3) {
          return e3 = i(e3), r(e3, o) ? e3[o] : "function" == typeof e3.constructor && e3 instanceof e3.constructor ? e3.constructor.prototype : e3 instanceof Object ? a : null;
        };
      }, function(e2, t2, n) {
        n(97);
        for (var r = n(4), i = n(7), o = n(26), a = n(11)("toStringTag"), s = "CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,TextTrackList,TouchList".split(","), c = 0; c < s.length; c++) {
          var l = s[c], u = r[l], f = u && u.prototype;
          f && !f[a] && i(f, a, l), o[l] = o.Array;
        }
      }, function(e2, t2, n) {
        var r = n(98), i = n(99), o = n(26), a = n(10);
        e2.exports = n(40)(Array, "Array", function(e3, t3) {
          this._t = a(e3), this._i = 0, this._k = t3;
        }, function() {
          var e3 = this._t, t3 = this._k, n2 = this._i++;
          return !e3 || n2 >= e3.length ? (this._t = void 0, i(1)) : "keys" == t3 ? i(0, n2) : "values" == t3 ? i(0, e3[n2]) : i(0, [n2, e3[n2]]);
        }, "values"), o.Arguments = o.Array, r("keys"), r("values"), r("entries");
      }, function(e2, t2) {
        e2.exports = function() {
        };
      }, function(e2, t2) {
        e2.exports = function(e3, t3) {
          return { value: t3, done: !!e3 };
        };
      }, function(e2, t2, n) {
        e2.exports = { default: n(101), __esModule: true };
      }, function(e2, t2, n) {
        n(102), n(108), n(109), n(110), e2.exports = n(15).Symbol;
      }, function(e2, t2, n) {
        var r = n(4), i = n(6), o = n(9), a = n(41), s = n(44), c = n(103).KEY, l = n(17), u = n(29), f = n(31), d = n(19), h2 = n(11), p = n(32), v = n(33), g = n(104), b = n(105), x = n(16), m = n(12), _2 = n(48), w = n(10), y = n(25), C = n(18), k = n(45), F = n(106), S = n(107), A = n(49), O = n(8), E = n(27), M = S.f, j = O.f, L = F.f, P = r.Symbol, R = r.JSON, D = R && R.stringify, B = h2("_hidden"), T = h2("toPrimitive"), H = {}.propertyIsEnumerable, N = u("symbol-registry"), z = u("symbols"), I = u("op-symbols"), $ = Object.prototype, U2 = "function" == typeof P && !!A.f, G = r.QObject, V = !G || !G.prototype || !G.prototype.findChild, q = o && l(function() {
          return 7 != k(j({}, "a", { get: function() {
            return j(this, "a", { value: 7 }).a;
          } })).a;
        }) ? function(e3, t3, n2) {
          var r2 = M($, t3);
          r2 && delete $[t3], j(e3, t3, n2), r2 && e3 !== $ && j($, t3, r2);
        } : j, X = function(e3) {
          var t3 = z[e3] = k(P.prototype);
          return t3._k = e3, t3;
        }, W = U2 && "symbol" == typeof P.iterator ? function(e3) {
          return "symbol" == typeof e3;
        } : function(e3) {
          return e3 instanceof P;
        }, Y = function(e3, t3, n2) {
          return e3 === $ && Y(I, t3, n2), x(e3), t3 = y(t3, true), x(n2), i(z, t3) ? (n2.enumerable ? (i(e3, B) && e3[B][t3] && (e3[B][t3] = false), n2 = k(n2, { enumerable: C(0, false) })) : (i(e3, B) || j(e3, B, C(1, {})), e3[B][t3] = true), q(e3, t3, n2)) : j(e3, t3, n2);
        }, J = function(e3, t3) {
          x(e3);
          for (var n2, r2 = g(t3 = w(t3)), i2 = 0, o2 = r2.length; o2 > i2; ) Y(e3, n2 = r2[i2++], t3[n2]);
          return e3;
        }, K = function(e3, t3) {
          return void 0 === t3 ? k(e3) : J(k(e3), t3);
        }, Z = function(e3) {
          var t3 = H.call(this, e3 = y(e3, true));
          return !(this === $ && i(z, e3) && !i(I, e3)) && (!(t3 || !i(this, e3) || !i(z, e3) || i(this, B) && this[B][e3]) || t3);
        }, Q = function(e3, t3) {
          if (e3 = w(e3), t3 = y(t3, true), e3 !== $ || !i(z, t3) || i(I, t3)) {
            var n2 = M(e3, t3);
            return !n2 || !i(z, t3) || i(e3, B) && e3[B][t3] || (n2.enumerable = true), n2;
          }
        }, ee = function(e3) {
          for (var t3, n2 = L(w(e3)), r2 = [], o2 = 0; n2.length > o2; ) i(z, t3 = n2[o2++]) || t3 == B || t3 == c || r2.push(t3);
          return r2;
        }, te = function(e3) {
          for (var t3, n2 = e3 === $, r2 = L(n2 ? I : w(e3)), o2 = [], a2 = 0; r2.length > a2; ) !i(z, t3 = r2[a2++]) || n2 && !i($, t3) || o2.push(z[t3]);
          return o2;
        };
        U2 || (P = function() {
          if (this instanceof P) throw TypeError("Symbol is not a constructor!");
          var e3 = d(arguments.length > 0 ? arguments[0] : void 0), t3 = function(n2) {
            this === $ && t3.call(I, n2), i(this, B) && i(this[B], e3) && (this[B][e3] = false), q(this, e3, C(1, n2));
          };
          return o && V && q($, e3, { configurable: true, set: t3 }), X(e3);
        }, s(P.prototype, "toString", function() {
          return this._k;
        }), S.f = Q, O.f = Y, n(50).f = F.f = ee, n(34).f = Z, A.f = te, o && !n(14) && s($, "propertyIsEnumerable", Z, true), p.f = function(e3) {
          return X(h2(e3));
        }), a(a.G + a.W + a.F * !U2, { Symbol: P });
        for (var ne = "hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","), re = 0; ne.length > re; ) h2(ne[re++]);
        for (var ie = E(h2.store), oe = 0; ie.length > oe; ) v(ie[oe++]);
        a(a.S + a.F * !U2, "Symbol", { for: function(e3) {
          return i(N, e3 += "") ? N[e3] : N[e3] = P(e3);
        }, keyFor: function(e3) {
          if (!W(e3)) throw TypeError(e3 + " is not a symbol!");
          for (var t3 in N) if (N[t3] === e3) return t3;
        }, useSetter: function() {
          V = true;
        }, useSimple: function() {
          V = false;
        } }), a(a.S + a.F * !U2, "Object", { create: K, defineProperty: Y, defineProperties: J, getOwnPropertyDescriptor: Q, getOwnPropertyNames: ee, getOwnPropertySymbols: te });
        var ae = l(function() {
          A.f(1);
        });
        a(a.S + a.F * ae, "Object", { getOwnPropertySymbols: function(e3) {
          return A.f(_2(e3));
        } }), R && a(a.S + a.F * (!U2 || l(function() {
          var e3 = P();
          return "[null]" != D([e3]) || "{}" != D({ a: e3 }) || "{}" != D(Object(e3));
        })), "JSON", { stringify: function(e3) {
          for (var t3, n2, r2 = [e3], i2 = 1; arguments.length > i2; ) r2.push(arguments[i2++]);
          if (n2 = t3 = r2[1], (m(t3) || void 0 !== e3) && !W(e3)) return b(t3) || (t3 = function(e4, t4) {
            if ("function" == typeof n2 && (t4 = n2.call(this, e4, t4)), !W(t4)) return t4;
          }), r2[1] = t3, D.apply(R, r2);
        } }), P.prototype[T] || n(7)(P.prototype, T, P.prototype.valueOf), f(P, "Symbol"), f(Math, "Math", true), f(r.JSON, "JSON", true);
      }, function(e2, t2, n) {
        var r = n(19)("meta"), i = n(12), o = n(6), a = n(8).f, s = 0, c = Object.isExtensible || function() {
          return true;
        }, l = !n(17)(function() {
          return c(Object.preventExtensions({}));
        }), u = function(e3) {
          a(e3, r, { value: { i: "O" + ++s, w: {} } });
        }, f = function(e3, t3) {
          if (!i(e3)) return "symbol" == typeof e3 ? e3 : ("string" == typeof e3 ? "S" : "P") + e3;
          if (!o(e3, r)) {
            if (!c(e3)) return "F";
            if (!t3) return "E";
            u(e3);
          }
          return e3[r].i;
        }, d = function(e3, t3) {
          if (!o(e3, r)) {
            if (!c(e3)) return true;
            if (!t3) return false;
            u(e3);
          }
          return e3[r].w;
        }, h2 = function(e3) {
          return l && p.NEED && c(e3) && !o(e3, r) && u(e3), e3;
        }, p = e2.exports = { KEY: r, NEED: false, fastKey: f, getWeak: d, onFreeze: h2 };
      }, function(e2, t2, n) {
        var r = n(27), i = n(49), o = n(34);
        e2.exports = function(e3) {
          var t3 = r(e3), n2 = i.f;
          if (n2) for (var a, s = n2(e3), c = o.f, l = 0; s.length > l; ) c.call(e3, a = s[l++]) && t3.push(a);
          return t3;
        };
      }, function(e2, t2, n) {
        var r = n(47);
        e2.exports = Array.isArray || function(e3) {
          return "Array" == r(e3);
        };
      }, function(e2, t2, n) {
        var r = n(10), i = n(50).f, o = {}.toString, a = "object" == typeof window && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [], s = function(e3) {
          try {
            return i(e3);
          } catch (e4) {
            return a.slice();
          }
        };
        e2.exports.f = function(e3) {
          return a && "[object Window]" == o.call(e3) ? s(e3) : i(r(e3));
        };
      }, function(e2, t2, n) {
        var r = n(34), i = n(18), o = n(10), a = n(25), s = n(6), c = n(42), l = Object.getOwnPropertyDescriptor;
        t2.f = n(9) ? l : function(e3, t3) {
          if (e3 = o(e3), t3 = a(t3, true), c) try {
            return l(e3, t3);
          } catch (e4) {
          }
          if (s(e3, t3)) return i(!r.f.call(e3, t3), e3[t3]);
        };
      }, function(e2, t2) {
      }, function(e2, t2, n) {
        n(33)("asyncIterator");
      }, function(e2, t2, n) {
        n(33)("observable");
      }, function(e2, t2, n) {
        var r = n(112);
        "string" == typeof r && (r = [[e2.i, r, ""]]), r.locals && (e2.exports = r.locals);
        n(1)("7c5f1a1c", r, false, {});
      }, function(e2, t2, n) {
        t2 = e2.exports = n(0)(false), t2.push([e2.i, "\n.vc-hue {\n  position: absolute;\n  top: 0px;\n  right: 0px;\n  bottom: 0px;\n  left: 0px;\n  border-radius: 2px;\n}\n.vc-hue--horizontal {\n  background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);\n}\n.vc-hue--vertical {\n  background: linear-gradient(to top, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);\n}\n.vc-hue-container {\n  cursor: pointer;\n  margin: 0 2px;\n  position: relative;\n  height: 100%;\n}\n.vc-hue-pointer {\n  z-index: 2;\n  position: absolute;\n}\n.vc-hue-picker {\n  cursor: pointer;\n  margin-top: 1px;\n  width: 4px;\n  border-radius: 1px;\n  height: 8px;\n  box-shadow: 0 0 2px rgba(0, 0, 0, .6);\n  background: #fff;\n  transform: translateX(-2px) ;\n}\n", ""]);
      }, function(e2, t2, n) {
        var r = function() {
          var e3 = this, t3 = e3.$createElement, n2 = e3._self._c || t3;
          return n2("div", { class: ["vc-hue", e3.directionClass] }, [n2("div", { ref: "container", staticClass: "vc-hue-container", attrs: { role: "slider", "aria-valuenow": e3.colors.hsl.h, "aria-valuemin": "0", "aria-valuemax": "360" }, on: { mousedown: e3.handleMouseDown, touchmove: e3.handleChange, touchstart: e3.handleChange } }, [n2("div", { staticClass: "vc-hue-pointer", style: { top: e3.pointerTop, left: e3.pointerLeft }, attrs: { role: "presentation" } }, [n2("div", { staticClass: "vc-hue-picker" })])])]);
        }, i = [];
        r._withStripped = true;
        var o = { render: r, staticRenderFns: i };
        t2.a = o;
      }, function(e2, t2, n) {
        var r = function() {
          var e3 = this, t3 = e3.$createElement, n2 = e3._self._c || t3;
          return n2("div", { staticClass: "vc-slider", attrs: { role: "application", "aria-label": "Slider color picker" } }, [n2("div", { staticClass: "vc-slider-hue-warp" }, [n2("hue", { on: { change: e3.hueChange }, model: { value: e3.colors, callback: function(t4) {
            e3.colors = t4;
          }, expression: "colors" } })], 1), e3._v(" "), n2("div", { staticClass: "vc-slider-swatches", attrs: { role: "group" } }, e3._l(e3.normalizedSwatches, function(t4, r2) {
            return n2("div", { key: r2, staticClass: "vc-slider-swatch", attrs: { "data-index": r2, "aria-label": "color:" + e3.colors.hex, role: "button" }, on: { click: function(n3) {
              return e3.handleSwClick(r2, t4);
            } } }, [n2("div", { staticClass: "vc-slider-swatch-picker", class: { "vc-slider-swatch-picker--active": e3.isActive(t4, r2), "vc-slider-swatch-picker--white": 1 === t4.l }, style: { background: "hsl(" + e3.colors.hsl.h + ", " + 100 * t4.s + "%, " + 100 * t4.l + "%)" } })]);
          }), 0)]);
        }, i = [];
        r._withStripped = true;
        var o = { render: r, staticRenderFns: i };
        t2.a = o;
      }, function(e2, t2, n) {
        function r(e3) {
          n(116);
        }
        Object.defineProperty(t2, "__esModule", { value: true });
        var i = n(52), o = n.n(i);
        for (var a in i) "default" !== a && function(e3) {
          n.d(t2, e3, function() {
            return i[e3];
          });
        }(a);
        var s = n(119), l = n(2), u = r, f = l(o.a, s.a, false, u, null, null);
        f.options.__file = "src/components/Swatches.vue", t2.default = f.exports;
      }, function(e2, t2, n) {
        var r = n(117);
        "string" == typeof r && (r = [[e2.i, r, ""]]), r.locals && (e2.exports = r.locals);
        n(1)("10f839a2", r, false, {});
      }, function(e2, t2, n) {
        t2 = e2.exports = n(0)(false), t2.push([e2.i, "\n.vc-swatches {\n  width: 320px;\n  height: 240px;\n  overflow-y: scroll;\n  background-color: #fff;\n  box-shadow: 0 2px 10px rgba(0,0,0,.12), 0 2px 5px rgba(0,0,0,.16);\n}\n.vc-swatches-box {\n  padding: 16px 0 6px 16px;\n  overflow: hidden;\n}\n.vc-swatches-color-group {\n  padding-bottom: 10px;\n  width: 40px;\n  float: left;\n  margin-right: 10px;\n}\n.vc-swatches-color-it {\n  box-sizing: border-box;\n  width: 40px;\n  height: 24px;\n  cursor: pointer;\n  background: #880e4f;\n  margin-bottom: 1px;\n  overflow: hidden;\n  -ms-border-radius: 2px 2px 0 0;\n  -moz-border-radius: 2px 2px 0 0;\n  -o-border-radius: 2px 2px 0 0;\n  -webkit-border-radius: 2px 2px 0 0;\n  border-radius: 2px 2px 0 0;\n}\n.vc-swatches-color--white {\n  border: 1px solid #DDD;\n}\n.vc-swatches-pick {\n  fill: rgb(255, 255, 255);\n  margin-left: 8px;\n  display: block;\n}\n.vc-swatches-color--white .vc-swatches-pick {\n  fill: rgb(51, 51, 51);\n}\n", ""]);
      }, function(e2, t2, n) {
        Object.defineProperty(t2, "__esModule", { value: true }), n.d(t2, "red", function() {
          return r;
        }), n.d(t2, "pink", function() {
          return i;
        }), n.d(t2, "purple", function() {
          return o;
        }), n.d(t2, "deepPurple", function() {
          return a;
        }), n.d(t2, "indigo", function() {
          return s;
        }), n.d(t2, "blue", function() {
          return c;
        }), n.d(t2, "lightBlue", function() {
          return l;
        }), n.d(t2, "cyan", function() {
          return u;
        }), n.d(t2, "teal", function() {
          return f;
        }), n.d(t2, "green", function() {
          return d;
        }), n.d(t2, "lightGreen", function() {
          return h2;
        }), n.d(t2, "lime", function() {
          return p;
        }), n.d(t2, "yellow", function() {
          return v;
        }), n.d(t2, "amber", function() {
          return g;
        }), n.d(t2, "orange", function() {
          return b;
        }), n.d(t2, "deepOrange", function() {
          return x;
        }), n.d(t2, "brown", function() {
          return m;
        }), n.d(t2, "grey", function() {
          return _2;
        }), n.d(t2, "blueGrey", function() {
          return w;
        }), n.d(t2, "darkText", function() {
          return y;
        }), n.d(t2, "lightText", function() {
          return C;
        }), n.d(t2, "darkIcons", function() {
          return k;
        }), n.d(t2, "lightIcons", function() {
          return F;
        }), n.d(t2, "white", function() {
          return S;
        }), n.d(t2, "black", function() {
          return A;
        });
        var r = { 50: "#ffebee", 100: "#ffcdd2", 200: "#ef9a9a", 300: "#e57373", 400: "#ef5350", 500: "#f44336", 600: "#e53935", 700: "#d32f2f", 800: "#c62828", 900: "#b71c1c", a100: "#ff8a80", a200: "#ff5252", a400: "#ff1744", a700: "#d50000" }, i = { 50: "#fce4ec", 100: "#f8bbd0", 200: "#f48fb1", 300: "#f06292", 400: "#ec407a", 500: "#e91e63", 600: "#d81b60", 700: "#c2185b", 800: "#ad1457", 900: "#880e4f", a100: "#ff80ab", a200: "#ff4081", a400: "#f50057", a700: "#c51162" }, o = { 50: "#f3e5f5", 100: "#e1bee7", 200: "#ce93d8", 300: "#ba68c8", 400: "#ab47bc", 500: "#9c27b0", 600: "#8e24aa", 700: "#7b1fa2", 800: "#6a1b9a", 900: "#4a148c", a100: "#ea80fc", a200: "#e040fb", a400: "#d500f9", a700: "#aa00ff" }, a = { 50: "#ede7f6", 100: "#d1c4e9", 200: "#b39ddb", 300: "#9575cd", 400: "#7e57c2", 500: "#673ab7", 600: "#5e35b1", 700: "#512da8", 800: "#4527a0", 900: "#311b92", a100: "#b388ff", a200: "#7c4dff", a400: "#651fff", a700: "#6200ea" }, s = { 50: "#e8eaf6", 100: "#c5cae9", 200: "#9fa8da", 300: "#7986cb", 400: "#5c6bc0", 500: "#3f51b5", 600: "#3949ab", 700: "#303f9f", 800: "#283593", 900: "#1a237e", a100: "#8c9eff", a200: "#536dfe", a400: "#3d5afe", a700: "#304ffe" }, c = { 50: "#e3f2fd", 100: "#bbdefb", 200: "#90caf9", 300: "#64b5f6", 400: "#42a5f5", 500: "#2196f3", 600: "#1e88e5", 700: "#1976d2", 800: "#1565c0", 900: "#0d47a1", a100: "#82b1ff", a200: "#448aff", a400: "#2979ff", a700: "#2962ff" }, l = { 50: "#e1f5fe", 100: "#b3e5fc", 200: "#81d4fa", 300: "#4fc3f7", 400: "#29b6f6", 500: "#03a9f4", 600: "#039be5", 700: "#0288d1", 800: "#0277bd", 900: "#01579b", a100: "#80d8ff", a200: "#40c4ff", a400: "#00b0ff", a700: "#0091ea" }, u = { 50: "#e0f7fa", 100: "#b2ebf2", 200: "#80deea", 300: "#4dd0e1", 400: "#26c6da", 500: "#00bcd4", 600: "#00acc1", 700: "#0097a7", 800: "#00838f", 900: "#006064", a100: "#84ffff", a200: "#18ffff", a400: "#00e5ff", a700: "#00b8d4" }, f = { 50: "#e0f2f1", 100: "#b2dfdb", 200: "#80cbc4", 300: "#4db6ac", 400: "#26a69a", 500: "#009688", 600: "#00897b", 700: "#00796b", 800: "#00695c", 900: "#004d40", a100: "#a7ffeb", a200: "#64ffda", a400: "#1de9b6", a700: "#00bfa5" }, d = { 50: "#e8f5e9", 100: "#c8e6c9", 200: "#a5d6a7", 300: "#81c784", 400: "#66bb6a", 500: "#4caf50", 600: "#43a047", 700: "#388e3c", 800: "#2e7d32", 900: "#1b5e20", a100: "#b9f6ca", a200: "#69f0ae", a400: "#00e676", a700: "#00c853" }, h2 = { 50: "#f1f8e9", 100: "#dcedc8", 200: "#c5e1a5", 300: "#aed581", 400: "#9ccc65", 500: "#8bc34a", 600: "#7cb342", 700: "#689f38", 800: "#558b2f", 900: "#33691e", a100: "#ccff90", a200: "#b2ff59", a400: "#76ff03", a700: "#64dd17" }, p = { 50: "#f9fbe7", 100: "#f0f4c3", 200: "#e6ee9c", 300: "#dce775", 400: "#d4e157", 500: "#cddc39", 600: "#c0ca33", 700: "#afb42b", 800: "#9e9d24", 900: "#827717", a100: "#f4ff81", a200: "#eeff41", a400: "#c6ff00", a700: "#aeea00" }, v = { 50: "#fffde7", 100: "#fff9c4", 200: "#fff59d", 300: "#fff176", 400: "#ffee58", 500: "#ffeb3b", 600: "#fdd835", 700: "#fbc02d", 800: "#f9a825", 900: "#f57f17", a100: "#ffff8d", a200: "#ffff00", a400: "#ffea00", a700: "#ffd600" }, g = { 50: "#fff8e1", 100: "#ffecb3", 200: "#ffe082", 300: "#ffd54f", 400: "#ffca28", 500: "#ffc107", 600: "#ffb300", 700: "#ffa000", 800: "#ff8f00", 900: "#ff6f00", a100: "#ffe57f", a200: "#ffd740", a400: "#ffc400", a700: "#ffab00" }, b = { 50: "#fff3e0", 100: "#ffe0b2", 200: "#ffcc80", 300: "#ffb74d", 400: "#ffa726", 500: "#ff9800", 600: "#fb8c00", 700: "#f57c00", 800: "#ef6c00", 900: "#e65100", a100: "#ffd180", a200: "#ffab40", a400: "#ff9100", a700: "#ff6d00" }, x = { 50: "#fbe9e7", 100: "#ffccbc", 200: "#ffab91", 300: "#ff8a65", 400: "#ff7043", 500: "#ff5722", 600: "#f4511e", 700: "#e64a19", 800: "#d84315", 900: "#bf360c", a100: "#ff9e80", a200: "#ff6e40", a400: "#ff3d00", a700: "#dd2c00" }, m = { 50: "#efebe9", 100: "#d7ccc8", 200: "#bcaaa4", 300: "#a1887f", 400: "#8d6e63", 500: "#795548", 600: "#6d4c41", 700: "#5d4037", 800: "#4e342e", 900: "#3e2723" }, _2 = { 50: "#fafafa", 100: "#f5f5f5", 200: "#eeeeee", 300: "#e0e0e0", 400: "#bdbdbd", 500: "#9e9e9e", 600: "#757575", 700: "#616161", 800: "#424242", 900: "#212121" }, w = { 50: "#eceff1", 100: "#cfd8dc", 200: "#b0bec5", 300: "#90a4ae", 400: "#78909c", 500: "#607d8b", 600: "#546e7a", 700: "#455a64", 800: "#37474f", 900: "#263238" }, y = { primary: "rgba(0, 0, 0, 0.87)", secondary: "rgba(0, 0, 0, 0.54)", disabled: "rgba(0, 0, 0, 0.38)", dividers: "rgba(0, 0, 0, 0.12)" }, C = { primary: "rgba(255, 255, 255, 1)", secondary: "rgba(255, 255, 255, 0.7)", disabled: "rgba(255, 255, 255, 0.5)", dividers: "rgba(255, 255, 255, 0.12)" }, k = { active: "rgba(0, 0, 0, 0.54)", inactive: "rgba(0, 0, 0, 0.38)" }, F = { active: "rgba(255, 255, 255, 1)", inactive: "rgba(255, 255, 255, 0.5)" }, S = "#ffffff", A = "#000000";
        t2.default = { red: r, pink: i, purple: o, deepPurple: a, indigo: s, blue: c, lightBlue: l, cyan: u, teal: f, green: d, lightGreen: h2, lime: p, yellow: v, amber: g, orange: b, deepOrange: x, brown: m, grey: _2, blueGrey: w, darkText: y, lightText: C, darkIcons: k, lightIcons: F, white: S, black: A };
      }, function(e2, t2, n) {
        var r = function() {
          var e3 = this, t3 = e3.$createElement, n2 = e3._self._c || t3;
          return n2("div", { staticClass: "vc-swatches", attrs: { role: "application", "aria-label": "Swatches color picker", "data-pick": e3.pick } }, [n2("div", { staticClass: "vc-swatches-box", attrs: { role: "listbox" } }, e3._l(e3.palette, function(t4, r2) {
            return n2("div", { key: r2, staticClass: "vc-swatches-color-group" }, e3._l(t4, function(t9) {
              return n2("div", { key: t9, class: ["vc-swatches-color-it", { "vc-swatches-color--white": "#FFFFFF" === t9 }], style: { background: t9 }, attrs: { role: "option", "aria-label": "Color:" + t9, "aria-selected": e3.equal(t9), "data-color": t9 }, on: { click: function(n3) {
                return e3.handlerClick(t9);
              } } }, [n2("div", { directives: [{ name: "show", rawName: "v-show", value: e3.equal(t9), expression: "equal(c)" }], staticClass: "vc-swatches-pick" }, [n2("svg", { staticStyle: { width: "24px", height: "24px" }, attrs: { viewBox: "0 0 24 24" } }, [n2("path", { attrs: { d: "M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" } })])])]);
            }), 0);
          }), 0)]);
        }, i = [];
        r._withStripped = true;
        var o = { render: r, staticRenderFns: i };
        t2.a = o;
      }, function(e2, t2, n) {
        function r(e3) {
          n(121);
        }
        Object.defineProperty(t2, "__esModule", { value: true });
        var i = n(53), o = n.n(i);
        for (var a in i) "default" !== a && function(e3) {
          n.d(t2, e3, function() {
            return i[e3];
          });
        }(a);
        var s = n(134), l = n(2), u = r, f = l(o.a, s.a, false, u, null, null);
        f.options.__file = "src/components/Photoshop.vue", t2.default = f.exports;
      }, function(e2, t2, n) {
        var r = n(122);
        "string" == typeof r && (r = [[e2.i, r, ""]]), r.locals && (e2.exports = r.locals);
        n(1)("080365d4", r, false, {});
      }, function(e2, t2, n) {
        t2 = e2.exports = n(0)(false), t2.push([e2.i, '\n.vc-photoshop {\n  background: #DCDCDC;\n  border-radius: 4px;\n  box-shadow: 0 0 0 1px rgba(0,0,0,.25), 0 8px 16px rgba(0,0,0,.15);\n  box-sizing: initial;\n  width: 513px;\n  font-family: Roboto;\n}\n.vc-photoshop__disable-fields {\n  width: 390px;\n}\n.vc-ps-head {\n  background-image: linear-gradient(-180deg, #F0F0F0 0%, #D4D4D4 100%);\n  border-bottom: 1px solid #B1B1B1;\n  box-shadow: inset 0 1px 0 0 rgba(255,255,255,.2), inset 0 -1px 0 0 rgba(0,0,0,.02);\n  height: 23px;\n  line-height: 24px;\n  border-radius: 4px 4px 0 0;\n  font-size: 13px;\n  color: #4D4D4D;\n  text-align: center;\n}\n.vc-ps-body {\n  padding: 15px;\n  display: flex;\n}\n.vc-ps-saturation-wrap {\n  width: 256px;\n  height: 256px;\n  position: relative;\n  border: 2px solid #B3B3B3;\n  border-bottom: 2px solid #F0F0F0;\n  overflow: hidden;\n}\n.vc-ps-saturation-wrap .vc-saturation-circle {\n  width: 12px;\n  height: 12px;\n}\n.vc-ps-hue-wrap {\n  position: relative;\n  height: 256px;\n  width: 19px;\n  margin-left: 10px;\n  border: 2px solid #B3B3B3;\n  border-bottom: 2px solid #F0F0F0;\n}\n.vc-ps-hue-pointer {\n  position: relative;\n}\n.vc-ps-hue-pointer--left,\n.vc-ps-hue-pointer--right {\n  position: absolute;\n  width: 0;\n  height: 0;\n  border-style: solid;\n  border-width: 5px 0 5px 8px;\n  border-color: transparent transparent transparent #555;\n}\n.vc-ps-hue-pointer--left:after,\n.vc-ps-hue-pointer--right:after {\n  content: "";\n  width: 0;\n  height: 0;\n  border-style: solid;\n  border-width: 4px 0 4px 6px;\n  border-color: transparent transparent transparent #fff;\n  position: absolute;\n  top: 1px;\n  left: 1px;\n  transform: translate(-8px, -5px);\n}\n.vc-ps-hue-pointer--left {\n  transform: translate(-13px, -4px);\n}\n.vc-ps-hue-pointer--right {\n  transform: translate(20px, -4px) rotate(180deg);\n}\n.vc-ps-controls {\n  width: 180px;\n  margin-left: 10px;\n  display: flex;\n}\n.vc-ps-controls__disable-fields {\n  width: auto;\n}\n.vc-ps-actions {\n  margin-left: 20px;\n  flex: 1;\n}\n.vc-ps-ac-btn {\n  cursor: pointer;\n  background-image: linear-gradient(-180deg, #FFFFFF 0%, #E6E6E6 100%);\n  border: 1px solid #878787;\n  border-radius: 2px;\n  height: 20px;\n  box-shadow: 0 1px 0 0 #EAEAEA;\n  font-size: 14px;\n  color: #000;\n  line-height: 20px;\n  text-align: center;\n  margin-bottom: 10px;\n}\n.vc-ps-previews {\n  width: 60px;\n}\n.vc-ps-previews__swatches {\n  border: 1px solid #B3B3B3;\n  border-bottom: 1px solid #F0F0F0;\n  margin-bottom: 2px;\n  margin-top: 1px;\n}\n.vc-ps-previews__pr-color {\n  height: 34px;\n  box-shadow: inset 1px 0 0 #000, inset -1px 0 0 #000, inset 0 1px 0 #000;\n}\n.vc-ps-previews__label {\n  font-size: 14px;\n  color: #000;\n  text-align: center;\n}\n.vc-ps-fields {\n  padding-top: 5px;\n  padding-bottom: 9px;\n  width: 80px;\n  position: relative;\n}\n.vc-ps-fields .vc-input__input {\n  margin-left: 40%;\n  width: 40%;\n  height: 18px;\n  border: 1px solid #888888;\n  box-shadow: inset 0 1px 1px rgba(0,0,0,.1), 0 1px 0 0 #ECECEC;\n  margin-bottom: 5px;\n  font-size: 13px;\n  padding-left: 3px;\n  margin-right: 10px;\n}\n.vc-ps-fields .vc-input__label, .vc-ps-fields .vc-input__desc {\n  top: 0;\n  text-transform: uppercase;\n  font-size: 13px;\n  height: 18px;\n  line-height: 22px;\n  position: absolute;\n}\n.vc-ps-fields .vc-input__label {\n  left: 0;\n  width: 34px;\n}\n.vc-ps-fields .vc-input__desc {\n  right: 0;\n  width: 0;\n}\n.vc-ps-fields__divider {\n  height: 5px;\n}\n.vc-ps-fields__hex .vc-input__input {\n  margin-left: 20%;\n  width: 80%;\n  height: 18px;\n  border: 1px solid #888888;\n  box-shadow: inset 0 1px 1px rgba(0,0,0,.1), 0 1px 0 0 #ECECEC;\n  margin-bottom: 6px;\n  font-size: 13px;\n  padding-left: 3px;\n}\n.vc-ps-fields__hex .vc-input__label {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 14px;\n  text-transform: uppercase;\n  font-size: 13px;\n  height: 18px;\n  line-height: 22px;\n}\n', ""]);
      }, function(e2, t2, n) {
        var r = n(124);
        "string" == typeof r && (r = [[e2.i, r, ""]]), r.locals && (e2.exports = r.locals);
        n(1)("b5380e52", r, false, {});
      }, function(e2, t2, n) {
        t2 = e2.exports = n(0)(false), t2.push([e2.i, "\n.vc-saturation,\n.vc-saturation--white,\n.vc-saturation--black {\n  cursor: pointer;\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n}\n.vc-saturation--white {\n  background: linear-gradient(to right, #fff, rgba(255,255,255,0));\n}\n.vc-saturation--black {\n  background: linear-gradient(to top, #000, rgba(0,0,0,0));\n}\n.vc-saturation-pointer {\n  cursor: pointer;\n  position: absolute;\n}\n.vc-saturation-circle {\n  cursor: head;\n  width: 4px;\n  height: 4px;\n  box-shadow: 0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0,0,0,.3), 0 0 1px 2px rgba(0,0,0,.4);\n  border-radius: 50%;\n  transform: translate(-2px, -2px);\n}\n", ""]);
      }, function(e2, t2) {
        function n(e3, t3, n2) {
          return t3 < n2 ? e3 < t3 ? t3 : e3 > n2 ? n2 : e3 : e3 < n2 ? n2 : e3 > t3 ? t3 : e3;
        }
        e2.exports = n;
      }, function(e2, t2) {
        function n(e3, t3, n2) {
          function r2(t4) {
            var n3 = v2, r3 = g2;
            return v2 = g2 = void 0, k = t4, x2 = e3.apply(r3, n3);
          }
          function o2(e4) {
            return k = e4, m2 = setTimeout(u2, t3), F ? r2(e4) : x2;
          }
          function a2(e4) {
            var n3 = e4 - _3, r3 = e4 - k, i2 = t3 - n3;
            return S ? y(i2, b2 - r3) : i2;
          }
          function l2(e4) {
            var n3 = e4 - _3, r3 = e4 - k;
            return void 0 === _3 || n3 >= t3 || n3 < 0 || S && r3 >= b2;
          }
          function u2() {
            var e4 = C();
            if (l2(e4)) return f2(e4);
            m2 = setTimeout(u2, a2(e4));
          }
          function f2(e4) {
            return m2 = void 0, A && v2 ? r2(e4) : (v2 = g2 = void 0, x2);
          }
          function d2() {
            void 0 !== m2 && clearTimeout(m2), k = 0, v2 = _3 = g2 = m2 = void 0;
          }
          function h3() {
            return void 0 === m2 ? x2 : f2(C());
          }
          function p2() {
            var e4 = C(), n3 = l2(e4);
            if (v2 = arguments, g2 = this, _3 = e4, n3) {
              if (void 0 === m2) return o2(_3);
              if (S) return m2 = setTimeout(u2, t3), r2(_3);
            }
            return void 0 === m2 && (m2 = setTimeout(u2, t3)), x2;
          }
          var v2, g2, b2, x2, m2, _3, k = 0, F = false, S = false, A = true;
          if ("function" != typeof e3) throw new TypeError(c);
          return t3 = s(t3) || 0, i(n2) && (F = !!n2.leading, S = "maxWait" in n2, b2 = S ? w(s(n2.maxWait) || 0, t3) : b2, A = "trailing" in n2 ? !!n2.trailing : A), p2.cancel = d2, p2.flush = h3, p2;
        }
        function r(e3, t3, r2) {
          var o2 = true, a2 = true;
          if ("function" != typeof e3) throw new TypeError(c);
          return i(r2) && (o2 = "leading" in r2 ? !!r2.leading : o2, a2 = "trailing" in r2 ? !!r2.trailing : a2), n(e3, t3, { leading: o2, maxWait: t3, trailing: a2 });
        }
        function i(e3) {
          var t3 = typeof e3;
          return !!e3 && ("object" == t3 || "function" == t3);
        }
        function o(e3) {
          return !!e3 && "object" == typeof e3;
        }
        function a(e3) {
          return "symbol" == typeof e3 || o(e3) && _2.call(e3) == u;
        }
        function s(e3) {
          if ("number" == typeof e3) return e3;
          if (a(e3)) return l;
          if (i(e3)) {
            var t3 = "function" == typeof e3.valueOf ? e3.valueOf() : e3;
            e3 = i(t3) ? t3 + "" : t3;
          }
          if ("string" != typeof e3) return 0 === e3 ? e3 : +e3;
          e3 = e3.replace(f, "");
          var n2 = h2.test(e3);
          return n2 || p.test(e3) ? v(e3.slice(2), n2 ? 2 : 8) : d.test(e3) ? l : +e3;
        }
        var c = "Expected a function", l = NaN, u = "[object Symbol]", f = /^\s+|\s+$/g, d = /^[-+]0x[0-9a-f]+$/i, h2 = /^0b[01]+$/i, p = /^0o[0-7]+$/i, v = parseInt, g = "object" == typeof commonjsGlobal && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal, b = "object" == typeof self && self && self.Object === Object && self, x = g || b || Function("return this")(), m = Object.prototype, _2 = m.toString, w = Math.max, y = Math.min, C = function() {
          return x.Date.now();
        };
        e2.exports = r;
      }, function(e2, t2, n) {
        var r = function() {
          var e3 = this, t3 = e3.$createElement, n2 = e3._self._c || t3;
          return n2("div", { ref: "container", staticClass: "vc-saturation", style: { background: e3.bgColor }, on: { mousedown: e3.handleMouseDown, touchmove: e3.handleChange, touchstart: e3.handleChange } }, [n2("div", { staticClass: "vc-saturation--white" }), e3._v(" "), n2("div", { staticClass: "vc-saturation--black" }), e3._v(" "), n2("div", { staticClass: "vc-saturation-pointer", style: { top: e3.pointerTop, left: e3.pointerLeft } }, [n2("div", { staticClass: "vc-saturation-circle" })])]);
        }, i = [];
        r._withStripped = true;
        var o = { render: r, staticRenderFns: i };
        t2.a = o;
      }, function(e2, t2, n) {
        var r = n(129);
        "string" == typeof r && (r = [[e2.i, r, ""]]), r.locals && (e2.exports = r.locals);
        n(1)("4dc1b086", r, false, {});
      }, function(e2, t2, n) {
        t2 = e2.exports = n(0)(false), t2.push([e2.i, "\n.vc-alpha {\n  position: absolute;\n  top: 0px;\n  right: 0px;\n  bottom: 0px;\n  left: 0px;\n}\n.vc-alpha-checkboard-wrap {\n  position: absolute;\n  top: 0px;\n  right: 0px;\n  bottom: 0px;\n  left: 0px;\n  overflow: hidden;\n}\n.vc-alpha-gradient {\n  position: absolute;\n  top: 0px;\n  right: 0px;\n  bottom: 0px;\n  left: 0px;\n}\n.vc-alpha-container {\n  cursor: pointer;\n  position: relative;\n  z-index: 2;\n  height: 100%;\n  margin: 0 3px;\n}\n.vc-alpha-pointer {\n  z-index: 2;\n  position: absolute;\n}\n.vc-alpha-picker {\n  cursor: pointer;\n  width: 4px;\n  border-radius: 1px;\n  height: 8px;\n  box-shadow: 0 0 2px rgba(0, 0, 0, .6);\n  background: #fff;\n  margin-top: 1px;\n  transform: translateX(-2px);\n}\n", ""]);
      }, function(e2, t2, n) {
        var r = n(131);
        "string" == typeof r && (r = [[e2.i, r, ""]]), r.locals && (e2.exports = r.locals);
        n(1)("7e15c05b", r, false, {});
      }, function(e2, t2, n) {
        t2 = e2.exports = n(0)(false), t2.push([e2.i, "\n.vc-checkerboard {\n  position: absolute;\n  top: 0px;\n  right: 0px;\n  bottom: 0px;\n  left: 0px;\n  background-size: contain;\n}\n", ""]);
      }, function(e2, t2, n) {
        var r = function() {
          var e3 = this, t3 = e3.$createElement;
          return (e3._self._c || t3)("div", { staticClass: "vc-checkerboard", style: e3.bgStyle });
        }, i = [];
        r._withStripped = true;
        var o = { render: r, staticRenderFns: i };
        t2.a = o;
      }, function(e2, t2, n) {
        var r = function() {
          var e3 = this, t3 = e3.$createElement, n2 = e3._self._c || t3;
          return n2("div", { staticClass: "vc-alpha" }, [n2("div", { staticClass: "vc-alpha-checkboard-wrap" }, [n2("checkboard")], 1), e3._v(" "), n2("div", { staticClass: "vc-alpha-gradient", style: { background: e3.gradientColor } }), e3._v(" "), n2("div", { ref: "container", staticClass: "vc-alpha-container", on: { mousedown: e3.handleMouseDown, touchmove: e3.handleChange, touchstart: e3.handleChange } }, [n2("div", { staticClass: "vc-alpha-pointer", style: { left: 100 * e3.colors.a + "%" } }, [n2("div", { staticClass: "vc-alpha-picker" })])])]);
        }, i = [];
        r._withStripped = true;
        var o = { render: r, staticRenderFns: i };
        t2.a = o;
      }, function(e2, t2, n) {
        var r = function() {
          var e3 = this, t3 = e3.$createElement, n2 = e3._self._c || t3;
          return n2("div", { class: ["vc-photoshop", e3.disableFields ? "vc-photoshop__disable-fields" : ""], attrs: { role: "application", "aria-label": "PhotoShop color picker" } }, [n2("div", { staticClass: "vc-ps-head", attrs: { role: "heading" } }, [e3._v(e3._s(e3.head))]), e3._v(" "), n2("div", { staticClass: "vc-ps-body" }, [n2("div", { staticClass: "vc-ps-saturation-wrap" }, [n2("saturation", { on: { change: e3.childChange }, model: { value: e3.colors, callback: function(t4) {
            e3.colors = t4;
          }, expression: "colors" } })], 1), e3._v(" "), n2("div", { staticClass: "vc-ps-hue-wrap" }, [n2("hue", { attrs: { direction: "vertical" }, on: { change: e3.childChange }, model: { value: e3.colors, callback: function(t4) {
            e3.colors = t4;
          }, expression: "colors" } }, [n2("div", { staticClass: "vc-ps-hue-pointer" }, [n2("i", { staticClass: "vc-ps-hue-pointer--left" }), n2("i", { staticClass: "vc-ps-hue-pointer--right" })])])], 1), e3._v(" "), n2("div", { class: ["vc-ps-controls", e3.disableFields ? "vc-ps-controls__disable-fields" : ""] }, [n2("div", { staticClass: "vc-ps-previews" }, [n2("div", { staticClass: "vc-ps-previews__label" }, [e3._v(e3._s(e3.newLabel))]), e3._v(" "), n2("div", { staticClass: "vc-ps-previews__swatches" }, [n2("div", { staticClass: "vc-ps-previews__pr-color", style: { background: e3.colors.hex }, attrs: { "aria-label": "New color is " + e3.colors.hex } }), e3._v(" "), n2("div", { staticClass: "vc-ps-previews__pr-color", style: { background: e3.currentColor }, attrs: { "aria-label": "Current color is " + e3.currentColor }, on: { click: e3.clickCurrentColor } })]), e3._v(" "), n2("div", { staticClass: "vc-ps-previews__label" }, [e3._v(e3._s(e3.currentLabel))])]), e3._v(" "), e3.disableFields ? e3._e() : n2("div", { staticClass: "vc-ps-actions" }, [n2("div", { staticClass: "vc-ps-ac-btn", attrs: { role: "button", "aria-label": e3.acceptLabel }, on: { click: e3.handleAccept } }, [e3._v(e3._s(e3.acceptLabel))]), e3._v(" "), n2("div", { staticClass: "vc-ps-ac-btn", attrs: { role: "button", "aria-label": e3.cancelLabel }, on: { click: e3.handleCancel } }, [e3._v(e3._s(e3.cancelLabel))]), e3._v(" "), n2("div", { staticClass: "vc-ps-fields" }, [n2("ed-in", { attrs: { label: "h", desc: "°", value: e3.hsv.h }, on: { change: e3.inputChange } }), e3._v(" "), n2("ed-in", { attrs: { label: "s", desc: "%", value: e3.hsv.s, max: 100 }, on: { change: e3.inputChange } }), e3._v(" "), n2("ed-in", { attrs: { label: "v", desc: "%", value: e3.hsv.v, max: 100 }, on: { change: e3.inputChange } }), e3._v(" "), n2("div", { staticClass: "vc-ps-fields__divider" }), e3._v(" "), n2("ed-in", { attrs: { label: "r", value: e3.colors.rgba.r }, on: { change: e3.inputChange } }), e3._v(" "), n2("ed-in", { attrs: { label: "g", value: e3.colors.rgba.g }, on: { change: e3.inputChange } }), e3._v(" "), n2("ed-in", { attrs: { label: "b", value: e3.colors.rgba.b }, on: { change: e3.inputChange } }), e3._v(" "), n2("div", { staticClass: "vc-ps-fields__divider" }), e3._v(" "), n2("ed-in", { staticClass: "vc-ps-fields__hex", attrs: { label: "#", value: e3.hex }, on: { change: e3.inputChange } })], 1), e3._v(" "), e3.hasResetButton ? n2("div", { staticClass: "vc-ps-ac-btn", attrs: { "aria-label": "reset" }, on: { click: e3.handleReset } }, [e3._v(e3._s(e3.resetLabel))]) : e3._e()])])])]);
        }, i = [];
        r._withStripped = true;
        var o = { render: r, staticRenderFns: i };
        t2.a = o;
      }, function(e2, t2, n) {
        function r(e3) {
          n(136);
        }
        Object.defineProperty(t2, "__esModule", { value: true });
        var i = n(57), o = n.n(i);
        for (var a in i) "default" !== a && function(e3) {
          n.d(t2, e3, function() {
            return i[e3];
          });
        }(a);
        var s = n(138), l = n(2), u = r, f = l(o.a, s.a, false, u, null, null);
        f.options.__file = "src/components/Sketch.vue", t2.default = f.exports;
      }, function(e2, t2, n) {
        var r = n(137);
        "string" == typeof r && (r = [[e2.i, r, ""]]), r.locals && (e2.exports = r.locals);
        n(1)("612c6604", r, false, {});
      }, function(e2, t2, n) {
        t2 = e2.exports = n(0)(false), t2.push([e2.i, "\n.vc-sketch {\n  position: relative;\n  width: 200px;\n  padding: 10px 10px 0;\n  box-sizing: initial;\n  background: #fff;\n  border-radius: 4px;\n  box-shadow: 0 0 0 1px rgba(0, 0, 0, .15), 0 8px 16px rgba(0, 0, 0, .15);\n}\n.vc-sketch-saturation-wrap {\n  width: 100%;\n  padding-bottom: 75%;\n  position: relative;\n  overflow: hidden;\n}\n.vc-sketch-controls {\n  display: flex;\n}\n.vc-sketch-sliders {\n  padding: 4px 0;\n  flex: 1;\n}\n.vc-sketch-sliders .vc-hue,\n.vc-sketch-sliders .vc-alpha-gradient {\n  border-radius: 2px;\n}\n.vc-sketch-hue-wrap {\n  position: relative;\n  height: 10px;\n}\n.vc-sketch-alpha-wrap {\n  position: relative;\n  height: 10px;\n  margin-top: 4px;\n  overflow: hidden;\n}\n.vc-sketch-color-wrap {\n  width: 24px;\n  height: 24px;\n  position: relative;\n  margin-top: 4px;\n  margin-left: 4px;\n  border-radius: 3px;\n}\n.vc-sketch-active-color {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  border-radius: 2px;\n  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .15), inset 0 0 4px rgba(0, 0, 0, .25);\n  z-index: 2;\n}\n.vc-sketch-color-wrap .vc-checkerboard {\n  background-size: auto;\n}\n.vc-sketch-field {\n  display: flex;\n  padding-top: 4px;\n}\n.vc-sketch-field .vc-input__input {\n  width: 90%;\n  padding: 4px 0 3px 10%;\n  border: none;\n  box-shadow: inset 0 0 0 1px #ccc;\n  font-size: 10px;\n}\n.vc-sketch-field .vc-input__label {\n  display: block;\n  text-align: center;\n  font-size: 11px;\n  color: #222;\n  padding-top: 3px;\n  padding-bottom: 4px;\n  text-transform: capitalize;\n}\n.vc-sketch-field--single {\n  flex: 1;\n  padding-left: 6px;\n}\n.vc-sketch-field--double {\n  flex: 2;\n}\n.vc-sketch-presets {\n  margin-right: -10px;\n  margin-left: -10px;\n  padding-left: 10px;\n  padding-top: 10px;\n  border-top: 1px solid #eee;\n}\n.vc-sketch-presets-color {\n  border-radius: 3px;\n  overflow: hidden;\n  position: relative;\n  display: inline-block;\n  margin: 0 10px 10px 0;\n  vertical-align: top;\n  cursor: pointer;\n  width: 16px;\n  height: 16px;\n  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .15);\n}\n.vc-sketch-presets-color .vc-checkerboard {\n  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .15);\n  border-radius: 3px;\n}\n.vc-sketch__disable-alpha .vc-sketch-color-wrap {\n  height: 10px;\n}\n", ""]);
      }, function(e2, t2, n) {
        var r = function() {
          var e3 = this, t3 = e3.$createElement, n2 = e3._self._c || t3;
          return n2("div", { class: ["vc-sketch", e3.disableAlpha ? "vc-sketch__disable-alpha" : ""], attrs: { role: "application", "aria-label": "Sketch color picker" } }, [n2("div", { staticClass: "vc-sketch-saturation-wrap" }, [n2("saturation", { on: { change: e3.childChange }, model: { value: e3.colors, callback: function(t4) {
            e3.colors = t4;
          }, expression: "colors" } })], 1), e3._v(" "), n2("div", { staticClass: "vc-sketch-controls" }, [n2("div", { staticClass: "vc-sketch-sliders" }, [n2("div", { staticClass: "vc-sketch-hue-wrap" }, [n2("hue", { on: { change: e3.childChange }, model: { value: e3.colors, callback: function(t4) {
            e3.colors = t4;
          }, expression: "colors" } })], 1), e3._v(" "), e3.disableAlpha ? e3._e() : n2("div", { staticClass: "vc-sketch-alpha-wrap" }, [n2("alpha", { on: { change: e3.childChange }, model: { value: e3.colors, callback: function(t4) {
            e3.colors = t4;
          }, expression: "colors" } })], 1)]), e3._v(" "), n2("div", { staticClass: "vc-sketch-color-wrap" }, [n2("div", { staticClass: "vc-sketch-active-color", style: { background: e3.activeColor }, attrs: { "aria-label": "Current color is " + e3.activeColor } }), e3._v(" "), n2("checkboard")], 1)]), e3._v(" "), e3.disableFields ? e3._e() : n2("div", { staticClass: "vc-sketch-field" }, [n2("div", { staticClass: "vc-sketch-field--double" }, [n2("ed-in", { attrs: { label: "hex", value: e3.hex }, on: { change: e3.inputChange } })], 1), e3._v(" "), n2("div", { staticClass: "vc-sketch-field--single" }, [n2("ed-in", { attrs: { label: "r", value: e3.colors.rgba.r }, on: { change: e3.inputChange } })], 1), e3._v(" "), n2("div", { staticClass: "vc-sketch-field--single" }, [n2("ed-in", { attrs: { label: "g", value: e3.colors.rgba.g }, on: { change: e3.inputChange } })], 1), e3._v(" "), n2("div", { staticClass: "vc-sketch-field--single" }, [n2("ed-in", { attrs: { label: "b", value: e3.colors.rgba.b }, on: { change: e3.inputChange } })], 1), e3._v(" "), e3.disableAlpha ? e3._e() : n2("div", { staticClass: "vc-sketch-field--single" }, [n2("ed-in", { attrs: { label: "a", value: e3.colors.a, "arrow-offset": 0.01, max: 1 }, on: { change: e3.inputChange } })], 1)]), e3._v(" "), n2("div", { staticClass: "vc-sketch-presets", attrs: { role: "group", "aria-label": "A color preset, pick one to set as current color" } }, [e3._l(e3.presetColors, function(t4) {
            return [e3.isTransparent(t4) ? n2("div", { key: t4, staticClass: "vc-sketch-presets-color", attrs: { "aria-label": "Color:" + t4 }, on: { click: function(n3) {
              return e3.handlePreset(t4);
            } } }, [n2("checkboard")], 1) : n2("div", { key: t4, staticClass: "vc-sketch-presets-color", style: { background: t4 }, attrs: { "aria-label": "Color:" + t4 }, on: { click: function(n3) {
              return e3.handlePreset(t4);
            } } })];
          })], 2)]);
        }, i = [];
        r._withStripped = true;
        var o = { render: r, staticRenderFns: i };
        t2.a = o;
      }, function(e2, t2, n) {
        function r(e3) {
          n(140);
        }
        Object.defineProperty(t2, "__esModule", { value: true });
        var i = n(58), o = n.n(i);
        for (var a in i) "default" !== a && function(e3) {
          n.d(t2, e3, function() {
            return i[e3];
          });
        }(a);
        var s = n(142), l = n(2), u = r, f = l(o.a, s.a, false, u, null, null);
        f.options.__file = "src/components/Chrome.vue", t2.default = f.exports;
      }, function(e2, t2, n) {
        var r = n(141);
        "string" == typeof r && (r = [[e2.i, r, ""]]), r.locals && (e2.exports = r.locals);
        n(1)("1cd16048", r, false, {});
      }, function(e2, t2, n) {
        t2 = e2.exports = n(0)(false), t2.push([e2.i, "\n.vc-chrome {\n  background: #fff;\n  border-radius: 2px;\n  box-shadow: 0 0 2px rgba(0,0,0,.3), 0 4px 8px rgba(0,0,0,.3);\n  box-sizing: initial;\n  width: 225px;\n  font-family: Menlo;\n  background-color: #fff;\n}\n.vc-chrome-controls {\n  display: flex;\n}\n.vc-chrome-color-wrap {\n  position: relative;\n  width: 36px;\n}\n.vc-chrome-active-color {\n  position: relative;\n  width: 30px;\n  height: 30px;\n  border-radius: 15px;\n  overflow: hidden;\n  z-index: 1;\n}\n.vc-chrome-color-wrap .vc-checkerboard {\n  width: 30px;\n  height: 30px;\n  border-radius: 15px;\n  background-size: auto;\n}\n.vc-chrome-sliders {\n  flex: 1;\n}\n.vc-chrome-fields-wrap {\n  display: flex;\n  padding-top: 16px;\n}\n.vc-chrome-fields {\n  display: flex;\n  margin-left: -6px;\n  flex: 1;\n}\n.vc-chrome-field {\n  padding-left: 6px;\n  width: 100%;\n}\n.vc-chrome-toggle-btn {\n  width: 32px;\n  text-align: right;\n  position: relative;\n}\n.vc-chrome-toggle-icon {\n  margin-right: -4px;\n  margin-top: 12px;\n  cursor: pointer;\n  position: relative;\n  z-index: 2;\n}\n.vc-chrome-toggle-icon-highlight {\n  position: absolute;\n  width: 24px;\n  height: 28px;\n  background: #eee;\n  border-radius: 4px;\n  top: 10px;\n  left: 12px;\n}\n.vc-chrome-hue-wrap {\n  position: relative;\n  height: 10px;\n  margin-bottom: 8px;\n}\n.vc-chrome-alpha-wrap {\n  position: relative;\n  height: 10px;\n}\n.vc-chrome-hue-wrap .vc-hue {\n  border-radius: 2px;\n}\n.vc-chrome-alpha-wrap .vc-alpha-gradient {\n  border-radius: 2px;\n}\n.vc-chrome-hue-wrap .vc-hue-picker, .vc-chrome-alpha-wrap .vc-alpha-picker {\n  width: 12px;\n  height: 12px;\n  border-radius: 6px;\n  transform: translate(-6px, -2px);\n  background-color: rgb(248, 248, 248);\n  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.37);\n}\n.vc-chrome-body {\n  padding: 16px 16px 12px;\n  background-color: #fff;\n}\n.vc-chrome-saturation-wrap {\n  width: 100%;\n  padding-bottom: 55%;\n  position: relative;\n  border-radius: 2px 2px 0 0;\n  overflow: hidden;\n}\n.vc-chrome-saturation-wrap .vc-saturation-circle {\n  width: 12px;\n  height: 12px;\n}\n.vc-chrome-fields .vc-input__input {\n  font-size: 11px;\n  color: #333;\n  width: 100%;\n  border-radius: 2px;\n  border: none;\n  box-shadow: inset 0 0 0 1px #dadada;\n  height: 21px;\n  text-align: center;\n}\n.vc-chrome-fields .vc-input__label {\n  text-transform: uppercase;\n  font-size: 11px;\n  line-height: 11px;\n  color: #969696;\n  text-align: center;\n  display: block;\n  margin-top: 12px;\n}\n.vc-chrome__disable-alpha .vc-chrome-active-color {\n  width: 18px;\n  height: 18px;\n}\n.vc-chrome__disable-alpha .vc-chrome-color-wrap {\n  width: 30px;\n}\n.vc-chrome__disable-alpha .vc-chrome-hue-wrap {\n  margin-top: 4px;\n  margin-bottom: 4px;\n}\n", ""]);
      }, function(e2, t2, n) {
        var r = function() {
          var e3 = this, t3 = e3.$createElement, n2 = e3._self._c || t3;
          return n2("div", { class: ["vc-chrome", e3.disableAlpha ? "vc-chrome__disable-alpha" : ""], attrs: { role: "application", "aria-label": "Chrome color picker" } }, [n2("div", { staticClass: "vc-chrome-saturation-wrap" }, [n2("saturation", { on: { change: e3.childChange }, model: { value: e3.colors, callback: function(t4) {
            e3.colors = t4;
          }, expression: "colors" } })], 1), e3._v(" "), n2("div", { staticClass: "vc-chrome-body" }, [n2("div", { staticClass: "vc-chrome-controls" }, [n2("div", { staticClass: "vc-chrome-color-wrap" }, [n2("div", { staticClass: "vc-chrome-active-color", style: { background: e3.activeColor }, attrs: { "aria-label": "current color is " + e3.colors.hex } }), e3._v(" "), e3.disableAlpha ? e3._e() : n2("checkboard")], 1), e3._v(" "), n2("div", { staticClass: "vc-chrome-sliders" }, [n2("div", { staticClass: "vc-chrome-hue-wrap" }, [n2("hue", { on: { change: e3.childChange }, model: { value: e3.colors, callback: function(t4) {
            e3.colors = t4;
          }, expression: "colors" } })], 1), e3._v(" "), e3.disableAlpha ? e3._e() : n2("div", { staticClass: "vc-chrome-alpha-wrap" }, [n2("alpha", { on: { change: e3.childChange }, model: { value: e3.colors, callback: function(t4) {
            e3.colors = t4;
          }, expression: "colors" } })], 1)])]), e3._v(" "), e3.disableFields ? e3._e() : n2("div", { staticClass: "vc-chrome-fields-wrap" }, [n2("div", { directives: [{ name: "show", rawName: "v-show", value: 0 === e3.fieldsIndex, expression: "fieldsIndex === 0" }], staticClass: "vc-chrome-fields" }, [n2("div", { staticClass: "vc-chrome-field" }, [e3.hasAlpha ? e3._e() : n2("ed-in", { attrs: { label: "hex", value: e3.colors.hex }, on: { change: e3.inputChange } }), e3._v(" "), e3.hasAlpha ? n2("ed-in", { attrs: { label: "hex", value: e3.colors.hex8 }, on: { change: e3.inputChange } }) : e3._e()], 1)]), e3._v(" "), n2("div", { directives: [{ name: "show", rawName: "v-show", value: 1 === e3.fieldsIndex, expression: "fieldsIndex === 1" }], staticClass: "vc-chrome-fields" }, [n2("div", { staticClass: "vc-chrome-field" }, [n2("ed-in", { attrs: { label: "r", value: e3.colors.rgba.r }, on: { change: e3.inputChange } })], 1), e3._v(" "), n2("div", { staticClass: "vc-chrome-field" }, [n2("ed-in", { attrs: { label: "g", value: e3.colors.rgba.g }, on: { change: e3.inputChange } })], 1), e3._v(" "), n2("div", { staticClass: "vc-chrome-field" }, [n2("ed-in", { attrs: { label: "b", value: e3.colors.rgba.b }, on: { change: e3.inputChange } })], 1), e3._v(" "), e3.disableAlpha ? e3._e() : n2("div", { staticClass: "vc-chrome-field" }, [n2("ed-in", { attrs: { label: "a", value: e3.colors.a, "arrow-offset": 0.01, max: 1 }, on: { change: e3.inputChange } })], 1)]), e3._v(" "), n2("div", { directives: [{ name: "show", rawName: "v-show", value: 2 === e3.fieldsIndex, expression: "fieldsIndex === 2" }], staticClass: "vc-chrome-fields" }, [n2("div", { staticClass: "vc-chrome-field" }, [n2("ed-in", { attrs: { label: "h", value: e3.hsl.h }, on: { change: e3.inputChange } })], 1), e3._v(" "), n2("div", { staticClass: "vc-chrome-field" }, [n2("ed-in", { attrs: { label: "s", value: e3.hsl.s }, on: { change: e3.inputChange } })], 1), e3._v(" "), n2("div", { staticClass: "vc-chrome-field" }, [n2("ed-in", { attrs: { label: "l", value: e3.hsl.l }, on: { change: e3.inputChange } })], 1), e3._v(" "), e3.disableAlpha ? e3._e() : n2("div", { staticClass: "vc-chrome-field" }, [n2("ed-in", { attrs: { label: "a", value: e3.colors.a, "arrow-offset": 0.01, max: 1 }, on: { change: e3.inputChange } })], 1)]), e3._v(" "), n2("div", { staticClass: "vc-chrome-toggle-btn", attrs: { role: "button", "aria-label": "Change another color definition" }, on: { click: e3.toggleViews } }, [n2("div", { staticClass: "vc-chrome-toggle-icon" }, [n2("svg", { staticStyle: { width: "24px", height: "24px" }, attrs: { viewBox: "0 0 24 24" }, on: { mouseover: e3.showHighlight, mouseenter: e3.showHighlight, mouseout: e3.hideHighlight } }, [n2("path", { attrs: { fill: "#333", d: "M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z" } })])]), e3._v(" "), n2("div", { directives: [{ name: "show", rawName: "v-show", value: e3.highlight, expression: "highlight" }], staticClass: "vc-chrome-toggle-icon-highlight" })])])])]);
        }, i = [];
        r._withStripped = true;
        var o = { render: r, staticRenderFns: i };
        t2.a = o;
      }, function(e2, t2, n) {
        function r(e3) {
          n(144);
        }
        Object.defineProperty(t2, "__esModule", { value: true });
        var i = n(59), o = n.n(i);
        for (var a in i) "default" !== a && function(e3) {
          n.d(t2, e3, function() {
            return i[e3];
          });
        }(a);
        var s = n(146), l = n(2), u = r, f = l(o.a, s.a, false, u, null, null);
        f.options.__file = "src/components/Twitter.vue", t2.default = f.exports;
      }, function(e2, t2, n) {
        var r = n(145);
        "string" == typeof r && (r = [[e2.i, r, ""]]), r.locals && (e2.exports = r.locals);
        n(1)("669a48a5", r, false, {});
      }, function(e2, t2, n) {
        t2 = e2.exports = n(0)(false), t2.push([e2.i, "\n.vc-twitter {\n  background: #fff;\n  border: 0 solid rgba(0,0,0,0.25);\n  box-shadow: 0 1px 4px rgba(0,0,0,0.25);\n  border-radius: 4px;\n  position: relative;\n}\n.vc-twitter-triangle {\n  width: 0px;\n  height: 0px;\n  border-style: solid;\n  border-width: 0 9px 10px 9px;\n  border-color: transparent transparent #fff transparent;\n  position: absolute;\n}\n.vc-twitter-triangle-shadow {\n  width: 0px;\n  height: 0px;\n  border-style: solid;\n  border-width: 0 9px 10px 9px;\n  border-color: transparent transparent rgba(0, 0, 0, .1) transparent;\n  position: absolute;\n}\n.vc-twitter-body {\n  padding: 15px 9px 9px 15px;\n}\n.vc-twitter .vc-editable-input {\n  position: relative;\n}\n.vc-twitter .vc-editable-input input {\n  width: 100px;\n  font-size: 14px;\n  color: #666;\n  border: 0px;\n  outline: none;\n  height: 28px;\n  box-shadow: inset 0 0 0 1px #F0F0F0;\n  box-sizing: content-box;\n  border-radius: 0 4px 4px 0;\n  float: left;\n  padding: 1px;\n  padding-left: 8px;\n}\n.vc-twitter .vc-editable-input span {\n  display: none;\n}\n.vc-twitter-hash {\n  background: #F0F0F0;\n  height: 30px;\n  width: 30px;\n  border-radius: 4px 0 0 4px;\n  float: left;\n  color: #98A1A4;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.vc-twitter-swatch {\n  width: 30px;\n  height: 30px;\n  float: left;\n  border-radius: 4px;\n  margin: 0 6px 6px 0;\n  cursor: pointer;\n  position: relative;\n  outline: none;\n}\n.vc-twitter-clear {\n  clear: both;\n}\n.vc-twitter-hide-triangle .vc-twitter-triangle {\n  display: none;\n}\n.vc-twitter-hide-triangle .vc-twitter-triangle-shadow {\n  display: none;\n}\n.vc-twitter-top-left-triangle .vc-twitter-triangle{\n  top: -10px;\n  left: 12px;\n}\n.vc-twitter-top-left-triangle .vc-twitter-triangle-shadow{\n  top: -11px;\n  left: 12px;\n}\n.vc-twitter-top-right-triangle .vc-twitter-triangle{\n  top: -10px;\n  right: 12px;\n}\n.vc-twitter-top-right-triangle .vc-twitter-triangle-shadow{\n  top: -11px;\n  right: 12px;\n}\n", ""]);
      }, function(e2, t2, n) {
        var r = function() {
          var e3 = this, t3 = e3.$createElement, n2 = e3._self._c || t3;
          return n2("div", { staticClass: "vc-twitter", class: { "vc-twitter-hide-triangle ": "hide" === e3.triangle, "vc-twitter-top-left-triangle ": "top-left" === e3.triangle, "vc-twitter-top-right-triangle ": "top-right" === e3.triangle }, style: { width: "number" == typeof e3.width ? e3.width + "px" : e3.width } }, [n2("div", { staticClass: "vc-twitter-triangle-shadow" }), e3._v(" "), n2("div", { staticClass: "vc-twitter-triangle" }), e3._v(" "), n2("div", { staticClass: "vc-twitter-body" }, [e3._l(e3.defaultColors, function(t4, r2) {
            return n2("span", { key: r2, staticClass: "vc-twitter-swatch", style: { background: t4, boxShadow: "0 0 4px " + (e3.equal(t4) ? t4 : "transparent") }, on: { click: function(n3) {
              return e3.handlerClick(t4);
            } } });
          }), e3._v(" "), n2("div", { staticClass: "vc-twitter-hash" }, [e3._v("#")]), e3._v(" "), n2("editable-input", { attrs: { label: "#", value: e3.hex }, on: { change: e3.inputChange } }), e3._v(" "), n2("div", { staticClass: "vc-twitter-clear" })], 2)]);
        }, i = [];
        r._withStripped = true;
        var o = { render: r, staticRenderFns: i };
        t2.a = o;
      }]);
    });
  })(vueColor_min$1);
  return vueColor_min$1.exports;
}
requireVueColor_min();
register(t1);
register(t32);
({
  props: {
    /**
     * The text of show more button.
     *
     * Expected to be in the form "More {itemName} …"
     */
    showMoreLabel: {
      default: t("More items …")
    }
  }
});
var emojiMart$1 = { exports: {} };
var emojiMart = emojiMart$1.exports;
var hasRequiredEmojiMart;
function requireEmojiMart() {
  if (hasRequiredEmojiMart) return emojiMart$1.exports;
  hasRequiredEmojiMart = 1;
  (function(module, exports) {
    !function(e2, t2) {
      module.exports = t2();
    }("undefined" != typeof self ? self : emojiMart, function() {
      return function() {
        var e2 = { 537: function() {
          "undefined" != typeof window && function() {
            for (var e3 = 0, t3 = ["ms", "moz", "webkit", "o"], i2 = 0; i2 < t3.length && !window.requestAnimationFrame; ++i2) window.requestAnimationFrame = window[t3[i2] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[t3[i2] + "CancelAnimationFrame"] || window[t3[i2] + "CancelRequestAnimationFrame"];
            window.requestAnimationFrame || (window.requestAnimationFrame = function(t4, i3) {
              var n2 = (/* @__PURE__ */ new Date()).getTime(), r = Math.max(0, 16 - (n2 - e3)), o = window.setTimeout(function() {
                t4(n2 + r);
              }, r);
              return e3 = n2 + r, o;
            }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(e4) {
              clearTimeout(e4);
            });
          }();
        } }, t2 = {};
        function i(n2) {
          var r = t2[n2];
          if (void 0 !== r) return r.exports;
          var o = t2[n2] = { exports: {} };
          return e2[n2](o, o.exports, i), o.exports;
        }
        i.d = function(e3, t3) {
          for (var n2 in t3) i.o(t3, n2) && !i.o(e3, n2) && Object.defineProperty(e3, n2, { enumerable: true, get: t3[n2] });
        }, i.o = function(e3, t3) {
          return Object.prototype.hasOwnProperty.call(e3, t3);
        }, i.r = function(e3) {
          "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e3, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e3, "__esModule", { value: true });
        };
        var n = {};
        return function() {
          i.r(n), i.d(n, { Anchors: function() {
            return k;
          }, Category: function() {
            return X;
          }, Emoji: function() {
            return J;
          }, EmojiData: function() {
            return N;
          }, EmojiIndex: function() {
            return R;
          }, EmojiView: function() {
            return $;
          }, Picker: function() {
            return se;
          }, Preview: function() {
            return G;
          }, Search: function() {
            return Q;
          }, Skins: function() {
            return Z;
          }, frequently: function() {
            return w;
          }, sanitize: function() {
            return D;
          }, store: function() {
            return c;
          }, uncompress: function() {
            return v;
          } });
          var e3, t3, r = "emoji-mart", o = JSON, s = "undefined" != typeof window && "localStorage" in window;
          function a(e4, i2) {
            if (t3) t3(e4, i2);
            else {
              if (!s) return;
              try {
                window.localStorage["".concat(r, ".").concat(e4)] = o.stringify(i2);
              } catch (e5) {
              }
            }
          }
          var c = { update: function(e4) {
            for (var t4 in e4) a(t4, e4[t4]);
          }, set: a, get: function(t4) {
            if (e3) return e3(t4);
            if (s) {
              try {
                var i2 = window.localStorage["".concat(r, ".").concat(t4)];
              } catch (e4) {
                return;
              }
              return i2 ? JSON.parse(i2) : void 0;
            }
          }, setNamespace: function(e4) {
            r = e4;
          }, setHandlers: function(i2) {
            i2 || (i2 = {}), e3 = i2.getter, t3 = i2.setter;
          } };
          function u(e4) {
            return u = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e5) {
              return typeof e5;
            } : function(e5) {
              return e5 && "function" == typeof Symbol && e5.constructor === Symbol && e5 !== Symbol.prototype ? "symbol" : typeof e5;
            }, u(e4);
          }
          function l(e4, t4) {
            (null == t4 || t4 > e4.length) && (t4 = e4.length);
            for (var i2 = 0, n2 = new Array(t4); i2 < t4; i2++) n2[i2] = e4[i2];
            return n2;
          }
          var h2 = { name: "a", unified: "b", non_qualified: "c", has_img_apple: "d", has_img_google: "e", has_img_twitter: "f", has_img_facebook: "h", keywords: "j", sheet: "k", emoticons: "l", text: "m", short_names: "n", added_in: "o" }, m = function(e4) {
            var t4 = [], i2 = function(e5, i3) {
              e5 && (Array.isArray(e5) ? e5 : [e5]).forEach(function(e6) {
                (i3 ? e6.split(/[-|_|\s]+/) : [e6]).forEach(function(e7) {
                  e7 = e7.toLowerCase(), -1 == t4.indexOf(e7) && t4.push(e7);
                });
              });
            };
            return i2(e4.short_names, true), i2(e4.name, true), i2(e4.keywords, false), i2(e4.emoticons, false), t4.join(",");
          };
          function d(e4) {
            var t4, i2 = function(e5, t9) {
              var i3 = "undefined" != typeof Symbol && e5[Symbol.iterator] || e5["@@iterator"];
              if (!i3) {
                if (Array.isArray(e5) || (i3 = function(e6, t10) {
                  if (e6) {
                    if ("string" == typeof e6) return l(e6, t10);
                    var i4 = Object.prototype.toString.call(e6).slice(8, -1);
                    return "Object" === i4 && e6.constructor && (i4 = e6.constructor.name), "Map" === i4 || "Set" === i4 ? Array.from(e6) : "Arguments" === i4 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i4) ? l(e6, t10) : void 0;
                  }
                }(e5)) || t9) {
                  i3 && (e5 = i3);
                  var n3 = 0, r3 = function() {
                  };
                  return { s: r3, n: function() {
                    return n3 >= e5.length ? { done: true } : { done: false, value: e5[n3++] };
                  }, e: function(e6) {
                    throw e6;
                  }, f: r3 };
                }
                throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
              }
              var o2, s2 = true, a2 = false;
              return { s: function() {
                i3 = i3.call(e5);
              }, n: function() {
                var e6 = i3.next();
                return s2 = e6.done, e6;
              }, e: function(e6) {
                a2 = true, o2 = e6;
              }, f: function() {
                try {
                  s2 || null == i3.return || i3.return();
                } finally {
                  if (a2) throw o2;
                }
              } };
            }(Object.getOwnPropertyNames(e4));
            try {
              for (i2.s(); !(t4 = i2.n()).done; ) {
                var n2 = t4.value, r2 = e4[n2];
                e4[n2] = r2 && "object" === u(r2) ? d(r2) : r2;
              }
            } catch (e5) {
              i2.e(e5);
            } finally {
              i2.f();
            }
            return Object.freeze(e4);
          }
          var f, p, v = function(e4) {
            if (!e4.compressed) return e4;
            for (var t4 in e4.compressed = false, e4.emojis) {
              var i2 = e4.emojis[t4];
              for (var n2 in h2) i2[n2] = i2[h2[n2]], delete i2[h2[n2]];
              i2.short_names || (i2.short_names = []), i2.short_names.unshift(t4), i2.sheet_x = i2.sheet[0], i2.sheet_y = i2.sheet[1], delete i2.sheet, i2.text || (i2.text = ""), i2.added_in || (i2.added_in = 6), i2.added_in = i2.added_in.toFixed(1), i2.search = m(i2);
            }
            return d(e4);
          }, j = ["+1", "grinning", "kissing_heart", "heart_eyes", "laughing", "stuck_out_tongue_winking_eye", "sweat_smile", "joy", "scream", "disappointed", "unamused", "weary", "sob", "sunglasses", "heart", "hankey"], g = {};
          function y() {
            p = true, f = c.get("frequently");
          }
          var w = { add: function(e4) {
            p || y();
            var t4 = e4.id;
            f || (f = g), f[t4] || (f[t4] = 0), f[t4] += 1, c.set("last", t4), c.set("frequently", f);
          }, get: function(e4) {
            if (p || y(), !f) {
              g = {};
              for (var t4 = [], i2 = Math.min(e4, j.length), n2 = 0; n2 < i2; n2++) g[j[n2]] = parseInt((i2 - n2) / 4, 10) + 1, t4.push(j[n2]);
              return t4;
            }
            var r2 = e4, o2 = [];
            for (var s2 in f) f.hasOwnProperty(s2) && o2.push(s2);
            var a2 = o2.sort(function(e5, t9) {
              return f[e5] - f[t9];
            }).reverse().slice(0, r2), u2 = c.get("last");
            return u2 && -1 == a2.indexOf(u2) && (a2.pop(), a2.push(u2)), a2;
          } }, _2 = { activity: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M12 0C5.373 0 0 5.372 0 12c0 6.627 5.373 12 12 12 6.628 0 12-5.373 12-12 0-6.628-5.372-12-12-12m9.949 11H17.05c.224-2.527 1.232-4.773 1.968-6.113A9.966 9.966 0 0 1 21.949 11M13 11V2.051a9.945 9.945 0 0 1 4.432 1.564c-.858 1.491-2.156 4.22-2.392 7.385H13zm-2 0H8.961c-.238-3.165-1.536-5.894-2.393-7.385A9.95 9.95 0 0 1 11 2.051V11zm0 2v8.949a9.937 9.937 0 0 1-4.432-1.564c.857-1.492 2.155-4.221 2.393-7.385H11zm4.04 0c.236 3.164 1.534 5.893 2.392 7.385A9.92 9.92 0 0 1 13 21.949V13h2.04zM4.982 4.887C5.718 6.227 6.726 8.473 6.951 11h-4.9a9.977 9.977 0 0 1 2.931-6.113M2.051 13h4.9c-.226 2.527-1.233 4.771-1.969 6.113A9.972 9.972 0 0 1 2.051 13m16.967 6.113c-.735-1.342-1.744-3.586-1.968-6.113h4.899a9.961 9.961 0 0 1-2.931 6.113"/></svg>', custom: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><g transform="translate(2.000000, 1.000000)"><rect id="Rectangle" x="8" y="0" width="3" height="21" rx="1.5"></rect><rect id="Rectangle" transform="translate(9.843, 10.549) rotate(60) translate(-9.843, -10.549) " x="8.343" y="0.049" width="3" height="21" rx="1.5"></rect><rect id="Rectangle" transform="translate(9.843, 10.549) rotate(-60) translate(-9.843, -10.549) " x="8.343" y="0.049" width="3" height="21" rx="1.5"></rect></g></svg>', flags: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M0 0l6.084 24H8L1.916 0zM21 5h-4l-1-4H4l3 12h3l1 4h13L21 5zM6.563 3h7.875l2 8H8.563l-2-8zm8.832 10l-2.856 1.904L12.063 13h3.332zM19 13l-1.5-6h1.938l2 8H16l3-2z"/></svg>', foods: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M17 4.978c-1.838 0-2.876.396-3.68.934.513-1.172 1.768-2.934 4.68-2.934a1 1 0 0 0 0-2c-2.921 0-4.629 1.365-5.547 2.512-.064.078-.119.162-.18.244C11.73 1.838 10.798.023 9.207.023 8.579.022 7.85.306 7 .978 5.027 2.54 5.329 3.902 6.492 4.999 3.609 5.222 0 7.352 0 12.969c0 4.582 4.961 11.009 9 11.009 1.975 0 2.371-.486 3-1 .629.514 1.025 1 3 1 4.039 0 9-6.418 9-11 0-5.953-4.055-8-7-8M8.242 2.546c.641-.508.943-.523.965-.523.426.169.975 1.405 1.357 3.055-1.527-.629-2.741-1.352-2.98-1.846.059-.112.241-.356.658-.686M15 21.978c-1.08 0-1.21-.109-1.559-.402l-.176-.146c-.367-.302-.816-.452-1.266-.452s-.898.15-1.266.452l-.176.146c-.347.292-.477.402-1.557.402-2.813 0-7-5.389-7-9.009 0-5.823 4.488-5.991 5-5.991 1.939 0 2.484.471 3.387 1.251l.323.276a1.995 1.995 0 0 0 2.58 0l.323-.276c.902-.78 1.447-1.251 3.387-1.251.512 0 5 .168 5 6 0 3.617-4.187 9-7 9"/></svg>', nature: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M15.5 8a1.5 1.5 0 1 0 .001 3.001A1.5 1.5 0 0 0 15.5 8M8.5 8a1.5 1.5 0 1 0 .001 3.001A1.5 1.5 0 0 0 8.5 8"/><path d="M18.933 0h-.027c-.97 0-2.138.787-3.018 1.497-1.274-.374-2.612-.51-3.887-.51-1.285 0-2.616.133-3.874.517C7.245.79 6.069 0 5.093 0h-.027C3.352 0 .07 2.67.002 7.026c-.039 2.479.276 4.238 1.04 5.013.254.258.882.677 1.295.882.191 3.177.922 5.238 2.536 6.38.897.637 2.187.949 3.2 1.102C8.04 20.6 8 20.795 8 21c0 1.773 2.35 3 4 3 1.648 0 4-1.227 4-3 0-.201-.038-.393-.072-.586 2.573-.385 5.435-1.877 5.925-7.587.396-.22.887-.568 1.104-.788.763-.774 1.079-2.534 1.04-5.013C23.929 2.67 20.646 0 18.933 0M3.223 9.135c-.237.281-.837 1.155-.884 1.238-.15-.41-.368-1.349-.337-3.291.051-3.281 2.478-4.972 3.091-5.031.256.015.731.27 1.265.646-1.11 1.171-2.275 2.915-2.352 5.125-.133.546-.398.858-.783 1.313M12 22c-.901 0-1.954-.693-2-1 0-.654.475-1.236 1-1.602V20a1 1 0 1 0 2 0v-.602c.524.365 1 .947 1 1.602-.046.307-1.099 1-2 1m3-3.48v.02a4.752 4.752 0 0 0-1.262-1.02c1.092-.516 2.239-1.334 2.239-2.217 0-1.842-1.781-2.195-3.977-2.195-2.196 0-3.978.354-3.978 2.195 0 .883 1.148 1.701 2.238 2.217A4.8 4.8 0 0 0 9 18.539v-.025c-1-.076-2.182-.281-2.973-.842-1.301-.92-1.838-3.045-1.853-6.478l.023-.041c.496-.826 1.49-1.45 1.804-3.102 0-2.047 1.357-3.631 2.362-4.522C9.37 3.178 10.555 3 11.948 3c1.447 0 2.685.192 3.733.57 1 .9 2.316 2.465 2.316 4.48.313 1.651 1.307 2.275 1.803 3.102.035.058.068.117.102.178-.059 5.967-1.949 7.01-4.902 7.19m6.628-8.202c-.037-.065-.074-.13-.113-.195a7.587 7.587 0 0 0-.739-.987c-.385-.455-.648-.768-.782-1.313-.076-2.209-1.241-3.954-2.353-5.124.531-.376 1.004-.63 1.261-.647.636.071 3.044 1.764 3.096 5.031.027 1.81-.347 3.218-.37 3.235"/></svg>', objects: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M12 0a9 9 0 0 0-5 16.482V21s2.035 3 5 3 5-3 5-3v-4.518A9 9 0 0 0 12 0zm0 2c3.86 0 7 3.141 7 7s-3.14 7-7 7-7-3.141-7-7 3.14-7 7-7zM9 17.477c.94.332 1.946.523 3 .523s2.06-.19 3-.523v.834c-.91.436-1.925.689-3 .689a6.924 6.924 0 0 1-3-.69v-.833zm.236 3.07A8.854 8.854 0 0 0 12 21c.965 0 1.888-.167 2.758-.451C14.155 21.173 13.153 22 12 22c-1.102 0-2.117-.789-2.764-1.453z"/><path d="M14.745 12.449h-.004c-.852-.024-1.188-.858-1.577-1.824-.421-1.061-.703-1.561-1.182-1.566h-.009c-.481 0-.783.497-1.235 1.537-.436.982-.801 1.811-1.636 1.791l-.276-.043c-.565-.171-.853-.691-1.284-1.794-.125-.313-.202-.632-.27-.913-.051-.213-.127-.53-.195-.634C7.067 9.004 7.039 9 6.99 9A1 1 0 0 1 7 7h.01c1.662.017 2.015 1.373 2.198 2.134.486-.981 1.304-2.058 2.797-2.075 1.531.018 2.28 1.153 2.731 2.141l.002-.008C14.944 8.424 15.327 7 16.979 7h.032A1 1 0 1 1 17 9h-.011c-.149.076-.256.474-.319.709a6.484 6.484 0 0 1-.311.951c-.429.973-.79 1.789-1.614 1.789"/></svg>', smileys: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10"/><path d="M8 7a2 2 0 1 0-.001 3.999A2 2 0 0 0 8 7M16 7a2 2 0 1 0-.001 3.999A2 2 0 0 0 16 7M15.232 15c-.693 1.195-1.87 2-3.349 2-1.477 0-2.655-.805-3.347-2H15m3-2H6a6 6 0 1 0 12 0"/></svg>', people: '<svg xmlns:svg="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24"> <path id="path3814" d="m 3.3591089,21.17726 c 0.172036,0.09385 4.265994,2.29837 8.8144451,2.29837 4.927767,0 8.670894,-2.211883 8.82782,-2.306019 0.113079,-0.06785 0.182268,-0.190051 0.182267,-0.321923 0,-3.03119 -0.929494,-5.804936 -2.617196,-7.810712 -1.180603,-1.403134 -2.661918,-2.359516 -4.295699,-2.799791 4.699118,-2.236258 3.102306,-9.28617162 -2.097191,-9.28617162 -5.1994978,0 -6.7963103,7.04991362 -2.097192,9.28617162 -1.6337821,0.440275 -3.1150971,1.396798 -4.2956991,2.799791 -1.687703,2.005776 -2.617196,4.779522 -2.617196,7.810712 1.2e-6,0.137378 0.075039,0.263785 0.195641,0.329572 z M 8.0439319,5.8308783 C 8.0439309,2.151521 12.492107,0.30955811 15.093491,2.9109411 17.694874,5.5123241 15.852911,9.9605006 12.173554,9.9605 9.8938991,9.9579135 8.0465186,8.1105332 8.0439319,5.8308783 Z m -1.688782,7.6894977 c 1.524535,-1.811449 3.5906601,-2.809035 5.8184041,-2.809035 2.227744,0 4.293869,0.997586 5.818404,2.809035 1.533639,1.822571 2.395932,4.339858 2.439152,7.108301 -0.803352,0.434877 -4.141636,2.096112 -8.257556,2.096112 -3.8062921,0 -7.3910861,-1.671043 -8.2573681,-2.104981 0.04505,-2.765017 0.906968,-5.278785 2.438964,-7.099432 z" /> <path id="path3816" d="M 12.173828 0.38867188 C 9.3198513 0.38867187 7.3770988 2.3672285 6.8652344 4.6308594 C 6.4218608 6.5916015 7.1153562 8.7676117 8.9648438 10.126953 C 7.6141249 10.677376 6.3550511 11.480944 5.3496094 12.675781 C 3.5629317 14.799185 2.6015625 17.701475 2.6015625 20.847656 C 2.6015654 21.189861 2.7894276 21.508002 3.0898438 21.671875 C 3.3044068 21.788925 7.4436239 24.039062 12.173828 24.039062 C 17.269918 24.039062 21.083568 21.776786 21.291016 21.652344 C 21.57281 21.483266 21.746097 21.176282 21.746094 20.847656 C 21.746094 17.701475 20.78277 14.799185 18.996094 12.675781 C 17.990455 11.480591 16.733818 10.675362 15.382812 10.125 C 17.231132 8.7655552 17.925675 6.5910701 17.482422 4.6308594 C 16.970557 2.3672285 15.027805 0.38867188 12.173828 0.38867188 z M 12.792969 2.3007812 C 13.466253 2.4161792 14.125113 2.7383941 14.695312 3.3085938 C 15.835712 4.4489931 15.985604 5.9473549 15.46875 7.1953125 C 14.951896 8.4432701 13.786828 9.3984378 12.173828 9.3984375 C 10.197719 9.3961954 8.607711 7.806187 8.6054688 5.8300781 C 8.6054683 4.2170785 9.5606362 3.0520102 10.808594 2.5351562 C 11.432573 2.2767293 12.119685 2.1853833 12.792969 2.3007812 z M 12.173828 11.273438 C 14.233647 11.273438 16.133674 12.185084 17.5625 13.882812 C 18.93069 15.508765 19.698347 17.776969 19.808594 20.283203 C 18.807395 20.800235 15.886157 22.162109 12.173828 22.162109 C 8.7614632 22.162109 5.6245754 20.787069 4.5390625 20.265625 C 4.6525896 17.766717 5.4203315 15.504791 6.7851562 13.882812 C 8.2139827 12.185084 10.11401 11.273438 12.173828 11.273438 z " /> </svg>', places: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M6.5 12C5.122 12 4 13.121 4 14.5S5.122 17 6.5 17 9 15.879 9 14.5 7.878 12 6.5 12m0 3c-.275 0-.5-.225-.5-.5s.225-.5.5-.5.5.225.5.5-.225.5-.5.5M17.5 12c-1.378 0-2.5 1.121-2.5 2.5s1.122 2.5 2.5 2.5 2.5-1.121 2.5-2.5-1.122-2.5-2.5-2.5m0 3c-.275 0-.5-.225-.5-.5s.225-.5.5-.5.5.225.5.5-.225.5-.5.5"/><path d="M22.482 9.494l-1.039-.346L21.4 9h.6c.552 0 1-.439 1-.992 0-.006-.003-.008-.003-.008H23c0-1-.889-2-1.984-2h-.642l-.731-1.717C19.262 3.012 18.091 2 16.764 2H7.236C5.909 2 4.738 3.012 4.357 4.283L3.626 6h-.642C1.889 6 1 7 1 8h.003S1 8.002 1 8.008C1 8.561 1.448 9 2 9h.6l-.043.148-1.039.346a2.001 2.001 0 0 0-1.359 2.097l.751 7.508a1 1 0 0 0 .994.901H3v1c0 1.103.896 2 2 2h2c1.104 0 2-.897 2-2v-1h6v1c0 1.103.896 2 2 2h2c1.104 0 2-.897 2-2v-1h1.096a.999.999 0 0 0 .994-.901l.751-7.508a2.001 2.001 0 0 0-1.359-2.097M6.273 4.857C6.402 4.43 6.788 4 7.236 4h9.527c.448 0 .834.43.963.857L19.313 9H4.688l1.585-4.143zM7 21H5v-1h2v1zm12 0h-2v-1h2v1zm2.189-3H2.811l-.662-6.607L3 11h18l.852.393L21.189 18z"/></svg>', recent: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M13 4h-2l-.001 7H9v2h2v2h2v-2h4v-2h-4z"/><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10"/></svg>', symbols: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M0 0h11v2H0zM4 11h3V6h4V4H0v2h4zM15.5 17c1.381 0 2.5-1.116 2.5-2.493s-1.119-2.493-2.5-2.493S13 13.13 13 14.507 14.119 17 15.5 17m0-2.986c.276 0 .5.222.5.493 0 .272-.224.493-.5.493s-.5-.221-.5-.493.224-.493.5-.493M21.5 19.014c-1.381 0-2.5 1.116-2.5 2.493S20.119 24 21.5 24s2.5-1.116 2.5-2.493-1.119-2.493-2.5-2.493m0 2.986a.497.497 0 0 1-.5-.493c0-.271.224-.493.5-.493s.5.222.5.493a.497.497 0 0 1-.5.493M22 13l-9 9 1.513 1.5 8.99-9.009zM17 11c2.209 0 4-1.119 4-2.5V2s.985-.161 1.498.949C23.01 4.055 23 6 23 6s1-1.119 1-3.135C24-.02 21 0 21 0h-2v6.347A5.853 5.853 0 0 0 17 6c-2.209 0-4 1.119-4 2.5s1.791 2.5 4 2.5M10.297 20.482l-1.475-1.585a47.54 47.54 0 0 1-1.442 1.129c-.307-.288-.989-1.016-2.045-2.183.902-.836 1.479-1.466 1.729-1.892s.376-.871.376-1.336c0-.592-.273-1.178-.818-1.759-.546-.581-1.329-.871-2.349-.871-1.008 0-1.79.293-2.344.879-.556.587-.832 1.181-.832 1.784 0 .813.419 1.748 1.256 2.805-.847.614-1.444 1.208-1.794 1.784a3.465 3.465 0 0 0-.523 1.833c0 .857.308 1.56.924 2.107.616.549 1.423.823 2.42.823 1.173 0 2.444-.379 3.813-1.137L8.235 24h2.819l-2.09-2.383 1.333-1.135zm-6.736-6.389a1.02 1.02 0 0 1 .73-.286c.31 0 .559.085.747.254a.849.849 0 0 1 .283.659c0 .518-.419 1.112-1.257 1.784-.536-.651-.805-1.231-.805-1.742a.901.901 0 0 1 .302-.669M3.74 22c-.427 0-.778-.116-1.057-.349-.279-.232-.418-.487-.418-.766 0-.594.509-1.288 1.527-2.083.968 1.134 1.717 1.946 2.248 2.438-.921.507-1.686.76-2.3.76"/></svg>' };
          function b(e4, t4, i2, n2, r2, o2, s2, a2) {
            var c2, u2 = "function" == typeof e4 ? e4.options : e4;
            if (t4 && (u2.render = t4, u2.staticRenderFns = i2, u2._compiled = true), c2) ;
            return { exports: e4, options: u2 };
          }
          var C = b({ props: { i18n: { type: Object, required: true }, color: { type: String }, categories: { type: Array, required: true }, activeCategory: { type: Object, default: function() {
            return {};
          } } }, emits: ["click"], created: function() {
            this.svgs = _2;
          } }, function() {
            var e4 = this, t4 = e4._self._c;
            return t4("div", { staticClass: "emoji-mart-anchors", attrs: { role: "tablist" } }, e4._l(e4.categories, function(i2) {
              return t4("button", { key: i2.id, class: { "emoji-mart-anchor": true, "emoji-mart-anchor-selected": i2.id == e4.activeCategory.id }, style: { color: i2.id == e4.activeCategory.id ? e4.color : "" }, attrs: { role: "tab", type: "button", "aria-label": i2.name, "aria-selected": i2.id == e4.activeCategory.id, "data-title": e4.i18n.categories[i2.id] }, on: { click: function(t9) {
                return e4.$emit("click", i2);
              } } }, [t4("div", { attrs: { "aria-hidden": "true" }, domProps: { innerHTML: e4._s(e4.svgs[i2.id]) } }), e4._v(" "), t4("span", { staticClass: "emoji-mart-anchor-bar", style: { backgroundColor: e4.color }, attrs: { "aria-hidden": "true" } })]);
            }), 0);
          }, []), k = C.exports;
          function E(e4, t4) {
            if (!(e4 instanceof t4)) throw new TypeError("Cannot call a class as a function");
          }
          function S(e4) {
            var t4 = function(e5, t9) {
              if ("object" != u(e5) || !e5) return e5;
              var i2 = e5[Symbol.toPrimitive];
              if (void 0 !== i2) {
                var n2 = i2.call(e5, "string");
                if ("object" != u(n2)) return n2;
                throw new TypeError("@@toPrimitive must return a primitive value.");
              }
              return String(e5);
            }(e4);
            return "symbol" == u(t4) ? t4 : t4 + "";
          }
          function x(e4, t4) {
            for (var i2 = 0; i2 < t4.length; i2++) {
              var n2 = t4[i2];
              n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e4, S(n2.key), n2);
            }
          }
          function O(e4, t4, i2) {
            return t4 && x(e4.prototype, t4), Object.defineProperty(e4, "prototype", { writable: false }), e4;
          }
          var P = String.fromCodePoint || function() {
            var e4, t4, i2 = [], n2 = -1, r2 = arguments.length;
            if (!r2) return "";
            for (var o2 = ""; ++n2 < r2; ) {
              var s2 = Number(arguments[n2]);
              if (!isFinite(s2) || s2 < 0 || s2 > 1114111 || Math.floor(s2) != s2) throw RangeError("Invalid code point: " + s2);
              s2 <= 65535 ? i2.push(s2) : (e4 = 55296 + ((s2 -= 65536) >> 10), t4 = s2 % 1024 + 56320, i2.push(e4, t4)), (n2 + 1 === r2 || i2.length > 16384) && (o2 += String.fromCharCode.apply(null, i2), i2.length = 0);
            }
            return o2;
          };
          function A(e4) {
            var t4 = e4.split("-").map(function(e5) {
              return "0x".concat(e5);
            });
            return P.apply(null, t4);
          }
          function M(e4) {
            return e4.reduce(function(e5, t4) {
              return -1 === e5.indexOf(t4) && e5.push(t4), e5;
            }, []);
          }
          function I(e4, t4) {
            var i2 = M(e4), n2 = M(t4);
            return i2.filter(function(e5) {
              return n2.indexOf(e5) >= 0;
            });
          }
          function F(e4, t4) {
            var i2 = {};
            for (var n2 in e4) {
              var r2 = e4[n2], o2 = r2;
              Object.prototype.hasOwnProperty.call(t4, n2) && (o2 = t4[n2]), "object" === u(o2) && (o2 = F(r2, o2)), i2[n2] = o2;
            }
            return i2;
          }
          function z(e4, t4) {
            var i2 = "undefined" != typeof Symbol && e4[Symbol.iterator] || e4["@@iterator"];
            if (!i2) {
              if (Array.isArray(e4) || (i2 = function(e5, t9) {
                if (e5) {
                  if ("string" == typeof e5) return L(e5, t9);
                  var i3 = Object.prototype.toString.call(e5).slice(8, -1);
                  return "Object" === i3 && e5.constructor && (i3 = e5.constructor.name), "Map" === i3 || "Set" === i3 ? Array.from(e5) : "Arguments" === i3 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i3) ? L(e5, t9) : void 0;
                }
              }(e4)) || t4) {
                i2 && (e4 = i2);
                var n2 = 0, r2 = function() {
                };
                return { s: r2, n: function() {
                  return n2 >= e4.length ? { done: true } : { done: false, value: e4[n2++] };
                }, e: function(e5) {
                  throw e5;
                }, f: r2 };
              }
              throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            }
            var o2, s2 = true, a2 = false;
            return { s: function() {
              i2 = i2.call(e4);
            }, n: function() {
              var e5 = i2.next();
              return s2 = e5.done, e5;
            }, e: function(e5) {
              a2 = true, o2 = e5;
            }, f: function() {
              try {
                s2 || null == i2.return || i2.return();
              } finally {
                if (a2) throw o2;
              }
            } };
          }
          function L(e4, t4) {
            (null == t4 || t4 > e4.length) && (t4 = e4.length);
            for (var i2 = 0, n2 = new Array(t4); i2 < t4; i2++) n2[i2] = e4[i2];
            return n2;
          }
          var T = /^(?:\:([^\:]+)\:)(?:\:skin-tone-(\d)\:)?$/, q = ["1F3FA", "1F3FB", "1F3FC", "1F3FD", "1F3FE", "1F3FF"], R = function() {
            return O(function e4(t4) {
              var i2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, n2 = i2.emojisToShowFilter, r2 = i2.include, o2 = i2.exclude, s2 = i2.custom, a2 = i2.recent, c2 = i2.recentLength, u2 = void 0 === c2 ? 20 : c2;
              E(this, e4), this._data = v(t4), this._emojisFilter = n2 || null, this._include = r2 || null, this._exclude = o2 || null, this._custom = s2 || [], this._recent = a2 || w.get(u2), this._emojis = {}, this._nativeEmojis = {}, this._emoticons = {}, this._categories = [], this._recentCategory = { id: "recent", name: "Recent", emojis: [] }, this._customCategory = { id: "custom", name: "Custom", emojis: [] }, this._searchIndex = {}, this.buildIndex(), Object.freeze(this);
            }, [{ key: "buildIndex", value: function() {
              var e4 = this, t4 = this._data.categories;
              if (this._include && (t4 = (t4 = t4.filter(function(t9) {
                return e4._include.includes(t9.id);
              })).sort(function(t9, i3) {
                var n3 = e4._include.indexOf(t9.id), r3 = e4._include.indexOf(i3.id);
                return n3 < r3 ? -1 : n3 > r3 ? 1 : 0;
              })), t4.forEach(function(t9) {
                if (e4.isCategoryNeeded(t9.id)) {
                  var i3 = { id: t9.id, name: t9.name, emojis: [] };
                  t9.emojis.forEach(function(t10) {
                    var n3 = e4.addEmoji(t10);
                    n3 && i3.emojis.push(n3);
                  }), i3.emojis.length && e4._categories.push(i3);
                }
              }), this.isCategoryNeeded("custom")) {
                if (this._custom.length > 0) {
                  var i2, n2 = z(this._custom);
                  try {
                    for (n2.s(); !(i2 = n2.n()).done; ) {
                      var r2 = i2.value;
                      this.addCustomEmoji(r2);
                    }
                  } catch (e5) {
                    n2.e(e5);
                  } finally {
                    n2.f();
                  }
                }
                this._customCategory.emojis.length && this._categories.push(this._customCategory);
              }
              this.isCategoryNeeded("recent") && (this._recent.length && this._recent.map(function(t9) {
                var i3, n3 = z(e4._customCategory.emojis);
                try {
                  for (n3.s(); !(i3 = n3.n()).done; ) {
                    var r3 = i3.value;
                    if (r3.id === t9) return void e4._recentCategory.emojis.push(r3);
                  }
                } catch (e5) {
                  n3.e(e5);
                } finally {
                  n3.f();
                }
                e4.hasEmoji(t9) && e4._recentCategory.emojis.push(e4.emoji(t9));
              }), this._recentCategory.emojis.length && this._categories.unshift(this._recentCategory));
            } }, { key: "findEmoji", value: function(e4, t4) {
              var i2 = e4.match(T);
              if (i2 && (e4 = i2[1], i2[2] && (t4 = parseInt(i2[2], 10))), this._data.aliases.hasOwnProperty(e4) && (e4 = this._data.aliases[e4]), this._emojis.hasOwnProperty(e4)) {
                var n2 = this._emojis[e4];
                return t4 ? n2.getSkin(t4) : n2;
              }
              return this._nativeEmojis.hasOwnProperty(e4) ? this._nativeEmojis[e4] : null;
            } }, { key: "categories", value: function() {
              return this._categories;
            } }, { key: "emoji", value: function(e4) {
              this._data.aliases.hasOwnProperty(e4) && (e4 = this._data.aliases[e4]);
              var t4 = this._emojis[e4];
              if (!t4) throw new Error("Can not find emoji by id: " + e4);
              return t4;
            } }, { key: "firstEmoji", value: function() {
              var e4 = this._emojis[Object.keys(this._emojis)[0]];
              if (!e4) throw new Error("Can not get first emoji");
              return e4;
            } }, { key: "hasEmoji", value: function(e4) {
              return this._data.aliases.hasOwnProperty(e4) && (e4 = this._data.aliases[e4]), !!this._emojis[e4];
            } }, { key: "nativeEmoji", value: function(e4) {
              return this._nativeEmojis.hasOwnProperty(e4) ? this._nativeEmojis[e4] : null;
            } }, { key: "search", value: function(e4, t4) {
              var i2 = this;
              if (t4 || (t4 = 75), !e4.length) return null;
              if ("-" == e4 || "-1" == e4) return [this.emoji("-1")];
              var n2, r2 = e4.toLowerCase().split(/[\s|,|\-|_]+/);
              r2.length > 2 && (r2 = [r2[0], r2[1]]), n2 = r2.map(function(e5) {
                for (var t9 = i2._emojis, n3 = i2._searchIndex, r3 = 0, o3 = function() {
                  var i3 = e5[s2];
                  if (r3++, n3[i3] || (n3[i3] = {}), !(n3 = n3[i3]).results) {
                    var o4 = {};
                    for (var a2 in n3.results = [], n3.emojis = {}, t9) {
                      var c2 = t9[a2], u2 = c2._data.search, l2 = e5.substr(0, r3), h3 = u2.indexOf(l2);
                      if (-1 != h3) {
                        var m2 = h3 + 1;
                        l2 == a2 && (m2 = 0), n3.results.push(c2), n3.emojis[a2] = c2, o4[a2] = m2;
                      }
                    }
                    n3.results.sort(function(e6, t10) {
                      return o4[e6.id] - o4[t10.id];
                    });
                  }
                  t9 = n3.emojis;
                }, s2 = 0; s2 < e5.length; s2++) o3();
                return n3.results;
              }).filter(function(e5) {
                return e5;
              });
              var o2 = null;
              return (o2 = n2.length > 1 ? I.apply(null, n2) : n2.length ? n2[0] : []) && o2.length > t4 && (o2 = o2.slice(0, t4)), o2;
            } }, { key: "addCustomEmoji", value: function(e4) {
              var t4 = Object.assign({}, e4, { id: e4.short_names[0], custom: true });
              t4.search || (t4.search = m(t4));
              var i2 = new N(t4);
              return this._emojis[i2.id] = i2, this._customCategory.emojis.push(i2), i2;
            } }, { key: "addEmoji", value: function(e4) {
              var t4 = this, i2 = this._data.emojis[e4];
              if (!this.isEmojiNeeded(i2)) return false;
              var n2 = new N(i2);
              if (this._emojis[e4] = n2, n2.native && (this._nativeEmojis[n2.native] = n2), n2._skins) for (var r2 in n2._skins) {
                var o2 = n2._skins[r2];
                o2.native && (this._nativeEmojis[o2.native] = o2);
              }
              return n2.emoticons && n2.emoticons.forEach(function(i3) {
                t4._emoticons[i3] || (t4._emoticons[i3] = e4);
              }), n2;
            } }, { key: "isCategoryNeeded", value: function(e4) {
              var t4 = !this._include || !this._include.length || this._include.indexOf(e4) > -1, i2 = !(!this._exclude || !this._exclude.length) && this._exclude.indexOf(e4) > -1;
              return !(!t4 || i2);
            } }, { key: "isEmojiNeeded", value: function(e4) {
              return !this._emojisFilter || this._emojisFilter(e4);
            } }]);
          }(), N = function() {
            return O(function e4(t4) {
              if (E(this, e4), this._data = Object.assign({}, t4), this._skins = null, this._data.skin_variations) for (var i2 in this._skins = [], q) {
                var n2 = q[i2], r2 = this._data.skin_variations[n2], o2 = Object.assign({}, t4);
                for (var s2 in r2) o2[s2] = r2[s2];
                delete o2.skin_variations, o2.skin_tone = parseInt(i2) + 1, this._skins.push(new e4(o2));
              }
              for (var a2 in this._sanitized = D(this._data), this._sanitized) this[a2] = this._sanitized[a2];
              this.short_names = this._data.short_names, this.short_name = this._data.short_names[0], Object.freeze(this);
            }, [{ key: "getSkin", value: function(e4) {
              return e4 && "native" != e4 && this._skins ? this._skins[e4 - 1] : this;
            } }, { key: "getPosition", value: function() {
              var e4 = +(100 / 60 * this._data.sheet_x).toFixed(2), t4 = +(100 / 60 * this._data.sheet_y).toFixed(2);
              return "".concat(e4, "% ").concat(t4, "%");
            } }, { key: "ariaLabel", value: function() {
              return [this.native].concat(this.short_names).filter(Boolean).join(", ");
            } }]);
          }(), $ = function() {
            return O(function e4(t4, i2, n2, r2, o2, s2, a2) {
              E(this, e4), this._emoji = t4, this._native = r2, this._skin = i2, this._set = n2, this._fallback = o2, this.canRender = this._canRender(), this.cssClass = this._cssClass(), this.cssStyle = this._cssStyle(a2), this.content = this._content(), this.title = true === s2 ? t4.short_name : null, this.ariaLabel = t4.ariaLabel(), Object.freeze(this);
            }, [{ key: "getEmoji", value: function() {
              return this._emoji.getSkin(this._skin);
            } }, { key: "_canRender", value: function() {
              return this._isCustom() || this._isNative() || this._hasEmoji() || this._fallback;
            } }, { key: "_cssClass", value: function() {
              return ["emoji-set-" + this._set, "emoji-type-" + this._emojiType()];
            } }, { key: "_cssStyle", value: function(e4) {
              var t4 = {};
              return this._isCustom() ? t4 = { backgroundImage: "url(" + this.getEmoji()._data.imageUrl + ")", backgroundSize: "100%", width: e4 + "px", height: e4 + "px" } : this._hasEmoji() && !this._isNative() && (t4 = { backgroundPosition: this.getEmoji().getPosition() }), e4 && (t4 = this._isNative() ? Object.assign(t4, { fontSize: Math.round(0.95 * e4 * 10) / 10 + "px" }) : Object.assign(t4, { width: e4 + "px", height: e4 + "px" })), t4;
            } }, { key: "_content", value: function() {
              return this._isCustom() ? "" : this._isNative() ? this.getEmoji().native : this._hasEmoji() ? "" : this._fallback ? this._fallback(this.getEmoji()) : null;
            } }, { key: "_isNative", value: function() {
              return this._native;
            } }, { key: "_isCustom", value: function() {
              return this.getEmoji().custom;
            } }, { key: "_hasEmoji", value: function() {
              if (!this.getEmoji()._data) return false;
              var e4 = this.getEmoji()._data["has_img_" + this._set];
              return void 0 === e4 || e4;
            } }, { key: "_emojiType", value: function() {
              return this._isCustom() ? "custom" : this._isNative() ? "native" : this._hasEmoji() ? "image" : "fallback";
            } }]);
          }();
          function D(e4) {
            var t4 = e4.name, i2 = e4.short_names, n2 = e4.skin_tone, r2 = e4.skin_variations, o2 = e4.emoticons, s2 = e4.unified, a2 = e4.custom, c2 = e4.imageUrl, u2 = e4.id || i2[0], l2 = ":".concat(u2, ":");
            return a2 ? { id: u2, name: t4, colons: l2, emoticons: o2, custom: a2, imageUrl: c2 } : (n2 && (l2 += ":skin-tone-".concat(n2, ":")), { id: u2, name: t4, colons: l2, emoticons: o2, unified: s2.toLowerCase(), skin: n2 || (r2 ? 1 : null), native: A(s2) });
          }
          function B(e4, t4, i2) {
            return (t4 = S(t4)) in e4 ? Object.defineProperty(e4, t4, { value: i2, enumerable: true, configurable: true, writable: true }) : e4[t4] = i2, e4;
          }
          var H = { native: { type: Boolean, default: false }, tooltip: { type: Boolean, default: false }, fallback: { type: Function }, skin: { type: Number, default: 1 }, set: { type: String, default: "apple" }, emoji: { type: [String, Object], required: true }, size: { type: Number, default: null }, tag: { type: String, default: "span" } }, U2 = { perLine: { type: Number, default: 9 }, maxSearchResults: { type: Number, default: 75 }, emojiSize: { type: Number, default: 24 }, title: { type: String, default: "Emoji Mart™" }, emoji: { type: String, default: "department_store" }, color: { type: String, default: "#ae65c5" }, set: { type: String, default: "apple" }, skin: { type: Number, default: null }, defaultSkin: { type: Number, default: 1 }, native: { type: Boolean, default: false }, emojiTooltip: { type: Boolean, default: false }, autoFocus: { type: Boolean, default: false }, i18n: { type: Object, default: function() {
            return {};
          } }, showPreview: { type: Boolean, default: true }, showSearch: { type: Boolean, default: true }, showCategories: { type: Boolean, default: true }, showSkinTones: { type: Boolean, default: true }, infiniteScroll: { type: Boolean, default: true }, pickerStyles: { type: Object, default: function() {
            return {};
          } } };
          function V(e4, t4) {
            var i2 = Object.keys(e4);
            if (Object.getOwnPropertySymbols) {
              var n2 = Object.getOwnPropertySymbols(e4);
              t4 && (n2 = n2.filter(function(t9) {
                return Object.getOwnPropertyDescriptor(e4, t9).enumerable;
              })), i2.push.apply(i2, n2);
            }
            return i2;
          }
          function W(e4) {
            for (var t4 = 1; t4 < arguments.length; t4++) {
              var i2 = null != arguments[t4] ? arguments[t4] : {};
              t4 % 2 ? V(Object(i2), true).forEach(function(t9) {
                B(e4, t9, i2[t9]);
              }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e4, Object.getOwnPropertyDescriptors(i2)) : V(Object(i2)).forEach(function(t9) {
                Object.defineProperty(e4, t9, Object.getOwnPropertyDescriptor(i2, t9));
              });
            }
            return e4;
          }
          var J = b({ props: W(W({}, H), {}, { data: { type: Object, required: true } }), emits: ["click", "mouseenter", "mouseleave"], computed: { view: function() {
            return new $(this.emojiObject, this.skin, this.set, this.native, this.fallback, this.tooltip, this.size);
          }, sanitizedData: function() {
            return this.emojiObject._sanitized;
          }, title: function() {
            return this.tooltip ? this.emojiObject.short_name : null;
          }, emojiObject: function() {
            return "string" == typeof this.emoji ? this.data.findEmoji(this.emoji) : this.emoji;
          } }, created: function() {
          }, methods: { onClick: function() {
            this.$emit("click", this.emojiObject);
          }, onMouseEnter: function() {
            this.$emit("mouseenter", this.emojiObject);
          }, onMouseLeave: function() {
            this.$emit("mouseleave", this.emojiObject);
          } } }, function() {
            var e4 = this, t4 = e4._self._c;
            return e4.view.canRender ? t4(e4.tag, { tag: "component", staticClass: "emoji-mart-emoji", attrs: { title: e4.view.title, "aria-label": e4.view.ariaLabel, "data-title": e4.title }, on: { mouseenter: e4.onMouseEnter, mouseleave: e4.onMouseLeave, click: e4.onClick } }, [t4("span", { class: e4.view.cssClass, style: e4.view.cssStyle }, [e4._v(e4._s(e4.view.content))])]) : e4._e();
          }, []).exports, X = b({ props: { data: { type: Object, required: true }, i18n: { type: Object, required: true }, id: { type: String, required: true }, name: { type: String, required: true }, emojis: { type: Array }, emojiProps: { type: Object, required: true } }, methods: { activeClass: function(e4) {
            return this.emojiProps.selectedEmoji && this.emojiProps.selectedEmojiCategory && this.emojiProps.selectedEmoji.id == e4.id && this.emojiProps.selectedEmojiCategory.id == this.id ? "emoji-mart-emoji-selected" : "";
          } }, computed: { isVisible: function() {
            return !!this.emojis;
          }, isSearch: function() {
            return "Search" == this.name;
          }, hasResults: function() {
            return this.emojis.length > 0;
          }, emojiObjects: function() {
            var e4 = this;
            return this.emojis.map(function(t4) {
              return { emojiObject: t4, emojiView: new $(t4, e4.emojiProps.skin, e4.emojiProps.set, e4.emojiProps.native, e4.emojiProps.fallback, e4.emojiProps.emojiTooltip, e4.emojiProps.emojiSize) };
            });
          } }, components: { Emoji: J } }, function() {
            var e4 = this, t4 = e4._self._c;
            return e4.isVisible && (e4.isSearch || e4.hasResults) ? t4("section", { class: { "emoji-mart-category": true, "emoji-mart-no-results": !e4.hasResults }, attrs: { "aria-label": e4.i18n.categories[e4.id] } }, [t4("div", { staticClass: "emoji-mart-category-label" }, [t4("h3", { staticClass: "emoji-mart-category-label" }, [e4._v(e4._s(e4.i18n.categories[e4.id]))])]), e4._v(" "), e4._l(e4.emojiObjects, function(i2) {
              var n2 = i2.emojiObject, r2 = i2.emojiView;
              return [r2.canRender ? t4("button", { key: n2.id, staticClass: "emoji-mart-emoji", class: e4.activeClass(n2), attrs: { "aria-label": r2.ariaLabel, role: "option", "aria-selected": "false", "aria-posinset": "1", "aria-setsize": "1812", type: "button", "data-title": n2.short_name, title: r2.title }, on: { mouseenter: function(t9) {
                e4.emojiProps.onEnter(r2.getEmoji());
              }, mouseleave: function(t9) {
                e4.emojiProps.onLeave(r2.getEmoji());
              }, click: function(t9) {
                e4.emojiProps.onClick(r2.getEmoji());
              } } }, [t4("span", { class: r2.cssClass, style: r2.cssStyle }, [e4._v(e4._s(r2.content))])]) : e4._e()];
            }), e4._v(" "), e4.hasResults ? e4._e() : t4("div", [t4("emoji", { attrs: { data: e4.data, emoji: "sleuth_or_spy", native: e4.emojiProps.native, skin: e4.emojiProps.skin, set: e4.emojiProps.set } }), e4._v(" "), t4("div", { staticClass: "emoji-mart-no-results-label" }, [e4._v(e4._s(e4.i18n.notfound))])], 1)], 2) : e4._e();
          }, []).exports, Z = b({ props: { skin: { type: Number, required: true } }, emits: ["change"], data: function() {
            return { opened: false };
          }, methods: { onClick: function(e4) {
            this.opened && e4 != this.skin && this.$emit("change", e4), this.opened = !this.opened;
          } } }, function() {
            var e4 = this, t4 = e4._self._c;
            return t4("div", { class: { "emoji-mart-skin-swatches": true, "emoji-mart-skin-swatches-opened": e4.opened } }, e4._l(6, function(i2) {
              return t4("span", { key: i2, class: { "emoji-mart-skin-swatch": true, "emoji-mart-skin-swatch-selected": e4.skin == i2 } }, [t4("span", { class: "emoji-mart-skin emoji-mart-skin-tone-" + i2, on: { click: function(t9) {
                return e4.onClick(i2);
              } } })]);
            }), 0);
          }, []).exports, G = b({ props: { data: { type: Object, required: true }, title: { type: String, required: true }, emoji: { type: [String, Object] }, idleEmoji: { type: [String, Object], required: true }, showSkinTones: { type: Boolean, default: true }, emojiProps: { type: Object, required: true }, skinProps: { type: Object, required: true }, onSkinChange: { type: Function, required: true } }, computed: { emojiData: function() {
            return this.emoji ? this.emoji : {};
          }, emojiShortNames: function() {
            return this.emojiData.short_names;
          }, emojiEmoticons: function() {
            return this.emojiData.emoticons;
          } }, components: { Emoji: J, Skins: Z } }, function() {
            var e4 = this, t4 = e4._self._c;
            return t4("div", { staticClass: "emoji-mart-preview" }, [e4.emoji ? [t4("div", { staticClass: "emoji-mart-preview-emoji" }, [t4("emoji", { attrs: { data: e4.data, emoji: e4.emoji, native: e4.emojiProps.native, skin: e4.emojiProps.skin, set: e4.emojiProps.set } })], 1), e4._v(" "), t4("div", { staticClass: "emoji-mart-preview-data" }, [t4("div", { staticClass: "emoji-mart-preview-name" }, [e4._v(e4._s(e4.emoji.name))]), e4._v(" "), t4("div", { staticClass: "emoji-mart-preview-shortnames" }, e4._l(e4.emojiShortNames, function(i2) {
              return t4("span", { key: i2, staticClass: "emoji-mart-preview-shortname" }, [e4._v(":" + e4._s(i2) + ":")]);
            }), 0), e4._v(" "), t4("div", { staticClass: "emoji-mart-preview-emoticons" }, e4._l(e4.emojiEmoticons, function(i2) {
              return t4("span", { key: i2, staticClass: "emoji-mart-preview-emoticon" }, [e4._v(e4._s(i2))]);
            }), 0)])] : [t4("div", { staticClass: "emoji-mart-preview-emoji" }, [t4("emoji", { attrs: { data: e4.data, emoji: e4.idleEmoji, native: e4.emojiProps.native, skin: e4.emojiProps.skin, set: e4.emojiProps.set } })], 1), e4._v(" "), t4("div", { staticClass: "emoji-mart-preview-data" }, [t4("span", { staticClass: "emoji-mart-title-label" }, [e4._v(e4._s(e4.title))])]), e4._v(" "), e4.showSkinTones ? t4("div", { staticClass: "emoji-mart-preview-skins" }, [t4("skins", { attrs: { skin: e4.skinProps.skin }, on: { change: function(t9) {
              return e4.onSkinChange(t9);
            } } })], 1) : e4._e()]], 2);
          }, []).exports, K = b({ props: { data: { type: Object, required: true }, i18n: { type: Object, required: true }, autoFocus: { type: Boolean, default: false }, onSearch: { type: Function, required: true }, onArrowLeft: { type: Function, required: false }, onArrowRight: { type: Function, required: false }, onArrowDown: { type: Function, required: false }, onArrowUp: { type: Function, required: false }, onEnter: { type: Function, required: false } }, emits: ["search", "enter", "arrowUp", "arrowDown", "arrowRight", "arrowLeft"], data: function() {
            return { value: "" };
          }, computed: { emojiIndex: function() {
            return this.data;
          } }, watch: { value: function() {
            this.$emit("search", this.value);
          } }, methods: { clear: function() {
            this.value = "";
          } }, mounted: function() {
            var e4 = this.$el.querySelector("input");
            this.autoFocus && e4.focus();
          } }, function() {
            var e4 = this, t4 = e4._self._c;
            return t4("div", { staticClass: "emoji-mart-search" }, [t4("input", { directives: [{ name: "model", rawName: "v-model", value: e4.value, expression: "value" }], attrs: { type: "text", placeholder: e4.i18n.search, role: "textbox", "aria-autocomplete": "list", "aria-owns": "emoji-mart-list", "aria-label": "Search for an emoji", "aria-describedby": "emoji-mart-search-description" }, domProps: { value: e4.value }, on: { keydown: [function(t9) {
              return !t9.type.indexOf("key") && e4._k(t9.keyCode, "left", 37, t9.key, ["Left", "ArrowLeft"]) || "button" in t9 && 0 !== t9.button ? null : function(t10) {
                return e4.$emit("arrowLeft", t10);
              }.apply(null, arguments);
            }, function(t9) {
              return !t9.type.indexOf("key") && e4._k(t9.keyCode, "right", 39, t9.key, ["Right", "ArrowRight"]) || "button" in t9 && 2 !== t9.button ? null : function() {
                return e4.$emit("arrowRight");
              }.apply(null, arguments);
            }, function(t9) {
              return !t9.type.indexOf("key") && e4._k(t9.keyCode, "down", 40, t9.key, ["Down", "ArrowDown"]) ? null : function() {
                return e4.$emit("arrowDown");
              }.apply(null, arguments);
            }, function(t9) {
              return !t9.type.indexOf("key") && e4._k(t9.keyCode, "up", 38, t9.key, ["Up", "ArrowUp"]) ? null : function(t10) {
                return e4.$emit("arrowUp", t10);
              }.apply(null, arguments);
            }, function(t9) {
              return !t9.type.indexOf("key") && e4._k(t9.keyCode, "enter", 13, t9.key, "Enter") ? null : function() {
                return e4.$emit("enter");
              }.apply(null, arguments);
            }], input: function(t9) {
              t9.target.composing || (e4.value = t9.target.value);
            } } }), e4._v(" "), t4("span", { staticClass: "hidden", attrs: { id: "emoji-picker-search-description" } }, [e4._v("Use the left, right, up and down arrow keys to navigate the emoji search\n    results.")])]);
          }, []), Q = K.exports;
          function Y(e4, t4) {
            (null == t4 || t4 > e4.length) && (t4 = e4.length);
            for (var i2 = 0, n2 = new Array(t4); i2 < t4; i2++) n2[i2] = e4[i2];
            return n2;
          }
          i(537);
          var ee = function() {
            return O(function e4(t4) {
              var i2, n2;
              E(this, e4), this._vm = t4, this._data = t4.data, this._perLine = t4.perLine, this._categories = [], (i2 = this._categories).push.apply(i2, function(e5) {
                if (Array.isArray(e5)) return Y(e5);
              }(n2 = this._data.categories()) || function(e5) {
                if ("undefined" != typeof Symbol && null != e5[Symbol.iterator] || null != e5["@@iterator"]) return Array.from(e5);
              }(n2) || function(e5, t9) {
                if (e5) {
                  if ("string" == typeof e5) return Y(e5, t9);
                  var i3 = Object.prototype.toString.call(e5).slice(8, -1);
                  return "Object" === i3 && e5.constructor && (i3 = e5.constructor.name), "Map" === i3 || "Set" === i3 ? Array.from(e5) : "Arguments" === i3 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i3) ? Y(e5, t9) : void 0;
                }
              }(n2) || function() {
                throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
              }()), this._categories = this._categories.filter(function(e5) {
                return e5.emojis.length > 0;
              }), this._categories[0].first = true, Object.freeze(this._categories), this.activeCategory = this._categories[0], this.searchEmojis = null, this.previewEmoji = null, this.previewEmojiCategoryIdx = 0, this.previewEmojiIdx = -1;
            }, [{ key: "onScroll", value: function() {
              for (var e4 = this._vm.$refs.scroll.scrollTop, t4 = this.filteredCategories[0], i2 = 0, n2 = this.filteredCategories.length; i2 < n2; i2++) {
                var r2 = this.filteredCategories[i2], o2 = this._vm.getCategoryComponent(i2);
                if (o2 && o2.$el.offsetTop - 50 > e4) break;
                t4 = r2;
              }
              this.activeCategory = t4;
            } }, { key: "allCategories", get: function() {
              return this._categories;
            } }, { key: "filteredCategories", get: function() {
              return this.searchEmojis ? [{ id: "search", name: "Search", emojis: this.searchEmojis }] : this._categories.filter(function(e4) {
                return e4.emojis.length > 0;
              });
            } }, { key: "previewEmojiCategory", get: function() {
              return this.previewEmojiCategoryIdx >= 0 ? this.filteredCategories[this.previewEmojiCategoryIdx] : null;
            } }, { key: "onAnchorClick", value: function(e4) {
              var t4 = this;
              if (!this.searchEmojis) {
                var i2 = this.filteredCategories.indexOf(e4), n2 = this._vm.getCategoryComponent(i2);
                this._vm.infiniteScroll ? function() {
                  if (n2) {
                    var i3 = n2.$el.offsetTop;
                    e4.first && (i3 = 0), t4._vm.$refs.scroll.scrollTop = i3;
                  }
                }() : this.activeCategory = this.filteredCategories[i2];
              }
            } }, { key: "onSearch", value: function(e4) {
              var t4 = this._data.search(e4, this.maxSearchResults);
              this.searchEmojis = t4, this.previewEmojiCategoryIdx = 0, this.previewEmojiIdx = 0, this.updatePreviewEmoji();
            } }, { key: "onEmojiEnter", value: function(e4) {
              this.previewEmoji = e4, this.previewEmojiIdx = -1, this.previewEmojiCategoryIdx = -1;
            } }, { key: "onEmojiLeave", value: function(e4) {
              this.previewEmoji = null;
            } }, { key: "onArrowLeft", value: function() {
              this.previewEmojiIdx > 0 ? this.previewEmojiIdx -= 1 : (this.previewEmojiCategoryIdx -= 1, this.previewEmojiCategoryIdx < 0 ? this.previewEmojiCategoryIdx = 0 : this.previewEmojiIdx = this.filteredCategories[this.previewEmojiCategoryIdx].emojis.length - 1), this.updatePreviewEmoji();
            } }, { key: "onArrowRight", value: function() {
              this.previewEmojiIdx < this.emojisLength(this.previewEmojiCategoryIdx) - 1 ? this.previewEmojiIdx += 1 : (this.previewEmojiCategoryIdx += 1, this.previewEmojiCategoryIdx >= this.filteredCategories.length ? this.previewEmojiCategoryIdx = this.filteredCategories.length - 1 : this.previewEmojiIdx = 0), this.updatePreviewEmoji();
            } }, { key: "onArrowDown", value: function() {
              if (-1 == this.previewEmojiIdx) return this.onArrowRight();
              var e4 = this.filteredCategories[this.previewEmojiCategoryIdx].emojis.length, t4 = this._perLine;
              this.previewEmojiIdx + t4 > e4 && (t4 = e4 % this._perLine);
              for (var i2 = 0; i2 < t4; i2++) this.onArrowRight();
              this.updatePreviewEmoji();
            } }, { key: "onArrowUp", value: function() {
              var e4 = this._perLine;
              this.previewEmojiIdx - e4 < 0 && (e4 = this.previewEmojiCategoryIdx > 0 ? this.filteredCategories[this.previewEmojiCategoryIdx - 1].emojis.length % this._perLine : 0);
              for (var t4 = 0; t4 < e4; t4++) this.onArrowLeft();
              this.updatePreviewEmoji();
            } }, { key: "updatePreviewEmoji", value: function() {
              var e4 = this;
              this.previewEmoji = this.filteredCategories[this.previewEmojiCategoryIdx].emojis[this.previewEmojiIdx], this._vm.$nextTick(function() {
                var t4 = e4._vm.$refs.scroll, i2 = t4.querySelector(".emoji-mart-emoji-selected"), n2 = t4.offsetTop - t4.offsetHeight;
                i2 && i2.offsetTop + i2.offsetHeight > n2 + t4.scrollTop && (t4.scrollTop += i2.offsetHeight), i2 && i2.offsetTop < t4.scrollTop && (t4.scrollTop -= i2.offsetHeight);
              });
            } }, { key: "emojisLength", value: function(e4) {
              return -1 == e4 ? 0 : this.filteredCategories[e4].emojis.length;
            } }]);
          }();
          function te(e4, t4) {
            var i2 = Object.keys(e4);
            if (Object.getOwnPropertySymbols) {
              var n2 = Object.getOwnPropertySymbols(e4);
              t4 && (n2 = n2.filter(function(t9) {
                return Object.getOwnPropertyDescriptor(e4, t9).enumerable;
              })), i2.push.apply(i2, n2);
            }
            return i2;
          }
          function ie(e4) {
            for (var t4 = 1; t4 < arguments.length; t4++) {
              var i2 = null != arguments[t4] ? arguments[t4] : {};
              t4 % 2 ? te(Object(i2), true).forEach(function(t9) {
                B(e4, t9, i2[t9]);
              }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e4, Object.getOwnPropertyDescriptors(i2)) : te(Object(i2)).forEach(function(t9) {
                Object.defineProperty(e4, t9, Object.getOwnPropertyDescriptor(i2, t9));
              });
            }
            return e4;
          }
          var ne = { search: "Search", notfound: "No Emoji Found", categories: { search: "Search Results", recent: "Frequently Used", smileys: "Smileys & Emotion", people: "People & Body", nature: "Animals & Nature", foods: "Food & Drink", activity: "Activity", places: "Travel & Places", objects: "Objects", symbols: "Symbols", flags: "Flags", custom: "Custom" } }, re = { props: ie(ie({}, U2), {}, { data: { type: Object, required: true } }), emits: ["select", "skin-change"], data: function() {
            return { activeSkin: this.skin || c.get("skin") || this.defaultSkin, view: new ee(this) };
          }, computed: { customStyles: function() {
            return ie({ width: this.calculateWidth + "px" }, this.pickerStyles);
          }, emojiProps: function() {
            return { native: this.native, skin: this.activeSkin, set: this.set, emojiTooltip: this.emojiTooltip, emojiSize: this.emojiSize, selectedEmoji: this.view.previewEmoji, selectedEmojiCategory: this.view.previewEmojiCategory, onEnter: this.onEmojiEnter.bind(this), onLeave: this.onEmojiLeave.bind(this), onClick: this.onEmojiClick.bind(this) };
          }, skinProps: function() {
            return { skin: this.activeSkin };
          }, calculateWidth: function() {
            return this.perLine * (this.emojiSize + 12) + 12 + 2 + function() {
              if ("undefined" == typeof document) return 0;
              var e4 = document.createElement("div");
              e4.style.width = "100px", e4.style.height = "100px", e4.style.overflow = "scroll", e4.style.position = "absolute", e4.style.top = "-9999px", document.body.appendChild(e4);
              var t4 = e4.offsetWidth - e4.clientWidth;
              return document.body.removeChild(e4), t4;
            }();
          }, filteredCategories: function() {
            return this.view.filteredCategories;
          }, mergedI18n: function() {
            return Object.freeze(F(ne, this.i18n));
          }, idleEmoji: function() {
            try {
              return this.data.emoji(this.emoji);
            } catch (e4) {
              return console.error("Default preview emoji `" + this.emoji + "` is not available, check the Picker `emoji` property"), console.error(e4), this.data.firstEmoji();
            }
          }, isSearching: function() {
            return null != this.view.searchEmojis;
          } }, watch: { skin: function() {
            this.onSkinChange(this.skin);
          } }, methods: { onScroll: function() {
            this.infiniteScroll && !this.waitingForPaint && (this.waitingForPaint = true, window.requestAnimationFrame(this.onScrollPaint.bind(this)));
          }, onScrollPaint: function() {
            this.waitingForPaint = false, this.view.onScroll();
          }, onAnchorClick: function(e4) {
            this.view.onAnchorClick(e4);
          }, onSearch: function(e4) {
            this.view.onSearch(e4);
          }, onEmojiEnter: function(e4) {
            this.view.onEmojiEnter(e4);
          }, onEmojiLeave: function(e4) {
            this.view.onEmojiLeave(e4);
          }, onArrowLeft: function(e4) {
            var t4 = this.view.previewEmojiIdx;
            this.view.onArrowLeft(), e4 && this.view.previewEmojiIdx !== t4 && e4.preventDefault();
          }, onArrowRight: function() {
            this.view.onArrowRight();
          }, onArrowDown: function() {
            this.view.onArrowDown();
          }, onArrowUp: function(e4) {
            this.view.onArrowUp(), e4.preventDefault();
          }, onEnter: function() {
            this.view.previewEmoji && (this.$emit("select", this.view.previewEmoji), w.add(this.view.previewEmoji));
          }, onEmojiClick: function(e4) {
            this.$emit("select", e4), w.add(e4);
          }, onTextSelect: function(e4) {
            e4.stopPropagation();
          }, onSkinChange: function(e4) {
            this.activeSkin = e4, c.update({ skin: e4 }), this.$emit("skin-change", e4);
          }, getCategoryComponent: function(e4) {
            var t4 = this.$refs["categories_" + e4];
            return t4 && "0" in t4 ? t4[0] : t4;
          } }, components: { Anchors: k, Category: X, Preview: G, Search: Q } }, oe = b(re, function() {
            var e4 = this, t4 = e4._self._c;
            return t4("section", { staticClass: "emoji-mart emoji-mart-static", style: e4.customStyles }, [e4.showCategories ? t4("div", { staticClass: "emoji-mart-bar emoji-mart-bar-anchors" }, [t4("anchors", { attrs: { data: e4.data, i18n: e4.mergedI18n, color: e4.color, categories: e4.view.allCategories, "active-category": e4.view.activeCategory }, on: { click: e4.onAnchorClick } })], 1) : e4._e(), e4._v(" "), e4._t("searchTemplate", function() {
              return [e4.showSearch ? t4("search", { ref: "search", attrs: { data: e4.data, i18n: e4.mergedI18n, "auto-focus": e4.autoFocus, "on-search": e4.onSearch }, on: { search: e4.onSearch, arrowLeft: e4.onArrowLeft, arrowRight: e4.onArrowRight, arrowDown: e4.onArrowDown, arrowUp: e4.onArrowUp, enter: e4.onEnter, select: e4.onTextSelect } }) : e4._e()];
            }, { data: e4.data, i18n: e4.i18n, autoFocus: e4.autoFocus, onSearch: e4.onSearch }), e4._v(" "), t4("div", { ref: "scroll", staticClass: "emoji-mart-scroll", attrs: { role: "tabpanel" }, on: { scroll: e4.onScroll } }, [t4("div", { ref: "scrollContent", attrs: { id: "emoji-mart-list", role: "listbox", "aria-expanded": "true" } }, [e4._t("customCategory"), e4._v(" "), e4._l(e4.view.filteredCategories, function(i2, n2) {
              return t4("category", { directives: [{ name: "show", rawName: "v-show", value: e4.infiniteScroll || i2 == e4.view.activeCategory || e4.isSearching, expression: "infiniteScroll || category == view.activeCategory || isSearching" }], key: i2.id, ref: "categories_" + n2, refInFor: true, attrs: { data: e4.data, i18n: e4.mergedI18n, id: i2.id, name: i2.name, emojis: i2.emojis, "emoji-props": e4.emojiProps } });
            })], 2)]), e4._v(" "), e4._t("previewTemplate", function() {
              return [e4.showPreview ? t4("div", { staticClass: "emoji-mart-bar emoji-mart-bar-preview" }, [t4("preview", { attrs: { data: e4.data, title: e4.title, emoji: e4.view.previewEmoji, "idle-emoji": e4.idleEmoji, "show-skin-tones": e4.showSkinTones, "emoji-props": e4.emojiProps, "skin-props": e4.skinProps, "on-skin-change": e4.onSkinChange } })], 1) : e4._e()];
            }, { data: e4.data, title: e4.title, emoji: e4.view.previewEmoji, idleEmoji: e4.idleEmoji, showSkinTones: e4.showSkinTones, emojiProps: e4.emojiProps, skinProps: e4.skinProps, onSkinChange: e4.onSkinChange })], 2);
          }, []), se = oe.exports;
        }(), n;
      }();
    });
  })(emojiMart$1);
  return emojiMart$1.exports;
}
requireEmojiMart();
distExports.getBuilder("nextcloud-vue").persist(true).build();
register(t5, t14, t34, t40);
({
  search: t("Search emoji"),
  notfound: t("No emoji found"),
  categories: {
    search: t("Search results"),
    recent: t("Frequently used"),
    smileys: t("Smileys & Emotion"),
    people: t("People & Body"),
    nature: t("Animals & Nature"),
    foods: t("Food & Drink"),
    activity: t("Activities"),
    places: t("Travel & Places"),
    objects: t("Objects"),
    symbols: t("Symbols"),
    flags: t("Flags"),
    custom: t("Custom")
  }
});
[
  new Color(255, 222, 52, t("Neutral skin color")),
  new Color(228, 205, 166, t("Light skin tone")),
  new Color(250, 221, 192, t("Medium light skin tone")),
  new Color(174, 129, 87, t("Medium skin tone")),
  new Color(158, 113, 88, t("Medium dark skin tone")),
  new Color(96, 79, 69, t("Dark skin tone"))
];
({
  props: {
    /**
     * The fallback text in the preview section
     */
    previewFallbackName: {
      default: t("Pick an emoji")
    }
  }
});
register(t39);
e()?.circles?.teamResourceProviders ?? [];
register(t36);
register(t8);
({
  props: {
    /**
     * Make the header name dynamic
     */
    header: {
      default: t("Related resources")
    },
    description: {
      default: t("Anything shared with the same group of people will show up here")
    }
  }
});
if (!window._vue_richtext_widgets) {
  window._vue_richtext_widgets = {};
}
const registerWidget = (id, callback, onDestroy = (el) => {
}, props) => {
  const propsWithDefaults = {
    hasInteractiveView: true,
    fullWidth: false,
    ...props
  };
  if (window._vue_richtext_widgets[id]) {
    console.error("Widget for id " + id + " already registered");
    return;
  }
  window._vue_richtext_widgets[id] = {
    id,
    callback,
    onDestroy,
    ...propsWithDefaults
  };
};
window._registerWidget = (id, callback, onDestroy, props) => {
  registerWidget(id, callback, onDestroy, props);
};
if (!window._vue_richtext_custom_picker_elements) {
  window._vue_richtext_custom_picker_elements = {};
}
const registerCustomPickerElement = (id, callback, onDestroy = (el) => {
}, size = "large") => {
  if (window._vue_richtext_custom_picker_elements[id]) {
    console.error("Custom reference picker element for id " + id + " already registered");
    return;
  }
  window._vue_richtext_custom_picker_elements[id] = {
    id,
    callback,
    onDestroy,
    size
  };
};
window._registerCustomPickerElement = registerCustomPickerElement;
register(t21);
register(t7);
({
  title: t("Any link"),
  icon_url: h("core", "filetypes/link.svg")
});
if (!window._vue_richtext_reference_providers) {
  window._vue_richtext_reference_providers = loadState("core", "reference-provider-list", []);
}
if (!window._vue_richtext_reference_provider_timestamps) {
  window._vue_richtext_reference_provider_timestamps = loadState("core", "reference-provider-timestamps", {});
}
register(t38, t44);
register(t22);
register(t29, t38, t40);
register(t11, t17);
const asciiAlpha = regexCheck(/[A-Za-z]/);
const asciiAlphanumeric = regexCheck(/[\dA-Za-z]/);
function asciiControl(code2) {
  return (
    // Special whitespace codes (which have negative values), C0 and Control
    // character DEL
    code2 !== null && (code2 < 32 || code2 === 127)
  );
}
function markdownLineEndingOrSpace(code2) {
  return code2 !== null && (code2 < 0 || code2 === 32);
}
const unicodePunctuation = regexCheck(new RegExp("\\p{P}|\\p{S}", "u"));
const unicodeWhitespace = regexCheck(/\s/);
function regexCheck(regex) {
  return check2;
  function check2(code2) {
    return code2 !== null && code2 > -1 && regex.test(String.fromCharCode(code2));
  }
}
const convert = (
  // Note: overloads in JSDoc can’t yet use different `@template`s.
  /**
   * @type {(
   *   (<Condition extends string>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & {type: Condition}) &
   *   (<Condition extends Props>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Condition) &
   *   (<Condition extends TestFunction>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Predicate<Condition, Node>) &
   *   ((test?: null | undefined) => (node?: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node) &
   *   ((test?: Test) => Check)
   * )}
   */
  /**
   * @param {Test} [test]
   * @returns {Check}
   */
  function(test) {
    if (test === null || test === void 0) {
      return ok;
    }
    if (typeof test === "function") {
      return castFactory(test);
    }
    if (typeof test === "object") {
      return Array.isArray(test) ? anyFactory(test) : propsFactory(test);
    }
    if (typeof test === "string") {
      return typeFactory(test);
    }
    throw new Error("Expected function, string, or object as test");
  }
);
function anyFactory(tests) {
  const checks = [];
  let index2 = -1;
  while (++index2 < tests.length) {
    checks[index2] = convert(tests[index2]);
  }
  return castFactory(any);
  function any(...parameters) {
    let index22 = -1;
    while (++index22 < checks.length) {
      if (checks[index22].apply(this, parameters)) return true;
    }
    return false;
  }
}
function propsFactory(check2) {
  const checkAsRecord = (
    /** @type {Record<string, unknown>} */
    check2
  );
  return castFactory(all2);
  function all2(node2) {
    const nodeAsRecord = (
      /** @type {Record<string, unknown>} */
      /** @type {unknown} */
      node2
    );
    let key;
    for (key in check2) {
      if (nodeAsRecord[key] !== checkAsRecord[key]) return false;
    }
    return true;
  }
}
function typeFactory(check2) {
  return castFactory(type);
  function type(node2) {
    return node2 && node2.type === check2;
  }
}
function castFactory(testFunction) {
  return check2;
  function check2(value, index2, parent) {
    return Boolean(
      looksLikeANode(value) && testFunction.call(
        this,
        value,
        typeof index2 === "number" ? index2 : void 0,
        parent || void 0
      )
    );
  }
}
function ok() {
  return true;
}
function looksLikeANode(value) {
  return value !== null && typeof value === "object" && "type" in value;
}
/** @type {(node?: unknown) => node is Exclude<PhrasingContent, Html>} */
convert([
  "break",
  "delete",
  "emphasis",
  // To do: next major: removed since footnotes were added to GFM.
  "footnote",
  "footnoteReference",
  "image",
  "imageReference",
  "inlineCode",
  // Enabled by `mdast-util-math`:
  "inlineMath",
  "link",
  "linkReference",
  // Enabled by `mdast-util-mdx`:
  "mdxJsxTextElement",
  // Enabled by `mdast-util-mdx`:
  "mdxTextExpression",
  "strong",
  "text",
  // Enabled by `mdast-util-directive`:
  "textDirective"
]);
const wwwPrefix = {
  tokenize: tokenizeWwwPrefix,
  partial: true
};
const domain = {
  tokenize: tokenizeDomain,
  partial: true
};
const path = {
  tokenize: tokenizePath,
  partial: true
};
const trail = {
  tokenize: tokenizeTrail,
  partial: true
};
const emailDomainDotTrail = {
  tokenize: tokenizeEmailDomainDotTrail,
  partial: true
};
const wwwAutolink = {
  tokenize: tokenizeWwwAutolink,
  previous: previousWww
};
const protocolAutolink = {
  tokenize: tokenizeProtocolAutolink,
  previous: previousProtocol
};
const emailAutolink = {
  tokenize: tokenizeEmailAutolink,
  previous: previousEmail
};
const text = {};
let code = 48;
while (code < 123) {
  text[code] = emailAutolink;
  code++;
  if (code === 58) code = 65;
  else if (code === 91) code = 97;
}
text[43] = emailAutolink;
text[45] = emailAutolink;
text[46] = emailAutolink;
text[95] = emailAutolink;
text[72] = [emailAutolink, protocolAutolink];
text[104] = [emailAutolink, protocolAutolink];
text[87] = [emailAutolink, wwwAutolink];
text[119] = [emailAutolink, wwwAutolink];
function tokenizeEmailAutolink(effects, ok2, nok) {
  const self2 = this;
  let dot;
  let data;
  return start;
  function start(code2) {
    if (!gfmAtext(code2) || !previousEmail.call(self2, self2.previous) || previousUnbalanced(self2.events)) {
      return nok(code2);
    }
    effects.enter("literalAutolink");
    effects.enter("literalAutolinkEmail");
    return atext(code2);
  }
  function atext(code2) {
    if (gfmAtext(code2)) {
      effects.consume(code2);
      return atext;
    }
    if (code2 === 64) {
      effects.consume(code2);
      return emailDomain;
    }
    return nok(code2);
  }
  function emailDomain(code2) {
    if (code2 === 46) {
      return effects.check(
        emailDomainDotTrail,
        emailDomainAfter,
        emailDomainDot
      )(code2);
    }
    if (code2 === 45 || code2 === 95 || asciiAlphanumeric(code2)) {
      data = true;
      effects.consume(code2);
      return emailDomain;
    }
    return emailDomainAfter(code2);
  }
  function emailDomainDot(code2) {
    effects.consume(code2);
    dot = true;
    return emailDomain;
  }
  function emailDomainAfter(code2) {
    if (data && dot && asciiAlpha(self2.previous)) {
      effects.exit("literalAutolinkEmail");
      effects.exit("literalAutolink");
      return ok2(code2);
    }
    return nok(code2);
  }
}
function tokenizeWwwAutolink(effects, ok2, nok) {
  const self2 = this;
  return wwwStart;
  function wwwStart(code2) {
    if (code2 !== 87 && code2 !== 119 || !previousWww.call(self2, self2.previous) || previousUnbalanced(self2.events)) {
      return nok(code2);
    }
    effects.enter("literalAutolink");
    effects.enter("literalAutolinkWww");
    return effects.check(
      wwwPrefix,
      effects.attempt(domain, effects.attempt(path, wwwAfter), nok),
      nok
    )(code2);
  }
  function wwwAfter(code2) {
    effects.exit("literalAutolinkWww");
    effects.exit("literalAutolink");
    return ok2(code2);
  }
}
function tokenizeProtocolAutolink(effects, ok2, nok) {
  const self2 = this;
  let buffer = "";
  let seen = false;
  return protocolStart;
  function protocolStart(code2) {
    if ((code2 === 72 || code2 === 104) && previousProtocol.call(self2, self2.previous) && !previousUnbalanced(self2.events)) {
      effects.enter("literalAutolink");
      effects.enter("literalAutolinkHttp");
      buffer += String.fromCodePoint(code2);
      effects.consume(code2);
      return protocolPrefixInside;
    }
    return nok(code2);
  }
  function protocolPrefixInside(code2) {
    if (asciiAlpha(code2) && buffer.length < 5) {
      buffer += String.fromCodePoint(code2);
      effects.consume(code2);
      return protocolPrefixInside;
    }
    if (code2 === 58) {
      const protocol = buffer.toLowerCase();
      if (protocol === "http" || protocol === "https") {
        effects.consume(code2);
        return protocolSlashesInside;
      }
    }
    return nok(code2);
  }
  function protocolSlashesInside(code2) {
    if (code2 === 47) {
      effects.consume(code2);
      if (seen) {
        return afterProtocol;
      }
      seen = true;
      return protocolSlashesInside;
    }
    return nok(code2);
  }
  function afterProtocol(code2) {
    return code2 === null || asciiControl(code2) || markdownLineEndingOrSpace(code2) || unicodeWhitespace(code2) || unicodePunctuation(code2) ? nok(code2) : effects.attempt(domain, effects.attempt(path, protocolAfter), nok)(code2);
  }
  function protocolAfter(code2) {
    effects.exit("literalAutolinkHttp");
    effects.exit("literalAutolink");
    return ok2(code2);
  }
}
function tokenizeWwwPrefix(effects, ok2, nok) {
  let size = 0;
  return wwwPrefixInside;
  function wwwPrefixInside(code2) {
    if ((code2 === 87 || code2 === 119) && size < 3) {
      size++;
      effects.consume(code2);
      return wwwPrefixInside;
    }
    if (code2 === 46 && size === 3) {
      effects.consume(code2);
      return wwwPrefixAfter;
    }
    return nok(code2);
  }
  function wwwPrefixAfter(code2) {
    return code2 === null ? nok(code2) : ok2(code2);
  }
}
function tokenizeDomain(effects, ok2, nok) {
  let underscoreInLastSegment;
  let underscoreInLastLastSegment;
  let seen;
  return domainInside;
  function domainInside(code2) {
    if (code2 === 46 || code2 === 95) {
      return effects.check(trail, domainAfter, domainAtPunctuation)(code2);
    }
    if (code2 === null || markdownLineEndingOrSpace(code2) || unicodeWhitespace(code2) || code2 !== 45 && unicodePunctuation(code2)) {
      return domainAfter(code2);
    }
    seen = true;
    effects.consume(code2);
    return domainInside;
  }
  function domainAtPunctuation(code2) {
    if (code2 === 95) {
      underscoreInLastSegment = true;
    } else {
      underscoreInLastLastSegment = underscoreInLastSegment;
      underscoreInLastSegment = void 0;
    }
    effects.consume(code2);
    return domainInside;
  }
  function domainAfter(code2) {
    if (underscoreInLastLastSegment || underscoreInLastSegment || !seen) {
      return nok(code2);
    }
    return ok2(code2);
  }
}
function tokenizePath(effects, ok2) {
  let sizeOpen = 0;
  let sizeClose = 0;
  return pathInside;
  function pathInside(code2) {
    if (code2 === 40) {
      sizeOpen++;
      effects.consume(code2);
      return pathInside;
    }
    if (code2 === 41 && sizeClose < sizeOpen) {
      return pathAtPunctuation(code2);
    }
    if (code2 === 33 || code2 === 34 || code2 === 38 || code2 === 39 || code2 === 41 || code2 === 42 || code2 === 44 || code2 === 46 || code2 === 58 || code2 === 59 || code2 === 60 || code2 === 63 || code2 === 93 || code2 === 95 || code2 === 126) {
      return effects.check(trail, ok2, pathAtPunctuation)(code2);
    }
    if (code2 === null || markdownLineEndingOrSpace(code2) || unicodeWhitespace(code2)) {
      return ok2(code2);
    }
    effects.consume(code2);
    return pathInside;
  }
  function pathAtPunctuation(code2) {
    if (code2 === 41) {
      sizeClose++;
    }
    effects.consume(code2);
    return pathInside;
  }
}
function tokenizeTrail(effects, ok2, nok) {
  return trail2;
  function trail2(code2) {
    if (code2 === 33 || code2 === 34 || code2 === 39 || code2 === 41 || code2 === 42 || code2 === 44 || code2 === 46 || code2 === 58 || code2 === 59 || code2 === 63 || code2 === 95 || code2 === 126) {
      effects.consume(code2);
      return trail2;
    }
    if (code2 === 38) {
      effects.consume(code2);
      return trailCharRefStart;
    }
    if (code2 === 93) {
      effects.consume(code2);
      return trailBracketAfter;
    }
    if (
      // `<` is an end.
      code2 === 60 || // So is whitespace.
      code2 === null || markdownLineEndingOrSpace(code2) || unicodeWhitespace(code2)
    ) {
      return ok2(code2);
    }
    return nok(code2);
  }
  function trailBracketAfter(code2) {
    if (code2 === null || code2 === 40 || code2 === 91 || markdownLineEndingOrSpace(code2) || unicodeWhitespace(code2)) {
      return ok2(code2);
    }
    return trail2(code2);
  }
  function trailCharRefStart(code2) {
    return asciiAlpha(code2) ? trailCharRefInside(code2) : nok(code2);
  }
  function trailCharRefInside(code2) {
    if (code2 === 59) {
      effects.consume(code2);
      return trail2;
    }
    if (asciiAlpha(code2)) {
      effects.consume(code2);
      return trailCharRefInside;
    }
    return nok(code2);
  }
}
function tokenizeEmailDomainDotTrail(effects, ok2, nok) {
  return start;
  function start(code2) {
    effects.consume(code2);
    return after;
  }
  function after(code2) {
    return asciiAlphanumeric(code2) ? nok(code2) : ok2(code2);
  }
}
function previousWww(code2) {
  return code2 === null || code2 === 40 || code2 === 42 || code2 === 95 || code2 === 91 || code2 === 93 || code2 === 126 || markdownLineEndingOrSpace(code2);
}
function previousProtocol(code2) {
  return !asciiAlpha(code2);
}
function previousEmail(code2) {
  return !(code2 === 47 || gfmAtext(code2));
}
function gfmAtext(code2) {
  return code2 === 43 || code2 === 45 || code2 === 46 || code2 === 95 || asciiAlphanumeric(code2);
}
function previousUnbalanced(events) {
  let index2 = events.length;
  let result = false;
  while (index2--) {
    const token = events[index2][1];
    if ((token.type === "labelLink" || token.type === "labelImage") && !token._balanced) {
      result = true;
      break;
    }
    if (token._gfmAutolinkLiteralWalkedInto) {
      result = false;
      break;
    }
  }
  if (events.length > 0 && !result) {
    events[events.length - 1][1]._gfmAutolinkLiteralWalkedInto = true;
  }
  return result;
}
ref$1(null);
if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this === null) {
      throw new TypeError("Array.prototype.find called on null or undefined");
    }
    if (typeof predicate !== "function") {
      throw new TypeError("predicate must be a function");
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;
    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return void 0;
  };
}
if (window && typeof window.CustomEvent !== "function") {
  let CustomEvent$1 = function(event, params) {
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: void 0
    };
    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  };
  if (typeof window.Event !== "undefined") {
    CustomEvent$1.prototype = window.Event.prototype;
  }
  window.CustomEvent = CustomEvent$1;
}
register(t31, t34);
({
  props: {
    placeholder: {
      default: t("Write a message …")
    }
  }
});
register(t0);
({
  props: {
    // Add NcSelect prop defaults and populate $props
    ...NcSelect.props,
    /**
     * Placeholder text
     *
     * @see https://vue-select.org/api/props.html#placeholder
     */
    placeholder: {
      default: t("Select a tag")
    }
  }
});
register(t15, t43);
({
  props: {
    /**
     * `aria-label` for the clear input button
     */
    ariaLabelClearSelected: {
      default: t("Clear selected")
    },
    /**
     * `aria-label` for the listbox element
     */
    ariaLabelListbox: {
      default: t("Options")
    },
    /**
     * Visible label for the input element
     *
     * @default 'Select account'
     */
    inputLabel: {
      default: t("Select account")
    }
  }
});
register(t47);
register(t23);
register(t48);
({
  methods: {
    /**
     * Debounce the group search (reduce API calls)
     */
    onSearch: debounce(function(query) {
      this.loadGroup(query);
    }, 200)
  }
});
function checkIfDarkTheme(el = document.body) {
  const backgroundInvertIfDark = window.getComputedStyle(el).getPropertyValue("--background-invert-if-dark");
  if (backgroundInvertIfDark !== void 0) {
    return backgroundInvertIfDark === "invert(100%)";
  }
  return false;
}
checkIfDarkTheme();
options.themes.tooltip.html = false;
options.themes.tooltip.delay = { show: 500, hide: 200 };
options.themes.tooltip.distance = 10;
options.themes.tooltip["arrow-padding"] = 3;
const index = {
  computed: {
    /**
     * @deprecated Is to be removed in v9.0.0 with Vue 3 migration.
     *             Use `composables/useIsMobile` instead.
     */
    isMobile() {
      return isMobileState.value;
    }
  }
};
const _sfc_main = {
  name: "PublicAlbumContent",
  components: {
    MapMarkerOutline,
    // Plus,
    // Download,
    // DownloadMultiple,
    // ImagePlus,
    ImageOffOutline,
    NcEmptyContent,
    NcActions,
    // NcActionSeparator,
    // NcButton,
    CollectionContent,
    // ActionDownload,
    HeaderNavigation
  },
  mixins: [
    FetchCollectionContentMixin,
    index
  ],
  props: {
    token: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showAddPhotosModal: false,
      loadingCount: 0,
      loadingAddFilesToAlbum: false,
      albumOriginalName: "",
      publicClient: getClient(U("dav"), {
        Authorization: `Basic ${btoa(`${this.token}:`)}`
      })
    };
  },
  computed: {
    album() {
      return this.$store.getters.getPublicAlbum(this.albumName);
    },
    albumName() {
      return this.token;
    },
    albumFileIds() {
      return this.$store.getters.getPublicAlbumFiles(this.albumName);
    },
    publicAlbumFileName() {
      return this.$store.getters.getPublicAlbumName(this.albumName);
    }
  },
  async beforeMount() {
    await this.fetchAlbumInfo();
    await this.fetchAlbumContent();
  },
  methods: {
    async fetchAlbumInfo() {
      const album = await this.fetchCollection(
        `${publicAlbumsPrefix}/${this.token}`,
        publicAlbumsExtraProps,
        this.publicClient
      );
      if (album !== null) {
        this.albumOriginalName = album.attributes["original-name"];
      }
    },
    async fetchAlbumContent() {
      const files = await this.fetchCollectionFiles(
        `${publicAlbumsPrefix}/${this.token}`,
        [...albumFilesExtraProps, ...publicAlbumsExtraProps],
        this.publicClient
      );
      files.forEach((file) => {
        file.update({
          // Use custom preview URL to avoid authentication prompt
          previewUrl: _(`/apps/photos/api/v1/publicPreview/${file.fileid}?x=2048&y=2048&token=${this.token}`),
          // Disable use of generic file previews for public albums - for older versions of the Viewer app
          hasPreview: false
        });
      });
    },
    async handleFilesPicked(fileIds) {
      this.showAddPhotosModal = false;
      await this.$store.dispatch("addFilesToCollection", { collectionFileName: this.album.root + this.albumName, fileIdsToAdd: fileIds });
      await this.fetchAlbumContent();
    },
    async handleRemoveFilesFromAlbum(fileIds) {
      this.$refs.collectionContent.onUncheckFiles(fileIds);
      await this.$store.dispatch("removeFilesFromCollection", { collectionFileName: this.album.root + this.albumName, fileIdsToRemove: fileIds });
    },
    t: translate
  }
};
var _sfc_render = function render3() {
  var _vm = this, _c = _vm._self._c;
  return _c("div", [_c("CollectionContent", { ref: "collectionContent", attrs: { "collection": _vm.album, "collection-file-ids": _vm.albumFileIds, "allow-selection": false, "loading": _vm.loadingCollection || _vm.loadingCollectionFiles, "error": _vm.errorFetchingCollection || _vm.errorFetchingCollectionFiles }, scopedSlots: _vm._u([{ key: "header", fn: function({ selectedFileIds }) {
    return _vm.albumOriginalName !== "" ? _c("HeaderNavigation", { key: "navigation", attrs: { "loading": _vm.loadingCollection || _vm.loadingCollectionFiles, "params": { token: _vm.token }, "path": "/", "root-title": _vm.albumOriginalName, "title": _vm.albumOriginalName }, on: { "refresh": _vm.fetchAlbumContent } }, [_vm.album.attributes.location !== "" ? _c("div", { staticClass: "album__location", attrs: { "slot": "subtitle" }, slot: "subtitle" }, [_c("MapMarkerOutline"), _vm._v(_vm._s(_vm.album.attributes.location) + " ")], 1) : _vm._e(), _vm.album !== void 0 ? _c("template", { slot: "right" }, [_c("NcActions", { attrs: { "force-menu": true, "aria-label": _vm.t("photos", "Open actions menu") } }, [selectedFileIds.length > 0 ? void 0 : _vm._e()], 2)], 1) : _vm._e()], 2) : _vm._e();
  } }], null, true) }, [_c("NcEmptyContent", { staticClass: "album__empty", attrs: { "slot": "empty-content", "name": _vm.t("photos", "This album does not have any photos or videos yet!") }, slot: "empty-content" }, [_c("ImageOffOutline", { attrs: { "slot": "icon" }, slot: "icon" })], 1)], 1)], 1);
};
var _sfc_staticRenderFns = [];
_sfc_render._withStripped = true;
var __component__ = /* @__PURE__ */ normalizeComponent(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "5dc093cb"
);
__component__.options.__file = "/Users/effem/workbench/git/personel/photos/src/views/PublicAlbumContent.vue";
const PublicAlbumContent = __component__.exports;
export {
  PublicAlbumContent as default
};
//# sourceMappingURL=PublicAlbumContent-Dz23d0x0.chunk.mjs.map
