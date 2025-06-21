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
  const [sectionInputs, setSectionInputs] = useState([]); // [{title, position}]
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
    setSectionInputs([]);
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
      .from('gallery')
      .upload(fileName, file);
    if (storageError) {
      alert('Image upload failed');
      setImgLoading(false);
      return;
    }
    const imageUrl = supabase.storage.from('gallery').getPublicUrl(fileName).data.publicUrl;
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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-100">Gallery Admin</h2>
      {/* Navigation Selection */}
      <div className="flex justify-center gap-4 mb-8">
        {NAV_OPTIONS.map(opt => (
          <button
            key={opt.key}
            onClick={() => setNav(opt.key)}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${nav === opt.key ? 'bg-white text-black font-medium' : 'bg-white/10 text-white'}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {/* Section Count & Bulk Add */}
      <div className="mb-8 max-w-xl mx-auto bg-[#23272f] rounded-xl p-4 border border-gray-700">
        <h3 className="font-semibold text-lg mb-2 text-gray-200">How many sections do you want in <span className="text-blue-400">{NAV_OPTIONS.find(o => o.key === nav).label}</span>?</h3>
        <input
          className="w-full mb-4 px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none"
          type="number"
          min={1}
          value={sectionCount}
          onChange={e => handleSectionCountChange(Number(e.target.value))}
        />
        {sectionInputs.length > 0 && (
          <div className="space-y-4">
            {sectionInputs.map((s, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  className="flex-1 px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none"
                  type="text"
                  placeholder={`Section ${idx + 1} Title`}
                  value={s.title}
                  onChange={e => handleSectionInputChange(idx, 'title', e.target.value)}
                />
                <input
                  className="w-24 px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none"
                  type="number"
                  min={1}
                  placeholder="Position"
                  value={s.position}
                  onChange={e => handleSectionInputChange(idx, 'position', Number(e.target.value))}
                />
              </div>
            ))}
            <button
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded font-semibold mt-2 transition"
              onClick={handleAddSections}
              disabled={loading || sectionInputs.some(s => !s.title)}
            >
              {loading ? 'Adding...' : 'Add Sections'}
            </button>
          </div>
        )}
      </div>
      {/* Section List & Image Management */}
      <div className="flex flex-col md:flex-row gap-8 mb-10">
        <div className="md:w-1/3 bg-[#23272f] rounded-xl p-4 border border-gray-700">
          <h3 className="font-semibold text-lg mb-2 text-gray-200">Sections List</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sections.length === 0 && <div className="text-gray-400">No sections found.</div>}
            {sections.map(section => (
              <div key={section.id} className={`rounded-xl p-4 border ${selectedSection && selectedSection.id === section.id ? 'border-blue-500 bg-gray-800' : 'border-gray-700 bg-[#23272f]'}`}> 
                <div className="flex items-center justify-between mb-2">
                  <button
                    className="text-lg font-bold text-blue-400 hover:underline"
                    onClick={() => setSelectedSection(section)}
                  >
                    {section.title}
                  </button>
                  <button
                    className="text-xs text-red-400 hover:underline ml-2"
                    onClick={() => handleDeleteSection(section.id)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">Position:</span>
                  <input
                    className="w-16 px-2 py-1 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none"
                    type="number"
                    value={section.position}
                    min={1}
                    onChange={e => handleUpdateSectionPosition(section.id, Number(e.target.value))}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Image Management */}
        <div className="md:w-2/3">
          {selectedSection && (
            <div className="bg-[#23272f] rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4 text-gray-100">Images in: <span className="text-blue-400">{selectedSection.title}</span></h2>
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="md:w-1/3">
                  <h3 className="font-semibold text-lg mb-2 text-gray-200">Add Image</h3>
                  <input
                    className="w-full mb-2 px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none"
                    type="text"
                    placeholder="Image Caption"
                    value={newImage.subheading}
                    onChange={e => setNewImage({ ...newImage, subheading: e.target.value })}
                  />
                  <input
                    className="w-full mb-2 px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none"
                    type="file"
                    accept="image/*"
                    onChange={e => setNewImage({ ...newImage, file: e.target.files[0] })}
                  />
                  <input
                    className="w-full mb-2 px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none"
                    type="number"
                    placeholder="Position"
                    value={newImage.position}
                    min={1}
                    onChange={e => setNewImage({ ...newImage, position: Number(e.target.value) })}
                  />
                  <button
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded font-semibold mt-2 transition"
                    onClick={handleAddImage}
                    disabled={imgLoading || !newImage.file}
                  >
                    {imgLoading ? 'Adding...' : 'Add Image'}
                  </button>
                </div>
                <div className="md:w-2/3">
                  <h3 className="font-semibold text-lg mb-2 text-gray-200">Images List</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {imgLoading && <div className="text-gray-400">Loading images...</div>}
                    {!imgLoading && images.length === 0 && <div className="text-gray-400">No images found for this section.</div>}
                    {images && images.map(img => (
                      <div key={img.id} className="rounded-xl p-3 border border-gray-700 bg-gray-900 flex flex-col items-center">
                        <img src={img.image_url} alt={img.subheading} className="w-full h-32 object-cover rounded mb-2 border border-gray-800" />
                        <div className="text-gray-200 text-sm mb-1">{img.subheading}</div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-gray-400 text-xs">Position:</span>
                          <input
                            className="w-14 px-2 py-1 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none"
                            type="number"
                            value={img.position}
                            min={1}
                            onChange={e => handleUpdateImagePosition(img.id, Number(e.target.value))}
                          />
                        </div>
                        <button
                          className="w-full bg-red-700 hover:bg-red-800 text-white py-1 rounded text-xs font-semibold transition"
                          onClick={() => handleDeleteImage(img.id)}
                          disabled={imgLoading}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminGallery;
