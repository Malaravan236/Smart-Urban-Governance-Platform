import { http, tokens } from './http'

export async function login(username, password) {
  const d = await http('/api/token/', { method: 'POST', body: { username, password } })
  tokens.set(d.access, d.refresh)
  localStorage.setItem('user', JSON.stringify(d.user))
  return d.user
}

export async function register(username, password, email = '') {
  await http('/api/register/', { method: 'POST', body: { username, password, email } })
  return login(username, password)
}

export function logout() {
  tokens.clear()
}

export function getStoredUser() {
  try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
}