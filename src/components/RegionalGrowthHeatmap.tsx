import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { 
  Sparkles, 
  MapPin, 
  TrendingUp, 
  Search, 
  Sliders, 
  Activity, 
  ShieldCheck, 
  ArrowRight,
  Info,
  Layers,
  Percent,
  Coins
} from 'lucide-react';
import { Property } from '../types';

interface Hotspot {
  id: string;
  name: string;
  city: string;
  appreciation: number; // YOY in %
  devIndex: number; // 0-100 rating
  avgPriceSqft: number; // in ₹
  drivers: string;
  volume: string;
  jiScore: number;
  bestClass: 'Residential' | 'Commercial' | 'Fractional' | 'Assured Return';
}

const HOTSPOT_DATA: Hotspot[] = [
  // Dholera SIR
  {
    id: 'dhl-1',
    name: 'Activation Area Phase 1',
    city: 'Dholera SIR',
    appreciation: 22.5,
    devIndex: 95,
    avgPriceSqft: 3500,
    drivers: 'Underground ICT Trunk Infrastructure & Industrial Zone A',
    volume: 'High',
    jiScore: 9.7,
    bestClass: 'Commercial'
  },
  {
    id: 'dhl-2',
    name: 'High-Speed Rail Corridor Sec 3',
    city: 'Dholera SIR',
    appreciation: 24.8,
    devIndex: 92,
    avgPriceSqft: 2800,
    drivers: 'Bullet Train Metro Station Node & High FSI Commercial Hub',
    volume: 'Medium-High',
    jiScore: 9.6,
    bestClass: 'Residential'
  },
  {
    id: 'dhl-3',
    name: 'Multi-Modal Logistics Park Zone',
    city: 'Dholera SIR',
    appreciation: 18.2,
    devIndex: 90,
    avgPriceSqft: 4200,
    drivers: 'Adani Logistics Hub & Cargo Airport Proximity Roadways',
    volume: 'High',
    jiScore: 9.5,
    bestClass: 'Assured Return'
  },
  {
    id: 'dhl-4',
    name: 'Sector 2 Smart Residency',
    city: 'Dholera SIR',
    appreciation: 16.5,
    devIndex: 88,
    avgPriceSqft: 2100,
    drivers: 'Automated Water Grids & Public Housing Corridor',
    volume: 'Medium',
    jiScore: 9.3,
    bestClass: 'Residential'
  },
  {
    id: 'dhl-5',
    name: 'Knowledge and IT SEZ Park',
    city: 'Dholera SIR',
    appreciation: 19.8,
    devIndex: 91,
    avgPriceSqft: 3100,
    drivers: 'International University & FinTech Incubation Offices',
    volume: 'Medium',
    jiScore: 9.4,
    bestClass: 'Fractional'
  },

  // Gurgaon
  {
    id: 'ggr-1',
    name: 'Golf Course Road Extension',
    city: 'Gurgaon',
    appreciation: 15.4,
    devIndex: 96,
    avgPriceSqft: 18500,
    drivers: 'Rapid Metro Expansion & Premium Grade-A Office Corridors',
    volume: 'Extreme',
    jiScore: 9.6,
    bestClass: 'Commercial'
  },
  {
    id: 'ggr-2',
    name: 'Dwarka Expressway Sector 102',
    city: 'Gurgaon',
    appreciation: 18.9,
    devIndex: 91,
    avgPriceSqft: 11200,
    drivers: 'Direct Delhi Airport Expressway Bypass Interchange',
    volume: 'High',
    jiScore: 9.4,
    bestClass: 'Residential'
  },
  {
    id: 'ggr-3',
    name: 'Sohna Road Corridor',
    city: 'Gurgaon',
    appreciation: 12.1,
    devIndex: 85,
    avgPriceSqft: 8000,
    drivers: 'Elevated Corridor Connectivity & Industrial growth parks',
    volume: 'Medium',
    jiScore: 9.1,
    bestClass: 'Residential'
  },
  {
    id: 'ggr-4',
    name: 'Cyber City Business Hub',
    city: 'Gurgaon',
    appreciation: 10.5,
    devIndex: 98,
    avgPriceSqft: 24000,
    drivers: 'Fortune 500 Headquarters & Premium Tech Parks',
    volume: 'High',
    jiScore: 9.5,
    bestClass: 'Fractional'
  },
  {
    id: 'ggr-5',
    name: 'Southern Peripheral Road (SPR)',
    city: 'Gurgaon',
    appreciation: 13.8,
    devIndex: 89,
    avgPriceSqft: 9500,
    drivers: 'Cloverleaf flyover integration & metro line connection',
    volume: 'Medium-High',
    jiScore: 9.2,
    bestClass: 'Assured Return'
  },

  // Noida
  {
    id: 'nda-1',
    name: 'Sector 150 Sports City',
    city: 'Noida',
    appreciation: 14.2,
    devIndex: 89,
    avgPriceSqft: 8550,
    drivers: '9-Hole Golf Course & Eco-friendly Low Density Gated Layouts',
    volume: 'High',
    jiScore: 9.4,
    bestClass: 'Residential'
  },
  {
    id: 'nda-2',
    name: 'Yamuna Expressway Sec 22D',
    city: 'Noida',
    appreciation: 19.5,
    devIndex: 94,
    avgPriceSqft: 5800,
    drivers: 'Jewar International Airport & Upcoming Toy City Project',
    volume: 'Extreme',
    jiScore: 9.7,
    bestClass: 'Commercial'
  },
  {
    id: 'nda-3',
    name: 'Sector 62 Institutional Belt',
    city: 'Noida',
    appreciation: 11.2,
    devIndex: 92,
    avgPriceSqft: 9200,
    drivers: 'Operational Metro Interchange & High Corporate Demand',
    volume: 'Medium',
    jiScore: 9.2,
    bestClass: 'Fractional'
  },
  {
    id: 'nda-4',
    name: 'Sector 143 Tech Corridor',
    city: 'Noida',
    appreciation: 13.1,
    devIndex: 87,
    avgPriceSqft: 7900,
    drivers: 'Aqua Line Metro Station & Expressway Intersection Node',
    volume: 'Medium-High',
    jiScore: 9.1,
    bestClass: 'Residential'
  },

  // Bengaluru
  {
    id: 'blr-1',
    name: 'Whitefield Tech Corridor',
    city: 'Bengaluru',
    appreciation: 13.5,
    devIndex: 94,
    avgPriceSqft: 9800,
    drivers: 'Metro Purple Line Expansion & Premium IT Tech Parks',
    volume: 'High',
    jiScore: 9.5,
    bestClass: 'Fractional'
  },
  {
    id: 'blr-2',
    name: 'Devanahalli Airport Corridor',
    city: 'Bengaluru',
    appreciation: 20.8,
    devIndex: 93,
    avgPriceSqft: 6500,
    drivers: 'KIADB Aerospace IT Hub & International Cargo Terminus',
    volume: 'Extreme',
    jiScore: 9.6,
    bestClass: 'Commercial'
  },
  {
    id: 'blr-3',
    name: 'Sarjapur Residential Belt',
    city: 'Bengaluru',
    appreciation: 16.2,
    devIndex: 90,
    avgPriceSqft: 8200,
    drivers: 'Upcoming Peripheral Ring Road Transit & Corporate Hubs',
    volume: 'High',
    jiScore: 9.3,
    bestClass: 'Residential'
  },

  // Mumbai
  {
    id: 'mum-1',
    name: 'BKC Commercial Hub',
    city: 'Mumbai',
    appreciation: 9.8,
    devIndex: 99,
    avgPriceSqft: 38000,
    drivers: 'Upcoming Bullet Train Terminus & Major Sovereign Fund HQs',
    volume: 'High',
    jiScore: 9.4,
    bestClass: 'Commercial'
  },
  {
    id: 'mum-2',
    name: 'Navi Mumbai Airport Belt',
    city: 'Mumbai',
    appreciation: 17.5,
    devIndex: 92,
    avgPriceSqft: 12500,
    drivers: 'Trans-Harbour Atal Setu Bridge & Upcoming Cargo Terminal',
    volume: 'Extreme',
    jiScore: 9.6,
    bestClass: 'Residential'
  },
  {
    id: 'mum-3',
    name: 'Lower Parel Corporate Block',
    city: 'Mumbai',
    appreciation: 8.5,
    devIndex: 95,
    avgPriceSqft: 32000,
    drivers: 'Premium Retail Highstreets & Monorail Interchange',
    volume: 'Medium',
    jiScore: 9.0,
    bestClass: 'Fractional'
  }
];

