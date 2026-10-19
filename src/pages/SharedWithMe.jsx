import { Link } from "react-router-dom"


const SharedWithMe = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Minimal header */}
      <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
        <Link to="/">
          <img
            src="/logo.svg"
            alt="logo"
            className="size-7"
          />

          <span className="text-2xl font-medium text-slate-900">
            Drivea
          </span>
        </Link>
      </header>
    </div>
  )
}

export default SharedWithMe