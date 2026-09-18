// ALI – Customer Intelligence Platform
// Fictional / simulated B2B digital learning product environment (inspired by Udemy Business).
// Raw facts are seeded; all "intelligence" (health, risk, opportunity, readiness, actions)
// is DERIVED from the raw facts below — never hardcoded into the raw seed.

export const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
export const YEAR = 2025;
export const REFERENCE_DATE = new Date(2025, 11, 15); // "today" for this simulated world

export const PRODUCTS = [
  "LearnHub Pro",
  "SkillMetrics Analytics",
  "Certify+",
  "TeamCoach",
];

export const FEATURE_NAMES = [
  "Course Assignments",
  "Learning Paths",
  "Skill Assessments",
  "Certification Prep",
  "Mobile Learning",
  "Analytics & Reporting",
  "Content Curation",
  "Live Workshops",
];

export const SEGMENTS = ["Enterprise", "Mid-Market", "SMB"];
export const HEALTH_STATUSES = ["Healthy", "Monitor", "At Risk"];
export const OPPORTUNITY_TYPES = ["Upsell", "Cross-sell", "License Expansion", "Whitespace"];
export const RENEWAL_BUCKETS = ["0–30 days", "31–90 days", "91–180 days", "180+ days"];

// ---------- deterministic RNG ----------
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const round = (n, dp = 0) => { const p = 10 ** dp; return Math.round(n * p) / p; };

const NAMES = [
  "Northwind Systems", "Vertex Financial", "BlueOak Health", "Meridian Retail",
  "Summit Manufacturing", "Cascade Media", "Lumen Education", "Ironclad Energy",
  "Pinnacle Software", "Cobalt Logistics", "Evergreen Bank", "Harbor Diagnostics",
  "Quantum Robotics", "Solstice Apparel", "Atlas Freight", "Nimbus Cloud",
  "Beacon Insurance", "Cedar Foods", "Orbit Telecom", "Halcyon Pharma",
  "Terra Agritech", "Vantage Consulting", "Zephyr Airlines", "Onyx Security",
];
const INDUSTRIES = [
  "Technology", "Financial Services", "Healthcare", "Retail", "Manufacturing",
  "Media", "Education", "Energy", "Logistics", "Insurance", "Pharma", "Telecom",
];
const REGIONS = ["North America", "EMEA", "APAC", "LATAM"];
const PLANS = { top: "Enterprise", mid: "Growth", low: "Team" };

