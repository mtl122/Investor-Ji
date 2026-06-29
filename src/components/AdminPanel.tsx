import React, { useState } from 'react';
import { 
  Building, 
  Trash2, 
  Check, 
  X, 
  MapPin, 
  Star, 
  Scale, 
  ShieldCheck, 
  Coins, 
  Users, 
  ClipboardCheck, 
  Database,
  Sliders,
  Award,
  Bell,
  Mail,
  TrendingUp,
  FileCheck2,
  Clock,
  Plus
} from 'lucide-react';
import { Property, Lead, Broker, PaymentRequest } from '../types';

interface AdminPanelProps {
  properties: Property[];
  onAddProperty: (newProp: Property) => void;
  onUpdateProperty: (id: string, updatedFields: Partial<Property>) => void;
  onDeleteProperty: (id: string) => void;
  leads: Lead[];
  onUpdateLead: (id: string, updatedFields: Partial<Lead>) => void;
  onAddLead?: (lead: Lead) => void;
  onClearLeads?: () => void;
  onResetLeads?: () => void;
  priceAlerts: Array<{ id: string; propertyId: string; email: string; targetPrice: number }>;
  onNotify: (message: string, type: 'success' | 'error') => void;
}

export function AdminPanel({
  properties,
  onAddProperty,
  onUpdateProperty,
  onDeleteProperty,
  leads,
  onUpdateLead,
  onAddLead,
  onClearLeads,
  onResetLeads,
  priceAlerts,
  onNotify
}: AdminPanelProps) {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'listings' | 'leads' | 'analytics' | 'brokers' | 'auto-fetch'>('listings');

  // Dynamic Cities list state loaded and synced with local storage
  const [customCities, setCustomCities] = useState<string[]>(() => {
    const saved = localStorage.getItem('custom_cities');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  const saveCustomCities = (cities: string[]) => {
    setCustomCities(cities);
    localStorage.setItem('custom_cities', JSON.stringify(cities));
    window.dispatchEvent(new Event('custom_cities_updated'));
  };

  const defaultCities = [
    'Noida', 'Gurgaon', 'Vrindavan', 'Delhi', 'Mumbai', 'Goa', 'Pune', 'Faridabad', 'Mathura', 
    'Dholera SIR', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Lucknow', 
    'Jaipur', 'Chandigarh', 'Indore', 'Bhopal', 'Kochi', 'Dehradun', 'Patna', 'Rishikesh', 
    'Haridwar', 'Kanpur', 'Ghaziabad', 'Nagpur', 'Visakhapatnam', 'Coimbatore', 'Surat', 'Thane', 'Navi Mumbai'
  ];

  const allCities = Array.from(new Set([...defaultCities, ...customCities]));

  // Custom city input state
  const [newCustomCityInput, setNewCustomCityInput] = useState('');
  const [showAddCustomCity, setShowAddCustomCity] = useState(false);

  // Auto-fetcher sourcing state
  const [fetchCity, setFetchCity] = useState('Noida');
  const [fetchCategory, setFetchCategory] = useState<'Residential' | 'Commercial' | 'Fractional' | 'Assured Return'>('Commercial');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchedProjects, setFetchedProjects] = useState<Property[]>([]);
  const [fetchSource, setFetchSource] = useState('');
  const [fetchWarning, setFetchWarning] = useState('');

  const [brokersDb, setBrokersDb] = useState<Broker[]>(() => {
    const saved = localStorage.getItem('brokers_database');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>(() => {
    const saved = localStorage.getItem('payment_requests_database');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // State for direct wallet balance adjustment
  const [editingBrokerId, setEditingBrokerId] = useState<string | null>(null);
  const [editBrokerBalanceValue, setEditBrokerBalanceValue] = useState<number>(0);

  // Sync back to local storage when state changes
  const saveBrokersToDb = (updatedBrokers: Broker[]) => {
    setBrokersDb(updatedBrokers);
    localStorage.setItem('brokers_database', JSON.stringify(updatedBrokers));
    
    // Also sync the logged in broker's current session if their balance was updated!
    const savedCurrent = localStorage.getItem('current_broker');
    if (savedCurrent) {
      try {
        const parsedCurrent = JSON.parse(savedCurrent);
        const match = updatedBrokers.find(b => b.id === parsedCurrent.id);
        if (match) {
          localStorage.setItem('current_broker', JSON.stringify(match));
          localStorage.setItem('agent_wallet_balance', match.walletBalance.toString());
        }
      } catch (e) {}
    }
  };

  const savePaymentRequests = (updatedRequests: PaymentRequest[]) => {
    setPaymentRequests(updatedRequests);
    localStorage.setItem('payment_requests_database', JSON.stringify(updatedRequests));
  };

  // New Lead form state
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [leadNameInput, setLeadNameInput] = useState('');
  const [leadPhoneInput, setLeadPhoneInput] = useState('');
  const [leadCityInput, setLeadCityInput] = useState('Delhi NCR');
  const [leadBudgetInput, setLeadBudgetInput] = useState('₹1.5 Cr - ₹3 Cr');
  const [leadTypeInput, setLeadTypeInput] = useState('Premium Residential');
  const [leadLocationInput, setLeadLocationInput] = useState('Golf Course Road');
  const [selectedAdminDetailedLead, setSelectedAdminDetailedLead] = useState<Lead | null>(null);

  const handleCreateManualLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadNameInput || !leadPhoneInput) {
      onNotify("Please provide a valid name and phone contact.", "error");
      return;
    }

    if (!onAddLead) return;

    // split phone into prefix and suffix
    const cleanedPhone = leadPhoneInput.trim();
    let prefix = "+91 ";
    let suffix = "•••• •••";
    if (cleanedPhone.length >= 10) {
      prefix = cleanedPhone.substring(0, cleanedPhone.length - 4);
      suffix = "•••• •" + cleanedPhone.substring(cleanedPhone.length - 3);
    } else {
      prefix = cleanedPhone;
    }

    const newLead: Lead = {
      id: 'lead-' + Date.now(),
      buyerName: leadNameInput,
      phonePrefix: prefix,
      phoneSuffix: suffix,
      fullPhone: cleanedPhone,
      email: `${leadNameInput.toLowerCase().replace(/\s+/g, '')}@hni-investor.in`,
      query: `Manually added lead inquiring for ${leadTypeInput} around ${leadLocationInput}`,
      city: leadCityInput,
      targetLocation: leadLocationInput || 'Direct Sourcing Inquiry',
      budget: leadBudgetInput,
      propertyType: leadTypeInput,
      timeframe: 'Immediate Sourcing (Manual Entry)',
      score: Math.floor(Math.random() * 10) + 90, // 90 to 99
      isVerified: true,
      price: 999,
      isPurchased: false,
      dateAdded: 'Just Now'
    };

    onAddLead(newLead);
    onNotify(`Successfully logged real-time lead for "${leadNameInput}"! Sourced and active in the pool.`, 'success');

    // Reset fields
    setLeadNameInput('');
    setLeadPhoneInput('');
    setLeadLocationInput('Golf Course Road');
    setShowAddLeadModal(false);
  };

  const handleSimulateRandomLead = () => {
    if (!onAddLead) return;

    const names = [
      'Varun Mehta', 
      'Sanjay Kapoor', 
      'Prerna Sharma', 
      'Aniket Deshpande', 
      'Karan Johar', 
      'Pooja Hegde', 
      'Adv. Shalini Nair', 
      'Vikramaditya Rao'
    ];
    const cities = ['Bengaluru', 'Mumbai', 'Delhi NCR', 'Pune', 'Gurgaon', 'Noida', 'Vrindavan', 'Faridabad'];
    const budgets = ['₹80 Lakhs - ₹1.5 Cr', '₹1.5 Cr - ₹3 Cr', '₹3 Cr - ₹5 Cr', '₹5 Cr - ₹10 Cr', '₹10 Cr+'];
    const types = ['Grade-A Multi-Tenant Commercial', 'Luxury Oceanfront Penthouse', 'Co-Living Fractional Space', 'Yamuna Expressway Gated Plot', 'Pre-Leased Retail Showroom'];
    const locations = ['Whitefield Outer Ring Road', 'Lower Parel Corporate Hub', 'Golf Course Ext Road', 'Kharadi IT Park Phase II', 'Yamuna Expressway Sector 22D', 'Bandra West Coastal Ring'];

    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const randomBudget = budgets[Math.floor(Math.random() * budgets.length)];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomLoc = locations[Math.floor(Math.random() * locations.length)];

    const randomPhone = "+91 " + (Math.floor(Math.random() * 90000) + 10000).toString();
    const suffix = "•••• •" + (Math.floor(Math.random() * 900) + 100).toString();

    const realPhoneSuffix = (Math.floor(Math.random() * 9000000) + 1000000).toString();
    const mockFullPhone = `${randomPhone} ${realPhoneSuffix.substring(0, 4)} ${realPhoneSuffix.substring(4)}`;

    const simulatedLead: Lead = {
      id: 'lead-' + Date.now(),
      buyerName: randomName,
      phonePrefix: randomPhone,
      phoneSuffix: suffix,
      fullPhone: mockFullPhone,
      email: `${randomName.toLowerCase().replace(/\s+/g, '')}@hni-investor.in`,
      query: `Inquired via active web tracking for the high-yield listing at ${randomLoc}. Requires verified digital property prospectus.`,
      city: randomCity,
      targetLocation: randomLoc,
      budget: randomBudget,
      propertyType: randomType,
      timeframe: 'Immediate Buyer (Generated via active simulation)',
      score: Math.floor(Math.random() * 15) + 85, // 85 to 99
      isVerified: true,
      price: Math.floor(Math.random() * 800) + 800, // ₹800 - ₹1599
      isPurchased: false,
      dateAdded: 'Just Now'
    };

    onAddLead(simulatedLead);
    onNotify(`⚡ Simulation triggered! Received HNI live inbound lead from ${randomName} (${randomCity}) seeking ${randomType}.`, 'success');
  };

  // New property form state
  const [newTitle, setNewTitle] = useState('');
  const [newDeveloper, setNewDeveloper] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newCity, setNewCity] = useState('Noida');
  const [newType, setNewType] = useState<'Residential' | 'Commercial' | 'Fractional' | 'Assured Return'>('Commercial');
  const [newMinInvestment, setNewMinInvestment] = useState<number>(45);
  const [newTotalValue, setNewTotalValue] = useState('85 Cr');
  const [newProjectedROI, setNewProjectedROI] = useState<number>(12.8);
  const [newRentalYield, setNewRentalYield] = useState<number>(8.0);
  const [newAppreciationRate, setNewAppreciationRate] = useState<number>(10.0);
  const [newReraId, setNewReraId] = useState('RERA-UP-NDA-2026-8801');
  const [newTagline, setNewTagline] = useState('Premium direct sourcing opportunity with pre-leased anchor corporate occupants');
  const [newDescription, setNewDescription] = useState('Sought-after corporate center located directly on upcoming transit highways. Unmatched infrastructure growth paired with 100% verified legal escrow compliance setups.');
  const [newIsVerified, setNewIsVerified] = useState(true);
  const [newIsPlot, setNewIsPlot] = useState(false);
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80');

  // Selected edit properties
  const [editingPropId, setEditingPropId] = useState<string | null>(null);
  const [editPriceValue, setEditPriceValue] = useState<number>(0);

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDeveloper || !newLocation || !newReraId) {
      onNotify("Please complete all required fields for the RERA registry schema.", "error");
      return;
    }

    const created: Property = {
      id: `prop-${Date.now()}`,
      title: newTitle,
      developer: newDeveloper,
      location: newLocation,
      city: newCity,
      type: newType,
      minInvestment: newMinInvestment,
      totalValue: newTotalValue,
      projectedROI: newProjectedROI,
      rentalYield: newRentalYield,
      appreciationRate: newAppreciationRate,
      reraId: newReraId,
      isVerified: newIsVerified,
      isPlot: newIsPlot,
      image: newImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      tagline: newTagline,
      description: newDescription,
      amenities: ['100% Backups', 'RERA Escrow Account', 'High Speed Lifts', 'Executive Lounges'],
      paymentPlan: {
        bookingAmount: '₹3,00,000 (Booking token)',
        stage1: '30% registration deposit',
        stage2: '70% slab-progress direct links'
      },
      completionYear: 2027,
      investorJiScore: 9.2,
      scores: { location: 5, builder: 4, rental: 4, growth: 5, liquidity: 4 }
    };

    onAddProperty(created);
    onNotify(`Successfully registered "${newTitle}" on the live global sitemaps & RERA verified list!`, 'success');

    // Reset standard state
    setNewTitle('');
    setNewDeveloper('');
    setNewLocation('');
    setNewReraId(`RERA-HRG-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const handlePriceUpdateAndVerifyAlerts = (propertyId: string, oldPrice: number, newPrice: number) => {
    onUpdateProperty(propertyId, { minInvestment: newPrice });
    setEditingPropId(null);
    onNotify(`Listing updated. Minimum investment adjusted from ₹${oldPrice}L to ₹${newPrice}L.`, 'success');

    // CHECK IF ANY PRICE ALERT THRESHOLD IS MET
    const activeAlertsOnThisProperty = priceAlerts.filter(a => a.propertyId === propertyId);
    
    activeAlertsOnThisProperty.forEach(alert => {
      // If new price drops below or reaches the alert targetPrice
      if (newPrice <= alert.targetPrice) {
        setTimeout(() => {
          onNotify(`⚡ ALERT TRIGGERED: Price threshold met for "${alert.email}"! Simulation email dispatched regarding new price: ₹${newPrice} Lakhs!`, 'success');
        }, 1500);
      }
    });
  };

  // Compute stats for analytics
  const verifiedCount = properties.filter(p => p.isVerified).length;
  const isPlotCount = properties.filter(p => p.isPlot).length;
  const totalLeadsPurchasedValue = leads.filter(l => l.isPurchased).reduce((sum, l) => sum + l.price, 0);

  return (
    <div id="admin-panel-portal" className="space-y-10 animate-fade-in text-slate-800 pb-16 font-sans">
      
      {/* ADMIN STATUS MONITOR BANNER */}
      <div className="bg-white text-slate-800 border border-slate-200 p-8 rounded-3xl space-y-4 relative overflow-hidden shadow-xs">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-50/50 rounded-full blur-3xl pointer-events-none"></div>
        <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full text-[10px] font-mono font-bold text-slate-600 uppercase tracking-wider">
          <Database className="w-4 h-4 text-slate-500" /> Platform Superuser Console
        </div>
        <h1 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight font-display tracking-tight">
          Admin Operations & Sourcing Controller
        </h1>
        <p className="text-slate-605 text-xs md:text-sm max-w-2xl leading-normal font-medium">
          Manage live RERA property registers, configure prices reactively to mock consumer price-loss alerts, review incoming investor broker leads, and examine platform analytical indices.
        </p>

        {/* Console tabs */}
        <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-5 mt-4 text-xs font-bold">
          <button
            onClick={() => setActiveAdminSubTab('listings')}
            className={`px-4 py-2 rounded-xl border transition-all cursor-pointer ${
              activeAdminSubTab === 'listings'
                ? 'bg-red-650 text-white border-red-655 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-red-655'
            }`}
          >
            📋 Manage Sourced Listings & RERA
          </button>
          <button
            onClick={() => setActiveAdminSubTab('leads')}
            className={`px-4 py-2 rounded-xl border transition-all cursor-pointer ${
              activeAdminSubTab === 'leads'
                ? 'bg-red-650 text-white border-red-655 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-red-655'
            }`}
          >
            🎯 Broker Lead Management ({leads.length})
          </button>
          <button
            onClick={() => setActiveAdminSubTab('brokers')}
            className={`px-4 py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1 ${
              activeAdminSubTab === 'brokers'
                ? 'bg-red-650 text-white border-red-655 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-red-655'
            }`}
          >
            💼 Broker Wallets & UPI Approvals
            {paymentRequests.filter(r => r.status === 'pending').length > 0 && (
              <span className="bg-amber-400 text-slate-900 rounded-full px-2 py-0.5 text-[9px] font-extrabold animate-pulse">
                {paymentRequests.filter(r => r.status === 'pending').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveAdminSubTab('analytics')}
            className={`px-4 py-2 rounded-xl border transition-all cursor-pointer ${
              activeAdminSubTab === 'analytics'
                ? 'bg-red-650 text-white border-red-655 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-red-655'
            }`}
          >
            📊 Sourcing Platform Indices
          </button>
          <button
            onClick={() => setActiveAdminSubTab('auto-fetch')}
            className={`px-4 py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
              activeAdminSubTab === 'auto-fetch'
                ? 'bg-red-650 text-white border-red-655 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-red-655'
            }`}
          >
            ⚡ AI Sourcing Engine
          </button>
        </div>
      </div>

      {activeAdminSubTab === 'listings' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LIST OF PROPERTIES TAB */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-slate-900 text-sm">
                Active National Platform Inventory ({properties.length} Sourced Assets)
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Real-time update active</span>
            </div>

            {/* Sourcing alerts reminder */}
            {priceAlerts.length > 0 && (
              <div className="p-3.5 bg-amber-50 text-amber-800 rounded-xl text-xs border border-amber-100 flex items-center justify-between gap-4">
                <span className="font-medium">
                  ⏰ <strong>Active Alert Monitor</strong>: There are {priceAlerts.length} subscriber price limits configured currently. Try reducing a property price to test the simulated email warning dispatcher!
                </span>
                <span className="text-[10px] uppercase font-bold bg-amber-100 font-mono px-2 py-0.5 border border-amber-200 rounded">Live</span>
              </div>
            )}

            <div className="overflow-x-auto bg-white rounded-3xl border border-slate-200 shadow-xs">
              <table className="w-full text-left text-xs min-w-[550px]" id="admin-listings-table">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-505 uppercase font-bold text-[10px] font-mono">
                  <tr>
                    <th className="p-4 text-slate-600">Property Area</th>
                    <th className="p-4 text-slate-600">Investment Price</th>
                    <th className="p-4 text-slate-600">ROI %</th>
                    <th className="p-4 text-slate-600">RERA Verification</th>
                    <th className="p-4 text-center text-slate-600">Settings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {properties.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <img src={p.image} className="w-10 h-10 rounded-lg object-cover border border-slate-200" alt="" referrerPolicy="no-referrer" />
                          <div>
                            <div className="font-bold text-slate-800">{p.title}</div>
                            <div className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                              <MapPin className="w-3 h-3 text-red-650" /> {p.city} &middot; RERA: {p.reraId}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="p-4 font-mono">
                        {editingPropId === p.id ? (
                          <div className="flex items-center gap-1.5">
                            <input 
                              type="number" 
                              required
                              className="bg-white border border-slate-300 rounded px-1.5 py-1 w-16 text-xs text-slate-800 outline-none focus:border-red-600"
                              value={editPriceValue}
                              onChange={(e) => setEditPriceValue(Number(e.target.value))}
                            />
                            <button
                              onClick={() => handlePriceUpdateAndVerifyAlerts(p.id, p.minInvestment, editPriceValue)}
                              className="p-1 px-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-mono font-bold cursor-pointer"
                              title="Confirm price adjustment"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => setEditingPropId(null)}
                              className="p-1 px-1.5 bg-slate-200 hover:bg-slate-300 text-slate-650 rounded font-mono font-bold cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <strong className="text-slate-900">₹{p.minInvestment}L+</strong>
                            <button
                              onClick={() => {
                                setEditingPropId(p.id);
                                setEditPriceValue(p.minInvestment);
                              }}
                              className="text-[10px] text-slate-400 hover:text-red-650 cursor-pointer"
                              title="Edit minimum threshold price"
                            >
                              ✏️
                            </button>
                          </div>
                        )}
                      </td>
                      
                      <td className="p-4 font-mono text-emerald-655 font-bold">
                        +{p.projectedROI || p.appreciationRate}%
                      </td>
                      
                      <td className="p-4">
                        <button
                          onClick={() => {
                            const updatedVal = !p.isVerified;
                            onUpdateProperty(p.id, { isVerified: updatedVal });
                            onNotify(`RERA registration status updated for "${p.title}"`, 'success');
                          }}
                          className={`px-2.5 py-1 rounded text-[9px] font-bold border transition-colors cursor-pointer ${
                            p.isVerified
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : 'bg-red-50 text-red-655 border-red-100'
                          }`}
                        >
                          {p.isVerified ? '✓ REGISTERED' : '⚠️ OUTSTANDING'}
                        </button>
                      </td>

                      <td className="p-4 text-center">
                        <button
                          onClick={() => {
                            onDeleteProperty(p.id);
                            onNotify(`Successfully archived sourcing license: "${p.title}" and unlinked it from portals.`, 'success');
                          }}
                          className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors border border-transparent hover:border-red-100 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SOURCING CREATE FORM PANEL */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-5 shadow-xs">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-red-650" /> Create Property Listing
            </h3>
            
            <form onSubmit={handleCreateProperty} className="space-y-3 text-xs text-slate-700 font-semibold">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Assigned Title Name</span>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. DLF Cyber Suites II"
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 outline-none focus:border-red-600 text-xs font-semibold placeholder-slate-400 text-slate-800 shadow-xs"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Developer</span>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. DLF"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 outline-none focus:border-red-600 text-xs font-semibold placeholder-slate-400 text-slate-800 shadow-xs"
                    value={newDeveloper}
                    onChange={(e) => setNewDeveloper(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">City Selection</span>
                  <div className="flex gap-1.5 items-center">
                    <select
                      className="flex-1 bg-white border border-slate-200 rounded-lg p-2 outline-none text-xs font-semibold text-slate-800"
                      value={newCity}
                      onChange={(e: any) => setNewCity(e.target.value)}
                    >
                      {allCities.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowAddCustomCity(!showAddCustomCity)}
                      className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors border border-slate-200 cursor-pointer"
                      title="Manage Custom Cities"
                    >
                      🗺️ + Add
                    </button>
                  </div>
                  {showAddCustomCity && (
                    <div className="mt-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg flex gap-1 items-center animate-fade-in">
                      <input 
                        type="text"
                        placeholder="Type city name"
                        value={newCustomCityInput}
                        onChange={(e) => setNewCustomCityInput(e.target.value)}
                        className="flex-1 bg-white border border-slate-200 rounded p-1 outline-none text-[11px] font-semibold text-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newCustomCityInput.trim()) return;
                          const trimmed = newCustomCityInput.trim();
                          if (!allCities.includes(trimmed)) {
                            saveCustomCities([...customCities, trimmed]);
                            onNotify(`City "${trimmed}" has been successfully listed!`, 'success');
                          }
                          setNewCity(trimmed);
                          setNewCustomCityInput('');
                          setShowAddCustomCity(false);
                        }}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Exact Location Coordinate</span>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Sector 62 Institutional Belt"
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 outline-none focus:border-red-600 text-xs font-semibold placeholder-slate-400 text-slate-800 shadow-xs"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Type Category</span>
                  <select
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 outline-none text-xs font-semibold text-slate-800"
                    value={newType}
                    onChange={(e: any) => setNewType(e.target.value)}
                  >
                    <option value="Commercial">Commercial</option>
                    <option value="Residential">Residential</option>
                    <option value="Fractional">Fractional</option>
                    <option value="Assured Return">Assured Return</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Min Investment (Lakhs)</span>
                  <input 
                    type="number" 
                    required
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 outline-none text-xs font-semibold text-slate-800 shadow-xs"
                    value={newMinInvestment}
                    onChange={(e) => setNewMinInvestment(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Projected ROI %</span>
                  <input 
                    type="number" 
                    step="0.1"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 outline-none text-xs font-semibold text-slate-800 shadow-xs"
                    value={newProjectedROI}
                    onChange={(e) => setNewProjectedROI(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">RERA Licensing ID</span>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. RERA-UP-NDA-2026-X"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 outline-none text-xs font-mono font-semibold text-slate-800 shadow-xs"
                    value={newReraId}
                    onChange={(e) => setNewReraId(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-4 py-2 border-y border-slate-100 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    checked={newIsVerified}
                    onChange={(e) => setNewIsVerified(e.target.checked)}
                    className="accent-red-650"
                  />
                  <span>RERA Verified</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    checked={newIsPlot}
                    onChange={(e) => setNewIsPlot(e.target.checked)}
                    className="accent-red-650"
                  />
                  <span>Freehold Land plot</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-red-650 hover:bg-slate-900 text-white font-bold transition-all p-3 rounded-xl cursor-pointer shadow-xs"
              >
                Disburse Live to Marketplace &arr;
              </button>
            </form>
          </div>

        </div>
      )}

      {activeAdminSubTab === 'leads' && (
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Users className="w-5 h-5 text-red-655" /> Executive Investor Leads Console ({leads.length} Active Profiles)
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Confidential Broker Ledger &middot; Fully Live</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowAddLeadModal(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-sans text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-xs flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Lead Manually
              </button>
              <button
                onClick={handleSimulateRandomLead}
                className="bg-red-650 hover:bg-red-700 text-white font-sans text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-xs flex items-center gap-1"
              >
                ⚡ Simulate Inbound HNI Lead
              </button>
              {leads.length > 0 && onClearLeads && (
                <button
                  onClick={onClearLeads}
                  className="bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 font-sans text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                >
                  Clear Ledger
                </button>
              )}
              {leads.length === 0 && onResetLeads && (
                <button
                  onClick={onResetLeads}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-sans text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                >
                  Reset to Demo Leads
                </button>
              )}
            </div>
          </div>

          {leads.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-300 rounded-3xl space-y-3">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-800 font-sans">No active buyer leads in live pool</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-medium">
                Start by simulating an inbound HNI lead with one click above, or fill in any lead capture/PDF/consultation form on the consumer website!
              </p>
              <button
                onClick={handleSimulateRandomLead}
                className="mt-2 bg-red-650 hover:bg-red-700 text-white font-sans text-[11px] font-bold px-4 py-2 rounded-lg transition-all cursor-pointer shadow-sm"
              >
                Simulate Your First Live HNI Lead 🚀
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leads.map(lead => (
                <div 
                  key={lead.id} 
                  onClick={() => setSelectedAdminDetailedLead(lead)}
                  className="bg-white border border-slate-200 p-6 rounded-3xl relative overflow-hidden space-y-4 shadow-xs hover:shadow-md transition-all cursor-pointer group"
                >
                  {/* Click to view tooltip badge */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-[8px] text-white font-bold font-mono px-2 py-1 rounded-sm pointer-events-none z-10">
                    CLICK TO VIEW DETAILS
                  </div>

                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{lead.buyerName}</h4>
                      <span className="text-[10px] text-slate-500 block font-mono">{lead.city} &middot; Sourced {lead.dateAdded}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${
                      lead.isPurchased
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-red-50 text-red-655 border border-red-100'
                    }`}>
                      {lead.isPurchased ? '🔒 UNLOCKED' : '🛒 PRICE LISTED'}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-650 font-medium">
                    <div>
                      <span className="text-slate-500 block uppercase text-[8px] font-mono">Location Match Target:</span>
                      <span className="text-slate-800 font-semibold">{lead.targetLocation}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block uppercase text-[8px] font-mono font-bold">Invest Class Preferences:</span>
                      <span className="text-red-655 font-bold">{lead.propertyType}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-slate-500 block text-[8px]">BUDGET LIMITS:</span>
                        <strong className="font-mono text-slate-900 text-[11px]">{lead.budget}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[8px]">COMPLIANCE SCORE:</span>
                        <strong className="font-mono text-emerald-700 text-[11px]">{lead.score}/100 Match</strong>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs font-bold font-mono" onClick={(e) => e.stopPropagation()}>
                    <span className="text-slate-500 font-sans">Unlock Fee: ₹{lead.price}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const updatedValue = !lead.isPurchased;
                        onUpdateLead(lead.id, { isPurchased: updatedValue });
                        onNotify(updatedValue ? `Lead unlocked. Phone contact details: ${lead.phonePrefix} xxx-xxx` : `Relocked lead parameters.`, 'success');
                      }}
                      className="bg-red-650 hover:bg-slate-900 text-white font-sans text-[10px] px-3.5 py-1.5 rounded-lg transition-all cursor-pointer shadow-xs"
                    >
                      {lead.isPurchased ? 'Lock Lead Details' : 'Simulate Purchase Unlock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeAdminSubTab === 'analytics' && (
        <div className="space-y-8 animate-fade-in text-slate-800 font-sans">
          
          {/* STATS WIDGET GRID */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-2 shadow-xs">
              <span className="text-xs uppercase font-bold text-slate-500 block tracking-widest font-mono">Total Directory Scale</span>
              <strong className="text-3xl font-black text-slate-900 font-mono">{properties.length}</strong>
              <p className="text-[10px] text-slate-500 font-sans font-medium">Active Sourced Properties</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-2 shadow-xs">
              <span className="text-xs uppercase font-bold text-slate-500 block tracking-widest font-mono">RERA Compliance Rate</span>
              <strong className="text-3xl font-black text-emerald-600 font-mono">
                {((verifiedCount / properties.length) * 100).toFixed(0)}%
              </strong>
              <p className="text-[10px] text-slate-500 font-sans font-medium">{verifiedCount} of {properties.length} Verified Online</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-2 shadow-xs">
              <span className="text-xs uppercase font-bold text-slate-500 block tracking-widest font-mono">Plotted Layouts</span>
              <strong className="text-3xl font-black text-cyan-600 font-mono">{isPlotCount}</strong>
              <p className="text-[10px] text-slate-500 font-sans font-medium font-sans">Yamuna Expressway & sacred Vrindavan</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-2 shadow-xs">
              <span className="text-xs uppercase font-bold text-slate-500 block tracking-widest font-mono">Broker Desk Revenue</span>
              <strong className="text-3xl font-black text-amber-600 font-mono">₹{totalLeadsPurchasedValue.toLocaleString('en-IN')}</strong>
              <p className="text-[10px] text-slate-500 font-sans font-medium">Simulated Lead Transactions</p>
            </div>
          </div>

          {/* DYNAMIC RATIOS CHARTS & MATRICES */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-6 shadow-xs">
            <h3 className="text-sm font-extrabold text-slate-900 font-mono flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <ClipboardCheck className="w-5 h-5 text-red-655" /> Comparative Regional Placement
            </h3>

            <div className="space-y-4">
              {Array.from(new Set(properties.map(p => p.city))).map(city => {
                const cityPropsCount = properties.filter(p => p.city === city).length;
                const percentage = (cityPropsCount / properties.length) * 100;
                if (cityPropsCount === 0) return null;

                return (
                  <div key={city} className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold text-slate-700">
                      <span>{city} Region</span>
                      <span className="font-mono text-slate-600">{cityPropsCount} Assets ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                      <div 
                        className="bg-red-650 h-full rounded-full transition-all" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {activeAdminSubTab === 'brokers' && (
        <div className="space-y-8 animate-fade-in text-slate-800 font-sans">
          
          {/* STATS WIDGETS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-2 shadow-xs">
              <span className="text-xs uppercase font-bold text-slate-500 block tracking-widest font-mono">Registered Brokers</span>
              <strong className="text-3xl font-black text-slate-900 font-mono">{brokersDb.length}</strong>
              <p className="text-[10px] text-slate-500 font-sans font-medium">Approved Partner Profiles</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-2 shadow-xs">
              <span className="text-xs uppercase font-bold text-slate-500 block tracking-widest font-mono">Pending UPI Audits</span>
              <strong className={`text-3xl font-black font-mono ${paymentRequests.filter(r => r.status === 'pending').length > 0 ? 'text-amber-600 animate-pulse' : 'text-slate-400'}`}>
                {paymentRequests.filter(r => r.status === 'pending').length}
              </strong>
              <p className="text-[10px] text-slate-500 font-sans font-medium">Requires Owner Manual Verify</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-2 shadow-xs">
              <span className="text-xs uppercase font-bold text-slate-500 block tracking-widest font-mono">Total Capital Credited</span>
              <strong className="text-3xl font-black text-emerald-600 font-mono">
                ₹{paymentRequests.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.amount, 0).toLocaleString('en-IN')}
              </strong>
              <p className="text-[10px] text-slate-500 font-sans font-medium">From Approved UPI Transactions</p>
            </div>
          </div>

          {/* SECTION 1: PENDING UPI APPROVALS */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-5 shadow-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-500" /> Pending UPI QR Deposit Requests
              </h3>
              <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 font-bold font-mono border border-amber-100 rounded animate-pulse">
                Escrow Audit Queue
              </span>
            </div>

            {paymentRequests.filter(r => r.status === 'pending').length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-xs">All clear! No pending payments</h4>
                <p className="text-[10px] text-slate-500 max-w-sm mx-auto leading-relaxed font-medium">
                  Brokers are required to scan the UPI QR code and enter their UTR number. When they do, requests will appear here for your manual check.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[600px]">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] font-mono">
                    <tr>
                      <th className="p-3">Broker Profile</th>
                      <th className="p-3">Top-up Amount</th>
                      <th className="p-3">Transaction UTR / Ref No.</th>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {paymentRequests.filter(r => r.status === 'pending').map(req => (
                      <tr key={req.id} className="hover:bg-slate-50/40">
                        <td className="p-3">
                          <div className="font-bold text-slate-800">{req.brokerName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{req.brokerEmail}</div>
                        </td>
                        <td className="p-3 font-extrabold text-emerald-600 font-mono">
                          ₹{req.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <code className="bg-slate-100 px-2 py-0.5 rounded font-bold font-mono text-xs border border-slate-200 text-slate-700">
                              {req.utrNumber}
                            </code>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(req.utrNumber);
                                onNotify(`Copied UTR ${req.utrNumber} to Clipboard!`, 'success');
                              }}
                              className="text-[9px] text-red-650 hover:underline font-bold cursor-pointer"
                            >
                              Copy
                            </button>
                          </div>
                        </td>
                        <td className="p-3 text-slate-400 text-[10px] font-mono">
                          {req.dateRequested}
                        </td>
                        <td className="p-3 text-center">
                          <div className="inline-flex gap-1.5">
                            <button
                              onClick={() => {
                                // APPROVE PAYMENT REQUEST
                                const updatedRequests = paymentRequests.map(r => r.id === req.id ? { ...r, status: 'approved' as const } : r);
                                savePaymentRequests(updatedRequests);

                                // Credit broker balance
                                const updatedBrokers = brokersDb.map(b => {
                                  if (b.id === req.brokerId) {
                                    return { ...b, walletBalance: b.walletBalance + req.amount };
                                  }
                                  return b;
                                });
                                saveBrokersToDb(updatedBrokers);

                                onNotify(`Approved ₹${req.amount.toLocaleString('en-IN')} deposit for ${req.brokerName}! Funds credited successfully.`, 'success');
                              }}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold cursor-pointer flex items-center gap-1 transition-all"
                            >
                              <Check className="w-3.5 h-3.5" /> Approve & Credit
                            </button>
                            <button
                              onClick={() => {
                                const updatedRequests = paymentRequests.map(r => r.id === req.id ? { ...r, status: 'rejected' as const } : r);
                                savePaymentRequests(updatedRequests);
                                onNotify(`UPI deposit request of ₹${req.amount} from ${req.brokerName} was rejected.`, 'error');
                              }}
                              className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-150 rounded-lg text-[10px] font-bold cursor-pointer flex items-center gap-1 transition-all"
                            >
                              <X className="w-3.5 h-3.5" /> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* SECTION 2: REGISTERED BROKERS DIRECTORY */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-red-655" /> Registered Broker & Advisor Directory ({brokersDb.length})
              </h3>
              <button
                onClick={() => {
                  localStorage.removeItem('brokers_database');
                  localStorage.removeItem('current_broker');
                  window.location.reload();
                }}
                className="text-[9px] text-slate-500 hover:text-red-600 border border-slate-200 px-2.5 py-1.5 rounded-lg font-bold font-sans hover:bg-red-50 transition-all cursor-pointer"
              >
                Reset Brokers Database
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] font-mono">
                  <tr>
                    <th className="p-3">Broker / Agency Details</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Current Wallet Balance</th>
                    <th className="p-3">Unlocked Leads</th>
                    <th className="p-3 text-center">Settings & Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {brokersDb.map(broker => (
                    <tr key={broker.id} className="hover:bg-slate-50/40">
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{broker.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">ID: {broker.id}</div>
                        <div className="text-[10px] bg-red-50 text-red-700 px-2 py-0.5 border border-red-100 rounded inline-block mt-1 font-bold">
                          🏢 {broker.agencyName || 'Independent Agent'}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold">{broker.email}</div>
                        <div className="text-[10px] text-slate-450 font-mono">Phone: +91 {broker.phone}</div>
                      </td>
                      <td className="p-3 font-mono">
                        {editingBrokerId === broker.id ? (
                          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <span className="text-slate-400">₹</span>
                            <input 
                              type="number" 
                              required
                              className="bg-white border border-slate-300 rounded px-2 py-1 w-20 text-xs text-slate-800 outline-none focus:border-red-600 font-bold"
                              value={editBrokerBalanceValue}
                              onChange={(e) => setEditBrokerBalanceValue(Number(e.target.value))}
                            />
                            <button
                              onClick={() => {
                                const updated = brokersDb.map(b => b.id === broker.id ? { ...b, walletBalance: editBrokerBalanceValue } : b);
                                saveBrokersToDb(updated);
                                setEditingBrokerId(null);
                                onNotify(`Updated wallet balance for ${broker.name} to ₹${editBrokerBalanceValue.toLocaleString()}`, 'success');
                              }}
                              className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-mono font-bold cursor-pointer"
                              title="Save Wallet Balance"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => setEditingBrokerId(null)}
                              className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-650 rounded font-mono font-bold cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <strong className="text-slate-900 text-sm">₹{broker.walletBalance.toLocaleString('en-IN')}</strong>
                            <button
                              onClick={() => {
                                setEditingBrokerId(broker.id);
                                setEditBrokerBalanceValue(broker.walletBalance);
                              }}
                              className="text-[10px] text-slate-400 hover:text-red-650 cursor-pointer p-1"
                              title="Edit Broker Balance Manually"
                            >
                              ✏️ Edit
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="font-mono text-slate-700">
                          <strong className="text-slate-900 font-bold">{broker.unlockedLeads?.length || 0}</strong> leads
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => {
                            const updated = brokersDb.filter(b => b.id !== broker.id);
                            saveBrokersToDb(updated);
                            onNotify(`Terminated broker account for ${broker.name}.`, 'error');
                          }}
                          className="px-2.5 py-1 text-[10px] bg-red-50 hover:bg-red-100 text-red-600 border border-red-150 rounded-lg font-bold cursor-pointer transition-all"
                        >
                          Delete Account
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 3: TRANSACTION AUDIT LEDGER */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-xs">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <ClipboardCheck className="w-5 h-5 text-slate-500" /> Historic Payment Auditing Journal
            </h3>

            {paymentRequests.filter(r => r.status !== 'pending').length === 0 ? (
              <p className="text-slate-450 text-[11px] italic">No archived transaction receipts available in historic ledger.</p>
            ) : (
              <div className="overflow-y-auto max-h-60 space-y-2 font-mono">
                {paymentRequests.filter(r => r.status !== 'pending').map(req => (
                  <div key={req.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-slate-800">₹{req.amount.toLocaleString('en-IN')} top-up by {req.brokerName}</div>
                      <div className="text-[10px] text-slate-400">UTR Hash: {req.utrNumber} &middot; Requested {req.dateRequested}</div>
                    </div>
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono border ${
                      req.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-150' : 'bg-red-50 text-red-600 border-red-150'
                    }`}>
                      {req.status === 'approved' ? '✓ APPROVED' : '✕ REJECTED'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {activeAdminSubTab === 'auto-fetch' && (
        <div className="space-y-8 animate-fade-in text-slate-800 font-sans">
          
          {/* CONTROL DASHBOARD */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-6 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-50/45 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  ⚡ AdvisorJi National RERA Registry Import & AI Vetting
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Connect live to verified National RERA registries and development indexes to auto-import properties with full legal verification.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCustomCity(!showAddCustomCity)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  🗺️ {showAddCustomCity ? "Close City Manager" : "+ Add New City"}
                </button>
              </div>
            </div>

            {showAddCustomCity && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 animate-fade-in max-w-sm">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block text-left">List a New Indian City</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter city name (e.g. Indore, Kochi)"
                    value={newCustomCityInput}
                    onChange={(e) => setNewCustomCityInput(e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-red-655"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newCustomCityInput.trim()) return;
                      const trimmed = newCustomCityInput.trim();
                      if (!allCities.includes(trimmed)) {
                        saveCustomCities([...customCities, trimmed]);
                        onNotify(`City "${trimmed}" has been successfully added to the active portfolio index!`, 'success');
                      } else {
                        onNotify(`City "${trimmed}" is already present.`, 'error');
                      }
                      setFetchCity(trimmed);
                      setNewCustomCityInput('');
                      setShowAddCustomCity(false);
                    }}
                    className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-xs"
                  >
                    Add & Select
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 font-medium text-left">
                  Adding a custom city registers it in both the admin property creator and the homepage user-facing search engine.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-1.5 text-left">
                <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Target Indian City</span>
                <select
                  value={fetchCity}
                  onChange={(e) => setFetchCity(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none text-xs font-bold text-slate-800 cursor-pointer"
                >
                  {allCities.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 text-left">
                <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Asset Sourcing Category</span>
                <select
                  value={fetchCategory}
                  onChange={(e: any) => setFetchCategory(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none text-xs font-bold text-slate-800 cursor-pointer"
                >
                  <option value="Residential">Residential Apartments & Plots</option>
                  <option value="Commercial">Commercial Offices & Retail</option>
                  <option value="Fractional">Fractional Grade-A Co-ownership</option>
                  <option value="Assured Return">Assured Return & Pre-leased Assets</option>
                </select>
              </div>

              <div>
                <button
                  type="button"
                  disabled={isFetching}
                  onClick={async () => {
                    setIsFetching(true);
                    setFetchWarning('');
                    setFetchSource('');
                    try {
                      const res = await fetch('/api/gemini/fetch-projects', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ city: fetchCity, category: fetchCategory })
                      });
                      const data = await res.json();
                      if (data.projects) {
                        setFetchedProjects(data.projects);
                        setFetchSource(data.source || 'National Pre-Vetted Index');
                        if (data.warning) setFetchWarning(data.warning);
                        onNotify(`Fetched 5 verified RERA properties for ${fetchCity}!`, 'success');
                      } else {
                        throw new Error(data.error || 'Invalid API response');
                      }
                    } catch (err: any) {
                      console.error(err);
                      onNotify('Vetting pipeline encountered an issue. Reverted to dynamic pre-vetted data.', 'error');
                    } finally {
                      setIsFetching(false);
                    }
                  }}
                  className="w-full bg-red-650 hover:bg-red-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer shadow-xs hover:shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isFetching ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Vetting RERA registries...
                    </>
                  ) : (
                    <>⚡ Run National Registry Vetting</>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* FETCHED RESULTS DISPLAY */}
          {fetchedProjects.length > 0 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
                <div className="text-left">
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    📦 Sourced Projects Index ({fetchedProjects.length} Verified Records)
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Sourced via: <span className="text-red-600 font-mono font-bold bg-red-50 border border-red-100 px-1.5 py-0.5 rounded text-[10px]">{fetchSource}</span>
                    {fetchWarning && <span className="text-amber-600 font-medium ml-2">({fetchWarning})</span>}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    let count = 0;
                    fetchedProjects.forEach(p => {
                      // Check for duplicates in properties
                      if (!properties.some(prop => prop.title.toLowerCase() === p.title.toLowerCase() && prop.city.toLowerCase() === p.city.toLowerCase())) {
                        onAddProperty(p);
                        count++;
                      }
                    });
                    if (count > 0) {
                      onNotify(`Imported ${count} new projects into active Live National Listings!`, 'success');
                    } else {
                      onNotify('All fetched projects have already been imported.', 'error');
                    }
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1.5 self-start sm:self-center"
                >
                  📥 Import All {fetchedProjects.length} Listings
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fetchedProjects.map(project => {
                  const alreadyImported = properties.some(
                    p => p.title.toLowerCase() === project.title.toLowerCase() && p.city.toLowerCase() === project.city.toLowerCase()
                  );

                  return (
                    <div key={project.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between text-left">
                      <div>
                        {/* Image banner */}
                        <div className="relative h-40 w-full bg-slate-100">
                          <img 
                            src={project.image} 
                            alt={project.title} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-3 left-3 bg-red-650 text-white px-2.5 py-1 rounded-full text-[9px] font-mono font-black uppercase tracking-wider shadow-xs">
                            {project.type}
                          </div>
                          <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-[9px] font-bold font-mono">
                            Score: {project.investorJiScore}
                          </div>
                        </div>

                        {/* Content details */}
                        <div className="p-5 space-y-4">
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block">
                              📍 {project.location}, {project.city}
                            </span>
                            <h5 className="font-extrabold text-slate-900 text-sm leading-tight">
                              {project.title}
                            </h5>
                            <p className="text-[11px] text-slate-500 font-semibold italic">
                              By {project.developer}
                            </p>
                          </div>

                          <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-3">
                            {project.description}
                          </p>

                          <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-150 text-center font-mono">
                            <div>
                              <span className="text-[8px] uppercase text-slate-400 font-sans block">Min Invest</span>
                              <strong className="text-slate-800 text-[11px] font-black">₹{project.minInvestment} L</strong>
                            </div>
                            <div>
                              <span className="text-[8px] uppercase text-slate-400 font-sans block">Proj. ROI</span>
                              <strong className="text-emerald-600 text-[11px] font-black">{project.projectedROI}%</strong>
                            </div>
                            <div>
                              <span className="text-[8px] uppercase text-slate-400 font-sans block">Yield</span>
                              <strong className="text-slate-800 text-[11px] font-black">{project.rentalYield}%</strong>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[9px] text-slate-400 font-mono block">RERA Status</span>
                            <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-150 px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono">
                              🛡️ APPROVED &middot; {project.reraId}
                            </div>
                          </div>

                          <div className="space-y-1.5 pt-1">
                            <span className="text-[9px] text-slate-400 font-mono block font-sans font-semibold">Amenities Included</span>
                            <div className="flex flex-wrap gap-1">
                              {project.amenities.map(a => (
                                <span key={a} className="bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded text-[9px] font-medium">
                                  {a}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Import actions footer */}
                      <div className="p-5 border-t border-slate-100 bg-slate-50/50">
                        {alreadyImported ? (
                          <div className="w-full text-center py-2 bg-slate-100 border border-slate-200 text-slate-400 font-bold text-xs rounded-xl">
                            ✓ Sourced & Imported Into Inventory
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              onAddProperty(project);
                              onNotify(`Successfully imported "${project.title}" into live portal directories!`, 'success');
                            }}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 rounded-xl transition-all cursor-pointer shadow-xs text-center flex items-center justify-center gap-1"
                          >
                            📥 Import to Live Portal
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {showAddLeadModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in text-slate-800">
          <div className="bg-white rounded-3xl w-full max-w-md border border-slate-200 overflow-hidden shadow-2xl">
            <div className="bg-[#0f1524] p-5 text-white flex justify-between items-center border-b border-slate-800">
              <div>
                <span className="text-[9px] uppercase font-bold text-red-500 block font-mono">Broker CRM Desk</span>
                <h3 className="font-extrabold text-base tracking-tight text-white">Add HNI Sourcing Lead Manually</h3>
              </div>
              <button 
                onClick={() => setShowAddLeadModal(false)}
                className="text-white/85 hover:text-white font-bold text-2xl cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateManualLead} className="p-6 space-y-4 text-xs font-sans font-bold text-slate-700">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">HNI Client Full Name / Entity</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Dr. Rajesh Khanna"
                  value={leadNameInput}
                  onChange={(e) => setLeadNameInput(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-white border border-slate-200 p-2.5 rounded-lg outline-none focus:border-red-650"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">WhatsApp Mobile Contact (+91)</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={leadPhoneInput}
                  onChange={(e) => setLeadPhoneInput(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-white border border-slate-200 p-2.5 rounded-lg outline-none focus:border-red-650"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Demographic City</label>
                  <select 
                    value={leadCityInput}
                    onChange={(e) => setLeadCityInput(e.target.value)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 p-2.5 rounded-lg outline-none focus:border-red-650 font-sans"
                  >
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Mumbai Area">Mumbai Area</option>
                    <option value="Bengaluru Sector">Bengaluru Sector</option>
                    <option value="Pune Region">Pune Region</option>
                    <option value="NRI Investment Pool">NRI Investment Pool</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Budget Spectrum</label>
                  <select 
                    value={leadBudgetInput}
                    onChange={(e) => setLeadBudgetInput(e.target.value)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 p-2.5 rounded-lg outline-none focus:border-red-650 font-sans"
                  >
                    <option value="₹80 Lakhs - ₹1.5 Cr">₹80L - ₹1.5 Cr</option>
                    <option value="₹1.5 Cr - ₹3 Cr">₹1.5 Cr - ₹3 Cr</option>
                    <option value="₹3 Cr - ₹5 Cr">₹3 Cr - ₹5 Cr</option>
                    <option value="₹5 Cr - ₹10 Cr">₹5 Cr - ₹10 Cr</option>
                    <option value="₹10 Cr+">₹10 Cr+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Asset Class Category</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Fractional Co-living, Pre-Leased Retail"
                  value={leadTypeInput}
                  onChange={(e) => setLeadTypeInput(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-white border border-slate-200 p-2.5 rounded-lg outline-none focus:border-red-650"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Target Sourcing Hotspot Focus</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Golf Course Road, Whitefield IT Corridor"
                  value={leadLocationInput}
                  onChange={(e) => setLeadLocationInput(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-white border border-slate-200 p-2.5 rounded-lg outline-none focus:border-red-650"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-red-650 hover:bg-red-700 text-white font-sans text-xs py-3 rounded-lg font-bold transition-all cursor-pointer shadow-md"
              >
                Register Live Broker Lead
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN PRIVILEGED LEAD DOSSIER MODAL */}
      {selectedAdminDetailedLead && (() => {
        const liveLead = leads.find(l => l.id === selectedAdminDetailedLead.id) || selectedAdminDetailedLead;
        return (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in text-slate-800">
            <div className="bg-white rounded-3xl w-full max-w-lg border border-slate-200 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="bg-[#0f1524] p-6 text-white flex justify-between items-center border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700">
                    <Users className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-red-500 block font-mono">
                      🔑 Brokerage Owner Privileged Ledger View
                    </span>
                    <h3 className="font-extrabold text-lg tracking-tight text-white">
                      {liveLead.buyerName}
                    </h3>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedAdminDetailedLead(null)}
                  className="text-white/80 hover:text-white font-bold text-2xl cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                >
                  &times;
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6 overflow-y-auto text-xs font-sans">
                {/* Score Profile Banner */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-extrabold block">Admin Lead Tracking Reference</span>
                    <strong className="text-slate-900 font-mono text-xs">SYS-LID-{liveLead.id.toUpperCase()}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase font-extrabold block font-bold">Matching Compliance Rank</span>
                    <strong className="text-emerald-700 font-extrabold text-xs block">
                      {liveLead.score}% Qualified HNI Target
                    </strong>
                  </div>
                </div>

                {/* Sourcing preferences */}
                <div className="space-y-3">
                  <h4 className="font-extrabold text-slate-900 uppercase text-[10px] tracking-wider border-b border-slate-100 pb-1.5 flex items-center gap-1">
                    🎯 Client Interest Spectrum
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">Demographic Origin</span>
                      <span className="text-slate-800 font-bold text-xs">{liveLead.city}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">Timeframe Goal</span>
                      <span className="text-slate-800 font-bold text-xs">{liveLead.timeframe || 'Immediate buying (verified)'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">Target Location</span>
                      <span className="text-slate-800 font-bold text-xs">{liveLead.targetLocation}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">Maximum Budget Spectrum</span>
                      <span className="text-red-655 font-bold text-xs">{liveLead.budget}</span>
                    </div>
                  </div>
                  <div className="pt-1">
                    <span className="text-[9px] text-slate-400 block uppercase font-bold font-semibold">Asset Class Strategy Preference</span>
                    <span className="text-slate-900 font-extrabold text-xs bg-slate-100 py-1 px-2.5 rounded-lg inline-block mt-0.5 border border-slate-200">
                      🏡 {liveLead.propertyType}
                    </span>
                  </div>
                </div>

                {/* Contact Dossier - ALWAYS full info for Admin/Broker owners! */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-extrabold text-slate-900 uppercase text-[10px] tracking-wider border-b border-slate-100 pb-1.5 flex items-center gap-1">
                    📞 Sourced Privileged Contacts
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Phone */}
                      <div className="bg-[#f0f9ff] border border-blue-150 p-3.5 rounded-xl flex items-center justify-between gap-3">
                        <div>
                          <span className="text-[9px] text-blue-700 block uppercase font-bold">Mobile Contact</span>
                          <strong className="text-slate-900 font-mono text-xs">
                            {liveLead.fullPhone || `${liveLead.phonePrefix} ${liveLead.phoneSuffix.replace(/•/g, '9')}`}
                          </strong>
                        </div>
                        <div className="flex gap-1.5">
                          <button 
                            onClick={() => {
                              const ph = liveLead.fullPhone || `${liveLead.phonePrefix} ${liveLead.phoneSuffix.replace(/•/g, '9')}`;
                              navigator.clipboard.writeText(ph);
                              onNotify("Copied phone contact details to Admin Clipboard!", "success");
                            }}
                            className="p-1.5 bg-white hover:bg-blue-100 text-blue-800 rounded-md border border-blue-200 shadow-xs cursor-pointer"
                            title="Copy to Clipboard"
                          >
                            Copy
                          </button>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="bg-[#f0f9ff] border border-blue-150 p-3.5 rounded-xl flex items-center justify-between gap-3">
                        <div>
                          <span className="text-[9px] text-blue-700 block uppercase font-bold">Direct Email Address</span>
                          <strong className="text-slate-900 font-mono text-xs block truncate max-w-[130px]" title={liveLead.email}>
                            {liveLead.email || `${liveLead.buyerName.toLowerCase().replace(/\s+/g, '')}@hni-investor.in`}
                          </strong>
                        </div>
                        <button 
                          onClick={() => {
                            const em = liveLead.email || `${liveLead.buyerName.toLowerCase().replace(/\s+/g, '')}@hni-investor.in`;
                            navigator.clipboard.writeText(em);
                            onNotify("Copied contact email address to Admin Clipboard!", "success");
                          }}
                          className="p-1.5 bg-white hover:bg-blue-100 text-blue-800 rounded-md border border-blue-200 shadow-xs cursor-pointer"
                        >
                          Copy
                        </button>
                      </div>
                    </div>

                    {/* Sourced query */}
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
                      <span className="text-[9px] text-slate-500 uppercase font-extrabold block">Inbound Sourcing Message:</span>
                      <p className="text-slate-800 font-medium italic text-xs leading-relaxed">
                        "{liveLead.query || `Requested exclusive prospectus. Expressed serious interest in premium property sourcing options with strong asset appreciation in ${liveLead.targetLocation}.`}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between gap-4 shrink-0 font-sans font-bold">
                <span className="text-[10px] text-slate-500">Live Admin Console</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const updatedValue = !liveLead.isPurchased;
                      onUpdateLead(liveLead.id, { isPurchased: updatedValue });
                      onNotify(updatedValue ? `Lead marked as unlocked in general wallet pool.` : `Lead marked as locked in general wallet pool.`, 'success');
                    }}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      liveLead.isPurchased 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-red-50 text-red-650 border-red-200'
                    }`}
                  >
                    {liveLead.isPurchased ? '🔒 Simulate Lock' : '🛒 Simulate Unlock'}
                  </button>
                  <button
                    onClick={() => setSelectedAdminDetailedLead(null)}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] px-4 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Close Dossier
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
