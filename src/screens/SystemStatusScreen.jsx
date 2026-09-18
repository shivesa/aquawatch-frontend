import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import ScenarioBar from '../components/common/ScenarioBar';

export default function SystemStatusScreen() {
  const { scenario, effectiveInflow, effectiveLeakRate, setActiveTab } = useTelemetry();

  return (
    <main class="ml-60 pt-14 min-h-screen bg-background pb-16">
      <div class="p-margin-desktop space-y-space-lg max-w-[1600px] mx-auto">
        <ScenarioBar />

        {/* Header */}
        <div class="flex flex-col md:flex-row md:items-center md:justify-between pb-space-sm border-b border-outline-variant gap-space-sm">
          <div>
            <div class="flex items-center gap-space-xs text-label-caps font-label-caps text-secondary mb-1">
              <span class="material-symbols-outlined text-sm">monitoring</span>
              <span>SCADA SECTION 08 // HARDWARE TELEMETRY &amp; EDGE DIAGNOSTICS</span>
            </div>
            <h1 class="text-headline-lg font-headline-lg font-bold text-on-surface tracking-tight">
              System Telemetry &amp; Node Status
            </h1>
            <p class="text-body-md font-body-md text-on-surface-variant mt-0.5">
              Live hardware health, Modbus-TCP bus registers, and real-time inference engine metrics
            </p>
          </div>

          <div class="flex items-center gap-2 font-code text-xs">
            <span class="px-2 py-1 rounded bg-green-100 text-tertiary font-bold flex items-center gap-1.5 border border-green-200">
              <span class="w-2 h-2 rounded-full bg-tertiary"></span>
              ALL CHANNELS SYNCHRONIZED
            </span>
          </div>
        </div>

        {/* 4 Hardware KPI Pods */}
        <div class="grid grid-cols-1 md:grid-cols-4 gap-space-md">
          <div class="p-space-md bg-surface-container-lowest rounded border border-outline-variant shadow-xs">
            <div class="text-label-caps font-label-caps text-on-surface-variant uppercase font-semibold text-xs">
              Sentinel Edge Node
            </div>
            <div class="text-headline-md font-bold text-on-surface mt-1">
              AW-TIRUPPUR-04
            </div>
            <p class="text-code text-xs text-on-surface-variant mt-1">ARM Cortex-M7 @ 480 MHz</p>
          </div>

          <div class="p-space-md bg-surface-container-lowest rounded border border-outline-variant shadow-xs">
            <div class="text-label-caps font-label-caps text-on-surface-variant uppercase font-semibold text-xs">
              Modbus Ingress Rate
            </div>
            <div class="text-metric-md font-metric-md text-primary font-bold mt-1 tnum">
              100 Hz / 250ms
            </div>
            <p class="text-code text-xs text-on-surface-variant mt-1">0 CRC dropped frames (24h)</p>
          </div>

          <div class="p-space-md bg-surface-container-lowest rounded border border-outline-variant shadow-xs">
            <div class="text-label-caps font-label-caps text-on-surface-variant uppercase font-semibold text-xs">
              Sensor Fleet Quality
            </div>
            <div class="text-metric-md font-metric-md text-tertiary font-bold mt-1 tnum">
              98.4% Health
            </div>
            <p class="text-code text-xs text-on-surface-variant mt-1">7 Transmitters Verified</p>
          </div>

          <div class="p-space-md bg-surface-container-lowest rounded border border-outline-variant shadow-xs">
            <div class="text-label-caps font-label-caps text-on-surface-variant uppercase font-semibold text-xs">
              Security Standard
            </div>
            <div class="text-headline-md font-bold text-on-surface mt-1">
              IEC 62443 SL-2
            </div>
            <p class="text-code text-xs text-on-surface-variant mt-1">Encrypted RS-485 bus token</p>
          </div>
        </div>

        {/* Transducers Telemetry Table */}
        <div class="bg-surface-container-lowest border border-outline-variant rounded p-space-md shadow-xs space-y-space-md">
          <div class="flex items-center justify-between border-b border-outline-variant pb-space-sm">
            <h3 class="font-headline-sm text-headline-sm font-bold text-on-surface">
              Connected Transducers &amp; Acoustic Probes Register
            </h3>
            <span class="text-code font-code text-xs text-primary font-bold">
              MODBUS-TCP REGISTER MAP 40001 - 40064
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-body-sm font-body-sm border-collapse">
              <thead>
                <tr class="bg-surface-container-low text-on-surface-variant text-label-caps uppercase border-b border-outline-variant text-[11px]">
                  <th class="py-2.5 px-3">Device Tag</th>
                  <th class="py-2.5 px-3">Instrument Type</th>
                  <th class="py-2.5 px-3">Location / Line</th>
                  <th class="py-2.5 px-3">Last Telemetry Reading</th>
                  <th class="py-2.5 px-3">Signal Health</th>
                  <th class="py-2.5 px-3">Calibration Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/60 font-code text-xs">
                <tr>
                  <td class="py-3 px-3 font-bold text-primary">FM-01</td>
                  <td class="py-3 px-3 text-on-surface">Electromagnetic Flowmeter (8&quot;)</td>
                  <td class="py-3 px-3">Main Header Supply</td>
                  <td class="py-3 px-3 font-bold tnum text-primary">{effectiveInflow} L/min</td>
                  <td class="py-3 px-3 text-tertiary font-bold">99.8% Nominal</td>
                  <td class="py-3 px-3 text-on-surface-variant">Calibrated 15-Aug-2026</td>
                </tr>

                <tr class={effectiveLeakRate > 0 ? 'bg-red-50/50' : ''}>
                  <td class="py-3 px-3 font-bold text-primary">FM-04</td>
                  <td class="py-3 px-3 text-on-surface">Electromagnetic Sub-meter (4&quot;)</td>
                  <td class="py-3 px-3">Jet Dyeing Machine 02 (D-01)</td>
                  <td class="py-3 px-3 font-bold tnum text-error">{scenario.dyeingFlow} L/min</td>
                  <td class="py-3 px-3 font-bold text-error">
                    {effectiveLeakRate > 0 ? 'Residual Divergence' : 'Nominal'}
                  </td>
                  <td class="py-3 px-3 text-on-surface-variant">Calibrated 12-Jul-2026</td>
                </tr>

                <tr class={effectiveLeakRate > 0 ? 'bg-red-50/50' : ''}>
                  <td class="py-3 px-3 font-bold text-primary">PT-04</td>
                  <td class="py-3 px-3 text-on-surface">Piezoresistive Pressure Transmitter</td>
                  <td class="py-3 px-3">Flange DJ-04 Manifold</td>
                  <td class="py-3 px-3 font-bold tnum text-error">
                    {effectiveLeakRate > 0 ? '2.4 bar' : '3.2 bar'}
                  </td>
                  <td class="py-3 px-3 font-bold text-error">
                    {effectiveLeakRate > 0 ? '-0.8 bar Drop' : 'Optimal'}
                  </td>
                  <td class="py-3 px-3 text-on-surface-variant">Zero-check valid</td>
                </tr>

                <tr class={effectiveLeakRate > 0 ? 'bg-red-50/50' : ''}>
                  <td class="py-3 px-3 font-bold text-primary">AN-08</td>
                  <td class="py-3 px-3 text-on-surface">Ultrasonic Hydrophone Acoustic Node</td>
                  <td class="py-3 px-3">Column C-12, Bay 4</td>
                  <td class="py-3 px-3 font-bold tnum text-error">
                    {effectiveLeakRate > 0 ? '7.4 kHz Cavitation' : 'Quiet (< 1 kHz)'}
                  </td>
                  <td class="py-3 px-3 font-bold text-error">
                    {effectiveLeakRate > 0 ? 'Acoustic Alert' : 'Quiet'}
                  </td>
                  <td class="py-3 px-3 text-on-surface-variant">Baseline verified</td>
                </tr>

                <tr>
                  <td class="py-3 px-3 font-bold text-primary">FM-03</td>
                  <td class="py-3 px-3 text-on-surface">Electromagnetic Sub-meter (3&quot;)</td>
                  <td class="py-3 px-3">Continuous Washing Line W-01</td>
                  <td class="py-3 px-3 font-bold tnum text-on-surface">260 L/min</td>
                  <td class="py-3 px-3 text-tertiary font-bold">99.4% Nominal</td>
                  <td class="py-3 px-3 text-on-surface-variant">Calibrated 20-Jul-2026</td>
                </tr>

                <tr>
                  <td class="py-3 px-3 font-bold text-primary">SV-04</td>
                  <td class="py-3 px-3 text-on-surface">Linear Electro-Pneumatic Control Valve</td>
                  <td class="py-3 px-3">Dyeing Feed Branch</td>
                  <td class="py-3 px-3 font-bold tnum text-on-surface">Position: 65% Throttled</td>
                  <td class="py-3 px-3 text-tertiary font-bold">Feedback Match</td>
                  <td class="py-3 px-3 text-on-surface-variant">Actuator calibrated</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
