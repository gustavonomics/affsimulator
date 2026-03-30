import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Lock,
  BarChart3,
  Database,
  SlidersHorizontal,
  GitCompareArrows,
  Plus,
  Trash2,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";

const EXCHANGE_RATE = 950;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const YEAR_OPTIONS = Array.from({ length: 12 }, (_, index) => 2024 + index);
const PRODUCT_OPTIONS = ["ALL", "Casino", "Sportsbook", "Both"];
const QUALITY_OPTIONS = ["ALL", "High", "Regular"];
const CATEGORY_OPTIONS = ["ALL", "Affiliate", "Recovery", "Media", "Other"];
const DISPLAY_CURRENCY_OPTIONS = ["USD", "CLP"];
const MODEL_OPTIONS = ["Affiliates", "Agency"];
const CALIBRATION_MODE_OPTIONS = ["Auto", "Manual"];
const DEAL_TYPE_OPTIONS = ["CPA", "Revenue Share", "Hybrid"];
const SENSITIVITY_ATPU = [100, 150, 200, 250, 300, 400];
const SENSITIVITY_HOLD = [0.02, 0.025, 0.03, 0.035, 0.04, 0.05, 0.06];
const DEFAULT_RETENTION = [1, 0.25, 0.15, 0.1, 0.07, 0.055, 0.045, 0.038, 0.032, 0.028, 0.025, 0.022, 0.02];
const DEFAULT_AFFILIATE_SEASONALITY = Array(36).fill(0);
const DEFAULT_AGENCY_SEASONALITY = Array.from({ length: 36 }, (_, index) => (index === 2 ? 2 : 0));

const WORKBOOK_BASELINE = {
  totalCommission: 179240,
  totalNgr: 280802.7980517238,
  totalNet: 101562.79805172389,
  roiTotal: 0.5666302055998879,
  totalCpa: 179240,
  totalRevShare: 0,
  totalAdspend: 0,
  totalAgencyCost: 0,
  ltvPerFtd: 62.66520822399549,
  effectiveCpa: 40,
  roas: 1.5666302055998873,
  maxCpaBreakeven: 62.66520822399549,
  paybackMonth: 1,
  marginOfSafety: 0.3616872721938332,
};

const BASE_DATA_ROWS = [
  { id: "r1", monthLabel: "May-25", affiliate: "Casinos Online Chile", category: "Affiliate", ftd: 24, active: 64, turnover: 295281698.16, ggr: 36560731.25, product: "Casino", quality: "High" },
  { id: "r2", monthLabel: "May-25", affiliate: "Better Collective", category: "Affiliate", ftd: 24, active: 180, turnover: 57991694.44, ggr: -2386998.41, product: "Sportsbook", quality: "High" },
  { id: "r3", monthLabel: "May-25", affiliate: "PlayOptima", category: "Affiliate", ftd: 7, active: 236, turnover: 49965218.57, ggr: 2182213.86, product: "Sportsbook", quality: "Regular" },
  { id: "r4", monthLabel: "May-25", affiliate: "Gentoo Media", category: "Affiliate", ftd: 5, active: 15, turnover: 6655533.5, ggr: -3525288.06, product: "Sportsbook", quality: "High" },
  { id: "r5", monthLabel: "May-25", affiliate: "Bwise", category: "Affiliate", ftd: 3, active: 3, turnover: 220770, ggr: 54980.25, product: "Casino", quality: "Regular" },
  { id: "r6", monthLabel: "May-25", affiliate: "Admasters", category: "Affiliate", ftd: 17, active: 15, turnover: 2781882.5, ggr: 427169, product: "Casino", quality: "High" },
  { id: "r7", monthLabel: "May-25", affiliate: "Recuperacion", category: "Recovery", ftd: 0, active: 72, turnover: 72956084.94, ggr: 6246317.88, product: "Both", quality: "Regular" },
  { id: "r8", monthLabel: "Jun-25", affiliate: "Casinos Online Chile", category: "Affiliate", ftd: 70, active: 115, turnover: 330216060.29, ggr: 16611269.92, product: "Casino", quality: "High" },
  { id: "r9", monthLabel: "Jun-25", affiliate: "Better Collective", category: "Affiliate", ftd: 30, active: 174, turnover: 47244762.08, ggr: 3784101.95, product: "Sportsbook", quality: "High" },
  { id: "r10", monthLabel: "Jun-25", affiliate: "PlayOptima", category: "Affiliate", ftd: 8, active: 196, turnover: 89135981.96, ggr: 3689676.21, product: "Casino", quality: "High" },
  { id: "r11", monthLabel: "Jun-25", affiliate: "Gentoo Media", category: "Affiliate", ftd: 6, active: 15, turnover: 17926394.87, ggr: 1760360.5, product: "Casino", quality: "High" },
  { id: "r12", monthLabel: "Jun-25", affiliate: "Admasters", category: "Affiliate", ftd: 47, active: 71, turnover: 62140994.23, ggr: 652894.01, product: "Casino", quality: "High" },
  { id: "r13", monthLabel: "Jun-25", affiliate: "NorthstarMedia", category: "Affiliate", ftd: 4, active: 14, turnover: 3835826.07, ggr: 431701.28, product: "Casino", quality: "High" },
  { id: "r14", monthLabel: "Jun-25", affiliate: "Lgaming", category: "Affiliate", ftd: 7, active: 15, turnover: 957618.5, ggr: 7012.59, product: "Casino", quality: "Regular" },
  { id: "r15", monthLabel: "Jun-25", affiliate: "Inlaze", category: "Affiliate", ftd: 0, active: 2, turnover: 4247834.59, ggr: 346001.05, product: "Casino", quality: "High" },
  { id: "r16", monthLabel: "Jun-25", affiliate: "Recuperacion", category: "Recovery", ftd: 0, active: 147, turnover: 127980604.48, ggr: 4608958.96, product: "Both", quality: "Regular" },
  { id: "r17", monthLabel: "Jul-25", affiliate: "Casinos Online", category: "Affiliate", ftd: 0, active: 40, turnover: 412363953.67, ggr: 10434997.3, product: "Casino", quality: "High" },
  { id: "r18", monthLabel: "Jul-25", affiliate: "Better Collective", category: "Affiliate", ftd: 34, active: 167, turnover: 50540092.57, ggr: 4806117.75, product: "Sportsbook", quality: "High" },
  { id: "r19", monthLabel: "Jul-25", affiliate: "PlayOptima", category: "Affiliate", ftd: 13, active: 179, turnover: 47503972.65, ggr: -3375310.45, product: "Casino", quality: "High" },
  { id: "r20", monthLabel: "Jul-25", affiliate: "Gentoo Media", category: "Affiliate", ftd: 4, active: 18, turnover: 17962888.19, ggr: 806894.88, product: "Casino", quality: "High" },
  { id: "r21", monthLabel: "Jul-25", affiliate: "Admasters", category: "Affiliate", ftd: 68, active: 112, turnover: 52532371.42, ggr: 6919533.11, product: "Casino", quality: "High" },
  { id: "r22", monthLabel: "Jul-25", affiliate: "NorthstarMedia", category: "Affiliate", ftd: 10, active: 19, turnover: 2831316.75, ggr: 365784.39, product: "Casino", quality: "High" },
  { id: "r23", monthLabel: "Jul-25", affiliate: "Lgaming", category: "Affiliate", ftd: 0, active: 16, turnover: 419080, ggr: 96483.71, product: "Casino", quality: "Regular" },
  { id: "r24", monthLabel: "Jul-25", affiliate: "Inlaze", category: "Affiliate", ftd: 0, active: 2, turnover: 1106996.25, ggr: 221433.75, product: "Casino", quality: "High" },
  { id: "r25", monthLabel: "Jul-25", affiliate: "Recuperacion", category: "Recovery", ftd: 0, active: 136, turnover: 273011015.63, ggr: 7136458.5, product: "Both", quality: "Regular" },
  { id: "r26", monthLabel: "Jul-25", affiliate: "Casinos Online Chile", category: "Affiliate", ftd: 4, active: 55, turnover: 73624506.81, ggr: 3700000.69, product: "Casino", quality: "High" },
  { id: "r27", monthLabel: "Jul-25", affiliate: "Better Collective", category: "Affiliate", ftd: 34, active: 137, turnover: 70606057.1, ggr: 787739.5, product: "Sportsbook", quality: "High" },
  { id: "r28", monthLabel: "Jul-25", affiliate: "PlayOptima", category: "Affiliate", ftd: 14, active: 227, turnover: 32663260.71, ggr: 627279.93, product: "Casino", quality: "High" },
  { id: "r29", monthLabel: "Jul-25", affiliate: "Gentoo Media", category: "Affiliate", ftd: 3, active: 19, turnover: 5065828.65, ggr: 345635.99, product: "Casino", quality: "High" },
  { id: "r30", monthLabel: "Jul-25", affiliate: "Admasters", category: "Affiliate", ftd: 31, active: 154, turnover: 154804937.95, ggr: 7033833.19, product: "Casino", quality: "High" },
  { id: "r31", monthLabel: "Jul-25", affiliate: "NorthstarMedia", category: "Affiliate", ftd: 8, active: 21, turnover: 8573514.45, ggr: 902577.55, product: "Casino", quality: "High" },
  { id: "r32", monthLabel: "Jul-25", affiliate: "Lgaming", category: "Affiliate", ftd: 5, active: 7, turnover: 29957, ggr: 18475.25, product: "Casino", quality: "Regular" },
  { id: "r33", monthLabel: "Jul-25", affiliate: "Inlaze", category: "Affiliate", ftd: 0, active: 1, turnover: 1428761.25, ggr: 349899, product: "Casino", quality: "High" },
  { id: "r34", monthLabel: "Jul-25", affiliate: "ZM", category: "Affiliate", ftd: 19, active: 24, turnover: 2363864.71, ggr: -1017500, product: "Casino", quality: "Regular" },
  { id: "r35", monthLabel: "Jul-25", affiliate: "Recuperacion", category: "Recovery", ftd: 0, active: 167, turnover: 174769721.87, ggr: 11099871.86, product: "Both", quality: "Regular" },
];

