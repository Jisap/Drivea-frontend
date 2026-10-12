import React, { useRef } from 'react'
import { useApp } from '../../context/AppContext'
import { useLocation } from 'react-router-dom';
import { HardDriveIcon, Trash2Icon, UsersIcon } from 'lucide-react';

const Sidebar = ({ onCreateFolderClick, isMobileOpen, setIsMobileOpen }) => {

  const { user, currentFolderId } = useApp();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const storage_used = Number(user?.storage_used ?? 0);
  const storage_limit = Number(user?.storage_limit ?? 1073741824); // 1 GB
  const used_percentage = Math.min(100, Math.round((storage_used / storage_limit) * 100))

  const navItem = [
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
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Brand logo header */}
        <div>
          <p>logo</p>
        </div>

        {/* Upload CTA Dropdown */}
        <div>
          <p>upload btn</p>
        </div>

        {/* Navigation Links */}
        <nav>
          <p>Links</p>
        </nav>

        {/* Storage usage widget */}
        <div>
          <p>Storage Usage</p>
        </div>
      </aside>
    </>
  )
}

export default Sidebar