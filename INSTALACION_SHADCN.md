# 🎨 Guía de Instalación: Shadcn UI para Arkai LXP

Esta guía te ayudará a instalar y configurar Shadcn UI en tu proyecto.

---

## 📋 ¿Qué es Shadcn UI?

Shadcn UI es una colección de componentes React reutilizables construidos con Radix UI y Tailwind CSS. A diferencia de otras librerías, **copias los componentes directamente a tu proyecto**, dándote control total.

---

## ✅ Paso 1: Verificar Instalación Base

Tu proyecto ya tiene:
- ✅ Radix UI instalado (`@radix-ui/react-dialog`, `@radix-ui/react-toast`, etc.)
- ✅ Tailwind CSS configurado
- ✅ `class-variance-authority` y `clsx` instalados
- ✅ Algunos componentes básicos (`button`, `dialog`, `toast`)

---

## 🚀 Paso 2: Inicializar Shadcn (si no lo has hecho)

```bash
npx shadcn@latest init
```

**Configuración recomendada:**

```
✔ Would you like to use TypeScript? … No
✔ Which style would you like to use? › Default
✔ Which color would you like to use as base color? › Slate
✔ Where is your global CSS file? … src/index.css
✔ Would you like to use CSS variables for colors? … Yes
✔ Where is your tailwind.config.js located? … tailwind.config.js
✔ Configure the import alias for components? … @/components
✔ Configure the import alias for utils? … @/lib/utils
```

Esto actualizará tu `tailwind.config.js` y `src/index.css` con las variables CSS necesarias.

---

## 📦 Paso 3: Instalar Componentes Esenciales

Ejecuta estos comandos uno por uno:

```bash
# Input y formularios
npx shadcn@latest add input
npx shadcn@latest add textarea
npx shadcn@latest add select
npx shadcn@latest add label
npx shadcn@latest add checkbox
npx shadcn@latest add radio-group
npx shadcn@latest add switch

# Layout y contenedores
npx shadcn@latest add card
npx shadcn@latest add separator
npx shadcn@latest add scroll-area

# Navegación y menús
npx shadcn@latest add dropdown-menu
npx shadcn@latest add navigation-menu
npx shadcn@latest add tabs
npx shadcn@latest add breadcrumb

# Feedback y notificaciones
npx shadcn@latest add alert
npx shadcn@latest add progress
npx shadcn@latest add skeleton
npx shadcn@latest add badge

# Overlays y modales
npx shadcn@latest add sheet
npx shadcn@latest add popover
npx shadcn@latest add tooltip
npx shadcn@latest add alert-dialog

# Datos y listas
npx shadcn@latest add table
npx shadcn@latest add accordion
npx shadcn@latest add avatar
npx shadcn@latest add command

# Otros útiles
npx shadcn@latest add calendar
npx shadcn@latest add slider
npx shadcn@latest add switch
```

**O instala todos de una vez:**

```bash
npx shadcn@latest add input textarea select label card separator dropdown-menu tabs alert badge sheet popover tooltip table accordion avatar
```

---

## 🎨 Paso 4: Personalizar para tu Tema

Los componentes de Shadcn usan variables CSS. Tu `src/index.css` ya tiene algunas, pero puedes expandirlas:

```css
@layer base {
  :root {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
    --radius: 0.5rem;
  }
}
```

---

## 💡 Paso 5: Ejemplos de Uso

### Card con Input

```jsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

function LoginForm() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Iniciar Sesión</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="tu@email.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" type="password" />
        </div>
        <Button className="w-full">Entrar</Button>
      </CardContent>
    </Card>
  );
}
```

### Tabs

```jsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function CourseTabs() {
  return (
    <Tabs defaultValue="content" className="w-full">
      <TabsList>
        <TabsTrigger value="content">Contenido</TabsTrigger>
        <TabsTrigger value="quiz">Quiz</TabsTrigger>
        <TabsTrigger value="chat">Chat</TabsTrigger>
      </TabsList>
      <TabsContent value="content">
        Contenido de la lección...
      </TabsContent>
      <TabsContent value="quiz">
        Quiz aquí...
      </TabsContent>
      <TabsContent value="chat">
        Chat aquí...
      </TabsContent>
    </Tabs>
  );
}
```

### Alert

```jsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

function ErrorAlert({ message }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
```

---

## 🔧 Personalización Avanzada

### Modificar un Componente

Los componentes están en `src/components/ui/`. Puedes editarlos directamente:

```jsx
// src/components/ui/button.jsx
// Modifica el componente según tus necesidades
```

### Crear Variantes Personalizadas

```jsx
// Ejemplo: Agregar variante "gradient" al Button
const buttonVariants = cva(
  'inline-flex items-center justify-center...',
  {
    variants: {
      variant: {
        // ... variantes existentes
        gradient: 'bg-gradient-to-r from-blue-600 to-purple-600',
      },
    },
  }
);
```

---

## 📚 Recursos

- [Documentación de Shadcn UI](https://ui.shadcn.com/)
- [Todos los Componentes](https://ui.shadcn.com/docs/components)
- [Radix UI Docs](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/) (ya lo tienes instalado)

---

## ❓ Preguntas Frecuentes

**P: ¿Puedo usar TypeScript?**
R: Sí, pero tu proyecto actual usa JavaScript. Si quieres migrar, puedes hacerlo gradualmente.

**P: ¿Los componentes son gratuitos?**
R: Sí, Shadcn UI es completamente gratuito y open source.

**P: ¿Puedo modificar los componentes?**
R: ¡Absolutamente! Ese es el punto. Los componentes son tuyos, cópialos y modifícalos como quieras.

---

¡Listo! Ya tienes Shadcn UI configurado. Empieza a usar los componentes en tu proyecto.

