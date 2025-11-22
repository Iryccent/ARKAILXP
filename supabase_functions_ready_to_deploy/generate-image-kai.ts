// generate-image-kai — Supabase Edge Function (Deno)
// Producción: Imagen con Gemini (Imagen 3.0) vía v1beta/images:generate
// Requiere: GEMINI_API_KEY en Functions → Secrets

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
  "Vary": "Origin"
};

const API_KEY = Deno.env.get("GEMINI_API_KEY")?.trim() || "";
const URL_IMAGES_GENERATE = "https://generativelanguage.googleapis.com/v1beta/images:generate";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", {
    headers: CORS
  });

  if (req.method !== "POST") {
    return new Response(JSON.stringify({
      error: "Method not allowed"
    }), {
      status: 405,
      headers: {
        ...CORS,
        "Content-Type": "application/json"
      }
    });
  }

  try {
    if (!API_KEY) {
      return new Response(JSON.stringify({
        error: "Missing GEMINI_API_KEY"
      }), {
        status: 500,
        headers: {
          ...CORS,
          "Content-Type": "application/json"
        }
      });
    }

    const body = await req.json().catch(() => ({}));
    const prompt = String(body?.prompt ?? "").trim();
    const size = String(body?.size ?? "1024x1024"); // "512x512", "1024x1024", etc.

    if (!prompt) {
      return new Response(JSON.stringify({
        error: "Field 'prompt' is required"
      }), {
        status: 400,
        headers: {
          ...CORS,
          "Content-Type": "application/json"
        }
      });
    }

    // Request oficial (v1beta/images:generate) — modelo económico/estable
    const payload = {
      model: "imagen-3.0",
      prompt: {
        text: prompt
      }
    };

    const res = await fetch(`${URL_IMAGES_GENERATE}?key=${encodeURIComponent(API_KEY)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const txt = await res.text();

    if (!res.ok) {
      // Muestra exactamente qué devolvió Google para depurar rápido
      return new Response(JSON.stringify({
        error: `Gemini error ${res.status}`,
        details: txt
      }), {
        status: 502,
        headers: {
          ...CORS,
          "Content-Type": "application/json"
        }
      });
    }

    // Respuesta esperada:
    // {
    //   "generatedImages": [
    //     { "inlineData": { "mimeType": "image/png", "data": "BASE64..." } }
    //   ]
    // }
    let data;
    try {
      data = JSON.parse(txt);
    } catch {
      throw new Error(`Invalid JSON from Gemini: ${txt}`);
    }

    const gi = Array.isArray(data?.generatedImages) ? data.generatedImages[0] : null;
    const inline = gi?.inlineData || gi?.inline_data || null;
    const mime = inline?.mimeType || inline?.mime_type || "image/png";
    const b64 = inline?.data;

    if (!b64) {
      return new Response(JSON.stringify({
        error: "No image data in response",
        raw: data
      }), {
        status: 502,
        headers: {
          ...CORS,
          "Content-Type": "application/json"
        }
      });
    }

    return new Response(JSON.stringify({
      ok: true,
      mime_type: mime,
      image_base64: b64,
      size
    }), {
      status: 200,
      headers: {
        ...CORS,
        "Content-Type": "application/json"
      }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({
      error: String(err?.message || err)
    }), {
      status: 500,
      headers: {
        ...CORS,
        "Content-Type": "application/json"
      }
    });
  }
});
