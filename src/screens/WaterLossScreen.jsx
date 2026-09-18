import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import ScenarioBar from '../components/common/ScenarioBar';

export default function WaterLossScreen() {
  const {
    effectiveLeakRate,
    financialImpact,
    baseTariff,
    setBaseTariff,
    zldSurcharge,
    setZldSurcharge,
    scenario,
    effectiveInflow,
    isolatedValves,
    setActiveTab,
  } = useTelemetry();

  const isLeak = effectiveLeakRate > 0;
  const isSV04Isolated = isolatedValves.includes('SV-04');

  return (
    <main class="ml-60 pt-14 min-h-screen bg-background pb-16">
      <div class="p-margin-desktop space-y-space-lg max-w-[1600px] mx-auto">
        {/* Scenario Bar */}
        <ScenarioBar />

        {/* SECTION HEADER & METADATA BAR */}
        <div class="flex flex-col md:flex-row md:items-center md:justify-between pb-space-sm border-b border-outline-variant gap-space-sm">
          <div>
            <div class="flex items-center gap-space-xs text-label-caps font-label-caps text-secondary mb-1">
              <span class="material-symbols-outlined text-sm">analytics</span>
              <span>SCADA SECTION 13 // AUDIT &amp; FINANCIAL DISCREPANCY</span>
            </div>
            <h1 class="text-headline-lg font-headline-lg font-bold text-on-surface tracking-tight">
              Water Loss &amp; Financial Impact
            </h1>
            <p class="text-body-md font-body-md text-on-surface-variant mt-0.5">
              Real-time cost modeling, tariff configuration &amp; production water-intensity tracking
            </p>
          </div>

          {/* Telemetry Endpoint Indicators */}
          <div class="flex items-center gap-space-xs self-start md:self-auto flex-wrap font-code text-xs">
            <div class="inline-flex items-center gap-1.5 px-space-sm py-1 bg-surface-container-lowest border border-outline-variant rounded">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span class="text-label-caps font-label-caps text-outline">GET</span>
              <span class="font-code text-on-surface font-medium">/api/water-loss</span>
              <span class="text-label-caps font-label-caps text-tertiary">200 OK</span>
            </div>

            <div class="inline-flex items-center gap-1.5 px-space-sm py-1 bg-surface-container-lowest border border-outline-variant rounded">
              <span class="w-2 h-2 rounded-full bg-primary"></span>
              <span class="text-label-caps font-label-caps text-outline">POST</span>
              <span class="font-code text-on-surface font-medium">/api/tariffs/configure</span>
              <span class="text-label-caps font-label-caps text-outline">SYNCED</span>
            </div>
          </div>
        </div>

        {/* 1. EXECUTIVE METRIC SUMMARY STRIP */}
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-md">
          {/* Metric 1: Estimated Excess Flow */}
          <div class="bg-surface-container-lowest border border-outline-variant p-space-md rounded shadow-xs relative overflow-hidden">
            <div
              class={`absolute top-0 left-0 bottom-0 w-1 ${
                isLeak ? 'bg-error' : 'bg-tertiary'
              }`}
            ></div>
            <div class="flex items-start justify-between">
              <span class="text-label-caps font-label-caps text-on-surface-variant uppercase font-semibold">
                Estimated Excess Flow
              </span>
              <span
                class={`inline-flex items-center px-1.5 py-0.5 rounded text-label-caps font-label-caps font-bold ${
                  isLeak
                    ? 'bg-red-100 text-red-800 border border-red-300'
                    : 'bg-green-100 text-tertiary border border-green-300'
                }`}
              >
                {isLeak && <span class="w-1.5 h-1.5 rounded-full bg-red-600 pulse-dot mr-1"></span>}
                {isLeak ? 'CRITICAL' : 'NOMINAL'}
              </span>
            </div>
            <div class="mt-space-sm flex items-baseline gap-1.5">
              <span
                class={`text-metric-lg font-metric-lg tnum ${
                  isLeak ? 'text-error' : 'text-tertiary'
                }`}
              >
                {effectiveLeakRate}
              </span>
              <span class="text-body-sm font-body-sm font-semibold text-outline">
                L/min
              </span>
            </div>
            <div class="mt-space-xs text-body-sm font-body-sm text-on-surface-variant flex items-center gap-1 text-xs">
              <span
                class={`material-symbols-outlined text-sm ${
                  isLeak ? 'text-error' : 'text-tertiary'
                }`}
              >
                call_split
              </span>
              <span>{isLeak ? 'Active unmetered divergence' : 'Balanced distribution'}</span>
            </div>
          </div>

          {/* Metric 2: Estimated Loss Today */}
          <div class="bg-surface-container-lowest border border-outline-variant p-space-md rounded shadow-xs relative overflow-hidden">
            <div class="absolute top-0 left-0 bottom-0 w-1 bg-amber-500"></div>
            <div class="flex items-start justify-between">
              <span class="text-label-caps font-label-caps text-on-surface-variant uppercase font-semibold">
                Estimated Loss Today
              </span>
              <span class="text-label-caps font-label-caps text-outline bg-surface-container-low px-1.5 py-0.5 rounded border border-outline-variant">
                {isLeak ? '14m ELAPSED' : '0m'}
              </span>
            </div>
            <div class="mt-space-sm flex items-baseline gap-1.5">
              <span class="text-metric-lg font-metric-lg text-on-surface tnum">
                {isLeak ? financialImpact.cumulativeLiters.toLocaleString() : '0'}
              </span>
              <span class="text-body-sm font-body-sm font-semibold text-outline">
                Liters
              </span>
            </div>
            <div class="mt-space-xs text-body-sm font-body-sm text-on-surface-variant flex items-center gap-1 text-xs">
              <span class="material-symbols-outlined text-sm text-amber-600">timer</span>
              <span>{isLeak ? 'Across 14 min burst event' : 'Zero unmetered discharge'}</span>
            </div>
          </div>

          {/* Metric 3: Cumulative Financial Impact */}
          <div class="bg-surface-container-lowest border border-outline-variant p-space-md rounded shadow-xs relative overflow-hidden">
            <div class="absolute top-0 left-0 bottom-0 w-1 bg-primary"></div>
            <div class="flex items-start justify-between">
              <span class="text-label-caps font-label-caps text-on-surface-variant uppercase font-semibold">
                Cumulative Impact
              </span>
              <span class="text-label-caps font-label-caps text-primary bg-primary-fixed/40 px-1.5 py-0.5 rounded border border-primary/20 font-bold">
                REAL-TIME
              </span>
            </div>
            <div class="mt-space-sm flex items-baseline gap-1.5">
              <span class="text-metric-lg font-metric-lg text-primary tnum">
                ₹{isLeak ? financialImpact.cumulativeCost.toLocaleString() : '0'}
              </span>
              <span class="text-body-sm font-body-sm font-semibold text-outline">
                INR
              </span>
            </div>
            <div class="mt-space-xs text-body-sm font-body-sm text-on-surface-variant flex items-center gap-1 text-xs">
              <span class="material-symbols-outlined text-sm text-primary">price_change</span>
              <span>At ₹{baseTariff}/m³ tariff</span>
            </div>
          </div>

          {/* Metric 4: Active Industrial Tariff */}
          <div class="bg-surface-container-lowest border border-outline-variant p-space-md rounded shadow-xs relative">
            <div class="flex items-start justify-between">
              <span class="text-label-caps font-label-caps text-on-surface-variant uppercase font-semibold">
                Industrial Tariff
              </span>
              <span class="text-label-caps font-label-caps text-tertiary bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300 font-bold">
                SIPCOT T-2
              </span>
            </div>
            <div class="mt-space-sm flex items-baseline gap-1.5">
              <span class="text-metric-lg font-metric-lg text-on-surface tnum">
                ₹{baseTariff}
              </span>
              <span class="text-body-sm font-body-sm font-semibold text-outline">
                / m³
              </span>
            </div>
            <div class="mt-space-xs text-body-sm font-body-sm text-on-surface-variant flex items-center gap-1 text-xs">
              <span class="material-symbols-outlined text-sm text-secondary">calculate</span>
              <span>+ ₹{zldSurcharge}/m³ ZLD charge</span>
            </div>
          </div>

          {/* Metric 5: Specific Water Intensity */}
          <div class="bg-surface-container-lowest border border-outline-variant p-space-md rounded shadow-xs relative overflow-hidden">
            <div
              class={`absolute top-0 left-0 bottom-0 w-1 ${
                isLeak ? 'bg-error' : 'bg-tertiary'
              }`}
            ></div>
            <div class="flex items-start justify-between">
              <span class="text-label-caps font-label-caps text-on-surface-variant uppercase font-semibold">
                Water Intensity
              </span>
              <span
                class={`inline-flex items-center px-1.5 py-0.5 rounded text-label-caps font-label-caps font-bold ${
                  isLeak
                    ? 'bg-red-50 text-red-700 border border-red-300'
                    : 'bg-green-50 text-tertiary border border-green-300'
                }`}
              >
                {isLeak ? '+19.8%' : 'Optimal'}
              </span>
            </div>
            <div class="mt-space-sm flex items-baseline gap-1.5">
              <span
                class={`text-metric-lg font-metric-lg tnum ${
                  isLeak ? 'text-error' : 'text-tertiary'
                }`}
              >
                {isLeak ? '1.15' : '0.96'}
              </span>
              <span class="text-body-sm font-body-sm font-semibold text-outline">
                L/kg
              </span>
            </div>
            <div class="mt-space-xs text-body-sm font-body-sm text-on-surface-variant flex items-center gap-1 text-xs">
              <span class="material-symbols-outlined text-sm text-outline">straighten</span>
              <span>Target: <strong class="text-on-surface font-code">0.96 L/kg</strong> recipe</span>
            </div>
          </div>
        </section>

        {/* 2. CONFIGURABLE TARIFF & INTERACTIVE COST MODELER */}
        <section class="bg-surface-container-lowest border border-outline-variant rounded p-space-lg shadow-xs">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between border-b border-outline-variant/60 pb-space-md mb-space-md gap-space-sm">
            <div>
              <div class="flex items-center gap-space-xs">
                <span class="material-symbols-outlined text-primary text-lg">tune</span>
                <h2 class="text-headline-sm font-headline-sm text-on-surface font-bold">
                  Configurable Water Tariff &amp; Cost Modeling Panel
                </h2>
              </div>
              <p class="text-body-sm font-body-sm text-on-surface-variant mt-0.5">
                Simulate operational OPEX exposure across variable municipal water slab tariffs, zero-liquid-discharge (ZLD) surcharges, and secondary pumping loads.
              </p>
            </div>
            <div class="flex items-center gap-space-xs">
              <span class="inline-flex items-center gap-1 px-2 py-1 text-label-caps font-label-caps bg-surface-container-low text-on-surface-variant border border-outline-variant rounded">
                <span class="material-symbols-outlined text-xs">info</span>
                Interactive cost modeler &mdash; drag sliders to see real-time impact
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            {/* Left Controls (7 cols) */}
            <div class="lg:col-span-7 space-y-space-md">
              {/* Base Tariff Input & Presets */}
              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <label class="text-label-caps font-label-caps text-on-surface-variant uppercase font-semibold">
                    Base Municipal/Industrial Water Tariff
                  </label>
                  <span class="text-code font-code text-xs text-primary font-bold">
                    1 m³ = 1,000 Liters
                  </span>
                </div>

                <div class="flex items-center">
                  <div class="relative flex-1">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-body-md font-metric-md text-outline">
                      ₹
                    </span>
                    <input
                      type="number"
                      min={40}
                      max={300}
                      step={5}
                      value={baseTariff}
                      onChange={(e) => setBaseTariff(Number(e.target.value))}
                      class="w-full pl-8 pr-16 py-1.5 h-9 bg-surface-container-lowest border border-outline-variant rounded-l font-metric-md text-on-surface text-body-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none tnum"
                    />
                    <span class="absolute inset-y-0 right-0 flex items-center pr-3 text-body-sm font-code text-outline pointer-events-none">
                      / m³
                    </span>
                  </div>

                  {/* Tariff Preset Buttons */}
                  <div class="flex items-center border-y border-r border-outline-variant bg-surface-container-low h-9 rounded-r px-1 gap-1">
                    {[80, 100, 150].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setBaseTariff(val)}
                        class={`px-2 py-0.5 text-xs font-semibold rounded cursor-pointer transition-colors ${
                          baseTariff === val
                            ? 'bg-primary text-on-primary border border-primary'
                            : 'hover:bg-surface-container text-on-surface-variant'
                        }`}
                      >
                        ₹{val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tariff Slider */}
                <div class="space-y-1 pt-2">
                  <div class="flex justify-between text-label-caps font-label-caps text-outline text-xs">
                    <span>₹40/m³ MIN</span>
                    <span class="font-code text-primary font-bold">₹{baseTariff} / m³</span>
                    <span>₹300/m³ MAX</span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={300}
                    step={5}
                    value={baseTariff}
                    onChange={(e) => setBaseTariff(Number(e.target.value))}
                    class="w-full accent-primary cursor-pointer h-2 bg-surface-container rounded"
                  />
                </div>
              </div>

              {/* ZLD Effluent Surcharge */}
              <div class="p-space-md bg-surface-container-low rounded border border-outline-variant space-y-2">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-headline-sm text-body-sm font-bold text-on-surface">
                      Zero Liquid Discharge (ZLD) Effluent Surcharge
                    </h4>
                    <p class="text-xs text-on-surface-variant">
                      Regulatory treatment cost for unrecovered effluent volumes
                    </p>
                  </div>
                  <span class="font-metric-md font-bold text-secondary tnum text-sm">
                    +₹{zldSurcharge}/m³
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={80}
                  step={5}
                  value={zldSurcharge}
                  onChange={(e) => setZldSurcharge(Number(e.target.value))}
                  class="w-full accent-secondary cursor-pointer h-2 bg-surface-container rounded"
                />
                <div class="flex justify-between text-code text-[11px] text-on-surface-variant">
                  <span>₹0/m³ (Standard Sewer)</span>
                  <span>Effective Combined Rate: ₹{baseTariff + zldSurcharge}/m³</span>
                  <span>₹80/m³ (High TDS)</span>
                </div>
              </div>
            </div>

            {/* Right Projections Matrix (5 cols) */}
            <div class="lg:col-span-5 bg-surface-container-low p-space-md rounded border border-outline-variant space-y-3">
              <h3 class="font-headline-sm text-body-sm font-bold text-on-surface uppercase tracking-wider text-xs">
                Real-Time Financial Exposure Matrix
              </h3>

              <div class="space-y-2">
                <div class="flex items-center justify-between p-2 bg-surface-container-lowest rounded border border-outline-variant">
                  <div>
                    <span class="font-code text-xs text-on-surface-variant">Hourly Run-Rate Loss</span>
                    <p class="text-[11px] text-outline">
                      {isLeak ? `${effectiveLeakRate * 60} Liters / hr` : '0 L/hr'}
                    </p>
                  </div>
                  <span
                    class={`font-metric-md font-bold tnum text-sm ${
                      isLeak ? 'text-error' : 'text-tertiary'
                    }`}
                  >
                    ₹{isLeak ? (financialImpact.hourlyLossCost + Math.round((effectiveLeakRate * 60 / 1000) * zldSurcharge)).toLocaleString() : '0'} / hr
                  </span>
                </div>

                <div class="flex items-center justify-between p-2 bg-surface-container-lowest rounded border border-outline-variant">
                  <div>
                    <span class="font-code text-xs text-on-surface-variant">8-Hour Shift Impact</span>
                    <p class="text-[11px] text-outline">Standard textile work cycle</p>
                  </div>
                  <span
                    class={`font-metric-md font-bold tnum text-sm ${
                      isLeak ? 'text-error' : 'text-tertiary'
                    }`}
                  >
                    ₹{isLeak ? ((financialImpact.hourlyLossCost + Math.round((effectiveLeakRate * 60 / 1000) * zldSurcharge)) * 8).toLocaleString() : '0'}
                  </span>
                </div>

                <div class="flex items-center justify-between p-2 bg-surface-container-lowest rounded border border-outline-variant">
                  <div>
                    <span class="font-code text-xs text-on-surface-variant">24-Hour Daily Projection</span>
                    <p class="text-[11px] text-outline">If left unmitigated / undetected</p>
                  </div>
                  <span
                    class={`font-metric-md font-bold tnum text-sm ${
                      isLeak ? 'text-error' : 'text-tertiary'
                    }`}
                  >
                    ₹{isLeak ? ((financialImpact.hourlyLossCost + Math.round((effectiveLeakRate * 60 / 1000) * zldSurcharge)) * 24).toLocaleString() : '0'} / day
                  </span>
                </div>

                <div class="flex items-center justify-between p-2 bg-surface-container-lowest rounded border border-outline-variant">
                  <div>
                    <span class="font-code text-xs text-on-surface-variant">30-Day Monthly Risk</span>
                    <p class="text-[11px] text-outline">Cumulative operational deficit</p>
                  </div>
                  <span
                    class={`font-metric-md font-bold tnum text-sm ${
                      isLeak ? 'text-error' : 'text-tertiary'
                    }`}
                  >
                    ₹{isLeak ? ((financialImpact.hourlyLossCost + Math.round((effectiveLeakRate * 60 / 1000) * zldSurcharge)) * 24 * 30).toLocaleString() : '0'} / mo
                  </span>
                </div>
              </div>

              {/* Action Link to Incident */}
              {isLeak && (
                <button
                  onClick={() => setActiveTab('investigation')}
                  class="w-full py-2 bg-primary-container text-on-primary rounded font-headline-sm text-xs font-semibold hover:bg-primary transition-colors flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                >
                  <span class="material-symbols-outlined text-sm">troubleshoot</span>
                  <span>Isolate Leak in Incident #AW-0042 to Halt Loss</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* 3. SUBMETER VOLUMETRIC ALLOCATION TABLE */}
        <section class="bg-surface-container-lowest border border-outline-variant rounded p-space-md shadow-xs space-y-space-md">
          <div class="flex items-center justify-between border-b border-outline-variant pb-space-sm">
            <div>
              <h3 class="font-headline-sm text-headline-sm font-bold text-on-surface">
                Sub-meter Volumetric Allocation &amp; Balance Verification
              </h3>
              <p class="text-body-sm font-body-sm text-on-surface-variant text-xs mt-0.5">
                Breakdown of metered vs unaccounted flows across industrial distribution branches
              </p>
            </div>
            <span class="px-2 py-0.5 rounded bg-surface-container font-code text-code text-primary text-xs font-semibold">
              SCADA MASS CONTINUITY
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-body-sm font-body-sm border-collapse">
              <thead>
                <tr class="bg-surface-container-low text-on-surface-variant text-label-caps uppercase border-b border-outline-variant text-[11px]">
                  <th class="py-2.5 px-3">Branch / Zone</th>
                  <th class="py-2.5 px-3">Meter ID</th>
                  <th class="py-2.5 px-3">Flow Rate</th>
                  <th class="py-2.5 px-3">% of Total Inflow</th>
                  <th class="py-2.5 px-3">Hourly Cost Equiv.</th>
                  <th class="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/60 font-code text-xs">
                <tr>
                  <td class="py-3 px-3 font-bold text-on-surface">Main Bulk Intake Header</td>
                  <td class="py-3 px-3 text-primary font-semibold">FM-01</td>
                  <td class="py-3 px-3 font-bold text-primary tnum">{effectiveInflow} L/min</td>
                  <td class="py-3 px-3">100.0%</td>
                  <td class="py-3 px-3 font-bold tnum">₹{Math.round((effectiveInflow * 60 / 1000) * (baseTariff + zldSurcharge))} / hr</td>
                  <td class="py-3 px-3 text-tertiary font-semibold">Primary Supply</td>
                </tr>

                <tr>
                  <td class="py-3 px-3 font-medium text-on-surface">Dyeing Machines 01 &amp; 02</td>
                  <td class="py-3 px-3 text-on-surface-variant">FM-02 / FM-04</td>
                  <td class="py-3 px-3 tnum">{scenario.dyeingFlow} L/min</td>
                  <td class="py-3 px-3 tnum">{((scenario.dyeingFlow / effectiveInflow) * 100).toFixed(1)}%</td>
                  <td class="py-3 px-3 tnum">₹{Math.round((scenario.dyeingFlow * 60 / 1000) * baseTariff)} / hr</td>
                  <td class="py-3 px-3 text-on-surface-variant">Active Batch DY-2409</td>
                </tr>

                <tr>
                  <td class="py-3 px-3 font-medium text-on-surface">Continuous Washing Range</td>
                  <td class="py-3 px-3 text-on-surface-variant">FM-03</td>
                  <td class="py-3 px-3 tnum">{scenario.washingFlow} L/min</td>
                  <td class="py-3 px-3 tnum">{((scenario.washingFlow / effectiveInflow) * 100).toFixed(1)}%</td>
                  <td class="py-3 px-3 tnum">₹{Math.round((scenario.washingFlow * 60 / 1000) * baseTariff)} / hr</td>
                  <td class="py-3 px-3 text-tertiary">Nominal Wash</td>
                </tr>

                <tr>
                  <td class="py-3 px-3 font-medium text-on-surface">Steam Boiler &amp; Utility</td>
                  <td class="py-3 px-3 text-on-surface-variant">FM-05</td>
                  <td class="py-3 px-3 tnum">110 L/min</td>
                  <td class="py-3 px-3 tnum">{((110 / effectiveInflow) * 100).toFixed(1)}%</td>
                  <td class="py-3 px-3 tnum">₹{Math.round((110 * 60 / 1000) * baseTariff)} / hr</td>
                  <td class="py-3 px-3 text-tertiary">Closed Loop</td>
                </tr>

                <tr>
                  <td class="py-3 px-3 font-medium text-on-surface">Bleaching &amp; Pre-Treatment</td>
                  <td class="py-3 px-3 text-on-surface-variant">FM-06</td>
                  <td class="py-3 px-3 tnum">{scenario.rinsingFlow - 110} L/min</td>
                  <td class="py-3 px-3 tnum">{(((scenario.rinsingFlow - 110) / effectiveInflow) * 100).toFixed(1)}%</td>
                  <td class="py-3 px-3 tnum">₹{Math.round(((scenario.rinsingFlow - 110) * 60 / 1000) * baseTariff)} / hr</td>
                  <td class="py-3 px-3 text-tertiary">Batch Padder</td>
                </tr>

                {isLeak && (
                  <tr class="bg-red-50/70 border-t-2 border-error">
                    <td class="py-3 px-3 font-bold text-error flex items-center gap-1.5">
                      <span class="w-2 h-2 rounded-full bg-error animate-ping"></span>
                      <span>Unaccounted Pipeline Loss (&Delta;Q)</span>
                    </td>
                    <td class="py-3 px-3 font-bold text-error">Unmetered Leak</td>
                    <td class="py-3 px-3 font-bold text-error tnum">{effectiveLeakRate} L/min</td>
                    <td class="py-3 px-3 font-bold text-error tnum">
                      {((effectiveLeakRate / effectiveInflow) * 100).toFixed(1)}%
                    </td>
                    <td class="py-3 px-3 font-bold text-error tnum">
                      ₹{Math.round((effectiveLeakRate * 60 / 1000) * (baseTariff + zldSurcharge))} / hr
                    </td>
                    <td class="py-3 px-3">
                      <span class="px-1.5 py-0.5 bg-error text-on-error rounded font-bold uppercase text-[10px]">
                        ACTIVE LEAK (#AW-0042)
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. COST RECOVERY & ESG SUSTAINABILITY IMPACT */}
        <section class="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          <div class="bg-surface-container-lowest border border-outline-variant p-space-md rounded shadow-xs space-y-1">
            <div class="flex items-center justify-between">
              <span class="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold text-xs">
                Pumping Energy Footprint
              </span>
              <span class="material-symbols-outlined text-primary text-base">bolt</span>
            </div>
            <div class="text-metric-md font-metric-md text-on-surface tnum mt-1">
              0.42 <span class="text-xs font-body-sm text-outline">kWh / m³</span>
            </div>
            <p class="text-xs text-on-surface-variant">
              Estimated pump electrical power dissipated per cubic meter of lost water.
            </p>
          </div>

          <div class="bg-surface-container-lowest border border-outline-variant p-space-md rounded shadow-xs space-y-1">
            <div class="flex items-center justify-between">
              <span class="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold text-xs">
                Tamil Nadu Water Compliance
              </span>
              <span class="material-symbols-outlined text-tertiary text-base">verified</span>
            </div>
            <div class="text-metric-md font-metric-md text-tertiary tnum mt-1">
              98.2% <span class="text-xs font-body-sm text-outline">Index</span>
            </div>
            <p class="text-xs text-on-surface-variant">
              Complies with Central Ground Water Authority industrial extraction quotas.
            </p>
          </div>

          <div class="bg-surface-container-lowest border border-outline-variant p-space-md rounded shadow-xs space-y-1">
            <div class="flex items-center justify-between">
              <span class="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold text-xs">
                Projected Savings from Early Triage
              </span>
              <span class="material-symbols-outlined text-secondary text-base">savings</span>
            </div>
            <div class="text-metric-md font-metric-md text-secondary tnum mt-1">
              ₹34,560 <span class="text-xs font-body-sm text-outline">/ day saved</span>
            </div>
            <p class="text-xs text-on-surface-variant">
              Direct OPEX preserved by automated valve shutoff within 15 minutes of breach.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
