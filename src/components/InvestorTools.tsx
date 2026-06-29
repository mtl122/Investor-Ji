import React, { useState } from 'react';
import { Calculator, Milestone, TrendingUp, Cpu, PieChart, ShieldCheck, MapPin, Sparkles, Building2, HelpCircle } from 'lucide-react';
import { Property } from '../types';

interface ToolsProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
}

export function InvestorTools({ properties, onSelectProperty }: ToolsProps) {
  const [activeTab, setActiveTab] = useState<'emi' | 'roi' | 'sip_real' | 'ai_advisor' | 'heatmap'>('ai_advisor');

  // 1. EMI Calculator States
  const [emiPrincipal, setEmiPrincipal] = useState<number>(100); // in Lakhs
  const [emiRate, setEmiRate] = useState<number>(8.5); // % interest
  const [emiTenure, setEmiTenure] = useState<number>(20); // years

  // 2. ROI Calculator States
  const [propertyCost, setPropertyCost] = useState<number>(150); // Lakhs
  const [monthlyRent, setMonthlyRent] = useState<number>(65000); // Rs
  const [annualAppreciation, setAnnualAppreciation] = useState<number>(10); // %
  const [holdingYears, setHoldingYears] = useState<number>(5);

  // 3. SIP vs Real Estate States
  const [monthlyInvest, setMonthlyInvest] = useState<number>(50000); // Rs
  const [yearsCompare, setYearsCompare] = useState<number>(10);
  const [sipExpectedRate, setSipExpectedRate] = useState<number>(12); // % for SIP Mutual Funds
  const [reAppreciationRate, setReAppreciationRate] = useState<number>(9); // Real Estate Appreciation
  const [reRentalRate, setReRentalRate] = useState<number>(4.5); // Real Estate Rental Yield

  // 4. AI Advisor States
  const [aiBudget, setAiBudget] = useState<string>('50_100'); // budget range in Lakhs
  const [aiGoal, setAiGoal] = useState<string>('high_yield'); // priority goal
  const [aiHorizon, setAiHorizon] = useState<string>('5_10'); // horizon years
  const [aiResult, setAiResult] = useState<any | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  // 5. Heatmap search location state
  const [heatmapCity, setHeatmapCity] = useState<string>('Delhi NCR');

  // Calculates EMI
  const calculateEMI = () => {
    const P = emiPrincipal * 100000;
    const r = (emiRate / 12) / 100;
    const n = emiTenure * 12;
    if (r === 0) return { emi: P / n, totalAmount: P, totalInterest: 0 };
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalAmount = emi * n;
    const totalInterest = totalAmount - P;
    return { emi, totalAmount, totalInterest };
  };

  // Calculates ROI
  const calculateROIMarkup = () => {
    const cost = propertyCost * 100000;
    const initialRent = monthlyRent * 12;
    // Calculate compound appreciation
    const finalValue = cost * Math.pow(1 + annualAppreciation / 100, holdingYears);
    
    // Sum rent assuming standard 5% escalation
    let totalRentalIncome = 0;
    let currentRent = initialRent;
    for (let i = 0; i < holdingYears; i++) {
      totalRentalIncome += currentRent;
      currentRent = currentRent * 1.05; // 5% rent escalation
    }

    const netGain = (finalValue + totalRentalIncome) - cost;
    const absoluteROI = (netGain / cost) * 100;
    const annualizedIRR = (Math.pow((finalValue + totalRentalIncome) / cost, 1 / holdingYears) - 1) * 100;
    const yieldPercentage = (initialRent / cost) * 100;

    return {
      finalValue,
      totalRentalIncome,
      netGain,
      absoluteROI,
      annualizedIRR,
      yieldPercentage
    };
  };

  // Calculates SIP vs Real Estate
  const calculateSIPvsRE = () => {
    const monthlyAmt = monthlyInvest;
    const months = yearsCompare * 12;
    
    // 1. Mutual Fund SIP compound future value calculation
    const monthlyRateSIP = (sipExpectedRate / 100) / 12;
    let sipFutureValue = 0;
    for (let i = 0; i < months; i++) {
      sipFutureValue = (sipFutureValue + monthlyAmt) * (1 + monthlyRateSIP);
    }
    const sipTotalInvested = monthlyAmt * months;
    const sipGain = sipFutureValue - sipTotalInvested;

    // 2. Real Estate Compounded Value (assuming Leveraged Asset Purchase or SIP into fractional units)
    // Real Estate total returns = Appreciation + Reinvested Rental yield
    const combinedRateRE = reAppreciationRate + reRentalRate;
    const monthlyRateRE = (combinedRateRE / 100) / 12;
    let reFutureValue = 0;
    for (let i = 0; i < months; i++) {
      reFutureValue = (reFutureValue + monthlyAmt) * (1 + monthlyRateRE);
    }

    // Leveraged scenario: HNIs typically put the same amount as EMIs or fractional pool.
    // Let's compare direct investment pooling of both styles.
    const reTotalInvested = monthlyAmt * months;
    const reGain = reFutureValue - reTotalInvested;

    return {
      sipTotalInvested,
      sipFutureValue,
      sipGain,
      reTotalInvested,
      reFutureValue,
      reGain
    };
  };

  // Generates AI Recommended Portfolio
  const generateAIRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    setAiLoading(true);

    setTimeout(() => {
      let riskProfile = 'Conservative & Yield Focused';
      let projectedIRR = '12.4% - 14.2%';
      let description = '';
      let recommendedSplit: { assetClass: string; percentage: number; rationale: string }[] = [];
      let matchedProps: Property[] = [];

      // Budget evaluation helper
      const budgetMax = aiBudget === '25_50' ? 50 : aiBudget === '50_100' ? 100 : aiBudget === '100_500' ? 500 : 9999;
      const budgetMin = aiBudget === '25_50' ? 25 : aiBudget === '50_100' ? 51 : aiBudget === '100_500' ? 101 : 500;

      matchedProps = properties.filter(p => p.minInvestment >= budgetMin / 2 && p.minInvestment <= budgetMax * 1.5);
      if (matchedProps.length === 0) {
        matchedProps = [properties[0], properties[1]];
      }

      if (aiGoal === 'high_yield') {
        riskProfile = 'Balanced Income Focused';
        projectedIRR = '14.5% - 15.8% IRR';
        description = 'For investors targeting consistent immediate cash distributions with a heavy emphasis on lease security. We recommend a balanced blend of pre-leased fractional grade-A warehouse units coupled with commercial tech-park microassets.';
        recommendedSplit = [
          { assetClass: 'Premium Pre-Leased Commercial', percentage: 50, rationale: 'Immediate corporate rents backed by 3-5 year lock-ins and 15% escalation.' },
          { assetClass: 'Fractional Logistics & Storage Hubs', percentage: 30, rationale: 'E-commerce logistics boom driving historic occupancy levels across urban sub-markets.' },
          { assetClass: 'HNI Residential Co-Living Spaces', percentage: 20, rationale: 'Densely populated tech valleys (Whitefield, Hinjewadi) delivering dual appreciation & high occupancy.' }
        ];
      } else if (aiGoal === 'max_appreciation') {
        riskProfile = 'Aggressive Growth';
        projectedIRR = '16.5% - 18.8% IRR';
        description = 'A high-impact growth blueprint directed toward land-backed luxury residential developments and upcoming transit-corridor infrastructure zones. This capitalizes on the massive Indian urban premium sprawl.';
        recommendedSplit = [
          { assetClass: 'Coastal Luxury Holiday Homes (Goa/Alibaug)', percentage: 45, rationale: 'Bespoke leisure tourism generating unmatched capital gains and luxury short-term rental demand.' },
          { assetClass: 'Metro Infrastructure Corridor Assured Projects', percentage: 35, rationale: 'Investing adjacent to upcoming smart city corridors before major arterial highway deliveries.' },
          { assetClass: 'Grade-A Builder Fractional Allocations', percentage: 20, rationale: 'Subsidized pre-sales booking on marquee developer launches with liquidation options within 24 months.' }
        ];
      } else {
        riskProfile = 'Capital Preservation (Low Risk)';
        projectedIRR = '10.8% - 12.2% IRR';
        description = 'A highly secure, low-volatility model targeting capital protection. Heavy emphasis on bank-guaranteed assured return projects with institutional anchors and ultra-low debt-to-equity developer backing.';
        recommendedSplit = [
          { assetClass: 'State-Backed Assured Return Retail Projects', percentage: 60, rationale: 'Guaranteed 11-12% monthly compound payouts directly from trust deposits.' },
          { assetClass: 'Tier-1 Completed Luxury Residential Inventory', percentage: 40, rationale: 'Zero construction risk assets with highly predictable primary tenant pipelines.' }
        ];
      }

      setAiResult({
        riskProfile,
        projectedIRR,
        description,
        recommendedSplit,
        matchedProps
      });
      setAiLoading(false);
    }, 850);
  };

  // Indian Growth Regions Map Data
  const REGIONAL_HEATMAP_DATA = [
    { city: 'Dholera SIR', area: 'Activation Area Phase 1 Zone A', growthYOY: '+22.5%', metric: 'Sovereign Smart City Driver', index: '9.7/10', color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { city: 'Dholera SIR', area: 'High-Speed Rail Corridor Metro Hub', growthYOY: '+24.8%', metric: 'Hyper-Growth Transit Corridor', index: '9.6/10', color: 'text-rose-500 bg-rose-50 border-rose-200' },
    { city: 'Delhi NCR', area: 'Golf Course Extension, Ch-54', growthYOY: '+14.8%', metric: 'Extremely Bullish', index: '9.4/10', color: 'text-emerald-500 bg-emerald-50 border-emerald-200' },
    { city: 'Delhi NCR', area: 'Noida Expressway Cluster', growthYOY: '+11.2%', metric: 'Steady Appreciation', index: '8.2/10', color: 'text-teal-600 bg-teal-50 border-teal-200' },
    { city: 'Mumbai', area: 'Worli Sea Face Premium Tier 1', growthYOY: '+16.5%', metric: 'Unprecedented Luxury Surge', index: '9.8/10', color: 'text-emerald-500 bg-emerald-50 border-emerald-200' },
    { city: 'Mumbai', area: 'BKC Financial Center Off-Market', growthYOY: '+12.6%', metric: 'High Demand / Low Void', index: '8.9/10', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { city: 'Bengaluru', area: 'Whitefield Smart IT corridor', growthYOY: '+13.2%', metric: 'Bullish Commercial Rent', index: '9.1/10', color: 'text-emerald-500 bg-emerald-50 border-emerald-200' },
    { city: 'Bengaluru', area: 'Outer Ring Road (ORR) Retail', growthYOY: '+9.8%', metric: 'Stable Rental Hub', index: '7.9/10', color: 'text-teal-600 bg-teal-50 border-teal-200' },
    { city: 'Pune', area: 'Chakan Logistics Phase II', growthYOY: '+12.1%', metric: 'High-Demand Cargo Hub', index: '8.7/10', color: 'text-teal-600 bg-teal-50 border-teal-200' },
    { city: 'Goa', area: 'Candolim Coastline Premium Strip', growthYOY: '+18.9%', metric: 'Hyper Growth Holiday Spike', index: '9.6/10', color: 'text-emerald-500 bg-emerald-50 border-emerald-200' },
    { city: 'Hyderabad', area: 'Gachibowli Financial District', growthYOY: '+14.2%', metric: 'Tech Corporate Demand Pool', index: '9.2/10', color: 'text-emerald-500 bg-emerald-50 border-emerald-200' },
    { city: 'Chennai', area: 'OMR IT Expressway Hub', growthYOY: '+13.5%', metric: 'SaaS Expansion Node', index: '9.0/10', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { city: 'Kolkata', area: 'Sector V Tech Sourcing Zone', growthYOY: '+12.8%', metric: 'Eastern Corporate Epicenter', index: '8.9/10', color: 'text-teal-600 bg-teal-50 border-teal-200' },
    { city: 'Ahmedabad', area: 'GIFT City FinTech Core', growthYOY: '+16.5%', metric: 'Offshore IFSC Growth Hub', index: '9.6/10', color: 'text-rose-600 bg-rose-50 border-rose-200' }
  ];

  const filteredHeatmap = REGIONAL_HEATMAP_DATA.filter(item => 
    heatmapCity === 'All' ? true : item.city === heatmapCity
  );

  return (
    <div id="investor-intelligence-tools" className="border border-stone-150 rounded-2xl bg-white shadow-xl overflow-hidden">
      {/* Tab Navigation header */}
      <div className="bg-gradient-to-r from-red-700 via-[#d92228] to-rose-700 p-6 text-white text-center md:text-left md:flex md:items-center md:justify-between border-b border-red-800">
        <div>
          <h3 className="text-xl md:text-2xl font-bold tracking-tight font-sans flex items-center justify-center md:justify-start gap-2 text-white">
            <Cpu className="text-white w-6 h-6" />
            Investor Intelligence Suite
          </h3>
          <p className="text-xs text-rose-100 mt-1">
            Institutional grading algorithms tuned for HNIs, Builders and NRI wealth multiplication
          </p>
        </div>
        <div className="mt-4 md:mt-0 bg-red-800/60 backdrop-blur border border-red-700 p-1 rounded-lg inline-flex flex-wrap justify-center gap-1">
          <button
            onClick={() => setActiveTab('ai_advisor')}
            className={`cursor-pointer px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'ai_advisor' 
                ? 'bg-white text-red-650 shadow' 
                : 'text-red-100 hover:text-white hover:bg-red-700/50'
            }`}
          >
            🤖 AI Advisor
          </button>
          <button
            onClick={() => setActiveTab('roi')}
            className={`cursor-pointer px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'roi' 
                ? 'bg-white text-red-650 shadow' 
                : 'text-red-100 hover:text-white hover:bg-red-700/50'
            }`}
          >
            📈 ROI Analyst
          </button>
          <button
            onClick={() => setActiveTab('sip_real')}
            className={`cursor-pointer px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'sip_real' 
                ? 'bg-white text-red-650 shadow' 
                : 'text-red-100 hover:text-white hover:bg-red-700/50'
            }`}
          >
            🏦 RE vs SIP
          </button>
          <button
            onClick={() => setActiveTab('emi')}
            className={`cursor-pointer px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'emi' 
                ? 'bg-white text-red-650 shadow' 
                : 'text-red-100 hover:text-white hover:bg-red-700/50'
            }`}
          >
            🧮 EMI Engine
          </button>
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`cursor-pointer px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'heatmap' 
                ? 'bg-white text-red-650 shadow' 
                : 'text-red-100 hover:text-white hover:bg-red-700/50'
            }`}
          >
            🗺️ Micro-Heatmap
          </button>
        </div>
      </div>

      <div className="p-6 md:p-8 bg-stone-50/50">
        
        {/* TAB 1: AI PORTFOLIO ADVISOR */}
        {activeTab === 'ai_advisor' && (
          <div className="transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Form panel */}
              <div className="lg:col-span-2 bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <span className="p-2 bg-red-50 text-[#d92228] rounded-lg">
                    <Sparkles className="w-5 h-5" />
                  </span>
                  <h4 className="font-bold text-stone-950 font-sans">Custom Recommendations</h4>
                </div>
                
                <form onSubmit={generateAIRecommendation} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                      Investment Capital Size
                    </label>
                    <select
                      value={aiBudget}
                      onChange={(e) => setAiBudget(e.target.value)}
                      className="w-full bg-stone-50 text-stone-900 text-sm border border-stone-300 rounded-lg p-3 outline-none focus:border-[#d92228] transition-colors"
                    >
                      <option value="25_50">₹25 Lakhs - ₹50 Lakhs (Ideal Fractional)</option>
                      <option value="50_100">₹50 Lakhs - ₹1 Crore (Affluent)</option>
                      <option value="100_500">₹1 Crore - ₹5 Crores (HNI Status)</option>
                      <option value="500_plus">₹5 Crores+ (Ultra High Net Worth)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                      Primary Yield Target
                    </label>
                    <select
                      value={aiGoal}
                      onChange={(e) => setAiGoal(e.target.value)}
                      className="w-full bg-stone-50 text-stone-900 text-sm border border-stone-300 rounded-lg p-3 outline-none focus:border-[#d92228] transition-colors"
                    >
                      <option value="high_yield">Regular Cash Flow (High Yielding Commercials)</option>
                      <option value="max_appreciation">Capital Multiplier (Luxury Coastal Appreciations)</option>
                      <option value="capital_preservation">Capital Protection (Sovereign Assured Returns)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                      Holding Horizon
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Short (2-4 Yrs)', val: '2_4' },
                        { label: 'Mid (5-9 Yrs)', val: '5_9' },
                        { label: 'Long (10+ Yrs)', val: '10_plus' },
                      ].map(t => (
                        <button
                          key={t.val}
                          type="button"
                          onClick={() => setAiHorizon(t.val)}
                          className={`cursor-pointer text-xs p-2 rounded-lg border text-center transition-all ${
                            aiHorizon === t.val 
                              ? 'border-[#d92228] bg-red-50 text-[#d92228] font-semibold' 
                              : 'border-stone-200 text-stone-600 hover:bg-stone-500/10'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={aiLoading}
                    className="cursor-pointer w-full bg-[#d92228] hover:bg-[#b72227] text-white py-3 rounded-lg font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all mt-6"
                  >
                    {aiLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Synthesizing Strategic Match...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-yellow-300" />
                        Generate AI Wealth Blueprint
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Recommendation results panel */}
              <div className="lg:col-span-3">
                {aiResult ? (
                  <div className="bg-white text-slate-800 rounded-xl p-6 border border-slate-200 relative overflow-hidden h-full flex flex-col justify-between shadow-xs">
                    {/* Decorative subtle gradient */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-rose-50/50 rounded-full blur-2xl pointer-events-none"></div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-4 border-b border-slate-150 pb-3">
                        <div>
                          <span className="text-[10px] text-red-650 font-bold uppercase tracking-widest bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-md">
                            Automated Advisory Recommendation
                          </span>
                          <h5 className="text-base font-bold font-sans mt-2 text-slate-900">
                            Premium Investor Investment Blueprint
                          </h5>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block font-bold">Projected Portfolio IRR</span>
                          <span className="text-lg font-black text-emerald-600 font-display">{aiResult.projectedIRR}</span>
                        </div>
                      </div>

                      <div className="mb-4 text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                        <strong className="text-slate-900 block mb-1">Risk Profile Match: {aiResult.riskProfile}</strong>
                        {aiResult.description}
                      </div>

                      <div className="space-y-3 mb-6">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-mono">Recommend Capital Deployment Allocation:</span>
                        {aiResult.recommendedSplit.map((item: any, idx: number) => (
                          <div key={idx} className="bg-slate-50 p-3.5 border border-slate-200 rounded-xl">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-semibold text-slate-900">{item.assetClass}</span>
                              <span className="text-xs font-black text-red-650">{item.percentage}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-red-500 to-rose-600 h-full" 
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1 italic leading-relaxed">{item.rationale}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-slate-150 pt-4 mt-auto">
                       <span className="text-[10px] uppercase text-slate-500 font-bold block mb-2 font-mono">Matching RERA-Approved Projects on Platform:</span>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                         {aiResult.matchedProps.slice(0, 2).map((property: Property) => (
                           <div 
                             key={property.id} 
                             onClick={() => onSelectProperty(property)}
                             className="bg-slate-50 hover:bg-red-50 p-3 rounded-xl flex items-center gap-3 border border-slate-200 hover:border-red-300 cursor-pointer transition-all"
                           >
                             <img 
                               src={property.image} 
                               alt={property.title} 
                               className="w-10 h-10 object-cover rounded-md"
                               referrerPolicy="no-referrer"
                             />
                             <div className="min-w-0">
                               <h6 className="text-xs font-bold text-slate-900 truncate">{property.title}</h6>
                               <span className="text-[10px] text-red-650 font-bold block">
                                 Min Ticket: ₹{property.minInvestment} Lakhs
                               </span>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>
                 ) : (
                   <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center h-full min-h-[300px] shadow-xs">
                     <span className="block p-4 bg-rose-50 text-red-650 rounded-full mb-3">
                       <Cpu className="w-8 h-8 animate-pulse" />
                     </span>
                     <h5 className="text-base font-bold text-slate-900">Synthesize Customized Asset Recommendations</h5>
                     <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4 leading-relaxed">
                       Configure your capital bracket and wealth multiplication priority on the left, and let our proprietary AI engine scan regional heatmaps and yield curves.
                     </p>
                     <button 
                       onClick={() => {
                         // Fast trigger with default
                         const fakeEvent = { preventDefault: () => {} } as any;
                         generateAIRecommendation(fakeEvent);
                       }}
                       className="cursor-pointer text-xs bg-red-650 hover:bg-slate-950 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm"
                     >
                       Use Default Affluent Profile Parameters
                     </button>
                   </div>
                 )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ROI ANALYST & YIELD */}
        {activeTab === 'roi' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-300">
            {/* Input Form */}
            <div className="bg-white border border-stone-200 p-6 rounded-xl shadow-sm">
              <h4 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
                <TrendingUp className="text-[#d92228] w-5 h-5" />
                Compounded ROI & Rent Forecast Tool
              </h4>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs font-semibold text-stone-700">Total Purchase Value (Asset Cost)</label>
                    <span className="text-xs font-bold text-stone-900">₹{propertyCost} Lakhs</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="5"
                    value={propertyCost}
                    onChange={(e) => setPropertyCost(Number(e.target.value))}
                    className="w-full accent-[#d92228]"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400">
                    <span>₹10 L</span>
                    <span>₹500 L</span>
                    <span>₹10 Crores</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs font-semibold text-stone-700">Expected Initial Monthly Rent (₹)</label>
                    <span className="text-xs font-bold text-[#d92228]">₹{(monthlyRent).toLocaleString('en-IN')}/mo</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="500000"
                    step="5000"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(Number(e.target.value))}
                    className="w-full accent-[#d92228]"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400">
                    <span>₹5,000/mo</span>
                    <span>₹2,50,000/mo</span>
                    <span>₹5,00,000/mo</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Projected Annual Capital Gains (%)</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={annualAppreciation}
                      onChange={(e) => setAnnualAppreciation(Number(e.target.value))}
                      className="w-full text-sm bg-stone-50 text-stone-900 border border-stone-300 rounded-lg p-3 outline-none focus:border-[#d92228]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Holding Duration (Years)</label>
                    <select
                      value={holdingYears}
                      onChange={(e) => setHoldingYears(Number(e.target.value))}
                      className="w-full text-sm bg-stone-50 text-stone-900 border border-stone-300 rounded-lg p-3 outline-none focus:border-[#d92228]"
                    >
                      <option value="3">3 Years</option>
                      <option value="5">5 Years (Standard Cycle)</option>
                      <option value="7">7 Years</option>
                      <option value="10">10 Years (Generational)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculations results display */}
            <div className="bg-stone-50 border border-stone-200 p-6 rounded-xl flex flex-col justify-between">
              {(() => {
                const res = calculateROIMarkup();
                return (
                  <>
                    <div>
                      <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Investment Projections (Summary)</h4>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-white p-3.5 border border-stone-250 rounded-lg shadow-sm">
                          <span className="text-[10px] text-stone-500 font-bold block">Assumed Appreciation Value</span>
                          <span className="text-lg font-bold text-stone-900">
                            ₹{(res.finalValue / 100000).toFixed(1)} Lakhs
                          </span>
                        </div>
                        <div className="bg-white p-3.5 border border-stone-250 rounded-lg shadow-sm">
                          <span className="text-[10px] text-stone-500 font-bold block">Cumulatively Derived Rental Pay</span>
                          <span className="text-lg font-bold text-[#d92228]">
                            + ₹{(res.totalRentalIncome / 100000).toFixed(1)} Lakhs
                          </span>
                        </div>
                      </div>

                      <div className="bg-emerald-50 text-slate-800 rounded-xl p-4 mb-4 border-l-4 border-emerald-500 shadow-xs">
                        <div className="flex justify-between text-xs text-slate-500 font-medium">
                          <span>Final Net Wealth Forecasted:</span>
                          <span className="font-bold text-slate-700">after {holdingYears} Yrs</span>
                        </div>
                        <div className="text-xl font-black text-emerald-700 mt-1 font-display">
                          ₹{((res.finalValue + res.totalRentalIncome) / 100000).toFixed(1)} Lakhs
                        </div>
                        <p className="text-[10px] text-slate-600 mt-2 leading-relaxed">
                          That is a net generated compound growth return gain of <strong className="text-emerald-800">₹{(res.netGain / 100000).toFixed(1)} Lakhs</strong>.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-stone-200 pt-4">
                      <div className="flex justify-between text-xs text-stone-600">
                        <span>Original Asset Rental Yield (Gross):</span>
                        <strong className="text-stone-900 font-mono">{res.yieldPercentage.toFixed(2)}% Annually</strong>
                      </div>
                      <div className="flex justify-between text-xs text-stone-600">
                        <span>Compound Annual Growth (Est IRR):</span>
                        <strong className="text-emerald-600 font-mono">{res.annualizedIRR.toFixed(1)}% Appr. IRR</strong>
                      </div>
                      <p className="text-[10px] text-stone-450 italic mt-2 text-center">
                        Note: Assumes a recurring base rent escalation cycle of 5% applied after every 12 months.
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* TAB 3: SIP VS REAL ESTATE COMPARISON */}
        {activeTab === 'sip_real' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-300">
            {/* Input Variables */}
            <div className="bg-white border border-stone-200 p-6 rounded-xl shadow-sm">
              <h4 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
                <PieChart className="text-[#d92228] w-5 h-5" />
                Leveraged Property vs Equity Wealth Build-off
              </h4>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs font-semibold text-stone-700">Monthly Contribution Equivalent</label>
                    <span className="text-xs font-bold text-stone-900">₹{monthlyInvest.toLocaleString('en-IN')}/mo</span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="500000"
                    step="5000"
                    value={monthlyInvest}
                    onChange={(e) => setMonthlyInvest(Number(e.target.value))}
                    className="w-full accent-[#d92228]"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400">
                    <span>₹10,000</span>
                    <span>₹2,50,000</span>
                    <span>₹5,00,000</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Compare Cycle (Years)</label>
                    <select
                      value={yearsCompare}
                      onChange={(e) => setYearsCompare(Number(e.target.value))}
                      className="w-full text-sm bg-stone-50 text-stone-900 border border-stone-300 rounded-lg p-3 outline-none focus:border-[#d92228]"
                    >
                      <option value="5">5 Years</option>
                      <option value="10">10 Years (Decade)</option>
                      <option value="15">15 Years</option>
                      <option value="20">20 Years</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">MF/Equity Year Expected Rate</label>
                    <input
                      type="number"
                      min="5"
                      max="25"
                      value={sipExpectedRate}
                      onChange={(e) => setSipExpectedRate(Number(e.target.value))}
                      className="w-full text-sm bg-stone-50 text-stone-900 border border-stone-300 rounded-lg p-3 outline-none focus:border-[#d92228]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">RE Capital Gains (%)</label>
                    <input
                      type="number"
                      min="4"
                      max="20"
                      value={reAppreciationRate}
                      onChange={(e) => setReAppreciationRate(Number(e.target.value))}
                      className="w-full text-xs bg-stone-50 text-stone-900 border border-stone-300 rounded-lg p-2 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">RE Rental Yield Rate (%)</label>
                    <input
                      type="number"
                      min="2"
                      max="15"
                      value={reRentalRate}
                      onChange={(e) => setReRentalRate(Number(e.target.value))}
                      className="w-full text-xs bg-stone-50 text-stone-900 border border-stone-300 rounded-lg p-2 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Side-by-Side Comparison Output */}
            <div className="bg-stone-50 border border-stone-200 p-6 rounded-xl flex flex-col justify-between">
              {(() => {
                const cmp = calculateSIPvsRE();
                const totalInvested = cmp.sipTotalInvested;
                return (
                  <>
                    <h5 className="text-xs font-black text-stone-500 uppercase tracking-widest mb-4">
                      Capital Built Comparison over {yearsCompare} years
                    </h5>

                    <div className="space-y-4">
                      {/* Mutual fund SIP Column */}
                      <div className="bg-white p-4 rounded-xl border border-stone-250 shadow-xs relative">
                        <div className="absolute top-3 right-3 text-stone-400">
                          <HelpCircle className="w-4 h-4 cursor-help" title="Standard index fund or mutual fund calculations." />
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-violet-600"></span>
                          <span className="text-xs font-bold text-stone-700">Mutual Fund SIP Asset Build</span>
                        </div>
                        <div className="text-xl font-bold text-stone-900">
                          ₹{(cmp.sipFutureValue / 100000).toFixed(1)} Lakhs
                        </div>
                        <div className="flex justify-between text-[11px] text-stone-500 mt-1">
                          <span>Total Capital Outlay: ₹{(totalInvested / 100000).toFixed(1)}L</span>
                          <span className="text-violet-600 font-bold">Gain: + ₹{(cmp.sipGain / 100000).toFixed(1)}L</span>
                        </div>
                      </div>

                      {/* Real estate Column */}
                      <div className="bg-[#b72227]/5 p-4 rounded-xl border border-[#d92228]/30 shadow-xs relative">
                        <div className="absolute top-3 right-3 text-[#d92228]">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#d92228]"></span>
                          <span className="text-xs font-bold text-stone-900">Premium Real Estate Investment Wealth</span>
                        </div>
                        <div className="text-xl font-bold text-[#d92228]">
                          ₹{(cmp.reFutureValue / 100000).toFixed(1)} Lakhs
                        </div>
                        <div className="flex justify-between text-[11px] text-stone-600 mt-1">
                          <span>Total Asset Outlay: ₹{(totalInvested / 100000).toFixed(1)}L</span>
                          <span className="text-emerald-700 font-bold">Gain: + ₹{(cmp.reGain / 100000).toFixed(1)}L</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-3 border border-stone-200 rounded-lg text-stone-600 text-xs mt-4 leading-relaxed">
                      💡 <strong>Strategic Real Estate Advantage:</strong> Beyond simple numerical comparisons, physical real estate properties provide robust collateral power for premium multi-leveraged bank banking loans, which mutual funds do not traditionally support at active scales.
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* TAB 4: EMI CALCULATOR */}
        {activeTab === 'emi' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-300">
            {/* Input Variables panel */}
            <div className="bg-white border border-stone-200 p-6 rounded-xl shadow-sm">
              <h4 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
                <Calculator className="text-[#d92228] w-5 h-5" />
                Premium Home Loan & EMI Modeler
              </h4>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs font-semibold text-stone-700">Home Loan Principal Required</label>
                    <span className="text-xs font-bold text-stone-900">₹{emiPrincipal} Lakhs</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="500"
                    step="5"
                    value={emiPrincipal}
                    onChange={(e) => setEmiPrincipal(Number(e.target.value))}
                    className="w-full accent-[#d92228]"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400">
                    <span>₹5 Lakhs</span>
                    <span>₹2.5 Crores</span>
                    <span>₹5 Crores</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Annual Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.05"
                      min="5"
                      max="18"
                      value={emiRate}
                      onChange={(e) => setEmiRate(Number(e.target.value))}
                      className="w-full text-sm bg-stone-50 text-stone-900 border border-stone-300 rounded-lg p-3 outline-none focus:border-[#d92228]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Loan Tenure (Years)</label>
                    <select
                      value={emiTenure}
                      onChange={(e) => setEmiTenure(Number(e.target.value))}
                      className="w-full text-sm bg-stone-50 text-stone-900 border border-stone-300 rounded-lg p-3 outline-none focus:border-[#d92228]"
                    >
                      <option value="5">5 Years</option>
                      <option value="10">10 Years</option>
                      <option value="15">15 Years</option>
                      <option value="20">20 Years (Standard)</option>
                      <option value="25">25 Years</option>
                      <option value="30">30 Years (Maximum)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculations results display panel */}
            <div className="bg-stone-50 border border-stone-200 p-6 rounded-xl flex flex-col justify-between">
              {(() => {
                const emiData = calculateEMI();
                return (
                  <>
                    <div>
                      <h4 className="text-xs font-bold text-stone-400 lg:tracking-wider mb-4 uppercase">Home Loan Breakdown Rate</h4>
                      
                      <div className="bg-red-50 text-slate-800 p-4 rounded-xl border border-red-100 shadow-xs mb-4">
                        <span className="text-[10px] text-red-650 font-bold block uppercase tracking-wider font-mono">Estimated Monthly EMI Owed:</span>
                        <div className="text-2xl font-black text-rose-600 mt-1 font-display">
                          ₹{Math.round(emiData.emi).toLocaleString('en-IN')}/mo
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-xs text-stone-600">
                          <span>Principal Loan Base:</span>
                          <span className="font-semibold text-stone-900">₹{emiPrincipal} Lakhs</span>
                        </div>
                        <div className="flex justify-between text-xs text-stone-600">
                          <span>Total Interest Incurred:</span>
                          <span className="font-semibold text-stone-900">
                            ₹{(emiData.totalInterest / 100000).toFixed(2)} Lakhs
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-stone-600 border-t border-stone-250 pt-2 font-bold">
                          <span>Cumulative Repay Amount:</span>
                          <span className="text-stone-950">
                            ₹{(emiData.totalAmount / 100000).toFixed(2)} Lakhs
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-50 text-emerald-950 p-3 rounded-lg border border-emerald-100 text-xs">
                      ✅ <strong>Investor Hack:</strong> Rent values out of our featured <em>Assured Return</em> assets successfully offset up to <strong className="text-[#d92228]">85%</strong> of standard mortgage premium commitments!
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* TAB 5: REGIONAL MICRO-HEATMAP */}
        {activeTab === 'heatmap' && (
          <div className="space-y-6 transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <h4 className="text-base font-bold text-stone-900 font-sans flex items-center gap-1.5">
                  <MapPin className="text-[#d92228] w-5 h-5" />
                  India Real Estate Growth Heatmap Forecast
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Real-time micro-market appreciation velocities filtered by key Tier 1 cities.
                </p>
              </div>

              <div className="flex flex-wrap gap-1">
                {['All', 'Dholera SIR', 'Delhi NCR', 'Mumbai', 'Bengaluru', 'Pune', 'Goa', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad'].map(city => (
                  <button
                    key={city}
                    onClick={() => setHeatmapCity(city)}
                    className={`cursor-pointer text-xs px-3 py-1.5 rounded-lg border transition-all ${
                      heatmapCity === city
                        ? 'border-[#d92228] bg-red-50 text-[#d92228] font-bold'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* List map simulation with RERA confidence score */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredHeatmap.map((item, idx) => (
                <div key={idx} className="bg-white border border-stone-200 hover:border-[#d92228] p-4 rounded-xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-400">{item.city}</span>
                        <h5 className="text-sm font-bold text-stone-900 mt-0.5">{item.area}</h5>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${item.color}`}>
                        {item.growthYOY} YOY
                      </span>
                    </div>

                    <div className="mt-3 bg-stone-50/80 rounded-lg p-2.5 border border-stone-100 flex justify-between items-center text-xs">
                      <span className="text-stone-500 font-medium">Confidence Score:</span>
                      <span className="font-bold text-stone-900">{item.index}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex justify-between items-center text-xs">
                    <span className="text-stone-400 italic">{item.metric}</span>
                    <button 
                      onClick={() => {
                        const matchingProp = properties.find(p => p.city === item.city);
                        if (matchingProp) {
                          onSelectProperty(matchingProp);
                        } else {
                          onSelectProperty(properties[0]);
                        }
                      }}
                      className="cursor-pointer text-[11px] text-[#d92228] hover:text-[#b72227] font-bold flex items-center gap-0.5"
                    >
                      View Projects →
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-xs text-amber-900 flex items-start gap-2 max-w-2xl mx-auto">
              <span className="p-1 bg-amber-200 text-amber-800 rounded font-bold text-[10px]">ALERT</span>
              <p className="leading-relaxed">
                <strong>Infrastructure Trigger:</strong> Goa\'s coastline strip and Mumbai Worli Zone are showing strong demand indicators driven by high HNI inward investments and increased tourist footfall.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
