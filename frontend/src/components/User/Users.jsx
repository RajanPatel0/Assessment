import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useAdmin } from '../../hooks/useAdmin';
import toast from 'react-hot-toast';

const Users = () => {
  const { users, loading, deleteUser, filters, updateUserFilters, pagination, changeUserPage } = useAdmin();
  const [searchInput, setSearchInput] = useState('');
  const [deletingUserId, setDeletingUserId] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    updateUserFilters({ search: searchInput });
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"? This will also delete all their tasks.`)) {
      setDeletingUserId(userId);
      try {
        await deleteUser(userId, userName);
      } finally {
        setDeletingUserId(null);
      }
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const getRoleBadgeStyles = (role) => {
    return role === 'admin' 
      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
      : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
  };

  if (loading.users && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">Registered Users</h2>
        <span className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-sm w-fit">
          Total: {pagination.users.total}
        </span>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search users by name or email..."
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
          <button type="submit" className="hidden">Search</button>
        </div>
      </form>

      {/* Users List */}
      <div className="grid grid-cols-1 gap-4">
        {users.length === 0 ? (
          <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
            <svg className="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="text-xl font-bold text-slate-300 mb-2">No users found</h3>
            <p className="text-slate-500">No users match your search criteria</p>
          </div>
        ) : (
          users.map((user) => (
            <div 
              key={user._id} 
              className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 flex items-center justify-between group hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-4 md:gap-6">
                {/* Avatar Icon */}
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full ${
                  user.role === 'admin' ? 'bg-rose-500' : 'bg-indigo-500'
                } flex items-center justify-center text-xl font-bold shadow-lg shadow-black/20`}>
                  {user.fullName?.charAt(0) || user.email?.charAt(0) || 'U'}
                </div>

                {/* User Info */}
                <div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                    <h3 className="text-lg md:text-xl font-bold text-white leading-tight">
                      {user.fullName || 'No Name'}
                    </h3>
                    {/* Role Badge */}
                    <div className={`w-fit px-3 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border uppercase tracking-wider ${getRoleBadgeStyles(user.role)}`}>
                      {user.role === 'admin' && (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      )}
                      {user.role}
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs md:text-sm font-medium">{user.email}</p>
                  {user.taskCount !== undefined && (
                    <p className="text-slate-500 text-xs mt-1">
                      Tasks: <span className="text-indigo-400 font-bold">{user.taskCount}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Right Side: Date & Actions */}
              <div className="flex items-center gap-4 md:gap-8">
                <div className="hidden sm:block text-right">
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter">Joined</p>
                  <p className="text-slate-300 text-xs font-semibold">{formatDate(user.createdAt)}</p>
                </div>
                
                {user.role !== 'admin' && (
                  <button 
                    onClick={() => handleDeleteUser(user._id, user.fullName || user.email)}
                    disabled={deletingUserId === user._id}
                    className="text-slate-500 hover:text-rose-500 transition-colors p-2 bg-white/5 rounded-xl border border-white/5 hover:border-rose-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete user"
                  >
                    {deletingUserId === user._id ? (
                      <div className="animate-spin h-5 w-5 border-2 border-rose-500 border-t-transparent rounded-full"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.users.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => changeUserPage(pagination.users.page - 1)}
            disabled={pagination.users.page === 1}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
          >
            Previous
          </button>
          
          <span className="px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
            Page {pagination.users.page} of {pagination.users.totalPages}
          </span>
          
          <button
            onClick={() => changeUserPage(pagination.users.page + 1)}
            disabled={pagination.users.page === pagination.users.totalPages}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Users;