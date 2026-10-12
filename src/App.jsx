import { Toaster } from "react-hot-toast"
import Login from "./pages/Login"
import Drive from "./pages/Drive"
import { Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import DashboardLayout from "./components/layout/DashboardLayout"


const App = () => {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login mode="login" />} />
        <Route path="/register" element={<Login mode="register" />} />

        {/* Private routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Drive />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App