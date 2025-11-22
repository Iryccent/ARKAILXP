# 🗄️ EJECUTAR SQL EN SUPABASE - MÉTODO MANUAL

## ✅ **MÉTODO SIMPLE (Recomendado)**

Ya que el CLI no puede confirmar interactivamente, vamos a ejecutar el SQL directo en el dashboard.

---

## 📋 **PASOS:**

### **1. Abrir SQL Editor**
1. Ve a: https://supabase.com/dashboard
2. Selecciona tu proyecto: **ARKAI LXP irycc**
3. Click en **"SQL Editor"** (menú izquierdo)
4. Click en **"New Query"**

---

### **2. Copiar el SQL**

Abre este archivo en tu computadora:
```
C:\Users\jadri\CreativeHub\TODAY13\ARKAILXP\supabase\migrations\20251122000001_lxp_schema.sql
```

**Copia TODO el contenido** (Ctrl+A, Ctrl+C)

---

### **3. Pegar y Ejecutar**

1. **Pega** el SQL en el editor de Supabase
2. **Click en "RUN"** (botón verde abajo a la derecha)
3. **Espera** a que termine (puede tomar 10-20 segundos)
4. Deberías ver: ✅ **"Success. No rows returned"**

---

### **4. Crear tu Usuario Admin**

Después de ejecutar el SQL, corre estos 2 queries:

#### **Query 1: Obtener tu UUID**
```sql
SELECT id, email FROM auth.users WHERE email = 'jadrielrod@gmail.com';
```

**Copia el UUID** que aparece (algo como: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

#### **Query 2: Crear tu perfil (reemplaza TU_UUID_AQUI)**
```sql
INSERT INTO public.users (auth_user_id, name, email, asl_level, role)
VALUES (
  'TU_UUID_AQUI',
  'Jadriel Rodriguez',
  'jadrielrod@gmail.com',
  4,
  'Manager'
);
```

---

### **5. Verificar**

Ejecuta este query para confirmar:
```sql
SELECT * FROM public.users WHERE email = 'jadrielrod@gmail.com';
```

Deberías ver:
- ✅ name: Jadriel Rodriguez
- ✅ email: jadrielrod@gmail.com
- ✅ asl_level: 4
- ✅ role: Manager

---

## ✅ **¡LISTO!**

Una vez hecho esto:
1. Las tablas estarán creadas
2. Tu usuario admin estará configurado
3. Podremos actualizar el código de React para usar la base de datos

---

## 🚨 **SI HAY ERROR**

Si sale algún error al ejecutar el SQL:
1. Copia el mensaje de error completo
2. Mándamelo
3. Te ayudo a solucionarlo

---

**¡EJECUTA ESTO Y AVÍSAME CUANDO ESTÉ LISTO!** 🎉

