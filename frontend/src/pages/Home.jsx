import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // If already authenticated, redirect to appropriate dashboard
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        navigate('/adminDashboard');
      } else {
        navigate('/userDashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white font-sans selection:bg-purple-500/30 overflow-x-hidden relative">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">TaskManager</span>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
          <button
            onClick={() => navigate("/adminSignIn")}
            className="cursor-pointer text-sm font-medium text-slate-400 hover:text-white transition-colors px-4 py-2 border border-slate-800 rounded-full hover:bg-slate-800"
          >
            Admin Dashboard
          </button>
          
          <button 
            className="cursor-pointer flex items-center gap-2 bg-[#5d5ae5] hover:bg-[#4e4bc9] transition-all px-5 py-2.5 rounded-lg font-medium text-sm shadow-lg shadow-indigo-500/20"
            onClick={() => navigate("/userSignIn")}
          >
            Go to Dashboard <span>→</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20 pb-32 max-w-4xl mx-auto">
        
        <div className="mb-8 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full inline-flex items-center">
          <span className="text-xs md:text-sm font-medium text-slate-200">Manage Your Tasks Efficiently</span>
        </div>

        <h1 className="text-4xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
          Organize Everything with <br />
          <span className="bg-gradient-to-r from-[#818cf8] via-[#c084fc] to-[#e879f9] bg-clip-text text-transparent">
            Smart Task Management
          </span>
        </h1>

        <p className="text-slate-400 text-base md:text-lg max-w-2xl leading-relaxed mb-10">
          A full-featured application for creating, tracking, and completing tasks, managing 
          CRUD operations, setting reminders, and collaborating with your team. 
        </p>

        <button 
          onClick={() => navigate("/userSignIn")}
          className="cursor-pointer group flex items-center gap-3 bg-[#5d5ae5] hover:bg-[#4e4bc9] transition-all px-8 py-4 rounded-xl font-semibold text-lg shadow-xl shadow-indigo-500/25"
        >
          Open Dashboard
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </main>
    </div>
  );
};

export default Home;