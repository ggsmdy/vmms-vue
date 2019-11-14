import axios from '@/libs/api.request'

export const getSystemUser = (curPage, pageSize) => {
  return axios.request({
    url: '/v1/system/user/',
    method: 'get',
    params: {
      limit: pageSize,
      offset: pageSize * (curPage - 1)
    }
  })
}

export const addSystemUser = (data) => {
  return axios.request({
    url: '/v1/system/user/',
    method: 'post',
    data
  })
}

export const editSystemUser = (pk, data) => {
  return axios.request({
    url: '/v1/system/user/' + pk + '/',
    method: 'put',
    data
  })
}

export const delSystemUser = (pk) => {
  return axios.request({
    url: '/v1/system/user/' + pk + '/',
    method: 'delete'
  })
}

export const getLeaguerUser = () => {
  return axios.request({
    url: '/v1/user/leaguer/list/',
    method: 'get',
    params: {}
  })
}

export const getUserPerms = (userId) => {
  return axios.request({
    url: '/v1/system/perm/',
    method: 'get',
    params: {
      userId: userId
    }
  })
}

export const changeUserPerms = (data) => {
  return axios.request({
    url: '/v1/system/perm/',
    method: 'post',
    data
  })
}

export const getAuthGroup = () => {
  return axios.request({
    url: '/v1/system/group/',
    method: 'get',
    params: {}
  })
}

export const delSystemGroup = (data) => {
  return axios.request({
    url: '/v1/system/group/',
    method: 'delete',
    data
  })
}

// 增加或者修改群组
export const changeSystemGroup = (data) => {
  return axios.request({
    url: '/v1/system/group/',
    method: 'post',
    data
  })
}

export const getUserGroup = (pk) => {
  return axios.request({
    url: '/v1/system/group/user/',
    method: 'get',
    params: {
      groupId: pk
    }
  })
}

export const setUserGroup = (data) => {
  return axios.request({
    url: '/v1/system/group/user/',
    method: 'post',
    data
  })
}

export const getBankCodeList = () => {
  return axios.request({
    url: '/v1/system/pay/bank_code/',
    method: 'get',
    params: {}
  })
}
