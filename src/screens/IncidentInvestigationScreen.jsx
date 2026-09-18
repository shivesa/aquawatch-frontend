import React, { useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import ScenarioBar from '../components/common/ScenarioBar';

export default function IncidentInvestigationScreen() {
  const {
    effectiveLeakRate,
    financialImpact,
    incidentStatus,
    setIncidentStatus,
    isAcknowledged,
    setIsAcknowledged,
    formattedElapsedTime,
    checklist,
    toggleChecklistItem,
    technicianNotes,
    setTechnicianNotes,
    isolatedValves,
    toggleValveIsolation,
    setActiveTab,
  } = useTelemetry();

  const [findingsSubmitted, setFindingsSubmitted] = useState(false);

  const isDyeingIsolated = isolatedValves.includes('SV-04');
  const isResolved = incidentStatus === 'RESOLVED' || isDyeingIsolated;

  const verifiedCount = checklist.filter((item) => item.checked).length;

  const handleAcknowledge = () => {
    setIsAcknowledged(true);
    if (incidentStatus === 'OPEN') {
      setIncidentStatus('UNDER_TRIAGE');
    }
  };

  const handleMarkPhysicalInspection = () => {
    setIncidentStatus('PHYSICAL_INSPECTION');
    setIsAcknowledged(true);
  };

  const handleResolve = () => {
    setIncidentStatus('RESOLVED');
    if (!isDyeingIsolated) {
      toggleValveIsolation('SV-04');
    }
  };

  const handleSubmitFindings = () => {
    setFindingsSubmitted(true);
    setTimeout(() => setFindingsSubmitted(false), 4000);
  };

  return (
    <main class="ml-60 pt-14 p-gutter-desktop space-y-space-md flex-1 pb-16 overflow-y-auto">
      {/* Scenario Bar */}
      <ScenarioBar />

      {/* 1. INCIDENT HEADER BAR */}
      <div class="bg-surface-container-lowest border border-outline-variant rounded p-space-md space-y-space-md shadow-sm">
        {/* Breadcrumb + Meta */}
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant/60 pb-space-xs">
          <div class="flex items-center gap-1.5 font-label-caps text-label-caps text-on-surface-variant text-xs">
            <span>TIRUPPUR TEXTILE PROCESSING UNIT 04</span>
            <span>/</span>
            <span>ACTIVE INCIDENT DISPATCH</span>
            <span>/</span>
            <span class="text-primary font-bold">#AW-0042</span>
          </div>

          <div class="flex items-center gap-4 text-body-sm text-xs">
            <div class="flex items-center gap-1 text-on-surface-variant">
              <span class="font-label-caps text-label-caps">TRIGGER:</span>
              <span class="font-code text-code text-on-surface font-semibold">14:32:18 IST</span>
              <span class="text-error font-code text-code font-bold">
                ({formattedElapsedTime} elapsed)
              </span>
            </div>
            <div class="h-3 w-px bg-outline-variant"></div>
            <div class="flex items-center gap-1 text-on-surface-variant">
              <span class="font-label-caps text-label-caps">STATION:</span>
              <span class="font-code text-code text-on-surface font-semibold">SCADA-WS-44</span>
            </div>
          </div>
        </div>

        {/* Main Incident Title & Severity Tags */}
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div class="space-y-1">
            <div class="flex items-center gap-space-sm flex-wrap">
              <span
                class={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-label-caps text-label-caps font-bold tracking-wider text-[11px] ${
                  isResolved
                    ? 'bg-green-100 text-tertiary border border-green-300'
                    : 'bg-error-container text-error border border-error/40'
                }`}
              >
                {!isResolved && <span class="h-2 w-2 rounded-full bg-error animate-ping"></span>}
                {isResolved ? '● STATUS: RESOLVED / VALVE ISOLATED' : `● STATUS: ${incidentStatus}`}
              </span>

              <span
                class={`px-2 py-0.5 rounded font-label-caps text-label-caps font-bold text-xs ${
                  isResolved ? 'bg-surface-container text-outline' : 'bg-error text-on-error'
                }`}
              >
                {isResolved ? 'CONTROLLED' : 'HIGH SEVERITY'}
              </span>

              <span class="px-2 py-0.5 rounded bg-surface-container-high border border-outline-variant font-code text-code text-primary font-semibold text-xs">
                87% BAYESIAN CONFIDENCE (Most Likely Zone for Inspection)
              </span>
            </div>

            <h1 class="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
              INCIDENT #AW-0042: DYEING ZONE (LINE D-01) &mdash; ABNORMAL WATER-LOSS PATTERN
            </h1>
          </div>

          {/* Quick Action Triggers */}
          <div class="flex flex-wrap items-center gap-2">
            {/* Button 1: Acknowledge */}
            <button
              onClick={handleAcknowledge}
              class={`px-3 py-1.5 rounded border font-headline-sm text-body-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                isAcknowledged
                  ? 'border-green-300 bg-green-50 text-tertiary'
                  : 'border-amber-600/60 bg-amber-50 hover:bg-amber-100 text-amber-900'
              }`}
            >
              <span class="material-symbols-outlined text-base">done_all</span>
              <span>{isAcknowledged ? 'Acknowledged' : 'Acknowledge Incident'}</span>
              <span class="hidden xl:inline text-[10px] font-code opacity-80">POST /ack</span>
            </button>

            {/* Button 2: Mark Physical Inspection */}
            <button
              onClick={handleMarkPhysicalInspection}
              class={`px-3 py-1.5 rounded font-headline-sm text-body-sm font-semibold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer ${
                incidentStatus === 'PHYSICAL_INSPECTION'
                  ? 'bg-secondary text-on-secondary'
                  : 'bg-primary text-on-primary hover:bg-primary/90'
              }`}
            >
              <span class="material-symbols-outlined text-base">engineering</span>
              <span>
                {incidentStatus === 'PHYSICAL_INSPECTION'
                  ? 'Under Physical Inspection'
                  : 'Mark Under Physical Inspection'}
              </span>
            </button>

            {/* Button 3: Mark Resolved */}
            <button
              onClick={handleResolve}
              class="px-3 py-1.5 rounded border border-tertiary bg-surface-container-lowest hover:bg-surface-container-low text-tertiary font-headline-sm text-body-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span class="material-symbols-outlined text-base">check_circle</span>
              <span>Mark Resolved &amp; Recalibrate</span>
            </button>

            {/* Button 4: Emergency Isolation (Red Filled) */}
            <button
              onClick={() => toggleValveIsolation('SV-04')}
              class={`px-3.5 py-1.5 rounded font-headline-sm text-body-sm font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer ${
                isDyeingIsolated
                  ? 'bg-surface border border-outline-variant text-on-surface hover:bg-surface-container'
                  : 'bg-error text-on-error hover:bg-red-700 border border-red-800'
              }`}
            >
              <span class="material-symbols-outlined text-base">valve</span>
              <span>
                {isDyeingIsolated ? 'Valve SV-04 Closed (Reopen)' : 'Emergency Isolation: Shut Valve SV-04'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. TOP INCIDENT KPI STRIP (4 Key Metrics) */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
        {/* Metric 1 */}
        <div class="bg-surface-container-lowest border border-outline-variant p-space-md rounded flex flex-col justify-between relative overflow-hidden shadow-xs">
          <div class="flex items-start justify-between">
            <span class="font-label-caps text-label-caps text-on-surface-variant font-semibold uppercase text-xs">
              CURRENT UNACCOUNTED EXCESS
            </span>
            <span
              class={`px-1.5 py-0.5 rounded font-code text-[11px] font-bold ${
                effectiveLeakRate > 0
                  ? 'bg-error-container text-error'
                  : 'bg-green-100 text-tertiary'
              }`}
            >
              {effectiveLeakRate > 0 ? '+23.8%' : '0.0%'}
            </span>
          </div>
          <div class="my-space-xs">
            <div class="flex items-baseline gap-1.5">
              <span
                class={`font-metric-lg text-metric-lg font-bold tracking-tight tnum ${
                  effectiveLeakRate > 0 ? 'text-error' : 'text-tertiary'
                }`}
              >
                {effectiveLeakRate}
              </span>
              <span class="font-code text-code text-on-surface-variant font-medium">
                L/min
              </span>
            </div>
            <div class="font-body-sm text-body-sm text-on-surface-variant mt-0.5 text-xs">
              {effectiveLeakRate > 0
                ? 'Exceeding continuous baseline intake'
                : 'Isolation valve closed; zero leakage'}
            </div>
          </div>
          <div class="w-full bg-surface-container h-1 rounded-full overflow-hidden mt-1">
            <div
              class={effectiveLeakRate > 0 ? 'bg-error h-full' : 'bg-tertiary h-full'}
              style={{ width: effectiveLeakRate > 0 ? '82%' : '0%' }}
            ></div>
          </div>
        </div>

        {/* Metric 2 */}
        <div class="bg-surface-container-lowest border border-outline-variant p-space-md rounded flex flex-col justify-between shadow-xs">
          <div class="flex items-start justify-between">
            <span class="font-label-caps text-label-caps text-on-surface-variant font-semibold uppercase text-xs">
              CUMULATIVE UNACCOUNTED LOSS
            </span>
            <span class="px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-code text-[11px]">
              {formattedElapsedTime} ELAPSED
            </span>
          </div>
          <div class="my-space-xs">
            <div class="flex items-baseline gap-1.5">
              <span class="font-metric-lg text-metric-lg font-bold text-on-surface tracking-tight tnum">
                {financialImpact.cumulativeLiters.toLocaleString()}
              </span>
              <span class="font-code text-code text-on-surface-variant font-medium">
                Litres
              </span>
            </div>
            <div class="font-body-sm text-body-sm text-on-surface-variant mt-0.5 text-xs">
              Estimated fluid volume lost since trigger
            </div>
          </div>
          <div class="w-full bg-surface-container h-1 rounded-full overflow-hidden mt-1">
            <div class="bg-primary h-full" style={{ width: '64%' }}></div>
          </div>
        </div>

        {/* Metric 3 */}
        <div
          onClick={() => setActiveTab('water-loss')}
          class="bg-surface-container-lowest border border-outline-variant p-space-md rounded flex flex-col justify-between shadow-xs cursor-pointer hover:border-primary transition-colors"
          title="Click to view detailed Water Loss & Tariff Modeler"
        >
          <div class="flex items-start justify-between">
            <span class="font-label-caps text-label-caps text-on-surface-variant font-semibold uppercase text-xs">
              ESTIMATED FINANCIAL IMPACT
            </span>
            <span class="px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-code text-[11px]">
              ₹{financialImpact.baseTariff}/m³ TARIFF
            </span>
          </div>
          <div class="my-space-xs">
            <div class="flex items-baseline gap-1.5">
              <span class="font-metric-lg text-metric-lg font-bold text-on-surface tracking-tight tnum">
                ₹{financialImpact.cumulativeCost.toLocaleString()}
              </span>
              <span class="font-code text-code text-on-surface-variant font-medium">
                INR
              </span>
            </div>
            <div class="font-body-sm text-body-sm text-on-surface-variant mt-0.5 text-xs">
              Click to open water loss analytics
            </div>
          </div>
          <div class="w-full bg-surface-container h-1 rounded-full overflow-hidden mt-1">
            <div class="bg-outline h-full" style={{ width: '35%' }}></div>
          </div>
        </div>

        {/* Metric 4 */}
        <div class="bg-surface-container-lowest border border-outline-variant p-space-md rounded flex flex-col justify-between shadow-xs">
          <div class="flex items-start justify-between">
            <span class="font-label-caps text-label-caps text-on-surface-variant font-semibold uppercase text-xs">
              PRIMARY HYDRAULIC PRESSURE
            </span>
            <span
              class={`px-1.5 py-0.5 rounded font-code text-[11px] font-bold ${
                isResolved
                  ? 'bg-green-100 text-tertiary'
                  : 'bg-error-container text-error'
              }`}
            >
              {isResolved ? 'NORMALIZED' : '-0.8 bar DROP'}
            </span>
          </div>
          <div class="my-space-xs">
            <div class="flex items-baseline gap-1.5">
              <span
                class={`font-metric-lg text-metric-lg font-bold tracking-tight tnum ${
                  isResolved ? 'text-tertiary' : 'text-error'
                }`}
              >
                {isResolved ? '3.2' : '2.4'}
              </span>
              <span class="font-code text-code text-on-surface-variant font-medium">
                bar
              </span>
            </div>
            <div class="font-body-sm text-body-sm text-on-surface-variant mt-0.5 text-xs">
              Nominal standard: 3.2 bar at Junction DJ-04
            </div>
          </div>
          <div class="w-full bg-surface-container h-1 rounded-full overflow-hidden mt-1">
            <div
              class={isResolved ? 'bg-tertiary h-full' : 'bg-error h-full'}
              style={{ width: isResolved ? '80%' : '48%' }}
            ></div>
          </div>
        </div>
      </div>

      {/* 3. TWO-COLUMN DEEP DIAGNOSTIC & EXPLAINABILITY SECTION */}
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
        {/* LEFT COLUMN: Telemetry & Explainability Evidence (7 Cols) */}
        <div class="lg:col-span-7 space-y-space-md">
          {/* Multi-Signal Matrix Card */}
          <div class="bg-surface-container-lowest border border-outline-variant rounded p-space-md space-y-space-sm shadow-xs">
            <div class="flex items-center justify-between border-b border-outline-variant/70 pb-2">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">fact_check</span>
                <h2 class="font-headline-sm text-headline-sm font-bold text-on-surface">
                  WHY THIS WAS FLAGGED &mdash; MULTI-SIGNAL EXPLAINABILITY MATRIX
                </h2>
              </div>
              <span class="px-2 py-0.5 rounded bg-surface-container font-code text-code text-on-surface-variant text-xs">
                6 VERIFIED SIGNALS
              </span>
            </div>

            {/* Credibility Banner */}
            <div class="p-2.5 rounded bg-surface-container-low border-l-2 border-primary text-body-sm text-on-surface-variant flex items-start gap-2 text-xs">
              <span class="material-symbols-outlined text-primary mt-0.5 text-sm">info</span>
              <p>
                <strong>Industrial Credibility Note:</strong> The system does not claim certainty of a physical leak. It prioritizes zones by cross-referencing live production recipe states against high-frequency hydraulic and acoustic telemetry.
              </p>
            </div>

            {/* Explainability Diagnostic Rows */}
            <div class="divide-y divide-outline-variant/40 pt-1 text-body-sm">
              <div class="py-2.5 flex items-start gap-3">
                <span
                  class="material-symbols-outlined text-tertiary mt-0.5"
                  style={{ fontVariationSettings: "'FILL' 1", fontSize: '18px' }}
                >
                  check_circle
                </span>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <strong class="text-on-surface">1. Mass Continuity Balance Violation</strong>
                    <span class="text-code text-xs text-error font-bold">&Delta;Q = 240 L/min</span>
                  </div>
                  <p class="text-xs text-on-surface-variant mt-0.5">
                    Main inflow FM-01 (1,420 L/min) strictly exceeds summed zone consumption (1,180 L/min).
                  </p>
                </div>
              </div>

              <div class="py-2.5 flex items-start gap-3">
                <span
                  class="material-symbols-outlined text-tertiary mt-0.5"
                  style={{ fontVariationSettings: "'FILL' 1", fontSize: '18px' }}
                >
                  check_circle
                </span>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <strong class="text-on-surface">2. Production Context Decoupling</strong>
                    <span class="text-code text-xs text-error font-bold">+23.8% Residual</span>
                  </div>
                  <p class="text-xs text-on-surface-variant mt-0.5">
                    Flow elevated beyond legitimate batch recipe baseline for 1,240 kg cotton load.
                  </p>
                </div>
              </div>

              <div class="py-2.5 flex items-start gap-3">
                <span
                  class="material-symbols-outlined text-tertiary mt-0.5"
                  style={{ fontVariationSettings: "'FILL' 1", fontSize: '18px' }}
                >
                  check_circle
                </span>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <strong class="text-on-surface">3. Localized Pressure Depression</strong>
                    <span class="text-code text-xs text-error font-bold">2.4 bar (Drop 0.8)</span>
                  </div>
                  <p class="text-xs text-on-surface-variant mt-0.5">
                    Pressure transmitter PT-04 at Junction DJ-04 dropped while other branches remained stable.
                  </p>
                </div>
              </div>

              <div class="py-2.5 flex items-start gap-3">
                <span
                  class="material-symbols-outlined text-tertiary mt-0.5"
                  style={{ fontVariationSettings: "'FILL' 1", fontSize: '18px' }}
                >
                  check_circle
                </span>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <strong class="text-on-surface">4. High-Frequency Ultrasonic Cavitation</strong>
                    <span class="text-code text-xs text-error font-bold">7.4 kHz Anomaly</span>
                  </div>
                  <p class="text-xs text-on-surface-variant mt-0.5">
                    Acoustic hydrophone AN-08 detected micro-jet acoustic hiss characteristic of a flange leak.
                  </p>
                </div>
              </div>

              <div class="py-2.5 flex items-start gap-3">
                <span
                  class="material-symbols-outlined text-tertiary mt-0.5"
                  style={{ fontVariationSettings: "'FILL' 1", fontSize: '18px' }}
                >
                  check_circle
                </span>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <strong class="text-on-surface">5. EWMA Persistence Criterion Met</strong>
                    <span class="text-code text-xs text-primary font-bold">t &gt; 180 sec</span>
                  </div>
                  <p class="text-xs text-on-surface-variant mt-0.5">
                    Divergence sustained past noise window, filtering out pump startup transients.
                  </p>
                </div>
              </div>

              <div class="py-2.5 flex items-start gap-3">
                <span
                  class="material-symbols-outlined text-tertiary mt-0.5"
                  style={{ fontVariationSettings: "'FILL' 1", fontSize: '18px' }}
                >
                  check_circle
                </span>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <strong class="text-on-surface">6. Non-Revenue Water (NRW) Severity Threshold</strong>
                    <span class="text-code text-xs text-primary font-bold">Tier 1 Trigger</span>
                  </div>
                  <p class="text-xs text-on-surface-variant mt-0.5">
                    Projected hourly loss exceeds ₹1,440/hr industrial threshold for urgent dispatch.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* High-Frequency Waveform SVG Chart */}
          <div class="bg-surface-container-lowest border border-outline-variant rounded p-space-md space-y-space-sm shadow-xs">
            <div class="flex items-center justify-between border-b border-outline-variant/70 pb-2">
              <h3 class="font-headline-sm text-headline-sm font-bold text-on-surface">
                HIGH-FREQUENCY WAVEFORM &amp; DYNAMIC TOLERANCE BAND
              </h3>
              <span class="text-code font-code text-xs text-error font-bold">
                BREACH AT 14:32:18
              </span>
            </div>

            <div class="w-full h-44 bg-surface-container-low/40 rounded border border-outline-variant/50 p-2 relative">
              <svg class="w-full h-full overflow-visible" viewBox="0 0 700 150">
                {/* Grid lines */}
                <line stroke="#c0c7d1" strokeDasharray="2 2" strokeWidth="0.8" x1="40" x2="680" y1="20" y2="20" />
                <line stroke="#c0c7d1" strokeDasharray="2 2" strokeWidth="0.8" x1="40" x2="680" y1="55" y2="55" />
                <line stroke="#c0c7d1" strokeDasharray="2 2" strokeWidth="0.8" x1="40" x2="680" y1="90" y2="90" />
                <line stroke="#c0c7d1" strokeWidth="1" x1="40" x2="680" y1="125" y2="125" />

                {/* Y-axis labels */}
                <text fill="#707881" fontFamily="JetBrains Mono" fontSize="10" x="5" y="24">1,500 L</text>
                <text fill="#707881" fontFamily="JetBrains Mono" fontSize="10" x="5" y="59">1,300 L</text>
                <text fill="#707881" fontFamily="JetBrains Mono" fontSize="10" x="5" y="94">1,185 L</text>
                <text fill="#707881" fontFamily="JetBrains Mono" fontSize="10" x="5" y="129">1,000 L</text>

                {/* Tolerance Band (Polygon) */}
                <polygon
                  fill="#dae2fd"
                  opacity="0.45"
                  points="40,84 150,84 220,82 300,80 450,78 680,78 680,98 450,98 300,100 220,100 150,98 40,98"
                />

                {/* Baseline Track (Dashed line) */}
                <line stroke="#00507d" strokeDasharray="4 4" strokeWidth="1.5" x1="40" x2="680" y1="91" y2="88" />

                {/* Breach Point Marker Line */}
                <line stroke="#ba1a1a" strokeDasharray="3 3" strokeWidth="1.2" x1="280" x2="280" y1="10" y2="135" />
                <circle cx="280" cy="52" fill="#ba1a1a" r="4" />

                {/* Actual Measured Flow (Red Continuous Stroke) */}
                <polyline
                  fill="none"
                  points="40,90 90,92 140,89 190,82 230,70 280,52 340,36 420,34 500,35 580,33 680,34"
                  stroke="#ba1a1a"
                  strokeLinejoin="round"
                  strokeWidth="2.2"
                />

                {/* Annotation Box */}
                <rect fill="#ffffff" height="24" rx="2" stroke="#ba1a1a" strokeWidth="1" width="136" x="290" y="44" />
                <text fill="#ba1a1a" fontFamily="JetBrains Mono" fontSize="9.5" fontWeight="600" x="295" y="58">
                  14:32 BREACH (+23.8%)
                </text>

                {/* X-axis Labels */}
                <text fill="#707881" fontFamily="JetBrains Mono" fontSize="9.5" x="40" y="142">14:28</text>
                <text fill="#707881" fontFamily="JetBrains Mono" fontSize="9.5" x="150" y="142">14:30</text>
                <text fill="#ba1a1a" fontFamily="JetBrains Mono" fontSize="9.5" fontWeight="700" x="270" y="142">14:32:18</text>
                <text fill="#707881" fontFamily="JetBrains Mono" fontSize="9.5" x="390" y="142">14:35</text>
                <text fill="#707881" fontFamily="JetBrains Mono" fontSize="9.5" x="510" y="142">14:38</text>
                <text fill="#707881" fontFamily="JetBrains Mono" fontSize="9.5" x="630" y="142">14:42 (NOW)</text>
              </svg>
            </div>
            <div class="flex items-center justify-between text-body-sm font-code text-[11px] text-on-surface-variant pt-1 flex-wrap">
              <span>Sampling: 1000ms</span>
              <span>EWMA Factor (&lambda;): 0.20</span>
              <span>Sensor: FM-01 Header Magmeter</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Root Cause Timeline & Zone Confidence Ranking (5 Cols) */}
        <div class="lg:col-span-5 space-y-space-md">
          {/* Zone Probabilistic Ranking */}
          <div class="bg-surface-container-lowest border border-outline-variant rounded p-space-md space-y-space-sm shadow-xs">
            <div class="flex items-center justify-between border-b border-outline-variant/70 pb-2">
              <h3 class="font-headline-sm text-headline-sm font-bold text-on-surface">
                ZONE PROBABILISTIC RANKING
              </h3>
              <span class="font-code text-code text-[11px] text-on-surface-variant font-semibold">
                BAYESIAN INFERENCE v2.4
              </span>
            </div>

            <div class="space-y-space-sm pt-1">
              {/* Zone 1 (Target) */}
              <div class="p-3 rounded bg-surface-container-low border border-error/40 space-y-1.5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                    <span class="font-headline-sm text-body-sm font-bold text-on-surface">
                      1. Dyeing Zone (Line D-01)
                    </span>
                  </div>
                  <span class="px-2 py-0.5 rounded bg-error text-on-error font-code text-code font-bold text-xs">
                    87% CONFIDENCE
                  </span>
                </div>
                <div class="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                  <div class="bg-error h-full" style={{ width: '87%' }}></div>
                </div>
                <div class="flex items-center justify-between font-code text-code text-[11px] text-on-surface-variant flex-wrap">
                  <span>Deviation: <strong class="text-error">+23.8%</strong></span>
                  <span>Pressure: <strong class="text-error">2.4 bar</strong> (Nom: 3.2)</span>
                  <span>Acoustic: <strong class="text-error">7.4 kHz</strong></span>
                </div>
              </div>

              {/* Zone 2 */}
              <div class="p-3 rounded bg-surface-container-lowest border border-outline-variant space-y-1.5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-outline"></span>
                    <span class="font-headline-sm text-body-sm font-medium text-on-surface">
                      2. Washing Zone (Line W-01)
                    </span>
                  </div>
                  <span class="px-2 py-0.5 rounded bg-surface-container text-on-surface font-code text-code font-semibold text-xs">
                    31% CONFIDENCE
                  </span>
                </div>
                <div class="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                  <div class="bg-outline h-full" style={{ width: '31%' }}></div>
                </div>
                <div class="flex items-center justify-between font-code text-code text-[11px] text-on-surface-variant flex-wrap">
                  <span>Deviation: <strong>+3.3%</strong></span>
                  <span>Pressure: <strong>2.7 bar</strong></span>
                  <span>Acoustic: <strong>Nominal</strong></span>
                </div>
              </div>

              {/* Zone 3 */}
              <div class="p-3 rounded bg-surface-container-lowest border border-outline-variant space-y-1.5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-tertiary"></span>
                    <span class="font-headline-sm text-body-sm font-medium text-on-surface">
                      3. Rinsing Zone (Line R-01)
                    </span>
                  </div>
                  <span class="px-2 py-0.5 rounded bg-surface-container text-on-surface font-code text-code font-semibold text-xs">
                    18% CONFIDENCE
                  </span>
                </div>
                <div class="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                  <div class="bg-tertiary h-full" style={{ width: '18%' }}></div>
                </div>
                <div class="flex items-center justify-between font-code text-code text-[11px] text-on-surface-variant flex-wrap">
                  <span>Deviation: <strong>-2.0%</strong></span>
                  <span>Pressure: <strong>2.5 bar</strong></span>
                  <span>Acoustic: <strong>Quiet</strong></span>
                </div>
              </div>
            </div>

            <div class="text-[11px] font-body-sm text-on-surface-variant pt-1 leading-snug">
              <em>* Note:</em> Confidence indicates how strongly available telemetry supports prioritizing this zone for physical inspection, not an unvalidated physical leak confirmation.
            </div>
          </div>

          {/* Chronological Incident Timeline */}
          <div class="bg-surface-container-lowest border border-outline-variant rounded p-space-md space-y-space-sm shadow-xs">
            <div class="flex items-center justify-between border-b border-outline-variant/70 pb-2">
              <h3 class="font-headline-sm text-headline-sm font-bold text-on-surface">
                CHRONOLOGICAL INCIDENT TIMELINE
              </h3>
              <span class="font-code text-code text-[11px] text-on-surface-variant font-semibold">
                AUDIT LOG
              </span>
            </div>

            <div class="relative pl-6 space-y-3.5 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-outline-variant text-xs">
              <div class="relative">
                <span class="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-outline-variant border-2 border-surface-container-lowest"></span>
                <div class="flex items-baseline gap-2">
                  <span class="font-code text-code font-semibold text-on-surface-variant">14:28:00</span>
                  <span class="font-headline-sm text-body-sm font-semibold text-on-surface">Baseline Normal</span>
                </div>
                <p class="font-body-sm text-body-sm text-on-surface-variant">
                  Batch DY-2409 bath ramp. Inflow &amp; zone submeters tracking expected recipe curve within ±2.1%.
                </p>
              </div>

              <div class="relative">
                <span class="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-outline-variant border-2 border-surface-container-lowest"></span>
                <div class="flex items-baseline gap-2">
                  <span class="font-code text-code font-semibold text-on-surface-variant">14:30:15</span>
                  <span class="font-headline-sm text-body-sm font-semibold text-on-surface">Initial Inflow Ramp</span>
                </div>
                <p class="font-body-sm text-body-sm text-on-surface-variant">
                  Header flow FM-01 increases to 1,310 L/min without corresponding recipe command.
                </p>
              </div>

              <div class="relative">
                <span class="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-error border-2 border-surface-container-lowest"></span>
                <div class="flex items-baseline gap-2">
                  <span class="font-code text-code font-bold text-error">14:32:18</span>
                  <span class="font-headline-sm text-body-sm font-bold text-error">Deviation Exceeds Dynamic Band</span>
                </div>
                <p class="font-body-sm text-body-sm text-on-surface-variant">
                  Deviation reaches +19.8% (Intake: 1,420 L/min). Preliminary alert triggered on SCADA-WS-44.
                </p>
              </div>

              <div class="relative">
                <span class="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-error border-2 border-surface-container-lowest"></span>
                <div class="flex items-baseline gap-2">
                  <span class="font-code text-code font-semibold text-on-surface-variant">14:33:45</span>
                  <span class="font-headline-sm text-body-sm font-semibold text-on-surface">EWMA Persistence Confirmed</span>
                </div>
                <p class="font-body-sm text-body-sm text-on-surface-variant">
                  Persistence window reached (t &gt; 180s). Anomaly flagged as sustained water-loss pattern.
                </p>
              </div>

              <div class="relative">
                <span class="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-error border-2 border-surface-container-lowest"></span>
                <div class="flex items-baseline gap-2">
                  <span class="font-code text-code font-semibold text-on-surface-variant">14:34:10</span>
                  <span class="font-headline-sm text-body-sm font-semibold text-on-surface">Water Balance Mismatch Confirmed</span>
                </div>
                <p class="font-body-sm text-body-sm text-on-surface-variant">
                  Mass continuity violation &Delta;Q = 240 L/min verified against submeters FM-02..07.
                </p>
              </div>

              <div class="relative">
                <span class="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-surface-container-lowest"></span>
                <div class="flex items-baseline gap-2">
                  <span class="font-code text-code font-semibold text-on-surface-variant">14:35:00</span>
                  <span class="font-headline-sm text-body-sm font-semibold text-on-surface">Bayesian Zone Ranking</span>
                </div>
                <p class="font-body-sm text-body-sm text-on-surface-variant">
                  Dyeing Zone ranked #1 (87% confidence) driven by pressure collapse to 2.4 bar and hydrophone AN-08 acoustic spike.
                </p>
              </div>

              <div class="relative">
                <span class="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-tertiary border-2 border-surface-container-lowest"></span>
                <div class="flex items-baseline gap-2">
                  <span class="font-code text-code font-semibold text-on-surface-variant">14:36:20</span>
                  <span class="font-headline-sm text-body-sm font-semibold text-tertiary">Dispatch Recommendation</span>
                </div>
                <p class="font-body-sm text-body-sm text-on-surface-variant">
                  Incident #AW-0042 dispatched to field tablet; physical floor inspection SOP-WAT-04 activated for Line D-01.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. OPERATIONAL INSPECTION CHECKLIST & FIELD PROTOCOL */}
      <div class="bg-surface-container-lowest border border-outline-variant rounded p-space-md space-y-space-md shadow-xs">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/70 pb-2">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">checklist</span>
            <div>
              <h2 class="font-headline-sm text-headline-sm font-bold text-on-surface">
                OPERATOR FIELD INSPECTION CHECKLIST (STANDARD OPERATING PROCEDURE SOP-WAT-04)
              </h2>
              <p class="font-body-sm text-body-sm text-on-surface-variant text-xs">
                Mandatory verification protocol prior to manual valve override or batch abort
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded bg-surface-container font-code text-code text-on-surface text-xs font-bold">
              PROGRESS: {verifiedCount} / {checklist.length} VERIFIED
            </span>
            <span class="px-2 py-0.5 rounded bg-surface-container-high text-primary font-code text-code text-xs font-semibold">
              TECHNICIAN: T. ELANGOVAN
            </span>
          </div>
        </div>

        {/* Checklist Items Grid */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          {checklist.map((item) => (
            <label
              key={item.id}
              class={`flex items-start gap-3 p-3 rounded border cursor-pointer transition-colors ${
                item.status === 'ACTION_REQ' && !item.checked
                  ? 'border-error/50 bg-error-container/10 hover:bg-error-container/20'
                  : item.checked
                  ? 'border-green-300 bg-green-50/40 hover:bg-green-50/70'
                  : 'border-outline-variant hover:bg-surface-container-low bg-surface-container-lowest'
              }`}
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleChecklistItem(item.id)}
                class="mt-1 rounded text-primary focus:ring-primary h-4 w-4 border-outline-variant cursor-pointer"
              />
              <div class="space-y-1 flex-1">
                <div class="flex items-center justify-between">
                  <span
                    class={`font-headline-sm text-body-sm font-semibold ${
                      item.status === 'ACTION_REQ' && !item.checked ? 'text-error' : 'text-on-surface'
                    }`}
                  >
                    {item.title}
                  </span>
                  <span
                    class={`px-1.5 py-0.2 rounded font-code text-[10px] font-bold ${
                      item.checked
                        ? 'bg-tertiary-container/20 text-tertiary'
                        : item.status === 'ACTION_REQ'
                        ? 'bg-error text-on-error'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    {item.checked ? 'VERIFIED' : item.status}
                  </span>
                </div>
                <p class="font-body-sm text-body-sm text-on-surface-variant text-xs">{item.task}</p>
                <div
                  class={`font-code text-code text-[11px] pt-0.5 ${
                    item.status === 'ACTION_REQ' && !item.checked
                      ? 'text-error font-semibold'
                      : 'text-on-surface-variant'
                  }`}
                >
                  Finding: {item.finding}
                </div>
              </div>
            </label>
          ))}
        </div>

        {/* Dispatcher Notes & Final Action */}
        <div class="pt-2 border-t border-outline-variant/60 space-y-space-sm">
          <div class="space-y-1">
            <label class="font-headline-sm text-body-sm font-bold text-on-surface flex items-center justify-between">
              <span>FIELD DISPATCHER LOG &amp; PRELIMINARY TRIAGE NOTES:</span>
              <span class="font-code text-code text-[11px] text-on-surface-variant font-normal">
                SOP REFERENCE: TIR-SOP-WAT-04-REV2
              </span>
            </label>
            <textarea
              rows={2}
              value={technicianNotes}
              onChange={(e) => setTechnicianNotes(e.target.value)}
              class="w-full text-body-sm font-code text-on-surface p-2.5 rounded border border-outline-variant bg-surface-container-lowest focus:ring-1 focus:ring-primary focus:border-primary text-xs"
            />
          </div>

          <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div class="flex items-center gap-2 text-body-sm text-on-surface-variant text-xs">
              <span class="material-symbols-outlined" style={{ fontSize: '16px' }}>
                history_edu
              </span>
              <span>
                Recorded under Audit Chain ID:{' '}
                <code class="font-code text-code text-on-surface font-semibold">
                  0x8F9A-44-TIR
                </code>
              </span>
            </div>

            <div class="flex items-center gap-2">
              {findingsSubmitted && (
                <span class="text-xs text-tertiary font-bold font-code flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">check_circle</span>
                  Findings Logged to SCADA!
                </span>
              )}
              <button
                onClick={handleSubmitFindings}
                class="w-full sm:w-auto px-4 py-2 rounded bg-primary text-on-primary hover:bg-primary/90 font-headline-sm text-body-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <span class="material-symbols-outlined text-base">send</span>
                <span>Submit Inspection Findings (POST /api/investigations/AW-0042)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
