import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data: data
  })
}

export function getInfo() {
  return request({
    url: '/get-info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg(data) {
  return request({
    url: '/captcha/get-captcha',
    method: 'post',
    data: data,
    timeout: 20000
  })
}

// 获取路由
export const getRouters = () => {
  return request({
    url: '/get-routers',
    method: 'get'
  })
}
