"use strict";
(self["webpackChunkphotos"] = self["webpackChunkphotos"] || []).push([["src_mixins_FetchAlbumsMixin_js-src_components_Albums_AlbumForm_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumForm.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumForm.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var vue_material_design_icons_MapMarker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-material-design-icons/MapMarker */ "./node_modules/vue-material-design-icons/MapMarker.vue");
/* harmony import */ var vue_material_design_icons_AccountMultiplePlus__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-material-design-icons/AccountMultiplePlus */ "./node_modules/vue-material-design-icons/AccountMultiplePlus.vue");
/* harmony import */ var vue_material_design_icons_Send__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue-material-design-icons/Send */ "./node_modules/vue-material-design-icons/Send.vue");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nextcloud/vue */ "./node_modules/@nextcloud/vue/dist/ncvuecomponents.js");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_vue__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _nextcloud_moment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @nextcloud/moment */ "./node_modules/@nextcloud/moment/dist/index.js");
/* harmony import */ var _nextcloud_moment__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_moment__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _CollaboratorsSelectionForm_vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./CollaboratorsSelectionForm.vue */ "./src/components/Albums/CollaboratorsSelectionForm.vue");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//







/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'AlbumForm',
  components: {
    MapMarker: vue_material_design_icons_MapMarker__WEBPACK_IMPORTED_MODULE_0__["default"],
    AccountMultiplePlus: vue_material_design_icons_AccountMultiplePlus__WEBPACK_IMPORTED_MODULE_1__["default"],
    Send: vue_material_design_icons_Send__WEBPACK_IMPORTED_MODULE_2__["default"],
    NcButton: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_3__.NcButton,
    NcLoadingIcon: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_3__.NcLoadingIcon,
    NcTextField: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_3__.NcTextField,
    CollaboratorsSelectionForm: _CollaboratorsSelectionForm_vue__WEBPACK_IMPORTED_MODULE_5__["default"]
  },
  props: {
    album: {
      type: Object,
      default: null
    },
    displayBackButton: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      showCollaboratorView: false,
      albumName: '',
      albumLocation: '',
      loading: false
    };
  },
  computed: {
    /**
     * @return {boolean} Whether sharing is enabled.
     */
    editMode: function editMode() {
      return this.album !== null;
    },

    /**
     * @return {boolean} Whether sharing is enabled.
     */
    sharingEnabled: function sharingEnabled() {
      return OC.Share !== undefined;
    }
  },
  mounted: function mounted() {
    var _this = this;

    if (this.editMode) {
      this.albumName = this.album.basename;
      this.albumLocation = this.album.location;
    }

    this.$nextTick(function () {
      _this.$refs.nameInput.$el.getElementsByTagName('input')[0].focus();
    });
  },
  methods: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_6__.mapActions)(['createAlbum', 'renameAlbum', 'updateAlbum'])), {}, {
    submit: function submit() {
      var collaborators = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (this.albumName === '' || this.loading) {
        return;
      }

      if (this.editMode) {
        this.handleUpdateAlbum();
      } else {
        this.handleCreateAlbum(collaborators);
      }
    },
    handleCreateAlbum: function handleCreateAlbum() {
      var _arguments = arguments,
          _this2 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var collaborators, album;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                collaborators = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : [];
                _context.prev = 1;
                _this2.loading = true;
                _context.next = 5;
                return _this2.createAlbum({
                  album: {
                    basename: _this2.albumName,
                    nbItems: 0,
                    location: _this2.albumLocation,
                    lastPhoto: -1,
                    date: _nextcloud_moment__WEBPACK_IMPORTED_MODULE_4___default()().format('MMMM YYYY'),
                    collaborators: collaborators
                  }
                });

              case 5:
                album = _context.sent;

                if (!(_this2.albumLocation !== '' || collaborators.length !== 0)) {
                  _context.next = 10;
                  break;
                }

                _context.next = 9;
                return _this2.updateAlbum({
                  albumName: _this2.albumName,
                  properties: {
                    location: _this2.albumLocation,
                    collaborators: collaborators
                  }
                });

              case 9:
                album = _context.sent;

              case 10:
                _this2.$emit('done', {
                  album: album
                });

              case 11:
                _context.prev = 11;
                _this2.loading = false;
                return _context.finish(11);

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[1,, 11, 14]]);
      }))();
    },
    handleUpdateAlbum: function handleUpdateAlbum() {
      var _this3 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var album;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _this3.loading = true;
                album = _objectSpread({}, _this3.album);

                if (!(_this3.album.basename !== _this3.albumName)) {
                  _context2.next = 7;
                  break;
                }

                _context2.next = 6;
                return _this3.renameAlbum({
                  currentAlbumName: _this3.album.basename,
                  newAlbumName: _this3.albumName
                });

              case 6:
                album = _context2.sent;

              case 7:
                if (!(_this3.album.location !== _this3.albumLocation)) {
                  _context2.next = 11;
                  break;
                }

                _context2.next = 10;
                return _this3.updateAlbum({
                  albumName: _this3.albumName,
                  properties: {
                    location: _this3.albumLocation
                  }
                });

              case 10:
                album.location = _context2.sent;

              case 11:
                _this3.$emit('done', {
                  album: album
                });

              case 12:
                _context2.prev = 12;
                _this3.loading = false;
                return _context2.finish(12);

              case 15:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0,, 12, 15]]);
      }))();
    },
    back: function back() {
      this.$emit('back');
    }
  })
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vue_material_design_icons_Magnify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-material-design-icons/Magnify */ "./node_modules/vue-material-design-icons/Magnify.vue");
/* harmony import */ var vue_material_design_icons_Close__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-material-design-icons/Close */ "./node_modules/vue-material-design-icons/Close.vue");
/* harmony import */ var _nextcloud_axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/axios */ "./node_modules/@nextcloud/axios/dist/index.esm.js");
/* harmony import */ var _nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @nextcloud/dialogs */ "./node_modules/@nextcloud/dialogs/dist/index.es.js");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.esm.js");
/* harmony import */ var _nextcloud_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @nextcloud/router */ "./node_modules/@nextcloud/router/dist/index.js");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @nextcloud/vue */ "./node_modules/@nextcloud/vue/dist/ncvuecomponents.js");
/* harmony import */ var _nextcloud_vue__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_vue__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _services_logger_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../services/logger.js */ "./src/services/logger.js");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//








