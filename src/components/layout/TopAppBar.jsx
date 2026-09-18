import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';

export default function TopAppBar() {
  const {
    scenario,
    effectiveLeakRate,
    setIsSimModalOpen,
    setActiveTab,
    currentScenarioKey,
  } = useTelemetry();

  const isAlarm = effectiveLeakRate > 0;

  return (
    <header class="fixed top-0 left-0 right-0 h-14 z-30 flex items-center justify-between px-gutter-desktop border-b border-outline-variant bg-surface-container-lowest">
      <div class="flex items-center gap-space-md">
        {/* Logo & System Definition */}
        <div
          class="flex items-center gap-space-sm cursor-pointer"
          onClick={() => setActiveTab('overview')}
        >
          <span
            class="material-symbols-outlined text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            water_drop
          </span>
          <span class="text-headline-md font-headline-md font-bold tracking-tight text-primary">
            AquaWatch
          </span>
        </div>

        <div class="h-5 w-px bg-outline-variant mx-space-xs hidden sm:block"></div>

        <div class="hidden md:block">
          <p class="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider font-semibold">
            Production-Aware Industrial Water Loss &amp; Leakage Detection System
          </p>
          <p class="text-code font-code text-primary font-medium text-xs">
            Tiruppur Textile Processing Unit
          </p>
        </div>

        {/* Live Simulation Flag Badge */}
        <div class="ml-space-sm flex items-center gap-1.5 px-2 py-0.5 rounded border border-amber-300 bg-amber-50 text-amber-900 text-label-caps font-label-caps font-semibold">
          <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span>LIVE SIMULATION</span>
        </div>
      </div>

      <div class="flex items-center gap-space-md">
        {/* Active Telemetry & State Chip */}
        <div class="hidden lg:flex items-center gap-space-sm bg-surface-container-low px-space-md py-1 rounded border border-outline-variant">
          <span class="text-label-caps font-label-caps text-on-surface-variant">Active Batch:</span>
          <span class="text-code font-code text-on-surface font-semibold text-xs">
            {scenario.batchRef}, {scenario.fabricWeight.toLocaleString()} kg
          </span>
          <span class="w-1 h-1 rounded-full bg-outline-variant mx-0.5"></span>
          <span class="text-label-caps font-label-caps text-on-surface-variant flex items-center gap-1">
            <span class="material-symbols-outlined text-xs">schedule</span>
            12s ago
          </span>
        </div>

        {/* Critical Alert Pill */}
        {isAlarm ? (
          <button
            onClick={() => setActiveTab('anomalies')}
            class="flex items-center gap-1.5 px-space-md py-1 rounded border border-error-container bg-error-container text-on-error-container font-headline-sm text-xs cursor-pointer hover:opacity-90 transition-opacity"
            title="Click to view active anomalies"
          >
            <span
              class="material-symbols-outlined text-error text-base animate-pulse"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              warning
            </span>
            <span class="font-semibold text-code font-code">
              1 High Priority Anomaly
            </span>
          </button>
        ) : (
          <div class="flex items-center gap-1.5 px-space-md py-1 rounded border border-green-200 bg-green-50 text-tertiary font-headline-sm text-xs">
            <span class="w-2 h-2 rounded-full bg-tertiary"></span>
            <span class="font-semibold text-code font-code">
              All Systems Nominal
            </span>
          </div>
        )}

        {/* Trailing Action: Simulation Controls */}
        <button
          onClick={() => setIsSimModalOpen(true)}
          class="flex items-center gap-space-xs px-space-md py-1.5 bg-primary-container text-on-primary rounded border border-primary font-headline-sm text-body-sm font-semibold hover:bg-primary transition-colors cursor-pointer"
          id="simModalTrigger"
        >
          <span class="material-symbols-outlined text-base">tune</span>
          <span class="hidden sm:inline">Simulation Controls</span>
        </button>

        {/* Trailing Notification & Tools */}
        <div class="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('anomalies')}
            class="p-1.5 text-on-surface-variant hover:bg-surface-container rounded transition-colors relative"
            title="Notifications"
          >
            <span class="material-symbols-outlined">notifications</span>
            {isAlarm && (
              <span class="absolute top-1 right-1 w-2 h-2 rounded-full bg-error"></span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
