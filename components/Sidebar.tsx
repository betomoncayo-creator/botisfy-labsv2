'use client'
import { LayoutDashboard, Users, BookOpen, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { name: 'DASHBOARD', href: '/dashboard', icon: LayoutDashboard },
    { name: 'USUARIOS', href: '/dashboard/usuarios', icon: Users },
    { name: 'ACADEMIA', href: '/dashboard/academia', icon: BookOpen },
    { name: 'AJUSTES', href: '/dashboard/settings', icon: Settings },
  ]

  const handleLogout = () => {
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace('/login');
  };

  return (
    // CAMBIO CLAVE AQUÍ: h-screen y sticky top-0 anclan el panel a la pantalla
    <aside className="w-72 border-r border-white/5 bg-black p-8 flex flex-col h-screen sticky top-0 z-[99]">
      
      {/* Contenedor Superior (Logo y Menú) */}
      <div className="flex-1 space-y-12">
        
        {/* LOGO Y TÍTULO */}
        <div className="flex items-center gap-4 px-2 mb-12 group">
          <div className="w-14 h-14 flex items-center justify-center">
            <img 
              src="/logo-botisfy.png" 
              alt="Botisfy Logo" 
              className="w-full h-full object-contain" 
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="font-black text-2xl italic text-white uppercase leading-[0.8] tracking-tighter">
              Botisfy
            </h2>
            <span className="text-[10px] text-[#00E5FF] font-black tracking-[0.2em] uppercase mt-1 italic">
              Labs
            </span>
          </div>
        </div>

        {/* NAVEGACIÓN */}
        <nav className="space-y-4">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                pathname === item.href 
                ? 'bg-[#00E5FF] text-black shadow-lg shadow-[#00E5FF]/20 scale-105' 
                : 'text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={20} /> {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Contenedor Inferior (Botón Salir) - mt-auto lo pega al fondo siempre */}
      <div className="border-t border-white/5 pt-10 mt-auto">
        <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 text-red-500/60 hover:text-red-500 transition-all text-[10px] font-black uppercase tracking-[0.2em] group hover:bg-red-500/10 rounded-2xl">
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          <span>Finalizar Sesión</span>
        </button>
      </div>
      
    </aside>
  )
}