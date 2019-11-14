import Mock from 'mockjs'
import { login, logout, getUserInfo } from './login'
import { getMachineList, getUserList } from './data'
import { getSystemUser } from './system'

// 登录相关和获取用户信息
Mock.mock(/\/user\/login/, login)
Mock.mock(/\/user\/info/, getUserInfo)
Mock.mock(/\/user\/logout/, logout)
Mock.mock(/\/machine\/leaguer/, getUserList)
Mock.mock(/\/machine\/list/, getMachineList)
Mock.mock(/\/system\/user/, getSystemUser)

export default Mock
