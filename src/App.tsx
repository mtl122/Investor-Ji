import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Search, 
  MapPin, 
  ShieldCheck, 
  TrendingUp, 
  Calculator as CalcIcon, 
  Phone, 
  MessageSquare, 
  Award, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  Grid, 
  ShoppingBag, 
  UserCheck, 
  Layers, 
  Star, 
  Clock, 
  ChevronDown, 
  X, 
  Percent, 
  Briefcase, 
  ArrowUpRight, 
  BadgeCheck,
  Download,
  Flame,
  Globe,
  Share2,
  Bookmark,
  Scale,
  GitCompare,
  Sliders,
  Filter,
  Check,
  AlertTriangle
} from 'lucide-react';

import { Property, Lead } from './types';
import { PROPERTIES, TESTIMONIALS, AGENT_LEADS } from './data';
import { InvestorTools } from './components/InvestorTools';
import { Marketplace } from './components/Marketplace';
import { AgentLeads } from './components/AgentLeads';
import { SeoBlogs } from './components/SeoBlogs';
import { SeoLander } from './components/SeoLander';
import { PropertyCard } from './components/PropertyCard';
import { InvestorPortfolio } from './components/InvestorPortfolio';
import { InvestorChatbot } from './components/InvestorChatbot';
import { AdminPanel } from './components/AdminPanel';

