import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';

export default function IsolationModal() {
  const {
    isIsolationModalOpen,
    setIsIsolationModalOpen,
    isolatedValves,
    toggleValveIsolation,
    setIncidentStatus,
    effectiveLeakRate,
    setActiveTab,
  } = useTelemetry();

  if (!isIsolationModalOpen) return null;

  const isDyeingIsolated = isolatedValves.includes('SV-04');

  const handleIsolateSV04 = () => {
    toggleValveIsolation('SV-04');
    if (!isDyeingIsolated) {
      setIncidentStatus('PHYSICAL_INSPECTION');
    }
  };

  return (
    <div class="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-gutter">
      <div class="bg-surface-container-lowest border-2 border-error rounded max-w-lg w-full p-gutter-desktop shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div class="flex items-center justify-between border-b border-outline-variant pb-space-sm mb-space-md">
          <div class="flex items-center gap-space-sm">
            <span class="material-symbols-outlined text-error text-2xl">
              emergency_home
            </span>
            <div>
              <h3 class="text-headline-md font-headline-md text-error font-bold leading-tight">
                Quick Valve Isolation
              </h3>
              <p class="text-code font-code text-xs text-on-surface-variant">
                Standard Safety Override SOP-WAT-04
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsIsolationModalOpen(false)}
            class="text-on-surface-variant hover:text-on-surface p-1 rounded hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="space-y-space-md">
          <div class="p-3 bg-red-50 border border-red-200 rounded text-body-sm text-red-900 flex items-start gap-2">
            <span class="material-symbols-outlined text-error mt-0.5">warning</span>
            <div>
              <strong class="font-semibold text-error">Warning:</strong> Emergency valve isolation stops pressurized flow to the targeted branch line to halt physical water discharge.
            </div>
          </div>

          <div class="space-y-2">
            <h4 class="text-label-caps font-label-caps text-on-surface-variant uppercase font-bold">
              Sub-Network Valves
            </h4>

            {/* Valve SV-04 (Primary Target) */}
            <div
              class={`p-3 rounded border flex items-center justify-between transition-colors ${
                isDyeingIsolated
                  ? 'bg-green-50 border-green-300'
                  : 'bg-surface-container-low border-error/50'
              }`}
            >
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-code text-code font-bold text-on-surface">
                    VALVE SV-04 (Line D-01)
                  </span>
                  <span
                    class={`px-1.5 py-0.2 rounded text-[10px] font-code font-bold ${
                      isDyeingIsolated
                        ? 'bg-tertiary-container text-on-tertiary'
                        : 'bg-error text-on-error'
                    }`}
                  >
                    {isDyeingIsolated ? 'ISOLATED (CLOSED)' : 'OPEN (ACTIVE LEAK)'}
                  </span>
                </div>
                <p class="text-xs text-on-surface-variant mt-0.5">
                  Jet Dyeing Machine 02 supply branch at Flange DJ-04
                </p>
              </div>
              <button
                onClick={handleIsolateSV04}
                class={`px-3 py-1.5 rounded font-headline-sm text-body-sm font-semibold transition-colors cursor-pointer ${
                  isDyeingIsolated
                    ? 'bg-surface border border-outline-variant hover:bg-surface-container text-on-surface'
                    : 'bg-error text-on-error hover:bg-red-700 shadow-sm'
                }`}
              >
                {isDyeingIsolated ? 'Reopen Valve' : 'SHUT VALVE'}
              </button>
            </div>

            {/* Valve V-01 (Bulk Header) */}
            <div class="p-3 rounded border border-outline-variant bg-surface-container-lowest flex items-center justify-between">
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-code text-code font-bold text-on-surface">
                    VALVE V-01 (Main Header)
                  </span>
                  <span class="px-1.5 py-0.2 rounded text-[10px] font-code font-bold bg-surface-container text-on-surface">
                    100% OPEN
                  </span>
                </div>
                <p class="text-xs text-on-surface-variant mt-0.5">
                  Primary plant intake from Reservoir Tank T-01
                </p>
              </div>
              <button
                onClick={() => toggleValveIsolation('V-01')}
                class="px-3 py-1.5 rounded border border-outline-variant bg-surface hover:bg-surface-container text-on-surface font-headline-sm text-body-sm cursor-pointer"
              >
                {isolatedValves.includes('V-01') ? 'Reopen' : 'Shut Main'}
              </button>
            </div>
          </div>

          <div class="p-2.5 bg-surface rounded border border-outline-variant text-code text-xs flex justify-between">
            <span class="text-on-surface-variant">Active Unaccounted Loss:</span>
            <span
              class={`font-bold ${
                effectiveLeakRate > 0 ? 'text-error' : 'text-tertiary'
              }`}
            >
              {effectiveLeakRate} L/min
            </span>
          </div>
        </div>

        <div class="mt-space-lg pt-space-sm border-t border-outline-variant flex items-center justify-between">
          <button
            onClick={() => {
              setIsIsolationModalOpen(false);
              setActiveTab('schematic');
            }}
            class="text-code text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer font-semibold"
          >
            <span>View in Network Schematic</span>
            <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </button>

          <button
            onClick={() => setIsIsolationModalOpen(false)}
            class="px-space-md py-1.5 bg-surface text-on-surface border border-outline-variant rounded font-headline-sm text-body-sm hover:bg-surface-container transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
