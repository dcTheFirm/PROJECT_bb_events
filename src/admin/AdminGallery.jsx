import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { validateImageSize } from '../lib/validateImageSize';

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
  const [newCategory, setNewCategory] = useState({ position: 1, label: '' });
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedCategory, setEditedCategory] = useState({ position: 1, label: '' });

  const [activeTab, setActiveTab] = useState('sections');

  // Add new state for form visibility
  const [showSectionForm, setShowSectionForm] = useState(false);

  // Add state for image editing
  const [editingImage, setEditingImage] = useState(null);
  const [editedImagePosition, setEditedImagePosition] = useState(null);

  // Add state for showing add image form
  const [showAddImageForm, setShowAddImageForm] = useState(false);

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
      .order('position', { ascending: true });
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
    setShowSectionForm(false); // Hide form after successful add
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
    try {
      const { error } = await supabase
        .from('gallery_sections')
        .update({ title: newTitle.trim() })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating title:', error);
        alert('Failed to update title');
        return;
      }

      // Update the selected section title locally
      setSelectedSection(prev => ({
        ...prev,
        title: newTitle.trim()
      }));

      // Update the section in the sections list
      setSections(prev => prev.map(section => 
        section.id === id ? { ...section, title: newTitle.trim() } : section
      ));

      setEditingTitle(false);
    } catch (error) {
      console.error('Error updating title:', error);
      alert('Failed to update title');
    } finally {
      setLoading(false);
    }
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
    setShowAddImageForm(false);
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
    if (!newCategory.label.trim()) return;
    const { error } = await supabase.from('gallery_categories').insert([newCategory]);
    if (!error) {
      setNewCategory({ position: 1, label: '' });
      await fetchCategories();
    }
  }
  // Edit category
  async function handleEditCategory() {
    if (!editedCategory.label.trim() || !editingCategory) return;
    const { error } = await supabase.from('gallery_categories').update(editedCategory).eq('id', editingCategory.id);
    if (!error) {
      setEditingCategory(null);
      setEditedCategory({ position: 1, label: '' });
      await fetchCategories();
    }
  }
  // Delete category
  async function handleDeleteCategory(id) {
    await supabase.from('gallery_categories').delete().eq('id', id);
    await fetchCategories();
  }

  // Add function to handle image edit
  async function handleUpdateImage(id) {
    if (!editedImagePosition) return;
    setImgLoading(true);
    await supabase.from('gallery_images').update({ position: editedImagePosition }).eq('id', id);
    setEditingImage(null);
    setEditedImagePosition(null);
    await fetchImages(selectedSection.id);
    setImgLoading(false);
  }

  return (
    <div className="min-h-screen w-full flex flex-row bg-[#181a20]">
      {/* Sidebar for categories */}
      <aside className="w-64 bg-[#20232a] border-r border-gray-800 flex flex-col items-center py-8 px-4 h-full rounded-xl">
        <h2 className="text-2xl font-bold mb-8 text-gray-100">Manage Gallery</h2>
        <nav className="flex flex-col gap-4 w-full mb-4">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center gap-2">
              <button
                onClick={() => { setNav(cat.key); setActiveTab('sections'); }}
                className={`w-full px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 text-left ${nav === cat.key ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                {cat.label}
              </button>
              <button className="text-xs text-blue-400" onClick={() => { setEditingCategory(cat); setEditedCategory({ position: cat.position, label: cat.label }); }}>Edit</button>
              <button className="text-xs text-red-400" onClick={() => handleDeleteCategory(cat.id)}>Delete</button>
            </div>
          ))}
        </nav>
        {/* Add new category */}
        <div className="w-full flex flex-col gap-2 mt-4">
          <input
            className="px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none text-base"
            type="number"
            min="1"
            placeholder="Category Position"
            value={newCategory.position}
            onChange={e => setNewCategory({ ...newCategory, position: parseInt(e.target.value) || 1 })}
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
              type="number"
              min="1"
              placeholder="Category Position"
              value={editedCategory.position}
              onChange={e => setEditedCategory({ ...editedCategory, position: parseInt(e.target.value) || 1 })}
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
      {/* Main content with tabs */}
      <div className="flex-1 flex flex-col p-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            className={`px-6 py-2 rounded-t-lg font-semibold ${activeTab === 'sections' ? 'bg-white text-black' : 'bg-gray-700 text-white'}`}
            onClick={() => setActiveTab('sections')}
          >
            Sections
          </button>
          <button
            className={`px-6 py-2 rounded-t-lg font-semibold ${activeTab === 'images' ? 'bg-white text-black' : 'bg-gray-700 text-white'} ${!selectedSection ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => selectedSection && setActiveTab('images')}
            disabled={!selectedSection}
          >
            Images
          </button>
        </div>
        <div className="bg-[#23272f] rounded-b-xl p-8 border border-gray-700 flex-1">
          {/* Sections Tab */}
          {activeTab === 'sections' && (
            <>
              <h3 className="font-semibold text-xl mb-6 text-gray-200">Sections in <span className="text-blue-400">{(categories.find(c => c.key === nav)?.label || "")}</span></h3>
              <div className="flex flex-col gap-4 mb-8">
                {sections.length === 0 && <div className="text-gray-400">No sections found.</div>}
                {sections.map(section => (
                  <div key={section.id} className={`rounded-xl px-5 py-3 border flex items-center justify-between transition-all duration-200 shadow-sm hover:shadow-lg mb-1 ${selectedSection && selectedSection.id === section.id ? 'border-blue-500 bg-gray-800' : 'border-gray-700 bg-[#23272f]'}`}> 
                    <button
                      className="text-lg font-bold text-blue-400 hover:underline text-left flex-1 truncate"
                      onClick={() => { setSelectedSection(section); setActiveTab('images'); }}
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
              {/* Add Section Form */}
              <div className="mt-8">
                {!showSectionForm ? (
                  <button
                    onClick={() => setShowSectionForm(true)}
                    className="w-full py-4 px-6 rounded-xl border-2 border-dashed border-gray-600 text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all duration-300 text-lg font-medium flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Click to Add Sections
                  </button>
                ) : (
                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 animate-in slide-in-from-top duration-300">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-lg text-gray-100">Add Section</h4>
                      <button 
                        onClick={() => setShowSectionForm(false)}
                        className="text-gray-400 hover:text-gray-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
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
                )}
              </div>
            </>
          )}
          {/* Images Tab */}
          {activeTab === 'images' && (
            <>
              {selectedSection ? (
                <div className="w-full">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold text-white">
                        {editingTitle ? (
                          <form 
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleUpdateSectionTitle(selectedSection.id, editedTitle);
                            }}
                            className="flex items-center gap-2"
                          >
                            <input
                              className="text-2xl font-bold bg-gray-800 text-white border border-gray-500 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                              value={editedTitle}
                              autoFocus
                              onChange={e => setEditedTitle(e.target.value)}
                              onBlur={() => {
                                if (editedTitle.trim() !== selectedSection.title) {
                                  handleUpdateSectionTitle(selectedSection.id, editedTitle);
                                } else {
                                  setEditingTitle(false);
                                }
                              }}
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleUpdateSectionTitle(selectedSection.id, editedTitle);
                                } else if (e.key === 'Escape') {
                                  setEditingTitle(false);
                                  setEditedTitle(selectedSection.title);
                                }
                              }}
                            />
                            <div className="flex items-center gap-1">
                              <button
                                type="submit"
                                className="p-1 text-green-400 hover:text-green-300 transition-colors"
                                disabled={loading}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                className="p-1 text-gray-400 hover:text-gray-300 transition-colors"
                                onClick={() => {
                                  setEditingTitle(false);
                                  setEditedTitle(selectedSection.title);
                                }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </form>
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
                    {!showAddImageForm && (
                      <button
                        onClick={() => setShowAddImageForm(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Image
                      </button>
                    )}
                  </div>

                  {/* Add Image Form */}
                  {showAddImageForm && (
                    <div className="mb-6 p-4 bg-gray-800/40 rounded-xl border border-gray-700">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold text-white">Add New Image</h4>
                        <button 
                          onClick={() => setShowAddImageForm(false)}
                          className="text-gray-400 hover:text-gray-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <input
                          className="flex-1 px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
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
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={handleAddImage}
                          disabled={imgLoading || !newImage.file}
                        >
                          {imgLoading ? 'Uploading...' : 'Upload Image'}
                        </button>
                      </div>
                      {error && <div className="text-xs text-red-400 mt-2">{error}</div>}
                      <div className="text-xs text-gray-400 mt-2">Only .webp images under 650 KB are accepted.</div>
                      <div className="text-sm text-blue-200 mt-1">Note: Only 5 images will be shown in a single row in the gallery.</div>
                    </div>
                  )}

                  {/* Gallery Grid */}
                  <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {imgLoading && <div className="text-gray-400 col-span-full">Loading images...</div>}
                    {!imgLoading && images.length === 0 && (
                      <div className="col-span-full text-center py-12">
                        <h3 className="text-xl font-semibold text-gray-400">No images found for this section.</h3>
                        <p className="text-gray-500 mt-2">Click the Add Image button to upload some images.</p>
                      </div>
                    )}
                    {images && images.map(img => (
                      <div key={img.id} className="bg-gray-800/40 rounded-xl border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 p-4">
                        <div className="w-full aspect-square mb-4 overflow-hidden rounded-lg">
                          <img 
                            src={img.image_url} 
                            alt="Gallery media" 
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" 
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-xs text-gray-400 block mb-1">Position</label>
                              {editingImage === img.id ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    min={1}
                                    value={editedImagePosition}
                                    className="w-20 px-2 py-1 rounded bg-gray-700 text-white border border-gray-600 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                    onChange={e => setEditedImagePosition(Number(e.target.value))}
                                  />
                                  <button
                                    className="p-1 text-green-400 hover:text-green-300 transition-colors"
                                    onClick={() => handleUpdateImage(img.id)}
                                    disabled={imgLoading}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </button>
                                  <button
                                    className="p-1 text-gray-400 hover:text-gray-300 transition-colors"
                                    onClick={() => {
                                      setEditingImage(null);
                                      setEditedImagePosition(null);
                                    }}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-white">{img.position}</span>
                                  <button
                                    className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                                    onClick={() => {
                                      setEditingImage(img.id);
                                      setEditedImagePosition(img.position);
                                    }}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                  </button>
                                </div>
                              )}
                            </div>
                            <button
                              className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs hover:bg-red-500/30 transition-colors flex items-center gap-1"
                              onClick={() => handleDeleteImage(img.id)}
                              disabled={imgLoading}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-gray-400">Select a section to manage images.</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminGallery;
