import axios from '@/libs/api.request'

// 获取消费报表, 默认显示一周的
export const getOrderData = (params) => {
  return axios.request({
    url: '/v1/chart/order/',
    method: 'get',
    params: params
  })
}

// 获取充值报表, 默认显示一周的
export const getRechargeData = (params) => {
  return axios.request({
    url: '/v1/chart/recharge/',
    method: 'get',
    params: params
  })
}

// 获取积分兑换报表, 默认显示一周的
export const getIntegralData = (params) => {
  return axios.request({
    url: '/v1/chart/integral/',
    method: 'get',
    params: params
  })
}

// 获取设备列表
export const getMachineList = () => {
  return axios.request({
    url: '/v1/chart/get/machine/',
    method: 'get',
    params: {}
  })
}

// 获取代理商列表
export const getUserList = () => {
  return axios.request({
    url: '/v1/chart/get/user/',
    method: 'get',
    params: {}
  })
}

// 获取商圈列表
export const getTagList = () => {
  return axios.request({
    url: '/v1/chart/get/tag/',
    method: 'get',
    params: {}
  })
}

// 获取会员报表
export const getMemberData = (params) => {
  return axios.request({
    url: '/v1/chart/get/member/',
    method: 'get',
    params: params
  })
}

//获取交易明细中的组合数据
export const getGoodsData = (key,value,data) =>{
  let kwargs = {}
  if(key=="machine"){
    key="machine_id"
  }
  kwargs[key] = value
  let params = {}
  if(data!=null){
    params = Object.assign(params,data)
  }
  if(kwargs!=null){
    params = Object.assign(params, kwargs)
  }
  return axios.request({
    url: '/v1/chart/goods/details/seller/',
    method: 'get',
    params: params
  })
}
export const v3getGoodsData = (kwargs,data) =>{
    if(kwargs['machine']!=null){
      kwargs['machine_id']=kwargs['machine']
    }
  let params = {}
  if(data!=null){
    params = Object.assign(params,data)
  }
  if(kwargs!=null){
    params = Object.assign(params, kwargs)
  }
  console.log(params)
  return axios.request({
    url: '/v1/chart/goods/details/seller/',
    method: 'get',
    params: params
  })
}
