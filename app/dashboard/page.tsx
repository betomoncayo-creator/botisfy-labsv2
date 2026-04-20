'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import {
  BookOpen,
  Trophy,
  Zap,
  ChevronRight,
  LayoutGrid,
  UserCheck,
  Calendar,
} from 'lucide-react';

export default function DashboardPage() {
  const [role, setRole] = useState('CARGANDO...');
  const [userName, setUserName] = useState('Freddy');
  const supabase = createClient();

  // Datos de las estadísticas
  const stats = [
    { label: 'CURSOS ACTIVOS', value: '04', icon: BookOpen },
    { label: 'PUNTOS POSIBLES', value: '00', icon: Zap },
    { label: 'RANGO ACTUAL', value: 'Master', icon: Trophy },
  ];

  // Carga de perfil desde Supabase
  useEffect(() => {
    const getProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, role')
          .eq('id', user.id)
          .single();

        if (data) {
          setRole(data.role.toUpperCase());
          setUserName(data.full_name || 'Freddy');
        }
      }
    };
    getProfile();
  }, []);

  // Fecha actual formateada
  const fechaHoy = new Date()
    .toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    .toUpperCase();

  return (
    <div className="h-full w-full animate-in fade-in duration-1000 p-0 sm:p-4 flex flex-col overflow-hidden">
      {/* CONTENEDOR PRINCIPAL - Ajustado para encajar en pantalla */}
      <div className="flex-1 w-full bg-[#0a0a0a] border border-white/5 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 lg:p-14 shadow-2xl relative overflow-y-auto custom-scrollbar">
        {/* Resplandor de fondo */}
        <div className="absolute top-0 right-0 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-[#00E5FF]/5 blur-[80px] sm:blur-[120px] pointer-events-none" />

        {/* CONTENEDOR INTERNO CENTRADO */}
        <div className="relative z-10 flex flex-col justify-center min-h-full space-y-8 md:space-y-10 max-w-7xl mx-auto pt-4 md:pt-0">
          {/* HEADER */}
          <header className="space-y-4 md:space-y-6">
            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              {/* ETIQUETA DE PERFIL */}
              <div className="flex items-center gap-2 bg-[#00E5FF]/10 border border-[#00E5FF]/20 px-3 md:px-5 py-2 md:py-2.5 rounded-full">
                <UserCheck
                  size={14}
                  className="text-[#00E5FF] w-3 h-3 md:w-3.5 md:h-3.5"
                />
                <span className="text-[8px] md:text-[10px] font-black text-[#00E5FF] uppercase tracking-[0.2em] md:tracking-[0.3em] italic">
                  PERFIL: {role}
                </span>
              </div>
              {/* ETIQUETA DE FECHA (Aporta valor real) */}
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 md:px-5 py-2 md:py-2.5 rounded-full text-zinc-400">
                <Calendar size={14} className="w-3 h-3 md:w-3.5 md:h-3.5" />
                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">
                  {fechaHoy}
                </span>
              </div>
            </div>

            {/* SOLUCIÓN: TÍTULO RESPONSIVO */}
            <h1 className="text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[4.5rem] font-black text-white italic tracking-tighter uppercase leading-[0.9] break-words">
              BIENVENIDO,
              <br className="sm:hidden" />{' '}
              <span className="text-zinc-500">{userName.split(' ')[0]}</span>
            </h1>
          </header>

          {/* GRID DE ESTADÍSTICAS - Más compacto en móviles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="group p-6 md:p-8 bg-white/[0.02] border border-white/5 rounded-[1.5rem] md:rounded-[2rem] hover:border-[#00E5FF]/20 transition-all duration-500 relative overflow-hidden"
              >
                <stat.icon
                  className="absolute right-4 md:right-6 bottom-4 md:bottom-6 text-white/5 scale-[2] md:scale-[2.5] group-hover:text-[#00E5FF]/10 transition-colors"
                  size={40}
                />
                <p className="text-[8px] md:text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] md:tracking-[0.3em] mb-2 md:mb-3 italic">
                  {stat.label}
                </p>
                <h3 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter">
                  {stat.value}
                </h3>
              </div>
            ))}
          </div>

          {/* SECCIÓN DE MÓDULOS RECIENTES */}
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center gap-4 md:gap-5">
              <h2 className="text-lg md:text-xl font-black text-white italic uppercase tracking-tighter">
                Cursos <span className="text-[#00E5FF]">Academy</span>
              </h2>
              <div className="h-[1px] flex-1 bg-white/10"></div>
            </div>

            <div className="group p-4 md:p-6 bg-white/[0.01] border border-white/5 rounded-[1.5rem] md:rounded-[2rem] flex flex-col sm:flex-row sm:items-center justify-between hover:bg-white/[0.03] transition-all cursor-pointer border-l-4 border-l-[#00E5FF]/40 gap-4 sm:gap-0">
              <div className="flex items-start sm:items-center gap-4 md:gap-6">
                <div className="w-10 md:w-12 h-10 md:h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-[#00E5FF]/50 transition-colors shrink-0">
                  <LayoutGrid className="text-[#00E5FF] w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm md:text-base tracking-tight uppercase italic leading-tight mb-1">
                    Automatización con Inteligencia Artificial
                  </h4>
                  <p className="text-[7px] md:text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em]">
                    Botisfy Labs • Especialización Corporativa
                  </p>
                </div>
              </div>
              <div className="flex justify-end w-full sm:w-auto">
                <ChevronRight className="text-zinc-700 group-hover:text-[#00E5FF] group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
      `,
        }}
      />
    </div>
  );
}
