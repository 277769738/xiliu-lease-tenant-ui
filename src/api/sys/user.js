import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/common";

export function getUserList(params) {
  return request({
    url: '/ucenter/user/list-page',
    method: 'get',
    params: params
  })
}

export function createUser(data) {
  return request({
    url: '/ucenter/user/add',
    method: 'post',
    data: data
  })
}

export function updateUser(id,data) {
  return request({
    url: '/ucenter/user/update/'+ id,
    method: 'post',
    data: data
  })
}

export function deleteUser(id) {
  return request({
    url: '/ucenter/user/delete/' + id,
    method: 'post'
  })
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/ucenter/user/' + parseStrEmpty(userId),
    method: 'get'
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/ucenter/user/profile/avatar',
    method: 'post',
    data: data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/ucenter/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/ucenter/user/profile',
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/ucenter/user/profile/updatePwd',
    method: 'put',
    params: data
  })
}
