import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('visioai_user')) } catch { return null }
  })
  const [apiKey, setApiKeyState] = useState(() => localStorage.getItem('visioai_apikey') || '')

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('visioai_users') || '[]')
    const found = users.find(u => u.email === email && u.password === btoa(password))
    if (!found) return { error: 'Invalid email or password' }
    const userData = { email: found.email, name: found.name, avatar: found.avatar, plan: found.plan || 'free', credits: found.credits ?? 50, joined: found.joined }
    setUser(userData); localStorage.setItem('visioai_user', JSON.stringify(userData))
    return { success: true }
  }

  const signup = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('visioai_users') || '[]')
    if (users.find(u => u.email === email)) return { error: 'Email already registered' }
    const avatar = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
    const newUser = { name, email, password: btoa(password), avatar, plan: 'free', credits: 50, joined: new Date().toISOString() }
    users.push(newUser); localStorage.setItem('visioai_users', JSON.stringify(users))
    const userData = { email, name, avatar, plan: 'free', credits: 50, joined: newUser.joined }
    setUser(userData); localStorage.setItem('visioai_user', JSON.stringify(userData))
    return { success: true }
  }

  const logout = () => { setUser(null); localStorage.removeItem('visioai_user') }

  const saveApiKey = (key) => { setApiKeyState(key); localStorage.setItem('visioai_apikey', key) }

  const deductCredit = () => {
    if (!user) return
    const updated = { ...user, credits: Math.max(0, user.credits - 1) }
    setUser(updated); localStorage.setItem('visioai_user', JSON.stringify(updated))
    const users = JSON.parse(localStorage.getItem('visioai_users') || '[]')
    const idx = users.findIndex(u => u.email === user.email)
    if (idx !== -1) { users[idx].credits = updated.credits; localStorage.setItem('visioai_users', JSON.stringify(users)) }
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, apiKey, saveApiKey, deductCredit }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
