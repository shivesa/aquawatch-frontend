import React from 'react';
import { TelemetryProvider, useTelemetry } from './context/TelemetryContext';
import TopAppBar from './components/layout/TopAppBar';
import SidebarNav from './components/layout/SidebarNav';
import SimulationModal from './components/common/SimulationModal';
import IsolationModal from './components/common/IsolationModal';

import FactoryOverviewScreen from './screens/FactoryOverviewScreen';
import LiveNetworkSchematicScreen from './screens/LiveNetworkSchematicScreen';
import AnomaliesLogScreen from './screens/AnomaliesLogScreen';
import IncidentInvestigationScreen from './screens/IncidentInvestigationScreen';
import WaterLossScreen from './screens/WaterLossScreen';
import SystemStatusScreen from './screens/SystemStatusScreen';

function AppContent() {
  const { activeTab } = useTelemetry();

  const renderScreen = () => {
    switch (activeTab) {
      case 'overview':
        return <FactoryOverviewScreen />;
      case 'schematic':
        return <LiveNetworkSchematicScreen />;
      case 'anomalies':
        return <AnomaliesLogScreen />;
      case 'investigation':
        return <IncidentInvestigationScreen />;
      case 'water-loss':
        return <WaterLossScreen />;
      case 'status':
        return <SystemStatusScreen />;
      default:
        return <FactoryOverviewScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col antialiased">
      <TopAppBar />
      <SidebarNav />
      {renderScreen()}
      <SimulationModal />
      <IsolationModal />
    </div>
  );
}

export default function App() {
  return (
    <TelemetryProvider>
      <AppContent />
    </TelemetryProvider>
  );
}
