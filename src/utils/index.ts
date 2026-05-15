// 判断数组中的数字能否通过简单的加减乘除运算得到结果24
export function isLegalNums(nums: Array<number>): boolean {
  // 处理小数运算的精度问题
  const PRECISION = 1e-6

  const len = nums.length
  if (len === 1) {
    return Math.abs(nums[0] - 24) <= PRECISION
  }

  for(let i = 0; i < len; i++) {
    for(let j = 0; j < len; j++) {
      if (i === j) continue

      const next = []
      for(let k = 0; k < len; k++) {
        if (k !== i && k !== j) {
          next.push(nums[k])
        }
      }

      const a = nums[i]
      const b = nums[j]

      // 加法
      next.push(a + b)
      if (isLegalNums(next)) {
        return true
      }
      next.pop()

      // 乘法
      next.push(a * b)
      if (isLegalNums(next)) {
        return true
      }
      next.pop()

      // 减法
      next.push(a - b)
      if (isLegalNums(next)) {
        return true
      }
      next.pop()

      // 除法(分母不能为0)
      if (Math.abs(b) > PRECISION) {
        next.push(a / b)
        if (isLegalNums(next)) {
          return true
        }
        next.pop()
      }
    }
  }

  return false
}