import request from '@/request'

interface Code extends CodeDraw {
  readonly id: number
}

interface CodeDraw {
  id?: number
  name: string
  code: string
}

interface Args extends Record<string, string | number | object> {}

export interface Choice {
  readonly type: number
  readonly option: number
  readonly desc: string
}

export interface Server {
  readonly sid: number
  readonly name: string
}

export const apiCodeTools = async (): Promise<Code[]> => {
  return await request.get('api/code/tools')
}

export const apiCodeHints = async (): Promise<Record<string, string>> => {
  return await request.get('api/code/hints')
}

export const apiShowCode = async (id: number): Promise<Code> => {
  return await request.get(`api/code/${id}`)
}

export const apiRunCode = async (id: number, sid: number, args: Args) => {
  return await request.post(`api/code/${id}`, { sid, args })
}

export const apiTestCode = async (code: string, args: Args) => {
  return await request.post('api/code/debug', { code, args })
}

export const apiGetServers = async (): Promise<Server[]> => {
  return await request.get('api/code/servers')
}

export const apiGetOptions = async (option: number | null = null): Promise<Choice[]> => {
  return await request.get(`api/code/options${option === null ? '' : `/${option}`}`)
}
