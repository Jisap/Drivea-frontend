import React, { useRef } from 'react'
import { useApp } from '../../context/AppContext'
import { Link, useLocation } from 'react-router-dom';
import { FolderPlusIcon, HardDriveIcon, HardDriveUploadIcon, PlusIcon, Trash2Icon, UsersIcon } from 'lucide-react';
import { Dropdown, DropdownItem } from '../ui/Dropdown';
import { ProgressBar } from '../ui/ProgressBar';
import { formatBytes } from '../../assets/assets';

type SidebarProps = {
  onCreateFolderClick: () => void;          // función sin argumentos ni retorno
  isMobileOpen: boolean;                    // estado booleano
  setIsMobileOpen: (open: boolean) => void; // setter del estado
}


const Sidebar = ({ onCreateFolderClick, isMobileOpen, setIsMobileOpen }: SidebarProps) => {

  const isUploading = false
  const { user, currentFolderId } = useApp();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const storage_used = Number(user?.storage_used ?? 0);
  const storage_limit = Number(user?.storage_limit ?? 1073741824); // 1 GB
  const used_percentage = Math.min(100, Math.round((storage_used / storage_limit) * 100))

  const navItems = [
    { label: "My Drive", path: "/", icon: HardDriveIcon },
    { label: "Shared Files", path: "/shared", icon: UsersIcon },
    { label: "Trash", path: "/trash", icon: Trash2Icon },
  ]

  return (
    <>
      {/* Overlay oscuro - solo visible en mobile cuando el sidebar está abierto */}
      {isMobileOpen && (
        <div
          className='fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-xs md:hidden'
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar - siempre visible en desktop, condicional en mobile */}
      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300
          ${isMobileOpen
            ? "translate-x-0"         // si isMobileOpen es true mostrar sidebar (desplaza desde la izquierda a la derecha)
            : "-translate-x-full"     // si isMobileOpen es false ocultar sidebar (desplaza desde la derecha a la izquierda) // Desktop: siempre mostrar sidebar
          }  
          md:translate-x-0            
        `}
      >
        {/* Brand logo header */}
        <div className='flex items-center gap-3 px-6 py-5 border-b border-slate-200'>
          <img
            src="/logo.svg"
            alt="Logo"
            className='size-11'
          />

          <div>
            <h1 className='text-2xl font-medium uppercase text-slate-800'>Drivea</h1>
            <p className='text-xs text-slate-500 tracking-wider font-medium uppercase'>Cloud Storage</p>
          </div>
        </div>

        {/* Upload CTA Dropdown */}
        <div className='p-4'>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            className='hidden'
          />

          <Dropdown
            trigger={
              <button
                type="button"
                disabled={isUploading}
                className='w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibodl text-sm rounded-lg transition-all disabled:opacity-50 cursor-pointer'
              >
                <PlusIcon size={15} />
                <span>New Item</span>
              </button>
            }
            align="left"
            className='w-32'
          >
            <DropdownItem
              icon={HardDriveUploadIcon}
              onClick={() => fileInputRef.current?.click()}
            >
              Upload Files
            </DropdownItem>
            <DropdownItem
              icon={FolderPlusIcon}
              onClick={() => onCreateFolderClick}
            >
              New Folder
            </DropdownItem>
          </Dropdown>
        </div>

        {/* Navigation Links */}
        <nav className='flex-1 px-3 py-2 space-y-1 overflow-y-auto'>
          {navItems.map((item) => {
            const Icon = item.icon;
            /* 
              * Lógica de estado "Activo" para el menú:
              * - Si es la ruta raíz ("/"): El enlace se resalta tanto en "/" como en cualquier 
              *   ruta que empiece por "/drive" (ej. /drive/archivos).
              * - Para cualquier otra ruta: Solo se resalta si la URL actual es exactamente igual.
            */
            const isActive = item.path === "/"
              ? location.pathname === "/" || location.pathname.startsWith("/drive")
              : location.pathname === item.path

            return (
              <Link
                to={item.path}
                key={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium tansition-all
                  ${isActive
                    ? "border-r-3 border-orange-500 bg-linear-to-r from-orange-50 to-orange-100 text-orange-600"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }
                `}
              >
                <Icon
                  className={`size-4.5 ${isActive ? "text-orange-600" : "text-slate-500"}`}
                />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Storage usage widget */}
        <div className='p-4 border-t border-slate-200 bg-slate-50'>
          <div className='flex items-center justify-between text-xs mb-2'>
            <span className='text-slate-600 font-medium'>Storage</span>
            <span className='text-slate-900 font-semibold'>{used_percentage}%</span>
          </div>
          <ProgressBar
            progress={used_percentage}
            color={
              used_percentage > 90 ? "bg-red-600" : used_percentage > 75 ? "bg-amber-500" : "bg-orange-600"
            }
          />
          <p className='text-[11px] text-slate-500 mt-2'>
            {formatBytes(storage_used)} of {formatBytes(storage_limit)} used
          </p>
        </div>
      </aside>
    </>
  )
}

export default Sidebar