import React from 'react';
import { Download, TrendingDown, TrendingUp } from 'lucide-react';
import AllowanceTable from '../components/AllowanceTable';

export default function Reports() {
  return (
    <>
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>Reports</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Date range: Sept 01, 2024 - Sept 30, 2024</p>
        </div>
        <button className="hc-btn hc-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => alert('Export functionality to be implemented')}>
            <Download size={18} />
            Export to CSV
        </button>
      </div>
      
      <div className="summary-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '24px' }}>
        
        {/* Approved Request Card */}
        <div className="summary-card" style={{ backgroundColor: 'var(--card-bg, #fff)', border: '1px solid var(--border-color, #eee)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <p className="card-title" style={{ color: 'var(--text-muted)', fontWeight: '500', marginBottom: '16px' }}>Approved Request</p>
          <div className="card-data" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h3 className="card-value" style={{ margin: 0, fontSize: '32px', fontWeight: '700' }}>35</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Total Request</p>
            </div>
            <span className="card-trend" style={{ color: '#ef4444', backgroundColor: '#fee2e2', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingDown size={14} />
              -2.5% Than last month
            </span>
          </div>
        </div>

        {/* Pending Approvals Card */}
        <div className="summary-card" style={{ backgroundColor: 'var(--card-bg, #fff)', border: '1px solid var(--border-color, #eee)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <p className="card-title" style={{ color: 'var(--text-muted)', fontWeight: '500', marginBottom: '16px' }}>Pending Approvals</p>
          <div className="card-data" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
             <div>
              <h3 className="card-value" style={{ margin: 0, fontSize: '32px', fontWeight: '700' }}>12</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Total Request</p>
            </div>
            <span className="card-trend" style={{ color: '#10b981', backgroundColor: '#d1fae5', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={14} />
              +1.5% Than last month
            </span>
          </div>
        </div>

      </div>

      <AllowanceTable />
    </>
  );
}