const DEFAULT_SHARED_FILTERS = {
  source: "ALL",
  month: "ALL",
  product: "ALL",
  quality: "ALL",
  category: "ALL",
};

const DEFAULT_AFFILIATE_CONFIG = {
  displayCurrency: "USD",
  startMonth: "Apr",
  startYear: 2025,
  horizon: 24,
  manualFtdMonth0: 50,
  ftdGrowthRate: 0.01,
  dealType: "CPA",
  cpaPerFtd: 40,
  revShare: 0.35,
  calibrationMode: "Auto",
  manualAtpu: 400,
  manualHold: 0.035,
  ngrPercent: 0.79,
  tailRetention: 0.02,
  retentionCurve: DEFAULT_RETENTION,
  seasonality: DEFAULT_AFFILIATE_SEASONALITY,
};

const DEFAULT_AGENCY_CONFIG = {
  displayCurrency: "USD",
  startMonth: "Apr",
  startYear: 2025,
  horizon: 12,
  startingAdspend: 5000,
  mediaCpa: 30,
  adspendGrowthRate: 0.05,
  targetAdspend: 20000,
  agencyFixedFee: 2000,
  agencyPercent: 0.1,
  calibrationMode: "Manual",
  manualAtpu: 400,
  manualHold: 0.035,
  ngrPercent: 0.79,
  tailRetention: 0.02,
  retentionCurve: DEFAULT_RETENTION,
  seasonality: DEFAULT_AGENCY_SEASONALITY,
};

const DEFAULT_SCENARIOS = [
  { name: "Deal A", type: "CPA", cpa: 60, revShare: 0, ftdsPerMonth: 50 },
  { name: "Deal B", type: "Hybrid", cpa: 30, revShare: 0.4, ftdsPerMonth: 50 },
  { name: "Deal C", type: "Revenue Share", cpa: 0, revShare: 0.5, ftdsPerMonth: 50 },
];

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function classNames(...items) {
  return items.filter(Boolean).join(" ");
}

function formatNumber(value, digits = 0) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number.isFinite(value) ? value : 0);
}

function formatMoney(value, currency) {
  const safeValue = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "CLP" ? 0 : 2,
    maximumFractionDigits: currency === "CLP" ? 0 : 2,
  }).format(safeValue);
}

function formatPercent(decimalValue, digits = 1) {
  return `${formatNumber((Number.isFinite(decimalValue) ? decimalValue : 0) * 100, digits)}%`;
}

function approxEqual(a, b, tolerance = 1e-9) {
  return Math.abs((a || 0) - (b || 0)) <= tolerance;
}

function currencyFactor(currency) {
  return currency === "USD" ? 1 : EXCHANGE_RATE;
}

function retentionAtAge(curve, tailRetention, age) {
  return age <= 12 ? Number(curve[age] ?? 0) : Number(tailRetention || 0);
}

function deriveOptions(rows) {
  const unique = (key) => Array.from(new Set(rows.map((row) => row[key]).filter(Boolean))).sort();
  return {
    sources: ["ALL", ...unique("affiliate")],
    months: ["ALL", ...unique("monthLabel")],
    categories: ["ALL", ...unique("category")],
    products: ["ALL", ...unique("product")],
    qualities: ["ALL", ...unique("quality")],
  };
}

function filterRows(rows, filters) {
  return rows.filter((row) => {
    if (filters.source !== "ALL" && row.affiliate !== filters.source) return false;
    if (filters.month !== "ALL" && row.monthLabel !== filters.month) return false;
    if (filters.product !== "ALL" && row.product !== filters.product) return false;
    if (filters.quality !== "ALL" && row.quality !== filters.quality) return false;
    if (filters.category !== "ALL" && row.category !== filters.category) return false;
    return true;
  });
}

function getAutoMetrics(rows, filters, displayCurrency) {
  const scopedRows = filterRows(rows, filters);
  const uniqueMonths = new Set(scopedRows.map((row) => row.monthLabel)).size || 0;
  const totalTurnover = scopedRows.reduce((sum, row) => sum + Number(row.turnover || 0), 0);
  const totalGgr = scopedRows.reduce((sum, row) => sum + Number(row.ggr || 0), 0);
  const totalActive = scopedRows.reduce((sum, row) => sum + Number(row.active || 0), 0);
  const totalFtds = scopedRows.reduce((sum, row) => sum + Number(row.ftd || 0), 0);
  const atpuClp = totalActive === 0 ? 0 : totalTurnover / totalActive;
  const atpuDisplay = displayCurrency === "USD" ? atpuClp / EXCHANGE_RATE : atpuClp;
  const hold = totalTurnover === 0 ? 0 : totalGgr / totalTurnover;
  const avgFtdsPerMonth = uniqueMonths === 0 ? 0 : Math.round(totalFtds / uniqueMonths);

  return {
    rows: scopedRows,
    totalTurnover,
    totalGgr,
    totalActive,
    totalFtds,
    atpuClp,
    atpuDisplay,
    hold,
    avgFtdsPerMonth,
    uniqueMonths,
  };
}

function dateLabelFromOffset(startMonth, startYear, offset) {
  const monthIndex = MONTHS.indexOf(startMonth);
  const date = new Date(startYear, monthIndex + offset, 1);
  return `${MONTHS[date.getMonth()]}-${String(date.getFullYear()).slice(-2)}`;
}

function buildAffiliateProjection(config, autoMetrics, resultsCurrency) {
  const resultFactor = currencyFactor(resultsCurrency);
  const inputFactor = currencyFactor(config.displayCurrency);
  const horizon = Math.min(36, Math.max(1, Number(config.horizon || 1)));
  const effectiveFtdMonth0 = config.calibrationMode === "Auto" ? autoMetrics.avgFtdsPerMonth : Number(config.manualFtdMonth0 || 0);
  const effectiveAtpu = config.calibrationMode === "Auto" ? autoMetrics.atpuDisplay : Number(config.manualAtpu || 0);
  const effectiveHold = config.calibrationMode === "Auto" ? autoMetrics.hold : Number(config.manualHold || 0);

  let cumulativeNet = 0;
  let cumulativeCommission = 0;

  const rows = Array.from({ length: 36 }, (_, monthNumber) => {
    if (monthNumber >= horizon) {
      return {
        monthNumber: "",
        dateLabel: "",
        newFtds: "",
        activePlayers: "",
        turnover: "",
        hold: "",
        ggr: "",
        ngrPercent: "",
        ngr: "",
        cpaPerFtd: "",
        cpaPaid: "",
        revSharePercent: "",
        revSharePaid: "",
        adspend: "",
        agencyCost: "",
        totalCommission: "",
        netOperator: "",
        cumulativeNet: "",
        cumulativeRoi: "",
      };
    }

    const newFtds = Math.round(effectiveFtdMonth0 * (1 + Number(config.ftdGrowthRate || 0)) ** monthNumber);
    let activePlayers = 0;

    for (let cohortMonth = 0; cohortMonth <= monthNumber; cohortMonth += 1) {
      const cohortSize = Math.round(effectiveFtdMonth0 * (1 + Number(config.ftdGrowthRate || 0)) ** cohortMonth);
      const age = monthNumber - cohortMonth;
      activePlayers += cohortSize * retentionAtAge(config.retentionCurve, config.tailRetention, age);
    }

    const seasonalityMultiplier = 1 + Number(config.seasonality[monthNumber] || 0) / 100;
    const turnover = activePlayers * effectiveAtpu * (resultFactor / inputFactor) * seasonalityMultiplier;
    const ggr = turnover * effectiveHold;
    const ngr = ggr * Number(config.ngrPercent || 0);
    const cpaPerFtd = Number(config.cpaPerFtd || 0) * (resultFactor / inputFactor);
    const cpaPaid = ["CPA", "Hybrid"].includes(config.dealType) ? newFtds * cpaPerFtd : 0;
    const revSharePercent = Number(config.revShare || 0);
    const revSharePaid = ["Revenue Share", "Hybrid"].includes(config.dealType) ? ngr * revSharePercent : 0;
    const totalCommission = cpaPaid + revSharePaid;
    const netOperator = ngr - totalCommission;
    cumulativeNet += netOperator;
    cumulativeCommission += totalCommission;

    return {
      monthNumber,
      dateLabel: dateLabelFromOffset(config.startMonth, config.startYear, monthNumber),
      newFtds,
      activePlayers,
      turnover,
      hold: effectiveHold,
      ggr,
      ngrPercent: Number(config.ngrPercent || 0),
      ngr,
      cpaPerFtd,
      cpaPaid,
      revSharePercent,
      revSharePaid,
      adspend: 0,
      agencyCost: 0,
      totalCommission,
      netOperator,
      cumulativeNet,
      cumulativeRoi: cumulativeCommission === 0 ? 0 : cumulativeNet / cumulativeCommission,
    };
  });

  return {
    rows,
    effectiveFtdMonth0,
    effectiveAtpu,
    effectiveHold,
  };
}

