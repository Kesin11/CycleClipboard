// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// vueではなくてvue/dist/vue.jsをrequireするとruntime + compilerとなる
// https://stackoverflow.com/questions/39488660/vue-js-2-0-not-rendering-anything
const Vue = require('vue/dist/vue.js')
const ipcRenderer = require('electron').ipcRenderer
const { RELOAD_ENTRIES, SUBMIT_ENTRY } = require('./lib/EventTypes')

const AppComponent = Vue.component('app', {
  template: `
    <div id="foo">
      <h3>{{ selected_entry }}</h3>
      <ul v-for="entry in rest_entries">
        <li>{{ entry }}</li>
      </ul>
    </div>
  `,
  props: {
    selected_entry: {
      default: ''
    },
    rest_entries: {
      default: []
    }
  }
})

const app = new Vue({
  el: '#vue',
  data: {
    selectedEntry: '',
    restEntries: []
  },
  components: { AppComponent },
  methods: {
    changeEntries (newEntries) {
      const entries = [].concat(newEntries)
      this.selectedEntry = entries.pop()
      this.restEntries = entries
    }
  }
})

ipcRenderer.on(RELOAD_ENTRIES, (_event, entries) => {
  app.changeEntries(entries)
})

// submit when press Enter key
window.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    ipcRenderer.send(SUBMIT_ENTRY)
  }
})
