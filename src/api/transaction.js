import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/user/page',
    method: 'get',
    params
  })
}
