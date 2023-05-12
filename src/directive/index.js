import hasPermi from './permission/hasPermission'

const install = function (Vue) {
  // 注册自定义组件 v-hasPermi
  Vue.directive('hasPermi', hasPermi)
}

if (window.Vue) {
  window['hasPermi'] = hasPermi
  Vue.use(install); // eslint-disable-line
}

export default install
