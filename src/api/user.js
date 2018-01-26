import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/user/page',
    method: 'get',
    params
  })
}
export function editUser(params) {
  return request({
    url: '/user',
    method: 'put',
    params
  })
}
export function delUser(params) {
  return request({
    url: '/user/'+params,
    method: 'delete'
  })
}
