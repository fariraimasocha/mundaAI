import React, { useState } from "react";
import {
  Building2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Search,
  Filter,
  Phone,
  MessageSquare,
  ExternalLink,
  MapPin,
  Tag,
  ShieldCheck,
  Send,
  PlusCircle,
  Truck,
  ArrowRight,
  Package,
  Layers,
  Sparkles,
  RefreshCw,
  BellRing,
  HandCoins,
  ChevronDown,
  ShoppingBag,
  Info,
  CalendarCheck,
  Award
} from "lucide-react";
import {
  AgriCompany,
  CompanyProduct,
  ProductAvailability,
  FarmerProfile,
  Language,
  FarmerProductInquiry,
  FarmerProduceListing
} from "../types";
import {
  DEFAULT_AGRI_COMPANIES,
  DEFAULT_COMPANY_PRODUCTS,
  INITIAL_FARMER_PRODUCE_LISTINGS
} from "../data/agriCompaniesData";

interface AgriCompanyConnectProps {
  language: Language;
  farmer: FarmerProfile;
  onAskAgronomist?: () => void;
}

export const AgriCompanyConnect: React.FC<AgriCompanyConnectProps> = ({
  language,
  farmer,
  onAskAgronomist,
}) => {
  // Products state with live toggle ability
  const [products, setProducts] = useState<CompanyProduct[]>(DEFAULT_COMPANY_PRODUCTS);
  const [companies] = useState<AgriCompany[]>(DEFAULT_AGRI_COMPANIES);
  const [farmerListings, setFarmerListings] = useState<FarmerProduceListing[]>(
    INITIAL_FARMER_PRODUCE_LISTINGS
  );

  // Filter states
  const [activeTab, setActiveTab] = useState<"products" | "companies" | "offtake" | "my-orders">("products");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("all");
  const [selectedDepot, setSelectedDepot] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currency, setCurrency] = useState<"USD" | "ZiG">("USD");
  const exchangeRate = 27.0; // Official ZiG rate

  // Modal / Interaction states
  const [orderModalProduct, setOrderModalProduct] = useState<CompanyProduct | null>(null);
  const [orderQuantity, setOrderQuantity] = useState<number>(1);
  const [orderDeliveryMethod, setOrderDeliveryMethod] = useState<"Depot Pickup" | "Farm Gate Delivery">("Depot Pickup");
  const [orderPreferredDepot, setOrderPreferredDepot] = useState<string>("Chinhoyi");
  const [orderNotes, setOrderNotes] = useState<string>("");
  const [orderSubmitting, setOrderSubmitting] = useState<boolean>(false);
  const [orderSuccessTicket, setOrderSuccessTicket] = useState<string | null>(null);

  // Stock Alert Toast
  const [alertSubscribedId, setAlertSubscribedId] = useState<string | null>(null);

  // Inquiries history state
  const [inquiries, setInquiries] = useState<FarmerProductInquiry[]>([
    {
      id: "INQ-2026-081",
      farmerName: farmer.name,
      farmerPhone: "+263 77 123 4567",
      farmerLocation: farmer.district,
      productId: "prod-sc-719",
      productName: "SC 719 Hybrid White Maize (Late Maturity)",
      companyId: "seed-co-zw",
      companyName: "Seed Co Zimbabwe",
      quantityRequested: 4,
      preferredDepot: "Chinhoyi Industrial Depot",
      deliveryMethod: "Depot Pickup",
      message: "Ready for collection ahead of summer planting.",
      status: "CONFIRMED",
      timestamp: "Yesterday, 14:20",
    }
  ]);

  // Produce listing modal state
  const [showProduceModal, setShowProduceModal] = useState<boolean>(false);
  const [newProduceCrop, setNewProduceCrop] = useState<string>(farmer.primaryCrop);
  const [newProduceVariety, setNewProduceVariety] = useState<string>(farmer.variety);
  const [newProduceTonnes, setNewProduceTonnes] = useState<number>(5.0);
  const [newProducePriceUSD, setNewProducePriceUSD] = useState<number>(320);
  const [newProduceLocation, setNewProduceLocation] = useState<string>(farmer.district);

  // Handle Availability Toggle (Demo capability so user can see live status changes)
  const handleToggleAvailability = (productId: string) => {
    const cycle: Record<ProductAvailability, ProductAvailability> = {
      IN_STOCK: "LOW_STOCK",
      LOW_STOCK: "OUT_OF_STOCK",
      OUT_OF_STOCK: "PRE_ORDER",
      PRE_ORDER: "IN_STOCK",
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const nextAvail = cycle[p.availability];
        let badge = p.stockBadgeText;
        if (nextAvail === "IN_STOCK") badge = "In Stock • Verified Live Inventory";
        else if (nextAvail === "LOW_STOCK") badge = "Low Stock • Limited Quantities Left";
        else if (nextAvail === "OUT_OF_STOCK") badge = "Out of Stock / Sold Out • Next Batch Pending";
        else if (nextAvail === "PRE_ORDER") badge = "Pre-Order Available • Advance Booking";

        return {
          ...p,
          availability: nextAvail,
          stockBadgeText: badge,
          stockQuantity: nextAvail === "OUT_OF_STOCK" ? 0 : nextAvail === "LOW_STOCK" ? 12 : 500,
          lastStockCheck: "Just now (Live Update)",
        };
      })
    );
  };

  // Filtered products calculation
  const filteredProducts = products.filter((p) => {
    // Company match
    if (selectedCompanyId !== "all" && p.companyId !== selectedCompanyId) return false;

    // Category match
    if (selectedCategory !== "all" && p.category !== selectedCategory) return false;

    // Availability match
    if (availabilityFilter !== "all" && p.availability !== availabilityFilter) return false;

    // Depot match
    if (selectedDepot !== "all") {
      const hasDepot = p.depotLocations.some((d) => d.toLowerCase().includes(selectedDepot.toLowerCase()));
      if (!hasDepot) return false;
    }

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchComp = p.companyName.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchCrops = p.targetCrops?.some((c) => c.toLowerCase().includes(q));
      if (!matchName && !matchComp && !matchDesc && !matchCrops) return false;
    }

    return true;
  });

  // Handle Order Submit
  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderModalProduct) return;

    setOrderSubmitting(true);
    setTimeout(() => {
      const ticketNum = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      const newInquiry: FarmerProductInquiry = {
        id: ticketNum,
        farmerName: farmer.name,
        farmerPhone: "+263 77 123 4567",
        farmerLocation: farmer.district,
        productId: orderModalProduct.id,
        productName: orderModalProduct.name,
        companyId: orderModalProduct.companyId,
        companyName: orderModalProduct.companyName,
        quantityRequested: orderQuantity,
        preferredDepot: orderPreferredDepot,
        deliveryMethod: orderDeliveryMethod,
        message: orderNotes || `Requesting ${orderQuantity} units of ${orderModalProduct.name}.`,
        status: "CONFIRMED",
        timestamp: "Just now",
      };

      setInquiries((prev) => [newInquiry, ...prev]);
      setOrderSubmitting(false);
      setOrderSuccessTicket(ticketNum);
    }, 600);
  };

  // Create Produce Listing Submit
  const handleCreateProduceListing = (e: React.FormEvent) => {
    e.preventDefault();
    const newListing: FarmerProduceListing = {
      id: `listing-${Date.now()}`,
      farmerName: `${farmer.name} (My Farm)`,
      crop: newProduceCrop,
      variety: newProduceVariety,
      quantityTonnes: Number(newProduceTonnes),
      expectedPriceUSD: Number(newProducePriceUSD),
      location: newProduceLocation,
      availabilityDate: "Harvested / Ready for Collection",
      status: "AVAILABLE",
      matchedCompanyBuyer: "National Foods & GMB Off-takers",
    };

    setFarmerListings((prev) => [newListing, ...prev]);
    setShowProduceModal(false);
  };

  // Quick stats
  const totalInStock = products.filter((p) => p.availability === "IN_STOCK").length;
  const totalLowStock = products.filter((p) => p.availability === "LOW_STOCK").length;
  const totalOutOfStock = products.filter((p) => p.availability === "OUT_OF_STOCK").length;
  const totalPreOrder = products.filter((p) => p.availability === "PRE_ORDER").length;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner: Connection Between Farmers and Agribusiness Companies */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-700 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black tracking-wide bg-emerald-400 text-stone-950 uppercase flex items-center gap-1.5 shadow-sm">
                <Building2 className="w-3.5 h-3.5" />
                <span>Agri-Company & Farmer Connect</span>
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/10 text-emerald-300 border border-emerald-500/30">
                Zimbabwe Nationwide Network
              </span>
            </div>

            {/* Currency switcher */}
            <div className="flex items-center bg-stone-950/60 p-1 rounded-xl border border-stone-700">
              <button
                onClick={() => setCurrency("USD")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  currency === "USD" ? "bg-emerald-600 text-white shadow-sm" : "text-stone-400 hover:text-white"
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrency("ZiG")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  currency === "ZiG" ? "bg-emerald-600 text-white shadow-sm" : "text-stone-400 hover:text-white"
                }`}
              >
                ZiG (Rate {exchangeRate})
              </button>
            </div>
          </div>

          <div className="max-w-3xl space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black font-['Outfit',sans-serif] tracking-tight">
              Direct Connection Between Farmers & Certified Agricultural Suppliers
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Connect directly with verified seed breeders, fertilizer manufacturers, crop protection suppliers, solar irrigation engineers, and commercial grain buyers. Check real-time stock availability, reserve inputs at local depots, or contract your harvest produce.
            </p>
          </div>

          {/* Farmer Local Context & Availability Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-stone-700/80">
            <div className="bg-stone-900/80 p-3 rounded-2xl border border-stone-700">
              <span className="text-[10px] text-stone-400 uppercase font-semibold block">Farmer Location</span>
              <span className="text-xs sm:text-sm font-bold text-emerald-300 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{farmer.district}</span>
              </span>
            </div>

            <div className="bg-stone-900/80 p-3 rounded-2xl border border-emerald-700/40">
              <span className="text-[10px] text-emerald-400 uppercase font-semibold block">In Stock / Available</span>
              <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{totalInStock} Products Ready</span>
              </span>
            </div>

            <div className="bg-stone-900/80 p-3 rounded-2xl border border-amber-700/40">
              <span className="text-[10px] text-amber-400 uppercase font-semibold block">Limited / Low Stock</span>
              <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>{totalLowStock} Low in Depot</span>
              </span>
            </div>

            <div className="bg-stone-900/80 p-3 rounded-2xl border border-rose-700/40">
              <span className="text-[10px] text-rose-400 uppercase font-semibold block">Out of Stock / Sold Out</span>
              <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>{totalOutOfStock} Restocking Soon</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Sub-tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2 p-1 bg-stone-200/80 rounded-2xl">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "products"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Package className="w-4 h-4 text-emerald-600" />
            <span>Products & Stock Availability ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("companies")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "companies"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>Certified Companies ({companies.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("offtake")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "offtake"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <HandCoins className="w-4 h-4 text-amber-600" />
            <span>Sell Produce to Companies ({farmerListings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("my-orders")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "my-orders"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <span>My Inquiries & Orders ({inquiries.length})</span>
          </button>
        </div>

        {/* Quick Action Button */}
        <div className="flex items-center gap-2">
          {activeTab === "offtake" ? (
            <button
              onClick={() => setShowProduceModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List My Harvested Produce</span>
            </button>
          ) : (
            <span className="text-xs text-stone-500 font-medium hidden sm:inline">
              Verified supplier pricing & depot inventory updated daily
            </span>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: PRODUCTS & REAL-TIME AVAILABILITY */}
      {/* ========================================================================= */}
      {activeTab === "products" && (
        <div className="space-y-6">
          {/* Filtering controls bar */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            {/* Search + Company Filter + Depot Filter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products (e.g. SC 719, Compound D, Solar pump)..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-medium text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-emerald-600 outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-3 text-stone-400 hover:text-stone-600 text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Company Filter Dropdown */}
              <div className="relative">
                <select
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-medium text-stone-800 focus:bg-white focus:border-emerald-600 outline-none transition-all cursor-pointer"
                >
                  <option value="all">All Agri-Companies ({companies.length})</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Depot Location Filter */}
              <div className="relative">
                <select
                  value={selectedDepot}
                  onChange={(e) => setSelectedDepot(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-medium text-stone-800 focus:bg-white focus:border-emerald-600 outline-none transition-all cursor-pointer"
                >
                  <option value="all">All Depots Nationwide</option>
                  <option value="Chinhoyi">Chinhoyi / Makonde (Closest to Demo Farm)</option>
                  <option value="Harare">Harare Depots & Plants</option>
                  <option value="Bulawayo">Bulawayo Belmont / Mills</option>
                  <option value="Mutare">Mutare Depots</option>
                  <option value="Gweru">Gweru & Kwekwe</option>
                  <option value="Bindura">Bindura / Mash Central</option>
                </select>
              </div>
            </div>

            {/* Availability Filter Chips (KEY REQUIREMENT: shows if available or not) */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
              <span className="text-xs font-bold text-stone-600 flex items-center gap-1.5 mr-1 shrink-0">
                <Filter className="w-3.5 h-3.5 text-emerald-600" />
                <span>Stock Status:</span>
              </span>

              <button
                onClick={() => setAvailabilityFilter("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  availabilityFilter === "all"
                    ? "bg-stone-900 text-white shadow-sm font-bold"
                    : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                }`}
              >
                All Statuses ({products.length})
              </button>

              <button
                onClick={() => setAvailabilityFilter("IN_STOCK")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  availabilityFilter === "IN_STOCK"
                    ? "bg-emerald-700 text-white shadow-sm font-bold"
                    : "bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Available / In Stock ({totalInStock})</span>
              </button>

              <button
                onClick={() => setAvailabilityFilter("LOW_STOCK")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  availabilityFilter === "LOW_STOCK"
                    ? "bg-amber-600 text-white shadow-sm font-bold"
                    : "bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200"
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>Low Stock ({totalLowStock})</span>
              </button>

              <button
                onClick={() => setAvailabilityFilter("OUT_OF_STOCK")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  availabilityFilter === "OUT_OF_STOCK"
                    ? "bg-rose-700 text-white shadow-sm font-bold"
                    : "bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200"
                }`}
              >
                <XCircle className="w-3.5 h-3.5 text-rose-500" />
                <span>Out of Stock / Sold Out ({totalOutOfStock})</span>
              </button>

              <button
                onClick={() => setAvailabilityFilter("PRE_ORDER")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  availabilityFilter === "PRE_ORDER"
                    ? "bg-blue-700 text-white shadow-sm font-bold"
                    : "bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200"
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span>Pre-Order ({totalPreOrder})</span>
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs pt-1">
              <span className="text-[11px] font-bold text-stone-500 mr-1 shrink-0">
                Categories:
              </span>
              {[
                { id: "all", label: "All Items" },
                { id: "Seeds & Hybrids", label: "Seeds & Hybrids" },
                { id: "Fertilizers & Nutrition", label: "Fertilizers & Nutrition" },
                { id: "Crop Protection & Chemicals", label: "Crop Protection" },
                { id: "Irrigation & Equipment", label: "Irrigation & Solar Equipment" },
                { id: "Livestock Feeds", label: "Livestock Feeds" },
                { id: "Contract Offtake", label: "Offtake Contracts" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? "bg-stone-800 text-white shadow-sm font-bold"
                      : "bg-stone-100 hover:bg-stone-200 text-stone-600"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Availability Simulation Notice */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-950">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold block text-emerald-900">
                  Real-Time Stock Availability Tracker
                </span>
                <span className="text-emerald-800/80">
                  Each product card shows verified live availability. Click the "Simulate Stock Change" button on any card to test how live restock notifications and availability badges update.
                </span>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl text-center border border-stone-200 space-y-3">
              <Package className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="text-base font-bold text-stone-800">No products match your filter criteria</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Try switching your stock status filter or resetting your search query to see other available products.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCompanyId("all");
                  setSelectedCategory("all");
                  setAvailabilityFilter("all");
                  setSelectedDepot("all");
                }}
                className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-all inline-block"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((product) => {
                const company = companies.find((c) => c.id === product.companyId);
                const displayPrice =
                  currency === "USD" ? product.priceUSD : product.priceUSD * exchangeRate;
                const pricePrefix = currency === "USD" ? "$" : "ZiG ";

                // Availability badge styling
                let availBadgeClass = "";
                let availIcon = null;
                let availStatusLabel = "";

                if (product.availability === "IN_STOCK") {
                  availBadgeClass = "bg-emerald-100 text-emerald-900 border-emerald-300";
                  availIcon = <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
                  availStatusLabel = "In Stock / Available";
                } else if (product.availability === "LOW_STOCK") {
                  availBadgeClass = "bg-amber-100 text-amber-900 border-amber-300";
                  availIcon = <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />;
                  availStatusLabel = "Limited Stock";
                } else if (product.availability === "OUT_OF_STOCK") {
                  availBadgeClass = "bg-rose-100 text-rose-900 border-rose-300";
                  availIcon = <XCircle className="w-4 h-4 text-rose-600 shrink-0" />;
                  availStatusLabel = "Out of Stock / Sold Out";
                } else {
                  availBadgeClass = "bg-blue-100 text-blue-900 border-blue-300";
                  availIcon = <Clock className="w-4 h-4 text-blue-600 shrink-0" />;
                  availStatusLabel = "Pre-Order Available";
                }

                // WhatsApp message URL
                const waMessage = encodeURIComponent(
                  `Hello ${product.companyName},\nI am farmer ${farmer.name} from ${farmer.district}. I am checking availability on MundaAI for *${product.name}* (${product.unit}). Could you confirm current stock and payment options?`
                );
                const waLink = `https://wa.me/${company?.whatsappNumber || "263772224444"}?text=${waMessage}`;

                return (
                  <div
                    key={product.id}
                    className={`bg-white rounded-3xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md ${
                      product.availability === "OUT_OF_STOCK"
                        ? "border-rose-200/80 bg-rose-50/10"
                        : "border-stone-200"
                    }`}
                  >
                    {/* Card Header: Company, Category & Verified Badge */}
                    <div className="p-5 pb-3 border-b border-stone-100 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                            {product.category}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                            <h4 className="text-xs font-bold text-stone-900 hover:text-emerald-700 transition-colors">
                              {product.companyName}
                            </h4>
                            <span title="Verified Agribusiness Supplier">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            </span>
                          </div>
                        </div>

                        {/* Direct WhatsApp icon */}
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-all border border-emerald-200"
                          title={`Direct WhatsApp to ${product.companyName}`}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>
                      </div>

                      {/* Product Name */}
                      <h3 className="text-base font-black text-stone-900 font-['Outfit',sans-serif] leading-snug">
                        {product.name}
                      </h3>

                      {/* AVAILABILITY BADGE (PRIMARY PROMPT REQUIREMENT) */}
                      <div
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${availBadgeClass}`}
                      >
                        {availIcon}
                        <div className="flex flex-col min-w-0">
                          <span className="text-[11px] uppercase tracking-wide leading-none">
                            {availStatusLabel}
                          </span>
                          <span className="text-[10px] font-semibold opacity-90 truncate mt-0.5">
                            {product.stockBadgeText}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Body: Description, Price, Packaging & Depots */}
                    <div className="p-5 py-4 space-y-3 flex-1">
                      <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                        {product.description}
                      </p>

                      {/* Price & Packaging Specification */}
                      <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/70 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-stone-500 block uppercase font-medium">
                            Unit Packaging
                          </span>
                          <span className="text-xs font-bold text-stone-800">
                            {product.unit}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-stone-500 block uppercase font-medium">
                            Indicative Price
                          </span>
                          <span className="text-base font-black text-stone-900">
                            {pricePrefix}
                            {displayPrice.toLocaleString(undefined, {
                              minimumFractionDigits: displayPrice % 1 === 0 ? 0 : 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Depots with Available Stock */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-stone-500 uppercase flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          <span>Depots with Inventory:</span>
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {product.depotLocations.map((loc, idx) => (
                            <span
                              key={idx}
                              className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                                loc.toLowerCase().includes(farmer.district.toLowerCase().split(" ")[0]) ||
                                loc.toLowerCase().includes("chinhoyi")
                                  ? "bg-emerald-100 text-emerald-900 font-bold border border-emerald-300"
                                  : "bg-stone-100 text-stone-700"
                              }`}
                            >
                              {loc}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer: Action Buttons */}
                    <div className="p-5 pt-3 border-t border-stone-100 bg-stone-50/50 space-y-2">
                      <div className="flex items-center gap-2">
                        {product.availability === "OUT_OF_STOCK" ? (
                          <button
                            onClick={() => {
                              setAlertSubscribedId(product.id);
                              setTimeout(() => setAlertSubscribedId(null), 3000);
                            }}
                            className="flex-1 py-2.5 px-3 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                          >
                            <BellRing className="w-3.5 h-3.5 text-stone-600" />
                            <span>
                              {alertSubscribedId === product.id
                                ? "Subscribed to Restock!"
                                : "Notify Me When Available"}
                            </span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setOrderModalProduct(product);
                              setOrderQuantity(1);
                              setOrderSuccessTicket(null);
                            }}
                            className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>
                              {product.availability === "PRE_ORDER"
                                ? "Pre-Order / Reserve"
                                : "Order / Reserve Stock"}
                            </span>
                          </button>
                        )}

                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-all shrink-0"
                          title="Chat with company sales rep on WhatsApp"
                        >
                          <span>WhatsApp</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      {/* Interactive Availability Toggle Simulator Button */}
                      <div className="flex items-center justify-between pt-1 text-[10px] text-stone-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{product.lastStockCheck}</span>
                        </span>
                        <button
                          onClick={() => handleToggleAvailability(product.id)}
                          className="text-stone-500 hover:text-emerald-700 underline font-medium flex items-center gap-1"
                          title="Simulate depot stock change (In Stock -> Low Stock -> Out of Stock)"
                        >
                          <RefreshCw className="w-2.5 h-2.5" />
                          <span>Toggle Stock Status</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: CERTIFIED AGRIBUSINESS COMPANIES DIRECTORY */}
      {/* ========================================================================= */}
      {activeTab === "companies" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black font-['Outfit',sans-serif] text-stone-900">
                Verified Zimbabwean Agribusiness Partners
              </h3>
              <p className="text-xs text-stone-500">
                Official input houses, certified seed companies, and grain buyers operating across Zimbabwe's agricultural regions.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>8 Verified Corporate Partners</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {companies.map((company) => {
              const companyProducts = products.filter((p) => p.companyId === company.id);
              const inStockCount = companyProducts.filter((p) => p.availability === "IN_STOCK").length;
              const lowStockCount = companyProducts.filter((p) => p.availability === "LOW_STOCK").length;
              const outStockCount = companyProducts.filter((p) => p.availability === "OUT_OF_STOCK").length;

              const waLink = `https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(
                `Hello ${company.name}, I am contacting you through MundaAI Smart Farming platform.`
              )}`;

              return (
                <div
                  key={company.id}
                  className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-black font-['Outfit',sans-serif] text-stone-900">
                            {company.name}
                          </h4>
                          <span title="Verified Agribusiness Partner">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          </span>
                        </div>
                        <p className="text-xs text-emerald-800 font-semibold mt-0.5">
                          {company.tagline}
                        </p>
                      </div>

                      <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-stone-100 text-stone-700 border border-stone-200 shrink-0">
                        {company.category}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      {company.description}
                    </p>

                    {/* Stock Overview for Company */}
                    <div className="grid grid-cols-3 gap-2 bg-stone-50 p-3 rounded-2xl border border-stone-200/80 text-xs text-center">
                      <div>
                        <span className="text-[10px] text-emerald-700 font-bold block">In Stock</span>
                        <span className="text-sm font-black text-emerald-900">{inStockCount} Items</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-amber-700 font-bold block">Low Stock</span>
                        <span className="text-sm font-black text-amber-900">{lowStockCount} Items</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-rose-700 font-bold block">Out of Stock</span>
                        <span className="text-sm font-black text-rose-900">{outStockCount} Items</span>
                      </div>
                    </div>

                    {/* Depot Locations */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-stone-500 uppercase flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        <span>Regional Depot Locations:</span>
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {company.localDepots.map((depot, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-medium"
                          >
                            {depot}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Company Contact & Action Row */}
                  <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-xs text-stone-600">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-stone-400" />
                        <span>{company.contactPhone}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedCompanyId(company.id);
                          setActiveTab("products");
                        }}
                        className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all"
                      >
                        View Catalog ({companyProducts.length})
                      </button>

                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: SELL HARVESTED PRODUCE TO COMPANIES (OFF-TAKE) */}
      {/* ========================================================================= */}
      {activeTab === "offtake" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 p-6 rounded-3xl shadow-md space-y-2">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-950" />
              <h3 className="text-lg font-black font-['Outfit',sans-serif]">
                Direct Farmer-to-Offtaker Produce Marketplace
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-stone-900/90 max-w-3xl leading-relaxed font-medium">
              Eliminate predatory middlemen! Connect directly with certified grain processors (National Foods, Delta Corporation, Grain Marketing Board) that offer guaranteed cash pricing and electronic settlement upon crop delivery.
            </p>
          </div>

          {/* Active Corporate Buyer Quotas */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-stone-800 uppercase tracking-wide flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span>Current Company Buying Requirements & Quotas:</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                      National Foods Limited
                    </span>
                    <h5 className="text-base font-bold text-stone-900">
                      Commercial White Maize (Grade A & B)
                    </h5>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                    $320 / MT
                  </span>
                </div>
                <p className="text-xs text-stone-600">
                  Purchasing up to 15,000 MT at Chinhoyi Silos and Aspindale. Moisture content strictly ≤ 12.5%. Settlement within 48h.
                </p>
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Quota Open: 12,400 MT Left</span>
                  </span>
                  <a
                    href="https://wa.me/263772888111?text=Hello%20National%20Foods%2C%20I%20have%20white%20maize%20to%20sell%20from%20Chinhoyi."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-stone-900 hover:text-emerald-700 underline"
                  >
                    Contact Grain Buyer
                  </a>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">
                      Delta Corporation Malting Division
                    </span>
                    <h5 className="text-base font-bold text-stone-900">
                      Red & White Brewing Sorghum
                    </h5>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
                    $340 / MT
                  </span>
                </div>
                <p className="text-xs text-stone-600">
                  Accepting Serena, SV2, and Macia varieties for industrial brewing. Spot delivery or outgrower collection at Kwekwe and Chinhoyi Agritex.
                </p>
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Contracting Active</span>
                  </span>
                  <a
                    href="https://wa.me/263773400500?text=Hello%20Delta%20Corporation%2C%20I%20have%20red%20sorghum%20harvest%20available."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-stone-900 hover:text-emerald-700 underline"
                  >
                    Enroll in Offtake
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Farmer Listings Table */}
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm space-y-4 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-base font-black font-['Outfit',sans-serif] text-stone-900">
                  Farmer Produce Registered For Off-take
                </h4>
                <p className="text-xs text-stone-500">
                  Current lots listed by farmers waiting for or matched with certified corporate buyers.
                </p>
              </div>
              <button
                onClick={() => setShowProduceModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2 self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Your Harvest</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 uppercase font-semibold border-b border-stone-200">
                  <tr>
                    <th className="p-3">Farmer & Farm Location</th>
                    <th className="p-3">Crop & Variety</th>
                    <th className="p-3 text-right">Quantity</th>
                    <th className="p-3 text-right">Target Price</th>
                    <th className="p-3">Matched Corporate Buyer</th>
                    <th className="p-3 text-center">Availability Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-800">
                  {farmerListings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-stone-50 transition-colors">
                      <td className="p-3 font-bold text-stone-900">
                        <div className="flex flex-col">
                          <span>{listing.farmerName}</span>
                          <span className="text-[10px] text-stone-400 font-normal">
                            {listing.location}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="font-semibold">{listing.crop}</span>
                          <span className="text-[10px] text-emerald-700 font-medium">
                            {listing.variety || "Certified Grade A"}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-right font-black text-stone-900">
                        {listing.quantityTonnes} MT
                      </td>
                      <td className="p-3 text-right font-bold text-emerald-800">
                        ${listing.expectedPriceUSD} / MT
                      </td>
                      <td className="p-3 text-stone-600">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span className="font-medium text-stone-800">
                            {listing.matchedCompanyBuyer || "Pending Buyer Match"}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            listing.status === "AVAILABLE"
                              ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                              : listing.status === "OFFER_RECEIVED"
                              ? "bg-blue-100 text-blue-900 border border-blue-300"
                              : "bg-stone-100 text-stone-600"
                          }`}
                        >
                          {listing.status === "AVAILABLE"
                            ? "Available for Pickup"
                            : listing.status === "OFFER_RECEIVED"
                            ? "Offer Under Review"
                            : "Sold / Dispatched"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 4: MY INQUIRIES & ORDER TICKETS */}
      {/* ========================================================================= */}
      {activeTab === "my-orders" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-1">
            <h3 className="text-base font-black font-['Outfit',sans-serif] text-stone-900">
              Farmer Product Reservations & Direct Depot Inquiries
            </h3>
            <p className="text-xs text-stone-500">
              Track stock reservation tickets submitted to Seed Co, Windmill, ZFC, Agricura, and equipment providers.
            </p>
          </div>

          <div className="space-y-3">
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-stone-100 text-stone-800 border border-stone-200">
                      {inq.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-900 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{inq.status}</span>
                    </span>
                    <span className="text-xs text-stone-400">• {inq.timestamp}</span>
                  </div>

                  <h4 className="text-base font-bold text-stone-900">
                    {inq.quantityRequested}x {inq.productName}
                  </h4>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600">
                    <span className="flex items-center gap-1 font-semibold text-emerald-800">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{inq.companyName}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>Depot: {inq.preferredDepot}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-stone-400" />
                      <span>Method: {inq.deliveryMethod}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`https://wa.me/263772224444?text=${encodeURIComponent(
                      `Hello, I am inquiring about Order Ticket #${inq.id} for ${inq.productName}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Depot Agent</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: RESERVE / INQUIRE PRODUCT AVAILABILITY */}
      {/* ========================================================================= */}
      {orderModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {orderSuccessTicket ? (
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black font-['Outfit',sans-serif] text-stone-900">
                    Reservation Ticket Confirmed!
                  </h3>
                  <p className="text-xs text-stone-600">
                    Your stock reservation ticket for{" "}
                    <strong>{orderModalProduct.name}</strong> has been logged directly with{" "}
                    <strong>{orderModalProduct.companyName}</strong>.
                  </p>
                </div>

                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2 text-left text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Ticket Number:</span>
                    <span className="font-mono font-bold text-stone-900">{orderSuccessTicket}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Quantity Reserved:</span>
                    <span className="font-bold text-stone-900">{orderQuantity} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Collection Depot:</span>
                    <span className="font-bold text-stone-900">{orderPreferredDepot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Estimated Total:</span>
                    <span className="font-bold text-emerald-800">
                      ${(orderModalProduct.priceUSD * orderQuantity).toFixed(2)} / ZiG{" "}
                      {(orderModalProduct.priceUSD * orderQuantity * exchangeRate).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <a
                    href={`https://wa.me/263772224444?text=${encodeURIComponent(
                      `Hello ${orderModalProduct.companyName}, I have just generated Reservation Ticket *#${orderSuccessTicket}* on MundaAI for ${orderQuantity}x ${orderModalProduct.name}. Could you please confirm pickup hours at ${orderPreferredDepot}?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Confirm via WhatsApp</span>
                  </a>

                  <button
                    onClick={() => {
                      setOrderModalProduct(null);
                      setOrderSuccessTicket(null);
                    }}
                    className="px-4 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmOrder} className="space-y-4">
                <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide">
                      {orderModalProduct.companyName}
                    </span>
                    <h3 className="text-lg font-black font-['Outfit',sans-serif] text-stone-900">
                      Reserve / Order Stock
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOrderModalProduct(null)}
                    className="text-stone-400 hover:text-stone-600 p-1"
                  >
                    ✕
                  </button>
                </div>

                {/* Product Summary Header */}
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">{orderModalProduct.name}</h4>
                    <span className="text-[11px] text-stone-500">{orderModalProduct.unit}</span>
                  </div>
                  <span className="text-sm font-black text-emerald-800">
                    ${orderModalProduct.priceUSD} / unit
                  </span>
                </div>

                {/* Quantity input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Quantity Needed:</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setOrderQuantity((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-black text-sm"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={orderQuantity}
                      onChange={(e) => setOrderQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="flex-1 py-2 px-3 text-center rounded-xl border border-stone-200 font-black text-stone-900 text-sm outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setOrderQuantity((q) => q + 1)}
                      className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-black text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Collection Depot Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">
                    Select Collection Depot:
                  </label>
                  <select
                    value={orderPreferredDepot}
                    onChange={(e) => setOrderPreferredDepot(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-xs font-medium text-stone-800 bg-stone-50 outline-none"
                  >
                    {orderModalProduct.depotLocations.map((loc, idx) => (
                      <option key={idx} value={loc}>
                        {loc} {loc.includes("Chinhoyi") ? "(Closest Depot)" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Delivery Method */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Collection or Delivery:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setOrderDeliveryMethod("Depot Pickup")}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                        orderDeliveryMethod === "Depot Pickup"
                          ? "bg-emerald-50 text-emerald-900 border-emerald-500"
                          : "bg-stone-50 text-stone-700 border-stone-200"
                      }`}
                    >
                      Depot Pickup (Free)
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderDeliveryMethod("Farm Gate Delivery")}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                        orderDeliveryMethod === "Farm Gate Delivery"
                          ? "bg-emerald-50 text-emerald-900 border-emerald-500"
                          : "bg-stone-50 text-stone-700 border-stone-200"
                      }`}
                    >
                      Farm Gate Haulage
                    </button>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Farmer Notes or Instructions:</label>
                  <textarea
                    rows={2}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="e.g. Planning collection this Friday morning with a 3-tonne truck..."
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 bg-stone-50 outline-none placeholder:text-stone-400"
                  />
                </div>

                {/* Price Total */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-medium">Estimated Payable:</span>
                  <div className="text-right">
                    <span className="text-base font-black text-emerald-800 block">
                      ${(orderModalProduct.priceUSD * orderQuantity).toFixed(2)}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      or ZiG {(orderModalProduct.priceUSD * orderQuantity * exchangeRate).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={orderSubmitting}
                    className="flex-1 py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
                  >
                    {orderSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Sending to Company...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm Stock Reservation</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderModalProduct(null)}
                    className="px-4 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD HARVESTED PRODUCE TO OFFTAKE MARKETPLACE */}
      {/* ========================================================================= */}
      {showProduceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-black font-['Outfit',sans-serif] text-stone-900">
                  List Harvest for Corporate Buyers
                </h3>
                <p className="text-[11px] text-stone-500">
                  Connect your crop harvest to buyers with active purchase quotas.
                </p>
              </div>
              <button
                onClick={() => setShowProduceModal(false)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduceListing} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-700">Crop Type:</label>
                <select
                  value={newProduceCrop}
                  onChange={(e) => setNewProduceCrop(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-medium"
                >
                  <option value="White Maize (Grade A)">White Maize (Commercial Grade A)</option>
                  <option value="Red Sorghum (Brewing)">Red Sorghum (Brewing Grade)</option>
                  <option value="Sugar Beans (Red Speckled)">Sugar Beans (Red Speckled)</option>
                  <option value="Soya Beans">Soya Beans (Oil expresser grade)</option>
                  <option value="Groundnuts">Groundnuts (Shelled)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Seed Variety Planted:</label>
                <input
                  type="text"
                  value={newProduceVariety}
                  onChange={(e) => setNewProduceVariety(e.target.value)}
                  placeholder="e.g. Seed Co SC 719"
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Quantity (Tonnes):</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={newProduceTonnes}
                    onChange={(e) => setNewProduceTonnes(parseFloat(e.target.value) || 1)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Target Price ($/MT):</label>
                  <input
                    type="number"
                    value={newProducePriceUSD}
                    onChange={(e) => setNewProducePriceUSD(parseInt(e.target.value) || 300)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Farm / Collection Location:</label>
                <input
                  type="text"
                  value={newProduceLocation}
                  onChange={(e) => setNewProduceLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
                />
              </div>

              <div className="pt-3 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-sm transition-all"
                >
                  Publish Produce Listing
                </button>
                <button
                  type="button"
                  onClick={() => setShowProduceModal(false)}
                  className="px-4 py-3 rounded-xl bg-stone-100 text-stone-700 font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
