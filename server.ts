import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Lazy-initialize Gemini client
const apiKey = process.env.GEMINI_API_KEY;
let ai: any = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini API Client initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Gemini API Client:", err);
  }
} else {
  console.log("No valid GEMINI_API_KEY detected. Dynamic offline simulation mode fallback is active.");
}

// System Prompt with context on Indian RERA, properties list and calculations
const SYSTEM_INSTRUCTION = `You are "AdvisorJi AI", the resident senior property investment analyst and RERA (Real Estate Regulatory Authority) auditor for InvestorJi.com.
Your voice is objective, highly competent, analytical, and professional. Avoid fluffy adjectives and marketing slogans.
Your target users are Indian HNIs (High Net Worth Individuals), retail investors, and NRI buyers.

You can answer queries about:
1. Real Estate Regulatory Authority (RERA) procedures, registration rules, escrow rules (e.g., UP RERA, MahaRERA, Haryana HRERA).
2. Construction and investment dynamics: Assured Returns vs Fractional Shares vs Land plots.
3. Property calculations: ROI, rental yield estimates, compounding CAGR, exit liquidity parameters, and debt-equity options.
4. Specific comparisons between properties.

When the user asks, perform precise, realistic financial calculations.
Use Indian formatting terms where appropriate (Lakhs, Crores) alongside percentages. ₹1 Crore is 100 Lakhs.

Properties directory currently on InvestorJi:
- #prop-1: The Royal Sovereign Oasis (Gurgaon, Assured Return, Min Invest: ₹75L, ROI: 14.8%, Rental Yield: 8.5%, Appr: 11.2%, Developer: DLF, RERA: RERA-HRG-2025-9832)
- #prop-2: Worli Skyline Sky-Villas (Mumbai, Fractional, Min Invest: ₹50L, ROI: 16.2%, Rental Yield: 6.2%, Appr: 13.5%, Developer: Lodha, RERA: RERA-MUM-2024-1182)
- #prop-3: Nandu Smart-Tech Logistic Warehouses (Pune, Commercial, Min Invest: ₹95L, ROI: 12.5%, Rental Yield: 9.2%, Appr: 8.5%, Developer: Embassy, RERA: RERA-PNE-2025-0921)
- #prop-4: Serene Wavefront Luxury Estates (Goa, Residential, Min Invest: ₹120L, ROI: 18.5%, Rental Yield: 7.8%, Appr: 15.0%, Developer: Goa Coastal, RERA: RERA-GOA-2025-4521)
- #prop-5: The Bengaluru Sovereign Smart-Hub (Bengaluru, Fractional, Min Invest: ₹25L, ROI: 13.9%, Rental Yield: 8.9%, Appr: 9.8%, Developer: Prestige, RERA: RERA-KA-2024-3401)
- #prop-6: Prestige Ascent High Rise (Bengaluru, Residential, Min Invest: ₹85L, ROI: 11.5%, Rental Yield: 4.5%, Appr: 9.2%, Developer: Prestige, RERA: RERA-KA-2025-1032)
- #prop-7: Bhakti Divine enclave - Gated Villa Plots (Vrindavan, Residential Land, Min Invest: ₹35L, Appr: 14.2%, Developer: Radhe Krishna, RERA: RERA-UP-VRN-2025-5591)
- #prop-8: Sovereign Galleria High-Street Shops (Faridabad, Commercial Retail, Min Invest: ₹45L, ROI: 13.5%, Rental Yield: 8.2%, Appr: 10.5%, Developer: Omaxe, RERA: RERA-HR-FRD-2025-0210)
- #prop-9: Cyber City Elite Hub (Gurgaon, Commercial Under-Cons, Min Invest: ₹90L, ROI: 15.6%, Rental Yield: 9.0%, Appr: 12.8%, Developer: M3M, RERA: RERA-HRG-2026-1049)
- #prop-10: Heritage Yamuna Expressway Township Plots (Mathura, Residential Land, Min Invest: ₹29L, Appr: 16.5%, Developer: NDA, RERA: RERA-UP-MTR-2025-1102)
- #prop-11: Noida Golden IT Square (Noida, Fractional, Min Invest: ₹40L, ROI: 14.2%, Rental Yield: 8.8%, Appr: 11.5%, Developer: Wave, RERA: RERA-UP-NDA-2024-9981)
- #prop-12: Connaught Royal Business Plaza (Delhi, Assured Return Retail, Min Invest: ₹110L, ROI: 15.1%, Rental Yield: 9.5%, Appr: 10.2%, Developer: Delhi Construction, RERA: RERA-DL-CP-2025-4410)

Keep responses concise, clear, beautifully styled with simple Markdown where appropriate. Avoid referencing internal database paths. Address the user directly and professionally.`;

// 1. HEALTH AND API STATUS CHECK
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    geminiConfigured: !!ai,
    timestamp: new Date().toISOString()
  });
});

