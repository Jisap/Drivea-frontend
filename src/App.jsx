import { Toaster } from "react-hot-toast"
import Login from "./pages/Login"
import Drive from "./pages/Drive"
import { Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import DashboardLayout from "./components/layout/DashboardLayout"
import SharedFile from "./pages/SharedFile"
import Trash from "./pages/Trash"
import SharedWithMe from "./pages/SharedWithMe"


const App = () => {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login mode="login" />} />
        <Route path="/register" element={<Login mode="register" />} />
        <Route path="/s/:token" element={<SharedWithMe />} />

        {/* Private routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Drive />} />
            <Route path="/drive/:folderId" element={<Drive />} />
            <Route path="/shared" element={<SharedFile />} />
            <Route path="/trash" element={<Trash />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App