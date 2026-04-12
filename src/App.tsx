import { useState } from 'react';
import { AssignmentProvider } from './context/AssignmentContext';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { AssignmentForm } from './components/AssignmentForm';
import { ScheduleView } from './components/ScheduleView';
import { SelfCare } from './components/SelfCare';
import { Settings } from './components/Settings';

export type View = 'dashboard' | 'assignment' | 'schedule' | 'selfcare' | 'settings';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const getTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Dashboard';
      case 'assignment': return 'Assignment';
      case 'schedule': return 'Schedule';
      case 'selfcare': return 'Self Care';
      case 'settings': return 'Settings';
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onAddTask={() => setCurrentView('assignment')} />;
      case 'assignment':
        return <AssignmentForm onBack={() => setCurrentView('dashboard')} />;
      case 'schedule':
        return <ScheduleView />;
      case 'selfcare':
        return <SelfCare />;
      case 'settings':
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <AssignmentProvider>
      <div className="min-h-screen bg-cream flex flex-col">
        <header className="bg-navy py-6 px-4 text-center shadow-lg">
          <h1 className="font-display text-cream-text text-4xl md:text-5xl tracking-wide">
            {getTitle()}
          </h1>
        </header>
        <main className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full relative">
          {renderView()}
        </main>
        <Navigation currentView={currentView} onViewChange={setCurrentView} />
      </div>
    </AssignmentProvider>
  );
}

export default App;
