import axios from '@/libs/api.request'

/**
 * js方法   调用   后台   URL地址
 * */
//登录
export const login = ({ userName, password }) => {
  const data = {
    'username': userName,
    'password': password
  }
  return axios.request({
    url: '/v1/user/login/',
    data,
    method: 'post'
  })
}
//获取登录用户的详细信息
export const getUserInfo = () => {
  return axios.request({
    url: '/v1/user/info/',
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: '/v1/api-auth/login/',
    method: 'post'
  })
}

// 获取地址列表
export const getAddr = () => {
  return axios.request({
    url: '/v1/user/address/',
    method: 'get'
  })
}

// 删除地址
export const delAddr = (id) => {
  return axios.request({
    url: '/v1/user/address/' + id + '/',
    method: 'get'
  })
}

// 增加地址
export const addAddr = (data) => {
  return axios.request({
    url: '/v1/user/address/',
    method: 'post',
    data
  })
}

// 变更地址
export const changeAddr = (data, pk) => {
  return axios.request({
    url: '/v1/user/address/' + pk + '/',
    method: 'put',
    data
  })
}
