import React, { useMemo, useState, useCallback } from 'react';
import TinderCard from 'react-tinder-card';
import EventCard from './EventCard';
import type { CardType } from '../types';
import api from '../api';

export default function SwipeDeck({ initialCards }: { initialCards: CardType[] }) {
  const [cards, setCards] = useState<CardType[]>(initialCards);

  const swiped = useCallback(async (dir: 'left' | 'right', card: CardType) => {
    // Updated: Backend now accepts 'dislike' for left swipe
    const action = dir === 'left' ? 'dislike' : 'like';
    setCards(prev => prev.filter(c => c._id !== card._id)); // optimistic remove
    try {
      await api.post('/api/swipe', { cardId: card._id, action });
    } catch (e) {
      console.error('Swipe send failed', e);
    }
  }, []);

  const children = useMemo(
    () =>
      cards.map(card => (
        <TinderCard
          key={card._id}
          onSwipe={dir => swiped(dir as 'left' | 'right', card)}
          preventSwipe={['up', 'down']}
          className="absolute"
        >
          <div className="mx-auto">
            <EventCard card={card} />
          </div>
        </TinderCard>
      )),
    [cards, swiped]
  );

  if (cards.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-white shadow text-center">
        No more cards for now. Come back later!
      </div>
    );
  }

  return (
    <div className="relative h-[560px]">
      <div className="relative w-full h-full flex items-center justify-center">{children}</div>
      {/* Updated: Left swipe means "Dislike", right swipe means "Like" */}
      <div className="mt-4 flex items-center justify-center gap-3 text-sm text-gray-600">
        <span className="px-3 py-1 rounded-full bg-gray-100">⬅️ Dislike</span>
        <span className="px-3 py-1 rounded-full bg-gray-100">Like ➡️</span>
      </div>
    </div>
  );
}