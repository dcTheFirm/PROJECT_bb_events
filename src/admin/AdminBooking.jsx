import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { Calendar, Users, MapPin, Mail, Phone, RefreshCw } from 'lucide-react';

function AdminBooking({ adminUser }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editForm, setEditForm] = useState({
    client_name: '',
    email: '',
    phone: '',
    event_type: '',
    event_date: '',
    guests: '',
    location: '',
    details: '',
    status: ''
  });
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (adminUser) fetchBookings();
  }, [adminUser, filter]);

  // Updated to order by created_at in descending order to show newest bookings first
  async function fetchBookings() {
    setLoading(true);
    try {
      let query = supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false }); // Changed from event_date ascending to created_at descending
      
      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      toast.error('Failed to fetch bookings: ' + err.message);
    }
    setLoading(false);
    setRefreshing(false);
  }

  async function handleRefresh() {
    setRefreshing(true);
    await fetchBookings();
    toast.success('Bookings refreshed successfully');
  }

  async function handleStatusChange(id, newStatus) {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) throw error;
      toast.success(`Booking status updated to ${newStatus}`);
      fetchBookings();
    } catch (err) {
      toast.error('Failed to update status: ' + err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Booking deleted successfully');
      fetchBookings();
    } catch (err) {
      toast.error('Failed to delete booking: ' + err.message);
    }
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      let updateData = { ...editForm };
      if (updateData.guests) {
        updateData.guests = parseInt(updateData.guests, 10);
      }
      
      const { error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', editingBooking.id);
      
      if (error) throw error;
      setEditingBooking(null);
      setEditForm({
        client_name: '',
        email: '',
        phone: '',
        event_type: '',
        event_date: '',
        guests: '',
        location: '',
        details: '',
        status: ''
      });
      toast.success('Booking updated successfully');
      fetchBookings();
    } catch (err) {
      toast.error('Failed to update booking: ' + err.message);
    }
    setLoading(false);
  }

  // Improved search functionality to search across all relevant fields
  const filteredBookings = bookings.filter(booking => {
    if (searchTerm === '') return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      booking.client_name?.toLowerCase().includes(searchLower) ||
      booking.email?.toLowerCase().includes(searchLower) ||
      booking.phone?.toLowerCase().includes(searchLower) ||
      booking.location?.toLowerCase().includes(searchLower) ||
      booking.event_type?.toLowerCase().includes(searchLower) ||
      booking.details?.toLowerCase().includes(searchLower) ||
      booking.status?.toLowerCase().includes(searchLower) ||
      (booking.guests?.toString() || '').includes(searchTerm) ||
      (booking.event_date && new Date(booking.event_date).toLocaleDateString('en-US').includes(searchTerm))
    );
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-green-600/20 text-green-400';
      case 'pending': return 'bg-yellow-600/20 text-yellow-400';
      case 'cancelled': return 'bg-red-600/20 text-red-400';
      case 'completed': return 'bg-blue-600/20 text-blue-400';
      default: return 'bg-gray-600/20 text-gray-400';
    }
  };

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-100">Manage Bookings</h2>
        <Button 
          onClick={handleRefresh} 
          disabled={refreshing || loading}
          className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded flex items-center gap-2"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="bg-[#23272f] rounded-xl p-6 border border-gray-700 mb-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filter === 'all' ? 'bg-blue-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filter === 'pending' ? 'bg-yellow-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('confirmed')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filter === 'confirmed' ? 'bg-green-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              Confirmed
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filter === 'cancelled' ? 'bg-red-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              Cancelled
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filter === 'completed' ? 'bg-blue-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              Completed
            </button>
          </div>
          <div className="w-full md:w-64">
            <Input
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-[#18181b] text-gray-100 placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
            />
          </div>
        </div>
        <div className="text-sm text-gray-400">
          {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Edit Form */}
      {editingBooking && (
        <div className="bg-[#23272f] rounded-xl p-6 border border-gray-700 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Edit Booking</h3>
            <button 
              onClick={() => setEditingBooking(null)}
              className="text-gray-400 hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Client Name"
                value={editForm.client_name}
                onChange={e => setEditForm(f => ({ ...f, client_name: e.target.value }))}
                required
                className="bg-[#18181b] text-gray-100 placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
              />
              <Input
                placeholder="Email"
                type="email"
                value={editForm.email}
                onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                required
                className="bg-[#18181b] text-gray-100 placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
              />
              <Input
                placeholder="Phone"
                type="tel"
                pattern="[0-9]{10}"
                maxLength={10}
                minLength={10}
                value={editForm.phone}
                onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                required
                className="bg-[#18181b] text-gray-100 placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
              />
              <select
                value={editForm.event_type}
                onChange={e => setEditForm(f => ({ ...f, event_type: e.target.value }))}
                required
                className="bg-[#18181b] text-gray-100 placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
              >
                <option value="" disabled>Select Event Type</option>
                <option value="Corporate Event">Corporate Event</option>
                <option value="Wedding & Anniversary">Wedding & Anniversary</option>
                <option value="Birthday">Birthday</option>
                <option value="Private Party">Private Party</option>
                <option value="Workshop">Workshop</option>
              </select>
              <Input
                placeholder="Event Date"
                type="date"
                value={editForm.event_date}
                onChange={e => setEditForm(f => ({ ...f, event_date: e.target.value }))}
                required
                className="bg-[#18181b] text-gray-100 placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
              />
              <Input
                placeholder="Number of Guests"
                type="number"
                min="1"
                max="2000"
                value={editForm.guests}
                onChange={e => setEditForm(f => ({ ...f, guests: e.target.value }))}
                required
                className="bg-[#18181b] text-gray-100 placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
              />
              <Input
                placeholder="Location"
                value={editForm.location}
                onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))}
                required
                className="bg-[#18181b] text-gray-100 placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
              />
              <select
                value={editForm.status}
                onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                required
                className="bg-[#18181b] text-gray-100 placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
              >
                <option value="" disabled>Select Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <textarea
              placeholder="Additional Details"
              value={editForm.details}
              onChange={e => setEditForm(f => ({ ...f, details: e.target.value }))}
              rows={4}
              className="w-full bg-[#18181b] text-gray-100 placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={loading} className="flex-1 bg-green-700 hover:bg-green-800 text-white font-semibold py-2 rounded">
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" onClick={() => setEditingBooking(null)} className="flex-1 bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 rounded">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Bookings List */}
      <div className="bg-[#23272f] rounded-xl p-6 border border-gray-700">
        <h3 className="font-semibold mb-6 text-lg text-gray-100">All Bookings</h3>
        {loading ? (
          <div className="text-gray-400 text-center py-8">Loading bookings...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-gray-400 text-center py-8">No bookings found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-700 text-left">
                  <th className="py-3 px-4 text-gray-300 font-semibold">Client</th>
                  <th className="py-3 px-4 text-gray-300 font-semibold">Event</th>
                  <th className="py-3 px-4 text-gray-300 font-semibold">Date</th>
                  <th className="py-3 px-4 text-gray-300 font-semibold">Guests</th>
                  <th className="py-3 px-4 text-gray-300 font-semibold">Status</th>
                  <th className="py-3 px-4 text-gray-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map(booking => (
                  <tr key={booking.id} className="border-b border-gray-700 hover:bg-[#18181b]">
                    <td className="py-4 px-4">
                      <div className="font-semibold text-gray-100">{booking.client_name}</div>
                      <div className="text-gray-400 text-sm flex items-center gap-1">
                        <Mail size={12} /> {booking.email}
                      </div>
                      <div className="text-gray-400 text-sm flex items-center gap-1">
                        <Phone size={12} /> {booking.phone}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-gray-100">{booking.event_type}</div>
                      <div className="text-gray-400 text-sm flex items-center gap-1">
                        <MapPin size={12} /> {booking.location}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-gray-100">
                        {new Date(booking.event_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-gray-100 flex items-center gap-1">
                        <Users size={14} /> {booking.guests}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingBooking(booking);
                            setEditForm({
                              client_name: booking.client_name,
                              email: booking.email,
                              phone: booking.phone,
                              event_type: booking.event_type,
                              event_date: booking.event_date,
                              guests: booking.guests,
                              location: booking.location,
                              details: booking.details,
                              status: booking.status
                            });
                          }}
                          className="p-1.5 rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => handleStatusChange(booking.id, 'confirmed')}
                            className="p-1.5 rounded bg-green-600/20 text-green-400 hover:bg-green-600/30 transition-colors"
                            title="Confirm Booking"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        )}
                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                          <button
                            onClick={() => handleStatusChange(booking.id, 'cancelled')}
                            className="p-1.5 rounded bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
                            title="Cancel Booking"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusChange(booking.id, 'completed')}
                            className="p-1.5 rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors"
                            title="Mark as Completed"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="p-1.5 rounded bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
                          title="Delete Booking"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminBooking;