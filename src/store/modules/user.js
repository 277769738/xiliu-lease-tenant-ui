import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken,getTenant,setTenant,removeTenant } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    permissions: [],
    roles: [],
    tenantid: getTenant(),
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TENANT_ID: (state, tenantid) => {
    state.tenant_id = tenantid
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        const data = response.data
        // token 前面增加前缀
        const tokenStr = data.tokenHead + data.token
        commit('SET_TOKEN', tokenStr)
        setToken(tokenStr)
        commit('SET_TENANT_ID', data.tenant_id)
        setTenant(data.tenant_id)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        const avatar = (data.avatar == "" || data.avatar == null) ? require("@/assets/images/defualt_avatar.png") : data.avatar;
        // 验证返回的roles是否是一个非空数组
        if (data.roles && data.roles.length > 0) {
          commit('SET_ROLES', data.roles)
          commit('SET_PERMISSIONS', data.permissions)
        } else {
          commit('SET_ROLES', ['ROLE_DEFAULT'])
        }
        commit('SET_NAME', data.name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 退出系统
  LogOut({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_PERMISSIONS', [])
        commit('SET_TENANT_ID', '')
        removeTenant()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

