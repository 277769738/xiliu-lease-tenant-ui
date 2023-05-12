import request from '@/utils/request'

// 查询部门列表
export function listDept(query) {
  return request({
    url: '/ucenter/dept/list',
    method: 'get',
    params: query
  })
}

// 查询部门列表（排除节点）
export function listDeptExcludeChild(deptId) {
  return request({
    url: '/ucenter/dept/list/exclude/' + deptId,
    method: 'get'
  })
}

// 查询部门详细
export function getDept(deptId) {
  return request({
    url: '/ucenter/dept/' + deptId,
    method: 'get'
  })
}

// 查询部门下拉树结构
export function treeselect() {
  return request({
    url: '/ucenter/dept/treeselect',
    method: 'get'
  })
}

// 根据角色ID查询部门树结构
export function roleDeptTreeselect(roleId) {
  return request({
    url: '/ucenter/dept/roleDeptTreeselect/' + roleId,
    method: 'get'
  })
}

// 新增部门
export function addDept(data) {
  return request({
    url: '/ucenter/dept/create',
    method: 'post',
    data: data
  })
}

// 修改部门
export function updateDept(deptId,data) {
  return request({
    url: '/ucenter/dept/update/' + deptId,
    method: 'post',
    data: data
  })
}

// 删除部门
export function delDept(deptId) {
  return request({
    url: '/ucenter/dept/delete/' + deptId,
    method: 'post'
  })
}