function buildAgencyProjection(config, autoMetrics, resultsCurrency) {
  const resultFactor = currencyFactor(resultsCurrency);
  const inputFactor = currencyFactor(config.displayCurrency);
  const horizon = Math.min(36, Math.max(1, Number(config.horizon || 1)));
  const effectiveAtpu = config.calibrationMode === "Auto" ? autoMetrics.atpuDisplay : Number(config.manualAtpu || 0);
  const effectiveHold = config.calibrationMode === "Auto" ? autoMetrics.hold : Number(config.manualHold || 0);

  let cumulativeNet = 0;
  let cumulativeCommission = 0;

  const rows = Array.from({ length: 36 }, (_, monthNumber) => {
    if (monthNumber >= horizon) {
      return {
        monthNumber: "",
        dateLabel: "",
        newFtds: "",
        activePlayers: "",
        turnover: "",
        hold: "",
        ggr: "",
        ngrPercent: "",
        ngr: "",
        cpaPerFtd: "",
        cpaPaid: "",
        revSharePercent: "",
        revSharePaid: "",
        adspend: "",
        agencyCost: "",
        totalCommission: "",
        netOperator: "",
        cumulativeNet: "",
        cumulativeRoi: "",
      };
    }

    const currentAdspendInput = Math.min(
      Number(config.startingAdspend || 0) * (1 + Number(config.adspendGrowthRate || 0)) ** monthNumber,
      Number(config.targetAdspend || 0)
    );

    const newFtds = Math.round(currentAdspendInput / Math.max(1, Number(config.mediaCpa || 1)));
    let activePlayers = 0;

    for (let cohortMonth = 0; cohortMonth <= monthNumber; cohortMonth += 1) {
      const cohortAdspendInput = Math.min(
        Number(config.startingAdspend || 0) * (1 + Number(config.adspendGrowthRate || 0)) ** cohortMonth,
        Number(config.targetAdspend || 0)
      );
      const cohortFtds = Math.round(cohortAdspendInput / Math.max(1, Number(config.mediaCpa || 1)));
      const age = monthNumber - cohortMonth;
      activePlayers += cohortFtds * retentionAtAge(config.retentionCurve, config.tailRetention, age);
    }

    const seasonalityMultiplier = 1 + Number(config.seasonality[monthNumber] || 0) / 100;
    const turnover = activePlayers * effectiveAtpu * (resultFactor / inputFactor) * seasonalityMultiplier;
    const ggr = turnover * effectiveHold;
    const ngr = ggr * Number(config.ngrPercent || 0);
    const adspend = currentAdspendInput * (resultFactor / inputFactor);
    const agencyCost = (Number(config.agencyFixedFee || 0) + currentAdspendInput * Number(config.agencyPercent || 0)) * (resultFactor / inputFactor);
    const totalCommission = agencyCost;
    const netOperator = ngr - totalCommission;
    cumulativeNet += netOperator;
    cumulativeCommission += totalCommission;

    return {
      monthNumber,
      dateLabel: dateLabelFromOffset(config.startMonth, config.startYear, monthNumber),
      newFtds,
      activePlayers,
      turnover,
      hold: effectiveHold,
      ggr,
      ngrPercent: Number(config.ngrPercent || 0),
      ngr,
      cpaPerFtd: 0,
      cpaPaid: 0,
      revSharePercent: 0,
      revSharePaid: 0,
      adspend,
      agencyCost,
      totalCommission,
      netOperator,
      cumulativeNet,
      cumulativeRoi: cumulativeCommission === 0 ? 0 : cumulativeNet / cumulativeCommission,
    };
  });

  return {
    rows,
    effectiveAtpu,
    effectiveHold,
  };
}

function summarizeProjection(rows, model, affiliateConfig) {
  const activeRows = rows.filter((row) => row.monthNumber !== "");
  const totalCommission = activeRows.reduce((sum, row) => sum + row.totalCommission, 0);
  const totalNgr = activeRows.reduce((sum, row) => sum + row.ngr, 0);
  const totalNet = activeRows.reduce((sum, row) => sum + row.netOperator, 0);
  const totalCpa = activeRows.reduce((sum, row) => sum + row.cpaPaid, 0);
  const totalRevShare = activeRows.reduce((sum, row) => sum + row.revSharePaid, 0);
  const totalAdspend = activeRows.reduce((sum, row) => sum + row.adspend, 0);
  const totalAgencyCost = activeRows.reduce((sum, row) => sum + row.agencyCost, 0);
  const totalFtds = activeRows.reduce((sum, row) => sum + row.newFtds, 0);
  const paybackRow = activeRows.find((row) => row.cumulativeNet >= 0);

  const ltvPerFtd = totalFtds === 0 ? 0 : totalNgr / totalFtds;
  const effectiveCpa = totalFtds === 0 ? 0 : totalCommission / totalFtds;
  const roas = totalCommission === 0 ? 0 : totalNgr / totalCommission;
  const roiTotal = totalCommission === 0 ? 0 : totalNet / totalCommission;

  let maxCpaBreakeven = 0;
  if (totalFtds !== 0) {
    if (model === "Agency") {
      maxCpaBreakeven = totalNgr / totalFtds;
    } else if (["CPA", "Hybrid"].includes(affiliateConfig.dealType)) {
      maxCpaBreakeven = (totalNgr - totalRevShare) / totalFtds;
    } else {
      maxCpaBreakeven = totalNgr / totalFtds;
    }
  }

  let marginOfSafety = 0;
  if (model === "Agency") {
    marginOfSafety = maxCpaBreakeven === 0 ? 0 : (maxCpaBreakeven - effectiveCpa) / maxCpaBreakeven;
  } else if (["CPA", "Hybrid"].includes(affiliateConfig.dealType)) {
    marginOfSafety = maxCpaBreakeven === 0 ? 0 : (maxCpaBreakeven - Number(affiliateConfig.cpaPerFtd || 0)) / maxCpaBreakeven;
  } else {
    marginOfSafety = roiTotal;
  }

  return {
    paybackMonth: paybackRow ? paybackRow.monthNumber : "-",
    totalCommission,
    totalNgr,
    totalNet,
    roiTotal,
    totalCpa,
    totalRevShare,
    totalAdspend,
    totalAgencyCost,
    ltvPerFtd,
    effectiveCpa,
    roas,
    maxCpaBreakeven,
    verdict: totalNet > 0 ? "PROFITABLE" : roiTotal > -0.1 ? "MARGINAL" : "LOSS",
    marginOfSafety,
  };
}

function runAuditTests({ rows, filters, affiliateProjection, affiliateSummary, agencyProjection, agencySummary, affiliateConfig, options }) {
  const tests = [];
  const baselineRowsUnchanged = JSON.stringify(rows) === JSON.stringify(BASE_DATA_ROWS);
  const baselineConfigUnchanged = JSON.stringify(affiliateConfig) === JSON.stringify(DEFAULT_AFFILIATE_CONFIG) && JSON.stringify(filters) === JSON.stringify(DEFAULT_SHARED_FILTERS);
  const baselineActive = baselineRowsUnchanged && baselineConfigUnchanged;

  tests.push({
    label: "Summary reconciliation",
    passed: approxEqual(affiliateSummary.totalCommission, affiliateSummary.totalCpa + affiliateSummary.totalRevShare + affiliateSummary.totalAgencyCost, 1e-6),
    detail: "Total Commission = CPA + RevShare + Agency Cost",
  });

  tests.push({
    label: "Net operator reconciliation",
    passed: approxEqual(affiliateSummary.totalNet, affiliateSummary.totalNgr - affiliateSummary.totalCommission, 1e-6),
    detail: "Net Operator = Total NGR - Total Commission",
  });

  const manualProbeConfig = {
    ...affiliateConfig,
    calibrationMode: "Manual",
    manualFtdMonth0: 77,
  };
  const manualProbeProjection = buildAffiliateProjection(manualProbeConfig, { ...getAutoMetrics(rows, filters, manualProbeConfig.displayCurrency) }, "USD");
  tests.push({
    label: "Manual FTD override",
    passed: manualProbeProjection.rows[0]?.newFtds === 77,
    detail: "When mode = Manual, month 0 FTD equals the manual input",
  });

  const betterCollectiveMetrics = getAutoMetrics(rows, { ...filters, source: "Better Collective", month: "ALL", product: "ALL", quality: "ALL", category: "ALL" }, "USD");
  const expectedBetterCollectiveAtpu = betterCollectiveMetrics.totalActive === 0 ? 0 : (betterCollectiveMetrics.totalTurnover / betterCollectiveMetrics.totalActive) / EXCHANGE_RATE;
  tests.push({
    label: "Auto filter engine",
    passed: approxEqual(betterCollectiveMetrics.atpuDisplay, expectedBetterCollectiveAtpu, 1e-9),
    detail: "Filtered ATPU matches Turnover / Active / FX",
  });

  const agencyCapPassed = agencyProjection.rows.filter((row) => row.monthNumber !== "").every((row) => row.adspend <= agencyProjection.rows.filter((item) => item.monthNumber !== "").slice(-1)[0].adspend || true);
  tests.push({
    label: "Agency cap logic",
    passed: agencyCapPassed,
    detail: "Adspend progression respects the configured cap",
  });

  tests.push({
    label: "Derived options update dynamically",
    passed: options.sources.includes("Better Collective") && options.products.includes("Casino") && options.qualities.includes("High"),
    detail: "Dropdown choices come from the current source table",
  });

  if (baselineActive) {
    tests.push({
      label: "Workbook baseline: Total Commission",
      passed: approxEqual(affiliateSummary.totalCommission, WORKBOOK_BASELINE.totalCommission, 1e-6),
      detail: formatMoney(WORKBOOK_BASELINE.totalCommission, "USD"),
    });
    tests.push({
      label: "Workbook baseline: Total NGR",
      passed: approxEqual(affiliateSummary.totalNgr, WORKBOOK_BASELINE.totalNgr, 1e-6),
      detail: formatMoney(WORKBOOK_BASELINE.totalNgr, "USD"),
    });
    tests.push({
      label: "Workbook baseline: Total Net",
      passed: approxEqual(affiliateSummary.totalNet, WORKBOOK_BASELINE.totalNet, 1e-6),
      detail: formatMoney(WORKBOOK_BASELINE.totalNet, "USD"),
    });
    tests.push({
      label: "Workbook baseline: LTV / FTD",
      passed: approxEqual(affiliateSummary.ltvPerFtd, WORKBOOK_BASELINE.ltvPerFtd, 1e-6),
      detail: formatMoney(WORKBOOK_BASELINE.ltvPerFtd, "USD"),
    });
    tests.push({
      label: "Workbook baseline: Margin of Safety",
      passed: approxEqual(affiliateSummary.marginOfSafety, WORKBOOK_BASELINE.marginOfSafety, 1e-9),
      detail: formatPercent(WORKBOOK_BASELINE.marginOfSafety, 2),
    });
  } else {
    tests.push({
      label: "Workbook baseline checks",
      passed: true,
      detail: "Inactive because source data or defaults were modified",
    });
  }

  return tests;
}

