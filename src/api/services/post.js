import request from '@/utils/request'

// 查询职务列表
export function listPost(query) {
  return request({
    url: '/services/post/list',
    method: 'get',
    params: query
  })
}
// 查询全部部门、职务
export function getPostList() {
  return request({
    url: '/services/post/get-list',
    method: 'get'
  })
}

// 新增职务
export function addPost(data) {
  return request({
    url: '/services/post/create',
    method: 'post',
    data: data
  })
}

// 修改职务
export function updatePost(data) {
  return request({
    url: '/services/post/update/' + data.postId,
    method: 'post',
    data: data
  })
}

// 删除职务
export function delPost(postId) {
  return request({
    url: '/services/post/' + postId,
    method: 'delete'
  })
}

// 查询职务详细
export function getPost(postId) {
  return request({
    url: '/services/post/' + postId,
    method: 'get'
  })
}
