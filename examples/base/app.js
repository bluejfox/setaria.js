import Vue from 'vue'
import Setaria from 'setaria'
import Base from './Base.vue'

Setaria.config.message = require('./message.json')

new Vue({
  el: '#app',
  store: Setaria.plugin.store,
  render: h => h(Base)
})
