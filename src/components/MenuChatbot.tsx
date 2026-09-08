import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { X, Send, Sparkles } from '../icons/coreui';
import { PIZZERIA_CONTACT } from '../data/menuData';
import { askGemini, geminiEnabled, ChatTurn } from '../lib/gemini';
import { buildMenuContext } from '../lib/menuContext';

const SYSTEM_INSTRUCTION = `אתם עוזר וירטואלי ידידותי של "${PIZZERIA_CONTACT.name}". ענו בעברית, קצר וברור.
ענו רק על סמך המידע על התפריט שניתן לכם למטה — אל תמציאו מחירים, מוצרים או זמינות שלא מופיעים בו.
אם נשאלתם משהו שלא קשור לתפריט/למסעדה, הפנו בנימוס להתקשר לשרון בטלפון ${PIZZERIA_CONTACT.phoneDisplay}.

${buildMenuContext()}`;

interface MenuChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MenuChatbot: React.FC<MenuChatbotProps> = ({ isOpen, onClose }) => {
  const [turns, setTurns] = useState<ChatTurn[]>([
    { role: 'model', text: 'היי! 👋 אני העוזר הדיגיטלי של שרון. אפשר לשאול אותי על התפריט, תוספות, כשרות או משלוחים.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [turns, loading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const nextTurns: ChatTurn[] = [...turns, { role: 'user', text }];
    setTurns(nextTurns);
    setInput('');
    setLoading(true);
    try {
      const reply = await askGemini(nextTurns, SYSTEM_INSTRUCTION);
      setTurns((prev) => [...prev, { role: 'model', text: reply }]);
    } catch {
      setTurns((prev) => [
        ...prev,
        { role: 'model', text: `מצטער, לא הצלחתי לענות כרגע. אפשר להתקשר לשרון: ${PIZZERIA_CONTACT.phoneDisplay}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      id="menu-chatbot-panel"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      dir="rtl"
      className="fixed bottom-20 left-4 z-50 w-[calc(100%-2rem)] max-w-sm h-[70vh] max-h-[520px] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
    >
      <div className="bg-red-700 text-white p-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span className="font-bold text-sm">שאלו את העוזר של שרון</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="סגירת הצ'אט"
          className="p-1 rounded-lg hover:bg-red-800/60 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3.5 space-y-2.5 bg-slate-50">
        {turns.map((turn, i) => (
          <div key={i} className={`flex ${turn.role === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                turn.role === 'user'
                  ? 'bg-white border border-slate-200 text-slate-800'
                  : 'bg-red-600 text-white'
              }`}
            >
              {turn.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-end">
            <div className="bg-red-600 text-white rounded-2xl px-3.5 py-2 text-xs">כותב/ת...</div>
          </div>
        )}
        {!geminiEnabled && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-[11px] rounded-lg px-3 py-2">
            העוזר עדיין לא הופעל באתר (חסר מפתח Gemini).
          </div>
        )}
      </div>

      <div className="p-3 border-t border-slate-200 flex items-center gap-2 shrink-0 bg-white">
        <input
          id="chatbot-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="שאלו אותי משהו על התפריט..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="w-9 h-9 shrink-0 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl flex items-center justify-center cursor-pointer transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
