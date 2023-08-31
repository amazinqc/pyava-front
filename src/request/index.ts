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
    ElMessage.error(resp.data.message || '数据异常')
    return Promise.reject(resp.data)
  },
  (err) => {
    ElMessage.error(err.message || err?.response.data.message || '服务异常')
    return Promise.reject(err)
  }
)

export default instance
