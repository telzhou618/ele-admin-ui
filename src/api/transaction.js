import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params
  })
}
