
/**
 * 去除非数字内容
 * @param val 字符串
 * @returns 
 */
export function numeric(val?: string) {
    return val?.replace(/\D+/, '')
}

/**
 * 格式化时间
 * @param ms 毫秒数
 * @returns 
 */
export function formatms(ms: number) {
    const date = new Date(ms)
    const formatter = new Intl.DateTimeFormat('default', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })
    return formatter.format(date)
}