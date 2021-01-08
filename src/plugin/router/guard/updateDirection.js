import { getStore } from '../../store/index'
import { ROUTER, STORE_KEY } from '../../../shared/constants'

const DIRECTION_KEY = ROUTER.DIRECTION.KEY

export default function (to, from, next) {
  const store = getStore()
  const { params, query } = to
  const currentPageFullPath = from.fullPath
  let direction = ''
  const nextPageFullPath = to.fullPath
  // 设置了path的场合，params会被无视
  if (query && typeof query[DIRECTION_KEY] === 'string') {
    direction = query[DIRECTION_KEY]
  } else if (params && params[DIRECTION_KEY]) {
    direction = params[DIRECTION_KEY]
  }
  // 保存跳转方向
  store.commit(STORE_KEY.SET_DIRECTION, direction)
  // 浏览器前进／后退按钮点击 或 点击了页面链接 的场合
  store.commit(STORE_KEY.UPDATE_DIRECTION, {
    current: currentPageFullPath,
    next: nextPageFullPath
  })
  // if (direction === '') {
  //   direction = 'forward'
  //   // 保存跳转方向
  //   store.commit('common/direction', direction)
  // }
  next()
}
