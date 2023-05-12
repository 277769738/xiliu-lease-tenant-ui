import request from '@/utils/request'

// 新增房源
export function addRoom(data) {
  return request({
    url: '/house/room/create',
    method: 'post',
    data: data
  })
}
// 查询房源列表
export function listRoom(query) {
  return request({
    url: '/house/room/list',
    method: 'get',
    params: query
  })
}

// 查询房源详细
export function getRoom(houseId) {
  return request({
    url: '/house/room/' + houseId,
    method: 'get'
  })
}

// 下载房源导入模板
export function importTemplate() {
  return request({
    url: '/house/room/get-import-template',
    method: 'get',
    responseType: 'blob'
  })
}

// 修改房源信息表
export function updateRoom(data) {
  return request({
    url: '/house/room/update/' + data.houseId,
    method: 'post',
    data: data
  })
}

// 删除房源信息表
export function delRoom(houseId) {
  return request({
    url: '/house/room/' + houseId,
    method: 'delete'
  })
}

// 查询房源其他费用详细
export function getHouseFeeInfo(houseId) {
  return request({
    url: '/house/room/fee/' + houseId,
    method: 'get'
  })
}
