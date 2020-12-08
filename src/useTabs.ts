import { ref, computed, onBeforeUpdate, Ref } from 'vue'
import { useConditionalDisplay, useListeners } from '@baleada/vue-features/affordances'

type Required = {
  metadata: Metadatum[]
}

type Metadatum = {
  title: string,
  content: string,
}

type Tab = Metadatum & {
  isSelected: Ref<boolean>
}

type Title = {
  title: string,
  isSelected: Ref<boolean>
}

type Content = {
  content: string,
}

type Tabs = {
  titles: { ref: FunctionRef, values: Title[] },
  contents: { ref: FunctionRef, values: Content[] },
  selected: Ref<number>
}

type FunctionRef = (el: HTMLElement, index: number) => void

export default function useTabs ({ metadata }: Required): Tabs {
  const selected = ref(0),
        titlesEls = ref<HTMLElement[]>([]),
        titles = metadata.map(({ title, content }: Metadatum, index): Title => {
          const isSelected = computed(() => index === selected.value),
                titleEl = computed(() => titlesEls.value[index])

          useListeners({
            target: titleEl,
            listeners: {
              click: () => (selected.value = index)
            }
          })

          return { title, isSelected }
        }),
        contentsEls = ref<HTMLElement[]>([]),
        contents = metadata.map(({ title, content }: Metadatum, index): Content => {
          const isSelected = computed(() => index === selected.value),
                contentEl = computed(() => contentsEls.value[index])

                useConditionalDisplay({ target: contentEl, condition: isSelected })

          return { content }
        })

  onBeforeUpdate(() => {
    titlesEls.value = []
    contentsEls.value = []
  })
        // values = metadata.map((metadatum: Metadatum, index): Tab => {
        //   const isSelected = computed(() => index === selected.value),
        //         titleEl = computed(() => titlesEls.value[index]),
        //         contentEl = computed(() => contentsEls.value[index])

        //   useListeners({
        //     target: titleEl,
        //     listeners: {
        //       click: () => (selected.value = index)
        //     }
        //   })

        //   useConditionalDisplay({ target: contentEl, condition: isSelected })

        //   return { ...metadatum, isSelected }
        // })
  
  return {
    // Since the titles and contents refs get bound to a v-for, they're required to be function refs
    // with a little extra logic inside.
    // 
    // https://v3.vuejs.org/guide/composition-api-template-refs.html#usage-inside-v-for
    //
    // To keep the developer experience consistent, all other element refs are exposed
    // as functions, too. That way, developers know they can consistently bind every 
    // element ref (e.g. <div :ref="myRef" />) instead of passing strings to some elements
    // and binding refs to others.
    titles: {
      ref: (el, index) => {
        titlesEls.value[index] = el
      },
      values: titles,
    },
    contents: {
      ref: (el, index) => {
        contentsEls.value[index] = el
      },
      values: contents,
    },
    // values,
    selected,
  }
}
