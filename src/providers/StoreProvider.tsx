"use client"
import store from '@/redux/store';
import React from 'react'
import { Provider } from 'react-redux'

const StoreProvider = ({ children }: { children: React.ReactNode }) => {

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--x", `${x}%`);
    el.style.setProperty("--y", `${y}%`);
  };

  return (
    <Provider store={store}>
      <div
        onMouseMove={handleMouseMove}
        className="blue-bg min-h-screen flex flex-col"
      >
        {children}
      </div>
    </Provider>
  )
}
export default StoreProvider