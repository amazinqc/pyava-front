
/**
 * 去除非数字内容
 * @param val 字符串
 * @returns 
 */
export function numeric(val?: string) {
    return val?.replace(/\D+/, '')
}