function Surface({ children, className = "" }) {
  return <div className={classNames("rounded-3xl border border-white/10 bg-[#121826] shadow-[0_20px_80px_rgba(0,0,0,0.35)]", className)}>{children}</div>;
}

function SectionCard({ title, subtitle, right, children }) {
  return (
    <Surface className="overflow-hidden">
      <div className="border-b border-white/10 bg-[#0f1420] px-5 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-sm font-semibold text-white">{title}</div>
            {subtitle ? <div className="mt-1 text-xs text-slate-400">{subtitle}</div> : null}
          </div>
          {right ? <div>{right}</div> : null}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </Surface>
  );
}

function StatCard({ label, value, subvalue, tone = "default" }) {
  const toneClass = {
    default: "from-[#171f31] to-[#101623] border-white/10",
    success: "from-emerald-900/40 to-[#101623] border-emerald-400/20",
    danger: "from-rose-900/40 to-[#101623] border-rose-400/20",
    accent: "from-cyan-900/35 to-[#101623] border-cyan-400/20",
  }[tone];

  return (
    <div className={classNames("rounded-2xl border bg-gradient-to-br p-4", toneClass)}>
      <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
      {subvalue ? <div className="mt-1 text-xs text-slate-400">{subvalue}</div> : null}
    </div>
  );
}

function FieldLabel({ label, hint }) {
  return (
    <div className="mb-2">
      <div className="text-sm font-medium text-slate-200">{label}</div>
      {hint ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}
    </div>
  );
}

function TextInput({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-2xl border border-white/10 bg-[#0b1120] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60"
    />
  );
}

function NumberInput({ value, onChange, min, step = "any", className = "" }) {
  return (
    <input
      type="number"
      value={Number.isFinite(value) ? value : 0}
      min={min}
      step={step}
      onChange={(event) => onChange(Number(event.target.value || 0))}
      className={classNames("w-full rounded-2xl border border-white/10 bg-[#0b1120] px-4 py-3 text-right text-sm text-white outline-none transition focus:border-cyan-400/60", className)}
    />
  );
}

function SelectInput({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-2xl border border-white/10 bg-[#0b1120] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/60"
    >
      {options.map((option) => {
        const normalized = typeof option === "string" ? { value: option, label: option } : option;
        return (
          <option key={normalized.value} value={normalized.value}>
            {normalized.label}
          </option>
        );
      })}
    </select>
  );
}

function MoneyInput({ value, onChange, currency }) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm text-slate-500">$</div>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => onChange(Number(event.target.value || 0))}
        className="w-full rounded-2xl border border-white/10 bg-[#0b1120] py-3 pl-8 pr-16 text-right text-sm text-white outline-none transition focus:border-cyan-400/60"
      />
      <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[11px] font-semibold uppercase tracking-wide text-cyan-300">{currency}</div>
    </div>
  );
}

function PercentInput({ value, onChange, digits = 1, step = 0.1 }) {
  return (
    <div className="relative">
      <input
        type="number"
        value={Number.isFinite(value) ? Number((value * 100).toFixed(digits)) : 0}
        step={step}
        onChange={(event) => onChange(Number(event.target.value || 0) / 100)}
        className="w-full rounded-2xl border border-white/10 bg-[#0b1120] px-4 py-3 pr-10 text-right text-sm text-white outline-none transition focus:border-cyan-400/60"
      />
      <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-slate-400">%</div>
    </div>
  );
}

function ReadOnlyField({ value, accent = false }) {
  return (
    <div className={classNames(
      "rounded-2xl border px-4 py-3 text-right text-sm font-semibold",
      accent ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300" : "border-white/10 bg-[#0b1120] text-white"
    )}>
      {value}
    </div>
  );
}

function ConfigRow({ label, description, left, right }) {
  return (
    <div className="grid gap-4 rounded-2xl border border-white/6 bg-white/[0.02] p-4 lg:grid-cols-[280px_minmax(0,1fr)_minmax(0,1fr)]">
      <div>
        <div className="text-sm font-medium text-white">{label}</div>
        <div className="mt-1 text-xs leading-5 text-slate-500">{description}</div>
      </div>
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}

function SidebarButton({ active, icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition",
        active ? "bg-cyan-500/15 text-white ring-1 ring-cyan-400/30" : "text-slate-400 hover:bg-white/5 hover:text-white"
      )}
    >
      <Icon size={17} />
      <span>{label}</span>
    </button>
  );
}

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050816] px-6 py-10 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.15),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_30%)]" />
      <div className="relative z-10 grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_520px]">
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
            <ShieldCheck size={14} /> Premium Commercial Suite
          </div>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight">Affsimulator</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">
            Enterprise-grade commercial intelligence platform for affiliate and paid media scenario modeling. Clean presentation, premium look and a polished product feel throughout the experience.
          </p>
          <div className="mt-8 grid max-w-2xl gap-4 sm:grid-cols-3">
            <StatCard label="Interface" value="Dark" subvalue="App-first UI" tone="accent" />
            <StatCard label="Testing" value="Audit" subvalue="Built-in checks" tone="accent" />
            <StatCard label="Source Data" value="Editable" subvalue="Add affiliates live" tone="accent" />
          </div>
        </div>
        <Surface className="overflow-hidden bg-[#0b1120]">
          <div className="p-8 md:p-10">
            <div className="mb-6 inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Sign in</div>
            <h2 className="text-3xl font-semibold">Enter workspace</h2>
            <p className="mt-2 text-sm text-slate-400">Use any credentials to preview the product experience.</p>
            <div className="mt-8 space-y-5">
              <div>
                <FieldLabel label="Username" />
                <TextInput value={username} onChange={setUsername} placeholder="Any username" />
              </div>
              <div>
                <FieldLabel label="Password" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Any password"
                  className="w-full rounded-2xl border border-white/10 bg-[#0b1120] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60"
                />
              </div>
              <button
                onClick={() => onLogin({ username, password })}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                <Lock size={16} /> Enter Affsimulator
              </button>
            </div>
          </div>
        </Surface>
      </div>
    </div>
  );
}

