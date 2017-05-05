// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// vueではなくてvue/dist/vue.jsをrequireするとruntime + compilerとなる
// https://stackoverflow.com/questions/39488660/vue-js-2-0-not-rendering-anything
const Vue = require('vue/dist/vue.js')
console.log('require renderer')

const app = Vue.component('app', {
  template: `
    <div>app {{ message }}</div>
  `,
  data: () => {
      return {
        message: 'todo',
    }
  }
})
new Vue({
  el: '#app',
  render: h => h(app),
})