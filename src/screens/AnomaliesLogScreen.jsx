import React, { useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import ScenarioBar from '../components/common/ScenarioBar';

export default function AnomaliesLogScreen() {
  const {
    effectiveLeakRate,
    isAcknowledged,
    setIsAcknowledged,
    setActiveTab,
    scenario,
    isolatedValves,
  } = useTelemetry();

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'high' | 'moderate' | 'low' | 'suppressed'
  const [searchQuery, setSearchQuery] = useState('');

  const isLeak = effectiveLeakRate > 0;
  const isSV04Isolated = isolatedValves.includes('SV-04');

  const events = [
    {
      id: 'AW-0042',
      detected: '14:32:18 IST',
      duration: '14 min sustained',
      unit: 'Dyeing Line D-01 (Zone Z-02)',
      category: 'Unaccounted Water-Loss',
      telemetry: '+240 L/min unmetered divergence',
      pressure: '2.4 bar (-0.8 bar drop)',
      confidence: '87% Bayesian',
      severity: 'HIGH',
      status: isSV04Isolated ? 'RESOLVED (ISOLATED)' : isAcknowledged ? 'UNDER TRIAGE' : 'OPEN / ACTIVE',
      isPrimary: true,
    },
    {
      id: 'AW-0041',
      detected: '14:10:05 IST',
      duration: '3 min duration',
      unit: 'Washing Rinse Range (Zone Z-01)',
      category: 'Recipe Transition Surge',
      telemetry: '+25% transient inflow',
      pressure: '3.1 bar (nominal)',
      confidence: '0% (Production Aware)',
      severity: 'SUPPRESSED',
      status: 'SUPPRESSED (VALID RAMP)',
    },
    {
      id: 'AW-0040',
      detected: '13:14:22 IST',
      duration: 'Closed at 13:42',
      unit: 'Boiler Feed Pump B-02',
      category: 'Transducer Jitter',
      telemetry: '0.12 bar analog ripple',
      pressure: '3.2 bar (nominal)',
      confidence: '14%',
      severity: 'LOW',
      status: 'RESOLVED',
    },
    {
      id: 'AW-0039',
      detected: '11:45:00 IST',
      duration: 'Closed at 12:02',
      unit: 'Bleaching Padder SV-06',
      category: 'Valve Reseat Delay',
      telemetry: '+15 L/min slow shutoff',
      pressure: '3.0 bar',
      confidence: '42%',
      severity: 'MODERATE',
      status: 'RESOLVED',
    },
    {
      id: 'AW-0038',
      detected: '09:20:11 IST',
      duration: 'Closed at 09:35',
      unit: 'ZLD Neutralization Tank T-04',
      category: 'Filter Backwash Sequence',
      telemetry: '+35 L/min expected pulse',
      pressure: '2.9 bar',
      confidence: '2%',
      severity: 'SUPPRESSED',
      status: 'SUPPRESSED (AUTO-VERIFIED)',
    },
  ];

  const filteredEvents = events.filter((ev) => {
    if (activeFilter === 'high' && ev.severity !== 'HIGH') return false;
    if (activeFilter === 'moderate' && ev.severity !== 'MODERATE') return false;
    if (activeFilter === 'low' && ev.severity !== 'LOW') return false;
    if (activeFilter === 'suppressed' && ev.severity !== 'SUPPRESSED') return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        ev.id.toLowerCase().includes(q) ||
        ev.unit.toLowerCase().includes(q) ||
        ev.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <main class="ml-60 pt-14 pb-16 flex-1 flex flex-col bg-background min-h-screen">
      <div class="p-gutter-desktop space-y-space-lg max-w-[1680px] w-full mx-auto">
        {/* Scenario Injector */}
        <ScenarioBar />

        {/* SUB-HEADER & INDUSTRIAL AUDIT STRIP */}
        <section class="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-md border-b border-outline-variant">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="font-code text-code font-semibold tracking-wider text-outline uppercase text-xs">
                SCADA Section 11 // EVENT TRIAGE &amp; MULTI-SIGNAL AUDIT
              </span>
              <span class="h-3 w-px bg-outline-variant"></span>
              <span class="font-code text-code px-1.5 py-0.2 bg-tertiary-container text-on-tertiary rounded text-[10px] font-bold">
                VERIFIED 14:40:00 IST
              </span>
            </div>
            <h1 class="text-headline-lg font-headline-lg text-on-surface tracking-tight font-bold">
              Anomalies &amp; Detection Log
            </h1>
            <p class="text-body-md font-body-md text-on-surface-variant max-w-3xl mt-0.5">
              Continuous probabilistic detection log categorizing sustained water-loss patterns, sensor telemetry faults, and hydraulic deviations.
            </p>
          </div>

          {/* REST API Telemetry Ingress Badges */}
          <div class="flex flex-wrap items-center gap-space-xs font-code text-code text-xs">
            <div class="flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-lowest border border-outline-variant rounded">
              <span class="font-bold text-secondary">GET</span>
              <span class="text-on-surface">/api/anomalies</span>
              <span class="px-1 py-0.2 bg-green-100 text-tertiary rounded text-[11px] font-semibold">
                200 OK
              </span>
            </div>
            <div class="flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-lowest border border-outline-variant rounded">
              <span class="font-bold text-outline">POST</span>
              <span class="text-on-surface">/api/anomalies/triage</span>
              <span class="px-1 py-0.2 bg-surface-container-high text-on-surface-variant rounded text-[11px]">
                IDLE
              </span>
            </div>
            <div class="flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-low border border-outline-variant rounded text-on-surface-variant">
              <span class="material-symbols-outlined text-[14px] text-primary">sync</span>
              <span>Polling: 250ms</span>
            </div>
          </div>
        </section>

        {/* KPI SUMMARY METRIC CARDS (Bento Grid) */}
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-md">
          {/* Metric 1: Active Anomalies */}
          <div
            class={`bg-surface-container-lowest border-2 p-space-md rounded flex flex-col justify-between shadow-xs relative overflow-hidden ${
              isLeak ? 'border-error' : 'border-outline-variant'
            }`}
          >
            <div class="flex items-start justify-between">
              <span class="text-label-caps font-label-caps text-on-surface-variant tracking-wider uppercase font-semibold">
                Active Anomalies
              </span>
              <span
                class={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-label-caps font-bold uppercase ${
                  isLeak ? 'bg-error text-on-error' : 'bg-green-100 text-tertiary'
                }`}
              >
                {isLeak && <span class="w-1.5 h-1.5 rounded-full bg-white status-pulse"></span>}
                {isLeak ? 'Critical' : 'Nominal'}
              </span>
            </div>
            <div class="my-space-xs">
              <div class="flex items-baseline gap-2">
                <span
                  class={`text-metric-lg font-metric-lg tnum ${
                    isLeak ? 'text-error' : 'text-tertiary'
                  }`}
                >
                  {isLeak ? '1' : '0'}
                </span>
                <span class="text-body-sm font-body-sm text-on-surface-variant font-medium">
                  {isLeak ? 'Unresolved' : 'All Clear'}
                </span>
              </div>
              <p
                class={`text-body-sm font-body-sm font-semibold leading-snug truncate mt-1 ${
                  isLeak ? 'text-error' : 'text-tertiary'
                }`}
              >
                {isLeak ? 'Dyeing Zone Line D-01' : 'No active divergences'}
              </p>
            </div>
            <div class="pt-space-xs border-t border-outline-variant/60 flex items-center justify-between text-code font-code text-on-surface-variant text-xs">
              <span>Water-loss pattern</span>
              <span class={isLeak ? 'text-error font-bold' : 'text-tertiary font-bold'}>
                {isLeak ? '+240 L/min' : '0 L/min'}
              </span>
            </div>
          </div>

          {/* Metric 2: Resolved Today */}
          <div class="bg-surface-container-lowest border border-outline-variant p-space-md rounded flex flex-col justify-between hover:border-outline transition-colors shadow-xs">
            <div class="flex items-start justify-between">
              <span class="text-label-caps font-label-caps text-on-surface-variant tracking-wider uppercase font-semibold">
                Resolved Today
              </span>
              <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-label-caps bg-green-50 text-tertiary border border-green-200 font-bold">
                <span class="material-symbols-outlined text-[12px]">check_circle</span>
                Shift A+B
              </span>
            </div>
            <div class="my-space-xs">
              <div class="flex items-baseline gap-2">
                <span class="text-metric-lg font-metric-lg text-on-surface tnum">
                  {isSV04Isolated ? '5' : '4'}
                </span>
                <span class="text-body-sm font-body-sm text-tertiary font-medium">Closed</span>
              </div>
              <p class="text-body-sm font-body-sm text-on-surface-variant leading-snug line-clamp-1 mt-1 truncate">
                Sensor jitter, valve washdown transients
              </p>
            </div>
            <div class="pt-space-xs border-t border-outline-variant/60 flex items-center justify-between text-code font-code text-outline text-xs">
              <span>Last audit</span>
              <span class="text-on-surface">14:02:09</span>
            </div>
          </div>

          {/* Metric 3: False-Positive Reduction */}
          <div class="bg-surface-container-lowest border border-outline-variant p-space-md rounded flex flex-col justify-between hover:border-outline transition-colors shadow-xs">
            <div class="flex items-start justify-between">
              <span class="text-label-caps font-label-caps text-on-surface-variant tracking-wider uppercase font-semibold">
                False-Positive Red.
              </span>
              <span class="px-1.5 py-0.5 rounded text-[10px] font-label-caps bg-surface-container text-primary font-bold uppercase">
                24H Context
              </span>
            </div>
            <div class="my-space-xs">
              <div class="flex items-baseline gap-1">
                <span class="text-metric-lg font-metric-lg text-primary tnum">94.2</span>
                <span class="text-headline-sm font-headline-sm text-primary font-bold">%</span>
              </div>
              <p class="text-body-sm font-body-sm text-on-surface-variant leading-snug line-clamp-1 mt-1 truncate">
                16 recipe transitions normalized
              </p>
            </div>
            <div class="pt-space-xs border-t border-outline-variant/60 flex items-center justify-between text-code font-code text-outline text-xs">
              <span>Suppressed</span>
              <span class="text-tertiary font-medium">16 non-leaks</span>
            </div>
          </div>

          {/* Metric 4: Mean Time to Triage */}
          <div class="bg-surface-container-lowest border border-outline-variant p-space-md rounded flex flex-col justify-between hover:border-outline transition-colors shadow-xs">
            <div class="flex items-start justify-between">
              <span class="text-label-caps font-label-caps text-on-surface-variant tracking-wider uppercase font-semibold">
                Mean Time to Triage
              </span>
              <span class="px-1.5 py-0.5 rounded text-[10px] font-code text-outline bg-surface-container font-bold">
                MTTT
              </span>
            </div>
            <div class="my-space-xs">
              <div class="flex items-baseline gap-1">
                <span class="text-metric-lg font-metric-lg text-on-surface tnum">4.2</span>
                <span class="text-metric-sm font-metric-sm text-outline font-semibold">min</span>
              </div>
              <p class="text-body-sm font-body-sm text-on-surface-variant leading-snug line-clamp-1 mt-1 truncate">
                EWMA persistence to inspect rec.
              </p>
            </div>
            <div class="pt-space-xs border-t border-outline-variant/60 flex items-center justify-between text-code font-code text-outline text-xs">
              <span>Target benchmark</span>
              <span class="text-primary font-medium">&lt; 8.0 min</span>
            </div>
          </div>

          {/* Metric 5: Sensor Health Index */}
          <div class="bg-surface-container-lowest border border-outline-variant p-space-md rounded flex flex-col justify-between hover:border-outline transition-colors shadow-xs">
            <div class="flex items-start justify-between">
              <span class="text-label-caps font-label-caps text-on-surface-variant tracking-wider uppercase font-semibold">
                Sensor Health Index
              </span>
              <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-label-caps bg-green-50 text-tertiary border border-green-200 font-bold">
                <span class="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                98.4%
              </span>
            </div>
            <div class="my-space-xs">
              <div class="flex items-baseline gap-1">
                <span class="text-metric-lg font-metric-lg text-on-surface tnum">98.4</span>
                <span class="text-headline-sm font-headline-sm text-outline font-bold">%</span>
              </div>
              <p class="text-body-sm font-body-sm text-on-surface-variant leading-snug line-clamp-1 mt-1 truncate">
                All sub-meters CRC valid; 1 drift
              </p>
            </div>
            <div class="pt-space-xs border-t border-outline-variant/60 flex items-center justify-between text-code font-code text-outline text-xs">
              <span>Analog Drift</span>
              <span class="text-amber-700 font-medium">1 flagged</span>
            </div>
          </div>
        </section>

        {/* ACTIVE ANOMALY HIGHLIGHT DRAWER / PREVIEW (#AW-0042) */}
        {isLeak && (
          <section class="bg-surface-container-lowest border-2 border-primary rounded p-space-lg shadow-sm">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between pb-space-sm border-b border-outline-variant gap-space-sm">
              <div class="flex items-center gap-space-md">
                <div class="w-9 h-9 rounded bg-error-container text-error flex items-center justify-center font-bold">
                  <span class="material-symbols-outlined text-[24px]">warning</span>
                </div>
                <div>
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="font-code text-code font-bold text-primary">
                      CRITICAL EVENT #AW-0042
                    </span>
                    <span class="px-2 py-0.5 rounded text-label-caps font-label-caps bg-error text-on-error font-bold uppercase text-[11px]">
                      HIGH SEVERITY
                    </span>
                    <span class="font-code text-code text-outline text-xs">
                      Detected: 14:32:18 IST (14 min sustained)
                    </span>
                  </div>
                  <h2 class="text-headline-md font-headline-md text-on-surface tracking-tight mt-0.5 font-bold">
                    Water-Loss Pattern: Dyeing Processing Line D-01 (Zone D)
                  </h2>
                </div>
              </div>

              <div class="flex items-center gap-space-sm flex-wrap">
                <button
                  onClick={() => setIsAcknowledged(!isAcknowledged)}
                  class={`px-space-md py-2 border rounded font-body-md text-body-md font-medium transition-colors cursor-pointer ${
                    isAcknowledged
                      ? 'bg-green-100 text-tertiary border-green-300'
                      : 'border-outline-variant hover:bg-surface-container text-on-surface'
                  }`}
                  type="button"
                >
                  {isAcknowledged ? '✓ Alert Acknowledged' : 'Acknowledge Alert'}
                </button>

                <button
                  onClick={() => setActiveTab('investigation')}
                  class="px-space-md py-2 bg-primary-container hover:bg-primary text-on-primary text-body-md font-body-md font-semibold rounded flex items-center gap-space-xs shadow-sm transition-colors cursor-pointer"
                >
                  <span>Open Full Investigation #AW-0042</span>
                  <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* 5 Supporting Evidence Signals Bento Card Row */}
            <div class="mt-space-md">
              <div class="flex items-center justify-between mb-space-sm flex-wrap gap-2">
                <h3 class="text-label-caps font-label-caps uppercase text-on-surface-variant font-bold tracking-wider">
                  Probabilistic Triage Rationale &mdash; Why Flagged vs Dismissed As Normal Recipe Surge
                </h3>
                <span class="text-code font-code text-primary font-medium flex items-center gap-1 text-xs">
                  <span class="material-symbols-outlined text-[14px]">analytics</span>
                  Bayesian Leak Probability: <strong class="font-bold text-error">87.4%</strong>
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-5 gap-space-sm">
                <div class="p-2.5 rounded bg-surface-container-low border border-outline-variant">
                  <div class="text-label-caps font-semibold text-error uppercase">Signal 1: Mass Balance</div>
                  <div class="font-bold text-on-surface text-body-sm mt-0.5">&Delta;Q = 240 L/min Gap</div>
                  <p class="text-xs text-on-surface-variant mt-1">Header FM-01 1,420 vs Sum of zones 1,180</p>
                </div>

                <div class="p-2.5 rounded bg-surface-container-low border border-outline-variant">
                  <div class="text-label-caps font-semibold text-error uppercase">Signal 2: Dynamic Band</div>
                  <div class="font-bold text-on-surface text-body-sm mt-0.5">+23.8% Deviation</div>
                  <p class="text-xs text-on-surface-variant mt-1">Exceeds ±5% tolerance band for &gt;180s</p>
                </div>

                <div class="p-2.5 rounded bg-surface-container-low border border-outline-variant">
                  <div class="text-label-caps font-semibold text-error uppercase">Signal 3: Pressure Gradient</div>
                  <div class="font-bold text-on-surface text-body-sm mt-0.5">2.4 bar Local Drop</div>
                  <p class="text-xs text-on-surface-variant mt-1">Dropped from 3.2 bar nominal baseline</p>
                </div>

                <div class="p-2.5 rounded bg-surface-container-low border border-outline-variant">
                  <div class="text-label-caps font-semibold text-error uppercase">Signal 4: Acoustic Node</div>
                  <div class="font-bold text-on-surface text-body-sm mt-0.5">AN-08: 7.4 kHz Spike</div>
                  <p class="text-xs text-on-surface-variant mt-1">Cavitation signature at Flange DJ-04</p>
                </div>

                <div class="p-2.5 rounded bg-surface-container-low border border-outline-variant">
                  <div class="text-label-caps font-semibold text-primary uppercase">Signal 5: Production MES</div>
                  <div class="font-bold text-on-surface text-body-sm mt-0.5">Batch DY-2409 Cross-ref</div>
                  <p class="text-xs text-on-surface-variant mt-1">Expected 1,185 L/min; excess is unaccounted</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* DATA TABLE & FILTER TABS */}
        <section class="bg-surface-container-lowest border border-outline-variant rounded p-space-md shadow-xs space-y-space-md">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-space-md border-b border-outline-variant pb-space-sm">
            {/* Filter Tabs */}
            <div class="flex items-center gap-1 overflow-x-auto">
              {[
                { id: 'all', label: `All Events (${events.length})` },
                { id: 'high', label: 'High Severity (1)' },
                { id: 'moderate', label: 'Moderate (1)' },
                { id: 'low', label: 'Low Severity (1)' },
                { id: 'suppressed', label: 'Transients / Suppressed (2)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  class={`px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap cursor-pointer ${
                    activeFilter === tab.id
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div class="relative w-full md:w-64">
              <span class="material-symbols-outlined absolute left-2.5 top-2 text-on-surface-variant text-sm">
                search
              </span>
              <input
                type="text"
                placeholder="Search event, zone, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                class="w-full pl-8 pr-3 py-1 bg-surface-container-low border border-outline-variant rounded text-body-sm text-on-surface focus:outline-none focus:border-primary text-xs"
              />
            </div>
          </div>

          {/* Table */}
          <div class="overflow-x-auto">
            <table class="w-full text-left text-body-sm font-body-sm border-collapse">
              <thead>
                <tr class="bg-surface-container-low text-on-surface-variant text-label-caps uppercase border-b border-outline-variant text-[11px]">
                  <th class="py-2.5 px-3">Event ID</th>
                  <th class="py-2.5 px-3">Detected Time</th>
                  <th class="py-2.5 px-3">Sub-System / Zone</th>
                  <th class="py-2.5 px-3">Category</th>
                  <th class="py-2.5 px-3">Telemetry Signature</th>
                  <th class="py-2.5 px-3">Pressure</th>
                  <th class="py-2.5 px-3">Confidence</th>
                  <th class="py-2.5 px-3">Status</th>
                  <th class="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/60 font-code text-xs">
                {filteredEvents.map((ev) => {
                  const isHigh = ev.severity === 'HIGH';
                  const isSupp = ev.severity === 'SUPPRESSED';

                  return (
                    <tr
                      key={ev.id}
                      class={`hover:bg-surface-container-low/50 transition-colors ${
                        isHigh ? 'bg-red-50/40' : ''
                      }`}
                    >
                      <td class="py-3 px-3 font-bold text-primary">#{ev.id}</td>
                      <td class="py-3 px-3 text-on-surface-variant">
                        <div>{ev.detected}</div>
                        <div class="text-[10px] text-outline">{ev.duration}</div>
                      </td>
                      <td class="py-3 px-3 font-body-sm font-semibold text-on-surface">
                        {ev.unit}
                      </td>
                      <td class="py-3 px-3 font-body-sm text-on-surface-variant">
                        {ev.category}
                      </td>
                      <td class="py-3 px-3 font-bold text-on-surface">
                        <span class={isHigh ? 'text-error' : 'text-on-surface'}>
                          {ev.telemetry}
                        </span>
                      </td>
                      <td class="py-3 px-3 text-on-surface">{ev.pressure}</td>
                      <td class="py-3 px-3">
                        <span
                          class={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                            isHigh
                              ? 'bg-red-100 text-error'
                              : isSupp
                              ? 'bg-green-100 text-tertiary'
                              : 'bg-surface-container text-on-surface'
                          }`}
                        >
                          {ev.confidence}
                        </span>
                      </td>
                      <td class="py-3 px-3">
                        <span
                          class={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isHigh
                              ? 'bg-error text-on-error'
                              : isSupp
                              ? 'bg-surface-container text-outline'
                              : 'bg-green-100 text-tertiary'
                          }`}
                        >
                          {ev.status}
                        </span>
                      </td>
                      <td class="py-3 px-3 text-right">
                        {ev.isPrimary ? (
                          <button
                            onClick={() => setActiveTab('investigation')}
                            class="px-2.5 py-1 bg-primary text-on-primary rounded text-xs font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
                          >
                            Investigate
                          </button>
                        ) : (
                          <button
                            onClick={() => setActiveTab('schematic')}
                            class="px-2 py-1 bg-surface border border-outline-variant hover:bg-surface-container text-on-surface rounded text-xs cursor-pointer"
                          >
                            Details
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
