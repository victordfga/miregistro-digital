import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FamilyMember } from '../types';
import { ChevronRight, UserPlus, X, Save, FileText, Baby } from 'lucide-react';

const FamilyScreen: React.FC = () => {
  const { familyMembers, addFamilyMember } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);

  const [formData, setFormData] = useState<Partial<FamilyMember>>({
    name: '',
    relation: 'Esposo/a',
    age: '',
    role: 'Dependiente',
    type: 'adult',
    bloodType: 'O+',
    docType: 'DNI',
    docNumber: '',
    phone: '',
    height: '',
    weight: '',
    isPrenatal: false,
    ageUnit: 'years'
  });

  useEffect(() => {
    if (location.state && (location.state as any).autoOpen) {
      setIsAdding(true);
    }
  }, [location]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Checkbox handling
    if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: checked }));
        return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    // Si es prenatal, limpiamos datos innecesarios
    const finalDocType = formData.isPrenatal ? '' : formData.docType;
    const finalDocNumber = formData.isPrenatal ? '' : formData.docNumber;
    const finalAge = formData.isPrenatal ? 0 : (Number(formData.age) || 0);

    addFamilyMember({
        name: formData.name!,
        relation: formData.relation!,
        age: finalAge,
        role: formData.role || 'Miembro',
        type: (formData.type as 'adult' | 'child' | 'elder') || 'adult',
        bloodType: formData.bloodType || 'O+',
        needsAttention: false,
        docType: finalDocType,
        docNumber: finalDocNumber,
        phone: formData.phone,
        height: formData.height,
        weight: formData.weight,
        isPrenatal: formData.isPrenatal,
        ageUnit: formData.ageUnit
    });

    setIsAdding(false);
    // Reset form
    setFormData({ 
        name: '', 
        relation: 'Esposo/a', 
        age: '', 
        role: 'Dependiente', 
        type: 'adult', 
        bloodType: 'O+',
        docType: 'DNI',
        docNumber: '',
        phone: '',
        height: '',
        weight: '',
        isPrenatal: false,
        ageUnit: 'years'
    });
  };

  // Función para obtener la etiqueta y color del rol
  const getRoleBadge = (type: string, isPrenatal?: boolean) => {
    if (isPrenatal) return { label: 'Prenatal', class: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300' };
    switch(type) {
        case 'child': return { label: 'Pediátrico', class: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' };
        case 'elder': return { label: 'Adulto Mayor', class: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' };
        default: return { label: 'Adulto', class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' };
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/dashboard" className="hover:text-primary">Panel</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 dark:text-white font-medium">Gestión Familiar</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Miembros de la Familia</h1>
        </div>
        
        {!isAdding && (
            <button onClick={() => setIsAdding(true)} className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-sm font-medium transition-all active:scale-95">
                <UserPlus className="w-5 h-5" />
                Agregar Miembro
            </button>
        )}
      </div>

      {isAdding ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-card border border-slate-200 dark:border-slate-700 overflow-hidden max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Registrar Nuevo Familiar</h2>
                  <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nombre Completo</label>
                          <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Ej. Giovanna Victoria" />
                      </div>
                      
                      <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Parentesco</label>
                          <select name="relation" value={formData.relation} onChange={handleInputChange} className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                              <option>Esposo/a</option><option>Hijo/a</option><option>Padre/Madre</option><option>Abuelo/a</option><option>Otro</option>
                          </select>
                      </div>

                      {formData.relation === 'Hijo/a' && (
                          <div className="md:col-span-2 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-center gap-3 border border-blue-100 dark:border-blue-800">
                              <input 
                                  type="checkbox" 
                                  id="isPrenatal" 
                                  name="isPrenatal" 
                                  checked={formData.isPrenatal} 
                                  onChange={handleInputChange} 
                                  className="w-5 h-5 text-primary rounded focus:ring-primary border-gray-300"
                              />
                              <label htmlFor="isPrenatal" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-2">
                                  <Baby className="w-4 h-4" />
                                  ¿Es No Nato / Prenatal?
                              </label>
                              <span className="text-xs text-slate-500 ml-auto">No requerirá DNI ni edad</span>
                          </div>
                      )}
                      
                      {!formData.isPrenatal && (
                          <>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tipo Documento</label>
                                <select name="docType" value={formData.docType} onChange={handleInputChange} className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                                    <option value="DNI">DNI</option>
                                    <option value="CE">Carnet de Extranjería</option>
                                    <option value="Pasaporte">Pasaporte</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nro. Documento</label>
                                <input name="docNumber" value={formData.docNumber} onChange={handleInputChange} className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Ej. 12345678" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Edad / Tiempo de Vida</label>
                                <div className="flex gap-2">
                                    <input required type="number" name="age" value={formData.age} onChange={handleInputChange} className="flex-1 h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" placeholder="Ej. 5" />
                                    <select name="ageUnit" value={formData.ageUnit} onChange={handleInputChange} className="w-28 h-10 px-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm">
                                        <option value="years">Años</option>
                                        <option value="months">Meses</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Celular {formData.relation === 'Hijo/a' && <span className="text-xs font-normal text-slate-500">(Opcional)</span>}
                                </label>
                                <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" placeholder="Ej. 987654321" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Talla (cm)</label>
                                <input name="height" type="number" value={formData.height} onChange={handleInputChange} className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" placeholder="Ej. 165" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Peso (kg)</label>
                                <input name="weight" type="number" step="0.1" value={formData.weight} onChange={handleInputChange} className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" placeholder="Ej. 68.5" />
                            </div>
                          </>
                      )}

                      <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Categoría (Perfil)</label>
                          <select name="type" value={formData.type} onChange={handleInputChange} className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">
                              <option value="adult">Adulto</option>
                              <option value="child">Niño/a (Pediátrico)</option>
                              <option value="elder">Adulto Mayor</option>
                          </select>
                      </div>
                      <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tipo Sangre</label>
                          <select name="bloodType" value={formData.bloodType} onChange={handleInputChange} className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                              <option>O+</option><option>O-</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option>
                          </select>
                      </div>
                  </div>
                  <div className="pt-4 flex gap-4 justify-end">
                      <button type="button" onClick={() => setIsAdding(false)} className="px-5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-medium">Cancelar</button>
                      <button type="submit" className="px-5 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-blue-600 flex items-center gap-2 shadow-md shadow-blue-500/20"><Save className="w-4 h-4" /> Guardar Familiar</button>
                  </div>
              </form>
          </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-4 font-semibold">Perfil</th>
                    <th className="px-6 py-4 font-semibold">Rol / Categoría</th>
                    <th className="px-6 py-4 font-semibold">Estado</th>
                    <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {familyMembers.map((member) => {
                    const role = getRoleBadge(member.type, member.isPrenatal);
                    return (
                        <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <div className={`size-10 rounded-full flex items-center justify-center text-white font-bold bg-cover bg-center ${!member.avatar && (member.type === 'child' ? 'bg-orange-400' : member.type === 'elder' ? 'bg-purple-500' : 'bg-primary')}`} style={member.avatar ? {backgroundImage: `url('${member.avatar}')`} : {}}>
                                        {!member.avatar && (member.isPrenatal ? <Baby className="w-6 h-6"/> : member.name.charAt(0))}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-white">{member.name}</p>
                                        <p className="text-slate-500 text-xs flex items-center gap-1">
                                            {member.isPrenatal ? 'En gestación' : `${member.age} ${member.ageUnit === 'months' ? 'meses' : 'años'}`} • {member.relation}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${role.class}`}>
                                    {role.label}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-bold text-xs">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                    Activo
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-3">
                                    <Link 
                                        to={`/history/${member.id}`}
                                        className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all flex items-center justify-center"
                                        title="Historia Clínica"
                                    >
                                        <FileText className="w-5 h-5" />
                                    </Link>
                                    <Link to={`/profile/${member.id}`} className="text-primary hover:underline font-bold text-sm">Ver Perfil</Link>
                                </div>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
            </div>
        </div>
      )}
    </div>
  );
};

export default FamilyScreen;