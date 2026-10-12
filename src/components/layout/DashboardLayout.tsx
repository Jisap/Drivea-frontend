import React, { useState } from 'react'
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);

  return (
    <div className='min-h-screen bg-slate-50 text-slate-900 flex flex-col'>
      {/* Sidebar */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        onCreateFolderClick={() => setIsCreateFolderOpen(true)}
      />

      {/* Main Content Workspace */}
      <div className='md:pl-64 flex flex-col flex-1'>
        {/* Header */}
        <p>Header</p>

        <main className='flex-1 p-4 md:p-6 overflow-y-auto'>
          <Outlet />
        </main>

      </div>
    </div>
  )
}

export default DashboardLayout