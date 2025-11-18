import React, { useState, useEffect } from 'react'
import { apiFetch } from '../api'

export default function Signup(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [teacherId, setTeacherId] = useState('')
  const [msg, setMsg] = useState('')
  const [teachers, setTeachers] = useState([])

  useEffect(()=>{
    apiFetch('/users?role=teacher').then(d=>{
      setTeachers(d.users || [])
      if (d.users && d.users.length>0) setTeacherId(d.users[0].id)
    }).catch(()=>{})
  },[])

  const submit = async (e)=>{
    e.preventDefault()
    try{
      const body = { email, password, role }
      if (role === 'student') body.teacherId = teacherId
      await apiFetch('/auth/signup', { method: 'POST', body: JSON.stringify(body) })
      setMsg('Signup successful')
      window.location.hash = '#/login'
    }catch(err){ setMsg(err.message || String(err)) }
  }

  return (
    <div>
      <h3>Signup</h3>
      <form onSubmit={submit}>
        <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <div className="row">
          <select value={role} onChange={e=>setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          {role === 'student' && (
            <select value={teacherId} onChange={e=>setTeacherId(e.target.value)}>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.email}</option>)}
            </select>
          )}
        </div>
        <button type="submit">Signup</button>
      </form>
      <div className="muted">{msg}</div>
    </div>
  )
}