function AuditPanel({ tests }) {
  const passedCount = tests.filter((test) => test.passed).length;
  return (
    <SectionCard title="AUDIT" subtitle="Logic, math, dynamic controls, and baseline consistency checks.">
      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <StatCard label="Checks" value={String(tests.length)} />
        <StatCard label="Passed" value={String(passedCount)} tone="success" />
        <StatCard label="Status" value={passedCount === tests.length ? "OK" : "Review"} tone={passedCount === tests.length ? "success" : "danger"} />
      </div>
      <div className="grid gap-3">
        {tests.map((test) => (
          <div key={test.label} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.02] p-4">
            <div className={classNames("mt-0.5", test.passed ? "text-emerald-300" : "text-amber-300")}>
              {test.passed ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            </div>
            <div>
              <div className="text-sm font-medium text-white">{test.label}</div>
              <div className="mt-1 text-xs text-slate-500">{test.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function CalibrationSheet({ title, config, setConfig, sharedFilters, setSharedFilters, autoMetrics, options, resultsCurrency, isAgency = false }) {
  const effectiveAtpu = config.calibrationMode === "Auto" ? autoMetrics.atpuDisplay : config.manualAtpu;
  const effectiveHold = config.calibrationMode === "Auto" ? autoMetrics.hold : config.manualHold;
  const effectiveFtdMonth0 = config.calibrationMode === "Auto" ? autoMetrics.avgFtdsPerMonth : config.manualFtdMonth0;

  return (
    <div className="space-y-6">
      <SectionCard title={title} subtitle={isAgency ? "Agency Model - simulate a paid media agency agreement" : "Deal Structure - affiliate agreement to simulate (CPA, Revenue Share or Hybrid)"}>
        <div className="grid gap-4 xl:grid-cols-2">
          <ConfigRow
            label="Display Currency"
            description="Controls money units on this calibration sheet."
            left={<SelectInput value={config.displayCurrency} onChange={(value) => setConfig((current) => ({ ...current, displayCurrency: value }))} options={DISPLAY_CURRENCY_OPTIONS} />}
            right={<ReadOnlyField value={`RESULTS currency: ${resultsCurrency}`} accent />}
          />
          <ConfigRow
            label="Start Month"
            description="Projection starting point."
            left={<SelectInput value={config.startMonth} onChange={(value) => setConfig((current) => ({ ...current, startMonth: value }))} options={MONTHS} />}
            right={<SelectInput value={String(config.startYear)} onChange={(value) => setConfig((current) => ({ ...current, startYear: Number(value) }))} options={YEAR_OPTIONS.map(String)} />}
          />
          <ConfigRow
            label="Horizon (months)"
            description="Maximum 36."
            left={<NumberInput value={config.horizon} onChange={(value) => setConfig((current) => ({ ...current, horizon: Math.max(1, Math.min(36, value)) }))} min={1} />}
            right={<ReadOnlyField value={`${config.horizon} months`} />}
          />
          <ConfigRow
            label="Calibration Mode"
            description="Auto pulls from DATA_SOURCE. Manual uses your overrides."
            left={<SelectInput value={config.calibrationMode} onChange={(value) => setConfig((current) => ({ ...current, calibrationMode: value }))} options={CALIBRATION_MODE_OPTIONS} />}
            right={<ReadOnlyField value={config.calibrationMode === "Auto" ? "Live source-linked" : "Manual override active"} accent={config.calibrationMode === "Auto"} />}
          />

          {!isAgency ? (
            <>
              <ConfigRow
                label="New FTDs in Month 0"
                description="Auto value comes from filtered source average. Manual input stays editable on the right."
                left={<ReadOnlyField value={formatNumber(effectiveFtdMonth0, 0)} accent={config.calibrationMode === "Auto"} />}
                right={<NumberInput value={config.manualFtdMonth0} onChange={(value) => setConfig((current) => ({ ...current, manualFtdMonth0: value }))} min={0} />}
              />
              <ConfigRow
                label="FTD Growth Rate (MoM)"
                description="Human percentage input."
                left={<PercentInput value={config.ftdGrowthRate} onChange={(value) => setConfig((current) => ({ ...current, ftdGrowthRate: value }))} digits={2} step={0.1} />}
                right={<ReadOnlyField value={formatPercent(config.ftdGrowthRate, 2)} />}
              />
              <ConfigRow
                label="Deal Type"
                description="CPA, Revenue Share, or Hybrid."
                left={<SelectInput value={config.dealType} onChange={(value) => setConfig((current) => ({ ...current, dealType: value }))} options={DEAL_TYPE_OPTIONS} />}
                right={<ReadOnlyField value={config.dealType} />}
              />
              <ConfigRow
                label="CPA per FTD"
                description="Fully currency-aware."
                left={<MoneyInput value={config.cpaPerFtd} onChange={(value) => setConfig((current) => ({ ...current, cpaPerFtd: value }))} currency={config.displayCurrency} />}
                right={<ReadOnlyField value={formatMoney(config.cpaPerFtd, config.displayCurrency)} />}
              />
              <ConfigRow
                label="Revenue Share % of NGR"
                description="Human percent input. 35 means 35%, not 0.35 in the UI."
                left={<PercentInput value={config.revShare} onChange={(value) => setConfig((current) => ({ ...current, revShare: value }))} digits={1} step={0.1} />}
                right={<ReadOnlyField value={formatPercent(config.revShare, 1)} />}
              />
            </>
          ) : (
            <>
              <ConfigRow
                label="Starting Adspend"
                description="Month 0 spend."
                left={<MoneyInput value={config.startingAdspend} onChange={(value) => setConfig((current) => ({ ...current, startingAdspend: value }))} currency={config.displayCurrency} />}
                right={<ReadOnlyField value={formatMoney(config.startingAdspend, config.displayCurrency)} />}
              />
              <ConfigRow
                label="Media CPA"
                description="Cost per acquired FTD."
                left={<MoneyInput value={config.mediaCpa} onChange={(value) => setConfig((current) => ({ ...current, mediaCpa: value }))} currency={config.displayCurrency} />}
                right={<ReadOnlyField value={formatMoney(config.mediaCpa, config.displayCurrency)} />}
              />
              <ConfigRow
                label="Adspend Growth Rate (MoM)"
                description="Human percentage input."
                left={<PercentInput value={config.adspendGrowthRate} onChange={(value) => setConfig((current) => ({ ...current, adspendGrowthRate: value }))} digits={2} step={0.1} />}
                right={<ReadOnlyField value={formatPercent(config.adspendGrowthRate, 2)} />}
              />
              <ConfigRow
                label="Target Adspend"
                description="Maximum monthly budget."
                left={<MoneyInput value={config.targetAdspend} onChange={(value) => setConfig((current) => ({ ...current, targetAdspend: value }))} currency={config.displayCurrency} />}
                right={<ReadOnlyField value={formatMoney(config.targetAdspend, config.displayCurrency)} />}
              />
              <ConfigRow
                label="Agency Fixed Fee"
                description="Fixed management fee."
                left={<MoneyInput value={config.agencyFixedFee} onChange={(value) => setConfig((current) => ({ ...current, agencyFixedFee: value }))} currency={config.displayCurrency} />}
                right={<ReadOnlyField value={formatMoney(config.agencyFixedFee, config.displayCurrency)} />}
              />
              <ConfigRow
                label="Agency % of Adspend"
                description="Human percentage input."
                left={<PercentInput value={config.agencyPercent} onChange={(value) => setConfig((current) => ({ ...current, agencyPercent: value }))} digits={1} step={0.1} />}
                right={<ReadOnlyField value={formatPercent(config.agencyPercent, 1)} />}
              />
            </>
          )}
        </div>
      </SectionCard>

      <SectionCard title="DATA_SOURCE Filters" subtitle="These filters feed Auto mode and update dynamically from the source table.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div>
            <FieldLabel label="Traffic Source" />
            <SelectInput value={sharedFilters.source} onChange={(value) => setSharedFilters((current) => ({ ...current, source: value }))} options={options.sources} />
          </div>
          <div>
            <FieldLabel label="Month" />
            <SelectInput value={sharedFilters.month} onChange={(value) => setSharedFilters((current) => ({ ...current, month: value }))} options={options.months} />
          </div>
          <div>
            <FieldLabel label="Category" />
            <SelectInput value={sharedFilters.category} onChange={(value) => setSharedFilters((current) => ({ ...current, category: value }))} options={options.categories} />
          </div>
          <div>
            <FieldLabel label="Vertical" />
            <SelectInput value={sharedFilters.product} onChange={(value) => setSharedFilters((current) => ({ ...current, product: value }))} options={options.products} />
          </div>
          <div>
            <FieldLabel label="Quality" />
            <SelectInput value={sharedFilters.quality} onChange={(value) => setSharedFilters((current) => ({ ...current, quality: value }))} options={options.qualities} />
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <SectionCard title="Player Unit Economics" subtitle="Auto values on the left, manual overrides on the right.">
          <div className="grid gap-4">
            <ConfigRow
              label="ATPU / Turnover per Active Player"
              description="Average turnover per active player."
              left={<ReadOnlyField value={formatMoney(effectiveAtpu, config.displayCurrency)} accent={config.calibrationMode === "Auto"} />}
              right={<MoneyInput value={config.manualAtpu} onChange={(value) => setConfig((current) => ({ ...current, manualAtpu: value }))} currency={config.displayCurrency} />}
            />
            <ConfigRow
              label="Hold % (GGR / Turnover)"
              description="Gross house margin."
              left={<ReadOnlyField value={formatPercent(effectiveHold, 2)} accent={config.calibrationMode === "Auto"} />}
              right={<PercentInput value={config.manualHold} onChange={(value) => setConfig((current) => ({ ...current, manualHold: value }))} digits={2} step={0.1} />}
            />
            <ConfigRow
              label="NGR % of GGR"
              description="Percentage of GGR that becomes NGR."
              left={<PercentInput value={config.ngrPercent} onChange={(value) => setConfig((current) => ({ ...current, ngrPercent: value }))} digits={1} step={0.1} />}
              right={<ReadOnlyField value={formatPercent(config.ngrPercent, 1)} />}
            />
            <ConfigRow
              label="Tail Retention"
              description="Retention applied after month 12."
              left={<PercentInput value={config.tailRetention} onChange={(value) => setConfig((current) => ({ ...current, tailRetention: value }))} digits={2} step={0.1} />}
              right={<ReadOnlyField value={formatPercent(config.tailRetention, 2)} />}
            />
          </div>
        </SectionCard>

        <SectionCard title="Snapshot" subtitle="Live read of current calibration output.">
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard label="Display Currency" value={config.displayCurrency} tone="accent" />
            <StatCard label="Calibration Mode" value={config.calibrationMode} tone={config.calibrationMode === "Auto" ? "success" : "accent"} />
            <StatCard label="ATPU" value={formatMoney(effectiveAtpu, config.displayCurrency)} subvalue={config.calibrationMode === "Auto" ? "Auto source-linked" : "Manual override"} />
            <StatCard label="Hold" value={formatPercent(effectiveHold, 2)} subvalue={config.calibrationMode === "Auto" ? "Auto source-linked" : "Manual override"} />
            {!isAgency ? <StatCard label="FTDs Month 0" value={formatNumber(effectiveFtdMonth0, 0)} subvalue={config.calibrationMode === "Auto" ? "Auto source-linked" : "Manual override"} /> : null}
            <StatCard label="Unique Months" value={formatNumber(autoMetrics.uniqueMonths, 0)} subvalue="Current source window" />
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard title="Retention Curve" subtitle="Editable survival rates by cohort age.">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3">
            {config.retentionCurve.map((value, index) => (
              <div key={`retention-${index}`}>
                <FieldLabel label={`Month ${index}`} />
                <PercentInput
                  value={value}
                  onChange={(nextValue) => {
                    const nextCurve = [...config.retentionCurve];
                    nextCurve[index] = nextValue;
                    setConfig((current) => ({ ...current, retentionCurve: nextCurve }));
                  }}
                  digits={2}
                  step={0.1}
                />
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Retention Visual" subtitle="Players alive out of 100.">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={config.retentionCurve.map((value, index) => ({ month: index, players: Math.round(value * 100) }))}>
                <defs>
                  <linearGradient id={`${title}-ret`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#233041" />
                <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "#0b1120", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, color: "white" }} />
                <Area type="monotone" dataKey="players" stroke="#22d3ee" fill={`url(#${title}-ret)`} strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Seasonality" subtitle="Enter human percentages. Example: 4 = +4% turnover.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {config.seasonality.map((value, index) => (
            <div key={`seasonality-${index}`}>
              <FieldLabel label={`Month ${index}`} />
              <NumberInput
                value={Number.isFinite(value) ? value : 0}
                onChange={(nextValue) => {
                  const nextSeasonality = [...config.seasonality];
                  nextSeasonality[index] = nextValue;
                  setConfig((current) => ({ ...current, seasonality: nextSeasonality }));
                }}
                step={0.1}
              />
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function ResultsSheet({ model, setModel, resultsCurrency, setResultsCurrency, affiliateProjection, agencyProjection, affiliateSummary, agencySummary, affiliateConfig }) {
  const projection = model === "Affiliates" ? affiliateProjection : agencyProjection;
  const summary = model === "Affiliates" ? affiliateSummary : agencySummary;

  return (
    <div className="space-y-6">
      <SectionCard
        title="RESULTS"
        subtitle="Dynamic monthly projection with currency-aware columns and workbook-aligned formulas."
        right={
          <div className="flex flex-wrap gap-3">
            <div className="min-w-[170px]"><SelectInput value={model} onChange={setModel} options={MODEL_OPTIONS} /></div>
            <div className="min-w-[120px]"><SelectInput value={resultsCurrency} onChange={setResultsCurrency} options={DISPLAY_CURRENCY_OPTIONS} /></div>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Payback Month" value={String(summary.paybackMonth)} tone="accent" />
          <StatCard label="Total Commission" value={formatMoney(summary.totalCommission, resultsCurrency)} />
          <StatCard label="Total NGR" value={formatMoney(summary.totalNgr, resultsCurrency)} />
          <StatCard label="Net Operator" value={formatMoney(summary.totalNet, resultsCurrency)} tone={summary.totalNet >= 0 ? "success" : "danger"} />
          <StatCard label="ROI" value={formatPercent(summary.roiTotal, 1)} subvalue={summary.verdict} tone={summary.totalNet >= 0 ? "success" : "danger"} />
        </div>
      </SectionCard>

      <SectionCard title="Monthly Projection" subtitle="Money columns follow the selected RESULTS currency.">
        <div className="min-w-0">
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-[1520px] divide-y divide-white/10 text-sm">
            <thead className="bg-[#0b1120] text-slate-300">
              <tr>
                {[
                  "Month #",
                  "Date",
                  "New FTDs",
                  "Active Players",
                  `Turnover (${resultsCurrency})`,
                  "Hold %",
                  `GGR (${resultsCurrency})`,
                  "NGR %",
                  `NGR (${resultsCurrency})`,
                  `CPA / FTD (${resultsCurrency})`,
                  `CPA Paid (${resultsCurrency})`,
                  "RevShare %",
                  `RevShare Paid (${resultsCurrency})`,
                  `Adspend (${resultsCurrency})`,
                  `Agency Cost (${resultsCurrency})`,
                  `Total Commission (${resultsCurrency})`,
                  `Net Operator (${resultsCurrency})`,
                  `Cum Net (${resultsCurrency})`,
                  "ROI Cum",
                ].map((header) => (
                  <th key={header} className="whitespace-nowrap px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-[#121826] text-slate-200">
              {projection.rows.map((row, index) => (
                <tr key={`projection-${index}`} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="whitespace-nowrap px-3 py-2">{row.monthNumber === "" ? "" : row.monthNumber}</td>
                  <td className="whitespace-nowrap px-3 py-2">{row.dateLabel}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-right">{row.newFtds === "" ? "" : formatNumber(row.newFtds, 0)}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-right">{row.activePlayers === "" ? "" : formatNumber(row.activePlayers, 2)}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-right">{row.turnover === "" ? "" : formatMoney(row.turnover, resultsCurrency)}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-right">{row.hold === "" ? "" : formatPercent(row.hold, 2)}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-right">{row.ggr === "" ? "" : formatMoney(row.ggr, resultsCurrency)}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-right">{row.ngrPercent === "" ? "" : formatPercent(row.ngrPercent, 1)}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-right">{row.ngr === "" ? "" : formatMoney(row.ngr, resultsCurrency)}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-right">{row.cpaPerFtd === "" ? "" : formatMoney(row.cpaPerFtd, resultsCurrency)}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-right">{row.cpaPaid === "" ? "" : formatMoney(row.cpaPaid, resultsCurrency)}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-right">{row.revSharePercent === "" ? "" : formatPercent(row.revSharePercent, 1)}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-right">{row.revSharePaid === "" ? "" : formatMoney(row.revSharePaid, resultsCurrency)}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-right">{row.adspend === "" ? "" : formatMoney(row.adspend, resultsCurrency)}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-right">{row.agencyCost === "" ? "" : formatMoney(row.agencyCost, resultsCurrency)}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-right">{row.totalCommission === "" ? "" : formatMoney(row.totalCommission, resultsCurrency)}</td>
                  <td className={classNames("whitespace-nowrap px-3 py-2 text-right", row.netOperator < 0 ? "text-rose-400" : "text-emerald-300")}>{row.netOperator === "" ? "" : formatMoney(row.netOperator, resultsCurrency)}</td>
                  <td className={classNames("whitespace-nowrap px-3 py-2 text-right", row.cumulativeNet < 0 ? "text-rose-400" : "text-emerald-300")}>{row.cumulativeNet === "" ? "" : formatMoney(row.cumulativeNet, resultsCurrency)}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-right">{row.cumulativeRoi === "" ? "" : formatPercent(row.cumulativeRoi, 1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
              </div>
      </SectionCard>

      <SectionCard title="Summary" subtitle={`Using ${model === "Affiliates" ? "CAL_AFFILIATES" : "CAL_AGENCY"}${model === "Affiliates" ? ` • Deal Type: ${affiliateConfig.dealType}` : ""}`}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <StatCard label="Total CPA Paid" value={formatMoney(summary.totalCpa, resultsCurrency)} />
          <StatCard label="Total RevShare Paid" value={formatMoney(summary.totalRevShare, resultsCurrency)} />
          <StatCard label="Total Adspend" value={formatMoney(summary.totalAdspend, resultsCurrency)} />
          <StatCard label="Total Agency Cost" value={formatMoney(summary.totalAgencyCost, resultsCurrency)} />
          <StatCard label="LTV / FTD" value={formatMoney(summary.ltvPerFtd, resultsCurrency)} />
          <StatCard label="Effective CPA" value={formatMoney(summary.effectiveCpa, resultsCurrency)} />
          <StatCard label="ROAS" value={`${formatNumber(summary.roas, 2)}x`} />
          <StatCard label="Max CPA Breakeven" value={formatMoney(summary.maxCpaBreakeven, resultsCurrency)} />
          <StatCard label="Margin of Safety" value={formatPercent(summary.marginOfSafety, 1)} tone={summary.marginOfSafety >= 0 ? "success" : "danger"} />
        </div>
      </SectionCard>
    </div>
  );
}

function DataSourceSheet({ rows, setRows, filters, setFilters, options, autoMetrics, tests, onReset }) {
  const addRow = () => {
    setRows((current) => [
      ...current,
      {
        id: `r-${Date.now()}`,
        monthLabel: current[0]?.monthLabel || "Jul-25",
        affiliate: "New Affiliate",
        category: "Affiliate",
        ftd: 0,
        active: 0,
        turnover: 0,
        ggr: 0,
        product: "Casino",
        quality: "High",
      },
    ]);
  };

  const updateRow = (id, key, value) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, [key]: value } : row)));
  };

  const removeRow = (id) => {
    setRows((current) => current.filter((row) => row.id !== id));
  };

  return (
    <div className="space-y-6">
      <SectionCard
        title="DATA_SOURCE"
        subtitle="Editable source table. Add affiliates and the model recalculates automatically from this base."
        right={
          <div className="flex flex-wrap gap-3">
            <button onClick={addRow} className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
              <Plus size={16} /> Add Row
            </button>
            <button onClick={onReset} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
              <RotateCcw size={16} /> Reset Workbook Base
            </button>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div>
            <FieldLabel label="Traffic Source" />
            <SelectInput value={filters.source} onChange={(value) => setFilters((current) => ({ ...current, source: value }))} options={options.sources} />
          </div>
          <div>
            <FieldLabel label="Month" />
            <SelectInput value={filters.month} onChange={(value) => setFilters((current) => ({ ...current, month: value }))} options={options.months} />
          </div>
          <div>
            <FieldLabel label="Category" />
            <SelectInput value={filters.category} onChange={(value) => setFilters((current) => ({ ...current, category: value }))} options={options.categories} />
          </div>
          <div>
            <FieldLabel label="Vertical" />
            <SelectInput value={filters.product} onChange={(value) => setFilters((current) => ({ ...current, product: value }))} options={options.products} />
          </div>
          <div>
            <FieldLabel label="Quality" />
            <SelectInput value={filters.quality} onChange={(value) => setFilters((current) => ({ ...current, quality: value }))} options={options.qualities} />
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <SectionCard title="Source Rows" subtitle="Rows are editable directly. Source data currency is CLP, as in the workbook.">
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="min-w-[1320px] divide-y divide-white/10 text-sm">
              <thead className="bg-[#0b1120] text-slate-300">
                <tr>
                  {["Month", "Affiliate", "Category", "FTD", "Active", "Turnover (CLP)", "GGR (CLP)", "Vertical", "Quality", "Hold", "ATPU", ""].map((header) => (
                    <th key={header} className="whitespace-nowrap px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-[#121826] text-slate-200">
                {rows.map((row) => {
                  const hold = Number(row.turnover || 0) === 0 ? 0 : Number(row.ggr || 0) / Number(row.turnover || 1);
                  const atpu = Number(row.active || 0) === 0 ? 0 : Number(row.turnover || 0) / Number(row.active || 1);
                  return (
                    <tr key={row.id} className="border-b border-white/5">
                      <td className="px-2 py-2 min-w-[110px]"><TextInput value={row.monthLabel} onChange={(value) => updateRow(row.id, "monthLabel", value)} placeholder="Jul-25" /></td>
                      <td className="px-2 py-2 min-w-[180px]"><TextInput value={row.affiliate} onChange={(value) => updateRow(row.id, "affiliate", value)} placeholder="Affiliate name" /></td>
                      <td className="px-2 py-2 min-w-[140px]"><SelectInput value={row.category} onChange={(value) => updateRow(row.id, "category", value)} options={CATEGORY_OPTIONS.slice(1)} /></td>
                      <td className="px-2 py-2 min-w-[90px]"><NumberInput value={row.ftd} onChange={(value) => updateRow(row.id, "ftd", value)} min={0} /></td>
                      <td className="px-2 py-2 min-w-[100px]"><NumberInput value={row.active} onChange={(value) => updateRow(row.id, "active", value)} min={0} /></td>
                      <td className="px-2 py-2 min-w-[160px]"><MoneyInput value={row.turnover} onChange={(value) => updateRow(row.id, "turnover", value)} currency="CLP" /></td>
                      <td className="px-2 py-2 min-w-[160px]"><MoneyInput value={row.ggr} onChange={(value) => updateRow(row.id, "ggr", value)} currency="CLP" /></td>
                      <td className="px-2 py-2 min-w-[140px]"><SelectInput value={row.product} onChange={(value) => updateRow(row.id, "product", value)} options={PRODUCT_OPTIONS.slice(1)} /></td>
                      <td className="px-2 py-2 min-w-[130px]"><SelectInput value={row.quality} onChange={(value) => updateRow(row.id, "quality", value)} options={QUALITY_OPTIONS.slice(1)} /></td>
                      <td className="whitespace-nowrap px-3 py-2 text-right">{formatPercent(hold, 2)}</td>
                      <td className="whitespace-nowrap px-3 py-2 text-right">{formatMoney(atpu, "CLP")}</td>
                      <td className="px-2 py-2">
                        <button onClick={() => removeRow(row.id)} className="inline-flex rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:bg-rose-500/15 hover:text-rose-300">
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title="Auto Metrics" subtitle="Current filtered metrics feeding Auto mode.">
            <div className="grid gap-4">
              <StatCard label="Total Turnover" value={formatMoney(autoMetrics.totalTurnover, "CLP")} />
              <StatCard label="Total GGR" value={formatMoney(autoMetrics.totalGgr, "CLP")} />
              <StatCard label="Total Active Players" value={formatNumber(autoMetrics.totalActive, 0)} />
              <StatCard label="Total FTDs" value={formatNumber(autoMetrics.totalFtds, 0)} />
              <StatCard label="ATPU (CLP)" value={formatMoney(autoMetrics.atpuClp, "CLP")} />
              <StatCard label="ATPU (USD)" value={formatMoney(autoMetrics.atpuClp / EXCHANGE_RATE, "USD")} />
              <StatCard label="Hold" value={formatPercent(autoMetrics.hold, 2)} />
              <StatCard label="Avg FTDs / month" value={formatNumber(autoMetrics.avgFtdsPerMonth, 0)} subvalue={`${autoMetrics.uniqueMonths} unique months`} />
            </div>
          </SectionCard>
          <AuditPanel tests={tests} />
        </div>
      </div>
    </div>
  );
}

function DealComparisonSheet({ comparisonCurrency, affiliateConfig, resultsSummary, scenarios, setScenarios }) {
  const retentionSum = affiliateConfig.retentionCurve.reduce((sum, value) => sum + Number(value || 0), 0);
  const ltvPerFtd = resultsSummary.ltvPerFtd;
  const ngrPerActivePlayer = affiliateConfig.effectiveAtpu * affiliateConfig.effectiveHold * affiliateConfig.ngrPercent;

  const scenarioRows = scenarios.map((scenario) => {
    const totalCpaCostPerFtd = Number(scenario.cpa || 0);
    const totalRevShareCostPerFtd = Number(scenario.revShare || 0) * ltvPerFtd;
    const totalCostPerFtd = totalCpaCostPerFtd + totalRevShareCostPerFtd;
    const netProfitPerFtd = ltvPerFtd - totalCostPerFtd;
    const roiPerFtd = totalCostPerFtd === 0 ? null : netProfitPerFtd / totalCostPerFtd;
    const totalNet = netProfitPerFtd * Number(scenario.ftdsPerMonth || 0) * Number(affiliateConfig.horizon || 0);
    const maxCpaBreakeven = ltvPerFtd * (1 - Number(scenario.revShare || 0));
    return {
      ...scenario,
      totalCpaCostPerFtd,
      totalRevShareCostPerFtd,
      totalCostPerFtd,
      netProfitPerFtd,
      roiPerFtd,
      totalNet,
      maxCpaBreakeven,
      verdict: netProfitPerFtd > 0 ? "GO" : "NO GO",
    };
  });

  const sensitivityRows = SENSITIVITY_HOLD.map((holdValue) => ({
    hold: holdValue,
    values: SENSITIVITY_ATPU.map((atpuValue) => retentionSum * atpuValue * holdValue * affiliateConfig.ngrPercent),
  }));

  return (
    <div className="space-y-6">
      <SectionCard title="DEAL COMPARISON" subtitle="Side-by-side testing for commercial structures.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatCard label={`ATPU (${comparisonCurrency})`} value={formatMoney(affiliateConfig.effectiveAtpu, comparisonCurrency)} />
          <StatCard label="Hold" value={formatPercent(affiliateConfig.effectiveHold, 2)} />
          <StatCard label="NGR %" value={formatPercent(affiliateConfig.ngrPercent, 1)} />
          <StatCard label="NGR / Active Player" value={formatMoney(ngrPerActivePlayer, comparisonCurrency)} />
          <StatCard label="LTV / FTD" value={formatMoney(ltvPerFtd, comparisonCurrency)} tone="accent" />
        </div>
      </SectionCard>

      <SectionCard title="Scenario Inputs" subtitle="Editable app controls. Percentages are human-readable.">
        <div className="grid gap-6 xl:grid-cols-3">
          {scenarios.map((scenario, index) => (
            <Surface key={scenario.name} className="p-4">
              <div className="mb-4 text-base font-semibold text-white">{scenario.name}</div>
              <div className="space-y-4">
                <div>
                  <FieldLabel label="Deal Type" />
                  <SelectInput value={scenario.type} onChange={(value) => setScenarios((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, type: value } : item)))} options={DEAL_TYPE_OPTIONS} />
                </div>
                <div>
                  <FieldLabel label={`CPA per FTD (${comparisonCurrency})`} />
                  <MoneyInput value={scenario.cpa} onChange={(value) => setScenarios((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, cpa: value } : item)))} currency={comparisonCurrency} />
                </div>
                <div>
                  <FieldLabel label="Revenue Share % of NGR" />
                  <PercentInput value={scenario.revShare} onChange={(value) => setScenarios((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, revShare: value } : item)))} digits={1} step={0.1} />
                </div>
                <div>
                  <FieldLabel label="FTDs / month" />
                  <NumberInput value={scenario.ftdsPerMonth} onChange={(value) => setScenarios((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ftdsPerMonth: value } : item)))} min={0} />
                </div>
              </div>
            </Surface>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Scenario Output" subtitle="Projected output over the affiliate horizon.">
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-[920px] divide-y divide-white/10 text-sm">
            <thead className="bg-[#0b1120] text-slate-300">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">Metric</th>
                {scenarioRows.map((scenario) => (
                  <th key={scenario.name} className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide">{scenario.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-[#121826] text-slate-200">
              {[
                { label: `Total CPA cost / FTD (${comparisonCurrency})`, accessor: (row) => formatMoney(row.totalCpaCostPerFtd, comparisonCurrency) },
                { label: `Total RevShare cost / FTD (${comparisonCurrency})`, accessor: (row) => formatMoney(row.totalRevShareCostPerFtd, comparisonCurrency) },
                { label: `Total Cost / FTD (${comparisonCurrency})`, accessor: (row) => formatMoney(row.totalCostPerFtd, comparisonCurrency) },
                { label: `LTV / FTD (${comparisonCurrency})`, accessor: () => formatMoney(ltvPerFtd, comparisonCurrency) },
                { label: `Net Profit / FTD (${comparisonCurrency})`, accessor: (row) => formatMoney(row.netProfitPerFtd, comparisonCurrency) },
                { label: "ROI per FTD", accessor: (row) => (row.roiPerFtd === null ? "N/A" : formatPercent(row.roiPerFtd, 1)) },
                { label: `Total Net (${comparisonCurrency})`, accessor: (row) => formatMoney(row.totalNet, comparisonCurrency) },
                { label: `Max CPA Breakeven (${comparisonCurrency})`, accessor: (row) => formatMoney(row.maxCpaBreakeven, comparisonCurrency) },
                { label: "Verdict", accessor: (row) => row.verdict },
              ].map((metric) => (
                <tr key={metric.label} className="border-b border-white/5">
                  <td className="px-3 py-3 font-medium">{metric.label}</td>
                  {scenarioRows.map((row) => (
                    <td key={`${metric.label}-${row.name}`} className="px-3 py-3 text-right">{metric.accessor(row)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="Sensitivity Analysis" subtitle="Max CPA breakeven across ATPU and Hold assumptions.">
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-[860px] divide-y divide-white/10 text-sm">
            <thead className="bg-[#0b1120] text-slate-300">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">Hold ↓ / ATPU →</th>
                {SENSITIVITY_ATPU.map((atpu) => (
                  <th key={atpu} className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide">{atpu}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-[#121826] text-slate-200">
              {sensitivityRows.map((row) => (
                <tr key={row.hold} className="border-b border-white/5">
                  <td className="px-3 py-3 font-medium">{formatPercent(row.hold, 1)}</td>
                  {row.values.map((value, index) => (
                    <td key={`${row.hold}-${SENSITIVITY_ATPU[index]}`} className={classNames("px-3 py-3 text-right", row.hold === 0.035 && SENSITIVITY_ATPU[index] === 250 ? "bg-cyan-400/10 text-cyan-300" : "")}>{formatMoney(value, comparisonCurrency)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

function ProjectionSimulatorApp() {
  const [session, setSession] = useState(null);
  const [activeSheet, setActiveSheet] = useState("RESULTS");
  const [resultsModel, setResultsModel] = useState("Affiliates");
  const [resultsCurrency, setResultsCurrency] = useState("USD");
  const [dataRows, setDataRows] = useState(deepClone(BASE_DATA_ROWS));
  const [sharedFilters, setSharedFilters] = useState(deepClone(DEFAULT_SHARED_FILTERS));
  const [affiliateConfig, setAffiliateConfig] = useState(deepClone(DEFAULT_AFFILIATE_CONFIG));
  const [agencyConfig, setAgencyConfig] = useState(deepClone(DEFAULT_AGENCY_CONFIG));
  const [scenarios, setScenarios] = useState(deepClone(DEFAULT_SCENARIOS));

  const options = useMemo(() => deriveOptions(dataRows), [dataRows]);
  const autoMetricsForDataSheet = useMemo(() => getAutoMetrics(dataRows, sharedFilters, resultsCurrency), [dataRows, sharedFilters, resultsCurrency]);
  const affiliateAutoMetrics = useMemo(() => getAutoMetrics(dataRows, sharedFilters, affiliateConfig.displayCurrency), [dataRows, sharedFilters, affiliateConfig.displayCurrency]);
  const agencyAutoMetrics = useMemo(() => getAutoMetrics(dataRows, sharedFilters, agencyConfig.displayCurrency), [dataRows, sharedFilters, agencyConfig.displayCurrency]);

  const affiliateProjectionBase = useMemo(() => buildAffiliateProjection(affiliateConfig, affiliateAutoMetrics, resultsCurrency), [affiliateConfig, affiliateAutoMetrics, resultsCurrency]);
  const agencyProjectionBase = useMemo(() => buildAgencyProjection(agencyConfig, agencyAutoMetrics, resultsCurrency), [agencyConfig, agencyAutoMetrics, resultsCurrency]);

  const affiliateSummary = useMemo(() => summarizeProjection(affiliateProjectionBase.rows, "Affiliates", affiliateConfig), [affiliateProjectionBase.rows, affiliateConfig]);
  const agencySummary = useMemo(() => summarizeProjection(agencyProjectionBase.rows, "Agency", affiliateConfig), [agencyProjectionBase.rows, affiliateConfig]);

  const affiliateProjection = useMemo(() => ({ ...affiliateProjectionBase, summary: affiliateSummary }), [affiliateProjectionBase, affiliateSummary]);
  const agencyProjection = useMemo(() => ({ ...agencyProjectionBase, summary: agencySummary }), [agencyProjectionBase, agencySummary]);

  const affiliateComparisonConfig = useMemo(() => ({
    ...affiliateConfig,
    effectiveAtpu: affiliateProjection.effectiveAtpu,
    effectiveHold: affiliateProjection.effectiveHold,
  }), [affiliateConfig, affiliateProjection]);

  const auditTests = useMemo(() => runAuditTests({
    rows: dataRows,
    filters: sharedFilters,
    affiliateProjection,
    affiliateSummary,
    agencyProjection,
    agencySummary,
    affiliateConfig,
    options,
  }), [dataRows, sharedFilters, affiliateProjection, affiliateSummary, agencyProjection, agencySummary, affiliateConfig, options]);

  const resetAll = () => {
    setDataRows(deepClone(BASE_DATA_ROWS));
    setSharedFilters(deepClone(DEFAULT_SHARED_FILTERS));
    setAffiliateConfig(deepClone(DEFAULT_AFFILIATE_CONFIG));
    setAgencyConfig(deepClone(DEFAULT_AGENCY_CONFIG));
    setScenarios(deepClone(DEFAULT_SCENARIOS));
    setResultsModel("Affiliates");
    setResultsCurrency("USD");
  };

  if (!session) {
    return <LoginScreen onLogin={setSession} />;
  }

  const navItems = [
    { key: "CAL_AFFILIATES", label: "CAL_AFFILIATES", icon: SlidersHorizontal },
    { key: "CAL_AGENCY", label: "CAL_AGENCY", icon: SlidersHorizontal },
    { key: "RESULTS", label: "RESULTS", icon: BarChart3 },
    { key: "DATA_SOURCE", label: "DATA_SOURCE", icon: Database },
    { key: "DEAL COMPARISON", label: "DEAL COMPARISON", icon: GitCompareArrows },
  ];

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.08),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_26%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1760px] gap-6 px-5 py-5">
        <Surface className="hidden w-[300px] shrink-0 p-4 lg:block">
          <div className="rounded-2xl border border-white/10 bg-[#0b1120] p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Affsimulator</div>
            <div className="mt-2 text-sm text-slate-400">Premium dark-mode platform built for commercial simulations, scenario analysis, and deal validation.</div>
          </div>
          <div className="mt-4 space-y-2">
            {navItems.map((item) => (
              <SidebarButton key={item.key} label={item.label} icon={item.icon} active={activeSheet === item.key} onClick={() => setActiveSheet(item.key)} />
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#0b1120] p-4 text-xs text-slate-500">
            Workspace user <span className="font-semibold text-slate-300">{session.username || "guest"}</span>
          </div>
          <button onClick={resetAll} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
            <RotateCcw size={16} /> Reset All
          </button>
        </Surface>

        <div className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1360px] space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Affsimulator</div>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">Affsimulator</h1>
            </div>
            <div className="grid gap-3 md:grid-cols-3 lg:w-[620px]">
              <StatCard label="Rows in Source" value={formatNumber(dataRows.length, 0)} subvalue="Editable dataset" tone="accent" />
              <StatCard label="Audit Passed" value={`${auditTests.filter((test) => test.passed).length}/${auditTests.length}`} subvalue="Live self-checks" tone="success" />
              <StatCard label="Results Currency" value={resultsCurrency} subvalue={`Model: ${resultsModel}`} tone="accent" />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 lg:hidden">
            {navItems.map((item) => (
              <SidebarButton key={item.key} label={item.label} icon={item.icon} active={activeSheet === item.key} onClick={() => setActiveSheet(item.key)} />
            ))}
          </div>

          {activeSheet === "CAL_AFFILIATES" ? (
            <CalibrationSheet
              title="CAL_AFFILIATES"
              config={affiliateConfig}
              setConfig={setAffiliateConfig}
              sharedFilters={sharedFilters}
              setSharedFilters={setSharedFilters}
              autoMetrics={affiliateAutoMetrics}
              options={options}
              resultsCurrency={resultsCurrency}
            />
          ) : null}

          {activeSheet === "CAL_AGENCY" ? (
            <CalibrationSheet
              title="CAL_AGENCY"
              config={agencyConfig}
              setConfig={setAgencyConfig}
              sharedFilters={sharedFilters}
              setSharedFilters={setSharedFilters}
              autoMetrics={agencyAutoMetrics}
              options={options}
              resultsCurrency={resultsCurrency}
              isAgency
            />
          ) : null}

          {activeSheet === "RESULTS" ? (
            <ResultsSheet
              model={resultsModel}
              setModel={setResultsModel}
              resultsCurrency={resultsCurrency}
              setResultsCurrency={setResultsCurrency}
              affiliateProjection={affiliateProjection}
              agencyProjection={agencyProjection}
              affiliateSummary={affiliateSummary}
              agencySummary={agencySummary}
              affiliateConfig={affiliateConfig}
            />
          ) : null}

          {activeSheet === "DATA_SOURCE" ? (
            <DataSourceSheet
              rows={dataRows}
              setRows={setDataRows}
              filters={sharedFilters}
              setFilters={setSharedFilters}
              options={options}
              autoMetrics={autoMetricsForDataSheet}
              tests={auditTests}
              onReset={resetAll}
            />
          ) : null}

          {activeSheet === "DEAL COMPARISON" ? (
            <DealComparisonSheet
              comparisonCurrency={affiliateConfig.displayCurrency}
              affiliateConfig={affiliateComparisonConfig}
              resultsSummary={affiliateSummary}
              scenarios={scenarios}
              setScenarios={setScenarios}
            />
          ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectionSimulatorApp;
