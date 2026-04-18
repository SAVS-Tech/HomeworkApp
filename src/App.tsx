import { useState } from 'react';
import { AssignmentProvider } from './context/AssignmentContext';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { AssignmentForm } from './components/AssignmentForm';
import { ScheduleView } from './components/ScheduleView';
import { SelfCare } from './components/SelfCare';
import { Settings } from './components/Settings';
import { SplashScreen } from './components/SplashScreen';

export type View = 'dashboard' | 'assignment' | 'schedule' | 'selfcare' | 'settings';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [showSplash, setShowSplash] = useState(true);

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
      <SplashScreen onComplete={() => setShowSplash(false)} />
      <div className={`min-h-screen bg-cream flex flex-col transition-opacity duration-500 ${showSplash ? 'opacity-0' : 'opacity-100'}`}>
        <main className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full relative">
          {renderView()}
        </main>
        <Navigation currentView={currentView} onViewChange={setCurrentView} />
      </div>
    </AssignmentProvider>
  );
}

export default App;