// archetypes define the "shape" of raw behaviour, producing realistic variation
const ARCHETYPES = [
  { key: "at_risk_declining", usage: [-26, -12], au: [-20, -8], util: [38, 52], adopt: [28, 46], eng: [-30, -12], tkGrowth: [22, 62], openRate: [40, 66], crit: [2, 5], renewal: [12, 58] },
  { key: "monitor_lowadopt", usage: [-6, 4], au: [-5, 5], util: [50, 64], adopt: [38, 55], eng: [-8, 6], tkGrowth: [-8, 22], openRate: [24, 46], crit: [0, 2], renewal: [78, 168] },
  { key: "healthy_stable", usage: [0, 9], au: [0, 7], util: [64, 78], adopt: [58, 72], eng: [0, 11], tkGrowth: [-22, 6], openRate: [8, 26], crit: [0, 1], renewal: [180, 330] },
  { key: "healthy_growing", usage: [11, 29], au: [8, 23], util: [78, 92], adopt: [66, 84], eng: [8, 26], tkGrowth: [-24, 2], openRate: [6, 20], crit: [0, 1], renewal: [110, 260] },
  { key: "high_util_expansion", usage: [6, 19], au: [5, 16], util: [90, 99], adopt: [64, 80], eng: [5, 18], tkGrowth: [-14, 8], openRate: [8, 24], crit: [0, 2], renewal: [45, 150] },
  { key: "whitespace", usage: [2, 11], au: [1, 9], util: [56, 70], adopt: [50, 66], eng: [0, 11], tkGrowth: [-10, 12], openRate: [12, 30], crit: [0, 1], renewal: [190, 340] },
];

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function buildCustomer(i) {
  const rng = mulberry32(1000 + i * 97);
  const rand = (lo, hi) => lo + (hi - lo) * rng();
  const arch = ARCHETYPES[i % ARCHETYPES.length];

  const name = NAMES[i];
  const id = "C" + String(1001 + i);
  const segment = i % 3 === 0 ? "Enterprise" : i % 3 === 1 ? "Mid-Market" : "SMB";
  const industry = INDUSTRIES[i % INDUSTRIES.length];
  const region = REGIONS[i % REGIONS.length];

  // ---- RAW licensing / commercial facts ----
  const purchasedLicenses =
    segment === "Enterprise" ? round(rand(800, 2400)) :
    segment === "Mid-Market" ? round(rand(220, 700)) :
    round(rand(50, 190));
  const licenseUtilization = round(rand(arch.util[0], arch.util[1]), 1);
  const activeLicenses = round(purchasedLicenses * licenseUtilization / 100);
  const assignedLicenses = round(clamp(activeLicenses + purchasedLicenses * rand(0.03, 0.14), activeLicenses, purchasedLicenses));
  const totalUsers = purchasedLicenses;
  const activeUsers = activeLicenses;

  const pricePerLicense =
    segment === "Enterprise" ? round(rand(180, 320)) :
    segment === "Mid-Market" ? round(rand(140, 260)) :
    round(rand(90, 180));
  const arr = round(purchasedLicenses * pricePerLicense);

  // products owned
  let owned;
  if (arch.key === "whitespace") owned = [PRODUCTS[0]];
  else if (arch.key === "healthy_growing" || arch.key === "high_util_expansion") owned = PRODUCTS.slice(0, 2 + (rng() > 0.5 ? 1 : 0));
  else owned = PRODUCTS.slice(0, 1 + (rng() > 0.55 ? 1 : 0));
  const primaryProduct = owned[0];
  const plan = arch.key.startsWith("healthy") ? PLANS.top : arch.key === "high_util_expansion" ? PLANS.mid : (segment === "SMB" ? PLANS.low : PLANS.mid);

  // ---- RAW behavioural signals ----
  const usageGrowth = round(rand(arch.usage[0], arch.usage[1]), 1);
  const activeUserGrowth = round(rand(arch.au[0], arch.au[1]), 1);
  const engagementChange = round(rand(arch.eng[0], arch.eng[1]), 1);
  const licenseUtilizationChange = round(usageGrowth / 4 + rand(-2, 2), 1);

  const daysToRenewal = round(rand(arch.renewal[0], arch.renewal[1]));
  const renewalDate = addDays(REFERENCE_DATE, daysToRenewal);
  const contractStart = addDays(renewalDate, -365);

  // ---- RAW monthly usage series (Jan–Dec 2025) ----
  const slope = usageGrowth / 100 / 3; // gentle monthly growth factor
  const baseUsage = activeUsers * rand(9, 16);
  const startUsage = baseUsage / (1 + slope * 11);
  const monthly = MONTHS.map((m, idx) => {
    const noise = 1 + (rng() - 0.5) * 0.06;
    const usageVolume = round(startUsage * (1 + slope * idx) * noise);
    const au = round(clamp(activeUsers * (1 - (usageGrowth / 100) * (11 - idx) / 11) * noise, 5, totalUsers));
    return { month: m, usageVolume, activeUsers: au };
  });
  const currentUsage = monthly[11].usageVolume;
  const activeUserPct = round(activeUsers / totalUsers * 100, 1);

  // ---- RAW features ----
  const features = FEATURE_NAMES.map((fn, fi) => {
    const frng = mulberry32(5000 + i * 53 + fi * 7);
    const eligibleUsers = round(totalUsers * (0.7 + frng() * 0.3));
    const baseAdopt = clamp(rand(arch.adopt[0], arch.adopt[1]) + (frng() - 0.5) * 24, 12, 96);
    const adoptionPct = round(baseAdopt, 1);
    const adopters = round(eligibleUsers * adoptionPct / 100);
    const prevAdoptionPct = round(clamp(adoptionPct - usageGrowth * 0.25 + (frng() - 0.5) * 6, 5, 98), 1);
    const adoptionChange = round(adoptionPct - prevAdoptionPct, 1);
    const benchmark = [70, 65, 55, 50, 60, 58, 52, 40][fi];
    const gap = round(Math.max(0, benchmark - adoptionPct), 1);
    const featUsage = round(adopters * (8 + frng() * 20));
    return { name: fn, eligibleUsers, adopters, adoptionPct, prevAdoptionPct, adoptionChange, benchmark, gap, usageVolume: featUsage };
  });
  const featureAdoption = round(features.reduce((s, f) => s + f.adoptionPct, 0) / features.length, 1);
  const featuresUsed = features.filter((f) => f.adoptionPct >= 30).length;

  // ---- RAW support / engagement ----
  const prevTickets = round(rand(6, 40));
  const ticketGrowth = round(rand(arch.tkGrowth[0], arch.tkGrowth[1]), 1);
  const currentTickets = round(prevTickets * (1 + ticketGrowth / 100));
  const openTicketRate = round(rand(arch.openRate[0], arch.openRate[1]), 1);
  const totalTickets = currentTickets;
  const openTickets = round(totalTickets * openTicketRate / 100);
  const criticalTickets = round(rand(arch.crit[0], arch.crit[1]));
  const avgResolutionDays = round(rand(1.2, 6.5), 1);
  const supportTrend = MONTHS.slice(6).map((m, idx) => ({
    month: m,
    tickets: round(clamp(prevTickets * (1 + (ticketGrowth / 100) * idx / 5) + (rng() - 0.5) * 6, 0, 200)),
  }));
  const lastActivityDays = arch.key === "at_risk_declining" ? round(rand(9, 28)) : round(rand(0, 6));
  const usageDays = round(clamp(30 - lastActivityDays - rand(0, 4), 4, 30));
  const usageFrequency = round(clamp((usageDays / 30) * 7, 0.5, 6.5), 1);

  const mau = activeUsers;
  const wau = round(mau * rand(0.55, 0.72));
  const dau = round(wau * rand(0.34, 0.5));

  // ============= DERIVED INTELLIGENCE =============
  const map = (v, lo, hi) => clamp(((v - lo) / (hi - lo)) * 100, 0, 100);
  const usageScore = map(usageGrowth, -30, 30);
  const auScore = map(activeUserGrowth, -30, 30);
  const utilScore = clamp(licenseUtilization, 0, 100);
  const adoptScore = featureAdoption;
  const engScore = map(engagementChange, -40, 40);
  const supportScore = clamp(100 - openTicketRate - ticketGrowth * 0.4 - criticalTickets * 5, 0, 100);
  const healthScore = round(
    usageScore * 0.22 + auScore * 0.14 + utilScore * 0.18 +
    adoptScore * 0.16 + engScore * 0.15 + supportScore * 0.15
  );
  const healthStatus = healthScore >= 72 ? "Healthy" : healthScore >= 55 ? "Monitor" : "At Risk";

  // monthly health trend ending at healthScore
  const hSlope = clamp(usageGrowth / 8, -3.5, 3.5);
  const hStart = clamp(healthScore - hSlope * 11, 15, 99);
  const healthTrend = MONTHS.map((m, idx) => ({
    month: m,
    health: idx === 11 ? healthScore : round(clamp(hStart + hSlope * idx + (rng() - 0.5) * 4, 10, 99)),
  }));
  const healthPrev = healthTrend[10].health;
  const healthChange = round(healthScore - healthPrev);

  const churnRisk = healthScore < 55 ? "High" : healthScore < 72 ? "Medium" : "Low";
  const renewalUrgency = daysToRenewal <= 30 ? 1 : daysToRenewal <= 90 ? 0.85 : daysToRenewal <= 180 ? 0.55 : 0.3;
  const riskBase = clamp((80 - healthScore) / 80, 0, 1);
  const revenueAtRisk = round(arr * riskBase * renewalUrgency);
  const renewalRisk = healthStatus === "At Risk" ? "High" : (healthStatus === "Monitor" && daysToRenewal <= 90) ? "Medium" : healthStatus === "Monitor" ? "Low" : "Low";
  const riskPriority =
    healthStatus === "At Risk" && daysToRenewal <= 90 ? "High" :
    healthStatus === "At Risk" ? "High" :
    healthStatus === "Monitor" && daysToRenewal <= 90 ? "Medium" :
    healthStatus === "Monitor" ? "Low" : "Low";

  // adoption stage (derived)
  const adoptionStage =
    featureAdoption >= 70 && licenseUtilization >= 75 ? "Power User" :
    featureAdoption >= 55 ? "Established" :
    featureAdoption >= 40 ? "Growing" : "Onboarding";

  // ---- health drivers ----
  const dir = (v) => (v > 1 ? "up" : v < -1 ? "down" : "flat");
  const contribTone = (good) => (good ? "positive" : "negative");
  const healthDrivers = [
    { name: "Product Usage", value: `${usageGrowth > 0 ? "+" : ""}${usageGrowth}%`, change: usageGrowth, direction: dir(usageGrowth), contribution: contribTone(usageGrowth >= 0) },
    { name: "Feature Adoption", value: `${featureAdoption}%`, change: round(featureAdoption - 60), direction: dir(featureAdoption - 60), contribution: contribTone(featureAdoption >= 55) },
    { name: "License Utilization", value: `${licenseUtilization}%`, change: licenseUtilizationChange, direction: dir(licenseUtilizationChange), contribution: contribTone(licenseUtilization >= 65) },
    { name: "Engagement", value: `${engagementChange > 0 ? "+" : ""}${engagementChange}%`, change: engagementChange, direction: dir(engagementChange), contribution: contribTone(engagementChange >= 0) },
    { name: "Support Friction", value: `${ticketGrowth > 0 ? "+" : ""}${ticketGrowth}% tickets`, change: -ticketGrowth, direction: dir(-ticketGrowth), contribution: contribTone(ticketGrowth <= 10 && openTicketRate < 40) },
    { name: "Renewal Proximity", value: `${daysToRenewal} days`, change: 0, direction: "flat", contribution: daysToRenewal <= 90 ? "negative" : "neutral" },
  ];

  // ---- risk narrative + evidence ----
  const riskEvidence = [
    { label: "Usage Growth", value: `${usageGrowth > 0 ? "+" : ""}${usageGrowth}%`, tone: usageGrowth >= 0 ? "positive" : "negative" },
    { label: "Active User Growth", value: `${activeUserGrowth > 0 ? "+" : ""}${activeUserGrowth}%`, tone: activeUserGrowth >= 0 ? "positive" : "negative" },
    { label: "License Utilization", value: `${licenseUtilization}%`, tone: licenseUtilization >= 65 ? "positive" : "negative" },
    { label: "Feature Adoption", value: `${featureAdoption}%`, tone: featureAdoption >= 55 ? "positive" : "negative" },
    { label: "Support Tickets", value: `${ticketGrowth > 0 ? "+" : ""}${ticketGrowth}%`, tone: ticketGrowth <= 10 ? "positive" : "negative" },
    { label: "Days to Renewal", value: `${daysToRenewal}`, tone: daysToRenewal <= 90 ? "negative" : "neutral" },
  ];
  const hasRisk = healthStatus !== "Healthy";
  const riskSummary =
    healthStatus === "At Risk" ? "Customer may be at renewal risk" :
    healthStatus === "Monitor" ? "Customer needs monitoring ahead of renewal" :
    "No active retention risk";
  const riskWhy = hasRisk
    ? `Product usage ${usageGrowth < 0 ? "has declined" : "is stalling"} and license utilization is ${licenseUtilization}% while renewal is ${daysToRenewal <= 90 ? "approaching" : "on the horizon"}.`
    : "Usage, adoption and engagement are trending positively with no renewal pressure.";

  // ---- opportunities (derived) ----
  const opportunities = [];
  const pushOpp = (o) => opportunities.push({ id: `${id}-OPP${opportunities.length + 1}`, ...o });

  if (licenseUtilization >= 82) {
    const additional = round(purchasedLicenses * (licenseUtilization >= 92 ? 0.25 : 0.15));
    const value = round(additional * pricePerLicense);
    pushOpp({
      type: "License Expansion", opportunity: `Add ~${additional} licenses`,
      currentState: `${licenseUtilization}% utilized (${activeLicenses}/${purchasedLicenses})`,
      readiness: licenseUtilization >= 92 && healthScore >= 70 ? "High" : "Medium",
      value,
      reason: "Customer is approaching full license utilization.",
      why: `Active licenses have grown to ${licenseUtilization}% of purchased capacity, indicating demand for additional seats.`,
      evidence: [
        { label: "Purchased Licenses", value: `${purchasedLicenses}` },
        { label: "Active Licenses", value: `${activeLicenses}` },
        { label: "Utilization", value: `${licenseUtilization}%` },
        { label: "Active User Growth", value: `${activeUserGrowth > 0 ? "+" : ""}${activeUserGrowth}%` },
      ],
      priority: licenseUtilization >= 92 ? "High" : "Medium",
      recommendedAction: "Discuss additional license bundle before renewal.",
    });
  }
  if (healthScore >= 72 && usageGrowth > 6 && plan !== PLANS.top) {
    const value = round(arr * 0.28);
    pushOpp({
      type: "Upsell", opportunity: `Upgrade ${plan} → Enterprise plan`,
      currentState: `On ${plan} plan with strong usage`,
      readiness: healthScore >= 82 ? "High" : "Medium", value,
      reason: "Healthy account with rising usage on a mid-tier plan.",
      why: `Usage is up ${usageGrowth}% with adoption at ${featureAdoption}%, exceeding the current plan's typical profile.`,
      evidence: [
        { label: "Health Score", value: `${healthScore}` },
        { label: "Usage Growth", value: `+${usageGrowth}%` },
        { label: "Feature Adoption", value: `${featureAdoption}%` },
        { label: "Current Plan", value: plan },
      ],
      priority: healthScore >= 82 ? "High" : "Medium",
      recommendedAction: "Review plan upgrade aligned to expanded usage.",
    });
  }
  if (healthScore >= 68 && owned.length < 3) {
    const candidate = PRODUCTS.find((p) => !owned.includes(p));
    if (candidate) {
      const value = round(arr * 0.4);
      pushOpp({
        type: "Cross-sell", opportunity: `Introduce ${candidate}`,
        currentState: `Uses ${owned.join(", ")}`,
        readiness: healthScore >= 80 ? "High" : "Medium", value,
        reason: "Healthy account not yet using a complementary product.",
        why: `Strong adoption of ${primaryProduct} signals fit for ${candidate}.`,
        evidence: [
          { label: "Products Owned", value: `${owned.length}` },
          { label: "Health Score", value: `${healthScore}` },
          { label: "Feature Adoption", value: `${featureAdoption}%` },
        ],
        priority: healthScore >= 80 ? "Medium" : "Low",
        recommendedAction: `Introduce ${candidate} to the account team.`,
      });
    }
  }
  if (owned.length === 1 && healthScore >= 60 && arch.key === "whitespace") {
    const value = round(arr * 0.5);
    pushOpp({
      type: "Whitespace", opportunity: "Expand into untapped teams",
      currentState: `Single product, ${licenseUtilization}% utilized`,
      readiness: "Medium", value,
      reason: "Large user base with adoption concentrated in few teams.",
      why: `Only ${activeLicenses} of ${totalUsers} users are active — significant untapped whitespace across the organization.`,
      evidence: [
        { label: "Total Users", value: `${totalUsers}` },
        { label: "Active Users", value: `${activeUsers}` },
        { label: "Utilization", value: `${licenseUtilization}%` },
      ],
      priority: "Medium",
      recommendedAction: "Explore whitespace opportunity with a departmental rollout plan.",
    });
  }
  const opportunityValue = round(opportunities.reduce((s, o) => s + o.value, 0));
  const expansionReadiness = opportunities.length
    ? (opportunities.some((o) => o.readiness === "High") ? "High" : opportunities.some((o) => o.readiness === "Medium") ? "Medium" : "Low")
    : "Low";

  // ---- adoption gaps ----
  const adoptionGaps = features.filter((f) => f.gap > 0).sort((a, b) => b.gap - a.gap);

  // ---- usage anomalies ----
  const anomalies = [];
  if (usageGrowth <= -12) anomalies.push({ signal: "Usage drop", metric: "Usage Volume", currentValue: `${currentUsage.toLocaleString()}`, baseline: `${monthly[8].usageVolume.toLocaleString()}`, change: `${usageGrowth}%`, period: "Last 3 months", impact: "High" });
  if (activeUserGrowth <= -10) anomalies.push({ signal: "Active-user drop", metric: "Active Users", currentValue: `${activeUsers}`, baseline: `${round(activeUsers / (1 + activeUserGrowth / 100))}`, change: `${activeUserGrowth}%`, period: "Last 3 months", impact: "High" });
  if (usageGrowth >= 18) anomalies.push({ signal: "Usage spike", metric: "Usage Volume", currentValue: `${currentUsage.toLocaleString()}`, baseline: `${monthly[8].usageVolume.toLocaleString()}`, change: `+${usageGrowth}%`, period: "Last 3 months", impact: "Medium" });
  const worstFeature = adoptionGaps[0];
  if (worstFeature && worstFeature.adoptionChange < -3) anomalies.push({ signal: "Feature-usage change", metric: worstFeature.name, currentValue: `${worstFeature.adoptionPct}%`, baseline: `${worstFeature.prevAdoptionPct}%`, change: `${worstFeature.adoptionChange}%`, period: "MoM", impact: "Medium" });

  // ---- recommended actions (derived) ----
  const actions = [];
  const completedFlag = () => rng() < 0.22;
  const pushAction = (a) => actions.push({ id: `${id}-A${actions.length + 1}`, customerId: id, customerName: name, status: completedFlag() ? "Completed" : "Open", ...a });

  if (healthStatus === "At Risk" || (healthStatus === "Monitor" && daysToRenewal <= 90)) {
    pushAction({
      priority: riskPriority, action: "Review renewal risk", type: daysToRenewal <= 90 ? "Renewal" : "Risk",
      reason: "Usage declining while renewal is approaching.",
      impact: revenueAtRisk, impactType: "risk",
      why: riskWhy, nextStep: "Schedule an executive check-in and share a tailored engagement plan before renewal.",
      relatedType: "risk", relatedId: id,
      evidence: riskEvidence,
    });
  }
  if (featureAdoption < 50) {
    pushAction({
      priority: featureAdoption < 40 ? "High" : "Medium", action: "Drive feature adoption", type: "Adoption",
      reason: "Key features are available but underused.",
      impact: revenueAtRisk || round(arr * 0.1), impactType: "risk",
      why: `Feature adoption is ${featureAdoption}% with the largest gap on ${worstFeature ? worstFeature.name : "core features"}.`,
      nextStep: "Run an enablement session focused on the lowest-adoption features.",
      relatedType: "adoption", relatedId: id,
      evidence: adoptionGaps.slice(0, 3).map((f) => ({ label: f.name, value: `${f.adoptionPct}% (gap ${f.gap})`, tone: "negative" })),
    });
  }
  opportunities.forEach((o) => {
    pushAction({
      priority: o.priority, action: o.recommendedAction, type: o.type,
      reason: o.reason, impact: o.value, impactType: "opportunity",
      why: o.why, nextStep: o.recommendedAction,
      relatedType: "opportunity", relatedId: o.id,
      evidence: o.evidence.map((e) => ({ ...e, tone: "neutral" })),
    });
  });

  return {
    id, name, initials: name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
    segment, industry, region,
    product: primaryProduct, products: owned, plan,
    contractStart: contractStart.toISOString(), renewalDate: renewalDate.toISOString(), daysToRenewal, arr,
    totalUsers, purchasedLicenses, assignedLicenses, activeLicenses, activeUsers, activeUserPct,
    monthly, usageVolume: currentUsage, usageGrowth, activeUserGrowth,
    licenseUtilization, licenseUtilizationChange,
    featureAdoption, features, featuresUsed, adoptionGaps,
    engagement: { usageFrequency, usageDays, featuresUsed, lastActivityDays, engagementChange },
    support: { currentTickets, prevTickets, openTickets, totalTickets, criticalTickets, ticketGrowth, openTicketRate, avgResolutionDays, trend: supportTrend },
    dau, wau, mau,
    healthScore, healthPrev, healthChange, healthStatus, healthTrend, healthDrivers,
    churnRisk, renewalRisk, revenueAtRisk, riskPriority, riskSummary, riskWhy, riskEvidence, hasRisk,
    adoptionStage,
    opportunities, opportunityValue, expansionReadiness,
    anomalies, recommendedActions: actions,
  };
}

