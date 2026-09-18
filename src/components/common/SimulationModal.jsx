import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';

export default function SimulationModal() {
  const {
    isSimModalOpen,
    setIsSimModalOpen,
    simWeight,
    setSimWeight,
    simLeakRate,
    setSimLeakRate,
    kalmanFilter,
    setKalmanFilter,
  } = useTelemetry();

  if (!isSimModalOpen) return null;

  return (
    <div class="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-gutter">
      <div class="bg-surface-container-lowest border border-outline-variant rounded max-w-xl w-full p-gutter-desktop shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div class="flex items-center justify-between border-b border-outline-variant pb-space-sm mb-space-md">
          <div class="flex items-center gap-space-sm">
            <span class="material-symbols-outlined text-primary">tune</span>
            <h3 class="text-headline-md font-headline-md text-on-surface font-semibold">
              Simulation Controls &amp; Parameters
            </h3>
          </div>
          <button
            onClick={() => setIsSimModalOpen(false)}
            class="text-on-surface-variant hover:text-on-surface p-1 rounded hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="space-y-space-md">
          <p class="text-body-md font-body-md text-on-surface-variant">
            Adjust live simulation parameters to test AquaWatch&apos;s production-aware anomaly discrimination in real time.
          </p>

          {/* Slider 1: Production Batch Load */}
          <div>
            <div class="flex justify-between text-body-sm font-body-sm mb-1">
              <span class="font-medium text-on-surface">Fabric Batch Weight (kg)</span>
              <span class="font-code text-code font-bold text-primary">
                {simWeight.toLocaleString()} kg
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="2500"
              step="50"
              value={simWeight}
              onChange={(e) => setSimWeight(Number(e.target.value))}
              class="w-full h-2 bg-surface-container rounded appearance-none cursor-pointer accent-primary"
            />
            <div class="flex justify-between text-code font-code text-[11px] text-on-surface-variant mt-1">
              <span>500 kg</span>
              <span>Expected baseline shifts proportionally</span>
              <span>2,500 kg</span>
            </div>
          </div>

          {/* Slider 2: Synthetic Leak Magnitude */}
          <div>
            <div class="flex justify-between text-body-sm font-body-sm mb-1">
              <span class="font-medium text-on-surface">Simulated Leak Rate (L/min)</span>
              <span class="font-code text-code font-bold text-error">
                {simLeakRate} L/min
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="600"
              step="20"
              value={simLeakRate}
              onChange={(e) => setSimLeakRate(Number(e.target.value))}
              class="w-full h-2 bg-surface-container rounded appearance-none cursor-pointer accent-error"
            />
            <div class="flex justify-between text-code font-code text-[11px] text-on-surface-variant mt-1">
              <span>0 L/min (Nominal)</span>
              <span>Current: Dyeing Pipe Burst</span>
              <span>600 L/min (Catastrophic)</span>
            </div>
          </div>

          {/* Toggle: Noise filtering */}
          <div class="flex items-center justify-between p-space-sm bg-surface rounded border border-outline-variant">
            <div>
              <p class="text-body-sm font-body-sm font-semibold text-on-surface">
                Kalman Filtering &amp; Pressure Noise Dampener
              </p>
              <p class="text-code font-code text-xs text-on-surface-variant">
                Suppresses normal water hammer pressure shocks and pump cycle ripple
              </p>
            </div>
            <input
              type="checkbox"
              checked={kalmanFilter}
              onChange={(e) => setKalmanFilter(e.target.checked)}
              class="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4 cursor-pointer"
            />
          </div>
        </div>

        <div class="mt-space-lg pt-space-sm border-t border-outline-variant flex justify-end gap-space-sm">
          <button
            onClick={() => setIsSimModalOpen(false)}
            class="px-space-md py-1.5 bg-surface text-on-surface border border-outline-variant rounded font-headline-sm text-body-sm hover:bg-surface-container transition-colors cursor-pointer"
          >
            Dismiss
          </button>
          <button
            onClick={() => setIsSimModalOpen(false)}
            class="px-space-md py-1.5 bg-primary-container text-on-primary rounded font-headline-sm text-body-sm font-semibold hover:bg-primary transition-colors cursor-pointer shadow-sm"
          >
            Apply Telemetry Parameters
          </button>
        </div>
      </div>
    </div>
  );
}
