import React from 'react';
import './Badge.css';

const Badge = ({ children, status = 'default' }) => {
  return (
    <span className={`badge badge-${status}`}>
      {status === 'confirmed' && <span className="badge-dot"></span>}
      {children}
    </span>
  );
};

export default Badge;
