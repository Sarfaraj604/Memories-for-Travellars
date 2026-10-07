import React from 'react';

export default function LoadingState({ type = 'table' }) {
  if (type === 'cards') {
    return (
      <div className="admin-stat-grid">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="admin-skeleton" style={{ height: '100px' }}></div>
        ))}
      </div>
    );
  }

  if (type === 'form') {
    return (
      <div className="admin-card">
        <div className="admin-card-body">
          <div className="admin-skeleton" style={{ height: '40px', marginBottom: '1rem' }}></div>
          <div className="admin-skeleton" style={{ height: '40px', marginBottom: '1rem' }}></div>
          <div className="admin-skeleton" style={{ height: '100px', marginBottom: '1rem' }}></div>
        </div>
      </div>
    );
  }

  // table
  return (
    <div className="admin-card">
      <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="admin-skeleton" style={{ height: '40px' }}></div>
        ))}
      </div>
    </div>
  );
}
