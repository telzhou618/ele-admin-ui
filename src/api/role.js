import request from '@/utils/request'

//获取所有角色
export function getAll(){
  return request({
    url: '/system/role/all',
    method: 'get'
  })
}

export function getList(params) {
  return request({
    url: '/role/page',
    method: 'get',
    params
  })
}
export function add(params) {
  return request({
    url: '/role',
    method: 'post',
    params
  })
}
export function edit(params) {
  return request({
    url: '/role',
    method: 'put',
    params
  })
}
export function del(params) {
  return request({
    url: '/user/'+params,
    method: 'delete'
  })
}