export default function App() {
  // Website Menu / Routing State
  const [activeMenu, setActiveMenu] = useState<'home' | 'investments' | 'properties' | 'commercial' | 'plots' | 'blogs' | 'calculators' | 'about' | 'contact' | 'marketplace' | 'leads' | 'portfolio' | 'admin'>('home');
  
  // SEO Lander active path. If set, we render the SEO Landing Page component instead of standard activeMenu!
  const [activeSeoPath, setActiveSeoPath] = useState<string | null>(null);

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  // Real-time reactive properties and leads state allowing adding/deleting/updating
  const [propertiesList, setPropertiesList] = useState<Property[]>(PROPERTIES);
  const [leadsList, setLeadsList] = useState<Lead[]>(AGENT_LEADS);

  // Favorited properties and price threshold alert states
  const [favoritedIds, setFavoritedIds] = useState<string[]>(['prop-1', 'prop-3', 'prop-7']);
  const [priceAlerts, setPriceAlerts] = useState<Array<{ id: string; propertyId: string; email: string; targetPrice: number }>>([
    { id: 'alert-1', propertyId: 'prop-1', email: 'MTLENTERTAINMENTINDIA@gmail.com', targetPrice: 70 }
  ]);
  const [isSubscribedToWeekly, setIsSubscribedToWeekly] = useState<boolean>(true);
  const [subscribedEmail, setSubscribedEmail] = useState<string>('MTLENTERTAINMENTINDIA@gmail.com');

  // Admin Login States
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Comparative analysis states (MagicBricks inspired)
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompareDialog, setShowCompareDialog] = useState(false);

  // Search and Filtering states for property catalog
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [bracketFilter, setBracketFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [minScoreFilter, setMinScoreFilter] = useState<number | null>(null);

  // Lead PDF capture inputs
  const [reportName, setReportName] = useState('');
  const [reportMobile, setReportMobile] = useState('');
  const [reportEmail, setReportEmail] = useState('');

  // Floating notification trigger
  const [notifications, setNotifications] = useState<{ id: string; message: string; type: 'success' | 'error' }[]>([]);

  // Consultation booking values
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [showInquireDialog, setShowInquireDialog] = useState(false);

  // SEO dropdown menu state for live preview
  const [seoMenuOpen, setSeoMenuOpen] = useState(false);

  // Navigation Dropdown states
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isPartnerOpen, setIsPartnerOpen] = useState(false);

  // Guided Tour / Onboarding Wizard states
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [wizardGoal, setWizardGoal] = useState<'invest' | 'plots' | 'calculator' | 'material' | 'ai' | null>(null);
  const [wizardBudget, setWizardBudget] = useState<'under_50' | '50_100' | 'above_100' | 'any' | null>(null);

  // Dynamic state header and smooth responsive transitions
  const [isScrolled, setIsScrolled] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);

  const tickers = [
    "🔥 GURGAON ACTIVE: Dwarka Expressway land price indices lead national demand targets at +22.4% YOY capital gain",
    "🏢 COMMERCIAL: Premium corporate micro-suites pre-leased to Fortune-500 leases secure an average 8.9% triple-net yield",
    "🌳 VRINDAVAN LAND: 410+ absolute freehold title mutation and RERA registry profiles verified online",
    "🔒 ESCROW SYSTEM: Active 100% broker-free Escrow banking node verified. Direct developer ledger links verified",
    "📈 NATIONAL CAGR: Grade-A retail allocation sectors showing robust 14.5% long-term historical HNI returns"
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % tickers.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [tickers.length]);

  // Trigger Dynamic notifications
  const triggerNotification = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4500);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportName || !reportMobile || !reportEmail) {
      triggerNotification('Please provide a valid name, email, and mobile number.', 'error');
      return;
    }
    triggerNotification(`Success! The PDF "Top 25 High-Growth Sourcing Locations in India Guide" has been dispatched to ${reportEmail}! Aligned with dynamic 2026-2030 research metrics.`, 'success');
    setReportName('');
    setReportMobile('');
    setReportEmail('');
  };

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone) {
      triggerNotification('Please provide your name and phone number to schedule your slot.', 'error');
      return;
    }
    triggerNotification(`Namaste! Sourcing reservation registered for ${contactName}. An executive HNI wealth advisor will ring you on ${contactPhone} within 15 minutes.`, 'success');
    setShowInquireDialog(false);
    setContactName('');
    setContactPhone('');
    setContactEmail('');
    setContactMessage('');
  };

  // Switch tab utility
  const handleNavigateToTab = (tab: typeof activeMenu) => {
    setActiveSeoPath(null);
    setSelectedProperty(null);
    setActiveMenu(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Switch SEO Page utility
  const handleNavigateToSeoPage = (path: string) => {
    setActiveSeoPath(path);
    setSelectedProperty(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSeoMenuOpen(false);
    triggerNotification(`SEO Indexed Page simulation loaded: ${path}`, 'success');
  };

  const handleFavoriteToggle = (id: string) => {
    if (favoritedIds.includes(id)) {
      setFavoritedIds(favoritedIds.filter(item => item !== id));
      triggerNotification("Listing unpinned from favorites.", "success");
    } else {
      setFavoritedIds([...favoritedIds, id]);
      triggerNotification("Listing pinned to your favorites dashboard!", "success");
    }
  };

  const handleSetPriceAlert = (propertyId: string, email: string, targetPrice: number) => {
    const exists = priceAlerts.find(a => a.propertyId === propertyId && a.email === email);
    if (exists) {
      setPriceAlerts(priceAlerts.map(a => a.id === exists.id ? { ...a, targetPrice } : a));
      triggerNotification(`Price alert threshold updated to ₹${targetPrice} Lakhs for ${email}!`, 'success');
    } else {
      const newAlert = {
        id: `alert-${Date.now()}`,
        propertyId,
        email,
        targetPrice
      };
      setPriceAlerts([...priceAlerts, newAlert]);
      triggerNotification(`Price alert activated! You'll receive warning alert if this drops to ₹${targetPrice} Lakhs.`, 'success');
    }
  };

  const handleRemovePriceAlert = (id: string) => {
    setPriceAlerts(priceAlerts.filter(a => a.id !== id));
    triggerNotification("Price threshold alert removed.", "success");
  };

  const handleToggleWeeklySubscription = (email: string) => {
    if (isSubscribedToWeekly && subscribedEmail === email) {
      setIsSubscribedToWeekly(false);
      setSubscribedEmail('');
      triggerNotification("Successfully unsubscribed from Sourcing weekly dispatch digest.", "success");
    } else {
      setIsSubscribedToWeekly(true);
      setSubscribedEmail(email);
      triggerNotification(`Sourcing dispatch digest subscription activated! Dispatches to ${email}.`, "success");
    }
  };

  const handleAddProperty = (newProp: Property) => {
    setPropertiesList([newProp, ...propertiesList]);
  };

  const handleUpdateProperty = (id: string, updatedFields: Partial<Property>) => {
    setPropertiesList(propertiesList.map(p => p.id === id ? { ...p, ...updatedFields } : p));
  };

  const handleDeleteProperty = (id: string) => {
    setPropertiesList(propertiesList.filter(p => p.id !== id));
  };

  const handleUpdateLead = (id: string, updatedFields: Partial<Lead>) => {
    setLeadsList(leadsList.map(l => l.id === id ? { ...l, ...updatedFields } : l));
  };

  const handleCompareToggle = (id: string) => {
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter(item => item !== id));
      triggerNotification("Property removed from comparison.", "success");
    } else {
      if (compareIds.length >= 3) {
        triggerNotification("You can compare a maximum of 3 properties side-by-side.", "error");
        return;
      }
      setCompareIds([...compareIds, id]);
      triggerNotification("Property added to comparison list.", "success");
    }
  };

  const handleContactBuilder = (property: Property) => {
    setContactMessage(`Hi, I'm interested in inquiring about "${property.title}" by ${property.developer}. I would like to schedule an HNI wealth consultation and review the exhaustive RERA/Escrow audit report for this specific unit.`);
    setShowInquireDialog(true);
    triggerNotification(`Inquiry launched for ${property.title}! Form is pre-filled.`, 'success');
  };

  // Filter properties base data
  const filteredProperties = propertiesList.filter(prop => {
    let matchesSearch = prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        prop.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        prop.developer.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCity = cityFilter === 'All' || prop.city === cityFilter;

    let matchesBracket = true;
    if (bracketFilter === 'under_50') {
      matchesBracket = prop.minInvestment < 50;
    } else if (bracketFilter === '50_100') {
      matchesBracket = prop.minInvestment >= 50 && prop.minInvestment <= 100;
    } else if (bracketFilter === 'above_100') {
      matchesBracket = prop.minInvestment > 100;
    }

    let matchesType = typeFilter === 'All' || prop.type === typeFilter || (typeFilter === 'Plots' && prop.isPlot);
    let matchesScore = minScoreFilter === null || (prop.investorJiScore ?? 9.0) >= minScoreFilter;

    return matchesSearch && matchesCity && matchesBracket && matchesType && matchesScore;
  });

  // Dynamic Score breakdown summary formatting
  const getScoreRatingLabel = (score: number) => {
    if (score >= 9.5) return "Prime AAA Asset Placement";
    if (score >= 9.2) return "Excellent Investment Opportunity";
    return "Robust High-Yield Asset";
  };

  return (
    <div id="investorji-redesign-root" className="min-h-screen bg-[#060B13] text-slate-100 font-sans selection:bg-red-650 selection:text-white flex flex-col justify-between">
      
      {/* 1. DYNAMIC TOAST NOTIFICATIONS */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 pointer-events-none">
        {notifications.map(n => (
          <div 
            key={n.id} 
            className="pointer-events-auto p-4 rounded-xl shadow-xl flex items-center gap-3 max-w-sm font-sans text-xs font-bold border animate-in slide-in-from-right duration-200 bg-[#131b2e] text-slate-100 border-[#334155]"
          >
            <div className="p-1.5 rounded-full bg-red-950/50 text-red-400">
              <CheckCircle className="w-4 h-4" />
            </div>
            <span>{n.message}</span>
          </div>
        ))}
      </div>

      {/* 2. TOP TRUST BAR STRIP WITH LIVE ROTATING TICKER INDICATORS */}
      <div className="bg-[#0F172A] text-slate-200 px-4 py-2 text-[10px] sm:text-xs font-sans font-medium border-b border-red-500/20 shadow-inner tracking-wide">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-3 overflow-hidden w-full md:w-auto">
            <span className="inline-flex items-center gap-1.5 shrink-0">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <strong className="text-red-500 font-bold uppercase text-[9px] font-mono bg-red-950/70 border border-red-900/50 px-2 py-0.5 rounded-sm">Live Sourcing Track &rarr;</strong>
            </span>
            <div className="text-slate-300 font-mono font-medium transition-opacity duration-300 truncate text-[10px] w-full md:max-w-2xl text-left">
              {tickers[tickerIndex]}
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-slate-400">
            <span className="text-slate-400 font-mono text-[9px]">
              Platform Time: 2026-05-28 UTC
            </span>
            <span className="text-red-400 font-bold text-[10px]">
              ★ Direct Escrow Verification active
            </span>
          </div>
        </div>
      </div>

      {/* 3. MAIN HEADER NAVIGATION BAR (NO-BROKER CRIMSON RED THEME WITH DYNAMIC SCROLL TRANSITION) */}
      <nav className={`sticky top-0 z-40 bg-[#070a13]/95 backdrop-blur-md border-b transition-all duration-300 ${
        isScrolled 
          ? 'py-2.5 border-red-950/40 shadow-xl' 
          : 'py-4 border-slate-800/80 shadow-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center justify-between">
            <div 
              onClick={() => handleNavigateToTab('home')}
              className="cursor-pointer flex items-center gap-2 group select-none"
            >
              <div className="w-10 h-10 bg-red-950/30 border border-red-900/40 flex items-center justify-center rounded-xl shadow-sm transition-all group-hover:bg-red-950/50">
                <Building className="text-red-500 w-5 h-5 stroke-2" />
              </div>
              <div>
                <span className="text-xl font-black text-slate-100 tracking-tight flex items-center gap-1.5 font-display">
                  InvestorJi
                  <span className="text-[9px] bg-red-600 text-white px-2 py-0.5 rounded-md font-bold shadow-md">RERA ACTIVE</span>
                </span>
                <span className="text-[9px] text-red-500 block uppercase font-bold tracking-widest mt-0.5 font-mono">
                  No-Brokerage Real Estate Portal ⚡
                </span>
              </div>
            </div>

            {/* Inquire direct button on mobile */}
            <button 
              onClick={() => {
                setContactMessage("Drafting sourcing request for the Executive portfolio circle.");
                setShowInquireDialog(true);
              }}
              className="lg:hidden text-[10px] bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-lg font-bold transition-all shadow-md"
            >
              Consult Desk
            </button>
          </div>

          {/* WEBSITE MENU (Consolidated & Organized into Dropdowns to prevent visual overload) */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold font-sans">
            <button 
              onClick={() => {
                handleNavigateToTab('home');
                setIsCategoriesOpen(false);
                setIsResourcesOpen(false);
                setIsPartnerOpen(false);
              }}
              className={`px-3 py-2 rounded-lg transition-all ${activeMenu === 'home' && !activeSeoPath ? 'bg-red-950/55 text-red-400 border border-red-900/40 shadow-xs' : 'text-slate-300 hover:text-red-400 hover:bg-slate-900/60'}`}
            >
              Home
            </button>
            <button 
              onClick={() => {
                handleNavigateToTab('investments');
                setIsCategoriesOpen(false);
                setIsResourcesOpen(false);
                setIsPartnerOpen(false);
              }}
              className={`px-3 py-2 rounded-lg transition-all ${activeMenu === 'investments' && !activeSeoPath ? 'bg-red-950/55 text-red-400 border border-red-900/40 shadow-xs' : 'text-slate-300 hover:text-red-400 hover:bg-slate-900/60'}`}
            >
              Investments
            </button>
            <button 
              onClick={() => {
                handleNavigateToTab('calculators');
                setIsCategoriesOpen(false);
                setIsResourcesOpen(false);
                setIsPartnerOpen(false);
              }}
              className={`px-3 py-2 rounded-lg transition-all ${activeMenu === 'calculators' && !activeSeoPath ? 'bg-red-950/55 text-red-400 border border-red-900/40 shadow-xs' : 'text-slate-300 hover:text-red-400 hover:bg-slate-900/60'}`}
            >
              Calculators
            </button>
            <button 
              onClick={() => {
                handleNavigateToTab('portfolio');
                setIsCategoriesOpen(false);
                setIsResourcesOpen(false);
                setIsPartnerOpen(false);
              }}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1 ${activeMenu === 'portfolio' && !activeSeoPath ? 'bg-red-950/55 text-red-400 border border-red-905/40 shadow-xs font-bold' : 'text-slate-300 hover:text-red-400 hover:bg-slate-900/60'}`}
            >
              🎒 My Portfolio
            </button>

            {/* Dropdown: Sourcing Categories */}
            <div className="relative">
              <button 
                onClick={() => {
                  setIsCategoriesOpen(!isCategoriesOpen);
                  setIsResourcesOpen(false);
                  setIsPartnerOpen(false);
                }}
                className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  ['properties', 'commercial', 'plots', 'marketplace'].includes(activeMenu) && !activeSeoPath
                    ? 'bg-red-955/35 text-red-400 border border-red-900/30'
                    : 'text-slate-300 hover:text-red-400 hover:bg-slate-900/60'
                }`}
              >
                <span>🏢 Sourcing Categories</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isCategoriesOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-[#131b2e] rounded-2xl shadow-xl border border-slate-800 z-50 overflow-hidden text-xs py-1">
                  <button 
                    onClick={() => {
                      handleNavigateToTab('properties');
                      setIsCategoriesOpen(false);
                    }} 
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-900 font-bold text-slate-200 hover:text-red-400 flex items-center gap-2"
                  >
                    🏠 Property Listings
                  </button>
                  <button 
                    onClick={() => {
                      handleNavigateToTab('commercial');
                      setIsCategoriesOpen(false);
                    }} 
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-900 font-bold text-slate-200 hover:text-red-400 flex items-center gap-2"
                  >
                    🏢 Commercial Suites
                  </button>
                  <button 
                    onClick={() => {
                      handleNavigateToTab('plots');
                      setIsCategoriesOpen(false);
                    }} 
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-900 font-bold text-slate-200 hover:text-red-400 flex items-center gap-2"
                  >
                    🌳 Plots & Townships
                  </button>
                  <button 
                    onClick={() => {
                      handleNavigateToTab('marketplace');
                      setIsCategoriesOpen(false);
                    }} 
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-900 font-bold text-red-400 hover:text-red-300 flex items-center gap-2 border-t border-slate-800/80"
                  >
                    🧱 Wholesale Store
                  </button>
                </div>
              )}
            </div>

            {/* Dropdown: Sourcing Resources */}
            <div className="relative">
              <button 
                onClick={() => {
                  setIsResourcesOpen(!isResourcesOpen);
                  setIsCategoriesOpen(false);
                  setIsPartnerOpen(false);
                }}
                className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  ['blogs', 'about', 'contact'].includes(activeMenu) && !activeSeoPath
                    ? 'bg-red-955/35 text-red-400 border border-red-900/30'
                    : 'text-slate-300 hover:text-red-400 hover:bg-slate-900/60'
                }`}
              >
                <span>📚 Resources & Guides</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isResourcesOpen && (
                <div className="absolute left-0 mt-2 w-52 bg-[#131b2e] rounded-2xl shadow-xl border border-slate-800 z-50 overflow-hidden text-xs py-1">
                  <button 
                    onClick={() => {
                      handleNavigateToTab('blogs');
                      setIsResourcesOpen(false);
                    }} 
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-900 font-bold text-slate-200 hover:text-red-400"
                  >
                    📝 Blogs & Research
                  </button>
                  <button 
                    onClick={() => {
                      handleNavigateToTab('about');
                      setIsResourcesOpen(false);
                    }} 
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-900 font-bold text-slate-200 hover:text-red-400"
                  >
                    ✨ Sourcing Manifesto
                  </button>
                  <button 
                    onClick={() => {
                      handleNavigateToTab('contact');
                      setIsResourcesOpen(false);
                    }} 
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-900 font-bold text-slate-200 hover:text-red-400"
                  >
                    📞 Advisor Helpdesk
                  </button>
                </div>
              )}
            </div>

            {/* Dropdown: Portals */}
            <div className="relative">
              <button 
                onClick={() => {
                  setIsPartnerOpen(!isPartnerOpen);
                  setIsCategoriesOpen(false);
                  setIsResourcesOpen(false);
                }}
                className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  ['leads', 'admin'].includes(activeMenu) && !activeSeoPath
                    ? 'bg-amber-955/35 text-amber-400 border border-amber-900/30'
                    : 'text-slate-300 hover:text-amber-400 hover:bg-slate-900/60'
                }`}
              >
                <span>🔑 Partner Portals</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isPartnerOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#131b2e] rounded-2xl shadow-xl border border-slate-800 z-50 overflow-hidden text-xs py-1">
                  <button 
                    onClick={() => {
                      handleNavigateToTab('leads');
                      setIsPartnerOpen(false);
                    }} 
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-900 font-bold text-slate-200 hover:text-red-400 flex items-center gap-2"
                  >
                    🎯 Broker CRM Desk
                  </button>
                  <button 
                    onClick={() => {
                      handleNavigateToTab('admin');
                      setIsPartnerOpen(false);
                    }} 
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-900 font-bold text-amber-400 hover:text-amber-300 flex items-center gap-2 border-t border-slate-800/80"
                  >
                    🔑 Owner Admin Panel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* DYNAMIC SEO LANDING PAGES PREVIEW DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setSeoMenuOpen(!seoMenuOpen)}
              className="w-full lg:w-auto bg-red-950/50 hover:bg-red-900/30 text-red-400 transition-all text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-between gap-1.5 shadow-xs cursor-pointer border border-red-900/50 whitespace-nowrap"
            >
              <Globe className="w-4 h-4" />
              <span>Property Sourcing Hubs (11)</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {seoMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-[#131b2e] rounded-2xl shadow-xl border border-slate-800 z-50 overflow-hidden text-xs py-2 divide-y divide-slate-800">
                <div className="px-3.5 py-1.5 text-[10px] uppercase font-bold text-slate-400 font-mono bg-slate-950/40">
                  Main Sourcing Pages
                </div>
                <div className="py-1">
                  <button onClick={() => { handleNavigateToSeoPage('/commercial-property-india'); setSeoMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-900 font-bold text-slate-200 hover:text-red-400">🏢 Commercial Properties</button>
                  <button onClick={() => { handleNavigateToSeoPage('/residential-property-india'); setSeoMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-900 font-bold text-slate-200 hover:text-red-400">🏠 Residential Homes</button>
                  <button onClick={() => { handleNavigateToSeoPage('/plots-for-sale-india'); setSeoMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-900 font-bold text-slate-200 hover:text-red-400">🌳 Plots & Land</button>
                  <button onClick={() => { handleNavigateToSeoPage('/investment-property-india'); setSeoMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-900 font-bold text-slate-200 hover:text-red-400">💰 Investment Property</button>
                  <button onClick={() => { handleNavigateToSeoPage('/rental-income-properties'); setSeoMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-900 font-bold text-slate-200 hover:text-red-400">💸 Rental Income Properties</button>
                </div>
                <div className="px-3.5 py-1.5 text-[10px] uppercase font-bold text-slate-400 font-mono bg-slate-950/40">
                  Target City Guides
                </div>
                <div className="py-1">
                  <button onClick={() => { handleNavigateToSeoPage('/property-in-vrindavan'); setSeoMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-900 text-slate-300 font-semibold hover:text-red-400">• Sourcing in Vrindavan</button>
                  <button onClick={() => { handleNavigateToSeoPage('/property-in-gurgaon'); setSeoMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-900 text-slate-300 font-semibold hover:text-red-400">• Sourcing in Gurgaon</button>
                  <button onClick={() => { handleNavigateToSeoPage('/property-in-noida'); setSeoMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-900 text-slate-300 font-semibold hover:text-red-400">• Sourcing in Noida</button>
                  <button onClick={() => { handleNavigateToSeoPage('/property-in-delhi'); setSeoMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-900 text-slate-300 font-semibold hover:text-red-400">• Sourcing in Delhi</button>
                  <button onClick={() => { handleNavigateToSeoPage('/property-in-faridabad'); setSeoMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-900 text-slate-300 font-semibold hover:text-red-400">• Sourcing in Faridabad</button>
                  <button onClick={() => { handleNavigateToSeoPage('/property-in-mathura'); setSeoMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-900 text-slate-300 font-semibold hover:text-red-400">• Sourcing in Mathura</button>
                </div>
              </div>
            )}
          </div>

        </div>
      </nav>

      {/* 4. MAIN CONTAINER VIEWPORT */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* RENDER SEO LANDING PAGE IF PATH IS ACTIVE */}
        {activeSeoPath ? (
          <SeoLander 
            properties={propertiesList}
            activePath={activeSeoPath}
            onNotify={triggerNotification}
            onNavigateToTab={handleNavigateToTab}
            onSelectProperty={(p) => {
              setSelectedProperty(p);
              handleNavigateToTab('properties');
            }}
            onOpenConsultation={(msg) => {
              setContactMessage(msg);
              setShowInquireDialog(true);
            }}
            compareIds={compareIds}
            onCompareToggle={handleCompareToggle}
          />
        ) : (
          /* OTHERWISE RENDER REGULAR MENU ROUTE TAB */
          <div className="space-y-12">
            
            {/* TAB: HOME VIEW */}
            {activeMenu === 'home' && (
              <div className="space-y-12 animate-fade-in">
                
                {/* INTERACTIVE GUIDED CONCIERGE & FINDER WIZARD */}
                <div id="quick-finder-wizard" className="bg-[#0b111e] rounded-3xl p-6 sm:p-8 border border-red-905/30 shadow-2xl relative overflow-hidden">
                  {/* Backdrop details */}
                  <div className="absolute -top-16 -right-16 w-48 h-48 bg-red-955/20 rounded-full blur-3xl pointer-events-none"></div>
                  
                  <div className="max-w-4xl mx-auto space-y-6 relative">
                    
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4">
                      <div>
                        <div className="inline-flex items-center gap-1.5 text-[10px] bg-red-955/40 text-red-400 px-3 py-1 rounded-full border border-red-900/30 font-mono font-bold uppercase tracking-wider mb-2">
                          <Flame className="w-3 h-3 text-red-500 animate-pulse" /> Interactive Concierge Guide
                        </div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 font-display tracking-tight flex items-center gap-2">
                          Not sure where to start? Let us guide you!
                        </h2>
                        <p className="text-xs text-slate-400 font-medium">
                          Answer 2 simple questions to configure the entire platform for your exact needs.
                        </p>
                      </div>
                      
                      {/* Step Indicator */}
                      <div className="flex items-center gap-1 shrink-0 font-mono text-xs font-bold bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-400">
                        <span>Step</span>
                        <span className="text-red-400 font-black text-sm">{wizardStep}</span>
                        <span>/</span>
                        <span>3</span>
                      </div>
                    </div>

                    {/* STEP 1: SELECT GOAL */}
                    {wizardStep === 1 && (
                      <div className="space-y-6 animate-fade-in">
                        <div className="text-sm font-bold text-slate-200">
                          Q1. What is your primary objective or requirement today?
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
                          {/* Option A: High Yield Investments */}
                          <div 
                            onClick={() => setWizardGoal('invest')}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 select-none ${
                              wizardGoal === 'invest' 
                                ? 'bg-red-955/30 border-red-500/80 shadow-md shadow-red-950/20' 
                                : 'bg-slate-900/45 border-slate-800/80 hover:bg-slate-900/90 hover:border-slate-700/85'
                            }`}
                          >
                            <div className="w-9 h-9 bg-red-950/30 border border-red-900/40 rounded-xl flex items-center justify-center text-red-500">
                              <TrendingUp className="w-4 h-4 stroke-[2.5]" />
                            </div>
                            <div>
                              <div className="text-xs font-black text-slate-100 mb-1">HNI Returns</div>
                              <div className="text-[10px] text-slate-400 leading-snug font-medium">Verified corporate office spaces & yields.</div>
                            </div>
                          </div>

                          {/* Option B: Plots & Land */}
                          <div 
                            onClick={() => setWizardGoal('plots')}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 select-none ${
                              wizardGoal === 'plots' 
                                ? 'bg-red-955/30 border-red-500/80 shadow-md shadow-red-950/20' 
                                : 'bg-slate-900/45 border-slate-800/80 hover:bg-slate-900/90 hover:border-slate-700/85'
                            }`}
                          >
                            <div className="w-9 h-9 bg-emerald-950/30 border border-emerald-900/40 rounded-xl flex items-center justify-center text-emerald-400">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-black text-slate-100 mb-1">Plots & Land</div>
                              <div className="text-[10px] text-slate-400 leading-snug font-medium">Gated townships with absolute title deeds.</div>
                            </div>
                          </div>

                          {/* Option C: Calculators */}
                          <div 
                            onClick={() => setWizardGoal('calculator')}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 select-none ${
                              wizardGoal === 'calculator' 
                                ? 'bg-red-955/30 border-red-500/80 shadow-md shadow-red-950/20' 
                                : 'bg-slate-900/45 border-slate-800/80 hover:bg-slate-900/90 hover:border-slate-700/85'
                            }`}
                          >
                            <div className="w-9 h-9 bg-purple-950/30 border border-purple-900/40 rounded-xl flex items-center justify-center text-purple-400">
                              <CalcIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-black text-slate-100 mb-1">Yield Tools</div>
                              <div className="text-[10px] text-slate-400 leading-snug font-medium">Calculate loan EMIs and ROI projections.</div>
                            </div>
                          </div>

                          {/* Option D: Material Store */}
                          <div 
                            onClick={() => setWizardGoal('material')}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 select-none ${
                              wizardGoal === 'material' 
                                ? 'bg-red-955/30 border-red-500/80 shadow-md shadow-red-950/20' 
                                : 'bg-slate-900/45 border-slate-800/80 hover:bg-slate-900/90 hover:border-slate-700/85'
                            }`}
                          >
                            <div className="w-9 h-9 bg-amber-950/30 border border-amber-900/40 rounded-xl flex items-center justify-center text-amber-400">
                              <ShoppingBag className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-black text-slate-100 mb-1">Wholesale Shop</div>
                              <div className="text-[10px] text-slate-400 leading-snug font-medium">Direct builder prices for Steel, Cement & Stone.</div>
                            </div>
                          </div>

                          {/* Option E: Chat with AI */}
                          <div 
                            onClick={() => setWizardGoal('ai')}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 select-none ${
                              wizardGoal === 'ai' 
                                ? 'bg-red-955/30 border-red-500/80 shadow-md shadow-red-950/20' 
                                : 'bg-slate-900/45 border-slate-800/80 hover:bg-slate-900/90 hover:border-slate-700/85'
                            }`}
                          >
                            <div className="w-9 h-9 bg-sky-950/30 border border-sky-900/40 rounded-xl flex items-center justify-center text-sky-450 animate-pulse">
                              <MessageSquare className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-black text-slate-100 mb-1">Sourcing AI</div>
                              <div className="text-[10px] text-slate-400 leading-snug font-medium">Chat with real-time advisor about law & projects.</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end pt-2">
                          <button
                            onClick={() => {
                              if (!wizardGoal) {
                                triggerNotification("Please select one option to proceed with the guidance.", "error");
                                return;
                              }
                              setWizardStep(2);
                            }}
                            className={`px-6 py-2.5 rounded-xl font-bold font-display text-xs flex items-center gap-1.5 transition-all shadow-md ${
                              wizardGoal 
                                ? 'bg-red-650 text-white hover:bg-red-700 cursor-pointer' 
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            Continue
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 2: BUDGET BRACKET */}
                    {wizardStep === 2 && (
                      <div className="space-y-6 animate-fade-in">
                        <div className="text-sm font-bold text-slate-200">
                          Q2. What is your targeted budget or purchase ticket size?
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                          {/* Bracket A: Under 50 */}
                          <div 
                            onClick={() => setWizardBudget('under_50')}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 select-none ${
                              wizardBudget === 'under_50' 
                                ? 'bg-red-955/30 border-red-500/80 shadow-md shadow-red-950/20' 
                                : 'bg-slate-900/45 border-slate-800/80 hover:bg-slate-900/90 hover:border-slate-700/85'
                            }`}
                          >
                            <span className="text-xs font-mono uppercase font-bold text-slate-400">Entry / Micro</span>
                            <div className="text-base font-black text-slate-100">Under ₹50 L</div>
                            <p className="text-[10px] text-slate-400 leading-normal">Fractional assets, materials & township plots.</p>
                          </div>

                          {/* Bracket B: 50 - 100 */}
                          <div 
                            onClick={() => setWizardBudget('50_100')}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 select-none ${
                              wizardBudget === '50_100' 
                                ? 'bg-red-955/30 border-red-500/80 shadow-md shadow-red-950/20' 
                                : 'bg-slate-900/45 border-slate-800/80 hover:bg-slate-900/90 hover:border-slate-700/85'
                            }`}
                          >
                            <span className="text-xs font-mono uppercase font-bold text-red-400">Standard</span>
                            <div className="text-base font-black text-slate-100">₹50 L - ₹1 Cr</div>
                            <p className="text-[10px] text-slate-400 leading-normal">Corporate suites, high-growth apartments.</p>
                          </div>

                          {/* Bracket C: Above 100 */}
                          <div 
                            onClick={() => setWizardBudget('above_100')}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 select-none ${
                              wizardBudget === 'above_100' 
                                ? 'bg-red-955/30 border-red-500/80 shadow-md shadow-red-950/20' 
                                : 'bg-slate-900/45 border-slate-800/80 hover:bg-slate-900/90 hover:border-slate-700/85'
                            }`}
                          >
                            <span className="text-xs font-mono uppercase font-bold text-[#D4AF37]">Premium / HNI</span>
                            <div className="text-base font-black text-slate-100">Above ₹1 Cr</div>
                            <p className="text-[10px] text-slate-400 leading-normal">Exclusive commercial zones, complete land parcels.</p>
                          </div>

                          {/* Bracket D: Any */}
                          <div 
                            onClick={() => setWizardBudget('any')}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 select-none ${
                              wizardBudget === 'any' 
                                ? 'bg-red-955/30 border-red-500/80 shadow-md shadow-red-950/20' 
                                : 'bg-slate-900/45 border-slate-800/80 hover:bg-slate-900/90 hover:border-slate-700/85'
                            }`}
                          >
                            <span className="text-xs font-mono uppercase font-bold text-slate-400">Flexible</span>
                            <div className="text-base font-black text-slate-100">Just Browsing</div>
                            <p className="text-[10px] text-slate-400 leading-normal">Show me all options without active filtering.</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                          <button
                            onClick={() => setWizardStep(1)}
                            className="px-4 py-2 bg-slate-900 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer border border-slate-800"
                          >
                            ← Back
                          </button>
                          
                          <button
                            onClick={() => {
                              if (!wizardBudget) {
                                triggerNotification("Please select a budget level to get your custom recommendation.", "error");
                                return;
                              }
                              setWizardStep(3);
                            }}
                            className={`px-6 py-2.5 rounded-xl font-bold font-display text-xs flex items-center gap-1.5 transition-all shadow-md ${
                              wizardBudget 
                                ? 'bg-red-650 text-white hover:bg-red-700 cursor-pointer' 
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            Generate My Sourcing Route
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: CUSTOM RECOMMENDATION PATHWAY */}
                    {wizardStep === 3 && (
                      <div className="space-y-6 animate-fade-in text-slate-100">
                        <div className="bg-red-955/25 border border-red-900/35 p-5 rounded-2xl space-y-3">
                          <div className="flex items-center gap-2 text-red-400 font-extrabold text-sm">
                            <BadgeCheck className="w-5 h-5 text-red-500" />
                            <span>Custom Sourcing Alignment Verified!</span>
                          </div>
                          
                          <p className="text-xs leading-relaxed text-slate-300">
                            {wizardGoal === 'invest' && (
                              <span>
                                🏢 We've configured the <strong>High-Yield Sourcing Deck</strong>. Your custom alignment of pre-leased premium commercial assets with triple-net guarantees and Maharera/HRERA-verified credentials has been prepared for a budget of <strong>{wizardBudget === 'under_50' ? 'Under ₹50L' : wizardBudget === '50_100' ? '₹50L - ₹1Cr' : wizardBudget === 'above_100' ? 'Above ₹1Cr' : 'All Budget Caps'}</strong>.
                              </span>
                            )}
                            {wizardGoal === 'plots' && (
                              <span>
                                🌳 <strong>Townships & Plots Deck Activated!</strong> We've highlighted gating and infrastructure land layouts with direct legal title verification, clear registry links, and direct HRERA mutations matching your target ticket size.
                              </span>
                            )}
                            {wizardGoal === 'calculator' && (
                              <span>
                                🧮 <strong>Advanced Financial Desk Ready!</strong> The Loan EMI and Investment ROI simulators are pre-focused. Access direct post-tax IRR spreadsheets, compound yield graphs, and rental offset indices matching your parameters.
                              </span>
                            )}
                            {wizardGoal === 'material' && (
                              <span>
                                🧱 <strong>Direct Sourcing Store Configured!</strong> We've loaded the direct manufacturer catalog with real-time price sheets for <strong>Grade-A TMT Steel rebar</strong>, premium high-gloss <strong>Makrana Marble</strong>, and <strong>OPC Cement loads</strong> with door-delivery logistics.
                              </span>
                            )}
                            {wizardGoal === 'ai' && (
                              <span>
                                💬 <strong>AI Sourcing Co-Pilot Online!</strong> The real-time AI assistant has been updated with context regarding your budget requirements and is standing by to answer statutory or local layout queries.
                              </span>
                            )}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                          <button
                            onClick={() => {
                              if (wizardGoal === 'invest') {
                                handleNavigateToTab('investments');
                                if (wizardBudget === 'under_50') {
                                  setBracketFilter('Under 50 Lakhs');
                                } else if (wizardBudget === '50_100') {
                                  setBracketFilter('50 Lakhs - 1 Crore');
                                } else if (wizardBudget === 'above_100') {
                                  setBracketFilter('Above 1 Crore');
                                } else {
                                  setBracketFilter('All');
                                }
                                triggerNotification("Sourcing Pathway activated! Enjoy your pre-filtered investments catalog.", "success");
                              } else if (wizardGoal === 'plots') {
                                handleNavigateToTab('plots');
                                triggerNotification("Sourcing Pathway activated! Enjoy verified gated township plots.", "success");
                              } else if (wizardGoal === 'calculator') {
                                handleNavigateToTab('calculators');
                                triggerNotification("Sourcing Calculators loaded successfully.", "success");
                              } else if (wizardGoal === 'material') {
                                handleNavigateToTab('marketplace');
                                triggerNotification("Wholesale Sourcing Store loaded successfully.", "success");
                              } else if (wizardGoal === 'ai') {
                                const botBtn = document.getElementById('chat-toggle-btn');
                                if (botBtn) botBtn.click();
                                triggerNotification("Sourcing AI copilot activated. Check bottom-right corner!", "success");
                              }
                            }}
                            className="flex-1 bg-red-650 hover:bg-red-700 text-white py-3.5 rounded-xl font-extrabold text-xs transition-all shadow-md text-center cursor-pointer font-display animate-pulse flex items-center justify-center gap-1.5"
                          >
                            🚀 Launch My Custom Sourcing Deck
                          </button>
                          
                          <button
                            onClick={() => {
                              setWizardStep(1);
                              setWizardGoal(null);
                              setWizardBudget(null);
                            }}
                            className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-slate-800 text-center"
                          >
                            Restart Guide
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                {/* A. HOMEPAGE HERO SECTION (Required Feature) */}
                <section className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200 grid grid-cols-1 lg:grid-cols-5 relative min-h-[460px]">
                  
                  {/* Subtle red brand radial details in backdrop */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-red-50 rounded-full blur-3xl pointer-events-none"></div>
                  
                  {/* Left segment - Headline & core options */}
                  <div className="lg:col-span-3 p-8 md:p-12 lg:p-16 flex flex-col justify-between space-y-8 relative">
                    <div className="space-y-6">
                      <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200/65 px-3.5 py-1.5 rounded-full text-red-600 text-[10px] font-bold uppercase tracking-widest font-mono">
                        <Award className="w-3.5 h-3.5 text-red-600" /> India's Trusted Sourcing Partner
                      </div>

                      {/* Required Headline & Subheading */}
                      <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight font-display tracking-tight">
                        Invest Smarter. <br/>
                        <span className="text-red-600">Grow Faster.</span>
                      </h1>

                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-lg font-medium">
                        Discover verified property investments, commercial opportunities, and wealth-building assets across India. Skip standard broker noise with verified RERA direct escrows.
                      </p>
                    </div>

                    {/* Required CTA buttons */}
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold pt-2">
                      <button 
                        onClick={() => handleNavigateToTab('investments')}
                        className="bg-red-600 hover:bg-slate-900 text-white px-6 py-3.5 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-1.5"
                      >
                        Explore Investments
                      </button>
                      <button 
                        onClick={() => {
                          setContactMessage("Drafting free scheduling request for portfolio consultation on Indian real estate pipelines.");
                          setShowInquireDialog(true);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-900 px-6 py-3.5 rounded-xl border border-slate-200 transition-all cursor-pointer"
                      >
                        Book Free Consultation
                      </button>
                    </div>

                    {/* Fast high-value numbers banner */}
                    <div className="border-t border-slate-150 pt-6 grid grid-cols-3 gap-4 text-slate-800">
                      <div>
                        <span className="text-xl sm:text-2xl font-black text-red-600">100%</span>
                        <span className="text-[9px] uppercase font-bold text-slate-500 block font-mono mt-0.5 font-sans">RERA Screened</span>
                      </div>
                      <div>
                        <span className="text-xl sm:text-2xl font-black text-slate-900">₹320+ Crores</span>
                        <span className="text-[9px] uppercase font-bold text-slate-500 block font-mono mt-0.5 font-sans">Sourced Safely</span>
                      </div>
                      <div>
                        <span className="text-xl sm:text-2xl font-black text-slate-900">9.7/10</span>
                        <span className="text-[9px] uppercase font-bold text-slate-500 block font-mono mt-0.5 font-sans">Ji Score Average</span>
                      </div>
                    </div>

                  </div>

                  {/* Right segment - Sourcing card aesthetics */}
                  <div className="lg:col-span-2 relative min-h-[300px] bg-slate-950 flex flex-col justify-end p-8 text-white group border-l border-slate-100">
                    <div className="absolute inset-0">
                      <img 
                        src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80" 
                        alt="High Density Commercial asset" 
                        className="w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                    </div>

                    <div className="relative z-10 space-y-4">
                      <div className="bg-slate-900/90 backdrop-blur-md border border-red-500/20 p-4 rounded-xl text-left max-w-sm">
                        <span className="text-[8px] text-red-400 font-bold uppercase tracking-widest block mb-0.5">Featured High-Yield Asset</span>
                        <p className="font-extrabold text-white text-xs font-display">Connaught Royal Business Plaza</p>
                        <p className="text-slate-200 text-[10px] sm:text-xs mt-1 leading-relaxed">
                          Secure passive rent of <strong className="text-red-400">₹1.1 Lakh / month</strong> with institutional Triple net contracts.
                        </p>
                      </div>

                      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-xl text-xs text-slate-300 leading-relaxed font-semibold">
                        "Real estate in India is undergoing rapid digitisation. Our proprietary RERA audits protect NRI resources from developer capital traps."
                        <span className="text-[10px] text-red-400 font-bold block mt-1.5 text-right">— Divyansh Kumar, Sourcing Director</span>
                      </div>
                    </div>
                  </div>

                </section>

                {/* B. SECTION 1: WHY THOUSANDS WILL TRUST INVESTORJI (Required Feature) */}
                <section className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 space-y-8 shadow-xs">
                  <div className="text-center max-w-2xl mx-auto space-y-3">
                    <span className="text-xs text-red-600 font-black uppercase tracking-widest font-mono">
                      Uncompromising Trust Framework
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-950 font-display tracking-tight border-b-2 border-red-100 pb-2 inline-block">
                      Why Thousands Will Trust InvestorJi
                    </h2>
                    <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-semibold mt-2">
                      Designed as an objective real estate analytical partner rather than a standard brokerage portal. Real data, real safety.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Points list */}
                    {[
                      { t: "Verified Investment Opportunities", d: "100% indexed listings undergo strict Title audits and active Maha RERA / HRERA verification loops before listing." },
                      { t: "Expert Analysis", d: "Detailed capitalization rate models, leverage yield evaluations, and pre-sales margin analytics compiled by seasoned researchers." },
                      { t: "High Growth Locations", d: "Strategically targeting the upcoming Jewar Airport, Dwarka Expressway, and sacred Vrindavan luxury peripheral zones." },
                      { t: "Rental Income Focus", d: "Maximizing immediate investor yields using pre-leased corporate IT squares and smart commercial highstreets." },
                      { t: "Builder Due Diligence", d: "We examine builder balance sheets to measure construction velocity and structural reserves of the developer." },
                      { t: "Free Investment Guidance", d: "Direct zero-brokerage schedules, detailed PDF prospectus downloads, and real-time support from accredited wealth desks." }
                    ].map((pt, i) => (
                      <div key={i} className="bg-slate-50/60 border border-slate-200 p-6 rounded-2xl space-y-2.5 hover:border-red-500/50 hover:bg-white transition-all duration-350">
                        <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 border border-red-200/50 font-extrabold flex items-center justify-center text-xs">
                          {i + 1}
                        </div>
                        <h4 className="font-bold text-slate-900 font-display text-sm">
                          {pt.t}
                        </h4>
                        <p className="text-slate-600 text-xs leading-relaxed font-medium">
                          {pt.d}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* C. SECTION 2: FEATURED CATEGORIES (Required Feature) */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3 font-sans">
                    <div>
                      <h2 className="text-lg sm:text-xl font-black text-slate-900 font-display">
                        Featured Sourcing Categories
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">Click into any sector to explore targeted RERA audited deals instantly.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                      { icon: "🏢", label: "Commercial Properties", desc: "Grade-A IT Parks", path: "/commercial-property-india" },
                      { icon: "🏠", label: "Residential Homes", desc: "Luxury Sky Villas", path: "/residential-property-india" },
                      { icon: "🌳", label: "Plots & Land", desc: "Freehold Townships", path: "/plots-for-sale-india" },
                      { icon: "🏬", label: "Retail Shops", desc: "High-street Showrooms", path: "/commercial-property-india" },
                      { icon: "🏗️", label: "Under Construction Progress", desc: "Pre-launch Capital Margins", path: "/commercial-property-india" },
                      { icon: "💰", label: "Assured Return Securities", desc: "Lease-backed 10% Cashflow", path: "/rental-income-properties" }
                    ].map((cat, idx) => (
                      <div 
                        key={idx}
                        onClick={() => handleNavigateToSeoPage(cat.path)}
                        className="cursor-pointer bg-white border border-slate-200 p-5 rounded-2xl shadow-xs hover:shadow-md hover:border-red-500/50 hover:-translate-y-1 transition-all duration-300 text-center space-y-2 group"
                      >
                        <div className="text-3xl transition-transform duration-200 group-hover:scale-110">
                          {cat.icon}
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 leading-tight font-display">
                          {cat.label}
                        </h4>
                        <p className="text-[10px] text-red-600 font-semibold uppercase font-mono">
                          {cat.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* D. SECTION 3: INVESTORJI SCORE™ EXPLAINER & METRICS CARD PANEL (Required Feature) */}
                <section className="bg-white text-slate-800 rounded-3xl p-8 md:p-12 relative overflow-hidden border border-slate-200 shadow-sm">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-red-50/40 rounded-full blur-3xl pointer-events-none"></div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    
                    {/* Left details */}
                    <div className="space-y-6">
                      <span className="text-[10px] bg-red-50 border border-red-200/60 text-red-600 px-3.5 py-1.5 rounded-full font-bold uppercase tracking-widest font-mono">
                        Proprietary Quantitative Standard
                      </span>
                      <h3 className="text-2xl md:text-3xl font-black font-display tracking-tight text-slate-900">
                        We Screen Every Real Estate Asset <br/> Through <span className="text-red-600">InvestorJi Score™</span>
                      </h3>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold">
                        Bypass standard developer inflated brochures. Every listed micro-share and plot gets an objective rating score from 0 to 10 based on five regulatory & physical benchmarks.
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs font-semibold">
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                          <strong className="text-slate-900 block font-display">Location quality ⭐</strong>
                          <span className="text-[11px] text-slate-500 mt-1 block">Arterial links, metro nodes</span>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                          <strong className="text-slate-900 block font-display">Builder Reputation ⭐</strong>
                          <span className="text-[11px] text-slate-500 mt-1 block">Balance sheets & past delivery</span>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                          <strong className="text-slate-900 block font-display">Rental Potential ⭐</strong>
                          <span className="text-[11px] text-slate-500 mt-1 block">Demographics, job clusters</span>
                        </div>
                        <div className="p-3 bg-red-50 border border-red-200/50 rounded-xl">
                          <strong className="text-red-700 block font-display">Future Growth ⭐</strong>
                          <span className="text-[11px] text-red-950/60 mt-1 block">Transit nodes, infra pipeline</span>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                          <strong className="text-slate-900 block font-display">Exit Liquidity ⭐</strong>
                          <span className="text-[11px] text-slate-500 mt-1 block">Resale velocity metrics</span>
                        </div>
                      </div>
                    </div>

                    {/* Right scorecard visual showcase */}
                    <div className="bg-white border-2 border-red-650/40 p-6 rounded-2xl space-y-4 shadow-md">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <span className="text-[10px] text-slate-450 uppercase font-black block font-mono">Example Asset Evaluation Code</span>
                        <span className="text-[10px] text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded">RERA ACTIVE</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-sm font-display">InvestorJi Score™ 9.1/10</h4>
                          <span className="text-[10px] text-emerald-600 font-mono font-bold">Excellent Investment Opportunity</span>
                        </div>
                        <div className="text-2xl font-black text-red-600">9.1</div>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-normal font-semibold">
                        "Evaluating Connaught outer circle corporate retail squares. Superior location density coupled with zero-inflation lease contracts secures high passive safety quotients."
                      </p>

                      <div className="pt-2 flex items-center justify-between">
                        <button 
                          onClick={() => handleNavigateToTab('investments')}
                          className="text-xs text-red-600 hover:text-red-700 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                        >
                          Deploys Capital into verified 9.0+ deals &rarr;
                        </button>
                      </div>
                    </div>

                  </div>
                </section>

                {/* E. LEAD CAPTURE SECTION: FREE REPORT DOWNLOAD (Required Feature) */}
                <section className="bg-gradient-to-br from-red-650 to-rose-700 text-white rounded-3xl p-8 md:p-12 shadow-xl border border-red-500/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center relative z-10">
                    
                    <div className="lg:col-span-3 space-y-4">
                      <span className="text-xs bg-white text-red-650 px-3.5 py-1 rounded-full font-bold uppercase tracking-widest font-mono shadow-xs">
                        Free Exclusive Sourcing Report
                      </span>
                      <h3 className="text-xl md:text-3xl font-black font-display tracking-tight text-white mb-2">
                        Top 25 High-Growth Investment Locations in India
                      </h3>
                      <p className="text-white/95 text-xs sm:text-sm leading-relaxed font-semibold max-w-xl">
                        Acquire the latest research study outlining where deep capital is migrating. Includes detailed micro-market pricing grids, RERA updates, and 2026 tax optimization hacks.
                      </p>
                    </div>

                    <div className="lg:col-span-2">
                      <form onSubmit={handleReportSubmit} className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 space-y-4 text-white text-xs font-semibold font-sans">
                        <div>
                          <input 
                            type="text" 
                            placeholder="Register Your Complete Name"
                            required
                            value={reportName}
                            onChange={(e) => setReportName(e.target.value)}
                            className="w-full bg-white text-slate-900 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-red-400 placeholder-slate-450"
                          />
                        </div>

                        <div>
                          <input 
                            type="tel" 
                            placeholder="WhatsApp Mobile Number (+91)"
                            required
                            value={reportMobile}
                            onChange={(e) => setReportMobile(e.target.value)}
                            className="w-full bg-white text-slate-900 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-red-400 placeholder-slate-450"
                          />
                        </div>

                        <div>
                          <input 
                            type="email" 
                            placeholder="Primary Corporate Email Identity"
                            required
                            value={reportEmail}
                            onChange={(e) => setReportEmail(e.target.value)}
                            className="w-full bg-white text-slate-900 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-red-400 placeholder-slate-450"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-slate-950 hover:bg-slate-900 text-white transition-colors py-3.5 rounded-xl font-bold font-display shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Download className="w-4 h-4" /> Download Free PDF Report
                        </button>
                      </form>
                    </div>

                  </div>
                </section>

                {/* F. TESTIMONIALS STRIP */}
                <section className="space-y-6">
                  <div className="text-center max-w-xl mx-auto space-y-2">
                    <strong className="text-xs text-red-650 uppercase tracking-widest block font-mono font-bold">Verified Success Logs</strong>
                    <h3 className="text-xl sm:text-2xl font-black font-display text-white">Approved by National & NRI Investors</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
                    {TESTIMONIALS.map(test => (
                      <div key={test.id} className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-xs flex flex-col justify-between hover:border-red-650/40 transition-all duration-300">
                        <p className="text-slate-700 text-xs leading-relaxed font-semibold italic">
                          "{test.content}"
                        </p>
                        <div className="flex items-center gap-3 pt-4 border-t border-slate-150">
                          <img src={test.profile} alt={test.name} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                          <div>
                            <strong className="text-slate-900 block text-xs font-semibold leading-none">{test.name}</strong>
                            <span className="text-[10px] text-slate-500 block font-medium mt-1">{test.role}, {test.company}</span>
                            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Yield Target: {test.achievedROI}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* G. FUTURE READY EXPANSION ROADMAP */}
                <section className="bg-white border border-slate-200 p-8 md:p-12 rounded-3xl space-y-6">
                  <h3 className="text-lg md:text-xl font-extrabold text-slate-900 font-display border-b pb-2">InvestorJi Ecosystem Sourcing Roadmap</h3>
                  <p className="text-xs text-slate-600 max-w-xl font-medium">
                    Our platform is designed to scale dynamically beyond direct brokerage sourcing pools into a fully comprehensive quantitative wealth network.
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {[
                      { icon: "🏪", label: "Marketplace", desc: "Wholesale Steel & Marble" },
                      { icon: "🛡️", label: "Advisory Desk", desc: "RERA Strict Escrows" },
                      { icon: "📽️", label: "YouTube Hub", desc: "AI-Generated Explaners" },
                      { icon: "🤝", label: "HNI Club", desc: "Investor Forums" },
                      { icon: "🎪", label: "Real Estate Events", desc: "Local City Expos" },
                      { icon: "🎓", label: "Real Estate Courses", desc: "Taxation Academies" },
                      { icon: "🪙", label: "Wealth Platform", desc: "Integrated Ledger" }
                    ].map((exp, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-xl text-center space-y-1 border border-slate-150 shadow-xs hover:border-red-500/50 transition-all">
                        <div className="text-xl">{exp.icon}</div>
                        <strong className="text-[10px] text-slate-800 block font-bold leading-tight">{exp.label}</strong>
                        <span className="text-[8px] text-slate-500 block font-semibold leading-normal">{exp.desc}</span>
                      </div>
                    ))}
                  </div>
                </section>

              </div>
            )}

            {/* TAB: INVESTMENTS / CATALOG GRID */}
            {activeMenu === 'investments' && (
              <div className="space-y-8 animate-fade-in">
                
                {/* 1. MAGICBRICKS INSPIRED INVESTOR DISCOVERY PORTAL (DEEP DARK PREMIUM DESIGN) */}
                <div className="bg-[#111726]/90 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden space-y-6">
                  
                  {/* Subtle amber visual backing spot */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-red-955/10 rounded-full blur-3xl pointer-events-none"></div>
                  
                  {/* Sourcing portal header details */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#334155]/30 pb-5 font-sans">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Sliders className="w-5 h-5 text-[#D4AF37]" />
                        <h2 className="text-lg md:text-xl font-extrabold text-white font-display tracking-tight">
                          Elite Sourcing & Discovery Dashboard
                        </h2>
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        Adaptively search, filter, and compare high-yield real estate projects with instantaneous RERA verification and Ji-Score ranking audits.
                      </p>
                    </div>
                    {/* Active counters badge */}
                    <div className="flex items-center gap-2 font-mono text-[10px]">
                      <span className="text-emerald-400 bg-emerald-950/40 border border-emerald-900/40 px-2.5 py-1 rounded-full font-bold">
                        ● {filteredProperties.length} Assets Matches
                      </span>
                      {compareIds.length > 0 && (
                        <span className="text-[#D4AF37] bg-amber-955/40 border border-amber-900/40 px-2.5 py-1 rounded-full font-bold">
                          ★ {compareIds.length}/3 Compares
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Primary Grid Sorter Filter Controls */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 font-sans">
                    
                    {/* Search string field */}
                    <div className="lg:col-span-4 space-y-1">
                      <label className="block text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wider">
                        Search Identifier
                      </label>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Search builders, locations, amenities..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full text-xs font-semibold bg-slate-950 text-slate-100 border border-slate-800 p-3 pl-9 rounded-xl outline-none focus:border-[#D4AF37] placeholder-slate-500 transition-colors"
                        />
                        <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                      </div>
                    </div>

                    {/* Micro market city filter */}
                    <div className="lg:col-span-4 space-y-1">
                      <label className="block text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wider">
                        Micro-Market City
                      </label>
                      <select
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                        className="w-full text-xs font-bold bg-slate-950 text-slate-100 border border-slate-800 p-3 rounded-xl outline-none focus:border-[#D4AF37] transition-colors cursor-pointer"
                      >
                        <option value="All">All Cities (NCR & Temples)</option>
                        <option value="Gurgaon">Gurgaon (High-yield Hub)</option>
                        <option value="Vrindavan">Vrindavan (Heritage freehold)</option>
                        <option value="Noida">Noida (Industrial & IT)</option>
                        <option value="Delhi">Delhi NCR (Capital Region)</option>
                        <option value="Faridabad">Faridabad (Industrial sector)</option>
                        <option value="Mathura">Mathura (Temple Freehold)</option>
                      </select>
                    </div>

                    {/* Bracket filter */}
                    <div className="lg:col-span-4 space-y-1">
                      <label className="block text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wider">
                        Investment Bracket
                      </label>
                      <select
                        value={bracketFilter}
                        onChange={(e) => setBracketFilter(e.target.value)}
                        className="w-full text-xs font-bold bg-slate-950 text-slate-100 border border-slate-800 p-3 rounded-xl outline-none focus:border-[#D4AF37] transition-colors cursor-pointer"
                      >
                        <option value="All">All Brackets</option>
                        <option value="under_50">Under ₹50 Lakhs (Micro/Fractional Slices)</option>
                        <option value="50_100">₹50 Lakhs - ₹1 Crore (Standard Suites)</option>
                        <option value="above_100">Above ₹1 Crore (HNI Direct Asset)</option>
                      </select>
                    </div>

                  </div>

                  {/* High density quick category switcher pills */}
                  <div className="space-y-2 pt-2">
                    <span className="block text-[9px] font-mono font-extrabold text-slate-400 uppercase tracking-wider">
                      Sourcing Division
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {['All', 'Commercial', 'Residential', 'Assured Return', 'Fractional', 'Plots'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setTypeFilter(type)}
                          className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                            typeFilter === type
                              ? 'bg-red-950/65 text-red-400 border-red-900/60 shadow-xs'
                              : 'bg-slate-950/40 text-slate-300 border-slate-805/80 hover:text-slate-100 hover:bg-slate-900'
                          }`}
                        >
                          {type === 'All' ? '🌌 Show All Categories' : type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sourcing Score Filter slider & Reset desk buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800/60 font-sans">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setMinScoreFilter(prev => prev === 9.2 ? null : 9.2);
                        }}
                        className={`text-[10px] font-bold px-3.5 py-2 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                          minScoreFilter === 9.2
                            ? 'bg-[#18233c] text-[#D4AF37] border-amber-900/60'
                            : 'bg-slate-950/30 text-slate-400 border-slate-850 hover:text-slate-200 hover:bg-slate-900/50'
                        }`}
                      >
                        <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>High Grade Only (&ge; 9.2 Score)</span>
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setSearchQuery('');
                        setCityFilter('All');
                        setBracketFilter('All');
                        setTypeFilter('All');
                        setMinScoreFilter(null);
                        triggerNotification('Listing filters have been successfully restored to default parameters.', 'success');
                      }}
                      className="text-[10px] font-extrabold text-red-400 bg-red-955/20 border border-red-900/40 px-4 py-2 rounded-xl hover:bg-red-950/40 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      Restore Default Search
                    </button>
                  </div>

                </div>

                {/* Sifted results grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                  {filteredProperties.map(prop => (
                    <PropertyCard
                      key={prop.id}
                      property={prop}
                      onClick={() => {
                        setSelectedProperty(prop);
                        handleNavigateToTab('properties');
                      }}
                      isComparing={compareIds.includes(prop.id)}
                      onCompareToggle={() => handleCompareToggle(prop.id)}
                      isFavorited={favoritedIds.includes(prop.id)}
                      onFavoriteToggle={() => handleFavoriteToggle(prop.id)}
                      onSetPriceAlert={handleSetPriceAlert}
                      onContactBuilder={handleContactBuilder}
                      ctaText="Verify Real-time Audit"
                    />
                  ))}
                </div>

                {filteredProperties.length === 0 && (
                  <div className="text-center py-20 bg-[#0f1524] border border-slate-850 rounded-3xl text-slate-400 font-bold text-xs space-y-3 relative overflow-hidden">
                    <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto animate-pulse" />
                    <div>No secure real estate assets match your designated filter matrix.</div>
                    <button 
                      onClick={() => {
                        setSearchQuery('');
                        setCityFilter('All');
                        setBracketFilter('All');
                        setTypeFilter('All');
                        setMinScoreFilter(null);
                      }}
                      className="bg-red-650 hover:bg-[#b0171d] text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                    >
                      Restructuring Parameters
                    </button>
                  </div>
                )}

              </div>
            )}

            {/* TAB: PROPERTIES VIEW SCREEN */}
            {activeMenu === 'properties' && (
              <div className="space-y-8 animate-fade-in">
                
                {selectedProperty ? (
                  /* Render selected property breakdown & scores (Required Feature: Section 3) */
                  <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-lg grid grid-cols-1 lg:grid-cols-3">
                    
                    <div className="lg:col-span-2 p-6 md:p-10 space-y-6">
                      <button 
                        onClick={() => setSelectedProperty(null)}
                        className="text-stone-600 hover:text-slate-950 font-bold text-xs flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-lg border"
                      >
                        &larr; Back to Catalog
                      </button>

                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                          <span className="bg-slate-100 px-2.5 py-1 rounded text-slate-600 font-bold">{selectedProperty.type}</span>
                          <span className="text-slate-400">RERA ID: {selectedProperty.reraId}</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-[#0A2540] font-display">
                          {selectedProperty.title}
                        </h2>
                        <p className="text-[#d92228] font-bold text-xs">{selectedProperty.tagline}</p>
                      </div>

                      <div className="h-72 bg-slate-900 rounded-2xl overflow-hidden border">
                        <img src={selectedProperty.image} alt={selectedProperty.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>

                      <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed font-semibold">
                        <h4 className="text-sm font-bold text-slate-950 font-display">Asset Operational Summary</h4>
                        <p className="whitespace-pre-line">{selectedProperty.description}</p>
                      </div>

                      {/* Amenities checklist */}
                      <div className="space-y-3">
                        <h4 className="text-xs uppercase font-extrabold text-slate-400 font-mono tracking-wider">Asset Sourced Amenities</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                          {selectedProperty.amenities.map(am => (
                            <div key={am} className="flex items-center gap-1.5 text-slate-700 bg-slate-50 p-2 rounded-lg border">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                              <span className="font-semibold">{am}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payment Schedule */}
                      <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
                        <h4 className="text-xs uppercase text-slate-500 font-mono font-black tracking-wider">Sourcing Installment Roadmaps</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Stage 1 Allocation Token</span>
                            <p className="font-bold text-slate-900">{selectedProperty.paymentPlan.bookingAmount}</p>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Stage 2 Milestone Sourcing</span>
                            <p className="font-bold text-slate-900">{selectedProperty.paymentPlan.stage1}</p>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Stage 3 Registry mutation</span>
                            <p className="font-bold text-slate-900">{selectedProperty.paymentPlan.stage2}</p>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Right Star Ratings and Lead Capture Pane */}
                    <div className="bg-slate-50 border border-slate-200 text-slate-800 p-6 md:p-10 space-y-6 font-semibold rounded-2xl shadow-xs">
                      
                      <div className="bg-white p-5 rounded-2xl border border-red-200 text-center space-y-2 shadow-sm">
                        <span className="text-[10px] text-slate-500 uppercase font-black block font-mono">
                          InvestorJi Grade score
                        </span>
                        <div className="text-4xl font-black text-slate-900 font-display">
                          {selectedProperty.investorJiScore || '9.1'}
                          <span className="text-slate-400 text-xs font-mono font-normal"> /10</span>
                        </div>
                        <span className="text-[10px] bg-red-600 text-white px-3.5 py-1 rounded-full font-bold inline-block">
                          {getScoreRatingLabel(selectedProperty.investorJiScore || 9.1)}
                        </span>
                      </div>

                      {/* Explicit InvestorJi Star ratings */}
                      <div className="space-y-3.5 text-xs text-slate-700">
                        <strong className="text-slate-900 uppercase text-[10px] tracking-widest block font-mono">
                          Ji Score Metric Dimensions (Verified 2026)
                        </strong>

                        <div className="flex items-center justify-between">
                          <span>Location Factor</span>
                          <div className="flex text-red-650">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i < (selectedProperty.scores?.location ?? 4) ? 'fill-red-650 text-red-650' : 'text-slate-200'}`} />
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span>Builder reputation</span>
                          <div className="flex text-red-650">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i < (selectedProperty.scores?.builder ?? 4) ? 'fill-red-650 text-red-650' : 'text-slate-200'}`} />
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span>Rental Potential</span>
                          <div className="flex text-red-650">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i < (selectedProperty.scores?.rental ?? 4) ? 'fill-red-650 text-red-650' : 'text-slate-200'}`} />
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span>Future growth index</span>
                          <div className="flex text-red-650">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i < (selectedProperty.scores?.growth ?? 4) ? 'fill-red-650 text-red-650' : 'text-slate-200'}`} />
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span>Capital Liquidity</span>
                          <div className="flex text-red-650">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i < (selectedProperty.scores?.liquidity ?? 4) ? 'fill-red-650 text-red-650' : 'text-slate-200'}`} />
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Direct query form */}
                      <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 text-slate-800 shadow-sm">
                        <strong className="text-slate-900 block font-display text-xs">Request complete verified physical files</strong>
                        <form onSubmit={handleConsultSubmit} className="space-y-3 text-xs">
                          <input 
                            type="text" 
                            required
                            placeholder="Complete Human Name"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-semibold focus:border-red-500 text-slate-800 placeholder-slate-450"
                          />
                          <input 
                            type="tel" 
                            required
                            placeholder="WhatsApp Contact PIN (+91)"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-semibold focus:border-red-500 text-slate-800 placeholder-slate-450"
                          />
                          <textarea 
                            rows={3}
                            placeholder="Draft allocation query limitations..."
                            value={contactMessage}
                            onChange={(e) => setContactMessage(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-semibold resize-none focus:border-red-500 text-slate-800 placeholder-slate-450"
                          />

                          <button 
                            type="submit"
                            className="w-full bg-red-600 hover:bg-slate-900 text-white transition-all py-3.5 rounded-xl font-bold font-display cursor-pointer"
                          >
                            Assign Direct wealth compliance Advisor
                          </button>
                        </form>
                      </div>

                    </div>

                  </div>
                ) : (
                  /* regular grid catalogue fallback */
                  <div className="space-y-6">
                    <div className="bg-white border border-slate-200 p-6 rounded-2xl">
                      <h3 className="font-bold text-slate-900 font-display">HNI Direct Properties Showcase</h3>
                      <p className="text-xs text-slate-500 mt-1">Select any property to view exhaustive score assessments, RERA certificates, and direct escrow bank profiles.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {propertiesList.map(prop => (
                        <PropertyCard
                          key={prop.id}
                          property={prop}
                          onClick={() => setSelectedProperty(prop)}
                          ctaText="Launch Evaluation Audit"
                          isComparing={compareIds.includes(prop.id)}
                          onCompareToggle={() => handleCompareToggle(prop.id)}
                          isFavorited={favoritedIds.includes(prop.id)}
                          onFavoriteToggle={() => handleFavoriteToggle(prop.id)}
                          onSetPriceAlert={handleSetPriceAlert}
                          onContactBuilder={handleContactBuilder}
                        />
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB: COMMERCIAL ROUTE */}
            {activeMenu === 'commercial' && (
              <div className="space-y-8 animate-fade-in">
                <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-3xl">
                  <span className="text-xs text-[#0A2540] font-black uppercase tracking-widest font-mono block mb-1">Passives yield Sourcing</span>
                  <h2 className="text-xl md:text-2xl font-black text-slate-950 font-display tracking-tight">Grade-A Commercial Suites & Assured Return Slices</h2>
                  <p className="text-xs text-slate-500 mt-1">Filtered dynamically to show high-performing assets pre-leased to verified corporate tenants.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {propertiesList.filter(p => p.type === 'Commercial' || p.type === 'Assured Return' || p.isRetail).map(prop => (
                    <PropertyCard
                      key={prop.id}
                      property={prop}
                      onClick={() => {
                        setSelectedProperty(prop);
                        handleNavigateToTab('properties');
                      }}
                      ctaText="View Commercial Lease Spec"
                      isComparing={compareIds.includes(prop.id)}
                      onCompareToggle={() => handleCompareToggle(prop.id)}
                      isFavorited={favoritedIds.includes(prop.id)}
                      onFavoriteToggle={() => handleFavoriteToggle(prop.id)}
                      onSetPriceAlert={handleSetPriceAlert}
                      onContactBuilder={handleContactBuilder}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* TAB: PLOTS VIEW (Required Option) */}
            {activeMenu === 'plots' && (
              <div className="space-y-8 animate-fade-in">
                <div className="bg-[#0A2540] text-white p-8 md:p-10 rounded-3xl relative overflow-hidden border border-[#d92228]/30">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-[#d92228]/10 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="max-w-xl space-y-4 relative z-10">
                    <span className="bg-[#d92228] text-stone-950 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest font-mono">
                      Land-Backed freeholds
                    </span>
                    <h2 className="text-xl md:text-3xl font-black font-display tracking-tight">Freehold Plots & Plotted Townships</h2>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-semibold">
                      Explore finite land plots and gated society plots and configurations listed in Vrindavan, Mathura, and Faridabad. Absolute clean title deeds with physical possession guarantees.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {propertiesList.filter(p => p.isPlot).map(prop => (
                    <PropertyCard
                      key={prop.id}
                      property={prop}
                      onClick={() => {
                        setSelectedProperty(prop);
                        handleNavigateToTab('properties');
                      }}
                      ctaText="Request Land Mutation"
                      isComparing={compareIds.includes(prop.id)}
                      onCompareToggle={() => handleCompareToggle(prop.id)}
                      isFavorited={favoritedIds.includes(prop.id)}
                      onFavoriteToggle={() => handleFavoriteToggle(prop.id)}
                      onSetPriceAlert={handleSetPriceAlert}
                      onContactBuilder={handleContactBuilder}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* TAB: BLOGS INJECTION */}
            {activeMenu === 'blogs' && (
              <div className="animate-fade-in">
                <SeoBlogs 
                  onNotify={triggerNotification}
                  onNavigateToCalculator={() => handleNavigateToTab('calculators')}
                  onOpenConsultation={(msg) => {
                    setContactMessage(msg);
                    setShowInquireDialog(true);
                  }}
                />
              </div>
            )}

            {/* TAB: CALCULATORSSuite INJECTION */}
            {activeMenu === 'calculators' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white border p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-[#0A2540] font-bold uppercase tracking-widest font-mono block">Quantitative Evaluator Suite</span>
                    <h2 className="text-lg md:text-xl font-bold text-slate-900 font-display">Real Estate ROI, EMI & Equity SIP Comparators</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Automate cashflow algorithms based on standard 2026 tax codes.</p>
                  </div>
                  <span className="text-xs bg-[#d92228]/10 text-[#0A2540] border border-[#d92228]/45 px-3.5 py-1.5 rounded-xl font-bold font-mono">
                    ★ 2026 Fiscal Compliant
                  </span>
                </div>

                <InvestorTools 
                  properties={PROPERTIES}
                  onSelectProperty={(p) => {
                    setSelectedProperty(p);
                    handleNavigateToTab('properties');
                  }}
                />
              </div>
            )}

            {/* TAB: ABOUT VIEW */}
            {activeMenu === 'about' && (
              <div className="space-y-8 animate-fade-in">
                <div className="bg-white border border-slate-200 p-8 md:p-12 rounded-3xl space-y-6">
                  <span className="text-xs bg-[#0A2540]/5 border border-[#0A2540]/10 text-[#0A2540] px-3 py-1.5 rounded-full uppercase font-bold tracking-widest font-mono">
                    The InvestorJi Core Manifesto
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-950 font-display tracking-tight">"Where Smart Investors Begin."</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">
                    <p>
                      At InvestorJi, we strongly assert that wealth protection originates from meticulous legal clarity and direct capital allocations. Traditional physical broker visits are heavily tainted with unverified promises, leading to severe litigation defaults for consumers.
                      <br/><br/>
                      By modeling property as a quantitative trust asset, we pre-audit every listing using deep localized micro-market demand data, title mutations, and bank-secured escrows. This secures consistent double-digit IRR yields on Grade-A co-working spaces and high appreciation parameters on spiritual plots across Faridabad, Noida, Vrindavan, and Mathura.
                    </p>
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 border rounded-2xl">
                        <strong className="text-slate-900 block font-display">Divyansh Kumar</strong>
                        <span className="text-[10px] text-slate-500 font-bold block mt-0.5">Founder, Principal Director</span>
                        <p className="text-xs text-slate-400 mt-2 font-medium italic">"We are on an unwavering trajectory to democratize sovereign-level micro layouts so that every citizen secures passive monthly income under standard legal escrows."</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Future Expansion items */}
                <div className="bg-slate-900 text-slate-100 p-8 md:p-12 rounded-3xl space-y-4">
                  <h4 className="text-xs uppercase text-yellow-400 tracking-wider font-mono font-bold">Ecosystem Core Roadmap</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-semibold leading-relaxed">
                    <div>
                      <strong className="text-white block font-display">1. Property Marketplace</strong>
                      <span className="text-[#d92228] block text-[10px] mt-0.5 font-mono">Wholesale Sourcing Sockets</span>
                      Direct raw materials ledger enables developers to optimize construction timelines up to 18%, reducing project default risk parameters.
                    </div>
                    <div>
                      <strong className="text-white block font-display">2. Investment Advisory</strong>
                      <span className="text-[#d92228] block text-[10px] mt-0.5 font-mono">Expert Escrow Managers</span>
                      Bespoke portfolio planning mapped to Section 54 allowing HNIs and NRIs to completely clean long-term capital tax slips.
                    </div>
                    <div>
                      <strong className="text-white block font-display">3. YouTube Channel & Academy</strong>
                      <span className="text-[#d92228] block text-[10px] mt-0.5 font-mono">Research Broadcasts</span>
                      Empowering retail investors with deep legal guides, drone walk catalogs, and live heatmaps.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CONTACT VIEW */}
            {activeMenu === 'contact' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 space-y-8 animate-fade-in">
                <div className="space-y-2">
                  <span className="text-xs text-[#0A2540] font-black uppercase tracking-widest font-mono block">Direct Helpline Nodes</span>
                  <h2 className="text-xl md:text-3xl font-black text-slate-950 font-display">Book Sourcing Slot with Chief Advisor Desk</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                  
                  {/* Lead capture form */}
                  <div className="lg:col-span-3 bg-slate-50 border p-6 rounded-2xl space-y-5">
                    <strong className="text-xs uppercase font-extrabold text-slate-500 font-mono tracking-widest block">Executive Consultation Request</strong>
                    
                    <form onSubmit={handleConsultSubmit} className="space-y-4 text-slate-900 text-xs font-semibold">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-600 mb-1.5">First/Last Human Name</label>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. Adv. Rohit Sheth"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            className="w-full bg-white text-stone-900 border border-slate-250 p-2.5 rounded-xl outline-none focus:border-[#d92228]"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 mb-1.5">WhatsApp Mobile PIN</label>
                          <input 
                            type="tel" 
                            required
                            placeholder="e.g. +91 99991-xxxxx"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            className="w-full bg-white text-stone-900 border border-slate-250 p-2.5 rounded-xl outline-none focus:border-[#d92228]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-600 mb-1.5 font-mono">Primary Email Address</label>
                        <input 
                          type="email" 
                          placeholder="e.g. client@privatewealth.com"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="w-full bg-white text-stone-900 border border-slate-250 p-2.5 rounded-xl outline-none focus:border-[#d92228]"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 mb-1.5">Draft special allocation limitations</label>
                        <textarea 
                          rows={4}
                          placeholder="Please address target micro-meters or tax optimization questions..."
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          className="w-full bg-white text-stone-900 border border-slate-250 p-2.5 rounded-xl outline-none focus:border-[#d92228] resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#0A2540] hover:bg-[#d92228] hover:text-stone-950 text-white transition-colors py-3 rounded-xl font-bold font-display shadow-md cursor-pointer"
                      >
                        Reserve Direct Callback Slot
                      </button>
                    </form>
                  </div>

                  {/* Info segments */}
                  <div className="lg:col-span-2 space-y-6 text-xs font-semibold leading-relaxed">
                    <div className="bg-[#0A2540] text-slate-200 p-5 rounded-2xl border border-[#d92228]/30 space-y-4">
                      <strong className="text-[#d92228] uppercase text-[10px] tracking-widest block font-mono">Headquarters Location</strong>
                      <p className="text-[11px] leading-relaxed">
                        InvestorJi Technologies Private Limited<br/>
                        Faridabad sector 3,<br/>
                        Haryana, India.
                      </p>
                      <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs font-bold font-mono">
                        <a href="tel:+918168105240" className="text-yellow-400 block hover:underline">📞 +91-8168105240 (NRI Core Line)</a>
                        <a href="mailto:wealth@investorji.com" className="text-slate-300 block hover:underline">✉️ wealth@investorji.com</a>
                      </div>
                    </div>

                    <div className="p-4 bg-white border rounded-2xl text-[10px] leading-normal space-y-2 text-slate-450 border-amber-250">
                      🔒 <strong>Direct Sourcing Safeguard:</strong> Sourcing through our certified SPV desks completely eliminates broker manipulation and secures developer direct allocation quotas.
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* INTEGRATION VIEW: FURNITURE & BUILDING MATERIALS MARKETPLACE */}
            {activeMenu === 'marketplace' && (
              <div className="animate-fade-in">
                <Marketplace onNotify={triggerNotification} />
              </div>
            )}

            {/* INTEGRATION VIEW: AGENCY LEADS LOCKBOARD */}
            {activeMenu === 'leads' && (
              <div className="animate-fade-in">
                <AgentLeads onNotify={triggerNotification} />
              </div>
            )}

            {/* TAB: INVESTOR PORTFOLIO VIEW */}
            {activeMenu === 'portfolio' && (
              <div className="animate-fade-in">
                <InvestorPortfolio 
                  properties={propertiesList}
                  favoritedIds={favoritedIds}
                  compareIds={compareIds}
                  onToggleFavorite={handleFavoriteToggle}
                  onToggleCompare={handleCompareToggle}
                  onSelectProperty={(p) => {
                    setSelectedProperty(p);
                    handleNavigateToTab('properties');
                  }}
                  onNavigateToTab={handleNavigateToTab}
                  priceAlerts={priceAlerts}
                  onRemoveAlert={handleRemovePriceAlert}
                  isSubscribedToWeekly={isSubscribedToWeekly}
                  subscribedEmail={subscribedEmail}
                  onToggleWeeklySubscription={handleToggleWeeklySubscription}
                  onNotify={triggerNotification}
                />
              </div>
            )}

            {/* TAB: ADMIN PANEL VIEW */}
            {activeMenu === 'admin' && (
              <div className="animate-fade-in space-y-6">
                {!isAdminLoggedIn ? (
                  <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-650 via-amber-500 to-red-650"></div>
                    <div className="mx-auto w-16 h-16 bg-red-950/40 text-red-400 rounded-full flex items-center justify-center border border-red-900/30 animate-pulse">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-black font-display text-white">Administrator Access Required</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        This section contains confidential investor listings, RERA compliance controls, and private buyer leads. Please authenticate to continue.
                      </p>
                    </div>

                    <div className="bg-red-955/25 border border-red-900/40 p-4 rounded-2xl text-left text-xs leading-relaxed text-slate-300 space-y-1">
                      <div className="text-red-400 font-bold flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-amber-500" />
                        <span>Authorized Admin Credentials:</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Use the secure login info below or click the one-click developer login below.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[10px]">
                        <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                          <span className="text-slate-500 block text-[9px] uppercase font-bold">Email</span>
                          <span className="text-slate-200 select-all font-bold">mtlentertainmentindia@gmail.com</span>
                        </div>
                        <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                          <span className="text-slate-500 block text-[9px] uppercase font-bold">Password</span>
                          <span className="text-slate-200 select-all font-bold">Kaka@12345</span>
                        </div>
                      </div>
                    </div>

                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        const isAuthorizedEmail = adminEmail.trim().toLowerCase() === 'mtlentertainmentindia@gmail.com';
                        const isCorrectPassword = adminPassword === 'Kaka@12345';
                        
                        if (isAuthorizedEmail && isCorrectPassword) {
                          setIsAdminLoggedIn(true);
                          triggerNotification("Admin authentication successful! Access granted.", "success");
                        } else if (!isAuthorizedEmail) {
                          triggerNotification("Access Denied. Only mtlentertainmentindia@gmail.com is authorized to view this admin panel.", "error");
                        } else {
                          triggerNotification("Invalid master password. Please try again.", "error");
                        }
                      }}
                      className="space-y-4 text-left text-xs text-slate-300 font-semibold"
                    >
                      <div>
                        <label className="block text-slate-405 mb-1.5 font-mono">Administrative Gmail Address</label>
                        <input 
                          type="email" 
                          required
                          placeholder="e.g. admin@privatewealth.com"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-red-650 text-xs font-semibold text-white placeholder-slate-650"
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-slate-405 mb-1.5 font-mono">Secret Master PIN / Password</label>
                        <input 
                          type="password" 
                          required
                          placeholder="••••••••"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-red-650 text-xs font-semibold text-white placeholder-slate-650"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                        />
                        <span className="text-[10px] text-slate-500 font-normal block mt-1">Please enter your secret administrative master password to log in.</span>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-red-650 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white font-bold p-3 rounded-xl cursor-pointer transition-all shadow-md hover:shadow-lg"
                      >
                        Authenticate Credentials &rarr;
                      </button>
                    </form>

                    <div className="border-t border-slate-800/65 pt-4 text-xs">
                      <p className="text-slate-550 mb-2">Are you the authorized developer or system owner?</p>
                      <button
                        onClick={() => {
                          setAdminEmail('mtlentertainmentindia@gmail.com');
                          setIsAdminLoggedIn(true);
                          triggerNotification("Logged in seamlessly as mtlentertainmentindia@gmail.com!", "success");
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-950/30 text-red-400 hover:bg-red-900/40 border border-red-900/40 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer"
                      >
                        ⚡ One-Click Login as Owner (mtlentertainmentindia@gmail.com)
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-slate-900/50 border border-slate-800/80 px-6 py-3 rounded-2xl">
                      <div className="flex items-center gap-2.5 text-xs text-slate-300">
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span>Authenticated as: <strong className="text-white font-mono">{adminEmail || 'mtlentertainmentindia@gmail.com'}</strong></span>
                      </div>
                      <button
                        onClick={() => {
                          setIsAdminLoggedIn(false);
                          setAdminEmail('');
                          triggerNotification("Admin session terminated securely.", "success");
                        }}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                      >
                        Logout Session 🔒
                      </button>
                    </div>

                    <AdminPanel 
                      properties={propertiesList}
                      onAddProperty={handleAddProperty}
                      onUpdateProperty={handleUpdateProperty}
                      onDeleteProperty={handleDeleteProperty}
                      leads={leadsList}
                      onUpdateLead={handleUpdateLead}
                      priceAlerts={priceAlerts}
                      onNotify={triggerNotification}
                    />
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </main>

      {/* WHATSAPP CONCIERGE FLOAT DESK */}
      <div className="fixed bottom-5 left-5 z-40 inline-flex flex-col gap-2">
        <a 
          href="https://wa.me/918168105240?text=Hello%20InvestorJi!%20I%20am%20interested%20in%20high-yield%20real%20estate%2520investments%20in%20India."
          target="_blank"
          rel="noreferrer"
          className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 sm:px-4 sm:py-3 rounded-full sm:rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold transition-transform hover:scale-105"
        >
          <MessageSquare className="w-5 h-5 fill-white" />
          <span className="hidden sm:inline">WhatsApp Concierge Advisor</span>
        </a>
      </div>

      {/* 5. GORGEOUS BRAND FOOTER SECTION */}
      <footer className="bg-slate-950 text-white mt-16 border-t border-[#d92228]/30">
        <div className="h-1.5 bg-gradient-to-r from-[#0E1224] via-[#d92228] to-[#0E1224]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 border border-[#d92228]/40 flex items-center justify-center rounded">
                <Building className="text-[#d92228] w-5 h-5" />
              </div>
              <span className="text-lg font-black font-display text-white">InvestorJi.com</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              InvestorJi is India’s foremost secure micro-trust real estate procurement & investment technology platform. Engineered to maximize post-tax IRR via RERA certified structural channels.
            </p>
            <p className="text-[10px] text-slate-500 font-bold font-mono">
              © 2026 InvestorJi. All rights reserved. Registered under Maharera, HRERA, KA RERA statutory structures.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase font-extrabold text-[#d92228] tracking-wider mb-4 font-mono">Sourcing Landing Pages</h4>
            <ul className="space-y-2 text-[11px] text-slate-300 font-bold font-display">
              <li><button onClick={() => handleNavigateToSeoPage('/commercial-property-india')} className="hover:text-white hover:underline transition-all">🏢 Commercial Properties</button></li>
              <li><button onClick={() => handleNavigateToSeoPage('/residential-property-india')} className="hover:text-white hover:underline transition-all">🏠 Residential Homes</button></li>
              <li><button onClick={() => handleNavigateToSeoPage('/plots-for-sale-india')} className="hover:text-white hover:underline transition-all">🌳 Plots & Land</button></li>
              <li><button onClick={() => handleNavigateToSeoPage('/investment-property-india')} className="hover:text-white hover:underline transition-all">💰 Investment Sourcing</button></li>
              <li><button onClick={() => handleNavigateToSeoPage('/rental-income-properties')} className="hover:text-white hover:underline transition-all">💸 High Rental Yields</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase font-extrabold text-red-400 tracking-wider mb-4 font-mono">Major City Handbooks</h4>
            <ul className="space-y-2 text-[11px] text-slate-300 font-bold">
              <li><button onClick={() => handleNavigateToSeoPage('/property-in-vrindavan')} className="hover:text-white hover:underline text-left">Property in Vrindavan</button></li>
              <li><button onClick={() => handleNavigateToSeoPage('/property-in-gurgaon')} className="hover:text-white hover:underline text-left">Property in Gurgaon</button></li>
              <li><button onClick={() => handleNavigateToSeoPage('/property-in-noida')} className="hover:text-white hover:underline text-left">Property in Noida</button></li>
              <li><button onClick={() => handleNavigateToSeoPage('/property-in-delhi')} className="hover:text-white hover:underline text-left">Property in Delhi NCR</button></li>
              <li><button onClick={() => handleNavigateToSeoPage('/property-in-faridabad')} className="hover:text-white hover:underline text-left">Property in Faridabad</button></li>
              <li><button onClick={() => handleNavigateToSeoPage('/property-in-mathura')} className="hover:text-white hover:underline text-left">Property in Mathura</button></li>
            </ul>
          </div>

          <div className="space-y-4 text-xs font-semibold leading-relaxed">
            <h4 className="text-xs uppercase font-extrabold text-red-400 tracking-wider mb-1 font-mono">Helpline Contact</h4>
            <div className="text-[10px] text-slate-400">
              Registered HQ: Faridabad sector 3, Haryana, India.
            </div>
            <div className="space-y-1.5 text-xs font-bold font-mono">
              <a href="tel:+918168105240" className="text-red-500 block hover:underline">📞 +91-8168105240 (NRI Sourcing Desk)</a>
              <a href="mailto:wealth@investorji.com" className="text-slate-300 block hover:underline">✉️ wealth@investorji.com</a>
            </div>
          </div>

        </div>

        {/* 6. ETHICAL BRAND POSITIONING & SUMMARY AT FOOTER BASE */}
        <div className="bg-[#090D1A] border-t border-slate-800 p-6 text-slate-400 text-[11px] leading-relaxed">
          <div className="max-w-7xl mx-auto space-y-3 font-semibold">
            <h4 className="text-slate-200 font-display text-xs font-extrabold uppercase tracking-wider">
              InvestorJi — India's Trusted Investment Partner
            </h4>
            <p>
              Disclaimer: Sourcing real estate entails structural and financial capital factors. All calculations, ROI projections, or index compares simulated on our calculators or parsed on blogs are for educational research guidelines only. Real estate acquisition is completed through registered escrow bank accounts in direct compliance with MahaRERA, HRERA & UP RERA rules.
            </p>
          </div>
        </div>

      </footer>

      {/* 4.5 FLOATING COMPARISON OVERLAY BOARD */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40 bg-[#0f1524]/95 backdrop-blur-md border border-[#D4AF37]/45 p-4 rounded-2xl shadow-2xl shadow-black max-w-sm w-full space-y-3 animate-slide-up font-sans">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs font-bold text-slate-100">Comparative Sourcing Pool</span>
            </div>
            <span className="text-[10px] text-red-400 font-bold bg-red-955/40 px-2 py-0.5 rounded-full">
              {compareIds.length} / 3 selected
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {compareIds.map(id => {
              const prop = propertiesList.find(p => p.id === id);
              if (!prop) return null;
              return (
                <div key={id} className="relative group rounded-lg overflow-hidden border border-slate-800 bg-slate-950 h-16">
                  <img src={prop.image} alt={prop.title} className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                  <button 
                    onClick={() => handleCompareToggle(id)}
                    className="absolute top-1 right-1 bg-red-955/95 text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] hover:bg-red-650 transition-colors cursor-pointer animate-pulse"
                  >
                    ×
                  </button>
                  <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 p-1 text-[8px] truncate font-semibold text-slate-200">
                    {prop.title}
                  </div>
                </div>
              );
            })}
            
            {compareIds.length < 3 && (
              <div className="border border-dashed border-slate-800 rounded-lg flex items-center justify-center text-[10px] text-slate-500 h-16 bg-slate-950/20">
                + Select {3 - compareIds.length} more
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                if (compareIds.length < 2) {
                  triggerNotification("Please select at least 2 properties to perform a side-by-side comparative analysis.", "error");
                  return;
                }
                setShowCompareDialog(true);
              }}
              className="flex-1 text-[11px] bg-red-650 hover:bg-[#b0171d] text-white py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-red-950/30 font-display"
            >
              <GitCompare className="w-3.5 h-3.5" />
              Examine Analytics
            </button>
            <button
              onClick={() => setCompareIds([])}
              className="text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 px-3 py-2 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* 5. SIDE-BY-SIDE PROPERTY COMPARISON ANALYTICS MODAL */}
      {showCompareDialog && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in overflow-y-auto">
          <div className="bg-[#0f1524] rounded-3xl w-full max-w-5xl border border-[#D4AF37]/30 overflow-hidden shadow-2xl flex flex-col justify-between max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-[#131b2e] p-6 text-slate-100 flex justify-between items-center border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-red-955/45 border border-red-900/40 text-red-400">
                  <Scale className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#D4AF37] font-mono tracking-widest block">Elite investment verification console</span>
                  <h3 className="font-extrabold font-display text-sm sm:text-base text-white">Side-by-Side Sourcing Intelligence Matrix</h3>
                </div>
              </div>
              <button 
                onClick={() => setShowCompareDialog(false)}
                className="text-slate-405 hover:text-white font-extrabold text-2xl cursor-pointer p-1 transition-all"
              >
                ×
              </button>
            </div>

            {/* Modal Scrollable Table Section */}
            <div className="p-6 overflow-auto font-sans text-xs">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-800/80">
                    <th className="py-4 px-3 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider w-[220px]">Asset Dimension</th>
                    {compareIds.map(id => {
                      const prop = propertiesList.find(p => p.id === id);
                      if (!prop) return null;
                      return (
                        <th key={id} className="py-4 px-4 w-[240px]">
                          <div className="space-y-2">
                            <div className="h-24 rounded-lg overflow-hidden border border-slate-850">
                              <img src={prop.image} alt={prop.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <h4 className="font-bold text-slate-100 font-display line-clamp-1">{prop.title}</h4>
                            <span className="text-[9px] uppercase font-mono font-bold text-[#D4AF37] bg-amber-955/30 border border-amber-900/40 px-2 py-0.5 rounded-md inline-block">
                              InvestorJi Score: {prop.investorJiScore || '9.0'}
                            </span>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr className="hover:bg-slate-900/30">
                    <td className="py-3 px-3 font-semibold text-slate-100">Tagline Overview</td>
                    {compareIds.map(id => {
                      const prop = propertiesList.find(p => p.id === id);
                      return <td key={id} className="py-3 px-4 font-semibold text-[11px] text-[#D4AF37] italic">{prop?.tagline}</td>;
                    })}
                  </tr>
                  <tr className="hover:bg-slate-900/30">
                    <td className="py-3 px-3 font-semibold text-slate-100">Category & Alignment</td>
                    {compareIds.map(id => {
                      const prop = propertiesList.find(p => p.id === id);
                      return <td key={id} className="py-3 px-4 font-bold">{prop?.type}</td>;
                    })}
                  </tr>
                  <tr className="hover:bg-slate-900/30">
                    <td className="py-3 px-3 font-semibold text-slate-100">Location Market</td>
                    {compareIds.map(id => {
                      const prop = propertiesList.find(p => p.id === id);
                      return <td key={id} className="py-3 px-4"><span className="text-slate-200">{prop?.location}</span>, {prop?.city}</td>;
                    })}
                  </tr>
                  <tr className="hover:bg-slate-900/30">
                    <td className="py-3 px-3 font-semibold text-slate-100">Developer/Builder</td>
                    {compareIds.map(id => {
                      const prop = propertiesList.find(p => p.id === id);
                      return <td key={id} className="py-3 px-4 font-semibold text-slate-200">{prop?.developer}</td>;
                    })}
                  </tr>
                  <tr className="hover:bg-slate-900/30 bg-[#131b2e]/10">
                    <td className="py-3.5 px-3 font-bold text-slate-100">Minimum Investment Ticket</td>
                    {compareIds.map(id => {
                      const prop = propertiesList.find(p => p.id === id);
                      return <td key={id} className="py-3.5 px-4 font-extrabold text-sm text-[#d92228]">₹ {prop?.minInvestment} Lakhs+</td>;
                    })}
                  </tr>
                  <tr className="hover:bg-slate-900/30">
                    <td className="py-3 px-3 font-semibold text-slate-100">Projected ROI</td>
                    {compareIds.map(id => {
                      const prop = propertiesList.find(p => p.id === id);
                      return <td key={id} className="py-3 px-4 text-emerald-400 font-extrabold font-mono text-xs">{prop?.projectedROI}% YOY</td>;
                    })}
                  </tr>
                  <tr className="hover:bg-slate-900/30">
                    <td className="py-3 px-3 font-semibold text-slate-100">Net Lease Yield</td>
                    {compareIds.map(id => {
                      const prop = propertiesList.find(p => p.id === id);
                      return <td key={id} className="py-3 px-4 text-amber-500 font-extrabold font-mono text-xs">{prop?.rentalYield ?? '6.0'}% Net Yld</td>;
                    })}
                  </tr>
                  <tr className="hover:bg-slate-900/30">
                    <td className="py-3 px-3 font-semibold text-slate-100">RERA Compliance Identity</td>
                    {compareIds.map(id => {
                      const prop = propertiesList.find(p => p.id === id);
                      return <td key={id} className="py-3 px-4 font-mono font-bold text-[9px] text-slate-400">{prop?.reraId}</td>;
                    })}
                  </tr>
                  <tr className="hover:bg-slate-900/30">
                    <td className="py-4 px-3 font-semibold text-slate-100">Sourced Amenities</td>
                    {compareIds.map(id => {
                      const prop = propertiesList.find(p => p.id === id);
                      return (
                        <td key={id} className="py-4 px-4">
                          <div className="flex flex-wrap gap-1">
                            {prop?.amenities.slice(0, 4).map(am => (
                              <span key={am} className="text-[8px] bg-slate-900 px-2 py-0.5 rounded text-slate-300 border border-slate-800">{am}</span>
                            ))}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="hover:bg-slate-900/30">
                    <td className="py-4 px-3 font-semibold text-slate-100">Payment Installment Slices</td>
                    {compareIds.map(id => {
                      const prop = propertiesList.find(p => p.id === id);
                      return (
                        <td key={id} className="py-4 px-4 text-[10px] leading-relaxed font-semibold">
                          <div className="text-[8px] uppercase text-slate-500">Booking Amount</div>
                          <div className="text-slate-200">{prop?.paymentPlan?.bookingAmount}</div>
                          <div className="text-[8px] uppercase text-slate-500 mt-1">First Milestone</div>
                          <div className="text-slate-300">{prop?.paymentPlan?.stage1}</div>
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="hover:bg-slate-900/30">
                    <td className="py-3 px-3 font-semibold text-slate-100">Year of Possession</td>
                    {compareIds.map(id => {
                      const prop = propertiesList.find(p => p.id === id);
                      return <td key={id} className="py-3 px-4 font-mono font-bold text-slate-100">{prop?.completionYear || 2027}</td>;
                    })}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Modal Footer / Call-To-Action */}
            <div className="bg-[#131b2e] p-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 font-sans">
              <div className="text-[11px] text-slate-400 font-semibold max-w-md">
                💡 Sourcing audits compare core financial vectors and balance sheet risk matrices to prevent capital lockups. Talk to our compliance officer to proceed.
              </div>
              <div className="flex gap-2 font-display">
                <button
                  onClick={() => {
                    setShowCompareDialog(false);
                    setContactMessage(`Hi, I would like to allocate resources and schedule an exhaustive technical evaluation comparing properties: ${compareIds.map(id => propertiesList.find(p => p.id === id)?.title).join(', ')}.`);
                    setShowInquireDialog(true);
                  }}
                  className="bg-red-650 hover:bg-[#b0171d] text-white px-5 py-2.5 rounded-xl font-bold text-xs cursor-pointer shadow-md transition-all flex items-center gap-1.5"
                >
                  Confirm Sourcing Consultation
                </button>
                <button
                  onClick={() => setShowCompareDialog(false)}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-5 py-2.5 rounded-xl text-xs font-bold border border-slate-800 cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* QUICK INQUIRE OVERLAY DIALOG */}
      {showInquireDialog && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#0f1524] rounded-3xl w-full max-w-md border border-slate-800 overflow-hidden shadow-2xl text-slate-100 font-semibold">
            
            <div className="bg-[#131b2e] p-5 text-slate-100 flex justify-between items-center border-b border-slate-805">
              <div>
                <span className="text-[9px] uppercase font-mono font-bold text-[#D4AF37] tracking-widest block font-sans">Exclusive HNI Portfolio Circle</span>
                <h3 className="font-extrabold font-display text-sm text-white">Register Direct Sourcing Allocation</h3>
              </div>
              <button 
                onClick={() => setShowInquireDialog(false)}
                className="text-slate-405 hover:text-white font-bold text-xl cursor-pointer transition-all animate-pulse"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleConsultSubmit} className="p-6 space-y-4 text-xs font-bold font-sans">
              <div>
                <label className="block text-slate-400 mb-1">Human Name / Corporate Sourcing Entity</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Adv. Rohit Sheth"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 border border-slate-805 p-2.5 rounded-xl outline-none focus:border-[#D4AF37] placeholder-slate-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">WhatsApp Mobile PIN (+91)</label>
                <input 
                  type="tel" 
                  required
                  placeholder="e.g. +91 99991-xxxxx"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 border border-slate-805 p-2.5 rounded-xl outline-none focus:border-[#D4AF37] placeholder-slate-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Draft special allocation parameters</label>
                <textarea 
                  rows={3}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 border border-slate-805 p-2.5 rounded-xl outline-none focus:border-[#D4AF37] resize-none placeholder-slate-600 transition-colors"
                />
              </div>

              <div className="bg-rose-950/20 text-red-400 text-[10px] p-2.5 rounded-xl border border-red-955/30 leading-normal font-medium flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-450 shrink-0" />
                <span>Your sourcing data sits fully encrypted and is accessed exclusively by accredited registered wealth officers.</span>
              </div>

              <button
                type="submit"
                className="w-full bg-red-650 hover:bg-red-700 transition-colors text-white py-3 rounded-xl font-bold font-display shadow-md cursor-pointer"
              >
                Onboard Sourcing Profile
              </button>
            </form>

          </div>
        </div>
      )}

      {/* PERSISTENT REAL-TIME AI CHATBOT CO-PILOT */}
      <InvestorChatbot 
        properties={propertiesList}
        favoritedIds={favoritedIds}
        compareIds={compareIds}
        onNotify={triggerNotification}
        onOpenConsultation={(msg) => {
          setContactMessage(msg);
          setShowInquireDialog(true);
        }}
      />

    </div>
  );
}
