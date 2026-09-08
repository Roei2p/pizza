import { PizzaSize, PizzaCrust, Topping, DrinkItem, DessertItem, SpecialtyItem, DietaryOption } from '../types';

export const PIZZERIA_CONTACT = {
  name: 'הפיצה של שרון',
  tagline: 'פיצה איטלקית אותנטית בעבודת יד מחומרי גלם מובחרים',
  phoneDisplay: '03-555-7427',
  phoneDial: '035557427',
  address: 'שלום שבזי 37, אליכין',
  kosher: 'כשר מהדרין',
  openingHours: 'א׳-ה׳: 11:00-23:30 | מוצ״ש: חצי שעה לאחר צאת השבת עד 00:30',
  deliveryFee: 18,
  minOrder: 80,
  deliveryTime: '40-60 דקות',
  allergenNote:
    'המוצרים עלולים להכיל או מכילים אלרגנים, וגלוטן עשוי להימצא גם במוצרים המוגדרים ללא גלוטן. כל המנות (כולל הטבעוניות) מיוצרות במטבח שאינו סטרילי.',
};

// Sizes and prices match Sharon's real delivery-app menu (אישית/משפחתית/ענקית).
export const PIZZA_SIZES: PizzaSize[] = [
  {
    id: 'personal',
    name: 'פיצה אישית (M)',
    slices: 6,
    diameter: '28 ס״מ',
    basePrice: 35,
  },
  {
    id: 'family',
    name: 'פיצה משפחתית (L)',
    slices: 8,
    diameter: '36 ס״מ',
    basePrice: 45,
    popular: true,
  },
  {
    id: 'giant',
    name: 'פיצה ענקית (XL)',
    slices: 8,
    diameter: '42 ס״מ',
    basePrice: 55,
  },
];

// Dietary variants from the real menu: vegan adds a flat 3₪ across every size
// (35→38, 45→48, 55→58); gluten-free is offered in the personal size only.
export const DIETARY_OPTIONS: DietaryOption[] = [
  {
    id: 'regular',
    name: 'רגיל',
    icon: '🍕',
    extraPrice: 0,
    sizesAllowed: ['personal', 'family', 'giant'],
  },
  {
    id: 'vegan',
    name: 'טבעוני',
    icon: '🌱',
    extraPrice: 3,
    sizesAllowed: ['personal', 'family', 'giant'],
  },
  {
    id: 'gluten_free',
    name: 'ללא גלוטן',
    icon: '🌾',
    extraPrice: 0,
    sizesAllowed: ['personal'],
  },
];

export const PIZZA_CRUSTS: PizzaCrust[] = [
  {
    id: 'classic',
    name: 'בצק איטלקי קלאסי',
    description: 'בצק פריך ומותפח 48 שעות לפי המתכון המסורתי של שרון',
    extraPrice: 0,
  },
  {
    id: 'thick',
    name: 'בצק עבה אוורירי (פוקאצ׳ה סטייל)',
    description: 'בצק עבה, רך מבפנים וקריספי בשוליים',
    extraPrice: 4,
  },
  {
    id: 'cheese_crust',
    name: 'שוליים ממולאים בגבינת מוצרלה',
    description: 'צמת שוליים גדושה במוצרלה איטלקית נמסה',
    extraPrice: 12,
  },
];

// Fixed-price snacks and side dishes from Sharon's real menu ("נשנושים ומנות
// צד") — served as-is, not through the size/crust/topping pizza builder.
export const SPECIALTY_ITEMS: SpecialtyItem[] = [
  {
    id: 'malawach_pizza',
    name: 'מלאווח פיצה',
    description: 'מלאווח חם עם רוטב פיצה וגבינה. ניתן להוסיף תוספות בתשלום.',
    price: 28,
    icon: '🫓',
    image: `${import.meta.env.BASE_URL}assets/malawach-pizza.jpg`,
  },
  {
    id: 'mozzarella_sticks',
    name: 'אצבעות מוצרלה',
    description: 'אצבעות פריכות במילוי גבינת מוצרלה נמסה',
    price: 25,
    icon: '🧀',
    image: `${import.meta.env.BASE_URL}assets/mozzarella-sticks.jpg`,
  },
  {
    id: 'gouda_rings',
    name: 'טבעות גאודה',
    description: 'טבעות פריכות במילוי גבינת גאודה',
    price: 25,
    icon: '🥯',
    image: `${import.meta.env.BASE_URL}assets/gouda-rings.jpg`,
  },
];

