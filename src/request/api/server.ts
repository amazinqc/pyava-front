import request from '@/request'

export const apiGetServers = () => {
  return request.get('api/servers')
}
