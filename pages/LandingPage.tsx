import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, ShieldCheck, Lock, FolderHeart, Users, BellRing, CheckCircle, Menu, LogIn } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <main className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-50 w-full border-b border-[#e7edf3] dark:border-gray-800 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-tight text-[#0d141b] dark:text-white">MiRegistro</h2>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex gap-6">
              <a className="text-sm font-medium text-[#0d141b] dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors" href="#">Ayuda</a>
              <a className="text-sm font-medium text-[#0d141b] dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors" href="#">Soporte</a>
            </nav>
            <div className="flex gap-3">
              <Link to="/login" state={{ mode: 'login' }} className="flex h-9 items-center justify-center rounded-lg px-4 text-sm font-bold text-[#0d141b] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                Iniciar Sesión
              </Link>
              <Link to="/login" state={{ mode: 'register' }} className="flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white hover:bg-primary/90 transition-colors shadow-sm">
                Registrarse
              </Link>
            </div>
          </div>
          <button className="md:hidden p-2 text-gray-600 dark:text-gray-300">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 flex flex-col gap-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 self-center lg:self-start rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-xs font-semibold text-primary">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Nuevo: Seguimiento Inteligente de Vacunas
              </div>
              <h1 className="text-4xl font-black leading-tight tracking-tight text-[#0d141b] dark:text-white sm:text-5xl md:text-6xl">
                La salud de tu familia, <span className="text-primary">Centralizada</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Simplifica tu vida. Gestiona citas, historial médico, recetas y resultados de laboratorio de toda tu familia en una bóveda segura y encriptada.
              </p>
              <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link to="/login" state={{ mode: 'register' }} className="flex h-12 min-w-[160px] items-center justify-center rounded-lg bg-primary px-6 text-base font-bold text-white shadow-md hover:bg-primary/90 transition-all focus:ring-4 focus:ring-primary/20">
                  Crear Cuenta
                </Link>
                <Link to="/login" state={{ mode: 'login' }} className="flex h-12 min-w-[160px] items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark px-6 text-base font-bold text-[#0d141b] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                  <span className="flex items-center gap-2">
                    <LogIn className="w-5 h-5" />
                    Iniciar Sesión
                  </span>
                </Link>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  <span>Cumple con HIPAA</span>
                </div>
                <div className="hidden sm:block h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-green-600" />
                  <span>Encriptación 256-bit</span>
                </div>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-6 relative">
              <div className="absolute -top-12 -right-12 -z-10 h-[300px] w-[300px] rounded-full bg-primary/20 blur-[80px]"></div>
              <div className="absolute -bottom-12 -left-12 -z-10 h-[300px] w-[300px] rounded-full bg-blue-400/20 blur-[80px]"></div>
              <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 aspect-[4/3] bg-surface-light dark:bg-surface-dark group" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA36sMD0aerqMnm4iz79Ac6ipQ4oIT-Vfl5ybYpAXx6rxTT2Pxm0ObH6wWqbCh7y8_pOixpD8e2RUyTgE6-lTnFqQklNPoHgBPV3kZ9yvw4JOipXfcAYPDncSg5WY8RXlG2Bgwx8FDuAKWcMELigks0PVbGnqz6UeHHyxhbq7VoZvSNpQCPYDqIHxz163Gtb-yM5HGzRyX4dfKBnE22TlGtWvoogxIWWd_2hmktwM_FPA_eU5qA3ur1EP3DxTObB0RnRLbSOZzUbpk')", backgroundSize: "cover", backgroundPosition: "center"}}>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d141b]/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="inline-flex items-center gap-2 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur p-3 shadow-lg">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Estado</p>
                      <p className="text-sm font-bold text-[#0d141b] dark:text-white">Registros Sincronizados</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-surface-dark py-16 sm:py-24 border-y border-[#e7edf3] dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-[#0d141b] dark:text-white sm:text-4xl">
              ¿Por qué elegir MiRegistro?
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              Diseñado para tu tranquilidad. Combinamos seguridad de grado médico con una interfaz amigable para mantener a tu familia saludable.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative rounded-xl border border-slate-200 dark:border-slate-700 bg-background-light dark:bg-background-dark p-6 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40 text-primary">
                <FolderHeart className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#0d141b] dark:text-white">Registros Centralizados</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Mantén todos los documentos, recetas e historial seguros en una bóveda encriptada accesible desde cualquier lugar.
              </p>
            </div>
            <div className="group relative rounded-xl border border-slate-200 dark:border-slate-700 bg-background-light dark:bg-background-dark p-6 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#0d141b] dark:text-white">Gestión Familiar</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Gestiona perfiles para tus hijos y padres mayores desde una sola cuenta con permisos detallados.
              </p>
            </div>
            <div className="group relative rounded-xl border border-slate-200 dark:border-slate-700 bg-background-light dark:bg-background-dark p-6 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400">
                <BellRing className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#0d141b] dark:text-white">Recordatorios Inteligentes</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Nunca pierdas un chequeo o vacuna con alertas personalizadas automatizadas enviadas directamente a tu teléfono.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-12 shadow-xl sm:px-12 sm:py-16 text-center">
            <div className="absolute inset-0 opacity-10" style={{backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "24px 24px"}}>
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                ¿Listo para tomar el control de tu salud?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
                Únete a miles de familias que confían en MiRegistro para sus necesidades de gestión médica.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Link to="/login" state={{ mode: 'register' }} className="rounded-lg bg-white px-8 py-3 text-base font-bold text-primary shadow hover:bg-blue-50 transition-colors">
                  Empezar Gratis
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-auto border-t border-[#e7edf3] dark:border-slate-800 bg-white dark:bg-surface-dark">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-primary">
                <Stethoscope className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-[#0d141b] dark:text-white">MiRegistro</span>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              <a className="text-sm font-medium text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors" href="#">Privacidad</a>
              <a className="text-sm font-medium text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors" href="#">Términos</a>
              <a className="text-sm font-medium text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors" href="#">Seguridad</a>
              <a className="text-sm font-medium text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors" href="#">Contacto</a>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-8 text-center md:text-left">
            <p className="text-sm text-slate-400">© 2024 MiRegistro Medico Digital. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;