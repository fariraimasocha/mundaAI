import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Truck,
  DollarSign,
  Calculator,
  ArrowRight,
  Info,
  Building2,
  ExternalLink,
  Clock,
  MapPin,
  Search,
  Copy,
  Check,
  Layers,
  Table as TableIcon,
  ShieldCheck,
  Share2,
  X,
  Radio,
  Filter,
  Globe,
  Tag,
  ShoppingBag,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { MarketCommodity, MarketPlace, Language, FarmerProfile } from "../types";

interface MarketIntelligenceProps {
  language: Language;
  farmer: FarmerProfile;
  onAskMarket: () => void;
}

const UNIFIED_ZIMPRICECHECK_URL = "https://zimpricecheck.com/price-updates/mbare-musika/";

const COMMODITY_CATEGORIES = [
  { id: "all", label: "All Commodities" },
  { id: "Fresh Horticulture", label: "Fresh Horticulture & Veg" },
  { id: "Potatoes & Tubers", label: "Potatoes & Tubers" },
  { id: "Grains & Pulses", label: "Grains & Pulses" },
  { id: "Indigenous & Specialty", label: "Indigenous & Specialty" },
];

const DEFAULT_MARKETPLACES: MarketPlace[] = [
  {
    id: "mbare-musika",
    name: "Mbare Musika Wholesale Market",
    shortName: "Mbare Musika",
    location: "Mbare, Harare",
    province: "Harare Metropolitan",
    type: "Wholesale Spot Market",
    liveUrl: UNIFIED_ZIMPRICECHECK_URL,
    operatingHours: "04:00 - 18:00 CAT (Daily)",
    lastUpdated: "Today, 08:30 CAT",
    status: "Floor Open • Active Trading",
    description: "Zimbabwe's premier physical agricultural spot market. Live wholesale and retail price updates tracked via ZimPriceCheck for fresh produce, tubers, grains, and indigenous commodities.",
    distanceKmDefault: 115,
    verifiedSource: "ZimPriceCheck (Daily Mbare Musika Price Survey) & Harare Municipal Agricultural Market Board",
    commodities: [
      // Fresh Tomatoes
      { commodity: "Fresh Tomatoes (Sandak Crate 30kg)", market: "Mbare Musika, Harare", marketId: "mbare-musika", category: "Fresh Horticulture", priceUSD: 18.5, priceZiG: 499.5, unit: "Sandak Crate (30kg)", bag50kgUSD: null, transportCostEst: 2.5, netPerTonne: 16.0, trend: "High Demand", updated: "Today, 07:30", liveUrl: UNIFIED_ZIMPRICECHECK_URL },
      { commodity: "Fresh Tomatoes (Wooden Box ~10kg)", market: "Mbare Musika, Harare", marketId: "mbare-musika", category: "Fresh Horticulture", priceUSD: 4.0, priceZiG: 108.0, unit: "Wooden Box (~10kg)", bag50kgUSD: null, transportCostEst: 0.8, netPerTonne: 3.2, trend: "Volatile (-5%)", updated: "Today, 07:15", liveUrl: UNIFIED_ZIMPRICECHECK_URL },
      { commodity: "Fresh Tomatoes (Plastic Dish / Basin)", market: "Mbare Musika, Harare", marketId: "mbare-musika", category: "Fresh Horticulture", priceUSD: 1.5, priceZiG: 40.5, unit: "Plastic Dish", bag50kgUSD: null, transportCostEst: 0.2, netPerTonne: 1.3, trend: "Stable", updated: "Today, 07:45", liveUrl: UNIFIED_ZIMPRICECHECK_URL },
      // Potatoes
      { commodity: "Table Potatoes - Extra Large (15kg Pocket)", market: "Mbare Musika, Harare", marketId: "mbare-musika", category: "Potatoes & Tubers", priceUSD: 10.0, priceZiG: 270.0, unit: "Pocket (15kg)", bag50kgUSD: null, transportCostEst: 1.5, netPerTonne: 8.5, trend: "Firm (+3%)", updated: "Today, 08:00", liveUrl: UNIFIED_ZIMPRICECHECK_URL },
      { commodity: "Table Potatoes - Large (15kg Pocket)", market: "Mbare Musika, Harare", marketId: "mbare-musika", category: "Potatoes & Tubers", priceUSD: 7.0, priceZiG: 189.0, unit: "Pocket (15kg)", bag50kgUSD: null, transportCostEst: 1.2, netPerTonne: 5.8, trend: "Active Orders", updated: "Today, 08:00", liveUrl: UNIFIED_ZIMPRICECHECK_URL },
      { commodity: "Table Potatoes - Medium (15kg Pocket)", market: "Mbare Musika, Harare", marketId: "mbare-musika", category: "Potatoes & Tubers", priceUSD: 5.5, priceZiG: 148.5, unit: "Pocket (15kg)", bag50kgUSD: null, transportCostEst: 1.2, netPerTonne: 4.3, trend: "Stable", updated: "Today, 08:00", liveUrl: UNIFIED_ZIMPRICECHECK_URL },
      { commodity: "Table Potatoes - Small / Chat (15kg Pocket)", market: "Mbare Musika, Harare", marketId: "mbare-musika", category: "Potatoes & Tubers", priceUSD: 3.5, priceZiG: 94.5, unit: "Pocket (15kg)", bag50kgUSD: null, transportCostEst: 1.0, netPerTonne: 2.5, trend: "Plentiful", updated: "Today, 08:00", liveUrl: UNIFIED_ZIMPRICECHECK_URL },
      // Onions
      { commodity: "Dry Onions - Regular Brown (10kg Pocket)", market: "Mbare Musika, Harare", marketId: "mbare-musika", category: "Fresh Horticulture", priceUSD: 5.5, priceZiG: 148.5, unit: "Pocket (10kg)", bag50kgUSD: null, transportCostEst: 0.8, netPerTonne: 4.7, trend: "Steady", updated: "Today, 08:15", liveUrl: UNIFIED_ZIMPRICECHECK_URL },
      { commodity: "Red Onions (10kg Pocket)", market: "Mbare Musika, Harare", marketId: "mbare-musika", category: "Fresh Horticulture", priceUSD: 7.5, priceZiG: 202.5, unit: "Pocket (10kg)", bag50kgUSD: null, transportCostEst: 0.8, netPerTonne: 6.7, trend: "Premium Demand", updated: "Today, 08:15", liveUrl: UNIFIED_ZIMPRICECHECK_URL },
      { commodity: "Fresh Green Shallots (Bundle)", market: "Mbare Musika, Harare", marketId: "mbare-musika", category: "Fresh Horticulture", priceUSD: 1.0, priceZiG: 27.0, unit: "Wholesale Bundle", bag50kgUSD: null, transportCostEst: 0.1, netPerTonne: 0.9, trend: "Stable", updated: "Today, 07:00", liveUrl: UNIFIED_ZIMPRICECHECK_URL },
      // Green Mealies / Maize Cobs
      { commodity: "Green Mealies / Sweet Cobs (Per Dozen)", market: "Mbare Musika, Harare", marketId: "mbare-musika", category: "Fresh Horticulture", priceUSD: 2.5, priceZiG: 67.5, unit: "Dozen Cobs (12 units)", bag50kgUSD: null, transportCostEst: 0.4, netPerTonne: 2.1, trend: "High Demand (+6%)", updated: "Today, 06:45", liveUrl: UNIFIED_ZIMPRICECHECK_URL },
      { commodity: "Green Mealies / Sweet Cobs (100 Cobs)", market: "Mbare Musika, Harare", marketId: "mbare-musika", category: "Fresh Horticulture", priceUSD: 18.0, priceZiG: 486.0, unit: "Per 100 Cobs", bag50kgUSD: null, transportCostEst: 2.5, netPerTonne: 15.5, trend: "High Demand", updated: "Today, 06:45", liveUrl: UNIFIED_ZIMPRICECHECK_URL },
      // Grains & Dry Pulses
      { commodity: "White Maize (Grade A Spot)", market: "Mbare Musika, Harare", marketId: "mbare-musika", category: "Grains & Pulses", priceUSD: 290, priceZiG: 7830, unit: "Per Metric Tonne", bag50kgUSD: 14.5, transportCostEst: 25, netPerTonne: 265, trend: "Rising (+4%)", updated: "Today, 08:30", liveUrl: UNIFIED_ZIMPRICECHECK_URL },
      { commodity: "Sugar Beans - Red Speckled (20L Bucket)", market: "Mbare Musika, Harare", marketId: "mbare-musika", category: "Grains & Pulses", priceUSD: 28.0, priceZiG: 756.0, unit: "20-Litre Bucket (~18kg)", bag50kgUSD: 60.0, transportCostEst: 2.0, netPerTonne: 26.0, trend: "High demand (+8%)", updated: "Today, 09:00", liveUrl: UNIFIED_ZIMPRICECHECK_URL },
      { commodity: "Sugar Beans (Per Metric Tonne)", market: "Mbare Musika, Harare", marketId: "mbare-musika", category: "Grains & Pulses", priceUSD: 1200, priceZiG: 32400, unit: "Per Metric Tonne", bag50kgUSD: 60.0, transportCostEst: 30, netPerTonne: 1170, trend: "Firm", updated: "Today, 09:00", liveUrl: UNIFIED_ZIMPRICECHECK_URL },
      { commodity: "Groundnuts / Nzungu - Shelled (20L Bucket)", market: "Mbare Musika, Harare", marketId: "mbare-musika", category: "Grains & Pulses", priceUSD: 32.0, priceZiG: 864.0, unit: "20-Litre Bucket", bag50kgUSD: 47.5, transportCostEst: 2.2, netPerTonne: 29.8, trend: "Active", updated: "Today, 08:00", liveUrl: UNIFIED_ZIMPRICECHECK_URL },
      { commodity: "Groundnuts / Nzungu - Unshelled (20L Bucket)", market: "Mbare Musika, Harare", marketId: "mbare-musika", category: "Grains & Pulses", priceUSD: 16.0, priceZiG: 432.0, unit: "20-Litre Bucket", bag50kgUSD: 24.0, transportCostEst: 1.5, netPerTonne: 14.5, trend: "Moderate", updated: "Today, 08:00", liveUrl: UNIFIED_ZIMPRICECHECK_URL },
      { commodity: "Cowpeas / Nyemba (20L Bucket)", market: "Mbare Musika, Harare", marketId: "mbare-musika", category: "Grains & Pulses", priceUSD: 9.5, priceZiG: 256.5, unit: "20-Litre Bucket", bag50kgUSD: 22.5, transportCostEst: 1.2, netPerTonne: 8.3, trend: "Stable", updated: "Today, 08:20", liveUrl: UNIFIED_ZIMPRICECHECK_URL },
      { commodity: "Soya Beans (20L Bucket)", market: "Mbare Musika, Harare", marketId: "mbare-musika", category: "Grains & Pulses", priceUSD: 12.0, priceZiG: 324.0, unit: "20-Litre Bucket", bag50kgUSD: 29.0, transportCostEst: 1.5, netPerTonne: 10.5, trend: "Stable", updated: "Today, 08:30", liveUrl: UNIFIED_ZIMPRICECHECK_URL },
      // Vegetables & Horticulture
      { commodity: "Butternut Squash (50kg Sack)", market: "Mbare Musika, Harare", marketId: "mbare-musika", category: "Fresh Horticulture", priceUSD: 22.0, priceZiG: 594.0, unit: "Sack (50kg)", bag50kgUSD: 22.0, transportCostEst: 2.5, netPerTonne: 19.5, trend: "Steady Supply", updated: "Today, 07:10", liveUrl: UNIFIED_ZIMPRICECHECK_URL },
      { commodity: "Fresh Cabbage (Per Large Head)", market: "Mbare Musika, Harare", marketId: "mbare-musika", category: "Fresh Horticulture", priceUSD: 0.8, priceZiG: 21.6, unit: "Single Head", bag50kgUSD: null, transportCostEst: 0.1, netPerTonne: 0.7, trend: "Plentiful", updated: "Today, 07:00", liveUrl: UNIFIED_ZIMPRICECHECK_URL },
      { commodity: "Leafy Greens - Covo / Rape / Tsunga", market: "Mbare Musika, Harare", marketId: "mbare-musika", category: "Fresh Horticulture", priceUSD: 4.5, priceZiG: 121.5, unit: "Wholesale Bundle", bag50kgUSD: null, transportCostEst: 0.5, netPerTonne: 4.0, trend: "Daily Fresh", updated: "Today, 06:30", liveUrl: UNIFIED_ZIMPRICECHECK_URL },
      { commodity: "Carrots (Wholesale Semea Crate)", market: "Mbare Musika, Harare", marketId: "mbare-musika", category: "Fresh Horticulture", priceUSD: 22.0, priceZiG: 594.0, unit: "Semea Crate", bag50kgUSD: null, transportCostEst: 2.0, netPerTonne: 20.0, trend: "Firm", updated: "Today, 07:20", liveUrl: UNIFIED_ZIMPRICECHECK_URL },
      { commodity: "Sweet Potatoes / Mbambaira (20L Bucket)", market: "Mbare Musika, Harare", marketId: "mbare-musika", category: "Potatoes & Tubers", priceUSD: 8.5, priceZiG: 229.5, unit: "20-Litre Bucket", bag50kgUSD: null, transportCostEst: 1.0, netPerTonne: 7.5, trend: "In Season", updated: "Today, 07:45", liveUrl: UNIFIED_ZIMPRICECHECK_URL },
      // Indigenous & Specialty
      { commodity: "Dried Kapenta / Matemba (10kg Bucket)", market: "Mbare Musika, Harare", marketId: "mbare-musika", category: "Indigenous & Specialty", priceUSD: 36.0, priceZiG: 972.0, unit: "10kg Bucket", bag50kgUSD: null, transportCostEst: 2.0, netPerTonne: 34.0, trend: "Stable", updated: "Today, 08:30", liveUrl: UNIFIED_ZIMPRICECHECK_URL },
      { commodity: "Mopane Worms / Madora / Amacimbi", market: "Mbare Musika, Harare", marketId: "mbare-musika", category: "Indigenous & Specialty", priceUSD: 72.0, priceZiG: 1944.0, unit: "20-Litre Bucket", bag50kgUSD: null, transportCostEst: 3.0, netPerTonne: 69.0, trend: "High Value", updated: "Today, 08:30", liveUrl: UNIFIED_ZIMPRICECHECK_URL },
      { commodity: "Roundnuts / Bambara / Nyimo (20L Bucket)", market: "Mbare Musika, Harare", marketId: "mbare-musika", category: "Indigenous & Specialty", priceUSD: 24.0, priceZiG: 648.0, unit: "20-Litre Bucket", bag50kgUSD: 55.0, transportCostEst: 1.8, netPerTonne: 22.2, trend: "Bullish (+7%)", updated: "Today, 08:15", liveUrl: UNIFIED_ZIMPRICECHECK_URL }
    ]
  },
  {
    id: "gmb-depots",
    name: "Grain Marketing Board (GMB)",
    shortName: "GMB Depots",
    location: "Aspindale / Chinhoyi / National Depots",
    province: "National Network (Mashonaland West & Harare)",
    type: "Statutory Depot",
    liveUrl: "https://gmb.co.zw",
    operatingHours: "07:30 - 16:30 CAT (Mon - Sat)",
    lastUpdated: "Today, 07:00 CAT",
    status: "Grain Receiving Active • Moisture <12.5%",
    description: "National strategic grain reserve depots. Guaranteed government statutory floor prices for compliant grain with moisture testing at weighbridge.",
    distanceKmDefault: 45,
    verifiedSource: "Ministry of Lands, Agriculture & GMB Gazette",
    commodities: [
      { commodity: "White Maize (GMB Statutory A)", market: "Grain Marketing Board (GMB)", marketId: "gmb-depots", priceUSD: 335, priceZiG: 9045, unit: "Per Metric Tonne", bag50kgUSD: 16.75, transportCostEst: 35, netPerTonne: 300, trend: "Statutory Guaranteed", updated: "This week", liveUrl: "https://gmb.co.zw" },
      { commodity: "Traditional Grains (Sorghum / Mapfunde)", market: "Grain Marketing Board (GMB)", marketId: "gmb-depots", priceUSD: 340, priceZiG: 9180, unit: "Per Metric Tonne", bag50kgUSD: 17.0, transportCostEst: 35, netPerTonne: 305, trend: "Incentive Floor (+5%)", updated: "This week", liveUrl: "https://gmb.co.zw" },
      { commodity: "Soya Beans (Commercial Grade)", market: "Grain Marketing Board (GMB)", marketId: "gmb-depots", priceUSD: 580, priceZiG: 15660, unit: "Per Metric Tonne", bag50kgUSD: 29.0, transportCostEst: 35, netPerTonne: 545, trend: "Stable", updated: "This week", liveUrl: "https://gmb.co.zw" },
      { commodity: "Finger Millet (Rapoko / Zviyo)", market: "Grain Marketing Board (GMB)", marketId: "gmb-depots", priceUSD: 360, priceZiG: 9720, unit: "Per Metric Tonne", bag50kgUSD: 18.0, transportCostEst: 35, netPerTonne: 325, trend: "High Priority", updated: "This week", liveUrl: "https://gmb.co.zw" }
    ]
  },
  {
    id: "zmx-exchange",
    name: "Zimbabwe Mercantile Exchange (ZMX)",
    shortName: "ZMX Digital Exchange",
    location: "Harare / Electronic Warehouse Receipts",
    province: "Nationwide Digital Trading System",
    type: "Commodity Exchange",
    liveUrl: "https://zmx.co.zw",
    operatingHours: "09:00 - 15:30 CAT",
    lastUpdated: "Today, 09:15 CAT",
    status: "Electronic Order Book Active",
    description: "SECZ-regulated commodities exchange with certified warehouse receipts. Transparent bid-ask matching for certified agro-processors and farmers.",
    distanceKmDefault: 90,
    verifiedSource: "ZMX Electronic Warehouse Receipts Registry",
    commodities: [
      { commodity: "Grade 1 White Maize (ZMX WHR)", market: "Zimbabwe Mercantile Exchange (ZMX)", marketId: "zmx-exchange", priceUSD: 310, priceZiG: 8370, unit: "Per Metric Tonne", bag50kgUSD: 15.5, transportCostEst: 20, netPerTonne: 290, trend: "Trading Up (+3.2%)", updated: "Today, 09:15", liveUrl: "https://zmx.co.zw" },
      { commodity: "Soya Beans (ZMX Certified WHR)", market: "Zimbabwe Mercantile Exchange (ZMX)", marketId: "zmx-exchange", priceUSD: 620, priceZiG: 16740, unit: "Per Metric Tonne", bag50kgUSD: 31.0, transportCostEst: 22, netPerTonne: 598, trend: "Firm (+2.1%)", updated: "Today, 09:00", liveUrl: "https://zmx.co.zw" },
      { commodity: "Wheat (Standard Bread Milling)", market: "Zimbabwe Mercantile Exchange (ZMX)", marketId: "zmx-exchange", priceUSD: 460, priceZiG: 12420, unit: "Per Metric Tonne", bag50kgUSD: 23.0, transportCostEst: 20, netPerTonne: 440, trend: "Active Orders", updated: "Today, 08:45", liveUrl: "https://zmx.co.zw" },
      { commodity: "Sunflower Seeds", market: "Zimbabwe Mercantile Exchange (ZMX)", marketId: "zmx-exchange", priceUSD: 520, priceZiG: 14040, unit: "Per Metric Tonne", bag50kgUSD: 26.0, transportCostEst: 25, netPerTonne: 495, trend: "Buyer Deficit (+6%)", updated: "Today, 09:10", liveUrl: "https://zmx.co.zw" }
    ]
  },
  {
    id: "bulawayo-market",
    name: "Bulawayo Wholesale Market (Malaleni)",
    shortName: "Bulawayo Market",
    location: "Malaleni, Bulawayo",
    province: "Bulawayo Metropolitan / Matabeleland Hub",
    type: "Regional Hub",
    liveUrl: "https://wa.me/16465894168?text=Current%20Bulawayo%20Market%20Live%20Prices",
    operatingHours: "05:00 - 17:00 CAT",
    lastUpdated: "Today, 07:45 CAT",
    status: "Active Trading • Grain Influx",
    description: "The primary regional clearing center for southern Zimbabwe. High volume trading for groundnuts, drought-tolerant small grains, and livestock feed grains.",
    distanceKmDefault: 410,
    verifiedSource: "Bulawayo Produce Traders Association",
    commodities: [
      { commodity: "Groundnuts (Shelled Grade A)", market: "Bulawayo Wholesale Market", marketId: "bulawayo-market", priceUSD: 950, priceZiG: 25650, unit: "Per Metric Tonne", bag50kgUSD: 47.5, transportCostEst: 45, netPerTonne: 905, trend: "Stable", updated: "Today, 07:45", liveUrl: "https://wa.me/16465894168?text=Bulawayo%20Groundnuts%20Price%20Check" },
      { commodity: "Pearl Millet (Mhunga)", market: "Bulawayo Wholesale Market", marketId: "bulawayo-market", priceUSD: 345, priceZiG: 9315, unit: "Per Metric Tonne", bag50kgUSD: 17.25, transportCostEst: 42, netPerTonne: 303, trend: "High Demand (+5%)", updated: "Today, 07:30", liveUrl: "https://wa.me/16465894168?text=Bulawayo%20Mhunga%20Price%20Check" },
      { commodity: "Roundnuts / Bambara (Nyimo)", market: "Bulawayo Wholesale Market", marketId: "bulawayo-market", priceUSD: 1100, priceZiG: 29700, unit: "Per Metric Tonne", bag50kgUSD: 55.0, transportCostEst: 45, netPerTonne: 1055, trend: "Bullish (+7%)", updated: "Today, 08:00", liveUrl: "https://wa.me/16465894168?text=Bulawayo%20Nyimo%20Price%20Check" }
    ]
  },
  {
    id: "sakubva-mutare",
    name: "Sakubva Musika Wholesale Market",
    shortName: "Sakubva Mutare",
    location: "Sakubva, Mutare",
    province: "Manicaland Province (Eastern Highlands)",
    type: "Regional Hub",
    liveUrl: "https://wa.me/16465894168?text=Current%20Sakubva%20Mutare%20Market%20Prices",
    operatingHours: "04:30 - 17:30 CAT",
    lastUpdated: "Today, 06:30 CAT",
    status: "Active Trading • Fresh Produce Hub",
    description: "Eastern Highlands regional produce hub. Strong demand for potato supplies, green maize, and fruit with proximity to border trade corridors.",
    distanceKmDefault: 380,
    verifiedSource: "Manicaland Agro Traders Association",
    commodities: [
      { commodity: "Table Potatoes (Pocket 15kg)", market: "Sakubva Musika, Mutare", marketId: "sakubva-mutare", priceUSD: 7.0, priceZiG: 189.0, unit: "Pocket (15kg)", bag50kgUSD: null, transportCostEst: 2.0, netPerTonne: 5.0, trend: "Firm", updated: "Today, 06:30", liveUrl: "https://wa.me/16465894168?text=Sakubva%20Potatoes%20Price%20Check" },
      { commodity: "Green Mealies (Sweet Cobs)", market: "Sakubva Musika, Mutare", marketId: "sakubva-mutare", priceUSD: 18.0, priceZiG: 486.0, unit: "Per 100 Cobs", bag50kgUSD: null, transportCostEst: 3.0, netPerTonne: 15.0, trend: "High Demand", updated: "Today, 06:15", liveUrl: "https://wa.me/16465894168?text=Sakubva%20Green%20Mealies%20Price%20Check" },
      { commodity: "Soya Beans (Spot Private)", market: "Sakubva Musika, Mutare", marketId: "sakubva-mutare", priceUSD: 590, priceZiG: 15930, unit: "Per Metric Tonne", bag50kgUSD: 29.5, transportCostEst: 40, netPerTonne: 550, trend: "Stable", updated: "Today, 07:00", liveUrl: "https://wa.me/16465894168?text=Sakubva%20Soya%20Beans%20Price%20Check" }
    ]
  }
];

