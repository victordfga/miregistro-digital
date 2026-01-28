import React from 'react';
import { ScanText, CloudUpload } from 'lucide-react';

const DocumentRepo: React.FC = () => {
  return (
    <div className="p-4 md:p-8 space-y-8">
      <header className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">Repositorio de Documentos</h2>
      </header>
      <section className="@container">
        <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-2xl border border-indigo-100 dark:border-slate-700 p-6 md:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.07] pointer-events-none">
            <ScanText className="w-48 h-48 text-primary" />
          </div>
          <div className="flex flex-col lg:flex-row gap-8 relative z-10">
            <div className="flex-1 flex flex-col justify-center gap-6 max-w-2xl">
              <h1 className="text-slate-900 dark:text-white text-2xl md:text-3xl font-black tracking-tight">Captura Inteligente de Datos (OCR)</h1>
              <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">Sube y categoriza documentos médicos sin esfuerzo.</p>
              <div className="flex flex-wrap gap-3">
                <button className="bg-primary hover:bg-blue-600 text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95">
                  <CloudUpload className="w-5 h-5" />
                  Carga Inteligente
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all cursor-pointer">
          <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-700/50 rounded-lg overflow-hidden relative flex items-center justify-center">
            <div className="bg-cover bg-center absolute inset-0 opacity-80 hover:opacity-100 transition-opacity" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAHzxDFatz1E72Jq7rPu4tjXJ3KuG30Xt_vBW159bg1w1yvjTIHlljNAmPjjqLyDUmy99Rg5MUvIhlEfhDkbVJcPngAx5dLrWyk9wnsB70WR6gE5LbzxsUbhjNkvtQUWxfQlAtFbZ-3tanLesqA5_F91AhKh0W-ukqSXqnrSq-4RopDjjjSc48xoNFxGReeAJ6ptxqbjfbP_KHWLyCl2U1yXDfWMucTs37xOfx7FpI1I2hwd7ZHO9RDbxHinpPCA6iduk1jfbFURIs')"}}></div>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-slate-900 dark:text-white text-base font-bold leading-tight">Receta de Amoxicilina</h3>
            <span className="text-slate-500 dark:text-slate-400 text-xs">24 Oct, 2023</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentRepo;