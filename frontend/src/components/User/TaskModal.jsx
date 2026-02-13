import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const TaskModal = ({ isOpen, onClose, type, task, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending'
  });

  useEffect(() => {
    if (task && type === 'edit') {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'pending'
      });
    }
  }, [task, type, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || formData.title.trim().length < 3) {
      toast.error('Title must be at least 3 characters long');
      return;
    }

    await onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      {/* Form Card */}
      <div className="bg-[#111122] border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl relative z-[110] overflow-hidden transition-all transform scale-100">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {type === 'edit' ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white transition-colors"
            disabled={loading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 tracking-widest uppercase mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title" 
              className="w-full bg-[#1a1a35] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all text-sm" 
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 tracking-widest uppercase mb-2">
              Description
            </label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4" 
              placeholder="Describe the task..." 
              className="w-full bg-[#1a1a35] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all text-sm resize-none" 
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 tracking-widest uppercase mb-2">
              Status
            </label>
            <div className="relative">
              <select 
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-[#1a1a35] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all text-sm appearance-none"
                disabled={loading}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#5d5ae5] hover:bg-[#4e4bc9] py-4 rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : (type === 'edit' ? 'Update Task' : 'Create Task')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;