export interface Property {
  id: string;
  title: string;
  developer: string;
  location: string;
  city: string;
  type: 'Residential' | 'Commercial' | 'Fractional' | 'Assured Return';
  minInvestment: number; // in Lakhs
  totalValue: string; // e.g. "Crores"
  projectedROI: number; // percentage
  rentalYield: number; // percentage
  appreciationRate: number; // percentage/year
  reraId: string;
  isVerified: boolean;
  image: string;
  tagline: string;
  description: string;
  amenities: string[];
  paymentPlan: {
    bookingAmount: string;
    stage1: string;
    stage2: string;
  };
  completionYear: number;
  investorJiScore?: number; // e.g. 9.1
  scores?: {
    location: number; // stars out of 5
    builder: number; // stars out of 5
    rental: number; // stars out of 5
    growth: number; // stars out of 5
    liquidity: number; // stars out of 5
  };
  isPlot?: boolean;
  isRetail?: boolean;
  isUnderConstruction?: boolean;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  category: 'Construction' | 'Furnishing' | 'Bath & Sanitary' | 'Electrical & Lighting' | 'Hardware & Steel';
  brand: string;
  price: number;
  originalPrice: number;
  rating: number;
  image: string;
  description: string;
  location: string;
  isAvailable: boolean;
}

export interface Lead {
  id: string;
  buyerName: string;
  phonePrefix: string;
  phoneSuffix: string; // obfuscated for non-buyers
  city: string;
  targetLocation: string;
  budget: string;
  propertyType: string;
  timeframe: string;
  score: number; // out of 100
  isVerified: boolean;
  price: number; // lead purchase price
  isPurchased: boolean;
  dateAdded: string;
}

export interface Testimonial {
  id: string;
  name: string;
  profile: string;
  role: string;
  company: string;
  content: string;
  investmentAmount: string;
  achievedROI: string;
}
