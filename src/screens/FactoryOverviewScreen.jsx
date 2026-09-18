import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import ScenarioBar from '../components/common/ScenarioBar';

export default function FactoryOverviewScreen() {
  const {
    scenario,
    effectiveInflow,
    effectiveLeakRate,
    financialImpact,
    setActiveTab,
    currentScenarioKey,
    isolatedValves,
  } = useTelemetry();

  const isLeak = effectiveLeakRate > 0;
  const isSV04Isolated = isolatedValves.includes('SV-04');

  return (
    <main class="ml-60 mt-14 p-gutter-desktop space-y-space-md flex-1 pb-16">
      {/* SCENARIO INJECTOR BAR */}
      <ScenarioBar />

      {/* SECTION 1: TOP 6 INDUSTRIAL KPI CARDS */}
      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-space-md">
        {/* KPI 1: Water Intake */}
        <div
          class={`bg-surface-container-lowest border p-space-md rounded relative overflow-hidden shadow-xs ${
            isLeak ? 'border-error' : 'border-outline-variant'
          }`}
        >
          {isLeak && <div class="absolute top-0 left-0 right-0 h-1 bg-error"></div>}
          <div class="flex items-start justify-between mb-1">
            <span class="text-label-caps font-label-caps uppercase text-on-surface-variant font-semibold">
              Water Intake
            </span>
            <span
              class={`px-1.5 py-0.5 text-code font-code text-[11px] font-bold rounded tnum ${
                isLeak
                  ? 'bg-red-100 text-error border border-red-200'
                  : 'bg-green-100 text-tertiary border border-green-200'
              }`}
            >
              {isLeak ? '+19.8%' : '±0.2%'}
            </span>
          </div>
          <div
            class={`text-metric-lg font-metric-lg tnum ${
              isLeak ? 'text-error' : 'text-primary'
            }`}
          >
            {effectiveInflow.toLocaleString()}{' '}
            <span class="text-body-sm font-body-sm text-on-surface-variant font-normal">
              L/min
            </span>
          </div>
          <p class="text-code font-code text-xs text-on-surface-variant mt-1 truncate">
            Main Header Inflow (FM-01)
          </p>
        </div>

        {/* KPI 2: Expected Consumption */}
        <div class="bg-surface-container-lowest border border-outline-variant p-space-md rounded shadow-xs">
          <div class="flex items-start justify-between mb-1">
            <span class="text-label-caps font-label-caps uppercase text-on-surface-variant font-semibold">
              Expected Dynamic Baseline
            </span>
            <span class="px-1.5 py-0.5 bg-surface-container text-primary text-code font-code text-[11px] font-medium rounded">
              {scenario.batchRef.split(' ')[0]} Model
            </span>
          </div>
          <div class="text-metric-lg font-metric-lg text-primary tnum">
            {scenario.expectedInflow.toLocaleString()}{' '}
            <span class="text-body-sm font-body-sm text-on-surface-variant font-normal">
              L/min
            </span>
          </div>
          <p class="text-code font-code text-xs text-on-surface-variant mt-1 truncate">
            From {scenario.fabricWeight.toLocaleString()} kg fabric batch load
          </p>
        </div>

        {/* KPI 3: Water Balance Diagnostic */}
        <div class="bg-surface-container-lowest border border-outline-variant p-space-md rounded shadow-xs">
          <div class="flex items-start justify-between mb-1">
            <span class="text-label-caps font-label-caps uppercase text-on-surface-variant font-semibold">
              Water Balance
            </span>
            <span
              class={`px-1.5 py-0.5 text-code font-code text-[11px] font-bold rounded tnum ${
                isLeak
                  ? 'bg-amber-100 text-amber-900 border border-amber-200'
                  : 'bg-green-100 text-tertiary border border-green-200'
              }`}
            >
              {isLeak ? `${effectiveLeakRate} L/min gap` : 'Balanced'}
            </span>
          </div>
          <div class="text-metric-lg font-metric-lg text-on-surface tnum">
            {isLeak ? scenario.waterBalancePct : 99.8}
            <span class="text-metric-sm font-metric-sm text-on-surface-variant">%</span>
          </div>
          <p class="text-code font-code text-xs text-on-surface-variant mt-1 truncate">
            {isLeak ? 'Inflow 1,420 vs Summed Zones 1,180' : 'Inflow matches summed zones'}
          </p>
        </div>

        {/* KPI 4: Active Anomalies */}
        <div class="bg-surface-container-lowest border border-outline-variant p-space-md rounded shadow-xs">
          <div class="flex items-start justify-between mb-1">
            <span class="text-label-caps font-label-caps uppercase text-on-surface-variant font-semibold">
              Active Anomalies
            </span>
            <span
              class={`px-1.5 py-0.5 text-code font-code text-[11px] font-bold rounded ${
                isLeak ? 'bg-red-100 text-error' : 'bg-green-100 text-tertiary'
              }`}
            >
              {isLeak ? 'HIGH' : 'CLEAR'}
            </span>
          </div>
          <div
            class={`text-metric-lg font-metric-lg tnum ${
              isLeak ? 'text-error' : 'text-tertiary'
            }`}
          >
            {isLeak ? '1' : '0'}{' '}
            <span class="text-body-sm font-body-sm text-on-surface-variant font-normal">
              {isLeak ? 'Active' : 'Nominal'}
            </span>
          </div>
          <p class="text-code font-code text-xs text-on-surface-variant mt-1 truncate">
            {isLeak ? 'Dyeing Zone sustained deviation' : 'All sub-meter feeds nominal'}
          </p>
        </div>

        {/* KPI 5: Est. Water Loss Today */}
        <div class="bg-surface-container-lowest border border-outline-variant p-space-md rounded shadow-xs">
          <div class="flex items-start justify-between mb-1">
            <span class="text-label-caps font-label-caps uppercase text-on-surface-variant font-semibold">
              Est. Loss Today
            </span>
            <span class="px-1.5 py-0.5 bg-surface-container text-on-surface-variant text-code font-code text-[11px] font-medium rounded">
              {isLeak ? '14 min leak' : 'Zero Loss'}
            </span>
          </div>
          <div class="text-metric-lg font-metric-lg text-on-surface tnum">
            {isLeak ? financialImpact.cumulativeLiters.toLocaleString() : '0'}{' '}
            <span class="text-body-sm font-body-sm text-on-surface-variant font-normal">
              L
            </span>
          </div>
          <p class="text-code font-code text-xs text-on-surface-variant mt-1 truncate">
            {isLeak ? 'Cumulative unaccounted discharge' : '100% mass accounting verified'}
          </p>
        </div>

        {/* KPI 6: Est. Cost Impact */}
        <div class="bg-surface-container-lowest border border-outline-variant p-space-md rounded shadow-xs">
          <div class="flex items-start justify-between mb-1">
            <span class="text-label-caps font-label-caps uppercase text-on-surface-variant font-semibold">
              Cost Impact
            </span>
            <span class="px-1.5 py-0.5 bg-surface-container text-on-surface-variant text-code font-code text-[11px] font-medium rounded">
              ₹{financialImpact.baseTariff}/m³ Tariff
            </span>
          </div>
          <div class="text-metric-lg font-metric-lg text-on-surface tnum">
            ₹{isLeak ? financialImpact.cumulativeCost : '0'}{' '}
            <span class="text-body-sm font-body-sm text-on-surface-variant font-normal">
              INR
            </span>
          </div>
          <p class="text-code font-code text-xs text-on-surface-variant mt-1 truncate">
            Excludes effluent surcharge
          </p>
        </div>
      </section>

      {/* SECTION 2: CENTRAL PRODUCTION-AWARE DUAL-SERIES TIME CHART */}
      <section class="bg-surface-container-lowest border border-outline-variant rounded p-gutter-desktop shadow-xs">
        <div class="flex flex-wrap items-center justify-between border-b border-outline-variant pb-space-sm mb-space-md gap-space-sm">
          <div>
            <div class="flex items-center gap-space-sm">
              <h3 class="text-headline-sm font-headline-sm text-on-surface font-semibold">
                Expected vs Actual Water Consumption (Production Context Aware)
              </h3>
              <span class="px-2 py-0.5 rounded bg-surface-container text-primary text-code font-code text-xs font-semibold">
                Telemetry Window: 14:00 – 14:40
              </span>
            </div>
            <p class="text-body-sm font-body-sm text-on-surface-variant mt-0.5">
              Demonstrating production-awareness: Flow baseline rises legitimately with batch demand; anomaly flags ONLY on unaccounted divergence.
            </p>
          </div>

          {/* Legend */}
          <div class="flex items-center gap-space-lg text-code font-code text-xs flex-wrap">
            <div class="flex items-center gap-1.5">
              <span class="w-4 h-0.5 bg-primary inline-block border-t-2 border-dashed border-primary"></span>
              <span class="text-on-surface-variant">Expected Dynamic Baseline (L/min)</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-4 h-1 bg-secondary inline-block rounded-full"></span>
              <span class="text-on-surface font-semibold">Actual Main Inflow (L/min)</span>
            </div>
            {isLeak && (
              <div class="flex items-center gap-1.5">
                <span class="w-3 h-3 bg-red-100 border border-red-300 inline-block rounded-xs"></span>
                <span class="text-error font-medium">Anomaly Detection Window</span>
              </div>
            )}
          </div>
        </div>

        {/* Time Series Chart Canvas (SVG Vector Industrial Rendering) */}
        <div class="relative w-full h-72 bg-surface-bright rounded border border-outline-variant overflow-hidden">
          <svg class="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 280">
            {/* Grid Lines */}
            <line stroke="#CBD5E1" strokeDasharray="2 2" strokeWidth="1" x1="60" x2="980" y1="40" y2="40" />
            <line stroke="#CBD5E1" strokeDasharray="2 2" strokeWidth="1" x1="60" x2="980" y1="90" y2="90" />
            <line stroke="#CBD5E1" strokeDasharray="2 2" strokeWidth="1" x1="60" x2="980" y1="140" y2="140" />
            <line stroke="#CBD5E1" strokeDasharray="2 2" strokeWidth="1" x1="60" x2="980" y1="190" y2="190" />
            <line stroke="#94A3B8" strokeWidth="1.5" x1="60" x2="980" y1="240" y2="240" />

            {/* Y-Axis Labels */}
            <text fill="#64748B" fontFamily="JetBrains Mono" fontSize="11" textAnchor="end" x="50" y="44">1,600</text>
            <text fill="#64748B" fontFamily="JetBrains Mono" fontSize="11" textAnchor="end" x="50" y="94">1,400</text>
            <text fill="#64748B" fontFamily="JetBrains Mono" fontSize="11" textAnchor="end" x="50" y="144">1,200</text>
            <text fill="#64748B" fontFamily="JetBrains Mono" fontSize="11" textAnchor="end" x="50" y="194">1,000</text>
            <text fill="#64748B" fontFamily="JetBrains Mono" fontSize="11" textAnchor="end" x="50" y="244">800</text>

            {/* Zone 1: Valid High Production Window (14:08 to 14:22) Highlight */}
            <rect
              fill="#F0FDF4"
              fillOpacity="0.6"
              height="220"
              stroke="#BBF7D0"
              strokeDasharray="4 4"
              strokeWidth="1"
              width="240"
              x="220"
              y="20"
            />
            <text fill="#166534" fontFamily="IBM Plex Sans" fontSize="10.5" fontWeight="600" x="230" y="36">
              VALID RAMP: DYEING CYCLE START (Both Rise - NO ALARM)
            </text>

            {/* Zone 2: Abnormal Divergence Window (14:30 to 14:40) Highlight */}
            {isLeak && (
              <>
                <rect
                  fill="#FEF2F2"
                  fillOpacity="0.8"
                  height="220"
                  stroke="#FCA5A5"
                  strokeWidth="1.5"
                  width="240"
                  x="740"
                  y="20"
                />
                <line stroke="#DC2626" strokeDasharray="3 3" strokeWidth="1.5" x1="740" x2="740" y1="20" y2="240" />

                {/* Callout Box inside Chart */}
                <g transform="translate(745, 32)">
                  <rect fill="#DC2626" height="42" rx="3" width="225" x="0" y="0" />
                  <text fill="#FFFFFF" fontFamily="IBM Plex Sans" fontSize="10" fontWeight="700" x="8" y="16">
                    ANOMALY: ABNORMAL DEVIATION
                  </text>
                  <text fill="#FEE2E2" fontFamily="JetBrains Mono" fontSize="11" x="8" y="32">
                    +23.8% above expected baseline
                  </text>
                </g>
              </>
            )}

            {/* Curve 1: EXPECTED FLOW (Dashed Navy Primary) */}
            <path
              d="M 60,205 L 200,205 Q 260,205 290,146 L 460,144 L 730,144 L 840,144 L 980,144"
              fill="none"
              stroke="#00507d"
              strokeDasharray="6 4"
              strokeWidth="2.5"
            />

            {/* Curve 2: ACTUAL FLOW (Solid Teal) */}
            <path
              d={
                isLeak
                  ? "M 60,208 L 120,203 L 170,207 L 210,204 Q 260,204 290,142 L 350,147 L 420,141 L 490,145 L 580,143 L 680,144 L 730,145 Q 760,145 780,85 L 840,84 L 910,87 L 980,85"
                  : "M 60,208 L 120,203 L 170,207 L 210,204 Q 260,204 290,142 L 350,147 L 420,141 L 490,145 L 580,143 L 680,144 L 730,145 L 840,143 L 910,145 L 980,144"
              }
              fill="none"
              stroke="#006781"
              strokeWidth="3"
            />

            {/* Real-time pulse dot on actual flow current endpoint */}
            {isLeak ? (
              <>
                <circle cx="980" cy="85" fill="#DC2626" r="5" />
                <circle cx="980" cy="85" fill="none" opacity="0.6" r="9" stroke="#DC2626" strokeWidth="1.5" class="animate-ping" />
              </>
            ) : (
              <circle cx="980" cy="144" fill="#16A34A" r="5" />
            )}

            {/* X-Axis Timestamps */}
            <text fill="#64748B" fontFamily="JetBrains Mono" fontSize="11" textAnchor="middle" x="60" y="260">14:00</text>
            <text fill="#64748B" fontFamily="JetBrains Mono" fontSize="11" textAnchor="middle" x="190" y="260">14:08</text>
            <text fill="#64748B" fontFamily="JetBrains Mono" fontSize="11" textAnchor="middle" x="350" y="260">14:15</text>
            <text fill="#64748B" fontFamily="JetBrains Mono" fontSize="11" textAnchor="middle" x="510" y="260">14:22</text>
            <text fill="#64748B" fontFamily="JetBrains Mono" fontSize="11" textAnchor="middle" x="680" y="260">14:30 (Burst Start)</text>
            <text fill={isLeak ? "#DC2626" : "#64748B"} fontFamily="JetBrains Mono" fontSize="11" fontWeight={isLeak ? '700' : '400'} textAnchor="middle" x="840" y="260">14:35</text>
            <text fill={isLeak ? "#DC2626" : "#64748B"} fontFamily="JetBrains Mono" fontSize="11" fontWeight={isLeak ? '700' : '400'} textAnchor="end" x="980" y="260">14:40 (NOW)</text>
          </svg>
        </div>

        {/* Key Insights Ribbon underneath chart */}
        <div class="mt-space-md p-space-sm bg-surface-container-low rounded border border-outline-variant flex flex-wrap items-center justify-between text-body-sm font-body-sm gap-space-md">
          <div class="flex items-center gap-space-sm">
            <span class="material-symbols-outlined text-primary">lightbulb</span>
            <span class="text-on-surface">
              <strong>System Proof:</strong> At 14:10, intake surged +25% during standard batch fill. AquaWatch recognized the Dyeing cycle trigger and kept anomaly confidence at <span class="text-tertiary font-semibold font-code">0%</span>.
            </span>
          </div>
          <div class="flex items-center gap-2 text-code font-code text-xs text-on-surface-variant">
            <span>Threshold: ±5.0% tolerance</span>
            <span>•</span>
            <span class={isLeak ? 'text-error font-semibold' : 'text-tertiary font-semibold'}>
              Current Deviation: {isLeak ? '+19.8%' : '±0.2%'}
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 3: SPLIT PANEL - PRODUCTION CONTEXT & WATER BALANCE DIAGNOSTIC */}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
        {/* LEFT: PRODUCTION CONTEXT CARD */}
        <div class="bg-surface-container-lowest border border-outline-variant rounded p-gutter-desktop flex flex-col justify-between shadow-xs">
          <div>
            <div class="flex items-center justify-between border-b border-outline-variant pb-space-sm mb-space-md">
              <div class="flex items-center gap-space-sm">
                <span class="material-symbols-outlined text-primary">precision_manufacturing</span>
                <h3 class="text-headline-sm font-headline-sm text-on-surface font-semibold">
                  Production Context Correlator
                </h3>
              </div>
              <span class="px-2 py-0.5 rounded bg-green-100 text-tertiary border border-green-200 text-code font-code text-xs font-bold">
                MES LINK: SYNCHRONIZED
              </span>
            </div>

            {/* Structured Context Grid */}
            <div class="grid grid-cols-2 gap-space-md mb-space-md">
              <div class="p-space-sm bg-surface rounded border border-outline-variant">
                <p class="text-label-caps font-label-caps text-on-surface-variant uppercase font-semibold">Current Stage</p>
                <p class="text-headline-sm font-headline-sm text-on-surface font-semibold mt-0.5 flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-primary"></span>
                  Dyeing (In Progress)
                </p>
                <p class="text-code font-code text-xs text-on-surface-variant mt-1">Machine: Jet Dyeing Vessel #03</p>
              </div>

              <div class="p-space-sm bg-surface rounded border border-outline-variant">
                <p class="text-label-caps font-label-caps text-on-surface-variant uppercase font-semibold">Batch Reference</p>
                <p class="text-headline-sm font-headline-sm text-on-surface font-semibold mt-0.5">
                  {scenario.batchRef}
                </p>
                <p class="text-code font-code text-xs text-on-surface-variant mt-1">
                  Fabric Load: {scenario.fabricWeight.toLocaleString()} kg (Cotton 100%)
                </p>
              </div>

              <div class="p-space-sm bg-surface rounded border border-outline-variant">
                <p class="text-label-caps font-label-caps text-on-surface-variant uppercase font-semibold">Specific Water Intensity</p>
                <p class="text-metric-md font-metric-md text-on-surface tnum mt-0.5">
                  {scenario.recipeIntensity} <span class="text-body-sm font-body-sm font-normal text-on-surface-variant">L/kg-min</span>
                </p>
                <p class="text-code font-code text-xs text-on-surface-variant mt-1">Standard recipe benchmark</p>
              </div>

              <div class="p-space-sm bg-surface rounded border border-outline-variant">
                <p class="text-label-caps font-label-caps text-on-surface-variant uppercase font-semibold">Calculated Expected Baseline</p>
                <p class="text-metric-md font-metric-md text-primary tnum mt-0.5">
                  {scenario.expectedInflow.toLocaleString()} <span class="text-body-sm font-body-sm font-normal text-on-surface-variant">L/min</span>
                </p>
                <p class="text-code font-code text-xs text-on-surface-variant mt-1">
                  Measured: {effectiveInflow.toLocaleString()} L/min ({isLeak ? '+19.8%' : 'Optimal'})
                </p>
              </div>
            </div>

            {/* Important Engineering Note */}
            <div class="p-space-md bg-surface-container-low border-l-4 border-primary rounded-r">
              <h4 class="text-label-caps font-label-caps uppercase text-primary font-bold mb-1">
                Production-Aware Engineering Philosophy
              </h4>
              <p class="text-body-md font-body-md text-on-surface">
                &ldquo;High water consumption is not automatically treated as a loss. Expected baseline scales dynamically with active production volume and batch state.&rdquo;
              </p>
            </div>
          </div>

          <div class="pt-space-md border-t border-outline-variant flex items-center justify-between text-code font-code text-xs text-on-surface-variant mt-space-md">
            <span>Formula: <code class="text-primary font-semibold">Q_expected = (M_batch × Intensity) + Base_aux</code></span>
            <span class="text-tertiary font-semibold">Confidence: 99.2%</span>
          </div>
        </div>

        {/* RIGHT: WATER BALANCE DIAGNOSTIC */}
        <div class="bg-surface-container-lowest border border-outline-variant rounded p-gutter-desktop flex flex-col justify-between shadow-xs">
          <div>
            <div class="flex items-center justify-between border-b border-outline-variant pb-space-sm mb-space-md">
              <div class="flex items-center gap-space-sm">
                <span class="material-symbols-outlined text-primary">balance</span>
                <h3 class="text-headline-sm font-headline-sm text-on-surface font-semibold">
                  Water Balance Diagnostic
                </h3>
              </div>
              <span
                class={`px-2 py-0.5 rounded text-code font-code text-xs font-bold flex items-center gap-1 ${
                  isLeak
                    ? 'bg-red-100 text-error border border-red-200'
                    : 'bg-green-100 text-tertiary border border-green-200'
                }`}
              >
                <span class={`w-1.5 h-1.5 rounded-full ${isLeak ? 'bg-error' : 'bg-tertiary'}`}></span>
                {isLeak ? 'MISMATCH CONFIRMED' : 'CONTINUITY VERIFIED'}
              </span>
            </div>

            {/* Conservation of Mass Balance Formula Card */}
            <div class="space-y-space-sm">
              <div class="flex items-center justify-between p-space-sm bg-surface rounded border border-outline-variant">
                <div>
                  <span class="text-label-caps font-label-caps uppercase text-on-surface-variant font-semibold">
                    Main Header Inflow (FM-01)
                  </span>
                  <p class="text-code font-code text-xs text-on-surface-variant">
                    Primary factory bulk entry flow meter
                  </p>
                </div>
                <span class="text-headline-md font-headline-md text-on-surface font-semibold tnum">
                  {effectiveInflow.toLocaleString()} L/min
                </span>
              </div>

              <div class="flex items-center justify-between p-space-sm bg-surface rounded border border-outline-variant">
                <div>
                  <span class="text-label-caps font-label-caps uppercase text-on-surface-variant font-semibold">
                    Sum of Active Zone Sub-Meters (&Sigma; Q_zones)
                  </span>
                  <p class="text-code font-code text-xs text-on-surface-variant">
                    Dyeing ({scenario.dyeingFlow}) + Washing ({scenario.washingFlow}) + Finishing ({scenario.rinsingFlow})
                  </p>
                </div>
                <span class="text-headline-md font-headline-md text-primary font-semibold tnum">
                  {(scenario.dyeingFlow + scenario.washingFlow + scenario.rinsingFlow).toLocaleString()} L/min
                </span>
              </div>

              {/* Difference Bar */}
              <div
                class={`p-space-md rounded border ${
                  isLeak ? 'bg-red-50 border-error' : 'bg-green-50 border-green-300'
                }`}
              >
                <div class="flex items-center justify-between">
                  <div>
                    <span
                      class={`text-label-caps font-label-caps uppercase font-bold ${
                        isLeak ? 'text-error' : 'text-tertiary'
                      }`}
                    >
                      {isLeak ? 'Unaccounted Pipe Loss (Δ Q)' : 'Residual Variation'}
                    </span>
                    <p class="text-body-md font-body-md text-on-error-container font-medium">
                      {isLeak
                        ? 'Physical leakage occurring upstream of sub-meters'
                        : 'Flow continuity within nominal calibration tolerances'}
                    </p>
                  </div>
                  <div class="text-right">
                    <div
                      class={`text-metric-md font-metric-md tnum ${
                        isLeak ? 'text-error' : 'text-tertiary'
                      }`}
                    >
                      {effectiveLeakRate}{' '}
                      <span class="text-headline-sm font-headline-sm font-normal">L/min</span>
                    </div>
                    <span
                      class={`text-code font-code text-xs font-semibold ${
                        isLeak ? 'text-error' : 'text-tertiary'
                      }`}
                    >
                      {isLeak ? '16.9% loss margin' : '0.2% variance'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-space-md border-t border-outline-variant mt-space-md flex items-center justify-between">
            <div class="flex items-center gap-1.5 text-body-sm font-body-sm text-on-surface-variant">
              <span class="material-symbols-outlined text-primary text-base">verified</span>
              <span>
                {isLeak
                  ? 'Water balance mismatch confirmed (Supporting signal)'
                  : 'Mass balance equilibrium confirmed'}
              </span>
            </div>
            <button
              onClick={() => setActiveTab('schematic')}
              class="text-code font-code text-xs text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>View Submeter Telemetry</span>
              <span class="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 4: PRIORITY ZONE INSPECTION RANKING WIDGET */}
      <section class="bg-surface-container-lowest border border-outline-variant rounded p-gutter-desktop shadow-xs">
        <div class="flex flex-wrap items-center justify-between border-b border-outline-variant pb-space-sm mb-space-md gap-space-sm">
          <div>
            <div class="flex items-center gap-space-sm">
              <span class="material-symbols-outlined text-primary">format_list_numbered</span>
              <h3 class="text-headline-sm font-headline-sm text-on-surface font-semibold">
                Priority Zone Inspection Ranking
              </h3>
            </div>
            <p class="text-body-sm font-body-sm text-on-surface-variant mt-0.5">
              Probabilistic ranking based on multi-sensor Bayesian fusion (flow rate divergence, header pressure gradients, acoustic nodes).
            </p>
          </div>
          <div class="px-space-sm py-1 bg-surface-container rounded border border-outline-variant text-code font-code text-xs text-on-surface-variant">
            Confidence-ranked guidance &mdash; Not an unvalidated leak assertion
          </div>
        </div>

        {/* Ranked Cards Layout */}
        <div class="space-y-space-sm">
          {/* Priority #1: Dyeing Zone */}
          <div
            class={`p-space-md border-l-4 border-y border-r rounded flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md transition-colors ${
              isLeak
                ? 'bg-red-50 border-error border-red-200'
                : 'bg-surface border-outline-variant'
            }`}
          >
            <div class="flex items-start gap-space-md">
              <div
                class={`w-9 h-9 rounded flex items-center justify-center font-bold text-headline-sm ${
                  isLeak
                    ? 'bg-error text-on-error'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                #1
              </div>
              <div>
                <div class="flex items-center gap-space-sm flex-wrap">
                  <h4 class="text-headline-sm font-headline-sm text-on-surface font-bold">
                    Dyeing Processing Zone
                  </h4>
                  <span
                    class={`px-2 py-0.5 text-code font-code text-xs font-bold rounded ${
                      isLeak ? 'bg-red-200 text-error' : 'bg-green-100 text-tertiary'
                    }`}
                  >
                    {isLeak ? '87% Confidence' : '0% Confidence'}
                  </span>
                  <span class="px-2 py-0.5 bg-surface text-on-surface-variant text-code font-code text-xs rounded border border-outline-variant">
                    Zone Z-02
                  </span>
                  {isSV04Isolated && (
                    <span class="px-2 py-0.5 bg-green-100 text-tertiary text-code font-code text-xs rounded font-bold border border-green-300">
                      VALVE SV-04 ISOLATED
                    </span>
                  )}
                </div>
                <p class="text-body-md font-body-md text-on-surface mt-1">
                  {isLeak
                    ? 'Sustained +23.8% flow deviation detected alongside localized pressure drop of 2.4 bar at Line Junction DJ-04. Acoustic node AN-08 confirms high-frequency cavitation.'
                    : 'Continuous nominal pressure at 3.2 bar. Acoustic hydrophone AN-08 reporting baseline background levels.'}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-space-md w-full md:w-auto justify-end">
              <div class="text-right hidden sm:block">
                <p class="text-code font-code text-xs text-on-surface-variant">Estimated Leak Rate</p>
                <p
                  class={`text-headline-sm font-headline-sm font-semibold tnum ${
                    isLeak ? 'text-error' : 'text-tertiary'
                  }`}
                >
                  {isLeak ? '~210 L/min' : '0 L/min'}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('investigation')}
                class="px-space-md py-2 bg-primary-container text-on-primary rounded font-headline-sm text-body-sm font-semibold hover:bg-primary transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <span class="material-symbols-outlined text-base">search_check</span>
                <span>Inspect First</span>
              </button>
            </div>
          </div>

          {/* Priority #2: Washing Zone */}
          <div class="p-space-md bg-surface border border-outline-variant rounded flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
            <div class="flex items-start gap-space-md">
              <div class="w-9 h-9 rounded bg-surface-container text-on-surface-variant flex items-center justify-center font-bold text-headline-sm">
                #2
              </div>
              <div>
                <div class="flex items-center gap-space-sm">
                  <h4 class="text-headline-sm font-headline-sm text-on-surface font-semibold">
                    Continuous Washing Zone
                  </h4>
                  <span class="px-2 py-0.5 bg-amber-100 text-amber-900 text-code font-code text-xs font-semibold rounded">
                    31% Confidence
                  </span>
                  <span class="px-2 py-0.5 bg-surface-container text-on-surface-variant text-code font-code text-xs rounded">
                    Zone Z-01
                  </span>
                </div>
                <p class="text-body-md font-body-md text-on-surface-variant mt-1">
                  Minor baseline deviation (+4.1%). Normal variation within machine rinse wash tolerances. No pressure drop observed.
                </p>
              </div>
            </div>
            <div class="flex items-center gap-space-md w-full md:w-auto justify-end">
              <div class="text-right hidden sm:block">
                <p class="text-code font-code text-xs text-on-surface-variant">Pressure Differential</p>
                <p class="text-headline-sm font-headline-sm text-on-surface font-semibold tnum">0.2 bar (Nominal)</p>
              </div>
              <button
                onClick={() => setActiveTab('schematic')}
                class="px-space-md py-2 bg-surface text-on-surface border border-outline-variant rounded font-headline-sm text-body-sm font-medium hover:bg-surface-container transition-colors cursor-pointer"
              >
                Zone Details
              </button>
            </div>
          </div>

          {/* Priority #3: Rinsing & Finishing Zone */}
          <div class="p-space-md bg-surface border border-outline-variant rounded flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md opacity-90">
            <div class="flex items-start gap-space-md">
              <div class="w-9 h-9 rounded bg-surface-container text-on-surface-variant flex items-center justify-center font-bold text-headline-sm">
                #3
              </div>
              <div>
                <div class="flex items-center gap-space-sm">
                  <h4 class="text-headline-sm font-headline-sm text-on-surface font-semibold">
                    Rinsing &amp; Finishing Section
                  </h4>
                  <span class="px-2 py-0.5 bg-green-100 text-tertiary text-code font-code text-xs font-semibold rounded">
                    18% Confidence
                  </span>
                  <span class="px-2 py-0.5 bg-surface-container text-on-surface-variant text-code font-code text-xs rounded">
                    Zone Z-03
                  </span>
                </div>
                <p class="text-body-md font-body-md text-on-surface-variant mt-1">
                  Fully compliant with standard batch consumption curve. Pressure at 5.8 bar steady across all sub-manifolds.
                </p>
              </div>
            </div>
            <div class="flex items-center gap-space-md w-full md:w-auto justify-end">
              <div class="text-right hidden sm:block">
                <p class="text-code font-code text-xs text-on-surface-variant">Variance</p>
                <p class="text-headline-sm font-headline-sm text-tertiary font-semibold tnum">-1.2% (Optimal)</p>
              </div>
              <button
                onClick={() => setActiveTab('schematic')}
                class="px-space-md py-2 bg-surface text-on-surface border border-outline-variant rounded font-headline-sm text-body-sm font-medium hover:bg-surface-container transition-colors cursor-pointer"
              >
                Zone Details
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER TELEMETRY STATUS BAR */}
      <footer class="pt-space-md pb-space-lg border-t border-outline-variant flex flex-wrap items-center justify-between text-code font-code text-xs text-on-surface-variant gap-space-sm">
        <div class="flex items-center gap-space-md flex-wrap">
          <span>AquaWatch Sentinel Node: <strong>AW-NODE-TIRUPPUR-04</strong></span>
          <span>•</span>
          <span>Firmware: v3.4.12-rc</span>
          <span>•</span>
          <span class="text-tertiary font-semibold">SCADA Ingress Sync: 100 Hz</span>
        </div>
        <div>
          <span>Industrial Water Loss Intelligence System &copy; 2025</span>
        </div>
      </footer>
    </main>
  );
}
