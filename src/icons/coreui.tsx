import React from 'react';
import { CIcon } from '@coreui/icons-react';
import {
  cilArrowLeft,
  cilCash,
  cilBike,
  cilBirthdayCake,
  cilCheck,
  cilClock,
  cilCopy,
  cilCreditCard,
  cilFire,
  cilDrink,
  cilHeart,
  cilInfo,
  cilGrid,
  cilLocationPin,
  cilChatBubble,
  cilMinus,
  cilGift,
  cilPhone,
  cilChartPie,
  cilPizza,
  cilPlus,
  cilClipboard,
  cilReload,
  cilSend,
  cilShieldAlt,
  cilCart,
  cilMobile,
  cilGem,
  cilStar,
  cilTrash,
  cilUser,
  cilX,
} from '@coreui/icons';

// Thin per-icon wrappers so every existing call site (`<Pizza className="..." />`,
// or an `icon: Pizza` reference rendered later as `<Icon className="..." />`)
// keeps working unchanged after swapping the import source from lucide-react
// to CoreUI — only the import statement in each file needs to change.
type IconProps = { className?: string };
const make = (icon: string[]): React.FC<IconProps> => {
  const Wrapped: React.FC<IconProps> = ({ className }) => <CIcon icon={icon} className={className} />;
  return Wrapped;
};

export const ArrowLeft = make(cilArrowLeft);
export const Banknote = make(cilCash);
export const Bike = make(cilBike);
export const Cake = make(cilBirthdayCake);
export const Check = make(cilCheck);
export const Clock = make(cilClock);
export const Copy = make(cilCopy);
export const CreditCard = make(cilCreditCard);
export const Flame = make(cilFire);
export const GlassWater = make(cilDrink);
export const Heart = make(cilHeart);
export const HelpCircle = make(cilInfo);
export const Info = make(cilInfo);
export const LayoutGrid = make(cilGrid);
export const MapPin = make(cilLocationPin);
export const MessageCircle = make(cilChatBubble);
export const Minus = make(cilMinus);
export const PartyPopper = make(cilGift);
export const PhoneCall = make(cilPhone);
export const PieChart = make(cilChartPie);
export const Pizza = make(cilPizza);
export const Plus = make(cilPlus);
export const Receipt = make(cilClipboard);
export const RotateCcw = make(cilReload);
export const Send = make(cilSend);
export const ShieldCheck = make(cilShieldAlt);
export const ShoppingBag = make(cilCart);
export const Smartphone = make(cilMobile);
export const Sparkles = make(cilGem);
export const Star = make(cilStar);
export const Trash2 = make(cilTrash);
export const User = make(cilUser);
export const X = make(cilX);
