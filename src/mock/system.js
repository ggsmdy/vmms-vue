import Mock from 'mockjs'
import { doCustomTimes, getParams } from '@/libs/util'

export const getSystemUser = req => {
  let userList = []
  const params = getParams(req.url)
  let curPage = parseInt(params.curPage)
  let pageSize = parseInt(params.pageSize)
  doCustomTimes(pageSize, () => {
    userList.push(Mock.mock({
      username: '@name',
      isBind: '@pick(["已绑定", "未绑定"])',
      joinTime: '@datetime()',
      tel: '@integer(13000000000, 13999999999)',
      level: '@pick(["未指定", "一级代理", "二级代理", "三级代理", "管理员"])'
    }))
  })
  return {
    code: 200,
    data: userList,
    curPage: curPage,
    pageSize: pageSize,
    total: 300,
    msg: ''
  }
}
