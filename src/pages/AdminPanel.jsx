import React from 'react';
import AdminTeamForm from '../admin/AdminTeamForm';

function AdminPanel() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18181b] via-[#27272a] to-[#18181b] flex items-center justify-center py-12 px-2 selection:bg-gray-700 selection:text-white">
      <div className="w-full max-w-2xl bg-[#23272f] shadow-2xl rounded-2xl p-8 border border-gray-800">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-100 tracking-tight drop-shadow-sm">
          Admin Panel
        </h1>
        <div className="mb-8 text-center text-gray-400 text-base">
          Manage your team and other admin features here.
        </div>
        <AdminTeamForm />
        {/* Add more admin components here in the future */}
      </div>
    </div>
  );
}

export default AdminPanel;