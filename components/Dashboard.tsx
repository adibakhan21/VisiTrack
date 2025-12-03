import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { Users, Clock, AlertTriangle, UserCheck } from 'lucide-react';
import { VisitorLog } from '../types';

interface DashboardProps {
  logs: VisitorLog[];
}

const Dashboard: React.FC<DashboardProps> = ({ logs }) => {
  // Compute basic stats
  const totalVisitors = logs.length;
  const recognized = logs.filter(l => l.name !== 'Unknown').length;
  const unknown = totalVisitors - recognized;
  const denied = logs.filter(l => l.entryType === 'Denied').length;

  // Mock data for charts
  const hourlyData = [
    { time: '08:00', visitors: 12 },
    { time: '09:00', visitors: 45 },
    { time: '10:00', visitors: 67 },
    { time: '11:00', visitors: 58 },
    { time: '12:00', visitors: 89 },
    { time: '13:00', visitors: 40 },
    { time: '14:00', visitors: 55 },
    { time: '15:00', visitors: 62 },
    { time: '16:00', visitors: 35 },
  ];

  const categoryData = [
    { name: 'Students', value: 450 },
    { name: 'Faculty', value: 120 },
    { name: 'Staff', value: 80 },
    { name: 'Visitors', value: 150 },
  ];

  const COLORS = ['#4f46e5', '#06b6d4', '#8b5cf6', '#f43f5e'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
          <p className="text-slate-500">Real-time visitor analytics and system health.</p>
        </div>
        <div className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border shadow-sm">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Entries</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{totalVisitors}</p>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <span className="font-bold">+12%</span>&nbsp;from yesterday
            </p>
          </div>
          <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
            <Users size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Recognized</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{recognized}</p>
            <p className="text-xs text-blue-600 mt-1">
              90.5% Accuracy
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <UserCheck size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Avg Dwell Time</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">42m</p>
            <p className="text-xs text-slate-400 mt-1">Average per session</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
            <Clock size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Security Alerts</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{denied}</p>
            <p className="text-xs text-red-500 mt-1">Requires attention</p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg text-red-600">
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Traffic Overview (Hourly)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData}>
                <defs>
                  <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                />
                <Area type="monotone" dataKey="visitors" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorVis)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Visitor Categories</h3>
          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <span className="block text-2xl font-bold text-slate-900">800</span>
                <span className="text-xs text-slate-500">Total</span>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {categoryData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index]}}></div>
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;