export const customers = NAMES.map((_, i) => buildCustomer(i));
export const getCustomer = (id) => customers.find((c) => c.id === id);

// ---------- portfolio aggregates ----------
const sum = (arr, f) => arr.reduce((s, x) => s + f(x), 0);

export const portfolio = (() => {
  const total = customers.length;
  const atRisk = customers.filter((c) => c.healthStatus === "At Risk");
  const monitor = customers.filter((c) => c.healthStatus === "Monitor");
  const healthy = customers.filter((c) => c.healthStatus === "Healthy");
  const allOpps = customers.flatMap((c) => c.opportunities);
  const allActions = customers.flatMap((c) => c.recommendedActions);

  const expansionByType = OPPORTUNITY_TYPES.map((t) => {
    const items = allOpps.filter((o) => o.type === t);
    return { type: t, count: items.length, value: round(sum(items, (o) => o.value)) };
  });

  const bucketDef = [
    { label: "0–30 days", min: 0, max: 30 },
    { label: "31–90 days", min: 31, max: 90 },
    { label: "91–180 days", min: 91, max: 180 },
    { label: "180+ days", min: 181, max: 100000 },
  ];
  const revenueAtRiskByBucket = bucketDef.map((b) => {
    const items = customers.filter((c) => c.daysToRenewal >= b.min && c.daysToRenewal <= b.max);
    return {
      bucket: b.label,
      customers: items.length,
      arr: round(sum(items, (c) => c.arr)),
      revenueAtRisk: round(sum(items, (c) => c.revenueAtRisk)),
    };
  });

  // portfolio health trend (avg over customers per month)
  const healthTrend = MONTHS.map((m, idx) => ({
    month: m,
    health: round(sum(customers, (c) => c.healthTrend[idx].health) / total),
  }));

  return {
    totalCustomers: total,
    customersAtRisk: atRisk.length,
    customersMonitor: monitor.length,
    customersHealthy: healthy.length,
    revenueAtRisk: round(sum(customers, (c) => c.revenueAtRisk)),
    totalArr: round(sum(customers, (c) => c.arr)),
    totalOpportunities: allOpps.length,
    totalExpansionPotential: round(sum(allOpps, (o) => o.value)),
    aiActionsPending: allActions.filter((a) => a.status === "Open").length,
    avgHealthScore: round(sum(customers, (c) => c.healthScore) / total),
    healthChange: round(sum(customers, (c) => c.healthChange) / total, 1),
    healthDistribution: [
      { name: "Healthy", value: healthy.length },
      { name: "Monitor", value: monitor.length },
      { name: "At Risk", value: atRisk.length },
    ],
    healthTrend,
    expansionByType,
    revenueAtRiskByBucket,
    upcomingRenewals: customers.filter((c) => c.daysToRenewal <= 90).length,
    criticalTickets: round(sum(customers, (c) => c.support.criticalTickets)),
    openTicketRate: round(sum(customers, (c) => c.support.openTicketRate) / total, 1),
    ticketGrowth: round(sum(customers, (c) => c.support.ticketGrowth) / total, 1),
  };
})();

