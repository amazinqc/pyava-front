import axios from 'axios'
import { ElMessage } from 'element-plus'

// const baseURL = 'http://big-event-vue-api-t.itheima.net'

const instance = axios.create({
  baseURL: import.meta.env.BASE_URL,
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
    if (resp.data.code === 200) {
      return resp.data.data
    }
    const message = resp.data.message || '服务异常'
    ElMessage.error(message)
    return Promise.reject(resp.data.message)
  },
  (err) => {
    const message = err.message || err?.response.data.message || '通信异常'
    ElMessage.error(message)
    return Promise.reject(message)
  }
)

export default instance
