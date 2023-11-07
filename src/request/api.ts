import request from '@/request'
import type { Server, Code, CodeChoice, Args, Result, BaseData } from '@/types'

export default {
  getServers: (): Promise<Server[]> => request.get('api/code/servers'),

  getCodeView: (id: number): Promise<Code> => request.get(`api/code/${id}`),

  getTypeCodes: (type: number): Promise<Code[]> => request.get(`api/codes/${type}`),

  getCodeHints: (): Promise<Record<string, string>> => request.get('api/code/hints'),

  getCodeOptions: (option?: number): Promise<CodeChoice[]> =>
    request.get(`api/code/options${option === undefined ? '' : `/${option}`}`),

  runCode: (id: number, base: BaseData, args?: Args): Promise<Result> =>
    request.post(`api/code/${id}`, { args, ...base }),

  codeTest: (code: string, base: BaseData, args?: Args): Promise<Result> =>
    request.post('api/code/debug', { code, args, ...base })
}
