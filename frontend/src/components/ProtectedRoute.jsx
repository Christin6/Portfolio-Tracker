import { Navigate, Outlet } from 'react-router-dom'
import { useUserStore } from '../stores/useUserStore'

const ProtectedRoute = () => {
  const currentUser = useUserStore((state) => state.currentUser)
  return currentUser ? <Outlet /> : <Navigate to="/login" />
}

export default ProtectedRoute