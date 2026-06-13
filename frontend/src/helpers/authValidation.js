export const MIN_USERNAME_LENGTH = 3

export const PASSWORD_REQUIREMENTS = [
  { key: 'length', label: 'At least 12 characters' },
  { key: 'uppercase', label: 'At least one uppercase letter' },
  { key: 'lowercase', label: 'At least one lowercase letter' },
  { key: 'number', label: 'At least one number' },
  { key: 'symbol', label: 'At least one symbol (@$!%*?&)' },
]

export function getPasswordChecks(password) {
  return {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    symbol: /[@$!%*?&]/.test(password),
  }
}

export function isPasswordValid(password) {
  return Object.values(getPasswordChecks(password)).every(Boolean)
}

export function getUsernameError(username) {
  const trimmed = username.trim()
  if (!trimmed) return ''
  if (trimmed.length < MIN_USERNAME_LENGTH) {
    return `Username must be at least ${MIN_USERNAME_LENGTH} characters`
  }
  return ''
}

export function isLoginFormValid(username, password) {
  return username.trim().length >= MIN_USERNAME_LENGTH && password.length > 0
}

export function isSignupFormValid(username, name, password, confirmPass) {
  return (
    username.trim().length >= MIN_USERNAME_LENGTH &&
    name.trim().length > 0 &&
    isPasswordValid(password) &&
    confirmPass.length > 0 &&
    password === confirmPass
  )
}