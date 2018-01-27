import request from '@/utils/request'

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

export function exec(params){
  return request({
    url: '/role',
    method: params.method,
    params
  })
}
