import React from 'react'
import { useApp } from '../../context/AppContext'
import { MenuIcon, SearchIcon } from 'lucide-react'

const Header = ({ onMobileMenuToggle }) => {

  const { user, logout, searchQuery, setSearchQuery, sortBy, setSortBy } = useApp()

  return (
    <div className='sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 md:px-6 flex items-center justify-between gap-4'>
      {/* Left */}
      <div className='flex items-center gap-3 flex-1 max-w-xl'>
        <button
          type="button"
          onClick={onMobileMenuToggle} // Abre o cierra el sidebar en dispositivos móviles
          className='p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 md:hidden'
        >
          <MenuIcon />
        </button>

        <div className='relative flex-1'>
          <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400'>
            <SearchIcon className="size-4" />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search files and folders...'
            className='w-full bg-slate-100 border border-slate-200 focus:bg-white focus:border-orange-600 focus:ring-1
              focus:ring-orange-600 rounded-xl text-sm text-slate-900 placeholder-slate-400 pl-10 pr-4 py-2 transition outline-none'
          />

          {searchQuery && ( // Si hay algo escrito en el buscador, muestra un botón para limpiar la búsqueda
            <button
              onClick={() => setSearchQuery("")}
              className='absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-500 hover:text-slate-900 font-medium'
            >
              Clear
            </button>
          )}
        </div>
      </div>
      {/* Right */}
    </div>
  )
}

export default Header