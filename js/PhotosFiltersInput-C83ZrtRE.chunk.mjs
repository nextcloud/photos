const appName = "photos";
const appVersion = "5.0.0-dev.1";
import { d as defineComponent, b as ref$1, w as watch, t as translate, a1 as useSlots, q as computed, z as onUnmounted, _ } from "./vue.runtime.esm-Dri5gLQO.chunk.mjs";
import { r as register, X as t17, a as t, n as normalizeComponent$1, e as NcIconSvgWrapper, s as NcActions, ak as mdiClose, al as davClient, p as photosStore, l as logger, af as placesPrefix } from "./index-BOzawWmL.chunk.mjs";
import { n as normalizeComponent } from "./icons-BZLMM6Xn.chunk.mjs";
import { N as NcSelect, a as NcListItemIcon } from "./NcSelect-CjUzohn5-OrPoxx8A.chunk.mjs";
import { s as spawnDialog } from "./dialog-CIZq3-6b.chunk.mjs";
import { N as NcDateTimePicker } from "./NcDateTimePicker-D9wOztqD.chunk.mjs";
import { N as NcDialog } from "./NcDialog-CKgpZOiy-CeLaNMKv.chunk.mjs";
import { N as NcActionButton } from "./NcActionButton-CuVNJJtW-5eBS5Sv2.chunk.mjs";
import { N as NcDateTime } from "./NcDateTime-DshRFtUU-w5TCTRwf.chunk.mjs";
import { f as fetchCollections } from "./collectionFetcher-COU0Vwo3.chunk.mjs";
import { d as router } from "./video-C5pfp5p8.chunk.mjs";
const calendarMonthSvg = '<svg xmlns="http://www.w3.org/2000/svg" id="mdi-calendar-month" viewBox="0 0 24 24"><path d="M9,10V12H7V10H9M13,10V12H11V10H13M17,10V12H15V10H17M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H6V1H8V3H16V1H18V3H19M19,19V8H5V19H19M9,14V16H7V14H9M13,14V16H11V14H13M17,14V16H15V14H17Z" /></svg>';
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "CustomDateRangePickerDialog",
  emits: ["close"],
  setup(__props, { emit }) {
    const dateRange = ref$1([null, null]);
    watch(dateRange, (newDateRangeValue) => {
      if (newDateRangeValue[0] !== null || newDateRangeValue[1] !== null) {
        emit("close", {
          start: newDateRangeValue[0].getTime(),
          end: newDateRangeValue[1].getTime()
        });
      }
    });
    return { __sfc: true, emit, dateRange, t: translate, NcDateTimePicker, NcDialog };
  }
});
var _sfc_render$5 = function render() {
  var _vm = this, _c = _vm._self._c, _setup = _vm._self._setupProxy;
  return _c(_setup.NcDialog, { attrs: { "name": _setup.t("photos", "Select a custom date range"), "size": "normal" }, on: { "closing": function($event) {
    return _setup.emit("close", void 0);
  } } }, [_c("div", { staticClass: "date-range-picker-dialog", attrs: { "data-cy-photos-filters-input": "custom-date-range" } }, [_c(_setup.NcDateTimePicker, { staticClass: "date-range-picker-dialog__picker", attrs: { "clearable": true, "type": "date-range", "placeholder": _setup.t("photos", "Select a date range") }, scopedSlots: _vm._u([{ key: "default", fn: function() {
    return [_vm._v(" " + _vm._s(_setup.t("photos", "Date range")) + " ")];
  }, proxy: true }]), model: { value: _setup.dateRange, callback: function($$v) {
    _setup.dateRange = $$v;
  }, expression: "dateRange" } })], 1)]);
};
var _sfc_staticRenderFns$5 = [];
_sfc_render$5._withStripped = true;
var __component__$5 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$5,
  _sfc_render$5,
  _sfc_staticRenderFns$5,
  false,
  null,
  "85fce0f5"
);
__component__$5.options.__file = "/Users/effem/workbench/git/personel/photos/src/components/PhotosFilters/CustomDateRangePickerDialog.vue";
const CustomDateRangePickerDialog = __component__$5.exports;
register(t17);
const _sfc_main$4 = {
  __name: "NcChip",
  props: {
    /**
     * aria label to set on the close button
     * @default 'Close'
     */
    ariaLabelClose: {
      type: String,
      default: t("Close")
    },
    /**
     * Container for the actions
     */
    actionsContainer: {
      type: String,
      default: "body"
    },
    /**
     * Main text of the chip.
     */
    text: {
      type: String,
      default: ""
    },
    /**
     * Set the chips design variant-
     *
     * This sets the background style of the chip, similar to NcButton's `variant`.
     * @deprecated will be removed with v9 - use `variant` instead.
     */
    type: {
      type: String,
      default: "secondary",
      validator: (value) => ["primary", "secondary", "tertiary"].includes(value)
    },
    /**
     * SVG path of the icon to use, this takes precedence over `iconSVG`.
     * For example icon paths from `@mdi/js` can be used.
     */
    iconPath: {
      type: String,
      default: null
    },
    /**
     * Inline SVG to use as the icon
     */
    iconSvg: {
      type: String,
      default: null
    },
    /**
     * Set to true to prevent the close button to be shown
     */
    noClose: {
      type: Boolean,
      default: false
    },
    /**
     * Set the chips design variant-
     *
     * This sets the background style of the chip, similar to NcButton's `variant`.
     * @since 8.24.0
     */
    variant: {
      type: String,
      default: "secondary",
      validator: (value) => ["primary", "secondary", "tertiary"].includes(value)
    }
  },
  emits: ["close"],
  setup(__props, { emit }) {
    const props = __props;
    const slots = useSlots();
    const realVariant = computed(() => props.type !== "secondary" ? props.type : props.variant);
    const canClose = computed(() => !props.noClose);
    const hasActions = () => Boolean(slots.actions?.());
    const hasIcon = () => Boolean(props.iconPath || props.iconSvg || !!slots.icon?.());
    const onClose = () => {
      emit("close");
    };
    return { __sfc: true, props, emit, slots, realVariant, canClose, hasActions, hasIcon, onClose, mdiClose, NcActions, NcActionButton, NcIconSvgWrapper };
  }
};
var _sfc_render$4 = function render2() {
  var _vm = this, _c = _vm._self._c, _setup = _vm._self._setupProxy;
  return _c("div", { staticClass: "nc-chip", class: {
    [`nc-chip--${_setup.realVariant}`]: true,
    "nc-chip--no-actions": _vm.noClose && !_setup.hasActions(),
    "nc-chip--no-icon": !_setup.hasIcon()
  } }, [_setup.hasIcon() ? _c("span", { staticClass: "nc-chip__icon" }, [_vm._t("icon", function() {
    return [_vm.iconPath || _vm.iconSvg ? _c(_setup.NcIconSvgWrapper, { attrs: { "inline": "", "path": _vm.iconPath, "svg": _vm.iconPath ? void 0 : _vm.iconSvg, "size": 18 } }) : _vm._e()];
  })], 2) : _vm._e(), _c("span", { staticClass: "nc-chip__text" }, [_vm._t("default", function() {
    return [_vm._v(_vm._s(_vm.text))];
  })], 2), _setup.canClose || _setup.hasActions() ? _c(_setup.NcActions, { staticClass: "nc-chip__actions", attrs: { "container": _vm.actionsContainer, "force-menu": !_setup.canClose, "variant": "tertiary-no-background" } }, [_setup.canClose ? _c(_setup.NcActionButton, { attrs: { "close-after-click": "" }, on: { "click": _setup.onClose }, scopedSlots: _vm._u([{ key: "icon", fn: function() {
    return [_c(_setup.NcIconSvgWrapper, { attrs: { "path": _setup.mdiClose, "size": 20 } })];
  }, proxy: true }], null, false, 2547223506) }, [_vm._v(" " + _vm._s(_vm.ariaLabelClose) + " ")]) : _vm._e(), _vm._t("actions")], 2) : _vm._e()], 1);
};
var _sfc_staticRenderFns$4 = [];
var __component__$4 = /* @__PURE__ */ normalizeComponent$1(
  _sfc_main$4,
  _sfc_render$4,
  _sfc_staticRenderFns$4,
  false,
  null,
  "a7b8715a"
);
const NcChip = __component__$4.exports;
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "DateRangeOption",
  props: {
    value: { type: null, required: true }
  },
  emits: ["deselect"],
  setup(__props, { emit }) {
    return { __sfc: true, emit, NcChip, NcDateTime };
  }
});
var _sfc_render$3 = function render3() {
  var _vm = this, _c = _vm._self._c, _setup = _vm._self._setupProxy;
  return _c(_setup.NcChip, { attrs: { "data-cy-photos-filters-option": "date-range" }, on: { "close": function($event) {
    return _setup.emit("deselect");
  } }, scopedSlots: _vm._u([{ key: "default", fn: function() {
    return [_c(_setup.NcDateTime, { attrs: { "timestamp": _vm.value["start"], "format": { dateStyle: "long" }, "relative-time": false } }), _vm._v(" ⸱ "), _c(_setup.NcDateTime, { attrs: { "timestamp": _vm.value["end"], "format": { dateStyle: "long" }, "relative-time": false } })];
  }, proxy: true }]) });
};
var _sfc_staticRenderFns$3 = [];
_sfc_render$3._withStripped = true;
var __component__$3 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$3,
  _sfc_render$3,
  _sfc_staticRenderFns$3,
  false,
  null,
  null
);
__component__$3.options.__file = "/Users/effem/workbench/git/personel/photos/src/components/PhotosFilters/DateRangeOption.vue";
const DateRangeOption = __component__$3.exports;
/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
const dateRangeFilterId = "date-range";
const dateRangeFilter = {
  id: dateRangeFilterId,
  icon: calendarMonthSvg,
  renderOptionComponent: DateRangeOption,
  async getOptions() {
    const now = /* @__PURE__ */ new Date();
    return [
      {
        filterId: dateRangeFilterId,
        label: translate("photos", "Last week"),
        value: {
          start: new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() - 7).getTime(),
          end: new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() - 1).getTime()
        }
      },
      {
        filterId: dateRangeFilterId,
        label: translate("photos", "Last Month"),
        value: {
          start: new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime(),
          end: new Date(now.getFullYear(), now.getMonth(), 0).getTime()
        }
      },
      {
        filterId: dateRangeFilterId,
        label: translate("photos", "Custom…"),
        value: void 0,
        async getValue() {
          return new Promise((resolve) => {
            spawnDialog(CustomDateRangePickerDialog, void 0, resolve);
          });
        }
      }
    ];
  },
  getQuery(dateRangeOptions) {
    const dav = dateRangeOptions.map((option) => `
			<d:and>
				<d:gt>
					<d:prop><nc:metadata-photos-original_date_time/></d:prop>
					<d:literal>${option.start / 1e3}</d:literal>
				</d:gt>
				<d:lt>
					<d:prop><nc:metadata-photos-original_date_time/></d:prop>
					<d:literal>${option.end / 1e3 + 24 * 60 * 60}</d:literal>
				</d:lt>
			</d:and>`);
    return `<d:or>${dav.join("")}</d:or>`;
  }
};
const mapMarkerSvg = '<svg xmlns="http://www.w3.org/2000/svg" id="mdi-map-marker" viewBox="0 0 24 24"><path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" /></svg>';
function useAbortController() {
  const abortController = ref$1(new AbortController());
  const abortSignal = computed(() => abortController.value.signal);
  function abortPendingRequest() {
    abortController.value.abort();
    abortController.value = new AbortController();
  }
  onUnmounted(() => {
    abortController.value.abort();
  });
  router.beforeEach((from, to, next) => {
    abortPendingRequest();
    next();
  });
  return {
    abortSignal,
    abortPendingRequest
  };
}
function useFetchCollections() {
  const errorFetchingCollections = ref$1(null);
  const loadingCollections = ref$1(false);
  const { abortSignal } = useAbortController();
  async function _fetchCollections(collectionHome, extraProps = [], client = davClient) {
    if (loadingCollections.value) {
      return [];
    }
    try {
      loadingCollections.value = true;
      errorFetchingCollections.value = null;
      const collections = await fetchCollections(collectionHome, { signal: abortSignal.value }, extraProps, client);
      photosStore.dispatch("addCollections", { collections });
      return collections;
    } catch (error) {
      if (error.response?.status === 404) {
        errorFetchingCollections.value = 404;
      } else {
        errorFetchingCollections.value = error;
      }
      logger.error("Error fetching collections:", { error });
    } finally {
      loadingCollections.value = false;
    }
    return [];
  }
  return { fetchCollections: _fetchCollections, errorFetchingCollections, loadingCollections };
}
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "PlaceOption",
  props: {
    value: { type: null, required: true }
  },
  emits: ["deselect"],
  setup(__props, { emit }) {
    const props = __props;
    const { fetchCollections: fetchCollections2 } = useFetchCollections();
    const placeImageSource = computed(() => {
      const place = photosStore.getters.getPlace(props.value);
      if (!place) {
        return "";
      }
      return _(`/apps/photos/api/v1/preview/${place.attributes["last-photo"]}?x=${64}&y=${64}`);
    });
    if (Object.values(photosStore.getters.places).length === 0) {
      fetchCollections2(placesPrefix);
    }
    return { __sfc: true, props, fetchCollections: fetchCollections2, placeImageSource, emit, NcChip };
  }
});
var _sfc_render$2 = function render4() {
  var _vm = this, _c = _vm._self._c, _setup = _vm._self._setupProxy;
  return _c(_setup.NcChip, { attrs: { "data-cy-photos-filters-option": "place" }, on: { "close": function($event) {
    return _setup.emit("deselect");
  } }, scopedSlots: _vm._u([_vm.value !== void 0 ? { key: "icon", fn: function() {
    return [_c("img", { staticClass: "place__preview", attrs: { "src": _setup.placeImageSource } })];
  }, proxy: true } : null, { key: "default", fn: function() {
    return [_vm._v(" " + _vm._s(_vm.value) + " ")];
  }, proxy: true }], null, true) });
};
var _sfc_staticRenderFns$2 = [];
_sfc_render$2._withStripped = true;
var __component__$2 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$2,
  _sfc_render$2,
  _sfc_staticRenderFns$2,
  false,
  null,
  "d24d89f3"
);
__component__$2.options.__file = "/Users/effem/workbench/git/personel/photos/src/components/PhotosFilters/PlaceOption.vue";
const PlacesOption = __component__$2.exports;
/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
const placesFilterId = "places";
const placesFilter = {
  id: placesFilterId,
  icon: mapMarkerSvg,
  renderOptionComponent: PlacesOption,
  async getOptions() {
    if (Object.values(photosStore.getters.places).length === 0) {
      const collections = await fetchCollections(placesPrefix);
      photosStore.dispatch("addCollections", { collections });
    }
    return Object.values(Object.values(photosStore.getters.places)).map((place) => {
      return {
        filterId: placesFilterId,
        label: place.displayname,
        value: place.displayname,
        imgSrc: _(`/apps/photos/api/v1/preview/${place.attributes["last-photo"]}?x=${64}&y=${64}`)
      };
    });
  },
  getQuery(placesId) {
    const dav = placesId.map((placeId) => `
			<d:eq>
				<d:prop><nc:metadata-photos-place/></d:prop>
				<d:literal>${placeId}</d:literal>
			</d:eq>
		`);
    return `<d:or>${dav.join("")}</d:or>`;
  }
};
/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
const filters = [
  dateRangeFilter,
  placesFilter
];
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "PhotosFiltersDisplay",
  props: {
    selectedFilters: { type: Object, required: true }
  },
  emits: ["deselect-filter"],
  setup(__props, { emit }) {
    const props = __props;
    const availableFilters = computed(() => {
      return filters.filter((filter) => {
        const filterOptions = props.selectedFilters[filter.id];
        return filterOptions !== void 0 && filterOptions.length !== 0;
      });
    });
    return { __sfc: true, props, emit, availableFilters, NcIconSvgWrapper };
  }
});
var _sfc_render$1 = function render5() {
  var _vm = this, _c = _vm._self._c, _setup = _vm._self._setupProxy;
  return _c("div", { staticClass: "photos-filters-display" }, _vm._l(_setup.availableFilters, function(filter) {
    return _c("div", { key: filter.id, staticClass: "photos-filters-display__filter" }, [_c(_setup.NcIconSvgWrapper, { attrs: { "svg": filter.icon } }), _c("div", { staticClass: "photos-filters-display__filter__options-container" }, _vm._l(_vm.selectedFilters[filter.id], function(value, i) {
      return _c(filter.renderOptionComponent, { key: `${filter.id}_${i}`, tag: "component", staticClass: "photos-filters-display__filter__options-container__option", attrs: { "value": value }, on: { "deselect": function($event) {
        return _setup.emit("deselect-filter", { filterId: filter.id, value });
      } } });
    }), 1)], 1);
  }), 0);
};
var _sfc_staticRenderFns$1 = [];
_sfc_render$1._withStripped = true;
var __component__$1 = /* @__PURE__ */ normalizeComponent(
  _sfc_main$1,
  _sfc_render$1,
  _sfc_staticRenderFns$1,
  false,
  null,
  "179c6a8f"
);
__component__$1.options.__file = "/Users/effem/workbench/git/personel/photos/src/components/PhotosFilters/PhotosFiltersDisplay.vue";
const PhotosFiltersDisplay = __component__$1.exports;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PhotosFiltersInput",
  props: {
    selectedFilters: { type: Object, required: true }
  },
  emits: ["select-filter"],
  setup(__props, { emit }) {
    const props = __props;
    const availableOptions = ref$1([]);
    const availableOptionsWithSelection = computed(() => availableOptions.value.filter((option) => !optionIsSelected(option)));
    const loading = ref$1(true);
    const getOptionsPromises = filters.map(async (filter) => {
      const options = await filter.getOptions();
      availableOptions.value.push(...options);
    });
    Promise.all(getOptionsPromises).then(() => {
      loading.value = false;
    });
    function handleSelectOptions(options) {
      options.forEach(async (option) => {
        if (option.getValue !== void 0) {
          option.value = await option.getValue();
        }
        if (option.value === void 0) {
          return;
        }
        emit("select-filter", option);
      });
    }
    function optionIsSelected(option) {
      return props.selectedFilters[option.filterId]?.includes(option.value);
    }
    return { __sfc: true, props, emit, availableOptions, availableOptionsWithSelection, loading, getOptionsPromises, handleSelectOptions, optionIsSelected, t: translate, NcListItemIcon, NcSelect };
  }
});
var _sfc_render = function render6() {
  var _vm = this, _c = _vm._self._c, _setup = _vm._self._setupProxy;
  return _c("div", { staticClass: "photos-filters-input", attrs: { "data-cy-photos-filters-input": "" } }, [_c(_setup.NcSelect, { staticClass: "places-select", attrs: { "options": _setup.availableOptionsWithSelection, "aria-label-combobox": _setup.t("photos", "Select filters"), "placeholder": _setup.t("photos", "Select filters"), "loading": _setup.loading, "multiple": true }, on: { "option:selected": _setup.handleSelectOptions }, scopedSlots: _vm._u([{ key: "option", fn: function(option) {
    return [_c(_setup.NcListItemIcon, { attrs: { "name": option.label, "is-no-user": true, "url": option.imgSrc } })];
  } }]) })], 1);
};
var _sfc_staticRenderFns = [];
_sfc_render._withStripped = true;
var __component__ = /* @__PURE__ */ normalizeComponent(
  _sfc_main,
  _sfc_render,
  _sfc_staticRenderFns,
  false,
  null,
  "98c0c251"
);
__component__.options.__file = "/Users/effem/workbench/git/personel/photos/src/components/PhotosFilters/PhotosFiltersInput.vue";
const PhotosFiltersInput = __component__.exports;
export {
  PhotosFiltersDisplay as P,
  PhotosFiltersInput as a,
  filters as f
};
//# sourceMappingURL=PhotosFiltersInput-C83ZrtRE.chunk.mjs.map