var SHARE = {
  TYPE: {
    USER: 0,
    GROUP: 1 // LINK: 3,

  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'CollaboratorsSelectionForm',
  components: {
    Magnify: vue_material_design_icons_Magnify__WEBPACK_IMPORTED_MODULE_0__["default"],
    Close: vue_material_design_icons_Close__WEBPACK_IMPORTED_MODULE_1__["default"],
    NcLoadingIcon: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_6__.NcLoadingIcon,
    NcButton: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_6__.NcButton,
    NcListItemIcon: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_6__.NcListItemIcon,
    NcTextField: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_6__.NcTextField,
    NcPopover: _nextcloud_vue__WEBPACK_IMPORTED_MODULE_6__.NcPopover
  },
  props: {
    albumName: {
      type: String,
      required: true
    },
    collaborators: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    publicLink: {
      type: String,
      default: ''
    },
    allowPublicLink: {
      type: Boolean,
      default: true
    }
  },
  data: function data() {
    return {
      searchText: '',
      availableCollaborators: {},
      selectedCollaboratorsKeys: [],
      currentSearchResults: [],
      loadingCollaborators: false,
      randomId: Math.random().toString().substring(2, 10),
      publicLinkCopied: false,
      config: {
        minSearchStringLength: parseInt(OC.config['sharing.minSearchStringLength'], 10) || 0
      }
    };
  },
  computed: {
    /**
     * @return {string[]}
     */
    searchResults: function searchResults() {
      var _this = this;

      return this.currentSearchResults.filter(function (_ref) {
        var id = _ref.id;
        return id !== (0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_4__.getCurrentUser)().uid;
      }).map(function (_ref2) {
        var type = _ref2.type,
            id = _ref2.id;
        return "".concat(type, ":").concat(id);
      }).filter(function (key) {
        return !_this.selectedCollaboratorsKeys.includes(key);
      }).map(function (key) {
        return {
          key: key,
          height: 48
        };
      });
    },

    /**
     * @return {object[]}
     */
    selectedCollaborators: function selectedCollaborators() {
      var _this2 = this;

      return this.selectedCollaboratorsKeys.map(function (collaboratorKey) {
        return _this2.availableCollaborators[collaboratorKey];
      });
    }
  },
  mounted: function mounted() {
    this.searchCollaborators();
    this.selectedCollaboratorsKeys = this.collaborators.map(function (_ref3) {
      var type = _ref3.type,
          id = _ref3.id;
      return "".concat(type, ":").concat(id);
    });
    this.availableCollaborators = _objectSpread(_objectSpread({}, this.availableCollaborators), this.collaborators.reduce(function (collaborators, collaborator) {
      return _objectSpread(_objectSpread({}, collaborators), {}, _defineProperty({}, "".concat(collaborator.type, ":").concat(collaborator.id), collaborator));
    }, {}));
  },
  methods: {
    /**
     * Fetch possible collaborators.
     */
    searchCollaborators: function searchCollaborators() {
      var _this3 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;

                if (!(_this3.searchText.length < _this3.config.minSearchStringLength)) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt("return");

              case 3:
                _this3.loadingCollaborators = true;
                _context.next = 6;
                return _nextcloud_axios__WEBPACK_IMPORTED_MODULE_2__["default"].get((0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_5__.generateOcsUrl)('core/autocomplete/get'), {
                  params: {
                    search: _this3.searchText,
                    itemType: 'share-recipients',
                    shareTypes: [SHARE.TYPE.USER, SHARE.TYPE.GROUP]
                  }
                });

              case 6:
                response = _context.sent;
                _this3.currentSearchResults = response.data.ocs.data.map(function (collaborator) {
                  var type = -1;

                  switch (collaborator.source) {
                    case 'users':
                      type = OC.Share.SHARE_TYPE_USER;
                      break;

                    case 'groups':
                      type = OC.Share.SHARE_TYPE_GROUP;
                      break;
                  }

                  return _objectSpread(_objectSpread({}, collaborator), {}, {
                    type: type
                  });
                });
                _this3.availableCollaborators = _objectSpread(_objectSpread({}, _this3.availableCollaborators), _this3.currentSearchResults.reduce(function (collaborators, collaborator) {
                  return _objectSpread(_objectSpread({}, collaborators), {}, _defineProperty({}, "".concat(collaborator.type, ":").concat(collaborator.id), collaborator));
                }, {}));
                _context.next = 16;
                break;

              case 11:
                _context.prev = 11;
                _context.t0 = _context["catch"](0);
                _this3.errorFetchingCollaborators = _context.t0;
                _services_logger_js__WEBPACK_IMPORTED_MODULE_7__["default"].error(t('photos', 'Failed to fetch collaborators list.'), _context.t0);
                (0,_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_3__.showError)(t('photos', 'Failed to fetch collaborators list.'));

              case 16:
                _context.prev = 16;
                _this3.loadingCollaborators = false;
                return _context.finish(16);

              case 19:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 11, 16, 19]]);
      }))();
    },
    // TODO: implement public sharing
    createPublicLinkForAlbum: function createPublicLinkForAlbum() {
      var _this4 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", _nextcloud_axios__WEBPACK_IMPORTED_MODULE_2__["default"].put((0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_5__.generateOcsUrl)("apps/photos/createPublicLink/".concat(_this4.albumName))));

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }))();
    },
    deletePublicLink: function deletePublicLink() {
      var _this5 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt("return", _nextcloud_axios__WEBPACK_IMPORTED_MODULE_2__["default"]["delete"]((0,_nextcloud_router__WEBPACK_IMPORTED_MODULE_5__.generateOcsUrl)("apps/photos/createPublicLink/".concat(_this5.albumName))));

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }))();
    },
    copyPublicLink: function copyPublicLink() {
      var _this6 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return navigator.clipboard.writeText(_this6.publicLink);

              case 2:
                _this6.publicLinkCopied = true;
                setTimeout(function () {
                  _this6.publicLinkCopied = false;
                }, 10000);

              case 4:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }))();
    },
    selectEntity: function selectEntity(collaboratorKey) {
      if (this.selectedCollaboratorsKeys.includes(collaboratorKey)) {
        return;
      }

      this.$refs.popover.$refs.popover.hide();
      this.selectedCollaboratorsKeys.push(collaboratorKey);
    },
    unselectEntity: function unselectEntity(collaboratorKey) {
      var index = this.selectedCollaboratorsKeys.indexOf(collaboratorKey);
      this.selectedCollaboratorsKeys.splice(index, 1);
    }
  }
});

