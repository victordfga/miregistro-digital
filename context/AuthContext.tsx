import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, FamilyMember, Medication, Appointment, AuthContextType, Vaccine } from '../types';
import { supabase } from '../supabase';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  // Ya no necesitamos bloquear aquí - el flujo de recuperación se maneja en index.tsx y UpdatePassword

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Manejar evento de recuperación de contraseña navegando a la página de actualización
      if (event === 'PASSWORD_RECOVERY') {
        console.log('[AuthContext] PASSWORD_RECOVERY detectado, navegando a /update-password');
        window.location.href = window.location.origin + '/update-password';
        return;
      }

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUser({
            id: profile.id,
            firstName: profile.first_name,
            lastName: profile.last_name,
            email: profile.email,
            role: profile.role as 'admin' | 'member'
          });
          loadData(profile.id);
        }
      } else {
        setUser(null);
        setFamilyMembers([]);
        setAppointments([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadData = async (userId: string) => {
    const { data: members } = await supabase
      .from('family_members')
      .select(`
        *,
        medications (*),
        vaccines (*)
      `)
      .eq('user_id', userId);

    if (members) {
      setFamilyMembers(members.map(m => ({
        ...m,
        bloodType: m.blood_type,
        docType: m.doc_type,
        docNumber: m.doc_number,
        avatar: m.avatar_url,
        medications: m.medications,
        vaccines: m.vaccines
      })));
    }

    const { data: apps } = await supabase
      .from('appointments')
      .select('*, family_members(name)')
      .eq('user_id', userId);

    if (apps) {
      setAppointments(apps.map(a => ({
        ...a,
        patientId: a.patient_id,
        patientName: a.family_members?.name || 'Desconocido'
      })));
    }
  };

  const login = async (email: string, password?: string) => {
    if (password) {
      // Login con contraseña
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
    } else {
      // Fallback a OTP si no hay contraseña (opcional)
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      if (error) throw error;
      alert('Se ha enviado un enlace de acceso a tu correo.');
    }
  };

  const register = async (data: { firstName: string; lastName: string; email: string; password?: string }) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password || 'password-generado-provisional',
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
        }
      }
    });

    if (authError) throw authError;

    if (authData.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        role: 'admin'
      });

      if (profileError) {
        console.error("Error al insertar perfil:", profileError);
        // Si el perfil ya existe por un trigger, lo ignoramos
        if (profileError.code !== '23505') throw profileError;
      }

      // Forzar la carga del usuario para evitar pantallas vacías tras el registro
      setUser({
        id: authData.user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: 'admin'
      });
      loadData(authData.user.id);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/update-password',
    });
    if (error) throw error;
  };

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  };

  const addFamilyMember = async (member: Omit<FamilyMember, 'id' | 'status'>) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('family_members')
      .insert({
        user_id: user.id,
        name: member.name,
        relation: member.relation,
        age: typeof member.age === 'string' ? parseInt(member.age) : member.age,
        type: member.type,
        blood_type: member.bloodType,
        doc_type: member.docType,
        doc_number: member.docNumber,
        phone: member.phone,
        height: member.height,
        weight: member.weight
      })
      .select()
      .single();

    if (data) {
      setFamilyMembers(prev => [...prev, { ...data, bloodType: data.blood_type, medications: [], vaccines: [] }]);
    }
  };

  const updateFamilyMember = async (id: string, updates: Partial<FamilyMember>) => {
    const { error } = await supabase
      .from('family_members')
      .update({
        name: updates.name,
        relation: updates.relation,
        age: typeof updates.age === 'string' ? parseInt(updates.age) : updates.age,
        phone: updates.phone,
        height: updates.height,
        weight: updates.weight
      })
      .eq('id', id);

    if (!error) {
      setFamilyMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    }
  };

  const updateMemberPhoto = async (id: string, photoUrl: string) => {
    const { error } = await supabase
      .from('family_members')
      .update({ avatar_url: photoUrl })
      .eq('id', id);

    if (!error) {
      setFamilyMembers(prev => prev.map(m => m.id === id ? { ...m, avatar: photoUrl } : m));
    }
  };

  const addMedication = async (memberId: string, med: Omit<Medication, 'id'>) => {
    const { data, error } = await supabase
      .from('medications')
      .insert({
        member_id: memberId,
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        status: med.status
      })
      .select()
      .single();

    if (data) {
      setFamilyMembers(prev => prev.map(m => m.id === memberId ? { ...m, medications: [...(m.medications || []), data] } : m));
    }
  };

  const updateMedication = async (memberId: string, medId: string, updates: Partial<Medication>) => {
    const { error } = await supabase
      .from('medications')
      .update({
        dosage: updates.dosage,
        frequency: updates.frequency,
        status: updates.status
      })
      .eq('id', medId);

    if (!error) {
      setFamilyMembers(prev => prev.map(m => {
        if (m.id === memberId) {
          return {
            ...m,
            medications: m.medications?.map(med => med.id === medId ? { ...med, ...updates } : med)
          };
        }
        return m;
      }));
    }
  };

  const deleteMedication = async (memberId: string, medId: string) => {
    const { error } = await supabase
      .from('medications')
      .delete()
      .eq('id', medId);

    if (!error) {
      setFamilyMembers(prev => prev.map(m => {
        if (m.id === memberId) {
          return {
            ...m,
            medications: m.medications?.filter(med => med.id !== medId)
          };
        }
        return m;
      }));
    }
  };

  const addVaccine = async (memberId: string, vaccine: Omit<Vaccine, 'id'>) => {
    const { data, error } = await supabase
      .from('vaccines')
      .insert({
        member_id: memberId,
        name: vaccine.name,
        date: vaccine.date
      })
      .select()
      .single();

    if (data) {
      setFamilyMembers(prev => prev.map(m => m.id === memberId ? { ...m, vaccines: [...(m.vaccines || []), data] } : m));
    }
  };

  const updateVaccine = async (memberId: string, vaccineId: string, updates: Partial<Vaccine>) => {
    const { error } = await supabase
      .from('vaccines')
      .update({
        name: updates.name,
        date: updates.date
      })
      .eq('id', vaccineId);

    if (!error) {
      setFamilyMembers(prev => prev.map(m => {
        if (m.id === memberId) {
          return {
            ...m,
            vaccines: m.vaccines?.map(vac => vac.id === vaccineId ? { ...vac, ...updates } : vac)
          };
        }
        return m;
      }));
    }
  };

  const deleteVaccine = async (memberId: string, vaccineId: string) => {
    const { error } = await supabase
      .from('vaccines')
      .delete()
      .eq('id', vaccineId);

    if (!error) {
      setFamilyMembers(prev => prev.map(m => {
        if (m.id === memberId) {
          return {
            ...m,
            vaccines: m.vaccines?.filter(vac => vac.id !== vaccineId)
          };
        }
        return m;
      }));
    }
  };

  const addAppointment = async (appointment: Omit<Appointment, 'id'>) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        user_id: user.id,
        patient_id: appointment.patientId,
        doctor: appointment.doctor,
        specialty: appointment.specialty,
        date: appointment.date,
        time: appointment.time,
        location: appointment.location
      })
      .select()
      .single();

    if (data) {
      const patient = familyMembers.find(m => m.id === appointment.patientId);
      setAppointments(prev => [...prev, { ...data, patientName: patient?.name || 'Desconocido' }]);
    }
  };

  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    const { error } = await supabase
      .from('appointments')
      .update({
        diagnosis: updates.diagnosis,
        notes: updates.notes,
        weight: updates.weight,
        height: updates.height
      })
      .eq('id', id);

    if (!error) {
      setAppointments(prev => prev.map(app => app.id === id ? { ...app, ...updates } : app));
    }
  };

  const deleteAppointment = async (appointmentId: string) => {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', appointmentId);

    if (!error) {
      setAppointments(prev => prev.filter(app => app.id !== appointmentId));
    }
  };

  return (
    <AuthContext.Provider value={{
      user, familyMembers, appointments, login, register, logout,
      addFamilyMember, updateFamilyMember, updateMemberPhoto,
      addMedication, updateMedication, deleteMedication,
      addVaccine, updateVaccine, deleteVaccine,
      addAppointment, updateAppointment, deleteAppointment,
      resetPassword, updatePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};