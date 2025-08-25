import { Routes, Route, Navigate } from 'react-router-dom'
import { useMousePosition } from './hooks/useMousePosition'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

function App() {
  // This will track mouse and update CSS variables
  useMousePosition();

  return (
    <div className="min-h-screen relative">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  )
}

export default App
