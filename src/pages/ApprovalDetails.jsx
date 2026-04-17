import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkflow } from '../context/WorkflowContext';

export default function ApprovalDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { requests, updateRequestStatus, showToast } = useWorkflow();

  const req = requests.find(r => r.id === id) || {
    id: id || 'PRJ-2026-004',
    projectId: 'PRJ-2026-004',
    projectName: 'อบรม Leadership Q3 2026',
    requestorName: 'วิภาวรรณ ใจดี',
    startDate: '13 เม.ย 2026',
    totalAmount: 3000
  };

  const handleApprove = () => {
    updateRequestStatus(req.id, 'Approved');
    showToast(`Project ID ${req.projectId} ได้รับการอนุมัติแล้ว`, 'success');
    navigate('/approvals');
  };

  const handleReject = () => {
    updateRequestStatus(req.id, 'Rejected');
    showToast(`Project ID ${req.projectId} ถูกตีกลับเรียบร้อย`, 'error');
    navigate('/approvals');
  };

  return (
    <div style={{ padding: '32px', backgroundColor: 'var(--bg-page)', minHeight: '100%', fontFamily: "'Inter', 'Prompt', sans-serif" }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          margin: 0, 
          paddingBottom: '8px', 
          borderBottom: '3px solid var(--border-color)', 
          display: 'inline-block',
          color: 'var(--text-main)'
        }}>
          รายละเอียดคำขออนุมัติ
        </h1>
        
        <button style={{ 
          backgroundColor: '#e5e7eb', 
          color: '#000', 
          border: 'none', 
          borderRadius: '8px', 
          padding: '8px 32px', 
          fontSize: '20px',
          fontWeight: '500',
          cursor: 'pointer'
        }}>
          สถานะ
        </button>
      </div>

      {/* Card 1: ข้อมูล */}
      <div style={{ 
        backgroundColor: 'var(--bg-card)', 
        border: '1px solid var(--border-color)', 
        borderRadius: '12px', 
        padding: '32px',
        marginBottom: '24px'
      }}>
        <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '32px', color: 'var(--text-main)' }}>ข้อมูล</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', rowGap: '32px', columnGap: '24px' }}>
          <div>
            <p style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-main)', margin: '0 0 8px 0' }}>รหัสโครงการ</p>
            <p style={{ fontSize: '16px', color: 'var(--text-main)', margin: 0 }}>{req.projectId}</p>
          </div>
          <div>
            <p style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-main)', margin: '0 0 8px 0' }}>ชื่อโครงการ</p>
            {/* Real requests might not have projectName yet so we mock conditionally */}
            <p style={{ fontSize: '16px', color: 'var(--text-main)', margin: 0 }}>{req.projectName || 'อบรม Leadership Q3 2026'}</p>
          </div>
          <div>
            <p style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-main)', margin: '0 0 8px 0' }}>ผู้เบิก</p>
            <p style={{ fontSize: '16px', color: 'var(--text-main)', margin: 0 }}>{req.requestorName}</p>
          </div>
          <div>
            <p style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-main)', margin: '0 0 8px 0' }}>วันที่ส่งคำขอ</p>
            <p style={{ fontSize: '16px', color: 'var(--text-main)', margin: 0 }}>{req.startDate || '13 เม.ย 2026'}</p>
          </div>
        </div>
      </div>

      {/* Card 2: รายละเอียด */}
      <div style={{ 
        backgroundColor: 'var(--bg-card)', 
        border: '1px solid var(--border-color)', 
        borderRadius: '12px', 
        padding: '32px',
        marginBottom: '64px'
      }}>
        <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '32px', color: 'var(--text-main)' }}>รายละเอียด</h2>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
              <th style={{ paddingBottom: '16px', fontWeight: 'bold', fontSize: '16px', color: 'var(--text-main)', width: '30%' }}>พนักงาน</th>
              <th style={{ paddingBottom: '16px', fontWeight: 'bold', fontSize: '16px', color: 'var(--text-main)', width: '40%' }}>รายละเอียดการเบิก</th>
              <th style={{ paddingBottom: '16px', fontWeight: 'bold', fontSize: '16px', color: 'var(--text-main)', width: '30%' }}>จำนวนเงิน</th>
            </tr>
          </thead>
          <tbody>
            {req.days && req.days.length > 0 ? (
              req.days.map((dayLine, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px 0', fontSize: '16px', color: 'var(--text-main)' }}>{req.requestorName}</td>
                  <td style={{ padding: '16px 0', fontSize: '16px', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>
                    <span>{dayLine.type}</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>วันที่: {dayLine.date}</span>
                  </td>
                  <td style={{ padding: '16px 0', fontSize: '16px', color: 'var(--text-main)' }}>
                    ฿{dayLine.amount ? dayLine.amount.toLocaleString() : '0'}
                  </td>
                </tr>
              ))
            ) : (
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px 0', fontSize: '16px', color: 'var(--text-main)' }}>{req.requestorName}</td>
                <td style={{ padding: '16px 0', fontSize: '16px', color: 'var(--text-main)' }}>ค่าวิทยากร / เบี้ยเลี้ยง (รายการรวม)</td>
                <td style={{ padding: '16px 0', fontSize: '16px', color: 'var(--text-main)' }}>
                  ฿{req.totalAmount ? req.totalAmount.toLocaleString() : '0'}
                </td>
              </tr>
            )}
            
            {/* Total Row */}
            <tr>
              <td style={{ padding: '24px 0 8px 0', fontSize: '16px', fontWeight: 'bold', color: 'var(--text-main)' }}>ยอดรวม</td>
              <td style={{ padding: '24px 0 8px 0', fontSize: '16px' }}></td>
              <td style={{ padding: '24px 0 8px 0', fontSize: '16px', fontWeight: 'bold', color: 'var(--text-main)' }}>
                ฿{req.totalAmount ? req.totalAmount.toLocaleString() : '0'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bottom Action Buttons - responsive */}
      <div className="approval-action-row">
        <button 
          onClick={handleReject}
          style={{
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-main)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '16px 0',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          ตีกลับ
        </button>
        <button 
          onClick={handleApprove}
          style={{
            backgroundColor: 'var(--text-main)',
            color: 'var(--bg-card)',
            border: 'none',
            borderRadius: '8px',
            padding: '16px 0',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          ยืนยันการอนุมัติ
        </button>
      </div>

      <style>{`
        .approval-action-row {
          display: flex;
          justify-content: center;
          gap: 32px;
          padding-bottom: 32px;
        }

        .approval-action-row button {
          width: 280px;
        }

        .approval-table-wrap {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        @media (max-width: 768px) {
          .approval-action-row {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
            padding: 0 0 32px 0;
          }

          .approval-action-row button {
            width: 100%;
            font-size: 16px;
            padding: 14px 0;
          }
        }
      `}</style>

    </div>
  );
}
