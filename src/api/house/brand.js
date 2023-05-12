import request from '@/utils/request'

// 查询品牌分类列表
export function listBrand(query) {
  return request({
    url: '/house/brand/list',
    method: 'get',
    params: query
  })
}

// 查询品牌分类详细
export function getBrand(brandId) {
  return request({
    url: '/house/brand/' + brandId,
    method: 'get'
  })
}

// 新增品牌分类
export function addBrand(data) {
  return request({
    url: '/house/brand/create',
    method: 'post',
    data: data
  })
}

// 修改品牌分类
export function updateBrand(brandId,data) {
  return request({
    url: '/house/brand/update/' + brandId,
    method: 'post',
    data: data
  })
}

// 删除品牌分类
export function delBrand(brandId) {
  return request({
    url: '/house/brand/' + brandId,
    method: 'delete'
  })
}
