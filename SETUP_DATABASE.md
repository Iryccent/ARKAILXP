# 🗄️ SETUP DATABASE - ARKAI LXP

## 📊 **PASO 1: Acceder al SQL Editor de Supabase**

1. Ve a: https://supabase.com/dashboard
2. Selecciona tu proyecto **ARKAI LXP**
3. En el menú izquierdo, click en **"SQL Editor"**
4. Click en **"New Query"**

---

## 📝 **PASO 2: Copiar y Ejecutar el Schema**

1. Abre el archivo: `supabase_schema.sql`
2. **Copia TODO el contenido**
3. **Pega** en el SQL Editor de Supabase
4. Click en **"Run"** (botón verde abajo a la derecha)
5. Espera a que diga: ✅ **"Success. No rows returned"**

---

## 👤 **PASO 3: Crear tu Usuario Admin**

Después de ejecutar el schema, necesitas crear tu perfil de admin:

### **3.1: Obtener tu Auth UUID**

Ejecuta este query en el SQL Editor:

```sql
SELECT id, email FROM auth.users WHERE email = 'jadrielrod@gmail.com';
```

Copia el **UUID** que aparece (algo como: `a1b2c3d4-...`)

### **3.2: Crear tu Perfil Admin**

Ejecuta este query (reemplaza `TU_UUID_AQUI` con el UUID que copiaste):

```sql
INSERT INTO public.users (auth_user_id, name, email, asl_level, role)
VALUES (
  'TU_UUID_AQUI',
  'Jadriel Rodriguez',
  'jadrielrod@gmail.com',
  4,
  'Manager'
)
ON CONFLICT (email) DO UPDATE SET
  asl_level = 4,
  role = 'Manager';
```

---

## ✅ **PASO 4: Verificar que todo funciona**

Ejecuta este query para verificar:

```sql
SELECT * FROM public.users WHERE email = 'jadrielrod@gmail.com';
```

Deberías ver:
- ✅ `name`: Jadriel Rodriguez
- ✅ `email`: jadrielrod@gmail.com
- ✅ `asl_level`: 4
- ✅ `role`: Manager

---

## 🎯 **TABLAS CREADAS**

1. ✅ `users` - Usuarios del LXP
2. ✅ `courses` - Cursos
3. ✅ `course_assignments` - Asignaciones de cursos a usuarios
4. ✅ `quiz_attempts` - Intentos de quizzes

---

## 🔐 **SEGURIDAD (RLS Policies)**

Las políticas de seguridad están configuradas para:
- ✅ Usuarios solo ven su propia data
- ✅ Managers ven y editan TODO
- ✅ Solo Managers pueden crear usuarios y cursos
- ✅ Usuarios pueden actualizar su propio progreso

---

## 🚀 **SIGUIENTE PASO**

Después de ejecutar el schema, necesitamos actualizar el código de React para usar Supabase en lugar de `useState`.

**Archivos a modificar:**
1. `AdminASLView.jsx` - Para crear/editar usuarios
2. `CourseCreatorStudio.jsx` - Para crear cursos
3. `DashboardView.jsx` - Para cargar cursos del usuario
4. `App.jsx` - Para cargar el perfil del usuario

---

## 📞 **¿NECESITAS AYUDA?**

Si tienes problemas ejecutando el SQL:
1. Copia el error exacto
2. Mándame screenshot del SQL Editor
3. Te ayudo a solucionarlo

---

**¡EJECUTA EL SCHEMA Y AVÍSAME CUANDO ESTÉ LISTO!** 🎉

