export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  status: 'active' | 'inactive';
}

export interface Vaccine {
  id: string;
  name: string;
  date: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'member';
  isNewUser?: boolean;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age: number | string;
  role: string;
  status: 'active' | 'inactive';
  avatar?: string;
  type: 'adult' | 'child' | 'elder';
  needsAttention?: boolean;
  alertType?: 'danger' | 'warning';
  bloodType?: string;
  gender?: string;
  medications?: Medication[];
  vaccines?: Vaccine[];
  // New fields
  docType?: string;
  docNumber?: string;
  phone?: string;
  height?: string;
  weight?: string;
  isPrenatal?: boolean;
  ageUnit?: 'years' | 'months';
}

export interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  patientId: string;
  patientName: string;
  diagnosis?: string;
  weight?: string;
  height?: string;
  notes?: string;
  documentUrl?: string;
}

export interface Document {
  id: string;
  title: string;
  date: string;
  type: string;
  imageUrl?: string;
}

export interface AuthContextType {
  user: User | null;
  familyMembers: FamilyMember[];
  appointments: Appointment[];
  login: (email: string) => void;
  register: (data: { firstName: string; lastName: string; email: string }) => void;
  logout: () => void;
  addFamilyMember: (member: Omit<FamilyMember, 'id' | 'status'>) => void;
  updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => void;
  updateMemberPhoto: (id: string, photoUrl: string) => void;
  addMedication: (memberId: string, med: Omit<Medication, 'id'>) => void;
  updateMedication: (memberId: string, medId: string, updates: Partial<Medication>) => void;
  deleteMedication: (memberId: string, medId: string) => void;
  addVaccine: (memberId: string, vaccine: Omit<Vaccine, 'id'>) => void;
  updateVaccine: (memberId: string, vaccineId: string, updates: Partial<Vaccine>) => void;
  deleteVaccine: (memberId: string, vaccineId: string) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (appointmentId: string) => void;
}