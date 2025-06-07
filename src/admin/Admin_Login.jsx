// ===============================
// AdminTeamForm.jsx
// Admin panel for managing team members with:
// - Login/logout
// - Forgot password
// - Uploads team member images to Supabase Storage bucket ('team')
// - Saves public image URL and member info to Supabase table ('team_members')
// - Displays current team members with their info and photo
// - Allows deleting team members (removes from Supabase and UI)
// ===============================

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const supabaseUrl = 'https://sivcpdjtgysnryvfbcvw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpdmNwZGp0Z3lzbnJ5dmZiY3Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MTEyOTQsImV4cCI6MjA2NDA4NzI5NH0.P30L2h9NnsnSccm5NXWeIEMldZ6Tb54uA4zxoaSES1s';
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const BUCKET = 'team';

function AdminTeamForm() {
  // Auth states
  const [adminUser, setAdminUser] = useState(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password states
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [showForgot, setShowForgot] = useState(false); // <-- add this

  // Team management states
  const [team, setTeam] = useState([]);
  const [form, setForm] = useState({ name: '', role: '', photo_url: '', experience: '' });
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const fileInputRef = useRef();

  // Fetch team members on mount if logged in
  useEffect(() => {
    if (adminUser) fetchTeam();
  }, [adminUser]);

  // Login handler
  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    const { error, data } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: authPassword,
    });
    if (error) {
      setAuthError(error.message);
    } else {
      setAdminUser(data.user);
    }
    setLoading(false);
  }

  // Logout handler
  async function handleLogout() {
    await supabase.auth.signOut();
    setAdminUser(null);
    setAuthEmail('');
    setAuthPassword('');
    setAuthError('');
  }

  // Forgot password handler
  async function handleResetPassword(e) {
    e.preventDefault();
    setAuthError('');
    setResetSent(false);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail || authEmail);
    if (error) {
      setAuthError(error.message);
    } else {
      setResetSent(true);
    }
  }

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
      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
      setForm(f => ({ ...f, photo_url: publicUrlData.publicUrl }));
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
      // Convert experience to integer if present
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

  // Render login form if not logged in
  if (!adminUser) {
    return (
      <div className="max-w-sm mx-auto mt-20 p-8 bg-[#23272f] rounded shadow border border-gray-800 selection:bg-gray-700 selection:text-white">
        <h2 className="text-xl font-bold mb-4 text-gray-100">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <Input
            type="email"
            placeholder="Admin Email"
            value={authEmail}
            onChange={e => setAuthEmail(e.target.value)}
            required
            className="mb-2 bg-[#18181b] text-gray-100 placeholder-gray-500 border border-gray-700"
          />
          <Input
            type="password"
            placeholder="Password"
            value={authPassword}
            onChange={e => setAuthPassword(e.target.value)}
            required
            className="mb-4 bg-[#18181b] text-gray-100 placeholder-gray-500 border border-gray-700"
          />
          {authError && <div className="text-red-400 mb-2">{authError}</div>}
          <Button type="submit" className="w-full bg-blue-700 text-white hover:bg-blue-800" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        {/* Forgot password link */}
        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-blue-400 hover:underline text-sm"
            onClick={() => setShowForgot(v => !v)}
          >
            Forgot password?
          </button>
        </div>
        {/* Show forgot password field if toggled */}
        {showForgot && (
          <form onSubmit={handleResetPassword} className="mt-4">
            <Input
              type="email"
              placeholder="Enter email to recover password"
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
              className="mb-2 bg-[#18181b] text-gray-100 placeholder-gray-500 border border-gray-700"
            />
            <Button type="submit" variant="outline" className="w-full mb-2">
              Send Recovery Email
            </Button>
          </form>
        )}
        {resetSent && <div className="text-green-400 text-sm text-center">Reset email sent!</div>}
      </div>
    );
  }

  // Render admin panel UI
  return (
    <div className="max-w-xl mx-auto p-8 bg-[#23272f] rounded-2xl shadow-lg mt-8 border border-gray-800 selection:bg-gray-700 selection:text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-100">Manage Team Members</h2>
        <Button onClick={handleLogout} className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded">
          Logout
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
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
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-blue-400 hover:file:bg-gray-700"
        />
        {uploading && <div className="text-blue-400 text-sm">Uploading image...</div>}
        {form.photo_url && (
          <img src={form.photo_url} alt="Preview" className="w-20 h-20 object-cover rounded-full border mx-auto border-gray-700" />
        )}
        <Button type="submit" disabled={loading || uploading} className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded">
          {loading ? 'Adding...' : 'Add Team Member'}
        </Button>
      </form>
      <div>
        <h3 className="font-semibold mb-4 text-lg text-gray-100">Current Team</h3>
        <ul className="space-y-4">
          {team.map(member => (
            <li key={member.id} className="flex items-center gap-4 bg-[#18181b] rounded-lg p-3 border border-gray-700">
              {member.photo_url && (
                <img src={member.photo_url} alt={member.name} className="w-14 h-14 rounded-full object-cover border border-gray-700" />
              )}
              <div className="flex-1">
                <div className="font-bold text-gray-100 text-base">{member.name}</div>
                <div
                  className="text-sm"
                   style={{ color: 'rgb(187, 198, 66)' }}
                >
                  {member.role}
                </div>
                {member.experience !== undefined && member.experience !== null && member.experience !== '' && (
                  <div className="text-xs text-blue-300">{member.experience} years experience</div>
                )}
              </div>
              <button
                onClick={() => handleDelete(member.id)}
                disabled={deletingId === member.id}
                className="ml-2 px-3 py-1 rounded bg-red-700 hover:bg-red-800 text-white text-sm font-semibold transition"
                type="button"
              >
                {deletingId === member.id ? 'Deleting...' : 'Delete'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminTeamForm;