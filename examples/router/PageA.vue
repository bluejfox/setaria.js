<template>
  <div>
    PageA {{ loadingInitialState ? 'initialState取得中' : initialState }} <input type="button" @click="handleRefreshInitialState" value="刷新initialState">
    <input type="button" @click="handleGetInitialStateData" value="取得initialState数据">
    <div>
      <input type="button" @click="$router.push('b?foo=bar')" value="Go to PageB">
      <input type="button" @click="c2Click" value="Go to PageC2">
      <input type="button" @click="$router.push({name:'pageC1', params:{ 'id':2 }, query: { 'foo': 'bar' }})" value="Go to PageC">
      <input type="button" @click="$router.replace({name:'pageC1', params:{ 'id':2 }, query: { 'foo': 'bar' }})" value="Replace to PageC">
      <input type="button" value="pageForwardWithObject" @click="onGlobalPageForward">
    </div>
    <child></child>
    <ul>
      <li>
        <span class="label">1. 添加事件记录</span>
      </li>
      <li>
        <input type="button" @click="handleAddTrack" value="添加事件"/>
      </li>
      <li>
        <span class="label">2. 调用服务</span>
      </li>
      <li>
        <input type="button" @click="handleCallService" value="调用服务"/>
      </li>
      <li>
        <span class="label">3. 不存在的页面</span>
      </li>
      <li>
        <input type="button" @click="handleGoNonExistPage" value="跳转"/>
      </li>
      <li>
        <span class="label">4. 打开Tab</span>
      </li>
      <li>
        <input type="button" @click="handleOpenTab" value="Tab页打开"/>
      </li>
    </ul>
  </div>
</template>
<script>
  import Setaria, { constants } from 'setaria'
  import Child from './Child.vue'

  export default {
    data() {
      return {
        loadingInitialState: false
      }
    },
    /**
     * Vue实例创建前钩子，$router, $store等实例还没有注入
     */
    beforeCreate () {
      console.log('A beforeCreate', this.initialState ? Object.keys(this.initialState) : null)
    },
    created () {
      console.log('A Created', Object.keys(this.initialState))
    },
    mounted () {
      console.log('A mounted', Object.keys(this.initialState))
    },
    beforeDestroy () {
      console.log('A beforeDestroy')
    },
    destroyed () {
      console.log('A Destroyed')
    },
    beforeRouteEnter (to, from, next) {
      console.log('A beforeRouteEnter')
      next()
    },
    beforeRouteUpdate (to, from, next) {
      console.log('A beforeRouteUpdate')
      next()
    },
    beforeRouteLeave (to, from, next) {
      console.log('A beforeRouteLeave')
      next()
    },
    computed: {
      initialState() {
        return this.$store.getters[constants.STORE_KEY.GET_INITIAL_STATE]
      }
    },
    components: {
      Child,
    },
    methods: {
      handleRefreshInitialState () {
        this.loadingInitialState = true
        Setaria.refreshInitialState()
          .then(() => {
            this.loadingInitialState = false
          })
      },
      handleGetInitialStateData() {
        console.log(Setaria.getInitialStateData())
      },
      handleAddTrack () {
        this.$store.commit(constants.STORE_KEY.ADD_TRACK, {
          componentName: 'ElButton',
          componentLabel: '提交',
          eventName: 'click'
        })
      },
      handleCallService () {
        this.$api.defaults.get('/baidu', {})
      },
      handleGoNonExistPage () {
        this.$router.push({
          path: 'non-exist'
        })
      },
      handleOpenTab() {
        const tab = {
          name: '采购项目工作台',
        };
        this.$router.push({
          global: true,
          tab,
          path: '/web-purchase-project/purchase-workbench',
          query: {
            a: 1,
          },
        });
      },
      onGlobalPageForward () {
        this.$router.push({
          global: true,
          path: '/global-query-complex-param-test-page',
          query: {
            a: {
              foo: 'bar'
            },
            b: 123,
            c: ['1', '2', '3']
          },
          target: '_blank'
        })
      },
      c2Click() {
        this.$router.push({
          name:'pageC2',
          query: { 'foo2': 'bar2' }
        }, () => {
          console.log(window.location.href)
        })
        // window.history.pushState(null, 'title c2', 'http://localhost:6060/router/c/c2?foo2=bar2')
      }
    }
  }
</script>
