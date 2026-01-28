import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, Syringe, Check } from 'lucide-react';

const ElderProfile: React.FC = () => {
  return (
    <div className="layout-container flex flex-col items-center w-full px-4 md:px-10 py-5">
      <div className="layout-content-container flex flex-col max-w-[1280px] w-full gap-6">
        <div className="flex flex-wrap gap-2 px-0 md:px-4">
          <Link to="/dashboard" className="text-slate-500 dark:text-slate-400 hover:text-primary text-sm font-medium leading-normal">Inicio</Link>
          <span className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal">/</span>
          <span className="text-slate-900 dark:text-slate-200 text-sm font-medium leading-normal">Jorge Rivera</span>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-24 w-24 ring-4 ring-slate-50 dark:ring-slate-900" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDeSnhLfMuE0W21pU1fHMr3-vRRBGv7NCSE5dGqn-jpZGXr8G-LJSAteJ9YFhFVqq0oeHreLT88HWfRN0gIYupzR4wSGz8652tnE4AjIyUCFsjJXgVDvDMsvMC_Lj3rIzVeDym2mTIUWlHIv199FylthAtym104ih9YcbfQGbgBQHkiu0GXLl_g5xTmKW3HhN8d3tDHUKNO__ZA4l0KB-3Gwj6VP0iKxBzNALLckof588tS-jclo71cHhsUATq2jeFpo5_WanT-kSI')"}}></div>
              <div className="flex flex-col justify-center">
                <h1 className="text-slate-900 dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">Jorge Rivera</h1>
                <p className="text-slate-500 dark:text-slate-400 text-base font-normal mt-1">72 años • Tipo Sangre A+</p>
                <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                  <span className="inline-flex items-center rounded-md bg-green-50 dark:bg-green-900/30 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400 ring-1 ring-inset ring-green-600/20">3 Medicamentos Activos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <h2 className="text-slate-900 dark:text-white text-xl font-bold">Medicamentos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                      <Pill className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg">Amoxicillin</h3>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">500mg</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 my-4">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Frecuencia</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-200">3x al Día</p>
                  </div>
                </div>
              </div>
              <div className="group bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                      <Syringe className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg">Metformin</h3>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">850mg</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 my-4">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Frecuencia</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-200">Con la Cena</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-6">Horario de Hoy</h3>
              <div className="relative pl-4 border-l border-slate-200 dark:border-slate-700 space-y-8">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 h-4 w-4 rounded-full bg-primary ring-4 ring-blue-100 dark:ring-blue-900/30 border-2 border-white dark:border-slate-800 animate-pulse"></div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-primary">2:00 PM</span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Amoxicillin (500mg)</p>
                    <div className="flex gap-2 mt-1">
                      <button className="flex-1 text-xs bg-primary text-white py-1.5 px-2 rounded hover:bg-blue-600 transition-colors flex items-center justify-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Marcar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElderProfile;