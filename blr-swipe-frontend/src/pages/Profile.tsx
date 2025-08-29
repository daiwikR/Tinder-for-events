import React, { useEffect, useState } from 'react';
import type { CardType } from '../types';
import api from '../api';

// Helper function to format the date for the reminder
const formatReminderDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export default function Profile() {
  const [likes, setLikes] = useState<CardType[]>([]);
  // UPDATED: Renamed state from `joins` to `dislikes`
  const [dislikes, setDislikes] = useState<CardType[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<CardType[]>([]);

  useEffect(() => {
    (async () => {
      const res = await api.get('/api/profile');
      const likedEvents = res.data.likes || [];
      // UPDATED: Fetching `dislikes` from the API response
      const dislikedEvents = res.data.dislikes || [];

      setLikes(likedEvents);
      setDislikes(dislikedEvents);

      const now = new Date();
      const upcoming = likedEvents
        .filter(event => event.eventDate && new Date(event.eventDate) > now)
        .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
      
      setUpcomingEvents(upcoming);
    })();
  }, []);

  // UPDATED: The handler now works with a `dislikes` listType
  const handleRemove = async (cardId: string, listType: 'likes' | 'dislikes') => {
    if (listType === 'likes') {
      setLikes(current => current.filter(c => c._id !== cardId));
    } else {
      setDislikes(current => current.filter(c => c._id !== cardId));
    }
    await api.delete(`/api/profile/swipes/${cardId}`);
  };

  return (
    <div className="space-y-8">
      {upcomingEvents.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-3">Upcoming Reminders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingEvents.map(event => (
              <div key={event._id} className="p-4 rounded-xl bg-white shadow border-l-4 border-blue-500">
                <div className="font-medium text-gray-800">{event.title}</div>
                <div className="text-sm text-blue-700 font-semibold mt-1">
                  🗓️ {formatReminderDate(event.eventDate)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold mb-3">Liked</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {likes.map(c => (
             <div key={c._id} className="p-4 rounded-xl bg-white shadow flex items-center justify-between">
              <div>
                <div className="font-medium">{c.title}</div>
                <div className="text-sm text-gray-600">{c.location}</div>
              </div>
              <button 
                onClick={() => handleRemove(c._id, 'likes')}
                className="text-xs font-semibold text-red-500 hover:text-red-700 ml-4"
              >
                Remove
              </button>
            </div>
          ))}
          {likes.length === 0 && <p className="text-gray-600 text-sm">No likes yet.</p>}
        </div>
      </section>

      {/* UPDATED: This entire section is changed from "Joined" to "Disliked" */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Disliked</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dislikes.map(c => (
            <div key={c._id} className="p-4 rounded-xl bg-white shadow flex items-center justify-between">
              <div>
                <div className="font-medium">{c.title}</div>
                <div className="text-sm text-gray-600">{c.location}</div>
              </div>
              <button 
                onClick={() => handleRemove(c._id, 'dislikes')}
                className="text-xs font-semibold text-gray-500 hover:text-gray-700 ml-4"
              >
                Remove
              </button>
            </div>
          ))}
          {dislikes.length === 0 && <p className="text-gray-600 text-sm">No dislikes yet.</p>}
        </div>
      </section>
    </div>
  );
}