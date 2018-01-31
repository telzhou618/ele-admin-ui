import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params
  })
}
export function getRoleIds(userId) {
  return request({
    url: '/system/user/getRoleIds',
    method: 'get',
    params:{
      userId : userId
    }
  })
}
export function add(params) {
  return request({
    url: '/system/user/add',
    method: 'post',
    params
  })
}
export function edit(params) {
  return request({
    url: '/system/user/edit',
    method: 'put',
    params
  })
}
export function del(params) {
  return request({
    url: '/system/user/delete',
    method: 'delete',
    params
  })
}
