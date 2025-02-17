/**
 * 实际参数统一结构
 */
export declare interface Args {
  [prop: string]: number | string | object
}

/**
 * 形式参数类型描述
 */
export declare interface ArgType {
  readonly name: string
  readonly type?: string
  readonly desc?: string
  readonly default?: string
}

/**
 * 代码选项描述信息
 */
export declare interface CodeChoice {
  readonly type: number
  readonly option: number
  readonly desc: string
}

/**
 * 服务器结构信息
 */
export declare interface Server {
  readonly sid: number
  readonly name: string
}

/**
 * 代码结构视图信息
 */
export declare interface Code {
  id: number
  name: string
  code: string
  args: ArgType[]
}

/**
 * 代码执行结果
 */
export type Result = any

/**
 * 全局共用的基础数据
 */
export declare interface BaseData {
  /**
   * uid是否原始值(uid/cid)
   */
  _raw: boolean
  uid?: number | string
  cid?: number | string
  sid?: number | string
  [prop: string]: number | string | boolean
}

/**
 * 结果展示布局
 */
export declare interface Viewboard {
  /**
   * 是否展示
   */
  show: boolean
  /**
   * 展示状态
   */
  status?: 'loading' | 'success' | 'error'
  /**
   * 展示结果
   */
  result?: any
}
