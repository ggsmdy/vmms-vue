import axios from '@/libs/api.request'

// 获取原料订单列表
export const getStuffOrderList = (curPage, pageSize) => {
  return axios.request({
    url: '/v1/order/stuff/list/',
    method: 'get',
    params: {
      curPage: curPage,
      pageSize: pageSize
    }
  })
}

// 提交原料订单列表
export const addStuffOrder = (data) => {
  return axios.request({
    url: '/v1/order/stuff/list/',
    method: 'post',
    data
  })
}

// 切换订单状态
export const changeStuffOrder = (data, pk) => {
  return axios.request({
    url: '/v1/order/stuff/detail/' + pk + '/',
    method: 'post',
    data
  })
}

// 获取订单详细状态
export const getStuffOrderDetail = (pk) => {
  return axios.request({
    url: '/v1/order/stuff/detail/' + pk + '/',
    method: 'get'
  })
}

// 获取订单付款状态
export const getStuffOrderPayment = (pk) => {
  return axios.request({
    url: '/v1/order/stuff/pay/' + pk + '/',
    method: 'get'
  })
}

// 获取原料库存列表
export const getStuffRemain = (curPage, pageSize) => {
  return axios.request({
    url: '/v1/order/stuff/remain/',
    method: 'get',
    params: {
      limit: pageSize,
      offset: pageSize * (curPage - 1)
    }
  })
}

// 变更原料库存
export const changeStuffRemain = (data, pk) => {
  return axios.request({
    url: '/v1/order/stuff/remain/' + pk + '/',
    method: 'put',
    data
  })
}

// 退款接口
export const refundOrder = (data) => {
  return axios.request({
    url: '/v1/order/refund/',
    method: 'post',
    data
  })
}
