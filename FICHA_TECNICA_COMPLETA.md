# 📋 FICHA TÉCNICA COMPLETA - ARKAI LXP

**Versión:** 0.0.0  
**Fecha:** Enero 2025  
**Tipo:** Learning Experience Platform (LXP) con IA

---

## 🏗️ ARQUITECTURA GENERAL

### Stack Tecnológico

**Frontend:**
- React 18.2.0 (SPA)
- Vite 4.4.5 (Build tool)
- React Router DOM 6.16.0 (Routing)
- Tailwind CSS 3.3.3 (Styling)
- Framer Motion 10.16.4 (Animaciones)
- Lucide React 0.292.0 (Iconos)

**Backend:**
- Supabase (BaaS)
  - PostgreSQL (Base de datos)
  - Edge Functions (Serverless)
  - Auth (Autenticación)
  - Storage (Almacenamiento)

**Hosting:**
- Vercel (Frontend + API Routes)
- Supabase (Backend + Base de datos)

**IA/APIs:**
- Google Gemini (Chat, Quizzes, Cursos)
- Google Imagen 3.0 (Generación de imágenes)
- OpenAI (Opcional, no implementado)
- Anthropic Claude (Opcional, no implementado)

---

## 📁 ESTRUCTURA DE CARPETAS

```
ARKAILXP/
├── api/                    # Vercel API Routes (Proxies)
│   ├── ai/
│   │   ├── chat.js        # Proxy para chat genérico
│   │   └── generate-quiz.js # Proxy para generar quizzes
│   └── kai/
│       ├── chatbot.js      # Proxy para chatbot-kai
│       └── generate-image.js # Proxy para generate-image-kai
├── src/
│   ├── components/         # Componentes React
│   │   ├── admin/         # Componentes de administración
│   │   ├── course/         # Componentes de cursos
│   │   ├── dashboard/     # Componentes del dashboard
│   │   ├── kai/           # Componentes de KAI
│   │   ├── ui/            # Componentes UI base
│   │   └── views/         # Vistas principales
│   ├── contexts/          # React Contexts
│   ├── lib/               # Utilidades y clientes
│   ├── i18n/              # Internacionalización
│   └── styles/            # Estilos y temas
└── Supa_base_edge_funct/  # Código de Edge Functions
```

---

## 🧩 COMPONENTES REACT - ANÁLISIS COMPLETO

### 1. VISTAS PRINCIPALES (Views)

#### `App.jsx` - Componente Raíz
**Lógica:**
- Maneja routing con React Router
- Controla autenticación (redirects)
- Gestiona intro video (una vez por sesión)
- Protege rutas admin con `auditor_override` (sessionStorage)
- Integra KAI Companion globalmente

**Rutas:**
- `/` → GateView (login/signup)
- `/dashboard` → DashboardView
- `/courses` → CoursesView
- `/course/:courseId` → CourseView
- `/admin` → AdminView (requiere admin + override)
- `/admin/quiz-builder` → QuizBuilder (requiere admin + override)
- `/sandbox` → SandboxView
- `/profile` → ProfileView

#### `GateView.jsx` - Pantalla de Login
**Lógica:**
- Formulario de login/signup
- Usa `SupabaseAuthContext` para autenticación
- Maneja estados de carga
- Muestra advertencia de confirmación de email

**Funciones:**
- `signIn(email, password)`
- `signUp(email, password)`

#### `DashboardView.jsx` - Dashboard Principal
**Lógica:**
- Carga perfil del usuario (`ensure_profile_and_get` RPC)
- Obtiene cursos asignados con progreso y due dates
- Muestra nombre del usuario dinámicamente
- Integra `UpcomingDeadlines` con datos reales

**Queries Supabase:**
```javascript
// Perfil
supabase.rpc('ensure_profile_and_get')

// Cursos asignados
supabase.from('assigned_courses')
  .select('progress_percentage, due_date, course:courses(*)')
  .eq('user_id', user.id)
```

**Estado:**
- `profile`: Datos del perfil (full_name, role)
- `assignedCourses`: Array de cursos con progreso
- `loading`: Estado de carga

