import { Message, MessageBox } from 'element-ui'
// 配置API接口地址
var root = 'http://localhost:8080/ele-admin-api'
// 引用axios
var axios = require('axios')
// 自定义判断元素类型JS
function toType (obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
// 参数过滤函数
function filterNull (o) {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}
/*
  接口处理函数
*/

function apiAxios (method, url, params, success, failure) {
  if (params) {
    params = filterNull(params)
  }
  axios({
    method: method,
    url: url,
   // data: method === 'POST' || method === 'PUT' ? params : null,
   // params: method === 'GET' || method === 'DELETE' ? params : null,
    params: params,
    baseURL: root,
    withCredentials: false
  })
  .then(function (res) {
    if (res.data.success === true) {
      if (success) {
        success(res.data)
      }
    } else {
      Message.error(res.data.message)
      if (failure) {
        failure(res.data)
      }
    }
  })
  .catch(function (err) {
    let res = err.response
    if (err) {
      Message.error('error: ' + JSON.stringify(res))
    }
  })
}

// 返回在vue模板中的调用接口
export default {
  //get请求
  get: function (url, params, success, failure) {
    return apiAxios('GET', url, params, success, failure)
  },
  //post请求
  post: function (url, params, success, failure) {
    return apiAxios('POST', url, params, success, failure)
  },
  //put请求
  put: function (url, params, success, failure) {
    return apiAxios('PUT', url, params, success, failure)
  },
  //删除
  delete: function (url, params, success, failure) {
    MessageBox.confirm('此操作将永久删除选择的记录, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      return apiAxios('DELETE', url, params, success, failure)
    });
  },
  //请求
  request: function (method,url, params, success, failure) {
    return apiAxios(method, url, params, success, failure)
  }
}
