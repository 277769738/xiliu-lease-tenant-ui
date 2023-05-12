import request from '@/utils/request'

// 查询套餐列表
export function listTenantpackage(query) {
  return request({
    url: '/platform/package/list',
    method: 'get',
    params: query
  })
}

// 新增套餐
export function addTenantpackage(data) {
  return request({
    url: '/platform/package/create',
    method: 'post',
    data: data
  })
}

// 修改套餐
export function updateTenantpackage(data) {
  return request({
    url: '/platform/package/update/' + data.packageId,
    method: 'post',
    data: data
  })
}

// 删除套餐
export function delTenantpackage(packageId) {
  return request({
    url: '/platform/package/' + packageId,
    method: 'delete'
  })
}

// 查询套餐详细
export function getTenantpackage(packageId) {
  return request({
    url: '/platform/package/' + packageId,
    method: 'get'
  })
}

// 获取租户套餐精简信息列表
export function getTenantPackageList() {
  return request({
    url: '/platform/package/get-simple-list',
    method: 'get'
  })
}
