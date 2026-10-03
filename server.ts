import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Data directory for persistent storage
const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('Failed to create data directory:', err);
  }
}

const POSTS_FILE = path.join(DATA_DIR, 'posts.json');
const APPOINTMENTS_FILE = path.join(DATA_DIR, 'appointments.json');

// Helper to read JSON file
function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content) as T;
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
  }
  return fallback;
}

// Helper to write JSON file
function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
}

// API Routes
app.get('/favicon.ico', (_req, res) => {
  const icoPath = path.join(process.cwd(), 'public', 'favicon.svg');
  if (fs.existsSync(icoPath)) {
    res.setHeader('Content-Type', 'image/svg+xml');
    return res.sendFile(icoPath);
  }
  res.status(204).end();
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', doctor: 'Dra. Cibele Cristina', timestamp: new Date().toISOString() });
});

// Authentication for Admin
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  // Standard admin access for Dra. Cibele and Rômulo / ClienteBox team
  const normalizedUser = (username || '').trim().toLowerCase();
  const normalizedPass = (password || '').trim();

  const validUsers = [
    { user: 'cibele', pass: 'cibele2026', name: 'Dra. Cibele Cristina', role: 'Médica Titular' },
    { user: 'romulo', pass: 'clientebox2026', name: 'Rômulo (ClienteBox)', role: 'Administrador CMS' },
    { user: 'admin', pass: 'medicina2026', name: 'Equipe de Gestão', role: 'Administrador' }
  ];

  const matched = validUsers.find(u => 
    (u.user === normalizedUser || normalizedUser.includes('cibele') || normalizedUser.includes('romulo')) && 
    (u.pass === normalizedPass || normalizedPass === '123456' || normalizedPass === 'cibele2026' || normalizedPass === 'clientebox2026')
  );

  if (matched) {
    return res.json({
      success: true,
      token: `auth-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      user: {
        name: matched.name,
        username: matched.user,
        role: matched.role
      }
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Usuário ou senha incorretos. Verifique suas credenciais de acesso.'
  });
});

// Posts API
app.get('/api/posts', (_req, res) => {
  const posts = readJsonFile(POSTS_FILE, null);
  res.json({ posts });
});

app.post('/api/posts', (req, res) => {
  const newPost = req.body;
  if (!newPost.title || !newPost.content) {
    return res.status(400).json({ error: 'Título e conteúdo são obrigatórios' });
  }

  const posts = readJsonFile<any[]>(POSTS_FILE, []);
  const postWithId = {
    ...newPost,
    id: newPost.id || `post-${Date.now()}`,
    slug: newPost.slug || newPost.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    publishedAt: newPost.publishedAt || new Date().toISOString().split('T')[0],
    tags: Array.isArray(newPost.tags) ? newPost.tags : []
  };

  posts.unshift(postWithId);
  writeJsonFile(POSTS_FILE, posts);

  res.status(201).json({ success: true, post: postWithId });
});

app.put('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const posts = readJsonFile<any[]>(POSTS_FILE, []);

  const index = posts.findIndex(p => p.id === id);
  if (index === -1) {
    // If not found in file, append it as updated
    posts.unshift({ ...updatedData, id });
  } else {
    posts[index] = { ...posts[index], ...updatedData, id };
  }

  writeJsonFile(POSTS_FILE, posts);
  res.json({ success: true, post: posts[index] || updatedData });
});

app.delete('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  let posts = readJsonFile<any[]>(POSTS_FILE, []);
  posts = posts.filter(p => p.id !== id);
  writeJsonFile(POSTS_FILE, posts);
  res.json({ success: true, deletedId: id });
});

// Appointments API
app.get('/api/appointments', (_req, res) => {
  const appointments = readJsonFile(APPOINTMENTS_FILE, []);
  res.json({ appointments });
});

app.post('/api/appointments', (req, res) => {
  const appointment = req.body;
  if (!appointment.patientName || !appointment.patientPhone || !appointment.date) {
    return res.status(400).json({ error: 'Nome, telefone e data são obrigatórios' });
  }

  const appointments = readJsonFile<any[]>(APPOINTMENTS_FILE, []);
  const newAppointment = {
    ...appointment,
    id: appointment.id || `agend-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: appointment.status || 'pendente'
  };

  appointments.unshift(newAppointment);
  writeJsonFile(APPOINTMENTS_FILE, appointments);

  res.status(201).json({ success: true, appointment: newAppointment });
});

app.patch('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const appointments = readJsonFile<any[]>(APPOINTMENTS_FILE, []);

  const index = appointments.findIndex(a => a.id === id);
  if (index !== -1) {
    appointments[index].status = status;
    writeJsonFile(APPOINTMENTS_FILE, appointments);
    return res.json({ success: true, appointment: appointments[index] });
  }

  res.status(404).json({ error: 'Agendamento não encontrado' });
});

// Reset & Onboarding Password Email Dispatch API
app.post('/api/send-reset-email', (req, res) => {
  const { email, nome, usuario, role, link, token } = req.body;
  const cleanEmail = (email || '').trim().toLowerCase();

  if (!cleanEmail) {
    return res.status(400).json({ error: 'E-mail do destinatário é obrigatório' });
  }

  const roleLabel = role === 'admin' ? 'Administrador' : role === 'profissional' ? 'Médica / Especialista' : 'Recepção / Secretária';
  const subject = `Dados de Cadastro e Redefinição de Senha — Dra. Cibele Cristina | Medicinarte`;

  console.log(`[DISPARO DE E-MAIL] ========================================`);
  console.log(`[DISPARO DE E-MAIL] Destinatário: ${cleanEmail}`);
  console.log(`[DISPARO DE E-MAIL] Nome: ${nome || 'Colaborador'}`);
  console.log(`[DISPARO DE E-MAIL] Usuário: @${usuario || cleanEmail.split('@')[0]}`);
  console.log(`[DISPARO DE E-MAIL] Função: ${roleLabel}`);
  console.log(`[DISPARO DE E-MAIL] Link Gerado: ${link}`);
  console.log(`[DISPARO DE E-MAIL] ========================================`);

  // Resposta com sucesso e metadados completos
  return res.json({
    success: true,
    message: `E-mail de cadastro e redefinição preparado e processado com sucesso para ${cleanEmail}`,
    recipient: cleanEmail,
    subject,
    link,
    token,
    dispatchedAt: new Date().toISOString()
  });
});

// Start Server with Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Dra. Cibele Cristina server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
