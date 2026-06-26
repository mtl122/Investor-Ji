import React, { useState } from 'react';
import { Property } from '../types';
import { MapPin, ShieldCheck, Star, Scale, Heart, Bell, MessageSquare } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
  ctaText?: string;
  isComparing?: boolean;
  onCompareToggle?: (e: React.MouseEvent) => void;
  isFavorited?: boolean;
  onFavoriteToggle?: (e: React.MouseEvent) => void;
  onSetPriceAlert?: (propertyId: string, email: string, targetPrice: number) => void;
  onContactBuilder?: (property: Property, e: React.MouseEvent) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onClick,
  ctaText,
  isComparing = false,
  onCompareToggle,
  isFavorited = false,
  onFavoriteToggle,
  onSetPriceAlert,
  onContactBuilder
}) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  // Inline Price alert form open state
  const [showPriceAlertForm, setShowPriceAlertForm] = useState(false);
  const [alertTargetPrice, setAlertTargetPrice] = useState<number>(Math.round(property.minInvestment * 0.9));
  const [alertEmail, setAlertEmail] = useState('MTLENTERTAINMENTINDIA@gmail.com');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (showPriceAlertForm) return; // disable tilting while configuring alert form
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    
    // Scale to a maximum of 6 degrees tilt for ultra-smooth professional feedback
    setRotate({
      x: -(y / (box.height / 2)) * 6,
      y: (x / (box.width / 2)) * 6,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };

  // Determine standard badge and visual texts
  let categoryLabel = 'Premium Sourced';
  if (property.isPlot) {
    categoryLabel = '🌳 Land Layout';
  } else if (property.type === 'Commercial') {
    categoryLabel = '🏢 Commercial Anchor';
  } else if (property.type === 'Assured Return') {
    categoryLabel = '💰 Assured Return';
  } else {
    categoryLabel = `${property.type} Premium`;
  }

  // Determine standard or dynamic bottom action button
  const defaultCta = property.isPlot 
    ? "Request Land Mutation" 
    : property.type === 'Commercial' || property.type === 'Assured Return'
      ? "View Commercial Lease Spec"
      : "Launch Audit Profile";

  const btnText = ctaText || defaultCta;

  const handleAlertSubmit = (e: React.FormEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onSetPriceAlert) {
      onSetPriceAlert(property.id, alertEmail, alertTargetPrice);
    }
    setShowPriceAlertForm(false);
  };

  return (
    <div 
      onClick={(e) => {
        if (showPriceAlertForm) {
          // prevent main card click
          return;
        }
        onClick();
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`bg-[#111726] border border-slate-800 rounded-3xl h-[420px] flex flex-col justify-between overflow-hidden cursor-pointer select-none relative ${
        isHovered ? 'z-10' : 'z-0'
      }`}
      style={{
        transform: isHovered && !showPriceAlertForm
          ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.03, 1.03, 1.03)` 
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: isHovered 
          ? 'transform 0.05s ease-out, border-color 0.2s ease, box-shadow 0.2s ease' 
          : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.4s ease',
        borderColor: isHovered ? '#d92228' : '#334155', // crimson vs slate-700
        boxShadow: isHovered 
          ? '0 0 25px 4px rgba(217, 34, 40, 0.45), 0 4px 10px rgba(0, 0, 0, 0.5)' 
          : '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3)',
      }}
    >
      
      {/* 1. Header Media Component - Normalized Aspect Ratio (h-40) */}
      <div className="relative h-40 bg-slate-950 overflow-hidden shrink-0">
        <img 
          src={property.image} 
          alt={property.title} 
          className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
          referrerPolicy="no-referrer"
        />
        
        {/* Absolute Linear Image Shade to emphasize text badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-black/30 pointer-events-none" />

        {/* Top-Left Score badge with a micro glow-pulse on hover */}
        <div className={`absolute top-3.5 left-3.5 bg-slate-900/90 text-white backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-md transition-all duration-300 ${isHovered ? 'bg-[#0f172a] shadow-red-500/20 shadow-md transform -translate-y-0.5' : ''}`}>
          <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37] animate-pulse" />
          <span>Ji Score: <strong className="font-display font-extrabold text-[#D4AF37]">{property.investorJiScore || '9.0'}</strong></span>
        </div>

        {/* Top-Right Side-by-Side Utilities (Favorite Heart & Compare button & Bell Icon) */}
        <div className="absolute top-3.5 right-3.5 flex gap-1.5 z-20">
          
          {/* Favorite heart icon toggle */}
          {onFavoriteToggle && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onFavoriteToggle(e);
              }}
              className={`p-1.5 rounded-full text-xs font-bold transition-all duration-200 border cursor-pointer flex items-center justify-center ${
                isFavorited 
                  ? 'bg-red-650 text-white border-red-650 shadow-md' 
                  : 'bg-slate-900/85 text-slate-300 border-slate-705 hover:bg-slate-800'
              }`}
              title={isFavorited ? "Remove Favorite" : "Favorite Bookmark"}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-white' : ''}`} />
            </button>
          )}

          {/* Price alert configuration toggle (Bell Icon) */}
          {onSetPriceAlert && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setShowPriceAlertForm(!showPriceAlertForm);
              }}
              className={`p-1.5 rounded-full text-xs font-bold transition-all duration-200 border cursor-pointer flex items-center justify-center ${
                showPriceAlertForm 
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md' 
                  : 'bg-slate-900/85 text-slate-300 border-slate-705 hover:bg-slate-850'
              }`}
              title="Set Price Sourcing Alert Trigger"
            >
              <Bell className="w-3.5 h-3.5" />
            </button>
          )}

          {onCompareToggle && (
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onCompareToggle(e);
              }}
              className={`px-2 py-1 rounded-full text-[9px] font-bold flex items-center gap-1 transition-all duration-200 border cursor-pointer ${
                isComparing 
                  ? 'bg-red-650 text-white border-red-650 shadow-md' 
                  : 'bg-slate-900/85 text-slate-300 border-slate-705 hover:bg-slate-800'
              }`}
            >
              <Scale className="w-3 h-3" />
              <span>{isComparing ? 'Comparing' : 'Compare'}</span>
            </button>
          )}

        </div>

        {/* Bottom-Right Verified RERA badge */}
        {property.isVerified && (
          <div className="absolute bottom-3 right-3 bg-red-650 text-white border border-red-500/30 px-2.5 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 shadow-lg backdrop-blur-xs leading-none">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified RERA</span>
          </div>
        )}
      </div>

      {/* 2. Body Details Area OR Config Alert Panel Overlay */}
      {showPriceAlertForm ? (
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="p-5 flex-grow flex flex-col justify-between bg-slate-950/95 border-b border-slate-850 animate-in slide-in-from-top duration-250 z-30"
        >
          <div className="space-y-2">
            <h4 className="font-extrabold text-amber-500 text-xs uppercase tracking-wide flex items-center gap-1.5">
              <Bell className="w-4 h-4" /> Set Price Sourcing Alarm
            </h4>
            <p className="text-[10px] text-slate-400 font-sans leading-normal">
              Receive a live simulation warning email if price of <strong>{property.title}</strong> matches or drops below your target.
            </p>

            <form onSubmit={handleAlertSubmit} className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-0.5">
                  <span className="text-[8px] text-slate-500 font-bold uppercase block">Current Min Price</span>
                  <strong className="text-white font-mono text-xs">₹{property.minInvestment}L+</strong>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[8px] text-slate-500 font-bold uppercase block">Target Price (Lakhs)</span>
                  <input 
                    type="number" 
                    required
                    max={property.minInvestment}
                    min="1"
                    className="bg-slate-900 border border-slate-800 rounded font-bold font-mono p-1 text-white w-full text-[11px]"
                    value={alertTargetPrice}
                    onChange={(e) => setAlertTargetPrice(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[8px] text-slate-500 font-bold uppercase block">Subscriber Email</span>
                <input 
                  type="email" 
                  required
                  placeholder="name@domain.com"
                  className="bg-slate-900 border border-slate-800 rounded p-1 text-slate-200 w-full text-[10px] font-semibold"
                  value={alertEmail}
                  onChange={(e) => setAlertEmail(e.target.value)}
                />
              </div>

              <div className="flex gap-2 pt-1 font-bold">
                <button
                  type="submit"
                  className="flex-grow bg-amber-500 hover:bg-slate-900 text-slate-950 hover:text-white transition-all py-1.5 rounded text-[10px]"
                >
                  Confirm Sourcing Alert
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setShowPriceAlertForm(false); }}
                  className="bg-slate-900 border border-slate-800 text-slate-400 hover:text-white py-1.5 px-2.5 rounded text-[10px]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="p-5 flex-grow flex flex-col justify-between space-y-3">
          
          {/* Meta Line */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-[9px] font-mono font-bold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="truncate">{property.location}, {property.city}</span>
            </div>
            
            <h4 className="font-black text-slate-100 leading-snug font-display text-sm line-clamp-1 hover:text-red-400 transition-colors">
              {property.title}
            </h4>
            <span className="text-[8px] bg-slate-900 text-slate-300 border border-slate-800 px-2 py-0.5 rounded font-bold uppercase font-sans tracking-wide inline-block shrink-0">
              {categoryLabel}
            </span>
          </div>

          {/* Clamped Description, guaranteeing accurate row lines */}
          <p className="text-[11px] text-slate-300 font-medium leading-relaxed line-clamp-2 h-9 overflow-hidden">
            {property.description}
          </p>

          {/* Financial Metrics Grid - Strict standard alignment */}
          <div className="grid grid-cols-3 gap-1 bg-slate-950/45 p-2.5 rounded-2xl text-center border border-slate-800/80 shrink-0">
            <div>
              <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-normal">Min Invest</span>
              <strong className="text-white text-[11px] font-mono font-extrabold block mt-0.5">₹{property.minInvestment}L+</strong>
            </div>
            <div>
              {property.isPlot ? (
                <>
                  <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-normal">YOY Growth</span>
                  <strong className="text-emerald-450 text-[11px] font-mono font-extrabold block mt-0.5">+{property.appreciationRate}%</strong>
                </>
              ) : (
                <>
                  <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-normal">Proj. ROI</span>
                  <strong className="text-emerald-450 text-[11px] font-mono font-extrabold block mt-0.5">{property.projectedROI}%</strong>
                </>
              )}
            </div>
            <div>
              {property.isPlot ? (
                <>
                  <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-normal font-sans">Comp. Year</span>
                  <strong className="text-red-400 text-[11px] font-mono font-extrabold block mt-0.5">{property.completionYear}</strong>
                </>
              ) : (
                <>
                  <span className="text-[8px] uppercase font-bold text-slate-400 block tracking-normal font-medium">Lease Yield</span>
                  <strong className="text-amber-500 text-[11px] font-mono font-extrabold block mt-0.5">{property.rentalYield ?? 6.0}%</strong>
                </>
              )}
            </div>
          </div>

        </div>
      )}

      {/* 3. Footer Elements with absolute uniform vertical limits */}
      <div className="px-5 py-3 border-t border-slate-800/80 bg-slate-900/40 flex items-center justify-between text-xs font-bold shrink-0">
        <span className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 truncate max-w-[45%]">
          {btnText} &rarr;
        </span>
        
        {onContactBuilder ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onContactBuilder(property, e);
            }}
            className="bg-red-650 hover:bg-[#b0171d] text-white px-2.5 py-1.5 rounded-xl text-[10px] transition-all flex items-center gap-1 font-sans font-black shadow-md cursor-pointer shrink-0"
          >
            <MessageSquare className="w-3 h-3 text-white" />
            <span>Contact Builder</span>
          </button>
        ) : (
          <span className="text-[9px] text-slate-500 font-mono font-medium tracking-wide uppercase">
            #{property.reraId.split('-')[1] || 'RERA-2K26'}
          </span>
        )}
      </div>

    </div>
  );
};
