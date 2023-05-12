const state = {
  // 用户访问过的页面 就是标签栏导航显示的一个个 tag 数组集合
  visitedViews: [],
  // 实际 keep-alive 的路由。可以在配置路由的时候通过 meta.noCache 来设置是否需要缓存这个路由 默认都缓存。
  cachedViews: []
}

const mutations = {
  // 添加标签
  ADD_VISITED_VIEW: (state, view) => {
    // 如果标签跳转的路由存在就不添加，否则就添加进标签组
    if (state.visitedViews.some(v => v.path === view.path)) return
    state.visitedViews.push(
      Object.assign({}, view, {
        title: view.meta.title || 'no-name'
      })
    )
  },
  // 添加缓存标签
  ADD_CACHED_VIEW: (state, view) => {
    // 已存在缓存就不缓存了
    if (state.cachedViews.includes(view.name)) return
    if (view.meta && !view.meta.noCache) {
      state.cachedViews.push(view.name)
    }
  },
  // 删除选择的标签
  DEL_VISITED_VIEW: (state, view) => {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews.splice(i, 1)
        break
      }
    }
  },
  // 删除缓存标签
  DEL_CACHED_VIEW: (state, view) => {
    const index = state.cachedViews.indexOf(view.name)
    index > -1 && state.cachedViews.splice(index, 1)
  },
  // 删除其它标签
  DEL_OTHERS_VISITED_VIEWS: (state, view) => {
    state.visitedViews = state.visitedViews.filter(v => {
      return v.meta.affix || v.path === view.path
    })
  },
  // 删除其它缓存标签
  DEL_OTHERS_CACHED_VIEWS: (state, view) => {
    const index = state.cachedViews.indexOf(view.name)
    if (index > -1) {
      state.cachedViews = state.cachedViews.slice(index, index + 1)
    } else {
      state.cachedViews = []
    }
  },
  // 删除所有标签
  DEL_ALL_VISITED_VIEWS: state => {
    // 过滤出固定的标签，只保留固定标签
    const affixTags = state.visitedViews.filter(tag => tag.meta.affix)
    state.visitedViews = affixTags
  },
  // 删除所有缓存标签
  DEL_ALL_CACHED_VIEWS: state => {
    state.cachedViews = []
  },

  UPDATE_VISITED_VIEW: (state, view) => {
    for (let v of state.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
  },
  // 删除右侧标签
  DEL_RIGHT_VIEWS: (state, view) => {
    const index = state.visitedViews.findIndex(v => v.path === view.path)
    if (index === -1) {
      return
    }
    state.visitedViews = state.visitedViews.filter((item, idx) => {
      if (idx <= index || (item.meta && item.meta.affix)) {
        return true
      }
      const i = state.cachedViews.indexOf(item.name)
      if (i > -1) {
        state.cachedViews.splice(i, 1)
      }
      return false
    })
  },
  // 删除左侧标签
  DEL_LEFT_VIEWS: (state, view) => {
    const index = state.visitedViews.findIndex(v => v.path === view.path)
    if (index === -1) {
      return
    }
    state.visitedViews = state.visitedViews.filter((item, idx) => {
      if (idx >= index || (item.meta && item.meta.affix)) {
        return true
      }
      const i = state.cachedViews.indexOf(item.name)
      if (i > -1) {
        state.cachedViews.splice(i, 1)
      }
      return false
    })
  }
}

const actions = {
  // 新增当前路由标签和标签缓存
  addView({ dispatch }, view) {
    dispatch('addVisitedView', view)
    dispatch('addCachedView', view)
  },
  // 新增当前路由标签
  addVisitedView({ commit }, view) {
    commit('ADD_VISITED_VIEW', view)
  },
  // 新增当前路由标签缓存
  addCachedView({ commit }, view) {
    commit('ADD_CACHED_VIEW', view)
  },
  // 删除当前路由标签和标签缓存
  delView({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delVisitedView', view)
      dispatch('delCachedView', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  // 删除当前路由标签
  delVisitedView({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_VISITED_VIEW', view)
      resolve([...state.visitedViews])
    })
  },
  // 删除当前路由标签缓存
  delCachedView({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_CACHED_VIEW', view)
      resolve([...state.cachedViews])
    })
  },
  // 删除其他路由标签和标签缓存
  delOthersViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delOthersVisitedViews', view)
      dispatch('delOthersCachedViews', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  // 删除其他路由标签
  delOthersVisitedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_VISITED_VIEWS', view)
      resolve([...state.visitedViews])
    })
  },
  // 删除其他路由标签缓存
  delOthersCachedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_CACHED_VIEWS', view)
      resolve([...state.cachedViews])
    })
  },
  // 删除所有路由标签和标签缓存
  delAllViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch('delAllVisitedViews', view)
      dispatch('delAllCachedViews', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  // 删除所有路由标签
  delAllVisitedViews({ commit, state }) {
    return new Promise(resolve => {
      commit('DEL_ALL_VISITED_VIEWS')
      resolve([...state.visitedViews])
    })
  },
  // 删除所有路由标签缓存
  delAllCachedViews({ commit, state }) {
    return new Promise(resolve => {
      commit('DEL_ALL_CACHED_VIEWS')
      resolve([...state.cachedViews])
    })
  },

  updateVisitedView({ commit }, view) {
    commit('UPDATE_VISITED_VIEW', view)
  },
  // 删除右侧路由标签缓存
  delRightTags({ commit }, view) {
    return new Promise(resolve => {
      commit('DEL_RIGHT_VIEWS', view)
      resolve([...state.visitedViews])
    })
  },
  // 删除左侧路由标签缓存
  delLeftTags({ commit }, view) {
    return new Promise(resolve => {
      commit('DEL_LEFT_VIEWS', view)
      resolve([...state.visitedViews])
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
