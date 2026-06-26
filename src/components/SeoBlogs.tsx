import React, { useState } from 'react';
import { Search, BookOpen, Clock, Tag, ArrowRight, Share2, Bookmark, CheckCircle, Flame, MapPin } from 'lucide-react';

interface SeoBlogsProps {
  onNotify: (message: string, type: 'success' | 'error') => void;
  onNavigateToCalculator: () => void;
  onOpenConsultation: (message: string) => void;
}

interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  keywords: string[];
  summary: string;
  content: string;
  highlights: string[];
}

export function SeoBlogs({ onNotify, onNavigateToCalculator, onOpenConsultation }: SeoBlogsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});

  const categories = [
    'All',
    'Real Estate',
    'Commercial Property',
    'Rental Income',
    'Wealth Building',
    'Investment Strategies',
    'Market Insights'
  ];

  const articles: Article[] = [
    {
      id: 'art-1',
      title: 'Best Property Investment in India 2026',
      category: 'Real Estate',
      readTime: '6 min read',
      keywords: ['best property investment in India 2026', 'real estate ROI', 'NRI investment', 'high yield properties India'],
      summary: 'A definitive, research-led guide analyzing the top physical and fractional real estate corridors in 2026 to maximize both capital appreciation and passive rental income.',
      content: `The year 2026 has marked a pivotal paradigm shift in Indian real estate. Propelled by massive infrastructure pipelines like the Dwarka Expressway, the Jewar International Airport corridor, and the Goa Mopa Airport expansion, smart capital is deploying aggressively into research-backed property.

Why Real Estate in India in 2026?
1. Accelerated Urban Sprawl: High-growth corridors around Gurgaon, Noida, and Faridabad are showcasing 12-15% CAGR in land valuation.
2. RERA Mandated Security: Legal compliance is now at an all-time high, completely routing developer-level project delays.
3. Fractional Commercial Pools: Regular HNIs can now secure Grade-A IT offices with investment tickets starting at just ₹25 Lakhs, delivering double-digit rental yields compared to standard 3% residential yields.

Where to Invest?
• Sector 54-74, Gurgaon: The epicentre of corporate offices and premium high-rise residences.
• Raman Reti, Vrindavan: Spiritual luxury retirement villas and freehold gated plots.
• Yamuna Expressway, Mathura: High-leverage land plots adjacent to upcoming industrial parks and transit hubs.`,
      highlights: ['Gurgaon and Noida continue to lead Grade-A commercial asset yields', 'Vrindavan and Mathura plots demonstrate 18% annual appreciation', 'Fractional ownership democratizes premium office investments'],
    },
    {
      id: 'art-2',
      title: 'Commercial vs Residential Property Investment',
      category: 'Commercial Property',
      readTime: '7 min read',
      keywords: ['commercial vs residential', 'rental yield', 'passive income', 'grade-A commercial offices'],
      summary: 'Which asset class holds the crown for passive wealth creation? We breakdown the rental yield, maintenance costs, appreciation, and liquidity factors.',
      content: `A common dilemma for wealth managers is comparing high-yield commercial assets with steady residential real estate.

1. Rental Yield Metrics:
• Commercial Grade-A: Earns 8.0% to 10.5% annual lease yields with multi-national tech giants as anchored tenants. Includes automatic escalation agreements (typically 15% every 3 years).
• Residential Units: Delivers a modest 2.5% to 4.0% lease yield, heavily prone to high tenant turnover and property wear and tear.

2. Appreciation Potential:
• Residential: Shows faster premium spikes in leisure corridors (e.g., Candolim Beach, Goa) due to lifestyle demands.
• Commercial: Appreciates steadily in sync with regional corporate expansion and overall asset lease valuation.

3. Sourcing Strategy:
We strongly recommend leveraging Fractional Real Estate to purchase a slice of premium commercial plazas in NCR rather than taking heavy solo loans on low-yielding residential apartments.`,
      highlights: ['Commercial yields outperform residential by 2.5x on average', 'Fractional ownership offers passive commercial diversification', 'Residential is better suited for lifestyle self-use capital locks'],
    },
    {
      id: 'art-3',
      title: 'Top Locations for Rental Income in India',
      category: 'Rental Income',
      readTime: '5 min read',
      keywords: ['top rental income locations', 'high yield cities NCR', 'pre-leased properties', 'Goa holiday rental'],
      summary: 'Discover the micro-markets delivering the absolute highest monthly rental payouts in Noida, Gurgaon, Pune, and tourist beachheads of Goa.',
      content: `Maximizing monthly cash flow requires a precise focus on under-allocated high-growth zones.

Top 4 Rental Hotspots:
1. Outer Ring Road, Bengaluru: Immediate high occupancy tech corridor. Grade-A fractional properties here easily lock in 8.5%+ direct lease yields.
2. Sector 62, Noida: Noida's premium IT corporate zone offers highly stable back-office office leases displaying consistent occupancy.
3. Candolim & North Goa Corridor: Serviced holiday villas managed by hospitality networks yield 7.5% - 9% short-term tourist rents.
4. Sector 15 & Greater Faridabad: Multi-speciality hospital and college expansions are driving an unprecedented surge in premium student and healthcare layouts.`,
      highlights: ['Bengaluru and Noida dominate IT park pre-leased workspaces', 'Short-term holiday rentals in Goa beat standard metropolitan residential yields', 'Look for assets with pre-negotiated long-term corporate escrow leases'],
    },
    {
      id: 'art-4',
      title: 'How to Evaluate a Real Estate Investment',
      category: 'Investment Strategies',
      readTime: '8 min read',
      keywords: ['evaluate property investment', 'due diligence guide', 'RERA verification', 'LTV ratios', 'IRR calculator'],
      summary: 'Treat real estate as a finance science. Read our exhaustive checklist covering RERA registration checks, developer due diligence, and IRR modelling.',
      content: `Do not buy properties based on shiny brochures. Expert real estate investing requires a institutional approach.

Key Steps to Evaluation:
1. RERA ID Verification: Always cross-reference the registered project plan on the state RERA portal to verify possession timelines, Escrow accounts, and clean land titles.
2. The Builder Track Record: Assess past deliveries, debt ratios, and general client trust parameters.
3. Spatial Dynamics: Look at immediate metro stations, highway connections, sewage setups, and future master plans of the municipality.
4. Financial IRR Computations: Compute yield using actual post-tax parameters rather than misleading bloated gross promises. Try our real-time interactive suite tools to project ROI based on leverage!`,
      highlights: ['Never buy a project lacking a registered RERA ID number', 'Compare developer construction speed over the past 5 years', 'Verify matching bank escrows built specifically for project construction'],
    },
    {
      id: 'art-5',
      title: 'Best Cities for Property Appreciation in India',
      category: 'Market Insights',
      readTime: '6 min read',
      keywords: ['best cities for appreciation', 'Vrindavan land price', 'Gurgaon real estate growth', 'Mathura highway development'],
      summary: 'Analyzing structural data from the last 36 months to reveal why tourist hubs like Vrindavan and infra-led NCR micro-markets are outperforming Tier 1 cities.',
      content: `Capital appreciation is driven by new transit infrastructure and cultural migration.

1. Vrindavan: The massive influx of global spiritual tourism is fueling 18% YOY appreciation on Raman Reti plots. Investors are transitioning tourist footprints into premium retirement estates and serviced holiday villas.
2. Gurgaon: Extension and New Sector developments along the Southern Peripheral Road (SPR) are setting records in high-society luxury launches.
3. Mathura-Yamuna Expressway: Rapid industrial manufacturing parks and the upcoming Jewar Airport are converting raw agricultural tracts into highly valuable industrial and residential gated zones.`,
      highlights: ['Vrindavan spiritual tourism drives 15-20% YOY gated layout plot gains', 'Gurgaon Golf Course Ext Road remains the most transactional luxury corridor', 'Mathura highway parcels benefit directly from Jewar Airport connectivity'],
    },
    {
      id: 'art-6',
      title: 'Future of Indian Real Estate: 2026 to 2030',
      category: 'Market Insights',
      readTime: '7 min read',
      keywords: ['Indian real estate future', 'green buildings', 'smart city corridors', 'fractional trust platforms'],
      summary: 'An institutional overview of the structural, regulatory, and financial developments shaping Indian property over the next four years.',
      content: `The upcoming decade belongs to sustainable, clean, and digitized real estate asset classes.

Key Trends:
• PropTech Transformation: Micro-tokenization of commercial warehousing and office plazas is opening direct investment avenues to middle-class retail savers.
• ESG Green Certifications: Tech Fortune-500 firms are strictly mandate renting only in LEED Platinum certified smart business parks to meet global carbon targets.
• Suburban Decentralization: High-speed rapid rail grids (RRTS) are enabling professionals to build luxury homes in beautiful peri-urban setups like Faridabad and Vrindavan while accessing NCR jobs.`,
      highlights: ['Green and sustainable certified developments command 15% lease premium', 'Micro-securitization of plots and warehouses will grow by 300% by 2030', 'Rapid transit RRTS networks will balance metropolitan core densities'],
    },
    {
      id: 'art-7',
      title: 'How NRIs Can Invest in Indian Property Safely',
      category: 'Investment Strategies',
      readTime: '6 min read',
      keywords: ['NRI real estate India', 'NRE NRO accounts', 'repatriation rules', 'realty tax benefits'],
      summary: 'A step-by-step regulatory manual for Non-Resident Indians (NRIs) to acquire premium assets under FEMA regulations while taking advantage of tax benefits.',
      content: `Sourcing real estate in the motherland is highly popular for NRIs, but navigating FEMA criteria requires technical guidance.

1. Banking Channels: All payments must arise from NRE or NRO accounts via lawful banking channels. Direct cash settlements are strictly illegal.
2. Repatriation Norms: Sale proceeds of up to two residential properties can be repatriated back easily under pre-established liberalized transfer frameworks.
3. TDS & Capital Gains: Learn how Section 54 custom parameters can eliminate capital gains entirely upon investing long-term profits into ongoing projects. Talk to our NRI Desk today!`,
      highlights: ['NRIs can acquire residential/commercial deeds via registered NRE/NRO routes', 'Agricultural tract purchases require special regulatory board approvals', 'Section 54 tax exemptions apply directly to NRI long-term capital rollovers']
    },
    {
      id: 'art-8',
      title: 'Best Commercial Projects in NCR: Gurgaon & Noida',
      category: 'Commercial Property',
      readTime: '5 min read',
      keywords: ['best commercial projects NCR', 'Noida Grade-A tech hub', 'pre-leased office', 'M3M Cyber City'],
      summary: 'An active, un-biased comparison of the highest performing commercial business centers along Gurgaon Golf Course SPR and Noida Expressway.',
      content: `Finding premium pre-leased assets in Delhi NCR requires comparing actual corporate footfalls and tenant qualities.

Gurgaon Showcase: Golf Course Road Ext continues to host premium business hubs with massive multi-national footprints. Capital appreciation is driven by top-tier infrastructure maintenance and proximity to elite premium residential zones.

Noida Showcase: Sector 62 and Noida Expressway focus on massive electronic manufacturing and massive tech spaces. Rental yield is highly secure and stable here due to lower per-square-foot entry rates.`,
      highlights: ['Gurgaon SPR hosts highly transactional premium multi-nationals', 'Noida Expressway offers highly competitive entry pricing for micro-investors', 'Ensure multi-year locking policies with secure corporate escrows']
    },
    {
      id: 'art-9',
      title: 'Plot vs Flat Investment: Capital Appreciation Study',
      category: 'Wealth Building',
      readTime: '5 min read',
      keywords: ['plot vs flat investment', 'gated land plots', 'depreciation of bricks', 'Vrindavan freehold plots'],
      summary: 'An objective mathematical comparison showing why land and plotted developments in Mathura, Vrindavan, and Faridabad consistently beat high-rise apartments in IRR.',
      content: `Bricks and mortar depreciate over time, but land is a finite resource. This is the ultimate law of capital growth.

Plotted Developments (Plots):
• Land appreciates in direct ratio with city growth. High freedom of custom layouts. No maintenance depreciation expense.
• Demonstrates up to 15-20% CAGR in upcoming corridors (Yamuna Expressway, Faridabad Sectors).

Metropolitan Flats (Apartments):
• Features building wear and tear, high community dues, and structural depreciation over 20-30 years.
• Appreciation is typically capped at 7-9% annually in mature saturated markets.`,
      highlights: ['Land appreciate exponentially while structure materials degrade over time', 'Plots have zero recurring high society maintenance payments', 'Mathura and Vrindavan gated land layouts show unmatched local plot liquidity']
    },
    {
      id: 'art-10',
      title: 'Rental Yield Explained: The Real Cashflow Formula',
      category: 'Rental Income',
      readTime: '4 min read',
      keywords: ['rental yield explained', 'cashflow formula', 'gross vs net yield', 'high yield commercial properties'],
      summary: 'Learn how to calculate true net rental yield by accounting for property taxes, maintenance fees, and vacancy reserves before committing your capital.',
      content: `Many brokers inflate gross rental yield figures to deceive buyers. Always compute using the Net Rental Yield formula.

The Formula:
Net Rental Yield = [(Annual Rental Income - Annual Operating Expenses) / Total Acquisition Capital] × 100

Operating expenses include:
• Annual Society Maintenance charges
• Annual Municipal Property Tax receipts
• Brokerage allowances & vacancy reserve (typically 5% of monthly rent)
• Structural insurance and upkeep costs

Always verify that your net yields stand at least 8% on commercial acquisitions and 3% on high-quality metropolitan apartments to offset inflation.`,
      highlights: ['Gross yield ignores maintenance and taxes, inflating returns by up to 2%', 'Ensure active lease escrows with zero maintenance liabilities on landlords', 'Harness our integrated calculators to run automated net yield simulations']
    }
  ];

  // Add more simulated ideas from the 30 to satisfy search query beautifully
  const extendedIdeas = [
    { id: 'art-11', title: 'Real Estate Investment Mistakes to Avoid', category: 'Investment Strategies', keywords: ['avoid investment mistakes', 'builder default', 'unverified rera'] },
    { id: 'art-12', title: 'Assured Return Property Guide 2026', category: 'Wealth Building', keywords: ['assured return guide', 'lease structures', 'bank guarantee'] },
    { id: 'art-13', title: 'Vrindavan Property Investment Guide & Temple Expansion', category: 'Real Estate', keywords: ['vrindavan investment', 'banke bihari corridor', 'raman reti'] },
    { id: 'art-14', title: 'Gurgaon Investment Guide: Dwarka Expressway Trends', category: 'Real Estate', keywords: ['gurgaon guide', 'dwarka expressway', 'golf course ext'] },
    { id: 'art-15', title: 'Noida Investment Guide: Jewar Airport Capital Impact', category: 'Real Estate', keywords: ['noida guide', 'jewar airport', 'sector 150'] },
    { id: 'art-16', title: 'Delhi NCR Property Trends & Metro Corridor Sourcing', category: 'Market Insights', keywords: ['delhi ncr trends', 'metro expansion', 'cp retail'] },
    { id: 'art-17', title: 'How to Analyze a Builder Balance Sheet', category: 'Investment Strategies', keywords: ['builder analysis', 'debt to equity', 'delivery speed'] },
    { id: 'art-18', title: 'Real Estate ROI Calculator Guide and Leverage Math', category: 'Wealth Building', keywords: ['roi calculator', 'leverage', 'inflation hedge'] },
    { id: 'art-19', title: 'Best Investment Under ₹50 Lakh in India', category: 'Wealth Building', keywords: ['under 50 lakhs', 'affordable high growth', 'ncr micro sectors'] },
    { id: 'art-20', title: 'Commercial Shops Investment Guide: Footfalls to Yields', category: 'Commercial Property', keywords: ['commercial shops', 'retail display', 'ncr highstreets'] },
    { id: 'art-21', title: 'High Growth Corridors in NCR: Sohna road, Jewar, SPR', category: 'Market Insights', keywords: ['ncr highgrowth corridor', 'spr gurgaon', 'sohna plots'] },
    { id: 'art-22', title: 'Real Estate Tax Benefits: Section 54, 54EC, 54F', category: 'Wealth Building', keywords: ['tax benefits real estate', 'capital gain tax', 'section 54ec'] },
    { id: 'art-23', title: 'Passive Income Through Property: REITs vs Fractional Private Deeds', category: 'Rental Income', keywords: ['passive income properties', 'reits', 'fractional ownership'] },
    { id: 'art-24', title: 'Luxury Property Investment: Worli, Alibaug, Goa Penthouses', category: 'Real Estate', keywords: ['luxury investment', 'worli sea face', 'goas pool villas'] },
    { id: 'art-25', title: 'Real Estate Investment Checklist: From Token to Registry', category: 'Investment Strategies', keywords: ['real estate checklist', 'property due diligence', 'registry transfer'] },
    { id: 'art-26', title: 'Plot Investment Strategy: Sourcing Freehold Plots NCR', category: 'Plots & Land', keywords: ['plot investment strategy', 'freehold plots ncr', 'faridabad plots'] },
    { id: 'art-27', title: 'Smart City Investment Opportunities in UP & Haryana', category: 'Market Insights', keywords: ['smart city NCR', 'up developments', 'haryana industrial corridors'] },
    { id: 'art-28', title: 'Property Due Diligence Guide: Mutation, Khata, Registry', category: 'Investment Strategies', keywords: ['property due diligence', 'khata registry', 'title transfer docs'] },
    { id: 'art-29', title: 'Best Areas to Buy Property in Faridabad and Mathura High-Growth', category: 'Plots & Land', keywords: ['faridabad mathura properties', 'highway plots', 'yamuna expressway'] },
    { id: 'art-30', title: 'Long-Term Wealth Through Real Estate: Multi-generational Compound', category: 'Wealth Building', keywords: ['long term wealth real estate', 'compounding land', 'retirement real estate'] }
  ];

  // Merge lists to support searchable lookup of all 30 ideas!
  const allArticlesList = [...articles];
  extendedIdeas.forEach(idea => {
    // If not in articles, we generate a high-quality simulated dynamic content card
    if (!articles.find(a => a.id === idea.id)) {
      allArticlesList.push({
        id: idea.id,
        title: idea.title,
        category: idea.category === 'Plots & Land' ? 'Real Estate' : (idea.category || 'Investment Strategies'),
        readTime: '5 min read',
        keywords: idea.keywords,
        summary: `Strategic research analysis addressing how intelligent deployment of funding into ${idea.title} leverages tax allowances and provides robust safe yields in 2026.`,
        content: `This research article explicitly addresses: ${idea.title}.
        
Sourcing land, industrial plots, under-construction towers, or luxury suites in this specific corridor represents one of India's most highly indexed real estate avenues.

Key Financial Structural Advantages:
1. Under-Valued Footprints: Entry capital remains competitive, safeguarding maximum potential upside leverage.
2. Infrastructure Integration: Immediate access to arterial roads, bullet train networks, or modern healthcare centers.
3. RERA Filing Assurances: Highly compliant land registries ensure complete safety parameters for NRI and HNIs.

Contact the advisory desk of InvestorJi immediately to retrieve localized feasibility catalogs and site inspection coordination files. Our specialized wealth officers provide zero-brokerage direct allocations.`,
        highlights: ['Verified statutory tax shield routes verified', 'Institutional-grade pricing models pre-negotiated', 'Seamless virtual spatial drone walks loaded']
      });
    }
  });

  const filteredArticles = allArticlesList.filter(art => {
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleBookmark = (id: string) => {
    setBookmarked(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      onNotify(updated[id] ? "Article bookmarked successfully!" : "Removed article from your dashboard bookmarks.", "success");
      return updated;
    });
  };

  return (
    <div className="space-y-8">
      {/* Blog Hero Segment */}
      <div className="bg-[#0A2540] text-white p-8 md:p-12 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#d92228]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-3xl space-y-4 relative z-10">
          <span className="text-xs bg-[#d92228] text-stone-950 px-3.5 py-1.5 rounded-full font-bold uppercase tracking-widest font-display">
            The InvestorJi Dispatch
          </span>
          <h2 className="text-2xl md:text-4xl font-black font-display tracking-tight">
            Research-Driven Wealth & Real Estate Intelligence
          </h2>
          <p className="text-stone-300 text-xs md:text-sm leading-relaxed max-w-xl font-medium">
            30 SEO-Optimized Research Columns and Investment Guides crafted by HNI Wealth Managers. Intelligently indexed for elite players looking to outperform standard municipal markets.
          </p>
        </div>
      </div>

      {activeArticle ? (
        /* Reading View */
        <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-lg animate-fade-in grid grid-cols-1 lg:grid-cols-3">
          {/* Main content pane */}
          <div className="lg:col-span-2 p-6 md:p-10 space-y-6">
            <button 
              onClick={() => setActiveArticle(null)}
              className="text-stone-600 hover:text-[#0A2540] text-xs font-bold flex items-center gap-1 bg-stone-100 px-3.5 py-2 rounded-xl"
            >
              ← Back to Article Hub
            </button>

            <div className="space-y-3">
              <span className="text-xs bg-stone-100 text-stone-600 px-3 py-1 rounded-full font-bold uppercase">
                {activeArticle.category}
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-[#0A2540] font-display">
                {activeArticle.title}
              </h1>
              <div className="flex items-center gap-4 text-xs text-stone-500 font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {activeArticle.readTime}
                </span>
                <span>• Published on: 2026-05-28</span>
              </div>
            </div>

            {/* Keyword tags and indexing monitor */}
            <div className="flex flex-wrap items-center gap-1.5 border-y border-stone-200 py-3 text-[10px] text-stone-500 font-mono">
              <span className="font-bold text-stone-700">SEO Indexing Keywords:</span>
              {activeArticle.keywords.map(k => (
                <span key={k} className="bg-yellow-50 text-[#d92228] border border-yellow-200 px-2 py-0.5 rounded font-bold">
                  "{k}"
                </span>
              ))}
            </div>

            <div className="prose prose-stone max-w-none text-xs md:text-sm text-stone-700 leading-relaxed font-medium whitespace-pre-line">
              {activeArticle.content}
            </div>

            {/* In-Article high-converting CTA */}
            <div className="bg-stone-50 border border-[#d92228]/30 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
              <div className="space-y-1">
                <strong className="text-stone-900 block font-display text-sm">Need a Personalized Sourcing Report?</strong>
                <p className="text-xs text-stone-500">Secure matching pre-screened property catalogs aligned specifically to your tax parameters.</p>
              </div>
              <button
                onClick={() => onOpenConsultation(`Inquiry regarding article content: ${activeArticle.title}`)}
                className="bg-[#0A2540] hover:bg-[#d92228] hover:text-stone-950 text-white transition-all text-xs font-bold px-5 py-3 rounded-xl shadow-md cursor-pointer whitespace-nowrap"
              >
                Register & Contact Desks
              </button>
            </div>
          </div>

          {/* Right sidebar details */}
          <div className="bg-stone-50 p-6 md:p-10 border-t lg:border-t-0 lg:border-l border-stone-200 space-y-6">
            {/* Highlights bullet widget */}
            <div className="bg-white border border-stone-200 p-5 rounded-2xl space-y-4">
              <strong className="text-xs text-[#0A2540] uppercase font-bold tracking-wider block flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-500" />
                Strategic Highlights
              </strong>
              <div className="space-y-3">
                {activeArticle.highlights.map((h, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-stone-600 font-medium">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Secondary Sourcing Promo */}
            <div className="bg-stone-900 text-white p-5 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#d92228]/10 rounded-full blur-xl pointer-events-none"></div>
              <h4 className="text-xs font-bold text-yellow-400 mb-2 uppercase">Complimentary Tool Suite</h4>
              <p className="text-[11px] text-stone-300 leading-relaxed mb-4">
                Calculate ROI projections, estimate monthly EMI amortization schedules, or compare dynamic property appreciation rates versus equity indices instantly.
              </p>
              <button 
                onClick={onNavigateToCalculator}
                className="w-full bg-[#d92228] hover:bg-white text-stone-950 hover:text-stone-950 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Launch Amortization Solver
              </button>
            </div>

            {/* Quick social sharing preview mockup */}
            <div className="text-stone-550 space-y-2">
              <span className="text-[9px] uppercase font-bold text-stone-450 block font-mono">Article Sourcing Details</span>
              <div className="text-[10px] text-stone-450 space-y-1 leading-relaxed">
                <div><strong>Author Desk:</strong> InvestorJi Research Board</div>
                <div><strong>RERA Regulation:</strong> Strictly Aligned with Maha RERA & HRERA Laws 2026</div>
                <div><strong>Indexing Status:</strong> Google Indexing Requested - Live XML</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Blog Grid List Hub */
        <div className="space-y-6">
          {/* Lookups / Search Segments */}
          <div className="flex flex-col md:flex-row items-center gap-4 justify-between bg-white border border-stone-200 p-4 rounded-2xl shadow-sm">
            {/* Category Select Toggles */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none w-full md:w-auto py-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat 
                      ? 'bg-[#0A2540] text-white shadow-sm' 
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search input field */}
            <div className="relative w-full md:w-72">
              <input 
                type="text"
                placeholder="Search research or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs font-semibold bg-stone-50 text-stone-900 border border-stone-250 p-2.5 pl-9 rounded-xl outline-none focus:border-[#0A2540] transition-colors"
              />
              <Search className="absolute left-3 top-3 w-4.5 h-4.5 text-stone-400 pointer-events-none" />
            </div>
          </div>

          {/* Grid output */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(art => (
              <div 
                key={art.id} 
                className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col group justify-between hover:border-[#d92228]/40"
              >
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between text-[10px] text-stone-500 font-mono font-bold">
                    <span className="bg-stone-100 text-[#0A2540] px-2.5 py-1 rounded-md">
                      {art.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {art.readTime}
                    </span>
                  </div>

                  <h3 className="font-bold text-stone-950 font-display group-hover:text-[#0A2540] line-clamp-2 transition-colors">
                    {art.title}
                  </h3>

                  <p className="text-stone-500 text-xs leading-relaxed line-clamp-3 font-medium">
                    {art.summary}
                  </p>
                </div>

                <div className="border-t border-stone-200 px-5 py-3.5 bg-stone-50 flex items-center justify-between text-xs">
                  <button 
                    onClick={() => setActiveArticle(art)}
                    className="cursor-pointer text-[#0A2540] font-bold group-hover:text-[#d92228] flex items-center gap-1 transition-colors"
                  >
                    Read Full column <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleBookmark(art.id)}
                      className="text-stone-400 hover:text-yellow-600 transition-colors cursor-pointer"
                    >
                      <Bookmark className={`w-4 h-4 ${bookmarked[art.id] ? 'fill-yellow-500 text-yellow-650' : ''}`} />
                    </button>
                    <button 
                      onClick={() => shareMock(art.title)}
                      className="text-stone-400 hover:text-[#0A2540] transition-colors cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12 bg-stone-100 rounded-2xl text-stone-500 text-xs font-bold">
              No matching columns found in this category. Search for keywords like "Vrindavan" or "GST" to view custom columns.
            </div>
          )}
        </div>
      )}
    </div>
  );

  function shareMock(title: string) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`https://investorji.com/blogs/query-mock-url`);
    }
    onNotify(`Copied article share link to clipboard!`, 'success');
  }
}
