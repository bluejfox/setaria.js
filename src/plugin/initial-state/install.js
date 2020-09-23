// import Vue from 'vue'
import { getHttp } from '../http/index'
import { getRouter } from '../router/index'
import { getStore } from '../store/index'
import { STORE_KEY } from '../../shared/constants'
import { isEmpty, isNotEmpty } from '../../util/lang'

export default function install (Setaria, Vue, options) {
  if (isEmpty(options)) {
    return
  }
  const { entry, error, loading } = options
  // 实例化Vue根组件
  if (isNotEmpty(entry)) {
    // 进行异步处理，getInitialState函数必须返回Promise
    if (typeof entry.getInitialState === 'function') {
      Setaria.refreshInitialState = Vue.prototype.$setaria.api.refreshInitialState = () => {
        return getInitialState(entry, getHttp(), getRouter(), getStore())
      }
      Vue.component(
        'async-app',
        // 这个动态导入会返回一个 `Promise` 对象。
        () => (
          {
            // 需要加载的组件 (应该是一个 `Promise` 对象)
            component: getInitialState(entry, getHttp(), getRouter(), getStore()),
            // 异步组件加载时使用的组件
            loading,
            // 加载失败时使用的组件
            error,
            // 展示加载时组件的延时时间。默认值是 200 (毫秒)
            delay: 200,
            // 如果提供了超时时间且组件加载也超时了，
            // 则使用加载失败时使用的组件。默认值是：`Infinity`
            timeout: 3000
          }
        )
      )
      createRootVue(Vue, {
        el: entry.el,
        render: h => {
          return h('async-app')
        }
      })
      // option "el" can only be used during instance creation with the `new` keyword.
      if (entry.el) {
        delete entry.el
      }
    } else {
      createRootVue(Vue, entry)
    }
  }
}

function createRootVue (Vue, options) {
  if (isEmpty(options.sdk)) {
    options.sdk = {}
  }
  new Vue(options)
}

function getInitialState (entry, http, router, store) {
  return new Promise((resolve, reject) => {
    entry.getInitialState({
      http,
      router,
      store
    }).then((res) => {
      store.commit(STORE_KEY.SET_INITIAL_STATE, {
        data: res
      })
      resolve(entry)
    }).catch((error) => {
      store.commit(STORE_KEY.SET_INITIAL_STATE, {
        error
      })
      reject(error)
    })
  })
}
