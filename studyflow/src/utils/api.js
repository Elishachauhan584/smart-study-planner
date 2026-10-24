const API = import.meta.env.VITE_API_URL

export function getToken() {
  return localStorage.getItem('studyflow:token')
}

export function setToken(token) {
  if (token) localStorage.setItem('studyflow:token', token)
  else localStorage.removeItem('studyflow:token')
}

export async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (res.status === 204) return null
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}