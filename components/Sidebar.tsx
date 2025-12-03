import React from 'react';
import { LayoutDashboard, ScanFace, FileText, Database, ShieldCheck, LogOut } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewState.SCANNER, label: 'Live Scanner', icon: ScanFace },
    { id: ViewState.LOGS, label: 'Visitor Logs', icon: FileText },
    { id: ViewState.DATABASE, label: 'Face Database', icon: Database },
  ];

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0 shadow-xl z-50">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <ShieldCheck className="w-8 h-8 text-indigo-400" />
        <div>
          <h1 className="text-xl font-bold tracking-tight">VisiTrack</h1>
          <p className="text-xs text-slate-400">Security & Analytics</p>
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-lg p-4 mb-4">
          <p className="text-xs text-slate-400 mb-1">System Status</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-semibold text-green-400">Online</span>
          </div>
        </div>
        <button className="flex items-center gap-2 text-slate-400 hover:text-white text-sm w-full px-2 py-2">
          <LogOut size={16} />
          <span>Logout System</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;