import React, { useContext, useEffect, useState } from 'react'
import '../styles.css'
import { AppContext } from '../App'
import { apiFetch } from '../api'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'

export default function Dashboard(){
  const { api, token } = useContext(AppContext)
  const [tasks, setTasks] = useState([])
  const [error, setError] = useState('')

  const load = async ()=>{
    try{
      const data = await apiFetch('/tasks')
      setTasks(data.tasks || [])
    }catch(err){ setError(err.message) }
  }

  useEffect(()=>{ load() },[])

  const onCreated = (task)=> setTasks(s=>[task, ...s])
  const onUpdated = (task)=> setTasks(s=>s.map(t=>t._id===task._id?task:t))
  const onDeleted = (id)=> setTasks(s=>s.filter(t=>t._id!==id))

  return (
    <div>
      <h3>Dashboard</h3>
      <div style={{ color: 'red' }}>{error}</div>
      <TaskForm onCreated={onCreated} />
      <TaskList tasks={tasks} onUpdated={onUpdated} onDeleted={onDeleted} />
    </div>
  )
}
