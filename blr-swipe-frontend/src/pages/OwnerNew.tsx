import React, { useState } from 'react';
import api from '../api';

export default function OwnerNew() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    image: '',
    location: '',
    category: 'event',
    eventDate: ''
  });
  const [status, setStatus] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('Saving...');
    try {
      await api.post('/api/events', form);
      setStatus('Saved!');
      setForm({ title: '', description: '', image: '', location: '', category: 'event', eventDate: '' });
    } catch {
      setStatus('Error saving');
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">Post a New Event / Place</h1>
      <form onSubmit={submit} className="space-y-4">
        <input className="w-full border rounded-lg px-3 py-2" placeholder="Title" value={form.title}
               onChange={e => setForm({ ...form, title: e.target.value })} required />
        <textarea className="w-full border rounded-lg px-3 py-2" placeholder="Description" rows={4} value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })} />
        <input className="w-full border rounded-lg px-3 py-2" placeholder="Image URL" value={form.image}
               onChange={e => setForm({ ...form, image: e.target.value })} />
        <input className="w-full border rounded-lg px-3 py-2" placeholder="Location (optional)" value={form.location}
               onChange={e => setForm({ ...form, location: e.target.value })} />
        <select className="w-full border rounded-lg px-3 py-2" value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}>
          <option value="event">Event</option>
          <option value="brewery">Brewery</option>
          <option value="restaurant">Restaurant</option>
          <option value="activity">Activity</option>
          <option value="other">Other</option>
        </select>
        <input type="datetime-local" className="w-full border rounded-lg px-3 py-2" value={form.eventDate}
               onChange={e => setForm({ ...form, eventDate: e.target.value })} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Create</button>
      </form>
      {status && <p className="mt-3 text-sm text-gray-600">{status}</p>}
    </div>
  );
}
