import request from '@/utils/request'

// 查询公寓信息表列表
export function listApartment(query) {
  return request({
    url: '/house/apartment/list',
    method: 'get',
    params: query
  })
}

// 查询公寓信息表详细
export function getApartment(apartmentId) {
  return request({
    url: '/house/apartment/' + apartmentId,
    method: 'get'
  })
}

// 新增公寓信息表
export function addApartment(data) {
  return request({
    url: '/house/apartment/create',
    method: 'post',
    data: data
  })
}

// 修改公寓信息表
export function updateApartment(apartmentId,data) {
  return request({
    url: '/house/apartment/update/' + apartmentId,
    method: 'post',
    data: data
  })
}

// 删除公寓信息表
export function delApartment(apartmentId) {
  return request({
    url: '/house/apartment/' + apartmentId,
    method: 'delete'
  })
}

// 下载公寓导入模板
export function importTemplate() {
  return request({
    url: '/house/apartment/get-import-template',
    method: 'get',
    responseType: 'blob'
  })
}

// 获取用户项目列表
export function getUserProjectList() {
  return request({
    url: '/house/apartment/get-project-list',
    method: 'get'
  })
}

// 获取用户公寓列表
export function getUserApartmentList() {
  return request({
    url: '/house/apartment/get-user-apartment',
    method: 'get'
  })
}

// 查询公寓简单信息
export function getSimpleApartment(apartmentId) {
  return request({
    url: '/house/apartment/get-simple-info/' + apartmentId,
    method: 'get'
  })
}