/***/ }),

/***/ "./src/mixins/FetchAlbumsMixin.js":
/*!****************************************!*\
  !*** ./src/mixins/FetchAlbumsMixin.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @nextcloud/moment */ "./node_modules/@nextcloud/moment/dist/index.js");
/* harmony import */ var _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_nextcloud_moment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @nextcloud/dialogs */ "./node_modules/@nextcloud/dialogs/dist/index.es.js");
/* harmony import */ var _nextcloud_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @nextcloud/auth */ "./node_modules/@nextcloud/auth/dist/index.esm.js");
/* harmony import */ var _services_DavClient_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/DavClient.js */ "./src/services/DavClient.js");
/* harmony import */ var _services_logger_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/logger.js */ "./src/services/logger.js");
/* harmony import */ var _utils_fileUtils_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/fileUtils.js */ "./src/utils/fileUtils.js");
/* harmony import */ var _AbortControllerMixin_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./AbortControllerMixin.js */ "./src/mixins/AbortControllerMixin.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * @copyright Copyright (c) 2022 Louis Chemineau <louis@chmn.me>
 *
 * @author Louis Chemineau <louis@chmn.me>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */








/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'FetchAlbumsMixin',
  data: function data() {
    return {
      errorFetchingAlbums: null,
      loadingAlbums: false
    };
  },
  mixins: [_AbortControllerMixin_js__WEBPACK_IMPORTED_MODULE_6__["default"]],
  beforeMount: function beforeMount() {
    var _this = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this.fetchAlbums();

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  computed: _objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_7__.mapGetters)(['albums'])),
  methods: {
    fetchAlbums: function fetchAlbums() {
      var _this2 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var _getCurrentUser, response, albums, _error$response;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!_this2.loadingAlbums) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return");

              case 2:
                _context2.prev = 2;
                _this2.loadingAlbums = true;
                _this2.errorFetchingAlbums = null;
                _context2.next = 7;
                return _services_DavClient_js__WEBPACK_IMPORTED_MODULE_3__["default"].getDirectoryContents("/photos/".concat((_getCurrentUser = (0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_2__.getCurrentUser)()) === null || _getCurrentUser === void 0 ? void 0 : _getCurrentUser.uid, "/albums"), {
                  data: "<?xml version=\"1.0\"?>\n\t\t\t\t\t\t\t<d:propfind xmlns:d=\"DAV:\"\n\t\t\t\t\t\t\t\txmlns:oc=\"http://owncloud.org/ns\"\n\t\t\t\t\t\t\t\txmlns:nc=\"http://nextcloud.org/ns\"\n\t\t\t\t\t\t\t\txmlns:ocs=\"http://open-collaboration-services.org/ns\">\n\t\t\t\t\t\t\t\t<d:prop>\n\t\t\t\t\t\t\t\t\t<nc:last-photo />\n\t\t\t\t\t\t\t\t\t<nc:nbItems />\n\t\t\t\t\t\t\t\t\t<nc:location />\n\t\t\t\t\t\t\t\t\t<nc:dateRange />\n\t\t\t\t\t\t\t\t\t<nc:collaborators />\n\t\t\t\t\t\t\t\t\t<nc:publicLink />\n\t\t\t\t\t\t\t\t</d:prop>\n\t\t\t\t\t\t\t</d:propfind>",
                  details: true,
                  signal: _this2.abortController.signal
                });

              case 7:
                response = _context2.sent;
                albums = response.data.filter(function (album) {
                  var _getCurrentUser2;

                  return album.filename !== "/photos/".concat((_getCurrentUser2 = (0,_nextcloud_auth__WEBPACK_IMPORTED_MODULE_2__.getCurrentUser)()) === null || _getCurrentUser2 === void 0 ? void 0 : _getCurrentUser2.uid, "/albums");
                }) // Ensure that we have a proper collaborators array.
                .map(function (album) {
                  if (album.props.collaborators === '') {
                    album.props.collaborators = [];
                  } else if (_typeof(album.props.collaborators.collaborator) === 'object') {
                    if (Array.isArray(album.props.collaborators.collaborator)) {
                      album.props.collaborators = album.props.collaborators.collaborator;
                    } else {
                      album.props.collaborators = [album.props.collaborators.collaborator];
                    }
                  }

                  return album;
                }).map(function (album) {
                  return (0,_utils_fileUtils_js__WEBPACK_IMPORTED_MODULE_5__.genFileInfo)(album);
                }).map(function (album) {
                  var _album$dateRange$repl, _album$dateRange;

                  var dateRange = JSON.parse((_album$dateRange$repl = (_album$dateRange = album.dateRange) === null || _album$dateRange === void 0 ? void 0 : _album$dateRange.replace(/&quot;/g, '"')) !== null && _album$dateRange$repl !== void 0 ? _album$dateRange$repl : '{}');

                  if (dateRange.start === null) {
                    dateRange.start = _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0___default()().unix();
                    dateRange.end = _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0___default()().unix();
                  }

                  var dateRangeFormated = {
                    startDate: _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0___default().unix(dateRange.start).format('MMMM YYYY'),
                    endDate: _nextcloud_moment__WEBPACK_IMPORTED_MODULE_0___default().unix(dateRange.end).format('MMMM YYYY')
                  };

                  if (dateRangeFormated.startDate === dateRangeFormated.endDate) {
                    return _objectSpread(_objectSpread({}, album), {}, {
                      date: dateRangeFormated.startDate
                    });
                  } else {
                    return _objectSpread(_objectSpread({}, album), {}, {
                      date: _this2.t('photos', '{startDate} to {endDate}', dateRangeFormated)
                    });
                  }
                });

                _this2.$store.dispatch('addAlbums', {
                  albums: albums
                });

                _services_logger_js__WEBPACK_IMPORTED_MODULE_4__["default"].debug("[FetchAlbumsMixin] Fetched ".concat(albums.length, " new files: "), albums);
                _context2.next = 26;
                break;

              case 13:
                _context2.prev = 13;
                _context2.t0 = _context2["catch"](2);

                if (!(((_error$response = _context2.t0.response) === null || _error$response === void 0 ? void 0 : _error$response.status) === 404)) {
                  _context2.next = 19;
                  break;
                }

                _this2.errorFetchingAlbums = 404;
                _context2.next = 24;
                break;

              case 19:
                if (!(_context2.t0.code === 'ERR_CANCELED')) {
                  _context2.next = 23;
                  break;
                }

                return _context2.abrupt("return");

              case 23:
                _this2.errorFetchingAlbums = _context2.t0;

              case 24:
                _services_logger_js__WEBPACK_IMPORTED_MODULE_4__["default"].error(t('photos', 'Failed to fetch albums list.'), _context2.t0);
                (0,_nextcloud_dialogs__WEBPACK_IMPORTED_MODULE_1__.showError)(t('photos', 'Failed to fetch albums list.'));

              case 26:
                _context2.prev = 26;
                _this2.loadingAlbums = false;
                return _context2.finish(26);

              case 29:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[2, 13, 26, 29]]);
      }))();
    }
  }
});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumForm.vue?vue&type=style&index=0&id=1d54fb78&lang=scss&scoped=true&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumForm.vue?vue&type=style&index=0&id=1d54fb78&lang=scss&scoped=true& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".album-form[data-v-1d54fb78] {\n  display: flex;\n  flex-direction: column;\n  height: 350px;\n  padding: 16px;\n}\n.album-form .form-title[data-v-1d54fb78] {\n  font-weight: bold;\n}\n.album-form .form-subtitle[data-v-1d54fb78] {\n  color: var(--color-text-lighter);\n}\n.album-form .form-inputs[data-v-1d54fb78] {\n  flex-grow: 1;\n  justify-items: flex-end;\n}\n.album-form .form-inputs input[data-v-1d54fb78] {\n  width: 100%;\n}\n.album-form .form-inputs label[data-v-1d54fb78] {\n  display: flex;\n  margin-top: 16px;\n}\n.album-form .form-inputs label[data-v-1d54fb78]  svg {\n  margin-right: 12px;\n}\n.album-form .form-buttons[data-v-1d54fb78] {\n  display: flex;\n  justify-content: space-between;\n}\n.album-form .form-buttons .left-buttons[data-v-1d54fb78], .album-form .form-buttons .right-buttons[data-v-1d54fb78] {\n  display: flex;\n}\n.album-form .form-buttons .right-buttons[data-v-1d54fb78] {\n  justify-content: flex-end;\n}\n.album-form .form-buttons button[data-v-1d54fb78] {\n  margin-right: 16px;\n}\n.left-buttons[data-v-1d54fb78] {\n  flex-grow: 1;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=02023324&lang=scss&scoped=true&":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=02023324&lang=scss&scoped=true& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".manage-collaborators[data-v-02023324] {\n  display: flex;\n  flex-direction: column;\n  padding: 20px;\n  height: 500px;\n}\n.manage-collaborators__title[data-v-02023324] {\n  font-weight: bold;\n}\n.manage-collaborators__subtitle[data-v-02023324] {\n  color: var(--color-text-lighter);\n}\n.manage-collaborators__public-link-button[data-v-02023324] {\n  margin: 4px 0;\n}\n.manage-collaborators__form[data-v-02023324] {\n  margin-top: 4px 0;\n  display: flex;\n  flex-direction: column;\n}\n.manage-collaborators__form__input[data-v-02023324] {\n  position: relative;\n  display: block;\n}\n.manage-collaborators__form__input input[data-v-02023324] {\n  width: 100%;\n  padding-left: 34px;\n}\n.manage-collaborators__form__input .loading-icon[data-v-02023324] {\n  position: absolute;\n  top: 8px;\n  right: 8px;\n}\n.manage-collaborators__form__list[data-v-02023324] {\n  padding: 8px;\n}\n.manage-collaborators__form__list__result[data-v-02023324] {\n  padding: 8px;\n  border-radius: 100px;\n  box-sizing: border-box;\n}\n.manage-collaborators__form__list__result[data-v-02023324], .manage-collaborators__form__list__result *[data-v-02023324] {\n  cursor: pointer !important;\n}\n.manage-collaborators__form__list__result[data-v-02023324]:hover {\n  background: var(--color-background-dark);\n}\n.manage-collaborators__selection[data-v-02023324] {\n  display: flex;\n  flex-direction: column;\n  margin-top: 8px;\n  flex-grow: 1;\n}\n.manage-collaborators__selection__item[data-v-02023324] {\n  border-radius: var(--border-radius-pill);\n  padding: 0 8px;\n}\n.manage-collaborators__selection__item[data-v-02023324]:hover {\n  background: var(--color-background-dark);\n}\n.manage-collaborators .actions[data-v-02023324] {\n  display: flex;\n  margin-top: 8px;\n}\n.manage-collaborators .actions__public-link[data-v-02023324] {\n  display: flex;\n  align-items: center;\n}\n.manage-collaborators .actions__slot[data-v-02023324] {\n  flex-grow: 1;\n  display: flex;\n  justify-content: flex-end;\n  align-items: center;\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumForm.vue?vue&type=style&index=0&id=1d54fb78&lang=scss&scoped=true&":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumForm.vue?vue&type=style&index=0&id=1d54fb78&lang=scss&scoped=true& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_style_index_0_id_1d54fb78_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/dist/cjs.js!../../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AlbumForm.vue?vue&type=style&index=0&id=1d54fb78&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumForm.vue?vue&type=style&index=0&id=1d54fb78&lang=scss&scoped=true&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_style_index_0_id_1d54fb78_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_style_index_0_id_1d54fb78_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_style_index_0_id_1d54fb78_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_style_index_0_id_1d54fb78_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=02023324&lang=scss&scoped=true&":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=02023324&lang=scss&scoped=true& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_style_index_0_id_02023324_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/dist/cjs.js!../../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=02023324&lang=scss&scoped=true& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=02023324&lang=scss&scoped=true&");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_style_index_0_id_02023324_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_style_index_0_id_02023324_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_style_index_0_id_02023324_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_style_index_0_id_02023324_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/components/Albums/AlbumForm.vue":
/*!*********************************************!*\
  !*** ./src/components/Albums/AlbumForm.vue ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AlbumForm_vue_vue_type_template_id_1d54fb78_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AlbumForm.vue?vue&type=template&id=1d54fb78&scoped=true& */ "./src/components/Albums/AlbumForm.vue?vue&type=template&id=1d54fb78&scoped=true&");
