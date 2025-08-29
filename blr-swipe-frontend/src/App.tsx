import React, { useState } from 'react';
import Home from './pages/Home';
import Profile from './pages/Profile';
import OwnerNew from './pages/OwnerNew';

export default function App() {
  const [tab, setTab] = useState<'home' | 'profile' | 'owner'>('home');

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
          <div className="font-bold text-lg">BLR Swipe</div>
          <nav className="flex gap-4 text-sm">
            <button className={`hover:underline ${tab==='home'?'font-semibold':''}`} onClick={()=>setTab('home')}>Home</button>
            <button className={`hover:underline ${tab==='profile'?'font-semibold':''}`} onClick={()=>setTab('profile')}>My Space</button>
            <button className={`hover:underline ${tab==='owner'?'font-semibold':''}`} onClick={()=>setTab('owner')}>Post Event</button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 pt-6 pb-24">
        {tab === 'home' && <Home />}
        {tab === 'profile' && <Profile />}
        {tab === 'owner' && <OwnerNew />}
      </main>
    </div>
  );
}
