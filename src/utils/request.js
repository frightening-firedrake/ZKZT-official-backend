import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

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

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    if (response.status && response.status === 200) {
      const res = response.data

      // if the custom code is not 200, it is judged as an error.
      if (res.status && res.status !== 200) {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })

        // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
        if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
          MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
            confirmButtonText: 'Re-Login',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          })
        }

        return Promise.reject(new Error(res.message || 'Error'))
      } else {
        if (res.message) {
          Message.success({ message: res.message })
        }
        return res
      }
    }
  },
  error => {
    console.log('error' + error) // for debug
    if (error.response.status === 504 || error.response.status === 404) {
      Message.error({ message: '服务器被吃了(/ □ \)' })
    } else if (error.response.status === 403) {
      Message.error({ message: '权限不足，请联系管理员！' })
    } else if (error.response.status === 401) {
      Message.error({ message: '凭证已过期，请重新登陆！' })
      logout()
    } else {
      if (error.response.data.message) {
        Message.error({ message: error.response.data.message })
      } else {
        Message.error({ message: '未知错误！' })
        // Message({
        //   message: error.message,
        //   type: 'error',
        //   duration: 5 * 1000
        // })
      }
    }
    return Promise.reject(error)
  }
)

async function logout() {
  await store.dispatch('user/logout')
  router.replace(`/login`)
}

export default service

/**
 * get方法，对应get请求，ParamsType=body
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    service.get(url, {
      params: params
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

/**
* post方法，对应post请求，ParamsType=body
* @param {String} url [请求的url地址]
* @param {Object} params [请求时携带的参数]
*/
export function post(url, params) {
  return new Promise((resolve, reject) => {
    service.post(url, params)
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
* put方法，对应put请求，ParamsType=body
* @param {String} url [请求的url地址]
* @param {Object} params [请求时携带的参数]
*/
export function put(url, params) {
  return new Promise((resolve, reject) => {
    service.put(url, params)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
* delete方法，对应put请求，ParamsType=path
* @param {String} url [请求的url地址]
*/
export function _delete(url) {
  return new Promise((resolve, reject) => {
    service.delete(url)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * get方法，对应get请求，ParamsType=path
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get_path(url) {
  return new Promise((resolve, reject) => {
    service.get(url).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

/**
* get方法，对应put请求，ParamsType=query
* @param {String} url [请求的url地址]
* @param {Object} params [请求时携带的参数]
*/
export function get_query(url, params) {
  return new Promise((resolve, reject) => {
    const _url = url + '?' + params.substring(0, params.length - 1)
    service.get(_url)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
* put方法，对应put请求，ParamsType=query
* @param {String} url [请求的url地址]
* @param {Object} params [请求时携带的参数]
*/
export function put_query(url, params) {
  return new Promise((resolve, reject) => {
    const _url = url + '?' + params
    service.put(_url)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export function post_query(url, params) {
  return new Promise((resolve, reject) => {
    const _url = url + '?' + params
    service.post(_url)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}