/* harmony import */ var _AlbumForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AlbumForm.vue?vue&type=script&lang=js& */ "./src/components/Albums/AlbumForm.vue?vue&type=script&lang=js&");
/* harmony import */ var _AlbumForm_vue_vue_type_style_index_0_id_1d54fb78_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AlbumForm.vue?vue&type=style&index=0&id=1d54fb78&lang=scss&scoped=true& */ "./src/components/Albums/AlbumForm.vue?vue&type=style&index=0&id=1d54fb78&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _AlbumForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _AlbumForm_vue_vue_type_template_id_1d54fb78_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _AlbumForm_vue_vue_type_template_id_1d54fb78_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "1d54fb78",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/Albums/AlbumForm.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/components/Albums/CollaboratorsSelectionForm.vue":
/*!**************************************************************!*\
  !*** ./src/components/Albums/CollaboratorsSelectionForm.vue ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _CollaboratorsSelectionForm_vue_vue_type_template_id_02023324_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CollaboratorsSelectionForm.vue?vue&type=template&id=02023324&scoped=true& */ "./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=template&id=02023324&scoped=true&");
/* harmony import */ var _CollaboratorsSelectionForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CollaboratorsSelectionForm.vue?vue&type=script&lang=js& */ "./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=script&lang=js&");
/* harmony import */ var _CollaboratorsSelectionForm_vue_vue_type_style_index_0_id_02023324_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=02023324&lang=scss&scoped=true& */ "./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=02023324&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _CollaboratorsSelectionForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _CollaboratorsSelectionForm_vue_vue_type_template_id_02023324_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _CollaboratorsSelectionForm_vue_vue_type_template_id_02023324_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "02023324",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/components/Albums/CollaboratorsSelectionForm.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/components/Albums/AlbumForm.vue?vue&type=script&lang=js&":
/*!**********************************************************************!*\
  !*** ./src/components/Albums/AlbumForm.vue?vue&type=script&lang=js& ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AlbumForm.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumForm.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=script&lang=js&":
/*!***************************************************************************************!*\
  !*** ./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CollaboratorsSelectionForm.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/Albums/AlbumForm.vue?vue&type=style&index=0&id=1d54fb78&lang=scss&scoped=true&":
/*!*******************************************************************************************************!*\
  !*** ./src/components/Albums/AlbumForm.vue?vue&type=style&index=0&id=1d54fb78&lang=scss&scoped=true& ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_style_index_0_id_1d54fb78_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/style-loader/dist/cjs.js!../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/dist/cjs.js!../../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AlbumForm.vue?vue&type=style&index=0&id=1d54fb78&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumForm.vue?vue&type=style&index=0&id=1d54fb78&lang=scss&scoped=true&");


/***/ }),

