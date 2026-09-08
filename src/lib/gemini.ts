import type { GoogleGenAI } from '@google/genai';

// Called directly from the browser (no backend proxy) — a deliberate
// simplicity/security tradeoff the user chose knowingly: this API key is
// visible to anyone who inspects the site's JS bundle. Fine for a small
// free-tier key with low expected volume; revisit via a server-side proxy
// (e.g. a Firebase Cloud Function) if abuse ever becomes a real concern.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
export const geminiEnabled = Boolean(apiKey);

const MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';

// The SDK is a meaningful chunk of JS (~70KB gzipped) that most visitors —
// anyone who never opens the chatbot — should never have to download just
// to browse the menu. Dynamic import defers it to first actual use.
let clientPromise: Promise<GoogleGenAI> | null = null;
function getClient(): Promise<GoogleGenAI> {
  if (!clientPromise) {
    clientPromise = import('@google/genai').then(({ GoogleGenAI }) => new GoogleGenAI({ apiKey }));
  }
  return clientPromise;
}

export interface ChatTurn {
  role: 'user' | 'model';
  text: string;
}

export async function askGemini(turns: ChatTurn[], systemInstruction: string): Promise<string> {
  if (!geminiEnabled) {
    throw new Error('Gemini API key not configured (VITE_GEMINI_API_KEY)');
  }
  const client = await getClient();
  const response = await client.models.generateContent({
    model: MODEL,
    contents: turns.map((t) => ({ role: t.role, parts: [{ text: t.text }] })),
    config: { systemInstruction },
  });
  return response.text?.trim() || 'לא הצלחתי לענות על זה, נסו לנסח אחרת.';
}
