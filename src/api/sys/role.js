import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/ucenter/role/list-page',
    method: 'get',
    params: params
  })
}

export function createRole(data) {
  return request({
    url: '/ucenter/role/create',
    method: 'post',
    data: data
  })
}

export function updateRole(id, data) {
  return request({
    url: '/ucenter/role/update/' + id,
    method: 'post',
    data: data
  })
}

export function updateStatus(id, params) {
  return request({
    url: '/ucenter/role/update-status/' + id,
    method: 'post',
    params: params
  })
}

export function deleteRole(id) {
  return request({
    url:'/ucenter/role/' + id,
    method:'delete'
  })
}

export function authRoleMenu(data) {
  return request({
    url: '/ucenter/role/auth-role-menu',
    method: 'post',
    data:data
  })
}
// 查询角色详细
export function getRole(roleId) {
  return request({
    url: '/ucenter/role/' + roleId,
    method: 'get'
  })
}

// 根据角色ID查询部门树结构
export function deptTreeSelect(roleId) {
  return request({
    url: '/ucenter/role/deptTree/' + roleId,
    method: 'get'
  })
}

// 角色数据权限
export function dataScope(data) {
  return request({
    url: '/ucenter/role/dataScope',
    method: 'post',
    data: data
  })
}

// 查询角色已授权用户列表
export function allocatedUserList(query) {
  return request({
    url: '/ucenter/role/authUser/allocatedList',
    method: 'get',
    params: query
  })
}

// 查询角色未授权用户列表
export function unallocatedUserList(query) {
  return request({
    url: '/ucenter/role/authUser/unallocatedList',
    method: 'get',
    params: query
  })
}

// 取消用户授权角色
export function authUserCancel(data) {
  return request({
    url: '/ucenter/role/authUser/cancel',
    method: 'put',
    data: data
  })
}

// 批量取消用户授权角色
export function authUserCancelAll(data) {
  return request({
    url: '/ucenter/role/authUser/cancelAll',
    method: 'put',
    params: data
  })
}

// 授权用户选择
export function authUserSelectAll(data) {
  return request({
    url: '/ucenter/role/authUser/selectAll',
    method: 'put',
    params: data
  })
}







