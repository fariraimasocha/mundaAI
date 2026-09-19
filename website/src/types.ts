export type Language = "English" | "Shona" | "Ndebele";

export interface FarmerProfile {
  name: string;
  location: string;
  district: string;
  naturalRegion: string;
  primaryCrop: string;
  variety: string;
  areaHa: number;
  growthStage: string;
  soilType: string;
  isDemoFarm: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  toolsExecuted?: Array<{
    name: string;
    args: any;
    result: any;
  }>;
  followUpQuestions?: string[];
  actionableNextStep?: string;
  escalation?: {
    recommended: boolean;
    trigger?: string;
    officerContact?: string;
  };
  mediaUrl?: string;
  cropAssessment?: CropScanAssessment;
}

export interface CropIssue {
  name: string;
  likelihood: "High" | "Medium" | "Low";
  scientificName?: string;
  summary: string;
}

export interface CropScanAssessment {
  crop: string;
  possibleIssues: CropIssue[];
  confidence: "High" | "Medium" | "Low";
  visibleSymptoms: string[];
  whatToCheckNext: string[];
  recommendedAction: string[];
  escalation: {
    recommended: boolean;
    trigger: string;
    officerType: string;
  };
  disclaimer: string;
}

export interface WeatherInfo {
  location: string;
  temperature: number;
  condition: string;
  rainProbability: number;
  humidity: number;
  windSpeed: number;
  rainfallLast24h: number;
  forecastNext48h: string;
  agriculturalAdvisory: string;
  status: string;
  timestamp: string;
}

export interface SensorZone {
  id: string;
  name: string;
  soilMoisture: number;
  threshold: number;
  status: string;
  soilTemp: number;
  lastWatered: string;
}

export interface MarketCommodity {
  commodity: string;
  market: string;
  marketId?: string;
  category?: "Grains & Pulses" | "Fresh Horticulture" | "Potatoes & Tubers" | "Indigenous & Specialty" | string;
  priceUSD: number;
  priceZiG: number;
  unit: string;
  bag50kgUSD: number | null;
  transportCostEst: number;
  netPerTonne: number;
  trend: string;
  updated: string;
  liveUrl?: string;
}

export interface MarketPlace {
  id: string;
  name: string;
  shortName: string;
  location: string;
  province: string;
  type: "Statutory Depot" | "Wholesale Spot Market" | "Commodity Exchange" | "Regional Hub";
  liveUrl: string;
  operatingHours: string;
  lastUpdated: string;
  status: string;
  description: string;
  distanceKmDefault: number;
  verifiedSource: string;
  commodities: MarketCommodity[];
}

export interface KnowledgeDoc {
  title: string;
  category: string;
  content: string;
}

export interface FertilizerCalculation {
  system: string;
  plotsCount?: number;
  totalBasins?: number;
  areaHectares?: number;
  basalCompoundD_kg: number;
  topDressingAN_kg: number;
  applicationMethod?: string;
  splitDressing?: string;
  notes?: string;
  disclaimer?: string;
}

export type NetworkStatus = "ONLINE" | "LOW_BANDWIDTH" | "OFFLINE";

export type ProductAvailability = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "PRE_ORDER";

export interface CompanyProduct {
  id: string;
  companyId: string;
  companyName: string;
  name: string;
  category: "Seeds & Hybrids" | "Fertilizers & Nutrition" | "Crop Protection & Chemicals" | "Irrigation & Equipment" | "Livestock Feeds" | "Contract Offtake";
  description: string;
  unit: string;
  priceUSD: number;
  priceZiG: number;
  availability: ProductAvailability;
  stockQuantity?: number;
  stockBadgeText: string;
  depotLocations: string[];
  minOrderQuantity?: string;
  suitableRegions?: string[];
  targetCrops?: string[];
  lastStockCheck: string;
  featured?: boolean;
}

export interface AgriCompany {
  id: string;
  name: string;
  tagline: string;
  category: "Seed Producer" | "Fertilizer Manufacturer" | "Agrochemical Supplier" | "Machinery & Irrigation" | "Agri-Offtaker & Grain Processor" | "Animal Health & Feed";
  headquarters: string;
  localDepots: string[];
  contactPhone: string;
  whatsappNumber: string;
  websiteUrl?: string;
  verifiedStatus: boolean;
  rating: number;
  offtakeProgramsAvailable?: boolean;
  description: string;
  productsCount: number;
}

export interface FarmerProductInquiry {
  id: string;
  farmerName: string;
  farmerPhone: string;
  farmerLocation: string;
  productId: string;
  productName: string;
  companyId: string;
  companyName: string;
  quantityRequested: number;
  preferredDepot: string;
  deliveryMethod: "Depot Pickup" | "Farm Gate Delivery";
  message: string;
  status: "PENDING" | "CONFIRMED" | "DISPATCHED";
  timestamp: string;
}

export interface FarmerProduceListing {
  id: string;
  farmerName: string;
  crop: string;
  variety?: string;
  quantityTonnes: number;
  expectedPriceUSD: number;
  location: string;
  availabilityDate: string;
  status: "AVAILABLE" | "OFFER_RECEIVED" | "SOLD";
  matchedCompanyBuyer?: string;
}
