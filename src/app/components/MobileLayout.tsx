import React from 'react';
import { Outlet } from 'react-router';

export const MobileLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center sm:p-4">
      <div className="w-full h-[100dvh] sm:h-[844px] sm:max-w-[390px] bg-gray-50 flex flex-col sm:rounded-[40px] sm:shadow-2xl overflow-hidden relative sm:border-[8px] border-black ring-1 ring-gray-900/10 shadow-black/20">
        <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar bg-white">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
