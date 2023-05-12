import request from '@/utils/request'

// 查询系统访问日志表列表
export function listLog(query) {
  return request({
    url: '/system/loginlog/list',
    method: 'get',
    params: query
  })
}

// 删除登录日志
export function delLoginlog(infoId) {
  return request({
    url: '/system/loginlog/' + infoId,
    method: 'delete'
  })
}

// 清空登录日志
export function cleanLoginlog() {
  return request({
    url: '/system/loginlog/clean',
    method: 'delete'
  })
}
