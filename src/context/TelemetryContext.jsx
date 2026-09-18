import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { backendApi } from '../api/backendClient';

const TelemetryContext = createContext(null);

const DEFAULT_CHECKLIST = [
  {
    id: 1,
    title: '1. Dyeing Pipeline Visual Check',
    task: 'Inspect 4" Schedule 40 feed pipe at Column C-12, Bay 4 for visible weeping, spray, or floor pooling.',
    finding: 'Minor wet pooling noted under joint sleeve; moisture actively accumulating.',
    status: 'VERIFIED',
    checked: true,
  },
  {
    id: 2,
    title: '2. Valve Assembly Verification',
    task: 'Verify Linear Servo Valve SV-04 position readout (SCADA: 65% throttled vs mechanical stem dial).',
    finding: 'Mechanical pointer matches 65%. Actuator not hunting.',
    status: 'VERIFIED',
    checked: true,
  },
  {
    id: 3,
    title: '3. Flange & Joint Integrity (Critical)',
    task: 'Check Flange DJ-04 gasket seal for micro-jet leakage or acoustic cavitation hiss.',
    finding: 'Suspected blown spiral-wound gasket; ultrasonic probe AN-08 peaking here.',
    status: 'ACTION_REQ',
    checked: false,
  },
  {
    id: 4,
    title: '4. Hydrostatic Pressure Comparison',
    task: 'Cross-reference local analog gauge PG-04 with digital transmitter PT-04 (Expected: 3.2 bar, Current: 2.4 bar).',
    finding: 'Analog gauge reading: In transit with pressure calibrator.',
    status: 'PENDING',
    checked: false,
  },
  {
    id: 5,
    title: '5. Sub-Meter Calibration Check',
    task: 'Verify electromagnetic flowmeter FM-04 zero-point reading against reference clamp-on ultrasonic probe.',
    finding: 'Portable transit-time meter mounted on bypass loop.',
    status: 'PENDING',
    checked: false,
  },
  {
    id: 6,
    title: '6. Production Recipe Alignment',
    task: 'Confirm Dyeing Master operator has not initiated an unlogged manual dilution or emergency vessel rinse cycle.',
    finding: 'Operator verbal confirmation: Standard recipe followed strictly.',
    status: 'PENDING',
    checked: false,
  },
];

