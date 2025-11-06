import { round } from "@/src/lib/utils";

export type QuoteServiceType = "healthy_home" | "deep_refresh" | "move_in_out" | "commercial";

export type QuoteFrequency = "one_time" | "weekly" | "biweekly" | "monthly";

export type QuoteLocationTier = "sarasota" | "manatee" | "pinellas" | "hillsborough" | "pasco" | "out_of_area";

export type QuoteAddOn =
  | "inside_appliances"
  | "interior_windows"
  | "pressure_washing"
  | "car_detailing"
  | "laundry_organization"
  | "eco_disinfection";

export type QuoteInput = {
  serviceType: QuoteServiceType;
  frequency: QuoteFrequency;
  locationTier: QuoteLocationTier;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  addOns: QuoteAddOn[];
  isFirstTimeClient: boolean;
};

export type QuoteBreakdown = {
  basePrice: number;
  bedroomAdjustment: number;
  bathroomAdjustment: number;
  squareFootageAdjustment: number;
  addOnTotal: number;
  travelFee: number;
  firstTimeFee: number;
  frequencyDiscount: number;
  totalBeforeDiscount: number;
  total: number;
  cleanerPay: number;
  companyMargin: number;
  companyMarginRate: number;
  estimatedDurationHours: number;
  recommendedDeposit: number;
};

const BASE_PRICE_MAP: Record<QuoteServiceType, number> = {
  healthy_home: 149,
  deep_refresh: 229,
  move_in_out: 269,
  commercial: 189
};

const FREQUENCY_DISCOUNT: Record<QuoteFrequency, number> = {
  weekly: 0.22,
  biweekly: 0.15,
  monthly: 0.08,
  one_time: 0
};

const LOCATION_MULTIPLIER: Record<QuoteLocationTier, number> = {
  sarasota: 1,
  manatee: 1.03,
  pinellas: 1.05,
  hillsborough: 1.07,
  pasco: 0.97,
  out_of_area: 1.12
};

const ADD_ON_FEES: Record<QuoteAddOn, number> = {
  inside_appliances: 45,
  interior_windows: 55,
  pressure_washing: 125,
  car_detailing: 95,
  laundry_organization: 40,
  eco_disinfection: 60
};

const CLEANER_COMPENSATION_RATE = 0.62; // pay cleaners ~62% of revenue after travel
const FIRST_TIME_MULTIPLIER = 0.18;

function calculateSquareFootageAdjustment(squareFootage: number): number {
  if (squareFootage <= 1200) return 0;
  if (squareFootage <= 1800) return 45;
  if (squareFootage <= 2400) return 75;
  if (squareFootage <= 3200) return 115;
  if (squareFootage <= 4000) return 165;

  const extraSqFt = squareFootage - 4000;
  return 165 + extraSqFt * 0.12;
}

export function estimateDurationHours(input: QuoteInput): number {
  const { squareFootage, bedrooms, bathrooms, serviceType, addOns } = input;
  let base = 2.5 + bedrooms * 0.35 + bathrooms * 0.45 + squareFootage / 1400;

  if (serviceType === "deep_refresh") base += 1.2;
  if (serviceType === "move_in_out") base += 1.6;
  if (serviceType === "commercial") base += 0.8;

  if (addOns.includes("inside_appliances")) base += 0.5;
  if (addOns.includes("interior_windows")) base += 0.75;
  if (addOns.includes("pressure_washing")) base += 1.1;
  if (addOns.includes("car_detailing")) base += 0.9;
  if (addOns.includes("laundry_organization")) base += 0.6;
  if (addOns.includes("eco_disinfection")) base += 0.4;

  return Number(base.toFixed(1));
}

export function calculateQuote(input: QuoteInput): QuoteBreakdown {
  const {
    serviceType,
    frequency,
    bedrooms,
    bathrooms,
    squareFootage,
    addOns,
    isFirstTimeClient,
    locationTier
  } = input;

  const basePrice = BASE_PRICE_MAP[serviceType];
  const bedroomAdjustment = bedrooms * 14;
  const bathroomAdjustment = bathrooms * 22;
  const squareFootageAdjustment = Math.round(calculateSquareFootageAdjustment(squareFootage));
  const addOnTotal = addOns.reduce((total, addOn) => total + (ADD_ON_FEES[addOn] ?? 0), 0);

  const firstTimeFee = isFirstTimeClient ? (basePrice + bedroomAdjustment + bathroomAdjustment) * FIRST_TIME_MULTIPLIER : 0;
  const subtotal =
    (basePrice + bedroomAdjustment + bathroomAdjustment + squareFootageAdjustment) * LOCATION_MULTIPLIER[locationTier];

  const totalBeforeDiscount = subtotal + addOnTotal + firstTimeFee;
  const frequencyDiscount = totalBeforeDiscount * FREQUENCY_DISCOUNT[frequency];
  const travelFee = locationTier === "out_of_area" ? 25 : locationTier === "pasco" ? 10 : 0;

  const total = Math.max(totalBeforeDiscount - frequencyDiscount + travelFee, 90);
  const cleanerPay = round((total - travelFee) * CLEANER_COMPENSATION_RATE, 2);
  const companyMargin = round(total - cleanerPay - travelFee, 2);
  const companyMarginRate = Number(((companyMargin / total) * 100).toFixed(1));
  const estimatedDurationHours = estimateDurationHours(input);
  const recommendedDeposit = round(Math.max(total * 0.2, 50), 2);

  return {
    basePrice: round(basePrice, 2),
    bedroomAdjustment: round(bedroomAdjustment, 2),
    bathroomAdjustment: round(bathroomAdjustment, 2),
    squareFootageAdjustment: round(squareFootageAdjustment, 2),
    addOnTotal: round(addOnTotal, 2),
    travelFee: round(travelFee, 2),
    firstTimeFee: round(firstTimeFee, 2),
    frequencyDiscount: round(frequencyDiscount, 2),
    totalBeforeDiscount: round(totalBeforeDiscount, 2),
    total: round(total, 2),
    cleanerPay,
    companyMargin,
    companyMarginRate,
    estimatedDurationHours,
    recommendedDeposit
  };
}
