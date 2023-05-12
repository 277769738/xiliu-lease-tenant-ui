import request from '@/utils/request'

// 获取省份列表
export function getProvinceList() {
  return request({
    url: '/house/area/get-province-list',
    method: 'get'
  })
}

// 获取省份列表
export function getCityList(type,name,parentName) {
  return request({
    url: '/house/area/get-city-list?type=' + type + '&name=' + name + '&parentName=' + parentName,
    method: 'get'
  })
}
