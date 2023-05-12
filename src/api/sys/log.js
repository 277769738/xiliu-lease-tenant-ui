import request from '@/utils/request'

// 查询操作日志表列表
export function listLog(query) {
  return request({
    url: '/system/operlog/list',
    method: 'get',
    params: query
  })
}

// 查询操作日志表详细
export function getLog(operId) {
  return request({
    url: '/system/operlog/' + operId,
    method: 'get'
  })
}

// 新增操作日志表
export function addLog(data) {
  return request({
    url: '/system/operlog/create',
    method: 'post',
    data: data
  })
}

// 修改操作日志表
export function updateLog(operId,data) {
  return request({
    url: '/system/operlog/update/' + operId,
    method: 'post',
    data: data
  })
}

// 删除操作日志表
export function delLog(operId) {
  return request({
    url: '/system/operlog/' + operId,
    method: 'delete'
  })
}
