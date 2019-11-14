import Mock from 'mockjs'
import { doCustomTimes, getParams } from '@/libs/util'

export const getMachineList = req => {
  let tableData = []
  const params = getParams(req.url)
  let curPage = parseInt(params.curPage)
  let pageSize = parseInt(params.pageSize)
  doCustomTimes(pageSize, () => {
    tableData.push(Mock.mock({
      name: '@name',
      netState: '@pick(["联网", "离线"])',
      runState: '@pick(["正常", "停用", "报警", "故障"])',
      owner: '@name',
      desc: '@ctitle(30, 50)'
    }))
  })
  return {
    code: 200,
    data: tableData,
    curPage: curPage,
    pageSize: pageSize,
    total: 300,
    msg: ''
  }
}

export const getUserList = req => {
  let userList = []
  doCustomTimes(20, () => {
    userList.push(Mock.mock({
      name: '@name',
      id: '@integer(1, 1000)'
    }))
  })
  return {
    code: 200,
    data: userList,
    msg: ''
  }
}
