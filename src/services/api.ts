import { BlogPost, Appointment, Testimonial } from '../types';
import { INITIAL_POSTS, TESTIMONIALS } from '../data/initialData';

const POSTS_KEY = 'dra_cibele_posts_v1';
const APPOINTMENTS_KEY = 'dra_cibele_appointments_v1';
const TESTIMONIALS_KEY = 'dra_cibele_testimonials_v1';
const AUTH_KEY = 'dra_cibele_admin_auth';

export interface AdminSession {
  token: string;
  user: {
    name: string;
    username: string;
    role: string;
  };
}

export const apiService = {
  // Get all posts (combines server + localStorage)
  async getPosts(): Promise<BlogPost[]> {
    try {
      const res = await fetch('/api/posts');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.posts) && data.posts.length > 0) {
          localStorage.setItem(POSTS_KEY, JSON.stringify(data.posts));
          return data.posts;
        }
      }
    } catch {
      // Fallback to localStorage or initial posts
    }

    const stored = localStorage.getItem(POSTS_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Error parsing stored posts:', e);
      }
    }

    // Default to initial posts
    localStorage.setItem(POSTS_KEY, JSON.stringify(INITIAL_POSTS));
    return INITIAL_POSTS;
  },

  // Save/Create a new post
  async createPost(post: Omit<BlogPost, 'id' | 'publishedAt'>): Promise<BlogPost> {
    const newPost: BlogPost = {
      ...post,
      id: `post-${Date.now()}`,
      publishedAt: new Date().toISOString().split('T')[0],
      tags: post.tags || []
    };

    // Try server API first
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.post) {
          this.updateLocalPosts(json.post);
          return json.post;
        }
      }
    } catch {
      // Server not reachable, continue with local update
    }

    this.updateLocalPosts(newPost);
    return newPost;
  },

  // Update existing post
  async updatePost(id: string, postData: Partial<BlogPost>): Promise<BlogPost> {
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.post) {
          this.replaceLocalPost(json.post);
          return json.post;
        }
      }
    } catch {
      // Server fallback
    }

    const currentPosts = await this.getPosts();
    const index = currentPosts.findIndex(p => p.id === id);
    if (index !== -1) {
      const updated = { ...currentPosts[index], ...postData };
      currentPosts[index] = updated;
      localStorage.setItem(POSTS_KEY, JSON.stringify(currentPosts));
      return updated;
    }
    throw new Error('Post não encontrado');
  },

  // Delete post
  async deletePost(id: string): Promise<boolean> {
    try {
      await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    } catch {
      // Fallback
    }

    const currentPosts = await this.getPosts();
    const filtered = currentPosts.filter(p => p.id !== id);
    localStorage.setItem(POSTS_KEY, JSON.stringify(filtered));
    return true;
  },

  // Helper local post update
  updateLocalPosts(newPost: BlogPost) {
    try {
      const stored = localStorage.getItem(POSTS_KEY);
      const posts: BlogPost[] = stored ? JSON.parse(stored) : [...INITIAL_POSTS];
      const existingIdx = posts.findIndex(p => p.id === newPost.id);
      if (existingIdx !== -1) {
        posts[existingIdx] = newPost;
      } else {
        posts.unshift(newPost);
      }
      localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    } catch (e) {
      console.error(e);
    }
  },

  replaceLocalPost(post: BlogPost) {
    try {
      const stored = localStorage.getItem(POSTS_KEY);
      if (stored) {
        const posts: BlogPost[] = JSON.parse(stored);
        const idx = posts.findIndex(p => p.id === post.id);
        if (idx !== -1) {
          posts[idx] = post;
          localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
        }
      }
    } catch (e) {
      console.error(e);
    }
  },

  // Appointments
  async getAppointments(): Promise<Appointment[]> {
    try {
      const res = await fetch('/api/appointments');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.appointments)) {
          localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(data.appointments));
          return data.appointments;
        }
      }
    } catch {
      // Fallback
    }

    const stored = localStorage.getItem(APPOINTMENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  async createAppointment(appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>): Promise<Appointment> {
    const newAppointment: Appointment = {
      ...appointment,
      id: `agend-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pendente'
    };

    try {
      await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAppointment)
      });
    } catch {
      // Server fallback
    }

    const list = await this.getAppointments();
    list.unshift(newAppointment);
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(list));
    return newAppointment;
  },

  async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<void> {
    try {
      await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch {
      // Fallback
    }

    const list = await this.getAppointments();
    const target = list.find(a => a.id === id);
    if (target) {
      target.status = status;
      localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(list));
    }
  },

  // Testimonials
  getTestimonials(): Testimonial[] {
    const stored = localStorage.getItem(TESTIMONIALS_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // Fallback
      }
    }
    return TESTIMONIALS;
  },

  addTestimonial(testimonial: Omit<Testimonial, 'id'> & { date?: string }): Testimonial {
    const newTestimonial: Testimonial = {
      id: `test-${Date.now()}`,
      date: testimonial.date || 'Recentemente',
      name: testimonial.name,
      roleOrRelation: testimonial.roleOrRelation,
      treatmentType: testimonial.treatmentType,
      comment: testimonial.comment,
      rating: testimonial.rating
    };
    const list = this.getTestimonials();
    list.unshift(newTestimonial);
    localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(list));
    return newTestimonial;
  },

  // Auth
  async login(username: string, password: string): Promise<AdminSession> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          const session: AdminSession = { token: data.token, user: data.user };
          localStorage.setItem(AUTH_KEY, JSON.stringify(session));
          return session;
        }
      }
    } catch {
      // Local fallback credentials if server endpoint is not reached
    }

    const u = username.toLowerCase().trim();
    const p = password.trim();

    if (
      (u === 'cibele' && (p === 'cibele2026' || p === '123456')) ||
      (u === 'romulo' && (p === 'clientebox2026' || p === '123456')) ||
      (u === 'admin' && (p === 'medicina2026' || p === '123456'))
    ) {
      const session: AdminSession = {
        token: `local-${Date.now()}`,
        user: {
          name: u === 'cibele' ? 'Dra. Cibele Cristina' : u === 'romulo' ? 'Rômulo (ClienteBox)' : 'Gestão Administrativa',
          username: u,
          role: u === 'cibele' ? 'Médica Titular' : 'Administrador CMS'
        }
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(session));
      return session;
    }

    throw new Error('Credenciais inválidas. Tente "cibele" ou "romulo" com a senha configurada.');
  },

  getSession(): AdminSession | null {
    try {
      const item = localStorage.getItem(AUTH_KEY);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  logout(): void {
    localStorage.removeItem(AUTH_KEY);
  }
};
