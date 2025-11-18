import React from 'react'
import '../styles.css'
import { apiFetch } from '../api'

export default function TaskList({ tasks, onUpdated, onDeleted }){
  const updateProgress = async (task, progress)=>{
    try{
      const data = await apiFetch('/tasks/' + task._id, { method: 'PUT', body: JSON.stringify({ progress }) })
      onUpdated(data.task)
    }catch(err){ alert(err.message) }
  }

  const del = async (task)=>{
    if(!confirm('Delete?')) return
    try{
      await apiFetch('/tasks/' + task._id, { method: 'DELETE' })
      onDeleted(task._id)
    }catch(err){ alert(err.message) }
  }

  return (
    <div>
      <h4>Tasks</h4>
      {tasks.length===0 && <div>No tasks</div>}
      <ul>
        {tasks.map(t=> (
          <li key={t._id} style={{ marginBottom: 8 }}>
            <div><strong>{t.title}</strong> ({t.progress})</div>
            <div>{t.description}</div>
            <div>Due: {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '-'}</div>
            <div>
              <select value={t.progress} onChange={e=>updateProgress(t, e.target.value)}>
                <option value="not-started">not-started</option>
                <option value="in-progress">in-progress</option>
                <option value="completed">completed</option>
              </select>
              <button onClick={()=>del(t)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