/***/ "./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=02023324&lang=scss&scoped=true&":
/*!************************************************************************************************************************!*\
  !*** ./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=02023324&lang=scss&scoped=true& ***!
  \************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_clonedRuleSet_2_0_rules_0_use_3_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_style_index_0_id_02023324_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/style-loader/dist/cjs.js!../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/dist/cjs.js!../../../node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=02023324&lang=scss&scoped=true& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-2[0].rules[0].use[3]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=style&index=0&id=02023324&lang=scss&scoped=true&");


/***/ }),

/***/ "./src/components/Albums/AlbumForm.vue?vue&type=template&id=1d54fb78&scoped=true&":
/*!****************************************************************************************!*\
  !*** ./src/components/Albums/AlbumForm.vue?vue&type=template&id=1d54fb78&scoped=true& ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_template_id_1d54fb78_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_template_id_1d54fb78_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_AlbumForm_vue_vue_type_template_id_1d54fb78_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AlbumForm.vue?vue&type=template&id=1d54fb78&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumForm.vue?vue&type=template&id=1d54fb78&scoped=true&");


/***/ }),

/***/ "./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=template&id=02023324&scoped=true&":
/*!*********************************************************************************************************!*\
  !*** ./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=template&id=02023324&scoped=true& ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_template_id_02023324_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_template_id_02023324_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CollaboratorsSelectionForm_vue_vue_type_template_id_02023324_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CollaboratorsSelectionForm.vue?vue&type=template&id=02023324&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=template&id=02023324&scoped=true&");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumForm.vue?vue&type=template&id=1d54fb78&scoped=true&":
/*!*******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/AlbumForm.vue?vue&type=template&id=1d54fb78&scoped=true& ***!
  \*******************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return !_vm.showCollaboratorView
    ? _c(
        "form",
        {
          staticClass: "album-form",
          on: {
            submit: function ($event) {
              $event.preventDefault()
              return _vm.submit.apply(null, arguments)
            },
          },
        },
        [
          _c(
            "div",
            { staticClass: "form-inputs" },
            [
              _c("NcTextField", {
                ref: "nameInput",
                attrs: {
                  value: _vm.albumName,
                  type: "text",
                  name: "name",
                  required: true,
                  autofocus: "true",
                  placeholder: _vm.t("photos", "Name of the album"),
                },
                on: {
                  "update:value": function ($event) {
                    _vm.albumName = $event
                  },
                },
              }),
              _vm._v(" "),
              _c(
                "label",
                [
                  _c("MapMarker"),
                  _c("NcTextField", {
                    attrs: {
                      value: _vm.albumLocation,
                      name: "location",
                      type: "text",
                      placeholder: _vm.t("photos", "Location of the album"),
                    },
                    on: {
                      "update:value": function ($event) {
                        _vm.albumLocation = $event
                      },
                    },
                  }),
                ],
                1
              ),
            ],
            1
          ),
          _vm._v(" "),
          _c("div", { staticClass: "form-buttons" }, [
            _c(
              "span",
              { staticClass: "left-buttons" },
              [
                _vm.displayBackButton
                  ? _c(
                      "NcButton",
                      {
                        attrs: {
                          "aria-label": _vm.t(
                            "photos",
                            "Go back to the previous view."
                          ),
                          type: "tertiary",
                        },
                        on: { click: _vm.back },
                      },
                      [
                        _vm._v(
                          "\n\t\t\t\t" +
                            _vm._s(_vm.t("photos", "Back")) +
                            "\n\t\t\t"
                        ),
                      ]
                    )
                  : _vm._e(),
              ],
              1
            ),
            _vm._v(" "),
            _c(
              "span",
              { staticClass: "right-buttons" },
              [
                _vm.sharingEnabled && !_vm.editMode
                  ? _c(
                      "NcButton",
                      {
                        attrs: {
                          "aria-label": _vm.t(
                            "photos",
                            "Go to the add collaborators view."
                          ),
                          type: "secondary",
                          disabled: _vm.albumName.trim() === "" || _vm.loading,
                        },
                        on: {
                          click: function ($event) {
                            _vm.showCollaboratorView = true
                          },
                        },
                        scopedSlots: _vm._u(
                          [
                            {
                              key: "icon",
                              fn: function () {
                                return [_c("AccountMultiplePlus")]
                              },
                              proxy: true,
                            },
                          ],
                          null,
                          false,
                          1531126728
                        ),
                      },
                      [
                        _vm._v(
                          "\n\t\t\t\t" +
                            _vm._s(_vm.t("photos", "Add collaborators")) +
                            "\n\t\t\t"
                        ),
                      ]
                    )
                  : _vm._e(),
                _vm._v(" "),
                _c(
                  "NcButton",
                  {
                    attrs: {
                      "aria-label": _vm.editMode
                        ? _vm.t("photos", "Save.")
                        : _vm.t("photos", "Create the album."),
                      type: "primary",
                      disabled: _vm.albumName === "" || _vm.loading,
                    },
                    on: {
                      click: function ($event) {
                        return _vm.submit()
                      },
                    },
                    scopedSlots: _vm._u(
                      [
                        {
                          key: "icon",
                          fn: function () {
                            return [
                              _vm.loading ? _c("NcLoadingIcon") : _c("Send"),
                            ]
                          },
                          proxy: true,
                        },
                      ],
                      null,
                      false,
                      3914512768
                    ),
                  },
                  [
                    _vm._v(
                      "\n\t\t\t\t" +
                        _vm._s(
                          _vm.editMode
                            ? _vm.t("photos", "Save")
                            : _vm.t("photos", "Create album")
                        ) +
                        "\n\t\t\t"
                    ),
                  ]
                ),
              ],
              1
            ),
          ]),
        ]
      )
    : _c("CollaboratorsSelectionForm", {
        attrs: { "album-name": _vm.albumName, "allow-public-link": false },
        scopedSlots: _vm._u([
          {
            key: "default",
            fn: function (ref) {
              var collaborators = ref.collaborators
              return [
                _c(
                  "span",
                  { staticClass: "left-buttons" },
                  [
                    _c(
                      "NcButton",
                      {
                        attrs: {
                          "aria-label": _vm.t(
                            "photos",
                            "Back to the new album form."
                          ),
                          type: "tertiary",
                        },
                        on: {
                          click: function ($event) {
                            _vm.showCollaboratorView = false
                          },
                        },
                      },
                      [
                        _vm._v(
                          "\n\t\t\t\t" +
                            _vm._s(_vm.t("photos", "Back")) +
                            "\n\t\t\t"
                        ),
                      ]
                    ),
                  ],
                  1
                ),
                _vm._v(" "),
                _c(
                  "span",
                  { staticClass: "right-buttons" },
                  [
                    _c(
                      "NcButton",
                      {
                        attrs: {
                          "aria-label": _vm.editMode
                            ? _vm.t("photos", "Save.")
                            : _vm.t("photos", "Create the album."),
                          type: "primary",
                          disabled: _vm.albumName.trim() === "" || _vm.loading,
                        },
                        on: {
                          click: function ($event) {
                            return _vm.submit(collaborators)
                          },
                        },
                        scopedSlots: _vm._u(
                          [
                            {
                              key: "icon",
                              fn: function () {
                                return [
                                  _vm.loading
                                    ? _c("NcLoadingIcon")
                                    : _c("Send"),
                                ]
                              },
                              proxy: true,
                            },
                          ],
                          null,
                          true
                        ),
                      },
                      [
                        _vm._v(
                          "\n\t\t\t\t" +
                            _vm._s(
                              _vm.editMode
                                ? _vm.t("photos", "Save")
                                : _vm.t("photos", "Create album")
                            ) +
                            "\n\t\t\t"
                        ),
                      ]
                    ),
                  ],
                  1
                ),
              ]
            },
          },
        ]),
      })
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=template&id=02023324&scoped=true&":
/*!************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/Albums/CollaboratorsSelectionForm.vue?vue&type=template&id=02023324&scoped=true& ***!
  \************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "manage-collaborators" }, [
    _c("h2", { staticClass: "manage-collaborators__title" }, [
      _vm._v("\n\t\t" + _vm._s(_vm.t("photos", "Add collaborators")) + "\n\t"),
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "manage-collaborators__subtitle" }, [
      _vm._v(
        "\n\t\t" +
          _vm._s(
            _vm.t("photos", "Add people or groups who can edit your album")
          ) +
          "\n\t"
      ),
    ]),
    _vm._v(" "),
    _c(
      "form",
      {
        staticClass: "manage-collaborators__form",
        on: {
          submit: function ($event) {
            $event.preventDefault()
          },
        },
      },
      [
        _c(
          "NcPopover",
          { ref: "popover", attrs: { "auto-size": true, distance: 0 } },
          [
            _c(
              "label",
              {
                staticClass: "manage-collaborators__form__input",
                attrs: { slot: "trigger" },
                slot: "trigger",
              },
              [
                _c(
                  "NcTextField",
                  {
                    attrs: {
                      value: _vm.searchText,
                      autocomplete: "off",
                      type: "search",
                      name: "search",
                      "aria-label": _vm.t("photos", "Search for collaborators"),
                      "aria-autocomplete": "list",
                      "aria-controls":
                        "manage-collaborators__form__selection-" +
                        _vm.randomId +
                        " manage-collaborators__form__list-" +
                        _vm.randomId,
                      placeholder: _vm.t("photos", "Search people or groups"),
                    },
                    on: {
                      "update:value": function ($event) {
                        _vm.searchText = $event
                      },
                      input: _vm.searchCollaborators,
                    },
                  },
                  [_c("Magnify", { attrs: { size: 16 } })],
                  1
                ),
                _vm._v(" "),
                _vm.loadingCollaborators ? _c("NcLoadingIcon") : _vm._e(),
              ],
              1
            ),
            _vm._v(" "),
            _c(
              "ul",
              {
                staticClass: "manage-collaborators__form__list",
                attrs: {
                  id: "manage-collaborators__form__list-" + _vm.randomId,
                },
              },
              _vm._l(_vm.searchResults, function (result) {
                return _c("li", { key: result.key }, [
                  _c(
                    "a",
                    [
                      _c("NcListItemIcon", {
                        staticClass: "manage-collaborators__form__list__result",
                        attrs: {
                          id: _vm.availableCollaborators[result.key].id,
                          title: _vm.availableCollaborators[result.key].id,
                          search: _vm.searchText,
                          "display-name":
                            _vm.availableCollaborators[result.key].label,
                          "aria-label": _vm.t(
                            "photos",
                            "Add {collaboratorLabel} to the collaborators list",
                            {
                              collaboratorLabel:
                                _vm.availableCollaborators[result.key].label,
                            }
                          ),
                        },
                        on: {
                          click: function ($event) {
                            return _vm.selectEntity(result.key)
                          },
                        },
                      }),
                    ],
                    1
                  ),
                ])
              }),
              0
            ),
          ]
        ),
      ],
      1
    ),
    _vm._v(" "),
    _c(
      "ul",
      { staticClass: "manage-collaborators__selection" },
      _vm._l(_vm.selectedCollaboratorsKeys, function (collaboratorKey) {
        return _c(
          "li",
          {
            key: collaboratorKey,
            staticClass: "manage-collaborators__selection__item",
          },
          [
            _c(
              "NcListItemIcon",
              {
                attrs: {
                  id: _vm.availableCollaborators[collaboratorKey].id,
                  title: _vm.availableCollaborators[collaboratorKey].id,
                  "display-name":
                    _vm.availableCollaborators[collaboratorKey].label,
                  "aria-label": _vm.t(
                    "photos",
                    "Remove {collaboratorLabel} from the collaborators list",
                    {
                      collaboratorLabel:
                        _vm.availableCollaborators[collaboratorKey].label,
                    }
                  ),
                },
              },
              [
                _c(
                  "NcButton",
                  {
                    attrs: {
                      type: "tertiary",
                      "aria-label": _vm.t(
                        "photos",
                        "Remove {collaboratorLabel} from the collaborators list",
                        {
                          collaboratorLabel:
                            _vm.availableCollaborators[collaboratorKey].label,
                        }
                      ),
                    },
                    on: {
                      click: function ($event) {
                        return _vm.unselectEntity(collaboratorKey)
                      },
                    },
                  },
                  [
                    _c("Close", {
                      attrs: { slot: "icon", size: 20 },
                      slot: "icon",
                    }),
                  ],
                  1
                ),
              ],
              1
            ),
          ],
          1
        )
      }),
      0
    ),
    _vm._v(" "),
    _c("div", { staticClass: "actions" }, [
      _vm.allowPublicLink
        ? _c(
            "div",
            { staticClass: "actions__public-link" },
            [
              _vm.publicLink
                ? [
                    _c(
                      "NcButton",
                      {
                        staticClass: "manage-collaborators__public-link-button",
                        attrs: { type: "tertiary-no-background" },
                        on: { click: _vm.copyPublicLink },
                        scopedSlots: _vm._u(
                          [
                            {
                              key: "icon",
                              fn: function () {
                                return [
                                  _vm.publicLinkCopied
                                    ? _c("Check")
                                    : _c("ContentCopy"),
                                ]
                              },
                              proxy: true,
                            },
                          ],
                          null,
                          false,
                          845538853
                        ),
                      },
                      [
                        _vm.publicLinkCopied
                          ? [
                              _vm._v(
                                "\n\t\t\t\t\t\t" +
                                  _vm._s(
                                    _vm.t("photos", "Public link copied!")
                                  ) +
                                  "\n\t\t\t\t\t"
                              ),
                            ]
                          : [
                              _vm._v(
                                "\n\t\t\t\t\t\t" +
                                  _vm._s(_vm.t("photos", "Copy public link")) +
                                  "\n\t\t\t\t\t"
                              ),
                            ],
                      ],
                      2
                    ),
                    _vm._v(" "),
                    _c(
                      "NcButton",
                      { on: { click: _vm.deletePublicLink } },
                      [_c("Close", { attrs: { slot: "icon" }, slot: "icon" })],
                      1
                    ),
                  ]
                : _c(
                    "NcButton",
                    {
                      staticClass: "manage-collaborators__public-link-button",
                      attrs: { type: "tertiary-no-background" },
                      on: { click: _vm.createPublicLinkForAlbum },
                    },
                    [
                      _c("Earth", { attrs: { slot: "icon" }, slot: "icon" }),
                      _vm._v(
                        "\n\t\t\t\t" +
                          _vm._s(_vm.t("photos", "Share via public link")) +
                          "\n\t\t\t"
                      ),
                    ],
                    1
                  ),
            ],
            2
          )
        : _vm._e(),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "actions__slot" },
        [_vm._t("default", null, { collaborators: _vm.selectedCollaborators })],
        2
      ),
    ]),
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ })

}]);
//# sourceMappingURL=photos-src_mixins_FetchAlbumsMixin_js-src_components_Albums_AlbumForm_vue.js.map?v=beb5d11a1707452d1a32