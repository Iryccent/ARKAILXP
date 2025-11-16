


# 🚀 Guía Completa: Migración a Vercel - Arkai LXP

Esta guía te llevará paso a paso para migrar tu plataforma educativa de Hostinger Horizons a Vercel, con API Routes seguras para proteger tus claves de IA.

---

## 📋 Tabla de Contenidos

1. [Prerrequisitos](#prerrequisitos)
2. [Paso 1: Preparar el Repositorio](#paso-1-preparar-el-repositorio)
3. [Paso 2: Configurar Variables de Entorno](#paso-2-configurar-variables-de-entorno)
4. [Paso 3: Subir a Vercel](#paso-3-subir-a-vercel)
5. [Paso 4: Verificar el Deploy](#paso-4-verificar-el-deploy)
6. [Paso 5: Integrar Shadcn UI](#paso-5-integrar-shadcn-ui)
7. [Troubleshooting](#troubleshooting)
8. [Próximos Pasos](#próximos-pasos)

---

## ✅ Prerrequisitos

Antes de comenzar, asegúrate de tener:

- ✅ Una cuenta de GitHub (gratis)
- ✅ Una cuenta de Vercel (gratis)
- ✅ Tus claves API de IA (Gemini, OpenAI, Claude) - al menos una
- ✅ Acceso a tu proyecto Supabase (para las variables de entorno)

---

## 📦 Paso 1: Preparar el Repositorio

### 1.1 Verificar que todo esté listo

El proyecto ya está configurado con:
- ✅ `vercel.json` - Configuración de Vercel
- ✅ `api/` - Carpeta con las API Routes
- ✅ `src/lib/aiClient.js` - Cliente para llamar a las APIs
- ✅ Componentes actualizados para usar las nuevas APIs

### 1.2 Crear archivo .gitignore (si no existe)

Asegúrate de que `.gitignore` incluya:

```
# Variables de entorno
.env
.env.local
.env*.local

# Dependencias
node_modules/

# Build
dist/
.vercel/

# Logs
*.log
```

### 1.3 Inicializar Git (si no lo has hecho)

```bash
git init
git add .
git commit -m "Preparar proyecto para Vercel"
```

---

## 🔐 Paso 2: Configurar Variables de Entorno

### 2.1 Variables para Desarrollo Local

1. Copia `.env.example` a `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edita `.env.local` y agrega tus valores reales:
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key-real
   GEMINI_API_KEY=tu-gemini-key-real
   # ... etc
   ```

### 2.2 Variables para Vercel (Producción)

**IMPORTANTE:** Las variables que empiezan con `VITE_` son públicas (se exponen al frontend). Las claves de IA (`GEMINI_API_KEY`, `OPENAI_API_KEY`, `CLAUDE_API_KEY`) NO deben tener el prefijo `VITE_` porque son secretas y solo se usan en las API routes del servidor.

En Vercel, agrega estas variables:

1. Ve a tu proyecto en Vercel
2. Settings > Environment Variables
3. Agrega cada variable:

   | Variable | Valor | Entornos | Nota |
   |----------|-------|----------|------|
   | `VITE_SUPABASE_URL` | Tu URL de Supabase | Production, Preview, Development | Para el frontend |
   | `VITE_SUPABASE_ANON_KEY` | Tu Anon Key | Production, Preview, Development | Para el frontend |
   | `SUPABASE_URL` | **Mismo valor que VITE_SUPABASE_URL** | Production, Preview, Development | **OBLIGATORIO para funciones serverless** |
   | `SUPABASE_ANON_KEY` | **Mismo valor que VITE_SUPABASE_ANON_KEY** | Production, Preview, Development | **OBLIGATORIO para funciones serverless** |
   | `GEMINI_API_KEY` | Tu clave de Gemini | Production, Preview, Development | - |
   | `OPENAI_API_KEY` | Tu clave de OpenAI (opcional) | Production, Preview, Development | - |
   | `CLAUDE_API_KEY` | Tu clave de Claude (opcional) | Production, Preview, Development | - |

**⚠️ IMPORTANTE:** Las funciones serverless de Vercel (`/api/kai/*`) **NO tienen acceso** a variables que empiezan con `VITE_`. Por eso necesitas duplicar las variables de Supabase:
- Copia el **valor** de `VITE_SUPABASE_URL` y créalo como `SUPABASE_URL` (sin el prefijo `VITE_`)
- Copia el **valor** de `VITE_SUPABASE_ANON_KEY` y créalo como `SUPABASE_ANON_KEY` (sin el prefijo `VITE_`)

---

## 🚀 Paso 3: Subir a Vercel

### Opción A: Desde GitHub (Recomendado)

1. **Sube tu código a GitHub:**
   ```bash
   # Si no tienes un repo remoto
   gh repo create arkai-lxp --public
   git remote add origin https://github.com/tu-usuario/arkai-lxp.git
   git push -u origin main
   ```

2. **Conecta con Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Click en "Add New Project"
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente que es un proyecto Vite

3. **Configura el proyecto:**
   - Framework Preset: Vite
   - Root Directory: `./` (raíz del proyecto)
   - Build Command: `npm run build` (ya configurado)
   - Output Directory: `dist` (ya configurado)
   - Install Command: `npm install` (ya configurado)

4. **Agrega las variables de entorno** (ver Paso 2.2)

5. **Click en "Deploy"**

### Opción B: Desde la CLI de Vercel

1. **Instala Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Inicia sesión:**
   ```bash
   vercel login
   ```

3. **Despliega:**
   ```bash
   vercel
   ```

4. **Sigue las instrucciones** y agrega las variables de entorno cuando te lo pida.

---

## ✅ Paso 4: Verificar el Deploy

### 4.1 Verificar que el sitio funciona

1. Ve a la URL que Vercel te proporcionó (ej: `arkai-lxp.vercel.app`)
2. Verifica que la aplicación carga correctamente
3. Prueba iniciar sesión con Supabase

### 4.2 Probar las API Routes

Abre la consola del navegador y prueba:

```javascript
// Probar chat con IA
fetch('/api/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    provider: 'gemini',
    messages: [{ role: 'user', content: 'Hola, ¿cómo estás?' }]
  })
})
.then(r => r.json())
.then(console.log);
```

Si funciona, deberías ver una respuesta de la IA.

### 4.3 Verificar logs en Vercel

1. Ve a tu proyecto en Vercel
2. Click en "Functions" en el menú
3. Deberías ver tus API routes listadas
4. Click en una para ver los logs y métricas

---

## 🎨 Paso 5: Integrar Shadcn UI

Ya tienes algunos componentes de Shadcn UI instalados. Vamos a expandir la colección:

### 5.1 Instalar Shadcn CLI (si no lo tienes)

```bash
npx shadcn@latest init
```

Sigue las instrucciones:
- ✅ Usar TypeScript? No (estás usando JS)
- ✅ Estilo: Default
- ✅ Color base: Slate
- ✅ CSS variables: Yes

### 5.2 Agregar componentes útiles

```bash
# Componentes esenciales
npx shadcn@latest add input
npx shadcn@latest add textarea
npx shadcn@latest add select
npx shadcn@latest add card
npx shadcn@latest add badge
npx shadcn@latest add avatar
npx shadcn@latest add dropdown-menu
npx shadcn@latest add tabs
npx shadcn@latest add accordion
npx shadcn@latest add skeleton
```

### 5.3 Usar los componentes

Los componentes se instalarán en `src/components/ui/`. Úsalos así:

```jsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mi Título</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Escribe algo..." />
        <Button>Enviar</Button>
      </CardContent>
    </Card>
  );
}
```

---

## 🔧 Troubleshooting

### Problema: "API route not found"

**Solución:**
- Verifica que las funciones estén en `api/` (no `src/api/`)
- Verifica que `vercel.json` esté configurado correctamente
- Revisa los logs en Vercel > Functions

### Problema: "API Key not found"

**Solución:**
- Verifica que las variables de entorno estén en Vercel (Settings > Environment Variables)
- Asegúrate de que NO tengan el prefijo `VITE_` (solo las del frontend lo tienen)
- Reinicia el deploy después de agregar variables

### Problema: CORS errors con Supabase Edge Functions

**Solución:**
- **Opción 1 (Recomendada):** Usa las funciones proxy en Vercel (`/api/kai/chatbot`) que ya están configuradas
- **Opción 2:** Actualiza CORS en Supabase:
  1. Ve a tu proyecto en Supabase Dashboard
  2. Edge Functions > chatbot-kai > Settings
  3. Agrega tu dominio de Vercel a la lista de orígenes permitidos:
     - `https://arkailxp-git-master-iryccents-projects.vercel.app`
     - `https://*.vercel.app` (para todos los previews)
     - Tu dominio personalizado si lo tienes
  4. Guarda los cambios

**Nota:** Las funciones proxy en Vercel (`/api/kai/chatbot`) ya están configuradas y evitan problemas de CORS.

### Problema: Build fails

**Solución:**
- Revisa los logs de build en Vercel
- Verifica que todas las dependencias estén en `package.json`
- Asegúrate de que `node_modules` no esté en el repo

---

## 🎯 Próximos Pasos

### Mejoras Sugeridas:

1. **Dominio Personalizado:**
   - En Vercel: Settings > Domains
   - Agrega tu dominio
   - Configura los DNS según las instrucciones

2. **Monitoreo:**
   - Conecta Vercel Analytics (gratis)
   - Configura alertas de errores

3. **Optimizaciones:**
   - Agrega caching a las API routes
   - Implementa rate limiting
   - Optimiza imágenes

4. **Testing:**
   - Prueba todas las funcionalidades de IA
   - Verifica que los quizzes se generen correctamente
   - Prueba el chatbot en diferentes escenarios

---

## 📚 Recursos Útiles

- [Documentación de Vercel](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Shadcn UI Components](https://ui.shadcn.com/)
- [Supabase Docs](https://supabase.com/docs)

---

## ❓ Preguntas Frecuentes

**P: ¿Puedo seguir usando Supabase Edge Functions?**
R: Sí, puedes usar ambas. Las Edge Functions de Supabase para lógica de base de datos, y las API Routes de Vercel para proteger las claves de IA.

**P: ¿Cuánto cuesta Vercel?**
R: El plan gratuito es muy generoso. Incluye:
- 100GB bandwidth/mes
- Deploys ilimitados
- Serverless Functions (100GB-hours/mes)
- Perfecto para proyectos pequeños/medianos

**P: ¿Las claves API están seguras?**
R: Sí, las claves están en variables de entorno del servidor y nunca se exponen al frontend. Solo las API routes pueden acceder a ellas.

---

¡Listo! Tu plataforma debería estar funcionando en Vercel. Si tienes problemas, revisa los logs en Vercel o abre un issue.

