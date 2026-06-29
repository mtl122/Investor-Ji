import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  ShieldCheck, 
  Phone, 
  MessageSquare, 
  Wallet, 
  Key, 
  Filter, 
  Search, 
  Mail, 
  Copy, 
  X, 
  ExternalLink, 
  Calendar, 
  CheckCircle2, 
  Lock, 
  UserPlus, 
  LogOut, 
  ArrowRight, 
  Building2, 
  QrCode, 
  RefreshCw, 
  Check, 
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { Lead, Broker, PaymentRequest } from '../types';

interface AgentLeadsProps {
  leads: Lead[];
  onUpdateLead: (id: string, updatedFields: Partial<Lead>) => void;
  onNotify: (message: string, type: 'success' | 'error') => void;
  onNavigateToTab?: (tab: 'home' | 'investments' | 'properties' | 'commercial' | 'plots' | 'blogs' | 'calculators' | 'about' | 'contact' | 'marketplace' | 'leads' | 'portfolio' | 'admin') => void;
  onLoginAsAdmin?: () => void;
}

const DEFAULT_BROKERS: Broker[] = [
  {
    id: 'broker-demo',
    name: 'Elite Wealth Associate',
    email: 'broker@investorji.com',
    phone: '8168105240',
    agencyName: 'DLF Elite Properties',
    password: 'password',
    walletBalance: 3500,
    unlockedLeads: []
  }
];

