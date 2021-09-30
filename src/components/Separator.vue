<!--
 - @copyright Copyright (c) 2020 Corentin Mors
 -
 - @license AGPL-3.0-or-later
 -
 - @author Corentin Mors <medias@pixelswap.fr>
 -
 - This program is free software: you can redistribute it and/or modify
 - it under the terms of the GNU Affero General Public License as
 - published by the Free Software Foundation, either version 3 of the
 - License, or (at your option) any later version.
 -
 - This program is distributed in the hope that it will be useful,
 - but WITHOUT ANY WARRANTY; without even the implied warranty of
 - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 - GNU Affero General Public License for more details.
 -
 - You should have received a copy of the GNU Affero General Public License
 - along with this program. If not, see <http://www.gnu.org/licenses/>.
 -
 -->

<template>
  <h2
    class="grid-title"
    :style="{ height: items.height + 'px width:100% !important;' }"
  >
    {{ items.injected.month }}
    <span>{{ items.injected.year }}</span>
  </h2>
</template>

<script>
export default {
  name: "Separator",

  inheritAttrs: false,

  props: {
    items: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.grid-title {
  grid-column: 1/4;
  padding: 48px 0 12px 0;
  margin: 0;
  span {
    font-weight: normal;
    width: 100%;
  }
  &.first-title {
    padding: 0 0 12px 0;
  }
}
.item:focus-within {
  width: 100% !important;
  height: 90px;
}
</style>
