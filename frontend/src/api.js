export async function apiFetch(url, options={}){
  const base = import.meta.env.VITE_API_URL || 'http://localhost:4000'
  const token = localStorage.getItem('token')
  const headers = options.headers || {}
  if (token) headers['Authorization'] = 'Bearer ' + token
  headers['Content-Type'] = headers['Content-Type'] || 'application/json'
  const res = await fetch(base + url, { ...options, headers })
  const data = await res.json().catch(()=>({ success: false, message: 'Invalid server response' }))
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}
