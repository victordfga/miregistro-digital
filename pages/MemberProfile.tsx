import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ChevronRight, 
  Pill, 
  Syringe, 
  Plus, 
  CheckCircle, 
  Camera, 
  Clock, 
  AlertCircle, 
  Loader2, 
  CalendarDays, 
  MapPin, 
  Save, 
  X, 
  Edit2, 
  RotateCw, 
  Trash2, 
  Ruler, 
  Weight, 
  Phone, 
  CreditCard,
  FileText
} from 'lucide-react';

const MemberProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    familyMembers, 
    updateMemberPhoto, 
    updateFamilyMember, 
    addMedication, 
    updateMedication,
    deleteMedication,
    addVaccine, 
    updateVaccine,
    deleteVaccine,
    appointments,
    deleteAppointment
  } = useAuth();
  const member = familyMembers.find(m => m.id === id);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingMed, setIsAddingMed] = useState(false);
  const [editingMedId, setEditingMedId] = useState<string | null>(null);
  const [isAddingVaccine, setIsAddingVaccine] = useState(false);
  const [editingVacId, setEditingVacId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Estado para edición de perfil
  const [editFormData, setEditFormData] = useState({
    name: '',
    age: '',
    bloodType: '',
    relation: '',
    type: 'adult',
    docType: 'DNI',
    docNumber: '',
    phone: '',
    height: '',
    weight: ''
  });

  const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: '' });
  const [newVac, setNewVac] = useState({ name: '', date: '' });

  // Sincronizar formulario de edición cuando cambia el miembro o se abre el modo edición
  useEffect(() => {
    if (member) {
      setEditFormData({
        name: member.name,
        age: String(member.age),
        bloodType: member.bloodType || 'O+',
        relation: member.relation,
        type: member.type || 'adult',
        docType: member.docType || 'DNI',
        docNumber: member.docNumber || '',
        phone: member.phone || '',
        height: member.height || '',
        weight: member.weight || ''
      });
    }
  }, [member, isEditing]);

  if (!member) {
    return <div className="p-20 text-center"><p className="text-slate-500">Familiar no encontrado.</p><Link to="/family" className="text-primary font-bold hover:underline">Volver a Familia</Link></div>;
  }

  const memberAppointments = appointments.filter(app => app.patientId === member.id);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
        const base64String = reader.result as string;
        updateMemberPhoto(member.id, base64String);
        setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateFamilyMember(member.id, {
      name: editFormData.name,
      age: Number(editFormData.age) || 0,
      bloodType: editFormData.bloodType,
      relation: editFormData.relation,
      type: editFormData.type as 'adult' | 'child' | 'elder',
      docType: editFormData.docType,
      docNumber: editFormData.docNumber,
      phone: editFormData.phone,
      height: editFormData.height,
      weight: editFormData.weight
    });
    setIsEditing(false);
  };

  const handleAddMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMed.name) {
        if (editingMedId) {
          updateMedication(member.id, editingMedId, newMed);
          setEditingMedId(null);
        } else {
          addMedication(member.id, { ...newMed, status: 'active' });
        }
        setIsAddingMed(false);
        setNewMed({ name: '', dosage: '', frequency: '' });
    }
  };

  const handleEditMed = (med: any) => {
    setNewMed({ name: med.name, dosage: med.dosage, frequency: med.frequency });
    setEditingMedId(med.id);
    setIsAddingMed(true);
  };

  const handleDeleteMed = (medId: string) => {
    if (window.confirm('¿Estás seguro de eliminar este medicamento?')) {
      deleteMedication(member.id, medId);
    }
  };

  const handleAddVaccine = (e: React.FormEvent) => {
    e.preventDefault();
    if (newVac.name && newVac.date) {
        if (editingVacId) {
          updateVaccine(member.id, editingVacId, newVac);
          setEditingVacId(null);
        } else {
          addVaccine(member.id, newVac);
        }
        setIsAddingVaccine(false);
        setNewVac({ name: '', date: '' });
    }
  };

  const handleEditVac = (vac: any) => {
    setNewVac({ name: vac.name, date: vac.date });
    setEditingVacId(vac.id);
    setIsAddingVaccine(true);
  };

  const handleDeleteVac = (vacId: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta vacuna?')) {
      deleteVaccine(member.id, vacId);
    }
  };

  const handleDeleteApp = (e: React.MouseEvent, appId: string) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de cancelar esta cita?')) {
      deleteAppointment(appId);
    }
  };

  // Función para calcular fecha de refuerzo sugerida
  const getBoosterDate = (vaccineDate: string) => {
      const d = new Date(vaccineDate);
      d.setFullYear(d.getFullYear() + 1);
      return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/dashboard" className="hover:text-primary transition-colors">Inicio</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/family" className="hover:text-primary transition-colors">Familia</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-900 dark:text-white font-medium">{member.name}</span>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8 relative overflow-hidden">
        {isEditing ? (
          <form onSubmit={handleProfileUpdate} className="animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="relative group cursor-pointer self-center md:self-start" onClick={handleAvatarClick}>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                <div className="relative">
                    {member.avatar ? (
                        <div className="size-28 md:size-32 rounded-full bg-cover bg-center border-4 border-slate-50 dark:border-slate-900 shadow-md" style={{backgroundImage: `url('${member.avatar}')`}}></div>
                    ) : (
                        <div className={`size-28 md:size-32 rounded-full flex items-center justify-center text-white font-bold text-4xl border-4 border-slate-50 dark:border-slate-900 shadow-md ${member.type === 'child' ? 'bg-orange-400' : member.type === 'elder' ? 'bg-purple-500' : 'bg-primary'}`}>
                            {member.name.charAt(0)}
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white">
                        <Camera className="w-8 h-8" />
                    </div>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nombre Completo</label>
                  <input required className="w-full h-10 px-3 rounded-lg border dark:bg-slate-900 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-primary" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Edad</label>
                  <input required type="number" className="w-full h-10 px-3 rounded-lg border dark:bg-slate-900 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-primary" value={editFormData.age} onChange={e => setEditFormData({...editFormData, age: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Parentesco</label>
                  <select required className="w-full h-10 px-3 rounded-lg border dark:bg-slate-900 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-primary" value={editFormData.relation} onChange={e => setEditFormData({...editFormData, relation: e.target.value})}>
                    <option>Esposo/a</option>
                    <option>Hijo/a</option>
                    <option>Padre/Madre</option>
                    <option>Abuelo/a</option>
                    <option>Otro</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Tipo de Sangre</label>
                  <select className="w-full h-10 px-3 rounded-lg border dark:bg-slate-900 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-primary" value={editFormData.bloodType} onChange={e => setEditFormData({...editFormData, bloodType: e.target.value})}>
                    <option>O+</option><option>O-</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Tipo Documento</label>
                  <select className="w-full h-10 px-3 rounded-lg border dark:bg-slate-900 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-primary" value={editFormData.docType} onChange={e => setEditFormData({...editFormData, docType: e.target.value})}>
                      <option value="DNI">DNI</option>
                      <option value="CE">Carnet de Extranjería</option>
                      <option value="Pasaporte">Pasaporte</option>
                      <option value="Otro">Otro</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nro. Documento</label>
                  <input className="w-full h-10 px-3 rounded-lg border dark:bg-slate-900 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-primary" value={editFormData.docNumber} onChange={e => setEditFormData({...editFormData, docNumber: e.target.value})} />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Celular</label>
                  <input className="w-full h-10 px-3 rounded-lg border dark:bg-slate-900 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-primary" value={editFormData.phone} onChange={e => setEditFormData({...editFormData, phone: e.target.value})} />
                </div>
                 <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Talla (cm)</label>
                  <input type="number" className="w-full h-10 px-3 rounded-lg border dark:bg-slate-900 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-primary" value={editFormData.height} onChange={e => setEditFormData({...editFormData, height: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Peso (kg)</label>
                  <input type="number" step="0.1" className="w-full h-10 px-3 rounded-lg border dark:bg-slate-900 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-primary" value={editFormData.weight} onChange={e => setEditFormData({...editFormData, weight: e.target.value})} />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Categoría</label>
                  <select className="w-full h-10 px-3 rounded-lg border dark:bg-slate-900 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-primary" value={editFormData.type} onChange={e => setEditFormData({...editFormData, type: e.target.value})}>
                    <option value="adult">Adulto</option>
                    <option value="child">Niño/a (Pediátrico)</option>
                    <option value="elder">Adulto Mayor</option>
                  </select>
                </div>
                <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">Cancelar</button>
                  <button type="submit" className="px-6 py-2 bg-primary text-white rounded-xl font-bold shadow-md shadow-blue-500/20 hover:bg-blue-600 transition-all flex items-center gap-2">
                    <Save className="w-4 h-4" /> Guardar Cambios
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              <div className="relative">
                  {member.avatar ? (
                      <div className="size-28 md:size-32 rounded-full bg-cover bg-center border-4 border-slate-50 dark:border-slate-900 shadow-md transition-transform group-hover:scale-[1.02]" style={{backgroundImage: `url('${member.avatar}')`}}></div>
                  ) : (
                      <div className={`size-28 md:size-32 rounded-full flex items-center justify-center text-white font-bold text-4xl border-4 border-slate-50 dark:border-slate-900 shadow-md transition-transform group-hover:scale-[1.02] ${member.type === 'child' ? 'bg-orange-400' : member.type === 'elder' ? 'bg-purple-500' : 'bg-primary'}`}>
                          {member.name.charAt(0)}
                      </div>
                  )}
                  <div className={`absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white transition-opacity ${isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      {isUploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Camera className="w-8 h-8" />}
                  </div>
              </div>
            </div>
            <div className="flex-1 space-y-4 relative w-full">
              <div className="absolute right-0 top-0 flex gap-2">
                <Link 
                    to={`/history/${member.id}`} 
                    className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all" 
                    title="Historia Clínica"
                >
                    <FileText className="w-5 h-5" />
                </Link>
                <button onClick={() => setIsEditing(true)} className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all" title="Editar Perfil">
                    <Edit2 className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-1">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight pr-10">{member.name}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-slate-500 font-medium">
                   <span>{member.age} años</span>
                   <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                   <span>Sangre {member.bloodType || 'O+'}</span>
                </div>
              </div>

              {/* Informacion Extra */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                 {member.docNumber && (
                     <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                         <CreditCard className="w-4 h-4 text-slate-400" />
                         <span className="font-bold">{member.docType}:</span> {member.docNumber}
                     </div>
                 )}
                 {member.phone && (
                     <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                         <Phone className="w-4 h-4 text-slate-400" />
                         <span className="font-bold">Cel:</span> {member.phone}
                     </div>
                 )}
                 {(member.height || member.weight) && (
                     <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                        {member.height && (
                            <div className="flex items-center gap-1.5">
                                <Ruler className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-600 dark:text-slate-300">{member.height} cm</span>
                            </div>
                        )}
                        {member.weight && (
                            <div className="flex items-center gap-1.5">
                                <Weight className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-600 dark:text-slate-300">{member.weight} kg</span>
                            </div>
                        )}
                     </div>
                 )}
              </div>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-1">
                <span className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-xs font-bold border border-green-100 dark:border-green-800">
                  {member.medications?.length || 0} Medicamentos Activos
                </span>
                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-xs font-bold border border-blue-100 dark:border-blue-800">
                  {member.relation}
                </span>
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-600">
                  {member.type === 'child' ? 'Pediátrico' : member.type === 'elder' ? 'Adulto Mayor' : 'Adulto'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Medicamentos Section */}
          <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Pill className="w-5 h-5 text-primary" /> Medicamentos
              </h3>
              <button onClick={() => { setIsAddingMed(true); setEditingMedId(null); setNewMed({ name: '', dosage: '', frequency: '' }); }} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                <Plus className="w-4 h-4" /> Agregar
              </button>
            </div>
            <div className="p-5">
              {isAddingMed && (
                  <form onSubmit={handleAddMed} className="mb-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in zoom-in duration-200">
                      <h4 className="text-xs font-black uppercase text-slate-400 mb-2">{editingMedId ? 'Editar Medicamento' : 'Nuevo Medicamento'}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input required placeholder="Nombre (Ej. Paracetamol)" className="h-10 px-3 rounded-lg border dark:bg-slate-800 dark:border-slate-700 outline-none focus:border-primary transition-all text-sm" value={newMed.name} onChange={e => setNewMed({...newMed, name: e.target.value})} />
                          <input placeholder="Dosis (Ej. 500mg)" className="h-10 px-3 rounded-lg border dark:bg-slate-800 dark:border-slate-700 outline-none focus:border-primary transition-all text-sm" value={newMed.dosage} onChange={e => setNewMed({...newMed, dosage: e.target.value})} />
                          <input placeholder="Frecuencia (Ej. Cada 8 horas)" className="h-10 px-3 rounded-lg border dark:bg-slate-800 dark:border-slate-700 outline-none focus:border-primary transition-all text-sm md:col-span-2" value={newMed.frequency} onChange={e => setNewMed({...newMed, frequency: e.target.value})} />
                      </div>
                      <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => { setIsAddingMed(false); setEditingMedId(null); }} className="px-4 py-2 text-xs font-bold text-slate-500">Cancelar</button>
                          <button type="submit" className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-lg shadow-sm">{editingMedId ? 'Actualizar' : 'Guardar'}</button>
                      </div>
                  </form>
              )}
              {member.medications && member.medications.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {member.medications.map(med => (
                    <div key={med.id} className="p-4 border border-slate-100 dark:border-slate-700 rounded-xl flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all group/card">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-primary"><Pill className="w-5 h-5" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{med.name} <span className="text-xs font-medium text-slate-400">({med.dosage})</span></p>
                        <p className="text-xs text-slate-500 truncate">{med.frequency}</p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                        <button onClick={() => handleEditMed(med)} className="p-1.5 text-slate-400 hover:text-primary transition-colors" title="Editar"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteMed(med.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 opacity-50 flex flex-col items-center gap-2">
                  <Pill className="w-10 h-10" />
                  <p className="text-sm font-medium">No hay medicamentos registrados.</p>
                </div>
              )}
            </div>
          </section>

          {/* Vacunación Section */}
          <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
             <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Syringe className="w-5 h-5 text-green-500" /> Vacunación
                </h3>
                <div className="flex items-center gap-4">
                    {member.vaccines && member.vaccines.length > 0 && (
                        <span className="text-[10px] font-black uppercase text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded border border-green-100 dark:border-green-800">Al día</span>
                    )}
                    <button onClick={() => { setIsAddingVaccine(true); setEditingVacId(null); setNewVac({ name: '', date: '' }); }} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                        <Plus className="w-4 h-4" /> Agregar
                    </button>
                </div>
             </div>
             <div className="p-5">
                {isAddingVaccine && (
                    <form onSubmit={handleAddVaccine} className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-800/50 space-y-4 animate-in fade-in zoom-in duration-200">
                        <h4 className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 mb-2">{editingVacId ? 'Editar Vacuna' : 'Nueva Vacuna'}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 ml-1">Nombre Vacuna</label>
                                <input required placeholder="Ej. Influenza, COVID-19" className="w-full h-10 px-3 rounded-lg border border-emerald-200 dark:bg-slate-800 dark:border-emerald-800 outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm" value={newVac.name} onChange={e => setNewVac({...newVac, name: e.target.value})} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 ml-1">Fecha Aplicación</label>
                                <input required type="date" className="w-full h-10 px-3 rounded-lg border border-emerald-200 dark:bg-slate-800 dark:border-emerald-800 outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm" value={newVac.date} onChange={e => setNewVac({...newVac, date: e.target.value})} />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-1">
                            <button type="button" onClick={() => { setIsAddingVaccine(false); setEditingVacId(null); }} className="px-4 py-2 text-xs font-bold text-slate-500 flex items-center gap-1">
                                <X className="w-3.5 h-3.5" /> Cancelar
                            </button>
                            <button type="submit" className="px-5 py-2 text-xs font-bold bg-emerald-600 text-white rounded-lg shadow-md shadow-emerald-500/20 flex items-center gap-1.5 hover:bg-emerald-700 transition-colors">
                                <Save className="w-3.5 h-3.5" /> {editingVacId ? 'Actualizar' : 'Registrar'}
                            </button>
                        </div>
                    </form>
                )}

                {member.vaccines && member.vaccines.length > 0 ? (
                    <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-100 dark:before:bg-emerald-900/30">
                        {member.vaccines.map(vac => (
                            <div key={vac.id} className="relative group/vac">
                                <div className="absolute -left-[23px] top-1.5 size-4 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-800 shadow-sm"></div>
                                <div className="flex flex-col gap-0.5">
                                    <div className="flex justify-between items-start">
                                      <div className="flex flex-col gap-0.5">
                                        <p className="font-bold text-slate-900 dark:text-white text-sm">{vac.name}</p>
                                        <p className="text-xs text-slate-500 flex items-center gap-1">
                                            <CalendarDays className="w-3 h-3" /> {new Date(vac.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                      </div>
                                      <div className="flex gap-1 opacity-0 group-hover/vac:opacity-100 transition-opacity">
                                        <button onClick={() => handleEditVac(vac)} className="p-1.5 text-slate-400 hover:text-emerald-500 transition-colors" title="Editar"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => handleDeleteVac(vac.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                                      </div>
                                    </div>
                                    <div className="mt-2 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 w-fit">
                                        <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                            <RotateCw className="w-3 h-3" /> Próxima dosis sugerida: {getBoosterDate(vac.date)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 opacity-40 flex flex-col items-center gap-2">
                        <Syringe className="w-10 h-10" />
                        <p className="text-sm font-medium">No hay historial de vacunas registrado.</p>
                        <button onClick={() => setIsAddingVaccine(true)} className="mt-2 px-4 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold border border-emerald-100 dark:border-emerald-800 hover:bg-emerald-100 transition-colors">Registrar mi primera vacuna</button>
                    </div>
                )}
             </div>
          </section>

          {/* Citas Section */}
          <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-indigo-500" /> Citas Programadas
                </h3>
                <Link to="/appointments" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                    Gestionar Calendario
                </Link>
             </div>
             <div className="p-5">
                {memberAppointments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {memberAppointments.map(app => (
                            <div 
                              key={app.id} 
                              onClick={() => navigate('/appointments')}
                              className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 group/app hover:shadow-md hover:border-primary/30 cursor-pointer transition-all relative overflow-hidden"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex flex-col">
                                        <p className="font-bold text-slate-900 dark:text-white text-sm group-hover/app:text-primary transition-colors">{app.doctor}</p>
                                        <p className="text-[10px] font-bold text-primary uppercase tracking-tight">{app.specialty}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{app.time}</p>
                                            <p className="text-[10px] text-slate-400">{app.date}</p>
                                        </div>
                                        <button 
                                          onClick={(e) => handleDeleteApp(e, app.id)}
                                          className="p-1.5 text-slate-400 hover:text-red-500 opacity-0 group-hover/app:opacity-100 transition-opacity"
                                          title="Cancelar cita"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-2 border-t border-slate-200 dark:border-slate-800 pt-2">
                                    <MapPin className="w-3 h-3" />
                                    <span className="truncate">{app.location}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 opacity-50 flex flex-col items-center gap-2">
                        <CalendarDays className="w-10 h-10" />
                        <p className="text-sm font-medium">No hay citas registradas para este miembro.</p>
                    </div>
                )}
             </div>
          </section>
        </div>

        <div className="space-y-6">
          {/* Horario de Hoy */}
          <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6">Horario de Hoy</h3>
            {member.medications && member.medications.length > 0 ? (
                <div className="relative pl-4 border-l-2 border-primary/20 space-y-8">
                    {member.medications.slice(0, 1).map(med => (
                        <div key={med.id} className="relative">
                            <div className="absolute -left-[25px] top-1 size-4 rounded-full bg-primary border-4 border-white dark:border-slate-800 ring-4 ring-primary/10"></div>
                            <div className="space-y-1">
                                <span className="text-xs font-bold text-primary">Próxima toma: 2:00 PM</span>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{med.name} ({med.dosage})</p>
                                <button className="w-full mt-2 py-1.5 bg-primary text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-transform">
                                    <CheckCircle className="w-3.5 h-3.5" /> Marcar como Tomado
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-6 opacity-50">
                    <Clock className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-xs font-medium">Sin horario hoy.</p>
                </div>
            )}
          </section>

          {/* Alertas Críticas */}
          <section className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-6 border border-red-100 dark:border-red-900/30">
            <h3 className="font-bold text-red-700 dark:text-red-400 flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5" /> Alertas Críticas
            </h3>
            <p className="text-xs text-red-600 dark:text-red-300 leading-relaxed font-medium">
                {id?.includes('leo') ? "Alergia severa a la Penicilina registrada. Evitar administración bajo cualquier circunstancia." : "No se han detectado alertas de alergias o condiciones críticas."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;