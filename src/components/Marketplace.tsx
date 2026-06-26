import React, { useState } from 'react';
import { ShoppingBag, Search, Filter, Hammer, ArrowRight, CheckCircle2, ShieldAlert, Truck, Sparkles, X, FileText } from 'lucide-react';
import { MarketplaceItem } from '../types';
import { MARKETPLACE_ITEMS } from '../data';

interface MarketplaceProps {
  onNotify: (message: string, type: 'success' | 'error') => void;
}

export function Marketplace({ onNotify }: MarketplaceProps) {
  const [items, setItems] = useState<MarketplaceItem[]>(MARKETPLACE_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Cart/Estimator state
  const [cart, setCart] = useState<{ item: MarketplaceItem; quantity: number }[]>([]);
  const [showInquiryModal, setShowInquiryModal] = useState<MarketplaceItem | null>(null);
  const [inquiryName, setInquiryName] = useState<string>('');
  const [inquiryPhone, setInquiryPhone] = useState<string>('');
  const [inquiryVolume, setInquiryVolume] = useState<number>(10); // Standard pack
  const [shippingCity, setShippingCity] = useState<string>('Delhi NCR');

  // Filter logic
  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', 'Construction', 'Furnishing', 'Bath & Sanitary', 'Electrical & Lighting', 'Hardware & Steel'];

  const addToEstimator = (item: MarketplaceItem) => {
    // Add default unit quantity
    const existsIndex = cart.findIndex(c => c.item.id === item.id);
    if (existsIndex > -1) {
      const updated = [...cart];
      updated[existsIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart([...cart, { item, quantity: 1 }]);
    }
    onNotify(`Added ${item.title} to your Procurement Estimator!`, 'success');
  };

  const removeFromEstimator = (itemId: string) => {
    setCart(cart.filter(c => c.item.id !== itemId));
  };

  const updateQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromEstimator(itemId);
      return;
    }
    setCart(cart.map(c => c.item.id === itemId ? { ...c, quantity: qty } : c));
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryPhone) {
      onNotify('Please fill in your contact information completely.', 'error');
      return;
    }
    onNotify(`Success! Customized B2B bulk quote request submitted for ${showInquiryModal?.brand} ${showInquiryModal?.title}. Sourcing agent will call back in 15 mins!`, 'success');
    setShowInquiryModal(null);
    setInquiryName('');
    setInquiryPhone('');
  };

  // Calculations
  const calculateTotals = () => {
    let subtotal = 0;
    cart.forEach(c => {
      subtotal += c.item.price * c.quantity;
    });
    const gstRate = 0.18; // 18% standard construction GST
    const gstValue = subtotal * gstRate;
    const transportEst = subtotal > 0 ? (subtotal > 100000 ? 0 : 4500) : 0;
    const totalWithTaxes = subtotal + gstValue + transportEst;

    return {
      subtotal,
      gstValue,
      transportEst,
      totalWithTaxes
    };
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-8">
      
      {/* Visual Header */}
      <div className="bg-gradient-to-r from-stone-900 via-[#b72227] to-stone-900 border-b border-[#d92228] p-8 md:p-12 text-white rounded-2xl relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-650/10 rounded-full blur-3xl"></div>
        <div className="max-w-3xl relative">
          <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest bg-yellow-400/10 px-3 py-1 rounded-full">
            Developer Sourcing Portal
          </span>
          <h2 className="text-2xl md:text-4xl font-black font-sans leading-tight mt-3 text-white">
            Home Sourcing & Procurement Marketplace
          </h2>
          <p className="text-stone-200 text-xs md:text-sm mt-2 leading-relaxed">
            Direct institutional pricing on raw building assets, structural steel, Grade-A cement, luxury floor tiles, and premium state-of-the-art smart technology automation systems for builders, investors, and contractors.
          </p>
          <div className="flex flex-wrap gap-4 mt-6 text-xs text-stone-100">
            <span className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-yellow-400" /> Direct Site Delivery Range (Pan-India)</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Insured Transit Sourced Items</span>
            <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-yellow-400" /> Tax-deductible B2B GST Invoicing</span>
          </div>
        </div>
      </div>

      {/* Main Layout split: Catalog left, Procurement Cart/Inquiry right */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Hand: Product Catalog */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Controls Bar */}
          <div className="bg-white border border-stone-150 p-4 rounded-xl shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Search */}
              <div className="relative w-full md:w-80">
                <span className="absolute left-3 top-2.5 text-stone-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search brand, item, category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-stone-50 border border-stone-250 rounded-lg outline-none focus:border-[#d92228]"
                />
              </div>

              {/* Info stats */}
              <div className="text-xs text-stone-500 font-medium">
                Showing {filteredItems.length} curated wholesale building solutions
              </div>
            </div>

            {/* Categories scroll scrollable tag line */}
            <div className="flex flex-wrap gap-1 border-t border-stone-100 pt-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`cursor-pointer text-xs px-3.5 py-1.5 rounded-lg border transition-all ${
                    selectedCategory === cat
                      ? 'border-[#d92228] bg-red-50 text-[#d92228] font-bold'
                      : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {cat === 'All' ? '🌐 All Catalog' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="relative h-44 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-all"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 bg-stone-900/80 text-white text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                      {item.category}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-xs text-[#d92228] font-black uppercase text-opacity-90">{item.brand}</span>
                      <span className="text-xs text-stone-500 font-mono">⭐ {item.rating}</span>
                    </div>

                    <h3 className="text-sm font-bold text-stone-900 line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed h-8">{item.description}</p>
                    
                    <div className="text-stone-400 text-[10px] flex items-center gap-1 italic">
                      📍 {item.location}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 select-none border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-semibold">Wholesale Rate</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-black text-stone-900">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-stone-400 line-through">
                        ₹{item.originalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => setShowInquiryModal(item)}
                      className="cursor-pointer bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs px-2.5 py-1.5 rounded-lg font-bold transition-all"
                    >
                      B2B Quote
                    </button>
                    <button
                      onClick={() => addToEstimator(item)}
                      className="cursor-pointer bg-[#d92228] hover:bg-[#b72227] text-white text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Add Estimator
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Hand: Sourcing Procurement Estimator */}
        <div className="space-y-6">
          <div className="bg-white border-2 border-stone-150 rounded-xl p-5 shadow-lg relative">
            <h3 className="text-base font-bold text-stone-950 flex items-center gap-2 mb-2">
              <ShoppingBag className="text-[#d92228] w-5 h-5" />
              Procurement Cost Estimator
            </h3>
            <p className="text-xs text-stone-500 mb-4 h-8">
              Construct real material lists and immediately evaluate commercial pricing, freight logistics and GST parameters.
            </p>

            {cart.length === 0 ? (
              <div className="border border-dashed border-stone-200 rounded-lg p-6 text-center text-stone-400 space-y-2">
                <Hammer className="w-8 h-8 mx-auto stroke-1 animate-bounce" />
                <p className="text-xs font-semibold">Estimator List Empty</p>
                <p className="text-[10px] text-stone-400 max-w-[200px] mx-auto">
                  Click &quot;Add Estimator&quot; on select items on the left to add concrete tons, steel rebars or sanitary ware.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-76 overflow-y-auto pr-1">
                {cart.map(c => (
                  <div key={c.item.id} className="bg-stone-50 p-3 rounded-lg border border-stone-200 text-xs flex justify-between items-center">
                    <div className="min-w-0 pr-2">
                      <p className="font-bold text-stone-900 truncate">{c.item.title}</p>
                      <span className="text-[10px] text-stone-400 block">{c.item.brand} (₹{c.item.price}/Unit)</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="flex items-center border border-stone-300 rounded bg-white overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(c.item.id, c.quantity - 1)}
                          className="px-2 py-0.5 hover:bg-stone-100 font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 font-semibold text-stone-800">{c.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(c.item.id, c.quantity + 1)}
                          className="px-2 py-0.5 hover:bg-stone-100 font-bold"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromEstimator(c.item.id)}
                        className="text-stone-400 hover:text-[#d92228] font-bold text-sm px-1"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <div className="border-t border-stone-200 mt-4 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Sourcing Subtotal:</span>
                  <span className="font-semibold text-stone-800">₹{totals.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Tax GST (18.0%):</span>
                  <span className="font-semibold text-stone-850">₹{totals.gstValue.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Freight/Transport:</span>
                  <span className="font-semibold text-stone-850">
                    {totals.transportEst === 0 ? <strong className="text-emerald-600">FREE Deliver</strong> : `₹${totals.transportEst.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-[#d92228] border-t border-stone-100 pt-2 font-bold text-sm">
                  <span>Total Wholesale Due:</span>
                  <span>₹{totals.totalWithTaxes.toLocaleString('en-IN')}</span>
                </div>

                <button
                  onClick={() => setShowInquiryModal(cart[0].item)}
                  className="cursor-pointer w-full bg-[#d92228] hover:bg-[#b72227] text-white py-3 rounded-lg font-bold text-sm shadow-md mt-4 flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  Request Bulk B2B Discount
                </button>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-stone-900 to-[#9c181c] text-white rounded-xl p-5 border border-red-800 relative">
            <h4 className="text-sm font-bold font-sans text-yellow-500 mb-1 flex items-center gap-1.5">
              👑 Prime VIP Builder Privileges
            </h4>
            <p className="text-[11px] text-stone-200 leading-relaxed mb-3">
              Are you a developer or institutional real estate project board planner? Get integrated direct escrow protection and customized bulk manufacturing rates.
            </p>
            <div className="space-y-2 border-t border-stone-700 pt-3 text-[10px] text-stone-300">
              <div className="flex justify-between">
                <span>Enterprise Credit Limits:</span>
                <strong className="text-white">Up to ₹50 Lakhs</strong>
              </div>
              <div className="flex justify-between">
                <span>Standard Delivery Frame:</span>
                <strong className="text-white">Within 48 Working Hours</strong>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Inquiry modal slider popup */}
      {showInquiryModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md border border-stone-200 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-stone-900 to-[#d92228] p-5 text-white flex justify-between items-center">
              <div>
                <span className="text-[9px] uppercase font-bold text-yellow-400">Institutional Sourcing Request</span>
                <h3 className="font-bold text-sm tracking-tight">{showInquiryModal.brand} Custom Volume Request</h3>
              </div>
              <button 
                onClick={() => setShowInquiryModal(null)}
                className="text-stone-300 hover:text-white font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInquirySubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Product Target</label>
                <div className="bg-stone-100 p-2.5 rounded-lg text-xs font-bold text-stone-900">
                  {showInquiryModal.title}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-750 mb-1">Your Full Name / Corporate Entity</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Skyline Builders Corp"
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  className="w-full text-xs bg-stone-550 bg-stone-50 text-stone-900 border border-stone-300 rounded-lg p-3 outline-none focus:border-[#d92228]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Contact WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 99999-xxxxx"
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    className="w-full text-xs bg-stone-50 text-stone-900 border border-stone-300 rounded-lg p-3 outline-none focus:border-[#d92228]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-750 mb-1">Required Volume Pack</label>
                  <input
                    type="number"
                    min="1"
                    value={inquiryVolume}
                    onChange={(e) => setInquiryVolume(Number(e.target.value))}
                    className="w-full text-xs bg-stone-50 text-stone-900 border border-stone-300 rounded-lg p-3 outline-none focus:border-[#d92228]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Delivery City Site Destination</label>
                <select
                  value={shippingCity}
                  onChange={(e) => setShippingCity(e.target.value)}
                  className="w-full text-xs bg-stone-50 text-stone-900 border border-stone-300 rounded-lg p-3 outline-none focus:border-[#d92228]"
                >
                  <option value="Delhi NCR">Delhi NCR Hubs</option>
                  <option value="Mumbai Core">Mumbai / Thanet Yards</option>
                  <option value="Pune Zone">Pune / Chakan Industrial Sector</option>
                  <option value="Bengaluru Urban">Bengaluru Urban Areas</option>
                  <option value="Goa Coastline">North Goa Coastal Locations</option>
                </select>
              </div>

              <button
                type="submit"
                className="cursor-pointer w-full bg-[#d92228] hover:bg-[#b72227] text-white py-3 rounded-lg font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                Assemble Quotation Proposal
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
