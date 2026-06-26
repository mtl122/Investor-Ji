import React, { useState } from 'react';
import { UserCheck, ShieldCheck, Phone, MessageSquare, Wallet, Key, Filter, Search } from 'lucide-react';
import { Lead } from '../types';
import { AGENT_LEADS } from '../data';

interface AgentLeadsProps {
  onNotify: (message: string, type: 'success' | 'error') => void;
}

export function AgentLeads({ onNotify }: AgentLeadsProps) {
  const [leads, setLeads] = useState<Lead[]>(AGENT_LEADS);
  const [walletBalance, setWalletBalance] = useState<number>(5000); // Complimentary balance in Rupee
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddFunds, setShowAddFunds] = useState<boolean>(false);
  const [amountToAdd, setAmountToAdd] = useState<number>(2500);

  // Filter logic
  const filteredLeads = leads.filter(lead => {
    const matchesCity = selectedCity === 'All' || lead.city.toLowerCase().includes(selectedCity.toLowerCase()) || (selectedCity === 'NRI' && lead.city.includes('NRI'));
    const matchesSearch = lead.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lead.propertyType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lead.targetLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  const purchaseLead = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    if (lead.isPurchased) {
      onNotify('You have already unlocked this high-intent lead!', 'error');
      return;
    }

    if (walletBalance < lead.price) {
      onNotify('Insufficient wallet balance to unlock this premium lead. Please top up your wallet below.', 'error');
      return;
    }

    // Process secure purchase
    setWalletBalance(prev => prev - lead.price);
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, isPurchased: true } : l));
    onNotify(`Core Lead Unlocked! Target phone contact and corporate dossier unlocked for ${lead.buyerName}.`, 'success');
  };

  const addFunds = (e: React.FormEvent) => {
    e.preventDefault();
    if (amountToAdd <= 0) {
      onNotify('Please declare a valid credit amount.', 'error');
      return;
    }
    setWalletBalance(prev => prev + amountToAdd);
    onNotify(`Success! ₹${amountToAdd.toLocaleString('en-IN')} added securely to your Agency Lead Acquiring Wallet.`, 'success');
    setShowAddFunds(false);
  };

  return (
    <div className="space-y-8">
      
      {/* Dynamic wallet layout block */}
      <div className="bg-gradient-to-r from-slate-900 via-stone-900 to-[#9c181c] text-white p-6 rounded-2xl border border-red-900/50 md:flex items-center justify-between shadow-xl">
        <div className="space-y-1.5 mb-4 md:mb-0">
          <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest bg-yellow-400/10 px-2.5 py-1 rounded">
            Agent & Broker Premium Suite
          </span>
          <h2 className="text-xl md:text-2xl font-black font-sans text-white">
            HNI Buyer Lead Procurement Desk
          </h2>
          <p className="text-slate-350 text-xs max-w-xl">
            Acquire real, active, high-intent real estate buyers who have used our financial estimators and requested customized developer quotas. Verified by RERA status and digital signature.
          </p>
        </div>

        {/* Live Wallet Card */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between md:gap-8 min-w-[280px]">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">YOUR LEADS WALLET</span>
            <div className="text-2xl font-black text-emerald-400 flex items-center gap-1 mt-0.5">
              <Wallet className="w-5 h-5 opacity-90" />
              ₹{walletBalance.toLocaleString('en-IN')}
            </div>
            <span className="text-[9px] text-slate-400 block mt-1 italic">
              Complimentary starting credit active
            </span>
          </div>

          <button
            onClick={() => setShowAddFunds(true)}
            className="cursor-pointer bg-[#d92228] hover:bg-[#b72227] text-white text-xs px-3.5 py-2 rounded-lg font-bold transition-all shadow-md"
          >
            Add Net Funds
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Filter and Rules panel */}
        <div className="space-y-6">
          <div className="bg-[#111726]/90 border border-slate-800 rounded-2xl p-5 shadow-2xl">
            <h3 className="font-bold text-white text-sm mb-4 font-sans flex items-center gap-1.5">
              <Filter className="text-[#d92228] w-4 h-4" />
              Sieve Active Buyers
            </h3>

            <div className="space-y-4 font-sans">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-400 uppercase mb-2">
                  Client Demographics
                </label>
                <div className="flex flex-col gap-1">
                  {[
                    { label: 'All Cities', val: 'All' },
                    { label: 'Delhi NCR', val: 'Delhi' },
                    { label: 'Mumbai Area', val: 'Mumbai' },
                    { label: 'Bengaluru Sector', val: 'Bengaluru' },
                    { label: 'NRI Investment Pool', val: 'NRI' },
                  ].map(city => (
                    <button
                      key={city.val}
                      onClick={() => setSelectedCity(city.val)}
                      className={`cursor-pointer text-xs p-2.5 rounded-lg text-left border transition-all ${
                        selectedCity === city.val 
                          ? 'border-[#d92228] bg-red-950/60 text-red-400 font-bold' 
                          : 'border-transparent text-slate-300 hover:bg-slate-900/40'
                      }`}
                    >
                      {city.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-800 pt-3">
                <label className="block text-[11px] font-extrabold text-slate-400 uppercase mb-2">
                  Search Key Criteria
                </label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. Co-Living, Worli..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg outline-none text-slate-100 focus:border-[#d92228]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1112]/90 border border-red-900/30 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 text-red-455 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-red-500" />
              InvestorJi Guarantee
            </div>
            <p className="text-[10px] text-slate-300 leading-relaxed">
              Every client lead featured is processed via double OTP validation and holds a verified budget parameters signature. Non-contactable active leads can be refunded within 12 hours of discovery.
            </p>
          </div>
        </div>

        {/* Right Side: Leads Grid */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center bg-[#111726]/50 border border-slate-800/80 rounded-xl px-4 py-3.5 shadow-md">
            <span className="text-xs font-bold text-slate-150">
              {filteredLeads.length} High Intensity Verified Buyers Found
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-red-400 font-bold">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
              LIVE HOT LEADS POOL
            </div>
          </div>

          <div className="space-y-4">
            {filteredLeads.map(lead => (
              <div 
                key={lead.id} 
                className={`bg-[#111726] border rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all ${
                  lead.isPurchased ? 'border-emerald-600/40 bg-emerald-950/5' : 'border-slate-850 hover:border-slate-800'
                }`}
              >
                {/* Lead Header */}
                <div className="bg-slate-900/40 px-5 py-4 border-b border-slate-850/80 flex flex-wrap items-center justify-between gap-3 font-sans">
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-slate-800 text-slate-200 rounded-lg">
                      <UserCheck className="w-4 h-4 text-[#d92228]" />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                        {lead.isPurchased ? lead.buyerName : `${lead.buyerName.split(' ')[0]} •••`}
                        {lead.isVerified && (
                          <span className="bg-emerald-950/80 border border-emerald-800/40 text-emerald-400 text-[9px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3 text-emerald-450" /> VERIFIED
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        Active from: <span className="text-slate-250 font-medium">{lead.city}</span> • Posted <span className="text-slate-300 font-medium">{lead.dateAdded}</span>
                      </p>
                    </div>
                  </div>

                  {/* Score pill */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 block uppercase font-extrabold tracking-wider">Client Intent Score</span>
                      <span className="text-sm font-black text-emerald-450">{lead.score}% Hot</span>
                    </div>
                    <div className="w-12 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                      <div 
                        className="bg-emerald-400 h-full" 
                        style={{ width: `${lead.score}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Lead Parameters */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-black block mb-0.5">Budget Allocation</span>
                    <strong className="text-white font-semibold text-sm">{lead.budget}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-black block mb-0.5">Asset Type Interest</span>
                    <strong className="text-slate-200 font-semibold">{lead.propertyType}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-black block mb-0.5">Target Location Focus</span>
                    <span className="text-slate-300 italic block truncate">{lead.targetLocation}</span>
                  </div>
                </div>

                {/* Interaction & Price buy actions */}
                <div className="p-4 bg-slate-950/60 select-none border-t border-slate-850 flex flex-wrap items-center justify-between gap-4 font-sans">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold block">Acquisition License Fee</span>
                    <strong className="text-base text-white font-black">₹{lead.price.toLocaleString('en-IN')} <span className="text-[10px] text-slate-400 font-normal">one-time</span></strong>
                  </div>

                  <div className="flex gap-2">
                    {lead.isPurchased ? (
                      <div className="flex items-center gap-2">
                        {/* Revealed contact options */}
                        <div className="bg-emerald-950/55 border border-emerald-800/40 text-emerald-400 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />
                          {lead.phonePrefix} {lead.phoneSuffix.replace(/•/g, '9')}
                        </div>
                        <a 
                          href={`https://wa.me/918168105240?text=Hello%20${encodeURIComponent(lead.buyerName)},%20I%20am%20calling%20from%20InvestorJi.`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-lg transition-all"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>
                      </div>
                    ) : (
                      <button
                        onClick={() => purchaseLead(lead.id)}
                        className="cursor-pointer bg-[#d92228] hover:bg-[#b72227] text-white text-xs px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <Key className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                        Unlock Direct Buyer Details
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Add simulated funds modal popup */}
      {showAddFunds && (
        <div className="fixed inset-0 bg-[#060B13]/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#111726] rounded-2xl w-full max-w-sm border border-slate-800 overflow-hidden shadow-2xl">
            <div className="bg-[#d92228] p-5 text-white flex justify-between items-center">
              <div>
                <span className="text-[9px] uppercase font-bold text-yellow-300">Escrow Secure Portal</span>
                <h3 className="font-bold text-normal tracking-tight text-white">Add Agency Lead Acquiring Funds</h3>
              </div>
              <button 
                onClick={() => setShowAddFunds(false)}
                className="text-white/80 hover:text-white font-bold text-xl cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={addFunds} className="p-6 space-y-4 font-sans">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Select Credit Volume Pack</label>
                <div className="grid grid-cols-3 gap-2">
                  {[1000, 2500, 5000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmountToAdd(amt)}
                      className={`cursor-pointer text-xs p-2.5 rounded-lg border text-center transition-all ${
                        amountToAdd === amt 
                          ? 'border-[#d92228] bg-red-950/60 text-red-400 font-bold' 
                          : 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-850'
                      }`}
                    >
                      ₹{amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Custom Top-up Amount (₹)</label>
                <input
                  type="number"
                  min="500"
                  max="100000"
                  value={amountToAdd}
                  onChange={(e) => setAmountToAdd(Number(e.target.value))}
                  className="w-full text-xs text-slate-100 bg-slate-950 border border-slate-800 p-3 rounded-lg outline-none focus:border-[#d92228]"
                />
              </div>

              <div className="text-[10px] text-slate-400 bg-slate-900/60 p-3 rounded-lg border border-slate-800 leading-relaxed">
                💳 Simulating direct UPI, Core Netbanking transit channels. Net additions reflect instantaneously.
              </div>

              <button
                type="submit"
                className="cursor-pointer w-full bg-[#d92228] hover:bg-[#b72227] text-white py-3 rounded-lg font-bold text-xs transition-colors"
              >
                Replenish Wallet Balance
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