// 2. CONTEXT-AWARE AI CHATBOT ROUTE
app.post("/api/gemini/chat", async (req, res) => {
  const { message, history = [], userPropertiesContext = "" } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message parameter is required." });
  }

  // Fallback simulator if apiKey is missing
  if (!ai) {
    console.log("Executing offline fallback simulation chat response.");
    const query = message.toLowerCase();
    let reply = "";

    if (query.includes("rera") || query.includes("regulatory") || query.includes("legal")) {
      reply = `### RERA Compliance & Security Parameters

All properties listed on **InvestorJi.com** are 100% verified against respective State Real Estate Regulatory Authority (RERA) indices. Under the RERA Act, developers must comply with the following structural rules:
1. **70% Escrow Rule**: Developers must deposit 70% of buyer receivables into a dedicated escrow account solely for land acquisition and construction.
2. **Standard Carpet Area**: Quoting prices based on super built-up areas is illegal; sales must proceed strictly on carpet area standards.
3. **Interest on Delays**: Any delay in possession mandates that developers pay interest to buyers similar to their lending rate (generally SBI MCLR + 2%).

For verification, you can inspect actual registered indices:
- Gurgaon DLF Oasis: **RERA-HRG-2025-9832**
- Worli Skyline Villas: **RERA-MUM-2024-1182**
- Yamuna Expressway Plots (Mathura): **RERA-UP-MTR-2025-1102**

Would you like to calculate specific risk-adjusted yields on any of these assets?`;
    } else if (query.includes("roi") || query.includes("calculate") || query.includes("yield") || query.includes("return") || query.includes("math")) {
      reply = `### Sourcing Yield & Investment Calculations

Let's break down the comparative compounding yield structure for your selected tier:
- **Commercial Pre-Leased Retail (e.g., Connaught Royal Plaza)**: Standard yield sits at **9.5%**, showing consistent 15% rent escalations indexed every 3 years. Average total ROI projection is **15.1%** including steady capital appreciation.
- **Fractional Shares (e.g., Worli Sky-Villas)**: Lower starting yield of **6.2%** but exceptional YOY capital appreciation of **13.5%**, yielding an aggregate compound CAGR pattern of **16.2%**.
- **Freehold Land Plots (e.g., Vrindavan Plots)**: Zero immediate rental yield, but land appreciation on the transit corridor is projected at a staggering **14.2% - 16.5% YOY** based on 2026 infrastructure indexes.

**Example Multi-Asset Calculation (INR 1 Crore Capital):**
- ₹50L routed to **Connaught Royal Return (9.5%)** generates **₹4.75 Lakhs** passive rental annually.
- ₹50L routed to **Yamuna Expressway Plots (16.5% appreciation)** yields **₹8.25 Lakhs** in unrealized growth in year one.
- **Combined blended ROI**: **₹13.0 Lakhs or 13.0% yield** in year one alone.

Choose a property from the Catalog or your **Investor Portfolio** to overlay actual cost structures!`;
    } else if (query.includes("portfolio") || query.includes("favour") || query.includes("favor") || query.includes("compare")) {
      reply = `### Portfolio Yield Aggregation & Sourcing Advice

In your **Investor Portfolio** tab, you have instant access to real-time aggregations of all your favorited or selected comparative matching items.
The dashboard automates:
1. **Weighted Asset Appreciations**: Weights each asset's CAGR projection by your capital allocation size.
2. **Gross Rental Cashflows**: Computes immediate monthly and annual disbursements post-escrow.
3. **Acquisition Capital Outlay**: Provides stamp duty (6%) and registration fee (1% to 2%) assessments.

If you have specific holdings or custom allocations in mind, let me know and we will formulate an institutional prospectus!`;
    } else {
      reply = `### Namaste! Welcome to AdvisorJi Sourcing Desk.

I am your active investment AI, loaded with 2026 Indian micro-market indexing and RERA parameters. 
I am currently monitoring your selections on the dashboard to provide context-aware feedback.

Based on our active catalog, here's what investors are prioritizing today:
1. **Premium Assured Yields**: DLF Sovereign Oasis in Sector 54, Gurgaon offering a solid **14.8% Projected ROI**.
2. **Transit Corridor Plots**: Vrindavan gated township plots and Mathura Yamuna Expressway land parcels showing over **15% YOY appreciation**.
3. **Grade-A Logistics**: Embassy smart logistic warehouses in Chakan, Pune offering immediate **9.2% rent yields** backed by inflation guards.

How can I assist your real estate capital deployment strategy today? Ask me about specific calculations, lease metrics, or RERA registries!`;
    }

    return res.json({ reply });
  }

  // If Gemini client IS available
  try {
    const chatHistoryParts = history.slice(-6).map((h: any) => {
      return {
        role: h.sender === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }]
      };
    });

    const contextPart = {
      text: `User Current Workspace State / Context: ${userPropertiesContext}\nLatest User prompt: ${message}`
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        ...chatHistoryParts,
        { role: 'user', parts: [contextPart] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    res.json({ reply: response.text });
  } catch (err: any) {
    console.error("Gemini API stream generation failed:", err);
    res.status(500).json({ error: "Failed to communicate with AdvisorJi AI.", details: err.message });
  }
});

// START EXPRESS/VITE INTEGRATION
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Vite Developer server mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite developer middleware mounted successfully.");
  } else {
    // Serve production static build
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`InvestorJi Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
