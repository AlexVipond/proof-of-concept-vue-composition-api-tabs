<template>
  <div :ref="tablist.list.ref" class="tablist">
    <button
      v-for="({ tab, isSelected }, index) in tablist.tabs.values"
      :key="index"
      :ref="tablist.tabs.ref"
      class="tab"
      :class="isSelected ? 'selected' : ''"
    >
      {{ tab }}
    </button>
    <div
      v-for="({ panel }, index) in tablist.panels.values"
      :key="index"
      :ref="tablist.panels.ref"
      class="panel"
    >
      {{ panel }}
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
import useTablist from './useTablist.ts'

const metadata = [
  { tab: 'Tab #1', panel: 'Content #1' },
  { tab: 'Tab #2', panel: 'Content #2' },
  { tab: 'Tab #3', panel: 'Content #3' },
]

export default {
  setup () {
    return {
      tablist: reactive(useTablist({ metadata }))
    }
  }
}
</script>
