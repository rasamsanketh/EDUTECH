import React, { useState, useEffect } from 'react'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const AppContext = React.createContext({ api: API })

export default function App(){
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'))
  const [route, setRoute] = useState(window.location.hash || '#/login')

  useEffect(()=>{
    const onHash = ()=> setRoute(window.location.hash || '#/login')
    window.addEventListener('hashchange', onHash)
    return ()=> window.removeEventListener('hashchange', onHash)
  },[])

  useEffect(()=>{
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  },[token])

  useEffect(()=>{
    if (user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')
  },[user])

  const nav = (
    <div className="nav">
      <a href="#/login">Login</a>
      <a href="#/signup">Signup</a>
    </div>
  )

  if (!token) return (
    <AppContext.Provider value={{ api: API }}>
      <div className="container">
        <h1>Edutech</h1>
        {nav}
        {route === '#/signup' ? <Signup /> : <Login onLogin={(t, u)=>{ localStorage.setItem('token', t); localStorage.setItem('user', JSON.stringify(u)); setToken(t); setUser(u); window.location.hash = '#/dashboard' }} />}
      </div>
    </AppContext.Provider>
  )

  return (
    <AppContext.Provider value={{ api: API, token, user, setUser }}>
      <div className="container">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <strong>Signed in:</strong> {user?.email} ({user?.role})
          </div>
          <div>
            <button onClick={()=>{ setToken(null); setUser(null); window.location.hash = '#/login' }}>Logout</button>
          </div>
        </div>
        <hr />
        <Dashboard />
      </div>
    </AppContext.Provider>
  )
}
