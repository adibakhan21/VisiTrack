import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FaceScanner from './components/FaceScanner';
import VisitorLog from './components/VisitorLog';
import { ViewState, VisitorLog as VisitorLogType } from './types';
import { Database } from 'lucide-react';

// Pre-fill with some dummy data for the visual
const INITIAL_LOGS: VisitorLogType[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    confidence: 0.96,
    entryType: 'Check-In',
    imageUrl: 'https://picsum.photos/200',
    attributes: { ageRange: '22-25', gender: 'Male', emotion: 'Neutral', glasses: false }
  },
  {
    id: '2',
    name: 'Unknown',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    confidence: 0.45,
    entryType: 'Denied',
    imageUrl: 'https://picsum.photos/201',
    attributes: { ageRange: '30-35', gender: 'Female', emotion: 'Surprised', glasses: true }
  },
  {
    id: '3',
    name: 'Amit Singh',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    confidence: 0.92,
    entryType: 'Check-In',
    imageUrl: 'https://picsum.photos/202',
    attributes: { ageRange: '40-45', gender: 'Male', emotion: 'Happy', glasses: true }
  },
    {
    id: '4',
    name: 'Sneha Gupta',
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    confidence: 0.98,
    entryType: 'Check-In',
    imageUrl: 'https://picsum.photos/203',
    attributes: { ageRange: '20-22', gender: 'Female', emotion: 'Neutral', glasses: false }
  },
];

const DatabaseView: React.FC = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Registered Database</h2>
        <p className="text-slate-500">Manage 5,000+ scraped and processed student profiles.</p>
      </div>
      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium shadow-sm hover:bg-indigo-700">
        Add New Profile
      </button>
    </div>
    <div className="bg-white p-12 rounded-xl border border-slate-200 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
        <Database size={32} />
      </div>
      <h3 className="text-lg font-medium text-slate-900">Database Simulator</h3>
      <p className="text-slate-500 max-w-md mx-auto mt-2">
        This section represents the backend database containing embeddings from 
        IIT Kanpur's internal search data. In a full deployment, this would interface 
        with the Flask API to manage FaceNet encodings.
      </p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [logs, setLogs] = useState<VisitorLogType[]>(INITIAL_LOGS);

  const handleNewLog = (log: VisitorLogType) => {
    setLogs(prev => [log, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      
      <main className="pl-64">
        <div className="max-w-7xl mx-auto p-8">
          {currentView === ViewState.DASHBOARD && <Dashboard logs={logs} />}
          {currentView === ViewState.SCANNER && <FaceScanner onLogEntry={handleNewLog} />}
          {currentView === ViewState.LOGS && <VisitorLog logs={logs} />}
          {currentView === ViewState.DATABASE && <DatabaseView />}
        </div>
      </main>
    </div>
  );
};

export default App;