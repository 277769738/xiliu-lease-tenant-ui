import axios from 'axios'
import {Notification, MessageBox, Message, Loading } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import errorCode from '@/utils/error-code'
import { tansParams, blobValidate } from "@/utils/common";

let downloadLoadingInstance;

const baseURL =
  process.env.NODE_ENV === 'development' ? '/api' : process.env.VUE_APP_BASE_API ? process.env.VUE_APP_BASE_API : '/'

// 创建axios实例
const service = axios.create({
  baseURL: baseURL, // url = base url + request url
  // withCredentials: true, // 跨域请求时发送Cookie
  timeout: 10000 // request timeout
})

// request拦截器
service.interceptors.request.use(
  config => {
    // 让每个请求携带自定义token 请根据实际情况自行修改

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// respone拦截器
service.interceptors.response.use(response => {
    const res = response.data
    // 未设置状态码则默认成功状态
    const code = res.code || 200;
    // 获取错误信息
    const msg = errorCode[code] || res.message || errorCode['default']
    // 401:未登录;
    if (code === 401) {
      MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录,', '系统提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/LogOut').then(() => {
          location.href = '/index';
        })
      }).catch(() => {});
      return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
    } else if (code === 500) {
      Message({
        message: msg,
        type: 'error'
      })
      return Promise.reject(new Error(msg))
    } else if (code !== 200) {
      Notification.error({
        title: msg
      })
      return Promise.reject('error')
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: '服务器开小差了，请稍后再试。',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

// 通用下载方法
export function download(url, params, filename) {
  downloadLoadingInstance = Loading.service({ text: "正在下载数据，请稍候", spinner: "el-icon-loading", background: "rgba(0, 0, 0, 0.7)", })
  return service.post(url, params, {
    transformRequest: [(params) => { return tansParams(params) }],
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob'
  }).then(async (data) => {
    const isLogin = await blobValidate(data);
    if (isLogin) {
      const blob = new Blob([data])
      saveAs(blob, filename)
    } else {
      const resText = await data.text();
      const rspObj = JSON.parse(resText);
      const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
      Message.error(errMsg);
    }
    downloadLoadingInstance.close();
  }).catch((r) => {
    console.error(r)
    Message.error('下载文件出现错误，请联系管理员！')
    downloadLoadingInstance.close();
  })
}

export default service
