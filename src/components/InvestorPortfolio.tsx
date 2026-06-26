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
  DollarSign as InrIcon,
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
    <div id="investor-portfolio-view" className="space-y-10 animate-fade-in text-slate-100">
      
      {/* HEADER HERO AREA */}
      <div className="bg-[#111726]/80 border border-slate-800 p-8 rounded-3xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-955/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="inline-flex items-center gap-2 bg-red-955/20 border border-red-900/40 px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold text-red-400 uppercase tracking-wider">
          <Briefcase className="w-4 h-4 text-red-500" /> My Investor Workspace
        </div>
        <h1 className="text-2xl md:text-4xl font-black text-white leading-tight font-display tracking-tight">
          Sourced Investment Portfolio
        </h1>
        <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
          Monitor your favorited, compared, and target compliance assets. Explore predictive blended returns, acquisition cost allocations, and live RERA notifications in an institutional single pane.
        </p>

        {/* Workspace Sub-tabs */}
        <div className="flex gap-2 border-t border-slate-800/80 pt-5 mt-4 text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`px-4 py-2 rounded-xl border transition-all ${
              activeSubTab === 'analytics'
                ? 'bg-red-650 text-white border-red-650'
                : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            📊 Portfolio Sourcing Analytics
          </button>
          <button
            onClick={() => setActiveSubTab('settings')}
            className={`px-4 py-2 rounded-xl border transition-all ${
              activeSubTab === 'settings'
                ? 'bg-red-650 text-white border-red-650'
                : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            ⚙️ Alert Rules & Settings
          </button>
        </div>
      </div>

      {activeSubTab === 'analytics' ? (
        <div className="space-y-10">
          
          {selectedProperties.length === 0 ? (
            <div className="bg-slate-950/60 border border-slate-850 rounded-3xl p-16 text-center space-y-4 max-w-3xl mx-auto">
              <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
              <h2 className="text-lg font-bold text-slate-200">Your Portfolio is Empty</h2>
              <p className="text-xs text-slate-400">
                To active calculations, simply go to the **Properties Catalog** or **Commercial Sourcing Tab** and click the Compare or Favorite bookmark indices on individual listings.
              </p>
              <button
                onClick={() => onNavigateToTab('properties')}
                className="bg-red-650 hover:bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Assemble Assets Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* PRIMARY MATH AND CHARTS ROW */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* 1. AGGREGATE STATS STRIP */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#111726]/80 p-5 rounded-3xl border border-slate-805">
                  <div className="space-y-1 p-2">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Target Capital</span>
                    <strong className="text-xl font-bold text-white font-mono">{formatLakhs(totalMinInvestment)}</strong>
                    <div className="text-[10px] text-slate-500 font-sans">Active Sourced Floor</div>
                  </div>
                  
                  <div className="space-y-1 p-2 border-l border-slate-800/60 pl-4">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Blended ROI</span>
                    <strong className="text-xl font-bold text-emerald-450 font-mono">{weightedROI.toFixed(2)}%</strong>
                    <div className="text-[10px] text-slate-500 font-sans">Weighted Projection</div>
                  </div>

                  <div className="space-y-1 p-2 border-l border-slate-800/60 pl-4">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Rental Yield</span>
                    <strong className="text-xl font-bold text-amber-500 font-mono">{weightedYield.toFixed(2)}%</strong>
                    <div className="text-[10px] text-slate-500 font-sans">Gross Post-Escrow</div>
                  </div>

                  <div className="space-y-1 p-2 border-l border-slate-800/60 pl-4">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Avg Appreciation</span>
                    <strong className="text-xl font-bold text-cyan-400 font-mono">{weightedAppreciation.toFixed(2)}%</strong>
                    <div className="text-[10px] text-slate-500 font-sans">Compounded YOY</div>
                  </div>
                </div>

                {/* 2. SPECIFIC SOURCE LISTINGS */}
                <div className="bg-[#111726]/40 p-6 rounded-3xl border border-slate-850/70 space-y-4">
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-red-500" /> Active Workspace Inventory
                  </h3>

                  <div className="space-y-4">
                    {selectedProperties.map(p => {
                      const isFavorited = favoritedIds.includes(p.id);
                      const isComparing = compareIds.includes(p.id);
                      
                      return (
                        <div key={p.id} className="bg-slate-950/60 rounded-2xl p-4.5 border border-slate-850 hover:border-red-955 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all">
                          <div className="flex gap-4 items-center">
                            <img src={p.image} className="w-16 h-16 rounded-xl object-cover border border-slate-800" alt={p.title} />
                            <div>
                              <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
                                <MapPin className="w-3.5 h-3.5 text-red-550" /> {p.city} &middot; RERA verified
                              </div>
                              <h4 onClick={() => onSelectProperty(p)} className="font-bold text-slate-100 hover:text-red-400 transition-colors cursor-pointer text-sm">
                                {p.title}
                              </h4>
                              <div className="flex gap-2 mt-1.5 flex-wrap">
                                <span className="text-[9px] bg-slate-900 border border-slate-800 font-bold px-2 py-0.5 rounded text-white">{p.type}</span>
                                <span className="text-[9px] bg-red-955/20 border border-red-900/40 text-red-400 font-bold px-2 py-0.5 rounded">RERA ID # {p.reraId.split('-')[2] || p.id}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-6 justify-between w-full md:w-auto border-t md:border-0 pt-3 md:pt-0 border-slate-900">
                            <div className="text-right">
                              <span className="text-[9px] block text-slate-400">ALLOCATION</span>
                              <strong className="text-xs font-mono font-bold text-white">₹{p.minInvestment} Lakhs</strong>
                            </div>
                            <div className="text-right">
                              <span className="text-[9px] block text-slate-400">ROI INDEX</span>
                              <strong className="text-xs font-mono font-bold text-emerald-400">+{p.projectedROI || p.appreciationRate}%</strong>
                            </div>
                            <div className="flex gap-1.5">
                              {/* Favorite remove */}
                              <button
                                onClick={() => onToggleFavorite(p.id)}
                                className={`p-2 rounded-lg border transition-all ${
                                  isFavorited
                                    ? 'bg-red-950/40 text-red-400 border-red-900/50'
                                    : 'bg-slate-900 text-slate-500 border-slate-850 hover:text-slate-300'
                                }`}
                                title="Remove favorite bookmark"
                              >
                                ★
                              </button>
                              {/* Compare remove */}
                              <button
                                onClick={() => onToggleCompare(p.id)}
                                className={`p-2 rounded-lg border transition-all ${
                                  isComparing
                                    ? 'bg-blue-955/40 text-blue-400 border-blue-900/50'
                                    : 'bg-slate-900 text-slate-500 border-slate-850 hover:text-slate-300'
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
                <div className="bg-[#111726]/80 p-6 rounded-3xl border border-slate-805 space-y-4">
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-red-500" /> Sourcing Simulation Calculator
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Use the simulated capital slider below to forecast what happens if you deploy more capital across your selected assets under InvestorJi's weighted return indices.
                  </p>

                  <form onSubmit={handleSimulatedBudgetSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold font-mono">
                        <span className="text-slate-300">Simulated Sourcing Budget:</span>
                        <span className="text-red-400 text-sm font-bold">{formatLakhs(simulatedBudget)}</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="1000" 
                        step="5"
                        value={simulatedBudget}
                        onChange={(e) => setSimulatedBudget(Number(e.target.value))}
                        className="w-full accent-red-650 h-1.5 bg-slate-900 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-850 text-xs font-mono">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Annual Cash Return:</span>
                        <strong className="text-emerald-400 text-sm">{formatLakhs(simulatedBudget * (weightedROI / 100))}</strong>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Monthly Cash Stream:</span>
                        <strong className="text-emerald-400 text-sm">₹{((simulatedBudget * (weightedYield / 100) / 12) * 100000).toLocaleString('en-IN', { maximumFractionDigits: 0 })}/mo</strong>
                      </div>
                    </div>
                  </form>
                </div>

              </div>

              {/* OUTLAY COST BREAKDOWN SIDEBAR */}
              <div className="space-y-6">
                
                {/* 1. VERIFIED INVESTMENT COSTS SCHEME */}
                <div className="bg-slate-950 p-6 rounded-3xl border border-slate-850 space-y-5 shadow-xl relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-955/5 rounded-full blur-xl pointer-events-none"></div>
                  
                  <h3 className="text-xs uppercase font-extrabold text-[#D4AF37] tracking-widest border-b border-slate-850 pb-2">
                    Outlay Cost Assessment
                  </h3>

                  <div className="space-y-3.5 text-xs font-medium">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Asset Purchase Value:</span>
                      <strong className="font-mono text-white">₹{totalMinInvestment.toFixed(1)} Lakhs</strong>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        Stamp Duty Estimate <span className="text-[10px] text-slate-500 font-mono">(6%)</span>
                      </span>
                      <strong className="font-mono text-white">₹{stampDutyEstimate.toFixed(1)} Lakhs</strong>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        RERA Registry Filing <span className="text-[10px] text-slate-500 font-mono">(1%)</span>
                      </span>
                      <strong className="font-mono text-white">₹{reraLegalEstimate.toFixed(1)} Lakhs</strong>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">Sourcing Escrow Protocol:</span>
                      <strong className="font-mono text-white">₹0.5 Lakhs</strong>
                    </div>

                    <div className="border-t border-slate-800/80 pt-3 flex justify-between text-sm">
                      <strong className="text-slate-100 uppercase font-bold">Total Sourcing Outlay:</strong>
                      <strong className="font-mono text-[#D4AF37] font-black text-sm">{formatLakhs(totalAcquisitionOutlay)}</strong>
                    </div>
                  </div>

                  <div className="bg-[#111726]/70 p-3 rounded-xl border border-slate-850 text-[10px] text-slate-400 leading-normal">
                    ⚡ <strong>RERA Compliant Shielding active</strong>. Sourcing deposits are routed directly into developer registered escrow accounts with regular verification audits.
                  </div>
                </div>

                {/* 2. DYNAMIC MONTHLY DISBURSEMENT PANEL */}
                <div className="bg-[#111726]/80 p-6 rounded-3xl border border-slate-805 space-y-4">
                  <h3 className="text-xs uppercase font-extrabold text-white tracking-widest block font-mono">
                    DISBURSEMENT TRACKER
                  </h3>

                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-400 block font-sans">Projected Annual Cash Income:</span>
                    <div className="text-2xl font-black font-display text-emerald-450 font-mono">
                      ₹{annualRentalCashflow.toFixed(2)} <span className="text-xs font-sans text-slate-400 font-bold">Lakhs / year</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 block font-sans">Monthly Passive Run Rate (Est):</span>
                    <strong className="text-lg font-mono font-bold text-white block">
                      ₹{monthlyRentalCashflow.toLocaleString('en-IN', { maximumFractionDigits: 0 })} <span className="text-[10px] font-sans text-slate-400 font-bold">/ Month</span>
                    </strong>
                  </div>

                  <p className="text-[9px] text-slate-500 leading-normal pt-2 border-t border-slate-800">
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
          <div className="bg-[#111726]/80 p-8 rounded-3xl border border-slate-805 space-y-6">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-red-500" /> Sourcing Newsletter Alerts Settings
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Activate the weekly InvestorJi RERA auditing report newsletter. It aggregates construction progress metrics, micro-market pricing trends, and immediate builder resale liquidation opportunities.
            </p>

            <form onSubmit={handleWeeklyNewsletter} className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                required
                className="bg-slate-950 border border-slate-800 text-slate-100 px-4 py-3 rounded-xl outline-none focus:border-red-600 transition-colors text-xs font-semibold flex-grow"
                placeholder="Enter Sourcing Email Identity"
                value={newsEmail}
                onChange={(e) => setNewsEmail(e.target.value)}
              />
              <button
                type="submit"
                className="bg-red-650 hover:bg-red-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer whitespace-nowrap"
              >
                {isSubscribedToWeekly ? '📋 Update Subscription Rules' : '🔔 Active Sourcing Digest'}
              </button>
            </form>

            <div className="flex items-center gap-3 bg-slate-950/55 p-4 rounded-xl border border-slate-850 text-xs">
              <div className="p-1 rounded-full bg-emerald-950/50 text-emerald-400">
                <CheckCircle className="w-4.5 h-4.5" />
              </div>
              <div className="text-slate-300 leading-normal">
                Weekly Dispatch Subscription for: <strong className="text-red-400 font-mono font-bold">{subscribedEmail || '(Not active, complete above!)'}</strong>
              </div>
            </div>
          </div>

          {/* ACTIVE ATOMIC PRICE ALERTS LIST */}
          <div className="bg-[#111726]/80 p-8 rounded-3xl border border-slate-805 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-red-500" /> Active Price Sourcing Threshold Alerts ({priceAlerts.length})
              </h3>
              <span className="text-[10px] text-slate-500 font-mono font-medium">Auto-scanned</span>
            </div>

            {priceAlerts.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs font-bold font-sans">
                No active Price Alert thresholds configured. Tap the Bell icon on any Property Card to monitor limits.
              </div>
            ) : (
              <div className="space-y-4">
                {priceAlerts.map(alert => {
                  const property = properties.find(p => p.id === alert.propertyId);
                  if (!property) return null;

                  return (
                    <div key={alert.id} className="bg-slate-950/70 p-4.5 rounded-2xl border border-slate-850 flex items-center justify-between text-xs transition-colors hover:border-slate-800 gap-4">
                      <div className="flex gap-3 items-center">
                        <div className="p-2 bg-red-955/15 rounded-lg border border-red-900/30 text-red-400">
                          <Bell className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-100">{property.title}</h4>
                          <p className="text-[10px] text-slate-400">
                            Current Standard Price: <strong className="font-mono">₹{property.minInvestment}L+</strong> &middot; Target Warning Limit: <strong className="text-emerald-450 font-mono">₹{alert.targetPrice}L</strong>
                          </p>
                          <span className="text-[9px] text-slate-500 font-mono">Recipient: {alert.email}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveAlert(alert.id)}
                        className="p-2 hover:bg-red-955/35 text-slate-400 hover:text-red-400 rounded-lg transition-colors border border-slate-850 hover:border-red-900/30 cursor-pointer"
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
