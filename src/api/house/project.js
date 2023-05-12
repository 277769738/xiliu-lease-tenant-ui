import request from '@/utils/request'

// 查询项目分类列表
export function listProject(query) {
  return request({
    url: '/house/project/list',
    method: 'get',
    params: query
  })
}

// 查询项目分类详细
export function getProject(projectId) {
  return request({
    url: '/house/project/' + projectId,
    method: 'get'
  })
}

// 新增项目分类
export function addProject(data) {
  return request({
    url: '/house/project/create',
    method: 'post',
    data: data
  })
}

// 修改项目分类
export function updateProject(projectId,data) {
  return request({
    url: '/house/project/update/' + projectId,
    method: 'post',
    data: data
  })
}

// 删除项目分类
export function delProject(projectId) {
  return request({
    url: '/house/project/' + projectId,
    method: 'delete'
  })
}
