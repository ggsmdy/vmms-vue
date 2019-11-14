import axios from '@/libs/api.request'

export const getMemberList = (curPage, pageSize, kwargs) => {
  let params = {
    limit: pageSize,
    offset: pageSize * (curPage - 1)
  }
  params = Object.assign(params, kwargs)
  return axios.request({
    url: '/v1/member/list/',
    method: 'get',
    params
  })
}

export const getRechargeConf = () => {
  return axios.request({
    url: '/v1/recharge/conf/',
    method: 'get',
    params: {}
  })
}

export const addRechargeConf = (data) => {
  return axios.request({
    url: '/v1/recharge/conf/',
    method: 'post',
    data
  })
}

export const delRechargeConf = (id) => {
  return axios.request({
    url: '/v1/recharge/conf/' + id + '/',
    method: 'delete',
    params: {}
  })
}

export const editRechargeConf = (id, data) => {
  return axios.request({
    url: '/v1/recharge/conf/' + id + '/',
    method: 'put',
    data
  })
}

export const getIntegralConf = () => {
  return axios.request({
    url: '/v1/integral/conf/',
    method: 'get',
    params: {}
  })
}

export const addIntegralConf = (data) => {
  return axios.request({
    url: '/v1/integral/conf/',
    method: 'post',
    data
  })
}

export const delIntegralConf = (id) => {
  return axios.request({
    url: '/v1/integral/conf/' + id + '/',
    method: 'delete',
    params: {}
  })
}

export const editIntegralConf = (id, data) => {
  return axios.request({
    url: '/v1/integral/conf/' + id + '/',
    method: 'put',
    data
  })
}

export const getGoods = () => {
  return axios.request({
    url: '/v1/goods/',
    method: 'get',
    params: {}
  })
}

export const addGoods = (data) => {
  return axios.request({
    url: '/v1/goods/',
    method: 'post',
    data
  })
}

export const editGoods = (pk, data) => {
  return axios.request({
    url: '/v1/goods/' + pk + '/',
    method: 'put',
    data
  })
}

export const delGoods = (pk) => {
  return axios.request({
    url: '/v1/goods/' + pk + '/',
    method: 'delete'
  })
}

export const getMessage = (curPage, pageSize) => {
  return axios.request({
    url: '/v1/message/list/',
    method: 'get',
    params: {
      limit: pageSize,
      offset: pageSize * (curPage - 1)
    }
  })
}

export const addMessage = (data) => {
  return axios.request({
    url: '/v1/message/list/',
    method: 'post',
    data
  })
}

export const editMessage = (pk, data) => {
  return axios.request({
    url: '/v1/message/detail/' + pk + '/',
    method: 'put',
    data
  })
}

export const getMessageDetail = (pk) => {
  return axios.request({
    url: '/v1/message/detail/' + pk + '/',
    method: 'get'
  })
}

export const delMessage = (pk) => {
  return axios.request({
    url: '/v1/message/detail/' + pk + '/',
    method: 'delete'
  })
}

export const sendMessage = (data) => {
  return axios.request({
    url: '/v1/message/send/',
    method: 'post',
    data
  })
}
