import { ref, computed, onBeforeUpdate, Ref } from 'vue'
import { useConditionalDisplay, useListeners, useBindings } from '@baleada/vue-features/affordances'

type Required = {
  metadata: Metadatum[]
}

type Metadatum = {
  tab: string,
  panel: string,
}

type Tab = {
  tab: string,
  isSelected: Ref<boolean>
}

type Panel = {
  panel: string,
  isSelected: Ref<boolean>,
}

type TabList = {
  tabs: { ref: FunctionRef, values: Tab[] },
  panels: { ref: FunctionRef, values: Panel[] },
  list: { ref: FunctionRef },
  selected: Ref<number>
}

type FunctionRef = (el: HTMLElement, index: number) => void

export default function useTabList ({ metadata }: Required): TabList {
  const selected = ref(0),
        tabsEls = ref<HTMLElement[]>([]),
        tabs = metadata.map(({ tab, panel }: Metadatum, index): Tab => {
          const isSelected = computed(() => index === selected.value),
                tabEl = computed(() => tabsEls.value[index])

          useListeners({
            target: tabEl,
            listeners: {
              click: () => (selected.value = index)
            }
          })

          useBindings({
            target: tabEl,
            bindings: { ariaRole: 'tab' },
          })

          return { tab, isSelected }
        }),
        panelsEls = ref<HTMLElement[]>([]),
        panels = metadata.map(({ tab, panel }: Metadatum, index): Panel => {
          const isSelected = computed(() => index === selected.value),
                panelEl = computed(() => panelsEls.value[index])

          useConditionalDisplay({ target: panelEl, condition: isSelected })

          useBindings({
            target: panelEl,
            bindings: {
              ariaRole: 'tabpanel',
              ariaExpanded: computed(() => isSelected.value || ''),
            },
          })

          return { panel, isSelected }
        })

  onBeforeUpdate(() => {
    tabsEls.value = []
    panelsEls.value = []
  })
  

  const listEl = ref(null)
  useBindings({
    target: listEl,
    bindings: {
      ariaRole: 'tablist'
    }
  })

  return {
    // Since the tabs and panels refs get bound to a v-for, they're required to be function refs
    // with a little extra logic inside.
    // 
    // https://v3.vuejs.org/guide/composition-api-template-refs.html#usage-inside-v-for
    //
    // To keep the developer experience consistent, all other element refs are exposed
    // as functions, too. That way, developers know they can consistently bind every 
    // element ref (e.g. <div :ref="myRef" />) instead of passing strings to some elements
    // and binding refs to others.
    tabs: {
      ref: (el, index) => (tabsEls.value[index] = el),
      values: tabs,
    },
    panels: {
      ref: (el, index) => (panelsEls.value[index] = el),
      values: panels,
    },
    list: {
      ref: el => (listEl.value = el),
    },
    selected,
  }
}
