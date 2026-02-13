import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import UserTask from '../components/User/UserTask';

const UserDashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { stats, refreshData } = useTasks();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Refresh data when component mounts
  useEffect(() => {
    refreshData();
  }, []);

  // DEBUG: Log stats to see what's coming from backend
  useEffect(() => {
    console.log('Current stats from useTasks:', stats);
  }, [stats]);

  const statsConfig = [
    { 
      label: 'TOTAL TASKS', 
      value: stats.total || 0, 
      icon: 'list', 
      color: 'bg-indigo-500/20', 
      textColor: 'text-indigo-400', 
      border: 'border-indigo-500/30' 
    },
    { 
      label: 'COMPLETED', 
      value: stats.completed || 0, 
      icon: 'check', 
      color: 'bg-emerald-500/20', 
      textColor: 'text-emerald-400', 
      border: 'border-emerald-500/30' 
    },
    { 
      label: 'IN PROGRESS', 
      value: stats['in-progress'] || 0, 
      icon: 'clock', 
      color: 'bg-sky-500/20', 
      textColor: 'text-sky-400', 
      border: 'border-sky-500/30' 
    },
    { 
      label: 'PENDING', 
      value: stats.pending || 0, 
      icon: 'alert', 
      color: 'bg-amber-500/20', 
      textColor: 'text-amber-400', 
      border: 'border-amber-500/30' 
    },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white font-sans p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[30%] h-[30%] bg-indigo-600/10 blur-[120px] rounded-full" />

      {/* Header with Logout */}
      <div className="flex justify-between items-center mb-12 relative z-10">
        <div 
          className="flex items-center gap-2 group cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">TaskManager</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg transition-all border border-red-500/20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>

      {/* Header Section */}
      <header className="mb-10 relative z-10">
        <p className="text-slate-400 text-lg md:text-xl font-medium mb-1">Welcome back</p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">{user?.fullName || 'User'}</h1>
        <p className="text-indigo-400 font-bold text-xs md:text-sm tracking-[0.2em] uppercase">
          User Dashboard
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {statsConfig.map((stat, index) => (
          <div 
            key={index} 
            className={`bg-white/5 border ${stat.border} rounded-2xl p-5 md:p-8 
            flex flex-col justify-between 
            min-h-[160px] md:min-h-[220px]
            transition-all hover:bg-white/10`}
          >
            <div className="flex justify-between items-start">
              <span className="text-slate-400 font-bold text-sm tracking-wider leading-tight w-20">
                {stat.label}
              </span>
              
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center`}>
                {stat.icon === 'list' && (
                  <svg className={`w-6 h-6 ${stat.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                )}
                {stat.icon === 'check' && (
                  <svg className={`w-6 h-6 ${stat.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {stat.icon === 'clock' && (
                  <svg className={`w-6 h-6 ${stat.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {stat.icon === 'alert' && (
                  <svg className={`w-6 h-6 ${stat.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                )}
              </div>
            </div>

            <div className="text-6xl md:text-7xl font-bold mt-4">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <UserTask />
    </div>
  );
};

export default UserDashboard;