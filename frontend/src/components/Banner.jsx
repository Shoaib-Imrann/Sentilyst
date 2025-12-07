import React, { useContext } from 'react';
import { AppContext } from '../Context/AppContext';
import { Megaphone } from 'lucide-react';

export default function Banner() {
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
  
  // Hide banner when server is online
  return null;
}