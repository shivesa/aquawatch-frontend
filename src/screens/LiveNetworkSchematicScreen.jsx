import React, { useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import ScenarioBar from '../components/common/ScenarioBar';

export default function LiveNetworkSchematicScreen() {
  const {
    scenario,
    effectiveInflow,
    effectiveLeakRate,
    isolatedValves,
    toggleValveIsolation,
    setActiveTab,
  } = useTelemetry();

  const [viewMode, setViewMode] = useState('all'); // 'all' | 'pressure' | 'flow' | 'health'
  const [selectedNode, setSelectedNode] = useState(null);

  const isLeak = effectiveLeakRate > 0;
  const isSV04Isolated = isolatedValves.includes('SV-04');
  const isV01Isolated = isolatedValves.includes('V-01');

  // Node details for inspector modal
  const nodeDetails = {
    reservoir: {
      title: 'Reservoir Tank T-01',
      type: 'Atmospheric Buffer Storage',
      capacity: '150,000 Liters (Current Level: 82% / 123,000 L)',
      source: 'SIPCOT Industrial Water Supply + Borewell Wellfield #02',
      pressure: 'Head Pressure: 0.85 bar hydrostatic',
      temperature: '26.8°C Ambient',
      status: 'ONLINE / RECHARGING',
      valve: 'V-01 (100% OPEN)',
    },
    fm01: {
      title: 'Header Magmeter FM-01',
      type: '8" Flanged Electromagnetic Flowmeter (DN200)',
      capacity: 'Design Capacity: 2,500 L/min',
      currentFlow: `${effectiveInflow} L/min`,
      pressure: `${isLeak ? '2.4' : '3.2'} bar`,
      pulseRate: `${effectiveInflow} Hz`,
      accuracy: '±0.2% of rate (Class 0.2)',
      status: 'CALIBRATED & VERIFIED (100 Hz Ingress)',
    },
    lineD01: {
      title: 'Branch Line D-01 (Jet Dyeing 02)',
      type: '4" Schedule 40 Stainless Steel 316L',
      submeter: 'FM-04 Electromagnetic Meter',
      reading: isSV04Isolated ? '0 L/min (Isolated)' : `${scenario.dyeingFlow} L/min`,
      anomaly: isLeak && !isSV04Isolated ? '+240 L/min Unaccounted Divergence' : 'Normal',
      valve: `SV-04 (${isSV04Isolated ? 'CLOSED / ISOLATED' : '65% Throttled'})`,
      acoustic: isLeak && !isSV04Isolated ? 'AN-08: 7.4 kHz Cavitation Peak at Flange DJ-04' : 'Quiet',
      pressure: isLeak && !isSV04Isolated ? '2.4 bar (-0.8 bar localized drop)' : '3.2 bar',
      status: isSV04Isolated ? 'SAFE / ISOLATED' : isLeak ? 'CRITICAL LEAK IN PROGRESS' : 'NOMINAL',
    },
  };

  return (
    <main class="ml-60 pt-14 p-gutter-desktop min-h-screen flex flex-col gap-space-md pb-16">
      {/* Scenario Bar */}
      <ScenarioBar />

      {/* Top Control & Filter Bar */}
      <div class="bg-surface-container-lowest border border-outline-variant rounded p-space-md flex flex-col gap-space-md shadow-xs">
        {/* Sub-header & Breadcrumb */}
        <div class="flex flex-wrap items-center justify-between gap-space-md">
          <div>
            <div class="flex items-center gap-space-xs">
              <span class="font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold">
                TIRUPPUR TEXTILE PROCESSING UNIT 04
              </span>
              <span class="text-outline-variant">/</span>
              <span class="font-label-caps text-label-caps text-on-surface-variant uppercase">
                P&amp;ID HYDRAULIC DISTRIBUTION
              </span>
            </div>
            <h1 class="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
              LIVE PROCESS TOPOLOGY &amp; TELEMETRY SCHEMATIC
            </h1>
          </div>

          {/* View Mode Switcher */}
          <div class="inline-flex bg-surface-container p-1 rounded border border-outline-variant flex-wrap">
            <button
              onClick={() => setViewMode('all')}
              class={`px-space-md py-1 font-body-sm text-xs rounded transition-colors flex items-center gap-1 cursor-pointer ${
                viewMode === 'all'
                  ? 'bg-surface-container-lowest text-primary font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span class="material-symbols-outlined text-sm">account_tree</span>
              All Zones (Overview)
            </button>
            <button
              onClick={() => setViewMode('pressure')}
              class={`px-space-md py-1 font-body-sm text-xs rounded transition-colors flex items-center gap-1 cursor-pointer ${
                viewMode === 'pressure'
                  ? 'bg-surface-container-lowest text-primary font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span class="material-symbols-outlined text-sm">speed</span>
              Pressure Gradient Overlay
            </button>
            <button
              onClick={() => setViewMode('flow')}
              class={`px-space-md py-1 font-body-sm text-xs rounded transition-colors flex items-center gap-1 cursor-pointer ${
                viewMode === 'flow'
                  ? 'bg-surface-container-lowest text-primary font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span class="material-symbols-outlined text-sm">compare_arrows</span>
              Flow Rate Differential Mode
            </button>
            <button
              onClick={() => setViewMode('health')}
              class={`px-space-md py-1 font-body-sm text-xs rounded transition-colors flex items-center gap-1 cursor-pointer ${
                viewMode === 'health'
                  ? 'bg-surface-container-lowest text-primary font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span class="material-symbols-outlined text-sm">health_and_safety</span>
              Sensor Telemetry Health
            </button>
          </div>
        </div>

        {/* Quick Stats Pill Banner */}
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-space-sm pt-space-xs border-t border-outline-variant">
          <div
            onClick={() => setSelectedNode('reservoir')}
            class="bg-surface-container-low p-space-sm rounded border border-outline-variant flex flex-col justify-between cursor-pointer hover:border-primary transition-colors"
          >
            <div class="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">
              Main Supply Source
            </div>
            <div class="font-body-md font-semibold text-on-surface truncate">
              Borewell + Municipal Buffer
            </div>
            <div class="font-code text-code text-secondary text-xs">Reservoir Tank T-01</div>
          </div>

          <div
            onClick={() => setSelectedNode('fm01')}
            class="bg-surface-container-low p-space-sm rounded border border-outline-variant flex flex-col justify-between cursor-pointer hover:border-primary transition-colors"
          >
            <div class="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">
              Total Supply Inflow
            </div>
            <div class="font-metric-md text-metric-md text-primary tnum">
              {effectiveInflow.toLocaleString()}{' '}
              <span class="text-xs font-body-sm text-on-surface-variant font-normal">L/min</span>
            </div>
            <div class="font-code text-code text-tertiary text-xs">
              Header Meter FM-01 ({isV01Isolated ? 'CLOSED' : 'Nominal'})
            </div>
          </div>

          <div class="bg-surface-container-low p-space-sm rounded border border-outline-variant flex flex-col justify-between">
            <div class="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">
              Summed Distributed
            </div>
            <div class="font-metric-md text-metric-md text-on-surface tnum">
              {(scenario.dyeingFlow + scenario.washingFlow + scenario.rinsingFlow).toLocaleString()}{' '}
              <span class="text-xs font-body-sm text-on-surface-variant font-normal">L/min</span>
            </div>
            <div class="font-code text-code text-on-surface-variant text-xs">
              &Sigma; Sub-meters FM-02 to FM-07
            </div>
          </div>

          <div
            onClick={() => setActiveTab('anomalies')}
            class={`p-space-sm rounded border flex flex-col justify-between cursor-pointer transition-colors ${
              isLeak
                ? 'bg-error-container border-error hover:opacity-95'
                : 'bg-green-50 border-green-300'
            }`}
          >
            <div class="flex items-center justify-between">
              <span
                class={`font-label-caps text-label-caps uppercase font-bold ${
                  isLeak ? 'text-on-error-container' : 'text-tertiary'
                }`}
              >
                {isLeak ? 'Unaccounted Flow Gap' : 'Flow Balance'}
              </span>
              {isLeak && <span class="w-2 h-2 rounded-full bg-error pulse-dot"></span>}
            </div>
            <div
              class={`font-metric-md text-metric-md tnum ${
                isLeak ? 'text-error' : 'text-tertiary'
              }`}
            >
              {effectiveLeakRate}{' '}
              <span class="text-xs font-body-sm font-normal">L/min</span>
            </div>
            <div
              class={`font-code text-code text-xs font-semibold ${
                isLeak ? 'text-on-error-container' : 'text-tertiary'
              }`}
            >
              {isLeak ? '16.9% Gap (Active Leak Anomaly)' : 'Continuity Intact'}
            </div>
          </div>

          <div class="bg-surface-container-low p-space-sm rounded border border-outline-variant flex flex-col justify-between">
            <div class="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">
              Network Nominal Pressure
            </div>
            <div class="font-metric-md text-metric-md text-on-surface tnum">
              {isLeak ? '2.4' : '3.2'}{' '}
              <span class="text-xs font-body-sm text-on-surface-variant font-normal">bar</span>
            </div>
            <div class="font-code text-code text-on-surface-variant text-xs">
              {isLeak ? '-0.8 bar pressure depression' : 'Stable Header Baseline'}
            </div>
          </div>
        </div>

        {/* Protocol & Synced Bar */}
        <div class="flex flex-wrap items-center justify-between text-xs font-code bg-surface-container px-space-md py-space-xs rounded border border-outline-variant">
          <div class="flex items-center gap-space-md">
            <div class="flex items-center gap-space-xs">
              <span
                class={`w-2 h-2 rounded-full ${isLeak ? 'bg-error' : 'bg-tertiary'}`}
              ></span>
              <span class="font-semibold text-on-surface">
                {isLeak
                  ? 'SCENARIO: Burst Leak at Dyeing Branch DJ-04'
                  : 'SCENARIO: All Process Lines Operating Within Nominal Band'}
              </span>
            </div>
            <span class="text-outline-variant hidden sm:inline">|</span>
            <span class="text-on-surface-variant hidden lg:inline">
              Telemetry Protocol: MODBUS-TCP over RS-485 Polling 250ms
            </span>
          </div>

          <div class="flex items-center gap-space-sm text-on-surface-variant">
            <span class="bg-surface-container-lowest px-space-xs py-0.5 rounded border border-outline-variant text-primary font-bold">
              GET /api/network
            </span>
            <span class="bg-surface-container-lowest px-space-xs py-0.5 rounded border border-outline-variant text-error font-bold">
              POST /api/network/isolate-valve
            </span>
            <span class="text-tertiary flex items-center gap-1">
              <span class="material-symbols-outlined text-xs">sync</span> SYNCED
            </span>
          </div>
        </div>
      </div>

      {/* Main SCADA Process Diagram Canvas */}
      <div class="relative bg-surface-container-lowest border border-outline-variant rounded p-space-lg overflow-x-auto min-h-[640px] shadow-xs">
        {/* Canvas Grid Pattern Watermark */}
        <div
          class="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundSize: '24px 24px',
            backgroundImage:
              'linear-gradient(to right, #eaedff 1px, transparent 1px), linear-gradient(to bottom, #eaedff 1px, transparent 1px)',
          }}
        ></div>

        <div class="relative z-10 flex flex-col gap-space-xl min-w-[1120px]">
          {/* TOP FLOW TIER: Reservoir Tank -> Valve -> Bulk Header Flow Meter */}
          <div class="flex items-center justify-between gap-space-md pb-space-lg border-b border-outline-variant">
            {/* Node 1: Primary Reservoir Tank T-01 */}
            <div
              onClick={() => setSelectedNode('reservoir')}
              class="w-72 bg-surface-container-low border border-outline-variant rounded p-space-md flex flex-col gap-space-xs cursor-pointer hover:border-primary transition-colors"
            >
              <div class="flex items-center justify-between">
                <span class="font-label-caps text-label-caps text-primary font-bold uppercase">
                  RESERVOIR TANK T-01
                </span>
                <span class="px-1.5 py-0.5 bg-tertiary-fixed text-on-tertiary-fixed font-code text-xs rounded font-bold">
                  ONLINE
                </span>
              </div>
              <div class="flex items-center gap-space-md my-space-xs">
                <div class="w-12 h-16 border-2 border-primary rounded bg-surface-container flex flex-col justify-end p-1 relative overflow-hidden">
                  <div
                    class="w-full bg-secondary-container border-t-2 border-secondary transition-all duration-500"
                    style={{ height: '82%' }}
                  ></div>
                  <span class="absolute inset-0 flex items-center justify-center font-code text-xs font-bold text-on-surface">
                    82%
                  </span>
                </div>
                <div class="space-y-1">
                  <div class="font-body-sm text-on-surface-variant text-xs">
                    Storage Capacity:{' '}
                    <span class="font-code font-semibold text-on-surface">150,000 L</span>
                  </div>
                  <div class="font-body-sm text-on-surface-variant text-xs">
                    Source:{' '}
                    <span class="font-code font-semibold text-on-surface">Borewell Primary</span>
                  </div>
                  <div class="font-body-sm text-on-surface-variant text-xs">
                    Inflow Valve:{' '}
                    <span class="font-code text-tertiary font-bold">OPEN (100%)</span>
                  </div>
                </div>
              </div>
              <div class="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                <div class="bg-secondary h-full" style={{ width: '82%' }}></div>
              </div>
            </div>

            {/* Connecting Pipeline SVG: Reservoir -> Valve V-01 */}
            <div class="flex-1 flex items-center px-space-xs">
              <svg class="w-full h-8" preserveAspectRatio="none" viewBox="0 0 200 30">
                <line
                  stroke="#94ccff"
                  strokeLinecap="round"
                  strokeWidth="8"
                  x1="0"
                  x2="200"
                  y1="15"
                  y2="15"
                />
                {!isV01Isolated && (
                  <line
                    class="flow-dash"
                    stroke="#00507d"
                    strokeWidth="3"
                    x1="0"
                    x2="200"
                    y1="15"
                    y2="15"
                  />
                )}
              </svg>
            </div>

            {/* Valve V-01 Inline Node */}
            <div
              onClick={() => toggleValveIsolation('V-01')}
              class="border border-outline-variant bg-surface-container-lowest p-space-sm rounded flex flex-col items-center justify-center text-center shadow-xs min-w-[120px] cursor-pointer hover:border-primary transition-colors"
              title="Click to toggle Valve V-01"
            >
              <div class="font-code text-xs font-bold text-primary">VALVE V-01</div>
              <div class="my-1 flex items-center justify-center">
                <span
                  class={`material-symbols-outlined text-2xl ${
                    isV01Isolated ? 'text-error' : 'text-tertiary'
                  }`}
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  valve
                </span>
              </div>
              <div
                class={`font-code text-xs font-semibold ${
                  isV01Isolated ? 'text-error' : 'text-tertiary'
                }`}
              >
                {isV01Isolated ? 'CLOSED' : '100% OPEN'}
              </div>
              <div class="text-[10px] text-on-surface-variant font-code">Linear Servo</div>
            </div>

            {/* Connecting Pipeline SVG: Valve V-01 -> FM-01 Header */}
            <div class="flex-1 flex items-center px-space-xs">
              <svg class="w-full h-8" preserveAspectRatio="none" viewBox="0 0 200 30">
                <line
                  stroke="#94ccff"
                  strokeLinecap="round"
                  strokeWidth="8"
                  x1="0"
                  x2="200"
                  y1="15"
                  y2="15"
                />
                {!isV01Isolated && (
                  <line
                    class="flow-dash"
                    stroke="#00507d"
                    strokeWidth="3"
                    x1="0"
                    x2="200"
                    y1="15"
                    y2="15"
                  />
                )}
              </svg>
            </div>

            {/* Node 2: Bulk Inflow Telemetry Node (Main Header Meter FM-01) */}
            <div
              onClick={() => setSelectedNode('fm01')}
              class="w-80 bg-surface-container border-2 border-primary rounded p-space-md flex flex-col gap-space-xs shadow-sm cursor-pointer hover:border-secondary transition-colors"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-space-xs">
                  <span class="material-symbols-outlined text-primary text-base">sensors</span>
                  <span class="font-label-caps text-label-caps text-primary font-bold">
                    HEADER METER FM-01
                  </span>
                </div>
                <span class="px-1.5 py-0.5 bg-tertiary-fixed text-on-tertiary-fixed font-code text-[10px] rounded font-bold uppercase">
                  Calibrated
                </span>
              </div>
              <div class="grid grid-cols-3 gap-2 mt-1 py-1 bg-surface-container-lowest rounded border border-outline-variant p-2 text-center">
                <div>
                  <div class="font-label-caps text-[10px] text-on-surface-variant uppercase">Flow Rate</div>
                  <div class="font-metric-sm text-metric-sm font-bold text-primary tnum">
                    {effectiveInflow}
                  </div>
                  <div class="font-code text-[10px] text-on-surface-variant">L/min</div>
                </div>
                <div>
                  <div class="font-label-caps text-[10px] text-on-surface-variant uppercase">Pressure</div>
                  <div class="font-metric-sm text-metric-sm font-bold text-on-surface tnum">
                    {isLeak ? '2.4' : '3.2'}
                  </div>
                  <div class="font-code text-[10px] text-on-surface-variant">bar</div>
                </div>
                <div>
                  <div class="font-label-caps text-[10px] text-on-surface-variant uppercase">Temp</div>
                  <div class="font-metric-sm text-metric-sm font-bold text-secondary tnum">28.4</div>
                  <div class="font-code text-[10px] text-on-surface-variant">&deg;C</div>
                </div>
              </div>
              <div class="flex items-center justify-between text-[11px] font-code text-on-surface-variant pt-1">
                <span>Mag-Flow Pulse: {effectiveInflow} Hz</span>
                <span class="text-tertiary font-semibold flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-tertiary"></span> 99.8% Conf.
                </span>
              </div>
            </div>
          </div>

          {/* MIDDLE TIER: Horizontal Distribution Header Manifold & Drop Lines */}
          <div class="relative py-space-sm">
            {/* Large SCADA Distribution Header Pipe */}
            <div class="bg-primary text-on-primary py-2 px-space-md rounded flex items-center justify-between border-2 border-primary-container shadow-md">
              <div class="flex items-center gap-space-sm font-code text-xs font-bold tracking-wider">
                <span class="material-symbols-outlined text-sm">horizontal_rule</span>
                MAIN 8&quot; SCHEDULE 40 DISTRIBUTION HEADER MANIFOLD [MANIFOLD-M01]
              </div>
              <div class="flex items-center gap-space-md font-code text-xs">
                <span>DESIGN FLOW CAP: 2,500 L/min</span>
                <span>PRESSURE GRADIENT: {isLeak ? '2.40 bar' : '3.20 bar'}</span>
                <span class="bg-primary-container px-2 py-0.5 rounded text-[11px]">ACTIVE BRANCHES: 6</span>
              </div>
            </div>

            {/* Directional SVG Flow Connector Bus to 6 branches */}
            <div class="w-full h-8 relative">
              <svg class="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 40">
                <line
                  class={isLeak ? 'flow-dash-alert' : 'flow-dash'}
                  stroke="#00507d"
                  strokeWidth="4"
                  x1="100"
                  x2="100"
                  y1="0"
                  y2="40"
                />
                <line
                  class={isLeak && !isSV04Isolated ? 'flow-dash-alert' : 'flow-dash'}
                  stroke={isLeak && !isSV04Isolated ? '#dc2626' : '#00507d'}
                  strokeWidth={isLeak && !isSV04Isolated ? '5' : '4'}
                  x1="300"
                  x2="300"
                  y1="0"
                  y2="40"
                />
                <line class="flow-dash" stroke="#00507d" strokeWidth="4" x1="500" x2="500" y1="0" y2="40" />
                <line class="flow-dash" stroke="#00507d" strokeWidth="4" x1="700" x2="700" y1="0" y2="40" />
                <line class="flow-dash" stroke="#00507d" strokeWidth="4" x1="900" x2="900" y1="0" y2="40" />
                <line class="flow-dash" stroke="#00507d" strokeWidth="4" x1="1100" x2="1100" y1="0" y2="40" />
              </svg>
            </div>
          </div>

          {/* LOWER TIER: 6 INDUSTRIAL PROCESS BRANCHES */}
          <div class="grid grid-cols-6 gap-space-md">
            {/* Branch 1: Jet Dyeing 01 */}
            <div class="bg-surface-container-low border border-outline-variant rounded p-3 flex flex-col justify-between space-y-2">
              <div>
                <div class="flex items-center justify-between">
                  <span class="font-code text-[11px] font-bold text-primary">LINE J-01</span>
                  <span class="px-1 py-0.2 rounded bg-green-100 text-tertiary text-[10px] font-bold font-code">
                    ACTIVE
                  </span>
                </div>
                <h4 class="font-headline-sm text-body-sm font-semibold text-on-surface mt-1">
                  Jet Dyeing 01
                </h4>
                <p class="text-[11px] text-on-surface-variant font-code">Vessel #01</p>
              </div>

              <div class="p-2 bg-surface-container-lowest rounded border border-outline-variant text-center">
                <div class="font-label-caps text-[10px] text-on-surface-variant uppercase">
                  {viewMode === 'pressure' ? 'Pressure PT-02' : viewMode === 'health' ? 'Sensor Health' : 'Sub-meter FM-02'}
                </div>
                <div class="font-metric-sm font-bold text-on-surface tnum">
                  {viewMode === 'pressure' ? '3.1 bar' : viewMode === 'health' ? '99.4%' : '240 L/min'}
                </div>
                <div class="text-[10px] text-tertiary font-code">
                  {viewMode === 'flow' ? 'ΔQ: 0 L/min' : 'Nominal'}
                </div>
              </div>

              <div class="flex items-center justify-between text-[11px] font-code text-on-surface-variant">
                <span>Valve SV-01</span>
                <span class="text-tertiary font-bold">OPEN</span>
              </div>
            </div>

            {/* Branch 2: Jet Dyeing 02 (Line D-01) - ACTIVE LEAK ZONE */}
            <div
              onClick={() => setSelectedNode('lineD01')}
              class={`border-2 rounded p-3 flex flex-col justify-between space-y-2 relative overflow-hidden transition-colors shadow-sm cursor-pointer ${
                isLeak && !isSV04Isolated
                  ? 'bg-red-50 border-error'
                  : isSV04Isolated
                  ? 'bg-green-50 border-green-500'
                  : 'bg-surface-container-low border-outline-variant'
              }`}
            >
              {isLeak && !isSV04Isolated && (
                <div class="absolute top-0 right-0 px-2 py-0.5 bg-error text-on-error text-[10px] font-bold font-code flex items-center gap-1 rounded-bl">
                  <span class="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                  BURST ALERT
                </div>
              )}

              <div>
                <div class="flex items-center justify-between">
                  <span class="font-code text-[11px] font-bold text-error">LINE D-01 (Z-02)</span>
                  {isSV04Isolated && (
                    <span class="px-1 py-0.2 rounded bg-green-200 text-green-900 text-[10px] font-bold font-code">
                      ISOLATED
                    </span>
                  )}
                </div>
                <h4 class="font-headline-sm text-body-sm font-bold text-on-surface mt-1">
                  Jet Dyeing 02
                </h4>
                <p class="text-[11px] text-on-surface-variant font-code">Joint DJ-04 &bull; Bay 4</p>
              </div>

              <div
                class={`p-2 rounded border text-center ${
                  isLeak && !isSV04Isolated
                    ? 'bg-red-100 border-error'
                    : 'bg-surface-container-lowest border-outline-variant'
                }`}
              >
                <div class="font-label-caps text-[10px] uppercase font-bold text-error">
                  {viewMode === 'pressure' ? 'Pressure PT-04' : viewMode === 'health' ? 'Sensor Quality' : 'Sub-meter FM-04'}
                </div>
                <div class="font-metric-sm font-bold text-error tnum">
                  {viewMode === 'pressure'
                    ? isSV04Isolated ? '0.0 bar' : '2.4 bar'
                    : viewMode === 'health'
                    ? '86.2% (Turbulence)'
                    : isSV04Isolated ? '0 L/min' : '500 L/min'}
                </div>
                <div class="text-[10px] text-error font-code font-bold">
                  {isSV04Isolated ? 'Flow Stopped' : 'ΔQ = 240 L/min Leak'}
                </div>
              </div>

              {/* Cavitation / Hydrophone badge */}
              <div class="text-[11px] font-code p-1 bg-surface-container-lowest rounded border border-error/40 flex items-center justify-between">
                <span class="text-on-surface-variant">Acoustic AN-08:</span>
                <span class="text-error font-bold">{isSV04Isolated ? 'Quiet' : '7.4 kHz'}</span>
              </div>

              {/* Action Buttons: Isolate Valve & Investigate */}
              <div class="space-y-1 pt-1" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => toggleValveIsolation('SV-04')}
                  class={`w-full py-1.5 px-2 rounded font-code text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                    isSV04Isolated
                      ? 'bg-surface border border-outline-variant text-on-surface hover:bg-surface-container'
                      : 'bg-error text-on-error hover:bg-red-700 shadow-xs'
                  }`}
                >
                  <span class="material-symbols-outlined text-sm">valve</span>
                  <span>{isSV04Isolated ? 'Reopen Valve' : 'SHUT VALVE SV-04'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('investigation')}
                  class="w-full py-1 text-primary hover:underline font-code text-[11px] flex items-center justify-center gap-1 cursor-pointer font-semibold"
                >
                  <span>Open Incident #AW-0042</span>
                  <span class="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Branch 3: Continuous Washing */}
            <div class="bg-surface-container-low border border-outline-variant rounded p-3 flex flex-col justify-between space-y-2">
              <div>
                <div class="flex items-center justify-between">
                  <span class="font-code text-[11px] font-bold text-primary">LINE W-01</span>
                  <span class="px-1 py-0.2 rounded bg-green-100 text-tertiary text-[10px] font-bold font-code">
                    ACTIVE
                  </span>
                </div>
                <h4 class="font-headline-sm text-body-sm font-semibold text-on-surface mt-1">
                  Continuous Washing
                </h4>
                <p class="text-[11px] text-on-surface-variant font-code">Rinse Range 01</p>
              </div>

              <div class="p-2 bg-surface-container-lowest rounded border border-outline-variant text-center">
                <div class="font-label-caps text-[10px] text-on-surface-variant uppercase">
                  {viewMode === 'pressure' ? 'Pressure PT-03' : viewMode === 'health' ? 'Sensor Health' : 'Sub-meter FM-03'}
                </div>
                <div class="font-metric-sm font-bold text-on-surface tnum">
                  {viewMode === 'pressure' ? '2.7 bar' : viewMode === 'health' ? '99.1%' : '260 L/min'}
                </div>
                <div class="text-[10px] text-tertiary font-code">
                  {viewMode === 'flow' ? 'ΔQ: 0 L/min' : '2.7 bar steady'}
                </div>
              </div>

              <div class="flex items-center justify-between text-[11px] font-code text-on-surface-variant">
                <span>Valve SV-02</span>
                <span class="text-tertiary font-bold">OPEN</span>
              </div>
            </div>

            {/* Branch 4: Steam Boiler & Utility */}
            <div class="bg-surface-container-low border border-outline-variant rounded p-3 flex flex-col justify-between space-y-2">
              <div>
                <div class="flex items-center justify-between">
                  <span class="font-code text-[11px] font-bold text-primary">LINE B-01</span>
                  <span class="px-1 py-0.2 rounded bg-green-100 text-tertiary text-[10px] font-bold font-code">
                    STEAM
                  </span>
                </div>
                <h4 class="font-headline-sm text-body-sm font-semibold text-on-surface mt-1">
                  Boiler &amp; Utility
                </h4>
                <p class="text-[11px] text-on-surface-variant font-code">Makeup Circuit</p>
              </div>

              <div class="p-2 bg-surface-container-lowest rounded border border-outline-variant text-center">
                <div class="font-label-caps text-[10px] text-on-surface-variant uppercase">
                  {viewMode === 'pressure' ? 'Pressure PT-05' : viewMode === 'health' ? 'Sensor Health' : 'Sub-meter FM-05'}
                </div>
                <div class="font-metric-sm font-bold text-on-surface tnum">
                  {viewMode === 'pressure' ? '3.2 bar' : viewMode === 'health' ? '98.7%' : '110 L/min'}
                </div>
                <div class="text-[10px] text-tertiary font-code">
                  {viewMode === 'flow' ? 'ΔQ: 0 L/min' : 'De-aerator ok'}
                </div>
              </div>

              <div class="flex items-center justify-between text-[11px] font-code text-on-surface-variant">
                <span>Valve SV-05</span>
                <span class="text-tertiary font-bold">AUTO</span>
              </div>
            </div>

            {/* Branch 5: Bleaching & Scouring */}
            <div class="bg-surface-container-low border border-outline-variant rounded p-3 flex flex-col justify-between space-y-2">
              <div>
                <div class="flex items-center justify-between">
                  <span class="font-code text-[11px] font-bold text-primary">LINE P-01</span>
                  <span class="px-1 py-0.2 rounded bg-green-100 text-tertiary text-[10px] font-bold font-code">
                    BATCH
                  </span>
                </div>
                <h4 class="font-headline-sm text-body-sm font-semibold text-on-surface mt-1">
                  Bleaching Padder
                </h4>
                <p class="text-[11px] text-on-surface-variant font-code">Kier Pre-wash</p>
              </div>

              <div class="p-2 bg-surface-container-lowest rounded border border-outline-variant text-center">
                <div class="font-label-caps text-[10px] text-on-surface-variant uppercase">
                  {viewMode === 'pressure' ? 'Pressure PT-06' : viewMode === 'health' ? 'Sensor Health' : 'Sub-meter FM-06'}
                </div>
                <div class="font-metric-sm font-bold text-on-surface tnum">
                  {viewMode === 'pressure' ? '3.0 bar' : viewMode === 'health' ? '99.5%' : '70 L/min'}
                </div>
                <div class="text-[10px] text-tertiary font-code">
                  {viewMode === 'flow' ? 'ΔQ: 0 L/min' : 'Pre-treatment'}
                </div>
              </div>

              <div class="flex items-center justify-between text-[11px] font-code text-on-surface-variant">
                <span>Valve SV-06</span>
                <span class="text-tertiary font-bold">OPEN</span>
              </div>
            </div>

            {/* Branch 6: Effluent & ZLD Recycling */}
            <div class="bg-surface-container-low border border-outline-variant rounded p-3 flex flex-col justify-between space-y-2">
              <div>
                <div class="flex items-center justify-between">
                  <span class="font-code text-[11px] font-bold text-secondary">ZLD RECYCLE</span>
                  <span class="px-1 py-0.2 rounded bg-blue-100 text-secondary text-[10px] font-bold font-code">
                    RECYCLE
                  </span>
                </div>
                <h4 class="font-headline-sm text-body-sm font-semibold text-on-surface mt-1">
                  Effluent Neutralization
                </h4>
                <p class="text-[11px] text-on-surface-variant font-code">RO Permeate Return</p>
              </div>

              <div class="p-2 bg-surface-container-lowest rounded border border-outline-variant text-center">
                <div class="font-label-caps text-[10px] text-on-surface-variant uppercase">
                  {viewMode === 'pressure' ? 'RO Header Pressure' : viewMode === 'health' ? 'Sensor Health' : 'Recycle Stream'}
                </div>
                <div class="font-metric-sm font-bold text-secondary tnum">
                  {viewMode === 'pressure' ? '1.8 bar' : viewMode === 'health' ? '99.9%' : '980 L/min'}
                </div>
                <div class="text-[10px] text-tertiary font-code">
                  {viewMode === 'flow' ? '82.5% Recovery' : '82.5% Recovery'}
                </div>
              </div>

              <div class="flex items-center justify-between text-[11px] font-code text-on-surface-variant">
                <span>ZLD Loop</span>
                <span class="text-secondary font-bold">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Node Details Modal / Drawer */}
      {selectedNode && (
        <div
          class="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-gutter"
          onClick={() => setSelectedNode(null)}
        >
          <div
            class="bg-surface-container-lowest border border-outline-variant rounded max-w-lg w-full p-gutter-desktop shadow-xl animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div class="flex items-center justify-between border-b border-outline-variant pb-space-sm mb-space-md">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">sensors</span>
                <h3 class="text-headline-sm font-bold text-on-surface">
                  {nodeDetails[selectedNode]?.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                class="text-on-surface-variant hover:text-on-surface p-1 rounded hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <div class="space-y-2 text-body-sm font-code text-xs">
              <div class="p-2 bg-surface-container-low rounded border border-outline-variant">
                <span class="text-outline uppercase text-[10px]">Instrument Classification:</span>
                <p class="font-semibold text-on-surface text-sm mt-0.5">
                  {nodeDetails[selectedNode]?.type}
                </p>
              </div>

              {nodeDetails[selectedNode]?.currentFlow && (
                <div class="flex justify-between p-2 bg-surface rounded border border-outline-variant">
                  <span class="text-on-surface-variant">Flow Rate:</span>
                  <span class="font-bold text-primary text-sm">{nodeDetails[selectedNode].currentFlow}</span>
                </div>
              )}

              {nodeDetails[selectedNode]?.pressure && (
                <div class="flex justify-between p-2 bg-surface rounded border border-outline-variant">
                  <span class="text-on-surface-variant">Pressure Transmitter:</span>
                  <span class="font-bold text-on-surface">{nodeDetails[selectedNode].pressure}</span>
                </div>
              )}

              {nodeDetails[selectedNode]?.capacity && (
                <div class="flex justify-between p-2 bg-surface rounded border border-outline-variant">
                  <span class="text-on-surface-variant">Specification:</span>
                  <span class="font-bold text-on-surface">{nodeDetails[selectedNode].capacity}</span>
                </div>
              )}

              {nodeDetails[selectedNode]?.acoustic && (
                <div class="flex justify-between p-2 bg-surface rounded border border-error/40 bg-red-50">
                  <span class="text-error font-semibold">Cavitation Acoustic:</span>
                  <span class="font-bold text-error">{nodeDetails[selectedNode].acoustic}</span>
                </div>
              )}

              <div class="flex justify-between p-2 bg-surface rounded border border-outline-variant">
                <span class="text-on-surface-variant">Current Status:</span>
                <span class="font-bold text-tertiary">{nodeDetails[selectedNode]?.status}</span>
              </div>
            </div>

            <div class="mt-space-md pt-space-sm border-t border-outline-variant flex justify-end gap-space-sm">
              {selectedNode === 'lineD01' && (
                <button
                  onClick={() => {
                    setSelectedNode(null);
                    setActiveTab('investigation');
                  }}
                  class="px-3 py-1.5 bg-primary text-on-primary rounded font-semibold text-xs hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Open Incident Investigation #AW-0042
                </button>
              )}
              <button
                onClick={() => setSelectedNode(null)}
                class="px-3 py-1.5 bg-surface border border-outline-variant rounded font-medium text-xs hover:bg-surface-container transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
