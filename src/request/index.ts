import axios from 'axios'
import { ElMessage } from 'element-plus'

const baseURL = 'http://big-event-vue-api-t.itheima.net'

const instance = axios.create({
  baseURL,
  timeout: 60000
})

instance.interceptors.request.use(
  (config) => {
    return config
  },
  (err) => Promise.reject(err)
)

instance.interceptors.response.use(
  (resp) => {
    if (resp.data.code === 0) {
      return resp
    }
    ElMessage.error(resp.data.message || '数据异常')
    return Promise.reject(resp.data)
  },
  (err) => {
    if (err.response?.status === 401) {
      console.log(err)
    }
    console.log(err)
    ElMessage.error(err.response.data.message || '服务异常')
    return Promise.reject(err)
  }
)

export default instance
