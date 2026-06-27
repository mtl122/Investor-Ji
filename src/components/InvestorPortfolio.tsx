import React, { useState } from 'react';
import { 
  Briefcase, 
  Trash2, 
  Percent, 
  MapPin, 
  DollarSign, 
  Award, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle,
  Bell,
  Mail,
  ShieldCheck,
  Scale,
  Sparkles,
  Sliders,
  HelpCircle,
  Clock
} from 'lucide-react';
import { Property } from '../types';

interface InvestorPortfolioProps {
  properties: Property[];
  favoritedIds: string[];
  compareIds: string[];
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (id: string) => void;
  priceAlerts: Array<{ id: string; propertyId: string; email: string; targetPrice: number }>;
  onRemoveAlert: (id: string) => void;
  isSubscribedToWeekly: boolean;
  onToggleWeeklySubscription: (email: string) => void;
  subscribedEmail: string;
  onSelectProperty: (property: Property) => void;
  onNavigateToTab: (tab: any) => void;
  onNotify: (message: string, type: 'success' | 'error') => void;
}

export function InvestorPortfolio({
  properties,
  favoritedIds,
  compareIds,
  onToggleFavorite,
  onToggleCompare,
  priceAlerts,
  onRemoveAlert,
  isSubscribedToWeekly,
  onToggleWeeklySubscription,
  subscribedEmail,
  onSelectProperty,
  onNavigateToTab,
  onNotify
}: InvestorPortfolioProps) {
  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'settings'>('analytics');
  
  // Settings tab newsletter email
  const [newsEmail, setNewsEmail] = useState(subscribedEmail || 'MTLENTERTAINMENTINDIA@gmail.com');

  // Load properties based on favorited state
  const favoritedProperties = properties.filter(p => favoritedIds.includes(p.id));
  const comparedProperties = properties.filter(p => compareIds.includes(p.id));

  // Combine both arrays of interest for calculation
  const uniqueSelectedIds = Array.from(new Set([...favoritedIds, ...compareIds]));
  const selectedProperties = properties.filter(p => uniqueSelectedIds.includes(p.id));

  // Portfolio aggregates
  const totalMinInvestment = selectedProperties.reduce((sum, p) => sum + p.minInvestment, 0);

  // Weighted ROI
  const weightedROI = totalMinInvestment > 0 
    ? (selectedProperties.reduce((sum, p) => sum + (p.minInvestment * (p.projectedROI || p.appreciationRate || 10)), 0) / totalMinInvestment) 
    : 0;

  // Weighted Yield
  const weightedYield = totalMinInvestment > 0
    ? (selectedProperties.reduce((sum, p) => sum + (p.minInvestment * (p.rentalYield || 4)), 0) / totalMinInvestment)
    : 0;

  // Blended Appreciation Rate
  const weightedAppreciation = totalMinInvestment > 0
    ? (selectedProperties.reduce((sum, p) => sum + (p.minInvestment * p.appreciationRate), 0) / totalMinInvestment)
    : 0;

  const annualRentalCashflow = (totalMinInvestment * (weightedYield / 100)); // in Lakhs
  const monthlyRentalCashflow = (annualRentalCashflow / 12) * 100000; // in Rupees

  // Stamp duty, RERA, Escrow cost allocations
  const stampDutyEstimate = totalMinInvestment * 0.06; // 6% in Lakhs
  const reraLegalEstimate = totalMinInvestment * 0.01; // 1% in Lakhs
  const escrowSetupFee = totalMinInvestment > 0 ? 0.5 : 0; // ₹50,000 in Lakhs
  const totalAcquisitionOutlay = totalMinInvestment + stampDutyEstimate + reraLegalEstimate + escrowSetupFee;

  // Sourcing Simulation multipliers
  const [simulatedBudget, setSimulatedBudget] = useState<number>(totalMinInvestment || 100);

  const handleSimulatedBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNotify(`Simulation updated. Blended annual return indices projected at ₹${((simulatedBudget * (weightedROI / 100))).toFixed(2)} Lakhs under standard compound metrics!`, 'success');
  };

  const handleWeeklyNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsEmail) {
      onNotify("Please provide a valid email identity.", "error");
      return;
    }
    onToggleWeeklySubscription(newsEmail);
  };

  const formatLakhs = (val: number) => {
    if (val >= 100) {
      return `₹${(val / 100).toFixed(2)} Cr`;
    }
    return `₹${val.toFixed(1)} Lakhs`;
  };

  return (
    <div id="investor-portfolio-view" className="space-y-10 animate-fade-in text-slate-800">
      
      {/* HEADER HERO AREA */}
      <div className="bg-white border border-slate-200 p-8 rounded-3xl space-y-4 relative overflow-hidden shadow-xs">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-50/50 rounded-full blur-3xl pointer-events-none"></div>
        <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold text-red-655 uppercase tracking-wider">
          <Briefcase className="w-4 h-4 text-red-600" /> My Investor Workspace
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-tight font-display tracking-tight">
          Sourced Investment Portfolio
        </h1>
        <p className="text-slate-600 text-xs md:text-sm max-w-2xl leading-relaxed font-semibold">
          Monitor your favorited, compared, and target compliance assets. Explore predictive blended returns, acquisition cost allocations, and live RERA notifications in an institutional single pane.
        </p>

        {/* Workspace Sub-tabs */}
        <div className="flex gap-2 border-t border-slate-100 pt-5 mt-4 text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`px-4 py-2 rounded-xl border transition-all cursor-pointer ${
              activeSubTab === 'analytics'
                ? 'bg-red-650 text-white border-red-655 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-red-650'
            }`}
          >
            📊 Portfolio Sourcing Analytics
          </button>
          <button
            onClick={() => setActiveSubTab('settings')}
            className={`px-4 py-2 rounded-xl border transition-all cursor-pointer ${
              activeSubTab === 'settings'
                ? 'bg-red-650 text-white border-red-655 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-red-650'
            }`}
          >
            ⚙️ Alert Rules & Settings
          </button>
        </div>
      </div>

      {activeSubTab === 'analytics' ? (
        <div className="space-y-10">
          
          {selectedProperties.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center space-y-4 max-w-3xl mx-auto shadow-xs">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
              <h2 className="text-lg font-bold text-slate-850">Your Portfolio is Empty</h2>
              <p className="text-xs text-slate-500 font-medium">
                To activate calculations, simply go to the **Properties Catalog** or **Commercial Sourcing Tab** and click the Compare or Favorite bookmark indices on individual listings.
              </p>
              <button
                onClick={() => onNavigateToTab('properties')}
                className="bg-red-650 hover:bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
              >
                Assemble Assets Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* PRIMARY MATH AND CHARTS ROW */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* 1. AGGREGATE STATS STRIP */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                  <div className="space-y-1 p-2">
                    <span className="text-[9px] uppercase font-bold text-slate-500 block tracking-wider">Target Capital</span>
                    <strong className="text-xl font-bold text-slate-900 font-mono">{formatLakhs(totalMinInvestment)}</strong>
                    <div className="text-[10px] text-slate-500 font-sans">Active Sourced Floor</div>
                  </div>
                  
                  <div className="space-y-1 p-2 border-l border-slate-100 pl-4">
                    <span className="text-[9px] uppercase font-bold text-slate-500 block tracking-wider">Blended ROI</span>
                    <strong className="text-xl font-bold text-emerald-600 font-mono">+{weightedROI.toFixed(2)}%</strong>
                    <div className="text-[10px] text-slate-500 font-sans">Weighted Projection</div>
                  </div>

                  <div className="space-y-1 p-2 border-l border-slate-100 pl-4">
                    <span className="text-[9px] uppercase font-bold text-slate-500 block tracking-wider">Rental Yield</span>
                    <strong className="text-xl font-bold text-amber-600 font-mono">{weightedYield.toFixed(2)}%</strong>
                    <div className="text-[10px] text-slate-500 font-sans">Gross Post-Escrow</div>
                  </div>

                  <div className="space-y-1 p-2 border-l border-slate-100 pl-4">
                    <span className="text-[9px] uppercase font-bold text-slate-500 block tracking-wider">Avg Appreciation</span>
                    <strong className="text-xl font-bold text-sky-650 font-mono">+{weightedAppreciation.toFixed(2)}%</strong>
                    <div className="text-[10px] text-slate-500 font-sans">Compounded YOY</div>
                  </div>
                </div>

                {/* 2. SPECIFIC SOURCE LISTINGS */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-xs">
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-red-650" /> Active Workspace Inventory
                  </h3>

                  <div className="space-y-4">
                    {selectedProperties.map(p => {
                      const isFavorited = favoritedIds.includes(p.id);
                      const isComparing = compareIds.includes(p.id);
                      
                      return (
                        <div key={p.id} className="bg-slate-50/50 rounded-2xl p-4.5 border border-slate-200 hover:border-red-400 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all">
                          <div className="flex gap-4 items-center">
                            <img src={p.image} className="w-16 h-16 rounded-xl object-cover border border-slate-200" alt={p.title} referrerPolicy="no-referrer" />
                            <div>
                              <div className="text-xs text-slate-500 flex items-center gap-1.5 font-mono">
                                <MapPin className="w-3.5 h-3.5 text-red-600" /> {p.city} &middot; RERA verified
                              </div>
                              <h4 onClick={() => onSelectProperty(p)} className="font-extrabold text-slate-800 hover:text-red-650 transition-colors cursor-pointer text-sm font-sans">
                                {p.title}
                              </h4>
                              <div className="flex gap-2 mt-1.5 flex-wrap">
                                <span className="text-[9px] bg-slate-100 border border-slate-200 font-bold px-2 py-0.5 rounded text-slate-750 font-sans">{p.type}</span>
                                <span className="text-[9px] bg-red-50 border border-red-100 text-red-700 font-bold px-2 py-0.5 rounded font-sans">RERA ID # {p.reraId.split('-')[2] || p.id}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-6 justify-between w-full md:w-auto border-t md:border-0 pt-3 md:pt-0 border-slate-100">
                            <div className="text-right">
                              <span className="text-[9px] block text-slate-400 uppercase font-black">Allocation</span>
                              <strong className="text-xs font-mono font-bold text-slate-900">₹{p.minInvestment} Lakhs</strong>
                            </div>
                            <div className="text-right">
                              <span className="text-[9px] block text-slate-400 uppercase font-black">ROI Index</span>
                              <strong className="text-xs font-mono font-bold text-emerald-600">+{p.projectedROI || p.appreciationRate}%</strong>
                            </div>
                            <div className="flex gap-1.5">
                              {/* Favorite remove */}
                              <button
                                onClick={() => onToggleFavorite(p.id)}
                                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                                  isFavorited
                                    ? 'bg-red-50 text-red-600 border-red-200'
                                    : 'bg-white text-slate-400 border-slate-200 hover:text-red-600'
                                }`}
                                title="Remove favorite bookmark"
                              >
                                ★
                              </button>
                              {/* Compare remove */}
                              <button
                                onClick={() => onToggleCompare(p.id)}
                                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                                  isComparing
                                    ? 'bg-blue-50 text-blue-600 border-blue-200'
                                    : 'bg-white text-slate-400 border-slate-200 hover:text-blue-600'
                                }`}
                                title="Toggle compare tag"
                              >
                                <Scale className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. SIMULATED STRATEGY PLANNING */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-xs">
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-red-650" /> Sourcing Simulation Calculator
                  </h3>
                  <p className="text-[11px] text-slate-500 font-semibold leading-normal">
                    Use the simulated capital slider below to forecast what happens if you deploy more capital across your selected assets under InvestorJi's weighted return indices.
                  </p>

                  <form onSubmit={handleSimulatedBudgetSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold font-mono">
                        <span className="text-slate-600">Simulated Sourcing Budget:</span>
                        <span className="text-red-655 text-sm font-bold">{formatLakhs(simulatedBudget)}</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="1000" 
                        step="5"
                        value={simulatedBudget}
                        onChange={(e) => setSimulatedBudget(Number(e.target.value))}
                        className="w-full accent-red-650 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-mono">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Annual Cash Return:</span>
                        <strong className="text-emerald-700 text-sm">{formatLakhs(simulatedBudget * (weightedROI / 100))}</strong>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Monthly Cash Stream:</span>
                        <strong className="text-emerald-700 text-sm">₹{((simulatedBudget * (weightedYield / 100) / 12) * 100000).toLocaleString('en-IN', { maximumFractionDigits: 0 })}/mo</strong>
                      </div>
                    </div>
                  </form>
                </div>

              </div>

              {/* OUTLAY COST BREAKDOWN SIDEBAR */}
              <div className="space-y-6">
                
                {/* 1. VERIFIED INVESTMENT COSTS SCHEME */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-5 shadow-xs relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-50/50 rounded-full blur-xl pointer-events-none"></div>
                  
                  <h3 className="text-xs uppercase font-extrabold text-amber-600 tracking-widest border-b border-slate-100 pb-2">
                    Outlay Cost Assessment
                  </h3>

                  <div className="space-y-3.5 text-xs font-medium">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Asset Purchase Value:</span>
                      <strong className="font-mono text-slate-800">₹{totalMinInvestment.toFixed(1)} Lakhs</strong>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500 flex items-center gap-1">
                        Stamp Duty Estimate <span className="text-[10px] text-slate-400 font-mono">(6%)</span>
                      </span>
                      <strong className="font-mono text-slate-800">₹{stampDutyEstimate.toFixed(1)} Lakhs</strong>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500 flex items-center gap-1">
                        RERA Registry Filing <span className="text-[10px] text-slate-400 font-mono">(1%)</span>
                      </span>
                      <strong className="font-mono text-slate-800">₹{reraLegalEstimate.toFixed(1)} Lakhs</strong>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Sourcing Escrow Protocol:</span>
                      <strong className="font-mono text-slate-800">₹0.5 Lakhs</strong>
                    </div>

                    <div className="border-t border-slate-150 pt-3 flex justify-between text-sm">
                      <strong className="text-slate-700 uppercase font-bold">Total Sourcing Outlay:</strong>
                      <strong className="font-mono text-amber-600 font-black text-sm">{formatLakhs(totalAcquisitionOutlay)}</strong>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 text-[10px] text-slate-500 leading-normal font-semibold">
                    ⚡ <strong>RERA Compliant Shielding active</strong>. Sourcing deposits are routed directly into developer registered escrow accounts with regular verification audits.
                  </div>
                </div>

                {/* 2. DYNAMIC MONTHLY DISBURSEMENT PANEL */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-xs">
                  <h3 className="text-xs uppercase font-extrabold text-slate-800 tracking-widest block font-mono">
                    Disbursement Tracker
                  </h3>

                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-500 block font-sans">Projected Annual Cash Income:</span>
                    <div className="text-2xl font-black font-display text-emerald-600 font-mono">
                      ₹{annualRentalCashflow.toFixed(2)} <span className="text-xs font-sans text-slate-400 font-bold">Lakhs / year</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 block font-sans">Monthly Passive Run Rate (Est):</span>
                    <strong className="text-lg font-mono font-bold text-slate-800 block">
                      ₹{monthlyRentalCashflow.toLocaleString('en-IN', { maximumFractionDigits: 0 })} <span className="text-[10px] font-sans text-slate-400 font-bold">/ Month</span>
                    </strong>
                  </div>

                  <p className="text-[9px] text-slate-450 leading-normal pt-2 border-t border-slate-100">
                    * Rental payouts are formulated based on pre-leased tenant contracts and active corporate occupancies in Noida, Gurgaon & Mumbai corridors. Actual disbursements verified quarterly.
                  </p>
                </div>

              </div>

            </div>
          )}

        </div>
      ) : (
        /* SUBSCRIPTION FORM & ALERT MANAGER AREA */
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          
          {/* SUBSCRIPTION SETTINGS BOARD */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-6 shadow-xs">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-red-650" /> Sourcing Newsletter Alerts Settings
            </h3>
            <p className="text-xs text-slate-550 leading-relaxed max-w-2xl font-semibold">
              Activate the weekly InvestorJi RERA auditing report newsletter. It aggregates construction progress metrics, micro-market pricing trends, and immediate builder resale liquidation opportunities.
            </p>

            <form onSubmit={handleWeeklyNewsletter} className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                required
                className="bg-white border border-slate-200 text-slate-800 px-4 py-3 rounded-xl outline-none focus:border-red-650 transition-colors text-xs font-semibold flex-grow shadow-xs"
                placeholder="Enter Sourcing Email Identity"
                value={newsEmail}
                onChange={(e) => setNewsEmail(e.target.value)}
              />
              <button
                type="submit"
                className="bg-red-650 hover:bg-red-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-xs"
              >
                {isSubscribedToWeekly ? '📋 Update Subscription Rules' : '🔔 Active Sourcing Digest'}
              </button>
            </form>

            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-150 text-xs shadow-xs">
              <div className="p-1 rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle className="w-4.5 h-4.5" />
              </div>
              <div className="text-slate-650 leading-normal font-medium">
                Weekly Dispatch Subscription for: <strong className="text-red-655 font-mono font-bold">{subscribedEmail || '(Not active, complete above!)'}</strong>
              </div>
            </div>
          </div>

          {/* ACTIVE ATOMIC PRICE ALERTS LIST */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-150 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-red-650" /> Active Price Sourcing Threshold Alerts ({priceAlerts.length})
              </h3>
              <span className="text-[10px] text-slate-400 font-mono font-medium">Auto-scanned</span>
            </div>

            {priceAlerts.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs font-bold font-sans">
                No active Price Alert thresholds configured. Tap the Bell icon on any Property Card to monitor limits.
              </div>
            ) : (
              <div className="space-y-4">
                {priceAlerts.map(alert => {
                  const property = properties.find(p => p.id === alert.propertyId);
                  if (!property) return null;

                  return (
                    <div key={alert.id} className="bg-slate-55/60 p-4.5 rounded-2xl border border-slate-200 flex items-center justify-between text-xs transition-colors hover:border-slate-300 gap-4">
                      <div className="flex gap-3 items-center">
                        <div className="p-2 bg-red-50 rounded-lg border border-red-100 text-red-650">
                          <Bell className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">{property.title}</h4>
                          <p className="text-[10px] text-slate-500">
                            Current Standard Price: <strong className="font-mono">₹{property.minInvestment}L+</strong> &middot; Target Warning Limit: <strong className="text-emerald-600 font-mono">₹{alert.targetPrice}L</strong>
                          </p>
                          <span className="text-[9px] text-slate-400 font-mono">Recipient: {alert.email}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveAlert(alert.id)}
                        className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors border border-slate-250 hover:border-red-100 cursor-pointer"
                        title="Remove price limit alarm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
