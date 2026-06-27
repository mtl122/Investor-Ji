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
import { Property, Lead } from '../types';

interface AdminPanelProps {
  properties: Property[];
  onAddProperty: (newProp: Property) => void;
  onUpdateProperty: (id: string, updatedFields: Partial<Property>) => void;
  onDeleteProperty: (id: string) => void;
  leads: Lead[];
  onUpdateLead: (id: string, updatedFields: Partial<Lead>) => void;
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
  priceAlerts,
  onNotify
}: AdminPanelProps) {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'listings' | 'leads' | 'analytics'>('listings');

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
        <div className="flex gap-2 border-t border-slate-100 pt-5 mt-4 text-xs font-bold">
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
            onClick={() => setActiveAdminSubTab('analytics')}
            className={`px-4 py-2 rounded-xl border transition-all cursor-pointer ${
              activeAdminSubTab === 'analytics'
                ? 'bg-red-650 text-white border-red-655 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-red-655'
            }`}
          >
            📊 Sourcing Platform Indices
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
                            if (confirm(`Archive sourcing license for: ${p.title}?`)) {
                              onDeleteProperty(p.id);
                              onNotify(`Successfully unlinked listing from live portals.`, 'success');
                            }
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
                  <select
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 outline-none text-xs font-semibold text-slate-800"
                    value={newCity}
                    onChange={(e: any) => setNewCity(e.target.value)}
                  >
                    <option value="Noida">Noida</option>
                    <option value="Gurgaon">Gurgaon</option>
                    <option value="Vrindavan">Vrindavan</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Goa">Goa</option>
                    <option value="Pune">Pune</option>
                    <option value="Faridabad">Faridabad</option>
                    <option value="Mathura">Mathura</option>
                    <option value="Dholera SIR">Dholera SIR</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Kolkata">Kolkata</option>
                    <option value="Ahmedabad">Ahmedabad</option>
                  </select>
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
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Users className="w-5 h-5 text-red-655" /> Executive Investor Leads Console ({leads.length} Active Profiles)
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Confidential Broker Ledger</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leads.map(lead => (
              <div key={lead.id} className="bg-white border border-slate-200 p-6 rounded-3xl relative overflow-hidden space-y-4 shadow-xs">
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

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs font-bold font-mono">
                  <span className="text-slate-500 font-sans">Unlock Fee: ₹{lead.price}</span>
                  <button
                    onClick={() => {
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

    </div>
  );
}
