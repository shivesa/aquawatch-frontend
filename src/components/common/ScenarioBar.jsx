import React from 'react';
import { useTelemetry, SCENARIO_PRESETS } from '../../context/TelemetryContext';

export default function ScenarioBar() {
  const { currentScenarioKey, setScenario } = useTelemetry();

  const scenarios = [
    {
      key: 'normal',
      label: 'Normal Production',
      title: 'Steady state flow tracking production recipe within ±0.3%',
    },
    {
      key: 'high_production',
      label: 'High Production (Valid)',
      title: 'Both expected and actual flow elevate smoothly; NO false positive',
    },
    {
      key: 'dyeing_leak',
      label: 'Dyeing Zone Leak (Active)',
      title: 'Active +23.8% water-loss divergence at Dyeing Line D-01',
    },
    {
      key: 'valve_stuck',
      label: 'Valve Stuck Open',
      title: 'Bypass line valve failing to close after rinse cycle',
    },
    {
      key: 'sensor_fault',
      label: 'Sensor Fault',
      title: 'Electromagnetic sensor analog drift, mass balance intact',
    },
  ];

  return (
    <section class="bg-surface-container-lowest border border-outline-variant p-space-sm rounded flex flex-wrap items-center justify-between gap-space-md shadow-sm">
      <div class="flex items-center gap-space-sm">
        <div class="flex items-center gap-1 px-2 py-1 bg-surface-container text-primary font-code text-xs font-semibold rounded">
          <span class="material-symbols-outlined text-sm">science</span>
          <span>SCENARIO INJECTOR</span>
        </div>
        <span class="text-body-sm font-body-sm text-on-surface-variant hidden md:inline">
          Simulate live industrial water telemetry conditions:
        </span>
      </div>

      {/* Scenario Switcher Buttons */}
      <div class="flex items-center gap-1.5 flex-wrap">
        {scenarios.map((sc) => {
          const isActive = currentScenarioKey === sc.key;
          const isDanger = sc.key === 'dyeing_leak';

          return (
            <button
              key={sc.key}
              onClick={() => setScenario(sc.key)}
              title={sc.title}
              class={`px-2.5 py-1 text-code font-code text-xs rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? isDanger
                    ? 'border border-error bg-red-50 text-error font-semibold shadow-sm'
                    : 'border border-primary bg-primary text-on-primary font-semibold shadow-sm'
                  : 'border border-outline-variant bg-surface hover:bg-surface-container text-on-surface'
              }`}
            >
              {isActive && isDanger && (
                <span class="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
              )}
              {isActive && !isDanger && (
                <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
              )}
              <span>{sc.label}</span>
            </button>
          );
        })}
      </div>

      {/* API Diagnostics / Integration Flag */}
      <div class="hidden xl:flex items-center gap-space-sm text-code font-code text-[11px] text-on-surface-variant">
        <span class="px-1.5 py-0.5 rounded bg-surface-container-high text-primary border border-outline-variant">
          GET /api/dashboard
        </span>
        <span class="px-1.5 py-0.5 rounded bg-surface-container-high text-primary border border-outline-variant">
          POST /api/simulation/scenario
        </span>
      </div>
    </section>
  );
}
