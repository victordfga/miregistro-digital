
import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  CalendarClock, 
  CalendarDays, 
  PlusCircle, 
  Inbox, 
  X, 
  Save, 
  Stethoscope, 
  User, 
  Clock,
  MapPin,
  Trash2,
  Edit2,
  ChevronLeft,
  Weight,
  FileUp,
  Ruler,
  AlertCircle,
  /* Fix: Added missing CheckCircle icon import */
  CheckCircle
} from 'lucide-react';

const Appointments: React.FC = () => {
  const { familyMembers, appointments, addAppointment, updateAppointment, deleteAppointment } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado para el formulario de creación de nueva cita
  const [formData, setFormData] = useState({
    doctor: '',
    specialty: '',
    date: '',
    time: '',
    location: '',
    patientId: '',
    patientName: ''
  });

  // Estado para el formulario de registro/edición de detalles de consulta
  const [recordData, setRecordData] = useState({
    diagnosis: '',
    weight: '',
    height: '',
    notes: '',
    documentUrl: ''
  });

  const handleOpenModal = () => {
    if (familyMembers.length > 0) {
        setFormData(prev => ({ 
            ...prev, 
            patientId: familyMembers[0].id, 
            patientName: familyMembers[0].name 
        }));
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'patientId') {
        const patient = familyMembers.find(m => m.id === value);
        setFormData(prev => ({ 
            ...prev, 
            patientId: value, 
            patientName: patient ? patient.name : '' 
        }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRecordChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRecordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.doctor || !formData.date || !formData.patientId) return;
    addAppointment({ ...formData, location: formData.location || 'Consultorio Médico' });
    setIsModalOpen(false);
    setFormData({ doctor: '', specialty: '', date: '', time: '', location: '', patientId: '', patientName: '' });
  };

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAppId) {
      updateAppointment(selectedAppId, recordData);
      setView('list');
      setSelectedAppId(null);
    }
  };

  const handleCardClick = (app: any) => {
    setSelectedAppId(app.id);
    setRecordData({
      diagnosis: app.diagnosis || '',
      weight: app.weight || '',
      height: app.height || '',
      notes: app.notes || '',
      documentUrl: app.documentUrl || ''
    });
    setView('edit');
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('¿Deseas eliminar esta cita médica de forma permanente?')) {
      deleteAppointment(id);
      if (selectedAppId === id) setView('list');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulación de carga: convertimos a base64 para el demo
      const reader = new FileReader();
      reader.onloadend = () => {
        setRecordData(prev => ({ ...prev, documentUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const selectedApp = appointments.find(a => a.id === selectedAppId);

  return (
    <div className="p-4 md:p-8 min-h-full">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        
        {view === 'list' ? (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">Gestión de Citas</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Organiza y realiza el seguimiento de tus visitas médicas.</p>
              </div>
              <button 
                onClick={handleOpenModal}
                className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-95"
              >
                <PlusCircle className="w-5 h-5" />
                Nueva Cita
              </button>
            </div>

            {appointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {appointments.map((app) => (
                  <div 
                    key={app.id} 
                    onClick={() => handleCardClick(app)}
                    className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all p-6 cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>
                    
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <CalendarClock className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-slate-900 dark:text-white font-black text-xl leading-tight">{app.doctor}</h4>
                          <p className="text-primary text-xs font-black uppercase tracking-widest mt-0.5">{app.specialty}</p>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => handleDelete(e, app.id)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all"
                        title="Eliminar cita"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                            <CalendarDays className="w-5 h-5 text-primary" />
                            <div className="flex gap-2 text-sm font-bold">
                                <span>{app.date}</span>
                                <span className="text-slate-300 dark:text-slate-700">|</span>
                                <span>{app.time}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-1">
                            <User className="w-4 h-4 text-slate-400" />
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">Paciente: <span className="text-slate-700 dark:text-slate-300 ml-1">{app.patientName}</span></p>
                        </div>
                    </div>

                    {app.diagnosis && (
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Diagnóstico:</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{app.diagnosis}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-4 bg-white dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600 mb-6">
                  <Inbox className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 text-center">No hay citas registradas</h3>
                <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm">Parece que aún no has programado ninguna visita médica. Haz clic en "Nueva Cita" para comenzar.</p>
              </div>
            )}
          </>
        ) : (
          <div className="animate-in fade-in slide-in-from-left-4 duration-300">
            <button 
              onClick={() => setView('list')}
              className="flex items-center gap-2 text-slate-500 hover:text-primary font-bold text-sm mb-6 group transition-all"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Volver al listado
            </button>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
              <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <Stethoscope className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white">{selectedApp?.doctor}</h2>
                      <p className="text-primary text-xs font-black uppercase tracking-widest">{selectedApp?.specialty}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-bold text-slate-500 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">{selectedApp?.date}</span>
                    <span className="text-xs font-medium text-slate-400">Paciente: {selectedApp?.patientName}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSaveRecord} className="p-6 md:p-8 space-y-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">DIAGNÓSTICO / MOTIVO</label>
                    <input 
                      name="diagnosis" 
                      placeholder="Ej. Control de rutina o Dolor abdominal"
                      value={recordData.diagnosis}
                      onChange={handleRecordChange}
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder-slate-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">PESO EN ESTA CONSULTA (KG)</label>
                      <div className="relative">
                        <Weight className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                        <input 
                          name="weight" 
                          type="text"
                          placeholder="Ej. 62.5"
                          value={recordData.weight}
                          onChange={handleRecordChange}
                          className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder-slate-400"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">TALLA / ALTURA (CM)</label>
                      <div className="relative">
                        <Ruler className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                        <input 
                          name="height" 
                          type="text"
                          placeholder="Ej. 175"
                          value={recordData.height}
                          onChange={handleRecordChange}
                          className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">NOTAS ADICIONALES</label>
                    <textarea 
                      name="notes" 
                      rows={4}
                      placeholder="Indicaciones, medicamentos, recordatorios..."
                      value={recordData.notes}
                      onChange={handleRecordChange}
                      className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none placeholder-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">DOCUMENTO DE LA CITA</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="group cursor-pointer border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-slate-50/30 dark:bg-slate-900/30 hover:border-primary hover:bg-primary/5 transition-all"
                    >
                      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                      {recordData.documentUrl ? (
                        <div className="flex flex-col items-center gap-2">
                          <CheckCircle className="w-10 h-10 text-green-500" />
                          <p className="text-sm font-bold text-slate-900 dark:text-white">Documento subido con éxito</p>
                          <button type="button" onClick={(e) => { e.stopPropagation(); setRecordData(p => ({...p, documentUrl: ''})); }} className="text-xs text-red-500 font-bold hover:underline">Eliminar archivo</button>
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                            <FileUp className="w-6 h-6" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-slate-900 dark:text-white">Haga clic para subir el carnet o receta</p>
                            <p className="text-xs text-slate-500 mt-1">Formatos admitidos: PDF, JPG, PNG (Máx 10MB)</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-100 dark:border-slate-700">
                  <button 
                    type="button" 
                    onClick={() => setView('list')}
                    className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="px-8 py-3 rounded-xl bg-primary text-white font-black shadow-lg shadow-blue-500/25 flex items-center gap-2.5 hover:bg-blue-600 transition-all active:scale-95"
                  >
                    <Save className="w-5 h-5" />
                    Guardar Registro
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Nueva Cita */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                <CalendarClock className="w-6 h-6 text-primary" />
                Nueva Cita Médica
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">PACIENTE</label>
                <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <select 
                        name="patientId" 
                        required
                        value={formData.patientId}
                        onChange={handleInputChange}
                        className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-semibold"
                    >
                        <option value="" disabled>Seleccionar familiar</option>
                        {familyMembers.map(m => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                    </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">DOCTOR / ESPECIALISTA</label>
                    <div className="relative">
                        <Stethoscope className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        <input 
                            name="doctor" 
                            required
                            placeholder="Nombre del Dr."
                            value={formData.doctor}
                            onChange={handleInputChange}
                            className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-semibold"
                        />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ESPECIALIDAD</label>
                    <input 
                        name="specialty" 
                        required
                        placeholder="Ej: Pediatría"
                        value={formData.specialty}
                        onChange={handleInputChange}
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-semibold"
                    />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">FECHA</label>
                    <input 
                        name="date" 
                        required
                        type="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-semibold"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">HORA</label>
                    <div className="relative">
                        <Clock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        <input 
                            name="time" 
                            required
                            type="time"
                            value={formData.time}
                            onChange={handleInputChange}
                            className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-semibold"
                        />
                    </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">UBICACIÓN</label>
                <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input 
                        name="location" 
                        placeholder="Ej: Clínica u Hospital"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-semibold"
                    />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 h-12 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 transition-all"
                >
                    Cancelar
                </button>
                <button 
                    type="submit" 
                    className="flex-1 h-12 rounded-xl bg-primary text-white font-black hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                >
                    <Save className="w-4 h-4" />
                    Guardar Cita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
