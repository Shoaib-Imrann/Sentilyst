import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AppContext } from '../Context/AppContext';
import { Megaphone } from 'lucide-react';

export default function Banner() {
  const location = useLocation();
  const { serverStatus } = useContext(AppContext);
  
  // Don't show anything while checking server status
  if (serverStatus === 'checking') {
    return null;
  }
  
  // Show server offline message if server is down (on all pages)
  if (serverStatus === 'offline') {
    return (
      <div className="fixed top-0 w-full bg-red-700 text-white text-xs py-1 px-4 text-center flex items-center justify-center gap-1">
        Server offline - Use 
        <span className="inline-flex items-center gap-1 font-medium">
          <Megaphone size={14} />
          <span className='hidden md:block'>Report a Bug</span>
        </span>
        to notify admin
      </div>
    );
  }
  
  // Hide banner on MA News page and login/signup pages when server is online
  if (location.pathname === '/ma-news' || location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }
  
  return (
    <div className="fixed top-0 w-full bg-blue-600 text-white text-xs py-1 px-4 text-center">
      New analysis in ~4.5 mins (backend tier limit)
    </div>
  );
}