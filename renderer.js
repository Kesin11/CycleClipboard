// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// vueではなくてvue/dist/vue.jsをrequireするとruntime + compilerとなる
// https://stackoverflow.com/questions/39488660/vue-js-2-0-not-rendering-anything
const Vue = require('vue/dist/vue.js')
const ipcRenderer = require('electron').ipcRenderer
console.log('require renderer')

const AppComponent = Vue.component('app', {
  template: `
    <div id="foo">
      <div>count: {{ count }}</div>
      <ul v-for="entrie in entries">
        <li>{{ entrie.count }}</li>
      </ul>
    </div>
  `,
  props: {
    entries: {
      default: []
    },
    count: {
      default: 1
    }
  }
})

const app = new Vue({
  el: '#vue',
  data: {
    count: 1,
    entries: []
  },
  components: { AppComponent },
  methods: {
    countUp (count) {
      this.count += count
      this.entries.push({count: count})
    }
  }
})

ipcRenderer.on('countUp', (event, payload) => {
  console.log("payload", payload)
  app.countUp(payload)
})