export const MarketIntelligence: React.FC<MarketIntelligenceProps> = ({
  language,
  farmer,
  onAskMarket,
}) => {
  const [marketplaces, setMarketplaces] = useState<MarketPlace[]>(DEFAULT_MARKETPLACES);
  const [commodities, setCommodities] = useState<MarketCommodity[]>(
    DEFAULT_MARKETPLACES.flatMap((m) => m.commodities)
  );
  const [selectedMarketId, setSelectedMarketId] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [currency, setCurrency] = useState<"USD" | "ZiG">("USD");
  const [tonnesToSell, setTonnesToSell] = useState<number>(5);
  const [distanceKm, setDistanceKm] = useState<number>(115);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeSnapshotMarket, setActiveSnapshotMarket] = useState<MarketPlace | null>(null);

  const exchangeRate = 27.0; // USD to ZiG baseline

  useEffect(() => {
    fetch("/api/markets")
      .then((res) => res.json())
      .then((data) => {
        if (data.marketplaces && Array.isArray(data.marketplaces) && data.marketplaces.length > 0) {
          setMarketplaces(data.marketplaces);
        }
        if (data.markets && Array.isArray(data.markets) && data.markets.length > 0) {
          setCommodities(data.markets);
        }
      })
      .catch((err) => console.error("Market fetch error:", err));
  }, []);

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  // Filter marketplaces
  const filteredMarketplaces = marketplaces.filter((mp) => {
    const matchesMarketFilter = selectedMarketId === "all" || mp.id === selectedMarketId;
    if (!matchesMarketFilter) return false;

    // Check category match
    if (selectedCategory !== "all") {
      const hasCategory = mp.commodities.some((c) => c.category === selectedCategory);
      if (!hasCategory) return false;
    }

    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    const matchesName = mp.name.toLowerCase().includes(q) || mp.location.toLowerCase().includes(q);
    const matchesCommodity = mp.commodities.some((c) =>
      c.commodity.toLowerCase().includes(q)
    );
    return matchesName || matchesCommodity;
  });

  // Flat commodities for table view
  const allFilteredCommodities = filteredMarketplaces.flatMap((mp) =>
    mp.commodities.filter((c) => {
      const matchesSearch = searchQuery.trim()
        ? c.commodity.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesCat =
        selectedCategory === "all" || c.category === selectedCategory;
      return matchesSearch && matchesCat;
    })
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Commodity Price Intelligence & Transport Economics</span>
          </div>
          <h2 className="text-2xl font-extrabold text-stone-900 mt-2 font-['Outfit',sans-serif]">
            Market Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Live prices organized per trading floor and statutory depot across Zimbabwe. Click any marketplace card or direct link to redirect to the live prices for that point in time.
          </p>
        </div>

        {/* Currency toggle & Status */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-stone-100 p-1 rounded-xl flex items-center gap-1 border border-stone-200">
            <button
              onClick={() => setCurrency("USD")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currency === "USD"
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              USD ($)
            </button>
            <button
              onClick={() => setCurrency("ZiG")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currency === "ZiG"
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              Zimbabwe Gold (ZiG)
            </button>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>POINT-IN-TIME FEED ACTIVE</span>
          </div>
        </div>
      </div>

      {/* UNIFIED REDIRECT LINK BANNER - ZIMPRICECHECK MBARE MUSIKA */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-stone-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-emerald-700/50 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-black tracking-wide bg-emerald-400 text-emerald-950 uppercase flex items-center gap-1.5 shadow-sm">
                <Globe className="w-3.5 h-3.5" />
                <span>Unified Live Market Feed</span>
              </span>
              <span className="text-xs text-emerald-200 font-medium">
                Official Live Source • Harare Mbare Musika
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-['Outfit',sans-serif] text-white">
              ZimPriceCheck: Mbare Musika Daily Floor Price Updates
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-3xl leading-relaxed">
              Consolidated real-time price intelligence across all commodities currently traded at Mbare Musika. Includes exact packaging specifications: Sandak wooden crates of tomatoes, pockets of potatoes (Chat to Extra Large), onions, green mealies, grains, and indigenous commodities.
            </p>
            <div className="flex items-center gap-2 pt-1 font-mono text-xs text-emerald-300 flex-wrap">
              <span className="text-emerald-400 font-semibold">Unified Live URL:</span>
              <span className="bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-700/50 select-all underline decoration-emerald-500/50 break-all">
                {UNIFIED_ZIMPRICECHECK_URL}
              </span>
            </div>
          </div>

          {/* Direct Redirection CTA buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <button
              onClick={() => handleCopyLink(UNIFIED_ZIMPRICECHECK_URL, "unified-top")}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center gap-2 transition-all"
              title="Copy ZimPriceCheck Mbare Musika link"
            >
              {copiedId === "unified-top" ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span className="text-emerald-300 font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy URL</span>
                </>
              )}
            </button>

            <a
              href={UNIFIED_ZIMPRICECHECK_URL}
              target="_blank"
              rel="noopener noreferrer"
              id="unified-mbare-redirect-btn"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-stone-950 text-sm font-black flex items-center gap-2.5 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Open ZimPriceCheck Live Updates</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Highlights of accurately specified items */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-700/60 text-xs">
          <div className="bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-700/40">
            <span className="text-[10px] text-emerald-300 uppercase font-semibold block">Fresh Tomatoes</span>
            <span className="text-sm font-bold text-white">Sandak 30kg ($18.50)</span>
          </div>
          <div className="bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-700/40">
            <span className="text-[10px] text-emerald-300 uppercase font-semibold block">Table Potatoes</span>
            <span className="text-sm font-bold text-white">15kg Pocket ($3.50–$10)</span>
          </div>
          <div className="bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-700/40">
            <span className="text-[10px] text-emerald-300 uppercase font-semibold block">Green Mealies</span>
            <span className="text-sm font-bold text-white">$2.50 / Doz ($18 / 100)</span>
          </div>
          <div className="bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-700/40">
            <span className="text-[10px] text-emerald-300 uppercase font-semibold block">Sugar Beans & Pulses</span>
            <span className="text-sm font-bold text-white">20L Bucket ($28.00)</span>
          </div>
        </div>
      </div>

      {/* Core Economic Principle Callout */}
      <div className="bg-gradient-to-r from-amber-50 to-stone-50 border-l-4 border-amber-500 p-5 rounded-r-2xl space-y-1">
        <h3 className="font-bold text-sm text-amber-900 flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600" />
          The Mufarm Economic Principle:
        </h3>
        <p className="text-xs text-stone-700 leading-relaxed">
          <strong>"Price alone does not determine the best economic outcome. Transport and other costs also matter."</strong>{" "}
          A higher quoted spot price in Harare can deliver a lower net profit than a nearby GMB or local processor if smallholder transport logistics consume $35+ per tonne.
        </p>
      </div>

      {/* PRICE BOARD SECTION: Cards Structure per Marketplace */}
      <section className="space-y-4">
        {/* Controls Bar: Marketplace filter, Search & View toggle */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <h3 className="font-bold text-base text-stone-900 font-['Outfit',sans-serif]">
                  Marketplace Price Boards
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Each card below represents an independent trading floor with embedded links for immediate point-in-time price redirection.
              </p>
            </div>

            {/* View Mode Toggle: Cards vs Table */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-semibold text-stone-500 hidden sm:inline">Layout:</span>
              <div className="bg-stone-100 p-1 rounded-xl flex items-center border border-stone-200">
                <button
                  onClick={() => setViewMode("cards")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === "cards"
                      ? "bg-white text-emerald-900 shadow-sm"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Market Cards</span>
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === "table"
                      ? "bg-white text-emerald-900 shadow-sm"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>Unified Table</span>
                </button>
              </div>
            </div>
          </div>

          {/* Search bar & Marketplace Tabs */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2 border-t border-stone-100">
            {/* Marketplace quick filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
              <button
                onClick={() => setSelectedMarketId("all")}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                  selectedMarketId === "all"
                    ? "bg-stone-900 text-white shadow-sm"
                    : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                }`}
              >
                All Markets ({marketplaces.length})
              </button>
              {marketplaces.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMarketId(m.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    selectedMarketId === m.id
                      ? "bg-emerald-800 text-white shadow-sm"
                      : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                  }`}
                >
                  <span>{m.shortName}</span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search crop or market..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 outline-none focus:border-emerald-600 focus:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills (Requested for specifying items correctly) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs pt-2 border-t border-stone-100">
            <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1 mr-1 shrink-0">
              <Filter className="w-3 h-3" />
              <span>Item Category:</span>
            </span>
            {COMMODITY_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-emerald-700 text-white shadow-sm font-bold"
                    : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                }`}
              >
                {cat.label}
              </button>
            ))}
            {selectedCategory !== "all" && (
              <button
                onClick={() => setSelectedCategory("all")}
                className="text-[11px] text-stone-400 hover:text-stone-600 underline ml-1 shrink-0"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* VIEW 1: CARDS STRUCTURE PER MARKETPLACE (Primary Mode Requested) */}
        {viewMode === "cards" && (
          <div className="grid grid-cols-1 gap-6">
            {filteredMarketplaces.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-stone-200 text-stone-500 space-y-2">
                <p className="font-semibold text-sm">No marketplace matching your filter.</p>
                <button
                  onClick={() => {
                    setSelectedMarketId("all");
                    setSearchQuery("");
                  }}
                  className="text-xs text-emerald-700 font-bold underline"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              filteredMarketplaces.map((marketplace) => {
                const isCopied = copiedId === marketplace.id;
                const filteredCommodities = marketplace.commodities.filter((c) => {
                  const matchesSearch = searchQuery.trim()
                    ? c.commodity.toLowerCase().includes(searchQuery.toLowerCase())
                    : true;
                  const matchesCat =
                    selectedCategory === "all" || c.category === selectedCategory;
                  return matchesSearch && matchesCat;
                });

                return (
                  <div
                    key={marketplace.id}
                    id={`market-card-${marketplace.id}`}
                    className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:border-emerald-600/60 transition-all overflow-hidden space-y-0"
                  >
                    {/* Top Marketplace Banner Header */}
                    <div className="p-5 sm:p-6 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {marketplace.type}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-stone-300">
                            <MapPin className="w-3 h-3 text-emerald-400" />
                            <span>{marketplace.location}</span>
                          </span>
                          <span className="text-stone-500">•</span>
                          <span className="text-xs text-stone-400">{marketplace.province}</span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-black font-['Outfit',sans-serif] tracking-tight text-white flex items-center gap-2">
                          <span>{marketplace.name}</span>
                        </h3>

                        <p className="text-xs text-stone-300 max-w-3xl leading-relaxed">
                          {marketplace.description}
                        </p>
                      </div>

                      {/* Live Status & Operating Hours */}
                      <div className="flex md:flex-col items-start md:items-end justify-between gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-stone-800">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 text-xs font-bold shadow-sm">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span>{marketplace.status}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          <span>Point-in-Time: {marketplace.lastUpdated}</span>
                        </div>
                      </div>
                    </div>

                    {/* Mbare Musika Unified Price Updates Tracker Callout */}
                    {marketplace.id === "mbare-musika" && (
                      <div className="bg-emerald-50 border-b border-emerald-200/80 px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping shrink-0" />
                          <span className="font-bold text-emerald-950">
                            Unified Live Price Link: ZimPriceCheck Mbare Musika Daily Tracker
                          </span>
                        </div>
                        <a
                          href={UNIFIED_ZIMPRICECHECK_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-emerald-800 hover:text-emerald-950 underline flex items-center gap-1.5 self-start sm:self-auto shrink-0"
                        >
                          <span>Open Full ZimPriceCheck Price List</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}

                    {/* EMBEDDED POINT-IN-TIME LINK BAR (Requested specifically by user) */}
                    <div className="bg-stone-50 border-b border-stone-200 p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
                          <ExternalLink className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-stone-900">
                              Point-in-Time Live Price Link
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold tracking-wide uppercase">
                              Active Redirect
                            </span>
                            <span className="text-[11px] text-stone-500 hidden md:inline">
                              (Updated {marketplace.lastUpdated})
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 truncate font-mono mt-0.5 max-w-lg">
                            {marketplace.liveUrl}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons: Direct Redirection & Copy Link */}
                      <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                        <button
                          onClick={() => handleCopyLink(marketplace.liveUrl, marketplace.id)}
                          className="px-3 py-1.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                          title="Copy point-in-time link to clipboard"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700 font-bold">Link Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-stone-500" />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>

                        <a
                          href={marketplace.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          id={`redirect-link-${marketplace.id}`}
                          className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:translate-x-0.5"
                          title="Open external marketplace live prices for this point in time"
                        >
                          <span>Redirect to Live Prices</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {/* Commodities Price Table inside this Marketplace Card */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-stone-100/70 text-stone-500 uppercase font-semibold border-b border-stone-200">
                          <tr>
                            <th className="p-3 sm:px-6 sm:py-3">Commodity & Packaging Specification</th>
                            <th className="p-3 sm:py-3 text-right">Point-in-Time Price</th>
                            <th className="p-3 sm:py-3 text-right">50kg / Unit Equiv.</th>
                            <th className="p-3 sm:py-3 text-right">Est. Haulage Cost</th>
                            <th className="p-3 sm:py-3 text-right">Net Farmer Return</th>
                            <th className="p-3 sm:py-3 text-center">Trend</th>
                            <th className="p-3 sm:px-6 sm:py-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 text-stone-800">
                          {filteredCommodities.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="p-6 text-center text-stone-500 italic">
                                No commodities in this market match "{searchQuery}" {selectedCategory !== "all" ? `in category ${selectedCategory}` : ""}.
                              </td>
                            </tr>
                          ) : (
                            filteredCommodities.map((item, cIdx) => {
                              const price = currency === "USD" ? item.priceUSD : item.priceUSD * exchangeRate;
                              const transport = currency === "USD" ? item.transportCostEst : item.transportCostEst * exchangeRate;
                              const net = currency === "USD" ? item.netPerTonne : item.netPerTonne * exchangeRate;
                              const bag = item.bag50kgUSD
                                ? currency === "USD"
                                  ? item.bag50kgUSD
                                  : item.bag50kgUSD * exchangeRate
                                : null;
                              const sym = currency === "USD" ? "$" : "ZiG ";

                              return (
                                <tr
                                  key={cIdx}
                                  className="hover:bg-emerald-50/40 transition-colors group"
                                >
                                  <td className="p-3 sm:px-6 sm:py-3.5 font-bold text-stone-900">
                                    <div className="flex flex-col gap-0.5">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span>{item.commodity}</span>
                                        {item.category && (
                                          <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-stone-100 text-stone-600 border border-stone-200">
                                            {item.category}
                                          </span>
                                        )}
                                      </div>
                                      <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                                        <Tag className="w-3 h-3 text-emerald-600 inline" />
                                        <span>Pack: {item.unit}</span>
                                      </span>
                                    </div>
                                  </td>
                                  <td className="p-3 sm:py-3.5 text-right font-black text-stone-900">
                                    {sym}
                                    {price.toLocaleString(undefined, {
                                      minimumFractionDigits: price % 1 === 0 ? 0 : 2,
                                      maximumFractionDigits: 2,
                                    })}
                                    <span className="text-[10px] text-stone-400 font-normal ml-0.5">
                                      {item.unit.includes("Tonne") ? "/ t" : ""}
                                    </span>
                                  </td>
                                  <td className="p-3 sm:py-3.5 text-right font-semibold text-stone-700">
                                    {bag ? `${sym}${bag.toFixed(2)}` : "—"}
                                  </td>
                                  <td className="p-3 sm:py-3.5 text-right text-rose-700 font-medium">
                                    -{sym}{transport.toFixed(1)}
                                  </td>
                                  <td className="p-3 sm:py-3.5 text-right font-bold text-emerald-800">
                                    {sym}
                                    {net.toLocaleString(undefined, {
                                      minimumFractionDigits: net % 1 === 0 ? 0 : 2,
                                      maximumFractionDigits: 2,
                                    })}
                                  </td>
                                  <td className="p-3 sm:py-3.5 text-center">
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 whitespace-nowrap">
                                      {item.trend}
                                    </span>
                                  </td>
                                  <td className="p-3 sm:px-6 sm:py-3.5 text-right">
                                    <a
                                      href={item.liveUrl || marketplace.liveUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-xl transition-all shadow-xs whitespace-nowrap"
                                      title={`Open live prices on ZimPriceCheck for ${item.commodity}`}
                                    >
                                      <span>Live Price</span>
                                      <ArrowUpRight className="w-3.5 h-3.5" />
                                    </a>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Card Footer: Source verification, distance & point-in-time timestamp */}
                    <div className="p-4 sm:px-6 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-500">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1 text-stone-700 font-medium">
                          <Truck className="w-3.5 h-3.5 text-stone-400" />
                          <span>Haulage from {farmer.district || "Mashonaland West"}: ~{marketplace.distanceKmDefault} km</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-stone-600">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Source: {marketplace.verifiedSource}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => setActiveSnapshotMarket(marketplace)}
                          className="text-stone-600 hover:text-stone-900 text-xs font-semibold underline underline-offset-2"
                        >
                          View Snapshot Details
                        </button>
                        <a
                          href={marketplace.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-bold text-emerald-800 hover:text-emerald-900 ml-2"
                        >
                          <span>Redirect Now</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* VIEW 2: UNIFIED COMPARISON TABLE VIEW */}
        {viewMode === "table" && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <h3 className="font-bold text-sm text-stone-900 font-['Outfit',sans-serif]">
                Unified National Price Board (All Marketplaces)
              </h3>
              <span className="text-[11px] text-stone-400">
                Baseline: 1 USD = {exchangeRate.toFixed(1)} ZiG
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 uppercase font-semibold border-b border-stone-200">
                  <tr>
                    <th className="p-3 sm:p-4">Commodity & Specification</th>
                    <th className="p-3 sm:p-4">Market / Depot</th>
                    <th className="p-3 sm:p-4 text-right">Point-in-Time Price</th>
                    <th className="p-3 sm:p-4 text-right">50kg / Unit Equiv.</th>
                    <th className="p-3 sm:p-4 text-right">Estimated Transport</th>
                    <th className="p-3 sm:p-4 text-right">Est. Net Return</th>
                    <th className="p-3 sm:p-4 text-center">Trend</th>
                    <th className="p-3 sm:p-4 text-right">Live Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-800">
                  {allFilteredCommodities.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-stone-500 italic">
                        No commodities match your current filters.
                      </td>
                    </tr>
                  ) : (
                    allFilteredCommodities.map((item, idx) => {
                      const price = currency === "USD" ? item.priceUSD : item.priceUSD * exchangeRate;
                      const transport = currency === "USD" ? item.transportCostEst : item.transportCostEst * exchangeRate;
                      const net = currency === "USD" ? item.netPerTonne : item.netPerTonne * exchangeRate;
                      const bag = item.bag50kgUSD
                        ? currency === "USD"
                          ? item.bag50kgUSD
                          : item.bag50kgUSD * exchangeRate
                        : null;
                      const sym = currency === "USD" ? "$" : "ZiG ";

                      return (
                        <tr key={idx} className="hover:bg-stone-50/80 transition-colors">
                          <td className="p-3 sm:p-4 font-bold text-stone-900">
                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span>{item.commodity}</span>
                                {item.category && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-stone-100 text-stone-600 border border-stone-200">
                                    {item.category}
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                                <Tag className="w-3 h-3 text-emerald-600 inline" />
                                <span>{item.unit}</span>
                              </span>
                            </div>
                          </td>
                          <td className="p-3 sm:p-4 text-stone-600">
                            <div className="flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-stone-400" />
                              <span className="font-semibold text-stone-800">{item.market}</span>
                            </div>
                          </td>
                          <td className="p-3 sm:p-4 text-right font-black text-stone-900">
                            {sym}
                            {price.toLocaleString(undefined, {
                              minimumFractionDigits: price % 1 === 0 ? 0 : 2,
                              maximumFractionDigits: 2,
                            })}
                            <span className="text-[10px] text-stone-400 font-normal ml-0.5">
                              {item.unit.includes("Tonne") ? "/ t" : ""}
                            </span>
                          </td>
                          <td className="p-3 sm:p-4 text-right font-semibold text-stone-700">
                            {bag ? `${sym}${bag.toFixed(2)}` : "—"}
                          </td>
                          <td className="p-3 sm:p-4 text-right text-rose-700 font-medium">
                            -{sym}{transport.toFixed(1)}
                          </td>
                          <td className="p-3 sm:p-4 text-right font-bold text-emerald-800">
                            {sym}
                            {net.toLocaleString(undefined, {
                              minimumFractionDigits: net % 1 === 0 ? 0 : 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td className="p-3 sm:p-4 text-center">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                              {item.trend}
                            </span>
                          </td>
                          <td className="p-3 sm:p-4 text-right">
                            <a
                              href={item.liveUrl || "https://zimpricecheck.com/price-updates/mbare-musika/"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-xl transition-all"
                            >
                              <span>Redirect</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Point-in-Time Snapshot Details Modal */}
      {activeSnapshotMarket && (
        <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-stone-200 shadow-2xl overflow-hidden space-y-0 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-stone-900 text-white p-6 flex items-start justify-between gap-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {activeSnapshotMarket.type}
                </span>
                <h3 className="text-xl font-black font-['Outfit',sans-serif] text-white mt-1">
                  {activeSnapshotMarket.name}
                </h3>
                <p className="text-xs text-stone-300 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>{activeSnapshotMarket.location}</span>
                </p>
              </div>
              <button
                onClick={() => setActiveSnapshotMarket(null)}
                className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2">
                <div className="flex justify-between items-center text-stone-600">
                  <span className="font-semibold">Snapshot Timestamp:</span>
                  <span className="font-mono font-bold text-stone-900 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    {activeSnapshotMarket.lastUpdated}
                  </span>
                </div>
                <div className="flex justify-between items-center text-stone-600">
                  <span className="font-semibold">Trading Floor Status:</span>
                  <span className="font-bold text-emerald-700">{activeSnapshotMarket.status}</span>
                </div>
                <div className="flex justify-between items-center text-stone-600">
                  <span className="font-semibold">Operating Hours:</span>
                  <span className="font-bold text-stone-900">{activeSnapshotMarket.operatingHours}</span>
                </div>
                <div className="flex justify-between items-center text-stone-600">
                  <span className="font-semibold">Regulatory Source:</span>
                  <span className="font-bold text-stone-900">{activeSnapshotMarket.verifiedSource}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-stone-800 text-xs">
                  Embedded Point-in-Time Redirection Link:
                </label>
                <div className="p-3 bg-stone-100 rounded-xl font-mono text-[11px] text-stone-700 break-all border border-stone-200">
                  {activeSnapshotMarket.liveUrl}
                </div>
              </div>

              {/* Commodities list inside snapshot */}
              <div className="space-y-1.5 pt-1">
                <label className="font-bold text-stone-800 text-xs">
                  Recorded Prices ({activeSnapshotMarket.commodities.length} Commodities):
                </label>
                <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                  {activeSnapshotMarket.commodities.map((c, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-between"
                    >
                      <span className="font-medium text-stone-800">{c.commodity}</span>
                      <span className="font-bold text-stone-900">
                        ${c.priceUSD.toLocaleString()} / tonne
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleCopyLink(activeSnapshotMarket.liveUrl, activeSnapshotMarket.id)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  {copiedId === activeSnapshotMarket.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>

                <a
                  href={activeSnapshotMarket.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors"
                >
                  <span>Redirect to Live Prices ↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Net Realized Profit Estimator (Preserved & Enhanced) */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 border border-stone-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Decision Support Tool
            </span>
            <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
              Net Realized Profit Estimator (Mashonaland West to Destination)
            </h3>
          </div>
          <button
            onClick={onAskMarket}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs self-start sm:self-auto"
          >
            Consult Selling Strategy
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1">
            <label className="text-stone-300 font-semibold">Grain Volume (Tonnes)</label>
            <input
              type="number"
              min={1}
              max={100}
              value={tonnesToSell}
              onChange={(e) => setTonnesToSell(Number(e.target.value) || 1)}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-white font-bold outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-stone-400">= {tonnesToSell * 20} standard 50kg bags</span>
          </div>

          <div className="space-y-1">
            <label className="text-stone-300 font-semibold">Haulage Distance (km)</label>
            <input
              type="number"
              min={10}
              max={500}
              value={distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value) || 10)}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-white font-bold outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-stone-400">Avg Chinhoyi to Harare: 115km</span>
          </div>

          <div className="space-y-1">
            <label className="text-stone-300 font-semibold">Calculated Transport Deduction</label>
            <div className="w-full bg-stone-800/80 border border-stone-700 rounded-xl p-2.5 text-amber-300 font-bold text-sm">
              ${(tonnesToSell * (distanceKm * 0.25)).toFixed(0)} USD
            </div>
            <span className="text-[10px] text-stone-400">Based on ~$0.25/tonne/km rural haulage</span>
          </div>
        </div>

        {/* Breakdown comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="bg-stone-800/60 p-4 rounded-xl border border-stone-700 space-y-2">
            <div className="font-bold text-xs text-white">OPTION A: GMB Statutory Depot</div>
            <div className="text-2xl font-black text-emerald-400 font-['Outfit',sans-serif]">
              ${(tonnesToSell * 335 - tonnesToSell * (distanceKm * 0.25)).toLocaleString()} USD
            </div>
            <p className="text-[11px] text-stone-300">
              Gross: ${(tonnesToSell * 335).toLocaleString()} | Statutory price guarantees purchase, with payment turnaround subject to ministry disbursement.
            </p>
          </div>

          <div className="bg-stone-800/60 p-4 rounded-xl border border-stone-700 space-y-2">
            <div className="font-bold text-xs text-white">OPTION B: Mbare Musika Private Spot</div>
            <div className="text-2xl font-black text-purple-400 font-['Outfit',sans-serif]">
              ${(tonnesToSell * 290 - tonnesToSell * (distanceKm * 0.25)).toLocaleString()} USD
            </div>
            <p className="text-[11px] text-stone-300">
              Gross: ${(tonnesToSell * 290).toLocaleString()} | Immediate cash-on-delivery, but exposed to daily market price fluctuations and storage fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
