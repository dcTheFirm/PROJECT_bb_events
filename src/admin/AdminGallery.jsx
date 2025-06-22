import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { validateImageSize } from '../lib/validateImageSize';

const supabaseUrl = 'https://sivcpdjtgysnryvfbcvw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpdmNwZGp0Z3lzbnJ5dmZiY3Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MTEyOTQsImV4cCI6MjA2NDA4NzI5NH0.P30L2h9NnsnSccm5NXWeIEMldZ6Tb54uA4zxoaSES1s';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function AdminGallery() {
  const [nav, setNav] = useState('showcases');
  const [sectionCount, setSectionCount] = useState(1);
  const [sectionInputs, setSectionInputs] = useState([{ title: '', position: 1 }]);
  
  // default to 1 section
  const [sections, setSections] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [newImage, setNewImage] = useState({ file: null, position: 1 });
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [localPositions, setLocalPositions] = useState({});
  const [editingTitle, setEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");

 const [error, setError] = useState("");

  // Add state for categories
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ key: '', label: '' });
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedCategory, setEditedCategory] = useState({ key: '', label: '' });

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

  // Update localPositions when images change
  useEffect(() => {
    if (images && images.length > 0) {
      const posObj = {};
      images.forEach(img => {
        posObj[img.id] = img.position;
      });
      setLocalPositions(posObj);
    }
  }, [images]);

  // Fetch categories from Supabase
  useEffect(() => {
    fetchCategories();
  }, []);

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

  // Fetch categories from Supabase
  async function fetchCategories() {
    let { data } = await supabase
      .from('gallery_categories')
      .select('*')
      .order('id', { ascending: true });
    setCategories(data || []);
    // Set nav to first category if not set
    if (data && data.length > 0 && !categories.find(c => c.key === nav)) {
      setNav(data[0].key);
    }
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
  async function handleUpdateSectionTitle(id, newTitle) {
    if (!newTitle || newTitle.trim() === "") return;
    setLoading(true);
    await supabase.from('gallery_sections').update({ title: newTitle }).eq('id', id);
    await fetchSections();
    setEditingTitle(false);
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
      image_url: imageUrl,
      position: newImage.position,
    });
    setNewImage({ file: null, position: 1 });
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

  // Add category
  async function handleAddCategory() {
    if (!newCategory.key.trim() || !newCategory.label.trim()) return;
    const { error } = await supabase.from('gallery_categories').insert([newCategory]);
    if (!error) {
      setNewCategory({ key: '', label: '' });
      await fetchCategories();
    }
  }
  // Edit category
  async function handleEditCategory() {
    if (!editedCategory.key.trim() || !editedCategory.label.trim() || !editingCategory) return;
    const { error } = await supabase.from('gallery_categories').update(editedCategory).eq('id', editingCategory.id);
    if (!error) {
      setEditingCategory(null);
      setEditedCategory({ key: '', label: '' });
      await fetchCategories();
    }
  }
  // Delete category
  async function handleDeleteCategory(id) {
    await supabase.from('gallery_categories').delete().eq('id', id);
    await fetchCategories();
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#181a20]">
      {/* Top row: Sidebar, Sections List, and Add Section panel in a single row, not crossing green line */}
      <div className="flex flex-row items-start w-full max-h-[420px] p-8 gap-8">
        {/* Sidebar for categories */}
        <aside className="w-64 bg-[#20232a] border-r border-gray-800 flex flex-col items-center py-8 px-4 h-full rounded-xl">
          <h2 className="text-2xl font-bold mb-8 text-gray-100">Manage Gallery </h2>
          <nav className="flex flex-col gap-4 w-full mb-4">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center gap-2">
                <button
                  onClick={() => setNav(cat.key)}
                  className={`w-full px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 text-left ${nav === cat.key ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                  {cat.label}
                </button>
                <button className="text-xs text-blue-400" onClick={() => { setEditingCategory(cat); setEditedCategory({ key: cat.key, label: cat.label }); }}>Edit</button>
                <button className="text-xs text-red-400" onClick={() => handleDeleteCategory(cat.id)}>Delete</button>
              </div>
            ))}
          </nav>
          {/* Add new category */}
          <div className="w-full flex flex-col gap-2 mt-4">
            <input
              className="px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none text-base"
              type="text"
              placeholder="Category Key"
              value={newCategory.key}
              onChange={e => setNewCategory({ ...newCategory, key: e.target.value })}
            />
            <input
              className="px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none text-base"
              type="text"
              placeholder="Category Label"
              value={newCategory.label}
              onChange={e => setNewCategory({ ...newCategory, label: e.target.value })}
            />
            <button
              className="bg-blue-700 hover:bg-blue-800 text-white py-2 rounded font-semibold text-base transition"
              onClick={handleAddCategory}
            >
              Add Category
            </button>
          </div>
          {/* Edit category modal/inline */}
          {editingCategory && (
            <div className="w-full flex flex-col gap-2 mt-4 bg-gray-900 p-3 rounded">
              <input
                className="px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none text-base"
                type="text"
                placeholder="Category Key"
                value={editedCategory.key}
                onChange={e => setEditedCategory({ ...editedCategory, key: e.target.value })}
              />
              <input
                className="px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none text-base"
                type="text"
                placeholder="Category Label"
                value={editedCategory.label}
                onChange={e => setEditedCategory({ ...editedCategory, label: e.target.value })}
              />
              <div className="flex gap-2">
                <button className="bg-green-700 hover:bg-green-800 text-white py-2 rounded font-semibold text-base transition flex-1" onClick={handleEditCategory}>Save</button>
                <button className="bg-gray-700 hover:bg-gray-800 text-white py-2 rounded font-semibold text-base transition flex-1" onClick={() => setEditingCategory(null)}>Cancel</button>
              </div>
            </div>
          )}
        </aside>
        {/* Sections List next to sidebar */}
        <div className="w-80 bg-[#23272f] rounded-xl p-6 border border-gray-700 flex-shrink-0 flex flex-col h-full max-h-[420px] overflow-y-auto">
          <h3 className="font-semibold text-xl mb-6 text-gray-200">Sections List</h3>
          <div className="flex flex-col gap-4 overflow-y-auto hide-scrollbar" style={{ maxHeight: '320px' }}>
            {sections.length === 0 && <div className="text-gray-400">No sections found.</div>}
            {sections.map(section => (
              <div key={section.id} className={`rounded-xl px-5 py-3 border flex items-center justify-between transition-all duration-200 shadow-sm hover:shadow-lg mb-1 ${selectedSection && selectedSection.id === section.id ? 'border-blue-500 bg-gray-800' : 'border-gray-700 bg-[#23272f]'}`}> 
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
        {/* How many sections panel */}
        <div className="flex-1 bg-[#23272f] rounded-xl p-8 border border-gray-700 h-full max-h-[420px] overflow-y-auto">
          <h3 className="font-semibold text-2xl mb-6 text-gray-200">How many sections do you want in <span className="text-blue-400">{(categories.find(c => c.key === nav)?.label || "")}</span>?</h3>
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
      </div>


      {/* Main content below (gallery/media) remains unchanged */}
      <main className="flex-1 flex flex-col py-10 px-10 bg-[#181a20]">
        {/* Sections and Media */}
        <div className="flex w-full gap-10">
          {/* Media Management Panel full width */}
          <div className="flex-1">
            {selectedSection && (
              <div className="w-full">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-2xl font-bold text-white">
                      {editingTitle ? (
                        <input
                          className="text-2xl font-bold bg-gray-800 text-white border border-gray-500 rounded px-2 py-1 focus:outline-none"
                          value={editedTitle}
                          autoFocus
                          onChange={e => setEditedTitle(e.target.value)}
                          onBlur={() => handleUpdateSectionTitle(selectedSection.id, editedTitle)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleUpdateSectionTitle(selectedSection.id, editedTitle);
                          }}
                        />
                      ) : (
                        <>
                          <span className="capitalize">{selectedSection.title}</span>
                          <button
                            className="ml-3 px-2 py-0.5 text-xs text-gray-400 hover:text-blue-400 border border-gray-500 rounded transition-all align-middle"
                            onClick={() => {
                              setEditingTitle(true);
                              setEditedTitle(selectedSection.title);
                            }}
                            title="Edit Title"
                          >
                            edit...
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-row items-center gap-2 mb-2">
                    <label className="text-base text-white font-medium mr-2">Add Image</label>
                    <input
                      className="px-2 py-1 rounded bg-transparent text-white border border-gray-400 focus:outline-none text-sm"
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
                        setNewImage({ ...newImage, file });
                      }}
                    />
                    <button
                      className="px-4 py-1 bg-transparent border border-gray-400 text-white rounded text-base font-normal transition ml-2"
                      onClick={handleAddImage}
                      disabled={imgLoading || !newImage.file}
                    >
                      {imgLoading ? 'Uploading...' : 'upload'}
                    </button>
                  </div>
                  {error && <div className="text-xs text-red-400 mt-1">{error}</div>}
                  <div className="text-xs text-gray-400 mt-1">Only .webp images under 650 KB are accepted.</div>
                  
                  <div className="text-sm text-blue-200 mb-2">
                    Note: Only 5 images will be shown in a single row in the gallery.
                  </div>
                </div>
                {/* Gallery Grid */}
                <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-2">
                  {imgLoading && <div className="text-gray-400 col-span-full">Loading images...</div>}
                  {!imgLoading && images.length === 0 &&
                    Array.from({ length: 5 }).map((_, idx) => (
                      <div key={idx} className="border border-gray-400 rounded-xl bg-transparent min-h-[200px] h-[200px] flex flex-col justify-end items-center p-2"></div>
                    ))
                  }
                  {images && images.map(img => (
                    <div key={img.id} className="rounded-xl bg-transparent flex flex-col justify-between items-center p-2">
                      <div className="w-full flex-1 flex items-center justify-center mb-2">
                        {/* For images */}
                        <img src={img.image_url} alt="Gallery media" className="object-cover w-full h-[120px] rounded shadow-none bg-transparent" />
                      </div>
                      <div className="flex flex-col items-center w-full">
                        <label className="text-xs text-gray-300 mb-1">Position</label>
                        <input
                          type="number"
                          min={1}
                          value={localPositions[img.id] ?? img.position}
                          className="w-16 px-2 py-1 rounded bg-gray-800 text-white border border-gray-500 text-xs text-center focus:outline-none"
                          onChange={e => setLocalPositions(pos => ({ ...pos, [img.id]: Number(e.target.value) }))}
                        />
                        <button
                          className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition"
                          onClick={() => handleDeleteImage(img.id)}
                          disabled={imgLoading}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Single Set Position button for all media */}
                {images.length > 0 && (
                  <div className="flex justify-end mt-4">
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700 transition"
                      disabled={imgLoading || !Object.keys(localPositions).some(id => localPositions[id] !== (images.find(img => img.id == id)?.position))}
                      onClick={async () => {
                        setImgLoading(true);
                        const updates = images.filter(img => localPositions[img.id] !== img.position);
                        for (const img of updates) {
                          await handleUpdateImagePosition(img.id, localPositions[img.id]);
                        }
                        setImgLoading(false);
                      }}
                    >
                      Set Position
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminGallery;
