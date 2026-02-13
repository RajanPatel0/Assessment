import React from 'react';
import { format } from 'date-fns';

const TaskItem = ({ task, onEdit, onDelete }) => {
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

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative group hover:bg-white/10 transition-all">
      <div className="absolute top-6 right-6 flex items-center gap-4 opacity-60 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onEdit(task)}
          className="hover:text-indigo-400 transition-colors"
          title="Edit task"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
            />
          </svg>
        </button>
        <button 
          onClick={() => onDelete(task._id)}
          className="hover:text-red-400 transition-colors"
          title="Delete task"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
            />
          </svg>
        </button>
      </div>

      <div className="max-w-[85%]">
        <h3 className={`text-xl font-bold mb-2 ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-white'}`}>
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
  );
};

export default TaskItem;