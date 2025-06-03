import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Banner() {
  const location = useLocation();
  
  // Hide banner on MA News page
  if (location.pathname === '/ma-news') {
    return null;
  }
  
  return (
    <div className="fixed top-0 w-full bg-blue-600 text-white text-xs py-1 px-4 text-center">
      New analysis in ~4.5 mins (backend tier limit)
    </div>
  );
}