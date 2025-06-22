import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sivcpdjtgysnryvfbcvw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpdmNwZGp0Z3lzbnJ5dmZiY3Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MTEyOTQsImV4cCI6MjA2NDA4NzI5NH0.P30L2h9NnsnSccm5NXWeIEMldZ6Tb54uA4zxoaSES1s';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const NAV_OPTIONS = [
  { key: 'showcases', label: 'Showcases' },
  { key: 'decores', label: 'Decores' },
  { key: 'customizations', label: 'Customizations' },
  { key: 'videos', label: 'Videos' },
];

function AdminGallery() {
  const [nav, setNav] = useState('showcases');
  const [sectionCount, setSectionCount] = useState(1);
  const [sectionInputs, setSectionInputs] = useState([{ title: '', position: 1 }]); // default to 1 section
  const [sections, setSections] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [newImage, setNewImage] = useState({ subheading: '', file: null, position: 1 });
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);

  // Fetch sections for selected nav
  useEffect(() => {
    fetchSections();
    setSelectedSection(null);
    setSectionInputs([{ title: '', position: 1 }]); // Always initialize with one empty section
  }, [nav]);

  // Fetch images for selected section
  useEffect(() => {
    if (selectedSection && selectedSection.id) fetchImages(selectedSection.id);
    else setImages([]);
  }, [selectedSection]);

  async function fetchSections() {
    setLoading(true);
    let { data } = await supabase
      .from('gallery_sections')
      .select('*')
      .eq('category', nav)
      .order('position', { ascending: true });
    setSections(data || []);
    setLoading(false);
  }

  async function fetchImages(sectionId) {
    setImgLoading(true);
    let { data } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('section_id', sectionId)
      .order('position', { ascending: true });
    console.log('Fetched images for section', sectionId, data);
    setImages(data || []);
    setImgLoading(false);
  }

  // Section creation UI logic
  function handleSectionCountChange(val) {
    setSectionCount(val);
    setSectionInputs(Array.from({ length: val }, (_, i) => ({ title: '', position: i + 1 })));
  }
  function handleSectionInputChange(idx, field, value) {
    setSectionInputs(inputs => inputs.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  }
  async function handleAddSections() {
    setLoading(true);
    // Only insert sections with non-empty titles
    const toInsert = sectionInputs.filter(s => s.title && s.title.trim() !== '').map(s => ({ ...s, category: nav }));
    if (toInsert.length === 0) {
      setLoading(false);
      return;
    }
    const { error } = await supabase.from('gallery_sections').insert(toInsert);
    if (error) {
      alert('Failed to add sections: ' + error.message);
      setLoading(false);
      return;
    }
    setSectionInputs([{ title: '', position: 1 }]); // Reset to one empty section after add
    setSectionCount(1);
    await fetchSections();
    setLoading(false);
  }
  async function handleDeleteSection(id) {
    setLoading(true);
    await supabase.from('gallery_sections').delete().eq('id', id);
    await fetchSections();
    setSelectedSection(null);
    setLoading(false);
  }
  async function handleUpdateSectionPosition(id, position) {
    setLoading(true);
    await supabase.from('gallery_sections').update({ position }).eq('id', id);
    await fetchSections();
    setLoading(false);
  }
  // Image CRUD
  async function handleAddImage() {
    if (!newImage.file || !selectedSection) return;
    setImgLoading(true);
    const file = newImage.file;
    const fileName = `${Date.now()}_${file.name}`;
    const { error: storageError } = await supabase.storage
      .from('gallery-images')
      .upload(fileName, file);
    if (storageError) {
      alert('Image upload failed');
      setImgLoading(false);
      return;
    }
    const imageUrl = supabase.storage.from('gallery-images').getPublicUrl(fileName).data.publicUrl;
    const insertResult = await supabase.from('gallery_images').insert({
      section_id: selectedSection.id,
      subheading: newImage.subheading,
      image_url: imageUrl,
      position: newImage.position,
    });
    console.log('Inserted image:', insertResult);
    setNewImage({ subheading: '', file: null, position: 1 });
    await fetchImages(selectedSection.id);
    setImgLoading(false);
  }
  async function handleDeleteImage(id) {
    setImgLoading(true);
    await supabase.from('gallery_images').delete().eq('id', id);
    await fetchImages(selectedSection.id);
    setImgLoading(false);
  }
  async function handleUpdateImagePosition(id, position) {
    setImgLoading(true);
    await supabase.from('gallery_images').update({ position }).eq('id', id);
    await fetchImages(selectedSection.id);
    setImgLoading(false);
  }

  // Add this helper to determine if current nav is videos
  const isVideoSection = nav === 'videos';

  return (
    <div className="min-h-screen w-full flex bg-[#181a20]">
      {/* Sidebar for categories */}
      <aside className="w-64 min-h-screen bg-[#20232a] border-r border-gray-800 flex flex-col items-center py-10">
        <h2 className="text-2xl font-bold mb-10 text-gray-100">Manage Gallery </h2>
        <nav className="flex flex-col gap-4 w-full px-6">
          {NAV_OPTIONS.map(opt => (
            <button
              key={opt.key}
              onClick={() => setNav(opt.key)}
              className={`w-full px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 text-left ${nav === opt.key ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              {opt.label}
            </button>
          ))}
        </nav>
      </aside>
      {/* Main content */}
      <main className="flex-1 flex flex-col py-10 px-10 bg-[#181a20]">
        {/* Section Count & Bulk Add */}
        <div className="mb-8 w-full bg-[#23272f] rounded-xl p-8 border border-gray-700">
          <h3 className="font-semibold text-2xl mb-6 text-gray-200">How many sections do you want in <span className="text-blue-400">{NAV_OPTIONS.find(o => o.key === nav).label}</span>?</h3>
          <input
            className="w-40 mb-4 px-4 py-3 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none text-lg"
            type="number"
            min={1}
            value={sectionCount}
            onChange={e => handleSectionCountChange(Number(e.target.value))}
          />
          {sectionInputs.length > 0 && (
            <div className="space-y-4">
              {sectionInputs.map((s, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  <input
                    className="flex-1 px-4 py-3 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none text-lg"
                    type="text"
                    placeholder={`Section ${idx + 1} Title`}
                    value={s.title}
                    onChange={e => handleSectionInputChange(idx, 'title', e.target.value)}
                  />
                </div>
              ))}
              <button
                className="w-40 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded font-semibold mt-2 text-lg transition"
                onClick={handleAddSections}
                disabled={loading || sectionInputs.some(s => !s.title)}
              >
                {loading ? 'Adding...' : 'Add Sections'}
              </button>
            </div>
          )}
        </div>
        {/* Sections and Media */}
        <div className="flex w-full gap-10">
          {/* Sections List */}
          <div className="w-80 bg-[#23272f] rounded-xl p-6 border border-gray-700 min-h-[400px] flex-shrink-0 flex flex-col">
            <h3 className="font-semibold text-xl mb-6 text-gray-200">Sections List</h3>
            <div className="flex flex-col gap-4 overflow-y-auto hide-scrollbar" style={{ maxHeight: '420px' }}>
              {sections.length === 0 && <div className="text-gray-400">No sections found.</div>}
              {sections.map(section => (
                <div key={section.id} className={`rounded-xl px-5 py-3 border flex items-center justify-between transition-all duration-200 shadow-sm hover:shadow-lg mb-1 ${selectedSection && selectedSection.id === section.id ? 'border-blue-500 bg-gray-800 scale-105' : 'border-gray-700 bg-[#23272f]'}`}> 
                  <button
                    className="text-lg font-bold text-blue-400 hover:underline text-left flex-1 truncate"
                    onClick={() => setSelectedSection(section)}
                    style={{wordBreak: 'break-word'}}>
                    {section.title || section.name}
                  </button>
                  <button
                    className="text-xs text-red-400 hover:underline ml-4"
                    onClick={() => handleDeleteSection(section.id)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* Media Management Panel full width */}
          <div className="flex-1">
            {selectedSection && (
              <div className="w-full">
                <div className="mb-4">
                  <div className="text-2xl font-bold text-white mb-2">Images in : <span className="capitalize">{selectedSection.title}</span></div>
                  <div className="flex flex-row items-center gap-4 mb-2">
                    <label className="text-lg text-white font-medium">Add Image</label>
                    <input
                      className="px-3 py-2 rounded bg-transparent text-white border border-gray-400 focus:outline-none"
                      type="file"
                      accept="image/*"
                      onChange={e => setNewImage({ ...newImage, file: e.target.files[0] })}
                    />
                    <button
                      className="w-28 bg-transparent border border-gray-400 text-white py-2 rounded text-lg font-normal transition"
                      onClick={handleAddImage}
                      disabled={imgLoading || !newImage.file}
                    >
                      {imgLoading ? 'Uploading...' : 'upload'}
                    </button>
                  </div>
                  <div className="text-lg text-white mt-6 mb-2">
                    Show Section :
                  </div>
                  <div className="text-base text-blue-200 mb-4">
                    Note: Only 5 images will be shown in a single row in the gallery.
                  </div>
                </div>
                {/* Gallery Grid */}
                <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 mt-2">
                  {imgLoading && <div className="text-gray-400 col-span-full">Loading images...</div>}
                  {!imgLoading && images.length === 0 &&
                    Array.from({ length: 5 }).map((_, idx) => (
                      <div key={idx} className="border border-gray-400 rounded-xl bg-transparent min-h-[140px] h-[140px] w-full"></div>
                    ))
                  }
                  {images && images.map(img => (
                    <div key={img.id} className="border border-gray-400 rounded-xl bg-transparent min-h-[140px] h-[140px] w-full flex items-center justify-center overflow-hidden">
                      <img src={img.image_url} alt={img.subheading} className="object-cover w-full h-full" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminGallery;