// Sharon's real delivery menu prices every added topping flat, per tray
// ("תוספת למגש - 8 ש."), regardless of type — kept uniform here to match.
const TOPPING_PRICE_WHOLE = 8;
const TOPPING_PRICE_PER_QUARTER = 2;

export const TOPPINGS_LIST: Topping[] = [
  {
    id: 'olives_green',
    name: 'זיתים ירוקים',
    icon: '🫒',
    pricePerQuarter: TOPPING_PRICE_PER_QUARTER,
    priceWhole: TOPPING_PRICE_WHOLE,
    category: 'veggies',
    vegan: true,
  },
  {
    id: 'mushrooms',
    name: 'פטריות שמפיניון טריות',
    icon: '🍄',
    pricePerQuarter: TOPPING_PRICE_PER_QUARTER,
    priceWhole: TOPPING_PRICE_WHOLE,
    category: 'veggies',
    vegan: true,
  },
  {
    id: 'corn',
    name: 'תירס מתוק',
    icon: '🌽',
    pricePerQuarter: TOPPING_PRICE_PER_QUARTER,
    priceWhole: TOPPING_PRICE_WHOLE,
    category: 'veggies',
    vegan: true,
  },
  {
    id: 'onion_red',
    name: 'בצל סגול קצוץ',
    icon: '🧅',
    pricePerQuarter: TOPPING_PRICE_PER_QUARTER,
    priceWhole: TOPPING_PRICE_WHOLE,
    category: 'veggies',
    vegan: true,
  },
  {
    id: 'tomatoes',
    name: 'עגבניות טריות ועשבי תיבול',
    icon: '🍅',
    pricePerQuarter: TOPPING_PRICE_PER_QUARTER,
    priceWhole: TOPPING_PRICE_WHOLE,
    category: 'veggies',
    vegan: true,
  },
  {
    id: 'jalapeno',
    name: 'פלפל חריף ירוק',
    icon: '🌶️',
    pricePerQuarter: TOPPING_PRICE_PER_QUARTER,
    priceWhole: TOPPING_PRICE_WHOLE,
    category: 'veggies',
    vegan: true,
  },
  {
    id: 'olives_kalamata',
    name: 'זיתי קלמטה מובחרים',
    icon: '🖤',
    pricePerQuarter: TOPPING_PRICE_PER_QUARTER,
    priceWhole: TOPPING_PRICE_WHOLE,
    category: 'veggies',
    vegan: true,
  },
  {
    id: 'extra_cheese',
    name: 'תוספת אקסטרה מוצרלה',
    icon: '🧀',
    pricePerQuarter: TOPPING_PRICE_PER_QUARTER,
    priceWhole: TOPPING_PRICE_WHOLE,
    category: 'cheese',
    vegan: false,
  },
  {
    id: 'feta',
    name: 'גבינה בולגרית מלוחה 24%',
    icon: '⚪',
    pricePerQuarter: TOPPING_PRICE_PER_QUARTER,
    priceWhole: TOPPING_PRICE_WHOLE,
    category: 'cheese',
    vegan: false,
  },
  {
    id: 'tuna',
    name: 'טונה מובחרת',
    icon: '🐟',
    pricePerQuarter: TOPPING_PRICE_PER_QUARTER,
    priceWhole: TOPPING_PRICE_WHOLE,
    category: 'specials',
    vegan: false,
  },
  {
    id: 'pineapple',
    name: 'אננס עסיסי',
    icon: '🍍',
    pricePerQuarter: TOPPING_PRICE_PER_QUARTER,
    priceWhole: TOPPING_PRICE_WHOLE,
    category: 'specials',
    vegan: true,
  },
  {
    id: 'garlic_confit',
    name: 'שום קונפי ושמן זית',
    icon: '🧄',
    pricePerQuarter: TOPPING_PRICE_PER_QUARTER,
    priceWhole: TOPPING_PRICE_WHOLE,
    category: 'specials',
    vegan: true,
  },
  {
    id: 'fresh_basil',
    name: 'בזיליקום טרי מהעציץ',
    icon: '🌿',
    pricePerQuarter: TOPPING_PRICE_PER_QUARTER,
    priceWhole: TOPPING_PRICE_WHOLE,
    category: 'veggies',
    vegan: true,
  },
];

