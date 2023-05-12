import request from '@/utils/request'

// 查询字典表列表
export function listDict(query) {
  return request({
    url: '/system/dict/list',
    method: 'get',
    params: query
  })
}

// 查询字典表详细
export function getDict(dictId) {
  return request({
    url: '/system/dict/' + dictId,
    method: 'get'
  })
}

// 新增字典表
export function addDict(data) {
  return request({
    url: '/system/dict/create',
    method: 'post',
    data: data
  })
}

// 修改字典表
export function updateDict(dictId,data) {
  return request({
    url: '/system/dict/update/' + dictId,
    method: 'post',
    data: data
  })
}

// 删除字典表
export function delDict(dictId) {
  return request({
    url: '/system/dict/' + dictId,
    method: 'delete'
  })
}

// 获取字典选择框列表
export function optionselect() {
  return request({
    url: '/system/dict/optionselect',
    method: 'get'
  })
}

// 刷新字典缓存
export function refreshCache() {
  return request({
    url: '/system/dict/refreshCache',
    method: 'delete'
  })
}
