import React, { useEffect, useState } from 'react';
import SwipeDeck from '../components/SwipeDeck';
import type { CardType } from '../types';
import api from '../api';

export default function Home() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);
  const city = import.meta.env.VITE_CITY || 'Bangalore';

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await api.get('/api/cards');
      setCards(res.data.cards || []);
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">What’s on in {city}?</h1>
      {/* UPDATED: Changed "Join" to "Dislike" in the instructional text */}
      <p className="text-sm text-gray-600 mb-6">
        Swipe <span className="font-medium">left</span> to Dislike, <span className="font-medium">right</span> to Like.
      </p>

      {loading ? (
        <div className="animate-pulse h-[520px] bg-gray-200 rounded-2xl" />
      ) : (
        <SwipeDeck initialCards={cards} />
      )}
    </div>
  );
}