import { Link, useParams } from "react-router-dom"
import api from "../config/api"
import { useEffect, useState } from "react"
import { Spinner } from "../components/ui/Spinner";
import { LockIcon } from "lucide-react";

const SharedWithMe = () => {

  const { token } = useParams(); // Generado en el backend aleatoriamente oara un enlace compartido
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    api.get(`/api/shares/access/${token}`).then((res) => {
      setData(res.data)
    }).catch((err) => {
      setError(err.response?.data?.error || "unable to load shared item.")
    }).finally(() => setIsLoading(false))
  }, [token])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Minimal header */}
      <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/logo.svg"
            alt="logo"
            className="size-7"
          />

          <span className="text-2xl font-medium text-slate-900">
            Drivea
          </span>
        </Link>

        <Link to="login" className="text-xs font-semibold text-orange-600 hover:underline">
          Sign In
        </Link>
      </header>

      {/* Content Container */}
      <main className="flex-1 items-center justify-center p-6">
        {isLoading ? (
          <div className="text-center space-y-3">
            <Spinner size="lg" className="text-orange-600" />
            <p className="text-sm text-slate-500 font-medium">Loading shared item...</p>
          </div>
        ) : error ? (
          <div className="max-w-md w-full p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-4">
            <div className="size-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
              <LockIcon className="size-6" />
            </div>
          </div>
        ) : data?.resource_type === "file" ? (
          <div>

          </div>
        ) : (
          // folder view
          <div>

          </div>
        )}
      </main>
    </div>
  )
}

export default SharedWithMe