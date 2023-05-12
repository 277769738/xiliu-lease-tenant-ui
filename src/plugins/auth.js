import store from '@/store'

function authPermission(permission) {
  const all_per = "*:*:*";
  // 从容器里面取出权限
  const permissions = store.getters && store.getters.permissions
  if (permission && permission.length > 0) {
    // 判断权限是否包含传过来的
    return permissions.some(p => {
      return all_per === p || p === permission
    })
  } else {
    return false
  }
}


export default {
  // 验证用户是否有相关权限
  hasPermi(permission) {
    return authPermission(permission);
  },
  // 验证用户是否含有指定权限，只需包含其中一个
  hasPermiOr(permissions) {
    return permissions.some(item => {
      return authPermission(item)
    })
  },
}