interface RegionalGrowthHeatmapProps {
  onFilterByCity: (city: string) => void;
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onNavigateToTab: (tab: any) => void;
  onNotify: (message: string, type: 'success' | 'error') => void;
}

export function RegionalGrowthHeatmap({
  onFilterByCity,
  properties,
  onSelectProperty,
  onNavigateToTab,
  onNotify
}: RegionalGrowthHeatmapProps) {
  const [selectedCity, setSelectedCity] = useState<string>('Dholera SIR');
  const [hoveredHotspot, setHoveredHotspot] = useState<Hotspot | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  
  // Interactive UI filters
  const [minAppreciation, setMinAppreciation] = useState<number>(10);
  const [highlightHighGrowth, setHighlightHighGrowth] = useState<boolean>(false);

  const [width, setWidth] = useState<number>(500);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Set up ResizeObserver to handle container size changes responsively and meet platform guidelines
  useEffect(() => {
    if (!containerRef.current) return;
    
    let timeoutId: any = null;
    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      const clientWidth = entry.contentRect.width;
      
      // Debounce the state update to avoid rendering lag during rapid resizing
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        setWidth(clientWidth || 500);
      }, 100);
    });
    
    observer.observe(containerRef.current);
    
    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Filter hotspots based on currently selected city and minimum appreciation slider
  const currentHotspots = HOTSPOT_DATA.filter(
    h => h.city === selectedCity
  );

  // Set initial default hovered element
  useEffect(() => {
    if (currentHotspots.length > 0) {
      setHoveredHotspot(currentHotspots[0]);
    }
  }, [selectedCity]);

  // Handle D3 rendering of the heatmap
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Use responsive width state
    const containerWidth = width;
    
    const data = currentHotspots;
    if (data.length === 0) return;

    // Heatmap cell layout sizing - 1 column on mobile, max 3 on desktop to prevent squishing
    const colsCount = containerWidth < 500 ? 1 : Math.min(data.length, 3);
    const rowsCount = Math.ceil(data.length / colsCount);
    
    const cellHeight = containerWidth < 500 ? 68 : 65;
    const margin = { top: 15, right: 15, bottom: 45, left: 15 };
    const innerWidth = containerWidth - margin.left - margin.right;
    const innerHeight = rowsCount * cellHeight;
    const height = innerHeight + margin.top + margin.bottom;

    // Clear previous SVG contents
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create central canvas element
    const g = svg
      .attr('width', containerWidth)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const cellWidth = innerWidth / colsCount;

    // Setup color interpolation scale for appreciation values
    // Using an elegant premium gradient from deep charcoal slate to golden amber and vibrant red
    const minVal = 8;
    const maxVal = 25;
    
    const colorScale = d3.scaleSequential()
      .domain([minVal, maxVal])
      .interpolator(d3.interpolateYlOrRd);

    // Grid cells rendering
    const cells = g.selectAll('.heatmap-cell')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'heatmap-cell')
      .attr('transform', (d, i) => {
        const col = i % colsCount;
        const row = Math.floor(i / colsCount);
        return `translate(${col * cellWidth}, ${row * cellHeight})`;
      })
      .style('cursor', 'pointer');

    // Add rectangle background
    cells.append('rect')
      .attr('width', cellWidth - 8)
      .attr('height', cellHeight - 8)
      .attr('rx', 12)
      .attr('ry', 12)
      .attr('fill', (d) => {
        // Dim cells that don't pass active interactive sliders/filters
        const passesFilter = d.appreciation >= minAppreciation && (!highlightHighGrowth || d.appreciation >= 15);
        if (!passesFilter) return '#f1f5f9'; // Slate-100 muted state
        return colorScale(d.appreciation);
      })
      .attr('stroke', (d) => {
        if (selectedHotspot?.id === d.id) return '#dc2626'; // Red stroke for selected hotspot
        if (hoveredHotspot?.id === d.id) return '#1e293b'; // Slate-800 stroke for hover
        return 'rgba(226, 232, 240, 0.8)';
      })
      .attr('stroke-width', (d) => {
        if (selectedHotspot?.id === d.id) return 3;
        if (hoveredHotspot?.id === d.id) return 2.5;
        return 1.5;
      })
      .style('transition', 'all 200ms ease-out')
      // Dynamic hover shadow/opacity animation using D3
      .on('mouseover', function (event, d) {
        d3.select(this)
          .attr('transform', 'scale(1.02)')
          .style('filter', 'drop-shadow(0px 8px 16px rgba(220, 38, 38, 0.15))');
        
        setHoveredHotspot(d);
      })
      .on('mouseout', function () {
        d3.select(this)
          .attr('transform', 'scale(1)')
          .style('filter', 'none');
      })
      .on('click', (event, d) => {
        setSelectedHotspot(d);
        onNotify(`Active Sourcing Hotspot: Selected ${d.name}. Filter applied below!`, 'success');
        // Let's filter the main catalog tab city matching this city
        onFilterByCity(d.city);
      });

    // Add Text labels inside cells
    // 1. Hotspot short Name
    cells.append('text')
      .attr('x', 14)
      .attr('y', 28)
      .attr('fill', (d) => {
        const passesFilter = d.appreciation >= minAppreciation && (!highlightHighGrowth || d.appreciation >= 15);
        if (!passesFilter) return '#64748b'; // Muted slate-500
        // Determine text contrast based on color brightness
        return d.appreciation > 16 ? '#fff' : '#0f172a';
      })
      .style('font-weight', 'bold')
      .style('font-size', '11px')
      .style('font-family', 'Inter, sans-serif')
      .text((d) => {
        const maxLen = containerWidth < 500 ? 35 : 22;
        return d.name.length > maxLen ? d.name.substring(0, maxLen - 2) + '...' : d.name;
      });

    // 2. Appreciation percentage rate
    cells.append('text')
      .attr('x', 14)
      .attr('y', cellHeight - 20)
      .attr('fill', (d) => {
        const passesFilter = d.appreciation >= minAppreciation && (!highlightHighGrowth || d.appreciation >= 15);
        if (!passesFilter) return '#94a3b8';
        return d.appreciation > 16 ? 'rgba(255, 255, 255, 0.95)' : '#475569';
      })
      .style('font-family', 'JetBrains Mono, monospace')
      .style('font-size', '10px')
      .style('font-weight', 'bold')
      .text((d) => `Appreciation: +${d.appreciation}% YOY`);

  }, [selectedCity, minAppreciation, highlightHighGrowth, hoveredHotspot, selectedHotspot, width]);

  // Handle matching properties search
  const propertiesMatchingCity = properties.filter(
    p => p.city.toLowerCase().includes(selectedCity.toLowerCase()) || 
         (selectedCity === 'Dholera SIR' && p.city === 'Dholera SIR')
  );

  return (
    <div id="growth-heatmap-container" className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-xs text-slate-800">
      
      {/* Visual Header Grid Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border border-red-150">
            <Activity className="w-3.5 h-3.5" /> Interactive D3 Core Projections
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight font-display">
            Interactive Regional Growth Hotspots Map
          </h3>
          <p className="text-[11px] text-slate-550 leading-relaxed font-semibold">
            Point-and-click sectors in top cities of India. Visualize real-time land appreciation indexes, corporate sourcing volumes, and infra driver networks formulated using active RERA metrics.
          </p>
        </div>

        {/* City Toggle Selector Buttons */}
        <div className="flex flex-wrap gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 self-start md:self-center">
          {['Dholera SIR', 'Gurgaon', 'Noida', 'Bengaluru', 'Mumbai'].map(city => (
            <button
              key={city}
              onClick={() => {
                setSelectedCity(city);
                setSelectedHotspot(null);
                onFilterByCity(city);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCity === city 
                  ? 'bg-red-650 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-red-655 hover:bg-white'
              }`}
            >
              {city === 'Dholera SIR' ? '⚡ Dholera SIR' : city}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Controls Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Heatmap Visual Controls */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Appreciation Slider */}
            <div className="space-y-1.5 flex-grow max-w-xs">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-500">Min YOY Appreciation Floor:</span>
                <span className="text-red-655 font-mono">+{minAppreciation}%</span>
              </div>
              <input 
                type="range" 
                min="8" 
                max="24" 
                step="0.5"
                value={minAppreciation}
                onChange={(e) => setMinAppreciation(parseFloat(e.target.value))}
                className="w-full accent-red-650 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* High Growth Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-slate-700">
              <input 
                type="checkbox"
                checked={highlightHighGrowth}
                onChange={(e) => setHighlightHighGrowth(e.target.checked)}
                className="rounded border-slate-300 accent-red-650 w-4 h-4"
              />
              <span>Highlight Hyper-Growth Corridors (&ge;15% YOY)</span>
            </label>

            {/* Reset Button */}
            <button
              onClick={() => {
                setMinAppreciation(10);
                setHighlightHighGrowth(false);
                setSelectedHotspot(null);
              }}
              className="text-[10px] bg-white hover:bg-slate-100 text-slate-600 font-extrabold px-3 py-1.5 rounded-lg border border-slate-250 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>

          {/* D3 Heatmap Drawing Stage Container */}
          <div 
            ref={containerRef} 
            className="w-full bg-slate-50/50 rounded-2xl border border-slate-200 p-4 pb-14 flex items-center justify-center min-h-[180px] md:min-h-[290px] relative overflow-hidden"
          >
            <svg ref={svgRef} className="w-full block"></svg>

            {/* Heatmap Bottom Legend */}
            <div className="absolute bottom-2.5 left-3.5 right-3.5 flex flex-wrap items-center justify-between gap-2 text-[9px] sm:text-[10px] font-bold text-slate-500 font-mono">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="hidden xs:inline">Appreciation:</span>
                <div className="flex h-2.5 w-20 sm:w-28 rounded overflow-hidden border border-slate-200 bg-linear-to-r from-amber-100 via-orange-400 to-red-600"></div>
                <span className="text-slate-800">8% &rarr; 25% YOY</span>
              </div>
              <div className="text-[9px] text-slate-400 shrink-0">
                ⚡ Click sector to filter
              </div>
            </div>
          </div>

        </div>

        {/* Hotspot Sourcing Details Side Panel */}
        <div className="lg:col-span-4 space-y-4">
          
          {hoveredHotspot ? (
            <div className="bg-slate-900 text-white rounded-3xl p-6 space-y-5 border border-slate-800 shadow-md relative overflow-hidden animate-fade-in">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold tracking-widest text-red-400 block font-mono">Selected Sector Hotspot</span>
                <h4 className="text-base font-extrabold tracking-tight text-white leading-tight font-display">
                  {hoveredHotspot.name}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-red-500" /> {hoveredHotspot.city}
                </div>
              </div>

              {/* Hotspot key indicators */}
              <div className="grid grid-cols-2 gap-3.5 border-y border-slate-800 py-4 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400 text-[9px] uppercase font-mono block">YOY Appreciation</span>
                  <div className="text-lg font-black text-emerald-400 font-mono flex items-center gap-0.5">
                    +{hoveredHotspot.appreciation}%
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 text-[9px] uppercase font-mono block">Development Index</span>
                  <div className="text-lg font-black text-amber-400 font-mono">
                    {hoveredHotspot.devIndex} <span className="text-[10px] text-slate-500">/100</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 text-[9px] uppercase font-mono block">Sourcing Ji-Score</span>
                  <div className="text-lg font-black text-red-400 font-mono">
                    ⭐ {hoveredHotspot.jiScore}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 text-[9px] uppercase font-mono block">Avg Base Capital</span>
                  <div className="text-lg font-black text-slate-100 font-mono">
                    ₹{(hoveredHotspot.avgPriceSqft).toLocaleString('en-IN')}<span className="text-[9px] text-slate-500">/sf</span>
                  </div>
                </div>
              </div>

              {/* Sourcing Infrastructure driver */}
              <div className="space-y-2 text-xs">
                <span className="text-slate-400 text-[9px] uppercase font-mono block">Key Infrastructure Drivers</span>
                <p className="text-slate-200 leading-relaxed font-semibold">
                  {hoveredHotspot.drivers}
                </p>
              </div>

              {/* Best fit asset division */}
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 flex items-center justify-between text-[11px] font-bold">
                <span className="text-slate-400">Best Asset Fit:</span>
                <span className="text-red-400 uppercase tracking-wide font-mono bg-red-950/40 px-2.5 py-1 border border-red-900/50 rounded-md">
                  {hoveredHotspot.bestClass}
                </span>
              </div>

            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-10 text-center text-xs text-slate-500 font-bold space-y-2">
              <Layers className="w-8 h-8 text-slate-350 mx-auto" />
              <div>Hover over any heatmap block on the left to activate smart projections.</div>
            </div>
          )}

          {/* Active listings shortcut */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3.5">
            <h5 className="text-xs font-extrabold text-slate-900 flex items-center justify-between">
              <span>Secure Listings In {selectedCity}</span>
              <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-mono font-bold">
                {propertiesMatchingCity.length} Listed
              </span>
            </h5>

            <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
              {propertiesMatchingCity.length === 0 ? (
                <div className="text-[10px] text-slate-405 font-semibold py-3 text-center bg-slate-50 border border-dashed border-slate-200 rounded-lg">
                  No active direct listings available in this specific micro-market. Deploy assets via Admin Panel!
                </div>
              ) : (
                propertiesMatchingCity.map(p => (
                  <div 
                    key={p.id} 
                    onClick={() => {
                      onSelectProperty(p);
                      onNavigateToTab('properties');
                    }}
                    className="p-2.5 bg-slate-50/50 border border-slate-200 rounded-xl hover:border-red-400 flex items-center justify-between gap-3 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <img src={p.image} className="w-7 h-7 object-cover rounded-lg border border-slate-150" alt="" referrerPolicy="no-referrer" />
                      <span className="text-slate-800 truncate block text-[11px]">{p.title}</span>
                    </div>
                    <span className="text-red-655 font-mono text-[10px] whitespace-nowrap">₹{p.minInvestment}L+</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
