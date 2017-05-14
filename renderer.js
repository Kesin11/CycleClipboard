// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// vueではなくてvue/dist/vue.jsをrequireするとruntime + compilerとなる
// https://stackoverflow.com/questions/39488660/vue-js-2-0-not-rendering-anything
const Vue = require('vue/dist/vue.js')
const ipcRenderer = require('electron').ipcRenderer
const { RELOAD_ENTRIES, SUBMIT_ENTRY, FIX_ENTRY } = require('./lib/EventTypes')

const AppComponent = Vue.component('app', {
  template: `
    <div id="app">
      <div class="panel panel-default selected-entry">
        <div class="panel-body selected-entry-inner" v-bind:class="{ 'fix-entry-animation': fix_entry_flash }">
          {{ selected_entry }}
        </div>
      </div>
      <transition-group name="list" tag="ul" class="list-group entry-list">
        <li class="list-group-item list-entry" v-for="entry in rest_entries" v-bind:key="entry">
          {{ entry }}
        </li>
      </transition-group>
    </div>
  `,
  props: {
    selected_entry: {
      default: ''
    },
    rest_entries: {
      default: []
    },
    fix_entry_flash: {
      default: false
    }
  }
})

const app = new Vue({
  el: '#vue',
  data: {
    selectedEntry: '',
    restEntries: [],
    fix_entry_flash: false
  },
  components: { AppComponent },
  methods: {
    changeEntries (newEntries) {
      const entries = [].concat(newEntries)
      this.selectedEntry = entries.pop()
      this.restEntries = entries
    },
    startFixEntryAnimation () {
      this.fix_entry_flash = true
      setTimeout(() => { this.fix_entry_flash = false }, 1000)
    }
  }
})

ipcRenderer.on(RELOAD_ENTRIES, (_event, entries) => {
  app.changeEntries(entries)
})

ipcRenderer.on(FIX_ENTRY, (_event) => {
  app.startFixEntryAnimation()
})

// submit when press Enter key
window.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    ipcRenderer.send(SUBMIT_ENTRY)
  }
})
