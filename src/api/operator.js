import axios from '@/libs/api.request'

// 获取消费订单列表
export const getOrderInfo = (curPage, pageSize, kwargs,value) => {
  let params = {
    limit: pageSize,
    offset: pageSize * (curPage - 1)
  }
  if(value!=null){
    params = Object.assign(params,value)
  }
  params = Object.assign(params, kwargs)
  return axios.request({
    url: '/v1/operator/order/',
    method: 'get',
    params
  })
}

export const getExportOrderInfo = (kwargs) => {
  let params = kwargs
  return axios.request({
    url: '/v1/operator/order/',
    method: 'get',
    params
  })
}
