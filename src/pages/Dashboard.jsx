import React from 'react';
import SummaryCards from '../components/SummaryCards';
import ChartsSection from '../components/ChartsSection';
import AllowanceTable from '../components/AllowanceTable';
import { useWorkflow } from '../context/WorkflowContext';
import { AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const { currentUser, getAiAlerts } = useWorkflow();
  const alerts = getAiAlerts();

  return (
    <>
      <div className="dashboard-header" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>ภาพรวมและข้อมูลสรุป</p>
      </div>
      
      {alerts.length > 0 && currentUser?.role === 'HR' && (
        <div style={{ backgroundColor: '#fee2e2', border: '1px solid #ef4444', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b91c1c', fontWeight: 'bold' }}>
            <AlertTriangle size={20} />
            <span>AI Alerts (Manday Anomaly)</span>
          </div>
          <ul style={{ margin: 0, paddingLeft: '24px', color: '#b91c1c' }}>
            {alerts.map((a, idx) => (
              <li key={idx}>{a.message}</li>
            ))}
          </ul>
        </div>
      )}

      <SummaryCards />
      <ChartsSection />
      <AllowanceTable />
    </>
  );
}
