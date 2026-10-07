import React from 'react';

export default function FormField({ label, error, children, className = '' }) {
  return (
    <div className={`admin-form-group ${className}`}>
      {label && <label className="admin-label">{label}</label>}
      {children}
      {error && <div className="admin-error-text">{error}</div>}
    </div>
  );
}
