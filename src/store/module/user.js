import { login, getUserInfo } from '@/api/user'
import { setToken, getToken } from '@/libs/util'

export default {
  state: {
    userName: '',
    userId: '',
    avatorImgPath: '',
    token: getToken(),
    access: '',
    level: ''
  },
  mutations: {
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setUserFullName (state, fullName) {
      state.fullName = fullName
    },
    setAccess (state, access) {
      state.access = access
    },
    setLevel (state, level) {
      state.level = level
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    }
  },
  actions: {
    // 登录
    handleLogin ({ commit }, {userName, password}) {
      userName = userName.trim()  //从字符串中删除开头和结尾的空白和行终止符字符
      return new Promise((resolve, reject) => {
        login({
          userName,
          password
        }).then(res => {
          const data = res
          commit('setToken', data.token)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        // logout(state.token).then(() => {
        //   commit('setToken', '')
        //   commit('setAccess', [])
        //   resolve()
        // }).catch(err => {
        //   reject(err)
        // })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        commit('setToken', '')
        commit('setAccess', [])
        resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(res => {
          const data = res
          commit('setAvator', data.avator)
          commit('setUserName', data.user_name)
          commit('setUserFullName', data.full_name)
          commit('setUserId', data.user_id)
          commit('setAccess', data.access)
          commit('setLevel', data.level)
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
