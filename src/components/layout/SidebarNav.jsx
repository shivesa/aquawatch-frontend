import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';

export default function SidebarNav() {
  const {
    activeTab,
    setActiveTab,
    effectiveLeakRate,
    setIsIsolationModalOpen,
    setIsSimModalOpen,
  } = useTelemetry();

  const isLeak = effectiveLeakRate > 0;

  const navItems = [
    {
      id: 'overview',
      label: 'Factory Overview',
      icon: 'dashboard',
    },
    {
      id: 'schematic',
      label: 'Live Network Schematic',
      icon: 'schema',
    },
    {
      id: 'anomalies',
      label: 'Anomalies & Detection',
      icon: 'warning',
      badge: isLeak ? '1' : null,
      badgeColor: 'bg-error text-on-error',
      iconColor: isLeak ? 'text-error' : '',
    },
    {
      id: 'water-loss',
      label: 'Water Loss & Impact',
      icon: 'water_damage',
    },
    {
      id: 'investigation',
      label: 'Incident Investigation',
      icon: 'troubleshoot',
      tag: '#AW-0042',
    },
    {
      id: 'status',
      label: 'System Status',
      icon: 'monitoring',
    },
    {
      id: 'demo_scenarios',
      label: 'Demo Scenarios',
      icon: 'play_circle',
      action: () => setIsSimModalOpen(true),
    },
  ];

  return (
    <aside class="fixed top-14 left-0 bottom-0 w-60 z-20 flex flex-col justify-between py-space-md border-r border-outline-variant bg-surface-container-lowest">
      <div>
        {/* Header context pill */}
        <div class="px-space-md pb-space-md mb-space-sm border-b border-outline-variant">
          <div class="flex items-center gap-space-sm">
            <div class="w-8 h-8 rounded bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs">
              AW
            </div>
            <div>
              <h2 class="text-headline-sm font-headline-sm text-primary leading-tight font-semibold">
                AquaWatch SCADA
              </h2>
              <p class="text-label-caps font-label-caps text-on-surface-variant font-medium">
                Tiruppur Unit 04
              </p>
            </div>
          </div>
        </div>

        {/* Top Level Nav Tabs */}
        <nav class="space-y-0.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                class={`w-full flex items-center justify-between px-space-md py-space-sm text-body-md font-body-md transition-colors text-left cursor-pointer ${
                  isActive
                    ? 'bg-surface-container-low text-primary border-l-4 border-primary font-semibold'
                    : 'text-on-surface-variant font-medium hover:bg-surface-container'
                }`}
              >
                <div class="flex items-center gap-space-md">
                  <span
                    class={`material-symbols-outlined ${
                      item.iconColor || (isActive ? 'text-primary' : '')
                    }`}
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    class={`px-1.5 py-0.5 text-code font-code text-xs font-bold rounded ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}

                {item.tag && (
                  <span class="text-code font-code text-xs text-primary font-medium">
                    {item.tag}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer / CTA */}
      <div class="px-space-md space-y-space-md">
        {/* Quick Isolation CTA */}
        <button
          onClick={() => setIsIsolationModalOpen(true)}
          class="w-full flex items-center justify-center gap-space-xs py-2 px-space-sm bg-error text-on-error rounded font-headline-sm text-body-sm font-semibold hover:bg-red-700 transition-colors border border-red-800 shadow-sm cursor-pointer"
        >
          <span class="material-symbols-outlined text-base">emergency_home</span>
          <span>Quick Isolation</span>
        </button>

        {/* System Diagnostic Status Widget */}
        <div class="p-space-sm bg-surface rounded border border-outline-variant text-code font-code text-xs space-y-1">
          <div class="flex items-center justify-between">
            <span class="text-on-surface-variant">Sim Engine:</span>
            <span class="text-tertiary font-bold flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-tertiary"></span> ONLINE
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-on-surface-variant">Sensor Quality:</span>
            <span class="text-on-surface font-semibold tnum">96.4%</span>
          </div>
        </div>

        {/* Footer Tabs */}
        <div class="pt-space-sm border-t border-outline-variant flex items-center justify-between text-code font-code text-on-surface-variant text-xs">
          <button
            onClick={() => setActiveTab('schematic')}
            class="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
          >
            <span class="material-symbols-outlined text-sm">terminal</span> Diagnostics
          </button>
          <button
            onClick={() => setIsSimModalOpen(true)}
            class="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
          >
            <span class="material-symbols-outlined text-sm">settings</span> Settings
          </button>
        </div>
      </div>
    </aside>
  );
}
