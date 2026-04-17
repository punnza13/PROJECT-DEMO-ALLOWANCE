import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function SharedLayout() {
  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-card)' }}>
      <Sidebar />
      <div className="main-content" style={{ 
        flex: 1, 
        backgroundColor: 'var(--bg-card)', 
        overflowY: 'auto', 
        height: '100vh',
        padding: '32px'
      }}>
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
