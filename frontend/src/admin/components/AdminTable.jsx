import React from 'react';

export default function AdminTable({ columns, data, actions }) {
  if (!data || data.length === 0) {
    return (
      <div className="admin-card">
        <div className="admin-card-body" style={{ textAlign: 'center', color: 'var(--gray-500)' }}>
          No records found.
        </div>
      </div>
    );
  }

  return (
    <div className="admin-card">
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th key={i}>{col.label}</th>
              ))}
              {actions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={row._id || i}>
                {columns.map((col, j) => (
                  <td key={j}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {actions && (
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {actions(row)}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
