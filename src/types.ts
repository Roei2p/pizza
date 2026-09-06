export type PizzaSizeId = 'personal' | 'family' | 'giant';
export type CrustId = 'classic' | 'thick' | 'cheese_crust';

export interface PizzaSize {
  id: PizzaSizeId;
  name: string;
  slices: number;
  diameter: string;
  basePrice: number;
  popular?: boolean;
}

export interface PizzaCrust {
  id: CrustId;
  name: string;
  description: string;
  extraPrice: number;
}

export type QuarterId = 1 | 2 | 3 | 4;

export type PortionMode = 'whole' | 'half' | 'three_quarters' | 'quarter' | 'custom';

export interface Topping {
  id: string;
  name: string;
  icon: string;
  pricePerQuarter: number;
  priceWhole: number;
  category: 'veggies' | 'cheese' | 'specials';
}

export interface AppliedTopping {
  toppingId: string;
  quarters: QuarterId[]; // which quarters this topping is on [1, 2, 3, 4]
}

export interface CustomPizzaItem {
  id: string;
  size: PizzaSizeId;
  crust: CrustId;
  sauce: 'classic_tomato' | 'spicy_tomato' | 'bianco_cream';
  appliedToppings: AppliedTopping[];
  quantity: number;
  notes?: string;
  unitPrice: number;
}

export interface DrinkItem {
  id: string;
  name: string;
  description: string;
  sizeVolume: string;
  price: number;
  category: 'soda' | 'zero' | 'juice' | 'water_beer';
  image: string;
}

export interface DessertItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
}

export interface CartDrinkItem {
  id: string; // unique item id in cart
  drinkId: string;
  name: string;
  sizeVolume: string;
  unitPrice: number;
  quantity: number;
  image: string;
}

export interface CartDessertItem {
  id: string; // unique item id in cart
  dessertId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  image: string;
}

// Fixed-price items from Sharon's real menu that don't fit the custom
// size/crust/topping pizza builder (e.g. malawach pizza, a set vegan pizza).
export interface SpecialtyItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  badge?: string;
}

export interface CartSpecialtyItem {
  id: string; // unique item id in cart
  specialtyId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  icon: string;
}

export type CartItem =
  | { type: 'pizza'; data: CustomPizzaItem }
  | { type: 'drink'; data: CartDrinkItem }
  | { type: 'dessert'; data: CartDessertItem }
  | { type: 'specialty'; data: CartSpecialtyItem };

export interface OrderCheckoutInfo {
  customerName: string;
  phone: string;
  deliveryType: 'delivery' | 'pickup';
  city: string;
  street: string;
  apartment: string;
  paymentMethod: 'cash' | 'credit' | 'bit';
  notes: string;
}
