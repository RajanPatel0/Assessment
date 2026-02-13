import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAdmin } from '../hooks/useAdmin';
import AdminTask from '../components/Admin/AdminTask';
import Users from '../components/User/Users';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const { user, isAuthenticated, logout } = useAuth();
  const { dashboardStats, loading, refreshAllData } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Refresh data when tab changes
  useEffect(() => {
    refreshAllData();
  }, [activeTab]);

  const stats = [
    { 
      label: 'TOTAL USERS', 
      value: dashboardStats.stats?.users?.total || 0, 
      icon: 'users', 
      color: 'bg-indigo-500/20', 
      textColor: 'text-indigo-400', 
      border: 'border-indigo-500/30' 
    },
    { 
      label: 'ALL TASKS', 
      value: dashboardStats.stats?.tasks?.total || 0, 
      icon: 'list', 
      color: 'bg-indigo-500/20', 
      textColor: 'text-indigo-400', 
      border: 'border-indigo-500/30' 
    },
    { 
      label: 'COMPLETED', 
      value: dashboardStats.stats?.tasks?.completed || 0, 
      icon: 'check', 
      color: 'bg-emerald-500/20', 
      textColor: 'text-emerald-400', 
      border: 'border-emerald-500/30' 
    },
    { 
      label: 'IN PROGRESS', 
      value: dashboardStats.stats?.tasks?.inProgress || 0, 
      icon: 'clock', 
      color: 'bg-sky-500/20', 
      textColor: 'text-sky-400', 
      border: 'border-sky-500/30' 
    },
    { 
      label: 'PENDING', 
      value: dashboardStats.stats?.tasks?.pending || 0, 
      icon: 'alert', 
      color: 'bg-amber-500/20', 
      textColor: 'text-amber-400', 
      border: 'border-amber-500/30' 
    },
  ];

  const handleLogout = async () => {
    await logout();
  };

  if (loading.dashboard) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white font-sans p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />

      {/* Header with Logout */}
      <div className="flex justify-between items-center mb-12 relative z-10">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span
            onClick={() => navigate('/')}
            className="text-xl font-bold tracking-tight cursor-pointer"
          >
            TaskManager Admin
          </span>
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
        <div className="flex items-center gap-2 text-[#f87171] mb-1 font-bold tracking-widest text-xs">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          ADMIN DASHBOARD
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">{user?.fullName || 'Admin'}</h1>
        <p className="text-slate-400 text-sm md:text-base">
          Full system access • Manage all users and tasks
        </p>
      </header>

      {/* Admin Stats Grid */}
      <div className="flex flex-wrap gap-6 relative z-10 mb-12">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`bg-white/5 border ${stat.border} rounded-2xl p-6 flex flex-col justify-between flex-1 min-w-[160px] md:min-w-[200px] min-h-[180px] transition-all hover:bg-white/10`}
          >
            <div className="flex justify-between items-start">
              <span className="text-slate-400 font-bold text-xs md:text-sm tracking-wider leading-tight w-20 uppercase">
                {stat.label}
              </span>
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                {stat.icon === 'users' && (
                  <svg className={`w-5 h-5 ${stat.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
                {stat.icon === 'list' && (
                  <svg className={`w-5 h-5 ${stat.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                )}
                {stat.icon === 'check' && (
                  <svg className={`w-5 h-5 ${stat.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {stat.icon === 'clock' && (
                  <svg className={`w-5 h-5 ${stat.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {stat.icon === 'alert' && (
                  <svg className={`w-5 h-5 ${stat.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                )}
              </div>
            </div>
            <div className="text-5xl md:text-6xl font-bold mt-4">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Toggle Strip */}
      <div className="relative z-10 mb-8 max-w-fit">
        <div className="flex items-center bg-[#111122] p-1.5 rounded-xl border border-white/5">
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${
              activeTab === 'tasks' 
                ? 'bg-[#5d5ae5] text-white shadow-lg' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
            </svg>
            Tasks ({dashboardStats.stats?.tasks?.total || 0})
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${
              activeTab === 'users' 
                ? 'bg-[#5d5ae5] text-white shadow-lg' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Users ({dashboardStats.stats?.users?.total || 0})
          </button>
        </div>
      </div>

      {/* Content Rendering */}
      <div className="relative z-10">
        {activeTab === 'tasks' ? (
          <AdminTask />
        ) : (
          <Users />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;