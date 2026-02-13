import React, { useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import TaskItem from './TaskItem';
import TaskModal from './TaskModal';

const UserTask = () => {
  const {
    tasks,
    loading,
    pagination,
    filters,
    updateFilters,
    changePage,
    createTask,
    updateTask,
    deleteTask,
    refreshData
  } = useTasks();

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const handleCreateTask = async (taskData) => {
    setModalLoading(true);
    try {
      await createTask(taskData);
      setCreateModalOpen(false);
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateTask = async (taskData) => {
    if (!selectedTask) return;
    
    setModalLoading(true);
    try {
      await updateTask(selectedTask._id, taskData);
      setEditModalOpen(false);
      setSelectedTask(null);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId);
    }
  };

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setEditModalOpen(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilters({ search: searchInput, page: 1 });
  };

  const handleStatusFilter = (status) => {
    updateFilters({ status, page: 1 });
  };

  const clearFilters = () => {
    setSearchInput('');
    updateFilters({ status: '', search: '', page: 1 });
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="mt-12 relative z-10">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-bold">All Tasks</h2>
          <span className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-sm">
            {pagination.total} total
          </span>
        </div>
        
        <button 
          onClick={() => setCreateModalOpen(true)}
          className="bg-[#5d5ae5] hover:bg-[#4e4bc9] px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm transition-all w-full md:w-auto justify-center"
        >
          <span className="text-xl">+</span> New Task
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search tasks..."
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
              filters.status === '' 
                ? 'bg-indigo-500 text-white' 
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleStatusFilter('pending')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              filters.status === 'pending' 
                ? 'bg-amber-500 text-white' 
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => handleStatusFilter('in-progress')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              filters.status === 'in-progress' 
                ? 'bg-sky-500 text-white' 
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => handleStatusFilter('completed')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              filters.status === 'completed' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            Completed
          </button>
          
          {(filters.status || filters.search) && (
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
          <p className="text-slate-500 mb-6">Get started by creating your first task!</p>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="bg-[#5d5ae5] hover:bg-[#4e4bc9] px-6 py-3 rounded-lg font-bold text-sm transition-all inline-flex items-center gap-2"
          >
            <span>+</span> Create Task
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onEdit={handleEditClick}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => changePage(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
          >
            Previous
          </button>
          
          <span className="px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          
          <button
            onClick={() => changePage(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
          >
            Next
          </button>
        </div>
      )}

      {/* Modals */}
      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        type="create"
        onSubmit={handleCreateTask}
        loading={modalLoading}
      />

      <TaskModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedTask(null);
        }}
        type="edit"
        task={selectedTask}
        onSubmit={handleUpdateTask}
        loading={modalLoading}
      />
    </div>
  );
};

export default UserTask;