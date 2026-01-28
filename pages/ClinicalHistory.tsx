import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, CalendarDays, Pill, Syringe, FileDown, Printer, ChevronLeft, User } from 'lucide-react';

const ClinicalHistory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { familyMembers, appointments } = useAuth();
  
  const member = familyMembers.find(m => m.id === id);

  if (!member) {
    return <div className="p-20 text-center">Familiar no encontrado.</div>;
  }

  // Filtrar y ordenar datos
  const memberAppointments = appointments
    .filter(app => app.patientId === member.id)
    .sort((a, b) => new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime());

  const now = new Date();
  const pastAppointments = memberAppointments.filter(app => new Date(app.date) < now);
  const futureAppointments = memberAppointments.filter(app => new Date(app.date) >= now);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-50 min-h-screen p-6 md:p-10 print:p-0 print:bg-white">
      {/* Botones de Acción (Ocultos al imprimir) */}
      <div className="max-w-[210mm] mx-auto mb-8 flex justify-between items-center print:hidden">
        <Link to="/family" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold transition-colors">
            <ChevronLeft className="w-5 h-5" /> Volver
        </Link>
        <div className="flex gap-3">
            <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg shadow-sm text-slate-700 font-bold hover:bg-slate-50 transition-colors"
            >
                <Printer className="w-4 h-4" /> Imprimir
            </button>
            <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg shadow-sm font-bold hover:bg-blue-600 transition-colors"
            >
                <FileDown className="w-4 h-4" /> Guardar PDF
            </button>
        </div>
      </div>

      {/* Hoja de Reporte (A4 Style) */}
      <div className="max-w-[210mm] mx-auto bg-white shadow-xl print:shadow-none p-[15mm] min-h-[297mm] text-slate-900">
        
        {/* Header del Reporte */}
        <header className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-primary mb-1">
                    <Stethoscope className="w-6 h-6" />
                    <span className="text-xl font-black tracking-tight text-slate-900">MiRegistro Medico</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">Reporte Clínico Integral</p>
                <p className="text-xs text-slate-500">Fecha de emisión: {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="text-right">
                <h1 className="text-2xl font-bold uppercase tracking-wider">Historia Clínica</h1>
                <p className="text-sm font-mono text-slate-400 mt-1">REF: #{member.id.toUpperCase().slice(0, 8)}</p>
            </div>
        </header>

        {/* Datos del Paciente */}
        <section className="mb-10 bg-slate-50 p-6 rounded-xl border border-slate-100 print:border-slate-300 print:bg-white">
            <h2 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-4 flex items-center gap-2">
                <User className="w-4 h-4" /> Información del Paciente
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Nombre Completo</p>
                    <p className="font-bold text-lg">{member.name}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Edad / Etapa</p>
                    <p className="font-medium">
                        {member.isPrenatal ? 'Prenatal' : `${member.age} ${member.ageUnit === 'months' ? 'meses' : 'años'}`}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Tipo de Sangre</p>
                    <p className="font-medium">{member.bloodType || 'N/A'}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Documento ID</p>
                    <p className="font-medium">{member.docType && member.docNumber ? `${member.docType}: ${member.docNumber}` : 'No registrado'}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Talla / Peso</p>
                    <p className="font-medium">{member.height ? `${member.height}cm` : '-'} / {member.weight ? `${member.weight}kg` : '-'}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Alergias / Alertas</p>
                    <p className={`font-bold ${member.alertType === 'danger' ? 'text-red-600' : 'text-slate-900'}`}>
                        {member.needsAttention ? 'Sí (Ver detalle)' : 'Ninguna conocida'}
                    </p>
                </div>
            </div>
        </section>

        {/* Citas Pasadas (Historial) */}
        <section className="mb-10">
            <h2 className="text-lg font-bold border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-slate-400" /> Historial de Consultas
            </h2>
            {pastAppointments.length > 0 ? (
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="bg-slate-100 text-slate-500 text-xs uppercase font-bold print:bg-slate-200">
                            <th className="px-4 py-3 rounded-l-lg">Fecha</th>
                            <th className="px-4 py-3">Especialista</th>
                            <th className="px-4 py-3">Diagnóstico</th>
                            <th className="px-4 py-3 rounded-r-lg">Notas</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {pastAppointments.map(app => (
                            <tr key={app.id}>
                                <td className="px-4 py-3 font-medium whitespace-nowrap">{app.date}</td>
                                <td className="px-4 py-3">
                                    <p className="font-bold">{app.doctor}</p>
                                    <p className="text-xs text-slate-500">{app.specialty}</p>
                                </td>
                                <td className="px-4 py-3 text-slate-700">{app.diagnosis || 'Sin diagnóstico registrado'}</td>
                                <td className="px-4 py-3 text-slate-500 italic text-xs max-w-[200px]">{app.notes || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-slate-500 italic text-sm">No hay registro de consultas pasadas.</p>
            )}
        </section>

        {/* Medicamentos y Vacunas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Medicamentos */}
            <section>
                <h2 className="text-lg font-bold border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
                    <Pill className="w-5 h-5 text-slate-400" /> Recetas / Medicación
                </h2>
                {member.medications && member.medications.length > 0 ? (
                    <ul className="space-y-3">
                        {member.medications.map(med => (
                            <li key={med.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100 print:border-slate-300">
                                <div className="flex justify-between items-start">
                                    <span className="font-bold text-slate-900">{med.name}</span>
                                    <span className="text-xs font-bold uppercase bg-blue-100 text-blue-700 px-2 py-0.5 rounded print:border print:border-blue-200">{med.status === 'active' ? 'Activo' : 'Inactivo'}</span>
                                </div>
                                <p className="text-sm text-slate-600 mt-1">Dosis: {med.dosage}</p>
                                <p className="text-xs text-slate-500">Frecuencia: {med.frequency}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-slate-500 italic text-sm">Sin medicamentos registrados.</p>
                )}
            </section>

            {/* Vacunas */}
            <section>
                <h2 className="text-lg font-bold border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
                    <Syringe className="w-5 h-5 text-slate-400" /> Vacunación
                </h2>
                {member.vaccines && member.vaccines.length > 0 ? (
                    <ul className="space-y-3">
                        {member.vaccines.map(vac => (
                            <li key={vac.id} className="flex justify-between items-center bg-green-50/50 p-3 rounded-lg border border-green-100 print:border-slate-300 print:bg-white">
                                <span className="font-bold text-slate-900">{vac.name}</span>
                                <span className="text-sm text-slate-600 font-mono">{vac.date}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-slate-500 italic text-sm">Sin registro de vacunas.</p>
                )}
            </section>
        </div>

        {/* Citas Futuras (Agenda) */}
        <section className="mb-10 print:break-inside-avoid">
             <h2 className="text-lg font-bold border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-slate-400" /> Citas Programadas
            </h2>
            {futureAppointments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {futureAppointments.map(app => (
                        <div key={app.id} className="border border-slate-200 rounded-lg p-4 flex justify-between items-center print:border-slate-400">
                            <div>
                                <p className="font-bold text-slate-900">{app.doctor}</p>
                                <p className="text-sm text-slate-600">{app.specialty}</p>
                                <p className="text-xs text-slate-500 mt-1">Motivo: {app.diagnosis || 'Consulta General'}</p>
                            </div>
                            <div className="text-right bg-slate-100 px-3 py-2 rounded-lg print:bg-transparent">
                                <p className="font-bold text-slate-900">{app.date}</p>
                                <p className="text-sm">{app.time}</p>
                            </div>
                        </div>
                     ))}
                </div>
            ) : (
                <p className="text-slate-500 italic text-sm">No hay citas futuras programadas.</p>
            )}
        </section>

        {/* Footer del reporte */}
        <footer className="mt-20 border-t border-slate-200 pt-6 text-center text-xs text-slate-400 print:mt-auto">
            <p>Este documento es un resumen del historial clínico digital registrado en la plataforma MiRegistro.</p>
            <p className="mt-1">Generado automáticamente. Verifique la información con los documentos originales.</p>
        </footer>

      </div>
    </div>
  );
};

export default ClinicalHistory;