import axios from '@/libs/api.request'

// 获取设备列表
export const getDashboradInfo = () => {
  return axios.request({
    url: '/v1/dashboard/',
    method: 'get',
    params: {}
  })
}
