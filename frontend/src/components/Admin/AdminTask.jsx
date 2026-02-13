import React, { useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { format } from 'date-fns';

const AdminTask = () => {
  const { tasks, loading, deleteTask, filters, updateTaskFilters, pagination, changeTaskPage } = useAdmin();
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    updateTaskFilters({ search: searchInput });
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    updateTaskFilters({ status, page: 1 });
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setDeletingTaskId(taskId);
      try {
        await deleteTask(taskId);
      } finally {
        setDeletingTaskId(null);
      }
    }
  };

  const clearFilters = () => {
    setSearchInput('');
    setStatusFilter('');
    updateTaskFilters({ status: '', search: '', page: 1 });
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'completed': 
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'in-progress': 
        return 'bg-sky-500/10 text-sky-500 border-sky-500/20';
      case 'pending': 
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: 
        return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case 'completed': return 'COMPLETED';
      case 'in-progress': return 'IN PROGRESS';
      case 'pending': return 'PENDING';
      default: return status?.toUpperCase() || 'PENDING';
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  if (loading.tasks && tasks.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-bold">All Tasks</h2>
        <span className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-sm w-fit">
          Total: {pagination.tasks.total}
        </span>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search tasks by title or description..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 outline-none focus:border-indigo-500 transition-all"
            />
            <svg 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button 
            type="submit"
            className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 px-4 py-2 rounded-xl transition-all"
          >
            Search
          </button>
        </form>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleStatusFilter('')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              statusFilter === '' 
                ? 'bg-indigo-500 text-white' 
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleStatusFilter('pending')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              statusFilter === 'pending' 
                ? 'bg-amber-500 text-white' 
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => handleStatusFilter('in-progress')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              statusFilter === 'in-progress' 
                ? 'bg-sky-500 text-white' 
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => handleStatusFilter('completed')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              statusFilter === 'completed' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            Completed
          </button>
          
          {(statusFilter || searchInput) && (
            <button
              onClick={clearFilters}
              className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
          <svg className="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-xl font-bold text-slate-300 mb-2">No tasks found</h3>
          <p className="text-slate-500">No tasks match your search criteria</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task._id} className="bg-white/5 border border-white/10 rounded-2xl p-6 relative group hover:bg-white/10 transition-all">
              <div className="absolute top-6 right-6 flex items-center gap-4 opacity-60 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleDeleteTask(task._id)}
                  disabled={deletingTaskId === task._id}
                  className="hover:text-red-400 transition-colors disabled:opacity-50"
                  title="Delete task"
                >
                  {deletingTaskId === task._id ? (
                    <div className="animate-spin h-5 w-5 border-2 border-red-400 border-t-transparent rounded-full"></div>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="max-w-[85%]">
                <h3 className="text-xl font-bold mb-2 text-white">
                  {task.title}
                </h3>
                
                {task.description && (
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed line-clamp-2">
                    {task.description}
                  </p>
                )}
                
                <div className={`inline-block px-3 py-1 rounded-md text-[10px] font-bold border ${getStatusStyles(task.status)} mb-4 tracking-wider`}>
                  {formatStatus(task.status)}
                </div>
                
                <div className="flex flex-col gap-2 text-slate-500 text-xs">
                  <div className="flex items-center gap-2">
                    <span>📅</span> 
                    {formatDate(task.createdAt)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span>👤</span> 
                    {task.createdBy?.fullName || task.createdBy?.email || 'Unknown'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.tasks.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => changeTaskPage(pagination.tasks.page - 1)}
            disabled={pagination.tasks.page === 1}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
          >
            Previous
          </button>
          
          <span className="px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
            Page {pagination.tasks.page} of {pagination.tasks.totalPages}
          </span>
          
          <button
            onClick={() => changeTaskPage(pagination.tasks.page + 1)}
            disabled={pagination.tasks.page === pagination.tasks.totalPages}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminTask;