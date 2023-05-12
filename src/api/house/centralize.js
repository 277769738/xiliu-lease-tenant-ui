import request from '@/utils/request'

// 查询列表
export function listCentralize(query) {
  return request({
    url: '/house/centralize/list',
    method: 'get',
    params: query
  })
}

// 下定
export function saveAdvance(data) {
  return request({
    url: '/house/subscribe/create',
    method: 'post',
    data: data
  })
}

// 查询列表
export function getCentralizeInfo(houseId, state) {
  return request({
    url: '/house/centralize/info?houseId=' + houseId + '&state=' + state,
    method: 'get'
  })
}
