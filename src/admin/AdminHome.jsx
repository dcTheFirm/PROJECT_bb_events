import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdminLogin from './Admin_Login';
import { validateImageSize } from '../lib/validateImageSize';

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
  const [showAddForm, setShowAddForm] = useState(false);

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
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-100">Manage Home Page Images</h2>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Image
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="flex justify-center mb-8">
          <div className="bg-[#23272f] rounded-xl p-6 border border-gray-700 w-full max-w-lg mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Add New Image</h3>
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
              <div className="space-y-2">
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
                {error && <div className="text-xs text-red-400">{error}</div>}
                <div className="text-xs text-gray-400">Only .webp images under 650 KB are accepted.</div>
              </div>
              <div className="flex gap-4">
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
                  placeholder="Position (1-3)"
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
              <Button type="submit" disabled={uploading || !!error || !file || !adminUser} className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded">
                {uploading ? 'Uploading...' : 'Add Image'}
              </Button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-[#23272f] rounded-xl p-6 border border-gray-700">
        <h3 className="font-semibold mb-6 text-lg text-gray-100">Uploaded Images</h3>
        {loading ? (
          <div className="text-gray-400 text-center py-8">Loading images...</div>
        ) : homeImages.length === 0 ? (
          <div className="text-gray-400 text-center py-8">No images uploaded yet.</div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {homeImages.map(img => (
              <div key={img.id} className="bg-[#18181b] rounded-xl p-4 border border-gray-700 flex flex-col items-center w-full max-w-[160px] mx-auto">
                <div className="aspect-square w-32 h-32 mb-4 overflow-hidden rounded-lg">
                  <img src={img.url} alt={img.description || img.section} className="object-cover w-full h-full border border-gray-700" />
                </div>
                <div className="flex-1 w-full">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-gray-100 capitalize">{img.section}</div>
                    <div className="text-sm text-gray-400">Position {img.position}</div>
                  </div>
                  {img.description && (
                    <div className="text-sm text-gray-400 mb-3">{img.description}</div>
                  )}
                </div>
                <div className="mt-auto pt-3 border-t border-gray-700 w-full">
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="w-full px-3 py-1.5 rounded bg-red-600/20 text-red-400 text-sm hover:bg-red-600/30 transition-colors"
                    type="button"
                    disabled={!adminUser}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeImagesForm;
