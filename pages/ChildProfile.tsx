import React from 'react';
import { AlertTriangle, Activity, Pill, Syringe } from 'lucide-react';

const ChildProfile: React.FC = () => {
  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 lg:px-8 py-6 gap-8">
      <main className="flex-1 flex flex-col gap-6 min-w-0">
        <section className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 shadow-sm border border-border-light dark:border-border-dark">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left w-full">
              <div className="bg-center bg-no-repeat bg-cover rounded-full h-24 w-24 sm:h-28 sm:w-28 shadow-md border-4 border-background-light dark:border-background-dark flex-shrink-0" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDnH2zD7g1YDuOQIJHW_5x9UXQCiZX70vdnAbZUkmVFyozzg19ZQO4AY4v_1IgCP7mpOSL7JJnxmNnoGTb1-xqJBw27F8F_pal4wjpHd_45BHc0RxCC2Jn85WY4m3npemh2hB-_4-4h8iS9lqm6W1MrFRAIT8k-PLMss6ZK4_YIOzWBsLou92jebBFNuoVfsnQ1AzcAK47QR9-Tu4_MSFtErhqJM2VSbERPoqKeAIlOLtr_jK4fqgG1yDCh50tpwosLShlu0oFhNrI')"}}></div>
              <div className="flex flex-col gap-1 pt-2">
                <h1 className="text-text-main dark:text-white text-2xl md:text-3xl font-bold leading-tight tracking-tight">Leo Rodriguez</h1>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start items-center">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">Dependiente - Hijo</span>
                  <span className="text-text-secondary dark:text-slate-400 text-sm font-normal">F.N.: 12/05/2015</span>
                </div>
              </div>
            </div>
            <button className="flex-shrink-0 w-full md:w-auto cursor-pointer items-center justify-center rounded-lg h-10 px-6 bg-border-light dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-text-main dark:text-white text-sm font-bold transition-colors">
              Editar Perfil
            </button>
          </div>
        </section>

        <section className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 md:opacity-10 pointer-events-none">
            <Activity className="w-32 h-32 text-red-600 dark:text-red-400 transform rotate-12" />
          </div>
          <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full p-2.5 flex-shrink-0">
            <AlertTriangle className="w-6 h-6 fill-current" />
          </div>
          <div className="flex-1 flex flex-col gap-1 z-10">
            <p className="text-text-main dark:text-red-50 text-base font-bold leading-tight flex items-center gap-2">
              Alerta de Alergia Severa
            </p>
            <p className="text-text-secondary dark:text-red-200 text-sm font-normal leading-normal max-w-2xl">
              El paciente presenta una reacción grave a la <span className="font-semibold text-text-main dark:text-red-50">Penicilina</span>. Atención médica inmediata requerida en caso de exposición. Llevar Epipen en todo momento.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1 rounded-xl bg-surface-light dark:bg-surface-dark p-4 border border-border-light dark:border-border-dark shadow-sm">
            <p className="text-text-secondary dark:text-slate-400 text-xs font-medium uppercase tracking-wide">Edad</p>
            <div className="flex items-end gap-2">
              <p className="text-text-main dark:text-white text-2xl font-bold leading-none">8</p>
              <span className="text-sm text-text-secondary dark:text-slate-500 mb-0.5">Años</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 rounded-xl bg-surface-light dark:bg-surface-dark p-4 border border-border-light dark:border-border-dark shadow-sm">
            <p className="text-text-secondary dark:text-slate-400 text-xs font-medium uppercase tracking-wide">Tipo de Sangre</p>
            <div className="flex items-end gap-2">
              <p className="text-text-main dark:text-white text-2xl font-bold leading-none">O+</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden flex flex-col h-full">
            <div className="p-5 border-b border-border-light dark:border-border-dark flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-primary">
                  <Pill className="w-6 h-6" />
                </div>
                <h3 className="text-text-main dark:text-white font-bold text-lg">Medicamentos</h3>
              </div>
            </div>
            <div className="flex flex-col divide-y divide-border-light dark:divide-border-dark">
              <div className="p-4 flex items-start gap-4 hover:bg-background-light dark:hover:bg-slate-800 transition-colors">
                <div className="mt-1">
                  <Pill className="w-5 h-5 text-text-secondary dark:text-slate-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="text-text-main dark:text-white font-semibold">Amoxicilina</p>
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">Activo</span>
                  </div>
                  <p className="text-sm text-text-secondary dark:text-slate-400">500mg • Tomar 2 veces al día con comida</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden flex flex-col h-full">
            <div className="p-5 border-b border-border-light dark:border-border-dark flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg text-emerald-600 dark:text-emerald-400">
                  <Syringe className="w-6 h-6" />
                </div>
                <h3 className="text-text-main dark:text-white font-bold text-lg">Vacunas</h3>
              </div>
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-800">Al día</span>
            </div>
            <div className="p-5">
              <div className="relative pl-4 border-l-2 border-border-light dark:border-slate-700 flex flex-col gap-6">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800"></div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-text-main dark:text-white font-semibold text-sm">Influenza (Gripe)</p>
                    <p className="text-xs text-text-secondary dark:text-slate-400">24 Oct, 2023</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChildProfile;