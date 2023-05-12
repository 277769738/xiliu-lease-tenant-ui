import request from '@/utils/request'

// 查询租户列表
export function listTenant(query) {
  return request({
    url: '/platform/tenant/list',
    method: 'get',
    params: query
  })
}

// 新增租户
export function addTenant(data) {
  return request({
    url: '/platform/tenant/create',
    method: 'post',
    data: data
  })
}

// 修改租户
export function updateTenant(data) {
  return request({
    url: '/platform/tenant/update/' + data.tenantId,
    method: 'post',
    data: data
  })
}

// 删除租户
export function delTenant(tenantId) {
  return request({
    url: '/platform/tenant/' + tenantId,
    method: 'delete'
  })
}

// 查询租户详细
export function getTenant(tenantId) {
  return request({
    url: '/platform/tenant/' + tenantId,
    method: 'get'
  })
}
