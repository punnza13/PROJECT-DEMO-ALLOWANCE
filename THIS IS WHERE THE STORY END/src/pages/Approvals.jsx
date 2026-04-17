import React from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { Check, X } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

export default function Approvals() {
  const { requests, updateRequestStatus, currentUser } = useWorkflow();
  const navigate = useNavigate();

  const pendingRequests = requests.filter(r => r.status === 'Pending');

  return (
    <div style={{ backgroundColor: 'var(--bg-card)', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>Pending Approvals (UC02)</h2>
      
      {pendingRequests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          No pending requests at the moment.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '12px', color: 'var(--text-muted)' }}>ID</th>
                <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Project</th>
                <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Requestor</th>
                <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Mandays</th>
                <th style={{ padding: '12px', color: 'var(--text-muted)' }}>Amount (THB)</th>
                <th style={{ padding: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.map(req => (
                <tr 
                  key={req.id} 
                  style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}
                  onClick={() => navigate(`/approvals/${req.id}`)}
                  className="clickable-row"
                >
                  <td style={{ padding: '12px', fontWeight: '500' }}>{req.id}</td>
                  <td style={{ padding: '12px' }}>{req.projectId}</td>
                  <td style={{ padding: '12px' }}>{req.requestorName}</td>
                  <td style={{ padding: '12px' }}>{req.totalManday}</td>
                  <td style={{ padding: '12px', color: 'var(--accent-color)', fontWeight: 'bold' }}>{req.totalAmount.toLocaleString()}</td>
                  <td style={{ padding: '12px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); updateRequestStatus(req.id, 'Approved'); }}
                      title="Approve"
                      style={{ padding: '6px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '6px', display: 'flex', cursor: 'pointer', border: 'none' }}>
                      <Check size={18} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); updateRequestStatus(req.id, 'Rejected'); }}
                      title="Reject"
                      style={{ padding: '6px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px', display: 'flex', cursor: 'pointer', border: 'none' }}>
                      <X size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
