/**
 * v-hasPermission 自定义指令 操作权限处理
 */

import store from '@/store'

export default {
  // 指令的定义
  inserted: function (el, binding, vnode) {
    const { value } = binding
    const all_permission = "*:*:*"
    const permissions = store.getters && store.getters.permissions

    if (value && value instanceof Array && value.length > 0) {
      const permissonFlag = value

      const hasPermissions = permissions.some(p =>{
        return all_permission === p || permissonFlag.includes(p)
      })

      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`请设置操作权限标签值`)
    }
  }
}
