// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// vueではなくてvue/dist/vue.jsをrequireするとruntime + compilerとなる
// https://stackoverflow.com/questions/39488660/vue-js-2-0-not-rendering-anything
const Vue = require('vue/dist/vue.js')
const ipcRenderer = require('electron').ipcRenderer
const { ROTATE_CLIPBOARD } = require('./lib/EventTypes')

const AppComponent = Vue.component('app', {
  template: `
    <div id="foo">
      <ul v-for="entry in entries">
        <li>{{ entry }}</li>
      </ul>
    </div>
  `,
  props: {
    entries: {
      default: []
    }
  }
})

const app = new Vue({
  el: '#vue',
  data: {
    entries: []
  },
  components: { AppComponent },
  methods: {
    changeEntries (entries) {
      this.entries = entries.reverse()
    }
  }
})

ipcRenderer.on(ROTATE_CLIPBOARD, (_event, entries) => {
  console.log(ROTATE_CLIPBOARD, entries)
  app.changeEntries(entries)
})