#### `AdminView.jsx` - Panel de Administración
**Lógica:**
- 3 vistas: Dashboard, Course Matrix, User Management
- Protegido con `auditor_override` (#405527)
- Gestión de cursos y usuarios

**Subcomponentes:**
1. **AdminDashboard**: Estadísticas y acciones rápidas
2. **CourseMatrix**: Lista y creación de cursos
3. **UserManagement**: Gestión de usuarios y asignación de cursos
4. **CourseCreator**: Generador de cursos con IA

**Funciones Clave:**
- `fetchCourses()`: Obtiene todos los cursos
- `assignCourse(userId, courseId, dueDate)`: Asigna curso con fecha límite
- `CreateUserForm`: Crea usuarios nuevos (usa signUp)

**Edge Functions Usadas:**
- `create-course-ai`: Genera cursos con IA

#### `QuizBuilder.jsx` - Constructor de Quizzes
**Lógica:**
- Genera quizzes con IA desde contenido
- Guarda quizzes en Supabase (tabla `quizzes`)
- Modo prueba (oculta respuestas)
- Exporta quizzes como JSON
- Edita/elimina preguntas individuales

**Funciones:**
- `handleGenerateQuiz()`: Llama a `/api/ai/generate-quiz`
- `handleSaveQuiz()`: Guarda en `supabase.from('quizzes')`
- `handleExportQuiz()`: Descarga JSON
- `handleEditQuestion()`: Edita pregunta
- `handleDeleteQuestion()`: Elimina pregunta

**Estado:**
- `generatedQuiz`: Quiz generado
- `testMode`: Modo prueba activo/inactivo
- `editingQuestion`: Índice de pregunta en edición

#### `CoursesView.jsx` - Vista de Cursos
**Lógica:**
- Lista todos los cursos asignados al usuario
- Muestra progreso por curso
- Navegación a detalle de curso

#### `CourseView.jsx` - Detalle de Curso
**Lógica:**
- Muestra contenido del curso
- Integra `QuizModule` para quizzes
- Integra `TutorChatbot` para tutoría

#### `ProfileView.jsx` - Perfil de Usuario
**Lógica:**
- Edita nombre completo
- Sube/actualiza avatar
- Guarda cambios en tabla `profiles`

#### `SandboxView.jsx` - Sandbox
**Estado:** Implementado básico, funcionalidad limitada

---

### 2. COMPONENTES KAI (IA Companion)

#### `KaiCompanion.jsx` - Compañero Flotante
**Lógica:**
- Esfera tecnológica flotante con video
- 4 botones circulares (Chat, Image, Quiz, Action)
- Animación limitada a 13 segundos
- Minimizable/restaurable
- Hover para mostrar menú

**Estado:**
- `isMinimized`: Minimizado/expandido
- `isHovered`: Hover activo
- `isChatOpen`: Chat abierto/cerrado
- `animationComplete`: Animación completada

**Funciones:**
- `handleMenuClick(id)`: Maneja clicks en botones
- `getButtonPosition(angle, radius)`: Calcula posición circular

#### `KaiChatWindow.jsx` - Ventana de Chat
**Lógica:**
- Chat con KAI usando `/api/kai/chatbot`
- Detección automática de solicitudes de imagen
- Renderizado de Markdown con `marked.js`
- Scroll automático
- Avatar con video

**Funciones:**
- `handleSendMessage()`: Envía mensaje a chatbot
- `handleImageGeneration()`: Genera imagen si se detecta
- `scrollToBottom()`: Scroll automático

**Integraciones:**
- `/api/kai/chatbot` → `chatbot-kai` (Supabase)
- `/api/kai/generate-image` → `generate-image-kai` (Supabase)

---

### 3. COMPONENTES DE CURSO

#### `QuizModule.jsx` - Módulo de Quiz
**Lógica:**
- Renderiza quiz interactivo
- Maneja respuestas del usuario
- Calcula score
- Llama `onComplete(score)` al terminar

**Estado:**
- `currentQuestion`: Índice actual
- `selectedAnswer`: Respuesta seleccionada
- `answers`: Array de respuestas
- `showResult`: Muestra resultado final

#### `TutorChatbot.jsx` - Tutor de IA
**Lógica:**
- Chat contextual sobre lección
- Usa `chatWithAI()` de `aiClient.js`
- Mantiene historial de conversación

**Integraciones:**
- `/api/ai/chat` → Chat genérico con IA

#### `LessonContent.jsx` - Contenido de Lección
**Estado:** Implementado básico

---

### 4. COMPONENTES DE DASHBOARD

#### `Sidebar.jsx` - Barra Lateral
**Lógica:**
- Navegación principal
- **Auditor Override**: Prompt con código #405527
- Guarda override en `sessionStorage`
- Responsive (desktop sidebar + mobile bottom bar)

**Funciones:**
- `handleAdminAccess()`: Valida código y guarda override

#### `UpcomingDeadlines.jsx` - Fechas Límite
**Lógica:**
- Muestra cursos con due dates
- Calcula días restantes
- Indicadores visuales (rojo=overdue, amarillo=≤3 días)
- Recibe `assignments` como prop

**Lógica de Colores:**
- Rojo: Overdue
- Amarillo: ≤3 días
- Normal: >3 días

#### `CourseCard.jsx` - Tarjeta de Curso
**Lógica:**
- Muestra información del curso
- Barra de progreso animada
- Badge de dificultad

#### `WelcomeBanner.jsx` - Banner de Bienvenida
**Estado:** Implementado con animaciones

#### Otros Componentes Dashboard:
- `AdminPanelWidget.jsx`: Widget de admin
- `CalendarPanel.jsx`: Calendario
- `NotificationBell.jsx`: Notificaciones
- `PreferencesPanel.jsx`: Preferencias

---

### 5. COMPONENTES UI BASE

#### `button.jsx` - Botón
- Usa `class-variance-authority`
- Variantes: default, outline, ghost, etc.

#### `dialog.jsx` - Diálogo Modal
- Usa Radix UI Dialog
- Glassmorphism

#### `toast.jsx` / `toaster.jsx` - Notificaciones
- Sistema de toasts
- Usa Radix UI Toast

#### `use-toast.js` - Hook de Toast
- Hook personalizado para toasts

---

### 6. COMPONENTES GLOBALES

#### `GlobalControls.jsx` - Controles Globales
**Lógica:**
- Selector de idioma (i18n)
- Selector de tema
- Accesos rápidos

#### `ThemeSelector.jsx` - Selector de Tema
**Lógica:**
- 20 temas disponibles
- Todos configurados como dark
- Cambio dinámico de CSS variables

#### `IntroVideo.jsx` - Video Intro
**Lógica:**
- Video intro (https://i.imgur.com/Zvw1USv.mp4)
- Una vez por sesión
- Opción de skip
- Fondo negro, no stretch

---

## 🔌 CONTEXTOS REACT

### `SupabaseAuthContext.jsx` - Contexto de Autenticación
**Lógica:**
- Maneja sesión de Supabase
- Proporciona: `user`, `session`, `loading`, `signIn`, `signUp`, `signOut`
- Auto-refresh de tokens
- Persistencia en localStorage

**Funciones:**
- `signUp(email, password)`: Registro
- `signIn(email, password)`: Login
- `signOut()`: Logout

### `ThemeContext.jsx` - Contexto de Tema
**Lógica:**
- Gestiona tema actual
- Persistencia en localStorage
- Default: `midnightAurora`

---

## 📚 LIBRERÍAS Y UTILIDADES

### `supabaseClient.js` - Cliente Supabase
**Configuración:**
- URL: `https://uzviszqevkddoszrxwen.supabase.co`
- Singleton pattern (evita reinicialización)
- Auto-refresh de tokens
- Persistencia en localStorage

### `aiClient.js` - Cliente de IA
**Funciones:**
- `chatWithAI({ provider, messages, options })`: Chat genérico
- `generateQuiz({ content, config, provider })`: Genera quiz
- `createTutorPrompt(context, question)`: Crea prompt de tutor

**Endpoints:**
- `/api/ai/chat`: Chat genérico
- `/api/ai/generate-quiz`: Genera quiz

### `utils.js` - Utilidades
**Estado:** Implementado básico

---

## 🚀 SUPABASE EDGE FUNCTIONS

### 1. `chatbot-kai`
**Propósito:** Chat con KAI usando Gemini  
**Modelo:** `gemini-2.5-flash-preview-09-2025`  
**Llamada desde:** `KaiChatWindow.jsx` → `/api/kai/chatbot` → `chatbot-kai`

**Input:**
```json
{
  "prompt": "string"
}
```

**Output:**
```json
{
  "content": "string",
  "provider": "gemini"
}
```

**CORS:** Configurado para Vercel y dominio personalizado

### 2. `generate-image-kai`
**Propósito:** Genera imágenes con Gemini Imagen 3.0  
**Modelo:** `imagen-3.0-generate-002`  
**Llamada desde:** `KaiChatWindow.jsx` → `/api/kai/generate-image` → `generate-image-kai`

**Input:**
```json
{
  "prompt": "string",
  "size": "1024x1024"
}
```

**Output:**
```json
{
  "ok": true,
  "mime_type": "image/png",
  "image_base64": "string",
  "size": "1024x1024"
}
```

### 3. `generate-quiz-ai`
**Propósito:** Genera quizzes educativos con IA  
**Modelo:** `gemini-2.0-flash-exp` (configurable)  
**Llamada desde:** `QuizBuilder.jsx` → `/api/ai/generate-quiz` → `generate-quiz-ai`

**Input:**
```json
{
  "content": "string",
  "config": {
    "length": 5,
    "complexity": "Intermediate",
    "customInstructions": "string"
  },
  "provider": "gemini"
}
```

**Output:**
```json
{
  "success": true,
  "quiz": {
    "title": "string",
    "questions": [
      {
        "question": "string",
        "options": ["A", "B", "C", "D"],
        "correct_answer": "string",
        "explanation": "string"
      }
    ]
  },
  "provider": "gemini"
}
```

**Características:**
- JSON Schema para structured output
- Soporte para Gemini, OpenAI, Claude
- Validación de número de preguntas
- maxTokens: 8000 (optimizable a 3000)

### 4. `create-course-ai`
**Propósito:** Genera cursos completos con IA  
**Modelo:** Gemini (configurable)  
**Llamada desde:** `AdminView.jsx` → `supabase.functions.invoke('create-course-ai')`

**Input:**
```json
{
  "content": "string",
  "title": "string (opcional)"
}
```

**Output:**
```json
{
  "title": "string",
  "description": "string",
  "difficulty_level": "Intro|Intermediate|Advanced",
  "course_content": "string (markdown)"
}
```

---

## 🌐 VERCEL API ROUTES (Proxies)

### `/api/kai/chatbot.js`
**Propósito:** Proxy para `chatbot-kai`  
**Lógica:**
- Evita problemas de CORS
- Llama a Supabase Edge Function
- Requiere: `SUPABASE_URL`, `SUPABASE_ANON_KEY` (sin prefijo VITE_)

### `/api/kai/generate-image.js`
**Propósito:** Proxy para `generate-image-kai`  
**Lógica:** Similar a chatbot.js

### `/api/ai/generate-quiz.js`
**Propósito:** Proxy para `generate-quiz-ai`  
**Lógica:**
- Valida input
- Llama a Supabase Edge Function
- Maneja errores y CORS
- Headers: `Authorization`, `apikey`, `x-client-info`

### `/api/ai/chat.js`
**Propósito:** Chat genérico con IA  
**Lógica:**
- Soporta Gemini, OpenAI, Claude
- No usa Supabase (llama directamente a APIs)
- Requiere API keys en Vercel env vars

---

## 🗄️ BASE DE DATOS (Supabase)

### Tablas Principales

#### `profiles`
**Campos:**
- `id` (UUID, FK a auth.users)
- `full_name` (text)
- `email` (text)
- `role` (text: 'admin' | 'student')
- `avatar_url` (text, nullable)
- `created_at` (timestamp)

**RLS:** Activado

#### `courses`
**Campos:**
- `id` (UUID, PK)
- `title` (text)
- `description` (text)
- `difficulty_level` (text: 'Intro' | 'Intermediate' | 'Advanced')
- `content_data` (JSONB)
- `created_at` (timestamp)

#### `assigned_courses`
**Campos:**
- `id` (UUID, PK)
- `user_id` (UUID, FK a profiles)
- `course_id` (UUID, FK a courses)
- `progress_percentage` (integer, 0-100)
- `due_date` (date, nullable)
- `created_at` (timestamp)

#### `quizzes`
**Campos:**
- `id` (UUID, PK)
- `title` (text)
- `questions` (JSONB)
- `created_by` (UUID, FK a profiles)
- `quiz_data` (JSONB)
- `created_at` (timestamp)

**Estado:** Tabla creada, pero verificar existencia en Supabase

### Funciones RPC

#### `ensure_profile_and_get`
**Propósito:** Crea perfil si no existe y lo retorna  
**Llamada desde:** `DashboardView.jsx`

---

## 🔐 SEGURIDAD Y AUTENTICACIÓN

### Auditor Override
**Código:** #405527  
**Implementación:**
- Prompt en `Sidebar.jsx`
- Guardado en `sessionStorage.getItem('auditor_override')`
- Validación en rutas `/admin` y `/admin/quiz-builder`

### Protección de Rutas
- Rutas públicas: `/` (GateView)
- Rutas protegidas: Requieren `user` autenticado
- Rutas admin: Requieren `user.user_metadata.role === 'admin'` + `auditor_override`

### CORS
**Orígenes Permitidos:**
- `https://arkailxp.vercel.app`
- `https://www.arkailxp.vercel.app`
- `https://j-irizarry.info`
- `https://www.j-irizarry.info`
- `http://localhost:5173` (dev)
- `http://localhost:3000` (dev)

---

## 🎨 SISTEMA DE TEMAS

### Temas Disponibles (20)
Todos configurados como `dark`:
1. midnightAurora
2. deepSpace
3. nebulaVeil
4. starfieldGlass
5. galaxyDust
6. cometTrail
7. voidGradient
8. eventHorizon
9. solarEclipse
10. lunarSurface
11. skywash
12. sunriseMeadow
13. citrusPop
14. coralBloom
15. pastelField
16. canyonGlow
17. tropicalInk
18. coastalBreeze
19. summerGrain
20. auroraDaylight

### Glassmorphism
- Clase `.glass-panel`: Blur, transparencia, bordes
- Clase `.glass-panel-kai`: Específica para KAI (blur 24px)
- Variables CSS: `--glass-bg`, `--glass-border`, `--glass-shadow`

---

## 🌍 INTERNACIONALIZACIÓN (i18n)

### Idiomas
- Español (`es.json`)
- Inglés (`en.json`)

### Archivos de Traducción
- `src/i18n/locales/es.json`
- `src/i18n/locales/en.json`

### Configuración
- `src/i18n/i18n.js`: Configuración de i18next
- `src/i18n/index.js`: Exportaciones

---

## ⚠️ FUNCIONES NO DESARROLLADAS / PENDIENTES

### 1. Crear Usuarios sin Confirmación de Email
**Estado Actual:** Usa `signUp()` que requiere confirmación  
**Solución Pendiente:** Crear Edge Function `create-user-admin` con `service_role` key

### 2. Sistema de Progreso de Quizzes
**Estado Actual:** Quizzes se guardan pero no se rastrea progreso  
**Pendiente:**
- Tabla `quiz_attempts` (user_id, quiz_id, score, answers, completed_at)
- Guardar intentos cuando usuario completa quiz
- Mostrar historial de intentos

### 3. Notificaciones Reales
**Estado Actual:** `NotificationBell.jsx` existe pero no funcional  
**Pendiente:**
- Sistema de notificaciones en tiempo real
- Integración con Supabase Realtime
- Notificaciones de due dates, nuevos cursos, etc.

### 4. Calendario Funcional
**Estado Actual:** `CalendarPanel.jsx` existe pero básico  
**Pendiente:**
- Integración con due dates
- Vista mensual/semanal
- Eventos de cursos

### 5. Sandbox Completo
**Estado Actual:** `SandboxView.jsx` básico  
**Pendiente:**
- Funcionalidad específica
- Herramientas de prueba

### 6. Exportar Quiz a PDF
**Estado Actual:** Solo exporta JSON  
**Pendiente:**
- Generar PDF desde quiz
- Opciones de formato

### 7. Editar Cursos Existentes
**Estado Actual:** Solo creación  
**Pendiente:**
- Editar cursos creados
- Actualizar contenido

### 8. Eliminar Cursos/Quizzes
**Estado Actual:** Solo creación  
**Pendiente:**
- Soft delete o hard delete
- Confirmación de eliminación

### 9. Búsqueda de Cursos
**Estado Actual:** No implementado  
**Pendiente:**
- Búsqueda por título, descripción
- Filtros por dificultad

### 10. Estadísticas de Admin
**Estado Actual:** `AdminDashboard` muestra datos mock  
**Pendiente:**
- Estadísticas reales desde Supabase
- Gráficas de progreso
- Usuarios activos

### 11. Asignación Masiva de Cursos
**Estado Actual:** Asignación individual  
**Pendiente:**
- Seleccionar múltiples usuarios
- Asignar curso a múltiples usuarios

### 12. Sistema de Roles Avanzado
**Estado Actual:** Solo 'admin' y 'student'  
**Pendiente:**
- Roles adicionales (teacher, moderator)
- Permisos granulares

---

## 🔗 INTEGRACIONES

### Google Gemini
- **Chat:** `gemini-2.5-flash-preview-09-2025`
- **Quizzes:** `gemini-2.0-flash-exp` (optimizable)
- **Cursos:** Gemini (modelo configurable)
- **Imágenes:** `imagen-3.0-generate-002`

### Supabase
- **Auth:** Autenticación completa
- **Database:** PostgreSQL con RLS
- **Edge Functions:** 4 funciones desplegadas
- **Storage:** Configurado (no usado activamente)

### Vercel
- **Hosting:** Frontend estático
- **API Routes:** 4 proxies
- **Environment Variables:** Requeridas para Supabase

---

## 📊 MÉTRICAS Y OPTIMIZACIONES

### Optimizaciones Pendientes

1. **Reducir maxTokens en generate-quiz-ai**
   - Actual: 8000
   - Recomendado: 3000-4000

2. **Cambiar modelo de quiz**
   - Actual: `gemini-2.0-flash-exp`
   - Recomendado: `gemini-1.5-flash` o `gemini-2.0-flash-lite`

3. **Agregar rate limiting**
   - Prevenir llamadas duplicadas
   - Debounce en componentes

4. **Caché de respuestas**
   - Cachear quizzes generados
   - Reducir llamadas a API

---

## 🧪 TESTING

**Estado:** No implementado  
**Pendiente:**
- Unit tests
- Integration tests
- E2E tests

---

## 📝 NOTAS IMPORTANTES

1. **Variables de Entorno Vercel:**
   - `SUPABASE_URL` (sin prefijo VITE_)
   - `SUPABASE_ANON_KEY` (sin prefijo VITE_)
   - `GEMINI_API_KEY` (opcional, si se usa chat.js directamente)

2. **Variables de Entorno Supabase:**
   - `GEMINI_API_KEY` (requerida)
   - `OPENAI_API_KEY` (opcional)
   - `CLAUDE_API_KEY` (opcional)

3. **SessionStorage:**
   - `auditor_override`: 'true' cuando se pasa el código #405527

4. **LocalStorage:**
   - Sesión de Supabase
   - Tema seleccionado
   - Preferencias de usuario

---

## 🚀 DEPLOYMENT

### Vercel
- Build command: `npm run build`
- Output directory: `dist`
- Node version: 20.x

### Supabase
- Edge Functions desplegadas manualmente
- Secrets configurados en Project Settings

---

## 📞 SOPORTE Y DOCUMENTACIÓN

- **README:** `README_VERCEL.md`
- **Quick Start:** `QUICK_START.md`
- **Instrucciones Deploy:** `INSTRUCCIONES_DEPLOY_SUPABASE.md`
- **Verificación:** `VERIFICACION_ESPECIFICACIONES.md`

---

**Última Actualización:** Enero 2025  
**Versión del Documento:** 1.0

