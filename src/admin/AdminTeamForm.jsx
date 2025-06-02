import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const supabaseUrl = 'https://sivcpdjtgysnryvfbcvw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpdmNwZGp0Z3lzbnJ5dmZiY3Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MTEyOTQsImV4cCI6MjA2NDA4NzI5NH0.P30L2h9NnsnSccm5NXWeIEMldZ6Tb54uA4zxoaSES1s';
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const BUCKET = 'team';

function AdminTeamForm() {
  const [team, setTeam] = useState([]);
  const [form, setForm] = useState({ name: '', role: '', bio: '', photo_url: '' });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    fetchTeam();
  }, []);

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

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
      if (uploadError) throw uploadError;
      const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
      setForm(f => ({ ...f, photo_url: publicUrlData.publicUrl }));
    } catch (err) {
      alert('Image upload failed: ' + err.message);
    }
    setUploading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('team_members').insert([form]);
      if (error) throw error;
      setForm({ name: '', role: '', bio: '', photo_url: '' });
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchTeam();
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  }

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

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-lg mt-8 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-[#1e293b]">Manage Team Members</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <Input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          required
          className="bg-white text-[#1e293b] placeholder-gray-400 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />
        <Input
          placeholder="Role"
          value={form.role}
          onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
          className="bg-white text-[#1e293b] placeholder-gray-400 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />
        <Input
          placeholder="Bio"
          value={form.bio}
          onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
          className="bg-white text-[#1e293b] placeholder-gray-400 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {uploading && <div className="text-blue-600 text-sm">Uploading image...</div>}
        {form.photo_url && (
          <img src={form.photo_url} alt="Preview" className="w-20 h-20 object-cover rounded-full border mx-auto" />
        )}
        <Button type="submit" disabled={loading || uploading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded">
          {loading ? 'Adding...' : 'Add Team Member'}
        </Button>
      </form>
      <div>
        <h3 className="font-semibold mb-4 text-lg text-[#1e293b]">Current Team</h3>
        <ul className="space-y-4">
          {team.map(member => (
            <li key={member.id} className="flex items-center gap-4 bg-gray-50 rounded-lg p-3 border border-gray-200">
              {member.photo_url && (
                <img src={member.photo_url} alt={member.name} className="w-14 h-14 rounded-full object-cover border border-gray-300" />
              )}
              <div className="flex-1">
                <div className="font-bold text-[#1e293b] text-base">{member.name}</div>
                <div className="text-sm text-gray-600">{member.role}</div>
                <div className="text-xs text-gray-500">{member.bio}</div>
              </div>
              <button
                onClick={() => handleDelete(member.id)}
                disabled={deletingId === member.id}
                className="ml-2 px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition"
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