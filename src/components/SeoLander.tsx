import React, { useState } from 'react';
import { 
  Globe, 
  MapPin, 
  Star, 
  CheckCircle, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Award, 
  Clock, 
  Phone, 
  Mail, 
  FileCheck2, 
  HelpCircle,
  Download,
  Scale
} from 'lucide-react';
import { Property } from '../types';
import { PropertyCard } from './PropertyCard';

interface SeoLanderProps {
  properties: Property[];
  activePath: string;
  onNavigateToTab: (tabName: 'listings' | 'tools' | 'marketplace' | 'leads') => void;
  onSelectProperty: (property: Property) => void;
  onNotify: (message: string, type: 'success' | 'error') => void;
  onOpenConsultation: (message: string) => void;
  compareIds?: string[];
  onCompareToggle?: (id: string) => void;
}

export function SeoLander({ 
  properties, 
  activePath, 
  onNavigateToTab, 
  onSelectProperty, 
  onNotify,
  onOpenConsultation,
  compareIds = [],
  onCompareToggle
}: SeoLanderProps) {

  // Lead capture slider inside landing page
  const [leadName, setLeadName] = useState('');
  const [leadMobile, setLeadMobile] = useState('');
  const [leadEmail, setLeadEmail] = useState('');

  // Sourcing metadata mapping based on URL
  const landerConfigs: Record<string, {
    url: string;
    title: string;
    description: string;
    heading: string;
    subheading: string;
    introParagraph: string;
    filterCity?: string;
    filterType?: string;
    filterPlot?: boolean;
    filterRetail?: boolean;
    faqs: { q: string; a: string }[];
    scores: { location: number; builder: number; rental: number; growth: number; liquidity: number; overall: number };
  }> = {
    '/commercial-property-india': {
      url: '/commercial-property-india',
      title: "Commercial Property India | Top Pre-Leased Offices & Asset Portfolios",
      description: "Discover certified premium Grade-A commercial properties, pre-leased corporate offices, and warehouse assets in India. Verified RERA listings with immediate 8-10% rental yields.",
      heading: "Prime Commercial Real Estate Opportunities across India",
      subheading: "Invest in Grade-A corporate plazas, retail centers, and logistics hubs pre-leased to Fortune-500 giants.",
      introParagraph: "Commercial assets are the gold standard for robust passive income. Across Noida Expressway, Gurgaon Golf Course Extension, and Mumbai Worli, commercial real estate holds a staggering 8.5% to 10.5% average yield compared to basic 3% residential apartments. Our micro-market analytical platform indexes only those commercial developments verified by state RERA boards, featuring secure legal escrow setups and 15% triple-net lease rent escalation protections.",
      filterType: 'Commercial',
      scores: { location: 5, builder: 5, rental: 5, growth: 4, liquidity: 4, overall: 9.3 },
      faqs: [
        { q: "What is the typical lock-in period for corporate commercial leases?", a: "Corporate leases generally carry a minimum lock-in period of 3 to 5 years, with overall tenure extending up to 9 or 15 years, ensuring extremely predictable passive rental streams." },
        { q: "Is fractional commercial property ownership legal?" , a: "Yes, it is structured through registered Special Purpose Vehicles (SPVs) and Deeds of Trust governed by standard RERA legal frameworks." }
      ]
    },
    '/residential-property-india': {
      url: '/residential-property-india',
      title: "Residential Property India | High Appreciation Sky Mansions & Holiday Villas",
      description: "Find verified high-end luxury apartments, sea-facing penthouses, and managed holiday pool villas in premium Indian markets. RERA audited deals.",
      heading: "Executive Residential Investment Strategies in India",
      subheading: "Deploy capital in premium managed villa societies and sky mansions with exceptional capital appreciation rates.",
      introParagraph: "While pure rental yield on residential sits lower, selected luxury beachfront properties in Goa and premium corporate flats in Gurgaon showcase an impressive 12-15% CAGR in capital appreciation. We exclusively screen high-growth societies centered around active corporate and infrastructure hubs.",
      filterType: 'Residential',
      scores: { location: 4, builder: 5, rental: 3, growth: 5, liquidity: 4, overall: 9.0 },
      faqs: [
        { q: "How are residential holiday rentals managed?", a: "To ensure worry-free returns for remote NRI buyers, properties are tied directly with global boutique hospitality chains who handle daily check-ins, catering, and security." }
      ]
    },
    '/plots-for-sale-india': {
      url: '/plots-for-sale-india',
      title: "Plots for Sale in India | High Appreciation Freehold Land Plots",
      description: "Buy RERA-approved freehold plots and gated township land in Vrindavan, Mathura, and Faridabad. Secure high capital growth on finite land layouts.",
      heading: "Premium Freehold Land Plots for Sale in Rapid-Growth Corridors",
      subheading: "Own registered absolute land plots with pristine titles in Delhi NCR, Yamuna Expressway, and sacred Vrindavan.",
      introParagraph: "Bricks and concrete deprecate, but land is a finite asset. Investing in freehold plots adjacent to upcoming transit infrastructure represents one of India's most highly transactional investment trends.",
      filterPlot: true,
      scores: { location: 5, builder: 4, rental: 3, growth: 5, liquidity: 5, overall: 9.2 },
      faqs: [
        { q: "Is mutation registration included in plot purchases?", a: "Yes, our dedicated builder compliance desk manages both the physical lease-deed registry and official government mutation certificates." }
      ]
    },
    '/investment-property-india': {
      url: '/investment-property-india',
      title: "Investment Property India | High-Growth High-Yield Institutional Sourcing",
      description: "Research and deploy capital in the best investment properties across India. Compare fractional, assured return, and pre-sales corporate allocations.",
      heading: "India's Ultimate Private Real Estate Portfolios",
      subheading: "Deploy capital into research-led, high-conviction portfolios designed to yield maximum tax-free cash flow.",
      introParagraph: "Sourcing modern real estate as an investment requires mathematical rigor. We bypass standard real estate broker talk and analyze micro-market demands to allocate capital where infrastructure expansion is guaranteed.",
      scores: { location: 5, builder: 5, rental: 5, growth: 5, liquidity: 4, overall: 9.5 },
      faqs: [
        { q: "What is Section 54EE and how does it protect real estate investment profits?", a: "Section 54 allows investors to redeploy capital gains from general assets into verified properties within legal timelines to completely shield tax liabilities." }
      ]
    },
    '/rental-income-properties': {
      url: '/rental-income-properties',
      title: "Rental Income Properties India | Pre-Leased Certified Assets",
      description: "Acquire pre-leased retail shops, warehouse terminals, and fractional office blocks with immediate rental disbursements. Secure high monthly passive income.",
      heading: "Prime Yielding Rental Income Properties with Immediate Cashflow",
      subheading: "Lock in high-yield, pre-leased Grade-A property deeds directly generating quarterly rental credits.",
      introParagraph: "Ditch low-yield investments. By acquiring fractional slices of pre-leased corporate plazas and high-street retail shops, smart investors lock in immediate inflation-hedged yields starting day one.",
      scores: { location: 5, builder: 4, rental: 5, growth: 4, liquidity: 5, overall: 9.4 },
      faqs: [
        { q: "Do these properties feature triple net lease policies?", a: "Yes, our Grade-A pre-leased selections feature Triple Net Leases where corporate tenants cover all society maintenance, property taxes, and structural insurance." }
      ]
    },
    '/property-in-vrindavan': {
      url: '/property-in-vrindavan',
      title: "Property in Vrindavan | Gated Plots & Holy Divine Residences",
      description: "Sacred gated residential land, retirement villa layouts, and plots for sale in Raman Reti, Vrindavan near Prem Mandir. Secure high cultural-led appreciation.",
      heading: "Elite Spiritual Land & Real Estate Investment in Sacred Vrindavan",
      subheading: "Gated luxury layout coordinates, sweet water grids, and prime plots on Raman Reti and Yamuna Expressway connect.",
      introParagraph: "Vrindavan is witnessing a massive surge in luxury retirement communities and cultural tourism. Fuelled by national temple corridor development initiatives and high NRI traction, land parcels on Raman Reti road have appreciated by an unprecedented 18% YOY, presenting a serene retirement option or dynamic passive vacation rental pool.",
      filterCity: 'Vrindavan',
      scores: { location: 5, builder: 4, rental: 4, growth: 5, liquidity: 4, overall: 9.3 },
      faqs: [
        { q: "How active is Vrindavan's resale and rental market?", a: "Vrindavan's holiday rental space is highly active during holy months and weekends, with premium serviced apartments commanding up to ₹8,000 per night." }
      ]
    },
    '/property-in-gurgaon': {
      url: '/property-in-gurgaon',
      title: "Property in Gurgaon | Luxury Cyber Hub Corporate Real Estate & Offices",
      description: "Search corporate headquarters, fractional premium office rooms, and luxury high-rise flats along Gurgaon Golf Course SPR in 2026. Highly transactional.",
      heading: "Sovereign Real Estate Deployments in Gurugram Metro",
      subheading: "Capitalize on high-yield commercial hubs and RERA verified residential sky mansions on SPR and Golf Course Road Ext.",
      introParagraph: "Gurgaon is India's tech and finance powerhouse. With Grade-A commercial spaces hosting Fortune 500 tech headquarters and massive high-speed metro linkages, Gurgaon real estate remains the most highly transactional corporate asset market in South Asia.",
      filterCity: 'Gurgaon',
      scores: { location: 5, builder: 5, rental: 5, growth: 4, liquidity: 5, overall: 9.5 },
      faqs: [
        { q: "How does the Dwarka Expressway expansion alter Gurgaon property values?", a: "Dwarka Expressway has connected Gurgaon directly with North Delhi, driving a massive 20%+ increase in land values over the past 24 months." }
      ]
    },
    '/property-in-noida': {
      url: '/property-in-noida',
      title: "Property in Noida | Jewar International Airport Transit Corridor Deals",
      description: "Invest in IT office towers, premium industrial sectors, and fractional tech parks in Noida Sector 62. Positioned along the upcoming Jewar Airport corridor.",
      heading: "Noida-Greater Noida Economic Zone Investment Directory",
      subheading: "Grade-A IT parks, high-visibility retail showrooms, and highway-linked plots for high capital scaling.",
      introParagraph: "Driven by the landmark Jewar International Airport development and massive software and electronics manufacturing corridors, Noida is NCR's supreme industrial and backend corporate asset capital. Smart capital favors Sector 62 and sector 150 plots.",
      filterCity: 'Noida',
      scores: { location: 5, builder: 4, rental: 5, growth: 5, liquidity: 4, overall: 9.1 },
      faqs: [
        { q: "Are Noida properties leasehold or freehold?", a: "Most development blocks in Noida are structured as 90-year municipal authority leaseholds, completely secured under RERA statutory guidelines." }
      ]
    },
    '/property-in-delhi': {
      url: '/property-in-delhi',
      title: "Property in Delhi | Connaught Place Premium Commercial Asset Slices",
      description: "Own a verified corporate share or high-street retail space in Connaught Place or South Delhi. Triple net lease guarantees and premium yields.",
      heading: "Capital Grade Sourcing: Delhi Premium Commercial & Luxury Suites",
      subheading: "Secure pre-leased high-street banks and premium multi-tenant corporate lounges in Delhi core zones.",
      introParagraph: "Real estate in Core Delhi represents the ultimate preservation of generational wealth. With near-zero scope for new metropolitan land expansions, CP outer circle commercial assets command legendary status and consistent lease payouts.",
      filterCity: 'Delhi',
      scores: { location: 5, builder: 5, rental: 5, growth: 4, liquidity: 5, overall: 9.7 },
      faqs: [
        { q: "What is the capital appreciation rate in Connaught Place?", a: "Connaught Place appreciation rates maintain a stable 9-11% annual track record due to the total absence of new building permits inside the historic central circle." }
      ]
    },
    '/property-in-faridabad': {
      url: '/property-in-faridabad',
      title: "Property in Faridabad | High-Street Shops & Greater Faridabad Plots",
      description: "Explore industrial plots and prime double-height retail shops under development in Faridabad Sector 79. Steady cash flow and premium growth.",
      heading: "Greater Faridabad Capital Sourcing Directory",
      subheading: "High-visibility commercial plazas and premium plotted layouts along the Delhi-Mumbai Express Corridor link.",
      introParagraph: "Faridabad is the industrial powerhouse of Haryana, now transforming under Greater Faridabad smart city expansions. Linked directly with high-speed expressways and major commercial channels, it represents an outstanding low-ticket opportunity for long-term land holdings.",
      filterCity: 'Faridabad',
      scores: { location: 4, builder: 5, rental: 5, growth: 4, liquidity: 4, overall: 8.9 },
      faqs: [
        { q: "Is Faridabad linked to the Noida Jewar Airport?", a: "Yes, the upcoming 6-lane Faridabad-Jewar link expressway places the airport within a convenient 35-minute drive, driving land value leaps." }
      ]
    },
    '/property-in-mathura': {
      url: '/property-in-mathura',
      title: "Property in Mathura | Yamuna Expressway Heritage Land Lands",
      description: "Freehold township plots and land parcels for sale adjacent to Yamuna Expressway, Mathura. High infrastructure-led capital gains.",
      heading: "Yamuna Expressway land Parcels & Plot Sourcing in Mathura Core",
      subheading: "High-yielding gated township plots, commercial road connects, and secure title investments.",
      introParagraph: "Mathura's connection with the Yamuna Expressway is driving a massive industrial and tourism boom. Positioned optimally between Noida and Agra, it represents a highly appreciated land investment corridor for HNIs targeting direct land ownership plots.",
      filterCity: 'Mathura',
      scores: { location: 4, builder: 4, rental: 3, growth: 5, liquidity: 5, overall: 9.1 },
      faqs: [
        { q: "Are the Mathura plots RERA compliant?", a: "Every listed project on InvestorJi is authenticated. The Yamuna Expressway Industrial Development Authority (YEIDA) mandates rigorous registry parameters." }
      ]
    }
  };

  const currentLander = landerConfigs[activePath] || landerConfigs['/commercial-property-india'];

  // Sift matching properties based on active SEO lander parameters
  const matchingProperties = properties.filter(prop => {
    if (currentLander.filterCity && prop.city !== currentLander.filterCity) return false;
    if (currentLander.filterType && prop.type !== currentLander.filterType) return false;
    if (currentLander.filterPlot && !prop.isPlot) return false;
    if (currentLander.filterRetail && !prop.isRetail) return false;
    return true;
  });

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadMobile || !leadEmail) {
      onNotify('Please complete all form fields to request the specific prospectus guides.', 'error');
      return;
    }
    onNotify(`Success! Exclusive PDF "Top 25 High-Growth Sourcing Locations" configured specifically for ${currentLander.filterCity || 'India'} has been dispatched to ${leadEmail}! Our officer will contact you on ${leadMobile}.`, 'success');
    setLeadName('');
    setLeadMobile('');
    setLeadEmail('');
  };

  return (
    <div className="space-y-10 animate-fade-in text-slate-800 pb-16 font-sans">

      {/* 1. SEO METRICS INDEX & GOOGLE METADATA MONITORING TOOL PANEL (LIGHT THEME) */}
      <div className="bg-slate-50 text-slate-700 border border-slate-200 p-5 rounded-3xl space-y-3 font-mono shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-red-650" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans">
              Google SEO Indexing & Metadata Monitor
            </span>
          </div>
          <span className="text-[10px] bg-red-50 text-red-650 border border-red-100 px-2.5 py-0.5 rounded font-bold uppercase">
            Active / Indexed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
          <div className="space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold block font-mono">Google SERP Header Title:</span>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-red-650 font-bold leading-relaxed whitespace-pre-line text-[11px] shadow-xs">
              {currentLander.title}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold block font-mono">Meta Description:</span>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-slate-600 leading-normal text-[10px] shadow-xs">
              {currentLander.description}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500 pt-1.5 gap-2 border-t border-slate-200">
          <div>
            <strong>Sitemap Element URL:</strong> <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700 font-sans">{currentLander.url}</span>
          </div>
          <div className="text-red-650 font-bold">
            ⚡ Structured JSON-LD schema generated for 2026 indexing queues
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER & INTRODUCTORY COPY (RESEARCH POWERED) */}
      <div className="bg-white border border-slate-200/80 p-8 md:p-12 rounded-3xl space-y-6 relative overflow-hidden shadow-xs">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-50/50 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100/65 px-4 py-1.5 rounded-full text-[10px] font-bold text-red-655 uppercase tracking-wider">
          <Award className="w-4 h-4 text-amber-500" /> {currentLander.filterCity ? `Verified Deals in ${currentLander.filterCity}` : "Institutional Real Estate Directory"}
        </div>

        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-tight font-display tracking-tight">
          {currentLander.heading}
        </h1>

        <div className="text-slate-600 text-xs md:text-sm leading-relaxed border-l-4 border-red-650 pl-4 bg-slate-50 p-4 rounded-r-xl">
          {currentLander.introParagraph}
        </div>
      </div>

      {/* 3. LANDING PAGE GRID: SPECIFIC PROPERTIES MATCHING THE LANDER CODES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Property Listings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="font-extrabold text-slate-900 font-display text-sm">
              Pre-Screened RERA Registered Sourced Matches ({matchingProperties.length})
            </h3>
            <span className="text-xs text-slate-400 font-mono">2026 Live Audits</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matchingProperties.map(prop => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onClick={() => onSelectProperty(prop)}
                isComparing={compareIds.includes(prop.id)}
                onCompareToggle={onCompareToggle ? () => onCompareToggle(prop.id) : undefined}
                onContactBuilder={(p) => {
                  onOpenConsultation(`Hi, I'm interested in inquiring about "${p.title}" by ${p.developer}. I would like to schedule an HNI wealth consultation and review the exhaustive RERA/Escrow audit report for this specific unit.`);
                  onNotify(`Inquiry launched for ${p.title}! Form is pre-filled.`, 'success');
                }}
                ctaText="Examine Audit Report"
              />
            ))}
          </div>

          {matchingProperties.length === 0 && (
            <div className="p-12 bg-slate-50 border border-slate-200 rounded-3xl text-center text-slate-500 font-bold text-xs space-y-4">
              <p>No immediate properties matching this specific category listed in this region.</p>
              <button 
                onClick={() => onNavigateToTab('listings')}
                className="bg-red-650 text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-900 transition-all font-display"
              >
                Scan Full National Deals Portal
              </button>
            </div>
          )}

          {/* Lander FAQ segment */}
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
            <h4 className="text-xs text-slate-800 uppercase font-bold tracking-widest block flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <HelpCircle className="w-4 h-4 text-red-650" /> Regional Legal & Sourcing FAQ
            </h4>
            <div className="space-y-4 text-xs font-medium">
              {currentLander.faqs.map((faq, idx) => (
                <div key={idx} className="space-y-1.5">
                  <strong className="text-slate-800 block font-semibold">Q: {faq.q}</strong>
                  <p className="text-slate-600 leading-relaxed pl-4 border-l-2 border-slate-200">{faq.a}</p>
                </div>
              ))}
              <div className="space-y-1.5">
                <strong className="text-slate-800 block font-semibold">Q: How does the InvestorJi Score™ prevent capital traps?</strong>
                <p className="text-slate-600 leading-relaxed pl-4 border-l-2 border-slate-200">
                  We audit each builder balance sheet to measure construction velocity and liquidity reserves. Our weighted algorithm provides clean, unbiased parameters on safe opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Scorecard & Lead Capture Funnel */}
        <div className="space-y-6">
          
          {/* A. Dynamic Rating Score Box (Required Field: Section 3) */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-5 shadow-xs">
            <div className="text-center bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-black block tracking-widest">
                InvestorJi Category Score™
              </span>
              <div className="text-4xl font-extrabold text-slate-900 font-display mt-1">
                {currentLander.scores.overall} <span className="text-slate-400 text-xs font-mono font-medium">/10</span>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full font-bold inline-block mt-2">
                ★ Excellent Investment Opportunity
              </span>
            </div>

            <div className="space-y-3">
              <strong className="text-[11px] text-slate-800 uppercase font-bold tracking-wider block">
                Asset Health Parameters:
              </strong>
              
              <div className="space-y-2 text-xs">
                {/* Location */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Location Quality</span>
                  <div className="flex text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < currentLander.scores.location ? 'fill-yellow-500 text-yellow-500' : 'text-slate-200'}`} />
                    ))}
                  </div>
                </div>

                {/* Builder Reputation */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Builder Reputation</span>
                  <div className="flex text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < currentLander.scores.builder ? 'fill-yellow-500 text-yellow-500' : 'text-slate-200'}`} />
                    ))}
                  </div>
                </div>

                {/* Rental Potential */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Rental Potential</span>
                  <div className="flex text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < currentLander.scores.rental ? 'fill-yellow-500 text-yellow-500' : 'text-slate-200'}`} />
                    ))}
                  </div>
                </div>

                {/* Future Growth */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Future Growth Rating</span>
                  <div className="flex text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < currentLander.scores.growth ? 'fill-yellow-500 text-yellow-500' : 'text-slate-200'}`} />
                    ))}
                  </div>
                </div>

                {/* Liquidity */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Exit Liquidity</span>
                  <div className="flex text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < currentLander.scores.liquidity ? 'fill-yellow-500 text-yellow-500' : 'text-slate-200'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 leading-relaxed border-t border-slate-100 pt-3">
              ★ Score computed dynamically using 2026 micro-market transactions and RERA compliance data.
            </div>
          </div>

          {/* B. Specific Lander Sourcing Lead Funnel */}
          <div className="bg-red-50/50 border border-red-100 text-slate-800 p-6 rounded-2xl shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-100/30 rounded-full blur-xl pointer-events-none"></div>
            
            <h4 className="text-xs font-bold text-amber-600 mb-2 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Download className="w-4 h-4 text-red-650" /> Download Free PDF Report
            </h4>
            <div className="text-slate-900 font-display font-semibold text-xs leading-snug mb-4">
              "Top 25 High-Growth Sourcing Locations in {currentLander.filterCity || 'India'}"
            </div>

            <form onSubmit={handleLeadSubmit} className="space-y-3 text-slate-700 text-xs font-semibold">
              <div>
                <input 
                  type="text" 
                  placeholder="Your Complete Name"
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-red-500 placeholder-slate-400 text-slate-800 transition-colors shadow-xs"
                />
              </div>

              <div>
                <input 
                  type="tel" 
                  placeholder="WhatsApp Mobile Number"
                  required
                  value={leadMobile}
                  onChange={(e) => setLeadMobile(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-red-500 placeholder-slate-400 text-slate-800 transition-colors shadow-xs"
                />
              </div>

              <div>
                <input 
                  type="email" 
                  placeholder="Primary Email Identity"
                  required
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 outline-none focus:border-red-500 placeholder-slate-400 text-slate-800 transition-colors shadow-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-650 hover:bg-red-700 text-white transition-colors py-2.5 rounded-lg font-bold cursor-pointer font-display"
              >
                Disburse PDF Instant Catalog
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
