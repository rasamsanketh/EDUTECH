import React, { useState, useContext } from 'react'
import '../styles.css'
import { apiFetch } from '../api'
import { AppContext } from '../App'

export default function TaskForm({ onCreated }){
  const { user } = useContext(AppContext)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [msg, setMsg] = useState('')

  const submit = async (e)=>{
    e.preventDefault()
    try{
      const payload = { userId: user.id, title, description, dueDate: dueDate || null }
      const data = await apiFetch('/tasks', { method: 'POST', body: JSON.stringify(payload) })
      onCreated(data.task)
      setTitle(''); setDescription(''); setDueDate(''); setMsg('Created')
    }catch(err){ setMsg(err.message) }
  }

  return (
    <div>
      <h4>Create Task</h4>
      <form onSubmit={submit}>
        <div><input placeholder="title" value={title} onChange={e=>setTitle(e.target.value)} required /></div>
        <div><input placeholder="description" value={description} onChange={e=>setDescription(e.target.value)} /></div>
        <div><input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} /></div>
        <button type="submit">Create</button>
      </form>
      <div>{msg}</div>
    </div>
  )
}
