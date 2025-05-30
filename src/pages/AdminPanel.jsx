import React from 'react';
import AdminTeamForm from '../admin/AdminTeamForm';

function AdminPanel() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0e7ff] via-[#f8fafc] to-[#f1f5f9] flex items-center justify-center py-12 px-2">
      <div className="w-full max-w-2xl bg-white/90 shadow-xl rounded-2xl p-8 border border-gray-200">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-[#1e293b] tracking-tight drop-shadow-sm">
          Admin Panel
        </h1>
        <div className="mb-8 text-center text-black-500 text-base">
          Manage your team and other admin features here.
        </div>
        <AdminTeamForm />
        {/* Add more admin components here in the future */}
      </div>
    </div>
  );
}

export default AdminPanel;