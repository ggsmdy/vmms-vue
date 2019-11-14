import axios from '@/libs/api.request'

//
export const getText = (pk) => {
  return axios.request({
    url: '/v1/machine/profit/',
    method: 'get'
  })
}
export const  delText =  (pk) =>{
  return axios.request({
    url: '/v1/machine/profit/'+pk,
    method: 'delet'
  })
}
export const putText = (pk,data) => {
  return axios.request({
    url: '/v1/machine/profit/'+pk,
    method: 'put',
    data
  })
}
// 获取设备列表
export const getMachineList = (curPage, pageSize, kwargs,machineData) => {
  let params = {
    limit: pageSize,
    offset: pageSize * (curPage - 1)
  }
  if(machineData!=null){
    params = Object.assign(params,machineData)
  }
  params = Object.assign(params, kwargs)
  return axios.request({
    url: '/v1/machine/list/',
    method: 'get',
    params
  })
}

// 删除设备列表
export const delMachine = (pk) => {
  return axios.request({
    url: '/v1/machine/detail/' + pk + '/',
    method: 'delete'
  })
}

// 改变设备信息
export const changeMachine = (uid, data) => {
  return axios.request({
    url: '/v1/machine/detail/' + uid + '/',
    data,
    method: 'put'
  })
}

// 获取用户列表
export const getUserList = () => {
  return axios.request({
    url: '/v1/machine/user/',
    method: 'get'
  })
}

// 获取告警信息列表
export const getAlarmList = (curPage, pageSize) => {
  return axios.request({
    url: '/v1/machine/alarm/list/',
    method: 'get',
    params: {
      limit: pageSize,
      offset: pageSize * (curPage - 1)
    }
  })
}

// 获取当台设备的维护人员列表
export const getMaintainerList = (pk) => {
  return axios.request({
    url: '/v1/machine/maintainer/list/',
    method: 'get',
    params: {
      machineId: pk
    }
  })
}

// 设置告警信息的处理人员
export const setMaintainer = (data) => {
  return axios.request({
    url: '/v1/machine/maintainer/list/',
    method: 'post',
    data
  })
}

export const getAlarmDetail = (id) => {
  return axios.request({
    url: '/v1/machine/alarm/detail/' + id + '/',
    method: 'get',
    params: {
    }
  })
}

// 改变告警是否已读状态
export const changeAlarmStatus = (data) => {
  return axios.request({
    url: '/v1/machine/alarm/read/',
    method: 'post',
    data
  })
}

// 获取原料列表
export const getStuff = () => {
  return axios.request({
    url: '/v1/stuff/',
    method: 'get',
    params: {}
  })
}

// 增加原料
export const addStuff = (data) => {
  return axios.request({
    url: '/v1/stuff/',
    method: 'post',
    data
  })
}

// 编辑原料信息
export const editStuff = (pk, data) => {
  return axios.request({
    url: '/v1/stuff/' + pk + '/',
    method: 'put',
    data
  })
}

// 删除原料
export const delStuff = (pk) => {
  return axios.request({
    url: '/v1/stuff/' + pk + '/',
    method: 'delete'
  })
}

// 获取设备位置信息
export const getMachineGpsInfo = (data) => {
  if(data!=null){
    return axios.request({
      url: '/v1/machine/map/?name='+data.name,
      method: 'get',
    })
  }else{
    return axios.request({
      url: '/v1/machine/map/',
      method: 'get',
    })
  }
}

// 获取设备选择列表
export const getAllMachine = () => {
  return axios.request({
    url: '/v1/machine/all/',
    method: 'get'
  })
}

// 获取商品选择列表
export const getAllGoods = () => {
  return axios.request({
    url: '/v1/goods_all/',
    method: 'get'
  })
}

// 获取货道信息
export const getAisleList = (curPage, pageSize, kwargs) => {
  let params = {
    limit: pageSize,
    offset: pageSize * (curPage - 1)
  }
  params = Object.assign(params, kwargs)
  return axios.request({
    url: '/v1/goods_aisle/',
    method: 'get',
    params
  })
}

// 增加货道信息
export const addAisle = (data) => {
  return axios.request({
    url: '/v1/goods_aisle/',
    method: 'post',
    data
  })
}

// 编辑原料信息
export const editAisle = (pk, data) => {
  return axios.request({
    url: '/v1/goods_aisle/' + pk + '/',
    method: 'put',
    data
  })
}

// 删除原料
export const delAisle = (pk) => {
  return axios.request({
    url: '/v1/goods_aisle/' + pk + '/',
    method: 'delete'
  })
}

export  const  editAisleMulti = (data) => {
  return axios.request({
    url:'/v1/goods_aisle/multi/',
    method:'put',
    data
  })
}
//获取区域列表
export  const  getAreaList = () =>{
  return axios.request({
    url:'/v1/machine/area/list/',
    method:'get'
  })
}
//新增区域
export const  addArea = (data) =>{
  return axios.request({
    url:'/v1/machine/area/list/',
    method:'post',
    data
  })
}
//修改区域
export const editArea = (pk,data) =>{
  return axios.request({
    url:'/v1/machine/area/detail/'+pk+'/',
    method:'put',
    data
  })
}
//删除区域
export const delArea = (pk) =>{
  return axios.request({
    url:'/v1/machine/area/detail/'+pk+'/',
    method:'delete'
  })
}

//获取线路列表
export  const  getLineList = () =>{
  return axios.request({
    url:'/v1/machine/line/list/',
    method:'get'
  })
}
//新增线路
export const  addLine = (data) =>{
  return axios.request({
    url:'/v1/machine/line/list/',
    method:'post',
    data
  })
}
//修改线路
export const editLine = (pk,data) =>{
  return axios.request({
    url:'/v1/machine/line/detail/'+pk+'/',
    method:'put',
    data
  })
}
//删除线路
export const delLine = (pk) =>{
  return axios.request({
    url:'/v1/machine/line/detail/'+pk+'/',
    method:'delete'
  })
}
//获取点位列表
export  const  getPointList = ()=>{
  return axios.request({
    url:'/v1/machine/point/list/',
    method:'get'
  })
}
//新增线路
export const  addPoint = (data) =>{
  return axios.request({
    url:'/v1/machine/point/list/',
    method:'post',
    data
  })
}
//修改线路
export const editPoint = (pk,data) =>{
  return axios.request({
    url:'/v1/machine/point/detail/'+pk+'/',
    method:'put',
    data
  })
}
//删除线路
export const delPoint = (pk) =>{
  return axios.request({
    url:'/v1/machine/point/detail/'+pk+'/',
    method:'delete'
  })
}
