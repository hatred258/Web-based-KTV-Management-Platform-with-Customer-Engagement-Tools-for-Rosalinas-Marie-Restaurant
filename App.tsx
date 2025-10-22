import React, { useState } from 'react';
import { User, UserRole } from './types';
import LandingPage from './components/LandingPage';
import AdminDashboard from './components/AdminDashboard';
import CustomerDashboard from './components/CustomerDashboard';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (name: string, role: UserRole, roomName?: string) => {
    setUser({ id: `user-${Date.now()}`, name, role, currentRoom: roomName });
  };

  const handleLogout = () => {
    setUser(null);
  };

  const renderContent = () => {
    if (!user) {
      return <LandingPage onLogin={handleLogin} />;
    }

    switch (user.role) {
      case UserRole.Admin:
      case UserRole.Staff:
        return <AdminDashboard user={user} onLogout={handleLogout} />;
      case UserRole.Customer:
        return <CustomerDashboard user={user} onLogout={handleLogout} />;
      default:
        return <LandingPage onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      {renderContent()}
    </div>
  );
};

export default App;