export function AgentLeads({ 
  leads, 
  onUpdateLead, 
  onNotify,
  onNavigateToTab,
  onLoginAsAdmin
}: AgentLeadsProps) {
  // --- AUTHENTICATION & DATABASE STATES ---
  const [brokersDb, setBrokersDb] = useState<Broker[]>(() => {
    const saved = localStorage.getItem('brokers_database');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_BROKERS;
      }
    }
    return DEFAULT_BROKERS;
  });

  const [currentBroker, setCurrentBroker] = useState<Broker | null>(() => {
    const saved = localStorage.getItem('current_broker');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup Form States
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupAgency, setSignupAgency] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  // --- LEADS BOARD STATES ---
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDetailedLead, setSelectedDetailedLead] = useState<Lead | null>(null);

  // --- PAYMENT / WALLET TOP-UP STATES ---
  const [showAddFunds, setShowAddFunds] = useState<boolean>(false);
  const [amountToAdd, setAmountToAdd] = useState<number>(2500);
  const [customAmountInput, setCustomAmountInput] = useState<string>('');
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [isVerifyingPayment, setIsVerifyingPayment] = useState<boolean>(false);
  const [verificationStep, setVerificationStep] = useState<'idle' | 'connecting' | 'scanning' | 'utr_match' | 'success'>('idle');
  const [paymentError, setPaymentError] = useState<string>('');

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

  // Save databases and active broker session to localStorage
  useEffect(() => {
    localStorage.setItem('brokers_database', JSON.stringify(brokersDb));
  }, [brokersDb]);

  useEffect(() => {
    localStorage.setItem('payment_requests_database', JSON.stringify(paymentRequests));
  }, [paymentRequests]);

  useEffect(() => {
    if (currentBroker) {
      localStorage.setItem('current_broker', JSON.stringify(currentBroker));
      // Sync wallet balance to the legacy key for backward compatibility
      localStorage.setItem('agent_wallet_balance', currentBroker.walletBalance.toString());
      
      // Update this broker's record in the main brokers database only if actually different
      setBrokersDb(prevDb => {
        const existing = prevDb.find(b => b.id === currentBroker.id);
        if (existing && 
            existing.walletBalance === currentBroker.walletBalance && 
            JSON.stringify(existing.unlockedLeads) === JSON.stringify(currentBroker.unlockedLeads)) {
          return prevDb;
        }
        return prevDb.map(b => b.id === currentBroker.id ? currentBroker : b);
      });
    } else {
      localStorage.removeItem('current_broker');
    }
  }, [currentBroker]);

  // Sync state when storage changes across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'brokers_database' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setBrokersDb(parsed);
          if (currentBroker) {
            const updated = parsed.find((b: Broker) => b.id === currentBroker.id);
            if (updated && updated.walletBalance !== currentBroker.walletBalance) {
              setCurrentBroker(updated);
            }
          }
        } catch (err) {}
      }
      if (e.key === 'payment_requests_database' && e.newValue) {
        try {
          setPaymentRequests(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentBroker]);

  // Reload latest values whenever mounting or when modal opens
  const reloadFromLocalStorage = () => {
    const savedBrokers = localStorage.getItem('brokers_database');
    const savedRequests = localStorage.getItem('payment_requests_database');
    if (savedBrokers) {
      try {
        const parsed = JSON.parse(savedBrokers);
        setBrokersDb(parsed);
        if (currentBroker) {
          const updated = parsed.find((b: Broker) => b.id === currentBroker.id);
          if (updated) {
            setCurrentBroker(updated);
          }
        }
      } catch (e) {}
    }
    if (savedRequests) {
      try {
        setPaymentRequests(JSON.parse(savedRequests));
      } catch (e) {}
    }
  };

  useEffect(() => {
    reloadFromLocalStorage();
  }, [showAddFunds]);

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    onNotify(`${label} copied to clipboard!`, 'success');
  };

  // --- AUTH HANDLERS ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      onNotify('Please fill in all fields to log in.', 'error');
      return;
    }

    const broker = brokersDb.find(
      b => b.email.toLowerCase() === loginEmail.toLowerCase() && b.password === loginPassword
    );

    if (broker) {
      setCurrentBroker(broker);
      onNotify(`Welcome back, ${broker.name}! Successfully connected to Broker CRM Desk.`, 'success');
      // Clear forms
      setLoginEmail('');
      setLoginPassword('');
    } else {
      onNotify('Invalid broker email or password. Please try again.', 'error');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPhone || !signupPassword) {
      onNotify('Please fill in all required fields.', 'error');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      onNotify('Passwords do not match. Please recheck.', 'error');
      return;
    }

    // Check if email already registered
    const exists = brokersDb.some(b => b.email.toLowerCase() === signupEmail.toLowerCase());
    if (exists) {
      onNotify('An account with this email already exists. Please log in.', 'error');
      return;
    }

    const newBroker: Broker = {
      id: `broker-${Date.now()}`,
      name: signupName,
      email: signupEmail,
      phone: signupPhone,
      agencyName: signupAgency || 'Independent Wealth Consultant',
      password: signupPassword,
      walletBalance: 1500, // Welcome bonus starter credit
      unlockedLeads: []
    };

    setBrokersDb(prev => [...prev, newBroker]);
    setCurrentBroker(newBroker);
    onNotify(`Congratulations, ${signupName}! Your Broker CRM account is created with a welcome credit of ₹1,500.`, 'success');

    // Clear form
    setSignupName('');
    setSignupEmail('');
    setSignupPhone('');
    setSignupAgency('');
    setSignupPassword('');
    setSignupConfirmPassword('');
  };

  const handleLogout = () => {
    setCurrentBroker(null);
    localStorage.removeItem('current_broker');
    onNotify('Successfully logged out of the Broker CRM.', 'success');
  };

  // --- LEAD PURCHASE SYSTEM ---
  const purchaseLead = (leadId: string) => {
    if (!currentBroker) {
      onNotify('Please register or log in as a Broker to unlock leads.', 'error');
      return;
    }

    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    const isAlreadyUnlocked = currentBroker.unlockedLeads.includes(leadId);
    if (isAlreadyUnlocked) {
      onNotify('You have already unlocked this high-intent lead!', 'error');
      return;
    }

    if (currentBroker.walletBalance < lead.price) {
      onNotify(`Insufficient balance (₹${currentBroker.walletBalance}). Please top up your wallet to unlock this premium lead.`, 'error');
      setShowAddFunds(true);
      return;
    }

    // Process Purchase
    const updatedBroker: Broker = {
      ...currentBroker,
      walletBalance: currentBroker.walletBalance - lead.price,
      unlockedLeads: [...currentBroker.unlockedLeads, leadId]
    };

    setCurrentBroker(updatedBroker);
    
    // Call parents lead list updater if needed (though we render dynamically per broker)
    onUpdateLead(leadId, { isPurchased: true });
    onNotify(`Success! Target contact unlocked for ${lead.buyerName}. ₹${lead.price} deducted from your wallet.`, 'success');
  };

  // --- AUTO-FETCH PAYMENT SIMULATOR ---
  const handleVerifyPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber || utrNumber.trim().length < 8) {
      setPaymentError('Please enter a valid UPI Transaction UTR Number (minimum 8-12 digits).');
      return;
    }
    setPaymentError('');
    setIsVerifyingPayment(true);
    setVerificationStep('connecting');

    // Step-by-step automatic verification flow simulation
    setTimeout(() => {
      setVerificationStep('scanning');
      setTimeout(() => {
        setVerificationStep('utr_match');
        setTimeout(() => {
          if (!currentBroker) return;
          
          // Generate a payment request
          const newRequest: PaymentRequest = {
            id: 'pay-' + Date.now(),
            brokerId: currentBroker.id,
            brokerName: currentBroker.name,
            brokerEmail: currentBroker.email,
            amount: amountToAdd,
            utrNumber: utrNumber.trim(),
            status: 'pending',
            dateRequested: new Date().toLocaleString('en-IN')
          };

          // Save to local state and synchronize
          const updatedRequests = [newRequest, ...paymentRequests];
          setPaymentRequests(updatedRequests);
          localStorage.setItem('payment_requests_database', JSON.stringify(updatedRequests));

          setVerificationStep('success');
          setIsVerifyingPayment(false);
          
          onNotify(`UPI Deposit Request Received! Your Transaction ID / UTR No. is now pending manual verification by the Administrator.`, 'success');
          
          // Reset transaction states
          setTimeout(() => {
            setShowAddFunds(false);
            setUtrNumber('');
            setVerificationStep('idle');
          }, 4500);

        }, 1500); // match step
      }, 1500); // scan step
    }, 1200); // connect step
  };

  // Handle preset buttons vs custom text
  const handleSelectAmount = (amt: number) => {
    setAmountToAdd(amt);
    setCustomAmountInput('');
  };

  const handleCustomAmountChange = (val: string) => {
    setCustomAmountInput(val);
    const num = Number(val);
    if (!isNaN(num) && num > 0) {
      setAmountToAdd(num);
    }
  };

  // Filter leads according to dashboard criteria
  const filteredLeads = leads.filter(lead => {
    const matchesCity = selectedCity === 'All' || lead.city.toLowerCase().includes(selectedCity.toLowerCase()) || (selectedCity === 'NRI' && lead.city.includes('NRI'));
    const matchesSearch = lead.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lead.propertyType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lead.targetLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  // Dynamic leads list mapped to check if unlocked by *this specific logged-in broker*
  const finalLeads = filteredLeads.map(lead => ({
    ...lead,
    isPurchased: currentBroker ? currentBroker.unlockedLeads.includes(lead.id) : false
  }));

  // --- RENDER 1: AUTHENTICATION CONTAINER (IF NOT LOGGED IN) ---
  if (!currentBroker) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Banner Column */}
          <div className="md:col-span-5 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-red-950 p-8 text-white flex flex-col justify-between relative min-h-[350px] md:min-h-[500px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.15),transparent_60%)] pointer-events-none"></div>
            
            <div className="space-y-4">
              <span className="text-[10px] bg-red-600/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider inline-block">
                🔐 RERA Verified Leads
              </span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-none text-white">
                InvestorJi <span className="text-red-500 font-normal">Broker CRM</span>
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect with active, double-OTP verified Indian HNIs & NRI property buyers who have calculated ROI estimates and submitted live allocation portfolios.
              </p>
            </div>

            <div className="space-y-3.5 border-t border-slate-800 pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-lg text-emerald-400 border border-slate-700">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">Zero Junk Policy</h4>
                  <p className="text-[10px] text-slate-400">100% active, verified contact details or immediate refund guarantee.</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-lg text-yellow-400 border border-slate-700">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">Live UPI Wallets</h4>
                  <p className="text-[10px] text-slate-400">Top up seamlessly via scan. Pay only for the leads you unlock.</p>
                </div>
              </div>
            </div>

            <div className="text-[9px] text-slate-500 font-mono">
              Broker CRM Engine v2.8 • Secured by escrow protocols
            </div>
          </div>

          {/* Form Column */}
          <div className="md:col-span-7 p-8 flex flex-col justify-center">
            
            {/* Tabs for Login vs Register */}
            <div className="flex border-b border-slate-150 mb-6 text-sm font-sans font-bold">
              <button
                onClick={() => setAuthMode('login')}
                className={`pb-3.5 px-4 transition-all flex items-center gap-1.5 cursor-pointer ${
                  authMode === 'login' 
                    ? 'border-b-2 border-red-650 text-red-650 font-black' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Lock className="w-4 h-4" />
                Broker Log In
              </button>
              <button
                onClick={() => setAuthMode('signup')}
                className={`pb-3.5 px-4 transition-all flex items-center gap-1.5 cursor-pointer ${
                  authMode === 'signup' 
                    ? 'border-b-2 border-red-650 text-red-650 font-black' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                Register Account
              </button>
            </div>

            {/* LOGIN FORM */}
            {authMode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4 font-sans text-xs">
                <div className="space-y-1.5">
                  <label className="block text-slate-650 font-bold">Official Business Email</label>
                  <input
                    type="email"
                    required
                    placeholder="broker@agency.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full p-3 bg-white text-stone-900 border border-slate-200 rounded-xl outline-none focus:border-red-650 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-slate-650 font-bold">Access Password</label>
                    <span className="text-[10px] text-red-600 font-bold cursor-pointer hover:underline">Forgot?</span>
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full p-3 bg-white text-stone-900 border border-slate-200 rounded-xl outline-none focus:border-red-650 font-medium"
                  />
                </div>

                <div className="bg-slate-50 border border-slate-150 p-3 rounded-lg text-[10px] text-slate-500 leading-normal flex items-start gap-1.5">
                  <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Demo Creds:</strong> Email: <code className="bg-slate-200 px-1 py-0.5 rounded font-bold text-slate-700">broker@investorji.com</code> / Password: <code className="bg-slate-200 px-1 py-0.5 rounded font-bold text-slate-700">password</code>. Or register your custom profile.
                  </div>
                </div>

                <button
                  type="submit"
                  className="cursor-pointer w-full bg-red-650 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-colors text-xs shadow-md flex items-center justify-center gap-1.5 mt-2"
                >
                  Access Leads CRM Desk <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-center text-slate-400 text-[10px]">
                  By logging in, you comply with the Real Estate Regulation & Development (RERA) compliance standards.
                </p>
              </form>
            )}

            {/* SYSTEM OWNER / MAIN ACCOUNT ADMIN OPTION */}
            {authMode === 'login' && onLoginAsAdmin && (
              <div className="border-t border-slate-150 pt-5 mt-4">
                <span className="text-[9px] uppercase font-bold text-slate-400 block mb-2 tracking-wider font-mono">Platform Administrator Portal</span>
                <button
                  type="button"
                  onClick={() => {
                    onLoginAsAdmin();
                    onNotify("Logged in successfully to Main Owner Account (mtlentertainmentindia@gmail.com)!", "success");
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 bg-red-950/5 hover:bg-red-950/10 text-red-700 border border-red-900/15 hover:border-red-900/30 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  🔑 Log in to Main Admin Account (mtlentertainmentindia@gmail.com)
                </button>
              </div>
            )}

            {/* REGISTER / SIGNUP FORM */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-3.5 font-sans text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-slate-650 font-bold">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Rahul Sharma"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="w-full p-2.5 bg-white text-stone-900 border border-slate-200 rounded-xl outline-none focus:border-red-650 font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-slate-650 font-bold">Active Mobile No.</label>
                    <input
                      type="tel"
                      required
                      placeholder="98XXXXXXXX"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      className="w-full p-2.5 bg-white text-stone-900 border border-slate-200 rounded-xl outline-none focus:border-red-650 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-slate-650 font-bold">Business Email</label>
                    <input
                      type="email"
                      required
                      placeholder="rahul@agency.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="w-full p-2.5 bg-white text-stone-900 border border-slate-200 rounded-xl outline-none focus:border-red-650 font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-slate-650 font-bold">RERA Agency / Company</label>
                    <input
                      type="text"
                      placeholder="Sharma Real Estate Partners"
                      value={signupAgency}
                      onChange={(e) => setSignupAgency(e.target.value)}
                      className="w-full p-2.5 bg-white text-stone-900 border border-slate-200 rounded-xl outline-none focus:border-red-650 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-slate-650 font-bold">Create Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="w-full p-2.5 bg-white text-stone-900 border border-slate-200 rounded-xl outline-none focus:border-red-650 font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-slate-650 font-bold">Confirm Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      className="w-full p-2.5 bg-white text-stone-900 border border-slate-200 rounded-xl outline-none focus:border-red-650 font-medium"
                    />
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-150 p-2.5 rounded-lg text-[10px] text-emerald-800 leading-normal font-medium flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Welcome Bonus:</strong> You will get an instantaneous <strong>₹1,500 complimentary test balance</strong> credited to your wallet to try out the system immediately!</span>
                </div>

                <button
                  type="submit"
                  className="cursor-pointer w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-colors text-xs shadow-md flex items-center justify-center gap-1.5 mt-1"
                >
                  Create Certified Broker Profile <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

          </div>

        </div>
      </div>
    );
  }

  // --- RENDER 2: BROKER CRM DESK DASHBOARD (IF LOGGED IN) ---
  return (
    <div className="space-y-8 text-slate-800">
      
      {/* Premium logged-in banner header block */}
      <div className="bg-gradient-to-r from-slate-900 via-stone-850 to-red-900 text-white p-6 rounded-3xl border border-red-800 md:flex items-center justify-between shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(220,38,38,0.12),transparent_40%)] pointer-events-none"></div>
        
        <div className="space-y-2 mb-4 md:mb-0 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest bg-yellow-400/10 px-2.5 py-1 rounded border border-yellow-400/20">
              Agent & Broker Premium Suite
            </span>
            <span className="text-[10px] text-slate-300 font-bold bg-white/10 px-2.5 py-1 rounded">
              🏢 {currentBroker.agencyName || 'Independent Consultant'}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black font-sans text-white flex items-center gap-2">
            HNI Buyer Lead Procurement Desk
          </h2>
          <p className="text-slate-300 text-xs max-w-xl">
            Logged in as <strong className="text-white">{currentBroker.name}</strong> ({currentBroker.email}). Secure connection established.
          </p>
        </div>

        {/* Live Wallet Card */}
        <div className="bg-[#1e293b]/50 backdrop-blur-xs border border-slate-700/60 p-4 rounded-xl flex items-center justify-between md:gap-8 min-w-[310px] relative z-10">
          <div>
            <span className="text-[10px] text-slate-300 font-bold block">YOUR LEADS WALLET</span>
            <div className="text-2xl font-black text-emerald-400 flex items-center gap-1 mt-0.5">
              <Wallet className="w-5 h-5 opacity-90" />
              ₹{currentBroker.walletBalance.toLocaleString('en-IN')}
            </div>
            <button 
              onClick={handleLogout}
              className="text-[9px] text-red-400 hover:text-red-300 font-bold flex items-center gap-0.5 mt-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3 h-3" /> Log Out Desk
            </button>
          </div>

          <button
            onClick={() => {
              setUtrNumber('');
              setShowAddFunds(true);
            }}
            className="cursor-pointer bg-red-650 hover:bg-red-700 text-white text-xs px-4 py-2.5 rounded-lg font-bold transition-all shadow-md flex items-center gap-1"
          >
            <Wallet className="w-3.5 h-3.5" />
            Add Net Funds
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Filter and Rules panel */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-sm mb-4 font-sans flex items-center gap-1.5">
              <Filter className="text-red-650 w-4 h-4" />
              Sieve Active Buyers
            </h3>

            <div className="space-y-4 font-sans">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase mb-2">
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
                          ? 'border-red-600 bg-red-50 text-red-700 font-bold shadow-xs' 
                          : 'border-transparent text-slate-650 hover:bg-slate-50'
                      }`}
                    >
                      {city.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase mb-2">
                  Search Key Criteria
                </label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. Co-Living, Worli..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg outline-none text-slate-800 focus:border-red-600 shadow-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-50/50 border border-red-100 p-4 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-red-655 font-bold">
              <ShieldCheck className="w-4 h-4 text-red-600" />
              InvestorJi Guarantee
            </div>
            <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
              Every client lead featured is processed via double OTP validation and holds a verified budget parameters signature. Non-contactable active leads can be refunded within 12 hours of discovery.
            </p>
          </div>
        </div>

        {/* Right Side: Leads Grid */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center bg-white border border-slate-200 rounded-xl px-4 py-3.5 shadow-xs">
            <span className="text-xs font-bold text-slate-700">
              {finalLeads.length} High Intensity Verified Buyers Found
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-red-655 font-bold">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
              LIVE HOT LEADS POOL
            </div>
          </div>

          <div className="space-y-4">
            {finalLeads.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-400 text-xs">
                No matching HNI leads found. Try refining your filters or search term.
              </div>
            ) : (
              finalLeads.map(lead => (
                <div 
                  key={lead.id} 
                  onClick={() => setSelectedDetailedLead(lead)}
                  className={`bg-white border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer relative group ${
                    lead.isPurchased ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Visual Hint Indicator */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/85 text-[8px] text-white font-bold font-mono px-2 py-1 rounded-sm pointer-events-none z-10">
                    CLICK FOR FULL DOSSIER
                  </div>

                  {/* Lead Header */}
                  <div className="bg-slate-50/70 px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 font-sans">
                    <div className="flex items-center gap-3">
                      <span className="p-2 bg-white border border-slate-200 text-slate-650 rounded-lg">
                        <UserCheck className="w-4 h-4 text-red-650" />
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          {lead.isPurchased ? lead.buyerName : `${lead.buyerName.split(' ')[0]} •••`}
                          {lead.isVerified && (
                            <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" /> VERIFIED
                            </span>
                          )}
                          {lead.isPurchased && (
                            <span className="bg-emerald-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              🔓 UNLOCKED
                            </span>
                          )}
                        </h4>
                        <p className="text-[10px] text-slate-500">
                          Active from: <span className="text-slate-700 font-medium">{lead.city}</span> • Posted <span className="text-slate-600 font-medium">{lead.dateAdded}</span>
                        </p>
                      </div>
                    </div>

                    {/* Score pill */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[9px] text-slate-400 block uppercase font-extrabold tracking-wider">Client Intent Score</span>
                        <span className="text-sm font-black text-emerald-600">{lead.score}% Hot</span>
                      </div>
                      <div className="w-12 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                        <div 
                          className="bg-emerald-500 h-full" 
                          style={{ width: `${lead.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Lead Parameters */}
                  <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-black block mb-0.5">Budget Allocation</span>
                      <strong className="text-slate-900 font-semibold text-sm">{lead.budget}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-black block mb-0.5">Asset Type Interest</span>
                      <strong className="text-slate-800 font-semibold">{lead.propertyType}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-black block mb-0.5">Target Location Focus</span>
                      <span className="text-slate-600 italic block truncate">{lead.targetLocation}</span>
                    </div>
                  </div>

                  {/* Interaction & Price buy actions */}
                  <div className="p-4 bg-slate-50/50 select-none border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 font-sans">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold block">Acquisition License Fee</span>
                      <strong className="text-base text-slate-900 font-black">₹{lead.price.toLocaleString('en-IN')} <span className="text-[10px] text-slate-400 font-normal">one-time</span></strong>
                    </div>

                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      {lead.isPurchased ? (
                        <div className="flex items-center gap-2">
                          {/* Revealed contact options */}
                          <div className="bg-emerald-50 border border-emerald-150 text-emerald-700 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs">
                            <Phone className="w-3.5 h-3.5 animate-pulse" />
                            {lead.fullPhone || `${lead.phonePrefix} ${lead.phoneSuffix.replace(/•/g, '9')}`}
                          </div>
                          <a 
                            href={`https://wa.me/${(lead.fullPhone || '918168105240').replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(lead.buyerName)},%20I%20am%20contacting%20you%20regarding%20your%20property%20sourcing%20requirement%20on%20InvestorJi.`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-lg transition-all shadow-xs"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </a>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            purchaseLead(lead.id);
                          }}
                          className="cursor-pointer bg-red-650 hover:bg-red-700 text-white text-xs px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all shadow-xs"
                        >
                          <Key className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                          Unlock Direct Buyer Details
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* --- ADD FUNDS / UPI ESCROW TOP-UP MODAL --- */}
      {showAddFunds && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in text-slate-800">
          <div className="bg-white rounded-3xl w-full max-w-md border border-slate-200 overflow-hidden shadow-2xl flex flex-col">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-red-950 p-5 text-white flex justify-between items-center">
              <div>
                <span className="text-[9px] uppercase font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded">Escrow Secure UPI Portal</span>
                <h3 className="font-bold text-normal tracking-tight text-white mt-1">Refill Lead Sourcing Wallet</h3>
              </div>
              <button 
                onClick={() => {
                  if (!isVerifyingPayment) {
                    setShowAddFunds(false);
                    setUtrNumber('');
                    setVerificationStep('idle');
                  }
                }}
                className="text-white/80 hover:text-white font-bold text-xl cursor-pointer disabled:opacity-50"
                disabled={isVerifyingPayment}
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            {verificationStep === 'idle' ? (
              <div className="p-6 space-y-5 font-sans text-xs">
                {/* Step 1: Select Pack */}
                <div>
                  <label className="block font-bold text-slate-700 mb-2 uppercase text-[10px] tracking-wider">Select Wallet Credit Pack</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[1000, 2500, 5000, 10000].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleSelectAmount(amt)}
                        className={`cursor-pointer text-xs py-2 rounded-lg border text-center transition-all font-bold ${
                          amountToAdd === amt && !customAmountInput
                            ? 'border-red-600 bg-red-50 text-red-700 shadow-xs' 
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        ₹{amt.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount */}
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700 uppercase text-[10px] tracking-wider">Or Enter Custom Amount (₹)</label>
                  <input
                    type="number"
                    min="500"
                    placeholder="Enter custom amount (e.g. 15000)"
                    value={customAmountInput}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    className="w-full text-xs text-stone-900 bg-white border border-slate-200 p-3 rounded-lg outline-none focus:border-red-650"
                  />
                </div>

                {/* --- REAL-TIME DYNAMIC UPI DISBURSEMENT CARD --- */}
                <div className="border border-slate-250 bg-slate-50/70 rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                    <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-[#d92228]" />
                      Scan Dynamic UPI QR
                    </span>
                    <span className="text-[10px] text-red-650 font-black bg-red-50 border border-red-100 px-2 py-0.5 rounded">
                      UPI VPA: 8168105240@pz
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Real API QR code generation that actually works if scanned on phone */}
                    <div className="bg-white p-2.5 border border-slate-200 rounded-xl shadow-xs">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(`upi://pay?pa=8168105240@pz&pn=InvestorJi%20Leads&am=${amountToAdd}&cu=INR`)}`}
                        alt="UPI Payment QR"
                        className="w-32 h-32"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <p className="text-[10px] text-slate-500 leading-normal">
                        Scan with your favorite Indian banking app (GPay, PhonePe, Paytm, BHIM) to make an instant escrow deposit.
                      </p>
                      
                      <div className="bg-white border border-slate-200 p-2.5 rounded-xl flex items-center justify-between gap-1.5">
                        <div className="truncate">
                          <span className="text-[8px] text-slate-400 block uppercase font-bold">UPI ADDRESS</span>
                          <strong className="text-slate-800 text-[11px] font-mono">8168105240@pz</strong>
                        </div>
                        <button 
                          onClick={() => handleCopyText('8168105240@pz', 'UPI ID')}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded border border-slate-200 cursor-pointer"
                          title="Copy address"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-center sm:text-left text-xs">
                        <span className="text-slate-500">Payable Amount:</span>{' '}
                        <strong className="text-base text-emerald-600 font-extrabold">₹{amountToAdd.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transaction Validation Form */}
                <form onSubmit={handleVerifyPayment} className="space-y-3.5 border-t border-slate-150 pt-4">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <label className="block text-[11px] font-bold text-slate-700">Enter UPI Transaction ID / Ref UTR No.</label>
                      <span className="text-[9px] text-red-650 font-bold bg-red-50 px-1.5 py-0.5 rounded">Auto-Verify Active</span>
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 629815049381 (12 digits)"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full text-xs font-mono tracking-wider p-3 bg-white text-stone-900 border border-slate-200 rounded-xl outline-none focus:border-red-650"
                    />
                    <p className="text-[9px] text-slate-450 leading-normal">
                      The UTR number is displayed on your banking receipt post-transfer. Input any dummy 12-digit number for trial simulation validation.
                    </p>
                  </div>

                  {paymentError && (
                    <div className="text-[10px] text-red-700 bg-red-50 border border-red-100 p-2.5 rounded-lg flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 shrink-0" /> {paymentError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="cursor-pointer w-full bg-red-650 hover:bg-red-700 text-white py-3.5 rounded-xl font-bold transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
                    Verify & Fetch Payment Automatically
                  </button>
                </form>

                {/* --- BROKER PAYMENT RECOGNITION LEDGER --- */}
                {currentBroker && paymentRequests.filter(r => r.brokerId === currentBroker.id).length > 0 && (
                  <div className="border-t border-slate-155 pt-4 space-y-2">
                    <h4 className="font-extrabold text-[10px] uppercase text-slate-550 tracking-wider">
                      Your Top-up Request Logs
                    </h4>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {paymentRequests.filter(r => r.brokerId === currentBroker.id).map(req => (
                        <div key={req.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center text-[11px] font-sans">
                          <div>
                            <div className="font-extrabold text-slate-800">₹{req.amount.toLocaleString('en-IN')} Top-up</div>
                            <div className="text-[9px] text-slate-400 font-mono">UTR: {req.utrNumber} &middot; {req.dateRequested.split(',')[0]}</div>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold font-mono border ${
                            req.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            req.status === 'rejected' ? 'bg-red-50 text-red-650 border-red-100' :
                            'bg-amber-50 text-amber-700 border-amber-100 animate-pulse'
                          }`}>
                            {req.status === 'approved' ? '✓ APPROVED' :
                             req.status === 'rejected' ? '✕ REJECTED' :
                             '⏳ PENDING OWNER'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Verification Step UI */
              <div className="p-8 flex flex-col items-center justify-center text-center space-y-6">
                
                {verificationStep !== 'success' ? (
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-red-100 border-t-red-650 animate-spin"></div>
                    <Wallet className="w-6 h-6 text-red-600 absolute inset-0 m-auto animate-pulse" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center animate-bounce">
                    <Check className="w-8 h-8" />
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="font-extrabold text-sm text-slate-900">
                    {verificationStep === 'connecting' && 'Connecting UPI Central Registry...'}
                    {verificationStep === 'scanning' && 'Scanning Wallet 8168105240@pz...'}
                    {verificationStep === 'utr_match' && `Matching UTR Transaction Logs...`}
                    {verificationStep === 'success' && 'Request Logged Successfully!'}
                  </h4>
                  
                  <p className="text-[11px] text-slate-500 max-w-xs leading-normal font-medium">
                    {verificationStep === 'connecting' && 'Establishing secure socket communication with National Payments Corporation of India (NPCI) systems.'}
                    {verificationStep === 'scanning' && 'Looking for incoming credits of INR ' + amountToAdd + ' on our corporate account endpoint.'}
                    {verificationStep === 'utr_match' && 'Authenticating transaction hash with matching reference UTR No. ' + utrNumber + '...'}
                    {verificationStep === 'success' && 'Your top-up request for ₹' + amountToAdd.toLocaleString() + ' (UTR: ' + utrNumber + ') has been registered! Please wait for the main administrator account to approve your deposit.'}
                  </p>
                </div>

                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${verificationStep === 'success' ? 'bg-emerald-500 w-full' : 'bg-red-600'}`}
                    style={{
                      width: 
                        verificationStep === 'connecting' ? '30%' :
                        verificationStep === 'scanning' ? '65%' :
                        verificationStep === 'utr_match' ? '90%' : '100%'
                    }}
                  ></div>
                </div>

                <div className="text-[9px] font-mono text-slate-400">
                  Transaction: SEC-UPI-T{utrNumber || 'SIM'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DETAILED LEAD DOSSIER MODAL */}
      {(() => {
        const liveLead = selectedDetailedLead ? (leads.find(l => l.id === selectedDetailedLead.id) || selectedDetailedLead) : null;
        if (!liveLead) return null;

        const isLeadUnlocked = currentBroker.unlockedLeads.includes(liveLead.id);

        return (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in text-slate-800">
            <div className="bg-white rounded-3xl w-full max-w-lg border border-slate-200 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="bg-[#0f1524] p-6 text-white flex justify-between items-center border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700">
                    <UserCheck className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-red-500 block font-mono">
                      {isLeadUnlocked ? '🔓 UNLOCKED DOSSIER' : '🔒 SECURE CLIENT PROFILE'}
                    </span>
                    <h3 className="font-extrabold text-lg tracking-tight text-white">
                      {isLeadUnlocked ? liveLead.buyerName : `${liveLead.buyerName.split(' ')[0]} •••`}
                    </h3>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedDetailedLead(null)}
                  className="text-white/80 hover:text-white font-bold text-2xl cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                >
                  &times;
                </button>
              </div>

              {/* Body (scrollable) */}
              <div className="p-6 space-y-6 overflow-y-auto text-xs font-sans">
                {/* Intent & Match Score */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-extrabold block">Client Verification Code</span>
                    <strong className="text-slate-900 font-mono text-sm">HNI-S-{liveLead.id.substring(5, 9).toUpperCase()}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase font-extrabold block">Compatibility Rank</span>
                    <strong className="text-emerald-600 font-black text-sm flex items-center justify-end gap-1">
                      <ShieldCheck className="w-4 h-4" /> {liveLead.score}% Match Score
                    </strong>
                  </div>
                </div>

                {/* Sourcing Parameters (Always Revealed) */}
                <div className="space-y-3">
                  <h4 className="font-extrabold text-slate-900 uppercase text-[10px] tracking-wider border-b border-slate-100 pb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" /> Sourcing Scope Preferences
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">Demographic Origin</span>
                      <span className="text-slate-800 font-bold text-xs">{liveLead.city}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">Timeframe Intent</span>
                      <span className="text-slate-800 font-bold text-xs">{liveLead.timeframe}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">Target Investment Hub</span>
                      <span className="text-red-655 font-bold text-xs">{liveLead.targetLocation}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">Budget Allocation Cap</span>
                      <span className="text-slate-900 font-bold text-xs">{liveLead.budget}</span>
                    </div>
                  </div>
                  <div className="pt-1">
                    <span className="text-[9px] text-slate-400 block uppercase font-bold">Asset Class Focus</span>
                    <span className="text-slate-800 font-extrabold text-xs bg-slate-100 py-1 px-2.5 rounded-lg inline-block mt-0.5 border border-slate-200">
                      🏢 {liveLead.propertyType}
                    </span>
                  </div>
                </div>

                {/* Secure Contact Details (Condition-based) */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-extrabold text-slate-900 uppercase text-[10px] tracking-wider border-b border-slate-100 pb-1.5 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-500" /> Client Contacts & Inbound Message
                  </h4>

                  {isLeadUnlocked ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Real Phone */}
                        <div className="bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-xl flex items-center justify-between gap-3">
                          <div>
                            <span className="text-[9px] text-emerald-700 block uppercase font-bold">WhatsApp Number</span>
                            <strong className="text-slate-900 font-mono text-xs">{liveLead.fullPhone || `${liveLead.phonePrefix} ${liveLead.phoneSuffix.replace(/•/g, '9')}`}</strong>
                          </div>
                          <div className="flex gap-1.5">
                            <button 
                              onClick={() => handleCopyText(liveLead.fullPhone || `${liveLead.phonePrefix} ${liveLead.phoneSuffix.replace(/•/g, '9')}`, 'Phone Number')}
                              className="p-1.5 bg-white hover:bg-emerald-100 text-emerald-800 rounded-md border border-emerald-200 shadow-xs cursor-pointer"
                              title="Copy contact"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <a 
                              href={`https://wa.me/${(liveLead.fullPhone || '91' + liveLead.phonePrefix + liveLead.phoneSuffix.replace(/[^0-9]/g, '')).replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(liveLead.buyerName)},%20I%20am%20contacting%20you%20regarding%20your%20property%20sourcing%20requirement%20on%20InvestorJi.`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md shadow-xs flex items-center justify-center"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>

                        {/* Real Email */}
                        <div className="bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-xl flex items-center justify-between gap-3">
                          <div>
                            <span className="text-[9px] text-emerald-700 block uppercase font-bold">Email Channel</span>
                            <strong className="text-slate-900 font-mono text-xs block truncate max-w-[130px]" title={liveLead.email || 'client@hni-investor.in'}>
                              {liveLead.email || `${liveLead.buyerName.toLowerCase().replace(/\s+/g, '')}@hni-investor.in`}
                            </strong>
                          </div>
                          <button 
                            onClick={() => handleCopyText(liveLead.email || `${liveLead.buyerName.toLowerCase().replace(/\s+/g, '')}@hni-investor.in`, 'Email Address')}
                            className="p-1.5 bg-white hover:bg-emerald-100 text-emerald-800 rounded-md border border-emerald-200 shadow-xs cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Client Query Message */}
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
                        <span className="text-[9px] text-slate-500 uppercase font-extrabold block">Exact Sourced Inbound Message / Query:</span>
                        <p className="text-slate-850 font-medium italic text-xs leading-relaxed">
                          "{liveLead.query || `Requested exclusive prospectus. Expressed serious interest in premium property sourcing options with strong asset appreciation in ${liveLead.targetLocation}.`}"
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-dashed border-slate-300 p-6 rounded-2xl text-center space-y-3">
                      <Key className="w-8 h-8 text-slate-400 mx-auto animate-bounce" />
                      <div className="space-y-1">
                        <h5 className="font-extrabold text-slate-800 text-xs">Premium HNI Details Locked</h5>
                        <p className="text-[10px] text-slate-500 max-w-xs mx-auto leading-normal font-medium">
                          The client's authentic phone number, email address, and exact query parameters are private. Unlock using your brokerage wallet balance.
                        </p>
                      </div>
                      <button
                        onClick={() => purchaseLead(liveLead.id)}
                        className="bg-red-650 hover:bg-red-750 text-white font-sans text-[10px] font-bold px-4 py-2 rounded-lg transition-all cursor-pointer shadow-sm"
                      >
                        ⚡ Instant Unlock Dossier for ₹{liveLead.price}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between gap-4 shrink-0 font-sans font-bold">
                <span className="text-[10px] text-slate-500">Source: Dynamic Broker Ledger</span>
                {isLeadUnlocked ? (
                  <span className="text-emerald-700 text-[10px] flex items-center gap-1 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Dossier Fully Unlocked & Verified
                  </span>
                ) : (
                  <button
                    onClick={() => purchaseLead(liveLead.id)}
                    className="bg-red-650 hover:bg-red-700 text-white text-[11px] px-5 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    Unlock Details (₹{liveLead.price})
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
