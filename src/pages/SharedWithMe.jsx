import { Link, useParams } from "react-router-dom"
import api from "../config/api"

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

      </main>
    </div>
  )
}

export default SharedWithMe