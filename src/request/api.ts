import request from '@/request'

interface Code extends CodeDraw {
  readonly id: number
}

interface CodeDraw {
  id?: number
  name: string
  code: string
}

export const apiCodeTools = async (): Promise<Code[]> => {
  return await request.get('api/code/tools')
}

export const apiCodeTips = async (): Promise<Record<string, string>> => {
  return await request.get('api/code/tips')
}

export const apiPyavaCode = async (id: number): Promise<Code> => {
  return await request.get(`api/code/${id}`)
}

export const apiUpdateCode = async (code: CodeDraw): Promise<Code> => {
  return await request.post('api/code', code)
}

export const apiTestCode = async (code: CodeDraw) => {
  return await request.post('api/code/exec', code)
}
