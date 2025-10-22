import React, { useState, useEffect } from 'react';
import { User, KTVRoom, RoomStatus, SessionType, ActivityLog } from '../types';
import RoomCard from './RoomCard';
import { LogOutIcon, MicIcon } from './Icons';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

const initialRooms: KTVRoom[] = [
  { id: 'r1', name: 'The Velvet Lounge', capacity: 8, status: RoomStatus.Available, session: { id: 's1', startTime: null, elapsedTime: 0, isActive: false, type: SessionType.Hourly, rate: 40 } },
  { id: 'r2', name: 'Neon Cityscape', capacity: 12, status: RoomStatus.InUse, session: { id: 's2', startTime: Date.now() - 3661 * 1000, elapsedTime: 3661, isActive: true, type: SessionType.Hourly, rate: 50 } },
  { id: 'r3', name: 'The Golden Record', capacity: 6, status: RoomStatus.Cleaning, session: { id: 's3', startTime: null, elapsedTime: 0, isActive: false, type: SessionType.FlatRate, rate: 200 } },
  { id: 'r4', name: 'Retro Rewind', capacity: 10, status: RoomStatus.Available, session: { id: 's4', startTime: null, elapsedTime: 0, isActive: false, type: SessionType.Hourly, rate: 45 } },
  { id: 'r5', name: 'Galaxy Suite', capacity: 20, status: RoomStatus.InUse, session: { id: 's5', startTime: Date.now() - 1200 * 1000, elapsedTime: 1200, isActive: true, type: SessionType.FlatRate, rate: 400 } },
  { id: 'r6', name: 'The Speakeasy', capacity: 8, status: RoomStatus.Available, session: { id: 's6', startTime: null, elapsedTime: 0, isActive: false, type: SessionType.Hourly, rate: 40 } },
];

const initialLogs: ActivityLog[] = [
    { id: 'l1', timestamp: new Date(Date.now() - 200000), user: 'Admin', action: 'Started session in Neon Cityscape' },
    { id: 'l2', timestamp: new Date(Date.now() - 500000), user: 'Staff', action: 'Stopped session in The Velvet Lounge' },
    { id: 'l3', timestamp: new Date(Date.now() - 800000), user: 'Admin', action: 'Set The Golden Record to Cleaning' },
];


const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [rooms, setRooms] = useState<KTVRoom[]>(initialRooms);
  const [logs, setLogs] = useState<ActivityLog[]>(initialLogs);
  const [activeTab, setActiveTab] = useState('rooms');

  const handleUpdateRoom = (updatedRoom: KTVRoom) => {
    const originalRoom = rooms.find(r => r.id === updatedRoom.id);
    
    if (originalRoom && originalRoom.status !== updatedRoom.status) {
      const newLog: ActivityLog = {
        id: `l-${Date.now()}`,
        timestamp: new Date(),
        user: user.name,
        action: `Set room '${updatedRoom.name}' status to '${updatedRoom.status}'`,
      };
      setLogs(prevLogs => [newLog, ...prevLogs]);
    }

    setRooms(rooms.map(r => r.id === updatedRoom.id ? updatedRoom : r));
  };
  
  useEffect(() => {
    // In a real app, this might be where you connect to a WebSocket for real-time updates
  }, []);

  const exportBillingSummary = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Room,Status,SessionType,Rate,ElapsedTime(s),TotalBill\n";
    rooms.forEach(room => {
      const bill = room.session.type === 'hourly' ? (room.session.elapsedTime/3600 * room.session.rate).toFixed(2) : room.session.rate.toFixed(2);
      csvContent += `${room.name},${room.status},${room.session.type},${room.session.rate},${room.session.elapsedTime},${bill}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `billing_summary_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <header className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <div className="flex items-center space-x-3">
          <MicIcon className="w-8 h-8 text-brand-primary" />
          <h1 className="text-3xl font-display text-brand-text">Admin Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-brand-text-secondary">Welcome, {user.name} ({user.role})</span>
          <button onClick={onLogout} className="flex items-center space-x-2 text-brand-text-secondary hover:text-brand-primary transition-colors">
            <LogOutIcon className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </header>
      
      <main className="bg-brand-surface/50 p-6 rounded-lg">
        <div className="flex border-b border-brand-primary/20 mb-6">
            <button 
                onClick={() => setActiveTab('rooms')} 
                className={`py-2 px-4 font-semibold transition-colors duration-200 ${activeTab === 'rooms' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-brand-text-secondary hover:text-brand-text'}`}
            >
                Room Management
            </button>
            <button 
                onClick={() => setActiveTab('reports')} 
                className={`py-2 px-4 font-semibold transition-colors duration-200 ${activeTab === 'reports' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-brand-text-secondary hover:text-brand-text'}`}
            >
                System & Reports
            </button>
        </div>

        {activeTab === 'rooms' && (
            <div>
                 <h2 className="text-2xl font-display text-brand-text mb-6">Room Overview</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {rooms.map(room => (
                        <RoomCard key={room.id} room={room} onUpdateRoom={handleUpdateRoom} />
                    ))}
                 </div>
            </div>
        )}

        {activeTab === 'reports' && (
            <div>
                <div className="mb-8 flex justify-between items-center">
                    <h2 className="text-2xl font-display text-brand-text">Billing Reports</h2>
                    <button
                        onClick={exportBillingSummary}
                        className="bg-brand-primary text-brand-bg font-bold py-2 px-6 rounded-md hover:bg-opacity-90 transition-all duration-200 shadow-neon-primary"
                    >
                        Export Billing Summary
                    </button>
                </div>
                
                <div className="mt-8">
                    <h2 className="text-2xl font-display text-brand-text mb-4">Activity Logs</h2>
                    <div className="bg-brand-surface rounded-lg p-4 max-h-96 overflow-y-auto">
                        <table className="w-full text-left">
                            <thead className="sticky top-0 bg-brand-surface">
                                <tr>
                                    <th className="p-2 text-brand-text-secondary">Timestamp</th>
                                    <th className="p-2 text-brand-text-secondary">User</th>
                                    <th className="p-2 text-brand-text-secondary">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map(log => (
                                    <tr key={log.id} className="border-b border-white/10 last:border-b-0">
                                        <td className="p-2 text-sm">{log.timestamp.toLocaleString()}</td>
                                        <td className="p-2 font-mono text-brand-accent">{log.user}</td>
                                        <td className="p-2">{log.action}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;