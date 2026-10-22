/**
 * 密码强度：纯前端指示，不参与校验。密码的合法性只有长度边界（password-policy.ts），
 * 弱密码也能提交——强度只是帮用户意识到自己的密码弱。
 *
 * 四档按长度和字符类数量算：小写、大写、数字、符号各算一类
 */
export function passwordStrength(password: string): 0 | 1 | 2 | 3 | null {
  if (!password) return null
  let classes = 0
  if (/[a-z]/.test(password)) classes++
  if (/[A-Z]/.test(password)) classes++
  if (/\d/.test(password)) classes++
  if (/[^a-zA-Z\d]/.test(password)) classes++
  const length = [...password].length
  if (length < 10 || classes === 1) return 0
  if (length >= 16 && classes === 4) return 3
  if (length >= 12 && classes >= 3) return 2
  return 1
}