export const SCENARIO_PRESETS = {
  dyeing_leak: {
    id: 'dyeing_leak',
    name: 'Dyeing Zone Leak (Active)',
    badge: 'ACTIVE LEAK',
    batchRef: 'DY-2409',
    fabricWeight: 1240,
    recipeIntensity: 0.96,
    expectedInflow: 1185,
    actualInflow: 1420,
    leakGap: 240,
    headerPressure: 2.4,
    nominalPressure: 3.2,
    activeAnomalies: 1,
    anomalySeverity: 'CRITICAL',
    dyeingFlow: 740,
    washingFlow: 260,
    rinsingFlow: 180,
    acousticFreq: '7.4 kHz',
    confidence: 87,
    estLossToday: 3420,
    waterBalancePct: 83.1,
    description: 'Abnormal divergence detected in Line D-01 with acoustic cavitation and pressure drop.',
  },
  normal: {
    id: 'normal',
    name: 'Normal Production',
    badge: 'NOMINAL',
    batchRef: 'DY-2409',
    fabricWeight: 1240,
    recipeIntensity: 0.96,
    expectedInflow: 1185,
    actualInflow: 1188,
    leakGap: 0,
    headerPressure: 3.2,
    nominalPressure: 3.2,
    activeAnomalies: 0,
    anomalySeverity: 'NOMINAL',
    dyeingFlow: 502,
    washingFlow: 258,
    rinsingFlow: 181,
    acousticFreq: 'Quiet',
    confidence: 0,
    estLossToday: 0,
    waterBalancePct: 99.8,
    description: 'Steady state flow tracking production recipe within ±0.3% dynamic margin.',
  },
  high_production: {
    id: 'high_production',
    name: 'High Production (Valid)',
    badge: 'VALID RAMP',
    batchRef: 'DY-2410 (Heavy Twill)',
    fabricWeight: 2100,
    recipeIntensity: 0.96,
    expectedInflow: 1640,
    actualInflow: 1645,
    leakGap: 0,
    headerPressure: 3.1,
    nominalPressure: 3.2,
    activeAnomalies: 0,
    anomalySeverity: 'NOMINAL',
    dyeingFlow: 780,
    washingFlow: 390,
    rinsingFlow: 260,
    acousticFreq: 'Nominal',
    confidence: 0,
    estLossToday: 0,
    waterBalancePct: 99.5,
    description: 'Surge in intake corresponds directly with 2,100 kg fabric load. No false alarm raised.',
  },
  valve_stuck: {
    id: 'valve_stuck',
    name: 'Valve Stuck Open',
    badge: 'VALVE FAULT',
    batchRef: 'DY-2409',
    fabricWeight: 1240,
    recipeIntensity: 0.96,
    expectedInflow: 1185,
    actualInflow: 1380,
    leakGap: 195,
    headerPressure: 2.8,
    nominalPressure: 3.2,
    activeAnomalies: 1,
    anomalySeverity: 'MODERATE',
    dyeingFlow: 695,
    washingFlow: 260,
    rinsingFlow: 180,
    acousticFreq: '3.1 kHz',
    confidence: 68,
    estLossToday: 2150,
    waterBalancePct: 85.8,
    description: 'Bypass line SV-02 servo actuator failing to seat fully during wash cycle.',
  },
  sensor_fault: {
    id: 'sensor_fault',
    name: 'Sensor Fault',
    badge: 'TELEMETRY DRIFT',
    batchRef: 'DY-2409',
    fabricWeight: 1240,
    recipeIntensity: 0.96,
    expectedInflow: 1185,
    actualInflow: 1185,
    leakGap: 0,
    headerPressure: 3.2,
    nominalPressure: 3.2,
    activeAnomalies: 1,
    anomalySeverity: 'SENSOR_DRIFT',
    dyeingFlow: 500,
    washingFlow: 260,
    rinsingFlow: 180,
    acousticFreq: 'Quiet',
    confidence: 12,
    estLossToday: 0,
    waterBalancePct: 97.4,
    description: 'Electromagnetic sensor FM-04 zero-point drift; water balance continuity intact.',
  },
};

