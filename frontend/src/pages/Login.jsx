import React, { useState, useContext } from 'react'
import '../styles.css'
import { AppContext } from '../App'
import { apiFetch } from '../api'

export default function Login({ onLogin }){
  const { api } = useContext(AppContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
    const [msg, setMsg] = useState('')

    const submit = async (e)=>{
    e.preventDefault()
    try{
        const data = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
        const token = data.token
        // fetch /me using fetch with auth header (apiFetch would try to use stored token, but token not yet stored), so call directly
        const meRes = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/auth/me', { headers: { 'Authorization': 'Bearer ' + token } })
        const meData = await meRes.json()
        if (!meRes.ok) throw new Error(meData.message || 'Unable to fetch user')
        onLogin(token, meData.user)
    }catch(err){ setMsg(err.message || String(err)) }
  }

  return (
    <div>
      <h3>Login</h3>
      <form onSubmit={submit}>
          <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input type="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
        <div className="muted">{msg}</div>
    </div>
  )
}
