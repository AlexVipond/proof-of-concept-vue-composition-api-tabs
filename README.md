# Vue Composition API Tabs


[View live example on Netlify](https://proof-of-concept-vue-composition-api-tabs.netlify.app/).


In this repo, I built a Vue-powered tab-switcher.

In Vue 2, the classic way to solve this problem is with a **compound component**. More specifically, you could create a `TabContainer` component to hold shared state (i.e. an ID for the currently active tab), a `Tab` component that listens for click events and sets the active tab accordingly, and a `TabPanel` component to conditionally render the correct content.

```html
<TabContainer>
  <Tab>...</Tab>
  <Tab>...</Tab>
  
  <TabPanel>...</TabPanel>
  <TabPanel>...</TabPanel>
</TabContainer>
```

With Vue 3, however, it's possible to store that shared state in a composition function, and fully eliminate the need for a `TabContainer` component.

Furthermore, it's possible to implement all event listening, attribute binding, and conditional rendering inside the composition function as well. The function can return refs, and the developer can simply attach those refs to their HTML to add all functionality offered by the composition function.

```html
<!--
  A root element is included here for accessibility purposes,
  but it's not a component and doesn't manage any shared state.
-->
<div :ref="tablist.list.ref" class="tablist">
  <div
    v-for="({ tab, isSelected }, index) in tablist.tabs.values"
    :key="index"
    :ref="el => tablist.tabs.ref(el, index)"
    class="tab"
    :class="isSelected ? 'selected' : ''"
  >
    {{ tab }}
  </div>
  <div
    v-for="({ panel }, index) in tablist.panels.values"
    :key="index"
    :ref="el => tablist.panels.ref(el, index)"
    class="panel"
  >
    {{ panel }}
  </div>
</div>
```


Visit src/App.vue for a complete example of what this API looks like for the developer. Visit src/useTabList.ts to get a sense of the authoring experience.

Note: This repo exists to demonstrate the basic concepts of authoring and consuming this Vue pattern—it's not a fully accessible demo. To demonstrate attribute binding, I added aria roles, but in an enterprise-grade solution, I would go further, authoring the `useTabList` composition function to attach additional event listeners to make sure the tablist is keyboard accessible.



## Motivation

Compound components are a useful pattern, but I think the pattern I present in this repo offers some improvements:
1. It allows the author to collocate logic, whereas compound components tend to force the author to spread related logic across various components.
2. All state is managed and accessed in the same function scope, whereas compound components often force the auther to share state through `provide`/`inject`.
3. This pattern returns full control over markup to the developer. It gives the developer a stronger feeling of writing plain HTML and CSS, sprinkled with `:ref` bindings and simple `setup` functions whenever advanced functionality is needed.


## Meta

This example is a Vite app. To run locally:

1. Clone the repo
2. `npm install`
3. `npm run dev`
4. Visit http://localhost:3000