// ---------- flattened cross-screen collections ----------
export const actions = customers
  .flatMap((c) => c.recommendedActions)
  .sort((a, b) => ({ High: 0, Medium: 1, Low: 2 }[a.priority] - { High: 0, Medium: 1, Low: 2 }[b.priority]));

export const opportunities = customers.flatMap((c) =>
  c.opportunities.map((o) => ({ ...o, customerId: c.id, customerName: c.name, healthScore: c.healthScore, segment: c.segment }))
);

export const anomalies = customers.flatMap((c) =>
  c.anomalies.map((a, idx) => ({ id: `${c.id}-AN${idx}`, customerId: c.id, customerName: c.name, ...a }))
);

// portfolio-level insight feed (What / Why / Evidence)
export const insights = (() => {
  const out = [];
  customers.forEach((c) => {
    if (c.healthStatus !== "Healthy") {
      out.push({
        id: `${c.id}-INS-R`, type: "Risk", customerId: c.id, customerName: c.name,
        insight: `${c.name} ${c.usageGrowth < 0 ? "has declining usage" : "shows stalling usage"} ahead of renewal`,
        why: c.riskWhy, evidence: c.riskEvidence, priority: c.riskPriority,
      });
    }
    if (c.opportunities[0]) {
      const o = c.opportunities[0];
      out.push({
        id: `${c.id}-INS-O`, type: "Opportunity", customerId: c.id, customerName: c.name,
        insight: `${c.name}: ${o.opportunity}`, why: o.why, evidence: o.evidence.map((e) => ({ ...e, tone: "neutral" })), priority: o.priority,
      });
    }
    if (c.featureAdoption < 50) {
      out.push({
        id: `${c.id}-INS-A`, type: "Adoption", customerId: c.id, customerName: c.name,
        insight: `${c.name} has low feature adoption (${c.featureAdoption}%)`,
        why: `Several available features are underused, limiting realized value.`,
        evidence: c.adoptionGaps.slice(0, 3).map((f) => ({ label: f.name, value: `${f.adoptionPct}%`, tone: "negative" })),
        priority: c.featureAdoption < 40 ? "High" : "Medium",
      });
    }
  });
  const order = { High: 0, Medium: 1, Low: 2 };
  return out.sort((a, b) => order[a.priority] - order[b.priority]);
})();

