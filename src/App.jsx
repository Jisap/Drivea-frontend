import { Toaster } from "react-hot-toast"
import Login from "./pages/Login"
import Drive from "./pages/Drive"
import { Routes, Route, Navigate } from "react-router-dom"



const App = () => {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login mode="login" />} />
        <Route path="/register" element={<Login mode="register" />} />
        <Route path="/" element={<Drive />} />
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </>
  )
}

export default App