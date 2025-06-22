import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdminLogin from './Admin_Login';
import { validateImageSize } from '../lib/validateImageSize';

const supabaseUrl = 'https://sivcpdjtgysnryvfbcvw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpdmNwZGp0Z3lzbnJ5dmZiY3Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MTEyOTQsImV4cCI6MjA2NDA4NzI5NH0.P30L2h9NnsnSccm5NXWeIEMldZ6Tb54uA4zxoaSES1s';
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const ADMIN_EMAIL = 'bartenderbrothers87@gmail.com'; 
const BUCKET = 'home-images';

function HomeImagesForm({ adminUser }) {
  const [homeImages, setHomeImages] = useState([]);
  const [file, setFile] = useState(null);
  const [section, setSection] = useState('');
  const [position, setPosition] = useState('');
  const [desc, setDesc] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (adminUser) {
      fetchHomeImages();
    } else {
      setHomeImages([]);
    }
    // eslint-disable-next-line
  }, [adminUser]);

  async function fetchHomeImages() {
    if (!adminUser) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('home-images')
      .select('*')
      .order('section', { ascending: true })
      .order('position', { ascending: true });
    if (!error) setHomeImages(data || []);
    setLoading(false);
  }

 

  async function handleSubmit(e) {
    e.preventDefault();
    if (!adminUser) return;
    setError('');
    if (!file || !section || !position) {
      setError('Please select an image, section, and position.');
      return;
    }
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `home_${section}_${position}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(fileName, file);
      if (uploadError) {
        setError(uploadError.message || 'Upload failed');
        setUploading(false);
        return;
      }
      const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

      if (!publicUrlData || !publicUrlData.publicUrl) {
        setError('Failed to get public URL for the uploaded image.');
        setUploading(false);
        return;
      }

      const payload = {
        url: publicUrlData.publicUrl,
        description: desc,
        section,
        position: parseInt(position, 10)
      };

      // Try to insert and catch RLS errors
      const { error: dbError } = await supabase.from('home-images').insert([payload]);
      if (dbError) {
        setError(
          (dbError.message && dbError.message.toLowerCase().includes('row-level security'))
            ? "Row-level security (RLS) is blocking this insert. \n\nHow to fix:\n- Make sure your Supabase RLS policy for the HomeImages table allows INSERT for your admin user (auth.email() = 'bartenderbrothers87@gmail.com').\n- Make sure you are logged in as the admin user in your frontend.\n- You can test your policy in the Supabase Table Editor > Policies tab."
            : (dbError.message || 'Failed to save image info')
        );
        setUploading(false);
        return;
      }
      setFile(null);
      setSection('');
      setPosition('');
      setDesc('');
      fetchHomeImages();
    } catch (err) {
      setError(err.message || 'Unknown error');
    }
    setUploading(false);
  }

  async function handleDelete(id) {
    if (!adminUser) return;
    if (!window.confirm('Delete this image?')) return;
    const { error } = await supabase.from('home-images').delete().eq('id', id);
    if (!error) fetchHomeImages();
  }

  return (
    <div className="mt-12">
      <h3 className="font-semibold mb-4 text-lg text-gray-100">Manage Home Page Images</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6 bg-[#23272f] p-6 rounded-xl border border-gray-700 shadow">
        
        <input
          type="file"
          accept="image/webp"
          onChange={e => {
            if (!adminUser) return;
            setError("");
            const file = e.target.files[0];
            if (!file) return;
            if (!validateImageSize(file, 650)) {
              setError('Only .webp images under 650 KB are accepted.');
              return;
            }
            setFile(file);
          }}
          className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-blue-400 hover:file:bg-gray-700"
          disabled={!adminUser}
        />
        {error && <div className="text-xs text-red-400 mt-1">{error}</div>}
        <div className="text-xs text-gray-400 mt-1">Only .webp images under 650 KB are accepted.</div>
        <div className="flex gap-2">
          <select
            value={section}
            onChange={e => setSection(e.target.value)}
            required
            className="bg-[#18181b] text-gray-100 border border-gray-700 rounded-lg px-4 py-2 flex-1"
            disabled={!adminUser}
          >
            <option value="">Select Section</option>
            <option value="about">About Us</option>
            <option value="services">Services</option>
            <option value="booking">Booking</option>
          </select>
          <Input
            type="number"
            min="1"
            max="3"
            value={position}
            onChange={e => setPosition(e.target.value)}
            placeholder="Position (1, 2, 3...)"
            className="bg-[#18181b] text-gray-100 border border-gray-700 rounded-lg px-4 py-2 w-32"
            required
            disabled={!adminUser}
          />
        </div>
        <Input
          placeholder="Description (optional)"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          className="bg-[#18181b] text-gray-100 border border-gray-700 rounded-lg px-4 py-2"
          disabled={!adminUser}
        />
        {error && <div className="text-red-400 text-xs whitespace-pre-line">{error}</div>}
        <Button type="submit" disabled={uploading || !!error || !file || !adminUser} className="bg-blue-700 text-white mt-2">
          {uploading ? 'Uploading...' : 'Add Image'}
        </Button>
      </form>
      <div>
        <h4 className="text-gray-200 mb-2 text-base font-semibold">Uploaded Images</h4>
        {loading ? (
          <div className="text-gray-400">Loading images...</div>
        ) : (
          <ul className="space-y-4">
            {homeImages.map(img => (
              <li key={img.id} className="flex items-center gap-4 bg-[#18181b] rounded-lg p-3 border border-gray-700">
                <img src={img.url} alt={img.description || img.section} className="w-16 h-16 object-cover rounded-lg border border-gray-700" />
                <div className="flex-1">
                  <div className="text-gray-100 text-sm font-semibold">{img.section} - Position {img.position}</div>
                  <div className="text-xs text-gray-400">{img.description}</div>
                </div>
                <button
                  onClick={() => handleDelete(img.id)}
                  className="px-3 py-1 rounded bg-red-700 hover:bg-red-800 text-white text-xs font-semibold transition"
                  type="button"
                  disabled={!adminUser}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default HomeImagesForm;
