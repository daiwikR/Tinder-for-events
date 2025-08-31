import React from 'react';
import type { CardType } from '../types';

export default function EventCard({ card }: { card: CardType }) {
  const liked = card.likedCount || 0;
  const disliked = card.dislikedCount || 0; // Using dislikedCount now
  const total = liked + disliked;
  const ratio = total > 0 ? Math.round((liked / total) * 100) : null;

  return (
    // UPDATED: Added `draggable={false}` and `select-none` to the root element
    <div
      className="w-[360px] h-[520px] bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col select-none"
      draggable={false}
    >
      <div className="relative h-2/3">
        {/* eslint-disable-next-line */}
        <img
          src={card.image || 'https://picsum.photos/800/600'}
          alt={card.title}
          className="w-full h-full object-cover"
          // `draggable` is no longer needed here
        />
        {ratio !== null && (
          <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full text-xs font-medium shadow">
            {ratio}% liked
          </div>
        )}
      </div>
      <div className="flex-1 p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight">{card.title}</h3>
          {card.category && (
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full capitalize">
              {card.category}
            </span>
          )}
        </div>
        {card.location && <p className="text-sm text-gray-600">📍 {card.location}</p>}
        {card.eventDate && (
          <p className="text-sm text-gray-600">🗓️ {new Date(card.eventDate).toLocaleString()}</p>
        )}
        <p className="text-sm text-gray-700 line-clamp-3">{card.description}</p>
      </div>
      <div className="px-4 pb-4 text-xs text-gray-500">
        Hint: Swipe left to <span className="font-medium">Dislike</span>, right to <span className="font-medium">Like</span>.
      </div>
    </div>
  );
}