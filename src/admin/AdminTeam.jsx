// ===============================
// AdminTeamForm.jsx
// Admin panel for managing team members:
// - Uploads team member images to Supabase Storage bucket ('team')
// - Saves public image URL and member info to Supabase table ('team_members')
// - Displays current team members with their info and photo
// - Allows deleting team members (removes from Supabase and UI)
// ===============================

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdminLogin from './Admin_Login';
import { validateImageSize } from '../lib/validateImageSize';

const ADMIN_EMAIL = 'bartenderbrothers87@gmail.com'; 
const BUCKET = 'team';

function AdminTeamForm({ adminUser }) {
  // State for team list, form fields, loading states, and file input
  const [team, setTeam] = useState([]);
  const [form, setForm] = useState({ name: '', role: '', photo_url: '', experience: '' });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef();
  const [editingMember, setEditingMember] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', role: '', photo_url: '', experience: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch team members on mount
  useEffect(() => {
    if (adminUser) fetchTeam();
  }, [adminUser]);

  // Fetch all team members from Supabase
  async function fetchTeam() {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setTeam(data || []);
    } catch (err) {
      alert('Failed to fetch team: ' + err.message);
    }
  }

  // Handle image upload: upload to Supabase Storage and save public URL in form state
 async function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  setUploading(true);
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage.from('team').upload(fileName, file);
    if (uploadError) throw uploadError;

    // Get public URL
    const { data: publicUrlData } = supabase.storage.from('team').getPublicUrl(fileName);
    setForm(f => ({ ...f, photo_url: publicUrlData.publicUrl })); 
    
    // Save URL in form state
  } catch (err) {
    alert('Image upload failed: ' + err.message);
  }
  setUploading(false);
}

  // Handle form submit: add new team member to Supabase
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      let insertData = { ...form };
      if (insertData.experience !== undefined && insertData.experience !== '') {
        insertData.experience = parseInt(insertData.experience, 10);
      }
      const { error } = await supabase.from('team_members').insert([insertData]);
      if (error) throw error;
      setForm({ name: '', role: '', photo_url: '', experience: '' });
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchTeam();
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  }

  // Handle delete: remove team member from Supabase and update UI
  async function handleDelete(id) {
    if (!window.confirm('Delete this team member?')) return;
    setDeletingId(id);
    try {
      const { error } = await supabase.from('team_members').delete().eq('id', id);
      if (error) throw error;
      fetchTeam();
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
    setDeletingId(null);
  }

  // Add function to handle edit submit
  async function handleEditSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      let updateData = { ...editForm };
      if (updateData.experience !== undefined && updateData.experience !== '') {
        updateData.experience = parseInt(updateData.experience, 10);
      }
      const { error } = await supabase
        .from('team_members')
        .update(updateData)
        .eq('id', editingMember.id);
      
      if (error) throw error;
      setEditingMember(null);
      setEditForm({ name: '', role: '', photo_url: '', experience: '' });
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchTeam();
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  }

  // Render admin panel UI
  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-100">Manage Team Members</h2>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Team Member
          </button>
        )}
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="flex justify-center mb-8">
          <div className="bg-[#23272f] rounded-xl p-6 border border-gray-700 w-full max-w-lg mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Add New Team Member</h3>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
                className="bg-[#18181b] text-gray-100 placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
              />
              <Input
                placeholder="Role"
                value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                className="bg-[#18181b] text-gray-100 placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
              />
              <Input
                placeholder="Experience (years)"
                type="number"
                min="1"
                value={form.experience}
                onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}
                className="bg-[#18181b] text-gray-100 placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
              />
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/webp"
                  ref={fileInputRef}
                  onChange={e => {
                    setError("");
                    const file = e.target.files[0];
                    if (!file) return;
                    if (!validateImageSize(file, 650)) {
                      setError('Only .webp images under 650 KB are accepted.');
                      return;
                    }
                    handleImageUpload(e);
                  }}
                  className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-blue-400 hover:file:bg-gray-700"
                />
                {error && <div className="text-xs text-red-400">{error}</div>}
                <div className="text-xs text-gray-400">Only .webp images under 650 KB are accepted.</div>
              </div>
              {uploading && <div className="text-blue-400 text-sm">Uploading image...</div>}
              {form.photo_url && (
                <img src={form.photo_url} alt="Preview" className="w-20 h-20 object-cover rounded-full border border-gray-700" />
              )}
              <div className="flex justify-center">
                <Button type="submit" disabled={loading || uploading} className="w-full max-w-xs bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded">
                  {loading ? 'Adding...' : 'Add Team Member'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {editingMember && (
        <div className="bg-[#23272f] rounded-xl p-6 border border-gray-700 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Edit Team Member</h3>
            <button 
              onClick={() => setEditingMember(null)}
              className="text-gray-400 hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              placeholder="Name"
              value={editForm.name}
              onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
              required
              className="bg-[#18181b] text-gray-100 placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
            />
            <Input
              placeholder="Role"
              value={editForm.role}
              onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}
              className="bg-[#18181b] text-gray-100 placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
            />
            <Input
              placeholder="Experience (years)"
              type="number"
              min="1"
              value={editForm.experience}
              onChange={e => setEditForm(f => ({ ...f, experience: e.target.value }))}
              className="bg-[#18181b] text-gray-100 placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
            />
            <div className="space-y-2">
              <input
                type="file"
                accept="image/webp"
                onChange={e => {
                  setError("");
                  const file = e.target.files[0];
                  if (!file) return;
                  if (!validateImageSize(file, 650)) {
                    setError('Only .webp images under 650 KB are accepted.');
                    return;
                  }
                  handleImageUpload(e);
                }}
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-blue-400 hover:file:bg-gray-700"
              />
              {error && <div className="text-xs text-red-400">{error}</div>}
              <div className="text-xs text-gray-400">Only .webp images under 650 KB are accepted.</div>
            </div>
            {uploading && <div className="text-blue-400 text-sm">Uploading image...</div>}
            {editForm.photo_url && (
              <img src={editForm.photo_url} alt="Preview" className="w-20 h-20 object-cover rounded-full border border-gray-700" />
            )}
            <div className="flex gap-2">
              <Button type="submit" disabled={loading || uploading} className="flex-1 bg-green-700 hover:bg-green-800 text-white font-semibold py-2 rounded">
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" onClick={() => setEditingMember(null)} className="flex-1 bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 rounded">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Team List */}
      <div className="bg-[#23272f] rounded-xl p-6 border border-gray-700">
        <h3 className="font-semibold mb-6 text-lg text-gray-100">Current Team</h3>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {team.map(member => (
            <div key={member.id} className="bg-[#18181b] rounded-xl p-4 border border-gray-700 flex flex-col">
              <div className="flex items-center gap-4 mb-3">
                {member.photo_url && (
                  <img src={member.photo_url} alt={member.name} className="w-16 h-16 rounded-full object-cover border border-gray-700" />
                )}
                <div className="flex-1">
                  <div className="font-bold text-gray-100 text-lg">{member.name}</div>
                  <div className="text-yellow-300 text-sm">{member.role}</div>
                  {member.experience && (
                    <div className="text-gray-400 text-xs mt-1">{member.experience} years experience</div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-auto pt-3 border-t border-gray-700">
                <button
                  onClick={() => {
                    setEditingMember(member);
                    setEditForm({
                      name: member.name,
                      role: member.role,
                      photo_url: member.photo_url,
                      experience: member.experience
                    });
                  }}
                  className="w-24 px-3 py-1.5 rounded bg-blue-600/20 text-blue-400 text-sm hover:bg-blue-600/30 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  disabled={deletingId === member.id}
                  className="w-24 px-3 py-1.5 rounded bg-red-600/20 text-red-400 text-sm hover:bg-red-600/30 transition-colors"
                >
                  {deletingId === member.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AdminTeamForm;