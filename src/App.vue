<template>
  <div class="tabs">
    <div
      v-for="({ title, isSelected }, index) in tabs.titles.values"
      :key="index"
      :ref="el => tabs.titles.ref(el, index)"
      class="tab"
      :class="isSelected ? 'selected' : ''"
    >
      {{ title }}
    </div>
    <div
      v-for="({ content }, index) in tabs.contents.values"
      :key="index"
      :ref="el => tabs.contents.ref(el, index)"
      class="content"
    >
      {{ content }}
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
import useTabs from './useTabs'

const metadata = [
  { title: 'Tab #1', content: 'Content #1' },
  { title: 'Tab #2', content: 'Content #2' },
  { title: 'Tab #3', content: 'Content #3' },
]

export default {
  setup () {
    return {
      tabs: reactive(useTabs({ metadata }))
    }
  }
}
</script>
