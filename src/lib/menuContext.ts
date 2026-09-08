import {
  PIZZERIA_CONTACT,
  PIZZA_SIZES,
  DIETARY_OPTIONS,
  PIZZA_CRUSTS,
  SPECIALTY_ITEMS,
  TOPPINGS_LIST,
  DRINKS_LIST,
  DESSERTS_LIST,
} from '../data/menuData';

// One shared, plain-text description of the entire real menu, used as
// grounding context for every Gemini call in the app (customer chatbot,
// recommendations, Sharon's assistant) so answers stay accurate instead of
// invented — the model only ever sees this, never live inventory/stock.
export function buildMenuContext(): string {
  const sizes = PIZZA_SIZES.map((s) => `- ${s.name}: ${s.slices} משולשים, קוטר ${s.diameter}, ₪${s.basePrice}`).join('\n');
  const dietary = DIETARY_OPTIONS.map(
    (d) => `- ${d.name}${d.extraPrice ? ` (תוספת ₪${d.extraPrice})` : ''}: זמין בגדלים ${d.sizesAllowed.join(', ')}`,
  ).join('\n');
  const crusts = PIZZA_CRUSTS.map((c) => `- ${c.name}${c.extraPrice ? ` (+₪${c.extraPrice})` : ''}: ${c.description}`).join('\n');
  const toppings = TOPPINGS_LIST.map((t) => `- ${t.name}${t.vegan ? ' (טבעוני)' : ''}`).join('\n');
  const specialty = SPECIALTY_ITEMS.map((s) => `- ${s.name} (₪${s.price}): ${s.description}`).join('\n');
  const drinks = DRINKS_LIST.map((d) => `- ${d.name} (${d.sizeVolume}, ₪${d.price})`).join('\n');
  const desserts = DESSERTS_LIST.map((d) => `- ${d.name} (₪${d.price}): ${d.description}`).join('\n');

  return `
מסעדה: ${PIZZERIA_CONTACT.name} — ${PIZZERIA_CONTACT.tagline}
כתובת: ${PIZZERIA_CONTACT.address}
כשרות: ${PIZZERIA_CONTACT.kosher}
שעות פתיחה: ${PIZZERIA_CONTACT.openingHours}
משלוח: ₪${PIZZERIA_CONTACT.deliveryFee}, מינימום הזמנה ₪${PIZZERIA_CONTACT.minOrder}, זמן הגעה משוער ${PIZZERIA_CONTACT.deliveryTime}
טלפון: ${PIZZERIA_CONTACT.phoneDisplay}
הערת אלרגנים: ${PIZZERIA_CONTACT.allergenNote}

גדלי פיצה (מחיר בסיס, כולל תוספת אחת חינם. תוספת נוספת: ₪8 לפיצה שלמה, ₪2 לרבע):
${sizes}

סוגי דיאטה:
${dietary}

סוגי בצק (תוספת מחיר לכל הפיצה):
${crusts}

תוספות זמינות (ניתן לחלק לפי רבעי פיצה):
${toppings}

נשנושים ומנות צד (מחיר קבוע, לא פיצה בהרכבה):
${specialty}

שתייה קרה:
${drinks}

קינוחים:
${desserts}
`.trim();
}
