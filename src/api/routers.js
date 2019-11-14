import axios from '@/libs/api.request'

export const getRouterReq = (access) => {
  return axios.request({
    url: '/v1/get_router',
    params: {
      access
    },
    method: 'get'
  })
}