// portfolio product usage trend (Adoption screen)
export const portfolioUsageTrend = MONTHS.map((m, idx) => {
  const usageVolume = round(sum(customers, (c) => c.monthly[idx].usageVolume));
  const activeUsers = round(sum(customers, (c) => c.monthly[idx].activeUsers));
  const prev = idx === 0 ? usageVolume : round(sum(customers, (c) => c.monthly[idx - 1].usageVolume));
  const usageGrowth = idx === 0 ? 0 : round((usageVolume - prev) / prev * 100, 1);
  const mau = activeUsers;
  const wau = round(mau * 0.63);
  const dau = round(wau * 0.42);
  return { month: m, usageVolume, activeUsers, usageGrowth, dau, wau, mau };
});

// portfolio feature adoption (Adoption screen)
export const portfolioFeatures = FEATURE_NAMES.map((fn) => {
  const rows = customers.map((c) => c.features.find((f) => f.name === fn));
  const eligibleUsers = round(sum(rows, (f) => f.eligibleUsers));
  const adopters = round(sum(rows, (f) => f.adopters));
  const adoptionPct = round(adopters / eligibleUsers * 100, 1);
  const adoptionChange = round(sum(rows, (f) => f.adoptionChange) / rows.length, 1);
  const benchmark = rows[0].benchmark;
  const gap = round(Math.max(0, benchmark - adoptionPct), 1);
  const usageVolume = round(sum(rows, (f) => f.usageVolume));
  const customersAffected = rows.filter((f) => f.gap > 0).length;
  return { feature: fn, eligibleUsers, adopters, adoptionPct, adoptionChange, benchmark, gap, usageVolume, customersAffected };
});

export const adoptionStageDistribution = ["Onboarding", "Growing", "Established", "Power User"].map((stage) => ({
  stage, count: customers.filter((c) => c.adoptionStage === stage).length,
}));

export const expansionReadinessDistribution = ["High", "Medium", "Low"].map((r) => ({
  readiness: r, count: customers.filter((c) => c.expansionReadiness === r).length,
}));
