import { useState } from "react"
import { useNavigate } from "react-router-dom";



const Login = ({ mode = "login" }) => {
  const isRegister = mode === "register";
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [isLoading, setIsLoading] = useState(false);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen text-zinc-900 flex flex-col md:flex-row">
      {/* Left Hero Brand Panel */}
      <div className="md:w-1/2 p-8 md:p-12 lg:p-16 bg-linear-to-br from-orange-50 via-zinc-100 to-red-50 
      border-b md:border-b-0 md:border-r border-zinc-200 flex flex-col justify-between relative overflow-hidden"
      >
        <div className='absolute inset-0 bg-[url("/pattern.svg")]'></div>

        <div className="relative z-10 flex items-center gap-3">
          <img
            src="/logo.svg"
            alt="Drivea Logo"
            className="max-h-9"
          />

          <span className="text-4xl font-medium uppercase text-zinc-900">Drivea</span>
        </div>

        <div className="relative z-10 my-12 space-y-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl tracking-tight text-zinc-900 leading-tight">
            Secure, Simple & Fast <br /> <span className="text-orange-600">Cloud Storage.</span>
          </h2>

          <p className="text-sm md:text-base text-zinc-600 max-w-md leading-relaxed">
            Store your files securely in our drive, organize into folders, share with permissions and access anywhere.
          </p>
        </div>

        <div className="relative z-10 text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} Drivea. All rights reserved.
        </div>
      </div>

      {/* Right Auth Form */}
    </div>
  )
}

export default Login