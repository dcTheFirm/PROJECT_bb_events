import React, { useState } from 'react';
import AdminTeam from '../admin/AdminTeam';
import AdminHome from '../admin/AdminHome';
import AdminLogin from '../admin/Admin_Login';
import AdminGallery from '../admin/AdminGallery';
import { supabase } from '../lib/supabaseClient';

function AdminPanel() {
  const [adminUser, setAdminUser] = useState(null);
  const [activeTab, setActiveTab] = useState('team');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAdminUser(null);
  };

  if (!adminUser) return <AdminLogin onLogin={setAdminUser} />;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#18181b] via-[#27272a] to-[#18181b] flex flex-col selection:bg-gray-700 selection:text-white">
      <div className="w-full h-full bg-[#23272f] shadow-2xl rounded-none p-8 border-b border-gray-800">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-center text-gray-100 tracking-tight drop-shadow-sm">
            Admin Panel
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded font-semibold text-base transition"
          >
            Logout
          </button>
        </div>
        <div className="mb-8 text-center text-gray-400 text-base">
          Manage your team, home page images, and gallery here.
        </div>
        <div className="flex justify-center gap-4 mb-8">
          <button
            className={`px-6 py-2 rounded font-semibold transition-colors ${activeTab === 'team' ? 'bg-blue-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            onClick={() => setActiveTab('team')}
          >
            Team
          </button>
          <button
            className={`px-6 py-2 rounded font-semibold transition-colors ${activeTab === 'images' ? 'bg-blue-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            onClick={() => setActiveTab('images')}
          >
            Home Images
          </button>
          <button
            className={`px-6 py-2 rounded font-semibold transition-colors ${activeTab === 'gallery' ? 'bg-blue-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            onClick={() => setActiveTab('gallery')}
          >
            Gallery
          </button>
        </div>
        {activeTab === 'team' && <AdminTeam adminUser={adminUser} />}
        {activeTab === 'images' && <AdminHome adminUser={adminUser} />}
        {activeTab === 'gallery' && <AdminGallery adminUser={adminUser} />}
      </div>
    </div>
  );
}

export default AdminPanel;