export function TelemetryProvider({ children }) {
  // Navigation
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'schematic' | 'anomalies' | 'investigation' | 'water-loss' | 'status'

  // Scenario
  const [currentScenarioKey, setCurrentScenarioKey] = useState('dyeing_leak');
  const scenario = SCENARIO_PRESETS[currentScenarioKey];

  // Simulation Overrides
  const [simWeight, setSimWeight] = useState(1240);
  const [simLeakRate, setSimLeakRate] = useState(240);
  const [kalmanFilter, setKalmanFilter] = useState(true);
  const [isSimModalOpen, setIsSimModalOpen] = useState(false);

  // Quick Isolation Modal
  const [isIsolationModalOpen, setIsIsolationModalOpen] = useState(false);
  const [isolatedValves, setIsolatedValves] = useState([]); // e.g. ['SV-04']

  // Incident AW-0042 State
  const [incidentStatus, setIncidentStatus] = useState('OPEN'); // 'OPEN' | 'PHYSICAL_INSPECTION' | 'RESOLVED'
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(872); // 14m 32s
  const [checklist, setChecklist] = useState(DEFAULT_CHECKLIST);
  const [technicianNotes, setTechnicianNotes] = useState(
    'Floor technician dispatched to Bay 4 at 14:38 IST. Acoustic hydrophone AN-08 confirms high frequency noise (7.4 kHz) at Joint DJ-04. Gasket creep suspected on secondary flange.'
  );

  // Tariff Modeler
  const [baseTariff, setBaseTariff] = useState(100); // INR per m³
  const [zldSurcharge, setZldSurcharge] = useState(35); // INR per m³

  // Live Backend Integration State
  const [backendConnected, setBackendConnected] = useState(false);
  const [backendSnapshot, setBackendSnapshot] = useState(null);
  const [backendSyncTime, setBackendSyncTime] = useState(null);

  // Poll FastAPI Backend (http://127.0.0.1:8000)
  useEffect(() => {
    let active = true;

    async function checkAndPoll() {
      try {
        const state = await backendApi.fetchCurrentState();
        if (active && state && state.flows) {
          setBackendConnected(true);
          setBackendSnapshot(state);
          setBackendSyncTime(new Date());
        }
      } catch {
        if (active) {
          setBackendConnected(false);
        }
      }
    }

    checkAndPoll();
    const interval = setInterval(checkAndPoll, 1800);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  // Live Timer for elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format Elapsed Time
  const formattedElapsedTime = useMemo(() => {
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  }, [elapsedSeconds]);

  // Derived effective values (harmonizing backend physics & local preset simulation)
  const effectiveLeakRate = useMemo(() => {
    if (isolatedValves.includes('SV-04') || incidentStatus === 'RESOLVED') {
      return 0;
    }
    if (backendConnected && backendSnapshot?.active_leaks) {
      const activeLeaksTotal = Object.values(backendSnapshot.active_leaks).reduce((a, b) => a + b, 0);
      if (activeLeaksTotal > 0) return Math.round(activeLeaksTotal);
    }
    if (currentScenarioKey === 'dyeing_leak') {
      return simLeakRate;
    }
    return scenario.leakGap;
  }, [isolatedValves, incidentStatus, backendConnected, backendSnapshot, currentScenarioKey, simLeakRate, scenario.leakGap]);

  const effectiveInflow = useMemo(() => {
    if (backendConnected && backendSnapshot?.flows?.J1) {
      return Math.round(backendSnapshot.flows.J1);
    }
    return scenario.expectedInflow + effectiveLeakRate;
  }, [backendConnected, backendSnapshot, scenario.expectedInflow, effectiveLeakRate]);

  // Live flows per zone
  const liveDyeingFlow = useMemo(() => {
    if (backendConnected && backendSnapshot?.flows?.J2) {
      return Math.round(backendSnapshot.flows.J2);
    }
    return scenario.dyeingFlow;
  }, [backendConnected, backendSnapshot, scenario.dyeingFlow]);

  const liveWashingFlow = useMemo(() => {
    if (backendConnected && backendSnapshot?.flows?.J3) {
      return Math.round(backendSnapshot.flows.J3);
    }
    return scenario.washingFlow;
  }, [backendConnected, backendSnapshot, scenario.washingFlow]);

  const liveFinishingFlow = useMemo(() => {
    if (backendConnected && backendSnapshot?.flows?.J4) {
      return Math.round(backendSnapshot.flows.J4);
    }
    return scenario.rinsingFlow;
  }, [backendConnected, backendSnapshot, scenario.rinsingFlow]);

  const liveUtilityFlow = useMemo(() => {
    if (backendConnected && backendSnapshot?.flows?.J7) {
      return Math.round(backendSnapshot.flows.J7);
    }
    return 115;
  }, [backendConnected, backendSnapshot]);

  const liveHeaderPressure = useMemo(() => {
    if (backendConnected && backendSnapshot?.pressures?.J1) {
      return Number(backendSnapshot.pressures.J1.toFixed(1));
    }
    return scenario.headerPressure;
  }, [backendConnected, backendSnapshot, scenario.headerPressure]);

  // Financial Calculations
  const financialImpact = useMemo(() => {
    // 1 m3 = 1000 Liters
    const totalTariffPerM3 = baseTariff + zldSurcharge;
    const lossLitersPerMinute = effectiveLeakRate;
    const hourlyLossLiters = lossLitersPerMinute * 60;
    const hourlyLossCost = (hourlyLossLiters / 1000) * totalTariffPerM3;
    const shiftLossCost = hourlyLossCost * 8; // 8-hour shift
    const dailyProjectedCost = hourlyLossCost * 24;
    const monthlyRiskCost = dailyProjectedCost * 30;

    // Cumulative loss based on elapsed time (approx 14m default)
    const cumulativeLiters = (lossLitersPerMinute * (elapsedSeconds / 60));
    const cumulativeCost = Math.round((cumulativeLiters / 1000) * baseTariff);

    return {
      baseTariff,
      zldSurcharge,
      totalTariffPerM3,
      lossLitersPerMinute,
      hourlyLossLiters,
      hourlyLossCost: Math.round(hourlyLossCost),
      shiftLossCost: Math.round(shiftLossCost),
      dailyProjectedCost: Math.round(dailyProjectedCost),
      monthlyRiskCost: Math.round(monthlyRiskCost),
      cumulativeLiters: Math.round(cumulativeLiters),
      cumulativeCost: Math.max(0, cumulativeCost),
      annualRisk: Math.round(dailyProjectedCost * 365),
    };
  }, [baseTariff, zldSurcharge, effectiveLeakRate, elapsedSeconds]);

  // Toggle Checklist item
  const toggleChecklistItem = (id) => {
    setChecklist((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newChecked = !item.checked;
          return {
            ...item,
            checked: newChecked,
            status: newChecked ? 'VERIFIED' : 'PENDING',
          };
        }
        return item;
      })
    );
  };

  // Toggle Valve Isolation (SV-04 shuts off Branch A leak)
  const toggleValveIsolation = (valveId) => {
    setIsolatedValves((prev) => {
      const willIsolate = !prev.includes(valveId);
      if (backendConnected && valveId === 'SV-04') {
        if (willIsolate) {
          backendApi.clearLeak('J2').catch(() => {});
        } else if (currentScenarioKey === 'dyeing_leak') {
          backendApi.injectLeak('J2', simLeakRate).catch(() => {});
        }
      }
      return willIsolate ? [...prev, valveId] : prev.filter((v) => v !== valveId);
    });
  };

  // Switch Scenario handler
  const setScenario = (key) => {
    if (SCENARIO_PRESETS[key]) {
      setCurrentScenarioKey(key);
      if (key === 'dyeing_leak') {
        setSimLeakRate(240);
        setIsolatedValves([]);
        setIncidentStatus('OPEN');
        if (backendConnected) {
          backendApi.injectLeak('J2', 240).catch(() => {});
        }
      } else if (key === 'normal') {
        setSimLeakRate(0);
        setIncidentStatus('RESOLVED');
        if (backendConnected) {
          backendApi.clearLeak().catch(() => {});
        }
      } else if (key === 'high_production') {
        setSimLeakRate(0);
        setIncidentStatus('RESOLVED');
        if (backendConnected) {
          backendApi.clearLeak().catch(() => {});
          ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8'].forEach((m) => {
            backendApi.controlMachine(m, 180, 'RUNNING').catch(() => {});
          });
        }
      }
    }
  };

  const value = {
    activeTab,
    setActiveTab,
    currentScenarioKey,
    setScenario,
    scenario,
    simWeight,
    setSimWeight,
    simLeakRate,
    setSimLeakRate,
    kalmanFilter,
    setKalmanFilter,
    isSimModalOpen,
    setIsSimModalOpen,
    isIsolationModalOpen,
    setIsIsolationModalOpen,
    isolatedValves,
    toggleValveIsolation,
    incidentStatus,
    setIncidentStatus,
    isAcknowledged,
    setIsAcknowledged,
    elapsedSeconds,
    formattedElapsedTime,
    checklist,
    toggleChecklistItem,
    technicianNotes,
    setTechnicianNotes,
    baseTariff,
    setBaseTariff,
    zldSurcharge,
    setZldSurcharge,
    financialImpact,
    effectiveLeakRate,
    effectiveInflow,
    liveDyeingFlow,
    liveWashingFlow,
    liveFinishingFlow,
    liveUtilityFlow,
    liveHeaderPressure,
    backendConnected,
    backendSnapshot,
    backendSyncTime,
  };

  return (
    <TelemetryContext.Provider value={value}>
      {children}
    </TelemetryContext.Provider>
  );
}

export function useTelemetry() {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error('useTelemetry must be used within a TelemetryProvider');
  }
  return context;
}
