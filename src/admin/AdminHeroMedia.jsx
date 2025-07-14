import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const BUCKET = 'hero-media';


function AdminHeroMedia({ adminUser }) {
  const [mediaList, setMediaList] = useState([]);
  const [file, setFile] = useState(null);
  const [mediaType, setMediaType] = useState('image');
  const [desc, setDesc] = useState('');
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, []);

  async function fetchMedia() {
    setLoading(true);
    const { data, error } = await supabase.from('hero_media').select('*').order('id', { ascending: true });
    if (!error) {
      // Attach publicURL for each media with extra debug
      const withUrls = (data || []).map(m => {
        const fileName = m.media_url;
        const urlObj = supabase.storage.from(BUCKET).getPublicUrl(fileName);
        if (!fileName) {
          console.warn('Missing media_url for record:', m);
        }
        if (!urlObj.publicURL) {
          console.warn('Could not generate public URL for:', fileName, urlObj);
        }
        return {
          ...m,
          public_url: urlObj.publicURL
        };
      });
      console.log('Fetched media:', withUrls);
      setMediaList(withUrls);
    }
    setLoading(false);
  }

  async function handleUpload(e) {
    e.preventDefault();
    // Auth check (Supabase v2)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== 'bartenderbrothers87@gmail.com') {
      setError('You must be logged in as admin to upload. Current: ' + (user?.email || 'none'));
      return;
    }
    if (!file || !mediaType) {
      setError('Please select a file and type.');
      return;
    }
    setUploading(true);
    setError('');
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `hero_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(fileName, file);
      if (uploadError) {
        setError(uploadError.message || 'Upload failed');
        setUploading(false);
        return;
      }
      // Insert into DB
      const { error: dbError } = await supabase.from('hero_media').insert([
        { media_type: mediaType, media_url: fileName, title, description: desc }
      ]);
      if (dbError) {
        setError(dbError.message || 'DB insert failed');
        setUploading(false);
        return;
      }
      setFile(null);
      setTitle('');
      setDesc('');
      setMediaType('image');
      fetchMedia();
    } catch (err) {
      setError('Unknown error');
    }
    setUploading(false);
  }

  async function handleDelete(id, url) {
    setLoading(true);
    await supabase.storage.from(BUCKET).remove([url]);
    await supabase.from('hero_media').delete().eq('id', id);
    fetchMedia();
    setLoading(false);
  }

  return (
    <div className="bg-[#23272f] p-8 rounded-lg shadow-lg w-full max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-8 text-gray-100 text-center">Add Media to Hero Section</h2>
      <form className="flex flex-col gap-6 mb-12 bg-[#18181b] p-6 rounded-lg shadow" onSubmit={handleUpload}>
        <div className="flex flex-col gap-4">
          <label className="text-gray-300 font-semibold">Upload Image or Video
            <Input type="file" accept="image/*,video/*" required onChange={e => {
              setFile(e.target.files[0]);
              setMediaType(e.target.files[0]?.type.startsWith('video') ? 'video' : 'image');
            }} />
          </label>
          <label className="text-gray-300 font-semibold">Title
            <Input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
          </label>
          <label className="text-gray-300 font-semibold">Description
            <Input type="text" placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} required />
          </label>
          <label className="text-gray-300 font-semibold">Category (optional)
            <Input type="text" placeholder="Category (e.g. Event, Entertainment)" value={mediaType === 'image' ? '' : ''} onChange={e => {}} disabled style={{ opacity: 0.5 }} />
            {/* For now, category is not used in upload. Add logic if you want to support it. */}
          </label>
        </div>
        <div className="flex gap-4">
          <Button type="submit" disabled={uploading} className="w-full md:w-auto">{uploading ? 'Uploading...' : 'Upload'}</Button>
          <Button type="button" variant="secondary" className="w-full md:w-auto" onClick={() => { setFile(null); setTitle(''); setDesc(''); setMediaType('image'); setError(''); }}>Reset</Button>
        </div>
        {uploading && <div className="text-blue-400">Uploading, please wait...</div>}
        {error && <div className="text-red-500">{error}</div>}
      </form>
      <div>
        <h3 className="text-xl font-semibold text-gray-200 mb-2">Uploaded Media</h3>
        {loading ? <div className="text-gray-400">Loading...</div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mediaList.map(media => (
              <div key={media.id} className="bg-[#18181b] rounded-lg p-4 flex flex-col gap-2 relative">
                {media.media_type === 'image' ? (
                  <img src={supabase.storage.from(BUCKET).getPublicUrl(media.media_url).publicURL} alt={media.title} className="rounded w-full h-48 object-cover" />
                ) : (
                  <video src={supabase.storage.from(BUCKET).getPublicUrl(media.media_url).publicURL} controls className="rounded w-full h-48 object-cover" />
                )}
                <div className="text-gray-100 font-semibold">{media.title}</div>
                <div className="text-gray-400 text-sm">{media.description}</div>
                <Button variant="destructive" onClick={() => handleDelete(media.id, media.media_url)} className="absolute top-2 right-2">Delete</Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminHeroMedia;