export const DRINKS_LIST: DrinkItem[] = [
  {
    id: 'coke_regular_15',
    name: 'קוקה קולה (בקבוק)',
    description: 'בקבוק משפחתי צונן ומרענן',
    sizeVolume: '1.5 ליטר',
    price: 15,
    category: 'soda',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'coke_zero_15',
    name: 'קוקה קולה זירו (בקבוק)',
    description: 'ללא סוכר, טעם קולה קלאסי',
    sizeVolume: '1.5 ליטר',
    price: 15,
    category: 'zero',
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'sprite_15',
    name: 'ספרייט לימון-ליים (בקבוק)',
    description: 'מרענן וקריר בטעם לימון ליים',
    sizeVolume: '1.5 ליטר',
    price: 15,
    category: 'soda',
    image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'sprite_zero_15',
    name: 'ספרייט זירו (בקבוק)',
    description: 'ספרייט ללא סוכר וקלוריות',
    sizeVolume: '1.5 ליטר',
    price: 15,
    category: 'zero',
    image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'fanta_15',
    name: 'פנטה אורנג׳ (בקבוק)',
    description: 'בטעם תפוזים עסיסי ומבעבע',
    sizeVolume: '1.5 ליטר',
    price: 15,
    category: 'soda',
    image: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'fuze_tea_15',
    name: 'פיוז-טי אפרסק (בקבוק)',
    description: 'תה קר בטעם אפרסק מרענן',
    sizeVolume: '1.5 ליטר',
    price: 15,
    category: 'juice',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'coke_can_330',
    name: 'קוקה קולה פחית',
    description: 'פחית אישית קרה כקרח',
    sizeVolume: '330 מ״ל',
    price: 10,
    category: 'soda',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'coke_zero_can_330',
    name: 'קולה זירו פחית',
    description: 'פחית אישית קרה ללא סוכר',
    sizeVolume: '330 מ״ל',
    price: 10,
    category: 'zero',
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'water_15',
    name: 'מים מינרליים נביעות',
    description: 'בקבוק מים מינרליים טהורים',
    sizeVolume: '1.5 ליטר',
    price: 10,
    category: 'water_beer',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'soda_kinley',
    name: 'סודה קינלי קרה',
    description: 'בקבוק סודה מוגזת וצוננת',
    sizeVolume: '1.5 ליטר',
    price: 11,
    category: 'water_beer',
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'malt_beer',
    name: 'בירה שחורה מאלטי',
    description: 'בירה שחורה קלאסית ללא אלכוהול',
    sizeVolume: '330 מ״ל',
    price: 12,
    category: 'water_beer',
    image: 'https://images.unsplash.com/photo-1608270102640-5e886d9c6e3b?w=400&auto=format&fit=crop&q=80',
  },
];

export const DESSERTS_LIST: DessertItem[] = [
  {
    id: 'malawach_chocolate',
    name: 'פיצה מלוואח שוקולד',
    description: 'מלאווח עם שוקולד מעל.',
    price: 28,
    badge: 'מתוק וחם',
    image: `${import.meta.env.BASE_URL}assets/malawach-chocolate.jpg`,
  },
];
