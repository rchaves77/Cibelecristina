export type BlogCategory = 'Prevenção' | 'Crianças' | 'Adultos' | 'Idosos' | 'Estilo de Vida';

export type PostStatus = 'published' | 'draft' | 'scheduled';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  coverImage: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readTimeMinutes: number;
  status: PostStatus;
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
}

export type AppointmentStatus = 'pendente' | 'confirmado' | 'atendido' | 'cancelado';

export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  patientAge?: number;
  serviceType: string;
  modality: 'presencial' | 'telemedicina' | 'domiciliar';
  date: string;
  timeSlot: string;
  insurance: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt: string;
  sourceWhatsAppSent: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  roleOrRelation: string; // e.g., "Paciente há 3 anos", "Mãe do Pedro (5 anos)"
  comment: string;
  rating: number;
  date: string;
  treatmentType: string;
}

export interface InsurancePlan {
  id: string;
  name: string;
  tagline: string;
  logoText: string;
  coveredServices: string[];
  notes?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface DoctorProfile {
  name: string;
  fullName: string;
  specialty: string;
  emphasis: string;
  crm: string;
  rqe?: string;
  graduation: string;
  graduationInstitution: string;
  graduationYear: number;
  revalidation: string;
  postGraduation: string;
  postGraduationInstitution: string;
  currentRoles: string[];
  lattesUrl: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: {
    clinic: string;
    street: string;
    neighborhood: string;
    cityState: string;
    room: string;
  };
  schedule: {
    day: string;
    hours: string;
    type: string;
  }[];
}
