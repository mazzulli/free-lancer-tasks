import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Toaster } from 'sonner'
import { Sidebar } from './Sidebar'

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Backdrop overlay — mobile/tablet only, closes sidebar on click */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Content area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile/tablet top bar — hidden on desktop */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 glass border-b border-neon-cyan/20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-muted-foreground hover:text-neon-cyan hover:bg-neon-cyan/10 transition-colors"
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>
          <div>
            <span className="text-sm font-bold neon-text-cyan tracking-widest uppercase">Freelancer</span>
            <span className="text-xs text-muted-foreground ml-2">Manager Board</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto scrollbar-thin">
          <div className="p-4 md:p-6 max-w-screen-2xl">
            <Outlet />
          </div>
        </main>
      </div>

      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: 'rgba(10,30,80,0.9)',
            border: '1px solid rgba(0,229,255,0.25)',
            color: '#e0f7fa',
          },
        }}
      />
    </div>
  )
}
