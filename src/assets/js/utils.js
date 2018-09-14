export function isNumber(num) {
  const number = +num
  // 排除 NaN and Infinity
  if ((number - num) !== 0) return false
  if (number === num) return true
  if (typeof num === 'string') {
    if (number === 0 && num.trim() === '') return false
    return true
  }
  return false
}
