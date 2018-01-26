import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/user/page',
    method: 'get',
    params
  })
}
