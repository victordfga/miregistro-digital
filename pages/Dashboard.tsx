import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Upload, 
  CalendarClock, 
  Pill, 
  Syringe, 
  CheckCircle, 
  ChevronRight, 
  BellRing, 
  Plus, 
  Users, 
  CalendarDays,
  AlertCircle
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, familyMembers, appointments } = useAuth();
  
  // Consideramos usuario "nuevo" si no tiene familiares agregados aún
  const isActuallyNew = familyMembers.length === 0;

  if (isActuallyNew) {
    return (
        <div className="p-4 md:p-10 max-w-5xl mx-auto flex flex-col gap-8 h-full justify-center min-h-[80vh]">
            <div className="text-center max-w-2xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-slate-900 dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-tight">
                    ¡Bienvenido, {user?.firstName}! <span className="text-4xl">👋</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg">
                    Tu registro médico digital está listo para ser usado.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all flex flex-col items-center text-center gap-6 group">
                    <div className="w-20 h-20 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                        <Users className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Agregar Miembros</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Crea perfiles para tus hijos, padres o pareja para centralizar su historial.</p>
                    </div>
                    <Link to="/family" state={{ autoOpen: true }} className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex justify-center items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Agregar Miembro
                    </Link>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-purple-500/30 transition-all flex flex-col items-center text-center gap-6 group">
                    <div className="w-20 h-20 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                        <Upload className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Subir Archivos</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Escanea recetas, análisis o carnets de vacunación para tenerlos siempre a mano.</p>
                    </div>
                    <Link to="/documents" className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 flex justify-center items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Subir Documento
                    </Link>
                </div>
            </div>
        </div>
    )
  }

  const activeMeds = familyMembers.reduce((acc, m) => acc + (m.medications?.length || 0), 0);
  
  // Cálculo de Citas Pendientes vs Pasadas
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const pendingAppointments = appointments.filter(app => {
    const appDate = new Date(app.date);
    return appDate >= now;
  });

  const pastAppointments = appointments.filter(app => {
    const appDate = new Date(app.date);
    return appDate < now;
  });

  // Cálculo de Vacunación
  const allVaccines = familyMembers.flatMap(m => m.vaccines || []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const totalVaccines = allVaccines.length;
  
  let nextBoosterInfo = null;
  if (allVaccines.length > 0) {
      const latestDate = new Date(allVaccines[0].date);
      const boosterDate = new Date(latestDate);
      boosterDate.setFullYear(boosterDate.getFullYear() + 1); // Asumimos refuerzo anual
      
      const nowDate = new Date();
      const diffDays = Math.ceil((boosterDate.getTime() - nowDate.getTime()) / (1000 * 60 * 60 * 24));
      
      nextBoosterInfo = {
          date: boosterDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
          isUrgent: diffDays < 30,
          daysLeft: diffDays
      };
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex flex-wrap justify-between items-end gap-4 pb-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">Hola, {user?.firstName} 👋</h1>
          <p className="text-slate-500 text-sm md:text-base font-medium">
            Gestionando la salud de {familyMembers.length} familiares.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/documents" className="flex items-center gap-2 h-11 px-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white text-sm font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95">
            <Upload className="w-5 h-5" />
            <span>Subir Archivo</span>
          </Link>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-3 rounded-2xl p-6 bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="p-2.5 w-fit bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
            <CalendarClock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Visitas Próximas</p>
            <div className="flex items-baseline gap-2">
                <p className="text-slate-900 dark:text-white text-3xl font-black">{pendingAppointments.length}</p>
                <span className="text-xs font-bold text-slate-400">pendientes</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-tight">
              {pastAppointments.length} visitas realizadas
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-2xl p-6 bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="p-2.5 w-fit bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Recetas Activas</p>
            <p className="text-slate-900 dark:text-white text-3xl font-black">{activeMeds}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-2xl p-6 bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
          <div className="p-2.5 w-fit bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl">
            <Syringe className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Vacunación</p>
            <div className="flex items-baseline gap-2">
                <p className="text-slate-900 dark:text-white text-3xl font-black">{totalVaccines > 0 ? totalVaccines : '--'}</p>
                {totalVaccines > 0 && <span className="text-xs font-bold text-slate-400">dosis registradas</span>}
            </div>
            
            {nextBoosterInfo ? (
                <div className={`mt-2 flex items-center gap-1.5 py-1 px-2 rounded-lg text-[10px] font-bold border ${
                    nextBoosterInfo.isUrgent 
                        ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800' 
                        : 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                }`}>
                    {nextBoosterInfo.isUrgent ? <AlertCircle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                    <span>Próximo refuerzo: {nextBoosterInfo.date}</span>
                </div>
            ) : totalVaccines > 0 ? (
                <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-tight">Historial al día</p>
            ) : (
                <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-tight">Sin registros recientes</p>
            )}
          </div>
          {nextBoosterInfo?.isUrgent && (
              <div className="absolute top-0 right-0 p-2">
                  <span className="flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
              </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-slate-900 dark:text-white text-lg font-bold">Miembros de la Familia</h3>
              <Link to="/family" className="text-primary text-sm font-bold hover:underline">Ver Todos</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {familyMembers.map((member) => (
                <Link key={member.id} to={`/profile/${member.id}`} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 hover:border-primary/50 hover:shadow-md transition-all group">
                    <div className="relative">
                        {member.avatar ? (
                            <div className="size-14 rounded-full bg-cover bg-center border-2 border-slate-50 dark:border-slate-800" style={{backgroundImage: `url('${member.avatar}')`}}></div>
                        ) : (
                            <div className={`size-14 rounded-full flex items-center justify-center text-white font-bold text-xl border-2 border-slate-50 dark:border-slate-800 ${
                                member.type === 'child' ? 'bg-orange-400' : member.type === 'elder' ? 'bg-purple-500' : 'bg-primary'
                            }`}>
                                {member.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                            <h4 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">{member.name}</h4>
                            <span className="text-xs font-bold text-slate-400">{member.age}a</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium truncate">{member.relation}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
              <Link to="/family" state={{ autoOpen: true }} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-primary transition-all cursor-pointer min-h-[86px] group">
                  <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Agregar Otro</span>
              </Link>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-slate-900 dark:text-white text-lg font-bold">Agenda Próxima</h3>
                <Link to="/appointments" className="text-primary text-xs font-bold hover:underline">Ver Calendario</Link>
            </div>
            <div className="p-6">
                {pendingAppointments.length > 0 ? (
                    <div className="space-y-4">
                        {pendingAppointments.slice(0, 3).map(app => (
                            <Link key={app.id} to="/appointments" className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all group">
                                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <CalendarDays className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-slate-900 dark:text-white truncate">{app.doctor}</h4>
                                        <span className="text-[10px] font-black uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-md tracking-wider">{app.specialty}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-bold mt-1 flex items-center gap-1.5">
                                        <CalendarDays className="w-3.5 h-3.5" /> {app.date} • {app.time}
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tight">Paciente: <span className="text-slate-600 dark:text-slate-300">{app.patientName}</span></p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 flex flex-col items-center gap-4 opacity-50">
                        <div className="size-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <CalendarClock className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-slate-500 text-sm font-bold">No tienes citas agendadas.</p>
                        <Link to="/appointments" className="text-primary text-xs font-bold hover:underline">Agendar una ahora</Link>
                    </div>
                )}
            </div>
          </section>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-8 self-start text-center space-y-6">
            <h3 className="text-slate-900 dark:text-white font-bold flex items-center justify-center gap-2">
                <BellRing className="w-5 h-5 text-amber-500" />
                Acción Requerida
            </h3>
            <div className="space-y-4">
                {nextBoosterInfo?.isUrgent ? (
                    <div className="space-y-4 animate-pulse">
                        <div className="size-20 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto shadow-inner">
                            <Syringe className="w-10 h-10 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-amber-600 dark:text-amber-400">Refuerzo Sugerido</p>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed px-4">Un miembro de tu familia requiere una dosis de refuerzo pronto ({nextBoosterInfo.date}).</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="size-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto shadow-inner">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">Todo en orden</p>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed px-4">No hay alertas de salud activas ni medicamentos pendientes para tu familia.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;