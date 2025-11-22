# Edge Functions Log

Este documento enumera las **Edge Functions** finales desplegadas en el proyecto **ARKAI LXP**. Cada función está escrita en TypeScript y se encuentra en la carpeta `supabase_functions_ready_to_deploy`.

---

## 1. `chatbot-kai.ts`
- **Propósito**: Procesa mensajes del usuario y genera respuestas de IA usando el modelo Gemini (`gemini-2.0-flash-lite`).
- **Ruta**: `supabase_functions_ready_to_deploy/chatbot-kai.ts`
- **Endpoint Supabase**: `https://<your-project>.supabase.co/functions/v1/chatbot-kai`
- **Características clave**:
  - CORS configurado con lista de orígenes permitidos.
  - Sistema de prompt que incluye la personalidad de KAI (creador, organización, formato).
  - Manejo de contexto de curso.

---

## 2. `generate-image-kai.ts`
- **Propósito**: Genera imágenes a partir de un prompt usando el modelo Gemini Image (`gemini-2.5-flash-image`).
- **Ruta**: `supabase_functions_ready_to_deploy/generate-image-kai.ts`
- **Endpoint Supabase**: `https://<your-project>.supabase.co/functions/v1/generate-image-kai`
- **Características clave**:
  - CORS configurado.
  - Devuelve la imagen en formato base64 (`data:image/png;base64,...`).

---

## 3. `generate-quiz-ai.ts`
- **Propósito**: Genera preguntas de quiz estructuradas en JSON basadas en el contexto proporcionado.
- **Ruta**: `supabase_functions_ready_to_deploy/generate-quiz-ai.ts`
- **Endpoint Supabase**: `https://<your-project>.supabase.co/functions/v1/generate-quiz-ai`
- **Características clave**:
  - Usa el modelo Gemini (`gemini-2.0-flash-lite`).
  - Salida JSON con `questions`, `options`, `correctAnswer`, `explanation`.
  - CORS configurado.

---

## 4. `create-course-ai.ts`
- **Propósito**: Genera una estructura completa de curso (título, descripción, módulos, lecciones) en formato JSON.
- **Ruta**: `supabase_functions_ready_to_deploy/create-course-ai.ts`
- **Endpoint Supabase**: `https://<your-project>.supabase.co/functions/v1/create-course-ai`
- **Características clave**:
  - Modelo Gemini (`gemini-2.0-flash-lite`).
  - Salida JSON con `title`, `description`, `difficulty_level`, `course_content`.
  - CORS configurado.

---

> **Nota**: Reemplaza `<your-project>` con el identificador de tu proyecto Supabase al usar los endpoints.

Este log sirve como referencia rápida para desarrolladores y para documentación interna.
