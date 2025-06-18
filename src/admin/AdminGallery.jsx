import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sivcpdjtgysnryvfbcvw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpdmNwZGp0Z3lzbnJ5dmZiY3Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MTEyOTQsImV4cCI6MjA2NDA4NzI5NH0.P30L2h9NnsnSccm5NXWeIEMldZ6Tb54uA4zxoaSES1s';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function AdminGallery() {
  const [sections, setSections] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [newSection, setNewSection] = useState({ title: '', position: 1 });
  const [newImage, setNewImage] = useState({ subheading: '', file: null, position: 1 });
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);

  // Fetch sections
  useEffect(() => {
    fetchSections();
  }, []);

  // Fetch images for selected section
  useEffect(() => {
    if (selectedSection) fetchImages(selectedSection.id);
    else setImages([]);
  }, [selectedSection]);

  async function fetchSections() {
    setLoading(true);
    let { data } = await supabase
      .from('gallery_sections')
      .select('*')
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
    setImages(data || []);
    setImgLoading(false);
  }

  // Section CRUD
  async function handleAddSection() {
    if (!newSection.title) return;
    setLoading(true);
    await supabase.from('gallery_sections').insert({ title: newSection.title, position: newSection.position });
    setNewSection({ title: '', position: 1 });
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
    if (!newImage.file) return;
    setImgLoading(true);
    // Upload image to Supabase Storage
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
    await supabase.from('gallery_images').insert({
      section_id: selectedSection.id,
      subheading: newImage.subheading,
      image_url: imageUrl,
      position: newImage.position,
    });
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
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-100">Gallery Sections</h2>
      <div className="flex flex-col md:flex-row gap-8 mb-10">
        <div className="md:w-1/3 bg-[#23272f] rounded-xl p-4 border border-gray-700">
          <h3 className="font-semibold text-lg mb-2 text-gray-200">Add New Section</h3>
          <input
            className="w-full mb-2 px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none"
            type="text"
            placeholder="Section Title"
            value={newSection.title}
            onChange={e => setNewSection({ ...newSection, title: e.target.value })}
          />
          <input
            className="w-full mb-2 px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none"
            type="number"
            placeholder="Position"
            value={newSection.position}
            min={1}
            onChange={e => setNewSection({ ...newSection, position: Number(e.target.value) })}
          />
          <button
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded font-semibold mt-2 transition"
            onClick={handleAddSection}
            disabled={loading || !newSection.title}
          >
            {loading ? 'Adding...' : 'Add Section'}
          </button>
        </div>
        <div className="md:w-2/3">
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
      </div>
      {selectedSection && (
        <div className="bg-[#23272f] rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-gray-100">Images in: <span className="text-blue-400">{selectedSection.title}</span></h2>
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="md:w-1/3">
              <h3 className="font-semibold text-lg mb-2 text-gray-200">Add Image</h3>
              <input
                className="w-full mb-2 px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none"
                type="text"
                placeholder="Subheading"
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
                {!imgLoading && images.length === 0 && <div className="text-gray-400">No images found.</div>}
                {images.map(img => (
                  <div key={img.id} className="rounded-xl p-3 border border-gray-700 bg-gray-900 flex flex-col items-center">
                    <img src={img.image_url} alt="" className="w-full h-32 object-cover rounded mb-2 border border-gray-800" />
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
  );
}

export default AdminGallery;
