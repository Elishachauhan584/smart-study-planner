import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Auth from './pages/Auth.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import './index.css'

function Gate() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        Loading...
      </div>
    )
  }

  return user ? <App /> : <Auth />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Gate />
    </AuthProvider>
  </React.StrictMode>,
)