import request from '@/utils/request'

export function uploadImage(data) {
  return request({
    url:'/cos/upload/image',
    method: 'post',
    data: data
  })
}

export function getCosTempKey(data) {
  return request({
    url:'/cos/temp-key',
    method: 'get'
  })
}
