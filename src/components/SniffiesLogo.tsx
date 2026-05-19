import React from 'react';

const SniffiesLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M256 120C180.89 120 120 180.89 120 256C120 331.11 180.89 392 256 392C331.11 392 392 331.11 392 256C392 180.89 331.11 120 256 120ZM256 360C198.56 360 152 313.44 152 256C152 198.56 198.56 152 256 152C313.44 152 360 198.56 360 256C360 313.44 313.44 360 256 360Z" fill="currentColor"/>
    <circle cx="256" cy="256" r="60" fill="currentColor" fillOpacity="0.3"/>
    <circle cx="256" cy="256" r="30" fill="currentColor"/>
  </svg>
);

export default SniffiesLogo;
