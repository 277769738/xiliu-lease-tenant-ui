import request from '@/utils/request'

// 查询员工列表
export function listStaff(query) {
  return request({
    url: '/services/staff/list',
    method: 'get',
    params: query
  })
}
// 新增员工
export function addStaff(data) {
  return request({
    url: '/services/staff/create',
    method: 'post',
    data: data
  })
}

// 修改员工
export function updateStaff(data) {
  return request({
    url: '/services/staff/update',
    method: 'post',
    data: data
  })
}

// 删除员工
export function delStaff(postId) {
  return request({
    url: '/services/staff/' + postId,
    method: 'delete'
  })
}

// 查询员工详细
export function getStaff(postId) {
  return request({
    url: '/services/staff/' + postId,
    method: 'get'
  })
}

// 查询门店列表
export function listApartment(query) {
  return request({
    url: '/services/staff/get-apartment-list',
    method: 'get',
    params: query
  })
}

// 获取已分配门店
export function getAuthApartment(userId) {
  return request({
    url: '/services/staff/get-auth-apartment?userId=' + userId,
    method: 'get'
  })
}

// 分配门店
export function authApartment(data) {
  return request({
    url: '/services/staff/auth-apartment',
    method: 'post',
    data: data
  })
}
